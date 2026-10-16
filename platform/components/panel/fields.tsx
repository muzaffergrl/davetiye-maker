'use client';
// Form building blocks of the panel: labelled inputs with inline validation, switches, repeatable items.
// An input's errors are hidden while the buyer is typing in it and shown again on blur.
// A field still holding the design's sample text looks like a soft placeholder (G100, docs/18 §2: no "Sample" tag on
// each field; the page says once how many are left, SampleLine); focusing it selects the whole text, so typing replaces
// the sample (docs/16 §5.4). Screen readers hear "sample text" with the label.

import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { createContext, useContext, useEffect, useId, useState, type ReactNode } from 'react';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { formatDateLong, formatTime, isValidTimeZone } from '../../lib/content/format.ts';
import { fieldId, type PanelPhotoSlot, type ThemeFieldUse } from '../../lib/panel/model.ts';
import type { RightsView } from '../../lib/panel/rights.ts';
import { cx, OverflowMenu, useSnackbar } from './ui.tsx';
import type { Change } from './usePanel.ts';
import styles from './panel.module.css';

export interface PanelContextValue {
  content: ContentRecord;
  edit: (change: Change) => void;
  /** Issues whose path is exactly `path`. */
  issuesAt: (path: string) => ValidationIssue[];
  /** Saving stopped (conflict / invalid link) or the site is archived: inputs are read only. */
  locked: boolean;
  /** True while the value at `path` is still the design's sample text (lib/panel/model.ts sampleNotes). */
  isSample: (path: string) => boolean;
  /** Short-lived panel preview token, for the buyer's own photo views (/media/… needs it until published). */
  previewToken: string;
  /** Fields the theme shows (others are hidden in the panel). */
  fields: ThemeFieldUse;
  rights: RightsView;
  online: boolean;
  /** Opens the "Change names or date" sheet (after the first publish). */
  openIdentity: (focus: 'names' | 'date') => void;
  photoSlots: PanelPhotoSlot[];
  uploadPhoto: (slot: PanelPhotoSlot, blob: Blob) => Promise<{ ok: boolean; message?: string }>;
  removePhoto: (slot: PanelPhotoSlot) => void;
  /** G121: the last jump to a field (Home → Settings): a folded part holding that field opens for it (a new object each jump). */
  jump?: { path: string } | null;
  /** G121: what guests tap first in this design ("envelope", "book" …; PanelTheme.opening), for the panel's sentences. */
  opening?: string | null;
}

export const PanelContext = createContext<PanelContextValue | null>(null);

/** This phone's time zone (read after mount, so the server and the first browser render match). Null when unknown. */
export function useDeviceZone(): string | null {
  const [zone, setZone] = useState<string | null>(null);
  useEffect(() => {
    try {
      const z = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
      setZone(z && isValidTimeZone(z) ? z : null);
    } catch {
      /* unknown */
    }
  }, []);
  return zone;
}

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
  const { issuesAt, locked, isSample } = usePanelContext();
  const [typing, setTyping] = useState(false);
  const issues = issuesAt(path);
  const shown = typing ? [] : issues;
  return { issues: shown, hasError: shown.some((i) => i.level === 'error'), setTyping, locked, sample: isSample(path) };
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
  const sample = isSample(path);
  return (
    <div className={cx(styles.field, sample && styles.fieldSample)} data-sample-field={sample ? path : undefined}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {optional ? <span className={styles.optional}> (optional)</span> : null}
          {sample ? <span className={styles.visuallyHidden}>, still the design’s sample text</span> : null}
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
  const { issues, hasError, setTyping, locked, sample } = useFieldState(path);
  const text = value ?? '';
  const length = [...text].length;
  // Only near the limit (G060-fix: "5/40" next to every name was noise).
  const counter =
    maxLength !== undefined && length >= Math.floor(maxLength * 0.8) ? (
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
    // Sample text is selected on focus: typing replaces it.
    onFocus: sample ? (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.currentTarget.select() : undefined,
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

/**
 * Time picker. The written form ("4:00 PM") is shown only when the phone's own time format differs from the
 * site's (docs/16 §5.3: the same information twice is noise).
 */
export function TimeField(props: BaseFieldProps & { value: string | undefined; locale: string; onChange: (value: string) => void }) {
  const { path, value, locale, onChange } = props;
  const { issues, hasError, setTyping, locked } = useFieldState(path);
  const [deviceUses12h] = useState(() => {
    try {
      return new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12 === true;
    } catch {
      return true;
    }
  });
  const siteUses12h = locale === 'en-US' || locale === 'en-CA' || locale === 'en-AU';
  const written = deviceUses12h === siteUses12h ? null : formatTime(value, locale);
  return (
    <FieldFrame {...props} display={props.display ?? (written ? `On your website: ${written}` : null)} issues={issues}>
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

/** On/off row with its description, right next to the content it controls (docs/16 §4.3). */
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
      </button>
    </div>
  );
}

/** A group of fields inside a section page, with an optional heading. */
export function Group({ title, children, className, ...rest }: { title?: ReactNode; children: ReactNode; className?: string } & Record<`data-${string}`, unknown>) {
  return (
    <fieldset className={cx(styles.group, className)} {...rest}>
      {title ? <legend className={styles.groupTitle}>{title}</legend> : null}
      {children}
    </fieldset>
  );
}

/**
 * One card of a list (event, moment, question, form question): title + overflow menu (Move up / Move down /
 * Remove). Remove happens at once with a 6 s Undo (autosave stores it within a second; Undo puts it back).
 * No drag and drop (hard on touch and with screen readers, WCAG 2.5.7).
 */
export function RepeatableItem<T>({
  index,
  count,
  noun,
  title,
  select,
  assign,
  children,
  ...rest
}: {
  index: number;
  count: number;
  noun: string;
  title: string;
  /** The list inside a draft, and how to put a new list back (moves, removal and Undo run on the latest draft). */
  select: (c: ContentRecord) => T[];
  assign: (c: ContentRecord, list: T[]) => void;
  children: ReactNode;
} & Record<`data-${string}`, unknown>) {
  const { locked, edit } = usePanelContext();
  const snack = useSnackbar();
  const capital = noun.charAt(0).toUpperCase() + noun.slice(1);
  const focusMoved = (to: number) =>
    window.setTimeout(() => document.querySelector<HTMLButtonElement>(`[aria-label="Options for ${noun} ${to + 1}"]`)?.focus(), 0);
  const move = (to: number) => {
    edit((c) => assign(c, moveItem(select(c), index, to)));
    focusMoved(to);
  };
  const remove = () => {
    let removed: T | undefined;
    edit((c) => {
      const list = select(c);
      removed = list[index];
      assign(c, list.filter((_, i) => i !== index));
    });
    snack(`${capital} removed`, {
      label: 'Undo',
      run: () =>
        edit((c) => {
          if (removed === undefined) return;
          const list = [...select(c)];
          list.splice(Math.min(index, list.length), 0, removed);
          assign(c, list);
        }),
    });
  };
  return (
    <fieldset className={styles.item} {...rest}>
      <legend className={styles.visuallyHidden}>{title}</legend>
      <div className={styles.itemHead}>
        <span className={styles.itemTitle} aria-hidden="true">
          {title}
        </span>
        <OverflowMenu
          label={`Options for ${noun} ${index + 1}`}
          disabled={locked}
          items={[
            { label: 'Move up', icon: ArrowUp, disabled: index === 0, onSelect: () => move(index - 1) },
            { label: 'Move down', icon: ArrowDown, disabled: index === count - 1, onSelect: () => move(index + 1) },
            { label: 'Remove', icon: Trash2, danger: true, onSelect: remove },
          ]}
        />
      </div>
      {children}
    </fieldset>
  );
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/**
 * G100 (docs/18 §2): one line at the top of a page instead of a "Sample" tag on every field — "3 fields still show sample
 * text" + "Go to the first one". `count` comes from the panel's own sample detection (lib/panel/model.ts sampleNotes, the
 * same notes Home and the first publish use). The jump finds the first soft sample field inside `scope` (opening a folded
 * section around it); when none is on the page (e.g. a locked date), `onMissing` takes over.
 */
export function SampleLine({ count, scope, onMissing }: { count: number; scope: string; onMissing?: () => void }) {
  if (!count) return null;
  const jump = () => {
    const root = document.querySelector(scope);
    const field = root?.querySelector<HTMLElement>('[data-sample-field]');
    const input = field?.querySelector<HTMLElement>('input, textarea, select, button:not([disabled])');
    if (!field || !input) return onMissing?.();
    const fold = field.closest('[data-disclosure]')?.querySelector<HTMLButtonElement>(':scope > h2 > button[aria-expanded="false"], :scope > h3 > button[aria-expanded="false"]');
    fold?.click();
    window.setTimeout(() => {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      input.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      input.focus({ preventScroll: true });
    }, fold ? 60 : 0);
  };
  return (
    <p className={styles.sampleLine} data-sample-line>
      <span className={styles.sampleLineDot} aria-hidden="true" />
      <span className={styles.sampleLineText}>
        {count} {count === 1 ? 'field still shows' : 'fields still show'} sample text
      </span>
      <button type="button" className={styles.sampleJump} onClick={jump} data-sample-jump>
        {count === 1 ? 'Go to it' : 'Go to the first one'}
      </button>
    </p>
  );
}
