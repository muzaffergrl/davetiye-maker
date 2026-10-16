'use client';
// First-run setup (G060, docs/16 §5; K29: three steps): 1 names + date -> 2 the opening photo -> 3 publish.
// Everything else (venue, schedule, story, details, RSVP) comes later and is optional; Home shows what is left.
// Back never loses anything (it is all autosaved), steps 1–2 can be skipped, and the step to resume is worked out
// from the content (another phone finds it too).

import { ArrowLeft, CalendarDays, CircleCheckBig, Hourglass, Sparkles, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatDate, formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import {
  fieldId,
  pageShown,
  photoAt,
  prePublishNotes,
  sampleDateLeft,
  type PanelState,
  type PanelTheme,
} from '../../lib/panel/model.ts';
import { ARCHIVE_AFTER_MONTHS, ARCHIVE_TEXT, changesRuleText, FREE_CHANGES_TEXT, IDENTITY_CHANGE_LIMIT, UNDO_TEXT, type RightsView } from '../../lib/panel/rights.ts';
import { BrandLogo } from './Brand.tsx';
import { SampleLine, useDeviceZone, usePanelContext } from './fields.tsx';
import { heroSlot, SETUP_STEP_COUNT } from './pages.ts';
import { PhotoSlots } from './PhotosSection.tsx';
import { PreviewPane, useSettledVersion } from './PreviewPane.tsx';
import { AfterPublish, afterPublishSteps, LiveShare } from './Published.tsx';
import { DateFields, NamesFields, RIGHTS_HINT_BEFORE, RightsNote, SetupFullNames } from './sections.tsx';
import { Banner, Button, cx, SaveIndicator } from './ui.tsx';
import type { PanelController } from './usePanel.ts';
import { UrlText } from './views.tsx';
import styles from './panel.module.css';



export const SETUP_STEPS = [
  {
    title: 'Your names and date',
    help: 'As your guests know you, and the day itself. Everything else can wait until later.',
    paths: ['partners', 'name_display', 'initials', 'date', 'ceremony_time', 'timezone', 'locale'],
  },
  { title: 'Add your photo', help: 'One photo is enough to start: it opens your website. The others are optional.', paths: ['media'] },
  { title: 'Publish your website', help: 'Check it once, then publish.', paths: [] },
] as const;



/** Steps (1-2) whose content is filled in and no longer the design's sample text. */
export function doneSteps(content: ContentRecord, theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>, deviceZone: string | null = null): Set<number> {
  const done = new Set<number>();
  const samples = new Set(prePublishNotes(content, theme, { deviceZone }).sample.map((n) => n.path));
  const names = (content.partners ?? []).length > 0 && content.partners.every((p) => (p.display_name ?? '').trim());
  const date = Boolean(content.date && content.ceremony_time) && !samples.has('date') && !samples.has('ceremony_time');
  if (names && date) done.add(1);
  if (!theme.photos.length || theme.photos.some((s) => photoAt(content, s.source))) done.add(2);
  return done;
}

/** The first step not done yet (3 = publish, when 1–2 are done). */
export function firstOpenStep(content: ContentRecord, theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>, deviceZone: string | null = null): number {
  const done = doneSteps(content, theme, deviceZone);
  for (let s = 1; s < SETUP_STEP_COUNT; s++) if (!done.has(s)) return s;
  return SETUP_STEP_COUNT;
}

const setupKey = (slug: string) => `setup:${slug}`;
export function readSetup(slug: string): { step?: number; dismissed?: boolean } {
  try {
    return JSON.parse(window.localStorage.getItem(setupKey(slug)) ?? '{}') as { step?: number; dismissed?: boolean };
  } catch {
    return {};
  }
}
export function writeSetup(slug: string, value: { step?: number; dismissed?: boolean }) {
  try {
    window.localStorage.setItem(setupKey(slug), JSON.stringify({ ...readSetup(slug), ...value }));
  } catch {
    /* private mode: the step comes from the content next time */
  }
}

/** The rules shown before EVERY first publish (wizard step 6 and the editor's first Publish), docs/16 §11.7. */
export function RulesBox({ rights, locale, total = IDENTITY_CHANGE_LIMIT }: { rights: RightsView; locale: string; total?: number }) {
  const until = rights.onlineUntil ? formatDate(rights.onlineUntil, locale) : null;
  return (
    <div className={styles.rules} data-rules>
      <h3 className={styles.rulesTitle}>Good to know before you publish</h3>
      <ul>
        <li>{changesRuleText(total)}</li>
        <li>{FREE_CHANGES_TEXT}</li>
        <li>{UNDO_TEXT}</li>
        <li>Everything else — time, venue, schedule, story, photos, details and replies — you can change as often as you like.</li>
        <li>
          Your website stays online until <strong>{until ?? `${ARCHIVE_AFTER_MONTHS} months after your wedding`}</strong>
          {until ? `, ${ARCHIVE_AFTER_MONTHS} months after your wedding` : ''}. {ARCHIVE_TEXT}
        </li>
      </ul>
    </div>
  );
}

export function Setup({
  step,
  initial,
  panel,
  theme,
  url,
  visiblePages,
  onStep,
  onExit,
  onPublished,
  onAfter,
  onIssues,
}: {
  step: number;
  initial: PanelState;
  panel: PanelController;
  theme: PanelTheme;
  url: string;
  visiblePages: string[];
  onStep: (n: number) => void;
  onExit: () => void;
  onPublished: () => void;
  /** A next step of the success screen (G100): a view ("#edit/photos") or a content path. */
  onAfter: (path: string) => void;
  onIssues: (issues: ValidationIssue[], message?: string) => void;
}) {
  const { content, validation, meta, saveState } = panel;
  const ctx = usePanelContext();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const def = SETUP_STEPS[step - 1];
  const deviceZone = useDeviceZone();
  const notes = prePublishNotes(content, theme, { deviceZone });
  const sampleCount = notes.sample.length;
  // The first publish waits while the date is still the design's sample (G060-fix), unless the couple confirms it.
  const [dateConfirmed, setDateConfirmed] = useState(false);
  const dateBlocked = sampleDateLeft(content, theme.sample) && !dateConfirmed;

  useEffect(() => {
    writeSetup(initial.slug, { step });
    setError(null);
    headingRef.current?.focus();
    document.title = `Step ${step} of ${SETUP_STEP_COUNT} · ${def.title}`;
  }, [step, initial.slug, def.title]);

  const stepIssues = validation.errors.filter((i) => def.paths.some((p) => i.path === p || i.path.startsWith(`${p}.`)));

  const next = () => {
    if (stepIssues.length) {
      const el = document.getElementById(fieldId(stepIssues[0].path));
      el?.focus();
      setError(stepIssues.length === 1 ? 'Please fix the field marked below, or skip this step for now.' : `Please fix the ${stepIssues.length} fields marked below, or skip this step for now.`);
      return;
    }
    onStep(step + 1);
  };

  const publish = async () => {
    setPublishing(true);
    setError(null);
    const res = await panel.publish();
    setPublishing(false);
    if (res.ok) {
      setPublished(true);
      writeSetup(initial.slug, { dismissed: true });
      return;
    }
    if (res.issues?.length) return onIssues(res.issues, res.message);
    setError(res.message ?? 'Your website could not be published. Please try again.');
  };

  const hero = heroSlot(theme.photos);
  const otherSlots = theme.photos.filter((s) => s !== hero);
  const filledPhotos = theme.photos.filter((s) => photoAt(content, s.source)).length;

  if (published) {
    return (
      <div className={styles.setup} data-setup-done>
        <header className={styles.setupTop}>
          <div className={styles.setupTopRow}>
            <BrandLogo />
          </div>
        </header>
        <main className={styles.setupMain} id="main">
          <div className={styles.success}>
            <span className={styles.successIcon} aria-hidden="true">
              <CircleCheckBig size={40} strokeWidth={1.5} />
            </span>
            <h1 ref={headingRef} tabIndex={-1} className={styles.setupTitle}>
              Your website is live
            </h1>
            <p className={styles.setupHelp}>Guests can open it now. Send them the link.</p>
            {/* G100 (docs/18 §1): the link and Share first; the QR code under "More ways to share"; then optional steps. */}
            <LiveShare url={url} fileBase={initial.slug} />
            <AfterPublish steps={afterPublishSteps(content, theme, notes.sample)} onGo={onAfter} />
            <Button variant="primary" block onClick={onPublished} data-go-editor>
              Go to my editor
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.setup} data-setup={step}>
      {/* Comp u2_setup_names_390: the logo and "Save & exit", then the 6-part bar with "Step n of 6" beside it. */}
      <header className={styles.setupTop}>
        <div className={styles.setupTopRow}>
          <BrandLogo />
          <Button small variant="tertiary" onClick={onExit} data-setup-exit>
            Save &amp; exit
          </Button>
        </div>
        <div className={styles.setupProgressRow}>
          <div className={styles.progress6} aria-hidden="true">
            {SETUP_STEPS.map((_, i) => (
              <span key={i} className={cx(styles.progressPart, i < step && styles.progressPartOn)} />
            ))}
          </div>
          <p className={styles.setupStep} aria-hidden="true">
            Step {step} of {SETUP_STEP_COUNT}
          </p>
        </div>
      </header>

      <main className={styles.setupMain} id="main">
        <h1 ref={headingRef} tabIndex={-1} className={styles.setupTitle}>
          <span className={styles.visuallyHidden}>
            Step {step} of {SETUP_STEP_COUNT}:{' '}
          </span>
          {def.title}
        </h1>
        <p className={styles.setupHelp}>{def.help}</p>
        {error ? (
          <Banner tone="danger" role="alert">
            {error}
          </Banner>
        ) : null}

        {step === 1 ? (
          <>
            {/* G100 (docs/18 §1): one job — the two first names and the date; the optional full names and the change rule
                (one line + "Learn more") come after them. One sample line instead of a "Sample" tag per field. */}
            <NamesFields setup />
            <SampleLine count={notes.sample.filter((n) => def.paths.some((p) => n.path === p || n.path.startsWith(p + '.'))).length} scope='[data-setup="1"] main' />
            <DateFields theme={theme} setup />
            <SetupFullNames />
            <RightsNote />
            <div className={styles.miniPreview} aria-label="Your envelope page" role="img">
              <PreviewMini slug={initial.slug} previewToken={panel.meta.previewToken} version={panel.previewVersion} />
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <p className={styles.hint} data-photo-count>
              <strong className={styles.counterInline}>
                {filledPhotos} of {theme.photos.length} photos
              </strong>{' '}
              · Each photo is cropped to the shape the design uses.
            </p>
            {hero ? <PhotoSlots slots={[hero]} /> : <PhotoSlots />}
            {/* G121 (docs/18 §1 P2): the setup asks for the one opening photo only; the other places are in Edit → Photos. */}
            {hero && otherSlots.length ? (
              <p className={styles.hint} data-more-photos-later>
                Your website has {otherSlots.length} more photo {otherSlots.length === 1 ? 'place' : 'places'}. Add them any time under Edit → Photos; until
                then guests see a soft placeholder image.
              </p>
            ) : null}
          </>
        ) : null}
        {step === 3 ? (
          <>
            {/* First, so it is seen before anything else on the publish screen (G060-fix). */}
            <SampleDateGate content={content} sample={theme.sample} confirmed={dateConfirmed} onConfirm={setDateConfirmed} onFix={() => onStep(1)} />
            {meta.orderPending ? <OrderPendingNote /> : null}
            <div className={styles.summary} data-publish-summary>
              <p className={styles.summaryNames}>{content.name_display || '—'}</p>
              <p data-card-names>On the invitation card: {cardNames(content)}</p>
              <p>{formatDateLong(content.date, content.locale) ?? '—'}</p>
              <p>{[content.venue?.name, content.venue?.city].filter(Boolean).join(', ') || '—'}</p>
              <p className={styles.summaryUrl}>
                <UrlText url={url} />
              </p>
            </div>
            <div className={styles.setupPreview}>
              <PreviewPane slug={initial.slug} previewToken={panel.meta.previewToken} pages={visiblePages} version={panel.previewVersion} open wide onClose={() => undefined} />
            </div>
            {/* K29: no list or count of sample text here — one calm, honest line; Home shows what is left. */}
            <p className={styles.calmNote} data-calm-note>
              {sampleCount
                ? 'Some details — like the venue, the schedule or your story — still show the design’s sample text. You can change them any time, before or after you publish; Home shows what is left.'
                : filledPhotos < theme.photos.length
                  ? 'You can add more photos and details any time, before or after you publish.'
                  : 'Everything is filled in. You can still change it all after you publish.'}
            </p>
            {(content.partners ?? []).some((p) => !(p.full_name ?? '').trim()) ? (
              <p className={styles.hint}>
                Want surnames on the invitation card? Add them under{' '}
                <button type="button" className={styles.inlineLink} onClick={() => onStep(1)}>
                  Your names and date
                </button>{' '}
                — now or later; adding a surname is always free.
              </p>
            ) : null}
            <RulesBox rights={meta.rights} locale={content.locale} />
            {validation.errors.length ? (
              <Banner tone="danger">
                {validation.errors.length === 1 ? 'One thing needs fixing before you publish.' : `${validation.errors.length} things need fixing before you publish.`}{' '}
                <button type="button" className={styles.inlineLink} onClick={() => onIssues(validation.errors)}>
                  Show me
                </button>
              </Banner>
            ) : null}
          </>
        ) : null}
      </main>

      {/* G121 (docs/18 §1 P2): "Skip for now" sits beside the main button with the same weight (was a small link above it);
          on the publish step one sentence says what publishing does (Notion). */}
      <footer className={cx(styles.setupBar, styles.setupBarPublish)}>
        <div className={styles.setupBarRow}>
          <SaveIndicator state={saveState} message={panel.saveMessage} onSaveNow={() => void panel.flush()} compact />
          {step === SETUP_STEP_COUNT ? (
            <p className={styles.publishExplain} data-publish-explain>
              Guests can open your website with the link. You can keep editing after.
            </p>
          ) : null}
          <div className={styles.setupButtons}>
            {step > 1 ? (
              <Button icon={ArrowLeft} onClick={() => onStep(step - 1)} aria-label="Back" data-setup-back>
                <span className={styles.backLabel}>Back</span>
              </Button>
            ) : null}
            {step < SETUP_STEP_COUNT ? (
              <Button onClick={() => onStep(step + 1)} data-setup-skip>
                Skip for now
              </Button>
            ) : null}
            {step < SETUP_STEP_COUNT ? (
              <Button variant="primary" onClick={next} data-setup-next>
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={Sparkles}
                busy={publishing}
                busyLabel="Publishing…"
                disabled={!ctx.online || ctx.locked || dateBlocked || meta.orderPending}
                onClick={() => void publish()}
                data-setup-publish
              >
                Publish my website
              </Button>
            )}
          </div>
        </div>
        {step === SETUP_STEP_COUNT && !ctx.online ? <p className={styles.hint}>Connect to the internet to publish.</p> : null}
        {step === SETUP_STEP_COUNT && ctx.online && dateBlocked ? (
          <p className={styles.hint} data-publish-blocked>
            Set your wedding date first (or confirm the sample date is yours).
          </p>
        ) : null}
      </footer>
    </div>
  );
}

/** "Ada Lovelace & Grace": the names as the invitation card prints them (full name, else the first name). */
function cardNames(content: ContentRecord): string {
  return (content.partners ?? []).map((p) => (p.full_name ?? '').trim() || p.display_name).filter(Boolean).join(' & ') || '—';
}

/** The shop still has to confirm the Etsy order (manual order checks, G060-fix). */
export function OrderPendingNote() {
  return (
    <Banner tone="info" icon={Hourglass} data-order-pending>
      We are confirming your Etsy order. Everything you set up is saved; you can publish as soon as the order is confirmed. Reload this
      page to check.
    </Banner>
  );
}

/**
 * The first publish while the wedding date is still the design's sample (G060-fix): a blocking note with a way to the
 * date field and an explicit "this is our date" for the couple whose date really is the same.
 */
export function SampleDateGate({
  content,
  sample,
  confirmed,
  onConfirm,
  onFix,
}: {
  content: ContentRecord;
  sample: ContentRecord | null;
  confirmed: boolean;
  onConfirm: (v: boolean) => void;
  onFix: () => void;
}) {
  if (!sampleDateLeft(content, sample)) return null;
  const when = formatDateLong(content.date, content.locale) ?? content.date;
  return (
    <div className={styles.dateGate} role="group" aria-labelledby="date-gate-title" data-sample-date-gate>
      <p id="date-gate-title" className={styles.dateGateTitle}>
        <TriangleAlert size={20} strokeWidth={1.75} aria-hidden="true" />
        Your wedding date is still the design&rsquo;s sample
      </p>
      <p>
        Guests would see <strong>{when}</strong>. Set your real date before you publish.
      </p>
      <Button variant="secondary" icon={CalendarDays} onClick={onFix} data-fix-date>
        Set our date
      </Button>
      <label className={styles.checkRow}>
        <input type="checkbox" checked={confirmed} onChange={(e) => onConfirm(e.target.checked)} data-confirm-sample-date />
        <span>{when} really is our wedding date</span>
      </label>
    </div>
  );
}

/** The envelope page of the real theme, scaled down (step 1 only). */
function PreviewMini({ slug, previewToken, version: raw }: { slug: string; previewToken: string; version: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  // Reload once typing has settled, not after every save (G060-fix).
  const version = useSettledVersion(raw);
  const first = useRef(version);
  useEffect(() => {
    if (version === first.current) return;
    try {
      ref.current?.contentWindow?.location.reload();
    } catch {
      /* next load shows it */
    }
  }, [version]);
  return (
    <iframe
      ref={ref}
      src={`/${slug}?preview=${encodeURIComponent(previewToken)}`}
      title="Your envelope page"
      tabIndex={-1}
      aria-hidden="true"
      className={styles.miniFrame}
      referrerPolicy="no-referrer"
    />
  );
}

export { RIGHTS_HINT_BEFORE, pageShown };
