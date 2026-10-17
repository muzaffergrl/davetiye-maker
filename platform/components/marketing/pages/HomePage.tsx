// / — home (docs/14 §6.1; G066 layout from the BKE Studio comps brand/ui/site/u1_home_*). Static. The live demo loads
// only after a tap (DemoFacade, §9.7). Every picture is a REAL theme or panel screen (or the real opening recording).
// G144: one body for every language — app/(marketing)/(en)/page.tsx (English) and app/(marketing)/i18n/[lang]/page.tsx.
// The home cluster (docs/14 §2.1) stays in the English text: "sealed envelope", digital wedding invitation website.
import { ShinyText } from '../../fx/ShinyText.tsx';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { liveDesigns, showcaseDesigns } from '../../../lib/marketing/designs.ts';
import { definition, factStrip, SITE_PAGES } from '../../../lib/marketing/facts.ts';
import { faqItems, HOME_FAQ_IDS } from '../../../lib/marketing/faq.ts';
import { loadGuidesIn } from '../../../lib/marketing/guides.ts';
import { msg, type Market } from '../../../lib/marketing/i18n.ts';
import { realPrice } from '../../../lib/marketing/placeholders.ts';
import { graph, itemList, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { OPENINGS_COPY, SHOWCASE_COPY, TOUR_COPY, tourCopy, tourLead } from '../../../lib/marketing/showcase.ts';
import { corePage, displayPrice } from '../../../lib/marketing/site.ts';
import { HeroDemo } from '../Demo.tsx';
import { demoCopy, demoDesigns } from '../demo-data.ts';
import { EditTour } from '../EditTour.tsx';
import s from '../marketing.module.css';
import { designScreen } from '../media.ts';
import { DesignGallery, OpeningsReel } from '../Showcase.tsx';
import { tourSteps } from '../showcase-data.ts';
import { CheckList, Container, Eyebrow, FaqList, JsonLd, Screen, Section, TextLink } from '../ui.tsx';

const STEPS = [
  { title: msg('Try a design on your phone'), text: msg('Open the live demo and tap to open the invitation, exactly as your guests will.') },
  { title: msg('Buy it on Etsy'), text: msg('One payment. Your download holds the link to start your website.') },
  { title: msg('Edit, preview, publish'), text: msg('Add your names, date, venue, photos and RSVP questions in your private panel.') },
  { title: msg('Share your link'), text: msg('Send it by text or email, or print the QR code. Replies arrive in your panel.') },
];

export function homeMetadata(m: Market) {
  return pageMetadata(corePage('/', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function HomePage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/', MARKETING, t);
  const designs = liveDesigns();
  // G141: the home gallery shows every live design, featured first (G099's featured designs lead)
  const showcase = showcaseDesigns();
  const demo = demoDesigns(MARKETING, m);
  const first = designs[0];
  const guides = loadGuidesIn(m.lang);
  const faq = faqItems(MARKETING, t).filter((f) => (HOME_FAQ_IDS as readonly string[]).includes(f.id));
  const prices = designs.map((d) => realPrice(d.price)).filter(Boolean) as string[];
  const fromPrice = prices.length ? displayPrice(prices.sort((a, b) => Number(a) - Number(b))[0]) : null;
  const def = definition(MARKETING, t);

  return (
    <>
      <Section className={s.heroSection}>
        <Container>
          <HeroDemo
            designs={demo}
            copy={demoCopy(t)}
            placement="home-hero"
            primaryLabel={t('Open the invitation')}
            secondary={<TextLink href={m.href('/designs')}>{t('See all designs')}</TextLink>}
            footnote={
              <ul className={s.factStrip} aria-label={t('At a glance')}>
                {factStrip(MARKETING, t).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            }
          >
            <Eyebrow>
              <ShinyText>{t('Wedding websites · edit on your phone')}</ShinyText>
            </Eyebrow>
            <h1 className={s.h1}>{PAGE.h1}</h1>
            <p className={s.lead}>
              {t('Your guests tap a sealed envelope or keepsake and your wedding website opens: your story, the details and RSVP.')}
            </p>
          </HeroDemo>
        </Container>
      </Section>

      {/* G121 (docs/18 §5 P2, mobile order): the designs right after the hero. G141 (K45 item 7): every live design,
          featured first, as the interactive gallery (style chips, the real opening on hover / ▶, compare, live demo);
          then the openings, the pages and the editing tour — pictures first, short text. */}
      <Section labelledBy="designs">
        <Container>
          <Eyebrow>{t(SHOWCASE_COPY.eyebrow)}</Eyebrow>
          <h2 id="designs" className={s.h2}>
            {t(SHOWCASE_COPY.title)}
          </h2>
          <DesignGallery designs={showcase} placement="home-strip" id="home" m={m} />
          <TextLink href={m.href('/designs')}>{t('See all {n} designs', { n: designs.length })}</TextLink>
        </Container>
      </Section>

      <Section labelledBy="opening">
        <Container>
          <Eyebrow>{t(OPENINGS_COPY.eyebrow)}</Eyebrow>
          <h2 id="opening" className={s.h2}>
            {t(OPENINGS_COPY.title)}
          </h2>
          <p className={s.lead}>{t(OPENINGS_COPY.lead)}</p>
          <OpeningsReel designs={designs} m={m} />
        </Container>
      </Section>

      <Section labelledBy="pages">
        <Container>
          <Eyebrow>{t('After the opening')}</Eyebrow>
          <h2 id="pages" className={s.h2}>
            {t('Four pages your guests will actually use')}
          </h2>
          <ul className={s.pageCards} data-fx-stagger>
            {SITE_PAGES.map((p) => {
              const file = designScreen(first.id, p.key);
              return (
                <li key={p.key} className={s.pageCard}>
                  {file ? (
                    <Screen
                      file={file}
                      alt={t('{design} design, {page} page (demo couple {couple})', { design: first.name, page: t(p.name), couple: first.copy.demoCouple })}
                      sizes="(min-width: 1024px) 96px, 64px"
                      className={s.pageThumb}
                    />
                  ) : null}
                  <div>
                    <h3 className={s.pageCardTitle}>{t(p.name)}</h3>
                    <p className={s.pageCardText}>{t(p.short)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="edit" band>
        <Container>
          <Eyebrow>{t(TOUR_COPY.eyebrow)}</Eyebrow>
          <h2 id="edit" className={s.h2}>
            {t(TOUR_COPY.title)}
          </h2>
          <p className={s.lead}>{tourLead(t)}</p>
          <EditTour steps={tourSteps(t)} copy={tourCopy(t)} />
          <TextLink href={m.href('/features#editing')}>{t(TOUR_COPY.more)}</TextLink>
        </Container>
      </Section>

      <Section labelledBy="how">
        <Container>
          <Eyebrow>{t('From Etsy to your guests')}</Eyebrow>
          <h2 id="how" className={s.h2}>
            {t('How it works')}
          </h2>
          <ol className={s.stepRow} data-fx-stagger data-fx-steps>
            {STEPS.map((st, i) => (
              <li key={st.title}>
                <span className={s.stepNum} aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <h3 className={s.stepTitle}>{t(st.title)}</h3>
                  <p className={s.stepText}>{t(st.text)}</p>
                </div>
              </li>
            ))}
          </ol>
          <TextLink href={m.href('/how-it-works')}>{t('See every step')}</TextLink>
        </Container>
      </Section>

      <Section labelledBy="what-is">
        <Container narrow>
          <h2 id="what-is" className={s.h2}>
            {t('What is {brand}?', { brand: MARKETING.brand.name })}
          </h2>
          <p className={s.definition}>{def.long}</p>
        </Container>
      </Section>

      <Section labelledBy="price">
        <Container narrow>
          <div className={s.priceBand}>
            <h2 id="price" className={s.h2}>
              {t('One design. One payment on Etsy.')}
            </h2>
            <p className={s.lead}>
              {fromPrice ? `${t('{price} per design.', { price: fromPrice })} ` : ''}
              {t('No subscription and nothing to renew: your website stays online until {months} months after your wedding date.', {
                months: MARKETING.hosting.monthsAfterWedding,
              })}
            </p>
            <CheckList items={[t('The opening and four pages'), t('Editing panel and online RSVP'), t('Add to calendar and QR code')]} />
            <TextLink href={m.href('/pricing')}>{t('See pricing')}</TextLink>
          </div>
        </Container>
      </Section>

      <Section labelledBy="faq">
        <Container narrow>
          <h2 id="faq" className={s.h2}>
            {t('Questions couples ask first')}
          </h2>
          <FaqList items={faq} m={m} />
          <TextLink href={m.href('/faq')}>{t('All questions')}</TextLink>
        </Container>
      </Section>

      <Section labelledBy="final">
        <Container>
          <div className={s.finalCta}>
            <h2 id="final" className={s.h2}>
              {t('Try it on your phone first')}
            </h2>
            <p className={s.lead}>{t('Open a live demo, tap the invitation and read it the way your guests will.')}</p>
            <div className={s.ctaRow}>
              <a className={`${s.btn} ${s.btnLight}`} href={m.href(`/designs/${first.id}`)} data-demo={first.id} data-demo-placement="home-final">
                {t('Open a live demo')}
              </a>
              <TextLink href={m.href('/designs')}>{t('Compare designs')}</TextLink>
            </div>
            <p className={s.small}>
              {t('Planning tips:')} <a href={m.href(guides[0]?.path ?? '/guides')}>{guides[0]?.title ?? t('Guides')}</a>
              {guides[1] ? (
                <>
                  {' · '}
                  <a href={m.href(guides[1].path)}>{guides[1].title}</a>
                </>
              ) : null}
            </p>
          </div>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          // the designs shown on this page (the full list: /designs)
          itemList(
            showcase.map((d) => ({ path: `/designs/${d.id}`, name: d.name })),
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
