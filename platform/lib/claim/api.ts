// HTTP handlers for /start (G045). The route files under app/api/start/ only call these.
//
//   POST /api/start               {theme, orderNumber, email, names, slug?, website?}  -> claimSite (claim.ts)
//   GET  /api/start/slug?value=   live "is this address free?" hint for the form
//
// JSON only (a cross-site HTML form cannot send application/json without a CORS preflight, which
// this API never allows). Answers are private, no-store, noindex, no-referrer: the success body
// holds the secret edit link.

import { getDataAdapter } from '../data/index.ts';
import { BodyTooLargeError, mediaType, readLimitedBytes, requestOrigin } from '../panel/http.ts';
import { ipBucket } from '../rsvp/rate-limit.ts';
import { clientIp } from '../rsvp/http.ts';
import { claimError, claimSite, slugAvailability, type ClaimResult } from './claim.ts';
import { DEFAULT_CLAIM_LIMITS, getClaimRateLimiter } from './limits.ts';

/** POST /api/start body cap. */
export const MAX_CLAIM_BYTES = 4 * 1024;

const HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
};

export function claimResponse(result: ClaimResult): Response {
  return new Response(JSON.stringify(result.body), { status: result.status, headers: { ...HEADERS, ...(result.headers ?? {}) } });
}

async function readJson(req: Request): Promise<{ value: Record<string, unknown> } | { error: ClaimResult }> {
  if (mediaType(req) !== 'application/json') return { error: claimError(415, 'unsupported') };
  let body: string;
  try {
    body = new TextDecoder('utf-8', { fatal: true }).decode(await readLimitedBytes(req, MAX_CLAIM_BYTES));
  } catch (e) {
    if (e instanceof BodyTooLargeError) return { error: claimError(413, 'too_large') };
    return { error: claimError(400, 'bad_json') };
  }
  try {
    const value = JSON.parse(body) as unknown;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('not an object');
    return { value: value as Record<string, unknown> };
  } catch {
    return { error: claimError(400, 'bad_json') };
  }
}

export async function handleClaim(req: Request): Promise<Response> {
  try {
    const parsed = await readJson(req);
    if ('error' in parsed) return claimResponse(parsed.error);
    const result = await claimSite(
      { adapter: getDataAdapter(), origin: requestOrigin(req), ip: clientIp(req) },
      parsed.value,
    );
    return claimResponse(result);
  } catch (e) {
    // The error never contains the edit key (it is created last and not thrown).
    console.error('[claim] POST /api/start failed:', e);
    return claimResponse(claimError(500, 'server'));
  }
}

export async function handleSlugCheck(req: Request): Promise<Response> {
  try {
    const limit = await getClaimRateLimiter().hit(`claim:slug:${ipBucket(clientIp(req))}`, DEFAULT_CLAIM_LIMITS.slugChecksPerIp);
    if (!limit.allowed) {
      return claimResponse(
        claimError(429, 'rate_limited', {}, { 'Retry-After': String(Math.max(1, Math.ceil(limit.retryAfterMs / 1000))) }),
      );
    }
    const value = new URL(req.url).searchParams.get('value') ?? '';
    const result = await slugAvailability(getDataAdapter(), value.slice(0, 200));
    return claimResponse({ status: 200, body: { ok: true, ...result } });
  } catch (e) {
    console.error('[claim] GET /api/start/slug failed:', e);
    return claimResponse(claimError(500, 'server'));
  }
}
