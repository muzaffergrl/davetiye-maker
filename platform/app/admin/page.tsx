// /admin — the shop admin's overview (G087, G095): sales at a glance, what needs doing, weekly sales, best
// sellers, upcoming weddings, latest orders. Off without ADMIN_PASSWORD; sign-in with the shop password
// (lib/admin/auth.ts). Never indexed, never framed (next.config.ts).
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Plus } from 'lucide-react';
import { adminList } from '../../lib/admin/api.ts';
import { adminDashboard, type AdminTodo } from '../../lib/admin/view.ts';
import { AdminPage } from '../../components/admin/Guard.tsx';
import { StateBadges } from '../../components/admin/badges.tsx';
import { day, shortDay, stamp } from '../../components/admin/format.ts';
import styles from '../../components/admin/admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dükkân yönetimi · BKE Studio',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

const TODO_LABEL: Record<AdminTodo['kind'], string> = {
  confirm: 'Onayla',
  not_published: 'Hatırlat',
  closing: 'Kapanıyor',
  unpublished_changes: 'Bak',
};

export default function AdminHome() {
  return (
    <AdminPage active="dashboard">
      {async () => {
        const { sites } = await adminList();
        const d = adminDashboard(sites);
        const maxWeek = Math.max(1, ...d.weeks.map((w) => w.count));
        const maxDesign = Math.max(1, ...d.byDesign.map((b) => b.count));
        return (
          <>
            <div className={styles.row} style={{ justifyContent: 'space-between' }}>
              <h1 className={styles.h1}>Özet</h1>
              <Link href="/admin/new" className={styles.btn} data-new-order-link="">
                <Plus size={18} aria-hidden /> Yeni sipariş
              </Link>
            </div>
            <p className={styles.lead}>
              Bugün {d.sales.today} satış · bu ay {d.sales.thisMonth} · toplam {d.sales.total}. Satış = Etsy sipariş numarasıyla açılan site.
            </p>

            <div className={styles.kpis} data-kpis="">
              <Link href="/admin/orders?f=action" className={`${styles.kpi} ${d.sites.needsAction ? styles.kpiWarn : ''}`} data-kpi="action">
                <p className={styles.kpiNum}>{d.sites.needsAction}</p>
                <p className={styles.kpiLabel}>Onay bekleyen sipariş</p>
              </Link>
              <Link href="/admin/orders" className={styles.kpi} data-kpi="sales">
                <p className={styles.kpiNum}>{d.sales.total}</p>
                <p className={styles.kpiLabel}>Toplam satış</p>
              </Link>
              <div className={styles.kpi} data-kpi="last7">
                <p className={styles.kpiNum}>{d.sales.last7}</p>
                <p className={styles.kpiLabel}>Son 7 gün · son 30 gün {d.sales.last30}</p>
              </div>
              <Link href="/admin/customers" className={styles.kpi} data-kpi="customers">
                <p className={styles.kpiNum}>{d.customers}</p>
                <p className={styles.kpiLabel}>Müşteri</p>
              </Link>
              <Link href="/admin/orders?f=published" className={styles.kpi} data-kpi="published">
                <p className={styles.kpiNum}>{d.sites.published}</p>
                <p className={styles.kpiLabel}>Yayında site</p>
              </Link>
              <Link href="/admin/orders?f=draft" className={styles.kpi} data-kpi="draft">
                <p className={styles.kpiNum}>{d.sites.draft}</p>
                <p className={styles.kpiLabel}>Taslakta</p>
              </Link>
              <Link href="/admin/orders?f=archived" className={styles.kpi} data-kpi="archived">
                <p className={styles.kpiNum}>{d.sites.archived}</p>
                <p className={styles.kpiLabel}>Arşivde</p>
              </Link>
              <div className={styles.kpi} data-kpi="replies">
                <p className={styles.kpiNum}>{d.sites.replies}</p>
                <p className={styles.kpiLabel}>RSVP yanıtı (tüm siteler)</p>
              </div>
            </div>

            <div className={styles.dash}>
              <div>
                <section className={styles.card} aria-labelledby="todo-h" data-todos="">
                  <h2 id="todo-h" className={styles.h2}>
                    Yapılacaklar
                  </h2>
                  {d.todos.length === 0 ? (
                    <p className={styles.actionText} style={{ margin: 0 }}>
                      Şu an yapılacak bir şey yok. Onay bekleyen siparişler, uzun süredir yayınlanmamış siteler ve kapanmak üzere olanlar burada görünür.
                    </p>
                  ) : (
                    <ul className={styles.rows}>
                      {d.todos.map((t) => (
                        <li key={`${t.kind}-${t.site.id}`} className={styles.rowItem} data-todo={t.kind}>
                          <Link href={`/admin/site/${t.site.id}`} className={styles.rowLink}>
                            <span className={styles.rowMain}>
                              <span className={styles.rowTitle} style={{ display: 'block' }}>
                                {t.site.names}
                              </span>
                              <span className={styles.siteMeta} style={{ display: 'block' }}>
                                {t.text}
                              </span>
                            </span>
                            <span className={t.kind === 'confirm' ? styles.badgeWarn : styles.badge}>
                              {TODO_LABEL[t.kind]} <ChevronRight size={14} aria-hidden />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className={styles.card} aria-labelledby="recent-h">
                  <div className={styles.row} style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                    <h2 id="recent-h" className={styles.h2} style={{ margin: 0 }}>
                      Son siparişler
                    </h2>
                    <Link className={`${styles.link} ${styles.back}`} style={{ margin: 0 }} href="/admin/orders">
                      Hepsi
                    </Link>
                  </div>
                  {d.recent.length === 0 ? (
                    <p className={styles.actionText}>Henüz sipariş yok. Alıcı /start sayfasında sitesini başlattığında ya da siz &quot;Yeni sipariş&quot; eklediğinizde burada görünür.</p>
                  ) : (
                    <ul className={styles.rows}>
                      {d.recent.map((s) => (
                        <li key={s.id} className={styles.rowItem}>
                          <Link href={`/admin/site/${s.id}`} className={styles.rowLink} data-recent={s.slug}>
                            <span className={styles.rowMain}>
                              <span className={styles.rowTitle} style={{ display: 'block' }}>
                                {s.names}
                              </span>
                              <span className={styles.siteMeta} style={{ display: 'block' }}>
                                {s.orderRef ? `#${s.orderRef} · ` : ''}
                                {s.themeName} · {stamp(s.createdAt)}
                              </span>
                            </span>
                            <StateBadges summary={s} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <div>
                <section className={styles.card} aria-labelledby="weeks-h" data-weeks="">
                  <h2 id="weeks-h" className={styles.h2}>
                    Haftalık satış
                  </h2>
                  <div className={styles.bars} role="img" aria-label={`Son 8 hafta: ${d.weeks.map((w) => w.count).join(', ')}`}>
                    {d.weeks.map((w) => (
                      <div key={w.start} className={styles.barCol}>
                        <span className={styles.barNum}>{w.count}</span>
                        <span className={styles.barFill} style={{ height: `${Math.round((w.count / maxWeek) * 100)}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.barLabels} aria-hidden>
                    {d.weeks.map((w, i) => (
                      <span key={w.start}>{i === d.weeks.length - 1 ? 'Bu hf.' : shortDay(w.start)}</span>
                    ))}
                  </div>
                </section>

                <section className={styles.card} aria-labelledby="best-h">
                  <div className={styles.row} style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                    <h2 id="best-h" className={styles.h2} style={{ margin: 0 }}>
                      En çok satan tasarımlar
                    </h2>
                    <Link className={`${styles.link} ${styles.back}`} style={{ margin: 0 }} href="/admin/designs">
                      Tasarımlar
                    </Link>
                  </div>
                  {d.byDesign.length === 0 ? (
                    <p className={styles.actionText}>İlk satıştan sonra burada görünür.</p>
                  ) : (
                    <ul className={styles.rows}>
                      {d.byDesign.slice(0, 6).map((b) => (
                        <li key={b.theme} className={styles.rowItem} style={{ display: 'block' }}>
                          <div className={styles.row} style={{ justifyContent: 'space-between' }}>
                            <span>{b.name}</span>
                            <strong>{b.count}</strong>
                          </div>
                          <div className={styles.meter}>
                            <div className={styles.meterFill} style={{ width: `${Math.round((b.count / maxDesign) * 100)}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className={styles.card} aria-labelledby="up-h">
                  <h2 id="up-h" className={styles.h2}>
                    Yaklaşan düğünler (60 gün)
                  </h2>
                  {d.upcoming.length === 0 ? (
                    <p className={styles.actionText}>Önümüzdeki 60 günde düğün yok.</p>
                  ) : (
                    <ul className={styles.rows}>
                      {d.upcoming.map((s) => (
                        <li key={s.id} className={styles.rowItem}>
                          <Link href={`/admin/site/${s.id}`} className={styles.rowLink}>
                            <span className={styles.rowMain}>
                              <span className={styles.rowTitle} style={{ display: 'block' }}>
                                {s.names}
                              </span>
                              <span className={styles.siteMeta} style={{ display: 'block' }}>
                                {day(s.weddingDate)} · {s.replies} yanıt
                              </span>
                            </span>
                            <StateBadges summary={s} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>

            <details className={`${styles.card} ${styles.help}`} open={d.sales.total === 0 || undefined}>
              <summary>Satış sonrası nasıl işliyor?</summary>
              <ol>
                <li>Alıcı Etsy&apos;den tasarımı satın alır ve indirdiği PDF&apos;teki linkle başlatma sayfasını açar.</li>
                <li>Sipariş numarası ve e-postasıyla sitesini başlatır; taslak hemen açılır, düzenleme linkini kaydeder. Sipariş burada görünür.</li>
                <li>
                  Sipariş onayı açıksa site <strong>Yapılacaklar</strong>&apos;a düşer: Etsy&apos;de siparişi kontrol edip <strong>Siparişi onayla</strong>, hazır
                  &quot;Sipariş onaylandı&quot; mesajını Etsy&apos;den gönderin.
                </li>
                <li>
                  Alıcı başlatamıyorsa ya da sizden isterse: <strong>Yeni sipariş</strong> ile siteyi siz açın, çıkan düzenleme linkini hazır mesajla gönderin.
                </li>
                <li>Link kaybı → sitenin sayfasında <strong>Yeni düzenleme linki</strong>. Düğün ertelendi → <strong>İsim/tarih hakkı ekle</strong>. Uzatma → <strong>Yayında kalma süresi</strong>.</li>
                <li>Her sitenin sayfasında: misafir yanıtları (CSV), taslağın önizlemesi, dükkân notu, alıcı adına yayınlama, silme.</li>
              </ol>
            </details>
          </>
        );
      }}
    </AdminPage>
  );
}
