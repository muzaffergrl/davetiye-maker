// /signin — e-mail sign-in (G060, docs/16 §12.1). Not available yet (no e-mail provider): no form, the honest
// text only. ("signin" is a reserved slug, lib/slug.ts, so no couple can take this address.)
// G080: the BKE Studio look of the panel's "edit link not valid" page (logo, panel fonts and tokens).
import type { Metadata } from 'next';
import { BrandLogo } from '../../components/panel/Brand.tsx';
import { PANEL_FONTS } from '../../components/panel/fonts.ts';
import styles from '../../components/panel/panel.module.css';
import { PANEL_BRAND } from '../../lib/panel/brand.ts';
import { uiLocale } from '../../lib/i18n/server.ts';
import { makeTranslator } from '../../lib/i18n/translate.ts';

export async function generateMetadata(): Promise<Metadata> {
  const { lang, dict } = await uiLocale();
  const { t } = makeTranslator(lang, dict);
  return {
    title: t('Sign in'),
    robots: { index: false, follow: false },
    referrer: 'no-referrer',
  };
}

export default async function SignInPage() {
  const { lang, dict } = await uiLocale();
  const { t } = makeTranslator(lang, dict);
  // `.app` around the notice: the paper ground fills the whole window (the notice column is 560 px wide).
  return (
    <div className={`${styles.app} ${PANEL_FONTS}`}>
      <main className={styles.notice}>
        <BrandLogo height={28} className={styles.noticeBrand} />
        <h1 className={styles.noticeTitle}>{t('Open your editor')}</h1>
        {/* SIGN_IN_UNAVAILABLE (lib/panel/signin.ts), as one translatable sentence */}
        <p>
          {t("Email sign-in isn't available yet. Open your editor with the edit link you saved. Lost it? Message {shop} on Etsy with your order number.", {
            shop: PANEL_BRAND.shopName,
          })}
        </p>
      </main>
    </div>
  );
}
