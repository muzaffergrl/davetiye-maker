// Photo upload checks shared by every data adapter.
// The type is detected from the file's first bytes; the browser's MIME type is not trusted.
// SVG, HTML, GIF, HEIC and anything else are rejected.

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
