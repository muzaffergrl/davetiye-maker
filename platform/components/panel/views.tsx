'use client';
// Panel v2 views (G060, docs/16 §6; K29 simpler panel): Home (status, progress + next three tasks, replies, dates),
// Edit (the six pages), Guests (replies, guests.tsx), Share (link + QR; password and edit link folded), the help sheet.

import {
  Archive,
  ChevronRight,
  CircleCheckBig,
  Copy,
  ExternalLink,
  Heart,
  Hourglass,
  KeyRound,
  Link as LinkIcon,
  LockKeyhole,
  MessageCircleQuestionMark,
  Pencil,
  QrCode as QrIcon,
  Send,
  Share2,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
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
import { QrCode } from './QrCode.tsx';
import { GuestPasswordCard } from './GuestPassword.tsx';
import { Sheet } from './Sheet.tsx';
import { Badge, Banner, Button, Card, cx, Disclosure, ProgressBar } from './ui.tsx';
import styles from './panel.module.css';

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
    out.push({ key: `err-${s}`, tone: 'danger', path: list[0].path, text: `${SECTION_TITLES[s]}: ${list.length === 1 ? list[0].message : `${list.length} things to fix`}` });
  }
  for (const s of sampleSummaries(notes.sample)) {
    // "Venue: replace the sample venue name and city" — names the fields, so the buyer knows what to look for.
    out.push({ key: `sample-${s.section}`, tone: 'warning', path: s.path, text: `${SECTION_TITLES[s.section]}: replace the sample ${s.what}` });
  }
  if (notes.photos.length) {
    out.push({ key: 'photos', tone: 'info', path: notes.photos[0].path, text: `Add your photos (${notes.photos.length} still empty)` });
  }
  for (const n of [...notes.links, ...notes.empty]) out.push({ key: `note-${n.path}`, tone: 'info', path: n.path, text: n.message });
  if (meta.status === 'published' && content.rsvp?.method !== 'none' && !isThankYouOn(content, now)) {
    const closes = rsvpClosesAt(content.rsvp?.deadline, content.timezone);
    const days = closes ? Math.ceil((closes.getTime() - now.getTime()) / DAY) : null;
    if (days !== null && days > 0 && days <= 14) {
      out.push({ key: 'deadline', tone: 'info', path: 'rsvp.deadline', text: `Replies close in ${days} ${days === 1 ? 'day' : 'days'}` });
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
}) {
  const r = meta.rights;
  const live = meta.status === 'published';
  const filled = theme.photos.filter((s) => photoAt(content, s.source)).length;
  return (
    <div className={styles.stack}>
      <StatusCard meta={meta} url={url} setupStep={setupStep} onPublish={onPublish} onShare={onShare} onContinueSetup={onContinueSetup} onCopy={onCopy} />

      {/* G075: after the wedding (or turned on) the live website is a thank-you page. */}
      {thankYouOn ? (
        <Card title="Your website switched to thank-you mode" titleId="thank-you-card" icon={Heart} className={styles.thankYouCard} data-thank-you-card>
          <p className={styles.cardText}>
            Guests who open your link see your thank-you page{content.thank_you?.message ? ' and your note' : ''}. Replies are closed.
          </p>
          <Button variant="secondary" icon={Pencil} block onClick={() => onGo('#edit/thankyou')} data-edit-thank-you>
            Edit the thank-you page
          </Button>
        </Card>
      ) : null}

      {r.archiveSoon && r.archiveAt ? (
        <Banner tone="warning" icon={Hourglass}>
          Your website is online until {r.onlineUntil ? (formatDateLong(r.onlineUntil, content.locale) ?? r.onlineUntil) : 'its archive date'}. {ARCHIVE_TEXT} Download your
          replies before then if you want a copy on your phone.
        </Banner>
      ) : null}

      {/* K29: how ready the website is + only the next three tasks (each opens the right editor). */}
      {!r.archived ? (
        <section className={styles.progressCard} aria-labelledby="next-steps" data-next-steps data-readiness={readiness.percent}>
          <h2 id="next-steps" className={styles.cardTitle}>
            {readiness.percent >= 100 ? 'Your website is ready' : `Your website is ${readiness.percent}% ready`}
          </h2>
          <ProgressBar value={readiness.percent} label="How ready your website is" />
          {steps.length ? (
            <>
              <p className={styles.progressLead}>{steps.length === 1 ? 'Next:' : 'Next steps:'}</p>
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
              You&rsquo;re all set. {filled < theme.photos.length ? '' : 'Every photo place has a photo.'}
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
              {replies.newCount ? `${replies.newCount} new ${replies.newCount === 1 ? 'reply' : 'replies'}` : 'Replies'}
            </span>
            <span className={styles.cardButtonText}>
              {replies.data
                ? replies.data.counts.responses
                  ? `${replies.data.counts.totalGuests} coming · ${replies.data.counts.notAttending} not coming`
                  : 'No replies yet'
                : replies.error
                  ? 'Open to see your replies'
                  : 'Loading…'}
            </span>
          </span>
          <ChevronRight size={18} aria-hidden="true" className={styles.chev} />
        </button>
      ) : null}

      <Card title="Dates" titleId="dates-card">
        <dl className={styles.dates}>
          <div>
            <dt>Wedding</dt>
            <dd>{formatDateLong(content.date, content.locale) ?? '—'}</dd>
          </div>
          {content.rsvp?.method !== 'none' ? (
            <div>
              <dt>Replies close</dt>
              <dd>{formatDate(content.rsvp?.deadline, content.locale) ?? '—'}</dd>
            </div>
          ) : null}
          <div>
            <dt>{r.archived ? 'Archived' : 'Online until'}</dt>
            <dd>{r.onlineUntil ? formatDate(r.onlineUntil, content.locale) : '—'}</dd>
          </div>
        </dl>
      </Card>

      <Button variant="tertiary" icon={MessageCircleQuestionMark} onClick={() => onHelp()}>
        Help &amp; questions
      </Button>
    </div>
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
    badge = { tone: 'neutral', text: 'Archived', icon: Archive };
    text = 'Your website is closed for guests now. You can still see your content and download your replies.';
    action = null;
  } else if (meta.status === 'published') {
    badge = { tone: 'success', text: 'Live', icon: CircleCheckBig };
    text = meta.hasUnpublishedChanges ? 'Your website is live. Your newest changes are not published yet.' : 'Your website is live.';
    // The one action of a live website: share it (comp u2_home_390: the dark button).
    action = { label: 'Share', run: onShare, variant: 'primary', icon: Share2 };
  } else if (meta.publishedAt) {
    badge = { tone: 'neutral', text: 'Offline' };
    text = 'Your website is offline. Guests see “Page not found” until you publish again.';
    action = { label: 'Publish again', run: onPublish, variant: 'primary', icon: Send };
  } else if (meta.orderPending) {
    // G087: say it where the couple looks first, not only when Publish is tapped.
    badge = { tone: 'warning', text: 'Confirming your order', icon: Hourglass };
    text = 'Your website is a private draft. We are confirming your Etsy order — set everything up now; you can publish as soon as it is confirmed.';
    action = setupStep !== null ? { label: `Continue setup · Step ${setupStep} of 3`, run: onContinueSetup, variant: 'primary', icon: Sparkles } : null;
  } else {
    badge = { tone: 'accent', text: 'Draft' };
    text = 'Your website is a draft. Only you can see it.';
    action =
      setupStep !== null
        ? { label: `Continue setup · Step ${setupStep} of 3`, run: onContinueSetup, variant: 'primary', icon: Sparkles }
        : { label: 'Publish', run: onPublish, variant: 'primary', icon: Send };
  }
  return (
    <section className={styles.status} aria-labelledby="status-title" data-status-card>
      <div className={styles.statusTop}>
        <Badge tone={badge.tone} icon={badge.icon}>
          {badge.text}
        </Badge>
      </div>
      <h2 id="status-title" className={styles.statusText}>
        {text}
      </h2>
      {meta.status === 'published' && !r.archived ? (
        <div className={styles.statusLink}>
          <a href={url} target="_blank" rel="noopener noreferrer" data-public-link className={styles.url}>
            <UrlText url={url} />
          </a>
          <Button small variant="tertiary" icon={Copy} onClick={onCopy}>
            Copy
          </Button>
        </div>
      ) : null}
      {action ? (
        <Button variant={action.variant} icon={action.icon} block onClick={action.run} data-status-action>
          {action.label}
        </Button>
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
                <span className={styles.rowTitle}>{PAGE_TITLES[id]}</span>
                <span className={styles.rowSummary}>{summaries[id]}</span>
                {errors ? (
                  <span className={styles.rowBadges}>
                    <Badge tone="danger">{errors} to fix</Badge>
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
// Share (K29): the link and the QR code first; the guest password and the private edit link fold away below.

export function ShareView({
  url,
  slug,
  editKey,
  meta,
  orderRef,
  online,
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
  return (
    <div className={styles.stack}>
      <Card title="Your website link" titleId="share-link" icon={LinkIcon}>
        <p className={styles.urlField} data-share-url>
          <UrlText url={url} />
        </p>
        {!live && !archived ? <p className={styles.hint}>This address works once you publish your website.</p> : null}
        <div className={styles.buttonRow}>
          <Button variant={live ? 'primary' : 'secondary'} icon={Copy} onClick={() => onCopy(url, 'Link copied')}>
            Copy
          </Button>
          {live ? (
            <a className={cx(styles.btn, styles.btn_secondary)} href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>Open</span>
            </a>
          ) : null}
          {canShare && live ? (
            <Button icon={Share2} onClick={() => void navigator.share({ url }).catch(() => undefined)}>
              Share
            </Button>
          ) : null}
          {!live && !archived ? (
            <Button variant="primary" icon={Send} onClick={onPublish}>
              {meta.publishedAt ? 'Publish again' : 'Publish'}
            </Button>
          ) : null}
        </div>
        {live ? (
          <div className={styles.shareQr} data-share-qr>
            <h3 className={styles.shareQrTitle}>
              <QrIcon size={18} strokeWidth={1.75} aria-hidden="true" /> QR code for printed cards
            </h3>
            <QrCode url={url} fileBase={slug} />
            <p className={styles.hint}>Scan it once with your phone camera before you print it.</p>
          </div>
        ) : null}
      </Card>

      {!archived ? (
        <Disclosure id="password" title="Guest password" status={meta.guestAccess.enabled ? 'On' : 'Off'} icon={LockKeyhole}>
          <GuestPasswordCard access={meta.guestAccess} online={online} onSave={onGuestAccess} onCopy={onCopy} bare />
        </Disclosure>
      ) : null}

      <Disclosure id="edit-link" title="Your private edit link" icon={KeyRound}>
        <div className={styles.stack}>
          <p className={styles.cardText}>Anyone with this link can edit your website. Share it only with your partner.</p>
          <Button variant="primary" block icon={Copy} disabled={!editUrl} onClick={() => onCopy(editUrl, 'Edit link copied')} data-copy-edit-link>
            Copy edit link
          </Button>
          <p className={styles.hint}>Tip: add this page to your Home Screen to find your editor quickly.</p>
          {orderRef ? <p className={styles.hint}>Your Etsy order number: {orderRef}</p> : null}
        </div>
      </Disclosure>

      {live && !archived ? (
        <div className={styles.dangerZone}>
          <Button variant="dangerText" disabled={!online} onClick={onOffline}>
            Take the website offline
          </Button>
          {!online ? <p className={styles.hint}>Connect to the internet to change this.</p> : null}
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
    <Sheet title="Help" onClose={onClose} testId="help">
      <div className={styles.help}>
        <section data-autofocus={topic === 'changes' || undefined} tabIndex={-1}>
          <h3 className={styles.subTitle}>How do name and date changes work?</h3>
          <p>Until you publish, you can change everything freely. {changesRuleText(total)}</p>
          <p>{FREE_CHANGES_TEXT}</p>
          <p>{UNDO_TEXT}</p>
          <p>Everything else — time, venue, schedule, story, photos, details and replies — you can change as often as you like.</p>
          {r.phase !== 'before_publish' ? (
            <p>
              <strong>
                {r.remaining} of {total} changes left.
              </strong>
            </p>
          ) : null}
        </section>
        <section>
          <h3 className={styles.subTitle}>How long does my website stay online?</h3>
          <p>
            Until {ARCHIVE_AFTER_MONTHS} months after your wedding{until ? ` (${until})` : ''}. {ARCHIVE_TEXT}
          </p>
        </section>
        <section>
          <h3 className={styles.subTitle}>Can my partner edit too?</h3>
          <p>Yes: share your edit link with your partner (Share → Your private edit link → Copy). Anyone with that link can edit, so keep it private.</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>I lost my edit link</h3>
          <p>
            While this page is open, copy it again under Share → Your private edit link. If it is lost, message {PANEL_BRAND.shopName} on
            Etsy with your order number: we send you a new link and the old one stops working.
          </p>
        </section>
        <section>
          <h3 className={styles.subTitle}>Do guests see my changes right away?</h3>
          <p>Your changes are saved as you type. Guests see them after you publish: when you see “Unpublished changes”, tap Review, then Publish changes.</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>Can guests change their reply?</h3>
          <p>Yes: they send the form again. You see both replies under Guests and can remove the old one.</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>Will I get an email when someone replies?</h3>
          <p>Not yet: new replies show under Guests (with a “New” mark) the next time you open your editor.</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>Need help?</h3>
          <p>
            Message {PANEL_BRAND.shopName} on Etsy with your order number
            {isPlaceholder(email) ? `, or email ${email}` : (
              <>
                , or email <a href={`mailto:${email}`}>{email}</a>
              </>
            )}
            .
          </p>
        </section>
      </div>
    </Sheet>
  );
}

export { publicSiteUrl };
