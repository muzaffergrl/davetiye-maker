'use client';
// The buyer's edit panel, v2 (G039 -> G060, docs/16_PANEL_V2.md). Phone first.
//
// Views are hash routes on the one /edit/<slug>?k=… page (the key stays in the query; back/forward and
// bookmarks work):  #setup/1…6 · #home · #edit · #edit/<section> · #guests · #share.
// A site that was never published opens the setup wizard (until it is finished or closed on this phone);
// everything else opens Home. Autosave, the live preview, publish and the edit-rights rules work the same
// in every view (usePanel.ts). Neutral UI only: the colour on screen is the design's own preview (K21).

import {
  Archive,
  ArrowLeft,
  CircleCheckBig,
  Copy,
  ExternalLink,
  Eye,
  House,
  Pencil,
  Send,
  Share2,
  TriangleAlert,
  Users,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { formatDate, formatDateLong, formatTime } from '../../lib/content/format.ts';
import { PANEL_BRAND } from '../../lib/panel/brand.ts';
import {
  defaultNameDisplay,
  fieldId,
  pageShown,
  photoAt,
  prePublishNotes,
  publicSiteUrl,
  SECTION_IDS,
  SECTION_TITLES,
  sectionForPath,
  type PanelState,
  type PublishNote,
  type SectionId,
} from '../../lib/panel/model.ts';
import { identityOf } from '../../lib/panel/rights.ts';
import { IdentitySheet } from './IdentitySheet.tsx';
import { PanelContext, type PanelContextValue } from './fields.tsx';
import { PhotoSlots } from './PhotosSection.tsx';
import { PreviewPane } from './PreviewPane.tsx';
import { QrCode } from './QrCode.tsx';
import { DateFields, DetailsFields, FaqFields, NamesFields, RsvpFields, ScheduleFields, StoryFields, VenueFields } from './sections.tsx';
import { firstOpenStep, readSetup, RulesBox, Setup, writeSetup } from './Setup.tsx';
import { Sheet } from './Sheet.tsx';
import { Badge, Banner, Button, cx, IconButton, SaveIndicator, SnackbarProvider, useSnackbar } from './ui.tsx';
import { usePanel } from './usePanel.ts';
import { EditListView, GuestsView, HelpSheet, HomeView, nextSteps, SECTION_ICONS, ShareView, UrlText, useReplies } from './views.tsx';
import styles from './panel.module.css';

type Route =
  | { view: 'setup'; step: number }
  | { view: 'home' }
  | { view: 'edit' }
  | { view: 'section'; id: SectionId }
  | { view: 'guests' }
  | { view: 'share' };

function parseHash(hash: string): Route | null {
  const h = hash.replace(/^#/, '');
  let m: RegExpExecArray | null;
  if ((m = /^setup\/([1-6])$/.exec(h))) return { view: 'setup', step: Number(m[1]) };
  if (h === 'home') return { view: 'home' };
  if (h === 'edit') return { view: 'edit' };
  if ((m = /^edit\/([a-z]+)$/.exec(h)) && (SECTION_IDS as readonly string[]).includes(m[1])) return { view: 'section', id: m[1] as SectionId };
  if (h === 'guests') return { view: 'guests' };
  if (h === 'share') return { view: 'share' };
  return null;
}

function hashOf(r: Route): string {
  switch (r.view) {
    case 'setup':
      return `#setup/${r.step}`;
    case 'section':
      return `#edit/${r.id}`;
    default:
      return `#${r.view}`;
  }
}

function useMedia(query: string): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setOn(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return on;
}

type Dialog =
  | { kind: 'issues'; issues: ValidationIssue[]; message?: string }
  | { kind: 'prepublish' }
  | { kind: 'live'; justPublished: boolean }
  | { kind: 'offline' }
  | { kind: 'message'; title: string; text: string }
  | { kind: 'help'; topic?: string }
  | { kind: 'identity'; focus: 'names' | 'date' };

const ROOT_VIEWS: Array<{ view: 'home' | 'edit' | 'guests' | 'share'; label: string; icon: LucideIcon }> = [
  { view: 'home', label: 'Home', icon: House },
  { view: 'edit', label: 'Edit', icon: Pencil },
  { view: 'guests', label: 'Guests', icon: Users },
  { view: 'share', label: 'Share', icon: Share2 },
];

export default function Panel(props: { initial: PanelState; editKey: string }) {
  return (
    <SnackbarProvider>
      <PanelApp {...props} />
    </SnackbarProvider>
  );
}

function PanelApp({ initial, editKey }: { initial: PanelState; editKey: string }) {
  const panel = usePanel(initial, editKey);
  const { content, meta, saveState, validation, locked, online } = panel;
  const theme = initial.theme;
  const rights = meta.rights;
  const wide = useMedia('(min-width: 960px)');
  const snack = useSnackbar();
  const url = publicSiteUrl(initial.origin, initial.slug);
  const names = content.name_display || defaultNameDisplay(content.partners ?? []) || 'Your website';
  const neverPublished = !meta.publishedAt && meta.status !== 'published' && rights.phase === 'before_publish';

  // ---------------------------------------------------------------- routing
  const defaultRoute = (): Route => (neverPublished ? { view: 'setup', step: firstOpenStep(content, theme) } : { view: 'home' });
  const [route, setRoute] = useState<Route>(() => defaultRoute());
  const [ready, setReady] = useState(false);
  const navCount = useRef(0);
  const [returnTo, setReturnTo] = useState<string | null>(null);

  useEffect(() => {
    const fromHash = parseHash(window.location.hash);
    let start: Route;
    if (fromHash && !(fromHash.view === 'setup' && !neverPublished)) start = fromHash;
    else if (neverPublished && !readSetup(initial.slug).dismissed) {
      const saved = readSetup(initial.slug).step;
      start = { view: 'setup', step: saved && saved >= 1 && saved <= 6 ? saved : firstOpenStep(content, theme) };
    } else start = { view: 'home' };
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hashOf(start)}`);
    setRoute(start);
    setReady(true);
    const onHash = () => {
      const r = parseHash(window.location.hash);
      if (r) setRoute(r);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback((r: Route | string, replace = false) => {
    const hash = typeof r === 'string' ? r : hashOf(r);
    if (replace) {
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`);
      const parsed = parseHash(hash);
      if (parsed) setRoute(parsed);
    } else {
      navCount.current += 1;
      window.location.hash = hash;
    }
  }, []);

  // Focus and document title follow the view (WCAG 2.4.3); the heading of each view has tabIndex -1.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstFocus = useRef(true);
  useEffect(() => {
    if (!ready || route.view === 'setup') return;
    const label = route.view === 'section' ? SECTION_TITLES[route.id] : ROOT_VIEWS.find((v) => v.view === route.view)?.label;
    document.title = `${label} · ${names}`;
    if (firstFocus.current) {
      firstFocus.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, ready]);

  // Home shows the names large; the bar shows them once that heading has scrolled away (no doubled title).
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---------------------------------------------------------------- derived data
  const issuesByPath = useMemo(() => {
    const map = new Map<string, ValidationIssue[]>();
    for (const i of [...validation.errors, ...validation.warnings]) {
      if (!map.has(i.path)) map.set(i.path, []);
      map.get(i.path)!.push(i);
    }
    return map;
  }, [validation]);
  const notes = useMemo(() => prePublishNotes(content, theme), [content, theme]);
  const samples = useMemo(() => new Set(notes.sample.map((n) => n.path)), [notes]);
  const noteCount = notes.sample.length + notes.photos.length + notes.links.length + notes.empty.length;
  const sectionIds = useMemo(() => SECTION_IDS.filter((id) => id !== 'faq' || theme.fields.faq), [theme.fields.faq]);
  const visiblePages = useMemo(() => theme.pages.filter((p) => pageShown(theme.pageRules[p], content)), [theme, content]);
  const errorCount = (id: SectionId) => validation.errors.filter((i) => sectionForPath(i.path) === id).length;
  const sampleCount = (id: SectionId) => notes.sample.filter((n) => sectionForPath(n.path) === id).length;
  const blocks = content.optional_blocks ?? {};
  const offSections = new Set<SectionId>([
    ...(blocks.our_story === true ? [] : (['story'] as SectionId[])),
    ...(theme.fields.faq && blocks.faq !== true ? (['faq'] as SectionId[]) : []),
    ...(content.rsvp?.method === 'none' ? (['rsvp'] as SectionId[]) : []),
  ]);
  const steps = useMemo(() => nextSteps(validation.errors, notes, content, meta), [validation.errors, notes, content, meta]);
  // Read after mount (localStorage), so the server's and the browser's first render match.
  const [storedStep, setStoredStep] = useState<number | null>(null);
  useEffect(() => setStoredStep(readSetupStep(initial.slug)), [initial.slug, route]);
  const setupStep = neverPublished ? (storedStep ?? firstOpenStep(content, theme)) : null;

  const summaries: Record<SectionId, string> = {
    names: names,
    date: [formatDateLong(content.date, content.locale), formatTime(content.ceremony_time, content.locale)].filter(Boolean).join(' · ') || 'Add the date',
    venue: [content.venue?.name, content.venue?.city].filter(Boolean).join(', ') || 'Add the venue',
    schedule: content.schedule?.length ? `${content.schedule.length} ${content.schedule.length === 1 ? 'event' : 'events'}` : 'Add the order of the day',
    story: `${content.story?.items?.length ?? 0} ${content.story?.items?.length === 1 ? 'moment' : 'moments'}`,
    details:
      [content.dress_code ? 'Dress code' : '', content.urls?.accommodation ? 'Travel & stay' : '', content.urls?.registry ? 'Registry' : ''].filter(Boolean).join(', ') ||
      'Dress code, travel, registry',
    faq: `${content.faq?.length ?? 0} ${content.faq?.length === 1 ? 'question' : 'questions'}`,
    rsvp:
      content.rsvp?.method === 'none'
        ? 'Replies off'
        : `Reply by ${formatDate(content.rsvp?.deadline, content.locale) ?? '…'}${
            content.rsvp?.questions?.length ? ` · ${content.rsvp.questions.length} ${content.rsvp.questions.length === 1 ? 'question' : 'questions'}` : ''
          }`,
    photos: `${theme.photos.filter((s) => photoAt(content, s.source)).length} of ${theme.photos.length} added`,
  };

  // ---------------------------------------------------------------- dialogs and actions
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<string | null>(null);

  const replies = useReplies(panel.api, initial.slug, ready && (route.view === 'home' || route.view === 'guests') && !neverPublished, meta.status === 'published');

  const ctx: PanelContextValue = useMemo(
    () => ({
      content,
      edit: panel.edit,
      issuesAt: (p: string) => issuesByPath.get(p) ?? [],
      locked,
      isSample: (p: string) => samples.has(p),
      previewToken: meta.previewToken,
      fields: theme.fields,
      rights,
      online,
      openIdentity: (focus: 'names' | 'date') => setDialog({ kind: 'identity', focus }),
      photoSlots: theme.photos,
      uploadPhoto: panel.uploadPhoto,
      removePhoto: panel.removePhoto,
    }),
    [content, panel.edit, issuesByPath, locked, samples, meta.previewToken, theme.fields, theme.photos, rights, online, panel.uploadPhoto, panel.removePhoto],
  );

  /** From an issue / note / next step to its field (or a view). */
  const goTo = useCallback(
    (path: string) => {
      setDialog(null);
      setPreviewOpen(false);
      if (path.startsWith('#')) return go(path);
      const section = sectionForPath(path) ?? 'names';
      go({ view: 'section', id: section });
      window.setTimeout(() => {
        const el = document.getElementById(fieldId(path)) ?? document.querySelector<HTMLElement>(`[data-locked-identity] [data-change-identity]`);
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        (el as HTMLElement | null)?.focus({ preventScroll: true });
      }, 120);
    },
    [go],
  );

  const copy = async (text: string, done = 'Link copied') => {
    try {
      await navigator.clipboard.writeText(text);
      snack(done);
    } catch {
      setDialog({ kind: 'message', title: 'Copy the link', text });
    }
  };

  const upToDate = meta.status === 'published' && !meta.hasUnpublishedChanges && saveState === 'saved';

  const doPublish = async () => {
    // The sheet closes at once; the bar's button shows "Publishing…" (the editor stays usable meanwhile).
    setDialog(null);
    setBusy(true);
    const res = await panel.publish();
    setBusy(false);
    if (res.ok) {
      writeSetup(initial.slug, { dismissed: true });
      return setDialog({ kind: 'live', justPublished: true });
    }
    if (res.issues?.length) return setDialog({ kind: 'issues', issues: res.issues, message: res.message });
    setDialog({ kind: 'message', title: 'Not published', text: res.message ?? 'The website could not be published. Please try again.' });
  };

  const startPublish = async () => {
    if (!online) return setDialog({ kind: 'message', title: 'You’re offline', text: 'Connect to the internet to publish. Your changes are kept on this phone.' });
    if (upToDate) return go({ view: 'share' });
    if (validation.errors.length) return setDialog({ kind: 'issues', issues: validation.errors });
    // Every first publish shows the rules (docs/16 §11.7); later ones only when there is something to check.
    if (rights.phase === 'before_publish' || noteCount) return setDialog({ kind: 'prepublish' });
    await doPublish();
  };

  const onUnpublish = async () => {
    setBusy(true);
    const res = await panel.unpublish();
    setBusy(false);
    if (res.ok) {
      setDialog(null);
      snack('Your website is offline');
    } else setDialog({ kind: 'message', title: 'Still online', text: res.message ?? 'Please try again.' });
  };

  // The server kept the stored names/date over an autosave (e.g. another tab): say so once.
  useEffect(() => {
    if (panel.identityKeptAt) snack('Names and date stay as published. Use “Change” to update them.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel.identityKeptAt]);

  // ---------------------------------------------------------------- unauthorized: nothing else works
  if (saveState === 'unauthorized') {
    return (
      <div className={styles.app} data-panel data-status={meta.status}>
        <main className={styles.notice}>
          <TriangleAlert size={32} strokeWidth={1.5} aria-hidden="true" />
          <h1 className={styles.noticeTitle}>This edit link no longer works</h1>
          <p>The link may have been replaced with a new one. If you did not change it, message {PANEL_BRAND.shopName} on Etsy with your order number.</p>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------- setup wizard
  const banners = (
    <>
      {panel.foundBackup ? (
        <Banner
          tone="warning"
          data-backup-banner
          actions={
            <>
              {panel.foundBackup.sameBase ? (
                <Button small variant="primary" onClick={panel.restoreBackup}>
                  Restore
                </Button>
              ) : null}
              <Button small onClick={panel.discardBackup}>
                Discard
              </Button>
            </>
          }
        >
          {panel.foundBackup.sameBase
            ? 'You have unsaved changes from this phone.'
            : 'This phone has older unsaved changes, but your website was changed since (maybe on another device). They can’t be added safely.'}
        </Banner>
      ) : null}
      {!online ? (
        <Banner tone="warning" icon={WifiOff} role="status" data-offline-banner>
          You&rsquo;re offline. {panel.backedUp ? 'Your changes are kept on this phone and saved when you’re back online.' : 'Changes are saved when you’re back online.'}
        </Banner>
      ) : null}
      {saveState === 'conflict' ? (
        <Banner tone="danger" role="alert" actions={<Button small variant="primary" onClick={() => window.location.reload()}>Reload</Button>}>
          {panel.saveMessage ?? 'This website was changed on another device. Reload to get the latest version.'}
        </Banner>
      ) : null}
      {saveState === 'refused' && !rights.archived ? (
        <Banner tone="danger" role="alert" actions={<Button small onClick={() => window.location.reload()}>Reload</Button>}>
          {panel.saveMessage ?? 'These changes could not be saved. Please reload the page.'}
        </Banner>
      ) : null}
      {rights.archived && route.view !== 'home' ? (
        <Banner tone="info" icon={Archive} data-archived-banner>
          Your website was archived on {rights.archiveAt ? formatDate(rights.archiveAt.slice(0, 10), content.locale) : 'its archive date'}. You can still see your
          content and download your replies.
        </Banner>
      ) : null}
    </>
  );

  const preview = (
    <PreviewPane
      slug={initial.slug}
      previewToken={meta.previewToken}
      pages={visiblePages}
      version={panel.previewVersion}
      open={previewOpen}
      wide={wide}
      page={previewPage}
      onClose={() => setPreviewOpen(false)}
    />
  );

  const sheets = (
    <>
      {dialog?.kind === 'issues' ? (
        <Sheet title="Before you publish" onClose={() => setDialog(null)} testId="issues">
          <p>{dialog.message ?? 'Please fix these first:'}</p>
          <IssueJumps notes={dialog.issues.map((i) => ({ path: i.path, message: i.message }))} onJump={goTo} tone="danger" />
        </Sheet>
      ) : null}
      {dialog?.kind === 'prepublish' ? (
        <Sheet title="Before you publish" onClose={() => setDialog(null)} closeLabel="Keep editing" testId="notes">
          {rights.phase === 'before_publish' ? <RulesBox rights={rights} locale={content.locale} /> : null}
          {noteCount ? <p>Your guests will see these. Check them, or publish anyway and change them later.</p> : null}
          <NoteGroup title="Still sample text from the design" notes={notes.sample} onJump={goTo} />
          <NoteGroup title="Photo places without a photo" notes={notes.photos} onJump={goTo} />
          <NoteGroup title="Sections without a link" notes={notes.links} onJump={goTo} />
          <NoteGroup title="Sections without content" notes={notes.empty} onJump={goTo} />
          <div className={cx(styles.buttonRow, styles.stickyActions)}>
            <Button variant="primary" icon={Send} busy={busy} busyLabel="Publishing…" onClick={() => void doPublish()} data-publish-anyway>
              {rights.phase === 'before_publish' ? 'Publish my website' : 'Publish anyway'}
            </Button>
            <Button onClick={() => setDialog(null)}>Keep editing</Button>
          </div>
        </Sheet>
      ) : null}
      {dialog?.kind === 'live' ? (
        <Sheet title={dialog.justPublished ? 'Your website is live' : 'Share your website'} onClose={() => setDialog(null)} testId="live">
          {dialog.justPublished ? (
            <p className={styles.liveLead}>
              <CircleCheckBig size={22} strokeWidth={1.75} aria-hidden="true" /> Guests can open your website at:
            </p>
          ) : (
            <p>Guests can open your website at:</p>
          )}
          <p>
            <a href={url} target="_blank" rel="noopener noreferrer" className={styles.bigUrl} data-live-link>
              <UrlText url={url} />
            </a>
          </p>
          <div className={styles.buttonRow}>
            <Button icon={Copy} onClick={() => void copy(url)}>
              Copy link
            </Button>
            <a href={url} target="_blank" rel="noopener noreferrer" className={cx(styles.btn, styles.btn_secondary)}>
              <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>Open website</span>
            </a>
          </div>
          <QrCode url={url} fileBase={initial.slug} />
          <p className={styles.hint}>This QR code opens {url}. Scan it once with your phone camera before you print it.</p>
        </Sheet>
      ) : null}
      {dialog?.kind === 'offline' ? (
        <Sheet title="Take your website offline?" onClose={() => setDialog(null)} closeLabel="Cancel" testId="offline">
          <p>Guests will see “Page not found” until you publish again. Your text, photos and replies are kept.</p>
          <div className={styles.buttonRow}>
            <Button variant="danger" busy={busy} busyLabel="Working…" onClick={() => void onUnpublish()} data-confirm-offline>
              Take offline
            </Button>
            <Button onClick={() => setDialog(null)}>Keep it online</Button>
          </div>
        </Sheet>
      ) : null}
      {dialog?.kind === 'message' ? (
        <Sheet title={dialog.title} onClose={() => setDialog(null)} testId="message">
          <p className={styles.breakAll}>{dialog.text}</p>
        </Sheet>
      ) : null}
      {dialog?.kind === 'help' ? <HelpSheet meta={meta} locale={content.locale} topic={dialog.topic} onClose={() => setDialog(null)} /> : null}
      {dialog?.kind === 'identity' && rights.anchor ? (
        <IdentitySheet
          content={content}
          anchor={rights.anchor}
          remaining={rights.remaining}
          total={rights.limit + rights.granted}
          showInitials={theme.fields.initials}
          focus={dialog.focus}
          onClose={() => setDialog(null)}
          onSubmit={async (identity, intent) => {
            const before = rights.remaining;
            const dateChanged = identity.date !== content.date;
            const namesChanged = JSON.stringify({ ...identity, date: '' }) !== JSON.stringify({ ...identityOf(content), date: '' });
            const res = await panel.changeIdentity(identity, intent);
            if (res.ok && res.result !== 'unchanged') {
              const left = res.result === 'change' ? before - 1 : before;
              const what = namesChanged && dateChanged ? 'Names and date changed.' : dateChanged ? 'Date changed.' : 'Names changed.';
              const text = `${res.result === 'change' ? what : 'Fixed — free.'} ${left} ${left === 1 ? 'change' : 'changes'} left.`;
              // On a live site the change shows after publishing: offer it right here.
              snack(text, meta.status === 'published' ? { label: 'Publish', run: () => void startPublish() } : undefined);
            }
            return res;
          }}
        />
      ) : null}
    </>
  );

  if (route.view === 'setup') {
    return (
      <PanelContext.Provider value={ctx}>
        <div className={styles.app} data-panel data-status={meta.status} data-panel-root>
          {banners}
          <Setup
            step={route.step}
            initial={initial}
            panel={panel}
            theme={theme}
            url={url}
            visiblePages={visiblePages}
            onStep={(n) => go({ view: 'setup', step: Math.max(1, Math.min(6, n)) })}
            onExit={() => {
              writeSetup(initial.slug, { dismissed: true });
              go({ view: 'home' });
            }}
            onOpenSection={(id, path) => {
              setReturnTo('#setup/5');
              goTo(path ?? `#edit/${id}`);
            }}
            onPublished={() => go({ view: 'home' }, true)}
            onIssues={(issues, message) => setDialog({ kind: 'issues', issues, message })}
          />
        </div>
        {sheets}
      </PanelContext.Provider>
    );
  }

  // ---------------------------------------------------------------- editor
  const sectionView = route.view === 'section' ? route.id : null;
  const rootView = route.view === 'section' ? 'edit' : route.view;
  const back = () => {
    if (returnTo) {
      const target = returnTo;
      setReturnTo(null);
      return go(target);
    }
    if (navCount.current > 0) window.history.back();
    else go({ view: 'edit' }, true);
  };

  let publishControl: React.ReactNode;
  if (rights.archived) publishControl = <Badge icon={Archive}>Archived</Badge>;
  else if (upToDate)
    publishControl = (
      <button type="button" className={styles.liveBadge} onClick={() => go({ view: 'share' })} data-live-badge>
        <span className={styles.liveDot} aria-hidden="true" />
        Live
      </button>
    );
  else
    publishControl = (
      <Button
        variant="primary"
        small
        busy={busy}
        busyLabel="Publishing…"
        disabled={locked || !online}
        title={online ? undefined : 'Connect to the internet to publish.'}
        onClick={() => void startPublish()}
        data-publish
      >
        {meta.status === 'published' ? 'Publish changes' : meta.publishedAt ? 'Publish again' : 'Publish'}
      </Button>
    );

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
      case 'faq':
        return <FaqFields />;
      case 'rsvp':
        return <RsvpFields onOpenGuests={() => go({ view: 'guests' })} />;
      case 'photos':
        return <PhotoSlots intro />;
    }
  };
  const pageOfSection: Partial<Record<SectionId, string>> = { story: 'story', details: 'details', faq: 'details', rsvp: 'rsvp', schedule: 'details', venue: 'details', names: 'index', date: 'index', photos: 'home' };

  const openPreview = (page?: string | null) => {
    setPreviewPage(page && visiblePages.includes(page) ? page : null);
    setPreviewOpen(true);
  };

  const viewTitle =
    route.view === 'section' ? SECTION_TITLES[route.id] : route.view === 'home' ? 'Your website' : route.view === 'edit' ? 'Edit your website' : route.view === 'guests' ? 'Guests' : 'Share';

  return (
    <PanelContext.Provider value={ctx}>
      <div className={styles.app} data-panel data-status={meta.status} data-view={sectionView ? `edit/${sectionView}` : route.view} data-panel-root>
        <a href="#main" className={styles.skipLink}>
          Skip to content
        </a>
        <header className={styles.appBar} inert={(previewOpen && !wide) || undefined}>
          <div className={styles.appBarInner}>
            {sectionView ? (
              <button type="button" className={styles.backBtn} onClick={back} aria-label={returnTo ? 'Back to setup' : 'Back to Edit'}>
                <ArrowLeft size={22} strokeWidth={1.75} aria-hidden="true" />
              </button>
            ) : null}
            <p
              className={sectionView ? styles.appBarTitle : cx(styles.appBarNames, route.view === 'home' && !scrolled && styles.appBarNamesHidden)}
              title={sectionView ? SECTION_TITLES[sectionView] : names}
              aria-hidden={route.view === 'home' || undefined}
            >
              {sectionView ? SECTION_TITLES[sectionView] : names}
            </p>
            <div className={styles.appBarActions}>
              <SaveIndicator state={saveState} message={panel.saveMessage} onSaveNow={() => void panel.flush()} compact />
              {!wide ? <IconButton icon={Eye} label="Preview" onClick={() => openPreview(sectionView ? pageOfSection[sectionView] : null)} data-open-preview /> : null}
              {publishControl}
            </div>
          </div>
        </header>

        <div className={styles.shell}>
          <nav className={styles.nav} aria-label="Editor" inert={(previewOpen && !wide) || undefined}>
            <ul className={styles.navList}>
              {ROOT_VIEWS.map((v) => {
                const Icon = v.icon;
                const current = rootView === v.view;
                return (
                  <li key={v.view}>
                    <a
                      href={`#${v.view}`}
                      className={styles.navItem}
                      aria-current={current ? 'page' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        go({ view: v.view } as Route);
                      }}
                      data-nav={v.view}
                    >
                      <span className={styles.navIcon}>
                        <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                        {v.view === 'guests' && replies.newCount ? (
                          <span className={styles.navBadge} aria-hidden="true">
                            {replies.newCount}
                          </span>
                        ) : null}
                      </span>
                      <span className={styles.navLabel}>
                        {v.label}
                        {v.view === 'guests' && replies.newCount ? <span className={styles.visuallyHidden}> ({replies.newCount} new)</span> : null}
                      </span>
                    </a>
                    {v.view === 'edit' ? (
                      <ul className={styles.railSub}>
                        {sectionIds.map((id) => (
                          <li key={id}>
                            <a
                              href={`#edit/${id}`}
                              className={styles.railSubItem}
                              aria-current={sectionView === id ? 'page' : undefined}
                              onClick={(e) => {
                                e.preventDefault();
                                go({ view: 'section', id });
                              }}
                            >
                              {SECTION_TITLES[id]}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* While the phone preview covers the screen, the editor behind it is out of reach (focus, Tab, screen readers). */}
          <main id="main" className={styles.main} inert={(previewOpen && !wide) || undefined}>
            {banners}
            <div className={styles.pageHead}>
              {sectionView ? (
                <span className={styles.pageIcon} aria-hidden="true">
                  {(() => {
                    const Icon = SECTION_ICONS[sectionView];
                    return <Icon size={22} strokeWidth={1.75} />;
                  })()}
                </span>
              ) : null}
              <h1 ref={headingRef} tabIndex={-1} className={route.view === 'home' ? styles.homeTitle : styles.pageTitle}>
                {route.view === 'home' ? names : viewTitle}
              </h1>
              {route.view === 'home' ? (
                <p className={styles.pageSub}>{[formatDateLong(content.date, content.locale), theme.name].filter(Boolean).join(' · ')}</p>
              ) : null}
            </div>

            {route.view === 'home' ? (
              <HomeView
                content={content}
                meta={meta}
                theme={theme}
                url={url}
                steps={steps}
                setupStep={setupStep}
                replies={replies}
                onGo={goTo}
                onEditSection={(id) => go({ view: 'section', id })}
                onPublish={() => void startPublish()}
                onShare={() => go({ view: 'share' })}
                onContinueSetup={() => {
                  writeSetup(initial.slug, { dismissed: false });
                  go({ view: 'setup', step: setupStep ?? 1 });
                }}
                onHelp={(topic) => setDialog({ kind: 'help', topic })}
                onCopy={() => void copy(url)}
              />
            ) : null}
            {route.view === 'edit' ? (
              <EditListView
                sections={sectionIds}
                summaries={summaries}
                errorCount={errorCount}
                sampleCount={sampleCount}
                offSections={offSections}
                meta={meta}
                onOpen={(id) => go({ view: 'section', id })}
              />
            ) : null}
            {sectionView ? (
              <div id={`section-${sectionView}-body`} className={styles.sectionPage} data-section={sectionView}>
                {sectionBody(sectionView)}
                <div className={styles.sectionFoot}>
                  {returnTo ? (
                    <Button variant="primary" block onClick={back} data-section-done>
                      Done
                    </Button>
                  ) : !wide ? (
                    <Button block icon={Eye} onClick={() => openPreview(pageOfSection[sectionView])}>
                      Preview this page
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : null}
            {route.view === 'guests' ? (
              <GuestsView
                api={panel.api}
                replies={replies}
                content={content}
                meta={meta}
                online={online}
                onPublish={() => void startPublish()}
                onShare={() => go({ view: 'share' })}
                onSettings={() => go({ view: 'section', id: 'rsvp' })}
              />
            ) : null}
            {route.view === 'share' ? (
              <ShareView
                url={url}
                slug={initial.slug}
                editKey={editKey}
                meta={meta}
                orderRef={initial.orderRef}
                online={online}
                onPublish={() => void startPublish()}
                onOffline={() => setDialog({ kind: 'offline' })}
                onCopy={(text, what) => void copy(text, what)}
              />
            ) : null}
          </main>

          <aside className={styles.previewColumn} aria-label="Preview">
            {preview}
          </aside>
        </div>
      </div>
      {sheets}
    </PanelContext.Provider>
  );
}

function readSetupStep(slug: string): number | null {
  if (typeof window === 'undefined') return null;
  const s = readSetup(slug).step;
  return s && s >= 1 && s <= 6 ? s : null;
}

function IssueJumps({ notes, onJump, tone }: { notes: PublishNote[]; onJump: (path: string) => void; tone: 'danger' | 'warning' }) {
  return (
    <ul className={styles.issueJumpList}>
      {notes.map((n, i) => {
        const section = sectionForPath(n.path);
        return (
          <li key={`${n.path}-${i}`}>
            <button type="button" className={cx(styles.issueJump, tone === 'warning' && styles.noteJump)} onClick={() => onJump(n.path)}>
              <span className={styles.issueJumpSection}>{section ? SECTION_TITLES[section] : 'General'}</span>
              <span>{n.message}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function NoteGroup({ title, notes, onJump }: { title: string; notes: PublishNote[]; onJump: (path: string) => void }) {
  if (!notes.length) return null;
  return (
    <>
      <h3 className={styles.subTitle}>{title}</h3>
      <IssueJumps notes={notes} onJump={onJump} tone="warning" />
    </>
  );
}
