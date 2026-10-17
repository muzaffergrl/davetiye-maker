// Shop admin v2 (G095): overview numbers, customers, designs, the orders CSV, "Yeni sipariş" (the shop starts a
// website), and the new site actions (note, email, publish for the buyer, delete replies) through the real routes.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import path from 'node:path';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as sitesPost } from '../app/api/admin/sites/route.ts';
import { GET as exportGet } from '../app/api/admin/export/route.ts';
import { GET as rsvpCsvGet } from '../app/api/admin/sites/[id]/rsvps/route.ts';
import { POST as actionPost } from '../app/api/admin/sites/[id]/[action]/route.ts';
import { adminSite } from '../lib/admin/api.ts';
import { messageTemplate, renderMessage } from '../lib/admin/messages.ts';
import { adminCustomers, adminDashboard, adminDesigns, filterCustomers, ordersCsv, sortSites, summarizeSite, type AdminSiteSummary } from '../lib/admin/summary.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { panelState } from '../lib/panel/state.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { canEdit, createSiteWithKeys } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';

before(() => {
  const themes = tmpDir('g094a-themes-');
  for (const t of ['_sample', 'blush-garden-rose']) cpSync(path.join(PLATFORM_ROOT, 'themes', t), path.join(themes, t), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g094a-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
  setClaimRateLimiter(new MemoryRateLimiter());
});

function req(url: string, init: { method?: string; json?: unknown; cookie?: string | null; origin?: string | null } = {}): Request {
  const headers = new Headers({ host: 'localhost:3000' });
  if (init.json !== undefined) headers.set('content-type', 'application/json');
  if (init.cookie) headers.set('cookie', init.cookie);
  if (init.origin !== null) headers.set('origin', init.origin ?? BASE);
  return new Request(`${BASE}${url}`, { method: init.method ?? 'GET', headers, body: init.json !== undefined ? JSON.stringify(init.json) : undefined });
}

async function signIn(): Promise<string> {
  const res = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD } }));
  assert.equal(res.status, 200);
  return (res.headers.get('set-cookie') ?? '').split(';')[0];
}

function act(id: string, action: string, cookie: string, json: unknown = {}) {
  return actionPost(req(`/api/admin/sites/${id}/${action}`, { method: 'POST', json, cookie }), { params: Promise.resolve({ id, action }) });
}

function fake(over: Partial<AdminSiteSummary>): AdminSiteSummary {
  return {
    id: over.slug ?? 'x',
    slug: 'x',
    theme: 'blush-garden-rose',
    themeName: 'Blush Garden Rose',
    names: 'A & B',
    orderRef: '1234567890',
    ownerEmail: 'a@example.com',
    state: 'draft',
    order: 'not_required',
    orderNote: null,
    orderCheckedAt: null,
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-10-15T09:00:00.000Z',
    publishedAt: null,
    firstPublishedAt: null,
    weddingDate: '2027-06-12',
    onlineUntil: null,
    archiveSource: null,
    replies: 0,
    changes: null,
    guestPassword: false,
    unpublishedChanges: false,
    needsAction: false,
    note: null,
    noteAt: null,
    place: null,
    madeByShop: false,
    shopEditUntil: null,
    ...over,
  };
}

test('overview: sales today/7/30/month, weekly bars, best sellers, to-dos, upcoming weddings, customers', () => {
  const now = new Date('2026-10-15T12:00:00.000Z');
  const list = [
    fake({ slug: 'a', createdAt: '2026-10-15T08:00:00.000Z', needsAction: true, order: 'pending' }),
    fake({ slug: 'b', createdAt: '2026-10-10T08:00:00.000Z', theme: 'olive-ivory', themeName: 'Olive & Ivory', ownerEmail: 'b@example.com' }),
    fake({ slug: 'c', createdAt: '2026-09-01T08:00:00.000Z', state: 'published', firstPublishedAt: '2026-09-02T08:00:00.000Z', onlineUntil: '2026-11-01', weddingDate: '2026-11-20', ownerEmail: 'A@example.com' }),
    fake({ slug: 'demo', orderRef: null, ownerEmail: null, createdAt: '2026-10-14T08:00:00.000Z' }),
  ];
  const d = adminDashboard(list, now);
  assert.deepEqual(d.sales, { total: 3, today: 1, last7: 2, last30: 2, thisMonth: 2 }, 'a demo without an order number is not a sale');
  assert.equal(d.weeks.length, 8);
  assert.equal(d.weeks.at(-1)!.count, 1, 'this week (from Monday Oct 12): a');
  assert.equal(d.weeks.at(-2)!.count, 1, 'last week: b (Oct 10)');
  assert.deepEqual(d.byDesign.map((b) => [b.theme, b.count]), [['blush-garden-rose', 2], ['olive-ivory', 1]]);
  assert.deepEqual(
    d.todos.map((t) => [t.kind, t.site.slug]),
    [['confirm', 'a'], ['not_published', 'b'], ['closing', 'c']],
  );
  assert.deepEqual(d.upcoming.map((s) => s.slug), ['c']);
  assert.equal(d.customers, 2, 'emails are grouped case-insensitively; no email, no customer');

  const customers = adminCustomers(list);
  const a = customers.find((c) => c.email === 'a@example.com')!;
  assert.equal(a.sites.length, 2);
  assert.equal(a.needsAction, true);
  assert.equal(filterCustomers(customers, 'olive').length, 1);

  const designs = adminDesigns(list, [
    { id: 'olive-ivory', name: 'Olive & Ivory', live: true },
    { id: 'ivory-lace-pearls', name: 'Ivory Lace & Pearls', live: true },
  ]);
  assert.deepEqual(designs.map((r) => [r.id, r.live, r.sales]), [['olive-ivory', true, 1], ['ivory-lace-pearls', true, 0], ['blush-garden-rose', false, 2]]);

  assert.deepEqual(sortSites(list, 'wedding').map((s) => s.slug).slice(0, 1), ['c']);
});

test('orders CSV: header, one row per site, spreadsheet formulas neutralised', () => {
  const csv = ordersCsv([fake({ slug: 'a', names: '=HYPERLINK("x")', note: 'Ödendi, "acil"' })], 'https://example.com');
  assert.ok(csv.startsWith('﻿Sipariş no,'));
  assert.match(csv, /"'=HYPERLINK\(""x""\)"/);
  assert.match(csv, /https:\/\/example\.com\/a/);
  assert.match(csv, /"Ödendi, ""acil"""/);
});

test('Yeni sipariş: the shop starts a website (order confirmed, edit link once); same order twice is refused', async () => {
  const cookie = await signIn();
  const bad = await sitesPost(req('/api/admin/sites', { method: 'POST', cookie, json: { theme: '', orderNumber: '12', email: 'x', name1: '' } }));
  assert.equal(bad.status, 400);
  const badBody = await bad.json();
  assert.deepEqual(Object.keys(badBody.fields).sort(), ['email', 'name1', 'name2', 'orderNumber', 'theme']);

  const noSession = await sitesPost(req('/api/admin/sites', { method: 'POST', json: {} }));
  assert.equal(noSession.status, 401);
  const foreign = await sitesPost(req('/api/admin/sites', { method: 'POST', cookie, json: {}, origin: 'https://evil.example' }));
  assert.equal(foreign.status, 403);

  const ok = await sitesPost(
    req('/api/admin/sites', { method: 'POST', cookie, json: { theme: 'blush-garden-rose', orderNumber: '4455667788', email: 'Mia@Example.com', name1: 'Mia', name2: 'Leo' } }),
  );
  assert.equal(ok.status, 201);
  const made = await ok.json();
  assert.equal(made.slug, 'mia-and-leo');
  assert.match(made.editUrl, /^http:\/\/localhost:3000\/edit\/mia-and-leo\?k=/);
  const site = (await getDataAdapter().getSiteBySlug('mia-and-leo'))!;
  assert.equal(site.ownerEmail, 'Mia@example.com', 'same rule as /start: the domain is lower-cased');
  assert.equal(site.orderCheck?.status, 'verified', 'the shop made it: publishing is open');
  assert.equal(canEdit(site, new URL(made.editUrl).searchParams.get('k')), true);
  const summary = summarizeSite(site, 0);
  assert.equal(summary.madeByShop, true);
  assert.equal(summary.needsAction, false);
  assert.equal(summary.names, 'Mia & Leo');

  const again = await sitesPost(req('/api/admin/sites', { method: 'POST', cookie, json: { theme: 'blush-garden-rose', orderNumber: '4455667788', email: 'x@example.com', name1: 'X', name2: 'Y' } }));
  assert.equal(again.status, 400);
  const againBody = await again.json();
  assert.equal(againBody.existingId, site.id);

  const taken = await sitesPost(req('/api/admin/sites', { method: 'POST', cookie, json: { theme: 'blush-garden-rose', orderNumber: '4455667799', email: 'x@example.com', name1: 'X', name2: 'Y', slug: 'mia-and-leo' } }));
  assert.equal(taken.status, 400);
  assert.match((await taken.json()).fields.slug, /dolu/);

  // the ready message: filled in, nothing left to decide
  const t = messageTemplate('shop_created_site')!;
  const r = renderMessage(t, { names: 'Mia & Leo', order: '4455667788', design: 'Blush Garden Rose', siteUrl: 'https://x/mia-and-leo', startUrl: '', editUrl: made.editUrl });
  assert.deepEqual(r.missing, []);
  assert.ok(r.text.includes(made.editUrl));
});

test('site actions: note (shop only), email fix, publish for the buyer, delete replies; detail has content, replies, preview', async () => {
  const cookie = await signIn();
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'g094-note', theme: '_sample', content: demoContent(), orderRef: '5566778899', ownerEmail: 'old@example.com' });
  const id = created.site.id;
  await adapter.saveRsvp(id, { name: 'Guest One', attending: true, guests: 2 });
  const spam = await adapter.saveRsvp(id, { name: 'Spam', attending: false, guests: 0 });

  let res = await act(id, 'note', cookie, { note: 'Etsy: özel istek — altın yazı' });
  assert.equal(res.status, 200);
  let body = await res.json();
  assert.equal(body.summary.note, 'Etsy: özel istek — altın yazı');
  const site = (await adapter.getSiteById(id))!;
  const state = JSON.stringify(await panelState(site, BASE));
  assert.ok(!state.includes('özel istek'), 'the buyer never sees the shop note');

  res = await act(id, 'email', cookie, { email: 'not-an-email' });
  assert.equal(res.status, 400);
  res = await act(id, 'email', cookie, { email: 'New@Example.com' });
  body = await res.json();
  assert.equal(body.summary.ownerEmail, 'New@example.com');

  assert.equal(body.rsvp.counts.responses, 2);
  assert.equal(body.rsvp.counts.totalGuests, 2);
  res = await act(id, 'rsvp-delete', cookie, { ids: [spam.id] });
  body = await res.json();
  assert.equal(body.rsvp.counts.responses, 1);
  assert.equal(body.summary.replies, 1);

  res = await act(id, 'publish', cookie);
  body = await res.json();
  assert.equal(res.status, 200, JSON.stringify(body));
  assert.equal(body.summary.state, 'published');
  res = await act(id, 'publish', cookie);
  assert.equal(res.status, 409, 'nothing new to publish');

  const detail = (await adminSite(id))!;
  assert.match(detail.previewPath, /^\/g094-note\?preview=/);
  assert.ok(detail.content.venue);
  assert.equal(detail.rsvp.responses[0].name, 'Guest One');

  const csv = await rsvpCsvGet(req(`/api/admin/sites/${id}/rsvps`, { cookie }), { params: Promise.resolve({ id }) });
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get('content-type') ?? '', /text\/csv/);
  assert.match(await csv.text(), /Guest One/);
  const anon = await rsvpCsvGet(req(`/api/admin/sites/${id}/rsvps`), { params: Promise.resolve({ id }) });
  assert.equal(anon.status, 401);

  const all = await exportGet(req('/api/admin/export', { cookie }));
  assert.equal(all.status, 200);
  const text = await all.text();
  assert.match(text, /5566778899/);
  assert.match(text, /New@example\.com/);
  assert.equal((await exportGet(req('/api/admin/export'))).status, 401);
});
