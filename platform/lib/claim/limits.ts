// Rate limits for /start (G045) and photo uploads (G060-fix). Same RateLimiter interface as RSVP
// (lib/rsvp/rate-limit.ts).
//
// G060-fix: on Vercel every function instance has its own memory, so an in-process limiter resets whenever
// another instance answers. When the data adapter offers a shared counter (blob: DataAdapter.hitCounter) the
// limits are counted there; the local adapter (one process) keeps the in-memory limiter.

import { getDataAdapter } from '../data/index.ts';
import type { DataAdapter } from '../data/types.ts';
import { MemoryRateLimiter, type RateLimitRule, type RateLimiter, type RateLimitResult } from '../rsvp/rate-limit.ts';

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
 * Photo uploads per site (G060-fix): a site holds its photos and their size variants; replaced photos stay in
 * storage (no cleanup yet), so each site gets a daily upload rate and a total number of stored files.
 */
export const UPLOAD_LIMITS = {
  /** Uploads (each with its size variants) per site per day. */
  perSitePerDay: { limit: 60, windowMs: DAY } satisfies RateLimitRule,
  /** Stored photo files per site in total (a photo + up to 2 size variants = 3 files: about 150 uploads). */
  maxFilesPerSite: 450,
};

/** A RateLimiter on the data adapter's shared counter (every server instance counts the same window). */
export class AdapterRateLimiter implements RateLimiter {
  private readonly adapter: Pick<DataAdapter, 'hitCounter' | 'readCounter'>;
  private readonly now: () => number;

  constructor(adapter: Pick<DataAdapter, 'hitCounter' | 'readCounter'>, now: () => number = Date.now) {
    this.adapter = adapter;
    this.now = now;
  }

  async hit(key: string, rule: RateLimitRule): Promise<RateLimitResult> {
    const { count, resetAt } = await this.adapter.hitCounter!(key, rule.windowMs);
    return { allowed: count <= rule.limit, remaining: Math.max(0, rule.limit - count), retryAfterMs: Math.max(0, resetAt - this.now()) };
  }

  /** Reads the window without a hit (G076); an adapter without readCounter answers "allowed" (hit() still counts). */
  async peek(key: string, rule: RateLimitRule): Promise<RateLimitResult> {
    const live = this.adapter.readCounter ? await this.adapter.readCounter(key) : null;
    const count = live?.count ?? 0;
    return { allowed: count < rule.limit, remaining: Math.max(0, rule.limit - count), retryAfterMs: live ? Math.max(0, live.resetAt - this.now()) : 0 };
  }
}

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
