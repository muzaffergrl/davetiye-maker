// POST /api/edit/<slug>/music — the couple's own story music (G126).
//
// A Vercel function accepts at most 4.5 MB per request and a music file may be 10 MB, so the panel sends the file in
// parts of at most MUSIC_PART_BYTES (raw body) with these headers:
//   X-Upload-Id     32 hex characters, chosen by the browser for this file
//   X-Upload-Part   0-based index of this part
//   X-Upload-Parts  number of parts (1 … MUSIC_MAX_PARTS)
//   X-Upload-Type   the browser's MIME type of the file (checked against AUDIO_MIME_TYPES; the bytes decide)
// Parts before the last are kept by the data adapter (putUploadPart); the last one assembles the file, checks it
// (assertAudioUpload: MP3 / M4A / AAC signature, <= 10 MB) and stores it next to the photos (saveAudio) → {url}.
// The panel then saves content.audio = {music: "custom", music_file: url, music_name} through the normal autosave.
// Same authorisation, archive rule, per-site file cap and daily upload limit as photos (lib/panel/api.ts uploadPhoto).
// G172: every part counts against MUSIC_PARTS_PER_DAY too — a part that is never assembled stays stored, and before, only
// part 0 was counted (parts 1, 2 … under ever new upload ids filled storage without a limit).

import { getClaimRateLimiter, UPLOAD_LIMITS } from '../claim/limits.ts';
import type { RateLimitRule } from '../rsvp/rate-limit.ts';
import { getDataAdapter } from '../data/index.ts';
import { NotFoundError } from '../data/types.ts';
import { authorizeEditor } from '../rsvp/couple.ts';
import { assertAudioUpload, detectAudioType, MAX_AUDIO_BYTES, UploadRejectedError } from '../uploads.ts';
import { PANEL_BRAND } from './brand.ts';
import { bearerKey, BodyTooLargeError, fail, json, readLimitedBytes, unauthorized } from './http.ts';
import { ARCHIVED_MESSAGE, isArchived } from './rights.ts';

/** 3.5 MB: below Vercel's 4.5 MB request limit with room for headers. */
export const MUSIC_PART_BYTES = 3.5 * 1024 * 1024;
export const MUSIC_MAX_PARTS = Math.ceil(MAX_AUDIO_BYTES / MUSIC_PART_BYTES);
const UPLOAD_ID_RE = /^[0-9a-f]{32}$/;
/** Parts per site per day (G172): as many as the daily uploads, each in the most parts a file can have. */
export const MUSIC_PARTS_PER_DAY: RateLimitRule = {
  limit: UPLOAD_LIMITS.perSitePerDay.limit * MUSIC_MAX_PARTS,
  windowMs: UPLOAD_LIMITS.perSitePerDay.windowMs,
};

function intHeader(req: Request, name: string): number | null {
  const v = req.headers.get(name);
  return v !== null && /^\d{1,3}$/.test(v) ? Number(v) : null;
}

export async function uploadMusic(req: Request, slug: string): Promise<Response> {
  try {
    const site = await authorizeEditor(getDataAdapter(), slug, bearerKey(req));
    if (!site) return unauthorized();
    if (isArchived(site)) return fail(403, 'archived', ARCHIVED_MESSAGE);
    const adapter = getDataAdapter();
    if (!adapter.saveAudio || !adapter.putUploadPart || !adapter.takeUploadParts) {
      return fail(501, 'unsupported', 'Music uploads are not available on this server.');
    }
    const uploadId = req.headers.get('x-upload-id') ?? '';
    const part = intHeader(req, 'x-upload-part');
    const parts = intHeader(req, 'x-upload-parts');
    if (!UPLOAD_ID_RE.test(uploadId) || part === null || parts === null || parts < 1 || parts > MUSIC_MAX_PARTS || part >= parts) {
      return fail(400, 'bad_upload', 'This upload could not be read. Please try again.');
    }
    const declared = req.headers.get('x-upload-type');
    const partRate = await getClaimRateLimiter().hit(`upload:part:${site.id}`, MUSIC_PARTS_PER_DAY);
    if (!partRate.allowed) {
      return json(
        429,
        { ok: false, code: 'upload_limit', message: 'You have uploaded a lot of files today. Please try again tomorrow.' },
        { 'Retry-After': String(Math.max(1, Math.ceil(partRate.retryAfterMs / 1000))) },
      );
    }

    if (part === 0) {
      // Once per file: the per-site cap and the daily limit (shared with photos).
      if (adapter.countPhotos && (await adapter.countPhotos(site.id)) >= UPLOAD_LIMITS.maxFilesPerSite) {
        return fail(429, 'photo_limit', `This website has reached its upload limit. Message ${PANEL_BRAND.shopName} on Etsy with your order number if you need to add more.`);
      }
      const rate = await getClaimRateLimiter().hit(`upload:site:${site.id}`, UPLOAD_LIMITS.perSitePerDay);
      if (!rate.allowed) {
        return json(
          429,
          { ok: false, code: 'upload_limit', message: 'You have uploaded a lot of files today. Please try again tomorrow.' },
          { 'Retry-After': String(Math.max(1, Math.ceil(rate.retryAfterMs / 1000))) },
        );
      }
    }

    let bytes: Uint8Array;
    try {
      bytes = await readLimitedBytes(req, MUSIC_PART_BYTES);
    } catch (e) {
      if (e instanceof BodyTooLargeError) return fail(413, 'too_large', 'This part of the file is too large. Please try again.');
      throw e;
    }
    if (!bytes.length) return fail(400, 'empty', 'The file is empty.');
    // Fail fast on the first part: not an MP3 / AAC file, or a declared type that is not audio.
    if (part === 0 && parts > 1 && !detectAudioType(bytes)) {
      throw new UploadRejectedError('unsupported_type', 'Please upload an MP3 or M4A (AAC) music file.');
    }
    if (part < parts - 1) {
      if (bytes.length !== MUSIC_PART_BYTES) return fail(400, 'bad_upload', 'This upload could not be read. Please try again.');
      await adapter.putUploadPart(site.id, uploadId, part, bytes);
      return json(200, { ok: true, part });
    }

    let file = bytes;
    if (parts > 1) {
      const earlier = await adapter.takeUploadParts(site.id, uploadId, parts - 1);
      if (!earlier) return fail(409, 'upload_incomplete', 'Part of the file did not arrive. Please upload it again.');
      file = new Uint8Array(earlier.reduce((n, p) => n + p.length, 0) + bytes.length);
      let at = 0;
      for (const p of [...earlier, bytes]) {
        file.set(p, at);
        at += p.length;
      }
    }
    assertAudioUpload(file, declared);
    const saved = await adapter.saveAudio(site.id, { bytes: file, contentType: declared });
    return json(200, { ok: true, url: saved.url, contentType: saved.contentType, size: saved.size });
  } catch (e) {
    if (e instanceof UploadRejectedError) {
      const status = e.reason === 'too_large' ? 413 : e.reason === 'unsupported_type' ? 415 : 400;
      return fail(status, e.reason, e.message);
    }
    if (e instanceof NotFoundError) return unauthorized();
    console.error(`[panel] music ${slug}:`, e);
    return fail(500, 'server', 'Something went wrong. Please try again.');
  }
}
