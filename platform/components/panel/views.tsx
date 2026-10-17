'use client';
// Panel v2 views (G060, docs/16 §6; K29 simpler panel): Home (status, progress + next three tasks, replies, dates),
// Edit (the six pages), Guests (replies, guests.tsx), Share (the link; QR, password and edit link folded — G121), the help sheet.

import {
  Archive,
  Bookmark,
  ChevronRight,
  CircleCheckBig,
  Copy,
  Download,
  ExternalLink,
  Heart,
  Hourglass,
  KeyRound,
  Link as LinkIcon,
  LockKeyhole,
  MessageCircle,
  MessageCircleQuestionMark,
  Pencil,
  QrCode as QrIcon,
  Send,
  Share2,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { formatDate, formatDateLong } from '../../lib/content/format.ts';
import { isThankYouOn } from '../../lib/content/thank-you.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { isPlaceholder, PANEL_BRAND } from '../../lib/panel/brand.ts';
import {
  photoAt,
  publicSiteUrl,
  sampleSummaries,
  SECTION_TITLES,
  sectionForPath,
  type PanelMeta,
  type PanelTheme,
  type PublishNote,
  type SectionId,
} from '../../lib/panel/model.ts';
import { ARCHIVE_AFTER_MONTHS, ARCHIVE_TEXT, changesRuleText, FREE_CHANGES_TEXT, UNDO_TEXT } from '../../lib/panel/rights.ts';
import { rsvpClosesAt } from '../../lib/rsvp/deadline.ts';
import type { Replies } from './guests.tsx';
import { PAGE_TITLES, type PageId, type Readiness } from './pages.ts';
import type { AccessOutcome } from './usePanel.ts';
import { ShareMessage, ShareQr, type ShareFacts } from './ShareKit.tsx';
import { GuestPasswordCard } from './GuestPassword.tsx';
import { Sheet } from './Sheet.tsx';
import { zoneCity } from './sections.tsx';
import { Badge, Banner, Button, Card, cx, Disclosure, ProgressBar } from './ui.tsx';
import styles from './panel.module.css';
import kit from './share-kit.module.css';
import { SHARE_LABELS as SL } from '../../lib/panel/share.ts';
import { t, tn } from '../../lib/i18n/client.ts';

const DAY = 86_400_000;

// Replies (shared by Home and Guests) live in guests.tsx (G069).
export { GuestPrintView, GuestsView, useReplies, type RepliesSummary, type Replies, type ReplyEntry } from './guests.tsx';

// ---------------------------------------------------------------------------------------------
// Next steps

export interface NextStep {
  key: string;
  text: string;
  path: string;
  tone: 'warning' | 'danger' | 'info';
}

export function nextSteps(
  errors: ValidationIssue[],
  notes: { sample: PublishNote[]; photos: PublishNote[]; links: PublishNote[]; empty: PublishNote[] },
  content: ContentRecord,
  meta: PanelMeta,
  now = new Date(),
): NextStep[] {
  const out: NextStep[] = [];
  const bySection = new Map<SectionId, ValidationIssue[]>();
  for (const e of errors) {
    const s = sectionForPath(e.path);
    if (!s) continue;
    if (!bySection.has(s)) bySection.set(s, []);
    bySection.get(s)!.push(e);
  }
  for (const [s, list] of bySection) {
    out.push({ key: `err-${s}`, tone: 'danger', path: list[0].path, text: `${t(SECTION_TITLES[s])}: ${list.length === 1 ? t(list[0].message) : tn(list.length, '{n} thing to fix', '{n} things to fix')}` });
  }
  for (const s of sampleSummaries(notes.sample)) {
    // "Venue: replace the sample venue name and city" — names the fields, so the buyer knows what to look for.
    out.push({ key: `sample-${s.section}`, tone: 'warning', path: s.path, text: t('{section}: replace the sample {what}', { section: t(SECTION_TITLES[s.section]), what: t(s.what) }) });
  }
  if (notes.photos.length) {
    out.push({ key: 'photos', tone: 'info', path: notes.photos[0].path, text: t('Add your photos ({n} still empty)', { n: notes.photos.length }) });
  }
  for (const n of [...notes.links, ...notes.empty]) out.push({ key: `note-${n.path}`, tone: 'info', path: n.path, text: t(n.message) });
  if (meta.status === 'published' && content.rsvp?.method !== 'none' && !isThankYouOn(content, now)) {
    const closes = rsvpClosesAt(content.rsvp?.deadline, content.timezone);
    const days = closes ? Math.ceil((closes.getTime() - now.getTime()) / DAY) : null;
    if (days !== null && days > 0 && days <= 14) {
      out.push({ key: 'deadline', tone: 'info', path: 'rsvp.deadline', text: tn(days, 'Replies close in {n} day', 'Replies close in {n} days') });
    }
  }
  return out.slice(0, 5);
}

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

/** An address that breaks only after "/" (never in the middle of a word), docs/16 §6.5. */
export function UrlText({ url }: { url: string }) {
  const display = url.replace(/^https?:\/\//, '');
  const parts = display.split('/');
  return (
    <span className={styles.urlText}>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i ? '/' : ''}
          {i ? <wbr /> : null}
          <span className={p.length <= 28 ? styles.urlPart : undefined}>{p}</span>
        </Fragment>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------------------------
// Edit: the six pages (K29) — big rows, one summary line, only an error count as a badge

export function EditListView({
  pages,
  summaries,
  errorCount,
  icons,
  onOpen,
}: {
  pages: PageId[];
  summaries: Record<PageId, string>;
  errorCount: (id: PageId) => number;
  icons: Record<PageId, LucideIcon>;
  onOpen: (id: PageId) => void;
}) {
  return (
    <ul className={styles.list}>
      {pages.map((id) => {
        const Icon = icons[id];
        const errors = errorCount(id);
        return (
          <li key={id}>
            <a href={`#edit/${id}`} id={`section-${id}`} className={styles.row} onClick={(e) => (e.preventDefault(), onOpen(id))} data-section-row={id}>
              <span className={styles.rowIcon} aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className={styles.rowBody}>
                <span className={styles.rowTitle}>{t(PAGE_TITLES[id])}</span>
                <span className={styles.rowSummary}>{summaries[id]}</span>
                {errors ? (
                  <span className={styles.rowBadges}>
                    <Badge tone="danger">{t('{n} to fix', { n: errors })}</Badge>
                  </span>
                ) : null}
              </span>
              <ChevronRight size={22} aria-hidden="true" className={styles.chev} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------------------------
// Share (K29, G121; G140): the link with a big "Copy link" first, then Open / Share…; for a live website a short "ask guests
// to save the link" tip, the ready message with app links (WhatsApp, SMS, email, Messenger, Telegram) and the QR code with
// its options and printable card (folded); the guest password and the private edit link fold below; "Take the website
// offline" last, as a danger action. Texts: SHARE_LABELS (lib/panel/share.ts).

export function ShareView({
  url,
  slug,
  editKey,
  meta,
  orderRef,
  online,
  names,
  date,
  replyBy,
  thankYouOn = false,
  themeColor = null,
  shareImage = null,
  onPublish,
  onOffline,
  onCopy,
  onGuestAccess,
}: {
  url: string;
  slug: string;
  editKey: string;
  meta: PanelMeta;
  orderRef: string | null;
  online: boolean;
  /** G140: filled into the ready message and the QR card. */
  names: string;
  date: string | null;
  replyBy: string | null;
  thankYouOn?: boolean;
  themeColor?: string | null;
  shareImage?: string | null;
  onPublish: () => void;
  onOffline: () => void;
  onCopy: (text: string, what: string) => void;
  /** Guest password on/off or a new one (G076). */
  onGuestAccess: (enabled: boolean, password?: string) => Promise<AccessOutcome>;
}) {
  const live = meta.status === 'published';
  const archived = meta.rights.archived;
  const [canShare, setCanShare] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    setEditUrl(`${window.location.origin}/edit/${slug}?k=${encodeURIComponent(editKey)}`);
  }, [slug, editKey]);
  const password = meta.guestAccess.enabled ? meta.guestAccess.password : null;
  const facts: ShareFacts = useMemo(() => ({ url, names, date, replyBy, password, thankYouOn }), [url, names, date, replyBy, password, thankYouOn]);
  const shareable = live && !archived;
  return (
    <div className={styles.stack}>
      <Card title={t(SL.linkTitle)} titleId="share-link" icon={LinkIcon}>
        <p className={styles.urlField} data-share-url>
          <UrlText url={url} />
        </p>
        {!live && !archived ? <p className={styles.hint}>{t(SL.linkNotLive)}</p> : null}
        <Button variant={live ? 'primary' : 'secondary'} block icon={Copy} className={kit.copyBig} onClick={() => onCopy(url, t(SL.linkCopied))} data-copy-link>
          {t(SL.copyLink)}
        </Button>
        <div className={kit.linkActions}>
          {live ? (
            <a className={cx(styles.btn, styles.btn_secondary)} href={url} target="_blank" rel="noopener noreferrer" data-open-site>
              <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>{t(SL.openWebsite)}</span>
            </a>
          ) : null}
          {canShare && shareable ? (
            <Button icon={Share2} onClick={() => void navigator.share({ url }).catch(() => undefined)} data-share-link>
              {t(SL.shareSystem)}
            </Button>
          ) : null}
          {!live && !archived ? (
            <Button variant="primary" icon={Send} onClick={onPublish}>
              {meta.publishedAt ? t(SL.publishAgain) : t(SL.publish)}
            </Button>
          ) : null}
        </div>
      </Card>

      {shareable && !thankYouOn ? (
        <p className={kit.tip} data-save-link-tip>
          <Bookmark size={20} strokeWidth={1.75} aria-hidden="true" />
          <span>
            <strong>{t(SL.saveLinkTitle)}</strong>
            {t(SL.saveLinkText)}
          </span>
        </p>
      ) : null}

      {shareable ? (
        <Card title={t(SL.messageTitle)} titleId="share-message" icon={MessageCircle}>
          <ShareMessage facts={facts} onCopy={onCopy} />
        </Card>
      ) : null}

      {/* G121 (docs/18 §4 P2, Linktree): the QR code folds away like the password and the edit link (same title). */}
      {live ? (
        <Disclosure id="qr" title={t(SL.qrTitle)} icon={QrIcon}>
          <ShareQr facts={facts} fileBase={slug} themeColor={themeColor} shareImage={shareImage} />
        </Disclosure>
      ) : null}

      {!archived ? (
        <Disclosure id="password" title={t('Guest password')} status={meta.guestAccess.enabled ? t('On') : t('Off')} icon={LockKeyhole}>
          <GuestPasswordCard access={meta.guestAccess} online={online} onSave={onGuestAccess} onCopy={onCopy} bare />
        </Disclosure>
      ) : null}

      <Disclosure id="edit-link" title={t('Your private edit link')} icon={KeyRound}>
        <div className={styles.stack}>
          <p className={styles.cardText}>{t('Anyone with this link can edit your website. Share it only with your partner.')}</p>
          <Button variant="primary" block icon={Copy} disabled={!editUrl} onClick={() => onCopy(editUrl, t('Edit link copied'))} data-copy-edit-link>
            {t('Copy edit link')}
          </Button>
          <p className={styles.hint}>{t('Tip: add this page to your Home Screen to find your editor quickly.')}</p>
          {orderRef ? <p className={styles.hint}>{t('Your Etsy order number: {order}', { order: orderRef })}</p> : null}
        </div>
      </Disclosure>

      {live && !archived ? (
        <div className={styles.dangerZone}>
          <Button variant="dangerText" disabled={!online} onClick={onOffline}>
            {t('Take the website offline')}
          </Button>
          {!online ? <p className={styles.hint}>{t('Connect to the internet to change this.')}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

// Help

export function HelpSheet({ meta, locale, onClose, topic }: { meta: PanelMeta; locale: string; onClose: () => void; topic?: string }) {
  const r = meta.rights;
  const total = r.limit + r.granted;
  const until = r.onlineUntil ? formatDateLong(r.onlineUntil, locale) : null;
  const email = PANEL_BRAND.supportEmail;
  return (
    <Sheet title={t('Help')} onClose={onClose} testId="help">
      <div className={styles.help}>
        <section data-autofocus={topic === 'changes' || undefined} tabIndex={-1}>
          <h3 className={styles.subTitle}>{t('How do name and date changes work?')}</h3>
          <p>
            {t('Until you publish, you can change everything freely.')} {changesRuleText(total)}
          </p>
          <p>{t(FREE_CHANGES_TEXT)}</p>
          <p>{t(UNDO_TEXT)}</p>
          <p>{t('Everything else — time, venue, schedule, story, photos, details and replies — you can change as often as you like.')}</p>
          {r.phase !== 'before_publish' ? (
            <p>
              <strong>{t('{remaining} of {total} changes left.', { remaining: r.remaining, total })}</strong>
            </p>
          ) : null}
        </section>
        <section>
          <h3 className={styles.subTitle}>{t('How long does my website stay online?')}</h3>
          <p>
            {until
              ? t('Until {months} months after your wedding ({date}).', { months: ARCHIVE_AFTER_MONTHS, date: until })
              : t('Until {months} months after your wedding.', { months: ARCHIVE_AFTER_MONTHS })}{' '}
            {t(ARCHIVE_TEXT)}
          </p>
        </section>
        <section>
          <h3 className={styles.subTitle}>{t('Can my partner edit too?')}</h3>
          <p>{t('Yes: share your edit link with your partner (Share → Your private edit link → Copy edit link). Anyone with that link can edit, so keep it private.')}</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>{t('I lost my edit link')}</h3>
          <p>
            {t(
              'While this page is open, copy it again under Share → Your private edit link. If it is lost, message {shop} on Etsy with your order number: we send you a new link and the old one stops working.',
              { shop: PANEL_BRAND.shopName },
            )}
          </p>
        </section>
        <section>
          <h3 className={styles.subTitle}>{t('Do guests see my changes right away?')}</h3>
          <p>{t('Your changes are saved as you type. Guests see them after you publish: when you see “Unpublished changes”, tap Review, then Publish changes.')}</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>{t('Can guests change their reply?')}</h3>
          <p>{t('Yes: they send the form again. You see both replies under Guests and can remove the old one.')}</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>{t('Will I get an email when someone replies?')}</h3>
          <p>{t('Not yet: new replies show under Guests (with a “New” mark) the next time you open your editor.')}</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>{t('Need help?')}</h3>
          <p>
            {t('Message {shop} on Etsy with your order number', { shop: PANEL_BRAND.shopName })}
            {isPlaceholder(email) ? t(', or email {email}', { email }) : (
              <>
                {t(', or email')} <a href={`mailto:${email}`}>{email}</a>
              </>
            )}
            .
          </p>
          <p>{t('Prefer us to do it? Send us your details on Etsy and we enter them for you, as a separate Etsy purchase.')}</p>
        </section>
      </div>
    </Sheet>
  );
}

export { publicSiteUrl };
