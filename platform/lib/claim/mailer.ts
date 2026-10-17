// Sending the edit link by email (G045 interface, G147 implementation).
//
// With SMTP configured (lib/mail/config.ts: SMTP_HOST, SMTP_USER, SMTP_PASS — a Gmail app password works) the
// env-selected SmtpEditLinkMailer (lib/mail/index.ts) is enabled: /start tells the buyer the link was emailed, and the
// private link + "continue on any device at <origin>/my" goes to the address they typed. Without SMTP nothing is sent:
// the link is only shown on screen with a "Save this link" warning (and a mailto: button that opens the buyer's own mail
// app), and the owner's address is stored with the site (owner_email).
// A failed send never fails the claim (the site exists, the link is on screen) and never puts the link, the address or
// the message in a log.

import { envEditLinkMailer } from '../mail/index.ts';

export interface EditLinkMessage {
  to: string;
  /** Secret: whoever has it can edit the site. ('signin': the sign-in link asked for on /my.) */
  editUrl: string;
  /** Public address (works after the first Publish). */
  siteUrl: string;
  themeName: string;
  orderNumber: string;
  /**
   * Which email: 'created' (default) right after /start — the private edit link and how to continue on another device;
   * 'signin' — a sign-in link the buyer asked for on /my.
   */
  kind?: 'created' | 'signin';
}

export interface EditLinkMailer {
  /** False while no provider is configured: the UI says the link is not emailed. */
  readonly enabled: boolean;
  send(message: EditLinkMessage): Promise<{ sent: boolean }>;
}

/** Default: nothing is sent. */
export class DisabledMailer implements EditLinkMailer {
  readonly enabled = false;
  async send(): Promise<{ sent: boolean }> {
    return { sent: false };
  }
}

let override: EditLinkMailer | null = null;
const disabled = new DisabledMailer();

/** The registered mailer (tests), else the env choice: SMTP when configured, else DisabledMailer. */
export function getEditLinkMailer(): EditLinkMailer {
  return override ?? envEditLinkMailer() ?? disabled;
}

/** Registers a mailer (fakes in tests). null restores the env choice. */
export function setEditLinkMailer(mailer: EditLinkMailer | null): void {
  override = mailer;
}
