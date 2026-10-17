// /<lang>/privacy (G144; /tr/privacy … rewritten here by next.config.ts). Body: components/marketing/pages/PrivacyPage.tsx.
import { PrivacyPage, privacyMetadata } from '../../../../../components/marketing/pages/PrivacyPage.tsx';
import { pageMarket, type LangParams } from '../../../../../components/marketing/pages/lang.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: LangParams };

export async function generateMetadata({ params }: Props) {
  return privacyMetadata(await pageMarket(params));
}

export default async function Page({ params }: Props) {
  return <PrivacyPage m={await pageMarket(params)} />;
}
