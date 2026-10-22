// "Trust first, verify later" (CLAIM_ORDER_VERIFICATION=trust). The buyer never waits for the shop: /start makes the
// site with orderCheck "provisional" (lib/claim/verify.ts TrustOrderVerifier) and it can be published at once. Its order
// is checked afterwards, here:
//
//   sweepProvisionalOrders — every provisional site with an order number, oldest first (RECHECK_BATCH per run):
//     Etsy can be asked (app settings + shop connected; or a verifier given by a test):
//       verified                                          -> orderCheck verified by "etsy" (nothing else changes)
//       rejected (not ours / cancelled / refunded / other
//                 email / other design)                   -> HELD: orderCheck pending + offline (lib/sites.ts holdOrder),
//                                                            shop notice "held"
//       still unpaid after the trust window               -> HELD (as above, reason not_paid_in_time)
//       anything else (unpaid for now, Etsy not answering) -> stays provisional
//     past the trust window and still provisional          -> the shop is told ONCE (orderCheck.reviewAt, notice "review");
//                                                            the site stays online: without an answer from Etsy nothing
//                                                            is decided against the buyer
//   Runs from the hourly cron (GET /api/cron/orders, vercel.json; authorised by CRON_SECRET, only in trust mode) and from
//   the admin button "Bekleyen siparişleri Etsy'de kontrol et" (lib/admin/connections.ts).
//
// A held site is a pending site: the buyer's panel shows "We are still confirming your Etsy order", Publish and the shared
// preview are closed; "Siparişi onayla" in the admin releases it. In trust / etsy mode the panel re-checks it with Etsy
// (lib/etsy/recheck.ts autoRecheck) unless the SHOP held it.

import { timingSafeEqual } from 'node:crypto';
import { themeName } from '../admin/summary.ts';
import { getDataAdapter } from '../data/index.ts';
import type { DataAdapter, SiteRecord } from '../data/types.ts';
import { StaleSiteError } from '../data/types.ts';
import { etsySetup, verificationMode } from '../etsy/config.ts';
import { markVerifiedByEtsy, RECHECK_BATCH } from '../etsy/recheck.ts';
import { connectedShop } from '../etsy/shop.ts';
import { EtsyOrderVerifier } from '../etsy/verify.ts';
import { getShopNotifier, type ShopNotifier } from '../mail/index.ts';
import { fail, json, requestOrigin } from '../panel/http.ts';
import { holdOrder, orderProvisional, TRUST_WINDOW_MS, trustExpired } from '../sites.ts';
import type { OrderCheckReason, OrderVerifier } from './verify.ts';

export { TRUST_WINDOW_MS, trustExpired } from '../sites.ts';

export type HoldReason = OrderCheckReason | 'not_paid_in_time';

/** Turkish words for a hold (the note kept with the site and the shop notice). */
export const HOLD_REASON_TEXT: Record<HoldReason, string> = {
  not_found: 'Etsy\'de bu mağazada böyle bir sipariş yok',
  not_paid: 'Etsy\'de sipariş iptal edilmiş ya da tamamı iade edilmiş',
  email_mismatch: 'e-posta Etsy\'deki alıcı e-postasıyla aynı değil',
  theme_mismatch: 'Etsy\'de başka bir tasarım satın alınmış',
  not_paid_in_time: 'sipariş 48 saat içinde Etsy\'de ödenmiş görünmedi',
};

export interface TrustSweepResult {
  siteId: string;
  slug: string;
  orderRef: string | null;
  /** verified / held: decided now; review: the shop was told now; waiting: nothing changed. */
  result: 'verified' | 'held' | 'review' | 'waiting';
  reason?: HoldReason;
}

export interface TrustSweepSummary {
  /** Etsy could be asked in this run. */
  etsy: boolean;
  checked: number;
  verified: number;
  held: number;
  review: number;
  waiting: number;
  /** Provisional sites left for the next run (more than RECHECK_BATCH). */
  remaining: number;
  results: TrustSweepResult[];
}

export interface SweepOptions {
  /** Asks about one order (tests: a fake; null: none); default: Etsy when it is set up and connected, else no automatic check. */
  verifier?: OrderVerifier | null;
  notifier?: ShopNotifier;
  /** Public origin for the admin links in the notices. */
  origin?: string;
  now?: Date;
  windowMs?: number;
}

/** reviewAt := now on a site that is still provisional (idempotent; retried on a concurrent write). */
async function markReviewed(adapter: DataAdapter, siteId: string, now: Date): Promise<boolean> {
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site || !orderProvisional(site) || site.orderCheck!.reviewAt) return false;
    try {
      await adapter.patchSite(siteId, { orderCheck: { ...site.orderCheck!, reviewAt: now.toISOString() } }, { expectedUpdatedAt: site.updatedAt });
      return true;
    } catch (e) {
      if (!(e instanceof StaleSiteError) || attempt >= 5) throw e;
    }
  }
}

async function etsyVerifier(adapter: DataAdapter): Promise<OrderVerifier | null> {
  if (etsySetup().state !== 'ready') return null;
  return (await connectedShop(adapter)) ? new EtsyOrderVerifier({ adapter }) : null;
}

/** One run over the provisional sites (see the top of this file). Never throws for one site: it is left for the next run. */
export async function sweepProvisionalOrders(adapter: DataAdapter, opts: SweepOptions = {}): Promise<TrustSweepSummary> {
  const now = opts.now ?? new Date();
  const windowMs = opts.windowMs ?? TRUST_WINDOW_MS;
  const verifier = opts.verifier === undefined ? await etsyVerifier(adapter) : opts.verifier;
  const notifier = opts.notifier ?? getShopNotifier();
  const origin = (opts.origin ?? process.env.PLATFORM_PUBLIC_URL ?? '').replace(/\/+$/, '');
  const all = (await adapter.listSites()).filter((s) => orderProvisional(s) && s.orderRef).reverse();
  const summary: TrustSweepSummary = { etsy: verifier !== null, checked: 0, verified: 0, held: 0, review: 0, waiting: 0, remaining: Math.max(0, all.length - RECHECK_BATCH), results: [] };

  const notify = async (site: SiteRecord, kind: 'held' | 'review', reason?: HoldReason) => {
    if (!notifier.enabled) return;
    try {
      await notifier.pendingOrder({
        kind,
        orderNumber: site.orderRef ?? '',
        themeName: themeName(site.theme),
        adminUrl: `${origin}/admin/site/${encodeURIComponent(site.id)}`,
        ...(reason ? { reason: HOLD_REASON_TEXT[reason] } : {}),
      });
    } catch (e) {
      console.error(`[trust] shop notice: ${e instanceof Error ? e.name : 'error'}`);
    }
  };

  for (const site of all.slice(0, RECHECK_BATCH)) {
    const base = { siteId: site.id, slug: site.slug, orderRef: site.orderRef };
    const expired = trustExpired(site, now.getTime(), windowMs);
    let result: TrustSweepResult;
    try {
      let hold: HoldReason | null = null;
      let verified = false;
      if (verifier) {
        const check = await verifier.check({ orderNumber: site.orderRef!, email: site.ownerEmail ?? '', theme: site.theme });
        if (check.result === 'verified') verified = true;
        else if (check.result === 'rejected') hold = check.reason;
        else if (check.result === 'pending' && check.unpaid && expired) hold = 'not_paid_in_time';
      }
      if (verified) {
        await markVerifiedByEtsy(adapter, site.id, now);
        result = { ...base, result: 'verified' };
      } else if (hold) {
        await holdOrder(adapter, site.id, { by: 'etsy', note: `Etsy: ${HOLD_REASON_TEXT[hold]}` }, now);
        await notify(site, 'held', hold);
        result = { ...base, result: 'held', reason: hold };
      } else if (expired && !site.orderCheck?.reviewAt && (await markReviewed(adapter, site.id, now))) {
        await notify(site, 'review');
        result = { ...base, result: 'review' };
      } else {
        result = { ...base, result: 'waiting' };
      }
    } catch (e) {
      console.error(`[trust] ${site.slug}: ${e instanceof Error ? e.name : 'error'}`);
      result = { ...base, result: 'waiting' };
    }
    summary.results.push(result);
    summary.checked++;
    summary[result.result]++;
  }
  return summary;
}

// ---------------------------------------------------------------------------------------------
// GET /api/cron/orders — Vercel Cron (vercel.json, hourly). Vercel sends "Authorization: Bearer <CRON_SECRET>" when the
// project has CRON_SECRET; without it the route refuses (503), so nobody else can start a run. Outside trust mode it does
// nothing (provisional sites left from an earlier trust period are still swept by the admin button).

function sameSecret(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function cronOrdersRoute(req: Request, env: Record<string, string | undefined> = process.env): Promise<Response> {
  const secret = (env.CRON_SECRET ?? '').trim();
  if (secret.length < 16) return fail(503, 'not_configured', 'CRON_SECRET is not set.');
  if (!sameSecret(req.headers.get('authorization') ?? '', `Bearer ${secret}`)) return fail(401, 'unauthorized', 'Not allowed.');
  if (verificationMode(env) !== 'trust') return json(200, { ok: true, skipped: 'mode' });
  try {
    const s = await sweepProvisionalOrders(getDataAdapter(), { origin: env.PLATFORM_PUBLIC_URL || requestOrigin(req) });
    // Counts only: no order numbers, addresses or slugs in the cron log.
    return json(200, { ok: true, etsy: s.etsy, checked: s.checked, verified: s.verified, held: s.held, review: s.review, waiting: s.waiting, remaining: s.remaining });
  } catch (e) {
    console.error(`[trust] cron: ${e instanceof Error ? e.name : 'error'}`);
    return fail(500, 'server', 'Something went wrong.');
  }
}
