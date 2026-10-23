// /terms (G961, decision 7, 2026-10-23): terms of use, effective from config `legal.updated`. Written only from decided
// facts and from what the platform does (lib/marketing/legal.ts header lists the sources; open points such as governing
// law and the seller's legal name are in docs/39 — deliberately no governing-law clause, and never a bracket placeholder
// on the page). Policies, hosting and edit rules come from config (lib/marketing/config.ts, facts.ts), so the terms and
// the rest of the site say the same thing. G144: one body for every language.
import { MARKETING } from '../../../lib/marketing/config.ts';
import { editRightsText } from '../../../lib/marketing/facts.ts';
import type { Market } from '../../../lib/marketing/i18n.ts';
import { controllerIdentity, controllerKnown, ONLINE_CAP_MONTHS, servicesOnSale, shopHandle } from '../../../lib/marketing/legal.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { Container, Eyebrow, InlineMd, JsonLd, LastUpdated, Section } from '../ui.tsx';

export function termsMetadata(m: Market) {
  return pageMetadata(corePage('/terms', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function TermsPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/terms', MARKETING, t);
  const cfg = MARKETING;
  const b = cfg.brand.name;
  const email = cfg.support.email;
  const who = controllerIdentity(cfg);
  const rights = editRightsText(cfg, t);
  const services = servicesOnSale(cfg);
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>{t('Terms')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'These terms explain what you get when you buy a {brand} design on Etsy, how you may use it and what we do for you. Please read them before you start your website.',
              { brand: b },
            )}
          </p>
          <LastUpdated day={PAGE.updated} label={t('Effective')} m={m} />
        </Container>
      </Section>
      <Section className={s.articleSection}>
        <Container narrow>
          <div className={s.prose}>
            <h2 id="who">{t('Who we are')}</h2>
            <p>
              {t('These terms apply when you buy a wedding website design from {brand} and use our platform to make and share your website.', {
                brand: b,
              })}{' '}
              {t('{brand} sells on Etsy in the shop {shop}. You can reach us at {email} or through Etsy messages.', {
                brand: b,
                shop: shopHandle(cfg) ?? cfg.etsy.shopName,
                email,
              })}{' '}
              {t('We reply within {time}.', { time: t(cfg.support.responseTime) })}
            </p>
            <p>
              {controllerKnown(cfg)
                ? t('{brand} is run by {name}, {address}.', { brand: b, name: who.name!, address: who.address! })
                : t('Our full legal name and postal address are provided on request by email.')}
            </p>

            <h2 id="what-you-get">{t('What you get')}</h2>
            <ul>
              <li>
                {t(
                  'Each design you buy on Etsy gives you one wedding website on our platform: one design for one event. If your order has several designs, or the same design more than once, you can start one website for each.',
                )}
              </li>
              <li>
                {ONLINE_CAP_MONTHS
                  ? t(
                      'Your website stays online until {months} months after your wedding date, and at most {cap} months after you first publish it. Your editor shows this “Online until” date.',
                      { months: cfg.hosting.monthsAfterWedding, cap: ONLINE_CAP_MONTHS },
                    )
                  : t('Your website stays online until {months} months after your wedding date. Your editor shows this “Online until” date.', {
                      months: cfg.hosting.monthsAfterWedding,
                    })}{' '}
                {t(cfg.policies.extension)}
              </li>
              <li>
                {t('After that date your website closes for guests. You can still open your editor to see your content and download your guests’ replies.')}{' '}
                {t(cfg.policies.retention)}
              </li>
              <li>
                <InlineMd text={t('Everything a purchase includes is listed on our [pricing page](/pricing) and in the Etsy listing.')} m={m} />
              </li>
            </ul>
            <p>
              {t(
                'The design itself (its artwork, animation and code) stays ours. You may use it for your own event website on our platform, and print the printable invitation and the PDF of your website for that event. You may not resell, share or copy the design, or use it anywhere else.',
              )}
            </p>

            <h2 id="editing">{t('Editing your website')}</h2>
            <p>
              {t('Until you publish, you can change everything as often as you like.')} {rights.long} {rights.rest}
            </p>
            <p>
              {t(
                'The limit on name and date changes keeps one purchase as one couple’s website. If you run out of changes, message us on Etsy with your order number.',
              )}
            </p>
            <p>{t('Automatic translations of your own texts are drafts: please check them before you publish.')}</p>

            <h2 id="buying">{t('Buying and access')}</h2>
            <ul>
              <li>{t('You buy on Etsy, at the price Etsy shows on the listing. Etsy takes the payment under its own terms; we never see your card details.')}</li>
              <li>
                {t(
                  'To start your website, open the start link from your Etsy download and enter your Etsy order number and your email address. The same order number and email open your editor again on any phone or computer.',
                )}
              </li>
              <li>
                {t(
                  'Keep your order number, email and private edit link to yourself: anyone who has them can edit your website. We will never ask for your edit link.',
                )}
              </li>
              <li>{t('We check order numbers against our Etsy shop’s orders. While an order is not confirmed yet, publishing can be on hold.')}</li>
            </ul>

            <h2 id="returns">{t('Returns and fixes')}</h2>
            <p>
              {t(
                'Because you get instant access to a digital product, we do not accept returns, exchanges or cancellations and we do not give refunds, except where the consumer law that applies to you gives you a right that cannot be excluded.',
              )}
            </p>
            <p>
              {t('If something on your website does not work as described, message us on Etsy or email {email}, and we fix it.', { email })}{' '}
              {t('Etsy’s own policies also apply to your purchase on Etsy.')}
            </p>
            {services.length ? (
              <p>{t('Extra services we sell as separate Etsy listings are described in their listing; these terms apply to them too.')}</p>
            ) : null}

            <h2 id="acceptable-use">{t('Acceptable use')}</h2>
            <p>{t('Your website is for your wedding or a similar private event. Please do not use it, the editor or the reply form to:')}</p>
            <ul>
              <li>{t('publish anything unlawful, hateful, violent, sexually explicit or misleading;')}</li>
              <li>{t('publish photos, music, texts or personal details of other people without the right or permission to do so;')}</li>
              <li>{t('send spam, collect data for advertising or pretend to be someone else;')}</li>
              <li>{t('ask guests for more personal information than your event needs;')}</li>
              <li>{t('try to get into websites, editors or data that are not yours, overload the platform or get around its limits;')}</li>
              <li>{t('start a website with an order number that is not a real purchase from our shop.')}</li>
            </ul>

            <h2 id="your-content">{t('Your content')}</h2>
            <p>
              {t(
                'Your texts, photos, music and your guests’ replies stay yours. You allow us to store, process and show them only as far as needed to host your website, give you support and run the platform.',
              )}
            </p>
            <p>
              {t(
                'Upload only photos and music that you own or are allowed to use on a website that anyone with the link can open. You are responsible for what you publish and for how you use your guests’ replies.',
              )}
            </p>
            <p>
              {t(
                'If something on a website breaks these terms or someone’s rights, we may hide or remove it, or take the website offline, and we tell the couple why.',
              )}
            </p>

            <h2 id="report">{t('Reporting content')}</h2>
            <p>
              {t(
                'Do you see something on a website we host that uses your photo, music or text without permission, or that is unlawful? Email {email} with the website address, what the content is and why it should be removed. We look into every report.',
                { email },
              )}
            </p>

            <h2 id="availability">{t('Availability and changes')}</h2>
            <p>
              {t(
                'We work to keep websites and the editor online at all times, but short interruptions can happen, for example during maintenance or a problem at our hosting provider.',
              )}
            </p>
            <p>
              {t(
                'We may update the platform to fix problems, improve features or follow the law. If an update would take away something your purchase includes, we tell you before it happens.',
              )}
            </p>
            <p>{t('Keep your own copy of what matters: you can download your guests’ replies as an Excel file and your website as a PDF at any time.')}</p>

            <h2 id="ai-chat">{t('Live help chat')}</h2>
            <p>
              <InlineMd
                text={t(
                  'The live help chat is an AI assistant run by Google Gemini. Its answers can be wrong or incomplete; they are not a promise and do not change these terms, prices or our policies. For anything about your order, write to us on Etsy or by email. Please do not type personal details in the chat (see our [privacy notice](/privacy)).',
                )}
                m={m}
              />
            </p>

            <h2 id="responsibility">{t('Our responsibility')}</h2>
            <p>
              {t(
                'We provide the platform with reasonable care. Nothing in these terms limits your rights as a consumer under the law that applies to you, or our responsibility where the law does not allow it to be limited, for example for harm caused on purpose or by gross negligence.',
              )}
            </p>
            <p>
              {t(
                'Within those limits, we are not responsible for losses we could not reasonably foresee, for content you or your guests add, or for problems caused by services we do not control, such as Etsy, Google, email providers or your internet connection. Where the law allows a limit, our responsibility for a purchase is limited to the price you paid for it.',
              )}
            </p>

            <h2 id="ending">{t('Ending and removal')}</h2>
            <p>
              {t('You can take your website offline at any time in your editor.')} {t(cfg.policies.deletion)}
            </p>
            <p>
              {t(
                'We may take offline or delete a website that was started with an order number that is not a real purchase from our shop, that seriously breaks these terms, or that the law requires us to remove. Where we can, we tell you first and give you the chance to fix it.',
              )}
            </p>
            <p>
              <InlineMd
                text={t('How long we keep your data and how to ask us to delete it is explained in our [privacy notice](/privacy) and our [KVKK notice](/kvkk).')}
                m={m}
              />
            </p>

            <h2 id="changes">{t('Changes to these terms')}</h2>
            <p>
              {t(
                'We may update these terms when our service or the law changes. The date at the top shows the version in force. Changes do not take away rights you already have from a purchase made before them.',
              )}
            </p>
            <p>{t('These terms do not take away the protection that the mandatory consumer law of your country gives you.')}</p>
          </div>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Terms'), path: '/terms' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
