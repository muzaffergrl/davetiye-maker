// Generic answer for /edit/<slug> with a wrong, missing or preview key, or an unknown slug.
// Identical in every case, so it never tells whether a site exists. BKE Studio look (G066): logo, panel fonts.
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
      <section className={styles.noticeCard} aria-labelledby="lost-link">
        <h2 id="lost-link">{t('Lost your edit link?')}</h2>
        {/* SIGN_IN_UNAVAILABLE (lib/panel/signin.ts), as one translatable sentence */}
        <p>
          {t("Email sign-in isn't available yet. Open your editor with the edit link you saved. Lost it? Message {shop} on Etsy with your order number.", {
            shop: PANEL_BRAND.shopName,
          })}
        </p>
      </section>
    </main>
  );
}
