'use client';
// "After the wedding" (G075, K28): thank-you mode settings, folded at the end of Day & place (K29: no 7th page).
// Mode Automatic (default: from 00:00 the day after the wedding, the site's time zone) / On now / Off; the thank-you
// title and message; an optional photo (it takes the place of the portrait on the card; without one the design shows
// its own decoration); the Day page kept or hidden; a preview of the thank-you page. Everything is content (autosave,
// the "Unpublished changes" bar and Review count it like any other edit); the rule itself is lib/content/thank-you.ts.

import { Eye, Heart } from 'lucide-react';
import { CONTENT_LIMITS } from '../../lib/content/limits.ts';
import { formatDateLong } from '../../lib/content/format.ts';
import { THANK_YOU_DEFAULT_TITLE, thankYouDay, thankYouMode, thankYouState, withThankYou } from '../../lib/content/thank-you.ts';
import type { ThankYou, ThankYouMode } from '../../lib/content/types.ts';
import { openingPlace, type PanelPhotoSlot } from '../../lib/panel/model.ts';
import { IssueList, TextField, usePanelContext } from './fields.tsx';
import { PhotoSlots } from './PhotosSection.tsx';
import { zoneCity } from './sections.tsx';
import { Button, Disclosure, Segmented } from './ui.tsx';
import styles from './panel.module.css';
import { msg, t } from '../../lib/i18n/client.ts';

export const THANK_YOU_MODE_LABELS: Record<ThankYouMode, string> = { auto: msg('Automatic'), on: msg('On now'), off: msg('Off') };

export function ThankYouFields({ slot, defaultOpen = false, onPreview }: { slot: PanelPhotoSlot | null; defaultOpen?: boolean; onPreview: () => void }) {
  const { content, edit, locked, issuesAt, rights, opening } = usePanelContext();
  const ty = content.thank_you ?? {};
  const mode = thankYouMode(content);
  const state = thankYouState(content);
  // the day after the wedding, as guests' calendars read it ("Sunday, June 13, 2027")
  const day = formatDateLong(thankYouDay(content), content.locale);
  const city = zoneCity(content.timezone);
  const set = (patch: Partial<ThankYou>) => edit((c) => void withThankYou(c, patch));
  const until = rights.onlineUntil ? formatDateLong(rights.onlineUntil, content.locale) : null;
  const now =
    mode === 'on'
      ? t('Guests see your thank-you page now. Replies are closed.')
      : mode === 'off'
        ? until
          ? t('Guests keep seeing the invitation until your website closes after {date}.', { date: until })
          : t('Guests keep seeing the invitation.')
        : state.on
          ? t('Your wedding day has passed: guests see your thank-you page. Replies are closed.')
          : day
            ? t('On {date} at midnight ({city} time) guests start seeing your thank-you page, and replies close.', { date: day, city })
            : t('The day after your wedding guests start seeing your thank-you page, and replies close.');
  return (
    <Disclosure id="thank-you" title={t('After the wedding')} status={t(THANK_YOU_MODE_LABELS[mode])} icon={Heart} defaultOpen={defaultOpen}>
      <div className={styles.stack} data-thank-you-settings>
        <p className={styles.hint}>
          {t('When your wedding is over, the same link becomes a thank-you page: your note, a photo, your names and the date. The {place} still opens; your story stays.', {
            place: t(openingPlace(opening)),
          })}
        </p>
        <Segmented<ThankYouMode>
          id="f-thank_you-mode"
          label={t('Thank-you mode')}
          value={mode}
          disabled={locked}
          stacked
          options={[
            { value: 'auto', label: t('Automatic'), hint: day ? t('From {date}', { date: day }) : t('From the day after your wedding') },
            { value: 'on', label: t('On now'), hint: t('Show the thank-you page now') },
            { value: 'off', label: t('Off'), hint: t('Keep the invitation') },
          ]}
          onChange={(v) => set({ mode: v })}
        />
        <p className={styles.thankYouNow} role="status" data-thank-you-now={state.on ? 'on' : 'off'}>
          {now}
        </p>
        <TextField
          path="thank_you.title"
          label={t('Title')}
          optional
          placeholder={THANK_YOU_DEFAULT_TITLE}
          hint={t('Empty: “{title}”.', { title: THANK_YOU_DEFAULT_TITLE })}
          maxLength={CONTENT_LIMITS.thankYouTitle}
          value={ty.title}
          onChange={(v) => set({ title: v.trim() ? v : null })}
        />
        <TextField
          path="thank_you.message"
          label={t('Your message')}
          optional
          multiline
          rows={4}
          hint={t('A few words for your guests, on your thank-you card.')}
          maxLength={CONTENT_LIMITS.thankYouMessage}
          value={ty.message}
          onChange={(v) => set({ message: v.trim() ? v : null })}
        />
        {slot ? (
          <div className={styles.field} data-thank-you-photo>
            <p className={styles.label}>
              {t('Photo')} <span className={styles.optional}>{t('(optional)')}</span>
            </p>
            <p className={styles.hint}>{t('It takes the place of your portrait on the card. Without one, the card shows the design’s own decoration.')}</p>
            <PhotoSlots slots={[slot]} compact />
          </div>
        ) : null}
        <Segmented<'keep' | 'hide'>
          id="f-thank_you-details"
          label={t('The Day page')}
          value={ty.details === 'hide' ? 'hide' : 'keep'}
          disabled={locked}
          options={[
            { value: 'keep', label: t('Keep it'), hint: t('Schedule and venue, as a keepsake') },
            { value: 'hide', label: t('Hide it'), hint: t('Guests no longer see it') },
          ]}
          onChange={(v) => set({ details: v })}
        />
        <IssueList issues={issuesAt('thank_you')} />
        <Button icon={Eye} onClick={onPreview} data-preview-thank-you>
          {t('Preview the thank-you page')}
        </Button>
      </div>
    </Disclosure>
  );
}
