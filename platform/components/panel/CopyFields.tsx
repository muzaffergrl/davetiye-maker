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
    snack(`${p.id === 'wedding' ? 'Back to the design’s wording' : `Wording for a ${p.label.toLowerCase()}`}: ${changedKeys.length} ${changedKeys.length === 1 ? 'text' : 'texts'} changed.`, {
      label: 'Undo',
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
          label={e.label}
          placeholder={e.default}
          maxLength={e.max}
          multiline={e.multiline}
          rows={e.multiline ? 3 : undefined}
          value={typeof raw === 'string' ? raw : ''}
          onChange={(v) => edit((c) => withCopy(c, e.key, v.trim() ? v : null, e))}
        />
        {own ? (
          <p className={styles.copyDefault}>
            <span className={styles.copyDefaultText}>
              Design text: <q>{e.default}</q>
            </span>
            <Button
              small
              variant="tertiary"
              icon={RotateCcw}
              disabled={locked}
              aria-label={`Reset to design text: ${e.default}`}
              onClick={() => edit((c) => withCopy(c, e.key, null))}
              data-copy-reset={e.key}
            >
              Reset to design text
            </Button>
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <Disclosure
      id={`copy-${page}`}
      title="Headings & labels on this page"
      status={changed ? `${changed} changed` : undefined}
      icon={Type}
      openRequest={open}
    >
      <div className={styles.stack} data-copy-fields={page}>
        <p className={styles.hint}>
          Change any heading, label or button of your website in your own words. Leave a box empty to keep the design’s text (in grey).
        </p>
        {presetOn ? (
          <div className={styles.field} data-copy-presets>
            <p className={styles.label} id={`copy-preset-${page}`}>
              Suggested wording <span className={styles.optional}>(optional)</span>
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
                  {p.label}
                </button>
              ))}
            </div>
            <p className={styles.hint}>Fills a few lines below for you; you can still change each one.</p>
          </div>
        ) : null}
        {before.map(row)}
        {after.length ? (
          <>
            <h3 className={styles.copyGroupTitle}>After the wedding</h3>
            <p className={styles.hint}>Shown once your website switches to its thank-you page.</p>
            {after.map(row)}
          </>
        ) : null}
      </div>
    </Disclosure>
  );
}
