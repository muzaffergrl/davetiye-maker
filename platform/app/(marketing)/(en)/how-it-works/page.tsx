// /how-it-works in English (G144: the body is components/marketing/pages/HowItWorksPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { HowItWorksPage, howItWorksMetadata } from '../../../../components/marketing/pages/HowItWorksPage.tsx';

export const dynamic = 'force-static';

export const metadata = howItWorksMetadata(enMarket);

export default function Page() {
  return <HowItWorksPage m={enMarket} />;
}
