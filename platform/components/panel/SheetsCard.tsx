'use client';
// Guests → "Google Sheets" (G128): one button to connect, then a live copy of the replies in the couple's own Drive.
//   not set up (no GOOGLE_* env)  a quiet "coming soon" line
//   not connected                 one sentence + "Connect Google Sheets" (Google's consent page, then back here)
//   connected                     "Connected · Last synced 4:05 PM" + Open sheet · Sync now · Disconnect
//   sync failed                   "Sync failed — <reason>" + Sync now (Google refused the connection: Connect again)
// Status: GET /api/edit/<slug>/google (lib/google/api.ts), read on open and whenever the page comes back into view.

import { CircleCheckBig, ExternalLink, RefreshCw, Sheet as SheetIcon, Unplug } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { PanelApi } from './api.ts';
import { Sheet } from './Sheet.tsx';
import { Badge, Banner, Button, Card, cx, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';
import own from './sheets-card.module.css';

interface Status {
  available: boolean;
  connected: boolean;
  url: string | null;
  lastSyncAt: string | null;
  error: string | null;
  errorAt: string | null;
  reconnect: boolean;
}

/** Key of this tab's sessionStorage that takes the couple back here after Google (public/rsvp/google-return.js). */
const RETURN_KEY = 'bke:google-return';

function when(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const today = new Date().toDateString() === d.toDateString();
  return today ? time : `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
}

export function SheetsCard({ api, online, archived }: { api: PanelApi; online: boolean; archived: boolean }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState<'connect' | 'sync' | 'disconnect' | null>(null);
  const [confirm, setConfirm] = useState(false);
  const snack = useSnackbar();

  const load = useCallback(async () => {
    const res = await api.googleStatus();
    if (res.ok && res.body.status) setStatus(res.body.status as unknown as Status);
  }, [api]);

  useEffect(() => {
    void load();
    const onShow = () => document.visibilityState === 'visible' && void load();
    document.addEventListener('visibilitychange', onShow);
    return () => document.removeEventListener('visibilitychange', onShow);
  }, [load]);

  if (!status) return null;
  if (!status.available) {
    return (
      <p className={cx(styles.hint)} data-sheets="soon">
        Google Sheets: coming soon. Until then, download the Excel file — it opens in Google Sheets too.
      </p>
    );
  }

  const connect = async () => {
    setBusy('connect');
    const res = await api.googleAction('connect');
    if (res.ok && typeof res.body.url === 'string') {
      try {
        window.sessionStorage.setItem(RETURN_KEY, window.location.pathname + window.location.search);
      } catch {
        /* the page after Google then says how to come back */
      }
      window.location.assign(res.body.url);
      return;
    }
    setBusy(null);
    snack(res.body.message ?? 'Google Sheets could not be connected. Please try again.');
  };

  const run = async (action: 'sync' | 'disconnect') => {
    setBusy(action);
    const res = await api.googleAction(action);
    setBusy(null);
    setConfirm(false);
    if (res.ok && res.body.status) {
      const next = res.body.status as unknown as Status;
      setStatus(next);
      if (action === 'disconnect') snack('Google Sheets disconnected. Your spreadsheet stays in your Google Drive.');
      else snack(next.error ? 'Sync failed. Please try again later.' : 'Your Google Sheet is up to date.');
    } else {
      snack(res.body.message ?? 'Something went wrong. Please try again.');
    }
  };

  const synced = when(status.lastSyncAt);
  return (
    <Card title="Google Sheets" titleId="sheets-title" icon={SheetIcon} data-sheets={status.connected ? (status.error ? 'failed' : 'connected') : 'off'}>
      {!status.connected ? (
        <>
          <p className={styles.hint}>
            Keep a live copy of your replies in your own Google Drive. Every new reply is added on its own, and the columns follow your reply form.
          </p>
          <div className={styles.buttonRow}>
            <Button variant="primary" icon={SheetIcon} busy={busy === 'connect'} busyLabel="Opening Google…" disabled={!online || archived} onClick={() => void connect()} data-sheets-connect>
              Connect Google Sheets
            </Button>
          </div>
          <p className={styles.hint}>Google asks you to allow access to the files this website makes. It cannot see anything else in your Drive.</p>
        </>
      ) : (
        <>
          <p className={own.line}>
            <Badge tone={status.error ? 'warning' : 'success'} icon={status.error ? undefined : CircleCheckBig}>
              {status.error ? 'Sync failed' : 'Connected'}
            </Badge>{' '}
            <span className={styles.hint} data-sheets-synced>
              {synced ? `Last synced ${synced}` : 'Not synced yet'}
            </span>
          </p>
          {status.error ? (
            <Banner
              tone="warning"
              role="status"
              data-sheets-error
              actions={
                status.reconnect ? (
                  <Button small variant="primary" busy={busy === 'connect'} busyLabel="Opening Google…" disabled={!online || archived} onClick={() => void connect()}>
                    Connect again
                  </Button>
                ) : (
                  <Button small icon={RefreshCw} busy={busy === 'sync'} busyLabel="Syncing…" disabled={!online} onClick={() => void run('sync')}>
                    Sync now
                  </Button>
                )
              }
            >
              {status.error}
            </Banner>
          ) : null}
          <div className={styles.buttonRow}>
            {status.url ? (
              <a className={cx(styles.btn, styles.btn_secondary)} href={status.url} target="_blank" rel="noreferrer noopener" data-sheets-open>
                <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
                <span>Open sheet</span>
              </a>
            ) : null}
            {!status.error ? (
              <Button variant="tertiary" icon={RefreshCw} busy={busy === 'sync'} busyLabel="Syncing…" disabled={!online} onClick={() => void run('sync')} data-sheets-sync>
                Sync now
              </Button>
            ) : null}
            <Button variant="tertiary" icon={Unplug} disabled={!online} onClick={() => setConfirm(true)} data-sheets-disconnect>
              Disconnect
            </Button>
          </div>
        </>
      )}
      {confirm ? (
        <Sheet title="Disconnect Google Sheets?" onClose={() => setConfirm(false)} closeLabel="Cancel" testId="sheets-disconnect">
          <p>Your spreadsheet stays in your Google Drive with the replies it has now. New replies are no longer added to it.</p>
          <div className={styles.buttonRow}>
            <Button variant="danger" icon={Unplug} busy={busy === 'disconnect'} busyLabel="Disconnecting…" disabled={!online} onClick={() => void run('disconnect')} data-sheets-confirm-disconnect>
              Disconnect
            </Button>
            <Button onClick={() => setConfirm(false)}>Keep connected</Button>
          </div>
        </Sheet>
      ) : null}
    </Card>
  );
}
