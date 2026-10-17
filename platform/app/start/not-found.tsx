// /start?theme=<design in review> in production (G080): answered with 404 by app/start/page.tsx (notFound()), with
// this honest page — the design exists but is not on sale yet (lib/themes/approval.ts), so no website can be started
// from it here — plus the designs that can be started. Nothing else under /start calls notFound(): an unknown theme
// keeps its friendly "This start link is not valid" page (page.tsx).
import type { Metadata } from 'next';
import { DocumentLang } from '../../components/i18n/DocumentLang.tsx';
import { THEME_IN_REVIEW } from '../../lib/themes/approval.ts';
import { offeredThemes } from '../../lib/themes/offered.ts';
import { DesignList, StartShell } from './shell.tsx';
import styles from './start.module.css';
import { uiLocale } from '../../lib/i18n/server.ts';
import { makeTranslator, msg } from '../../lib/i18n/translate.ts';

export const metadata: Metadata = {
  title: 'Design not available yet',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

// The texts of THEME_IN_REVIEW (lib/themes/approval.ts), marked for translation; shown below as t(THEME_IN_REVIEW.…).
msg('This design is not available yet');
msg(
  'This design is still being finished and is not on sale yet, so a website cannot be started from it. If you bought a design on Etsy, please open the start link from your Etsy download, or message the shop on Etsy.',
);

export default async function DesignNotAvailable() {
  const themes = await offeredThemes();
  const { lang, dict } = await uiLocale();
  const { t } = makeTranslator(lang, dict);
  return (
    <StartShell>
      <DocumentLang lang={lang} />
      <div className={styles.narrow} data-theme-in-review>
        <p className={styles.eyebrow}>{t('Your wedding website')}</p>
        <h1 className={styles.title}>{t(THEME_IN_REVIEW.title)}</h1>
        <p className={styles.lead}>{t(THEME_IN_REVIEW.message)}</p>
        {themes.length ? <p className={styles.small}>{t('Designs you can start a website from:')}</p> : null}
        <DesignList themes={themes} t={t} />
      </div>
    </StartShell>
  );
}
