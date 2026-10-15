// /admin/orders — every order/website (G087 list, G095): filter, search, sort, CSV export.
import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { adminList } from '../../../lib/admin/api.ts';
import type { AdminFilter } from '../../../lib/admin/view.ts';
import AdminList from '../../../components/admin/AdminList.tsx';
import { AdminPage } from '../../../components/admin/Guard.tsx';
import styles from '../../../components/admin/admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Siparişler · Dükkân yönetimi',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

const FILTERS: AdminFilter[] = ['action', 'all', 'published', 'draft', 'archived'];

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const f = typeof sp.f === 'string' && (FILTERS as string[]).includes(sp.f) ? (sp.f as AdminFilter) : null;
  const q = typeof sp.q === 'string' ? sp.q.slice(0, 100) : '';
  return (
    <AdminPage active="orders">
      {async () => {
        const { sites, counts } = await adminList();
        return (
          <>
            <div className={styles.row} style={{ justifyContent: 'space-between' }}>
              <h1 className={styles.h1}>Siparişler</h1>
              <Link href="/admin/new" className={styles.btn} data-new-order-link="">
                <Plus size={18} aria-hidden /> Yeni sipariş
              </Link>
            </div>
            <p className={styles.lead}>
              {counts.total} site · {counts.published} yayında · {counts.replies} RSVP yanıtı. Bir siparişe dokunun: bilgiler, mesajlar, işlemler.
            </p>
            <AdminList sites={sites} counts={counts} initialFilter={f} initialQuery={q} />
          </>
        );
      }}
    </AdminPage>
  );
}
