// /start?theme=<theme> — the buyer starts their website after buying a design on Etsy (G045).
// Theme preview (live demo in a small iframe) + form: Etsy order number, email, names, address.
// The form posts to /api/start (lib/claim/) and shows the secret edit link once.
// Unknown, internal or demo-less themes get a friendly page listing the designs that can be started.
// G080: BKE Studio look of the edit panel (StartShell); in production a design that is not approved for sale yet
// (lib/themes/approval.ts) answers 404 with an honest message (not-found.tsx) and is left out of the list.
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { demoBase } from '../../lib/claim/demo-page.ts';
import { getEditLinkMailer } from '../../lib/claim/mailer.ts';
import { claimableTheme } from '../../lib/claim/themes.ts';
import { publicOrigin } from '../../lib/panel/http.ts';
import { themeOpenForClaims } from '../../lib/themes/approval.ts';
import StartForm from './StartForm.tsx';
import { offeredThemes } from '../../lib/themes/offered.ts';
import { DesignList, StartShell } from './shell.tsx';
import styles from './start.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Start your wedding website',
  robots: { index: false, follow: false },
  // After a claim the secret edit link is on this page; never send this URL anywhere.
  referrer: 'no-referrer',
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function StartPage({ searchParams }: Props) {
  const { theme } = await searchParams;
  const requested = typeof theme === 'string' && theme ? theme : null;
  const found = requested ? await claimableTheme(requested) : null;

  // A real design that is still in review: 404 + the honest "not available yet" page (production only).
  if (found && !themeOpenForClaims(found.id)) notFound();

  if (!found) {
    const themes = await offeredThemes();
    return (
      <StartShell>
        <div className={styles.narrow}>
          <p className={styles.eyebrow}>Your wedding website</p>
          <h1 className={styles.title}>{requested ? 'This start link is not valid' : 'Choose your design'}</h1>
          <p className={styles.lead}>
            {requested
              ? 'We could not find this design. Please open the start link from your Etsy download again.'
              : 'Please open the start link from your Etsy download.'}
            {themes.length ? ' You can also choose the design you bought here:' : ''}
          </p>
          <DesignList themes={themes} />
        </div>
      </StartShell>
    );
  }

  return (
    <StartForm
      theme={{ id: found.id, name: found.name, partnerCount: found.partnerCount, demoUrl: demoBase(found.id) }}
      origin={publicOrigin(await headers())}
      emailEnabled={getEditLinkMailer().enabled}
    />
  );
}
