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

export type DesignStatus = 'live' | 'coming';

export interface DesignCommerce {
  /** Theme id (platform/themes/<id>) = URL /designs/<id> = /start?theme=<id>. */
  id: string;
  name: string;
  /** Only 'live' designs are listed anywhere; 'coming' ones are never shown or promised. */
  status: DesignStatus;
  /** The sale price buyers see on Etsy right now, e.g. "29.40" (number as text, no currency sign). */
  price: string;
  /** Etsy's crossed-out list price while a sale runs, or null. */
  compareAtPrice: string | null;
  /** The listing's Etsy *Share & Save* link (docs/15 §3.2). Never add UTM or other query parameters (docs/14 §7.2). */
  etsyListingUrl: string;
  /** Last real change of the design page (sitemap lastmod), YYYY-MM-DD. */
  updated: string;
}

export interface MarketingConfig {
  /** true: indexing + sitemap on. Requires every placeholder below (required fields) to be filled. */
  launched: boolean;
  brand: {
    name: string;
    /** Same short definition everywhere (docs/14 §4.6): ≤ 160 characters. */
    shortDescription: string;
    /** Absolute path under public/ of a square logo (≥ 112 px), or null until the brand is decided. */
    logo: string | null;
  };
  /** The domain shown in copy ("[DOMAIN]/<your-names>"), without protocol. */
  domain: string;
  /** Absolute origin of the marketing site (canonical URLs, sitemap, JSON-LD). See siteOrigin() in lib/marketing/site.ts. */
  siteUrl: string;
  support: { email: string; responseTime: string };
  etsy: { shopUrl: string; shopName: string };
  currency: 'USD';
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
  /** docs/14 §13.4 decision 6 (recommendation: allow). Search and user-request bots are always allowed. */
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
  designs: DesignCommerce[];
}

export const MARKETING: MarketingConfig = {
  launched: false,
  brand: {
    name: '[BRAND]',
    shortDescription:
      '[BRAND] makes wedding websites that open like a real invitation. Buy a design on Etsy, edit it on your phone and collect RSVPs online.',
    logo: null,
  },
  domain: '[DOMAIN]',
  // MARKETING_SITE_URL (the brand domain, once decided) wins; then PLATFORM_PUBLIC_URL (set on Vercel); else the
  // placeholder — siteOrigin() falls back to http://localhost:3000 for building URLs while it is a placeholder.
  siteUrl: process.env.MARKETING_SITE_URL || process.env.PLATFORM_PUBLIC_URL || 'https://[DOMAIN]',
  support: { email: '[SUPPORT EMAIL]', responseTime: '[RESPONSE TIME]' },
  etsy: { shopUrl: '[ETSY SHOP URL]', shopName: '[SHOP NAME]' },
  currency: 'USD',
  hosting: { monthsAfterWedding: 12 },
  editRights: { identityChangesAfterPublish: 3, typoFreeChars: 2, dateFreeDays: 7 },
  policies: {
    refund: '[REFUND POLICY]',
    lostLink: '[LOST LINK POLICY]',
    extension: '[EXTENSION POLICY]',
    deletion: '[DELETION PROCESS]',
    retention: '[RETENTION AFTER ARCHIVE]',
  },
  bundles: null,
  checkout: { mode: 'etsy' },
  analytics: { provider: 'none' },
  social: { pinterest: null, instagram: null, tiktok: null },
  aiTrainingBots: 'allow',
  copyUpdated: '2026-10-14',
  // editRights + archive: G060 (panel v2) implements them; flip to true when it is merged and live-checked.
  verified: { editRights: false, archive: false, realDevices: false, privacyText: false, orderCheck: false },
  designs: [
    {
      id: 'blush-garden-rose',
      name: 'Blush Garden Rose',
      status: 'live',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
    {
      id: 'olive-ivory',
      name: 'Olive & Ivory',
      status: 'live',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
    {
      // G404 (being built). Becomes 'live' only when the theme is live; until then it is not listed anywhere.
      id: 'vintage-airmail-love-letter',
      name: 'Vintage Airmail Love Letter',
      status: 'coming',
      price: '[PRICE]',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
  ],
};
