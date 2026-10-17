// /<lang>/designs (G144; /tr/designs … rewritten here by next.config.ts). Body: components/marketing/pages/DesignsPage.tsx.
import { DesignsPage, designsMetadata } from '../../../../../components/marketing/pages/DesignsPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return designsMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <DesignsPage m={await pageMarket(params)} />;
}
