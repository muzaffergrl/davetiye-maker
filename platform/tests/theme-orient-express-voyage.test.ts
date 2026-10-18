// Orient Express Voyage (25, G163, docs/24): platform theme built before its GPT parts — catalogue entry ("coming"),
// demo record, editable texts, the ticket-wallet opening (separate pieces, slugged session keys, view transition), the
// motion signature (route line over the map, stations, swinging tag, carriage-window scenery, boarding stamp), K21,
// thank-you mode, audio cues, RSVP contract, print layout.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { claimableTheme } from '../lib/claim/themes.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { DEMO_CITY_PINS } from '../lib/claim/demo-map.ts';
import { themeOpenForClaims } from '../lib/themes/approval.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, designStyles, openingObject } from '../lib/marketing/designs.ts';
import { designSound } from '../lib/audio/catalog.ts';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';
import { manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'orient-express-voyage';
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'themes', id);
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(DIR, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');

test('Orient Express is a catalogued platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Orient Express Voyage');
  // off sale until approval: 'coming' (hidden) or 'preview' (in the catalogue, no checkout, no /start; main f1228e88)
  assert.ok(['coming', 'preview'].includes(MARKETING.designs.find((d) => d.id === id)?.status ?? ''));
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.equal(openingObject(DESIGN_COPY[id]), 'wallet');
  assert.equal(DESIGN_COPY[id].collection, '25_Orient_Express_Voyage');
  assert.ok(designStyles(id).includes('classic'));
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '25_Orient_Express_Voyage');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('demo record = collection record, fictional, URLs empty, no bundled photos yet', async () => {
  const a = JSON.parse(await readFile(path.join(DIR, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/25_Orient_Express_Voyage/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Amelia & Rafael');
  assert.equal(a.locale, 'en-US');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
});

test('theme.json copy = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('ticket wallet: separate pieces, .replay, Board, hint, no <noscript>, speculation rule', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  // strap halves, cover (front + inside), inside panel, pocket lip and ticket are their own layers (AGENTS şart 4)
  for (const sel of ['.strap-l', '.strap-r', '.w-cover .w-cover-front', '.w-cover .w-cover-in', '.w-inside', '.w-pocket', '.wallet .ticket']) {
    assert.equal(stage.find(sel).length, 1, sel);
  }
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
  // each step of MOTION.envelope has its keyframes at the same start (site.css ".is-opening …")
  for (const [sel, delay] of [['strap-r', '0?'], ['w-cover', '600ms'], ['wallet>\\.ticket', '1500ms']] as const) {
    assert.match(css, new RegExp(`\\.is-opening \\.${sel}\\{animation:[a-z-]+ \\d+ms${delay === '0?' ? '' : ' ' + delay}`), sel);
  }
  assert.match(js, /open: \[600, 900\]/);
  assert.match(js, /rise: \[1500, 1100\]/);
  assert.match(js, /forward: \[2600, 400\]/);
});

test('session keys per site, view transition invite-card, home ticket visible on arrival', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.hero-ticket\{[^}]*view-transition-name:invite-card/);
  assert.match(css, /\.from-envelope [^{]*\{opacity:1;transform:none;transition:none\}/);
});

test('scenes, replay links, countdown target, photo slots + ph_ placeholders on disk', () => {
  for (const p of PAGES) if (p !== 'index') assert.ok(cheerio.load(html[p])('[data-scene]').length > 0, `${p}: [data-scene]`);
  assert.equal(cheerio.load(html.home)('a[href="index.html?replay=1"]').length, 1);
  assert.equal(cheerio.load(html.rsvp)('a[href="index.html?replay=1"]').length, 1);
  assert.match(js, /box\.dataset\.targetUtc = /);
  assert.match(js, /root\.dataset\.js = 'ready'/);
  const slots = new Set<string>();
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    $('[data-slot]').each((_, el) => { slots.add($(el).attr('data-slot')!); });
    $('img').each((_, el) => {
      const src = $(el).attr('src')!;
      if (src.startsWith('img/')) assert.ok(existsSync(path.join(DIR, src)), `${p}: ${src}`);
      if ($(el).attr('data-photo')) assert.match(src, /^img\/ph_/, `${p}: ${src}`);
    });
  }
  assert.deepEqual([...slots].sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('motion signature: route line over the map (scroll-driven + JS fallback), stations, tag, scenery, stamp', () => {
  for (const p of ['home', 'details'] as const) {
    const $ = cheerio.load(html[p]);
    const fig = $('[data-route]');
    assert.equal(fig.length, 1, p);
    assert.equal(fig.find('img[src^="img/map-"]').length, 1, `${p}: the GPT map`);
    assert.equal(fig.find('svg[aria-hidden="true"] path.route-line').length, 1, `${p}: the route is a UI path`);
    assert.match(html[p], /<path class="route-line" pathLength="1" d="/, `${p}: drawn by dash offset 1 → 0`);
  }
  assert.equal(cheerio.load(html.details)('li[data-repeat="schedule"][data-scene="details-station"]').length, 1, 'each station is its own scene');
  assert.match(css, /animation-timeline:--trip/);
  assert.match(css, /stroke-dashoffset:calc\(1 - var\(--route,0\)\)/);
  assert.match(js, /CSS\.supports\('animation-timeline: view\(\)'\)/);
  assert.match(js, /setProperty\('--route'/);
  assert.equal(cheerio.load(html.home)('[data-swing] img[src^="img/tag-"]').length, 1);
  assert.match(css, /\.tag\.is-swinging\{animation:swing/);
  assert.equal(cheerio.load(html.story)('[data-scenery] .glass[data-slot]').length, 3);
  assert.match(css, /animation-timeline:--pane/);
  assert.equal(cheerio.load(html.rsvp)('.pass img.stamp[src^="img/stamp-"]').length, 1);
  assert.match(css, /html\[data-rsvp-replied\] \.stamp\{visibility:visible;animation:stamp-press/);
  // reduced motion: the route is drawn, the scenery and the stamp hold still
  const reduced = css.slice(css.indexOf('@media(prefers-reduced-motion:reduce)'));
  assert.match(reduced, /\.route-line\{animation:none!important;stroke-dashoffset:0!important\}/);
  assert.match(reduced, /\.glass>img\{animation:none!important;transform:none!important\}/);
});

test('K21: no drawn decor — no inline SVG but the route path, plain countdown, no CSS frames round content', () => {
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    $('svg').each((_, el) => {
      assert.ok($(el).hasClass('route'), `${p}: only the route svg`);
      assert.deepEqual($(el).children().toArray().map((c) => (c as { name?: string }).name), ['path'], `${p}: one path`);
    });
  }
  for (const rule of css.match(/\.cd-[^{]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  assert.doesNotMatch(css, /radial-gradient\([^)]*(?:repeating)|repeating-(?:linear|radial)-gradient/);
});

test('the build: interim pieces listed, theme folder within budget, og + favicon', () => {
  const manifest = JSON.parse(read('img/manifest.json'));
  assert.ok(Array.isArray(manifest.interim));
  assert.ok(manifest.bytes_total < 3_000_000);
  assert.equal(manifest.og.file, 'og-1200x630.jpg');
  assert.ok(existsSync(path.join(DIR, 'img/og-1200x630.jpg')));
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.deepEqual(manifest.stage.box, [192, 288, 640, 960]);
});

test('G167: the build writes the measured geometry into site.css (stage block = manifest), the pieces read it', () => {
  const m = JSON.parse(read('img/manifest.json'));
  const block = css.match(/\/\* stage:begin[\s\S]*?stage:end \*\//)?.[0] ?? '';
  const v = (name: string) => Number(block.match(new RegExp(`--${name}:(-?[\\d.]+)`))?.[1]);
  const [sx, sy, sw, sh] = m.stage.strap.box_pct;
  assert.deepEqual([v('strap-x'), v('strap-y'), v('strap-w'), v('strap-h'), v('buckle')], [sx, sy, sw, sh, m.stage.strap.buckle_cut]);
  assert.deepEqual([v('tk-x'), v('tk-y'), v('tk-w'), v('tk-h')], m.stage.ticket.box_pct);
  assert.deepEqual([v('tw-x'), v('tw-y'), v('tw-w'), v('tw-h')], m.stage.ticket.window_pct);
  assert.deepEqual([v('glass-x'), v('glass-y'), v('glass-w'), v('glass-h'), v('win-aspect')], [...m.window.glass_pct, m.window.aspect]);
  for (const [sel, prop] of [['.strap-l', '--strap-x'], ['.strap-r', '--buckle'], ['.wallet>.ticket', '--tk-h'], ['.ticket-photo', '--tw-w'],
    ['.glass', '--glass-w'], ['.carriage-window', '--win-aspect']]) {
    const rule = css.replace(block, '').match(new RegExp(`(^|\\n)${sel.replace(/[.>]/g, (c) => '\\' + c)}\\{[^}]*\\}`))?.[0] ?? '';
    assert.match(rule, new RegExp(`var\\(${prop}\\)`), `${sel} reads ${prop}`);
  }
});

test('G167: long names never leave the closed screen or the ticket; the details route follows the stations', () => {
  assert.match(js, /function fitStage\(\)/);
  assert.match(js, /function fitTicket\(\)/);
  assert.match(css, /\.ticket-names\{font:400 max\(8px,calc\(10\.5cqw \* var\(--fit,1\)\)\)/);
  assert.match(css, /\.scroll-tl \.itinerary \.stations\{view-timeline:--stops block\}/);
  assert.match(css, /animation-timeline:--stops;animation-range:cover 20vh cover calc\(100% - 55vh\)/);
  assert.match(js, /stops: \[0\.8, 0\.55\]/);
});

test('demo route renders every page with preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/orient-express-voyage\/home/);
    if (page === 'details') assert.equal($('.stations li').length, 5);
  }
});

test('thank-you mode closes RSVP, keeps the story and the ticket carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for travelling with us.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.ticket [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.ticket [data-photo="hero_portrait"]').length, 0);
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for travelling with us/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds start with steps of MOTION.envelope', () => {
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[0, 'clasp'], [600, 'page'], [1500, 'slide'], [2600, 'chime']] });
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
  assert.equal(legend.attr('data-field'), undefined);
  assert.equal(legend.find('[data-field]').length, 1);
  assert.equal($('a[href="#reply"]').length, 1);
  assert.equal($('#reply.pass').length, 1);
});
