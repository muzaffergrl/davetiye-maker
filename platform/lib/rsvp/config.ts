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
/** Request body cap for a guest submission (JSON). */
export const BODY_MAX_BYTES = 8 * 1024;
/** Field name of the honeypot input (must stay empty; bots fill it). */
export const HONEYPOT_FIELD = 'website';
/** An identical reply within this window is treated as a double submit (stored once). */
export const DUPLICATE_WINDOW_MS = 5 * 60_000;

export interface RsvpLimits {
  /** Every POST from one client IP (all sites together). */
  perIp: RateLimitRule;
  /** Replies stored for one site (honeypot hits and rejected posts do not count). */
  perSite: RateLimitRule;
}

export const DEFAULT_RSVP_LIMITS: Readonly<RsvpLimits> = Object.freeze({
  perIp: Object.freeze({ limit: 10, windowMs: 15 * 60_000 }),
  perSite: Object.freeze({ limit: 200, windowMs: 60 * 60_000 }),
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
