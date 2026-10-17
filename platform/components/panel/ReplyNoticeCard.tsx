'use client';
// Guests → "Email me when a guest replies" (G152). Off by default; shown only while the platform can send email
// (GET /api/edit/<slug>/notify says available — the server's mailer, like /my's sign-in link). The emails go to the
// address the website was started with and hold no edit link (lib/rsvp/notify.ts).

import { Mail } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { PanelApi } from './api.ts';
import { Switch } from './fields.tsx';
import { Card, useSnackbar } from './ui.tsx';
import { t } from '../../lib/i18n/client.ts';
import styles from './panel.module.css';

interface Notify {
  available: boolean;
  enabled: boolean;
  to: string | null;
}

export function ReplyNoticeCard({ api, online, archived }: { api: PanelApi; online: boolean; archived: boolean }) {
  const [notify, setNotify] = useState<Notify | null>(null);
  const [busy, setBusy] = useState(false);
  const snack = useSnackbar();

  const load = useCallback(async () => {
    const res = await api.notifyStatus();
    if (res.ok && res.body.notify) setNotify(res.body.notify as unknown as Notify);
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!notify?.available || archived) return null;

  const toggle = async (enabled: boolean) => {
    if (busy || !online) return;
    setBusy(true);
    const res = await api.setNotify(enabled);
    setBusy(false);
    if (res.ok && res.body.notify) {
      setNotify(res.body.notify as unknown as Notify);
      snack(enabled ? t('We will email you when a guest replies.') : t('Reply emails turned off.'));
    } else {
      snack(res.body.message ? t(res.body.message) : t('Something went wrong. Please try again.'));
    }
  };

  return (
    <Card title={t('Reply emails')} titleId="reply-notice-title" icon={Mail} data-reply-notice={notify.enabled ? 'on' : 'off'}>
      <Switch
        id="reply-notice-switch"
        label={t('Email me when a guest replies')}
        hint={notify.to ? t('Sent to {email}, the address you started your website with.', { email: notify.to }) : t('Your website has no email address yet. Please message the shop.')}
        checked={notify.enabled}
        onChange={(next) => void toggle(next)}
      />
      <p className={styles.hint}>{t('Each email has the guest’s name and answer. At most 20 a day; after that, the next email counts the rest.')}</p>
    </Card>
  );
}
