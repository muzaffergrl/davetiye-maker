// G152: the parts every root layout shares. There is no app/layout.tsx any more: the sales site
// (app/(marketing)/layout.tsx), the shop admin (app/admin/layout.tsx) and each buyer screen (app/edit, app/my,
// app/signin, app/start — BuyerRootLayout below) are separate ROOT layouts, so a buyer screen, which is dynamic anyway,
// can read the interface language on the server and write <html lang> into its HTML, while the sales site stays
// prerendered (its language comes from the route, components/i18n/DocumentLang.tsx). Couple websites (/<slug>) are
// route handlers and use none of them. A link from one root layout to another is a full page load (Next.js).
// G066: BKE Studio tab icons and web manifest on every platform page.
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { BRAND_FILES, BRAND_ICONS } from '../../lib/marketing/brand.ts';
import { uiLocale } from '../../lib/i18n/server.ts';
import { DocumentHtml } from './DocumentLang.tsx';

export const ROOT_METADATA: Metadata = {
  title: 'BKE Studio',
  robots: { index: false, follow: false },
  icons: BRAND_ICONS,
  manifest: BRAND_FILES.manifest,
};

export const ROOT_VIEWPORT: Viewport = { width: 'device-width', initialScale: 1 };

export function RootBody({ children }: { children: ReactNode }) {
  return <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff', color: '#222' }}>{children}</body>;
}

/**
 * Root layout of a buyer screen: the language the page itself picks (lib/i18n/server.ts uiLocale: cookie bke_lang, else
 * Accept-Language) is in the server's <html lang>; a language switch in the browser updates it (DocumentLang).
 */
export async function BuyerRootLayout({ children }: { children: ReactNode }) {
  const { lang } = await uiLocale();
  return (
    <DocumentHtml fallback={lang}>
      <RootBody>{children}</RootBody>
    </DocumentHtml>
  );
}
