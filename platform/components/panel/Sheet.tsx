'use client';
// Modal sheet (bottom sheet on phones, centred dialog on wide screens).
// Escape and the close button call onClose; focus moves into the sheet and back on close.

import { useEffect, useId, useRef, type ReactNode } from 'react';
import styles from './panel.module.css';

export function Sheet({
  title,
  onClose,
  children,
  wide = false,
  closeLabel = 'Close',
  testId,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  closeLabel?: string;
  testId?: string;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const first = ref.current?.querySelector<HTMLElement>('[data-autofocus], button, a[href], input, select, textarea');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      before?.focus?.();
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={wide ? `${styles.sheet} ${styles.sheetWide}` : styles.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId} data-testid={testId}>
        <div className={styles.sheetHeader}>
          <h2 id={titleId} className={styles.sheetTitle}>
            {title}
          </h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            {closeLabel}
          </button>
        </div>
        <div className={styles.sheetBody}>{children}</div>
      </div>
    </div>
  );
}
