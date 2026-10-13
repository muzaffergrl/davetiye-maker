// npm run seed [-- --theme <id>] [--slug <slug>] [--content <path>] [--draft]
//
// Creates (or re-creates) a demo site in the local data folder (PLATFORM_DATA_DIR,
// default platform/.data) from a collection's content.demo.json and publishes it.
// Default: collections/03_Blush_Garden_Rose/content.demo.json on the _sample theme.
// The edit/preview keys are printed and saved to <data>/seed-keys.json (gitignored).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { localDataDir } from '../lib/data/index.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const platformRoot = path.resolve(here, '..');
process.chdir(platformRoot); // themes/ and .data/ resolve from platform/

const { values } = parseArgs({
  options: {
    theme: { type: 'string', default: '_sample' },
    slug: { type: 'string', default: 'clara-and-julian' },
    content: { type: 'string', default: path.resolve(platformRoot, '../collections/03_Blush_Garden_Rose/content.demo.json') },
    draft: { type: 'boolean', default: false },
  },
});

const dataDir = localDataDir();
const adapter = new LocalAdapter(dataDir);
const content = JSON.parse(await fs.readFile(path.resolve(values.content!), 'utf8')) as ContentRecord;

const existing = await adapter.getSiteBySlug(values.slug!);
if (existing) await adapter.deleteSite(existing.id);

const { site, editKey, previewKey } = await createSiteWithKeys(adapter, {
  slug: values.slug!,
  theme: values.theme!,
  content,
  orderRef: 'DEMO-SEED',
});
if (!values.draft) await publishSite(adapter, site.id);

const base = process.env.SEED_BASE_URL || 'http://localhost:3000';
const info = {
  slug: site.slug,
  theme: site.theme,
  status: values.draft ? 'draft' : 'published',
  site: `${base}/${site.slug}`,
  preview: `${base}/${site.slug}?preview=${previewKey}`,
  edit: `${base}/edit/${site.slug}?k=${editKey}`,
  editKey,
  previewKey,
};
await fs.writeFile(path.join(dataDir, 'seed-keys.json'), JSON.stringify(info, null, 2));

console.log(`Seeded "${site.slug}" (${info.status}) with theme ${site.theme} in ${path.relative(process.cwd(), dataDir) || dataDir}`);
console.log(`  site:    ${info.site}`);
console.log(`  preview: ${info.preview}`);
console.log(`  edit:    ${info.edit}  (panel = task G039)`);
