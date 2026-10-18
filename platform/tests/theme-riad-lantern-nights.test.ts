// Riad Lantern Nights (27, G165): platform theme built before its GPT parts — catalogued but off sale, demo route,
// separate moving pieces of the door opening, session keys, view transition, editable texts, thank-you mode, audio
// cues, RSVP contract, K21 static checks and the printable invitation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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

const id = 'riad-lantern-nights';
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'themes', id);
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(DIR, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');

test('Riad is a catalogued platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Riad Lantern Nights');
  // off sale until approval: 'coming' (hidden) or 'preview' (in the catalogue, no checkout, no /start; main f1228e88)
  assert.ok(['coming', 'preview'].includes(MARKETING.designs.find((d) => d.id === id)?.status ?? ''));
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.equal(openingObject(DESIGN_COPY[id]), 'door'); // "Button after the door opens" in the panel
  assert.equal(DESIGN_COPY[id].collection, '27_Riad_Lantern_Nights');
  assert.ok(designStyles(id).includes('classic'));
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('demo record = collection record, fictional, URLs empty, no sample photos yet (PAKET 2 pending)', () => {
  const a = JSON.parse(read('content.demo.json'));
  const b = JSON.parse(readFileSync(path.join(ROOT, '..', 'collections/27_Riad_Lantern_Nights/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.locale, 'en-US');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.deepEqual(a.media, { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null });
});

test('demo route renders every page with preview navigation; story has three windows', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/riad-lantern-nights\/home/);
    if (page === 'story') assert.equal($('[data-gallery-open]').length, 3);
  }
});

test('every theme file the pages and site.css name is on disk; the share image and icon exist', () => {
  const refs = new Set<string>();
  for (const src of [...Object.values(html), css]) for (const m of src.matchAll(/img\/[a-z0-9_-]+\.(?:webp|png|jpg)/g)) refs.add(m[0]);
  assert.ok(refs.size > 10);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), r);
  for (const f of ['img/og-1200x630.jpg', 'img/favicon.png', 'img/manifest.json']) assert.ok(existsSync(path.join(DIR, f)), f);
});

test('theme.json copy = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('the doors: separate moving pieces, .replay, Enter, hint, Skip, no <noscript>', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  // the two leaves, the courtyard, the light and the card are their own layers (AGENTS şart 4, docs/11 §7.4)
  for (const sel of ['.door-l', '.door-r', '.court', '.pour', '.riad .card', '.lantern-glow']) assert.equal(stage.find(sel).length, 1, sel);
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
  // the leaves swing in on their outer hinges, the right one a beat after the left — the same numbers as MOTION
  assert.match(css, /\.door-l\{left:0;transform-origin:0 50%\}/);
  assert.match(css, /\.door-r\{right:0;transform-origin:100% 50%\}/);
  assert.match(css, /\.is-opening \.door-l\{animation:swing-l 900ms 300ms /);
  assert.match(css, /\.is-opening \.door-r\{animation:swing-r 900ms 420ms /);
  assert.match(js, /doors: \[300, 900\]/);
  assert.match(js, /doorR: \[420, 900\]/);
  assert.match(js, /go: 3550/);
});

test('session keys per site, same in site.js and the <head> scripts; view transition invite-card', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.hero-card\{[^}]*view-transition-name:invite-card/);
  assert.match(css, /\.riad>\.card\{[^}]*view-transition-name:none/);
  for (const p of PAGES) assert.match(html[p], /<script src="site\.js" defer><\/script>/, p);
});

test('motion signature: zellige rows lay tile by tile, windows are lit by a beam, the lantern flickers; reduced motion stops it', () => {
  for (const p of ['home', 'story', 'details'] as const) {
    const $ = cheerio.load(html[p]);
    const row = $('.zellige[data-scene]');
    assert.equal(row.length, 1, p);
    assert.ok(row.find('img[data-step="tile"][data-a="tile"]').length >= 5, p);
    assert.equal(row.attr('aria-hidden'), 'true');
  }
  assert.equal(cheerio.load(html.story)('figure[data-a="light"] .window').length, 3);
  assert.match(css, /@keyframes flicker/);
  assert.match(css, /@keyframes beam/);
  assert.match(css, /animation-timeline:view\(\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{[^]*\.lantern-glow(,\.lantern)?\{animation:none!important\}/);
});

test('K21: no drawn frames — no border, outline or box-shadow on the countdown or the content blocks', () => {
  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const sel = m[1];
    if (/\.cd-|\.schedule|\.card-copy|\.hero-copy|\.invitation|\.court-band|\.date-block/.test(sel)) {
      assert.doesNotMatch(m[2], /(^|;)\s*(border|outline|box-shadow)\s*:/, sel.trim());
    }
  }
  assert.doesNotMatch(css + Object.values(html).join(''), /<svg|border-radius:50%/);
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: read(theme.manifest.pages[page]!), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for a night in the riad.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a zellige tile of the design, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a night in the riad/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds start with steps of MOTION.envelope', () => {
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[0, 'tap'], [300, 'whoosh'], [1900, 'slide'], [3100, 'chime']] });
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
});

test('the printable invitation is composed from GPT pixels, and its parts are built', () => {
  const layout = PRINT_LAYOUTS[id];
  assert.ok(layout?.composed);
  assert.equal(layout.collection, '27_Riad_Lantern_Nights');
  for (const name of Object.keys(layout.sources)) assert.ok(existsSync(path.join(ROOT, 'public', 'print', id, `${name}.webp`)), name);
  assert.ok(layout.composed.front.images.length >= 5);
});

// G167: the GPT branch of build_images.py writes the measured numbers to img/manifest.json AND to the generated
// "@gpt-layers" block at the end of site.css — they must agree, and every file the block names must exist.
test('G167: site.css @gpt-layers = img/manifest.json (card window, frames, GPT-only layers); doorway = DOORWAY_EXT', () => {
  const manifest = JSON.parse(read('img/manifest.json'));
  const blocks = [...css.matchAll(/\/\* @gpt-layers[^]*?\/\* @end gpt-layers \*\/\n?/g)];
  assert.equal(blocks.length, 1, 'exactly one generated block');
  const block = blocks[0][0];
  assert.ok(css.trimEnd().endsWith('/* @end gpt-layers */'), 'the block is the last rule (it overrides the base layout)');
  const layers: Record<string, { file: string; window_pct?: number[]; aspect?: string }> = manifest.gpt_layers ?? {};
  const win = manifest.stage?.card?.window_pct as number[] | null | undefined;
  if (!Object.keys(layers).length && !win) assert.match(block, /no GPT layer yet/);
  for (const [name, l] of Object.entries(layers)) {
    assert.ok(block.includes(`url(img/${l.file})`), `${name} named in the block`);
    assert.ok(existsSync(path.join(DIR, 'img', l.file)), l.file);
  }
  const at = ([x, y, w, h]: number[]) => `left:${x}%;top:${y}%;width:${w}%;height:${h}%`;
  if (win) {
    assert.ok(block.includes(at(win)), 'card window');
    const [pt, ps, pb] = manifest.stage.card.pad_pct_of_width;
    assert.ok(block.includes(`padding:${pt}% ${ps}% ${pb}%`), 'card text padding');
    assert.ok(Array.isArray(manifest.card_paper.free_zone), 'theme-check free_zone of the GPT card');
  }
  for (const [name, sel] of [['frame_arch', '.window>img'], ['frame_landscape', '.venue-photo>img']] as const) {
    const l = layers[name];
    if (l?.window_pct) assert.ok(block.includes(`${sel}{position:absolute;${at(l.window_pct)}}`), name);
  }
  // the doorway cut (build_images.py DOORWAY_EXT, fractions of the opening) = its fixed place in site.css
  const ext = /DOORWAY_EXT = \(([^)]+)\)/.exec(read('build_images.py'))![1].split(',').map(Number);
  const [l, t, r, b] = ext.map((v) => Math.round(v * 100));
  assert.match(css, new RegExp(`\\.riad>\\.doorway\\{position:absolute;left:-${l}%;top:-${t}%;width:${100 + l + r}%;height:${100 + t + b}%;`));
  if (layers.doorway) assert.deepEqual((layers.doorway as any).box_pct_of_opening, [-l, -t, 100 + l + r, 100 + t + b]);
  // GPT-only layers are in the pages but hidden until the block switches them on; never a drawn shape (K21)
  for (const [p, sel] of [['index', '.riad>.doorway'], ['index', '.stage>.lantern'], ['home', '.lantern-hero>.bloom-tl'], ['home', '.divider'], ['story', '.window>.arch'], ['details', '.venue-photo>.frame'], ['rsvp', '.rsvp-page>.lantern']] as const) {
    assert.ok(cheerio.load(html[p])(sel).length >= 1, `${p} ${sel}`);
  }
  assert.match(css, /\.doorway,\.lantern,\.bloom,\.divider,\.window>\.arch,\.venue-photo>\.frame\{display:none;/);
});

test('G167: four zellige tiles at 76 + 152 px (srcset), the reply flares the lantern and (with GPT) drifts bracts', () => {
  for (const n of [1, 2, 3, 4]) for (const w of [76, 152]) assert.ok(existsSync(path.join(DIR, 'img', `tile_${n}-${w}.webp`)), `tile_${n}-${w}`);
  for (const p of ['home', 'story', 'details'] as const) {
    const imgs = cheerio.load(html[p])('.zellige img');
    imgs.each((_, el) => assert.match(String(el.attribs.srcset), /-76\.webp 76w, img\/tile_\d-152\.webp 152w/));
    assert.ok(imgs.filter((_, el) => /tile_4/.test(String(el.attribs.src))).length >= 2, p);
  }
  assert.match(css, /html\[data-rsvp-replied\] \.rsvp-page>\.lantern-glow\{animation:reply-glow/);
  assert.match(js, /if \(st === 'success'\) petals\(\)/);
  assert.match(js, /getPropertyValue\('--petal'\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{[^]*\.lantern-glow,\.lantern\{animation:none!important\}[^]*\.accent-layer\{display:none\}/);
});
