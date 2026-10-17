// G144: the page language of app/(marketing)/i18n/[lang]/… (rewritten from /tr/…, /es/… by next.config.ts). Any other
// value is a 404. English pages live in app/(marketing)/(en)/ and use enMarket.
import { notFound } from 'next/navigation';
import { isLang, market, PREFIXED_LANGS, type Lang, type Market } from '../../../lib/marketing/i18n.ts';

export type LangParams = Promise<{ lang: string }>;

export function prefixedLang(raw: string): Exclude<Lang, 'en'> {
  if (!isLang(raw) || raw === 'en') notFound();
  return raw as Exclude<Lang, 'en'>;
}

/** The page's translator, from the route params. */
export async function pageMarket(params: LangParams): Promise<Market> {
  return market(prefixedLang((await params).lang));
}

/** generateStaticParams of the language layout: tr, es, de, fr. */
export function langStaticParams(): Array<{ lang: string }> {
  return PREFIXED_LANGS.map((lang) => ({ lang }));
}
