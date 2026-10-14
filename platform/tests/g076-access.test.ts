// G076 (K28): optional guest password — rules, cookie, every guest route closed without it, unlock form, rate limit,
// password change signs guests out, cookie bound to its site, panel + panel preview unaffected, cache headers, privacy.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { GET as stateRoute, PUT as saveRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as accessRoute } from '../app/api/edit/[slug]/access/route.ts';
import { POST as photoRoute } from '../app/api/edit/[slug]/photo/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { GET as siteRoute, POST as siteUnlock } from '../app/[slug]/route.ts';
import { GET as pageRoute, POST as pageUnlock } from '../app/[slug]/[page]/route.ts';
import { GET as icsRoute } from '../app/[slug]/event.ics/route.ts';
import { GET as mediaRoute } from '../app/media/[...path]/route.ts';
import { GET as rsvpStatusRoute, POST as rsvpPostRoute } from '../app/api/rsvp/[slug]/route.ts';
import { GET as repliesRoute } from '../app/api/rsvp/[slug]/responses/route.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { AdapterRateLimiter } from '../lib/claim/limits.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import type { SiteRecord } from '../lib/data/types.ts';
import { sitemapXml } from '../lib/marketing/crawl.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import {
  cleanGuestPassword,
  comparableGuestPassword,
  GUEST_PASSWORD_MAX,
  GUEST_PASSWORD_MIN,
  GUEST_PASSWORD_WORDS,
  guestPasswordProblem,
  suggestGuestPassword,
} from '../lib/panel/guest-access.ts';
import { MemoryRateLimiter, setRsvpRateLimiter } from '../lib/rsvp/rate-limit.ts';
import {
  ACCESS_LIMITS,
  GUEST_COOKIE_MAX_AGE_S,
  guestCookieName,
  guestCookieValue,
  guestMayEnter,
  guestPasswordMatches,
  guestSetCookie,
  setAccessRateLimiter,
  setGuestAccess,
  verifyGuestCookie,
} from '../lib/site/access.ts';
import { createSiteWithKeys, publishSite, setArchiveOverride } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';
type Keys = { id: string; slug: string; editKey: string; previewKey: string };
const PASSWORD = 'OliveRiver27';

before(() => {
  const themes = tmpDir('g076-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  cpSync(path.join(PLATFORM_ROOT, 'themes/blush-garden-rose'), path.join(themes, 'blush-garden-rose'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g076-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  setRsvpRateLimiter(new MemoryRateLimiter());
  setAccessRateLimiter(new MemoryRateLimiter());
});

let counter = 0;
async function newSite(opts: { theme?: string; publish?: boolean; edit?: (c: ContentRecord) => void } = {}): Promise<Keys> {
  const c = demoContent();
  opts.edit?.(c);
  const slug = `g076-site-${++counter}`;
  const s = await createSiteWithKeys(getDataAdapter(), { slug, theme: opts.theme ?? '_sample', content: c });
  if (opts.publish !== false) await publishSite(getDataAdapter(), s.site.id);
  return { id: s.site.id, slug, editKey: s.editKey, previewKey: s.previewKey };
}

type Handler = (req: Request, ctx: { params: Promise<any> }) => Promise<Response>;
interface CallOpts {
  method?: string;
  key?: string;
  json?: unknown;
  body?: BodyInit;
  type?: string;
  cookie?: string;
  ip?: string;
  headers?: Record<string, string>;
}
async function call(handler: Handler, url: string, params: Record<string, unknown>, opts: CallOpts = {}) {
  const headers = new Headers(opts.headers ?? {});
  if (opts.key) headers.set('authorization', `Bearer ${opts.key}`);
  if (opts.cookie) headers.set('cookie', opts.cookie);
  headers.set('x-forwarded-for', opts.ip ?? '203.0.113.7');
  let body = opts.body;
  if (opts.json !== undefined) {
    body = JSON.stringify(opts.json);
    headers.set('content-type', 'application/json');
  }
  if (opts.type) headers.set('content-type', opts.type);
  const res = await handler(new Request(`${BASE}${url}`, { method: opts.method ?? 'GET', headers, body }), { params: Promise.resolve(params) });
  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    /* html / ics / text */
  }
  return { status: res.status, data, text, headers: res.headers };
}

const access = (k: Keys, json: unknown, key = k.editKey) => call(accessRoute, `/api/edit/${k.slug}/access`, { slug: k.slug }, { method: 'POST', key, json });
const getState = async (k: Keys) => (await call(stateRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { key: k.editKey })).data.state;
const stored = async (k: Keys) => (await getDataAdapter().getSiteById(k.id)) as SiteRecord;
const index = (k: Keys, opts: CallOpts = {}, query = '') => call(siteRoute, `/${k.slug}${query}`, { slug: k.slug }, opts);
const page = (k: Keys, p: string, opts: CallOpts = {}, query = '') => call(pageRoute, `/${k.slug}/${p}${query}`, { slug: k.slug, page: p }, opts);
const ics = (k: Keys, opts: CallOpts = {}, query = '') => call(icsRoute, `/${k.slug}/event.ics${query}`, { slug: k.slug }, opts);
const media = (url: string, opts: CallOpts = {}) => call(mediaRoute, url, { path: url.split('?')[0].replace(/^\/media\//, '').split('/') }, opts);
const rsvpStatus = (k: Keys, opts: CallOpts = {}, query = '') => call(rsvpStatusRoute, `/api/rsvp/${k.slug}${query}`, { slug: k.slug }, opts);
const rsvpPost = (k: Keys, opts: CallOpts = {}) =>
  call(rsvpPostRoute, `/api/rsvp/${k.slug}`, { slug: k.slug }, { method: 'POST', json: { name: 'Ada Lovelace', attending: true, guests: 2 }, ...opts });
function unlock(k: Keys, password: string, opts: CallOpts & { page?: string; query?: string } = {}) {
  const p = opts.page ?? 'index';
  const body = new URLSearchParams({ site_access: '1', password }).toString();
  const o = { method: 'POST', body, type: 'application/x-www-form-urlencoded', ...opts };
  return p === 'index'
    ? call(siteUnlock, `/${k.slug}${opts.query ?? ''}`, { slug: k.slug }, o)
    : call(pageUnlock, `/${k.slug}/${p}${opts.query ?? ''}`, { slug: k.slug, page: p }, o);
}
/** "name=value" for a Cookie header from a Set-Cookie answer. */
const cookieOf = (setCookie: string | null) => (setCookie ?? '').split(';')[0];

/** A published site with a photo on the page, then protected with PASSWORD. */
async function protectedSite(theme = '_sample'): Promise<Keys & { photo: string }> {
  const k = await newSite({ theme });
  const slot = theme === '_sample' ? 'hero' : 'hero_portrait';
  const up = await call(photoRoute, `/api/edit/${k.slug}/photo?slot=${slot}`, { slug: k.slug }, { method: 'POST', key: k.editKey, body: Buffer.from(tinyPng()), type: 'image/png' });
  assert.equal(up.status, 200);
  const s = await getState(k);
  const c = structuredClone(s.content) as ContentRecord;
  c.media = { ...c.media, hero_portrait: up.data.url };
  assert.equal((await call(saveRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { method: 'PUT', key: k.editKey, json: { content: c, baseUpdatedAt: s.updatedAt } })).status, 200);
  assert.equal((await call(publishRoute, `/api/edit/${k.slug}/publish`, { slug: k.slug }, { method: 'POST', key: k.editKey })).status, 200);
  const on = await access(k, { enabled: true, password: PASSWORD });
  assert.equal(on.status, 200, JSON.stringify(on.data));
  return { ...k, photo: up.data.url };
}

/** Text that only the real website shows (date, venue, place, schedule): never on the password page. */
const DETAILS = [/2027/, /May 15/, /Rosewater/, /Savannah/, /Georgia/, /Ceremony/, /\/media\//];

function assertGate(res: { status: number; text: string; headers: Headers }, label: string) {
  assert.equal(res.status, 200, label);
  const $ = cheerio.load(res.text);
  assert.ok($('html').is('[data-site-gate]'), `${label}: password page`);
  assert.equal(res.headers.get('cache-control'), 'private, no-store', label);
  assert.match(res.headers.get('vary') ?? '', /Cookie/i, label);
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow', label);
  assert.equal($('h1').text(), 'Clara & Julian', label);
  for (const re of DETAILS) assert.doesNotMatch(res.text, re, `${label}: no ${re}`);
  assert.doesNotMatch(res.text, new RegExp(PASSWORD, 'i'), `${label}: the password is never in a page`);
  assert.equal($('meta[property="og:description"]').attr('content'), "You're invited", label);
  assert.equal($('meta[property="og:title"]').attr('content'), 'Clara & Julian', label);
  assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow', label);
  assert.equal($('form').attr('method'), 'post', label);
  assert.equal($('input[name="site_access"]').attr('value'), '1', label);
  assert.equal($('input[name="password"]').attr('type'), 'password', label);
}

// ---------------------------------------------------------------------------------------------- rules

test('password rules: 4–40 characters (code points), cleaned, compared without case / extra spaces', () => {
  assert.equal(guestPasswordProblem('abc'), `Please use at least ${GUEST_PASSWORD_MIN} characters.`);
  assert.equal(guestPasswordProblem('   abc   '), `Please use at least ${GUEST_PASSWORD_MIN} characters.`);
  assert.equal(guestPasswordProblem('abcd'), null);
  assert.equal(guestPasswordProblem('a'.repeat(GUEST_PASSWORD_MAX)), null);
  assert.equal(guestPasswordProblem('a'.repeat(GUEST_PASSWORD_MAX + 1)), `Please use at most ${GUEST_PASSWORD_MAX} characters.`);
  assert.equal(guestPasswordProblem('🌹'.repeat(GUEST_PASSWORD_MAX)), null, 'emoji count as one character each');
  assert.equal(guestPasswordProblem(''), 'Please enter a password.');
  assert.equal(guestPasswordProblem(42), 'Please enter a password.');
  assert.equal(guestPasswordProblem('ab​​cd'.slice(0, 4)), `Please use at least ${GUEST_PASSWORD_MIN} characters.`, 'invisible characters do not count');
  assert.equal(cleanGuestPassword('  Rose \t Garden ​ '), 'Rose Garden');
  assert.equal(comparableGuestPassword(' ROSE   garden'), 'rose garden');
  assert.equal(cleanGuestPassword('Café'), 'Café', 'NFC');
});

test('suggestions: two different friendly words + a number, valid, letters and digits only', () => {
  assert.equal(GUEST_PASSWORD_WORDS.length, 96);
  assert.equal(new Set(GUEST_PASSWORD_WORDS.map((w) => w.toLowerCase())).size, 96, 'no duplicate words');
  for (let i = 0; i < 200; i++) {
    const s = suggestGuestPassword();
    assert.match(s, /^([A-Z][a-z]+)([A-Z][a-z]+)([1-9][0-9])$/, s);
    const [, a, b] = /^([A-Z][a-z]+)([A-Z][a-z]+)/.exec(s)!;
    assert.notEqual(a, b);
    assert.equal(guestPasswordProblem(s), null, s);
  }
  // deterministic with a given random source (edges of every range)
  assert.equal(suggestGuestPassword(() => 0), `${GUEST_PASSWORD_WORDS[0]}${GUEST_PASSWORD_WORDS[1]}10`);
  assert.equal(suggestGuestPassword((n) => n - 1), `${GUEST_PASSWORD_WORDS[95]}${GUEST_PASSWORD_WORDS[94]}99`);
});

test('password check: right one in any case / spacing, wrong ones, odd input never throws', () => {
  const rec = { enabled: true, password: 'Rose Garden 42', version: 1, secret: 'x'.repeat(43), updatedAt: '' };
  assert.equal(guestPasswordMatches(rec, 'rose garden 42'), true);
  assert.equal(guestPasswordMatches(rec, '  ROSE  GARDEN 42 '), true);
  assert.equal(guestPasswordMatches(rec, 'rose garden 43'), false);
  assert.equal(guestPasswordMatches(rec, 'rosegarden42'), false);
  assert.equal(guestPasswordMatches(rec, ''), false);
  assert.equal(guestPasswordMatches(rec, 'x'.repeat(100_000)), false);
  assert.equal(guestPasswordMatches(rec, null), false);
  assert.equal(guestPasswordMatches(rec, ['rose garden 42']), false);
  assert.equal(guestPasswordMatches({ ...rec, password: '' }, ''), false, 'an empty stored password opens nothing');
  assert.equal(guestPasswordMatches(null, 'rose garden 42'), false);
});

test('cookie: signed per site and password version, 90 days, HttpOnly + Secure + SameSite=Lax, __Host- prefix', () => {
  const now = Date.UTC(2027, 0, 1);
  const a = { id: '11111111-1111-4111-8111-111111111111', guestAccess: { enabled: true, password: 'abcd', version: 3, secret: 'a'.repeat(43), updatedAt: '' } };
  const b = { id: '22222222-2222-4222-8222-222222222222', guestAccess: { enabled: true, password: 'abcd', version: 3, secret: 'a'.repeat(43), updatedAt: '' } };
  const header = guestSetCookie(a, now);
  assert.match(header, /^__Host-guest-11111111111141118111111111111111=3\.\d{10}\.[A-Za-z0-9_-]{43}; /);
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/', `Max-Age=${GUEST_COOKIE_MAX_AGE_S}`]) assert.ok(header.includes(`; ${flag}`), flag);
  assert.equal(GUEST_COOKIE_MAX_AGE_S, 90 * 24 * 3600);
  assert.doesNotMatch(header, /Domain=/i);
  const value = guestCookieValue(a, now);
  assert.equal(verifyGuestCookie(a, value, now), true);
  assert.equal(verifyGuestCookie(a, value, now + (GUEST_COOKIE_MAX_AGE_S - 60) * 1000), true, 'still valid on day 89');
  assert.equal(verifyGuestCookie(a, value, now + (GUEST_COOKIE_MAX_AGE_S + 1) * 1000), false, 'expired after 90 days');
  assert.equal(verifyGuestCookie(b, value, now), false, 'another site (same secret even) does not accept it: the site id is signed');
  assert.equal(verifyGuestCookie({ ...a, guestAccess: { ...a.guestAccess, version: 4 } }, value, now), false, 'new password version');
  assert.equal(verifyGuestCookie({ ...a, guestAccess: { ...a.guestAccess, secret: 'b'.repeat(43) } }, value, now), false, 'other secret');
  const [v, e, sig] = value.split('.');
  assert.equal(verifyGuestCookie(a, `${v}.${Number(e) + 86400 * 400}.${sig}`, now), false, 'expiry cannot be extended');
  assert.equal(verifyGuestCookie(a, `${v}.${e}.${sig.slice(0, -1)}${sig.endsWith('A') ? 'B' : 'A'}`, now), false, 'tampered signature');
  assert.equal(verifyGuestCookie(a, `${v}.${e}`, now), false);
  assert.equal(verifyGuestCookie(a, 'garbage', now), false);
  assert.equal(verifyGuestCookie(a, `${value}.x`, now), false);
  assert.equal(guestMayEnter(a, `other=1; ${guestCookieName(a.id)}=${value}`, now), true);
  assert.equal(guestMayEnter(a, `${guestCookieName(a.id)}=bad; ${guestCookieName(a.id)}=${value}`, now), true, 'one good value of two is enough');
  assert.equal(guestMayEnter(a, `${guestCookieName(b.id)}=${value}`, now), false, "another site's cookie name");
  assert.equal(guestMayEnter(b, `${guestCookieName(b.id)}=${value}`, now), false, "site A's value under site B's name");
  assert.equal(guestMayEnter({ ...a, guestAccess: { ...a.guestAccess, enabled: false } }, null, now), true, 'password off: open');
  assert.equal(guestMayEnter({ ...a, guestAccess: null }, null, now), true, 'no password: open');
});

// ---------------------------------------------------------------------------------------------- panel

test('panel: turn on (4–40), state shows it to the couple only, off keeps it, same password keeps guests in, a new one signs them out', async () => {
  const k = await newSite();
  const before = await getState(k);
  assert.deepEqual(before.guestAccess, { enabled: false, password: null }, 'off by default');

  assert.equal((await access(k, { enabled: true })).status, 422, 'no password yet');
  assert.equal((await access(k, { enabled: true, password: 'abc' })).data.code, 'invalid_password');
  assert.equal((await access(k, { enabled: true, password: 'x'.repeat(41) })).status, 422);
  assert.equal((await access(k, { enabled: 'yes', password: PASSWORD })).status, 400);
  assert.equal((await access(k, { enabled: true, password: PASSWORD }, k.previewKey)).status, 401, 'the preview key cannot change it');
  assert.equal((await access(k, { enabled: true, password: PASSWORD }, 'x'.repeat(43))).status, 401);
  assert.equal((await stored(k)).guestAccess ?? null, null, 'nothing written by refused calls');

  const on = await access(k, { enabled: true, password: `  ${PASSWORD} ` });
  assert.equal(on.status, 200);
  assert.deepEqual(on.data.guestAccess, { enabled: true, password: PASSWORD });
  assert.equal(on.data.signedOut, false);
  assert.ok(typeof on.data.updatedAt === 'string' && on.data.updatedAt > before.updatedAt, 'new version for the autosave queue');
  assert.deepEqual((await getState(k)).guestAccess, { enabled: true, password: PASSWORD });
  const rec1 = (await stored(k)).guestAccess!;
  assert.equal(rec1.version, 1);
  assert.ok(rec1.secret.length >= 43);
  assert.ok(!JSON.stringify(on.data).includes(rec1.secret), 'the cookie secret never reaches the panel');
  assert.equal('version' in on.data.guestAccess, false);

  const off = await access(k, { enabled: false });
  assert.deepEqual(off.data.guestAccess, { enabled: false, password: PASSWORD }, 'off keeps the password for later');
  const again = await access(k, { enabled: true });
  assert.equal(again.status, 200);
  assert.equal(again.data.signedOut, false);
  assert.equal((await stored(k)).guestAccess!.version, 1, 'same password: guests stay in');
  assert.equal((await access(k, { enabled: true, password: PASSWORD.toLowerCase() })).data.signedOut, false, 'only the case changed: same for guests');
  assert.equal((await stored(k)).guestAccess!.version, 1);
  const changed = await access(k, { enabled: true, password: 'Velvet Swan 81' });
  assert.equal(changed.data.signedOut, true);
  assert.equal((await stored(k)).guestAccess!.version, 2);
  assert.equal((await stored(k)).guestAccess!.secret, rec1.secret);

  // the draft content does not carry it: it is never published with the pages
  assert.doesNotMatch(JSON.stringify((await stored(k)).content), /Velvet/);
  assert.doesNotMatch(JSON.stringify((await stored(k)).publishedContent), /Velvet/);
});

test('panel: an autosave after a password change uses the new version; publish works while protected', async () => {
  const k = await newSite();
  const s = await getState(k);
  const on = await access(k, { enabled: true, password: PASSWORD });
  const c = structuredClone(s.content) as ContentRecord;
  c.venue.name = 'The Glasshouse';
  const stale = await call(saveRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { method: 'PUT', key: k.editKey, json: { content: c, baseUpdatedAt: s.updatedAt } });
  assert.equal(stale.status, 409, 'the old version is stale (the panel queues the access call and takes its updatedAt)');
  const ok = await call(saveRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { method: 'PUT', key: k.editKey, json: { content: c, baseUpdatedAt: on.data.updatedAt } });
  assert.equal(ok.status, 200);
  assert.deepEqual(ok.data.guestAccess, { enabled: true, password: PASSWORD });
  assert.equal((await call(publishRoute, `/api/edit/${k.slug}/publish`, { slug: k.slug }, { method: 'POST', key: k.editKey })).status, 200);
});

// ---------------------------------------------------------------------------------------------- routes

test('without the cookie every guest route is closed: pages, unknown-to-theme pages, .ics, photos, RSVP status + reply', async () => {
  const k = await protectedSite();
  assertGate(await index(k), 'index');
  for (const p of ['home', 'story', 'details', 'rsvp']) assertGate(await page(k, p), p);
  assert.equal((await page(k, 'admin')).status, 404, 'not a page name of the platform: 404 as before');

  const cal = await ics(k);
  assert.equal(cal.status, 303);
  assert.equal(cal.headers.get('location'), `/${k.slug}`);
  assert.equal(cal.headers.get('cache-control'), 'private, no-store');
  assert.doesNotMatch(cal.text, /BEGIN:VCALENDAR/);

  const photo = await media(k.photo);
  assert.equal(photo.status, 401);
  assert.equal(photo.headers.get('cache-control'), 'private, no-store');
  assert.doesNotMatch(photo.headers.get('content-type') ?? '', /image/);

  const status = await rsvpStatus(k);
  assert.equal(status.status, 401);
  assert.equal(status.data.code, 'password_required');
  assert.equal(status.data.deadline, undefined, 'no deadline without the password');
  const reply = await rsvpPost(k);
  assert.equal(reply.status, 401);
  assert.equal(reply.data.code, 'password_required');
  const list = await call(repliesRoute, `/api/rsvp/${k.slug}/responses`, { slug: k.slug }, { key: k.editKey });
  assert.equal(list.data.counts.responses, 0, 'nothing stored');
});

test('the password page: names + "You\'re invited" only, the theme\'s own stylesheets and colours, a name-free share picture', async () => {
  const k = await protectedSite('blush-garden-rose');
  const res = await index(k, { headers: { 'x-forwarded-host': 'wedding.example', 'x-forwarded-proto': 'https' } });
  assertGate(res, 'blush index');
  const $ = cheerio.load(res.text);
  assert.equal($('title').text(), 'Clara & Julian');
  assert.equal($('meta[name="description"]').attr('content'), "You're invited");
  assert.equal($('meta[name="theme-color"]').attr('content'), '#F2D8D7', "the theme's own page colour");
  const sheets = $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get();
  assert.ok(sheets.includes('/themes/blush-garden-rose/site.css'), sheets.join());
  assert.ok(sheets.some((h) => h.startsWith('https://fonts.googleapis.com/css2?')), 'the theme fonts');
  assert.equal($('meta[property="og:image"]').attr('content'), 'https://wedding.example/themes/blush-garden-rose/img/og-1200x630.jpg');
  assert.equal($('meta[property="og:image:alt"]').attr('content'), 'Clara & Julian wedding invitation');
  assert.equal($('img').length, 0, 'no photos');
  assert.equal($('svg').length, 0, 'no drawn decoration');
  const csp = res.headers.get('content-security-policy')!;
  assert.match(csp, /script-src 'sha256-[^']+'/);
  assert.match(csp, /form-action 'self'/);
  assert.match(csp, /default-src 'none'/);
  assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
  // every inline script is covered by the hash
  const hash = /script-src '(sha256-[^']+)'/.exec(csp)![1];
  const { createHash } = await import('node:crypto');
  for (const s of $('script').get()) assert.equal(`sha256-${createHash('sha256').update($(s).text()).digest('base64')}`, hash);
});

test('unlock: wrong password -> 401 with the error; right one -> HttpOnly cookie + 303 to the same page; then everything opens', async () => {
  const k = await protectedSite();
  const wrong = await unlock(k, 'not it', { page: 'details' });
  assert.equal(wrong.status, 401);
  assert.equal(cheerio.load(wrong.text)('html').attr('data-site-gate'), 'wrong');
  assert.match(wrong.text, /That password isn’t right/);
  assert.equal(wrong.headers.get('set-cookie'), null);
  assert.equal(cheerio.load(wrong.text)('form').attr('action'), `/${k.slug}/details`, 'the form posts to the page the guest opened');

  const right = await unlock(k, ` ${PASSWORD.toUpperCase()} `, { page: 'details' });
  assert.equal(right.status, 303);
  assert.equal(right.headers.get('location'), `/${k.slug}/details`);
  const setCookie = right.headers.get('set-cookie')!;
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  assert.match(setCookie, /SameSite=Lax/);
  assert.match(setCookie, new RegExp(`Max-Age=${90 * 86400}`));
  assert.ok(setCookie.startsWith(guestCookieName(k.id)));
  const cookie = cookieOf(setCookie);

  for (const [name, res] of [
    ['index', await index(k, { cookie })],
    ['home', await page(k, 'home', { cookie })],
    ['details', await page(k, 'details', { cookie })],
    ['rsvp', await page(k, 'rsvp', { cookie })],
  ] as const) {
    assert.equal(res.status, 200, name);
    const $ = cheerio.load(res.text);
    assert.equal($('html').attr('data-site-gate'), undefined, name);
    assert.equal(res.headers.get('cache-control'), 'private, no-store', `${name}: a shared cache never keeps a protected page`);
    assert.match(res.headers.get('vary') ?? '', /Cookie/i);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
    // names + "You're invited" only, even for the guest who is in (a shared tab title / link preview)
    assert.equal($('meta[property="og:description"]').attr('content'), "You're invited", name);
    assert.equal($('meta[property="og:title"]').attr('content'), 'Clara & Julian', name);
    assert.equal($('title').text(), 'Clara & Julian', name);
    assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow');
    assert.doesNotMatch(res.text, new RegExp(PASSWORD, 'i'), `${name}: the password is never in a page`);
  }
  assert.match((await page(k, 'home', { cookie })).text, /Rosewater/, 'the real page');
  const cal = await ics(k, { cookie });
  assert.equal(cal.status, 200);
  assert.match(cal.text, /BEGIN:VCALENDAR/);
  assert.equal(cal.headers.get('cache-control'), 'private, no-store');
  const photo = await media(k.photo, { cookie });
  assert.equal(photo.status, 200);
  assert.equal(photo.headers.get('cache-control'), 'private, max-age=300', 'the guest may cache it, a shared cache never');
  assert.match(photo.headers.get('vary') ?? '', /Cookie/i);
  assert.equal((await rsvpStatus(k, { cookie })).status, 200);
  const reply = await rsvpPost(k, { cookie });
  assert.equal(reply.status, 200);
  assert.equal((await call(repliesRoute, `/api/rsvp/${k.slug}/responses`, { slug: k.slug }, { key: k.editKey })).data.counts.responses, 1);

  // an already-admitted guest posting the form again is simply sent on (no attempt counted)
  const again = await unlock(k, 'whatever', { cookie });
  assert.equal(again.status, 303);
});

test('unlock keeps the address safe: Location is the checked path (+ its own query), never another host', async () => {
  const k = await protectedSite();
  const right = await unlock(k, PASSWORD, { page: 'home', query: '?x=%2F%2Fevil.example&next=https://evil.example', headers: { host: 'evil.example', 'x-forwarded-host': 'evil.example' } });
  assert.equal(right.status, 303);
  const loc = right.headers.get('location')!;
  assert.ok(loc.startsWith(`/${k.slug}/home?`), loc);
  assert.equal(new URL(loc, 'https://wedding.example').host, 'wedding.example', 'relative: stays on the host the guest is on');
  // a page name the platform does not have / bad slug: 404, no cookie
  assert.equal((await unlock(k, PASSWORD, { page: 'admin' })).status, 404);
  const bad = await call(siteUnlock, '/Not_A_Slug', { slug: 'Not_A_Slug' }, { method: 'POST', body: `site_access=1&password=${PASSWORD}`, type: 'application/x-www-form-urlencoded' });
  assert.equal(bad.status, 404);
  assert.equal(bad.headers.get('set-cookie'), null);
});

test('other POSTs to page addresses stay 405 (the RSVP form without JavaScript); cross-site password posts are refused', async () => {
  const k = await protectedSite();
  const rsvpFallback = await call(pageUnlock, `/${k.slug}/rsvp`, { slug: k.slug, page: 'rsvp' }, { method: 'POST', body: 'name=Ada&attending=yes', type: 'application/x-www-form-urlencoded' });
  assert.equal(rsvpFallback.status, 405);
  assert.match(rsvpFallback.headers.get('allow') ?? '', /GET/);
  assert.equal((await call(siteUnlock, `/${k.slug}`, { slug: k.slug }, { method: 'POST', json: { site_access: '1', password: PASSWORD } })).status, 405);
  const cross = await unlock(k, PASSWORD, { headers: { 'sec-fetch-site': 'cross-site' } });
  assert.equal(cross.status, 403);
  assert.equal(cross.headers.get('set-cookie'), null);
  assert.equal((await unlock(k, PASSWORD, { headers: { 'sec-fetch-site': 'same-origin' } })).status, 303);
  const big = await unlock(k, 'x'.repeat(5000));
  assert.equal(big.status, 413);
});

test('rate limit: 10 wrong passwords per address and site, then even the right one waits; other addresses / sites are not affected', async () => {
  setAccessRateLimiter(new MemoryRateLimiter());
  try {
    const k = await protectedSite();
    const other = await protectedSite();
    const ip = '198.51.100.20';
    for (let i = 0; i < ACCESS_LIMITS.wrongPerSiteIp.limit; i++) assert.equal((await unlock(k, `wrong-${i}`, { ip })).status, 401, `try ${i + 1}`);
    const locked = await unlock(k, PASSWORD, { ip });
    assert.equal(locked.status, 429, 'the right password is refused while locked');
    assert.equal(cheerio.load(locked.text)('html').attr('data-site-gate'), 'wait');
    assert.match(locked.text, /Too many tries\. Please wait \d+ minutes? and try again\./);
    assert.ok(Number(locked.headers.get('retry-after')) > 0);
    assert.equal(locked.headers.get('set-cookie'), null);
    assert.equal((await unlock(k, PASSWORD, { ip: '198.51.100.21' })).status, 303, 'another address');
    assert.equal((await unlock(other, PASSWORD, { ip })).status, 303, 'another website from the same address');
    // right passwords are never counted: a family / venue Wi-Fi can let many guests in
    for (let i = 0; i < 25; i++) assert.equal((await unlock(other, PASSWORD, { ip: '192.0.2.50' })).status, 303);
    // IPv6: the whole /64 is one address
    for (let i = 0; i < ACCESS_LIMITS.wrongPerSiteIp.limit; i++) await unlock(k, 'nope', { ip: `2001:db8:1:2::${i + 1}` });
    assert.equal((await unlock(k, PASSWORD, { ip: '2001:db8:1:2::ffff' })).status, 429);
  } finally {
    setAccessRateLimiter(new MemoryRateLimiter());
  }
});

test('rate limit across all websites from one address (30 wrong per 15 minutes)', async () => {
  setAccessRateLimiter(new MemoryRateLimiter());
  try {
    const sites = await Promise.all([0, 1, 2, 3].map(() => protectedSite()));
    const ip = '198.51.100.99';
    let n = 0;
    for (const s of sites.slice(0, 3)) for (let i = 0; i < 10; i++, n++) assert.equal((await unlock(s, 'nope', { ip })).status, 401);
    assert.equal(n, ACCESS_LIMITS.wrongPerIp.limit);
    assert.equal((await unlock(sites[3], PASSWORD, { ip })).status, 429, 'a fresh website, but this address guessed too much');
  } finally {
    setAccessRateLimiter(new MemoryRateLimiter());
  }
});

test('the shared limiter works across server instances (blob counter): wrong tries counted on one, seen on the other', async () => {
  const fake = new FakeBlobStore();
  const [one, two] = [0, 1].map(() => new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 }));
  const a = new AdapterRateLimiter(one);
  const b = new AdapterRateLimiter(two);
  const rule = ACCESS_LIMITS.wrongPerSiteIp;
  assert.equal((await b.peek('access:wrong:s:1.2.3.4', rule)).allowed, true);
  for (let i = 0; i < rule.limit; i++) await (i % 2 ? a : b).hit('access:wrong:s:1.2.3.4', rule);
  const seen = await b.peek('access:wrong:s:1.2.3.4', rule);
  assert.equal(seen.allowed, false);
  assert.ok(seen.retryAfterMs > 0 && seen.retryAfterMs <= rule.windowMs);
  assert.equal((await a.peek('access:wrong:s:5.6.7.8', rule)).allowed, true, 'per address');
  // the guest password itself on blob storage (conditional write)
  const created = await createSiteWithKeys(one, { slug: 'g076-blob', theme: '_sample', content: demoContent() });
  const { site } = await setGuestAccess(one, created.site.id, { enabled: true, password: PASSWORD });
  const fromTwo = (await two.getSiteById(site.id))!;
  assert.equal(fromTwo.guestAccess!.enabled, true);
  assert.equal(guestMayEnter(fromTwo, `${guestCookieName(site.id)}=${guestCookieValue(site)}`), true, 'a cookie from instance one opens on instance two');
});

test('a new password signs every guest out; the old cookie gets the password page again', async () => {
  const k = await protectedSite();
  const cookie = cookieOf((await unlock(k, PASSWORD)).headers.get('set-cookie'));
  assert.equal((await page(k, 'home', { cookie })).status, 200);
  assert.match((await page(k, 'home', { cookie })).text, /Rosewater/);
  const changed = await access(k, { enabled: true, password: 'Velvet Swan 81' });
  assert.equal(changed.data.signedOut, true);
  assertGate(await page(k, 'home', { cookie }), 'old cookie after the change');
  assert.equal((await media(k.photo, { cookie })).status, 401);
  assert.equal((await rsvpStatus(k, { cookie })).status, 401);
  assert.equal((await unlock(k, PASSWORD)).status, 401, 'the old password is wrong now');
  const fresh = cookieOf((await unlock(k, 'velvet swan 81')).headers.get('set-cookie'));
  assert.match((await page(k, 'home', { cookie: fresh })).text, /Rosewater/);
  // off: open to everyone again (and public caching is back)
  await access(k, { enabled: false });
  const open = await page(k, 'home');
  assert.equal(open.status, 200);
  assert.equal(open.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
  assert.equal(open.headers.get('x-robots-tag'), 'noindex');
  assert.equal((await media(k.photo)).headers.get('cache-control'), 'public, max-age=300, s-maxage=300');
});

test('a cookie of one website does not open another', async () => {
  const a = await protectedSite();
  const b = await protectedSite();
  const cookieA = cookieOf((await unlock(a, PASSWORD)).headers.get('set-cookie'));
  assertGate(await index(b, { cookie: cookieA }), 'cookie of A on B');
  const moved = `${guestCookieName(b.id)}=${cookieA.split('=').slice(1).join('=')}`;
  assertGate(await index(b, { cookie: moved }), "A's value under B's cookie name");
  assert.equal((await media(b.photo, { cookie: moved })).status, 401);
  assert.equal((await rsvpPost(b, { cookie: moved })).status, 401);
});

test('panel and its preview token never need the password; the long-lived preview link does', async () => {
  const k = await protectedSite();
  const state = await getState(k);
  assert.equal(state.guestAccess.enabled, true);
  const token = state.previewToken as string;
  const pv = await page(k, 'home', {}, `?preview=${token}`);
  assert.equal(pv.status, 200);
  assert.equal(cheerio.load(pv.text)('html').attr('data-site-gate'), undefined);
  assert.equal(pv.headers.get('cache-control'), 'private, no-store');
  assert.equal((await index(k, {}, `?preview=${token}`)).status, 200);
  assert.equal((await ics(k, {}, `?preview=${token}`)).status, 200);
  assert.equal((await media(`${k.photo}?preview=${token}`)).status, 200);
  const st = await rsvpStatus(k, {}, `?preview=${token}`);
  assert.equal(st.status, 200);
  assert.equal(st.data.preview, true);
  // the shared (long-lived) preview link is a link that travels: it asks for the password like the website
  assertGate(await page(k, 'home', {}, `?preview=${k.previewKey}`), 'shared preview link');
  assert.equal((await rsvpStatus(k, {}, `?preview=${k.previewKey}`)).status, 401);
  const cookie = cookieOf((await unlock(k, PASSWORD, { page: 'home', query: `?preview=${k.previewKey}` })).headers.get('set-cookie'));
  const shared = await page(k, 'home', { cookie }, `?preview=${k.previewKey}`);
  assert.equal(shared.status, 200);
  assert.match(shared.text, /data-platform-preview-bar/);
});

test('order: unknown / unpublished -> 404, archived -> 410 (no names) before the password; never a password page for a draft', async () => {
  const draft = await newSite({ publish: false });
  await access(draft, { enabled: true, password: PASSWORD });
  assert.equal((await index(draft)).status, 404, 'an unpublished site says nothing (not even that it has a password)');
  assert.equal((await page(draft, 'home')).status, 404);
  assert.equal((await ics(draft)).status, 404);
  assert.equal((await rsvpStatus(draft)).status, 404);
  assert.equal((await unlock(draft, PASSWORD)).status, 303, 'nothing to unlock: sent to the GET (404)');
  assert.equal((await unlock(draft, PASSWORD)).headers.get('set-cookie'), null);

  const k = await protectedSite();
  await setArchiveOverride(getDataAdapter(), k.id, '2020-01-01', 'test: archive now');
  for (const [name, res] of [
    ['index', await index(k)],
    ['home', await page(k, 'home')],
    ['ics', await ics(k)],
    ['photo', await media(k.photo)],
  ] as const) {
    assert.equal(res.status, 410, name);
    assert.doesNotMatch(res.text, /Clara/, `${name}: no names`);
  }
  assert.equal((await rsvpStatus(k)).status, 404);
  // the couple still sees it in the panel preview
  assert.equal((await page(k, 'home', {}, `?preview=${(await getState(k)).previewToken}`)).status, 200);
  // the access switch is a write: archived sites refuse it
  assert.equal((await access(k, { enabled: false })).data.code, 'archived');
});

test('privacy: the password is in no public answer; protected sites never reach sitemaps (couple sites never do)', async () => {
  const k = await protectedSite('blush-garden-rose');
  const cookie = cookieOf((await unlock(k, PASSWORD)).headers.get('set-cookie'));
  const outputs = [
    await index(k),
    await page(k, 'rsvp'),
    await unlock(k, 'wrong one'),
    await index(k, { cookie }),
    ...(await Promise.all(['home', 'story', 'details', 'rsvp'].map((p) => page(k, p, { cookie })))),
    await ics(k, { cookie }),
    await rsvpStatus(k, { cookie }),
    await rsvpStatus(k),
  ];
  for (const o of outputs) {
    assert.doesNotMatch(o.text, new RegExp(PASSWORD, 'i'));
    assert.doesNotMatch(o.text, /guestAccess|secret/);
    for (const [name, value] of o.headers) assert.doesNotMatch(`${name}: ${value}`, new RegExp(PASSWORD, 'i'));
  }
  const launched = { ...MARKETING, launched: true };
  const xml = sitemapXml([], launched);
  assert.doesNotMatch(xml, new RegExp(k.slug));
  assert.doesNotMatch(xml, /g076-site-/);
});
