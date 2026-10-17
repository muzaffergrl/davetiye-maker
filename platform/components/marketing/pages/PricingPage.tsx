// /pricing (docs/14 §6.6): one card per design from config; the price is the one Etsy shows ([PRICE] until decided).
// No Offer markup here: the Offer lives on the design page only (one product, one place). G144: one body for every
// language; prices stay as Etsy shows them.
import { MARKETING } from '../../../lib/marketing/config.ts';
import { demoPath, liveDesigns } from '../../../lib/marketing/designs.ts';
import { included, NOT_INCLUDED } from '../../../lib/marketing/facts.ts';
import type { Market } from '../../../lib/marketing/i18n.ts';
import { realPrice } from '../../../lib/marketing/placeholders.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage, displayPrice } from '../../../lib/marketing/site.ts';
import { ExtraServices } from '../ExtraServices.tsx';
import s from '../marketing.module.css';
import { designScreen } from '../media.ts';
import { CheckList, Container, EtsyButton, Eyebrow, FaqList, JsonLd, LastUpdated, Screen, Section, TextLink } from '../ui.tsx';

export function pricingMetadata(m: Market) {
  return pageMetadata(corePage('/pricing', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function PricingPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/pricing', MARKETING, t);
  const cfg = MARKETING;
  const designs = liveDesigns();
  const months = cfg.hosting.monthsAfterWedding;
  const faq = [
    {
      id: 'why-etsy',
      q: t('Why do we buy on Etsy?'),
      a: t(
        'Etsy handles the payment and gives you your download right after it, with the link to start your website. You get Etsy’s order history and messages, and we never see your card details. [How it works](/how-it-works).',
      ),
    },
    {
      id: 'subscription',
      q: t('Is it a subscription?'),
      a: t(
        'No. It is one payment per design, with nothing to renew and no upgrades inside the panel. Your website stays online until {months} months after your wedding date. [What is included](#included).',
        { months },
      ),
    },
    {
      id: 'after',
      q: t('What happens after {months} months?', { months }),
      a: t(
        '{extension}. We will update this answer as soon as the policy is final, and it will be the same here, in the FAQ and in your panel.',
        { extension: t(cfg.policies.extension) },
      ),
    },
    {
      id: 'refunds',
      q: t('Can we get a refund?'),
      a: t(
        '{refund}. Please open the live demo on your phone before you buy, so you know exactly how your design looks and opens. [Contact us](/contact) with any question first.',
        { refund: t(cfg.policies.refund) },
      ),
    },
    {
      id: 'direct',
      q: t('Can we buy directly on this website?'),
      a: t('Not yet. Today every design is sold on Etsy only. If that changes, this page will say so first.'),
    },
  ];
  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <Eyebrow>{t('Pricing')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'Each design is one purchase on Etsy. No subscription, no per-guest fees, nothing to renew. Your website stays online until {months} months after your wedding date.',
              { months },
            )}
          </p>
          <LastUpdated day={PAGE.updated} m={m} />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className={s.priceGrid}>
            {designs.map((d) => {
              const price = realPrice(d.price);
              const compare = d.compareAtPrice ? realPrice(d.compareAtPrice) : null;
              const env = designScreen(d.id, 'envelope');
              return (
                <article key={d.id} className={s.priceCard}>
                  {env ? <Screen file={env} alt="" sizes="120px" className={s.priceThumb} /> : null}
                  <div>
                    <h2 className={s.h3}>
                      <a href={m.href(`/designs/${d.id}`)}>{d.name}</a>
                    </h2>
                    <p className={s.price}>
                      {compare ? (
                        <>
                          <s className={s.compare}>
                            <span className={s.visuallyHidden}>{t('Was')} </span>
                            {displayPrice(compare)}
                          </s>{' '}
                        </>
                      ) : null}
                      <span>{price ? displayPrice(price) : displayPrice(d.price)}</span>
                      <span className={s.priceNote}> {t('one-time, on Etsy')}</span>
                    </p>
                    <div className={s.cardActions}>
                      <EtsyButton design={d} placement="pricing" m={m} />
                      <a className={s.textLinkPlain} href={demoPath(d.id)} data-demo={d.id} data-demo-placement="pricing">
                        {t('Try the demo')}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className={s.small}>
            {t(
              'The price here is always the price Etsy shows for the listing. During an Etsy sale, Etsy shows the reduced price and the original one.',
            )}
          </p>
        </Container>
      </Section>

      <Section band labelledBy="included-title">
        <Container>
          <div className={s.twoCol}>
            <div id="included">
              <h2 id="included-title" className={s.h2}>
                {t('What’s included')}
              </h2>
              <CheckList items={included(cfg, t)} />
            </div>
            <div>
              <h2 className={s.h2}>{t('Not included')}</h2>
              <CheckList items={NOT_INCLUDED.map((x) => t(x))} tone="no" />
              {cfg.bundles ? <p className={s.callout}>{t(cfg.bundles)}</p> : null}
            </div>
          </div>
          <TextLink href={m.href('/features')}>{t('Every feature in detail')}</TextLink>
        </Container>
      </Section>

      <ExtraServices m={m} />

      <Section labelledBy="pricing-faq">
        <Container narrow>
          <h2 id="pricing-faq" className={s.h2}>
            {t('Pricing questions')}
          </h2>
          <FaqList items={faq} m={m} />
          <TextLink href={m.href('/faq')}>{t('All questions')}</TextLink>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Pricing'), path: '/pricing' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
