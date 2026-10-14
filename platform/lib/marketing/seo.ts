// Page metadata for the marketing site (docs/14 §6, §9.13): title, description, absolute canonical, Open Graph and
// Twitter cards. Robots (noindex until launch) is set once by app/(marketing)/layout.tsx.

import type { Metadata } from 'next';
import { MARKETING, type MarketingConfig } from './config.ts';
import { real } from './placeholders.ts';
import { absUrl, type PageEntry } from './site.ts';

/** Default share image until the GPT hero composite exists (docs/14 §9.13): a real theme share image (artwork only, no text). */
export const DEFAULT_OG = {
  url: '/themes/blush-garden-rose/img/og-1200x630.jpg',
  width: 1200,
  height: 630,
  alt: 'A blush pink wedding envelope tied with a ribbon bow among painted peonies and garden roses',
};

export interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export function robotsFor(cfg: MarketingConfig = MARKETING): Metadata['robots'] {
  // Not launched: noindex, but links may be followed (the pages are reachable for previews and tests).
  return cfg.launched ? { index: true, follow: true } : { index: false, follow: true };
}

export function pageMetadata(
  page: Pick<PageEntry, 'path' | 'title' | 'description'>,
  opts: { image?: OgImage; type?: 'website' | 'article'; published?: string; modified?: string } = {},
  cfg: MarketingConfig = MARKETING,
): Metadata {
  const image = opts.image ?? DEFAULT_OG;
  const url = absUrl(page.path, cfg);
  const siteName = real(cfg.brand.name) ?? undefined;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: opts.type ?? 'website',
      url,
      title: page.title,
      description: page.description,
      siteName,
      locale: 'en_US',
      images: [{ url: absUrl(image.url, cfg), width: image.width, height: image.height, alt: image.alt }],
      ...(opts.type === 'article' ? { publishedTime: opts.published, modifiedTime: opts.modified } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [{ url: absUrl(image.url, cfg), alt: image.alt }],
    },
  };
}
