// G144: the buyer interface's language on the server (panel, /start, sign-in): the bke_lang cookie, else the
// browser's Accept-Language, else English. Returns only that language's dictionary (it travels to the client as a prop).

import { cookies, headers } from 'next/headers';
import { UI_LANG_COOKIE } from './client.ts';
import { loadDict } from './dicts.ts';
import { DEFAULT_LANG, isLang, negotiateLang, type Lang } from './langs.ts';
import type { Dict } from './translate.ts';

export interface UiLocale {
  lang: Lang;
  dict: Dict;
}

export async function uiLocale(): Promise<UiLocale> {
  const fromCookie = (await cookies()).get(UI_LANG_COOKIE)?.value;
  const lang = isLang(fromCookie) ? fromCookie : (negotiateLang((await headers()).get('accept-language')) ?? DEFAULT_LANG);
  return { lang, dict: await loadDict('panel', lang) };
}
