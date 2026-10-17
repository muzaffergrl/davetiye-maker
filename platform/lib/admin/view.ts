// Admin view types and the list's filter (G087). Pure, no server imports: the browser list (components/admin)
// filters with these; lib/admin/summary.ts builds the summaries on the server.

import { normalizeOrderNumber } from '../claim/fields.ts';

export type AdminSiteState = 'draft' | 'published' | 'archived';
export type AdminOrderState = 'pending' | 'verified' | 'not_required';

export interface AdminSiteSummary {
  id: string;
  slug: string;
  theme: string;
  themeName: string;
  names: string;
  orderRef: string | null;
  ownerEmail: string | null;
  state: AdminSiteState;
  order: AdminOrderState;
  orderNote: string | null;
  orderCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** G151: last change of the website content (not the shop's notes, messages, links): "Son değişiklik" + the to-do. */
  contentUpdatedAt?: string;
  publishedAt: string | null;
  firstPublishedAt: string | null;
  /** YYYY-MM-DD from the draft. */
  weddingDate: string | null;
  /** Last day online (YYYY-MM-DD), once known. */
  onlineUntil: string | null;
  archiveSource: 'wedding_date' | 'ceiling' | 'support' | null;
  replies: number;
  /** Name/date changes: null before the first publish (nothing is counted yet). */
  changes: { used: number; total: number; left: number } | null;
  guestPassword: boolean;
  /** The draft differs from what guests see (published sites only). */
  unpublishedChanges: boolean;
  /** Something the shop has to do: an order to confirm. */
  needsAction: boolean;
  /** The shop's private note (never shown to the buyer). */
  note: string | null;
  noteAt: string | null;
  /** Venue name and city from the draft ("The Willow Grove Estate, Asheville"), or null. */
  place: string | null;
  /** Made by the shop in the admin ("Yeni sipariş"), not by the buyer on /start. */
  madeByShop: boolean;
  /** G145: until when the shop's own edit link works (null: none open). */
  shopEditUntil: string | null;
}

export interface AdminCounts {
  total: number;
  needsAction: number;
  published: number;
  draft: number;
  archived: number;
  replies: number;
}

export function countSites(list: readonly AdminSiteSummary[]): AdminCounts {
  return {
    total: list.length,
    needsAction: list.filter((s) => s.needsAction).length,
    published: list.filter((s) => s.state === 'published').length,
    draft: list.filter((s) => s.state === 'draft').length,
    archived: list.filter((s) => s.state === 'archived').length,
    replies: list.reduce((n, s) => n + s.replies, 0),
  };
}

export type AdminFilter = 'action' | 'all' | 'published' | 'draft' | 'archived';
export type AdminSort = 'newest' | 'oldest' | 'wedding' | 'replies' | 'names';

export const SORT_LABELS: Record<AdminSort, string> = {
  newest: 'En yeni sipariş',
  oldest: 'En eski sipariş',
  wedding: 'Düğün tarihi (yakın önce)',
  replies: 'En çok RSVP',
  names: 'İsim (A–Z)',
};

/** Sort a filtered list (filterSites keeps "needs action" first; an explicit sort replaces that order). */
export function sortSites(list: readonly AdminSiteSummary[], sort: AdminSort): AdminSiteSummary[] {
  const out = [...list];
  switch (sort) {
    case 'oldest':
      return out.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case 'wedding':
      return out.sort((a, b) => (a.weddingDate ?? '9999').localeCompare(b.weddingDate ?? '9999'));
    case 'replies':
      return out.sort((a, b) => b.replies - a.replies || b.createdAt.localeCompare(a.createdAt));
    case 'names':
      return out.sort((a, b) => a.names.localeCompare(b.names, 'tr'));
    default:
      return out;
  }
}

/** Filter + free-text search (order number, email, names, address, design). Sites needing action come first. */
export function filterSites(list: readonly AdminSiteSummary[], filter: AdminFilter, query: string): AdminSiteSummary[] {
  const q = query.trim().toLowerCase().replace(/^#/, '');
  const digits = q.replace(/\D/g, '');
  return list
    .filter((s) => {
      if (filter === 'action' && !s.needsAction) return false;
      if (filter === 'published' && s.state !== 'published') return false;
      if (filter === 'draft' && s.state !== 'draft') return false;
      if (filter === 'archived' && s.state !== 'archived') return false;
      if (!q) return true;
      const hay = [s.slug, s.names, s.ownerEmail ?? '', s.themeName, s.theme, s.place ?? '', s.note ?? ''].join(' ').toLowerCase();
      return hay.includes(q) || (digits.length >= 3 && (s.orderRef ?? '').includes(digits));
    })
    .sort((a, b) => Number(b.needsAction) - Number(a.needsAction) || b.createdAt.localeCompare(a.createdAt));
}

/** One history line for the detail page (newest first). */
export interface AdminHistoryEntry {
  at: string;
  text: string;
  by: 'buyer' | 'support' | 'system';
}


// --- dashboard, customers, designs (G095) ---------------------------------------------------------------

const DAY_MS = 86_400_000;

/** Calendar day (YYYY-MM-DD) of an instant in the shop's time zone (Türkiye, UTC+3 all year). */
export function shopDay(iso: string): string {
  return new Date(Date.parse(iso) + 3 * 3_600_000).toISOString().slice(0, 10);
}

/** Order reference of the demo sites `npm run seed` makes (scripts/seed.ts): never a sale. */
export const DEMO_ORDER_PREFIX = 'DEMO-SEED-';

/** A demo site from the seed script (shown in lists with a "Demo" badge, never counted as a sale). */
export function isDemo(s: Pick<AdminSiteSummary, 'orderRef'>): boolean {
  return (s.orderRef ?? '').startsWith(DEMO_ORDER_PREFIX);
}

/** Orders = sites started with an Etsy order number (demo/test sites without one, and seeded demos, are not sales). */
export function isSale(s: AdminSiteSummary): boolean {
  return Boolean(s.orderRef) && !isDemo(s);
}

export interface AdminTodo {
  kind: 'confirm' | 'shop_edit' | 'not_published' | 'closing' | 'unpublished_changes';
  site: AdminSiteSummary;
  /** Turkish one-liner for the shop. */
  text: string;
}

export interface AdminDashboard {
  sales: { total: number; today: number; last7: number; last30: number; thisMonth: number };
  sites: AdminCounts;
  /** Sales per week, oldest first (8 weeks, the last one is the current week so far). */
  weeks: Array<{ start: string; count: number }>;
  /** Best sellers first. */
  byDesign: Array<{ theme: string; name: string; count: number }>;
  todos: AdminTodo[];
  recent: AdminSiteSummary[];
  /** Weddings in the next 60 days (published or not), soonest first. */
  upcoming: AdminSiteSummary[];
  customers: number;
}

/** Started but not published after this many days: a gentle reminder may help (template start_link_reminder / how_to_publish). */
export const NOT_PUBLISHED_AFTER_DAYS = 5;
/** Published sites closing (archive day) within this many days. */
export const CLOSING_WITHIN_DAYS = 30;

export function adminDashboard(list: readonly AdminSiteSummary[], now: Date = new Date()): AdminDashboard {
  const sales = list.filter(isSale);
  const t = now.getTime();
  const today = shopDay(now.toISOString());
  const month = today.slice(0, 7);
  const since = (days: number) => sales.filter((s) => t - Date.parse(s.createdAt) < days * DAY_MS).length;

  // Weeks start on Monday (shop time).
  const todayDate = new Date(`${today}T00:00:00Z`);
  const monday = new Date(todayDate.getTime() - ((todayDate.getUTCDay() + 6) % 7) * DAY_MS);
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(monday.getTime() - (7 - i) * 7 * DAY_MS).toISOString().slice(0, 10);
    const end = new Date(Date.parse(`${start}T00:00:00Z`) + 7 * DAY_MS).toISOString().slice(0, 10);
    return { start, count: sales.filter((s) => { const d = shopDay(s.createdAt); return d >= start && d < end; }).length };
  });

  const counts = new Map<string, { theme: string; name: string; count: number }>();
  for (const s of sales) {
    const row = counts.get(s.theme) ?? { theme: s.theme, name: s.themeName, count: 0 };
    row.count++;
    counts.set(s.theme, row);
  }

  const todos: AdminTodo[] = [];
  for (const s of list) {
    if (s.needsAction) todos.push({ kind: 'confirm', site: s, text: `Sipariş #${s.orderRef ?? '—'} onay bekliyor` });
  }
  // G145: a shop edit link left open (setup service): close it when the work is done.
  for (const s of list) {
    if (s.shopEditUntil) todos.push({ kind: 'shop_edit', site: s, text: 'Dükkân düzenleme linki açık — iş bittiyse kapatıp "Kurulum bitti" mesajını gönderin' });
  }
  for (const s of list) {
    if (s.state === 'draft' && !s.firstPublishedAt && !s.needsAction && isSale(s) && t - Date.parse(s.createdAt) > NOT_PUBLISHED_AFTER_DAYS * DAY_MS) {
      const days = Math.floor((t - Date.parse(s.createdAt)) / DAY_MS);
      todos.push({ kind: 'not_published', site: s, text: `${days} gündür yayınlanmadı — hatırlatma mesajı gönderilebilir` });
    }
  }
  for (const s of list) {
    if (s.state === 'published' && s.onlineUntil) {
      const left = Math.round((Date.parse(`${s.onlineUntil}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS);
      if (left >= 0 && left <= CLOSING_WITHIN_DAYS) todos.push({ kind: 'closing', site: s, text: `${left} gün sonra kapanıyor (${s.onlineUntil})` });
    }
  }
  for (const s of list) {
    if (s.unpublishedChanges && t - Date.parse(s.contentUpdatedAt || s.updatedAt) > 2 * DAY_MS) {
      todos.push({ kind: 'unpublished_changes', site: s, text: 'Yayınlanmamış değişiklikleri var (alıcı Publish\'e basmamış olabilir)' });
    }
  }

  const in60 = new Date(t + 60 * DAY_MS).toISOString().slice(0, 10);
  const upcoming = list
    .filter((s) => s.state !== 'archived' && s.weddingDate && s.weddingDate >= today && s.weddingDate <= in60)
    .sort((a, b) => (a.weddingDate ?? '').localeCompare(b.weddingDate ?? ''));

  return {
    sales: {
      total: sales.length,
      today: sales.filter((s) => shopDay(s.createdAt) === today).length,
      last7: since(7),
      last30: since(30),
      thisMonth: sales.filter((s) => shopDay(s.createdAt).startsWith(month)).length,
    },
    sites: countSites(list),
    weeks,
    byDesign: [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    todos,
    recent: [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6),
    upcoming,
    customers: adminCustomers(list).length,
  };
}

export interface AdminCustomer {
  /** Lower-case email; the key of the customer. */
  email: string;
  /** Couples' names on their sites (usually one). */
  names: string[];
  sites: AdminSiteSummary[];
  orders: number;
  firstAt: string;
  lastAt: string;
  replies: number;
  published: number;
  needsAction: boolean;
}

/** Buyers grouped by email (sites without an email are not customers: demos, tests). Most recent first. */
export function adminCustomers(list: readonly AdminSiteSummary[]): AdminCustomer[] {
  const map = new Map<string, AdminCustomer>();
  for (const s of list) {
    const email = (s.ownerEmail ?? '').trim().toLowerCase();
    if (!email) continue;
    const c = map.get(email) ?? { email, names: [], sites: [], orders: 0, firstAt: s.createdAt, lastAt: s.createdAt, replies: 0, published: 0, needsAction: false };
    c.sites.push(s);
    if (!c.names.includes(s.names)) c.names.push(s.names);
    if (isSale(s)) c.orders++;
    if (s.createdAt < c.firstAt) c.firstAt = s.createdAt;
    if (s.createdAt > c.lastAt) c.lastAt = s.createdAt;
    c.replies += s.replies;
    if (s.state === 'published') c.published++;
    if (s.needsAction) c.needsAction = true;
    map.set(email, c);
  }
  return [...map.values()].sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

export function filterCustomers(list: readonly AdminCustomer[], query: string): AdminCustomer[] {
  const q = query.trim().toLowerCase().replace(/^#/, '');
  if (!q) return [...list];
  return list.filter((c) => [c.email, ...c.names, ...c.sites.map((s) => `${s.slug} ${s.orderRef ?? ''} ${s.themeName}`)].join(' ').toLowerCase().includes(q));
}

export interface AdminDesignRow {
  id: string;
  name: string;
  /** Sold on the sales site / Etsy now. */
  live: boolean;
  sales: number;
  published: number;
  replies: number;
  lastSaleAt: string | null;
}

/** One row per design: the shop's catalogue (live first) plus any theme a site uses. */
export function adminDesigns(list: readonly AdminSiteSummary[], catalogue: ReadonlyArray<{ id: string; name: string; live: boolean }>): AdminDesignRow[] {
  const rows = new Map<string, AdminDesignRow>();
  for (const d of catalogue) rows.set(d.id, { id: d.id, name: d.name, live: d.live, sales: 0, published: 0, replies: 0, lastSaleAt: null });
  for (const s of list) {
    const row = rows.get(s.theme) ?? { id: s.theme, name: s.themeName, live: false, sales: 0, published: 0, replies: 0, lastSaleAt: null };
    if (isSale(s)) {
      row.sales++;
      if (!row.lastSaleAt || s.createdAt > row.lastSaleAt) row.lastSaleAt = s.createdAt;
    }
    if (s.state === 'published') row.published++;
    row.replies += s.replies;
    rows.set(s.theme, row);
  }
  return [...rows.values()].sort((a, b) => Number(b.live) - Number(a.live) || b.sales - a.sales || a.name.localeCompare(b.name));
}

/** Orders as CSV for a spreadsheet (UTF-8 with BOM, Excel-friendly; cells guarded against formulas). */
export function ordersCsv(list: readonly AdminSiteSummary[], origin: string): string {
  const cell = (v: unknown) => {
    let t = v === null || v === undefined ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`;
    return /[",\n\r;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const STATE: Record<AdminSiteState, string> = { draft: 'Taslak', published: 'Yayında', archived: 'Arşiv' };
  const ORDER: Record<AdminOrderState, string> = { pending: 'Onay bekliyor', verified: 'Onaylandı', not_required: 'Gerekmedi' };
  const head = ['Sipariş no', 'Oluşturma', 'E-posta', 'İsimler', 'Tasarım', 'Durum', 'Sipariş kontrolü', 'Düğün tarihi', 'Mekân', 'Adres', 'RSVP yanıtı', 'İlk yayın', 'Yayında kalır', 'Not'];
  const rows = list.map((s) => [
    s.orderRef ?? '',
    s.createdAt,
    s.ownerEmail ?? '',
    s.names,
    s.themeName,
    STATE[s.state],
    ORDER[s.order],
    s.weddingDate ?? '',
    s.place ?? '',
    `${origin}/${s.slug}`,
    s.replies,
    s.firstPublishedAt ?? '',
    s.onlineUntil ?? '',
    s.note ?? '',
  ]);
  return '\ufeff' + [head, ...rows].map((r) => r.map(cell).join(',')).join('\r\n') + '\r\n';
}

/**
 * The template the message box opens with (G121, docs/19 §6 A2/A5): an order waiting for confirmation → "Publish is
 * waiting"; a live site closing within 30 days → "closing soon"; otherwise "how to publish".
 */
export function defaultTemplateId(s: Pick<AdminSiteSummary, 'needsAction' | 'state' | 'onlineUntil'>, now: number = Date.now()): string {
  if (s.needsAction) return 'publish_blocked_pending';
  if (s.state === 'published' && s.onlineUntil) {
    const left = (Date.parse(`${s.onlineUntil}T00:00:00Z`) - now) / DAY_MS;
    if (left >= -1 && left <= CLOSING_WITHIN_DAYS) return 'archive_notice';
  }
  return 'how_to_publish';
}

/**
 * G121 (docs/19 §6 A4): the search is an Etsy order number (the /start rule, lib/claim/fields.ts)
 * and no website was started with it → that number (the admin then suggests the start-link reminder). Else null.
 */
export function orderWithoutSite(list: readonly Pick<AdminSiteSummary, 'orderRef'>[], query: string): string | null {
  const order = normalizeOrderNumber(query);
  if (!order) return null;
  return list.some((s) => s.orderRef === order) ? null : order;
}
