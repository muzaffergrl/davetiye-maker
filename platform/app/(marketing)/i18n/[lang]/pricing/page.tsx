// /<lang>/pricing (G144; /tr/pricing … rewritten here by next.config.ts). Body: components/marketing/pages/PricingPage.tsx.
import { PricingPage, pricingMetadata } from '../../../../../components/marketing/pages/PricingPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return pricingMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <PricingPage m={await pageMarket(params)} />;
}
