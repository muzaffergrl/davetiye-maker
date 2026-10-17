// Music Box Ballerina (32, G171): platform theme built before its GPT parts (interim layers), demo route, thank-you mode,
// audio cues, RSVP contract, and the opening contract of docs/11 §3, §7, §11 with its own object (a music box): separate
// moving layers (key, lid, mirror lid, well, ballerina, card, box front), .replay, Enter, hint, slugged session keys,
// view transition invite-card; the story mirror; the stage block of site.css = img/manifest.json (G167 drop-in).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
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
import { printLayout } from '../lib/print/layouts.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'music-box-ballerina';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const js = read('site.js');
const css = read('site.css');
const images = JSON.parse(read('img/manifest.json'));

test('Music Box Ballerina is a catalogued platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Music Box Ballerina');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'coming');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.equal(openingObject(DESIGN_COPY[id]), 'box');
  assert.equal(DESIGN_COPY[id].collection, '32_Music_Box_Ballerina');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Ballet', 'Gilda Display']);
  assert.ok(designStyles(id).includes('classic'));
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  assert.ok(printLayout(id)?.composed, 'printable invitation (G139): composed until the print grounds arrive');
  assert.deepEqual(DEMO_CITY_PINS[id], { lat: 43.0831, lng: -73.7846 }, 'demo pin: Saratoga Springs, NY');
});

test('demo record = collection record, fictional, US dates, URLs and photos empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/32_Music_Box_Ballerina/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.locale, 'en-US');
  assert.equal(a.name_display, 'Juliette & Arthur');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  // no PAKET 2 photos yet: the demo shows the theme's neutral placeholders
  assert.deepEqual(a.media, { hero_portrait: null, memory_photos: [], venue_image: null, couple_clip: null });
  assert.equal(a.audio.music, 'music-box');
  const draft = draftFromDemo(a, ['Ada', 'Ben']);
  assert.equal(draft.partners[0].full_name, null);
});

test('demo route renders every page with preview navigation; the mirror holds three photos', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/music-box-ballerina\/home/);
    if (page === 'story') assert.equal($('[data-mirror] .reflection [data-photo]').length, 3);
  }
});

test('theme.json copy = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('music box page — separate layers in order, .replay, Enter, hint, no <noscript>', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  // AGENTS şart 4: the mirror lid, the well, the ballerina, the card, the box front, the closed lid and the key move on their own
  const order = stage.find('.box').children().map((_, el) => ($(el).attr('class') || '').split(' ')[0]).get();
  assert.deepEqual(order, ['lid-up', 'interior', 'dancer', 'card', 'box-body', 'lid-closed', 'key']);
  for (const el of stage.find('.box img').toArray()) assert.ok(existsSync(path.join(ROOT, 'themes', id, $(el).attr('src')!)), $(el).attr('src'));
  // the portrait is in the lid's mirror, which turns up with the lid
  assert.equal(stage.find('.lid-up > .mirror[data-slot="hero_portrait"] img[data-photo="hero_portrait"]').length, 1);
  assert.equal(stage.find('.card [data-field="thank_you_title"]').length, 1);
  assert.equal($('.replay').length, 1);
  assert.equal($('.replay[hidden]').length, 0);
  assert.equal($('a[data-enter][href="home.html"]').length, 1);
  assert.equal($('a[data-skip][href="home.html"]').length, 1);
  assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
  assert.equal($('noscript').length, 0);
  assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
});

test('opening keyframes use the MOTION.envelope numbers; the opening takes 3.2–5 s', () => {
  const step = (k: string) => (new RegExp(`${k}: \\[(\\d+), (\\d+)\\]`).exec(js) || []).slice(1).map(Number);
  const [ks, kd] = step('closure'), [ls, ld] = step('lid'), [is, id_] = step('inner'), [ds, dd] = step('dancer');
  const [ts, td] = step('turn'), [gs, gd] = step('glint'), [rs, rd] = step('rise'), [fs, fd] = step('forward'), [us, ud] = step('tug');
  assert.match(css, new RegExp(`\\.is-opening \\.key\\{animation:key-turn ${kd}ms ${ks}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.box\\{animation:tug ${ud}ms ${us}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.lid-closed\\{animation:lid-swing ${ld}ms ${ls}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.lid-up\\{animation:mirror-up ${id_}ms ${is}ms`));
  assert.match(css, new RegExp(`dancer-rise ${dd}ms ${ds}ms [^;]*?,pirouette ${td}ms ${ts}ms steps\\(8\\)`));
  assert.match(css, new RegExp(`\\.is-opening \\.mirror \\.glass\\{animation:glint ${gd}ms ${gs}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${rs}ms`));
  assert.match(css, new RegExp(`card-forward ${fd}ms ${fs}ms`));
  const go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, String(go));
  assert.ok(go >= fs + fd, 'home after the card came forward');
});

test('the stage block of site.css is the build measurement (img/manifest.json stage)', () => {
  const st = images.stage;
  assert.ok(css.includes('/* stage:begin') && css.includes('/* stage:end */'), 'generated stage block');
  assert.ok(css.includes(`aspect-ratio:${st.window[2]}/${st.window[3]}`), 'stage aspect = manifest stage.window');
  const pct = (b: number[]) => `left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%`;
  assert.ok(css.includes(`.mirror{${pct(st.mirror.box_pct)}}`), 'mirror window');
  assert.ok(css.includes(`.dancer{${pct(st.dancer.box_pct)}}`), 'ballerina box');
  assert.ok(css.includes(`.box>.card{${pct(st.card.box_pct)}}`), 'card box');
  assert.ok(css.includes(`translateY(${st.card.rise_pct}%)`), 'card rise');
  assert.ok(css.includes(`.lid-closed{transform-origin:50% ${st.layers.lid_closed.box_pct[1]}%}`), 'lid hinge = top of the closed lid');
  const lo = st.layers.lid_open.box_pct;
  assert.ok(css.includes(`.lid-up{transform-origin:50% ${Math.round((lo[1] + lo[3]) * 1000) / 1000}%}`), 'mirror lid hinge = its foot');
  // the ballerina is a sprite of the GPT turn frames (interim: a placeholder slot turned in 2D)
  assert.equal(images.dancer_sprite.frames, 8);
  assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', images.dancer_sprite.file)));
  assert.ok(css.includes(`url(img/${images.dancer_sprite.file}) 0 0/800% 100%`));
  assert.match(css, /@keyframes pirouette\{from\{background-position:0 0\}to\{background-position:114\.2857% 0\}\}/);
});

test('session keys per site, same in site.js and the <head> scripts; the oval mirror page change', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(html.index, /replay=1/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(css, /::view-transition-new\(root\)\{animation:mirror-in [^}]*radial-gradient\(closest-side/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope [^{]*\{opacity:1;transform:none;transition:none\}/);
  for (const p of PAGES) assert.ok((html[p].match(/view-transition-name/g) || []).length === 0, `${p}: names live in site.css`);
});

test('scenes, replay links, countdown target, photo placeholders', () => {
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
    });
  }
  assert.deepEqual([...slots].sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('the story mirror: focusable glass, buttons, keys, swipe, live count; reduced motion = a plain list', () => {
  const $ = cheerio.load(html.story);
  assert.equal($('[data-mirror]').attr('tabindex'), '0');
  assert.equal($('[data-mirror-prev]').length, 1);
  assert.equal($('[data-mirror-next]').length, 1);
  assert.equal($('[data-mirror-count][aria-live="polite"]').length, 1);
  assert.match(js, /ArrowLeft: pos - 1, ArrowRight: pos \+ 1, Home: 0, End: n - 1/);
  assert.match(js, /pointerdown/);
  assert.match(js, /if \(reduce \|\| n < 2\) \{ show\.classList\.add\('is-list'\); return; \}/);
  assert.match(js, /setAttribute\('aria-disabled'/);
  assert.match(css, /\.is-list \.mirror-canvas,\.no-js \.mirror-canvas,[^{]*\{display:none\}/);
});

test('petals: GPT sprites, few, none with reduced motion; the reply sends a few and the ballerina turns once', () => {
  assert.match(js, /function petals\(moment\) \{\n\s*const P = MOTION\.petals\[moment\];\n\s*if \(!P \|\| reduce/);
  assert.match(js, /'img\/petal_' \+ \(i % 3 \+ 1\) \+ '-120\.webp'/);
  for (const i of [1, 2, 3]) assert.ok(existsSync(path.join(ROOT, 'themes', id, `img/petal_${i}-120.webp`)));
  assert.ok(/opening: \{ count: (\d+)/.exec(js)![1] <= '6');
  assert.match(js, /if \(st === 'success'\) petals\('closing'\)/);
  assert.match(css, /\.signature\.is-sent \.foot-dancer\{[^}]*animation:pirouette/);
  assert.equal(images.theme_check.particles, '.accent-layer');
});

test('K21 — the countdown is plain numerals, no CSS frame; no drawn shapes in the templates', () => {
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  for (const p of PAGES) assert.doesNotMatch(html[p], /<svg|<canvas/i, p);
});

test('img/manifest.json names og + favicon and the interim sources; files exist', () => {
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', images[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
  assert.ok(images.bytes_total < 3_000_000);
  assert.deepEqual(images.checks.green, {});
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for the loveliest day.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.mirror [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.mirror .ty-decor img').length, 1, 'without a thank-you photo: the empty glass');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for the loveliest day/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds start with steps of MOTION.envelope; the music box melody is the catalogue track', () => {
  assert.deepEqual(designSound(id), { music: 'music-box', opening: [[0, 'clasp'], [450, 'clasp'], [900, 'page'], [2300, 'chime'], [2900, 'slide'], [3900, 'chime']] });
});

test('RSVP keeps the shared form contract', async () => {
  const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + '/rsvp'), id, 'rsvp');
  const $ = cheerio.load(await response.text());
  assert.equal($('script[src="/rsvp/form.js"][defer]').length, 1);
  assert.equal($('form[data-rsvp-form][method="post"]:not([action])').length, 1);
  for (const st of ['success', 'closed', 'error', 'preview']) assert.equal($(`[data-rsvp-state="${st}"][hidden]`).length, 1, st);
  for (const f of ['name', 'email', 'attending', 'guests', 'message']) assert.equal($(`[data-rsvp-error-for="${f}"]`).length, 1, f);
  assert.equal($('template[data-rsvp-party]').length, 1);
  assert.equal($('[data-rsvp-question] .q-options label').length, 3, 'the demo meal question');
  assert.equal($('a[href="#reply"]').length, 1);
});

test('G167 drop-in: GPT parts keep the file names the pages ask for; PAKET 6 prompts match the print boxes', () => {
  const build = read('build_images.py');
  for (const n of ['lid_open', 'interior', 'box_body', 'lid_closed', 'key']) assert.match(build, new RegExp(`"${n}"`), n);
  assert.match(build, /gpt\("lid_open", canvas=True\)/);
  assert.match(build, /\("dancer_turn_a", "dancer_turn_b"\)/);
  assert.match(build, /at_width\(still, 140\), "dancer", \[140\]/);
  const prompts = readFileSync(path.join(ROOT, '..', 'collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md'), 'utf8');
  const saved = [...prompts.matchAll(/\*\*Kaydet:\*\*\s*`([^`]+)`/g)].map((m) => m[1]);
  for (const n of ['lid_open', 'interior', 'box_body', 'lid_closed', 'key', 'dancer', 'dancer_turn_a', 'dancer_turn_b', 'card_small', 'petal_1', 'bg_page', 'satin_bg', 'web_hero']) {
    assert.ok(saved.some((f) => f.endsWith(`/parts/${n}.png`)), n);
  }
  assert.deepEqual(saved.filter((f) => f.includes('/print/')).map((f) => path.basename(f)), ['invitation_front.png', 'invitation_back.png']);
  const l = printLayout(id)!;
  assert.deepEqual([l.front, l.back], [[24, 13, 14, 13], [12, 12, 20, 12]], 'the boxes the PAKET 6 prompts keep empty');
});

test('G167 keyboard: focus clears the bottom nav, chips carry the ring', () => {
  assert.match(css, /html\{[^}]*scroll-padding:16px 0 calc\(var\(--nav-h\)/);
  assert.match(css, /\.choice label:has\(input:focus-visible\)\{outline:2px solid/);
});
