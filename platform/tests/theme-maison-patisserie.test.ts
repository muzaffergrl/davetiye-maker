// Maison Pâtisserie (28, G166): platform theme built before its GPT parts (interim layers), demo route, thank-you mode,
// audio cues, RSVP contract, and the opening contract of docs/11 §3, §7, §11 with its own object (a pâtisserie box):
// separate moving layers, .replay, Enter, hint, slugged session keys, view transition invite-card; the display-case shelf.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { claimableTheme } from '../lib/claim/themes.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { themeOpenForClaims } from '../lib/themes/approval.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, designStyles, openingObject } from '../lib/marketing/designs.ts';
import { designSound } from '../lib/audio/catalog.ts';
import { printLayout } from '../lib/print/layouts.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'maison-patisserie';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const js = read('site.js');
const css = read('site.css');

test('Maison Pâtisserie is a catalogued platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Maison Pâtisserie');
  // off sale until approval: 'coming' (hidden) or 'preview' (in the catalogue, no checkout, no /start; main f1228e88)
  assert.ok(['coming', 'preview'].includes(MARKETING.designs.find((d) => d.id === id)?.status ?? ''));
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.equal(openingObject(DESIGN_COPY[id]), 'box');
  assert.equal(DESIGN_COPY[id].collection, '28_Maison_Patisserie');
  assert.ok(designStyles(id).includes('classic'));
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  assert.ok(printLayout(id)?.composed, 'printable invitation (G139): composed until the card parts arrive');
});

test('demo record = collection record, fictional, URLs and photos empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/28_Maison_Patisserie/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.locale, 'en-US');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  // no PAKET 2 photos yet: the demo shows the theme's neutral placeholders
  assert.deepEqual(a.media, { hero_portrait: null, memory_photos: [], venue_image: null, couple_clip: null });
  const draft = draftFromDemo(a, ['Ada', 'Ben']);
  assert.equal(draft.partners[0].full_name, null);
});

test('demo route renders every page with preview navigation; the shelf holds three photos', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/maison-patisserie\/home/);
    if (page === 'story') assert.equal($('[data-shelf] .shelf-card [data-photo]').length, 3);
    if (page === 'details') assert.equal($('.menu-case [data-menu] .pex-dish').length, 6, 'the demo menu on the display case');
  }
});

test('theme.json copy = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('box page — separate layers in order, .replay, Enter, hint, no <noscript>', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  // AGENTS şart 4: the bow loops, the knot, four ribbon arms, the lid, two tissue sheets, the box and the card move on their own
  const order = stage.find('.box').children().map((_, el) => ($(el).attr('class') || '').split(' ').pop()).get();
  assert.deepEqual(order, ['box-base', 'card', 'tissue-l', 'tissue-r', 'lid', 'ribbon-n', 'ribbon-s', 'ribbon-w', 'ribbon-e', 'bow-l', 'bow-r', 'bow-knot']);
  for (const el of stage.find('.box > img').toArray()) assert.ok(existsSync(path.join(ROOT, 'themes', id, $(el).attr('src')!)), $(el).attr('src'));
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

test('opening keyframes use the MOTION.envelope numbers; the opening takes 3.2–5 s', () => {
  const step = (k: string) => (new RegExp(`${k}: \\[(\\d+), (\\d+)\\]`).exec(js) || []).slice(1).map(Number);
  const [cs, cd] = step('closure'), [ls, ld] = step('lid'), [ts, td] = step('tissue'), [rs, rd] = step('rise');
  assert.match(css, new RegExp(`\\.bow-l\\{animation:loop-l ${cd}ms ${cs}ms`));
  assert.match(css, new RegExp(`\\.lid\\{animation:lid ${ld}ms ${ls}ms`));
  assert.match(css, new RegExp(`\\.tissue-l\\{animation:tissue-l ${td}ms ${ts}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${rs}ms`));
  const go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, String(go));
});

test('session keys per site, same in site.js and the <head> scripts; view transition', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(html.index, /replay=1/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
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

test('the display-case shelf: a focusable track, buttons, snap; reduced motion = a simple list', () => {
  const $ = cheerio.load(html.story);
  const track = $('[data-shelf]');
  assert.equal(track.attr('tabindex'), '0');
  assert.ok(track.attr('aria-label'));
  assert.equal($('[data-shelf-prev]').length, 1);
  assert.equal($('[data-shelf-next]').length, 1);
  assert.match(css, /\.shelf-track\{[^}]*scroll-snap-type:x mandatory/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /pointerdown/);
  const reduced = css.slice(css.indexOf('@media(prefers-reduced-motion:reduce)'));
  assert.match(reduced, /\.shelf-track\{display:grid/);
  assert.match(reduced, /\.shelf-plank,\.shelf-controls\{display:none\}/);
});

test('RSVP chips and sugar pearls: macaron colours, a GPT sprite, none with reduced motion', () => {
  assert.match(css, /\.choice label\{[^}]*border-radius:999px/);
  assert.match(js, /accent_1-200\.webp/);
  assert.match(js, /if \(st === 'success'\) shower\('closing'\)/);
  assert.match(js, /function shower\(moment\) \{\n\s*if \(reduce/);
});

test('K21 — the countdown is plain numerals, no CSS frame; no drawn shapes in the templates', () => {
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  for (const p of PAGES) assert.doesNotMatch(html[p], /<svg|<canvas/i, p);
});

test('the RSVP question label is its own span ("(optional)" goes beside it)', () => {
  const $ = cheerio.load(html.rsvp);
  const legend = $('[data-repeat="rsvp.questions"] legend');
  assert.equal(legend.attr('data-field'), undefined);
  assert.equal(legend.find('span[data-field=".label"]').length, 1);
});

test('img/manifest.json names og + favicon and the interim sources; files exist', () => {
  const m = JSON.parse(read('img/manifest.json'));
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
  assert.ok(m.stage && m.stage.card && m.stage.layers.bow_knot, 'stage geometry');
  assert.ok(m.bytes_total < 3_000_000);
  assert.deepEqual(m.checks.green, {});
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for the sweetest day.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'without a thank-you photo: the satin bow');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for the sweetest day/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds start with steps of MOTION.envelope', () => {
  assert.deepEqual(designSound(id), { music: 'garden-waltz', opening: [[180, 'ribbon'], [1100, 'paper'], [1850, 'paper'], [2500, 'slide'], [3200, 'chime']] });
});

test('RSVP keeps the shared form contract', async () => {
  const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + '/rsvp'), id, 'rsvp');
  const $ = cheerio.load(await response.text());
  assert.equal($('script[src="/rsvp/form.js"][defer]').length, 1);
  assert.equal($('form[data-rsvp-form][method="post"]:not([action])').length, 1);
  for (const st of ['success', 'closed', 'error', 'preview']) assert.equal($(`[data-rsvp-state="${st}"][hidden]`).length, 1, st);
  for (const f of ['name', 'email', 'attending', 'guests', 'message']) assert.equal($(`[data-rsvp-error-for="${f}"]`).length, 1, f);
  assert.equal($('template[data-rsvp-party]').length, 1);
  assert.equal($('[data-rsvp-question] .q-options label').length, 3, 'the demo meal question as chips');
  assert.equal($('a[href="#reply"]').length, 1);
  assert.equal($('[name="website"]').length, 0);
});

test('G167 drop-in: GPT parts keep the file names the pages ask for; PAKET 6 prompts match the print boxes', () => {
  const build = read('build_images.py');
  // a GPT piece narrower than the widest file a page names is scaled to it (tb.webp would otherwise name it by its width)
  assert.match(build, /at_width\(shelf\.crop\([^\n]*1200\)/);
  assert.match(build, /at_width\(pearl\.crop\(pb\), 200\)/);
  assert.match(build, /"bow", \[240, 480\]/);
  for (const n of ['ribbon_cross', 'bow_left', 'bow_right', 'bow_knot']) assert.match(build, new RegExp(`gpt\\("${n}", (canvas=)?True\\)`), n);
  const prompts = readFileSync(path.join(ROOT, '..', 'collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md'), 'utf8');
  const saved = [...prompts.matchAll(/\*\*Kaydet:\*\*\s*`([^`]+)`/g)].map((m) => m[1]);
  assert.ok(!saved.some((f) => /decor_/.test(f)), 'decor parts are deferred (not read by the build)');
  assert.deepEqual(saved.filter((f) => f.includes('/print/')).map((f) => path.basename(f)), ['invitation_front.png', 'invitation_back.png']);
  const l = printLayout(id)!;
  assert.deepEqual([l.front, l.back], [[27, 13, 16, 13], [21, 12, 10, 12]], 'the boxes the PAKET 6 prompts keep empty');
});

test('G167 keyboard: focus clears the bottom nav, chips carry the ring, the shelf is a tab stop only when it slides', () => {
  assert.match(css, /html\{[^}]*scroll-padding:16px 0 calc\(var\(--nav-h\)/);
  assert.match(css, /\.choice label:has\(input:focus-visible\)\{outline:2px solid/);
  assert.match(js, /track\.tabIndex = !reduce && track\.scrollWidth > track\.clientWidth \+ 1 \? 0 : -1/);
});
