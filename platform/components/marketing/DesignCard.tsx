// A design card (home strip, /designs, related designs; G066 comp u1_designs_390): the REAL envelope screen (the home
// screen fades in on hover), the name (link to the design page), the style line on wide cards, the Etsy price once it
// is real, and "Live demo" (opens the demo dialog; a plain link to the demo without JavaScript).
import { ArrowRight } from 'lucide-react';
import type { Design } from '../../lib/marketing/designs.ts';
import { demoPath } from '../../lib/marketing/designs.ts';
import { realPrice } from '../../lib/marketing/placeholders.ts';
import { displayPrice } from '../../lib/marketing/site.ts';
import { designScreen } from './media.ts';
import s from './marketing.module.css';
import { Screen } from './ui.tsx';

export function DesignCard({
  design,
  placement,
  headingLevel = 3,
  styles,
}: {
  design: Design;
  placement: string;
  headingLevel?: 2 | 3;
  /** G121: the design's styles for the /designs filter (data-styles; CSS hides the cards of other styles). */
  styles?: readonly string[];
}) {
  const env = designScreen(design.id, 'envelope');
  const home = designScreen(design.id, 'home');
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const price = realPrice(design.price);
  const sizes = '(min-width: 1024px) 220px, (min-width: 600px) 30vw, 34vw';
  return (
    <article className={s.designCard} data-styles={styles?.length ? styles.join(' ') : undefined}>
      <a href={`/designs/${design.id}`} className={s.designCardMedia} aria-hidden tabIndex={-1}>
        {env ? <Screen file={env} alt="" sizes={sizes} className={s.cardScreen} /> : null}
        {home ? <Screen file={home} alt="" sizes={sizes} className={`${s.cardScreen} ${s.cardScreenHover}`} /> : null}
      </a>
      <H className={s.designCardTitle}>
        <a href={`/designs/${design.id}`}>{design.name}</a>
      </H>
      {/* The style line shows on wider cards only (container query); phones get the comp's name-and-demo card. */}
      <p className={s.designCardStyle}>{design.copy.style}.</p>
      {price ? <p className={s.designCardPrice}>{displayPrice(price)} on Etsy</p> : null}
      <a className={s.cardDemo} href={demoPath(design.id)} data-demo={design.id} data-demo-placement={placement}>
        Live demo<span className={s.visuallyHidden}>: {design.name}</span>
        <ArrowRight aria-hidden size={16} strokeWidth={1.75} />
      </a>
    </article>
  );
}
