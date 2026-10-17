import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { DocumentHtml } from '../components/i18n/DocumentLang.tsx';
import { BRAND_FILES, BRAND_ICONS } from '../lib/marketing/brand.ts';

// Root layout for platform pages (panel, /start, ...). Couple sites (/<slug>) are
// rendered from theme HTML by route handlers and do not use this layout.
// G066: BKE Studio tab icons and web manifest for every platform page (the marketing layout inherits them).
// G150: <html lang> follows the route (sales site in tr/es/de/fr, Turkish admin) or the buyer interface's language
// (components/i18n/DocumentLang.tsx, lib/i18n/document-lang.ts) instead of a fixed "en".

export const metadata: Metadata = {
  title: 'BKE Studio',
  robots: { index: false, follow: false },
  icons: BRAND_ICONS,
  manifest: BRAND_FILES.manifest,
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <DocumentHtml>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff', color: '#222' }}>
        {children}
      </body>
    </DocumentHtml>
  );
}
