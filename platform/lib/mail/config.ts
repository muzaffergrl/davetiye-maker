// Email sending settings (G147). Plain SMTP (nodemailer), so a Gmail account with an app password works; any other
// SMTP service does too. Off until the three required names are set — nothing changes before that.
//
//   SMTP_HOST            e.g. smtp.gmail.com                                        (required)
//   SMTP_USER            the account that signs in (Gmail: the full address)       (required)
//   SMTP_PASS            its password (Gmail: a 16-letter APP PASSWORD, not the account password; spaces are fine) (required)
//   SMTP_PORT            465 (default, TLS from the start) or 587 (STARTTLS)
//   SMTP_SECURE          optional "true" / "false" to override what the port implies
//   MAIL_FROM            the sender shown to buyers; default "<brand> <SMTP_USER>" (Gmail sends from the signed-in account)
//   ADMIN_NOTIFY_EMAIL   where shop notices go ("New website started — order needs a check"); default SMTP_USER
//
// Values are never logged, never sent to a browser; the admin only sees "on / not configured" and the missing NAMES.

import { MARKETING } from '../marketing/config.ts';

export interface SmtpConfig {
  host: string;
  port: number;
  /** true: TLS from the first byte (465). false: STARTTLS is required (587). */
  secure: boolean;
  user: string;
  pass: string;
  /** From header. */
  from: string;
  /** Shop notices go here. */
  notifyTo: string;
}

export type MailSetup = { state: 'ready'; config: SmtpConfig } | { state: 'missing'; missing: string[] };

/** A Gmail app password as Google shows it ("abcd efgh ijkl mnop"): the spaces are not part of it. */
export function cleanPass(raw: string): string {
  const t = raw.trim();
  return /^[a-z]{4}( [a-z]{4}){3}$/i.test(t) ? t.replace(/ /g, '') : t;
}

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export function mailSetup(env: Record<string, string | undefined> = process.env, brand: string = MARKETING.brand.name): MailSetup {
  const host = (env.SMTP_HOST ?? '').trim();
  const user = (env.SMTP_USER ?? '').trim();
  const pass = cleanPass(env.SMTP_PASS ?? '');
  const missing: string[] = [];
  if (!host) missing.push('SMTP_HOST');
  if (!user) missing.push('SMTP_USER');
  if (!pass) missing.push('SMTP_PASS');
  if (missing.length) return { state: 'missing', missing };
  const portText = (env.SMTP_PORT ?? '').trim();
  const port = /^\d{2,5}$/.test(portText) ? Number(portText) : 465;
  const secureText = (env.SMTP_SECURE ?? '').trim().toLowerCase();
  const secure = secureText === 'true' ? true : secureText === 'false' ? false : port === 465;
  const from = (env.MAIL_FROM ?? '').trim() || (EMAIL_RE.test(user) ? `"${brand.replace(/"/g, '')}" <${user}>` : user);
  const notify = (env.ADMIN_NOTIFY_EMAIL ?? '').trim();
  return { state: 'ready', config: { host, port, secure, user, pass, from, notifyTo: EMAIL_RE.test(notify) ? notify : user } };
}

export function smtpConfig(env: Record<string, string | undefined> = process.env): SmtpConfig | null {
  const s = mailSetup(env);
  return s.state === 'ready' ? s.config : null;
}
