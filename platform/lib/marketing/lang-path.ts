// G144: the language prefixes of the sales site's addresses. Pure (no dictionaries): the header's language switcher
// (a client component) uses it too. lib/marketing/i18n.ts re-exports it.

import { DEFAULT_LANG, isLang, LANGS, type Lang } from '../i18n/langs.ts';

/** Languages with a URL prefix (every language but English). */
export const PREFIXED_LANGS = LANGS.filter((l): l is Exclude<Lang, 'en'> => l !== DEFAULT_LANG);

/** First path segments of the localized marketing pages ('' = home). Others (/start, /my, /themes …) stay unprefixed. */
const LOCALIZED_SEGMENTS = new Set(['', 'designs', 'how-it-works', 'features', 'pricing', 'faq', 'guides', 'about', 'contact', 'privacy', 'terms', 'kvkk']);

/**
 * The address of a marketing path in `lang`: href('tr', '/designs') → '/tr/designs', href('tr', '/') → '/tr',
 * href('de', '/#edit') → '/de#edit'. Links that are not marketing pages (/start, /my, /admin, /start/demo/…, /themes/…,
 * external URLs, mailto:, #anchors) are returned unchanged, as is everything in English.
 */
export function href(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG || !path.startsWith('/') || path.startsWith('//')) return path;
  const m = /^\/([^/?#]*)([^?#]*)([?#].*)?$/.exec(path);
  if (!m || !LOCALIZED_SEGMENTS.has(m[1])) return path;
  const rest = `/${m[1]}${m[2]}`;
  return `/${lang}${rest === '/' ? '' : rest}${m[3] ?? ''}`;
}

/**
 * The English path of a localized one: '/tr/designs' → '/designs', '/tr' → '/'. Also the rewrite target the browser
 * may show for a direct visit ('/i18n/tr/designs').
 */
export function basePath(path: string): string {
  const m = /^(?:\/i18n)?\/([a-z]{2})(\/.*)?$/.exec(path);
  return m && isLang(m[1]) && m[1] !== DEFAULT_LANG ? (m[2] ?? '/') : path;
}

