// Shop admin sign-in (G087, K30). One shared password for the shop, set as ADMIN_PASSWORD in the hosting
// environment (never in the repo). Unset or too short: the admin is OFF and /admin says how to turn it on.
//
// A signed-in browser holds an HttpOnly cookie "<expiry>.<HMAC>"; the HMAC key is derived from the password, so
// changing ADMIN_PASSWORD signs every session out. No session store, nothing written to the data store.
// Cookie: HttpOnly, SameSite=Strict, Secure on https, Path=/ (the pages under /admin and the API under /api/admin).
// Admin API writes also check that Origin is this site (lib/admin/http.ts) — SameSite=Strict already keeps
// cross-site requests from carrying the cookie; the Origin check is the second lock.

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { MARKETING } from '../marketing/config.ts';

export const ADMIN_COOKIE = 'bke_admin';
/** Sessions last 12 hours; the shop signs in again after that. */
export const ADMIN_SESSION_MS = 12 * 60 * 60 * 1000;
/** Once the shop is launched, shorter passwords leave the admin off (a guessable shared password would open every buyer's site). */
export const ADMIN_PASSWORD_MIN = 12;
/**
 * K33 (2026-10-15): before launch (MARKETING.launched false — demo and test sites only, no real buyers) the owner may use
 * a short temporary password. The admin then shows a reminder, and `launched: true` refuses to build while the password
 * is shorter than ADMIN_PASSWORD_MIN (lib/marketing/placeholders.ts launchProblems).
 */
export const ADMIN_PASSWORD_MIN_PRELAUNCH = 4;

export type AdminConfig = { state: 'on'; password: string; temporary: boolean } | { state: 'off' } | { state: 'weak' };

export function adminConfig(env: Record<string, string | undefined> = process.env, launched: boolean = MARKETING.launched): AdminConfig {
  const password = env.ADMIN_PASSWORD ?? '';
  if (!password) return { state: 'off' };
  if (password.length < (launched ? ADMIN_PASSWORD_MIN : ADMIN_PASSWORD_MIN_PRELAUNCH)) return { state: 'weak' };
  return { state: 'on', password, temporary: password.length < ADMIN_PASSWORD_MIN };
}

function sessionKey(password: string): Buffer {
  return createHash('sha256').update(`bke-admin-session:v1:${password}`).digest();
}

function sign(password: string, exp: number): string {
  return createHmac('sha256', sessionKey(password)).update(`admin:${exp}`).digest('base64url');
}

/** Constant-time password check (both sides hashed first, so lengths never leak). */
export function passwordMatches(given: unknown, password: string): boolean {
  if (typeof given !== 'string' || !given) return false;
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(password).digest();
  return timingSafeEqual(a, b);
}

export function newSessionToken(password: string, now: number = Date.now()): { token: string; expires: number } {
  const exp = now + ADMIN_SESSION_MS;
  return { token: `${exp}.${sign(password, exp)}`, expires: exp };
}

export function verifySessionToken(token: unknown, password: string, now: number = Date.now()): boolean {
  if (typeof token !== 'string') return false;
  const m = /^(\d{13})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!m) return false;
  const exp = Number(m[1]);
  if (!(exp > now) || exp - now > ADMIN_SESSION_MS + 60_000) return false;
  const want = Buffer.from(sign(password, exp));
  const got = Buffer.from(m[2]);
  return want.length === got.length && timingSafeEqual(want, got);
}

/** Value of one cookie from a Cookie header. */
export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

/** True when the request carries a valid admin session and the admin is on. */
export function isAdminRequest(cookieHeader: string | null, env: Record<string, string | undefined> = process.env, now: number = Date.now()): boolean {
  const cfg = adminConfig(env);
  if (cfg.state !== 'on') return false;
  return verifySessionToken(readCookie(cookieHeader, ADMIN_COOKIE), cfg.password, now);
}

export function sessionCookie(token: string, expires: number, secure: boolean): string {
  return [
    `${ADMIN_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Expires=${new Date(expires).toUTCString()}`,
    `Max-Age=${Math.floor(ADMIN_SESSION_MS / 1000)}`,
    ...(secure ? ['Secure'] : []),
  ].join('; ');
}

export function clearedSessionCookie(secure: boolean): string {
  return [`${ADMIN_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0', ...(secure ? ['Secure'] : [])].join('; ');
}
