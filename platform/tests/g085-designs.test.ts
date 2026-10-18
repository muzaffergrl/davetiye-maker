// G085: design 04 Vintage Airmail Love Letter (theme vintage-airmail-love-letter, G404) goes on the sales site the way
// G082 added 05 and G083 02. Listing it as 'live' in lib/marketing/config.ts is also its approval for /start (G080,
// lib/themes/approval.ts): the sales-site entry (copy written against the theme, real captured screens, clip, JSON-LD,
// llms.txt, sitemap rule), the ≤ 60-character title of its long name, and the production gate that now lets buyers
// start it — with 04 every design of the sales site is approved (the gate's 403 path: tests/g080-approval.test.ts).
// Layout of five cards / the chip strip's fade: tests/marketing-browser.ts (G085 section).
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
import { designFolders, readyConfig, validateJsonLd } from './marketing-helpers.ts';

const ID = 'vintage-airmail-love-letter';
const NAME = 'Vintage Airmail Love Letter';
const FIVE = ['blush-garden-rose', 'olive-ivory', 'mediterranean-lemon', 'dusty-blue-champagne', ID];
const PROD = { VERCEL_ENV: 'production' } as const;
const manifest = assets as unknown as AssetManifest;

before(() => {
  delete process.env.PLATFORM_THEMES_DIR; // the real themes
  process.env.PLATFORM_DATA_DIR = tmpDir('g085-data-');
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

test('04 Vintage Airmail Love Letter is live: fifth after 03, 01, 05 and 02, same name as its theme, page entry', async () => {
  assert.deepEqual(liveDesigns().map((d) => d.id).slice(0, 5), FIVE);
  const d = liveDesign(ID)!;
  assert.ok(d, 'listed');
  assert.equal(d.name, NAME);
  assert.equal(d.updated, '2026-10-15');
  assert.equal((await claimableTheme(ID))!.name, d.name);
  const page = designPage(ID)!;
  assert.equal(page.path, `/designs/${ID}`);
  assert.equal(page.h1, 'Vintage Airmail Love Letter wedding website');
  // K42 (2026-10-16): the user-approved price, the same for every design; no Etsy link invented yet
  assert.equal(d.price, '1460');
  assert.equal(d.etsyListingUrl, '[ETSY LISTING URL]');
  assert.equal(d.compareAtPrice, null);
  // Existing products stay live; Crimson is a preview pending sale approval.
  assert.deepEqual(MARKETING.designs.filter((x) => x.status !== 'live').map((x) => x.id), ['nocturne-lake-estate', 'velvet-jewel-box', 'grand-theatre-premiere', 'orient-express-voyage', 'kintsugi-washi', 'riad-lantern-nights', 'maison-patisserie', 'celestial-observatory', 'azulejo-mosaic', 'sky-lantern-festival', 'music-box-ballerina', 'papel-picado-fiesta']);
});

test('design page title ≤ 60 characters: the long name keeps "Wedding Website" and drops "Envelope" (also with a 12-character brand)', () => {
  // "<name>: Envelope Wedding Website | BKE Studio" would be 66, without the colon 65 (site.ts designTitle)
  assert.equal(designPage(ID)!.title, 'Vintage Airmail Love Letter: Wedding Website | BKE Studio');
  const brand12 = readyConfig({ brand: { ...readyConfig().brand, name: 'Seal & Story' } });
  assert.equal(designTitle(NAME, brand12), 'Vintage Airmail Love Letter: Wedding Website | Seal & Story');
  for (const d of liveDesigns()) {
    assert.ok(designPage(d.id)!.title.length <= 60, d.id);
    assert.ok(designPage(d.id, brand12)!.title.length <= 60, `${d.id} with a 12-character brand`);
  }
  // the other designs' titles did not change
  assert.equal(designPage('blush-garden-rose')!.title, 'Blush Garden Rose: Envelope Wedding Website | BKE Studio');
  assert.equal(designPage('dusty-blue-champagne')!.title, 'Dusty Blue & Champagne Envelope Wedding Website | BKE Studio');
});

test('copy matches the theme: demo couple, fonts, palette tokens, collection, guides, opening of the README and the catalogue', async () => {
  const c = DESIGN_COPY[ID];
  const theme = (await claimableTheme(ID))!;
  assert.equal(c.demoCouple, theme.demo.name_display, "demo couple = the theme's demo record");
  assert.equal(c.demoCouple, 'Margot & Henry');
  const html = readFileSync(path.join(PLATFORM_ROOT, 'themes', ID, 'index.html'), 'utf8');
  const families = [...html.matchAll(/family=([A-Za-z+]+)/g)].map((m) => m[1].replace(/\+/g, ' '));
  assert.deepEqual(c.fonts, ['Homemade Apple', 'Special Elite']);
  for (const f of c.fonts) assert.ok(families.includes(f), `font "${f}" is not loaded by the theme (${families.join(', ')})`);
  assert.equal(c.collection, '04_Vintage_Airmail');
  assert.ok(existsSync(path.join(REPO_ROOT, 'collections', c.collection)));
  for (const g of c.relatedGuides) assert.ok(loadGuide(g), `related guide ${g}`);
  // each swatch is a colour token of the theme's own stylesheet (:root)
  const css = readFileSync(path.join(PLATFORM_ROOT, 'themes', ID, 'site.css'), 'utf8').toUpperCase();
  for (const sw of c.palette) assert.ok(css.includes(sw.hex.toUpperCase()), `${sw.name} ${sw.hex} is not in site.css`);
  assert.equal(c.metaDescription.length >= 120 && c.metaDescription.length <= 160, true, String(c.metaDescription.length));
  // envelope and opening in the words of the theme README (G404) and the catalogue (docs/09 WEB 04) — no invented feature
  for (const w of ['airmail envelope', 'red and navy striped', 'perforated tear strip', 'burgundy wax seal', 'initials', 'postage stamps', 'pressed flowers', 'twine', 'fountain-pen script', 'typewriter']) {
    assert.ok((c.intro + ' ' + c.style).toLowerCase().includes(w), `intro/style mention "${w}"`);
  }
  const catalogue = 'On tap, the little wax seal pops off, the perforated tear strip rips away along the top edge from left to right, and the cream letter card slides up out of the envelope while a pressed flower flutters down.';
  const flat = (s: string) => s.replace(/\s+/g, ' ');
  const readme = flat(readFileSync(path.join(PLATFORM_ROOT, 'themes', ID, 'README.md'), 'utf8'));
  assert.ok(readme.includes(catalogue), 'the binding opening sentence is still the README one');
  assert.ok(flat(readFileSync(path.join(REPO_ROOT, 'docs/09_TASARIM_KATALOGU.md'), 'utf8')).includes(catalogue), 'and the catalogue one');
  for (const w of ['tap', 'little wax seal pops off', 'perforated tear strip rips away along the top edge from left to right', 'card with your portrait slides up out of the envelope', 'forget-me-not flutters down', 'comes forward', 'home page']) {
    assert.ok(c.opening.toLowerCase().includes(w), `opening mentions "${w}"`);
  }
  for (const w of ['unutmabeni', 'pul çerçevesi', 'posta damgası', 'Homemade Apple', 'Special Elite', 'Will You Join Us?', 'Order of the Day', 'Inside this letter']) assert.ok(readme.includes(w), `README: ${w}`);
  assert.match(c.pages.story, /Three photos in postage-stamp frames drop onto a wooden writing desk/);
  assert.match(c.pages.rsvp, /Will You Join Us\?.*wax/);
  // nothing from 01 / 02 / 03 / 05
  assert.doesNotMatch(Object.values(c.pages).join(' ') + c.opening + c.intro + c.style, /\blace\b|\bbow\b|ribbon|peon|lemon|\btiles?\b|cobalt|olive|eucalyptus|instant-photo|damask|swipe|arched|\bgold\b/i);
});

test('real screens and opening clip of 04 are in assets.json and on disk; the four earlier entries are unchanged in front', () => {
  assert.deepEqual(checkManifest(manifest), []);
  const m = manifest.designs[ID];
  assert.ok(m, 'no 04 entry: node scripts/marketing-assets.ts --designs vintage-airmail-love-letter --shots <capture>');
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
  assert.deepEqual(Object.keys(manifest.designs).slice(0, 5), FIVE);
  // only 04's folder is new: one folder per live design, nothing else
  const folders = designFolders(liveDesigns().map((d) => d.id));
  assert.deepEqual(folders.onDisk, folders.expected, 'one folder per live design, plus the envelope cover of each preview design');
  assert.deepEqual(folders.strayPreviewFiles, [], 'a preview design folder holds only envelope.webp');
});

test('JSON-LD: Product (no Offer while the price is a placeholder) + VideoObject for 04; ItemList of /designs has 5', () => {
  const d = liveDesign(ID)!;
  const p = product(d);
  assert.equal(p.name, 'Vintage Airmail Love Letter Wedding Website');
  assert.equal(p.sku, ID);
  assert.equal(p.offers, undefined);
  assert.equal((p.image as string[]).length, 4);
  const v = videoObject(d)!;
  assert.match(String(v.contentUrl), /\/marketing\/designs\/vintage-airmail-love-letter\/opening\.mp4$/);
  assert.equal(v.duration, `PT${manifest.designs[ID].opening!.seconds}S`);
  assert.deepEqual(validateJsonLd(graph(p, v)), []);
  const cfg = readyConfig();
  const ready = liveDesigns(cfg).find((x) => x.id === ID)!;
  assert.equal((product(ready, cfg).offers as Record<string, string>).price, '29.40', 'Offer once a real price and link exist');
  const list = itemList(liveDesigns().map((x) => ({ path: `/designs/${x.id}`, name: x.name })));
  // G093: one item per live design (8 since 06/07/08), as in g082/g083
  assert.equal((list.itemListElement as unknown[]).length, liveDesigns().length);
  assert.ok(liveDesigns().length >= 5);
  assert.deepEqual(validateJsonLd(graph(list)), []);
});

test('llms.txt / llms-full.txt name 04; the sitemap stays empty while not launched and lists it after launch', () => {
  const guides = loadGuides();
  const txt = llmsTxt(guides);
  assert.match(txt, /- \[Vintage Airmail Love Letter\]\([^)]+\/designs\/vintage-airmail-love-letter\): red and navy striped airmail envelope/);
  const full = llmsFullTxt(guides);
  assert.ok(full.includes('### Vintage Airmail Love Letter'));
  assert.ok(full.includes(`Opening: ${DESIGN_COPY[ID].opening}`));
  assert.ok(full.includes('- Fonts: Homemade Apple, Special Elite'));
  assert.equal(MARKETING.launched, false);
  assert.doesNotMatch(sitemapXml(guides), /<url>/, 'empty while launched is false');
  const cfg = readyConfig();
  assert.ok(sitemapEntries(guides, cfg).some((e) => e.loc === 'https://example.com/designs/vintage-airmail-love-letter' && e.lastmod === '2026-10-15'));
});

test('/start production gate: 04 is approved, listed and can be started (201); every sales-site design is approved', async () => {
  assert.ok(approvedThemeIds().includes(ID));
  assert.equal(themeApproval(ID), 'approved');
  assert.equal(themeOpenForClaims(ID, { env: PROD }), true);
  assert.equal(themeOpenForClaims(ID, { env: { THEME_APPROVAL: 'enforce' } }), true);
  for (const id of FIVE) assert.equal(themeOpenForClaims(id, { env: PROD }), true, id);
  const offered = (await offeredThemes(PROD)).map((t) => t.id);
  for (const id of FIVE) assert.ok(offered.includes(id), `/start list in production: ${id}`);
  process.env.VERCEL_ENV = 'production';
  const res = await claimRoute(
    new Request('http://localhost:3000/api/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '198.51.100.85' },
      body: JSON.stringify({ theme: ID, orderNumber: '6100085004', email: 'g085@example.test', names: ['Margot', 'Henry'], slug: '', website: '' }),
    }),
  );
  const body = (await res.json()) as Record<string, unknown>;
  assert.equal(res.status, 201, JSON.stringify(body));
  assert.equal(typeof body.slug, 'string');
});
