// Gmail over IMAP (G192, imapflow): finds the mails of one order number in the shop's mailbox. One connection serves
// many look-ups (the hourly sweep) and is closed by close(). Read-only: the mailbox is opened read-only, nothing is
// moved, flagged or marked read. Nothing from a mail (address, subject, text) is ever logged; a failure logs its code.
//
// Look-up: Gmail's own search (X-GM-RAW) in "All Mail" (archived mails too; not Spam / Trash):
//   from:etsy.com "<number>"   -> at most MAX_MAILS newest hits -> From, subject, Authentication-Results, plain text
// orders.ts then decides what the mails say.

import { ImapFlow } from 'imapflow';
import type { MailboxConfig } from './config.ts';
import { authResultsOf, htmlToText, type OrderMail } from './orders.ts';

export interface OrderMailbox {
  /** Etsy mails that mention this order number (newest first). Throws MailboxError. */
  find(orderNumber: string): Promise<OrderMail[]>;
  /** Etsy mails of the last `days` days (admin "test the mailbox"): how many, how many are signed sale mails. */
  recentCount?(days: number): Promise<number>;
  close(): Promise<void>;
}

export class MailboxError extends Error {
  readonly code: string;
  constructor(code: string) {
    super(`order mailbox: ${code}`);
    this.name = 'MailboxError';
    this.code = code;
  }
}

/** Machine code of an imapflow / network failure (never its text: it can quote the server). */
export function mailboxErrorCode(e: unknown): string {
  if (e instanceof MailboxError) return e.code;
  const err = e as { authenticationFailed?: boolean; code?: unknown; serverResponseCode?: unknown };
  if (err?.authenticationFailed || err?.serverResponseCode === 'AUTHENTICATIONFAILED') return 'EAUTH';
  if (typeof err?.code === 'string' && /^[A-Z_]{3,40}$/.test(err.code)) return err.code;
  return 'EIMAP';
}

const MAX_MAILS = 10;
const MAX_TEXT = 200_000;

export class ImapOrderMailbox implements OrderMailbox {
  readonly #cfg: MailboxConfig;
  #client: ImapFlow | null = null;
  #release: (() => void) | null = null;

  constructor(cfg: MailboxConfig) {
    this.#cfg = cfg;
  }

  async #open(): Promise<ImapFlow> {
    if (this.#client?.usable) return this.#client;
    const client = new ImapFlow({
      host: this.#cfg.host,
      port: this.#cfg.port,
      secure: this.#cfg.secure ?? true,
      auth: { user: this.#cfg.user, pass: this.#cfg.pass },
      logger: false,
      connectionTimeout: 8_000,
      greetingTimeout: 5_000,
      socketTimeout: 20_000,
    });
    client.on('error', () => undefined); // a dropped socket surfaces as a failed command; never crash the function
    try {
      await client.connect();
      const boxes = await client.list();
      const all = boxes.find((b) => b.specialUse === '\\All')?.path;
      if (!all) throw new MailboxError('NO_ALL_MAIL'); // not Gmail, or "All Mail" hidden from IMAP in Gmail's settings
      const lock = await client.getMailboxLock(all, { readOnly: true });
      this.#client = client;
      this.#release = () => lock.release();
      return client;
    } catch (e) {
      await client.logout().catch(() => undefined);
      throw e instanceof MailboxError ? e : new MailboxError(mailboxErrorCode(e));
    }
  }

  async #uids(query: string): Promise<number[]> {
    const client = await this.#open();
    try {
      const found = await client.search({ gmraw: query }, { uid: true });
      return Array.isArray(found) ? found : [];
    } catch (e) {
      throw new MailboxError(mailboxErrorCode(e));
    }
  }

  async find(orderNumber: string): Promise<OrderMail[]> {
    if (!/^\d{1,20}$/.test(orderNumber)) return [];
    const uids = (await this.#uids(`from:etsy.com "${orderNumber}"`)).sort((a, b) => b - a).slice(0, MAX_MAILS);
    if (!uids.length) return [];
    const client = await this.#open();
    try {
      const heads: Array<{ uid: number; from: string; subject: string; auth: string[]; part: string | null; html: boolean }> = [];
      // Collect first: imapflow does not allow another command (download) while a fetch is being read.
      for await (const msg of client.fetch(uids, { uid: true, envelope: true, headers: ['authentication-results'], bodyStructure: true }, { uid: true })) {
        const part = textPart(msg.bodyStructure);
        heads.push({
          uid: msg.uid,
          from: msg.envelope?.from?.[0]?.address ?? '',
          subject: msg.envelope?.subject ?? '',
          auth: authResultsOf(msg.headers?.toString('utf8') ?? ''),
          part: part?.id ?? null,
          html: part?.html ?? false,
        });
      }
      const out: OrderMail[] = [];
      for (const h of heads) {
        let text = '';
        if (h.part) {
          const { content } = await client.download(String(h.uid), h.part, { uid: true, maxBytes: MAX_TEXT });
          const chunks: Buffer[] = [];
          if (content) for await (const c of content) chunks.push(Buffer.from(c));
          text = Buffer.concat(chunks).toString('utf8');
          if (h.html) text = htmlToText(text);
        }
        out.push({ from: h.from, subject: h.subject, authResults: h.auth, text });
      }
      return out;
    } catch (e) {
      throw e instanceof MailboxError ? e : new MailboxError(mailboxErrorCode(e));
    }
  }

  async recentCount(days: number): Promise<number> {
    return (await this.#uids(`from:etsy.com newer_than:${Math.max(1, Math.floor(days))}d`)).length;
  }

  async close(): Promise<void> {
    const client = this.#client;
    this.#client = null;
    this.#release?.();
    this.#release = null;
    if (client) await client.logout().catch(() => undefined);
  }
}

type Structure = { part?: string; type?: string; childNodes?: Structure[]; disposition?: string };

/** The text/plain part (else text/html) of a body structure; attachments are skipped. */
export function textPart(node: Structure | undefined): { id: string; html: boolean } | null {
  let html: { id: string; html: boolean } | null = null;
  const walk = (n: Structure | undefined): { id: string; html: boolean } | null => {
    if (!n) return null;
    if (n.childNodes?.length) {
      for (const c of n.childNodes) {
        const hit = walk(c);
        if (hit) return hit;
      }
      return null;
    }
    if ((n.disposition ?? '').toLowerCase() === 'attachment') return null;
    const type = (n.type ?? '').toLowerCase();
    const id = n.part ?? '1';
    if (type === 'text/plain') return { id, html: false };
    if (type === 'text/html' && !html) html = { id, html: true };
    return null;
  };
  return walk(node) ?? html;
}
