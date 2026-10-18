// Red Lacquer & Double Happiness (34, G183): platform theme built before its GPT parts (interim red paper, lacquer,
// cream paper and gold leaf), the envelope opening (K23 strict: a closed envelope first — back, pocket, 囍, flap with two
// faces, the string-and-button closure, the card wrapped in two paper-cut windows; the cord unwinds, the flap lifts, the
// card comes up, the windows open one layer after the other, gold clouds), editable texts, scenes, the round moon gate
// photo slots with their sliding doors, the paper-cut parallax, demo route, thank-you mode, audio cues, RSVP contract,
// print layout. Off sale ("coming") until approval.
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

const id = 'red-lacquer-double-happiness';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');
const start = (k: string) => Number(new RegExp(`\\b${k}: \\[(\\d+),`).exec(js)![1]);

test('Red Lacquer & Double Happiness is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Red Lacquer & Double Happiness');
  assert.ok(['coming', 'preview'].includes(MARKETING.designs.find((d) => d.id === id)?.status ?? ''));
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '34_Red_Lacquer_Double_Happiness');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  const m = JSON.parse(read('img/manifest.json'));
  for (const [k, v] of Object.entries(m.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  // K23 strict (docs/24 3rd wave): the first page is an envelope, and the sales copy says so
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/34_Red_Lacquer_Double_Happiness/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Mei & Julian');
  assert.equal(a.date, '2027-09-25');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Mei', 'Julian', 'Peony Court', 'Vancouver', 'September', 'M&amp;J', 'M&J']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
  // the demo pin is a city no other design uses
  const pin = DEMO_CITY_PINS[id];
  for (const [other, p] of Object.entries(DEMO_CITY_PINS)) if (other !== id) assert.ok(Math.hypot(p.lat - pin.lat, p.lng - pin.lng) > 0.5, other);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
  const copy = JSON.parse(read('theme.json')).copy;
  assert.equal(copy.envelope_kicker.default, 'Together with their families');
  assert.equal(copy.envelope_open.default, 'Open the envelope');
  assert.equal(copy.home_intro.default, 'Double happiness');
});

test('envelope page — the catalogue cover layout and the separate layers of the envelope', () => {
  const $ = cheerio.load(html.index);
  // names above the envelope, date · city and "Tap to open" under it, Skip in the corner (K23, InvitationCover)
  const order = ['data-copy="envelope_kicker"', '<h1 class="names"', '<div class="stage"', '<p class="opening-date', '<p class="eyebrow tap-hint"'];
  const pos = order.map((s) => html.index.indexOf(s));
  for (let i = 1; i < pos.length; i++) assert.ok(pos[i - 1] >= 0 && pos[i - 1] < pos[i], order[i]);
  assert.equal($('.opening-heading h1.names').length, 1);
  assert.equal($('.opening-foot .opening-date [data-field="venue.city"]').length, 1);
  assert.equal($('a.skip[data-skip]').length, 1);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.env-back', '.pocket', '.xi', '.flap .flap-out', '.flap .flap-in', '.flap-out .button.b-flap', '.button.b-body', '.string', '.envelope .card', '.card .veil.vo.l', '.card .veil.vo.r', '.card .veil.vi.l', '.card .veil.vi.r', '.sheen']) assert.equal(stage.find(sel).length, 1, sel);
  // not the 01–32 envelope: no V flap, no wax seal
  assert.doesNotMatch(html.index + css, /\bseal\b|clip-path:polygon/);
  // 囍 is never a text node of the template (gold leaf, docs/24): interim = generated content of the Ma Shan Zheng subset
  assert.ok(!$('body').text().includes('囍'));
  assert.match(css, /\.xi::before\{content:"\\56CD";content:"\\56CD" \/ ""/);
  assert.match(html.index, /family=Ma\+Shan\+Zheng&amp;display=swap" media="print" data-font-later>/);
  assert.match(css, /\.xi-ready \.xi::before\{opacity:1\}/);
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

test('opening — in MOTION order, each object its own movement (site.css delays = MOTION starts)', () => {
  assert.ok(start('untie') <= start('cord') && start('cord') < start('flap') && start('flap') < start('rise') && start('rise') < start('outer') && start('outer') < start('inner') && start('inner') < start('forward'));
  assert.ok(start('forward') < Number(/go: (\d+),/.exec(js)![1]));
  assert.match(css, new RegExp(`\\.is-opening \\.b-flap\\{animation:untie \\d+ms ${start('untie')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.string\\{animation:cord-off \\d+ms ${start('cord')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-lift \\d+ms ${start('flap')}ms`));
  assert.match(css, new RegExp(`card-rise \\d+ms ${start('rise')}ms`));
  assert.match(css, new RegExp(`card-forward \\d+ms ${start('forward')}ms`));
  for (const side of ['l', 'r']) {
    assert.match(css, new RegExp(`\\.is-opening \\.veil\\.vo\\.${side}\\{animation:veil-${side} \\d+ms ${start('outer')}ms`));
    assert.match(css, new RegExp(`\\.is-opening \\.veil\\.vi\\.${side}\\{animation:veil-${side} \\d+ms ${start('inner')}ms`));
  }
  // the windows open on their outer edges, the flap turns on its fold, the flap button turns as the cord lets go
  assert.match(css, /\.veil\.l\{left:0;transform-origin:0 50%\}/);
  assert.match(css, /\.veil\.r\{right:0;transform-origin:100% 50%\}/);
  assert.match(css, /@keyframes flap-lift\{[^}]*\}[^@]*rotateX\(180deg\)/);
  assert.match(css, /@keyframes untie\{to\{transform:rotate\(-720deg\)\}\}/);
  assert.match(js, /drift\(\$\('\.opening'\), MOTION\.drift\.opening/);
});

test('session keys per site, view transition, scenes, placeholders, countdown, K21', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope \.hero-card \[data-step\]\{opacity:1;transform:none;transition:none\}/);
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
  // the inner pages' photos open behind the two paper doors of their moon gate (never without JS or with reduced motion)
  for (const p of ['home', 'story', 'details'] as const) {
    const $ = cheerio.load(html[p]);
    assert.ok($('.photo-slot.doors').length > 0, p);
    $('.photo-slot.doors').each((_, el) => { assert.equal($(el).children('.door.l').length + $(el).children('.door.r').length, 2, p); });
  }
  assert.equal(cheerio.load(html.story)('.gate > .photo-slot.doors + .rim').length, 3);
  assert.match(css, /\.door\{display:none;/);
  assert.match(css, /\.js \.doors>\.door\{display:block;/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.doors>\.door\{display:none!important\}/);
  // the paper-cut layers move with the scroll at their own depth
  assert.ok(cheerio.load(html.story)('.page-cut[data-depth]').length === 2);
  assert.match(js, /n\.style\.transform = `translate3d\(0,\$\{\(y \* Number\(n\.dataset\.depth\)\)/);
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  // scroll-padding for the bottom nav
  assert.match(css, /html\{scroll-padding-bottom:calc\(var\(--nav-h\) \+ 12px\)\}/);
});

test('img/manifest.json names og + favicon; build script, README and thank-you styles exist', () => {
  const m = JSON.parse(read('img/manifest.json'));
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
  assert.equal(m.stage.aspect, 0.66);
});

test('demo route renders every page with placeholders and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/red-lacquer-double-happiness\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /img\/ph_round-640\.webp/);
    if (page === 'story') assert.equal($('.moment').length, 3);
    if (page === 'index') assert.match($('.opening-heading .eyebrow').first().text(), /Together with their families/);
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
  demo.thank_you = { mode: 'on', message: 'Thank you for a day among the peonies.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: the red paper, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a day among the peonies/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the cord, the flap, the card, the two windows, forward', () => {
  assert.deepEqual(designSound(id), { music: 'first-light', opening: [[0, 'ribbon'], [900, 'paper'], [1500, 'slide'], [2150, 'paper'], [2550, 'paper'], [3150, 'chime']] });
  assert.deepEqual(designSound(id)!.opening.map(([ms]) => ms), [start('untie'), start('flap'), start('rise'), start('outer'), start('inner'), start('forward')]);
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
  // the clouds are named only by parts.css, never as a literal in site.js; without them there are none
  assert.match(js, /getPropertyValue\('--rl-clouds'\)/);
  assert.match(js, /if \(!host \|\| !CLOUDS\.length \|\| reduce\) return null;/);
  assert.match(js, /if \(reduce \|\| !CLOUDS\.length/);
  // the ornaments that wait for their parts are hidden until parts.css shows them (never an empty box with a frame)
  assert.match(css, /\.tassel,\.cut-far,\.cut-near,\.string\{display:none\}/);
  assert.match(css, /\.band-cut\{display:none;/);
  assert.match(css, /\.gate>\.rim\{display:none;/);
  const m = JSON.parse(read('img/manifest.json'));
  assert.ok(Array.isArray(m.parts.used) && Array.isArray(m.parts.waiting_for_gpt));
  assert.equal(m.parts_css_rules, (parts.match(/^[^/\s][^\n]*\{/gm) ?? []).length, 'manifest counts the rules parts.css carries');
  if (!m.parts.used.length) assert.match(parts, /none yet/);
  assert.doesNotMatch(parts, /<svg|data:image/);
});
