'use client';
// Sales site: the "Chat with us" button (bottom right) and the chat window it opens. The chat itself (SupportChat.tsx)
// is downloaded on the first tap, so the page's first load carries only this button. A phone gets a bottom sheet, a
// wide screen a small window; Escape and the close button close it and focus returns to the button.

import { MessageCircle, RotateCcw, X } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ChatCopy, ChatLinks } from './copy.ts';
import s from './support.module.css';

const SupportChat = lazy(() => import('./SupportChat.tsx').then((m) => ({ default: m.SupportChat })));

export function SupportLauncher({ copy, links }: { copy: ChatCopy; links: ChatLinks }) {
  const [open, setOpen] = useState(false);
  const [reset, setReset] = useState<(() => void) | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const returnFocus = useRef(false);

  const close = useCallback(() => {
    returnFocus.current = true;
    setOpen(false);
  }, []);

  // The button is hidden while the window is open: focus it once it is back.
  useEffect(() => {
    if (!open && returnFocus.current) {
      returnFocus.current = false;
      buttonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // A link inside the window (?chat=open or #chat on any page) opens it too.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('chat') === 'open' || window.location.hash === '#chat') setOpen(true);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[data-open-chat]');
      if (a) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const onNewChat = useCallback((fn: (() => void) | null) => setReset(() => fn), []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={s.launcher}
        aria-expanded={open}
        aria-controls="support-window"
        onClick={() => (open ? close() : setOpen(true))}
        data-support-launcher=""
        hidden={open}
      >
        <MessageCircle size={22} aria-hidden="true" />
        <span className={s.launcherLabel}>{copy.open}</span>
      </button>
      {open ? <div className={s.backdrop} onClick={close} aria-hidden="true" /> : null}
      {open ? (
        <div id="support-window" className={s.window} role="dialog" aria-modal="false" aria-labelledby="support-title" data-support-window="">
          <header className={s.head}>
            <span className={s.avatar} aria-hidden="true">
              <MessageCircle size={18} />
            </span>
            <div className={s.headText}>
              <h2 id="support-title" className={s.title}>
                {copy.title}
              </h2>
              <p className={s.subtitle}>
                <span className={s.dot} aria-hidden="true" />
                {copy.subtitle}
              </p>
            </div>
            {reset ? (
              <button type="button" className={s.iconBtn} onClick={reset} aria-label={copy.newChat} title={copy.newChat}>
                <RotateCcw size={18} aria-hidden="true" />
              </button>
            ) : null}
            <button type="button" className={s.iconBtn} onClick={close} aria-label={copy.close} title={copy.close} data-support-close="">
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <Suspense fallback={<div className={s.loading} aria-busy="true" />}>
            <SupportChat copy={copy} links={links} context="market" storageKey="bke-support-market" onNewChat={onNewChat} />
          </Suspense>
        </div>
      ) : null}
    </>
  );
}
