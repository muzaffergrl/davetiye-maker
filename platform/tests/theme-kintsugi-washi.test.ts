// Kintsugi & Washi (26, G426): redesign of 2026-10-22 (docs/35), rebuilt on the pilot-39 structure (as the pilot G423)
// from the design's own layered GPT parts (PAKET 5R). The closed packet (K23 strict: a square tatō of indigo washi with
// gold kintsugi seams — four triangular flaps in a pinwheel, a twisted cord in a figure-eight round a mended porcelain
// button — not the V flap of 01–21), its opening (the button turns and lifts away, the cord unwinds, the stage settles
// back, the four flaps unfold one by one in pinwheel order onto their real inner faces, the card rises from the centre,
// accents drift), the packet geometry shared by the build and site.css, editable texts, scenes, the washi mats with
// measured windows and the ink-bloom reveal, demo route, thank-you mode, audio cues, RSVP contract, print layout.
// Off sale ("preview") until approval.
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

const id = 'kintsugi-washi';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');
const manifest = JSON.parse(read('img/manifest.json'));
const rule = (sel: string) => {
  const m = new RegExp(`(?:^|\\n|\\})${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\{([^}]*)\\}`).exec(css);
  assert.ok(m, `site.css ${sel}`);
  return m[1];
};
const num = (body: string, prop: string) => Number(new RegExp(`(?:^|;)${prop}:(-?[\\d.]+)%`).exec(body)?.[1]);
const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);

test('Kintsugi & Washi is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Kintsugi & Washi');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '26_Kintsugi_Washi');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Allura', 'Shippori Mincho']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '26_Kintsugi_Washi');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  assert.equal(JSON.parse(read('theme.json')).variants, undefined, 'the old palettes went with the old art');
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/26_Kintsugi_Washi/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Naomi & Kai');
  assert.equal(a.date, '2027-10-09');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Naomi', 'Kai ', 'Stillwater', 'Hood River', 'October 9', 'N&amp;K', 'N&K']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('packet — floor, card, four flaps (outside + real inside each), cord and porcelain button are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .cord', '.envelope > .porcelain']) assert.equal(stage.find(sel).length, 1, sel);
  for (const f of ['n', 'e', 's', 'w']) {
    assert.equal(stage.find(`.envelope > .flap.f-${f} > .flap-out`).length, 1, f);
    assert.equal(stage.find(`.envelope > .flap.f-${f} > .flap-in`).length, 1, f);
    // the real GPT inner face (never a plain colour) on the back of each flap, turned over its hinge
    assert.match(rule(`.f-${f}>.flap-in`), new RegExp(`transform:rotate${'ns'.includes(f) ? 'X' : 'Y'}\\(180deg\\);background-image:url\\(img/in_${f}-\\d+\\.webp\\)`));
    assert.match(rule(`.f-${f}>.flap-out`), new RegExp(`background-image:url\\(img/flap_${f}-\\d+\\.webp\\)`));
  }
  // the pile: west at the bottom, north on top (the order they open in reverse), cord and button above
  assert.deepEqual(stage.find('.envelope > .flap').toArray().map((e) => $(e).attr('class')), ['flap f-w', 'flap f-s', 'flap f-e', 'flap f-n']);
  assert.match(css, /\.flap-out,\.flap-in\{position:absolute;inset:0;backface-visibility:hidden/);
  assert.match(css, /\.flap\{z-index:2;transform-style:preserve-3d\}/);
  // not the V flap of 01–21 and no Codex envelope-v3 controller any more
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site/i);
  for (const f of ['envelope-v3.js', 'opening-design.json', 'interior.css', 'parts.css', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const [b0, bd] = step('button'), [c0, cd] = step('cord'), [s0, sd] = step('settle');
  const flaps = (['N', 'E', 'S', 'W'] as const).map((k) => step(`flap${k}`));
  const [r0, rd] = step('rise'), [l0, ld] = step('light'), [w0, wd] = step('forward');
  const acc = Number(/accents: (\d+),/.exec(js)![1]), go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(b0 <= c0 && c0 < s0 && s0 < flaps[0][0], 'the closure acts first, then the stage settles, then the flaps');
  for (let i = 1; i < 4; i++) assert.equal(flaps[i][0] - flaps[i - 1][0], 220, 'pinwheel order, 220 ms apart');
  assert.ok(flaps[3][0] < acc && acc < r0 && r0 >= flaps[3][0] + flaps[3][1] - 100 && r0 < w0 && l0 < w0 + wd);
  assert.ok(go >= w0 + wd && go <= 5500, 'home only after the card came forward, the whole opening ≤ 5.5 s');
  assert.match(css, new RegExp(`\\.is-opening \\.porcelain\\{animation:porcelain-off ${bd}ms ${b0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.cord\\{animation:cord-off ${cd}ms ${c0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope\\{animation:settle ${sd}ms ${s0}ms`));
  (['n', 'e', 's', 'w'] as const).forEach((f, i) => assert.match(css, new RegExp(`\\.is-opening \\.f-${f}\\{animation:open-${f} ${flaps[i][1]}ms ${flaps[i][0]}ms`), f));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope>\\.card::after\\{animation:sweep ${ld}ms ${l0}ms`));
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  // each flap turns on its own hinge toward the viewer and lies beyond its edge
  assert.match(css, /@keyframes open-n\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:8\}to\{transform:perspective\(900px\) rotateX\(180deg\)/);
  assert.match(css, /@keyframes open-e\{from\{transform:perspective\(900px\) rotateY\(0\);z-index:8\}to\{transform:perspective\(900px\) rotateY\(180deg\)/);
  assert.match(css, /@keyframes open-s\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:8\}to\{transform:perspective\(900px\) rotateX\(-180deg\)/);
  assert.match(css, /@keyframes open-w\{from\{transform:perspective\(900px\) rotateY\(0\);z-index:8\}to\{transform:perspective\(900px\) rotateY\(-180deg\)/);
  for (const [f, origin] of [['n', '50% 0'], ['e', '100% 50%'], ['s', '50% 100%'], ['w', '0 50%']]) assert.match(rule(`.f-${f}`), new RegExp(`transform-origin:${origin}$`), f);
  // the catalogue cover layout
  assert.equal($('.opening-heading [data-copy="envelope_kicker"]').text(), 'Together with their families');
  assert.equal($('.opening-actions .opening-date [data-field="date"]').length, 1);
  assert.equal($('.opening-actions .opening-date [data-field="venue.city"]').length, 1);
  assert.equal($('.opening-actions .tap-hint').length, 1);
  assert.equal($('.replay').length, 1);
  assert.equal($('a[data-enter][href="home.html"]').length, 1);
  assert.equal($('a[data-skip][href="home.html"]').length, 1);
  assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
  assert.equal($('noscript').length, 0);
  assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
  assert.equal(stage.find('.card [data-slot="hero_portrait"] img[data-photo="hero_portrait"]').length, 1);
  assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
  // no kanji / kana anywhere (the design's rule): only Latin text in the templates
  for (const p of PAGES) assert.doesNotMatch(html[p], /[぀-ヿ㐀-鿿]/, p);
});

test('one packet geometry: the build\'s manifest stage = site.css layers; the open packet fits a 360 px screen', () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  const box = (sel: string, k: string) => {
    const b = rule(sel), [L, T, W, H] = st[k];
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = num(b, prop);
      if (Number.isFinite(got)) assert.ok(Math.abs(got - v) < 0.011, `${sel} ${prop} ${got} ≠ manifest ${v}`);
      else assert.equal(v, 0, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  for (const f of ['n', 'e', 's', 'w']) box(`.f-${f}`, f);
  box('.cord', 'cord');
  box('.porcelain', 'button');
  box('.card', 'card');
  // every flap keeps its hinge on its own edge of the square and spans it
  const r2 = (v: number) => Math.round(v * 100) / 100;
  assert.deepEqual([st.n[0], st.n[1], st.n[2]], [0, 0, 100]);
  assert.deepEqual([st.s[0], st.s[2], r2(st.s[1] + st.s[3])], [0, 100, 100]);
  assert.deepEqual([st.e[1], st.e[3], r2(st.e[0] + st.e[2])], [0, 100, 100]);
  assert.deepEqual([st.w[0], st.w[1], st.w[3]], [0, 0, 100]);
  // the button sits on the cord's empty circle
  const [hx, hy] = st.cord_hole;
  assert.ok(Math.abs(st.button[0] + st.button[2] / 2 - hx) < 0.02 && Math.abs(st.button[1] + st.button[3] / 2 - hy) < 0.02);
  // the stage settles to .52 during the opening; open, the flaps lie round the square (manifest reach): at the
  // largest packet a 360 px screen gets (72vw) the open object stays inside it with a margin
  const settled = /@keyframes settle\{from\{transform:none\}to\{transform:scale\(([\d.]+)\)\}\}/.exec(css)![1], scale = Number(settled);
  assert.match(css, new RegExp(`\\.is-opened \\.envelope\\{transform:scale\\(${settled.replace('.', '\\.')}\\)\\}`));
  const obj = 0.72 * 360, r = st.reach;
  const left = 50 - scale * (50 + r.w), right = 50 + scale * (50 + r.e);
  assert.ok((right - left) / 100 * obj < 340, `open width ${((right - left) / 100 * obj).toFixed(0)} px`);
  assert.ok(left / 100 * obj + (360 - obj) / 2 > 8 && 360 - ((right / 100) * obj + (360 - obj) / 2) > 8, 'inside the 360 px screen');
  assert.match(css, /\.stage\{--obj:min\(72vw,/);
});

test('washi mats: windows = the measured ones, photos appear through the GPT ink bloom mask', () => {
  for (const [sel, k] of [['.mat-portrait', 'portrait'], ['.mat-story', 'story'], ['.mat-wide', 'wide'], ['.mat-venue', 'venue']] as const) {
    const [L, T, W, H] = manifest[k].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(num(b, prop) - v) < 0.011, `${sel} ${prop}`);
    const [w, h] = manifest[k].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
  assert.equal(manifest.venue.window_from, 'the transparent hole the mat encloses (no green)');
  assert.match(css, /\.js \.inked\[data-step\]>\.photo-slot\{-webkit-mask:url\(img\/ink-512\.webp\) 50% 50%\/0% auto no-repeat;mask:url\(img\/ink-512\.webp\)/);
  assert.match(css, /@keyframes ink\{from\{-webkit-mask-size:0% auto;mask-size:0% auto\}to\{-webkit-mask-size:340% auto;mask-size:340% auto\}\}/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.inked\[data-step\]>\.photo-slot\{-webkit-mask:none!important;mask:none!important\}/);
  assert.match(css, /\.from-envelope \.hero-card \.photo-slot\{-webkit-mask:none;mask:none;animation:none\}/);
  const $h = cheerio.load(html.home), $s = cheerio.load(html.story), $d = cheerio.load(html.details);
  assert.equal($h('.hero-card .frame.mat-portrait.inked[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal($h('.teaser .frame.mat-story.inked > .photo-slot[data-slot="story_1"]').length, 1);
  // story: three moments, left – right – left; the landscape photo in the wide mat
  assert.deepEqual($s('.moments > .moment').toArray().map((e) => $s(e).attr('class')), ['moment m-left', 'moment m-wide', 'moment m-right']);
  assert.equal($s('.m-wide .frame.mat-wide.inked > .photo-slot[data-slot="story_2"]').length, 1);
  assert.equal($s('.frame.mat-story.inked > .photo-slot[data-slot="story_1"], .frame.mat-story.inked > .photo-slot[data-slot="story_3"]').length, 2);
  assert.equal($d('.frame.mat-venue.inked > .photo-slot[data-slot="venue"]').length, 1);
  // the mended tea bowl signs off on home and rsvp
  assert.equal($h('.signature > .bowl').length, 1);
  assert.equal(cheerio.load(html.rsvp)('.signature > .bowl').length, 1);
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
  const scenes = /scenes: \{[\s\S]*?\n  \}/.exec(js)![0];
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    $('[data-scene]').each((_, el) => {
      const steps = new Set((scenes.match(new RegExp(`'${$(el).attr('data-scene')}': \\[([^\\n]*)\\]`))?.[1] ?? '').match(/'([a-z]+)'/g)?.map((s) => s.slice(1, -1)));
      $(el).find('[data-step]').each((__, n) => { if ($(n).closest('[data-scene]').is(el)) assert.ok(steps.has($(n).attr('data-step')!), `${p}: ${$(el).attr('data-scene')} step ${$(n).attr('data-step')} in MOTION.scenes`); });
    });
  }
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
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.frame>\.cut::after,\.card::after,\.porcelain::after,\.flap-out::after,\.bowl::after\{display:none\}/);
  for (const r of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(r, /border|outline|box-shadow/, r);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  for (const f of ['site.css', 'thank-you.css', 'site.js', ...PAGES.map((p) => `${p}.html`)]) {
    for (const m of read(f).matchAll(/img\/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png))/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[1])), `${f}: img/${m[1]}`);
  }
});

test('img/manifest.json: every PAKET 5 part used, no green left, og + favicon; build script, README and thank-you styles exist', () => {
  assert.deepEqual(manifest.parts.waiting_for_gpt, []);
  assert.equal(manifest.parts.used.length, 26);
  assert.deepEqual(manifest.checks.green, {});
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', manifest[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
  assert.ok(manifest.bytes_total <= 3_000_000, 'theme folder ≤ 3 MB');
});

test('demo route renders every page with the design\'s own sample photos (G155) and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/kintsugi-washi\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/kintsugi-washi\/hero_portrait-\d+w\.webp/);
    if (page === 'story') assert.equal($('.moment').length, 3);
  }
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-21'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for an evening we will treasure.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img[src$="bowl-480.webp"]').length, 1, 'no photo: the mended tea bowl, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds (G967) = MOTION: the button, the cord, the four folds from their sides, the card, forward', () => {
  const at = (k: string) => Number(new RegExp(`\\b${k}: \\[(\\d+), `).exec(js)![1]);
  assert.deepEqual(designSound(id), { music: 'first-light', opening: [[at('button'), 'porcelain'], [at('cord'), 'cord', 0.3], [at('flapN'), 'fold'], [at('flapE'), 'fold-2', 0.35], [at('flapS'), 'fold'], [at('flapW'), 'fold-2', -0.35], [at('rise'), 'slide-quick'], [at('forward'), 'chime']] });
});

test('RSVP keeps the shared form contract; a reply is answered with the GPT accents (gold leaf, ink drops, petals)', async () => {
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
  for (const n of ['flake', 'drop', 'petal']) assert.match(js, new RegExp(`img: 'img/${n}-160\\.webp'`));
  assert.match(js, /particles\('reply'/);
});
