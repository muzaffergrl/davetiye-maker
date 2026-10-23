// Etsy order verification for /start (G045, G147).
//
// Setting CLAIM_ORDER_VERIFICATION selects a verifier:
//
//   (unset) | off   FormatOnlyVerifier: no outside check (the default). An order number is accepted when it has the
//                   right format (lib/claim/fields.ts) and has not been used for another website.
//   manual          ManualOrderVerifier (G060-fix): /start still creates the draft at once, but the site is marked
//                   "pending" (SiteRecord.orderCheck): it can be edited in its panel, but not published and not opened
//                   with a shared preview link until the shop confirms the order (admin "Siparişi onayla", or
//                   `node scripts/verify-order.ts --order <no> --reason "…"`).
//   etsy            EtsyOrderVerifier (G147, lib/etsy/verify.ts): the order number is read as a receipt of OUR Etsy shop
//                   through the shop's one-time OAuth connection (admin → "Etsy mağazasını bağla"). Paid -> verified;
//                   cancelled / fully refunded / not ours -> rejected; Etsy down / rate limited -> unavailable. While the
//                   Etsy app settings are missing or the shop is not connected it answers "pending" — exactly manual
//                   mode, never a 500 — and a later re-check (admin button; the buyer's panel; Publish) verifies the
//                   site by itself once Etsy can be asked (lib/etsy/recheck.ts).
//   trust           TrustOrderVerifier ("trust first, verify later", lib/claim/trust.ts): Etsy is asked as in "etsy"
//                   mode when it can be, then the shop's mailbox (G192, lib/mailbox: Etsy's signed "You made a sale"
//                   email); a definite answer stays (verified / rejected), anything else — Etsy not
//                   connected, payment still processing, Etsy not answering — is "provisional": the site is made and
//                   can be PUBLISHED at once. A later check (hourly cron, admin button) verifies it, or holds it
//                   (offline + pending) when Etsy says the order is not ours / cancelled / refunded; unverified after
//                   the trust window (48 h) the shop is told once. The buyer never waits for the shop.
//
// The sales site's launch gate (lib/marketing/placeholders.ts) refuses `launched: true` until
// MARKETING.verified.orderCheck is true: switch it on only once "manual", "trust" or "etsy" is live.
// Register a verifier in code with setOrderVerifier() (tests do this) or by the env switch above.

import { EtsyOrderVerifier } from '../etsy/verify.ts';
import { MailOrderVerifier } from '../mailbox/verify.ts';
import { verificationMode } from './mode.ts';

export type OrderCheckReason = 'not_found' | 'email_mismatch' | 'theme_mismatch' | 'not_paid';

export type OrderCheck =
  /** Verification is off: only the format and the one-site-per-order rule apply. */
  | { result: 'not_checked' }
  /** `units` (G152, Etsy only): how many websites the order pays for (designs × quantity); absent = 1. */
  | { result: 'verified'; units?: number }
  /**
   * Accepted for now; the shop confirms the order by hand before the site can be published (manual mode). `unpaid`
   * (Etsy): the receipt is ours but not paid yet — otherwise Etsy could not be asked.
   */
  | { result: 'pending'; units?: number; unpaid?: boolean }
  /** Trust mode: accepted and publishable now; checked again later (lib/claim/trust.ts). */
  | { result: 'provisional'; units?: number }
  | { result: 'rejected'; reason: OrderCheckReason }
  /** The outside service could not answer; nothing is created, the buyer may retry. */
  | { result: 'unavailable' };

export interface OrderCheckInput {
  /** Normalised digits (fields.ts normalizeOrderNumber). */
  orderNumber: string;
  /** Normalised address (fields.ts normalizeEmail). */
  email: string;
  /** Theme the buyer is starting from. */
  theme: string;
  /** G174: /start may answer from a short-lived cache of this order's last Etsy receipt read; re-checks never do. */
  cached?: boolean;
}

export interface OrderVerifier {
  readonly kind: string;
  check(input: OrderCheckInput): Promise<OrderCheck>;
}

/** G152: most websites one order can hold, however large the receipt. */
export const MAX_ORDER_SITES = 10;

/**
 * How many websites this order may have: the receipt's design units when the verifier read the receipt (Etsy mode),
 * otherwise 1 (off / manual / Etsy not connected yet: one site per order, as before).
 */
export function orderUnits(check: OrderCheck): number {
  const n = check.result === 'verified' || check.result === 'pending' || check.result === 'provisional' ? check.units : undefined;
  return typeof n === 'number' && Number.isInteger(n) && n > 1 ? Math.min(n, MAX_ORDER_SITES) : 1;
}

/** Default: no outside verification. */
export class FormatOnlyVerifier implements OrderVerifier {
  readonly kind = 'format-only';
  async check(): Promise<OrderCheck> {
    return { result: 'not_checked' };
  }
}

/** Manual mode: every claim is accepted as "pending" until the shop confirms it (scripts/verify-order.ts). */
export class ManualOrderVerifier implements OrderVerifier {
  readonly kind = 'manual';
  async check(): Promise<OrderCheck> {
    return { result: 'pending' };
  }
}

/**
 * Asks its sources in order and keeps the first definite answer (verified / rejected). A source that read the order and
 * found it unpaid (pending + unpaid: Etsy's receipt) also ends the chain — a mail must not overrule Etsy. Otherwise:
 * pending when a source said pending, else unavailable. close() closes the sources that hold a connection.
 */
export class ChainOrderVerifier implements OrderVerifier {
  readonly kind = 'chain';
  readonly #sources: OrderVerifier[];
  constructor(sources: OrderVerifier[]) {
    this.#sources = sources;
  }

  async check(input: OrderCheckInput): Promise<OrderCheck> {
    let pending: OrderCheck | null = null;
    let unavailable = false;
    for (const v of this.#sources) {
      const r = await v.check(input);
      if (r.result === 'verified' || r.result === 'rejected' || (r.result === 'pending' && r.unpaid)) return r;
      if (r.result === 'pending' || r.result === 'provisional') pending ??= r;
      if (r.result === 'unavailable') unavailable = true;
    }
    return pending ?? (unavailable ? { result: 'unavailable' } : { result: 'pending' });
  }

  async close(): Promise<void> {
    for (const v of this.#sources) await (v as { close?: () => Promise<void> }).close?.();
  }
}

/**
 * Trust mode: definite answers stand (verified / rejected) — from Etsy, else from the shop's mailbox; anything open — not
 * connected, not paid yet, no mail yet, nobody answering — lets the buyer in at once as "provisional" instead of making
 * them wait or retry.
 */
export class TrustOrderVerifier implements OrderVerifier {
  readonly kind = 'trust';
  readonly #inner: OrderVerifier;
  constructor(opts: { inner?: OrderVerifier } = {}) {
    this.#inner = opts.inner ?? new ChainOrderVerifier([new EtsyOrderVerifier(), new MailOrderVerifier()]);
  }

  async check(input: OrderCheckInput): Promise<OrderCheck> {
    const r = await this.#inner.check(input);
    if (r.result === 'verified' || r.result === 'rejected' || r.result === 'provisional') return r;
    return r.result === 'pending' && r.units ? { result: 'provisional', units: r.units } : { result: 'provisional' };
  }
}

export class VerifierConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VerifierConfigError';
  }
}

let override: OrderVerifier | null = null;

/** The verifier /start uses. Throws VerifierConfigError for an unknown value (a typo must not silently skip checks). */
export function getOrderVerifier(): OrderVerifier {
  if (override) return override;
  const mode = verificationMode(process.env);
  if (mode === 'off') return new FormatOnlyVerifier();
  if (mode === 'manual') return new ManualOrderVerifier();
  if (mode === 'etsy') return new EtsyOrderVerifier();
  if (mode === 'trust') return new TrustOrderVerifier();
  const typed = (process.env.CLAIM_ORDER_VERIFICATION ?? '').trim().toLowerCase();
  throw new VerifierConfigError(`Unknown CLAIM_ORDER_VERIFICATION "${typed}" (use "off", "manual", "trust" or "etsy").`);
}

/** Replaces the verifier (fakes in tests). null restores the env choice. */
export function setOrderVerifier(verifier: OrderVerifier | null): void {
  override = verifier;
}
