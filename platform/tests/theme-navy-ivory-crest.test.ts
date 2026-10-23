// Navy Ivory Crest (48, G448): fourth wave (docs/33, docs/34), built from the design's own GPT parts. The closed
// envelope (K23 strict: a landscape navy linen wallet with a straight flap, a blind-embossed laurel cartouche and an
// ivory shield wax seal on a grosgrain tab — not the V flap of 01–21), its opening (a gold light sweeps the embossing,
// the seal lifts with its tab, the flap swings up, the card turns upright as it rises, the crest is engraved and the
// initials inked), the envelope geometry shared by the build and site.css, the crest's HTML initials, editable texts,
// scenes, photos from embossing to tone, demo route, thank-you mode, audio cues, RSVP contract and the pressed seal,
// print layout. Off sale ("coming") until approval.
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

const id = 'navy-ivory-crest';
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

test('Navy Ivory Crest is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Navy Ivory Crest');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'coming');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '48_Navy_Ivory_Crest');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_STYLES[id], ['classic']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '48_Navy_Ivory_Crest');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/48_Navy_Ivory_Crest/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Caroline & Frederick');
  assert.equal(a.date, '2027-09-04');
  assert.equal(a.initials, 'C&F');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Caroline', 'Frederick', 'Langford', 'Annapolis', 'September 4', 'C&amp;F', 'C&F']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, pocket, flap (outside + lining), the gold sweep, the tab and the shield seal are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .front', '.envelope > .flap > .flap-out > .sheen', '.envelope > .flap > .flap-in', '.envelope > .sealing > .tab', '.envelope > .sealing > .seal']) assert.equal(stage.find(sel).length, 1, sel);
  // the card carries the crest; the initials in its empty shield are HTML (data-field), never baked into the picture
  assert.equal(stage.find('.card > .crest > .crest-art + .crest-mono[data-field="initials"]').length, 1);
  // not the V flap of 01–21: a straight wallet flap (its own GPT part; no clip-path polygon, no v-flap)
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon/i);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);
  const [h0, hd] = step('sheen'), [s0, sd] = step('seal'), [o0, od] = step('flap'), [r0, rd] = step('rise');
  const [w0, wd] = step('forward'), [c0, cd] = step('crest'), [i0, id_] = step('initials');
  assert.ok(h0 < s0 && s0 < o0 && s0 + sd <= o0 + 100 && o0 < r0 && r0 < c0 && c0 < w0 + wd && c0 + cd <= i0 + id_);
  assert.match(css, new RegExp(`\\.is-opening \\.flap-out>\\.sheen\\{animation:sheen ${hd}ms ${h0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.sealing\\{animation:seal-off ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${od}ms ${o0}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.card \\.crest-art\\{animation:engrave ${cd}ms ${c0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.card \\.crest-mono\\{animation:ink-in ${id_}ms ${i0}ms`));
  assert.ok(Number(/go: (\d+)/.exec(js)![1]) >= Math.max(w0 + wd, i0 + id_), 'home only after the initials are inked');
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  assert.match(css, /\.flap-in\{transform:rotateX\(180deg\)/);
  assert.match(css, /@keyframes engrave\{from\{clip-path:inset\(100% 0 0 0\)\}to\{clip-path:inset\(0\)\}\}/);
  // the portrait card lies turned a quarter in the landscape pocket and turns upright as it rises
  assert.match(rule('.card'), /transform:rotate\(-90deg\) scale\(\.86\)/);
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
  assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the mats\' windows and the crest\'s shield where the build measured them', () => {
  const st = manifest.stage, a = String(st.aspect).replace(/^0\./, '\\.').replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open flap's height (it stands up there without covering the names)
  const flapH = String(Math.round(st.flap[3] * 100) / 10000).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.stage\\{--obj:[^;]*;[^}]*margin:calc\\(var\\(--obj\\) / ${a} \\* ${flapH} \\+ \\d+px\\) auto 0`));
  const num = (body: string, prop: string) => Number(new RegExp(`(?:^|;)${prop}:(-?[\\d.]+)%?(?:;|$)`).exec(body)?.[1]);
  const box = (sel: string, want: number[]) => {
    const b = rule(sel);
    for (const [i, prop] of ['left', 'top', 'width', 'height'].entries()) assert.ok(Math.abs(num(b, prop) - want[i]) < 0.011, `${sel} ${prop} ${num(b, prop)} ≠ manifest ${want[i]}`);
  };
  box('.front', st.front);
  box('.flap', st.flap);
  box('.tab', st.tab);
  box('.seal', st.seal);
  // the card: its upright size from the manifest, centred on the envelope (it lies turned a quarter until it rises)
  const cw = st.card.width_pct, ch = st.card.height_pct;
  box('.card', [(100 - cw) / 2, (100 - ch) / 2, cw, ch].map((v) => Math.round(v * 100) / 100));
  for (const [sel, k] of [['.mat', 'mat'], ['.mat-wide', 'mat_wide']] as const) {
    const [L, T, W, H] = manifest[k].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(pct(b, prop) - v) < 0.011, `${sel} ${prop}`);
    const [w, h] = manifest[k].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
  box('.crest>.crest-mono', manifest.crest.shield_pct);
  assert.match(rule('.crest'), new RegExp(`aspect-ratio:${manifest.crest.src_size.join('/')}`));
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
  // every photo is in a notched mat; it stands out white like blind embossing, then its tone flows in
  for (const p of ['home', 'story', 'details'] as const) assert.ok(cheerio.load(html[p])('.frame.mat.emboss[data-step], .frame.mat-wide.emboss[data-step]').length > 0, p);
  assert.equal(cheerio.load(html.story)('.moment .frame.mat.emboss[data-step="photo"] > .photo-slot + .cut').length, 3);
  assert.equal(cheerio.load(html.details)('.frame.mat-wide.emboss > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /\.js \.emboss\[data-step\] \.photo-slot>img\{filter:grayscale\(1\) brightness/);
  assert.match(css, /\.js \.emboss\[data-step\]\.in \.photo-slot>img\{filter:none/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.emboss\[data-step\] \.photo-slot>img\{filter:none!important\}/);
  // the crest on the home card: engraved as the scene enters, the initials (HTML) in its shield
  assert.equal(cheerio.load(html.home)('.hero-card > .crest[data-step="crest"] > .crest-art + .crest-mono[data-field="initials"]').length, 1);
  assert.match(css, /\.js \.crest\[data-step\]>\.crest-art\{clip-path:inset\(100% 0 0 0\)/);
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
});

test('demo route renders every page with the design\'s own sample photos (G155) and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/navy-ivory-crest\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/navy-ivory-crest, fictional couple)
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/navy-ivory-crest\/hero_portrait-\d+w\.webp/);
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
  demo.thank_you = { mode: 'on', message: 'Thank you for a day by the water.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card > .crest > .crest-mono[data-field="initials"]').text(), 'C&F', 'the crest stays, with the initials');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a day by the water/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the sweep, the seal, the flap, the card, the initials', () => {
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[0, 'shimmer'], [700, 'seal-lift'], [1300, 'paper-crisp'], [1700, 'slide-quick'], [2500, 'chime-warm'], [2900, 'pen']] });
});

test('RSVP keeps the shared form contract; a reply presses the shield seal and the GPT accents (petals, leaves) drift down', async () => {
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
  for (const n of [1, 2, 3]) assert.match(js, new RegExp(`img: 'img/accent_${n}-160\\.webp'`));
  assert.equal($('#reply .reply-box > .crest > .crest-mono[data-field="initials"]').text(), 'C&F');
  assert.equal($('#reply > .seal-press').length, 1);
  assert.match(css, /html\[data-rsvp-replied\] \.seal-press\{animation:press /);
});
