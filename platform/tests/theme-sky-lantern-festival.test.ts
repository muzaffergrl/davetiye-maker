// Sky Lantern Festival (31, G431): redesign of 2026-10-22 (docs/35), rebuilt on the pilot-39 structure (G423 Velvet
// Jewel Box) from the design's own layered GPT parts (PAKET 5R). The closed envelope (K23 strict: a portrait dip-dyed
// dusk washi envelope with a lantern-belly flap, a paper sky lantern tied by an amber silk thread to a gold stud — not
// the V flap of 01–21), its opening (the lantern lights, the bow loosens, the lantern rises off the screen while far
// lanterns rise behind, the flap swings up on its top edge onto its real inner face, the card rises, accents drift), the
// envelope geometry shared by the build and site.css, editable texts, scenes, the rice-paper frames with measured
// windows (the arched lantern window by its measured mask), demo route, thank-you mode, audio cues, RSVP contract,
// print layout. Off sale ("preview") until approval.
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

const id = 'sky-lantern-festival';
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

test('Sky Lantern Festival is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Sky Lantern Festival');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '31_Sky_Lantern_Festival');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Corinthia', 'Bellefair']);
  assert.deepEqual(DESIGN_STYLES[id], ['classic']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '31_Sky_Lantern_Festival');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  assert.equal(JSON.parse(read('theme.json')).variants, undefined, 'the old palettes went with the old art');
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/31_Sky_Lantern_Festival/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Sophie & Daniel');
  assert.equal(a.date, '2027-09-18');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Sophie', 'Daniel', 'Meadowlark', 'Santa Barbara', 'September 18', 'S&amp;D', 'S&D']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, pocket, flap (outside + inside), thread, unlit + lit lantern and far lanterns are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .front', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in', '.envelope > .thread', '.envelope > .lantern > .unlit', '.envelope > .lantern > .lit', '.envelope > .lantern > .halo']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal($('.opening > .far-sky .far').length, 3, 'three far lanterns behind the envelope');
  // not the V flap of 01–21 and no Codex envelope-v3 controller any more
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site/i);
  for (const f of ['envelope-v3.js', 'envelope-v3.css', 'opening-design.json', 'opening-site.js', 'interior.css', 'interior-motion.js', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);
  const [h0, hd] = step('light'), [t0, td] = step('thread'), [l0, ld] = step('lift'), [f0, fd] = step('flap'), [r0, rd] = step('rise'), [w0, wd] = step('forward');
  const acc = Number(/accents: (\d+),/.exec(js)![1]);
  assert.ok(h0 < t0 && t0 < l0 && l0 < f0 && f0 < acc && acc < r0 && r0 < w0, 'the closure acts first: light, thread, lift, then flap, accents, card');
  assert.ok(l0 + ld <= f0 + fd, 'the lantern has left the screen before the flap is fully open');
  assert.match(css, new RegExp(`\\.is-opening \\.lantern>\\.lit\\{animation:light-up ${hd}ms ${h0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.lantern>\\.halo\\{animation:halo ${hd}ms ${h0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.thread\\{animation:untie ${td}ms ${t0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.lantern\\{animation:lift ${ld}ms ${l0}ms`));
  const far = JSON.parse(/far: (\[\[[^\n]*\]\]),/.exec(js)![1]) as [number, number][];
  assert.equal(far.length, 3);
  far.forEach(([d0, dd], i) => assert.match(css, new RegExp(`\\.is-opening \\.far\\.f${i + 1}\\{animation:far-rise ${dd}ms ${d0}ms`), `far ${i + 1}`));
  assert.equal(new Set(far.map((f) => f[1])).size, 3, 'parallax: three speeds');
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${fd}ms ${f0}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  const go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(go >= w0 + wd, 'home only after the card came forward');
  assert.ok(go <= 5500, 'opening ≤ 5.5 s');
  assert.match(css, /@keyframes lift\{[\s\S]*?100%\{transform:translate\(0,calc\(-100svh - \d+%\)\)/, 'the lantern leaves the screen upward');
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  assert.match(css, /\.flap-in\{transform:rotateX\(180deg\);background-image:url\(img\/flap_in-720\.webp\)\}/, 'the flap\'s real GPT inner face');
  // three kinds of GPT accents drift during the opening (seeds rise)
  assert.match(js, /open: \[\{ img: 'img\/gold-160\.webp'[^\n]*\n[^\n]*img\/petal-160\.webp[^\n]*\n[^\n]*img\/seed-160\.webp[^\n]*up: true/);
  // the catalogue cover layout; no button or pill during the opening
  assert.equal($('.opening-heading [data-copy="envelope_kicker"]').text(), 'Together with their families');
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
  assert.match(css, /\.enter,\.replay\{display:none\}/);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
  assert.match(css, /\.page-opening\{[^}]*url\(img\/ground-853\.webp\) 50% 50%\/cover fixed/, 'the dusk ground: one full-height image, cover, fixed');
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the frames\' windows = the measured ones', async () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open flap's height (it stands up there without covering the names)
  const flapH = String(st.flap[3] / 100).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.stage\\{--obj:[^;]*;[^}]*margin:calc\\(var\\(--obj\\) / ${a} \\* ${flapH} \\+ \\d+px\\) auto 0`));
  const box = (sel: string, k: 'front' | 'flap' | 'lantern' | 'thread' | 'card') => {
    const b = rule(sel), [L, T, W, H] = st[k];
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = pct(b, prop);
      if (Number.isFinite(got)) assert.ok(Math.abs(got - v) < 0.011, `${sel} ${prop} ${got} ≠ manifest ${v}`);
      else assert.equal(v, 0, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  box('.front', 'front');
  box('.flap', 'flap');
  box('.lantern', 'lantern');
  box('.thread', 'thread');
  box('.card', 'card');
  // the closure keeps the flap's belly visible: the lantern is narrower than half the envelope and stays inside it
  assert.ok(st.lantern[2] <= 40 && st.lantern[1] + st.lantern[3] <= 100);
  // the card hides behind the pocket and the flap while closed
  assert.ok(st.card[1] + st.card[3] <= 100 && st.card[1] >= 0);
  for (const [sel, k2] of [['.lantern-frame', 'lframe'], ['.panel', 'panel'], ['.wide-panel', 'wide']] as const) {
    const [L, T, W, H] = manifest[k2].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) assert.ok(Math.abs(pct(b, prop) - v) < 0.011, `${sel} ${prop}`);
    const [w, h] = manifest[k2].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
  // the arched window: a technical alpha mask of its measured pixels, applied with mask-image
  assert.equal(manifest.lframe.mask, 'mask_arch.png');
  assert.match(rule('.lantern-frame>.photo-slot'), /mask:url\(img\/mask_arch\.png\) 0 0\/100% 100% no-repeat/);
  const m = await sharp(path.join(ROOT, 'themes', id, 'img/mask_arch.png')).metadata();
  assert.equal(m.hasAlpha, true);
  const [ww, wh] = manifest.lframe.window_px;
  assert.ok(Math.abs(m.width! / m.height! - ww / wh) < 0.02, 'mask aspect = the measured window');
  const corner = await sharp(path.join(ROOT, 'themes', id, 'img/mask_arch.png')).extractChannel(3).extract({ left: 0, top: 0, width: 4, height: 4 }).raw().toBuffer();
  assert.ok(Math.max(...corner) < 10, 'the arch\'s top corners are masked out');
});

test('session keys per site, view transition, scenes, placeholders, countdown, K21', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope \.hero-card \[data-step\]\{opacity:1;clip-path:none;transform:none;transition:none;animation:none\}/);
  assert.match(css, /\.from-envelope \.hero-card \.photo-slot>img\{clip-path:none;animation:none\}/);
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
  // every photo sits in a GPT rice-paper frame and opens in warm light from below (never with reduced motion)
  assert.equal(cheerio.load(html.home)('.frame.lantern-frame.glowup[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.home)('.frame.panel.glowup[data-step] > .photo-slot[data-slot="story_1"] + .cut').length, 1);
  assert.equal(cheerio.load(html.story)('.moments > li[data-scene="story-moment"] > .moment[data-step="frame"] .frame.panel > .photo-slot + .cut').length, 3);
  assert.equal(cheerio.load(html.details)('.frame.wide-panel.glowup > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /@keyframes glow-open\{to\{clip-path:circle\(150% at 50% 100%\)\}\}/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.photo-slot>img\{clip-path:none!important;animation:none!important\}/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.sky,\.far-sky\{display:none\}/);
  // the programme's lanterns light one row after another
  assert.equal(cheerio.load(html.details)('.schedule li[data-step="row"] > .row-lantern').length, 1);
  assert.match(js, /rowStagger: \d+/);
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
    assert.match(data.pages.home, /^\/start\/demo\/sky-lantern-festival\/home/);
    // the demo fills the empty slots with the design's PAKET 2 photos (public/demo/sky-lantern-festival, fictional couple)
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/sky-lantern-festival\/hero_portrait-\d+w\.webp/);
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
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a piece of the dusk washi, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds = MOTION: the lantern lights, the bow slips, it lifts away, the flap, the card', () => {
  const at = (k: string) => Number(new RegExp(`${k}: \\[(\\d+), `).exec(js)![1]);
  assert.deepEqual(designSound(id), { music: 'first-light', opening: [[at('light'), 'chime'], [at('thread'), 'ribbon'], [at('lift'), 'whoosh'], [at('flap'), 'paper'], [at('rise'), 'slide']] });
});

test('RSVP keeps the shared form contract; a reply releases a lantern with the GPT accents', async () => {
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
  assert.equal($('[data-rsvp-state="success"] .lit-lantern.release').length, 1);
  assert.match(css, /\.reply-panel\[data-rsvp-state=success\]:not\(\[hidden\]\) \.release\{animation:release/);
  for (const n of ['gold', 'petal', 'seed']) assert.match(js, new RegExp(`img: 'img/${n}-160\\.webp'`));
});
