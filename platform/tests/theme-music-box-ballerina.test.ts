// Music Box Ballerina (32, G432): redesign of 2026-10-22 (docs/35 row 32), rebuilt on the pilot structure (G423, 39)
// from the design's own layered GPT parts (PAKET 5R). The closed envelope (K23 strict: a horizontal rose-quartz satin
// envelope with a serpentine music-box lid, a filigree keyhole plate and a brass winding key — not the V flap of 01–21),
// its opening (the key turns twice, the lid swings up onto its mirror inside with the couple's portrait, the porcelain
// ballerina rises and turns two pirouettes, the card rises and comes forward, accents drift), the envelope geometry shared
// by the build and site.css, editable texts, scenes, the gilded mirrors with measured windows, demo route, thank-you mode,
// audio cues, RSVP contract, print layout. Off sale ("preview") until approval.
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

const id = 'music-box-ballerina';
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
const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`\\b${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);

test('Music Box Ballerina is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Music Box Ballerina');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '32_Music_Box_Ballerina');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Ballet', 'Gilda Display']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '32_Music_Box_Ballerina');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/32_Music_Box_Ballerina/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Juliette & Arthur');
  assert.equal(a.date, '2027-05-22');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Juliette', 'Arthur', 'Rosewell', 'Saratoga', 'May 22', 'J&amp;A', 'J&A']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, ballerina (front + back), pocket, lid (outside + mirror inside with the portrait), keyhole plate and key are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .ballerina > .bal-front', '.envelope > .ballerina > .bal-back', '.envelope > .front', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in > .flap-in-face', '.envelope > .flap > .flap-in > .mirror-photo[data-slot="hero_portrait"]', '.envelope > .flap > .esc', '.envelope > .flap > .key']) assert.equal(stage.find(sel).length, 1, sel);
  // layer order: back → card → ballerina → pocket → lid (plate and key ride on it)
  const order = stage.find('.envelope').children().toArray().map((n) => $(n).attr('class'));
  assert.deepEqual(order, ['back', 'card', 'ballerina', 'front', 'flap']);
  // the lid's inside is the real GPT mirror face with the photo under it — never a plain colour
  assert.match(rule('.flap-in-face'), /url\(img\/flap_in-720\.webp\)/);
  assert.match(css, /\.flap-in\{left:0;top:0;width:100%;height:[\d.]+%;transform:rotateX\(180deg\)\}/);
  assert.equal(stage.find('.mirror-photo img[data-photo="hero_portrait"]').length, 1);
  // not the V flap of 01–21 and no Codex envelope-v3 controller any more
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site/i);
  for (const f of ['envelope-v3.js', 'opening-design.json', 'interior.css', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const [k0, kd] = step('key'), [t0, td] = step('turn2'), [f0, fd] = step('flap'), [m0, md] = step('mirror'), [r0, rd] = step('rise');
  const [s0, sd] = step('spin'), [c0, cd] = step('card'), [l0, ld] = step('light'), [w0, wd] = step('forward');
  const acc = Number(/accents: (\d+),/.exec(js)![1]);
  assert.equal(t0, k0 + kd / 2, 'the second turn = the second half of the key keyframe');
  assert.equal(t0 + td, k0 + kd);
  assert.ok(k0 === 0 && f0 < k0 + kd + 100 && f0 < m0 && m0 < r0 && r0 < acc && acc < s0 && s0 < c0 && c0 < w0 && l0 < w0 + wd, 'closure first, then lid, mirror, ballerina, accents, spin, card');
  assert.ok(s0 >= r0 + rd - 100, 'she turns once she has risen');
  assert.match(css, new RegExp(`\\.is-opening \\.key\\{animation:wind ${kd}ms ${k0}ms`));
  assert.match(css, /@keyframes wind\{from\{transform:translateZ\(2px\) rotate\(0\)\}to\{transform:translateZ\(2px\) rotate\(720deg\)\}\}/);
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${fd}ms ${f0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.mirror-photo img\\{animation:clear ${md}ms ${m0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.mirror-photo::after\\{animation:sweep ${md}ms ${m0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.ballerina\\{animation:rise ${rd}ms ${r0}ms [^;]*?forwards,spin ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.ballerina \\.bal-front\\{animation:show-front ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.ballerina \\.bal-back\\{animation:show-back ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`card-rise ${cd}ms ${c0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope>\\.card::after\\{animation:sweep ${ld}ms ${l0}ms`));
  // two pirouettes = four half-turns through scaleX 0, the views swapped at each
  assert.match(css, /@keyframes spin\{0%,25%,50%,75%,100%\{transform:scaleX\(1\);opacity:1\}12\.5%,37\.5%,62\.5%,87\.5%\{transform:scaleX\(\.02\)/);
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  const go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(go >= w0 + wd, 'home only after the card came forward');
  assert.ok(go <= 5500, 'the whole opening ≤ 5.5 s');
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  // the catalogue cover layout; no button or pill during the opening
  assert.equal($('.opening-heading [data-copy="envelope_kicker"]').text(), 'Together with their families');
  assert.equal($('.opening-actions .opening-date [data-field="date"]').length, 1);
  assert.equal($('.opening-actions .tap-hint').length, 1);
  assert.equal($('.replay').length, 1);
  assert.equal($('a[data-enter][href="home.html"]').length, 1);
  assert.equal($('a[data-skip][href="home.html"]').length, 1);
  assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
  assert.equal($('noscript').length, 0);
  assert.equal($('[data-copy="envelope_close"]').length, 0, 'no "Close envelope" pill');
  assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
  assert.equal(stage.find('.card [data-field="name_display"]').length, 1);
  assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
  assert.match(css, /\.enter,\.replay\{display:none\}/);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the mirrors\' windows = the measured ones', () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open lid's height (the inside, standing): flap height × flap_in_h
  const lid = (st.flap[3] / 100) * (st.flap_in_h / 100);
  const gap = /\.stage\{--obj:[^;]*;[^}]*margin:calc\(var\(--obj\) \/ ([\d.]+) \* \.(\d+) \+ \d+px\) auto 0/.exec(css);
  assert.ok(gap, '.stage margin');
  assert.equal(Number(gap[1]), st.aspect);
  assert.ok(Math.abs(Number('0.' + gap[2]) - lid) < 0.0006, `gap ${gap[2]} ≠ lid ${lid}`);
  const box = (sel: string, v4: number[]) => {
    const b = rule(sel), [L, T, W, H] = v4;
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = pct(b, prop);
      if (Number.isFinite(got)) assert.ok(Math.abs(got - v) < 0.011, `${sel} ${prop} ${got} ≠ manifest ${v}`);
      else assert.equal(v, 0, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  box('.front', st.front);
  box('.flap', st.flap);
  box('.esc', st.esc);
  box('.key', st.key);
  box('.card', st.card);
  box('.ballerina', st.ballerina);
  assert.ok(Math.abs(pct(rule('.flap-in'), 'height') - st.flap_in_h) < 0.011, '.flap-in height');
  // the key turns round the keyhole: its box is centred on the measured keyhole
  const [kl, kt, kw, kh] = st.key;
  assert.ok(Math.abs(kl + kw / 2 - st.keyhole[0]) < 0.02, 'key centre x = keyhole');
  assert.ok(Math.abs((kt + kh / 2) * st.flap[3] / 100 - st.keyhole[1]) < 0.05, 'key centre y = keyhole');
  // the card stands inside the pocket; the ballerina waits fully below the pocket's lip until she rises
  assert.ok(st.card[1] + st.card[3] <= 100);
  const wait = Number(/\.ballerina\{[^}]*transform:translateY\((\d+)%\)/.exec(css)![1]);
  assert.ok(st.ballerina[1] + st.ballerina[3] * wait / 100 > st.lip_mid, 'hidden behind the lip before the rise');
  assert.match(css, new RegExp(`@keyframes rise\\{from\\{transform:translateY\\(${wait}%\\);opacity:0\\}`));
  const slot = (sel: string, k2: string) => {
    const [L, T, W, H] = manifest[k2].window_pct;
    const b = rule(sel);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(pct(b, prop) - v) < 0.011, `${sel} ${prop}`);
  };
  slot('.mirror-photo', 'flap_in');
  assert.match(rule('.mirror-photo'), /border-radius:50%/);
  for (const [sel, k2, oval] of [['.portrait', 'portrait', true], ['.mirror', 'mirror', true], ['.venue-frame', 'venue', false]] as const) {
    slot(`${sel}>.photo-slot`, k2);
    if (oval) assert.match(rule(`${sel}>.photo-slot`), /border-radius:50%/, `${sel}: oval window`);
    const [w, h] = manifest[k2].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
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
  // every photo sits in a GPT gilded mirror; it clears like a misted mirror, light passes over it (never with reduced motion)
  assert.equal(cheerio.load(html.home)('.frame.portrait.jewel[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.home)('.frame.mirror.jewel > .photo-slot[data-slot="story_1"]').length, 1);
  const story = cheerio.load(html.story);
  assert.equal(story('.moments .moment .frame.mirror.jewel > .photo-slot + .cut').length, 3);
  assert.equal(story('.moments .moment-right').length, 1, 'left – right – left');
  assert.equal(story('.moments .turn-row .figurine[data-step] > .bal-front + .bal-back').length, 2, 'the ballerina turns between the moments');
  assert.equal(cheerio.load(html.details)('.frame.venue-frame.jewel > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /\.js \.jewel\[data-step\]\.in>\.photo-slot::after/);
  assert.match(css, /\.js \.jewel\[data-step\]>\.photo-slot>img\{filter:blur\(8px\)/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.frame>\.photo-slot::after,\.card::after,\.mirror-photo::after\{display:none\}/);
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
  assert.equal(manifest.parts.used.length, 20);
  assert.deepEqual(manifest.checks.green, {});
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', manifest[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
  assert.ok(manifest.bytes_total <= 3_000_000, 'theme folder ≤ 3 MB');
  // the two ballerina views share one box (the scaleX swap keeps her outline)
  assert.deepEqual(manifest.bal_front.src_size, manifest.bal_back.src_size);
  const k = manifest.key.src_size;
  assert.equal(k[0], k[1], 'the key is cropped square round its rotation axis');
});

test('demo route renders every page with the design\'s own sample photos (G155) and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/music-box-ballerina\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/music-box-ballerina, fictional couple)
    if (page === 'home' || page === 'index') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/music-box-ballerina\/hero_portrait-\d+w\.webp/);
    if (page === 'story') assert.equal($('.moment').length, 3);
  }
});

test('thank-you mode closes RSVP, keeps the story; the card carries the thank-you title, the lid\'s mirror never a placeholder', async () => {
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
  assert.equal(index('.mirror-photo [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.mirror-photo .ty-decor img').length, 1, 'no photo: a piece of the blush satin, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds (G967) = MOTION: the key, the lid, the ballerina rising, her pirouettes to the comb, the card', () => {
  const at = (k: string) => Number(new RegExp(`\\b${k}: \\[(\\d+), `).exec(js)![1]);
  assert.deepEqual(designSound(id), { music: 'music-box', opening: [[at('key'), 'key'], [at('flap'), 'lid'], [at('rise'), 'slide-quick'], [at('spin'), 'comb'], [at('card'), 'slide']] });
});

test('RSVP keeps the shared form contract; a reply turns the key, spins the ballerina and drifts the GPT accents', async () => {
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
  assert.equal($('.reply-key').length, 1);
  assert.match(js, /root\.classList\.add\('is-replied'\)/);
  assert.match(css, /\.is-replied \.reply-key\{animation:turn-once/);
  assert.match(css, /\.is-replied \.rsvp-page \.figurine\{animation:half-spin/);
  for (const n of ['petal-160', 'pearl-160', 'tulle-200']) assert.match(js, new RegExp(`img: 'img/${n}\\.webp'`));
});
