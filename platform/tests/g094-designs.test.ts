// G094: designs 09 Lavender Provence (G409), 10 Tuscan Vineyard (G410), 11 Boho Pampas Terracotta (G411), 12 Tropical
// Destination (G412), 13 Enchanted Forest Storybook (G413) and 14 Ivory Lace & Pearls (G414) go on the sales site the way
// G093 added 06/07/08. Listing them as 'live' in lib/marketing/config.ts is also their approval for /start (G080,
// lib/themes/approval.ts): the sales-site entries (copy written against each theme README, the catalogue's opening line
// and the real captured screens and clip), the ≤ 60-character titles, JSON-LD, llms.txt, the sitemap rule and the
// production gate that now lets buyers start them.
// Layout of fourteen cards and the home chips ("+N more" on wide screens): tests/marketing-browser.ts (G094 section).
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

const EIGHT = [
  'blush-garden-rose',
  'olive-ivory',
  'mediterranean-lemon',
  'dusty-blue-champagne',
  'vintage-airmail-love-letter',
  'art-deco-black-tie',
  'burgundy-velvet-autumn',
  'winter-evergreen',
];
const PROD = { VERCEL_ENV: 'production' } as const;
const manifest = assets as unknown as AssetManifest;
// words of the earlier designs (01–08) that none of the six may borrow
const OLD = String.raw`lemon|\btiles?\b|cobalt|eucalyptus|instant-photo|damask|airmail|stamp|postmark|peon|\bwax\b|ribbon|dahlia|snow|\bpine\b|navy|medallion|\bdeco\b`;

/** What each new design must say, in the words of its theme README (G4NN) and the catalogue (docs/09 WEB NN). */
const NEW = [
  {
    id: 'lavender-provence',
    name: 'Lavender Provence',
    title: 'Lavender Provence: Wedding Website | BKE Studio',
    collection: '09_Lavender_Provence',
    couple: 'Amélie & Louis',
    fonts: ['Alex Brush', 'Cormorant Garamond'],
    catalogue:
      'On tap, the jute twine with its lavender bundle unties and slips away, the linen pouch loosens and opens, and the card slides up out of it while dried lavender buds scatter on a summer breeze.',
    readmeHasCatalogue: true,
    style: ['cream linen pouch', 'jute twine', 'lavender bundle', 'pressed lavender', 'white daisies', 'wheat', 'lilac paper', 'pressed-flower'],
    opening: ['tap', 'jute twine unties and slips away with its lavender bundle', 'linen pouch loosens and opens', 'slides up out of it', 'dried lavender buds scatter on a summer breeze', 'comes forward', 'home page'],
    readme: ['keten kese', 'jüt sicim', 'lavanta demeti', 'papatya', 'buğday başağı', 'esintiyle', 'tomurcuk', 'Alex Brush', 'Cormorant Garamond', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /Three photos on pressed-flower cards set at loose angles.*tumbles in on a breeze from its own side/, rsvp: /Will You Join Us\?.*lavender bundle/ },
    foreign: new RegExp(`${OLD}|\\blace\\b|olive|grape|\\bvine\\b|pampas|plumeria|monstera|firefl|pearl|\\bgold\\b`, 'i'),
    guides: ['how-to-make-a-wedding-website', 'what-to-put-on-your-wedding-website'],
  },
  {
    id: 'tuscan-vineyard',
    name: 'Tuscan Vineyard',
    title: 'Tuscan Vineyard: Envelope Wedding Website | BKE Studio',
    collection: '10_Tuscan_Vineyard',
    couple: 'Giulia & Matteo',
    fonts: ['Italianno', 'Marcellus'],
    catalogue:
      'On tap, the twine unwinds upward off the flap tip with its cork and olive leaves, the kraft flap opens to reveal the wine-colored grape liner, and the card rises as a vine tendril curls in from the corner.',
    // the README tells the opening in Turkish (Açılış, katalog cümlesi) without quoting it
    readmeHasCatalogue: false,
    style: ['kraft envelope', 'twine', 'cork', 'olive leaves', 'grape clusters', 'vine leaves', 'wine-label', 'tuscan', 'oak table'],
    opening: ['tap', 'twine unwinds upward off the flap tip with its cork and olive leaves', 'kraft flap opens to reveal a wine-colored grape liner', 'rises from the pocket', 'vine tendril curls in from the corner', 'comes forward', 'home page'],
    readme: ['kraft zarf', 'jüt sicim', 'mantar', 'zeytin yaprağı', 'şarap etiketi', 'meşe masa', 'asma dalı kıvrılarak', 'tek tek bırakılır', 'Italianno', 'Marcellus', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /Three photos in wine-label frames laid one by one on an oak table/, rsvp: /Will You Join Us\?.*twine and cork/ },
    foreign: new RegExp(`${OLD}|\\blace\\b|lavender|pampas|plumeria|monstera|firefl|pearl`, 'i'),
    guides: ['wedding-website-wording', 'canva-wedding-website-template-vs-hosted-website'],
  },
  {
    id: 'boho-pampas-terracotta',
    name: 'Boho Pampas Terracotta',
    // "<name>: Envelope Wedding Website | BKE Studio" would be 61 (site.ts designTitle drops the colon first)
    title: 'Boho Pampas Terracotta Envelope Wedding Website | BKE Studio',
    collection: '11_Boho_Pampas',
    couple: 'Luna & River',
    fonts: ['Sacramento', 'Josefin Slab'],
    catalogue:
      'On tap, the pampas-and-palm tie slips off, the arch flap folds upward, and the card slides slowly up out of the arch like a rising sun while a pampas plume sways in from the side.',
    readmeHasCatalogue: true,
    style: ['terracotta', 'arch flap', 'arched front pocket', 'pampas', 'palm spear', 'dried terracotta roses', 'arch-windowed', 'sand'],
    opening: ['tap', 'pampas-and-palm tie slips off', 'arch flap folds upward', 'terracotta rainbows', 'slides slowly up out of the arch like a rising sun', 'pampas plume sways in from the side', 'comes forward', 'home page'],
    readme: ['kemer', 'pampas tüyü', 'doğan güneş', 'gökkuşağı gibi açılma', 'terrakota gökkuşakları', 'Sacramento', 'Josefin Slab', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /Three photos in arch frames.*open out from their base like a rainbow, the middle one first/, rsvp: /Will You Join Us\?.*pampas-and-palm tie/ },
    foreign: new RegExp(`${OLD}|\\blace\\b|olive|lavender|grape|plumeria|monstera|firefl|pearl`, 'i'),
    guides: ['when-to-send-your-wedding-website', 'what-to-put-on-your-wedding-website'],
  },
  {
    id: 'tropical-destination',
    name: 'Tropical Destination',
    title: 'Tropical Destination: Wedding Website | BKE Studio',
    collection: '12_Tropical_Destination',
    couple: 'Maya & Kai',
    fonts: ['Dancing Script', 'Raleway'],
    catalogue:
      'On tap, the brass snap pops open and the plumeria tab swings away, the wallet flap flips up to reveal the palm-leaf liner, and a luggage-tag card slides up while a monstera leaf and a white plumeria drift across the screen.',
    readmeHasCatalogue: false,
    style: ['travel wallet', 'leather strap', 'brass snap', 'white plumeria', 'monstera', 'hibiscus', 'palm-leaf liner', 'luggage-tag'],
    opening: ['tap', 'brass snap pops open and the plumeria tab swings away', 'round flap flips up with its strap to reveal the palm-leaf liner', 'luggage-tag card', 'monstera leaf and a white plumeria drift across the screen', 'comes forward', 'home page'],
    readme: ['cüzdan', 'deri kayış', 'pirinç çıtçıt', 'plumeria', 'monstera', 'bavul etiketi', 'palmiye astarlı', 'ipli kraft etiket', 'sallanarak', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /Three photos on string-tied kraft tags.*swings into place from the top of its string/, rsvp: /Will You Join Us\?.*brass snap and plumeria/ },
    foreign: new RegExp(`${OLD}|\\blace\\b|olive|lavender|grape|pampas|firefl|pearl`, 'i'),
    guides: ['digital-wedding-invitation-etiquette', 'how-to-make-a-wedding-website'],
  },
  {
    id: 'enchanted-forest-storybook',
    name: 'Enchanted Forest Storybook',
    // the long name drops "Envelope" (and the book is not an envelope anyway)
    title: 'Enchanted Forest Storybook: Wedding Website | BKE Studio',
    collection: '13_Enchanted_Forest',
    couple: 'Aurora & Rowan',
    fonts: ['Tangerine', 'IM Fell English'],
    catalogue:
      'On tap, the brass clasp unhooks and swings away, the moss-green cover swings open to the left like a storybook, the first page turns, and the card rises from the page while tiny fireflies glow up around it.',
    readmeHasCatalogue: true,
    style: ['moss-green storybook', 'brass clasp', 'ferns', 'toadstools', 'fireflies', 'mist', 'photo corners', 'embossed gold'],
    opening: ['tap', 'brass clasp unhooks and swings away', 'moss-green cover swings open to the left like a storybook', 'first page turns', 'rises from the page', 'tiny fireflies glow up around it', 'comes forward', 'home page'],
    readme: ['masal kitabı', 'pirinç toka', 'ateş böceği', 'fotoğraf köşeliği', 'eğrelti', 'ilk sayfa çevrilir', 'Tangerine', 'IM Fell English', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /One long storybook page with three photo-cornered pictures in a zigzag/, rsvp: /Will You Join Us\?.*brass clasp/ },
    foreign: new RegExp(`${OLD}|\\blace\\b|olive|lavender|grape|pampas|plumeria|monstera|pearl|envelope`, 'i'),
    guides: ['wedding-website-wording', 'digital-wedding-invitation-etiquette'],
  },
  {
    id: 'ivory-lace-pearls',
    name: 'Ivory Lace & Pearls',
    title: 'Ivory Lace & Pearls: Wedding Website | BKE Studio',
    collection: '14_Ivory_Lace_Pearl',
    couple: 'Charlotte & William',
    fonts: ['Mrs Saint Delafield', 'Bodoni Moda'],
    catalogue:
      'On tap, the pearl clasp unhooks and slips away, the lace-covered doors part slowly to the sides like a lifted veil, and the card rises from the satin center while a strand of tiny pearls glints.',
    readmeHasCatalogue: true,
    style: ['lace-covered ivory gatefold', 'pearl brooch', 'white garden roses', 'pearl', 'carved ivory oval frames', 'satin', 'copperplate script'],
    opening: ['tap', 'pearl brooch unhooks and slips away', 'lace-covered doors part slowly to the sides like a lifted veil', 'rises from the satin center', 'strand of tiny pearls glints', 'comes forward', 'home page'],
    readme: ['gatefold', 'inci broş', 'dantel kapı', 'tül kaldırılır gibi', 'inci dizisi', 'oval çerçeve', 'Mrs Saint Delafield', 'Bodoni Moda', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /Three oval frames hanging from pearl strands of different lengths/, rsvp: /Will You Join Us\?.*pearl brooch/ },
    foreign: /lemon|\btiles?\b|cobalt|eucalyptus|instant-photo|damask|airmail|stamp|postmark|peon|\bwax\b|ribbon|dahlia|snow|\bpine\b|navy|medallion|\bdeco\b|olive|lavender|grape|pampas|plumeria|monstera|firefl|twine/i,
    guides: ['when-to-send-your-wedding-website', 'canva-wedding-website-template-vs-hosted-website'],
  },
] as const;
const FOURTEEN = [...EIGHT, ...NEW.map((n) => n.id)];

before(() => {
  delete process.env.PLATFORM_THEMES_DIR; // the real themes
  process.env.PLATFORM_DATA_DIR = tmpDir('g094-data-');
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

test('09–14 are live after the first eight, named as their themes, with design pages and placeholder prices', async () => {
  // G097: later designs (15, 17, 18, …) follow; tests/g097-designs.test.ts
  assert.deepEqual(liveDesigns().map((d) => d.id).slice(0, FOURTEEN.length), FOURTEEN);
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
    assert.equal(d.price, '1190');
    assert.equal(d.etsyListingUrl, '[ETSY LISTING URL]');
    assert.equal(d.compareAtPrice, null);
  }
  assert.deepEqual(MARKETING.designs.filter((x) => x.status !== 'live').map((x) => x.id), ['nocturne-lake-estate', 'velvet-jewel-box', 'grand-theatre-premiere', 'orient-express-voyage', 'kintsugi-washi', 'riad-lantern-nights', 'maison-patisserie', 'celestial-observatory', 'azulejo-mosaic', 'sky-lantern-festival', 'music-box-ballerina', 'marigold-mehndi', 'red-lacquer-double-happiness', 'highland-tartan-thistle', 'victorian-glasshouse', 'art-nouveau-lily', 'papel-picado-fiesta', 'silver-photo-booth', 'swan-chantilly-lace', 'chartreuse-garden-party', 'bordeaux-silk-bow', 'monochrome-darkroom', 'navy-ivory-crest', 'painted-lily-pond', 'espresso-pastoral', 'blue-toile-pavilion', 'suede-ranch-lace']);
});

test('design page titles ≤ 60 characters (also with a 12-character brand); the earlier titles did not change', () => {
  const brand12 = readyConfig({ brand: { ...readyConfig().brand, name: 'Seal & Story' } });
  for (const n of NEW) {
    assert.equal(designPage(n.id)!.title, n.title);
    assert.ok(designTitle(n.name, brand12).length <= 60, `${n.id} with a 12-character brand`);
  }
  for (const d of liveDesigns()) {
    assert.ok(designPage(d.id)!.title.length <= 60, d.id);
    assert.ok(designPage(d.id, brand12)!.title.length <= 60, `${d.id} with a 12-character brand`);
  }
  assert.equal(designPage('winter-evergreen')!.title, 'Winter Evergreen: Envelope Wedding Website | BKE Studio');
  assert.equal(designPage('burgundy-velvet-autumn')!.title, 'Burgundy Velvet Autumn Envelope Wedding Website | BKE Studio');
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
    // the binding opening sentence is the catalogue's (and the README's where it quotes it); the copy says the same in
    // buyer words
    const readme = flat(readFileSync(path.join(PLATFORM_ROOT, 'themes', n.id, 'README.md'), 'utf8'));
    if (n.readmeHasCatalogue) assert.ok(readme.includes(n.catalogue), `${n.id}: README opening sentence`);
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

test('real screens and opening clips of 09–14 are in assets.json and on disk; the eight earlier entries are unchanged in front', () => {
  assert.deepEqual(checkManifest(manifest), []);
  assert.deepEqual(Object.keys(manifest.designs).slice(0, FOURTEEN.length), FOURTEEN); // G097: later designs follow
  for (const n of NEW) {
    const m = manifest.designs[n.id];
    assert.ok(m, `no ${n.id} entry: node scripts/marketing-assets.ts --designs ${n.id} --shots <capture>`);
    for (const k of ['envelope', 'home', 'invitation', 'story', 'details', 'schedule', 'rsvp', 'form']) {
      const s = m.screens[k];
      assert.ok(s, `${n.id}.${k}`);
      assert.deepEqual(Object.keys(s.files).sort(), ['320', '480', '640'], k);
      for (const f of Object.values(s.files)) assert.match(f, new RegExp(`^/marketing/designs/${n.id}/${k}-\\d+\\.webp$`));
      assert.equal(s.width, 640, `${n.id}.${k}`);
      // a whole phone screen (390 × 844) or one the capture tool cut a little shorter so nothing sits behind the
      // see-through bottom menu (G059 clearEdges): 10's story, 11's story and details (the site's 640 / 1385 frame
      // covers them, ≈ 5 % off each side)
      assert.ok(s.height >= 1200 && s.height <= 1385, `${n.id}.${k}: ${s.height}`);
    }
    // the poster (envelope), home and reply screens are always whole
    for (const k of ['envelope', 'home', 'invitation', 'rsvp']) assert.equal(m.screens[k].height, 1385, `${n.id}.${k}: ${m.screens[k].height}`);
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

test('JSON-LD: Product (no Offer while the price is a placeholder) + VideoObject for 09–14; ItemList of /designs has every live design', () => {
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
  assert.equal((list.itemListElement as unknown[]).length, liveDesigns().length); // 14 in G094, 17 since G097
  assert.deepEqual(validateJsonLd(graph(list)), []);
});

test('llms.txt / llms-full.txt name 09–14; the sitemap stays empty while not launched and lists them after launch', () => {
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

test('/start production gate: 09–14 are approved, listed and can be started (201)', async () => {
  const offered = (await offeredThemes(PROD)).map((t) => t.id);
  for (const id of FOURTEEN) {
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
        headers: { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${194 + i}` },
        body: JSON.stringify({ theme: n.id, orderNumber: `61000940${i}6`, email: `g094-${i}@example.test`, names, slug: '', website: '' }),
      }),
    );
    const body = (await res.json()) as Record<string, unknown>;
    assert.equal(res.status, 201, `${n.id}: ${JSON.stringify(body)}`);
    assert.equal(typeof body.slug, 'string');
  }
});
