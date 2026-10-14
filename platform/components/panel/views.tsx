'use client';
// Panel v2 views (G060, docs/16 §6): Home, Edit (section list), Guests (replies), Share, and the help sheet.

import {
  Archive,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleCheckBig,
  Copy,
  Download,
  ExternalLink,
  Hourglass,
  Image as ImageIcon,
  KeyRound,
  ListOrdered,
  Lock,
  Mail,
  MapPin,
  MessageCircleQuestionMark,
  QrCode as QrIcon,
  RefreshCw,
  Search,
  Send,
  Share2,
  Shirt,
  Sparkles,
  TriangleAlert,
  Users,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { formatDate, formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { isPlaceholder, PANEL_BRAND } from '../../lib/panel/brand.ts';
import {
  photoAt,
  publicSiteUrl,
  sampleSummaries,
  SECTION_GROUPS,
  SECTION_TITLES,
  sectionForPath,
  type PanelMeta,
  type PanelTheme,
  type PublishNote,
  type SectionId,
} from '../../lib/panel/model.ts';
import { ARCHIVE_AFTER_MONTHS, ARCHIVE_TEXT, beforePublishText, changesRuleText, FREE_CHANGES_TEXT, IDENTITY_CHANGE_LIMIT, UNDO_TEXT } from '../../lib/panel/rights.ts';
import { rsvpClosesAt } from '../../lib/rsvp/deadline.ts';
import type { PanelApi } from './api.ts';
import { StatusBadges } from './fields.tsx';
import { QrCode } from './QrCode.tsx';
import { zoneCity } from './sections.tsx';
import { Sheet } from './Sheet.tsx';
import { Badge, Banner, Button, Card, cx, EmptyState, OverflowMenu, RightsMeter, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';

export const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  names: Users,
  date: CalendarDays,
  venue: MapPin,
  schedule: ListOrdered,
  story: BookOpen,
  details: Shirt,
  faq: MessageCircleQuestionMark,
  rsvp: Mail,
  photos: ImageIcon,
};

const DAY = 86_400_000;

// ---------------------------------------------------------------------------------------------
// Replies (shared by Home and Guests)

export interface ReplyEntry {
  id: string;
  name: string;
  email: string | null;
  attending: boolean;
  guests: number;
  message: string | null;
  answers?: Array<{ id: string; question: string; answer: string }>;
  createdAt: string;
  held?: boolean;
}

export interface RepliesSummary {
  counts: { responses: number; attending: number; notAttending: number; totalGuests: number; held?: number };
  responses: ReplyEntry[];
}

const seenKey = (slug: string) => `seen:${slug}`;

export function useReplies(api: PanelApi, slug: string, active: boolean, published: boolean) {
  const [data, setData] = useState<RepliesSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(false);
  const [seen, setSeen] = useState<string | null>(null);
  useEffect(() => {
    try {
      setSeen(window.localStorage.getItem(seenKey(slug)));
    } catch {
      /* private mode */
    }
  }, [slug]);
  useEffect(() => {
    if (!active) return;
    let alive = true;
    setLoading(true);
    void api.replies().then((res) => {
      if (!alive) return;
      setLoading(false);
      if (res.ok) {
        setData(res.body as unknown as RepliesSummary);
        setError(null);
      } else setError(res.status === 0 ? 'No connection. Replies could not be loaded.' : (res.body.message ?? 'Replies could not be loaded.'));
    });
    return () => {
      alive = false;
    };
  }, [api, tick, active, published]);
  const newCount = data && seen ? data.responses.filter((r) => !r.held && r.createdAt > seen).length : 0;
  const markSeen = () => {
    const latest = data?.responses.find((r) => !r.held)?.createdAt;
    if (!latest) return;
    try {
      window.localStorage.setItem(seenKey(slug), latest);
    } catch {
      /* private mode */
    }
  };
  return { data, error, loading, refresh: () => setTick((n) => n + 1), setData, newCount, markSeen, seenAt: seen };
}
export type Replies = ReturnType<typeof useReplies>;

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
  if (meta.status === 'published' && content.rsvp?.method !== 'none') {
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
  setupStep,
  replies,
  onGo,
  onEditSection,
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
  steps: NextStep[];
  setupStep: number | null;
  replies: Replies;
  onGo: (path: string) => void;
  onEditSection: (id: SectionId) => void;
  onPublish: () => void;
  onShare: () => void;
  onContinueSetup: () => void;
  onHelp: (topic?: string) => void;
  onCopy: () => void;
}) {
  const r = meta.rights;
  const live = meta.status === 'published';
  const total = r.limit + r.granted;
  const filled = theme.photos.filter((s) => photoAt(content, s.source)).length;
  return (
    <div className={styles.stack}>
      <StatusCard meta={meta} url={url} setupStep={setupStep} onPublish={onPublish} onShare={onShare} onContinueSetup={onContinueSetup} onCopy={onCopy} />

      {r.archiveSoon && r.archiveAt ? (
        <Banner tone="warning" icon={Hourglass}>
          Your website is online until {r.onlineUntil ? (formatDateLong(r.onlineUntil, content.locale) ?? r.onlineUntil) : 'its archive date'}. {ARCHIVE_TEXT} Download your
          replies before then if you want a copy on your phone.
        </Banner>
      ) : null}

      {!r.archived ? (
        <Card title="Next steps" titleId="next-steps" data-next-steps>
          {steps.length ? (
            <ul className={styles.checklist}>
              {steps.map((s) => (
                <li key={s.key}>
                  <button type="button" className={cx(styles.checkItem, styles[`check_${s.tone}`])} onClick={() => onGo(s.path)}>
                    <span className={styles.checkDot} aria-hidden="true" />
                    <span className={styles.checkText}>{s.text}</span>
                    <ChevronRight size={18} aria-hidden="true" className={styles.chev} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.allSet}>
              <CircleCheckBig size={20} strokeWidth={1.75} aria-hidden="true" />
              You&rsquo;re all set. {filled < theme.photos.length ? '' : 'Every photo place has a photo.'}
            </p>
          )}
        </Card>
      ) : null}

      {live || r.phase !== 'before_publish' ? (
        <button type="button" className={styles.cardButton} onClick={() => onGo('#guests')} data-replies-summary>
          <span className={styles.cardButtonIcon} aria-hidden="true">
            <Users size={22} strokeWidth={1.75} />
          </span>
          <span className={styles.cardButtonBody}>
            <span className={styles.cardButtonTitle}>Replies</span>
            <span className={styles.cardButtonText}>
              {replies.data
                ? `${replies.data.counts.totalGuests} coming · ${replies.data.counts.notAttending} not coming${replies.newCount ? ` · ${replies.newCount} new` : ''}`
                : replies.error
                  ? 'Open to see your replies'
                  : 'Loading…'}
            </span>
          </span>
          <ChevronRight size={18} aria-hidden="true" className={styles.chev} />
        </button>
      ) : null}

      <Card
        title="Names & date"
        titleId="rights-card"
        data-rights-card
        action={
          r.archived ? undefined : (
            <Button small variant="tertiary" onClick={() => onHelp('changes')}>
              How changes work
            </Button>
          )
        }
      >
        {r.archived ? (
          <p className={styles.cardText}>Your website is archived: names and date can no longer be changed.</p>
        ) : r.phase === 'before_publish' ? (
          <p className={styles.cardText}>{beforePublishText(IDENTITY_CHANGE_LIMIT)}</p>
        ) : (
          <div className={styles.rightsRow}>
            <Lock size={18} strokeWidth={1.75} aria-hidden="true" />
            <RightsMeter remaining={r.remaining} total={total} />
            {!r.archived ? (
              <Button small variant="secondary" onClick={() => onEditSection('names')}>
                Change
              </Button>
            ) : null}
          </div>
        )}
      </Card>

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
  } else if (meta.status === 'published' && meta.hasUnpublishedChanges) {
    badge = { tone: 'warning', text: 'Unpublished changes' };
    text = 'Your website is live. You have changes your guests can’t see yet.';
    action = { label: 'Publish changes', run: onPublish, variant: 'primary', icon: Send };
  } else if (meta.status === 'published') {
    badge = { tone: 'success', text: 'Live', icon: CircleCheckBig };
    text = 'Your website is live and up to date.';
    action = { label: 'Share', run: onShare, variant: 'secondary', icon: Share2 };
  } else if (meta.publishedAt) {
    badge = { tone: 'neutral', text: 'Offline' };
    text = 'Your website is offline. Guests see “Page not found” until you publish again.';
    action = { label: 'Publish again', run: onPublish, variant: 'primary', icon: Send };
  } else {
    badge = { tone: 'accent', text: 'Draft' };
    text = 'Your website is a draft. Only you can see it.';
    action =
      setupStep !== null
        ? { label: `Continue setup · Step ${setupStep} of 6`, run: onContinueSetup, variant: 'primary', icon: Sparkles }
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
// Edit: grouped section list

export function EditListView({
  sections,
  summaries,
  errorCount,
  sampleCount,
  offSections,
  meta,
  onOpen,
}: {
  sections: SectionId[];
  summaries: Record<SectionId, string>;
  errorCount: (id: SectionId) => number;
  sampleCount: (id: SectionId) => number;
  offSections: Set<SectionId>;
  meta: PanelMeta;
  onOpen: (id: SectionId) => void;
}) {
  const r = meta.rights;
  return (
    <div className={styles.stack}>
      {SECTION_GROUPS.map((g) => {
        const ids = g.ids.filter((id) => sections.includes(id));
        if (!ids.length) return null;
        return (
          <section key={g.title} aria-labelledby={`group-${g.title}`}>
            <h2 id={`group-${g.title}`} className={styles.groupLabel}>
              {g.title}
            </h2>
            <ul className={styles.list}>
              {ids.map((id) => {
                const Icon = SECTION_ICONS[id];
                // One budget for names and date: shown once, on Names, in words that say so (G060-fix).
                const identity = id === 'names' && r.phase !== 'before_publish';
                return (
                  <li key={id}>
                    <a href={`#edit/${id}`} id={`section-${id}`} className={styles.row} onClick={(e) => (e.preventDefault(), onOpen(id))} data-section-row={id}>
                      <span className={styles.rowIcon} aria-hidden="true">
                        <Icon size={20} strokeWidth={1.75} />
                      </span>
                      <span className={styles.rowBody}>
                        <span className={styles.rowTitle}>{SECTION_TITLES[id]}</span>
                        <span className={styles.rowSummary}>{summaries[id]}</span>
                        <span className={styles.rowBadges}>
                          <StatusBadges errors={errorCount(id)} samples={sampleCount(id)} off={offSections.has(id)} />
                          {identity ? (
                            <Badge tone={r.remaining ? 'neutral' : 'warning'} icon={Lock}>
                              {r.remaining} name &amp; date {r.remaining === 1 ? 'change' : 'changes'} left
                            </Badge>
                          ) : null}
                        </span>
                      </span>
                      <ChevronRight size={20} aria-hidden="true" className={styles.chev} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Guests

type Filter = 'all' | 'coming' | 'not' | 'held';

export function GuestsView({
  api,
  replies,
  content,
  meta,
  online,
  onPublish,
  onShare,
  onSettings,
}: {
  api: PanelApi;
  replies: Replies;
  content: ContentRecord;
  meta: PanelMeta;
  online: boolean;
  onPublish: () => void;
  onShare: () => void;
  onSettings: () => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<ReplyEntry | null>(null);
  const [working, setWorking] = useState(false);
  const snack = useSnackbar();
  const { data, error } = replies;
  const archived = meta.rights.archived;
  useEffect(() => {
    if (data) replies.markSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const act = async (action: 'remove' | 'keep', ids: string[]) => {
    setWorking(true);
    const res = await api.manageReplies(action, ids);
    setWorking(false);
    setConfirm(null);
    if (res.ok) {
      replies.setData(res.body as unknown as RepliesSummary);
      snack(action === 'remove' ? (ids.length === 1 ? 'Reply removed' : 'Replies removed') : 'Reply kept');
    } else snack(res.body.message ?? 'The replies could not be changed. Please try again.');
  };

  const deadline = formatDateLong(content.rsvp?.deadline, content.locale);
  const neverPublished = meta.status !== 'published' && !meta.publishedAt;

  const list = useMemo(() => {
    const all = data?.responses ?? [];
    const q = query.trim().toLowerCase();
    return all.filter((r) => {
      if (filter === 'held' ? !r.held : r.held) return false;
      if (filter === 'coming' && !r.attending) return false;
      if (filter === 'not' && r.attending) return false;
      if (q && !r.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, filter, query]);

  if (neverPublished && !(data?.responses.length)) {
    return (
      <EmptyState icon={Users} action={<Button variant="primary" icon={Send} onClick={onPublish}>Publish</Button>}>
        Replies appear here after you publish your website.
      </EmptyState>
    );
  }
  if (error && !data) {
    return (
      <Banner tone="warning" icon={online ? TriangleAlert : WifiOff} actions={<Button small icon={RefreshCw} onClick={replies.refresh}>Try again</Button>}>
        {error}
      </Banner>
    );
  }
  if (!data) {
    return (
      <div className={styles.stack} aria-busy="true">
        <div className={styles.skeletonRow} />
        <div className={styles.skeletonRow} />
        <div className={styles.skeletonRow} />
      </div>
    );
  }
  const { counts } = data;
  const held = data.responses.filter((r) => r.held).length;
  const chips: Array<{ id: Filter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'coming', label: 'Coming' },
    { id: 'not', label: 'Not coming' },
    ...(held ? [{ id: 'held' as Filter, label: `Held for review (${held})` }] : []),
  ];
  return (
    <div className={styles.stack} data-replies>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{counts.totalGuests}</span>
          <span className={styles.statLabel}>Guests coming</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{counts.notAttending}</span>
          <span className={styles.statLabel}>Not coming</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{counts.responses}</span>
          <span className={styles.statLabel}>Replies</span>
        </div>
      </div>
      {content.rsvp?.method === 'none' ? (
        <p className={styles.hint}>Replies on the website are off.</p>
      ) : deadline ? (
        <p className={styles.hint}>
          Replies close at the end of {deadline} ({zoneCity(content.timezone)} time).
        </p>
      ) : null}
      {held ? (
        <Banner tone="warning" data-held-replies>
          {held} {held === 1 ? 'reply' : 'replies'} arrived during an unusual number of replies in a short time, so {held === 1 ? 'it is' : 'they are'} held
          and not counted. Keep the real ones and remove the rest.
        </Banner>
      ) : null}

      <div className={styles.chips} role="group" aria-label="Show">
        {chips.map((c) => (
          <button key={c.id} type="button" className={cx(styles.chip, filter === c.id && styles.chipOn)} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      {data.responses.length >= 8 ? (
        <div className={styles.search}>
          <Search size={18} aria-hidden="true" />
          <label className={styles.visuallyHidden} htmlFor="reply-search">
            Search replies by name
          </label>
          <input id="reply-search" type="search" className={styles.searchInput} placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      ) : null}

      {!data.responses.length ? (
        <EmptyState icon={Users} action={<Button variant="primary" icon={Share2} onClick={onShare}>Share</Button>}>
          No replies yet. Share your website so guests can reply.
        </EmptyState>
      ) : !list.length ? (
        <EmptyState icon={Search} action={query ? <Button onClick={() => setQuery('')}>Clear search</Button> : undefined}>
          {query ? `No replies match “${query}”.` : 'No replies here.'}
        </EmptyState>
      ) : (
        <ul className={styles.replyList}>
          {list.map((r) => {
            const open = openIds.has(r.id);
            return (
              <li key={r.id} className={styles.reply} data-reply>
                <div className={styles.replyHead}>
                  <button type="button" className={styles.replyToggle} aria-expanded={open} onClick={() => setOpenIds((cur) => {
                        const next = new Set(cur);
                        if (open) next.delete(r.id);
                        else next.add(r.id);
                        return next;
                      })}>
                    <span className={styles.replyName}>{r.name}</span>
                    <span className={styles.replyMeta}>
                      {r.attending ? <Badge tone="success">{`Coming · ${r.guests} ${r.guests === 1 ? 'guest' : 'guests'}`}</Badge> : <Badge>Not coming</Badge>}
                      <span className={styles.replyTime}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </span>
                  </button>
                  {!archived ? (
                    <OverflowMenu
                      label={`Options for the reply from ${r.name}`}
                      items={[
                        ...(r.held ? [{ label: 'Keep this reply', onSelect: () => void act('keep', [r.id]) }] : []),
                        { label: 'Remove reply', danger: true, onSelect: () => setConfirm(r) },
                      ]}
                    />
                  ) : null}
                </div>
                {open ? (
                  <div className={styles.replyBody}>
                    {r.email ? (
                      <p>
                        <span className={styles.replyKey}>Email</span> {r.email}
                      </p>
                    ) : null}
                    {(r.answers ?? []).map((a) => (
                      <p key={a.id} data-reply-answer>
                        <span className={styles.replyKey}>{a.question}</span> {a.answer}
                      </p>
                    ))}
                    {r.message ? <p className={styles.replyMessage}>“{r.message}”</p> : null}
                    {!r.email && !r.message && !(r.answers ?? []).length ? <p className={styles.hint}>No message.</p> : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.buttonRow}>
        {counts.responses ? (
          <a className={cx(styles.btn, styles.btn_secondary)} href={api.repliesCsvUrl()} download rel="noreferrer" data-csv>
            <Download size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>Download all replies (CSV)</span>
          </a>
        ) : null}
        <Button icon={RefreshCw} onClick={replies.refresh} busy={replies.loading} busyLabel="Refreshing…" data-refresh-replies>
          Refresh
        </Button>
        {!archived ? (
          <Button variant="tertiary" onClick={onSettings}>
            Reply settings
          </Button>
        ) : null}
      </div>

      {confirm ? (
        <Sheet title="Remove this reply?" onClose={() => setConfirm(null)} closeLabel="Cancel" testId="remove-reply">
          <p>
            The reply from <strong>{confirm.name}</strong> is deleted for good. It is not in the CSV afterwards.
          </p>
          <div className={styles.buttonRow}>
            <Button variant="danger" busy={working} busyLabel="Removing…" onClick={() => void act('remove', [confirm.id])} data-confirm-remove-reply>
              Remove reply
            </Button>
            <Button onClick={() => setConfirm(null)}>Keep it</Button>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Share

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
      <Card title="Your website link" titleId="share-link">
        <p className={styles.bigUrl} data-share-url>
          <UrlText url={url} />
        </p>
        {!live && !archived ? <p className={styles.hint}>This address works once you publish your website.</p> : null}
        <div className={styles.buttonRow}>
          <Button icon={Copy} onClick={() => onCopy(url, 'Link copied')}>
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
      </Card>

      {live ? (
        <Card title="QR code" titleId="share-qr">
          <QrCode url={url} fileBase={slug} />
          <p className={styles.hint}>Scan it once with your phone camera before you print it.</p>
        </Card>
      ) : null}

      <Card title="Your edit link" titleId="share-edit">
        <p className={styles.cardText}>
          <KeyRound size={18} strokeWidth={1.75} aria-hidden="true" className={styles.inlineIcon} />
          Anyone with this link can edit your website. Share it only with your partner.
        </p>
        <div className={styles.buttonRow}>
          <Button icon={Copy} disabled={!editUrl} onClick={() => onCopy(editUrl, 'Edit link copied')}>
            Copy edit link
          </Button>
        </div>
        <p className={styles.hint}>Tip: add this page to your Home Screen to find your editor quickly.</p>
        {orderRef ? <p className={styles.hint}>Your Etsy order number: {orderRef}</p> : null}
      </Card>

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
          <p>Yes: share your edit link with your partner (Share → Your edit link). Anyone with that link can edit, so keep it private.</p>
        </section>
        <section>
          <h3 className={styles.subTitle}>Do guests see my changes right away?</h3>
          <p>Your changes are saved as you type. Guests see them after you tap “Publish changes”.</p>
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
