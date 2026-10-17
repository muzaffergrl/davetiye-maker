// /guides/<guide> in English (G144: the body is components/marketing/pages/GuidePage.tsx, shared by every
// language). Static for every guide; anything else is a 404.
import { enMarket } from '../../../../../lib/marketing/i18n.ts';
import { GuidePage, guideMetadata, guideStaticParams } from '../../../../../components/marketing/pages/GuidePage.tsx';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return guideStaticParams();
}

type Props = { params: Promise<{ guide: string }> };

export async function generateMetadata({ params }: Props) {
  return guideMetadata((await params).guide, enMarket);
}

export default async function Page({ params }: Props) {
  return <GuidePage slug={(await params).guide} m={enMarket} />;
}
