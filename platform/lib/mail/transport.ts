// How an email leaves the server (G147): one small interface, the SMTP implementation with nodemailer, and safe errors.
// Tests use a fake MailTransport (or nodemailer's JSON transport) — nothing reaches a real server.

import type { SmtpConfig } from './config.ts';

export interface OutgoingMail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface MailTransport {
  send(mail: OutgoingMail): Promise<void>;
}

/**
 * A failed send without anything private: nodemailer's error code (EAUTH, ECONNECTION, ETIMEDOUT, EENVELOPE …) and the
 * SMTP reply code. Never the server's reply text (it can quote the recipient), the message, a link or a password.
 */
export class MailSendError extends Error {
  readonly code: string;
  readonly responseCode: number | null;
  constructor(code: string, responseCode: number | null) {
    super(`mail ${code}${responseCode ? ` (${responseCode})` : ''}`);
    this.name = 'MailSendError';
    this.code = code;
    this.responseCode = responseCode;
  }
}

export function toMailSendError(e: unknown): MailSendError {
  if (e instanceof MailSendError) return e;
  const raw = e && typeof e === 'object' ? (e as { code?: unknown; responseCode?: unknown }) : {};
  const code = typeof raw.code === 'string' && /^[A-Z][A-Z_]{1,30}$/.test(raw.code) ? raw.code : 'ESEND';
  const responseCode = typeof raw.responseCode === 'number' && raw.responseCode >= 200 && raw.responseCode < 600 ? raw.responseCode : null;
  return new MailSendError(code, responseCode);
}

/** SMTP with nodemailer (loaded on first send). One short-lived connection per message: fine for the shop's volume. */
export class SmtpTransport implements MailTransport {
  readonly #cfg: SmtpConfig;
  constructor(cfg: SmtpConfig) {
    this.#cfg = cfg;
  }

  async send(mail: OutgoingMail): Promise<void> {
    const cfg = this.#cfg;
    try {
      const { createTransport } = await import('nodemailer');
      const transporter = createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        requireTLS: !cfg.secure,
        auth: { user: cfg.user, pass: cfg.pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
        // nodemailer's own logging stays off: it would print addresses and the message.
        logger: false,
        debug: false,
      });
      try {
        await transporter.sendMail({ from: cfg.from, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html });
      } finally {
        transporter.close();
      }
    } catch (e) {
      throw toMailSendError(e);
    }
  }
}
