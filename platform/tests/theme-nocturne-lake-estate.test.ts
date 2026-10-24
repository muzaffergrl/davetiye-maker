// Nocturne Lake Estate (22) v2 of 2026-10-24: rebuilt after its GPT design board (PAKET 8 "The moon is missing") from
// the PAKET 8 parts. The closed envelope (a black cotton envelope whose flap is die-cut along two mountain ridges, the
// champagne-gold moon seal in its valley), its opening (the seal clicks free and rises into the empty sky to become the
// moon, the flap lifts onto its gold moiré inside, the card is drawn from the pocket and comes forward), the envelope
// geometry shared by the build and site.css, editable texts, scenes, the measured frame windows, the story photographs
// over the water, the moon-path programme, the gilt card, demo route, thank-you mode, its own sounds, the RSVP contract,
// K21 (nothing drawn: no SVG, no data images, every url() a theme image). Off sale ("preview") until approval.
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
import { DESIGN_COPY, openingObject } from '../lib/marketing/designs.ts';
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
const close = (a: number, b: number, what: string, tol = 0.011) => assert.ok(Math.abs(a - b) < tol, `${what}: ${a} ≠ ${b}`);
const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`\\b${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);

test('Nocturne Lake Estate is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Nocturne Lake Estate');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '22_Nocturne_Lake_Estate');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '22_Nocturne_Lake_Estate');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('fonts: Waterfall (names, script headings) + Castoro Titling (capitals) + Castoro (body) on every page, measured fallbacks', () => {
  for (const p of PAGES) {
    assert.match(html[p], /fonts\.googleapis\.com\/css2\?family=Castoro:ital@0;1&family=Castoro\+Titling&family=Waterfall&display=swap/, p);
    assert.match(html[p], /@font-face\{font-family:fb1;[^}]*size-adjust:[\d.]+%/, `${p}: fb1`);
    assert.doesNotMatch(html[p], /Cinzel|Jost|Cormorant/, p);
  }
  assert.match(css, /--script:'Waterfall',fb1,fb2,cursive;--caps:'Castoro Titling'/);
  // Waterfall has thin strokes: the script is only used large (≥ 32 px) — names, headings, the card's names (≥ 11cqw)
  for (const m of css.matchAll(/font:400 ([^;}]*) var\(--script\)/g)) {
    const size = m[1];
    const min = /clamp\((\d+)px/.exec(size)?.[1] ?? /^(\d+)px/.exec(size)?.[1];
    if (min) assert.ok(Number(min) >= 32, `script at ${size}`);
  }
});

test('demo record = collection record, fictional, URLs and media empty, its own music', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/22_Nocturne_Lake_Estate/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Eleanor & Luca');
  assert.equal(a.date, '2027-09-18');
  assert.equal(a.audio.music, 'moonlit-terrace');
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

test('envelope — the moon seal, the mountain flap and its moiré inside, back, pocket and card are separate layers; the opening order', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.env > .env-inside', '.env > .env-back', '.env > .card-well > .env-card', '.env > .env-pocket', '.env > .env-flap', '.env > .env-seal']) assert.equal(stage.find(sel).length, 1, sel);
  // the initials are live text on the seal's smooth centre; the moon waits in the empty sky
  assert.equal(stage.find('.env-seal [data-field="initials"]').length, 1);
  assert.equal($('.night > .sky-moon img[src="img/moon-320.webp"]').length, 1);
  assert.match(css, /\.page-opening \.sky-moon,\.page-opening \.moon-halo\{opacity:0\}/);
  // the steps: tick, rise, flap, moon, draw, reveal in this order; the CSS keyframes carry the same numbers
  const [t0] = step('tick'), [r0, rd] = step('rise'), [f0] = step('flap'), [m0] = step('moon'), [d0, dd] = step('draw'), [v0, vd] = step('reveal');
  const go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(t0 === 0 && t0 < r0 && r0 < f0 && f0 < m0 && m0 < d0 && d0 < v0);
  assert.ok(m0 >= r0 + rd - 100, 'the moon settles as the seal arrives');
  assert.ok(v0 >= d0 + dd, 'the card comes forward once it is out of the pocket');
  assert.ok(go >= v0 + vd && go <= 5000, 'home after the card came forward, within 5 s');
  assert.match(css, new RegExp(`\\.is-opening \\.env-flap\\{animation:flap-up \\.32s \\.${String(f0).padStart(3, '0').replace(/0+$/, '')}s`));
  assert.match(css, new RegExp(`\\.is-opening \\.env-card\\{animation:show \\.01s [\\d.]+s forwards,draw \\.${String(dd).replace(/0+$/, '')}s ${d0 / 1000}s`));
  assert.match(css, new RegExp(`\\.is-opening \\.path-light\\{animation:path-run [\\d.]+s ${m0 / 1000}s`));
  // the flap lifts to edge-on, then its inside stands up from edge-on (3D, no backface trick, no plain colour)
  assert.match(css, /@keyframes flap-up\{to\{transform:rotateX\(90deg\);visibility:hidden\}\}/);
  assert.match(css, /@keyframes flap-in\{from\{visibility:visible;transform:rotateX\(-90deg\)/);
  assert.match(js, /at\(E\.rise\[0\], rise\)/);
  assert.match(js, /fly\.className = 'seal-fly'/);
  // no button or pill during the opening; the opened state shows Enter + Replay
  assert.match(css, /\.enter,\.replay\{display:none\}/);
  assert.match(css, /\.is-opening \.tap-hint,\.is-opened \.tap-hint\{display:none\}/);
  assert.match(css, /\.is-opened \.enter,\.is-opened \.replay\{display:inline-flex\}/);
  assert.equal($('.opening-heading [data-copy="envelope_kicker"]').text(), 'You are invited');
  assert.equal($('.opening-heading h1.names [data-field="partners.0.display_name"]').length, 1);
  assert.equal($('.opening-actions .tap-hint').length, 1);
  assert.equal($('.replay').length, 1);
  assert.equal($('.replay[hidden]').length, 0);
  assert.equal($('a[data-enter][href="home.html"]').length, 1);
  assert.equal($('a[data-skip][href="home.html"]').length, 1);
  assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
  assert.equal($('noscript').length, 0);
  assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
  assert.equal(stage.find('.env-card [data-slot="hero_portrait"] img[data-photo="hero_portrait"]').length, 1);
  assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the frame windows = the measured holes', async () => {
  const st = manifest.stage;
  assert.match(rule('.stage'), new RegExp(`aspect-ratio:${esc(String(st.aspect))}`));
  assert.match(rule('.stage'), new RegExp(`\\* ${esc(String(st.aspect))}\\)`));
  close(num(rule('.env-flap'), 'height'), st.flap_h, '.env-flap height');
  close(num(rule('.env-inside'), 'height'), st.flap_in_h, '.env-inside height');
  const seal = rule('.env-seal');
  for (const [prop, v] of [['left', st.seal[0]], ['top', st.seal[1]], ['width', st.seal[2]], ['height', st.seal[3]]] as const) close(num(seal, prop), v, `.env-seal ${prop}`);
  const card = rule('.env-card');
  close(num(card, 'left'), st.card[0], '.env-card left');
  close(num(card, 'top'), st.card[1], '.env-card top');
  close(num(card, 'width'), st.card[2], '.env-card width');
  assert.match(card, new RegExp(`aspect-ratio:${esc(String(st.card_ratio))}`));
  // the seal sits on the valley's lowest point; the card lies inside the pocket, under its top edge
  close(st.seal[0] + st.seal[2] / 2, st.valley[0], 'seal centre x = valley', 0.02);
  assert.ok(st.seal[1] < st.valley[1] && st.seal[1] + st.seal[3] > st.valley[1], 'the seal covers the valley');
  assert.ok(st.card[1] > st.pocket_top && st.card[1] + st.card[3] <= 100, 'card inside the pocket');
  assert.ok(st.flap_cut.method === 'renk' && st.flap_cut.residual_sd < 2, 'the flap is cut along its gold hairline, not a geometric guess');
  // the photo windows: measured from the parts' alpha holes, the photo box = window + a little bleed under the frame
  const win = (k: string) => manifest[k].window_pct as number[];
  const near = (sel: string, w: number[]) => {
    const b = rule(sel);
    for (const [i, prop] of ['left', 'top', 'width', 'height'].entries()) {
      const got = num(b, prop), want = w[i], bleed = i < 2 ? -1 : 2;
      assert.ok(Math.abs(got - want) <= Math.abs(bleed) + 0.3 && (i < 2 ? got <= want + 0.05 : got >= want - 0.05), `${sel} ${prop}: ${got} vs window ${want}`);
    }
  };
  near('.env-card .framed', win('card'));
  near('.hero-portrait .framed', win('frame_arch'));
  near('.float-photo>.land-photo', win('frame_land'));
  for (const [k, mask] of [['card', 'mask_card.png'], ['frame_arch', 'mask_arch.png']] as const) {
    assert.equal(manifest[k].mask, mask);
    const meta = await sharp(path.join(ROOT, 'themes', id, 'img', mask)).metadata();
    assert.equal(meta.hasAlpha, true, mask);
  }
  assert.match(rule('.hero-portrait'), new RegExp(`aspect-ratio:${manifest.frame_arch.src_size.join('/')}`));
  assert.match(rule('.float-photo'), new RegExp(`aspect-ratio:${manifest.frame_land.src_size.join('/')}`));
});

test('session keys per site, view transitions, scenes, placeholders, countdown, K21', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.hero-portrait \.framed\{view-transition-name:invite-card\}/);
  assert.match(css, /\.from-envelope \.hero-portrait\[data-step\]\{opacity:1;transform:none;transition:none\}/);
  // the moon carries the site: the opening's moon becomes home's (view transition sky-moon)
  assert.match(css, /\.is-opening \.sky-moon,\.is-opened \.sky-moon,\.page-home \.sky-moon\{view-transition-name:sky-moon\}/);
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
  for (const r of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(r, /border|outline|box-shadow/, r);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)#]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  for (const f of ['site.css', 'thank-you.css', 'site.js', ...PAGES.map((p) => `${p}.html`)]) {
    for (const m of read(f).matchAll(/img\/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png))/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[1])), `${f}: img/${m[1]}`);
  }
});

test('the pages follow the board: photographs over water, the moon-path programme with icons, the gilt card', () => {
  const home = cheerio.load(html.home), story = cheerio.load(html.story), details = cheerio.load(html.details), rsvp = cheerio.load(html.rsvp);
  assert.equal(home('.hero .night > .sky-moon').length, 1, 'home: the moon in its sky');
  assert.equal(home('.hero > .balustrade').length, 1, 'home: the balustrade in front of the lake');
  assert.equal(home('.hero-portrait > .framed [data-slot="hero_portrait"]').length, 1);
  assert.equal(home('.hero-portrait > img.arch-frame').length, 1);
  // each story photograph floats over the water with its own reflection (the same slot, mirrored by CSS)
  assert.equal(story('.slide .floating > .float-photo [data-slot]').length, 3);
  for (const n of [1, 2, 3]) assert.equal(story(`.slide .water .reflection img[data-photo="story_${n}"]`).length, 1, `story_${n} reflection`);
  assert.match(rule('.reflection img'), /transform:scaleY\(-1\)/);
  assert.equal(story('.chapter-no').text(), '', 'the chapter numeral is a CSS counter, not text');
  assert.match(css, /\.chapter-no::after\{content:counter\(ch,upper-roman\)\}/);
  assert.equal(home('.teaser .floating .water .reflection img[data-photo="story_1"]').length, 1);
  // details: the schedule hangs on the thread (the divider's own broken end), an icon per moment, the dress code last
  assert.equal(details('.schedule > li[data-repeat="schedule"] > .sched-icon').length, 1);
  assert.equal(details('.schedule > li.dress-row .icon-dress').length, 1);
  assert.match(css, /\.schedule::before,\.schedule::after\{[^}]*url\(img\/thread-44\.webp\)/);
  for (const k of ['rings', 'toast', 'dinner', 'dance', 'boat', 'dress']) assert.ok(existsSync(path.join(ROOT, 'themes', id, `img/icon-${k}-128.webp`)), k);
  assert.match(js, /\['rings', \/ceremon/);
  // the gilt card: three GPT slices, the middle repeats
  for (const page of [home, rsvp]) assert.equal(page('.gilt > .gilt-bg > i').length, 3);
  assert.match(rule('.gilt-bg>i:nth-child(2)'), /url\(img\/gilt_mid-720\.webp\) 0 0\/100% auto repeat-y/);
  assert.equal(rsvp('.reply-card .gilt [data-rsvp]').length, 1);
});

test('img/manifest.json: every PAKET 8 part used, og + favicon; build script, README and thank-you styles exist', () => {
  assert.deepEqual(manifest.parts.waiting_for_gpt, []);
  assert.equal(manifest.parts.used.length, 22);
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', manifest[k].file)), k);
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
  assert.ok(manifest.bytes_total <= 3_000_000, 'theme folder ≤ 3 MB');
  assert.ok(Buffer.byteLength(css) <= 45_000, 'site.css ≤ 45 KB');
  assert.ok(Buffer.byteLength(js) <= 35_000, 'site.js ≤ 35 KB');
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
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/nocturne-lake-estate\/hero_portrait-\d+w\.webp/);
    if (page === 'story') assert.equal($('.slide').length, 3);
  }
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-24'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for an evening we will treasure.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.env-card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.env-card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.env-card .ty-decor img').length, 1, 'no photo: the moon in the arch window, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('its own sounds (K59): tick, rise, flap, moon, draw, reveal on the MOTION times; leaf, ripple, press, clink on the pages', () => {
  const at = (k: string) => step(k)[0];
  const s = designSound(id);
  assert.equal(s.music, 'moonlit-terrace');
  assert.deepEqual(s.opening, [[at('tick'), 'tick'], [at('rise'), 'rise'], [at('flap'), 'flap'], [at('moon'), 'moon'], [at('draw'), 'draw'], [at('reveal'), 'reveal']]);
  for (const cue of ['leaf', 'ripple', 'press', 'clink']) assert.match(js, new RegExp(`sfx\\('${cue}'\\)`), cue);
});

test('RSVP keeps the shared form contract; a reply presses the moon seal and the moon brightens', async () => {
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
  assert.equal($('[data-rsvp-state="success"] .press-seal .seal-initials').text(), 'E&L', 'the initials on the pressed seal');
  assert.match(css, /\.is-sealing \.press-seal\{animation:seal-down /);
  assert.match(css, /html\[data-rsvp-replied\] \.page-rsvp \.sky-moon\{filter:brightness/);
});
