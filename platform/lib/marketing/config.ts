// The ONE place for brand, domain, prices, Etsy links, support and policies of the marketing site (G061, docs/14 §10).
// Every page, the JSON-LD, sitemap, robots, llms.txt and the share images read from here.
//
// Placeholders are UPPERCASE in square brackets ("[BRAND]") and stay VISIBLE in development and previews, so nothing
// undecided can pass as decided. While `launched` is false the whole marketing site is `noindex` and the sitemap is
// empty. Setting `launched: true` with a placeholder left in a required field fails the build (assertLaunchReady,
// lib/marketing/placeholders.ts — called by app/(marketing)/layout.tsx).
//
// When a decision comes in (docs/15, G062; user decisions docs/14 §13.4) change ONLY this file. START HERE PDFs and the
// Etsy listing text are separate files (docs/05 §C) and are updated together with it.

import { msg } from '../i18n/translate.ts';

export type DesignStatus = 'live' | 'preview' | 'coming';

export interface DesignCommerce {
  /** Theme id (platform/themes/<id>) = URL /designs/<id> = /start?theme=<id>. */
  id: string;
  name: string;
  /** Live designs can be purchased. Preview designs appear in the catalogue without checkout; coming designs stay hidden. */
  status: DesignStatus;
  /**
   * G099: shown in the home page's design showcase (the rest are one tap away on /designs). Pick a spread of styles and
   * light and dark designs; the home page shows every featured live design, in config order, whatever their number.
   */
  featured?: boolean;
  /** The sale price buyers see on Etsy right now, e.g. "1460" (number as text in `currency`, no currency sign). */
  price: string;
  /** Etsy's crossed-out list price while a sale runs, or null. */
  compareAtPrice: string | null;
  /** The listing's Etsy *Share & Save* link (docs/15 §3.2). Never add UTM or other query parameters (docs/14 §7.2). */
  etsyListingUrl: string;
  /** Last real change of the design page (sitemap lastmod), YYYY-MM-DD. */
  updated: string;
}

/**
 * K42 (2026-10-16): paid extras sold as their own Etsy listings (G130, docs/23_EK_HIZMETLER.md). They are not designs:
 * no theme, no /start. While `etsyListingUrl` is a placeholder the sales site shows "Coming soon on Etsy" and no price;
 * a service with a real listing URL needs a real price before launch (launchProblems).
 */
export interface ServiceCommerce {
  id: 'setup-service' | 'custom-design';
  name: string;
  /** The price Etsy shows, number as text without currency sign (the same rule as DesignCommerce.price). */
  price: string;
  /** The listing's Etsy Share & Save link, no query parameters added. */
  etsyListingUrl: string;
}

export interface MarketingConfig {
  /** true: indexing + sitemap on. Requires every placeholder below (required fields) to be filled. */
  launched: boolean;
  brand: {
    name: string;
    /** Same short definition everywhere (docs/14 §4.6): ≤ 160 characters. */
    shortDescription: string;
    /** Absolute path under public/ of a square logo (≥ 112 px) for JSON-LD, or null. Site header/footer logos: lib/marketing/brand.ts. */
    logo: string | null;
  };
  /** The registered brand domain in IDNA form, without protocol. */
  domain: string;
  /** Absolute origin of the marketing site (canonical URLs, sitemap, JSON-LD). See siteOrigin() in lib/marketing/site.ts. */
  siteUrl: string;
  support: { email: string; responseTime: string };
  etsy: { shopUrl: string; shopName: string };
  /** K38: the Etsy shop sells in TRY; prices here are the TRY amounts Etsy shows (approved 2026-10-16, docs/23 §1). */
  currency: 'USD' | 'TRY';
  /** K25: online until 12 months after the wedding date (implementation: G060, docs/16 §11.9). */
  hosting: { monthsAfterWedding: number };
  /**
   * docs/16 §11: name/date changes after the first publish; small typo fixes (per name field) are free; moving the
   * wedding date by up to `dateFreeDays` days is free (implementation: G060, lib/panel/rights.ts).
   */
  editRights: { identityChangesAfterPublish: number; typoFreeChars: number; dateFreeDays: number };
  policies: { refund: string; lostLink: string; extension: string; deletion: string; retention: string };
  /** Bundle offer text (G062) or null: the pricing section stays hidden while null. */
  bundles: string | null;
  checkout: { mode: 'etsy' | 'etsy+direct' };
  analytics: { provider: 'none' | 'vercel' };
  social: { pinterest: string | null; instagram: string | null; tiktok: string | null };
  /**
   * docs/14 §13.4 decision 6 (recommendation: allow). 'allow' opens the MARKETING pages and our artwork to model-training
   * bots; couple websites (/<names>) stay closed to them either way (lib/marketing/crawl.ts). Search and user-request
   * bots are always allowed.
   */
  aiTrainingBots: 'allow' | 'disallow';
  /** Date the marketing copy (pages other than guides) was last reviewed, YYYY-MM-DD ("Last updated"). */
  copyUpdated: string;
  /**
   * Claims the copy makes that depend on work not verified yet (docs/14 §4.5). Launch needs editRights + archive true:
   * the pages state those rules. realDevices switches "Designed for phone screens" to device claims — only after a real
   * iPhone + Android test. privacyText: the privacy notice draft was reviewed (it is not legal advice; K25: no legal
   * identity, so it names the shop and the support email). orderCheck (G060-fix): /start checks Etsy orders — today
   * any well-formed order number starts a website; true only once CLAIM_ORDER_VERIFICATION=manual (the shop confirms
   * each order, scripts/verify-order.ts) or a real Etsy check is live, so "one order = one website" is enforced.
   */
  verified: { editRights: boolean; archive: boolean; realDevices: boolean; privacyText: boolean; orderCheck: boolean };
  /** K42 extras (G130): "We set it up for you" and custom design. Optional for launch while their listing is not live. */
  services: ServiceCommerce[];
  designs: DesignCommerce[];
}

export const MARKETING: MarketingConfig = {
  launched: false,
  // K26/K27 (2026-10-14): working name BKE Studio, identity GM01 direction C (brand/).
  brand: {
    name: 'BKE Studio',
    // G144: msg() marks texts the sales site translates where it shows them (lib/marketing/i18n.ts)
    shortDescription: msg(
      'BKE Studio makes wedding websites that open like a real invitation. Buy a design on Etsy, edit it on your phone and collect RSVPs online.',
    ),
    logo: '/brand/icon-512.png',
  },
  domain: 'xn--bkestudo-zkb.com',
  // Vercel is serving the purchased domain; keep it as the production fallback when no public URL env var is set.
  siteUrl: process.env.MARKETING_SITE_URL || process.env.PLATFORM_PUBLIC_URL || 'https://xn--bkestudo-zkb.com',
  // K33 (2026-10-15): shop name BKE Studio, support address bkestudio@gmail.com ("for now"). Response time 24 hours (user,
  // 2026-10-15). K48 (2026-10-17): the Etsy shop link is the shop STUDIOBKE (K35: Etsy's real shop name; copy says BKE Studio).
  support: { email: 'bkestudio@gmail.com', responseTime: msg('24 hours') },
  etsy: { shopUrl: 'https://www.etsy.com/shop/STUDIOBKE', shopName: 'BKE Studio' },
  currency: 'TRY',
  hosting: { monthsAfterWedding: 12 },
  editRights: { identityChangesAfterPublish: 3, typoFreeChars: 2, dateFreeDays: 7 },
  policies: {
    refund: msg(
      'no returns, exchanges or refunds, because you get instant access to a digital product. If something on your website does not work as described, we fix it',
    ),
    // K48 (2026-10-17): the coordinator's defaults for G090's open policies, worded only from what the system does today
    // (the user may change them). Each is one whole sentence; pages put it after sentences of their own (G154).
    // Lost link = the G146 way back: /my ("Create your website") with the Etsy order number + email, on any device.
    // (inline Markdown: the FAQ renders it; /my stays unprefixed in every language, lib/marketing/lang-path.ts)
    lostLink: msg(
      'Open [Create your website](/my) on any phone or computer and enter your Etsy order number and the email you started with: your editor opens where you left off.',
    ),
    // Extension: on request before the "Online until" date (the shop moves the date in the admin); no price is promised.
    extension: msg('Need it online longer? Message us on Etsy before your “Online until” date and we can extend it.'),
    // Deletion: on request with the order number; website, photos and guest replies within 30 days.
    deletion: msg('Message us on Etsy with your order number and we delete your website, its photos and your guests’ replies within 30 days.'),
    // Retention: archived for 12 months after the website goes offline at its "Online until" date, then deleted (the
    // admin's to-do list shows them).
    retention: msg('After your “Online until” date, we keep your website archived for 12 months, then we delete it with its photos and replies.'),
  },
  bundles: null,
  checkout: { mode: 'etsy' },
  analytics: { provider: 'none' },
  social: { pinterest: null, instagram: null, tiktok: null },
  aiTrainingBots: 'allow',
  copyUpdated: '2026-10-18',
  // editRights + archive: G060 (panel v2) implements them; flip to true when it is merged and live-checked.
  verified: { editRights: false, archive: false, realDevices: false, privacyText: false, orderCheck: false },
  // K42: prices approved by the user on 2026-10-16 (TRY, docs/23 §1). The listings are not on Etsy yet (K41).
  services: [
    { id: 'setup-service', name: 'We set it up for you', price: '500', etsyListingUrl: '[ETSY LISTING URL]' },
    { id: 'custom-design', name: 'Custom design', price: '2960', etsyListingUrl: '[ETSY LISTING URL]' },
  ],
  designs: [
    // New product (G142): platform theme ready for review; sale approval and price remain pending.
    {
      id: 'nocturne-lake-estate',
      name: 'Nocturne Lake Estate',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // New design 23 (G161): platform theme with interim box pieces until its GPT parts arrive; not for sale yet.
    {
      id: 'velvet-jewel-box',
      name: 'Velvet Jewel Box',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },    // New design wave 23–28 (G162, docs/24): theme built before its GPT parts; interim pieces, sale waits for the parts.
    {
      id: 'grand-theatre-premiere',
      name: 'Grand Theatre Premiere',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // G163 (docs/24): 25 Orient Express Voyage, built before its GPT parts; sale approval and price remain pending.
    {
      id: 'orient-express-voyage',
      name: 'Orient Express Voyage',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // New design 26 (G164): theme built before its GPT parts (interim paper); sale approval and price remain pending.
    {
      id: 'kintsugi-washi',
      name: 'Kintsugi & Washi',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // New design 27 (G165, docs/24): platform theme built before its GPT parts (interim layers); not on sale, no price yet.
    {
      id: 'riad-lantern-nights',
      name: 'Riad Lantern Nights',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // New design 28 (G166, docs/24): platform theme built before its GPT parts (interim layers); not on sale, no price yet.
    {
      id: 'maison-patisserie',
      name: 'Maison Pâtisserie',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // New design 29 (G168, docs/24 2nd wave): platform theme built before its GPT parts (interim layers); not on sale, no price yet.
    {
      id: 'celestial-observatory',
      name: 'Celestial Observatory',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // New design 30 (G169, docs/24 wave 2): platform theme built before its GPT parts (interim tiles); not on sale, no price yet.
    {
      id: 'azulejo-mosaic',
      name: 'Azulejo Mosaic',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // New design 31 (G170, docs/24 wave 2): platform theme built before its GPT parts (interim layers); not on sale, no price yet.
    {
      id: 'sky-lantern-festival',
      name: 'Sky Lantern Festival',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    // New design 32 (G171, docs/24 wave 2): platform theme built before its GPT parts (interim layers); not on sale, no price yet.
    {
      id: 'music-box-ballerina',
      name: 'Music Box Ballerina',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
    {
      id: 'blush-garden-rose',
      name: 'Blush Garden Rose',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
    {
      id: 'olive-ivory',
      name: 'Olive & Ivory',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
    {
      // G405 approved (2026-10-14); on the sales site and open on /start since G082.
      id: 'mediterranean-lemon',
      name: 'Mediterranean Lemon',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
    {
      // G402 approved (2026-10-14); on the sales site and open on /start since G083.
      id: 'dusty-blue-champagne',
      name: 'Dusty Blue & Champagne',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
    {
      // G404 approved (2026-10-15); on the sales site and open on /start since G085.
      id: 'vintage-airmail-love-letter',
      name: 'Vintage Airmail Love Letter',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G406 approved (2026-10-15); on the sales site and open on /start since G093.
      id: 'art-deco-black-tie',
      name: 'Art Deco Black-Tie',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G407 approved (2026-10-15); on the sales site and open on /start since G093.
      id: 'burgundy-velvet-autumn',
      name: 'Burgundy Velvet Autumn',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G408 approved (2026-10-15); on the sales site and open on /start since G093.
      id: 'winter-evergreen',
      name: 'Winter Evergreen',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G409 theme on main; on the sales site and open on /start since G094 (integrator's request, 2026-10-15).
      id: 'lavender-provence',
      name: 'Lavender Provence',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G410 theme on main; on the sales site and open on /start since G094 (integrator's request, 2026-10-15).
      id: 'tuscan-vineyard',
      name: 'Tuscan Vineyard',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G411 theme on main; on the sales site and open on /start since G094 (integrator's request, 2026-10-15).
      id: 'boho-pampas-terracotta',
      name: 'Boho Pampas Terracotta',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G412 theme on main; on the sales site and open on /start since G094 (integrator's request, 2026-10-15).
      id: 'tropical-destination',
      name: 'Tropical Destination',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G413 theme on main; on the sales site and open on /start since G094 (integrator's request, 2026-10-15).
      id: 'enchanted-forest-storybook',
      name: 'Enchanted Forest Storybook',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G414 theme on main; on the sales site and open on /start since G094 (integrator's request, 2026-10-15).
      id: 'ivory-lace-pearls',
      name: 'Ivory Lace & Pearls',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    // G097: designs 15–20 (approved theme tasks G415–G420). A new design is one entry here in design-number order, plus its
    // copy in designs.ts and its screens (marketing-assets.ts --designs <id> --shots <capture>).
    {
      // G415 approved (2026-10-15); on the sales site and open on /start since G097.
      id: 'cherry-blossom-spring',
      name: 'Cherry Blossom Spring',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G416 approved (2026-10-15); on the sales site and open on /start since G097.
      id: 'sunflower-rustic-barn',
      name: 'Sunflower Rustic Barn',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G417 approved (2026-10-15); on the sales site and open on /start since G097.
      id: 'emerald-gold-estate',
      name: 'Emerald & Gold Estate',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G418 approved (2026-10-15); on the sales site and open on /start since G097.
      id: 'wildflower-meadow-vellum',
      name: 'Wildflower Meadow Vellum',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G419 approved (2026-10-15); on the sales site and open on /start since G097.
      id: 'midnight-garden',
      name: 'Midnight Garden',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    {
      // G420 approved (2026-10-15); on the sales site and open on /start since G097.
      id: 'coastal-seaside',
      name: 'Coastal Seaside',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-15',
    },
    // Opened for sale by the user on 2026-10-17 (G142); same price as the other designs (K42, etsy_upload.json price_try).
    {
      id: 'crimson-rose-atelier',
      name: 'Crimson Rose Atelier',
      status: 'live',
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-17',
    },
  ],
};

