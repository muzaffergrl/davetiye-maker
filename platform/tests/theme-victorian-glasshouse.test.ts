// Victorian Glasshouse (36, G185): platform theme built from its own GPT parts (all of PAKET 5 since 2026-10-22; the
// interim fern, glass, herbarium paper, kraft, copper and twine stay only as the look of a missing part), the packet laid
// by the GPT pieces' measured proportions, the seed-packet opening (K23: a closed envelope — packet body, flap with two faces, twine
// halves, copper label, card, mist, ferns, arches), editable texts, scenes, the 4:5 specimens under glass with the mist
// wipe and the swinging copper labels, parallax, demo route with the design's own sample photos, thank-you mode, audio
// cues, RSVP contract, print layout, a ≤ 2.5 MB folder. Off sale ("coming") until approval.
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

const id = 'victorian-glasshouse';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');

test('Victorian Glasshouse is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Victorian Glasshouse');
  assert.ok(['coming', 'preview'].includes(MARKETING.designs.find((d) => d.id === id)?.status ?? ''));
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '36_Victorian_Glasshouse');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  const m = JSON.parse(read('img/manifest.json'));
  for (const [k, v] of Object.entries(m.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  // K23 strict (docs/24 wave 3): the first page is a closed envelope — the sales copy opens with it
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/36_Victorian_Glasshouse/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Flora & Edmund');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Flora', 'Edmund', 'Fernhill', 'Columbus', 'June', 'F&amp;E', 'F&E']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('seed packet — back wall, body, flap (two faces), twine halves, copper label, card, mist are separate layers; contract of the envelope page', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.pk-back', '.pk-body', '.pk-flap > .pk-flap-out', '.pk-flap > .pk-flap-in', '.twine.tw-top', '.twine.tw-bottom', '.packet > .tag > .tag-plate', '.card-slot > .card', '.sheen']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal($('main.opening > .mist[aria-hidden="true"]').length, 1);
  assert.equal($('main.opening > .ferns').length, 1);
  assert.equal($('main.opening > .arches').length, 1);
  // the layout of the catalogue cover: host line + kicker + names above, the packet in the middle, date · city and
  // "Tap to open" below, Skip in the corner
  const order = $('main.opening').children().map((_, el) => $(el).attr('class') || el.tagName).get();
  assert.ok(order.indexOf('opening-heading') < order.indexOf('stage') && order.indexOf('stage') < order.indexOf('opening-date eyebrow') && order.indexOf('opening-date eyebrow') < order.indexOf('opening-actions'), order.join(' '));
  assert.equal($('.opening-heading [data-field="host_line"]').length, 1);
  assert.equal($('a.skip[data-skip]').length, 1);
  // the monogram is stamped on the copper label (platform field, never baked into a picture)
  assert.equal(stage.find('.tag-plate [data-field="initials"]').length, 1);
  // the steps in MOTION order: label, twine, flap, mist, card, wipe, forward (site.css delays = MOTION starts)
  const start = (k: string) => Number(new RegExp(`\\b${k}: \\[(\\d+),`).exec(js)![1]);
  assert.ok(start('tag') <= start('twine') && start('twine') < start('flap') && start('flap') < start('mist') && start('mist') < start('rise') && start('rise') < start('wipe') && start('wipe') < start('forward'));
  assert.match(css, new RegExp(`tag-drop \\d+ms ${start('drop')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.tw-top\\{animation:untie-up \\d+ms ${start('twine')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.tw-bottom\\{animation:untie-down \\d+ms ${start('twine')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.pk-flap\\{animation:flap-open \\d+ms ${start('flap')}ms`));
  assert.match(css, new RegExp(`mist-on \\d+ms ${start('mist')}ms`));
  assert.match(css, new RegExp(`wipe \\d+ms ${start('wipe')}ms`));
  assert.match(css, new RegExp(`card-rise \\d+ms ${start('rise')}ms`));
  assert.match(css, new RegExp(`card-forward \\d+ms ${start('forward')}ms`));
  // not the V flap + wax seal of 01–32: a straight flap that folds up and back over its hinge, no seal
  assert.match(css, /@keyframes flap-open\{from\{z-index:4;transform:rotateX\(0\)\}[\s\S]*?to\{z-index:0;transform:rotateX\(-180deg\)\}\}/);
  assert.doesNotMatch(html.index, /seal|wax/i);
  // the mist wipe: a registered custom property animated through a soft-edged mask
  assert.match(css, /@property --wipe\{syntax:'<percentage>'/);
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
  const go = Number(/go: (\d+),/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, `tap → home ${go} ms (docs/11 §6: 3.2–5 s)`);
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
  // specimens under glass: every inner-page photo sits behind a pane whose mist is wiped (mask; never without JS or
  // with reduced motion), story moments each carry a swinging copper label and a herbarium caption label
  for (const p of ['home', 'story', 'details'] as const) assert.ok(cheerio.load(html[p])('.pane > .photo-slot + .fog + .glint').length > 0, p);
  const story = cheerio.load(html.story);
  assert.equal(story('.specimen > .case + .pane > .photo-slot').length, 3);
  assert.equal(story('.specimen > .tag.swing .tag-num').length, 3);
  assert.equal(story('figcaption.hlabel [data-field^="story.items."]').length, 3);
  assert.match(css, /\.js \.fog\{display:block;/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.fog,\.js \.glint,\.js \.mist\{display:none!important\}/);
  assert.match(css, /@keyframes swing\{/);
  assert.match(js, /setProperty\('--sy'/);
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  // fonts: a Google Fonts pair no other theme loads (docs/24: different from 01–32)
  const families = (h: string) => [...h.matchAll(/family=([A-Za-z+]+)/g)].map((m) => m[1]);
  assert.deepEqual(families(html.index).sort(), ['Monsieur+La+Doulaise', 'Old+Standard+TT']);
});

test('img/manifest.json names og + favicon; build script, README and thank-you styles exist', () => {
  const m = JSON.parse(read('img/manifest.json'));
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
});

test('demo route renders every page with the design\'s own sample photos (G155) and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/victorian-glasshouse\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/victorian-glasshouse)
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/victorian-glasshouse\/hero_portrait-\d+w\.webp/);
    if (page === 'story') for (const n of [1, 2, 3]) assert.match($(`[data-photo="story_${n}"]`).attr('src') || '', new RegExp(`^/demo/victorian-glasshouse/story_${n}-\\d+w\\.webp`));
    if (page === 'details') assert.match($('[data-photo="venue"]').attr('src') || '', /^\/demo\/victorian-glasshouse\/venue-\d+w\.webp/);
    if (page === 'story') assert.equal($('.moment').length, 3);
    if (page === 'index') assert.equal($('.tag-plate [data-field="initials"]').text(), 'F&E');
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
  demo.thank_you = { mode: 'on', message: 'Thank you for a day among the ferns.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: herbarium paper, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a day among the ferns/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the label, the twine, the flap, the card, the wipe, forward', () => {
  assert.deepEqual(designSound(id), { music: 'garden-waltz', opening: [[0, 'tap'], [300, 'ribbon'], [900, 'paper'], [1700, 'slide'], [2600, 'whoosh'], [3600, 'chime']] });
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
  // the leaflets are named only by parts.css, never as a literal in site.js
  assert.match(js, /getPropertyValue\('--vg-leaves'\)/);
  assert.match(js, /if \(reduce \|\| !LEAVES\.length/);
  // the ornaments that wait for their parts are hidden until parts.css shows them (never an empty box with a frame)
  assert.match(css, /\.arches,\.ferns,\.sprig\{display:none\}/);
  assert.match(css, /\.specimen>\.case\{display:none;/);
  const m = JSON.parse(read('img/manifest.json'));
  assert.ok(Array.isArray(m.parts.used) && Array.isArray(m.parts.waiting_for_gpt));
  assert.equal(m.parts_css_rules, (parts.match(/^[^/\s][^\n]*\{/gm) ?? []).length, 'manifest counts the rules parts.css carries');
  if (!m.parts.used.length) assert.match(parts, /none yet/);
  assert.doesNotMatch(parts, /<svg|data:image/);
});

test('all PAKET 5 parts are used; the packet is laid by the GPT pieces\' own proportions; the label\'s hole is keyed; ≤ 2.5 MB', () => {
  const m = JSON.parse(read('img/manifest.json'));
  const parts = read('parts.css');
  assert.deepEqual(m.parts.waiting_for_gpt, []);
  assert.equal(m.parts.used.length, 16);
  const st = m.stage;
  const ratio = (k: string) => m[k].src_size[0] / m[k].src_size[1];
  const toW = (h: number) => h / st.aspect;      // % of the height → % of the width
  assert.equal(m.stage_asked.aspect, 0.68);
  // the body spans the width at its own height from the mouth to the foot; the flap spans the width at its own height
  assert.ok(Math.abs(st.body[1] + st.body[3] - 100) < 0.01);
  assert.ok(Math.abs(100 / toW(st.body[3]) - ratio('packet_body')) / ratio('packet_body') < 0.01, 'body at its own proportions');
  assert.ok(Math.abs(100 / toW(st.flap[3]) - ratio('flap_out')) / ratio('flap_out') < 0.01, 'flap at its own proportions (not 1.58× too tall)');
  assert.match(parts, new RegExp(`\\.stage\\{--env-ratio:${st.aspect}\\}`));
  assert.match(parts, new RegExp(`\\.packet\\{aspect-ratio:${st.aspect}\\}`));
  assert.match(parts, new RegExp(`\\.pk-flap\\{height:${st.flap[3]}%\\}`));
  assert.match(css, /\.stage\{--env-ratio:\.68;--obj:min\([^;]*var\(--env-ratio\)/);
  // the copper label's #00FF00 hole is keyed through (a real hole, small: ~0.3 % of the label) and no key green is left
  const [hl, ht, hw, hh] = m.tag.hole_pct;
  assert.ok(hl < 20 && ht < 20 && hw > 3 && hh > 3, 'the hole at the label\'s top-left');
  for (const k of Object.keys(m.checks.green)) assert.match(k, /^(ferns|leaf_\d)-/, `${k}: key green left`);
  // the card's text starts under its window (padding % of the packet's width, scaled by the card's height in it)
  const [, T, , H] = m.card_small.window_pct;
  const top = Number(/\.packet \.card\{[^}]*padding-top:([\d.]+)%/.exec(parts)![1]);
  assert.ok(Math.abs(top - ((T + H + 3) / 100) * (80 / st.aspect)) < 0.05, String(top));
  // size: docs/11 §6 (every file ≤ 250 kB, folder ≤ 3 MB); this wave keeps the folder ≤ 2.5 MB
  assert.ok(m.bytes_total <= 2_500_000, String(m.bytes_total));
  for (const [k, v] of Object.entries(m as Record<string, { files?: { bytes: number }[] }>)) for (const f of v.files ?? []) assert.ok(f.bytes <= 250_000, k);
});
