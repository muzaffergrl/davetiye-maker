'use client';
// Live preview of the draft: the real site route with ?preview=<preview key>, 390 px wide.
// Reloads after every save. On phones it opens as a full-screen sheet; on wide screens it sits
// next to the form. The iframe loads only once it is first shown on a phone.

import { useEffect, useRef, useState } from 'react';
import { PAGE_LABELS, previewPath } from '../../lib/panel/model.ts';
import styles from './panel.module.css';

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
  const [page, setPage] = useState(pages[0] ?? 'index');
  const [mounted, setMounted] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
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

  useEffect(() => {
    if (!open || wide) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, wide, onClose]);

  const className = [styles.previewDock, open && !wide ? styles.previewDockOpen : ''].filter(Boolean).join(' ');
  return (
    <div className={className} role={wide ? 'region' : 'dialog'} aria-modal={!wide && open ? true : undefined} aria-label="Preview of your website" data-preview>
      <div className={styles.previewHeader}>
        <div>
          <p className={styles.previewTitle}>Preview</p>
          <p className={styles.hint}>Your latest changes. Guests see them after you publish.</p>
        </div>
        {!wide ? (
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
      <div className={styles.previewTabs} role="tablist" aria-label="Page">
        {pages.map((p) => (
          <button key={p} type="button" role="tab" aria-selected={p === page} className={styles.previewTab} onClick={() => setPage(p)}>
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
