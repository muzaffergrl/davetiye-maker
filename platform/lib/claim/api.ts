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
import { continueError, continueWithOrder, emailSignInLink } from './continue.ts';
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

async function readJson(
  req: Request,
  fail: (status: number, code: 'unsupported' | 'too_large' | 'bad_json') => ClaimResult = (status, code) => claimError(status, code),
  maxBytes: number = MAX_CLAIM_BYTES,
): Promise<{ value: Record<string, unknown> } | { error: ClaimResult }> {
  if (mediaType(req) !== 'application/json') return { error: fail(415, 'unsupported') };
  let body: string;
  try {
    body = new TextDecoder('utf-8', { fatal: true }).decode(await readLimitedBytes(req, maxBytes));
  } catch (e) {
    if (e instanceof BodyTooLargeError) return { error: fail(413, 'too_large') };
    return { error: fail(400, 'bad_json') };
  }
  try {
    const value = JSON.parse(body) as unknown;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('not an object');
    return { value: value as Record<string, unknown> };
  } catch {
    return { error: fail(400, 'bad_json') };
  }
}

export async function handleClaim(req: Request): Promise<Response> {
  try {
    const parsed = await readJson(req);
    if ('error' in parsed) return claimResponse(parsed.error);
    const result = await claimSite(
      { adapter: getDataAdapter(), origin: requestOrigin(req), ip: clientIp(req), userAgent: req.headers.get('user-agent') },
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

// ---------------------------------------------------------------------------------------------
// G146: /my — continue with the Etsy order number + email (lib/claim/continue.ts)
//
//   POST /api/my/continue      {orderNumber, email, website?}  -> {next: "edit", slug, editPath, names} | {next: "start"}
//   POST /api/my/signin-link   {orderNumber, email, website?}  -> always the same "if it matches, we sent it" (503 while
//                                                                no email provider is set up)
// Same JSON-only, size-capped, no-store, no-referrer answers as /api/start (the "edit" answer holds a device key).

/** POST /api/my/* body cap. */
export const MAX_CONTINUE_BYTES = 1024;

const continueFail = (status: number, code: 'unsupported' | 'too_large' | 'bad_json'): ClaimResult => continueError(status, code);

async function continueRequest(req: Request, run: typeof continueWithOrder, where: string): Promise<Response> {
  try {
    const parsed = await readJson(req, continueFail, MAX_CONTINUE_BYTES);
    if ('error' in parsed) return claimResponse(parsed.error);
    const result = await run(
      { adapter: getDataAdapter(), origin: requestOrigin(req), ip: clientIp(req), userAgent: req.headers.get('user-agent') },
      parsed.value,
    );
    return claimResponse(result);
  } catch (e) {
    // Only the error's name: never the order number, the email or a key.
    console.error(`[my] ${where} failed: ${e instanceof Error ? e.name : 'error'}`);
    return claimResponse(continueError(500, 'server'));
  }
}

export function handleContinue(req: Request): Promise<Response> {
  return continueRequest(req, continueWithOrder, 'continue');
}

export function handleSignInLink(req: Request): Promise<Response> {
  return continueRequest(req, emailSignInLink, 'sign-in link');
}
