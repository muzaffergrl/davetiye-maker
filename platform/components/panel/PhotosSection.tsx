'use client';
// Photos: one card per photo place of the theme (theme.json "photos"). Add / replace -> crop in the
// browser -> upload (server checks + re-encodes) -> the URL goes into the content record.
// The same card is used on the Photos page (all places) and inside the section a photo belongs to
// (venue photo under Venue, story photos under Our Story): one value, two ways in (docs/16 §4.3).

import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { photoAt, previewPhotoUrl, shapeLabel, withPhoto, type PanelPhotoSlot } from '../../lib/panel/model.ts';
import { smallestPhotoUrl } from '../../lib/photo-variants.ts';
import { PhotoCropper } from './PhotoCropper.tsx';
import { usePanelContext } from './fields.tsx';
import { Button, cx, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';
import { msg, t } from '../../lib/i18n/client.ts';

/** The texts of lib/panel/model.ts shapeLabel(), marked for translation (shown below as t(shapeLabel(…))). */
export const SHAPE_LABEL_TEXTS = [msg('Any shape'), msg('Tall (portrait)'), msg('Almost square'), msg('Slightly wide'), msg('Wide (landscape)')];

/** Largest original the browser will open for cropping (the cropped upload itself is far smaller). */
export const MAX_ORIGINAL_BYTES = 30 * 1024 * 1024;

/** Client-side first check of a chosen file. Null = fine. */
export function checkChosenFile(file: { size: number; type: string; name: string }): string | null {
  if (!file.size) return t('This file is empty.');
  if (file.size > MAX_ORIGINAL_BYTES) return t('This photo is larger than {mb} MB. Please choose a smaller one.', { mb: MAX_ORIGINAL_BYTES / 1024 / 1024 });
  const type = file.type.toLowerCase();
  const byName = /\.(jpe?g|png|webp|avif|heic|heif)$/i.test(file.name);
  if (type === 'image/svg+xml' || (type && !type.startsWith('image/')) || (!type && !byName)) {
    return t('Please choose a photo (JPG, PNG, WebP, AVIF or HEIC).');
  }
  return null;
}

type SlotStatus = { busy?: boolean; error?: string };

export function PhotoSlots({ slots: only, intro = false, compact = false }: { slots?: PanelPhotoSlot[]; intro?: boolean | 'count'; compact?: boolean }) {
  const { content, edit, locked, online, previewToken, photoSlots, uploadPhoto, removePhoto } = usePanelContext();
  const slots = only ?? photoSlots;
  const snack = useSnackbar();
  const [cropping, setCropping] = useState<{ slot: PanelPhotoSlot; file: File } | null>(null);
  const [status, setStatus] = useState<Record<string, SlotStatus>>({});
  const set = (key: string, s: SlotStatus) => setStatus((all) => ({ ...all, [key]: s }));

  if (!slots.length) return <p className={styles.hint}>{t('This design has no photo places.')}</p>;

  const choose = (slot: PanelPhotoSlot, file: File) => {
    const problem = checkChosenFile(file);
    if (problem) return set(slot.key, { error: problem });
    set(slot.key, {});
    setCropping({ slot, file });
  };

  const upload = async (slot: PanelPhotoSlot, blob: Blob) => {
    setCropping(null);
    set(slot.key, { busy: true });
    const res = await uploadPhoto(slot, blob);
    set(slot.key, res.ok ? {} : { error: res.message ? t(res.message) : t('The photo could not be uploaded.') });
  };

  const remove = (slot: PanelPhotoSlot, url: string) => {
    removePhoto(slot);
    // Undo puts the same stored photo back (no new upload).
    snack(t('Photo removed'), { label: t('Undo'), run: () => edit((c) => withPhoto(c, slot.source, url)) });
  };

  const filled = slots.filter((s) => photoAt(content, s.source)).length;

  return (
    <>
      {intro === 'count' ? (
        <p className={styles.hint} data-photo-count>
          <strong className={styles.counterInline}>{t('{filled} of {total} photos', { filled, total: slots.length })}</strong>{' '}
          · {t('Each photo is cropped to the shape the design uses.')}
        </p>
      ) : intro ? (
        <p className={styles.hint}>
          {t('Each photo is cropped to the shape the design uses. Until you add a photo, your guests see a soft placeholder image.')}{' '}
          <strong className={styles.counterInline}>{t('{filled} of {total} photos', { filled, total: slots.length })}</strong>
        </p>
      ) : null}
      <div className={cx(styles.photoGrid, compact && styles.photoGridCompact)}>
        {slots.map((slot) => {
          const url = photoAt(content, slot.source);
          const s = status[slot.key] ?? {};
          const inputId = `photo-input-${slot.key}`;
          const disabled = locked || s.busy || !online;
          const label = t(slot.label);
          return (
            <div key={slot.key} className={styles.photoCard} data-photo-slot={slot.key}>
              <div className={cx(styles.photoThumb, !url && styles.photoThumbEmpty)} style={{ aspectRatio: String(slot.ratio ?? 4 / 3) }}>
                {url ? (
                  // The 640 px variant when the photo has one (G055): a thumbnail does not need the full photo.
                  <img src={previewPhotoUrl(smallestPhotoUrl(url), previewToken)} alt={t('{photo}: current photo', { photo: label })} className={styles.photoImg} />
                ) : (
                  <span className={styles.photoEmpty}>
                    <ImagePlus size={24} strokeWidth={1.5} aria-hidden="true" />
                    {t('No photo yet')}
                  </span>
                )}
                {s.busy ? (
                  <span className={styles.photoBusy} role="status">
                    <span className={styles.progress} aria-hidden="true" />
                    {t('Uploading…')}
                  </span>
                ) : null}
              </div>
              <div className={styles.photoInfo}>
                <p className={styles.photoLabel}>{label}</p>
                <p className={styles.hint}>{t(shapeLabel(slot.ratio))}</p>
                <div className={styles.photoActions}>
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    data-slot={slot.key}
                    disabled={disabled}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (file) choose(slot, file);
                    }}
                  />
                  <label htmlFor={inputId} className={cx(styles.btn, url ? styles.btn_secondary : styles.btn_primary, styles.btnSmall)} aria-disabled={disabled || undefined}>
                    {url ? <RefreshCw size={16} strokeWidth={1.75} aria-hidden="true" /> : <ImagePlus size={16} strokeWidth={1.75} aria-hidden="true" />}
                    <span>{url ? t('Replace') : t('Add photo')}</span>
                    <span className={styles.visuallyHidden}>: {label}</span>
                  </label>
                  {url ? (
                    <Button small variant="tertiary" icon={Trash2} disabled={locked || s.busy} onClick={() => remove(slot, url)} aria-label={t('Remove {photo}', { photo: label })}>
                      {t('Remove')}
                    </Button>
                  ) : null}
                </div>
                {!online ? <p className={styles.hint}>{t('Connect to the internet to add photos.')}</p> : null}
                {s.error ? (
                  <p className={styles.issueError} role="alert">
                    {s.error} {t('Choose another photo.')}
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
