// G139: making the PDFs small enough to send (a Vercel function answers at most 4.5 MB) without visible loss.

import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { PDFDict, PDFDocument, PDFName, PDFNumber, PDFRawStream, PDFRef } from 'pdf-lib';
import sharp from 'sharp';

/**
 * Each website page is its own Chromium PDF, so the design's decor and paper (the same files on every page) are stored
 * once per page after the merge. Identical image streams (soft mask included) are pointed at one copy everywhere they
 * are referenced (pages and nested form XObjects) and the copies deleted.
 */
export function dedupeImages(doc: PDFDocument): void {
  const ctx = doc.context;
  const objects = ctx.enumerateIndirectObjects();
  const keys = new Map<string, PDFRef>();
  const replace = new Map<PDFRef, PDFRef>();
  for (const [ref, obj] of objects) {
    if (!(obj instanceof PDFRawStream) || obj.dict.get(PDFName.of('Subtype')) !== PDFName.of('Image')) continue;
    const h = createHash('sha256').update(obj.contents);
    for (const [k, v] of obj.dict.entries()) if (k !== PDFName.of('SMask')) h.update(`${k}${v}`);
    const mask = obj.dict.get(PDFName.of('SMask'));
    const m = mask instanceof PDFRef ? ctx.lookup(mask) : null;
    if (m instanceof PDFRawStream) h.update('mask').update(m.contents);
    const key = h.digest('hex');
    const keep = keys.get(key);
    if (!keep) keys.set(key, ref);
    else {
      replace.set(ref, keep);
      if (mask instanceof PDFRef) replace.set(mask, keep); // marked for deletion only (never referenced elsewhere)
    }
  }
  if (!replace.size) return;
  const swap = (dict: PDFDict) => {
    for (const [k, v] of dict.entries()) {
      if (v instanceof PDFRef && replace.has(v)) dict.set(k, replace.get(v)!);
      else if (v instanceof PDFDict) swap(v);
    }
  };
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (replace.has(ref)) continue;
    if (obj instanceof PDFDict) swap(obj);
    else if (obj instanceof PDFRawStream) swap(obj.dict);
  }
  for (const ref of replace.keys()) ctx.delete(ref);
}

/**
 * Chromium stores every image it had to draw itself (decor with transparency, anything under a CSS mask) as lossless
 * Flate RGB — a website of photos and painted decor came to ~5 MB, over Vercel's 4.5 MB response limit. Each such
 * 8-bit RGB image is re-encoded as JPEG (DCTDecode) when that is smaller; its soft mask (transparency) stays lossless.
 */
export async function jpegImages(doc: PDFDocument, quality: number): Promise<void> {
  const ctx = doc.context;
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    const d = obj.dict;
    if (d.get(PDFName.of('Subtype')) !== PDFName.of('Image') || d.get(PDFName.of('Filter')) !== PDFName.of('FlateDecode')) continue;
    if (d.get(PDFName.of('DecodeParms')) || d.get(PDFName.of('ColorSpace')) === PDFName.of('DeviceGray')) continue;
    const width = (d.get(PDFName.of('Width')) as PDFNumber | undefined)?.asNumber() ?? 0;
    const height = (d.get(PDFName.of('Height')) as PDFNumber | undefined)?.asNumber() ?? 0;
    if ((d.get(PDFName.of('BitsPerComponent')) as PDFNumber | undefined)?.asNumber() !== 8 || width * height < 4096) continue;
    let raw: Buffer;
    try {
      raw = inflateSync(obj.contents);
    } catch {
      continue;
    }
    if (raw.length !== width * height * 3) continue;
    const jpeg = await sharp(raw, { raw: { width, height, channels: 3 } }).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (jpeg.length >= obj.contents.length) continue;
    const dict = d.clone(ctx);
    dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
    dict.set(PDFName.of('Length'), PDFNumber.of(jpeg.length));
    ctx.assign(ref, PDFRawStream.of(dict, new Uint8Array(jpeg)));
  }
}
