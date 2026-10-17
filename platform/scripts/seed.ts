// npm run seed [-- --theme <id>] [--slug <slug>] [--content <path>] [--photos <dir>|--no-photos] [--photo-max <px>] [--draft]
//
// Creates (or re-creates) a demo site from a collection's content.demo.json and publishes it, in the storage
// DATA_ADAPTER selects: local (default; PLATFORM_DATA_DIR, default platform/.data) or blob (Vercel Blob;
// needs BLOB_READ_WRITE_TOKEN in the environment).
// Default: theme blush-garden-rose (design 03) with collections/03_Blush_Garden_Rose/content.demo.json and the
// fictional sample photos of collections/03_Blush_Garden_Rose/assets/gpt/photos/.
//
// Photos (G056): for every photo slot in the theme's theme.json, <photos>/<slot key>.(jpg|jpeg|png|webp) goes the panel
// upload's way (lib/panel/api.ts uploadPhoto): preparePhoto (sharp: EXIF rotation, metadata dropped, centre crop to the
// slot's theme.json aspect, long edge <= 2400, JPEG q84, 640/1280 px variants) and the adapter's savePhoto with the width
// and variants, so the site's photos carry the same srcset as a buyer's (lib/photo-variants.ts). Its URL is written to the
// slot's content path (media.hero_portrait, media.memory_photos.0, …). --photo-max <px> (default 2400 = the panel's
// limit) shrinks a larger sample file to that long edge first; --photo-max 0 stores the original file unchanged (one
// file, no variants: the state of a pre-G055 upload). Without sharp the original file is stored (as the panel's own
// fallback) and a note is printed. --no-photos seeds the placeholder state.
// The edit/preview keys are printed and saved to <PLATFORM_DATA_DIR>/seed-keys.json (gitignored, local disk).

import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { getDataAdapter, localDataDir, type DataAdapter } from '../lib/data/index.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { parseAspect } from '../lib/panel/model.ts';
import { PHOTO_MAX_EDGE, preparePhoto } from '../lib/panel/photos.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { loadTheme } from '../lib/theme/theme.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const platformRoot = path.resolve(here, '..');
const collection03 = path.resolve(platformRoot, '../collections/03_Blush_Garden_Rose');

export interface SeedOptions {
  theme: string;
  slug: string;
  content: ContentRecord;
  draft: boolean;
  baseUrl: string;
  /** Folder with <slot key>.(jpg|jpeg|png|webp); null = placeholder state. */
  photosDir?: string | null;
  /** Long edge the sample files are shrunk to before the panel's processing (default 2400; 0 = original file, no variants). */
  photoMax?: number;
}

export interface SeedInfo {
  slug: string;
  siteId: string;
  theme: string;
  status: 'draft' | 'published';
  photos: string[];
  site: string;
  preview: string;
  edit: string;
  editKey: string;
  previewKey: string;
}

/** Sets a dotted path (`media.memory_photos.0`) on a plain object; array indexes must be appended in order. */
function setPath(obj: Record<string, unknown>, dotted: string, value: unknown): void {
  const parts = dotted.split('.');
  let cur: Record<string, unknown> | unknown[] = obj;
  parts.forEach((seg, i) => {
    const last = i === parts.length - 1;
    if (Array.isArray(cur)) {
      const idx = Number(seg);
      if (!Number.isInteger(idx) || idx > cur.length) throw new Error(`${dotted}: index ${seg} would leave a gap in the list`);
      if (last) cur[idx] = value;
      else cur = cur[idx] as Record<string, unknown>;
    } else {
      if (last) cur[seg] = value;
      else cur = (cur[seg] ??= /^\d+$/.test(parts[i + 1]) ? [] : {}) as Record<string, unknown>;
    }
  });
}

type SharpFactory = (input: Uint8Array) => import('sharp').Sharp;

/** A sample file larger than `maxSide` (long edge) as a lossless PNG of that size; otherwise the file itself. */
async function shrinkSample(bytes: Uint8Array, maxSide: number): Promise<Uint8Array> {
  if (maxSide >= PHOTO_MAX_EDGE) return bytes; // the panel's own limit applies in preparePhoto
  let sharp: SharpFactory;
  try {
    const m = await import('sharp');
    sharp = (m as unknown as { default?: SharpFactory }).default ?? (m as unknown as SharpFactory);
  } catch {
    return bytes; // preparePhoto reports the missing sharp
  }
  const meta = await sharp(bytes).metadata();
  if (!meta.width || !meta.height || Math.max(meta.width, meta.height) <= maxSide) return bytes;
  const swap = (meta.orientation ?? 1) >= 5; // EXIF orientation 5-8 swaps the sides
  const wide = swap ? meta.height >= meta.width : meta.width >= meta.height;
  return new Uint8Array(await sharp(bytes).rotate().resize(wide ? { width: maxSide } : { height: maxSide }).png().toBuffer());
}

let sharpNote = false;
/**
 * One sample photo, stored like a panel upload (lib/panel/api.ts uploadPhoto): preparePhoto with the slot's aspect,
 * then savePhoto with its width and 640/1280 variants. maxSide 0: the original file as it is (no variants).
 */
async function seedPhoto(adapter: DataAdapter, siteId: string, file: string, aspect: string | undefined, maxSide: number) {
  const original = new Uint8Array(await fs.readFile(file));
  if (maxSide <= 0) return { saved: await adapter.savePhoto(siteId, { bytes: original }), note: 'original file' };
  const photo = await preparePhoto(await shrinkSample(original, maxSide), parseAspect(aspect));
  if (photo.width === null) {
    if (!sharpNote) console.log('  note: sharp is not available — photos stored as their original files, without variants');
    sharpNote = true;
    return { saved: await adapter.savePhoto(siteId, { bytes: photo.bytes, contentType: photo.contentType }), note: 'original file, no sharp' };
  }
  const saved = await adapter.savePhoto(siteId, { bytes: photo.bytes, contentType: photo.contentType, width: photo.width, variants: photo.variants });
  const widths = saved.variants.map((v) => v.width).join('/');
  return { saved, note: `${photo.width}×${photo.height}${widths ? `, variants ${widths}` : ''}` };
}

/** Replaces the site at `slug` (if any) with a fresh one; works with any adapter (local, blob). */
export async function seedSite(adapter: DataAdapter, opts: SeedOptions): Promise<SeedInfo> {
  const theme = await loadTheme(opts.theme);
  if (!theme) throw new Error(`theme "${opts.theme}" not found in ${path.relative(process.cwd(), 'themes') || 'themes'}`);

  const existing = await adapter.getSiteBySlug(opts.slug);
  if (existing) await adapter.deleteSite(existing.id);

  const { site, editKey, previewKey } = await createSiteWithKeys(adapter, {
    slug: opts.slug,
    theme: opts.theme,
    content: opts.content,
    // One order reference per site: the blob adapter keeps order references unique.
    orderRef: `DEMO-SEED-${opts.slug}`,
  });

  const uploaded: string[] = [];
  if (opts.photosDir) {
    const dir = path.resolve(opts.photosDir);
    const maxSide = opts.photoMax ?? PHOTO_MAX_EDGE;
    const withPhotos = structuredClone(opts.content) as unknown as Record<string, unknown>;
    for (const [key, slot] of Object.entries(theme.manifest.photos)) {
      const file = ['jpg', 'jpeg', 'png', 'webp'].map((ext) => path.join(dir, `${key}.${ext}`)).find((f) => existsSync(f));
      if (!file) continue;
      const { saved, note } = await seedPhoto(adapter, site.id, file, slot.aspect, maxSide);
      setPath(withPhotos, slot.source, saved.url);
      uploaded.push(`${key} → ${slot.source} (${Math.round(saved.size / 1024)} KB, ${note})`);
    }
    if (uploaded.length) await adapter.updateContent(site.id, withPhotos as unknown as ContentRecord);
  }
  if (!opts.draft) await publishSite(adapter, site.id);

  const base = opts.baseUrl.replace(/\/+$/, '');
  return {
    slug: site.slug,
    siteId: site.id,
    theme: site.theme,
    status: opts.draft ? 'draft' : 'published',
    photos: uploaded,
    site: `${base}/${site.slug}`,
    preview: `${base}/${site.slug}?preview=${previewKey}`,
    edit: `${base}/edit/${site.slug}?k=${editKey}`,
    editKey,
    previewKey,
  };
}

function photoMaxArg(value: string): number {
  const n = Number(value);
  if (!/^\d+$/.test(value.trim()) || !Number.isSafeInteger(n)) {
    throw new Error(`--photo-max must be a whole number of pixels (0 = the original files), not "${value}"`);
  }
  return n;
}

async function main(): Promise<void> {
  process.chdir(platformRoot); // themes/ and .data/ resolve from platform/
  const { values } = parseArgs({
    options: {
      theme: { type: 'string', default: 'blush-garden-rose' },
      slug: { type: 'string', default: 'clara-and-julian' },
      content: { type: 'string', default: path.join(collection03, 'content.demo.json') },
      photos: { type: 'string', default: path.join(collection03, 'assets/gpt/photos') },
      'no-photos': { type: 'boolean', default: false },
      'photo-max': { type: 'string', default: String(PHOTO_MAX_EDGE) },
      draft: { type: 'boolean', default: false },
    },
  });

  const adapter = getDataAdapter();
  const content = JSON.parse(await fs.readFile(path.resolve(values.content!), 'utf8')) as ContentRecord;
  // --no-photos = the placeholder state, also for a demo record that links bundled sample photos (21 Crimson, G142)
  if (values['no-photos'] && content.media) content.media = { ...content.media, hero_portrait: null, memory_photos: [], venue_image: null };
  const info = await seedSite(adapter, {
    theme: values.theme!,
    slug: values.slug!,
    content,
    draft: values.draft!,
    baseUrl: process.env.SEED_BASE_URL || 'http://localhost:3000',
    photosDir: values['no-photos'] ? null : values.photos!,
    photoMax: photoMaxArg(values['photo-max']!),
  });

  const dataDir = localDataDir();
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, 'seed-keys.json'), JSON.stringify(info, null, 2));

  const where = adapter.kind === 'local' ? path.relative(process.cwd(), dataDir) || dataDir : `the ${adapter.kind} store`;
  console.log(`Seeded "${info.slug}" (${info.status}) with theme ${info.theme} in ${where}`);
  for (const u of info.photos) console.log(`  photo:   ${u}`);
  console.log(`  site:    ${info.site}`);
  console.log(`  preview: ${info.preview}`);
  console.log(`  edit:    ${info.edit}  (panel = task G039)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
