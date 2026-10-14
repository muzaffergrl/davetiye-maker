// /start?theme=<design in review> in production (G080): answered with 404 by app/start/page.tsx (notFound()), with
// this honest page — the design exists but is not on sale yet (lib/themes/approval.ts), so no website can be started
// from it here — plus the designs that can be started. Nothing else under /start calls notFound(): an unknown theme
// keeps its friendly "This start link is not valid" page (page.tsx).
import type { Metadata } from 'next';
import { THEME_IN_REVIEW } from '../../lib/themes/approval.ts';
import { offeredThemes } from '../../lib/themes/offered.ts';
import { DesignList, StartShell } from './shell.tsx';
import styles from './start.module.css';

export const metadata: Metadata = {
  title: 'Design not available yet',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function DesignNotAvailable() {
  const themes = await offeredThemes();
  return (
    <StartShell>
      <div className={styles.narrow} data-theme-in-review>
        <p className={styles.eyebrow}>Your wedding website</p>
        <h1 className={styles.title}>{THEME_IN_REVIEW.title}</h1>
        <p className={styles.lead}>{THEME_IN_REVIEW.message}</p>
        {themes.length ? <p className={styles.small}>Designs you can start a website from:</p> : null}
        <DesignList themes={themes} />
      </div>
    </StartShell>
  );
}
