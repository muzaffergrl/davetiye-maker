// Sky Lantern Festival (31, G170): platform theme built before its GPT parts — catalogued but off sale, demo route,
// separate moving pieces of the lantern lift-off, session keys, view transition, editable texts, thank-you mode, audio
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

const id = 'sky-lantern-festival';
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'themes', id);
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(DIR, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');

test('Sky Lantern Festival is a catalogued platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Sky Lantern Festival');
  // off sale until approval: 'coming' (hidden) or 'preview' (in the catalogue, no checkout, no /start; main f1228e88)
  assert.ok(['coming', 'preview'].includes(MARKETING.designs.find((d) => d.id === id)?.status ?? ''));
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.equal(openingObject(DESIGN_COPY[id]), 'lantern'); // "Button after the lantern opens" in the panel
  assert.equal(DESIGN_COPY[id].collection, '31_Sky_Lantern_Festival');
  assert.ok(designStyles(id).includes('classic'));
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  // a demo city no other design uses
  const others = Object.entries(DEMO_CITY_PINS).filter(([k]) => k !== id).map(([, p]) => `${p.lat},${p.lng}`);
  assert.ok(!others.includes(`${DEMO_CITY_PINS[id].lat},${DEMO_CITY_PINS[id].lng}`));
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('demo record = collection record, fictional, US date, URLs empty, no sample photos yet (PAKET 2 pending)', () => {
  const a = JSON.parse(read('content.demo.json'));
  const b = JSON.parse(readFileSync(path.join(ROOT, '..', 'collections/31_Sky_Lantern_Festival/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.locale, 'en-US');
  assert.equal(a.name_display, 'Sophie & Daniel');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.deepEqual(a.media, { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null });
});

test('demo route renders every page with preview navigation; story has three photos', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/sky-lantern-festival\/home/);
    if (page === 'story') assert.equal($('[data-gallery-open]').length, 3);
  }
});

test('every theme file the pages and site.css name is on disk; the share image and icon exist', () => {
  const refs = new Set<string>();
  for (const src of [...Object.values(html), css, js]) for (const m of src.matchAll(/img\/[a-z0-9_-]+\.(?:webp|png|jpg)/g)) refs.add(m[0]);
  assert.ok(refs.size > 10);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), r);
  for (const f of ['img/og-1200x630.jpg', 'img/favicon.png', 'img/manifest.json']) assert.ok(existsSync(path.join(DIR, f)), f);
});

test('theme.json copy = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('the lantern: separate moving pieces, .replay, Enter, hint, Skip, no <noscript>', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  // the lantern (dark + lit), its halo, the hands and the card are their own layers (AGENTS şart 4); the sky, the star
  // dust and the distant lanterns are the parallax layers behind them
  for (const sel of ['.lantern', '.lantern-dark', '.lantern-lit', '.lantern>.halo', '.hands', '.card']) assert.equal(stage.find(sel).length, 1, sel);
  for (const sel of ['.dusk-sky', '.stars', '.far-1', '.far-2', '.far-3']) assert.equal($(`.dusk ${sel}`).length, 1, sel);
  assert.equal($('.dusk').attr('aria-hidden'), 'true');
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
  // the same numbers in site.css and MOTION.envelope: kindle, hands, rise, parallax, distant lanterns, card, forward, go
  assert.match(js, /kindle: \[0, 600\]/);
  assert.match(css, /\.is-opening \.lantern-lit\{animation:kindle 600ms /);
  assert.match(js, /hands: \[700, 900\]/);
  assert.match(css, /\.is-opening \.hands\{animation:release 900ms 700ms /);
  assert.match(js, /rise: \[900, 2200\]/);
  assert.match(css, /\.is-opening \.lantern\{animation:rise 2200ms 900ms [^}]*sway 2200ms 900ms/);
  assert.match(js, /sky: \[900, 2600\]/);
  assert.match(css, /\.is-opening \.dusk-sky\{animation:sky-down 2600ms 900ms /);
  assert.match(css, /\.is-opening \.dusk>\.stars\{animation:stars-down 2600ms 900ms /);
  assert.match(js, /far: \[1000, 2400\]/);
  for (const [n, d] of [[1, 1000], [2, 1260], [3, 1520]]) assert.match(css, new RegExp(`\\.is-opening \\.far-${n}\\{animation:far-rise 2400ms ${d}ms `));
  assert.match(js, /card: \[2000, 1100\]/);
  assert.match(js, /forward: \[3200, 400\]/);
  assert.match(css, /\.is-opening \.stage \.card\{animation:card-glow 1100ms 2000ms [^}]*card-forward 400ms 3200ms /);
  assert.match(js, /go: 3700/);
  // parallax: the star dust slides further than the sky
  const by = (k: string) => Number(new RegExp(`@keyframes ${k}\\{to\\{translate:0 (\\d+)%\\}\\}`).exec(css)![1]);
  assert.ok(by('stars-down') > by('sky-down'));
});

test('session keys per site, same in site.js and the <head> scripts; view transition invite-card', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.hero-card\{[^}]*view-transition-name:invite-card/);
  assert.match(css, /\.stage \.card\{[^}]*view-transition-name:none/);
  for (const p of PAGES) assert.match(html[p], /<script src="site\.js" defer><\/script>/, p);
});

test('motion signature: photos kindled by rising lanterns, programme lanterns light in turn, lanterns drift on scroll; reduced motion stops it', () => {
  // three photos on home and story, each with its own riser lantern and the "kindle" light
  for (const p of ['home', 'story'] as const) {
    const $ = cheerio.load(html[p]);
    assert.equal($('.lit [data-a="kindle"]').length, 3, p);
    assert.equal($('.lit .riser[aria-hidden="true"] img').length, 3, p);
  }
  assert.equal(cheerio.load(html.details)('.venue-photo[data-a="kindle"]').length, 1);
  assert.match(css, /@property --r\{syntax:'<percentage>'/);
  assert.match(css, /\.js \[data-a=kindle\]>img\{-webkit-mask:radial-gradient/);
  assert.match(css, /@keyframes riser/);
  // the programme: a lantern per row that kindles as its row comes in
  const $d = cheerio.load(html.details);
  assert.equal($d('li[data-repeat="schedule"][data-step="row"] img.mark').length, 1);
  assert.match(js, /'details-card': \[\['programme', 0\], \['row', 260\]/);
  // a few drifting lanterns, scroll-driven where supported
  for (const p of ['home', 'story'] as const) {
    const drift = cheerio.load(html[p])('.drift');
    assert.equal(drift.attr('aria-hidden'), 'true', p);
    assert.ok(drift.find('img').length >= 2 && drift.find('img').length <= 4, `${p}: few lanterns`);
  }
  assert.match(css, /animation-timeline:scroll\(root\)/);
  assert.match(css, /@keyframes breathe/);
  const rm = /@media\(prefers-reduced-motion:reduce\)\{[^]*?\n\}/.exec(css)![0];
  assert.match(rm, /\.halo,\.lantern\{animation:none!important\}/);
  assert.match(rm, /\.drift,\.accent-layer,\.riser\{display:none\}/);
  assert.match(rm, /\[data-a=kindle\]>img\{-webkit-mask:none!important;mask:none!important\}/);
});

test('K21: no drawn frames — no border, outline or box-shadow on the countdown or the content blocks', () => {
  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const sel = m[1];
    if (/\.cd-|\.schedule|\.card-copy|\.hero-copy|\.invitation|\.dusk-band|\.date-block|\.lit-photo/.test(sel)) {
      assert.doesNotMatch(m[2], /(^|;)\s*(border|outline|box-shadow)\s*:/, sel.trim());
    }
  }
  assert.doesNotMatch(css + Object.values(html).join(''), /<svg|border-radius:50%|clip-path/);
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: read(theme.manifest.pages[page]!), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for an evening under the lanterns.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a distant lantern of the design, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening under the lanterns/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds start with steps of MOTION.envelope', () => {
  assert.deepEqual(designSound(id), { music: 'first-light', opening: [[0, 'tap'], [700, 'paper'], [900, 'whoosh'], [2000, 'slide'], [3200, 'chime']] });
});

test('RSVP keeps the shared form contract; a sent reply releases one lantern (off with reduced motion)', async () => {
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
  assert.match(js, /if \(st === 'success'\) releaseLantern\(\)/);
  assert.match(js, /if \(reduce \|\| \$\('\.accent-layer'\)\) return;/);
  assert.match(css, /html\[data-rsvp-replied\] \.rsvp-page>\.halo\{animation:reply-glow/);
});

test('the printable invitation is composed from GPT pixels, and its parts are built', () => {
  const layout = PRINT_LAYOUTS[id];
  assert.ok(layout?.composed);
  assert.equal(layout.collection, '31_Sky_Lantern_Festival');
  for (const name of Object.keys(layout.sources)) assert.ok(existsSync(path.join(ROOT, 'public', 'print', id, `${name}.webp`)), name);
  assert.ok(layout.composed.front.images.length >= 2);
});

// The GPT branch of build_images.py writes the measured numbers to img/manifest.json AND to the generated "@gpt-layers"
// block at the end of site.css — they must agree, and every file the block names must exist.
test('site.css @gpt-layers = img/manifest.json (card window, frames, GPT-only layers)', () => {
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
  for (const [name, sel] of [['frame_paper', '.lit-photo>img'], ['frame_landscape', '.venue-photo>img']] as const) {
    const l = layers[name];
    if (l?.window_pct) assert.ok(block.includes(`${sel}{position:absolute;${at(l.window_pct)}}`), name);
  }
  // GPT-only layers are in the pages but hidden until the block switches them on; never a drawn shape (K21)
  for (const [p, sel] of [['index', '.stage>.hands'], ['index', '.dusk>.stars'], ['home', '.dusk-hero>.stars'], ['home', '.divider'], ['story', '.lit-photo>.mat'], ['details', '.venue-photo>.frame']] as const) {
    assert.ok(cheerio.load(html[p])(sel).length >= 1, `${p} ${sel}`);
  }
  assert.match(css, /\.hands,\.stars,\.divider,\.lit-photo>\.mat,\.venue-photo>\.frame\{display:none;/);
  // the halo is centred on the lantern: manifest stage.lantern_box_pct (canvas %) ↔ .stage .halo{top:47%}
  const [, y0, , y1] = manifest.stage.lantern_box_pct as number[];
  assert.ok(Math.abs((y0 + y1) / 2 - 47) <= 2, 'halo centre = lantern centre');
});
