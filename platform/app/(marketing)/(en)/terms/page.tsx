// /terms in English (G961; the body is components/marketing/pages/TermsPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { TermsPage, termsMetadata } from '../../../../components/marketing/pages/TermsPage.tsx';

export const dynamic = 'force-static';

export const metadata = termsMetadata(enMarket);

export default function Page() {
  return <TermsPage m={enMarket} />;
}
