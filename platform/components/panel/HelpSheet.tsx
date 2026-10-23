'use client';
// The help sheet (G060). G181: loaded when it opens.

import { formatDateLong } from '../../lib/content/format.ts';
import { isPlaceholder, PANEL_BRAND } from '../../lib/panel/brand.ts';
import { type PanelMeta } from '../../lib/panel/model.ts';
import { ARCHIVE_AFTER_MONTHS, ARCHIVE_TEXT, DATE_FREE_DAYS, TYPO_MAX_DISTANCE, UNDO_TEXT } from '../../lib/panel/rights.ts';
import { MessageCircle } from 'lucide-react';
import { Sheet } from './Sheet.tsx';
import { Button } from './ui.tsx';
import styles from './panel.module.css';
import { t, tn } from '../../lib/i18n/client.ts';


// ---------------------------------------------------------------------------------------------

// Help

export function HelpSheet({ meta, locale, onClose, topic, onChat }: { meta: PanelMeta; locale: string; onClose: () => void; topic?: string; onChat?: () => void }) {
  const r = meta.rights;
  const total = r.limit + r.granted;
  const until = r.onlineUntil ? formatDateLong(r.onlineUntil, locale) : null;
  const email = PANEL_BRAND.supportEmail;
  return (
    <Sheet title={t('Help')} onClose={onClose} testId="help">
      <div className={styles.help}>
        {onChat ? (
          <section className={styles.helpChat}>
            <p>{t('Ask our assistant: it usually answers in a few seconds.')}</p>
            <Button variant="secondary" icon={MessageCircle} onClick={onChat} data-open-support>
              {t('Chat with us')}
            </Button>
          </section>
        ) : null}
        <section data-autofocus={topic === 'changes' || undefined} tabIndex={-1}>
          <h3 className={styles.subTitle}>{t('How do name and date changes work?')}</h3>
          <p>
            {t('Until you publish, you can change everything freely.')}{' '}
            {tn(total, 'After you publish, you have {n} change in total for your names, monogram and wedding date (changing several in one go counts once).', 'After you publish, you have {n} changes in total for your names, monogram and wedding date (changing several in one go counts once).')}
          </p>
          <p>{t('Always free: fixing a small typo (up to {letters} letters in a name), adding a surname, and moving your date by up to {days} days.', { letters: TYPO_MAX_DISTANCE, days: DATE_FREE_DAYS })}</p>
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
          <p>
            {t('Yes: share your edit link with your partner (Share → Your private edit link → Copy edit link), or give them your Etsy order number and email to use on /my. Anyone with them can edit, so keep them private.')}
          </p>
        </section>
        <section>
          <h3 className={styles.subTitle}>{t('I lost my edit link')}</h3>
          <p>
            {t('No problem: on any phone or computer, open /my on this website and enter your Etsy order number and the email you used when you started. Your editor opens — no account or password. While this page is open, you can also copy the link again under Share → Your private edit link.')}
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
