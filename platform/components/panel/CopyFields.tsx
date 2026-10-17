'use client';
// "Headings & labels on this page" (G068, K28/K29): the design's fixed texts — headings, labels, buttons, the menu — listed
// at the bottom of each of the six editor pages, where the couple already is (no seventh "Wording" page). Each row: what
// and where (label), the couple's text (empty = the design's text, shown in grey), "Reset to design text". The most-changed
// keys come first; texts shown only after the wedding sit under their own sub-heading. On Us: an optional event-type
// suggestion (Wedding / Vow renewal / …) fills a few keys at once — a suggestion, every text stays editable.
// Everything is content (content.copy): autosave, the "Unpublished changes" bar and Review count it like any other edit,
// and it never uses a name / date change (lib/panel/rights.ts looks at names and the date only).

import { RotateCcw, Type } from 'lucide-react';
import { useMemo } from 'react';
import type { ContentRecord } from '../../lib/content/types.ts';
import { applyCopyPreset, COPY_PRESETS, currentPreset, ownCopy, withCopy, type CopyManifest, type PanelCopyEntry } from '../../lib/theme/copy.ts';
import { TextField, usePanelContext } from './fields.tsx';
import type { PageId } from './pages.ts';
import { Button, cx, Disclosure, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';
import { t, tn, uiLang } from '../../lib/i18n/client.ts';

/** The panel's entries as the manifest shape the pure helpers take (default + max is all they read). */
export function entriesManifest(entries: readonly PanelCopyEntry[]): CopyManifest {
  return Object.fromEntries(entries.map((e) => [e.key, { default: e.default, max: e.max, pages: [] }]));
}

export function CopyFields({
  page,
  entries,
  openRequest,
  onFocusKey,
}: {
  page: PageId;
  entries: readonly PanelCopyEntry[];
  /** A jump to one of these texts (an issue): opens the section (a new object each jump). */
  openRequest?: { path: string } | null;
  /** A row got the focus (the preview follows the text's website page). */
  onFocusKey?: (entry: PanelCopyEntry) => void;
}) {
  const { content, edit, locked } = usePanelContext();
  const snack = useSnackbar();
  const mine = useMemo(() => entries.filter((e) => e.panel === page), [entries, page]);
  const manifest = useMemo(() => entriesManifest(entries), [entries]);
  if (!mine.length) return null;
  const before = mine.filter((e) => !e.after);
  const after = mine.filter((e) => e.after);
  const changed = mine.filter((e) => ownCopy(content, e.key, e.max)).length;
  const presetOn = page === 'us' && COPY_PRESETS.some((p) => Object.keys(p.values).some((k) => manifest[k]));
  const preset = presetOn ? currentPreset(content, manifest) : null;
  const open = openRequest && mine.some((e) => `copy.${e.key}` === openRequest.path) ? openRequest : null;

  const choosePreset = (id: string) => {
    const p = COPY_PRESETS.find((x) => x.id === id);
    if (!p) return;
    const previous = structuredClone(content.copy ?? null);
    let changedKeys: string[] = [];
    // edit() applies the change at once (usePanel), so the keys it changed are known right after
    edit((c) => {
      const r = applyCopyPreset(c, p, manifest);
      changedKeys = r.changed;
      return r.content;
    });
    if (!changedKeys.length) return; // already this wording
    const n = changedKeys.length;
    // German keeps the noun's capital; the other languages read it in lower case (as English always did).
    const kind = uiLang() === 'de' ? t(p.label) : t(p.label).toLowerCase();
    const message =
      p.id === 'wedding'
        ? tn(n, 'Back to the design’s wording: {n} text changed.', 'Back to the design’s wording: {n} texts changed.')
        : tn(n, 'Wording for a {kind}: {n} text changed.', 'Wording for a {kind}: {n} texts changed.', { kind });
    snack(message, {
      label: t('Undo'),
      run: () =>
        edit((c: ContentRecord) => {
          if (previous) c.copy = previous;
          else delete c.copy;
        }),
    });
  };

  const row = (e: PanelCopyEntry) => {
    const own = ownCopy(content, e.key, e.max);
    const raw = content.copy?.[e.key];
    return (
      <div key={e.key} className={styles.copyRow} data-copy-row={e.key} onFocusCapture={() => onFocusKey?.(e)}>
        <TextField
          path={`copy.${e.key}`}
          label={t(e.label)}
          placeholder={e.default}
          maxLength={e.max}
          multiline={e.multiline}
          rows={e.multiline ? 3 : undefined}
          value={typeof raw === 'string' ? raw : ''}
          // (typing the design's very words keeps them in the box: no reset under the finger)
          onChange={(v) => edit((c) => withCopy(c, e.key, v.trim() ? v : null))}
        />
        {own ? (
          <p className={styles.copyDefault}>
            <span className={styles.copyDefaultText}>
              {t('Design text:')} <q>{e.default}</q>
            </span>
            <Button
              small
              variant="tertiary"
              icon={RotateCcw}
              disabled={locked}
              aria-label={t('Reset to design text: {text}', { text: e.default })}
              onClick={() => edit((c) => withCopy(c, e.key, null))}
              data-copy-reset={e.key}
            >
              {t('Reset to design text')}
            </Button>
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <Disclosure
      id={`copy-${page}`}
      title={t('Headings & labels on this page')}
      status={changed ? t('{count} changed', { count: changed }) : undefined}
      icon={Type}
      openRequest={open}
    >
      <div className={styles.stack} data-copy-fields={page}>
        <p className={styles.hint}>
          {t('Change any heading, label or button of your website in your own words. Leave a box empty to keep the design’s text (in grey).')}
        </p>
        {presetOn ? (
          <div className={styles.field} data-copy-presets>
            <p className={styles.label} id={`copy-preset-${page}`}>
              {t('Suggested wording')} <span className={styles.optional}>{t('(optional)')}</span>
            </p>
            <div className={styles.chips} role="group" aria-labelledby={`copy-preset-${page}`}>
              {COPY_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={cx(styles.chip, preset === p.id && styles.chipOn)}
                  aria-pressed={preset === p.id}
                  disabled={locked}
                  onClick={() => choosePreset(p.id)}
                  data-copy-preset={p.id}
                >
                  {t(p.label)}
                </button>
              ))}
            </div>
            <p className={styles.hint}>{t('Fills a few lines below for you; you can still change each one.')}</p>
          </div>
        ) : null}
        {before.map(row)}
        {after.length ? (
          <>
            <h3 className={styles.copyGroupTitle}>{t('After the wedding')}</h3>
            <p className={styles.hint}>{t('Shown once your website switches to its thank-you page.')}</p>
            {after.map(row)}
          </>
        ) : null}
      </div>
    </Disclosure>
  );
}
