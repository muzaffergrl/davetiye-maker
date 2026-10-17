// /<lang>/designs/<design> (G144; rewritten here by next.config.ts). Body: components/marketing/pages/DesignPage.tsx.
import { DesignPage, designMetadata, designStaticParams } from '../../../../../../components/marketing/pages/DesignPage.tsx';
import { prefixedLang } from '../../../../../../components/marketing/pages/lang.ts';
import { market } from '../../../../../../lib/marketing/i18n.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

/** The languages come from the layout's generateStaticParams. */
export function generateStaticParams() {
  return designStaticParams();
}

type Props = { params: Promise<{ lang: string; design: string }> };

export async function generateMetadata({ params }: Props) {
  const p = await params;
  return designMetadata(p.design, await market(prefixedLang(p.lang)));
}

export default async function Page({ params }: Props) {
  const p = await params;
  return <DesignPage id={p.design} m={await market(prefixedLang(p.lang))} />;
}
