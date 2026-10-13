// Vercel Blob adapter (G048): behaviour the shared contract tests (adapter.test.ts) cannot show —
// several server instances on one store, slug/order index races, ETag version conflicts, RSVP
// files and listing, photos, caching, credentials — plus the fake's fidelity to the real SDK.
// Everything runs against tests/fake-blob.ts; nothing here talks to Vercel.
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { inspect } from 'node:util';
import { BlobAccessError, BlobError, BlobPreconditionFailedError, BlobServiceNotAvailable } from '@vercel/blob';
import { claimSite } from '../lib/claim/claim.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { setEditLinkMailer } from '../lib/claim/mailer.ts';
import { setOrderVerifier } from '../lib/claim/verify.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { BlobAdapter, sdkBlobClient, type BlobAdapterOptions, type BlobClient } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { NotFoundError, OrderRefTakenError, SlugTakenError, WriteConflictError, type DataAdapter, type NewSite } from '../lib/data/types.ts';
import { hashKey } from '../lib/keys.ts';
import { rsvpCsvForSite, rsvpSummary } from '../lib/rsvp/couple.ts';
import { submitRsvp } from '../lib/rsvp/guest.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { seedSite } from '../scripts/seed.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const MISSING = '00000000-0000-4000-8000-000000000000';

before(() => {
  const themes = tmpDir('blob-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  // A claimable fixture theme (copy of _sample + its own demo record), as in claim.test.ts.
  const design = path.join(themes, 'sample-design');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), design, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(design, 'theme.json'), 'utf8'));
  manifest.id = 'sample-design';
  manifest.name = 'Fixture sample-design';
  delete manifest.internal;
  writeFileSync(path.join(design, 'theme.json'), JSON.stringify(manifest));
  writeFileSync(path.join(design, 'content.demo.json'), JSON.stringify(demoContent()));
  process.env.PLATFORM_THEMES_DIR = themes;
});

function newSite(slug: string, extra: Partial<NewSite> = {}): NewSite {
  return { slug, theme: '_sample', content: demoContent(), editKeyHash: hashKey('e'.repeat(43)), previewKeyHash: hashKey('p'.repeat(43)), ...extra };
}

/** One store, `n` adapters on it = `n` server instances (no shared in-process locks). */
function instances(n: number, opts: { fake?: FakeBlobStore; adapter?: Partial<BlobAdapterOptions> } = {}) {
  const fake = opts.fake ?? new FakeBlobStore({ jitterMs: 3 });
  const adapters = Array.from({ length: n }, () => new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1, ...opts.adapter }));
  return { fake, adapters };
}

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

// --- the fake vs the real SDK ------------------------------------------------------------------------

test('fake: client-side checks throw the same errors as the real @vercel/blob 2.8.0', async () => {
  const fake = new FakeBlobStore();
  const token = fake.token; // well-formed but fake; every case below fails before any network request
  const cases: [string, (c: BlobClient) => Promise<unknown>][] = [
    ['empty body', (c) => c.put('a.json', '', { access: 'private', token })],
    ['"//" in pathname', (c) => c.put('a//b.json', 'x', { access: 'private', token })],
    ['pathname too long', (c) => c.put(`${'a'.repeat(951)}.json`, 'x', { access: 'private', token })],
    ['access missing', (c) => c.put('a.json', 'x', { token } as never)],
    ['ifMatch + allowOverwrite:false', (c) => c.put('a.json', 'x', { access: 'private', token, ifMatch: '"e"', allowOverwrite: false })],
    ['del ifMatch with several pathnames', (c) => c.del(['a.json', 'b.json'], { token, ifMatch: '"e"' })],
    ['get without access', (c) => c.get('a.json', { token } as never)],
  ];
  for (const [label, call] of cases) {
    const real = await call(sdkBlobClient).then(
      () => assert.fail(`${label}: real SDK did not throw`),
      (e: unknown) => e,
    );
    const ours = await call(fake.client()).then(
      () => assert.fail(`${label}: fake did not throw`),
      (e: unknown) => e,
    );
    assert.ok(real instanceof BlobError, `${label}: real error type`);
    assert.ok(ours instanceof BlobError, `${label}: fake error type`);
    assert.equal((ours as Error).message, (real as Error).message, label);
  }
});

test('fake: overwrite, ETag, credentials and listing behave as documented', async () => {
  const fake = new FakeBlobStore();
  const c = fake.client();
  const token = fake.token;
  const first = await c.put('x/a.json', '{"v":1}', { access: 'private', token });
  assert.match(first.url, /^https:\/\/fakestore0123456\.private\.blob\.vercel-storage\.com\/x\/a\.json$/);
  assert.equal(first.contentType, 'application/json');
  await assert.rejects(c.put('x/a.json', '{"v":2}', { access: 'private', token }), (e: unknown) => e instanceof BlobError && /already exists/.test((e as Error).message));
  await assert.rejects(c.put('x/a.json', '{"v":2}', { access: 'private', token, ifMatch: '"stale"' }), BlobPreconditionFailedError);
  await assert.rejects(c.put('x/new.json', '{"v":2}', { access: 'private', token, ifMatch: first.etag }), BlobPreconditionFailedError, 'ifMatch on a missing blob');
  const second = await c.put('x/a.json', '{"v":2}', { access: 'private', token, ifMatch: first.etag });
  assert.notEqual(second.etag, first.etag);
  await c.put('x/a.json', '{"v":3}', { access: 'private', token, allowOverwrite: true });
  const suffixed = await c.put('x/a.json', '{"v":4}', { access: 'private', token, addRandomSuffix: true });
  assert.match(suffixed.pathname, /^x\/a-[A-Za-z0-9]+\.json$/);

  const got = await c.get('x/a.json', { access: 'private', token, useCache: false });
  assert.equal(got?.statusCode, 200);
  assert.equal(await new Response(got!.stream as ReadableStream).text(), '{"v":3}');
  assert.equal(await c.get('x/missing.json', { access: 'private', token }), null);

  await assert.rejects(c.get('x/a.json', { access: 'private', token: 'vercel_blob_rw_other_secret' }), BlobAccessError);
  const saved = process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  try {
    await assert.rejects(c.get('x/a.json', { access: 'private' }), (e: unknown) => e instanceof BlobError && /No blob credentials/.test((e as Error).message));
  } finally {
    if (saved !== undefined) process.env.BLOB_READ_WRITE_TOKEN = saved;
  }

  for (let i = 0; i < 5; i++) await c.put(`y/${i}.json`, '{}', { access: 'private', token });
  fake.listPageCap = 2;
  const page1 = await c.list({ prefix: 'y/', token });
  assert.deepEqual(page1.blobs.map((b) => b.pathname), ['y/0.json', 'y/1.json']);
  assert.equal(page1.hasMore, true);
  const page2 = await c.list({ prefix: 'y/', token, cursor: page1.cursor });
  assert.deepEqual(page2.blobs.map((b) => b.pathname), ['y/2.json', 'y/3.json']);

  await c.del('y/missing.json', { token }); // missing pathnames are ignored
  await assert.rejects(c.del('y/0.json', { token, ifMatch: '"stale"' }), BlobPreconditionFailedError);
  await c.del(['y/0.json', 'y/1.json'], { token });
  assert.equal(fake.has('y/0.json'), false);
});

// --- indexes: slugs and order numbers across server instances --------------------------------------

test('blob: slug race across server instances — exactly one site, no leftovers', async () => {
  const { fake, adapters } = instances(3);
  const results = await Promise.allSettled(adapters.flatMap((a) => [a, a, a].map((x) => x.createSite(newSite('race-slug')))));
  const won = results.filter((r) => r.status === 'fulfilled');
  assert.equal(won.length, 1);
  assert.ok(results.every((r) => r.status === 'fulfilled' || r.reason instanceof SlugTakenError));
  assert.deepEqual(fake.paths().filter((p) => p.startsWith('sites/')).length, 1);
  assert.deepEqual(fake.paths().filter((p) => p.startsWith('slugs/')), ['slugs/race-slug.json']);
  const winner = (won[0] as PromiseFulfilledResult<{ id: string }>).value;
  for (const a of adapters) assert.equal((await a.getSiteBySlug('race-slug'))?.id, winner.id);
});

test('blob: one site per order reference across instances; losers release their slug', async () => {
  const { fake, adapters } = instances(3);
  const slugs = ['ava-and-noah', 'ava-and-noah-2', 'ava-and-noah-3', 'mia-and-leo', 'mia-and-leo-2', 'mia-and-leo-3'];
  const results = await Promise.allSettled(slugs.map((slug, i) => adapters[i % 3].createSite(newSite(slug, { orderRef: '4012345678' }))));
  const won = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  assert.equal(won.length, 1);
  assert.ok(results.every((r) => r.status === 'fulfilled' || r.reason instanceof OrderRefTakenError));
  assert.deepEqual(fake.paths().filter((p) => p.startsWith('slugs/')), [`slugs/${won[0].slug}.json`], 'losing slugs released');
  assert.deepEqual(fake.paths().filter((p) => p.startsWith('orders/')), ['orders/4012345678.json']);
  assert.deepEqual((await adapters[2].findSitesByOrderRef('4012345678')).map((s) => s.id), [won[0].id]);
  const loser = slugs.find((s) => s !== won[0].slug)!;
  assert.ok(await adapters[0].createSite(newSite(loser)), 'a released slug can be used again');
  await assert.rejects(adapters[1].createSite(newSite('third-try', { orderRef: '4012345678' })), OrderRefTakenError);
  assert.equal(fake.has('slugs/third-try.json'), false);
});

test('blob: unusual order references get a hashed index name; null orderRef has no index', async () => {
  const { fake, adapters } = instances(1);
  const [a] = adapters;
  const odd = await a.createSite(newSite('odd-ref', { orderRef: 'Order #12/34 ../x' }));
  await a.createSite(newSite('no-ref'));
  const orders = fake.paths().filter((p) => p.startsWith('orders/'));
  assert.equal(orders.length, 1);
  assert.match(orders[0], /^orders\/h-[0-9a-f]{64}\.json$/);
  assert.deepEqual((await a.findSitesByOrderRef('Order #12/34 ../x')).map((s) => s.id), [odd.id]);
  await assert.rejects(a.createSite(newSite('odd-ref-2', { orderRef: 'Order #12/34 ../x' })), OrderRefTakenError);
});

test('blob: a failed site write releases the slug and order indexes', async () => {
  const { fake, adapters } = instances(1);
  fake.beforePut = (p) => {
    if (p.startsWith('sites/')) throw new BlobServiceNotAvailable();
  };
  await assert.rejects(adapters[0].createSite(newSite('half-made', { orderRef: '4099999999' })), BlobServiceNotAvailable);
  assert.deepEqual(fake.paths(), []);
  fake.beforePut = null;
  assert.ok(await adapters[0].createSite(newSite('half-made', { orderRef: '4099999999' })));
});

test('blob: an index left by a crashed instance is reclaimed only after the grace period', async () => {
  let clock = Date.parse('2027-01-10T12:00:00Z');
  const fake = new FakeBlobStore({ now: () => clock });
  const { adapters } = instances(1, { fake, adapter: { now: () => clock, orphanGraceMs: 120_000 } });
  const [a] = adapters;
  const ghost = '11111111-2222-4333-8444-555555555555';
  fake.seed('slugs/lost-pair.json', JSON.stringify({ id: ghost }));
  fake.seed('orders/4077777777.json', JSON.stringify({ id: ghost }));
  assert.equal(await a.getSiteBySlug('lost-pair'), null, 'an index without a site is not a site');
  assert.deepEqual(await a.findSitesByOrderRef('4077777777'), []);
  await assert.rejects(a.createSite(newSite('lost-pair')), SlugTakenError, 'too young: maybe still being created');
  clock += 121_000;
  const site = await a.createSite(newSite('lost-pair', { orderRef: '4077777777' }));
  assert.equal(JSON.parse(fake.text('slugs/lost-pair.json')!).id, site.id);
  assert.equal(JSON.parse(fake.text('orders/4077777777.json')!).id, site.id);
});

test('blob: our own index from an SDK retry (lost response) is not "taken"', async () => {
  const { fake, adapters } = instances(1);
  let lost = false;
  fake.beforePut = (p, body) => {
    if (p === 'slugs/lost-reply.json' && !lost) {
      lost = true;
      fake.seed(p, String(body)); // the first attempt reached the store, its answer did not
    }
  };
  const site = await adapters[0].createSite(newSite('lost-reply'));
  assert.equal((await adapters[0].getSiteBySlug('lost-reply'))?.id, site.id);
});

// --- versions and ETag conflicts -------------------------------------------------------------------

test('blob: concurrent writers on different instances — every write lands, version counts them', async () => {
  // Three instances keep colliding on purpose; generous attempts keep the test deterministic.
  const { fake, adapters } = instances(3, { adapter: { maxWriteAttempts: 40, retryDelayMs: () => Math.random() * 4 } });
  const site = await adapters[0].createSite(newSite('busy-site'));
  const writes = Array.from({ length: 12 }, (_, i) => {
    const c = demoContent();
    c.host_line = `v${i}`;
    return adapters[i % 3].updateContent(site.id, c);
  });
  await Promise.all([...writes, adapters[1].publish(site.id)]);
  const stored = JSON.parse(fake.text(`sites/${site.id}.json`)!);
  assert.equal(stored.version, 1 + 12 + 1);
  assert.equal(stored.status, 'published');
  assert.match(stored.content.host_line, /^v\d+$/);
  assert.equal('version' in (await adapters[2].getSiteById(site.id))!, false, 'version stays inside the adapter');
});

test('blob: a stale write is retried on fresh data (no lost update)', async () => {
  const { fake, adapters } = instances(2, { fake: new FakeBlobStore() });
  const [a, b] = adapters;
  const site = await a.createSite(newSite('stale-write'));
  let interfered = false;
  fake.beforePut = async (p) => {
    if (p === `sites/${site.id}.json` && !interfered) {
      interfered = true; // instance B publishes between A's read and A's write
      await b.publish(site.id);
    }
  };
  const c = demoContent();
  c.host_line = 'edited on A';
  const result = await a.updateContent(site.id, c);
  assert.equal(result.content.host_line, 'edited on A');
  assert.equal(result.status, 'published', "B's publish is kept");
  const stored = JSON.parse(fake.text(`sites/${site.id}.json`)!);
  assert.equal(stored.version, 3);
  assert.equal(stored.status, 'published');
  const puts = fake.calls.filter((x) => x.op === 'put' && x.pathname === `sites/${site.id}.json`);
  assert.ok(puts.slice(1).every((x) => typeof x.options.ifMatch === 'string' && x.options.allowOverwrite === undefined), 'updates are conditional');
});

test('blob: when every write is stale, WriteConflictError after maxWriteAttempts', async () => {
  const { fake, adapters } = instances(1, { fake: new FakeBlobStore(), adapter: { maxWriteAttempts: 3 } });
  const [a] = adapters;
  const site = await a.createSite(newSite('hot-site'));
  const before = fake.text(`sites/${site.id}.json`)!;
  let attempts = 0;
  fake.beforePut = (p) => {
    if (p !== `sites/${site.id}.json`) return;
    attempts++;
    fake.seed(p, before); // someone rewrites it every time -> new ETag
  };
  await assert.rejects(a.publish(site.id), WriteConflictError);
  assert.equal(attempts, 3);
  assert.equal(JSON.parse(fake.text(`sites/${site.id}.json`)!).status, 'draft', 'nothing of ours was written');
});

test('blob: a site deleted mid-update is not brought back', async () => {
  const { fake, adapters } = instances(2, { fake: new FakeBlobStore() });
  const [a, b] = adapters;
  const site = await a.createSite(newSite('gone-site'));
  let done = false;
  fake.beforePut = async (p) => {
    if (p === `sites/${site.id}.json` && !done) {
      done = true;
      await b.deleteSite(site.id);
    }
  };
  await assert.rejects(a.updateContent(site.id, demoContent()), NotFoundError);
  assert.deepEqual(fake.paths(), []);
});

test('blob: JSON is read from origin (useCache:false), so a lagging CDN copy is never served', async () => {
  const fake = new FakeBlobStore({ staleCdn: true });
  const { adapters } = instances(1, { fake });
  const [a] = adapters;
  const site = await a.createSite(newSite('fresh-read'));
  // A CDN read (no useCache:false) caches version 1 of the site and of the slug index.
  await fake.get(`sites/${site.id}.json`, { access: 'private', token: fake.token });
  await fake.get('slugs/fresh-read.json', { access: 'private', token: fake.token });
  const from = fake.calls.length;
  const c = demoContent();
  c.host_line = 'after the edit';
  await a.updateContent(site.id, c);
  await a.saveRsvp(site.id, { name: 'G', attending: true, guests: 1 });
  assert.equal((await a.getSiteById(site.id))?.content.host_line, 'after the edit');
  assert.equal((await a.getSiteBySlug('fresh-read'))?.content.host_line, 'after the edit');
  assert.equal((await a.listRsvps(site.id)).length, 1);
  const adapterJsonGets = fake.calls.slice(from).filter((x) => x.op === 'get');
  assert.ok(adapterJsonGets.length >= 5);
  assert.ok(adapterJsonGets.every((x) => x.pathname!.endsWith('.json') && x.options.useCache === false));
  const cached = await fake.get(`sites/${site.id}.json`, { access: 'private', token: fake.token });
  const lagging = JSON.parse(await new Response(cached!.stream as ReadableStream).text());
  assert.notEqual(lagging.content.host_line, 'after the edit', 'the fake CDN copy does lag, as documented');
});

// --- RSVPs -------------------------------------------------------------------------------------------

test('blob: RSVPs are one file each; concurrent replies from several instances are all kept', async () => {
  const { fake, adapters } = instances(3);
  const site = await adapters[0].createSite(newSite('many-replies'));
  const other = await adapters[0].createSite(newSite('quiet-site'));
  await Promise.all(Array.from({ length: 30 }, (_, i) => adapters[i % 3].saveRsvp(site.id, { name: `Guest ${i}`, attending: i % 2 === 0, guests: i % 2 === 0 ? 1 : 0 })));
  await adapters[1].saveRsvp(other.id, { name: 'Elsewhere', attending: true, guests: 2 });
  const files = fake.paths().filter((p) => p.startsWith(`rsvps/${site.id}/`));
  assert.equal(files.length, 30);
  assert.ok(files.every((p) => /^rsvps\/[0-9a-f-]{36}\/\d{13}-\d{6}-[0-9a-f-]{36}\.json$/.test(p)), files[0]);
  fake.listPageCap = 7; // the adapter must follow the cursor
  const list = await adapters[2].listRsvps(site.id);
  assert.equal(list.length, 30);
  assert.deepEqual(new Set(list.map((r) => r.name)).size, 30);
  assert.ok(list.every((r) => r.siteId === site.id));
  for (let i = 1; i < list.length; i++) assert.ok(list[i - 1].createdAt <= list[i].createdAt, 'oldest first');
  assert.deepEqual((await adapters[0].listRsvps(other.id)).map((r) => r.name), ['Elsewhere']);
  assert.deepEqual(await adapters[0].listRsvps(MISSING), []);
});

test('blob: same-millisecond replies keep their order', async () => {
  const fixed = Date.parse('2027-03-01T10:00:00Z');
  const { adapters } = instances(1, { fake: new FakeBlobStore(), adapter: { now: () => fixed } });
  const [a] = adapters;
  const site = await a.createSite(newSite('same-ms'));
  for (const name of ['First', 'Second', 'Third']) await a.saveRsvp(site.id, { name, attending: true, guests: 1 });
  const list = await a.listRsvps(site.id);
  assert.deepEqual(list.map((r) => r.name), ['First', 'Second', 'Third']);
  assert.ok(list.every((r) => r.createdAt === '2027-03-01T10:00:00.000Z'));
});

// --- photos, privacy, credentials ------------------------------------------------------------------

test('blob: photos are private blobs under media/<site>/, served through /media by readPhoto', async () => {
  const { fake, adapters } = instances(1, { fake: new FakeBlobStore() });
  const [a] = adapters;
  const site = await a.createSite(newSite('photo-site'));
  const other = await a.createSite(newSite('other-photos'));
  const png = tinyPng();
  const saved = await a.savePhoto(site.id, { bytes: png });
  const stored = fake.object(`media/${saved.path}`);
  assert.ok(stored, saved.path);
  assert.equal(stored.access, 'private');
  assert.equal(stored.contentType, 'image/png');
  assert.equal(stored.cacheControlMaxAge, 365 * 24 * 60 * 60);
  assert.deepEqual(Buffer.from(stored.bytes), Buffer.from(png));
  assert.deepEqual(Buffer.from((await a.readPhoto(saved.path))!.bytes), Buffer.from(png));
  assert.equal(await a.readPhoto(saved.path.replace(site.id, other.id)), null, "another site's folder");
  const view = new Uint8Array(png.length + 10);
  view.set(png, 5);
  const sub = await a.savePhoto(site.id, { bytes: view.subarray(5, 5 + png.length) });
  assert.deepEqual(Buffer.from(fake.object(`media/${sub.path}`)!.bytes), Buffer.from(png), 'a Uint8Array view is stored exactly');
});

test('blob: every call is private and authenticated; the token never shows up', async () => {
  const fake = new FakeBlobStore();
  const a = new BlobAdapter({ token: fake.token, client: fake.client() });
  const { site } = await createSiteWithKeys(a, { slug: 'quiet-pair', theme: '_sample', content: demoContent(), orderRef: '4011112222' });
  await a.updateContent(site.id, demoContent());
  await a.publish(site.id);
  await a.saveRsvp(site.id, { name: 'G', attending: true, guests: 1 });
  await a.listRsvps(site.id);
  const photo = await a.savePhoto(site.id, { bytes: tinyPng() });
  await a.readPhoto(photo.path);
  await a.deleteSite(site.id);
  assert.ok(fake.calls.length > 10);
  for (const call of fake.calls) {
    assert.equal(call.options.hasToken, true, `${call.op} ${call.pathname}`);
    if (call.op === 'put' || call.op === 'get') assert.equal(call.options.access, 'private', `${call.op} ${call.pathname}`);
  }
  assert.deepEqual(fake.paths(), []);
  for (const text of [inspect(a, { depth: 5, showHidden: true }), JSON.stringify(a), String(a), Object.keys(a).join()]) {
    assert.ok(!text.includes(fake.token), 'token is not exposed');
  }
  const wrong = new BlobAdapter({ token: 'vercel_blob_rw_fakestore0123456_wrong', client: fake.client() });
  await assert.rejects(wrong.getSiteById(MISSING), (e: unknown) => e instanceof BlobAccessError && !String((e as Error).message).includes('wrong'));
});

test('getDataAdapter: DATA_ADAPTER=blob needs a token, never prints it, keeps one instance', () => {
  const keep = { DATA_ADAPTER: process.env.DATA_ADAPTER, BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN, BLOB_STORE_ID: process.env.BLOB_STORE_ID };
  try {
    process.env.DATA_ADAPTER = 'blob';
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.BLOB_STORE_ID;
    assert.throws(() => getDataAdapter(), /DATA_ADAPTER=blob needs BLOB_READ_WRITE_TOKEN/);
    const secret = 'vercel_blob_rw_fakestore0123456_s3cr3tvalue';
    process.env.BLOB_READ_WRITE_TOKEN = secret;
    const adapter = getDataAdapter(); // no network on construction
    assert.equal(adapter.kind, 'blob');
    assert.ok(adapter instanceof BlobAdapter);
    assert.equal(getDataAdapter(), adapter);
    assert.ok(!inspect(adapter, { depth: 5, showHidden: true }).includes('s3cr3t'));
    process.env.DATA_ADAPTER = 'local';
    assert.equal(getDataAdapter().kind, 'local');
  } finally {
    for (const [k, v] of Object.entries(keep)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
});

// --- the app's flows on the blob adapter -------------------------------------------------------------

test('blob: claim maps a lost order race (OrderRefTakenError) to 409 order_used', async () => {
  setClaimRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  setEditLinkMailer(null);
  const fake = new FakeBlobStore();
  const blob = new BlobAdapter({ token: fake.token, client: fake.client() });
  const ctx = { adapter: blob, origin: 'http://localhost:3000', ip: '203.0.113.9' };
  const form = { theme: 'sample-design', orderNumber: '4055555555', email: 'avery@example.test', names: ['Avery', 'Jordan'] };
  const first = await claimSite(ctx, form);
  assert.equal(first.status, 201, JSON.stringify(first.body));
  assert.equal((await blob.findSitesByOrderRef('4055555555')).length, 1);
  // Same order via the normal path: the order index answers findSitesByOrderRef.
  const again = await claimSite(ctx, { ...form, names: ['Other', 'Pair'] });
  assert.equal(again.status, 409);
  assert.equal(again.body.code, 'order_used');
  // Another instance whose check ran before the first site existed: createSite itself refuses.
  const blind = new Proxy(blob, {
    get(target, key) {
      if (key === 'findSitesByOrderRef') return async () => [];
      const value = Reflect.get(target, key, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as DataAdapter;
  const raced = await claimSite({ ...ctx, adapter: blind, ip: '203.0.113.10' }, { ...form, names: ['Third', 'Pair'] });
  assert.equal(raced.status, 409);
  assert.equal(raced.body.code, 'order_used');
  assert.equal(await blob.getSiteBySlug('third-and-pair'), null, 'its slug was released');
  assert.equal(fake.paths().filter((p) => p.startsWith('sites/')).length, 1);
});

test('blob: publish -> guest RSVP -> couple summary and CSV', async () => {
  const fake = new FakeBlobStore();
  const blob = new BlobAdapter({ token: fake.token, client: fake.client() });
  const content: ContentRecord = demoContent();
  content.rsvp.deadline = isoDay(300);
  content.date = isoDay(400);
  const { site } = await createSiteWithKeys(blob, { slug: 'rsvp-flow', theme: '_sample', content });
  await publishSite(blob, site.id);
  const limiter = new MemoryRateLimiter();
  const send = (name: string, attending: string, ip: string) =>
    submitRsvp({ adapter: blob, limiter, ip }, 'rsvp-flow', { name, attending, ...(attending === 'yes' ? { guests: 2 } : {}) });
  assert.equal((await send('Rosa Bell', 'yes', '198.51.100.1')).status, 200);
  assert.equal((await send('Rosa Bell', 'yes', '198.51.100.1')).status, 200); // duplicate within 5 min: stored once
  assert.equal((await send('Tom Hale', 'no', '198.51.100.2')).status, 200);
  const fresh = (await blob.getSiteById(site.id))!;
  const summary = await rsvpSummary(blob, fresh);
  assert.deepEqual(summary.responses.map((r) => r.name), ['Tom Hale', 'Rosa Bell']);
  assert.deepEqual(summary.counts, { responses: 2, attending: 1, notAttending: 1, totalGuests: 2, held: 0 });
  const { csv } = await rsvpCsvForSite(blob, fresh);
  assert.match(csv, /"Rosa Bell"/);
  assert.equal(fake.paths().filter((p) => p.startsWith(`rsvps/${site.id}/`)).length, 2);
});

test('seed script works on the blob adapter (re-seed replaces, two slugs coexist)', async () => {
  const fake = new FakeBlobStore();
  const blob = new BlobAdapter({ token: fake.token, client: fake.client() });
  const opts = { theme: '_sample', slug: 'clara-and-julian', content: demoContent(), draft: false, baseUrl: 'https://example.test/' };
  const one = await seedSite(blob, opts);
  assert.equal(one.status, 'published');
  assert.equal(one.site, 'https://example.test/clara-and-julian');
  assert.match(one.edit, /^https:\/\/example\.test\/edit\/clara-and-julian\?k=[A-Za-z0-9_-]{43}$/);
  const firstId = (await blob.getSiteBySlug('clara-and-julian'))!.id;
  const two = await seedSite(blob, opts);
  const secondId = (await blob.getSiteBySlug('clara-and-julian'))!.id;
  assert.notEqual(secondId, firstId);
  assert.notEqual(two.editKey, one.editKey);
  assert.equal(await blob.getSiteById(firstId), null);
  await seedSite(blob, { ...opts, slug: 'draft-demo', draft: true });
  assert.equal((await blob.getSiteBySlug('draft-demo'))?.status, 'draft');
  assert.equal((await blob.getSiteBySlug('clara-and-julian'))?.status, 'published');
  assert.deepEqual((await blob.findSitesByOrderRef('DEMO-SEED-draft-demo')).map((s) => s.slug), ['draft-demo']);

  // Sample photos go through the adapter like a buyer's upload (photoMax 0 = original bytes, no Pillow).
  const photos = tmpDir('blob-seed-photos-');
  writeFileSync(path.join(photos, 'hero.png'), tinyPng());
  writeFileSync(path.join(photos, 'story1.png'), tinyPng());
  const withPhotos = await seedSite(blob, { ...opts, slug: 'with-photos', photosDir: photos, photoMax: 0 });
  assert.equal(withPhotos.photos.length, 2);
  const site = (await blob.getSiteBySlug('with-photos'))!;
  assert.equal(site.id, withPhotos.siteId);
  const hero = site.publishedContent!.media.hero_portrait!;
  assert.match(hero, new RegExp(`^/media/${site.id}/[0-9a-f]{32}\\.png$`));
  assert.ok(fake.has(`media/${hero.slice('/media/'.length)}`));
  assert.deepEqual(Buffer.from((await blob.readPhoto(hero.slice('/media/'.length)))!.bytes), Buffer.from(tinyPng()));
  assert.equal(fake.paths().filter((p) => p.startsWith(`media/${site.id}/`)).length, 2);
});

after(() => {
  setClaimRateLimiter(new MemoryRateLimiter());
});
