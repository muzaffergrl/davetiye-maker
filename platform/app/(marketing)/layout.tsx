// Marketing site shell (G061, docs/14 §9; G066 BKE Studio): fonts (self-hosted by next/font at build time — no font
// file in the repo), header, footer, the site-wide JSON-LD (Organization + WebSite), robots (noindex until launch) and
// the live demo dialog host. The root layout (app/layout.tsx) stays the platform's and carries the brand icons and the
// web manifest; this shell paints its own background.
import type { Metadata, Viewport } from 'next';
import { Archivo, DM_Sans, Montserrat } from 'next/font/google';
import type { ReactNode } from 'react';
import { RevealOnScroll } from '../../components/fx/RevealOnScroll.tsx';
import { DemoHost } from '../../components/marketing/Demo.tsx';
import { demoDesigns } from '../../components/marketing/demo-data.ts';
import s from '../../components/marketing/marketing.module.css';
import { Footer, Header } from '../../components/marketing/Shell.tsx';
import { Tracker } from '../../components/marketing/Tracker.tsx';
import { JsonLd } from '../../components/marketing/ui.tsx';
import { BRAND_COLORS } from '../../lib/marketing/brand.ts';
import { MARKETING } from '../../lib/marketing/config.ts';
import { loadGuides } from '../../lib/marketing/guides.ts';
import { assertLaunchReady } from '../../lib/marketing/placeholders.ts';
import { graph, organization, website } from '../../lib/marketing/schema.ts';
import { robotsFor } from '../../lib/marketing/seo.ts';
import { siteOrigin } from '../../lib/marketing/site.ts';

// `launched: true` with placeholders left stops the build here (docs/14 §10).
assertLaunchReady(MARKETING);

// brand/tokens.json fonts (Google Fonts, OFL; next/font serves them from our origin). One file each: Archivo 800 for
// the heavy headlines of the comps, Montserrat 300 for the wide light labels and intros, DM Sans (variable weight)
// for body and interface text. Montserrat is not preloaded: it only sets labels and intros. (G066 measurement: not
// preloading DM Sans did not change Lighthouse's LCP, so it stays preloaded to keep the swap short.)
// G089: Archivo is `optional`, not `swap`. Its fallback is narrower, so a late swap re-wrapped many H1s (a design name
// going from two lines to three) and pushed the page down — CLS 0.048 on /designs before G089, and 0.118 once the H1
// words became separate boxes for the stagger. `optional` never swaps late: the preloaded file is used when it is there
// within ~100 ms of the first paint (almost always, and always once cached); otherwise that one view keeps the fallback.
const display = Archivo({ subsets: ['latin'], weight: ['800'], display: 'optional', variable: '--font-display' });
const wide = Montserrat({ subsets: ['latin'], weight: ['300'], display: 'swap', variable: '--font-wide', preload: false });
const body = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-body' });

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  robots: robotsFor(),
  formatDetection: { telephone: false, email: false, address: false },
  // Tab icons and the web manifest come from the root layout (app/layout.tsx, lib/marketing/brand.ts).
};

// Browser UI color on phones = the page background (paper light).
export const viewport: Viewport = { themeColor: BRAND_COLORS.paperLight };

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const guides = loadGuides();
  return (
    <div className={`${s.shell} ${display.variable} ${wide.variable} ${body.variable}`} data-analytics={MARKETING.analytics.provider}>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <Header />
      <main id="main" className={s.main} tabIndex={-1}>
        {children}
      </main>
      <Footer guides={guides} />
      <JsonLd data={graph(organization(), website())} />
      <DemoHost designs={demoDesigns()} />
      <Tracker />
      {/* G089: blocks after the first section rise in once as they scroll into view (none hidden without JS). */}
      <RevealOnScroll selector={`.${s.main} .${s.section} ~ .${s.section} .${s.container} > *`} />
    </div>
  );
}
