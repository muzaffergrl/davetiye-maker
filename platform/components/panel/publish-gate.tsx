'use client';
// What the first publish shows, in the setup's last step and in the editor's "Before you publish" sheet: the rules
// (docs/16 §11.7) and the sample-date gate (G181: out of Setup.tsx, so the editor's sheet does not load the wizard).

import { CalendarDays, TriangleAlert } from 'lucide-react';
import { formatDate, formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import { sampleDateLeft } from '../../lib/panel/model.ts';
import { ARCHIVE_AFTER_MONTHS, ARCHIVE_TEXT, changesRuleText, FREE_CHANGES_TEXT, IDENTITY_CHANGE_LIMIT, UNDO_TEXT, type RightsView } from '../../lib/panel/rights.ts';
import { Button } from './ui.tsx';
import styles from './panel.module.css';
import { t } from '../../lib/i18n/client.ts';

/** The rules shown before EVERY first publish (wizard step 6 and the editor's first Publish), docs/16 §11.7. */
export function RulesBox({ rights, locale, total = IDENTITY_CHANGE_LIMIT }: { rights: RightsView; locale: string; total?: number }) {
  const until = rights.onlineUntil ? formatDate(rights.onlineUntil, locale) : null;
  return (
    <div className={styles.rules} data-rules>
      <h3 className={styles.rulesTitle}>{t('Good to know before you publish')}</h3>
      <ul>
        <li>{changesRuleText(total)}</li>
        <li>{t(FREE_CHANGES_TEXT)}</li>
        <li>{t(UNDO_TEXT)}</li>
        <li>{t('Everything else — time, venue, schedule, story, photos, details and replies — you can change as often as you like.')}</li>
        <li>
          {t('Your website stays online until')}{' '}
          <strong>{until ?? t('{months} months after your wedding', { months: ARCHIVE_AFTER_MONTHS })}</strong>
          {until ? t(', {months} months after your wedding', { months: ARCHIVE_AFTER_MONTHS }) : ''}. {t(ARCHIVE_TEXT)}
        </li>
      </ul>
    </div>
  );
}

/**
 * The first publish while the wedding date is still the design's sample (G060-fix): a blocking note with a way to the
 * date field and an explicit "this is our date" for the couple whose date really is the same.
 */
export function SampleDateGate({
  content,
  sample,
  confirmed,
  onConfirm,
  onFix,
}: {
  content: ContentRecord;
  sample: ContentRecord | null;
  confirmed: boolean;
  onConfirm: (v: boolean) => void;
  onFix: () => void;
}) {
  if (!sampleDateLeft(content, sample)) return null;
  const when = formatDateLong(content.date, content.locale) ?? content.date;
  return (
    <div className={styles.dateGate} role="group" aria-labelledby="date-gate-title" data-sample-date-gate>
      <p id="date-gate-title" className={styles.dateGateTitle}>
        <TriangleAlert size={20} strokeWidth={1.75} aria-hidden="true" />
        {t('Your wedding date is still the design’s sample')}
      </p>
      <p>
        {t('Guests would see')} <strong>{when}</strong>. {t('Set your real date before you publish.')}
      </p>
      <Button variant="secondary" icon={CalendarDays} onClick={onFix} data-fix-date>
        {t('Set our date')}
      </Button>
      <label className={styles.checkRow}>
        <input type="checkbox" checked={confirmed} onChange={(e) => onConfirm(e.target.checked)} data-confirm-sample-date />
        <span>{t('{date} really is our wedding date', { date: when })}</span>
      </label>
    </div>
  );
}
