// Generic answer for /edit/<slug> with a wrong, missing or preview key, or an unknown slug.
// Identical in every case, so it never tells whether a site exists. BKE Studio look (G066): logo, panel fonts.
// G146: two ways back — "Continue with your order number" (/my: order number + email, any device) and "Paste your
// edit link" (/my, the saved link).
import { BrandLogo } from '../../../components/panel/Brand.tsx';
import { PANEL_FONTS } from '../../../components/panel/fonts.ts';
import styles from '../../../components/panel/panel.module.css';
import { PANEL_BRAND } from '../../../lib/panel/brand.ts';
import { uiLocale } from '../../../lib/i18n/server.ts';
import { makeTranslator } from '../../../lib/i18n/translate.ts';

export default async function EditLinkNotValid() {
  const { lang, dict } = await uiLocale();
  const { t } = makeTranslator(lang, dict);
  return (
    <main className={`${styles.notice} ${PANEL_FONTS}`}>
      <BrandLogo height={28} className={styles.noticeBrand} />
      <h1 className={styles.noticeTitle}>{t('This edit link is not valid')}</h1>
      <p>
        {t('Please open the full edit link you received when you created your website. Copy the whole link, including the part after')}{' '}
        <code>?k=</code>.
      </p>
      {/* G146: the way back that always works — the Etsy order number + email on /my, on any device. */}
      <section className={styles.noticeCard} aria-labelledby="lost-link" data-continue-with-order="">
        <h2 id="lost-link">{t('Open your editor with your order number')}</h2>
        <p>
          {t('Enter your Etsy order number and the email you used when you started your website. It works on any phone or computer — no account or password.')}
        </p>
        <div className={styles.noticeActions}>
          <a className={`${styles.btn} ${styles.btn_primary} ${styles.btnBlock}`} href="/my#continue" data-continue-order="">
            {t('Continue with your order number')}
          </a>
          <a className={`${styles.btn} ${styles.btn_secondary} ${styles.btnBlock}`} href="/my#link" data-paste-link="">
            {t('Paste your edit link')}
          </a>
        </div>
        <p className={styles.hint}>{t('Still stuck? Message {shop} on Etsy with your order number.', { shop: PANEL_BRAND.shopName })}</p>
      </section>
    </main>
  );
}
