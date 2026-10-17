// G055: share image + tab icon tags (engine, routes, real theme 03) and the Vercel tracing check (scripts/trace-check.cjs).
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { GET as getIndex } from '../app/[slug]/route.ts';
import { GET as getPage } from '../app/[slug]/[page]/route.ts';
import { GET as getThemeAsset } from '../app/themes/[theme]/[...path]/route.ts';
import { GET as getDemo } from '../app/start/demo/[theme]/route.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { THEME_ASSET_TYPES } from '../lib/site/static.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { findShareFiles, ICON_FILE, NO_SHARE_FILES, OG_IMAGE_FILE } from '../lib/theme/share.ts';
import { clearThemeCache, loadTheme, type ThemeManifest } from '../lib/theme/theme.ts';
import nextConfig, { PDF_ROUTE, THEME_ASSET_EXTENSIONS, THEME_ASSET_ROUTE, THEME_ROUTES } from '../next.config.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const require = createRequire(import.meta.url);
const traceCheck = require('../scripts/trace-check.cjs') as {
  ROUTES: string[];
  ASSET_ROUTE: string;
  ASSET_EXTENSIONS: string[];
  checkTraces: (o: { root: string; appDir: string; themesDir?: string }) => { problems: string[]; assetFiles: number };
};

const BASE = 'http://sites.local.test';
let themes: string;

async function jpeg(width: number, height: number): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: '#f2d8d7' } }).jpeg().toBuffer();
}
async function png(size: number): Promise<Buffer> {
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 200, g: 120, b: 130, alpha: 0.6 } } }).png().toBuffer();
}

before(async () => {
  themes = tmpDir('g055-themes-');
  // "shared": _sample + both share files; "manifest-only": the files are named by img/manifest.json but not on disk
  // (what a page route's Vercel bundle sees); "plain": none.
  for (const id of ['shared', 'manifest-only', 'plain']) {
    cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, id), { recursive: true });
    const manifest = JSON.parse(JSON.stringify(require('../themes/_sample/theme.json')));
    manifest.id = id;
    manifest.internal = false;
    writeFileSync(path.join(themes, id, 'theme.json'), JSON.stringify(manifest));
    // The _sample template writes its own og:image; these fixtures leave it to the engine.
    for (const page of ['index.html', 'home.html', 'story.html', 'details.html', 'rsvp.html']) {
      const file = path.join(themes, id, page);
      const html = (await import('node:fs')).readFileSync(file, 'utf8').replace(/<meta property="og:image"[^>]*>/, '');
      writeFileSync(file, html);
    }
    mkdirSync(path.join(themes, id, 'img'));
  }
  writeFileSync(path.join(themes, 'shared', OG_IMAGE_FILE), await jpeg(1200, 630));
  writeFileSync(path.join(themes, 'shared', ICON_FILE), await png(180));
  writeFileSync(path.join(themes, 'manifest-only/img/manifest.json'), JSON.stringify({ og: { file: 'og-1200x630.jpg' }, favicon: { file: 'favicon.png' } }));
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g055-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  const adapter = getDataAdapter();
  for (const [slug, theme] of [['with-share', 'shared'], ['no-share', 'plain']]) {
    const s = await createSiteWithKeys(adapter, { slug, theme, content: demoContent() });
    await publishSite(adapter, s.site.id);
  }
});

// ---------------------------------------------------------------------------------------------
// Which files a theme has

test('share files: on disk, or named by img/manifest.json (the page bundles on Vercel carry *.json only)', async () => {
  assert.deepEqual(await findShareFiles(path.join(themes, 'shared')), { ogImage: OG_IMAGE_FILE, icon: ICON_FILE });
  assert.deepEqual(await findShareFiles(path.join(themes, 'manifest-only')), { ogImage: OG_IMAGE_FILE, icon: ICON_FILE });
  assert.deepEqual(await findShareFiles(path.join(themes, 'plain')), NO_SHARE_FILES);
  // A manifest naming another file (or garbage) does not count.
  const odd = tmpDir('g055-odd-');
  mkdirSync(path.join(odd, 'img'));
  writeFileSync(path.join(odd, 'img/manifest.json'), JSON.stringify({ og: { file: 'other.jpg' }, favicon: 'favicon.png' }));
  assert.deepEqual(await findShareFiles(odd), NO_SHARE_FILES);
  writeFileSync(path.join(odd, 'img/manifest.json'), '{not json');
  assert.deepEqual(await findShareFiles(odd), NO_SHARE_FILES);
  rmSync(odd, { recursive: true, force: true });
  clearThemeCache();
  assert.deepEqual((await loadTheme('shared'))!.share, { ogImage: OG_IMAGE_FILE, icon: ICON_FILE });
  assert.deepEqual((await loadTheme('plain'))!.share, NO_SHARE_FILES);
});

test('theme 03 (G054 files): 1200x630 JPEG share image, square PNG icon; both named in its manifest', async () => {
  const dir = path.join(PLATFORM_ROOT, 'themes/blush-garden-rose');
  assert.deepEqual(await findShareFiles(dir), { ogImage: OG_IMAGE_FILE, icon: ICON_FILE });
  const og = await sharp(path.join(dir, OG_IMAGE_FILE)).metadata();
  assert.equal(og.format, 'jpeg');
  assert.deepEqual([og.width, og.height], [1200, 630]);
  const icon = await sharp(path.join(dir, ICON_FILE)).metadata();
  assert.equal(icon.format, 'png');
  assert.equal(icon.width, icon.height);
  const manifest = require('../themes/blush-garden-rose/img/manifest.json');
  assert.equal(manifest.og.file, 'og-1200x630.jpg');
  assert.equal(manifest.favicon.file, 'favicon.png');
});

// ---------------------------------------------------------------------------------------------
// Engine

const THEME: Pick<ThemeManifest, 'id' | 'pages' | 'photos'> = { id: 'shared', pages: { index: 'index.html' }, photos: {} };
const html = (head = '') =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"><title>t</title><meta property="og:title" content="x">${head}<link rel="stylesheet" href="s.css"></head><body></body></html>`;
const SHARE = { ogImage: OG_IMAGE_FILE, icon: ICON_FILE };

test('engine: og:image (absolute) + size + twitter:card and the icon link, after the last <meta>; nothing without share files', () => {
  const r = renderTemplate({ html: html(), content: demoContent(), theme: THEME, page: 'index', slug: 'a-b', origin: 'https://sites.example.test', share: SHARE });
  assert.deepEqual(r.warnings, []);
  const $ = cheerio.load(r.html);
  assert.equal($('meta[property="og:image"]').attr('content'), 'https://sites.example.test/themes/shared/img/og-1200x630.jpg');
  assert.equal($('meta[property="og:image:type"]').attr('content'), 'image/jpeg');
  assert.equal($('meta[property="og:image:width"]').attr('content'), '1200');
  assert.equal($('meta[property="og:image:height"]').attr('content'), '630');
  assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image');
  assert.equal($('link[rel="icon"]').attr('href'), '/themes/shared/img/favicon.png');
  assert.equal($('link[rel="icon"]').attr('type'), 'image/png');
  assert.equal($('link[rel="apple-touch-icon"]').length, 0, 'transparent icon: no home-screen icon (iOS shows black)');
  // Placed with the other meta tags (before the stylesheet), each once.
  const order = $('head > *').toArray().map((el) => (el as { attribs: Record<string, string> }).attribs.property ?? (el as { attribs: Record<string, string> }).attribs.rel ?? (el as { name: string }).name);
  assert.ok(order.indexOf('og:image') > order.indexOf('og:title') && order.indexOf('icon') < order.indexOf('stylesheet'), order.join(' '));
  for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:card"]', 'link[rel="icon"]']) assert.equal($(sel).length, 1, sel);

  const none = cheerio.load(renderTemplate({ html: html(), content: demoContent(), theme: THEME, page: 'index', slug: 'a-b', origin: 'https://x.test' }).html);
  assert.equal(none('meta[property="og:image"], meta[name="twitter:card"], link[rel~="icon"]').length, 0);
  const off = cheerio.load(renderTemplate({ html: html(), content: demoContent(), theme: THEME, page: 'index', slug: 'a-b', origin: 'https://x.test', share: NO_SHARE_FILES }).html);
  assert.equal(off('meta[property="og:image"], link[rel~="icon"]').length, 0);
});

test('engine: no origin -> no og:image (it must be absolute), icon still; a tag the template has is not duplicated', () => {
  const noOrigin = cheerio.load(renderTemplate({ html: html(), content: demoContent(), theme: THEME, page: 'index', slug: 'a-b', share: SHARE }).html);
  assert.equal(noOrigin('meta[property="og:image"]').length, 0);
  assert.equal(noOrigin('link[rel="icon"]').length, 1);
  const own = cheerio.load(
    renderTemplate({
      html: html('<meta property="og:image" content="img/own.jpg"><meta name="twitter:card" content="summary"><link rel="shortcut icon" href="img/own.ico">'),
      content: demoContent(),
      theme: THEME,
      page: 'index',
      slug: 'a-b',
      origin: 'https://x.test',
      share: SHARE,
    }).html,
  );
  assert.deepEqual(own('meta[property="og:image"]').toArray().map((e) => own(e).attr('content')), ['https://x.test/themes/shared/img/own.jpg']);
  assert.equal(own('meta[property="og:image:width"]').length, 0, 'size tags belong to our file only');
  assert.deepEqual(own('meta[name="twitter:card"]').toArray().map((e) => own(e).attr('content')), ['summary']);
  assert.deepEqual(own('link[rel~="icon"]').toArray().map((e) => own(e).attr('href')), ['/themes/shared/img/own.ico']);
});

// ---------------------------------------------------------------------------------------------
// Routes

const req = (p: string, headers: Record<string, string> = {}) => new Request(`${BASE}${p}`, { headers });

test('site pages: og:image uses the request origin, or PLATFORM_PUBLIC_URL when set; the files are served', async () => {
  const pages = [await getIndex(req('/with-share'), { params: Promise.resolve({ slug: 'with-share' }) })];
  for (const p of ['home', 'details']) pages.push(await getPage(req(`/with-share/${p}`), { params: Promise.resolve({ slug: 'with-share', page: p }) }));
  for (const res of pages) {
    assert.equal(res.status, 200);
    const $ = cheerio.load(await res.text());
    assert.equal($('meta[property="og:image"]').attr('content'), `${BASE}/themes/shared/img/og-1200x630.jpg`);
    assert.equal($('link[rel="icon"]').attr('href'), '/themes/shared/img/favicon.png');
  }
  // Behind a proxy the forwarded host is the public one.
  const fwd = await getIndex(req('/with-share', { 'x-forwarded-host': 'wedding.example.test', 'x-forwarded-proto': 'https' }), { params: Promise.resolve({ slug: 'with-share' }) });
  assert.equal(cheerio.load(await fwd.text())('meta[property="og:image"]').attr('content'), 'https://wedding.example.test/themes/shared/img/og-1200x630.jpg');
  process.env.PLATFORM_PUBLIC_URL = 'https://public.example.test/';
  try {
    const pub = await getIndex(req('/with-share', { 'x-forwarded-host': 'other.test' }), { params: Promise.resolve({ slug: 'with-share' }) });
    assert.equal(cheerio.load(await pub.text())('meta[property="og:image"]').attr('content'), 'https://public.example.test/themes/shared/img/og-1200x630.jpg');
  } finally {
    delete process.env.PLATFORM_PUBLIC_URL;
  }
  const none = cheerio.load(await (await getIndex(req('/no-share'), { params: Promise.resolve({ slug: 'no-share' }) })).text());
  assert.equal(none('meta[property="og:image"], link[rel~="icon"]').length, 0);

  const og = await getThemeAsset(req('/themes/shared/img/og-1200x630.jpg'), { params: Promise.resolve({ theme: 'shared', path: ['img', 'og-1200x630.jpg'] }) });
  assert.equal(og.status, 200);
  assert.equal(og.headers.get('content-type'), 'image/jpeg');
  assert.deepEqual(((await sharp(Buffer.from(await og.arrayBuffer())).metadata()) as { width: number; height: number }).width, 1200);
  const icon = await getThemeAsset(req('/themes/shared/img/favicon.png'), { params: Promise.resolve({ theme: 'shared', path: ['img', 'favicon.png'] }) });
  assert.equal(icon.status, 200);
  assert.equal(icon.headers.get('content-type'), 'image/png');
  const manifest = await getThemeAsset(req('/themes/manifest-only/img/manifest.json'), { params: Promise.resolve({ theme: 'manifest-only', path: ['img', 'manifest.json'] }) });
  assert.equal(manifest.status, 404, 'the manifest itself is never served');
});

test('theme 03 demo (/start/demo): og:image + icon point at its G054 files', async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  clearThemeCache();
  try {
    const res = await getDemo(req('/start/demo/blush-garden-rose'), { params: Promise.resolve({ theme: 'blush-garden-rose' }) });
    assert.equal(res.status, 200);
    const $ = cheerio.load(await res.text());
    assert.equal($('meta[property="og:image"]').attr('content'), `${BASE}/themes/blush-garden-rose/img/og-1200x630.jpg`);
    assert.equal($('meta[property="og:title"]').length, 1, 'the template keeps writing the title (personal, from content)');
    assert.equal($('link[rel="icon"]').attr('href'), '/themes/blush-garden-rose/img/favicon.png');
  } finally {
    process.env.PLATFORM_THEMES_DIR = themes;
    clearThemeCache();
  }
});

// ---------------------------------------------------------------------------------------------
// Vercel tracing (next.config.ts + scripts/trace-check.cjs)

test('tracing config: theme routes get *.html/*.json, the asset route the servable types; lists agree everywhere', () => {
  const includes = nextConfig.outputFileTracingIncludes as Record<string, string[]>;
  // G139: the PDF route also carries the packed Chromium of @sparticuz/chromium
  for (const r of THEME_ROUTES) {
    const extra = r === PDF_ROUTE ? ['./node_modules/@sparticuz/chromium/bin/**'] : [];
    assert.deepEqual(includes[r], ['./themes/**/*.html', './themes/**/*.json', ...extra], r);
  }
  assert.deepEqual(includes[THEME_ASSET_ROUTE], [`./themes/**/*.{${THEME_ASSET_EXTENSIONS.join(',')}}`]);
  assert.deepEqual(Object.keys(includes).sort(), [...THEME_ROUTES, THEME_ASSET_ROUTE].sort());
  assert.deepEqual([...THEME_ASSET_EXTENSIONS].sort(), Object.keys(THEME_ASSET_TYPES).sort(), 'next.config.ts = lib/site/static.ts');
  assert.deepEqual([...traceCheck.ASSET_EXTENSIONS].sort(), Object.keys(THEME_ASSET_TYPES).sort(), 'trace-check = lib/site/static.ts');
  // next.config route globs ('/\\[slug\\]/\\[page\\]') vs trace-check route files ('[slug]/[page]/route')
  const fromGlob = (g: string) => g.replace(/\\/g, '').slice(1);
  const fromFile = (f: string) => f.replace(/\/(route|page)$/, '').replace(/^page$/, '');
  assert.deepEqual(THEME_ROUTES.map(fromGlob).sort(), traceCheck.ROUTES.map(fromFile).sort());
  assert.equal(fromGlob(THEME_ASSET_ROUTE), fromFile(traceCheck.ASSET_ROUTE));
});

/** A fake build: .next/server/app/<route>.js.nft.json listing the given theme files (relative to the themes folder). */
function fakeBuild(themesDir: string, routeFiles: (route: string) => string[]): string {
  const app = tmpDir('g055-app-');
  for (const route of [...traceCheck.ROUTES, traceCheck.ASSET_ROUTE]) {
    const nft = path.join(app, `${route}.js.nft.json`);
    mkdirSync(path.dirname(nft), { recursive: true });
    writeFileSync(nft, JSON.stringify({ version: 1, files: routeFiles(route).map((f) => path.relative(path.dirname(nft), path.join(themesDir, f))) }));
  }
  return app;
}

test('trace-check: passes a correct build; finds images in page bundles, missing assets, unseen share files, stale manifests', () => {
  const dir = tmpDir('g055-tc-');
  const tdir = path.join(dir, 'themes');
  cpSync(path.join(themes, 'shared'), path.join(tdir, 'shared'), { recursive: true });
  writeFileSync(path.join(tdir, 'shared/img/manifest.json'), JSON.stringify({ og: { file: 'og-1200x630.jpg' }, favicon: { file: 'favicon.png' } }));
  cpSync(path.join(themes, 'plain'), path.join(tdir, 'plain'), { recursive: true });
  const html = ['index.html', 'home.html', 'story.html', 'details.html', 'rsvp.html', 'theme.json'];
  const templates = ['shared', 'plain'].flatMap((t) => html.map((f) => `${t}/${f}`)).concat('shared/img/manifest.json');
  const assets = ['shared/style.css', 'shared/site.js', 'shared/assets/placeholder.svg', 'shared/img/og-1200x630.jpg', 'shared/img/favicon.png', 'plain/style.css', 'plain/site.js', 'plain/assets/placeholder.svg'];
  const run = (fn: (route: string) => string[]) => traceCheck.checkTraces({ root: dir, appDir: fakeBuild(tdir, fn), themesDir: tdir });

  const good = run((r) => (r === traceCheck.ASSET_ROUTE ? assets : templates));
  assert.deepEqual(good.problems, []);
  assert.equal(good.assetFiles, assets.length);

  // The old config (everything everywhere) fails: images in every page bundle.
  const old = run(() => [...templates, ...assets]);
  assert.equal(old.problems.filter((p) => p.includes('other than *.html/*.json')).length, traceCheck.ROUTES.length);
  // Asset route missing the share image.
  assert.ok(run((r) => (r === traceCheck.ASSET_ROUTE ? assets.filter((a) => !a.endsWith('.jpg')) : templates)).problems.some((p) => p.includes('og-1200x630.jpg is not traced')));
  // Page bundles without the manifest cannot see the share files (no og:image on Vercel).
  const blind = run((r) => (r === traceCheck.ASSET_ROUTE ? assets : templates.filter((f) => !f.endsWith('manifest.json'))));
  assert.equal(blind.problems.filter((p) => p.includes('cannot see it')).length, traceCheck.ROUTES.length * 2);
  // Templates missing.
  assert.ok(run((r) => (r === traceCheck.ASSET_ROUTE ? assets : templates.filter((f) => f !== 'plain/index.html'))).problems.some((p) => p.includes('plain/index.html is not traced')));
  // A manifest naming a file that is not there.
  rmSync(path.join(tdir, 'shared/img/favicon.png'));
  const stale = run((r) => (r === traceCheck.ASSET_ROUTE ? assets.filter((a) => !a.endsWith('favicon.png')) : templates));
  assert.ok(stale.problems.some((p) => p.includes('names favicon.png') && p.includes('does not exist')), stale.problems.join('\n'));
  rmSync(dir, { recursive: true, force: true });
});
