import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { GET as getIndex } from '../app/[slug]/route.ts';
import { GET as getPage } from '../app/[slug]/[page]/route.ts';
import { GET as getThemeAsset } from '../app/themes/[theme]/[...path]/route.ts';
import { GET as getMedia } from '../app/media/[...path]/route.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
let published: { editKey: string; previewKey: string; id: string };
let draft: { editKey: string; previewKey: string; id: string };

before(async () => {
  const themes = tmpDir('platform-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  mkdirSync(path.join(themes, 'mini'));
  writeFileSync(path.join(themes, 'mini/theme.json'), JSON.stringify({ id: 'mini', name: 'Mini', pages: { index: 'index.html', home: 'home.html' }, photos: {} }));
  writeFileSync(path.join(themes, 'mini/index.html'), '<!DOCTYPE html><html><head><title>m</title></head><body><h1 data-field="name_display"></h1></body></html>');
  writeFileSync(path.join(themes, 'mini/home.html'), '<!DOCTYPE html><html><head><title>m</title></head><body>home</body></html>');
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-data-');

  const adapter = getDataAdapter();
  const pub = await createSiteWithKeys(adapter, { slug: 'clara-and-julian', theme: '_sample', content: demoContent() });
  await publishSite(adapter, pub.site.id);
  const edited = demoContent();
  edited.name_display = 'Clara & Julian DRAFT';
  edited.partners[1].display_name = 'Julian DRAFT';
  await adapter.updateContent(pub.site.id, edited); // unpublished edit
  published = { editKey: pub.editKey, previewKey: pub.previewKey, id: pub.site.id };

  const d = await createSiteWithKeys(adapter, { slug: 'draft-only', theme: '_sample', content: demoContent() });
  draft = { editKey: d.editKey, previewKey: d.previewKey, id: d.site.id };

  const mini = await createSiteWithKeys(adapter, { slug: 'mini-site', theme: 'mini', content: demoContent() });
  await publishSite(adapter, mini.site.id);

  const broken = await createSiteWithKeys(adapter, { slug: 'broken-theme', theme: 'mini', content: demoContent() });
  await publishSite(adapter, broken.site.id);
  const raw = await adapter.getSiteById(broken.site.id);
  // Simulate a theme that was removed after the site was created.
  writeFileSync(path.join(process.env.PLATFORM_DATA_DIR!, 'sites', `${raw!.id}.json`), JSON.stringify({ ...raw, theme: 'gone' }));
});

function req(pathname: string) {
  return new Request(`${BASE}${pathname}`);
}
async function site(slug: string, query = '') {
  return getIndex(req(`/${slug}${query}`), { params: Promise.resolve({ slug }) });
}
async function sitePage(slug: string, page: string, query = '') {
  return getPage(req(`/${slug}/${page}${query}`), { params: Promise.resolve({ slug, page }) });
}

test('published site: index and declared pages are 200 HTML with security headers', async () => {
  for (const res of [await site('clara-and-julian'), ...(await Promise.all(['home', 'story', 'details', 'rsvp'].map((p) => sitePage('clara-and-julian', p))))]) {
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'text/html; charset=utf-8');
    assert.match(res.headers.get('content-security-policy')!, /script-src 'self'/);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-robots-tag'), null);
  }
  const $ = cheerio.load(await (await site('clara-and-julian')).text());
  assert.equal($('h1').text(), 'Clara & Julian'); // published snapshot, not the draft edit
  assert.equal($('a.button').attr('href'), '/clara-and-julian/home');
  const home = cheerio.load(await (await sitePage('clara-and-julian', 'home')).text());
  assert.equal(home('[data-field="venue.name"]').text(), 'The Rosewater Conservatory');
});

test('unknown slug, reserved slug, bad slug and unknown page are 404', async () => {
  for (const res of [
    await site('nobody-here'),
    await site('edit'),
    await site('themes'),
    await site('_next'),
    await site('a'),
    await site('bad%20slug'),
    await sitePage('clara-and-julian', 'index'),
    await sitePage('clara-and-julian', 'admin'),
    await sitePage('clara-and-julian', 'home.html'),
    await sitePage('mini-site', 'story'), // page not declared by the theme
    await sitePage('nobody-here', 'home'),
  ]) {
    assert.equal(res.status, 404, res.url);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
  }
  assert.equal((await sitePage('mini-site', 'home')).status, 200);
});

test('draft site is 404 without a valid preview key, 200 with it', async () => {
  assert.equal((await site('draft-only')).status, 404);
  assert.equal((await sitePage('draft-only', 'home')).status, 404);
  assert.equal((await site('draft-only', '?preview=wrong-key-value-123456')).status, 404);
  assert.equal((await site('draft-only', `?preview=${draft.editKey}`)).status, 404, 'the edit key is not a preview key');
  assert.equal((await site('draft-only', `?preview=${published.previewKey}`)).status, 404, "another site's key");

  const res = await sitePage('draft-only', 'home', `?preview=${draft.previewKey}`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.equal(res.headers.get('cache-control'), 'private, no-store');
  assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
  const $ = cheerio.load(await res.text());
  assert.equal($('html').attr('data-preview'), 'true');
  assert.equal($('a[href^="/draft-only/story"]').attr('href'), `/draft-only/story?preview=${draft.previewKey}`);
});

test('preview shows unpublished edits; the public page keeps the published snapshot', async () => {
  const pub = cheerio.load(await (await site('clara-and-julian')).text());
  assert.equal(pub('h1').text(), 'Clara & Julian');
  const prev = cheerio.load(await (await site('clara-and-julian', `?preview=${published.previewKey}`)).text());
  assert.equal(prev('h1').text(), 'Clara & Julian DRAFT');
});

test('unpublished site goes back to 404', async () => {
  const adapter = getDataAdapter();
  await adapter.unpublish(published.id);
  assert.equal((await site('clara-and-julian')).status, 404);
  assert.equal((await site('clara-and-julian', `?preview=${published.previewKey}`)).status, 200);
  await adapter.publish(published.id);
  assert.equal((await site('clara-and-julian')).status, 200);
});

test('uppercase slug redirects to the lowercase address', async () => {
  const res = await getPage(req('/Clara-And-Julian/home?preview=x'), { params: Promise.resolve({ slug: 'Clara-And-Julian', page: 'home' }) });
  assert.equal(res.status, 308);
  assert.equal(res.headers.get('location'), `${BASE}/clara-and-julian/home?preview=x`);
});

test('a page switched off by its <body data-optional> is 404 (story without our_story)', async () => {
  const adapter = getDataAdapter();
  const content = demoContent();
  content.optional_blocks.our_story = false;
  const s = await createSiteWithKeys(adapter, { slug: 'no-story', theme: '_sample', content });
  await publishSite(adapter, s.site.id);
  assert.equal((await sitePage('no-story', 'story')).status, 404);
  assert.equal((await sitePage('no-story', 'home')).status, 200);
  const story = cheerio.load(await (await sitePage('clara-and-julian', 'story')).text());
  assert.deepEqual(story('[data-repeat-item] strong').map((_, el) => story(el).text()).get(), ['First hello', 'The proposal', 'Forever begins']);
  assert.match(story('title').text(), /^Our Story · Clara & Julian/);
});

test('CSP allows exactly the theme inline scripts by hash', async () => {
  const res = await site('clara-and-julian');
  const csp = res.headers.get('content-security-policy')!;
  const scriptSrc = csp.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.match(scriptSrc, /^script-src 'self' 'sha256-[A-Za-z0-9+/=]+'$/);
  assert.ok(!csp.includes('unsafe-inline') || /style-src[^;]*unsafe-inline/.test(csp));
  assert.ok(!/script-src[^;]*unsafe-inline/.test(csp));
});

test('a site whose theme is missing returns 500, not a crash', async () => {
  const res = await site('broken-theme');
  assert.equal(res.status, 500);
});

test('theme asset route serves assets only, never templates or traversal', async () => {
  const asset = (theme: string, p: string[]) => getThemeAsset(req(`/themes/${theme}/${p.join('/')}`), { params: Promise.resolve({ theme, path: p }) });
  const css = await asset('_sample', ['style.css']);
  assert.equal(css.status, 200);
  assert.equal(css.headers.get('content-type'), 'text/css; charset=utf-8');
  const svg = await asset('_sample', ['assets', 'placeholder.svg']);
  assert.equal(svg.status, 200);
  assert.match(svg.headers.get('content-security-policy')!, /default-src 'none'/);
  for (const [theme, p] of [
    ['_sample', ['index.html']],
    ['_sample', ['theme.json']],
    ['_sample', ['..', '_sample', 'style.css']],
    ['_sample', ['assets', '..', '..', 'mini', 'theme.json']],
    ['_sample', ['nope.css']],
    ['../etc', ['passwd']],
    ['_sample', ['.hidden.css']],
  ] as Array<[string, string[]]>) {
    assert.equal((await asset(theme, p)).status, 404, `${theme}/${p.join('/')}`);
  }
});

test('media route serves local uploads with nosniff', async () => {
  const saved = await getDataAdapter().savePhoto(published.id, { bytes: tinyPng() });
  const parts = saved.url.replace(/^\/media\//, '').split('/');
  const res = await getMedia(req(saved.url), { params: Promise.resolve({ path: parts }) });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'image/png');
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  const missing = await getMedia(req('/media/x/y.png'), { params: Promise.resolve({ path: ['x', 'y.png'] }) });
  assert.equal(missing.status, 404);
  const traversal = await getMedia(req('/media/..'), { params: Promise.resolve({ path: ['..', 'sites', `${published.id}.json`] }) });
  assert.equal(traversal.status, 404);
});

test('uploaded photo appears on the published page after re-publish', async () => {
  const adapter = getDataAdapter();
  const saved = await adapter.savePhoto(published.id, { bytes: tinyPng() });
  const content = demoContent();
  content.media.hero_portrait = saved.url;
  await adapter.updateContent(published.id, content);
  await publishSite(adapter, published.id);
  const $ = cheerio.load(await (await site('clara-and-julian')).text());
  assert.equal($('img[data-photo="hero"]').attr('src'), saved.url);
  assert.equal($('img[data-photo="hero"]').attr('data-photo-state'), 'user');
});
