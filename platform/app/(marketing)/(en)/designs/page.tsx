// /designs in English (G144: the body is components/marketing/pages/DesignsPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { DesignsPage, designsMetadata } from '../../../../components/marketing/pages/DesignsPage.tsx';

export const dynamic = 'force-static';

export const metadata = designsMetadata(enMarket);

export default function Page() {
  return <DesignsPage m={enMarket} />;
}
