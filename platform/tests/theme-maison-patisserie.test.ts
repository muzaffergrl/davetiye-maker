// Maison Pâtisserie (28, G428): redesign of 2026-10-22 (docs/35), rebuilt on the pilot-39 structure (G423 template) from
// the design's own layered GPT parts (PAKET 5R). The closed envelope (K23 strict: a landscape cream envelope with a
// shallow scalloped pistachio doily flap, wrapped by a rose sleeve band with gold scalloped edges, a rose satin bow on
// the band and a sugared rose bud on its knot — not the V flap of 01–21, not the old pâtisserie box), its opening (the
// bud rolls off, the bow is swapped for its untied tails, which slip away, the band slides off to the right, the flap
// opens in 3D onto its doily lining, the card rises from behind the pocket and comes forward, macarons and sugar pearls
// drop in), the envelope geometry shared by the build and site.css, editable texts, scenes, the frames with measured
// windows (icing oval, porcelain plate, shop window), the display-case shelf, demo route, thank-you mode, audio cues,
// RSVP contract, print layout. Off sale ("preview") until approval.
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

const id = 'maison-patisserie';
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

test('Maison Pâtisserie is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Maison Pâtisserie');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '28_Maison_Patisserie');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Parisienne', 'Italiana']);
  assert.deepEqual(DESIGN_STYLES[id], ['classic']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '28_Maison_Patisserie');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  assert.equal(JSON.parse(read('theme.json')).variants, undefined, 'the old palettes went with the old art');
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/28_Maison_Patisserie/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Camille & Oliver');
  assert.equal(a.date, '2027-06-12');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Camille', 'Oliver', 'Belle Rive', 'Newport', 'June 12', 'C&amp;O', 'C&O']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, pocket, flap (outside + lining), sleeve band, tied bow, untied tails and rose bud are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .front', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in', '.envelope > .band', '.envelope > .untied', '.envelope > .bow', '.envelope > .bud']) assert.equal(stage.find(sel).length, 1, sel);
  // not the V flap of 01–21 and no Codex envelope-v3 controller / interior any more
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site|interior\.css/i);
  for (const f of ['envelope-v3.js', 'envelope-v3.css', 'opening-design.json', 'opening-site.js', 'interior.css', 'interior-motion.js', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the steps in MOTION order: the closure acts first (bud, bow, tails, band), then the flap, the card, the accents
  const [d0, dd] = step('bud'), [u0, ud] = step('untie'), [t0, td] = step('ribbon'), [s0, sd] = step('sleeve'), [l0, ld] = step('flap'), [r0, rd] = step('rise'), [h0, hd] = step('light'), [w0, wd] = step('forward');
  const acc = Number(/accents: (\d+),/.exec(js)![1]), go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(d0 < u0 && u0 < t0 && t0 <= s0 && s0 < l0 && l0 < r0 && r0 < acc && acc < w0 && h0 < w0 + wd, 'order');
  assert.ok(s0 + sd <= l0 + 100, 'the band is gone before the flap opens');
  assert.ok(go >= w0 + wd && go <= 5500, 'home only after the card came forward, within 5.5 s');
  // the CSS keyframes carry the same numbers
  assert.match(css, new RegExp(`\\.is-opening \\.bud\\{animation:bud-off ${dd}ms ${d0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.bow\\{animation:untie ${ud}ms ${u0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.untied\\{animation:tails-in ${ud}ms ${u0}ms [^,]+,tails-off ${td}ms ${t0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.band\\{animation:sleeve-off ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${ld}ms ${l0}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope>\\.card::after\\{animation:sweep ${hd}ms ${h0}ms`));
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  // the sleeve slides off to the right, the 3D flap shows its real GPT inner face (never a plain colour)
  assert.match(css, /@keyframes sleeve-off\{[^\n]*translateX\(\d+%\)/);
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(1000px\) rotateX\(0\);z-index:4\}/);
  assert.match(rule('.flap-in'), /transform:rotateX\(180deg\);background-image:url\(img\/flap_in-720\.webp\)/);
  // three kinds of GPT accents drop in during the opening
  assert.equal((/open: \[[\s\S]*?\]\s*,\s*\n\s*reply/.exec(js)![0].match(/img: 'img\//g) ?? []).length, 3);
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
  // no button or pill appears during the opening ("Enter" and "Replay" only once opened)
  assert.match(css, /\.enter,\.replay\{display:none\}/);
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the frames\' windows = the measured ones', () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open flap's lining (it stands up there without covering the names)
  const fr = String(st.flap_in_ratio).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.stage\\{--obj:[^;]*;[^}]*margin:calc\\(var\\(--obj\\) / ${fr} \\+ \\d+px\\) auto 0`));
  const box = (sel: string, k: string) => {
    const b = rule(sel), [L, T, W, H] = st[k];
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = num(b, prop);
      if (Number.isFinite(got)) assert.ok(Math.abs(got - v) < 0.011, `${sel} ${prop} ${got} ≠ manifest ${v}`);
      else assert.equal(v, 0, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  for (const [sel, k] of [['.front', 'front'], ['.flap', 'flap'], ['.band', 'band'], ['.untied', 'untied'], ['.bow', 'bow'], ['.bud', 'bud'], ['.card', 'card']]) box(sel, k);
  // the lining keeps its own proportions inside the flap's box
  const flapBox = st.aspect / (st.flap[3] / 100);
  assert.ok(Math.abs(num(rule('.flap-in'), 'height') - 100 * flapBox / st.flap_in_ratio) < 0.05, 'lining height');
  // the card hides behind the flap and the pocket while the envelope is closed
  const [, cT, , cH] = st.card;
  assert.ok(cT + cH <= 100 && cT >= 0, 'card inside the envelope');
  assert.ok(st.flap[3] > st.front[1], 'flap overlaps the pocket');
  for (const [sel, k2] of [['.cameo', 'cameo'], ['.plate', 'plate'], ['.vitrine-frame', 'vitrine']] as const) {
    const [L, T, W, H] = manifest[k2].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(num(b, prop) - v) < 0.011, `${sel} ${prop}`);
    const [w, h] = manifest[k2].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
  // oval and round windows are clipped round; the shop window is a plain rectangle (measured; no mask needed)
  assert.match(rule('.cameo>.photo-slot'), /border-radius:50%/);
  assert.match(rule('.plate>.photo-slot'), /border-radius:50%/);
  assert.doesNotMatch(rule('.vitrine-frame>.photo-slot'), /border-radius|mask/);
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
  // every photo sits in a GPT frame; light passes over it as the scene enters (never with reduced motion)
  assert.equal(cheerio.load(html.home)('.frame.cameo.framed[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.home)('.teaser .frame.plate > .photo-slot[data-slot="story_1"] + .cut').length, 1);
  assert.equal(cheerio.load(html.story)('.vitrine-track[data-carousel] .plate-item .frame.plate > .photo-slot + .cut').length, 3);
  assert.equal(cheerio.load(html.story)('.display-case > .shelf').length, 1, 'the plates stand on the GPT glass shelf');
  assert.equal(cheerio.load(html.details)('.frame.vitrine-frame.framed > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /\.js \.framed\[data-step\]\.in>\.photo-slot::after/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.frame>\.photo-slot::after,\.card::after,\.bud::after\{display:none\}/);
  // the shelf: arrows and the count, wired in site.js
  assert.equal(cheerio.load(html.story)('[data-carousel-prev][data-copy-attr="aria-label:album_previous"]').length, 1);
  assert.match(js, /initShelf\(\);/);
  for (const r of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(r, /border|outline|box-shadow/, r);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  for (const f of ['site.css', 'thank-you.css', 'site.js', ...PAGES.map((p) => `${p}.html`)]) {
    for (const m of read(f).matchAll(/img\/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png))/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[1])), `${f}: img/${m[1]}`);
  }
  // fonts: Parisienne + Italiana on every page (Google Fonts, never packaged)
  for (const p of PAGES) assert.match(html[p], /fonts\.googleapis\.com\/css2\?family=Italiana&family=Parisienne&display=swap/, p);
  assert.match(css, /--script:'Parisienne',fb1,fb2,/);
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
    assert.match(data.pages.home, /^\/start\/demo\/maison-patisserie\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/maison-patisserie, fictional couple)
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/maison-patisserie\/hero_portrait-\d+w\.webp/);
    if (page === 'story') assert.equal($('.plate-item').length, 3);
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
  demo.thank_you = { mode: 'on', message: 'Thank you for an afternoon we will treasure.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: the sugared rose bud, never a placeholder');
  assert.match(index('.card .ty-decor img').attr('src') || '', /bud-240\.webp$/);
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an afternoon we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds = MOTION times: the bud, the bow, the band, the flap, the card', () => {
  const [d0] = step('bud'), [u0] = step('untie'), [s0] = step('sleeve'), [l0] = step('flap'), [r0] = step('rise');
  assert.deepEqual(designSound(id), { music: 'garden-waltz', opening: [[d0, 'tap'], [u0, 'ribbon'], [s0, 'whoosh'], [l0, 'paper'], [r0, 'slide']] });
});

test('RSVP keeps the shared form contract; a reply is answered with the GPT accents (sugar pearls, macarons, petals)', async () => {
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
  for (const n of ['pearl', 'macaron', 'petal']) assert.match(js, new RegExp(`img: 'img/${n}-160\\.webp'`));
  assert.match(js, /particles\('reply'/);
});
