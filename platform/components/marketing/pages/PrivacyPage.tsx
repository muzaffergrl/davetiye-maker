// /privacy (docs/14 §6.10). Written from what the code does today (G154, 2026-10-17: re-read against lib/data,
// lib/device-keys.ts, lib/google, lib/mail, lib/rsvp, lib/site/access.ts, lib/i18n/auto-translate.ts; 2026-10-22: lib/support, the AI live help chat). K25: no legal
// identity, so the notice names the shop and the support email. K48: the retention and deletion texts come from config
// (policies); the "not legal advice, have it reviewed" note lives in the docs (docs/14 §6.10), not on the public page.
// G144: one body for every language. G961 (2026-10-23): legal basis, the KVKK notice and terms links, the shop's Gmail
// (sending + reading Etsy's order emails, owner decision 2), one website per design bought, the controller sentence.
import { MARKETING } from '../../../lib/marketing/config.ts';
import type { Market } from '../../../lib/marketing/i18n.ts';
import { controllerIdentity, controllerKnown, ONLINE_CAP_MONTHS, shopHandle } from '../../../lib/marketing/legal.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { Container, Eyebrow, InlineMd, JsonLd, LastUpdated, Section } from '../ui.tsx';

export function privacyMetadata(m: Market) {
  return pageMetadata(corePage('/privacy', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function PrivacyPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/privacy', MARKETING, t);
  const cfg = MARKETING;
  const b = cfg.brand.name;
  const email = cfg.support.email;
  const who = controllerIdentity(cfg);
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
                // the Etsy shop's own name (as on Terms and the KVKK notice), from its real URL; else the configured name
                shop: shopHandle(cfg) ?? cfg.etsy.shopName,
                email,
              })}{' '}
              {controllerKnown(cfg)
                ? t('{brand} is run by {name}, {address}.', { brand: b, name: who.name!, address: who.address! })
                : t('Our full legal name and postal address are provided on request by email.')}
            </p>

            <h2 id="couples">{t('What we collect from couples')}</h2>
            <ul>
              <li>{t('Your email address and Etsy order number, given when you start your website.')}</li>
              <li>{t('The wedding details you enter in your panel: names, date, time, venue, schedule, story, questions and answers, links.')}</li>
              <li>{t('The photos you upload, stored in the sizes your website needs, and the music file you upload for your Our Story page.')}</li>
              <li>
                {t(
                  'For each phone or computer where you open your editor with your order number and email: a one-way hash of its key, when it was added and a short label such as “iPhone · Safari”, so you can see your devices and sign them out. The key of your edit link is also kept only as a one-way hash.',
                )}
              </li>
              <li>
                {t(
                  'If you connect Google Sheets: an encrypted access token from Google, used only to add your guests’ replies to the spreadsheet it made in your own Google Drive.',
                )}
              </li>
            </ul>
            <p>
              {t(
                'We use them to create, host and show your website, to keep one website per design bought and to help you when you contact us. To confirm an order, we may look up its number among our Etsy shop’s orders and in the sale emails Etsy sends to our shop’s Gmail inbox. Payment is handled by Etsy under Etsy’s own privacy policy; we never see your card details.',
              )}
            </p>

            <h2 id="emails">{t('Emails')}</h2>
            <p>
              {t(
                'When email sending is switched on, we use your email address to send you your edit link after you start, the sign-in links you ask for and, only if you turn it on under Guests, a short email for each new guest reply. These emails are sent from our shop’s Gmail account, so they pass through Google. We send no newsletters or ads.',
              )}
            </p>

            <h2 id="guests">{t('What we collect from guests')}</h2>
            <ul>
              <li>
                {t(
                  'The reply a guest sends: name, attending or not, number of guests, the names of the others in the reply, an optional email address and message, and answers to the couple’s questions.',
                )}
              </li>
            </ul>
            <p>
              {t(
                'Replies are shown only to the couple in their private panel. If the couple connects Google Sheets, replies are also copied into a spreadsheet in the couple’s own Google Drive. To stop spam, the server counts requests per network (IP) address for a short time; it keeps only a one-way hash of the address with the count, never with the reply. Guests can ask the couple, or us at {email}, to correct or delete their reply.',
                { email },
              )}
            </p>

            <h2 id="where">{t('Where it is kept and who can see it')}</h2>
            <ul>
              <li>{t('Websites are hosted on Vercel in the United States. Content, replies, photos and music are kept in a private Vercel Blob store.')}</li>
              <li>
                {t(
                  'The couple sees their guests’ replies in their private editor, which opens with their Etsy order number and email or with their private edit link. Anyone who has these can open the editor, so they must stay private.',
                )}
              </li>
              <li>{t('We can access the data to give support and to keep the service running. We do not sell or share it.')}</li>
              <li>{t('Our hosting provider keeps standard technical logs of requests.')}</li>
              <li>
                {t(
                  'Our shop’s email runs on Google’s Gmail: it sends your edit and sign-in links and receives Etsy’s order emails, which we read only to confirm orders.',
                )}
              </li>
            </ul>

            <h2 id="how-long">{t('How long we keep it')}</h2>
            <p>
              {/* the same limits as Terms and the KVKK notice (lib/marketing/legal.ts ONLINE_CAP_MONTHS) */}
              {ONLINE_CAP_MONTHS
                ? t(
                    'A website stays online until {months} months after the wedding date, and at most {cap} months after it is first published. {retention} When a couple takes their website offline, its photos are no longer shown to anyone.',
                    { months: cfg.hosting.monthsAfterWedding, cap: ONLINE_CAP_MONTHS, retention: t(cfg.policies.retention) },
                  )
                : t(
                    'A website stays online until {months} months after the wedding date. {retention} When a couple takes their website offline, its photos are no longer shown to anyone.',
                    { months: cfg.hosting.monthsAfterWedding, retention: t(cfg.policies.retention) },
                  )}
            </p>

            <h2 id="legal-basis">{t('Legal basis')}</h2>
            <p>
              {t(
                'We use your data to provide what you bought (our contract with you), to meet legal obligations such as keeping sales records, and for our legitimate interests in keeping the platform secure and free of spam and fake orders. Guest replies are kept for the couple, who decide what guests are asked.',
              )}
            </p>

            <h2 id="cookies">{t('Cookies and third parties')}</h2>
            <ul>
              <li>
                {t('This marketing website does not set cookies and')}{' '}
                {cfg.analytics.provider === 'vercel'
                  ? t('counts visits with Vercel Web Analytics, without cookies.')
                  : t('does not use analytics right now. If we add visit statistics, this notice will say so first.')}
              </li>
              <li>
                {t(
                  'Wedding websites have no ads or analytics. Their only cookie remembers for 90 days that a guest entered the right password, and only when the couple turns on a guest password.',
                )}
              </li>
              <li>
                {t(
                  'The editor has no ads or analytics. It keeps a few things in your browser: the editors you opened on this device, changes not saved yet while you are offline, a cookie with the editor language you chose, and a short-lived cookie while you connect Google Sheets.',
                )}
              </li>
              <li>
                {t(
                  'Wedding website pages load their fonts from Google Fonts, so a guest’s browser contacts Google’s font servers. The fonts of this marketing website are served from our own domain.',
                )}
              </li>
              <li>
                {t('A venue map loads from Google Maps only when a guest taps Show map; directions open in Google Maps, Apple Maps or Waze.')}
              </li>
              <li>
                {t(
                  'Translate automatically in the editor uses your browser’s own translator when it has one, and then nothing leaves your device. Otherwise your texts are sent to the free MyMemory translation service (translated.net); the editor says so next to the button.',
                )}
              </li>
              <li id="ai-chat">
                {t(
                  'The live help chat on this website and in the editor is an AI assistant run by Google Gemini: the messages you type, the address of the page you are on and, in the editor, a few facts about your website (its design, whether it is published and how many name and date changes are left; never names, guests or replies) are sent to Google to write the answer. On the free Gemini service Google may use these messages to improve its products, and people at Google may read them, so please do not type personal details. We do not keep the conversations; your browser keeps them only until you close the tab.',
                )}
              </li>
            </ul>

            <h2 id="rights">{t('Your choices')}</h2>
            <p>
              {t(
                'You can change or remove your content in your panel at any time, take your website offline, sign out other devices and disconnect Google Sheets. {deletion} You can also write to {email} from the email address you used when you started your website. We confirm it is you before we delete anything.',
                { deletion: t(cfg.policies.deletion), email },
              )}{' '}
              {t('You can also complain to the data protection authority where you live.')}
            </p>

            <h2 id="kvkk">{t('Turkey (KVKK)')}</h2>
            <p>
              <InlineMd
                text={t(
                  'We are based in Turkey. Our [KVKK notice](/kvkk) explains how we process data under Turkey’s data protection law, your rights under it and how to apply. The rules for buying and using a design are in our [terms of use](/terms).',
                )}
                m={m}
              />
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
