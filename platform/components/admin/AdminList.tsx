'use client';
// Shop admin — every order/website (G087, G095). Filter chips with counts ("Yapılacak" first), search by order
// number, email, names, address, venue, design or note; sort; CSV export. Each card opens the site's page.
// Filtering happens in the browser (the shop's volume).
import { Download, Search, StickyNote } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { filterSites, orderWithoutSite, SORT_LABELS, sortSites, type AdminCounts, type AdminFilter, type AdminSiteSummary, type AdminSort } from '../../lib/admin/view.ts';
import styles from './admin.module.css';
import { day, stamp } from './format.ts';
import { StateBadges } from './badges.tsx';

const FILTERS: Array<{ id: AdminFilter; label: string; count: (c: AdminCounts) => number }> = [
  { id: 'action', label: 'Yapılacak', count: (c) => c.needsAction },
  { id: 'all', label: 'Hepsi', count: (c) => c.total },
  { id: 'published', label: 'Yayında', count: (c) => c.published },
  { id: 'draft', label: 'Taslak', count: (c) => c.draft },
  { id: 'archived', label: 'Arşiv', count: (c) => c.archived },
];

export default function AdminList({
  sites,
  counts,
  initialFilter = null,
  initialQuery = '',
}: {
  sites: AdminSiteSummary[];
  counts: AdminCounts;
  initialFilter?: AdminFilter | null;
  initialQuery?: string;
}) {
  const [filter, setFilter] = useState<AdminFilter>(initialFilter ?? (counts.needsAction > 0 ? 'action' : 'all'));
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<AdminSort>('newest');
  const shown = useMemo(() => sortSites(filterSites(sites, filter, query), sort), [sites, filter, query, sort]);
  // G121 (docs/19 §6 A4): an Etsy order number with no website yet — "never started" is known only by searching for it.
  const notStarted = useMemo(() => orderWithoutSite(sites, query), [sites, query]);

  return (
    <>
      <div className={styles.chips} role="group" aria-label="Filtre">
        {FILTERS.map((f) => {
          const n = f.count(counts);
          return (
            <button key={f.id} type="button" className={styles.chip} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} data-filter={f.id}>
              {f.label}
              {f.id === 'action' && n > 0 ? <span className={styles.chipAlert}>{n}</span> : <span className={styles.chipCount}>{n}</span>}
            </button>
          );
        })}
      </div>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={18} className={styles.searchIcon} aria-hidden />
          <label htmlFor="admin-search" className={styles.visuallyHidden}>
            Ara
          </label>
          <input
            id="admin-search"
            className={styles.input}
            type="search"
            placeholder="Sipariş no, e-posta, isimler, adres, mekân…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <label htmlFor="admin-sort" className={styles.visuallyHidden}>
          Sırala
        </label>
        <select id="admin-sort" className={styles.select} value={sort} onChange={(e) => setSort(e.target.value as AdminSort)} data-sort="">
          {(Object.keys(SORT_LABELS) as AdminSort[]).map((k) => (
            <option key={k} value={k}>
              {SORT_LABELS[k]}
            </option>
          ))}
        </select>
        <a className={styles.btnSmall} href="/api/admin/export" download data-export="">
          <Download size={16} aria-hidden /> CSV
        </a>
      </div>
      <p className={styles.visuallyHidden} role="status">
        {shown.length} site
      </p>
      {notStarted ? (
        <div className={styles.empty} data-not-started={notStarted}>
          #{notStarted} numaralı siparişle açılmış site yok: alıcı henüz başlatmamış olabilir. Hatırlatmak için{' '}
          <Link className={styles.link} href="/admin/designs">
            Tasarımlar
          </Link>{' '}
          sayfasından tasarımın başlatma linkini kopyalayıp Etsy&apos;den yazın; ya da{' '}
          <Link className={styles.link} href="/admin/new">
            Yeni sipariş
          </Link>{' '}
          ile siteyi siz açın.
        </div>
      ) : shown.length === 0 ? (
        <div className={styles.empty} data-admin-empty="">
          {filter === 'action' && !query
            ? 'Yapılacak bir şey yok. Onay bekleyen yeni siparişler burada görünür.'
            : sites.length === 0
              ? 'Henüz site yok. Alıcı /start sayfasında sitesini başlattığında ya da siz "Yeni sipariş" eklediğinizde burada görünür.'
              : 'Bu aramayla eşleşen site yok.'}
        </div>
      ) : (
        <div className={styles.grid}>
          {shown.map((s) => (
            <Link key={s.id} href={`/admin/site/${s.id}`} className={`${styles.siteCard} ${s.needsAction ? styles.siteCardAction : ''}`} data-site={s.slug}>
              <StateBadges summary={s} />
              <p className={styles.siteNames}>{s.names}</p>
              <p className={styles.siteMeta}>
                {s.orderRef ? `#${s.orderRef} · ` : ''}
                {s.themeName}
              </p>
              <p className={styles.siteMeta}>{s.ownerEmail ?? 'E-posta yok'}</p>
              <p className={styles.siteMeta}>
                Düğün {day(s.weddingDate)}
                {s.replies ? ` · ${s.replies} yanıt` : ''} · {stamp(s.createdAt)}
              </p>
              {s.note ? (
                <p className={styles.noteLine}>
                  <StickyNote size={14} aria-hidden style={{ verticalAlign: '-2px' }} /> {s.note.length > 80 ? `${s.note.slice(0, 80)}…` : s.note}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
