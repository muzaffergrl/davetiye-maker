// Marigold & Mehndi (33, G182): platform theme built before its GPT parts (interim silk, velvet, paper and gold), the
// closed envelope (K23 strict: the catalogue cover's order — families, names, envelope, date · place, "Tap to open",
// Skip) and its own opening (tassel pendulum, the paisley sleeve sliding off, the straight silk flap handing over to
// its velvet face, petals, diya flames, the card rising from the lining — no V flap, no wax seal), editable texts,
// scenes, the jharokha photo slots with the henna flow, demo route, thank-you mode, audio cues, RSVP contract, print
// layout. Off sale ("coming") until approval.
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

const id = 'marigold-mehndi';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');
const start = (k: string) => Number(new RegExp(`\\b${k}: \\[(\\d+),`).exec(js)![1]);

test('Marigold & Mehndi is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Marigold & Mehndi');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'coming');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  // the demo pin is a city no other design uses
  for (const [other, pin] of Object.entries(DEMO_CITY_PINS)) if (other !== id) assert.notDeepEqual(pin, DEMO_CITY_PINS[id], other);
  assert.equal(PRINT_LAYOUTS[id]?.collection, '33_Marigold_Mehndi');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  const m = JSON.parse(read('img/manifest.json'));
  for (const [k, v] of Object.entries(m.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  // sales copy: the opening object is the envelope (K23 strict), styles registered
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.ok(DESIGN_STYLES[id]?.length);
});

test('demo record = collection record, fictional, URLs and media empty, date written out', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/33_Marigold_Mehndi/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Anaya & Kabir');
  assert.equal(a.locale, 'en-US');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Anaya', 'Kabir', 'Gulmohar', 'Jaipur', 'November', 'A&amp;K', 'A&K']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('first page: the closed envelope in the catalogue cover order (families, names, envelope, date · place, tap, skip)', () => {
  const $ = cheerio.load(html.index);
  const order = ['[data-copy="envelope_kicker"]', '[data-copy="envelope_invite"]', 'h1.names', '.stage', '.opening-date', '.tap-hint'];
  const all = $('*');
  const at = order.map((sel) => all.index($(sel).first()));
  for (let i = 1; i < at.length; i++) assert.ok(at[i - 1] >= 0 && at[i] > at[i - 1], order[i]);
  assert.equal($('[data-copy="envelope_kicker"]').text(), 'Together with their families');
  assert.equal($('.opening-date [data-field="date"]').length, 1);
  assert.equal($('.opening-date [data-field="venue.city"]').length, 1);
  assert.equal($('a[data-skip][href="home.html"]').length, 1);
});

test('envelope — back, lining, card, pocket, flap (two faces), sleeve, tassel and light are separate layers; its own mechanics', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.env-back', '.lining', '.parcel > .card', '.env-front', '.flap', '.flap-in', '.sleeve', '.sleeve .tassel', '.sheen']) assert.equal(stage.find(sel).length, 1, sel);
  // not the V flap + wax seal envelope of 01–32: no seal, no V cut, a sleeve and a tassel instead
  assert.equal(stage.find('.seal, [class*="seal"], .seal-mono').length, 0);
  assert.doesNotMatch(css, /clip-path:polygon/);
  // the steps in MOTION order: tassel at once, sleeve, flap (front then velvet face), lining, petals, diyas, card rises
  assert.equal(start('tassel'), 0);
  assert.ok(start('sleeve') < start('flap') && start('flap') < start('flapIn') && start('flap') < start('lining') &&
    start('lining') < start('petals') && start('petals') < start('diyas') && start('diyas') < start('rise') && start('rise') < start('forward'));
  // site.css delays = MOTION starts
  assert.match(css, new RegExp(`\\.is-opening \\.tassel\\{animation:swing \\d+ms ${start('tassel')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.sleeve\\{animation:sleeve-off \\d+ms ${start('sleeve')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-up \\d+ms ${start('flap')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap-in\\{animation:flap-in \\d+ms ${start('flapIn')}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.lining\\{animation:lining-warm \\d+ms ${start('lining')}ms`));
  assert.match(css, new RegExp(`flame-on \\d+ms calc\\(${start('diyas')}ms`));
  assert.match(css, new RegExp(`card-rise \\d+ms ${start('rise')}ms`));
  assert.match(css, new RegExp(`card-forward \\d+ms ${start('forward')}ms`));
  // the flap hands over at 90° (docs/11 §7.1): front 0 → 90deg on its top edge, the velvet face −90deg → 0 from its foot
  assert.match(css, /@keyframes flap-up\{from\{transform:rotateX\(0\)\}[\s\S]*?to\{transform:rotateX\(90deg\);opacity:0\}\}/);
  assert.match(css, /@keyframes flap-in\{from\{transform:rotateX\(-90deg\)/);
  assert.match(css, /\.flap\{[^}]*transform-origin:50% 0/);
  assert.match(css, /\.flap-in\{[^}]*transform-origin:50% 100%/);
  // tap → home within 3.2–5 s (docs/11 §6)
  const go = Number(/go: (\d+),/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, String(go));
  assert.equal($('.replay').length, 1);
  assert.equal($('.replay[hidden]').length, 0);
  assert.equal($('a[data-enter][href="home.html"]').length, 1);
  assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
  assert.equal($('noscript').length, 0);
  assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
  assert.equal(stage.find('[data-slot="hero_portrait"] img[data-photo="hero_portrait"]').length, 1);
  assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
});

test('petals and flames only from the GPT sprites; diyas, garland, arch, henna and tassel hidden until their parts', () => {
  assert.match(js, /getPropertyValue\('--mm-petals'\)/);
  assert.match(js, /if \(!host \|\| !PETALS\.length \|\| reduce\) return;/);
  assert.match(js, /if \(reduce \|\| !PETALS\.length/);
  assert.match(css, /\.garland,\.diyas,\.mehndi-ground\{display:none\}/);
  assert.match(css, /\.jharokha>\.arch,\.jharokha>\.henna\{display:none;/);
  assert.match(css, /\.tassel\{display:none\}/);
  assert.equal(cheerio.load(html.index)('.diyas .diya .flame').length, 5);
  assert.equal(cheerio.load(html.home)('.signature .diyas .diya .flame').length, 5);
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
  // the inner pages' photos appear through the henna flow (a mask; never without JS or with reduced motion); the story
  // photos sit in a jharokha with its arch and its henna
  for (const p of ['home', 'story', 'details'] as const) assert.ok(cheerio.load(html[p])('.photo-slot.flow').length > 0, p);
  assert.equal(cheerio.load(html.story)('.jharokha > .photo-slot.flow + .arch + .henna').length, 3);
  assert.match(css, /@property --flow\{syntax:'<percentage>'/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.flow,\.js \.henna,\.js \.flow-x\{-webkit-mask:none!important;mask:none!important\}/);
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  // K21: no drawn shapes — no SVG, no inline data images, no border-radius arch, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  assert.doesNotMatch(css, /border-radius:50%|border-radius:[^;}]*\/[^;}]*/);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  // mobile-first: the bottom nav leaves room (scroll padding), Google Fonts only, the theme's own script only
  assert.match(css, /scroll-padding-bottom:calc\(var\(--nav-h\)/);
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    $('script[src]').each((_, el) => assert.ok(['site.js', '/rsvp/form.js'].includes($(el).attr('src')!), `${p}: ${$(el).attr('src')}`));
    $('link[rel="stylesheet"]').each((_, el) => { const h = $(el).attr('href')!; assert.ok(/^(site|parts|thank-you)\.css$/.test(h) || h.startsWith('https://fonts.googleapis.com/'), h); });
    assert.match(html[p], /family=Rozha\+One&family=Yrsa/);
  }
});

test('img/manifest.json names og + favicon; build script, README and thank-you styles exist; folder ≤ 3 MB', () => {
  const m = JSON.parse(read('img/manifest.json'));
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
  assert.ok(m.bytes_total <= 3_000_000);
  for (const [k, v] of Object.entries(m as Record<string, { files?: { bytes: number }[] }>)) for (const f of v.files ?? []) assert.ok(f.bytes <= 250_000, k);
});

test('demo route renders every page with placeholders and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/marigold-mehndi\/home/);
    if (page === 'index') assert.match($('h1.names').text(), /Anaya\s*&\s*Kabir/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /img\/ph_arch-640\.webp/);
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
  demo.thank_you = { mode: 'on', message: 'Thank you for dancing with us among the marigolds.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: the velvet lining, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for dancing with us among the marigolds/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the tassel, the sleeve, the flap, the card, forward — each on its MOTION step', () => {
  const s = designSound(id);
  assert.deepEqual(s, { music: 'evening-strings', opening: [[0, 'ribbon'], [300, 'slide'], [1250, 'paper'], [2500, 'slide'], [3150, 'chime']] });
  assert.deepEqual(s.opening.map(([ms]) => ms), [start('tassel'), start('sleeve'), start('flap'), start('rise'), start('forward')]);
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
  const m = JSON.parse(read('img/manifest.json'));
  assert.ok(Array.isArray(m.parts.used) && Array.isArray(m.parts.waiting_for_gpt));
  assert.equal(m.parts_css_rules, (parts.match(/^[^/\s][^\n]*\{/gm) ?? []).length, 'manifest counts the rules parts.css carries');
  if (!m.parts.used.length) assert.match(parts, /none yet/);
  assert.doesNotMatch(parts, /<svg|data:image/);
  // every PAKET 5 part the build takes is asked for in GPT_PROMPTS.md, with its full path
  const prompts = readFileSync(path.join(ROOT, '..', 'collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md'), 'utf8');
  for (const k of m.parts.waiting_for_gpt as string[]) {
    assert.ok(prompts.includes(`collections/33_Marigold_Mehndi/assets/gpt/parts/${k}.png`) || prompts.includes(`\`${k}.png\``), k);
  }
});
