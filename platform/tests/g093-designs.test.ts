// G093: designs 06 Art Deco Black-Tie (G406), 07 Burgundy Velvet Autumn (G407) and 08 Winter Evergreen (G408) go on the
// sales site the way G082/G083/G085 added 05, 02 and 04. Listing them as 'live' in lib/marketing/config.ts is also their
// approval for /start (G080, lib/themes/approval.ts): the sales-site entries (copy written against each theme README,
// the catalogue's opening line and the real captured screens and clip), the ≤ 60-character titles, JSON-LD, llms.txt,
// the sitemap rule and the production gate that now lets buyers start them.
// Layout of eight cards (3 + 3 + 2 centered on wide screens) and the chip strip: tests/marketing-browser.ts (G093 section).
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

const FIVE = ['blush-garden-rose', 'olive-ivory', 'mediterranean-lemon', 'dusty-blue-champagne', 'vintage-airmail-love-letter'];
const PROD = { VERCEL_ENV: 'production' } as const;
const manifest = assets as unknown as AssetManifest;

/** What each new design must say, in the words of its theme README (G40N) and the catalogue (docs/09 WEB 0N). */
const NEW = [
  {
    id: 'art-deco-black-tie',
    name: 'Art Deco Black-Tie',
    title: 'Art Deco Black-Tie: Wedding Website | BKE Studio',
    collection: '06_Art_Deco_Noir',
    couple: 'Vivian & Charles',
    fonts: ['Italiana', 'Josefin Sans'],
    catalogue:
      'On tap, the gold medallion clasp turns and lifts away, the two navy doors swing open to the sides like ballroom doors, and the card rises from the center pocket as a thin band of gold light sweeps across the screen.',
    style: ['navy', 'gatefold', 'gold art deco medallion', 'gold fan rays', 'pearls', 'stepped deco arch frames', 'champagne coupe', 'medallion clasp'],
    opening: ['tap', 'gold medallion clasp turns and lifts away', 'two navy doors swing open to the sides like ballroom doors', 'fan-patterned insides', 'rises from the center pocket', 'thin band of gold light sweeps across the screen', 'comes forward', 'home page'],
    readme: ['madalyon', 'balo salonu kapıları', 'yelpaze desenli', 'merdiven gibi', 'karanlıktan ışığa', 'ışık bandı', 'Italiana', 'Josefin Sans', 'Order of the Day', 'WILL YOU JOIN US?'],
    pages: { story: /Three photos in stepped art deco arch frames, set like a staircase on a phone/, rsvp: /Will You Join Us\?.*gold medallion/ },
    // nothing from 01–05 (lace, olive, lemon, tiles, eucalyptus, airmail …) or from 07/08 (ribbon, bow, dahlias, snow, pine)
    foreign: /\blace\b|olive|lemon|\btiles?\b|cobalt|eucalyptus|instant-photo|damask|airmail|stamp|postmark|peon|\bwax\b|ribbon|\bbow\b|dahlia|snow|\bpine\b/i,
    guides: ['wedding-website-wording', 'how-to-make-a-wedding-website'],
  },
  {
    id: 'burgundy-velvet-autumn',
    name: 'Burgundy Velvet Autumn',
    // "<name>: Envelope Wedding Website | BKE Studio" would be 61 (site.ts designTitle drops the colon first)
    title: 'Burgundy Velvet Autumn Envelope Wedding Website | BKE Studio',
    collection: '07_Burgundy_Velvet',
    couple: 'Rosalind & Edward',
    fonts: ['Pinyon Script', 'Cinzel', 'Cormorant Garamond'],
    catalogue:
      "On tap, the velvet bow unties and the ribbon slides off the envelope's sides, the rectangular flap lifts, and the card rises in warm candlelight while a single copper leaf drifts down.",
    style: ['ivory', 'envelope', 'burgundy velvet ribbon', 'bow', 'gold oak-leaf charm', 'dahlias', 'blackberries', 'copper', 'oval gold frames', 'candlelight'],
    opening: ['tap', 'velvet bow unties', 'ribbon slides off the sides of the envelope', 'rectangular flap lifts', 'burgundy liner', 'rises in a warm candlelight glow', 'single copper maple leaf drifts down', 'comes forward', 'home page'],
    readme: ['çözülür', 'kayarak çıkar', 'dikdörtgen kapak', 'mum ışığı', 'bakır akçaağaç yaprağı', 'sallanır', 'böğürtlen dalı', 'Pinyon Script', 'Cinzel', 'Cormorant Garamond', 'Order of the Day'],
    pages: { story: /Three photos in oval gold frames, each hanging from a burgundy velvet ribbon and bow/, rsvp: /Will You Join Us\?.*burgundy velvet bow/ },
    foreign: /\blace\b|olive|lemon|\btiles?\b|cobalt|eucalyptus|instant-photo|damask|airmail|stamp|postmark|peon|\bwax\b|navy|medallion|\bdeco\b|gatefold|snow|\bpine\b/i,
    guides: ['what-to-put-on-your-wedding-website', 'canva-wedding-website-template-vs-hosted-website'],
  },
  {
    id: 'winter-evergreen',
    name: 'Winter Evergreen',
    title: 'Winter Evergreen: Envelope Wedding Website | BKE Studio',
    collection: '08_Winter_Evergreen',
    couple: 'Noelle & James',
    fonts: ['Parisienne', 'Libre Baskerville'],
    catalogue:
      'On tap, soft snow begins to fall, the pine-and-berry bundle loosens and slides away, the green flap opens upward, and the snowy white card rises as snowflakes drift across the screen.',
    style: ['forest green envelope', 'snowy white deckle edge', 'pine', 'cedar', 'three red berries', 'red velvet bow', 'juniper', 'pine cones', 'white wooden window frames'],
    opening: ['tap', 'soft snow begins to fall', 'pine-and-berry bundle loosens and slides away', 'green flap opens upward', 'white liner patterned with pine and red berries', 'card with your portrait rises', 'snowflakes drift across the screen', 'comes forward', 'home page'],
    readme: ['kar yağmaya başlar', 'demet gevşer', 'yeşil kapak', 'kar taneleri', 'buğu', 'köşelerde kırağı', 'pine-and-berry bundle', 'Parisienne', 'Libre Baskerville', 'Order of the Day'],
    pages: { story: /Three photos behind frosted panes in white wooden windows.*frost wipes clear from the middle and stays in the corners/, rsvp: /Will You Join Us\?.*pine-and-berry bundle/ },
    foreign: /\blace\b|olive|lemon|\btiles?\b|cobalt|eucalyptus|instant-photo|damask|airmail|stamp|postmark|peon|\bwax\b|navy|medallion|\bdeco\b|gatefold|burgundy|dahlia|copper|candle|\bgold\b/i,
    guides: ['when-to-send-your-wedding-website', 'digital-wedding-invitation-etiquette'],
  },
] as const;
const EIGHT = [...FIVE, ...NEW.map((n) => n.id)];

before(() => {
  delete process.env.PLATFORM_THEMES_DIR; // the real themes
  process.env.PLATFORM_DATA_DIR = tmpDir('g093-data-');
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

test('06, 07 and 08 are live after the first five, named as their themes, with design pages and placeholder prices', async () => {
  // G094: 09–14 follow (tests/g094-designs.test.ts)
  assert.deepEqual(liveDesigns().map((d) => d.id).slice(0, 8), EIGHT);
  for (const n of NEW) {
    const d = liveDesign(n.id)!;
    assert.ok(d, `${n.id} listed`);
    assert.equal(d.name, n.name);
    assert.equal(d.updated, '2026-10-15');
    assert.equal((await claimableTheme(n.id))!.name, d.name, `${n.id}: config name = theme.json name`);
    const page = designPage(n.id)!;
    assert.equal(page.path, `/designs/${n.id}`);
    assert.equal(page.h1, `${n.name} wedding website`);
    // K42 (2026-10-16): the user-approved price, the same for every design; no Etsy link invented yet
    assert.equal(d.price, '1460');
    assert.equal(d.etsyListingUrl, '[ETSY LISTING URL]');
    assert.equal(d.compareAtPrice, null);
  }
  assert.deepEqual(MARKETING.designs.filter((x) => x.status !== 'live').map((x) => x.id), ['nocturne-lake-estate', 'velvet-jewel-box', 'grand-theatre-premiere', 'orient-express-voyage', 'kintsugi-washi', 'riad-lantern-nights', 'maison-patisserie', 'celestial-observatory', 'azulejo-mosaic', 'sky-lantern-festival', 'music-box-ballerina', 'highland-tartan-thistle']);
});

test('design page titles ≤ 60 characters (also with a 12-character brand); the earlier titles did not change', () => {
  const brand12 = readyConfig({ brand: { ...readyConfig().brand, name: 'Seal & Story' } });
  for (const n of NEW) {
    assert.equal(designPage(n.id)!.title, n.title);
    assert.ok(designTitle(n.name, brand12).length <= 60, `${n.id} with a 12-character brand`);
  }
  assert.equal(designTitle('Burgundy Velvet Autumn', brand12), 'Burgundy Velvet Autumn: Wedding Website | Seal & Story');
  for (const d of liveDesigns()) {
    assert.ok(designPage(d.id)!.title.length <= 60, d.id);
    assert.ok(designPage(d.id, brand12)!.title.length <= 60, `${d.id} with a 12-character brand`);
  }
  assert.equal(designPage('blush-garden-rose')!.title, 'Blush Garden Rose: Envelope Wedding Website | BKE Studio');
  assert.equal(designPage('vintage-airmail-love-letter')!.title, 'Vintage Airmail Love Letter: Wedding Website | BKE Studio');
});

test('copy matches each theme: demo couple, fonts, palette tokens, collection, guides, README and catalogue opening', async () => {
  const flat = (s: string) => s.replace(/\s+/g, ' ');
  const catalogue = flat(readFileSync(path.join(REPO_ROOT, 'docs/09_TASARIM_KATALOGU.md'), 'utf8'));
  for (const n of NEW) {
    const c = DESIGN_COPY[n.id];
    const theme = (await claimableTheme(n.id))!;
    assert.equal(c.demoCouple, theme.demo.name_display, `${n.id}: demo couple = the theme's demo record`);
    assert.equal(c.demoCouple, n.couple);
    const html = readFileSync(path.join(PLATFORM_ROOT, 'themes', n.id, 'index.html'), 'utf8');
    const families = [...html.matchAll(/family=([A-Za-z+]+)/g)].map((m) => m[1].replace(/\+/g, ' '));
    assert.deepEqual(c.fonts, [...n.fonts]);
    for (const f of c.fonts) assert.ok(families.includes(f), `${n.id}: font "${f}" is not loaded by the theme (${families.join(', ')})`);
    assert.equal(c.collection, n.collection);
    assert.ok(existsSync(path.join(REPO_ROOT, 'collections', c.collection)), `${n.id}: collections/${c.collection}`);
    assert.deepEqual(c.relatedGuides, [...n.guides]);
    for (const g of c.relatedGuides) assert.ok(loadGuide(g), `${n.id}: related guide ${g}`);
    // each swatch is a colour token of the theme's own stylesheet (:root)
    const css = readFileSync(path.join(PLATFORM_ROOT, 'themes', n.id, 'site.css'), 'utf8').toUpperCase();
    assert.equal(c.palette.length, 5);
    for (const sw of c.palette) assert.ok(css.includes(sw.hex.toUpperCase()), `${n.id}: ${sw.name} ${sw.hex} is not in site.css`);
    assert.ok(c.metaDescription.length >= 120 && c.metaDescription.length <= 160, `${n.id} meta ${c.metaDescription.length}`);
    // the binding opening sentence is the README's and the catalogue's; the copy says the same in buyer words
    const readme = flat(readFileSync(path.join(PLATFORM_ROOT, 'themes', n.id, 'README.md'), 'utf8'));
    assert.ok(readme.includes(n.catalogue), `${n.id}: README opening sentence`);
    assert.ok(catalogue.includes(n.catalogue), `${n.id}: catalogue opening sentence`);
    for (const w of n.readme) assert.ok(readme.includes(w), `${n.id} README: ${w}`);
    for (const w of n.style) assert.ok((c.intro + ' ' + c.style).toLowerCase().includes(w), `${n.id}: intro/style mention "${w}"`);
    for (const w of n.opening) assert.ok(c.opening.toLowerCase().includes(w), `${n.id}: opening mentions "${w}"`);
    assert.match(c.pages.story, n.pages.story);
    assert.match(c.pages.rsvp, n.pages.rsvp);
    for (const p of Object.values(c.pages)) assert.match(p, /[.]$/);
    assert.doesNotMatch(Object.values(c.pages).join(' ') + c.opening + c.intro + c.style + c.llmsLine + c.metaDescription, n.foreign, `${n.id}: no other design's words`);
  }
});

test('real screens and opening clips of 06, 07, 08 are in assets.json and on disk; the five earlier entries are unchanged in front', () => {
  assert.deepEqual(checkManifest(manifest), []);
  assert.deepEqual(Object.keys(manifest.designs).slice(0, 8), EIGHT); // G094: 09–14 follow
  for (const n of NEW) {
    const m = manifest.designs[n.id];
    assert.ok(m, `no ${n.id} entry: node scripts/marketing-assets.ts --designs ${n.id} --shots <capture>`);
    for (const k of ['envelope', 'home', 'invitation', 'story', 'details', 'schedule', 'rsvp', 'form']) {
      const s = m.screens[k];
      assert.ok(s, `${n.id}.${k}`);
      assert.deepEqual(Object.keys(s.files).sort(), ['320', '480', '640'], k);
      for (const f of Object.values(s.files)) assert.match(f, new RegExp(`^/marketing/designs/${n.id}/${k}-\\d+\\.webp$`));
      assert.equal(s.width, 640, `${n.id}.${k}`);
      // the capture needed no cut (G059 clearEdges): every screen is a whole phone screen (390 × 844)
      assert.equal(s.height, 1385, `${n.id}.${k}: ${s.height}`);
    }
    assert.ok(m.opening, `${n.id} opening clip`);
    assert.equal(m.opening!.file, `/marketing/designs/${n.id}/opening.mp4`);
    assert.equal(m.opening!.poster, `/marketing/designs/${n.id}/opening-poster.webp`);
    assert.equal(m.opening!.width, 390);
    assert.equal(m.opening!.height, 844);
    assert.equal(m.opening!.seconds, 10);
    assert.ok(m.opening!.bytes > 50_000 && m.opening!.bytes <= 1_500_000, `${n.id} ${m.opening!.bytes}`);
  }
  // one folder per live design, nothing else
  const folders = designFolders(liveDesigns().map((d) => d.id));
  assert.deepEqual(folders.onDisk, folders.expected, 'one folder per live design, plus the envelope cover of each preview design');
  assert.deepEqual(folders.strayPreviewFiles, [], 'a preview design folder holds only envelope.webp');
});

test('JSON-LD: Product (no Offer while the price is a placeholder) + VideoObject for 06/07/08; ItemList of /designs has 8', () => {
  const cfg = readyConfig();
  for (const n of NEW) {
    const d = liveDesign(n.id)!;
    const p = product(d);
    assert.equal(p.name, `${n.name} Wedding Website`);
    assert.equal(p.sku, n.id);
    assert.equal(p.offers, undefined);
    assert.equal((p.image as string[]).length, 4);
    const v = videoObject(d)!;
    assert.match(String(v.contentUrl), new RegExp(`/marketing/designs/${n.id}/opening\\.mp4$`));
    assert.equal(v.duration, `PT${manifest.designs[n.id].opening!.seconds}S`);
    assert.deepEqual(validateJsonLd(graph(p, v)), []);
    const ready = liveDesigns(cfg).find((x) => x.id === n.id)!;
    assert.equal((product(ready, cfg).offers as Record<string, string>).price, '29.40', 'Offer once a real price and link exist');
  }
  const list = itemList(liveDesigns().map((x) => ({ path: `/designs/${x.id}`, name: x.name })));
  assert.equal((list.itemListElement as unknown[]).length, liveDesigns().length); // 8 in G093, 14 since G094
  assert.deepEqual(validateJsonLd(graph(list)), []);
});

test('llms.txt / llms-full.txt name 06, 07, 08; the sitemap stays empty while not launched and lists them after launch', () => {
  const guides = loadGuides();
  const txt = llmsTxt(guides);
  const full = llmsFullTxt(guides);
  const cfg = readyConfig();
  const entries = sitemapEntries(guides, cfg);
  for (const n of NEW) {
    const line = new RegExp(`- \\[${n.name}\\]\\([^)]+/designs/${n.id}\\): ${DESIGN_COPY[n.id].llmsLine.slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    assert.match(txt, line, n.id);
    assert.ok(full.includes(`### ${n.name}`), n.id);
    assert.ok(full.includes(`Opening: ${DESIGN_COPY[n.id].opening}`), n.id);
    assert.ok(full.includes(`- Fonts: ${n.fonts.join(', ')}`), n.id);
    assert.ok(entries.some((e) => e.loc === `https://example.com/designs/${n.id}` && e.lastmod === '2026-10-15'), n.id);
  }
  assert.equal(MARKETING.launched, false);
  assert.doesNotMatch(sitemapXml(guides), /<url>/, 'empty while launched is false');
});

test('/start production gate: 06, 07 and 08 are approved, listed and can be started (201)', async () => {
  const offered = (await offeredThemes(PROD)).map((t) => t.id);
  for (const id of EIGHT) {
    assert.ok(approvedThemeIds().includes(id), id);
    assert.equal(themeOpenForClaims(id, { env: PROD }), true, id);
    assert.ok(offered.includes(id), `/start list in production: ${id}`);
  }
  process.env.VERCEL_ENV = 'production';
  for (const [i, n] of NEW.entries()) {
    assert.equal(themeApproval(n.id), 'approved');
    assert.equal(themeOpenForClaims(n.id, { env: { THEME_APPROVAL: 'enforce' } }), true);
    const names = n.couple.split(' & ');
    const res = await claimRoute(
      new Request('http://localhost:3000/api/start', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${93 + i}` },
        body: JSON.stringify({ theme: n.id, orderNumber: `61000930${i}6`, email: `g093-${i}@example.test`, names, slug: '', website: '' }),
      }),
    );
    const body = (await res.json()) as Record<string, unknown>;
    assert.equal(res.status, 201, `${n.id}: ${JSON.stringify(body)}`);
    assert.equal(typeof body.slug, 'string');
  }
});
