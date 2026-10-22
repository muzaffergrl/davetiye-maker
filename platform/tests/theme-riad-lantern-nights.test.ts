// Riad Lantern Nights (27, G427): redesign of 2026-10-22 (docs/35), rebuilt on the pilot-39 structure (pilot G423) from
// the design's own layered GPT parts (PAKET 5R). The closed envelope (K23 strict: a portrait deep-teal envelope with an
// upside-down horseshoe-arch flap, closed by a saffron cord looped round a brass stud with a tassel and a pierced brass
// lantern charm — not the V flap of 01–21, not the Codex cedar doors), its opening (the lantern lights — unlit/lit GPT
// pair crossfaded —, the cord lifts off and falls, the flap swings up in 3D onto its zellige inside, the card rises and
// comes forward, accents drift), the envelope geometry shared by the build and site.css, the horseshoe photo windows
// (technical alpha masks of the measured windows, never rectangles), editable texts, scenes, demo route, thank-you mode,
// audio cues, RSVP contract, print layout. Off sale ("preview") until approval.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
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

const id = 'riad-lantern-nights';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const dir = path.join(ROOT, 'themes', id);
const read = (f: string) => readFileSync(path.join(dir, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');
const manifest = JSON.parse(read('img/manifest.json'));
const rule = (sel: string) => {
  const m = new RegExp(`(?:^|\\n|\\})${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\{([^}]*)\\}`).exec(css);
  assert.ok(m, `site.css ${sel}`);
  return m[1];
};
const pct = (body: string, prop: string) => Number(new RegExp(`(?:^|;)${prop}:(-?[\\d.]+)%`).exec(body)?.[1]);
const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`\\b${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);

test('Riad Lantern Nights is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Riad Lantern Nights');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '27_Riad_Lantern_Nights');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Cinzel', 'Marcellus SC', 'Marcellus']);
  assert.deepEqual(DESIGN_STYLES[id], ['classic', 'destination']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '27_Riad_Lantern_Nights');
  assert.match(String(PRINT_LAYOUTS[id].sources.front), /_r_5x7\.png$/);
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(dir, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/27_Riad_Lantern_Nights/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Leila & Adrian');
  assert.equal(a.date, '2027-10-09');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Leila', 'Adrian', 'Saffron Courtyard', 'Marrakech', 'October 9', 'L&amp;A', 'L&A']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, pocket, flap (outside with the stud + zellige inside), cord and the lantern pair are separate layers; no V flap, no Codex doors', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .front', '.envelope > .flap > .flap-out > .stud', '.envelope > .flap > .flap-in',
    '.envelope > .closure > .cord', '.envelope > .closure > .lantern > .lantern-off', '.envelope > .closure > .lantern > .lantern-on']) assert.equal(stage.find(sel).length, 1, sel);
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site|door-left|door-right/i);
  for (const f of ['envelope-v3.js', 'envelope-v3.css', 'opening-design.json', 'opening-site.js', 'interior.css', 'interior-motion.js', 'variants.css']) assert.ok(!existsSync(path.join(dir, f)), f);
  // the two lanterns are one GPT pair on one canvas: the same box, crossfaded in place
  assert.match(rule('.lantern-off'), /url\(img\/lantern-off-240\.webp\)/);
  assert.match(rule('.lantern-on'), /url\(img\/lantern-on-240\.webp\);opacity:0/);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const [l0, ld] = step('lit'), [g0, gd] = step('glow'), [c0, cd] = step('cord'), [d0, dd] = step('douse'), [f0, fd] = step('flap'),
    [r0, rd] = step('rise'), [s0, sd] = step('light'), [w0, wd] = step('forward');
  const acc = Number(/accents: (\d+),/.exec(js)![1]), go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(l0 + ld <= c0 + 100 && c0 < d0 && d0 < f0 && f0 < r0 && r0 < acc && acc < w0 && s0 < w0 + wd, 'lantern → cord → flap → card → accents → forward');
  assert.ok(f0 >= c0 + cd * 0.8, 'the flap waits until the closure is (nearly) gone');
  assert.ok(go >= w0 + wd && go <= 5500, 'home only after the card came forward, within 5.5 s');
  assert.match(css, new RegExp(`\\.is-opening \\.lantern-on\\{animation:lit ${ld}ms ${l0}ms [^,]*forwards,douse ${dd}ms ${d0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.lantern::after\\{animation:halo ${gd}ms ${g0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.glow\\{animation:halo ${gd}ms ${g0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.closure\\{animation:cord-off ${cd}ms ${c0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.lantern\\{animation:swing ${cd}ms ${c0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${fd}ms ${f0}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope>\\.card::after\\{animation:sweep ${sd}ms ${s0}ms`));
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  // the 3D flap shows its real GPT inside (flap_in), never a plain colour
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  assert.match(rule('.flap-in'), /^transform:rotateX\(180deg\);background-image:url\(img\/flap_in-720\.webp\)$/);
  // the cover layout
  assert.equal($('.opening-heading [data-copy="envelope_kicker"]').text(), 'Together with their families');
  assert.equal($('.opening-actions .opening-date [data-field="date"]').length, 1);
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
  assert.match(css, /\.is-opening \.stage\{pointer-events:none\}/);
});

test('one envelope geometry: the build\'s manifest stage = site.css layers', () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open flap's height (it stands up there like a door without covering the names)
  const flapH = String(st.flap[3] / 100).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.stage\\{--obj:[^;]*;[^}]*margin:calc\\(var\\(--obj\\) / ${a} \\* ${flapH} \\+ \\d+px\\) auto 0`));
  const box = (sel: string, v4: number[]) => {
    const b = rule(sel), [L, T, W, H] = v4;
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = pct(b, prop);
      if (Number.isFinite(got)) assert.ok(Math.abs(got - v) < 0.011, `${sel} ${prop} ${got} ≠ manifest ${v}`);
      else assert.equal(v, sel === '.front' && prop === 'left' ? 0 : v, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  box('.front', st.front);
  box('.flap', st.flap);
  box('.stud', st.stud_on_flap);
  box('.cord', st.cord);
  box('.lantern', st.lantern);
  box('.card', st.card);
  assert.match(rule('.closure'), new RegExp(`transform-origin:${st.pivot[0]}% ${st.pivot[1]}%`));
  // the lantern hangs from the cord's jump ring: its top sits inside the ring, horizontally on it
  const [jl, jt, jw, jh] = st.jump_ring, [ll, lt, lw] = st.lantern;
  assert.ok(lt > jt && lt < jt + jh, 'lantern top inside the jump ring');
  const ringX = ll + lw * manifest.lantern.ring.cx_pct / 100;
  assert.ok(Math.abs(ringX - (jl + jw / 2)) < 0.5, 'lantern ring centred under the jump ring');
  // the card stays inside the envelope while closed
  const [cl, ct, cw, ch] = st.card;
  assert.ok(cl >= 15 && cl + cw <= 85 && ct >= st.flap[1] && ct + ch <= 100, 'card hidden behind the flap and pocket');
});

test('the photo windows are the measured ones; the horseshoe arches are masked by technical alpha masks of those windows', async () => {
  for (const [sel, k] of [['.arch', 'arch'], ['.storyarch', 'storyarch'], ['.venue-frame', 'venue']] as const) {
    const [L, T, W, H] = manifest[k].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(pct(b, prop) - v) < 0.011, `${sel} ${prop}`);
    assert.deepEqual(manifest[k].slot_pct.map((x: number) => Math.round(x * 100)), [L - 0.5, T - 0.5, W + 1, H + 1].map((x) => Math.round(x * 100)), `${k} slot`);
    const [w, h] = manifest[k].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
    assert.doesNotMatch(b, /border-radius/, `${sel}: never a radius`);
  }
  for (const k of ['arch', 'storyarch']) {
    const m = manifest[k].mask, b = rule(`.${k}>.photo-slot`);
    assert.match(b, new RegExp(`-webkit-mask:url\\(img/${m.file}\\) 0 0/100% 100% no-repeat;mask:url\\(img/${m.file}\\) 0 0/100% 100% no-repeat`));
    const meta = await sharp(path.join(dir, 'img', m.file)).metadata();
    assert.equal(meta.hasAlpha, true, m.file);
    // the mask has the slot's proportions (it is stretched over it at 100% 100%)
    const [, , sw, sh] = manifest[k].slot_pct, [fw, fh] = manifest[k].src_size;
    assert.ok(Math.abs(meta.width! / meta.height! - (sw * fw) / (sh * fh)) < 0.01, `${k} mask proportions`);
    // an arch, not a rectangle: the top corners are outside the window, the middle inside
    const { data, info } = await sharp(path.join(dir, 'img', m.file)).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
    const at = (x: number, y: number) => data[Math.round(y) * info.width + Math.round(x)];
    for (const [x, y] of [[2, 2], [info.width - 3, 2], [info.width * 0.12, info.height * 0.06], [info.width * 0.88, info.height * 0.06]]) assert.equal(at(x, y), 0, `${k} corner ${x},${y}`);
    for (const [x, y] of [[info.width / 2, info.height / 2], [info.width / 2, info.height * 0.95], [info.width * 0.1, info.height * 0.9]]) assert.equal(at(x, y), 255, `${k} inside ${x},${y}`);
    assert.ok(m.coverage_pct > 70 && m.coverage_pct < 97, `${k} coverage ${m.coverage_pct}`);
  }
  assert.equal(cheerio.load(html.home)('.frame.arch.reveal[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.index)('.card .frame.arch > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.story)('.window .frame.storyarch.reveal > .photo-slot + .cut').length, 3);
  assert.equal(cheerio.load(html.story)('.window.left').length, 2);
  assert.equal(cheerio.load(html.story)('.window.right').length, 1);
  assert.equal(cheerio.load(html.details)('.frame.venue-frame.reveal > .photo-slot[data-slot="venue"]').length, 1);
  // the photo waits in the dark; lantern light sweeps down over it as its scene enters (never with reduced motion)
  assert.match(css, /\.js \.reveal\[data-step\]>\.photo-slot>img\{filter:brightness/);
  assert.match(css, /\.js \.reveal\[data-step\]\.in>\.photo-slot::after\{animation:light-down/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.frame>\.photo-slot::after,\.card::after,\.lantern::after\{display:none\}/);
});

test('session keys per site, view transition, scenes, placeholders, countdown, K21', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope \.hero-card \[data-step\]\{opacity:1;clip-path:none;transform:none;transition:none;animation:none\}/);
  assert.match(rule('.hero-card'), /view-transition-name:invite-card/);
  assert.match(rule('.hero-card'), /url\(img\/card-720\.webp\)/, 'the home card is the card from the envelope');
  for (const p of PAGES) if (p !== 'index') assert.ok(cheerio.load(html[p])('[data-scene]').length > 0, `${p}: [data-scene]`);
  const scenes = /scenes: \{[\s\S]*?\n  \}/.exec(js)![0];
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    $('[data-scene]').each((_, el) => {
      const steps = new Set((scenes.match(new RegExp(`'${$(el).attr('data-scene')}': \\[([^\\n]*)\\]`))?.[1] ?? '').match(/'([a-z]+)'/g)?.map((s) => s.slice(1, -1)));
      $(el).find('[data-step]').each((__, n) => { if ($(n).closest('[data-scene]').is(el)) assert.ok(steps.has($(n).attr('data-step')!), `${p}: ${$(el).attr('data-scene')} step ${$(n).attr('data-step')} in MOTION.scenes`); });
    });
  }
  // the zellige band sets its tiles one by one
  assert.equal(cheerio.load(html.home)('[data-scene="home-tiles"] .tile[data-step="tile"]').length, 6);
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
      assert.ok(existsSync(path.join(dir, src)), src);
      assert.ok($(el).attr('sizes'), `${p}: sizes`);
    });
  }
  assert.deepEqual([...slots].sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const r of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(r, /border|outline|box-shadow/, r);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(dir, m[1])), m[1]);
  for (const f of ['site.css', 'thank-you.css', 'site.js', ...PAGES.map((p) => `${p}.html`)]) {
    for (const m of read(f).matchAll(/img\/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png))/g)) assert.ok(existsSync(path.join(dir, 'img', m[1])), `${f}: img/${m[1]}`);
  }
  // no religious symbols or calligraphy in the theme's words either
  assert.doesNotMatch(Object.values(html).join(' '), /crescent|mosque|minaret|hamsa|calligraph/i);
});

test('img/manifest.json: every PAKET 5 part used, no green left in the keyed frames, og + favicon; build script, README, thank-you styles', () => {
  assert.deepEqual(manifest.parts.waiting_for_gpt, []);
  assert.equal(manifest.parts.used.length, 22);
  assert.deepEqual(manifest.checks.green, {});
  for (const k of ['arch', 'storyarch', 'venue']) for (const f of manifest[k].files) assert.ok(manifest.checks.green_scope.includes(f.file), f.file);
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(dir, 'img', manifest[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(dir, f)), f);
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
    assert.match(data.pages.home, /^\/start\/demo\/riad-lantern-nights\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/riad-lantern-nights\/hero_portrait-\d+w\.webp/);
    if (page === 'story') assert.equal($('.window').length, 3);
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
  demo.thank_you = { mode: 'on', message: 'Thank you for an evening under the lanterns.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img[src$="zellige-320.webp"]').length, 1, 'no photo: a piece of the zellige, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening under the lanterns/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds = MOTION: the lantern, the cord, the flap, the card', () => {
  const [l0] = step('lit'), [c0] = step('cord'), [f0] = step('flap'), [r0] = step('rise');
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[l0, 'chime'], [c0, 'ribbon'], [f0, 'paper'], [r0, 'slide']] });
});

test('RSVP keeps the shared form contract; a reply lights the lantern charm and the GPT accents drift', async () => {
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
  assert.equal($('.page-heading .charm > .lantern-off + .lantern-on').length, 1);
  assert.match(css, /html\[data-rsvp-replied\] \.charm>\.lantern-on\{opacity:1\}/);
  for (const n of ['bract', 'blossom', 'star']) assert.match(js, new RegExp(`img: 'img/${n}-160\\.webp'`));
});
