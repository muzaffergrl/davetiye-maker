// /start claim flow (G045): Etsy order number + email + names -> a draft site from the theme's demo
// content -> the edit link (shown once; only its hash is stored).
// Framework-free: returns {status, body, headers}; lib/claim/api.ts turns that into a Response.
//
// Order of checks for POST /api/start:
//   1. per-IP attempt limit (every request counts)          -> 429 rate_limited
//   2. honeypot field "website" filled                      -> 400 invalid (nothing stored)
//   3. theme exists, is offered and has demo content        -> 404 theme_unavailable
//      … and, in production, is approved for sale (G080, lib/themes/approval.ts) -> 403 theme_in_review
//      (G151: a private theme — custom design — only with an order number from its theme.json list; any other order
//       number gets the unknown-theme 404, so nobody learns that it exists)
//   4. field checks (fields.ts, same rules as the browser)  -> 400 invalid (+ fields)
//   --- serialised per order number (in this process) ---
//   5. order verifier (verify.ts; off by default)           -> 403 order_not_verified / 503 verification_unavailable
//      ("manual": accepted, the site is stored with orderCheck "pending": no publishing until the shop confirms it;
//       "etsy": the receipt is read from Etsy — G147; not connected yet -> "pending" like manual;
//       "trust": Etsy when it can answer, otherwise "provisional": publishable now, checked later — lib/claim/trust.ts)
//      (before the "used" check: with verification on, a stranger gets the same 403 for used and unused numbers)
//   6. the order number already has a website (G951 — two or more designs in one Etsy order):
//      a RETRY of the same claim first: same claim token (the form sends one random token and repeats it on every retry),
//      same email, still an unpublished draft, created < 24 h ago. The first answer was lost on the way (phone changed
//      network), so the buyer never saw the link: the keys are reissued (the unseen old link stops working) -> 201.
//      Otherwise (a full window of the order number's attempts, shared with /my -> 429 rate_limited; only the answers
//      that do not match — another email, a website that is not this email's — count: lib/claim/limits.ts orderAttempts,
//      DEFAULT_CONTINUE_LIMITS.perOrder):
//        another email than the order's websites were started with  -> 409 order_used (no slug, email or link)
//        the same email (lib/claim/continue.ts sameOwnerEmail)       -> 200 {next: "choose", sites, add}: the page asks
//            "Your order already has a website: <Design A> -> Open it" / "Start a second website with <Design B> (only if
//            you bought both in this order)" (the same design bought twice: "Start another website with this design");
//            `add` is null when the order may not get another website (`full`: "receipt" — the Etsy receipt's designs
//            all have their website — or "max", MAX_ORDER_SITES). When no website can be added and one of them is of
//            this design, it is opened at once instead (the lost-link case) -> 200 {existing: true, slug, editPath}.
//        intent "open" + openSlug (one of the websites listed)      -> signed in on this device with a new DEVICE KEY
//            (lib/device-keys.ts; the edit link is untouched) -> 200 {existing: true, slug, editPath}
//        intent "add"                                               -> a further website for the order (step 7 on), in
//            the next free design unit (orderSlot), or 409 order_full (+ `full`, its own message) when `add` would be null:
//              Etsy receipt read (etsy / trust mode with Etsy connected): only within its design units (the receipt's
//                designs must also match this design when its listings are mapped: lib/etsy/verify.ts theme_mismatch);
//              trust mode without the receipt (Gmail / nothing yet): allowed, provisional, and the admin gets a To-do
//                "Order #… now has N websites; check the Etsy order has N designs" AT ONCE (lib/admin/view.ts) — except
//                beyond the designs Etsy's sale email lists: pending, the shop confirms first (claimOrderCheck);
//              manual: allowed, pending like any claim (the shop confirms it).
//      The blob adapter keeps one order index file per unit (orders/<no>~<unit>.json).
//   7. website address: typed one must be free             -> 409 slug_taken (+ suggestion); otherwise the first free one from the names
//   8. per-IP and global "sites created" limits             -> 429 rate_limited / busy
//   9. create the draft (createSiteWithKeys), emails        -> 201 {slug, editUrl, editPath, siteUrl, emailSent}
//      (G147: the edit link to the buyer when SMTP is set; a NEW pending or provisional site is also announced to the shop)
//
// One website per order unit is enforced here with findSitesByOrderRef + an in-process lock (units: step 6).
// Several server instances (Vercel) need a storage guarantee as well: the blob adapter (G048) keeps
// an orders/<number>.json index (orders/<number>~<unit>.json for units 2, 3 …, G152) created only if absent and throws
// OrderRefTakenError: the claim then reads the order again and takes the next free unit, or answers as for a used order
// below; G043 (Supabase) should do the same with a unique index on sites(order_ref, order_slot).

import { randomInt } from 'node:crypto';
import { isValidTimeZone } from '../content/format.ts';
import type { ContentRecord } from '../content/types.ts';
import { OrderRefTakenError, SlugTakenError, type DataAdapter, type OrderCheckRecord, type SiteRecord } from '../data/types.ts';
import { defaultInitials, defaultNameDisplay } from '../panel/model.ts';
import { hashKey, verifyKey } from '../keys.ts';
import { ipBucket, type RateLimiter } from '../rsvp/rate-limit.ts';
import { createSiteWithKeys, orderPending, reissueKeys } from '../sites.ts';
import {
  claimFieldErrors,
  cleanName,
  FIELD_MESSAGES,
  normalizeEmail,
  normalizeOrderNumber,
  normalizeSlugInput,
  slugProblem,
  slugProblemMessage,
  slugWithSuffix,
  suggestSlugBase,
  type ClaimField,
} from './fields.ts';
import { designName, deviceEditPath, ownedSites, siteNames } from './continue.ts';
import { deviceLabel, mintDeviceKey } from '../device-keys.ts';
import { msg } from '../i18n/translate.ts';
import { DEFAULT_CLAIM_LIMITS, DEFAULT_CONTINUE_LIMITS, getClaimRateLimiter, orderAttempts, orderLimitKey, type ClaimLimits, type ContinueLimits } from './limits.ts';
import { getEditLinkMailer, type EditLinkMailer } from './mailer.ts';
import { getShopNotifier, type ShopNotifier } from '../mail/index.ts';
import { claimableTheme } from './themes.ts';
import { THEME_IN_REVIEW, type ApprovalEnv } from '../themes/approval.ts';
import { themeStartable } from '../themes/offered.ts';
import { isPrivateTheme } from '../theme/theme.ts';
import { checkCoversSlot, getOrderVerifier, MAX_ORDER_SITES, orderCoverage, type OrderCheck, type OrderVerifier } from './verify.ts';

export interface ClaimContext {
  adapter: DataAdapter;
  /** Public origin for the links, e.g. https://example.vercel.app (lib/panel/http.ts requestOrigin). */
  origin: string;
  /** Client IP (lib/rsvp/http.ts clientIp); empty values share one "unknown" bucket. */
  ip?: string | null;
  limiter?: RateLimiter;
  limits?: ClaimLimits;
  verifier?: OrderVerifier;
  mailer?: EditLinkMailer;
  /** Shop notice when a new site waits for an order check (G147; default: SMTP when configured, else off). */
  notifier?: ShopNotifier;
  now?: () => number;
  /** Where the theme approval gate reads VERCEL_ENV / THEME_APPROVAL (default process.env; G080). */
  approvalEnv?: ApprovalEnv;
  /** G146: the browser's user agent (a short device label for a sign-in with an order that already has a website). */
  userAgent?: string | null;
  /** G146: limits of signing in with an order number (default DEFAULT_CONTINUE_LIMITS). */
  continueLimits?: ContinueLimits;
}

/** How long a lost /start answer can be recovered by retrying with the same claim token. */
export const CLAIM_RETRY_WINDOW_MS = 24 * 60 * 60_000;

/** The form's one-time claim token (crypto.randomUUID()), or null when missing / malformed. */
export function claimTokenOf(v: unknown): string | null {
  return typeof v === 'string' && /^[A-Za-z0-9_-]{16,128}$/.test(v) ? v : null;
}

/** True when `site` was created by an earlier attempt of this same claim and its link was never used to publish. */
export function isClaimRetry(site: SiteRecord, token: string | null, email: string, now: number): boolean {
  if (!token || !site.claimTokenHash || !verifyKey(token, site.claimTokenHash)) return false;
  const age = now - Date.parse(site.createdAt);
  return (site.ownerEmail ?? '').toLowerCase() === email.toLowerCase() && site.status === 'draft' && site.publishedAt === null && age >= 0 && age < CLAIM_RETRY_WINDOW_MS;
}

export interface ClaimResult {
  status: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
}

export type ClaimErrorCode =
  | 'invalid'
  | 'theme_unavailable'
  | 'theme_in_review'
  | 'order_used'
  | 'order_full'
  | 'order_not_verified'
  | 'verification_unavailable'
  | 'slug_taken'
  | 'rate_limited'
  | 'busy'
  | 'too_large'
  | 'unsupported'
  | 'bad_json'
  | 'server';

/** G951: why the choice offers no further website (shown under the order's websites). */
export const ORDER_FULL_MESSAGES: Record<'receipt' | 'max', string> = {
  receipt: msg(
    'Every design in this Etsy order already has its website. To start another website, please buy the design on Etsy and use that order number.',
  ),
  max: msg('This order already has the most websites one order can have. Please message us on Etsy if you need another one.'),
};

export const CLAIM_MESSAGES: Record<ClaimErrorCode, string> = {
  invalid: msg('Please check the highlighted fields.'),
  theme_unavailable: msg('This design is not available. Please open the start link from your Etsy download again.'),
  theme_in_review: THEME_IN_REVIEW.message,
  // G146: the order has a website and the email is not the one it was started with (the same email signs in instead).
  order_used: msg(
    'A website has already been started with this order number. To open it, go to /my and enter this order number with the email you used when you started it.',
  ),
  // G951: "Start another website" when the order may not get one more (its Etsy receipt's designs all have a website).
  order_full: ORDER_FULL_MESSAGES.receipt,
  order_not_verified: msg('We could not confirm this order. Please check your Etsy order number and email address.'),
  verification_unavailable: msg('We could not check your order right now. Please try again in a few minutes.'),
  slug_taken: msg('This website address is already taken. Please choose another one.'),
  rate_limited: msg('Too many attempts from this connection. Please wait a few minutes and try again.'),
  busy: msg('We are getting a lot of requests right now. Please try again in a few minutes.'),
  too_large: msg('This form is too large to send. Please shorten your entries.'),
  unsupported: msg('Please send the form from the start page.'),
  bad_json: msg('This form could not be read. Please reload the page and try again.'),
  server: msg('Something went wrong. Please try again in a moment.'),
};

export function claimError(
  status: number,
  code: ClaimErrorCode,
  extra: Record<string, unknown> = {},
  headers?: Record<string, string>,
): ClaimResult {
  return { status, body: { ok: false, code, message: CLAIM_MESSAGES[code], ...extra }, ...(headers ? { headers } : {}) };
}

function retryAfter(ms: number): Record<string, string> {
  return { 'Retry-After': String(Math.max(1, Math.ceil(ms / 1000))) };
}

const text = (v: unknown): string => (typeof v === 'string' ? v : '');

// ---------------------------------------------------------------------------------------------
// Draft content and addresses

/**
 * The buyer's first draft: the theme's demo record, marked as customer data, with the buyer's
 * first names. The full names stay empty (null): the designs show the first name until a full name
 * is typed, and a surname added later is never counted as a name change (G060-fix; a full name that
 * started as a copy of the first name made the first surname look like a new name). Everything else
 * stays demo content until they edit it. Demo URLs are null, photos empty (theme placeholders).
 * The time zone is the buyer's phone's when /start sent one (G135, docs/16 §5.3), so the draft, the setup and the
 * shop admin show the same zone from the start (before, only the setup's first step switched it, later).
 */
export function draftFromDemo(demo: ContentRecord, names: readonly string[], timeZone: string | null = null): ContentRecord {
  const content = structuredClone(demo);
  content.record_kind = 'customer';
  if (timeZone) content.timezone = timeZone;
  // Demo artwork may show fictional sample photos. A buyer always starts with empty photo slots.
  content.media = { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null };
  const given = names.map(cleanName);
  if (!given.some(Boolean)) return content;
  const spaced = (content.initials ?? '').includes(' & ');
  given.forEach((name, i) => {
    const partner = content.partners[i];
    if (name && partner) {
      partner.display_name = name;
      partner.full_name = null;
    }
  });
  content.name_display = defaultNameDisplay(content.partners);
  content.initials = defaultInitials(content.partners, spaced).slice(0, 9);
  return content;
}

/** The phone's time zone sent by /start: an IANA "Area/City" name this server knows, else null (the sample stays). */
export function claimTimeZone(v: unknown): string | null {
  return typeof v === 'string' && v.length <= 64 && /^[A-Za-z]+(?:\/[A-Za-z0-9_+-]+)+$/.test(v) && isValidTimeZone(v) ? v : null;
}

async function slugIsFree(adapter: DataAdapter, slug: string): Promise<boolean> {
  return !slugProblem(slug) && !(await adapter.getSiteBySlug(slug));
}

/** First free address: base, base-2 … base-9, then three random 4-digit endings. Null if none is free. */
export async function findFreeSlug(adapter: DataAdapter, base: string): Promise<string | null> {
  const start = normalizeSlugInput(base);
  if (!start || slugProblem(start) === 'format') return null;
  const candidates = [start];
  for (let n = 2; n <= 9; n++) candidates.push(slugWithSuffix(start, String(n)));
  for (let i = 0; i < 3; i++) candidates.push(slugWithSuffix(start, String(randomInt(1000, 10000))));
  for (const c of candidates) if (await slugIsFree(adapter, c)) return c;
  return null;
}

export type SlugAvailability =
  | { value: string; available: true; reason: null; message: null; suggestion: string }
  | { value: string; available: false; reason: 'missing' | 'format' | 'reserved' | 'taken'; message: string; suggestion: string | null };

/** Availability of a typed address for the live hint on /start (the POST checks again). */
export async function slugAvailability(adapter: DataAdapter, input: unknown): Promise<SlugAvailability> {
  const value = normalizeSlugInput(input);
  const problem = slugProblem(value);
  if (problem === 'missing' || problem === 'format') {
    return { value, available: false, reason: problem, message: slugProblemMessage(problem), suggestion: null };
  }
  if (problem === null && !(await adapter.getSiteBySlug(value))) {
    return { value, available: true, reason: null, message: null, suggestion: value };
  }
  const reason = problem ?? 'taken';
  return { value, available: false, reason, message: slugProblemMessage(reason), suggestion: await findFreeSlug(adapter, value) };
}

// ---------------------------------------------------------------------------------------------
// The order check written with a new site

/**
 * The orderCheck a new site starts with (pure). G951: an order whose lines hold no design for this website (services
 * only: lib/claim/verify.ts orderCoverage) is never "verified": in trust mode the site is provisional (publishable, the
 * shop looks), otherwise pending (the shop confirms first) — with `noDesign` for the admin's To-do. A receipt's units are
 * kept with a verification (`units`).
 * A further website (slot >= 2) BEYOND the designs Etsy's sale email lists (Gmail, `source: "mail"`) is pending even in
 * trust mode: a mail never adds websites by itself (within its count they stay provisional with the admin's To-do), and
 * when it says fewer, the shop confirms before that website can be published.
 */
export function claimOrderCheck(check: OrderCheck, verifierKind: string, at: string, privateTheme = false, slot = 1): OrderCheckRecord | null {
  const cover = orderCoverage(check, privateTheme);
  const flag = cover.noDesign ? { noDesign: true } : {};
  // G951: a further website of the order (slot >= 2) is verified only within the Etsy receipt's units
  if (check.result === 'verified' && checkCoversSlot(check, slot, privateTheme)) {
    return { status: 'verified', at, by: 'etsy', ...(cover.receipt && cover.units !== null ? { units: cover.units } : {}) };
  }
  const read = check.result === 'verified' || check.result === 'pending' || check.result === 'provisional';
  const beyondMail = read && check.source === 'mail' && cover.units !== null && slot >= 2 && slot > cover.units;
  if (check.result === 'verified') return { status: verifierKind === 'trust' && !beyondMail ? 'provisional' : 'pending', at, by: 'claim', ...flag };
  if (check.result === 'pending') return { status: 'pending', at, by: 'claim', ...flag };
  if (check.result === 'provisional') return { status: beyondMail ? 'pending' : 'provisional', at, by: 'claim', ...flag };
  return null;
}

// ---------------------------------------------------------------------------------------------
// One claim at a time per order number (this process)

const orderLocks = new Map<string, Promise<unknown>>();

async function withOrderLock<T>(orderNumber: string, fn: () => Promise<T>): Promise<T> {
  const prev = orderLocks.get(orderNumber) ?? Promise.resolve();
  const run = prev.then(fn, fn);
  const tail = run.catch(() => undefined);
  orderLocks.set(orderNumber, tail);
  try {
    return await run;
  } finally {
    if (orderLocks.get(orderNumber) === tail) orderLocks.delete(orderNumber);
  }
}

// ---------------------------------------------------------------------------------------------
// The claim

export interface ClaimSuccessBody {
  ok: true;
  slug: string;
  status: 'draft';
  /** Secret edit link (absolute). */
  editUrl: string;
  /** Same link, root-relative (for navigation on this origin). */
  editPath: string;
  /** Public address; visitors see it after the first Publish. */
  siteUrl: string;
  /** False while no email provider is configured (mailer.ts). */
  emailSent: boolean;
  /** True when the shop still has to confirm the order before the site can be published (manual checks, G060-fix). */
  orderPending: boolean;
}

/**
 * G146: the order already has a website started with this email — it is opened on this device (a device key in
 * `editPath`; the private edit link is not shown or changed).
 */
export interface ClaimExistingBody {
  ok: true;
  existing: true;
  slug: string;
  /** Root-relative panel path with this device's key. */
  editPath: string;
  siteUrl: string;
  names: string;
  orderPending: boolean;
}

/**
 * G951: the order already has a website (or several) started with this email — the page asks: open one of them, or
 * start one more (`add`, null when the order may not get another: `full`).
 */
export interface ClaimChooseBody {
  ok: true;
  next: 'choose';
  /** The order's websites started with this email (names and addresses only; never another buyer's). */
  sites: Array<{ slug: string; names: string; design: string; sameDesign: boolean }>;
  /** Starting one more website with the design of this page; `sameDesign`: the order already has one of it. */
  add: { design: string; sameDesign: boolean } | null;
  /** Why `add` is null: the Etsy receipt's designs all have a website ("receipt"), or MAX_ORDER_SITES ("max"). */
  full?: 'receipt' | 'max';
  /** With `full`: the words for it (English; the page translates). */
  message?: string;
}

/**
 * G951: may the order get one more website, and in which design unit (orderSlot)? Pure.
 *   MAX_ORDER_SITES websites already                         -> no ("max")
 *   the Etsy receipt was read (check units, not a mail)      -> only while websites < its units ("receipt")
 *   otherwise (trust without the receipt, Gmail, manual, off) -> yes: the shop is told / confirms (admin To-do)
 * `taken`: units another instance just took (their index exists, a listing may not show the site yet).
 */
export function orderRoom(
  sites: readonly Pick<SiteRecord, 'orderSlot'>[],
  check: OrderCheck,
  privateTheme = false,
  taken: ReadonlySet<number> = new Set(),
): { slot: number | null; full?: 'receipt' | 'max' } {
  const used = new Set([...taken, ...sites.map((x) => x.orderSlot ?? 1)]);
  const count = Math.max(sites.length, used.size);
  if (count >= MAX_ORDER_SITES) return { slot: null, full: 'max' };
  const cover = orderCoverage(check, privateTheme);
  if (cover.receipt && cover.units !== null && count >= cover.units) return { slot: null, full: 'receipt' };
  for (let n = 1; n <= MAX_ORDER_SITES; n++) if (!used.has(n)) return { slot: n };
  return { slot: null, full: 'max' };
}

/**
 * POST /api/start body: {theme, variant?, orderNumber, email, names: [first, second], slug?, claimToken?, timeZone?,
 * intent? ("open" + openSlug | "add", G951), website? (honeypot)}.
 */
export async function claimSite(ctx: ClaimContext, raw: Record<string, unknown>): Promise<ClaimResult> {
  const { adapter } = ctx;
  const limiter = ctx.limiter ?? getClaimRateLimiter();
  const limits = ctx.limits ?? DEFAULT_CLAIM_LIMITS;
  const ip = ipBucket(ctx.ip ?? '');

  const attempt = await limiter.hit(`claim:attempt:${ip}`, limits.attemptsPerIp);
  if (!attempt.allowed) return claimError(429, 'rate_limited', {}, retryAfter(attempt.retryAfterMs));

  if (text(raw.website).trim()) return claimError(400, 'invalid'); // honeypot: a person never fills it

  // G151: a private theme (custom design) only with an order number from its list; else the same 404 as an unknown theme.
  const theme = await claimableTheme(raw.theme, { order: raw.orderNumber });
  if (!theme) return claimError(404, 'theme_unavailable');
  if (!themeStartable(theme, ctx.approvalEnv)) return claimError(403, 'theme_in_review');

  const names = (Array.isArray(raw.names) ? raw.names : []).slice(0, 2).map(text);
  const values = { orderNumber: text(raw.orderNumber), email: text(raw.email), names, slug: text(raw.slug) };
  const fields: Partial<Record<ClaimField, string>> = claimFieldErrors(values, theme.partnerCount);
  if (Object.keys(fields).length) return claimError(400, 'invalid', { fields });

  const orderNumber = normalizeOrderNumber(values.orderNumber)!;
  const email = normalizeEmail(values.email)!;
  const buyerNames = names.slice(0, theme.partnerCount).map(cleanName);
  const requestedSlug = normalizeSlugInput(values.slug) || null;
  const claimToken = claimTokenOf(raw.claimToken);
  const now = ctx.now ?? Date.now;

  /**
   * `created`: a NEW site (not a retry): a pending or provisional one (`notice`) is announced to the shop by email (G147;
   * never blocks the claim).
   */
  const answer = async (
    slug: string,
    editKey: string,
    pending: boolean,
    created: { siteId: string; notice: 'pending' | 'provisional' | null } | null = null,
  ): Promise<ClaimResult> => {
    const origin = ctx.origin.replace(/\/+$/, '');
    const editPath = `/edit/${slug}?k=${encodeURIComponent(editKey)}`;
    const editUrl = `${origin}${editPath}`;
    const siteUrl = `${origin}/${slug}`;
    let emailSent = false;
    const mailer = ctx.mailer ?? getEditLinkMailer();
    const notifier = ctx.notifier ?? getShopNotifier();
    const buyerMail = async () => {
      try {
        emailSent = (await mailer.send({ to: email, editUrl, siteUrl, themeName: theme.name, orderNumber, kind: 'created' })).sent === true;
      } catch (e) {
        // Never log the message (it holds the secret link).
        console.error(`[claim] edit link email for "${slug}" failed: ${e instanceof Error ? e.name : 'error'}`);
      }
    };
    const shopNotice = async () => {
      try {
        // No secret in it: the order number, the design and the admin page of the site.
        await notifier.pendingOrder({
          kind: created!.notice ?? 'pending',
          orderNumber,
          themeName: theme.name,
          adminUrl: `${origin}/admin/site/${encodeURIComponent(created!.siteId)}`,
        });
      } catch (e) {
        console.error(`[claim] shop notice for "${slug}" failed: ${e instanceof Error ? e.name : 'error'}`);
      }
    };
    await Promise.all([mailer.enabled ? buyerMail() : null, created?.notice && notifier.enabled ? shopNotice() : null]);
    const body: ClaimSuccessBody = { ok: true, slug, status: 'draft', editUrl, editPath, siteUrl, emailSent, orderPending: pending };
    return { status: 201, body: body as unknown as Record<string, unknown> };
  };

  /** The recovered link when this request repeats a claim whose answer was lost (same claim token), else null. */
  const retryOf = async (sites: SiteRecord[]): Promise<ClaimResult | null> => {
    const mine = sites.find((s) => isClaimRetry(s, claimToken, email, now()));
    if (!mine) return null;
    const reissued = await reissueKeys(adapter, mine.id);
    return answer(reissued.site.slug, reissued.editKey, orderPending(reissued.site));
  };

  /** G146: the buyer's own website of this order opened on this device with a device key (the edit link is untouched). */
  const signIn = async (site: SiteRecord): Promise<ClaimResult> => {
    const { key } = await mintDeviceKey(adapter, site, { label: deviceLabel(ctx.userAgent), via: 'start', now: new Date(now()) });
    const origin = ctx.origin.replace(/\/+$/, '');
    const body: ClaimExistingBody = {
      ok: true,
      existing: true,
      slug: site.slug,
      editPath: deviceEditPath(site.slug, key),
      siteUrl: `${origin}/${site.slug}`,
      names: siteNames(site),
      orderPending: orderPending(site),
    };
    return { status: 200, body: body as unknown as Record<string, unknown> };
  };

  const intent = raw.intent === 'open' || raw.intent === 'add' ? raw.intent : null;
  const openSlug = typeof raw.openSlug === 'string' ? raw.openSlug.slice(0, 80) : '';

  /**
   * G951: the order already has websites (step 6 at the top): "order used" for another email; for the same email the
   * choice (open one / start one more), the website asked for, or the unit for one more. A number = the design unit the
   * new website takes; anything else is the answer.
   */
  const existingOrder = async (sites: SiteRecord[], check: OrderCheck, taken: ReadonlySet<number>): Promise<ClaimResult | number> => {
    // only the answers that do not match use up the order number's attempts (limits.ts orderAttempts)
    const attempts = orderAttempts(limiter, orderLimitKey('my:order', orderNumber), (ctx.continueLimits ?? DEFAULT_CONTINUE_LIMITS).perOrder);
    const perOrder = await attempts.check();
    if (!perOrder.allowed) return claimError(429, 'rate_limited', {}, retryAfter(perOrder.retryAfterMs));
    const owned = ownedSites(sites, email);
    const used = async () => {
      await attempts.miss();
      return claimError(409, 'order_used');
    };
    if (!owned.length) return used();
    if (intent === 'open') {
      const site = owned.find((x) => x.slug === openSlug);
      return site ? signIn(site) : used();
    }
    const room = orderRoom(sites, check, isPrivateTheme(theme.manifest), taken);
    // the reason of its own: the receipt's designs all have their website, or MAX_ORDER_SITES
    const full = room.full ?? 'max';
    if (intent === 'add') return room.slot ?? claimError(409, 'order_full', { full, message: ORDER_FULL_MESSAGES[full] });
    const same = owned.find((x) => x.theme === theme.id);
    if (room.slot === null && same) return signIn(same); // nothing can be added: the lost-link case opens it at once
    const body: ClaimChooseBody = {
      ok: true,
      next: 'choose',
      sites: owned.map((x) => ({ slug: x.slug, names: siteNames(x), design: designName(x.theme), sameDesign: x.theme === theme.id })),
      add: room.slot === null ? null : { design: theme.name, sameDesign: Boolean(same) },
      ...(room.slot === null ? { full, message: ORDER_FULL_MESSAGES[full] } : {}),
    };
    return { status: 200, body: body as unknown as Record<string, unknown> };
  };

  return withOrderLock(orderNumber, async () => {
    const verifier = ctx.verifier ?? getOrderVerifier();
    const check = await verifier.check({ orderNumber, email, theme: theme.id, cached: true });
    if (check.result === 'rejected') return claimError(403, 'order_not_verified');
    if (check.result === 'unavailable') return claimError(503, 'verification_unavailable', {}, { 'Retry-After': '60' });

    /** Units another instance took while this claim ran (the order index refused them; a listing may not show them yet). */
    const lostSlots = new Set<number>();
    /** The design unit a new website takes, or the answer (a retry's link, the choice, a sign-in, "used", "full"). */
    const plan = async (sites: SiteRecord[]): Promise<ClaimResult | number> => {
      if (!sites.length && !lostSlots.size) return 1;
      const retry = await retryOf(sites);
      if (retry) return retry;
      return existingOrder(sites, check, lostSlots);
    };
    let existing = await adapter.findSitesByOrderRef(orderNumber);
    const first = await plan(existing);
    if (typeof first !== 'number') return first;
    let slot = first;

    const taken = async (from: string) =>
      claimError(409, 'slug_taken', { fields: { slug: FIELD_MESSAGES.slugTaken }, suggestion: await findFreeSlug(adapter, from) });

    let slug: string;
    if (requestedSlug) {
      if (!(await slugIsFree(adapter, requestedSlug))) return taken(requestedSlug);
      slug = requestedSlug;
    } else {
      const base = suggestSlugBase(buyerNames);
      const free = await findFreeSlug(adapter, base);
      if (!free) return taken(base);
      slug = free;
    }

    const perIp = await limiter.hit(`claim:sites:${ip}`, limits.sitesPerIp);
    if (!perIp.allowed) return claimError(429, 'rate_limited', {}, retryAfter(perIp.retryAfterMs));
    const global = await limiter.hit('claim:sites:all', limits.sitesGlobal);
    if (!global.allowed) return claimError(429, 'busy', {}, retryAfter(global.retryAfterMs));

    const content = draftFromDemo(theme.demo, buyerNames, claimTimeZone(raw.timeZone));
    // Manual order checks (G060-fix): the draft is made now, publishing waits for the shop (scripts/verify-order.ts).
    // Trust mode: the draft is made and publishable now; the order is checked later (lib/claim/trust.ts).
    const at = new Date(now()).toISOString();
    let created: Awaited<ReturnType<typeof createSiteWithKeys>> | null = null;
    for (let tries = 0; !created; tries++) {
      // G951: a further website (slot >= 2) is verified only within the Etsy receipt's units; otherwise it waits for the
      // shop (pending) or, in trust mode, is publishable with an admin To-do (provisional).
      const orderCheck = claimOrderCheck(check, verifier.kind, at, isPrivateTheme(theme.manifest), slot);
      try {
        created = await createSiteWithKeys(adapter, {
          slug,
          theme: theme.id,
          // G153: the colour palette picked on /start (createSiteWithKeys keeps only a live palette of the design)
          variant: typeof raw.variant === 'string' ? raw.variant : null,
          content,
          orderRef: orderNumber,
          ownerEmail: email,
          claimTokenHash: claimToken ? hashKey(claimToken) : null,
          orderCheck,
          orderSlot: slot,
        });
      } catch (e) {
        // Another server instance won the race for this unit (possibly our own earlier attempt of this claim): read the
        // order again — the recovered link, the choice / "used" (G951), or for "add" the next free unit (G152).
        if (e instanceof OrderRefTakenError) {
          lostSlots.add(slot);
          existing = await adapter.findSitesByOrderRef(orderNumber);
          const next = await plan(existing);
          if (typeof next !== 'number') return next;
          slot = next;
          continue;
        }
        if (!(e instanceof SlugTakenError)) throw e;
        // Someone took the address between the check and the write.
        if (requestedSlug || tries >= 2) return taken(slug);
        const next = await findFreeSlug(adapter, slug);
        if (!next) return taken(slug);
        slug = next;
      }
    }

    const status = created.site.orderCheck?.status;
    return answer(slug, created.editKey, orderPending(created.site), {
      siteId: created.site.id,
      notice: status === 'pending' || status === 'provisional' ? status : null,
    });
  });
}

