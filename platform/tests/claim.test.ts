// /start claim flow (G045): field rules, claimable themes + demo content, POST /api/start (draft site,
// edit link, one site per order, slugs, limits), verifier and mailer interface points, the slug hint
// API and the live demo pages. Fixture themes are copies of _sample (test scaffolding, not designs).
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { GET as slugRoute } from '../app/api/start/slug/route.ts';
import { GET as demoIndexRoute } from '../app/start/demo/[theme]/route.ts';
import { GET as demoPageRoute } from '../app/start/demo/[theme]/[page]/route.ts';
import { GET as panelStateRoute } from '../app/api/edit/[slug]/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { claimSite, draftFromDemo, findFreeSlug, slugAvailability, type ClaimContext } from '../lib/claim/claim.ts';
import { BUNDLED_DEMO_CONTENT, DEMO_SOURCES } from '../lib/claim/demo/index.ts';
import {
  claimFieldErrors,
  emailError,
  FIELD_MESSAGES,
  nameError,
  normalizeEmail,
  normalizeOrderNumber,
  normalizeSlugInput,
  orderNumberError,
  sanitizeSlugTyping,
  slugWithSuffix,
  suggestSlugBase,
} from '../lib/claim/fields.ts';
import { DEFAULT_CLAIM_LIMITS, setClaimRateLimiter } from '../lib/claim/limits.ts';
import { DisabledMailer, getEditLinkMailer, setEditLinkMailer, type EditLinkMessage } from '../lib/claim/mailer.ts';
import { claimableTheme, claimableThemes } from '../lib/claim/themes.ts';
import { FormatOnlyVerifier, getOrderVerifier, setOrderVerifier, VerifierConfigError, type OrderCheckInput } from '../lib/claim/verify.ts';
import { validateContent } from '../lib/content/validate.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { authorizeEditor } from '../lib/rsvp/couple.ts';
import { demoContent, PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
let dataDir = '';

function fixtureTheme(themes: string, id: string, opts: { internal?: boolean; demo?: unknown } = {}) {
  const dir = path.join(themes, id);
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), dir, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(dir, 'theme.json'), 'utf8'));
  manifest.id = id;
  manifest.name = `Fixture ${id}`;
  if (opts.internal) manifest.internal = true;
  else delete manifest.internal;
  writeFileSync(path.join(dir, 'theme.json'), JSON.stringify(manifest));
  if (opts.demo !== undefined) writeFileSync(path.join(dir, 'content.demo.json'), JSON.stringify(opts.demo));
}

before(() => {
  const themes = tmpDir('claim-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  fixtureTheme(themes, 'sample-design', { demo: demoContent() });
  fixtureTheme(themes, 'blush-garden-rose'); // no own demo file: uses the bundled copy
  fixtureTheme(themes, 'no-demo');
  fixtureTheme(themes, 'customer-demo', { demo: { ...demoContent(), record_kind: 'customer' } });
  fixtureTheme(themes, 'broken-demo', { demo: { ...demoContent(), date: 'soon' } });
  fixtureTheme(themes, 'hidden-design', { internal: true, demo: demoContent() });
  const single = demoContent();
  single.partners = [{ display_name: 'Clara', full_name: 'Clara Rose' }];
  single.name_display = 'Clara';
  single.initials = 'C';
  fixtureTheme(themes, 'single-name', { demo: single });
  process.env.PLATFORM_THEMES_DIR = themes;
  dataDir = tmpDir('claim-data-');
  process.env.PLATFORM_DATA_DIR = dataDir;
  delete process.env.PLATFORM_PUBLIC_URL;
  delete process.env.CLAIM_ORDER_VERIFICATION;
});

beforeEach(() => {
  setClaimRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  setEditLinkMailer(null);
});

after(() => {
  setOrderVerifier(null);
  setEditLinkMailer(null);
});

let ipCounter = 0;
const freshIp = () => `203.0.113.${(++ipCounter % 250) + 1}`;
let orderCounter = 0;
/** Unique 10-digit fictional order number per call. */
const freshOrder = () => String(5_000_000_000 + ++orderCounter * 7919);

type Json = Record<string, any>;

async function postClaim(body: unknown, opts: { ip?: string; type?: string; raw?: string } = {}): Promise<{ status: number; body: Json; res: Response }> {
  const res = await claimRoute(
    new Request(`${BASE}/api/start`, {
      method: 'POST',
      headers: { 'content-type': opts.type ?? 'application/json', 'x-forwarded-for': opts.ip ?? freshIp() },
      body: opts.raw ?? JSON.stringify(body),
    }),
  );
  return { status: res.status, body: (await res.json()) as Json, res };
}

const form = (over: Json = {}): Json => ({
  theme: 'sample-design',
  orderNumber: freshOrder(),
  email: 'avery@example.test',
  names: ['Avery', 'Jordan'],
  slug: '',
  website: '',
  ...over,
});

function allFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...allFiles(p));
    else out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Field rules

test('order number: 8-12 digits after removing "#", "Order", spaces and dashes', () => {
  assert.equal(normalizeOrderNumber('1234567890'), '1234567890');
  assert.equal(normalizeOrderNumber('  #1234567890 '), '1234567890');
  assert.equal(normalizeOrderNumber('Order #12 3456 7890'), '1234567890');
  assert.equal(normalizeOrderNumber('order number: 1234-5678-90'), '1234567890');
  assert.equal(normalizeOrderNumber('12345678'), '12345678'); // 8 = minimum
  assert.equal(normalizeOrderNumber('123456789012'), '123456789012'); // 12 = maximum
  assert.equal(normalizeOrderNumber('1234567'), null);
  assert.equal(normalizeOrderNumber('1234567890123'), null);
  assert.equal(normalizeOrderNumber('12345abc90'), null);
  assert.equal(normalizeOrderNumber('١٢٣٤٥٦٧٨٩٠'), null, 'only ASCII digits');
  assert.equal(normalizeOrderNumber(1234567890), null);
  assert.equal(orderNumberError(''), FIELD_MESSAGES.orderMissing);
  assert.equal(orderNumberError('12'), FIELD_MESSAGES.orderFormat);
  assert.equal(orderNumberError('#1234567890'), null);
});

test('email, names and address helpers', () => {
  assert.equal(normalizeEmail('  Avery@Example.TEST '), 'Avery@example.test');
  for (const bad of ['', 'avery', 'avery@', '@example.com', 'a b@example.com', 'avery@example', `${'a'.repeat(250)}@x.com`]) {
    assert.equal(normalizeEmail(bad), null, bad);
  }
  assert.equal(emailError(''), FIELD_MESSAGES.emailMissing);
  assert.equal(emailError('nope'), FIELD_MESSAGES.emailFormat);
  assert.equal(nameError('  '), FIELD_MESSAGES.nameMissing);
  assert.equal(nameError('!!'), FIELD_MESSAGES.nameMissing, 'a name needs a letter');
  assert.equal(nameError('x'.repeat(41)), FIELD_MESSAGES.nameTooLong);
  assert.equal(nameError('Zoë'), null);

  assert.equal(suggestSlugBase(['Avery', 'Jordan']), 'avery-and-jordan');
  assert.equal(suggestSlugBase(['Zoë', 'José María']), 'zoe-and-jose-maria');
  assert.equal(suggestSlugBase(['  Clara  ']), 'clara');
  assert.equal(suggestSlugBase(['Jo']), 'jo-wedding');
  assert.equal(suggestSlugBase(['美玲', '浩然']), 'our-wedding');
  assert.equal(suggestSlugBase(['美玲', 'Jordan']), 'jordan', 'a name without Latin letters is skipped, not "and"');
  assert.equal(sanitizeSlugTyping('Avery & Jordan '), 'avery-and-jordan-');
  assert.equal(sanitizeSlugTyping('--Ünïcode__Name!!'), 'unicode-name-');
  assert.equal(normalizeSlugInput('Avery & Jordan '), 'avery-and-jordan');
  const long = slugWithSuffix('a'.repeat(48), '2');
  assert.equal(long.length, 48);
  assert.ok(long.endsWith('-2'));

  const ok = claimFieldErrors({ orderNumber: '1234567890', email: 'a@example.test', names: ['A1', 'B'], slug: '' }, 2);
  assert.deepEqual(ok, {});
  const bad = claimFieldErrors({ orderNumber: '12', email: 'x', names: ['', ''], slug: 'admin' }, 2);
  assert.deepEqual(Object.keys(bad).sort(), ['email', 'name1', 'name2', 'orderNumber', 'slug']);
  assert.equal(bad.slug, FIELD_MESSAGES.slugReserved);
  assert.equal(claimFieldErrors({ orderNumber: '1234567890', email: 'a@example.test', names: ['A'], slug: 'a' }, 1).slug, FIELD_MESSAGES.slugFormat);
  assert.equal(claimFieldErrors({ orderNumber: '1234567890', email: 'a@example.test', names: ['A'], slug: '' }, 1).name2, undefined);
});

// ---------------------------------------------------------------------------------------------
// Themes and demo content

test('claimable themes: own demo file, bundled copy; internal / missing / invalid demo are refused', async () => {
  const own = await claimableTheme('sample-design');
  assert.equal(own?.demoSource, 'theme');
  assert.equal(own?.partnerCount, 2);
  const bundled = await claimableTheme('blush-garden-rose');
  assert.equal(bundled?.demoSource, 'bundled');
  assert.equal(bundled?.demo.name_display, 'Clara & Julian');
  assert.equal((await claimableTheme('single-name'))?.partnerCount, 1);
  const logs: string[] = [];
  const orig = console.error;
  console.error = (...a: unknown[]) => void logs.push(a.map(String).join(' '));
  let listed: string[];
  try {
    for (const id of ['_sample', 'hidden-design', 'no-demo', 'customer-demo', 'broken-demo', 'nope', '../sample-design', '', null]) {
      assert.equal(await claimableTheme(id), null, String(id));
    }
    listed = (await claimableThemes()).map((t) => t.id);
  } finally {
    console.error = orig;
  }
  assert.ok(logs.some((l) => l.includes('customer-demo') && l.includes('record_kind "demo"')), 'bad demo files are reported');
  assert.ok(logs.some((l) => l.includes('broken-demo') && l.includes('not valid')));
  assert.deepEqual(listed, ['blush-garden-rose', 'sample-design', 'single-name']);
  // a fresh copy each time
  own!.demo.partners[0].display_name = 'Changed';
  assert.equal((await claimableTheme('sample-design'))?.demo.partners[0].display_name, 'Clara');
});

test('bundled demo copies are identical to their collection records', () => {
  assert.deepEqual(Object.keys(BUNDLED_DEMO_CONTENT).sort(), Object.keys(DEMO_SOURCES).sort());
  for (const [id, source] of Object.entries(DEMO_SOURCES)) {
    const original = JSON.parse(readFileSync(path.join(REPO_ROOT, source), 'utf8'));
    assert.deepEqual(BUNDLED_DEMO_CONTENT[id], original, `${id} drifted from ${source}: copy it again`);
    assert.equal(validateContent(original).ok, true);
  }
});

test('draftFromDemo: customer record with the buyer names, demo left untouched', () => {
  const demo = demoContent();
  const draft = draftFromDemo(demo, ['Avery', 'Jordan']);
  assert.equal(draft.record_kind, 'customer');
  assert.deepEqual(draft.partners, [
    { display_name: 'Avery', full_name: 'Avery' },
    { display_name: 'Jordan', full_name: 'Jordan' },
  ]);
  assert.equal(draft.name_display, 'Avery & Jordan');
  assert.equal(draft.initials, 'A&J');
  assert.equal(draft.venue.name, demo.venue.name, 'other fields stay demo content');
  assert.equal(demo.partners[0].display_name, 'Clara');
  assert.equal(validateContent(draft, { platform: true }).ok, true);
  // a hand-written name_display in the demo is replaced too, so the record stays valid
  const custom = { ...demoContent(), name_display: 'Clara and Julian', initials: 'C & J' };
  const d2 = draftFromDemo(custom, ['Avery', 'Jordan']);
  assert.equal(d2.name_display, 'Avery & Jordan');
  assert.equal(d2.initials, 'A & J');
  assert.equal(validateContent(d2).ok, true);
});

// ---------------------------------------------------------------------------------------------
// POST /api/start

test('claim: creates a draft from the demo, returns the edit link once; the panel opens with it', async () => {
  const order = freshOrder();
  const { status, body, res } = await postClaim(form({ orderNumber: `#${order}`, email: ' Avery@Example.TEST ' }));
  assert.equal(status, 201, JSON.stringify(body));
  assert.equal(res.headers.get('cache-control'), 'private, no-store');
  assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(body.slug, 'avery-and-jordan');
  assert.equal(body.status, 'draft');
  assert.equal(body.emailSent, false);
  assert.equal(body.siteUrl, `${BASE}/avery-and-jordan`);
  const key = new URL(body.editUrl).searchParams.get('k')!;
  assert.match(key, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(body.editUrl, `${BASE}${body.editPath}`);
  assert.equal(body.editPath, `/edit/avery-and-jordan?k=${key}`);

  const adapter = getDataAdapter();
  const site = await adapter.getSiteBySlug('avery-and-jordan');
  assert.ok(site);
  assert.equal(site.status, 'draft');
  assert.equal(site.theme, 'sample-design');
  assert.equal(site.orderRef, order, 'stored as digits only');
  assert.equal(site.ownerEmail, 'Avery@example.test');
  assert.equal(site.publishedContent, null);
  assert.equal(site.content.record_kind, 'customer');
  assert.equal(site.content.name_display, 'Avery & Jordan');
  assert.equal(site.content.venue.name, demoContent().venue.name);
  assert.ok(await authorizeEditor(adapter, 'avery-and-jordan', key));

  // the plain key is stored nowhere
  for (const file of allFiles(dataDir)) assert.ok(!readFileSync(file, 'utf8').includes(key), file);

  // the link opens the panel API (G039) ...
  const panel = await panelStateRoute(
    new Request(`${BASE}/api/edit/avery-and-jordan`, { headers: { authorization: `Bearer ${key}` } }),
    { params: Promise.resolve({ slug: 'avery-and-jordan' }) },
  );
  assert.equal(panel.status, 200);
  const state = ((await panel.json()) as Json).state;
  assert.equal(state.content.partners[0].display_name, 'Avery');
  assert.equal(state.theme.id, 'sample-design');
  // ... while the public address stays closed until Publish
  const pub = await siteRoute(new Request(`${BASE}/avery-and-jordan`), { params: Promise.resolve({ slug: 'avery-and-jordan' }) });
  assert.equal(pub.status, 404);
});

test('claim: one website per order number; the second attempt leaks nothing', async () => {
  const order = freshOrder();
  const first = await postClaim(form({ orderNumber: order, names: ['Mila', 'Theo'], email: 'mila@example.test' }));
  assert.equal(first.status, 201);
  const again = await postClaim(form({ orderNumber: `Order #${order.slice(0, 4)} ${order.slice(4)}`, names: ['Other', 'Pair'], email: 'x@example.test' }));
  assert.equal(again.status, 409);
  assert.equal(again.body.code, 'order_used');
  assert.match(again.body.message, /already been started with this order number/);
  const text = JSON.stringify(again.body);
  for (const secret of [first.body.slug, 'mila', first.body.editUrl, new URL(first.body.editUrl).searchParams.get('k')]) {
    assert.ok(!text.toLowerCase().includes(String(secret).toLowerCase()), `answer contains ${secret}`);
  }
  assert.deepEqual(Object.keys(again.body).sort(), ['code', 'message', 'ok']);
  assert.equal((await getDataAdapter().findSitesByOrderRef(order)).length, 1);
  assert.equal(await getDataAdapter().getSiteBySlug('other-and-pair'), null);
});

test('claim: parallel attempts with one order number create exactly one site', async () => {
  const order = freshOrder();
  const results = await Promise.all(
    Array.from({ length: 6 }, (_, i) => postClaim(form({ orderNumber: order, names: [`Pat${'abcdef'[i]}`, 'Sam'] }))),
  );
  const statuses = results.map((r) => r.status).sort();
  assert.deepEqual(statuses, [201, 409, 409, 409, 409, 409]);
  assert.equal((await getDataAdapter().findSitesByOrderRef(order)).length, 1);
});

test('claim: website address — typed one must be free; automatic one gets a number', async () => {
  const a = await postClaim(form({ names: ['Nora', 'Eli'] }));
  assert.equal(a.body.slug, 'nora-and-eli');
  // typed and taken -> 409 with a free suggestion, nothing created
  const order = freshOrder();
  const typed = await postClaim(form({ orderNumber: order, names: ['Nora', 'Eli'], slug: 'Nora-and-Eli' }));
  assert.equal(typed.status, 409);
  assert.equal(typed.body.code, 'slug_taken');
  assert.equal(typed.body.fields.slug, FIELD_MESSAGES.slugTaken);
  assert.equal(typed.body.suggestion, 'nora-and-eli-2');
  assert.equal((await getDataAdapter().findSitesByOrderRef(order)).length, 0, 'the order can still be used');
  // the same order with the suggestion works
  const retry = await postClaim(form({ orderNumber: order, names: ['Nora', 'Eli'], slug: typed.body.suggestion }));
  assert.equal(retry.status, 201);
  assert.equal(retry.body.slug, 'nora-and-eli-2');
  // empty address -> first free one from the names
  const auto = await postClaim(form({ names: ['Nora', 'Eli'] }));
  assert.equal(auto.body.slug, 'nora-and-eli-3');
  // reserved / malformed typed addresses are field errors
  const reserved = await postClaim(form({ slug: 'admin' }));
  assert.equal(reserved.status, 400);
  assert.equal(reserved.body.fields.slug, FIELD_MESSAGES.slugReserved);
  const short = await postClaim(form({ slug: 'ab' }));
  assert.equal(short.body.fields.slug, FIELD_MESSAGES.slugFormat);
  // a typed custom address is used as is
  const custom = await postClaim(form({ names: ['Ivy', 'Max'], slug: 'ivy-max-2027' }));
  assert.equal(custom.body.slug, 'ivy-max-2027');
  // single-name demo asks for one name only
  const single = await postClaim(form({ theme: 'single-name', names: ['Rosalind'] }));
  assert.equal(single.status, 201, JSON.stringify(single.body));
  assert.equal(single.body.slug, 'rosalind');
});

test('claim: field, theme and honeypot checks; nothing stored on refusal', async () => {
  const before = allFiles(dataDir).length;
  const empty = await postClaim({ theme: 'sample-design' });
  assert.equal(empty.status, 400);
  assert.equal(empty.body.code, 'invalid');
  assert.deepEqual(Object.keys(empty.body.fields).sort(), ['email', 'name1', 'name2', 'orderNumber']);
  for (const orderNumber of ['1234567', '1234567890123', 'ABCDEFGHIJ', '12345-abc']) {
    const r = await postClaim(form({ orderNumber }));
    assert.equal(r.status, 400, orderNumber);
    assert.equal(r.body.fields.orderNumber, FIELD_MESSAGES.orderFormat);
  }
  assert.equal((await postClaim(form({ email: 'not-an-email' }))).body.fields.email, FIELD_MESSAGES.emailFormat);
  assert.equal((await postClaim(form({ names: ['Avery'] }))).body.fields.name2, FIELD_MESSAGES.nameMissing);
  assert.equal((await postClaim(form({ names: 'Avery & Jordan' }))).status, 400);

  for (const theme of ['_sample', 'hidden-design', 'no-demo', 'nope', '../_sample', 42]) {
    const r = await postClaim(form({ theme }));
    assert.equal(r.status, 404, String(theme));
    assert.equal(r.body.code, 'theme_unavailable');
  }
  const bot = await postClaim(form({ website: 'https://spam.example' }));
  assert.equal(bot.status, 400);
  assert.equal(bot.body.code, 'invalid');
  assert.equal(bot.body.fields, undefined);
  assert.equal(allFiles(dataDir).length, before, 'no files written');
});

test('claim: HTTP shape — JSON only, size cap, bad JSON', async () => {
  assert.equal((await postClaim(null, { type: 'text/plain', raw: 'orderNumber=1' })).status, 415);
  assert.equal((await postClaim(null, { raw: JSON.stringify({ ...form(), pad: 'x'.repeat(5000) }) })).status, 413);
  const bad = await postClaim(null, { raw: '{"theme":' });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.code, 'bad_json');
  assert.equal((await postClaim(null, { raw: '[1,2]' })).body.code, 'bad_json');
  assert.equal((await postClaim(null, { raw: '' })).body.code, 'bad_json');
});

test('claim: rate limits — attempts per address, sites per address, sites overall', async () => {
  const ip = '198.51.100.7';
  for (let i = 0; i < DEFAULT_CLAIM_LIMITS.attemptsPerIp.limit; i++) {
    const r = await postClaim(form({ orderNumber: '12' }), { ip });
    assert.equal(r.status, 400);
  }
  const blocked = await postClaim(form(), { ip });
  assert.equal(blocked.status, 429);
  assert.equal(blocked.body.code, 'rate_limited');
  assert.ok(Number(blocked.res.headers.get('retry-after')) > 0);
  assert.equal((await postClaim(form(), { ip: '198.51.100.8' })).status, 201, 'other addresses are not affected');

  const limits = { ...DEFAULT_CLAIM_LIMITS, sitesPerIp: { limit: 1, windowMs: 60_000 }, sitesGlobal: { limit: 2, windowMs: 60_000 } };
  const ctx = (ip: string): ClaimContext => ({ adapter: getDataAdapter(), origin: BASE, ip, limits, limiter: shared });
  const shared = new MemoryRateLimiter();
  assert.equal((await claimSite(ctx('192.0.2.1'), form({ names: ['Una', 'Bo'] }))).status, 201);
  const perIp = await claimSite(ctx('192.0.2.1'), form({ names: ['Una', 'Bo'] }));
  assert.equal(perIp.status, 429);
  assert.equal(perIp.body.code, 'rate_limited');
  assert.equal((await claimSite(ctx('192.0.2.2'), form({ names: ['Una', 'Bo'] }))).status, 201);
  const global = await claimSite(ctx('192.0.2.3'), form({ names: ['Una', 'Bo'] }));
  assert.equal(global.status, 429);
  assert.equal(global.body.code, 'busy');
});

// ---------------------------------------------------------------------------------------------
// Interface points: order verification and email

test('order verifier: off by default; "etsy" is not implemented and fails loudly', () => {
  assert.ok(getOrderVerifier() instanceof FormatOnlyVerifier);
  process.env.CLAIM_ORDER_VERIFICATION = 'off';
  assert.equal(getOrderVerifier().kind, 'format-only');
  process.env.CLAIM_ORDER_VERIFICATION = 'etsy';
  assert.throws(() => getOrderVerifier(), VerifierConfigError);
  process.env.CLAIM_ORDER_VERIFICATION = 'maybe';
  assert.throws(() => getOrderVerifier(), /Unknown CLAIM_ORDER_VERIFICATION/);
  delete process.env.CLAIM_ORDER_VERIFICATION;
});

test('order verifier: rejected / unavailable stop the claim; verified passes with normalised input', async () => {
  const seen: OrderCheckInput[] = [];
  const verifier = (result: 'rejected' | 'unavailable' | 'verified') => ({
    kind: 'fake',
    async check(input: OrderCheckInput) {
      seen.push(input);
      return result === 'rejected' ? { result, reason: 'not_found' as const } : { result };
    },
  });
  const order = freshOrder();
  setOrderVerifier(verifier('rejected'));
  const rejected = await postClaim(form({ orderNumber: `#${order}`, email: 'Avery@EXAMPLE.test' }));
  assert.equal(rejected.status, 403);
  assert.equal(rejected.body.code, 'order_not_verified');
  assert.deepEqual(seen[0], { orderNumber: order, email: 'Avery@example.test', theme: 'sample-design' });
  setOrderVerifier(verifier('unavailable'));
  const down = await postClaim(form({ orderNumber: order }));
  assert.equal(down.status, 503);
  assert.equal(down.res.headers.get('retry-after'), '60');
  assert.equal((await getDataAdapter().findSitesByOrderRef(order)).length, 0);
  setOrderVerifier(verifier('verified'));
  assert.equal((await postClaim(form({ orderNumber: order, names: ['Vera', 'Ken'] }))).status, 201);

  // the env switch to the unbuilt Etsy verifier -> 500, nothing created
  setOrderVerifier(null);
  process.env.CLAIM_ORDER_VERIFICATION = 'etsy';
  const errors: string[] = [];
  const orig = console.error;
  console.error = (...a: unknown[]) => void errors.push(a.map(String).join(' '));
  try {
    const r = await postClaim(form());
    assert.equal(r.status, 500);
    assert.equal(r.body.code, 'server');
  } finally {
    console.error = orig;
    delete process.env.CLAIM_ORDER_VERIFICATION;
  }
  assert.ok(errors.some((e) => e.includes('not implemented')));
});

test('mailer: disabled by default; a configured mailer gets the link; a failing one does not fail the claim', async () => {
  assert.ok(getEditLinkMailer() instanceof DisabledMailer);
  assert.equal(getEditLinkMailer().enabled, false);
  const sent: EditLinkMessage[] = [];
  setEditLinkMailer({
    enabled: true,
    async send(m: EditLinkMessage) {
      sent.push(m);
      return { sent: true };
    },
  });
  const order = freshOrder();
  const ok = await postClaim(form({ orderNumber: order, names: ['Lena', 'Ari'] }));
  assert.equal(ok.body.emailSent, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'avery@example.test');
  assert.equal(sent[0].editUrl, ok.body.editUrl);
  assert.equal(sent[0].orderNumber, order);
  assert.equal(sent[0].themeName, 'Fixture sample-design');

  setEditLinkMailer({
    enabled: true,
    async send() {
      throw new Error(`provider down ${'secret-link-would-be-here'}`);
    },
  });
  const logs: string[] = [];
  const orig = console.error;
  console.error = (...a: unknown[]) => void logs.push(a.map(String).join(' '));
  let failed;
  try {
    failed = await postClaim(form({ names: ['Lena', 'Ari'] }));
  } finally {
    console.error = orig;
  }
  assert.equal(failed.status, 201);
  assert.equal(failed.body.emailSent, false);
  const key = new URL(failed.body.editUrl).searchParams.get('k')!;
  assert.ok(logs.length > 0);
  assert.ok(logs.every((l) => !l.includes(key) && !l.includes('secret-link')), 'the link is never logged');
});

// ---------------------------------------------------------------------------------------------
// Address hint API

test('GET /api/start/slug: available, taken (+ free suggestion), reserved, malformed, rate limit', async () => {
  const check = async (value: string, ip = freshIp()) => {
    const res = await slugRoute(new Request(`${BASE}/api/start/slug?value=${encodeURIComponent(value)}`, { headers: { 'x-forwarded-for': ip } }));
    return { status: res.status, body: (await res.json()) as Json, res };
  };
  await postClaim(form({ names: ['Hana', 'Leo'] }));
  const free = await check('Hana & Leo forever');
  assert.deepEqual(
    { available: free.body.available, value: free.body.value, suggestion: free.body.suggestion },
    { available: true, value: 'hana-and-leo-forever', suggestion: 'hana-and-leo-forever' },
  );
  const taken = await check('hana-and-leo');
  assert.equal(taken.body.available, false);
  assert.equal(taken.body.reason, 'taken');
  assert.equal(taken.body.suggestion, 'hana-and-leo-2');
  assert.equal(taken.res.headers.get('cache-control'), 'private, no-store');
  const reserved = await check('edit');
  assert.equal(reserved.body.reason, 'reserved');
  assert.equal(reserved.body.suggestion, 'edit-2');
  const bad = await check('a');
  assert.equal(bad.body.reason, 'format');
  assert.equal(bad.body.suggestion, null);
  assert.equal((await check('')).body.reason, 'missing');

  const ip = '198.51.100.99';
  for (let i = 0; i < DEFAULT_CLAIM_LIMITS.slugChecksPerIp.limit; i++) await check('x-y-z', ip);
  const limited = await check('x-y-z', ip);
  assert.equal(limited.status, 429);

  assert.equal(await findFreeSlug(getDataAdapter(), '!!'), null);
  assert.equal((await slugAvailability(getDataAdapter(), 'Hana-And-Leo')).suggestion, 'hana-and-leo-2');
});

// ---------------------------------------------------------------------------------------------
// Live demo pages

test('demo pages: theme rendered with its demo content, links stay under /start/demo, preview mode', async () => {
  const index = await demoIndexRoute(new Request(`${BASE}/start/demo/sample-design`), { params: Promise.resolve({ theme: 'sample-design' }) });
  assert.equal(index.status, 200);
  assert.match(index.headers.get('content-security-policy') ?? '', /frame-ancestors 'self'/);
  assert.equal(index.headers.get('x-robots-tag'), 'noindex, nofollow');
  const $ = cheerio.load(await index.text());
  const data = JSON.parse($('#site-data').text());
  assert.equal(data.preview, true, 'RSVP form shows its preview panel and never posts');
  assert.equal(data.pages.home, '/start/demo/sample-design/home?preview=demo');
  assert.equal(data.content.name_display, 'Clara & Julian');
  assert.equal($('html').attr('data-theme'), 'sample-design');
  assert.ok($('a[href^="/start/demo/sample-design/"]').length > 0, 'page links stay in the demo');
  assert.equal($('a[href^="/clara"]').length, 0);

  const story = await demoPageRoute(new Request(`${BASE}/start/demo/blush-garden-rose/story?preview=demo`), {
    params: Promise.resolve({ theme: 'blush-garden-rose', page: 'story' }),
  });
  assert.equal(story.status, 200, 'bundled demo content works too');

  const missing: Array<[string, string | null]> = [
    ['_sample', null],
    ['hidden-design', null],
    ['no-demo', null],
    ['nope', null],
    ['sample-design', 'index'],
    ['sample-design', 'admin'],
  ];
  for (const [theme, page] of missing) {
    const res = page
      ? await demoPageRoute(new Request(`${BASE}/start/demo/${theme}/${page}`), { params: Promise.resolve({ theme, page }) })
      : await demoIndexRoute(new Request(`${BASE}/start/demo/${theme}`), { params: Promise.resolve({ theme }) });
    assert.equal(res.status, 404, `${theme}/${page}`);
  }
});
