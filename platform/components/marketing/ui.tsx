// Server components of the marketing site (G061). No client JavaScript here: links, <details>, images, JSON-LD.
// G144: components with text of their own take the page's `m` (lib/marketing/i18n.ts; English when left out).
import { ArrowRight, Check, Minus } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Design } from '../../lib/marketing/designs.ts';
import { enMarket, type Market } from '../../lib/marketing/i18n.ts';
import type { Block, Inline } from '../../lib/marketing/markdown.ts';
import { parseInline } from '../../lib/marketing/markdown.ts';
import { realEtsyUrl } from '../../lib/marketing/placeholders.ts';
import { jsonLdString, type JsonLdNode } from '../../lib/marketing/schema.ts';
import { formatDay } from '../../lib/marketing/site.ts';
import { largest, srcSet, type ScreenFile } from './media.ts';
import s from './marketing.module.css';

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

export function Container({ children, narrow, className }: { children: ReactNode; narrow?: boolean; className?: string }) {
  return <div className={cx(s.container, narrow && s.narrow, className)}>{children}</div>;
}

export function Section({
  children,
  band,
  id,
  labelledBy,
  className,
}: {
  children: ReactNode;
  band?: boolean;
  id?: string;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(s.section, band && s.band, className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={s.eyebrow}>{children}</p>;
}

export function JsonLd({ data }: { data: JsonLdNode }) {
  // Content is our own config/copy; "<" is escaped so the JSON can never close the script element.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}

/** A REAL product screen (theme or panel screenshot) with rounded corners — no drawn device frame (docs/14 §13.1). */
export function Screen({
  file,
  alt,
  sizes = '(min-width: 1024px) 300px, 70vw',
  priority,
  className,
}: {
  file: ScreenFile;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cx(s.screen, className)}>
      <img
        src={largest(file)}
        srcSet={srcSet(file)}
        sizes={sizes}
        width={file.width}
        height={file.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
      />
    </div>
  );
}

/**
 * Etsy button (docs/14 §7.2): the listing's Share & Save link from config, no UTM, same tab. While the link is a
 * placeholder the button says "Coming soon on Etsy" and is not a link (no broken link is ever published).
 */
export function EtsyButton({
  design,
  placement,
  variant = 'primary',
  withPrice,
  className,
  m = enMarket,
}: {
  design: Pick<Design, 'id' | 'etsyListingUrl' | 'price'>;
  placement: string;
  variant?: 'primary' | 'secondary';
  withPrice?: string | null;
  className?: string;
  m?: Market;
}) {
  const { t } = m;
  const url = realEtsyUrl(design.etsyListingUrl);
  const cls = cx(s.btn, variant === 'secondary' && s.btnSecondary, className);
  if (!url) {
    return (
      <span className={cx(cls, s.btnDisabled)} aria-disabled="true" data-etsy-pending={design.id}>
        {t('Coming soon on Etsy')}
      </span>
    );
  }
  return (
    <a className={cls} href={url} data-track="etsy_click" data-track-design={design.id} data-track-placement={placement}>
      {withPrice ? t('Buy on Etsy — {price}', { price: withPrice }) : t('Buy on Etsy')}
    </a>
  );
}

export function TextLink({ href, children, track, className }: { href: string; children: ReactNode; track?: string; className?: string }) {
  return (
    <a href={href} className={cx(s.textLink, className)} data-track={track}>
      {children}
      <ArrowRight aria-hidden size={16} strokeWidth={1.75} />
    </a>
  );
}

export function Breadcrumbs({ items, m = enMarket }: { items: Array<{ name: string; href: string }>; m?: Market }) {
  const { t } = m;
  return (
    <nav aria-label={t('Breadcrumb')} className={s.breadcrumbs}>
      <ol>
        {items.map((it, i) => (
          <li key={it.href}>
            {i < items.length - 1 ? <a href={it.href}>{it.name}</a> : <span aria-current="page">{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function LastUpdated({ day, label, m = enMarket }: { day: string; label?: string; m?: Market }) {
  const { t } = m;
  return (
    <p className={s.updated}>
      {label ?? t('Last updated')} <time dateTime={day}>{formatDay(day, m.lang)}</time>
    </p>
  );
}

/**
 * Check list (G066 comps): `solid` = gold disc with an aubergine check (design pages, pricing), `soft` = paper disc with
 * a gold check (home). The mark is decorative; the text carries the meaning. `tone="no"` = a dash on a paper disc.
 */
export function CheckList({
  items,
  tone = 'yes',
  variant = 'solid',
}: {
  items: readonly ReactNode[];
  tone?: 'yes' | 'no';
  variant?: 'solid' | 'soft';
}) {
  return (
    <ul className={cx(s.checkList, tone === 'no' && s.checkListNo, tone === 'yes' && variant === 'soft' && s.checkListSoft)}>
      {items.map((it, i) => (
        <li key={i}>
          <span className={s.checkMark} aria-hidden>
            {tone === 'yes' ? <Check size={15} strokeWidth={3} /> : <Minus size={15} strokeWidth={2.5} />}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Markdown subset → React (guides, FAQ answers) ---------------- */

/** `m.href` keeps a site link in the page language ("](/faq)" → /tr/faq on a Turkish page). */
function inline(nodes: Inline[], key = 'i', m: Market = enMarket): ReactNode[] {
  return nodes.map((n, i) => {
    const k = `${key}.${i}`;
    if (n.t === 'text') return n.v;
    if (n.t === 'code') return <code key={k}>{n.v}</code>;
    if (n.t === 'strong') return <strong key={k}>{inline(n.c, k, m)}</strong>;
    if (n.t === 'em') return <em key={k}>{inline(n.c, k, m)}</em>;
    const external = /^https?:\/\//.test(n.href);
    return (
      <a key={k} href={m.href(n.href)} {...(external ? { rel: 'noopener' } : {})}>
        {inline(n.c, k, m)}
      </a>
    );
  });
}

export function InlineMd({ text, m = enMarket }: { text: string; m?: Market }) {
  return <>{inline(parseInline(text), 'i', m)}</>;
}

export function Prose({ blocks, className, m = enMarket }: { blocks: Block[]; className?: string; m?: Market }) {
  const { t } = m;
  const inline_ = (nodes: Inline[]) => inline(nodes, 'i', m);
  return (
    <div className={cx(s.prose, className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return (
              <h2 key={i} id={b.id}>
                {inline_(b.c)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} id={b.id}>
                {inline_(b.c)}
              </h3>
            );
          case 'p':
            return <p key={i}>{inline_(b.c)}</p>;
          case 'ul':
            return (
              <ul key={i} className={b.checklist ? s.mdChecklist : undefined}>
                {b.items.map((it, j) => (
                  <li key={j}>{inline_(it)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{inline_(it)}</li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <aside key={i} className={s.callout}>
                {b.c.map((p, j) => (
                  <p key={j}>{inline_(p)}</p>
                ))}
              </aside>
            );
          case 'table':
            return (
              <div key={i} className={s.tableWrap} role="region" aria-label={t('Table')} tabIndex={0}>
                <table>
                  <thead>
                    <tr>
                      {b.head.map((c, j) => (
                        <th key={j} scope="col">
                          {inline_(c)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) =>
                          k === 0 ? (
                            <th key={k} scope="row">
                              {inline_(c)}
                            </th>
                          ) : (
                            <td key={k}>{inline_(c)}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'hr':
            return <hr key={i} />;
        }
      })}
    </div>
  );
}

export function FaqList({
  items,
  headingLevel = 3,
  m = enMarket,
}: {
  items: Array<{ id: string; q: string; a: string }>;
  headingLevel?: 2 | 3;
  m?: Market;
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className={s.faqList}>
      {items.map((it) => (
        <details key={it.id} id={it.id} className={s.faqItem}>
          <summary>
            <H className={s.faqQ}>{it.q}</H>
          </summary>
          <div className={s.faqA}>
            <p>
              <InlineMd text={it.a} m={m} />
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function Swatches({ palette, m = enMarket }: { palette: Array<{ name: string; hex: string }>; m?: Market }) {
  const { t } = m;
  return (
    <ul className={s.swatches} aria-label={t('Colors')}>
      {palette.map((c) => (
        <li key={c.hex}>
          <span className={s.swatch} style={{ background: c.hex }} aria-hidden />
          {t(c.name)}
        </li>
      ))}
    </ul>
  );
}
