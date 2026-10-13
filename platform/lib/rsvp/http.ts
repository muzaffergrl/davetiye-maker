// HTTP helpers for the RSVP routes: body reading with a size cap, client IP, edit key, JSON responses.

import type { RsvpResult } from './guest.ts';

export class BodyTooLargeError extends Error {
  constructor() {
    super('request body too large');
    this.name = 'BodyTooLargeError';
  }
}

/** Reads the request body as UTF-8 text, stopping at `maxBytes` (throws BodyTooLargeError). */
export async function readLimitedText(req: Request, maxBytes: number): Promise<string> {
  const declared = Number(req.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) throw new BodyTooLargeError();
  if (!req.body) return '';
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
  return new TextDecoder('utf-8').decode(Buffer.concat(chunks));
}

export function isJsonRequest(req: Request): boolean {
  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  return type === 'application/json';
}

/**
 * Client IP for rate limiting. On Vercel, x-forwarded-for / x-real-ip are set by the edge
 * (client values are overwritten). Behind another proxy make sure it does the same.
 * Locally there may be none: every request then shares the "unknown" bucket.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0].trim();
    if (first) return first;
  }
  return (req.headers.get('x-real-ip') ?? '').trim() || 'unknown';
}

/** Edit key from "Authorization: Bearer <key>" or the ?k= query parameter. */
export function editKeyFrom(req: Request): string | null {
  const auth = req.headers.get('authorization');
  const m = auth ? /^Bearer\s+(\S+)\s*$/i.exec(auth) : null;
  if (m) return m[1];
  return new URL(req.url).searchParams.get('k');
}

const BASE_HEADERS: Record<string, string> = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
};

export function jsonResponse(result: RsvpResult): Response {
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...BASE_HEADERS, ...(result.headers ?? {}) },
  });
}

export function csvResponse(csv: string, filename: string): Response {
  const safeName = filename.replace(/[^A-Za-z0-9._-]/g, '_');
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeName}"`,
      ...BASE_HEADERS,
    },
  });
}

export function unauthorized(): Response {
  return jsonResponse({
    status: 401,
    body: { ok: false, code: 'unauthorized', message: 'This edit link is not valid.' },
    headers: { 'WWW-Authenticate': 'Bearer' },
  });
}
