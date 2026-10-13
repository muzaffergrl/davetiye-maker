// Server-side photo processing for panel uploads (G039). Server only (uses sharp).
//
// 1. lib/uploads assertImageUpload: type from the file's bytes (JPG/PNG/WebP/AVIF), size <= 10 MB.
// 2. sharp re-encodes every photo: EXIF orientation applied, all metadata dropped (GPS, camera,
//    ICC -> sRGB), pixel limit against decompression bombs, long edge <= PHOTO_MAX_EDGE,
//    centre crop to the slot's aspect ratio when the browser's crop is off by more than 1 %,
//    transparency flattened on white, output JPEG.
// 3. Size variants (G055, lib/photo-variants.ts): the same photo again at 640 and 1280 px wide (each only when
//    smaller than the photo), encoded from the original upload, not from the stored JPEG. The engine writes
//    them as srcset, so a phone does not download the full photo.
// If sharp cannot be loaded (platform without its native binary), the checked original bytes are
// stored unchanged and a warning is logged; the panel already crops and re-encodes in the browser
// (canvas -> JPEG, which drops metadata), so this is a fallback, not the normal path.

import { variantWidths } from '../photo-variants.ts';
import { assertImageUpload, UploadRejectedError } from '../uploads.ts';

export const PHOTO_MAX_EDGE = 2400;
/** 50 megapixels: more than any phone photo, far below a decompression bomb. */
export const PHOTO_MAX_PIXELS = 50_000_000;
export const PHOTO_JPEG_QUALITY = 84;

export interface PhotoVariant {
  width: number;
  height: number;
  bytes: Uint8Array;
}

export interface PreparedPhoto {
  bytes: Uint8Array;
  contentType: string;
  width: number | null;
  height: number | null;
  /** false when sharp was not available and the original bytes are returned. */
  reencoded: boolean;
  /** Smaller copies (640 / 1280 px wide, only those narrower than the photo); empty without sharp. */
  variants: PhotoVariant[];
}

// sharp 0.35's ESM typings declare the Sharp interface but not the default factory, so it is typed here.
type SharpFactory = (input: Uint8Array, options?: import('sharp').SharpOptions) => import('sharp').Sharp;
let sharpModule: Promise<SharpFactory | null> | null = null;

async function loadSharp(): Promise<SharpFactory | null> {
  sharpModule ??= import('sharp')
    .then((m) => ((m as unknown as { default?: SharpFactory }).default ?? (m as unknown as SharpFactory)))
    .catch((e) => {
      console.warn('[panel] sharp is not available; photos are stored without re-encoding:', String(e));
      return null;
    });
  return sharpModule;
}

/** Target crop (centre) for a width x height image so that width/height === ratio. */
export function centreCrop(width: number, height: number, ratio: number): { left: number; top: number; width: number; height: number } {
  if (width / height > ratio) {
    const w = Math.max(1, Math.round(height * ratio));
    return { left: Math.floor((width - w) / 2), top: 0, width: w, height };
  }
  const h = Math.max(1, Math.round(width / ratio));
  return { left: 0, top: Math.floor((height - h) / 2), width, height: h };
}

/**
 * Checks and re-encodes an uploaded photo. `ratio` = the slot's width/height (null: keep).
 * Throws UploadRejectedError (empty, too large, not a supported image, unreadable).
 */
export async function preparePhoto(input: Uint8Array, ratio: number | null = null): Promise<PreparedPhoto> {
  const type = assertImageUpload(input);
  const sharp = await loadSharp();
  if (!sharp) return { bytes: input, contentType: type.contentType, width: null, height: null, reencoded: false, variants: [] };

  try {
    const source = sharp(input, { limitInputPixels: PHOTO_MAX_PIXELS, failOn: 'error' });
    const meta = await source.metadata();
    if (!meta.width || !meta.height) throw new UploadRejectedError('unsupported_type', 'This photo could not be read. Please try another JPG or PNG.');
    // Size after EXIF rotation (orientation 5-8 swaps the sides).
    const swap = (meta.orientation ?? 1) >= 5;
    const width = swap ? meta.height : meta.width;
    const height = swap ? meta.width : meta.height;

    const crop = ratio && Math.abs(width / height / ratio - 1) > 0.01 ? centreCrop(width, height, ratio) : null;
    // One pipeline per output, each from the uploaded bytes: rotate -> crop -> resize -> flatten -> sRGB JPEG.
    const encode = async (resize: import('sharp').ResizeOptions) => {
      let pipeline = sharp(input, { limitInputPixels: PHOTO_MAX_PIXELS, failOn: 'error' }).rotate();
      if (crop) pipeline = pipeline.extract(crop);
      const { data, info } = await pipeline
        .resize(resize)
        .flatten({ background: '#ffffff' })
        .toColourspace('srgb')
        .jpeg({ quality: PHOTO_JPEG_QUALITY, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });
      const bytes = new Uint8Array(data);
      assertImageUpload(bytes); // every stored file passes the same checks
      return { bytes, width: info.width, height: info.height };
    };
    const photo = await encode({ width: PHOTO_MAX_EDGE, height: PHOTO_MAX_EDGE, fit: 'inside', withoutEnlargement: true });
    const variants: PhotoVariant[] = [];
    for (const w of variantWidths(photo.width)) variants.push(await encode({ width: w }));
    return { bytes: photo.bytes, contentType: 'image/jpeg', width: photo.width, height: photo.height, reencoded: true, variants };
  } catch (e) {
    if (e instanceof UploadRejectedError) throw e;
    const message = String((e as Error)?.message ?? e);
    if (/pixel limit/i.test(message)) {
      throw new UploadRejectedError('too_large', `The photo has too many pixels (more than ${PHOTO_MAX_PIXELS / 1_000_000} megapixels).`);
    }
    throw new UploadRejectedError('unsupported_type', 'This photo could not be read. Please try another JPG or PNG.');
  }
}
