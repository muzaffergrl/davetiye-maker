// /edit/<slug>?k=<edit key> — the buyer's edit panel (G039).
// The key is checked against the stored hash (lib/rsvp/couple.ts authorizeEditor). A wrong key,
// a preview key, a missing key and an unknown slug all render the same generic 404 (not-found.tsx).
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import '../../../components/fx/panel-fx.css';
import Panel from '../../../components/panel/Panel.tsx';
import { getDataAdapter } from '../../../lib/data/index.ts';
import { publicOrigin } from '../../../lib/panel/http.ts';
import { panelState } from '../../../lib/panel/state.ts';
import { authorizeEditor } from '../../../lib/rsvp/couple.ts';
import { isShopEditKey } from '../../../lib/sites.ts';
import { uiLocale } from '../../../lib/i18n/server.ts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit your website',
  robots: { index: false, follow: false },
  // The edit key is in this page's URL: never send it to another site.
  referrer: 'no-referrer',
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { k } = await searchParams;
  const key = typeof k === 'string' ? k : null;
  const site = key ? await authorizeEditor(getDataAdapter(), slug, key) : null;
  if (!site || !key) notFound();
  const state = await panelState(site, publicOrigin(await headers()));
  // K29: the published copy too, so the panel can say which parts of the draft guests do not see yet (Review).
  const { lang, dict } = await uiLocale();
  // G145: opened with the shop's own time-limited link (admin "Dükkân olarak düzenle"), not the buyer's.
  const shopUntil = isShopEditKey(site, key) ? (site.shopEdit?.expiresAt ?? null) : null;
  return <Panel initial={state} editKey={key} published={site.publishedContent ?? null} lang={lang} dict={dict} shopUntil={shopUntil} />;
}
