// G087 shop admin: sign-in, session cookie, list, the support actions through the real route handlers (local
// storage), the adapters' listSites/rsvpCounts (local + fake blob), and the panel's reply-by date following the
// wedding date while it is still the design's sample.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { POST as sessionPost, DELETE as sessionDelete } from '../app/api/admin/session/route.ts';
import { GET as sitesGet } from '../app/api/admin/sites/route.ts';
import { POST as actionPost } from '../app/api/admin/sites/[id]/[action]/route.ts';
import {
  ADMIN_COOKIE,
  adminConfig,
  isAdminRequest,
  newSessionToken,
  passwordMatches,
  readCookie,
  verifySessionToken,
} from '../lib/admin/auth.ts';
import { MESSAGE_TEMPLATES, messageTemplate, RAW_MESSAGE_TEMPLATES, renderMessage } from '../lib/admin/messages.ts';
import { countSites, filterSites, siteHistory, summarizeSite, themeName } from '../lib/admin/summary.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { followWeddingDate } from '../lib/panel/model.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { launchProblems } from '../lib/marketing/placeholders.ts';
import { canEdit, createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';

before(() => {
  const themes = tmpDir('g087-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g087-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
  setClaimRateLimiter(new MemoryRateLimiter());
});

let counter = 0;
async function newSite(opts: { pending?: boolean; order?: string; edit?: (c: ContentRecord) => void } = {}) {
  const c = demoContent();
  opts.edit?.(c);
  const slug = `g087-site-${++counter}`;
  const created = await createSiteWithKeys(getDataAdapter(), {
    slug,
    theme: '_sample',
    content: c,
    orderRef: opts.order ?? `30000000${String(counter).padStart(2, '0')}`,
    ownerEmail: `buyer${counter}@example.com`,
    ...(opts.pending ? { orderCheck: { status: 'pending' as const, at: new Date().toISOString(), by: 'claim' as const } } : {}),
  });
  return created;
}

function req(url: string, init: { method?: string; json?: unknown; cookie?: string | null; origin?: string | null; ip?: string } = {}): Request {
  const headers = new Headers({ host: 'localhost:3000' });
  if (init.json !== undefined) headers.set('content-type', 'application/json');
  if (init.cookie) headers.set('cookie', init.cookie);
  if (init.origin !== null) headers.set('origin', init.origin ?? BASE);
  if (init.ip) headers.set('x-forwarded-for', init.ip);
  return new Request(`${BASE}${url}`, { method: init.method ?? 'GET', headers, body: init.json !== undefined ? JSON.stringify(init.json) : undefined });
}

async function signIn(): Promise<string> {
  const res = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD } }));
  assert.equal(res.status, 200);
  const set = res.headers.get('set-cookie') ?? '';
  assert.match(set, /HttpOnly/);
  assert.match(set, /SameSite=Strict/);
  return set.split(';')[0];
}

function act(id: string, action: string, cookie: string, json: unknown = {}, origin?: string | null) {
  return actionPost(req(`/api/admin/sites/${id}/${action}`, { method: 'POST', json, cookie, origin }), { params: Promise.resolve({ id, action }) });
}

// --- auth -------------------------------------------------------------------------------------------------------

test('admin is off without a password; a short one only before launch (K33)', () => {
  assert.equal(adminConfig({}).state, 'off');
  assert.equal(adminConfig({ ADMIN_PASSWORD: '123' }, false).state, 'weak', 'under 4 characters: off even before launch');
  assert.deepEqual(adminConfig({ ADMIN_PASSWORD: '1234' }, false), { state: 'on', password: '1234', temporary: true });
  assert.equal(adminConfig({ ADMIN_PASSWORD: '1234' }, true).state, 'weak', 'launched: a short password leaves the admin off');
  assert.deepEqual(adminConfig({ ADMIN_PASSWORD: PASSWORD }, true), { state: 'on', password: PASSWORD, temporary: false });
  // the launch gate refuses a short admin password; a long one (or none) adds no problem
  assert.ok(launchProblems(MARKETING, { ADMIN_PASSWORD: '1234' }).some((p) => p.includes('ADMIN_PASSWORD')));
  assert.ok(!launchProblems(MARKETING, { ADMIN_PASSWORD: PASSWORD }).some((p) => p.includes('ADMIN_PASSWORD')));
  assert.ok(!launchProblems(MARKETING, {}).some((p) => p.includes('ADMIN_PASSWORD')));
});

test('session token: valid, expired, tampered, other password', () => {
  const now = 1_800_000_000_000;
  const { token } = newSessionToken(PASSWORD, now);
  assert.equal(verifySessionToken(token, PASSWORD, now + 1000), true);
  assert.equal(verifySessionToken(token, PASSWORD, now + 13 * 3600_000), false, 'expired after 12 h');
  assert.equal(verifySessionToken(token, 'another long password!', now), false, 'changing the password signs everyone out');
  assert.equal(verifySessionToken(token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A'), PASSWORD, now), false);
  assert.equal(verifySessionToken(`${now + 999 * 3600_000}.${token.split('.')[1]}`, PASSWORD, now), false, 'expiry cannot be stretched');
  assert.equal(verifySessionToken(undefined, PASSWORD, now), false);
  assert.equal(passwordMatches(PASSWORD, PASSWORD), true);
  assert.equal(passwordMatches('wrong', PASSWORD), false);
  assert.equal(passwordMatches(undefined, PASSWORD), false);
  assert.equal(readCookie(`a=1; ${ADMIN_COOKIE}=xyz; b=2`, ADMIN_COOKIE), 'xyz');
  assert.equal(isAdminRequest(`${ADMIN_COOKIE}=${token}`, { ADMIN_PASSWORD: PASSWORD }, now), true);
  assert.equal(isAdminRequest(`${ADMIN_COOKIE}=${token}`, {}, now), false, 'admin switched off: no session counts');
});

test('sign in: off → 404, wrong → 401, foreign origin → 403, right → cookie; sign out clears it', async () => {
  delete process.env.ADMIN_PASSWORD;
  assert.equal((await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD } }))).status, 404);
  process.env.ADMIN_PASSWORD = PASSWORD;
  assert.equal((await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: 'nope' } }))).status, 401);
  assert.equal((await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD }, origin: 'https://evil.example' }))).status, 403);
  assert.equal((await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD }, origin: null }))).status, 403);
  const cookie = await signIn();
  assert.ok(cookie.startsWith(`${ADMIN_COOKIE}=`));
  const out = await sessionDelete(req('/api/admin/session', { method: 'DELETE', cookie }));
  assert.match(out.headers.get('set-cookie') ?? '', /Max-Age=0/);
});

test('sign in is rate limited per address (wrong and right attempts count)', async () => {
  for (let i = 0; i < 8; i++) {
    const res = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: 'wrong' }, ip: '203.0.113.9' }));
    assert.equal(res.status, 401);
  }
  const blocked = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD }, ip: '203.0.113.9' }));
  assert.equal(blocked.status, 429);
  const other = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD }, ip: '203.0.113.10' }));
  assert.equal(other.status, 200, 'another address is not blocked');
});

// --- list -------------------------------------------------------------------------------------------------------

test('list needs a session and shows summaries without secrets', async () => {
  const pending = await newSite({ pending: true });
  await newSite();
  assert.equal((await sitesGet(req('/api/admin/sites'))).status, 401);
  const res = await sitesGet(req('/api/admin/sites', { cookie: await signIn() }));
  assert.equal(res.status, 200);
  const text = await res.text();
  assert.doesNotMatch(text, /editKeyHash|previewKeyHash|claimTokenHash|"secret"/);
  const body = JSON.parse(text);
  const row = body.sites.find((s: { id: string }) => s.id === pending.site.id);
  assert.equal(row.needsAction, true);
  assert.equal(row.order, 'pending');
  assert.ok(body.counts.needsAction >= 1);
  assert.equal(body.sites.filter((s: { needsAction: boolean }) => s.needsAction)[0].needsAction, true);
});

// --- actions ----------------------------------------------------------------------------------------------------

test('confirm: a pending order can be published only after the shop confirms it', async () => {
  const { site } = await newSite({ pending: true });
  const adapter = getDataAdapter();
  await assert.rejects(publishSite(adapter, site.id), /not confirmed/);
  const cookie = await signIn();
  assert.equal((await act(site.id, 'confirm', cookie, { note: 'paid' }, null)).status, 403, 'writes need Origin');
  assert.equal((await act(site.id, 'confirm', cookie, { note: 'paid' }, 'https://evil.example')).status, 403);
  assert.equal((await act(site.id, 'confirm', '')).status, 401);
  const res = await act(site.id, 'confirm', cookie, { note: 'Checked in Etsy: paid' });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.summary.order, 'verified');
  assert.equal(body.summary.needsAction, false);
  assert.ok(body.history.some((h: { text: string }) => /Sipariş onaylandı: Checked in Etsy: paid/.test(h.text)));
  await publishSite(adapter, site.id);
});

test('reissue: new link shown once, old link dead, new link works', async () => {
  const { site, editKey } = await newSite();
  const cookie = await signIn();
  const res = await act(site.id, 'reissue', cookie);
  assert.equal(res.status, 200);
  const body = await res.json();
  const m = /^http:\/\/localhost:3000\/edit\/([a-z0-9-]+)\?k=([A-Za-z0-9_-]{43})$/.exec(body.editUrl);
  assert.ok(m, body.editUrl);
  assert.equal(m![1], site.slug);
  const fresh = (await getDataAdapter().getSiteById(site.id))!;
  assert.equal(canEdit(fresh, editKey), false);
  assert.equal(canEdit(fresh, m![2]), true);
});

test('grant: refused before the first publish, adds changes after it', async () => {
  const { site } = await newSite();
  const cookie = await signIn();
  assert.equal((await act(site.id, 'grant', cookie, { add: 1, reason: 'moved' })).status, 409);
  await publishSite(getDataAdapter(), site.id);
  assert.equal((await act(site.id, 'grant', cookie, { add: 1, reason: '' })).status, 400, 'a reason is required');
  const res = await act(site.id, 'grant', cookie, { add: 2, reason: 'Wedding moved' });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body.summary.changes, { used: 0, total: 5, left: 5 });
});

test('archive date: set by support, then back to the default', async () => {
  const { site } = await newSite();
  await publishSite(getDataAdapter(), site.id);
  const cookie = await signIn();
  const set = await (await act(site.id, 'archive', cookie, { day: '2031-01-01', reason: 'Extension' })).json();
  assert.equal(set.summary.onlineUntil, '2030-12-31');
  assert.equal(set.summary.archiveSource, 'support');
  const cleared = await (await act(site.id, 'archive', cookie, { day: null, reason: 'Back to normal' })).json();
  assert.equal(cleared.summary.archiveSource, 'wedding_date');
  assert.equal((await act(site.id, 'archive', cookie, { day: '31.12.2030', reason: 'x' })).status, 400);
});

test('unpublish and delete (delete needs the address typed)', async () => {
  const { site } = await newSite();
  const adapter = getDataAdapter();
  const cookie = await signIn();
  assert.equal((await act(site.id, 'unpublish', cookie)).status, 409, 'not published yet');
  await publishSite(adapter, site.id);
  const off = await (await act(site.id, 'unpublish', cookie)).json();
  assert.equal(off.summary.state, 'draft');
  assert.equal((await act(site.id, 'delete', cookie, { confirm: 'something-else' })).status, 400);
  assert.ok(await adapter.getSiteById(site.id));
  const del = await act(site.id, 'delete', cookie, { confirm: site.slug.toUpperCase() });
  assert.equal(del.status, 200);
  assert.equal(await adapter.getSiteById(site.id), null);
  assert.equal((await act(site.id, 'confirm', cookie)).status, 404);
  assert.equal((await act(site.id, 'nonsense', cookie)).status, 404);
});

// --- summaries, filters, messages ------------------------------------------------------------------------------

test('summary, filter and search', async () => {
  const a = await newSite({ pending: true, order: '4111222233' });
  const b = await newSite({
    edit: (c) => {
      c.partners[0].display_name = 'Ada';
      c.partners[1].display_name = 'Grace';
      c.partners[0].full_name = 'Ada Lane';
      c.partners[1].full_name = 'Grace Hill';
      c.name_display = 'Ada & Grace';
    },
  });
  await publishSite(getDataAdapter(), b.site.id);
  const fresh = (await getDataAdapter().getSiteById(b.site.id))!;
  const list = [summarizeSite(a.site, 0), summarizeSite(fresh, 3)];
  assert.equal(list[1].names, 'Ada & Grace');
  assert.equal(list[1].state, 'published');
  assert.deepEqual(list[1].changes, { used: 0, total: 3, left: 3 });
  assert.equal(countSites(list).replies, 3);
  assert.deepEqual(filterSites(list, 'action', '').map((s) => s.id), [a.site.id]);
  assert.deepEqual(filterSites(list, 'all', '#4111').map((s) => s.id), [a.site.id], 'order number digits');
  assert.deepEqual(filterSites(list, 'all', 'grace').map((s) => s.id), [b.site.id]);
  assert.deepEqual(filterSites(list, 'all', a.site.ownerEmail!).map((s) => s.id), [a.site.id]);
  assert.deepEqual(filterSites(list, 'published', '').map((s) => s.id), [b.site.id]);
  assert.equal(themeName('blush-garden-rose'), 'Blush Garden Rose');
  // G093: 06 is on the sales site now, so it shows its marketing name; an unlisted id still reads as words
  assert.equal(themeName('art-deco-black-tie'), 'Art Deco Black-Tie');
  assert.equal(themeName('some-unlisted-theme'), 'Some Unlisted Theme');
  assert.ok(siteHistory(fresh).some((h) => h.text === 'İlk kez yayınlandı'));
});

test('message templates: G091 texts, one source (docs/19 copy identical), filled in, unsent while something is undecided', () => {
  const ids = MESSAGE_TEMPLATES.map((t) => t.id);
  for (const id of ['order_confirmed', 'start_link_reminder', 'new_edit_link', 'extra_change_granted', 'how_to_publish', 'publish_blocked_pending', 'general_help', 'delete_data']) {
    assert.ok(ids.includes(id), id);
  }
  // docs/19 §4.5 carries the same JSON between its markers (the platform file is the source)
  const doc = readFileSync(path.join(REPO_ROOT, 'docs/19_ALICI_YOLCULUGU.md'), 'utf8');
  const block = /<!-- g091:templates:start -->[\s\S]*?```json\n([\s\S]*?)```[\s\S]*?<!-- g091:templates:end -->/.exec(doc);
  assert.ok(block, 'docs/19 template block');
  assert.deepEqual(JSON.parse(block![1]), RAW_MESSAGE_TEMPLATES, 'docs/19 copy == platform/lib/admin/message-templates.json');
  const vars = {
    names: 'Emma & Liam',
    order: '3456789012',
    design: 'Blush Garden Rose',
    siteUrl: 'https://x.example/emma-and-liam',
    startUrl: 'https://x.example/start?theme=t',
    editUrl: 'https://x.example/edit/emma-and-liam?k=abc',
    changesLeft: 2,
    onlineUntil: 'September 18, 2028',
  };
  for (const t of MESSAGE_TEMPLATES) {
    const { text, missing } = renderMessage(t, vars);
    assert.doesNotMatch(text, /undefined|null/, t.id);
    for (const m of missing) assert.match(m, /^\[[A-Z]/, `${t.id}: only undecided [POLICY] placeholders may be left (${m})`);
    assert.doesNotMatch(text, /24\/7|guarantee/i, `${t.id}: no guarantee`);
    assert.equal(t.needsEditUrl, t.placeholders.includes('edit_url'));
  }
  assert.match(renderMessage(messageTemplate('new_edit_link')!, vars).text, /k=abc/);
  assert.match(renderMessage(messageTemplate('order_confirmed')!, vars).text, /3456789012/);
  assert.match(renderMessage(messageTemplate('order_confirmed')!, vars).text, /BKE Studio/, 'K33 shop name');
  // without the fresh link, the "new edit link" text cannot be sent
  assert.deepEqual(renderMessage(messageTemplate('new_edit_link')!, { ...vars, editUrl: null }).missing, ['{edit_url}']);
  assert.ok(MESSAGE_TEMPLATES.every((t) => !/[a-z]/.test(t.title.slice(0, 1)) || t.title.length > 0));
});

// --- adapters ---------------------------------------------------------------------------------------------------

test('listSites + rsvpCounts: local and blob agree', async () => {
  const fake = new FakeBlobStore();
  const adapters = [new LocalAdapter(tmpDir('g087-local-')), new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 })];
  for (const adapter of adapters) {
    const one = await createSiteWithKeys(adapter, { slug: 'list-one', theme: '_sample', content: demoContent() });
    await new Promise((r) => setTimeout(r, 5));
    const two = await createSiteWithKeys(adapter, { slug: 'list-two', theme: '_sample', content: demoContent() });
    await adapter.saveRsvp(two.site.id, { name: 'A', attending: true, guests: 1 });
    await adapter.saveRsvp(two.site.id, { name: 'B', attending: false, guests: 0 });
    const list = await adapter.listSites();
    assert.deepEqual(list.map((s) => s.slug), ['list-two', 'list-one'], `${adapter.kind}: newest first`);
    assert.deepEqual(await adapter.rsvpCounts(), { [two.site.id]: 2 }, adapter.kind);
    assert.equal(one.site.slug, 'list-one');
  }
});

// --- panel: the sample reply-by date follows the wedding date ---------------------------------------------------

test('followWeddingDate: a sample deadline keeps its distance; a chosen one stays', () => {
  const sample = demoContent(); // 2027-05-15, deadline 2027-04-03 (42 days before)
  const prev = demoContent();
  const next = { ...demoContent(), date: '2027-09-18' };
  assert.equal(followWeddingDate(prev, next, sample).rsvp.deadline, '2027-08-07');
  // moved again: still follows (it is the sample distance before the previous date)
  const moved = followWeddingDate(prev, next, sample);
  assert.equal(followWeddingDate(moved, { ...moved, date: '2027-10-02' }, sample).rsvp.deadline, '2027-08-21');
  // the couple chose their own deadline: untouched
  const chosen = { ...moved, rsvp: { ...moved.rsvp, deadline: '2027-08-01' } };
  assert.equal(followWeddingDate(chosen, { ...chosen, date: '2027-10-02' }, sample).rsvp.deadline, '2027-08-01');
  // no sample / same date / unreadable date: nothing changes
  assert.equal(followWeddingDate(prev, next, null), next);
  assert.equal(followWeddingDate(prev, prev, sample), prev);
  const bad = { ...next, date: '' };
  assert.equal(followWeddingDate(prev, bad, sample), bad);
});
