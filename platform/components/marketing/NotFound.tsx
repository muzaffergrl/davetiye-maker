'use client';
// 404 inside the marketing site (unknown design or guide). G144: not-found pages get no route params, so the language
// layout hands the 404 words of its language to a context (NotFoundCopyProvider) and app/(marketing)/i18n/[lang]/
// not-found.tsx reads them (NotFoundFromContext); English renders NotFoundView with notFoundCopy(enMarket) directly.
// Plain markup with the shared classes (the same as Section / Container / TextLink of ui.tsx).
import { ArrowRight } from 'lucide-react';
import { createContext, useContext, type ReactNode } from 'react';
import s from './marketing.module.css';

export interface NotFoundCopy {
  title: string;
  lead: string;
  links: Array<{ href: string; label: string }>;
  back: { href: string; label: string };
}

const Ctx = createContext<NotFoundCopy | null>(null);

export function NotFoundCopyProvider({ copy, children }: { copy: NotFoundCopy; children: ReactNode }) {
  return <Ctx.Provider value={copy}>{children}</Ctx.Provider>;
}

export function NotFoundView({ copy }: { copy: NotFoundCopy }) {
  return (
    <section className={`${s.section} ${s.pageHead}`}>
      <div className={`${s.container} ${s.narrow}`}>
        <h1 className={s.h1}>{copy.title}</h1>
        <p className={s.lead}>{copy.lead}</p>
        <ul className={s.linkList}>
          {copy.links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href={copy.back.href} className={s.textLink}>
          {copy.back.label}
          <ArrowRight aria-hidden size={16} strokeWidth={1.75} />
        </a>
      </div>
    </section>
  );
}

export function NotFoundFromContext({ fallback }: { fallback: NotFoundCopy }) {
  return <NotFoundView copy={useContext(Ctx) ?? fallback} />;
}
