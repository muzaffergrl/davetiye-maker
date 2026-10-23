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
  demoBarData,
  demoBarLang,
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
  const keys = [...Object.values(DEMO_BAR_COPY), ...DEMO_BAR_GROUPS.map((g) => g.label)];
  const market = expectedKeys('market');
  for (const k of keys) assert.ok(market.has(k), `the scanner finds ${JSON.stringify(k)}`);
  for (const lang of LANGS.filter((l) => l !== 'en')) {
    const dict = await loadDict('market', lang);
    for (const k of keys) assert.ok(dict[k]?.trim(), `market/${lang}: ${JSON.stringify(k)}`);
    const data = demoBarData({ current: { id: 'olive-ivory', name: 'Olive & Ivory' }, page: 'index', lang, dict });
    assert.equal(data.lang, lang);
    for (const [k, v] of Object.entries(data.copy)) assert.equal(v, dict[DEMO_BAR_COPY[k as keyof typeof DEMO_BAR_COPY]], `${lang} ${k}`);
  }
  // the script itself writes no words: every label comes from the page's JSON
  const js = readFileSync(JS_FILE, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
  for (const word of ['Live demo', 'Choose a design', 'Close', 'Home', 'All designs', 'Available', 'Coming soon', 'Start your website']) {
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
  // Tab wraps
  const focusables = panel.querySelectorAll('a[href], button');
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

// ---------------------------------------------------------------- weight and safety

test('weight: small static files, a small inline list', async () => {
  const js = readFileSync(JS_FILE);
  const css = readFileSync(CSS_FILE);
  assert.ok(js.length <= 14_000 && gzipSync(js).length <= 4_500, `demo-bar.js ${js.length} B, ${gzipSync(js).length} B gzip`);
  assert.ok(css.length <= 12_000 && gzipSync(css).length <= 3_500, `demo-bar.css ${css.length} B, ${gzipSync(css).length} B gzip`);
  const { $ } = await demo('/start/demo/olive-ivory/details?lang=de');
  const json = $(`#${DEMO_BAR_DATA_ID}`).text();
  assert.ok(json.length <= 10_000, `inline list ${json.length} B`);
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
  style = { props: {} as Record<string, string>, setProperty(k: string, v: string) { this.props[k] = v; } };
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
  setAttribute(k: string, v: unknown) {
    this.attrs.set(k, String(v));
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
  querySelectorAll(sel: string) {
    assert.equal(sel, 'a[href], button');
    return findAll(this, (e) => (e.tag === 'a' && Boolean(e.href)) || e.tag === 'button');
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

/** Runs public/static/demo-bar.js against a fake document; `framed` = inside an iframe; `nav` = the theme's .site-nav. */
function runBar(data: DemoBarData | null, opts: { framed?: boolean; nav?: { top: number; height: number } } = {}) {
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
  vm.runInNewContext(readFileSync(JS_FILE, 'utf8'), {
    window: win,
    document: doc,
    getComputedStyle: () => ({ position: 'fixed' }),
    requestAnimationFrame: (f: () => void) => {
      f();
      return 1;
    },
  });
  const root = body.children.find((c) => c.hasAttribute('data-demo-bar-ui')) ?? null;
  return { doc, win, root, appended: body.children.length };
}
