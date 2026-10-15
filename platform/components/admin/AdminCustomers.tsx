'use client';
// Shop admin — customers (G095): buyers grouped by email, with their orders/websites. Search by email, names,
// order number, address or design. Every site row opens the site's page.
import { Mail, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { filterCustomers, type AdminCustomer } from '../../lib/admin/view.ts';
import styles from './admin.module.css';
import { StateBadges } from './badges.tsx';
import { CopyButton } from './CopyButton.tsx';
import { stamp } from './format.ts';

export default function AdminCustomers({ customers }: { customers: AdminCustomer[] }) {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => filterCustomers(customers, query), [customers, query]);
  return (
    <>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} aria-hidden />
        <label htmlFor="customer-search" className={styles.visuallyHidden}>
          Müşteri ara
        </label>
        <input
          id="customer-search"
          className={styles.input}
          type="search"
          placeholder="E-posta, isimler, sipariş no…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>
      <p className={styles.visuallyHidden} role="status">
        {shown.length} müşteri
      </p>
      {shown.length === 0 ? (
        <div className={styles.empty} data-admin-empty="">
          {customers.length === 0 ? 'Henüz müşteri yok. E-postayla açılan her site bir müşteri olarak burada görünür.' : 'Bu aramayla eşleşen müşteri yok.'}
        </div>
      ) : (
        <div className={styles.grid}>
          {shown.map((c) => (
            <section key={c.email} className={`${styles.siteCard} ${c.needsAction ? styles.siteCardAction : ''}`} data-customer={c.email}>
              <p className={styles.siteNames} style={{ marginTop: 0 }}>
                {c.names.join(' · ')}
              </p>
              <p className={styles.siteMeta} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Mail size={14} aria-hidden /> {c.email} <CopyButton value={c.email} label="E-postayı kopyala" />
              </p>
              <p className={styles.siteMeta} style={{ marginTop: 6 }}>
                {c.orders} sipariş · {c.published} yayında · {c.replies} RSVP yanıtı · ilk {stamp(c.firstAt)}
              </p>
              <ul className={styles.rows} style={{ marginTop: 8 }}>
                {c.sites.map((s) => (
                  <li key={s.id} className={styles.rowItem}>
                    <Link href={`/admin/site/${s.id}`} className={styles.rowLink}>
                      <span className={styles.rowMain}>
                        <span className={styles.rowTitle} style={{ display: 'block', fontSize: 15 }}>
                          {s.orderRef ? `#${s.orderRef}` : `/${s.slug}`} · {s.themeName}
                        </span>
                        <span className={styles.siteMeta} style={{ display: 'block' }}>
                          /{s.slug}
                        </span>
                      </span>
                      <StateBadges summary={s} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
