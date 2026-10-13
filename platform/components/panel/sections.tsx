'use client';
// The panel's form sections (Couple … Optional sections). Photos live in PhotosSection.tsx.
// Every value is written into the content record (the single source the theme renders from).

import { useEffect, useState } from 'react';
import { formatDate, formatDateLong, formatTime } from '../../lib/content/format.ts';
import type { Locale, RsvpQuestion } from '../../lib/content/types.ts';
import { CONTENT_LIMITS } from '../../lib/content/validate.ts';
import { newQuestionId, OPTIONAL_BLOCK_LABELS, withPartnerName, type OptionalBlockKey } from '../../lib/panel/model.ts';
import type { PanelApi } from './api.ts';
import { DateField, IssueList, moveItem, RowActions, SelectField, Switch, TextField, TimeField, UrlField, usePanelContext } from './fields.tsx';
import styles from './panel.module.css';

const nullIfEmpty = (v: string): string | null => (v.trim() ? v : null);

// ---------------------------------------------------------------------------------------------

export function CoupleFields() {
  const { content, edit, locked, fields } = usePanelContext();
  const partners = content.partners ?? [];
  return (
    <>
      {partners.map((p, i) => (
        <fieldset key={i} className={styles.group}>
          <legend className={styles.groupTitle}>{i === 0 ? 'First partner' : 'Second partner'}</legend>
          <TextField
            path={`partners.${i}.display_name`}
            label="First name"
            hint={i === 0 ? 'As your guests know you, e.g. Clara.' : undefined}
            value={p.display_name}
            autoComplete="off"
            onChange={(v) => edit((c) => withPartnerName(c, i, 'display_name', v))}
          />
          <TextField
            path={`partners.${i}.full_name`}
            label="Full name"
            optional
            hint="Shown on the invitation card. Follows the first name until you change it."
            value={p.full_name}
            onChange={(v) => edit((c) => withPartnerName(c, i, 'full_name', v))}
          />
        </fieldset>
      ))}
      {partners.length < 2 ? (
        <button type="button" className={styles.secondaryButton} disabled={locked} onClick={() => edit((c) => void c.partners.push({ display_name: '', full_name: null }))}>
          Add a second name
        </button>
      ) : null}
      <TextField
        path="name_display"
        label="Names as shown on the site"
        hint="Follows the first names until you change it yourself."
        value={content.name_display}
        onChange={(v) => edit((c) => void (c.name_display = v))}
      />
      {/* Only when the design shows a monogram (a field that changes nothing would mislead). */}
      {fields.initials ? (
        <TextField
          path="initials"
          label="Monogram"
          hint="Up to 9 characters, e.g. C&J."
          maxLength={9}
          value={content.initials}
          onChange={(v) => edit((c) => void (c.initials = v))}
        />
      ) : null}
      <TextField
        path="host_line"
        label="Host line"
        optional
        hint="For example: Together with their families."
        value={content.host_line}
        onChange={(v) => edit((c) => void (c.host_line = nullIfEmpty(v)))}
      />
    </>
  );
}

// ---------------------------------------------------------------------------------------------

const LOCALES: Array<{ value: Locale; name: string }> = [
  { value: 'en-US', name: 'United States' },
  { value: 'en-GB', name: 'United Kingdom' },
  { value: 'en-CA', name: 'Canada' },
  { value: 'en-AU', name: 'Australia' },
];

/** All IANA zones of this browser (filled after mount so server and client markup match). */
function useTimeZones(current: string): string[] {
  const [zones, setZones] = useState<string[]>(current ? [current] : []);
  useEffect(() => {
    try {
      const all = Intl.supportedValuesOf('timeZone');
      setZones(current && !all.includes(current) ? [current, ...all] : all);
    } catch {
      /* very old browser: keep the stored zone only */
    }
  }, [current]);
  return zones;
}

function zoneOption(zone: string) {
  const i = zone.indexOf('/');
  const group = i > 0 ? zone.slice(0, i) : 'Other';
  const label = (i > 0 ? zone.slice(i + 1) : zone).replace(/_/g, ' ').replace(/\//g, ' – ');
  return { value: zone, label, group };
}

export function DateFields() {
  const { content, edit, locked } = usePanelContext();
  const zones = useTimeZones(content.timezone);
  const locale = content.locale;
  const sampleDate = content.date || '2027-06-12';
  return (
    <>
      <DateField path="date" label="Wedding date" value={content.date} locale={locale} onChange={(v) => edit((c) => void (c.date = v))} />
      <TimeField
        path="ceremony_time"
        label="Ceremony time"
        value={content.ceremony_time}
        locale={locale}
        onChange={(v) =>
          edit((c) => {
            const before = c.ceremony_time;
            c.ceremony_time = v;
            // Keep the first schedule row in step while it shows the ceremony time.
            if (c.schedule?.[0] && c.schedule[0].time === before) c.schedule[0].time = v;
          })
        }
      />
      <SelectField
        path="timezone"
        label="Time zone of the wedding"
        hint="Used for the countdown and for closing replies at the right moment."
        value={content.timezone}
        options={zones.map(zoneOption)}
        onChange={(v) => edit((c) => void (c.timezone = v))}
      />
      <button
        type="button"
        className={styles.linkButton}
        disabled={locked}
        onClick={() => {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz) edit((c) => void (c.timezone = tz));
        }}
      >
        Use this device’s time zone
      </button>
      <SelectField
        path="locale"
        label="Date style"
        hint="How dates and times are written on your site."
        value={locale}
        options={LOCALES.map((l) => ({
          value: l.value,
          label: `${l.name}: ${formatDate(sampleDate, l.value)}, ${formatTime(content.ceremony_time || '16:00', l.value)}`,
        }))}
        onChange={(v) => edit((c) => void (c.locale = v as Locale))}
      />
    </>
  );
}

// ---------------------------------------------------------------------------------------------

export function VenueFields() {
  const { content, edit } = usePanelContext();
  const v = content.venue ?? { name: '', city: '' };
  return (
    <>
      <TextField path="venue.name" label="Venue name" value={v.name} onChange={(x) => edit((c) => void (c.venue.name = x))} />
      <TextField path="venue.address" label="Street address" optional value={v.address} onChange={(x) => edit((c) => void (c.venue.address = nullIfEmpty(x)))} />
      <TextField path="venue.city" label="City" value={v.city} onChange={(x) => edit((c) => void (c.venue.city = x))} />
      <TextField path="venue.region" label="State or region" optional value={v.region} onChange={(x) => edit((c) => void (c.venue.region = nullIfEmpty(x)))} />
      <TextField path="venue.country" label="Country" optional value={v.country} onChange={(x) => edit((c) => void (c.venue.country = nullIfEmpty(x)))} />
    </>
  );
}

// ---------------------------------------------------------------------------------------------

export function ScheduleFields() {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const schedule = content.schedule ?? [];
  const listIssues = issuesAt('schedule');
  const unsorted = listIssues.some((i) => i.code === 'schedule_not_chronological');
  return (
    <>
      <p className={styles.hint}>The order of the day, from the ceremony on.</p>
      {schedule.map((row, i) => (
        <fieldset key={i} className={styles.group} data-schedule-row={i}>
          <legend className={styles.groupTitle}>Event {i + 1}</legend>
          <TimeField path={`schedule.${i}.time`} label="Time" value={row.time} locale={content.locale} onChange={(v) => edit((c) => void (c.schedule[i].time = v))} />
          <TextField path={`schedule.${i}.label`} label="What happens" placeholder="Ceremony" value={row.label} onChange={(v) => edit((c) => void (c.schedule[i].label = v))} />
          <TextField path={`schedule.${i}.location`} label="Where" optional value={row.location} onChange={(v) => edit((c) => void (c.schedule[i].location = nullIfEmpty(v)))} />
          <RowActions
            index={i}
            count={schedule.length}
            noun="event"
            onMove={(a, b) => edit((c) => void (c.schedule = moveItem(c.schedule, a, b)))}
            onRemove={(n) => edit((c) => void c.schedule.splice(n, 1))}
          />
        </fieldset>
      ))}
      <IssueList issues={listIssues} />
      <div className={styles.buttonRow}>
        <button type="button" className={styles.secondaryButton} disabled={locked} onClick={() => edit((c) => void c.schedule.push({ label: '', time: '', location: null }))}>
          Add an event
        </button>
        {unsorted ? (
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={locked}
            onClick={() => edit((c) => void (c.schedule = [...c.schedule].sort((a, b) => (a.time || '99').localeCompare(b.time || '99'))))}
          >
            Sort by time
          </button>
        ) : null}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------

export function StoryFields({ onOpenOptional }: { onOpenOptional: () => void }) {
  const { content, edit, issuesAt, locked, fields } = usePanelContext();
  const items = content.story?.items ?? [];
  // The design decides how many moments it shows and whether it shows their text.
  const shown = fields.storyItems;
  const storyOff = content.optional_blocks?.our_story !== true;
  return (
    <>
      {storyOff ? (
        <p className={styles.note}>
          The Our Story page is turned off.{' '}
          <button type="button" className={styles.inlineLink} onClick={onOpenOptional}>
            Turn it on in Optional sections
          </button>
          .
        </p>
      ) : null}
      <TextField
        path="story.intro"
        label="Intro line"
        optional
        multiline
        rows={2}
        maxLength={200}
        value={content.story?.intro}
        onChange={(v) =>
          edit((c) => {
            c.story = { ...(c.story ?? {}) };
            if (v) c.story.intro = v;
            else delete c.story.intro;
          })
        }
      />
      {shown ? (
        <p className={styles.hint}>
          This design shows {shown === 1 ? 'one moment' : `up to ${shown} moments`}, each with a short caption. The photos for them are under Photos.
        </p>
      ) : (
        <p className={styles.hint}>This design does not show story moments.</p>
      )}
      {items.map((item, i) => (
        <fieldset key={i} className={styles.group}>
          <legend className={styles.groupTitle}>Moment {i + 1}</legend>
          {i >= shown ? <p className={styles.note}>This design shows only {shown === 1 ? 'one moment' : `${shown} moments`}: guests do not see this one.</p> : null}
          <TextField
            path={`story.items.${i}.caption`}
            label="Caption"
            maxLength={60}
            value={item.caption}
            onChange={(v) => edit((c) => void (c.story!.items![i].caption = v))}
          />
          {fields.storyText ? (
            <TextField
              path={`story.items.${i}.text`}
              label="A few words"
              optional
              multiline
              rows={3}
              maxLength={400}
              value={item.text}
              onChange={(v) =>
                edit((c) => {
                  const it = c.story!.items![i];
                  if (v) it.text = v;
                  else delete it.text;
                })
              }
            />
          ) : null}
          <RowActions
            index={i}
            count={items.length}
            noun="moment"
            onMove={(a, b) => edit((c) => void (c.story!.items = moveItem(c.story!.items!, a, b)))}
            onRemove={(n) => edit((c) => void c.story!.items!.splice(n, 1))}
          />
        </fieldset>
      ))}
      <IssueList issues={[...issuesAt('story'), ...issuesAt('story.items')]} />
      {items.length < shown ? (
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={locked}
          onClick={() =>
            edit((c) => {
              c.story = { ...(c.story ?? {}) };
              c.story.items = [...(c.story.items ?? []), { caption: '' }];
            })
          }
        >
          Add a moment
        </button>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------------------------

function shownWhen(blocks: readonly OptionalBlockKey[], key: OptionalBlockKey, on: boolean | undefined): string | undefined {
  if (!blocks.includes(key)) return undefined;
  return `Shown when “${OPTIONAL_BLOCK_LABELS[key].label}” is on in Optional sections${on ? '' : ' (now off)'}.`;
}

export function DetailsFields({ optionalBlocks }: { optionalBlocks: readonly OptionalBlockKey[] }) {
  const { content, edit, issuesAt } = usePanelContext();
  const blocks = content.optional_blocks ?? {};
  const urls = content.urls ?? {};
  const setUrl = (key: 'map' | 'registry' | 'accommodation') => (v: string | null) =>
    edit((c) => {
      c.urls = { ...(c.urls ?? {}), [key]: v };
    });
  return (
    <>
      <TextField
        path="dress_code"
        label="Dress code"
        optional
        placeholder="Garden formal"
        hint={shownWhen(optionalBlocks, 'dress_code', blocks.dress_code)}
        value={content.dress_code}
        onChange={(v) => edit((c) => void (c.dress_code = nullIfEmpty(v)))}
      />
      <UrlField path="urls.map" label="Map link" optional hint="Paste a Google Maps or Apple Maps link to the venue." value={urls.map} onChange={setUrl('map')} />
      <UrlField
        path="urls.accommodation"
        label="Travel & stay link"
        optional
        hint={['A hotel block or accommodation page for guests.', shownWhen(optionalBlocks, 'travel_stay', blocks.travel_stay)].filter(Boolean).join(' ')}
        value={urls.accommodation}
        onChange={setUrl('accommodation')}
      />
      <UrlField
        path="urls.registry"
        label="Registry link"
        optional
        hint={shownWhen(optionalBlocks, 'registry', blocks.registry)}
        value={urls.registry}
        onChange={setUrl('registry')}
      />
      <IssueList issues={issuesAt('urls')} />
    </>
  );
}

// ---------------------------------------------------------------------------------------------

/** Questions & answers (content faq, G051): add, edit, reorder, remove; shown while optional_blocks.faq is on. */
export function FaqFields() {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const items = content.faq ?? [];
  const on = content.optional_blocks?.faq === true;
  return (
    <>
      <Switch
        id="faq-show"
        label="Show on the website"
        hint={on ? undefined : 'Turn on to show your questions and answers to guests.'}
        checked={on}
        onChange={(v) => edit((c) => void (c.optional_blocks = { ...(c.optional_blocks ?? {}), faq: v }))}
      />
      <p className={styles.hint}>
        Short answers to what guests often ask, such as parking, children or the plan for rain. Up to {CONTENT_LIMITS.faqItems} questions.
      </p>
      {items.map((item, i) => (
        <fieldset key={i} className={styles.group} data-faq-row={i}>
          <legend className={styles.groupTitle}>Question {i + 1}</legend>
          <TextField
            path={`faq.${i}.q`}
            label="Question"
            maxLength={CONTENT_LIMITS.faqQuestion}
            placeholder="Is there parking at the venue?"
            value={item.q}
            onChange={(v) => edit((c) => void (c.faq![i].q = v))}
          />
          <TextField
            path={`faq.${i}.a`}
            label="Answer"
            multiline
            rows={3}
            maxLength={CONTENT_LIMITS.faqAnswer}
            value={item.a}
            onChange={(v) => edit((c) => void (c.faq![i].a = v))}
          />
          <RowActions
            index={i}
            count={items.length}
            noun="question"
            onMove={(a, b) => edit((c) => void (c.faq = moveItem(c.faq!, a, b)))}
            onRemove={(n) => edit((c) => void c.faq!.splice(n, 1))}
          />
        </fieldset>
      ))}
      <IssueList issues={issuesAt('faq')} />
      {items.length < CONTENT_LIMITS.faqItems ? (
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={locked}
          data-add-faq
          onClick={() => edit((c) => void (c.faq = [...(c.faq ?? []), { q: '', a: '' }]))}
        >
          Add a question
        </button>
      ) : (
        <p className={styles.hint}>This section holds {CONTENT_LIMITS.faqItems} questions at most.</p>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------------------------

const QUESTION_TYPES = [
  { value: 'choice', label: 'Guests pick one choice' },
  { value: 'text', label: 'Guests write a short answer' },
];

/**
 * The couple's own questions in the reply form (content rsvp.questions, G051), e.g. a meal choice.
 * Each question keeps its id for good: answers are stored under it, so editing or reordering
 * questions never mixes up answers already received.
 */
function QuestionFields() {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const questions = content.rsvp?.questions ?? [];
  const off = content.rsvp?.method === 'none';
  const change = (i: number, fn: (q: RsvpQuestion) => void) => edit((c) => void fn(c.rsvp.questions![i]));
  const add = () =>
    edit((c) => {
      const list = c.rsvp.questions ?? [];
      c.rsvp = { ...c.rsvp, questions: [...list, { id: newQuestionId(list.map((q) => q.id)), label: '', type: 'choice', options: ['', ''] }] };
    });
  return (
    <div data-rsvp-questions>
      <h3 className={styles.subTitle}>Questions for your guests</h3>
      <p className={styles.hint}>
        Optional, up to {CONTENT_LIMITS.rsvpQuestions}: for example a meal choice. Guests who accept answer them in the reply form; you see the
        answers with their reply and in the CSV.
      </p>
      {off ? <p className={styles.note}>Replies on the website are off, so guests do not see these questions.</p> : null}
      {questions.map((q, i) => (
        <fieldset key={q.id || i} className={styles.group} data-question-row={i}>
          <legend className={styles.groupTitle}>Question {i + 1}</legend>
          <TextField
            path={`rsvp.questions.${i}.label`}
            label="Question"
            maxLength={CONTENT_LIMITS.questionLabel}
            placeholder="Meal choice"
            value={q.label}
            onChange={(v) => change(i, (x) => void (x.label = v))}
          />
          <SelectField
            path={`rsvp.questions.${i}.type`}
            label="Answer"
            value={q.type}
            options={QUESTION_TYPES}
            onChange={(v) =>
              change(i, (x) => {
                x.type = v === 'text' ? 'text' : 'choice';
                if (x.type === 'text') delete x.options;
                else if (!x.options?.length) x.options = ['', ''];
              })
            }
          />
          {q.type === 'choice'
            ? (q.options ?? []).map((o, j) => (
                <div key={j} className={styles.choiceRow}>
                  <TextField
                    path={`rsvp.questions.${i}.options.${j}`}
                    label={`Choice ${j + 1}`}
                    maxLength={CONTENT_LIMITS.questionOption}
                    value={o}
                    onChange={(v) => change(i, (x) => void (x.options![j] = v))}
                  />
                  <button
                    type="button"
                    className={`${styles.smallButton} ${styles.dangerText}`}
                    disabled={locked}
                    aria-label={`Remove choice ${j + 1} of question ${i + 1}`}
                    onClick={() => change(i, (x) => void x.options!.splice(j, 1))}
                  >
                    Remove
                  </button>
                </div>
              ))
            : null}
          <IssueList issues={[...issuesAt(`rsvp.questions.${i}.options`), ...issuesAt(`rsvp.questions.${i}.id`)]} />
          {q.type === 'choice' && (q.options?.length ?? 0) < CONTENT_LIMITS.questionOptions ? (
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.secondaryButton}
                disabled={locked}
                onClick={() => change(i, (x) => void (x.options = [...(x.options ?? []), '']))}
              >
                Add a choice
              </button>
            </div>
          ) : null}
          <RowActions
            index={i}
            count={questions.length}
            noun="form question"
            onMove={(a, b) => edit((c) => void (c.rsvp.questions = moveItem(c.rsvp.questions!, a, b)))}
            onRemove={(n) => edit((c) => void c.rsvp.questions!.splice(n, 1))}
          />
        </fieldset>
      ))}
      <IssueList issues={issuesAt('rsvp.questions')} />
      {questions.length < CONTENT_LIMITS.rsvpQuestions ? (
        <button type="button" className={styles.secondaryButton} disabled={locked} onClick={add} data-add-question>
          Add a question
        </button>
      ) : null}
      {questions.length ? <p className={styles.hint}>Changing or removing a question later keeps the answers you already have.</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

interface ReplyEntry {
  id: string;
  name: string;
  attending: boolean;
  guests: number;
  message: string | null;
  answers?: Array<{ id: string; question: string; answer: string }>;
  createdAt: string;
  held?: boolean;
}

interface RepliesSummary {
  counts: { responses: number; attending: number; notAttending: number; totalGuests: number; held?: number };
  responses: ReplyEntry[];
}

const REPLIES_SHOWN = 20;

function ReplyLine({ r }: { r: ReplyEntry }) {
  return (
    <>
      <strong>{r.name}</strong> — {r.attending ? `yes, ${r.guests} ${r.guests === 1 ? 'guest' : 'guests'}` : 'no'}
      {(r.answers ?? []).map((a) => (
        <span key={a.id} className={styles.replyAnswer} data-reply-answer>
          {a.question}: <strong>{a.answer}</strong>
        </span>
      ))}
      {r.message ? <span className={styles.replyMessage}>“{r.message}”</span> : null}
    </>
  );
}

/**
 * Replies for the couple: counts, the list (latest first), CSV. Each reply can be removed (spam,
 * a test, a duplicate); replies that arrived during unusual volume are held apart (not counted)
 * until the couple keeps or removes them.
 */
function Replies({ api, published }: { api: PanelApi; published: boolean }) {
  const [data, setData] = useState<RepliesSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [working, setWorking] = useState(false);
  useEffect(() => {
    let alive = true;
    void api.replies().then((res) => {
      if (!alive) return;
      if (res.ok) {
        setData(res.body as unknown as RepliesSummary);
        setError(null);
      } else setError(res.body.message ?? 'Replies could not be loaded.');
    });
    return () => {
      alive = false;
    };
  }, [api, tick, published]);
  if (error) return <p className={styles.note}>{error}</p>;
  if (!data) return <p className={styles.hint}>Loading replies…</p>;
  const { counts } = data;
  const held = data.responses.filter((r) => r.held);
  const kept = data.responses.filter((r) => !r.held);
  const visible = showAll ? kept : kept.slice(0, REPLIES_SHOWN);

  const act = async (action: 'remove' | 'keep', ids: string[]) => {
    if (!ids.length) return;
    setWorking(true);
    const res = await api.manageReplies(action, ids);
    setWorking(false);
    setConfirming(false);
    if (res.ok) {
      setData(res.body as unknown as RepliesSummary);
      setSelected(new Set());
      setError(null);
    } else setError(res.body.message ?? 'The replies could not be changed. Please try again.');
  };
  const toggle = (id: string) =>
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const pick = (r: ReplyEntry) => (
    <label className={styles.replyPick}>
      <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} aria-label={`Select the reply from ${r.name}`} />
      <span>
        <ReplyLine r={r} />
      </span>
    </label>
  );

  return (
    <div className={styles.replies} data-replies>
      <div className={styles.labelRow}>
        <h3 className={styles.subTitle}>Replies</h3>
        <button type="button" className={styles.linkButton} onClick={() => setTick((n) => n + 1)} data-refresh-replies>
          Refresh
        </button>
      </div>
      {held.length ? (
        <div className={styles.heldBox} data-held-replies>
          <p className={styles.note}>
            {held.length} {held.length === 1 ? 'reply arrived' : 'replies arrived'} during an unusual number of replies in a short time, so{' '}
            {held.length === 1 ? 'it is' : 'they are'} held here and not counted. Keep the real ones and remove the rest.
          </p>
          <ul className={styles.replyList}>
            {held.map((r) => (
              <li key={r.id}>
                <ReplyLine r={r} />
                <span className={styles.rowActions}>
                  <button type="button" className={styles.smallButton} disabled={working} onClick={() => void act('keep', [r.id])} aria-label={`Keep the reply from ${r.name}`}>
                    Keep
                  </button>
                  <button
                    type="button"
                    className={`${styles.smallButton} ${styles.dangerText}`}
                    disabled={working}
                    onClick={() => void act('remove', [r.id])}
                    aria-label={`Remove the reply from ${r.name}`}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <button type="button" className={`${styles.secondaryButton} ${styles.dangerText}`} disabled={working} onClick={() => void act('remove', held.map((r) => r.id))}>
            Remove all held replies
          </button>
        </div>
      ) : null}
      {counts.responses === 0 ? (
        <p className={styles.hint}>{published ? 'No replies yet.' : 'Replies arrive here once your site is published.'}</p>
      ) : (
        <>
          <p>
            {counts.responses} {counts.responses === 1 ? 'reply' : 'replies'} · {counts.attending} attending ({counts.totalGuests}{' '}
            {counts.totalGuests === 1 ? 'guest' : 'guests'}) · {counts.notAttending} not attending
          </p>
          <ul className={styles.replyList}>
            {visible.map((r) => (
              <li key={r.id}>{pick(r)}</li>
            ))}
          </ul>
          {kept.length > REPLIES_SHOWN ? (
            <p className={styles.hint}>
              {showAll ? `Showing all ${kept.length} replies.` : `Showing the latest ${REPLIES_SHOWN} of ${kept.length} replies. The CSV has all of them.`}{' '}
              <button type="button" className={styles.inlineLink} onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show fewer' : 'Show all'}
              </button>
            </p>
          ) : null}
          {selected.size ? (
            <div className={styles.buttonRow}>
              {confirming ? (
                <>
                  <button type="button" className={`${styles.secondaryButton} ${styles.dangerText}`} disabled={working} onClick={() => void act('remove', [...selected])} data-confirm-remove-replies>
                    Yes, remove {selected.size} {selected.size === 1 ? 'reply' : 'replies'}
                  </button>
                  <button type="button" className={styles.secondaryButton} onClick={() => setConfirming(false)}>
                    Keep them
                  </button>
                </>
              ) : (
                <button type="button" className={`${styles.secondaryButton} ${styles.dangerText}`} onClick={() => setConfirming(true)} data-remove-replies>
                  Remove selected ({selected.size})
                </button>
              )}
            </div>
          ) : null}
          <a className={styles.secondaryButton} href={api.repliesCsvUrl()} download rel="noreferrer">
            Download all replies (CSV)
          </a>
        </>
      )}
    </div>
  );
}

export function RsvpFields({ api, published }: { api: PanelApi; published: boolean }) {
  const { content, edit, fields } = usePanelContext();
  const deadline = content.rsvp?.deadline;
  const long = formatDateLong(deadline, content.locale);
  return (
    <>
      <DateField
        path="rsvp.deadline"
        label="Reply by"
        value={deadline}
        locale={content.locale}
        display={long ? `Replies close at the end of ${long} (${(content.timezone ?? '').replace(/_/g, ' ')} time).` : undefined}
        onChange={(v) => edit((c) => void (c.rsvp = { ...c.rsvp, deadline: v }))}
      />
      <Switch
        id="rsvp-accept"
        label="Accept replies on the website"
        hint="Turn off if you collect replies another way; the form then shows as closed."
        checked={content.rsvp?.method !== 'none'}
        onChange={(on) => edit((c) => void (c.rsvp = { ...c.rsvp, method: on ? null : 'none' }))}
      />
      {fields.rsvpQuestions ? <QuestionFields /> : null}
      <Replies api={api} published={published} />
    </>
  );
}

// ---------------------------------------------------------------------------------------------

export function OptionalFields({ optionalBlocks }: { optionalBlocks: readonly OptionalBlockKey[] }) {
  const { content, edit } = usePanelContext();
  return (
    <>
      <p className={styles.hint}>Choose which parts of the design your guests see.</p>
      {optionalBlocks.map((key) => (
        <Switch
          key={key}
          id={`optional-${key}`}
          label={OPTIONAL_BLOCK_LABELS[key].label}
          hint={OPTIONAL_BLOCK_LABELS[key].hint}
          checked={content.optional_blocks?.[key] === true}
          onChange={(on) => edit((c) => void (c.optional_blocks = { ...(c.optional_blocks ?? {}), [key]: on }))}
        />
      ))}
    </>
  );
}
