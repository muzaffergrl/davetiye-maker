// BKE Studio brand kit as the platform uses it (G066, K27; source: brand/README.md, brand/tokens.json).
// Files live in public/brand/: the logos are copies of brand/svg/ (never re-typeset with a font). G129 (2026-10-16): the
// symbol is the S (traced from GPT's brand/assets/gpt/final_s/, K21); tab icons from the small S monogram, app icons from
// the traced S shop icon (brand/etsy/bke-shop-icon.svg); pattern_tile.png keeps GPT's tile grid with the S symbol.
import type { Metadata } from 'next';

export const BRAND_FILES = {
  /** Primary horizontal logo for light backgrounds (paper / white): site header. */
  logo: '/brand/bke-logo-horizontal-anchor.svg',
  /** Horizontal logo for dark (aubergine) backgrounds: site footer. */
  logoReverse: '/brand/bke-logo-horizontal-reverse.svg',
  /** viewBox of both horizontal logos (width / height = 5.81). */
  logoBox: { width: 1308.08, height: 225 },
  /** Square app icon (aubergine square, paper S with the gold wedge) — also the Organization logo in JSON-LD. */
  icon512: '/brand/icon-512.png',
  /** Brand pattern (gold S symbols on paper, GPT's tile grid), used as a background image only. */
  pattern: '/brand/pattern_tile.png',
  manifest: '/brand/site.webmanifest',
} as const;

/** brand/tokens.json colors. Gold and lavender are accents only: never text on a light background. */
export const BRAND_COLORS = {
  anchor: '#2B1526',
  accent: '#D0AE6A',
  paper: '#EDE5D7',
  paperLight: '#FAF7F0',
  ink: '#202020',
  secondary: '#9F84A7',
} as const;

/** Tab, home-screen and app icons for every platform page (root layout) and the marketing site. */
export const BRAND_ICONS: NonNullable<Metadata['icons']> = {
  icon: [
    { url: '/brand/favicon.ico', sizes: '16x16 32x32 48x48' },
    { url: '/brand/icon.svg', type: 'image/svg+xml' },
  ],
  apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
};

/** Height (px) → width of the horizontal logo, rounded. */
export function logoWidth(height: number): number {
  return Math.round((height * BRAND_FILES.logoBox.width) / BRAND_FILES.logoBox.height);
}
