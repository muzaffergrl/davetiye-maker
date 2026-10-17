// G061: checks of the BUILT marketing pages (.next/server/app/*.html, after `npm run build`). Skipped when there is no
// build or when the build is older than the marketing sources (a stale build would test old pages).
//   npm run build && node --test tests/marketing-build.test.ts
// Per page: one H1, title ≤ 60, description 120–160, absolute canonical, robots noindex until launch, Open Graph and
// Twitter cards, valid JSON-LD (types, required fields, no placeholders, no ratings) whose names and FAQ text are
// visible on the page, every internal link and #anchor resolves, images have alt, and no indexable page is an orphan.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { MARKETING } from '../lib/marketing/config.ts';
import { liveDesigns } from '../lib/marketing/designs.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { href as langHref, LANGS, PREFIXED_LANGS } from '../lib/marketing/i18n.ts';
import { corePages } from '../lib/marketing/site.ts';
import { PLATFORM_ROOT } from './helpers.ts';
import { validateJsonLd } from './marketing-helpers.ts';

const APP = path.join(PLATFORM_ROOT, '.next/server/app');
const BUILD_ID = path.join(PLATFORM_ROOT, '.next/BUILD_ID');

function newestSource(): number {
  let newest = 0;
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else newest = Math.max(newest, statSync(p).mtimeMs);
    }
  };
  for (const d of ['app/(marketing)', 'components/marketing', 'lib/marketing', 'content']) walk(path.join(PLATFORM_ROOT, d));
  return newest;
}

const skip = !existsSync(BUILD_ID) || !existsSync(path.join(APP, 'index.html'))
  ? 'no build output (run npm run build)'
  : statSync(BUILD_ID).mtimeMs < newestSource()
    ? 'the build is older than the marketing sources (run npm run build)'
    : false;

/** path -> built HTML file. G144: the other languages are built under i18n/<lang>/ (next.config.ts rewrites /<lang>/…). */
function pages(): Map<string, string> {
  const m = new Map<string, string>();
  const en = [...corePages().map((p) => p.path), ...liveDesigns().map((d) => `/designs/${d.id}`), ...loadGuides().map((g) => g.path)];
  for (const p of en) m.set(p, path.join(APP, p === '/' ? 'index.html' : `${p.slice(1)}.html`));
  for (const l of PREFIXED_LANGS) for (const p of en) m.set(langHref(l, p), path.join(APP, 'i18n', `${langHref(l, p).slice(1)}.html`));
  return m;
}

/** The page language from its path ("/tr/designs" → "tr"). */
const langOfPath = (p: string) => PREFIXED_LANGS.find((l) => p === `/${l}` || p.startsWith(`/${l}/`)) ?? 'en';

const live = new Set(liveDesigns().map((d) => d.id));

/** Internal link targets that are not marketing pages but must exist. */
function otherTargetOk(href: string): boolean {
  const u = new URL(href, 'http://x');
  if (u.pathname === '/start') return !u.searchParams.has('theme') || live.has(u.searchParams.get('theme')!);
  const demo = /^\/start\/demo\/([a-z0-9-]+)$/.exec(u.pathname);
  if (demo) return live.has(demo[1]);
  if (u.pathname.startsWith('/themes/')) return existsSync(path.join(PLATFORM_ROOT, decodeURIComponent(u.pathname)));
  // G066: the brand kit (logos, icons, manifest) is served from public/brand/.
  if (u.pathname.startsWith('/marketing/') || u.pathname.startsWith('/brand/')) {
    return existsSync(path.join(PLATFORM_ROOT, 'public', decodeURIComponent(u.pathname)));
  }
  // G095: the buyer's "My website" page and the shop login are app routes outside the marketing group.
  if (u.pathname === '/my') return existsSync(path.join(PLATFORM_ROOT, 'app/my/page.tsx'));
  if (u.pathname === '/admin') return existsSync(path.join(PLATFORM_ROOT, 'app/admin/page.tsx'));
  return ['/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt'].includes(u.pathname);
}

test('built marketing pages: head, headings, JSON-LD, links, images, orphans', { skip }, () => {
  const built = pages();
  const docs = new Map<string, cheerio.CheerioAPI>();
  for (const [p, file] of built) {
    assert.ok(existsSync(file), `${p}: not prerendered (${path.relative(PLATFORM_ROOT, file)})`);
    docs.set(p, cheerio.load(readFileSync(file, 'utf8')));
  }
  const inbound = new Map<string, Set<string>>([...built.keys()].map((k) => [k, new Set<string>()]));
  const problems: string[] = [];
  for (const [p, $] of docs) {
    const say = (m: string) => problems.push(`${p}: ${m}`);
    if ($('h1').length !== 1) say(`${$('h1').length} <h1>`);
    const title = $('head > title').text();
    if (!title || title.length > 60) say(`title "${title}" (${title.length})`);
    const desc = $('meta[name="description"]').attr('content') ?? '';
    if (desc.length < 120 || desc.length > 160) say(`description ${desc.length}`);
    const canonical = $('link[rel="canonical"]').attr('href') ?? '';
    if (!/^https?:\/\//.test(canonical) || new URL(canonical).pathname !== p) say(`canonical ${canonical}`);
    const robots = $('meta[name="robots"]').attr('content') ?? '';
    if (!MARKETING.launched && !/noindex/.test(robots)) say(`robots "${robots}" before launch`);
    if (MARKETING.launched && /noindex/.test(robots)) say('noindex after launch');
    const og = $('meta[property="og:image"]').attr('content') ?? '';
    if (!/^https?:\/\//.test(og)) say(`og:image ${og}`);
    if (!$('meta[property="og:image:alt"]').attr('content')) say('og:image:alt');
    if ($('meta[name="twitter:card"]').attr('content') !== 'summary_large_image') say('twitter:card');
    if ($('html').attr('lang') !== 'en') say('lang');
    // G144: the page language on the wrapper around header, main and footer (the root <html> is the platform's)
    const lang = langOfPath(p);
    if ($('main').closest('[lang]').attr('lang') !== lang) say(`page language ${$('main').closest('[lang]').attr('lang')} (expected ${lang})`);
    const alternates = $('link[rel="alternate"][hreflang]')
      .map((_, el) => `${$(el).attr('hreflang')} ${new URL($(el).attr('href')!).pathname}`)
      .get();
    const base = lang === 'en' ? p : p.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    const want = [...LANGS.map((l) => `${l} ${langHref(l, base)}`), `x-default ${base}`];
    if (JSON.stringify(alternates) !== JSON.stringify(want)) say(`hreflang ${alternates.join(', ')}`);

    // JSON-LD
    const types = new Set<string>();
    const ld: unknown[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        ld.push(JSON.parse($(el).text()));
      } catch (e) {
        say(`JSON-LD does not parse: ${(e as Error).message}`);
      }
    });
    const collect = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(collect);
      else if (v && typeof v === 'object') {
        const t = (v as Record<string, unknown>)['@type'];
        if (typeof t === 'string') types.add(t);
        Object.values(v).forEach(collect);
      }
    };
    collect(ld);
    for (const pr of validateJsonLd(ld)) say(pr);
    for (const t of ['Organization', 'WebSite']) if (!types.has(t)) say(`no ${t}`);
    if (base !== '/' && !types.has('BreadcrumbList')) say('no BreadcrumbList');
    if (base.startsWith('/designs/') && !(types.has('Product') && types.has('VideoObject'))) say('design page needs Product + VideoObject');
    if (base.startsWith('/guides/') && !types.has('Article')) say('guide needs Article');
    if (types.has('AggregateRating') || types.has('Review')) say('ratings/reviews in JSON-LD');
    const visible = $('main').text().replace(/\s+/g, ' ').toLowerCase();
    const walk = (v: unknown) => {
      if (Array.isArray(v)) return v.forEach(walk);
      if (!v || typeof v !== 'object') return;
      const n = v as Record<string, unknown>;
      if (n['@type'] === 'Question') {
        const q = String(n.name).toLowerCase();
        const a = String((n.acceptedAnswer as Record<string, unknown>).text).replace(/\s+/g, ' ').toLowerCase();
        if (!visible.includes(q)) say(`FAQ question not visible: ${q}`);
        if (!visible.includes(a)) say(`FAQ answer not visible: ${a.slice(0, 60)}…`);
      }
      if (n['@type'] === 'Product' && !visible.includes(String(n.name).toLowerCase())) say(`Product name not visible: ${n.name}`);
      if (n['@type'] === 'Article' && !visible.includes(String(n.headline).toLowerCase())) say(`headline not visible`);
      Object.values(n).forEach(walk);
    };
    walk(ld);

    // links and anchors
    const ids = new Set($('[id]').map((_, el) => $(el).attr('id')).get());
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')!;
      if (href.startsWith('#')) {
        if (href.length > 1 && !ids.has(href.slice(1))) say(`anchor ${href} missing`);
        return;
      }
      if (href.startsWith('mailto:')) return;
      if (/^https?:\/\//.test(href)) {
        if (!href.startsWith('https://')) say(`insecure link ${href}`);
        if (/etsy\.com/.test(href) && /utm_/.test(href)) say(`UTM on Etsy link ${href}`);
        if (/etsy\.com/.test(href) && $(el).attr('target') === '_blank') say('Etsy link opens a new tab');
        return;
      }
      if (!href.startsWith('/')) {
        say(`relative link ${href}`);
        return;
      }
      const u = new URL(href, 'http://x');
      if (built.has(u.pathname)) {
        if (u.pathname !== p) inbound.get(u.pathname)!.add(p);
        if (u.hash) {
          const target = docs.get(u.pathname)!;
          if (!target(`[id="${u.hash.slice(1)}"]`).length) say(`link ${href}: anchor missing on target`);
        }
      } else if (!otherTargetOk(href)) say(`broken internal link ${href}`);
    });
    $('img').each((_, el) => {
      if ($(el).attr('alt') === undefined) say(`img without alt: ${$(el).attr('src')}`);
      const src = $(el).attr('src') ?? '';
      if (src.startsWith('/') && !otherTargetOk(src)) say(`image missing: ${src}`);
    });
    $('video').each((_, el) => {
      for (const a of ['src', 'poster']) {
        const v = $(el).attr(a) ?? '';
        if (!otherTargetOk(v)) say(`video ${a} missing: ${v}`);
      }
      if ($(el).attr('preload') !== 'none') say('video must not preload');
    });
  }
  for (const [p, from] of inbound) if (p !== '/' && from.size < 2) problems.push(`${p}: orphan-ish, only ${from.size} page(s) link to it`);
  assert.deepEqual(problems, []);
});

test('built output: a static 404 page and the robots.txt body exist', { skip }, () => {
  assert.ok(existsSync(path.join(APP, '_not-found.html')));
  const robots = readFileSync(path.join(APP, 'robots.txt.body'), 'utf8');
  assert.match(robots, /Disallow: \/edit\//);
});
