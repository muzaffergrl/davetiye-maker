// Velvet Jewel Box (23, G161): platform theme (status coming), demo route, thank-you mode, audio cues, RSVP contract, the
// box opening contract (separate moving pieces, docs/11 §7.1, §11), the cylinder carousel, editable texts, K21.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { claimableTheme } from '../lib/claim/themes.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { DEMO_CITY_PINS } from '../lib/claim/demo-map.ts';
import { themeOpenForClaims } from '../lib/themes/approval.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, designStyles, openingObject } from '../lib/marketing/designs.ts';
import { designSound } from '../lib/audio/catalog.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'velvet-jewel-box';
const ROOT = path.resolve(import.meta.dirname, '..');

test('Velvet Jewel Box is a catalogued platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Velvet Jewel Box');
  // off sale until approval: 'coming' (hidden) or 'preview' (in the catalogue, no checkout, no /start; main f1228e88)
  assert.ok(['coming', 'preview'].includes(MARKETING.designs.find((d) => d.id === id)?.status ?? ''));
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.equal(openingObject(DESIGN_COPY[id]), 'box');
  assert.equal(DESIGN_COPY[id].collection, '23_Velvet_Jewel_Box');
  assert.ok(designStyles(id).includes('classic'));
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('demo record = collection record, fictional, URLs empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/23_Velvet_Jewel_Box/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
});

test('demo route renders every page with placeholders (no sample photos yet) and preview navigation', async () => {
  for (const page of ['index', 'home', 'story', 'details', 'rsvp']) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/velvet-jewel-box\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /\/img\/ph_portrait-640\.webp/);
    if (page === 'story') assert.equal($('[data-carousel] .gem').length, 3);
  }
});

test('the demo has no photos yet (PAKET 2 pending); a buyer draft starts empty', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.deepEqual(theme.demo.media, { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null });
  const draft = draftFromDemo(theme.demo, ['Ada', 'Ben']);
  assert.deepEqual(draft.media, { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null });
  assert.equal(draft.partners[0].full_name, null);
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for a night of velvet and champagne.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a night of velvet and champagne/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds start with steps of MOTION.envelope', () => {
  assert.deepEqual(designSound(id), { music: 'music-box', opening: [[0, 'ribbon'], [650, 'clasp'], [1900, 'slide'], [3100, 'chime']] });
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

const ROOT_THEME = path.join(ROOT, 'themes', id);
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const html = Object.fromEntries(PAGES.map((p) => [p, readFileSync(path.join(ROOT_THEME, `${p}.html`), 'utf8')])) as Record<(typeof PAGES)[number], string>;
const js = readFileSync(path.join(ROOT_THEME, 'site.js'), 'utf8');
const css = readFileSync(path.join(ROOT_THEME, 'site.css'), 'utf8');
const images = JSON.parse(readFileSync(path.join(ROOT_THEME, 'img/manifest.json'), 'utf8'));

test('theme.json copy = templates, no unmarked visible text', () => {
  const manifest = JSON.parse(readFileSync(path.join(ROOT_THEME, 'theme.json'), 'utf8'));
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(manifest.copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('the box page: bow, lid, inner lid, cushion, base and card are separate layers; replay, Enter, hint', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.box-closure', '.box-lid', '.box-inner', '.box-well', '.box-base', '.box .card']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal($('.replay').length, 1);
  assert.equal($('a[data-enter][href="home.html"]').length, 1);
  assert.equal($('a[data-skip][href="home.html"]').length, 1);
  assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
  assert.equal($('noscript').length, 0);
  assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
  assert.equal(stage.find('[data-slot="hero_portrait"] img[data-photo="hero_portrait"]').length, 1);
  assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
  // every piece's place is the build's measurement (img/manifest.json stage)
  for (const [piece, sel] of [['lid', '.box-lid'], ['base', '.box-base'], ['inner', '.box-inner'], ['well', '.box-well'], ['closure', '.box-closure']] as const) {
    const [l, t, w, h] = images.stage[piece].box_pct;
    const rule = new RegExp(`\\${sel}[^{]*\\{left:${l}%;top:${t}%;width:${w}%;height:${h}%`);
    assert.match(css, rule, piece);
  }
  assert.ok(css.includes(`translateY(${images.stage.card.rise_pct}%)`), 'card rise = manifest stage.card.rise_pct');
  // G167: the whole stage block is written by build_images.py from the manifest (GPT parts drop in without a hand copy)
  const st = images.stage;
  assert.ok(css.includes(`/* stage:begin`) && css.includes('/* stage:end */'), 'generated stage block');
  assert.ok(css.includes(`aspect-ratio:${st.box[2]}/${st.box[3]}`), 'stage aspect = manifest stage.box');
  const [cl, ct, cw, ch] = st.card.box_pct;
  assert.ok(css.includes(`.box>.card{left:${cl}%;top:${ct}%;width:${cw}%;height:${ch}%}`), 'card = manifest stage.card');
  const [wl, wt, ww, wh] = st.card.window_pct;
  assert.ok(css.includes(`.card-photo{left:${wl}%;top:${wt}%;width:${ww}%;height:${wh}%}`), 'card photo = the card window');
  assert.ok(css.includes(`translateY(${st.lid.drop_pct}%) perspective`), 'lid drop = manifest stage.lid.drop_pct');
  assert.ok(css.includes(`translateY(${st.card.forward_pct}%) scale(1.1)`), 'card forward = manifest stage.card.forward_pct');
  // output names never depend on the source size (GPT parts of any size give the files the pages name)
  for (const [piece, sizes] of Object.entries({ box_lid: [440, 732], box_base: [440, 716], box_inner: [440, 680], box_well: [440, 704], closure: [160, 236], card_paper: [480, 860] })) {
    assert.deepEqual(images[piece].files.map((f: { w: number }) => f.w), sizes, piece);
  }
});

test('MOTION.envelope (the box) = the CSS keyframe timings; tap → home 3.2–5 s', () => {
  const steps: Record<string, string> = { closure: 'box-closure', lid: 'box-lid', inner: 'box-inner', sheen: 'box-sheen' };
  for (const [k, cls] of Object.entries(steps)) {
    const m = new RegExp(`${k}: \\[(\\d+), (\\d+)\\]`).exec(js)!;
    const [start, dur] = [m[1], m[2]];
    const rule = new RegExp(`\\.is-opening \\.${cls}\\{animation:[a-z-]+ ${dur}ms${start === '0' ? '' : ` ${start}ms`}`);
    assert.match(css, rule, k);
  }
  const go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, String(go));
});

test('session keys per site, same in site.js and the <head> scripts; view transition', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope [^{]*\{opacity:1;transform:none;transition:none\}/);
  // the page change is this design's own (a masked satin wipe), not the shared cross-fade
  assert.match(css, /::view-transition-new\(root\)\{animation:satin-in/);
});

test('scenes, replay links, countdown target, photo slots and placeholders', () => {
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
      assert.ok(existsSync(path.join(ROOT_THEME, src)), src);
    });
  }
  assert.deepEqual([...slots].sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('story: the carousel works from the keyboard and buttons, and falls back to a slider (reduced motion, no JS)', () => {
  const $ = cheerio.load(html.story);
  assert.equal($('[data-carousel][tabindex="0"]').length, 1);
  assert.equal($('[data-carousel-prev][aria-label]').length, 1);
  assert.equal($('[data-carousel-next][aria-label]').length, 1);
  for (const k of ['ArrowLeft', 'ArrowRight', 'pointerdown', 'pointerup', "classList.add('is-3d')"]) assert.ok(js.includes(k), k);
  assert.match(js, /if \(reduce \|\| n < 2\)/);
  assert.match(css, /\.vitrine\{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory/);
});

test('K21: countdown plain numerals; no SVG, no CSS-drawn shapes; the closure is a GPT part', () => {
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  for (const p of PAGES) assert.doesNotMatch(html[p], /<svg/i, p);
  assert.doesNotMatch(css, /border-radius:50%[^}]*background:(?!transparent)/);
  assert.ok(existsSync(path.join(ROOT_THEME, 'img', 'closure-160.webp')));
});

test('img/manifest.json names og + favicon; a printable invitation layout whose sources exist', () => {
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT_THEME, 'img', images[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT_THEME, f)), f);
  const layout = PRINT_LAYOUTS[id];
  assert.ok(layout?.composed);
  for (const src of Object.values(layout.sources)) assert.ok(existsSync(path.join(ROOT, '..', typeof src === 'string' ? src : src.path)));
});
