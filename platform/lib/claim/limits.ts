// Rate limits for /start (G045). Same RateLimiter interface as RSVP (lib/rsvp/rate-limit.ts):
// in-process memory today; G043 should register a shared store (setClaimRateLimiter) because
// several server instances do not share memory.

import { MemoryRateLimiter, type RateLimitRule, type RateLimiter } from '../rsvp/rate-limit.ts';

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

export const DEFAULT_CLAIM_LIMITS: ClaimLimits = {
  attemptsPerIp: { limit: 10, windowMs: 15 * MINUTE },
  sitesPerIp: { limit: 5, windowMs: 24 * 60 * MINUTE },
  sitesGlobal: { limit: 300, windowMs: 60 * MINUTE },
  slugChecksPerIp: { limit: 120, windowMs: 15 * MINUTE },
};

let shared: RateLimiter | null = null;

export function getClaimRateLimiter(): RateLimiter {
  shared ??= new MemoryRateLimiter();
  return shared;
}

/** Replaces the shared limiter (persistent store in production, a fresh one in tests). */
export function setClaimRateLimiter(limiter: RateLimiter | null): void {
  shared = limiter;
}
