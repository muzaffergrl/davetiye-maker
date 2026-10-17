// Etsy Open API v3 over plain fetch (G147; no SDK): the consent URL with PKCE, the code exchange, the refresh grant and
// the three reads we need (getMe, getShop, getShopReceipt). What was checked against Etsy's own sources: lib/etsy/config.ts.
// Errors carry a code and the HTTP status only — never a token, a key, an address or Etsy's free text.

import { createHash, randomBytes } from 'node:crypto';
import { apiKeyHeader, ETSY_ENDPOINTS, ETSY_SCOPES, etsyRedirectUri, type EtsyConfig } from './config.ts';

/** A token request or an API read waits at most this long (the buyer on /start waits for the receipt check). */
export const ETSY_TIMEOUT_MS = 10_000;

export class EtsyError extends Error {
  /** "network" | "timeout" | "rate_limited" | "invalid_grant" | OAuth error code | "http_<status>" | "bad_answer". */
  readonly code: string;
  readonly status: number;
  constructor(code: string, status: number) {
    super(`etsy ${code} (${status})`);
    this.name = 'EtsyError';
    this.code = code;
    this.status = status;
  }
}

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

let fetchImpl: FetchLike | null = null;

/** Tests answer Etsy's requests with a fake; null restores the real fetch. */
export function setEtsyFetch(fn: FetchLike | null): void {
  fetchImpl = fn;
}

async function call(url: string, init: RequestInit, timeoutMs = ETSY_TIMEOUT_MS): Promise<Response> {
  const f: FetchLike = fetchImpl ?? ((u, i) => fetch(u, i));
  try {
    return await f(url, { ...init, signal: AbortSignal.timeout(timeoutMs), cache: 'no-store', redirect: 'error' });
  } catch (e) {
    const name = e instanceof Error ? e.name : '';
    throw new EtsyError(name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'network', 0);
  }
}

/** Etsy's error code of a failed answer (OAuth: {error: "invalid_grant"}; API: {error: "<text>"} -> http_<status>). */
async function errorOf(res: Response): Promise<EtsyError> {
  if (res.status === 429) return new EtsyError('rate_limited', 429);
  let code = `http_${res.status}`;
  try {
    const body = (await res.json()) as { error?: unknown };
    // Only short machine codes are kept (OAuth: invalid_grant, invalid_request …); API errors are free text -> http_<n>.
    if (typeof body.error === 'string' && /^[a-z_]{3,40}$/.test(body.error)) code = body.error;
  } catch {
    /* not JSON */
  }
  return new EtsyError(code, res.status);
}

// ---------------------------------------------------------------------------------------------
// OAuth 2.0 with PKCE

/** A fresh PKCE verifier (43–128 characters of [A-Za-z0-9-._~]; here 64 base64url characters). */
export function newCodeVerifier(): string {
  return randomBytes(48).toString('base64url');
}

/** S256 challenge: base64url(SHA-256(verifier)) without padding. */
export function codeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier, 'ascii').digest('base64url');
}

/** Etsy's consent page for the shop owner. */
export function etsyAuthUrl(cfg: EtsyConfig, origin: string, state: string, verifier: string): string {
  const u = new URL(ETSY_ENDPOINTS.connect);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('client_id', cfg.keystring);
  u.searchParams.set('redirect_uri', etsyRedirectUri(origin));
  u.searchParams.set('scope', ETSY_SCOPES.join(' '));
  u.searchParams.set('state', state);
  u.searchParams.set('code_challenge', codeChallenge(verifier));
  u.searchParams.set('code_challenge_method', 'S256');
  return u.toString();
}

export interface EtsyTokens {
  accessToken: string;
  refreshToken: string;
  /** Seconds (Etsy: 3600). */
  expiresIn: number;
}

async function tokenRequest(cfg: EtsyConfig, params: Record<string, string>): Promise<EtsyTokens> {
  const res = await call(ETSY_ENDPOINTS.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      // Not needed by the token endpoint per the clients checked; sent anyway so a stricter key check never breaks it.
      'x-api-key': apiKeyHeader(cfg),
    },
    body: new URLSearchParams(params).toString(),
  });
  if (!res.ok) throw await errorOf(res);
  let body: { access_token?: unknown; refresh_token?: unknown; expires_in?: unknown };
  try {
    body = (await res.json()) as typeof body;
  } catch {
    throw new EtsyError('bad_answer', res.status);
  }
  if (typeof body.access_token !== 'string' || !body.access_token) throw new EtsyError('no_access_token', res.status);
  if (typeof body.refresh_token !== 'string' || !body.refresh_token) throw new EtsyError('no_refresh_token', res.status);
  const expiresIn = typeof body.expires_in === 'number' && body.expires_in > 0 ? body.expires_in : 3600;
  return { accessToken: body.access_token, refreshToken: body.refresh_token, expiresIn };
}

/** The code from the callback (+ the PKCE verifier of this connect) -> tokens. */
export function exchangeCode(cfg: EtsyConfig, origin: string, code: string, verifier: string): Promise<EtsyTokens> {
  return tokenRequest(cfg, {
    grant_type: 'authorization_code',
    client_id: cfg.keystring,
    redirect_uri: etsyRedirectUri(origin),
    code,
    code_verifier: verifier,
  });
}

/** A new access token AND a new refresh token (Etsy rotates it: the caller stores the new one). */
export function refreshTokens(cfg: EtsyConfig, refreshToken: string): Promise<EtsyTokens> {
  return tokenRequest(cfg, { grant_type: 'refresh_token', client_id: cfg.keystring, refresh_token: refreshToken });
}

// ---------------------------------------------------------------------------------------------
// Reads

async function apiGet<T>(cfg: EtsyConfig, accessToken: string | null, path: string): Promise<T> {
  const res = await call(`${ETSY_ENDPOINTS.api}${path}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKeyHeader(cfg),
      Accept: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  if (!res.ok) throw await errorOf(res);
  try {
    return (await res.json()) as T;
  } catch {
    throw new EtsyError('bad_answer', res.status);
  }
}

export interface EtsyMe {
  user_id?: number;
  shop_id?: number;
}

/** GET /users/me: the connected user and their shop id. */
export function getMe(cfg: EtsyConfig, accessToken: string): Promise<EtsyMe> {
  return apiGet<EtsyMe>(cfg, accessToken, '/users/me');
}

/** GET /shops/{shop_id}: only the shop name is used (admin card). */
export function getShop(cfg: EtsyConfig, accessToken: string, shopId: number): Promise<{ shop_name?: string }> {
  return apiGet(cfg, accessToken, `/shops/${encodeURIComponent(String(shopId))}`);
}

export interface EtsyReceiptTransaction {
  listing_id?: number | null;
  seller_user_id?: number;
  /** Units bought of this listing (G152: a design bought twice = two websites). */
  quantity?: number;
}

/** The fields of a ShopReceipt the order check reads (Etsy's OpenAPI schema, lib/etsy/config.ts). */
export interface EtsyReceipt {
  receipt_id?: number;
  seller_user_id?: number;
  buyer_email?: string | null;
  status?: string;
  is_paid?: boolean;
  transactions?: EtsyReceiptTransaction[];
}

/** GET /shops/{shop_id}/receipts/{receipt_id} (scope transactions_r). Another shop's receipt answers 404 (or 403). */
export function getShopReceipt(cfg: EtsyConfig, accessToken: string, shopId: number, receiptId: string): Promise<EtsyReceipt> {
  return apiGet<EtsyReceipt>(cfg, accessToken, `/shops/${encodeURIComponent(String(shopId))}/receipts/${encodeURIComponent(receiptId)}`);
}

/** GET /shops/{shop_id}/receipts?limit=1: "may this connection read receipts at all?" (tells a foreign receipt from a scope problem). */
export async function canReadReceipts(cfg: EtsyConfig, accessToken: string, shopId: number): Promise<boolean> {
  try {
    await apiGet(cfg, accessToken, `/shops/${encodeURIComponent(String(shopId))}/receipts?limit=1`);
    return true;
  } catch (e) {
    if (e instanceof EtsyError && (e.status === 401 || e.status === 403)) return false;
    throw e;
  }
}
