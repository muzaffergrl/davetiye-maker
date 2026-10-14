'use client';
// "Change names or date" after the first publish (G060, docs/16 §11.6). Names and date are edited together;
// the line under the fields says, while typing, what the change will cost (same pure rule the server uses),
// and the main button's text is the confirmation ("Save fix" / "Use 1 change" / "Use my last change").

import { CircleCheckBig, Info, Lock, TriangleAlert, type LucideIcon } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import { CONTENT_LIMITS } from '../../lib/content/limits.ts';
import { PANEL_BRAND } from '../../lib/panel/brand.ts';
import { withPartnerName } from '../../lib/panel/model.ts';
import { classifyIdentityChange, identityOf, sameIdentity, TYPO_MAX_DISTANCE, type Identity } from '../../lib/panel/rights.ts';
import { Sheet } from './Sheet.tsx';
import { Button, cx } from './ui.tsx';
import type { IdentityOutcome } from './usePanel.ts';
import styles from './panel.module.css';

export function noChangesLeftText(total: number): string {
  return `You've used all ${total} name and date changes. Small typo fixes (up to ${TYPO_MAX_DISTANCE} letters or digits) are still free. If your wedding moved or something else needs to change, contact us at ${PANEL_BRAND.supportEmail} or message ${PANEL_BRAND.shopName} on Etsy with your order number.`;
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
  onClose,
  onSubmit,
}: {
  content: ContentRecord;
  anchor: Identity;
  remaining: number;
  total: number;
  showInitials: boolean;
  focus: 'names' | 'date';
  onClose: () => void;
  onSubmit: (identity: Identity, intent: 'fix' | 'change') => Promise<IdentityOutcome>;
}) {
  const uid = useId();
  const current = useMemo(() => identityOf(content), [content]);
  const [draft, setDraft] = useState<Draft>(() => draftOf(content));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(remaining);
  const next = identityOf(draft);
  const dirty = !sameIdentity(next, current);
  const { kind } = classifyIdentityChange(anchor, next);
  const cls: 'unchanged' | 'typo' | 'change' = !dirty ? 'unchanged' : kind === 'change' ? 'change' : 'typo';

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
    info = { icon: Info, tone: styles.costNeutral, text: 'Make your change above.' };
    primary = 'Save';
  } else if (cls === 'typo') {
    info = { icon: CircleCheckBig, tone: styles.costFree, text: `Small fix — free. You still have ${left} ${left === 1 ? 'change' : 'changes'} left.` };
    primary = 'Save fix';
  } else if (left >= 2) {
    info = { icon: Info, tone: styles.costInfo, text: `This uses 1 of your ${total} changes. You'll have ${left - 1} left.` };
    primary = 'Use 1 change';
  } else if (left === 1) {
    info = { icon: TriangleAlert, tone: styles.costWarn, text: 'This is your last change. After this, only small typo fixes are possible.' };
    primary = 'Use my last change';
  } else {
    info = { icon: Lock, tone: styles.costLocked, text: noChangesLeftText(total) };
    primary = 'Use 1 change';
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
      setError('This now uses 1 change. Please confirm again.');
      return;
    }
    setError(res.issues?.[0]?.message ?? res.message ?? 'This could not be saved. Please try again.');
  };

  const fid = (name: string) => `${uid}-${name}`;
  const partners = draft.partners ?? [];
  return (
    <Sheet title="Change names or date" onClose={onClose} testId="identity">
      <p className={styles.hint}>Your names and date are on the envelope, the page titles and the link preview. Changes show after you publish them.</p>
      {partners.map((p, i) => (
        <fieldset key={i} className={styles.group}>
          <legend className={styles.groupTitle}>{i === 0 ? 'First partner' : 'Second partner'}</legend>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={fid(`first-${i}`)}>
              First name
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
              Full name <span className={styles.optional}>(optional)</span>
            </label>
            <input id={fid(`full-${i}`)} className={styles.input} value={p.full_name ?? ''} maxLength={CONTENT_LIMITS.fullName} onChange={(e) => setName(i, 'full_name', e.target.value)} />
          </div>
        </fieldset>
      ))}
      <div className={styles.field}>
        <label className={styles.label} htmlFor={fid('shown')}>
          How your names appear
        </label>
        <input id={fid('shown')} className={styles.input} value={draft.name_display ?? ''} maxLength={CONTENT_LIMITS.nameDisplay} onChange={(e) => set((d) => void (d.name_display = e.target.value))} />
      </div>
      {showInitials ? (
        <div className={styles.field}>
          <label className={styles.label} htmlFor={fid('initials')}>
            Monogram
          </label>
          <input id={fid('initials')} className={styles.input} value={draft.initials ?? ''} maxLength={9} onChange={(e) => set((d) => void (d.initials = e.target.value))} />
        </div>
      ) : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor={fid('date')}>
          Wedding date
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
        <Button variant="primary" busy={busy} busyLabel="Saving…" disabled={blocked} onClick={() => void submit()} data-identity-submit>
          {primary}
        </Button>
        {dirty ? (
          <Button variant="secondary" onClick={() => setDraft(draftOf(content))}>
            Undo my edits
          </Button>
        ) : (
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </Sheet>
  );
}
