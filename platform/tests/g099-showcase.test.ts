// G099: the sales site with twenty designs. The home page shows a showcase of FEATURED designs (an explicit
// `featured: true` in lib/marketing/config.ts, no number in the code) and "See all N designs"; shared copy no longer says
// that every design opens from an envelope (13 opens like a book, 18 from a vellum sleeve, 06 and 14 are gatefolds, 09 a
// pouch, 12 a travel wallet) while the home page keeps its docs/14 §2.1 cluster (envelope, digital, wedding invitation
// website); design pages name their own opening (openingObject); Sunflower Rustic Barn's Our Story screen was retaken
// at its first print (only its three story files changed). Layout, the 1024 × 800 first screen and the design page's one
// primary action are checked in the browser: tests/marketing-browser.ts (G099 section).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { MARKETING } from '../lib/marketing/config.ts';
import { llmsTxt } from '../lib/marketing/crawl.ts';
import { featuredDesigns, liveDesign, liveDesigns, openingObject } from '../lib/marketing/designs.ts';
import { definition, included } from '../lib/marketing/facts.ts';
import { faqItems } from '../lib/marketing/faq.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { videoObject } from '../lib/marketing/schema.ts';
import { corePages } from '../lib/marketing/site.ts';
import assets from '../lib/marketing/assets.json' with { type: 'json' };
import { PLATFORM_ROOT } from './helpers.ts';

const SHOWCASE = [
  'blush-garden-rose',
  'olive-ivory',
  'mediterranean-lemon',
  'art-deco-black-tie',
  'enchanted-forest-storybook',
  'cherry-blossom-spring',
  'midnight-garden',
  'coastal-seaside',
];
const read = (rel: string) => readFileSync(path.join(PLATFORM_ROOT, rel), 'utf8');

test('home showcase: the featured live designs from config.ts, in config order; fewer than all; none marked = all', () => {
  const featured = featuredDesigns();
  assert.deepEqual(featured.map((d) => d.id), SHOWCASE);
  assert.ok(featured.every((d) => d.status === 'live' && d.featured === true));
  assert.ok(featured.length < liveDesigns().length, 'the rest are on /designs');
  // a featured 'coming' design is never shown
  const coming = { ...MARKETING, designs: MARKETING.designs.map((d) => (d.id === 'olive-ivory' ? { ...d, status: 'coming' as const } : d)) };
  assert.ok(!featuredDesigns(coming).some((d) => d.id === 'olive-ivory'));
  const none = { ...MARKETING, designs: MARKETING.designs.map(({ featured: _f, ...d }) => d) };
  assert.equal(featuredDesigns(none).length, liveDesigns(none).length);
  // the page reads the list (no count in the code) and links the gallery. G141 (K45 item 7): the home page shows every
  // live design, the featured ones first (showcaseDesigns, tests/g141-showcase.test.ts).
  const home = read('components/marketing/pages/HomePage.tsx');
  assert.match(home, /showcaseDesigns\(\)/);
  assert.match(home, /See all \{n\} designs/);
  assert.doesNotMatch(home, /\.slice\(0,\s*\d+\)/);
});

test('openingObject: every live design starts its opening with "Your guests tap the <thing>."; the non-envelopes are named', () => {
  const things = Object.fromEntries(liveDesigns().map((d) => [d.id, openingObject(d.copy)]));
  for (const [id, t] of Object.entries(things)) assert.match(t, /^(envelope|gatefold|pouch|wallet|book|sleeve)$/, id);
  assert.equal(things['enchanted-forest-storybook'], 'book');
  assert.equal(things['wildflower-meadow-vellum'], 'sleeve');
  assert.equal(things['art-deco-black-tie'], 'gatefold');
  assert.equal(things['ivory-lace-pearls'], 'gatefold');
  assert.equal(things['lavender-provence'], 'pouch');
  assert.equal(things['tropical-destination'], 'wallet');
  assert.equal(things['olive-ivory'], 'envelope');
  assert.throws(() => openingObject({ id: 'x', opening: 'The flap lifts.' }), /must start with/);
  // the opening video's name follows the design
  assert.equal(videoObject(liveDesign('enchanted-forest-storybook')!)!.name, 'Enchanted Forest Storybook wedding website: book opening');
  assert.equal(videoObject(liveDesign('olive-ivory')!)!.name, 'Olive & Ivory wedding website: envelope opening');
});

test('shared copy: no "every design is an envelope" generalization left; the home page keeps "envelope" (docs/14 §2.1)', () => {
  const files = [
    'components/marketing/pages/HomePage.tsx',
    'components/marketing/pages/DesignsPage.tsx',
    'components/marketing/pages/DesignPage.tsx',
    'components/marketing/pages/FeaturesPage.tsx',
    'components/marketing/pages/HowItWorksPage.tsx',
    'components/marketing/pages/GuidePage.tsx',
    'components/marketing/demo-data.ts',
    'lib/marketing/facts.ts',
    'lib/marketing/crawl.ts',
    'lib/marketing/schema.ts',
    'lib/marketing/faq.ts',
    'lib/marketing/site.ts',
  ];
  const gone = [
    /after the envelope/i,
    /Choose the envelope your guests/,
    /tap a sealed envelope, it opens/,
    /Every design opens from a sealed envelope and/,
    /its own envelope, opening/,
    /An envelope opening page/,
    /Envelope opening, \{SITE_PAGES/,
    /wedding website: envelope opening/,
    /sealed envelope page/,
    /the envelope opens in the order/i,
    /opens from a sealed envelope\. /,
    /open from a sealed envelope\. /,
    /an opening envelope/,
  ];
  for (const f of files) {
    const text = read(f);
    for (const re of gone) assert.doesNotMatch(text, re, `${f}: ${re}`);
  }
  for (const g of loadGuides()) assert.doesNotMatch(g.blocks.map((b) => JSON.stringify(b)).join(' '), /open from a sealed envelope into|after an envelope that opens/, g.slug);
  // generic statements now cover every design
  assert.match(definition().long, /sealed envelope or keepsake/);
  assert.match(included()[0], /envelope or keepsake/);
  assert.ok(faqItems().every((f) => !/land on the sealed envelope|open the envelope and reply/.test(f.a)));
  assert.match(llmsTxt(loadGuides()), /- Pages: an opening page \(an envelope, or in some designs a gatefold, pouch, wallet, storybook or sleeve\)/);
  // the home cluster stays: title, H1, description and the page itself still say "envelope"
  const homePage = corePages().find((p) => p.path === '/')!;
  assert.match(homePage.title + homePage.h1 + homePage.description, /envelope/i);
  assert.ok(homePage.description.length >= 120 && homePage.description.length <= 160);
  assert.match(read('components/marketing/pages/HomePage.tsx'), /sealed envelope/);
});

test('Sunflower Rustic Barn: the Our Story screen is a whole 640 × 1385 phone screen (retaken at the first print)', () => {
  const story = (assets as any).designs['sunflower-rustic-barn'].screens.story;
  assert.equal(story.width, 640);
  assert.equal(story.height, 1385);
  assert.deepEqual(Object.keys(story.files), ['320', '480', '640']);
});
