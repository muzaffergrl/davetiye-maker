'use client';
// Shop admin — one website (G087, K30). Order: what to do now (confirm the order) → facts → ready Etsy messages →
// support actions → delete → history. Every action calls /api/admin/sites/<id>/<action> (lib/admin/api.ts), which
// runs the same lib/sites.ts functions the old terminal scripts used.
import { ArrowLeft, Check, Copy, ExternalLink, Hourglass } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { MESSAGE_TEMPLATES } from '../../lib/admin/messages.ts';
import type { AdminHistoryEntry, AdminSiteSummary } from '../../lib/admin/view.ts';
import styles from './admin.module.css';
import { StateBadges } from './badges.tsx';
import { day, stamp } from './format.ts';

const ETSY_ORDERS_URL = 'https://www.etsy.com/your/orders/sold';

type Status = { kind: 'ok' | 'err'; text: string } | null;

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

function CopyButton({ value, label = 'Kopyala' }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={styles.btnSmall}
      onClick={async () => {
        if (await copyText(value)) {
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        }
      }}
    >
      {done ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      {done ? 'Kopyalandı' : label}
    </button>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function StatusLine({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p className={`${styles.status} ${status.kind === 'ok' ? styles.statusOk : styles.statusErr}`} role={status.kind === 'err' ? 'alert' : 'status'}>
      {status.text}
    </p>
  );
}

export default function AdminSite(props: { summary: AdminSiteSummary; history: AdminHistoryEntry[]; origin: string }) {
  const router = useRouter();
  const [s, setS] = useState(props.summary);
  const [history, setHistory] = useState(props.history);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [editUrl, setEditUrl] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const [note, setNote] = useState('Etsy\'de kontrol edildi: ödendi, iade/iptal yok, tasarım doğru');
  const [grantAdd, setGrantAdd] = useState('1');
  const [grantReason, setGrantReason] = useState('');
  const [archiveDay, setArchiveDay] = useState('');
  const [archiveReason, setArchiveReason] = useState('');
  const [deleteSlug, setDeleteSlug] = useState('');

  const siteUrl = `${props.origin}/${s.slug}`;
  const startUrl = `${props.origin}/start?theme=${encodeURIComponent(s.theme)}`;

  const templates = useMemo(() => MESSAGE_TEMPLATES.filter((t) => !t.needsEditUrl || editUrl), [editUrl]);
  const [templateId, setTemplateId] = useState(s.needsAction ? 'publish_blocked_pending' : 'how_to_publish');
  const template = templates.find((t) => t.id === templateId) ?? templates[0];
  const message = template.body({ names: s.names, order: s.orderRef, siteUrl, editUrl, startUrl, changesLeft: s.changes?.left ?? null });

  async function run(action: string, body: Record<string, unknown> = {}, ok?: string): Promise<boolean> {
    setBusy(action);
    setStatus((m) => ({ ...m, [action]: null }));
    try {
      const res = await fetch(`/api/admin/sites/${encodeURIComponent(s.id)}/${action}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 401) {
        router.refresh();
        return false;
      }
      if (!res.ok || !data?.ok) {
        setStatus((m) => ({ ...m, [action]: { kind: 'err', text: data?.message ?? 'Olmadı. Tekrar deneyin.' } }));
        return false;
      }
      if (data.deleted) {
        router.push('/admin');
        router.refresh();
        return true;
      }
      setS(data.summary);
      setHistory(data.history);
      if (data.editUrl) setEditUrl(data.editUrl);
      if (ok) setStatus((m) => ({ ...m, [action]: { kind: 'ok', text: ok } }));
      return true;
    } catch {
      setStatus((m) => ({ ...m, [action]: { kind: 'err', text: 'Bağlantı kurulamadı. Tekrar deneyin.' } }));
      return false;
    } finally {
      setBusy(null);
      setConfirming(null);
    }
  }

  return (
    <>
      <Link href="/admin" className={`${styles.link} ${styles.back}`}>
        <ArrowLeft size={18} aria-hidden /> Bütün siteler
      </Link>
      <StateBadges summary={s} />
      <h1 className={styles.h1} style={{ marginTop: 10 }}>
        {s.names}
      </h1>
      <p className={styles.lead}>
        /{s.slug} · {s.themeName}
        {s.state === 'published' ? (
          <>
            {' · '}
            <a className={styles.link} href={siteUrl} target="_blank" rel="noreferrer">
              Siteyi aç <ExternalLink size={14} aria-hidden style={{ verticalAlign: '-2px' }} />
            </a>
          </>
        ) : null}
      </p>

      {s.needsAction ? (
        <section className={styles.callout} aria-labelledby="todo-title" data-todo="confirm">
          <h2 id="todo-title" className={styles.calloutTitle}>
            <Hourglass size={18} aria-hidden /> Yapılacak: siparişi onayla
          </h2>
          <p style={{ margin: '0 0 8px' }}>Alıcı siteyi düzenleyebiliyor ama siz onaylayana kadar yayınlayamaz.</p>
          <ol className={styles.steps}>
            <li>
              Etsy&apos;de siparişi bulun: <strong>#{s.orderRef ?? '—'}</strong>{' '}
              {s.orderRef ? <CopyButton value={s.orderRef} label="Numarayı kopyala" /> : null}{' '}
              <a className={styles.link} href={ETSY_ORDERS_URL} target="_blank" rel="noreferrer">
                Etsy siparişleri <ExternalLink size={14} aria-hidden style={{ verticalAlign: '-2px' }} />
              </a>
            </li>
            <li>
              Ödenmiş mi, iade/iptal yok mu, alınan tasarım <strong>{s.themeName}</strong> mi?
              {s.ownerEmail ? (
                <>
                  {' '}
                  Alıcının yazdığı e-posta: <strong>{s.ownerEmail}</strong>
                </>
              ) : null}
            </li>
            <li>Uyuyorsa onaylayın; sonra aşağıdan &quot;Sipariş onaylandı&quot; mesajını kopyalayıp Etsy&apos;den gönderin.</li>
          </ol>
          <label className={styles.label} htmlFor="confirm-note">
            Not (siteyle saklanır)
          </label>
          <input id="confirm-note" className={styles.input} value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} />
          <div className={styles.row} style={{ marginTop: 12 }}>
            <button
              type="button"
              className={styles.btn}
              disabled={busy !== null}
              onClick={async () => {
                if (await run('confirm', { note }, 'Sipariş onaylandı. Alıcı artık yayınlayabilir.')) setTemplateId('order_confirmed');
              }}
              data-action="confirm"
            >
              <Check size={18} aria-hidden /> Siparişi onayla
            </button>
          </div>
          <StatusLine status={status.confirm ?? null} />
          <p className={styles.hint}>Sipariş uymuyorsa onaylamayın; alıcıya Etsy&apos;den yazın. Gerekirse siteyi en alttan silebilirsiniz.</p>
        </section>
      ) : status.confirm ? (
        <div className={styles.card}>
          <StatusLine status={status.confirm} />
        </div>
      ) : null}

      <section className={styles.card} aria-labelledby="facts-title">
        <h2 id="facts-title" className={styles.h2}>
          Bilgiler
        </h2>
        <dl className={styles.facts}>
          <Fact label="Sipariş">{s.orderRef ? <>#{s.orderRef} <CopyButton value={s.orderRef} /></> : '—'}</Fact>
          <Fact label="Sipariş kontrolü">
            {s.order === 'pending' ? 'Onay bekliyor' : s.order === 'verified' ? `Onaylandı · ${stamp(s.orderCheckedAt)}` : 'Gerekmedi'}
          </Fact>
          <Fact label="E-posta">{s.ownerEmail ? <>{s.ownerEmail} <CopyButton value={s.ownerEmail} /></> : '—'}</Fact>
          <Fact label="Tasarım">{s.themeName}</Fact>
          <Fact label="Adres">
            {siteUrl.replace(/^https?:\/\//, '')} <CopyButton value={siteUrl} />
          </Fact>
          <Fact label="Oluşturuldu">{stamp(s.createdAt)}</Fact>
          <Fact label="İlk yayın">{stamp(s.firstPublishedAt)}</Fact>
          <Fact label="Son değişiklik">{stamp(s.updatedAt)}</Fact>
          <Fact label="Düğün tarihi">{day(s.weddingDate)}</Fact>
          <Fact label="Yayında kalır">{s.onlineUntil ? `${day(s.onlineUntil)} dahil` : 'İlk yayından sonra belli olur'}</Fact>
          <Fact label="RSVP yanıtı">{s.replies}</Fact>
          <Fact label="İsim/tarih hakkı">{s.changes ? `${s.changes.left} / ${s.changes.total} kaldı` : 'İlk yayından sonra sayılır'}</Fact>
          <Fact label="Misafir şifresi">{s.guestPassword ? 'Açık' : 'Kapalı'}</Fact>
        </dl>
      </section>

      <section className={styles.card} aria-labelledby="msg-title">
        <h2 id="msg-title" className={styles.h2}>
          Etsy mesajı
        </h2>
        <p className={styles.actionText}>Şablonu seçin, kopyalayın ve Etsy&apos;de bu siparişin konuşmasına yapıştırın. Metin alıcının bilgileriyle doldu.</p>
        <label className={styles.label} htmlFor="msg-template">
          Şablon
        </label>
        <select id="msg-template" className={styles.select} value={template.id} onChange={(e) => setTemplateId(e.target.value)}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <p className={styles.hint}>Ne zaman: {template.when}</p>
        <label className={styles.visuallyHidden} htmlFor="msg-text">
          Mesaj metni
        </label>
        <textarea id="msg-text" className={`${styles.textarea} ${styles.messageText}`} readOnly value={message} style={{ marginTop: 12 }} />
        <div className={styles.row} style={{ marginTop: 10 }}>
          <CopyButton value={message} label="Mesajı kopyala" />
        </div>
      </section>

      <section className={styles.card} aria-labelledby="actions-title">
        <h2 id="actions-title" className={styles.h2}>
          Destek işlemleri
        </h2>

        <div className={styles.action}>
          <p className={styles.actionTitle}>Yeni düzenleme linki</p>
          <p className={styles.actionText}>Alıcı linkini kaybettiyse. Eski link hemen çalışmaz olur; site, fotoğraflar ve yanıtlar aynen kalır.</p>
          {editUrl ? (
            <div data-new-link="">
              <p className={styles.secret}>{editUrl}</p>
              <div className={styles.row}>
                <CopyButton value={editUrl} label="Linki kopyala" />
                <button type="button" className={styles.btnSmall} onClick={() => setTemplateId('new_edit_link')}>
                  Mesaj şablonunu aç
                </button>
              </div>
              <p className={styles.hint}>Bu link yalnız şimdi gösterilir; kaydedilmez. Sayfayı yenilerseniz yeniden göremezsiniz.</p>
            </div>
          ) : confirming === 'reissue' ? (
            <div className={styles.row}>
              <button type="button" className={styles.btn} disabled={busy !== null} onClick={() => run('reissue', {}, 'Yeni link oluşturuldu.').then((ok) => ok && setTemplateId('new_edit_link'))} data-action="reissue-confirm">
                Evet, yeni link oluştur
              </button>
              <button type="button" className={styles.btnGhost} onClick={() => setConfirming(null)}>
                Vazgeç
              </button>
            </div>
          ) : (
            <button type="button" className={styles.btnGhost} disabled={busy !== null} onClick={() => setConfirming('reissue')} data-action="reissue">
              Yeni link oluştur
            </button>
          )}
          <StatusLine status={status.reissue ?? null} />
        </div>

        <div className={styles.action}>
          <p className={styles.actionTitle}>İsim/tarih hakkı ekle</p>
          <p className={styles.actionText}>
            {s.changes
              ? `Şu an ${s.changes.left} / ${s.changes.total} hak kaldı. Örneğin düğün ertelendiyse ya da yazım dışı bir isim düzeltmesi gerekiyorsa ekleyin.`
              : 'Site henüz yayınlanmadı: isimler ve tarih şimdilik serbestçe değişir, hak gerekmez.'}
          </p>
          {s.changes ? (
            <>
              <div className={styles.fields}>
                <div>
                  <label className={styles.label} htmlFor="grant-add">
                    Kaç hak
                  </label>
                  <select id="grant-add" className={styles.select} value={grantAdd} onChange={(e) => setGrantAdd(e.target.value)}>
                    {[1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        +{n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.label} htmlFor="grant-reason">
                    Neden (siteyle saklanır)
                  </label>
                  <input id="grant-reason" className={styles.input} value={grantReason} onChange={(e) => setGrantReason(e.target.value)} maxLength={200} placeholder="ör. Düğün tarihi ertelendi" />
                </div>
              </div>
              <button
                type="button"
                className={styles.btnGhost}
                disabled={busy !== null || !grantReason.trim()}
                onClick={async () => {
                  if (await run('grant', { add: Number(grantAdd), reason: grantReason }, 'Hak eklendi.')) {
                    setGrantReason('');
                    setTemplateId('extra_change_granted');
                  }
                }}
                data-action="grant"
              >
                Hak ekle
              </button>
            </>
          ) : null}
          <StatusLine status={status.grant ?? null} />
        </div>

        <div className={styles.action}>
          <p className={styles.actionTitle}>Yayında kalma süresi</p>
          <p className={styles.actionText}>
            {s.onlineUntil
              ? `Site ${day(s.onlineUntil)} dahil yayında${s.archiveSource === 'support' ? ' (destekle değiştirildi)' : ' (düğünden 12 ay sonra)'}. Uzatmak ya da kısaltmak için kapanış gününü seçin.`
              : 'İlk yayından sonra düğün tarihine göre belirlenir.'}
          </p>
          {s.firstPublishedAt ? (
            <>
              <div className={styles.fields}>
                <div>
                  <label className={styles.label} htmlFor="archive-day">
                    Kapanış günü (bu gün 00:00&apos;da arşive geçer)
                  </label>
                  <input id="archive-day" className={styles.input} type="date" value={archiveDay} onChange={(e) => setArchiveDay(e.target.value)} />
                </div>
                <div>
                  <label className={styles.label} htmlFor="archive-reason">
                    Neden
                  </label>
                  <input id="archive-reason" className={styles.input} value={archiveReason} onChange={(e) => setArchiveReason(e.target.value)} maxLength={200} placeholder="ör. Alıcı 3 ay uzatma istedi" />
                </div>
              </div>
              <div className={styles.row}>
                <button
                  type="button"
                  className={styles.btnGhost}
                  disabled={busy !== null || !archiveDay || !archiveReason.trim()}
                  onClick={() => run('archive', { day: archiveDay, reason: archiveReason }, 'Kapanış günü kaydedildi.')}
                  data-action="archive"
                >
                  Kaydet
                </button>
                {s.archiveSource === 'support' ? (
                  <button
                    type="button"
                    className={styles.btnSmall}
                    disabled={busy !== null || !archiveReason.trim()}
                    onClick={() => run('archive', { day: null, reason: archiveReason }, 'Varsayılana dönüldü.')}
                  >
                    Varsayılana dön
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
          <StatusLine status={status.archive ?? null} />
        </div>

        <div className={styles.action}>
          <p className={styles.actionTitle}>Yayından kaldır</p>
          <p className={styles.actionText}>Site misafirlere kapanır (sayfa bulunamadı). Hiçbir şey silinmez; alıcı panelden yeniden yayınlayabilir.</p>
          {s.state !== 'published' ? (
            <p className={styles.hint}>Site şu an yayında değil.</p>
          ) : confirming === 'unpublish' ? (
            <div className={styles.row}>
              <button type="button" className={styles.btn} disabled={busy !== null} onClick={() => run('unpublish', {}, 'Site yayından kaldırıldı.')} data-action="unpublish-confirm">
                Evet, yayından kaldır
              </button>
              <button type="button" className={styles.btnGhost} onClick={() => setConfirming(null)}>
                Vazgeç
              </button>
            </div>
          ) : (
            <button type="button" className={styles.btnGhost} disabled={busy !== null} onClick={() => setConfirming('unpublish')} data-action="unpublish">
              Yayından kaldır
            </button>
          )}
          <StatusLine status={status.unpublish ?? null} />
        </div>
      </section>

      <section className={`${styles.card} ${styles.danger}`} aria-labelledby="delete-title">
        <h2 id="delete-title" className={styles.h2}>
          Siteyi sil
        </h2>
        <p className={styles.actionText}>
          İçerik, fotoğraflar ve bütün RSVP yanıtları <strong>kalıcı olarak</strong> silinir; geri alınamaz. Örneğin iade edilmiş ya da başkasına ait çıkan bir sipariş için.
        </p>
        <label className={styles.label} htmlFor="delete-confirm">
          Onay için adresi yazın: <strong>{s.slug}</strong>
        </label>
        <input id="delete-confirm" className={styles.input} value={deleteSlug} onChange={(e) => setDeleteSlug(e.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} />
        <button
          type="button"
          className={styles.btnDanger}
          style={{ marginTop: 12 }}
          disabled={busy !== null || deleteSlug.trim().toLowerCase() !== s.slug}
          onClick={() => run('delete', { confirm: deleteSlug })}
          data-action="delete"
        >
          Kalıcı olarak sil
        </button>
        <StatusLine status={status.delete ?? null} />
      </section>

      <section className={styles.card} aria-labelledby="history-title">
        <h2 id="history-title" className={styles.h2}>
          Geçmiş
        </h2>
        <ul className={styles.history}>
          {history.map((h, i) => (
            <li key={`${h.at}-${i}`}>
              <span className={styles.historyWhen}>
                {stamp(h.at)} · {h.by === 'support' ? 'Dükkân' : h.by === 'buyer' ? 'Alıcı' : 'Sistem'}
              </span>
              {h.text}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
