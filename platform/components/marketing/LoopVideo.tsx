'use client';
// Silent loop of the REAL opening recording (docs/14 §9.6): preload="none" + poster; plays only while visible;
// with prefers-reduced-motion it never autoplays and shows controls instead.
import { useEffect, useRef, useState } from 'react';
import s from './marketing.module.css';

export function LoopVideo({ src, poster, width, height, label }: { src: string; poster: string; width: number; height: number; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    if (mq.matches || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={s.loopVideo}
      src={src}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      controls={reduced}
      aria-label={label}
    />
  );
}
