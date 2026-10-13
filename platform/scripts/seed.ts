// npm run seed [-- --theme <id>] [--slug <slug>] [--content <path>] [--photos <dir>|--no-photos] [--photo-max <px>] [--draft]
//
// Creates (or re-creates) a demo site in the local data folder (PLATFORM_DATA_DIR,
// default platform/.data) from a collection's content.demo.json and publishes it.
// Default: theme blush-garden-rose (design 03) with collections/03_Blush_Garden_Rose/content.demo.json and the
// fictional sample photos of collections/03_Blush_Garden_Rose/assets/gpt/photos/.
//
// Photos: for every photo slot in the theme's theme.json, <photos>/<slot key>.(jpg|jpeg|png|webp) is uploaded through
// the data adapter (like a buyer's upload) and its URL is written to the slot's content path (media.hero_portrait,
// media.memory_photos.0, …). --photo-max (default 1600, 0 = keep the original file) re-encodes each photo with
// Pillow (python3) to that longest side, as the panel should do on upload (G039); without python3/Pillow the
// original file is uploaded and a note is printed. --no-photos seeds the placeholder state.
// The edit/preview keys are printed and saved to <data>/seed-keys.json (gitignored).

import { spawnSync } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { localDataDir } from '../lib/data/index.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { loadTheme } from '../lib/theme/theme.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const platformRoot = path.resolve(here, '..');
process.chdir(platformRoot); // themes/ and .data/ resolve from platform/

const collection03 = path.resolve(platformRoot, '../collections/03_Blush_Garden_Rose');
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

const dataDir = localDataDir();
const adapter = new LocalAdapter(dataDir);
const content = JSON.parse(await fs.readFile(path.resolve(values.content!), 'utf8')) as ContentRecord;
const theme = await loadTheme(values.theme!);
if (!theme) throw new Error(`theme "${values.theme}" not found in ${path.relative(process.cwd(), 'themes') || 'themes'}`);

const existing = await adapter.getSiteBySlug(values.slug!);
if (existing) await adapter.deleteSite(existing.id);

const { site, editKey, previewKey } = await createSiteWithKeys(adapter, {
  slug: values.slug!,
  theme: values.theme!,
  content,
  orderRef: 'DEMO-SEED',
});

const uploaded: string[] = [];
if (!values['no-photos']) {
  const dir = path.resolve(values.photos!);
  const maxSide = Number(values['photo-max']) || 0;
  const withPhotos = structuredClone(content) as unknown as Record<string, unknown>;
  for (const [key, slot] of Object.entries(theme.manifest.photos)) {
    const file = ['jpg', 'jpeg', 'png', 'webp'].map((ext) => path.join(dir, `${key}.${ext}`)).find((f) => existsSync(f));
    if (!file) continue;
    const saved = await adapter.savePhoto(site.id, { bytes: await photoBytes(file, maxSide) });
    setPath(withPhotos, slot.source, saved.url);
    uploaded.push(`${key} → ${slot.source} (${Math.round(saved.size / 1024)} KB)`);
  }
  if (uploaded.length) await adapter.updateContent(site.id, withPhotos as unknown as ContentRecord);
}
if (!values.draft) await publishSite(adapter, site.id);

const base = process.env.SEED_BASE_URL || 'http://localhost:3000';
const info = {
  slug: site.slug,
  siteId: site.id,
  theme: site.theme,
  status: values.draft ? 'draft' : 'published',
  photos: uploaded,
  site: `${base}/${site.slug}`,
  preview: `${base}/${site.slug}?preview=${previewKey}`,
  edit: `${base}/edit/${site.slug}?k=${editKey}`,
  editKey,
  previewKey,
};
await fs.writeFile(path.join(dataDir, 'seed-keys.json'), JSON.stringify(info, null, 2));

console.log(`Seeded "${site.slug}" (${info.status}) with theme ${site.theme} in ${path.relative(process.cwd(), dataDir) || dataDir}`);
for (const u of uploaded) console.log(`  photo:   ${u}`);
console.log(`  site:    ${info.site}`);
console.log(`  preview: ${info.preview}`);
console.log(`  edit:    ${info.edit}  (panel = task G039)`);
