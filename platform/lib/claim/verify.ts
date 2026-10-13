// Etsy order verification for /start (G045) — an interface point, OFF by default.
//
// Today (docs/10 §3: "first version = format check + record") an order number is accepted when it
// has the right format (lib/claim/fields.ts) and has not been used for another website. Nothing is
// asked from Etsy. Setting CLAIM_ORDER_VERIFICATION selects a verifier:
//
//   (unset) | off   FormatOnlyVerifier: no outside check (the default)
//   etsy            NOT IMPLEMENTED: getOrderVerifier() throws, so /start answers 500 instead of
//                   silently skipping a check someone switched on.
//
// TODO(G045 follow-up, needs the shop's Etsy API app + user approval): implement EtsyOrderVerifier.
// Open points to confirm against the Etsy Open API v3 when implementing (not verified here):
//  - read the shop's receipt by order number (OAuth token of the shop, transactions read scope);
//  - "verified" only when the receipt belongs to our shop and is paid; refunded/cancelled -> rejected;
//  - whether the buyer email is available to compare with the address typed on /start;
//  - map the purchased listing to the theme id (theme_mismatch when the buyer opened another design);
//  - multi-item orders (two designs in one order) would need "one site per order ITEM", not per order;
//  - Etsy outages / rate limits -> "unavailable" (the buyer is asked to retry; nothing is stored).
// Register a verifier in code with setOrderVerifier() (tests do this) or by the env switch above.

export type OrderCheckReason = 'not_found' | 'email_mismatch' | 'theme_mismatch' | 'not_paid';

export type OrderCheck =
  /** Verification is off: only the format and the one-site-per-order rule apply. */
  | { result: 'not_checked' }
  | { result: 'verified' }
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
}

export interface OrderVerifier {
  readonly kind: string;
  check(input: OrderCheckInput): Promise<OrderCheck>;
}

/** Default: no outside verification. */
export class FormatOnlyVerifier implements OrderVerifier {
  readonly kind = 'format-only';
  async check(): Promise<OrderCheck> {
    return { result: 'not_checked' };
  }
}

export class VerifierConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VerifierConfigError';
  }
}

let override: OrderVerifier | null = null;

/** The verifier /start uses. Throws VerifierConfigError for "etsy" (not built) or an unknown value. */
export function getOrderVerifier(): OrderVerifier {
  if (override) return override;
  const mode = (process.env.CLAIM_ORDER_VERIFICATION ?? '').trim().toLowerCase();
  if (mode === '' || mode === 'off') return new FormatOnlyVerifier();
  if (mode === 'etsy') {
    throw new VerifierConfigError(
      'CLAIM_ORDER_VERIFICATION=etsy is not implemented yet (docs/10 §3: Etsy API verification comes later). Unset it to use the format check.',
    );
  }
  throw new VerifierConfigError(`Unknown CLAIM_ORDER_VERIFICATION "${mode}" (use "off").`);
}

/** Replaces the verifier (a real Etsy verifier later; fakes in tests). null restores the env choice. */
export function setOrderVerifier(verifier: OrderVerifier | null): void {
  override = verifier;
}
