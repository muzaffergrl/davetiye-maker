// /privacy (docs/14 §6.10). A DRAFT written from what the code does today; not legal advice. K25: no legal identity,
// so the notice names the shop and the support email. Undecided parts stay as visible placeholders from config.
import s from '../../../components/marketing/marketing.module.css';
import { Container, Eyebrow, JsonLd, LastUpdated, Section } from '../../../components/marketing/ui.tsx';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/privacy');
export const metadata = pageMetadata(PAGE);

export default function PrivacyPage() {
  const cfg = MARKETING;
  const b = cfg.brand.name;
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>Privacy</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            This notice explains what {b} collects when you buy and edit a wedding website and when your guests reply, why,
            where it is kept, who can see it and for how long.
          </p>
          {cfg.verified.privacyText ? null : (
            <p className={s.callout}>[PRIVACY REVIEW] This notice is a draft that describes how the service works today. It is not legal advice.</p>
          )}
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>
      <Section className={s.articleSection}>
        <Container narrow>
          <div className={s.prose}>
            <h2 id="who">Who we are</h2>
            <p>
              {b} sells wedding website designs on Etsy as {cfg.etsy.shopName}. For anything about your data, write to{' '}
              {cfg.support.email}.
            </p>

            <h2 id="couples">What we collect from couples</h2>
            <ul>
              <li>Your email address and Etsy order number, given when you start your website.</li>
              <li>The wedding details you enter in your panel: names, date, time, venue, schedule, story, questions and answers, links.</li>
              <li>The photos you upload, stored in the sizes your website needs.</li>
            </ul>
            <p>
              We use them to create, host and show your website, to keep one website per order and to help you when you contact
              us. Payment is handled by Etsy under Etsy&rsquo;s own privacy policy; we never see your card details.
            </p>

            <h2 id="guests">What we collect from guests</h2>
            <ul>
              <li>The reply a guest sends: name, attending or not, number of guests, an optional email address and message, and answers to the couple&rsquo;s questions.</li>
            </ul>
            <p>
              Replies are shown only to the couple in their private panel. To stop spam, the server briefly counts replies per
              network (IP) address in memory; the address is not saved with the reply. Guests can ask the couple, or us at{' '}
              {cfg.support.email}, to correct or delete their reply.
            </p>

            <h2 id="where">Where it is kept and who can see it</h2>
            <ul>
              <li>Websites are hosted on Vercel in the United States. Content, replies and photos are kept in a private Vercel Blob store.</li>
              <li>The couple sees their guests&rsquo; replies through their private edit link. Anyone who has that link can open the panel, so it must stay private.</li>
              <li>We can access the data to give support and to keep the service running. We do not sell or share it.</li>
              <li>Our hosting provider keeps standard technical logs of requests.</li>
            </ul>

            <h2 id="how-long">How long we keep it</h2>
            <p>
              A website stays online until {cfg.hosting.monthsAfterWedding} months after the wedding date. After that:{' '}
              {cfg.policies.retention}. When a couple unpublishes their website, its photos are no longer shown to anyone. To
              delete everything earlier: {cfg.policies.deletion}.
            </p>

            <h2 id="cookies">Cookies and third parties</h2>
            <ul>
              <li>Wedding websites and the editing panel do not set cookies and have no ads or analytics.</li>
              <li>
                This marketing website does not set cookies and{' '}
                {cfg.analytics.provider === 'vercel'
                  ? 'counts visits with Vercel Web Analytics, without cookies.'
                  : 'does not use analytics right now. If we add visit statistics, this notice will say so first.'}
              </li>
              <li>
                Wedding website pages load their fonts from Google Fonts, so a guest&rsquo;s browser contacts Google&rsquo;s font
                servers. The fonts of this marketing website are served from our own domain.
              </li>
            </ul>

            <h2 id="rights">Your choices</h2>
            <p>
              You can change or remove your content in your panel at any time, unpublish your website, and ask us to delete your
              data by writing to {cfg.support.email} from the email address you used when you started your website. We may ask
              for your Etsy order number to confirm it is you.
            </p>

            <h2 id="changes">Changes to this notice</h2>
            <p>When this notice changes, the date at the top changes too.</p>
          </div>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Privacy', path: '/privacy' },
          ]),
        )}
      />
    </>
  );
}
