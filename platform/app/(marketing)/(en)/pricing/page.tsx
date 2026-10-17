// /pricing in English (G144: the body is components/marketing/pages/PricingPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { PricingPage, pricingMetadata } from '../../../../components/marketing/pages/PricingPage.tsx';

export const dynamic = 'force-static';

export const metadata = pricingMetadata(enMarket);

export default function Page() {
  return <PricingPage m={enMarket} />;
}
