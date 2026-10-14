'use client';
// Modal sheet (bottom sheet on phones, centred dialog on wide screens), rendered at the end of <body>.
// While it is open the panel behind it is `inert` (no focus, no Tab, hidden from screen readers);
// Escape, the close button and the phone's back button / gesture close it; focus moves into the sheet
// (first [data-autofocus], else the first control) and back to the opener on close.

import { X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './panel.module.css';

const HISTORY_MARK = 'panel-sheet';
let openSheets = 0;

function setBackgroundInert(on: boolean) {
  const root = document.querySelector<HTMLElement>('[data-panel-root]');
  if (root) root.inert = on;
}

export function Sheet({
  title,
  onClose,
  children,
  wide = false,
  closeLabel = 'Close',
  testId,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  closeLabel?: string;
  testId?: string;
  footer?: ReactNode;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(document.body);
  }, []);

  useEffect(() => {
    if (!host) return;
    const before = document.activeElement as HTMLElement | null;
    const first =
      ref.current?.querySelector<HTMLElement>('[data-autofocus]') ??
      ref.current?.querySelector<HTMLElement>('.' + styles.sheetBody + ' button, .' + styles.sheetBody + ' a[href], .' + styles.sheetBody + ' input, .' + styles.sheetBody + ' select, .' + styles.sheetBody + ' textarea') ??
      ref.current?.querySelector<HTMLElement>('button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    openSheets += 1;
    setBackgroundInert(true);
    // Android back button / gesture: closes the sheet instead of leaving the view.
    let pushed = false;
    let popped = false;
    const mark = `${Date.now()}-${Math.random()}`;
    try {
      window.history.pushState({ ...(window.history.state ?? {}), [HISTORY_MARK]: mark }, '');
      pushed = true;
    } catch {
      /* no history: Close and Escape still work */
    }
    const onPop = () => {
      popped = true;
      onCloseRef.current();
    };
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
      document.body.style.overflow = overflow;
      openSheets -= 1;
      if (!openSheets) setBackgroundInert(false);
      before?.focus?.();
      // Closed with a button / Escape: drop our history entry again (deferred, so a quick re-open in development's
      // strict mode keeps working).
      window.setTimeout(() => {
        // Only our own entry: a sheet opened right after this one has its own entry on top.
        if (pushed && !popped && (window.history.state as Record<string, unknown> | null)?.[HISTORY_MARK] === mark) window.history.back();
      }, 0);
    };
  }, [host]);

  if (!host) return null;
  return createPortal(
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={wide ? `${styles.sheet} ${styles.sheetWide}` : styles.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId} data-testid={testId}>
        <div className={styles.sheetGrip} aria-hidden="true" />
        <div className={styles.sheetHeader}>
          <h2 id={titleId} className={styles.sheetTitle}>
            {title}
          </h2>
          <button type="button" className={styles.sheetClose} onClick={onClose} aria-label={closeLabel} title={closeLabel}>
            <X size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.sheetBody}>{children}</div>
        {footer ? <div className={styles.sheetFooter}>{footer}</div> : null}
      </div>
    </div>,
    host,
  );
}
