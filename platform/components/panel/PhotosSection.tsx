'use client';
// Photos: one card per photo slot of the theme (theme.json "photos"). Add / replace -> crop in the
// browser -> upload (server checks + re-encodes) -> the URL goes into the content record.

import { useState } from 'react';
import { photoAt, previewPhotoUrl, shapeLabel, type PanelPhotoSlot } from '../../lib/panel/model.ts';
import { PhotoCropper } from './PhotoCropper.tsx';
import { usePanelContext } from './fields.tsx';
import styles from './panel.module.css';

/** Largest original the browser will open for cropping (the cropped upload itself is far smaller). */
export const MAX_ORIGINAL_BYTES = 30 * 1024 * 1024;

/** Client-side first check of a chosen file. Null = fine. */
export function checkChosenFile(file: { size: number; type: string; name: string }): string | null {
  if (!file.size) return 'This file is empty.';
  if (file.size > MAX_ORIGINAL_BYTES) return `This photo is larger than ${MAX_ORIGINAL_BYTES / 1024 / 1024} MB. Please choose a smaller one.`;
  const type = file.type.toLowerCase();
  const byName = /\.(jpe?g|png|webp|avif|heic|heif)$/i.test(file.name);
  if (type === 'image/svg+xml' || (type && !type.startsWith('image/')) || (!type && !byName)) {
    return 'Please choose a photo (JPG, PNG, WebP, AVIF or HEIC).';
  }
  return null;
}

type SlotStatus = { busy?: boolean; error?: string; confirmRemove?: boolean };

export function PhotosSection({
  slots,
  previewKey,
  onUpload,
  onRemove,
}: {
  slots: PanelPhotoSlot[];
  /** Photos are private until published; the buyer's thumbnails carry the preview key. */
  previewKey: string;
  onUpload: (slot: PanelPhotoSlot, blob: Blob) => Promise<{ ok: boolean; message?: string }>;
  onRemove: (slot: PanelPhotoSlot) => void;
}) {
  const { content, locked } = usePanelContext();
  const [cropping, setCropping] = useState<{ slot: PanelPhotoSlot; file: File } | null>(null);
  const [status, setStatus] = useState<Record<string, SlotStatus>>({});
  const set = (key: string, s: SlotStatus) => setStatus((all) => ({ ...all, [key]: s }));

  if (!slots.length) return <p className={styles.hint}>This design has no photo places.</p>;

  const choose = (slot: PanelPhotoSlot, file: File) => {
    const problem = checkChosenFile(file);
    if (problem) return set(slot.key, { error: problem });
    set(slot.key, {});
    setCropping({ slot, file });
  };

  const upload = async (slot: PanelPhotoSlot, blob: Blob) => {
    setCropping(null);
    set(slot.key, { busy: true });
    const res = await onUpload(slot, blob);
    set(slot.key, res.ok ? {} : { error: res.message ?? 'The photo could not be uploaded.' });
  };

  return (
    <>
      <p className={styles.hint}>
        Each photo is cropped to the shape the design uses. Until you add one, the design shows a soft placeholder image, and your
        guests see it too.
      </p>
      <div className={styles.photoGrid}>
        {slots.map((slot) => {
          const url = photoAt(content, slot.source);
          const s = status[slot.key] ?? {};
          const inputId = `photo-input-${slot.key}`;
          return (
            <div key={slot.key} className={styles.photoCard} data-photo-slot={slot.key}>
              <div className={styles.photoThumb} style={{ aspectRatio: String(slot.ratio ?? 4 / 3) }}>
                {url ? (
                  <img src={previewPhotoUrl(url, previewKey)} alt={`${slot.label}: current photo`} className={styles.photoImg} />
                ) : (
                  <span className={styles.photoEmpty}>No photo yet</span>
                )}
              </div>
              <div className={styles.photoInfo}>
                <p className={styles.label}>{slot.label}</p>
                <p className={styles.hint}>{shapeLabel(slot.ratio)}</p>
                <div className={styles.buttonRow}>
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    data-slot={slot.key}
                    disabled={locked || s.busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (file) choose(slot, file);
                    }}
                  />
                  <label htmlFor={inputId} className={styles.secondaryButton} aria-disabled={locked || s.busy || undefined}>
                    {url ? 'Replace' : 'Add photo'}
                  </label>
                  {url ? (
                    s.confirmRemove ? (
                      <button
                        type="button"
                        className={`${styles.secondaryButton} ${styles.dangerText}`}
                        disabled={locked}
                        onClick={() => {
                          set(slot.key, {});
                          onRemove(slot);
                        }}
                      >
                        Yes, remove
                      </button>
                    ) : (
                      <button type="button" className={styles.secondaryButton} disabled={locked || s.busy} onClick={() => set(slot.key, { confirmRemove: true })}>
                        Remove
                      </button>
                    )
                  ) : null}
                </div>
                {s.busy ? (
                  <p className={styles.hint} role="status">
                    Uploading…
                  </p>
                ) : null}
                {s.error ? (
                  <p className={styles.issueError} role="alert">
                    {s.error}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {cropping ? (
        <PhotoCropper
          file={cropping.file}
          slot={cropping.slot}
          onCancel={() => setCropping(null)}
          onConfirm={(blob) => void upload(cropping.slot, blob)}
        />
      ) : null}
    </>
  );
}
