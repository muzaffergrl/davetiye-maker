// Highland Tartan & Thistle (35, G184): platform theme built before its GPT parts (interim wool, ground, paper, leather,
// brass and mist), the strapped-envelope opening (K23 strict: buckle, strap, straight flap, sprig, card, two banks of
// mist), editable texts, scenes, the locket photo slots whose lids swing open, the mist behind the pages, demo route,
// thank-you mode, audio cues, RSVP contract, print layout. Off sale ("coming") until approval.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { claimableTheme } from '../lib/claim/themes.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { DEMO_CITY_PINS } from '../lib/claim/demo-map.ts';
import { themeOpenForClaims } from '../lib/themes/approval.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, openingObject } from '../lib/marketing/designs.ts';
import { designSound } from '../lib/audio/catalog.ts';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'highland-tartan-thistle';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');

test('Highland Tartan & Thistle is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Highland Tartan & Thistle');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'coming');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  // the demo pin is a city no other theme uses
  for (const [other, pin] of Object.entries(DEMO_CITY_PINS)) if (other !== id) assert.notDeepEqual(pin, DEMO_CITY_PINS[id], other);
  assert.equal(PRINT_LAYOUTS[id]?.collection, '35_Highland_Tartan_Thistle');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  const m = JSON.parse(read('img/manifest.json'));
  for (const [k, v] of Object.entries(m.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('K23 strict: the sales copy opens with the envelope', () => {
  const copy = DESIGN_COPY[id];
  assert.ok(copy);
  assert.match(copy.opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(copy), 'envelope');
  assert.equal(copy.collection, '35_Highland_Tartan_Thistle');
  assert.deepEqual(copy.fonts, ['Rouge Script', 'Sorts Mill Goudy']);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/35_Highland_Tartan_Thistle/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Isla & Callum');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Isla', 'Callum', 'Glenarden', 'Pitlochry', 'September', 'I&amp;C', 'I&C']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('the envelope — back, pocket, flap (two faces), strap, buckle, sprig, card and two banks of mist are separate layers', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.env-back', '.env-front', '.flap', '.flap .flap-in', '.strap', '.strap .buckle', '.sprig', '.satchel .card', '.sheen']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal($('.opening > .mist.m-far').length, 1);
  assert.equal($('.opening > .mist.m-near').length, 1);
  // catalogue-cover layout (K23 strict): host line + names above, the envelope in the middle, date · place and "Tap to open" below
  const order = $('.opening').children().map((_, el) => $(el).attr('class') ?? '').get();
  assert.ok(order.indexOf('opening-heading') < order.indexOf('stage') && order.indexOf('stage') < order.indexOf('opening-foot'), order.join(' | '));
  assert.equal($('.opening-heading [data-field="host_line"]').length, 1);
  assert.equal($('.opening-foot .opening-date [data-field="date"]').length, 1);
  assert.equal($('.opening-foot .tap-hint [data-copy="envelope_hint_tap"]').length, 1);
  assert.equal($('a.skip[data-skip]').length, 1);
  // not the V flap + wax seal of 01–21: no seal, no V-cut flap, the flap is a straight band of wool turning on its top fold
  assert.equal($('.seal, .closure, .flap-v').length, 0);
  assert.match(css, /\.flap\{left:0;top:0;width:100%;height:56%;z-index:5;transform-origin:50% 0;transform-style:preserve-3d\}/);
  assert.doesNotMatch(css, /\.flap[^{]*\{[^}]*clip-path:polygon/);
  // the steps in MOTION order: buckle, strap, flap, sprig, card (site.css delays = MOTION starts)
  const step = (k: string) => new RegExp(`${k}: \\[(\\d+), (\\d+)\\]`).exec(js)!.slice(1).map(Number);
  const start = (k: string) => step(k)[0];
  assert.ok(start('buckle') < start('strap') && start('strap') < start('flap') && start('flap') < start('sprig') && start('sprig') < start('rise') && start('rise') < start('forward'));
  for (const [k, sel, anim] of [['buckle', '\\.buckle', 'buckle-open'], ['strap', '\\.strap', 'strap-off'], ['flap', '\\.flap', 'flap-up'], ['sprig', '\\.sprig', 'sprig-up']] as const) {
    const [s, d] = step(k);
    assert.match(css, new RegExp(`\\.is-opening ${sel}\\{animation:${anim} ${d}ms ${s}ms`), k);
  }
  assert.match(css, new RegExp(`\\.is-opening \\.m-near\\{animation:mist-off-l ${step('mist')[1]}ms ${start('mist')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.m-far\\{animation:mist-off-r ${step('mist')[1]}ms ${start('mist')}ms`));
  assert.match(css, new RegExp(`card-rise ${step('rise')[1]}ms ${start('rise')}ms`));
  assert.match(css, new RegExp(`card-forward ${step('forward')[1]}ms ${start('forward')}ms`));
  const go = Number(/go: (\d+),/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, 'tap → home in 3.2–5 s (docs/11 §6)');
  assert.ok(start('forward') + step('forward')[1] <= go);
  assert.equal($('.replay').length, 1);
  assert.equal($('.replay[hidden]').length, 0);
  assert.equal($('a[data-enter][href="home.html"]').length, 1);
  assert.equal($('a[data-skip][href="home.html"]').length, 1);
  assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
  assert.equal($('noscript').length, 0);
  assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
  assert.equal(stage.find('[data-slot="hero_portrait"] img[data-photo="hero_portrait"]').length, 1);
  assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
});

test('session keys per site, view transition, scenes, placeholders, countdown, K21', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope \.hero-card \[data-step\]\{opacity:1;transform:none;transition:none;filter:none\}/);
  assert.equal(cheerio.load(html.home)('.hero-card').length, 1);
  for (const p of PAGES) if (p !== 'index') assert.ok(cheerio.load(html[p])('[data-scene]').length > 0, `${p}: [data-scene]`);
  assert.equal(cheerio.load(html.home)('a[href="index.html?replay=1"]').length, 1);
  assert.equal(cheerio.load(html.rsvp)('a[href="index.html?replay=1"]').length, 1);
  assert.match(js, /box\.dataset\.targetUtc = /);
  assert.match(js, /root\.dataset\.js = 'ready'/);
  const slots = new Set<string>();
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    $('[data-slot]').each((_, el) => { slots.add($(el).attr('data-slot')!); });
    $('img[data-photo]').each((_, el) => {
      const src = $(el).attr('src')!;
      assert.match(src, /^img\/ph_/, `${p}: ${src}`);
      assert.ok(existsSync(path.join(ROOT, 'themes', id, src)), src);
      assert.ok($(el).attr('sizes'), `${p}: sizes`);
    });
  }
  assert.deepEqual([...slots].sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  // lockets: every oval photo of the inner pages sits under a lid that swings open when its scene plays (never without
  // JS or with reduced motion); the venue comes out of the mist (a mask)
  for (const p of ['home', 'story'] as const) assert.ok(cheerio.load(html[p])('.locket[data-step="photo"] > .photo-slot.locket-face + .locket-rim + .lid').length > 0, p);
  assert.equal(cheerio.load(html.story)('.locket[data-step="photo"] > .lid').length, 3);
  assert.equal(cheerio.load(html.details)('.photo-slot.mist-reveal[data-slot="venue"]').length, 1);
  assert.match(css, /\.js \.locket\.in>\.lid\{transform:rotateY\(-178deg\)/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.locket>\.lid\{display:none!important\}/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.mist-reveal\{-webkit-mask:none!important;mask:none!important\}/);
  assert.match(js, /setProperty\('--mist'/);
  for (const p of ['story', 'details'] as const) assert.equal(cheerio.load(html[p])('.page-mist > .mist').length, 2, p);
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  // K21: no drawn shapes — no SVG, no inline data images, no striped gradient faking a tartan, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image|repeating-linear-gradient|repeating-radial-gradient/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  // mobile-first details: bottom-nav scroll padding, reduced motion, no external script but the platform's
  assert.match(css, /scroll-padding-bottom:calc\(var\(--nav-h\)/);
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    $('script[src]').each((_, el) => { assert.ok(['site.js', '/rsvp/form.js'].includes($(el).attr('src')!), `${p}: ${$(el).attr('src')}`); });
    assert.match(html[p], /family=Rouge\+Script&family=Sorts\+Mill\+Goudy/);
  }
});

test('img/manifest.json names og + favicon; build script, README and thank-you styles exist', () => {
  const m = JSON.parse(read('img/manifest.json'));
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
});

test('demo route renders every page with placeholders and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/highland-tartan-thistle\/home/);
    if (page === 'index') assert.match($('.opening-heading').text(), /Together with their families/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /img\/ph_oval-640\.webp/);
    if (page === 'story') assert.equal($('.moment').length, 3);
  }
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-18'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for a day in the hills.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: the wool, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a day in the hills/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the buckle, the strap, the flap, the card', () => {
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[150, 'clasp'], [600, 'ribbon'], [1300, 'paper'], [2500, 'slide'], [3150, 'chime']] });
});

test('RSVP keeps the shared form contract; question labels leave room for the "(optional)" mark', async () => {
  const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + '/rsvp'), id, 'rsvp');
  const $ = cheerio.load(await response.text());
  assert.equal($('script[src="/rsvp/form.js"][defer]').length, 1);
  assert.equal($('form[data-rsvp-form][method="post"]:not([action])').length, 1);
  for (const st of ['success', 'closed', 'error', 'preview']) assert.equal($(`[data-rsvp-state="${st}"][hidden]`).length, 1, st);
  for (const f of ['name', 'email', 'attending', 'guests', 'message']) assert.equal($(`[data-rsvp-error-for="${f}"]`).length, 1, f);
  assert.equal($('template[data-rsvp-party]').length, 1);
  const legend = $('[data-rsvp-question] legend').first();
  assert.equal(legend.attr('data-field'), undefined, 'the label is a child span, not the legend itself');
  assert.equal(legend.find('[data-field]').length, 1);
  assert.equal($('a[href="#reply"]').length, 1);
});

test('G167: optional GPT parts come in through the generated parts.css — a page never asks for a picture the build did not make', () => {
  const parts = read('parts.css');
  assert.match(parts, /GENERATED by build_images\.py/);
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    const sheets = $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get();
    assert.ok(sheets.indexOf('parts.css') === sheets.indexOf('site.css') + 1, `${p}: parts.css right after site.css`);
  }
  for (const f of ['site.css', 'parts.css', 'thank-you.css', 'site.js', ...PAGES.map((p) => `${p}.html`)]) {
    for (const m of read(f).matchAll(/img\/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png))/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[1])), `${f}: img/${m[1]}`);
  }
  // the heather florets of a sent reply are named only by parts.css, never as a literal in site.js
  assert.match(js, /getPropertyValue\('--ht-florets'\)/);
  assert.match(js, /if \(reduce \|\| !FLORETS\.length/);
  // the ornaments that wait for their parts are hidden until parts.css shows them (never an empty box with a frame)
  assert.match(css, /\.hills,\.sprig,\.band-sprig,\.thistle\{display:none\}/);
  assert.match(css, /\.locket>\.locket-rim\{display:none;/);
  const m = JSON.parse(read('img/manifest.json'));
  assert.ok(Array.isArray(m.parts.used) && Array.isArray(m.parts.waiting_for_gpt));
  assert.equal(m.parts_css_rules, (parts.match(/^[^/\s][^\n]*\{/gm) ?? []).length, 'manifest counts the rules parts.css carries');
  if (!m.parts.used.length) assert.match(parts, /none yet/);
  assert.doesNotMatch(parts, /<svg|data:image/);
});
