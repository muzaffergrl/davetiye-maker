'use client';
// "Change names or date" after the first publish (G060, docs/16 §11.6). Names and date are edited together;
// the line under the fields says, while typing, what the change will cost (same pure rule the server uses),
// and the main button's text is the confirmation ("Save fix" / "Use 1 change" / "Use my last change").
// G060-fix: free cases are named in plain words (date moved by up to a week, surname, small fix), going back to
// before the last change is "Undo" (free, the change is given back), and the design's sample date is replaced free once.

import { CircleCheckBig, Info, Lock, TriangleAlert, Undo2, type LucideIcon } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import { CONTENT_LIMITS } from '../../lib/content/limits.ts';
import { PANEL_BRAND } from '../../lib/panel/brand.ts';
import { openingPlace, withPartnerName } from '../../lib/panel/model.ts';
import {
  classifyIdentityChange,
  DATE_FREE_DAYS,
  identityOf,
  isSampleDateReplacement,
  isUndo,
  sameIdentity,
  type FreeReason,
  type Identity,
} from '../../lib/panel/rights.ts';
import { Sheet } from './Sheet.tsx';
import { Button, cx } from './ui.tsx';
import type { IdentityOutcome } from './usePanel.ts';
import styles from './panel.module.css';
import { msg, t, tn } from '../../lib/i18n/client.ts';

export function noChangesLeftText(total: number): string {
  return t(
    "You've used all {total} name and date changes. Small typo fixes, surnames and moving your date by up to {days} days are still free. If your wedding moved further or something else needs to change, contact us at {email} or message {shop} on Etsy with your order number.",
    { total, days: DATE_FREE_DAYS, email: PANEL_BRAND.supportEmail, shop: PANEL_BRAND.shopName },
  );
}

/** "Moving your date by up to 7 days is free." / "Adding a surname is free." / "Free: date moved, surname, small fix." */
export function freeText(free: readonly FreeReason[]): string {
  if (free.length === 1 && free[0] === 'date') return t('Moving your date by up to {days} days is free.', { days: DATE_FREE_DAYS });
  if (free.length === 1 && free[0] === 'surname') return t('Adding a surname is free.');
  if (free.length === 1) return t('Small fix — free.');
  const words: Record<FreeReason, string> = { date: msg('date moved by a few days'), surname: msg('surname'), typo: msg('small fix') };
  return t('Free: {list}.', { list: free.map((f) => t(words[f])).join(', ') });
}

type Draft = Pick<ContentRecord, 'partners' | 'name_display' | 'initials' | 'date'>;

function draftOf(content: ContentRecord): Draft {
  return structuredClone({ partners: content.partners, name_display: content.name_display, initials: content.initials, date: content.date });
}

export function IdentitySheet({
  content,
  anchor,
  remaining,
  total,
  showInitials,
  focus,
  sampleDate = null,
  undo = null,
  onClose,
  onSubmit,
  opening = null,
}: {
  content: ContentRecord;
  anchor: Identity;
  remaining: number;
  total: number;
  showInitials: boolean;
  focus: 'names' | 'date';
  /** The design's sample date: the first move away from it is free when the site was published with it. */
  sampleDate?: string | null;
  /** The last counted change while it can still be taken back for free (rights.undo). */
  undo?: { from: Identity; until: string | null } | null;
  onClose: () => void;
  onSubmit: (identity: Identity, intent: 'fix' | 'change') => Promise<IdentityOutcome>;
  /** G121: what guests tap first in this design ("envelope", "book" …). */
  opening?: string | null;
}) {
  const uid = useId();
  const current = useMemo(() => identityOf(content), [content]);
  const [draft, setDraft] = useState<Draft>(() => draftOf(content));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(remaining);
  const next = identityOf(draft);
  const dirty = !sameIdentity(next, current);
  const { kind, free } = classifyIdentityChange(anchor, next);
  const cls: 'unchanged' | 'typo' | 'undo' | 'sample' | 'change' = !dirty
    ? 'unchanged'
    : kind !== 'change'
      ? 'typo'
      : undo && isUndo(undo, next) && (!undo.until || Date.parse(undo.until) > Date.now())
        ? 'undo'
        : isSampleDateReplacement(anchor, next, sampleDate)
          ? 'sample'
          : 'change';
  const dateMovedFar = cls === 'change' && next.date !== anchor.date;

  const set = (fn: (d: Draft) => void) => {
    setError(null);
    setDraft((d) => {
      const copy = structuredClone(d);
      fn(copy);
      return copy;
    });
  };
  const setName = (i: number, field: 'display_name' | 'full_name', value: string) => {
    setError(null);
    setDraft((d) => {
      // Same automatic follow-up as before publishing (full name, names line, monogram follow while automatic).
      const updated = withPartnerName({ ...d } as ContentRecord, i, field, value);
      return { partners: updated.partners, name_display: updated.name_display, initials: updated.initials, date: d.date };
    });
  };

  let info: { icon: LucideIcon; tone: string; text: string };
  let primary: string;
  if (cls === 'unchanged') {
    info = { icon: Info, tone: styles.costNeutral, text: t('Make your change above.') };
    primary = t('Save');
  } else if (cls === 'typo') {
    info = { icon: CircleCheckBig, tone: styles.costFree, text: `${freeText(free)} ${tn(left, 'You still have {n} change left.', 'You still have {n} changes left.')}` };
    primary = t('Save — free');
  } else if (cls === 'undo') {
    info = { icon: Undo2, tone: styles.costUndo, text: t('Back to how it was before your last change — free, and you get that change back.') };
    primary = t('Undo my last change');
  } else if (cls === 'sample') {
    info = { icon: CircleCheckBig, tone: styles.costFree, text: t('Replacing the design’s sample date with your real date is free (once).') };
    primary = t('Save my date — free');
  } else if (left >= 2) {
    info = {
      icon: Info,
      tone: styles.costInfo,
      text: `${t("This uses 1 of your {total} changes. You'll have {left} left.", { total, left: left - 1 })}${dateMovedFar ? ` ${t('(Only date moves of up to {days} days are free.)', { days: DATE_FREE_DAYS })}` : ''}`,
    };
    primary = t('Use 1 change');
  } else if (left === 1) {
    info = { icon: TriangleAlert, tone: styles.costWarn, text: t('This is your last change. After this, only small typo fixes are possible.') };
    primary = t('Use my last change');
  } else {
    info = { icon: Lock, tone: styles.costLocked, text: noChangesLeftText(total) };
    primary = t('Use 1 change');
  }
  const InfoIcon = info.icon;
  const blocked = cls === 'unchanged' || (cls === 'change' && left === 0);

  const submit = async () => {
    setBusy(true);
    setError(null);
    const res = await onSubmit(next, cls === 'change' ? 'change' : 'fix');
    setBusy(false);
    if (res.ok) return onClose();
    if (res.code === 'no_changes_left') {
      setLeft(0);
      return;
    }
    if (res.code === 'confirm_required') {
      // The site was changed elsewhere since this sheet opened: the server counts it as a change. Ask again.
      if (typeof res.remaining === 'number') setLeft(res.remaining);
      setError(t('This now uses 1 change. Please confirm again.'));
      return;
    }
    setError(t(res.issues?.[0]?.message ?? res.message ?? msg('This could not be saved. Please try again.')));
  };

  const fid = (name: string) => `${uid}-${name}`;
  const partners = draft.partners ?? [];
  return (
    <Sheet title={t('Change names or date')} onClose={onClose} testId="identity">
      <p className={styles.hint}>
        {t('Your names and date are on the {place}, the page titles and the link preview. Changes show after you publish them.', { place: t(openingPlace(opening)) })}
      </p>
      {partners.map((p, i) => (
        <fieldset key={i} className={styles.group}>
          <legend className={styles.groupTitle}>{i === 0 ? t('First partner') : t('Second partner')}</legend>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={fid(`first-${i}`)}>
              {t('First name')}
            </label>
            <input
              id={fid(`first-${i}`)}
              className={styles.input}
              value={p.display_name ?? ''}
              maxLength={CONTENT_LIMITS.name}
              autoComplete="off"
              data-autofocus={focus === 'names' && i === 0 ? true : undefined}
              onChange={(e) => setName(i, 'display_name', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={fid(`full-${i}`)}>
              {t('Full name')} <span className={styles.optional}>{t('(optional)')}</span>
            </label>
            <input id={fid(`full-${i}`)} className={styles.input} value={p.full_name ?? ''} maxLength={CONTENT_LIMITS.fullName} onChange={(e) => setName(i, 'full_name', e.target.value)} />
          </div>
        </fieldset>
      ))}
      <div className={styles.field}>
        <label className={styles.label} htmlFor={fid('shown')}>
          {t('How your names appear')}
        </label>
        <input id={fid('shown')} className={styles.input} value={draft.name_display ?? ''} maxLength={CONTENT_LIMITS.nameDisplay} onChange={(e) => set((d) => void (d.name_display = e.target.value))} />
      </div>
      {showInitials ? (
        <div className={styles.field}>
          <label className={styles.label} htmlFor={fid('initials')}>
            {t('Monogram')}
          </label>
          <input id={fid('initials')} className={styles.input} value={draft.initials ?? ''} maxLength={9} onChange={(e) => set((d) => void (d.initials = e.target.value))} />
        </div>
      ) : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor={fid('date')}>
          {t('Wedding date')}
        </label>
        <input
          id={fid('date')}
          type="date"
          className={styles.input}
          value={draft.date ?? ''}
          data-autofocus={focus === 'date' ? true : undefined}
          onChange={(e) => set((d) => void (d.date = e.target.value))}
        />
        <p className={styles.display}>{formatDateLong(draft.date, content.locale) ?? ''}</p>
      </div>

      {error ? (
        <p className={styles.issueError} role="alert">
          {error}
        </p>
      ) : null}
      {/* The cost line stays in view with the button while typing (the button's text is the confirmation). */}
      <div className={cx(styles.buttonRow, styles.stickyActions)}>
        <div className={cx(styles.cost, info.tone)} role="status" aria-live="polite" data-identity-class={cls}>
          <InfoIcon size={20} strokeWidth={1.75} aria-hidden="true" />
          <p>{info.text}</p>
        </div>
        <Button variant="primary" busy={busy} busyLabel={t('Saving…')} disabled={blocked} onClick={() => void submit()} data-identity-submit>
          {primary}
        </Button>
        {dirty ? (
          <Button variant="secondary" onClick={() => setDraft(draftOf(content))}>
            {t('Undo my edits')}
          </Button>
        ) : (
          <Button variant="secondary" onClick={onClose}>
            {t('Cancel')}
          </Button>
        )}
      </div>
    </Sheet>
  );
}
