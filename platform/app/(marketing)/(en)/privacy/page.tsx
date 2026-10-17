// /privacy in English (G144: the body is components/marketing/pages/PrivacyPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { PrivacyPage, privacyMetadata } from '../../../../components/marketing/pages/PrivacyPage.tsx';

export const dynamic = 'force-static';

export const metadata = privacyMetadata(enMarket);

export default function Page() {
  return <PrivacyPage m={enMarket} />;
}
