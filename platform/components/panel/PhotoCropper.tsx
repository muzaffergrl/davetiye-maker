'use client';
// Crops a chosen photo to its slot's aspect ratio in the browser, then hands a JPEG to the upload.
// Drag to move, pinch / slider / mouse wheel / + - keys to zoom, arrow keys to move.
// The server re-encodes the upload again (lib/panel/photos.ts); this step keeps uploads small
// and lets the buyer choose the framing.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PanelPhotoSlot } from '../../lib/panel/model.ts';
import { Sheet } from './Sheet.tsx';
import styles from './panel.module.css';

/** Longest side of the cropped JPEG sent to the server. */
export const CROP_OUTPUT_MAX_EDGE = 2000;
/** Upload size target (Vercel functions accept request bodies up to 4.5 MB; a 2000 px JPEG is ~1 MB). */
export const CROP_OUTPUT_MAX_BYTES = 3.5 * 1024 * 1024;
const MAX_ZOOM = 4;

interface View {
  /** Point of the image (natural px) at the centre of the frame. */
  cx: number;
  cy: number;
  zoom: number;
}

function clampView(v: View, iw: number, ih: number, fw: number, fh: number): View {
  const zoom = Math.min(MAX_ZOOM, Math.max(1, v.zoom));
  const scale = Math.max(fw / iw, fh / ih) * zoom;
  const halfW = fw / 2 / scale;
  const halfH = fh / 2 / scale;
  return {
    zoom,
    cx: Math.min(iw - halfW, Math.max(halfW, v.cx)),
    cy: Math.min(ih - halfH, Math.max(halfH, v.cy)),
  };
}

export function PhotoCropper({
  file,
  slot,
  onCancel,
  onConfirm,
}: {
  file: File;
  slot: PanelPhotoSlot;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  // Decode the file (the browser applies EXIF orientation).
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    let alive = true;
    image.decoding = 'async';
    image.src = url;
    image
      .decode()
      .then(() => {
        if (!alive) return;
        if (!image.naturalWidth || !image.naturalHeight) throw new Error('empty');
        setImg(image);
      })
      .catch(() => alive && setError('This file could not be opened as a photo. Please choose a JPG or PNG photo.'));
    return () => {
      alive = false;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const ratio = slot.ratio ?? (img ? img.naturalWidth / img.naturalHeight : 1);

  // Frame size follows the layout.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [img]);

  const iw = img?.naturalWidth ?? 1;
  const ih = img?.naturalHeight ?? 1;
  const ready = Boolean(img && frame.w && frame.h);
  const current = ready ? clampView(view ?? { cx: iw / 2, cy: ih / 2, zoom: 1 }, iw, ih, frame.w, frame.h) : null;
  const scale = current ? Math.max(frame.w / iw, frame.h / ih) * current.zoom : 1;

  const update = useCallback(
    (fn: (v: View) => View) => {
      if (!img || !frame.w) return;
      setView((v) => clampView(fn(v ?? { cx: iw / 2, cy: ih / 2, zoom: 1 }), iw, ih, frame.w, frame.h));
    },
    [img, frame.w, frame.h, iw, ih],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: current?.zoom ?? 1 };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const start = pinch.current;
      update((v) => ({ ...v, zoom: start.zoom * (dist / Math.max(1, start.dist)) }));
      return;
    }
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    update((v) => ({ ...v, cx: v.cx - dx / scale, cy: v.cy - dy / scale }));
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 20 / scale;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      const [mx, my] = moves[e.key];
      update((v) => ({ ...v, cx: v.cx + mx, cy: v.cy + my }));
    } else if (e.key === '+' || e.key === '=') {
      update((v) => ({ ...v, zoom: v.zoom * 1.1 }));
    } else if (e.key === '-') {
      update((v) => ({ ...v, zoom: v.zoom / 1.1 }));
    }
  };
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      update((v) => ({ ...v, zoom: v.zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08) }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [update]);

  const confirm = () => {
    if (!img || !current) return;
    setBusy(true);
    const sw = frame.w / scale;
    const sh = frame.h / scale;
    const sx = current.cx - sw / 2;
    const sy = current.cy - sh / 2;
    const k = Math.min(1, CROP_OUTPUT_MAX_EDGE / Math.max(sw, sh));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sw * k));
    canvas.height = Math.max(1, Math.round(sh * k));
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setBusy(false);
      setError('This browser cannot prepare the photo. Please try another browser.');
      return;
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    // JPEG at 0.9; lower the quality if needed to stay well under serverless request limits.
    const encode = (quality: number) =>
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size > CROP_OUTPUT_MAX_BYTES && quality > 0.6) return encode(quality - 0.1);
          setBusy(false);
          if (blob) onConfirm(blob);
          else setError('The photo could not be prepared. Please try another one.');
        },
        'image/jpeg',
        quality,
      );
    encode(0.9);
  };

  return (
    <Sheet title={`Crop: ${slot.label}`} onClose={onCancel} closeLabel="Cancel" testId="cropper">
      {error ? (
        <p className={styles.issueError} role="alert">
          {error}
        </p>
      ) : (
        <>
          <p className={styles.hint}>Drag to move the photo. Pinch or use the slider to zoom.</p>
          <div className={styles.cropStage}>
            <div
              ref={frameRef}
              className={styles.cropFrame}
              // Height leaves room for the title, hint, zoom and buttons on short phones (375 × 553 Safari).
              style={{ aspectRatio: String(ratio), width: `min(100%, calc(max(160px, min(56dvh, 100dvh - 340px)) * ${ratio}))` }}
              tabIndex={0}
              role="group"
              aria-label="Photo framing. Use the arrow keys to move and plus or minus to zoom."
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              onKeyDown={onKeyDown}
            >
              {img && current ? (
                <img
                  src={img.src}
                  alt=""
                  draggable={false}
                  className={styles.cropImage}
                  style={{
                    width: iw,
                    height: ih,
                    transform: `translate(${frame.w / 2 - current.cx * scale}px, ${frame.h / 2 - current.cy * scale}px) scale(${scale})`,
                  }}
                />
              ) : (
                <span className={styles.photoEmpty}>Opening photo…</span>
              )}
            </div>
          </div>
          <label className={styles.label} htmlFor="crop-zoom">
            Zoom
          </label>
          <input
            id="crop-zoom"
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={current?.zoom ?? 1}
            disabled={!current}
            className={styles.range}
            onChange={(e) => update((v) => ({ ...v, zoom: Number(e.target.value) }))}
          />
        </>
      )}
      {/* Sticky: on a short screen "Use this photo" stays in reach (the frame swallows swipes). */}
      <div className={`${styles.buttonRow} ${styles.stickyActions}`}>
        <button type="button" className={styles.primaryButton} disabled={!current || busy || Boolean(error)} onClick={confirm} data-crop-confirm>
          {busy ? 'Preparing…' : 'Use this photo'}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </Sheet>
  );
}
