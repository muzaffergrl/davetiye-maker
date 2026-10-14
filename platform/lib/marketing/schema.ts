// JSON-LD builders (docs/14 §8). Only types Google still supports or that carry meaning for other engines are used:
// Organization, WebSite, WebPage (+ CollectionPage / AboutPage / ContactPage / FAQPage), ItemList, Product (product
// snippet: the purchase happens on Etsy), VideoObject, Article, BreadcrumbList.
// Rules: a field whose value is a placeholder is LEFT OUT (never "[BRAND]" in JSON-LD); Offer only with a real price
// and a real Etsy link; no aggregateRating/review (Etsy reviews must not be marked up here); no SearchAction.

import assets from './assets.json' with { type: 'json' };
import { MARKETING, type MarketingConfig } from './config.ts';
import type { Design } from './designs.ts';
import type { FaqItem } from './faq.ts';
import { plainAnswer } from './faq.ts';
import type { Guide } from './guides.ts';
import { hasPlaceholder, real, realEtsyUrl, realPrice } from './placeholders.ts';
import { absUrl, siteOrigin, type PageEntry } from './site.ts';

export type JsonLdNode = Record<string, unknown>;

const orgId = (cfg: MarketingConfig) => `${siteOrigin(cfg)}/#org`;
const siteId = (cfg: MarketingConfig) => `${siteOrigin(cfg)}/#website`;

/** Drops undefined/null/empty-array fields (placeholders are mapped to null by the callers). */
function clean<T extends JsonLdNode>(node: T): T {
  const out: JsonLdNode = {};
  for (const [k, v] of Object.entries(node)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

export function organization(cfg: MarketingConfig = MARKETING): JsonLdNode {
  const email = real(cfg.support.email);
  const name = real(cfg.brand.name);
  // Entity matching: the Etsy shop name is the brand without spaces ("BKEStudio" for "BKE Studio"), so it is named as
  // an alternate name of the same organization (only when real and different from the brand name).
  const shopName = real(cfg.etsy.shopName);
  const sameAs = [cfg.etsy.shopUrl, cfg.social.pinterest, cfg.social.instagram, cfg.social.tiktok]
    .map((u) => (u ? real(u) : null))
    .filter((u): u is string => !!u);
  return clean({
    '@type': 'Organization',
    '@id': orgId(cfg),
    name,
    alternateName: name && shopName && shopName !== name ? shopName : null,
    url: absUrl('/', cfg),
    description: real(cfg.brand.shortDescription),
    email,
    logo: cfg.brand.logo ? absUrl(cfg.brand.logo, cfg) : null,
    sameAs,
    contactPoint: email
      ? { '@type': 'ContactPoint', contactType: 'customer support', email, availableLanguage: 'English' }
      : null,
  });
}

export function website(cfg: MarketingConfig = MARKETING): JsonLdNode {
  return clean({
    '@type': 'WebSite',
    '@id': siteId(cfg),
    name: real(cfg.brand.name),
    url: absUrl('/', cfg),
    inLanguage: 'en',
    publisher: { '@id': orgId(cfg) },
  });
}

export function webPage(page: PageEntry, cfg: MarketingConfig = MARKETING, extra: JsonLdNode = {}): JsonLdNode {
  return clean({
    '@type': page.kind,
    '@id': `${absUrl(page.path, cfg)}#webpage`,
    url: absUrl(page.path, cfg),
    name: real(page.title) ?? stripPlaceholderSuffix(page.title),
    description: real(page.description),
    inLanguage: 'en',
    isPartOf: { '@id': siteId(cfg) },
    about: page.path === '/' || page.kind === 'AboutPage' ? { '@id': orgId(cfg) } : null,
    dateModified: page.updated,
    ...extra,
  });
}

/** "Wedding Website FAQ | [BRAND]" -> "Wedding Website FAQ"; null when the whole title is a placeholder phrase. */
function stripPlaceholderSuffix(title: string): string | null {
  const t = title.replace(/\s*\|\s*\[[^\]]+\]\s*$/, '').trim();
  return real(t);
}

export function breadcrumbs(items: Array<{ name: string; path: string }>, cfg: MarketingConfig = MARKETING): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: real(it.name) ?? it.name.replace(/\[[^\]]+\]/g, '').trim() ?? 'Home',
      item: absUrl(it.path, cfg),
    })),
  };
}

export function itemList(urls: Array<{ path: string; name: string }>, cfg: MarketingConfig = MARKETING): JsonLdNode {
  return {
    '@type': 'ItemList',
    itemListElement: urls.map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: absUrl(u.path, cfg), name: u.name })),
  };
}

export function videoObject(design: Design, cfg: MarketingConfig = MARKETING): JsonLdNode | null {
  const v = (assets.designs as Record<string, { opening: { file: string; poster: string; seconds: number } | null }>)[design.id]?.opening;
  if (!v) return null;
  return {
    '@type': 'VideoObject',
    '@id': `${absUrl(`/designs/${design.id}`, cfg)}#video`,
    name: `${design.name} wedding website: envelope opening`,
    description: design.copy.opening,
    thumbnailUrl: [absUrl(v.poster, cfg)],
    contentUrl: absUrl(v.file, cfg),
    uploadDate: design.updated,
    duration: `PT${v.seconds}S`,
  };
}

/** Product snippet (docs/14 §8.3). Offer only when price AND Etsy listing link are real. */
export function product(design: Design, cfg: MarketingConfig = MARKETING): JsonLdNode {
  const screens = (assets.designs as Record<string, { screens: Record<string, { files: Record<string, string> }> }>)[design.id]?.screens ?? {};
  const images = ['envelope', 'home', 'story', 'rsvp']
    .map((k) => screens[k]?.files['640'])
    .filter((f): f is string => !!f)
    .map((f) => absUrl(f, cfg));
  const price = realPrice(design.price);
  const url = realEtsyUrl(design.etsyListingUrl);
  const video = videoObject(design, cfg);
  return clean({
    '@type': 'Product',
    '@id': `${absUrl(`/designs/${design.id}`, cfg)}#product`,
    name: `${design.name} Wedding Website`,
    description: design.copy.intro,
    sku: design.id,
    brand: real(cfg.brand.name) ? { '@id': orgId(cfg) } : null,
    category: 'Wedding website',
    image: images,
    subjectOf: video ? { '@id': video['@id'] } : null,
    offers:
      price && url
        ? { '@type': 'Offer', price, priceCurrency: cfg.currency, availability: 'https://schema.org/InStock', url }
        : null,
  });
}

export function article(guide: Guide, cfg: MarketingConfig = MARKETING, image?: string): JsonLdNode {
  const brand = real(cfg.brand.name);
  return clean({
    '@type': 'Article',
    '@id': `${absUrl(guide.path, cfg)}#article`,
    headline: guide.title,
    description: guide.description,
    image: image ? [absUrl(image, cfg)] : null,
    datePublished: guide.published,
    dateModified: guide.updated,
    author: brand
      ? { '@type': 'Organization', name: `${brand} Editorial`, url: absUrl('/about', cfg) }
      : { '@id': orgId(cfg) },
    publisher: { '@id': orgId(cfg) },
    mainEntityOfPage: absUrl(guide.path, cfg),
    inLanguage: 'en',
    wordCount: guide.words,
  });
}

/**
 * FAQPage main entity (optional for Google since May 2026; kept identical to the visible text). Questions whose
 * answer still holds a placeholder ([REFUND POLICY] …) are left out until the policy is decided.
 */
export function faqEntities(items: FaqItem[]): JsonLdNode[] {
  return items.filter((it) => !hasPlaceholder(it.q) && !hasPlaceholder(it.a)).map((it) => ({
    '@type': 'Question',
    name: it.q,
    acceptedAnswer: { '@type': 'Answer', text: plainAnswer(it.a) },
  }));
}

/** One <script type="application/ld+json"> payload. */
export function graph(...nodes: Array<JsonLdNode | null>): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes.filter((n): n is JsonLdNode => !!n) };
}

/** Safe JSON for a <script> element: "<" escaped so "</script>" can never close it. */
export function jsonLdString(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
