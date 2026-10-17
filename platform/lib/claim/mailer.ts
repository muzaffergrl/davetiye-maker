// Sending the edit link by email after /start (G045) — an interface point, NOT IMPLEMENTED.
//
// docs/10 §3: the email provider is chosen later. Until then the link is only shown on screen with a
// "Save this link" warning (and a mailto: button that opens the buyer's own mail app), and the
// owner's address is stored with the site (owner_email) so it can be used once sending exists.
//
// TODO(email provider, docs/10 §3): implement EditLinkMailer for the chosen provider (transactional
// email API from the server; never put the link in logs), register it with setEditLinkMailer() at
// startup or select it by env, and set `enabled = true`. The /start page then tells the buyer the
// link was emailed. A failed send must not fail the claim: the site exists, the link is on screen.

export interface EditLinkMessage {
  to: string;
  /** Secret: whoever has it can edit the site. */
  editUrl: string;
  /** Public address (works after the first Publish). */
  siteUrl: string;
  themeName: string;
  orderNumber: string;
  /**
   * G146: "created" (default) = the link right after /start; "signin" = a sign-in link asked for on /my ("Email me a
   * sign-in link"): `editUrl` then opens the editor with a new device key for that device.
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

let current: EditLinkMailer = new DisabledMailer();

export function getEditLinkMailer(): EditLinkMailer {
  return current;
}

/** Registers a mailer (provider later; fakes in tests). null restores the disabled default. */
export function setEditLinkMailer(mailer: EditLinkMailer | null): void {
  current = mailer ?? new DisabledMailer();
}
