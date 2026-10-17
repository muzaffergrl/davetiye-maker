// G144: the English pages of the sales site (the URLs they always had: /, /designs, /guides/<slug> …). The route group
// "(en)" adds nothing to the URL; it only gives these pages the English frame (header, footer, demo dialog).
import type { ReactNode } from 'react';
import { MarketShell } from '../../../components/marketing/MarketShell.tsx';
import { loadGuides } from '../../../lib/marketing/guides.ts';
import { enMarket } from '../../../lib/marketing/i18n.ts';

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <MarketShell m={enMarket} guides={loadGuides()}>
      {children}
    </MarketShell>
  );
}
