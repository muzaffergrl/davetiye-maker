'use client';
// G145 (K45 item 1): long editor pages (Day & place, Details) get a row of jumps to their parts right under the title,
// so "Travel & stay" or "Meal & menu" is one tap away instead of a long scroll. Only parts with a sub-heading are listed
// (BLOCK_TITLES); shown when a page has three or more. A jump scrolls to the part and moves the focus to its heading.
import { t } from '../../lib/i18n/client.ts';
import type { SectionId } from '../../lib/panel/model.ts';
import styles from './section-jumps.module.css';

export function SectionJumps({ sections, titles }: { sections: SectionId[]; titles: Partial<Record<SectionId, string>> }) {
  const parts = sections.filter((id) => titles[id]);
  if (parts.length < 3) return null;
  const jump = (id: SectionId) => {
    const block = document.getElementById(`section-${id}-body`);
    if (!block) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    block.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const heading = document.getElementById(`block-${id}`);
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  };
  return (
    <nav className={styles.jumps} aria-label={t('On this page')} data-section-jumps="">
      {parts.map((id) => (
        <button key={id} type="button" className={styles.jump} onClick={() => jump(id)} data-jump={id}>
          {t(titles[id]!)}
        </button>
      ))}
    </nav>
  );
}
