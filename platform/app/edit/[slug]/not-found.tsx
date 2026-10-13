// Generic answer for /edit/<slug> with a wrong, missing or preview key, or an unknown slug.
// Identical in every case, so it never tells whether a site exists.
import styles from '../../../components/panel/panel.module.css';

export default function EditLinkNotValid() {
  return (
    <main className={styles.notice}>
      <h1 className={styles.noticeTitle}>This edit link is not valid</h1>
      <p>
        Please open the full edit link you received when you created your website. Copy the whole link,
        including the part after <code>?k=</code>.
      </p>
      <p>If it still does not open, contact the shop where you bought your design.</p>
    </main>
  );
}
