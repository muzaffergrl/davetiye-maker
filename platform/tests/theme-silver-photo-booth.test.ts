// Silver Photo Booth (39, G439): pilot of the fourth wave (docs/33), built from the design's own GPT parts. The closed
// envelope (K23 strict: a pearl-silver envelope with a deep U flap held by a photo-booth strip that wraps it — no V flap,
// no wax seal), its opening (flash, the strip slides off and rests beside the envelope, the U flap swings up on its top
// edge, the card rises, a second flash), the envelope geometry shared by the build, site.css and site.js, editable texts,
// scenes, photos that develop in chrome booth windows, the strip that prints out of the slot, demo route, thank-you
// mode, audio cues, RSVP contract, print layout. Off sale ("coming") until approval.
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

const id = 'silver-photo-booth';
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
const pct = (body: string, prop: string) => Number(new RegExp(`(?:^|;)${prop}:([\\d.]+)%`).exec(body)?.[1]);

test('Silver Photo Booth is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Silver Photo Booth');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'coming');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '39_Silver_Photo_Booth');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_STYLES[id], ['classic']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '39_Silver_Photo_Booth');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/39_Silver_Photo_Booth/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Josephine & Miles');
  assert.equal(a.date, '2027-05-08');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Josephine', 'Miles', 'Lindell', 'Saint Louis', 'May 8', 'J&amp;M', 'J&M']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, under, pocket, flap (outside + lining) and the photo strip are separate layers; no V flap, no seal', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .under', '.envelope > .front', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in', '.envelope > .band']) assert.equal(stage.find(sel).length, 1, sel);
  // the strip carries the couple's photos in its three frames (story 1–3), from the start
  for (const n of [1, 2, 3]) assert.equal(stage.find(`.band > .shot.s-${n} > img[data-photo="story_${n}"]`).length, 1, `strip frame ${n}`);
  // fourth wave (K23 strict): not the V flap + wax seal of 01–32
  assert.doesNotMatch(html.index + css, /\bseal\b|wax|v-flap|clip-path:\s*polygon/i);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);
  const [f0, fd] = step('flash'), [s0, sd] = step('strip'), [l0, ld] = step('flap'), [r0, rd] = step('rise'), [g0] = step('flash2'), [w0, wd] = step('forward');
  assert.ok(f0 <= s0 && s0 < l0 && l0 < r0 && r0 < g0 && g0 <= w0);
  assert.match(css, new RegExp(`\\.is-opening \\.flash\\{animation:flash ${fd}ms ${f0}ms[^,]*,flash \\d+ms ${g0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.band\\{animation:strip-off ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.under\\{animation:under-off \\d+ms ${l0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${ld}ms ${l0}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.ok(Number(/go: (\d+)/.exec(js)![1]) >= w0 + wd, 'home only after the card came forward');
  // the flap turns on its top edge (3D) and shows its lining
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  assert.match(css, /\.flap-in\{transform:rotateX\(180deg\)/);
  // the strip's resting place is computed (CSS variables written by site.js) and held in the opened state
  for (const v of ['--tx', '--ty', '--r', '--s']) assert.match(js, new RegExp(`setProperty\\('${v}'`));
  assert.match(css, /\.is-opened \.band\{transform:translate\(var\(--tx\),var\(--ty\)\) rotate\(var\(--r\)\) scale\(var\(--s\)\)\}/);
  // the catalogue cover layout: families line + names above, envelope in the middle, date · city and "Tap to open" below
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

test('one envelope geometry: the build\'s manifest stage = site.css layers = site.js band', () => {
  const st = manifest.stage, a = String(st.aspect).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open flap's height (it stands up there without covering the names)
  const flapH = String(st.flap[3] / 100).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.stage\\{--obj:[^;]*;[^}]*margin:calc\\(var\\(--obj\\) / ${a} \\* ${flapH} \\+ \\d+px\\) auto 0`));
  const box = (sel: string, k: 'front' | 'flap' | 'band' | 'under') => {
    const b = rule(sel), [L, T, W, H] = st[k];
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = pct(b, prop);
      if (Number.isFinite(got)) assert.ok(Math.abs(got - v) < 0.01, `${sel} ${prop} ${got} ≠ manifest ${v}`);
      else assert.equal(v, 0, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  box('.front', 'front');
  box('.flap', 'flap');
  box('.band', 'band');
  box('.under', 'under');
  const B = /band: \{ left: ([\d.]+), top: ([\d.]+), width: ([\d.]+), height: ([\d.]+) \}/.exec(js)!.slice(1).map(Number);
  assert.deepEqual(B, st.band, 'site.js MOTION.band = manifest stage.band');
  assert.equal((js.match(/0\.6861/g) ?? []).length >= 2, true, 'site.js uses the envelope aspect');
  // the strip's three frames are where the build measured them in the part
  st.band_frames.forEach(([L, T, W, H]: number[], i: number) => {
    const shot = rule('.band .shot');
    assert.equal(pct(shot, 'left'), L);
    assert.equal(pct(shot, 'width'), W);
    assert.equal(pct(shot, 'height'), H);
    assert.equal(pct(rule(`.band .s-${i + 1}`), 'top'), T);
  });
  // framed photos sit in the measured windows (0.5 % under the frame's edge)
  for (const [sel, k] of [['.booth', 'booth'], ['.print', 'print_wide'], ['.tile', 'tile']] as const) {
    const [L, T, W, H] = manifest[k].window_pct;
    const b = rule(`${sel}>.photo-slot,${sel}>.fx`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(pct(b, prop) - v) < 0.011, `${sel} ${prop}`);
    const [w, h] = manifest[k].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
});

test('session keys per site, view transition, scenes, placeholders, countdown, develop, K21', () => {
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
  // framed photos develop (flash + the picture coming up), never without JS or with reduced motion
  for (const p of ['home', 'story', 'details'] as const) assert.ok(cheerio.load(html[p])('.frame.develop[data-step] > .photo-slot[data-slot] + .fx + .cut').length > 0, p);
  assert.equal(cheerio.load(html.story)('.moment .frame.booth.develop > .photo-slot + .fx + .cut').length, 3);
  assert.equal(cheerio.load(html.details)('.frame.print.develop > .photo-slot[data-slot="venue"]').length, 1);
  assert.equal(cheerio.load(html.home)('.booth-print[data-step] .strip > .frame.tile > .photo-slot[data-slot]').length, 3);
  assert.match(css, /\.js \.develop\[data-step\]\.in \.photo-slot>img\{animation:develop /);
  assert.match(css, /@keyframes print-out\{/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.develop\[data-step\] \.photo-slot>img,[^{]*\{animation:none!important;filter:none!important\}/);
  for (const r of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(r, /border|outline|box-shadow/, r);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  // every image the pages, CSS and JS name exists in img/
  for (const f of ['site.css', 'thank-you.css', 'site.js', ...PAGES.map((p) => `${p}.html`)]) {
    for (const m of read(f).matchAll(/img\/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png))/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[1])), `${f}: img/${m[1]}`);
  }
});

test('img/manifest.json: every PAKET 5 part used, no green left, og + favicon; build script, README and thank-you styles exist', () => {
  assert.deepEqual(manifest.parts.waiting_for_gpt, []);
  assert.deepEqual(manifest.checks.green, {});
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', manifest[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
  assert.ok(manifest.bytes_total <= 3_000_000, 'theme folder ≤ 3 MB');
  assert.equal(manifest.stage.band_frames.length, 3);
});

test('demo route renders every page with the design\'s own sample photos (G155) and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/silver-photo-booth\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/silver-photo-booth, fictional couple)
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/silver-photo-booth\/hero_portrait-\d+w\.webp/);
    if (page === 'index') for (const n of [1, 2, 3]) assert.match($(`.band [data-photo="story_${n}"]`).attr('src') || '', new RegExp(`^/demo/silver-photo-booth/story_${n}-\\d+w\\.webp`));
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
  demo.thank_you = { mode: 'on', message: 'Thank you for a night in the ballroom.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a piece of the satin, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a night in the ballroom/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the flashbulb, the strip, the flap, the card, the second flash', () => {
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[0, 'flash'], [180, 'slide-quick', -0.3], [1150, 'paper'], [1700, 'slide-quick'], [2200, 'flash', 0.2]] });
});

test('RSVP keeps the shared form contract; a reply is answered with flashes and the GPT accents', async () => {
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
  assert.match(js, /flashes: \{ count: 4, gap: \d+ \}/);
  for (const n of [1, 2, 3]) assert.match(js, new RegExp(`img: 'img/accent_${n}-160\\.webp'`));
});
