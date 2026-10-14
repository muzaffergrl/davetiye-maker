// A design card (home strip, /designs, related designs): the REAL envelope screen, name, style line, colors,
// "Open live demo" (dialog; plain link without JS) and "View design".
import { Play } from 'lucide-react';
import type { Design } from '../../lib/marketing/designs.ts';
import { demoPath } from '../../lib/marketing/designs.ts';
import { realPrice } from '../../lib/marketing/placeholders.ts';
import { displayPrice } from '../../lib/marketing/site.ts';
import { designScreen } from './media.ts';
import s from './marketing.module.css';
import { Screen, TextLink } from './ui.tsx';

export function DesignCard({ design, placement, headingLevel = 3 }: { design: Design; placement: string; headingLevel?: 2 | 3 }) {
  const env = designScreen(design.id, 'envelope');
  const home = designScreen(design.id, 'home');
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const price = realPrice(design.price);
  return (
    <article className={s.designCard}>
      <div className={s.designCardInner}>
      <a href={`/designs/${design.id}`} className={s.designCardMedia} aria-hidden tabIndex={-1}>
        {env ? <Screen file={env} alt="" sizes="(min-width: 1024px) 260px, (min-width: 600px) 40vw, 70vw" className={s.cardScreen} /> : null}
        {home ? <Screen file={home} alt="" sizes="(min-width: 1024px) 260px, 40vw" className={`${s.cardScreen} ${s.cardScreenHover}`} /> : null}
      </a>
      <div className={s.designCardBody}>
        <H className={s.designCardTitle}>
          <a href={`/designs/${design.id}`}>{design.name}</a>
        </H>
        <p className={s.designCardStyle}>{design.copy.style}.</p>
        <ul className={s.miniSwatches} aria-label={`${design.name} colors`}>
          {design.copy.palette.slice(0, 3).map((c) => (
            <li key={c.hex} title={c.name}>
              <span style={{ background: c.hex }} aria-hidden />
              <span className={s.visuallyHidden}>{c.name}</span>
            </li>
          ))}
        </ul>
        {price ? <p className={s.designCardPrice}>{displayPrice(price)} on Etsy</p> : null}
        <div className={s.cardActions}>
          <a className={`${s.btn} ${s.btnSecondary} ${s.btnSmall}`} href={demoPath(design.id)} data-demo={design.id} data-demo-placement={placement}>
            <Play aria-hidden size={16} strokeWidth={1.75} />
            Open live demo
          </a>
          <TextLink href={`/designs/${design.id}`}>View design</TextLink>
        </div>
      </div>
      </div>
    </article>
  );
}
