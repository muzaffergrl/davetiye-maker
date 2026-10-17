// The frame of every /start screen (G080): the edit panel's BKE Studio look — its tokens (`.app` of
// components/panel/panel.module.css), its fonts (PANEL_FONTS) and its logo (BrandLogo, the brand SVG) — so /start, the
// "save your edit link" screen and the panel read as one product. Plain module: used by the server pages and by the
// client StartForm.
import type { ReactNode } from 'react';
import { BrandLogo } from '../../components/panel/Brand.tsx';
import { PANEL_FONTS } from '../../components/panel/fonts.ts';
import panel from '../../components/panel/panel.module.css';
import styles from './start.module.css';

/** `wide`: the two-column form screen (the logo lines up with the demo preview on a wide screen). */
export function StartShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`${panel.app} ${PANEL_FONTS} ${styles.page}`} data-start>
      <header className={wide ? `${styles.topBar} ${styles.topBarWide}` : styles.topBar}>
        <span className={styles.brand}>
          <BrandLogo height={28} />
        </span>
      </header>
      <main>{children}</main>
    </div>
  );
}

/**
 * The designs a buyer can start here, one big link each. `t`: the page's translator (G144; server pages build their own
 * with makeTranslator, this module also runs on the server), English without it.
 */
export function DesignList({ themes, t = (en: string) => en }: { themes: Array<{ id: string; name: string }>; t?: (en: string) => string }) {
  if (!themes.length) return <p className={styles.muted}>{t('No designs are available yet.')}</p>;
  return (
    <ul className={styles.themeList}>
      {themes.map((theme) => (
        <li key={theme.id}>
          <a className={styles.themeLink} href={`/start?theme=${encodeURIComponent(theme.id)}`}>
            {theme.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
