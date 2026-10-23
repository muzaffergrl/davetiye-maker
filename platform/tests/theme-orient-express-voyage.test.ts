// Orient Express Voyage (25, G425): redesign of 2026-10-22 (docs/35), rebuilt on the pilot-39 structure (as the pilot
// G423) from the design's own layered GPT parts (PAKET 5R). The closed ticket sleeve (K23 strict: a long bottle-green
// leather sleeve with an end tab on its right end, a brass turn-lock and a blank luggage tag — not the V flap of 01–21),
// its opening (the tag swings, the lock turns, the tab swings open on its right-hand hinge onto its silk inside, the
// ticket slides out to the right, turns upright and comes forward, accents drift), the sleeve geometry shared by the
// build and site.css, the 360 px budget of the slide-out, editable texts, scenes, the carriage windows with measured
// windows and masks, the route over the map, demo route, thank-you mode, audio cues, RSVP contract, print layout.
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
import { DESIGN_COPY, DESIGN_STYLES, openingObject } from '../lib/marketing/designs.ts';
import { designSound } from '../lib/audio/catalog.ts';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'orient-express-voyage';
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

test('Orient Express Voyage is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Orient Express Voyage');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '25_Orient_Express_Voyage');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Limelight', 'Cormorant Garamond']);
  assert.deepEqual(DESIGN_STYLES[id], ['classic', 'destination']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '25_Orient_Express_Voyage');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  assert.equal('variants' in JSON.parse(read('theme.json')), false, 'the old palettes went with the old art');
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/25_Orient_Express_Voyage/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Amelia & Rafael');
  assert.equal(a.date, '2027-09-25');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Amelia', 'Rafael', 'Ferrovia', 'Venice', 'September 25', 'A&amp;R', 'A&R']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('ticket sleeve — back, ticket, front, tag, tab (outside + silk inside), lock plate and turn button are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .front', '.envelope > .tag', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in', '.flap-out > .plate', '.flap-out > .key']) assert.equal(stage.find(sel).length, 1, sel);
  // the order of the layers (bottom → top): back, ticket, front, tag, tab
  assert.deepEqual(stage.find('.envelope').children().toArray().map((n) => $(n).attr('class')), ['back', 'card', 'front', 'tag', 'flap']);
  // not the V flap of 01–21 and no Codex envelope-v3 controller any more
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site/i);
  for (const f of ['envelope-v3.js', 'envelope-v3.css', 'opening-design.json', 'opening.css', 'interior.css', 'interior-motion.js', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const [w0, wd] = step('swing'), [k0, kd] = step('key'), [f0, fd] = step('flap'), [h0, hd] = step('shift'), [s0, sd] = step('slide');
  const [t0, td] = step('turn'), [n0, nd] = step('sink'), [o0, od] = step('forward'), [l0, ld] = step('light');
  const acc = Number(/accents: (\d+),/.exec(js)![1]), go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(w0 <= k0 && k0 + kd <= f0 && f0 + fd <= s0 && s0 < acc && s0 + sd <= t0 && t0 + td <= o0 && l0 > o0, 'tag → lock → tab → slide → turn → forward');
  assert.equal(h0, f0, 'the sleeve draws back as the tab opens');
  assert.equal(h0 + hd, s0 + sd, '… and until the ticket is out');
  assert.ok(go >= o0 + od && go <= 5500, 'home only after the ticket came forward, within 5.5 s');
  assert.match(css, new RegExp(`\\.is-opening \\.tag\\{animation:swing ${wd}ms ${w0}ms [^,]+,sink ${nd}ms ${n0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.key\\{animation:key-turn ${kd}ms ${k0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${fd}ms ${f0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope\\{animation:shift ${hd}ms ${h0}ms`));
  assert.match(css, new RegExp(`card-slide ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`card-turn ${td}ms ${t0}ms`));
  assert.match(css, new RegExp(`card-forward ${od}ms ${o0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope>\\.card::after\\{animation:sweep ${ld}ms ${l0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.back,\\.is-opening \\.front\\{animation:sink ${nd}ms ${n0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap-out,\\.is-opening \\.flap-in\\{animation:sink ${nd}ms ${n0}ms`));
  // the shift keyframe's middle stop = the end of the tab's swing inside the shift
  const mid = Number(/@keyframes shift\{0%\{transform:none\}([\d.]+)%/.exec(css)![1]);
  assert.ok(Math.abs(mid - 100 * fd / hd) < 0.01, 'shift: 10 % back while the tab opens');
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  // the tab: hinged on its right edge, 3D, its real GPT inside past 90° (never a plain colour); never an opacity on the
  // 3D tab itself (it would flatten its two faces)
  assert.match(rule('.flap'), /transform-origin:100% 50%;transform-style:preserve-3d/);
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(\d+px\) rotateY\(0\);z-index:5\}\nto\{transform:perspective\(\d+px\) rotateY\(180deg\);z-index:0\}\}/);
  assert.match(css, /\.flap-in\{transform:rotateY\(180deg\);background-image:url\(img\/flap_in-256\.webp\)\}/);
  assert.doesNotMatch(css, /\.flap\{[^}]*opacity|\.flap\{animation:[^}]*sink/);
  assert.match(css, /@keyframes key-turn\{[^\n]*100%\{transform:rotate\(90deg\)\}\}/);
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

test('one sleeve geometry: the build\'s manifest stage = site.css layers; the slide-out stays on a 360 px screen', () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.'), k0s = String(st.card_k0).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a};container-type:inline-size\\}`));
  const box = (sel: string, v4: number[]) => {
    const b = rule(sel), [L, T, W, H] = v4;
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) assert.ok(Math.abs(num(b, prop) - v) < 0.011, `${sel} ${prop} ${num(b, prop)} ≠ manifest ${v}`);
  };
  box('.front', st.front);
  box('.flap', st.flap);
  box('.tag', st.tag);
  box('.card', st.card);
  box('.plate', st.plate_in_flap);
  box('.key', st.key_in_flap);
  // the lock rides on the tab: the in-tab boxes are the canvas boxes relative to the tab's box
  const [fl, ft, fw, fh] = st.flap;
  assert.ok(Math.abs(st.plate[0] - (fl + fw * st.plate_in_flap[0] / 100)) < 0.05 && Math.abs(st.key[1] - (ft + fh * st.key_in_flap[1] / 100)) < 0.05);
  // the tag swings about its grommet; the ticket lies sideways in the sleeve at card_k0
  assert.match(rule('.tag'), new RegExp(`transform-origin:${st.tag_pivot[0]}% ${st.tag_pivot[1]}%`));
  assert.match(rule('.card'), new RegExp(`transform:rotate\\(-90deg\\) scale\\(${k0s}\\)`));
  assert.match(css, new RegExp(`@keyframes card-slide\\{from\\{transform:translate\\(0,0\\) rotate\\(-90deg\\) scale\\(${k0s}\\)\\}`));
  // under the sleeve: the tag's overhang; the stage's padding-bottom = it
  const overhang = (st.tag[1] + st.tag[3] - 100) / 100;
  assert.match(rule('.stage'), new RegExp(`padding-bottom:calc\\(var\\(--obj\\) / ${a} \\* ${String(+overhang.toFixed(4)).replace(/^0\./, '\\.')}\\)`));
  // the 360 px budget (docs/35 row 25): at --obj = 62vw the sleeve, drawn back 22 %, with the open tab and the ticket
  // out of its mouth (slid 48 % of the sleeve's width) stays inside a 360 px screen with ≥ 12 px to spare
  assert.match(rule('.stage'), /--obj:min\(62vw,/);
  const W = 0.62 * 360, shift = Number(/100%\{transform:translateX\(-([\d.]+)%\)\}\}/.exec(css)![1]) / 100;
  const slide = Number(/to\{transform:translate\(([\d.]+)cqw,0\) rotate\(-90deg\)/.exec(css)![1]) / 100;
  const k0 = st.card_k0, sideways = st.card[2] / 100 * k0 / st.card_ratio;   // the ticket's long side in the sleeve
  const cardRight = 180 + W * (-0.5 - shift + (st.card[0] + st.card[2] / 2) / 100 + sideways / 2 + slide);
  const sleeveLeft = 180 + W * (-0.5 - shift);
  const tabRight = 180 + W * (-0.5 - shift + (st.flap[0] + 2 * st.flap[2]) / 100);
  assert.ok(cardRight <= 360 - 12, `ticket right edge ${cardRight.toFixed(1)} px`);
  assert.ok(sleeveLeft >= 12, `sleeve left edge ${sleeveLeft.toFixed(1)} px`);
  assert.ok(tabRight <= 360 - 12, `open tab ${tabRight.toFixed(1)} px`);
  // the ticket clears the mouth before it turns
  const leftEnd = (st.card[0] + st.card[2] / 2) / 100 - sideways / 2 + slide;
  assert.ok(leftEnd >= 1, `ticket's left end ${leftEnd.toFixed(3)} of the sleeve width is out of the mouth`);
});

test('carriage windows: frames = the parts, photo slots = the measured windows, masks = the measured rounded windows', () => {
  for (const [sel, k] of [['.carriage', 'carriage'], ['.sash', 'sash'], ['.panorama', 'panorama']] as const) {
    const [L, T, W, H] = manifest[k].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(num(b, prop) - v) < 0.011, `${sel} ${prop}`);
    assert.match(b, new RegExp(`mask-image:url\\(img/${manifest[k].mask.file.replace('.', '\\.')}\\)`), `${sel} mask`);
    assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', manifest[k].mask.file)), manifest[k].mask.file);
    const [w, h] = manifest[k].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
});

test('session keys per site, view transition, scenes, placeholders, countdown, route, scenery, K21', () => {
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
      assert.ok(steps.size > 0, `${p}: ${$(el).attr('data-scene')} in MOTION.scenes`);
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
  // every photo sits in a GPT carriage window; the sash windows lift their leather blind and pan with the scroll
  assert.equal(cheerio.load(html.home)('.frame.carriage.pane[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.story)('figure.window .frame.sash[data-scenery][data-step] > .photo-slot > .blind').length, 3);
  assert.equal(cheerio.load(html.details)('.frame.panorama.pane > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /\.js \.window \.sash\[data-step\]\.in \.blind\{animation:blind-up/);
  assert.match(css, /\.window \.photo-slot>img\{[^}]*transform:translateX\(var\(--pan,0%\)\)/);
  assert.match(js, /initScenery\(\);/);
  // pan × the photo's 130 % width stays inside its 15 % overhang on each side
  assert.ok(Number(/scenery: \{ pan: (\d+) \}/.exec(js)![1]) * 1.3 <= 15);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.frame>\.photo-slot::after,\.card::after\{display:none\}/);
  // the route over the map: 5 stations and the 4 legs between them; on the itinerary it follows the schedule rows
  for (const p of ['home', 'details'] as const) {
    const m = cheerio.load(html[p])('.route-map[data-route]');
    assert.equal(m.find('b.stop').length, 5, p);
    assert.equal(m.find('i.leg').length, 4, p);
  }
  assert.equal(cheerio.load(html.details)('.route-map[data-route-rows=".itinerary .schedule li"]').length, 1);
  assert.match(js, /initRoute\(\);/);
  for (const r of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(r, /border|outline|box-shadow/, r);
  // K21: no drawn shapes — no SVG, no inline data images, every url() is a theme image
  for (const f of ['site.css', 'thank-you.css', ...PAGES.map((p) => `${p}.html`)]) assert.doesNotMatch(read(f), /<svg|data:image/, f);
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  // every image the pages, CSS and JS name exists in img/
  for (const f of ['site.css', 'thank-you.css', 'site.js', ...PAGES.map((p) => `${p}.html`)]) {
    for (const m of read(f).matchAll(/img\/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png))/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[1])), `${f}: img/${m[1]}`);
  }
});

test('img/manifest.json: every PAKET 5R part used, no green left, og + favicon; build script, README and thank-you styles exist', () => {
  assert.deepEqual(manifest.parts.waiting_for_gpt, []);
  assert.equal(manifest.parts.used.length, 21);
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
    assert.match(data.pages.home, /^\/start\/demo\/orient-express-voyage\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/orient-express-voyage, fictional couple)
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/orient-express-voyage\/hero_portrait-\d+w\.webp/);
    if (page === 'story') assert.equal($('figure.window').length, 3);
    if (page === 'details') assert.equal($('.itinerary .schedule li').length, 5);
  }
});

test('thank-you mode closes RSVP, keeps the story and the ticket carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-21'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for travelling so far to be with us.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a piece of the green leather, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for travelling so far to be with us/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds = MOTION: the tag, the lock, the tab, the ticket, forward', () => {
  const [k0] = step('key'), [f0] = step('flap'), [s0] = step('slide'), [o0] = step('forward');
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[0, 'tap'], [k0, 'clasp'], [f0, 'paper'], [s0, 'slide'], [o0, 'chime']] });
});

test('RSVP keeps the shared form contract; a reply is answered with the GPT accents (punched discs, rose buds, steam)', async () => {
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
  for (const n of ['disc', 'bud', 'steam']) assert.match(js, new RegExp(`img: 'img/${n}-200\\.webp'`));
});
