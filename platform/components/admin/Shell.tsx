// Frame of every shop admin page (G087, G095): brand bar, link to the sales site, sign-out, and the section
// navigation (Özet · Siparişler · Müşteriler · Tasarımlar · Yeni sipariş). Server component.
import { ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandLogo } from '../panel/Brand.tsx';
import { PANEL_FONTS } from '../panel/fonts.ts';
import { SignOutButton } from './AdminLogin.tsx';
import styles from './admin.module.css';
import '../fx/admin-fx.css';

export type AdminSection = 'dashboard' | 'orders' | 'customers' | 'designs' | 'new';

const NAV: Array<{ id: AdminSection; href: string; label: string }> = [
  { id: 'dashboard', href: '/admin', label: 'Özet' },
  { id: 'orders', href: '/admin/orders', label: 'Siparişler' },
  { id: 'customers', href: '/admin/customers', label: 'Müşteriler' },
  { id: 'designs', href: '/admin/designs', label: 'Tasarımlar' },
];

export function AdminShell({ children, signedIn, narrow = false, active }: { children: ReactNode; signedIn: boolean; narrow?: boolean; active?: AdminSection }) {
  return (
    <div className={`${styles.root} ${PANEL_FONTS}`} data-admin="">
      <div className={styles.top}>
        <header className={styles.bar}>
          <Link href="/admin" aria-label="Dükkân yönetimi — Özet" style={{ display: 'inline-flex' }}>
            <BrandLogo height={22} />
          </Link>
          <span className={styles.barTitle}>Dükkân yönetimi</span>
          {signedIn ? (
            <>
              <a className={styles.barLink} href="/" target="_blank" rel="noreferrer" data-admin-site-link="">
                Site <ExternalLink size={14} aria-hidden />
              </a>
              <SignOutButton />
            </>
          ) : null}
        </header>
        {signedIn ? (
          <nav className={styles.nav} aria-label="Yönetim bölümleri">
            <div className={styles.navInner}>
              {NAV.map((n) => (
                <Link key={n.id} href={n.href} className={styles.navLink} aria-current={active === n.id ? 'page' : undefined} data-nav={n.id}>
                  {n.label}
                </Link>
              ))}
              <Link href="/admin/new" className={`${styles.navLink} ${styles.navNew}`} aria-current={active === 'new' ? 'page' : undefined} data-nav="new">
                <Plus size={16} aria-hidden /> Yeni sipariş
              </Link>
            </div>
          </nav>
        ) : null}
      </div>
      <main className={styles.main} style={narrow ? { maxWidth: 760 } : undefined}>
        {children}
      </main>
    </div>
  );
}
