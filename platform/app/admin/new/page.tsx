// /admin/new — "Yeni sipariş": the shop starts a website for a buyer (G095, lib/admin/create.ts).
import type { Metadata } from 'next';
import { adminCreatableThemes } from '../../../lib/admin/create.ts';
import AdminNew from '../../../components/admin/AdminNew.tsx';
import { AdminPage } from '../../../components/admin/Guard.tsx';
import styles from '../../../components/admin/admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Yeni sipariş · Dükkân yönetimi',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function NewOrderPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  return (
    <AdminPage active="new" narrow>
      {async () => {
        const themes = await adminCreatableThemes();
        const theme = typeof sp.theme === 'string' && themes.some((t) => t.id === sp.theme) ? sp.theme : '';
        return (
          <>
            <h1 className={styles.h1}>Yeni sipariş</h1>
            <p className={styles.lead}>
              Alıcının sitesini siz başlatın (alıcı başlatamadıysa, sizden istediyse ya da sipariş başka bir yerden geldiyse). Site taslak olarak açılır,
              sipariş onaylı sayılır; düzenleme linkini hazır mesajla Etsy&apos;den gönderirsiniz.
            </p>
            <AdminNew themes={themes} initialTheme={theme} />
          </>
        );
      }}
    </AdminPage>
  );
}
