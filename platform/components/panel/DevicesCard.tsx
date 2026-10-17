'use client';
// "Use on another device" (G146, Share): how to open the editor on a phone or another computer — <origin>/my with the
// Etsy order number and email (no account, no password) —, a QR code of that page (made from the real address, no key
// in it: lib/qr.ts), and the devices signed in with the order number, with "Sign out other devices" (device keys only;
// the private edit link never changes). Data: GET / POST /api/edit/<slug>/devices (lib/panel/devices.ts).

import { LogOut } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t, tn, uiLang } from '../../lib/i18n/client.ts';
import { QR_BORDER, qrMatrix, qrPathData } from '../../lib/qr.ts';
import { QR_BLACK, QR_LIGHT } from '../../lib/panel/share.ts';
import { Badge, Button } from './ui.tsx';
import styles from './panel.module.css';
import own from './devices.module.css';

interface DeviceRow {
  id: string;
  label: string;
  createdAt: string;
  via: 'continue' | 'start' | 'email';
  current: boolean;
}

interface DevicesAnswer {
  ok?: boolean;
  access?: 'owner' | 'shop' | 'device';
  devices?: DeviceRow[];
  removed?: number;
  message?: string;
}

function when(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const lang = uiLang();
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

/** QR code of the /my page (no secret in it): scanning it on a phone opens the page, the order number + email do the rest. */
function MyPageQr({ url }: { url: string }) {
  const qr = useMemo(() => {
    try {
      return qrMatrix(url);
    } catch {
      return null;
    }
  }, [url]);
  if (!qr) return null;
  const side = qr.size + QR_BORDER * 2;
  return (
    <svg
      className={own.qr}
      viewBox={`0 0 ${side} ${side}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={t('QR code that opens {url}', { url })}
      data-devices-qr={qr.text}
    >
      <rect width={side} height={side} fill={QR_LIGHT} />
      <path d={qrPathData(qr)} fill={QR_BLACK} />
    </svg>
  );
}

export function DevicesCard({
  slug,
  editKey,
  origin,
  orderRef,
  online,
  onDone,
}: {
  slug: string;
  editKey: string;
  /** The platform's public origin (panel state). */
  origin: string;
  orderRef: string | null;
  online: boolean;
  /** A short confirmation (snackbar). */
  onDone: (text: string) => void;
}) {
  const myUrl = `${origin.replace(/\/+$/, '')}/my`;
  const shownUrl = myUrl.replace(/^https?:\/\//, '');
  const [devices, setDevices] = useState<DeviceRow[] | null>(null);
  const [access, setAccess] = useState<DevicesAnswer['access'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const call = useCallback(
    async (init?: RequestInit): Promise<DevicesAnswer | null> => {
      try {
        const res = await fetch(`/api/edit/${encodeURIComponent(slug)}/devices`, {
          cache: 'no-store',
          credentials: 'same-origin',
          ...init,
          headers: { Authorization: `Bearer ${editKey}`, ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
        });
        const body = (await res.json().catch(() => ({}))) as DevicesAnswer;
        if (!res.ok || body.ok === false) {
          setError(body.message ? t(body.message) : t('Something went wrong. Please try again.'));
          return null;
        }
        setError(null);
        return body;
      } catch {
        setError(t('No connection. Please check your internet connection and try again.'));
        return null;
      }
    },
    [slug, editKey],
  );

  useEffect(() => {
    let live = true;
    void call().then((body) => {
      if (!live || !body) return;
      setDevices(body.devices ?? []);
      setAccess(body.access ?? null);
    });
    return () => {
      live = false;
    };
  }, [call]);

  const others = devices ? devices.filter((d) => !d.current).length : 0;

  async function signOutOthers() {
    if (busy) return;
    setBusy(true);
    const body = await call({ method: 'POST', body: JSON.stringify({ action: 'sign-out-others' }) });
    setBusy(false);
    if (!body) return;
    setDevices(body.devices ?? []);
    onDone(t('Other devices are signed out.'));
  }

  return (
    <div className={styles.stack} data-devices="">
      <p className={styles.cardText}>
        {t('On your phone or another computer, open {address} and enter your Etsy order number and email.', { address: shownUrl })}
      </p>
      {orderRef ? <p className={styles.hint}>{t('Your Etsy order number: {order}', { order: orderRef })}</p> : null}
      <div className={own.qrRow}>
        <MyPageQr url={myUrl} />
        <p className={styles.hint}>{t('Scan this code with your phone camera. It opens the page only; your order number and email open your editor.')}</p>
      </div>
      <p className={styles.hint}>{t('No account or password. Your changes are saved online, so you continue where you left off.')}</p>

      <div className={own.devices} aria-live="polite">
        <h3 className={own.title}>{t('Signed-in devices')}</h3>
        {devices === null && !error ? <p className={styles.hint}>{t('Loading…')}</p> : null}
        {devices && devices.length === 0 ? (
          <p className={styles.hint} data-devices-count="0">
            {t('No device has signed in with your order number yet.')}
          </p>
        ) : null}
        {devices && devices.length > 0 ? (
          <>
            <p className={styles.hint} data-devices-count={devices.length}>
              {tn(devices.length, 'Signed in on {n} device with your order number.', 'Signed in on {n} devices with your order number.')}
            </p>
            <ul className={own.list}>
              {devices.map((d) => (
                <li key={d.id} className={own.item} data-device={d.id}>
                  <span className={own.name}>{d.label || (d.via === 'email' ? t('Sign-in link by email') : t('Unknown device'))}</span>
                  <span className={own.meta}>{t('since {date}', { date: when(d.createdAt) })}</span>
                  {d.current ? <Badge tone="success">{t('This device')}</Badge> : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {error ? (
          <p className={styles.hint} role="alert">
            {error}
          </p>
        ) : null}
        {others > 0 && access !== 'shop' ? (
          <Button icon={LogOut} disabled={!online || busy} onClick={() => void signOutOthers()} data-sign-out-others="">
            {busy ? t('Signing out…') : t('Sign out other devices')}
          </Button>
        ) : null}
        <p className={styles.hint}>{t('Signing out other devices does not change your private edit link.')}</p>
      </div>
    </div>
  );
}
