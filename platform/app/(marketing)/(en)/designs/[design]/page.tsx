// /designs/<design> in English (G144: the body is components/marketing/pages/DesignPage.tsx, shared by every
// language). Static for every live design; anything else is a 404.
import { enMarket } from '../../../../../lib/marketing/i18n.ts';
import { DesignPage, designMetadata, designStaticParams } from '../../../../../components/marketing/pages/DesignPage.tsx';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return designStaticParams();
}

type Props = { params: Promise<{ design: string }> };

export async function generateMetadata({ params }: Props) {
  return designMetadata((await params).design, enMarket);
}

export default async function Page({ params }: Props) {
  return <DesignPage id={(await params).design} m={enMarket} />;
}
