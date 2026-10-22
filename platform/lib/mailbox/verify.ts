// MailOrderVerifier (G192): confirms an Etsy order from the shop's own mailbox — Etsy's "You made a sale" email — until
// the Etsy app connection (lib/etsy) is there. Used by trust mode (lib/claim/verify.ts TrustOrderVerifier, after Etsy)
// and its hourly check (lib/claim/trust.ts).
//
//   mailbox not set up                      -> pending (as if nothing was found; never a 500)
//   a signed Etsy cancellation / refund mail -> rejected not_paid
//   a signed Etsy sale mail for this order  -> verified (one website: a mail does not tell how many designs reliably)
//   nothing (yet)                           -> pending (the mail may still be on its way; "not found" decides nothing)
//   IMAP down / wrong password / timeout    -> unavailable
// The rules for what counts: lib/mailbox/orders.ts.

import type { OrderCheck, OrderCheckInput, OrderVerifier } from '../claim/verify.ts';
import { maskAddress } from '../mail/index.ts';
import { mailboxSetup } from './config.ts';
import { ImapOrderMailbox, mailboxErrorCode, type OrderMailbox } from './imap.ts';
import { judgeOrderMails } from './orders.ts';

/** One look-up may take this long (IMAP sign-in + search + a few mails) before /start goes on without it. */
export const MAIL_CHECK_TIMEOUT_MS = 12_000;

export class MailOrderVerifier implements OrderVerifier {
  readonly kind = 'mail';
  readonly #open: () => OrderMailbox | null;
  readonly #keepOpen: boolean;
  #box: OrderMailbox | null = null;

  /**
   * `mailbox`: a factory (tests); default: IMAP from the env, null when not set up. `keepOpen`: one connection for many
   * checks (the hourly sweep) — the caller then calls close().
   */
  constructor(opts: { mailbox?: () => OrderMailbox | null; keepOpen?: boolean } = {}) {
    this.#open =
      opts.mailbox ??
      (() => {
        const s = mailboxSetup();
        return s.state === 'ready' ? new ImapOrderMailbox(s.config) : null;
      });
    this.#keepOpen = opts.keepOpen ?? false;
  }

  async check(input: OrderCheckInput): Promise<OrderCheck> {
    const box = this.#box ?? this.#open();
    if (!box) return { result: 'pending' };
    this.#box = box;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const mails = await Promise.race([
        box.find(input.orderNumber),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), MAIL_CHECK_TIMEOUT_MS);
        }),
      ]);
      const v = judgeOrderMails(mails, input.orderNumber);
      if (v.cancelled) return { result: 'rejected', reason: 'not_paid' };
      return v.sale ? { result: 'verified' } : { result: 'pending' };
    } catch (e) {
      console.error(`[mailbox] order check unavailable: ${mailboxErrorCode(e)}`);
      await this.close(); // a broken connection is not reused
      return { result: 'unavailable' };
    } finally {
      clearTimeout(timer);
      if (!this.#keepOpen) await this.close();
    }
  }

  async close(): Promise<void> {
    const box = this.#box;
    this.#box = null;
    if (box) await box.close().catch(() => undefined);
  }
}

/** Admin "Gelen kutusunu dene": signs in, counts Etsy mails of the last 30 days. Throws MailboxError (safe code). */
export async function testOrderMailbox(): Promise<{ etsyMails: number }> {
  const s = mailboxSetup();
  if (s.state !== 'ready') throw Object.assign(new Error('not configured'), { code: 'NOT_CONFIGURED' });
  const box = new ImapOrderMailbox(s.config);
  try {
    return { etsyMails: await box.recentCount(30) };
  } finally {
    await box.close();
  }
}

export interface MailboxStatus {
  enabled: boolean;
  /** Env NAMES that are missing. */
  missing: string[];
  /** The mailbox, partly hidden ("sh***@gmail.com"); null when off. */
  user: string | null;
  /** The sign-in is ORDER_MAIL_* or the Gmail SMTP one. */
  source: 'order_mail' | 'smtp' | null;
}

export function mailboxStatus(env: Record<string, string | undefined> = process.env): MailboxStatus {
  const s = mailboxSetup(env);
  if (s.state !== 'ready') return { enabled: false, missing: s.missing, user: null, source: null };
  return { enabled: true, missing: [], user: maskAddress(s.config.user), source: s.config.source };
}
