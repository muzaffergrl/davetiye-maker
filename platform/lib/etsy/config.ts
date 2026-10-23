// Etsy Open API v3 connection settings (G147): the shop's own Etsy app, used to check /start order numbers
// (CLAIM_ORDER_VERIFICATION=etsy, lib/etsy/verify.ts).
//
//   ETSY_API_KEY        the app's "keystring" (etsy.com/developers → Your Apps)
//   ETSY_SHARED_SECRET  the app's "shared secret" (same page). Server only; never logged, never sent to a browser.
//   GOOGLE_TOKEN_KEY    reused (no new secret for the owner): the key that seals the shop's Etsy tokens at rest is DERIVED
//                       from it with HKDF-SHA256 and its own label (ETSY_KEY_INFO), so the Etsy key is never the same
//                       bytes as the Google one. Changing GOOGLE_TOKEN_KEY disconnects Etsy as well (connect again).
//
// Without all three the Etsy check is "not configured": /start behaves like manual mode (pending) and the admin card says so.
//
// What was verified, and where (2026-10-17). developers.etsy.com could not be opened from the build sandbox (the egress
// proxy refuses etsy.com hosts), so every point below comes from Etsy's own GitHub space or from Etsy's OpenAPI schema
// as generated into a maintained client, and must be re-read on developers.etsy.com when the owner creates the app
// (task file gorevler/G147-etsy-eposta.md, "Sonra"):
//  - x-api-key = "<keystring>:<shared secret>" on EVERY Open API v3 request; a bare keystring is rejected since
//    2026-02-09 — Etsy's announcement in github.com/etsy/open-api discussion #1529 (2026-02-02).
//  - OAuth 2.0 authorization code flow with PKCE (S256): consent page https://www.etsy.com/oauth/connect
//    (response_type=code, client_id=<keystring>, redirect_uri, scope = space-separated, state, code_challenge,
//    code_challenge_method=S256); token endpoint https://api.etsy.com/v3/public/oauth/token, form-encoded,
//    grant_type=authorization_code (client_id, redirect_uri, code, code_verifier) and grant_type=refresh_token
//    (client_id, refresh_token). No client secret in the token request (public PKCE client). Same in the two maintained
//    clients checked: etsy-ts@8.0.1 (TokenRefresher) and @profplum700/etsy-v3-api-client@4.0.0 (AuthHelper).
//  - Access token: expires_in 3600 s; refresh token: about 90 days; every refresh returns a NEW refresh token, which must
//    be stored (etsy/open-api discussions #996 and #1351 — community answers, not staff).
//  - getMe GET /v3/application/users/me -> {user_id, shop_id}; getShopReceipt GET /v3/application/shops/{shop_id}/
//    receipts/{receipt_id} (scope transactions_r) -> ShopReceipt {receipt_id, seller_user_id, buyer_email ("null if access
//    hasn't been granted. Access is case-by-case and subject to approval"), status (paid | completed | open | payment
//    processing | canceled | fully refunded | partially refunded), is_paid, transactions[{listing_id, …}]} — Etsy's
//    OpenAPI schema text as generated into etsy-ts@8.0.1 (api/data-contracts.d.ts).
//  - Rate limits: answers carry x-limit-per-second / x-remaining-today; over the limit = HTTP 429 (header names as read
//    by @profplum700/etsy-v3-api-client@4.0.0). We map 429 to "unavailable" (the buyer retries).
//  - The order number a buyer sees on Etsy is the receipt id.

import { hkdfSync } from 'node:crypto';
import { parseTokenKey } from '../google/config.ts';

/** Etsy endpoints; tests replace fetch (setEtsyFetch), not these. */
export const ETSY_ENDPOINTS = {
  connect: 'https://www.etsy.com/oauth/connect',
  token: 'https://api.etsy.com/v3/public/oauth/token',
  api: 'https://api.etsy.com/v3/application',
};

/** Read-only scopes: receipts (transactions_r) and the shop's basic data (shops_r). */
export const ETSY_SCOPES = ['transactions_r', 'shops_r'] as const;

/** Must be listed as a callback URL of the Etsy app: https://<public host>/api/etsy/callback. */
export const ETSY_CALLBACK_PATH = '/api/etsy/callback';

/** HKDF "info" label: the Etsy token key is derived from GOOGLE_TOKEN_KEY with this label (never the same key). */
export const ETSY_KEY_INFO = 'bke-studio/etsy-shop-tokens/v1';

export interface EtsyConfig {
  keystring: string;
  sharedSecret: string;
  /** 32-byte AES-256-GCM key for the shop's tokens (derived, see above). */
  tokenKey: Buffer;
}

export type EtsySetup = { state: 'ready'; config: EtsyConfig } | { state: 'missing'; missing: string[] };

/** The Etsy token key from the Google token key (HKDF-SHA256, empty salt, ETSY_KEY_INFO). */
export function etsyTokenKey(googleKey: Buffer): Buffer {
  return Buffer.from(hkdfSync('sha256', googleKey, Buffer.alloc(0), ETSY_KEY_INFO, 32));
}

/** Which settings are there. Read on every call (tests change the environment). Names only in `missing`, never values. */
export function etsySetup(env: Record<string, string | undefined> = process.env): EtsySetup {
  const keystring = (env.ETSY_API_KEY ?? '').trim();
  const sharedSecret = (env.ETSY_SHARED_SECRET ?? '').trim();
  const googleKey = parseTokenKey(env.GOOGLE_TOKEN_KEY ?? '');
  const missing: string[] = [];
  if (!keystring) missing.push('ETSY_API_KEY');
  if (!sharedSecret) missing.push('ETSY_SHARED_SECRET');
  if (!googleKey) missing.push('GOOGLE_TOKEN_KEY');
  if (missing.length || !googleKey) return { state: 'missing', missing };
  return { state: 'ready', config: { keystring, sharedSecret, tokenKey: etsyTokenKey(googleKey) } };
}

export function etsyConfig(env: Record<string, string | undefined> = process.env): EtsyConfig | null {
  const s = etsySetup(env);
  return s.state === 'ready' ? s.config : null;
}

/** x-api-key header value (discussion #1529): keystring and shared secret joined by a colon. */
export const apiKeyHeader = (cfg: Pick<EtsyConfig, 'keystring' | 'sharedSecret'>) => `${cfg.keystring}:${cfg.sharedSecret}`;

export const etsyRedirectUri = (origin: string) => `${origin.replace(/\/+$/, '')}${ETSY_CALLBACK_PATH}`;

/** CLAIM_ORDER_VERIFICATION as the admin shows it (parsed in lib/claim/mode.ts, shared with /start and the launch gate). */
export { verificationMode, type VerificationMode } from '../claim/mode.ts';
