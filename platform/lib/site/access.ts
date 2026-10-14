// Optional guest password of a couple's website (G076, K28). Server only.
//
// Stored in the PRIVATE site record (SiteRecord.guestAccess): {enabled, password, version, secret}. The password never
// goes into a page; the couple sees it in the panel (it is meant to be shared in the invitation message).
//
// A guest who enters it gets a cookie for THIS site only:
//   name   __Host-guest-<site id>            (one cookie per site; Path=/ so /media and /api/rsvp get it too)
//   value  <version>.<exp>.<HMAC-SHA256(secret, "guest-access:v1:<site id>:<version>:<exp>")>
//   flags  HttpOnly; Secure; SameSite=Lax; Max-Age = 90 days
// The signature binds the site id and the password version: a cookie copied under another site's name fails, and a
// new password (version + 1) signs every guest out. Comparisons are constant-time.
//
// What a request may see (every guest route: pages, /event.ics, /media photos, RSVP API):
//   1. bad / unknown slug, site never published (no preview)      -> 404 (nothing is said about a password)
//   2. archived site (12 months after the wedding)                -> 410 archive page (no names) — before the password
//   3. the panel's short-lived preview token                      -> always open (the couple, no password needed)
//   4. password on, no valid cookie (also the long-lived preview link):
//        pages -> the password page (200, names + "You're invited" only; lib/site/gate.ts), /event.ics -> 303 to /<slug>,
//        /media -> 401 (no image), RSVP status / reply -> 401 password_required (nothing stored)
//   5. otherwise the page (protected sites: private, no-store + Vary: Cookie; names-only meta tags; photos private)
// A future thank-you mode (G075) is content of the couple: it comes after step 4, behind the password.

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { AdapterRateLimiter } from '../claim/limits.ts';
import { getDataAdapter } from '../data/index.ts';
import { StaleSiteError, type DataAdapter, type GuestAccessRecord, type SiteRecord } from '../data/types.ts';
import { cleanGuestPassword, comparableGuestPassword, guestPasswordProblem, NO_GUEST_ACCESS, type GuestAccessView } from '../panel/guest-access.ts';
import { MemoryRateLimiter, type RateLimiter, type RateLimitRule } from '../rsvp/rate-limit.ts';

export const GUEST_COOKIE_DAYS = 90;
export const GUEST_COOKIE_MAX_AGE_S = GUEST_COOKIE_DAYS * 24 * 60 * 60;

const MINUTE = 60_000;

/**
 * Wrong passwords (the right one is never counted: a whole family or a venue's Wi-Fi can open the site from one
 * address). While a window is full every attempt is refused, the right password too, so guessing cannot go on.
 */
export const ACCESS_LIMITS: Readonly<{ wrongPerSiteIp: RateLimitRule; wrongPerIp: RateLimitRule }> = Object.freeze({
  /** Wrong passwords from one address for one website. */
  wrongPerSiteIp: Object.freeze({ limit: 10, windowMs: 15 * MINUTE }),
  /** Wrong passwords from one address for all websites together (one machine trying many weddings). */
  wrongPerIp: Object.freeze({ limit: 30, windowMs: 15 * MINUTE }),
});

/** True when guests need the password. A malformed record with enabled=true stays closed (fail closed). */
export function isProtected(site: Pick<SiteRecord, 'guestAccess'>): boolean {
  return site.guestAccess?.enabled === true;
}

/** What the panel may show (never the secret or the version). */
export function guestAccessView(site: Pick<SiteRecord, 'guestAccess'>): GuestAccessView {
  const a = site.guestAccess;
  if (!a) return { ...NO_GUEST_ACCESS };
  return { enabled: a.enabled === true, password: typeof a.password === 'string' && a.password ? a.password : null };
}

// ---------------------------------------------------------------------------------------------- password

function sha256(text: string): Buffer {
  return createHash('sha256').update(text, 'utf8').digest();
}

/** Constant-time check of what a guest typed (case and extra spaces ignored). Never throws. */
export function guestPasswordMatches(access: GuestAccessRecord | null | undefined, presented: unknown): boolean {
  if (!access || typeof access.password !== 'string' || !access.password || typeof presented !== 'string') return false;
  // Fixed-length digests: the time does not depend on where the strings differ or on their lengths.
  const a = sha256(comparableGuestPassword(presented.slice(0, 400)));
  const b = sha256(comparableGuestPassword(access.password));
  return timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------------------------- cookie

const SIG_RE = /^[A-Za-z0-9_-]{43}$/;

/** The cookie of one site. `__Host-`: Secure, Path=/, no Domain — no other host can set or read it. */
export function guestCookieName(siteId: string): string {
  return `__Host-guest-${siteId.replace(/[^A-Za-z0-9]/g, '').slice(0, 64)}`;
}

function cookieSignature(siteId: string, access: GuestAccessRecord, version: number, exp: number): string {
  return createHmac('sha256', access.secret).update(`guest-access:v1:${siteId}:${version}:${exp}`).digest('base64url');
}

function usableRecord(access: GuestAccessRecord | null | undefined): access is GuestAccessRecord {
  return Boolean(access && typeof access.secret === 'string' && access.secret.length >= 32 && Number.isInteger(access.version));
}

/** Cookie value for a guest who entered the right password now. */
export function guestCookieValue(site: Pick<SiteRecord, 'id' | 'guestAccess'>, now: number = Date.now()): string {
  const access = site.guestAccess;
  if (!usableRecord(access)) throw new Error('site has no guest password');
  const exp = Math.floor(now / 1000) + GUEST_COOKIE_MAX_AGE_S;
  return `${access.version}.${exp}.${cookieSignature(site.id, access, access.version, exp)}`;
}

/** Set-Cookie header value (HttpOnly; Secure; SameSite=Lax; 90 days). */
export function guestSetCookie(site: Pick<SiteRecord, 'id' | 'guestAccess'>, now: number = Date.now()): string {
  return `${guestCookieName(site.id)}=${guestCookieValue(site, now)}; Max-Age=${GUEST_COOKIE_MAX_AGE_S}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

/** Every value of cookie `name` in a Cookie header (a browser can send two with the same name). */
export function cookieValues(header: string | null | undefined, name: string): string[] {
  if (!header) return [];
  const out: string[] = [];
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) out.push(part.slice(eq + 1).trim());
  }
  return out;
}

/** Constant-time check of one cookie value against the site's current password version. Never throws. */
export function verifyGuestCookie(site: Pick<SiteRecord, 'id' | 'guestAccess'>, value: unknown, now: number = Date.now()): boolean {
  const access = site.guestAccess;
  if (!usableRecord(access) || typeof value !== 'string' || value.length > 200) return false;
  const [v, e, sig, ...rest] = value.split('.');
  if (rest.length || !/^\d{1,9}$/.test(v ?? '') || !/^\d{9,11}$/.test(e ?? '') || !SIG_RE.test(sig ?? '')) return false;
  const version = Number(v);
  const exp = Number(e);
  if (version !== access.version || exp * 1000 <= now || exp * 1000 - now > (GUEST_COOKIE_MAX_AGE_S + 60) * 1000) return false;
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(cookieSignature(site.id, access, version, exp), 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

/** True when this request may see the site: no password, or a valid cookie for THIS site and password version. */
export function guestMayEnter(site: Pick<SiteRecord, 'id' | 'guestAccess'>, cookieHeader: string | null | undefined, now: number = Date.now()): boolean {
  if (!isProtected(site)) return true;
  return cookieValues(cookieHeader, guestCookieName(site.id)).some((v) => verifyGuestCookie(site, v, now));
}

// ---------------------------------------------------------------------------------------------- rate limit

let limiter: RateLimiter | null = null;

/**
 * Wrong-password limiter: the data adapter's shared counter when it has one (blob: every Vercel instance counts the same
 * window, lib/claim/limits.ts AdapterRateLimiter), else in-process memory (local: one process).
 */
export function getAccessRateLimiter(): RateLimiter {
  if (!limiter) {
    const adapter = getDataAdapter();
    limiter = adapter.hitCounter ? new AdapterRateLimiter(adapter) : new MemoryRateLimiter();
  }
  return limiter;
}

/** Replaces the limiter (tests). null restores the default choice. */
export function setAccessRateLimiter(next: RateLimiter | null): void {
  limiter = next;
}

// ---------------------------------------------------------------------------------------------- panel write

export class GuestPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GuestPasswordError';
  }
}

/**
 * Turns the guest password on/off or changes it (panel, Share). `password` omitted keeps the stored one (switching back
 * on). A different password (compared like guests type it) bumps the version: every guest is asked again. Turning it
 * off keeps the password and version (switching it back on with the same password does not sign anyone out).
 * One conditional write, retried when another write landed in between. Throws GuestPasswordError (422).
 */
export async function setGuestAccess(
  adapter: DataAdapter,
  siteId: string,
  input: { enabled: boolean; password?: string | null },
  now: Date = new Date(),
): Promise<{ site: SiteRecord; signedOut: boolean }> {
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site) throw new Error(`site ${siteId} not found`);
    const current = site.guestAccess ?? null;
    // Nothing stored and nothing to store: no write (the panel's switch was only flicked).
    if (!current && !input.enabled && (input.password === undefined || input.password === null)) return { site, signedOut: false };
    let password = typeof current?.password === 'string' ? current.password : '';
    if (input.password !== undefined && input.password !== null) {
      const problem = guestPasswordProblem(input.password);
      if (problem) throw new GuestPasswordError(problem);
      password = cleanGuestPassword(input.password);
    }
    if (input.enabled && guestPasswordProblem(password)) throw new GuestPasswordError(guestPasswordProblem(password)!);
    const changed = Boolean(current && password && comparableGuestPassword(password) !== comparableGuestPassword(current.password ?? ''));
    const next: GuestAccessRecord = {
      enabled: input.enabled,
      password,
      version: current && Number.isInteger(current.version) ? current.version + (changed ? 1 : 0) : 1,
      secret: current && typeof current.secret === 'string' && current.secret.length >= 32 ? current.secret : randomBytes(32).toString('base64url'),
      updatedAt: now.toISOString(),
    };
    try {
      const saved = await adapter.patchSite(siteId, { guestAccess: next }, { expectedUpdatedAt: site.updatedAt });
      // Guests who entered the old password are asked for the new one (only matters while the website is protected).
      return { site: saved, signedOut: changed && current?.enabled === true && input.enabled };
    } catch (e) {
      if (!(e instanceof StaleSiteError) || attempt >= 5) throw e;
    }
  }
}
