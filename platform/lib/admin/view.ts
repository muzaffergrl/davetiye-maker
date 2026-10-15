// Admin view types and the list's filter (G087). Pure, no server imports: the browser list (components/admin)
// filters with these; lib/admin/summary.ts builds the summaries on the server.

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
      const hay = [s.slug, s.names, s.ownerEmail ?? '', s.themeName, s.theme].join(' ').toLowerCase();
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

