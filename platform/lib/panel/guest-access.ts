// Guest password rules (G076, K28) shared by the panel (browser) and the server. Pure: no Node imports.
//
// A couple can protect their website with ONE password for all guests (off by default). It is meant to be shared (in the
// invitation message), so the couple can see and copy it in the panel; it is never sent to a public page. Guests type it
// on a phone: the comparison ignores upper/lower case and extra spaces (lib/site/access.ts compares in constant time).

export const GUEST_PASSWORD_MIN = 4;
export const GUEST_PASSWORD_MAX = 40;

/** What the panel shows (PanelMeta.guestAccess). The cookie secret and the version never leave the server. */
export interface GuestAccessView {
  enabled: boolean;
  /** The stored password (also while protection is off, so switching it back on reuses it); null = none set yet. */
  password: string | null;
}

export const NO_GUEST_ACCESS: GuestAccessView = Object.freeze({ enabled: false, password: null }) as GuestAccessView;

// Control characters and invisible / bidi marks: never part of a password (they cannot be typed or seen).
const INVISIBLE_RE = /[\u0000-\u001f\u007f-\u009f­​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;

/** The password as stored: NFC, invisible characters removed, spaces collapsed, trimmed. */
export function cleanGuestPassword(value: string): string {
  return value.normalize('NFC').replace(INVISIBLE_RE, '').replace(/\s+/g, ' ').trim();
}

/** The form compared with what a guest types: cleaned + lower case ("Rose Garden" = "rose garden"). */
export function comparableGuestPassword(value: string): string {
  return cleanGuestPassword(value).toLowerCase();
}

/** English message for a password the couple cannot use, or null when it is fine. */
export function guestPasswordProblem(value: unknown): string | null {
  if (typeof value !== 'string') return 'Please enter a password.';
  const clean = cleanGuestPassword(value);
  const length = [...clean].length;
  if (!length) return 'Please enter a password.';
  if (length < GUEST_PASSWORD_MIN) return `Please use at least ${GUEST_PASSWORD_MIN} characters.`;
  if (length > GUEST_PASSWORD_MAX) return `Please use at most ${GUEST_PASSWORD_MAX} characters.`;
  return null;
}

// Short, friendly words that are easy to spell on a phone keyboard (no letters that look alike in most fonts matter:
// the comparison ignores case). 96 words × 96 words × 90 numbers ≈ 830,000 suggestions.
const WORDS = [
  'Amber', 'Apple', 'Aster', 'Autumn', 'Basil', 'Bloom', 'Breeze', 'Bright', 'Candle', 'Cedar', 'Cherry', 'Clover',
  'Coral', 'Cotton', 'Daisy', 'Dawn', 'Dove', 'Ember', 'Fern', 'Field', 'Fig', 'Garden', 'Ginger', 'Golden',
  'Harbor', 'Hazel', 'Heart', 'Honey', 'Iris', 'Ivory', 'Ivy', 'Jasmine', 'Juniper', 'Lace', 'Lake', 'Lark',
  'Laurel', 'Lemon', 'Lilac', 'Lily', 'Linen', 'Lotus', 'Maple', 'Marble', 'Meadow', 'Mint', 'Moon', 'Morning',
  'Olive', 'Orange', 'Orchard', 'Orchid', 'Peach', 'Pearl', 'Petal', 'Pine', 'Plum', 'Poppy', 'Quiet', 'Rain',
  'Ribbon', 'River', 'Robin', 'Rose', 'Ruby', 'Saffron', 'Sage', 'Sand', 'Shell', 'Silver', 'Sky', 'Snow',
  'Spring', 'Star', 'Stone', 'Summer', 'Sun', 'Swan', 'Thyme', 'Tulip', 'Valley', 'Velvet', 'Violet', 'Waltz',
  'Wave', 'Willow', 'Winter', 'Wish', 'Wren', 'Bay', 'Cove', 'Glow', 'Hill', 'Lumen', 'Nectar', 'Tide',
] as const;

/** Uniform integer in [0, n) from the browser's or Node's Web Crypto. */
function randomBelow(n: number, random?: (n: number) => number): number {
  if (random) return random(n);
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x1_0000_0000 / n) * n; // no modulo bias
  do globalThis.crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return buf[0] % n;
}

/** A suggestion such as "OliveRiver27": two different words and a number from 10 to 99 (letters + digits only). */
export function suggestGuestPassword(random?: (n: number) => number): string {
  const a = randomBelow(WORDS.length, random);
  let b = randomBelow(WORDS.length - 1, random);
  if (b >= a) b += 1;
  return `${WORDS[a]}${WORDS[b]}${10 + randomBelow(90, random)}`;
}

export const GUEST_PASSWORD_WORDS: readonly string[] = WORDS;
