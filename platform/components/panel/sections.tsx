'use client';
// The panel's section editors (docs/16 §4.3): Names, Date & time, Venue, Schedule, Our Story, Details,
// Questions & answers, RSVP settings. Photos live in PhotosSection.tsx; replies in views.tsx (Guests).
// Every value is written into the content record (the single source the theme renders from).
// Each on/off switch sits next to the content it controls (no separate "Optional sections").

import { CalendarDays, Lock, Pencil, Plus, Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDate, formatDateLong, formatTime } from '../../lib/content/format.ts';
import type { ContentRecord, Locale, RsvpQuestion } from '../../lib/content/types.ts';
import { CONTENT_LIMITS } from '../../lib/content/limits.ts';
import { defaultNameDisplay, newQuestionId, OPTIONAL_BLOCK_LABELS, withPartnerName, type OptionalBlockKey, type PanelTheme } from '../../lib/panel/model.ts';
import { IDENTITY_CHANGE_LIMIT } from '../../lib/panel/rights.ts';
import { DateField, Group, IssueList, RepeatableItem, SelectField, Switch, TextField, TimeField, UrlField, usePanelContext } from './fields.tsx';
import { PhotoSlots } from './PhotosSection.tsx';
import { Button, cx, EmptyState, RightsMeter, Segmented } from './ui.tsx';
import styles from './panel.module.css';

const nullIfEmpty = (v: string): string | null => (v.trim() ? v : null);

/** The rule as the buyer reads it before the first publish (docs/16 §11.7). */
export const RIGHTS_HINT_BEFORE = `You can change these freely until you publish. After that, you can change your names or wedding date ${IDENTITY_CHANGE_LIMIT} times — fixing a small typo is free.`;

function RightsLine() {
  const { rights } = usePanelContext();
  if (rights.phase === 'before_publish') return <p className={styles.rightsHint}>{RIGHTS_HINT_BEFORE}</p>;
  return null;
}

/** The locked names / date after the first publish: values, a lock, and "Change" (docs/16 §6.3, §11.6). */
function LockedIdentity({ focus, rows, paths }: { focus: 'names' | 'date'; rows: Array<{ label: string; value: string; id?: string }>; paths: string[] }) {
  const { rights, openIdentity, locked, online, issuesAt } = usePanelContext();
  const total = rights.limit + rights.granted;
  const issues = paths.flatMap((p) => issuesAt(p));
  return (
    <div className={styles.locked} data-locked-identity={focus}>
      {issues.length ? (
        <>
          <IssueList issues={issues} />
          <p className={styles.hint}>Use “Change” to fix it. Fixing a small typo is free.</p>
        </>
      ) : null}
      <dl className={styles.lockedList}>
        {rows.map((r) => (
          <div key={r.label} className={styles.lockedRow}>
            <dt className={styles.lockedLabel}>{r.label}</dt>
            <dd className={styles.lockedValue} id={r.id}>
              {r.value || '—'}
            </dd>
          </div>
        ))}
      </dl>
      <div className={styles.lockedFoot}>
        <span className={styles.lockedNote}>
          <Lock size={16} strokeWidth={1.75} aria-hidden="true" />
          <RightsMeter remaining={rights.remaining} total={total} />
        </span>
        {rights.archived ? null : (
          <Button small variant="secondary" icon={Pencil} disabled={locked || !online} onClick={() => openIdentity(focus)} data-change-identity={focus}>
            Change
          </Button>
        )}
      </div>
      {!online ? <p className={styles.hint}>Connect to the internet to change your names or date.</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Names

export function NamesFields({ setup = false }: { setup?: boolean }) {
  const { content, edit, locked, fields, rights } = usePanelContext();
  const partners = content.partners ?? [];
  const counting = rights.phase !== 'before_publish';
  const auto = defaultNameDisplay(partners);
  const withAnd = partners.map((p) => (p.display_name ?? '').trim()).filter(Boolean).join(' and ');
  return (
    <>
      {counting ? (
        <LockedIdentity
          focus="names"
          paths={[...partners.flatMap((_, i) => [`partners.${i}.display_name`, `partners.${i}.full_name`]), 'partners', 'name_display', 'initials']}
          rows={[
            ...partners.map((p, i) => ({
              label: i === 0 ? 'First partner' : 'Second partner',
              value: [p.display_name, p.full_name && p.full_name !== p.display_name ? `(${p.full_name})` : ''].filter(Boolean).join(' '),
            })),
            { label: 'Names as shown', value: content.name_display ?? '' },
            ...(fields.initials ? [{ label: 'Monogram', value: content.initials ?? '' }] : []),
          ]}
        />
      ) : (
        <>
          <RightsLine />
          {partners.map((p, i) => (
            <Group key={i} title={i === 0 ? 'First partner' : 'Second partner'}>
              <TextField
                path={`partners.${i}.display_name`}
                label="First name"
                hint={i === 0 ? 'As your guests know you, e.g. Clara.' : undefined}
                maxLength={CONTENT_LIMITS.name}
                value={p.display_name}
                autoComplete="off"
                onChange={(v) => edit((c) => withPartnerName(c, i, 'display_name', v))}
              />
              <TextField
                path={`partners.${i}.full_name`}
                label="Full name"
                optional
                hint="For the invitation card. Follows the first name until you change it."
                maxLength={CONTENT_LIMITS.fullName}
                value={p.full_name}
                onChange={(v) => edit((c) => withPartnerName(c, i, 'full_name', v))}
              />
            </Group>
          ))}
          {partners.length < 2 ? (
            <Button variant="secondary" icon={Plus} disabled={locked} onClick={() => edit((c) => void c.partners.push({ display_name: '', full_name: null }))}>
              Add a second name
            </Button>
          ) : null}
          <TextField
            path="name_display"
            label="How your names appear"
            hint="On the envelope, the page titles and when the link is shared."
            maxLength={CONTENT_LIMITS.nameDisplay}
            value={content.name_display}
            onChange={(v) => edit((c) => void (c.name_display = v))}
          />
          {partners.length === 2 && auto && withAnd ? (
            <div className={styles.chips} role="group" aria-label="Quick choices for how your names appear">
              {[auto, withAnd].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={cx(styles.chip, content.name_display === v && styles.chipOn)}
                  aria-pressed={content.name_display === v}
                  disabled={locked}
                  onClick={() => edit((c) => void (c.name_display = v))}
                >
                  {v}
                </button>
              ))}
            </div>
          ) : null}
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
        </>
      )}
      {setup ? null : (
        <TextField
          path="host_line"
          label="Host line"
          optional
          hint="For example: Together with their families."
          value={content.host_line}
          onChange={(v) => edit((c) => void (c.host_line = nullIfEmpty(v)))}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Date & time

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

export const zoneCity = (zone: string | undefined) => (zone ? (zone.split('/').pop() ?? zone).replace(/_/g, ' ') : '');

export function DateFields({ theme, setup = false }: { theme: PanelTheme; setup?: boolean }) {
  const { content, edit, locked, rights } = usePanelContext();
  const zones = useTimeZones(content.timezone);
  const [deviceZone, setDeviceZone] = useState<string | null>(null);
  useEffect(() => {
    try {
      setDeviceZone(Intl.DateTimeFormat().resolvedOptions().timeZone || null);
    } catch {
      /* unknown */
    }
  }, []);
  const locale = content.locale;
  const sampleDate = content.date || '2027-06-12';
  const counting = rights.phase !== 'before_publish';
  return (
    <>
      {counting ? (
        <LockedIdentity focus="date" paths={['date']} rows={[{ label: 'Wedding date', value: formatDateLong(content.date, locale) ?? content.date }]} />
      ) : (
        <>
          <RightsLine />
          <DateField path="date" label="Wedding date" value={content.date} locale={locale} onChange={(v) => edit((c) => void (c.date = v))} />
        </>
      )}
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
        hint={`Your countdown and the reply deadline use ${zoneCity(content.timezone) || 'this'} time.`}
        value={content.timezone}
        options={zones.map(zoneOption)}
        onChange={(v) => edit((c) => void (c.timezone = v))}
      />
      {deviceZone && deviceZone !== content.timezone ? (
        <Button small variant="tertiary" icon={Shuffle} disabled={locked} onClick={() => edit((c) => void (c.timezone = deviceZone))}>
          Use {zoneCity(deviceZone)} time (this phone)
        </Button>
      ) : null}
      <Segmented
        id="f-locale"
        label="Date style"
        value={locale}
        disabled={locked}
        options={LOCALES.map((l) => ({ value: l.value, label: l.name, hint: `${formatDate(sampleDate, l.value)} · ${formatTime(content.ceremony_time || '16:00', l.value)}` }))}
        onChange={(v) => edit((c) => void (c.locale = v))}
      />
      {!setup && theme.optionalBlocks.includes('countdown') ? <BlockSwitch block="countdown" /> : null}
    </>
  );
}

function BlockSwitch({ block, label, hint }: { block: OptionalBlockKey; label?: string; hint?: string }) {
  const { content, edit } = usePanelContext();
  return (
    <Switch
      id={`optional-${block}`}
      label={label ?? `Show ${OPTIONAL_BLOCK_LABELS[block].label.toLowerCase()}`}
      hint={hint ?? OPTIONAL_BLOCK_LABELS[block].hint}
      checked={content.optional_blocks?.[block] === true}
      onChange={(on) => edit((c) => void (c.optional_blocks = { ...(c.optional_blocks ?? {}), [block]: on }))}
    />
  );
}

// ---------------------------------------------------------------------------------------------
// Venue

export function VenueFields({ setup = false }: { setup?: boolean }) {
  const { content, edit, photoSlots } = usePanelContext();
  const v = content.venue ?? { name: '', city: '' };
  // In the setup the venue photo comes with the other photos (step 4).
  const venueSlots = setup ? [] : photoSlots.filter((s) => s.source === 'media.venue_image');
  return (
    <>
      <TextField path="venue.name" label="Venue name" maxLength={CONTENT_LIMITS.venueName} value={v.name} onChange={(x) => edit((c) => void (c.venue.name = x))} />
      <TextField path="venue.city" label="City" value={v.city} onChange={(x) => edit((c) => void (c.venue.city = x))} />
      <TextField path="venue.region" label="State or region" optional value={v.region} onChange={(x) => edit((c) => void (c.venue.region = nullIfEmpty(x)))} />
      <TextField path="venue.country" label="Country" optional value={v.country} onChange={(x) => edit((c) => void (c.venue.country = nullIfEmpty(x)))} />
      <TextField path="venue.address" label="Street address" optional value={v.address} onChange={(x) => edit((c) => void (c.venue.address = nullIfEmpty(x)))} />
      <UrlField
        path="urls.map"
        label="Map link"
        optional
        hint="Paste a Google Maps or Apple Maps link to the venue."
        value={content.urls?.map}
        onChange={(x) => edit((c) => void (c.urls = { ...(c.urls ?? {}), map: x }))}
      />
      {venueSlots.length ? (
        <Group title="Venue photo">
          <PhotoSlots slots={venueSlots} compact />
        </Group>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Schedule

type Row = ContentRecord['schedule'][number];

export function ScheduleFields() {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const schedule = content.schedule ?? [];
  const listIssues = issuesAt('schedule');
  const unsorted = listIssues.some((i) => i.code === 'schedule_not_chronological');
  const add = () => edit((c) => void c.schedule.push({ label: '', time: '', location: null }));
  return (
    <>
      <p className={styles.hint}>The order of the day, from the ceremony on. Up to {CONTENT_LIMITS.scheduleItems} events.</p>
      {!schedule.length ? (
        <EmptyState icon={CalendarDays} action={<Button variant="primary" icon={Plus} disabled={locked} onClick={add}>Add an event</Button>}>
          Add the order of the day: ceremony, dinner, dancing.
        </EmptyState>
      ) : null}
      {schedule.map((row, i) => (
        <RepeatableItem<Row>
          key={i}
          index={i}
          count={schedule.length}
          noun="event"
          title={`Event ${i + 1}${row.label ? ` · ${row.label}` : ''}`}
          select={(c) => c.schedule ?? []}
          assign={(c, list) => void (c.schedule = list)}
          data-schedule-row={i}
        >
          <TimeField path={`schedule.${i}.time`} label="Time" value={row.time} locale={content.locale} onChange={(v) => edit((c) => void (c.schedule[i].time = v))} />
          <TextField path={`schedule.${i}.label`} label="What happens" placeholder="Ceremony" value={row.label} onChange={(v) => edit((c) => void (c.schedule[i].label = v))} />
          <TextField path={`schedule.${i}.location`} label="Where" optional value={row.location} onChange={(v) => edit((c) => void (c.schedule[i].location = nullIfEmpty(v)))} />
        </RepeatableItem>
      ))}
      <IssueList issues={listIssues} />
      {/* exactly at the limit; over it (a site saved before the limit) the error above says what to do */}
      {schedule.length === CONTENT_LIMITS.scheduleItems ? (
        <p className={styles.hint} data-schedule-full>
          {schedule.length} of {CONTENT_LIMITS.scheduleItems} events: the most your website can show.
        </p>
      ) : null}
      {schedule.length ? (
        <div className={styles.buttonRow}>
          {schedule.length < CONTENT_LIMITS.scheduleItems ? (
            <Button variant="secondary" icon={Plus} disabled={locked} onClick={add}>
              Add an event
            </Button>
          ) : null}
          {unsorted ? (
            <Button
              variant="secondary"
              disabled={locked}
              onClick={() => edit((c) => void (c.schedule = [...c.schedule].sort((a, b) => (a.time || '99').localeCompare(b.time || '99'))))}
            >
              Sort by time
            </Button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Our Story

type Moment = NonNullable<NonNullable<ContentRecord['story']>['items']>[number];

export function StoryFields() {
  const { content, edit, issuesAt, locked, fields, photoSlots } = usePanelContext();
  const items = content.story?.items ?? [];
  // The design decides how many moments it shows and whether it shows their text.
  const shown = fields.storyItems;
  const storyOn = content.optional_blocks?.our_story === true;
  const storySlots = photoSlots.filter((s) => s.source.startsWith('media.memory_photos.'));
  const add = () =>
    edit((c) => {
      c.story = { ...(c.story ?? {}) };
      c.story.items = [...(c.story.items ?? []), { caption: '' }];
    });
  return (
    <>
      <BlockSwitch block="our_story" label="Show the Our Story page" hint="A page with your story photos and captions." />
      {!storyOn ? <p className={styles.note}>The Our Story page is off: guests do not see it. You can still prepare it here.</p> : null}
      <TextField
        path="story.intro"
        label="Intro line"
        hint="Your wedding date follows this line on the Our Story page, e.g. “… led us to May 15, 2027.”"
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
        <p className={styles.hint}>This design shows {shown === 1 ? 'one moment' : `up to ${shown} moments`}, each with a short caption and a photo.</p>
      ) : (
        <p className={styles.hint}>This design does not show story moments.</p>
      )}
      {shown && !items.length ? (
        <EmptyState icon={Plus} action={<Button variant="primary" icon={Plus} disabled={locked} onClick={add}>Add a moment</Button>}>
          Add up to {shown} moments with a photo and a short title.
        </EmptyState>
      ) : null}
      {items.map((item, i) => (
        <RepeatableItem<Moment>
          key={i}
          index={i}
          count={items.length}
          noun="moment"
          title={`Moment ${i + 1}`}
          select={(c) => c.story?.items ?? []}
          assign={(c, list) => void (c.story = { ...(c.story ?? {}), items: list })}
        >
          {i >= shown ? <p className={styles.note}>This design shows only {shown === 1 ? 'one moment' : `${shown} moments`}: guests do not see this one.</p> : null}
          <TextField path={`story.items.${i}.caption`} label="Caption" maxLength={60} value={item.caption} onChange={(v) => edit((c) => void (c.story!.items![i].caption = v))} />
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
        </RepeatableItem>
      ))}
      <IssueList issues={[...issuesAt('story'), ...issuesAt('story.items')]} />
      {items.length && items.length < shown ? (
        <Button variant="secondary" icon={Plus} disabled={locked} onClick={add}>
          Add a moment
        </Button>
      ) : null}
      {storySlots.length ? (
        <Group title="Story photos">
          <PhotoSlots slots={storySlots} compact />
        </Group>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Details

export function DetailsFields({ optionalBlocks }: { optionalBlocks: readonly OptionalBlockKey[] }) {
  const { content, edit, issuesAt } = usePanelContext();
  const urls = content.urls ?? {};
  const setUrl = (key: 'registry' | 'accommodation') => (v: string | null) =>
    edit((c) => {
      c.urls = { ...(c.urls ?? {}), [key]: v };
    });
  const has = (b: OptionalBlockKey) => optionalBlocks.includes(b);
  return (
    <>
      <Group title="Dress code">
        {has('dress_code') ? <BlockSwitch block="dress_code" label="Show the dress code" hint="Guests see it on the Details page." /> : null}
        <TextField path="dress_code" label="Dress code" optional placeholder="Garden formal" value={content.dress_code} onChange={(v) => edit((c) => void (c.dress_code = nullIfEmpty(v)))} />
      </Group>
      <Group title="Travel & stay">
        {has('travel_stay') ? <BlockSwitch block="travel_stay" label="Show travel & stay" hint="A button to your hotel or accommodation page." /> : null}
        <UrlField path="urls.accommodation" label="Travel & stay link" optional hint="A hotel block or accommodation page for guests." value={urls.accommodation} onChange={setUrl('accommodation')} />
      </Group>
      <Group title="Registry">
        {has('registry') ? <BlockSwitch block="registry" label="Show the registry" hint="A button to your registry." /> : null}
        <UrlField path="urls.registry" label="Registry link" optional value={urls.registry} onChange={setUrl('registry')} />
      </Group>
      {has('guest_policy') ? (
        <Group title="Guest policy">
          <BlockSwitch block="guest_policy" label="Show the guest policy note" hint="The design's short note about who is invited." />
        </Group>
      ) : null}
      <IssueList issues={issuesAt('urls')} />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Questions & answers

type Faq = NonNullable<ContentRecord['faq']>[number];

/** Questions & answers (content faq, G051): add, edit, reorder, remove; shown while optional_blocks.faq is on. */
export function FaqFields() {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const items = content.faq ?? [];
  const on = content.optional_blocks?.faq === true;
  const add = () => edit((c) => void (c.faq = [...(c.faq ?? []), { q: '', a: '' }]));
  return (
    <>
      <Switch
        id="faq-show"
        label="Show on the website"
        hint={on ? 'Guests see these on the Details page.' : 'Turn on to show your questions and answers to guests.'}
        checked={on}
        onChange={(v) => edit((c) => void (c.optional_blocks = { ...(c.optional_blocks ?? {}), faq: v }))}
      />
      <p className={styles.hint}>
        Short answers to what guests often ask, such as parking, children or the plan for rain. Up to {CONTENT_LIMITS.faqItems} questions.
      </p>
      {!items.length ? (
        <EmptyState icon={Plus} action={<Button variant="primary" icon={Plus} disabled={locked} onClick={add} data-add-faq>Add a question</Button>}>
          Answer what guests often ask, such as parking or children.
        </EmptyState>
      ) : null}
      {items.map((item, i) => (
        <RepeatableItem<Faq>
          key={i}
          index={i}
          count={items.length}
          noun="question"
          title={`Question ${i + 1}`}
          select={(c) => c.faq ?? []}
          assign={(c, list) => void (c.faq = list)}
          data-faq-row={i}
        >
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
        </RepeatableItem>
      ))}
      <IssueList issues={issuesAt('faq')} />
      {items.length && items.length < CONTENT_LIMITS.faqItems ? (
        <Button variant="secondary" icon={Plus} disabled={locked} data-add-faq onClick={add}>
          Add a question
        </Button>
      ) : items.length ? (
        <p className={styles.hint}>This section holds {CONTENT_LIMITS.faqItems} questions at most.</p>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// RSVP settings

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
      <h2 className={styles.subTitle}>Questions for your guests</h2>
      <p className={styles.hint}>
        Optional, up to {CONTENT_LIMITS.rsvpQuestions}: for example a meal choice. Guests who accept answer them in the reply form; you see the answers
        under Guests and in the CSV.
      </p>
      {off ? <p className={styles.note}>Replies on the website are off, so guests do not see these questions.</p> : null}
      {questions.map((q, i) => (
        <RepeatableItem<RsvpQuestion>
          key={q.id || i}
          index={i}
          count={questions.length}
          noun="form question"
          title={`Question ${i + 1}`}
          select={(c) => c.rsvp?.questions ?? []}
          assign={(c, list) => void (c.rsvp = { ...c.rsvp, questions: list })}
          data-question-row={i}
        >
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
                  <Button small variant="tertiary" disabled={locked} aria-label={`Remove choice ${j + 1} of question ${i + 1}`} onClick={() => change(i, (x) => void x.options!.splice(j, 1))}>
                    Remove
                  </Button>
                </div>
              ))
            : null}
          <IssueList issues={[...issuesAt(`rsvp.questions.${i}.options`), ...issuesAt(`rsvp.questions.${i}.id`)]} />
          {q.type === 'choice' && (q.options?.length ?? 0) < CONTENT_LIMITS.questionOptions ? (
            <Button small variant="secondary" icon={Plus} disabled={locked} onClick={() => change(i, (x) => void (x.options = [...(x.options ?? []), '']))}>
              Add a choice
            </Button>
          ) : null}
        </RepeatableItem>
      ))}
      <IssueList issues={issuesAt('rsvp.questions')} />
      {questions.length < CONTENT_LIMITS.rsvpQuestions ? (
        <Button variant="secondary" icon={Plus} disabled={locked} onClick={add} data-add-question>
          Add a question
        </Button>
      ) : null}
      {questions.length ? <p className={styles.hint}>Changing or removing a question later keeps the answers you already have.</p> : null}
    </div>
  );
}

export function RsvpFields({ onOpenGuests }: { onOpenGuests: () => void }) {
  const { content, edit, fields } = usePanelContext();
  const deadline = content.rsvp?.deadline;
  const long = formatDateLong(deadline, content.locale);
  return (
    <>
      <Switch
        id="rsvp-accept"
        label="Accept replies on the website"
        hint="Turn off if you collect replies another way; the form then shows as closed."
        checked={content.rsvp?.method !== 'none'}
        onChange={(on) => edit((c) => void (c.rsvp = { ...c.rsvp, method: on ? null : 'none' }))}
      />
      <DateField
        path="rsvp.deadline"
        label="Reply by"
        value={deadline}
        locale={content.locale}
        display={long ? `Replies close at the end of ${long} (${zoneCity(content.timezone)} time).` : undefined}
        onChange={(v) => edit((c) => void (c.rsvp = { ...c.rsvp, deadline: v }))}
      />
      {fields.rsvpQuestions ? <QuestionFields /> : null}
      <Button variant="tertiary" onClick={onOpenGuests}>
        See the replies under Guests
      </Button>
    </>
  );
}
