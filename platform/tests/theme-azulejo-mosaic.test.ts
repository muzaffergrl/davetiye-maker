// Azulejo Mosaic (30, G430): redesign of 2026-10-22 (docs/35 row 30), rebuilt on the pilot-39 structure (pilot G423)
// from the design's own layered GPT parts (PAKET 5R). The closed envelope (K23 strict: a portrait glaze-white envelope
// whose stepped flap is a grid of hand-painted cobalt azulejo tiles, tied in a cross with jute twine and closed by a
// loose swallow tile — not the V flap of 01–21), its opening (the knot loosens, the twine slips off in three pieces, the
// tile turns over onto its terracotta back and drops, the flap swings up onto its real lining, the corner tiles turn in a
// wave, the card rises, accents drift), the envelope geometry shared by the build and site.css, editable texts, scenes,
// the frames with measured windows and the photo mosaic, demo route, thank-you mode, audio cues, RSVP contract, print
// layout. Off sale ("preview") until approval.
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

const id = 'azulejo-mosaic';
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
const pct = (body: string, prop: string) => Number(new RegExp(`(?:^|;)${prop}:(-?[\\d.]+)%`).exec(body)?.[1]);
const near = (a: number, b: number, what: string) => assert.ok(Math.abs(a - b) < 0.011, `${what}: ${a} ≠ ${b}`);

test('Azulejo Mosaic is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Azulejo Mosaic');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '30_Azulejo_Mosaic');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Arizonia', 'Cormorant Upright']);
  assert.deepEqual(DESIGN_STYLES[id], ['classic', 'destination']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '30_Azulejo_Mosaic');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/30_Azulejo_Mosaic/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Inês & Mateo');
  assert.equal(a.date, '2027-06-05');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Inês', 'Mateo', 'Andorinha', 'Sintra', 'June 5', 'I&amp;M', 'I&M']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, pocket, flap (outside + lining), the tile (front + back) and three pieces of twine are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .front', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in',
    '.envelope > .tile > .tile-spin > .tile-f', '.envelope > .tile > .tile-spin > .tile-b', '.envelope > .twine.tw-v', '.envelope > .twine.tw-l', '.envelope > .twine.tw-r']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal($('.wave .wt').length, 8, 'two four-tile panels in the lower corners');
  // not the V flap of 01–21 and no Codex envelope-v3 controller any more
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site/i);
  for (const f of ['envelope-v3.js', 'opening-design.json', 'interior.css', 'parts.css', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);
  const [k0, kd] = step('knot'), [t0, td] = step('twine'), [i0, id_] = step('tile'), [l0, ld] = step('flap'), [v0, vd] = step('wave'),
    [r0, rd] = step('rise'), [s0, sd] = step('light'), [w0, wd] = step('forward');
  const acc = Number(/accents: (\d+),/.exec(js)![1]), waveStep = Number(/waveStep: (\d+)/.exec(js)![1]);
  assert.ok(k0 <= t0 && t0 < i0 && i0 < l0 && l0 < v0 && v0 < acc && acc < r0 && r0 < w0 && s0 < w0 + wd, 'closure first, then flap, wave, card');
  assert.ok(i0 >= t0 + td - 200, 'the tile turns once the twine is off');
  assert.match(css, new RegExp(`\\.is-opening \\.twine\\.tw-v\\{animation:knot-loose ${kd}ms ${k0}ms [^,]+,strand-down ${td}ms ${t0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.twine\\.tw-l\\{animation:arm-left ${td}ms ${t0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.twine\\.tw-r\\{animation:arm-right ${td}ms ${t0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.tile\\{animation:tile-drop ${id_}ms ${i0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.tile-spin\\{animation:tile-flip ${id_}ms ${i0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${ld}ms ${l0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.wave \\.wt\\{animation:tile-turn ${vd}ms calc\\(${v0}ms \\+ var\\(--i\\) \\* ${waveStep}ms\\)`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope>\\.card::after\\{animation:sweep ${sd}ms ${s0}ms`));
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  const go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(go >= w0 + wd, 'home only after the card came forward');
  assert.ok(go <= 5500, 'the whole opening within 5.5 s');
  // the tile turns on its vertical axis (rotateY 180° onto the terracotta back); the fade is on the parent, never on the
  // preserve-3d element (an opacity there flattens it and shows the painted face mirrored)
  assert.match(css, /@keyframes tile-flip\{[^}]*\}[^@]*rotateY\(180deg\)/);
  assert.doesNotMatch(/@keyframes tile-flip\{[\s\S]*?\}\}/.exec(css)![0], /opacity/);
  assert.match(css, /\.tile-b\{transform:rotateY\(180deg\);background-image:url\(img\/tile_back-\d+\.webp\)\}/);
  // the flap swings up on its top edge onto its real GPT lining (never a plain colour)
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  assert.match(css, /\.flap-in\{transform:rotateX\(180deg\);background-image:url\(img\/flap_in-720\.webp\)\}/);
  // the catalogue cover layout
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
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the frames\' windows = the measured ones', () => {
  const st = manifest.stage, a = String(st.aspect).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open flap's height (it stands up there without covering the names)
  const flapH = String(st.flap[3] / 100).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.stage\\{--obj:[^;]*;[^}]*margin:calc\\(var\\(--obj\\) / ${a} \\* ${flapH} \\+ \\d+px\\) auto 0`));
  const box = (sel: string, k: string) => {
    const b = rule(sel), [L, T, W, H] = st[k];
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = pct(b, prop);
      if (Number.isFinite(got)) near(got, v, `${sel} ${prop}`);
      else assert.equal(v, 0, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  box('.front', 'front');
  box('.flap', 'flap');
  box('.tile', 'tile');
  box('.card', 'card');
  box('.tw-v', 'twine_v');
  box('.tw-l', 'twine_l');
  box('.tw-r', 'twine_r');
  // the strand turns round the knot
  const [kx, ky] = st.knot, [vl, vt, vw, vh] = st.twine_v;
  const origin = /transform-origin:([\d.]+)% ([\d.]+)%/.exec(rule('.tw-v'))!;
  near(Number(origin[1]), Math.round(10000 * (kx - vl) / vw) / 100, 'knot x in the strand');
  near(Number(origin[2]), Math.round(10000 * (ky - vt) / vh) / 100, 'knot y in the strand');
  // the card stays inside the envelope and hides behind pocket and flap while closed
  const [cl, ct, cw, ch] = st.card;
  assert.ok(cl > 0 && cl + cw < 100 && ct > 0 && ct + ch < 100, 'card inside the envelope');
  assert.ok(st.front[1] < st.flap[3], 'the flap covers the pocket\'s top edge');
  for (const [sel, k2] of [['.niche', 'niche'], ['.story-frame', 'frame'], ['.venue-frame', 'venue']] as const) {
    const [L, T, W, H] = manifest[k2].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) near(pct(b, prop), v, `${sel} ${prop}`);
    const [w, h] = manifest[k2].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
});

test('session keys per site, view transition, scenes, placeholders, countdown, the photo mosaic, K21', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope \.hero-card \[data-step\]\{opacity:1;clip-path:none;transform:none;transition:none;animation:none\}/);
  assert.equal(cheerio.load(html.home)('.hero-card').length, 1);
  for (const p of PAGES) if (p !== 'index') assert.ok(cheerio.load(html[p])('[data-scene]').length > 0, `${p}: [data-scene]`);
  for (const p of PAGES) {
    const $ = cheerio.load(html[p]);
    $('[data-scene]').each((_, el) => {
      const steps = new Set((/scenes: \{[\s\S]*?\n  \}/.exec(js)![0].match(new RegExp(`'${$(el).attr('data-scene')}': \\[([^\\n]*)\\]`))?.[1] ?? '').match(/'([a-z]+)'/g)?.map((s) => s.slice(1, -1)));
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
  // every inner photo sits in a GPT frame and is uncovered by the tile mosaic (never with reduced motion)
  assert.equal(cheerio.load(html.home)('.frame.niche.mosaic[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.home)('.frame.story-frame.mosaic > .photo-slot[data-slot="story_1"]').length, 1);
  const story = cheerio.load(html.story);
  assert.equal(story('.moment[data-scene="story-moment"] .frame.story-frame.mosaic > .photo-slot + .cut').length, 3);
  assert.deepEqual(story('.moment').toArray().map((m) => story(m).hasClass('m-left') ? 'L' : 'R'), ['L', 'R', 'L']);
  assert.equal(cheerio.load(html.details)('.frame.venue-frame.mosaic > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(js, /initMosaic\(\);/);
  assert.match(js, /if \(reduce \|\| !\('IntersectionObserver' in window\)\) return;\n  \$\$\('\.frame\.mosaic'\)/);
  assert.match(css, /\.js \.mosaic\.in \.cell\{animation:cell-turn 700ms calc\(var\(--d,0ms\) \+ 450ms \+ var\(--k\) \* 80ms\)/);
  assert.match(css, /\.cb\{transform:rotateY\(180deg\)\}/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.tiles,\.card::after\{display:none\}/);
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
  assert.equal(manifest.parts.used.length, 22);
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
    assert.match(data.pages.home, /^\/start\/demo\/azulejo-mosaic\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/azulejo-mosaic\/hero_portrait-\d+w\.webp/);
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
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a painted tile, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the knot, the twine, the tile, the flap, the corner tiles, the card', () => {
  assert.deepEqual(designSound(id), { music: 'garden-waltz', opening: [[0, 'tap'], [380, 'ribbon'], [900, 'clasp'], [1750, 'paper'], [2050, 'chime'], [2400, 'slide']] });
});

test('RSVP keeps the shared form contract; a reply is answered with turning tiles and the GPT accents', async () => {
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
  assert.equal($('[data-rsvp-state="success"] .ty-tiles .wt').length, 5);
  assert.match(css, /\.reply-panel\[data-rsvp-state=success\]:not\(\[hidden\]\) \.ty-tiles \.wt\{animation:tile-turn/);
  for (const n of ['leaf', 'jasmine', 'chip']) assert.match(js, new RegExp(`img: 'img/${n}-160\\.webp'`));
});
