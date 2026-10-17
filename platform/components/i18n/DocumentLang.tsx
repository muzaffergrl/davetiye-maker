'use client';
// G150: <html lang> per route (lib/i18n/document-lang.ts). DocumentHtml is the <html> element of a root layout
// (G152: components/i18n/RootDocument.tsx); DocumentLang tells it the buyer interface's language when it changes in the
// browser (the server's HTML already has the language the page was rendered in).

import { useSelectedLayoutSegments } from 'next/navigation';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { documentUiLang, routeLang, setDocumentUiLang, subscribeDocumentUiLang } from '../../lib/i18n/document-lang.ts';
import type { Lang } from '../../lib/i18n/langs.ts';

/**
 * `scope`: the route group of the root layout this <html> belongs to (G152: segments are relative to that layout; the
 * sales site passes "(marketing)"). `fallback`: the language the server picked for this request (buyer screens).
 */
export function DocumentHtml({ children, scope, fallback = 'en' }: { children: ReactNode; scope?: string; fallback?: Lang }) {
  const segments = useSelectedLayoutSegments();
  const ui = useSyncExternalStore(subscribeDocumentUiLang, documentUiLang, () => null);
  return <html lang={routeLang(scope ? [scope, ...segments] : segments) ?? ui ?? fallback}>{children}</html>;
}

/** Sets <html lang> to the language this page is shown in (until the page is left). Renders nothing. */
export function DocumentLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    setDocumentUiLang(lang);
    return () => setDocumentUiLang(null);
  }, [lang]);
  return null;
}
