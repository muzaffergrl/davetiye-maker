// Static files: theme assets (/themes/<theme>/<path>) and adapter photos (/media/<site>/<file>).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { customMusicFile } from '../audio/catalog.ts';
import { isThankYouOn, thankYouPhoto } from '../content/thank-you.ts';
import { getDataAdapter } from '../data/index.ts';
import type { SiteRecord } from '../data/types.ts';
import { photoCandidates } from '../photo-variants.ts';
import { isArchived } from '../panel/rights.ts';
import { previewAccess } from '../sites.ts';
import { guestMayEnter, isProtected } from './access.ts';
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
 * The thank-you photo (thank_you.photo, G075) only counts while thank-you mode is on (it is on no page before).
 */
function mediaUrls(content: unknown, now: Date = new Date()): string[] {
  const c = content as { media?: Record<string, unknown>; optional_blocks?: Record<string, unknown> } | null;
  const media = c?.media;
  const storyOn = c?.optional_blocks?.our_story === true;
  const urls = (media && typeof media === 'object' ? Object.entries(media) : [])
    .filter(([key]) => key !== 'memory_photos' || storyOn)
    .flatMap(([, v]) => (Array.isArray(v) ? v : [v]))
    .filter((v): v is string => typeof v === 'string' && v !== '');
  const thanks = thankYouPhoto(content);
  if (thanks && isThankYouOn(content, now)) urls.push(thanks);
  // G126: the couple's own story music, while it is the chosen music and the story page is on
  const music = customMusicFile(content);
  if (music) urls.push(music);
  return urls;
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
 * Photos of a password-protected website (G076): the guest's own browser may keep them for the same few minutes, a shared
 * cache (Vercel's CDN, a proxy) never — another visitor with the URL must not get them from there.
 */
export const MEDIA_GUEST_CACHE = 'private, max-age=300';

/**
 * GET /media/<siteId>/<file>. Served only when
 *  - the site is published and its published content uses the file (public, short cache), or
 *  - the request carries the site's preview key (?preview=…: panel and draft preview; private, no-store).
 * Anything else (site offline, photo replaced or removed, draft-only upload, unknown file) is 404,
 * so taking a site offline also takes its photos offline. A password-protected site (G076) serves its photos only with
 * the site's guest cookie (or the panel's preview token): 401 otherwise, never stored by a shared cache.
 */
export async function serveLocalMedia(segments: string[] | undefined, req?: Request): Promise<Response> {
  const parts = safeSegments(segments);
  if (!parts || parts.length !== 2) return notFound();
  const adapter = getDataAdapter();
  if (!adapter.readPhoto) return notFound();
  const rel = parts.join('/');
  const site = await adapter.getSiteById(parts[0]);
  if (!site) return notFound();
  const access = previewAccess(site, req ? new URL(req.url).searchParams.get('preview') : null);
  const preview = access === 'panel' || access === 'shared';
  if (!preview && access !== 'gone' && !publiclyUsed(site, rel)) return notFound();
  // An archived site's photos are gone for the public (G060) and for the long-lived preview key (G060-fix); the
  // couple still sees them in the panel (short-lived token).
  if (access === 'gone' || (!preview && isArchived(site))) {
    return new Response('Gone', { status: 410, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store' } });
  }
  // G076: photos of a password-protected website need the guest cookie of that site (the panel's preview token does not).
  const guestOnly = access !== 'panel' && isProtected(site);
  if (guestOnly && !guestMayEnter(site, req?.headers.get('cookie'))) {
    return new Response('This photo belongs to a password-protected website.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store', Vary: 'Cookie', 'X-Robots-Tag': 'noindex' },
    });
  }
  const file = await adapter.readPhoto(rel);
  if (!file) return notFound();
  // G126: music files are fetched in byte ranges (Safari plays <audio> only from a server that answers Range requests)
  const range = file.contentType.startsWith('audio/') ? byteRange(req?.headers.get('range') ?? null, file.bytes.length) : null;
  if (range === 'invalid') {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${file.bytes.length}`, 'Cache-Control': 'private, no-store' } });
  }
  const body = range ? file.bytes.subarray(range.start, range.end + 1) : file.bytes;
  return new Response(new Uint8Array(body), {
    status: range ? 206 : 200,
    headers: {
      'Content-Type': file.contentType,
      'Content-Length': String(body.length),
      ...(file.contentType.startsWith('audio/') ? { 'Accept-Ranges': 'bytes' } : {}),
      ...(range ? { 'Content-Range': `bytes ${range.start}-${range.end}/${file.bytes.length}` } : {}),
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': FILE_CSP,
      'Cache-Control': preview ? 'private, no-store' : guestOnly ? MEDIA_GUEST_CACHE : MEDIA_PUBLIC_CACHE,
      ...(preview ? { 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex' } : {}),
      ...(guestOnly ? { Vary: 'Cookie', 'X-Robots-Tag': 'noindex' } : {}),
    },
  });
}

/**
 * One byte range of a `Range: bytes=…` header (G126, music files): {start, end} inclusive, null = no (usable) range →
 * the whole file, 'invalid' = 416. Several ranges are answered with the whole file (allowed by RFC 9110).
 */
export function byteRange(header: string | null, size: number): { start: number; end: number } | null | 'invalid' {
  if (!header) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start: number;
  let end: number;
  if (m[1] === '') {
    const suffix = Number(m[2]);
    if (suffix === 0) return 'invalid';
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) return 'invalid';
  return { start, end };
}
