// G144: the language of the printed invitation and the website PDF = the website's main language (content.languages),
// with the site dictionary of that language. Server only (all four site dictionaries are imported statically here).

import { siteLangs } from '../i18n/content.ts';
import de from '../i18n/dict/site/de.ts';
import es from '../i18n/dict/site/es.ts';
import fr from '../i18n/dict/site/fr.ts';
import tr from '../i18n/dict/site/tr.ts';
import type { Lang } from '../i18n/langs.ts';
import type { Dict } from '../i18n/translate.ts';

const DICTS: Record<Exclude<Lang, 'en'>, Dict> = { tr, es, de, fr };

export function printLocale(content: unknown): { lang: Lang; dict: Dict | null } {
  const lang = siteLangs(content).primary;
  return { lang, dict: lang === 'en' ? null : DICTS[lang] };
}
