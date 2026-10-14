// Shared fixtures for the marketing tests (G061).
import { MARKETING, type MarketingConfig } from '../lib/marketing/config.ts';
import { hasPlaceholder } from '../lib/marketing/placeholders.ts';

/** A config with every decision filled in (fictional values; never used outside tests). */
export function readyConfig(over: Partial<MarketingConfig> = {}): MarketingConfig {
  const base: MarketingConfig = structuredClone(MARKETING);
  return {
    ...base,
    launched: true,
    brand: { ...base.brand, name: 'Test Brand', shortDescription: 'Test Brand makes wedding websites that open like a real invitation. Buy a design on Etsy, edit it on your phone and collect RSVPs online.' },
    domain: 'example.com',
    siteUrl: 'https://example.com',
    support: { email: 'hello@example.com', responseTime: '24 hours' },
    etsy: { shopUrl: 'https://www.etsy.com/shop/ExampleShop', shopName: 'ExampleShop' },
    policies: { refund: 'Refund text', lostLink: 'Lost link text', extension: 'Extension text', deletion: 'Deletion text', retention: 'Retention text' },
    verified: { editRights: true, archive: true, realDevices: false, privacyText: true, orderCheck: true },
    designs: base.designs.map((d) => ({ ...d, price: '29.40', etsyListingUrl: `https://www.etsy.com/listing/1234567890/${d.id}?ref=share` })),
    ...over,
  };
}

/** Required properties per type (Google's documented required fields + what docs/14 §8 promises). */
export const REQUIRED: Record<string, string[]> = {
  Organization: ['@id', 'url'],
  WebSite: ['@id', 'url'],
  WebPage: ['@id', 'url'],
  CollectionPage: ['@id', 'url'],
  AboutPage: ['@id', 'url'],
  ContactPage: ['@id', 'url'],
  FAQPage: ['@id', 'url', 'mainEntity'],
  BreadcrumbList: ['itemListElement'],
  ItemList: ['itemListElement'],
  Product: ['name', 'image', 'description'],
  Offer: ['price', 'priceCurrency', 'url', 'availability'],
  VideoObject: ['name', 'description', 'thumbnailUrl', 'uploadDate', 'contentUrl'],
  Article: ['headline', 'datePublished', 'dateModified', 'author', 'publisher'],
  Question: ['name', 'acceptedAnswer'],
  Answer: ['text'],
  ListItem: ['position'],
  ContactPoint: ['contactType', 'email'],
};

/** Walks a JSON-LD value: every typed node has its required fields, nothing holds a placeholder, no ratings. */
export function validateJsonLd(value: unknown, problems: string[] = [], where = '$'): string[] {
  if (Array.isArray(value)) value.forEach((v, i) => validateJsonLd(v, problems, `${where}[${i}]`));
  else if (value && typeof value === 'object') {
    const node = value as Record<string, unknown>;
    const type = node['@type'];
    if (typeof type === 'string') {
      for (const k of REQUIRED[type] ?? []) if (node[k] === undefined || node[k] === '') problems.push(`${where} ${type} lacks ${k}`);
      if (!(type in REQUIRED)) problems.push(`${where} unexpected type ${type}`);
      if (type === 'ListItem' && node.item === undefined && node.url === undefined) problems.push(`${where} ListItem lacks item/url`);
    }
    for (const k of ['aggregateRating', 'review', 'reviews']) if (k in node) problems.push(`${where} has ${k} (not allowed: docs/14 §8.3)`);
    for (const [k, v] of Object.entries(node)) validateJsonLd(v, problems, `${where}.${k}`);
  } else if (typeof value === 'string') {
    if (hasPlaceholder(value)) problems.push(`${where} holds a placeholder: ${value}`);
    if (/^https?:\/\//.test(value)) {
      try {
        new URL(value);
      } catch {
        problems.push(`${where} bad URL ${value}`);
      }
    }
  }
  return problems;
}
