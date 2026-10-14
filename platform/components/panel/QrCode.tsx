'use client';
// QR code of the public site address, generated from the real URL (lib/qr.ts, pinned uqr).
// Shown as inline SVG; downloadable as SVG or PNG (rendered from the same module matrix).

import { Download } from 'lucide-react';
import { useMemo } from 'react';
import { QR_BORDER, qrMatrix, qrPathData, qrSvg } from '../../lib/qr.ts';
import { Button } from './ui.tsx';
import styles from './panel.module.css';

const DARK = '#1f1d1a';
const LIGHT = '#ffffff';

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function QrCode({ url, fileBase }: { url: string; fileBase: string }) {
  const qr = useMemo(() => {
    try {
      return qrMatrix(url);
    } catch {
      return null;
    }
  }, [url]);
  if (!qr) return <p className={styles.note}>A QR code can only be made for a full web address.</p>;
  const side = qr.size + QR_BORDER * 2;

  const downloadSvg = () => download(`${fileBase}-qr.svg`, new Blob([qrSvg(url, { dark: DARK, light: LIGHT })], { type: 'image/svg+xml' }));
  const downloadPng = () => {
    const px = 16;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = side * px;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = LIGHT;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = DARK;
    qr.modules.forEach((row, y) => row.forEach((dark, x) => dark && ctx.fillRect((x + QR_BORDER) * px, (y + QR_BORDER) * px, px, px)));
    canvas.toBlob((blob) => blob && download(`${fileBase}-qr.png`, blob), 'image/png');
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
        <path d={qrPathData(qr)} fill={DARK} />
      </svg>
      <div className={styles.buttonRow}>
        <Button small icon={Download} onClick={downloadPng}>
          Download PNG
        </Button>
        <Button small icon={Download} onClick={downloadSvg}>
          Download SVG
        </Button>
      </div>
    </div>
  );
}
