'use client';
// G141: "See how editing works" — the REAL panel screens in a phone, step by step (lib/marketing/showcase.ts EDIT_TOUR).
// While the tour is on screen it moves on by itself every STEP_MS; any step button, previous/next or pause stops that
// for good. prefers-reduced-motion: no auto-advance, no cross-fade. Images are lazy (the tour sits below the fold).
// Without JavaScript the first step and the full list of steps are shown.
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { interpolate } from '../../lib/i18n/translate.ts';
import type { TourCopy } from '../../lib/marketing/showcase.ts';
import s from './marketing.module.css';

export interface TourStepData {
  label: string;
  title: string;
  text: string;
  alt: string;
  img: { src: string; srcSet: string; width: number; height: number };
}

const STEP_MS = 3800;

/** G144: `steps` and `copy` arrive translated (tourSteps / tourCopy in showcase-data.ts and lib/marketing/showcase.ts). */
export function EditTour({ steps, copy: T }: { steps: TourStepData[]; copy: TourCopy }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAuto(true);
    const el = root.current?.firstElementChild; // the phone: the tour runs while most of it is on screen
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || stopped || !visible) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [auto, stopped, visible, i, steps.length]);

  // keep the active step button in view in the sideways strip (phones) without scrolling the page
  useEffect(() => {
    const list = chips.current;
    const b = list?.children[i] as HTMLElement | undefined;
    if (!list || !b || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: b.offsetLeft - (list.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
  }, [i]);

  const go = (n: number) => {
    setStopped(true);
    setI((n + steps.length) % steps.length);
  };
  const step = steps[i];
  const running = auto && !stopped;

  return (
    <div ref={root} className={s.tour} data-tour data-running={running && visible ? '' : undefined}>
      <div className={s.tourPhone}>
        <div className={s.tourScreen}>
          {steps.map((st, n) => (
            <img
              key={st.label}
              src={st.img.src}
              srcSet={st.img.srcSet}
              sizes="(min-width: 1024px) 300px, 64vw"
              width={st.img.width}
              height={st.img.height}
              alt={n === i ? st.alt : ''}
              aria-hidden={n === i ? undefined : true}
              loading="lazy"
              decoding="async"
              data-active={n === i || undefined}
            />
          ))}
        </div>
        {running ? <span className={s.tourProgress} key={`${i}-${visible}`} aria-hidden /> : null}
      </div>
      <div className={s.tourSide}>
        <div className={s.tourCaption} aria-live={running ? 'off' : 'polite'}>
          <p className={s.tourCount}>{interpolate(T.stepOf, { i: i + 1, n: steps.length })}</p>
          <h3 className={s.tourTitle}>{step.title}</h3>
          <p className={s.tourText}>{step.text}</p>
        </div>
        <div className={s.tourControls}>
          <button type="button" className={s.iconButton} onClick={() => go(i - 1)} aria-label={T.prev}>
            <ChevronLeft aria-hidden size={22} strokeWidth={1.75} />
          </button>
          {auto ? (
            <button type="button" className={s.iconButton} onClick={() => setStopped((x) => !x)} aria-label={running ? T.pause : T.play}>
              {running ? <Pause aria-hidden size={20} strokeWidth={1.75} /> : <Play aria-hidden size={20} strokeWidth={1.75} />}
            </button>
          ) : null}
          <button type="button" className={s.iconButton} onClick={() => go(i + 1)} aria-label={T.next}>
            <ChevronRight aria-hidden size={22} strokeWidth={1.75} />
          </button>
        </div>
        <ol ref={chips} className={s.tourSteps} aria-label={T.stepsLabel} data-scroll-x>
          {steps.map((st, n) => (
            <li key={st.label}>
              <button type="button" className={s.tourStep} aria-current={n === i ? 'step' : undefined} onClick={() => go(n)}>
                <span className={s.tourNum} aria-hidden>
                  {n + 1}
                </span>
                {st.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
