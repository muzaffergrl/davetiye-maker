// /<lang>/about (G144; /tr/about … rewritten here by next.config.ts). Body: components/marketing/pages/AboutPage.tsx.
import { AboutPage, aboutMetadata } from '../../../../../components/marketing/pages/AboutPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return aboutMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <AboutPage m={await pageMarket(params)} />;
}
