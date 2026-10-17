'use client';
// G153: "Color palette" on Us — the design's original colours or one of its extra palettes. Applies at once to the
// preview and the live website; the couple's texts and photos stay exactly as they are.

import { Palette as PaletteIcon } from 'lucide-react';
import { useState } from 'react';
import type { PanelVariant } from '../../lib/panel/model.ts';
import { msg, t } from '../../lib/i18n/client.ts';
import { PalettePicker, type PaletteOption } from '../palette/PalettePicker.tsx';
import { Disclosure, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';

export const ORIGINAL_PALETTE = msg('Original');

/** The choices: the original first, then the live palettes (a site's current palette is kept even while in review). */
export function paletteOptions(variants: readonly PanelVariant[], swatch: readonly string[] | null, current: string | null): PaletteOption[] {
  return [
    { id: null, name: t(ORIGINAL_PALETTE), swatch: swatch ?? [] },
    ...variants.filter((v) => v.live || v.id === current).map((v) => ({ id: v.id, name: v.name, swatch: v.swatch })),
  ];
}

export function PaletteFields({
  variants,
  swatch,
  current,
  onPick,
  locked,
  online,
}: {
  variants: readonly PanelVariant[];
  swatch: readonly string[] | null;
  current: string | null;
  onPick: (variant: string | null) => Promise<{ ok: boolean; message?: string }>;
  locked: boolean;
  online: boolean;
}) {
  const snack = useSnackbar();
  const [busy, setBusy] = useState(false);
  const options = paletteOptions(variants, swatch, current);
  if (options.length < 2) return null;
  const currentName = options.find((o) => o.id === current)?.name ?? t(ORIGINAL_PALETTE);
  const pick = async (id: string | null) => {
    if (id === current || busy) return;
    setBusy(true);
    const res = await onPick(id);
    setBusy(false);
    if (res.ok) snack(t('Color palette changed. Your texts and photos stay as they are.'));
    else snack(res.message ?? t('The color palette could not be changed. Please try again.'));
  };
  return (
    <Disclosure id="palette" title={t('Color palette')} icon={PaletteIcon} status={currentName}>
      <div className={styles.stack} data-palette-fields>
        <p className={styles.hint}>{t('The same design in other colors. Your change shows on your website at once; your texts and photos are not changed.')}</p>
        <PalettePicker label={t('Color palette')} options={options} value={current} disabled={locked || !online || busy} onChange={(id) => void pick(id)} />
      </div>
    </Disclosure>
  );
}
