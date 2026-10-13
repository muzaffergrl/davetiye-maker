// Edit panel (G039): key checks, draft autosave, validation, photo uploads, publish / unpublish,
// QR code, validator platform option and the panel's pure helpers.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as cheerio from 'cheerio';
import jsQR from 'jsqr';
import { GET as stateRoute, PUT as saveRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as photoRoute } from '../app/api/edit/[slug]/photo/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { POST as unpublishRoute } from '../app/api/edit/[slug]/unpublish/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { GET as mediaRoute } from '../app/media/[...path]/route.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { derivePreviewKey, generateKey } from '../lib/keys.ts';
import { prepareDraft, DraftShapeError } from '../lib/panel/draft.ts';
import { publicOrigin } from '../lib/panel/http.ts';
import {
  defaultInitials,
  pageShown,
  panelIssues,
  parseAspect,
  photoAt,
  prePublishNotes,
  previewPhotoUrl,
  sameContent,
  sectionForPath,
  shapeLabel,
  withPartnerName,
  withPhoto,
} from '../lib/panel/model.ts';
import { panelTheme, themeFieldUse } from '../lib/panel/state.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { readFileSync } from 'node:fs';
import { centreCrop } from '../lib/panel/photos.ts';
import { qrMatrix, qrSvg, QR_BORDER } from '../lib/qr.ts';
import { createSiteWithKeys } from '../lib/sites.ts';
import { MAX_UPLOAD_BYTES } from '../lib/uploads.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const require = createRequire(import.meta.url);
// sharp's ESM typings lack the default factory; the CJS entry is used untyped in tests.
const sharp: any = require('sharp');

const BASE = 'http://localhost:3000';
type Keys = { id: string; editKey: string; previewKey: string };
let site: Keys;
let other: Keys;

before(async () => {
  const themes = tmpDir('panel-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('panel-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  const adapter = getDataAdapter();
  const a = await createSiteWithKeys(adapter, { slug: 'panel-site', theme: '_sample', content: demoContent() });
  site = { id: a.site.id, editKey: a.editKey, previewKey: a.previewKey };
  const b = await createSiteWithKeys(adapter, { slug: 'other-site', theme: '_sample', content: demoContent() });
  other = { id: b.site.id, editKey: b.editKey, previewKey: b.previewKey };
});

type Handler = (req: Request, ctx: { params: Promise<{ slug: string }> }) => Promise<Response>;

const SUFFIX = new Map<Handler, string>();
function suffixOf(h: Handler): string {
  if (!SUFFIX.size) {
    SUFFIX.set(stateRoute, '');
    SUFFIX.set(saveRoute, '');
    SUFFIX.set(photoRoute, '/photo');
    SUFFIX.set(publishRoute, '/publish');
    SUFFIX.set(unpublishRoute, '/unpublish');
  }
  return SUFFIX.get(h) ?? '';
}

async function call(
  handler: Handler,
  slug: string,
  opts: { method?: string; key?: string | null; json?: unknown; body?: BodyInit; contentType?: string; query?: string } = {},
) {
  const headers = new Headers();
  if (opts.key) headers.set('authorization', `Bearer ${opts.key}`);
  let body = opts.body;
  if (opts.json !== undefined) {
    body = JSON.stringify(opts.json);
    headers.set('content-type', 'application/json');
  }
  if (opts.contentType) headers.set('content-type', opts.contentType);
  const method = opts.method ?? (handler === stateRoute ? 'GET' : handler === saveRoute ? 'PUT' : 'POST');
  const req = new Request(`${BASE}/api/edit/${slug}${suffixOf(handler)}${opts.query ?? ''}`, { method, headers, body });
  const res = await handler(req, { params: Promise.resolve({ slug }) });
  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, headers: res.headers, data };
}

async function state(keys = site) {
  const r = await call(stateRoute, 'panel-site', { key: keys.editKey });
  assert.equal(r.status, 200);
  return r.data.state as { content: ContentRecord; updatedAt: string; status: string; hasUnpublishedChanges: boolean };
}

async function save(content: ContentRecord, baseUpdatedAt?: string) {
  return call(saveRoute, 'panel-site', { key: site.editKey, json: { content, ...(baseUpdatedAt ? { baseUpdatedAt } : {}) } });
}

async function publicPage(slug = 'panel-site', query = '') {
  const res = await siteRoute(new Request(`${BASE}/${slug}${query}`), { params: Promise.resolve({ slug }) });
  return { status: res.status, html: await res.text() };
}

/** Real JPEG with EXIF (camera make + copyright), generated in code. */
async function exifJpeg(width: number, height: number): Promise<Uint8Array> {
  const buf = await sharp({ create: { width, height, channels: 3, background: '#9db4c0' } })
    .jpeg()
    .withExif({ IFD0: { Make: 'TestCam', Copyright: 'fictional test' } })
    .toBuffer();
  return new Uint8Array(buf);
}

// ---------------------------------------------------------------------------------------------
// Keys

test('edit key: good key opens the panel state; preview key is derived from it', async () => {
  const r = await call(stateRoute, 'panel-site', { key: site.editKey });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('cache-control'), 'private, no-store');
  assert.equal(r.headers.get('referrer-policy'), 'no-referrer');
  const s = r.data.state;
  assert.equal(s.slug, 'panel-site');
  assert.equal(s.status, 'draft');
  assert.equal(s.previewKey, site.previewKey);
  assert.equal(s.previewKey, derivePreviewKey(site.editKey));
  assert.equal(s.origin, BASE);
  assert.equal(s.content.name_display, 'Clara & Julian');
  assert.deepEqual(s.theme.pages, ['index', 'home', 'story', 'details', 'rsvp']);
  const hero = s.theme.photos.find((p: { key: string }) => p.key === 'hero');
  assert.deepEqual(hero, { key: 'hero', label: 'Hero portrait', source: 'media.hero_portrait', aspect: '4/5', ratio: 0.8 });
  assert.deepEqual(s.theme.optionalBlocks, ['our_story', 'countdown', 'dress_code', 'registry', 'travel_stay', 'faq']);
  assert.ok(!JSON.stringify(r.data).includes(site.editKey), 'the edit key is never echoed');
});

test('edit key: wrong, missing, other-site, query-string and unknown-slug keys all get the same 401', async () => {
  const expected = { ok: false, code: 'unauthorized', message: 'This edit link is not valid.' };
  const attempts = [
    await call(stateRoute, 'panel-site', { key: generateKey() }),
    await call(stateRoute, 'panel-site', { key: null }),
    await call(stateRoute, 'panel-site', { key: other.editKey }),
    await call(stateRoute, 'panel-site', { key: null, query: `?k=${site.editKey}` }),
    await call(stateRoute, 'panel-site', { key: 'short' }),
    await call(stateRoute, 'nobody-here', { key: site.editKey }),
    await call(stateRoute, 'edit', { key: site.editKey }),
    await call(stateRoute, '../panel-site', { key: site.editKey }),
  ];
  for (const r of attempts) {
    assert.equal(r.status, 401);
    assert.deepEqual(r.data, expected);
    assert.equal(r.headers.get('www-authenticate'), 'Bearer');
  }
});

test('preview key cannot edit: state, save, upload, publish and unpublish are all refused', async () => {
  const before = await state();
  const key = site.previewKey;
  const edited = structuredClone(before.content);
  edited.name_display = 'Hacked';
  const results = [
    await call(stateRoute, 'panel-site', { key }),
    await call(saveRoute, 'panel-site', { key, json: { content: edited } }),
    await call(photoRoute, 'panel-site', { key, body: tinyPng() as BodyInit, contentType: 'image/png', query: '?slot=hero' }),
    await call(publishRoute, 'panel-site', { key }),
    await call(unpublishRoute, 'panel-site', { key }),
  ];
  for (const r of results) assert.equal(r.status, 401);
  const after = await state();
  assert.equal(after.content.name_display, before.content.name_display);
  assert.equal(after.status, 'draft');
});

// ---------------------------------------------------------------------------------------------
// Draft save

test('draft save: stores the draft, returns validation, never touches the published copy', async () => {
  const s = await state();
  const c = structuredClone(s.content);
  c.partners[0].display_name = 'Elena';
  c.partners[1].display_name = 'Marco';
  c.name_display = 'Elena & Marco';
  c.initials = 'E&M';
  const r = await save(c, s.updatedAt);
  assert.equal(r.status, 200);
  assert.equal(r.data.ok, true);
  assert.equal(r.data.status, 'draft');
  assert.notEqual(r.data.updatedAt, s.updatedAt);
  assert.equal(r.data.validation.ok, true);
  assert.deepEqual(r.data.validation.warnings, []);
  const stored = await getDataAdapter().getSiteById(site.id);
  assert.equal(stored!.content.name_display, 'Elena & Marco');
  assert.equal(stored!.publishedContent, null);
  assert.equal((await publicPage()).status, 404, 'a draft is not public');
  const preview = await publicPage('panel-site', `?preview=${site.previewKey}`);
  assert.equal(preview.status, 200);
  assert.equal(cheerio.load(preview.html)('h1').text(), 'Elena & Marco');
});

test('draft save: stale baseUpdatedAt is a 409 conflict and nothing is stored', async () => {
  const s = await state();
  const c = structuredClone(s.content);
  c.host_line = 'Stale tab';
  const r = await save(c, '2000-01-01T00:00:00.000Z');
  assert.equal(r.status, 409);
  assert.equal(r.data.code, 'conflict');
  assert.equal(r.data.updatedAt, s.updatedAt);
  assert.match(r.data.message, /another window/);
  assert.notEqual((await state()).content.host_line, 'Stale tab');
});

test('draft save: record_kind and event_type keep their stored values', async () => {
  const s = await state();
  const c = structuredClone(s.content);
  c.record_kind = 'customer';
  c.event_type = 'engagement';
  const r = await save(c, s.updatedAt);
  assert.equal(r.status, 200);
  const after = await state();
  assert.equal(after.content.record_kind, 'demo');
  assert.equal(after.content.event_type, 'wedding');
});

test('draft save: an unfinished draft is stored; a mis-shaped one is refused', async () => {
  const s = await state();
  const unfinished = structuredClone(s.content);
  unfinished.partners[0].display_name = '';
  unfinished.ceremony_time = '';
  unfinished.urls.map = 'maps.example';
  const ok = await save(unfinished, s.updatedAt);
  assert.equal(ok.status, 200);
  assert.equal(ok.data.validation.ok, false);
  const paths = ok.data.validation.errors.map((i: { path: string }) => i.path).sort();
  assert.deepEqual(paths, ['ceremony_time', 'partners.0.display_name', 'urls.map']);

  const shapes: unknown[] = [
    'not an object',
    [1, 2],
    { ...s.content, extra_field: true },
    { ...s.content, partners: 'Elena and Marco' },
    { ...s.content, partners: [{ display_name: 'A' }, { display_name: 'B' }, { display_name: 'C' }] },
    { ...s.content, locale: 'tr-TR' },
    { ...s.content, venue: undefined },
  ];
  for (const content of shapes) {
    const r = await call(saveRoute, 'panel-site', { key: site.editKey, json: { content } });
    assert.equal(r.status, 400, JSON.stringify(content).slice(0, 80));
    assert.equal(r.data.code, 'invalid_shape');
    assert.ok(Array.isArray(r.data.issues) && r.data.issues.length);
  }
  // restore a valid draft for the next tests
  const fixed = structuredClone(unfinished);
  fixed.partners[0].display_name = 'Elena';
  fixed.ceremony_time = '16:00';
  fixed.urls.map = null;
  assert.equal((await save(fixed)).status, 200);
});

test('draft save: wrong content type, bad JSON and oversized bodies are refused', async () => {
  const wrongType = await call(saveRoute, 'panel-site', { key: site.editKey, body: '{}', contentType: 'text/plain' });
  assert.equal(wrongType.status, 415);
  const badJson = await call(saveRoute, 'panel-site', { key: site.editKey, body: '{"content":', contentType: 'application/json' });
  assert.equal(badJson.status, 400);
  assert.equal(badJson.data.code, 'bad_json');
  const huge = await call(saveRoute, 'panel-site', { key: site.editKey, body: JSON.stringify({ content: { x: 'a'.repeat(80_000) } }), contentType: 'application/json' });
  assert.equal(huge.status, 413);
});

// ---------------------------------------------------------------------------------------------
// Validation

test('validator option: platform records do not warn about empty urls.website / urls.rsvp_form', () => {
  const customer = demoContent();
  customer.record_kind = 'customer';
  customer.optional_blocks.registry = false;
  const plain = validateContent(customer);
  assert.deepEqual(
    plain.warnings.map((w) => [w.code, w.path]),
    [
      ['customer_url_missing', 'urls.website'],
      ['customer_url_missing', 'urls.rsvp_form'],
    ],
  );
  const platform = validateContent(customer, { platform: true });
  assert.equal(platform.ok, true);
  assert.deepEqual(platform.warnings, []);
  // Other warnings and all errors stay.
  customer.optional_blocks.registry = true;
  customer.rsvp.deadline = '2027-06-01';
  const strict = validateContent(customer, { platform: true });
  assert.deepEqual(strict.errors.map((e) => e.code), ['rsvp_deadline_not_before_event']);
  assert.deepEqual(strict.warnings.map((w) => w.code), ['registry_without_url']);
  assert.equal(validateContent(customer).ok, false);
  // Demo records never had the warning; the option changes nothing for them.
  assert.deepEqual(validateContent(demoContent(), { platform: true }), validateContent(demoContent()));
});

test('validation errors come back from a save with clear messages and paths', async () => {
  const s = await state();
  const c = structuredClone(s.content);
  c.rsvp.deadline = '2027-06-01'; // after the May 15, 2027 wedding
  c.schedule[1].time = '15:00'; // before the ceremony row
  const r = await save(c, s.updatedAt);
  assert.equal(r.status, 200);
  const { errors, warnings } = r.data.validation;
  assert.deepEqual(errors, [
    { level: 'error', code: 'rsvp_deadline_not_before_event', path: 'rsvp.deadline', message: 'The RSVP deadline must be before the event date.' },
  ]);
  assert.deepEqual(warnings.map((w: { code: string }) => w.code), ['schedule_not_chronological']);
  c.rsvp.deadline = '2027-04-03';
  c.schedule[1].time = '17:00';
  assert.equal((await save(c)).data.validation.ok, true);
});

test('panelIssues rewords empty-field issues only', () => {
  const c = demoContent();
  c.ceremony_time = '';
  c.partners[0].display_name = '';
  c.date = '';
  const issues = panelIssues(validateContent(c).errors, c);
  const byPath = Object.fromEntries(issues.map((i) => [i.path, i.message]));
  assert.equal(byPath['ceremony_time'], 'Please enter a time.');
  assert.equal(byPath['partners.0.display_name'], 'Please enter a name.');
  assert.equal(byPath['date'], 'Please choose a date.');
  const bad = demoContent();
  bad.ceremony_time = '4pm';
  assert.equal(panelIssues(validateContent(bad).errors, bad)[0].message, 'Use 24-hour time, e.g. 16:30.');
});

// ---------------------------------------------------------------------------------------------
// Uploads

test('upload: a JPEG is re-encoded (EXIF removed), cropped to the slot ratio and served from /media', async () => {
  const r = await call(photoRoute, 'panel-site', { key: site.editKey, body: (await exifJpeg(1200, 900)) as BodyInit, contentType: 'image/jpeg', query: '?slot=hero' });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  assert.equal(r.data.slot, 'hero');
  assert.equal(r.data.source, 'media.hero_portrait');
  assert.equal(r.data.contentType, 'image/jpeg');
  assert.match(r.data.url, new RegExp(`^/media/${site.id}/[0-9a-f]{32}\\.jpg$`));
  assert.equal(r.data.width / r.data.height, 0.8); // 4/5 slot: 1200x900 -> 720x900
  const segments = r.data.url.replace('/media/', '').split('/');
  // Not published yet: only the buyer's own views (preview key) get the photo.
  const hidden = await mediaRoute(new Request(`${BASE}${r.data.url}`), { params: Promise.resolve({ path: segments }) });
  assert.equal(hidden.status, 404, 'an unpublished photo is not public');
  const media = await mediaRoute(new Request(`${BASE}${r.data.url}?preview=${site.previewKey}`), { params: Promise.resolve({ path: segments }) });
  assert.equal(media.status, 200);
  assert.equal(media.headers.get('cache-control'), 'private, no-store');
  const meta = await sharp(Buffer.from(await media.arrayBuffer())).metadata();
  assert.equal(meta.format, 'jpeg');
  assert.equal(meta.width, 720);
  assert.equal(meta.height, 900);
  assert.equal(meta.exif, undefined, 'EXIF (camera, GPS) is removed');
  // The upload alone does not change the draft; the panel stores the URL with its next save.
  assert.equal(photoAt((await state()).content, 'media.hero_portrait'), null);
});

test('upload: PNG, WebP are accepted; large photos are scaled to 2400 px', async () => {
  const png = await call(photoRoute, 'panel-site', { key: site.editKey, body: tinyPng() as BodyInit, contentType: 'image/png', query: '?slot=story1' });
  assert.equal(png.status, 200);
  const webp = new Uint8Array(await sharp({ create: { width: 3000, height: 4000, channels: 3, background: '#c0a080' } }).webp().toBuffer());
  const big = await call(photoRoute, 'panel-site', { key: site.editKey, body: webp as BodyInit, contentType: 'image/webp', query: '?slot=story2' });
  assert.equal(big.status, 200);
  assert.deepEqual([big.data.width, big.data.height], [1800, 2400]);
});

test('upload limits: empty, too large, wrong type, unreadable, too many pixels, unknown slot, no key', async () => {
  const key = site.editKey;
  const empty = await call(photoRoute, 'panel-site', { key, body: new Uint8Array(0) as BodyInit, contentType: 'image/jpeg', query: '?slot=hero' });
  assert.equal(empty.status, 400);
  assert.equal(empty.data.code, 'empty');

  const tooBig = new Uint8Array(MAX_UPLOAD_BYTES + 1);
  tooBig.set([0xff, 0xd8, 0xff]);
  const large = await call(photoRoute, 'panel-site', { key, body: tooBig as BodyInit, contentType: 'image/jpeg', query: '?slot=hero' });
  assert.equal(large.status, 413);
  assert.equal(large.data.code, 'too_large');
  assert.match(large.data.message, /larger than 10 MB/);

  const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
  const gif = new TextEncoder().encode('GIF89a\x01\x00\x01\x00');
  const html = new TextEncoder().encode('<!DOCTYPE html><title>x</title>');
  for (const [body, type] of [
    [svg, 'image/svg+xml'],
    [gif, 'image/gif'],
    [html, 'image/jpeg'], // the browser's type is not trusted
  ] as const) {
    const r = await call(photoRoute, 'panel-site', { key, body: body as BodyInit, contentType: type, query: '?slot=hero' });
    assert.equal(r.status, 415, type);
    assert.equal(r.data.code, 'unsupported_type');
    assert.equal(r.data.message, 'Please upload a JPG, PNG, WebP or AVIF photo.');
  }

  const corrupt = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const unreadable = await call(photoRoute, 'panel-site', { key, body: corrupt as BodyInit, contentType: 'image/jpeg', query: '?slot=hero' });
  assert.equal(unreadable.status, 415);
  assert.match(unreadable.data.message, /could not be read/);

  const bomb = new Uint8Array(await sharp({ create: { width: 8000, height: 7000, channels: 3, background: '#ffffff' } }).png({ compressionLevel: 9 }).toBuffer());
  assert.ok(bomb.length < MAX_UPLOAD_BYTES);
  const pixels = await call(photoRoute, 'panel-site', { key, body: bomb as BodyInit, contentType: 'image/png', query: '?slot=hero' });
  assert.equal(pixels.status, 413);
  assert.match(pixels.data.message, /too many pixels/);

  const slot = await call(photoRoute, 'panel-site', { key, body: tinyPng() as BodyInit, contentType: 'image/png', query: '?slot=nope' });
  assert.equal(slot.status, 400);
  assert.equal(slot.data.code, 'unknown_slot');

  const noKey = await call(photoRoute, 'panel-site', { key: null, body: tinyPng() as BodyInit, contentType: 'image/png', query: '?slot=hero' });
  assert.equal(noKey.status, 401);
});

// ---------------------------------------------------------------------------------------------
// Publish / unpublish

test('publish refuses invalid content with clear messages; valid content goes live with photo and names', async () => {
  let s = await state();
  const bad = structuredClone(s.content);
  bad.rsvp.deadline = '2027-06-01';
  bad.partners[1].display_name = '';
  await save(bad, s.updatedAt);
  const refused = await call(publishRoute, 'panel-site', { key: site.editKey });
  assert.equal(refused.status, 422);
  assert.equal(refused.data.code, 'invalid_content');
  assert.equal(refused.data.message, 'Please fix these before publishing.');
  assert.deepEqual(
    refused.data.issues.map((i: { path: string }) => i.path),
    ['partners.1.display_name'], // schema errors are reported first (business rules run after)
  );
  assert.equal((await publicPage()).status, 404);

  bad.partners[1].display_name = 'Marco';
  s = await state();
  await save(bad, s.updatedAt);
  const refused2 = await call(publishRoute, 'panel-site', { key: site.editKey });
  assert.equal(refused2.status, 422);
  assert.deepEqual(refused2.data.issues.map((i: { message: string }) => i.message), ['The RSVP deadline must be before the event date.']);

  // Upload a hero photo, store it in the draft, fix the deadline, publish.
  const up = await call(photoRoute, 'panel-site', { key: site.editKey, body: (await exifJpeg(800, 1000)) as BodyInit, contentType: 'image/jpeg', query: '?slot=hero' });
  s = await state();
  const good = withPhoto(structuredClone(s.content), 'media.hero_portrait', up.data.url);
  good.rsvp.deadline = '2027-04-03';
  const saved = await save(good, s.updatedAt);
  const stale = await call(publishRoute, 'panel-site', { key: site.editKey, json: { baseUpdatedAt: s.updatedAt } });
  assert.equal(stale.status, 409, 'publishing an older version than the stored one is refused');
  const pub = await call(publishRoute, 'panel-site', { key: site.editKey, json: { baseUpdatedAt: saved.data.updatedAt } });
  assert.equal(pub.status, 200, JSON.stringify(pub.data));
  assert.equal(pub.data.status, 'published');
  assert.equal(pub.data.url, `${BASE}/panel-site`);
  assert.equal(pub.data.hasUnpublishedChanges, false);
  assert.ok(pub.data.publishedAt);

  const live = await publicPage();
  assert.equal(live.status, 200);
  const $ = cheerio.load(live.html);
  assert.equal($('h1').text(), 'Elena & Marco');
  assert.equal($('img[data-photo="hero"]').attr('src'), up.data.url);
});

test('publish: a save that lands after the version the buyer saw is a 409, not an unchecked publish', async () => {
  const s0 = await state();
  const before = (await getDataAdapter().getSiteById(site.id))!.publishedContent;
  const changed = structuredClone(s0.content);
  changed.host_line = 'Saved from another phone';
  await getDataAdapter().updateContent(site.id, changed);
  const r = await call(publishRoute, 'panel-site', { key: site.editKey, json: { baseUpdatedAt: s0.updatedAt } });
  assert.equal(r.status, 409);
  assert.equal(r.data.code, 'conflict');
  assert.deepEqual((await getDataAdapter().getSiteById(site.id))!.publishedContent, before, 'nothing published');
  // put the draft back as it was for the next tests
  await getDataAdapter().updateContent(site.id, s0.content);
});

test('after publishing: draft edits stay private until the next publish; unpublish takes the site offline', async () => {
  let s = await state();
  assert.equal(s.status, 'published');
  const c = structuredClone(s.content);
  c.name_display = 'Elena & Marco Rossi';
  const saved = await save(c, s.updatedAt);
  assert.equal(saved.data.hasUnpublishedChanges, true);
  assert.equal(cheerio.load((await publicPage()).html)('h1').text(), 'Elena & Marco');

  const again = await call(publishRoute, 'panel-site', { key: site.editKey });
  assert.equal(again.status, 200);
  assert.equal(cheerio.load((await publicPage()).html)('h1').text(), 'Elena & Marco Rossi');

  const off = await call(unpublishRoute, 'panel-site', { key: site.editKey });
  assert.equal(off.status, 200);
  assert.equal(off.data.status, 'draft');
  assert.ok(off.data.publishedAt, 'the last publish time is kept');
  assert.equal((await publicPage()).status, 404);
  assert.equal((await publicPage('panel-site', `?preview=${site.previewKey}`)).status, 200, 'the preview still works');
  s = await state();
  assert.equal(s.status, 'draft');
  // other site untouched
  assert.equal((await getDataAdapter().getSiteById(other.id))!.status, 'draft');
});

// ---------------------------------------------------------------------------------------------
// QR

function decodeQr(url: string): string | null {
  const qr = qrMatrix(url);
  const scale = 4;
  const side = (qr.size + QR_BORDER * 2) * scale;
  const px = new Uint8ClampedArray(side * side * 4).fill(255);
  qr.modules.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (!dark) return;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const i = (((y + QR_BORDER) * scale + dy) * side + (x + QR_BORDER) * scale + dx) * 4;
          px[i] = px[i + 1] = px[i + 2] = 0;
        }
      }
    }),
  );
  return jsQR(px, side, side)?.data ?? null;
}

test('QR: encodes the real public URL (decoded back with an independent reader)', () => {
  for (const url of ['https://wedding-sites.vercel.app/elena-and-marco', 'http://127.0.0.1:3313/panel-site']) {
    assert.equal(decodeQr(url), url);
  }
  const svg = qrSvg('https://wedding-sites.vercel.app/elena-and-marco', { dark: '#1f1d1a' });
  const side = qrMatrix('https://wedding-sites.vercel.app/elena-and-marco').size + 2 * QR_BORDER;
  assert.ok(svg.startsWith(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}"`));
  assert.match(svg, /fill="#1f1d1a"/);
  assert.throws(() => qrMatrix('javascript:alert(1)'), /Only http/);
  assert.throws(() => qrMatrix('/panel-site'), /Not a valid/);
  assert.throws(() => qrMatrix('https://averyandjordan.com/rsvp'), /demo/);
});

// ---------------------------------------------------------------------------------------------
// Helpers

test('withPhoto keeps memory_photos a list of strings (gaps "", no trailing empties)', () => {
  let c = demoContent();
  c = withPhoto(c, 'media.memory_photos.2', '/media/x/3.jpg');
  assert.deepEqual(c.media.memory_photos, ['', '', '/media/x/3.jpg']);
  assert.equal(photoAt(c, 'media.memory_photos.0'), null);
  assert.equal(photoAt(c, 'media.memory_photos.2'), '/media/x/3.jpg');
  c = withPhoto(c, 'media.memory_photos.0', '/media/x/1.jpg');
  c = withPhoto(c, 'media.memory_photos.2', null);
  assert.deepEqual(c.media.memory_photos, ['/media/x/1.jpg']);
  c = withPhoto(c, 'media.hero_portrait', '/media/x/h.jpg');
  assert.equal(c.media.hero_portrait, '/media/x/h.jpg');
  assert.equal(validateContent(c).ok, true);
  assert.throws(() => withPhoto(c, 'urls.website', 'x'), /not an editable photo slot/);
  assert.throws(() => withPhoto(c, 'media.memory_photos.4', 'x'));
});

test('withPartnerName keeps the automatic names and monogram in step, never a custom one', () => {
  let c = demoContent();
  c = withPartnerName(c, 0, 'display_name', 'Elena');
  assert.equal(c.name_display, 'Elena & Julian');
  assert.equal(c.initials, 'E&J');
  c.name_display = 'The Rossi Wedding';
  c.initials = 'R';
  c = withPartnerName(c, 1, 'display_name', 'Marco');
  assert.equal(c.name_display, 'The Rossi Wedding');
  assert.equal(c.initials, 'R');
  c = withPartnerName(c, 1, 'full_name', '  ');
  assert.equal(c.partners[1].full_name, null);
  assert.equal(defaultInitials(c.partners, true), 'E & M');
});

test('withPartnerName: the full name (invitation card) follows the first name until it is changed by hand', () => {
  // A /start draft: full name = the typed first name.
  let c = draftFromDemo(demoContent(), ['Mia', 'Theo']);
  assert.equal(c.partners[0].full_name, 'Mia');
  c = withPartnerName(c, 0, 'display_name', 'Ava');
  c = withPartnerName(c, 1, 'display_name', 'Noah');
  assert.deepEqual(c.partners.map((p) => p.full_name), ['Ava', 'Noah']);
  assert.equal(c.name_display, 'Ava & Noah');
  // an empty full name follows too; a full name typed by hand never does
  c = withPartnerName(c, 0, 'full_name', '');
  c = withPartnerName(c, 0, 'display_name', 'Avery');
  assert.equal(c.partners[0].full_name, 'Avery');
  c = withPartnerName(c, 1, 'full_name', 'Noah James Hart');
  c = withPartnerName(c, 1, 'display_name', 'Noe');
  assert.equal(c.partners[1].full_name, 'Noah James Hart');
  c = withPartnerName(c, 0, 'display_name', '');
  assert.equal(c.partners[0].full_name, null);
});

test('before publishing: sample text from the demo, empty photo places and link blocks without links are listed', async () => {
  const demo = JSON.parse(readFileSync(path.join(PLATFORM_ROOT, 'lib/claim/demo/blush-garden-rose.json'), 'utf8')) as ContentRecord;
  const theme = {
    sample: demo,
    optionalBlocks: ['our_story', 'countdown', 'dress_code', 'registry', 'travel_stay'] as const,
    photos: [
      { key: 'hero_portrait', label: 'Portrait', source: 'media.hero_portrait', aspect: '567/595', ratio: 567 / 595 },
      { key: 'story_1', label: 'Our Story photo 1', source: 'media.memory_photos.0', aspect: null, ratio: null },
    ],
  };
  const claimed = draftFromDemo(demo, ['Mia', 'Theo']);
  const notes = prePublishNotes(claimed, { ...theme, optionalBlocks: [...theme.optionalBlocks] });
  const paths = notes.sample.map((n) => n.path);
  for (const p of ['date', 'ceremony_time', 'venue.name', 'venue.city', 'host_line', 'dress_code', 'story.intro', 'rsvp.deadline', 'schedule.0.location', 'story.items.0.caption']) {
    assert.ok(paths.includes(p), `${p} flagged as sample`);
  }
  assert.ok(!paths.some((p) => p.startsWith('partners') || p === 'name_display'), 'the buyer\'s names are not sample text');
  assert.deepEqual(notes.photos.map((n) => n.path), ['media.hero_portrait', 'media.memory_photos.0']);
  assert.deepEqual(notes.links.map((n) => n.path), ['urls.registry', 'urls.accommodation']);
  // Changed values and switched-off blocks drop out.
  const edited = structuredClone(claimed);
  edited.venue.name = 'Maple Hall';
  edited.date = '2027-08-21';
  edited.optional_blocks.our_story = false;
  edited.optional_blocks.registry = false;
  edited.urls.accommodation = 'https://hotel.example.org/block';
  const after = prePublishNotes(edited, { ...theme, optionalBlocks: [...theme.optionalBlocks] });
  const afterPaths = after.sample.map((n) => n.path);
  for (const p of ['venue.name', 'date', 'story.intro', 'story.items.0.caption']) assert.ok(!afterPaths.includes(p), p);
  assert.deepEqual(after.photos.map((n) => n.path), ['media.hero_portrait'], 'story photos do not matter while the story is off');
  assert.deepEqual(after.links, []);
  // No demo record (internal theme): no sample notes.
  assert.deepEqual(prePublishNotes(claimed, { ...theme, sample: null, optionalBlocks: [] }).sample, []);
});

test('panel theme info: page switches, fields the design shows, sample record; helpers', async () => {
  const themesBefore = process.env.PLATFORM_THEMES_DIR;
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  try {
    const t = await panelTheme('blush-garden-rose');
    assert.deepEqual(t.pageRules, { story: { optional: 'our_story', if: null }, rsvp: { optional: null, if: '!rsvp.method' } });
    assert.deepEqual(t.fields, { initials: false, storyText: false, storyItems: 3 }, 'no monogram, no story text, 3 moments');
    assert.equal(t.sample?.venue.name, 'The Rosewater Conservatory');
    const sample = await panelTheme('_sample');
    assert.deepEqual(sample.fields, { initials: true, storyText: true, storyItems: 12 });
    assert.equal(sample.sample, null, 'internal theme: no demo record to compare with');
  } finally {
    process.env.PLATFORM_THEMES_DIR = themesBefore;
  }
  assert.deepEqual(themeFieldUse(['<p data-field="story.items.4.caption"></p><p data-text="{initials} · {date}"></p>']), {
    initials: true,
    storyText: false,
    storyItems: 5,
  });
  const c = demoContent();
  assert.equal(pageShown({ optional: 'our_story', if: null }, c), true);
  c.optional_blocks.our_story = false;
  assert.equal(pageShown({ optional: 'our_story', if: null }, c), false);
  assert.equal(pageShown({ optional: null, if: '!rsvp.method' }, c), true);
  c.rsvp.method = 'none';
  assert.equal(pageShown({ optional: null, if: '!rsvp.method' }, c), false);
  assert.equal(pageShown(undefined, c), true);
  assert.deepEqual([626 / 868, 567 / 595, 1, 1172 / 681, null].map((r) => shapeLabel(r)), [
    'Tall (portrait)',
    'Almost square',
    'Almost square',
    'Wide (landscape)',
    'Any shape',
  ]);
  assert.equal(previewPhotoUrl('/media/a/b.jpg', 'k1'), '/media/a/b.jpg?preview=k1');
  assert.equal(previewPhotoUrl('https://cdn.example.org/x.jpg', 'k1'), 'https://cdn.example.org/x.jpg');
});

test('small helpers: aspect parsing, issue sections, key-order-free comparison, origin, centre crop', () => {
  assert.equal(parseAspect('4/5'), 0.8);
  assert.equal(parseAspect('16:9'), 16 / 9);
  assert.equal(parseAspect('1.5'), 1.5);
  assert.equal(parseAspect('wide'), null);
  assert.equal(parseAspect(undefined), null);
  assert.equal(sectionForPath('partners.1.display_name'), 'couple');
  assert.equal(sectionForPath('schedule.2.time'), 'schedule');
  assert.equal(sectionForPath('urls'), 'details');
  assert.equal(sectionForPath('media.memory_photos'), 'photos');
  assert.equal(sectionForPath('(root)'), null);
  assert.equal(sameContent({ a: 1, b: { c: [1, { d: 2, e: 3 }] } }, { b: { c: [1, { e: 3, d: 2 }] }, a: 1 }), true);
  assert.equal(sameContent({ a: [1, 2] }, { a: [2, 1] }), false);
  assert.equal(publicOrigin(new Headers({ host: 'sites.example.test', 'x-forwarded-proto': 'https' })), 'https://sites.example.test');
  assert.equal(publicOrigin(new Headers({ host: 'bad host<>' }), 'http://fallback.test'), 'http://fallback.test');
  process.env.PLATFORM_PUBLIC_URL = 'https://configured.example.test/ignored-path';
  assert.equal(publicOrigin(new Headers({ host: 'other.test' })), 'https://configured.example.test');
  delete process.env.PLATFORM_PUBLIC_URL;
  assert.deepEqual(centreCrop(1200, 900, 0.8), { left: 240, top: 0, width: 720, height: 900 });
  assert.deepEqual(centreCrop(900, 1600, 0.75), { left: 0, top: 200, width: 900, height: 1200 });
});

test('prepareDraft: locked fields win, structural problems throw DraftShapeError', () => {
  const stored = demoContent();
  const incoming = { ...demoContent(), record_kind: 'customer' };
  assert.equal(prepareDraft(stored, incoming).record_kind, 'demo');
  assert.throws(() => prepareDraft(stored, null), DraftShapeError);
  assert.throws(() => prepareDraft(stored, { ...demoContent(), schedule: [{ label: 'x' }] }), DraftShapeError); // time missing
  const unfinished = { ...demoContent(), date: '' };
  assert.equal(prepareDraft(stored, unfinished).date, '');
});
