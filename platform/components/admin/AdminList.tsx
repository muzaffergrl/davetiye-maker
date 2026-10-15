'use client';
// Shop admin — every website (G087). Filter chips with counts ("Yapılacak" first), search by order number, email,
// names, address or design; each card opens the site's page. Filtering happens in the browser (the shop's volume).
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { filterSites, type AdminCounts, type AdminFilter, type AdminSiteSummary } from '../../lib/admin/view.ts';
import styles from './admin.module.css';
import { stamp } from './format.ts';
import { StateBadges } from './badges.tsx';

const FILTERS: Array<{ id: AdminFilter; label: string; count: (c: AdminCounts) => number }> = [
  { id: 'action', label: 'Yapılacak', count: (c) => c.needsAction },
  { id: 'all', label: 'Hepsi', count: (c) => c.total },
  { id: 'published', label: 'Yayında', count: (c) => c.published },
  { id: 'draft', label: 'Taslak', count: (c) => c.draft },
  { id: 'archived', label: 'Arşiv', count: (c) => c.archived },
];

export default function AdminList({ sites, counts }: { sites: AdminSiteSummary[]; counts: AdminCounts }) {
  const [filter, setFilter] = useState<AdminFilter>(counts.needsAction > 0 ? 'action' : 'all');
  const [query, setQuery] = useState('');
  const shown = useMemo(() => filterSites(sites, filter, query), [sites, filter, query]);

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
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} aria-hidden />
        <label htmlFor="admin-search" className={styles.visuallyHidden}>
          Ara
        </label>
        <input
          id="admin-search"
          className={styles.input}
          type="search"
          placeholder="Sipariş no, e-posta, isimler, adres…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>
      <p className={styles.visuallyHidden} role="status">
        {shown.length} site
      </p>
      {shown.length === 0 ? (
        <div className={styles.empty} data-admin-empty="">
          {filter === 'action' && !query
            ? 'Yapılacak bir şey yok. Onay bekleyen yeni siparişler burada görünür.'
            : sites.length === 0
              ? 'Henüz site yok. Alıcı /start sayfasında sitesini başlattığında burada görünür.'
              : 'Bu aramayla eşleşen site yok.'}
        </div>
      ) : (
        <div className={styles.grid}>
          {shown.map((s) => (
            <Link key={s.id} href={`/admin/site/${s.id}`} className={`${styles.siteCard} ${s.needsAction ? styles.siteCardAction : ''}`} data-site={s.slug}>
              <StateBadges summary={s} />
              <p className={styles.siteNames}>{s.names}</p>
              <p className={styles.siteMeta}>
                /{s.slug} · {s.themeName}
              </p>
              <p className={styles.siteMeta}>
                {s.orderRef ? `Sipariş #${s.orderRef} · ` : ''}
                {stamp(s.createdAt)}
                {s.replies ? ` · ${s.replies} yanıt` : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
