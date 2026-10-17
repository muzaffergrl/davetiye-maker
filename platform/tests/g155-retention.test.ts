// G155 (K48): retention and privacy requests in the shop admin.
//   (5) a website archived (offline) for more than 12 months is a "Yapılacaklar" item with "Sil", pointing at the site
//       page's existing delete block; one archived more recently is not;
//   (4) a deletion request: the admin finds the site by its order number and deletes it with the existing delete action
//       (site, photos, guest replies gone; the order number is free again).
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as actionPost } from '../app/api/admin/sites/[id]/[action]/route.ts';
import { adminList } from '../lib/admin/api.ts';
import { adminDashboard, filterSites, retentionDates, retentionDue, RETENTION_AFTER_ARCHIVE_MONTHS, type AdminSiteSummary } from '../lib/admin/view.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, publishSite, setArchiveOverride } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';
let dataDir = '';

before(() => {
  const themes = tmpDir('g155-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  dataDir = tmpDir('g155-data-');
  process.env.PLATFORM_DATA_DIR = dataDir;
  delete process.env.PLATFORM_PUBLIC_URL;
});

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
  setClaimRateLimiter(new MemoryRateLimiter());
});

function fake(over: Partial<AdminSiteSummary>): AdminSiteSummary {
  return {
    id: over.slug ?? 'x', slug: 'x', theme: '_sample', themeName: 'Sample', names: 'A & B', orderRef: '1234567890', ownerEmail: 'a@example.com',
    state: 'published', order: 'not_required', orderNote: null, orderCheckedAt: null, createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2025-01-10T09:00:00.000Z', publishedAt: '2025-01-11T09:00:00.000Z', firstPublishedAt: '2025-01-11T09:00:00.000Z',
    weddingDate: '2025-06-12', onlineUntil: null, archiveSource: 'wedding_date', replies: 0, changes: null, guestPassword: false,
    unpublishedChanges: false, needsAction: false, note: null, noteAt: null, place: null, madeByShop: false, shopEditUntil: null, ...over,
  };
}

test('K48 retention dates: archive day = the day after "Online until"; delete from 12 months later (month end clamped)', () => {
  assert.equal(RETENTION_AFTER_ARCHIVE_MONTHS, 12);
  assert.deepEqual(retentionDates({ state: 'archived', onlineUntil: '2025-09-30' }), { archivedOn: '2025-10-01', deleteFrom: '2026-10-01' });
  assert.deepEqual(retentionDates({ state: 'archived', onlineUntil: '2028-02-28' }), { archivedOn: '2028-02-29', deleteFrom: '2029-02-28' });
  assert.deepEqual(retentionDates({ state: 'archived', onlineUntil: '2026-12-31' }), { archivedOn: '2027-01-01', deleteFrom: '2028-01-01' });
  assert.equal(retentionDates({ state: 'published', onlineUntil: '2025-09-30' }), null, 'online: no retention');
  assert.equal(retentionDates({ state: 'draft', onlineUntil: null }), null, 'never published: no retention');
  assert.equal(retentionDates({ state: 'archived', onlineUntil: null }), null);
  assert.equal(retentionDue({ state: 'archived', onlineUntil: '2025-09-30' }, '2026-09-30'), false);
  assert.equal(retentionDue({ state: 'archived', onlineUntil: '2025-09-30' }, '2026-10-01'), true);
});

test('K48 to-do: archived for more than 12 months → "retention" (once per site); a recent archive and live sites are not', () => {
  const now = new Date('2026-10-17T12:00:00.000Z');
  const list = [
    fake({ slug: 'old', state: 'archived', onlineUntil: '2025-09-30' }),
    fake({ slug: 'edge', state: 'archived', onlineUntil: '2025-10-16' }),
    fake({ slug: 'recent', state: 'archived', onlineUntil: '2025-10-17' }),
    fake({ slug: 'live', state: 'published', onlineUntil: '2027-06-12' }),
    fake({ slug: 'draft', state: 'draft', publishedAt: null, firstPublishedAt: null, onlineUntil: null, createdAt: '2024-01-01T00:00:00.000Z' }),
  ];
  const todos = adminDashboard(list, now).todos.filter((t) => t.kind === 'retention');
  assert.deepEqual(todos.map((t) => t.site.slug), ['old', 'edge']);
  assert.match(todos[0].text, /2025-10-01 tarihinden beri arşivde \(12 aydan uzun\)/);
});

test('admin pages: the retention to-do says "Sil" and opens the site page at its delete block; privacy help on the overview', () => {
  const page = readFileSync(path.join(PLATFORM_ROOT, 'app/admin/page.tsx'), 'utf8');
  assert.match(page, /retention: 'Sil'/);
  assert.match(page, /t\.kind === 'retention' \? '#delete' : ''/);
  assert.match(page, /data-privacy-help/);
  const site = readFileSync(path.join(PLATFORM_ROOT, 'components/admin/AdminSite.tsx'), 'utf8');
  assert.match(site, /data-delete="" id="delete"/);
  assert.match(site, /data-retention=/);
});

function req(url: string, init: { method?: string; json?: unknown; cookie?: string | null } = {}): Request {
  const headers = new Headers({ host: 'localhost:3000', origin: BASE });
  if (init.json !== undefined) headers.set('content-type', 'application/json');
  if (init.cookie) headers.set('cookie', init.cookie);
  return new Request(`${BASE}${url}`, { method: init.method ?? 'GET', headers, body: init.json !== undefined ? JSON.stringify(init.json) : undefined });
}

async function signIn(): Promise<string> {
  const res = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD } }));
  assert.equal(res.status, 200);
  return (res.headers.get('set-cookie') ?? '').split(';')[0];
}

const PNG_1PX = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

test('real sites: an archive 12+ months old is listed; the privacy flow finds the site by order number and deletes everything', async () => {
  const adapter = getDataAdapter();
  const make = async (slug: string, order: string, archiveOn: string) => {
    const { site } = await createSiteWithKeys(adapter, { slug, theme: '_sample', content: demoContent(), orderRef: order, ownerEmail: `${slug}@example.com` });
    await publishSite(adapter, site.id);
    await setArchiveOverride(adapter, site.id, archiveOn, 'test');
    return site;
  };
  const today = new Date();
  const day = (offset: number) => new Date(today.getTime() + offset * 86_400_000).toISOString().slice(0, 10);
  const old = await make('g155-old-archive', '4155000001', day(-400));
  const recent = await make('g155-recent-archive', '4155000002', day(-30));
  // a photo and a guest reply on the old one
  const photo = await adapter.savePhoto(old.id, { bytes: new Uint8Array(PNG_1PX) });
  await adapter.saveRsvp(old.id, { name: 'Guest One', attending: true, guests: 1 } as never);
  assert.equal((await adapter.listRsvps(old.id)).length, 1);

  const { sites } = await adminList(adapter);
  const byslug = Object.fromEntries(sites.map((s) => [s.slug, s]));
  assert.equal(byslug['g155-old-archive'].state, 'archived');
  assert.equal(byslug['g155-recent-archive'].state, 'archived');
  const todos = adminDashboard(sites).todos.filter((t) => t.kind === 'retention').map((t) => t.site.slug);
  assert.deepEqual(todos, ['g155-old-archive']);

  // privacy request: the order number (as the buyer writes it, with "#") finds exactly that site
  const found = filterSites(sites, 'all', '#4155000001');
  assert.deepEqual(found.map((s) => s.id), [old.id]);
  const cookie = await signIn();
  const act = (id: string, action: string, json: unknown) => actionPost(req(`/api/admin/sites/${id}/${action}`, { method: 'POST', json, cookie }), { params: Promise.resolve({ id, action }) });
  assert.equal(existsSync(path.join(dataDir, 'uploads', old.id)), true);
  assert.equal((await act(old.id, 'delete', { confirm: 'wrong' })).status, 400, 'the address must be typed');
  const del = await act(old.id, 'delete', { confirm: old.slug });
  assert.equal(del.status, 200);
  assert.equal(((await del.json()) as { deleted?: boolean }).deleted, true);
  assert.equal(await adapter.getSiteById(old.id), null);
  assert.equal(await adapter.getSiteBySlug(old.slug), null);
  assert.deepEqual(await adapter.findSitesByOrderRef('4155000001'), [], 'the order number is free again');
  assert.deepEqual(await adapter.listRsvps(old.id), [], 'guest replies deleted');
  assert.equal(existsSync(path.join(dataDir, 'uploads', old.id)), false, 'photos deleted');
  assert.ok(photo.url.includes(old.id));
  // the other site is untouched and no longer has a retention to-do anywhere
  assert.ok(await adapter.getSiteById(recent.id));
  const after = await adminList(adapter);
  assert.deepEqual(adminDashboard(after.sites).todos.filter((t) => t.kind === 'retention'), []);
});
