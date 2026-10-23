// Re-checking "pending" orders with Etsy (G147). A site claimed while the Etsy check could not run (shop not connected
// yet, payment still processing, manual mode) waits with orderCheck "pending". Once Etsy confirms the receipt, the site
// is marked verified by "etsy" — no shop action needed:
//   - admin "Bekleyen siparişleri Etsy'de kontrol et" (every pending site, any verification mode, while Etsy is connected);
//   - automatically in "etsy" and "trust" mode while the buyer's panel is open (its state poll, at most every
//     RECHECK_POLL_MS per site) and when the buyer presses Publish (at most every RECHECK_PUBLISH_MS per site).
// A rejected re-check changes nothing (the site stays pending for the shop to look at); only "verified" writes.
// A site the SHOP held in the admin (trust mode, orderCheck.by "support") is never released by a re-check: only the
// shop's "Siparişi onayla" does that. Provisional sites (trust mode) are checked by lib/claim/trust.ts.

import { getClaimRateLimiter } from '../claim/limits.ts';
import { checkCoversSlot, orderCoverage, type OrderCheck, type OrderVerifier } from '../claim/verify.ts';
import { StaleSiteError, type DataAdapter, type SiteRecord } from '../data/types.ts';
import { orderPending } from '../sites.ts';
import { isPrivateTheme, loadTheme } from '../theme/theme.ts';
import { etsySetup, verificationMode } from './config.ts';
import { connectedShop } from './shop.ts';
import { EtsyOrderVerifier } from './verify.ts';

export const RECHECK_POLL_MS = 2 * 60_000;
export const RECHECK_PUBLISH_MS = 15_000;
/** One admin click checks at most this many pending sites (Etsy: about 10 requests a second per app). */
export const RECHECK_BATCH = 100;

export interface RecheckResult {
  siteId: string;
  slug: string;
  orderRef: string | null;
  result: OrderCheck['result'] | 'skipped';
  reason?: string;
}

/**
 * orderCheck := verified by Etsy (idempotent; retried on a concurrent write). `units` (G951): the receipt's websites, kept
 * so the admin knows this website is one the order pays for.
 */
export async function markVerifiedByEtsy(adapter: DataAdapter, siteId: string, now: Date = new Date(), opts: { units?: number | null } = {}): Promise<SiteRecord> {
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site) throw new Error(`site ${siteId} not found`);
    if (site.orderCheck?.status === 'verified') return site;
    const orderCheck = {
      status: 'verified' as const,
      at: now.toISOString(),
      by: 'etsy' as const,
      note: 'Etsy receipt paid (automatic check)',
      ...(typeof opts.units === 'number' ? { units: opts.units } : {}),
    };
    try {
      return await adapter.patchSite(siteId, { orderCheck }, { expectedUpdatedAt: site.updatedAt });
    } catch (e) {
      if (!(e instanceof StaleSiteError) || attempt >= 5) throw e;
    }
  }
}

/** G951: is this a private custom design (G151)? Its order's custom-design line counts as its website. */
export async function themeIsPrivate(themeId: string): Promise<boolean> {
  try {
    const t = await loadTheme(themeId);
    return Boolean(t && isPrivateTheme(t.manifest));
  } catch {
    return false;
  }
}

/** G951: orderCheck.noDesign := true (once; nothing else changes; retried on a concurrent write). */
export async function markNoDesign(adapter: DataAdapter, siteId: string): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site?.orderCheck || site.orderCheck.noDesign || site.orderCheck.status === 'verified') return;
    try {
      await adapter.patchSite(siteId, { orderCheck: { ...site.orderCheck, noDesign: true } }, { expectedUpdatedAt: site.updatedAt });
      return;
    } catch (e) {
      if (!(e instanceof StaleSiteError) || attempt >= 5) throw e;
    }
  }
}

/** Asks Etsy about one pending site; marks it verified when Etsy confirms. */
export async function recheckSite(adapter: DataAdapter, site: SiteRecord, opts: { verifier?: OrderVerifier; now?: Date } = {}): Promise<RecheckResult> {
  const base = { siteId: site.id, slug: site.slug, orderRef: site.orderRef };
  if (!orderPending(site) || !site.orderRef || site.orderCheck?.by === 'support') return { ...base, result: 'skipped' };
  const verifier = opts.verifier ?? new EtsyOrderVerifier({ adapter });
  const check = await verifier.check({ orderNumber: site.orderRef, email: site.ownerEmail ?? '', theme: site.theme });
  if (check.result === 'verified') {
    // G951: only when the order pays for THIS website (not services only; a further website within the receipt's units)
    const priv = await themeIsPrivate(site.theme);
    if (checkCoversSlot(check, site.orderSlot ?? 1, priv)) {
      const c = orderCoverage(check, priv);
      await markVerifiedByEtsy(adapter, site.id, opts.now, { units: c.receipt ? c.units : null });
      return { ...base, result: 'verified' };
    }
    if (orderCoverage(check, priv).noDesign) await markNoDesign(adapter, site.id);
    return { ...base, result: 'pending', reason: orderCoverage(check, priv).noDesign ? 'no_design' : 'more_sites_than_units' };
  }
  return { ...base, result: check.result, ...(check.result === 'rejected' ? { reason: check.reason } : {}) };
}

export interface RecheckSummary {
  ok: boolean;
  /** Why nothing was checked. */
  problem?: 'not_configured' | 'not_connected';
  checked: number;
  verified: number;
  pending: number;
  rejected: number;
  unavailable: number;
  /** Pending sites left for another click (more than RECHECK_BATCH). */
  remaining: number;
  results: RecheckResult[];
}

/** Admin button: every pending site, oldest first, one at a time. */
export async function recheckPendingOrders(adapter: DataAdapter, opts: { verifier?: OrderVerifier; now?: Date } = {}): Promise<RecheckSummary> {
  const empty = { checked: 0, verified: 0, pending: 0, rejected: 0, unavailable: 0, remaining: 0, results: [] };
  if (!opts.verifier) {
    if (etsySetup().state !== 'ready') return { ok: false, problem: 'not_configured', ...empty };
    if (!(await connectedShop(adapter))) return { ok: false, problem: 'not_connected', ...empty };
  }
  const pending = (await adapter.listSites()).filter((s) => orderPending(s) && s.orderRef && s.orderCheck?.by !== 'support').reverse();
  const summary: RecheckSummary = { ok: true, ...empty, remaining: Math.max(0, pending.length - RECHECK_BATCH) };
  for (const site of pending.slice(0, RECHECK_BATCH)) {
    const r = await recheckSite(adapter, site, opts);
    summary.results.push(r);
    summary.checked++;
    if (r.result === 'verified') summary.verified++;
    else if (r.result === 'rejected') summary.rejected++;
    else if (r.result === 'unavailable') summary.unavailable++;
    else if (r.result === 'pending' || r.result === 'not_checked') summary.pending++;
  }
  return summary;
}

/**
 * The buyer's panel (state poll / Publish) in "etsy" mode: re-checks a pending site at most once per `windowMs` (shared
 * counter across server instances) and returns the site as it is now. Never throws: any problem leaves the site as it was.
 */
export async function autoRecheck(adapter: DataAdapter, site: SiteRecord, windowMs: number = RECHECK_POLL_MS): Promise<SiteRecord> {
  if (!orderPending(site) || !site.orderRef || site.orderCheck?.by === 'support') return site;
  const mode = verificationMode();
  if ((mode !== 'etsy' && mode !== 'trust') || etsySetup().state !== 'ready') return site;
  try {
    if (!(await connectedShop(adapter))) return site;
    const hit = await getClaimRateLimiter().hit(`etsy-recheck:${windowMs}:${site.id}`, { limit: 1, windowMs });
    if (!hit.allowed) return site;
    const r = await recheckSite(adapter, site);
    return r.result === 'verified' ? ((await adapter.getSiteById(site.id)) ?? site) : site;
  } catch (e) {
    console.error(`[etsy] re-check ${site.slug}: ${e instanceof Error ? e.name : 'error'}`);
    return site;
  }
}
