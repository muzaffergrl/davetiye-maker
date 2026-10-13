'use client';
// Form building blocks of the panel: labelled inputs with inline validation, switches, sections.
// An input's errors are hidden while the buyer is typing in it and shown again on blur.

import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { formatDateLong, formatTime } from '../../lib/content/format.ts';
import { fieldId, type SectionId, type ThemeFieldUse } from '../../lib/panel/model.ts';
import type { Change } from './usePanel.ts';
import styles from './panel.module.css';

export interface PanelContextValue {
  content: ContentRecord;
  edit: (change: Change) => void;
  /** Issues whose path is exactly `path`. */
  issuesAt: (path: string) => ValidationIssue[];
  /** Saving stopped (conflict / invalid link): inputs are read only. */
  locked: boolean;
  /** True while the value at `path` is still the design's sample text (lib/panel/model.ts sampleNotes). */
  isSample: (path: string) => boolean;
  /** For the buyer's own photo views (/media/… needs it until published). */
  previewKey: string;
  /** Fields the theme shows (others are hidden in the panel). */
  fields: ThemeFieldUse;
}

export const PanelContext = createContext<PanelContextValue | null>(null);

export function usePanelContext(): PanelContextValue {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error('PanelContext missing');
  return ctx;
}

export function IssueList({ issues, id }: { issues: ValidationIssue[]; id?: string }) {
  if (!issues.length) return null;
  return (
    <div id={id} className={styles.issues}>
      {issues.map((i, n) => (
        <p key={`${i.code}-${n}`} className={i.level === 'error' ? styles.issueError : styles.issueWarning}>
          <span className={styles.visuallyHidden}>{i.level === 'error' ? 'Error: ' : 'Note: '}</span>
          {i.message}
        </p>
      ))}
    </div>
  );
}

interface BaseFieldProps {
  /** Content path; also used for the input id and its issues. */
  path: string;
  label: string;
  hint?: ReactNode;
  /** Shown under the input (e.g. the formatted date). */
  display?: ReactNode;
  optional?: boolean;
}

function useFieldState(path: string) {
  const { issuesAt, locked } = usePanelContext();
  const [typing, setTyping] = useState(false);
  const issues = issuesAt(path);
  const shown = typing ? [] : issues;
  return { issues: shown, hasError: shown.some((i) => i.level === 'error'), setTyping, locked };
}

function FieldFrame({
  path,
  label,
  hint,
  display,
  optional,
  counter,
  children,
  issues,
}: BaseFieldProps & { counter?: ReactNode; children: ReactNode; issues: ValidationIssue[] }) {
  const id = fieldId(path);
  const { isSample } = usePanelContext();
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {optional ? <span className={styles.optional}> (optional)</span> : null}
          {isSample(path) ? (
            <span className={styles.sampleTag} data-sample-tag>
              Sample
            </span>
          ) : null}
        </label>
        {counter}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {children}
      {display ? <p className={styles.display}>{display}</p> : null}
      <IssueList issues={issues} id={`${id}-issues`} />
    </div>
  );
}

function describedBy(path: string, hint: unknown, issues: ValidationIssue[]): string | undefined {
  const id = fieldId(path);
  const ids = [hint ? `${id}-hint` : '', issues.length ? `${id}-issues` : ''].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

export function TextField(
  props: BaseFieldProps & {
    value: string | null | undefined;
    onChange: (value: string) => void;
    maxLength?: number;
    placeholder?: string;
    type?: 'text' | 'url' | 'email';
    inputMode?: 'text' | 'url' | 'email';
    autoComplete?: string;
    multiline?: boolean;
    rows?: number;
  },
) {
  const { path, value, onChange, maxLength, placeholder, type = 'text', inputMode, autoComplete, multiline, rows = 3 } = props;
  const { issues, hasError, setTyping, locked } = useFieldState(path);
  const text = value ?? '';
  const length = [...text].length;
  const counter =
    maxLength !== undefined ? (
      // Not a live region: announcing every keystroke is noise; the input's maxlength already limits it.
      <span className={length > maxLength ? styles.counterOver : styles.counter}>
        {length}/{maxLength}
      </span>
    ) : null;
  const common = {
    id: fieldId(path),
    value: text,
    placeholder,
    maxLength,
    readOnly: locked,
    'aria-invalid': hasError || undefined,
    'aria-describedby': describedBy(path, props.hint, issues),
    onBlur: () => setTyping(false),
  };
  return (
    <FieldFrame {...props} counter={counter} issues={issues}>
      {multiline ? (
        <textarea
          {...common}
          rows={rows}
          className={styles.textarea}
          onChange={(e) => {
            setTyping(true);
            onChange(e.target.value);
          }}
        />
      ) : (
        <input
          {...common}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete ?? 'off'}
          spellCheck={type === 'text'}
          className={styles.input}
          onChange={(e) => {
            setTyping(true);
            onChange(e.target.value);
          }}
        />
      )}
    </FieldFrame>
  );
}

/** Web address field: stored as null when empty. */
export function UrlField(props: BaseFieldProps & { value: string | null | undefined; onChange: (value: string | null) => void }) {
  return (
    <TextField
      {...props}
      type="url"
      inputMode="url"
      placeholder="https://"
      onChange={(v) => props.onChange(v.trim() ? v.trim() : null)}
    />
  );
}

export function DateField(props: BaseFieldProps & { value: string | undefined; locale: string; onChange: (value: string) => void }) {
  const { path, value, locale, onChange } = props;
  const { issues, hasError, setTyping, locked } = useFieldState(path);
  const shown = formatDateLong(value, locale);
  return (
    <FieldFrame {...props} display={props.display ?? shown} issues={issues}>
      <input
        id={fieldId(path)}
        type="date"
        className={styles.input}
        value={value ?? ''}
        readOnly={locked}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy(path, props.hint, issues)}
        onChange={(e) => {
          setTyping(true);
          onChange(e.target.value);
        }}
        onBlur={() => setTyping(false)}
      />
    </FieldFrame>
  );
}

export function TimeField(props: BaseFieldProps & { value: string | undefined; locale: string; onChange: (value: string) => void }) {
  const { path, value, locale, onChange } = props;
  const { issues, hasError, setTyping, locked } = useFieldState(path);
  return (
    <FieldFrame {...props} display={props.display ?? formatTime(value, locale)} issues={issues}>
      <input
        id={fieldId(path)}
        type="time"
        className={styles.input}
        value={value ?? ''}
        readOnly={locked}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy(path, props.hint, issues)}
        onChange={(e) => {
          setTyping(true);
          onChange(e.target.value);
        }}
        onBlur={() => setTyping(false)}
      />
    </FieldFrame>
  );
}

export function SelectField(
  props: BaseFieldProps & { value: string; options: Array<{ value: string; label: string; group?: string }>; onChange: (value: string) => void },
) {
  const { path, value, options, onChange } = props;
  const { issues, hasError, locked } = useFieldState(path);
  const groups = new Map<string, typeof options>();
  for (const o of options) {
    const g = o.group ?? '';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(o);
  }
  return (
    <FieldFrame {...props} issues={issues}>
      <select
        id={fieldId(path)}
        className={styles.select}
        value={value}
        disabled={locked}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy(path, props.hint, issues)}
        onChange={(e) => onChange(e.target.value)}
      >
        {[...groups.entries()].map(([group, list]) =>
          group ? (
            <optgroup key={group} label={group}>
              {list.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ) : (
            list.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          ),
        )}
      </select>
    </FieldFrame>
  );
}

export function Switch({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { locked } = usePanelContext();
  const hintId = useId();
  return (
    <div className={styles.switchRow}>
      <div className={styles.switchText}>
        <span id={`${id}-label`} className={styles.label}>
          {label}
        </span>
        {hint ? (
          <span id={hintId} className={styles.hint}>
            {hint}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={hint ? hintId : undefined}
        disabled={locked}
        className={styles.switch}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.switchKnob} aria-hidden="true" />
        <span className={styles.switchState} aria-hidden="true">
          {checked ? 'On' : 'Off'}
        </span>
      </button>
    </div>
  );
}

export function Section({
  id,
  title,
  summary,
  errorCount,
  sampleCount = 0,
  open,
  onToggle,
  children,
}: {
  id: SectionId;
  title: string;
  summary?: string;
  errorCount: number;
  /** Fields still holding the design's sample text. */
  sampleCount?: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className={open ? `${styles.section} ${styles.sectionOpen}` : styles.section} data-section={id}>
      <h2 className={styles.sectionHeading}>
        <button
          type="button"
          id={`section-${id}`}
          className={styles.sectionButton}
          aria-expanded={open}
          aria-controls={`section-${id}-body`}
          onClick={onToggle}
        >
          <span className={styles.sectionTitleWrap}>
            <span className={styles.sectionTitle}>{title}</span>
            {summary ? <span className={styles.sectionSummary}>{summary}</span> : null}
          </span>
          {errorCount ? (
            <span className={styles.badge}>
              {errorCount} to fix
            </span>
          ) : sampleCount ? (
            <span className={styles.sampleBadge} data-sample-badge>
              Sample text
            </span>
          ) : null}
          <span className={styles.chevron} aria-hidden="true" />
        </button>
      </h2>
      {/* Only the open section is rendered (lighter page; its data, e.g. RSVP replies, loads on open). */}
      <div id={`section-${id}-body`} className={styles.sectionBody} hidden={!open} role="region" aria-labelledby={`section-${id}`}>
        {open ? children : null}
      </div>
    </section>
  );
}

/**
 * Small row of actions (move up / down / remove) for list items. Remove asks once more ("Yes, remove"),
 * like photos: autosave stores a deletion within a second and there is no undo. After a move, focus
 * follows the moved item (rows are keyed by position, so the pressed button now belongs to another row).
 */
export function RowActions({
  index,
  count,
  noun,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  noun: string;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  const { locked } = usePanelContext();
  const [confirming, setConfirming] = useState(false);
  const move = (to: number, dir: 'up' | 'down') => {
    onMove(index, to);
    window.setTimeout(() => {
      const same = document.querySelector<HTMLButtonElement>(`[aria-label="Move ${noun} ${to + 1} ${dir}"]`);
      const other = document.querySelector<HTMLButtonElement>(`[aria-label="Move ${noun} ${to + 1} ${dir === 'up' ? 'down' : 'up'}"]`);
      (same && !same.disabled ? same : other)?.focus();
    }, 0);
  };
  return (
    <div className={styles.rowActions}>
      <button type="button" className={styles.smallButton} disabled={locked || index === 0} onClick={() => move(index - 1, 'up')} aria-label={`Move ${noun} ${index + 1} up`}>
        Up
      </button>
      <button
        type="button"
        className={styles.smallButton}
        disabled={locked || index === count - 1}
        onClick={() => move(index + 1, 'down')}
        aria-label={`Move ${noun} ${index + 1} down`}
      >
        Down
      </button>
      {confirming ? (
        <>
          <button
            type="button"
            className={`${styles.smallButton} ${styles.dangerText}`}
            disabled={locked}
            onClick={() => {
              setConfirming(false);
              onRemove(index);
            }}
            aria-label={`Yes, remove ${noun} ${index + 1}`}
          >
            Yes, remove
          </button>
          <button type="button" className={styles.smallButton} onClick={() => setConfirming(false)} aria-label={`Keep ${noun} ${index + 1}`}>
            Keep
          </button>
        </>
      ) : (
        <button
          type="button"
          className={`${styles.smallButton} ${styles.dangerText}`}
          disabled={locked}
          onClick={() => setConfirming(true)}
          aria-label={`Remove ${noun} ${index + 1}`}
        >
          Remove
        </button>
      )}
    </div>
  );
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}
