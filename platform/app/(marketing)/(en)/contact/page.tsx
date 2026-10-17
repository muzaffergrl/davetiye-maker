// /contact in English (G144: the body is components/marketing/pages/ContactPage.tsx, shared by every language).
import { enMarket } from '../../../../lib/marketing/i18n.ts';
import { ContactPage, contactMetadata } from '../../../../components/marketing/pages/ContactPage.tsx';

export const dynamic = 'force-static';

export const metadata = contactMetadata(enMarket);

export default function Page() {
  return <ContactPage m={enMarket} />;
}
