// Site slugs: /<slug> is the couple's public address.

/** First path segments the platform uses (or may use) itself; never available as a site slug. */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  // platform routes
  'edit', 'start', 'api', '_next', 'themes', 'media', 'preview', 'demo', 'panel', 'admin', 'my',
  // pages a site or the platform may add later
  'index', 'home', 'story', 'details', 'rsvp', 'about', 'help', 'support', 'contact', 'faq',
  'terms', 'privacy', 'legal', 'pricing', 'blog', 'shop', 'login', 'logout', 'signin', 'signup',
  'register', 'account', 'dashboard', 'settings', 'static', 'public', 'assets', 'app', 'www',
  'mail', 'status', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'manifest.json',
  // marketing site (G061, docs/14 §5.4): app/(marketing)/ pages share the root with couple sites, and a static
  // segment wins over /[slug] — a site with one of these names would never open. tests/marketing-slug.test.ts
  // checks that every marketing route's first segment is in this list.
  'designs', 'design', 'guides', 'guide', 'how-it-works', 'features', 'examples', 'gallery', 'reviews', 'compare',
  'checkout', 'buy', 'cart', 'order', 'orders', 'gift', 'search', 'feed', 'rss', 'sitemap', 'llms', 'llms.txt',
  'llms-full.txt', 'opengraph-image', 'twitter-image', 'icon', 'apple-icon', 'save-the-date', 'wedding-websites',
  'refund', 'refunds', 'cookies', 'accessibility', 'marketing', 'not-found',
  // brand kit served from public/brand/ (GM02: favicons, app icons)
  'brand',
]);

/** 3-48 chars, lowercase letters, digits and single hyphens; no leading/trailing hyphen. */
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){1,46}[a-z0-9]$/;

export function isValidSlugFormat(slug: unknown): slug is string {
  return typeof slug === 'string' && SLUG_RE.test(slug);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

/** Usable as a new site's slug. */
export function isAvailableSlugShape(slug: unknown): slug is string {
  return isValidSlugFormat(slug) && !isReservedSlug(slug);
}

/** "Clara & Julian" -> "clara-and-julian"; accents removed. May return "" for unusable input. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '');
}
