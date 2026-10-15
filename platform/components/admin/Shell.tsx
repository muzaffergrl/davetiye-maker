// Frame of every shop admin page (G087): brand bar, sign-out, fonts. Server component.
import type { ReactNode } from 'react';
import { BrandLogo } from '../panel/Brand.tsx';
import { PANEL_FONTS } from '../panel/fonts.ts';
import { SignOutButton } from './AdminLogin.tsx';
import styles from './admin.module.css';

export function AdminShell({ children, signedIn, narrow = false }: { children: ReactNode; signedIn: boolean; narrow?: boolean }) {
  return (
    <div className={`${styles.root} ${PANEL_FONTS}`} data-admin="">
      <header className={styles.bar}>
        <BrandLogo height={22} />
        <span className={styles.barTitle}>Dükkân yönetimi</span>
        {signedIn ? <SignOutButton /> : null}
      </header>
      <main className={styles.main} style={narrow ? { maxWidth: 760 } : undefined}>
        {children}
      </main>
    </div>
  );
}
