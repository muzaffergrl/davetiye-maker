// Demo bar (owner request 2026-10-23, lib/marketing/demo-bar.ts + public/static/demo-bar.{js,css}): the pill and the
// catalogue on the live demos only — never on a couple's website or in a frame —, the list against the /designs
// catalogue, links (same page, same ?lang=), the visitor's language from page to page, the five languages, the script's
// accessible behaviour (in a small fake DOM: no browser in npm test) and its weight.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { gzipSync } from 'node:zlib';
import * as cheerio from 'cheerio';
import { GET as getSite } from '../app/[slug]/route.ts';
import { GET as getSitePage } from '../app/[slug]/[page]/route.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { claimableTheme } from '../lib/claim/themes.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { loadDict } from '../lib/i18n/dicts.ts';
import { expectedKeys } from '../lib/i18n/keys.ts';
import { LANGS } from '../lib/i18n/langs.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { catalogDesigns } from '../lib/marketing/designs.ts';
import {
  DEMO_BAR_COPY,
  DEMO_BAR_CSS,
  DEMO_BAR_DATA_ID,
  DEMO_BAR_GROUPS,
  DEMO_BAR_JS,
  DEMO_BAR_SEARCH_WORDS,
  DEMO_BAR_STOP,
  demoBarData,
  demoBarFor,
  demoBarLang,
  searchKeys,
  withDemoBar,
  type DemoBarData,
} from '../lib/marketing/demo-bar.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const JS_FILE = path.join(PLATFORM_ROOT, 'public', DEMO_BAR_JS);
const CSS_FILE = path.join(PLATFORM_ROOT, 'public', DEMO_BAR_CSS);

async function demo(pathname: string, headers: Record<string, string> = {}) {
  const [, , , theme, page = 'index'] = new URL(pathname, BASE).pathname.split('/');
  const res = await handleDemoPage(new Request(`${BASE}${pathname}`, { headers }), theme, page);
  const html = await res.text();
  const $ = cheerio.load(html);
  const raw = $(`#${DEMO_BAR_DATA_ID}`).text();
  return { res, html, $, data: raw ? (JSON.parse(raw) as DemoBarData) : null };
}

const ids = (d: DemoBarData) => d.groups.flatMap((g) => g.items.map((i) => i.id));

let site: { slug: string; previewKey: string };
before(async () => {
  process.env.PLATFORM_DATA_DIR = tmpDir('demo-bar-data-');
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'clara-and-julian', theme: 'blush-garden-rose', content: demoContent() });
  await publishSite(adapter, created.site.id);
  site = { slug: 'clara-and-julian', previewKey: created.previewKey };
});

// ---------------------------------------------------------------- where it shows

test('a live demo carries the bar: its stylesheet in <head>, the JSON and the deferred script at the end of <body>', async () => {
  for (const p of ['/start/demo/olive-ivory', '/start/demo/olive-ivory/details', '/start/demo/blush-garden-rose/rsvp']) {
    const { res, $, data } = await demo(p);
    assert.equal(res.status, 200, p);
    assert.equal($(`head > link[rel="stylesheet"][href="${DEMO_BAR_CSS}"]`).length, 1, `${p}: stylesheet`);
    assert.equal($(`body > script#${DEMO_BAR_DATA_ID}[type="application/json"]`).length, 1, `${p}: data`);
    assert.equal($(`body > script[src="${DEMO_BAR_JS}"][defer]`).length, 1, `${p}: script`);
    assert.ok($(`body > script[src="${DEMO_BAR_JS}"]`).prev().is(`#${DEMO_BAR_DATA_ID}`), `${p}: data right before the script`);
    // nothing visible is server-rendered: the theme's own markup is untouched (one <h1>, no bar elements)
    assert.equal($('.pdb, [data-demo-bar-ui]').length, 0, p);
    assert.ok(data, p);
    assert.match(res.headers.get('vary') ?? '', /Sec-Fetch-Dest/);
    // the script is a same-origin file: script-src 'self' covers it, no new inline script hash is needed
    assert.match(res.headers.get('content-security-policy') ?? '', /script-src 'self'/);
  }
  const { data } = await demo('/start/demo/olive-ivory');
  assert.deepEqual(data!.current, { id: 'olive-ivory', name: 'Olive & Ivory' });
});

test('framed (the /start preview, the sales site\'s demo dialog): the server leaves the bar out', async () => {
  const framed = await demo('/start/demo/olive-ivory/home', { 'sec-fetch-dest': 'iframe' });
  assert.equal(framed.res.status, 200);
  assert.equal(framed.data, null);
  assert.ok(!framed.html.includes('demo-bar'), 'no trace of the bar');
  const top = await demo('/start/demo/olive-ivory/home', { 'sec-fetch-dest': 'document' });
  assert.ok(top.data);
  // the theme's page is the same otherwise
  assert.equal(framed.res.headers.get('content-security-policy'), top.res.headers.get('content-security-policy'));
  assert.equal(framed.$('h1').length, top.$('h1').length);
});

test('the script draws nothing inside a frame or without its data', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  assert.equal(runBar(data, { framed: true }).appended, 0);
  assert.equal(runBar(null).appended, 0);
  assert.equal(runBar(data).appended, 1);
});

test('a couple\'s website (/<slug>, its pages and its preview link) never gets the bar', async () => {
  const pages: Response[] = [
    await getSite(new Request(`${BASE}/${site.slug}`), { params: Promise.resolve({ slug: site.slug }) }),
    await getSite(new Request(`${BASE}/${site.slug}?lang=tr&preview=${site.previewKey}`), { params: Promise.resolve({ slug: site.slug }) }),
  ];
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    pages.push(await getSitePage(new Request(`${BASE}/${site.slug}/${page}`), { params: Promise.resolve({ slug: site.slug, page }) }));
  }
  for (const res of pages) {
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(!html.includes('demo-bar'), res.url);
    assert.ok(!html.includes(DEMO_BAR_DATA_ID));
  }
});

test('only the demo page handler adds the bar (not the site renderer, the panel, /start or the sales site)', () => {
  const users: string[] = [];
  const walk = (rel: string) => {
    for (const name of readdirSync(path.join(PLATFORM_ROOT, rel))) {
      const r = path.join(rel, name);
      if (statSync(path.join(PLATFORM_ROOT, r)).isDirectory()) walk(r);
      else if (/\.(tsx?|js)$/.test(name) && /from '[^']*\/demo-bar(\.ts)?'|demo-bar\.(js|css)/.test(readFileSync(path.join(PLATFORM_ROOT, r), 'utf8')))
        users.push(r.split(path.sep).join('/'));
    }
  };
  for (const dir of ['app', 'components', 'lib']) walk(dir);
  assert.deepEqual(users.sort(), ['lib/claim/demo-page.ts', 'lib/marketing/demo-bar.ts']);
});

// ---------------------------------------------------------------- the list

test('the list = every /designs design with a public demo: "Available now" (live), then "Coming soon on Etsy" (preview)', async () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  const catalogue = catalogDesigns();
  const live = catalogue.filter((d) => d.status === 'live').map((d) => d.id);
  const preview = catalogue.filter((d) => d.status === 'preview').map((d) => d.id);
  const expected: Array<[string, string, string[]]> = [
    ['live', 'Available now', live],
    ['preview', 'Coming soon on Etsy', preview],
  ];
  assert.deepEqual(
    data.groups.map((g) => [g.id, g.label, g.items.map((i) => i.id)]),
    expected.filter(([, , items]) => items.length > 0),
  );
  // hidden 'coming' designs are not offered; every listed design really has a public demo
  const coming = MARKETING.designs.filter((d) => d.status === 'coming').map((d) => d.id);
  assert.ok(coming.length > 0);
  for (const id of coming) assert.ok(!ids(data).includes(id), `${id} is hidden from the catalogue`);
  for (const id of ids(data)) assert.ok(await claimableTheme(id), `${id}: has a demo`);
  for (const item of data.groups.flatMap((g) => g.items)) {
    const d = catalogue.find((x) => x.id === item.id)!;
    assert.equal(item.name, d.name);
    assert.equal(item.href, `/start/demo/${item.id}`);
    // the design's real envelope screen (the catalogue's own picture), served from public/
    assert.ok(item.thumb, item.id);
    assert.match(item.thumb!, /^\/(marketing\/designs|themes)\//);
    if (item.thumb!.startsWith('/marketing/')) assert.ok(statSync(path.join(PLATFORM_ROOT, 'public', item.thumb!)).isFile(), item.thumb!);
  }
  assert.deepEqual(data.links, { home: '/', designs: '/designs', start: '/start?theme=olive-ivory' });
});

test('"Start" only for a design on sale; a demo outside the catalogue still gets the bar with its own name', () => {
  const preview = catalogDesigns().find((d) => d.status === 'preview');
  if (preview) assert.equal(demoBarData({ current: { id: preview.id, name: 'x' }, page: 'index', lang: null }).links.start, null);
  const coming = MARKETING.designs.find((d) => d.status === 'coming')!;
  const data = demoBarData({ current: { id: coming.id, name: 'Theme Name' }, page: 'home', lang: null });
  assert.equal(data.current.name, 'Theme Name');
  assert.equal(data.links.start, null);
  assert.ok(!ids(data).includes(coming.id));
});

test('one tap = the same page of the other design (its first page when it has no such page)', async () => {
  const { data } = await demo('/start/demo/olive-ivory/story');
  for (const item of data!.groups.flatMap((g) => g.items)) assert.equal(item.href, `/start/demo/${item.id}/story`);
  const other = catalogDesigns()[0].id;
  const without = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'rsvp', lang: 'de', hasPage: (id) => id !== other });
  const hrefOf = (id: string) => without.groups.flatMap((g) => g.items).find((i) => i.id === id)!.href;
  assert.equal(hrefOf(other), `/start/demo/${other}?lang=de`);
  assert.equal(hrefOf('olive-ivory'), '/start/demo/olive-ivory/rsvp?lang=de');
});

// ---------------------------------------------------------------- language

test('?lang= is kept: every design link, the theme\'s own page links, Home and All designs in that language', async () => {
  const { data, $ } = await demo('/start/demo/olive-ivory/details?lang=tr');
  assert.equal(data!.lang, 'tr');
  assert.deepEqual(data!.links, { home: '/tr', designs: '/tr/designs', start: '/start?theme=olive-ivory' });
  for (const item of data!.groups.flatMap((g) => g.items)) assert.equal(item.href, `/start/demo/${item.id}/details?lang=tr`);
  // the demo's own navigation keeps it, so the bar stays Turkish after the envelope opens or a nav tap
  const site = JSON.parse($('#site-data').text()) as { pages: Record<string, string> };
  for (const [page, url] of Object.entries(site.pages)) assert.match(url, /[?&]lang=tr(&|$)/, page);
  const links = $('a[href^="/start/demo/olive-ivory"]').map((_, a) => $(a).attr('href')).get();
  assert.ok(links.length > 0);
  for (const href of links) assert.match(href, /[?&]lang=tr(&|$)/, href);
  // the page itself stays in its content's language
  assert.equal($('html').attr('lang'), 'en');
  // the words are the market dictionary's
  const tr = await loadDict('market', 'tr');
  assert.equal(data!.copy.home, tr['Home']);
  assert.equal(data!.copy.designs, tr['All designs']);
  assert.equal(data!.groups[0].label, tr['Available now']);
});

test('no ?lang=, an unknown one or English: English words, plain links; a localized sales page as referrer sets it', async () => {
  for (const q of ['', '?lang=xx', '?lang=en']) {
    const { data } = await demo(`/start/demo/olive-ivory/home${q}`);
    assert.equal(data!.lang, 'en', q);
    assert.equal(data!.copy.designs, 'All designs');
    assert.deepEqual([data!.links.home, data!.links.designs], ['/', '/designs']);
    for (const item of data!.groups.flatMap((g) => g.items)) assert.ok(!item.href.includes('lang='), `${q}: ${item.href}`);
  }
  // a "Live demo" link opened in a new tab from /fr/designs
  const fr = await demo('/start/demo/olive-ivory/home', { referer: `${BASE}/fr/designs` });
  assert.equal(fr.data!.lang, 'fr');
  assert.equal(fr.data!.links.designs, '/fr/designs');
  assert.match(fr.res.headers.get('vary') ?? '', /Referer/);
  const at = (ref: string, url = `${BASE}/start/demo/x`) => demoBarLang(new URL(url), new Headers({ referer: ref, host: 'localhost:3000' }));
  assert.equal(at(`${BASE}/de`), 'de');
  assert.equal(at(`${BASE}/es/guides/x`), 'es');
  assert.equal(at(`${BASE}/designs`), null);
  assert.equal(at(`${BASE}/start/demo/olive-ivory`), null);
  assert.equal(at('https://elsewhere.example/tr/designs'), null, 'another host');
  assert.equal(at(`${BASE}/tr/designs`, `${BASE}/start/demo/x?lang=de`), 'de', '?lang= wins');
  assert.equal(at('not a url'), null);
});

test('engine linkLang: page links keep the visitor\'s language only when the page is in its primary language', () => {
  const html = '<!DOCTYPE html><html><head><title>t</title></head><body><a id="a" href="home.html">Home</a></body></html>';
  const theme = { id: 't', pages: { index: 'index.html', home: 'home.html' }, photos: {} } as const;
  const base = { html, content: demoContent(), theme, page: 'index' as const, slug: 'start/demo/t', previewKey: 'demo' };
  assert.equal(cheerio.load(renderTemplate({ ...base, linkLang: 'es' }).html)('#a').attr('href'), '/start/demo/t/home?lang=es&preview=demo');
  assert.equal(cheerio.load(renderTemplate({ ...base, linkLang: 'en' }).html)('#a').attr('href'), '/start/demo/t/home?preview=demo');
  assert.equal(cheerio.load(renderTemplate(base).html)('#a').attr('href'), '/start/demo/t/home?preview=demo');
});

test('every word of the bar exists in all five languages (market dictionaries)', async () => {
  const keys = [...Object.values(DEMO_BAR_COPY), ...DEMO_BAR_GROUPS.map((g) => g.label), ...DEMO_BAR_SEARCH_WORDS.map(([w]) => w)];
  const market = expectedKeys('market');
  for (const k of keys) assert.ok(market.has(k), `the scanner finds ${JSON.stringify(k)}`);
  for (const lang of LANGS.filter((l) => l !== 'en')) {
    const dict = await loadDict('market', lang);
    for (const k of keys) assert.ok(dict[k]?.trim(), `market/${lang}: ${JSON.stringify(k)}`);
    const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang, dict });
    assert.equal(data.lang, lang);
    for (const [k, v] of Object.entries(data.copy)) assert.equal(v, dict[DEMO_BAR_COPY[k as keyof typeof DEMO_BAR_COPY]], `${lang} ${k}`);
    assert.match(data.copy.noMatch, /\{q\}/, `${lang}: noMatch keeps {q}`);
    assert.match(data.copy.found, /\{n\}/, `${lang}: found keeps {n}`);
    // the search words are words: lower case, no punctuation, no digits (a typed number means a design's number)
    for (const [w] of DEMO_BAR_SEARCH_WORDS) assert.match(dict[w], /^[\p{Ll}]+(?: [\p{Ll}]+)*$/u, `market/${lang} ${JSON.stringify(w)}: ${dict[w]}`);
  }
  // the script itself writes no words: every label comes from the page's JSON
  const js = readFileSync(JS_FILE, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
  for (const word of ['Live demo', 'Choose a design', 'Close', 'Home', 'All designs', 'Available', 'Coming soon', 'Start your website', 'Search', 'Clear', 'No designs', 'Show all', 'Designs found']) {
    assert.ok(!js.includes(`'${word}`), `demo-bar.js hard-codes "${word}"`);
  }
});

// ---------------------------------------------------------------- the script (fake DOM)

test('the pill is a real button that opens an accessible catalogue; Tab stays inside, Esc closes and gives focus back', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'details', lang: null });
  const { doc, win, root } = runBar(data);
  const pill = find(root!, (e) => e.className === 'pdb-pill')!;
  const panel = find(root!, (e) => e.className === 'pdb-panel')!;
  assert.equal(pill.tag, 'button');
  assert.equal(pill.type, 'button');
  assert.equal(pill.getAttribute('aria-expanded'), 'false');
  assert.equal(pill.getAttribute('aria-haspopup'), 'dialog');
  assert.equal(pill.getAttribute('aria-controls'), panel.id);
  assert.match(pill.getAttribute('aria-label')!, /^Live demo: Olive & Ivory\. Choose a design$/);
  assert.equal(panel.getAttribute('role'), 'dialog');
  assert.equal(panel.getAttribute('aria-modal'), 'true');
  assert.equal(panel.getAttribute('aria-label'), 'Choose a design');
  assert.equal(panel.hidden, true);
  // the catalogue: one link per design, the current one marked; Home, All designs, Start
  const items = findAll(panel, (e) => e.className === 'pdb-item');
  assert.deepEqual(
    items.map((a) => a.href),
    data.groups.flatMap((g) => g.items.map((i) => i.href)),
  );
  assert.deepEqual(
    findAll(panel, (e) => e.getAttribute('aria-current') === 'page').map((a) => a.href),
    ['/start/demo/olive-ivory/details'],
  );
  assert.deepEqual(
    findAll(panel, (e) => e.className === 'pdb-link' || e.className === 'pdb-start').map((a) => a.href),
    ['/', '/designs', '/start?theme=olive-ivory'],
  );
  for (const img of findAll(panel, (e) => e.tag === 'img')) {
    assert.equal(img.alt, '', 'thumbnails are decorative: the link text names the design');
    assert.equal(img.loading, 'lazy');
  }
  assert.deepEqual(
    findAll(panel, (e) => e.tag === 'h2').map((h) => h.children[0].textContent),
    data.groups.map((g) => g.label),
  );
  // open (click = Enter / Space on a button)
  pill.fire('click');
  assert.equal(panel.hidden, false);
  assert.equal(pill.getAttribute('aria-expanded'), 'true');
  const close = find(panel, (e) => e.className === 'pdb-close')!;
  assert.equal(doc.activeElement, close, 'focus moves into the catalogue');
  assert.equal(close.getAttribute('aria-label'), 'Close');
  // Tab wraps (around what is shown: the search's hidden × and "Show all designs" are left out)
  const focusables = panel.querySelectorAll('a[href], button, input').filter((e) => e.getClientRects().length > 0);
  assert.equal(focusables[focusables.length - 1].className, 'pdb-item');
  assert.ok(focusables.some((e) => e.className === 'pdb-input'));
  panel.fire('keydown', { key: 'Tab', shiftKey: true });
  assert.equal(doc.activeElement, focusables[focusables.length - 1]);
  panel.fire('keydown', { key: 'Tab', shiftKey: false });
  assert.equal(doc.activeElement, focusables[0]);
  // Esc closes, the theme never hears it, focus returns to the pill
  const esc = win.fire('keydown', { key: 'Escape' });
  assert.ok(esc.stopped && esc.prevented);
  assert.equal(panel.hidden, true);
  assert.equal(pill.getAttribute('aria-expanded'), 'false');
  assert.equal(doc.activeElement, pill);
  // the close button and the backdrop close it too
  pill.fire('click');
  close.fire('click');
  assert.equal(panel.hidden, true);
  pill.fire('click');
  find(root!, (e) => e.className === 'pdb-backdrop')!.fire('click');
  assert.equal(panel.hidden, true);
  // taps and keys on the bar never reach the theme (a tap on the pill must not open the envelope)
  for (const type of ['click', 'pointerdown', 'touchstart', 'keydown']) assert.ok(root!.fire(type).stopped, type);
  // the language of the bar
  assert.equal(root!.lang, 'en');
});

test('the pill sits opposite the theme\'s nav: at the top, at the bottom when the nav is a fixed top bar', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'home', lang: null });
  assert.equal(runBar(data).root!.getAttribute('data-edge'), 'top');
  assert.equal(runBar(data, { nav: { top: 900, height: 60 } }).root!.getAttribute('data-edge'), 'top');
  assert.equal(runBar(data, { nav: { top: 0, height: 64 } }).root!.getAttribute('data-edge'), 'bottom');
});

// ---------------------------------------------------------------- search (owner request 2026-10-24)

/** A listed design's search text as the script reads it: name, number and its words. */
function searchWordsOf(data: DemoBarData, id: string): string {
  const it = data.groups.flatMap((g) => g.items).find((i) => i.id === id)!;
  return [it.name, ...it.k.map((i) => data.words[i])].join(' ').toLowerCase();
}

test('search data: every design has its number and its words — English, plus the visitor\'s language on a localized visit', async () => {
  const en = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  const items = en.groups.flatMap((g) => g.items);
  // numbers: the collection's ("07"), one per design
  for (const it of items) assert.match(it.no, /^\d{2}$/, it.id);
  assert.equal(new Set(items.map((i) => i.no)).size, items.length);
  assert.equal(items.find((i) => i.id === 'burgundy-velvet-autumn')!.no, '07');
  assert.equal(items.find((i) => i.id === 'ivory-pearl-atelier')!.no, '49');
  // every index points into the shared list; every listed word is used
  for (const it of items) for (const k of it.k) assert.ok(en.words[k], `${it.id} ${k}`);
  assert.deepEqual(new Set(items.flatMap((i) => i.k)).size, en.words.length);
  // style, colour, palette and opening words from each design's own copy
  const has = (data: DemoBarData, id: string, list: string[]) => {
    const words = new Set(searchWordsOf(data, id).split(/[^\p{L}\p{N}]+/u));
    for (const w of list) assert.ok(words.has(w), `${data.lang} ${id}: "${w}" in ${[...words].join(' ')}`);
  };
  const hasNot = (data: DemoBarData, id: string, list: string[]) => {
    const words = new Set(searchWordsOf(data, id).split(/[^\p{L}\p{N}]+/u));
    for (const w of list) assert.ok(!words.has(w), `${data.lang} ${id}: no "${w}"`);
  };
  has(en, 'blush-garden-rose', ['rose', 'pink', 'romantic', 'floral', 'garden', 'gold', 'sage', 'envelope']);
  has(en, 'mediterranean-lemon', ['blue', 'yellow', 'cobalt', 'summer', 'destination']);
  has(en, 'art-deco-black-tie', ['gatefold', 'art', 'deco', 'navy', 'gold', 'pearl']);
  has(en, 'lavender-provence', ['pouch', 'rustic', 'boho', 'purple', 'lavender']);
  has(en, 'tropical-destination', ['wallet', 'tropical', 'teal']);
  has(en, 'enchanted-forest-storybook', ['book', 'forest', 'vintage']);
  has(en, 'wildflower-meadow-vellum', ['sleeve', 'garden', 'rustic']);
  has(en, 'coastal-seaside', ['beach', 'sea']);
  has(en, 'winter-evergreen', ['winter', 'green', 'seasonal']);
  // no false friends: rose gold / rose quartz are not roses, blackberries are not black, frosted vellum is not winter
  hasNot(en, 'velvet-jewel-box', ['flowers', 'floral']);
  hasNot(en, 'music-box-ballerina', ['flowers', 'floral']);
  hasNot(en, 'burgundy-velvet-autumn', ['black']);
  hasNot(en, 'wildflower-meadow-vellum', ['winter']);
  // English words only on an English visit
  assert.ok(!en.words.some((w) => /altın|zarf/.test(w)));
  // a Turkish visit: the same words plus the Turkish ones
  const tr = await demoBarFor('tr', { id: 'olive-ivory', name: 'Olive & Ivory' }, 'index');
  has(tr, 'blush-garden-rose', ['gül', 'pembe', 'altın', 'zarf', 'romantik', 'çiçekli', 'bahçe', 'rose', 'gold', 'envelope']);
  has(tr, 'lavender-provence', ['kır', 'rustik', 'kese', 'lavanta', 'mor']);
  has(tr, 'olive-ivory', ['zeytin', 'dantel', 'mühür', 'yeşil']);
  // every search word gives at least one listed design its word (no dead words)
  const designs = catalogDesigns();
  for (const [w] of DEMO_BAR_SEARCH_WORDS) assert.ok(designs.some((d) => searchKeys(d).includes(w)), `"${w}" finds no design`);
});

test('search: live, case- and accent-blind, every word must match, numbers, Turkish ı/İ', async () => {
  const en = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  const all = en.groups.flatMap((g) => g.items.map((i) => i.id));
  const bar = searchBar(en);
  assert.deepEqual(bar.shown(), all, 'everything before typing');
  const rose = bar.type('rose');
  assert.ok(rose.includes('blush-garden-rose') && rose.includes('crimson-rose-atelier') && rose.length < all.length, rose.join());
  assert.deepEqual(bar.type('ROSE'), rose);
  assert.deepEqual(bar.type('  Rose  '), rose);
  assert.deepEqual(bar.type('rosé'), rose);
  // the start of a word while typing; a longer form of a word
  assert.ok(bar.type('lav').includes('lavender-provence'));
  assert.deepEqual(bar.type('roses'), rose);
  // every word must match (AND), in the catalogue's order
  const gold = bar.type('gold');
  assert.deepEqual(bar.type('rose gold'), rose.filter((id) => gold.includes(id)));
  const blue = bar.type('blue');
  const both = bar.type('blue gold');
  assert.deepEqual(both, blue.filter((id) => gold.includes(id)));
  assert.ok(both.length > 0 && both.length < blue.length && both.length < gold.length, both.join());
  assert.deepEqual(bar.type('gold, blue'), both);
  // numbers: "7" and "07" are design 07; a number with a word that design lacks: nothing
  assert.deepEqual(bar.type('7'), ['burgundy-velvet-autumn']);
  assert.deepEqual(bar.type('07'), ['burgundy-velvet-autumn']);
  assert.deepEqual(bar.type('#49'), ['ivory-pearl-atelier']);
  assert.deepEqual(bar.type('7 velvet'), ['burgundy-velvet-autumn']);
  assert.deepEqual(bar.type('7 lemon'), []);
  // opening objects
  assert.deepEqual(bar.type('gatefold'), ['art-deco-black-tie', 'ivory-lace-pearls']);
  assert.deepEqual(bar.type('pouch'), ['lavender-provence']);

  // a Turkish visitor
  const trData = await demoBarFor('tr', { id: 'olive-ivory', name: 'Olive & Ivory' }, 'index');
  const tr = searchBar(trData);
  const altin = tr.type('altın');
  assert.ok(altin.length > 5 && altin.includes('crimson-rose-atelier'), altin.join());
  for (const q of ['ALTIN', 'Altın', 'altin', 'ALTİN']) assert.deepEqual(tr.type(q), altin, q);
  const gul = tr.type('gül');
  assert.ok(gul.includes('blush-garden-rose') && gul.includes('crimson-rose-atelier'), gul.join());
  for (const q of ['GÜL', 'gul', 'Gül']) assert.deepEqual(tr.type(q), gul, q);
  // "kır" (country, rustic) is a word of its own: not "kırmızı" (red)
  const kir = tr.type('kır');
  assert.ok(kir.includes('lavender-provence') && kir.includes('sunflower-rustic-barn'), kir.join());
  const red = tr.type('kırmızı');
  assert.ok(red.includes('vintage-airmail-love-letter') && !kir.includes('vintage-airmail-love-letter'));
  assert.ok(tr.type('kı').length >= new Set([...kir, ...red]).size, 'while typing, the start of a word');
  // "zarf" = every design that opens from an envelope; "zarflı" the same
  const zarf = tr.type('zarf');
  assert.deepEqual(zarf, all.filter((id) => !['art-deco-black-tie', 'ivory-lace-pearls', 'lavender-provence', 'tropical-destination', 'enchanted-forest-storybook', 'wildflower-meadow-vellum'].includes(id)));
  assert.deepEqual(tr.type('zarflı'), zarf);
  assert.deepEqual(tr.type('İNCİ'), tr.type('inci'));
  assert.ok(tr.type('inci').includes('ivory-lace-pearls'));
  // English words still work on a Turkish visit
  assert.deepEqual(tr.type('gold'), altin);
  // German ß and French œ
  const de = searchBar(await demoBarFor('de', { id: 'olive-ivory', name: 'Olive & Ivory' }, 'index'));
  assert.ok(de.type('weiß').length > 0);
  assert.deepEqual(de.type('WEISS'), de.type('weiß'));
  const fr = searchBar(await demoBarFor('fr', { id: 'olive-ivory', name: 'Olive & Ivory' }, 'index'));
  assert.ok(fr.type('nœud').includes('blush-garden-rose'));
  assert.deepEqual(fr.type('noeud'), fr.type('nœud'));
  assert.ok(fr.type('dentelle').includes('olive-ivory'));
});

test('search: little words ("and", "ve", "y", "und", "et") neither empty the results nor narrow them', async () => {
  const cur = { id: 'olive-ivory', name: 'Olive & Ivory' };
  const en = searchBar(demoBarData({ current: cur, page: 'index', lang: null }));
  const goldRose = en.type('gold rose');
  assert.ok(goldRose.length > 0);
  assert.deepEqual(en.type('gold and rose'), goldRose);
  assert.deepEqual(en.type('The gold with the rose'), goldRose);
  const tr = searchBar(await demoBarFor('tr', cur, 'index'));
  const altinGul = tr.type('altın gül');
  assert.ok(altinGul.includes('blush-garden-rose'), altinGul.join());
  assert.deepEqual(tr.type('altın ve gül'), altinGul);
  assert.deepEqual(tr.type('altın ile gül'), altinGul);
  // typed alone, a little word is the start of a word: "ve" → Velvet, Vellum (not every design with "Klasik ve zarif")
  const ve = tr.type('ve');
  assert.ok(['burgundy-velvet-autumn', 'velvet-jewel-box', 'wildflower-meadow-vellum'].every((id) => ve.includes(id)), ve.join());
  assert.ok(!ve.includes('olive-ivory'), ve.join());
  for (const [lang, q, plain] of [
    ['de', 'gold und rosen', 'gold rosen'],
    ['es', 'oro y rosas', 'oro rosas'],
    ['es', 'papel de arroz', 'papel arroz'],
    ['fr', 'or et roses', 'or roses'],
    ['fr', 'carte à volets', 'carte volets'],
  ] as const) {
    const bar = searchBar(await demoBarFor(lang, cur, 'index'));
    const want = bar.type(plain);
    assert.ok(want.length > 0, `${lang} ${plain}`);
    assert.deepEqual(bar.type(q), want, `${lang} ${q}`);
  }
  // the list: English plus the visitor's language; lower case without accents (as the script compares); never a real
  // search word or a word of a design's name ("or" is French gold)
  assert.deepEqual(demoBarData({ current: cur, page: 'index', lang: null }).stop, DEMO_BAR_STOP.en);
  const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').split(/[^\p{L}]+/u);
  const names = new Set(catalogDesigns().flatMap((d) => fold(d.name)));
  for (const lang of LANGS) {
    const dict = lang === 'en' ? null : await loadDict('market', lang);
    if (dict) assert.deepEqual(demoBarData({ current: cur, page: 'index', lang, dict }).stop, [...new Set([...DEMO_BAR_STOP.en, ...DEMO_BAR_STOP[lang]])]);
    const real = new Set(DEMO_BAR_SEARCH_WORDS.flatMap(([w]) => fold(`${w} ${dict?.[w] ?? ''}`)));
    for (const s of DEMO_BAR_STOP[lang]) {
      assert.match(s, /^[a-z]+$/, `${lang} ${s}`);
      assert.ok(!real.has(s) && !names.has(s), `${lang}: "${s}" is a search word`);
    }
  }
});

test('search: "rose" means roses, not the colours "rose gold", "rose quartz", "dusty rose" (in every language)', async () => {
  const cur = { id: 'olive-ivory', name: 'Olive & Ivory' };
  const en = searchBar(demoBarData({ current: cur, page: 'index', lang: null }));
  const rose = en.type('rose');
  assert.ok(rose.includes('blush-garden-rose') && rose.includes('crimson-rose-atelier'), rose.join());
  for (const id of ['velvet-jewel-box', 'music-box-ballerina', 'cherry-blossom-spring', 'sky-lantern-festival']) assert.ok(!rose.includes(id), `"rose" finds ${id}`);
  // the colours' other words still find them
  assert.ok(en.type('quartz').includes('music-box-ballerina'));
  assert.ok(en.type('pink').includes('cherry-blossom-spring'));
  assert.ok(en.type('gold').includes('velvet-jewel-box'));
  const de = searchBar(await demoBarFor('de', cur, 'index'));
  assert.deepEqual(de.type('rose'), de.type('rosen'));
  assert.deepEqual(de.type('rosen'), rose);
  const tr = searchBar(await demoBarFor('tr', cur, 'index'));
  assert.deepEqual(tr.type('gül'), rose);
});

test('search: what the visitor typed shows as typed in the messages ($&, $` are not replacement patterns)', () => {
  const bar = searchBar(demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null }));
  const status = find(bar.panel, (e) => e.getAttribute('role') === 'status')!;
  for (const q of ['zz$&', '$`zx', "zq$'", 'zz$$b', '{q}{n}']) {
    bar.type(q);
    assert.equal(bar.by('pdb-empty-text').textContent, `No designs match "${q}"`, q);
    bar.flush();
    assert.equal(status.textContent, `No designs match "${q}"`, q);
  }
});

test('search field: label, attributes, × and the group headings follow the results', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  const bar = searchBar(data);
  const { input } = bar;
  assert.equal(input.tag, 'input');
  for (const [k, v] of Object.entries({ type: 'search', enterkeyhint: 'search', autocomplete: 'off', spellcheck: 'false', placeholder: 'Search designs', 'aria-controls': 'pdb-list' }))
    assert.equal(input.getAttribute(k), v, k);
  const label = find(bar.panel, (e) => e.tag === 'label')!;
  assert.equal(label.getAttribute('for'), input.id);
  assert.equal(label.textContent, 'Search designs');
  assert.equal(find(bar.panel, (e) => e.getAttribute('role') === 'search')!.children.includes(input), true);
  // right above the grid, outside it (it stays in view while the grid scrolls)
  const kids = bar.panel.children.map((c) => c.className);
  assert.equal(kids[kids.indexOf('pdb-search') + 1], 'pdb-scroll');
  assert.ok(kids.indexOf('pdb-links') < kids.indexOf('pdb-search'));
  // the × only with something typed
  const clear = bar.by('pdb-clear');
  assert.equal(clear.getAttribute('aria-label'), 'Clear search');
  assert.equal(bar.visible(clear), false);
  bar.type('velvet');
  assert.equal(bar.visible(clear), true);
  // a group without results hides; the counts follow
  const sections = findAll(bar.panel, (e) => e.tag === 'section');
  const counts = findAll(bar.panel, (e) => e.className === 'pdb-count').map((c) => c.textContent);
  assert.equal(bar.shown().length, 4);
  assert.deepEqual(counts, ['2', '2']);
  bar.type('07');
  assert.deepEqual(sections.map((x) => bar.visible(x)), [true, false]);
  assert.equal(findAll(bar.panel, (e) => e.className === 'pdb-count')[0].textContent, '1');
  // the current design keeps its mark
  bar.type('olive');
  assert.equal(findAll(bar.panel, (e) => e.getAttribute('aria-current') === 'page' && bar.visible(e)).length, 1);
  clear.fire('click');
  assert.equal(input.value, '');
  assert.equal(bar.doc.activeElement, input, '× puts the visitor back in the field');
  assert.equal(bar.shown().length, data.groups.flatMap((g) => g.items).length);
  assert.deepEqual(findAll(bar.panel, (e) => e.className === 'pdb-count').map((c) => c.textContent), data.groups.map((g) => String(g.items.length)));
  assert.equal(bar.visible(clear), false);
});

test('search: nothing found = a friendly message and "Show all designs"; the count is read out after a pause', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  const bar = searchBar(data);
  const status = find(bar.panel, (e) => e.getAttribute('role') === 'status')!;
  assert.equal(status.getAttribute('aria-live'), 'polite');
  const empty = bar.by('pdb-empty');
  assert.equal(bar.visible(empty), false);
  assert.equal(bar.root!.hasAttribute('data-q'), false);
  assert.deepEqual(bar.type('zzz unicorn'), []);
  assert.equal(bar.visible(empty), true);
  assert.equal(bar.root!.hasAttribute('data-q'), true, 'searching: the panel keeps its full height');
  assert.match(readFileSync(CSS_FILE, 'utf8'), /\.pdb\[data-q\] \.pdb-panel \{\s*height: 100vh;\s*height: 100dvh;/);
  assert.equal(bar.by('pdb-empty-text').textContent, 'No designs match "zzz unicorn"');
  assert.ok(findAll(bar.panel, (e) => e.tag === 'section').every((x) => !bar.visible(x)), 'no empty headings');
  // read out once, after the visitor pauses
  assert.equal(status.textContent, '');
  bar.type('zzz unicorns');
  assert.equal(bar.pending(), 1, 'debounced: one pending announcement');
  bar.flush();
  assert.equal(status.textContent, 'No designs match "zzz unicorns"');
  bar.type('velvet');
  bar.flush();
  assert.equal(status.textContent, 'Designs found: 4');
  bar.type('zzz');
  const all = bar.by('pdb-all');
  assert.equal(all.tag, 'button');
  assert.equal(all.textContent, 'Show all designs');
  all.fire('click');
  assert.equal(bar.input.value, '');
  assert.equal(bar.visible(empty), false);
  assert.equal(bar.root!.hasAttribute('data-q'), false);
  assert.equal(bar.shown().length, data.groups.flatMap((g) => g.items).length);
  // a touch screen: on the first design, no keyboard popping up again (no matchMedia here = not a fine pointer)
  assert.equal(bar.doc.activeElement!.className, 'pdb-item');
  assert.equal(bar.doc.activeElement!.href, data.groups[0].items[0].href);
  bar.flush();
  assert.equal(status.textContent, `Designs found: ${bar.shown().length}`);
  // a mouse or trackpad: back in the field
  const fine = searchBar(data, { fine: true });
  fine.type('zzz');
  fine.by('pdb-all').fire('click');
  assert.ok(fine.doc.activeElement === fine.input, String(fine.doc.activeElement?.className));
});

test('search: Esc on the × or on "Show all designs" clears and leaves the focus in the field (not lost on the page)', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  for (const [q, cls] of [
    ['velvet', 'pdb-clear'],
    ['zzz', 'pdb-all'],
  ]) {
    const bar = searchBar(data);
    bar.type(q);
    const btn = bar.by(cls);
    assert.equal(bar.visible(btn), true, cls);
    btn.focus();
    bar.win.fire('keydown', { key: 'Escape' });
    assert.equal(bar.input.value, '', cls);
    assert.equal(bar.visible(btn), false, `${cls} is hidden now`);
    assert.ok(bar.doc.activeElement === bar.input, `${cls}: focus in the field, not on ${bar.doc.activeElement?.className}`);
    assert.equal(bar.panel.hidden, false);
  }
  // on a design in the grid the focus stays there (still shown)
  const bar = searchBar(data);
  bar.type('velvet');
  bar.input.fire('keydown', { key: 'ArrowDown' });
  const a = bar.doc.activeElement;
  bar.win.fire('keydown', { key: 'Escape' });
  assert.ok(a?.className === 'pdb-item' && bar.doc.activeElement === a);
});

test('search keys: Enter opens the first result, ArrowDown goes into the grid, Esc clears first and closes next', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'details', lang: 'tr' });
  const bar = searchBar(data);
  const { input, panel, win } = bar;
  // Enter with nothing typed does nothing; with a query, the first design shown
  const idle = input.fire('keydown', { key: 'Enter' });
  assert.ok(idle.prevented);
  assert.equal((win.location as { href: string }).href, '/start/demo/x');
  bar.type('lemon');
  const enter = input.fire('keydown', { key: 'Enter' });
  assert.ok(enter.prevented);
  assert.equal((win.location as { href: string }).href, '/start/demo/mediterranean-lemon/details?lang=tr');
  // ArrowDown: the first design shown
  bar.type('velvet');
  input.fire('keydown', { key: 'ArrowDown' });
  assert.equal(bar.doc.activeElement!.href, '/start/demo/burgundy-velvet-autumn/details?lang=tr');
  // Esc: clears the search (the panel stays open), then closes
  const esc = win.fire('keydown', { key: 'Escape' });
  assert.ok(esc.prevented && esc.stopped);
  assert.equal(input.value, '');
  assert.equal(panel.hidden, false);
  win.fire('keydown', { key: 'Escape' });
  assert.equal(panel.hidden, true);
  assert.equal(bar.doc.activeElement, bar.pill);
  // the query resets when the catalogue closes (close button, backdrop, Esc, back from another demo)
  bar.pill.fire('click');
  bar.type('lemon');
  find(panel, (e) => e.className === 'pdb-close')!.fire('click');
  bar.pill.fire('click');
  assert.equal(input.value, '');
  assert.equal(bar.shown().length, data.groups.flatMap((g) => g.items).length);
  bar.type('lemon');
  win.fire('pageshow', { persisted: true });
  assert.equal(input.value, '');
  // typing never reaches the theme
  for (const type of ['input', 'keydown', 'keyup']) assert.ok(input.fire(type).stopped, type);
});

test('search focus: a mouse or trackpad goes straight into the field; a touch screen does not (no keyboard popping up)', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  assert.equal(searchBar(data, { fine: true }).doc.activeElement!.className, 'pdb-input');
  assert.equal(searchBar(data, { fine: false }).doc.activeElement!.className, 'pdb-close');
  assert.equal(searchBar(data).doc.activeElement!.className, 'pdb-close', 'no matchMedia: no autofocus');
});

test('the phone keyboard: the panel ends above it and leaves out the links (visualViewport)', () => {
  const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang: null });
  const vv = new FakeViewport(844);
  const bar = searchBar(data, { vv });
  const root = bar.root!;
  assert.equal(root.hasAttribute('data-kb'), false);
  vv.resize(420);
  assert.equal(root.hasAttribute('data-kb'), true);
  assert.equal(root.style.props['--pdb-vh'], '420px');
  vv.resize(844);
  assert.equal(root.hasAttribute('data-kb'), false);
  assert.equal(root.style.props['--pdb-vh'], undefined);
  // pinch zoom is not a keyboard
  vv.resize(420, 2);
  assert.equal(root.hasAttribute('data-kb'), false);
  const css = readFileSync(CSS_FILE, 'utf8');
  assert.match(css, /\.pdb\[data-kb\] \.pdb-panel \{[^}]*max-height: calc\(var\(--pdb-vh/);
  assert.match(css, /\.pdb\[data-kb\] \.pdb-links,\s*\.pdb\[data-kb\] \.pdb-start \{\s*display: none/);
  // browsers that shorten the whole page for the keyboard (no visual viewport difference): a short touch screen with the
  // field focused leaves out the links too
  assert.match(css, /@media \(max-height: 520px\) and \(pointer: coarse\) \{\s*\.pdb \.pdb-panel:has\(\.pdb-input:focus\) \.pdb-links,\s*\.pdb \.pdb-panel:has\(\.pdb-input:focus\) \.pdb-start \{\s*display: none/);
});

test('focus rings: the search field shows one in forced colours; the ×\'s stays inside the field', () => {
  const css = readFileSync(CSS_FILE, 'utf8');
  assert.match(css, /@media \(forced-colors: active\) \{\s*\.pdb \.pdb-input:focus \{\s*outline: 2px solid Highlight;/);
  assert.match(css, /\.pdb \.pdb-clear:focus-visible \{\s*outline-offset: -3px;/);
});

// ---------------------------------------------------------------- weight and safety

test('weight: small static files, a small inline list', async () => {
  // 2026-10-24 the search: js 12.3 → 18.2 KB (3.9 → 6.0 KB gzip), css 10.8 → 13.9 KB, the list 6.6 → 11.2 KB (1.5 → 3.9 KB
  // gzip, its search words in two languages)
  const js = readFileSync(JS_FILE);
  const css = readFileSync(CSS_FILE);
  assert.ok(js.length <= 19_000 && gzipSync(js).length <= 6_300, `demo-bar.js ${js.length} B, ${gzipSync(js).length} B gzip`);
  assert.ok(css.length <= 14_500 && gzipSync(css).length <= 3_900, `demo-bar.css ${css.length} B, ${gzipSync(css).length} B gzip`);
  for (const lang of LANGS) {
    const { $ } = await demo(`/start/demo/olive-ivory/details?lang=${lang}`);
    const json = $(`#${DEMO_BAR_DATA_ID}`).text();
    assert.ok(json.length <= 12_000 && gzipSync(json).length <= 4_200, `${lang}: inline list ${json.length} B, ${gzipSync(json).length} B gzip`);
  }
  assert.doesNotMatch(readFileSync(JS_FILE, 'utf8'), /localStorage|sessionStorage|document\.cookie|fetch\(|XMLHttpRequest|eval\(|innerHTML/);
});

test('the inline JSON cannot close its <script>; the bar is added once', () => {
  const data = demoBarData({ current: { id: 'nope', name: '</script><img src=x onerror=alert(1)>' }, page: 'index', lang: null });
  const page = '<!DOCTYPE html><html><head><title>t</title></head><body><p>x</p></body></html>';
  const out = withDemoBar(page, data);
  const $ = cheerio.load(out);
  assert.equal($('script').length, 2);
  assert.equal($('img').length, 0);
  assert.equal((JSON.parse($(`#${DEMO_BAR_DATA_ID}`).text()) as DemoBarData).current.name, data.current.name);
  assert.equal(withDemoBar(out, data), out);
});

// ---------------------------------------------------------------- a small fake DOM for public/static/demo-bar.js

type Listener = (e: FakeEvent) => void;
interface FakeEvent {
  type: string;
  key?: string;
  shiftKey?: boolean;
  persisted?: boolean;
  stopped: boolean;
  prevented: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}

class El {
  attrs = new Map<string, string>();
  children: El[] = [];
  parent: El | null = null;
  listeners: Record<string, Listener[]> = {};
  style = {
    props: {} as Record<string, string>,
    setProperty(k: string, v: string) {
      this.props[k] = v;
    },
    removeProperty(k: string) {
      delete this.props[k];
    },
  };
  className = '';
  textContent = '';
  hidden = false;
  id = '';
  href = '';
  type = '';
  lang = '';
  loading = '';
  decoding = '';
  alt = '';
  src = '';
  rel = '';
  width = 0;
  height = 0;
  offsetTop = 0;
  offsetHeight = 0;
  clientHeight = 0;
  scrollTop = 0;
  rect = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
  tag: string;
  owner: { activeElement: El | null };
  constructor(tag: string, owner: { activeElement: El | null }) {
    this.tag = tag;
    this.owner = owner;
  }
  value = '';
  setAttribute(k: string, v: unknown) {
    this.attrs.set(k, String(v));
    // reflected like the real DOM
    if (k === 'id' || k === 'type') this[k] = String(v);
  }
  getAttribute(k: string) {
    return this.attrs.get(k) ?? null;
  }
  hasAttribute(k: string) {
    return this.attrs.has(k);
  }
  removeAttribute(k: string) {
    this.attrs.delete(k);
  }
  appendChild(c: El) {
    c.parent = this;
    this.children.push(c);
    return c;
  }
  addEventListener(t: string, f: Listener) {
    (this.listeners[t] ??= []).push(f);
  }
  removeEventListener(t: string, f: Listener) {
    this.listeners[t] = (this.listeners[t] ?? []).filter((x) => x !== f);
  }
  contains(n: El | null) {
    for (let x = n; x; x = x.parent) if (x === this) return true;
    return false;
  }
  focus() {
    this.owner.activeElement = this;
  }
  getBoundingClientRect() {
    return this.rect;
  }
  /** No box when it or an ancestor is hidden. */
  getClientRects() {
    for (let x: El | null = this; x; x = x.parent) if (x.hidden) return [];
    return [this.rect];
  }
  querySelectorAll(sel: string) {
    assert.equal(sel, 'a[href], button, input');
    return findAll(this, (e) => (e.tag === 'a' && Boolean(e.href)) || e.tag === 'button' || e.tag === 'input');
  }
  /** Dispatch: the target's listeners, then its ancestors' (bubbling) unless stopped. */
  fire(type: string, init: Partial<FakeEvent> = {}): FakeEvent {
    const e = fakeEvent(type, init);
    for (let x: El | null = this; x && !e.stopped; x = x.parent) for (const f of x.listeners[type] ?? []) f.call(x, e);
    return e;
  }
}

function fakeEvent(type: string, init: Partial<FakeEvent> = {}): FakeEvent {
  return {
    type,
    stopped: false,
    prevented: false,
    preventDefault() {
      this.prevented = true;
    },
    stopPropagation() {
      this.stopped = true;
    },
    ...init,
  };
}

function findAll(root: El, pred: (e: El) => boolean): El[] {
  const out: El[] = [];
  const walk = (e: El) => {
    for (const c of e.children) {
      if (pred(c)) out.push(c);
      walk(c);
    }
  };
  walk(root);
  return out;
}
const find = (root: El, pred: (e: El) => boolean) => findAll(root, pred)[0];

/**
 * Runs public/static/demo-bar.js against a fake document; `framed` = inside an iframe; `nav` = the theme's .site-nav;
 * `fine` = a mouse or trackpad ((pointer: fine)); `vv` = window.visualViewport. `flush()` runs the pending timers.
 */
function runBar(
  data: DemoBarData | null,
  opts: { framed?: boolean; nav?: { top: number; height: number }; fine?: boolean; vv?: FakeViewport } = {},
) {
  const doc: { activeElement: El | null } & Record<string, unknown> = { activeElement: null };
  const body = new El('body', doc);
  const head = new El('head', doc);
  const nav = opts.nav ? Object.assign(new El('nav', doc), { rect: { top: opts.nav.top, bottom: opts.nav.top + opts.nav.height, left: 0, right: 390, width: 390, height: opts.nav.height } }) : null;
  const winListeners: Record<string, Listener[]> = {};
  const docListeners: Record<string, Listener[]> = {};
  Object.assign(doc, {
    body,
    head,
    documentElement: { clientWidth: 390 },
    getElementById: (id: string) => (id === DEMO_BAR_DATA_ID && data ? { textContent: JSON.stringify(data) } : null),
    querySelector: (sel: string) => (sel === '.site-nav' ? nav : null),
    querySelectorAll: () => [],
    createElement: (tag: string) => new El(tag, doc),
    createElementNS: (_ns: string, tag: string) => new El(tag, doc),
    addEventListener: (t: string, f: Listener) => (docListeners[t] ??= []).push(f),
    removeEventListener: (t: string, f: Listener) => (docListeners[t] = (docListeners[t] ?? []).filter((x) => x !== f)),
  });
  const win: Record<string, unknown> & { fire: (type: string, init?: Partial<FakeEvent>) => FakeEvent } = {
    document: doc,
    innerWidth: 390,
    innerHeight: 844,
    scrollY: 0,
    addEventListener: (t: string, f: Listener) => (winListeners[t] ??= []).push(f),
    removeEventListener: (t: string, f: Listener) => (winListeners[t] = (winListeners[t] ?? []).filter((x) => x !== f)),
    fire(type: string, init: Partial<FakeEvent> = {}) {
      const e = fakeEvent(type, init);
      for (const f of winListeners[type] ?? []) f(e);
      return e;
    },
  };
  win.self = win;
  win.top = opts.framed ? {} : win;
  win.location = { href: '/start/demo/x' };
  if (opts.fine !== undefined) win.matchMedia = (q: string) => ({ matches: q === '(pointer: fine)' && opts.fine });
  if (opts.vv) win.visualViewport = opts.vv;
  const timers = new Map<number, () => void>();
  let timerId = 0;
  vm.runInNewContext(readFileSync(JS_FILE, 'utf8'), {
    window: win,
    document: doc,
    getComputedStyle: () => ({ position: 'fixed' }),
    requestAnimationFrame: (f: () => void) => {
      f();
      return 1;
    },
    setTimeout: (f: () => void) => (timers.set(++timerId, f), timerId),
    clearTimeout: (id: number) => timers.delete(id),
  });
  const root = body.children.find((c) => c.hasAttribute('data-demo-bar-ui')) ?? null;
  const flush = () => {
    for (const [id, f] of [...timers]) {
      timers.delete(id);
      f();
    }
  };
  return { doc, win, root, appended: body.children.length, flush, pending: () => timers.size };
}

/** window.visualViewport: its size and scale, and its resize event. */
class FakeViewport {
  height: number;
  offsetTop = 0;
  scale = 1;
  listeners: Listener[] = [];
  constructor(height: number) {
    this.height = height;
  }
  addEventListener(t: string, f: Listener) {
    if (t === 'resize') this.listeners.push(f);
  }
  resize(height: number, scale = 1) {
    this.height = height;
    this.scale = scale;
    for (const f of this.listeners) f(fakeEvent('resize'));
  }
}

/** The open catalogue of a fake bar with its search: type, read what shows. */
function searchBar(data: DemoBarData, opts: Parameters<typeof runBar>[1] = {}) {
  const bar = runBar(data, opts);
  const panel = find(bar.root!, (e) => e.className === 'pdb-panel')!;
  const input = find(panel, (e) => e.className === 'pdb-input')!;
  const pill = find(bar.root!, (e) => e.className === 'pdb-pill')!;
  const visible = (e: El) => e.getClientRects().length > 0;
  const shown = () =>
    findAll(panel, (e) => e.className === 'pdb-item')
      .filter(visible)
      .map((a) => a.href.split('/')[3].split('?')[0]);
  const type = (q: string) => {
    input.value = q;
    input.fire('input');
    return shown();
  };
  pill.fire('click');
  return { ...bar, panel, input, pill, shown, type, visible, by: (cls: string) => find(panel, (e) => e.className === cls)! };
}
