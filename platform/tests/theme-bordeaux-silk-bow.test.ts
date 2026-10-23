// Bordeaux Silk Bow (46, G446): fourth wave (docs/33, docs/34), built from the design's own GPT parts. The closed
// envelope (K23 strict: a portrait ivory linen envelope with a straight flap, closed by a claret satin ribbon through
// two punched holes tied in a big bow — not the V flap of 01–21), its opening (the bow unties loop by loop, the band is
// pulled up through the hole, the ribbon runs down the screen edge, the flap swings up on its top edge, the card
// rises), the envelope geometry shared by the build and site.css, the ribbon down the home page, editable texts,
// scenes, the deck of keepsake prints whose ribbon loosens, demo route, thank-you mode, audio cues, RSVP contract,
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

const id = 'bordeaux-silk-bow';
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

test('Bordeaux Silk Bow is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Bordeaux Silk Bow');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'coming');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '46_Bordeaux_Silk_Bow');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_STYLES[id], ['classic', 'seasonal']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '46_Bordeaux_Silk_Bow');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/46_Bordeaux_Silk_Bow/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Cecilia & Nathaniel');
  assert.equal(a.date, '2027-12-04');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Cecilia', 'Nathaniel', 'Linden', 'Philadelphia', 'December 4', 'C&amp;N', 'C&N']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, pocket, flap (outside + lining), the untied band and the two halves of the bow are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .front', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in', '.envelope > .knot', '.envelope > .bow.b-l', '.envelope > .bow.b-r']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal(stage.children('.tulips-top').length, 1, 'the tulips over the closed envelope');
  assert.equal($('main.opening > .ribbon-fall').length, 1, 'the ribbon that runs down the screen edge');
  // not the V flap of 01–21: a straight flap (its own GPT part; no clip-path polygon, no v-flap)
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon/i);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);
  const [l0, lg, ld] = /loops: \[(\d+), (\d+), (\d+)\]/.exec(js)!.slice(1).map(Number);
  const [k0, kd] = step('knot'), [p0, pd] = step('pull'), [f0, fd] = step('fall'), [t0, td] = step('tulips');
  const [o0, od] = step('flap'), [r0, rd] = step('rise'), [w0, wd] = step('forward');
  assert.ok(l0 < k0 && l0 + lg + ld <= p0 && p0 < f0 && p0 + pd <= o0 && t0 < o0 && o0 < r0 && r0 < w0);
  assert.match(css, new RegExp(`\\.is-opening \\.bow\\.b-l\\{animation:untie-l ${ld}ms ${l0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.bow\\.b-r\\{animation:untie-r ${ld}ms ${l0 + lg}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.knot\\{animation:knot-in ${kd}ms ${k0}ms [^,]+,knot-pull ${pd}ms ${p0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.opening>\\.ribbon-fall\\{animation:ribbon-fall ${fd}ms ${f0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.stage>\\.tulips-top\\{animation:tulips-off ${td}ms ${t0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${od}ms ${o0}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.ok(Number(/go: (\d+)/.exec(js)![1]) >= w0 + wd, 'home only after the card came forward');
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  assert.match(css, /\.flap-in\{transform:rotateX\(180deg\)/);
  assert.match(css, /\.is-opened \.opening>\.ribbon-fall\{clip-path:none\}/);
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

test('one envelope geometry: the build\'s manifest stage = site.css layers; the bow unties towards its knot; the band sits between the holes', () => {
  const st = manifest.stage, a = String(st.aspect).replace(/^0\./, '\\.');
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
  box('.knot', st.knot);
  box('.card', st.card);
  box('.bow.b-l', st.bow_l);
  box('.bow.b-r', st.bow_r);
  // each half unties towards the knot: its transform-origin is the knot centre in its own box
  const [kx, ky] = st.knot_center;
  for (const [sel, k] of [['.bow.b-l', 'bow_l'], ['.bow.b-r', 'bow_r']] as const) {
    const [L, T, W, H] = st[k];
    const m = /transform-origin:(-?[\d.]+)% (-?[\d.]+)%/.exec(rule(sel))!;
    assert.ok(Math.abs(Number(m[1]) - (100 * (kx - L)) / W) < 0.06 && Math.abs(Number(m[2]) - (100 * (ky - T)) / H) < 0.06, `${sel} origin`);
  }
  // the band runs from the flap's hole to the pocket's hole
  const [hf, hp] = st.holes;
  assert.ok(st.knot[1] < hf && st.knot[1] + st.knot[3] > hp);
  for (const [sel, k] of [['.print', 'print'], ['.print-wide', 'print_wide']] as const) {
    const [L, T, W, H] = manifest[k].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(pct(b, prop) - v) < 0.011, `${sel} ${prop}`);
    const [w, h] = manifest[k].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
  // the deck ribbon sits on its print where the build measured it
  const [bl, bt, bw, bh] = manifest.bundle_place.print;
  box('.print>.bundle', [bl, bt, bw, bh]);
  box('.deck>.bundle', [bl, bt, bw, bh]);
  // the ribbon down the page edge: the S-curl at the straight ribbon's scale, its ends over the straight run
  const r = manifest.ribbon, [tw] = r.tile, [cw, ch] = r.curl;
  const curl = rule('.ribbon>.curl');
  assert.match(curl, new RegExp(`aspect-ratio:${cw}/${ch}`));
  assert.ok(Math.abs(Number(/width:calc\(var\(--rw\) \* ([\d.]+)\)/.exec(curl)![1]) - cw / tw) < 0.0005, 'curl width');
  assert.ok(Math.abs(Number(/left:calc\(var\(--rw\) \* -([\d.]+)\)/.exec(curl)![1]) - (r.curl_end[0] / 100) * (cw / tw)) < 0.0006, 'curl ends over the run');
  assert.ok(Math.abs(Number(/top:calc\(var\(--rw\) \* ([\d.]+) - 1px\)/.exec(rule('.ribbon>.run'))![1]) - ch / tw) < 0.001, 'the run starts under the curl');
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
  // every photo is a black-and-white keepsake print; the story's are tied with ribbon that loosens, home's deck fans out
  for (const p of ['home', 'story', 'details'] as const) assert.ok(cheerio.load(html[p])('.frame.print, .frame.print-wide').length > 0, p);
  assert.equal(cheerio.load(html.story)('.moment .frame.print.tied[data-step="photo"] > .photo-slot + .cut + .bundle').length, 3);
  assert.equal(cheerio.load(html.home)('.teaser .deck[data-step] > .dk.frame.print > .photo-slot[data-slot]').length, 3);
  assert.equal(cheerio.load(html.home)('.teaser .deck > .bundle').length, 1);
  assert.equal(cheerio.load(html.details)('.frame.print-wide > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /\.print \.photo-slot>img\{filter:grayscale\(1\)/);
  assert.match(css, /\.js \.deck\[data-step\]\.in>\.bundle\{animation:loosen /);
  assert.match(css, /\.js \.tied\[data-step\]\.in>\.bundle\{animation:loosen /);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.deck\[data-step\]>\.bundle,\.js \.tied\[data-step\]>\.bundle\{animation:none!important\}/);
  // the ribbon down the home page: one per section (the hero's straight, the others start with a curl), drawn on downwards
  const $h = cheerio.load(html.home);
  assert.equal($h('.has-ribbon > .ribbon[data-step="ribbon"]').length, 4);
  assert.equal($h('.hero > .ribbon.straight > .run').length, 1);
  assert.equal($h('.has-ribbon > .ribbon:not(.straight) > .curl + .run').length, 3);
  assert.equal($h('.claret-band .ribbon').length, 0, 'it goes behind the claret band');
  assert.match(css, /\.js \.ribbon\[data-step\]\.in\{clip-path:inset\(0\)\}/);
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
    assert.match(data.pages.home, /^\/start\/demo\/bordeaux-silk-bow\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/bordeaux-silk-bow, fictional couple)
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/bordeaux-silk-bow\/hero_portrait-\d+w\.webp/);
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
  demo.thank_you = { mode: 'on', message: 'Thank you for a winter evening in the city.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a spray of the tulips, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a winter evening in the city/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds: the bow, the ribbon pulled through, the flap, the card', () => {
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[0, 'bow'], [1000, 'ribbon'], [1500, 'paper-soft'], [2100, 'slide-quick'], [2750, 'chime-warm']] });
});

test('RSVP keeps the shared form contract; a reply ties the bow again and the GPT accents (petals, ribbon ends) drift down', async () => {
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
  for (const n of [1, 2, 3].slice(0, 2)) assert.match(js, new RegExp(`img: 'img/accent_${n}-160\\.webp'`));
  assert.equal($('.reply-card .reply-box > .bow-small').length, 1);
  assert.match(css, /html\[data-rsvp-replied\] \.reply-box>\.bow-small\{animation:retie /);
});
