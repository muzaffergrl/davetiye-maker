// Marketing site shell (G061, docs/14 §9): fonts (self-hosted by next/font at build time), header, footer, the
// site-wide JSON-LD (Organization + WebSite), robots (noindex until launch) and the live demo dialog host.
// The root layout (app/layout.tsx) stays the platform's; this shell paints its own background.
import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import type { ReactNode } from 'react';
import { DemoHost } from '../../components/marketing/Demo.tsx';
import { demoDesigns } from '../../components/marketing/demo-data.ts';
import s from '../../components/marketing/marketing.module.css';
import { Footer, Header } from '../../components/marketing/Shell.tsx';
import { Tracker } from '../../components/marketing/Tracker.tsx';
import { JsonLd } from '../../components/marketing/ui.tsx';
import { MARKETING } from '../../lib/marketing/config.ts';
import { loadGuides } from '../../lib/marketing/guides.ts';
import { assertLaunchReady } from '../../lib/marketing/placeholders.ts';
import { graph, organization, website } from '../../lib/marketing/schema.ts';
import { robotsFor } from '../../lib/marketing/seo.ts';
import { siteOrigin } from '../../lib/marketing/site.ts';

// `launched: true` with placeholders left stops the build here (docs/14 §10).
assertLaunchReady(MARKETING);

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-display',
});
// Body text uses the system UI font stack (no download): one web font family keeps the first load light.

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  robots: robotsFor(),
  formatDetection: { telephone: false, email: false, address: false },
  // Temporary tab icon (lucide "mail", UI icon) until the brand and its logo are decided.
  icons: { icon: [{ url: '/marketing/favicon.svg', type: 'image/svg+xml' }] },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const guides = loadGuides();
  return (
    <div className={`${s.shell} ${display.variable}`} data-analytics={MARKETING.analytics.provider}>
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
    </div>
  );
}
