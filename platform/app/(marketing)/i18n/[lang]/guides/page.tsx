// /<lang>/guides (G144; /tr/guides … rewritten here by next.config.ts). Body: components/marketing/pages/GuidesPage.tsx.
import { GuidesPage, guidesMetadata } from '../../../../../components/marketing/pages/GuidesPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return guidesMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <GuidesPage m={await pageMarket(params)} />;
}
