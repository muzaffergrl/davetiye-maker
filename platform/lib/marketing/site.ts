// Marketing site map (docs/14 §5): every indexable page with its title, meta description and canonical path. Pages,
// sitemap.xml, llms.txt, the link check and the page tests all read this list, so a page exists in one place.

import { MARKETING, type MarketingConfig } from './config.ts';
import { catalogDesign, liveDesigns, openingObject } from './designs.ts';
import { enT, LANG_TAGS, msg, type Lang, type T } from './i18n.ts';
import { hasPlaceholder, real } from './placeholders.ts';

/** Origin for absolute URLs. A placeholder siteUrl ("https://[DOMAIN]") falls back to localhost (dev/preview builds). */
export function siteOrigin(cfg: MarketingConfig = MARKETING): string {
  if (!hasPlaceholder(cfg.siteUrl)) {
    try {
      return new URL(cfg.siteUrl).origin;
    } catch {
      /* fall through */
    }
  }
  return 'http://localhost:3000';
}

/**
 * The host couple websites are addressed on, for address examples in copy ("<host>/clara-and-julian"), G154: the brand
 * domain once decided, else the host of the site's real origin (MARKETING_SITE_URL / PLATFORM_PUBLIC_URL, read at
 * build time), else Vercel's production host. Never an invented domain: with none of them known the example shows "…"
 * ("…/clara-and-julian", like the START HERE guide).
 */
export function siteHost(cfg: MarketingConfig = MARKETING, env: Record<string, string | undefined> = process.env): string {
  const brand = real(cfg.domain);
  if (brand) return brand;
  for (const url of [hasPlaceholder(cfg.siteUrl) ? null : cfg.siteUrl, env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : null]) {
    if (!url) continue;
    try {
      return new URL(url).host;
    } catch {
      /* next */
    }
  }
  return '…';
}

/** Absolute URL of a site path: "/" -> "https://x/", "/faq" -> "https://x/faq". Lowercase path, no query. */
export function absUrl(pathname: string, cfg: MarketingConfig = MARKETING): string {
  return new URL(pathname, siteOrigin(cfg) + '/').toString();
}

export function withBrand(title: string, cfg: MarketingConfig = MARKETING): string {
  return `${title} | ${cfg.brand.name}`;
}

export type PageKind = 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage' | 'FAQPage';

export interface PageEntry {
  path: string;
  /** Full <title> (brand included where it belongs). */
  title: string;
  /** Visible H1. */
  h1: string;
  description: string;
  kind: PageKind;
  /** YYYY-MM-DD of the last real content change (sitemap lastmod, "Last updated"). */
  updated: string;
  /** Breadcrumb label (also the nav label). */
  label: string;
}

/** First-level pages (not designs or guides). Order = footer/sitemap order. `t`: the page language (G144). */
export function corePages(cfg: MarketingConfig = MARKETING, t: T = enT): PageEntry[] {
  const b = cfg.brand.name;
  const u = cfg.copyUpdated;
  return [
    {
      path: '/',
      label: t('Home'),
      // docs/14 §2.1: home targets "envelope wedding website", "wedding invitation website" and "digital wedding invitation".
      title: withBrand(t('Digital Envelope Wedding Invitation Websites'), cfg),
      h1: t('Envelope wedding websites that open like a real invitation'),
      description:
        t('A digital wedding invitation website with RSVP that opens from a sealed envelope or keepsake. Edit it on your phone, no Canva needed. Try the live demo.'),
      kind: 'WebPage',
      updated: u,
    },
    {
      path: '/designs',
      label: t('Designs'),
      title: withBrand(t('Wedding Website Designs with Envelope Opening'), cfg),
      h1: t('Wedding website designs'),
      description:
        t('Browse wedding website designs that open from a sealed envelope or keepsake. Each has Home, Our Story, Details and RSVP pages. Try every demo on your phone.'),
      kind: 'CollectionPage',
      updated: u,
    },
    {
      path: '/how-it-works',
      label: t('How it works'),
      title: withBrand(t('How It Works: Etsy Order to Wedding Website'), cfg),
      h1: t('How it works'),
      description:
        t('Choose a design, buy it on Etsy, start your website with your order number, then edit on your phone and share the link. Guests reply online.'),
      kind: 'WebPage',
      updated: u,
    },
    {
      path: '/features',
      label: t('Features'),
      title: withBrand(t('Wedding Website Features: RSVP, Calendar, QR'), cfg),
      h1: t('Everything your wedding website does'),
      description:
        t('RSVP with your own questions and an Excel download, add to calendar, a venue map, music, five languages, photo cropping, QR codes and a printable invitation.'),
      kind: 'WebPage',
      updated: u,
    },
    {
      path: '/pricing',
      label: t('Pricing'),
      title: withBrand(t('Pricing: One Etsy Purchase, No Subscription'), cfg),
      h1: t('Simple pricing'),
      description: t('Each wedding website design is a one-time purchase on Etsy. Your website stays online until {months} months after your wedding. See what is included.', { months: cfg.hosting.monthsAfterWedding }),
      kind: 'WebPage',
      updated: u,
    },
    {
      path: '/faq',
      label: t('FAQ'),
      title: withBrand(t('Wedding Website FAQ'), cfg),
      h1: t('Frequently asked questions'),
      description:
        t('Answers about buying on Etsy, editing from your phone, guest RSVPs, sharing your link, privacy and how long your wedding website stays online.'),
      kind: 'FAQPage',
      updated: u,
    },
    {
      path: '/guides',
      label: t('Guides'),
      title: withBrand(t('Wedding Website Guides and Wording Examples'), cfg),
      h1: t('Guides'),
      description:
        t('Practical guides for your wedding website: what to include, when to share it, RSVP deadlines, wording examples and digital invitation etiquette.'),
      kind: 'CollectionPage',
      updated: u,
    },
    {
      path: '/about',
      label: t('About'),
      title: t('About {brand}', { brand: b }),
      h1: t('About {brand}', { brand: b }),
      description:
        t('We make wedding websites that open like a real invitation, sold on Etsy and edited from your phone. Here is how we design, test and host them.'),
      kind: 'AboutPage',
      updated: u,
    },
    {
      path: '/contact',
      label: t('Contact'),
      title: t('Contact {brand}', { brand: b }),
      h1: t('Contact us'),
      description: t('Questions about a design, your order or your wedding website? Email us at {email}. Include your Etsy order number for faster help.', { email: cfg.support.email }),
      kind: 'ContactPage',
      updated: u,
    },
    {
      path: '/privacy',
      label: t('Privacy'),
      title: withBrand(t('Privacy Notice'), cfg),
      h1: t('Privacy notice'),
      description:
        t('What we collect when you buy, edit and publish a wedding website and when guests reply, where it is stored, who can see it and how long we keep it.'),
      kind: 'WebPage',
      updated: u,
    },
  ];
}

export function corePage(path: string, cfg: MarketingConfig = MARKETING, t: T = enT): PageEntry {
  const p = corePages(cfg, t).find((x) => x.path === path);
  if (!p) throw new Error(`unknown marketing page ${path}`);
  return p;
}

/**
 * Title of a design page: "<Name>: Envelope Wedding Website | <brand>" (docs/14 §6.3). A long design name (G083: "Dusty
 * Blue & Champagne" makes 61 characters) drops the colon, then "Envelope", so the title stays ≤ 60 characters
 * (G085: "Vintage Airmail Love Letter: Wedding Website | BKE Studio", 57).
 */
export function designTitle(name: string, cfg: MarketingConfig = MARKETING, envelope = true, t: T = enT): string {
  // G099: a design that opens as a book, a sleeve, a gatefold … is not called an envelope in its title.
  const options = envelope
    ? [t('{name}: Envelope Wedding Website', { name }), t('{name} Envelope Wedding Website', { name }), t('{name}: Wedding Website', { name })]
    : [t('{name}: Wedding Website', { name })];
  return withBrand(options.find((t) => withBrand(t, cfg).length <= 60) ?? options[options.length - 1], cfg);
}

export function designPage(id: string, cfg: MarketingConfig = MARKETING, t: T = enT): PageEntry | null {
  const d = catalogDesign(id, cfg);
  if (!d) return null;
  return {
    path: `/designs/${d.id}`,
    label: d.name,
    title: designTitle(d.name, cfg, openingObject(d.copy) === 'envelope', t),
    h1: t('{name} wedding website', { name: d.name }),
    description: t(d.copy.metaDescription),
    kind: 'WebPage',
    updated: d.updated,
  };
}

/** Main navigation (header). */
export const NAV = [
  { href: '/designs', label: msg('Designs') },
  { href: '/how-it-works', label: msg('How it works') },
  { href: '/features', label: msg('Features') },
  { href: '/pricing', label: msg('Pricing') },
  { href: '/faq', label: msg('FAQ') },
  { href: '/guides', label: msg('Guides') },
] as const;

/** First path segments the marketing site uses (tests: all reserved in lib/slug.ts). */
export const MARKETING_SEGMENTS = [
  'designs', 'how-it-works', 'features', 'pricing', 'faq', 'guides', 'about', 'contact', 'privacy',
  'robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', 'marketing',
  // G144: the language prefixes (/tr …, rewritten by next.config.ts) and the folder they are rewritten to
  'i18n', 'tr', 'es', 'de', 'fr',
] as const;

/** "2026-10-14" -> "October 14, 2026" (US style, docs: no ambiguous dates); other languages: their long date ("14 Ekim 2026"). */
export function formatDay(day: string, lang: Lang = 'en'): string {
  const [y, m, d] = day.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString(LANG_TAGS[lang], { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/** Display price: "$29.40" or "1,460 TRY". Placeholder stays visible as is. */
export function displayPrice(price: string, cfg: MarketingConfig = MARKETING): string {
  if (hasPlaceholder(price)) return price;
  if (cfg.currency === 'USD') return `$${price}`;
  // TRY (K38): "1,460 TRY" — the amount the Etsy shop is priced in; Etsy shows each buyer their own currency too.
  const [whole, cents] = price.split('.');
  return `${Number(whole).toLocaleString('en-US')}${cents ? `.${cents}` : ''} ${cfg.currency}`;
}
