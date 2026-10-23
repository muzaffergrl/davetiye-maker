// Celestial Observatory (29, G429): redesign of 2026-10-22 (docs/35), rebuilt on the pilot-39 structure (like the G423
// pilot) from the design's own layered GPT parts (PAKET 5R). The closed envelope (K23 strict: a portrait midnight-blue
// envelope with a half-circle dome flap, a dome window in the pocket and a two-part brass astrolabe as its closure — not
// the V flap of 01–21), its opening (the rete turns about the pin and its tips glint, the astrolabe floats off, the dome
// flap swings up onto its real inner face, the card rises, stars light up and a crescent drifts), the envelope geometry
// shared by the build and site.css, editable texts, scenes, the instruments with measured windows (round medallion and
// planisphere rings with their turning dial, the wide star-chart panel), demo route, thank-you mode, audio cues, RSVP
// contract, print layout. Off sale ("preview") until approval.
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

const id = 'celestial-observatory';
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
const pct = (body: string, prop: string) => Number(new RegExp(`(?:^|;)${prop}:(-?[\\d.]+)%`).exec(body)?.[1]);
const near = (a: number, b: number, msg: string) => assert.ok(Math.abs(a - b) < 0.011, `${msg}: ${a} ≠ ${b}`);
const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`\\b${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);

test('Celestial Observatory is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Celestial Observatory');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '29_Celestial_Observatory');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Imperial Script', 'Forum']);
  assert.deepEqual(DESIGN_STYLES[id], ['classic']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '29_Celestial_Observatory');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  assert.equal((JSON.parse(read('theme.json')) as { variants?: unknown }).variants, undefined, 'the old palettes went with the old art');
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/29_Celestial_Observatory/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Celeste & Rowan');
  assert.equal(a.date, '2027-08-14');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Celeste', 'Rowan', 'Starlight Ridge', 'Flagstaff', 'August 14', 'C&amp;R', 'C&R']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, card, pocket, flap (outside + inside), the astrolabe\'s plate and rete are separate layers; the opening in MOTION order', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .card', '.envelope > .front', '.envelope > .flap > .flap-out', '.envelope > .flap > .flap-in', '.envelope > .astro > .plate', '.envelope > .astro > .rete']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal(stage.find('.astro > .rete > .tip').length, 6, 'the glints sit on the rete and turn with it');
  // not the V flap of 01–21 and no Codex envelope-v3 controller any more
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site/i);
  for (const f of ['envelope-v3.js', 'envelope-v3.css', 'opening-design.json', 'opening-site.js', 'interior.css', 'interior-motion.js', 'parts.css', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const [t0, td] = step('turn'), [h0, hd] = step('sheen'), [g0, gd] = step('glint'), [a0, ad] = step('astro'), [l0, ld] = step('flap'), [r0, rd] = step('rise'), [s0, sd] = step('light'), [w0, wd] = step('forward');
  const tipStagger = Number(/tipStagger: (\d+)/.exec(js)![1]);
  const acc = Number(/accents: (\d+),/.exec(js)![1]), go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(t0 === 0 && g0 < t0 + td && t0 + td <= a0 && a0 < l0 && l0 < acc && acc < r0 && r0 < w0 && s0 < w0 + wd, 'closure first, then flap, accents, card');
  assert.ok(go >= w0 + wd && go <= 5500, 'home only after the card came forward; ≤ 5.5 s');
  assert.match(css, new RegExp(`\\.is-opening \\.astro>\\.rete\\{animation:rete-turn ${td}ms ${t0}ms`));
  assert.match(css, /@keyframes rete-turn\{from\{transform:rotate\(0\)\}to\{transform:rotate\(120deg\)\}\}/);
  assert.match(css, new RegExp(`\\.is-opening \\.astro>\\.rete::after\\{animation:sheen ${hd}ms ${h0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.tip\\{animation:glint ${gd}ms calc\\(${g0}ms \\+ var\\(--i\\) \\* ${tipStagger}ms\\)`));
  assert.match(css, new RegExp(`\\.is-opening \\.astro\\{animation:astro-off ${ad}ms ${a0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.flap\\{animation:flap-open ${ld}ms ${l0}ms`));
  assert.match(css, new RegExp(`card-rise ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope>\\.card::after\\{animation:sweep ${sd}ms ${s0}ms`));
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  assert.match(css, /@keyframes flap-open\{from\{transform:perspective\(900px\) rotateX\(0\);z-index:4\}/);
  // the flap's back face is its real GPT inner face (the observatory dome), never a plain colour
  assert.match(rule('.flap-in'), /transform:rotateX\(180deg\);background-image:url\(img\/flap_in-720\.webp\)/);
  // 2–3 kinds of GPT accents in the opening, each in its own phase; no button or pill during it
  const open = /open: \[([\s\S]*?)\],\n    reply/.exec(js)![1];
  assert.deepEqual([...open.matchAll(/img: 'img\/([a-z]+)-\d+\.webp'/g)].map((m) => m[1]), ['star', 'moon', 'dust']);
  assert.match(css, /\.is-opened \.enter\{display:inline-flex\}/);
  assert.doesNotMatch(css, /\.is-opening [^{]*\.(enter|replay)\{display:(inline-)?flex/);
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
  assert.match(js, /e\.key === 'Escape'/);
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the instruments\' windows = the measured ones', () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  // the gap above the envelope = the open dome's height (it stands up there without covering the names)
  const domeH = String(+(st.flap_in_h / 100).toFixed(4)).replace(/^0\./, '\\.');
  assert.match(css, new RegExp(`\\.stage\\{--obj:[^;]*;[^}]*margin:calc\\(var\\(--obj\\) / ${a} \\* ${domeH} \\+ \\d+px\\) auto 0`));
  const box = (sel: string, v: number[]) => {
    const b = rule(sel);
    for (const [prop, x] of [['left', v[0]], ['top', v[1]], ['width', v[2]], ['height', v[3]]] as const) {
      const got = pct(b, prop);
      if (Number.isFinite(got)) near(got, x, `${sel} ${prop}`);
      else assert.equal(x, 0, `${sel} ${prop}: no % in site.css, manifest ${x}`);
    }
  };
  box('.front', st.front);
  box('.flap', st.flap);
  box('.card', st.card);
  box('.astro', st.astro);
  box('.astro>.rete', st.rete);
  box('.mini-astro>.rete', st.rete);
  // the dome (flap inside) at its own ratio, in % of the flap box
  near(pct(rule('.flap-in'), 'height'), Math.round(10000 * st.flap_in_h / st.flap[3]) / 100, '.flap-in height');
  // the rete turns about the plate's pin: its box is centred on the disc centre
  near(Math.round(100 * (st.rete[0] + st.rete[2] / 2)) / 100, st.disc[0], 'rete centre x = disc centre');
  assert.ok(Math.abs(st.rete[1] + st.rete[3] / 2 - st.disc[1]) < 0.02, 'rete centre y = disc centre');
  assert.equal(manifest.checks.closed_gap_px, 0, 'no lining shows between the pocket\'s cut and the closed flap');
  assert.ok(st.card[1] > st.cut && st.card[1] + st.card[3] < 99, 'the card waits inside the pocket, under the dome window');
  for (const [sel, k2] of [['.medallion', 'medallion'], ['.plani', 'plani'], ['.venue-frame', 'venue']] as const) {
    const [L, T, W, H] = manifest[k2].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L - 0.5], ['top', T - 0.5], ['width', W + 1], ['height', H + 1]] as const) near(pct(b, prop), v, `${sel} ${prop}`);
    const [w, h] = manifest[k2].src_size;
    assert.match(rule(sel), new RegExp(`aspect-ratio:${w}/${h}`), `${sel} aspect = the part`);
  }
  assert.match(rule('.medallion>.photo-slot'), /border-radius:50%/);
  assert.match(rule('.plani>.photo-slot'), /border-radius:50%/);
  box('.plani>.dial', manifest.dial.box_pct);
});

test('session keys per site, view transition, scenes, placeholders, countdown, turning instruments, K21', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope \.hero-card \[data-step\]\{opacity:1;clip-path:none;transform:none;transition:none;animation:none\}/);
  assert.equal(cheerio.load(html.home)('.hero-card').length, 1);
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
  // every photo sits in a GPT instrument; the round ones are uncovered by a dial sweep (a conic mask), the venue by a
  // telescope beam — never with reduced motion
  assert.equal(cheerio.load(html.home)('.frame.medallion.instrument[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  assert.equal(cheerio.load(html.home)('.frame.plani.instrument > .photo-slot[data-slot="story_1"] ~ .dial').length, 1);
  const story = cheerio.load(html.story);
  assert.equal(story('.moment[data-scene="story-moment"] .frame.plani.instrument > .photo-slot + .cut + .dial').length, 3);
  assert.equal(cheerio.load(html.details)('.frame.venue-frame.beam > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /mask:conic-gradient\(#000 var\(--sweep\),#0000 0\)/);
  assert.match(css, /@keyframes dial-sweep\{from\{--sweep:0deg\}to\{--sweep:360deg\}\}/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.js \.instrument\[data-step\]>\.photo-slot>img,\.js \.beam\[data-step\]>\.photo-slot>img\{-webkit-mask:none!important;mask:none!important;clip-path:none!important\}/);
  // the dials and the small astrolabe's rete turn with the page (not with reduced motion)
  assert.match(js, /initTurns\(\);/);
  assert.match(js, /if \(reduce \|\| \(!dials\.length && !\$\('\.mini-astro'\)\)\) return;/);
  assert.match(rule('.plani>.dial'), /rotate:var\(--dial,0deg\)/);
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
});

test('demo route renders every page with the design\'s own sample photos (G155) and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/celestial-observatory\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/celestial-observatory\/hero_portrait-\d+w\.webp/);
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
  demo.thank_you = { mode: 'on', message: 'Thank you for an evening under the stars we will treasure.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a piece of the midnight paper, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening under the stars we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds (G967) = MOTION: the rete, the glints, the astrolabe, the flap, the stars, the card, forward', () => {
  const at = (k: string) => Number(new RegExp(`\\b${k}: \\[(\\d+), `).exec(js)![1]);
  const acc = Number(/\baccents: (\d+)/.exec(js)![1]);
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[at('turn'), 'lock'], [at('glint'), 'sparkle'], [at('astro'), 'whoosh'], [at('flap'), 'paper'], [acc, 'stars'], [at('rise'), 'slide-quick'], [at('forward'), 'chime']] });
});

test('RSVP keeps the shared form contract; a reply is answered with rising GPT star dust', async () => {
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
  const reply = /reply: \[([\s\S]*?)\]\n  \}/.exec(js)![1];
  for (const n of ['dust', 'star']) assert.match(reply, new RegExp(`img: 'img/${n}-\\d+\\.webp'[^}]*mode: 'rise'`));
});
