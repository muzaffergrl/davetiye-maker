// Guest side of RSVP: form status and reply submission for a PUBLISHED site.
// Framework-free (returns {status, body, headers}); app/api/rsvp/[slug]/route.ts turns that into a Response.
//
// Order of checks for a reply (limits: config.ts):
//   1. per-IP ceiling, all sites (every POST counts)       -> 429 rate_limited
//   2. site exists and is published                        -> 404 not_found
//   2b. password-protected site without its guest cookie   -> 401 password_required (G076)
//   3. per-IP limit for this site (every POST counts)      -> 429 rate_limited
//   4. form open (deadline / rsvp.method "none")           -> 403 closed
//   5. honeypot filled                                     -> 200 success, nothing stored
//   6. field validation                                    -> 400 invalid (+ fields)
//   7. identical reply in the last few minutes             -> 200 success, stored once
//   8. unusual volume (site or this IP on this site)       -> stored as HELD for the couple's review
//      (the guest sees the normal success); held store full -> 429 busy
//   9. store                                               -> 200 success
// Responses never contain other guests' data, ids or counts, and never say a reply was held.

import type { DataAdapter, RsvpInput, RsvpRecord } from '../data/types.ts';
import { isArchived } from '../panel/rights.ts';
import { guestMayEnter, isProtected } from '../site/access.ts';
import { previewAccess } from '../sites.ts';
import { isReservedSlug, isValidSlugFormat } from '../slug.ts';
import { DEFAULT_RSVP_LIMITS, DUPLICATE_WINDOW_MS, themeMaxGuests, type RsvpLimits } from './config.ts';
import { closedMessage, rsvpWindow } from './deadline.ts';
import { getRsvpRateLimiter, ipBucket, type RateLimiter } from './rate-limit.ts';
import { formQuestions, parseSubmission, isHoneypotFilled } from './validate.ts';

export type RsvpState = 'success' | 'closed' | 'error';
export type RsvpErrorCode = 'not_found' | 'invalid' | 'rate_limited' | 'busy' | 'too_large' | 'unsupported' | 'server' | 'password_required';

export interface RsvpResult {
  status: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface GuestContext {
  adapter: DataAdapter;
  /** Defaults to the shared limiter (getRsvpRateLimiter). */
  limiter?: RateLimiter;
  limits?: RsvpLimits;
  now?: Date;
  /** Client IP (see clientIp in http.ts); null/empty share one "unknown" bucket. */
  ip?: string | null;
  /** The request's Cookie header: a password-protected site needs its guest cookie (G076, lib/site/access.ts). */
  cookie?: string | null;
}

export const MESSAGES = {
  success: 'Thank you! Your reply has been sent.',
  not_found: 'This RSVP form is not available.',
  rate_limited: 'Too many replies from this connection. Please wait a few minutes and try again.',
  busy: 'This form is very busy right now. Please try again in a few minutes.',
  too_large: 'Your reply is too long. Please shorten your message and try again.',
  unsupported: 'Please send your reply from the RSVP page.',
  server: 'Something went wrong. Please try again in a moment.',
  password_required: 'This website is password protected. Please reload the page and enter the password.',
} as const;

export function errorResult(status: number, code: RsvpErrorCode, extra: Record<string, unknown> = {}, headers?: Record<string, string>): RsvpResult {
  return { status, body: { ok: false, state: 'error', code, message: MESSAGES[code as keyof typeof MESSAGES] ?? MESSAGES.server, ...extra }, headers };
}

const SUCCESS: RsvpResult = { status: 200, body: { ok: true, state: 'success', message: MESSAGES.success } };

function success(): RsvpResult {
  return structuredClone(SUCCESS);
}

function retryAfter(ms: number): Record<string, string> {
  return { 'Retry-After': String(Math.max(1, Math.ceil(ms / 1000))) };
}

async function publishedSite(adapter: DataAdapter, slug: string) {
  if (!isValidSlugFormat(slug) || isReservedSlug(slug)) return null;
  const site = await adapter.getSiteBySlug(slug);
  if (!site || site.status !== 'published' || !site.publishedContent) return null;
  // 12 months after the wedding the site is an archive (G060): no form, no replies.
  if (isArchived(site)) return null;
  return site;
}

/**
 * Public form status: is the form open, until when, and the guest cap.
 * With a valid preview key the DRAFT content is used (so the panel preview shows the right state);
 * replies are never accepted in preview.
 */
export async function getRsvpStatus(ctx: GuestContext, slug: string, previewKey?: string | null): Promise<RsvpResult> {
  let site = await publishedSite(ctx.adapter, slug);
  let content = site?.publishedContent ?? null;
  let preview = false;
  let panel = false;
  if (previewKey) {
    const any = isValidSlugFormat(slug) && !isReservedSlug(slug) ? await ctx.adapter.getSiteBySlug(slug) : null;
    const access = any ? previewAccess(any, previewKey, ctx.now ?? new Date()) : null;
    if (any && (access === 'panel' || access === 'shared')) {
      site = any;
      content = any.content;
      preview = true;
      panel = access === 'panel';
    }
  }
  if (!site || !content) return errorResult(404, 'not_found');
  // G076: the form's state (deadline, guest cap) is behind the guest password too; the panel's preview never needs it.
  if (!panel && isProtected(site) && !guestMayEnter(site, ctx.cookie, (ctx.now ?? new Date()).getTime())) return errorResult(401, 'password_required');
  const w = rsvpWindow(content, ctx.now ?? new Date());
  return {
    status: 200,
    body: {
      ok: true,
      open: w.open,
      reason: w.reason,
      message: w.open ? null : closedMessage(w),
      closesAt: w.closesAt,
      deadline: w.deadlineDisplay,
      maxGuests: await themeMaxGuests(site.theme),
      preview,
    },
  };
}

function sameReply(a: RsvpRecord, b: RsvpInput): boolean {
  return (
    a.name === b.name &&
    (a.email ?? null) === (b.email ?? null) &&
    a.attending === b.attending &&
    a.guests === b.guests &&
    (a.message ?? null) === (b.message ?? null) &&
    JSON.stringify(a.answers ?? []) === JSON.stringify(b.answers ?? [])
  );
}

/** Handles one guest reply. `body` is the parsed JSON object. */
export async function submitRsvp(ctx: GuestContext, slug: string, body: unknown): Promise<RsvpResult> {
  const limiter = ctx.limiter ?? getRsvpRateLimiter();
  const limits = ctx.limits ?? DEFAULT_RSVP_LIMITS;
  const now = ctx.now ?? new Date();

  const ip = ipBucket(ctx.ip ?? '');
  const perIp = await limiter.hit(`rsvp:ip:${ip}`, limits.perIp);
  if (!perIp.allowed) return errorResult(429, 'rate_limited', {}, retryAfter(perIp.retryAfterMs));

  const site = await publishedSite(ctx.adapter, slug);
  if (!site) return errorResult(404, 'not_found');
  // G076: no reply to a password-protected website without its guest cookie (nothing is stored).
  if (isProtected(site) && !guestMayEnter(site, ctx.cookie, now.getTime())) return errorResult(401, 'password_required');

  const perSiteIp = await limiter.hit(`rsvp:site-ip:${site.id}:${ip}`, limits.perSiteIp);
  if (!perSiteIp.allowed) return errorResult(429, 'rate_limited', {}, retryAfter(perSiteIp.retryAfterMs));

  const w = rsvpWindow(site.publishedContent, now);
  if (!w.open) {
    return { status: 403, body: { ok: false, state: 'closed', code: 'closed', reason: w.reason, message: closedMessage(w) } };
  }

  const fields = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  if (isHoneypotFilled(fields)) return success(); // looks the same as a real reply; nothing stored

  const parsed = parseSubmission(fields, await themeMaxGuests(site.theme), formQuestions(site.publishedContent));
  if (!parsed.ok) {
    const first = Object.values(parsed.errors)[0];
    return { status: 400, body: { ok: false, state: 'error', code: 'invalid', message: first, fields: parsed.errors } };
  }

  const recent = await ctx.adapter.listRsvps(site.id);
  const since = now.getTime() - DUPLICATE_WINDOW_MS;
  if (recent.some((r) => Date.parse(r.createdAt) >= since && sameReply(r, parsed.value))) return success();

  // Over either volume rule the reply is still stored, but held: junk cannot inflate the couple's
  // head count, and real guests are not locked out while it lasts.
  const perSite = await limiter.hit(`rsvp:site:${site.id}`, limits.perSite);
  const perSiteIpStored = await limiter.hit(`rsvp:site-ip-stored:${site.id}:${ip}`, limits.perSiteIpStored);
  const held = !perSite.allowed || !perSiteIpStored.allowed;
  if (held) {
    const room = await limiter.hit(`rsvp:held:${site.id}`, limits.heldPerSite);
    if (!room.allowed) return errorResult(429, 'busy', {}, retryAfter(room.retryAfterMs));
  }

  await ctx.adapter.saveRsvp(site.id, held ? { ...parsed.value, held: true } : parsed.value);
  return success();
}
