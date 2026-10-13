// /start form fields (G045): normalisation and checks shared by the browser form and the API.
// Pure functions only (no Node APIs): app/start/StartForm.tsx imports this file too.
//
// Etsy order number — ASSUMPTION (not confirmed with the Etsy API, which is not connected yet):
// Etsy shows it as "Order #1234567890" (the receipt id), digits only. We accept 8 to 12 digits
// after removing spaces, a leading "#" and the word "order", so "Order #12 3456 7890" -> "1234567890".
// Today's order numbers are 10 digits; the range leaves room on both sides. If Etsy changes the
// format, change ORDER_NUMBER_MIN/MAX here (tests in tests/claim.test.ts). Verification against
// Etsy is a separate, optional step (lib/claim/verify.ts, off by default).

import { isReservedSlug, isValidSlugFormat, slugify } from '../slug.ts';

export const ORDER_NUMBER_MIN = 8;
export const ORDER_NUMBER_MAX = 12;
export const EMAIL_MAX = 254;
export const NAME_MAX = 40;
/** Used when the names give no usable letters (e.g. only non-Latin script). */
export const FALLBACK_SLUG = 'our-wedding';

export type ClaimField = 'orderNumber' | 'email' | 'name1' | 'name2' | 'slug';

export const FIELD_MESSAGES = {
  orderMissing: 'Please enter your Etsy order number.',
  orderFormat: `Your Etsy order number has ${ORDER_NUMBER_MIN} to ${ORDER_NUMBER_MAX} digits, for example 1234567890.`,
  emailMissing: 'Please enter your email address.',
  emailFormat: 'Please enter a valid email address, like name@example.com.',
  nameMissing: 'Please enter a first name.',
  nameTooLong: `Please keep each name under ${NAME_MAX + 1} characters.`,
  slugMissing: 'Please choose a website address.',
  slugFormat: 'Use 3 to 48 lowercase letters, numbers and single hyphens.',
  slugReserved: 'This address is reserved. Please choose another one.',
  slugTaken: 'This address is already taken.',
} as const;

// Control characters, zero-width and bidi marks are removed from free text.
const INVISIBLE_RE = /[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁠-⁩﻿]/g;

/** "Order #12 3456-7890" -> "1234567890"; null when it is not 8-12 digits. */
export function normalizeOrderNumber(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const cleaned = input
    .replace(INVISIBLE_RE, '')
    .trim()
    .replace(/^order\s*(no\.?|nr\.?|number)?\s*:?\s*/i, '')
    .replace(/^#\s*/, '')
    .replace(/[\s .-]+/g, '');
  const re = new RegExp(`^[0-9]{${ORDER_NUMBER_MIN},${ORDER_NUMBER_MAX}}$`);
  return re.test(cleaned) ? cleaned : null;
}

export function orderNumberError(input: unknown): string | null {
  if (typeof input !== 'string' || !input.trim()) return FIELD_MESSAGES.orderMissing;
  return normalizeOrderNumber(input) ? null : FIELD_MESSAGES.orderFormat;
}

// Deliberately simple: one @, no spaces, a dot in the domain. The address is not mailed yet.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;

/** Trimmed address with a lower-case domain; null when it does not look like an email address. */
export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const v = input.replace(INVISIBLE_RE, '').trim();
  if (!v || v.length > EMAIL_MAX || !EMAIL_RE.test(v)) return null;
  const at = v.lastIndexOf('@');
  return `${v.slice(0, at)}@${v.slice(at + 1).toLowerCase()}`;
}

export function emailError(input: unknown): string | null {
  if (typeof input !== 'string' || !input.trim()) return FIELD_MESSAGES.emailMissing;
  return normalizeEmail(input) ? null : FIELD_MESSAGES.emailFormat;
}

/** Trimmed, single-spaced, invisible characters removed. */
export function cleanName(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(INVISIBLE_RE, '').replace(/\s+/g, ' ').trim();
}

export function nameError(input: unknown): string | null {
  const v = cleanName(input);
  if (!v || !/\p{L}/u.test(v)) return FIELD_MESSAGES.nameMissing;
  if (v.length > NAME_MAX) return FIELD_MESSAGES.nameTooLong;
  return null;
}

/**
 * Live clean-up while the buyer types an address: lower case, accents removed, spaces and other
 * characters become single hyphens. A trailing hyphen is kept so typing "avery-" works.
 */
export function sanitizeSlugTyping(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 48);
}

/** Final form of a typed address (trailing hyphen removed). */
export function normalizeSlugInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  return sanitizeSlugTyping(input).replace(/-+$/, '');
}

export type SlugProblem = 'missing' | 'format' | 'reserved';

export function slugProblem(slug: string): SlugProblem | null {
  if (!slug) return 'missing';
  if (!isValidSlugFormat(slug)) return 'format';
  if (isReservedSlug(slug)) return 'reserved';
  return null;
}

export function slugProblemMessage(problem: SlugProblem | 'taken'): string {
  switch (problem) {
    case 'missing':
      return FIELD_MESSAGES.slugMissing;
    case 'format':
      return FIELD_MESSAGES.slugFormat;
    case 'reserved':
      return FIELD_MESSAGES.slugReserved;
    case 'taken':
      return FIELD_MESSAGES.slugTaken;
  }
}

/**
 * Address suggested from the names: "Avery" + "Jordan" -> "avery-and-jordan".
 * Too short or no usable letters -> "<name>-wedding" / "our-wedding". Availability is not checked here.
 */
export function suggestSlugBase(names: readonly string[]): string {
  // Each name on its own, so a name without Latin letters is skipped instead of leaving "and".
  const parts = names.map((n) => slugify(cleanName(n))).filter(Boolean);
  let base = slugify(parts.join(' & '));
  if (base.length < 3) base = base ? `${base}-wedding` : FALLBACK_SLUG;
  return base;
}

/** "<base>-<suffix>" kept within 48 characters (the base is shortened, never the suffix). */
export function slugWithSuffix(base: string, suffix: string): string {
  const room = 48 - suffix.length - 1;
  const head = base.slice(0, room).replace(/-+$/, '');
  return `${head}-${suffix}`;
}

export interface ClaimFormValues {
  orderNumber: string;
  email: string;
  names: string[];
  slug: string;
}

/** Field errors for the form (browser and server use the same rules). `nameCount` = names the theme's demo has. */
export function claimFieldErrors(values: ClaimFormValues, nameCount: number): Partial<Record<ClaimField, string>> {
  const errors: Partial<Record<ClaimField, string>> = {};
  const order = orderNumberError(values.orderNumber);
  if (order) errors.orderNumber = order;
  const email = emailError(values.email);
  if (email) errors.email = email;
  for (let i = 0; i < Math.min(2, Math.max(1, nameCount)); i++) {
    const e = nameError(values.names[i]);
    if (e) errors[i === 0 ? 'name1' : 'name2'] = e;
  }
  const slug = normalizeSlugInput(values.slug);
  if (values.slug.trim()) {
    const p = slugProblem(slug);
    if (p) errors.slug = slugProblemMessage(p);
  }
  return errors;
}
