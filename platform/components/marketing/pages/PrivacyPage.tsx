// /privacy (docs/14 §6.10). A DRAFT written from what the code does today; not legal advice. K25: no legal identity,
// so the notice names the shop and the support email. Undecided parts stay as visible placeholders from config.
// G144: one body for every language (the translations are courtesy texts of the same draft).
import { MARKETING } from '../../../lib/marketing/config.ts';
import type { Market } from '../../../lib/marketing/i18n.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { Container, Eyebrow, JsonLd, LastUpdated, Section } from '../ui.tsx';

export function privacyMetadata(m: Market) {
  return pageMetadata(corePage('/privacy', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function PrivacyPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/privacy', MARKETING, t);
  const cfg = MARKETING;
  const b = cfg.brand.name;
  const email = cfg.support.email;
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>{t('Privacy')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'This notice explains what {brand} collects when you buy and edit a wedding website and when your guests reply, why, where it is kept, who can see it and for how long.',
              { brand: b },
            )}
          </p>
          {cfg.verified.privacyText ? null : (
            <p className={s.callout}>
              [PRIVACY REVIEW] {t('This notice is a draft that describes how the service works today. It is not legal advice.')}
            </p>
          )}
          <LastUpdated day={PAGE.updated} m={m} />
        </Container>
      </Section>
      <Section className={s.articleSection}>
        <Container narrow>
          <div className={s.prose}>
            <h2 id="who">{t('Who we are')}</h2>
            <p>
              {t('{brand} sells wedding website designs on Etsy as {shop}. For anything about your data, write to {email}.', {
                brand: b,
                shop: cfg.etsy.shopName,
                email,
              })}
            </p>

            <h2 id="couples">{t('What we collect from couples')}</h2>
            <ul>
              <li>{t('Your email address and Etsy order number, given when you start your website.')}</li>
              <li>{t('The wedding details you enter in your panel: names, date, time, venue, schedule, story, questions and answers, links.')}</li>
              <li>{t('The photos you upload, stored in the sizes your website needs.')}</li>
            </ul>
            <p>
              {t(
                'We use them to create, host and show your website, to keep one website per order and to help you when you contact us. Payment is handled by Etsy under Etsy’s own privacy policy; we never see your card details.',
              )}
            </p>

            <h2 id="guests">{t('What we collect from guests')}</h2>
            <ul>
              <li>
                {t(
                  'The reply a guest sends: name, attending or not, number of guests, an optional email address and message, and answers to the couple’s questions.',
                )}
              </li>
            </ul>
            <p>
              {t(
                'Replies are shown only to the couple in their private panel. To stop spam, the server briefly counts replies per network (IP) address in memory; the address is not saved with the reply. Guests can ask the couple, or us at {email}, to correct or delete their reply.',
                { email },
              )}
            </p>

            <h2 id="where">{t('Where it is kept and who can see it')}</h2>
            <ul>
              <li>{t('Websites are hosted on Vercel in the United States. Content, replies and photos are kept in a private Vercel Blob store.')}</li>
              <li>
                {t(
                  'The couple sees their guests’ replies through their private edit link. Anyone who has that link can open the panel, so it must stay private.',
                )}
              </li>
              <li>{t('We can access the data to give support and to keep the service running. We do not sell or share it.')}</li>
              <li>{t('Our hosting provider keeps standard technical logs of requests.')}</li>
            </ul>

            <h2 id="how-long">{t('How long we keep it')}</h2>
            <p>
              {t(
                'A website stays online until {months} months after the wedding date. After that: {retention}. When a couple unpublishes their website, its photos are no longer shown to anyone. To delete everything earlier: {deletion}.',
                { months: cfg.hosting.monthsAfterWedding, retention: t(cfg.policies.retention), deletion: t(cfg.policies.deletion) },
              )}
            </p>

            <h2 id="cookies">{t('Cookies and third parties')}</h2>
            <ul>
              <li>{t('Wedding websites and the editing panel do not set cookies and have no ads or analytics.')}</li>
              <li>
                {t('This marketing website does not set cookies and')}{' '}
                {cfg.analytics.provider === 'vercel'
                  ? t('counts visits with Vercel Web Analytics, without cookies.')
                  : t('does not use analytics right now. If we add visit statistics, this notice will say so first.')}
              </li>
              <li>
                {t(
                  'Wedding website pages load their fonts from Google Fonts, so a guest’s browser contacts Google’s font servers. The fonts of this marketing website are served from our own domain.',
                )}
              </li>
            </ul>

            <h2 id="rights">{t('Your choices')}</h2>
            <p>
              {t(
                'You can change or remove your content in your panel at any time, unpublish your website, and ask us to delete your data by writing to {email} from the email address you used when you started your website. We may ask for your Etsy order number to confirm it is you.',
                { email },
              )}
            </p>

            <h2 id="changes">{t('Changes to this notice')}</h2>
            <p>{t('When this notice changes, the date at the top changes too.')}</p>
          </div>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Privacy'), path: '/privacy' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
