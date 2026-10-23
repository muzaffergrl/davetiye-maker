// /<lang>/terms (G961; /tr/terms … rewritten here by next.config.ts). Body: components/marketing/pages/TermsPage.tsx.
import { TermsPage, termsMetadata } from '../../../../../components/marketing/pages/TermsPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return termsMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <TermsPage m={await pageMarket(params)} />;
}
