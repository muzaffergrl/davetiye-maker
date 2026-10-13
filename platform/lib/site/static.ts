// Static files: theme assets (/themes/<theme>/<path>) and local-adapter photos (/media/<site>/<file>).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getDataAdapter } from '../data/index.ts';
import { THEME_ID_RE, themesDir } from '../theme/theme.ts';

/** Only these theme files are public. Templates (.html), theme.json and anything else are not served. */
export const THEME_ASSET_TYPES: Readonly<Record<string, string>> = {
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  mp4: 'video/mp4',
  webm: 'video/webm',
};

const FILE_CSP = "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'";

function notFound(): Response {
  return new Response('Not found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
}

function safeSegments(segments: string[] | undefined): string[] | null {
  if (!segments?.length) return null;
  for (const s of segments) {
    if (!s || s === '.' || s === '..' || /[\\/\0]/.test(s) || s.startsWith('.')) return null;
  }
  return segments;
}

export async function serveThemeAsset(themeId: string, segments: string[] | undefined): Promise<Response> {
  const parts = safeSegments(segments);
  if (!THEME_ID_RE.test(themeId) || !parts) return notFound();
  const ext = path.extname(parts[parts.length - 1]).slice(1).toLowerCase();
  const type = THEME_ASSET_TYPES[ext];
  if (!type) return notFound();
  const root = path.join(themesDir(), themeId);
  try {
    const realRoot = await fs.realpath(root);
    const real = await fs.realpath(path.join(root, ...parts));
    if (!real.startsWith(realRoot + path.sep)) return notFound();
    const stat = await fs.stat(real);
    if (!stat.isFile()) return notFound();
    const bytes = await fs.readFile(real);
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        'Content-Type': type,
        'Content-Length': String(bytes.length),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        ...(ext === 'svg' ? { 'Content-Security-Policy': FILE_CSP } : {}),
      },
    });
  } catch {
    return notFound();
  }
}

export async function serveLocalMedia(segments: string[] | undefined): Promise<Response> {
  const parts = safeSegments(segments);
  if (!parts) return notFound();
  const adapter = getDataAdapter();
  if (!adapter.readPhoto) return notFound();
  const file = await adapter.readPhoto(parts.join('/'));
  if (!file) return notFound();
  return new Response(new Uint8Array(file.bytes), {
    status: 200,
    headers: {
      'Content-Type': file.contentType,
      'Content-Length': String(file.bytes.length),
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': FILE_CSP,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
