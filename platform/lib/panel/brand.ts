// Shop name and support address as the panel shows them (G060, docs/16 §13.3), read from the ONE brand
// configuration (lib/marketing/config.ts, G061). Not decided yet (K25/K26): the values there are visible
// placeholders ("[SHOP NAME]", "[SUPPORT EMAIL]") until the owner decides; nothing is invented here.

import { MARKETING } from '../marketing/config.ts';

export const PANEL_BRAND = {
  /** Shown as "message [SHOP NAME] on Etsy". */
  shopName: MARKETING.etsy.shopName,
  /** Support e-mail address. */
  supportEmail: MARKETING.support.email,
} as const;

/** True while a value is still a "[PLACEHOLDER]" (then it is shown as text, never as a mailto: link). */
export function isPlaceholder(value: string): boolean {
  return /^\[[^\]]+\]$/.test(value);
}
