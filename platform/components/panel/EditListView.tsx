'use client';
// Edit: the six editor pages as a list (K29). G181: loaded with the Edit view.

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { PAGE_TITLES, type PageId } from './pages.ts';
import { Badge } from './ui.tsx';
import styles from './panel.module.css';
import { t } from '../../lib/i18n/client.ts';


export function EditListView({
  pages,
  summaries,
  errorCount,
  icons,
  onOpen,
}: {
  pages: PageId[];
  summaries: Record<PageId, string>;
  errorCount: (id: PageId) => number;
  icons: Record<PageId, LucideIcon>;
  onOpen: (id: PageId) => void;
}) {
  return (
    <ul className={styles.list}>
      {pages.map((id) => {
        const Icon = icons[id];
        const errors = errorCount(id);
        return (
          <li key={id}>
            <a href={`#edit/${id}`} id={`section-${id}`} className={styles.row} onClick={(e) => (e.preventDefault(), onOpen(id))} data-section-row={id}>
              <span className={styles.rowIcon} aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className={styles.rowBody}>
                <span className={styles.rowTitle}>{t(PAGE_TITLES[id])}</span>
                <span className={styles.rowSummary}>{summaries[id]}</span>
                {errors ? (
                  <span className={styles.rowBadges}>
                    <Badge tone="danger">{t('{n} to fix', { n: errors })}</Badge>
                  </span>
                ) : null}
              </span>
              <ChevronRight size={22} aria-hidden="true" className={styles.chev} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
