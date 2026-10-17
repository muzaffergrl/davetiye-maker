'use client';
// G150: <html lang> per route (lib/i18n/document-lang.ts). DocumentHtml is the <html> element of the root layout;
// DocumentLang tells it the buyer interface's language on pages whose language the server picks per request.

import { useSelectedLayoutSegments } from 'next/navigation';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { documentUiLang, routeLang, setDocumentUiLang, subscribeDocumentUiLang } from '../../lib/i18n/document-lang.ts';
import type { Lang } from '../../lib/i18n/langs.ts';

export function DocumentHtml({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const ui = useSyncExternalStore(subscribeDocumentUiLang, documentUiLang, () => null);
  return <html lang={routeLang(segments) ?? ui ?? 'en'}>{children}</html>;
}

/** Sets <html lang> to the language this page is shown in (until the page is left). Renders nothing. */
export function DocumentLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    setDocumentUiLang(lang);
    return () => setDocumentUiLang(null);
  }, [lang]);
  return null;
}
