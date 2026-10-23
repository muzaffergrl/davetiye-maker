// Nocturne Lake Estate (22, G422): redesign of 2026-10-22 (docs/35 row 22), rebuilt on the pilot-39 structure (pilot
// G423) from the design's own layered GPT parts (PAKET 5R). The closed envelope (K23 strict: a portrait charcoal
// laid-paper envelope with a deep diamond flap edged in deckled gold foil, wrapped by a frosted vellum band with a
// hammered gold crescent brooch — not the V flap + wax seal of 01–21), its opening (glint, the crescent rises to stay as
// the moon, the band slides off, the flap opens on its top edge onto its painted night sky, light on the moon path, the
// card rises from behind the pocket, accents drift), the envelope geometry shared by the build and site.css, editable
// texts, scenes, the villa windows with measured windows (arched mask), the shutters on the story window's canvas, demo
// route, thank-you mode, audio cues, RSVP contract, print layout. Off sale ("preview") until approval.
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

const id = 'nocturne-lake-estate';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const css = read('site.css');
const js = read('site.js');
const manifest = JSON.parse(read('img/manifest.json'));
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rule = (sel: string) => {
  const m = new RegExp(`(?:^|\\n|\\})${esc(sel)}\\{([^}]*)\\}`).exec(css);
  assert.ok(m, `site.css ${sel}`);
  return m[1];
};
const num = (body: string, prop: string) => Number(new RegExp(`(?:^|;)${prop}:(-?[\\d.]+)%`).exec(body)?.[1]);
const close = (a: number, b: number, what: string) => assert.ok(Math.abs(a - b) < 0.011, `${what}: ${a} ≠ ${b}`);

test('Nocturne Lake Estate is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Nocturne Lake Estate');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '22_Nocturne_Lake_Estate');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Cinzel', 'Cormorant Garamond', 'Jost']);
  assert.deepEqual(DESIGN_STYLES[id], ['classic', 'destination']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '22_Nocturne_Lake_Estate');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/22_Nocturne_Lake_Estate/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Eleanor & Luca');
  assert.equal(a.date, '2027-09-18');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  assert.deepEqual(a.media.memory_photos, []);
  assert.equal(a.media.venue_image, null);
  for (const p of PAGES) for (const s of ['Eleanor', 'Luca', 'Villa Nocturne', 'Lake Como', 'September 18', 'E&amp;L', 'E&L']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, shimmer, card, pocket, flap (outside + night-sky inside), vellum band and brooch are separate layers; no V flap or wax seal', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .shimmer', '.envelope > .card', '.envelope > .front', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in', '.envelope > .vellum', '.envelope > .moon']) assert.equal(stage.find(sel).length, 1, sel);
  // not the V flap / wax seal of 01–21 and no Codex envelope-v3 controller any more
  assert.doesNotMatch(html.index + css, /v-flap|wax|seal|clip-path:\s*polygon|envelope-v3|opening-site/i);
  for (const f of ['envelope-v3.js', 'envelope-v3.css', 'opening-design.json', 'opening-site.js', 'interior.css', 'interior-motion.js', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);
  const [g0, gd] = step('glint'), [m0, md] = step('moon'), [v0, vd] = step('vellum'), [l0, ld] = step('flap'), [s0, sd] = step('light'), [r0, rd] = step('rise'), [w0, wd] = step('forward');
  const acc = Number(/accents: (\d+),/.exec(js)![1]);
  const go = Number(/go: (\d+)/.exec(js)![1]);
  // the closure acts first (the brooch, then the band), then the flap, then the card; ≤ 5.5 s in all
  assert.ok(g0 <= m0 && m0 < v0 && v0 < l0 && l0 < s0 && s0 < acc && acc < r0 && r0 < w0);
  assert.ok(v0 >= m0 + 400, 'the band only moves once the brooch has lifted off it');
  assert.ok(r0 >= l0 + ld, 'the card rises once the flap is open');
  assert.ok(go >= w0 + wd && go <= 5500, 'home only after the card came forward, within 5.5 s');
  assert.match(css, new RegExp(`\\.is-opening \\.moon::after\\{animation:glint ${gd}ms ${g0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.moon\\{animation:moon-rise ${md}ms ${m0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.vellum\\{animation:band-off ${vd}ms ${v0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${ld}ms ${l0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.shimmer\\{animation:shimmer ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.shimmer>i\\{animation:ripple ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  // the 3D flap shows its real GPT inside (the painted night sky), never a plain colour
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  assert.match(rule('.flap-in'), /^transform:rotateX\(180deg\);[^}]*background-image:url\(img\/flap_in-720\.webp\)/);
  assert.match(css, /\.flap-out,\.flap-in\{[^}]*backface-visibility:hidden/);
  // the moon stays above the envelope once the card has come forward (opened state = the keyframes' end)
  const end = /@keyframes moon-rise\{[\s\S]*?100%\{transform:([^}]*)\}\}/.exec(css)![1];
  assert.match(css, new RegExp(`\\.is-opened \\.moon\\{transform:${esc(end)}\\}`));
  assert.doesNotMatch(/@keyframes moon-rise\{[\s\S]*?\}\}/.exec(css)![0], /opacity:0/, 'the moon does not fade away');
  // no button or pill during the opening
  assert.match(css, /\.enter,\.replay\{display:none\}/);
  assert.match(css, /\.is-opened \.tap-hint,\.is-opening \.tap-hint\{display:none\}/);
  // the catalogue cover layout
  assert.equal($('.opening-heading [data-copy="envelope_kicker"]').text(), 'Together with their families');
  assert.equal($('.opening-heading h1.names [data-field="partners.0.display_name"]').length, 1);
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
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
  // a calm material ground: no full-bleed florals on the cover
  assert.doesNotMatch(html.index, /spray|florals/);
  assert.match(css, /\.page-opening\{[^}]*url\(img\/night-640\.webp\)/);
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the windows = the measured ones', async () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open flap's inside standing up (it stands there without covering the names)
  const inH = String(Math.round(st.flap_in_h * 10) / 1000).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.stage\\{--obj:[^;]*;[^}]*margin:calc\\(var\\(--obj\\) / ${a} \\* ${inH} \\+ \\d+px\\) auto 0`));
  const box = (sel: string, k: 'front' | 'flap' | 'vellum' | 'moon' | 'card') => {
    const b = rule(sel), [L, T, W, H] = st[k];
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = num(b, prop);
      if (Number.isFinite(got)) close(got, v, `${sel} ${prop}`);
      else assert.equal(v, 0, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  box('.front', 'front');
  box('.flap', 'flap');
  box('.vellum', 'vellum');
  box('.moon', 'moon');
  box('.card', 'card');
  // the inside of the flap: as wide as the envelope, its own height (stage.flap_in_h) in % of the flap's box
  close(num(rule('.flap-in'), 'height'), Math.round(10000 * st.flap_in_h / st.flap[3]) / 100, '.flap-in height');
  // the band covers the flap's point, the brooch sits on the band, the card stays inside the pocket
  assert.ok(st.vellum[1] < st.flap[3] && st.vellum[1] + st.vellum[3] > st.flap[3], 'the flap\'s point is under the band');
  close(st.moon[1] + st.moon[3] / 2, st.vellum[1] + st.vellum[3] / 2, 'brooch centre = band centre');
  assert.ok(st.card[1] + st.card[3] <= 100 && st.card[0] >= 0 && st.card[0] + st.card[2] <= 100, 'card inside the envelope');
  assert.ok(st.card[1] > st.front[1], 'the card sits below the pocket\'s top edge (the lake shows above it)');
  // the villa windows: photo in the measured window (+0.5 % under the frame on each side), aspect = the part
  for (const [sel, k2] of [['.arch', 'window'], ['.storywin', 'story'], ['.terrace', 'terrace']] as const) {
    const [L, T, W, H] = manifest[k2].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) close(num(b, prop), v, `${sel} ${prop}`);
    const [w, h] = manifest[k2].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
  // the arch is not a rectangle: its measured window becomes the alpha mask (technical, no drawing)
  assert.equal(manifest.window.mask, 'mask_arch.png');
  assert.match(rule('.arch>.photo-slot'), /mask:url\(img\/mask_arch\.png\)/);
  const mask = await sharp(path.join(ROOT, 'themes', id, 'img/mask_arch.png')).metadata();
  assert.equal(mask.hasAlpha, true);
  // the shutters on the story window's canvas, placed in % of the cut frame
  for (const [sel, k] of [['.shutter.sh-l', 'shutter_l'], ['.shutter.sh-r', 'shutter_r']] as const) {
    const [L, T, W, H] = manifest.shutters[k], b = rule(sel);
    close(num(b, 'left'), L, `${sel} left`);
    close(num(b, 'top'), T, `${sel} top`);
    close(num(b, 'width'), W, `${sel} width`);
    close(num(b, 'height'), H, `${sel} height`);
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
  assert.equal(cheerio.load(html.home)('.hero-moon[data-step]').length, 1, 'the moon reappears small on home');
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
  // every photo sits in a GPT villa window; the story's windows have their two shutters (story + teaser)
  assert.equal(cheerio.load(html.home)('.frame.arch.villa[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.story)('.moments .moment[data-scene] .frame.storywin.villa > .photo-slot + .cut + .shutter.sh-l + .shutter.sh-r').length, 3);
  assert.equal(cheerio.load(html.home)('.teaser .frame.storywin.villa > .shutter').length, 2);
  assert.equal(cheerio.load(html.details)('.frame.terrace.villa > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /\.js \.villa\[data-step\]\.in>\.shutter\.sh-l\{animation:shutter-l /);
  assert.match(css, /@keyframes shutter-l\{to\{transform:rotateY\(-\d+deg\)\}\}/);
  assert.match(css, /@keyframes shutter-r\{to\{transform:rotateY\(\d+deg\)\}\}/);
  // reduced motion: the shutters stay open (hidden), the photos plain, the light effects off
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.villa>\.shutter\{display:none\}/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.card::after,\.moon::after,\.shimmer,\.sparks\{display:none\}/);
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
    assert.match(data.pages.home, /^\/start\/demo\/nocturne-lake-estate\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/nocturne-lake-estate, fictional couple)
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/nocturne-lake-estate\/hero_portrait-\d+w\.webp/);
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
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a piece of the painted lake, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the glint, the moon rising, the band, the flap, the card — on the MOTION times', () => {
  const sound = designSound(id);
  assert.deepEqual(sound, { music: 'evening-strings', opening: [[0, 'chime'], [200, 'whoosh'], [800, 'slide'], [1500, 'paper'], [2500, 'slide']] });
  const at = (k: string) => Number(new RegExp(`${k}: \\[(\\d+), `).exec(js)![1]);
  assert.deepEqual(sound!.opening.map(([t]) => t), [at('glint'), at('moon'), at('vellum'), at('flap'), at('rise')]);
});

test('RSVP keeps the shared form contract; a reply is answered with the GPT accents and the lantern', async () => {
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
  assert.equal($('.signature .lantern .flame').length, 1);
  assert.match(css, /html\[data-rsvp-replied\] \.lantern>\.flame\{animation:flame-up/);
  for (const n of ['flake', 'petal', 'spark']) assert.match(js, new RegExp(`img: 'img/${n}-160\\.webp'`));
});
