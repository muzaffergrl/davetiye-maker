// /<lang>/features (G144; /tr/features … rewritten here by next.config.ts). Body: components/marketing/pages/FeaturesPage.tsx.
import { FeaturesPage, featuresMetadata } from '../../../../../components/marketing/pages/FeaturesPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return featuresMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <FeaturesPage m={await pageMarket(params)} />;
}
