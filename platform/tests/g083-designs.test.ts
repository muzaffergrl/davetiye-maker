// G083: design 02 Dusty Blue & Champagne (theme dusty-blue-champagne, G402) goes on the sales site the way G082 added
// 05. Listing it as 'live' in lib/marketing/config.ts is also its approval for /start (G080, lib/themes/approval.ts):
// the sales-site entry (copy written against the theme, real captured screens, clip, JSON-LD, llms.txt, sitemap rule),
// the ≤ 60-character title of a long design name, and the production gate that now lets buyers start it (04: G085).
// Layout of four cards / one row of chips: tests/marketing-browser.ts (G083 section).
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
import { designPage, designTitle } from '../lib/marketing/site.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { approvedThemeIds, themeApproval, themeOpenForClaims } from '../lib/themes/approval.ts';
import { offeredThemes } from '../lib/themes/offered.ts';
import { checkManifest, type AssetManifest } from '../scripts/marketing-assets.ts';
import assets from '../lib/marketing/assets.json' with { type: 'json' };
import { PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';
import { readyConfig, validateJsonLd } from './marketing-helpers.ts';

const ID = 'dusty-blue-champagne';
const PROD = { VERCEL_ENV: 'production' } as const;
const manifest = assets as unknown as AssetManifest;

before(() => {
  delete process.env.PLATFORM_THEMES_DIR; // the real themes
  process.env.PLATFORM_DATA_DIR = tmpDir('g083-data-');
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

test('02 Dusty Blue & Champagne is live: fourth after 03, 01 and 05, same name as its theme, page entry', async () => {
  // (G085 added 04 after it: tests/g085-designs.test.ts)
  assert.deepEqual(liveDesigns().map((d) => d.id).slice(0, 4), ['blush-garden-rose', 'olive-ivory', 'mediterranean-lemon', ID]);
  const d = liveDesign(ID)!;
  assert.ok(d, 'listed');
  assert.equal(d.name, 'Dusty Blue & Champagne');
  assert.equal((await claimableTheme(ID))!.name, d.name);
  const page = designPage(ID)!;
  assert.equal(page.path, `/designs/${ID}`);
  assert.equal(page.h1, 'Dusty Blue & Champagne wedding website');
  // K42 (2026-10-16): the user-approved price, the same for every design; no Etsy link invented yet
  assert.equal(d.price, '1190');
  assert.equal(d.etsyListingUrl, '[ETSY LISTING URL]');
  assert.equal(d.compareAtPrice, null);
});

test('design page titles stay ≤ 60 characters: the long name drops the colon, then "Envelope" (12-character brand)', () => {
  assert.equal(designPage('blush-garden-rose')!.title, 'Blush Garden Rose: Envelope Wedding Website | BKE Studio', 'short names keep the docs/14 §6.3 pattern');
  assert.equal(designPage('mediterranean-lemon')!.title, 'Mediterranean Lemon: Envelope Wedding Website | BKE Studio');
  // "Dusty Blue & Champagne: Envelope Wedding Website | BKE Studio" would be 61
  assert.equal(designPage(ID)!.title, 'Dusty Blue & Champagne Envelope Wedding Website | BKE Studio');
  const brand12 = readyConfig({ brand: { ...readyConfig().brand, name: 'Seal & Story' } });
  assert.equal(designTitle('Dusty Blue & Champagne', brand12), 'Dusty Blue & Champagne: Wedding Website | Seal & Story');
  for (const d of liveDesigns()) {
    assert.ok(designPage(d.id)!.title.length <= 60, d.id);
    assert.ok(designPage(d.id, brand12)!.title.length <= 60, `${d.id} with a 12-character brand`);
  }
});

test('copy matches the theme: demo couple, fonts, palette tokens, collection, guides, opening of the README', async () => {
  const c = DESIGN_COPY[ID];
  const theme = (await claimableTheme(ID))!;
  assert.equal(c.demoCouple, theme.demo.name_display, "demo couple = the theme's demo record");
  assert.equal(c.demoCouple, 'Eleanor & Theo');
  const html = readFileSync(path.join(PLATFORM_ROOT, 'themes', ID, 'index.html'), 'utf8');
  const families = [...html.matchAll(/family=([A-Za-z+]+)/g)].map((m) => m[1].replace(/\+/g, ' '));
  assert.deepEqual(c.fonts, ['Pinyon Script', 'Cormorant Garamond']);
  for (const f of c.fonts) assert.ok(families.includes(f), `font "${f}" is not loaded by the theme (${families.join(', ')})`);
  assert.equal(c.collection, '02_Dusty_Blue');
  assert.ok(existsSync(path.join(REPO_ROOT, 'collections', c.collection)));
  for (const g of c.relatedGuides) assert.ok(loadGuide(g), `related guide ${g}`);
  // each swatch is a colour token of the theme's own stylesheet
  const css = readFileSync(path.join(PLATFORM_ROOT, 'themes', ID, 'site.css'), 'utf8').toUpperCase();
  for (const sw of c.palette) assert.ok(css.includes(sw.hex.toUpperCase()), `${sw.name} ${sw.hex} is not in site.css`);
  assert.equal(c.metaDescription.length >= 120 && c.metaDescription.length <= 160, true, String(c.metaDescription.length));
  // envelope and opening in the words of the theme README (G402) — no invented feature
  for (const w of ['ivory envelope', 'champagne gold edge', 'dusty blue wax seal', 'initials', 'roses', 'eucalyptus', 'ferns', 'instant-photo']) {
    assert.ok((c.intro + ' ' + c.style).toLowerCase().includes(w), `intro/style mention "${w}"`);
  }
  for (const w of ['tap', 'wax seal breaks off', 'off the screen', 'flap lifts', 'damask lining', 'card with your portrait', 'single eucalyptus leaf', 'home page']) {
    assert.ok(c.opening.toLowerCase().includes(w), `opening mentions "${w}"`);
  }
  const readme = readFileSync(path.join(PLATFORM_ROOT, 'themes', ID, 'README.md'), 'utf8');
  for (const w of ['mühür', 'damask', 'okaliptüs yaprağı', 'anlık baskı', 'Pinyon Script', 'Cormorant Garamond']) assert.ok(readme.includes(w), `README: ${w}`);
  assert.match(c.pages.story, /Three instant-photo prints/);
  assert.match(c.pages.rsvp, /wax seal/);
  // nothing from 01 / 03 / 05
  assert.doesNotMatch(Object.values(c.pages).join(' ') + c.opening + c.intro + c.style, /\blace\b|\bbow\b|ribbon|peon|lemon|\btiles?\b|cobalt|olive|swipe|arched/i);
});

test('real screens and opening clip of 02 are in assets.json and on disk; 01 / 03 / 05 entries are still first', () => {
  assert.deepEqual(checkManifest(manifest), []);
  const m = manifest.designs[ID];
  assert.ok(m, 'no 02 entry: node scripts/marketing-assets.ts --designs dusty-blue-champagne --shots <capture>');
  for (const k of ['envelope', 'home', 'invitation', 'story', 'details', 'schedule', 'rsvp', 'form']) {
    const s = m.screens[k];
    assert.ok(s, k);
    assert.deepEqual(Object.keys(s.files).sort(), ['320', '480', '640'], k);
    for (const f of Object.values(s.files)) assert.match(f, new RegExp(`^/marketing/designs/${ID}/${k}-\\d+\\.webp$`));
    assert.equal(s.width, 640, k);
    if (['schedule', 'form'].includes(k)) {
      // the capture tool cut these two at the top of the see-through menu (G059 clearEdges): shorter, never misleading
      assert.ok(s.height >= s.width * 1.9 && s.height <= 1385, `${k}: ${s.height}`);
    } else {
      assert.equal(s.height, 1385, `${k}: a whole phone screen (390 × 844)`);
    }
  }
  assert.ok(m.opening, 'opening clip');
  assert.equal(m.opening!.file, `/marketing/designs/${ID}/opening.mp4`);
  assert.equal(m.opening!.poster, `/marketing/designs/${ID}/opening-poster.webp`);
  assert.equal(m.opening!.width, 390);
  assert.equal(m.opening!.height, 844);
  assert.equal(m.opening!.seconds, 10);
  assert.ok(m.opening!.bytes > 50_000 && m.opening!.bytes <= 1_500_000, String(m.opening!.bytes));
  assert.deepEqual(Object.keys(manifest.designs).slice(0, 4), ['blush-garden-rose', 'olive-ivory', 'mediterranean-lemon', ID]);
});

test('JSON-LD: Product (no Offer while the price is a placeholder) + VideoObject for 02; ItemList of /designs lists every live design', () => {
  const d = liveDesign(ID)!;
  const p = product(d);
  assert.equal(p.name, 'Dusty Blue & Champagne Wedding Website');
  assert.equal(p.sku, ID);
  assert.equal(p.offers, undefined);
  assert.equal((p.image as string[]).length, 4);
  const v = videoObject(d)!;
  assert.match(String(v.contentUrl), /\/marketing\/designs\/dusty-blue-champagne\/opening\.mp4$/);
  assert.equal(v.duration, `PT${manifest.designs[ID].opening!.seconds}S`);
  assert.deepEqual(validateJsonLd(graph(p, v)), []);
  const cfg = readyConfig();
  const ready = liveDesigns(cfg).find((x) => x.id === ID)!;
  assert.equal((product(ready, cfg).offers as Record<string, string>).price, '29.40', 'Offer once a real price and link exist');
  const list = itemList(liveDesigns().map((x) => ({ path: `/designs/${x.id}`, name: x.name })));
  assert.equal((list.itemListElement as unknown[]).length, liveDesigns().length);
  assert.deepEqual(validateJsonLd(graph(list)), []);
});

test('llms.txt / llms-full.txt name 02; the sitemap stays empty while not launched and lists it after launch', () => {
  const guides = loadGuides();
  const txt = llmsTxt(guides);
  assert.match(txt, /- \[Dusty Blue & Champagne\]\([^)]+\/designs\/dusty-blue-champagne\): ivory envelope with a champagne gold edge/);
  const full = llmsFullTxt(guides);
  assert.ok(full.includes('### Dusty Blue & Champagne'));
  assert.ok(full.includes(`Opening: ${DESIGN_COPY[ID].opening}`));
  assert.ok(full.includes('- Fonts: Pinyon Script, Cormorant Garamond'));
  assert.equal(MARKETING.launched, false);
  assert.doesNotMatch(sitemapXml(guides), /<url>/, 'empty while launched is false');
  const cfg = readyConfig();
  assert.ok(sitemapEntries(guides, cfg).some((e) => e.loc === 'https://example.com/designs/dusty-blue-champagne' && e.lastmod === '2026-10-14'));
});

test('/start production gate: 02 is approved, listed and can be started (201) (04 too since G085)', async () => {
  assert.ok(approvedThemeIds().includes(ID));
  assert.equal(themeApproval(ID), 'approved');
  assert.equal(themeOpenForClaims(ID, { env: PROD }), true);
  assert.equal(themeOpenForClaims(ID, { env: { THEME_APPROVAL: 'enforce' } }), true);
  const offered = (await offeredThemes(PROD)).map((t) => t.id);
  assert.ok(offered.includes(ID), '/start list in production');
  process.env.VERCEL_ENV = 'production';
  const post = (theme: string, orderNumber: string, names: [string, string]) =>
    claimRoute(
      new Request('http://localhost:3000/api/start', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '198.51.100.83' },
        body: JSON.stringify({ theme, orderNumber, email: 'g083@example.test', names, slug: '', website: '' }),
      }),
    );
  const res = await post(ID, '6100083002', ['Eleanor', 'Theo']);
  const body = (await res.json()) as Record<string, unknown>;
  assert.equal(res.status, 201, JSON.stringify(body));
  assert.equal(typeof body.slug, 'string');
  // (a design in review is still refused with 403 theme_in_review: tests/g080-approval.test.ts, with a fixture design)
});
