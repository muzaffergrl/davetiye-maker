// Marketing site shell (G061, docs/14 §9; G066 BKE Studio): fonts (self-hosted by next/font at build time — no font
// file in the repo), header, footer, the site-wide JSON-LD (Organization + WebSite), robots (noindex until launch) and
// the live demo dialog host. The root layout (app/layout.tsx) stays the platform's and carries the brand icons and the
// web manifest; this shell paints its own background.
import type { Metadata, Viewport } from 'next';
import { Archivo, DM_Sans, Montserrat } from 'next/font/google';
import type { ReactNode } from 'react';
import { MotionRoot } from '../../components/fx/MotionRoot.tsx';
import '../../components/fx/fx.css';
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
const display = Archivo({ subsets: ['latin'], weight: ['800'], display: 'swap', variable: '--font-display' });
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
      {/* G089 (K31): reveal on scroll and pointer depth; styles in components/fx/fx.css */}
      <MotionRoot />
    </div>
  );
}
