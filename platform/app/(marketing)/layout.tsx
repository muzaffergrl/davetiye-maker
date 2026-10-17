// Marketing site shell (G061, docs/14 §9; G066 BKE Studio): fonts (self-hosted by next/font at build time — no font
// file in the repo), robots (noindex until launch), analytics and motion. G152: this is the sales site's ROOT layout
// (<html> + <body>, the brand icons and the web manifest from components/i18n/RootDocument.tsx); the shell paints its
// own background.
// G144: the parts with words (skip link, header with the language switcher, footer, the site-wide JSON-LD and the live
// demo dialog) are components/marketing/MarketShell.tsx, rendered per language by (en)/layout.tsx and
// i18n/[lang]/layout.tsx.
import type { Metadata, Viewport } from 'next';
import { Archivo, DM_Sans, Montserrat } from 'next/font/google';
import type { ReactNode } from 'react';
import { DocumentHtml } from '../../components/i18n/DocumentLang.tsx';
import { RootBody, ROOT_METADATA, ROOT_VIEWPORT } from '../../components/i18n/RootDocument.tsx';
import { MotionRoot } from '../../components/fx/MotionRoot.tsx';
import '../../components/fx/fx.css';
import s from '../../components/marketing/marketing.module.css';
import { Tracker } from '../../components/marketing/Tracker.tsx';
import { BRAND_COLORS } from '../../lib/marketing/brand.ts';
import { MARKETING } from '../../lib/marketing/config.ts';
import { assertLaunchReady } from '../../lib/marketing/placeholders.ts';
import { robotsFor } from '../../lib/marketing/seo.ts';
import { siteOrigin } from '../../lib/marketing/site.ts';

// `launched: true` with placeholders left stops the build here (docs/14 §10).
assertLaunchReady(MARKETING);

// brand/tokens.json fonts (Google Fonts, OFL; next/font serves them from our origin). One file each: Archivo 800 for
// the heavy headlines of the comps, Montserrat 300 for the wide light labels and intros, DM Sans (variable weight)
// for body and interface text. Montserrat is not preloaded: it only sets labels and intros. (G066 measurement: not
// preloading DM Sans did not change Lighthouse's LCP, so it stays preloaded to keep the swap short.)
// G134 (from the local G089 branch, claude/g089-react-bits): Archivo is `optional`, not `swap`. Its fallback is
// narrower, so a late swap re-wrapped H1s (a design name going from two lines to three) and pushed the page down
// (CLS 0.048 on /designs). `optional` never swaps late: the preloaded file is used when it arrives within ~100 ms of the
// first paint (almost always, and always once cached); otherwise that one view keeps the fallback.
const display = Archivo({ subsets: ['latin'], weight: ['800'], display: 'optional', variable: '--font-display' });
const wide = Montserrat({ subsets: ['latin'], weight: ['300'], display: 'swap', variable: '--font-wide', preload: false });
const body = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-body' });

export const metadata: Metadata = {
  ...ROOT_METADATA,
  metadataBase: new URL(siteOrigin()),
  robots: robotsFor(),
  formatDetection: { telephone: false, email: false, address: false },
  // Tab icons and the web manifest: ROOT_METADATA (components/i18n/RootDocument.tsx, lib/marketing/brand.ts).
};

// Browser UI color on phones = the page background (paper light).
export const viewport: Viewport = { ...ROOT_VIEWPORT, themeColor: BRAND_COLORS.paperLight };

// G152: a root layout (components/i18n/RootDocument.tsx); <html lang> follows the route (/tr, /de/designs …).
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <DocumentHtml scope="(marketing)">
      <RootBody>
        <div className={`${s.shell} ${display.variable} ${wide.variable} ${body.variable}`} data-analytics={MARKETING.analytics.provider}>
          {children}
          <Tracker />
          {/* G089 (K31): reveal on scroll and pointer depth; styles in components/fx/fx.css */}
          <MotionRoot />
        </div>
      </RootBody>
    </DocumentHtml>
  );
}
