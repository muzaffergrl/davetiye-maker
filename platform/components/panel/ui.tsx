'use client';
// Small building blocks of the panel v2 (G060, docs/16 §7): buttons, badges, cards, banners, empty states,
// snackbar with Undo, overflow menu, segmented control, the save indicator and the rights meter.
// Icons: lucide-react (pinned 1.46.0), imported one by one; an icon never carries meaning alone.

import {
  ChevronDown,
  CircleAlert,
  CircleCheckBig,
  Cloud,
  CloudOff,
  Ellipsis,
  Info,
  LoaderCircle,
  TriangleAlert,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { PANEL_FONTS } from './fonts.ts';
import type { SaveState } from './usePanel.ts';
import styles from './panel.module.css';

export const cx = (...names: Array<string | false | null | undefined>) => names.filter(Boolean).join(' ');

// ---------------------------------------------------------------------------------------------
// Buttons

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'dangerText';

export function Button({
  variant = 'secondary',
  icon: Icon,
  busy,
  busyLabel,
  block,
  small,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: LucideIcon;
  busy?: boolean;
  busyLabel?: string;
  block?: boolean;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      {...rest}
      disabled={rest.disabled || busy}
      aria-busy={busy || undefined}
      className={cx(styles.btn, styles[`btn_${variant}`], block && styles.btnBlock, small && styles.btnSmall, className)}
    >
      {busy ? <LoaderCircle className={styles.spin} size={18} aria-hidden="true" /> : Icon ? <Icon size={18} strokeWidth={1.75} aria-hidden="true" /> : null}
      <span>{busy && busyLabel ? busyLabel : children}</span>
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon; label: string }) {
  return (
    <button type="button" aria-label={label} title={label} {...rest} className={cx(styles.iconBtn, className)}>
      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

// ---------------------------------------------------------------------------------------------
// Badges, cards, banners

/** `strong`: aubergine with white text (the "New" reply badge; K29: one accent colour). */
export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent' | 'strong';

export function Badge({ tone = 'neutral', icon: Icon, children, ...rest }: { tone?: Tone; icon?: LucideIcon; children: ReactNode } & Record<`data-${string}`, unknown>) {
  return (
    <span className={cx(styles.badge, styles[`badge_${tone}`])} {...rest}>
      {Icon ? <Icon size={14} strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  title,
  titleId,
  action,
  icon: Icon,
  ...rest
}: { children: ReactNode; className?: string; title?: ReactNode; titleId?: string; action?: ReactNode; icon?: LucideIcon } & Record<`data-${string}`, unknown>) {
  const heading = (
    <h2 id={titleId} className={styles.cardTitle}>
      {title}
    </h2>
  );
  return (
    <section className={cx(styles.card, className)} aria-labelledby={title ? titleId : undefined} {...rest}>
      {title ? (
        <div className={styles.cardHead}>
          {Icon ? (
            <div className={styles.cardTitleWrap}>
              <span className={styles.cardIcon} aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              {heading}
            </div>
          ) : (
            heading
          )}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const BANNER_ICONS: Record<'info' | 'warning' | 'danger' | 'success', LucideIcon> = {
  info: Info,
  warning: TriangleAlert,
  danger: CircleAlert,
  success: CircleCheckBig,
};

export function Banner({
  tone = 'info',
  icon,
  children,
  actions,
  role,
  ...rest
}: {
  tone?: 'info' | 'warning' | 'danger' | 'success';
  icon?: LucideIcon;
  children: ReactNode;
  actions?: ReactNode;
  role?: 'alert' | 'status';
} & Record<`data-${string}`, unknown>) {
  const Icon = icon ?? BANNER_ICONS[tone];
  return (
    <div className={cx(styles.banner, styles[`banner_${tone}`])} role={role} {...rest}>
      <Icon className={styles.bannerIcon} size={20} strokeWidth={1.75} aria-hidden="true" />
      <div className={styles.bannerBody}>
        <div>{children}</div>
        {actions ? <div className={styles.bannerActions}>{actions}</div> : null}
      </div>
    </div>
  );
}

/**
 * A section that opens and closes (K29: Share keeps the guest password and the private edit link one tap away).
 * Heading + button (aria-expanded / aria-controls); the closed body stays in the page, `hidden`, so what was typed in it
 * is kept. `status` is a short word after the title ("Off", "On").
 */
export function Disclosure({
  id,
  title,
  status,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  id: string;
  title: string;
  status?: ReactNode;
  icon?: LucideIcon;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  return (
    <section className={cx(styles.disclosure, open && styles.disclosureOpen)} data-disclosure={id}>
      <h2 className={styles.disclosureHeading}>
        <button type="button" className={styles.disclosureButton} aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((v) => !v)}>
          {Icon ? (
            <span className={styles.cardIcon} aria-hidden="true">
              <Icon size={22} strokeWidth={1.75} />
            </span>
          ) : null}
          <span className={styles.disclosureTitle}>{title}</span>
          {status ? <span className={styles.disclosureStatus}>{status}</span> : null}
          <ChevronDown size={22} strokeWidth={1.75} aria-hidden="true" className={styles.disclosureChev} />
        </button>
      </h2>
      <div id={bodyId} className={styles.disclosureBody} hidden={!open}>
        {children}
      </div>
    </section>
  );
}

/** A plain progress bar with its own text (role="progressbar"). */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={styles.meterBar} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} aria-label={label}>
      <span className={styles.meterBarFill} style={{ width: `${v}%` }} />
    </div>
  );
}

export function EmptyState({ icon: Icon, children, action }: { icon: LucideIcon; children: ReactNode; action?: ReactNode }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden="true">
        <Icon size={24} strokeWidth={1.5} />
      </span>
      <p className={styles.emptyText}>{children}</p>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Snackbar ("Event removed · Undo", "Copied")

export interface SnackAction {
  label: string;
  run: () => void;
}

interface SnackItem {
  id: number;
  text: string;
  actions: SnackAction[];
}

/** Shows a snackbar with up to two actions (e.g. "Undo" and "Publish", G060-fix). */
const SnackContext = createContext<(text: string, action?: SnackAction | SnackAction[]) => void>(() => undefined);

export function useSnackbar() {
  return useContext(SnackContext);
}

const SNACK_MS = 6000;

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<SnackItem | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((text: string, action?: SnackAction | SnackAction[]) => {
    if (timer.current) clearTimeout(timer.current);
    const id = Date.now();
    const actions = (Array.isArray(action) ? action : action ? [action] : []).slice(0, 2);
    setItem({ id, text, actions });
    // With an action the message stays a little longer (time to read it and reach the button).
    timer.current = setTimeout(() => setItem((cur) => (cur?.id === id ? null : cur)), actions.length > 1 ? SNACK_MS + 4000 : SNACK_MS);
  }, []);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  return (
    <SnackContext.Provider value={show}>
      {children}
      <div className={cx(styles.snackHost, PANEL_FONTS)} role="status" aria-live="polite">
        {item ? (
          <div key={item.id} className={styles.snack} data-snackbar>
            <span>{item.text}</span>
            {item.actions.length ? (
              <span className={styles.snackActions}>
                {item.actions.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    className={styles.snackAction}
                    onClick={() => {
                      a.run();
                      setItem(null);
                    }}
                    data-snack-action={a.label}
                  >
                    {a.label}
                  </button>
                ))}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </SnackContext.Provider>
  );
}

// ---------------------------------------------------------------------------------------------
// Overflow menu (arrow keys, Escape, focus back to the button)

export interface MenuItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
}

export function OverflowMenu({ label, items, disabled }: { label: string; items: MenuItem[]; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const enabled = items.filter((i) => !i.disabled);

  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not([disabled])');
    first?.focus();
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const close = (focus = true) => {
    setOpen(false);
    if (focus) buttonRef.current?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const nodes = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])') ?? [])];
    const i = nodes.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nodes[(i + 1) % nodes.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nodes[(i - 1 + nodes.length) % nodes.length]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div className={styles.menuWrap}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.iconBtn}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled || !enabled.length}
        onClick={() => setOpen((v) => !v)}
      >
        <Ellipsis size={22} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open ? (
        <div ref={menuRef} id={menuId} role="menu" aria-label={label} className={styles.menu} onKeyDown={onKeyDown}>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={cx(styles.menuItem, item.danger && styles.menuItemDanger)}
                onClick={() => {
                  close();
                  item.onSelect();
                }}
              >
                {Icon ? <Icon size={18} strokeWidth={1.75} aria-hidden="true" /> : null}
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Segmented control (radio group)

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  id,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; hint?: string }>;
  onChange: (v: T) => void;
  disabled?: boolean;
  id?: string;
}) {
  const name = useId();
  return (
    <fieldset className={styles.segmented} id={id} disabled={disabled}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.segmentedOptions}>
        {options.map((o) => (
          <label key={o.value} className={cx(styles.segment, o.value === value && styles.segmentOn)}>
            <input type="radio" name={name} value={o.value} checked={o.value === value} onChange={() => onChange(o.value)} className={styles.segmentInput} />
            <span className={styles.segmentLabel}>{o.label}</span>
            {o.hint ? <span className={styles.segmentHint}>{o.hint}</span> : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------------------------
// Save indicator (docs/16 §9.1)

const SAVE_UI: Record<SaveState, { icon: LucideIcon | null; text: string; tone: Tone }> = {
  saved: { icon: Cloud, text: 'Saved', tone: 'neutral' },
  pending: { icon: null, text: 'Unsaved changes', tone: 'neutral' },
  saving: { icon: LoaderCircle, text: 'Saving…', tone: 'neutral' },
  retrying: { icon: CloudOff, text: 'Not saved yet. Trying again…', tone: 'warning' },
  offline: { icon: WifiOff, text: 'Offline', tone: 'warning' },
  conflict: { icon: TriangleAlert, text: 'Saving paused', tone: 'danger' },
  unauthorized: { icon: TriangleAlert, text: 'Saving paused', tone: 'danger' },
  refused: { icon: CircleAlert, text: 'Not saved', tone: 'danger' },
};

/**
 * Icon + short text; on narrow screens only the icon shows (the full text stays for screen readers).
 * "Saving…" shorter than 300 ms is not shown (no flicker). Tapping it while unsaved saves at once.
 */
export function SaveIndicator({ state, message, onSaveNow, compact }: { state: SaveState; message?: string | null; onSaveNow: () => void; compact?: boolean }) {
  const [shown, setShown] = useState<SaveState>(state);
  useEffect(() => {
    if (state !== 'saving') {
      setShown(state);
      return;
    }
    const t = setTimeout(() => setShown('saving'), 300);
    return () => clearTimeout(t);
  }, [state]);
  const ui = SAVE_UI[shown];
  const text = shown === 'refused' && message ? message : ui.text;
  const Icon = ui.icon;
  const clickable = shown === 'pending' || shown === 'retrying';
  const inner = (
    <>
      {Icon ? <Icon size={18} strokeWidth={1.75} className={shown === 'saving' ? styles.spin : undefined} aria-hidden="true" /> : <span className={styles.pendingDot} aria-hidden="true" />}
      <span className={cx(styles.saveText, compact && styles.visuallyHiddenNarrow)}>{text}</span>
    </>
  );
  return (
    <div className={cx(styles.save, styles[`save_${ui.tone}`])} data-save-state={state} title={text}>
      {/* Only the saved <-> unsaved transitions are announced, not every keystroke. */}
      <span className={styles.visuallyHidden} role="status" aria-live="polite">
        {state === 'saved' ? 'All changes saved' : state === 'pending' || state === 'saving' ? '' : text}
      </span>
      {clickable ? (
        <button type="button" className={styles.saveButton} onClick={onSaveNow} aria-label={`${text}. Save now`}>
          {inner}
        </button>
      ) : (
        <span className={styles.saveStatic}>{inner}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Rights meter: "2 of 3 changes left" + dots (filled = left)

export function RightsMeter({ remaining, total }: { remaining: number; total: number }) {
  const dots = Math.min(total, 6);
  return (
    <span className={styles.meter}>
      <span className={styles.meterDots} aria-hidden="true">
        {Array.from({ length: dots }, (_, i) => (
          <span key={i} className={cx(styles.meterDot, i < remaining && styles.meterDotOn)} />
        ))}
      </span>
      <span className={styles.visuallyHidden}>
        {remaining} of {total} name and date changes left
      </span>
      <span aria-hidden="true" className={styles.meterText}>
        {remaining} of {total} changes left
      </span>
    </span>
  );
}
