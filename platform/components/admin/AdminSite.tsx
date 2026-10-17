'use client';
// Shop admin — one website (G087, K30). Order (G121, docs/18 §6 P2 — Programa/Zendesk): what to do now (confirm the
// order) → the customer's facts and the shop note → ready Etsy messages beside them → support actions that can be undone →
// what is on the site, guest replies → high-impact actions apart (take offline, delete) → history. Every action calls /api/admin/sites/<id>/<action> (lib/admin/api.ts), which
// runs the same lib/sites.ts functions the old terminal scripts used.
import { ArrowLeft, Check, Copy, Download, ExternalLink, Eye, Hourglass, Pencil, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MESSAGE_TEMPLATES, messageMissing, renderMessage } from '../../lib/admin/messages.ts';
import { defaultTemplateId, type AdminHistoryEntry, type AdminSiteSummary } from '../../lib/admin/view.ts';
import type { AdminContentView, AdminDeviceView, AdminRsvpView } from '../../lib/admin/api.ts';
import { CopyButton, copyText } from './CopyButton.tsx';
import styles from './admin.module.css';
import { StateBadges } from './badges.tsx';
import { day, stamp } from './format.ts';

const ETSY_ORDERS_URL = 'https://www.etsy.com/your/orders/sold';

type Status = { kind: 'ok' | 'err'; text: string } | null;

/** "2028-09-18" → "September 18, 2028" (the buyer-facing messages are English, US style like the sites' default). */
function longEnglishDate(iso: string): string {
  const t = Date.parse(`${iso}T12:00:00Z`);
  return Number.isFinite(t) ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(t) : iso;
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

export default function AdminSite(props: {
  summary: AdminSiteSummary;
  history: AdminHistoryEntry[];
  content: AdminContentView;
  rsvp: AdminRsvpView;
  previewPath: string;
  /** G152: devices signed in with the order number (read-only list; "Tüm cihazlarda oturumu kapat"). */
  devices?: AdminDeviceView[];
  origin: string;
}) {
  const router = useRouter();
  const [s, setS] = useState(props.summary);
  const [history, setHistory] = useState(props.history);
  const [content, setContent] = useState(props.content);
  const [rsvp, setRsvp] = useState(props.rsvp);
  const [previewPath, setPreviewPath] = useState(props.previewPath);
  const [devices, setDevices] = useState<AdminDeviceView[]>(props.devices ?? []);
  const [noteText, setNoteText] = useState(props.summary.note ?? '');
  const [emailText, setEmailText] = useState(props.summary.ownerEmail ?? '');
  const [editingEmail, setEditingEmail] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [editUrl, setEditUrl] = useState<string | null>(null);
  const [shopEditUrl, setShopEditUrl] = useState<string | null>(null);
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
  const [templateId, setTemplateId] = useState(() => defaultTemplateId(props.summary));
  const template = templates.find((t) => t.id === templateId) ?? templates[0];
  // G121 (docs/19 §6 A1): the filled text can be edited before copying; another template (or a new link) starts again from it.
  const [edited, setEdited] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const rendered = renderMessage(template, {
    names: s.names,
    order: s.orderRef,
    design: s.themeName,
    siteUrl,
    startUrl,
    editUrl,
    changesLeft: s.changes?.left ?? null,
    onlineUntil: s.onlineUntil ? longEnglishDate(s.onlineUntil) : null,
  });
  const message = edited ?? rendered.text;
  const missing = messageMissing(message);
  useEffect(() => setEdited(null), [templateId, editUrl]);

  /** Copies the message and notes it in the site's history (template + time, never the text). */
  async function copyMessage() {
    if (!(await copyText(message))) {
      setStatus((m) => ({ ...m, 'message-log': { kind: 'err', text: 'Kopyalanamadı: metni seçip elle kopyalayın.' } }));
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    await run('message-log', { template: template.id });
  }

  /**
   * G145: opens the editor with the shop's own 72-hour link (the buyer's link keeps working). The tab is opened before the
   * request, so the browser does not block it as a pop-up; it is closed again when the link could not be made.
   */
  async function openShopEditor() {
    const tab = window.open('about:blank', '_blank');
    const res = await runFor('shop-edit', {}, 'Dükkân düzenleme linki açıldı (72 saat).');
    if (res?.shopEditUrl && tab) {
      tab.opener = null;
      tab.location.href = res.shopEditUrl;
    }
    else tab?.close();
  }

  async function run(action: string, body: Record<string, unknown> = {}, ok?: string): Promise<boolean> {
    return Boolean(await runFor(action, body, ok));
  }

  async function runFor(action: string, body: Record<string, unknown> = {}, ok?: string): Promise<Record<string, any> | null> {
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
        return null;
      }
      if (!res.ok || !data?.ok) {
        setStatus((m) => ({ ...m, [action]: { kind: 'err', text: data?.message ?? 'Olmadı. Tekrar deneyin.' } }));
        return null;
      }
      if (data.deleted) {
        router.push('/admin/orders');
        router.refresh();
        return data;
      }
      setS(data.summary);
      setHistory(data.history);
      if (data.content) setContent(data.content);
      if (data.rsvp) setRsvp(data.rsvp);
      if (data.previewPath) setPreviewPath(data.previewPath);
      if (Array.isArray(data.devices)) setDevices(data.devices);
      if (data.editUrl) setEditUrl(data.editUrl);
      if (action === 'shop-edit-end') setShopEditUrl(null);
      if (data.shopEditUrl) setShopEditUrl(data.shopEditUrl);
      if (ok) setStatus((m) => ({ ...m, [action]: { kind: 'ok', text: ok } }));
      return data;
    } catch {
      setStatus((m) => ({ ...m, [action]: { kind: 'err', text: 'Bağlantı kurulamadı. Tekrar deneyin.' } }));
      return null;
    } finally {
      setBusy(null);
      setConfirming(null);
    }
  }

  return (
    <>
      <Link href="/admin/orders" className={`${styles.link} ${styles.back}`}>
        <ArrowLeft size={18} aria-hidden /> Siparişler
      </Link>
      <StateBadges summary={s} />
      <h1 className={styles.h1} style={{ marginTop: 10 }}>
        {s.names}
      </h1>
      <p className={styles.lead}>
        /{s.slug} · {s.themeName}
        {s.orderRef ? ` · #${s.orderRef}` : ''}
      </p>
      <div className={styles.quick} data-quick="">
        {s.state === 'published' ? (
          <a className={styles.btnSmall} href={siteUrl} target="_blank" rel="noreferrer" data-quick-site="">
            Siteyi aç <ExternalLink size={14} aria-hidden />
          </a>
        ) : null}
        <a className={styles.btnSmall} href={previewPath} target="_blank" rel="noreferrer" data-quick-preview="">
          <Eye size={16} aria-hidden /> Taslağı gör
        </a>
        {s.state !== 'archived' ? (
          <button type="button" className={styles.btnSmall} disabled={busy !== null} onClick={() => void openShopEditor()} data-quick-edit="">
            <Pencil size={16} aria-hidden /> Düzenle
          </button>
        ) : null}
        <a className={styles.btnSmall} href={ETSY_ORDERS_URL} target="_blank" rel="noreferrer">
          Etsy siparişleri <ExternalLink size={14} aria-hidden />
        </a>
        <a className={styles.btnSmall} href="#msg-title">
          <Send size={16} aria-hidden /> Mesaj
        </a>
        <a className={styles.btnSmall} href="#rsvp-title">
          Misafir yanıtları ({s.replies})
        </a>
      </div>

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
          <Fact label="E-posta">
            {s.ownerEmail ? <>{s.ownerEmail} <CopyButton value={s.ownerEmail} /></> : '—'}
            <button type="button" className={styles.btnSmall} onClick={() => setEditingEmail((x) => !x)} data-action="email-edit">
              Değiştir
            </button>
          </Fact>
          {editingEmail ? (
            <div style={{ padding: '8px 0 12px' }}>
              <label className={styles.label} htmlFor="email-edit">
                Alıcının doğru e-postası
              </label>
              <input id="email-edit" className={styles.input} type="email" value={emailText} onChange={(e) => setEmailText(e.target.value)} autoComplete="off" />
              <div className={styles.row} style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className={styles.btnGhost}
                  disabled={busy !== null || !emailText.trim()}
                  onClick={async () => {
                    if (await run('email', { email: emailText }, 'E-posta kaydedildi.')) setEditingEmail(false);
                  }}
                  data-action="email"
                >
                  Kaydet
                </button>
              </div>
            </div>
          ) : null}
          <StatusLine status={status.email ?? null} />
          <Fact label="Tasarım">{s.themeName}</Fact>
          <Fact label="Oluşturan">{s.madeByShop ? 'Dükkân (Yeni sipariş)' : 'Alıcı (/start)'}</Fact>
          <Fact label="Adres">
            {siteUrl.replace(/^https?:\/\//, '')} <CopyButton value={siteUrl} />
          </Fact>
          <Fact label="Oluşturuldu">{stamp(s.createdAt)}</Fact>
          <Fact label="İlk yayın">{stamp(s.firstPublishedAt)}</Fact>
          <Fact label="Son değişiklik">{stamp(s.contentUpdatedAt || s.updatedAt)}</Fact>
          <Fact label="Düğün tarihi">{day(s.weddingDate)}</Fact>
          <Fact label="Yayında kalır">{s.onlineUntil ? `${day(s.onlineUntil)} dahil` : 'İlk yayından sonra belli olur'}</Fact>
          <Fact label="RSVP yanıtı">{s.replies}</Fact>
          <Fact label="İsim/tarih hakkı">{s.changes ? `${s.changes.left} / ${s.changes.total} kaldı` : 'İlk yayından sonra sayılır'}</Fact>
          <Fact label="Misafir şifresi">{s.guestPassword ? 'Açık' : 'Kapalı'}</Fact>
        </dl>
      </section>

      <section className={styles.card} aria-labelledby="note-title" data-note="">
        <h2 id="note-title" className={styles.h2}>
          Dükkân notu
        </h2>
        <p className={styles.actionText}>Yalnız siz görürsünüz (alıcı ve misafirler görmez). Örneğin Etsy&apos;deki özel istek, iade durumu, konuşma özeti.</p>
        <label className={styles.visuallyHidden} htmlFor="note-text">
          Not
        </label>
        <textarea id="note-text" className={styles.textarea} value={noteText} onChange={(e) => setNoteText(e.target.value)} maxLength={2000} placeholder="Not yazın…" />
        <div className={styles.row} style={{ marginTop: 10 }}>
          <button
            type="button"
            className={styles.btnGhost}
            disabled={busy !== null || noteText.trim() === (s.note ?? '')}
            onClick={() => run('note', { note: noteText }, noteText.trim() ? 'Not kaydedildi.' : 'Not silindi.')}
            data-action="note"
          >
            Notu kaydet
          </button>
          {s.noteAt ? <span className={styles.hint}>Son: {stamp(s.noteAt)}</span> : null}
        </div>
        <StatusLine status={status.note ?? null} />
      </section>

      <section className={styles.card} aria-labelledby="msg-title">
        <h2 id="msg-title" className={styles.h2}>
          Etsy mesajı
        </h2>
        <p className={styles.actionText}>
          Şablonu seçin, gerekirse metni düzeltin, kopyalayın ve Etsy&apos;de bu siparişin konuşmasına yapıştırın. Metin alıcının bilgileriyle doldu; kopyaladığınız
          şablon Geçmiş&apos;e yazılır (metin saklanmaz).
        </p>
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
        {template.note ? <p className={styles.hint}>Not: {template.note}</p> : null}
        <label className={styles.visuallyHidden} htmlFor="msg-text">
          Mesaj metni
        </label>
        <textarea
          id="msg-text"
          className={`${styles.textarea} ${styles.messageText}`}
          value={message}
          onChange={(e) => setEdited(e.target.value)}
          maxLength={4000}
          style={{ marginTop: 12 }}
          data-message-text=""
        />
        {missing.length ? (
          <p className={`${styles.status} ${styles.statusErr}`} role="status" data-message-missing="">
            Bu mesaj henüz gönderilemez: {missing.join(', ')} karar bekliyor ya da bu site için bilinmiyor.
            {edited !== null ? ' Metinde doldurabilirsiniz.' : ''}
          </p>
        ) : null}
        <div className={styles.row} style={{ marginTop: 10 }}>
          {missing.length ? null : (
            <button type="button" className={styles.btnSmall} disabled={busy !== null} onClick={() => void copyMessage()} data-action="copy-message">
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Kopyalandı' : 'Mesajı kopyala'}
            </button>
          )}
          {edited !== null ? (
            <button type="button" className={styles.btnSmall} onClick={() => setEdited(null)} data-action="message-reset">
              Şablona dön
            </button>
          ) : null}
        </div>
        <StatusLine status={status['message-log'] ?? null} />
      </section>

      <section className={styles.card} aria-labelledby="actions-title">
        <h2 id="actions-title" className={styles.h2}>
          Destek işlemleri
        </h2>
        <p className={styles.actionText}>Geri alınabilir ya da sonradan düzeltilebilir işlemler. Yayından kaldırma ve silme en altta, ayrı.</p>

        <div className={styles.action} data-shop-edit="">
          <p className={styles.actionTitle}>Linki değiştirmeden düzenle</p>
          <p className={styles.actionText}>
            Kurulum hizmeti ya da alıcının istediği bir düzeltme için: siteyi kendi 72 saatlik linkinizle düzenleyin. Alıcının linki aynen çalışır; bu linki
            alıcıya göndermeyin. Bitince linki kapatın ve &quot;Kurulum bitti: aynı link&quot; mesajını gönderin.
          </p>
          {s.shopEditUntil ? <p className={styles.hint} data-shop-edit-until="">Açık: {stamp(s.shopEditUntil)} tarihine kadar çalışır.</p> : null}
          <div className={styles.row}>
            <button type="button" className={styles.btn} disabled={busy !== null || s.state === 'archived'} onClick={() => void openShopEditor()} data-action="shop-edit">
              <ExternalLink size={16} aria-hidden /> {s.shopEditUntil ? 'Düzenleyiciyi yeniden aç' : 'Düzenleyiciyi aç'}
            </button>
            {s.shopEditUntil ? (
              <button
                type="button"
                className={styles.btnGhost}
                disabled={busy !== null}
                onClick={async () => {
                  if (await run('shop-edit-end', {}, 'Dükkân linki kapatıldı.')) setTemplateId('setup_service_done_same_link');
                }}
                data-action="shop-edit-end"
              >
                Dükkân linkini kapat
              </button>
            ) : null}
          </div>
          {shopEditUrl ? (
            <p className={styles.hint}>
              Sekme açılmadıysa: <a className={styles.link} href={shopEditUrl} target="_blank" rel="noreferrer" data-shop-edit-link="">düzenleyiciyi buradan açın</a>. Link
              yalnız şimdi gösterilir; yeniden açmak eski dükkân linkini kapatır.
            </p>
          ) : null}
          {s.state === 'archived' ? <p className={styles.hint}>Site arşivde; önce yayında kalma süresini uzatın.</p> : null}
          <StatusLine status={status['shop-edit'] ?? status['shop-edit-end'] ?? null} />
        </div>

        <div className={styles.action} data-devices={devices.length}>
          <p className={styles.actionTitle}>Giriş yapılan cihazlar</p>
          <p className={styles.actionText}>
            Alıcının sipariş no + e-postayla (/my) giriş yaptığı cihazlar. Tümünde oturumu kapatmak alıcının özel düzenleme linkini değiştirmez; alıcı /my&apos;den
            yeniden girebilir. Hesap ele geçirilmişse önce e-postayı düzeltin, sonra &quot;Yeni link oluştur&quot;.
          </p>
          {devices.length ? (
            <ul className={styles.history} data-device-list="">
              {devices.map((d, i) => (
                <li key={`${d.createdAt}-${i}`}>
                  <span className={styles.historyWhen}>{stamp(d.createdAt)}</span>
                  {d.label || 'Bilinmeyen cihaz'} · {d.via === 'email' ? 'e-postadaki giriş linki' : d.via === 'start' ? 'başlatma sayfası' : '/my formu'}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.hint}>Sipariş numarasıyla giriş yapılmış cihaz yok.</p>
          )}
          {devices.length ? (
            confirming === 'devices-signout' ? (
              <div className={styles.row}>
                <button
                  type="button"
                  className={styles.btn}
                  disabled={busy !== null}
                  onClick={() => run('devices-signout', {}, 'Tüm cihazlarda oturum kapatıldı.')}
                  data-action="devices-signout-confirm"
                >
                  Evet, tümünde kapat
                </button>
                <button type="button" className={styles.btnGhost} onClick={() => setConfirming(null)}>
                  Vazgeç
                </button>
              </div>
            ) : (
              <button type="button" className={styles.btnGhost} disabled={busy !== null} onClick={() => setConfirming('devices-signout')} data-action="devices-signout">
                Tüm cihazlarda oturumu kapat ({devices.length})
              </button>
            )
          ) : null}
          <StatusLine status={status['devices-signout'] ?? null} />
        </div>

        <div className={styles.action}>
          <p className={styles.actionTitle}>Yeni düzenleme linki</p>
          <p className={styles.actionText}>Yalnız alıcı linkini kaybettiyse. Eski link hemen çalışmaz olur; site, fotoğraflar ve yanıtlar aynen kalır.</p>
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
          <p className={styles.actionTitle}>{s.state === 'published' ? 'Değişiklikleri alıcı adına yayınla' : 'Alıcı adına yayınla'}</p>
          <p className={styles.actionText}>
            Alıcı isterse ya da Publish&apos;e basmayı unuttuysa: taslak, panelin kurallarıyla (eksik alan, isim/tarih hakkı) kontrol edilip yayınlanır.
          </p>
          {s.state === 'published' && !s.unpublishedChanges ? (
            <p className={styles.hint}>Site yayında; yayınlanmamış değişiklik yok.</p>
          ) : s.needsAction ? (
            <p className={styles.hint}>Önce siparişi onaylayın.</p>
          ) : confirming === 'publish' ? (
            <div className={styles.row}>
              <button type="button" className={styles.btn} disabled={busy !== null} onClick={() => run('publish', {}, 'Yayınlandı.')} data-action="publish-confirm">
                Evet, yayınla
              </button>
              <button type="button" className={styles.btnGhost} onClick={() => setConfirming(null)}>
                Vazgeç
              </button>
            </div>
          ) : (
            <button type="button" className={styles.btnGhost} disabled={busy !== null} onClick={() => setConfirming('publish')} data-action="publish">
              Yayınla
            </button>
          )}
          <StatusLine status={status.publish ?? null} />
        </div>

      </section>

      <section className={styles.card} aria-labelledby="content-title" data-content="">
        <h2 id="content-title" className={styles.h2}>
          Sitede ne var
        </h2>
        <p className={styles.actionText}>Alıcının taslağındaki bilgiler (burada salt okunur; değiştirmek için yukarıdaki &quot;Linki değiştirmeden düzenle&quot;). Tamamını görmek için &quot;Taslağı gör&quot;.</p>
        <dl className={styles.facts}>
          <Fact label="İsimler">{s.names}</Fact>
          <Fact label="Tarih / saat">
            {day(content.date)}
            {content.time ? ` · ${content.time}` : ''}
          </Fact>
          <Fact label="Mekân">{content.venue ?? '—'}</Fact>
          {content.address ? <Fact label="Adres">{content.address}</Fact> : null}
          <Fact label="Program">{content.schedule.length ? content.schedule.map((x) => `${x.time} ${x.label}`).join(' · ') : '—'}</Fact>
          <Fact label="RSVP son günü">{day(content.rsvpDeadline)}</Fact>
          {content.dressCode ? <Fact label="Kıyafet">{content.dressCode}</Fact> : null}
          <Fact label="Fotoğraf">{content.photos}</Fact>
          <Fact label="SSS">{content.faq}</Fact>
          <Fact label="Saat dilimi">{content.timezone ?? '—'}</Fact>
        </dl>
      </section>

      <section className={styles.card} aria-labelledby="rsvp-title" data-rsvp="">
        <h2 id="rsvp-title" className={styles.h2}>
          Misafir yanıtları
        </h2>
        <p className={styles.actionText}>
          {rsvp.counts.responses} yanıt · {rsvp.counts.attending} katılıyor ({rsvp.counts.totalGuests} kişi) · {rsvp.counts.notAttending} katılmıyor
          {rsvp.counts.held ? ` · ${rsvp.counts.held} beklemede (olağan dışı yoğunluk)` : ''}
        </p>
        <div className={styles.row} style={{ marginBottom: 6 }}>
          <a className={styles.btnSmall} href={`/api/admin/sites/${encodeURIComponent(s.id)}/rsvps`} download data-rsvp-csv="">
            <Download size={16} aria-hidden /> CSV indir
          </a>
          {picked.length ? (
            confirming === 'rsvp-delete' ? (
              <>
                <button
                  type="button"
                  className={styles.btnDanger}
                  style={{ minHeight: 36 }}
                  disabled={busy !== null}
                  onClick={async () => {
                    if (await run('rsvp-delete', { ids: picked }, `${picked.length} yanıt silindi.`)) setPicked([]);
                  }}
                  data-action="rsvp-delete-confirm"
                >
                  Evet, {picked.length} yanıtı sil
                </button>
                <button type="button" className={styles.btnSmall} onClick={() => setConfirming(null)}>
                  Vazgeç
                </button>
              </>
            ) : (
              <button type="button" className={styles.btnSmall} onClick={() => setConfirming('rsvp-delete')} data-action="rsvp-delete">
                Seçilenleri sil ({picked.length})
              </button>
            )
          ) : null}
        </div>
        <StatusLine status={status['rsvp-delete'] ?? null} />
        {rsvp.responses.length === 0 ? (
          <p className={styles.hint}>Henüz yanıt yok.</p>
        ) : (
          <ul className={styles.rows}>
            {rsvp.responses.slice(0, 200).map((r) => (
              <li key={r.id} className={styles.reply} data-reply={r.id}>
                <input
                  type="checkbox"
                  aria-label={`${r.name} yanıtını seç`}
                  checked={picked.includes(r.id)}
                  onChange={(e) => setPicked((x) => (e.target.checked ? [...x, r.id] : x.filter((y) => y !== r.id)))}
                />
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>
                    {r.name}{' '}
                    <span className={r.attending ? styles.badgeOk : styles.badgeMuted}>{r.attending ? `Katılıyor · ${r.guests} kişi` : 'Katılmıyor'}</span>
                    {r.held ? <span className={styles.badgeWarn}> Beklemede</span> : null}
                  </p>
                  <p className={styles.siteMeta}>
                    {stamp(r.createdAt)}
                    {r.email ? ` · ${r.email}` : ''}
                    {r.source === 'couple' ? ' · çift ekledi' : ''}
                    {r.party.length ? ` · ${r.party.join(', ')}` : ''}
                  </p>
                  {r.message ? <p className={styles.siteMeta} style={{ color: 'var(--c-text)' }}>“{r.message}”</p> : null}
                  {r.answers.length ? <p className={styles.siteMeta}>{r.answers.map((a) => `${a.question}: ${a.answer}`).join(' · ')}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
        {rsvp.responses.length > 200 ? <p className={styles.hint}>İlk 200 yanıt gösteriliyor; hepsi CSV&apos;de.</p> : null}
      </section>

      <section className={`${styles.card} ${styles.danger}`} aria-labelledby="danger-title" data-danger="">
        <h2 id="danger-title" className={styles.h2}>
          Dikkat: yüksek etkili işlemler
        </h2>
        <p className={styles.actionText}>Misafirler siteyi açamaz hâle gelir ya da her şey kalıcı silinir. Önce alıcıyla Etsy&apos;den konuşun.</p>
        <div className={styles.action} data-unpublish="">
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
        <div className={styles.action} data-delete="">
          <p className={styles.actionTitle}>Siteyi sil</p>
          <p className={styles.actionText}>
            İçerik, fotoğraflar ve bütün RSVP yanıtları <strong>kalıcı olarak</strong> silinir; geri alınamaz. Örneğin iade edilmiş ya da başkasına ait çıkan bir sipariş
            için. Sipariş numarası serbest kalır.
          </p>
          {s.state === 'draft' && !s.firstPublishedAt ? (
            <p className={styles.hint} data-wrong-design="">
              Alıcı yanlış tasarımla mı başladı? Bu taslağı silin; sonra <Link className={styles.link} href="/admin/new">Yeni sipariş</Link> ile aynı sipariş numarasıyla
              doğru tasarımı açın (ya da alıcı başlatma sayfasından yeniden başlasın). Taslaktaki yazılar ve fotoğraflar yeni siteye taşınmaz.
            </p>
          ) : null}
          <label className={styles.label} htmlFor="delete-confirm">
            Onay için adresi yazın: <strong>{s.slug}</strong>
          </label>
          <input id="delete-confirm" className={styles.input} value={deleteSlug} onChange={(e) => setDeleteSlug(e.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} />
          {/* G121 (docs/18 §6 P3, Fibery/Shuttle): "Vazgeç" on the left, the permanent action on the right. */}
          <div className={styles.dangerRow}>
            <button type="button" className={styles.btnGhost} disabled={!deleteSlug} onClick={() => setDeleteSlug('')} data-action="delete-cancel">
              Vazgeç
            </button>
            <button
              type="button"
              className={styles.btnDanger}
              disabled={busy !== null || deleteSlug.trim().toLowerCase() !== s.slug}
              onClick={() => run('delete', { confirm: deleteSlug })}
              data-action="delete"
            >
              Kalıcı olarak sil
            </button>
          </div>
          <StatusLine status={status.delete ?? null} />
        </div>
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
