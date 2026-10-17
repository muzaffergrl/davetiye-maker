// Grand Theatre Premiere (24, G162): a platform theme built before its GPT parts (interim pieces), registered "coming".
// The theme standard (docs/11): editable texts = templates, the closed object (a curtain: separate moving pieces, .replay,
// Enter, hint, slugged session keys, view transition invite-card), scenes, photo slots + placeholders, thank-you mode,
// audio cues, the RSVP contract; and this design's own motion: the curtain parting, the story spotlight, the programme
// page turn and the ticket stub.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { claimableTheme } from '../lib/claim/themes.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { DEMO_CITY_PINS } from '../lib/claim/demo-map.ts';
import { themeOpenForClaims } from '../lib/themes/approval.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, designStyles, openingObject } from '../lib/marketing/designs.ts';
import { designSound } from '../lib/audio/catalog.ts';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'grand-theatre-premiere';
const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (f: string) => readFileSync(path.join(ROOT, 'themes', id, f), 'utf8');
const html = Object.fromEntries(PAGES.map((p) => [p, read(`${p}.html`)])) as Record<(typeof PAGES)[number], string>;
const js = read('site.js');
const css = read('site.css');

async function render(page: PageName, content: ContentRecord) {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  return renderTemplate({
    html: await readFileSync(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
}

test('Grand Theatre is a catalogued platform theme, kept off sale (coming) until its GPT parts and approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Grand Theatre Premiere');
  assert.equal(MARKETING.designs.find((d) => d.id === id)?.status, 'coming');
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.equal(openingObject(DESIGN_COPY[id]), 'curtain');
  assert.equal(DESIGN_COPY[id].collection, '24_Grand_Theatre_Premiere');
  assert.ok(designStyles(id).includes('classic'));
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  assert.equal(PRINT_LAYOUTS[id]?.collection, '24_Grand_Theatre_Premiere');
  for (const name of Object.keys(PRINT_LAYOUTS[id].sources)) assert.ok(existsSync(path.join(ROOT, 'public', 'print', id, `${name}.webp`)), name);
});

test('demo record = collection record, fictional, URLs empty', () => {
  const a = JSON.parse(read('content.demo.json'));
  const b = JSON.parse(readFileSync(path.join(ROOT, '..', 'collections/24_Grand_Theatre_Premiere/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  assert.equal(a.name_display, 'Charlotte & Theodore');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
});

test('demo route renders every page with one h1 and preview navigation', async () => {
  for (const page of PAGES) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/grand-theatre-premiere\/home/);
    if (page === 'story') assert.equal($('[data-spot]').length, 3);
    if (page === 'details') assert.equal($('.acts > li').length, 4);
  }
});

test('theme.json copy = templates, no unmarked visible text; design keys carry a label', () => {
  const scan = scanCopy(html);
  const manifest = JSON.parse(read('theme.json'));
  assert.deepEqual(manifestProblems(manifest.copy, scan), []);
  assert.deepEqual(scan.unmarked ?? [], []);
  for (const k of ['act_label', 'scene_label', 'stub_admit', 'countdown_title']) assert.ok(manifest.copy[k]?.label, k);
});

test('the curtain: back wall, both panels, both swags, valance, spotlight and card are separate layers', () => {
  const $ = cheerio.load(html.index);
  const stage = $('.stage');
  assert.equal(stage.attr('role'), 'button');
  assert.equal(stage.attr('tabindex'), '0');
  for (const sel of ['.th-back', '.curtain-l', '.curtain-r', '.swag-l', '.swag-r', '.th-arch', '.spot', '.theatre > .card']) assert.equal(stage.find(sel).length, 1, sel);
  assert.equal($('.replay').length, 1);
  assert.equal($('.replay[hidden]').length, 0);
  assert.equal($('a[data-enter][href="home.html"]').length, 1);
  assert.equal($('a[data-skip][href="home.html"]').length, 1);
  assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
  assert.equal($('noscript').length, 0);
  assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
  assert.equal(stage.find('[data-slot="hero_portrait"] img[data-photo="hero_portrait"]').length, 1);
  assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
  assert.match(css, /\.is-opened \.tap-hint[^{]*\{display:none\}/);
  assert.match(css, /\.is-opened \.replay\{display:inline-flex/);
  // the panels part one after the other (staggered) and hand over to their swags, which sway
  const E = Function(`${js.slice(0, js.indexOf('(() =>'))}; return MOTION.envelope;`)() as Record<string, number[] | number>;
  const [l, r] = [E.partL as number[], E.partR as number[]];
  assert.ok(r[0] > l[0], 'the right panel starts after the left one');
  assert.match(css, new RegExp(`part-l ${l[1]}ms ${l[0]}ms`));
  assert.match(css, new RegExp(`part-r ${r[1]}ms ${r[0]}ms`));
  assert.match(css, new RegExp(`sway-l ${(E.sway as number[])[1]}ms ${(E.sway as number[])[0]}ms`));
  assert.match(css, new RegExp(`spot ${(E.spot as number[])[1]}ms ${(E.spot as number[])[0]}ms`));
  assert.ok((E.go as number) >= 3200 && (E.go as number) <= 5000, 'tap → home 3.2–5 s');
});

test('session keys per site, same in site.js and the <head> scripts; view transition invite-card', () => {
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
  assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(js, /viewTransitionName = 'invite-card'/);
  assert.match(css, /\.from-envelope [^{]*\{opacity:1;transform:none;transition:none\}/);
  assert.equal(cheerio.load(html.home)('.hero-card').length, 1);
  assert.match(css, /\.hero-card\{[^}]*view-transition-name:invite-card/);
});

test('page turn: the inner pages set turn-next / turn-prev from the page order, with a fallback', () => {
  for (const p of ['home', 'story', 'details', 'rsvp'] as const) {
    assert.match(html[p], /addEventListener\('pagereveal'/, p);
    assert.match(html[p], /var o=\['home','story','details','rsvp'\]/, p);
    assert.match(html[p], /turn-fallback/, p);
  }
  assert.doesNotMatch(html.index, /pagereveal/);
  for (const t of ['turn-next', 'turn-prev']) assert.match(css, new RegExp(`active-view-transition-type\\(${t}\\)`));
  assert.match(css, /\.turn-fallback main\{/);
});

test('scenes, replay links, countdown target, photo slots and placeholders', () => {
  for (const p of PAGES) if (p !== 'index') assert.ok(cheerio.load(html[p])('[data-scene]').length > 0, `${p}: [data-scene]`);
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
    });
    // every theme file a page names exists (no broken image)
    $('img[src^="img/"], img[srcset]').each((_, el) => {
      for (const f of [$(el).attr('src'), ...($(el).attr('srcset') ?? '').split(',').map((s) => s.trim().split(' ')[0])]) {
        if (f && f.startsWith('img/')) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), `${p}: ${f}`);
      }
    });
  }
  for (const m of css.matchAll(/url\((img\/[^)]+)\)/g)) assert.ok(existsSync(path.join(ROOT, 'themes', id, m[1])), m[1]);
  assert.deepEqual([...slots].sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('K21: countdown and content blocks without CSS frames; the acts and scenes are numbered by CSS counters', () => {
  for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  for (const sel of ['.hero-card', '.programme-sheet', '.detail-note', '.scene', '.venue']) {
    const rule = css.match(new RegExp(`(^|\\})${sel.replace('.', '\\.')}\\{[^}]*\\}`))?.[0] ?? '';
    assert.doesNotMatch(rule, /border:|outline:|box-shadow/, sel);
  }
  assert.match(css, /\.act-no::before\{content:counter\(act,upper-roman\)\}/);
  assert.match(css, /\.roman::before\{content:counter\(scene,upper-roman\)\}/);
});

test('story spotlight: three cards are buttons that take the light; reduced motion turns the mask off', () => {
  const $ = cheerio.load(html.story);
  assert.equal($('.spot-stage button.photo-slot[data-spot]').length, 3);
  assert.equal($('[data-spot][aria-pressed="true"]').length, 1);
  assert.match(js, /function initSpotlight\(\)/);
  assert.match(js, /if \(reduce\) \{ stage\.classList\.add\('is-unlit'\); return; \}/);
  assert.match(css, /@property --sx/);
});

test('RSVP: the shared form contract on the ticket; the stub tears off on success and comes back for another reply', async () => {
  const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + '/rsvp'), id, 'rsvp');
  const $ = cheerio.load(await response.text());
  assert.equal($('script[src="/rsvp/form.js"][defer]').length, 1);
  assert.equal($('form[data-rsvp-form][method="post"]:not([action])').length, 1);
  for (const st of ['success', 'closed', 'error', 'preview']) assert.equal($(`[data-rsvp-state="${st}"][hidden]`).length, 1, st);
  for (const f of ['name', 'email', 'attending', 'guests', 'message']) assert.equal($(`[data-rsvp-error-for="${f}"]`).length, 1, f);
  assert.equal($('template[data-rsvp-party]').length, 1);
  const legend = $('[data-rsvp-question] legend').first();
  assert.equal(legend.attr('data-field'), undefined);
  assert.equal(legend.find('[data-field]').length, 1);
  assert.equal($('a[href="#reply"]').length, 1);
  assert.equal($('#reply.ticket .ticket-stub[aria-hidden="true"]').length, 1);
  assert.match(js, /if \(st === 'success'\) ticket\.classList\.add\('is-torn'\)/);
  assert.match(js, /st === 'ready' && ticket\.classList\.contains\('is-torn'\)/);
  assert.match(css, /\.is-torn \.ticket-stub\{animation:tear /);
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  demo.thank_you = { mode: 'on', message: 'Thank you for a night at the theatre.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  assert.equal(index('.card .ty-decor img').length, 1, 'without a thank-you photo the window shows the theme decor');
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a night at the theatre/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('content changes show on every page; the full-name fallback; no demo text in the templates', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  for (const p of PAGES) for (const s of ['Charlotte', 'Theodore', 'Larkmont', 'Richmond', 'October']) assert.ok(!html[p].includes(s), `${p}: ${s}`);
  const c = structuredClone(theme.demo);
  c.partners[0] = { display_name: 'Ada', full_name: null };
  c.partners[1] = { display_name: 'Ben', full_name: 'Benjamin Hale' };
  c.name_display = 'Ada & Ben';
  c.venue.name = 'The Orpheum';
  c.schedule = [{ label: 'Vows', time: '15:00', location: null }];
  const home = cheerio.load((await render('home', c)).html);
  assert.equal(home('.formal-names p[data-field="partners.0.display_name"]').text(), 'Ada');
  assert.equal(home('.formal-names p[data-field="partners.1.full_name"]').text(), 'Benjamin Hale');
  assert.equal(home('.formal-names [data-empty]').length, 0);
  const details = cheerio.load((await render('details', c)).html);
  assert.equal(details('.acts > li').length, 1);
  assert.match(details('.acts > li').text(), /Vows/);
  assert.match(details('.page-heading').text(), /The Orpheum/);
  assert.match(cheerio.load((await render('index', c)).html)('h1').text(), /Ada.*Ben/s);
});

test('opening sounds start with steps of MOTION.envelope', () => {
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[0, 'tap'], [400, 'whoosh'], [2000, 'slide'], [2900, 'chime']] });
});

test('img/manifest.json names og + favicon and both files exist; the build is the theme\'s own', () => {
  const m = JSON.parse(read('img/manifest.json'));
  for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', id, 'img', m[k].file)), k);
  if (m.stage.method !== 'gpt') assert.equal(m.stage.box.join('x'), '72x96x880x1344');   // the stand-in stage
  for (const f of ['thank-you.css', 'build_images.py', 'README.md']) assert.ok(existsSync(path.join(ROOT, 'themes', id, f)), f);
});

test('G167: the stage geometry in site.css is the build\'s measurement (manifest stage.css), used by the stage CSS', () => {
  const m = JSON.parse(read('img/manifest.json'));
  const block = /\/\* stage:begin[^\n]*\*\/\n:root\{([^}]*)\}\n\/\* stage:end \*\//.exec(css);
  assert.ok(block, 'site.css has the stage:begin … stage:end block');
  assert.deepEqual(Object.fromEntries(block[1].split(';').map((d) => [d.slice(0, d.indexOf(':')), d.slice(d.indexOf(':') + 1)])), m.stage.css);
  const [l, t, w, h] = m.stage.card.box_pct;
  assert.equal(m.stage.css['--card-l'], `${l}%`);
  assert.equal(m.stage.css['--card-t'], `${t}%`);
  assert.equal(m.stage.css['--card-w'], `${w}%`);
  assert.equal(m.stage.css['--card-h'], `${h}%`);
  assert.equal(m.stage.css['--win-l'], `${m.stage.card.window_pct[0]}%`);
  assert.equal(m.stage.css['--gather'], String(m.stage.gather));
  assert.equal(`${m.stage.css['--cl-o']} 50%`, m.stage.curtain_l.origin);
  assert.equal(`${m.stage.css['--cr-o']} 50%`, m.stage.curtain_r.origin);
  assert.equal(m.stage.css['--stage-ar'], `${m.stage.box[2]}/${m.stage.box[3]}`);
  // the stage rules read the variables (no hand-copied percentage left behind)
  for (const rule of [/\.theatre\{[^}]*aspect-ratio:var\(--stage-ar\)/, /\.curtain-l\{transform-origin:var\(--cl-o\) 50%\}/,
    /\.curtain-r\{transform-origin:var\(--cr-o\) 50%\}/, /\.swag-l\{transform-origin:var\(--swl-o\)\}/,
    /\.theatre>\.card\{left:var\(--card-l\);top:var\(--card-t\);width:var\(--card-w\);height:var\(--card-h\)/,
    /\.theatre \.card-photo\{position:absolute;left:var\(--win-l\);top:var\(--win-t\);width:var\(--win-w\);height:var\(--win-h\);z-index:var\(--photo-z\)\}/,
    /100%\{transform:scaleX\(var\(--gather\)\)/, /\.hero-card\{[^}]*aspect-ratio:var\(--hero-ar\)/,
    /\.ticket-stub\{[^}]*aspect-ratio:var\(--stub-ar\)[^}]*border-top:var\(--stub-rule\)/]) assert.match(css, rule);
  assert.doesNotMatch(css, /aspect-ratio:880\/1344|scaleX\(\.34\)/);
  assert.doesNotMatch(js, /880 \/ 1344/);
  // the card's photo sits in the window, outside the text column
  const $ = cheerio.load(html.index);
  assert.equal($('.theatre > .card > .card-photo[data-slot="hero_portrait"]').length, 1);
  assert.equal($('.card-copy .card-photo').length, 0);
  assert.equal(cheerio.load(html.home)('.hero-card > img.card-img[src="img/card_plain-320.webp"]').length, 1);
});

test('G167: every PAKET 5 part GPT_PROMPTS.md orders is used by build_images.py (no orphan prompt); sources recorded', () => {
  const prompts = readFileSync(path.join(ROOT, '..', 'collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md'), 'utf8');
  const parts = [...prompts.matchAll(/\*\*Kaydet:\*\* `collections\/24_Grand_Theatre_Premiere\/assets\/gpt\/parts\/([a-z_]+)\.png`/g)].map((x) => x[1]);
  assert.equal(parts.length, 14);
  const build = read('build_images.py');
  for (const name of parts) assert.ok(build.includes(`"${name}"`), name);
  const m = JSON.parse(read('img/manifest.json'));
  assert.deepEqual(m.waiting_for_gpt, Object.keys(m.sources).filter((k) => !m.sources[k].startsWith('gpt:')).sort());
  assert.deepEqual(m.checks.green, {});
});
