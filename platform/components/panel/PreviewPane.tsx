'use client';
// Live preview of the draft: the real site route with ?preview=<preview key>, 390 px wide.
// Reloads after every save. On phones it opens as a full-screen modal; on wide screens it sits
// next to the form. The iframe loads only once it is first shown on a phone.
//
// Phone modal: focus moves to Close (and back to the Preview button afterwards), the page behind
// does not scroll (the form and bar are `inert`, see Panel.tsx), and opening it adds a history
// entry, so the Android back button / gesture closes the preview instead of leaving the editor.
// Only pages guests can open with the current content get a tab (Panel passes them filtered).

import { useEffect, useRef, useState } from 'react';
import { PAGE_LABELS, previewPath } from '../../lib/panel/model.ts';
import styles from './panel.module.css';

const HISTORY_MARK = 'panel-preview';

export function PreviewPane({
  slug,
  previewKey,
  pages,
  version,
  open,
  wide,
  onClose,
}: {
  slug: string;
  previewKey: string;
  pages: string[];
  version: number;
  open: boolean;
  wide: boolean;
  onClose: () => void;
}) {
  const [chosen, setChosen] = useState(pages[0] ?? 'index');
  // A page that was turned off (e.g. Our Story) falls back to the first page.
  const page = pages.includes(chosen) ? chosen : (pages[0] ?? 'index');
  const [mounted, setMounted] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const modalRef = useRef(false);
  modalRef.current = open && !wide;
  const shown = wide || open;
  const src = previewPath(slug, page, previewKey);

  useEffect(() => {
    if (shown) setMounted(true);
  }, [shown]);

  // Reload after each save; keeps the page the buyer navigated to inside the preview.
  const lastVersion = useRef(version);
  useEffect(() => {
    if (version === lastVersion.current) return;
    lastVersion.current = version;
    const frame = frameRef.current;
    if (!frame) return;
    try {
      frame.contentWindow?.location.reload();
    } catch {
      frame.src = src;
    }
  }, [version, src]);

  // Phone modal: Escape, focus, scroll lock and the back button.
  useEffect(() => {
    if (!open || wide) return;
    const before = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    document.addEventListener('keydown', onKey);
    let pushed = false;
    let popped = false;
    try {
      window.history.pushState({ [HISTORY_MARK]: true }, '');
      pushed = true;
    } catch {
      /* history not available: Close and Escape still work */
    }
    const onPop = () => {
      popped = true;
      onCloseRef.current();
    };
    window.addEventListener('popstate', onPop);
    const startPath = new URL(src, window.location.href).pathname;
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
      document.body.style.overflow = overflow;
      before?.focus?.();
      // Closed with the Close button / Escape: drop our history entry again, unless the preview navigated
      // inside (those steps share the joint history; going back would step the frame instead). Deferred, so
      // a re-run of this effect (React strict mode in development) keeps the modal open.
      window.setTimeout(() => {
        if (!pushed || popped || modalRef.current) return;
        let navigated = true;
        try {
          navigated = frameRef.current?.contentWindow?.location.pathname !== startPath;
        } catch {
          /* unreadable: treat as navigated */
        }
        if (!navigated && (window.history.state as Record<string, unknown> | null)?.[HISTORY_MARK]) window.history.back();
      }, 0);
    };
    // `src` is read once per opening on purpose (the page tab may change while it is open).
  }, [open, wide]);

  const className = [styles.previewDock, open && !wide ? styles.previewDockOpen : ''].filter(Boolean).join(' ');
  return (
    <div className={className} role={wide ? 'region' : 'dialog'} aria-modal={!wide && open ? true : undefined} aria-label="Preview of your website" data-preview>
      <div className={styles.previewHeader}>
        <div>
          <p className={styles.previewTitle}>Preview</p>
          <p className={styles.hint}>Your latest changes. Guests see them after you publish.</p>
        </div>
        {!wide ? (
          <button ref={closeRef} type="button" className={styles.closeButton} onClick={onClose} data-close-preview>
            Close
          </button>
        ) : null}
      </div>
      <div className={styles.previewTabs} role="tablist" aria-label="Page">
        {pages.map((p) => (
          <button key={p} type="button" role="tab" aria-selected={p === page} className={styles.previewTab} onClick={() => setChosen(p)}>
            {PAGE_LABELS[p] ?? p}
          </button>
        ))}
      </div>
      <div className={styles.previewFrameWrap}>
        {mounted ? (
          <iframe ref={frameRef} key={page} src={src} title="Preview of your website" className={styles.previewFrame} referrerPolicy="no-referrer" />
        ) : null}
      </div>
    </div>
  );
}
