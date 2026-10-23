// Short-lived cache of Etsy order answers for /start (G174). Every /start POST in etsy mode used to read the receipt
// from Etsy, so repeated tries (a buyer retrying, or many addresses guessing) spent the shop's daily Etsy quota.
//
// Stored as ONE site document of the reserved shop id (SHOP_DOC_ID, like the Etsy connection) named "etsy-order-cache":
//   {v: 1, entries: {"<sha256(shop + order) 32 hex>": {exp, facts}}}
// `facts` (verify.ts ReceiptFacts) is all the decision needs: found, cancelled/refunded, paid, the mapped designs, the
// design units and the buyer email as a hash. Never the receipt, a token, an address or the order number in clear.
// TTL: a paid receipt 10 minutes, anything else (not found, unpaid, cancelled) 2 minutes; Etsy errors, "not connected"
// and "app refused" are not cached. Expired entries are dropped on every write and the document holds at most
// MAX_ENTRIES (the oldest go first), so it stays small. Cache trouble never fails a check: it is simply a miss.
// Only /start asks for it (OrderCheckInput.cached); re-checks (admin, panel poll, Publish) always ask Etsy.

import { createHash } from 'node:crypto';
import type { DataAdapter } from '../data/types.ts';
import { SHOP_DOC_ID } from './shop.ts';
import type { ReceiptFacts } from './verify.ts';

export const ORDER_CACHE_DOC = 'etsy-order-cache';
const MINUTE = 60_000;
export const ORDER_CACHE_TTL = Object.freeze({ paidMs: 10 * MINUTE, otherMs: 2 * MINUTE });
const MAX_ENTRIES = 500;

interface CacheEntry {
  exp: number;
  facts: ReceiptFacts;
}
interface CacheDoc {
  v: 1;
  entries: Record<string, CacheEntry>;
}

/** Cache key of one order number of one shop (a hash: a reconnected other shop never sees the old answers). */
export function orderCacheKey(shopId: number, orderNumber: string): string {
  return createHash('sha256').update(`etsy-order:${shopId}:${orderNumber}`).digest('hex').slice(0, 32);
}

function validFacts(f: unknown): f is ReceiptFacts {
  if (!f || typeof f !== 'object') return false;
  const x = f as Record<string, unknown>;
  if (x.found === false) return true;
  return (
    x.found === true &&
    typeof x.closed === 'boolean' &&
    typeof x.paid === 'boolean' &&
    (x.buyer === null || (typeof x.buyer === 'string' && /^[0-9a-f]{64}$/.test(x.buyer))) &&
    Array.isArray(x.themes) &&
    x.themes.every((t) => typeof t === 'string') &&
    typeof x.units === 'number' &&
    Number.isInteger(x.units) &&
    x.units >= 0 &&
    (x.custom === undefined || (typeof x.custom === 'number' && Number.isInteger(x.custom) && x.custom >= 0))
  );
}

function entriesOf(doc: unknown): Record<string, CacheEntry> {
  const e = doc && typeof doc === 'object' ? (doc as { entries?: unknown }).entries : null;
  return e && typeof e === 'object' ? (e as Record<string, CacheEntry>) : {};
}

/** The cached facts of this key while they are fresh, else null (also on any storage error). */
export async function readCachedFacts(adapter: DataAdapter, key: string, now: number): Promise<ReceiptFacts | null> {
  try {
    const entry = entriesOf(await adapter.readSiteDoc(SHOP_DOC_ID, ORDER_CACHE_DOC))[key];
    return entry && typeof entry.exp === 'number' && entry.exp > now && validFacts(entry.facts) ? entry.facts : null;
  } catch {
    return null;
  }
}

/** Keeps the facts for their TTL (expired entries pruned, size capped). Errors are swallowed: the cache is optional. */
export async function rememberFacts(adapter: DataAdapter, key: string, facts: ReceiptFacts, now: number): Promise<void> {
  const ttl = facts.found && facts.paid && !facts.closed ? ORDER_CACHE_TTL.paidMs : ORDER_CACHE_TTL.otherMs;
  try {
    await adapter.updateSiteDoc<CacheDoc>(SHOP_DOC_ID, ORDER_CACHE_DOC, (cur) => {
      const live = Object.entries(entriesOf(cur)).filter(([k, e]) => k !== key && e && typeof e.exp === 'number' && e.exp > now);
      live.push([key, { exp: now + ttl, facts }]);
      live.sort((a, b) => a[1].exp - b[1].exp);
      return { v: 1, entries: Object.fromEntries(live.slice(-MAX_ENTRIES)) };
    });
  } catch {
    // a miss next time, nothing worse
  }
}
