// /<lang>/faq (G144; /tr/faq … rewritten here by next.config.ts). Body: components/marketing/pages/FaqPage.tsx.
import { FaqPage, faqMetadata } from '../../../../../components/marketing/pages/FaqPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return faqMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <FaqPage m={await pageMarket(params)} />;
}
