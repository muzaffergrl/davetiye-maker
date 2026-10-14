// Operator tool (G060, docs/16 §11.5): after the shop has checked a buyer's case (e.g. the wedding was
// really postponed), add name/date changes to their site, or move its archive date.
//
//   node scripts/grant-identity-change.ts (--order <Etsy order number> | --slug <address>) --add <n> --reason "<text>"
//   node scripts/grant-identity-change.ts (--order <no> | --slug <address>) --archive-on <YYYY-MM-DD> --reason "<text>"
//   node scripts/grant-identity-change.ts (--order <no> | --slug <address>) --archive-on clear --reason "<text>"
//   node scripts/grant-identity-change.ts (--order <no> | --slug <address>) --show
//
// Uses the storage DATA_ADAPTER selects (local by default; blob needs BLOB_READ_WRITE_TOKEN). Every grant
// and override is written into the site's own log with the reason (personal data: it is deleted with the site).
// The support policy (when to grant, how many) is the shop owner's decision and is not encoded here.
//
// Exit codes: 0 done, 1 site not found / not possible, 2 bad arguments.

import { parseArgs } from 'node:util';
import { normalizeOrderNumber } from '../lib/claim/fields.ts';
import { getDataAdapter, type DataAdapter, type SiteRecord } from '../lib/data/index.ts';
import { rightsView } from '../lib/panel/rights.ts';
import { grantIdentityChanges, setArchiveOverride } from '../lib/sites.ts';

export async function findSite(adapter: DataAdapter, opts: { order?: string | null; slug?: string | null }): Promise<SiteRecord> {
  if (opts.order) {
    const order = normalizeOrderNumber(opts.order);
    if (!order) throw new Error(`"${opts.order}" is not an order number (8–12 digits).`);
    const sites = await adapter.findSitesByOrderRef(order);
    if (sites.length > 1) throw new Error(`Order ${order} has ${sites.length} sites (${sites.map((s) => s.slug).join(', ')}); use --slug.`);
    if (!sites[0]) throw new Error(`No site for order ${order}.`);
    return sites[0];
  }
  if (opts.slug) {
    const site = await adapter.getSiteBySlug(opts.slug.trim().toLowerCase());
    if (!site) throw new Error(`No site at "${opts.slug}".`);
    return site;
  }
  throw new Error('Give --order or --slug.');
}

export function describeRights(site: SiteRecord, now: Date = new Date()): string {
  const r = rightsView(site, now);
  if (r.phase === 'before_publish') return `${site.slug}: never published (names and date are still free to change).`;
  return [
    `${site.slug}: ${r.archived ? 'ARCHIVED' : site.status}`,
    `  name/date changes: ${r.used} used of ${r.limit}${r.granted ? ` + ${r.granted} granted` : ''} -> ${r.remaining} left`,
    `  online until: ${r.onlineUntil ?? '?'} (archive at ${r.archiveAt ?? '?'})${site.archiveOverrideAt ? `, support override ${site.archiveOverrideAt}` : ''}`,
  ].join('\n');
}

async function main(): Promise<number> {
  let values;
  try {
    ({ values } = parseArgs({
      options: {
        order: { type: 'string' },
        slug: { type: 'string' },
        add: { type: 'string' },
        reason: { type: 'string' },
        'archive-on': { type: 'string' },
        show: { type: 'boolean' },
      },
      strict: true,
    }));
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return 2;
  }
  const usage = 'Usage: node scripts/grant-identity-change.ts (--order <no> | --slug <address>) (--add <n> | --archive-on <YYYY-MM-DD|clear> | --show) [--reason "<text>"]';
  const actions = [values.add !== undefined, values['archive-on'] !== undefined, Boolean(values.show)].filter(Boolean).length;
  if ((!values.order && !values.slug) || actions !== 1) {
    console.error(usage);
    return 2;
  }
  if (!values.show && !values.reason?.trim()) {
    console.error('Give --reason "<why>" (it is kept in the site log).');
    return 2;
  }
  try {
    const adapter = getDataAdapter();
    let site = await findSite(adapter, { order: values.order ?? null, slug: values.slug ?? null });
    if (values.add !== undefined) {
      const add = Number(values.add);
      site = await grantIdentityChanges(adapter, site.id, add, values.reason!.trim());
      console.log(`Added ${add} name/date ${add === 1 ? 'change' : 'changes'}.`);
    } else if (values['archive-on'] !== undefined) {
      const day = values['archive-on'] === 'clear' ? null : values['archive-on'];
      site = await setArchiveOverride(adapter, site.id, day, values.reason!.trim());
      console.log(day ? `Archive date set to ${day} (00:00, the site's time zone).` : 'Archive date override removed.');
    }
    console.log(describeRights(site));
    return 0;
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((code) => process.exit(code));
}
