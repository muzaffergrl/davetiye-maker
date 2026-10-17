'use client';
// Share (G140, K45 item 6): the ready message with app links, the QR options and the printable QR card. ShareView
// (views.tsx) places them under the link card. Texts: SHARE_LABELS (lib/panel/share.ts); logic is pure and tested there.
//
// Phones get the system share sheet ("Share…", navigator.share) first; every device gets the app links (SMS and
// Messenger only on a touch phone, where they open an app) and "Copy message" as the fallback.
// The card is drawn on a canvas at 300 dpi (any script, the design's colour and its share image — a GPT piece with no names
// on it — when the design has one, otherwise clean type only) and wrapped as a one-page PDF (lib/panel/card-pdf.ts).

import { Copy, FileDown, Mail, MessageCircle, MessageSquareText, MessagesSquare, RotateCcw, Send, Share2, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { jpegPdf } from '../../lib/panel/card-pdf.ts';
import {
  cardTextColour,
  messageKinds,
  QR_BLACK,
  QR_LIGHT,
  QR_PNG_SIZES,
  qrInk,
  shareAppLinks,
  shareMessage,
  SHARE_LABELS as L,
  type MessageKind,
  type QrSizeKey,
  type ShareApp,
} from '../../lib/panel/share.ts';
import { QR_BORDER, qrMatrix } from '../../lib/qr.ts';
import { Switch } from './fields.tsx';
import { download, QrCode } from './QrCode.tsx';
import { Button, Segmented } from './ui.tsx';
import { t } from '../../lib/i18n/client.ts';
import styles from './panel.module.css';
import own from './share-kit.module.css';

const APP_ICONS: Record<ShareApp, LucideIcon> = {
  whatsapp: MessageCircle,
  sms: MessageSquareText,
  email: Mail,
  messenger: MessagesSquare,
  telegram: Send,
};

/** App names that are brands: shown as they are, in every language. */
const BRAND_APPS: ReadonlySet<ShareApp> = new Set(['whatsapp', 'messenger', 'telegram']);

const KIND_LABELS: Record<MessageKind, string> = { invite: L.kindInvite, reminder: L.kindReminder, thanks: L.kindThanks };

/** Touch phone / tablet (system share sheet, sms:, fb-messenger:) — read after mount, so the first render matches the server. */
function useDevice() {
  const [d, setD] = useState({ canShare: false, phone: false });
  useEffect(() => {
    setD({
      canShare: typeof navigator !== 'undefined' && typeof navigator.share === 'function',
      phone:
        (typeof window.matchMedia === 'function' && window.matchMedia('(any-pointer: coarse)').matches) || (navigator.maxTouchPoints ?? 0) > 0,
    });
  }, []);
  return d;
}

export interface ShareFacts {
  url: string;
  names: string;
  /** Long date in the website's style; null when not set. */
  date: string | null;
  /** Replies close; null when the website takes no replies. */
  replyBy: string | null;
  /** The guest password when protection is on, else null. */
  password: string | null;
  thankYouOn: boolean;
}

// ---------------------------------------------------------------------------------------------
// Message + app links

export function ShareMessage({ facts, onCopy }: { facts: ShareFacts; onCopy: (text: string, what: string) => void }) {
  const ids = useId();
  const { canShare, phone } = useDevice();
  const kinds = messageKinds(facts.thankYouOn, facts.replyBy);
  const [kind, setKind] = useState<MessageKind>(kinds[0]);
  const [withPassword, setWithPassword] = useState(false);
  const [edited, setEdited] = useState<string | null>(null);
  const current = kinds.includes(kind) ? kind : kinds[0];
  const ready = shareMessage(current, { ...facts, password: withPassword ? facts.password : null });
  const text = edited ?? ready;
  // A new kind or the password switch writes a fresh message (the couple's edits were for the other one).
  useEffect(() => setEdited(null), [current, withPassword]);
  const subject = t(facts.thankYouOn ? L.emailSubjectThanks : L.emailSubject);
  const links = shareAppLinks(text, facts.url, subject).filter((l) => phone || !l.phoneOnly);
  return (
    <div className={styles.stack} data-share-message>
      <p className={styles.cardText}>{t(L.messageLead)}</p>
      {kinds.length > 1 ? <Segmented label={t('Message')} value={current} options={kinds.map((k) => ({ value: k, label: t(KIND_LABELS[k]) }))} onChange={setKind} /> : null}
      <div className={styles.field}>
        <label htmlFor={`${ids}-msg`} className={styles.label}>
          {t(L.messageLabel)}
        </label>
        <span id={`${ids}-msg-help`} className={styles.hint}>
          {t(L.messageHelp)}
        </span>
        <textarea
          id={`${ids}-msg`}
          aria-describedby={`${ids}-msg-help`}
          className={`${styles.textarea} ${own.message}`}
          value={text}
          maxLength={1000}
          onChange={(e) => setEdited(e.target.value)}
          data-share-text
        />
      </div>
      {facts.password ? (
        <Switch id={`${ids}-pw`} label={t(L.includePassword)} hint={t(L.includePasswordHelp)} checked={withPassword} onChange={setWithPassword} />
      ) : null}
      {edited !== null && edited !== ready ? (
        <div className={own.messageFoot}>
          <Button small variant="tertiary" icon={RotateCcw} onClick={() => setEdited(null)} data-reset-message>
            {t(L.resetMessage)}
          </Button>
        </div>
      ) : null}
      <h3 className={own.sub}>{t(L.sendWith)}</h3>
      <div className={styles.buttonRow} style={{ marginTop: 0 }}>
        {canShare ? (
          <Button variant="primary" icon={Share2} onClick={() => void navigator.share({ title: subject, text }).catch(() => undefined)} data-share-system>
            {t(L.shareSystem)}
          </Button>
        ) : null}
        <Button variant={canShare ? 'secondary' : 'primary'} icon={Copy} onClick={() => onCopy(text, t(L.messageCopied))} data-copy-message>
          {t(L.copyMessage)}
        </Button>
      </div>
      <ul className={own.apps} data-share-apps>
        {links.map((l) => {
          const Icon = APP_ICONS[l.app];
          const external = l.href.startsWith('https:');
          return (
            <li key={l.app}>
              <a className={own.app} href={l.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} data-share-app={l.app}>
                <span className={own.appMark} aria-hidden="true">
                  <Icon size={16} strokeWidth={2} />
                </span>
                <span>{BRAND_APPS.has(l.app) ? L[l.label] : t(L[l.label])}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// QR options + printable card

export function ShareQr({ facts, fileBase, themeColor, shareImage }: { facts: ShareFacts; fileBase: string; themeColor: string | null; shareImage: string | null }) {
  const ids = useId();
  const designInk = qrInk(themeColor);
  const [colour, setColour] = useState<'black' | 'design'>('black');
  const [size, setSize] = useState<QrSizeKey>('medium');
  const ink = colour === 'design' && designInk ? designInk : QR_BLACK;
  const px = QR_PNG_SIZES.find((s) => s.key === size)?.px ?? 1200;
  return (
    <div className={styles.stack} data-share-qr>
      <p className={styles.hint}>{t(L.qrLead)}</p>
      <div className={styles.shareQr}>
        <QrCode url={facts.url} fileBase={fileBase} ink={ink} pngPx={px}>
          <div className={own.options}>
            {designInk ? (
              <Segmented
                label={t(L.qrColour)}
                value={colour}
                onChange={setColour}
                options={[
                  { value: 'black', label: t(L.qrBlack) },
                  { value: 'design', label: t(L.qrDesign) },
                ]}
              />
            ) : null}
            <Segmented label={`${t(L.qrSize)} (PNG)`} value={size} onChange={setSize} options={QR_PNG_SIZES.map((s) => ({ value: s.key, label: t(s.label) }))} />
            <p className={styles.hint}>{t(L.svgHelp)}</p>
          </div>
        </QrCode>
      </div>
      <QrCard facts={facts} ids={ids} fileBase={fileBase} themeColor={themeColor} shareImage={shareImage} ink={ink} />
    </div>
  );
}

const CARD_W = 1200; // 4 in at 300 dpi
const CARD_H = 1800; // 6 in

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Largest font size (px) ≤ start at which `text` fits `width`. */
function fit(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, start: number, min: number, width: number): number {
  let px = start;
  for (; px > min; px -= 2) {
    ctx.font = font(px);
    if (ctx.measureText(text).width <= width) break;
  }
  ctx.font = font(px);
  return px;
}

/** The card as a JPEG on a canvas: [image band] · names · date · QR on white · scan line · address · [password]. */
export async function drawCard(o: {
  facts: ShareFacts;
  password: string | null;
  background: string;
  ink: string;
  image: string | null;
}): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  const fg = cardTextColour(o.background);
  ctx.fillStyle = o.background;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  const img = o.image ? await loadImage(o.image) : null;
  let top = 80;
  if (img && img.naturalWidth) {
    // The design's share image (no names on it) as a band across the top, cropped to fill.
    const bandH = 520;
    const scale = Math.max(CARD_W / img.naturalWidth, bandH / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, CARD_W, bandH);
    ctx.clip();
    ctx.drawImage(img, (CARD_W - w) / 2, (bandH - h) / 2, w, h);
    ctx.restore();
    top = bandH + 40;
  }
  const serif = (px: number) => `500 ${px}px Georgia, "Times New Roman", serif`;
  const sans = (px: number) => `600 ${px}px "Helvetica Neue", Arial, sans-serif`;
  const width = CARD_W - 160;
  const cx = CARD_W / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = fg;
  const qr = qrMatrix(o.facts.url);
  const side = qr.size + QR_BORDER * 2;
  // The text block is laid out twice: once to measure it, then drawn centred in the room under the image band.
  const layout = (start: number, qrBox: number, dry: boolean): number => {
    const put = (text: string, x: number, at: number) => {
      if (!dry) ctx.fillText(text, x, at);
    };
    let y = start;
    // Names: one line, or two around "&" when one line would be too small.
    const names = o.facts.names.trim() || ' ';
    const one = fit(ctx, names, serif, img ? 100 : 120, 40, width);
    if (one < 72 && /\s&\s/.test(names)) {
      const [a, b] = names.split(/\s&\s/, 2);
      const px = Math.min(fit(ctx, a, serif, 100, 40, width), fit(ctx, `& ${b}`, serif, 100, 40, width));
      ctx.font = serif(px);
      put(a, cx, y + px * 0.8);
      put(`& ${b}`, cx, y + px * 1.95);
      y += px * 2.2;
    } else {
      put(names, cx, y + one * 0.8);
      y += one * 1.15;
    }
    if (o.facts.date) {
      fit(ctx, o.facts.date.toUpperCase(), sans, 40, 24, width);
      ctx.globalAlpha = 0.85;
      put(o.facts.date.toUpperCase(), cx, y + 50);
      ctx.globalAlpha = 1;
      y += 80;
    }
    // QR on a white square (always dark-on-light, whatever the design colour).
    const box = qrBox;
    const mod = Math.floor(box / side);
    const qrPx = mod * side;
    const qx = Math.round(cx - qrPx / 2);
    const qy = Math.round(y + 40);
    ctx.fillStyle = QR_LIGHT;
    if (!dry) {
      ctx.fillRect(qx - 12, qy - 12, qrPx + 24, qrPx + 24);
      ctx.fillStyle = o.ink;
      qr.modules.forEach((row, my) => row.forEach((dark, mx) => dark && ctx.fillRect(qx + (mx + QR_BORDER) * mod, qy + (my + QR_BORDER) * mod, mod, mod)));
    }
    y = qy + qrPx + 12 + 70;
    ctx.fillStyle = fg;
    const scan = t(o.facts.thankYouOn ? L.cardScanThanks : L.cardScan);
    fit(ctx, scan, serif, 46, 26, width);
    put(scan, cx, y);
    y += 56;
    const address = o.facts.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    fit(ctx, address, sans, 32, 18, width);
    ctx.globalAlpha = 0.85;
    put(address, cx, y);
    ctx.globalAlpha = 1;
    if (o.password) {
      y += 60;
      const line = `${t(L.cardPasswordLine)}: ${o.password}`;
      fit(ctx, line, sans, 34, 18, width);
      put(line, cx, y);
    }
    return y + 40;
  };
  const room = CARD_H - top - 80;
  let qrBox = 640;
  while (qrBox > 360 && layout(0, qrBox, true) > room) qrBox -= 20;
  layout(top + Math.max(0, (room - layout(0, qrBox, true)) / 2), qrBox, false);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('no jpeg'))), 'image/jpeg', 0.92));
}

function QrCard({
  facts,
  ids,
  fileBase,
  themeColor,
  shareImage,
  ink,
}: {
  facts: ShareFacts;
  ids: string;
  fileBase: string;
  themeColor: string | null;
  shareImage: string | null;
  ink: string;
}) {
  const [withPassword, setWithPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const background = themeColor ?? '#fbf8f2';
  const password = withPassword ? facts.password : null;
  const input = useMemo(() => ({ facts, password, background, ink, image: shareImage }), [facts, password, background, ink, shareImage]);
  // A small live preview of the card (the same drawing).
  useEffect(() => {
    let url: string | null = null;
    let gone = false;
    drawCard(input)
      .then((blob) => {
        if (gone) return;
        url = URL.createObjectURL(blob);
        setPreview(url);
      })
      .catch(() => setPreview(null));
    return () => {
      gone = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [input]);
  const make = async () => {
    setBusy(true);
    setFailed(false);
    try {
      const jpeg = new Uint8Array(await (await drawCard(input)).arrayBuffer());
      const pdf = jpegPdf(jpeg, CARD_W, CARD_H, 288, 432, t('{names} — QR card', { names: facts.names }));
      download(`${fileBase}-qr-card.pdf`, new Blob([pdf as BlobPart], { type: 'application/pdf' }));
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className={own.card} aria-labelledby={`${ids}-card`} data-qr-card>
      <h3 id={`${ids}-card`} className={own.sub} style={{ margin: 0 }}>
        {t(L.cardTitle)}
      </h3>
      <div className={own.cardRow}>
        {preview ? <img src={preview} alt="" className={own.cardPreview} width={180} height={270} data-card-preview /> : null}
        <div className={styles.stack}>
          <p className={styles.cardText}>{t(L.cardText)}</p>
          {facts.password ? <Switch id={`${ids}-card-pw`} label={t(L.cardPassword)} checked={withPassword} onChange={setWithPassword} /> : null}
          <Button variant="primary" icon={busy ? undefined : FileDown} busy={busy} busyLabel={t(L.cardBusy)} onClick={() => void make()} data-download-card>
            {t(L.downloadCard)}
          </Button>
          {failed ? (
            <p role="alert" className={styles.hint}>
              {t(L.cardFailed)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
