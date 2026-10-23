// /<lang>/kvkk (G961; /tr/kvkk … rewritten here by next.config.ts). Body: components/marketing/pages/KvkkPage.tsx.
import { KvkkPage, kvkkMetadata } from '../../../../../components/marketing/pages/KvkkPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return kvkkMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <KvkkPage m={await pageMarket(params)} />;
}
