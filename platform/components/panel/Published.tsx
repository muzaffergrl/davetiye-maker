'use client';
// The "Your website is live" screen (G100, docs/18 §1 P1; Givingli / Luma): first the link and Share · Copy · Open; the QR
// code and its PNG / SVG downloads fold under "More ways to share"; then two or three optional next steps, each opening a
// part of the editor that really exists (Photos, the first sample field, Guests, the guest password under Share).
// Used by the setup's last step (Setup.tsx) and by the first publish from the editor (Panel.tsx, the "live" sheet:
// LiveSheetBody, loaded when the sheet opens — G181).
// Copy feedback stays on the screen ("Copied" + a status line): a snackbar would sit over the next buttons here.

import { Check, ChevronRight, CircleCheckBig, Copy, ExternalLink, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ContentRecord } from '../../lib/content/types.ts';
import { photoAt, type PanelTheme, type PublishNote } from '../../lib/panel/model.ts';
import { QrCode } from './QrCode.tsx';
import { Button, cx, Disclosure } from './ui.tsx';
import { UrlText } from './UrlText.tsx';
import styles from './panel.module.css';
import { t, tn } from '../../lib/i18n/client.ts';

/** The link, Share / Copy / Open, and the QR code folded under "More ways to share". */
export function LiveShare({ url, fileBase, level = 2 }: { url: string; fileBase: string; level?: 2 | 3 }) {
  const [canShare, setCanShare] = useState(false);
  const [copyState, setCopyState] = useState<'copied' | 'failed' | null>(null);
  const copied = copyState === 'copied';
  useEffect(() => setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function'), []);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopyState(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };
  return (
    <div className={styles.liveShare} data-live-share>
      <p className={styles.liveShareLink}>
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.bigUrl} data-live-link>
          <UrlText url={url} />
        </a>
      </p>
      {/* Phones: Share (the system sheet: Messages, WhatsApp, mail…) is the main action; elsewhere Copy link. */}
      <div className={cx(styles.buttonRow, styles.liveShareButtons)}>
        {canShare ? (
          <Button variant="primary" icon={Share2} onClick={() => void navigator.share({ url }).catch(() => undefined)} data-share-link>
            {t('Share')}
          </Button>
        ) : null}
        <Button variant={canShare ? 'secondary' : 'primary'} icon={copied ? Check : Copy} onClick={() => void copy()} data-copy-link>
          {copied ? t('Copied') : t('Copy link')}
        </Button>
        <a href={url} target="_blank" rel="noopener noreferrer" className={cx(styles.btn, styles.btn_secondary)} data-open-site>
          <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
          <span>{t('Open website')}</span>
        </a>
      </div>
      <p role="status" className={copyState === 'failed' ? styles.hint : styles.visuallyHidden} data-copy-status>
        {copyState === 'copied' ? t('Link copied') : copyState === 'failed' ? t('Could not copy. Press and hold the link above to copy it.') : ''}
      </p>
      <Disclosure id="more-ways" title={t('More ways to share')} status={t('QR code')} level={level}>
        <div className={styles.stack}>
          <p className={styles.hint}>
            {t('A QR code for printed cards and signs: it opens {address}. Scan it once with your phone camera before you print it.', { address: url.replace(/^https?:\/\//, '') })}
          </p>
          <QrCode url={url} fileBase={fileBase} />
        </div>
      </Disclosure>
    </div>
  );
}

export interface AfterStep {
  key: 'photos' | 'sample' | 'guests' | 'password';
  title: string;
  text: string;
  /** A view ("#edit/photos") or a content path (the panel's goTo opens the field). */
  path: string;
}

/** Two or three optional next steps after the first publish, only to parts of the editor that exist. */
export function afterPublishSteps(content: ContentRecord, theme: Pick<PanelTheme, 'photos'>, sample: PublishNote[]): AfterStep[] {
  const steps: AfterStep[] = [];
  const filled = theme.photos.filter((s) => photoAt(content, s.source)).length;
  if (theme.photos.length && filled < theme.photos.length) {
    steps.push({ key: 'photos', title: t('Add your photos'), text: t('{filled} of {total} added. Each one is cropped to fit the design.', { filled, total: theme.photos.length }), path: '#edit/photos' });
  }
  if (sample.length) {
    steps.push({
      key: 'sample',
      title: t('Replace the sample text'),
      text: tn(sample.length, '{n} field still shows the design’s text, such as the venue.', '{n} fields still show the design’s text, such as the venue.'),
      path: sample[0].path,
    });
  }
  if (content.rsvp?.method !== 'none') steps.push({ key: 'guests', title: t('See replies'), text: t('Your guests’ replies arrive under Guests.'), path: '#guests' });
  steps.push({ key: 'password', title: t('Add a guest password'), text: t('Optional: only people with the password can open your website.'), path: '#share' });
  return steps.slice(0, 3);
}

export function AfterPublish({ steps, onGo, level = 2 }: { steps: AfterStep[]; onGo: (path: string) => void; level?: 2 | 3 }) {
  if (!steps.length) return null;
  const Heading = level === 3 ? 'h3' : 'h2';
  return (
    <section className={styles.afterPublish} aria-labelledby="after-publish-title" data-after-publish>
      <Heading id="after-publish-title" className={styles.afterTitle}>
        {t('Next, if you like')}
      </Heading>
      <ul className={styles.afterList}>
        {steps.map((s) => (
          <li key={s.key}>
            <button type="button" className={styles.afterItem} onClick={() => onGo(s.path)} data-after-step={s.key}>
              <span className={styles.afterItemText}>
                <span className={styles.afterItemTitle}>{s.title}</span>
                <span className={styles.afterItemSub}>{s.text}</span>
              </span>
              <ChevronRight size={20} aria-hidden="true" className={styles.chev} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The editor's "Your website is live" / "Share your website" sheet (G100). G181: Panel.tsx loads it when the sheet opens. */
export function LiveSheetBody({
  justPublished,
  url,
  fileBase,
  content,
  theme,
  sample,
  onGo,
}: {
  justPublished: boolean;
  url: string;
  fileBase: string;
  content: ContentRecord;
  theme: Pick<PanelTheme, 'photos'>;
  sample: PublishNote[];
  onGo: (path: string) => void;
}) {
  return (
    <>
      {/* G100 (docs/18 §1): the link and Share first; the QR code under "More ways to share"; then optional steps. */}
      {justPublished ? (
        <p className={styles.liveLead}>
          <CircleCheckBig size={22} strokeWidth={1.75} aria-hidden="true" /> {t('Guests can open your website at:')}
        </p>
      ) : (
        <p>{t('Guests can open your website at:')}</p>
      )}
      <LiveShare url={url} fileBase={fileBase} level={3} />
      {justPublished ? <AfterPublish steps={afterPublishSteps(content, theme, sample)} onGo={onGo} level={3} /> : null}
    </>
  );
}
