'use client';
// Share → "Downloads" (G139): the website as one PDF, and the printable invitation of the design (5×7 in / A5, bleed,
// crop marks, back side). Each button posts to /api/edit/<slug>/download (lib/print/api.ts) with the edit key in the
// Authorization header, waits for the PDF (a spinner and a line saying it can take up to a minute) and saves it.
// Texts: lib/print/labels.ts (one place for the coming languages).

import { Download, FileText, Mail } from 'lucide-react';
import { useState } from 'react';
import { PRINT_LABELS, type PrintLabelKey } from '../../lib/print/labels.ts';
import { t } from '../../lib/i18n/client.ts';

/** G144: the card's words in the panel's language (keys = the English labels, lib/print/labels.ts). */
const printLabel = (key: PrintLabelKey) => t(PRINT_LABELS.en[key]);
import { Banner, Button, Card, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';
import own from './downloads.module.css';

type Kind = 'site' | 'invitation';

function saveBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function fileName(res: Response, fallback: string): string {
  const m = /filename="([^"]+)"/.exec(res.headers.get('content-disposition') ?? '');
  return m ? m[1] : fallback;
}

export function DownloadsCard({ slug, editKey, live, online }: { slug: string; editKey: string; live: boolean; online: boolean }) {
  const snack = useSnackbar();
  const [busy, setBusy] = useState<Kind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<'5x7' | 'a5'>('5x7');
  const [bleed, setBleed] = useState(false);
  const [marks, setMarks] = useState(false);
  const [back, setBack] = useState(true);

  async function run(kind: Kind) {
    if (busy) return;
    setBusy(kind);
    setError(null);
    try {
      const body = kind === 'site' ? { kind } : { kind, size, bleed, marks: bleed && marks, back };
      const res = await fetch(`/api/edit/${encodeURIComponent(slug)}/download`, {
        method: 'POST',
        cache: 'no-store',
        headers: { Authorization: `Bearer ${editKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok || res.headers.get('content-type') !== 'application/pdf') {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message ? t(data.message) : printLabel('panel_failed'));
        return;
      }
      saveBlob(await res.blob(), fileName(res, `${slug}.pdf`));
      snack(printLabel('panel_done'));
    } catch {
      setError(printLabel('panel_failed'));
    } finally {
      setBusy(null);
    }
  }

  const disabled = !online || busy !== null;
  return (
    <Card title={printLabel('panel_title')} titleId="downloads" icon={Download} data-downloads>
      <p className={styles.cardText}>{printLabel('panel_intro')}</p>
      {!live ? <p className={styles.hint}>{printLabel('panel_unpublished')}</p> : null}
      {error ? (
        <Banner tone="danger" role="alert" data-download-error>
          {error}
        </Banner>
      ) : null}
      {busy ? (
        <p className={styles.hint} role="status" data-download-busy>
          {printLabel('panel_working')}
        </p>
      ) : null}

      <div className={own.block}>
        <Button variant="primary" block icon={FileText} busy={busy === 'site'} busyLabel={printLabel('panel_working')} disabled={disabled} onClick={() => void run('site')} data-download-site>
          {printLabel('panel_site_button')}
        </Button>
        <p className={styles.hint}>{printLabel('panel_site_hint')}</p>
      </div>

      <fieldset className={own.block} disabled={disabled}>
        <legend className={own.legend}>{printLabel('panel_invite_title')}</legend>
        <div className={own.sizes} role="radiogroup" aria-label={printLabel('panel_size_label')}>
          {(['5x7', 'a5'] as const).map((s) => (
            <label key={s} className={own.size}>
              <input type="radio" name="invite-size" value={s} checked={size === s} onChange={() => setSize(s)} data-invite-size={s} />
              <span>{printLabel(s === '5x7' ? 'panel_size_5x7' : 'panel_size_a5')}</span>
            </label>
          ))}
        </div>
        <label className={own.option}>
          <input type="checkbox" checked={back} onChange={(e) => setBack(e.target.checked)} data-invite-back />
          <span>{printLabel('panel_back')}</span>
        </label>
        <label className={own.option}>
          <input type="checkbox" checked={bleed} onChange={(e) => setBleed(e.target.checked)} data-invite-bleed />
          <span>{printLabel('panel_bleed')}</span>
        </label>
        <label className={own.option}>
          <input type="checkbox" checked={bleed && marks} disabled={!bleed} onChange={(e) => setMarks(e.target.checked)} data-invite-marks />
          <span>{printLabel('panel_marks')}</span>
        </label>
        <Button variant="secondary" block icon={Mail} busy={busy === 'invitation'} busyLabel={printLabel('panel_working')} disabled={disabled} onClick={() => void run('invitation')} data-download-invitation>
          {printLabel('panel_invite_button')}
        </Button>
      </fieldset>
      {!online ? <p className={styles.hint}>{printLabel('panel_offline')}</p> : null}
    </Card>
  );
}
