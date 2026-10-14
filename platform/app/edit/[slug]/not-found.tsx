// Generic answer for /edit/<slug> with a wrong, missing or preview key, or an unknown slug.
// Identical in every case, so it never tells whether a site exists. BKE Studio look (G066): logo, panel fonts.
import { BrandLogo } from '../../../components/panel/Brand.tsx';
import { PANEL_FONTS } from '../../../components/panel/fonts.ts';
import styles from '../../../components/panel/panel.module.css';
import { SIGN_IN_UNAVAILABLE } from '../../../lib/panel/signin.ts';

export default function EditLinkNotValid() {
  return (
    <main className={`${styles.notice} ${PANEL_FONTS}`}>
      <BrandLogo height={28} className={styles.noticeBrand} />
      <h1 className={styles.noticeTitle}>This edit link is not valid</h1>
      <p>
        Please open the full edit link you received when you created your website. Copy the whole link, including the part after <code>?k=</code>.
      </p>
      <section className={styles.noticeCard} aria-labelledby="lost-link">
        <h2 id="lost-link">Lost your edit link?</h2>
        <p>{SIGN_IN_UNAVAILABLE}</p>
      </section>
    </main>
  );
}
