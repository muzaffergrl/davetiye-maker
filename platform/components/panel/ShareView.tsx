'use client';
// The Share view (K29, G121, G140, G146). G181: loaded with the Share view.

import { Bookmark, Copy, ExternalLink, KeyRound, Link as LinkIcon, LockKeyhole, MessageCircle, MonitorSmartphone, QrCode as QrIcon, Send, Share2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { type PanelMeta } from '../../lib/panel/model.ts';
import type { AccessOutcome } from './usePanel.ts';
import { ShareMessage, ShareQr, type ShareFacts } from './ShareKit.tsx';
import { DownloadsCard } from './Downloads.tsx';
import { DevicesCard } from './DevicesCard.tsx';
import { GuestPasswordCard } from './GuestPassword.tsx';
import { Button, Card, cx, Disclosure } from './ui.tsx';
import styles from './panel.module.css';
import kit from './share-kit.module.css';
import { SHARE_LABELS as SL } from '../../lib/panel/share.ts';
import { t } from '../../lib/i18n/client.ts';

import { UrlText } from './UrlText.tsx';

// ---------------------------------------------------------------------------------------------
// Share (K29, G121; G140): the link with a big "Copy link" first, then Open / Share…; for a live website a short "ask guests
// to save the link" tip, the ready message with app links (WhatsApp, SMS, email, Messenger, Telegram) and the QR code with
// its options and printable card (folded); the guest password and the private edit link fold below; "Take the website
// offline" last, as a danger action. Texts: SHARE_LABELS (lib/panel/share.ts).

export function ShareView({
  url,
  slug,
  editKey,
  hideEditLink = false,
  deviceSession = false,
  origin = '',
  onNotice = () => undefined,
  meta,
  orderRef,
  online,
  names,
  date,
  replyBy,
  thankYouOn = false,
  themeColor = null,
  shareImage = null,
  onPublish,
  onOffline,
  onCopy,
  onGuestAccess,
}: {
  url: string;
  slug: string;
  editKey: string;
  /** G145: the shop's own link is open — never offer it as "your private edit link". */
  hideEditLink?: boolean;
  /** G146: opened with a device key (order number + email on /my), not the private edit link. */
  deviceSession?: boolean;
  /** G146: the platform's public origin (the /my address and its QR code in "Use on another device"). */
  origin?: string;
  /** G146: a short confirmation (snackbar). */
  onNotice?: (text: string) => void;
  meta: PanelMeta;
  orderRef: string | null;
  online: boolean;
  /** G140: filled into the ready message and the QR card. */
  names: string;
  date: string | null;
  replyBy: string | null;
  thankYouOn?: boolean;
  themeColor?: string | null;
  shareImage?: string | null;
  onPublish: () => void;
  onOffline: () => void;
  onCopy: (text: string, what: string) => void;
  /** Guest password on/off or a new one (G076). */
  onGuestAccess: (enabled: boolean, password?: string) => Promise<AccessOutcome>;
}) {
  const live = meta.status === 'published';
  const archived = meta.rights.archived;
  const [canShare, setCanShare] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    setEditUrl(`${window.location.origin}/edit/${slug}?k=${encodeURIComponent(editKey)}`);
  }, [slug, editKey]);
  const password = meta.guestAccess.enabled ? meta.guestAccess.password : null;
  const facts: ShareFacts = useMemo(() => ({ url, names, date, replyBy, password, thankYouOn }), [url, names, date, replyBy, password, thankYouOn]);
  const shareable = live && !archived;
  return (
    <div className={styles.stack}>
      <Card title={t(SL.linkTitle)} titleId="share-link" icon={LinkIcon}>
        <p className={styles.urlField} data-share-url>
          <UrlText url={url} />
        </p>
        {!live && !archived ? <p className={styles.hint}>{t(SL.linkNotLive)}</p> : null}
        <Button variant={live ? 'primary' : 'secondary'} block icon={Copy} className={kit.copyBig} onClick={() => onCopy(url, t(SL.linkCopied))} data-copy-link>
          {t(SL.copyLink)}
        </Button>
        <div className={kit.linkActions}>
          {live ? (
            <a className={cx(styles.btn, styles.btn_secondary)} href={url} target="_blank" rel="noopener noreferrer" data-open-site>
              <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>{t(SL.openWebsite)}</span>
            </a>
          ) : null}
          {canShare && shareable ? (
            <Button icon={Share2} onClick={() => void navigator.share({ url }).catch(() => undefined)} data-share-link>
              {t(SL.shareSystem)}
            </Button>
          ) : null}
          {!live && !archived ? (
            <Button variant="primary" icon={Send} onClick={onPublish}>
              {meta.publishedAt ? t(SL.publishAgain) : t(SL.publish)}
            </Button>
          ) : null}
        </div>
      </Card>

      {shareable && !thankYouOn ? (
        <p className={kit.tip} data-save-link-tip>
          <Bookmark size={20} strokeWidth={1.75} aria-hidden="true" />
          <span>
            <strong>{t(SL.saveLinkTitle)}</strong>
            {t(SL.saveLinkText)}
          </span>
        </p>
      ) : null}

      {shareable ? (
        <Card title={t(SL.messageTitle)} titleId="share-message" icon={MessageCircle}>
          <ShareMessage facts={facts} onCopy={onCopy} />
        </Card>
      ) : null}

      {/* G139: website PDF + printable invitation, in reach without opening anything. */}
      {!archived ? <DownloadsCard slug={slug} editKey={editKey} live={live} online={online} /> : null}

      {/* G121 (docs/18 §4 P2, Linktree): the QR code folds away like the password and the edit link (same title). */}
      {live ? (
        <Disclosure id="qr" title={t(SL.qrTitle)} icon={QrIcon}>
          <ShareQr facts={facts} fileBase={slug} themeColor={themeColor} shareImage={shareImage} />
        </Disclosure>
      ) : null}

      {!archived ? (
        <Disclosure id="password" title={t('Guest password')} status={meta.guestAccess.enabled ? t('On') : t('Off')} icon={LockKeyhole}>
          <GuestPasswordCard access={meta.guestAccess} online={online} onSave={onGuestAccess} onCopy={onCopy} bare />
        </Disclosure>
      ) : null}

      {hideEditLink ? null : (
      <Disclosure id="edit-link" title={t('Your private edit link')} icon={KeyRound}>
        <div className={styles.stack}>
          <p className={styles.cardText}>{t('Anyone with this link can edit your website. Share it only with your partner.')}</p>
          <Button variant="primary" block icon={Copy} disabled={!editUrl} onClick={() => onCopy(editUrl, t('Edit link copied'))} data-copy-edit-link>
            {t('Copy edit link')}
          </Button>
          {deviceSession ? (
            <p className={styles.hint} data-device-session="">
              {t('This device opened your editor with your order number and email, so this link is this device’s sign-in. It stops working if you sign out other devices from another device.')}
            </p>
          ) : null}
          <p className={styles.hint}>{t('Tip: add this page to your Home Screen to find your editor quickly.')}</p>
          {orderRef ? <p className={styles.hint}>{t('Your Etsy order number: {order}', { order: orderRef })}</p> : null}
        </div>
      </Disclosure>
      )}

      {/* G146: continue on a phone or another computer with the order number + email (not for the shop's own link). */}
      {hideEditLink ? null : (
        <Disclosure id="devices" title={t('Use on another device')} icon={MonitorSmartphone}>
          <DevicesCard slug={slug} editKey={editKey} origin={origin} orderRef={orderRef} online={online} onDone={onNotice} />
        </Disclosure>
      )}

      {live && !archived ? (
        <div className={styles.dangerZone}>
          <Button variant="dangerText" disabled={!online} onClick={onOffline}>
            {t('Take the website offline')}
          </Button>
          {!online ? <p className={styles.hint}>{t('Connect to the internet to change this.')}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
