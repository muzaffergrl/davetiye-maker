// /guides in English (G144: the body is components/marketing/pages/GuidesPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { GuidesPage, guidesMetadata } from '../../../../components/marketing/pages/GuidesPage.tsx';

export const dynamic = 'force-static';

export const metadata = guidesMetadata(enMarket);

export default function Page() {
  return <GuidesPage m={enMarket} />;
}
