// EtsyOrderVerifier (G147, CLAIM_ORDER_VERIFICATION=etsy): the order number typed on /start is looked up as a receipt
// of OUR shop with the shop's own OAuth connection (lib/etsy/shop.ts).
//
// Rules (evaluateReceipt):
//   receipt not found in our shop (404 / 400 / 403, or another seller) -> rejected not_found
//   status "canceled" or "fully refunded"                              -> rejected not_paid
//   not paid yet (is_paid false: "open", "payment processing")         -> pending (the site is made; a later re-check
//                                                                         verifies it once Etsy reports it paid)
//   Etsy gives a non-empty buyer_email and it differs (case-insensitive) -> rejected email_mismatch
//     (buyer_email is often null: Etsy grants it case by case; then the email is not compared)
//   a purchased listing is mapped in listings.json to another design   -> rejected theme_mismatch (unmapped: no theme check)
//   otherwise                                                           -> verified ("partially refunded" still counts as paid)
// G152 — multi-item orders: "verified" and "pending" carry `units`, the websites the receipt pays for: the quantities of
//   its lines that are designs (mapped to a theme in listings.json, or not mapped at all); add-on service listings
//   (listings.json "services": setup, custom design, extra revision) never count. lib/claim/claim.ts then allows that many
//   websites for the order number (at least 1, at most MAX_ORDER_SITES).
// Fallbacks (never a 500 on /start):
//   app settings missing, shop not connected, Etsy no longer accepts the connection, or Etsy refuses our app (401/403 on
//   the token itself) -> pending, exactly like manual mode; the admin card shows why.
//   Etsy timeout / network error / 429 rate limit / 5xx                -> unavailable (the buyer is asked to retry; nothing stored)

import LISTINGS from './listings.json' with { type: 'json' };
import { getDataAdapter } from '../data/index.ts';
import type { DataAdapter } from '../data/types.ts';
import { MAX_ORDER_SITES, type OrderCheck, type OrderCheckInput, type OrderVerifier } from '../claim/verify.ts';
import { etsySetup } from './config.ts';
import { canReadReceipts, EtsyError, getShopReceipt, type EtsyReceipt } from './client.ts';
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

export type ServiceKind = 'setup' | 'custom_design' | 'extra_revision';
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

/**
 * G152: the websites a receipt pays for — the summed quantity of its design lines (a service listing never counts). At
 * least 1 (a receipt without readable lines is still one design), at most MAX_ORDER_SITES.
 */
export function designUnits(receipt: Pick<EtsyReceipt, 'transactions'> | null, services: Map<string, ServiceKind> = listingServices()): number {
  let units = 0;
  for (const t of Array.isArray(receipt?.transactions) ? receipt.transactions : []) {
    if (!t || typeof t !== 'object') continue;
    if (services.has(listingIdOf(t))) continue;
    const q = typeof t.quantity === 'number' && Number.isInteger(t.quantity) && t.quantity > 0 ? t.quantity : 1;
    units += Math.min(q, MAX_ORDER_SITES);
  }
  return Math.max(1, Math.min(units, MAX_ORDER_SITES));
}

/** The decision for one receipt (pure; exported for the tests). */
export function evaluateReceipt(
  receipt: EtsyReceipt | null,
  input: OrderCheckInput,
  opts: { listings?: Map<string, string>; services?: Map<string, ServiceKind>; sellerUserId?: number | null } = {},
): OrderCheck {
  if (!receipt || typeof receipt !== 'object') return { result: 'rejected', reason: 'not_found' };
  if (typeof receipt.receipt_id === 'number' && String(receipt.receipt_id) !== input.orderNumber) return { result: 'rejected', reason: 'not_found' };
  if (opts.sellerUserId && typeof receipt.seller_user_id === 'number' && receipt.seller_user_id !== opts.sellerUserId) {
    return { result: 'rejected', reason: 'not_found' };
  }
  const status = (receipt.status ?? '').trim().toLowerCase();
  if (status === 'canceled' || status === 'cancelled' || status === 'fully refunded') return { result: 'rejected', reason: 'not_paid' };
  const buyer = typeof receipt.buyer_email === 'string' ? receipt.buyer_email.trim().toLowerCase() : '';
  if (buyer && buyer !== input.email.trim().toLowerCase()) return { result: 'rejected', reason: 'email_mismatch' };
  const listings = opts.listings ?? listingThemes();
  const themes = new Set<string>();
  for (const t of Array.isArray(receipt.transactions) ? receipt.transactions : []) {
    const id = listingIdOf(t);
    const theme = id ? listings.get(id) : undefined;
    if (theme) themes.add(theme);
  }
  if (themes.size && !themes.has(input.theme)) return { result: 'rejected', reason: 'theme_mismatch' };
  const units = designUnits(receipt, opts.services ?? listingServices());
  if (receipt.is_paid !== true) return { result: 'pending', units };
  return { result: 'verified', units };
}

export class EtsyOrderVerifier implements OrderVerifier {
  readonly kind = 'etsy';
  readonly #adapter: () => DataAdapter;

  constructor(opts: { adapter?: DataAdapter } = {}) {
    const given = opts.adapter;
    this.#adapter = given ? () => given : () => getDataAdapter();
  }

  async check(input: OrderCheckInput): Promise<OrderCheck> {
    const setup = etsySetup();
    if (setup.state !== 'ready') return { result: 'pending' };
    const adapter = this.#adapter();
    const shop = await connectedShop(adapter);
    if (!shop) return { result: 'pending' };
    if (!/^\d{1,20}$/.test(input.orderNumber)) return { result: 'rejected', reason: 'not_found' };
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
        if (e.status === 404 || e.status === 400) return { result: 'rejected', reason: 'not_found' };
        if (e.status === 401 || e.status === 403) {
          // 403 on one receipt: "another shop's receipt" or "this app may not read receipts" (not approved / scope). One
          // list read tells them apart: it works -> the number is not ours; it is refused too -> nothing is decided against
          // the buyer: the site waits for the shop (like manual mode) and the admin card shows the code.
          if (e.status === 403) {
            try {
              if (await canReadReceipts(cfg, await shopAccessToken(adapter, cfg), shop.shopId)) return { result: 'rejected', reason: 'not_found' };
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
    return evaluateReceipt(receipt, input, { sellerUserId: shop.userId });
  }
}
