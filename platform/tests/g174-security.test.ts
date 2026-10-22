// G174 — the three open notes of the G172 security review (gorevler/G174-guvenlik-takip.md):
//   1. guest password: wrong tries for one website are also counted across ALL addresses (distributed guessing)
//   2. etsy mode: /start answers repeated tries for one order number from a short-lived cache (Etsy quota)
//   3. music upload: parts of uploads never assembled are removed after 24 h (an upload in progress is kept)
// Etsy is a fake fetch: nothing leaves the machine.
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readdirSync, readFileSync, utimesSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { POST as siteUnlock } from '../app/[slug]/route.ts';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { POST as musicRoute } from '../app/api/edit/[slug]/music/route.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { setOrderVerifier } from '../lib/claim/verify.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { setEtsyFetch } from '../lib/etsy/client.ts';
import { ORDER_CACHE_DOC, ORDER_CACHE_TTL } from '../lib/etsy/order-cache.ts';
import { disconnectEtsy, finishEtsyConnect, SHOP_DOC_ID, startEtsyConnect } from '../lib/etsy/shop.ts';
import { EtsyOrderVerifier } from '../lib/etsy/verify.ts';
import { MUSIC_PART_BYTES, PART_MAX_AGE_MS } from '../lib/panel/music.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { ACCESS_LIMITS, setAccessRateLimiter, setGuestAccess } from '../lib/site/access.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';
const PASSWORD = 'OliveRiver27';
const SHOP_ID = 222;
const USER_ID = 111;
const ETSY_ENV = { ETSY_API_KEY: 'test-keystring-g174', ETSY_SHARED_SECRET: 'test-shared-secret-g174', GOOGLE_TOKEN_KEY: 'cd'.repeat(32) };
type Json = Record<string, any>;

let dataDir = '';
before(() => {
  const themes = tmpDir('g174-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  const dir = path.join(themes, 'sample-design');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), dir, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(dir, 'theme.json'), 'utf8'));
  manifest.id = 'sample-design';
  manifest.name = 'Fixture sample-design';
  delete manifest.internal;
  writeFileSync(path.join(dir, 'theme.json'), JSON.stringify(manifest));
  writeFileSync(path.join(dir, 'content.demo.json'), JSON.stringify(demoContent()));
  process.env.PLATFORM_THEMES_DIR = themes;
  dataDir = tmpDir('g174-data-');
  process.env.PLATFORM_DATA_DIR = dataDir;
  delete process.env.PLATFORM_PUBLIC_URL;
});

beforeEach(async () => {
  setClaimRateLimiter(new MemoryRateLimiter());
  setAccessRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  for (const k of [...Object.keys(ETSY_ENV), 'CLAIM_ORDER_VERIFICATION']) delete process.env[k];
});

after(() => {
  setEtsyFetch(null);
  setAccessRateLimiter(null);
  setClaimRateLimiter(null);
  for (const k of [...Object.keys(ETSY_ENV), 'CLAIM_ORDER_VERIFICATION']) delete process.env[k];
});

let counter = 0;

// ---------------------------------------------------------------------------------------------
// 1. guest password: per-site limit across addresses

test('guest password: wrong tries from many addresses fill a per-site window; then every address waits, other sites open', async () => {
  const limiter = new MemoryRateLimiter();
  setAccessRateLimiter(limiter);
  const protect = async () => {
    const slug = `g174-gate-${++counter}`;
    const s = await createSiteWithKeys(getDataAdapter(), { slug, theme: '_sample', content: demoContent() });
    await publishSite(getDataAdapter(), s.site.id);
    await setGuestAccess(getDataAdapter(), s.site.id, { enabled: true, password: PASSWORD });
    return { slug, id: s.site.id };
  };
  const unlock = (slug: string, password: string, ip: string) =>
    siteUnlock(
      new Request(`${BASE}/${slug}`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-forwarded-for': ip },
        body: new URLSearchParams({ site_access: '1', password }).toString(),
      }),
      { params: Promise.resolve({ slug }) },
    );
  const site = await protect();
  const other = await protect();
  const rule = ACCESS_LIMITS.wrongPerSite;
  assert.ok(rule.limit >= 150 * 2, 'a real wedding (150 guests, a few typos each) stays below the limit');

  // wrong tries from two addresses land in the same per-site window; the right password is never counted
  assert.equal((await unlock(site.slug, 'wrong-a', '198.51.100.1')).status, 401);
  assert.equal((await unlock(site.slug, 'wrong-b', '198.51.100.2')).status, 401);
  assert.equal((await unlock(site.slug, PASSWORD, '198.51.100.3')).status, 303);
  const key = `access:wrong-site:${site.id}`;
  assert.equal((await limiter.peek(key, rule)).remaining, rule.limit - 2);

  // a botnet spends the rest of the window (one or two tries per address: the per-address limits never trigger)
  for (let i = 2; i < rule.limit; i++) await limiter.hit(key, rule);
  const locked = await unlock(site.slug, PASSWORD, '203.0.113.200');
  assert.equal(locked.status, 429, 'a fresh address with the right password waits too');
  assert.match(await locked.text(), /Too many tries\. Please wait \d+ minutes? and try again\./);
  assert.ok(Number(locked.headers.get('retry-after')) > 0);
  assert.equal(locked.headers.get('set-cookie'), null);
  assert.equal((await unlock(other.slug, PASSWORD, '203.0.113.200')).status, 303, 'another website is not affected');
});

test('guest password: the "too many tries" message exists in every site language', () => {
  const msg = 'Too many tries. Please wait 1 minute and try again.|Too many tries. Please wait {n} minutes and try again.';
  for (const lang of ['de', 'es', 'fr', 'tr']) {
    const text = readFileSync(path.join(PLATFORM_ROOT, 'lib/i18n/dict/site', `${lang}.ts`), 'utf8');
    assert.ok(text.includes(`'${msg}': '`), `${lang} has the message`);
  }
});

// ---------------------------------------------------------------------------------------------
// 2. Etsy order cache

function fakeEtsy() {
  const receipts = new Map<string, { status: number; body: unknown }>();
  const reads: string[] = [];
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  const fetch = async (input: string, init: RequestInit): Promise<Response> => {
    const url = new URL(input);
    if (url.href === 'https://api.etsy.com/v3/public/oauth/token') {
      return reply(200, { access_token: 'acc-token-1', token_type: 'Bearer', expires_in: 3600, refresh_token: 'ref-token-1' });
    }
    if (!/^Bearer acc-token-\d+$/.test(new Headers(init.headers).get('authorization') ?? '')) return reply(401, { error: 'invalid_token' });
    if (url.pathname === '/v3/application/users/me') return reply(200, { user_id: USER_ID, shop_id: SHOP_ID });
    if (url.pathname === `/v3/application/shops/${SHOP_ID}`) return reply(200, { shop_id: SHOP_ID, shop_name: 'FixtureShop' });
    const m = new RegExp(`^/v3/application/shops/${SHOP_ID}/receipts/(\\d+)$`).exec(url.pathname);
    if (m) {
      reads.push(m[1]);
      const r = receipts.get(m[1]);
      return r ? reply(r.status, r.body) : reply(404, { error: 'not found' });
    }
    return reply(404, { error: 'unknown path' });
  };
  return { receipts, reads, fetch };
}

const paidReceipt = (order: string, over: Json = {}): Json => ({
  receipt_id: Number(order),
  seller_user_id: USER_ID,
  buyer_email: 'Avery@Example.test',
  status: 'paid',
  is_paid: true,
  transactions: [{ listing_id: 555 }],
  ...over,
});

async function connectedEtsy() {
  Object.assign(process.env, ETSY_ENV);
  const fake = fakeEtsy();
  setEtsyFetch(fake.fetch);
  const adapter = getDataAdapter();
  await disconnectEtsy(adapter);
  const { state } = await startEtsyConnect(adapter, BASE);
  assert.deepEqual(await finishEtsyConnect(adapter, { state, code: 'good-code', error: null, cookieState: state }, BASE), { ok: true, shopName: 'FixtureShop' });
  fake.reads.length = 0;
  return fake;
}

test('etsy cache: /start tries answer from the cache (10 min paid, 2 min other); errors and re-checks always ask Etsy; no address or receipt stored', async () => {
  const fake = await connectedEtsy();
  let clock = Date.parse('2027-03-01T10:00:00Z');
  const v = new EtsyOrderVerifier({ now: () => clock });
  const check = (orderNumber: string, over: Json = {}) => v.check({ orderNumber, email: 'avery@example.test', theme: 'sample-design', cached: true, ...over });

  // paid: one Etsy read, then the cache — the email and design still decide per try
  fake.receipts.set('9100000001', { status: 200, body: paidReceipt('9100000001') });
  assert.deepEqual(await check('9100000001'), { result: 'verified', units: 1 });
  assert.deepEqual(await check('9100000001'), { result: 'verified', units: 1 });
  assert.deepEqual(await check('9100000001', { email: 'AVERY@example.test' }), { result: 'verified', units: 1 });
  assert.deepEqual(await check('9100000001', { email: 'guess@example.test' }), { result: 'rejected', reason: 'email_mismatch' });
  assert.deepEqual(fake.reads, ['9100000001'], 'Etsy read once for four tries');
  clock += ORDER_CACHE_TTL.paidMs - 1000;
  await check('9100000001');
  assert.equal(fake.reads.length, 1, 'still fresh just before 10 minutes');
  clock += 2000;
  await check('9100000001');
  assert.equal(fake.reads.length, 2, 'asked again after 10 minutes');

  // not found: cached for 2 minutes only
  assert.deepEqual(await check('9100000002'), { result: 'rejected', reason: 'not_found' });
  fake.receipts.set('9100000002', { status: 200, body: paidReceipt('9100000002') });
  assert.deepEqual(await check('9100000002'), { result: 'rejected', reason: 'not_found' }, 'the cached answer');
  assert.equal(fake.reads.filter((o) => o === '9100000002').length, 1);
  clock += ORDER_CACHE_TTL.otherMs + 1000;
  assert.deepEqual(await check('9100000002'), { result: 'verified', units: 1 }, 'after 2 minutes Etsy is asked again');

  // unpaid: also 2 minutes (a buyer who pays now is not held up long)
  fake.receipts.set('9100000003', { status: 200, body: paidReceipt('9100000003', { is_paid: false, status: 'open' }) });
  assert.deepEqual(await check('9100000003'), { result: 'pending', units: 1, unpaid: true });
  fake.receipts.set('9100000003', { status: 200, body: paidReceipt('9100000003') });
  clock += ORDER_CACHE_TTL.otherMs + 1000;
  assert.deepEqual(await check('9100000003'), { result: 'verified', units: 1 });

  // transient Etsy errors are never cached
  fake.receipts.set('9100000004', { status: 503, body: { error: 'down' } });
  const errors = console.error;
  console.error = () => undefined;
  try {
    assert.deepEqual(await check('9100000004'), { result: 'unavailable' });
    assert.deepEqual(await check('9100000004'), { result: 'unavailable' });
  } finally {
    console.error = errors;
  }
  assert.equal(fake.reads.filter((o) => o === '9100000004').length, 2);
  fake.receipts.set('9100000004', { status: 200, body: paidReceipt('9100000004') });
  assert.deepEqual(await check('9100000004'), { result: 'verified', units: 1 }, 'Etsy back: answered at once');

  // re-checks (admin, panel poll, Publish) never use the cache
  const before = fake.reads.length;
  await check('9100000001', { cached: undefined });
  assert.equal(fake.reads.length, before + 1);

  // what is stored: hashes and facts only
  const doc = JSON.stringify(await getDataAdapter().readSiteDoc(SHOP_DOC_ID, ORDER_CACHE_DOC));
  assert.ok(doc.includes('"found":true'), 'the cache document exists');
  for (const secret of ['avery', 'Avery', '9100000001', 'acc-token', 'ref-token', 'transactions', 'receipt']) assert.ok(!doc.includes(secret), `no "${secret}" in the cache`);
});

test('etsy cache: repeated /start POSTs for one order number read the receipt from Etsy once', async () => {
  const fake = await connectedEtsy();
  process.env.CLAIM_ORDER_VERIFICATION = 'etsy';
  const order = '9200000001';
  fake.receipts.set(order, { status: 200, body: paidReceipt(order, { buyer_email: null, is_paid: false, status: 'open' }) });
  let ip = 0;
  const post = async (over: Json) => {
    const body = { theme: 'sample-design', orderNumber: order, email: 'avery@example.test', names: ['Avery', 'Jordan'], slug: '', website: '', ...over };
    const res = await claimRoute(new Request(`${BASE}/api/start`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': `192.0.2.${++ip}` }, body: JSON.stringify(body) }));
    return { status: res.status, body: (await res.json()) as Json };
  };
  const first = await post({});
  assert.equal(first.status, 201);
  assert.equal(first.body.orderPending, true);
  assert.equal((await post({ email: 'someone@example.test' })).status, 409, 'order used (another email)');
  assert.equal((await post({ email: 'other@example.test' })).status, 409);
  assert.equal(fake.reads.filter((o) => o === order).length, 1, 'one Etsy read for three /start tries');
});

// ---------------------------------------------------------------------------------------------
// 3. orphan music parts

test('music parts: a new upload removes this site\'s parts older than 24 h; an upload in progress and other sites are kept (local)', async () => {
  const adapter = getDataAdapter();
  const mk = async () => {
    const slug = `g174-music-${++counter}`;
    const s = await createSiteWithKeys(adapter, { slug, theme: '_sample', content: demoContent() });
    return { slug, id: s.site.id, key: s.editKey };
  };
  const a = await mk();
  const b = await mk();
  const part = new Uint8Array(16).fill(1);
  await adapter.putUploadPart!(a.id, 'a'.repeat(32), 0, part); // orphan: 25 h old
  await adapter.putUploadPart!(a.id, 'b'.repeat(32), 0, part); // in progress: 23 h old
  await adapter.putUploadPart!(b.id, 'c'.repeat(32), 0, part); // another site's orphan
  const dir = (id: string) => path.join(dataDir, 'upload-parts', id);
  const age = (id: string, name: string, ms: number) => utimesSync(path.join(dir(id), name), new Date(Date.now() - ms), new Date(Date.now() - ms));
  age(a.id, `${'a'.repeat(32)}-0`, PART_MAX_AGE_MS + 3600_000);
  age(a.id, `${'b'.repeat(32)}-0`, PART_MAX_AGE_MS - 3600_000);
  age(b.id, `${'c'.repeat(32)}-0`, PART_MAX_AGE_MS + 3600_000);

  // a new two-part music file on site a: its part 0 triggers the cleanup
  const res = await musicRoute(
    new Request(`${BASE}/api/edit/${a.slug}/music`, {
      method: 'POST',
      headers: { authorization: `Bearer ${a.key}`, 'content-type': 'application/octet-stream', 'x-upload-id': 'd'.repeat(32), 'x-upload-part': '0', 'x-upload-parts': '2', 'x-upload-type': 'audio/mpeg' },
      body: Buffer.concat([Buffer.from([0xff, 0xfb, 0x90, 0x00]), Buffer.alloc(MUSIC_PART_BYTES - 4)]),
    }),
    { params: Promise.resolve({ slug: a.slug }) },
  );
  assert.equal(res.status, 200, await res.clone().text());
  assert.deepEqual(readdirSync(dir(a.id)).sort(), [`${'b'.repeat(32)}-0`, `${'d'.repeat(32)}-0`], 'orphan gone; in-progress and the new part kept');
  assert.deepEqual(readdirSync(dir(b.id)), [`${'c'.repeat(32)}-0`], 'another site is untouched');
});

test('music parts: blob adapter removes only parts uploaded before the cutoff, only under the site\'s prefix', async () => {
  const clock = Date.parse('2027-03-01T10:00:00Z');
  const fake = new FakeBlobStore({ now: () => clock });
  const blob = new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1, now: () => clock });
  const site = '11111111-1111-4111-8111-111111111111';
  const other = '22222222-2222-4222-8222-222222222222';
  fake.seed(`parts/${site}/${'a'.repeat(32)}-0`, 'x', { uploadedAt: new Date(clock - PART_MAX_AGE_MS - 1) });
  fake.seed(`parts/${site}/${'a'.repeat(32)}-1`, 'x', { uploadedAt: new Date(clock - PART_MAX_AGE_MS - 60_000) });
  fake.seed(`parts/${site}/${'b'.repeat(32)}-0`, 'x', { uploadedAt: new Date(clock - 60_000) });
  fake.seed(`parts/${other}/${'c'.repeat(32)}-0`, 'x', { uploadedAt: new Date(clock - 3 * PART_MAX_AGE_MS) });
  fake.seed(`media/${site}/${'e'.repeat(32)}.mp3`, 'x', { uploadedAt: new Date(clock - 3 * PART_MAX_AGE_MS) });
  assert.equal(await blob.pruneUploadParts(site, clock - PART_MAX_AGE_MS), 2);
  const left = (await fake.client().list({ token: fake.token })).blobs.map((b) => b.pathname).sort();
  assert.deepEqual(left, [`media/${site}/${'e'.repeat(32)}.mp3`, `parts/${site}/${'b'.repeat(32)}-0`, `parts/${other}/${'c'.repeat(32)}-0`]);
  assert.equal(await blob.pruneUploadParts('not-a-uuid', clock), 0);
});
