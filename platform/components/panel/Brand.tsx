// BKE Studio logo in the panel (G066 part B). Always the SVG from public/brand/ (copies of brand/svg/, never re-typeset
// with a font). Horizontal logo at >= 24 px height (brand minimum); where a phone bar has no room for it (a long
// "Publish changes" button, `compact`), the small monogram (brand rule: 16–47 px) stands in below 440 px, and on every
// screen under 360 px (panel.module.css; the hidden image is display: none, so it is not read twice). Not a link: no brand
// domain is decided (K26), and the panel has nowhere else to send the couple.
// Plain module (no 'use client'): the server-rendered "link not valid" page uses it too.
import { BRAND_FILES, logoWidth } from '../../lib/marketing/brand.ts';
import styles from './panel.module.css';

const MARK = '/brand/bke-monogram-small-anchor.svg';
/** viewBox of the small monogram (780.5 × 722, the S symbol, G129). */
const MARK_RATIO = 780.5 / 722;

export function BrandLogo({ height = 24, compact = false, className }: { height?: number; compact?: boolean; className?: string }) {
  const mark = Math.round(height * 1.25);
  return (
    <span className={[styles.brand, compact ? styles.brandCompact : '', className ?? ''].filter(Boolean).join(' ')} data-brand-logo>
      <img src={BRAND_FILES.logo} alt="BKE Studio" width={logoWidth(height)} height={height} className={styles.brandFull} decoding="async" />
      <img src={MARK} alt="BKE Studio" width={Math.round(mark * MARK_RATIO)} height={mark} className={styles.brandMark} decoding="async" />
    </span>
  );
}
