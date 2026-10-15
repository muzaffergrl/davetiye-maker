// Shop admin API (G087): sign in/out and the support actions that used to need a terminal and the Blob token
// (scripts/verify-order.ts, reissue-edit-key.ts, grant-identity-change.ts). Every action goes through the same
// lib/sites.ts functions the scripts use, so the rules (and their tests) stay in one place.

import { getClaimRateLimiter } from '../claim/limits.ts';
import { getDataAdapter, type DataAdapter, type SiteRecord } from '../data/index.ts';
import { BodyTooLargeError, fail, json, readLimitedBytes, requestOrigin } from '../panel/http.ts';
import { clientIp } from '../rsvp/http.ts';
import { confirmOrder, grantIdentityChanges, reissueKeys, setArchiveOverride, unpublishSite } from '../sites.ts';
import {
  adminConfig,
  clearedSessionCookie,
  isAdminRequest,
  newSessionToken,
  passwordMatches,
  sessionCookie,
} from './auth.ts';
import { countSites, siteHistory, summarizeSite, type AdminCounts, type AdminHistoryEntry, type AdminSiteSummary } from './summary.ts';

const MINUTE = 60_000;
/** Wrong or right, every sign-in attempt counts: 8 per 15 minutes per address, 40 per hour in total. */
export const ADMIN_LOGIN_LIMITS = {
  perIp: { limit: 8, windowMs: 15 * MINUTE },
  global: { limit: 40, windowMs: 60 * MINUTE },
};
const MAX_BODY = 8 * 1024;

function isSecure(req: Request): boolean {
  const proto = (req.headers.get('x-forwarded-proto') ?? '').split(',').pop()?.trim().toLowerCase();
  return proto === 'https' || new URL(req.url).protocol === 'https:';
}

/**
 * Writes must come from this site's own pages: Origin's host must be the host the request was sent to. (The session
 * cookie is SameSite=Strict, so a cross-site request carries no session anyway — this is the second lock.)
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  let host: string;
  try {
    host = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  const hosts = new Set<string>([new URL(req.url).host.toLowerCase()]);
  const h = req.headers.get('host');
  if (h) hosts.add(h.trim().toLowerCase());
  const xfh = (req.headers.get('x-forwarded-host') ?? '').split(',').pop()?.trim().toLowerCase();
  if (xfh) hosts.add(xfh);
  return hosts.has(host);
}

async function readJsonBody(req: Request): Promise<Record<string, unknown> | Response> {
  try {
    const bytes = await readLimitedBytes(req, MAX_BODY);
    if (!bytes.length) return {};
    const value = JSON.parse(Buffer.from(bytes).toString('utf8'));
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : fail(400, 'bad_request', 'Expected a JSON object.');
  } catch (e) {
    if (e instanceof BodyTooLargeError) return fail(413, 'too_large', 'Request too large.');
    return fail(400, 'bad_request', 'Expected a JSON object.');
  }
}

/** null = signed in; otherwise the error answer. */
export function adminGuard(req: Request, opts: { write?: boolean } = {}): Response | null {
  const cfg = adminConfig();
  if (cfg.state !== 'on') return fail(404, 'admin_off', 'The shop admin is not switched on.');
  if (opts.write && !sameOrigin(req)) return fail(403, 'bad_origin', 'Request refused.');
  if (!isAdminRequest(req.headers.get('cookie'))) return fail(401, 'signed_out', 'Please sign in again.');
  return null;
}

export async function signIn(req: Request): Promise<Response> {
  const cfg = adminConfig();
  if (cfg.state !== 'on') return fail(404, 'admin_off', 'The shop admin is not switched on.');
  if (!sameOrigin(req)) return fail(403, 'bad_origin', 'Request refused.');
  const limiter = getClaimRateLimiter();
  const [perIp, global] = await Promise.all([
    limiter.hit(`admin-login:${clientIp(req)}`, ADMIN_LOGIN_LIMITS.perIp),
    limiter.hit('admin-login:*', ADMIN_LOGIN_LIMITS.global),
  ]);
  if (!perIp.allowed || !global.allowed) {
    const wait = Math.max(perIp.retryAfterMs, global.retryAfterMs);
    return fail(429, 'too_many', 'Too many attempts. Please wait a few minutes and try again.', { retryAfterSeconds: Math.ceil(wait / 1000) });
  }
  const body = await readJsonBody(req);
  if (body instanceof Response) return body;
  if (!passwordMatches(body.password, cfg.password)) return fail(401, 'wrong_password', 'That password is not right.');
  const { token, expires } = newSessionToken(cfg.password);
  return json(200, { ok: true }, { 'Set-Cookie': sessionCookie(token, expires, isSecure(req)) });
}

export function signOut(req: Request): Response {
  return json(200, { ok: true }, { 'Set-Cookie': clearedSessionCookie(isSecure(req)) });
}

// --- reads (server pages + GET) ---------------------------------------------------------------------------------

export async function adminList(adapter: DataAdapter = getDataAdapter(), now: Date = new Date()): Promise<{ sites: AdminSiteSummary[]; counts: AdminCounts }> {
  const [sites, replies] = await Promise.all([adapter.listSites(), adapter.rsvpCounts()]);
  const list = sites.map((s) => summarizeSite(s, replies[s.id] ?? 0, now));
  return { sites: list, counts: countSites(list) };
}

export interface AdminSiteDetail {
  summary: AdminSiteSummary;
  history: AdminHistoryEntry[];
}

export async function adminSite(id: string, adapter: DataAdapter = getDataAdapter(), now: Date = new Date()): Promise<AdminSiteDetail | null> {
  const site = await adapter.getSiteById(id);
  if (!site) return null;
  const replies = (await adapter.listRsvps(site.id)).length;
  return { summary: summarizeSite(site, replies, now), history: siteHistory(site) };
}

export async function listRoute(req: Request): Promise<Response> {
  const denied = adminGuard(req);
  if (denied) return denied;
  return json(200, { ok: true, ...(await adminList()) });
}

// --- actions --------------------------------------------------------------------------------------------------

export const ADMIN_ACTIONS = ['confirm', 'reissue', 'grant', 'archive', 'unpublish', 'delete'] as const;
export type AdminAction = (typeof ADMIN_ACTIONS)[number];

function text(value: unknown, max = 300): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function siteAction(req: Request, id: string, action: string): Promise<Response> {
  const denied = adminGuard(req, { write: true });
  if (denied) return denied;
  if (!(ADMIN_ACTIONS as readonly string[]).includes(action)) return fail(404, 'not_found', 'Unknown action.');
  const body = await readJsonBody(req);
  if (body instanceof Response) return body;
  const adapter = getDataAdapter();
  const site = await adapter.getSiteById(id);
  if (!site) return fail(404, 'not_found', 'This website does not exist (any more).');
  try {
    let updated: SiteRecord = site;
    let extra: Record<string, unknown> = {};
    switch (action as AdminAction) {
      case 'confirm': {
        const note = text(body.note) || 'Checked in Etsy';
        updated = await confirmOrder(adapter, site.id, note);
        break;
      }
      case 'reissue': {
        const created = await reissueKeys(adapter, site.id);
        updated = created.site;
        // Shown once in the admin; never stored or logged.
        extra = { editUrl: `${requestOrigin(req)}/edit/${created.site.slug}?k=${encodeURIComponent(created.editKey)}` };
        break;
      }
      case 'grant': {
        const add = Number(body.add);
        const reason = text(body.reason);
        if (!reason) return fail(400, 'reason_needed', 'Write a short reason (it is kept with the website).');
        updated = await grantIdentityChanges(adapter, site.id, add, reason);
        break;
      }
      case 'archive': {
        const day = body.day === null || body.day === '' ? null : text(body.day, 10);
        const reason = text(body.reason);
        if (!reason) return fail(400, 'reason_needed', 'Write a short reason (it is kept with the website).');
        if (day !== null && !/^\d{4}-\d{2}-\d{2}$/.test(day)) return fail(400, 'bad_date', 'Pick a date.');
        updated = await setArchiveOverride(adapter, site.id, day, reason);
        break;
      }
      case 'unpublish': {
        if (site.status !== 'published') return fail(409, 'not_published', 'This website is not published.');
        updated = await unpublishSite(adapter, site.id);
        break;
      }
      case 'delete': {
        if (text(body.confirm, 64).toLowerCase() !== site.slug) return fail(400, 'confirm_mismatch', 'Type the website address exactly to delete it.');
        await adapter.deleteSite(site.id);
        return json(200, { ok: true, deleted: true });
      }
    }
    const replies = (await adapter.listRsvps(updated.id)).length;
    return json(200, { ok: true, summary: summarizeSite(updated, replies), history: siteHistory(updated), ...extra });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return fail(409, 'not_possible', message.replace(/^--add/, 'The number'));
  }
}
