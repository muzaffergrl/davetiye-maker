// /admin/customers — buyers grouped by email with their orders (G095).
import type { Metadata } from 'next';
import { adminList } from '../../../lib/admin/api.ts';
import { adminCustomers } from '../../../lib/admin/view.ts';
import AdminCustomers from '../../../components/admin/AdminCustomers.tsx';
import { AdminPage } from '../../../components/admin/Guard.tsx';
import styles from '../../../components/admin/admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Müşteriler · Dükkân yönetimi',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function CustomersPage() {
  return (
    <AdminPage active="customers">
      {async () => {
        const { sites } = await adminList();
        const customers = adminCustomers(sites);
        return (
          <>
            <h1 className={styles.h1}>Müşteriler</h1>
            <p className={styles.lead}>
              {customers.length} müşteri (siteyi açarken yazılan e-postaya göre). E-postayı kopyalayıp Etsy&apos;de alıcıyı bulabilirsiniz; alıcıyla yazışma
              Etsy mesajlarından yapılır.
            </p>
            <AdminCustomers customers={customers} />
          </>
        );
      }}
    </AdminPage>
  );
}
