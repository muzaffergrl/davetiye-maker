// G146 (K46): "Create your website" + continue on any device with the Etsy order number + email.
//  - device keys (lib/device-keys.ts): mint / find / at most 10 / labels, on both adapters (local + blob fake), and
//    concurrent sign-ins on the blob adapter (ETag-conditional site document);
//  - POST /api/my/continue: match → device key, no website → "start", mismatch → one generic answer, field checks,
//    honeypot, JSON only, per-IP and per-order limits;
//  - a device key works on every panel route (state, save, photo, publish, unpublish, guest password, map link, music,
//    Google Sheets, downloads, RSVP list / actions / CSV / Excel, devices) and with the panel's preview token, and the
//    shared preview link keeps working;
//  - every key reissue (lib/sites.ts reissueKeys, admin "reissue", scripts/reissue-edit-key.ts) revokes device keys;
//  - /start with an order that already has a website: same email → signed in (device key), another email → 409 + /my;
//  - "Sign out other devices" (keeps the one in use; the edit link stays; not from the shop's link);
//  - "Email me a sign-in link": 503 without a mailer; with one, only the owner's address gets a signin link;
//  - the sessionStorage hand-overs (lib/panel/remember.ts) and every G146 text translated in all four languages.
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { POST as continueRoute } from '../app/api/my/continue/route.ts';
import { POST as signInLinkRoute } from '../app/api/my/signin-link/route.ts';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { GET as stateRoute, PUT as saveRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as photoRoute } from '../app/api/edit/[slug]/photo/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { POST as unpublishRoute } from '../app/api/edit/[slug]/unpublish/route.ts';
import { POST as accessRoute } from '../app/api/edit/[slug]/access/route.ts';
import { POST as mapLinkRoute } from '../app/api/edit/[slug]/map-link/route.ts';
import { POST as musicRoute } from '../app/api/edit/[slug]/music/route.ts';
import { GET as googleRoute } from '../app/api/edit/[slug]/google/route.ts';
import { POST as downloadRoute } from '../app/api/edit/[slug]/download/route.ts';
import { GET as devicesGet, POST as devicesPost } from '../app/api/edit/[slug]/devices/route.ts';
import { GET as repliesRoute, POST as repliesActionRoute } from '../app/api/rsvp/[slug]/responses/route.ts';
import { GET as exportRoute } from '../app/api/rsvp/[slug]/export/route.ts';
import { GET as excelRoute } from '../app/api/rsvp/[slug]/excel/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as adminAction } from '../app/api/admin/sites/[id]/[action]/route.ts';
import { CONTINUE_MESSAGES, sameOwnerEmail, SIGN_IN_LINK_SENT } from '../lib/claim/continue.ts';
import { DEFAULT_CONTINUE_LIMITS, setClaimRateLimiter } from '../lib/claim/limits.ts';
import { setEditLinkMailer, type EditLinkMailer, type EditLinkMessage } from '../lib/claim/mailer.ts';
import { setOrderVerifier } from '../lib/claim/verify.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import type { DataAdapter } from '../lib/data/types.ts';
import { DEVICE_DOC, deviceLabel, findDeviceKey, isDeviceKeyShape, listDevices, MAX_DEVICE_KEYS, mintDeviceKey, signOutOtherDevices } from '../lib/device-keys.ts';
import { loadDict } from '../lib/i18n/dicts.ts';
import { scanSource } from '../lib/i18n/scan.ts';
import { derivePreviewKey } from '../lib/keys.ts';
import { OPENED_EXISTING_KEY, markOpenedExisting, saveStartPrefill, START_PREFILL_KEY, takeOpenedExisting, takeStartPrefill } from '../lib/panel/remember.ts';
import { MemoryRateLimiter, setRsvpRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { editorAccess } from '../lib/rsvp/couple.ts';
import { createSiteWithKeys, editAccess, issueShopEditKey, reissueKeys } from '../lib/sites.ts';
import { reissueEditLink } from '../scripts/reissue-edit-key.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

before(() => {
  const themes = tmpDir('g146-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  // a claimable design (the sample theme with demo content), for /start
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, 'sample-design'), { recursive: true });
  const manifestFile = path.join(themes, 'sample-design', 'theme.json');
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  manifest.id = 'sample-design';
  manifest.name = 'Sample Design';
  delete manifest.internal;
  writeFileSync(manifestFile, JSON.stringify(manifest));
  writeFileSync(path.join(themes, 'sample-design', 'content.demo.json'), JSON.stringify(demoContent()));
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g146-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  delete process.env.CLAIM_ORDER_VERIFICATION;
});

beforeEach(() => {
  setClaimRateLimiter(new MemoryRateLimiter());
  setRsvpRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  setEditLinkMailer(null);
  process.env.ADMIN_PASSWORD = PASSWORD;
});

after(() => {
  setEditLinkMailer(null);
  setOrderVerifier(null);
});

let counter = 0;
const freshOrder = () => String(6_100_000_000 + ++counter * 7919);
let ipCounter = 0;
const freshIp = () => `198.51.100.${(++ipCounter % 250) + 1}`;

async function newSite(opts: { order?: string; email?: string | null; adapter?: DataAdapter } = {}) {
  const adapter = opts.adapter ?? getDataAdapter();
  const slug = `g146-site-${++counter}`;
  const created = await createSiteWithKeys(adapter, {
    slug,
    theme: '_sample',
    content: demoContent(),
    orderRef: opts.order ?? freshOrder(),
    ownerEmail: opts.email === undefined ? 'Avery@Example.test' : opts.email,
  });
  return { ...created, slug, order: created.site.orderRef! };
}

type Json = Record<string, any>;

async function post(route: (req: Request) => Promise<Response>, url: string, body: unknown, opts: { ip?: string; ua?: string; type?: string; raw?: string } = {}) {
  const res = await route(
    new Request(`${BASE}${url}`, {
      method: 'POST',
      headers: { 'content-type': opts.type ?? 'application/json', 'x-forwarded-for': opts.ip ?? freshIp(), 'user-agent': opts.ua ?? IPHONE },
      body: opts.raw ?? JSON.stringify(body),
    }),
  );
  return { status: res.status, body: (await res.json()) as Json, res };
}

const cont = (body: unknown, opts: { ip?: string; ua?: string; type?: string; raw?: string } = {}) => post(continueRoute, '/api/my/continue', body, opts);
const keyOf = (editPath: string) => new URL(editPath, BASE).searchParams.get('k')!;

type Handler = (req: Request, ctx: { params: Promise<any> }) => Promise<Response>;
async function call(handler: Handler, url: string, slug: string, opts: { method?: string; key?: string; json?: unknown; body?: BodyInit; headers?: Record<string, string> } = {}) {
  const headers = new Headers(opts.headers ?? {});
  if (opts.key) headers.set('authorization', `Bearer ${opts.key}`);
  let body = opts.body;
  if (opts.json !== undefined) {
    body = JSON.stringify(opts.json);
    headers.set('content-type', 'application/json');
  }
  const res = await handler(new Request(`${BASE}${url}`, { method: opts.method ?? 'GET', headers, body }), { params: Promise.resolve({ slug }) });
  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    /* csv, xlsx, html */
  }
  return { status: res.status, data, headers: res.headers };
}

const panelState = (slug: string, key: string) => call(stateRoute, `/api/edit/${slug}`, slug, { key });

// ------------------------------------------------------------------------------------------------ device keys (both adapters)

const BACKENDS: Array<{ name: string; make(): DataAdapter }> = [
  { name: 'local', make: () => new LocalAdapter(tmpDir('g146-local-')) },
  {
    name: 'blob',
    make: () => {
      const fake = new FakeBlobStore();
      return new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 });
    },
  },
];

for (const backend of BACKENDS) {
  test(`[${backend.name}] device keys: mint, find, oldest dropped after ${MAX_DEVICE_KEYS}, hashes only, dead after a reissue`, async () => {
    const adapter = backend.make();
    const { site, editKey } = await newSite({ adapter });
    const first = await mintDeviceKey(adapter, site, { label: deviceLabel(IPHONE), via: 'continue' });
    assert.ok(isDeviceKeyShape(first.key) && !isDeviceKeyShape(editKey), 'device keys and edit keys never look alike');
    assert.equal((await findDeviceKey(adapter, site, first.key))?.id, first.id);
    assert.equal(await findDeviceKey(adapter, site, editKey), null);
    assert.equal(await findDeviceKey(adapter, site, `${first.key.slice(0, -1)}${first.key.endsWith('A') ? 'B' : 'A'}`), null);
    assert.deepEqual(await editAccess(adapter, site, first.key), { kind: 'device', deviceId: first.id });
    assert.deepEqual(await editAccess(adapter, site, editKey), { kind: 'owner' });
    const stored = JSON.stringify(await adapter.readSiteDoc(site.id, DEVICE_DOC));
    assert.ok(!stored.includes(first.key) && !stored.includes(first.key.slice(3)), 'only the hash is stored');
    assert.match(stored, /iPhone · Safari/);

    // The site record is not touched (an open panel elsewhere would see a save conflict).
    const before = (await adapter.getSiteById(site.id))!.updatedAt;
    const more = [];
    for (let i = 0; i < MAX_DEVICE_KEYS; i++) more.push(await mintDeviceKey(adapter, site, { label: '', via: 'continue', now: new Date(Date.now() + (i + 1) * 1000) }));
    assert.equal((await adapter.getSiteById(site.id))!.updatedAt, before);
    assert.equal((await listDevices(adapter, site)).length, MAX_DEVICE_KEYS);
    assert.equal(await findDeviceKey(adapter, site, first.key), null, 'the oldest was dropped');
    assert.ok(await findDeviceKey(adapter, site, more[MAX_DEVICE_KEYS - 1].key));

    // A key reissue: every device key dies (generation) and the document is deleted.
    const reissued = await reissueKeys(adapter, site.id);
    assert.equal(await findDeviceKey(adapter, reissued.site, more[MAX_DEVICE_KEYS - 1].key), null);
    assert.equal(await adapter.readSiteDoc(site.id, DEVICE_DOC), null);
    // Made for the old edit key just before the reissue landed: dead on arrival.
    const stale = await mintDeviceKey(adapter, site, { label: '', via: 'continue' });
    assert.equal(await findDeviceKey(adapter, reissued.site, stale.key), null);
  });
}

test('[blob] device keys: eight devices signing in at once all get a working key (ETag-conditional document)', async () => {
  const fake = new FakeBlobStore();
  const open = () => new BlobAdapter({ token: fake.token, client: fake.client(), maxWriteAttempts: 40, retryDelayMs: () => Math.random() * 4 });
  const { site } = await newSite({ adapter: open() });
  const minted = await Promise.all(Array.from({ length: 8 }, () => mintDeviceKey(open(), site, { label: '', via: 'continue' })));
  const reader = open();
  for (const m of minted) assert.ok(await findDeviceKey(reader, site, m.key), 'no device key lost');
  assert.equal((await listDevices(reader, site)).length, 8);
});

test('device labels from the user agent', () => {
  assert.equal(deviceLabel(IPHONE), 'iPhone · Safari');
  assert.equal(deviceLabel('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36'), 'Android · Chrome');
  assert.equal(deviceLabel('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36 Edg/129.0'), 'Windows · Edge');
  assert.equal(deviceLabel('Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:130.0) Gecko/20100101 Firefox/130.0'), 'Mac · Firefox');
  assert.equal(deviceLabel(''), '');
  assert.equal(deviceLabel(null), '');
});

test('owner email match: normalised, case-insensitive, never for a site without an email', () => {
  assert.ok(sameOwnerEmail('Avery@example.test', ' avery@EXAMPLE.test '));
  assert.ok(!sameOwnerEmail('avery@example.test', 'avery@example.org'));
  assert.ok(!sameOwnerEmail(null, 'avery@example.test'));
  assert.ok(!sameOwnerEmail('', ''));
});

// ------------------------------------------------------------------------------------------------ POST /api/my/continue

test('continue: order + its email → a device key that opens the editor; the edit link is unchanged', async () => {
  const s = await newSite();
  const r = await cont({ orderNumber: `Order #${s.order}`, email: 'avery@example.TEST' });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.next, 'edit');
  assert.equal(r.body.slug, s.slug);
  assert.match(r.body.editPath, new RegExp(`^/edit/${s.slug}\\?k=dv-`));
  assert.equal(r.res.headers.get('cache-control'), 'private, no-store');
  assert.equal(r.res.headers.get('referrer-policy'), 'no-referrer');
  const key = keyOf(r.body.editPath);
  const state = await panelState(s.slug, key);
  assert.equal(state.status, 200);
  assert.equal(state.data.state.slug, s.slug);
  assert.equal((await panelState(s.slug, s.editKey)).status, 200, 'the private edit link still works');
  const opened = await editorAccess(getDataAdapter(), s.slug, key);
  assert.equal(opened?.access.kind, 'device');
  const devices = await listDevices(getDataAdapter(), s.site);
  assert.equal(devices.length, 1);
  assert.equal(devices[0].label, 'iPhone · Safari');
  assert.equal(devices[0].via, 'continue');
});

test('continue: no website for the order yet → "start"; mismatch → one generic answer that reveals nothing', async () => {
  const none = await cont({ orderNumber: freshOrder(), email: 'new@example.test' });
  assert.equal(none.status, 200);
  assert.deepEqual(none.body, { ok: true, next: 'start' });

  const s = await newSite();
  const wrong = await cont({ orderNumber: s.order, email: 'thief@example.test' });
  assert.equal(wrong.status, 403);
  assert.deepEqual(Object.keys(wrong.body).sort(), ['code', 'message', 'ok']);
  assert.equal(wrong.body.code, 'no_match');
  assert.equal(wrong.body.message, CONTINUE_MESSAGES.no_match);
  for (const secret of [s.slug, 'avery', s.editKey]) assert.ok(!JSON.stringify(wrong.body).toLowerCase().includes(secret.toLowerCase()));
  // A site without an owner email never opens this way.
  const noEmail = await newSite({ email: null });
  assert.equal((await cont({ orderNumber: noEmail.order, email: 'avery@example.test' })).status, 403);
  assert.equal((await listDevices(getDataAdapter(), s.site)).length, 0, 'no device key was made');
});

test('continue: field checks, honeypot, JSON only, size cap', async () => {
  const bad = await cont({ orderNumber: '12', email: 'nope' });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.code, 'invalid');
  assert.ok(bad.body.fields.orderNumber && bad.body.fields.email);
  const s = await newSite();
  const bot = await cont({ orderNumber: s.order, email: 'avery@example.test', website: 'http://spam.example' });
  assert.equal(bot.status, 400);
  assert.equal((await listDevices(getDataAdapter(), s.site)).length, 0);
  assert.equal((await cont(null, { type: 'text/plain', raw: 'orderNumber=1' })).status, 415);
  assert.equal((await cont(null, { raw: '{' })).status, 400);
  assert.equal((await cont(null, { raw: JSON.stringify({ orderNumber: s.order, email: 'x'.repeat(2000) }) })).status, 413);
});

test('continue: rate limits per address and per order number (shared with /start)', async () => {
  const ip = '203.0.113.77';
  for (let i = 0; i < DEFAULT_CONTINUE_LIMITS.perIp.limit; i++) assert.notEqual((await cont({ orderNumber: freshOrder(), email: 'a@example.test' }, { ip })).status, 429);
  const blocked = await cont({ orderNumber: freshOrder(), email: 'a@example.test' }, { ip });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.res.headers.get('retry-after')) > 0);

  // One order number, many addresses: after perOrder attempts even the right email waits.
  const s = await newSite();
  for (let i = 0; i < DEFAULT_CONTINUE_LIMITS.perOrder.limit; i++) assert.equal((await cont({ orderNumber: s.order, email: `guess${i}@example.test` })).status, 403);
  assert.equal((await cont({ orderNumber: s.order, email: 'avery@example.test' })).status, 429);
  // /start counts against the same order number.
  const claim = await post(claimRoute, '/api/start', { theme: 'sample-design', orderNumber: s.order, email: 'avery@example.test', names: ['Avery', 'Jordan'] });
  assert.equal(claim.status, 429);
});

// ------------------------------------------------------------------------------------------------ every panel route

test('a device key works on every panel route; a wrong key gets 401 everywhere; previews keep working', async () => {
  const s = await newSite();
  const r = await cont({ orderNumber: s.order, email: 'avery@example.test' });
  const key = keyOf(r.body.editPath);
  const slug = s.slug;

  const state = await panelState(slug, key);
  assert.equal(state.status, 200);
  const save = await call(saveRoute, `/api/edit/${slug}`, slug, { method: 'PUT', key, json: { content: state.data.state.content, baseUpdatedAt: state.data.state.updatedAt } });
  assert.equal(save.status, 200, `save ${JSON.stringify(save.data)}`);
  const photo = await call(photoRoute, `/api/edit/${slug}/photo?slot=hero`, slug, { method: 'POST', key, body: Buffer.from(tinyPng()), headers: { 'content-type': 'image/png' } });
  assert.equal(photo.status, 200, `photo ${JSON.stringify(photo.data)}`);
  const publish = await call(publishRoute, `/api/edit/${slug}/publish`, slug, { method: 'POST', key });
  assert.equal(publish.status, 200, `publish ${JSON.stringify(publish.data)}`);
  const access = await call(accessRoute, `/api/edit/${slug}/access`, slug, { method: 'POST', key, json: { enabled: false } });
  assert.equal(access.status, 200, `access ${JSON.stringify(access.data)}`);
  // Past the key check (these would need the network / a file / a browser to go further):
  assert.equal((await call(mapLinkRoute, `/api/edit/${slug}/map-link`, slug, { method: 'POST', key, json: { url: 'https://example.com/' } })).status, 422);
  assert.equal((await call(musicRoute, `/api/edit/${slug}/music`, slug, { method: 'POST', key, body: Buffer.from('x') })).status, 400);
  assert.equal((await call(downloadRoute, `/api/edit/${slug}/download`, slug, { method: 'POST', key, json: { kind: 'nothing' } })).status, 400);
  assert.equal((await call(googleRoute, `/api/edit/${slug}/google`, slug, { key })).status, 200);
  assert.equal((await call(repliesRoute, `/api/rsvp/${slug}/responses`, slug, { key })).status, 200);
  assert.equal((await call(repliesActionRoute, `/api/rsvp/${slug}/responses`, slug, { method: 'POST', key, json: { action: 'keep', ids: ['00000000-0000-4000-8000-000000000000'] } })).status, 200);
  const csv = await call(exportRoute, `/api/rsvp/${slug}/export?k=${encodeURIComponent(key)}`, slug);
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get('content-type') ?? '', /text\/csv/);
  const xlsx = await call(excelRoute, `/api/rsvp/${slug}/excel?k=${encodeURIComponent(key)}`, slug);
  assert.equal(xlsx.status, 200);
  assert.equal((await call(devicesGet, `/api/edit/${slug}/devices`, slug, { key })).status, 200);
  assert.equal((await call(unpublishRoute, `/api/edit/${slug}/unpublish`, slug, { method: 'POST', key })).status, 200);

  // Preview: the panel's token comes with the state of a device-key session; the shared preview link still works.
  const token = (await panelState(slug, key)).data.state.previewToken as string;
  const draft = await siteRoute(new Request(`${BASE}/${slug}?preview=${encodeURIComponent(token)}`), { params: Promise.resolve({ slug }) });
  assert.equal(draft.status, 200);
  const shared = await siteRoute(new Request(`${BASE}/${slug}?preview=${encodeURIComponent(derivePreviewKey(s.editKey))}`), { params: Promise.resolve({ slug }) });
  assert.equal(shared.status, 200, 'the shared preview link made from the edit key keeps working');
  assert.equal(JSON.stringify((await panelState(slug, key)).data).includes(derivePreviewKey(s.editKey)), false, 'the long-lived preview key is never sent');

  // A wrong device key (right shape) is refused everywhere, like a wrong edit key.
  const wrong = `dv-${'A'.repeat(43)}`;
  for (const res of [
    await panelState(slug, wrong),
    await call(photoRoute, `/api/edit/${slug}/photo?slot=hero`, slug, { method: 'POST', key: wrong, body: Buffer.from(tinyPng()), headers: { 'content-type': 'image/png' } }),
    await call(repliesRoute, `/api/rsvp/${slug}/responses`, slug, { key: wrong }),
    await call(exportRoute, `/api/rsvp/${slug}/export?k=${wrong}`, slug),
    await call(devicesGet, `/api/edit/${slug}/devices`, slug, { key: wrong }),
    await call(googleRoute, `/api/edit/${slug}/google`, slug, { key: wrong }),
  ]) {
    assert.equal(res.status, 401);
  }
});

// ------------------------------------------------------------------------------------------------ reissue revokes

async function adminCookie(): Promise<string> {
  const res = await sessionPost(new Request(`${BASE}/api/admin/session`, { method: 'POST', headers: { 'content-type': 'application/json', host: 'localhost:3000', origin: BASE }, body: JSON.stringify({ password: PASSWORD }) }));
  assert.equal(res.status, 200);
  return (res.headers.get('set-cookie') ?? '').split(';')[0];
}

test('every key reissue revokes the device keys: admin "reissue", the reissue script, a /start retry', async () => {
  // admin
  const a = await newSite();
  const ka = keyOf((await cont({ orderNumber: a.order, email: 'avery@example.test' })).body.editPath);
  assert.equal((await panelState(a.slug, ka)).status, 200);
  const cookie = await adminCookie();
  const reissue = await adminAction(
    new Request(`${BASE}/api/admin/sites/${a.site.id}/reissue`, { method: 'POST', headers: { 'content-type': 'application/json', cookie, host: 'localhost:3000', origin: BASE }, body: '{}' }),
    { params: Promise.resolve({ id: a.site.id, action: 'reissue' }) },
  );
  assert.equal(reissue.status, 200);
  assert.equal((await panelState(a.slug, ka)).status, 401, 'device key revoked by the admin reissue');
  assert.equal(await getDataAdapter().readSiteDoc(a.site.id, DEVICE_DOC), null);

  // the operator script
  const b = await newSite();
  const kb = keyOf((await cont({ orderNumber: b.order, email: 'avery@example.test' })).body.editPath);
  await reissueEditLink(getDataAdapter(), { order: b.order, origin: BASE });
  assert.equal((await panelState(b.slug, kb)).status, 401, 'device key revoked by scripts/reissue-edit-key.ts');

  // the shop's own edit link (G145) does NOT change the buyer's keys: the buyer's devices stay signed in
  const c = await newSite();
  const kc = keyOf((await cont({ orderNumber: c.order, email: 'avery@example.test' })).body.editPath);
  await issueShopEditKey(getDataAdapter(), c.site.id);
  assert.equal((await panelState(c.slug, kc)).status, 200);
});

// ------------------------------------------------------------------------------------------------ /start with a used order

test('/start: an order that already has a website opens it for the same email (device key); another email gets 409 → /my', async () => {
  const order = freshOrder();
  const form = { theme: 'sample-design', orderNumber: order, email: 'mila@example.test', names: ['Mila', 'Theo'] };
  const first = await post(claimRoute, '/api/start', form);
  assert.equal(first.status, 201, JSON.stringify(first.body));
  const editKey = new URL(first.body.editUrl).searchParams.get('k')!;

  // another phone, same order + email (other case): G951 the choice — open the order's website or start one more (no
  // second website without asking, no new edit link); "open" signs this device in
  const choice = await post(claimRoute, '/api/start', { ...form, email: 'MILA@example.test', names: ['Other', 'Names'] });
  assert.equal(choice.status, 200, JSON.stringify(choice.body));
  assert.equal(choice.body.next, 'choose');
  assert.deepEqual(choice.body.sites, [{ slug: first.body.slug, names: 'Mila & Theo', design: 'Sample Design', sameDesign: true }]);
  assert.deepEqual(choice.body.add, { design: 'Sample Design', sameDesign: true });
  assert.equal(choice.body.editUrl, undefined);
  assert.equal(choice.body.editPath, undefined, 'no key before the buyer chooses');
  const again = await post(claimRoute, '/api/start', { ...form, email: 'MILA@example.test', names: ['Other', 'Names'], intent: 'open', openSlug: first.body.slug });
  assert.equal(again.status, 200, JSON.stringify(again.body));
  assert.equal(again.body.existing, true);
  assert.equal(again.body.slug, first.body.slug);
  assert.equal(again.body.editUrl, undefined);
  const deviceKey = keyOf(again.body.editPath);
  assert.ok(isDeviceKeyShape(deviceKey));
  assert.equal((await panelState(first.body.slug, deviceKey)).status, 200);
  assert.equal((await panelState(first.body.slug, editKey)).status, 200, 'the private edit link is unchanged');
  assert.equal((await getDataAdapter().findSitesByOrderRef(order)).length, 1);
  const devices = await listDevices(getDataAdapter(), (await getDataAdapter().getSiteBySlug(first.body.slug))!);
  assert.equal(devices[0].via, 'start');

  // another email: still "order used", and the message points to /my
  const other = await post(claimRoute, '/api/start', { ...form, email: 'someone@example.test' });
  assert.equal(other.status, 409);
  assert.equal(other.body.code, 'order_used');
  assert.match(other.body.message, /\/my/);
  assert.deepEqual(Object.keys(other.body).sort(), ['code', 'message', 'ok']);
});

// ------------------------------------------------------------------------------------------------ sign out other devices

test('"Sign out other devices": keeps the device in use and the edit link; from the edit link removes them all; not from the shop link', async () => {
  const s = await newSite();
  const login = async (ua: string) => keyOf((await cont({ orderNumber: s.order, email: 'avery@example.test' }, { ua })).body.editPath);
  const phone = await login(IPHONE);
  const laptop = await login('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36');
  const tablet = await login('');

  const list = await call(devicesGet, `/api/edit/${s.slug}/devices`, s.slug, { key: phone });
  assert.equal(list.status, 200);
  assert.equal(list.data.access, 'device');
  assert.equal(list.data.devices.length, 3);
  assert.equal(list.data.devices.filter((d: Json) => d.current).length, 1);
  assert.equal(list.data.devices.find((d: Json) => d.current).label, 'iPhone · Safari');
  assert.ok(!JSON.stringify(list.data).includes('hash'), 'no hashes in the answer');

  const out = await call(devicesPost, `/api/edit/${s.slug}/devices`, s.slug, { method: 'POST', key: phone, json: { action: 'sign-out-others' } });
  assert.equal(out.status, 200, JSON.stringify(out.data));
  assert.equal(out.data.removed, 2);
  assert.equal(out.data.devices.length, 1);
  assert.equal((await panelState(s.slug, phone)).status, 200, 'the device in use stays signed in');
  assert.equal((await panelState(s.slug, laptop)).status, 401);
  assert.equal((await panelState(s.slug, tablet)).status, 401);
  assert.equal((await panelState(s.slug, s.editKey)).status, 200, 'the private edit link is untouched');

  // The shop's own link can see but not sign the couple out.
  const shop = await issueShopEditKey(getDataAdapter(), s.site.id);
  const refused = await call(devicesPost, `/api/edit/${s.slug}/devices`, s.slug, { method: 'POST', key: shop.editKey, json: { action: 'sign-out-others' } });
  assert.equal(refused.status, 403);
  assert.equal((await panelState(s.slug, phone)).status, 200);

  // From the private edit link: every device key goes.
  const all = await call(devicesPost, `/api/edit/${s.slug}/devices`, s.slug, { method: 'POST', key: s.editKey, json: { action: 'sign-out-others' } });
  assert.equal(all.status, 200);
  assert.equal(all.data.removed, 1);
  assert.equal((await panelState(s.slug, phone)).status, 401);
  assert.equal(await getDataAdapter().readSiteDoc(s.site.id, DEVICE_DOC), null);
  assert.equal(await signOutOtherDevices(getDataAdapter(), s.site, null), 0);

  // bad requests
  assert.equal((await call(devicesPost, `/api/edit/${s.slug}/devices`, s.slug, { method: 'POST', key: s.editKey, json: { action: 'everything' } })).status, 400);
  assert.equal((await call(devicesPost, `/api/edit/${s.slug}/devices`, s.slug, { method: 'POST', key: s.editKey, body: 'x' })).status, 415);
});

// ------------------------------------------------------------------------------------------------ email sign-in link

class FakeMailer implements EditLinkMailer {
  readonly enabled = true;
  sent: EditLinkMessage[] = [];
  async send(m: EditLinkMessage) {
    this.sent.push(m);
    return { sent: true };
  }
}

test('"Email me a sign-in link": 503 without a mailer; with one, only the owner address gets a working signin link; the answer never differs', async () => {
  const s = await newSite();
  const off = await post(signInLinkRoute, '/api/my/signin-link', { orderNumber: s.order, email: 'avery@example.test' });
  assert.equal(off.status, 503);
  assert.equal(off.body.code, 'unavailable');

  const mailer = new FakeMailer();
  setEditLinkMailer(mailer);
  const ok = await post(signInLinkRoute, '/api/my/signin-link', { orderNumber: s.order, email: 'AVERY@example.test' });
  const wrong = await post(signInLinkRoute, '/api/my/signin-link', { orderNumber: s.order, email: 'thief@example.test' });
  const unknown = await post(signInLinkRoute, '/api/my/signin-link', { orderNumber: freshOrder(), email: 'avery@example.test' });
  for (const r of [ok, wrong, unknown]) {
    assert.equal(r.status, 200);
    assert.deepEqual(r.body, { ok: true, message: SIGN_IN_LINK_SENT });
  }
  assert.equal(mailer.sent.length, 1, 'only the matching request sends');
  const m = mailer.sent[0];
  assert.equal(m.kind, 'signin');
  assert.equal(m.to, s.site.ownerEmail, 'the owner address on record');
  assert.equal(m.orderNumber, s.order);
  const key = new URL(m.editUrl).searchParams.get('k')!;
  assert.ok(isDeviceKeyShape(key));
  assert.equal((await panelState(s.slug, key)).status, 200);
  assert.equal((await listDevices(getDataAdapter(), s.site))[0].via, 'email');

  // its own, smaller per-order limit
  for (let i = 1; i < DEFAULT_CONTINUE_LIMITS.signInLinksPerOrder.limit - 1; i++) await post(signInLinkRoute, '/api/my/signin-link', { orderNumber: s.order, email: 'avery@example.test' });
  assert.equal((await post(signInLinkRoute, '/api/my/signin-link', { orderNumber: s.order, email: 'avery@example.test' })).status, 429);
  const invalid = await post(signInLinkRoute, '/api/my/signin-link', { orderNumber: 'x', email: 'y' });
  assert.equal(invalid.status, 400);
});

// ------------------------------------------------------------------------------------------------ hand-overs in the tab

function memoryStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    map: m,
  };
}

test('remember.ts: the /my → /start prefill is read once and expires; the "opened for you" note is shown once for its site', () => {
  const store = memoryStorage();
  saveStartPrefill({ orderNumber: '1234567890', email: 'a@example.test' }, store);
  assert.ok(store.map.has(START_PREFILL_KEY));
  assert.deepEqual(takeStartPrefill(store), { orderNumber: '1234567890', email: 'a@example.test' });
  assert.equal(takeStartPrefill(store), null, 'once');
  saveStartPrefill({ orderNumber: '1234567890', email: 'a@example.test' }, store);
  assert.equal(takeStartPrefill(store, Date.now() + 31 * 60_000), null, 'older than 30 minutes');
  assert.equal(takeStartPrefill(null), null);

  markOpenedExisting('mila-and-theo', store);
  assert.equal(store.map.get(OPENED_EXISTING_KEY), 'mila-and-theo');
  assert.equal(takeOpenedExisting('other-site', store), false);
  assert.equal(takeOpenedExisting('mila-and-theo', store), true);
  assert.equal(takeOpenedExisting('mila-and-theo', store), false);
});

// ------------------------------------------------------------------------------------------------ texts in five languages

test('i18n: every G146 text is translated in tr / es / de / fr (strict, whatever I18N_STRICT says)', async () => {
  const files: Record<'panel' | 'market', string[]> = {
    panel: [
      'components/my/MyWebsite.tsx',
      'components/panel/DevicesCard.tsx',
      'components/panel/views.tsx',
      // G181: the Share view's own module (it was in views.tsx)
      'components/panel/ShareView.tsx',
      'components/panel/Panel.tsx',
      'lib/claim/continue.ts',
      'lib/claim/claim.ts',
      'lib/panel/devices.ts',
      'app/my/page.tsx',
      'app/start/StartForm.tsx',
      'app/edit/[slug]/not-found.tsx',
      'app/signin/page.tsx',
    ],
    market: ['components/marketing/Shell.tsx'],
  };
  const missing: string[] = [];
  for (const ns of ['panel', 'market'] as const) {
    const keys = new Set(files[ns].flatMap((f) => scanSource(readFileSync(path.join(PLATFORM_ROOT, f), 'utf8'))));
    for (const lang of ['tr', 'es', 'de', 'fr'] as const) {
      const dict = await loadDict(ns, lang);
      for (const k of keys) if (!dict[k]) missing.push(`${ns}/${lang}: ${JSON.stringify(k)}`);
    }
  }
  assert.deepEqual(missing, []);
  const market = await loadDict('market', 'tr');
  assert.equal(market['Create your website'], 'Davetiye siteni oluştur');
});
