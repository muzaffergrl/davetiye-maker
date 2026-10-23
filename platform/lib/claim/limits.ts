// Rate limits for /start (G045) and photo uploads (G060-fix). Same RateLimiter interface as RSVP
// (lib/rsvp/rate-limit.ts).
//
// G060-fix: on Vercel every function instance has its own memory, so an in-process limiter resets whenever
// another instance answers. When the data adapter offers a shared counter (blob: DataAdapter.hitCounter) the
// limits are counted there; the local adapter (one process) keeps the in-memory limiter.

import { createHash } from 'node:crypto';
import { getDataAdapter } from '../data/index.ts';
import { AdapterRateLimiter, MemoryRateLimiter, type RateLimitResult, type RateLimitRule, type RateLimiter } from '../rsvp/rate-limit.ts';

export interface ClaimLimits {
  /** Every POST /api/start from one address (wrong order numbers count too: slows down guessing). */
  attemptsPerIp: RateLimitRule;
  /** Websites created from one address. */
  sitesPerIp: RateLimitRule;
  /** Websites created in total (abuse cap while orders are not verified with Etsy). */
  sitesGlobal: RateLimitRule;
  /** GET /api/start/slug availability checks from one address. */
  slugChecksPerIp: RateLimitRule;
}

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export const DEFAULT_CLAIM_LIMITS: ClaimLimits = {
  attemptsPerIp: { limit: 10, windowMs: 15 * MINUTE },
  sitesPerIp: { limit: 5, windowMs: DAY },
  sitesGlobal: { limit: 300, windowMs: 60 * MINUTE },
  slugChecksPerIp: { limit: 120, windowMs: 15 * MINUTE },
};

/**
 * G146: "continue with your Etsy order number + email" (/my, POST /api/my/continue) and an order that already has a
 * website on /start. Per address every attempt counts, right or wrong; per order number only the attempts that did not
 * match (orderAttempts). The per-order window is shared by both ways in, so guessing the email of one order number stays
 * slow however many addresses try.
 */
export interface ContinueLimits {
  /** POST /api/my/continue from one address. */
  perIp: RateLimitRule;
  /** Sign-in attempts for one order number that did not match (/my and /start together; orderAttempts). */
  perOrder: RateLimitRule;
  /** POST /api/my/signin-link from one address. */
  signInLinksPerIp: RateLimitRule;
  /** Sign-in emails for one order number. */
  signInLinksPerOrder: RateLimitRule;
}

export const DEFAULT_CONTINUE_LIMITS: ContinueLimits = {
  perIp: { limit: 10, windowMs: 15 * MINUTE },
  perOrder: { limit: 6, windowMs: 60 * MINUTE },
  signInLinksPerIp: { limit: 5, windowMs: 60 * MINUTE },
  signInLinksPerOrder: { limit: 3, windowMs: 60 * MINUTE },
};

/**
 * The attempts of one order number (/my and /start together, `rule` = ContinueLimits.perOrder). Only attempts that do
 * NOT match count — another email than the order's websites were started with, a website that is not this email's —
 * so guessing the email of an order number stays slow, while a buyer with several designs in one order who opens their
 * websites again and again with the right email is never locked out (review of G951: three designs, then /my -> 429).
 * `check()` before answering (a full window refuses even the right email), `miss()` on an answer that did not match.
 * A limiter without peek() counts every attempt in check(), as before.
 */
export function orderAttempts(limiter: RateLimiter, key: string, rule: RateLimitRule): { check(): Promise<RateLimitResult>; miss(): Promise<void> } {
  return {
    check: () => (limiter.peek ? limiter.peek(key, rule) : limiter.hit(key, rule)),
    miss: async () => {
      if (limiter.peek) await limiter.hit(key, rule);
    },
  };
}

/** Limiter key of one order number (a hash: the full number is never kept in a counter name). */
export function orderLimitKey(prefix: string, orderNumber: string): string {
  return `${prefix}:${createHash('sha256').update(`order:${orderNumber}`).digest('hex').slice(0, 32)}`;
}

/**
 * Photo uploads per site (G060-fix): a site holds its photos and their size variants; replaced photos stay in
 * storage (no cleanup yet), so each site gets a daily upload rate and a total number of stored files.
 */
export const UPLOAD_LIMITS = {
  /** Uploads (each with its size variants) per site per day. */
  perSitePerDay: { limit: 60, windowMs: DAY } satisfies RateLimitRule,
  /** Stored photo files per site in total (a photo + up to 2 size variants = 3 files: about 150 uploads). */
  maxFilesPerSite: 450,
};

export { AdapterRateLimiter } from '../rsvp/rate-limit.ts';

let shared: RateLimiter | null = null;

/** The limiter for /start and uploads: the adapter's shared counter when it has one, else in-process memory. */
export function getClaimRateLimiter(): RateLimiter {
  if (!shared) {
    const adapter = getDataAdapter();
    shared = adapter.hitCounter ? new AdapterRateLimiter(adapter) : new MemoryRateLimiter();
  }
  return shared;
}

/** Replaces the shared limiter (a fresh one in tests). null restores the default choice. */
export function setClaimRateLimiter(limiter: RateLimiter | null): void {
  shared = limiter;
}
