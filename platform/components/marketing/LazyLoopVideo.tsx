'use client';
// G141: a LoopVideo that first renders only its poster as a lazy <img> and creates the <video> once the box is near the
// screen (rootMargin). For the home page's openings reel: six clips would otherwise fetch ~180 KB of posters on the
// first load (a <video poster> is never lazy). The box keeps its size and the picture is the same poster.
import { useEffect, useRef, useState } from 'react';
import { LoopVideo } from './LoopVideo.tsx';
import s from './marketing.module.css';

export function LazyLoopVideo(props: { src: string; poster: string; width: number; height: number; label: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return setNear(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (near) return <LoopVideo {...props} />;
  return <img ref={ref} className={s.loopVideo} src={props.poster} width={props.width} height={props.height} alt={props.label} loading="lazy" decoding="async" />;
}
