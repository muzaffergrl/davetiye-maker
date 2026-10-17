'use client';
// G141: the media of a design card. The sealed screen (server-rendered `children`) is the card; the REAL opening
// recording plays over it on hover (fine pointer) or after a tap on ▶ (any screen). The video element is only created
// on the first play (nothing is downloaded before), it pauses and rewinds when the pointer leaves, and with
// prefers-reduced-motion hover never plays it (the button still does: that is the visitor's own choice).
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { CardCopy } from '../../lib/marketing/showcase.ts';
import s from './marketing.module.css';

export interface CardVideo {
  file: string;
  poster: string;
  width: number;
  height: number;
}

/** G144: `copy` (play / stop) arrives translated from the server card. */
export function CardOpening({
  href,
  name,
  video,
  copy,
  children,
}: {
  href: string;
  name: string;
  video: CardVideo | null;
  copy: CardCopy;
  children: ReactNode;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const hoverOk = useRef(false);

  useEffect(() => {
    hoverOk.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => setPlaying(false));
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [playing, mounted]);

  const start = () => {
    setMounted(true);
    setPlaying(true);
  };

  return (
    <div
      className={s.cardMediaWrap}
      data-playing={playing || undefined}
      onPointerEnter={(e) => {
        if (video && e.pointerType === 'mouse' && hoverOk.current) start();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse' && hoverOk.current) setPlaying(false);
      }}
    >
      <a href={href} className={s.designCardMedia} aria-hidden tabIndex={-1} data-fx-tilt>
        {children}
        {video && mounted ? (
          <video
            ref={ref}
            className={s.cardVideo}
            src={video.file}
            poster={video.poster}
            width={video.width}
            height={video.height}
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : null}
      </a>
      {video ? (
        <button
          type="button"
          className={s.cardPlay}
          aria-pressed={playing}
          onClick={() => (playing ? setPlaying(false) : start())}
          data-card-play
        >
          {playing ? <Pause aria-hidden size={16} strokeWidth={2} /> : <Play aria-hidden size={16} strokeWidth={2} />}
          <span className={s.visuallyHidden}>
            {playing ? copy.stop : copy.play}: {name}
          </span>
        </button>
      ) : null}
    </div>
  );
}
