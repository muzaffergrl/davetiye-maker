// Shop admin API (G087): sign in/out and the support actions that used to need a terminal and the Blob token
// (scripts/verify-order.ts, reissue-edit-key.ts, grant-identity-change.ts). Every action goes through the same
// lib/sites.ts functions the scripts use, so the rules (and their tests) stay in one place.

import { getClaimRateLimiter } from '../claim/limits.ts';
import { getDataAdapter, type DataAdapter, type SiteRecord } from '../data/index.ts';
import { BodyTooLargeError, fail, json, readLimitedBytes, requestOrigin } from '../panel/http.ts';
import { clientIp } from '../rsvp/http.ts';
import { ipBucket } from '../rsvp/rate-limit.ts';
import { panelPreviewToken } from '../keys.ts';
import { normalizeEmail } from '../claim/fields.ts';
import { rsvpCsvForSite, rsvpSummary, type RsvpCounts, type RsvpEntry } from '../rsvp/couple.ts';
import { confirmOrder, endShopEditKey, grantIdentityChanges, holdOrder, issueShopEditKey, publishSite, reissueKeys, setArchiveOverride, unpublishSite } from '../sites.ts';
import { listDevices, signOutOtherDevices } from '../device-keys.ts';
import { adminCreateSite } from './create.ts';
import { messageTemplate, withMessageLog } from './messages.ts';
import {
  adminConfig,
  clearedSessionCookie,
  isAdminRequest,
  newSessionToken,
  passwordMatches,
  sessionCookie,
} from './auth.ts';
import { countSites, ordersCsv, siteHistory, summarizeSite, type AdminCounts, type AdminHistoryEntry, type AdminSiteSummary } from './summary.ts';

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
    // G172: an IPv6 address counts as its /64 (one connection owns a whole /64), like every other per-address limit
    limiter.hit(`admin-login:${ipBucket(clientIp(req))}`, ADMIN_LOGIN_LIMITS.perIp),
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

/** What the site holds now (the draft), for the shop's overview. Read-only; the buyer edits in the panel. */
export interface AdminContentView {
  date: string | null;
  time: string | null;
  timezone: string | null;
  venue: string | null;
  address: string | null;
  schedule: Array<{ label: string; time: string }>;
  rsvpDeadline: string | null;
  dressCode: string | null;
  photos: number;
  storyItems: number;
  faq: number;
}

export interface AdminRsvpView {
  counts: RsvpCounts;
  /** Newest first. */
  responses: RsvpEntry[];
}

export interface AdminSiteDetail {
  summary: AdminSiteSummary;
  history: AdminHistoryEntry[];
  content: AdminContentView;
  rsvp: AdminRsvpView;
  /** "/<slug>?preview=<short-lived token>": the draft as the buyer's panel shows it (12 h, never stored). */
  previewPath: string;
  /** G152: devices signed in with the order number + email (G146 device keys; labels and dates only, newest first). */
  devices: AdminDeviceView[];
  /** G951: every website of this site's Etsy order (this one included), by design unit; empty without an order number. */
  orderSites: AdminOrderSite[];
}

/** G951: one website of an Etsy order, as the order's list in the admin shows it. */
export interface AdminOrderSite {
  id: string;
  slug: string;
  themeName: string;
  names: string;
  ownerEmail: string | null;
  state: AdminSiteSummary['state'];
  order: AdminSiteSummary['order'];
  /** 1 = the order's first website. */
  slot: number;
  /** The site of the page it is shown on. */
  current: boolean;
}

export interface AdminDeviceView {
  label: string;
  createdAt: string;
  via: 'continue' | 'start' | 'email';
}

function contentView(site: SiteRecord): AdminContentView {
  const c = site.content as unknown as Record<string, any>;
  const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  const venue = c?.venue ?? {};
  const media = c?.media ?? {};
  let photos = 0;
  const walk = (v: unknown) => {
    if (typeof v === 'string' && v) photos++;
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(media);
  const storyItems = Array.isArray(c?.story?.items) ? c.story.items.length : Array.isArray(c?.story?.moments) ? c.story.moments.length : 0;
  return {
    date: s(c?.date),
    time: s(c?.ceremony_time),
    timezone: s(c?.timezone),
    venue: [s(venue.name), s(venue.city), s(venue.region), s(venue.country)].filter(Boolean).join(', ') || null,
    address: s(venue.address),
    schedule: (Array.isArray(c?.schedule) ? c.schedule : []).map((i: any) => ({ label: String(i?.label ?? ''), time: String(i?.time ?? '') })),
    rsvpDeadline: s(c?.rsvp?.deadline),
    dressCode: s(c?.dress_code),
    photos,
    storyItems,
    faq: Array.isArray(c?.faq) ? c.faq.length : 0,
  };
}

export async function adminSite(id: string, adapter: DataAdapter = getDataAdapter(), now: Date = new Date()): Promise<AdminSiteDetail | null> {
  const site = await adapter.getSiteById(id);
  if (!site) return null;
  return detailOf(site, adapter, now);
}

async function detailOf(site: SiteRecord, adapter: DataAdapter, now: Date = new Date()): Promise<AdminSiteDetail> {
  const rsvp = await rsvpSummary(adapter, site, now);
  return {
    summary: summarizeSite(site, rsvp.counts.responses + rsvp.counts.held, now),
    history: siteHistory(site),
    content: contentView(site),
    rsvp: { counts: rsvp.counts, responses: rsvp.responses },
    previewPath: `/${site.slug}?preview=${encodeURIComponent(panelPreviewToken(site.id, site.previewKeyHash, now.getTime()))}`,
    devices: (await listDevices(adapter, site)).map(({ label, createdAt, via }) => ({ label, createdAt, via })),
    orderSites: site.orderRef ? orderSitesOf(await adapter.findSitesByOrderRef(site.orderRef), site.id, now) : [],
  };
}

/** G951: the order's websites for the admin (pure). */
export function orderSitesOf(sites: readonly SiteRecord[], currentId: string, now: Date = new Date()): AdminOrderSite[] {
  return sites
    .map((x) => {
      const sum = summarizeSite(x, 0, now);
      return { id: x.id, slug: x.slug, themeName: sum.themeName, names: sum.names, ownerEmail: x.ownerEmail, state: sum.state, order: sum.order, slot: x.orderSlot ?? 1, current: x.id === currentId };
    })
    .sort((a, b) => a.slot - b.slot || a.slug.localeCompare(b.slug));
}

/** POST /api/admin/sites — the shop starts a website for a buyer ("Yeni sipariş"). */
export async function createRoute(req: Request): Promise<Response> {
  const denied = adminGuard(req, { write: true });
  if (denied) return denied;
  const body = await readJsonBody(req);
  if (body instanceof Response) return body;
  const result = await adminCreateSite(getDataAdapter(), requestOrigin(req), body);
  return json(result.ok ? 201 : 400, result as unknown as Record<string, unknown>);
}

function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}

/** GET /api/admin/export — every order as CSV. */
export async function exportRoute(req: Request): Promise<Response> {
  const denied = adminGuard(req);
  if (denied) return denied;
  const { sites } = await adminList();
  return csvResponse(ordersCsv(sites, requestOrigin(req)), `siparisler-${new Date().toISOString().slice(0, 10)}.csv`);
}

/** GET /api/admin/sites/<id>/rsvps — the site's replies as CSV (same file the couple downloads). */
export async function rsvpCsvRoute(req: Request, id: string): Promise<Response> {
  const denied = adminGuard(req);
  if (denied) return denied;
  const adapter = getDataAdapter();
  const site = await adapter.getSiteById(id);
  if (!site) return fail(404, 'not_found', 'This website does not exist (any more).');
  const { csv, filename } = await rsvpCsvForSite(adapter, site);
  return csvResponse(csv, filename);
}

export async function listRoute(req: Request): Promise<Response> {
  const denied = adminGuard(req);
  if (denied) return denied;
  return json(200, { ok: true, ...(await adminList()) });
}

// --- actions --------------------------------------------------------------------------------------------------

export const ADMIN_ACTIONS = ['confirm', 'hold', 'reissue', 'shop-edit', 'shop-edit-end', 'devices-signout', 'grant', 'archive', 'unpublish', 'publish', 'note', 'email', 'message-log', 'rsvp-delete', 'delete'] as const;
export type AdminAction = (typeof ADMIN_ACTIONS)[number];

/** Turkish words for the errors lib/sites.ts throws (the admin speaks Turkish). */
function actionError(e: unknown): string {
  const name = e instanceof Error ? e.name : '';
  const message = e instanceof Error ? e.message : String(e);
  if (name === 'OrderPendingError') return 'Sipariş henüz onaylanmadı; önce siparişi onaylayın.';
  if (name === 'SiteArchivedError') return 'Site arşivde; önce yayında kalma süresini uzatın.';
  if (name === 'IdentityMismatchError') return 'İsim/tarih değişikliği hakkı kalmadı; alıcının taslağındaki isim/tarih yayınlanandan farklı. Önce hak ekleyin.';
  if (name === 'ContentInvalidError') {
    // G145: say which fields (the panel's own words, English; the shop fixes them with "Linki değiştirmeden düzenle").
    const issues = (e as { issues?: Array<{ path: string; message: string }> }).issues ?? [];
    const list = issues.slice(0, 3).map((i) => `${i.path}: ${i.message}`).join(' · ');
    const more = issues.length > 3 ? ` (+${issues.length - 3})` : '';
    return `Taslakta eksik ya da hatalı alan var; yayınlanamadı.${list ? ` ${list}${more}` : ''}`;
  }
  if (name === 'StaleSiteError' || name === 'WriteConflictError') return 'Site tam o sırada değişti; tekrar deneyin.';
  return message.replace(/^--add/, 'The number');
}

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
        // No note typed: a neutral line (it must not claim what was checked).
        const note = text(body.note) || 'Dükkân onayladı';
        updated = await confirmOrder(adapter, site.id, note);
        break;
      }
      case 'hold': {
        // Trust mode: the shop found the order does not check out — offline + pending until "Siparişi onayla".
        if (site.orderCheck?.status !== 'provisional') return fail(409, 'not_provisional', 'Bu sitenin siparişi "önce güven" ile açılmadı ya da zaten karara bağlandı.');
        updated = await holdOrder(adapter, site.id, { by: 'support', note: text(body.note) || 'Dükkân beklemeye aldı' });
        break;
      }
      case 'reissue': {
        const created = await reissueKeys(adapter, site.id);
        updated = created.site;
        // Shown once in the admin; never stored or logged.
        extra = { editUrl: `${requestOrigin(req)}/edit/${created.site.slug}?k=${encodeURIComponent(created.editKey)}` };
        break;
      }
      case 'shop-edit': {
        // G145 (docs/23 §3): the shop edits with its own 72-hour link; the buyer's link keeps working. Shown once.
        const created = await issueShopEditKey(adapter, site.id);
        updated = created.site;
        extra = { shopEditUrl: `${requestOrigin(req)}/edit/${created.site.slug}?k=${encodeURIComponent(created.editKey)}#home` };
        break;
      }
      case 'shop-edit-end': {
        updated = await endShopEditKey(adapter, site.id);
        break;
      }
      case 'devices-signout': {
        // G152: every device signed in with the order number + email is signed out; the buyer's private edit link and the
        // shop's own link stay. The buyer can sign in again on /my.
        extra = { removed: await signOutOtherDevices(adapter, site, null) };
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
      case 'publish': {
        if (site.status === 'published' && site.publishedContent && JSON.stringify(site.content) === JSON.stringify(site.publishedContent)) {
          return fail(409, 'already_published', 'Site zaten yayında ve yayınlanmamış değişiklik yok.');
        }
        updated = await publishSite(adapter, site.id);
        break;
      }
      case 'note': {
        const note = text(body.note, 2000);
        updated = await adapter.patchSite(site.id, { adminNote: note ? { text: note, at: new Date().toISOString() } : null });
        break;
      }
      case 'message-log': {
        // G121 (docs/19 §6 A1): "Mesajı kopyala" leaves a line in the site's history — the template and the time, not the text.
        const id = text(body.template, 64);
        if (!messageTemplate(id)) return fail(400, 'bad_template', 'Bilinmeyen şablon.');
        updated = await adapter.patchSite(site.id, { messageLog: withMessageLog(site.messageLog, id, new Date().toISOString()) });
        break;
      }
      case 'email': {
        const email = normalizeEmail(text(body.email, 260));
        if (!email) return fail(400, 'bad_email', 'Geçerli bir e-posta yazın.');
        updated = await adapter.patchSite(site.id, { ownerEmail: email });
        break;
      }
      case 'rsvp-delete': {
        const ids = Array.isArray(body.ids) ? body.ids.filter((x): x is string => typeof x === 'string').slice(0, 1000) : [];
        if (!ids.length) return fail(400, 'no_ids', 'Silinecek yanıt seçin.');
        await adapter.deleteRsvps(site.id, ids);
        break;
      }
      case 'delete': {
        if (text(body.confirm, 64).toLowerCase() !== site.slug) return fail(400, 'confirm_mismatch', 'Type the website address exactly to delete it.');
        await adapter.deleteSite(site.id);
        return json(200, { ok: true, deleted: true });
      }
    }
    const fresh = (await adapter.getSiteById(updated.id)) ?? updated;
    return json(200, { ok: true, ...(await detailOf(fresh, adapter)), ...extra });
  } catch (e) {
    return fail(409, 'not_possible', actionError(e));
  }
}
