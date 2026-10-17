// G151 (K47): (1) a private custom design (theme.json "private": {"orders": [...]}) — hidden from every public list,
// started only with a listed order number (others get the unknown-theme answer), always available to the shop admin,
// demo only with the admin session; (3) contentUpdatedAt — only content edits move it (both adapters), the admin's
// "Son değişiklik" and the "unpublished changes (2 days)" to-do use it, old records fall back to updatedAt.
// (2) — the "Good to know → + Dress code" chip — is checked on the panel source.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { GET as demoIndexRoute } from '../app/start/demo/[theme]/route.ts';
import { GET as demoPageRoute } from '../app/start/demo/[theme]/[page]/route.ts';
import { adminCreatableThemes, adminCreateSite } from '../lib/admin/create.ts';
import { ADMIN_COOKIE, newSessionToken } from '../lib/admin/auth.ts';
import { summarizeSite } from '../lib/admin/summary.ts';
import { adminDashboard } from '../lib/admin/view.ts';
import { claimSite } from '../lib/claim/claim.ts';
import { continueWithOrder } from '../lib/claim/continue.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { setEditLinkMailer } from '../lib/claim/mailer.ts';
import { claimableTheme, claimableThemes, privateThemeForOrder } from '../lib/claim/themes.ts';
import { setOrderVerifier } from '../lib/claim/verify.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { siteContentUpdatedAt, type DataAdapter, type SiteRecord } from '../lib/data/types.ts';
import { hashKey } from '../lib/keys.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { llmsTxt, sitemapXml } from '../lib/marketing/crawl.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { clearThemeCache, listThemes, parseManifest, ThemeError } from '../lib/theme/theme.ts';
import { offeredThemes, themeStartable } from '../lib/themes/offered.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PRIVATE = 'custom-design';
const ORDER = '4815162342';
const ORDER_2 = '1234567811';
const PROD = { VERCEL_ENV: 'production' };
const PASSWORD = 'g151-admin-password';

function fixtureTheme(themes: string, id: string, extra: Record<string, unknown> = {}) {
  const dir = path.join(themes, id);
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), dir, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(dir, 'theme.json'), 'utf8'));
  manifest.id = id;
  manifest.name = `Fixture ${id}`;
  delete manifest.internal;
  writeFileSync(path.join(dir, 'theme.json'), JSON.stringify({ ...manifest, ...extra }));
  writeFileSync(path.join(dir, 'content.demo.json'), JSON.stringify(demoContent()));
}

before(() => {
  const themes = tmpDir('g151-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  fixtureTheme(themes, 'sample-design');
  // The order numbers as the owner may type them: normalised like /start does.
  fixtureTheme(themes, PRIVATE, { private: { orders: [`#${ORDER.slice(0, 4)} ${ORDER.slice(4)}`, ORDER_2] } });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g151-data-');
  process.env.ADMIN_PASSWORD = PASSWORD;
  delete process.env.PLATFORM_PUBLIC_URL;
  delete process.env.CLAIM_ORDER_VERIFICATION;
  clearThemeCache();
});

beforeEach(() => {
  setClaimRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  setEditLinkMailer(null);
});

let ipCounter = 0;
const freshIp = () => `198.51.100.${(++ipCounter % 250) + 1}`;
let orderCounter = 0;
const freshOrder = () => String(6_000_000_000 + ++orderCounter * 7919);

async function postClaim(body: Record<string, unknown>): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await claimRoute(
    new Request(`${BASE}/api/start`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': freshIp() }, body: JSON.stringify(body) }),
  );
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

const claimForm = (theme: string, orderNumber: string) => ({ theme, orderNumber, email: 'avery@example.test', names: ['Avery', 'Jordan'], slug: '', website: '' });

const adminCookie = () => `${ADMIN_COOKIE}=${newSessionToken(PASSWORD).token}`;

// ---------------------------------------------------------------------------------------------
// (1) private custom design

test('theme.json "private": order numbers normalised; a bad entry is a precise theme error', () => {
  const base = { id: 'x', name: 'X', pages: { index: 'index.html' } };
  assert.deepEqual(parseManifest({ ...base, private: { orders: ['Order #12 3456 7890', '1234567890', '12345678'] } }, 'x').private, { orders: ['1234567890', '12345678'] });
  assert.deepEqual(parseManifest({ ...base, private: { orders: [] } }, 'x').private, { orders: [] }, 'no order yet: only the admin can use it');
  assert.equal(parseManifest(base, 'x').private, undefined);
  for (const bad of [true, [], { orders: 'x' }, { orders: ['12'] }, { orders: [1234567890] }, null]) {
    assert.throws(() => parseManifest({ ...base, private: bad }, 'x'), ThemeError, JSON.stringify(bad));
  }
});

test('private theme: hidden from every public list (themes, /start and /my picker, production list)', async () => {
  assert.ok(!(await listThemes()).some((t) => t.id === PRIVATE), 'listThemes');
  assert.ok((await listThemes({ includePrivate: true })).some((t) => t.id === PRIVATE), 'still a valid theme');
  assert.ok(!(await claimableThemes()).some((t) => t.id === PRIVATE), 'claimableThemes');
  assert.ok(!(await offeredThemes({})).some((t) => t.id === PRIVATE), 'offered (dev)');
  assert.ok(!(await offeredThemes(PROD)).some((t) => t.id === PRIVATE), 'offered (production)');
  assert.ok((await offeredThemes({})).some((t) => t.id === 'sample-design'), 'the public fixture is offered (else this proves nothing)');
  assert.ok(!(await offeredThemes({})).some((t) => 'privateOrders' in t), 'no order numbers in the public list');
});

test('private theme: never on the sales site, sitemap or llms.txt (real theme folders vs lib/marketing/config.ts)', () => {
  const dir = path.join(PLATFORM_ROOT, 'themes');
  const privateIds = readdirSync(dir).filter((id) => {
    const f = path.join(dir, id, 'theme.json');
    return existsSync(f) && JSON.parse(readFileSync(f, 'utf8')).private !== undefined;
  });
  for (const id of privateIds) assert.ok(!MARKETING.designs.some((d) => d.id === id), `${id} is private: it must not be in MARKETING.designs`);
  const launched = { ...MARKETING, launched: true };
  const guides = loadGuides();
  for (const text of [sitemapXml(guides, launched), llmsTxt(guides, launched)]) {
    for (const id of [...privateIds, PRIVATE]) assert.ok(!text.includes(`/designs/${id}`), id);
  }
});

test('private theme: opens only with a listed order number; anything else answers like an unknown theme', async () => {
  assert.equal(await claimableTheme(PRIVATE), null);
  assert.equal(await claimableTheme(PRIVATE, { order: '9999999999' }), null);
  assert.equal(await claimableTheme(PRIVATE, { order: 'nonsense' }), null);
  const mine = await claimableTheme(PRIVATE, { order: `Order #${ORDER}` });
  assert.equal(mine?.id, PRIVATE);
  assert.equal((await claimableTheme(PRIVATE, { order: ORDER_2 }))?.id, PRIVATE, 'a second listed order');
  assert.equal(themeStartable(mine!, PROD), true, 'not on the sales site, still startable in production with its order');
  assert.equal((await claimableTheme(PRIVATE, { trusted: true }))?.id, PRIVATE, 'admin / existing site');
  assert.deepEqual(await privateThemeForOrder(ORDER), { id: PRIVATE, name: `Fixture ${PRIVATE}` });
  assert.equal(await privateThemeForOrder('9999999999'), null);
});

test('POST /api/start: a private theme with another order number gets the same 404 as an unknown theme; its own order starts it', async () => {
  const unknown = await postClaim(claimForm('no-such-design', freshOrder()));
  const other = await postClaim(claimForm(PRIVATE, freshOrder()));
  const none = await postClaim({ ...claimForm(PRIVATE, ''), orderNumber: undefined });
  assert.equal(unknown.status, 404);
  assert.deepEqual(other, unknown, 'identical answer: nobody learns the design exists');
  assert.deepEqual(none, unknown);
  const ok = await postClaim(claimForm(PRIVATE, `#${ORDER}`));
  assert.equal(ok.status, 201, JSON.stringify(ok.body));
  const site = await getDataAdapter().getSiteBySlug(String(ok.body.slug));
  assert.equal(site?.theme, PRIVATE);
  assert.equal(site?.orderRef, ORDER);
  // Production (approval enforced): a private design is not on the sales site but its buyer can still start it.
  const prod = await claimSite({ adapter: getDataAdapter(), origin: BASE, ip: freshIp(), approvalEnv: PROD }, claimForm(PRIVATE, ORDER_2));
  assert.equal(prod.status, 201, JSON.stringify(prod.body));
  const prodOther = await claimSite({ adapter: getDataAdapter(), origin: BASE, ip: freshIp(), approvalEnv: PROD }, claimForm(PRIVATE, freshOrder()));
  assert.equal(prodOther.status, 404);
});

test('/my continue: an order with a private design and no website yet is sent to its start link', async () => {
  const fresh = '3141592653';
  const dir = process.env.PLATFORM_THEMES_DIR!;
  const f = path.join(dir, PRIVATE, 'theme.json');
  const m = JSON.parse(readFileSync(f, 'utf8'));
  writeFileSync(f, JSON.stringify({ ...m, private: { orders: [...m.private.orders, fresh] } }));
  clearThemeCache();
  const ctx = { adapter: getDataAdapter(), origin: BASE, ip: freshIp() };
  const r = await continueWithOrder(ctx, { orderNumber: fresh, email: 'avery@example.test' });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { ok: true, next: 'start', startPath: `/start?theme=${PRIVATE}&order=${fresh}` });
  const plain = await continueWithOrder(ctx, { orderNumber: freshOrder(), email: 'avery@example.test' });
  assert.deepEqual(plain.body, { ok: true, next: 'start' }, 'any other order: no design named');
});

test('demo of a private theme: only with the admin session; otherwise the unknown-theme 404', async () => {
  const req = (theme: string, cookie?: string) => new Request(`${BASE}/start/demo/${theme}`, { headers: cookie ? { cookie } : {} });
  const params = (theme: string) => ({ params: Promise.resolve({ theme }) });
  const unknown = await demoIndexRoute(req('no-such-design'), params('no-such-design'));
  const anon = await demoIndexRoute(req(PRIVATE), params(PRIVATE));
  assert.equal(anon.status, 404);
  assert.equal(await anon.text(), await unknown.text());
  const forged = await demoIndexRoute(req(PRIVATE, `${ADMIN_COOKIE}=1.x`), params(PRIVATE));
  assert.equal(forged.status, 404, 'a forged cookie is nobody');
  const admin = await demoIndexRoute(req(PRIVATE, adminCookie()), params(PRIVATE));
  assert.equal(admin.status, 200);
  assert.equal(admin.headers.get('cache-control'), 'private, no-store');
  const sub = await demoPageRoute(new Request(`${BASE}/start/demo/${PRIVATE}/rsvp`), { params: Promise.resolve({ theme: PRIVATE, page: 'rsvp' }) });
  assert.equal(sub.status, 404, 'sub-pages too');
});

test('admin "Yeni sipariş": private designs are always listed and can be started with any order number', async () => {
  const list = await adminCreatableThemes();
  const entry = list.find((t) => t.id === PRIVATE);
  assert.ok(entry, 'listed for the shop');
  assert.deepEqual(entry.privateOrders, [ORDER, ORDER_2, '3141592653']);
  assert.ok(list.some((t) => t.id === 'sample-design'));
  const r = await adminCreateSite(getDataAdapter(), BASE, { theme: PRIVATE, orderNumber: freshOrder(), email: 'shop@example.test', name1: 'Ada', name2: 'Lee' });
  assert.equal(r.ok, true, JSON.stringify(r));
});

// ---------------------------------------------------------------------------------------------
// (2) Details: the Dress code section stays, the "Good to know → + Dress code" chip is gone

test('Good to know has no "+ Dress code" chip; the Dress code section and blocks made with the old chip stay', () => {
  const extras = readFileSync(path.join(PLATFORM_ROOT, 'components/panel/ExtrasFields.tsx'), 'utf8');
  const ideas = extras.slice(extras.indexOf('const BLOCK_IDEAS'), extras.indexOf('];', extras.indexOf('const BLOCK_IDEAS')));
  assert.ok(ideas.length > 0 && !/Dress code/.test(ideas) && !/'dress'/.test(ideas), 'no dress code chip');
  assert.match(extras, /value: 'dress', label: msg\('Dress'\)/, 'the Dress icon stays: an old block keeps its icon');
  const sections = readFileSync(path.join(PLATFORM_ROOT, 'components/panel/sections.tsx'), 'utf8');
  assert.match(sections, /path="dress_code"/, 'the Dress code section stays');
});

// ---------------------------------------------------------------------------------------------
// (3) contentUpdatedAt

const tick = () => new Promise((r) => setTimeout(r, 3));

function newSite(slug: string) {
  return { slug, theme: '_sample', content: demoContent(), editKeyHash: hashKey('e'.repeat(43)), previewKeyHash: hashKey('p'.repeat(43)) };
}

async function contentClock(adapter: DataAdapter, slug: string) {
  const created = await adapter.createSite(newSite(slug));
  assert.equal(created.contentUpdatedAt, created.createdAt, 'set when the site is made');
  await tick();
  const noted = await adapter.patchSite(created.id, { adminNote: { text: 'called', at: new Date().toISOString() } });
  assert.notEqual(noted.updatedAt, created.updatedAt, 'every write moves updatedAt (version check)');
  assert.equal(noted.contentUpdatedAt, created.contentUpdatedAt, 'a shop note does not');
  await tick();
  const copied = await adapter.patchSite(created.id, { messageLog: [{ id: 'welcome', at: new Date().toISOString() }] });
  assert.equal(copied.contentUpdatedAt, created.contentUpdatedAt, 'a copied message does not');
  const same = await adapter.patchSite(created.id, { content: copied.content }, { expectedUpdatedAt: copied.updatedAt });
  assert.equal(same.contentUpdatedAt, created.contentUpdatedAt, 'an autosave of the same content does not');
  await tick();
  const edited = await adapter.patchSite(created.id, { content: { ...same.content, name_display: 'Ada & Lee' } }, { expectedUpdatedAt: same.updatedAt });
  assert.equal(edited.contentUpdatedAt, edited.updatedAt, 'a content edit does');
  await tick();
  const published = await adapter.publish(edited.id, { expectedUpdatedAt: edited.updatedAt });
  assert.equal(published.contentUpdatedAt, edited.contentUpdatedAt, 'publishing does not change the content');
  const updated = await adapter.updateContent(edited.id, { ...published.content, name_display: 'Ada and Lee' });
  assert.equal(updated.contentUpdatedAt, updated.updatedAt);
  assert.equal((await adapter.getSiteById(created.id))?.contentUpdatedAt, updated.contentUpdatedAt, 'stored');
  return created.id;
}

test('contentUpdatedAt: only content edits move it (local adapter)', async () => {
  await contentClock(getDataAdapter(), 'clock-local');
});

test('contentUpdatedAt: only content edits move it (Vercel Blob adapter, ETag writes)', async () => {
  const fake = new FakeBlobStore();
  await contentClock(new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 }), 'clock-blob');
});

test('contentUpdatedAt: a record from before G151 falls back to updatedAt, and a shop write keeps that time', async () => {
  const adapter = getDataAdapter();
  const site = await adapter.createSite(newSite('clock-legacy'));
  const file = path.join(process.env.PLATFORM_DATA_DIR!, 'sites', `${site.id}.json`);
  assert.ok(existsSync(file), file);
  const raw = JSON.parse(readFileSync(file, 'utf8'));
  delete raw.contentUpdatedAt;
  writeFileSync(file, JSON.stringify(raw));
  const legacy = (await adapter.getSiteById(site.id))!;
  assert.equal(legacy.contentUpdatedAt, undefined);
  assert.equal(siteContentUpdatedAt(legacy), legacy.updatedAt, 'fallback');
  await tick();
  const noted = await adapter.patchSite(site.id, { adminNote: { text: 'x', at: new Date().toISOString() } });
  assert.equal(noted.contentUpdatedAt, legacy.updatedAt, 'the last content time is kept, not the note time');
});

test('admin: "Son değişiklik" and the unpublished-changes to-do follow the content, not shop notes', () => {
  const day = 86_400_000;
  const now = new Date('2026-10-17T12:00:00Z');
  const at = (d: number) => new Date(now.getTime() - d * day).toISOString();
  const content = demoContent();
  const site: SiteRecord = {
    id: '11111111-1111-4111-8111-111111111111',
    slug: 'ada-lee',
    theme: '_sample',
    variant: null,
    status: 'published',
    content: { ...content, name_display: 'Ada & Lee (edited)' },
    publishedContent: content,
    editKeyHash: 'x',
    previewKeyHash: 'y',
    orderRef: '1234567890',
    ownerEmail: null,
    createdAt: at(10),
    updatedAt: at(0.1), // the shop copied a note an hour ago
    contentUpdatedAt: at(3), // the buyer's last edit, never published
    publishedAt: at(5),
    firstPublishedAt: at(5),
  };
  const summary = summarizeSite(site, 0, now);
  assert.equal(summary.contentUpdatedAt, at(3));
  assert.ok(adminDashboard([summary], now).todos.some((t) => t.kind === 'unpublished_changes'), 'still counted after the note');
  const legacy = summarizeSite({ ...site, contentUpdatedAt: undefined }, 0, now);
  assert.equal(legacy.contentUpdatedAt, site.updatedAt, 'old record: updatedAt');
  assert.ok(!adminDashboard([legacy], now).todos.some((t) => t.kind === 'unpublished_changes'));
});
