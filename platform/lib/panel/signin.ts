// E-mail sign-in ("magic link", G060, docs/16 §12) — the interface only. There is no e-mail provider yet,
// so the default mailer is DISABLED: no form is shown anywhere, POST /api/signin answers 503 "unavailable"
// and the panel says so honestly. The edit link stays the way to open the editor.
//
// When a provider is chosen (owner decision), an enabled mailer is registered with setSignInMailer() and the
// rest of §12.2 is built (32-byte tokens stored as SHA-256 only, 15 minutes, single use, an interstitial page
// that spends the token by POST, a __Host- session cookie, an owner index in the adapter). Not built yet.
// No Node imports: the panel bundles the text below.

import { PANEL_BRAND } from './brand.ts';

/** Shown wherever sign-in by e-mail would be (lost-link page, Share, /signin). */
export const SIGN_IN_UNAVAILABLE = `Email sign-in isn't available yet. Open your editor with the edit link you saved. Lost it? Message ${PANEL_BRAND.shopName} on Etsy with your order number.`;

export interface SignInMailer {
  readonly enabled: boolean;
  /** Sends one sign-in link. Must never log the link. */
  sendSignInLink(to: string, link: string): Promise<void>;
}

export class DisabledSignInMailer implements SignInMailer {
  readonly enabled = false;
  async sendSignInLink(): Promise<void> {
    throw new Error('email sign-in is not available');
  }
}

let mailer: SignInMailer = new DisabledSignInMailer();

export function getSignInMailer(): SignInMailer {
  return mailer;
}

/** Tests / a future provider. */
export function setSignInMailer(next: SignInMailer | null): void {
  mailer = next ?? new DisabledSignInMailer();
}
