'use client';
// The panel's Home view (G060, docs/16 §6; K29 simpler panel): status, progress + next three tasks, replies, dates.
// G181: the other views have their own modules (EditListView, ShareView, HelpSheet, guests.tsx), each loaded with its view.

import { Archive, ChevronRight, CircleCheckBig, Copy, Download, Heart, Hourglass, MessageCircle, MessageCircleQuestionMark, Pencil, Send, Share2, Sparkles, Users, type LucideIcon } from 'lucide-react';
import { formatDate, formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import { photoAt, type PanelMeta, type PanelTheme } from '../../lib/panel/model.ts';
import { ARCHIVE_TEXT } from '../../lib/panel/rights.ts';
import type { Replies } from './replies.ts';
import { type Readiness } from './pages.ts';
import { zoneCity } from './zone.ts';
import { Badge, Banner, Button, Card, cx, ProgressBar } from './ui.tsx';
import styles from './panel.module.css';
import { t, tn } from '../../lib/i18n/client.ts';

import type { NextStep } from './next-steps.ts';
import { UrlText } from './UrlText.tsx';

// ---------------------------------------------------------------------------------------------
// Home

export function HomeView({
  content,
  meta,
  theme,
  url,
  steps,
  readiness,
  setupStep,
  thankYouOn = false,
  replies,
  onGo,
  onPublish,
  onShare,
  onContinueSetup,
  onHelp,
  onChat,
  onCopy,
  excelUrl,
}: {
  content: ContentRecord;
  meta: PanelMeta;
  theme: PanelTheme;
  url: string;
  /** The next tasks, at most three (K29). */
  steps: NextStep[];
  readiness: Readiness;
  setupStep: number | null;
  /** G075: the live website shows its thank-you page now. */
  thankYouOn?: boolean;
  replies: Replies;
  onGo: (path: string) => void;
  onPublish: () => void;
  onShare: () => void;
  onContinueSetup: () => void;
  onHelp: (topic?: string) => void;
  /** The AI support chat (SupportSheet). */
  onChat?: () => void;
  onCopy: () => void;
  /** G140 (K45 item 2): the guest list as Excel, one tap from Home (same file as Guests → Download Excel). */
  excelUrl?: string;
}) {
  const r = meta.rights;
  const live = meta.status === 'published';
  const filled = theme.photos.filter((s) => photoAt(content, s.source)).length;
  return (
    <div className={styles.stack}>
      <StatusCard meta={meta} url={url} setupStep={setupStep} onPublish={onPublish} onShare={onShare} onContinueSetup={onContinueSetup} onCopy={onCopy} />

      {/* G075: after the wedding (or turned on) the live website is a thank-you page. */}
      {thankYouOn ? (
        <Card title={t('Your website switched to thank-you mode')} titleId="thank-you-card" icon={Heart} className={styles.thankYouCard} data-thank-you-card>
          <p className={styles.cardText}>
            {content.thank_you?.message
              ? t('Guests who open your link see your thank-you page and your note. Replies are closed.')
              : t('Guests who open your link see your thank-you page. Replies are closed.')}
          </p>
          <Button variant="secondary" icon={Pencil} block onClick={() => onGo('#edit/thankyou')} data-edit-thank-you>
            {t('Edit the thank-you page')}
          </Button>
        </Card>
      ) : null}

      {r.archiveSoon && r.archiveAt ? (
        <Banner tone="warning" icon={Hourglass}>
          {t('Your website is online until {date}.', { date: r.onlineUntil ? (formatDateLong(r.onlineUntil, content.locale) ?? r.onlineUntil) : t('its archive date') })}{' '}
          {t(ARCHIVE_TEXT)} {t('Download your replies before then if you want a copy on your phone.')}
        </Banner>
      ) : null}

      {/* K29: how ready the website is + only the next three tasks (each opens the right editor). */}
      {!r.archived ? (
        <section className={styles.progressCard} aria-labelledby="next-steps" data-next-steps data-readiness={readiness.percent}>
          <h2 id="next-steps" className={styles.cardTitle}>
            {readiness.percent >= 100 ? t('Your website is ready') : t('Your website is {percent}% ready', { percent: readiness.percent })}
          </h2>
          <ProgressBar value={readiness.percent} label={t('How ready your website is')} />
          {steps.length ? (
            <>
              <p className={styles.progressLead}>{steps.length === 1 ? t('Next:') : t('Next steps:')}</p>
              <ul className={styles.checklist}>
                {steps.map((s) => (
                  <li key={s.key}>
                    <button type="button" className={cx(styles.checkItem, styles[`check_${s.tone}`])} onClick={() => onGo(s.path)} data-next-step>
                      <span className={styles.checkDot} aria-hidden="true" />
                      <span className={styles.checkText}>{s.text}</span>
                      <ChevronRight size={18} aria-hidden="true" className={styles.chev} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.allSet}>
              <CircleCheckBig size={20} strokeWidth={1.75} aria-hidden="true" />
              {t('You’re all set.')} {filled < theme.photos.length ? '' : t('Every photo place has a photo.')}
            </p>
          )}
        </section>
      ) : null}

      {live || r.phase !== 'before_publish' ? (
        <button
          type="button"
          className={cx(styles.cardButton, replies.newCount > 0 && styles.cardButtonNew)}
          onClick={() => onGo('#guests')}
          data-replies-summary
          data-new-replies={replies.newCount || undefined}
        >
          <span className={styles.cardButtonIcon} aria-hidden="true">
            <Users size={22} strokeWidth={1.75} />
          </span>
          <span className={styles.cardButtonBody}>
            {/* G069: "3 new replies" since the last look on this device; otherwise "Replies". */}
            <span className={styles.cardButtonTitle}>
              {replies.newCount ? tn(replies.newCount, '{n} new reply', '{n} new replies') : t('Replies')}
            </span>
            <span className={styles.cardButtonText}>
              {replies.data
                ? replies.data.counts.responses
                  ? t('{coming} coming · {notComing} not coming', { coming: replies.data.counts.totalGuests, notComing: replies.data.counts.notAttending })
                  : t('No replies yet')
                : replies.error
                  ? t('Open to see your replies')
                  : t('Loading…')}
            </span>
          </span>
          <ChevronRight size={18} aria-hidden="true" className={styles.chev} />
        </button>
      ) : null}
      {excelUrl && replies.data?.counts.responses ? (
        <a className={cx(styles.btn, styles.btn_secondary, styles.btnBlock)} href={excelUrl} download rel="noreferrer" data-home-excel>
          <Download size={18} strokeWidth={1.75} aria-hidden="true" />
          <span>{t('Download Excel')}</span>
          <span className={styles.visuallyHidden}> {t('(your guest list: replies and a summary)')}</span>
        </a>
      ) : null}

      <Card title={t('Dates')} titleId="dates-card">
        <dl className={styles.dates}>
          <div>
            <dt>{t('Wedding')}</dt>
            <dd>{formatDateLong(content.date, content.locale) ?? '—'}</dd>
          </div>
          {content.rsvp?.method !== 'none' ? (
            <div>
              <dt>{t('Replies close')}</dt>
              <dd>{formatDate(content.rsvp?.deadline, content.locale) ?? '—'}</dd>
            </div>
          ) : null}
          <div>
            <dt>{r.archived ? t('Archived') : t('Online until')}</dt>
            <dd>{r.onlineUntil ? formatDate(r.onlineUntil, content.locale) : '—'}</dd>
          </div>
        </dl>
      </Card>

      {!r.archived ? <SettingsCard content={content} meta={meta} onGo={onGo} onHelp={onHelp} /> : null}

      {onChat ? (
        <Button variant="tertiary" icon={MessageCircle} onClick={onChat} data-open-support>
          {t('Chat with us')}
        </Button>
      ) : null}
      <Button variant="tertiary" icon={MessageCircleQuestionMark} onClick={() => onHelp()}>
        {t('Help & questions')}
      </Button>
    </div>
  );
}

/**
 * G121 (docs/18 §3 P2, Poppy/Notion value rows): the rarely changed settings, one tap from Home — each row shows its
 * value and opens the place where it is changed (the time zone and date style under Day & place → More options, the
 * name & date rule in Help, the guest password under Share).
 */
function SettingsCard({
  content,
  meta,
  onGo,
  onHelp,
}: {
  content: ContentRecord;
  meta: PanelMeta;
  onGo: (path: string) => void;
  onHelp: (topic?: string) => void;
}) {
  const r = meta.rights;
  const total = r.limit + r.granted;
  const rows: Array<{ key: string; label: string; value: string; run: () => void }> = [
    { key: 'timezone', label: t('Time zone'), value: zoneCity(content.timezone) || '—', run: () => onGo('timezone') },
    { key: 'locale', label: t('Date style'), value: content.locale === 'en-US' ? t('Month first') : t('Day first'), run: () => onGo('locale') },
    {
      key: 'changes',
      label: t('Name & date changes left'),
      value: r.phase === 'before_publish' ? t('{total} (free until you publish)', { total }) : t('{remaining} of {total}', { remaining: r.remaining, total }),
      run: () => onHelp('changes'),
    },
    { key: 'password', label: t('Guest password'), value: meta.guestAccess.enabled ? t('On') : t('Off'), run: () => onGo('#share') },
  ];
  return (
    <section className={styles.settingsCard} aria-labelledby="settings-card" data-settings-card>
      <h2 id="settings-card" className={styles.cardTitle}>
        {t('Settings')}
      </h2>
      <ul className={styles.settingsList}>
        {rows.map((row) => (
          <li key={row.key}>
            <button type="button" className={styles.settingsRow} onClick={row.run} data-setting={row.key}>
              <span className={styles.settingsLabel}>{row.label}</span>
              <span className={styles.settingsValue}>{row.value}</span>
              <ChevronRight size={18} aria-hidden="true" className={styles.chev} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Status card (comp u2_home_390): one badge, one sentence, the link and one action. K29: a live website is "Live" even
 * with unpublished changes — the sticky changes bar at the top carries those (no second "Publish changes" here).
 */
function StatusCard({
  meta,
  url,
  setupStep,
  onPublish,
  onShare,
  onContinueSetup,
  onCopy,
}: {
  meta: PanelMeta;
  url: string;
  setupStep: number | null;
  onPublish: () => void;
  onShare: () => void;
  onContinueSetup: () => void;
  onCopy: () => void;
}) {
  const r = meta.rights;
  let badge: { tone: 'success' | 'warning' | 'neutral' | 'danger' | 'accent'; text: string; icon?: LucideIcon };
  let text: string;
  let action: { label: string; run: () => void; variant: 'primary' | 'secondary'; icon?: LucideIcon } | null;
  if (r.archived) {
    badge = { tone: 'neutral', text: t('Archived'), icon: Archive };
    text = t('Your website is closed for guests now. You can still see your content and download your replies.');
    action = null;
  } else if (meta.status === 'published') {
    badge = { tone: 'success', text: t('Live'), icon: CircleCheckBig };
    text = meta.hasUnpublishedChanges ? t('Your website is live. Your newest changes are not published yet.') : t('Your website is live.');
    // The one action of a live website: share it (comp u2_home_390: the dark button).
    action = { label: t('Share'), run: onShare, variant: 'primary', icon: Share2 };
  } else if (meta.publishedAt) {
    badge = { tone: 'neutral', text: t('Offline') };
    text = t('Your website is offline. Guests see “Page not found” until you publish again.');
    action = { label: t('Publish again'), run: onPublish, variant: 'primary', icon: Send };
  } else if (meta.orderPending) {
    // G087: say it where the couple looks first, not only when Publish is tapped.
    badge = { tone: 'warning', text: t('Confirming your order'), icon: Hourglass };
    text = t('Your website is a private draft. We are confirming your Etsy order — set everything up now; you can publish as soon as it is confirmed.');
    action = setupStep !== null ? { label: t('Continue setup · Step {step} of {total}', { step: setupStep, total: 3 }), run: onContinueSetup, variant: 'primary', icon: Sparkles } : null;
  } else {
    badge = { tone: 'accent', text: t('Draft') };
    text = t('Your website is a draft. Only you can see it.');
    action =
      setupStep !== null
        ? { label: t('Continue setup · Step {step} of {total}', { step: setupStep, total: 3 }), run: onContinueSetup, variant: 'primary', icon: Sparkles }
        : { label: t('Publish'), run: onPublish, variant: 'primary', icon: Send };
  }
  // G121 (docs/18 §3 P2, Notion/Monday): one calm status label with its direct action beside it (the bar does not repeat
  // "Live" on Home); a short sentence and, when live, the link under it. The progress card below stays the anchor.
  // A short action ("Share", "Publish") sits beside the label; a long one ("Continue setup · Step 2 of 3") gets its own row.
  const inline = action !== null && action.label.length <= 16;
  const actionButton = action ? (
    <Button variant={action.variant} icon={action.icon} block={!inline} onClick={action.run} className={inline ? styles.statusAction : undefined} data-status-action>
      {action.label}
    </Button>
  ) : null;
  return (
    <section className={styles.status} aria-labelledby="status-title" data-status-card>
      <div className={styles.statusTop}>
        <Badge tone={badge.tone} icon={badge.icon}>
          {badge.text}
        </Badge>
        {inline ? actionButton : null}
      </div>
      <h2 id="status-title" className={styles.statusText}>
        {text}
      </h2>
      {!inline ? actionButton : null}
      {meta.status === 'published' && !r.archived ? (
        <div className={styles.statusLink}>
          <a href={url} target="_blank" rel="noopener noreferrer" data-public-link className={styles.url}>
            <UrlText url={url} />
          </a>
          <Button small variant="tertiary" icon={Copy} onClick={onCopy}>
            {t('Copy')}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
