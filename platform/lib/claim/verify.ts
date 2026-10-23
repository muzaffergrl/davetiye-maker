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

/**
 * What an accepted order's lines say (G152, G951), when the verifier could read them:
 *   units   websites of READY designs the order pays for (designs × quantity; services never count). 0 = the order holds
 *           services only (setup, extra revision, custom design): it pays for no ready design. Absent = unknown (one site).
 *   custom  custom-design lines: each includes the website of its own private design (G151); absent = none.
 *   source  "mail": read from Etsy's sale email (lib/mailbox) — a best reading of a text, never enough to add websites by
 *           itself; absent: the Etsy receipt (or a verifier that read one).
 */
export interface OrderItemsInfo {
  units?: number;
  custom?: number;
  source?: 'mail';
}

export type OrderCheck =
  /** Verification is off: only the format and the one-site-per-order rule apply. */
  | { result: 'not_checked' }
  | ({ result: 'verified' } & OrderItemsInfo)
  /**
   * Accepted for now; the shop confirms the order by hand before the site can be published (manual mode). `unpaid`
   * (Etsy): the receipt is ours but not paid yet — otherwise Etsy could not be asked.
   */
  | ({ result: 'pending'; unpaid?: boolean } & OrderItemsInfo)
  /** Trust mode: accepted and publishable now; checked again later (lib/claim/trust.ts). */
  | ({ result: 'provisional' } & OrderItemsInfo)
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

/** G951: what one order check says about the websites of the order (pure). */
export interface OrderCoverage {
  /** Websites the order pays for (ready designs, + custom designs for a private theme); null = the lines were not read. */
  units: number | null;
  /** The number comes from the Etsy receipt (it may decide how many websites the order gets); false: unknown or a mail. */
  receipt: boolean;
  /** The order's lines were read and hold no design for this website (services only). */
  noDesign: boolean;
}

/** `privateTheme`: the website is of a private custom design listed for this order (its custom-design line counts). */
export function orderCoverage(check: OrderCheck, privateTheme = false): OrderCoverage {
  if (check.result !== 'verified' && check.result !== 'pending' && check.result !== 'provisional') return { units: null, receipt: false, noDesign: false };
  if (typeof check.units !== 'number' || !Number.isInteger(check.units) || check.units < 0) return { units: null, receipt: false, noDesign: false };
  const custom = privateTheme && typeof check.custom === 'number' && check.custom > 0 ? check.custom : 0;
  const units = Math.min(check.units + custom, MAX_ORDER_SITES);
  return { units, receipt: check.source !== 'mail', noDesign: units === 0 };
}

/**
 * G951: does this check confirm the website of design unit `slot` (1 = the order's first website)? The first one: unless
 * the lines show no design. A further one (slot ≥ 2): only with the Etsy receipt's units (a sale email is a best reading
 * of a text: the shop looks).
 */
export function checkCoversSlot(check: OrderCheck, slot: number, privateTheme = false): boolean {
  if (check.result !== 'verified') return false;
  const c = orderCoverage(check, privateTheme);
  if (c.noDesign) return false;
  if (slot <= 1) return true;
  return c.receipt && c.units !== null && c.units >= slot;
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
    if (r.result !== 'pending') return { result: 'provisional' };
    // what the receipt said about its lines stays with the answer (G951)
    const info: OrderItemsInfo = {};
    if (typeof r.units === 'number') info.units = r.units;
    if (r.custom) info.custom = r.custom;
    if (r.source) info.source = r.source;
    return { result: 'provisional', ...info };
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
