'use client';
// "Yeni sipariş" form (G095): design, Etsy order number, buyer's email, first names, optional address → POST
// /api/admin/sites. The edit link is shown ONCE with the ready Etsy message (template shop_created_site).
// G951: an order number that already has websites shows them; the shop can add one more website to that order only
// after ticking "the Etsy order holds one more design" (addToOrder) and sending again.
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { messageTemplate, renderMessage } from '../../lib/admin/messages.ts';
import type { AdminCreateField } from '../../lib/admin/create.ts';
import styles from './admin.module.css';
import { CopyButton } from './CopyButton.tsx';

type Created = { id: string; slug: string; editUrl: string; siteUrl: string; names: string; design: string };
type OrderSite = { id: string; slug: string; themeName: string; names: string; ownerEmail: string | null };

export default function AdminNew({ themes, initialTheme }: { themes: Array<{ id: string; name: string; privateOrders?: string[] }>; initialTheme: string }) {
  const router = useRouter();
  const [v, setV] = useState({ theme: initialTheme, orderNumber: '', email: '', name1: '', name2: '', slug: '' });
  const [errors, setErrors] = useState<Partial<Record<AdminCreateField, string>>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [orderSites, setOrderSites] = useState<OrderSite[] | null>(null);
  const [addToOrder, setAddToOrder] = useState(false);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);

  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => {
    setV((x) => ({ ...x, [k]: e.target.value }));
    // another order number: the confirmation was for the previous one
    if (k === 'orderNumber') {
      setOrderSites(null);
      setAddToOrder(false);
    }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage(null);
    setExistingId(null);
    try {
      const res = await fetch('/api/admin/sites', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...v, ...(orderSites && addToOrder ? { addToOrder: true } : {}) }),
      });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!data?.ok) {
        setErrors(data?.fields ?? {});
        setMessage(data?.message ?? 'Olmadı. Tekrar deneyin.');
        setExistingId(data?.existingId ?? null);
        setOrderSites(Array.isArray(data?.orderSites) ? data.orderSites : null);
        return;
      }
      setOrderSites(null);
      setAddToOrder(false);
      const design = themes.find((t) => t.id === v.theme)?.name ?? v.theme;
      const names = [v.name1.trim(), v.name2.trim()].filter(Boolean).join(' & ');
      setCreated({ id: data.id, slug: data.slug, editUrl: data.editUrl, siteUrl: data.siteUrl, names, design });
    } catch {
      setMessage('Bağlantı kurulamadı. Tekrar deneyin.');
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    const t = messageTemplate('shop_created_site')!;
    const rendered = renderMessage(t, { names: created.names, order: v.orderNumber, design: created.design, siteUrl: created.siteUrl, startUrl: '', editUrl: created.editUrl });
    return (
      <section className={styles.card} data-created={created.slug}>
        <p className={styles.calloutTitle} style={{ color: 'var(--c-success)' }}>
          <Check size={18} aria-hidden /> Site oluşturuldu: /{created.slug}
        </p>
        <p className={styles.label}>Düzenleme linki (yalnız şimdi gösterilir, kaydedilmez)</p>
        <p className={styles.secret}>{created.editUrl}</p>
        <div className={styles.row}>
          <CopyButton value={created.editUrl} label="Linki kopyala" />
        </div>
        <h2 className={styles.h2} style={{ marginTop: 20 }}>
          Etsy mesajı
        </h2>
        <p className={styles.actionText}>Kopyalayın ve Etsy&apos;de bu siparişin konuşmasına yapıştırın.</p>
        <label className={styles.visuallyHidden} htmlFor="created-msg">
          Mesaj metni
        </label>
        <textarea id="created-msg" className={`${styles.textarea} ${styles.messageText}`} readOnly value={rendered.text} />
        <div className={styles.row} style={{ marginTop: 10 }}>
          {rendered.missing.length ? (
            <p className={`${styles.status} ${styles.statusErr}`}>Eksik: {rendered.missing.join(', ')}</p>
          ) : (
            <CopyButton value={rendered.text} label="Mesajı kopyala" />
          )}
        </div>
        <div className={styles.row} style={{ marginTop: 20 }}>
          <Link className={styles.btn} href={`/admin/site/${created.id}`}>
            Siparişe git <ArrowRight size={18} aria-hidden />
          </Link>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => {
              setCreated(null);
              setV({ theme: v.theme, orderNumber: '', email: '', name1: '', name2: '', slug: '' });
            }}
          >
            Bir sipariş daha
          </button>
        </div>
      </section>
    );
  }

  const field = (id: AdminCreateField, label: string, input: React.ReactNode, hint?: string) => (
    <div>
      <label className={styles.label} htmlFor={`new-${id}`}>
        {label}
      </label>
      {input}
      {errors[id] ? (
        <p className={styles.fieldErr} id={`new-${id}-err`}>
          {errors[id]}
        </p>
      ) : hint ? (
        <p className={styles.hint}>{hint}</p>
      ) : null}
    </div>
  );
  const err = (id: AdminCreateField) => (errors[id] ? { 'aria-invalid': true as const, 'aria-describedby': `new-${id}-err` } : {});

  return (
    <form className={styles.card} onSubmit={submit} noValidate data-new-order="">
      <div className={styles.formGrid}>
        {field(
          'theme',
          'Tasarım',
          <select id="new-theme" className={styles.select} value={v.theme} onChange={set('theme')} {...err('theme')}>
            <option value="">Seçin…</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.privateOrders ? `${t.name} (özel tasarım)` : t.name}
              </option>
            ))}
          </select>,
        )}
        {field(
          'orderNumber',
          'Etsy sipariş numarası',
          <input id="new-orderNumber" className={styles.input} inputMode="numeric" autoComplete="off" value={v.orderNumber} onChange={set('orderNumber')} {...err('orderNumber')} />,
          'Etsy → Siparişler; 8–12 rakam.',
        )}
        {field(
          'email',
          'Alıcının e-postası',
          <input id="new-email" className={styles.input} type="email" autoComplete="off" value={v.email} onChange={set('email')} {...err('email')} />,
        )}
        {field(
          'slug',
          'Site adresi (isteğe bağlı)',
          <input id="new-slug" className={styles.input} autoCapitalize="none" spellCheck={false} autoComplete="off" value={v.slug} onChange={set('slug')} {...err('slug')} />,
          'Boş bırakırsanız isimlerden üretilir (ör. emma-and-james).',
        )}
        {field('name1', '1. isim', <input id="new-name1" className={styles.input} autoComplete="off" value={v.name1} onChange={set('name1')} {...err('name1')} />)}
        {field('name2', '2. isim', <input id="new-name2" className={styles.input} autoComplete="off" value={v.name2} onChange={set('name2')} {...err('name2')} />)}
      </div>
      {message ? (
        <p className={`${styles.status} ${styles.statusErr}`} role="alert">
          {message}{' '}
          {existingId && !orderSites ? (
            <Link className={styles.link} href={`/admin/site/${existingId}`}>
              Mevcut siteyi aç <ExternalLink size={14} aria-hidden style={{ verticalAlign: '-2px' }} />
            </Link>
          ) : null}
        </p>
      ) : null}
      {orderSites ? (
        <div className={styles.callout} style={{ marginTop: 12 }} data-order-sites={orderSites.length}>
          <p className={styles.calloutTitle}>Bu siparişin siteleri ({orderSites.length})</p>
          <ul className={styles.history} style={{ overflowWrap: 'anywhere' }}>
            {orderSites.map((o) => (
              <li key={o.id}>
                <strong>{o.themeName}</strong> · {o.names} · /{o.slug}
                {o.ownerEmail ? ` · ${o.ownerEmail}` : ''}{' '}
                <Link className={styles.link} href={`/admin/site/${o.id}`}>
                  Aç <ExternalLink size={14} aria-hidden style={{ verticalAlign: '-2px' }} />
                </Link>
              </li>
            ))}
          </ul>
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10 }}>
            <input type="checkbox" checked={addToOrder} onChange={(e) => setAddToOrder(e.target.checked)} data-add-to-order="" />
            <span>Etsy&apos;de baktım: bu siparişte bir tasarım daha var. Bu siparişe bir site daha ekle.</span>
          </label>
        </div>
      ) : null}
      <button type="submit" className={`${styles.btn} ${styles.full}`} style={{ marginTop: 18 }} disabled={busy || (orderSites !== null && !addToOrder)} data-action="create">
        {busy ? 'Oluşturuluyor…' : orderSites ? 'Bu siparişe site ekle' : 'Siteyi oluştur'}
      </button>
      <p className={styles.hint}>Site, tasarımın örnek metin ve fotoğraflarıyla açılır; alıcı her şeyi kendi panelinden değiştirir.</p>
    </form>
  );
}
