'use client';
// Guests (G060 -> G069 -> G100, docs/16 §6.4, docs/18 §4): the couple's replies, organised.
//
//   G100 (Hitchd / Luma): two views. "Guest list" = numbers · search + status tabs (All · Coming · Not coming · New) ·
//   the replies (on a 390 × 844 phone the first one is on the first screen). "Results" (#guests/results, Typeform) =
//   coming / not coming and the answers to the couple's questions as count + percent, the food notes; a tap on a line
//   opens the list filtered to it. Below, the G069 parts as they were:
//
//   numbers (people coming · not coming · replies) and the days left to reply · "N new replies" + Mark as seen ·
//   the answers to the couple's questions (counts with bars; yes/no as percentages; tap an answer to see who chose
//   it) · food and allergy notes in one list · the replies (sort, filter, search; a card per reply with the names of
//   everyone in it, "New", "Added by you", "Edited by you") · Add a reply / correct a reply · CSV (one row per person)
//   and a printable guest list (#guests/print).
//
// The overview is computed on the server (lib/rsvp/insights.ts, sent with the replies). "New" = arrived since the
// last look on this device (localStorage `seen:<slug>`; docs/16 §6.2): never looked = all new; the couple's own
// replies are never new. No e-mail notification: there is no e-mail provider (nothing is shown for it).
// Archived site (G060): read only — list, CSV and print stay. G066: BKE Studio look through panel.module.css only.

import {
  BellDot,
  CalendarClock,
  ChartBar,
  Download,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Send,
  Share2,
  Trash2,
  TriangleAlert,
  User,
  Users,
  UserX,
  Utensils,
  WifiOff,
  X,
} from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord, RsvpQuestion } from '../../lib/content/types.ts';
import type { PanelMeta } from '../../lib/panel/model.ts';
import { deadlineText, replyPeople, type QuestionInsight, type RsvpInsights } from '../../lib/rsvp/insights.ts';
import type { PanelApi } from './api.ts';
import { zoneCity } from './zone.ts';
import { Sheet } from './Sheet.tsx';
import { Badge, Banner, Button, Card, cx, EmptyState, OverflowMenu, Segmented, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';
import { SheetsCard } from './SheetsCard.tsx';
import { ReplyNoticeCard } from './ReplyNoticeCard.tsx';
import { msg, t, tn, uiLang } from '../../lib/i18n/client.ts';
import { LANG_TAGS } from '../../lib/i18n/langs.ts';
import type { Replies, ReplyEntry, RepliesSummary } from './replies.ts';

// ---------------------------------------------------------------------------------------------
// Data (shared by Home and Guests)

export { useReplies, type Replies, type RepliesSummary, type ReplyEntry } from './replies.ts';

// ---------------------------------------------------------------------------------------------
// Small helpers

const norm = (s: string) => s.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();
const replyCount = (n: number) => tn(n, '1 reply', '{n} replies');
const peopleCount = (n: number) => tn(n, '1 person', '{n} people');
const guestCount = (n: number) => tn(n, '1 guest', '{n} guests');
/** BCP 47 tag of the panel language, for dates. */
const dateTag = () => LANG_TAGS[uiLang()];

/** "Jordan, Sam and Lee". */
function joinNames(names: readonly string[]): string {
  if (names.length < 2) return names.join('');
  return t('{a} and {b}', { a: names.slice(0, -1).join(', '), b: names[names.length - 1] });
}

/** "With Jordan Stone + 1 more" — the people with the guest who replied (named first). */
export function partyLine(r: ReplyEntry): string | null {
  if (!r.attending || r.guests < 2) return null;
  const people = replyPeople(r).slice(1);
  const named = people.filter((p) => p.named).map((p) => p.name);
  const unnamed = people.length - named.length;
  if (!named.length) return tn(unnamed, '+ 1 guest, no names given', '+ {n} guests, no names given');
  return unnamed ? t('With {names} + {n} more', { names: joinNames(named), n: unnamed }) : t('With {names}', { names: joinNames(named) });
}

const DATE_TIME: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
const when = (iso: string) => new Date(iso).toLocaleString(dateTag(), DATE_TIME);

type Filter = 'all' | 'coming' | 'not' | 'new' | 'held';
type Sort = 'newest' | 'oldest' | 'name' | 'coming';
const SORTS: Array<{ value: Sort; label: string }> = [
  { value: 'newest', label: msg('Newest first') },
  { value: 'oldest', label: msg('Oldest first') },
  { value: 'name', label: msg('Name (A–Z)') },
  { value: 'coming', label: msg('Coming first') },
];

function sortReplies(list: ReplyEntry[], sort: Sort): ReplyEntry[] {
  const byNew = (a: ReplyEntry, b: ReplyEntry) => b.createdAt.localeCompare(a.createdAt);
  const out = [...list];
  if (sort === 'oldest') out.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  else if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || byNew(a, b));
  else if (sort === 'coming') out.sort((a, b) => Number(b.attending) - Number(a.attending) || byNew(a, b));
  else out.sort(byNew);
  return out;
}

interface AnswerFilter {
  id: string;
  label: string;
  value: string;
}

// ---------------------------------------------------------------------------------------------
// Guests view

export function GuestsView({
  api,
  replies,
  content,
  meta,
  online,
  onPublish,
  onShare,
  onSettings,
  onPrint,
  tab = 'list',
  onTab = () => undefined,
}: {
  api: PanelApi;
  replies: Replies;
  content: ContentRecord;
  meta: PanelMeta;
  online: boolean;
  onPublish: () => void;
  onShare: () => void;
  onSettings: () => void;
  onPrint: () => void;
  /** G100: the list (numbers, search, status tabs, replies) or the separate Results view (#guests/results). */
  tab?: 'list' | 'results';
  onTab?: (tab: 'list' | 'results') => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<AnswerFilter | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<ReplyEntry | null>(null);
  const [sheet, setSheet] = useState<{ reply: ReplyEntry | null } | null>(null);
  const [working, setWorking] = useState(false);
  const listRef = useRef<HTMLHeadingElement>(null);
  const snack = useSnackbar();
  const { data, error } = replies;
  const archived = meta.rights.archived;

  const act = async (action: 'remove' | 'keep', ids: string[]) => {
    setWorking(true);
    const res = await api.manageReplies(action, ids);
    setWorking(false);
    setConfirm(null);
    if (res.ok) {
      replies.setData(res.body as unknown as RepliesSummary);
      snack(action === 'remove' ? (ids.length === 1 ? t('Reply removed') : t('Replies removed')) : t('Reply kept'));
    } else snack(res.body.message ? t(res.body.message) : t('The replies could not be changed. Please try again.'));
  };

  const neverPublished = meta.status !== 'published' && !meta.publishedAt;

  const list = useMemo(() => {
    const all = data?.responses ?? [];
    const q = query.trim().toLowerCase();
    const rows = all.filter((r) => {
      if (filter === 'held' ? !r.held : r.held) return false;
      if (filter === 'coming' && !r.attending) return false;
      if (filter === 'not' && r.attending) return false;
      if (filter === 'new' && !replies.isNew(r)) return false;
      if (answer && !(r.answers ?? []).some((a) => a.id === answer.id && norm(a.answer) === norm(answer.value))) return false;
      if (q && ![r.name, ...(r.party ?? []), r.email ?? ''].some((s) => s.toLowerCase().includes(q))) return false;
      return true;
    });
    return sortReplies(rows, sort);
    // replies.isNew changes with the "seen" mark
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filter, sort, query, answer, replies.seenAt]);

  if (neverPublished && !data?.responses.length) {
    return (
      <EmptyState icon={Users} action={<Button variant="primary" icon={Send} onClick={onPublish}>{t('Publish')}</Button>}>
        {t('Replies appear here after you publish your website.')}
      </EmptyState>
    );
  }
  if (error && !data) {
    return (
      <Banner tone="warning" icon={online ? TriangleAlert : WifiOff} actions={<Button small icon={RefreshCw} onClick={replies.refresh}>{t('Try again')}</Button>}>
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
  const insights = data.insights;
  const held = data.responses.filter((r) => r.held).length;
  const newCount = replies.newCount;
  // G100 (docs/18 §4, Luma / Hitchd): the status tabs, always in the same places; "Held for review" only when there is one.
  const chips: Array<{ id: Filter; label: string; count?: number }> = [
    { id: 'all', label: t('All') },
    { id: 'coming', label: t('Coming') },
    { id: 'not', label: t('Not coming') },
    { id: 'new', label: t('New'), count: newCount },
    ...(held ? [{ id: 'held' as Filter, label: t('Held'), count: held }] : []),
  ];
  const questions = (insights?.questions ?? []).filter((q) => q.current || q.answered);
  const hasDietQuestion = (insights?.questions ?? []).some((q) => q.current && q.dietary);

  /** From Results: the list of the replies that chose this answer. */
  const pickAnswer = (q: QuestionInsight, value: string) => {
    const same = answer?.id === q.id && answer.value === value;
    setAnswer(same ? null : { id: q.id, label: q.label, value });
    if (!same) {
      setFilter((f) => (f === 'held' || f === 'not' ? 'all' : f));
      setQuery('');
      onTab('list');
    }
  };
  /** From Results: coming / not coming. */
  const pickStatus = (f: Filter) => {
    setAnswer(null);
    setQuery('');
    setFilter(f);
    onTab('list');
  };

  const toggle = (id: string, open: boolean) =>
    setOpenIds((cur) => {
      const next = new Set(cur);
      if (open) next.delete(id);
      else next.add(id);
      return next;
    });

  const viewTabs = (
    <nav className={styles.viewTabs} aria-label={t('Guests')}>
      {(
        [
          ['list', msg('Guest list'), '#guests'],
          ['results', msg('Results'), '#guests/results'],
        ] as const
      ).map(([id, label, href]) => (
        <a
          key={id}
          href={href}
          className={cx(styles.viewTab, tab === id && styles.viewTabOn)}
          aria-current={tab === id ? 'page' : undefined}
          onClick={(e) => {
            e.preventDefault();
            if (tab !== id) onTab(id);
          }}
          data-guests-tab={id}
        >
          {t(label)}
        </a>
      ))}
    </nav>
  );

  // ------------------------------------------------------------------------------------------- Results
  if (tab === 'results') {
    const pct = (n: number) => (counts.responses ? Math.round((100 * n) / counts.responses) : 0);
    return (
      <div className={styles.stack} data-results>
        {viewTabs}
        <DeadlineLine insights={insights} content={content} canAdd={!archived} />
        {!counts.responses ? (
          <EmptyState icon={ChartBar} action={<Button variant="primary" icon={Share2} onClick={onShare}>{t('Share')}</Button>}>
            {t('No replies yet. The results of your reply form show here as guests answer.')}
          </EmptyState>
        ) : (
          <>
            <p className={styles.hint}>{t('Tap a line to see who is in it.')}</p>
            <Card title={t('Coming?')} titleId="results-attending" data-results-attending>
              <ul className={styles.bars} aria-labelledby="results-attending">
                {(
                  [
                    ['coming', msg('Coming'), counts.attending],
                    ['not', msg('Not coming'), counts.notAttending],
                  ] as const
                ).map(([f, label, n]) => (
                  <li key={f}>
                    <button type="button" className={styles.barRow} onClick={() => pickStatus(f)} data-results-status={f}>
                      <span className={styles.barLabel}>{t(label)}</span>
                      <span className={styles.bar} aria-hidden="true">
                        <span className={styles.barFill} style={{ width: `${pct(n)}%` }} />
                      </span>
                      <span className={styles.barValue}>
                        {n} · {pct(n)}%<span className={styles.visuallyHidden}> {tn(n, 'reply', 'replies')}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className={cx(styles.hint, styles.cardFootHint)}>
                {replyCount(counts.responses)} · {tn(counts.totalGuests, '1 person coming in all', '{n} people coming in all')}
              </p>
            </Card>
            {questions.length ? (
              <>
                <h2 className={styles.sectionHeading}>{t('Your questions')}</h2>
                <p className={styles.hint}>{t('From guests who are coming; one answer per reply.')}</p>
                {questions.map((q) => (
                  <QuestionCard key={q.id} q={q} active={answer?.id === q.id ? answer.value : null} onPick={pickAnswer} />
                ))}
              </>
            ) : (
              <p className={styles.hint} data-no-questions>
                {t('Your reply form has no questions of your own yet (for example a meal choice).')}
                {archived ? null : (
                  <>
                    {' '}
                    <button type="button" className={styles.inlineLink} onClick={onSettings}>
                      {t('Add one in Reply settings')}
                    </button>
                    .
                  </>
                )}
              </p>
            )}
            <DietaryCard insights={insights} hasQuestion={hasDietQuestion} archived={archived} onSettings={onSettings} />
          </>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------------------------------------- the list
  return (
    <div className={styles.stack} data-replies>
      {viewTabs}
      {/* G100 (docs/18 §4): numbers → search + status tabs → the list; the answers live under Results. */}
      <div className={styles.stats}>
        <div className={styles.stat} data-stat="coming">
          <span className={styles.statNum}>{counts.totalGuests}</span>
          <span className={styles.statLabel}>{t('Guests coming')}</span>
        </div>
        <div className={styles.stat} data-stat="not">
          <span className={styles.statNum}>{counts.notAttending}</span>
          <span className={styles.statLabel}>{t('Not coming')}</span>
        </div>
        <div className={styles.stat} data-stat="replies">
          <span className={styles.statNum}>{counts.responses}</span>
          <span className={styles.statLabel}>{t('Replies')}</span>
        </div>
      </div>

      {held ? (
        <Banner tone="warning" data-held-replies>
          {tn(
            held,
            '1 reply arrived during an unusual number of replies in a short time, so it is held and not counted. Keep the real ones and remove the rest.',
            '{n} replies arrived during an unusual number of replies in a short time, so they are held and not counted. Keep the real ones and remove the rest.',
          )}
        </Banner>
      ) : null}

      <section className={styles.listBlock} aria-labelledby="replies-title">
        <h2 id="replies-title" ref={listRef} tabIndex={-1} className={styles.visuallyHidden}>
          {t('Replies')}
        </h2>
        {data.responses.length ? (
          <>
            <div className={styles.search}>
              <Search size={18} aria-hidden="true" />
              <label className={styles.visuallyHidden} htmlFor="reply-search">
                {t('Search replies by name')}
              </label>
              <input id="reply-search" type="search" className={styles.searchInput} placeholder={t('Search by name')} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className={cx(styles.chips, styles.statusTabs)} role="group" aria-label={t('Show')}>
              {chips.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={cx(styles.chip, filter === c.id && styles.chipOn)}
                  aria-pressed={filter === c.id}
                  aria-label={c.count ? t('{label} ({n})', { label: c.label, n: c.count }) : undefined}
                  onClick={() => setFilter(c.id)}
                  data-filter={c.id}
                >
                  {c.label}
                  {c.count ? (
                    <span className={styles.chipCount} aria-hidden="true">
                      {c.count}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            {newCount && filter === 'new' ? (
              <p className={styles.newLine} data-new-banner>
                <BellDot size={18} strokeWidth={1.75} aria-hidden="true" />
                <span>
                  <strong>{tn(newCount, '1 new reply', '{n} new replies')}</strong> {t('since you last looked')}
                </span>
                <button type="button" className={styles.newLineButton} onClick={replies.markSeen} data-mark-seen>
                  {t('Mark as seen')}
                </button>
              </p>
            ) : null}
            {answer ? (
              <div className={styles.activeFilter} data-answer-filter>
                <span>
                  {answer.label}: <strong>{answer.value}</strong>
                </span>
                <Button small variant="tertiary" icon={X} onClick={() => setAnswer(null)} aria-label={t('Clear the filter {question}: {answer}', { question: answer.label, answer: answer.value })}>
                  {t('Clear')}
                </Button>
              </div>
            ) : null}
            <div className={styles.listHead}>
              <p className={styles.listCount} aria-live="polite">
                {list.length === data.responses.length
                  ? replyCount(data.responses.length)
                  : tn(data.responses.length, '{shown} of 1 reply', '{shown} of {n} replies', { shown: list.length })}
              </p>
              <label htmlFor="reply-sort" className={styles.visuallyHidden}>
                {t('Sort')}
              </label>
              <select id="reply-sort" className={cx(styles.select, styles.sortSelect)} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t(s.label)}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        {!data.responses.length ? (
          <EmptyState icon={Users} action={<Button variant="primary" icon={Share2} onClick={onShare}>{t('Share')}</Button>}>
            {t('No replies yet. Share your website so guests can reply. New replies show here; we don’t send email notifications yet.')}
          </EmptyState>
        ) : !list.length ? (
          <EmptyState
            icon={Search}
            action={
              query ? (
                <Button onClick={() => setQuery('')}>{t('Clear search')}</Button>
              ) : answer ? (
                <Button onClick={() => setAnswer(null)}>{t('Show all replies')}</Button>
              ) : filter !== 'all' ? (
                <Button onClick={() => setFilter('all')}>{t('Show all replies')}</Button>
              ) : undefined
            }
          >
            {query
              ? t('No replies match “{query}”.', { query })
              : answer
                ? t('No replies chose “{answer}” here.', { answer: answer.value })
                : filter === 'new'
                  ? t('No new replies since you last looked.')
                  : t('No replies here.')}
          </EmptyState>
        ) : (
          <ul className={styles.replyList}>
            {list.map((r) => (
              <ReplyCard
                key={r.id}
                r={r}
                open={openIds.has(r.id)}
                isNew={replies.isNew(r)}
                archived={archived}
                onToggle={() => toggle(r.id, openIds.has(r.id))}
                onEdit={() => setSheet({ reply: r })}
                onKeep={() => void act('keep', [r.id])}
                onRemove={() => setConfirm(r)}
              />
            ))}
          </ul>
        )}
      </section>

      <div className={styles.buttonRow}>
        <Button icon={RefreshCw} onClick={replies.refresh} busy={replies.loading} busyLabel={t('Refreshing…')} data-refresh-replies>
          {t('Refresh')}
        </Button>
        {counts.responses ? (
          <Button variant="tertiary" icon={Printer} onClick={onPrint} data-print-list>
            {t('Print list')}
          </Button>
        ) : null}
        {counts.responses ? (
          <a className={cx(styles.btn, styles.btn_tertiary)} href={api.repliesCsvUrl()} download rel="noreferrer" data-csv>
            <span>{t('Download CSV')}</span>
            <span className={styles.visuallyHidden}> {t('(one row per guest)')}</span>
          </a>
        ) : null}
        {!archived ? (
          <Button variant="tertiary" onClick={onSettings}>
            {t('Reply settings')}
          </Button>
        ) : null}
      </div>

      {/* G128: a live copy of the replies in the couple's Google Drive */}
      <SheetsCard api={api} online={online} archived={archived} />

      {/* G152: "Email me when a guest replies" (only while the platform can send email) */}
      <ReplyNoticeCard api={api} online={online} archived={archived} />

      {/* Always in reach while scrolling the list (comp u2_guests_390): add a phone reply, download the list. */}
      {!archived || counts.responses ? (
        <div className={styles.guestBar} data-guest-actions>
          {!archived ? (
            <Button variant="primary" icon={Plus} disabled={!online} onClick={() => setSheet({ reply: null })} data-add-reply>
              {t('Add a reply')}
            </Button>
          ) : null}
          {counts.responses ? (
            <a className={cx(styles.btn, styles.btn_secondary)} href={api.repliesExcelUrl()} download rel="noreferrer" data-excel>
              <Download size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>{t('Download Excel')}</span>
              <span className={styles.visuallyHidden}> {t('(replies and a summary; opens in Excel, Numbers or Google Sheets)')}</span>
            </a>
          ) : null}
          {!archived && !online ? <p className={styles.guestBarNote}>{t('Connect to the internet to add or change replies.')}</p> : null}
        </div>
      ) : null}

      {confirm ? (
        <Sheet title={t('Remove this reply?')} onClose={() => setConfirm(null)} closeLabel={t('Cancel')} testId="remove-reply">
          <p>
            {t('The reply from')} <strong>{confirm.name}</strong>
            {confirm.attending && confirm.guests > 1 ? ` (${guestCount(confirm.guests)})` : ''} {t('is deleted for good. It is not in the list or the CSV afterwards.')}
          </p>
          <div className={styles.buttonRow}>
            <Button variant="danger" icon={Trash2} busy={working} busyLabel={t('Removing…')} disabled={!online} onClick={() => void act('remove', [confirm.id])} data-confirm-remove-reply>
              {t('Remove reply')}
            </Button>
            <Button onClick={() => setConfirm(null)}>{t('Keep it')}</Button>
          </div>
        </Sheet>
      ) : null}
      {sheet ? (
        <ReplySheet
          api={api}
          reply={sheet.reply}
          questions={data.questions ?? []}
          maxGuests={data.maxGuests ?? 10}
          online={online}
          onClose={() => setSheet(null)}
          onSaved={(summary, saved) => {
            replies.setData(summary);
            setSheet(null);
            if (saved) setOpenIds((cur) => new Set(cur).add(saved.id));
            snack(sheet.reply ? t('Reply saved') : t('Reply added'));
          }}
        />
      ) : null}
    </div>
  );
}

function DeadlineLine({ insights, content, canAdd }: { insights?: RsvpInsights; content: ContentRecord; canAdd: boolean }) {
  const d = insights?.deadline;
  if (!d) return null;
  const long = formatDateLong(content.rsvp?.deadline, content.locale);
  const city = zoneCity(content.timezone);
  const add = canAdd ? t('You can still add replies you get another way.') : null;
  let head: ReactNode;
  let detail: string | null = null;
  if (d.state === 'off') {
    head = t('Replies on the website are off.');
    detail = add;
  } else if (d.state === 'closed' || d.state === 'thank_you') {
    head = deadlineText(d);
    detail = add;
  } else if (d.state === 'last_day') {
    head = <strong>{t('Today is the last day to reply.')}</strong>;
    detail = t('{city} time.', { city });
  } else if (d.state === 'open') {
    head = (
      <>
        {t('Replies close in')} <strong>{tn(d.daysLeft ?? 0, '1 day', '{n} days')}</strong>.
      </>
    );
    detail = long ? t('Last day: {date} ({city} time).', { date: long, city }) : null;
  } else return null;
  return (
    <div className={styles.deadline} data-deadline={d.state}>
      <span className={styles.deadlineIcon} aria-hidden="true">
        <CalendarClock size={20} strokeWidth={1.75} />
      </span>
      <p className={styles.deadlineText}>
        <span className={styles.deadlineHead}>{head}</span>
        {detail ? <span className={styles.deadlineDetail}> {detail}</span> : null}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Answer breakdown

function QuestionCard({ q, active, onPick }: { q: QuestionInsight; active: string | null; onPick: (q: QuestionInsight, value: string) => void }) {
  const [all, setAll] = useState(false);
  const titleId = `question-${q.id}`;
  const unanswered = q.current ? Math.max(0, q.asked - q.answered) : 0;
  return (
    <Card title={q.label} titleId={titleId} data-question-insight={q.id} action={!q.current ? <Badge>{t('Removed question')}</Badge> : undefined}>
      {q.kind === 'text' ? (
        q.answers.length ? (
          <>
            <ul className={styles.textAnswers}>
              {(all ? q.answers : q.answers.slice(0, 3)).map((a) => (
                <li key={a.replyId}>
                  <span className={styles.replyKey}>{a.name}</span>
                  <span className={styles.preLine}>{a.answer}</span>
                </li>
              ))}
            </ul>
            {q.answers.length > 3 ? (
              <Button small variant="tertiary" onClick={() => setAll((v) => !v)} aria-expanded={all}>
                {all ? t('Show fewer') : t('Show all {n} answers', { n: q.answers.length })}
              </Button>
            ) : null}
          </>
        ) : (
          <p className={styles.cardText}>{t('No answers yet.')}</p>
        )
      ) : (
        <ul className={styles.bars} aria-labelledby={titleId}>
          {q.options.map((o) => {
            const on = active !== null && norm(active) === norm(o.value);
            return (
              <li key={o.value}>
                <button type="button" className={cx(styles.barRow, on && styles.barRowOn)} aria-pressed={on} onClick={() => onPick(q, o.value)} data-answer-option={o.value}>
                  <span className={styles.barLabel}>
                    {o.value}
                    {o.old ? <span className={styles.barOld}> · {t('earlier option')}</span> : null}
                  </span>
                  <span className={styles.bar} aria-hidden="true">
                    <span className={styles.barFill} style={{ width: `${o.percent}%` }} />
                  </span>
                  <span className={styles.barValue}>
                    {/* G100 (Typeform): count and percent; yes / no reads percent first. */}
                    {q.kind === 'yesno' ? (
                      <>
                        {o.percent}% <span className={styles.barCount}>({o.count})</span>
                      </>
                    ) : (
                      <>
                        {o.count} · {o.percent}%
                      </>
                    )}
                    <span className={styles.visuallyHidden}> {tn(o.count, 'reply', 'replies')}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className={cx(styles.hint, styles.cardFootHint)}>
        {q.answered ? tn(q.answered, '1 reply answered', '{n} replies answered') : t('No answers yet')}
        {unanswered ? ` · ${t('{n} did not answer', { n: unanswered })}` : ''}
      </p>
    </Card>
  );
}

function DietaryCard({ insights, hasQuestion, archived, onSettings }: { insights?: RsvpInsights; hasQuestion: boolean; archived: boolean; onSettings: () => void }) {
  const notes = insights?.dietary ?? [];
  return (
    <Card title={t('Food & allergy notes')} titleId="dietary-title" data-dietary>
      {notes.length ? (
        <ul className={styles.dietList}>
          {notes.map((n, i) => (
            <li key={`${n.replyId}-${n.from}-${i}`} data-dietary-note>
              <Utensils size={18} strokeWidth={1.75} aria-hidden="true" className={styles.dietIcon} />
              <span className={styles.dietBody}>
                <span className={styles.dietName}>{n.name}</span>
                <span className={styles.preLine}>{n.text}</span>
                <span className={styles.dietFrom}>{n.from === 'message' ? t('From their message') : n.question}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.cardText}>{t('No food or allergy notes yet.')}</p>
      )}
      {!hasQuestion ? (
        <p className={cx(styles.hint, styles.cardFootHint)}>
          {t('Messages that mention food or allergies show here. To ask every guest, add a question such as “Any allergies or dietary needs?”')}
          {archived ? (
            '.'
          ) : (
            <>
              {' '}
              {t('in')}{' '}
              <button type="button" className={styles.inlineLink} onClick={onSettings}>
                {t('Reply settings')}
              </button>
              .
            </>
          )}
        </p>
      ) : null}
    </Card>
  );
}

// ---------------------------------------------------------------------------------------------
// Reply card

function ReplyCard({
  r,
  open,
  isNew,
  archived,
  onToggle,
  onEdit,
  onKeep,
  onRemove,
}: {
  r: ReplyEntry;
  open: boolean;
  isNew: boolean;
  archived: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onKeep: () => void;
  onRemove: () => void;
}) {
  const party = partyLine(r);
  const people = replyPeople(r);
  const bodyId = `reply-${r.id}-body`;
  return (
    <li className={cx(styles.reply, isNew && styles.replyNew)} data-reply data-reply-name={r.name}>
      <div className={styles.replyHead}>
        <button type="button" className={cx(styles.replyToggle, styles.replyToggleRow)} aria-expanded={open} aria-controls={open ? bodyId : undefined} onClick={onToggle}>
          <span className={cx(styles.replyAvatar, !r.attending && styles.replyAvatarNo)} aria-hidden="true">
            {!r.attending ? <UserX size={20} strokeWidth={1.75} /> : r.guests > 1 ? <Users size={20} strokeWidth={1.75} /> : <User size={20} strokeWidth={1.75} />}
          </span>
          <span className={styles.replyText}>
          <span className={styles.replyTop}>
            <span className={styles.replyName}>{r.name}</span>
            {isNew ? (
              <Badge tone="strong" data-new-badge>
                {t('New')}
              </Badge>
            ) : null}
          </span>
          <span className={styles.replyMeta}>
            {r.attending ? (
              <Badge tone="success" data-dot>{t('Coming · {guests}', { guests: guestCount(r.guests) })}</Badge>
            ) : (
              <Badge data-dot>{t('Not coming')}</Badge>
            )}
            {r.held ? <Badge tone="warning">{t('Held')}</Badge> : null}
            {r.source === 'couple' ? <Badge tone="accent">{t('Added by you')}</Badge> : r.editedAt ? <Badge>{t('Edited by you')}</Badge> : null}
            <span className={styles.replyTime}>{new Date(r.createdAt).toLocaleDateString(dateTag(), { month: 'short', day: 'numeric' })}</span>
          </span>
          {party ? (
            <span className={styles.replyParty} data-reply-party>
              {party}
            </span>
          ) : null}
          </span>
        </button>
        {!archived ? (
          <OverflowMenu
            label={t('Options for the reply from {name}', { name: r.name })}
            items={[
              { label: t('Edit reply'), icon: Pencil, onSelect: onEdit },
              ...(r.held ? [{ label: t('Keep this reply'), onSelect: onKeep }] : []),
              { label: t('Remove reply'), danger: true, icon: Trash2, onSelect: onRemove },
            ]}
          />
        ) : null}
      </div>
      {open ? (
        <div className={styles.replyBody} id={bodyId}>
          {people.length > 1 ? (
            <div data-reply-people>
              <span className={styles.replyKey}>{t('Everyone in this reply')}</span>
              <ol className={styles.peopleList}>
                {people.map((p) => (
                  <li key={p.number}>{p.named ? p.name : <span className={styles.unnamed}>{p.name} · {t('no name given')}</span>}</li>
                ))}
              </ol>
            </div>
          ) : null}
          {r.email ? (
            <p>
              <span className={styles.replyKey}>{t('Email')}</span> {r.email}
            </p>
          ) : null}
          {(r.answers ?? []).map((a) => (
            <p key={a.id} data-reply-answer>
              <span className={styles.replyKey}>{a.question}</span> {a.answer}
            </p>
          ))}
          {r.message ? <p className={styles.replyMessage}>“{r.message}”</p> : null}
          {!r.email && !r.message && !(r.answers ?? []).length && people.length < 2 ? <p className={styles.hint}>{t('No message.')}</p> : null}
          <p className={styles.replyStamp}>
            {r.source === 'couple' ? t('Added by you on {date}', { date: when(r.createdAt) }) : t('Sent on {date}', { date: when(r.createdAt) })}
            {r.editedAt ? ` · ${t('Edited by you on {date}', { date: when(r.editedAt) })}` : ''}
          </p>
          {!archived ? (
            <div className={styles.buttonRow}>
              <Button small icon={Pencil} onClick={onEdit} data-edit-reply>
                {t('Edit reply')}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

// ---------------------------------------------------------------------------------------------
// Add a reply / correct a reply

interface Draft {
  name: string;
  email: string;
  attending: 'yes' | 'no';
  guests: number;
  party: string[];
  answers: Record<string, string>;
  message: string;
}

function draftOf(r: ReplyEntry | null): Draft {
  const answers: Record<string, string> = {};
  for (const a of r?.answers ?? []) answers[a.id] = a.answer;
  return {
    name: r?.name ?? '',
    email: r?.email ?? '',
    attending: r && !r.attending ? 'no' : 'yes',
    guests: r?.attending ? Math.max(1, r.guests) : 1,
    party: [...(r?.party ?? [])],
    answers,
    message: r?.message ?? '',
  };
}

/** Input id of a server field key (name, email, guests, message, answer:<id>, party:<n>). */
const fieldDomId = (key: string) => `reply-${key.replace(':', '-')}`;

function ReplySheet({
  api,
  reply,
  questions,
  maxGuests,
  online,
  onClose,
  onSaved,
}: {
  api: PanelApi;
  reply: ReplyEntry | null;
  questions: RsvpQuestion[];
  maxGuests: number;
  online: boolean;
  onClose: () => void;
  onSaved: (summary: RepliesSummary, saved: ReplyEntry | null) => void;
}) {
  const [d, setD] = useState<Draft>(() => draftOf(reply));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const set = (patch: Partial<Draft>) => setD((cur) => ({ ...cur, ...patch }));
  const clear = (key: string) => setErrors((cur) => (cur[key] ? Object.fromEntries(Object.entries(cur).filter(([k]) => k !== key)) : cur));
  const cap = Math.max(maxGuests, d.guests);
  const coming = d.attending === 'yes';

  const focusFirst = (keys: string[]) => {
    window.requestAnimationFrame(() => {
      for (const k of keys) {
        const el = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldDomId(k))}`);
        if (el) {
          el.focus();
          return;
        }
      }
    });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!d.name.trim()) {
      setErrors({ name: t('Please enter a name.') });
      focusFirst(['name']);
      return;
    }
    setBusy(true);
    setFormError(null);
    const answers: Record<string, string> = {};
    for (const q of questions) answers[q.id] = coming ? (d.answers[q.id] ?? '') : '';
    const body = {
      name: d.name,
      email: d.email,
      attending: d.attending,
      guests: coming ? d.guests : 0,
      message: d.message,
      answers,
      party: coming ? d.party.slice(0, d.guests - 1) : [],
    };
    const res = await api.saveReply(body, reply?.id);
    setBusy(false);
    if (res.ok) {
      const summary = res.body as unknown as RepliesSummary & { reply?: ReplyEntry };
      onSaved(summary, summary.reply ?? null);
      return;
    }
    const fields = (res.body as { fields?: Record<string, string> }).fields;
    if (res.status === 400 && fields && Object.keys(fields).length) {
      setErrors(fields);
      focusFirst(Object.keys(fields));
    } else setFormError(res.status === 0 ? t('No connection. The reply was not saved. Please try again.') : (res.body.message ? t(res.body.message) : t('The reply could not be saved. Please try again.')));
  };

  const errorOf = (key: string) =>
    errors[key] ? (
      <p id={`${fieldDomId(key)}-error`} className={styles.issueError}>
        {t(errors[key])}
      </p>
    ) : null;
  const describe = (key: string, hint?: string) => [hint, errors[key] ? `${fieldDomId(key)}-error` : ''].filter(Boolean).join(' ') || undefined;

  const title = reply ? t('Edit the reply from {name}', { name: reply.name }) : t('Add a reply');
  return (
    <Sheet title={reply ? t('Edit reply') : t('Add a reply')} onClose={onClose} closeLabel={t('Cancel')} testId="reply-sheet">
      <form ref={formRef} className={styles.replyForm} onSubmit={(e) => void submit(e)} noValidate aria-label={title} data-reply-form>
        <p className={styles.hint}>
          {reply
            ? reply.source === 'couple'
              ? t('This is a reply you added.')
              : t('Your changes are marked “Edited by you”. The guest is not told.')
            : t('For a reply you got by phone, email or in person. It counts like any other and is marked “Added by you”.')}
        </p>

        <div className={styles.field}>
          <label htmlFor={fieldDomId('name')} className={styles.label}>
            {t('Name')}
          </label>
          <input
            id={fieldDomId('name')}
            className={styles.input}
            value={d.name}
            maxLength={120}
            autoComplete="off"
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={describe('name')}
            onChange={(e) => (set({ name: e.target.value }), clear('name'))}
            data-autofocus
          />
          {errorOf('name')}
        </div>

        <Segmented<'yes' | 'no'>
          id={fieldDomId('attending')}
          label={t('Are they coming?')}
          value={d.attending}
          options={[
            { value: 'yes', label: t('Coming') },
            { value: 'no', label: t('Not coming') },
          ]}
          onChange={(v) => (set({ attending: v }), clear('attending'))}
        />
        {errorOf('attending')}

        {coming ? (
          <>
            <div className={styles.field}>
              <label htmlFor={fieldDomId('guests')} className={styles.label}>
                {t('How many people, including them?')}
              </label>
              <select
                id={fieldDomId('guests')}
                className={styles.select}
                value={d.guests}
                aria-invalid={Boolean(errors.guests) || undefined}
                aria-describedby={describe('guests')}
                onChange={(e) => (set({ guests: Number(e.target.value) }), clear('guests'))}
              >
                {Array.from({ length: cap }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n === 1 ? t('1 (just them)') : n}
                  </option>
                ))}
              </select>
              {errorOf('guests')}
            </div>
            {d.guests > 1 ? (
              <fieldset className={styles.partyFields}>
                <legend className={styles.label}>
                  {t('Names of the others')} <span className={styles.optional}>{t('(optional)')}</span>
                </legend>
                {Array.from({ length: d.guests - 1 }, (_, i) => i + 2).map((n) => {
                  const key = `party:${n}`;
                  return (
                    <div key={n} className={styles.field}>
                      <label htmlFor={fieldDomId(key)} className={styles.hintLabel}>
                        {t('Guest {n}', { n })}
                      </label>
                      <input
                        id={fieldDomId(key)}
                        className={styles.input}
                        value={d.party[n - 2] ?? ''}
                        maxLength={120}
                        autoComplete="off"
                        aria-invalid={Boolean(errors[key]) || undefined}
                        aria-describedby={describe(key)}
                        onChange={(e) => {
                          const party = [...d.party];
                          while (party.length < n - 1) party.push('');
                          party[n - 2] = e.target.value;
                          set({ party });
                          clear(key);
                        }}
                      />
                      {errorOf(key)}
                    </div>
                  );
                })}
              </fieldset>
            ) : null}
            {questions.map((q) => {
              const key = `answer:${q.id}`;
              const value = d.answers[q.id] ?? '';
              const onChange = (v: string) => (set({ answers: { ...d.answers, [q.id]: v } }), clear(key));
              // G128: a yes / no question is a choice of Yes and No here too; long / number answers are text boxes.
              const picks = q.type === 'choice' || q.type === 'yesno';
              const options = q.type === 'choice' ? [...(q.options ?? [])] : q.type === 'yesno' ? [t('Yes'), t('No')] : [];
              if (picks && value && !options.some((o) => norm(o) === norm(value))) options.push(value);
              return (
                <div key={q.id} className={styles.field}>
                  <label htmlFor={fieldDomId(key)} className={styles.label}>
                    {q.label} <span className={styles.optional}>{t('(optional)')}</span>
                  </label>
                  {picks ? (
                    <select
                      id={fieldDomId(key)}
                      className={styles.select}
                      value={value}
                      aria-invalid={Boolean(errors[key]) || undefined}
                      aria-describedby={describe(key)}
                      onChange={(e) => onChange(e.target.value)}
                    >
                      <option value="">{t('No answer')}</option>
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <textarea
                      id={fieldDomId(key)}
                      className={styles.textarea}
                      rows={q.type === 'long' ? 4 : q.type === 'number' ? 1 : 2}
                      maxLength={q.type === 'long' ? 1000 : q.type === 'number' ? 4 : 300}
                      inputMode={q.type === 'number' ? 'numeric' : undefined}
                      value={value}
                      aria-invalid={Boolean(errors[key]) || undefined}
                      aria-describedby={describe(key)}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                  {errorOf(key)}
                </div>
              );
            })}
          </>
        ) : null}

        <div className={styles.field}>
          <label htmlFor={fieldDomId('email')} className={styles.label}>
            {t('Email')} <span className={styles.optional}>{t('(optional)')}</span>
          </label>
          <input
            id={fieldDomId('email')}
            type="email"
            inputMode="email"
            className={styles.input}
            value={d.email}
            maxLength={254}
            autoComplete="off"
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={describe('email')}
            onChange={(e) => (set({ email: e.target.value }), clear('email'))}
          />
          {errorOf('email')}
        </div>
        <div className={styles.field}>
          <label htmlFor={fieldDomId('message')} className={styles.label}>
            {t('Note')} <span className={styles.optional}>{t('(optional)')}</span>
          </label>
          <textarea
            id={fieldDomId('message')}
            className={styles.textarea}
            rows={3}
            maxLength={500}
            value={d.message}
            aria-invalid={Boolean(errors.message) || undefined}
            aria-describedby={describe('message')}
            onChange={(e) => (set({ message: e.target.value }), clear('message'))}
          />
          {errorOf('message')}
        </div>

        {formError ? (
          <Banner tone="danger" role="alert">
            {formError}
          </Banner>
        ) : null}
        {!online ? <p className={styles.hint}>{t('Connect to the internet to save this reply.')}</p> : null}
        <div className={cx(styles.buttonRow, styles.stickyActions)}>
          <Button type="submit" variant="primary" busy={busy} busyLabel={t('Saving…')} disabled={!online} data-save-reply>
            {reply ? t('Save changes') : t('Add reply')}
          </Button>
          <Button onClick={onClose}>{t('Cancel')}</Button>
        </div>
      </form>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------------------------
// Printable guest list (#guests/print): the browser's print view, A4 or US Letter

export function GuestPrintView({
  replies,
  content,
  names,
  onBack,
}: {
  replies: Replies;
  content: ContentRecord;
  names: string;
  onBack: () => void;
}) {
  const [who, setWho] = useState<'coming' | 'all'>('coming');
  const [notes, setNotes] = useState(false);
  const { data, error } = replies;
  if (error && !data) {
    return (
      <Banner tone="warning" icon={TriangleAlert} actions={<Button small icon={RefreshCw} onClick={replies.refresh}>{t('Try again')}</Button>}>
        {error}
      </Banner>
    );
  }
  if (!data) {
    return (
      <div className={styles.stack} aria-busy="true">
        <div className={styles.skeletonRow} />
        <div className={styles.skeletonRow} />
      </div>
    );
  }
  const counted = data.responses.filter((r) => !r.held);
  const held = data.responses.length - counted.length;
  const byName = [...counted].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  const coming = byName.filter((r) => r.attending);
  const notComing = byName.filter((r) => !r.attending);
  const people = data.counts.totalGuests;
  const today = new Date().toLocaleDateString(dateTag(), { month: 'long', day: 'numeric', year: 'numeric' });
  // "Meal choice: Fish", "Do you need the shuttle? Yes" (no colon after a question mark)
  const answersOf = (r: ReplyEntry) => (r.answers ?? []).map((a) => `${a.question}${/[?:!.]$/.test(a.question.trim()) ? '' : ':'} ${a.answer}`);

  return (
    <div className={styles.stack} data-print-view>
      <div className={styles.printTools} data-print-hide>
        <p className={styles.hint}>{t('Print it, or choose “Save as PDF” in your browser’s print menu. It fits A4 and US Letter paper.')}</p>
        <Segmented<'coming' | 'all'>
          label={t('Who to include')}
          value={who}
          options={[
            { value: 'coming', label: t('Guests coming') },
            { value: 'all', label: t('Everyone who replied') },
          ]}
          onChange={setWho}
        />
        <label className={styles.checkRow}>
          <input type="checkbox" checked={notes} onChange={(e) => setNotes(e.target.checked)} />
          <span>{t('Include guests’ messages')}</span>
        </label>
        <div className={styles.buttonRow}>
          <Button variant="primary" icon={Printer} onClick={() => window.print()} data-print-now>
            {t('Print')}
          </Button>
          <Button onClick={onBack}>{t('Back to Guests')}</Button>
        </div>
      </div>

      <article className={styles.printDoc} aria-labelledby="print-title" data-print-doc>
        <header className={styles.printHead}>
          <h2 id="print-title" className={styles.printTitle}>
            {t('Guest list')}
          </h2>
          <p className={styles.printNames}>
            {names}
            {formatDateLong(content.date, content.locale) ? ` · ${formatDateLong(content.date, content.locale)}` : ''}
          </p>
          <p className={styles.printMeta}>
            {tn(people, '1 person coming', '{n} people coming')} · {t('{n} not coming', { n: data.counts.notAttending })} · {replyCount(data.counts.responses)} ·{' '}
            {t('Updated {date}', { date: today })}
          </p>
        </header>

        <section aria-labelledby="print-coming">
          <h3 id="print-coming" className={styles.printSection}>
            {t('Coming — {people}', { people: peopleCount(people) })}
          </h3>
          {coming.length ? (
            <table className={styles.printTable}>
              <thead>
                <tr>
                  <th scope="col" className={styles.printCheck}>
                    <span className={styles.visuallyHidden}>{t('Arrived')}</span>
                    <span aria-hidden="true">✓</span>
                  </th>
                  <th scope="col">{t('Name')}</th>
                  <th scope="col">{t('Party')}</th>
                  <th scope="col">{notes ? t('Answers & messages') : t('Answers')}</th>
                </tr>
              </thead>
              <tbody>
                {coming.map((r) =>
                  replyPeople(r).map((p) => {
                    const lines = p.number === 1 ? [...answersOf(r), ...(notes && r.message ? [`“${r.message}”`] : [])] : [];
                    return (
                      <tr key={`${r.id}-${p.number}`} className={p.number === 1 ? styles.printFirst : undefined} data-print-row>
                        <td className={styles.printCheck}>
                          <span className={styles.printBox} aria-hidden="true" />
                        </td>
                        <td className={styles.printName}>{p.named ? p.name : <span className={styles.unnamed}>{p.name} ({t('no name given')})</span>}</td>
                        <td className={styles.printParty}>{p.number === 1 ? (r.guests > 1 ? t('Party of {n}', { n: r.guests }) : t('On their own')) : t('with {name}', { name: r.name })}</td>
                        <td className={styles.printNotes}>
                          {lines.map((l, i) => (
                            <Fragment key={i}>
                              {i ? <br /> : null}
                              {l}
                            </Fragment>
                          ))}
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          ) : (
            <p className={styles.cardText}>{t('No guests are coming yet.')}</p>
          )}
        </section>

        {who === 'all' ? (
          <section aria-labelledby="print-not">
            <h3 id="print-not" className={styles.printSection}>
              {t('Not coming — {replies}', { replies: replyCount(notComing.length) })}
            </h3>
            {notComing.length ? (
              <table className={styles.printTable}>
                <thead>
                  <tr>
                    <th scope="col">{t('Name')}</th>
                    <th scope="col">{notes ? t('Message') : t('Email')}</th>
                  </tr>
                </thead>
                <tbody>
                  {notComing.map((r) => (
                    <tr key={r.id} data-print-row>
                      <td className={styles.printName}>{r.name}</td>
                      <td className={styles.printNotes}>{notes ? (r.message ? `“${r.message}”` : '') : (r.email ?? '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.cardText}>{t('Nobody has said no.')}</p>
            )}
          </section>
        ) : null}
        {held ? <p className={styles.printFoot}>{tn(held, '1 reply is held for review and not on this list.', '{n} replies are held for review and not on this list.')}</p> : null}
      </article>
    </div>
  );
}
