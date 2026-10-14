// RSVP settings: field limits, rate-limit rules and the theme's optional guest cap.
//
// A theme may set its own guest cap in theme.json:
//   { ..., "rsvp": { "max_guests": 6 } }      (integer 1..MAX_GUESTS_CEILING)
// Without it the platform default (DEFAULT_MAX_GUESTS) applies. The server always
// enforces the cap; the form's max="" attribute is only a hint for the browser.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { THEME_ID_RE, themesDir } from '../theme/theme.ts';
import type { RateLimitRule } from './rate-limit.ts';

export const DEFAULT_MAX_GUESTS = 10;
export const MAX_GUESTS_CEILING = 20;
export const NAME_MAX = 120;
export const EMAIL_MAX = 254;
export const MESSAGE_MAX = 500;
/** Longest answer to a custom "text" question (G051). */
export const ANSWER_MAX = 300;
/** Longest name of another guest in a reply (G069: "party:<n>" fields; same as the name of the guest who replies). */
export const PARTY_NAME_MAX = NAME_MAX;
/** Request body cap for a guest submission (JSON). */
export const BODY_MAX_BYTES = 8 * 1024;
/** Field name of the honeypot input (must stay empty; bots fill it). */
export const HONEYPOT_FIELD = 'website';
/** An identical reply within this window is treated as a double submit (stored once). */
export const DUPLICATE_WINDOW_MS = 5 * 60_000;

/**
 * Limits for guest replies. A shared connection (venue Wi-Fi, office, mobile carrier NAT) can carry
 * many real guests, so the per-address rules are per SITE; the cross-site rule is only an abuse
 * ceiling. Unusual volume never turns real guests away: replies over `perSite` / `perSiteIpStored`
 * are stored as HELD (not counted, not in the CSV) until the couple keeps or removes them in the
 * panel. Only when even the held store is full (`heldPerSite`) is a reply refused (429 busy).
 */
export interface RsvpLimits {
  /** Every POST from one client IP, all sites together (abuse ceiling). */
  perIp: RateLimitRule;
  /** Every POST from one client IP to one site. */
  perSiteIp: RateLimitRule;
  /** Replies stored for one site before new ones are held for review. */
  perSite: RateLimitRule;
  /** Replies stored from one client IP for one site before new ones are held for review. */
  perSiteIpStored: RateLimitRule;
  /** Held replies for one site; beyond it replies are refused (storage ceiling). */
  heldPerSite: RateLimitRule;
}

export const DEFAULT_RSVP_LIMITS: Readonly<RsvpLimits> = Object.freeze({
  perIp: Object.freeze({ limit: 100, windowMs: 15 * 60_000 }),
  perSiteIp: Object.freeze({ limit: 30, windowMs: 15 * 60_000 }),
  perSite: Object.freeze({ limit: 200, windowMs: 60 * 60_000 }),
  perSiteIpStored: Object.freeze({ limit: 10, windowMs: 60 * 60_000 }),
  heldPerSite: Object.freeze({ limit: 500, windowMs: 24 * 60 * 60_000 }),
});

const cache = new Map<string, number>();

/** Guest cap for a theme: theme.json rsvp.max_guests when valid, else DEFAULT_MAX_GUESTS. Never throws. */
export async function themeMaxGuests(themeId: string): Promise<number> {
  if (!THEME_ID_RE.test(themeId)) return DEFAULT_MAX_GUESTS;
  const file = path.join(themesDir(), themeId, 'theme.json');
  const useCache = process.env.NODE_ENV === 'production';
  if (useCache && cache.has(file)) return cache.get(file)!;
  let value = DEFAULT_MAX_GUESTS;
  try {
    const raw = JSON.parse(await fs.readFile(file, 'utf8')) as { rsvp?: { max_guests?: unknown } };
    const n = raw?.rsvp?.max_guests;
    if (typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= MAX_GUESTS_CEILING) value = n;
  } catch {
    /* missing or unreadable theme.json: default cap */
  }
  if (useCache) cache.set(file, value);
  return value;
}
