'use client';
// G153: the color palettes of a design as swatch radios (panel "Color palette", /start). The original colours are
// the first choice (id null). Pure presentation: the caller saves the choice (panel: POST /variant, /start: the form).

import { Check } from 'lucide-react';
import { useId } from 'react';
import styles from './palette.module.css';

export interface PaletteOption {
  /** null = the design's original colours. */
  id: string | null;
  name: string;
  swatch: readonly string[];
}

export function PalettePicker({
  options,
  value,
  onChange,
  disabled = false,
  label,
}: {
  options: readonly PaletteOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  disabled?: boolean;
  /** Accessible name of the group (e.g. "Color palette"). */
  label: string;
}) {
  const name = useId();
  return (
    <div className={styles.grid} role="radiogroup" aria-label={label} data-palette-picker>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <label key={o.id ?? 'original'} className={`${styles.option} ${on ? styles.on : ''}`} data-palette={o.id ?? 'original'}>
            <input
              type="radio"
              className={styles.radio}
              name={name}
              checked={on}
              disabled={disabled}
              onChange={() => onChange(o.id)}
            />
            <span className={styles.swatch} aria-hidden="true">
              {(o.swatch.length ? o.swatch : ['#EEEEEE']).map((c, i) => (
                <span key={i} style={{ background: c }} />
              ))}
              {on ? (
                <span className={styles.tick}>
                  <Check size={16} strokeWidth={2.5} />
                </span>
              ) : null}
            </span>
            <span className={styles.name}>{o.name}</span>
          </label>
        );
      })}
    </div>
  );
}
