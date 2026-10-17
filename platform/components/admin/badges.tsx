// State badges of a site in the shop admin (G087): what needs doing first, then where the website is.
import { isDemo, type AdminSiteSummary } from '../../lib/admin/view.ts';
import styles from './admin.module.css';

export function StateBadges({ summary: s }: { summary: AdminSiteSummary }) {
  return (
    <span className={styles.badges}>
      {isDemo(s) ? (
        <span className={styles.badgeMuted} data-demo-badge="" title="npm run seed ile kurulan örnek site; satış sayılmaz">
          Demo
        </span>
      ) : null}
      {s.needsAction ? <span className={styles.badgeWarn}>Sipariş onayı bekliyor</span> : null}
      {s.state === 'published' ? (
        <span className={styles.badgeOk}>Yayında</span>
      ) : s.state === 'archived' ? (
        <span className={styles.badgeMuted}>Arşiv</span>
      ) : (
        <span className={styles.badge}>Taslak</span>
      )}
      {s.unpublishedChanges ? <span className={styles.badgeMuted}>Yayınlanmamış değişiklik</span> : null}
    </span>
  );
}
