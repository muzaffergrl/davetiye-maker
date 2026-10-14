'use client';
// First-run setup (G060, docs/16 §5): Names -> Date & time -> Venue -> Photos -> Preview -> Publish.
// One topic per screen, a 6-part progress bar, Back never loses anything (it is all autosaved), every step
// can be skipped, and the step to resume is worked out from the content (another phone finds it too).

import { ArrowLeft, CalendarDays, CircleCheckBig, Copy, Hourglass, Share2, Sparkles, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatDate, formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { fieldId, pageShown, photoAt, prePublishNotes, sampleDateLeft, sampleSummaries, SECTION_TITLES, type PanelState, type PanelTheme, type SectionId } from '../../lib/panel/model.ts';
import { ARCHIVE_AFTER_MONTHS, ARCHIVE_TEXT, changesRuleText, FREE_CHANGES_TEXT, IDENTITY_CHANGE_LIMIT, UNDO_TEXT, type RightsView } from '../../lib/panel/rights.ts';
import { useDeviceZone, usePanelContext } from './fields.tsx';
import { PhotoSlots } from './PhotosSection.tsx';
import { PreviewPane, useSettledVersion } from './PreviewPane.tsx';
import { QrCode } from './QrCode.tsx';
import { DateFields, NamesFields, RIGHTS_HINT_BEFORE, VenueFields } from './sections.tsx';
import { Banner, Button, cx, SaveIndicator } from './ui.tsx';
import type { PanelController } from './usePanel.ts';
import { UrlText } from './views.tsx';
import styles from './panel.module.css';

export const SETUP_STEPS = [
  { title: 'Your names', help: 'As your guests know you. You can add full names for the invitation card.', paths: ['partners', 'name_display', 'initials'] },
  { title: 'When is the wedding?', help: 'The date, the ceremony time and your time zone.', paths: ['date', 'ceremony_time', 'timezone', 'locale'] },
  { title: 'Where is it?', help: 'Guests see the venue on the Details page, with your map link.', paths: ['venue', 'urls.map'] },
  { title: 'Add your photos', help: 'Until you add a photo, your guests see a soft placeholder image. You can add photos later too.', paths: ['media'] },
  { title: 'Check your website', help: 'This is exactly what your guests will see once you publish.', paths: [] },
  { title: 'Publish your website', help: 'You can keep editing after you publish.', paths: [] },
] as const;

const SAMPLE_STEP: Record<number, string[]> = { 2: ['date', 'ceremony_time'], 3: ['venue.name', 'venue.address', 'venue.city'] };

/** Steps (1-6) whose content is filled in and no longer the design's sample text. */
export function doneSteps(content: ContentRecord, theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>, deviceZone: string | null = null): Set<number> {
  const done = new Set<number>();
  const samples = new Set(prePublishNotes(content, theme, { deviceZone }).sample.map((n) => n.path));
  const hasSample = (step: number) => (SAMPLE_STEP[step] ?? []).some((p) => samples.has(p));
  if ((content.partners ?? []).length && content.partners.every((p) => (p.display_name ?? '').trim())) done.add(1);
  if (content.date && content.ceremony_time && !hasSample(2)) done.add(2);
  if ((content.venue?.name ?? '').trim() && (content.venue?.city ?? '').trim() && !hasSample(3)) done.add(3);
  if (!theme.photos.length || theme.photos.some((s) => photoAt(content, s.source))) done.add(4);
  return done;
}

/** The first step not done yet (5 = check, when 1–4 are done). */
export function firstOpenStep(content: ContentRecord, theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>, deviceZone: string | null = null): number {
  const done = doneSteps(content, theme, deviceZone);
  for (let s = 1; s <= 4; s++) if (!done.has(s)) return s;
  return 5;
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
  onOpenSection,
  onPublished,
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
  onOpenSection: (id: SectionId, path?: string) => void;
  onPublished: () => void;
  onIssues: (issues: ValidationIssue[], message?: string) => void;
}) {
  const { content, validation, meta, saveState } = panel;
  const ctx = usePanelContext();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const def = SETUP_STEPS[step - 1];
  const deviceZone = useDeviceZone();
  const notes = prePublishNotes(content, theme, { deviceZone });
  // The first publish waits while the date is still the design's sample (G060-fix), unless the couple confirms it.
  const [dateConfirmed, setDateConfirmed] = useState(false);
  const dateBlocked = sampleDateLeft(content, theme.sample) && !dateConfirmed;

  useEffect(() => {
    writeSetup(initial.slug, { step });
    setError(null);
    headingRef.current?.focus();
    document.title = `Step ${step} of 6 · ${def.title}`;
  }, [step, initial.slug, def.title]);
  useEffect(() => setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function'), []);

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setError(null);
    } catch {
      /* the link is visible to copy by hand */
    }
  };

  if (published) {
    return (
      <div className={styles.setup} data-setup-done>
        <main className={styles.setupMain} id="main">
          <div className={styles.success}>
            <span className={styles.successIcon} aria-hidden="true">
              <CircleCheckBig size={40} strokeWidth={1.5} />
            </span>
            <h1 ref={headingRef} tabIndex={-1} className={styles.setupTitle}>
              Your website is live
            </h1>
            <p className={styles.setupHelp}>Guests can open it now. Share the link or print the QR code.</p>
            <p className={styles.bigUrl} data-live-link>
              <UrlText url={url} />
            </p>
            <div className={styles.buttonRow}>
              <Button icon={Copy} onClick={() => void copy()}>
                Copy link
              </Button>
              {canShare ? (
                <Button icon={Share2} onClick={() => void navigator.share({ url }).catch(() => undefined)}>
                  Share
                </Button>
              ) : null}
            </div>
            <QrCode url={url} fileBase={initial.slug} />
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
      <header className={styles.setupTop}>
        <div className={styles.setupTopRow}>
          <p className={styles.setupStep} aria-hidden="true">
            Step {step} of 6
          </p>
          <Button small variant="tertiary" onClick={onExit} data-setup-exit>
            Save &amp; exit
          </Button>
        </div>
        <div className={styles.progress6} aria-hidden="true">
          {SETUP_STEPS.map((_, i) => (
            <span key={i} className={cx(styles.progressPart, i < step && styles.progressPartOn)} />
          ))}
        </div>
      </header>

      <main className={styles.setupMain} id="main">
        <h1 ref={headingRef} tabIndex={-1} className={styles.setupTitle}>
          <span className={styles.visuallyHidden}>Step {step} of 6: </span>
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
            <NamesFields setup />
            <div className={styles.miniPreview} aria-label="Your envelope page" role="img">
              <PreviewMini slug={initial.slug} previewToken={panel.meta.previewToken} version={panel.previewVersion} />
            </div>
          </>
        ) : null}
        {step === 2 ? <DateFields theme={theme} setup /> : null}
        {step === 3 ? <VenueFields setup /> : null}
        {step === 4 ? <PhotoSlots intro="count" /> : null}
        {step === 5 ? (
          <>
            <div className={styles.setupPreview}>
              <PreviewPane slug={initial.slug} previewToken={panel.meta.previewToken} pages={visiblePages} version={panel.previewVersion} open wide onClose={() => undefined} />
            </div>
            {notes.sample.length ? (
              <div className={styles.stack}>
                <h2 className={styles.subTitle}>Still sample text</h2>
                <ul className={styles.checklist}>
                  {sampleSummaries(notes.sample).map((s) => (
                    <li key={s.section}>
                      <button type="button" className={cx(styles.checkItem, styles.check_warning)} onClick={() => onOpenSection(s.section, s.path)} data-sample-line>
                        <span className={styles.checkDot} aria-hidden="true" />
                        <span className={styles.checkText}>
                          <strong>{SECTION_TITLES[s.section]}:</strong> {s.what}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className={styles.allSet}>
                <CircleCheckBig size={20} strokeWidth={1.75} aria-hidden="true" />
                No sample text left from the design.
              </p>
            )}
          </>
        ) : null}
        {step === 6 ? (
          <>
            {/* First, so it is seen before anything else on the publish screen (G060-fix). */}
            <SampleDateGate content={content} sample={theme.sample} confirmed={dateConfirmed} onConfirm={setDateConfirmed} onFix={() => onStep(2)} />
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
            {(content.partners ?? []).some((p) => !(p.full_name ?? '').trim()) ? (
              <p className={styles.hint}>
                Want surnames on the invitation card? Add them under{' '}
                <button type="button" className={styles.inlineLink} onClick={() => onStep(1)}>
                  Your names
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

      <footer className={cx(styles.setupBar, step === 6 && styles.setupBarPublish)}>
        {step < 5 ? (
          <button type="button" className={styles.skip} onClick={() => onStep(step + 1)} data-setup-skip>
            Skip for now
          </button>
        ) : null}
        <div className={styles.setupBarRow}>
          <SaveIndicator state={saveState} message={panel.saveMessage} onSaveNow={() => void panel.flush()} compact />
          <div className={styles.setupButtons}>
            {step > 1 ? (
              <Button icon={ArrowLeft} onClick={() => onStep(step - 1)} aria-label="Back" data-setup-back>
                <span className={styles.backLabel}>Back</span>
              </Button>
            ) : null}
            {step < 6 ? (
              <Button variant="primary" onClick={next} data-setup-next>
                {step === 5 ? 'Looks good' : 'Continue'}
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
        {step === 6 && !ctx.online ? <p className={styles.hint}>Connect to the internet to publish.</p> : null}
        {step === 6 && ctx.online && dateBlocked ? (
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
      We are confirming your Etsy order. Everything you set up is saved; you can publish as soon as the order is confirmed.
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
