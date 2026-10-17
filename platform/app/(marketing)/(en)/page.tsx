// / in English (G144: the body is components/marketing/pages/HomePage.tsx, shared by every language).
import { enMarket } from '../../../lib/marketing/i18n.ts';
import { HomePage, homeMetadata } from '../../../components/marketing/pages/HomePage.tsx';

export const dynamic = 'force-static';

export const metadata = homeMetadata(enMarket);

export default function Page() {
  return <HomePage m={enMarket} />;
}
