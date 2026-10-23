// "Continue with your Etsy order number + email" (G146, K46). Etsy's instant download gives every buyer the same PDF,
// so there is no per-buyer code: the buyer's code is their Etsy ORDER NUMBER, and the email they gave when they started
// their website proves it is theirs. Same order number + same email = the editor on any device. No account, no password.
// Framework-free like claim.ts: returns {status, body, headers}; lib/claim/api.ts turns that into a Response.
//
// POST /api/my/continue {orderNumber, email, website? (honeypot)}
//   1. per-IP attempts (every request counts)                       -> 429 rate_limited
//   2. honeypot filled                                              -> 400 invalid (nothing done)
//   3. field checks (fields.ts, same rules as the browser)          -> 400 invalid (+ fields)
//   4. attempts for this order number (shared with /start)          -> 429 rate_limited
//   5. no website for the order number yet                          -> 200 {next: "start"} (the page goes on to /start)
//      (G151: when a private theme — a custom design — lists this order number, + startPath "/start?theme=<id>&order=<no>")
//   6. a website whose owner email matches (normalised, constant time) -> a new DEVICE KEY (lib/device-keys.ts)
//                                                                    -> 200 {next: "edit", slug, editPath, names}
//      G152: SEVERAL websites of the order (multi-item Etsy order) match -> 200 {next: "choose", sites: [{slug, names,
//      design}]} (no key yet; G951: every website of the order started with this email, with its design's name); the page
//      asks which one and posts again with {slug}: that one opens (same checks, same counters). Never the first one by
//      default.
//   7. anything else                                                -> 403 no_match, one generic message (it never says
//                                                                       whose the order is or which email it has)
// POST /api/my/signin-link {orderNumber, email} — only while an email provider is set up (getEditLinkMailer().enabled;
//   503 otherwise): same checks with its own, smaller limits; on a match a device key is made and its link is emailed to
//   the owner email ON RECORD (kind "signin"; one email per matching website, G152). The answer is always the same
//   "if it matches, we sent it".
// Keys, emails and full order numbers are never logged.

import { createHash, timingSafeEqual } from 'node:crypto';
import type { DataAdapter, SiteRecord } from '../data/types.ts';
import { deviceLabel, mintDeviceKey } from '../device-keys.ts';
import { msg } from '../i18n/translate.ts';
import { MARKETING } from '../marketing/config.ts';
import { ipBucket, type RateLimiter } from '../rsvp/rate-limit.ts';
import { emailError, normalizeEmail, normalizeOrderNumber, orderNumberError } from './fields.ts';
import { DEFAULT_CONTINUE_LIMITS, getClaimRateLimiter, orderLimitKey, type ContinueLimits } from './limits.ts';
import { getEditLinkMailer, type EditLinkMailer } from './mailer.ts';
import { privateThemeForOrder } from './themes.ts';

export interface ContinueContext {
  adapter: DataAdapter;
  /** Public origin for the emailed link (lib/panel/http.ts requestOrigin). */
  origin: string;
  ip?: string | null;
  /** The browser's user agent: only a short device label ("iPhone · Safari") is kept. */
  userAgent?: string | null;
  limiter?: RateLimiter;
  limits?: ContinueLimits;
  mailer?: EditLinkMailer;
  now?: () => number;
}

export interface ContinueResult {
  status: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
}

export type ContinueCode = 'invalid' | 'no_match' | 'rate_limited' | 'unavailable' | 'too_large' | 'unsupported' | 'bad_json' | 'server';

export const CONTINUE_MESSAGES: Record<ContinueCode, string> = {
  invalid: msg('Please check the highlighted fields.'),
  no_match: msg(
    'We could not open a website with this order number and email. Check both, and use the email address you entered when you started your website.',
  ),
  rate_limited: msg('Too many attempts. Please wait a few minutes and try again.'),
  unavailable: msg('Email sign-in is not available yet. Enter your order number and email above to open your editor.'),
  too_large: msg('This form is too large to send.'),
  unsupported: msg('Please send the form from this page.'),
  bad_json: msg('This form could not be read. Please reload the page and try again.'),
  server: msg('Something went wrong. Please try again in a moment.'),
};

/** The one answer of "Email me a sign-in link", whether or not anything matched. */
export const SIGN_IN_LINK_SENT = msg(
  'If this order number and email match a website, we have sent a sign-in link to that email address. It can take a few minutes; check your spam folder too.',
);

export function continueError(status: number, code: ContinueCode, extra: Record<string, unknown> = {}, headers?: Record<string, string>): ContinueResult {
  return { status, body: { ok: false, code, message: CONTINUE_MESSAGES[code], ...extra }, ...(headers ? { headers } : {}) };
}

function retryAfter(ms: number): Record<string, string> {
  return { 'Retry-After': String(Math.max(1, Math.ceil(ms / 1000))) };
}

const text = (v: unknown): string => (typeof v === 'string' ? v : '');

const digest = (v: string) => createHash('sha256').update(v, 'utf8').digest();

/**
 * Is `typed` the email the website was started with? Both normalised (fields.ts) and compared case-insensitively, in
 * constant time (hashes of equal length). A site without an owner email never matches.
 */
export function sameOwnerEmail(stored: string | null | undefined, typed: string): boolean {
  const a = (normalizeEmail(stored ?? '') ?? '').toLowerCase();
  const b = (normalizeEmail(typed) ?? '').toLowerCase();
  const equal = timingSafeEqual(digest(`email:${a}`), digest(`email:${b}`));
  return equal && a !== '' && b !== '';
}

/** Every website of the order started with this email, newest first (G152: a multi-item order can have several). */
export function ownedSites(sites: readonly SiteRecord[], email: string): SiteRecord[] {
  // Every site is compared (no early exit): the answer time does not depend on which one matches.
  const out = sites.filter((s) => sameOwnerEmail(s.ownerEmail, email));
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** G951: a design's name for the buyer ("Olive & Ivory"): the sales catalogue's, else its id in words (a private design). */
export function designName(themeId: string): string {
  return MARKETING.designs.find((d) => d.id === themeId)?.name ?? themeId.split(/[-_]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

/** The couple's names as the panel shows them (for the "On this device" list on /my). */
export function siteNames(site: SiteRecord): string {
  const c = site.content;
  return (c.name_display || (c.partners ?? []).map((p) => p.display_name).filter(Boolean).join(' & ') || '').slice(0, 120);
}

/** The panel path that opens the site with a device key (same origin; the key is in the query like an edit link). */
export function deviceEditPath(slug: string, key: string): string {
  return `/edit/${slug}?k=${encodeURIComponent(key)}`;
}

/** Checks the order number and email of a /my form. Null when both are fine. */
function fieldErrors(raw: Record<string, unknown>): Partial<Record<'orderNumber' | 'email', string>> | null {
  const fields: Partial<Record<'orderNumber' | 'email', string>> = {};
  const order = orderNumberError(text(raw.orderNumber));
  const email = emailError(text(raw.email));
  if (order) fields.orderNumber = order;
  if (email) fields.email = email;
  return Object.keys(fields).length ? fields : null;
}

/** The start link of a private theme (G151): the order number in it is what opens the design on /start. */
export function privateStartPath(themeId: string, orderNumber: string): string {
  return `/start?theme=${encodeURIComponent(themeId)}&order=${encodeURIComponent(orderNumber)}`;
}

export async function continueWithOrder(ctx: ContinueContext, raw: Record<string, unknown>): Promise<ContinueResult> {
  const limiter = ctx.limiter ?? getClaimRateLimiter();
  const limits = ctx.limits ?? DEFAULT_CONTINUE_LIMITS;
  const ip = ipBucket(ctx.ip ?? '');

  const attempt = await limiter.hit(`my:continue:${ip}`, limits.perIp);
  if (!attempt.allowed) return continueError(429, 'rate_limited', {}, retryAfter(attempt.retryAfterMs));
  if (text(raw.website).trim()) return continueError(400, 'invalid');
  const fields = fieldErrors(raw);
  if (fields) return continueError(400, 'invalid', { fields });

  const orderNumber = normalizeOrderNumber(text(raw.orderNumber))!;
  const email = normalizeEmail(text(raw.email))!;
  const perOrder = await limiter.hit(orderLimitKey('my:order', orderNumber), limits.perOrder);
  if (!perOrder.allowed) return continueError(429, 'rate_limited', {}, retryAfter(perOrder.retryAfterMs));

  const sites = await ctx.adapter.findSitesByOrderRef(orderNumber);
  if (!sites.length) {
    const custom = await privateThemeForOrder(orderNumber);
    return { status: 200, body: { ok: true, next: 'start', ...(custom ? { startPath: privateStartPath(custom.id, orderNumber) } : {}) } };
  }
  const owned = ownedSites(sites, email);
  const wanted = typeof raw.slug === 'string' && raw.slug ? raw.slug : null;
  if (!owned.length) return continueError(403, 'no_match');
  if (owned.length > 1 && !wanted) {
    // G152: names and addresses only of the websites this email started (never another buyer's).
    // G951: with the design of each, so two websites of one couple (two designs in one order) can be told apart.
    return { status: 200, body: { ok: true, next: 'choose', sites: owned.map((s) => ({ slug: s.slug, names: siteNames(s), design: designName(s.theme) })) } };
  }
  const site = wanted ? owned.find((s) => s.slug === wanted) : owned[0];
  if (!site) return continueError(403, 'no_match');
  const now = new Date((ctx.now ?? Date.now)());
  const { key } = await mintDeviceKey(ctx.adapter, site, { label: deviceLabel(ctx.userAgent), via: 'continue', now });
  return { status: 200, body: { ok: true, next: 'edit', slug: site.slug, editPath: deviceEditPath(site.slug, key), names: siteNames(site) } };
}

export async function emailSignInLink(ctx: ContinueContext, raw: Record<string, unknown>): Promise<ContinueResult> {
  const mailer = ctx.mailer ?? getEditLinkMailer();
  if (!mailer.enabled) return continueError(503, 'unavailable');
  const limiter = ctx.limiter ?? getClaimRateLimiter();
  const limits = ctx.limits ?? DEFAULT_CONTINUE_LIMITS;
  const ip = ipBucket(ctx.ip ?? '');

  const attempt = await limiter.hit(`my:signin:${ip}`, limits.signInLinksPerIp);
  if (!attempt.allowed) return continueError(429, 'rate_limited', {}, retryAfter(attempt.retryAfterMs));
  if (text(raw.website).trim()) return continueError(400, 'invalid');
  const fields = fieldErrors(raw);
  if (fields) return continueError(400, 'invalid', { fields });

  const orderNumber = normalizeOrderNumber(text(raw.orderNumber))!;
  const email = normalizeEmail(text(raw.email))!;
  const perOrder = await limiter.hit(orderLimitKey('my:signin', orderNumber), limits.signInLinksPerOrder);
  if (!perOrder.allowed) return continueError(429, 'rate_limited', {}, retryAfter(perOrder.retryAfterMs));

  // G152: one email per website of the order started with this address (a multi-item order can have several).
  for (const site of ownedSites(await ctx.adapter.findSitesByOrderRef(orderNumber), email)) {
    if (!site.ownerEmail) continue;
    const now = new Date((ctx.now ?? Date.now)());
    const { key } = await mintDeviceKey(ctx.adapter, site, { label: '', via: 'email', now });
    const origin = ctx.origin.replace(/\/+$/, '');
    try {
      await mailer.send({
        to: site.ownerEmail,
        editUrl: `${origin}${deviceEditPath(site.slug, key)}`,
        siteUrl: `${origin}/${site.slug}`,
        themeName: designName(site.theme),
        orderNumber,
        kind: 'signin',
      });
    } catch (e) {
      // Never log the message (it holds the secret link) nor the address.
      console.error(`[my] sign-in email failed: ${e instanceof Error ? e.name : 'error'}`);
    }
  }
  return { status: 200, body: { ok: true, message: SIGN_IN_LINK_SENT } };
}
