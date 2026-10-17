// /<lang>/contact (G144; /tr/contact … rewritten here by next.config.ts). Body: components/marketing/pages/ContactPage.tsx.
import { ContactPage, contactMetadata } from '../../../../../components/marketing/pages/ContactPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return contactMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <ContactPage m={await pageMarket(params)} />;
}
