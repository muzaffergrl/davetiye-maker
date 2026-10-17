'use client';
// G144: the language switcher in the header. A <details> list of links (works without JavaScript), each language in its
// own name (LANG_NAMES) with hreflang and lang. The server renders links to each language's home page (the layout does
// not know the page); once in the browser, the links point to the same page in each language (/tr/designs → /designs,
// /de/designs …). The current language is marked aria-current. Esc and a click outside close the list.
import { Check, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../../lib/i18n/langs.ts';
import { basePath, href } from '../../lib/marketing/lang-path.ts';
import s from './marketing.module.css';

export function LangSwitch({
  current,
  langs,
  label,
  className,
}: {
  current: Lang;
  langs: Array<{ lang: Lang; name: string }>;
  /** "Language" in the page language. */
  label: string;
  className?: string;
}) {
  const [path, setPath] = useState('/');
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setPath(basePath(window.location.pathname));
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !el.open) return;
      el.open = false;
      el.querySelector('summary')?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (el.open && e.target instanceof Node && !el.contains(e.target)) el.open = false;
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <details ref={ref} className={className ? `${s.lang} ${className}` : s.lang} data-lang-switch="">
      <summary className={s.langButton}>
        <Globe aria-hidden size={18} strokeWidth={1.75} />
        <span aria-hidden>{current.toUpperCase()}</span>
        <span className={s.visuallyHidden}>
          {label}: {langs.find((l) => l.lang === current)?.name}
        </span>
      </summary>
      <ul className={s.langList} aria-label={label}>
        {langs.map((l) => (
          <li key={l.lang}>
            <a
              href={href(l.lang, path)}
              hrefLang={l.lang}
              lang={l.lang}
              aria-current={l.lang === current ? 'true' : undefined}
              data-track="lang_switch"
              data-track-lang={l.lang}
            >
              {l.name}
              {l.lang === current ? <Check aria-hidden size={16} strokeWidth={2} /> : null}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
