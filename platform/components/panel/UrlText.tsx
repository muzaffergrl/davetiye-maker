'use client';
// A website address that breaks only after "/" (docs/16 §6.5).

import { Fragment } from 'react';
import styles from './panel.module.css';


/** An address that breaks only after "/" (never in the middle of a word), docs/16 §6.5. */
export function UrlText({ url }: { url: string }) {
  const display = url.replace(/^https?:\/\//, '');
  const parts = display.split('/');
  return (
    <span className={styles.urlText}>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i ? '/' : ''}
          {i ? <wbr /> : null}
          <span className={p.length <= 28 ? styles.urlPart : undefined}>{p}</span>
        </Fragment>
      ))}
    </span>
  );
}
