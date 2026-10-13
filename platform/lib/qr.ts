// QR codes for a site's public address (panel, G039).
//
// Encoded algorithmically by the pinned `uqr` library (Nayuki's QR encoder), with the same
// settings as tools/make_qr.py: error correction Q, 4-module quiet zone, dark on light.
// AGENTS.md rule 8: a QR is only ever generated from the real target URL; never drawn by hand/AI.
// No Node imports: the panel renders the code in the browser from the same functions.

import { encode } from 'uqr';

/** Quiet zone in modules (QR spec minimum, as in tools/make_qr.py). */
export const QR_BORDER = 4;

/** Demo / fictional hosts that must never end up in a QR (same list as tools/make_qr.py). */
export const PLACEHOLDER_HOSTS: ReadonlySet<string> = new Set([
  'example.com',
  'example.org',
  'averyandjordan.com',
  'www.averyandjordan.com',
]);

export class QrTargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QrTargetError';
  }
}

/** The normalised http(s) URL to encode. Throws QrTargetError for anything else. */
export function qrTarget(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new QrTargetError(`Not a valid web address: ${url}`);
  }
  if ((parsed.protocol !== 'https:' && parsed.protocol !== 'http:') || !parsed.hostname) {
    throw new QrTargetError(`Only http(s) addresses are encoded: ${url}`);
  }
  if (PLACEHOLDER_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new QrTargetError(`${parsed.hostname} is a demo/fictional address`);
  }
  return parsed.href;
}

export interface QrMatrix {
  /** The exact text encoded. */
  text: string;
  version: number;
  /** Modules per side, without the quiet zone. */
  size: number;
  /** modules[y][x], true = dark. */
  modules: boolean[][];
}

/** QR modules for a public URL (no quiet zone). */
export function qrMatrix(url: string): QrMatrix {
  const text = qrTarget(url);
  const qr = encode(text, { ecc: 'Q', border: 0 });
  return { text, version: qr.version, size: qr.size, modules: qr.data };
}

/** SVG path data for the dark modules (one sub-path per horizontal run), offset by the quiet zone. */
export function qrPathData(qr: QrMatrix, border = QR_BORDER): string {
  const parts: string[] = [];
  qr.modules.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run]) run += 1;
      parts.push(`M${x + border} ${y + border}h${run}v1h-${run}z`);
      x += run;
    }
  });
  return parts.join('');
}

const HEX = /^#[0-9a-fA-F]{6}$/;

export interface QrSvgOptions {
  dark?: string;
  light?: string;
  border?: number;
  /** Rendered width/height in px (the viewBox is in modules). Default 10 px per module. */
  pixels?: number;
}

/** A standalone SVG document of the QR (for download / print). Colours must be #rrggbb. */
export function qrSvg(url: string, opts: QrSvgOptions = {}): string {
  const qr = qrMatrix(url);
  const border = opts.border ?? QR_BORDER;
  const dark = opts.dark && HEX.test(opts.dark) ? opts.dark : '#000000';
  const light = opts.light && HEX.test(opts.light) ? opts.light : '#ffffff';
  const side = qr.size + border * 2;
  const pixels = Math.max(side, Math.round(opts.pixels ?? side * 10));
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" width="${pixels}" height="${pixels}" shape-rendering="crispEdges">` +
    `<rect width="${side}" height="${side}" fill="${light}"/>` +
    `<path d="${qrPathData(qr, border)}" fill="${dark}"/>` +
    `</svg>`
  );
}
