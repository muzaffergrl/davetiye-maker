'use client';
// The panel's section editors (docs/16 §4.3): Names, Date & time, Venue, Schedule, Our Story, Details,
// Questions & answers, RSVP settings. Photos live in PhotosSection.tsx; replies in views.tsx (Guests).
// Every value is written into the content record (the single source the theme renders from).
// Each on/off switch sits next to the content it controls (no separate "Optional sections").

import { CalendarDays, Lock, Pencil, Plus, Shuffle } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { formatDate, formatDateLong, formatTime } from '../../lib/content/format.ts';
import type { ContentRecord, Locale } from '../../lib/content/types.ts';
import { CONTENT_LIMITS } from '../../lib/content/limits.ts';
import { defaultNameDisplay, OPTIONAL_BLOCK_LABELS, openingPlace, withPartnerName, type OptionalBlockKey, type PanelTheme } from '../../lib/panel/model.ts';
import { beforePublishText, DATE_FREE_DAYS, IDENTITY_CHANGE_LIMIT, TYPO_MAX_DISTANCE } from '../../lib/panel/rights.ts';
import { DateField, Group, IssueList, RepeatableItem, SelectField, Switch, TextField, TimeField, UrlField, useDeviceZone, usePanelContext } from './fields.tsx';
import { MusicFields } from './MusicFields.tsx';
import { PhotoSlots } from './PhotosSection.tsx';
import { MapFields, venueMapLinkChange } from './MapFields.tsx';
import { RsvpFormFields } from './RsvpFormFields.tsx';
import type { PanelCopyEntry } from '../../lib/theme/copy.ts';
import { Button, cx, Disclosure, EmptyState, RightsMeter, Segmented } from './ui.tsx';
import styles from './panel.module.css';
import { t, tn, uiLang } from '../../lib/i18n/client.ts';

const nullIfEmpty = (v: string): string | null => (v.trim() ? v : null);

/** The rule as the buyer reads it before the first publish (docs/16 §11.7). */
export const RIGHTS_HINT_BEFORE = beforePublishText(IDENTITY_CHANGE_LIMIT);

/**
 * G100 (docs/18 §1): the rule before the first publish in one line — "After publishing you can change names or the date
 * 3 times." — and "Learn more" for the details (what is free, undo). The number comes from lib/panel/rights.ts.
 */
export function RightsNote() {
  const { rights } = usePanelContext();
  const [open, setOpen] = useState(false);
  const moreId = useId();
  if (rights.phase !== 'before_publish') return null;
  const total = rights.limit + rights.granted;
  return (
    <div className={styles.rightsNote} data-rights-note>
      <p className={styles.rightsNoteLine}>
        <span>{tn(total, 'After publishing you can change names or the date {n} time.', 'After publishing you can change names or the date {n} times.')}</span>{' '}
        <button type="button" className={styles.rightsMore} aria-expanded={open} aria-controls={moreId} onClick={() => setOpen((v) => !v)} data-rights-more>
          {t('Learn more')}
        </button>
      </p>
      <div id={moreId} className={styles.rightsNoteMore} hidden={!open}>
        <p>{t('Until you publish, you can change them as often as you like.')}</p>
        <p>
          {tn(
            total,
            'After you publish, you have {n} change in total for your names, monogram and wedding date (changing several in one go counts once).',
            'After you publish, you have {n} changes in total for your names, monogram and wedding date (changing several in one go counts once).',
          )}
        </p>
        <p>
          {t('Always free: fixing a small typo (up to {letters} letters in a name), adding a surname, and moving your date by up to {days} days.', {
            letters: TYPO_MAX_DISTANCE,
            days: DATE_FREE_DAYS,
          })}
        </p>
        <p>{t('Changed something by mistake? Undo it right away (before you publish it, or within 10 minutes) and you get the change back.')}</p>
      </div>
    </div>
  );
}

/**
 * The locked names / date after the first publish: values, a lock, and "Change" (docs/16 §6.3, §11.6). K29: this is the
 * one place the name & date changes left are shown (Us and Day & place pages), never as badges on the Edit list.
 */
function LockedIdentity({ focus, rows, paths }: { focus: 'names' | 'date'; rows: Array<{ label: string; value: string; id?: string }>; paths: string[] }) {
  const { rights, openIdentity, locked, online, issuesAt, isSample } = usePanelContext();
  const total = rights.limit + rights.granted;
  const issues = paths.flatMap((p) => issuesAt(p));
  // G100: a locked value that is still the design's sample (the date) counts in the page's sample line; its jump lands on
  // "Change" here.
  const sample = paths.find((p) => isSample(p));
  return (
    <div className={cx(styles.locked, sample && styles.lockedSample)} data-locked-identity={focus} data-rights-card data-sample-field={sample}>
      {issues.length ? (
        <>
          <IssueList issues={issues} />
          <p className={styles.hint}>{t('Use “Change” to fix it. Fixing a small typo is free.')}</p>
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
            {t('Change')}
          </Button>
        )}
      </div>
      {rights.archived ? (
        <p className={styles.hint}>{t('Your website is archived: names and date can no longer be changed.')}</p>
      ) : (
        // G087 (G079 note): say once why these are locked, next to the lock.
        <p className={styles.hint} data-locked-why="">
          {t('Locked since you published, so they never change by accident. Tap Change to update them; small fixes are free.')}
        </p>
      )}
      {!online && !rights.archived ? <p className={styles.hint}>{t('Connect to the internet to change your names or date.')}</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Names

export function NamesFields({ setup = false }: { setup?: boolean }) {
  const { content, edit, locked, fields, rights, opening } = usePanelContext();
  const partners = content.partners ?? [];
  const counting = rights.phase !== 'before_publish';
  const auto = defaultNameDisplay(partners);
  // The couple's own names line (content, in English like the website): not translated.
  const withAnd = partners.map((p) => (p.display_name ?? '').trim()).filter(Boolean).join(' and ');
  return (
    <>
      {counting ? (
        <LockedIdentity
          focus="names"
          paths={[...partners.flatMap((_, i) => [`partners.${i}.display_name`, `partners.${i}.full_name`]), 'partners', 'name_display', 'initials']}
          rows={[
            ...partners.map((p, i) => ({
              label: i === 0 ? t('First partner') : t('Second partner'),
              value: [p.display_name, p.full_name && p.full_name !== p.display_name ? `(${p.full_name})` : ''].filter(Boolean).join(' '),
            })),
            { label: t('Names as shown'), value: content.name_display ?? '' },
            ...(fields.initials ? [{ label: t('Monogram'), value: content.initials ?? '' }] : []),
          ]}
        />
      ) : (
        <>
          {/* First run (G100): only the two first names here; the setup puts the date right under them and the optional full
              names and the change rule after it (Setup.tsx), so names and date are the first screen. */}
          {setup ? null : <RightsNote />}
          {setup ? (
            <SetupNames />
          ) : (
            partners.map((p, i) => (
            <Group key={i} title={i === 0 ? t('First partner') : t('Second partner')}>
              <TextField
                path={`partners.${i}.display_name`}
                label={t('First name')}
                hint={i === 0 ? t('As your guests know you, e.g. Clara.') : undefined}
                maxLength={CONTENT_LIMITS.name}
                value={p.display_name}
                autoComplete="off"
                onChange={(v) => edit((c) => withPartnerName(c, i, 'display_name', v))}
              />
              <TextField
                path={`partners.${i}.full_name`}
                label={t('Full name')}
                optional
                hint={t('For the invitation card. Empty: the card shows the first name. Adding a surname later is free.')}
                maxLength={CONTENT_LIMITS.fullName}
                value={p.full_name}
                onChange={(v) => edit((c) => withPartnerName(c, i, 'full_name', v))}
              />
            </Group>
            ))
          )}
          {partners.length < 2 ? (
            <Button variant="secondary" icon={Plus} disabled={locked} onClick={() => edit((c) => void c.partners.push({ display_name: '', full_name: null }))}>
              {t('Add a second name')}
            </Button>
          ) : null}
          {/* G100 (docs/18 §1): the first-run step is the names and the date only; the names line follows the first names
              (withPartnerName) and stays one tap away under Edit → Us. */}
          {setup ? null : (
          <>
          <TextField
            path="name_display"
            label={t('How your names appear')}
            hint={t('On the {place}, the page titles and when the link is shared.', { place: t(openingPlace(opening)) })}
            maxLength={CONTENT_LIMITS.nameDisplay}
            value={content.name_display}
            onChange={(v) => edit((c) => void (c.name_display = v))}
          />
          {partners.length === 2 && auto && withAnd ? (
            <div className={styles.chips} role="group" aria-label={t('Quick choices for how your names appear')}>
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
          </>
          )}
          {/* Only when the design shows a monogram (a field that changes nothing would mislead). It follows the names until
              edited, so the first-run setup leaves it for later (K29). */}
          {fields.initials && !setup ? (
            <TextField
              path="initials"
              label={t('Monogram')}
              hint={t('Up to 9 characters, e.g. C&J.')}
              maxLength={9}
              value={content.initials}
              onChange={(v) => edit((c) => void (c.initials = v))}
            />
          ) : null}
        </>
      )}
    </>
  );
}

/**
 * First run (K29): the two first names; the full names for the invitation card fold away (SetupFullNames, after the date).
 * Same fields and ids as the editor (#f-partners-<n>-display_name / -full_name).
 */
function SetupNames() {
  const { content, edit } = usePanelContext();
  const partners = content.partners ?? [];
  return (
    <>
      {partners.map((p, i) => (
        <TextField
          key={i}
          path={`partners.${i}.display_name`}
          label={i === 0 ? t('First name') : t('Partner’s first name')}
          hint={i === 0 ? t('As your guests know you, e.g. Clara.') : undefined}
          maxLength={CONTENT_LIMITS.name}
          value={p.display_name}
          autoComplete="off"
          onChange={(v) => edit((c) => withPartnerName(c, i, 'display_name', v))}
        />
      ))}
    </>
  );
}

/** First run: the full names for the invitation card — folded, optional (open when one is filled in). */
export function SetupFullNames() {
  const { content, edit } = usePanelContext();
  const partners = content.partners ?? [];
  const anyFull = partners.some((p) => (p.full_name ?? '').trim());
  return (
    <>
      <Disclosure id="full-names" title={t('Full names for the invitation card')} status={t('Optional')} defaultOpen={anyFull}>
        <div className={styles.stack}>
          <p className={styles.hint}>{t('Empty: the card shows the first names. Adding a surname later is free.')}</p>
          {partners.map((p, i) => (
            <TextField
              key={i}
              path={`partners.${i}.full_name`}
              label={p.display_name ? t('Full name of {name}', { name: p.display_name }) : i === 0 ? t('Full name (first partner)') : t('Full name (partner)')}
              optional
              maxLength={CONTENT_LIMITS.fullName}
              value={p.full_name}
              onChange={(v) => edit((c) => withPartnerName(c, i, 'full_name', v))}
            />
          ))}
        </div>
      </Disclosure>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Date & time

/**
 * Date style: only "month first" (US) and "day first" (UK, Canada, Australia) look different on the website
 * (lib/content/format.ts), so the panel offers those two (G060-fix: four country names, three of them identical).
 */
type DateStyle = 'en-US' | 'day';

/** This phone's English locale when it is one the website supports, else null (docs/16 §5.3). */
function phoneLocale(): Locale | null {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const l of langs) {
      const m = /^en-(US|GB|CA|AU)\b/i.exec(l ?? '');
      if (m) return `en-${m[1].toUpperCase()}` as Locale;
    }
  } catch {
    /* no navigator */
  }
  return null;
}

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
  const group = i > 0 ? zone.slice(0, i) : t('Other');
  const label = (i > 0 ? zone.slice(i + 1) : zone).replace(/_/g, ' ').replace(/\//g, ' – ');
  return { value: zone, label, group };
}

export const zoneCity = (zone: string | undefined) => (zone ? (zone.split('/').pop() ?? zone).replace(/_/g, ' ') : '');

export function DateFields({ theme, setup = false }: { theme: PanelTheme; setup?: boolean }) {
  const { content, edit, locked, rights, isSample, issuesAt, jump } = usePanelContext();
  const zones = useTimeZones(content.timezone);
  const deviceZone = useDeviceZone();
  const [zoneOpen, setZoneOpen] = useState(false);
  // First run (G060-fix, docs/16 §5.3): while the date and the time zone are still the design's sample, the time zone
  // and the date style follow this phone (a UK couple must not get a New York ceremony time in guests' calendars).
  // G135: /start already stores the phone's zone with the claim; then only the date style is left to follow here.
  // Sites the shop starts in the admin keep the design's zone until the buyer's own phone opens this step.
  const sample = theme.sample;
  const followed = useRef(false);
  useEffect(() => {
    if (!setup || locked || followed.current || !deviceZone || !sample) return;
    const zoneIsSample = content.timezone === sample.timezone;
    if (content.date !== sample.date || (!zoneIsSample && content.timezone !== deviceZone)) return;
    followed.current = true;
    const loc = phoneLocale();
    const zone = zoneIsSample && deviceZone !== content.timezone ? deviceZone : null;
    const style = loc && content.locale === sample.locale && loc !== content.locale ? loc : null;
    if (zone || style)
      edit((c) => {
        if (zone) c.timezone = zone;
        if (style) c.locale = style;
      });
  }, [setup, locked, deviceZone, sample, content.date, content.timezone, content.locale, edit]);
  const locale = content.locale;
  const sampleDate = content.date || '2027-06-12';
  const counting = rights.phase !== 'before_publish';
  const fromPhone = setup && !zoneOpen && deviceZone !== null && content.timezone === deviceZone;
  const time = content.ceremony_time || '16:00';
  // One sentence for translators; the city sits where {city} is.
  const [zoneBefore, zoneAfter = ''] = t('We’ll use {city} time, from your phone.').split('{city}');
  const moreNeedsAttention = isSample('timezone') || issuesAt('timezone').length > 0 || issuesAt('locale').length > 0;
  const zoneSelect = (
    <>
      <SelectField
        path="timezone"
        label={t('Time zone of the wedding')}
        hint={
          zoneCity(content.timezone)
            ? t('The countdown, the reply deadline and guests’ calendars use {city} time.', { city: zoneCity(content.timezone) })
            : t('The countdown, the reply deadline and guests’ calendars use this time.')
        }
        value={content.timezone}
        options={zones.map(zoneOption)}
        onChange={(v) => edit((c) => void (c.timezone = v))}
      />
      {deviceZone && deviceZone !== content.timezone ? (
        <Button small variant="tertiary" icon={Shuffle} disabled={locked} onClick={() => edit((c) => void (c.timezone = deviceZone))}>
          {t('Use {city} time (this phone)', { city: zoneCity(deviceZone) })}
        </Button>
      ) : null}
    </>
  );
  return (
    <>
      {counting ? (
        <LockedIdentity focus="date" paths={['date']} rows={[{ label: t('Wedding date'), value: formatDateLong(content.date, locale) ?? content.date }]} />
      ) : (
        <>
          {/* In the setup the rule is shown once, on step 1 and before publishing (G060-fix). */}
          {setup ? null : <RightsNote />}
          <DateField path="date" label={t('Wedding date')} value={content.date} locale={locale} onChange={(v) => edit((c) => void (c.date = v))} />
        </>
      )}
      <TimeField
        path="ceremony_time"
        label={t('Ceremony time')}
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
      {fromPhone ? (
        <div className={styles.field} data-zone-from-phone>
          <p className={styles.label}>{t('Time zone of the wedding')}</p>
          <p className={styles.zoneLine}>
            <span>
              {zoneBefore}
              <strong>{zoneCity(content.timezone)}</strong>
              {zoneAfter}
            </span>
            <Button small variant="tertiary" disabled={locked} onClick={() => setZoneOpen(true)} data-change-zone>
              {t('Change')}
            </Button>
          </p>
          <p className={styles.hint}>{t('The countdown, the reply deadline and guests’ calendars use it.')}</p>
        </div>
      ) : setup ? (
        zoneSelect
      ) : (
        // G087 (G079 note "Day & place has ~20 fields"): the rarely changed settings sit one tap away. Opens by itself
        // when one of them still needs attention (sample time zone, an issue), so a jump from Home lands on it.
        <Disclosure
          id="date-more"
          title={t('More options')}
          status={`${zoneCity(content.timezone) || t('Time zone')} · ${locale === 'en-US' ? t('Month first') : t('Day first')}`}
          defaultOpen={moreNeedsAttention}
          openRequest={jump && (jump.path === 'timezone' || jump.path === 'locale') ? jump : null}
        >
          {zoneSelect}
          <Segmented<DateStyle>
            id="f-locale"
            label={t('Date style')}
            value={locale === 'en-US' ? 'en-US' : 'day'}
            disabled={locked}
            options={[
              { value: 'en-US', label: t('Month first'), hint: `${formatDate(sampleDate, 'en-US')} · ${formatTime(time, 'en-US')}` },
              { value: 'day', label: t('Day first'), hint: `${formatDate(sampleDate, 'en-GB')} · ${formatTime(time, 'en-GB')}` },
            ]}
            onChange={(v) => edit((c) => void (c.locale = v === 'en-US' ? 'en-US' : c.locale !== 'en-US' ? c.locale : 'en-GB'))}
          />
          {theme.optionalBlocks.includes('countdown') ? <BlockSwitch block="countdown" /> : null}
        </Disclosure>
      )}
    </>
  );
}
/** A block's name inside "Show …": lower case like before, except in German (nouns keep their capital). */
const blockName = (label: string) => (uiLang() === 'de' ? t(label) : t(label).toLowerCase());

export function BlockSwitch({ block, label, hint }: { block: OptionalBlockKey; label?: string; hint?: string }) {
  const { content, edit } = usePanelContext();
  return (
    <Switch
      id={`optional-${block}`}
      label={label ?? t('Show {thing}', { thing: blockName(OPTIONAL_BLOCK_LABELS[block].label) })}
      hint={hint ?? t(OPTIONAL_BLOCK_LABELS[block].hint)}
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
      <TextField path="venue.name" label={t('Venue name')} maxLength={CONTENT_LIMITS.venueName} value={v.name} onChange={(x) => edit((c) => void (c.venue.name = x))} />
      <TextField path="venue.city" label={t('City')} value={v.city} onChange={(x) => edit((c) => void (c.venue.city = x))} />
      <TextField path="venue.region" label={t('State or region')} optional value={v.region} onChange={(x) => edit((c) => void (c.venue.region = nullIfEmpty(x)))} />
      <TextField path="venue.country" label={t('Country')} optional value={v.country} onChange={(x) => edit((c) => void (c.venue.country = nullIfEmpty(x)))} />
      <TextField path="venue.address" label={t('Street address')} optional value={v.address} onChange={(x) => edit((c) => void (c.venue.address = nullIfEmpty(x)))} />
      <UrlField
        path="urls.map"
        label={t('Map link')}
        optional
        hint={t('Paste a Google Maps or Apple Maps link to the venue.')}
        value={content.urls?.map}
        onChange={(x) => edit((c) => venueMapLinkChange(c, x))}
      />
      {setup ? null : <MapFields />}
      {venueSlots.length ? (
        <Group title={t('Venue photo')}>
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
      <p className={styles.hint}>{t('The order of the day, from the ceremony on. Up to {max} events.', { max: CONTENT_LIMITS.scheduleItems })}</p>
      {!schedule.length ? (
        <EmptyState icon={CalendarDays} action={<Button variant="primary" icon={Plus} disabled={locked} onClick={add}>{t('Add an event')}</Button>}>
          {t('Add the order of the day: ceremony, dinner, dancing.')}
        </EmptyState>
      ) : null}
      {schedule.map((row, i) => (
        <RepeatableItem<Row>
          key={i}
          index={i}
          count={schedule.length}
          noun="event"
          title={`${t('Event {n}', { n: i + 1 })}${row.label ? ` · ${row.label}` : ''}`}
          select={(c) => c.schedule ?? []}
          assign={(c, list) => void (c.schedule = list)}
          data-schedule-row={i}
        >
          <TimeField path={`schedule.${i}.time`} label={t('Time')} value={row.time} locale={content.locale} onChange={(v) => edit((c) => void (c.schedule[i].time = v))} />
          <TextField path={`schedule.${i}.label`} label={t('What happens')} placeholder={t('Ceremony')} value={row.label} onChange={(v) => edit((c) => void (c.schedule[i].label = v))} />
          <TextField path={`schedule.${i}.location`} label={t('Where')} optional value={row.location} onChange={(v) => edit((c) => void (c.schedule[i].location = nullIfEmpty(v)))} />
        </RepeatableItem>
      ))}
      <IssueList issues={listIssues} />
      {/* exactly at the limit; over it (a site saved before the limit) the error above says what to do */}
      {schedule.length === CONTENT_LIMITS.scheduleItems ? (
        <p className={styles.hint} data-schedule-full>
          {t('{count} of {max} events: the most your website can show.', { count: schedule.length, max: CONTENT_LIMITS.scheduleItems })}
        </p>
      ) : null}
      {schedule.length ? (
        <div className={styles.buttonRow}>
          {schedule.length < CONTENT_LIMITS.scheduleItems ? (
            <Button variant="secondary" icon={Plus} disabled={locked} onClick={add}>
              {t('Add an event')}
            </Button>
          ) : null}
          {unsorted ? (
            <Button
              variant="secondary"
              disabled={locked}
              onClick={() => edit((c) => void (c.schedule = [...c.schedule].sort((a, b) => (a.time || '99').localeCompare(b.time || '99'))))}
            >
              {t('Sort by time')}
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
      <BlockSwitch block="our_story" label={t('Show the Our Story page')} hint={t('A page with your story photos and captions.')} />
      {!storyOn ? <p className={styles.note}>{t('The Our Story page is off: guests do not see it. You can still prepare it here.')}</p> : null}
      <TextField
        path="story.intro"
        label={t('Intro line')}
        hint={t('Your wedding date follows this line on the Our Story page, e.g. “… led us to May 15, 2027.”')}
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
          {tn(shown, 'This design shows one moment, each with a short caption and a photo.', 'This design shows up to {n} moments, each with a short caption and a photo.')}
        </p>
      ) : (
        <p className={styles.hint}>{t('This design does not show story moments.')}</p>
      )}
      {shown && !items.length ? (
        <EmptyState icon={Plus} action={<Button variant="primary" icon={Plus} disabled={locked} onClick={add}>{t('Add a moment')}</Button>}>
          {t('Add up to {n} moments with a photo and a short title.', { n: shown })}
        </EmptyState>
      ) : null}
      {items.map((item, i) => (
        <RepeatableItem<Moment>
          key={i}
          index={i}
          count={items.length}
          noun="moment"
          title={t('Moment {n}', { n: i + 1 })}
          select={(c) => c.story?.items ?? []}
          assign={(c, list) => void (c.story = { ...(c.story ?? {}), items: list })}
        >
          {i >= shown ? <p className={styles.note}>{tn(shown, 'This design shows only one moment: guests do not see this one.', 'This design shows only {n} moments: guests do not see this one.')}</p> : null}
          <TextField path={`story.items.${i}.caption`} label={t('Caption')} maxLength={60} value={item.caption} onChange={(v) => edit((c) => void (c.story!.items![i].caption = v))} />
          {fields.storyText ? (
            <TextField
              path={`story.items.${i}.text`}
              label={t('A few words')}
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
          {t('Add a moment')}
        </Button>
      ) : null}
      {storySlots.length ? (
        <Group title={t('Story photos')}>
          <PhotoSlots slots={storySlots} compact />
        </Group>
      ) : null}
      <MusicFields />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Details

export function DetailsFields({ optionalBlocks }: { optionalBlocks: readonly OptionalBlockKey[] }) {
  const { content, edit, issuesAt } = usePanelContext();
  const urls = content.urls ?? {};
  const setUrl = (key: 'registry') => (v: string | null) =>
    edit((c) => {
      c.urls = { ...(c.urls ?? {}), [key]: v };
    });
  const has = (b: OptionalBlockKey) => optionalBlocks.includes(b);
  return (
    <>
      {/* Not part of the names (G060-fix): it is free text, so it never uses a name change and never marks Names as "sample". */}
      <TextField
        path="host_line"
        label={t('Host line')}
        optional
        hint={t('A line above your names on the invitation, for example: Together with their families.')}
        value={content.host_line}
        onChange={(v) => edit((c) => void (c.host_line = nullIfEmpty(v)))}
      />
      <Group title={t('Dress code')}>
        {has('dress_code') ? <BlockSwitch block="dress_code" label={t('Show the dress code')} hint={t('Guests see it on the Details page.')} /> : null}
        <TextField path="dress_code" label={t('Dress code')} optional placeholder={t('Garden formal')} value={content.dress_code} onChange={(v) => edit((c) => void (c.dress_code = nullIfEmpty(v)))} />
      </Group>
      <Group title={t('Registry')}>
        {has('registry') ? <BlockSwitch block="registry" label={t('Show the registry')} hint={t('A button to your registry.')} /> : null}
        <UrlField path="urls.registry" label={t('Registry link')} optional value={urls.registry} onChange={setUrl('registry')} />
      </Group>
      {has('guest_policy') ? (
        <Group title={t('Guest policy')}>
          <BlockSwitch block="guest_policy" label={t('Show the guest policy note')} hint={t("The design's short note about who is invited.")} />
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
        label={t('Show on the website')}
        hint={on ? t('Guests see these on the Details page.') : t('Turn on to show your questions and answers to guests.')}
        checked={on}
        onChange={(v) => edit((c) => void (c.optional_blocks = { ...(c.optional_blocks ?? {}), faq: v }))}
      />
      <p className={styles.hint}>
        {t('Short answers to what guests often ask, such as parking, children or the plan for rain. Up to {max} questions.', { max: CONTENT_LIMITS.faqItems })}
      </p>
      {!items.length ? (
        <EmptyState icon={Plus} action={<Button variant="primary" icon={Plus} disabled={locked} onClick={add} data-add-faq>{t('Add a question')}</Button>}>
          {t('Answer what guests often ask, such as parking or children.')}
        </EmptyState>
      ) : null}
      {items.map((item, i) => (
        <RepeatableItem<Faq>
          key={i}
          index={i}
          count={items.length}
          noun="question"
          title={t('Question {n}', { n: i + 1 })}
          select={(c) => c.faq ?? []}
          assign={(c, list) => void (c.faq = list)}
          data-faq-row={i}
        >
          <TextField
            path={`faq.${i}.q`}
            label={t('Question')}
            maxLength={CONTENT_LIMITS.faqQuestion}
            placeholder={t('Is there parking at the venue?')}
            value={item.q}
            onChange={(v) => edit((c) => void (c.faq![i].q = v))}
          />
          <TextField
            path={`faq.${i}.a`}
            label={t('Answer')}
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
          {t('Add a question')}
        </Button>
      ) : items.length ? (
        <p className={styles.hint}>{t('This section holds {max} questions at most.', { max: CONTENT_LIMITS.faqItems })}</p>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// RSVP settings

export function RsvpFields({ onOpenGuests, copy = [] }: { onOpenGuests: () => void; copy?: readonly PanelCopyEntry[] }) {
  const { content, edit, fields } = usePanelContext();
  const deadline = content.rsvp?.deadline;
  const long = formatDateLong(deadline, content.locale);
  return (
    <>
      <Switch
        id="rsvp-accept"
        label={t('Accept replies on the website')}
        hint={t('Turn off if you collect replies another way; the form then shows as closed.')}
        checked={content.rsvp?.method !== 'none'}
        onChange={(on) => edit((c) => void (c.rsvp = { ...c.rsvp, method: on ? null : 'none' }))}
      />
      <DateField
        path="rsvp.deadline"
        label={t('Reply by')}
        value={deadline}
        locale={content.locale}
        display={long ? t('Replies close at the end of {date} ({city} time).', { date: long, city: zoneCity(content.timezone) }) : undefined}
        onChange={(v) => edit((c) => void (c.rsvp = { ...c.rsvp, deadline: v }))}
      />
      {/* G128: the reply form's fields (labels, required / optional) and the couple's own questions */}
      <RsvpFormFields copy={copy} questionsShown={fields.rsvpQuestions} />
      <Button variant="tertiary" onClick={onOpenGuests}>
        {t('See the replies under Guests')}
      </Button>
    </>
  );
}
