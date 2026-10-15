'use client';
// Shop admin sign-in (G087). One shared password (ADMIN_PASSWORD); the server sets an HttpOnly session cookie.
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import styles from './admin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!password) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPassword('');
        router.refresh();
        return;
      }
      const body = await res.json().catch(() => null);
      setError(
        res.status === 429
          ? 'Çok fazla deneme. Birkaç dakika bekleyip tekrar deneyin.'
          : res.status === 401
            ? 'Şifre doğru değil.'
            : (body?.message ?? 'Giriş yapılamadı.'),
      );
    } catch {
      setError('Bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={styles.card} data-admin-login="">
      <label className={styles.label} htmlFor="admin-password">
        Şifre
      </label>
      <input
        id="admin-password"
        className={styles.input}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'admin-login-error' : undefined}
        required
      />
      {error ? (
        <p id="admin-login-error" className={`${styles.status} ${styles.statusErr}`} role="alert">
          {error}
        </p>
      ) : null}
      <button className={`${styles.btn} ${styles.full}`} type="submit" disabled={busy} style={{ marginTop: 16 }}>
        {busy ? 'Giriş yapılıyor…' : 'Giriş yap'}
      </button>
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className={styles.btnSmall}
      onClick={async () => {
        await fetch('/api/admin/session', { method: 'DELETE' }).catch(() => undefined);
        router.push('/admin');
        router.refresh();
      }}
    >
      Çıkış
    </button>
  );
}
