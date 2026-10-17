// G144: dictionary loaders. Only the requested language's file is loaded (dynamic import = its own chunk on the client;
// on the server only the language a page asks for is read).

import type { Dict } from './translate.ts';
import type { Lang } from './langs.ts';

export type Namespace = 'panel' | 'site' | 'market';

type Loader = () => Promise<{ default: Dict }>;
const LOADERS: Record<Namespace, Record<Exclude<Lang, 'en'>, Loader>> = {
  panel: {
    tr: () => import('./dict/panel/tr.ts'),
    es: () => import('./dict/panel/es.ts'),
    de: () => import('./dict/panel/de.ts'),
    fr: () => import('./dict/panel/fr.ts'),
  },
  site: {
    tr: () => import('./dict/site/tr.ts'),
    es: () => import('./dict/site/es.ts'),
    de: () => import('./dict/site/de.ts'),
    fr: () => import('./dict/site/fr.ts'),
  },
  market: {
    tr: () => import('./dict/market/tr.ts'),
    es: () => import('./dict/market/es.ts'),
    de: () => import('./dict/market/de.ts'),
    fr: () => import('./dict/market/fr.ts'),
  },
};

const cache = new Map<string, Dict>();

/** The dictionary of `ns` in `lang` ({} for English: the keys are English). */
export async function loadDict(ns: Namespace, lang: Lang): Promise<Dict> {
  if (lang === 'en') return {};
  const id = `${ns}:${lang}`;
  const hit = cache.get(id);
  if (hit) return hit;
  const dict = (await LOADERS[ns][lang]()).default;
  cache.set(id, dict);
  return dict;
}
