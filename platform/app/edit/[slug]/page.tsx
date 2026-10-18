// /edit/<slug>?k=<edit key> — the buyer's edit panel (G039).
// The key is checked against the stored hash (lib/rsvp/couple.ts editorAccess: the edit key, the shop's key or a
// device key, G146). A wrong key, a preview key, a missing key and an unknown slug all render the same generic 404
// (not-found.tsx).
// G181: `view` = the hash of a deep link (`?view=share#share`): the panel's skeleton script asks for it once, so the server
// renders that view instead of the default one (components/panel/Panel.tsx BootShell); the panel then drops it from the URL.
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import '../../../components/fx/panel-fx.css';
import { DocumentLang } from '../../../components/i18n/DocumentLang.tsx';
import Panel from '../../../components/panel/Panel.tsx';
import { getDataAdapter } from '../../../lib/data/index.ts';
import { publicOrigin } from '../../../lib/panel/http.ts';
import { panelState } from '../../../lib/panel/state.ts';
import { editorAccess } from '../../../lib/rsvp/couple.ts';
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
  const { k, view } = await searchParams;
  const key = typeof k === 'string' ? k : null;
  const opened = key ? await editorAccess(getDataAdapter(), slug, key) : null;
  if (!opened || !key) notFound();
  const { site, access } = opened;
  const state = await panelState(site, publicOrigin(await headers()));
  // K29: the published copy too, so the panel can say which parts of the draft guests do not see yet (Review).
  const { lang, dict } = await uiLocale();
  // G145: opened with the shop's own time-limited link (admin "Dükkân olarak düzenle"), not the buyer's.
  const shopUntil = access.kind === 'shop' ? (site.shopEdit?.expiresAt ?? null) : null;
  // G146: opened with a device key ("continue with your order number" on /my), not the private edit link.
  return (
    <>
      <DocumentLang lang={lang} />
      <Panel
        initial={state}
        editKey={key}
        published={site.publishedContent ?? null}
        lang={lang}
        dict={dict}
        shopUntil={shopUntil}
        deviceSession={access.kind === 'device'}
        // G181: the view a deep link names (#share …), sent once by the page's own script; the panel checks it
        initialView={typeof view === 'string' ? view : null}
      />
    </>
  );
}
