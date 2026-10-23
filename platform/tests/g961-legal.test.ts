// G961 (decision 7, 2026-10-23): terms of use (/terms) and the KVKK notice (/kvkk) on the sales site in every language,
// the privacy notice's new sections, the footer and /start links, no bracket placeholder on any legal page while the
// controller's legal name and address are undecided, and services that stay Etsy drafts offered nowhere.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { loadDict } from '../lib/i18n/dicts.ts';
import { scanSource } from '../lib/i18n/scan.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { llmsTxt, sitemapEntries } from '../lib/marketing/crawl.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { enT, href, makeMarket, PREFIXED_LANGS } from '../lib/marketing/i18n.ts';
import { controllerKnown, kvkkLang, kvkkMarkdown, ONLINE_CAP_MONTHS, servicesOnSale, shopHandle } from '../lib/marketing/legal.ts';
import { blocksText, parseBlocks, type Block } from '../lib/marketing/markdown.ts';
import { launchProblems, PLACEHOLDER_IN_TEXT_RE, real } from '../lib/marketing/placeholders.ts';
import { corePage, corePages, MARKETING_SEGMENTS } from '../lib/marketing/site.ts';
import { PANEL_BRAND } from '../lib/panel/brand.ts';
import { isReservedSlug } from '../lib/slug.ts';
import { PLATFORM_ROOT } from './helpers.ts';
import { readyConfig } from './marketing-helpers.ts';

const read = (rel: string) => readFileSync(path.join(PLATFORM_ROOT, rel), 'utf8');
const OTHER = PREFIXED_LANGS;

test('routes: /terms and /kvkk exist in English and under every language prefix, with their shared body', () => {
  for (const [slug, body] of [['terms', 'TermsPage'], ['kvkk', 'KvkkPage']] as const) {
    const en = `app/(marketing)/(en)/${slug}/page.tsx`;
    const i18n = `app/(marketing)/i18n/[lang]/${slug}/page.tsx`;
    assert.ok(existsSync(path.join(PLATFORM_ROOT, en)), en);
    assert.ok(existsSync(path.join(PLATFORM_ROOT, i18n)), i18n);
    assert.match(read(en), new RegExp(`pages/${body}\\.tsx`));
    assert.match(read(i18n), new RegExp(`pages/${body}\\.tsx`));
    assert.ok((MARKETING_SEGMENTS as readonly string[]).includes(slug), `${slug} is a marketing segment`);
    assert.ok(isReservedSlug(slug), `${slug} can never be a couple's address`);
    for (const l of OTHER) assert.equal(href(l, `/${slug}`), `/${l}/${slug}`);
  }
  const paths = corePages().map((p) => p.path);
  for (const p of ['/privacy', '/terms', '/kvkk']) {
    assert.ok(paths.includes(p), p);
    assert.equal(corePage(p).updated, MARKETING.legal.updated, `${p}: the legal pages carry the legal date`);
  }
  assert.match(MARKETING.legal.updated, /^\d{4}-\d{2}-\d{2}$/);
});

test('footer, sitemap and llms.txt link the terms and the KVKK notice in every language', () => {
  const shell = read('components/marketing/Shell.tsx');
  assert.match(shell, /m\.href\('\/terms'\)/);
  assert.match(shell, /m\.href\('\/kvkk'\)/);
  for (const k of ['Terms of use', 'KVKK notice']) assert.ok(scanSource(shell).includes(k), k);
  const cfg = readyConfig();
  const locs = new Set(sitemapEntries(loadGuides(), cfg).map((e) => e.loc));
  for (const p of ['/terms', '/kvkk']) {
    assert.ok(locs.has(`https://example.com${p}`), p);
    for (const l of OTHER) assert.ok(locs.has(`https://example.com/${l}${p}`), `${l}${p}`);
  }
  const llms = llmsTxt(loadGuides(), cfg);
  assert.match(llms, /\(https:\/\/example\.com\/terms\)/);
  assert.match(llms, /\(https:\/\/example\.com\/kvkk\)/);
});

/** Keys of a source file (t / tn / msg literals). */
const keysOf = (rel: string) => scanSource(read(rel));

test('every text of the legal pages and the new /start line is translated in all four languages', async () => {
  const market = ['components/marketing/pages/TermsPage.tsx', 'components/marketing/pages/KvkkPage.tsx', 'components/marketing/pages/PrivacyPage.tsx', 'components/marketing/Shell.tsx'].flatMap(keysOf);
  // corePages entries of the two new pages
  for (const p of ['/terms', '/kvkk']) {
    const e = corePage(p);
    market.push(e.label, e.h1, e.description, e.title.replace(/ \| .*$/, ''));
  }
  const panel = keysOf('app/start/StartForm.tsx').filter((k) => /terms|privacy|kvkk|Terms of use|Privacy notice|KVKK notice/i.test(k));
  assert.ok(panel.length >= 4, panel.join(' | '));
  for (const [ns, keys] of [['market', market], ['panel', panel]] as const) {
    for (const lang of OTHER) {
      const dict = await loadDict(ns, lang);
      const missing = [...new Set(keys)].filter((k) => !dict[k]);
      assert.deepEqual(missing, [], `${ns}/${lang} lacks legal texts`);
      for (const k of new Set(keys)) {
        const v = dict[k];
        assert.doesNotMatch(v, PLACEHOLDER_IN_TEXT_RE, `${ns}/${lang} ${k}: placeholder in the translation`);
        // links in inline Markdown keep their targets
        assert.deepEqual([...v.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]), [...k.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]), `${ns}/${lang} ${k}`);
      }
    }
  }
});

test('terms: built from decided facts only — no placeholder, no governing-law clause, consumer rights kept', () => {
  const keys = keysOf('components/marketing/pages/TermsPage.tsx');
  for (const k of keys) assert.doesNotMatch(k, PLACEHOLDER_IN_TEXT_RE, k);
  // The values the page fills in are all decided (K33, K35, K48, K25 + rights.ts).
  assert.ok(real(MARKETING.brand.name) && real(MARKETING.support.email) && real(MARKETING.support.responseTime));
  assert.equal(shopHandle(MARKETING), 'STUDIOBKE');
  for (const v of Object.values(MARKETING.policies)) assert.ok(real(v), v);
  assert.equal(ONLINE_CAP_MONTHS, 48);
  const all = keys.join('\n');
  assert.doesNotMatch(all, /governed by|jurisdiction|courts of|exclusive venue/i, 'governing law is an open decision (docs/39)');
  assert.match(all, /consumer law that applies to you gives you a right that cannot be excluded/);
  assert.match(all, /mandatory consumer law of your country/);
  assert.match(all, /AI assistant run by Google Gemini/);
  // the controller sentence: neutral while undecided, the real name and address once decided
  assert.equal(controllerKnown(MARKETING), false);
  assert.equal(controllerKnown(readyConfig()), true);
  assert.ok(keys.includes('Our full legal name and postal address are provided on request by email.'));
});

const h = (blocks: Block[]) => blocks.map((b) => (b.type === 'ul' || b.type === 'ol' ? `${b.type}:${b.items.length}` : b.type)).join(' ');

test('KVKK notice: Turkish original + English version, same structure, no bracket placeholder, art. 10/11 elements', async () => {
  assert.equal(kvkkLang('tr'), 'tr');
  for (const l of ['en', 'es', 'de', 'fr'] as const) assert.equal(kvkkLang(l), 'en');
  const trT = makeMarket('tr', await loadDict('market', 'tr')).t;
  const tr = parseBlocks(kvkkMarkdown('tr', MARKETING, trT));
  const en = parseBlocks(kvkkMarkdown('en', MARKETING, enT));
  assert.equal(h(tr), h(en), 'the two versions have the same sections, lists and list lengths');
  assert.equal(tr.filter((b) => b.type === 'h2').length, 9);
  for (const [lang, blocks] of [['tr', tr], ['en', en]] as const) {
    const text = blocksText(blocks);
    assert.doesNotMatch(text, PLACEHOLDER_IN_TEXT_RE, `${lang}: placeholder`);
    assert.ok(!text.includes('['), `${lang}: no bracket reaches the page`);
    assert.ok(text.includes(MARKETING.support.email) && text.includes('BKE Studio') && text.includes('STUDIOBKE'), `${lang}: controller facts`);
    // the art. 11 list has its nine rights
    const rights = blocks.findIndex((b) => b.type === 'h2' && /11/.test(b.text));
    const list = blocks.slice(rights).find((b) => b.type === 'ul');
    assert.ok(list && list.type === 'ul' && list.items.length === 9, `${lang}: nine rights`);
  }
  const trText = blocksText(tr);
  for (const must of ['m. 5/2-c', 'm. 5/2-ç', 'm. 5/2-f', 'm. 9', 'Vercel', 'Google', 'Gemini', 'Gmail', 'MyMemory', 'Kişisel Verileri Koruma Kurulu', '30 gün', '60 gün', 'Veri Sorumlusuna Başvuru Usul ve Esasları']) {
    assert.ok(trText.includes(must), `tr: ${must}`);
  }
  // undecided controller identity: the neutral sentence, never a bracket
  assert.match(trText, /açık adı \(unvanı\) ve posta adresi, .+ adresine yazmanız hâlinde size bildirilir/);
  assert.match(blocksText(en), /provided on request by email/);
  // decided: name and address are printed instead
  const ready = blocksText(parseBlocks(kvkkMarkdown('tr', readyConfig(), trT)));
  assert.ok(ready.includes('Test Seller') && ready.includes('1 Test Street'));
  assert.doesNotMatch(ready, /hâlinde size bildirilir/);
  // the config's policy sentences appear in the notice language
  assert.ok(trText.includes(trT(MARKETING.policies.retention)) && trT(MARKETING.policies.retention) !== MARKETING.policies.retention);
  assert.ok(blocksText(en).includes(MARKETING.policies.deletion));
});

test('launch gate lists the undecided controller identity; a decided config passes', () => {
  const problems = launchProblems({ ...MARKETING, launched: true });
  assert.ok(problems.some((p) => p.startsWith('legal.controllerName')));
  assert.ok(problems.some((p) => p.startsWith('legal.postalAddress')));
  // the build environment of a launch has order verification on (G954, tests/marketing-config.test.ts)
  const env = { CLAIM_ORDER_VERIFICATION: 'trust' };
  assert.deepEqual(launchProblems(readyConfig(), env), []);
  const onSale = readyConfig();
  onSale.services = onSale.services.map((s) => ({ ...s, onSale: true }));
  assert.ok(launchProblems(onSale, env).some((p) => p.includes('on sale without a real Etsy listing URL')));
});

test('services that stay Etsy drafts are offered nowhere (sales site extras, panel help); prices unchanged', () => {
  assert.deepEqual(servicesOnSale(MARKETING), []);
  assert.equal(PANEL_BRAND.setupServiceOnSale, false);
  assert.deepEqual(MARKETING.services.map((s) => [s.id, s.price]), [['setup-service', '990'], ['custom-design', '4490']]);
  assert.match(read('components/marketing/ExtraServices.tsx'), /\.filter\(\(sv\) => sv\.onSale === true\)/);
  assert.match(read('components/panel/HelpSheet.tsx'), /PANEL_BRAND\.setupServiceOnSale \?/);
  assert.match(read('components/marketing/pages/TermsPage.tsx'), /services\.length \?/);
});

test('/start: one line links the terms, the privacy notice and the KVKK notice in the interface language', () => {
  const src = read('app/start/StartForm.tsx');
  assert.match(src, /<LegalLine \/>/);
  for (const p of ['/terms', '/privacy', '/kvkk']) assert.match(src, new RegExp(`marketingHref\\(lang, '${p}'\\)`));
  assert.match(src, /By creating your website you accept our \{terms\}\. Our \{privacy\} and \{kvkk\} explain how we use your data\./);
  // informing is not consent (KVKK art. 10): the line asks no tick and adds no field
  assert.doesNotMatch(src.slice(src.indexOf('function LegalLine')), /type="checkbox"/);
});

test('privacy notice: legal basis, KVKK and terms links, the shop Gmail and one website per design', () => {
  const keys = keysOf('components/marketing/pages/PrivacyPage.tsx').join('\n');
  assert.match(keys, /Legal basis/);
  assert.match(keys, /\[KVKK notice\]\(\/kvkk\)/);
  assert.match(keys, /\[terms of use\]\(\/terms\)/);
  assert.match(keys, /Gmail/);
  assert.match(keys, /Google Gemini/);
  assert.match(keys, /one website per design bought/);
  assert.doesNotMatch(keys, /one website per order/);
});
