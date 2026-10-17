// G097: designs 15–20 go on the sales site the way G094 added 09–14: 15 Cherry Blossom Spring (G415), 16 Sunflower Rustic
// Barn (G416), 17 Emerald & Gold Estate (G417), 18 Wildflower Meadow Vellum (G418), 19 Midnight Garden (G419) and 20
// Coastal Seaside (G420). Listing them as 'live' in lib/marketing/config.ts is also their approval for /start (G080,
// lib/themes/approval.ts): the sales-site entries (copy written against each theme README, the catalogue's opening line
// and the real captured screens and clip), the ≤ 60-character titles, JSON-LD, llms.txt, the sitemap rule and the
// production gate that now lets buyers start them.
//
// Nothing here depends on how many designs are live: a later design is added the same way (one config entry, one copy
// entry, `marketing-assets.ts --designs <id> --shots <capture>`, and one entry in NEW below). The rules that hold for
// every live design (copy, screens, clip, folder, design-number order, no file names in the copy) run over liveDesigns().
// Layout of the card grids and the home chips for any number of designs: tests/marketing-browser.ts (G094 + G097).
import { afterEach, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { claimableTheme } from '../lib/claim/themes.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { llmsFullTxt, llmsTxt, sitemapEntries, sitemapXml } from '../lib/marketing/crawl.ts';
import { DESIGN_COPY, SCREEN_SOURCES, liveDesign, liveDesigns } from '../lib/marketing/designs.ts';
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

const PROD = { VERCEL_ENV: 'production' } as const;
const manifest = assets as unknown as AssetManifest;
/** The order of the first sales-site designs (G061–G085) predates numbering by design: 03, 01, 05, 02, 04. */
const FIRST_FIVE = ['blush-garden-rose', 'olive-ivory', 'mediterranean-lemon', 'dusty-blue-champagne', 'vintage-airmail-love-letter'];
// signature words of 01–14 that none of the new designs may borrow (an entry may allow the ones its theme really has)
const EARLIER = [
  'lemon', String.raw`\btiles?\b`, 'cobalt', 'instant-photo', 'damask', 'airmail', 'stamp', 'postmark', 'peon', String.raw`\bwax\b`,
  'ribbon', 'dahlia', 'snow', String.raw`\bpine\b`, 'navy', 'medallion', String.raw`\bdeco\b`, 'lavender', 'olive', 'grape',
  String.raw`\bvine\b`, 'pampas', 'plumeria', 'firefl', 'pearl', String.raw`\blace\b`, 'twine', 'cork', 'terracotta', 'toadstool',
  'storybook',
];
/** Words this design must not use: the earlier designs' (minus `allow`) and the other new designs' (`extra`). */
const foreign = (allow: string[], ...extra: string[]) => new RegExp([...EARLIER.filter((w) => !allow.includes(w)), ...extra].join('|'), 'i');

/** What each new design must say, in the words of its theme README (G4NN) and the catalogue (docs/09 WEB NN). */
const NEW = [
  {
    id: 'cherry-blossom-spring',
    name: 'Cherry Blossom Spring',
    title: 'Cherry Blossom Spring: Envelope Wedding Website | BKE Studio',
    collection: '15_Cherry_Blossom',
    couple: 'Hana & Ethan',
    fonts: ['Petit Formal Script', 'Noto Serif Display'],
    catalogue:
      'On tap, the blossom twig loosens and drifts off, the curved grey flap lifts, and the card rises as a gentle flurry of cherry petals swirls up and floats across the screen.',
    style: ['pale grey', 'envelope', 'round', 'deckle-edged', 'cherry blossom twig', 'watercolor', 'petals', 'pink mist', 'oval'],
    opening: ['tap', 'blossom twig', 'loosens and drifts off', 'curved grey flap lifts', 'cherry blossom liner', 'rises from the pocket', 'flurry of cherry petals swirls up and floats across the screen', 'comes forward', 'home page'],
    readme: ['kiraz çiçeği', 'yuvarlak', 'tırtıklı', 'dal gevşer', 'yaprak gibi süzülür', 'çiçekli hap', 'Petit Formal Script', 'Noto Serif Display', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /Three blossom-framed ovals.*drifts down like a falling petal/, rsvp: /Will You Join Us\?.*cherry blossom twig/ },
    foreign: foreign([], 'emerald', 'velvet', 'marble', 'monstera', 'eucalyptus', 'vellum', 'sleeve', 'popp', 'cornflower', String.raw`\bgold\b`, 'sunflower', 'gingham', 'porthole', 'butterfl', 'candle'),
    guides: ['what-to-put-on-your-wedding-website', 'how-to-make-a-wedding-website'],
  },
  {
    id: 'sunflower-rustic-barn',
    name: 'Sunflower Rustic Barn',
    title: 'Sunflower Rustic Barn: Envelope Wedding Website | BKE Studio',
    collection: '16_Sunflower_Rustic',
    couple: 'Daisy & Wyatt',
    fonts: ['Kaushan Script', 'Merriweather'],
    catalogue:
      'On tap, the gingham bow tugs loose and the ribbon slides off with its little sunflower, the kraft flap flips open, and the card slides out onto the weathered barn-wood tabletop (barnwood.png) while a few sunflower petals tumble.',
    style: ['kraft', 'gingham', 'bow', 'sunflower', 'wheat', 'daisies', 'jute twine', 'golden-hour'],
    opening: ['tap', 'gingham bow tugs loose', 'ribbon slides off with its little sunflower', 'kraft flap flips open', 'barn-wood tabletop', 'slides out onto the table', 'sunflower petals tumble', 'comes forward', 'home page'],
    readme: ['kraft', 'kareli', 'fiyonk', 'ayçiçeği', 'ahşap masa', 'mandal', 'jüt ip', 'Kaushan Script', 'Merriweather', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /barn-wood wall.*pegged onto it and swings once on its peg/, rsvp: /Will You Join Us\?.*gingham ribbon/ },
    // the envelope really has a ribbon and the prints hang on jute twine
    foreign: foreign(['ribbon', 'twine'], 'cherry', 'blossom', 'emerald', 'velvet', 'marble', 'monstera', 'vellum', 'sleeve', 'porthole', 'candle', 'butterfl', String.raw`\bseal\b`),
    guides: ['how-to-make-a-wedding-website', 'wedding-website-wording'],
  },
  {
    id: 'emerald-gold-estate',
    name: 'Emerald & Gold Estate',
    title: 'Emerald & Gold Estate: Envelope Wedding Website | BKE Studio',
    collection: '17_Emerald_Gold_Estate',
    couple: 'Evelyn & Alexander',
    fonts: ['Cinzel Decorative', 'Cormorant Infant'],
    catalogue:
      'On tap, the gold seal lifts away with a glint, the emerald flap opens upward, thin gold botanical lines draw themselves across the screen, and the marble card rises from the pocket.',
    style: ['emerald velvet envelope', 'gold seal', 'laurel', 'bell-shaped flap', 'gold line-art', 'monstera', 'fern', 'eucalyptus', 'marble'],
    opening: ['tap', 'glint', 'gold seal', 'lifts away', 'emerald flap opens upward', 'gold leaf liner', 'draw themselves across the screen', 'marble card', 'rises from the pocket', 'comes forward', 'home page'],
    readme: ['zümrüt kadife', 'altın mühür', 'çan', 'galeri duvarı', 'kendini çizer', 'mermer', 'okaliptüs', 'Cinzel Decorative', 'Cormorant Infant', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /gallery wall of three thin gold frames.*hung on a nail/, rsvp: /Will You Join Us\?.*gold seal/ },
    foreign: foreign([], 'cherry', 'blossom', 'vellum', 'sleeve', 'popp', 'cornflower', 'dais', 'sunflower', 'gingham', 'porthole', 'butterfl', 'candle'),
    guides: ['wedding-website-wording', 'when-to-send-your-wedding-website'],
  },
  {
    id: 'wildflower-meadow-vellum',
    name: 'Wildflower Meadow Vellum',
    // a sleeve, not an envelope: "<name>: Envelope Wedding Website" would be 63 and the long name drops "Envelope" (as 13)
    title: 'Wildflower Meadow Vellum: Wedding Website | BKE Studio',
    collection: '18_Wildflower_Vellum',
    couple: 'Willow & Finn',
    fonts: ['Satisfy', 'Spectral'],
    catalogue:
      'On tap, the wildflower label peels away, the frosted vellum sleeve slides down off the card and fades, and the card lifts up as a few colored-pencil petals flutter across the screen.',
    style: ['frosted', 'vellum sleeve', 'wildflower label', 'colored-pencil', 'poppies', 'cornflowers', 'daisies', 'lupins', 'deckle-edged'],
    opening: ['tap', 'wildflower label peels away', 'frosted vellum sleeve', 'slides down off the card and fades', 'lifts up', 'colored-pencil poppy petals flutter across the screen', 'comes forward', 'home page'],
    readme: ['vellum kılıf', 'etiket soyulur', 'gelincik', 'peygamber çiçeği', 'papatya', 'vellum örtü', 'Satisfy', 'Spectral', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /Three photo cards.*vellum veil lifts/, rsvp: /Will You Join Us\?.*wildflower label/ },
    // "instead of an envelope" is allowed (09 says the same of its pouch); no seal, no gold, no other design's motifs
    foreign: foreign([], 'cherry', 'blossom', 'emerald', 'velvet', 'marble', 'monstera', 'eucalyptus', String.raw`\bgold\b`, String.raw`\bseal\b`, 'sunflower', 'gingham', 'porthole', 'butterfl', 'candle'),
    guides: ['digital-wedding-invitation-etiquette', 'canva-wedding-website-template-vs-hosted-website'],
  },
  {
    id: 'midnight-garden',
    name: 'Midnight Garden',
    title: 'Midnight Garden: Envelope Wedding Website | BKE Studio',
    collection: '19_Midnight_Garden',
    couple: 'Celeste & Damien',
    fonts: ['Playfair Display SC', 'Cormorant SC', 'Cormorant Garamond'],
    catalogue:
      'On tap, the silver seal cracks and falls away, the black flap opens slowly, warm golden candlelight spills out from inside, and the card rises out of the darkness into the glow.',
    style: ['matte black envelope', 'antique silver', 'silver seal', 'roses', 'peonies', 'hydrangea', 'butterfly', 'candlelight', 'gilded frames', 'dutch still life'],
    opening: ['tap', 'silver seal cracks', 'fall away', 'black flap opens slowly', 'warm golden candlelight spills out from inside', 'rises out of the darkness into the glow', 'comes forward', 'home page'],
    readme: ['siyah zarf', 'gümüş mühür', 'çatlar', 'mum ışığı', 'yaldızlı çerçeve', 'şakayık', 'kelebek', 'Playfair Display SC', 'Cormorant SC', 'Order of the Day'],
    pages: { story: /Three baroque gilded frames hung salon-style.*glow up out of the dark/, rsvp: /Will You Join Us\?.*silver seal/ },
    // 03 has peonies too; these are oil-painted plum ones
    foreign: foreign(['peon'], 'cherry', 'blossom', 'emerald', 'marble', 'monstera', 'eucalyptus', 'vellum', 'sleeve', 'sunflower', 'gingham', 'porthole', 'shell', 'popp', 'cornflower'),
    guides: ['digital-wedding-invitation-etiquette', 'what-to-put-on-your-wedding-website'],
  },
  {
    id: 'coastal-seaside',
    name: 'Coastal Seaside',
    title: 'Coastal Seaside: Envelope Wedding Website | BKE Studio',
    collection: '20_Coastal_Seaside',
    couple: 'Marina & Oliver',
    fonts: ['Allison', 'Lora'],
    catalogue:
      'On tap, the watercolor wave (wave.png) sweeps across the screen and carries the seashell and twine away, the wave-edged flap lifts, and the card rises like the incoming tide.',
    style: ['sand-colored envelope', 'wavy shoreline', 'scallop shell', 'twine', 'sea glass', 'starfish', 'dune grass', 'porthole', 'watercolor'],
    opening: ['tap', 'watercolor wave sweeps across the screen', 'carries the scallop shell and its twine away', 'wave-edged flap lifts', 'like the incoming tide', 'comes forward', 'home page'],
    readme: ['dalga', 'deniz tarağı', 'sicim', 'lomboz', 'deniz camı', 'deniz yıldızı', 'gelgit', 'Allison', 'Lora', 'Order of the Day', 'Will You Join Us?'],
    pages: { story: /Three brass portholes in a zigzag.*slides in from its own side/, rsvp: /Will You Join Us\?.*scallop shell/ },
    // the shell hangs on a loop of twine
    foreign: foreign(['twine'], 'cherry', 'blossom', 'emerald', 'velvet', 'marble', 'monstera', 'vellum', 'sunflower', 'gingham', String.raw`\broses?\b`, 'candle', 'butterfl', 'popp', 'cornflower'),
    guides: ['when-to-send-your-wedding-website', 'canva-wedding-website-template-vs-hosted-website'],
  },
] as const;

/** Design number from the collection folder ("15_Cherry_Blossom" -> 15). */
const designNo = (id: string) => Number(DESIGN_COPY[id].collection.slice(0, 2));

before(() => {
  delete process.env.PLATFORM_THEMES_DIR; // the real themes
  process.env.PLATFORM_DATA_DIR = tmpDir('g097-data-');
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

test('every live design: one entry, copy, design-number order after the first five (later designs slot in by number)', () => {
  const ids = liveDesigns().map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length, 'no design listed twice');
  assert.deepEqual(ids.slice(0, FIRST_FIVE.length), FIRST_FIVE);
  const numbers = ids.slice(FIRST_FIVE.length).map(designNo);
  assert.deepEqual(numbers, [...numbers].sort((a, b) => a - b), `design-number order: ${numbers.join(', ')}`);
  for (const id of ids) {
    assert.ok(DESIGN_COPY[id], `${id}: copy in lib/marketing/designs.ts`);
    assert.equal(DESIGN_COPY[id].id, id);
    // the catalogue names part files ("barnwood.png", "wave.png"); buyers never see a file name
    const c = DESIGN_COPY[id];
    assert.doesNotMatch([c.style, c.metaDescription, c.intro, c.opening, c.llmsLine, ...Object.values(c.pages)].join(' '), /\.(png|webp|jpe?g)\b/i, id);
  }
  // no two designs share a style line, meta description, opening or llms line
  for (const k of ['style', 'metaDescription', 'opening', 'llmsLine'] as const) {
    const all = ids.map((id) => DESIGN_COPY[id][k]);
    assert.equal(new Set(all).size, all.length, `${k} is unique per design`);
  }
});

test('15–20 are live, named as their themes, with design pages and placeholder prices', async () => {
  const ids = liveDesigns().map((d) => d.id);
  for (const n of NEW) {
    assert.ok(ids.includes(n.id), `${n.id} listed`);
    const d = liveDesign(n.id)!;
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
  // 14 before them, in the order G094 left
  assert.ok(ids.indexOf('ivory-lace-pearls') < ids.indexOf('cherry-blossom-spring'));
  assert.deepEqual(MARKETING.designs.filter((x) => x.status !== 'live').map((x) => x.id), ['nocturne-lake-estate', 'velvet-jewel-box', 'grand-theatre-premiere', 'orient-express-voyage', 'kintsugi-washi', 'riad-lantern-nights', 'maison-patisserie', 'celestial-observatory']);
});

test('design page titles ≤ 60 characters (also with a 12-character brand)', () => {
  const brand12 = readyConfig({ brand: { ...readyConfig().brand, name: 'Seal & Story' } });
  for (const n of NEW) {
    assert.equal(designPage(n.id)!.title, n.title);
    assert.ok(designTitle(n.name, brand12).length <= 60, `${n.id} with a 12-character brand`);
  }
  for (const d of liveDesigns()) {
    assert.ok(designPage(d.id)!.title.length <= 60, d.id);
    assert.ok(designPage(d.id, brand12)!.title.length <= 60, `${d.id} with a 12-character brand`);
  }
  assert.equal(designPage('ivory-lace-pearls')!.title, 'Ivory Lace & Pearls: Wedding Website | BKE Studio');
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
    assert.ok(existsSync(path.join(REPO_ROOT, 'collections', c.collection, 'DESIGN_BRIEF.md')), `${n.id}: collections/${c.collection}`);
    assert.deepEqual(c.relatedGuides, [...n.guides]);
    for (const g of c.relatedGuides) assert.ok(loadGuide(g), `${n.id}: related guide ${g}`);
    // each swatch is a colour token of the theme's own stylesheet (:root)
    const css = readFileSync(path.join(PLATFORM_ROOT, 'themes', n.id, 'site.css'), 'utf8');
    const root = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root'))).toUpperCase();
    assert.equal(c.palette.length, 5);
    for (const sw of c.palette) assert.ok(root.includes(sw.hex.toUpperCase()), `${n.id}: ${sw.name} ${sw.hex} is not a :root token of site.css`);
    assert.ok(c.metaDescription.length >= 120 && c.metaDescription.length <= 160, `${n.id} meta ${c.metaDescription.length}`);
    // the binding opening sentence is the catalogue's, quoted in the README; the copy says the same in buyer words
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

test('every live design has its real screens and opening clip in assets.json and on disk, and nothing else is there', () => {
  assert.deepEqual(checkManifest(manifest), []);
  const ids = liveDesigns().map((d) => d.id);
  assert.deepEqual(Object.keys(manifest.designs), ids, 'assets.json follows the config order');
  for (const id of ids) {
    const m = manifest.designs[id];
    assert.ok(m, `no ${id} entry: node scripts/marketing-assets.ts --designs ${id} --shots <capture>`);
    for (const k of Object.keys(SCREEN_SOURCES)) {
      const s = m.screens[k];
      assert.ok(s, `${id}.${k}`);
      assert.deepEqual(Object.keys(s.files).sort(), ['320', '480', '640'], `${id}.${k}`);
      for (const f of Object.values(s.files)) assert.match(f, new RegExp(`^/marketing/designs/${id}/${k}-\\d+\\.webp$`));
      assert.equal(s.width, 640, `${id}.${k}`);
      // a whole phone screen (390 × 844) or one the capture tool cut a little shorter (G059 clearEdges; G094 note)
      assert.ok(s.height >= 1200 && s.height <= 1385, `${id}.${k}: ${s.height}`);
    }
    assert.ok(m.opening, `${id} opening clip`);
    assert.equal(m.opening!.file, `/marketing/designs/${id}/opening.mp4`);
    assert.equal(m.opening!.seconds, 10);
  }
  for (const n of NEW) {
    const m = manifest.designs[n.id];
    // all eight screens of 15–20 came out whole
    for (const k of Object.keys(SCREEN_SOURCES)) assert.equal(m.screens[k].height, 1385, `${n.id}.${k}: ${m.screens[k].height}`);
    assert.equal(m.opening!.poster, `/marketing/designs/${n.id}/opening-poster.webp`);
    assert.equal(m.opening!.width, 390);
    assert.equal(m.opening!.height, 844);
    assert.ok(m.opening!.bytes > 50_000 && m.opening!.bytes <= 1_500_000, `${n.id} ${m.opening!.bytes}`);
  }
  // one folder per live design, nothing else
  assert.deepEqual(readdirSync(path.join(PLATFORM_ROOT, 'public/marketing/designs')).sort(), [...ids].sort());
});

test('JSON-LD: Product (no Offer while the price is a placeholder) + VideoObject for 15–20; ItemList has every live design', () => {
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
  assert.equal((list.itemListElement as unknown[]).length, liveDesigns().length);
  assert.deepEqual(validateJsonLd(graph(list)), []);
});

test('llms.txt / llms-full.txt name 15–20; the sitemap stays empty while not launched and lists them after launch', () => {
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

test('/start production gate: 15–20 are approved, listed and can be started (201)', async () => {
  const offered = (await offeredThemes(PROD)).map((t) => t.id);
  for (const id of liveDesigns().map((d) => d.id)) {
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
        headers: { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${170 + i}` },
        body: JSON.stringify({ theme: n.id, orderNumber: `61000970${i}7`, email: `g097-${i}@example.test`, names, slug: '', website: '' }),
      }),
    );
    const body = (await res.json()) as Record<string, unknown>;
    assert.equal(res.status, 201, `${n.id}: ${JSON.stringify(body)}`);
    assert.equal(typeof body.slug, 'string');
  }
});
