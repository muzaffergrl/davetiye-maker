// Static files: theme assets (/themes/<theme>/<path>) and adapter photos (/media/<site>/<file>).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getDataAdapter } from '../data/index.ts';
import type { SiteRecord } from '../data/types.ts';
import { photoCandidates } from '../photo-variants.ts';
import { canPreview } from '../sites.ts';
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

/**
 * Every photo URL guests can be shown (media.*: strings and lists of strings). The story photos
 * (media.memory_photos) only count while the Our Story section is on: switching it off takes them down.
 */
function mediaUrls(content: unknown): string[] {
  const c = content as { media?: Record<string, unknown>; optional_blocks?: Record<string, unknown> } | null;
  const media = c?.media;
  if (!media || typeof media !== 'object') return [];
  const storyOn = c?.optional_blocks?.our_story === true;
  return Object.entries(media)
    .filter(([key]) => key !== 'memory_photos' || storyOn)
    .flatMap(([, v]) => (Array.isArray(v) ? v : [v]))
    .filter((v): v is string => typeof v === 'string' && v !== '');
}

/**
 * True when the published content of a published site uses the file `/media/<rel>`: the photo itself or
 * one of its size variants (G055, lib/photo-variants.ts — a variant is public exactly when its photo is).
 */
function publiclyUsed(site: SiteRecord, rel: string): boolean {
  if (site.status !== 'published' || !site.publishedContent) return false;
  const want = `/media/${rel}`;
  return mediaUrls(site.publishedContent).some((u) => {
    const url = u.split(/[?#]/)[0];
    return url.endsWith(want) || Boolean(photoCandidates(url)?.some((c) => c.url === want));
  });
}

/** Short public cache: a photo taken offline / replaced stops being served within minutes. */
export const MEDIA_PUBLIC_CACHE = 'public, max-age=300, s-maxage=300';

/**
 * GET /media/<siteId>/<file>. Served only when
 *  - the site is published and its published content uses the file (public, short cache), or
 *  - the request carries the site's preview key (?preview=…: panel and draft preview; private, no-store).
 * Anything else (site offline, photo replaced or removed, draft-only upload, unknown file) is 404,
 * so taking a site offline also takes its photos offline.
 */
export async function serveLocalMedia(segments: string[] | undefined, req?: Request): Promise<Response> {
  const parts = safeSegments(segments);
  if (!parts || parts.length !== 2) return notFound();
  const adapter = getDataAdapter();
  if (!adapter.readPhoto) return notFound();
  const rel = parts.join('/');
  const site = await adapter.getSiteById(parts[0]);
  if (!site) return notFound();
  const previewKey = req ? new URL(req.url).searchParams.get('preview') : null;
  const preview = previewKey !== null && canPreview(site, previewKey);
  if (!preview && !publiclyUsed(site, rel)) return notFound();
  const file = await adapter.readPhoto(rel);
  if (!file) return notFound();
  return new Response(new Uint8Array(file.bytes), {
    status: 200,
    headers: {
      'Content-Type': file.contentType,
      'Content-Length': String(file.bytes.length),
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': FILE_CSP,
      'Cache-Control': preview ? 'private, no-store' : MEDIA_PUBLIC_CACHE,
      ...(preview ? { 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex' } : {}),
    },
  });
}
