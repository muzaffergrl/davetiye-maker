'use client';
// Shop admin — "Bağlantılar" card (G147): email sending (on / not configured, test email) and the Etsy shop connection
// (connect once, disconnect, re-check pending orders). Calls /api/admin/connections (lib/admin/connections.ts).
// Only env NAMES are ever shown, never values; the notice address is shown partly hidden.
import { Mail, RefreshCw, Store, Unplug } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TrustSweepSummary } from '../../lib/claim/trust.ts';
import type { RecheckSummary } from '../../lib/etsy/recheck.ts';
import type { EtsyStatus } from '../../lib/etsy/shop.ts';
import type { MailStatus } from '../../lib/mail/index.ts';
import styles from './admin.module.css';
import { stamp } from './format.ts';

type Status = { kind: 'ok' | 'err'; text: string } | null;

const MODE_TEXT: Record<EtsyStatus['mode'], string> = {
  off: 'Kapalı — yalnız sipariş numarası biçimi kontrol ediliyor (CLAIM_ORDER_VERIFICATION tanımsız).',
  manual: 'Elle onay (manual) — yeni siteler siz onaylayana kadar yayınlanamaz.',
  etsy: 'Etsy (otomatik) — sipariş Etsy\'den okunur; ödenmişse site hemen yayınlanabilir.',
  trust: 'Önce güven (trust) — yeni siteler hemen yayınlanabilir; sipariş sonra kontrol edilir (Etsy bağlıysa saatte bir, kendiliğinden).',
  invalid: 'CLAIM_ORDER_VERIFICATION değeri tanınmıyor ("off", "manual", "trust" ya da "etsy" olmalı).',
};

const REASON_TEXT: Record<string, string> = {
  not_found: 'Etsy\'de bu mağazada bulunamadı',
  not_paid: 'iptal edilmiş ya da tamamı iade edilmiş',
  email_mismatch: 'e-posta Etsy\'deki alıcı e-postasıyla aynı değil',
  theme_mismatch: 'başka bir tasarım satın alınmış',
};

function etsyErrorText(code: string): string {
  if (code === 'invalid_grant') return 'Etsy bu bağlantıyı artık kabul etmiyor: "Etsy mağazasını yeniden bağla".';
  if (code === 'http_403' || code === 'http_401') return `Etsy son kontrolde erişimi reddetti (${code}): uygulama henüz onaylanmamış ya da izin (transactions_r) eksik olabilir. O zamana kadar siparişler elle onay bekler.`;
  return `Son Etsy hatası: ${code}.`;
}

function StatusLine({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p className={`${styles.status} ${status.kind === 'ok' ? styles.statusOk : styles.statusErr}`} role={status.kind === 'err' ? 'alert' : 'status'}>
      {status.text}
    </p>
  );
}

export default function AdminConnections(props: { mail: MailStatus; etsy: EtsyStatus }) {
  const router = useRouter();
  const [mail, setMail] = useState(props.mail);
  const [etsy, setEtsy] = useState(props.etsy);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [summary, setSummary] = useState<RecheckSummary | null>(null);
  const [trust, setTrust] = useState<TrustSweepSummary | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  async function act(action: string): Promise<Record<string, any> | null> {
    setBusy(action);
    setStatus((m) => ({ ...m, [action]: null }));
    try {
      const res = await fetch('/api/admin/connections', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action }) });
      const data = await res.json().catch(() => null);
      if (res.status === 401) {
        router.refresh();
        return null;
      }
      if (!res.ok || !data?.ok) {
        setStatus((m) => ({ ...m, [action]: { kind: 'err', text: data?.message ?? 'Olmadı. Tekrar deneyin.' } }));
        return null;
      }
      if (data.mail) setMail(data.mail);
      if (data.etsy) setEtsy(data.etsy);
      return data;
    } catch {
      setStatus((m) => ({ ...m, [action]: { kind: 'err', text: 'Bağlantı kurulamadı. Tekrar deneyin.' } }));
      return null;
    } finally {
      setBusy(null);
    }
  }

  const etsyBadge = !etsy.configured ? (
    <span className={styles.badgeMuted}>Ayarlanmadı</span>
  ) : etsy.connected && !etsy.reconnect ? (
    <span className={styles.badgeOk}>Bağlı</span>
  ) : (
    <span className={styles.badgeWarn}>Bağlı değil</span>
  );

  return (
    <section className={styles.card} id="connections" aria-labelledby="connections-h" data-connections="">
      <h2 id="connections-h" className={styles.h2}>
        Bağlantılar
      </h2>

      {/* Email */}
      <div data-mail-status={mail.enabled ? 'on' : 'off'} style={{ marginBottom: 18 }}>
        <div className={styles.row} style={{ justifyContent: 'space-between' }}>
          <strong>
            <Mail size={16} aria-hidden /> E-posta gönderimi
          </strong>
          {mail.enabled ? <span className={styles.badgeOk}>Açık</span> : <span className={styles.badgeMuted}>Ayarlanmadı</span>}
        </div>
        {mail.enabled ? (
          <>
            <p className={styles.hint}>
              Alıcıya düzenleme linki gider; onay bekleyen yeni sipariş size bildirilir ({mail.notifyTo}).
            </p>
            <div className={styles.row} style={{ marginTop: 10 }}>
              <button
                type="button"
                className={styles.btnSmall}
                disabled={busy !== null}
                onClick={async () => {
                  if (await act('mail-test')) setStatus((m) => ({ ...m, 'mail-test': { kind: 'ok', text: `Test e-postası gönderildi (${mail.notifyTo}). Gelen kutusunu ve spam klasörünü kontrol edin.` } }));
                }}
                data-action="mail-test"
              >
                {busy === 'mail-test' ? 'Gönderiliyor…' : 'Test e-postası gönder'}
              </button>
            </div>
          </>
        ) : (
          <p className={styles.hint}>
            Düzenleme linki şimdilik yalnız ekranda gösteriliyor, e-posta gitmiyor. Açmak için ortam değişkenleri: {mail.missing.join(', ')} (kurulum:
            docs/10 §3).
          </p>
        )}
        <StatusLine status={status['mail-test'] ?? null} />
      </div>

      {/* Etsy */}
      <div data-etsy-status={!etsy.configured ? 'not_configured' : etsy.connected ? 'connected' : 'not_connected'}>
        <div className={styles.row} style={{ justifyContent: 'space-between' }}>
          <strong>
            <Store size={16} aria-hidden /> Etsy mağazası
          </strong>
          {etsyBadge}
        </div>
        <p className={styles.hint}>Sipariş kontrolü: {MODE_TEXT[etsy.mode]}</p>

        {etsy.mode === 'trust' && (!etsy.connected || etsy.reconnect) ? (
          <div className={styles.callout} role="note" style={{ marginTop: 10 }} data-trust-manual="">
            <p className={styles.calloutTitle} style={{ marginBottom: 4 }}>
              Etsy bağlı değil — siparişler kendiliğinden doğrulanmıyor
            </p>
            <p style={{ margin: 0 }}>
              Yeni siteler yine hemen yayınlanabilir. Doğrulama sizde:{' '}
              {mail.enabled
                ? 'her yeni sitede size e-posta gelir'
                : 'e-posta gönderimi ayarlı olmadığı için bildirim gitmez; yeni siteler Siparişler listesinde "Önce güven" etiketiyle görünür'}
              ; uymayan siparişte sitenin sayfasında &quot;Yayından kaldır ve beklet&quot;. 48 saatte doğrulanmayan sipariş &quot;Yapılacak&quot;a düşer.
              Etsy bağlanınca kontrol saatte bir kendiliğinden yapılır.
            </p>
          </div>
        ) : null}

        {etsy.fallbackToManual ? (
          <div className={styles.callout} role="note" style={{ marginTop: 10 }} data-etsy-fallback="">
            <p className={styles.calloutTitle} style={{ marginBottom: 4 }}>
              Etsy kontrolü çalışmıyor — siparişler elle onay bekliyor
            </p>
            <p style={{ margin: 0 }}>
              {!etsy.configured
                ? `Etsy uygulama ayarları eksik (${etsy.missing.join(', ')}).`
                : etsy.reconnect
                  ? 'Etsy bu bağlantıyı artık kabul etmiyor; mağazayı yeniden bağlayın.'
                  : 'Mağaza henüz bağlanmadı.'}{' '}
              Bu arada yeni siteler &quot;manual&quot; gibi açılır; bağlandıktan sonra &quot;Bekleyen siparişleri Etsy&apos;de kontrol et&quot; ile ya da
              alıcı panelini açınca kendiliğinden onaylanır.
            </p>
          </div>
        ) : null}

        {!etsy.configured ? (
          <p className={styles.hint}>
            Açmak için: etsy.com/developers&apos;ta uygulama, sonra ortam değişkenleri {etsy.missing.join(', ')} ve aşağıda &quot;Etsy mağazasını bağla&quot;
            (kurulum: docs/10 §3).
          </p>
        ) : etsy.connected ? (
          <p className={styles.hint}>
            {etsy.shopName ? `${etsy.shopName} · ` : ''}
            {etsy.shopId ? `mağaza no ${etsy.shopId}` : ''}
            {etsy.connectedAt ? ` · bağlandı ${stamp(etsy.connectedAt)}` : ''}
          </p>
        ) : null}
        {etsy.connected && etsy.error ? <p className={`${styles.status} ${styles.statusErr}`}>{etsyErrorText(etsy.error)}</p> : null}

        {etsy.configured ? (
          <div className={styles.row} style={{ marginTop: 10 }}>
            {!etsy.connected || etsy.reconnect ? (
              <button
                type="button"
                className={styles.btn}
                disabled={busy !== null}
                onClick={async () => {
                  const data = await act('etsy-connect');
                  if (data?.url) window.location.href = data.url;
                }}
                data-action="etsy-connect"
              >
                <Store size={18} aria-hidden /> {etsy.reconnect ? 'Etsy mağazasını yeniden bağla' : 'Etsy mağazasını bağla'}
              </button>
            ) : null}
            {etsy.connected ? (
              <button
                type="button"
                className={styles.btnSmall}
                disabled={busy !== null}
                onClick={async () => {
                  setSummary(null);
                  setTrust(null);
                  const data = await act('etsy-recheck');
                  if (data?.summary) {
                    setSummary(data.summary);
                    setTrust(data.trust ?? null);
                    if (data.summary.verified || data.trust?.verified || data.trust?.held || data.trust?.review) router.refresh();
                  }
                }}
                data-action="etsy-recheck"
              >
                <RefreshCw size={16} aria-hidden /> {busy === 'etsy-recheck' ? 'Kontrol ediliyor…' : 'Bekleyen siparişleri Etsy\'de kontrol et'}
              </button>
            ) : null}
            {etsy.connected ? (
              confirmDisconnect ? (
                <>
                  <button
                    type="button"
                    className={styles.btnSmall}
                    disabled={busy !== null}
                    onClick={async () => {
                      await act('etsy-disconnect');
                      setConfirmDisconnect(false);
                    }}
                    data-action="etsy-disconnect"
                  >
                    Evet, bağlantıyı kes
                  </button>
                  <button type="button" className={styles.btnSmall} onClick={() => setConfirmDisconnect(false)}>
                    Vazgeç
                  </button>
                </>
              ) : (
                <button type="button" className={styles.btnSmall} disabled={busy !== null} onClick={() => setConfirmDisconnect(true)} data-action="etsy-disconnect-ask">
                  <Unplug size={16} aria-hidden /> Bağlantıyı kes
                </button>
              )
            ) : null}
          </div>
        ) : null}
        {confirmDisconnect ? (
          <p className={styles.hint}>Bağlantı kesilince Etsy anahtarları burada silinir; &quot;etsy&quot; modunda yeni siteler elle onay bekler.</p>
        ) : null}
        <StatusLine status={status['etsy-connect'] ?? status['etsy-recheck'] ?? status['etsy-disconnect'] ?? null} />

        {summary ? (
          <div className={`${styles.status} ${styles.statusOk}`} role="status" data-recheck-summary="">
            {summary.checked === 0 ? (
              <p style={{ margin: 0 }}>Onay bekleyen sipariş yok.</p>
            ) : (
              <p style={{ margin: 0 }}>
                {summary.checked} sipariş kontrol edildi: {summary.verified} onaylandı, {summary.pending} hâlâ bekliyor (ödeme tamamlanmamış ya da
                Etsy erişimi yok), {summary.rejected} uymadı, {summary.unavailable} için Etsy&apos;ye ulaşılamadı.
                {summary.remaining ? ` ${summary.remaining} sipariş daha var: yeniden basın.` : ''}
              </p>
            )}
            {summary.results.filter((r) => r.result === 'rejected').length ? (
              <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                {summary.results
                  .filter((r) => r.result === 'rejected')
                  .map((r) => (
                    <li key={r.siteId}>
                      <Link href={`/admin/site/${r.siteId}`} className={styles.link}>
                        {r.orderRef ? `#${r.orderRef}` : r.slug}
                      </Link>
                      : {REASON_TEXT[r.reason ?? ''] ?? r.reason} — site beklemede kaldı; Etsy&apos;de bakıp karar verin.
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        {trust && trust.checked ? (
          <div className={`${styles.status} ${styles.statusOk}`} role="status" data-trust-summary="">
            <p style={{ margin: 0 }}>
              Önce güven: {trust.checked} doğrulanmamış sipariş kontrol edildi: {trust.verified} onaylandı, {trust.held} yayından kaldırılıp beklemeye
              alındı, {trust.review} için 48 saat doldu, {trust.waiting} bekliyor.
              {trust.remaining ? ` ${trust.remaining} sipariş daha var: yeniden basın.` : ''}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
