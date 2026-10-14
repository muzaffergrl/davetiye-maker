// Rate limiting for RSVP submissions, behind an interface.
//
// MemoryRateLimiter is the local fallback. RSVP uses the data adapter's shared counters when
// available, so separate Vercel instances and cold starts enforce the same windows.

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
  /**
   * The same answer for the hits already counted, without counting one (G076: a guest password form refuses even the
   * right password while its wrong-attempt window is full). `allowed` = another hit would still be within the limit.
   */
  peek?(key: string, rule: RateLimitRule): Promise<RateLimitResult>;
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

  async peek(key: string, rule: RateLimitRule): Promise<RateLimitResult> {
    const now = this.now();
    const bucket = this.buckets.get(key);
    const count = bucket && bucket.resetAt > now ? bucket.count : 0;
    return { allowed: count < rule.limit, remaining: Math.max(0, rule.limit - count), retryAfterMs: bucket && bucket.resetAt > now ? bucket.resetAt - now : 0 };
  }

  /** Number of live buckets (tests). */
  get size(): number {
    return this.buckets.size;
  }

  private sweep(now: number): void {
    for (const [k, b] of this.buckets) if (b.resetAt <= now) this.buckets.delete(k);
  }
}

/** Shared counters supplied by a data adapter (Blob in production). No storage dependency in this module. */
export interface CounterStore {
  hitCounter?: (key: string, windowMs: number) => Promise<{ count: number; resetAt: number }>;
  readCounter?: (key: string) => Promise<{ count: number; resetAt: number } | null>;
}

/** A RateLimiter on the data adapter's shared counter (every server instance counts the same window). */
export class AdapterRateLimiter implements RateLimiter {
  private readonly adapter: CounterStore;
  private readonly now: () => number;

  constructor(adapter: CounterStore, now: () => number = Date.now) {
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

let override: RateLimiter | null = null;
let memory: RateLimiter | null = null;
let adapters = new WeakMap<CounterStore, RateLimiter>();

/** Use shared storage for this adapter; explicit test overrides take precedence. */
export function getRsvpRateLimiter(adapter?: CounterStore): RateLimiter {
  if (override) return override;
  if (adapter?.hitCounter) {
    let limiter = adapters.get(adapter);
    if (!limiter) {
      limiter = new AdapterRateLimiter(adapter);
      adapters.set(adapter, limiter);
    }
    return limiter;
  }
  memory ??= new MemoryRateLimiter();
  return memory;
}

/** Replace the limiter explicitly; null resets both local and adapter caches. */
export function setRsvpRateLimiter(limiter: RateLimiter | null): void {
  override = limiter;
  memory = null;
  adapters = new WeakMap();
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
