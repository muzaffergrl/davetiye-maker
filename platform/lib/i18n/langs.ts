// G144 (K45 item 3): the five languages of the sales site, the buyer's panel and the couple's website.
// Fixed texts are translated by us ahead of time (lib/i18n/dict/<namespace>/<lang>.json; no translation service at run
// time); a missing translation falls back to English. Pure module: the panel, the sales site and the engine import it.

export const LANGS = ['en', 'tr', 'es', 'de', 'fr'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

/** Each language in its own name (the language switchers list these). */
export const LANG_NAMES: Readonly<Record<Lang, string>> = {
  en: 'English',
  tr: 'Türkçe',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
};

/** BCP 47 tag for Intl (dates, numbers, plurals) and hreflang. */
export const LANG_TAGS: Readonly<Record<Lang, string>> = {
  en: 'en-US',
  tr: 'tr-TR',
  es: 'es-ES',
  de: 'de-DE',
  fr: 'fr-FR',
};

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (LANGS as readonly string[]).includes(v);
}

/** "tr-TR" / "de" / "pt-BR" → a language of ours or null. */
export function langOf(tag: unknown): Lang | null {
  if (typeof tag !== 'string') return null;
  const base = tag.trim().toLowerCase().split(/[-_]/)[0];
  return isLang(base) ? base : null;
}

/**
 * The first language of the visitor's list (Accept-Language header or navigator.languages) that `allowed` holds; null
 * when none matches. Header weights (q=) are honoured.
 */
export function negotiateLang(preferred: string | readonly string[] | null | undefined, allowed: readonly Lang[] = LANGS): Lang | null {
  if (!preferred) return null;
  const list: string[] = Array.isArray(preferred)
    ? [...preferred]
    : String(preferred)
        .split(',')
        .map((part, i) => {
          const [tag, ...params] = part.trim().split(';');
          const q = params.map((p) => /^\s*q=([\d.]+)/.exec(p)).find(Boolean);
          return { tag, q: q ? Number(q[1]) : 1, i };
        })
        .filter((x) => x.tag && x.q > 0)
        .sort((a, b) => b.q - a.q || a.i - b.i)
        .map((x) => x.tag);
  for (const tag of list) {
    const lang = langOf(tag);
    if (lang && allowed.includes(lang)) return lang;
  }
  return null;
}
