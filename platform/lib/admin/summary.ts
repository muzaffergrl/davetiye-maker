// What the shop admin shows about a site (G087). Pure functions over SiteRecord: the list, the counts and the
// detail page read only these views, never the raw record (no key hashes, no guest password, no claim token).

import type { SiteRecord } from '../data/types.ts';
import { MARKETING } from '../marketing/config.ts';
import { orderPending } from '../sites.ts';
import { rightsView, siteArchiveDates } from '../panel/rights.ts';
import { messageTemplate } from './messages.ts';
import type { AdminHistoryEntry, AdminSiteState, AdminSiteSummary } from './view.ts';

export * from './view.ts';

const THEME_NAMES: Record<string, string> = Object.fromEntries(MARKETING.designs.map((d) => [d.id, d.name]));

/** Marketing name of a design, else its id in words ("art-deco-black-tie" → "Art Deco Black Tie"). */
export function themeName(id: string): string {
  return THEME_NAMES[id] ?? id.split(/[-_]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function namesOf(site: SiteRecord): string {
  const c = site.content as unknown as { name_display?: unknown; partners?: Array<{ display_name?: unknown }> };
  if (typeof c?.name_display === 'string' && c.name_display.trim()) return c.name_display.trim();
  const parts = (Array.isArray(c?.partners) ? c.partners : []).map((p) => (typeof p?.display_name === 'string' ? p.display_name.trim() : '')).filter(Boolean);
  return parts.join(' & ') || site.slug;
}

function placeOf(site: SiteRecord): string | null {
  const v = (site.content as unknown as { venue?: { name?: unknown; city?: unknown } })?.venue;
  const parts = [v?.name, v?.city].filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim());
  return parts.length ? parts.join(', ') : null;
}

/** Made in the admin ("Yeni sipariş"): no /start claim token, order confirmed by the shop. */
export function madeByShop(site: SiteRecord): boolean {
  return Boolean(site.orderRef) && !site.claimTokenHash && site.orderCheck?.by === 'support' && site.orderCheck.note === SHOP_CREATED_NOTE;
}

/** orderCheck note of sites the shop made in the admin. */
export const SHOP_CREATED_NOTE = 'Dükkân panelinden eklendi';

export function summarizeSite(site: SiteRecord, replies: number, now: Date = new Date()): AdminSiteSummary {
  const rights = rightsView(site, now);
  const pending = orderPending(site);
  const state: AdminSiteState = rights.archived ? 'archived' : site.status === 'published' ? 'published' : 'draft';
  const date = (site.content as unknown as { date?: unknown })?.date;
  return {
    id: site.id,
    slug: site.slug,
    theme: site.theme,
    themeName: themeName(site.theme),
    names: namesOf(site),
    orderRef: site.orderRef,
    ownerEmail: site.ownerEmail,
    state,
    order: pending ? 'pending' : site.orderCheck?.status === 'verified' ? 'verified' : 'not_required',
    orderNote: site.orderCheck?.note ?? null,
    orderCheckedAt: site.orderCheck && site.orderCheck.status === 'verified' ? site.orderCheck.at : null,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
    publishedAt: site.publishedAt,
    firstPublishedAt: rights.firstPublishedAt,
    weddingDate: typeof date === 'string' ? date : null,
    onlineUntil: rights.firstPublishedAt ? rights.onlineUntil : null,
    archiveSource: rights.firstPublishedAt ? (siteArchiveDates(site)?.source ?? null) : null,
    replies,
    changes: rights.phase === 'before_publish' ? null : { used: rights.used, total: rights.limit + rights.granted, left: rights.remaining },
    guestPassword: Boolean(site.guestAccess?.enabled),
    unpublishedChanges:
      site.status === 'published' && site.publishedContent !== null && JSON.stringify(site.content) !== JSON.stringify(site.publishedContent),
    needsAction: pending && !rights.archived,
    note: site.adminNote?.text || null,
    noteAt: site.adminNote?.at ?? null,
    place: placeOf(site),
    madeByShop: madeByShop(site),
  };
}

export function siteHistory(site: SiteRecord): AdminHistoryEntry[] {
  const shop = madeByShop(site);
  const out: AdminHistoryEntry[] = [
    { at: site.createdAt, text: `Site oluşturuldu${site.orderRef ? ` (sipariş #${site.orderRef})` : ''}${shop ? ' — dükkân panelinden' : ''}`, by: shop ? 'support' : 'buyer' },
  ];
  if (site.orderCheck?.status === 'verified' && !shop) {
    out.push({ at: site.orderCheck.at, text: `Sipariş onaylandı${site.orderCheck.note ? `: ${site.orderCheck.note}` : ''}`, by: site.orderCheck.by === 'support' ? 'support' : 'system' });
  }
  const KIND: Record<string, string> = {
    first_publish: 'İlk kez yayınlandı',
    typo: 'İsimde yazım düzeltmesi (ücretsiz)',
    change: 'İsim veya tarih değişti (1 hak kullanıldı)',
    undo: 'Son değişiklik geri alındı (hak iade edildi)',
    sample_date: 'Örnek tarih gerçek tarihle değişti (ücretsiz)',
    grant: 'Ek isim/tarih hakkı eklendi',
    archive_override: 'Yayında kalma tarihi değişti',
  };
  for (const e of site.identity?.log ?? []) {
    out.push({ at: e.at, text: `${KIND[e.kind] ?? e.kind}${e.note ? ` — ${e.note}` : ''}`, by: e.by });
  }
  // G121: Etsy messages copied from the admin (template + time; the text is never kept).
  for (const m of site.messageLog ?? []) {
    out.push({ at: m.at, text: `Etsy mesajı kopyalandı: ${messageTemplate(m.id)?.title ?? m.id}`, by: 'support' });
  }
  return out.sort((a, b) => b.at.localeCompare(a.at));
}
