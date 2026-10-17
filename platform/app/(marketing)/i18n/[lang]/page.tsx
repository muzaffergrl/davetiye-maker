// /<lang> (G144; /tr … rewritten here by next.config.ts). Body: components/marketing/pages/HomePage.tsx.
import { HomePage, homeMetadata } from '../../../../components/marketing/pages/HomePage.tsx';
import { pageMarket, type LangParams } from '../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return homeMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <HomePage m={await pageMarket(params)} />;
}
