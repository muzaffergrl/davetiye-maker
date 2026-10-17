// G153 (Stage 2): colour-palette variants — theme.json parsing, the engine (html[data-variant], variants.css, the
// variant's asset folder), the asset route's override/fallback, the panel API (live only, content untouched), sites
// created with a palette, the demo's ?variant=, the printable invitation, the sales site's palettes and the pilot
// designs' generated files (01, 03, 21).
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { GET as stateRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as variantRoute } from '../app/api/edit/[slug]/variant/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { GET as assetRoute } from '../app/themes/[theme]/[...path]/route.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { designPalettes } from '../lib/marketing/palettes.ts';
import { invitationHtml, printVariantOf } from '../lib/print/invitation.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { clearThemeCache, loadTheme, parseManifest } from '../lib/theme/theme.ts';
import { themeAssetUrl } from '../lib/theme/urls.ts';
import { liveVariants, parseSwatch, parseVariants, resolveVariant, variantOverridePath } from '../lib/theme/variants.ts';
import { demoContent, PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';
const FIX = 'palette-sample';
const PILOTS = { 'olive-ivory': '01_Olive_Ivory', 'blush-garden-rose': '03_Blush_Garden_Rose', 'crimson-rose-atelier': '21_Crimson_Rose_Atelier' } as const;
let themesDir = '';

before(() => {
  themesDir = tmpDir('g153-themes-');
  const dir = path.join(themesDir, FIX);
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), dir, { recursive: true });
  for (const id of Object.keys(PILOTS)) cpSync(path.join(PLATFORM_ROOT, 'themes', id), path.join(themesDir, id), { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(dir, 'theme.json'), 'utf8'));
  manifest.id = FIX;
  manifest.swatch = ['#FFFFFF', '#7D8B5A'];
  manifest.variants = [
    { id: 'sage', name: 'Sage & Gold', swatch: ['#F4F1E8', '#9AA88E', '#B39A63'], status: 'live', print: { ink: '#2C352B', accent: '#5D6B53', art: ['card'] } },
    { id: 'navy', name: 'Navy & Gold', swatch: ['#F4F1E8', '#2F3E5C'], status: 'coming' },
  ];
  writeFileSync(path.join(dir, 'theme.json'), JSON.stringify(manifest));
  writeFileSync(path.join(dir, 'variants.css'), 'html[data-variant="sage"] { --ink: #2C352B; }\nhtml[data-variant="navy"] { --ink: #1E2638; }\n');
  mkdirSync(path.join(dir, 'img/variants/sage'), { recursive: true });
  writeFileSync(path.join(dir, 'img/dot.png'), tinyPng());
  writeFileSync(path.join(dir, 'img/plain.png'), tinyPng());
  writeFileSync(path.join(dir, 'img/variants/sage/dot.png'), Buffer.concat([Buffer.from(tinyPng()), Buffer.from('sage')]));
  const home = readFileSync(path.join(dir, 'home.html'), 'utf8');
  writeFileSync(path.join(dir, 'home.html'), home.replace('<body>', '<body><img id="dot" src="img/dot.png" alt=""><div id="bg" style="background:url(img/plain.png)"></div>'));
  process.env.PLATFORM_THEMES_DIR = themesDir;
  process.env.PLATFORM_DATA_DIR = tmpDir('g153-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  clearThemeCache();
});

type Handler = (req: Request, ctx: { params: Promise<any> }) => Promise<Response>;
async function call(handler: Handler, url: string, params: Record<string, unknown>, opts: { method?: string; key?: string; json?: unknown } = {}) {
  const headers: Record<string, string> = {};
  if (opts.key) headers.Authorization = `Bearer ${opts.key}`;
  if (opts.json !== undefined) headers['Content-Type'] = 'application/json';
  const res = await handler(new Request(`${BASE}${url}`, { method: opts.method ?? 'GET', headers, body: opts.json === undefined ? undefined : JSON.stringify(opts.json) }), {
    params: Promise.resolve(params),
  });
  const text = await res.text();
  let body: any = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, body, text, res };
}

let n = 0;
async function newSite(variant?: string | null) {
  const slug = `g153-site-${++n}`;
  const s = await createSiteWithKeys(getDataAdapter(), { slug, theme: FIX, content: demoContent(), variant });
  return { slug, id: s.site.id, editKey: s.editKey, site: s.site };
}

// ------------------------------------------------------------------------------------------------ theme.json

test('parseVariants: valid list, print spec, problems for bad ids / duplicates / status / swatch', () => {
  const ok = parseVariants([{ id: 'sage-gold', name: 'Sage & Gold', swatch: ['#aabbcc', '#112233'], status: 'live', print: { ink: '#000000', art: ['card', 'paper'] } }]);
  assert.deepEqual(ok.problems, []);
  assert.deepEqual(ok.variants[0], { id: 'sage-gold', name: 'Sage & Gold', swatch: ['#AABBCC', '#112233'], status: 'live', print: { ink: '#000000', art: ['card', 'paper'] } });
  assert.deepEqual(parseVariants(undefined), { variants: [], problems: [] });
  const bad = parseVariants([
    { id: 'Sage', name: 'x', swatch: ['#aabbcc'], status: 'live' },
    { id: 'a', name: 'x', swatch: ['#aabbcc'], status: 'live' },
    { id: 'a', name: '', swatch: ['red'], status: 'sale' },
    { id: 'b', name: 'b', swatch: ['#aabbcc'], status: 'live', print: { ink: 'red', art: ['../x'] } },
  ]).problems.join(' | ');
  for (const part of ['variants[0].id', 'used twice', 'variants[2].name', 'variants[2].swatch', 'variants[2].status', 'print.ink', 'print.art']) assert.ok(bad.includes(part), part);
  assert.deepEqual(parseSwatch(['#abcdef']), { swatch: ['#ABCDEF'], problem: null });
  assert.ok(parseSwatch(['#abc']).problem);
  assert.throws(() => parseManifest({ id: 'x', name: 'X', pages: { index: 'index.html' }, variants: [{ id: '1' }] }, 'x'), /variants\[0\]\.id/);
  assert.deepEqual(parseManifest({ id: 'x', name: 'X', pages: { index: 'index.html' } }, 'x').variants, []);
});

test('resolveVariant: declared + live for buyers, coming only when asked; override paths; asset URLs', () => {
  const vs = parseVariants([
    { id: 'sage', name: 'S', swatch: ['#ffffff'], status: 'live' },
    { id: 'navy', name: 'N', swatch: ['#ffffff'], status: 'coming' },
  ]).variants;
  assert.equal(resolveVariant(vs, 'sage'), 'sage');
  assert.equal(resolveVariant(vs, 'navy'), null);
  assert.equal(resolveVariant(vs, 'navy', { includeComing: true }), 'navy');
  assert.equal(resolveVariant(vs, 'plum', { includeComing: true }), null);
  assert.equal(resolveVariant(vs, 42), null);
  assert.deepEqual(liveVariants(vs).map((v) => v.id), ['sage']);
  assert.equal(variantOverridePath('sage', 'img/env-880.webp'), 'img/variants/sage/env-880.webp');
  assert.equal(variantOverridePath('sage', 'site.css'), null);
  assert.equal(variantOverridePath('sage', 'img/variants/x/a.webp'), null);
  assert.equal(themeAssetUrl('t', 'img/a.webp', 'sage'), '/themes/t/~sage/img/a.webp');
  assert.equal(themeAssetUrl('t', 'img/a.webp', 'Bad Id'), '/themes/t/img/a.webp');
  assert.equal(themeAssetUrl('t', 'img/a.webp'), '/themes/t/img/a.webp');
});

// ------------------------------------------------------------------------------------------------ engine

test('engine: a declared palette sets data-variant, links variants.css last and points theme assets at ~<id>', async () => {
  const theme = (await loadTheme(FIX))!;
  const html = readFileSync(path.join(themesDir, FIX, 'home.html'), 'utf8');
  const r = renderTemplate({ html, content: demoContent(), theme: theme.manifest, page: 'home', slug: 's', variant: 'navy' });
  const $ = cheerio.load(r.html);
  assert.equal($('html').attr('data-variant'), 'navy');
  const sheets = $('link[rel="stylesheet"]').map((_, e) => $(e).attr('href')).get();
  assert.equal(sheets.at(-1), `/themes/${FIX}/~navy/variants.css`);
  assert.ok(sheets.includes(`/themes/${FIX}/~navy/style.css`));
  assert.equal($('#dot').attr('src'), `/themes/${FIX}/~navy/img/dot.png`);
  assert.match($('#bg').attr('style') ?? '', /\/themes\/palette-sample\/~navy\/img\/plain\.png/);
  assert.equal(JSON.parse($('#site-data').text()).variant, 'navy');
  // unknown palette: the original, nothing points at a variant folder
  const plain = cheerio.load(renderTemplate({ html, content: demoContent(), theme: theme.manifest, page: 'home', slug: 's', variant: 'plum' }).html);
  assert.equal(plain('html').attr('data-variant'), undefined);
  assert.equal(plain('#dot').attr('src'), `/themes/${FIX}/img/dot.png`);
  // a theme with palettes links its variants.css on every page (its :root holds the colour channels site.css uses)
  assert.ok(plain(`link[href="/themes/${FIX}/variants.css"]`).length);
  const noPalettes = cheerio.load(renderTemplate({ html, content: demoContent(), theme: { ...theme.manifest, variants: [] }, page: 'home', slug: 's' }).html);
  assert.ok(!noPalettes.html().includes('variants.css'));
  // the demo keeps ?variant= on its page links
  const demo = cheerio.load(renderTemplate({ html, content: demoContent(), theme: theme.manifest, page: 'home', slug: 'start/demo/x', variant: 'sage', variantInLinks: true, previewKey: 'demo' }).html);
  const pages = JSON.parse(demo('#site-data').text()).pages as Record<string, string>;
  assert.match(pages.details, /[?&]variant=sage\b/);
});

// ------------------------------------------------------------------------------------------------ asset route

test('asset route: ~<id>/img/… serves the override, else the original; other files are the original; bad ids 404', async () => {
  const get = (p: string) => call(assetRoute as Handler, `/themes/${FIX}/${p}`, { theme: FIX, path: p.split('/') });
  const own = await get('~sage/img/dot.png');
  assert.equal(own.status, 200);
  assert.ok(own.text.endsWith('sage'));
  const base = await get('img/dot.png');
  assert.ok(!base.text.endsWith('sage'));
  assert.equal((await get('~navy/img/dot.png')).text, base.text); // navy has no override → the original
  assert.equal((await get('~sage/img/plain.png')).status, 200);
  assert.equal((await get('~sage/style.css')).status, 200);
  assert.equal((await get('~sage/variants.css')).status, 200);
  assert.equal((await get('~Bad/img/dot.png')).status, 404);
  assert.equal((await get('~sage')).status, 404);
  assert.equal((await get('~sage/theme.json')).status, 404);
  assert.equal((await call(assetRoute as Handler, '/x', { theme: FIX, path: ['~sage', '..', 'theme.json'] })).status, 404);
});

// ------------------------------------------------------------------------------------------------ sites + panel

test('createSiteWithKeys keeps only a live palette; the site page renders in it', async () => {
  assert.equal((await newSite('sage')).site.variant, 'sage');
  assert.equal((await newSite('navy')).site.variant, null); // still in review
  assert.equal((await newSite('nope')).site.variant, null);
  const s = await newSite('sage');
  await publishSite(getDataAdapter(), s.id);
  const page = await call(siteRoute as Handler, `/${s.slug}`, { slug: s.slug });
  const $ = cheerio.load(page.text);
  assert.equal($('html').attr('data-variant'), 'sage');
  assert.ok($(`link[href="/themes/${FIX}/~sage/variants.css"]`).length);
});

test('panel: state lists the palettes; POST /variant sets a live one or the original, refuses others; content untouched', async () => {
  const s = await newSite(null);
  const route = `/api/edit/${s.slug}/variant`;
  const state = await call(stateRoute as Handler, `/api/edit/${s.slug}`, { slug: s.slug }, { key: s.editKey });
  assert.equal(state.status, 200);
  assert.equal(state.body.state.variant, null);
  assert.deepEqual(state.body.state.theme.swatch, ['#FFFFFF', '#7D8B5A']);
  assert.deepEqual(state.body.state.theme.variants.map((v: any) => [v.id, v.live]), [['sage', true], ['navy', false]]);
  const before = (await getDataAdapter().getSiteById(s.id))!;

  const set = await call(variantRoute as Handler, route, { slug: s.slug }, { method: 'POST', key: s.editKey, json: { variant: 'sage' } });
  assert.equal(set.status, 200);
  assert.equal(set.body.variant, 'sage');
  const after = (await getDataAdapter().getSiteById(s.id))!;
  assert.equal(after.variant, 'sage');
  assert.deepEqual(after.content, before.content);

  for (const [variant, status] of [['navy', 422], ['plum', 422], [5, 400]] as const) {
    assert.equal((await call(variantRoute as Handler, route, { slug: s.slug }, { method: 'POST', key: s.editKey, json: { variant } })).status, status, String(variant));
  }
  assert.equal((await call(variantRoute as Handler, route, { slug: s.slug }, { method: 'POST', key: 'wrong', json: { variant: 'sage' } })).status, 401);
  const back = await call(variantRoute as Handler, route, { slug: s.slug }, { method: 'POST', key: s.editKey, json: { variant: null } });
  assert.equal(back.body.variant, null);
  assert.equal((await getDataAdapter().getSiteById(s.id))!.variant, null);
});

test('panel: a site keeps a palette taken back into review (it may be re-sent; switching to another coming one is refused)', async () => {
  const s = await newSite('sage');
  await getDataAdapter().patchSite(s.id, { variant: 'navy' }); // e.g. set while live, then taken back
  const route = `/api/edit/${s.slug}/variant`;
  assert.equal((await call(variantRoute as Handler, route, { slug: s.slug }, { method: 'POST', key: s.editKey, json: { variant: 'navy' } })).status, 200);
});

// ------------------------------------------------------------------------------------------------ demo, print, sales site

test('demo: ?variant= shows a declared palette (coming ones too, for review); unknown = the original', async () => {
  const theme = (await loadTheme('blush-garden-rose'))!;
  const coming = theme.manifest.variants[0];
  assert.ok(coming, 'blush-garden-rose has palettes (tools/recolor_parts.py build --design 03)');
  const res = await handleDemoPage(new Request(`${BASE}/start/demo/blush-garden-rose/home?variant=${coming.id}`), 'blush-garden-rose', 'home');
  assert.equal(res.status, 200);
  const $ = cheerio.load(await res.text());
  assert.equal($('html').attr('data-variant'), coming.id);
  assert.match(JSON.parse($('#site-data').text()).pages.details, new RegExp(`variant=${coming.id}`));
  const plain = cheerio.load(await (await handleDemoPage(new Request(`${BASE}/start/demo/blush-garden-rose/home?variant=nope`), 'blush-garden-rose', 'home')).text());
  assert.equal(plain('html').attr('data-variant'), undefined);
});

test('print: the invitation in a palette uses its ink / accent and its recoloured parts, the rest stays the original', () => {
  const content = demoContent();
  const opts = { size: '5x7' as const, bleed: false, marks: false, back: true };
  const plain = invitationHtml('olive-ivory', content, 'https://x.example/a', opts);
  const variant = printVariantOf({ id: 'sage', print: { ink: '#123456', accent: '#654321', art: ['card'] } });
  const html = invitationHtml('olive-ivory', content, 'https://x.example/a', { ...opts, variant });
  assert.ok(plain.includes('src="card.webp"') && !plain.includes('variants/'));
  assert.ok(html.includes('src="variants/sage/card.webp"'));
  assert.ok(html.includes('src="back.webp"'));
  assert.ok(html.includes('url(paper.webp)'));
  assert.ok(html.includes('color: #123456') && html.includes('#654321'));
  assert.equal(printVariantOf({ id: 'x' }), null);
  // composed sheets (21): url(<part>.webp) backgrounds follow the palette too
  const composed = invitationHtml('crimson-rose-atelier', content, 'https://x.example/a', { ...opts, variant: { id: 'plum-gold', art: ['branch', 'paper'] } });
  assert.ok(composed.includes('variants/plum-gold/branch.webp') && composed.includes('url(variants/plum-gold/paper.webp)'));
});

test('sales site: palettes only for a design with live ones (original first)', () => {
  assert.deepEqual(designPalettes('olive-ivory'), []); // pilot palettes are still "coming"
  const p = designPalettes(FIX, ['#000000']);
  assert.deepEqual(p.map((x) => x.id), [null, 'sage']);
  assert.deepEqual(p[0].swatch, ['#FFFFFF', '#7D8B5A']);
  assert.deepEqual(designPalettes('no-such-theme'), []);
});

// ------------------------------------------------------------------------------------------------ pilot designs

for (const [themeId, collection] of Object.entries(PILOTS)) {
  test(`pilot ${themeId}: 5 palettes from collections/${collection}/variants (coming), variants.css blocks, overrides of real files`, async () => {
    const theme = (await loadTheme(themeId))!;
    const vs = theme.manifest.variants;
    assert.equal(vs.length, 5);
    assert.ok(vs.every((v) => v.status === 'coming'), 'pilot palettes stay "coming" until the coordinator flips them');
    assert.ok(theme.manifest.swatch?.length);
    const dir = path.join(PLATFORM_ROOT, 'themes', themeId);
    const css = readFileSync(path.join(dir, 'variants.css'), 'utf8');
    const folders = readdirSync(path.join(REPO_ROOT, 'collections', collection, 'variants')).filter((f) => /^V0\d_/.test(f));
    assert.equal(folders.length, 5);
    for (const f of folders) {
      const pal = JSON.parse(readFileSync(path.join(REPO_ROOT, 'collections', collection, 'variants', f, 'palette.json'), 'utf8'));
      assert.ok(vs.some((v) => v.id === pal.slug && v.name === pal.name), `${f} in theme.json`);
      assert.ok(css.includes(`html[data-variant="${pal.slug}"]`), `${f} in variants.css`);
      assert.ok(existsSync(path.join(REPO_ROOT, 'collections', collection, 'variants', f, 'review/contact_sheet.jpg')), `${f} contact sheet`);
    }
    // colours only as tokens: every block sets custom properties only
    for (const block of css.match(/\{[^}]*\}/g) ?? []) {
      for (const decl of block.slice(1, -1).split(';').map((d) => d.trim()).filter(Boolean)) assert.match(decl, /^--[a-z0-9-]+\s*:/);
    }
    for (const v of vs) {
      const vdir = path.join(dir, 'img/variants', v.id);
      const files = existsSync(vdir) ? readdirSync(vdir) : [];
      for (const file of files) assert.ok(existsSync(path.join(dir, 'img', file)), `${v.id}/${file} overrides a real image`);
      for (const art of v.print?.art ?? []) assert.ok(existsSync(path.join(PLATFORM_ROOT, 'public/print', themeId, 'variants', v.id, `${art}.webp`)), `${v.id} print ${art}`);
    }
  });
}
