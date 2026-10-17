// /features in English (G144: the body is components/marketing/pages/FeaturesPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { FeaturesPage, featuresMetadata } from '../../../../components/marketing/pages/FeaturesPage.tsx';

export const dynamic = 'force-static';

export const metadata = featuresMetadata(enMarket);

export default function Page() {
  return <FeaturesPage m={enMarket} />;
}
