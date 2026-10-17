// G144: the translator. Keys are the English texts themselves (gettext style), so code reads naturally, a new text works
// at once in English, and a missing translation shows English. Placeholders: "{name}" (t('Hello {name}', {name})).
// Plurals: tn(n, 'one reply', '{n} replies') → the dictionary holds the pair joined by "|" ("{n} yanıt|{n} yanıt").
// tests/i18n.test.ts scans the source for t(…) / tn(…) / msg(…) literals and reports keys a dictionary lacks.

import { LANG_TAGS, type Lang } from './langs.ts';

export type Dict = Readonly<Record<string, string>>;
export type Vars = Readonly<Record<string, string | number>>;

/** Marks a text for translation where it is defined (module constants); translate it with t() where it is shown. */
export const msg = <T extends string>(text: T): T => text;

export function interpolate(text: string, vars?: Vars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (Object.hasOwn(vars, k) ? String(vars[k]) : m));
}

export interface Translator {
  lang: Lang;
  t: (en: string, vars?: Vars) => string;
  tn: (n: number, one: string, other: string, vars?: Vars) => string;
}

export function makeTranslator(lang: Lang, dict: Dict | null | undefined): Translator {
  const d = lang === 'en' ? null : dict ?? null;
  const rules = new Intl.PluralRules(LANG_TAGS[lang]);
  const t = (en: string, vars?: Vars) => interpolate((d && d[en]) || en, vars);
  const tn = (n: number, one: string, other: string, vars?: Vars) => {
    const pair = d?.[`${one}|${other}`];
    const [o, m] = pair ? pair.split('|') : [one, other];
    const form = rules.select(n) === 'one' ? o : (m ?? o);
    return interpolate(form, { n, ...vars });
  };
  return { lang, t, tn };
}
