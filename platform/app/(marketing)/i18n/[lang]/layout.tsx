// G144: the sales site in Turkish, Spanish, German and French. next.config.ts rewrites /tr, /tr/designs … to
// /i18n/tr, /i18n/tr/designs … (a dynamic [lang] folder at the app root would clash with the couple sites at /[slug]).
// Every page here is static for the four languages; any other value is a 404. Pages reached directly at /i18n/<lang>/…
// name the public /<lang>/… address as their canonical (lib/marketing/seo.ts).
import type { ReactNode } from 'react';
import { MarketShell } from '../../../../components/marketing/MarketShell.tsx';
import { langStaticParams, pageMarket, type LangParams } from '../../../../components/marketing/pages/lang.ts';
import { loadGuidesIn } from '../../../../lib/marketing/guides.ts';

export const dynamicParams = false;

export function generateStaticParams() {
  return langStaticParams();
}

export default async function LanguageLayout({ children, params }: { children: ReactNode; params: LangParams }) {
  const m = await pageMarket(params);
  return (
    <MarketShell m={m} guides={loadGuidesIn(m.lang)}>
      {children}
    </MarketShell>
  );
}
