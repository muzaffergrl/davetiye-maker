// G082: a newly approved design goes on the sales site — 05 Mediterranean Lemon (theme mediterranean-lemon, G405).
// Listing it as 'live' in lib/marketing/config.ts is also its approval for /start (G080, lib/themes/approval.ts), so
// these checks cover both sides: the sales-site entry (copy written against the theme, real captured screens, clip,
// JSON-LD, llms.txt, sitemap rule) and the production gate that now lets buyers start it.
// Browser side: tests/marketing-browser.ts (pages), tests/g080-browser.ts (/start under THEME_APPROVAL=enforce).
import { afterEach, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { claimableTheme } from '../lib/claim/themes.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { llmsFullTxt, llmsTxt, sitemapEntries, sitemapXml } from '../lib/marketing/crawl.ts';
import { DESIGN_COPY, liveDesign, liveDesigns } from '../lib/marketing/designs.ts';
import { loadGuide, loadGuides } from '../lib/marketing/guides.ts';
import { graph, itemList, product, videoObject } from '../lib/marketing/schema.ts';
import { designPage } from '../lib/marketing/site.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { approvedThemeIds, themeApproval, themeOpenForClaims } from '../lib/themes/approval.ts';
import { offeredThemes } from '../lib/themes/offered.ts';
import { checkManifest, type AssetManifest } from '../scripts/marketing-assets.ts';
import assets from '../lib/marketing/assets.json' with { type: 'json' };
import { PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';
import { readyConfig, validateJsonLd } from './marketing-helpers.ts';

const ID = 'mediterranean-lemon';
const PROD = { VERCEL_ENV: 'production' } as const;
const manifest = assets as unknown as AssetManifest;

before(() => {
  delete process.env.PLATFORM_THEMES_DIR; // the real themes
  process.env.PLATFORM_DATA_DIR = tmpDir('g082-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  delete process.env.CLAIM_ORDER_VERIFICATION;
});
let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = { VERCEL_ENV: process.env.VERCEL_ENV, THEME_APPROVAL: process.env.THEME_APPROVAL };
  delete process.env.VERCEL_ENV;
  delete process.env.THEME_APPROVAL;
  setClaimRateLimiter(new MemoryRateLimiter());
});
afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

test('05 Mediterranean Lemon is live: third in the list after 03 and 01, same name as its theme, page entry', async () => {
  assert.deepEqual(liveDesigns().map((d) => d.id), ['blush-garden-rose', 'olive-ivory', ID]);
  const d = liveDesign(ID)!;
  assert.ok(d, 'listed');
  assert.equal(d.name, 'Mediterranean Lemon');
  assert.equal((await claimableTheme(ID))!.name, d.name);
  const page = designPage(ID)!;
  assert.equal(page.path, `/designs/${ID}`);
  assert.equal(page.h1, 'Mediterranean Lemon wedding website');
  assert.ok(page.title.length <= 60, page.title);
  // no price or Etsy link invented: the same placeholders as the other designs until G062 decides them
  assert.equal(d.price, '[PRICE]');
  assert.equal(d.etsyListingUrl, '[ETSY LISTING URL]');
  assert.equal(d.compareAtPrice, null);
});

test('copy matches the theme: demo couple, fonts, palette tokens, collection, related guides', async () => {
  for (const d of liveDesigns()) {
    const c = DESIGN_COPY[d.id];
    const theme = (await claimableTheme(d.id))!;
    assert.equal(c.demoCouple, theme.demo.name_display, `${d.id}: demo couple = the theme's demo record`);
    // every font named on the site is one the theme really loads (Google Fonts families in its pages)
    const html = readFileSync(path.join(PLATFORM_ROOT, 'themes', d.id, 'index.html'), 'utf8');
    const families = [...html.matchAll(/family=([A-Za-z+]+)/g)].map((m) => m[1].replace(/\+/g, ' '));
    for (const f of c.fonts) assert.ok(families.includes(f), `${d.id}: font "${f}" is not loaded by the theme (${families.join(', ')})`);
    assert.ok(existsSync(path.join(REPO_ROOT, 'collections', c.collection)), `${d.id}: collections/${c.collection}`);
    for (const g of c.relatedGuides) assert.ok(loadGuide(g), `${d.id}: related guide ${g}`);
  }
  // 05: each swatch is a colour token of the theme's own stylesheet
  const css = readFileSync(path.join(PLATFORM_ROOT, 'themes', ID, 'site.css'), 'utf8').toUpperCase();
  for (const sw of DESIGN_COPY[ID].palette) assert.ok(css.includes(sw.hex.toUpperCase()), `${sw.name} ${sw.hex} is not in site.css`);
  // the words for its envelope and opening are the ones the theme README describes (no invented feature)
  const c = DESIGN_COPY[ID];
  for (const w of ['lemon', 'cobalt', 'scalloped', 'tile']) assert.match(c.intro + c.style, new RegExp(w, 'i'), w);
  for (const w of ['tap', 'lemon tie', 'rolls', 'flap', 'tile', 'card', 'lemon branch', 'blossom', 'home page']) {
    assert.ok(c.opening.toLowerCase().includes(w), `opening mentions "${w}"`);
  }
  assert.doesNotMatch(Object.values(c.pages).join(' ') + c.opening, /wax seal|\blace\b|\bgold\b|peon|\broses?\b|\bbow\b|swipe/i, 'nothing from 01 / 03');
});

test('real screens and opening clip of 05 are in assets.json and on disk; 01 / 03 entries are still there', () => {
  assert.deepEqual(checkManifest(manifest), []);
  const m = manifest.designs[ID];
  assert.ok(m, 'no 05 entry: node scripts/marketing-assets.ts --designs mediterranean-lemon');
  for (const k of ['envelope', 'home', 'invitation', 'story', 'details', 'schedule', 'rsvp', 'form']) {
    const s = m.screens[k];
    assert.ok(s, k);
    assert.deepEqual(Object.keys(s.files).sort(), ['320', '480', '640'], k);
    for (const f of Object.values(s.files)) assert.match(f, new RegExp(`^/marketing/designs/${ID}/${k}-\\d+\\.webp$`));
    assert.equal(s.width, 640, k);
    assert.ok(s.height > s.width * 2, `${k}: a phone screen (390 × 844)`);
  }
  assert.ok(m.opening, 'opening clip');
  assert.equal(m.opening!.file, `/marketing/designs/${ID}/opening.mp4`);
  assert.equal(m.opening!.width, 390);
  assert.equal(m.opening!.height, 844);
  assert.ok(m.opening!.bytes > 50_000 && m.opening!.bytes <= 1_500_000, String(m.opening!.bytes));
  assert.deepEqual(Object.keys(manifest.designs).slice(0, 2), ['blush-garden-rose', 'olive-ivory']);
});

test('JSON-LD: Product (no Offer while the price is a placeholder) + VideoObject for 05; ItemList of /designs has 3', () => {
  const d = liveDesign(ID)!;
  const p = product(d);
  assert.equal(p.name, 'Mediterranean Lemon Wedding Website');
  assert.equal(p.sku, ID);
  assert.equal(p.offers, undefined);
  assert.equal((p.image as string[]).length, 4);
  const v = videoObject(d)!;
  assert.match(String(v.contentUrl), /\/marketing\/designs\/mediterranean-lemon\/opening\.mp4$/);
  assert.equal(v.duration, `PT${manifest.designs[ID].opening!.seconds}S`);
  assert.deepEqual(validateJsonLd(graph(p, v)), []);
  const cfg = readyConfig();
  const ready = liveDesigns(cfg).find((x) => x.id === ID)!;
  assert.equal((product(ready, cfg).offers as Record<string, string>).price, '29.40', 'Offer once a real price and link exist');
  const list = itemList(liveDesigns().map((x) => ({ path: `/designs/${x.id}`, name: x.name })));
  assert.equal((list.itemListElement as unknown[]).length, 3);
  assert.deepEqual(validateJsonLd(graph(list)), []);
});

test('llms.txt / llms-full.txt name 05; the sitemap stays empty while not launched and lists it after launch', () => {
  const guides = loadGuides();
  const txt = llmsTxt(guides);
  assert.match(txt, /- \[Mediterranean Lemon\]\([^)]+\/designs\/mediterranean-lemon\): white envelope with a cobalt scalloped edge/);
  const full = llmsFullTxt(guides);
  assert.ok(full.includes('### Mediterranean Lemon'));
  assert.ok(full.includes(`Opening: ${DESIGN_COPY[ID].opening}`));
  assert.ok(full.includes('- Fonts: Allura, Playfair Display'));
  assert.ok(!txt.includes('Vintage Airmail'), "designs that are not live are still not mentioned");
  assert.equal(MARKETING.launched, false);
  assert.doesNotMatch(sitemapXml(guides), /<url>/, 'empty while launched is false');
  const cfg = readyConfig();
  assert.ok(sitemapEntries(guides, cfg).some((e) => e.loc === 'https://example.com/designs/mediterranean-lemon' && e.lastmod === '2026-10-14'));
  assert.match(sitemapXml(guides, cfg), /<loc>https:\/\/example\.com\/designs\/mediterranean-lemon<\/loc>/);
});

test('/start production gate: 05 is approved, listed and can be started (201); 02 / 04 stay in review', async () => {
  assert.ok(approvedThemeIds().includes(ID));
  assert.equal(themeApproval(ID), 'approved');
  assert.equal(themeOpenForClaims(ID, { env: PROD }), true);
  assert.equal(themeOpenForClaims(ID, { env: { THEME_APPROVAL: 'enforce' } }), true);
  for (const id of ['dusty-blue-champagne', 'vintage-airmail-love-letter']) assert.equal(themeOpenForClaims(id, { env: PROD }), false, id);
  assert.ok((await offeredThemes(PROD)).some((t) => t.id === ID), '/start list in production');
  process.env.VERCEL_ENV = 'production';
  const res = await claimRoute(
    new Request('http://localhost:3000/api/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '198.51.100.82' },
      body: JSON.stringify({ theme: ID, orderNumber: '6100082005', email: 'g082@example.test', names: ['Isabella', 'Marco'], slug: '', website: '' }),
    }),
  );
  const body = (await res.json()) as Record<string, unknown>;
  assert.equal(res.status, 201, JSON.stringify(body));
  assert.equal(typeof body.slug, 'string');
});
