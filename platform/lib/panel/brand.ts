// Shop name and support address as the panel shows them (G060, docs/16 §13.3), read from the ONE brand
// configuration (lib/marketing/config.ts, G061). K33 (2026-10-15): BKE Studio / bkestudio@gmail.com. An undecided
// value there stays a visible placeholder ("[…]"); nothing is invented here.

import { MARKETING } from '../marketing/config.ts';

export const PANEL_BRAND = {
  /** Shown as "message BKE Studio on Etsy". */
  shopName: MARKETING.etsy.shopName,
  /** Support e-mail address. */
  supportEmail: MARKETING.support.email,
} as const;

/** Publishing while the shop has not confirmed the Etsy order yet (CLAIM_ORDER_VERIFICATION=manual, G060-fix). */
export const ORDER_PENDING_TEXT = `We are still confirming your Etsy order. Your changes are saved; you can publish as soon as the order is confirmed. Questions? Message ${PANEL_BRAND.shopName} on Etsy with your order number.`;

/** True while a value is still a "[PLACEHOLDER]" (then it is shown as text, never as a mailto: link). */
export function isPlaceholder(value: string): boolean {
  return /^\[[^\]]+\]$/.test(value);
}
