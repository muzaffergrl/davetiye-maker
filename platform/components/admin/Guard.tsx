// Server-side page gate shared by the admin pages (G095): off / sign-in, else the page inside the frame.
import type { ReactNode } from 'react';
import { adminPageState } from '../../lib/admin/page.ts';
import { AdminGate } from './Gate.tsx';
import { AdminShell, type AdminSection } from './Shell.tsx';
import styles from './admin.module.css';

export async function AdminPage({ active, narrow, children }: { active?: AdminSection; narrow?: boolean; children: (temporaryPassword: boolean) => Promise<ReactNode> | ReactNode }) {
  const state = await adminPageState();
  if (!state.signedIn) {
    return (
      <AdminShell signedIn={false}>
        <AdminGate config={state.config} />
      </AdminShell>
    );
  }
  return (
    <AdminShell signedIn active={active} narrow={narrow}>
      {state.temporaryPassword && active === 'dashboard' ? (
        <div className={styles.callout} role="note" data-temporary-password="">
          <p className={styles.calloutTitle} style={{ marginBottom: 4 }}>
            Geçici kısa şifre
          </p>
          <p style={{ margin: 0 }}>
            Panel şu an kısa bir şifreyle açık. Gerçek satışa (lansman) geçmeden önce en az 12 karakterli bir şifreye geçilmeli; kısa şifreyle
            lansman build&apos;i durur.
          </p>
        </div>
      ) : null}
      {await children(state.temporaryPassword)}
    </AdminShell>
  );
}
