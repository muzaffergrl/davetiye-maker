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
// Fallbacks (never a 500 on /start):
//   app settings missing, shop not connected, Etsy no longer accepts the connection, or Etsy refuses our app (401/403 on
//   the token itself) -> pending, exactly like manual mode; the admin card shows why.
//   Etsy timeout / network error / 429 rate limit / 5xx                -> unavailable (the buyer is asked to retry; nothing stored)
// One website per ORDER (not per item) stays the rule (lib/claim/claim.ts); multi-item orders: follow-up in the task file.

import LISTINGS from './listings.json' with { type: 'json' };
import { getDataAdapter } from '../data/index.ts';
import type { DataAdapter } from '../data/types.ts';
import type { OrderCheck, OrderCheckInput, OrderVerifier } from '../claim/verify.ts';
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

/** The decision for one receipt (pure; exported for the tests). */
export function evaluateReceipt(
  receipt: EtsyReceipt | null,
  input: OrderCheckInput,
  opts: { listings?: Map<string, string>; sellerUserId?: number | null } = {},
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
    const id = t && (typeof t.listing_id === 'number' || typeof t.listing_id === 'string') ? String(t.listing_id) : '';
    const theme = id ? listings.get(id) : undefined;
    if (theme) themes.add(theme);
  }
  if (themes.size && !themes.has(input.theme)) return { result: 'rejected', reason: 'theme_mismatch' };
  if (receipt.is_paid !== true) return { result: 'pending' };
  return { result: 'verified' };
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
