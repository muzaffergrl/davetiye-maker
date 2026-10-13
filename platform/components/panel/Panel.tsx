'use client';
// The buyer's edit panel (G039): phone-first editor for one site.
// Sections (accordion) write into the content record; autosave stores the draft; the preview
// shows the draft; Publish copies the draft to the public site; the live link gets a real QR.

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { formatDate, formatDateLong, formatTime } from '../../lib/content/format.ts';
import {
  defaultNameDisplay,
  fieldId,
  photoAt,
  publicSiteUrl,
  SECTION_IDS,
  SECTION_TITLES,
  sectionForPath,
  type PanelState,
  type SectionId,
} from '../../lib/panel/model.ts';
import { IssueList, PanelContext, Section, type PanelContextValue } from './fields.tsx';
import { PhotosSection } from './PhotosSection.tsx';
import { PreviewPane } from './PreviewPane.tsx';
import { QrCode } from './QrCode.tsx';
import { CoupleFields, DateFields, DetailsFields, OptionalFields, RsvpFields, ScheduleFields, StoryFields, VenueFields } from './sections.tsx';
import { Sheet } from './Sheet.tsx';
import { usePanel, type SaveState } from './usePanel.ts';
import styles from './panel.module.css';

const WIDE_QUERY = '(min-width: 960px)';

function useWide(): boolean {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

const SAVE_LABELS: Record<SaveState, string> = {
  saved: 'All changes saved',
  pending: 'Unsaved changes',
  saving: 'Saving…',
  retrying: 'Not saved yet. Trying again…',
  refused: 'These changes could not be saved.',
  conflict: 'Saving paused',
  unauthorized: 'Saving paused',
};

type Dialog =
  | { kind: 'issues'; issues: ValidationIssue[]; message?: string }
  | { kind: 'live'; justPublished: boolean }
  | { kind: 'offline' }
  | { kind: 'message'; title: string; text: string };

export default function Panel({ initial, editKey }: { initial: PanelState; editKey: string }) {
  const panel = usePanel(initial, editKey);
  const { content, meta, saveState, validation, locked } = panel;
  const theme = initial.theme;
  const wide = useWide();
  const [open, setOpen] = useState<SectionId | null>('couple');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = publicSiteUrl(initial.origin, initial.slug);

  const issuesByPath = useMemo(() => {
    const map = new Map<string, ValidationIssue[]>();
    for (const i of [...validation.errors, ...validation.warnings]) {
      if (!map.has(i.path)) map.set(i.path, []);
      map.get(i.path)!.push(i);
    }
    return map;
  }, [validation]);

  const ctx: PanelContextValue = useMemo(
    () => ({ content, edit: panel.edit, issuesAt: (p: string) => issuesByPath.get(p) ?? [], locked }),
    [content, panel.edit, issuesByPath, locked],
  );

  const errorCount = (id: SectionId) => validation.errors.filter((i) => sectionForPath(i.path) === id).length;
  const generalIssues = [...validation.errors, ...validation.warnings].filter((i) => sectionForPath(i.path) === null);

  const goTo = useCallback((path: string) => {
    const section = sectionForPath(path);
    setDialog(null);
    setPreviewOpen(false);
    if (section) setOpen(section);
    setTimeout(() => {
      const el = document.getElementById(fieldId(path)) ?? (section ? document.getElementById(`section-${section}`) : null);
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el?.focus({ preventScroll: true });
    }, 60);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setDialog({ kind: 'message', title: 'Copy the link', text: url });
    }
  };

  const upToDate = meta.status === 'published' && !meta.hasUnpublishedChanges && saveState === 'saved';
  const publishLabel = meta.status !== 'published' ? 'Publish' : upToDate ? 'Share' : 'Publish changes';

  const onPublish = async () => {
    if (upToDate) return setDialog({ kind: 'live', justPublished: false });
    if (validation.errors.length) return setDialog({ kind: 'issues', issues: validation.errors });
    setBusy(true);
    const res = await panel.publish();
    setBusy(false);
    if (res.ok) setDialog({ kind: 'live', justPublished: true });
    else if (res.issues?.length) setDialog({ kind: 'issues', issues: res.issues, message: res.message });
    else setDialog({ kind: 'message', title: 'Not published', text: res.message ?? 'The website could not be published. Please try again.' });
  };

  const onUnpublish = async () => {
    setBusy(true);
    const res = await panel.unpublish();
    setBusy(false);
    setDialog(res.ok ? null : { kind: 'message', title: 'Still online', text: res.message ?? 'Please try again.' });
  };

  const blocks = content.optional_blocks ?? {};
  const summaries: Record<SectionId, string> = {
    couple: content.name_display || defaultNameDisplay(content.partners ?? []) || 'Add your names',
    date: [formatDateLong(content.date, content.locale), formatTime(content.ceremony_time, content.locale)].filter(Boolean).join(' · ') || 'Add the date',
    venue: [content.venue?.name, content.venue?.city].filter(Boolean).join(', ') || 'Add the venue',
    schedule: `${content.schedule?.length ?? 0} ${content.schedule?.length === 1 ? 'event' : 'events'}`,
    story: `${content.story?.items?.length ?? 0} moments${blocks.our_story === true ? '' : ' · page off'}`,
    details:
      [content.dress_code ? 'dress code' : '', content.urls?.map ? 'map' : '', content.urls?.accommodation ? 'travel' : '', content.urls?.registry ? 'registry' : '']
        .filter(Boolean)
        .join(', ') || 'Dress code and links',
    rsvp: content.rsvp?.method === 'none' ? 'Replies off' : `Reply by ${formatDate(content.rsvp?.deadline, content.locale) ?? '…'}`,
    optional: `${theme.optionalBlocks.filter((k) => blocks[k] === true).length} of ${theme.optionalBlocks.length} on`,
    photos: `${theme.photos.filter((s) => photoAt(content, s.source)).length} of ${theme.photos.length} added`,
  };

  const sectionBody = (id: SectionId) => {
    switch (id) {
      case 'couple':
        return <CoupleFields />;
      case 'date':
        return <DateFields />;
      case 'venue':
        return <VenueFields />;
      case 'schedule':
        return <ScheduleFields />;
      case 'story':
        return <StoryFields onOpenOptional={() => goTo('optional_blocks')} />;
      case 'details':
        return <DetailsFields optionalBlocks={theme.optionalBlocks} />;
      case 'rsvp':
        return <RsvpFields api={panel.api} published={meta.status === 'published'} />;
      case 'optional':
        return <OptionalFields optionalBlocks={theme.optionalBlocks} />;
      case 'photos':
        return <PhotosSection slots={theme.photos} onUpload={panel.uploadPhoto} onRemove={panel.removePhoto} />;
    }
  };

  return (
    <PanelContext.Provider value={ctx}>
      <div className={styles.app} data-panel data-status={meta.status}>
        <div className={styles.layout}>
          <main className={styles.main}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>Edit your website</p>
              <h1 className={styles.title}>{content.name_display || 'Your names'}</h1>
              <p className={styles.headerMeta}>{[formatDateLong(content.date, content.locale), theme.name].filter(Boolean).join(' · ')}</p>
            </header>

            {saveState === 'conflict' || saveState === 'unauthorized' ? (
              <div className={styles.banner} role="alert">
                <p>{panel.saveMessage ?? 'Saving is paused.'}</p>
                <button type="button" className={styles.primaryButton} onClick={() => window.location.reload()}>
                  Reload
                </button>
              </div>
            ) : null}

            <section className={styles.statusCard} aria-labelledby="status-title" data-status-card>
              {meta.status === 'published' ? (
                <>
                  <p className={`${styles.pill} ${styles.pillLive}`}>Live</p>
                  <h2 id="status-title" className={styles.statusTitle}>
                    Your website is published
                  </h2>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={styles.siteLink} data-public-link>
                    {url}
                  </a>
                  <div className={styles.buttonRow}>
                    <button type="button" className={styles.secondaryButton} onClick={copyLink}>
                      {copied ? 'Copied' : 'Copy link'}
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={() => setDialog({ kind: 'live', justPublished: false })}>
                      QR code
                    </button>
                  </div>
                  {meta.hasUnpublishedChanges || saveState !== 'saved' ? (
                    <p className={styles.note}>You have changes your guests cannot see yet. Tap “Publish changes” to update the site.</p>
                  ) : null}
                  <button type="button" className={`${styles.linkButton} ${styles.dangerText}`} disabled={locked} onClick={() => setDialog({ kind: 'offline' })}>
                    Take the website offline
                  </button>
                </>
              ) : (
                <>
                  <p className={`${styles.pill} ${styles.pillDraft}`}>{meta.publishedAt ? 'Offline' : 'Not published'}</p>
                  <h2 id="status-title" className={styles.statusTitle}>
                    {meta.publishedAt ? 'Your website is offline' : 'Your website is a draft'}
                  </h2>
                  <p className={styles.hint}>
                    {meta.publishedAt
                      ? 'Guests see “Page not found” until you publish again.'
                      : 'Fill in the sections below and check the preview. Guests can see your site once you publish it.'}
                  </p>
                  <p className={styles.hint}>
                    Address after publishing: <span className={styles.address}>{url}</span>
                  </p>
                </>
              )}
            </section>

            <IssueList issues={generalIssues} />

            <div className={styles.sections}>
              {SECTION_IDS.map((id) => (
                <Section
                  key={id}
                  id={id}
                  title={SECTION_TITLES[id]}
                  summary={summaries[id]}
                  errorCount={errorCount(id)}
                  open={open === id}
                  onToggle={() => setOpen((cur) => (cur === id ? null : id))}
                >
                  {sectionBody(id)}
                </Section>
              ))}
            </div>
          </main>

          <aside className={styles.previewColumn}>
            <PreviewPane
              slug={initial.slug}
              previewKey={initial.previewKey}
              pages={theme.pages}
              version={panel.previewVersion}
              open={previewOpen}
              wide={wide}
              onClose={() => setPreviewOpen(false)}
            />
          </aside>
        </div>

        <div className={styles.bar}>
          <div className={styles.barInner}>
            <p className={styles.saveStatus} role="status" aria-live="polite" data-save-state={saveState}>
              <span className={`${styles.dot} ${styles[`dot_${saveState}`] ?? ''}`} aria-hidden="true" />
              {saveState === 'refused' && panel.saveMessage ? panel.saveMessage : SAVE_LABELS[saveState]}
            </p>
            <div className={styles.barButtons}>
              <button type="button" className={styles.barButton} disabled={locked || saveState === 'saved' || saveState === 'saving'} onClick={() => void panel.flush()}>
                Save
              </button>
              {!wide ? (
                <button type="button" className={styles.barButton} onClick={() => setPreviewOpen(true)} data-open-preview>
                  Preview
                </button>
              ) : null}
              <button type="button" className={`${styles.barButton} ${styles.barPrimary}`} disabled={locked || busy} onClick={() => void onPublish()} data-publish>
                {busy ? 'Working…' : publishLabel}
              </button>
            </div>
          </div>
        </div>

        {dialog?.kind === 'issues' ? (
          <Sheet title="Before you publish" onClose={() => setDialog(null)} testId="issues">
            <p>{dialog.message ?? 'Please fix these first:'}</p>
            <ul className={styles.issueJumpList}>
              {dialog.issues.map((i, n) => {
                const section = sectionForPath(i.path);
                return (
                  <li key={`${i.path}-${n}`}>
                    <button type="button" className={styles.issueJump} onClick={() => goTo(i.path)}>
                      <span className={styles.issueJumpSection}>{section ? SECTION_TITLES[section] : 'General'}</span>
                      <span>{i.message}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Sheet>
        ) : null}

        {dialog?.kind === 'live' ? (
          <Sheet title={dialog.justPublished ? 'Your website is live' : 'Share your website'} onClose={() => setDialog(null)} testId="live">
            <p>Guests can open your website at:</p>
            <p>
              <a href={url} target="_blank" rel="noopener noreferrer" className={styles.siteLink} data-live-link>
                {url}
              </a>
            </p>
            <div className={styles.buttonRow}>
              <button type="button" className={styles.secondaryButton} onClick={copyLink}>
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <a href={url} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
                Open website
              </a>
            </div>
            <QrCode url={url} fileBase={initial.slug} />
            <p className={styles.hint}>This QR code opens {url}. Scan it with your phone camera once to check it before you print it.</p>
          </Sheet>
        ) : null}

        {dialog?.kind === 'offline' ? (
          <Sheet title="Take your website offline?" onClose={() => setDialog(null)} closeLabel="Cancel" testId="offline">
            <p>Guests will see “Page not found” until you publish again. Your text and photos are kept.</p>
            <div className={styles.buttonRow}>
              <button type="button" className={`${styles.primaryButton} ${styles.dangerButton}`} disabled={busy} onClick={() => void onUnpublish()} data-confirm-offline>
                Take offline
              </button>
              <button type="button" className={styles.secondaryButton} onClick={() => setDialog(null)}>
                Keep it online
              </button>
            </div>
          </Sheet>
        ) : null}

        {dialog?.kind === 'message' ? (
          <Sheet title={dialog.title} onClose={() => setDialog(null)}>
            <p className={styles.breakAll}>{dialog.text}</p>
          </Sheet>
        ) : null}
      </div>
    </PanelContext.Provider>
  );
}

