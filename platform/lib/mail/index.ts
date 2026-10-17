// Email sending (G147): the SMTP EditLinkMailer (lib/claim/mailer.ts interface), the shop notice for pending orders and
// the admin's test email. Chosen by env (lib/mail/config.ts): with SMTP_HOST + SMTP_USER + SMTP_PASS set,
// getEditLinkMailer() returns an enabled SmtpEditLinkMailer (so /start says "we emailed your link"); without them
// nothing is sent and nothing changes.
//
// Privacy: no message text, link or address is ever logged. A failure logs "[mail] <what>: <code>" only (EAUTH …), and
// never fails the action that triggered it (the claim succeeds, the link is on screen).

import { createHash } from 'node:crypto';
import type { EditLinkMailer, EditLinkMessage } from '../claim/mailer.ts';
import { mailSetup, type SmtpConfig } from './config.ts';
import { createdEmail, pendingOrderEmail, rsvpReplyEmail, signinEmail, testEmail, type MailContent, type PendingOrderNotice, type RsvpReplyNotice } from './templates.ts';
import { MailSendError, SmtpTransport, toMailSendError, type MailTransport } from './transport.ts';

export { MailSendError } from './transport.ts';
export type { MailTransport, OutgoingMail } from './transport.ts';

/** The buyer's email for a message: 'created' (default, after /start) or 'signin' (a link asked for on /my). */
export function editLinkContent(m: EditLinkMessage): MailContent {
  return (m as { kind?: string }).kind === 'signin' ? signinEmail(m) : createdEmail(m);
}

export class SmtpEditLinkMailer implements EditLinkMailer {
  readonly enabled = true;
  readonly #transport: MailTransport;
  constructor(transport: MailTransport) {
    this.#transport = transport;
  }

  async send(message: EditLinkMessage): Promise<{ sent: boolean }> {
    const c = editLinkContent(message);
    try {
      await this.#transport.send({ to: message.to, subject: c.subject, text: c.text, html: c.html });
      return { sent: true };
    } catch (e) {
      const err = toMailSendError(e);
      console.error(`[mail] edit link (${(message as { kind?: string }).kind === 'signin' ? 'signin' : 'created'}): ${err.code}${err.responseCode ? ` ${err.responseCode}` : ''}`);
      return { sent: false };
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Shop notices

export interface ShopNotifier {
  readonly enabled: boolean;
  /** A claim ended "pending": the shop has to check the order. Never throws. */
  pendingOrder(notice: PendingOrderNotice): Promise<{ sent: boolean }>;
}

export class DisabledShopNotifier implements ShopNotifier {
  readonly enabled = false;
  async pendingOrder(): Promise<{ sent: boolean }> {
    return { sent: false };
  }
}

export class SmtpShopNotifier implements ShopNotifier {
  readonly enabled = true;
  readonly #transport: MailTransport;
  readonly #to: string;
  constructor(transport: MailTransport, to: string) {
    this.#transport = transport;
    this.#to = to;
  }

  async pendingOrder(notice: PendingOrderNotice): Promise<{ sent: boolean }> {
    const c = pendingOrderEmail(notice);
    try {
      await this.#transport.send({ to: this.#to, subject: c.subject, text: c.text, html: c.html });
      return { sent: true };
    } catch (e) {
      const err = toMailSendError(e);
      console.error(`[mail] shop notice: ${err.code}${err.responseCode ? ` ${err.responseCode}` : ''}`);
      return { sent: false };
    }
  }
}

// ---------------------------------------------------------------------------------------------
// G152: "Email me when a guest replies" — to the couple (lib/rsvp/notify.ts decides when)

export type { RsvpReplyNotice } from './templates.ts';

export interface RsvpNotifier {
  /** False without SMTP: the panel does not offer the switch. */
  readonly enabled: boolean;
  /** Never throws; `to` is the site's owner email on record. */
  reply(to: string, notice: RsvpReplyNotice): Promise<{ sent: boolean }>;
}

export class DisabledRsvpNotifier implements RsvpNotifier {
  readonly enabled = false;
  async reply(): Promise<{ sent: boolean }> {
    return { sent: false };
  }
}

export class SmtpRsvpNotifier implements RsvpNotifier {
  readonly enabled = true;
  readonly #transport: MailTransport;
  constructor(transport: MailTransport) {
    this.#transport = transport;
  }

  async reply(to: string, notice: RsvpReplyNotice): Promise<{ sent: boolean }> {
    const c = rsvpReplyEmail(notice);
    try {
      await this.#transport.send({ to, subject: c.subject, text: c.text, html: c.html });
      return { sent: true };
    } catch (e) {
      const err = toMailSendError(e);
      console.error(`[mail] rsvp notice: ${err.code}${err.responseCode ? ` ${err.responseCode}` : ''}`);
      return { sent: false };
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Env choice (cached per configuration; tests reset with setMailTransportFactory)

type TransportFactory = (cfg: SmtpConfig) => MailTransport;
let factory: TransportFactory = (cfg) => new SmtpTransport(cfg);
let cache: { key: string; mailer: SmtpEditLinkMailer; notifier: SmtpShopNotifier; rsvp: SmtpRsvpNotifier; transport: MailTransport } | null = null;

/** Tests: build transports with a fake (null restores SMTP). */
export function setMailTransportFactory(f: TransportFactory | null): void {
  factory = f ?? ((cfg) => new SmtpTransport(cfg));
  cache = null;
}

function configured(env: Record<string, string | undefined> = process.env) {
  const setup = mailSetup(env);
  if (setup.state !== 'ready') return null;
  const c = setup.config;
  // The cache key never holds the password itself (a hash of it: a changed password builds a new transport).
  const key = JSON.stringify([c.host, c.port, c.secure, c.user, c.from, c.notifyTo, createHash('sha256').update(c.pass).digest('hex')]);
  if (!cache || cache.key !== key) {
    const transport = factory(c);
    cache = { key, transport, mailer: new SmtpEditLinkMailer(transport), notifier: new SmtpShopNotifier(transport, c.notifyTo), rsvp: new SmtpRsvpNotifier(transport) };
  }
  return { config: c, ...cache };
}

/** The env-selected buyer mailer, or null when SMTP is not configured (lib/claim/mailer.ts falls back to DisabledMailer). */
export function envEditLinkMailer(env: Record<string, string | undefined> = process.env): EditLinkMailer | null {
  return configured(env)?.mailer ?? null;
}

let notifierOverride: ShopNotifier | null = null;

export function getShopNotifier(): ShopNotifier {
  return notifierOverride ?? configured()?.notifier ?? new DisabledShopNotifier();
}

/** Tests: a fake notifier (null restores the env choice). */
export function setShopNotifier(n: ShopNotifier | null): void {
  notifierOverride = n;
}

let rsvpOverride: RsvpNotifier | null = null;

/** The couple's reply emails: SMTP when configured, else off (G152). */
export function getRsvpNotifier(): RsvpNotifier {
  return rsvpOverride ?? configured()?.rsvp ?? new DisabledRsvpNotifier();
}

/** Tests: a fake notifier (null restores the env choice). */
export function setRsvpNotifier(n: RsvpNotifier | null): void {
  rsvpOverride = n;
}

// ---------------------------------------------------------------------------------------------
// Admin

export interface MailStatus {
  enabled: boolean;
  /** Env NAMES that are missing. */
  missing: string[];
  /** Where shop notices and the test email go, partly hidden ("sh***@example.com"); null when off. */
  notifyTo: string | null;
}

/** "shop@example.com" -> "sh***@example.com" (the admin page never shows the full configured address). */
export function maskAddress(a: string): string {
  const at = a.lastIndexOf('@');
  if (at < 1) return '***';
  return `${a.slice(0, Math.min(2, at))}***${a.slice(at)}`;
}

export function mailStatus(env: Record<string, string | undefined> = process.env): MailStatus {
  const setup = mailSetup(env);
  if (setup.state !== 'ready') return { enabled: false, missing: setup.missing, notifyTo: null };
  return { enabled: true, missing: [], notifyTo: maskAddress(setup.config.notifyTo) };
}

/** Admin "Test e-postası gönder": to the shop's own address. Throws MailSendError (safe code) or when not configured. */
export async function sendTestEmail(adminUrl: string): Promise<void> {
  const c = configured();
  if (!c) throw new MailSendError('NOT_CONFIGURED', null);
  const m = testEmail(adminUrl);
  try {
    await c.transport.send({ to: c.config.notifyTo, subject: m.subject, text: m.text, html: m.html });
  } catch (e) {
    const err = toMailSendError(e);
    console.error(`[mail] test email: ${err.code}${err.responseCode ? ` ${err.responseCode}` : ''}`);
    throw err;
  }
}
