// Marketing site map (docs/14 §5): every indexable page with its title, meta description and canonical path. Pages,
// sitemap.xml, llms.txt, the link check and the page tests all read this list, so a page exists in one place.

import { MARKETING, type MarketingConfig } from './config.ts';
import { liveDesigns } from './designs.ts';
import { hasPlaceholder } from './placeholders.ts';

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

/** First-level pages (not designs or guides). Order = footer/sitemap order. */
export function corePages(cfg: MarketingConfig = MARKETING): PageEntry[] {
  const b = cfg.brand.name;
  const u = cfg.copyUpdated;
  return [
    {
      path: '/',
      label: 'Home',
      // docs/14 §2.1: home targets "envelope wedding website", "wedding invitation website" and "digital wedding invitation".
      title: withBrand('Digital Envelope Wedding Invitation Websites', cfg),
      h1: 'Envelope wedding websites that open like a real invitation',
      description:
        'A digital wedding invitation website with RSVP that opens from a sealed envelope or keepsake. Edit it on your phone, no Canva needed. Try the live demo.',
      kind: 'WebPage',
      updated: u,
    },
    {
      path: '/designs',
      label: 'Designs',
      title: withBrand('Wedding Website Designs with Envelope Opening', cfg),
      h1: 'Wedding website designs',
      description:
        'Browse wedding website designs that open from a sealed envelope or keepsake. Each has Home, Our Story, Details and RSVP pages. Try every demo on your phone.',
      kind: 'CollectionPage',
      updated: u,
    },
    {
      path: '/how-it-works',
      label: 'How it works',
      title: withBrand('How It Works: Etsy Order to Wedding Website', cfg),
      h1: 'How it works',
      description:
        'Choose a design, buy it on Etsy, start your website with your order number, then edit on your phone and share the link. Guests reply online.',
      kind: 'WebPage',
      updated: u,
    },
    {
      path: '/features',
      label: 'Features',
      title: withBrand('Wedding Website Features: RSVP, Calendar, QR', cfg),
      h1: 'Everything your wedding website does',
      description:
        'RSVP with your own questions, replies and CSV in your panel, add to calendar, schedule, questions and answers, photo cropping and QR code sharing.',
      kind: 'WebPage',
      updated: u,
    },
    {
      path: '/pricing',
      label: 'Pricing',
      title: withBrand('Pricing: One Etsy Purchase, No Subscription', cfg),
      h1: 'Simple pricing',
      description: `Each wedding website design is a one-time purchase on Etsy. Your website stays online until ${cfg.hosting.monthsAfterWedding} months after your wedding. See what is included.`,
      kind: 'WebPage',
      updated: u,
    },
    {
      path: '/faq',
      label: 'FAQ',
      title: withBrand('Wedding Website FAQ', cfg),
      h1: 'Frequently asked questions',
      description:
        'Answers about buying on Etsy, editing from your phone, guest RSVPs, sharing your link, privacy and how long your wedding website stays online.',
      kind: 'FAQPage',
      updated: u,
    },
    {
      path: '/guides',
      label: 'Guides',
      title: withBrand('Wedding Website Guides and Wording Examples', cfg),
      h1: 'Guides',
      description:
        'Practical guides for your wedding website: what to include, when to share it, RSVP deadlines, wording examples and digital invitation etiquette.',
      kind: 'CollectionPage',
      updated: u,
    },
    {
      path: '/about',
      label: 'About',
      title: `About ${b}`,
      h1: `About ${b}`,
      description:
        'We make wedding websites that open like a real invitation, sold on Etsy and edited from your phone. Here is how we design, test and host them.',
      kind: 'AboutPage',
      updated: u,
    },
    {
      path: '/contact',
      label: 'Contact',
      title: `Contact ${b}`,
      h1: 'Contact us',
      description: `Questions about a design, your order or your wedding website? Email us at ${cfg.support.email}. Include your Etsy order number for faster help.`,
      kind: 'ContactPage',
      updated: u,
    },
    {
      path: '/privacy',
      label: 'Privacy',
      title: withBrand('Privacy Notice', cfg),
      h1: 'Privacy notice',
      description:
        'What we collect when you buy, edit and publish a wedding website and when guests reply, where it is stored, who can see it and how long we keep it.',
      kind: 'WebPage',
      updated: u,
    },
  ];
}

export function corePage(path: string, cfg: MarketingConfig = MARKETING): PageEntry {
  const p = corePages(cfg).find((x) => x.path === path);
  if (!p) throw new Error(`unknown marketing page ${path}`);
  return p;
}

/**
 * Title of a design page: "<Name>: Envelope Wedding Website | <brand>" (docs/14 §6.3). A long design name (G083: "Dusty
 * Blue & Champagne" makes 61 characters) drops the colon, then "Envelope", so the title stays ≤ 60 characters
 * (G085: "Vintage Airmail Love Letter: Wedding Website | BKE Studio", 57).
 */
export function designTitle(name: string, cfg: MarketingConfig = MARKETING): string {
  const options = [`${name}: Envelope Wedding Website`, `${name} Envelope Wedding Website`, `${name}: Wedding Website`];
  return withBrand(options.find((t) => withBrand(t, cfg).length <= 60) ?? options[options.length - 1], cfg);
}

export function designPage(id: string, cfg: MarketingConfig = MARKETING): PageEntry | null {
  const d = liveDesigns(cfg).find((x) => x.id === id);
  if (!d) return null;
  return {
    path: `/designs/${d.id}`,
    label: d.name,
    title: designTitle(d.name, cfg),
    h1: `${d.name} wedding website`,
    description: d.copy.metaDescription,
    kind: 'WebPage',
    updated: d.updated,
  };
}

/** Main navigation (header). */
export const NAV = [
  { href: '/designs', label: 'Designs' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/guides', label: 'Guides' },
] as const;

/** First path segments the marketing site uses (tests: all reserved in lib/slug.ts). */
export const MARKETING_SEGMENTS = [
  'designs', 'how-it-works', 'features', 'pricing', 'faq', 'guides', 'about', 'contact', 'privacy',
  'robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', 'marketing',
] as const;

/** "2026-10-14" -> "October 14, 2026" (US style, docs: no ambiguous dates). */
export function formatDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/** Display price: "$29.40". Placeholder stays visible as is. */
export function displayPrice(price: string, cfg: MarketingConfig = MARKETING): string {
  if (hasPlaceholder(price)) return price;
  return cfg.currency === 'USD' ? `$${price}` : `${price} ${cfg.currency}`;
}
