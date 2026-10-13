// Site slugs: /<slug> is the couple's public address.

/** First path segments the platform uses (or may use) itself; never available as a site slug. */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  // platform routes
  'edit', 'start', 'api', '_next', 'themes', 'media', 'preview', 'demo', 'panel', 'admin',
  // pages a site or the platform may add later
  'index', 'home', 'story', 'details', 'rsvp', 'about', 'help', 'support', 'contact', 'faq',
  'terms', 'privacy', 'legal', 'pricing', 'blog', 'shop', 'login', 'logout', 'signin', 'signup',
  'register', 'account', 'dashboard', 'settings', 'static', 'public', 'assets', 'app', 'www',
  'mail', 'status', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'manifest.json',
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
