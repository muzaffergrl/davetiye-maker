// Grand Theatre Premiere (24, G424): redesign of 2026-10-22 (docs/35 row 24), rebuilt on the pilot-39 structure (as the
// pilot G423) from the design's own layered GPT parts (PAKET 5R). The closed envelope (K23 strict: a horizontal peacock
// linen envelope whose front is a stage — two burgundy velvet curtains hinged on its outer edges, a fixed valance, a gold
// tasselled cord and a blank ticket — not the V flap of 01–21), its opening (the ticket slides out and tears at its
// measured perforation, the cord unties, the curtains swing open in 3D onto their real gold silk linings, a spotlight
// sweeps the stage, the card rises from behind the apron and comes forward, accents drift), the envelope geometry
// shared by the build and site.css, editable texts, scenes, the gilded frames with measured windows and masks, demo
// route, thank-you mode, audio cues, RSVP contract, print layout. Off sale ("preview") until approval.
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

const id = 'grand-theatre-premiere';
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

test('Grand Theatre Premiere is a platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Grand Theatre Premiere');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'preview');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.price, '[PRICE]');
  assert.equal(DESIGN_COPY[id].collection, '24_Grand_Theatre_Premiere');
  assert.match(DESIGN_COPY[id].opening, /^Your guests tap the envelope\. /);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.deepEqual(DESIGN_COPY[id].fonts, ['Abril Fatface', 'Playfair Display']);
  assert.deepEqual(DESIGN_STYLES[id], ['classic']);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.equal(PRINT_LAYOUTS[id]?.collection, '24_Grand_Theatre_Premiere');
  assert.deepEqual(PRINT_LAYOUTS[id]?.sources, { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' });
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  for (const [k, v] of Object.entries(manifest.photo_slots as Record<string, { aspect: string }>)) assert.equal(theme.manifest.photos[k].aspect, v.aspect, k);
  assert.equal(JSON.parse(read('theme.json')).variants, undefined, 'the old palettes went with the old art');
});

test('demo record = collection record, fictional, URLs and media empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/24_Grand_Theatre_Premiere/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Charlotte & Theodore');
  assert.equal(a.date, '2027-10-16');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
  assert.equal(a.media.hero_portrait, null);
  for (const p of PAGES) for (const s of ['Charlotte', 'Theodore', 'Larkmont', 'Richmond', 'October 16', 'C&amp;T', 'C&T']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
});

test('editable texts = templates, no unmarked visible text', () => {
  const scan = scanCopy(html);
  assert.deepEqual(manifestProblems(JSON.parse(read('theme.json')).copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
});

test('envelope — back, spotlight, card, apron, footlights, two curtains (outside + lining), valance, two ticket pieces and two cord halves are separate layers; no V flap', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.envelope > .back', '.envelope > .spot', '.envelope > .card', '.envelope > .front', '.envelope > .lights',
    '.envelope > .curtain.c-l > .c-out', '.envelope > .curtain.c-l > .c-in', '.envelope > .curtain.c-r > .c-out', '.envelope > .curtain.c-r > .c-in',
    '.envelope > .valance', '.envelope > .ticket.t-body', '.envelope > .ticket.t-stub', '.envelope > .rope.r-l', '.envelope > .rope.r-r']) assert.equal(stage.find(sel).length, 1, sel);
  // not the V flap of 01–21 and no Codex envelope-v3 controller any more
  assert.doesNotMatch(html.index + css, /v-flap|clip-path:\s*polygon|envelope-v3|opening-site/i);
  for (const f of ['envelope-v3.js', 'envelope-v3.css', 'opening-design.json', 'opening-site.js', 'interior.css', 'interior-motion.js', 'variants.css']) assert.ok(!existsSync(path.join(ROOT, 'themes', id, f)), f);
  // the curtains' backs are the real GPT linings, never a plain colour
  assert.match(css, /\.c-l>\.c-in\{background-image:url\(img\/curtain_l_in-480\.webp\)\}/);
  assert.match(css, /\.c-r>\.c-in\{background-image:url\(img\/curtain_r_in-480\.webp\)\}/);
  assert.match(css, /\.c-in\{transform:rotateY\(180deg\)/);
  assert.match(css, /\.curtain\.c-l\{[^}]*transform-origin:0 50%\}/, 'left curtain hinged on the outer left edge');
  assert.match(css, /\.curtain\.c-r\{[^}]*transform-origin:100% 50%\}/, 'right curtain hinged on the outer right edge');
  // the steps in MOTION order; the CSS keyframes carry the same numbers
  const step = (k: string) => /\[(\d+), (\d+)\]/.exec(new RegExp(`${k}: \\[\\d+, \\d+\\]`).exec(js)![0])!.slice(1).map(Number);
  const [t0, td] = step('ticket'), [e0, ed] = step('tear'), [r0, rd] = step('rope'), [h0, hd] = step('house'), [s0, sd] = step('settle');
  const [l0, ld] = step('curtainL'), [q0, qd] = step('curtainR'), [p0, pd] = step('spot'), [f0, fd] = step('lights');
  const [u0, ud] = step('rise'), [g0, gd] = step('light'), [w0, wd] = step('forward');
  const acc = Number(/accents: (\d+),/.exec(js)![1]), go = Number(/go: (\d+)/.exec(js)![1]);
  assert.ok(t0 === 0 && t0 < e0 && e0 < r0 && r0 < l0 && l0 < q0 && q0 - l0 === 140 && q0 < p0 && p0 < u0 && u0 < acc && u0 < w0, 'closure first, then curtains, then the card');
  assert.ok(r0 + rd <= l0 + 600, 'the cord is off before the curtains are well open');
  assert.match(css, new RegExp(`\\.is-opening \\.ticket\\.t-body\\{animation:ticket-slide ${td}ms ${t0}ms cubic-bezier\\([^)]*\\) forwards,body-away ${ed}ms ${e0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.ticket\\.t-stub\\{animation:ticket-slide ${td}ms ${t0}ms cubic-bezier\\([^)]*\\) forwards,stub-tear ${ed}ms ${e0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.rope\\.r-l\\{animation:rope-l ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.rope\\.r-r\\{animation:rope-r ${rd}ms ${r0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.house\\{animation:house ${hd}ms ${h0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope\\{animation:settle ${sd}ms ${s0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.curtain\\.c-l\\{animation:curtain-l ${ld}ms ${l0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.curtain\\.c-r\\{animation:curtain-r ${qd}ms ${q0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.spot\\{animation:spot-on ${pd}ms ${p0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.spot::before\\{animation:spot-sweep ${pd}ms ${p0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.lights\\{animation:lights ${fd}ms ${f0}ms`));
  assert.match(css, new RegExp(`card-rise ${ud}ms ${u0}ms`));
  assert.match(css, new RegExp(`card-forward ${wd}ms ${w0}ms`));
  assert.match(css, new RegExp(`\\.is-opening \\.envelope>\\.card::after\\{animation:sweep ${gd}ms ${g0}ms`));
  assert.match(js, /particles\('open', \$\('\.stage'\)\), E\.accents/);
  assert.ok(go >= w0 + wd && go <= 5500, 'home only after the card came forward, within 5.5 s');
  // ~115° open, onto the lining, toward the guest; the opened state matches the end of the keyframes
  assert.match(css, /@keyframes curtain-l\{from\{transform:perspective\(1000px\) rotateY\(0\)\}[^}]*\}to\{transform:perspective\(1000px\) rotateY\(-115deg\)\}\}/);
  assert.match(css, /@keyframes curtain-r\{from\{transform:perspective\(1000px\) rotateY\(0\)\}[^}]*\}to\{transform:perspective\(1000px\) rotateY\(115deg\)\}\}/);
  assert.match(css, /\.is-opened \.curtain\.c-l\{transform:perspective\(1000px\) rotateY\(-115deg\)\}/);
  assert.match(css, /@keyframes settle\{to\{transform:scale\(\.72\)\}\}/);
  assert.match(css, /\.is-opened \.envelope\{transform:scale\(\.72\)\}/);
  // no button or pill during the opening: Skip and the actions hide / wait
  assert.match(css, /\.is-opened \.tap-hint,\.is-opening \.tap-hint\{display:none\}/);
  assert.match(css, /\.enter,\.replay\{display:none\}/);
  assert.match(js, /e\.key === 'Escape'/);
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
  // the names are never under decor: the heading sits above the stage, no corner ornament on the cover
  assert.equal($('.opening .corner').length, 0);
});

test('one envelope geometry: the build\'s manifest stage = site.css layers; the frames\' windows and masks = the measured ones', () => {
  const st = manifest.stage, a = String(st.aspect).replace('.', '\\.');
  assert.match(css, new RegExp(`\\.envelope\\{position:relative;width:100%;aspect-ratio:${a}\\}`));
  const box = (sel: string, k: string) => {
    const b = rule(sel), [L, T, W, H] = st[k];
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) {
      const got = num(b, prop);
      if (Number.isFinite(got)) assert.ok(Math.abs(got - v) < 0.011, `${sel} ${prop} ${got} ≠ manifest ${v}`);
      else assert.equal(v, 0, `${sel} ${prop}: no % in site.css, manifest ${v}`);
    }
  };
  box('.front', 'front');
  box('.curtain.c-l', 'curtain_l');
  box('.curtain.c-r', 'curtain_r');
  box('.valance', 'valance');
  box('.card', 'card');
  // the ticket pieces and the cord halves share their top / height rule
  for (const [sel, k] of [['.ticket.t-body', 'ticket_body'], ['.ticket.t-stub', 'ticket_stub']] as const) {
    const [L, T, W, H] = st[k];
    assert.ok(Math.abs(num(rule(sel), 'left') - L) < 0.011 && Math.abs(num(rule(sel), 'width') - W) < 0.011, sel);
    assert.ok(Math.abs(num(rule('.ticket'), 'top') - T) < 0.011 && Math.abs(num(rule('.ticket'), 'height') - H) < 0.011, `${sel} top/height`);
  }
  assert.ok(Math.abs(st.ticket_body[0] + st.ticket_body[2] - st.ticket_stub[0]) < 0.011, 'the stub starts where the body ends (the perforation)');
  for (const [sel, k] of [['.rope.r-l', 'rope_l'], ['.rope.r-r', 'rope_r']] as const) {
    const [L, T, W, H] = st[k];
    assert.ok(Math.abs(num(rule(sel), 'left') - L) < 0.011, sel);
    const r = rule('.rope');
    assert.ok(Math.abs(num(r, 'top') - T) < 0.011 && Math.abs(num(r, 'height') - H) < 0.011 && Math.abs(num(r, 'width') - W) < 0.011, `${sel} box`);
  }
  // the perforation was measured on the GPT ticket (not the prompt's 54.6 %), the footlights on the apron
  assert.ok(st.perforation_canvas_pct > 50 && st.perforation_canvas_pct < 62);
  assert.equal(st.lights.length, 5);
  for (const x of st.lights) assert.match(rule('.lights'), new RegExp(`at ${String(x).replace('.', '\\.')}% 55%`), `footlight ${x}`);
  for (const [sel, k] of [['.proscenium', 'proscenium'], ['.programme', 'programme'], ['.venue-frame', 'venue']] as const) {
    const [L, T, W, H] = manifest[k].window_pct;
    const b = rule(`${sel}>.photo-slot`);
    for (const [prop, v] of [['left', L], ['top', T], ['width', W], ['height', H]] as const) assert.ok(Math.abs(num(b, prop) - v) < 0.011, `${sel} ${prop}`);
    assert.match(b, new RegExp(`mask-image:url\\(img/${manifest[k].mask}\\)`), `${sel} masked by the measured window`);
    assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', manifest[k].mask)), manifest[k].mask);
    const [w, h] = manifest[k].src_size;
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
  // every photo sits in a GPT frame; a spotlight crosses it as the scene enters (never with reduced motion)
  assert.equal(cheerio.load(html.home)('.frame.proscenium.lit[data-step] > .photo-slot[data-slot="hero_portrait"] + .cut').length, 1);
  const story = cheerio.load(html.story);
  assert.equal(story('.acts .act .frame.programme.page[data-step="page"] > .photo-slot + .cut').length, 3);
  assert.deepEqual(story('.act').map((_, e) => story(e).hasClass('act-l') ? 'l' : 'r').get(), ['l', 'r', 'l'], 'Act I–III left, right, left');
  assert.deepEqual(story('.act-num').map((_, e) => story(e).attr('data-copy')).get(), ['act_1', 'act_2', 'act_3']);
  assert.equal(cheerio.load(html.details)('.frame.venue-frame.lit > .photo-slot[data-slot="venue"]').length, 1);
  assert.match(css, /\.js \.lit\[data-step\]\.in>\.photo-slot::after/);
  assert.match(css, /\.js \.act-l \.page\[data-step\]\{transform-origin:0 50%;transform:perspective\(1100px\) rotateY\(-78deg\)\}/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*\.frame>\.photo-slot::after,\.card::after,\.spot\{display:none\}/);
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
  assert.equal(manifest.parts.used.length, 23);
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
    assert.match(data.pages.home, /^\/start\/demo\/grand-theatre-premiere\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /^\/demo\/grand-theatre-premiere\/hero_portrait-\d+w\.webp/);
    if (page === 'story') assert.equal($('.act').length, 3);
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
  assert.equal(index('.card .ty-decor img').length, 1, 'no photo: a piece of the velvet, never a placeholder');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for an evening we will treasure/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds (G967) = MOTION: the ticket, the tear, the cord, each curtain from its side, the programme rising, forward', () => {
  const at = (k: string) => Number(new RegExp(`\\b${k}: \\[(\\d+), `).exec(js)![1]);
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[at('ticket'), 'slide-quick'], [at('tear'), 'tear'], [at('rope'), 'cord'], [at('curtainL'), 'curtain', -0.45], [at('curtainR'), 'curtain', 0.45], [at('rise'), 'slide-quick'], [at('forward'), 'chime-warm']] });
});

test('RSVP keeps the shared form contract; a reply tears a fresh ticket and the GPT accents drift (confetti, petals)', async () => {
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
  assert.equal($('[data-rsvp-state="success"] .reply-ticket > .rt-body + .rt-stub').length, 1);
  assert.match(css, /\.js \.reply-panel:not\(\[hidden\]\) \.rt-stub\{animation:stub-off/);
  for (const n of ['confetti', 'petal_red', 'petal_ivory']) assert.match(js, new RegExp(`img: 'img/${n}-160\\.webp'`));
});
