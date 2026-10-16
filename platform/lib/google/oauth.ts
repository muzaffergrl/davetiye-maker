// Google OAuth 2.0 (G128) with plain fetch (no googleapis package): the consent URL, the code exchange, access tokens
// from the stored refresh token, revoking on disconnect. Errors carry Google's error code only (never a token).

import { CALLBACK_PATH, GOOGLE_ENDPOINTS, GOOGLE_SCOPE, type GoogleConfig } from './config.ts';

const TIMEOUT_MS = 15_000;

export class GoogleError extends Error {
  /** Google's error code ("invalid_grant", "PERMISSION_DENIED" …) or "network" / "http_<status>". */
  readonly code: string;
  readonly status: number;
  constructor(code: string, status: number) {
    super(`google ${code} (${status})`);
    this.name = 'GoogleError';
    this.code = code;
    this.status = status;
  }
}

export const redirectUri = (origin: string) => `${origin}${CALLBACK_PATH}`;

/** The consent screen URL: drive.file only, offline (a refresh token), always asking (so a refresh token comes back). */
export function authUrl(cfg: GoogleConfig, origin: string, state: string): string {
  const u = new URL(GOOGLE_ENDPOINTS.auth);
  u.searchParams.set('client_id', cfg.clientId);
  u.searchParams.set('redirect_uri', redirectUri(origin));
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', GOOGLE_SCOPE);
  u.searchParams.set('access_type', 'offline');
  u.searchParams.set('prompt', 'consent');
  u.searchParams.set('include_granted_scopes', 'false');
  u.searchParams.set('state', state);
  return u.toString();
}

async function call(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' });
  } catch {
    throw new GoogleError('network', 0);
  }
}

/** Google's error code of a failed response (OAuth: {error}; APIs: {error: {status}}). */
export async function errorOf(res: Response): Promise<GoogleError> {
  let code = `http_${res.status}`;
  try {
    const body = (await res.json()) as { error?: unknown };
    if (typeof body.error === 'string') code = body.error;
    else if (body.error && typeof body.error === 'object' && typeof (body.error as { status?: unknown }).status === 'string') code = (body.error as { status: string }).status;
  } catch {
    /* not JSON */
  }
  return new GoogleError(code, res.status);
}

async function tokenRequest(params: Record<string, string>): Promise<{ access_token: string; refresh_token?: string; scope?: string }> {
  const res = await call(GOOGLE_ENDPOINTS.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams(params).toString(),
  });
  if (!res.ok) throw await errorOf(res);
  const body = (await res.json()) as { access_token?: unknown; refresh_token?: unknown; scope?: unknown };
  if (typeof body.access_token !== 'string') throw new GoogleError('no_access_token', res.status);
  return {
    access_token: body.access_token,
    ...(typeof body.refresh_token === 'string' ? { refresh_token: body.refresh_token } : {}),
    ...(typeof body.scope === 'string' ? { scope: body.scope } : {}),
  };
}

/** Code from the callback -> {refresh token, access token}. Throws GoogleError("no_refresh_token") without one. */
export async function exchangeCode(cfg: GoogleConfig, origin: string, code: string): Promise<{ refreshToken: string; accessToken: string }> {
  const t = await tokenRequest({
    code,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    redirect_uri: redirectUri(origin),
    grant_type: 'authorization_code',
  });
  if (!t.refresh_token) throw new GoogleError('no_refresh_token', 200);
  if (t.scope && !t.scope.split(/\s+/).includes(GOOGLE_SCOPE)) throw new GoogleError('scope_missing', 200);
  return { refreshToken: t.refresh_token, accessToken: t.access_token };
}

export async function accessToken(cfg: GoogleConfig, refreshToken: string): Promise<string> {
  const t = await tokenRequest({ client_id: cfg.clientId, client_secret: cfg.clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' });
  return t.access_token;
}

/** Best effort: Google forgets the grant (the couple's "Disconnect"). Never throws. */
export async function revokeToken(token: string): Promise<void> {
  try {
    await call(GOOGLE_ENDPOINTS.revoke, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token }).toString(),
    });
  } catch {
    /* the local disconnect still happens */
  }
}

/** JSON call to the Sheets API with an access token. */
export async function sheetsCall<T>(token: string, url: string, method: 'GET' | 'POST', body?: unknown): Promise<T> {
  const res = await call(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!res.ok) throw await errorOf(res);
  return (await res.json()) as T;
}
