// G144: the translator of the buyer's interface (panel, /start, sign-in). The server page picks the language (cookie
// PANEL_LANG_COOKIE, else the browser's Accept-Language), loads only that dictionary (lib/i18n/dicts.ts) and hands it to
// the root client component, which calls useUiLocale(lang, dict) before anything renders: server and browser then render
// the same words (no hydration mismatch). Module state is set at the top of the root's render, which React runs in
// one go with its children (no Suspense inside the panel), so two requests never mix languages.

import { makeTranslator, type Dict, type Translator, type Vars } from './translate.ts';
import { isLang, type Lang } from './langs.ts';

export { msg } from './translate.ts';

/** Cookie of the buyer's interface language (panel, /start; the sales site keeps it in the address). */
export const UI_LANG_COOKIE = 'bke_lang';

let current: Translator = makeTranslator('en', null);

export function setUiLocale(lang: Lang, dict: Dict | null | undefined): void {
  if (current.lang !== lang || lang === 'en' || dict) current = makeTranslator(lang, dict);
}

export const t = (en: string, vars?: Vars): string => current.t(en, vars);
export const tn = (n: number, one: string, other: string, vars?: Vars): string => current.tn(n, one, other, vars);
export const uiLang = (): Lang => current.lang;

/** Saves the choice (one year) and reloads, so the server renders the page in the new language. */
export function chooseUiLang(lang: Lang): void {
  if (!isLang(lang)) return;
  document.cookie = `${UI_LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  window.location.reload();
}
