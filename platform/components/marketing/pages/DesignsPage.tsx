// /designs — gallery (docs/14 §6.2; G066 comp u1_designs_390). Live designs and clearly marked previews. G121 (docs/18 §5 P2): the style filter
// appears from 6 designs on — radio chips and CSS only (:has), so it works without JavaScript and never writes the URL;
// "All" is the default and shows every card. G141: the gallery is DesignGallery (Showcase.tsx): the cards play their
// real opening on hover / ▶ and can be compared side by side. G144: one body for every language.
import { MARKETING } from '../../../lib/marketing/config.ts';
import { catalogDesigns } from '../../../lib/marketing/designs.ts';
import { FIXED_SENTENCE, sitePageNames } from '../../../lib/marketing/facts.ts';
import type { Market } from '../../../lib/marketing/i18n.ts';
import { breadcrumbs, graph, itemList, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { DesignGallery } from '../Showcase.tsx';
import { CheckList, Container, JsonLd, LastUpdated, Section, TextLink } from '../ui.tsx';

export function designsMetadata(m: Market) {
  return pageMetadata(corePage('/designs', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function DesignsPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/designs', MARKETING, t);
  const designs = catalogDesigns();
  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'Every design opens from a sealed envelope or keepsake and has the same four pages: {pages}. Each one has its own opening, artwork and fonts. Open a live demo on your phone and tap to open it, the way your guests will.',
              { pages: sitePageNames(t) },
            )}
          </p>
          <LastUpdated day={PAGE.updated} m={m} />
        </Container>
      </Section>
      <Section>
        <Container>
          <DesignGallery designs={designs} placement="gallery" id="designs" headingLevel={2} m={m} />
        </Container>
      </Section>
      <Section band labelledBy="same">
        <Container>
          <div className={s.twoCol}>
            <div>
              <h2 id="same" className={s.h2}>
                {t('The same in every design')}
              </h2>
              <CheckList
                items={[
                  t('The opening page, then Home, Our Story, Details and RSVP'),
                  t('The editing panel, designed for phone screens'),
                  t('Online RSVP with your own questions, replies and an Excel download'),
                  t('Add to calendar, link preview and QR code'),
                ]}
              />
            </div>
            <div>
              <h2 className={s.h2}>{t('What makes each one different')}</h2>
              <CheckList items={[t('The envelope or keepsake and how it opens'), t('The painted artwork and frames'), t('Colors and fonts')]} />
              <p className={s.small}>
                {t(FIXED_SENTENCE)}{' '}
                {t('Not sure which to pick? Read')}{' '}
                <a href={m.href('/guides/what-to-put-on-your-wedding-website')}>{t('what to put on your wedding website')}</a>{' '}
                {t('or see')} <a href={m.href('/how-it-works')}>{t('how it works')}</a>.
              </p>
            </div>
          </div>
          <TextLink href={m.href('/pricing')}>{t('See pricing')}</TextLink>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          itemList(
            designs.map((d) => ({ path: `/designs/${d.id}`, name: d.name })),
            MARKETING,
            m,
          ),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Designs'), path: '/designs' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
