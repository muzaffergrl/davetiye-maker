// Shop name and support address as the panel shows them (G060, docs/16 §13.3).
// NOT DECIDED YET (K25): the values stay visible placeholders until the owner decides; nothing is invented.
// The single brand configuration is lib/marketing/config.ts (G061, docs/14 §10); once it is on main this
// file should read from it instead of holding its own copy (integrator: one-line change).

export const PANEL_BRAND = {
  /** Shown as "message [SHOP NAME] on Etsy". */
  shopName: '[SHOP NAME]',
  /** Support e-mail address (to be opened, K25). */
  supportEmail: '[SUPPORT EMAIL]',
} as const;

/** True while a value is still a "[PLACEHOLDER]" (then it is shown as text, never as a mailto: link). */
export function isPlaceholder(value: string): boolean {
  return /^\[[^\]]+\]$/.test(value);
}
