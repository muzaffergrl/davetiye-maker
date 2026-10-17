'use client';
// QR code of the public site address, generated from the real URL (lib/qr.ts, pinned uqr).
// Shown as inline SVG; downloadable as SVG or PNG (rendered from the same module matrix). G140: optional ink colour (the
// design's, darkened to scan like black — lib/panel/share.ts qrInk) and PNG size; labels from SHARE_LABELS.

import { Download } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { QR_BORDER, qrMatrix, qrPathData, qrSvg } from '../../lib/qr.ts';
import { QR_BLACK, QR_LIGHT, SHARE_LABELS as L } from '../../lib/panel/share.ts';
import { Button } from './ui.tsx';
import styles from './panel.module.css';

const DARK = QR_BLACK;
const LIGHT = QR_LIGHT;

export function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function QrCode({
  url,
  fileBase,
  ink = DARK,
  pngPx = 1200,
  children,
}: {
  url: string;
  fileBase: string;
  /** Dark module colour (#rrggbb). */
  ink?: string;
  /** PNG width = height, at least this many px, quiet zone included (rounded up to whole module sizes). */
  pngPx?: number;
  /** Options shown between the code and the download buttons. */
  children?: ReactNode;
}) {
  const qr = useMemo(() => {
    try {
      return qrMatrix(url);
    } catch {
      return null;
    }
  }, [url]);
  if (!qr) return <p className={styles.note}>A QR code can only be made for a full web address.</p>;
  const side = qr.size + QR_BORDER * 2;

  const suffix = ink === DARK ? '' : '-colour';
  const downloadSvg = () => download(`${fileBase}-qr${suffix}.svg`, new Blob([qrSvg(url, { dark: ink, light: LIGHT })], { type: 'image/svg+xml' }));
  const downloadPng = () => {
    const px = Math.max(1, Math.ceil(pngPx / side));
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = side * px;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = LIGHT;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ink;
    qr.modules.forEach((row, y) => row.forEach((dark, x) => dark && ctx.fillRect((x + QR_BORDER) * px, (y + QR_BORDER) * px, px, px)));
    canvas.toBlob((blob) => blob && download(`${fileBase}-qr${suffix}-${canvas.width}px.png`, blob), 'image/png');
  };

  return (
    <div className={styles.qrBlock}>
      <svg
        className={styles.qr}
        viewBox={`0 0 ${side} ${side}`}
        shapeRendering="crispEdges"
        role="img"
        aria-label={`QR code that opens ${url}`}
        data-qr-text={qr.text}
      >
        <rect width={side} height={side} fill={LIGHT} />
        <path d={qrPathData(qr)} fill={ink} />
      </svg>
      {children}
      <div className={styles.buttonRow}>
        <Button small icon={Download} onClick={downloadPng} data-qr-png>
          {L.downloadPng}
        </Button>
        <Button small icon={Download} onClick={downloadSvg} data-qr-svg>
          {L.downloadSvg}
        </Button>
      </div>
    </div>
  );
}
