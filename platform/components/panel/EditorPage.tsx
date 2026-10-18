'use client';
// One of the six editor pages (#edit/<page>, K29): its sections, the design's palette and languages (Us), its "Headings &
// labels" (G068) and, on a phone, "Preview this page". G181: its own module — the form building blocks of every section
// load with the first editor page, not with the panel's shell.

import { Eye } from 'lucide-react';
import type { PanelTheme, SectionId } from '../../lib/panel/model.ts';
import type { PanelCopyEntry } from '../../lib/theme/copy.ts';
import { CopyFields } from './CopyFields.tsx';
import { SampleLine } from './fields.tsx';
import { DetailsBlocksFields, MealFields, TravelFields } from './ExtrasFields.tsx';
import { LanguagesFields } from './Languages.tsx';
import { BLOCK_TITLES, type PageId } from './pages.ts';
import { PaletteFields } from './Palette.tsx';
import { PhotoSlots } from './PhotosSection.tsx';
import { SectionJumps } from './SectionJumps.tsx';
import { DateFields, DetailsFields, FaqFields, NamesFields, RsvpFields, ScheduleFields, StoryFields, VenueFields } from './sections.tsx';
import { ThankYouFields } from './ThankYou.tsx';
import { Button } from './ui.tsx';
import type { PanelController } from './usePanel.ts';
import styles from './panel.module.css';
import { t } from '../../lib/i18n/client.ts';

export function EditorPage({
  page,
  sections,
  sampleCount,
  onSampleMissing,
  theme,
  panel,
  focus,
  wide,
  copyJump,
  onCopyFocus,
  onOpenGuests,
  onPreviewThanks,
  onPreviewPage,
}: {
  page: PageId;
  /** The page's sections this design has. */
  sections: SectionId[];
  /** Fields of this page still showing the design's sample text (G100: one line for the page). */
  sampleCount: number;
  onSampleMissing: () => void;
  theme: PanelTheme;
  panel: Pick<PanelController, 'meta' | 'setVariant' | 'locked' | 'online'>;
  /** The section the address names (#edit/venue), or null. */
  focus: SectionId | null;
  wide: boolean;
  copyJump: { path: string } | null;
  onCopyFocus: (e: PanelCopyEntry) => void;
  onOpenGuests: () => void;
  /** The thank-you version of the preview (G075). */
  onPreviewThanks: () => void;
  onPreviewPage: () => void;
}) {
  const sectionBody = (id: SectionId) => {
    switch (id) {
      case 'names':
        return <NamesFields />;
      case 'date':
        return <DateFields theme={theme} />;
      case 'venue':
        return <VenueFields />;
      case 'schedule':
        return <ScheduleFields />;
      case 'story':
        return <StoryFields />;
      case 'details':
        return <DetailsFields optionalBlocks={theme.optionalBlocks} />;
      case 'blocks':
        return <DetailsBlocksFields />;
      case 'travel':
        return <TravelFields showSwitch={theme.optionalBlocks.includes('travel_stay')} />;
      case 'menu':
        return <MealFields />;
      case 'faq':
        return <FaqFields />;
      case 'rsvp':
        return <RsvpFields onOpenGuests={onOpenGuests} copy={theme.copy} />;
      case 'photos':
        return <PhotoSlots intro />;
      case 'thankyou':
        return <ThankYouFields slot={theme.thankYou?.photo ?? null} defaultOpen={focus === 'thankyou'} onPreview={onPreviewThanks} />;
    }
  };

  return (
    <div className={styles.sectionPage} data-page={page}>
      {/* G100 (docs/18 §2): one line for the page's sample text instead of a tag on every field. */}
      <SampleLine count={sampleCount} scope={`[data-page="${page}"]`} onMissing={onSampleMissing} />
      <SectionJumps sections={sections} titles={BLOCK_TITLES} />
      {sections.map((id) => {
        const title = sections.length > 1 ? BLOCK_TITLES[id] : undefined;
        return (
          <section key={id} id={`section-${id}-body`} className={styles.sectionBlock} data-section={id} aria-labelledby={title ? `block-${id}` : undefined}>
            {title ? (
              <h2 id={`block-${id}`} className={styles.blockTitle}>
                {t(title)}
              </h2>
            ) : null}
            {sectionBody(id)}
          </section>
        );
      })}
      {/* G153: the design's colour palette (Us) */}
      {page === 'us' && theme.variants?.length ? (
        <section id="section-palette-body" className={styles.sectionBlock} data-section="palette">
          <PaletteFields
            variants={theme.variants}
            swatch={theme.swatch ?? null}
            current={panel.meta.variant ?? null}
            onPick={panel.setVariant}
            locked={panel.locked}
            online={panel.online}
          />
        </section>
      ) : null}
      {/* G144: the website's languages and the couple's translations (Us) */}
      {page === 'us' ? (
        <section id="section-languages-body" className={styles.sectionBlock} data-section="languages">
          <LanguagesFields copyLabel={(key) => theme.copy.find((e) => e.key === key)?.label ?? null} />
        </section>
      ) : null}
      {/* G068: the design's texts of this page, folded at its end (K29: no seventh "Wording" page) */}
      {theme.copy.some((e) => e.panel === page) ? (
        <section id="section-copy-body" className={styles.sectionBlock} data-section="copy">
          <CopyFields page={page} entries={theme.copy} openRequest={copyJump} onFocusKey={onCopyFocus} />
        </section>
      ) : null}
      {!wide ? (
        <div className={styles.sectionFoot}>
          <Button block icon={Eye} onClick={onPreviewPage}>
            {t('Preview this page')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
