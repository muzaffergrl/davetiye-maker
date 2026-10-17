// /faq in English (G144: the body is components/marketing/pages/FaqPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { FaqPage, faqMetadata } from '../../../../components/marketing/pages/FaqPage.tsx';

export const dynamic = 'force-static';

export const metadata = faqMetadata(enMarket);

export default function Page() {
  return <FaqPage m={enMarket} />;
}
