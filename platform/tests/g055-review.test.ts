// G055 review fixes (2026-10-13): the calendar file uses the public origin like the pages, x-forwarded-host is read
// from its last entry, /start's browser code carries only the limit numbers (not the schema + validator), tiny photos
// (< 10 px wide) read back, over-long texts say which field, the share image has a text description.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { CONTENT_LIMITS } from '../lib/content/limits.ts';
import { SCHEMA_LIMITS, validateContent } from '../lib/content/validate.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { fieldLabel, panelIssues } from '../lib/panel/model.ts';
import { publicOrigin } from '../lib/panel/http.ts';
import { preparePhoto } from '../lib/panel/photos.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { demoContent, PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';

before(() => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('g055-review-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

/** Unfolded .ics content line value (RFC 5545 §3.1). */
function icsProp(ics: string, name: string): string | undefined {
  const line = ics.replace(/\r\n[ \t]/g, '').split('\r\n').find((l) => l.startsWith(`${name}:`) || l.startsWith(`${name};`));
  return line?.slice(line.indexOf(':') + 1);
}

test('event.ics: site link and UID use PLATFORM_PUBLIC_URL like og:image and the Google link (site + theme demo)', async () => {
  const { GET } = await import('../app/[slug]/event.ics/route.ts');
  const { GET: demoGet } = await import('../app/start/demo/[theme]/event.ics/route.ts');
  const { GET: page } = await import('../app/[slug]/[page]/route.ts');
  const created = await createSiteWithKeys(getDataAdapter(), { slug: 'ics-pair', theme: 'blush-garden-rose', content: demoContent() });
  await publishSite(getDataAdapter(), created.site.id);
  const req = (p: string) => new Request(`https://project-abc123.vercel.app${p}`, { headers: { host: 'project-abc123.vercel.app' } });

  process.env.PLATFORM_PUBLIC_URL = 'https://sites.public.example';
  try {
    const ics = await (await GET(req('/ics-pair/event.ics'), { params: Promise.resolve({ slug: 'ics-pair' }) })).text();
    assert.equal(icsProp(ics, 'URL'), 'https://sites.public.example/ics-pair');
    assert.equal(icsProp(ics, 'UID'), 'ics-pair@sites.public.example');
    assert.ok(ics.replace(/\r\n[ \t]/g, '').includes('https://sites.public.example/ics-pair'), 'description link');
    assert.ok(!ics.includes('vercel.app'));
    const home = await (await page(req('/ics-pair/home'), { params: Promise.resolve({ slug: 'ics-pair', page: 'home' }) })).text();
    const google = cheerio.load(home)('a[data-calendar="google"]').attr('href')!;
    assert.ok(new URL(google).searchParams.get('details')!.includes('https://sites.public.example/ics-pair'), 'same site link in both buttons');
    const demo = await (await demoGet(req('/start/demo/blush-garden-rose/event.ics'), { params: Promise.resolve({ theme: 'blush-garden-rose' }) })).text();
    assert.equal(icsProp(demo, 'URL'), 'https://sites.public.example/start/demo/blush-garden-rose');
    assert.equal(icsProp(demo, 'UID'), 'demo-blush-garden-rose@sites.public.example');
  } finally {
    delete process.env.PLATFORM_PUBLIC_URL;
  }
  // without it: the request host, as before
  const ics = await (await GET(req('/ics-pair/event.ics'), { params: Promise.resolve({ slug: 'ics-pair' }) })).text();
  assert.equal(icsProp(ics, 'UID'), 'ics-pair@project-abc123.vercel.app');
});

test('publicOrigin: the last x-forwarded-host / -proto entry (a client can only prepend), host as before', () => {
  delete process.env.PLATFORM_PUBLIC_URL;
  assert.equal(publicOrigin(new Headers({ 'x-forwarded-host': 'evil.example, a.example', 'x-forwarded-proto': 'http, https' })), 'https://a.example');
  assert.equal(publicOrigin(new Headers({ 'x-forwarded-host': 'a.example', 'x-forwarded-proto': 'https' })), 'https://a.example');
  assert.equal(publicOrigin(new Headers({ host: 'sites.example.test' })), 'http://sites.example.test');
  assert.equal(publicOrigin(new Headers({ 'x-forwarded-host': 'bad host!' }), 'https://fallback.test'), 'https://fallback.test');
  process.env.PLATFORM_PUBLIC_URL = 'https://configured.example/some/path?q=1';
  try {
    assert.equal(publicOrigin(new Headers({ 'x-forwarded-host': 'evil.example' })), 'https://configured.example');
  } finally {
    delete process.env.PLATFORM_PUBLIC_URL;
  }
});

test('limits: the browser module equals the schema; /start fields do not pull the validator or schema in', () => {
  assert.deepEqual({ ...CONTENT_LIMITS }, { ...SCHEMA_LIMITS });
  // Static import graph of lib/claim/fields.ts (imported by the client component app/start/StartForm.tsx).
  const seen = new Set<string>();
  const walk = (file: string) => {
    if (seen.has(file)) return;
    seen.add(file);
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/^import\s+(?!type\b)[^'"]*from\s+'(\.[^']+)'/gm)) walk(path.resolve(path.dirname(file), m[1]));
  };
  walk(path.join(PLATFORM_ROOT, 'lib/claim/fields.ts'));
  const rel = [...seen].map((f) => path.relative(PLATFORM_ROOT, f)).sort();
  assert.ok(!rel.includes('lib/content/validate.ts') && !rel.includes('lib/content/schema.ts'), rel.join(', '));
  assert.ok(rel.includes('lib/content/limits.ts'), rel.join(', '));
  const form = readFileSync(path.join(PLATFORM_ROOT, 'app/start/StartForm.tsx'), 'utf8');
  assert.match(form, /maxLength=\{NAME_MAX\b/, '/start name inputs stop at the same 40 as the panel');
  assert.doesNotMatch(form, /maxLength=\{60\}\s*\n\s*value=\{value\}/);
});

test('photos narrower than 10 px: stored as <hex>-<W>w and read back (local adapter)', async () => {
  const raw = Buffer.alloc(8 * 10 * 3, 200);
  const tiny = await preparePhoto(new Uint8Array(await sharp(raw, { raw: { width: 8, height: 10, channels: 3 } }).jpeg().toBuffer()), null);
  assert.equal(tiny.width, 8);
  const a = new LocalAdapter(tmpDir('g055-review-tiny-'));
  const { site } = await createSiteWithKeys(a, { slug: 'tiny-photo', theme: '_sample', content: demoContent() });
  const saved = await a.savePhoto(site.id, { bytes: tiny.bytes, width: tiny.width, variants: tiny.variants });
  assert.match(saved.path, /-8w\.jpg$/);
  const back = await a.readPhoto(saved.path);
  assert.ok(back, 'readPhoto must find it');
  assert.deepEqual(Buffer.from(back.bytes), Buffer.from(tiny.bytes));
  assert.equal(await a.readPhoto(saved.path.replace('-8w.', '-08w.')), null, 'a leading zero is still no width');
});

test('over-long texts name their field and give the length (two names no longer read the same)', () => {
  const c = demoContent();
  c.partners[0].display_name = 'A'.repeat(41);
  c.partners[0].full_name = 'B'.repeat(41);
  c.partners[1].display_name = 'Ö'.repeat(42);
  c.venue.name = 'V'.repeat(87);
  const r = validateContent(c, { platform: true });
  const issues = panelIssues(r.errors.filter((i) => i.code === 'schema_max_length'), c);
  const byPath = Object.fromEntries(issues.map((i) => [i.path, i.message]));
  assert.deepEqual(byPath, {
    'partners.0.display_name': 'First name (first partner) is 41 characters. Please shorten it to 40.',
    'partners.0.full_name': 'Full name (first partner) is 41 characters. Please shorten it to 40.',
    'partners.1.display_name': 'First name (second partner) is 42 characters. Please shorten it to 40.',
    'venue.name': 'Venue name is 87 characters. Please shorten it to 80.',
  });
  assert.equal(new Set(issues.map((i) => i.message)).size, issues.length);
  assert.equal(fieldLabel('faq.2.a'), 'Questions & answers, question 3: answer');
  assert.equal(fieldLabel('rsvp.questions.0.options.1'), 'RSVP, question 1: choice 2');
  assert.equal(fieldLabel('name_display'), 'Names as shown on the site');
});

test('share image: og:image:alt and twitter:image:alt describe it from the content (the image has no text)', () => {
  const tpl = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>t</title><meta property="og:title" content="x"></head><body></body></html>';
  const theme = { id: 'shared', pages: { index: 'index.html' }, photos: {} };
  const share = { ogImage: 'img/og-1200x630.jpg', icon: null };
  const $ = cheerio.load(renderTemplate({ html: tpl, content: demoContent(), theme, page: 'index', slug: 'a-b', origin: 'https://x.test', share }).html);
  assert.equal($('meta[property="og:image:alt"]').attr('content'), 'Clara & Julian wedding invitation');
  assert.equal($('meta[name="twitter:image:alt"]').attr('content'), 'Clara & Julian wedding invitation');
  const none = cheerio.load(renderTemplate({ html: tpl, content: demoContent(), theme, page: 'index', slug: 'a-b', share }).html);
  assert.equal(none('meta[property="og:image:alt"]').length, 0, 'no og:image (no origin) -> no alt');
});

test('story intro (docs/11 §3.2, §13.2 #23): 03 writes the intro, then the formatted date, as one sentence', async () => {
  const { GET: page } = await import('../app/[slug]/[page]/route.ts');
  const c = demoContent();
  const created = await createSiteWithKeys(getDataAdapter(), { slug: 'story-intro', theme: 'blush-garden-rose', content: c });
  await publishSite(getDataAdapter(), created.site.id);
  const html = await (await page(new Request('https://sites.example.test/story-intro/story'), { params: Promise.resolve({ slug: 'story-intro', page: 'story' }) })).text();
  const $ = cheerio.load(html);
  const lede = $('[data-field="story.intro"]').parent().text().replace(/\s+/g, ' ').trim();
  assert.equal(lede, `${c.story!.intro} May 15, 2027.`);
  // every demo record's intro is a fragment that reads on with the date (no full stop of its own)
  for (const file of readdirSync(path.join(REPO_ROOT, 'collections')).filter((d) => /^\d\d_/.test(d))) {
    const rec = JSON.parse(readFileSync(path.join(REPO_ROOT, 'collections', file, 'content.demo.json'), 'utf8'));
    const intro: string = rec.story?.intro ?? '';
    assert.ok(intro && !/[.!?]$/.test(intro.trim()), `${file}: "${intro}"`);
  }
});

test('schema limits doc check: the schema file still has the numbers the browser module carries', () => {
  const schema = JSON.parse(readFileSync(path.join(REPO_ROOT, 'docs/03_URUN_ICERIK_SEMASI.json'), 'utf8'));
  assert.equal(schema.properties.partners.items.properties.display_name.maxLength, CONTENT_LIMITS.name);
  assert.equal(schema.properties.schedule.maxItems, CONTENT_LIMITS.scheduleItems);
});
