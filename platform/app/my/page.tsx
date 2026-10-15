// /my — "My website" (G095): the sales site's button for buyers. Opens the editor saved on this device, or
// explains the ways in (the saved edit link, /start for a new order, a new link from the shop). Never indexed.
// ("my" cannot be a couple's address: addresses have at least 3 characters, lib/slug.ts.)
import type { Metadata } from 'next';
import MyWebsite from '../../components/my/MyWebsite.tsx';
import { PANEL_FONTS } from '../../components/panel/fonts.ts';
import { MARKETING } from '../../lib/marketing/config.ts';
import { startPath } from '../../lib/marketing/designs.ts';

export const metadata: Metadata = {
  title: 'My website',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function MyPage() {
  return (
    <div className={PANEL_FONTS}>
      <MyWebsite shopName={MARKETING.etsy.shopName} startPath={startPath()} />
    </div>
  );
}
