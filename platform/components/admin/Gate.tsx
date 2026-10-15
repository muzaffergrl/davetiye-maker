// What /admin shows before the list: the admin is off (no ADMIN_PASSWORD), or the sign-in form (G087).
import { ADMIN_PASSWORD_MIN } from '../../lib/admin/auth.ts';
import AdminLogin from './AdminLogin.tsx';
import styles from './admin.module.css';

export function AdminGate({ config }: { config: 'on' | 'off' | 'weak' }) {
  return (
    <div className={styles.signin}>
      <h1 className={styles.h1}>Dükkân yönetimi</h1>
      {config === 'on' ? (
        <>
          <p className={styles.lead}>Siparişleri onaylamak, kayıp linkleri yenilemek ve siteleri yönetmek için giriş yapın.</p>
          <AdminLogin />
        </>
      ) : (
        <div className={styles.card} data-admin-off="">
          <p style={{ marginTop: 0 }}>
            <strong>Yönetim paneli kapalı.</strong>
          </p>
          <p className={styles.actionText} style={{ marginBottom: 0 }}>
            {config === 'weak'
              ? `Sunucudaki yönetim şifresi çok kısa (en az ${ADMIN_PASSWORD_MIN} karakter olmalı); güvenlik için panel açılmadı.`
              : 'Sunucuda yönetim şifresi tanımlı değil (ADMIN_PASSWORD). Tanımlandığında bu sayfa giriş ekranına dönüşür.'}
          </p>
        </div>
      )}
    </div>
  );
}
