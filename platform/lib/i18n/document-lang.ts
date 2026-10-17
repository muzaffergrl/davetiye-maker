// G150: the language of the whole document (<html lang>) for the App Router pages. The root layout (app/layout.tsx)
// renders <html> through components/i18n/DocumentHtml.tsx, which asks this module:
//
//   sales site      the route says it: app/(marketing)/i18n/[lang]/… (the public /tr, /de/designs … rewritten by
//                   next.config.ts) → that language; app/(marketing)/(en)/… → en. Known while the page is prerendered,
//                   so the static HTML already carries <html lang="de">, and a language switch updates it.
//   admin           the shop's own Turkish screens → tr.
//   buyer screens   panel, /start, /my, /signin: the server picks the language per request (cookie bke_lang, else
//                   Accept-Language: lib/i18n/server.ts). The root layout cannot read it without making every page
//                   dynamic, so those pages render <DocumentLang lang={lang} />, which hands it over here once the page
//                   runs in the browser (the server's HTML says en until then; these pages are noindex).
//
// Couple websites (/<slug>) are not App Router pages: the theme engine writes their <html lang> itself (?lang=).

import { isLang, type Lang } from './langs.ts';

/** The shop's admin screens are in Turkish. */
export const ADMIN_LANG: Lang = 'tr';

/** The language a route decides by itself (from useSelectedLayoutSegments() of the root layout), or null. */
export function routeLang(segments: readonly string[]): Lang | null {
  if (segments[0] === '(marketing)') {
    const rest = segments.slice(1).filter((s) => !s.startsWith('('));
    return rest[0] === 'i18n' && isLang(rest[1]) ? rest[1] : 'en';
  }
  const path = segments.filter((s) => !s.startsWith('('));
  if (path[0] === 'admin') return ADMIN_LANG;
  return null;
}

// The buyer interface's language, as the current page reported it (null = none reported: English).
let uiLang: Lang | null = null;
const listeners = new Set<() => void>();

export function documentUiLang(): Lang | null {
  return uiLang;
}

export function setDocumentUiLang(lang: Lang | null): void {
  if (lang === uiLang) return;
  uiLang = lang;
  for (const fn of listeners) fn();
}

export function subscribeDocumentUiLang(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
