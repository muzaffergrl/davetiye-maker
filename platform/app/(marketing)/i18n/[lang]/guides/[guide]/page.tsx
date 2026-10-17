// /<lang>/guides/<guide> (G144; rewritten here by next.config.ts). Body: components/marketing/pages/GuidePage.tsx.
import { GuidePage, guideMetadata, guideStaticParams } from '../../../../../../components/marketing/pages/GuidePage.tsx';
import { prefixedLang } from '../../../../../../components/marketing/pages/lang.ts';
import { market } from '../../../../../../lib/marketing/i18n.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

/** The languages come from the layout's generateStaticParams. */
export function generateStaticParams() {
  return guideStaticParams();
}

type Props = { params: Promise<{ lang: string; guide: string }> };

export async function generateMetadata({ params }: Props) {
  const p = await params;
  return guideMetadata(p.guide, await market(prefixedLang(p.lang)));
}

export default async function Page({ params }: Props) {
  const p = await params;
  return <GuidePage slug={p.guide} m={await market(prefixedLang(p.lang))} />;
}
