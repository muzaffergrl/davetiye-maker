// Photo upload checks shared by every data adapter.
// The type is detected from the file's first bytes; the browser's MIME type is not trusted.
// SVG, HTML, GIF, HEIC and anything else are rejected.

import { photoFileName, variantWidths } from './photo-variants.ts';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export interface ImageType {
  ext: 'jpg' | 'png' | 'webp' | 'avif';
  contentType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
}

export const IMAGE_TYPES: Record<ImageType['ext'], ImageType> = {
  jpg: { ext: 'jpg', contentType: 'image/jpeg' },
  png: { ext: 'png', contentType: 'image/png' },
  webp: { ext: 'webp', contentType: 'image/webp' },
  avif: { ext: 'avif', contentType: 'image/avif' },
};

export class UploadRejectedError extends Error {
  readonly reason: 'empty' | 'too_large' | 'unsupported_type';
  constructor(reason: 'empty' | 'too_large' | 'unsupported_type', message: string) {
    super(message);
    this.name = 'UploadRejectedError';
    this.reason = reason;
  }
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.subarray(start, end));
}

export function detectImageType(bytes: Uint8Array): ImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return IMAGE_TYPES.jpg;
  if (
    bytes.length >= 8 &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => bytes[i] === b)
  ) {
    return IMAGE_TYPES.png;
  }
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return IMAGE_TYPES.webp;
  if (bytes.length >= 12 && ascii(bytes, 4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(bytes, 8, 12))) {
    return IMAGE_TYPES.avif;
  }
  return null;
}

/** Throws UploadRejectedError unless the bytes are a supported image within the size limit. */
export function assertImageUpload(bytes: Uint8Array, maxBytes = MAX_UPLOAD_BYTES): ImageType {
  if (!bytes.length) throw new UploadRejectedError('empty', 'The file is empty.');
  if (bytes.length > maxBytes) {
    throw new UploadRejectedError('too_large', `The photo is larger than ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  }
  const type = detectImageType(bytes);
  if (!type) throw new UploadRejectedError('unsupported_type', 'Please upload a JPG, PNG, WebP or AVIF photo.');
  return type;
}

/** One file of a stored photo set (lib/photo-variants.ts names). */
export interface PhotoSetFile {
  name: string;
  bytes: Uint8Array;
  width: number | null;
}

/**
 * Checks a photo with its size variants (G055) and names the files under one random `base`:
 * with a width: "<base>-<w>w.<ext>" for each variant, then the photo; without: "<base>.<ext>".
 * Variants must be exactly variantWidths(width), each a supported image of the photo's type.
 * Returns the photo's type and the files in write order (variants first: the photo's URL only
 * goes into the content after every file is stored).
 */
export function photoSetFiles(
  photo: { bytes: Uint8Array; width?: number | null; variants?: ReadonlyArray<{ width: number; bytes: Uint8Array }> },
  base: string,
): { type: ImageType; files: PhotoSetFile[] } {
  const type = assertImageUpload(photo.bytes);
  const variants = photo.variants ?? [];
  const width = photo.width ?? null;
  if (width === null) {
    if (variants.length) throw new Error('photo variants need the width of the photo');
    return { type, files: [{ name: `${base}.${type.ext}`, bytes: photo.bytes, width: null }] };
  }
  if (!Number.isInteger(width) || width < 1 || width > 99_999) throw new Error(`invalid photo width ${width}`);
  const expected = variantWidths(width);
  const given = variants.map((v) => v.width);
  if (given.length !== expected.length || given.some((w, i) => w !== expected[i])) {
    throw new Error(`a photo ${width} px wide needs variants [${expected.join(', ')}], got [${given.join(', ')}]`);
  }
  const files: PhotoSetFile[] = variants.map((v) => {
    const t = assertImageUpload(v.bytes);
    if (t.ext !== type.ext) throw new UploadRejectedError('unsupported_type', 'A photo size is not the same image type as the photo.');
    return { name: photoFileName(base, v.width, type.ext), bytes: v.bytes, width: v.width };
  });
  files.push({ name: photoFileName(base, width, type.ext), bytes: photo.bytes, width });
  return { type, files };
}

// ---------------------------------------------------------------------------------------------------- music (G126)

/** The couple's own music file (G126): MP3 or AAC (.m4a / ADTS .aac), at most 10 MB. */
export const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

export interface AudioType {
  ext: 'mp3' | 'm4a' | 'aac';
  contentType: 'audio/mpeg' | 'audio/mp4' | 'audio/aac';
}

export const AUDIO_TYPES: Record<AudioType['ext'], AudioType> = {
  mp3: { ext: 'mp3', contentType: 'audio/mpeg' },
  m4a: { ext: 'm4a', contentType: 'audio/mp4' },
  aac: { ext: 'aac', contentType: 'audio/aac' },
};

/** Browser-reported types accepted for a music upload (the bytes still decide; empty = the browser did not say). */
export const AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/mpeg3', 'audio/x-mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'audio/aac', 'audio/x-aac', 'audio/aacp'];

const M4A_BRANDS = new Set(['M4A ', 'M4B ', 'mp42', 'mp41', 'isom', 'iso2', 'dash', 'M4V ']);

/** MP3 (ID3 tag or an MPEG audio frame), MP4/M4A audio (ftyp box) or ADTS AAC, from the first bytes. */
export function detectAudioType(bytes: Uint8Array): AudioType | null {
  if (bytes.length >= 10 && ascii(bytes, 0, 3) === 'ID3') return AUDIO_TYPES.mp3;
  if (bytes.length >= 12 && ascii(bytes, 4, 8) === 'ftyp' && M4A_BRANDS.has(ascii(bytes, 8, 12))) return AUDIO_TYPES.m4a;
  if (bytes.length >= 4 && bytes[0] === 0xff) {
    // ADTS AAC: sync 0xFFF, layer 00
    if ((bytes[1] & 0xf6) === 0xf0) return AUDIO_TYPES.aac;
    // MPEG-1/2/2.5 audio frame: sync 11 bits, layer III (01) or II (10), bitrate index not 1111, sample rate not 11
    const version = (bytes[1] >> 3) & 0x3;
    const layer = (bytes[1] >> 1) & 0x3;
    const bitrate = (bytes[2] >> 4) & 0xf;
    const rate = (bytes[2] >> 2) & 0x3;
    if ((bytes[1] & 0xe0) === 0xe0 && version !== 1 && (layer === 1 || layer === 2) && bitrate !== 0xf && rate !== 3) return AUDIO_TYPES.mp3;
  }
  return null;
}

/** Throws UploadRejectedError unless the bytes are an MP3 / AAC file within the size limit and the browser's type fits. */
export function assertAudioUpload(bytes: Uint8Array, declaredType: string | null = null, maxBytes = MAX_AUDIO_BYTES): AudioType {
  if (!bytes.length) throw new UploadRejectedError('empty', 'The file is empty.');
  if (bytes.length > maxBytes) {
    throw new UploadRejectedError('too_large', `The music file is larger than ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  }
  const declared = (declaredType ?? '').split(';')[0].trim().toLowerCase();
  const type = detectAudioType(bytes);
  if (!type || (declared && !AUDIO_MIME_TYPES.includes(declared))) {
    throw new UploadRejectedError('unsupported_type', 'Please upload an MP3 or M4A (AAC) music file.');
  }
  return type;
}

/** Stored media file types by extension (photos + music), for the adapters' readPhoto. */
export const MEDIA_CONTENT_TYPES: Record<string, string> = {
  ...Object.fromEntries(Object.values(IMAGE_TYPES).map((t) => [t.ext, t.contentType])),
  ...Object.fromEntries(Object.values(AUDIO_TYPES).map((t) => [t.ext, t.contentType])),
};
