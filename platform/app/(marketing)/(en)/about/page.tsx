// /about in English (G144: the body is components/marketing/pages/AboutPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { AboutPage, aboutMetadata } from '../../../../components/marketing/pages/AboutPage.tsx';

export const dynamic = 'force-static';

export const metadata = aboutMetadata(enMarket);

export default function Page() {
  return <AboutPage m={enMarket} />;
}
