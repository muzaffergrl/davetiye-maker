// npm run seed [-- --theme <id>] [--slug <slug>] [--content <path>] [--photos <dir>|--no-photos] [--photo-max <px>] [--draft]
//
// Creates (or re-creates) a demo site from a collection's content.demo.json and publishes it, in the storage
// DATA_ADAPTER selects: local (default; PLATFORM_DATA_DIR, default platform/.data) or blob (Vercel Blob;
// needs BLOB_READ_WRITE_TOKEN in the environment).
// Default: theme blush-garden-rose (design 03) with collections/03_Blush_Garden_Rose/content.demo.json and the
// fictional sample photos of collections/03_Blush_Garden_Rose/assets/gpt/photos/.
//
// Photos: for every photo slot in the theme's theme.json, <photos>/<slot key>.(jpg|jpeg|png|webp) is uploaded through
// the data adapter (like a buyer's upload) and its URL is written to the slot's content path (media.hero_portrait,
// media.memory_photos.0, …). --photo-max (default 1600, 0 = keep the original file) re-encodes each photo with
// Pillow (python3) to that longest side, as the panel should do on upload (G039); without python3/Pillow the
// original file is uploaded and a note is printed. --no-photos seeds the placeholder state.
// The edit/preview keys are printed and saved to <PLATFORM_DATA_DIR>/seed-keys.json (gitignored, local disk).

import { spawnSync } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { getDataAdapter, localDataDir, type DataAdapter } from '../lib/data/index.ts';
import type { ContentRecord } from '../lib/content/types.ts';
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
  /** Longest side for re-encoding (0 = original file). */
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

const PILLOW_RESIZE = `
import io, sys
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open(sys.argv[1])).convert("RGB")
m = int(sys.argv[2])
if max(im.size) > m:
    im.thumbnail((m, m), Image.LANCZOS)
buf = io.BytesIO()
im.save(buf, "JPEG", quality=84, optimize=True, progressive=True)
sys.stdout.buffer.write(buf.getvalue())
`;

let pillowNote = false;
async function photoBytes(file: string, maxSide: number): Promise<Uint8Array> {
  if (maxSide > 0) {
    const r = spawnSync('python3', ['-c', PILLOW_RESIZE, file, String(maxSide)], { maxBuffer: 64 * 1024 * 1024 });
    if (r.status === 0 && r.stdout?.length) return new Uint8Array(r.stdout);
    if (!pillowNote) console.log('  note: python3 + Pillow not available — uploading the original photo files');
    pillowNote = true;
  }
  return new Uint8Array(await fs.readFile(file));
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
    const maxSide = opts.photoMax ?? 1600;
    const withPhotos = structuredClone(opts.content) as unknown as Record<string, unknown>;
    for (const [key, slot] of Object.entries(theme.manifest.photos)) {
      const file = ['jpg', 'jpeg', 'png', 'webp'].map((ext) => path.join(dir, `${key}.${ext}`)).find((f) => existsSync(f));
      if (!file) continue;
      const saved = await adapter.savePhoto(site.id, { bytes: await photoBytes(file, maxSide) });
      setPath(withPhotos, slot.source, saved.url);
      uploaded.push(`${key} → ${slot.source} (${Math.round(saved.size / 1024)} KB)`);
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

async function main(): Promise<void> {
  process.chdir(platformRoot); // themes/ and .data/ resolve from platform/
  const { values } = parseArgs({
    options: {
      theme: { type: 'string', default: 'blush-garden-rose' },
      slug: { type: 'string', default: 'clara-and-julian' },
      content: { type: 'string', default: path.join(collection03, 'content.demo.json') },
      photos: { type: 'string', default: path.join(collection03, 'assets/gpt/photos') },
      'no-photos': { type: 'boolean', default: false },
      'photo-max': { type: 'string', default: '1600' },
      draft: { type: 'boolean', default: false },
    },
  });

  const adapter = getDataAdapter();
  const content = JSON.parse(await fs.readFile(path.resolve(values.content!), 'utf8')) as ContentRecord;
  const info = await seedSite(adapter, {
    theme: values.theme!,
    slug: values.slug!,
    content,
    draft: values.draft!,
    baseUrl: process.env.SEED_BASE_URL || 'http://localhost:3000',
    photosDir: values['no-photos'] ? null : values.photos!,
    photoMax: Number(values['photo-max']) || 0,
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
