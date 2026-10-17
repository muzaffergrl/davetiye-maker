// /start?theme=<theme> — the buyer starts their website after buying a design on Etsy (G045).
// Theme preview (live demo in a small iframe) + form: Etsy order number, email, names, address.
// The form posts to /api/start (lib/claim/) and shows the secret edit link once.
// Unknown, internal or demo-less themes get a friendly page listing the designs that can be started.
// G080: BKE Studio look of the edit panel (StartShell); in production a design that is not approved for sale yet
// (lib/themes/approval.ts) answers 404 with an honest message (not-found.tsx) and is left out of the list.
// G151: a private theme (custom design for one buyer) opens only with &order=<a number from its theme.json list>; any
// other link gets the same "not valid" page as an unknown theme. Its demo is admin-only, so the preview is left out.
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { DocumentLang } from '../../components/i18n/DocumentLang.tsx';
import { demoBase } from '../../lib/claim/demo-page.ts';
import { liveVariants, resolveVariant } from '../../lib/theme/variants.ts';
import { getEditLinkMailer } from '../../lib/claim/mailer.ts';
import { claimableTheme } from '../../lib/claim/themes.ts';
import { publicOrigin } from '../../lib/panel/http.ts';
import StartForm from './StartForm.tsx';
import { offeredThemes, themeStartable } from '../../lib/themes/offered.ts';
import { normalizeOrderNumber } from '../../lib/claim/fields.ts';
import { DesignList, StartShell } from './shell.tsx';
import styles from './start.module.css';
import { uiLocale } from '../../lib/i18n/server.ts';
import { makeTranslator } from '../../lib/i18n/translate.ts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Start your wedding website',
  robots: { index: false, follow: false },
  // After a claim the secret edit link is on this page; never send this URL anywhere.
  referrer: 'no-referrer',
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function StartPage({ searchParams }: Props) {
  const { theme, order, variant } = await searchParams;
  const requested = typeof theme === 'string' && theme ? theme : null;
  const found = requested ? await claimableTheme(requested, { order }) : null;

  // A real design that is still in review: 404 + the honest "not available yet" page (production only).
  if (found && !themeStartable(found)) notFound();
  const custom = Boolean(found?.manifest.private);
  const { lang, dict } = await uiLocale();
  const { t } = makeTranslator(lang, dict);

  if (!found) {
    const themes = await offeredThemes();
    return (
      <StartShell>
        <DocumentLang lang={lang} />
        <div className={styles.narrow}>
          <p className={styles.eyebrow}>{t('Your wedding website')}</p>
          <h1 className={styles.title}>{requested ? t('This start link is not valid') : t('Choose your design')}</h1>
          <p className={styles.lead}>
            {requested
              ? t('We could not find this design. Please open the start link from your Etsy download again.')
              : t('Please open the start link from your Etsy download.')}
            {themes.length ? ` ${t('You can also choose the design you bought here:')}` : ''}
          </p>
          <DesignList themes={themes} t={t} />
        </div>
      </StartShell>
    );
  }

  return (
    <>
      <DocumentLang lang={lang} />
      <StartForm
        theme={{
          id: found.id,
          name: found.name,
          partnerCount: found.partnerCount,
          demoUrl: custom ? null : demoBase(found.id),
          // G153: the design's live colour palettes; ?variant=<id> (the Etsy start link of a colour) preselects one
          swatch: found.manifest.swatch ?? null,
          variants: liveVariants(found.manifest.variants).map((v) => ({ id: v.id, name: v.name, swatch: v.swatch })),
          variant: resolveVariant(found.manifest.variants, variant),
        }}
        initialOrder={custom ? normalizeOrderNumber(order) : null}
        origin={publicOrigin(await headers())}
        emailEnabled={getEditLinkMailer().enabled}
        lang={lang}
        dict={dict}
      />
    </>
  );
}
