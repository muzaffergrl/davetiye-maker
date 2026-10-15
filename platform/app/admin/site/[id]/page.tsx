// /admin/site/<id> — one website in the shop admin (G087): confirm its order, ready Etsy messages, new edit link,
// name/date changes, online-until date, take offline, delete, history.
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { adminSite } from '../../../../lib/admin/api.ts';
import { adminPageState } from '../../../../lib/admin/page.ts';
import { publicOrigin } from '../../../../lib/panel/http.ts';
import AdminSite from '../../../../components/admin/AdminSite.tsx';
import { AdminGate } from '../../../../components/admin/Gate.tsx';
import { AdminShell } from '../../../../components/admin/Shell.tsx';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Site · Dükkân yönetimi',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function AdminSitePage({ params }: { params: Promise<{ id: string }> }) {
  const state = await adminPageState();
  if (!state.signedIn) {
    return (
      <AdminShell signedIn={false}>
        <AdminGate config={state.config} />
      </AdminShell>
    );
  }
  const { id } = await params;
  const detail = await adminSite(id);
  if (!detail) notFound();
  return (
    <AdminShell signedIn narrow>
      <AdminSite summary={detail.summary} history={detail.history} origin={publicOrigin(await headers())} />
    </AdminShell>
  );
}
