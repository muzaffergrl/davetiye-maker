// Operator tool (G060-fix): with CLAIM_ORDER_VERIFICATION=manual a site claimed on /start waits ("pending") until
// the shop has checked the order in Etsy Shop Manager: the receipt exists, belongs to our shop, is paid (not
// refunded or cancelled) and is for the design the buyer chose. Then:
//
//   node scripts/verify-order.ts --order <Etsy order number> --reason "<what was checked>"
//   node scripts/verify-order.ts --slug <address> --reason "<what was checked>"
//   node scripts/verify-order.ts (--order <no> | --slug <address>) --show
//
// The site can then be published. Nothing is sent to the buyer: their editor shows "Publish" again on its next load.
// Uses the storage DATA_ADAPTER selects (local by default; blob needs BLOB_READ_WRITE_TOKEN).
//
// Exit codes: 0 done, 1 site not found / not possible, 2 bad arguments.

import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { getDataAdapter, type SiteRecord } from '../lib/data/index.ts';
import { confirmOrder } from '../lib/sites.ts';
import { findSite } from './grant-identity-change.ts';

export function describeOrder(site: SiteRecord): string {
  const check = site.orderCheck;
  const state = !check
    ? 'no check required (claimed while checks were off)'
    : check.status === 'pending'
      ? `PENDING: cannot be published yet${check.note ? ` (${check.note})` : ''}`
      : check.status === 'provisional'
        ? 'PROVISIONAL (trust mode): can be published, order not verified yet'
        : `confirmed ${check.at} by ${check.by}${check.note ? ` (${check.note})` : ''}`;
  return [`${site.slug}: ${site.status}`, `  order ${site.orderRef ?? '—'} (theme ${site.theme}): ${state}`].join('\n');
}

async function main(): Promise<number> {
  let values;
  try {
    ({ values } = parseArgs({
      options: { order: { type: 'string' }, slug: { type: 'string' }, reason: { type: 'string' }, show: { type: 'boolean' } },
      strict: true,
    }));
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return 2;
  }
  if ((!values.order && !values.slug) || (!values.show && !values.reason?.trim())) {
    console.error('Usage: node scripts/verify-order.ts (--order <no> | --slug <address>) (--reason "<what was checked>" | --show)');
    return 2;
  }
  try {
    const adapter = getDataAdapter();
    let site = await findSite(adapter, { order: values.order ?? null, slug: values.slug ?? null });
    if (!values.show) {
      site = await confirmOrder(adapter, site.id, values.reason!);
      console.log('Order confirmed: the site can be published.');
    }
    console.log(describeOrder(site));
    return 0;
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code));
}
