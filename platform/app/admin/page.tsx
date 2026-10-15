// /admin — the shop's admin (G087, K30): every website, what needs doing (orders to confirm), search.
// Off without ADMIN_PASSWORD; sign-in with the shop password (lib/admin/auth.ts). Never indexed, never framed.
import type { Metadata } from 'next';
import { adminList } from '../../lib/admin/api.ts';
import { adminPageState } from '../../lib/admin/page.ts';
import AdminList from '../../components/admin/AdminList.tsx';
import { AdminGate } from '../../components/admin/Gate.tsx';
import { AdminShell } from '../../components/admin/Shell.tsx';
import styles from '../../components/admin/admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dükkân yönetimi · BKE Studio',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function AdminPage() {
  const state = await adminPageState();
  if (!state.signedIn) {
    return (
      <AdminShell signedIn={false}>
        <AdminGate config={state.config} />
      </AdminShell>
    );
  }
  const { sites, counts } = await adminList();
  return (
    <AdminShell signedIn>
      {state.temporaryPassword ? (
        <div className={styles.callout} role="note" data-temporary-password="">
          <p className={styles.calloutTitle} style={{ marginBottom: 4 }}>
            Geçici kısa şifre
          </p>
          <p style={{ margin: 0 }}>
            Panel şu an kısa bir şifreyle açık. Gerçek satışa (lansman) geçmeden önce en az 12 karakterli bir şifreye geçilmeli; kısa
            şifreyle lansman build&apos;i durur.
          </p>
        </div>
      ) : null}
      <h1 className={styles.h1}>Siteler</h1>
      <p className={styles.lead}>
        {counts.total} site · {counts.published} yayında · {counts.replies} RSVP yanıtı
      </p>
      <details className={`${styles.card} ${styles.help}`} open={counts.total === 0 || undefined}>
        <summary>Satış sonrası nasıl işliyor?</summary>
        <ol>
          <li>Alıcı Etsy&apos;den tasarımı satın alır ve indirdiği PDF&apos;teki linkle başlatma sayfasını açar.</li>
          <li>Sipariş numarası ve e-postasıyla sitesini başlatır; taslak hemen açılır, düzenleme linkini kaydeder.</li>
          <li>
            Site burada <strong>Yapılacak</strong> listesine düşer. Etsy&apos;de siparişi kontrol edip <strong>Siparişi onayla</strong>&apos;ya basın, hazır
            &quot;Sipariş onaylandı&quot; mesajını Etsy&apos;den gönderin. Alıcı artık yayınlayabilir.
          </li>
          <li>Linkini kaybeden olursa sitenin sayfasında <strong>Yeni düzenleme linki</strong> oluşturup hazır mesajla gönderin.</li>
          <li>Düğün ertelenirse <strong>İsim/tarih hakkı ekle</strong>; uzatma isterse <strong>Yayında kalma süresi</strong>.</li>
        </ol>
      </details>
      <AdminList sites={sites} counts={counts} />
    </AdminShell>
  );
}
