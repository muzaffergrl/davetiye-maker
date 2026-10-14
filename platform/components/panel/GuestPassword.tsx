'use client';
// Share → "Password protect your website" (G076, K28). Off by default. The couple sees and copies the password (it is
// meant to be shared in the invitation message); a new password asks every guest again. Changes apply to the live
// website at once — no publish. Token-based styles only (panel.module.css + guest-password.module.css), no decoration.

import { Copy, KeyRound, LockKeyhole, Sparkles } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { GUEST_PASSWORD_MAX, GUEST_PASSWORD_MIN, cleanGuestPassword, guestPasswordProblem, suggestGuestPassword, type GuestAccessView } from '../../lib/panel/guest-access.ts';
import { Switch } from './fields.tsx';
import type { AccessOutcome } from './usePanel.ts';
import { Button, Card, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';
import own from './guest-password.module.css';

export function GuestPasswordCard({
  access,
  online,
  onSave,
  onCopy,
}: {
  access: GuestAccessView;
  online: boolean;
  onSave: (enabled: boolean, password?: string) => Promise<AccessOutcome>;
  onCopy: (text: string, what: string) => void;
}) {
  const snack = useSnackbar();
  const ids = useId();
  const fieldId = `${ids}-pw`;
  const saved = access.password ?? '';
  const [opening, setOpening] = useState(false);
  const [draft, setDraft] = useState(saved);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // The stored password changed (saved here or in another tab): show it.
  useEffect(() => {
    setDraft(access.password ?? '');
    setError(null);
  }, [access.password, access.enabled]);

  const on = access.enabled || opening;
  const dirty = cleanGuestPassword(draft) !== saved;
  const offlineNote = !online ? <p className={styles.hint}>Connect to the internet to change this.</p> : null;

  const save = async (enabled: boolean, password?: string) => {
    if (password !== undefined) {
      const problem = guestPasswordProblem(password);
      if (problem) {
        setError(problem);
        input.current?.focus();
        return false;
      }
    }
    setBusy(true);
    const res = await onSave(enabled, password);
    setBusy(false);
    if (!res.ok) {
      setError(res.message ?? 'This could not be saved. Please try again.');
      return false;
    }
    setError(null);
    return res;
  };

  const toggle = async (next: boolean) => {
    setError(null);
    if (next) {
      if (saved) {
        // Back on with the password the couple already shared.
        if (await save(true)) snack('Password is on. Guests need it to open your website.');
        return;
      }
      setOpening(true);
      setDraft(suggestGuestPassword());
      requestAnimationFrame(() => input.current?.focus());
      return;
    }
    if (opening && !access.enabled) {
      setOpening(false);
      setDraft(saved);
      return;
    }
    if (await save(false)) snack('Password is off. Anyone with the link can open your website.');
  };

  const confirm = async () => {
    const wasOn = access.enabled;
    const res = await save(true, draft);
    if (!res) return;
    setOpening(false);
    snack(
      !wasOn
        ? 'Password is on. Guests need it to open your website.'
        : res.signedOut
          ? 'New password saved. Guests will be asked for it again.'
          : 'Password saved.',
    );
  };

  const cancel = () => {
    setError(null);
    if (!access.enabled) {
      setOpening(false);
      setDraft(saved);
    } else setDraft(saved);
  };

  const describedBy = [`${fieldId}-hint`, error ? `${fieldId}-error` : ''].filter(Boolean).join(' ');

  return (
    <Card title="Guest password" titleId="share-password" icon={LockKeyhole} data-guest-password={access.enabled ? 'on' : opening ? 'opening' : 'off'}>
      <div className={own.switchWrap}>
        <Switch
          id="guest-password-switch"
          label="Password protect your website"
          hint={on ? 'Guests enter the password before they see your website.' : 'Off: anyone with the link can open your website.'}
          checked={on}
          onChange={(next) => {
            if (!busy && online) void toggle(next);
          }}
        />
      </div>
      {offlineNote}
      {on ? (
        <div className={own.body}>
          <div className={styles.field}>
            <label htmlFor={fieldId} className={styles.label}>
              Password
            </label>
            <p id={`${fieldId}-hint`} className={styles.hint}>
              {GUEST_PASSWORD_MIN} to {GUEST_PASSWORD_MAX} characters. Capital letters and spaces at the ends don’t matter.
            </p>
            <input
              ref={input}
              id={fieldId}
              data-guest-password-input
              className={`${styles.input} ${own.password}`}
              type="text"
              value={draft}
              maxLength={GUEST_PASSWORD_MAX + 10}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              onChange={(e) => {
                setDraft(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (dirty || opening)) {
                  e.preventDefault();
                  void confirm();
                }
              }}
            />
            {error ? (
              <p id={`${fieldId}-error`} className={styles.issueError} role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <div className={styles.buttonRow}>
            <Button
              icon={Sparkles}
              disabled={busy}
              onClick={() => {
                setDraft(suggestGuestPassword());
                setError(null);
                input.current?.focus();
              }}
              data-guest-password-suggest
            >
              Suggest a password
            </Button>
            {access.enabled && !dirty && saved ? (
              <Button icon={Copy} onClick={() => onCopy(saved, 'Password copied')} data-guest-password-copy>
                Copy password
              </Button>
            ) : null}
          </div>
          {access.enabled && dirty ? (
            <p className={own.warn} data-guest-password-warning>
              <KeyRound size={18} strokeWidth={1.75} aria-hidden="true" className={styles.inlineIcon} />
              Guests who already opened your website will be asked for the new password.
            </p>
          ) : null}
          {dirty || opening ? (
            <div className={styles.buttonRow}>
              <Button variant="primary" icon={LockKeyhole} busy={busy} busyLabel="Saving…" disabled={!online} onClick={() => void confirm()} data-guest-password-save>
                {access.enabled ? 'Save new password' : 'Turn on password'}
              </Button>
              <Button variant="tertiary" disabled={busy} onClick={cancel}>
                Cancel
              </Button>
            </div>
          ) : null}
          <p className={own.tip}>Add the password to your invitation message, so your guests can open your website.</p>
          <p className={styles.hint}>
            Guests see a page with your names and a password box — no date, place or photos. They enter it once per phone. Your
            editor and its preview always open without it.
          </p>
        </div>
      ) : null}
    </Card>
  );
}
