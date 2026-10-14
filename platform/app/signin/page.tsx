// /signin — e-mail sign-in (G060, docs/16 §12.1). Not available yet (no e-mail provider): no form, the honest
// text only. ("signin" is a reserved slug, lib/slug.ts, so no couple can take this address.)
import type { Metadata } from 'next';
import styles from '../../components/panel/panel.module.css';
import { SIGN_IN_UNAVAILABLE } from '../../lib/panel/signin.ts';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function SignInPage() {
  return (
    <main className={styles.notice}>
      <h1 className={styles.noticeTitle}>Open your editor</h1>
      <p>{SIGN_IN_UNAVAILABLE}</p>
    </main>
  );
}
