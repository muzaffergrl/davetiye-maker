// G144 (K45 item 3): the sales site in five languages. English stays at the root URLs (/, /designs, /guides/<slug> …);
// Turkish, Spanish, German and French live under a two-letter prefix (/tr, /es/designs …). next.config.ts rewrites
// /<lang>/… to app/(marketing)/i18n/[lang]/… (a dynamic [lang] folder at the root would clash with the couple sites at
// /[slug]; slugs have ≥ 3 characters, so two-letter prefixes are free).
//
// Texts: keys are the English text (lib/i18n/README.md). Server components build one `Market` per page language and
// pass it down; client components get the translated strings as props (never the dictionaries of other languages).
// Shared lib code (facts.ts, faq.ts, site.ts …) takes a `t` parameter that defaults to English (`enT`), so every
// existing caller (llms.txt, tests) keeps its English output byte for byte.

import { loadDict } from '../i18n/dicts.ts';
import { DEFAULT_LANG, isLang, LANG_NAMES, LANG_TAGS, LANGS, type Lang } from '../i18n/langs.ts';
import { interpolate, makeTranslator, msg, type Vars } from '../i18n/translate.ts';
import { href } from './lang-path.ts';

export { msg, LANGS, LANG_NAMES, LANG_TAGS, DEFAULT_LANG, isLang, type Lang, type Vars };
export { basePath, href, PREFIXED_LANGS } from './lang-path.ts';

export type T = (en: string, vars?: Vars) => string;
export type TN = (n: number, one: string, other: string, vars?: Vars) => string;

/** English: the key is the text (placeholders filled). */
export const enT: T = (en, vars) => interpolate(en, vars);

export interface Market {
  lang: Lang;
  /** BCP 47 tag (Intl, og:locale). */
  tag: string;
  t: T;
  tn: TN;
  /** A marketing path in this language (see href). */
  href: (path: string) => string;
}

export function makeMarket(lang: Lang, dict: Readonly<Record<string, string>> | null): Market {
  const tr = makeTranslator(lang, dict);
  return { lang, tag: LANG_TAGS[lang], t: tr.t, tn: tr.tn, href: (p) => href(lang, p) };
}

/** English, synchronous (shared components default to it). */
export const enMarket: Market = makeMarket(DEFAULT_LANG, null);

/** The translator of a page language: only that language's 'market' dictionary is loaded. */
export async function market(lang: Lang): Promise<Market> {
  if (lang === DEFAULT_LANG) return enMarket;
  return makeMarket(lang, await loadDict('market', lang));
}

/** The opening objects named in copy ("after the {thing} opens"); openingObject() returns these English words. */
export const OPENING_THINGS: Readonly<Record<string, string>> = {
  envelope: msg('envelope'),
  gatefold: msg('gatefold'),
  pouch: msg('pouch'),
  wallet: msg('wallet'),
  book: msg('book'),
  sleeve: msg('sleeve'),
  door: msg('door'),
};

/** The opening object in the page language. */
export function thingIn(t: T, thing: string): string {
  return OPENING_THINGS[thing] ? t(OPENING_THINGS[thing]) : thing;
}
