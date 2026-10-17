// The shop's Etsy connection (G147): one-time OAuth by the shop owner from the admin, tokens sealed at rest, automatic
// access-token refresh, disconnect.
//
// Stored as a site document of a RESERVED site id (SHOP_DOC_ID, the nil UUID: randomUUID() never makes it, so no real
// site can own it) under the name "etsy-shop" — DataAdapter.readSiteDoc / updateSiteDoc already work on every adapter
// (local file, private Blob with ETag-checked writes), so no adapter change was needed:
//
//   {v: 1, refresh: "<sealed>", access: "<sealed>", accessExpiresAt, shopId, userId, shopName, connectedAt,
//    lastError: {at, code} | null, pending: {stateHash, verifier: "<sealed>", at} | null}
//
// Sealing: AES-256-GCM (lib/google/crypto.ts) with the key derived from GOOGLE_TOKEN_KEY (lib/etsy/config.ts) and an
// associated-data label per field, so a sealed value cannot be moved to another field or to a Google document.
// Plain tokens exist only in memory during a request; they are never logged and never sent to a browser.

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { DataAdapter } from '../data/types.ts';
import { decryptToken, encryptToken } from '../google/crypto.ts';
import { etsySetup, verificationMode, type EtsyConfig, type VerificationMode } from './config.ts';
import { EtsyError, etsyAuthUrl, exchangeCode, getMe, getShop, newCodeVerifier, refreshTokens, type EtsyTokens } from './client.ts';

export const SHOP_DOC_ID = '00000000-0000-0000-0000-000000000000';
export const ETSY_DOC = 'etsy-shop';
export const ETSY_STATE_TTL_MS = 10 * 60_000;
export const ETSY_STATE_COOKIE = 'bke_estate';
/** An access token is refreshed this long before Etsy's expiry. */
const EARLY_REFRESH_MS = 2 * 60_000;

export interface EtsyShopDoc {
  v: 1;
  refresh?: string | null;
  access?: string | null;
  accessExpiresAt?: string | null;
  shopId?: number | null;
  userId?: number | null;
  shopName?: string | null;
  connectedAt?: string | null;
  lastError?: { at: string; code: string } | null;
  pending?: { stateHash: string; verifier: string; at: string } | null;
}

const AAD = { refresh: 'etsy-shop:refresh', access: 'etsy-shop:access', verifier: 'etsy-shop:verifier' } as const;
const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const updateDoc = (adapter: DataAdapter, change: (cur: EtsyShopDoc | null) => EtsyShopDoc | null) => adapter.updateSiteDoc<EtsyShopDoc>(SHOP_DOC_ID, ETSY_DOC, change);

export async function readEtsyDoc(adapter: DataAdapter): Promise<EtsyShopDoc | null> {
  const d = (await adapter.readSiteDoc(SHOP_DOC_ID, ETSY_DOC)) as EtsyShopDoc | null;
  return d && typeof d === 'object' && d.v === 1 ? d : null;
}

/** Thrown when the order check needs Etsy but the shop is not connected (or Etsy no longer accepts the connection). */
export class EtsyNotConnectedError extends Error {
  constructor(reason: string) {
    super(`etsy shop not connected (${reason})`);
    this.name = 'EtsyNotConnectedError';
  }
}

// ---------------------------------------------------------------------------------------------
// Status (admin card)

export interface EtsyStatus {
  /** CLAIM_ORDER_VERIFICATION. */
  mode: VerificationMode;
  /** The app's env settings are all there. */
  configured: boolean;
  /** Env NAMES that are missing (never values). */
  missing: string[];
  connected: boolean;
  shopId: number | null;
  shopName: string | null;
  connectedAt: string | null;
  /** Last problem with the connection (machine code; the admin card words it). */
  error: string | null;
  errorAt: string | null;
  /** Etsy no longer accepts the stored connection: connect again. */
  reconnect: boolean;
  /** Mode "etsy" but the check cannot run (not configured / not connected / reconnect): new sites wait like in manual mode. */
  fallbackToManual: boolean;
}

export async function etsyStatus(adapter: DataAdapter, env: Record<string, string | undefined> = process.env): Promise<EtsyStatus> {
  const setup = etsySetup(env);
  const mode = verificationMode(env);
  const doc = await readEtsyDoc(adapter);
  const connected = Boolean(doc?.refresh) && setup.state === 'ready';
  const reconnect = connected && doc?.lastError?.code === 'invalid_grant';
  return {
    mode,
    configured: setup.state === 'ready',
    missing: setup.state === 'missing' ? setup.missing : [],
    connected,
    shopId: connected ? (doc?.shopId ?? null) : null,
    shopName: connected ? (doc?.shopName ?? null) : null,
    connectedAt: connected ? (doc?.connectedAt ?? null) : null,
    error: doc?.refresh ? (doc?.lastError?.code ?? null) : null,
    errorAt: doc?.refresh ? (doc?.lastError?.at ?? null) : null,
    reconnect,
    fallbackToManual: mode === 'etsy' && (!connected || reconnect),
  };
}

// ---------------------------------------------------------------------------------------------
// Connect (admin) and the callback

/** Starts a connect: fresh state + PKCE verifier (sealed, 10 minutes) and Etsy's consent URL. */
export async function startEtsyConnect(adapter: DataAdapter, origin: string, now: Date = new Date()): Promise<{ url: string; state: string }> {
  const setup = etsySetup();
  if (setup.state !== 'ready') throw new EtsyError('not_configured', 503);
  const cfg = setup.config;
  const state = randomBytes(32).toString('base64url');
  const verifier = newCodeVerifier();
  await updateDoc(adapter, (cur) => ({
    ...(cur ?? { v: 1 }),
    v: 1,
    pending: { stateHash: sha(state), verifier: encryptToken(verifier, cfg.tokenKey, AAD.verifier), at: now.toISOString() },
  }));
  return { url: etsyAuthUrl(cfg, origin, state, verifier), state };
}

export type EtsyCallbackResult = { ok: true; shopName: string | null } | { ok: false; reason: 'denied' | 'state' | 'etsy' | 'no_shop' | 'not_configured' };

/**
 * Etsy's redirect: the state must match the browser's cookie AND the stored hash (fresh, used once); the code and the
 * PKCE verifier give the tokens; getMe gives the shop id (a user without a shop cannot be used).
 */
export async function finishEtsyConnect(
  adapter: DataAdapter,
  params: { state: string | null; code: string | null; error: string | null; cookieState: string | null },
  origin: string,
  now: Date = new Date(),
): Promise<EtsyCallbackResult> {
  const setup = etsySetup();
  if (setup.state !== 'ready') return { ok: false, reason: 'not_configured' };
  const cfg = setup.config;
  const state = params.state ?? '';
  if (!/^[A-Za-z0-9_-]{43}$/.test(state) || !params.cookieState || params.cookieState.length !== state.length) return { ok: false, reason: 'state' };
  if (!timingSafeEqual(Buffer.from(params.cookieState), Buffer.from(state))) return { ok: false, reason: 'state' };
  // The state is used once, whatever happens next.
  const found: { sealed: string | null } = { sealed: null };
  await updateDoc(adapter, (cur) => {
    const p = cur?.pending;
    if (p && p.stateHash === sha(state) && now.getTime() - Date.parse(p.at) <= ETSY_STATE_TTL_MS) found.sealed = p.verifier;
    if (!cur) return null;
    return { ...cur, pending: null };
  });
  const verifier = found.sealed ? decryptToken(found.sealed, cfg.tokenKey, AAD.verifier) : null;
  if (!verifier) return { ok: false, reason: 'state' };
  if (params.error || !params.code) return { ok: false, reason: 'denied' };
  let tokens: EtsyTokens;
  let me: { user_id?: number; shop_id?: number };
  try {
    tokens = await exchangeCode(cfg, origin, params.code, verifier);
    me = await getMe(cfg, tokens.accessToken);
  } catch (e) {
    console.error(`[etsy] connect: ${e instanceof EtsyError ? e.code : 'error'}`);
    return { ok: false, reason: 'etsy' };
  }
  if (typeof me.shop_id !== 'number' || me.shop_id < 1) return { ok: false, reason: 'no_shop' };
  let shopName: string | null = null;
  try {
    const shop = await getShop(cfg, tokens.accessToken, me.shop_id);
    shopName = typeof shop.shop_name === 'string' ? shop.shop_name.slice(0, 80) : null;
  } catch {
    /* the name is only shown in the admin */
  }
  await updateDoc(adapter, () => ({
    v: 1,
    ...sealTokens(cfg, tokens, now),
    shopId: me.shop_id!,
    userId: typeof me.user_id === 'number' ? me.user_id : null,
    shopName,
    connectedAt: now.toISOString(),
    lastError: null,
    pending: null,
  }));
  return { ok: true, shopName };
}

/** Forgets the connection (tokens deleted here). Etsy has no revoke call that we use; the owner can remove the app on Etsy. */
export async function disconnectEtsy(adapter: DataAdapter): Promise<void> {
  await updateDoc(adapter, () => null);
}

// ---------------------------------------------------------------------------------------------
// Access tokens

function sealTokens(cfg: EtsyConfig, t: EtsyTokens, now: Date): Pick<EtsyShopDoc, 'refresh' | 'access' | 'accessExpiresAt'> {
  return {
    refresh: encryptToken(t.refreshToken, cfg.tokenKey, AAD.refresh),
    access: encryptToken(t.accessToken, cfg.tokenKey, AAD.access),
    accessExpiresAt: new Date(now.getTime() + t.expiresIn * 1000).toISOString(),
  };
}

let refreshing: Promise<string> | null = null;

async function refreshAccess(adapter: DataAdapter, cfg: EtsyConfig, now: () => Date): Promise<string> {
  const doc = await readEtsyDoc(adapter);
  const refresh = doc?.refresh ? decryptToken(doc.refresh, cfg.tokenKey, AAD.refresh) : null;
  if (!refresh) throw new EtsyNotConnectedError(doc?.refresh ? 'bad_token' : 'none');
  let tokens: EtsyTokens;
  try {
    tokens = await refreshTokens(cfg, refresh);
  } catch (e) {
    if (e instanceof EtsyError && (e.code === 'invalid_grant' || e.status === 400 || e.status === 401)) {
      // Another server instance may have rotated the refresh token in between: use the one it stored.
      const again = await readEtsyDoc(adapter);
      const other = again?.refresh ? decryptToken(again.refresh, cfg.tokenKey, AAD.refresh) : null;
      if (other && other !== refresh) {
        tokens = await refreshTokens(cfg, other);
      } else {
        const at = now().toISOString();
        await updateDoc(adapter, (cur) => (cur?.refresh ? { ...cur, access: null, lastError: { at, code: 'invalid_grant' } } : cur));
        throw new EtsyNotConnectedError('invalid_grant');
      }
    } else {
      throw e;
    }
  }
  const sealed = sealTokens(cfg, tokens, now());
  await updateDoc(adapter, (cur) => (cur?.refresh ? { ...cur, ...sealed, lastError: null } : cur));
  return tokens.accessToken;
}

/**
 * A valid access token of the shop: the stored one while it has more than 2 minutes left, else a refresh (one at a time
 * in this process; the rotated refresh token is stored). Throws EtsyNotConnectedError / EtsyError.
 */
export async function shopAccessToken(adapter: DataAdapter, cfg: EtsyConfig, opts: { force?: boolean; now?: () => Date } = {}): Promise<string> {
  const now = opts.now ?? (() => new Date());
  const doc = await readEtsyDoc(adapter);
  if (!doc?.refresh) throw new EtsyNotConnectedError('none');
  if (!opts.force && doc.access && doc.accessExpiresAt && Date.parse(doc.accessExpiresAt) - now().getTime() > EARLY_REFRESH_MS) {
    const access = decryptToken(doc.access, cfg.tokenKey, AAD.access);
    if (access) return access;
  }
  if (!refreshing) {
    refreshing = refreshAccess(adapter, cfg, now).finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

/** The connected shop's ids, or null when not connected. */
export async function connectedShop(adapter: DataAdapter): Promise<{ shopId: number; userId: number | null } | null> {
  const doc = await readEtsyDoc(adapter);
  return doc?.refresh && typeof doc.shopId === 'number' ? { shopId: doc.shopId, userId: doc.userId ?? null } : null;
}

/** Remembers a connection problem for the admin card (no secrets: a machine code only). */
export async function noteEtsyError(adapter: DataAdapter, code: string, now: Date = new Date()): Promise<void> {
  await updateDoc(adapter, (cur) => (cur?.refresh ? { ...cur, lastError: { at: now.toISOString(), code } } : cur));
}

/** Clears a remembered problem after a successful call (only writes when there was one). */
export async function clearEtsyError(adapter: DataAdapter): Promise<void> {
  const doc = await readEtsyDoc(adapter);
  if (!doc?.lastError) return;
  await updateDoc(adapter, (cur) => (cur?.refresh ? { ...cur, lastError: null } : cur));
}
