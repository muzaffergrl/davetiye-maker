// EtsyOrderVerifier (G147, CLAIM_ORDER_VERIFICATION=etsy): the order number typed on /start is looked up as a receipt
// of OUR shop with the shop's own OAuth connection (lib/etsy/shop.ts).
//
// Rules (evaluateReceipt):
//   receipt not found in our shop (404 / 400 / 403, or another seller) -> rejected not_found
//   status "canceled" or "fully refunded"                              -> rejected not_paid
//   not paid yet (is_paid false: "open", "payment processing")         -> pending, unpaid (the site is made; a later
//                                                                         re-check verifies it once Etsy reports it paid)
//   Etsy gives a non-empty buyer_email and it differs (case-insensitive) -> rejected email_mismatch
//     (buyer_email is often null: Etsy grants it case by case; then the email is not compared)
//   a purchased listing is mapped in listings.json to another design   -> rejected theme_mismatch (unmapped: no theme check)
//   otherwise                                                           -> verified ("partially refunded" still counts as paid)
// G152 — multi-item orders: "verified" and "pending" carry `units`, the websites the receipt pays for: the quantities of
//   its lines that are designs (mapped to a theme in listings.json, or not mapped at all); add-on service listings
//   (listings.json "services": setup, custom design, extra revision) never count. lib/claim/claim.ts then allows that many
//   websites for the order number (at most MAX_ORDER_SITES).
// G951 — while listings.json maps nothing, a line is a service by its TITLE too (lib/etsy/services.ts: the service
//   listings' titles): a receipt of services only has 0 units (it pays for no ready design: lib/claim/verify.ts
//   orderCoverage "no design"); custom-design lines are counted apart (`custom`): each includes the website of its own
//   private design (G151). A receipt without readable lines still counts as one website.
// Fallbacks (never a 500 on /start):
//   app settings missing, shop not connected, Etsy no longer accepts the connection, or Etsy refuses our app (401/403 on
//   the token itself) -> pending, exactly like manual mode; the admin card shows why.
//   Etsy timeout / network error / 429 rate limit / 5xx                -> unavailable (the buyer is asked to retry; nothing stored)
// G174: on /start (input.cached) a receipt read is kept as ReceiptFacts for a few minutes (order-cache.ts), so repeated
//   tries for one order number do not spend the shop's Etsy quota; the fallbacks and errors above are never cached.

import { createHash } from 'node:crypto';
import LISTINGS from './listings.json' with { type: 'json' };
import { getDataAdapter } from '../data/index.ts';
import type { DataAdapter } from '../data/types.ts';
import { MAX_ORDER_SITES, type OrderCheck, type OrderCheckInput, type OrderVerifier } from '../claim/verify.ts';
import { etsySetup } from './config.ts';
import { canReadReceipts, EtsyError, getShopReceipt, type EtsyReceipt } from './client.ts';
import { orderCacheKey, readCachedFacts, rememberFacts } from './order-cache.ts';
import { serviceKindOfTitle, type ServiceKind } from './services.ts';
import { clearEtsyError, connectedShop, EtsyNotConnectedError, noteEtsyError, shopAccessToken } from './shop.ts';

/** listing_id -> theme id, from listings.json (bad entries are ignored). */
export function listingThemes(raw: unknown = LISTINGS): Map<string, string> {
  const out = new Map<string, string>();
  const list = raw && typeof raw === 'object' ? (raw as { listings?: unknown }).listings : null;
  if (!list || typeof list !== 'object') return out;
  for (const [id, theme] of Object.entries(list as Record<string, unknown>)) {
    if (/^\d{1,20}$/.test(id) && typeof theme === 'string' && /^[a-z0-9-]{1,64}$/.test(theme)) out.set(id, theme);
  }
  return out;
}

export type { ServiceKind } from './services.ts';
const SERVICE_KINDS: readonly string[] = ['setup', 'custom_design', 'extra_revision'];

/** listing_id -> service kind, from listings.json "services" (bad entries are ignored). */
export function listingServices(raw: unknown = LISTINGS): Map<string, ServiceKind> {
  const out = new Map<string, ServiceKind>();
  const list = raw && typeof raw === 'object' ? (raw as { services?: unknown }).services : null;
  if (!list || typeof list !== 'object') return out;
  for (const [id, kind] of Object.entries(list as Record<string, unknown>)) {
    if (/^\d{1,20}$/.test(id) && typeof kind === 'string' && SERVICE_KINDS.includes(kind)) out.set(id, kind as ServiceKind);
  }
  return out;
}

const listingIdOf = (t: unknown): string => {
  const id = t && typeof t === 'object' ? (t as { listing_id?: unknown }).listing_id : null;
  return typeof id === 'number' || typeof id === 'string' ? String(id) : '';
};

/** The service an order line is: its listing id in listings.json "services", else its title (G951), else null (a design). */
export function lineService(t: unknown, services: Map<string, ServiceKind> = listingServices()): ServiceKind | null {
  if (!t || typeof t !== 'object') return null;
  return services.get(listingIdOf(t)) ?? serviceKindOfTitle((t as { title?: unknown }).title);
}

const quantityOf = (t: { quantity?: unknown }) => Math.min(typeof t.quantity === 'number' && Number.isInteger(t.quantity) && t.quantity > 0 ? t.quantity : 1, MAX_ORDER_SITES);

/**
 * G152: the websites of ready designs a receipt pays for — the summed quantity of its design lines (a service line never
 * counts, by listing id or, G951, by title), at most MAX_ORDER_SITES. 0 when it has lines and all are services; 1 when
 * it has no readable line (nothing is known: one website, as before).
 */
export function designUnits(receipt: Pick<EtsyReceipt, 'transactions'> | null, services: Map<string, ServiceKind> = listingServices()): number {
  const lines = (Array.isArray(receipt?.transactions) ? receipt.transactions : []).filter((t) => t && typeof t === 'object');
  if (!lines.length) return 1;
  let units = 0;
  for (const t of lines) if (!lineService(t, services)) units += quantityOf(t);
  return Math.min(units, MAX_ORDER_SITES);
}

/** G951: the custom-design lines of a receipt (each includes the website of its private design, G151). */
export function customUnits(receipt: Pick<EtsyReceipt, 'transactions'> | null, services: Map<string, ServiceKind> = listingServices()): number {
  let n = 0;
  for (const t of Array.isArray(receipt?.transactions) ? receipt.transactions : []) if (lineService(t, services) === 'custom_design') n += quantityOf(t);
  return Math.min(n, MAX_ORDER_SITES);
}

/**
 * G174: what one receipt says, without the receipt itself (kept in the short-lived /start cache, order-cache.ts): found
 * in our shop, cancelled / fully refunded, the buyer email as a hash (null when Etsy gives none), the mapped designs, the
 * design units, paid.
 */
export type ReceiptFacts =
  | { found: false }
  /** `custom` (G951): custom-design lines; absent = none. */
  | { found: true; closed: boolean; buyer: string | null; themes: string[]; units: number; custom?: number; paid: boolean };

/** One-way form of an email address for comparing (the cache never holds the address). */
export function emailHash(email: string): string {
  return createHash('sha256').update(`email:${email.trim().toLowerCase()}`).digest('hex');
}

/** The facts of one receipt for this order number (pure). */
export function receiptFacts(
  receipt: EtsyReceipt | null,
  orderNumber: string,
  opts: { listings?: Map<string, string>; services?: Map<string, ServiceKind>; sellerUserId?: number | null } = {},
): ReceiptFacts {
  if (!receipt || typeof receipt !== 'object') return { found: false };
  if (typeof receipt.receipt_id === 'number' && String(receipt.receipt_id) !== orderNumber) return { found: false };
  if (opts.sellerUserId && typeof receipt.seller_user_id === 'number' && receipt.seller_user_id !== opts.sellerUserId) return { found: false };
  const status = (receipt.status ?? '').trim().toLowerCase();
  const buyer = typeof receipt.buyer_email === 'string' && receipt.buyer_email.trim() ? emailHash(receipt.buyer_email) : null;
  const listings = opts.listings ?? listingThemes();
  const themes = new Set<string>();
  for (const t of Array.isArray(receipt.transactions) ? receipt.transactions : []) {
    const id = listingIdOf(t);
    const theme = id ? listings.get(id) : undefined;
    if (theme) themes.add(theme);
  }
  const services = opts.services ?? listingServices();
  const custom = customUnits(receipt, services);
  return {
    found: true,
    closed: status === 'canceled' || status === 'cancelled' || status === 'fully refunded',
    buyer,
    themes: [...themes].sort(),
    units: designUnits(receipt, services),
    ...(custom ? { custom } : {}),
    paid: receipt.is_paid === true,
  };
}

/** The decision for these facts and this buyer's input (pure). */
export function decideFacts(facts: ReceiptFacts, input: OrderCheckInput): OrderCheck {
  if (!facts.found) return { result: 'rejected', reason: 'not_found' };
  if (facts.closed) return { result: 'rejected', reason: 'not_paid' };
  if (facts.buyer && facts.buyer !== emailHash(input.email)) return { result: 'rejected', reason: 'email_mismatch' };
  if (facts.themes.length && !facts.themes.includes(input.theme)) return { result: 'rejected', reason: 'theme_mismatch' };
  const custom = facts.custom ? { custom: facts.custom } : {};
  if (!facts.paid) return { result: 'pending', units: facts.units, ...custom, unpaid: true };
  return { result: 'verified', units: facts.units, ...custom };
}

/** The decision for one receipt (pure; exported for the tests). */
export function evaluateReceipt(
  receipt: EtsyReceipt | null,
  input: OrderCheckInput,
  opts: { listings?: Map<string, string>; services?: Map<string, ServiceKind>; sellerUserId?: number | null } = {},
): OrderCheck {
  return decideFacts(receiptFacts(receipt, input.orderNumber, opts), input);
}

export class EtsyOrderVerifier implements OrderVerifier {
  readonly kind = 'etsy';
  readonly #adapter: () => DataAdapter;
  readonly #now: () => number;

  constructor(opts: { adapter?: DataAdapter; now?: () => number } = {}) {
    const given = opts.adapter;
    this.#adapter = given ? () => given : () => getDataAdapter();
    this.#now = opts.now ?? Date.now;
  }

  async check(input: OrderCheckInput): Promise<OrderCheck> {
    const setup = etsySetup();
    if (setup.state !== 'ready') return { result: 'pending' };
    const adapter = this.#adapter();
    const shop = await connectedShop(adapter);
    if (!shop) return { result: 'pending' };
    if (!/^\d{1,20}$/.test(input.orderNumber)) return { result: 'rejected', reason: 'not_found' };
    // G174: /start answers from the last receipt read of this order while it is fresh (order-cache.ts); a receipt read
    // or "not ours" is remembered, Etsy errors and fallbacks are not.
    const cacheKey = input.cached ? orderCacheKey(shop.shopId, input.orderNumber) : null;
    if (cacheKey) {
      const hit = await readCachedFacts(adapter, cacheKey, this.#now());
      if (hit) return decideFacts(hit, input);
    }
    const decide = async (facts: ReceiptFacts): Promise<OrderCheck> => {
      if (cacheKey) await rememberFacts(adapter, cacheKey, facts, this.#now());
      return decideFacts(facts, input);
    };
    const cfg = setup.config;
    const read = async (force: boolean) => getShopReceipt(cfg, await shopAccessToken(adapter, cfg, { force }), shop.shopId, input.orderNumber);
    let receipt: EtsyReceipt;
    try {
      try {
        receipt = await read(false);
      } catch (e) {
        // A stored access token Etsy no longer takes (revoked early): one fresh token, one more try.
        if (!(e instanceof EtsyError) || e.status !== 401) throw e;
        receipt = await read(true);
      }
    } catch (e) {
      if (e instanceof EtsyNotConnectedError) return { result: 'pending' };
      if (e instanceof EtsyError) {
        if (e.status === 404 || e.status === 400) return decide({ found: false });
        if (e.status === 401 || e.status === 403) {
          // 403 on one receipt: "another shop's receipt" or "this app may not read receipts" (not approved / scope). One
          // list read tells them apart: it works -> the number is not ours; it is refused too -> nothing is decided against
          // the buyer: the site waits for the shop (like manual mode) and the admin card shows the code.
          if (e.status === 403) {
            try {
              if (await canReadReceipts(cfg, await shopAccessToken(adapter, cfg), shop.shopId)) return decide({ found: false });
            } catch (probe) {
              if (!(probe instanceof EtsyNotConnectedError)) {
                console.error(`[etsy] order check unavailable: ${probe instanceof EtsyError ? probe.code : 'error'}`);
                return { result: 'unavailable' };
              }
            }
          }
          await noteEtsyError(adapter, `http_${e.status}`).catch(() => undefined);
          console.error(`[etsy] order check refused: http_${e.status}`);
          return { result: 'pending' };
        }
        console.error(`[etsy] order check unavailable: ${e.code}`);
        return { result: 'unavailable' };
      }
      console.error(`[etsy] order check failed: ${e instanceof Error ? e.name : 'error'}`);
      return { result: 'unavailable' };
    }
    await clearEtsyError(adapter).catch(() => undefined);
    return decide(receiptFacts(receipt, input.orderNumber, { sellerUserId: shop.userId }));
  }
}
