// The couple's Google Sheets connection and its live sync (G128).
//
// Stored as the site document "google-sheets" (DataAdapter.readSiteDoc / updateSiteDoc), NOT in the site record: a
// sync after every guest reply must not move the site's updatedAt (the panel's autosave would see a conflict).
//
//   {v: 1, token: "<AES-GCM refresh token>", connectedAt, spreadsheetId, spreadsheetUrl, lastSyncAt, lastError,
//    pending: {stateHash, at}}       pending = a "Connect" in progress (OAuth state, 10 minutes)
//
// When: after a counted guest reply (the RSVP route, with after()), after the couple adds / edits / removes / keeps
// replies, after a publish (the form's fields may have changed: the columns follow), and on "Sync now". Every sync
// rewrites the whole spreadsheet from the stored replies, so a missed one is healed by the next. Inside one server
// process syncs of a site never overlap: a request while one runs makes it run once more at the end (the last write
// always reads the latest replies). Across server instances two syncs can overlap rarely; both write the full table,
// so the sheet is right again after the next one.

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { DataAdapter, SiteRecord } from '../data/types.ts';
import { tableTitle } from '../rsvp/table.ts';
import { googleConfig, type GoogleConfig } from './config.ts';
import { decryptToken, encryptToken } from './crypto.ts';
import { accessToken, authUrl, exchangeCode, GoogleError, revokeToken } from './oauth.ts';
import { createSpreadsheet, writeSpreadsheet } from './sheets.ts';

export const DOC = 'google-sheets';
export const STATE_TTL_MS = 10 * 60_000;
export const STATE_COOKIE = 'bke_gstate';

export interface SheetsDoc {
  v: 1;
  token?: string | null;
  connectedAt?: string | null;
  spreadsheetId?: string | null;
  spreadsheetUrl?: string | null;
  lastSyncAt?: string | null;
  lastError?: { at: string; message: string; code: string } | null;
  pending?: { stateHash: string; at: string } | null;
}

/** What the panel sees (never the token). */
export interface SheetsStatus {
  /** The shop set up Google (env); false: the panel says "coming soon". */
  available: boolean;
  connected: boolean;
  url: string | null;
  lastSyncAt: string | null;
  error: string | null;
  errorAt: string | null;
  /** Google no longer accepts the connection: the couple must connect again. */
  reconnect: boolean;
}

const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

export function statusOf(doc: SheetsDoc | null, available = googleConfig() !== null): SheetsStatus {
  const connected = Boolean(doc?.token);
  return {
    available,
    connected,
    url: connected ? (doc?.spreadsheetUrl ?? null) : null,
    lastSyncAt: connected ? (doc?.lastSyncAt ?? null) : null,
    error: connected ? (doc?.lastError?.message ?? null) : null,
    errorAt: connected ? (doc?.lastError?.at ?? null) : null,
    reconnect: connected && doc?.lastError?.code === 'invalid_grant',
  };
}

export async function readDoc(adapter: DataAdapter, siteId: string): Promise<SheetsDoc | null> {
  const d = (await adapter.readSiteDoc(siteId, DOC)) as SheetsDoc | null;
  return d && typeof d === 'object' && d.v === 1 ? d : null;
}

export async function sheetsStatus(adapter: DataAdapter, site: SiteRecord): Promise<SheetsStatus> {
  return statusOf(await readDoc(adapter, site.id));
}

// ---------------------------------------------------------------------------------------------
// Connect

/** State parameter "<slug>.<random>": the callback finds the site by its slug and checks the random half. */
export function parseState(state: unknown): { slug: string; secret: string } | null {
  const m = typeof state === 'string' ? /^([a-z0-9-]{1,64})\.([A-Za-z0-9_-]{43})$/.exec(state) : null;
  return m ? { slug: m[1], secret: m[2] } : null;
}

/** Starts a connect: a fresh state (stored hashed with the site, 10 minutes) and Google's consent URL. */
export async function startConnect(adapter: DataAdapter, site: SiteRecord, origin: string, now: Date = new Date()): Promise<{ url: string; state: string }> {
  const cfg = googleConfig();
  if (!cfg) throw new GoogleError('not_configured', 503);
  const secret = randomBytes(32).toString('base64url');
  const state = `${site.slug}.${secret}`;
  await adapter.updateSiteDoc<SheetsDoc>(site.id, DOC, (cur) => ({ ...(cur ?? { v: 1 }), v: 1, pending: { stateHash: sha(secret), at: now.toISOString() } }));
  return { url: authUrl(cfg, origin, state), state };
}

export type CallbackResult = { ok: true; slug: string } | { ok: false; slug: string | null; reason: 'denied' | 'state' | 'google' | 'not_configured' };

/**
 * Google's redirect: checks the state (same browser: the cookie; same site and still fresh: the stored hash), swaps the
 * code for a refresh token, stores it encrypted and writes the sheet for the first time. The state is used once.
 */
export async function finishConnect(
  adapter: DataAdapter,
  params: { state: string | null; code: string | null; error: string | null; cookieState: string | null },
  origin: string,
  now: Date = new Date(),
): Promise<CallbackResult> {
  const cfg = googleConfig();
  const parsed = parseState(params.state);
  if (!cfg) return { ok: false, slug: parsed?.slug ?? null, reason: 'not_configured' };
  if (!parsed || !params.cookieState || params.cookieState.length !== params.state!.length) return { ok: false, slug: parsed?.slug ?? null, reason: 'state' };
  if (!timingSafeEqual(Buffer.from(params.cookieState), Buffer.from(params.state!))) return { ok: false, slug: parsed.slug, reason: 'state' };
  const site = await adapter.getSiteBySlug(parsed.slug);
  if (!site) return { ok: false, slug: null, reason: 'state' };
  // The state is used once, whatever happens next.
  let fresh = false;
  await adapter.updateSiteDoc<SheetsDoc>(site.id, DOC, (cur) => {
    const p = cur?.pending;
    fresh = Boolean(p && p.stateHash === sha(parsed.secret) && now.getTime() - Date.parse(p.at) <= STATE_TTL_MS);
    if (!cur) return null;
    return { ...cur, pending: null };
  });
  if (!fresh) return { ok: false, slug: site.slug, reason: 'state' };
  if (params.error || !params.code) return { ok: false, slug: site.slug, reason: 'denied' };
  let refresh: string;
  try {
    refresh = (await exchangeCode(cfg, origin, params.code)).refreshToken;
  } catch (e) {
    console.error(`[google] connect ${site.slug}: ${e instanceof GoogleError ? e.code : 'error'}`);
    return { ok: false, slug: site.slug, reason: 'google' };
  }
  const old = await readDoc(adapter, site.id);
  const oldToken = old?.token ? decryptToken(old.token, cfg.tokenKey, site.id) : null;
  await adapter.updateSiteDoc<SheetsDoc>(site.id, DOC, (cur) => ({
    v: 1,
    token: encryptToken(refresh, cfg.tokenKey, site.id),
    connectedAt: now.toISOString(),
    // A reconnect keeps writing to the same spreadsheet (drive.file: the app made it, so it can still open it).
    spreadsheetId: cur?.spreadsheetId ?? null,
    spreadsheetUrl: cur?.spreadsheetUrl ?? null,
    lastSyncAt: cur?.lastSyncAt ?? null,
    lastError: null,
    pending: null,
  }));
  if (oldToken && oldToken !== refresh) void revokeToken(oldToken);
  await syncSheet(adapter, site.id, now);
  return { ok: true, slug: site.slug };
}

/** Disconnect: Google forgets the grant (best effort), the token is deleted. The spreadsheet stays in the couple's Drive. */
export async function disconnect(adapter: DataAdapter, site: SiteRecord): Promise<void> {
  const cfg = googleConfig();
  const doc = await readDoc(adapter, site.id);
  const token = doc?.token && cfg ? decryptToken(doc.token, cfg.tokenKey, site.id) : null;
  await adapter.updateSiteDoc<SheetsDoc>(site.id, DOC, () => null);
  if (token) await revokeToken(token);
}

// ---------------------------------------------------------------------------------------------
// Sync

/** The couple's words for a failed sync (never Google's raw text). */
export function syncErrorMessage(e: unknown): { code: string; message: string } {
  const code = e instanceof GoogleError ? e.code : 'error';
  if (code === 'invalid_grant' || code === 'bad_token') return { code: 'invalid_grant', message: 'Google no longer accepts this connection. Please connect Google Sheets again.' };
  if (code === 'network') return { code, message: 'Google could not be reached. Your replies are safe here; we try again with the next reply.' };
  if (e instanceof GoogleError && e.status === 429) return { code, message: 'Google asked us to slow down. We try again with the next reply.' };
  return { code, message: 'Your Google Sheet could not be updated. Your replies are safe here; we try again with the next reply.' };
}

const running = new Map<string, Promise<void>>();
const again = new Set<string>();

async function syncOnce(adapter: DataAdapter, siteId: string, cfg: GoogleConfig, now: () => Date): Promise<void> {
  const doc = await readDoc(adapter, siteId);
  if (!doc?.token) return;
  const site = await adapter.getSiteById(siteId);
  if (!site) return;
  try {
    const refresh = decryptToken(doc.token, cfg.tokenKey, siteId);
    if (!refresh) throw new GoogleError('bad_token', 0);
    const token = await accessToken(cfg, refresh);
    const content = site.publishedContent ?? site.content;
    const list = await adapter.listRsvps(siteId);
    let id = doc.spreadsheetId ?? null;
    let url = doc.spreadsheetUrl ?? null;
    const write = async () => writeSpreadsheet(token, id!, list, content, now());
    if (!id) {
      const made = await createSpreadsheet(token, tableTitle(content), (content as { timezone?: string }).timezone ?? 'UTC');
      ({ id, url } = made);
      await write();
    } else {
      try {
        await write();
      } catch (e) {
        // The couple deleted the file (or it is no longer ours): make a new one, keep going.
        if (!(e instanceof GoogleError) || (e.status !== 404 && e.status !== 403)) throw e;
        const made = await createSpreadsheet(token, tableTitle(content), (content as { timezone?: string }).timezone ?? 'UTC');
        ({ id, url } = made);
        await write();
      }
    }
    const at = now().toISOString();
    await adapter.updateSiteDoc<SheetsDoc>(siteId, DOC, (cur) => (cur?.token ? { ...cur, spreadsheetId: id, spreadsheetUrl: url, lastSyncAt: at, lastError: null } : cur));
  } catch (e) {
    const err = syncErrorMessage(e);
    console.error(`[google] sync ${site.slug}: ${err.code}`);
    const at = now().toISOString();
    await adapter.updateSiteDoc<SheetsDoc>(siteId, DOC, (cur) => (cur?.token ? { ...cur, lastError: { at, ...err } } : cur));
  }
}

/**
 * Brings the site's spreadsheet up to date (no-op when not connected or not set up). Never throws: a failure is stored
 * (the panel shows "Sync failed — Sync now"). Resolves when this request's data is written.
 */
export function syncSheet(adapter: DataAdapter, siteId: string, at?: Date): Promise<void> {
  const cfg = googleConfig();
  if (!cfg) return Promise.resolve();
  const now = () => at ?? new Date();
  const current = running.get(siteId);
  if (current) {
    again.add(siteId);
    return current;
  }
  const run = (async () => {
    try {
      do {
        again.delete(siteId);
        await syncOnce(adapter, siteId, cfg, now);
      } while (again.has(siteId));
    } catch (e) {
      console.error(`[google] sync ${siteId}: ${e instanceof Error ? e.name : 'error'}`);
    } finally {
      running.delete(siteId);
    }
  })();
  running.set(siteId, run);
  return run;
}

/**
 * Schedules a sync after the response: routes pass Next's after() (the guest / couple never waits for Google; this
 * module stays free of Next imports so node:test can load it). Without it (scripts, tests) it simply starts it. Cheap when the site is not connected (one small read).
 */
export function scheduleSheetSync(adapter: DataAdapter, siteId: string, after?: (task: () => Promise<void>) => void): void {
  if (!googleConfig()) return;
  const task = () => syncSheet(adapter, siteId);
  try {
    if (!after) throw new Error('no after()');
    after(task);
  } catch {
    void task(); // not inside a request
  }
}
