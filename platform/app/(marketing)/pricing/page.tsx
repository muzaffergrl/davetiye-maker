// /pricing (docs/14 §6.6): one card per design from config; the price is the one Etsy shows ([PRICE] until decided).
// No Offer markup here: the Offer lives on the design page only (one product, one place).
import s from '../../../components/marketing/marketing.module.css';
import { designScreen } from '../../../components/marketing/media.ts';
import { CheckList, Container, EtsyButton, Eyebrow, FaqList, JsonLd, LastUpdated, Screen, Section, TextLink } from '../../../components/marketing/ui.tsx';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { demoPath, liveDesigns } from '../../../lib/marketing/designs.ts';
import { included, NOT_INCLUDED } from '../../../lib/marketing/facts.ts';
import { realPrice } from '../../../lib/marketing/placeholders.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage, displayPrice } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/pricing');
export const metadata = pageMetadata(PAGE);

export default function PricingPage() {
  const cfg = MARKETING;
  const designs = liveDesigns();
  const faq = [
    {
      id: 'why-etsy',
      q: 'Why do we buy on Etsy?',
      a: 'Etsy handles the payment and gives you your download right after it, with the link to start your website. You get Etsy’s order history and messages, and we never see your card details. [How it works](/how-it-works).',
    },
    {
      id: 'subscription',
      q: 'Is it a subscription?',
      a: `No. It is one payment per design, with nothing to renew and no upgrades inside the panel. Your website stays online until ${cfg.hosting.monthsAfterWedding} months after your wedding date. [What is included](#included).`,
    },
    {
      id: 'after',
      q: `What happens after ${cfg.hosting.monthsAfterWedding} months?`,
      a: `${cfg.policies.extension}. We will update this answer as soon as the policy is final, and it will be the same here, in the FAQ and in your panel.`,
    },
    {
      id: 'refunds',
      q: 'Can we get a refund?',
      a: `${cfg.policies.refund}. Please open the live demo on your phone before you buy, so you know exactly how your design looks and opens. [Contact us](/contact) with any question first.`,
    },
    {
      id: 'direct',
      q: 'Can we buy directly on this website?',
      a: 'Not yet. Today every design is sold on Etsy only. If that changes, this page will say so first.',
    },
  ];
  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <Eyebrow>Pricing</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            Each design is one purchase on Etsy. No subscription, no per-guest fees, nothing to renew. Your website stays online
            until {cfg.hosting.monthsAfterWedding} months after your wedding date.
          </p>
          <LastUpdated day={PAGE.updated} />
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
                      <a href={`/designs/${d.id}`}>{d.name}</a>
                    </h2>
                    <p className={s.price}>
                      {compare ? (
                        <>
                          <s className={s.compare}>
                            <span className={s.visuallyHidden}>Was </span>
                            {displayPrice(compare)}
                          </s>{' '}
                        </>
                      ) : null}
                      <span>{price ? displayPrice(price) : displayPrice(d.price)}</span>
                      <span className={s.priceNote}> one-time, on Etsy</span>
                    </p>
                    <div className={s.cardActions}>
                      <EtsyButton design={d} placement="pricing" />
                      <a className={s.textLinkPlain} href={demoPath(d.id)} data-demo={d.id} data-demo-placement="pricing">
                        Try the demo
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className={s.small}>
            The price here is always the price Etsy shows for the listing. During an Etsy sale, Etsy shows the reduced price
            and the original one.
          </p>
        </Container>
      </Section>

      <Section band labelledBy="included-title">
        <Container>
          <div className={s.twoCol}>
            <div id="included">
              <h2 id="included-title" className={s.h2}>
                What’s included
              </h2>
              <CheckList items={included()} />
            </div>
            <div>
              <h2 className={s.h2}>Not included</h2>
              <CheckList items={NOT_INCLUDED} tone="no" />
              {cfg.bundles ? <p className={s.callout}>{cfg.bundles}</p> : null}
            </div>
          </div>
          <TextLink href="/features">Every feature in detail</TextLink>
        </Container>
      </Section>

      <Section labelledBy="pricing-faq">
        <Container narrow>
          <h2 id="pricing-faq" className={s.h2}>
            Pricing questions
          </h2>
          <FaqList items={faq} />
          <TextLink href="/faq">All questions</TextLink>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
        )}
      />
    </>
  );
}
