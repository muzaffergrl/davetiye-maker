// Order mailbox settings (G192): the Gmail inbox that receives Etsy's "You made a sale" emails, read over IMAP with an
// app password (lib/mailbox/imap.ts). Off until set — nothing changes before that.
//
//   ORDER_MAIL_USER   the Gmail address the Etsy shop's notifications go to                         (required)
//   ORDER_MAIL_PASS   a 16-letter Gmail APP PASSWORD of that account (not the account password)       (required)
//   ORDER_MAIL_HOST   default imap.gmail.com (the search uses Gmail's X-GM-RAW, so it must be Gmail)
//   ORDER_MAIL_PORT   default 993 (TLS)
//
// Without ORDER_MAIL_USER / ORDER_MAIL_PASS the SMTP sign-in is used when it is a Gmail one (SMTP_HOST smtp.gmail.com):
// one app password then sends the emails and reads the order mails. Values are never logged or sent to a browser.

import { cleanPass } from '../mail/config.ts';

export interface MailboxConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  /** Where the sign-in came from (the admin says which). */
  source: 'order_mail' | 'smtp';
  /** TLS from the first byte (always from the env; false only for the local test server). */
  secure?: boolean;
}

export type MailboxSetup = { state: 'ready'; config: MailboxConfig } | { state: 'missing'; missing: string[] };

export function mailboxSetup(env: Record<string, string | undefined> = process.env): MailboxSetup {
  const host = (env.ORDER_MAIL_HOST ?? '').trim() || 'imap.gmail.com';
  const portText = (env.ORDER_MAIL_PORT ?? '').trim();
  const port = /^\d{2,5}$/.test(portText) ? Number(portText) : 993;
  const user = (env.ORDER_MAIL_USER ?? '').trim();
  const pass = cleanPass(env.ORDER_MAIL_PASS ?? '');
  if (user && pass) return { state: 'ready', config: { host, port, user, pass, source: 'order_mail' } };
  const smtpUser = (env.SMTP_USER ?? '').trim();
  const smtpPass = cleanPass(env.SMTP_PASS ?? '');
  if (!user && !pass && (env.SMTP_HOST ?? '').trim().toLowerCase() === 'smtp.gmail.com' && smtpUser && smtpPass) {
    return { state: 'ready', config: { host, port, user: smtpUser, pass: smtpPass, source: 'smtp' } };
  }
  return { state: 'missing', missing: [...(user ? [] : ['ORDER_MAIL_USER']), ...(pass ? [] : ['ORDER_MAIL_PASS'])] };
}
