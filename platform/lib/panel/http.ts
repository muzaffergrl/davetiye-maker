// HTTP helpers for the panel API (G039): edit key, origin, bodies with a size cap, JSON responses.

import { safeHttpUrl } from '../theme/urls.ts';

/**
 * Edit key from "Authorization: Bearer <key>" only. The panel API never reads ?k= so a link or
 * a cross-site form cannot act with a key (the browser cannot add this header cross-origin).
 */
export function bearerKey(req: Request): string | null {
  const auth = req.headers.get('authorization');
  const m = auth ? /^Bearer\s+(\S+)\s*$/i.exec(auth) : null;
  return m ? m[1] : null;
}

const HOST_RE = /^[a-z0-9.-]+(:\d{1,5})?$|^\[[0-9a-f:.]+\](:\d{1,5})?$/i;

/**
 * Public origin of the platform, for the site link and its QR code.
 * PLATFORM_PUBLIC_URL (e.g. https://<name>.vercel.app) wins; otherwise the request's host
 * (x-forwarded-host / host, as set by Vercel or `next start`), otherwise `fallback`.
 */
export function publicOrigin(headers: Headers, fallback = 'http://localhost:3000'): string {
  const configured = safeHttpUrl(process.env.PLATFORM_PUBLIC_URL ?? '');
  if (configured) return new URL(configured).origin;
  const host = (headers.get('x-forwarded-host') ?? headers.get('host') ?? '').split(',')[0].trim();
  if (host && HOST_RE.test(host)) {
    const proto = (headers.get('x-forwarded-proto') ?? '').split(',')[0].trim().toLowerCase();
    return `${proto === 'https' ? 'https' : 'http'}://${host.toLowerCase()}`;
  }
  return fallback;
}

export function requestOrigin(req: Request): string {
  return publicOrigin(req.headers, new URL(req.url).origin);
}

export class BodyTooLargeError extends Error {
  constructor() {
    super('request body too large');
    this.name = 'BodyTooLargeError';
  }
}

/** Reads the whole body, stopping as soon as it passes `maxBytes` (throws BodyTooLargeError). */
export async function readLimitedBytes(req: Request, maxBytes: number): Promise<Uint8Array> {
  const declared = Number(req.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) throw new BodyTooLargeError();
  if (!req.body) return new Uint8Array(0);
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }
  return new Uint8Array(Buffer.concat(chunks));
}

export function mediaType(req: Request): string {
  return (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
}

const BASE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
};

export function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...BASE_HEADERS, ...headers } });
}

export function fail(status: number, code: string, message: string, extra: Record<string, unknown> = {}): Response {
  return json(status, { ok: false, code, message, ...extra }, status === 401 ? { 'WWW-Authenticate': 'Bearer' } : {});
}

/** Same answer for a wrong key, a preview key, another site's key and an unknown slug. */
export function unauthorized(): Response {
  return fail(401, 'unauthorized', 'This edit link is not valid.');
}
