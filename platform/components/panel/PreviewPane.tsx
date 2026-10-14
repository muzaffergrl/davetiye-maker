'use client';
// Live preview of the draft: the real site route with ?preview=<panel preview token>, 390 px wide.
// Reloads once saving has settled (PREVIEW_SETTLE_MS). On phones it opens as a full-screen modal; on wide screens it sits
// next to the editor in a phone-sized frame. The iframe loads only once it is first shown.
//
// Phone modal: focus moves to Close (and back to the opener afterwards), the page behind does not
// scroll and is `inert` (Panel.tsx), and opening it adds a history entry, so the Android back
// button / gesture closes the preview instead of leaving the editor.
// Only pages guests can open with the current content get a tab (Panel passes them filtered).

import { RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PAGE_LABELS, previewPath } from '../../lib/panel/model.ts';
import { cx } from './ui.tsx';
import styles from './panel.module.css';

const HISTORY_MARK = 'panel-preview';
const SLOW_MS = 10_000;
/** The preview reloads once saving has been quiet this long (G060-fix: not on every autosave while typing). */
export const PREVIEW_SETTLE_MS = 2500;

/** `version` once it has stopped changing for PREVIEW_SETTLE_MS (the first value at once). */
export function useSettledVersion(version: number, ms: number = PREVIEW_SETTLE_MS): number {
  const [settled, setSettled] = useState(version);
  useEffect(() => {
    if (version === settled) return;
    const t = setTimeout(() => setSettled(version), ms);
    return () => clearTimeout(t);
  }, [version, settled, ms]);
  return settled;
}

export function PreviewPane({
  slug,
  previewToken,
  pages,
  version: rawVersion,
  open,
  wide,
  page: wanted,
  thanks = false,
  onThanksOff,
  onClose,
}: {
  slug: string;
  previewToken: string;
  pages: string[];
  version: number;
  open: boolean;
  wide: boolean;
  /** Page to show (e.g. "story" when opened from Our Story). */
  page?: string | null;
  /** G075: show the thank-you version (?thanks=1), whatever the mode and the date. */
  thanks?: boolean;
  onThanksOff?: () => void;
  onClose: () => void;
}) {
  const version = useSettledVersion(rawVersion);
  const [chosen, setChosen] = useState(wanted ?? pages[0] ?? 'index');
  useEffect(() => {
    if (wanted) setChosen(wanted);
  }, [wanted]);
  // A page that was turned off (e.g. Our Story) falls back to the first page.
  const page = pages.includes(chosen) ? chosen : (pages[0] ?? 'index');
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const modalRef = useRef(false);
  modalRef.current = open && !wide;
  const shown = wide || open;
  const src = `${previewPath(slug, page, previewToken)}${thanks ? '&thanks=1' : ''}`;

  useEffect(() => {
    if (shown) setMounted(true);
  }, [shown]);

  // Skeleton until the first load; after 10 s a "Try again".
  useEffect(() => {
    if (!mounted || loaded) return;
    const t = setTimeout(() => setSlow(true), SLOW_MS);
    return () => clearTimeout(t);
  }, [mounted, loaded, page, reloadKey]);

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
      window.history.pushState({ ...(window.history.state ?? {}), [HISTORY_MARK]: true }, '');
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
          {thanks ? (
            <p className={cx(styles.previewSub, styles.previewThanks)} data-preview-thanks>
              <span>Thank-you page — what guests see after the wedding.</span>
              {onThanksOff ? (
                <button type="button" className={styles.inlineLink} onClick={onThanksOff}>
                  Show the invitation
                </button>
              ) : null}
            </p>
          ) : (
            <p className={styles.previewSub}>Draft — guests see changes after you publish.</p>
          )}
        </div>
        {!wide ? (
          <button ref={closeRef} type="button" className={styles.sheetClose} onClick={onClose} data-close-preview aria-label="Close preview" title="Close preview">
            <X size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div className={styles.previewTabs} role="tablist" aria-label="Page">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={p === page}
            className={styles.previewTab}
            onClick={() => {
              setLoaded(false);
              setSlow(false);
              setChosen(p);
            }}
          >
            {PAGE_LABELS[p] ?? p}
          </button>
        ))}
      </div>
      <div className={styles.previewFrameWrap}>
        <div className={styles.phone}>
          {mounted ? (
            <iframe
              ref={frameRef}
              key={`${page}-${reloadKey}`}
              src={src}
              title="Preview of your website"
              className={styles.previewFrame}
              referrerPolicy="no-referrer"
              onLoad={() => {
                setLoaded(true);
                setSlow(false);
              }}
            />
          ) : null}
          {!loaded ? (
            <div className={styles.previewSkeleton} aria-hidden={!slow}>
              {slow ? (
                <>
                  <p>The preview is taking longer than usual.</p>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btn_secondary} ${styles.btnSmall}`}
                    onClick={() => {
                      setSlow(false);
                      setReloadKey((n) => n + 1);
                    }}
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    <span>Try again</span>
                  </button>
                </>
              ) : (
                <p className={styles.skeletonText}>Loading preview…</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
