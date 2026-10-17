// G144 (K45 item 3): the sales site in five languages. English at the root URLs, tr/es/de/fr under a prefix (rewritten by
// next.config.ts to app/(marketing)/i18n/[lang]); every English page has its language twin; links keep the prefix;
// hreflang + canonical; translation through the 'market' dictionary (English stays the key and the fallback); guides
// read content/guides/<lang>/<slug>.md when it exists.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import path from 'node:path';
import nextConfig from '../next.config.ts';
import { scanSource } from '../lib/i18n/scan.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { liveDesign } from '../lib/marketing/designs.ts';
import { editRightsText, factStrip, included } from '../lib/marketing/facts.ts';
import { faqGroups } from '../lib/marketing/faq.ts';
import { loadGuides, loadGuidesIn } from '../lib/marketing/guides.ts';
import { basePath, enMarket, enT, href, LANGS, makeMarket, PREFIXED_LANGS } from '../lib/marketing/i18n.ts';
import { languageAlternates, pageMetadata } from '../lib/marketing/seo.ts';
import { compareCopy, tourCopy } from '../lib/marketing/showcase.ts';
import { corePage, corePages, designPage, formatDay } from '../lib/marketing/site.ts';
import { isReservedSlug } from '../lib/slug.ts';
import { PLATFORM_ROOT, tmpDir } from './helpers.ts';

test('href: marketing paths get the prefix, everything else stays', () => {
  assert.equal(href('en', '/designs'), '/designs');
  assert.equal(href('tr', '/'), '/tr');
  assert.equal(href('tr', '/designs'), '/tr/designs');
  assert.equal(href('de', '/designs/olive-ivory'), '/de/designs/olive-ivory');
  assert.equal(href('fr', '/#edit'), '/fr#edit');
  assert.equal(href('es', '/features#rsvp'), '/es/features#rsvp');
  assert.equal(href('es', '/pricing#included'), '/es/pricing#included');
  for (const p of ['/start', '/start?theme=olive-ivory', '/start/demo/olive-ivory', '/my', '/admin', '/themes/x/img.jpg', '/marketing/a.png', '/llms.txt', '#x', 'mailto:a@b.c', 'https://etsy.com/x', '/clara-and-julian']) {
    assert.equal(href('tr', p), p, p);
  }
  assert.equal(href('tr', '/tr/designs'), '/tr/designs', 'never twice');
  assert.equal(basePath('/tr/designs'), '/designs');
  assert.equal(basePath('/tr'), '/');
  assert.equal(basePath('/i18n/de/guides/x'), '/guides/x');
  assert.equal(basePath('/designs'), '/designs');
});

test('routing: rewrites for the four prefixes; i18n and the codes are reserved slugs', async () => {
  const rw = await nextConfig.rewrites!();
  assert.ok(!Array.isArray(rw));
  const before = (rw as { beforeFiles: Array<{ source: string; destination: string }> }).beforeFiles;
  assert.deepEqual(before, [
    { source: '/:lang(tr|es|de|fr)', destination: '/i18n/:lang' },
    { source: '/:lang(tr|es|de|fr)/:path*', destination: '/i18n/:lang/:path*' },
  ]);
  for (const s of ['i18n', ...PREFIXED_LANGS]) assert.ok(isReservedSlug(s), s);
});

test('every English marketing page has its language twin (same body component)', () => {
  const en = path.join(PLATFORM_ROOT, 'app/(marketing)/(en)');
  const i18n = path.join(PLATFORM_ROOT, 'app/(marketing)/i18n/[lang]');
  const pages = (dir: string, rel = ''): string[] =>
    readdirSync(path.join(dir, rel)).flatMap((e) => {
      const r = path.join(rel, e);
      return statSync(path.join(dir, r)).isDirectory() ? pages(dir, r) : e === 'page.tsx' ? [r] : [];
    });
  const enPages = pages(en).sort();
  assert.ok(enPages.length >= 12, enPages.join());
  assert.deepEqual(pages(i18n).sort(), enPages);
  for (const p of enPages) {
    const body = /components\/marketing\/pages\/(\w+)\.tsx/.exec(readFileSync(path.join(en, p), 'utf8'))?.[1];
    assert.ok(body, `${p}: renders a shared page body`);
    assert.match(readFileSync(path.join(i18n, p), 'utf8'), new RegExp(`pages/${body}\\.tsx`), p);
  }
  for (const f of ['layout.tsx', 'not-found.tsx']) {
    assert.ok(existsSync(path.join(en, f)) && existsSync(path.join(i18n, f)), f);
  }
});

test('English output is unchanged by the translator; a dictionary translates pages, lists and links', () => {
  // the English translator is the identity (placeholders filled)
  assert.deepEqual(corePages(MARKETING, enT), corePages());
  assert.equal(corePage('/designs').label, 'Designs');
  assert.equal(factStrip()[3], 'Online until 12 months after your wedding date');
  assert.equal(designPage('olive-ivory')!.h1, 'Olive & Ivory wedding website');
  const tr = makeMarket('tr', {
    Designs: 'Tasarımlar',
    'Wedding website designs': 'Düğün web sitesi tasarımları',
    '{name} wedding website': '{name} düğün web sitesi',
    'Online until {months} months after your wedding date': 'Düğününüzden {months} ay sonrasına kadar yayında',
    'How do I buy a design?': 'Bir tasarımı nasıl satın alırım?',
    'Olive green envelope with an ivory lace edge, a wax seal with your initials and olive branches': 'Zeytin yeşili zarf',
  });
  assert.equal(corePage('/designs', MARKETING, tr.t).label, 'Tasarımlar');
  assert.equal(corePage('/designs', MARKETING, tr.t).h1, 'Düğün web sitesi tasarımları');
  assert.equal(designPage('olive-ivory', MARKETING, tr.t)!.h1, 'Olive & Ivory düğün web sitesi');
  assert.equal(factStrip(MARKETING, tr.t)[3], 'Düğününüzden 12 ay sonrasına kadar yayında');
  assert.equal(faqGroups(MARKETING, tr.t)[0].items[0].q, 'Bir tasarımı nasıl satın alırım?');
  assert.equal(tr.t(liveDesign('olive-ivory')!.copy.style), 'Zeytin yeşili zarf');
  // a missing key stays English
  assert.equal(included(MARKETING, tr.t)[0], included()[0]);
  assert.equal(editRightsText(MARKETING, tr.t).rest, editRightsText().rest);
  // dates in the page language; English keeps the US style
  assert.equal(formatDay('2026-10-14'), 'October 14, 2026');
  assert.match(formatDay('2026-10-14', 'tr'), /14 Ekim 2026/);
  // client strings come translated from the server
  assert.equal(compareCopy().compareTrayMany, 'Compare {n} designs');
  assert.equal(tourCopy().stepOf, 'Step {i} of {n}');
  assert.equal(enMarket.href('/faq'), '/faq');
  assert.equal(tr.href('/faq'), '/tr/faq');
});

test('metadata: canonical in the page language, hreflang for all five + x-default, og:locale', () => {
  const alt = languageAlternates('/designs', 'de', { ...MARKETING, siteUrl: 'https://example.com' });
  assert.equal(alt.canonical, 'https://example.com/de/designs');
  assert.deepEqual(Object.keys(alt.languages), [...LANGS, 'x-default']);
  assert.equal(alt.languages['x-default'], 'https://example.com/designs');
  assert.equal(alt.languages.fr, 'https://example.com/fr/designs');
  const home = languageAlternates('/', 'tr', { ...MARKETING, siteUrl: 'https://example.com' });
  assert.equal(home.canonical, 'https://example.com/tr');
  const en = pageMetadata(corePage('/faq'));
  assert.equal(new URL(String(en.alternates!.canonical)).pathname, '/faq');
  assert.equal((en.openGraph as { locale?: string }).locale, 'en_US');
  const fr = pageMetadata(corePage('/faq'), { lang: 'fr' });
  assert.equal(new URL(String(fr.alternates!.canonical)).pathname, '/fr/faq');
  assert.equal((fr.openGraph as { locale?: string }).locale, 'fr_FR');
});

test('guides: a translation in content/guides/<lang>/<slug>.md is used; otherwise the English article', () => {
  const dir = tmpDir('g144-guides-');
  cpSync(path.join(PLATFORM_ROOT, 'content'), dir, { recursive: true });
  const prev = process.env.PLATFORM_CONTENT_DIR;
  process.env.PLATFORM_CONTENT_DIR = dir;
  try {
    const en = loadGuides();
    const g = en[0];
    assert.ok(loadGuidesIn('es').every((x) => x.translated === existsSync(path.join(dir, 'guides', 'es', `${x.slug}.md`))));
    // start from no German translations (the real ones would make every guide translated)
    rmSync(path.join(dir, 'guides', 'de'), { recursive: true, force: true });
    mkdirSync(path.join(dir, 'guides', 'de'), { recursive: true });
    const src = readFileSync(path.join(dir, 'guides', `${g.slug}.md`), 'utf8').replace(/^title: .*$/m, 'title: Deutscher Titel');
    writeFileSync(path.join(dir, 'guides', 'de', `${g.slug}.md`), src);
    const de = loadGuidesIn('de');
    assert.deepEqual(de.map((x) => x.slug), en.map((x) => x.slug), 'same guides, same order');
    assert.equal(de[0].title, 'Deutscher Titel');
    assert.equal(de[0].translated, true);
    assert.equal(de[0].path, g.path, 'paths stay English; pages prefix them');
    assert.ok(de.slice(1).every((x) => !x.translated));
    assert.equal(loadGuides().length, en.length, 'language folders are not English guides');
  } finally {
    if (prev === undefined) delete process.env.PLATFORM_CONTENT_DIR;
    else process.env.PLATFORM_CONTENT_DIR = prev;
  }
});

/** Source files of the sales site. */
function sources(): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d)) {
      const p = path.join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(e)) out.push(p);
    }
  };
  for (const r of ['app/(marketing)', 'components/marketing', 'lib/marketing']) walk(path.join(PLATFORM_ROOT, r));
  return out;
}

test('translatable texts: the scanner finds the sales-site keys; no t() with ${…}; no m.t() the scanner cannot see', () => {
  const keys = new Set(sources().flatMap((f) => scanSource(readFileSync(f, 'utf8'))));
  assert.ok(keys.size > 600, `${keys.size} keys`);
  for (const k of ['Skip to content', 'Language', 'See all {n} designs', 'This guide is available in English.', 'Breadcrumb', 'Coming soon on Etsy', 'Romantic floral', 'Sealed', 'envelope']) {
    assert.ok(keys.has(k), k);
  }
  for (const f of sources()) {
    const code = readFileSync(f, 'utf8');
    const rel = path.relative(PLATFORM_ROOT, f);
    assert.doesNotMatch(code, /(?<![\w.$])(?:t|msg)\(\s*`[^`]*\$\{/, `${rel}: t()/msg() with \${…} (use {placeholders})`);
    assert.doesNotMatch(code, /\bm\.t\(\s*['"`]/, `${rel}: m.t('…') is invisible to the scanner (destructure t)`);
  }
});

test('client components get strings, not dictionaries', () => {
  for (const f of sources().filter((x) => /^'use client'/.test(readFileSync(x, 'utf8')))) {
    const code = readFileSync(f, 'utf8');
    assert.doesNotMatch(code, /lib\/i18n\/dicts|lib\/marketing\/i18n\.ts|from '\.\.\/\.\.\/lib\/marketing\/(config|facts|faq|site|designs)\.ts'/, path.relative(PLATFORM_ROOT, f));
  }
});
