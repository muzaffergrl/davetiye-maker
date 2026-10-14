// /signin — e-mail sign-in (G060, docs/16 §12.1). Not available yet (no e-mail provider): no form, the honest
// text only. ("signin" is a reserved slug, lib/slug.ts, so no couple can take this address.)
// G080: the BKE Studio look of the panel's "edit link not valid" page (logo, panel fonts and tokens).
import type { Metadata } from 'next';
import { BrandLogo } from '../../components/panel/Brand.tsx';
import { PANEL_FONTS } from '../../components/panel/fonts.ts';
import styles from '../../components/panel/panel.module.css';
import { SIGN_IN_UNAVAILABLE } from '../../lib/panel/signin.ts';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function SignInPage() {
  // `.app` around the notice: the paper ground fills the whole window (the notice column is 560 px wide).
  return (
    <div className={`${styles.app} ${PANEL_FONTS}`}>
      <main className={styles.notice}>
        <BrandLogo height={28} className={styles.noticeBrand} />
        <h1 className={styles.noticeTitle}>Open your editor</h1>
        <p>{SIGN_IN_UNAVAILABLE}</p>
      </main>
    </div>
  );
}
