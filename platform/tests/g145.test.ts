// G145 (K45 item 1): the shop's own time-limited edit link (edit without touching the buyer's link — docs/23 §3), its
// admin actions, history and overview to-do; the "Travel & stay has no link" note only while the section is really
// empty (G138 content counts); the admin message for a setup done with the shop link. Browser journeys: tests/g145-browser.ts.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import path from 'node:path';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as actionPost } from '../app/api/admin/sites/[id]/[action]/route.ts';
import { GET as panelGet } from '../app/api/edit/[slug]/route.ts';
import { messageMissing, messageTemplate, renderMessage } from '../lib/admin/messages.ts';
import { siteHistory, summarizeSite } from '../lib/admin/summary.ts';
import { adminDashboard } from '../lib/admin/view.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { prePublishNotes } from '../lib/panel/model.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { canEdit, createSiteWithKeys, endShopEditKey, isShopEditKey, issueShopEditKey, SHOP_EDIT_TTL_MS } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';

before(() => {
  const themes = tmpDir('g145-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g145-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
  setClaimRateLimiter(new MemoryRateLimiter());
});

function req(url: string, init: { method?: string; json?: unknown; cookie?: string | null; bearer?: string } = {}): Request {
  const headers = new Headers({ host: 'localhost:3000', origin: BASE });
  if (init.json !== undefined) headers.set('content-type', 'application/json');
  if (init.cookie) headers.set('cookie', init.cookie);
  if (init.bearer) headers.set('authorization', `Bearer ${init.bearer}`);
  return new Request(`${BASE}${url}`, { method: init.method ?? 'GET', headers, body: init.json !== undefined ? JSON.stringify(init.json) : undefined });
}

async function signIn(): Promise<string> {
  const res = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD } }));
  assert.equal(res.status, 200);
  return (res.headers.get('set-cookie') ?? '').split(';')[0];
}

function act(id: string, action: string, cookie: string | null, json: unknown = {}) {
  return actionPost(req(`/api/admin/sites/${id}/${action}`, { method: 'POST', json, cookie }), { params: Promise.resolve({ id, action }) });
}

const panel = (slug: string, key: string) => panelGet(req(`/api/edit/${slug}`, { bearer: key }), { params: Promise.resolve({ slug }) });

test('shop edit key: works beside the buyer key, ends at its time and when the shop ends it; a new one replaces the old', async () => {
  const adapter = getDataAdapter();
  const { site, editKey } = await createSiteWithKeys(adapter, { slug: 'shop-edit-a', theme: '_sample', content: demoContent() });
  assert.equal(isShopEditKey(site, editKey), false);
  const now = new Date();
  const first = await issueShopEditKey(adapter, site.id, now);
  assert.notEqual(first.editKey, editKey);
  assert.equal(canEdit(first.site, first.editKey, now.getTime()), true, 'shop key edits');
  assert.equal(canEdit(first.site, editKey, now.getTime()), true, 'buyer key untouched');
  assert.equal(first.site.editKeyHash, site.editKeyHash, 'buyer key hash unchanged');
  assert.equal(first.site.previewKeyHash, site.previewKeyHash, 'preview key unchanged');
  assert.equal(canEdit(first.site, first.editKey, now.getTime() + SHOP_EDIT_TTL_MS + 1), false, 'runs out after 72 h');
  assert.equal(JSON.stringify(first.site).includes(first.editKey), false, 'the key itself is never stored');

  const second = await issueShopEditKey(adapter, site.id, now);
  assert.equal(canEdit(second.site, first.editKey, now.getTime()), false, 'the earlier shop key stops');
  assert.equal(canEdit(second.site, second.editKey, now.getTime()), true);

  const ended = await endShopEditKey(adapter, site.id, now);
  assert.equal(ended.shopEdit, null);
  assert.equal(canEdit(ended, second.editKey, now.getTime()), false, 'ended');
  assert.equal(canEdit(ended, editKey, now.getTime()), true, 'buyer key still works');
  const lines = siteHistory(ended).map((h) => h.text);
  assert.equal(lines.filter((t) => t.startsWith('Dükkân düzenleme linki açıldı')).length, 2);
  assert.equal(lines.filter((t) => t === 'Dükkân düzenleme linki kapatıldı').length, 1);
});

test('admin "shop-edit": the link opens the panel API, the buyer link keeps working; "shop-edit-end" closes it; signed out = refused', async () => {
  const adapter = getDataAdapter();
  const { site, editKey } = await createSiteWithKeys(adapter, { slug: 'shop-edit-b', theme: '_sample', content: demoContent() });
  assert.equal((await act(site.id, 'shop-edit', null)).status, 401);
  const cookie = await signIn();
  const res = await act(site.id, 'shop-edit', cookie);
  assert.equal(res.status, 200);
  const body = (await res.json()) as { shopEditUrl: string; summary: { shopEditUntil: string | null }; history: Array<{ text: string }> };
  const url = new URL(body.shopEditUrl);
  assert.equal(url.pathname, '/edit/shop-edit-b');
  const shopKey = url.searchParams.get('k')!;
  assert.ok(body.summary.shopEditUntil, 'summary says until when');
  assert.ok(body.history.some((h) => h.text.startsWith('Dükkân düzenleme linki açıldı')));
  assert.equal((await panel('shop-edit-b', shopKey)).status, 200, 'shop key opens the panel API');
  assert.equal((await panel('shop-edit-b', editKey)).status, 200, 'buyer key too');

  const summary = summarizeSite((await adapter.getSiteById(site.id))!, 0);
  const todos = adminDashboard([summary]).todos;
  assert.ok(todos.some((t) => t.kind === 'shop_edit'), 'overview reminds the shop to close it');

  const end = await act(site.id, 'shop-edit-end', cookie);
  assert.equal(end.status, 200);
  assert.equal(((await end.json()) as { summary: { shopEditUntil: string | null } }).summary.shopEditUntil, null);
  assert.equal((await panel('shop-edit-b', shopKey)).status, 401, 'closed link refused');
  assert.equal((await panel('shop-edit-b', editKey)).status, 200, 'buyer link still works');
});

test('setup done with the shop link: a ready message without an edit link', () => {
  const t = messageTemplate('setup_service_done_same_link')!;
  assert.ok(t, 'template exists');
  assert.equal(t.needsEditUrl, false);
  const r = renderMessage(t, { names: 'Ada & Grace', order: '1234567890', design: 'Blush Garden Rose', siteUrl: 'https://x/ada', startUrl: 'https://x/start' });
  assert.deepEqual(messageMissing(r.text), []);
  assert.match(r.text, /same private edit link/);
  assert.doesNotMatch(r.text, /\/edit\//);
});

test('Travel & stay: "no link yet" only while the section has nothing to show (G138 notes and places count)', () => {
  const theme = { photos: [], optionalBlocks: ['travel_stay'] as const, sample: null };
  const base = demoContent();
  base.record_kind = 'customer' as never;
  base.optional_blocks = { ...(base.optional_blocks ?? {}), travel_stay: true };
  base.urls = { ...(base.urls ?? {}), accommodation: null };
  delete (base as { travel?: unknown }).travel;
  const empty = prePublishNotes(base, theme as never);
  assert.ok(empty.links.some((n) => n.path === 'urls.accommodation'), 'empty section: note');
  const withStay = { ...base, travel: { stays: [{ name: 'Hotel Villa Rosa' }] } } as typeof base;
  assert.equal(prePublishNotes(withStay, theme as never).links.some((n) => n.path === 'urls.accommodation'), false, 'a place to stay shows: no note');
  const withNote = { ...base, travel: { parking: { text: 'Free parking next to the venue.' } } } as typeof base;
  assert.equal(prePublishNotes(withNote, theme as never).links.some((n) => n.path === 'urls.accommodation'), false, 'a getting-here note shows: no note');
});
