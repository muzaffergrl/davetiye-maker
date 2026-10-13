// Rate limiting for RSVP submissions, behind an interface.
//
// MemoryRateLimiter (fixed window, one process) is what the local adapter uses. A deployment
// with several server instances (Vercel functions) needs a shared store; the Supabase task (G043)
// can implement RateLimiter on a table or RPC (e.g. upsert key + window start, increment, compare)
// and register it with setRsvpRateLimiter(). Callers only use hit().

export interface RateLimitRule {
  /** Allowed hits per window. */
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Hits left in the current window after this one (0 when blocked). */
  remaining: number;
  /** Milliseconds until the window resets (useful for Retry-After). */
  retryAfterMs: number;
}

export interface RateLimiter {
  /** Counts one hit for `key` under `rule` and says whether it is within the limit. */
  hit(key: string, rule: RateLimitRule): Promise<RateLimitResult>;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/** In-process fixed-window limiter. Expired buckets are swept when the map grows. */
export class MemoryRateLimiter implements RateLimiter {
  private buckets = new Map<string, Bucket>();
  private readonly now: () => number;
  private readonly sweepAt: number;

  constructor(opts: { now?: () => number; sweepAt?: number } = {}) {
    this.now = opts.now ?? Date.now;
    this.sweepAt = opts.sweepAt ?? 10_000;
  }

  async hit(key: string, rule: RateLimitRule): Promise<RateLimitResult> {
    const now = this.now();
    if (this.buckets.size >= this.sweepAt) this.sweep(now);
    let bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + rule.windowMs };
      this.buckets.set(key, bucket);
    }
    bucket.count += 1;
    const allowed = bucket.count <= rule.limit;
    return { allowed, remaining: Math.max(0, rule.limit - bucket.count), retryAfterMs: Math.max(0, bucket.resetAt - now) };
  }

  /** Number of live buckets (tests). */
  get size(): number {
    return this.buckets.size;
  }

  private sweep(now: number): void {
    for (const [k, b] of this.buckets) if (b.resetAt <= now) this.buckets.delete(k);
  }
}

let shared: RateLimiter | null = null;

/** The limiter the API routes use (one MemoryRateLimiter per server process unless replaced). */
export function getRsvpRateLimiter(): RateLimiter {
  shared ??= new MemoryRateLimiter();
  return shared;
}

/** Replaces the shared limiter (persistent store in production, a fresh one in tests). */
export function setRsvpRateLimiter(limiter: RateLimiter | null): void {
  shared = limiter;
}

/**
 * Rate-limit key for a client address. IPv6 addresses are cut to their /64 network
 * (one household or phone usually owns a whole /64); IPv4 is kept as is.
 */
export function ipBucket(ip: string): string {
  const v = ip.trim().toLowerCase();
  if (!v.includes(':')) return v || 'unknown';
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(v);
  if (mapped) return mapped[1];
  const groups = expandIpv6(v.replace(/%.*$/, ''));
  return groups ? `${groups.slice(0, 4).join(':')}::/64` : v;
}

function expandIpv6(v: string): string[] | null {
  const halves = v.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  if (fill < 0) return null;
  const all = [...head, ...Array<string>(fill).fill('0'), ...tail];
  if (all.length !== 8 || !all.every((g) => /^[0-9a-f]{1,4}$/.test(g))) return null;
  return all.map((g) => g.replace(/^0+(?=.)/, ''));
}
