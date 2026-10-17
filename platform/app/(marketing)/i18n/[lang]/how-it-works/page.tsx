// /<lang>/how-it-works (G144; /tr/how-it-works … rewritten here by next.config.ts). Body: components/marketing/pages/HowItWorksPage.tsx.
import { HowItWorksPage, howItWorksMetadata } from '../../../../../components/marketing/pages/HowItWorksPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return howItWorksMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <HowItWorksPage m={await pageMarket(params)} />;
}
