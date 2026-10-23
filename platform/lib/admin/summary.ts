// What the shop admin shows about a site (G087). Pure functions over SiteRecord: the list, the counts and the
// detail page read only these views, never the raw record (no key hashes, no guest password, no claim token).

import { siteContentUpdatedAt, type SiteRecord } from '../data/types.ts';
import { MARKETING } from '../marketing/config.ts';
import { orderPending, orderProvisional, trustExpired } from '../sites.ts';
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

/**
 * G951: a further website of an order (orderSlot >= 2) is confirmed when the shop confirmed it (by "support": "Siparişi
 * onayla", or made in the admin) or the Etsy receipt that verified it pays for that many websites (orderCheck.units).
 */
export function extraConfirmed(site: Pick<SiteRecord, 'orderCheck'>, slot: number): boolean {
  const c = site.orderCheck;
  return c?.status === 'verified' && (c.by === 'support' || (typeof c.units === 'number' && c.units >= slot));
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
  const provisional = orderProvisional(site);
  const review = provisional && trustExpired(site, now.getTime());
  // G951: the order's lines show no design for this website (services only); until the shop confirms it
  const noDesign = Boolean(site.orderCheck?.noDesign) && site.orderCheck?.status !== 'verified';
  const slot = site.orderSlot ?? 1;
  const extraUnconfirmed = Boolean(site.orderRef) && slot >= 2 && !extraConfirmed(site, slot);
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
    order: pending ? 'pending' : provisional ? 'provisional' : site.orderCheck?.status === 'verified' ? 'verified' : 'not_required',
    orderNote: site.orderCheck?.note ?? null,
    orderCheckedAt: site.orderCheck && site.orderCheck.status === 'verified' ? site.orderCheck.at : null,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
    contentUpdatedAt: siteContentUpdatedAt(site),
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
    needsAction: (pending || review || noDesign || extraUnconfirmed) && !rights.archived,
    orderReview: review,
    orderNoDesign: noDesign,
    orderSlot: slot,
    orderExtraUnconfirmed: extraUnconfirmed,
    note: site.adminNote?.text || null,
    noteAt: site.adminNote?.at ?? null,
    place: placeOf(site),
    madeByShop: madeByShop(site),
    shopEditUntil: site.shopEdit && Date.parse(site.shopEdit.expiresAt) > now.getTime() ? site.shopEdit.expiresAt : null,
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
  // Trust mode: a hold (Etsy's answer or the shop) and the one 48-hour reminder.
  if (site.orderCheck?.status === 'pending' && site.orderCheck.by !== 'claim') {
    out.push({ at: site.orderCheck.at, text: `Sipariş beklemeye alındı, site yayından kalktı${site.orderCheck.note ? `: ${site.orderCheck.note}` : ''}`, by: site.orderCheck.by === 'support' ? 'support' : 'system' });
  }
  if (site.orderCheck?.status === 'provisional' && site.orderCheck.reviewAt) {
    out.push({ at: site.orderCheck.reviewAt, text: 'Sipariş 48 saatte doğrulanamadı; dükkâna hatırlatıldı', by: 'system' });
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
  // G145: the shop's own edit link (opened / ended; the key is never kept here).
  for (const e of site.shopEditLog ?? []) {
    out.push({ at: e.at, text: e.kind === 'issued' ? 'Dükkân düzenleme linki açıldı (72 saat; alıcının linki değişmedi)' : 'Dükkân düzenleme linki kapatıldı', by: 'support' });
  }
  return out.sort((a, b) => b.at.localeCompare(a.at));
}
