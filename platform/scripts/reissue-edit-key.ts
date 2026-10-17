// Operator tool: a new edit link for a site whose buyer lost theirs (or whose order number someone
// else claimed first while Etsy verification is off — after the shop has confirmed the real buyer).
//
//   node scripts/reissue-edit-key.ts --order <Etsy order number> --origin https://<public host>
//   node scripts/reissue-edit-key.ts --slug <site address> --origin https://<public host>
//
// Uses the storage DATA_ADAPTER selects (local by default; blob needs BLOB_READ_WRITE_TOKEN).
// New edit + preview keys are created and only their hashes stored: the OLD edit link and preview
// link stop working at once. The new link is printed ONCE to stdout and never written anywhere;
// send it to the buyer through the Etsy conversation. The site's content, photos, replies and
// publish state are not touched (the owner email kept with the site is not changed either).
//
// Exit codes: 0 done, 1 site not found / several sites for one order, 2 bad arguments.

import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { normalizeOrderNumber } from '../lib/claim/fields.ts';
import { getDataAdapter, type DataAdapter, type SiteRecord } from '../lib/data/index.ts';
import { reissueKeys } from '../lib/sites.ts';

export interface ReissueResult {
  site: SiteRecord;
  editUrl: string;
}

/** Finds the site by order number or slug and reissues its keys. Throws with a readable message. */
export async function reissueEditLink(
  adapter: DataAdapter,
  opts: { order?: string | null; slug?: string | null; origin: string },
): Promise<ReissueResult> {
  let site: SiteRecord | null = null;
  if (opts.order) {
    const order = normalizeOrderNumber(opts.order);
    if (!order) throw new Error(`"${opts.order}" is not an order number (8–12 digits).`);
    const sites = await adapter.findSitesByOrderRef(order);
    if (sites.length > 1) throw new Error(`Order ${order} has ${sites.length} sites (${sites.map((s) => s.slug).join(', ')}); use --slug.`);
    site = sites[0] ?? null;
    if (!site) throw new Error(`No site for order ${order}.`);
  } else if (opts.slug) {
    site = await adapter.getSiteBySlug(opts.slug.trim().toLowerCase());
    if (!site) throw new Error(`No site at "${opts.slug}".`);
  } else {
    throw new Error('Give --order or --slug.');
  }
  const origin = opts.origin.replace(/\/+$/, '');
  if (!/^https?:\/\/[^/]+$/.test(origin)) throw new Error(`--origin must look like https://example.vercel.app (got "${opts.origin}").`);
  const reissued = await reissueKeys(adapter, site.id);
  return { site: reissued.site, editUrl: `${origin}/edit/${reissued.site.slug}?k=${encodeURIComponent(reissued.editKey)}` };
}

async function main(): Promise<number> {
  let values;
  try {
    ({ values } = parseArgs({
      options: { order: { type: 'string' }, slug: { type: 'string' }, origin: { type: 'string' } },
      strict: true,
    }));
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return 2;
  }
  if ((!values.order && !values.slug) || !values.origin) {
    console.error('Usage: node scripts/reissue-edit-key.ts (--order <no> | --slug <address>) --origin https://<host>');
    return 2;
  }
  try {
    const { site, editUrl } = await reissueEditLink(getDataAdapter(), {
      order: values.order ?? null,
      slug: values.slug ?? null,
      origin: values.origin,
    });
    console.log(`Site:   ${site.slug} (${site.status}${site.orderRef ? `, order ${site.orderRef}` : ''})`);
    console.log(`New edit link (shown once; the old link no longer works):`);
    console.log(editUrl);
    return 0;
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code));
}
