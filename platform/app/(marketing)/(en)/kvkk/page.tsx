// /kvkk in English (G961; the body is components/marketing/pages/KvkkPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { KvkkPage, kvkkMetadata } from '../../../../components/marketing/pages/KvkkPage.tsx';

export const dynamic = 'force-static';

export const metadata = kvkkMetadata(enMarket);

export default function Page() {
  return <KvkkPage m={enMarket} />;
}
