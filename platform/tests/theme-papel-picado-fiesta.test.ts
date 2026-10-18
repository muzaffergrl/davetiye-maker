// Papel Picado Fiesta (38, G187): platform theme built before its GPT parts (interim kraft, wall, paper, terracotta and
// tissue flags), the closed envelope of the third wave (K23 strict: a kraft envelope with a straight flap held by a belly
// band of cut-paper flags — no V flap, no wax seal), its opening (band works loose, the six flags fly up into a garland
// and wave, the flap swings up on its top edge, string lights, card rises), editable texts, scenes, the hanging cut-paper
// frames that drop in and swing, the wind from the scroll speed, demo route, thank-you mode, audio cues, RSVP contract,
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
import { DESIGN_COPY, DESIGN_STYLES, openingObject } from '../lib/marketing/designs.ts';
import { designSound } from '../lib/audio/catalog.ts';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'papel-picado-fiesta';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');

test('Papel Picado Fiesta is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Papel Picado Fiesta');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'coming');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '38_Papel_Picado_Fiesta');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_STYLES[id], ['destination', 'rustic']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '38_Papel_Picado_Fiesta');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  const m = JSON.parse(read('img/manifest.json'));
  for (const [k, v] of Object.entries(m.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/38_Papel_Picado_Fiesta/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Valeria & Diego');
  assert.equal(a.date, '2027-04-24');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Valeria', 'Diego', 'Bugambilia', 'San Antonio', 'April', 'V&amp;D', 'V&D']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — pocket, flap (outside + lining), six band flags and card are separate layers; no V flap, no seal', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .pocket', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in', '.envelope > .band', '.envelope > .card', '.envelope > .glow']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal(stage.find('.band > .flag').length, 6);
  for (let n = 1; n <= 6; n++) assert.equal(stage.find(`.band > .flag.fl-${n} > i`).length, 1, `flag ${n}`);
  // third wave (K23 strict): not the V flap + wax seal of 01–32
  assert.doesNotMatch(html.index + css, /\bseal\b|wax|v-flap|clip-path:\s*polygon/i);
  // the steps in MOTION order: the band works loose, the flags fly, the flap opens, the lights, the card rises
  const start = (k: string) => Number(new RegExp(`${k}: \\[(\\d+),`).exec(js)![1]);
  assert.ok(start('band') < start('flags') && start('flags') < start('flap') && start('flap') < start('lights') && start('lights') < start('rise') && start('rise') < start('forward'));
  const [f0, gap, fly] = /flags: \[(\d+), (\d+), (\d+)\]/.exec(js)!.slice(1).map(Number);
  assert.match(css, new RegExp(`\\.is-opening \\.band \\.flag\\{animation:band-loose \\d+ms ${start('band')}ms[^,]*,flag-fly ${fly}ms calc\\(${f0}ms \\+ var\\(--i\\) \\* ${gap}ms\\)`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open \\d+ms ${start('flap')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.glow\\{animation:glow-on \\d+ms ${start('lights')}ms`));
  assert.match(css, new RegExp(`card-rise \\d+ms ${start('rise')}ms`));
  assert.match(css, new RegExp(`card-forward \\d+ms ${start('forward')}ms`));
  // the flap turns on its top edge (3D) and shows its lining; the band geometry is the same in site.js and site.css
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:3\}/);
  assert.match(css, /\.flap-in\{transform:rotateX\(180deg\)/);
  const band = /band: \{ top: ([\d.]+), height: ([\d.]+), flags: 6 \}/.exec(js)!;
  assert.match(css, new RegExp(`\\.band\\{left:0;top:${band[1]}%;width:100%;height:${band[2]}%`));
  // every flag flies to its own place on the garland (CSS variables written by site.js), then waves on its own phase
  assert.match(js, /setProperty\('--tx'/);
  assert.match(js, /setProperty\('--ty'/);
  assert.match(css, /@keyframes flag-fly\{from\{transform:translate\(var\(--spread\),0\) rotate\(var\(--tilt\)\) scale\(1\)\}/);
  assert.match(css, /\.is-opened \.band \.flag\{transform:translate\(var\(--tx\),var\(--ty\)\) rotate\(var\(--r\)\) scale\(var\(--s\)\)\}/);
  assert.match(css, /@keyframes wave\{/);
  for (let i = 1; i <= 6; i++) assert.match(css, new RegExp(`\\.flag:nth-child\\(${i}\\)\\{--i:${i - 1};`));
  // the catalogue cover layout: families line + names above, envelope in the middle, date · city and "Tap to open" below
  assert.equal($('.opening-heading [data-copy="envelope_kicker"]').text(), 'Together with their families');
  assert.equal($('.opening-actions .opening-date [data-field="date"]').length, 1);
  assert.equal($('.opening-actions .tap-hint').length, 1);
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

test('bulbs only from the GPT sprite; the flags are the build\'s images in every state', () => {
  assert.match(js, /getPropertyValue\('--pf-bulb'\)/);
  assert.match(js, /if \(!box \|\| !BULB\) return;/);
  assert.doesNotMatch(js, /img\/bulb/);
  for (let n = 1; n <= 6; n++) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', `flag_${n}-200.webp`)), `flag ${n}`);
  assert.match(js, /img\/flag_\$\{\(i % 6\) \+ 1\}-200\.webp/);
});

test('session keys per site, view transition, scenes, placeholders, countdown, K21', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope \.hero-card \[data-step\]\{opacity:1;clip-path:none;transform:none;transition:none;animation:none\}/);
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
  // the inner pages' photos hang in cut-paper frames that drop in and swing (never without JS or with reduced motion)
  for (const p of ['home', 'story', 'details'] as const) assert.ok(cheerio.load(html[p])('.hang.frame[data-step] > .photo-slot[data-slot] + .cut').length > 0, p);
  assert.equal(cheerio.load(html.story)('.moment .hang.frame > .photo-slot + .cut').length, 3);
  assert.equal(cheerio.load(html.details)('.hang.frame.f-wide > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /\.js \.hang\[data-step\]\.in\{animation:swing-in [^}]*breeze/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.hang\[data-step\]\.in,[^{]*\{animation:none!important;transform:none!important\}/);
  assert.match(js, /setProperty\('--wind'/);
  assert.match(css, /\.hang\{transform-origin:50% -8%;rotate:calc\(var\(--wind\) \* \.5deg\)/);
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
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
    assert.match(data.pages.home, /^\/start\/demo\/papel-picado-fiesta\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /img\/ph_portrait-640\.webp/);
    if (page === 'story') assert.equal($('.moment').length, 3);
  }
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for a day in the courtyard.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a piece of tissue paper, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a day in the courtyard/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the band, the flags, the flap, the lights, the card', () => {
  assert.deepEqual(designSound(id), { music: 'garden-waltz', opening: [[250, 'ribbon'], [700, 'whoosh'], [1500, 'paper'], [1900, 'chime'], [2500, 'slide'], [3100, 'chime']] });
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
  // every image the pages, CSS and JS name exists in img/ (the drop-in check of tools/gpt_kuru_deneme.py, here for the
  // build as it is now); the bulb is named only by parts.css, never as a literal in site.js
  for (const f of ['site.css', 'parts.css', 'thank-you.css', 'site.js', ...PAGES.map((p) => `${p}.html`)]) {
    for (const m of read(f).matchAll(/img\/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png))/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[1])), `${f}: img/${m[1]}`);
  }
  // the ornaments that wait for their parts are hidden until parts.css shows them (never an empty box with a frame)
  assert.match(css, /\.bloom,\.embroidery\{display:none\}/);
  assert.match(css, /\.frame>\.cut\{display:none;/);
  const m = JSON.parse(read('img/manifest.json'));
  assert.ok(Array.isArray(m.parts.used) && Array.isArray(m.parts.waiting_for_gpt));
  assert.equal(m.parts_css_rules, (parts.match(/^[^/\s][^\n]*\{/gm) ?? []).length, 'manifest counts the rules parts.css carries');
  if (!m.parts.used.length) assert.match(parts, /none yet/);
  // the K21 rules of site.css hold for the generated file too
  assert.doesNotMatch(parts, /<svg|data:image/);
});
