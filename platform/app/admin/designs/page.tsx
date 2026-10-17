// /admin/designs — every design: on the sales site or not, sales, live websites, replies, links (G095).
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { ExternalLink } from 'lucide-react';
import { adminList } from '../../../lib/admin/api.ts';
import { adminCreatableThemes } from '../../../lib/admin/create.ts';
import { adminDesigns } from '../../../lib/admin/view.ts';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { demoPath } from '../../../lib/marketing/designs.ts';
import { displayPrice } from '../../../lib/marketing/site.ts';
import { publicOrigin } from '../../../lib/panel/http.ts';
import { AdminPage } from '../../../components/admin/Guard.tsx';
import { CopyButton } from '../../../components/admin/CopyButton.tsx';
import { stamp } from '../../../components/admin/format.ts';
import styles from '../../../components/admin/admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tasarımlar · Dükkân yönetimi',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

const decided = (v: string | null | undefined) => Boolean(v && !/^\[.*\]$/.test(v.trim()));

export default function DesignsPage() {
  return (
    <AdminPage active="designs">
      {async () => {
        const origin = publicOrigin(await headers());
        const [{ sites }, startable] = await Promise.all([adminList(), adminCreatableThemes()]);
        const commerce = new Map(MARKETING.designs.map((d) => [d.id, d]));
        const catalogue = [
          ...MARKETING.designs.map((d) => ({ id: d.id, name: d.name, live: d.status === 'live' })),
          ...startable.filter((t) => !commerce.has(t.id)).map((t) => ({ id: t.id, name: t.name, live: false })),
        ];
        const rows = adminDesigns(sites, catalogue);
        const startableIds = new Set(startable.map((t) => t.id));
        const live = rows.filter((r) => r.live).length;
        return (
          <>
            <h1 className={styles.h1}>Tasarımlar</h1>
            <p className={styles.lead}>
              {live} tasarım satış sitesinde · {rows.length - live} hazır ama satış sitesinde değil. Başlatma linki, Etsy PDF&apos;indeki linkin aynısıdır.
            </p>
            <div className={styles.grid}>
              {rows.map((r) => {
                const c = commerce.get(r.id);
                const startUrl = `${origin}/start?theme=${encodeURIComponent(r.id)}`;
                return (
                  <section key={r.id} className={styles.siteCard} data-design={r.id}>
                    <span className={styles.badges}>
                      {r.live ? <span className={styles.badgeOk}>Satış sitesinde</span> : <span className={styles.badgeMuted}>Satış sitesinde değil</span>}
                      {!startableIds.has(r.id) ? <span className={styles.badgeWarn}>Başlatılamaz</span> : null}
                    </span>
                    <p className={styles.siteNames}>{r.name}</p>
                    <p className={styles.siteMeta}>
                      {r.sales} satış · {r.published} yayında site · {r.replies} RSVP yanıtı
                    </p>
                    <p className={styles.siteMeta}>Son satış: {stamp(r.lastSaleAt)}</p>
                    <p className={styles.siteMeta}>
                      Fiyat: {c && decided(c.price) ? displayPrice(c.price) : 'girilmedi'}
                      {c && decided(c.compareAtPrice ?? '') ? ` (indirimsiz ${displayPrice(c.compareAtPrice ?? '')})` : ''}
                    </p>
                    <div className={styles.row} style={{ marginTop: 10 }}>
                      {r.live ? (
                        <a className={styles.btnSmall} href={`/designs/${r.id}`} target="_blank" rel="noreferrer">
                          Tasarım sayfası <ExternalLink size={14} aria-hidden />
                        </a>
                      ) : null}
                      {startableIds.has(r.id) ? (
                        <>
                          <a className={styles.btnSmall} href={demoPath(r.id)} target="_blank" rel="noreferrer">
                            Demo <ExternalLink size={14} aria-hidden />
                          </a>
                          <CopyButton value={startUrl} label="Başlatma linki" />
                        </>
                      ) : null}
                      {c && decided(c.etsyListingUrl) ? (
                        <a className={styles.btnSmall} href={c.etsyListingUrl} target="_blank" rel="noreferrer">
                          Etsy ilanı <ExternalLink size={14} aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        );
      }}
    </AdminPage>
  );
}
