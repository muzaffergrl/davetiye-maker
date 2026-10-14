'use client';
// First-run setup (G060, docs/16 §5): Names -> Date & time -> Venue -> Photos -> Preview -> Publish.
// One topic per screen, a 6-part progress bar, Back never loses anything (it is all autosaved), every step
// can be skipped, and the step to resume is worked out from the content (another phone finds it too).

import { ArrowLeft, Check, CircleCheckBig, Copy, ExternalLink, Pencil, Share2, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatDate, formatDateLong } from '../../lib/content/format.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { fieldId, pageShown, photoAt, prePublishNotes, sectionForPath, type PanelState, type PanelTheme, type PublishNote, type SectionId } from '../../lib/panel/model.ts';
import { ARCHIVE_AFTER_MONTHS, IDENTITY_CHANGE_LIMIT, TYPO_MAX_DISTANCE, type RightsView } from '../../lib/panel/rights.ts';
import { usePanelContext } from './fields.tsx';
import { PhotoSlots } from './PhotosSection.tsx';
import { PreviewPane } from './PreviewPane.tsx';
import { QrCode } from './QrCode.tsx';
import { DateFields, NamesFields, RIGHTS_HINT_BEFORE, VenueFields } from './sections.tsx';
import { Banner, Button, cx, SaveIndicator } from './ui.tsx';
import type { PanelController } from './usePanel.ts';
import { sampleLabel, UrlText } from './views.tsx';
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
export function doneSteps(content: ContentRecord, theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>): Set<number> {
  const done = new Set<number>();
  const samples = new Set(prePublishNotes(content, theme).sample.map((n) => n.path));
  const hasSample = (step: number) => (SAMPLE_STEP[step] ?? []).some((p) => samples.has(p));
  if ((content.partners ?? []).length && content.partners.every((p) => (p.display_name ?? '').trim())) done.add(1);
  if (content.date && content.ceremony_time && !hasSample(2)) done.add(2);
  if ((content.venue?.name ?? '').trim() && (content.venue?.city ?? '').trim() && !hasSample(3)) done.add(3);
  if (!theme.photos.length || theme.photos.some((s) => photoAt(content, s.source))) done.add(4);
  return done;
}

/** The first step not done yet (5 = check, when 1–4 are done). */
export function firstOpenStep(content: ContentRecord, theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>): number {
  const done = doneSteps(content, theme);
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
        <li>
          After you publish, you can change your names and wedding date <strong>{total} times</strong>. Fixing a small typo (up to {TYPO_MAX_DISTANCE} letters or
          digits) is free.
        </li>
        <li>Everything else — time, venue, schedule, story, photos, details and replies — you can change as often as you like.</li>
        <li>
          Your website stays online until <strong>{until ?? `${ARCHIVE_AFTER_MONTHS} months after your wedding`}</strong>
          {until ? `, ${ARCHIVE_AFTER_MONTHS} months after your wedding` : ''}. Then it becomes a read-only archive.
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
  // Copy feedback stays on this screen (button says "Copied" + a status line): the panel's snackbar would sit on top
  // of "Go to my editor" here, where there is no bottom navigation, and catch taps on it for 6 s.
  const [copyState, setCopyState] = useState<'copied' | 'failed' | null>(null);
  const copied = copyState === 'copied';
  const def = SETUP_STEPS[step - 1];
  const notes = prePublishNotes(content, theme);
  const sampleCount = notes.sample.length;

  useEffect(() => {
    writeSetup(initial.slug, { step });
    setError(null);
    headingRef.current?.focus();
    document.title = `Step ${step} of 6 · ${def.title}`;
  }, [step, initial.slug, def.title]);
  useEffect(() => setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function'), []);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopyState(null), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const stepIssues = validation.errors.filter((i) => def.paths.some((p) => i.path === p || i.path.startsWith(`${p}.`)));
  const stepSamples = notes.sample.filter((n) => def.paths.some((p) => n.path === p || n.path.startsWith(`${p}.`)));

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
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  /** Opens the first sample item's section above the wizard ("Done" comes back to this step). */
  const fixFirstSample = () => {
    const first = notes.sample[0];
    if (first) onOpenSection(sectionForPath(first.path) ?? 'names', first.path);
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
            <p>
              <a href={url} target="_blank" rel="noopener noreferrer" className={styles.bigUrl} data-live-link>
                <UrlText url={url} />
              </a>
            </p>
            <div className={styles.buttonRow}>
              <Button icon={copied ? Check : Copy} onClick={() => void copy()} data-copy-link>
                {copied ? 'Copied' : 'Copy link'}
              </Button>
              <a href={url} target="_blank" rel="noopener noreferrer" className={cx(styles.btn, styles.btn_secondary)} data-open-site>
                <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
                <span>Open website</span>
              </a>
              {canShare ? (
                <Button icon={Share2} onClick={() => void navigator.share({ url }).catch(() => undefined)}>
                  Share
                </Button>
              ) : null}
            </div>
            <p role="status" className={copyState === 'failed' ? styles.hint : styles.visuallyHidden} data-copy-status>
              {copyState === 'copied' ? 'Link copied' : copyState === 'failed' ? 'Could not copy. Press and hold the link above to copy it.' : ''}
            </p>
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
        {stepSamples.length ? <Banner tone="warning">These are still the sample details from the design.</Banner> : null}

        {step === 1 ? (
          <>
            <NamesFields setup />
            <div className={styles.miniPreview} aria-label="Your envelope page" role="img">
              <PreviewMini slug={initial.slug} previewKey={initial.previewKey} version={panel.previewVersion} />
            </div>
          </>
        ) : null}
        {step === 2 ? <DateFields theme={theme} setup /> : null}
        {step === 3 ? <VenueFields setup /> : null}
        {step === 4 ? <PhotoSlots intro="count" /> : null}
        {step === 5 ? (
          <>
            <div className={styles.setupPreview}>
              <PreviewPane slug={initial.slug} previewKey={initial.previewKey} pages={visiblePages} version={panel.previewVersion} open wide onClose={() => undefined} />
            </div>
            {sampleCount ? (
              <SampleChecklist notes={notes.sample} onOpen={onOpenSection} />
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
            <div className={styles.summary} data-publish-summary>
              <p className={styles.summaryNames}>{content.name_display || '—'}</p>
              <p>{formatDateLong(content.date, content.locale) ?? '—'}</p>
              <p>{[content.venue?.name, content.venue?.city].filter(Boolean).join(', ') || '—'}</p>
              <p className={styles.summaryUrl}>
                <UrlText url={url} />
              </p>
            </div>
            {sampleCount ? (
              <>
                <Banner tone="warning">
                  {sampleCount === 1 ? 'One thing on your website is' : `${sampleCount} things on your website are`} still sample text from the design. Your
                  guests will see {sampleCount === 1 ? 'it' : 'them'} as written. Tap one to change it, or publish now and change {sampleCount === 1 ? 'it' : 'them'} later.
                </Banner>
                <SampleChecklist notes={notes.sample} onOpen={onOpenSection} />
              </>
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

      <footer className={styles.setupBar}>
        {step < 5 ? (
          <button type="button" className={styles.skip} onClick={() => onStep(step + 1)} data-setup-skip>
            Skip for now
          </button>
        ) : null}
        {step === 5 && sampleCount ? (
          <button type="button" className={styles.skip} onClick={() => onStep(6)} data-setup-anyway>
            Publish anyway
          </button>
        ) : null}
        <div className={styles.setupBarRow}>
          <SaveIndicator state={saveState} message={panel.saveMessage} onSaveNow={() => void panel.flush()} compact />
          <div className={styles.setupButtons}>
            {step > 1 ? (
              <Button icon={ArrowLeft} onClick={() => onStep(step - 1)} data-setup-back>
                Back
              </Button>
            ) : null}
            {step === 5 && sampleCount ? (
              <Button variant="primary" icon={Pencil} onClick={fixFirstSample} data-setup-fix>
                {sampleCount === 1 ? 'Fix 1 item' : `Fix ${sampleCount} items`}
              </Button>
            ) : step < 6 ? (
              <Button variant="primary" onClick={next} data-setup-next>
                {step === 5 ? 'Looks good' : 'Continue'}
              </Button>
            ) : (
              <Button variant="primary" icon={Sparkles} busy={publishing} busyLabel="Publishing…" disabled={!ctx.online || ctx.locked} onClick={() => void publish()} data-setup-publish>
                Publish my website
              </Button>
            )}
          </div>
        </div>
        {step === 6 && !ctx.online ? <p className={styles.hint}>Connect to the internet to publish.</p> : null}
      </footer>
    </div>
  );
}

function groupNotes(notes: PublishNote[]): Array<[SectionId, PublishNote[]]> {
  const map = new Map<SectionId, PublishNote[]>();
  for (const n of notes) {
    const s = sectionForPath(n.path) ?? 'names';
    if (!map.has(s)) map.set(s, []);
    map.get(s)!.push(n);
  }
  return [...map.entries()];
}

/** "Story intro, captions" — the short field names of one section's sample items (same words as Home's next steps). */
function sampleText(list: PublishNote[]): string {
  const text = list.map(sampleLabel).filter((v, i, a) => a.indexOf(v) === i).join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * "Still sample text from the design (N)": the same items as the editor's first-publish sheet, grouped by section.
 * Steps 5 and 6 (the publish moment) both show it; a tap opens the section and "Done" comes back to the step.
 */
function SampleChecklist({ notes, onOpen }: { notes: PublishNote[]; onOpen: (id: SectionId, path?: string) => void }) {
  return (
    <div className={styles.stack} data-sample-list={notes.length}>
      <h2 className={styles.subTitle}>Still sample text from the design ({notes.length})</h2>
      <ul className={styles.checklist}>
        {groupNotes(notes).map(([section, list]) => (
          <li key={section}>
            <button type="button" className={cx(styles.checkItem, styles.check_warning)} onClick={() => onOpen(section, list[0].path)}>
              <span className={styles.checkDot} aria-hidden="true" />
              <span className={styles.checkText}>{sampleText(list)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The envelope page of the real theme, scaled down (step 1 only). */
function PreviewMini({ slug, previewKey, version }: { slug: string; previewKey: string; version: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
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
      src={`/${slug}?preview=${encodeURIComponent(previewKey)}`}
      title="Your envelope page"
      tabIndex={-1}
      aria-hidden="true"
      className={styles.miniFrame}
      referrerPolicy="no-referrer"
    />
  );
}

export { RIGHTS_HINT_BEFORE, pageShown };
