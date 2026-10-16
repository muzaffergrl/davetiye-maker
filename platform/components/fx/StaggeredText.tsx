// Text that staggers in word by word (G089, K31). Adapted from React Bits Pro "Staggered Text" (registry item
// staggered-text-css, https://pro.reactbits.dev/docs/components/staggered-text).
// License: React Bits Pro, single-developer license of this project's owner (https://pro.reactbits.dev/license). Allowed:
// use and modify inside our own product. Not allowed: publishing this source (public repo, gist, starter kit) or giving
// it out as a reusable component. Keep this repository private.
//
// G089 changes to the original: motion/react and the IntersectionObserver are gone. The stagger is a CSS animation
// (fx.module.css), so this is a server component with no client JavaScript: the full text is in the HTML, and with
// prefers-reduced-motion (or without CSS animations) every word is simply there. Only the words move; the line box is
// laid out from the first frame, so nothing shifts (CLS 0).
import { Fragment, type CSSProperties } from 'react';
import { splitWords } from './fx.ts';
import s from './fx.module.css';

export function StaggeredText({
  text,
  className,
  step = 70,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  /** Delay between two words, ms (the original's `delay`). */
  step?: number;
  /** Delay before the first word, ms. */
  startDelay?: number;
}) {
  const words = splitWords(text);
  const style = { '--fx-step': `${step}ms`, '--fx-start': `${startDelay}ms` } as CSSProperties;
  return (
    <span className={className ? `${s.stagger} ${className}` : s.stagger} style={style} data-fx="stagger">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className={s.word} style={{ '--fx-i': i } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
