'use client';
// The buyer's edit panel, v2 (G039 -> G060, docs/16_PANEL_V2.md). Phone first.
//
// Views are hash routes on the one /edit/<slug>?k=… page (the key stays in the query; back/forward and
// bookmarks work):  #setup/1…3 · #home · #edit · #edit/<page> · #guests · #guests/results (G100) · #guests/print (G069) · #share.
// A site that was never published opens the setup wizard (until it is finished or closed on this phone);
// everything else opens Home. Autosave, the live preview, publish and the edit-rights rules work the same
// in every view (usePanel.ts). G066: dressed in the BKE Studio brand (logo SVG, panel.module.css tokens, fonts.ts); the
// only drawing on screen is still the design's own preview (K21).
//
// K29 (simpler panel): a 3-step setup; six editor pages (pages.ts: Us · Day & place · Photos · Our Story · Details ·
// RSVP; old #edit/<section> addresses still open the right page); the name & date changes left only next to those
// fields; one sticky "Unpublished changes: n · Review · Publish" bar while the live website is behind the draft (autosave
// still saves the draft; publish is unchanged on the server); Home = progress + the next three tasks; on wide screens
// two columns (editing, live preview).
// G100 (docs/18 P1): setup step 1 = names + date only (the change rule in one line + "Learn more"); the success screen puts
// the link and Share first, the QR under "More ways to share", then 2–3 optional next steps (Published.tsx); one sample-text
// line per editor page instead of a tag per field; Guests = list (numbers, search, status tabs) and a separate Results.

import {
  Archive,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleCheckBig,
  Eye,
  House,
  Image as ImageIcon,
  Mail,
  Pencil,
  Send,
  Share2,
  Shirt,
  TriangleAlert,
  Users,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';
import { rememberEditor } from '../../lib/panel/remember.ts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { formatDate, formatDateLong, formatTime } from '../../lib/content/format.ts';
import { isThankYouOn } from '../../lib/content/thank-you.ts';
import { ORDER_PENDING_TEXT, PANEL_BRAND } from '../../lib/panel/brand.ts';
import {
  defaultNameDisplay,
  fieldId,
  openingTabLabel,
  pageShown,
  photoAt,
  prePublishNotes,
  sampleDateLeft,
  publicSiteUrl,
  SECTION_IDS,
  SECTION_TITLES,
  sectionForPath,
  type PanelState,
  type PublishNote,
  type SectionId,
} from '../../lib/panel/model.ts';
import { classifyIdentityChange, identityOf, sameIdentity, type Identity } from '../../lib/panel/rights.ts';
import { copyPanelPage, type PanelCopyEntry } from '../../lib/theme/copy.ts';
import { BrandLogo } from './Brand.tsx';
import { CopyFields } from './CopyFields.tsx';
import { PANEL_FONTS } from './fonts.ts';
import { IdentitySheet } from './IdentitySheet.tsx';
import { PanelContext, SampleLine, useDeviceZone, type PanelContextValue } from './fields.tsx';
import { BLOCK_TITLES, changedCopyPages, changedPages, changedSections, COPY_TITLE, PAGE_IDS, PAGE_SECTIONS, PAGE_TITLES, pageOf, parseEditTarget, previewPageFor, readiness, SETUP_STEP_COUNT, setupStepOf, type PageId } from './pages.ts';
import { PhotoSlots } from './PhotosSection.tsx';
import { SectionJumps } from './SectionJumps.tsx';
import { PreviewPane } from './PreviewPane.tsx';
import { AfterPublish, afterPublishSteps, LiveShare } from './Published.tsx';
import { DetailsBlocksFields, MealFields, TravelFields } from './ExtrasFields.tsx';
import { DateFields, DetailsFields, FaqFields, NamesFields, RsvpFields, ScheduleFields, StoryFields, VenueFields } from './sections.tsx';
import { ThankYouFields } from './ThankYou.tsx';
import { firstOpenStep, readSetup, RulesBox, SampleDateGate, Setup, writeSetup } from './Setup.tsx';
import { Sheet } from './Sheet.tsx';
import { Badge, Banner, Button, cx, IconButton, SaveIndicator, SnackbarProvider, useSnackbar } from './ui.tsx';
import { usePanel } from './usePanel.ts';
import { EditListView, GuestPrintView, GuestsView, HelpSheet, HomeView, nextSteps, ShareView, UrlText, useReplies } from './views.tsx';
import styles from './panel.module.css';

type Route =
  | { view: 'setup'; step: number }
  | { view: 'home' }
  | { view: 'edit' }
  | { view: 'section'; page: PageId; focus: SectionId | null }
  | { view: 'guests' }
  | { view: 'results' }
  | { view: 'print' }
  | { view: 'share' };

function parseHash(hash: string): Route | null {
  const h = hash.replace(/^#/, '');
  let m: RegExpExecArray | null;
  // Steps 4–6 of the old 6-step wizard (bookmarks, a link in an e-mail) land on the matching new step.
  if ((m = /^setup\/([1-6])$/.exec(h))) return { view: 'setup', step: setupStepOf(Number(m[1])) };
  if (h === 'home') return { view: 'home' };
  if (h === 'edit') return { view: 'edit' };
  if ((m = /^edit\/([a-z]+)$/.exec(h))) {
    const target = parseEditTarget(m[1]);
    if (target) return { view: 'section', ...target };
  }
  if (h === 'guests') return { view: 'guests' };
  if (h === 'guests/print') return { view: 'print' };
  if (h === 'guests/results') return { view: 'results' };
  if (h === 'share') return { view: 'share' };
  return null;
}

function hashOf(r: Route): string {
  switch (r.view) {
    case 'setup':
      return `#setup/${r.step}`;
    case 'section':
      return `#edit/${r.focus ?? r.page}`;
    case 'print':
      return '#guests/print';
    case 'results':
      return '#guests/results';
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
  | { kind: 'review' }
  | { kind: 'live'; justPublished: boolean }
  | { kind: 'offline' }
  | { kind: 'message'; title: string; text: string }
  | { kind: 'help'; topic?: string }
  | { kind: 'identity'; focus: 'names' | 'date' };

/** Line icons of the six editor pages (Edit list, page heads, Review). */
export const PAGE_ICONS: Record<PageId, LucideIcon> = {
  us: Users,
  day: CalendarDays,
  photos: ImageIcon,
  story: BookOpen,
  details: Shirt,
  rsvp: Mail,
};

/** The snackbar text after a names / date save, in the buyer's words (G060-fix: "Date moved — free", not "Fixed"). */
export function identityOutcomeText(result: string, anchor: Identity | null, next: Identity, previous: Identity): string {
  if (result === 'undo') return 'Change undone — you got it back.';
  if (result === 'sample_date') return 'Wedding date set — free.';
  if (result === 'change') {
    const date = next.date !== previous.date;
    const names = !sameIdentity({ ...next, date: '' }, { ...previous, date: '' });
    return names && date ? 'Names and date changed.' : date ? 'Date changed.' : 'Names changed.';
  }
  const free = anchor ? classifyIdentityChange(anchor, next).free : [];
  const parts = [free.includes('date') ? 'Date moved' : '', free.includes('surname') ? 'Surname saved' : '', free.includes('typo') ? 'Fixed' : ''].filter(Boolean);
  return `${parts.join(', ') || 'Saved'} — free.`;
}

const ROOT_VIEWS: Array<{ view: 'home' | 'edit' | 'guests' | 'share'; label: string; icon: LucideIcon }> = [
  { view: 'home', label: 'Home', icon: House },
  { view: 'edit', label: 'Edit', icon: Pencil },
  { view: 'guests', label: 'Guests', icon: Users },
  { view: 'share', label: 'Share', icon: Share2 },
];

export default function Panel(props: { initial: PanelState; editKey: string; published?: ContentRecord | null; shopUntil?: string | null }) {
  return (
    <SnackbarProvider>
      <PanelApp {...props} />
    </SnackbarProvider>
  );
}

function PanelApp({
  initial,
  editKey,
  published = null,
  shopUntil = null,
}: {
  initial: PanelState;
  editKey: string;
  published?: ContentRecord | null;
  /** G145: opened with the shop's own time-limited link (admin), not the buyer's; until when it works. */
  shopUntil?: string | null;
}) {
  const panel = usePanel(initial, editKey);
  const { content, meta, saveState, validation, locked, online } = panel;
  const theme = initial.theme;
  const rights = meta.rights;
  const wide = useMedia('(min-width: 960px)');
  const snack = useSnackbar();
  const url = publicSiteUrl(initial.origin, initial.slug);
  const names = content.name_display || defaultNameDisplay(content.partners ?? []) || 'Your website';
  const neverPublished = !meta.publishedAt && meta.status !== 'published' && rights.phase === 'before_publish';
  const deviceZone = useDeviceZone();

  // ---------------------------------------------------------------- routing
  const defaultRoute = (): Route => (neverPublished ? { view: 'setup', step: firstOpenStep(content, theme) } : { view: 'home' });
  const [route, setRoute] = useState<Route>(() => defaultRoute());
  const [ready, setReady] = useState(false);
  const navCount = useRef(0);
  const publishedRef = useRef(!neverPublished);
  publishedRef.current = !neverPublished;

  useEffect(() => {
    const fromHash = parseHash(window.location.hash);
    let start: Route;
    if (fromHash && !(fromHash.view === 'setup' && !neverPublished)) start = fromHash;
    else if (neverPublished && !readSetup(initial.slug).dismissed) {
      const saved = readSetup(initial.slug).step;
      start = { view: 'setup', step: saved && saved >= 1 && saved <= 6 ? setupStepOf(saved) : firstOpenStep(content, theme) };
    } else start = { view: 'home' };
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hashOf(start)}`);
    setRoute(start);
    setReady(true);
    const onHash = () => {
      const r = parseHash(window.location.hash);
      if (!r) return;
      // Back from the editor to a setup step of a site published since (G100: the success screen's next steps): Home.
      if (r.view === 'setup' && publishedRef.current) {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#home`);
        setRoute({ view: 'home' });
        return;
      }
      // An old wizard address (#setup/6) shows as the step it opens (#setup/3).
      if (r.view === 'setup' && hashOf(r) !== window.location.hash) {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hashOf(r)}`);
      }
      setRoute(r);
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
    const label = route.view === 'section' ? PAGE_TITLES[route.page] : route.view === 'print' ? 'Guest list' : route.view === 'results' ? 'Results' : ROOT_VIEWS.find((v) => v.view === route.view)?.label;
    document.title = `${label} · ${names}`;
    if (firstFocus.current) firstFocus.current = false;
    else {
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }
    // An address that names a section inside a page (#edit/venue): that part of the page, under the bars.
    if (route.view === 'section' && route.focus) {
      const id = `section-${route.focus}-body`;
      const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 40);
      return () => window.clearTimeout(t);
    }
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
  // G145: a question, choice, place to stay or block added in this visit does not open with red "please write …" lines:
  // its errors show once one of its fields was left, or after a try to publish. Errors the draft had when the panel
  // opened always show (Home and Review list every error either way).
  const openedWithErrors = useRef<Set<string> | null>(null);
  if (openedWithErrors.current === null) openedWithErrors.current = new Set(validation.errors.map((e) => e.path));
  const [leftFields, setLeftFields] = useState<ReadonlySet<string>>(() => new Set());
  const [showAllErrors, setShowAllErrors] = useState(false);
  const onFieldLeft = useCallback((e: React.FocusEvent<HTMLElement>) => {
    const id = (e.target as HTMLElement).id;
    if (id && id.startsWith('f-')) setLeftFields((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);
  const shownIssues = useCallback(
    (p: string): ValidationIssue[] => {
      const list = issuesByPath.get(p) ?? [];
      if (showAllErrors || openedWithErrors.current?.has(p) || !list.some((i) => i.level === 'error')) return list;
      const id = fieldId(p);
      for (const left of leftFields) if (left === id || left.startsWith(`${id}-`)) return list;
      return list.filter((i) => i.level !== 'error');
    },
    [issuesByPath, leftFields, showAllErrors],
  );
  const notes = useMemo(() => prePublishNotes(content, theme, { deviceZone }), [content, theme, deviceZone]);
  const samples = useMemo(() => new Set(notes.sample.map((n) => n.path)), [notes]);
  const noteCount = notes.sample.length + notes.photos.length + notes.links.length + notes.empty.length;
  // A section the design has no place for is not offered (questions & answers G051, after the wedding G075).
  const sectionIds = useMemo(
    () => SECTION_IDS.filter((id) => (id !== 'faq' || theme.fields.faq) && (id !== 'thankyou' || theme.thankYou)),
    [theme.fields.faq, theme.thankYou],
  );
  const pageSections = useCallback((page: PageId) => PAGE_SECTIONS[page].filter((id) => sectionIds.includes(id)), [sectionIds]);
  // G075: the couple's preview of the thank-you page (?thanks=1) shows the pages guests will have then.
  const [previewThanks, setPreviewThanks] = useState(false);
  const visiblePages = useMemo(
    () => theme.pages.filter((p) => pageShown(theme.pageRules[p], content, { thankYou: previewThanks })),
    [theme, content, previewThanks],
  );
  /** The sample-text notes of an editor page (G100: the page's one sample line counts them). */
  const pageSample = (page: PageId) =>
    notes.sample.filter((n) => {
      const s = sectionForPath(n.path);
      return s !== null && pageSections(page).includes(s);
    });
  const pageErrors = (page: PageId) => validation.errors.filter((i) => {
    const s = sectionForPath(i.path);
    return (s !== null && PAGE_SECTIONS[page].includes(s)) || copyPanelPage(i.path, theme.copy) === page;
  }).length;
  const blocks = content.optional_blocks ?? {};
  const steps = useMemo(() => nextSteps(validation.errors, notes, content, meta), [validation.errors, notes, content, meta]);
  const ready100 = useMemo(
    () => readiness({ sections: sectionIds, errors: validation.errors, notes, theme, content, published: meta.status === 'published' }),
    [sectionIds, validation.errors, notes, theme, content, meta.status],
  );
  // "My website" on the sales site (/my) brings the buyer back here from this device (lib/panel/remember.ts).
  useEffect(() => {
    // G145: the shop's link runs out in 72 hours and is not the buyer's: not kept on the shop's device.
    if (shopUntil) return;
    rememberEditor({
      slug: initial.slug,
      path: `/edit/${initial.slug}?k=${encodeURIComponent(editKey)}`,
      names: content.name_display || content.partners.map((p) => p.display_name).filter(Boolean).join(' & '),
      at: new Date().toISOString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per open; the names are refreshed on the next visit
  }, [initial.slug, editKey]);

  // Read after mount (localStorage), so the server's and the browser's first render match.
  const [storedStep, setStoredStep] = useState<number | null>(null);
  useEffect(() => setStoredStep(readSetupStep(initial.slug)), [initial.slug, route]);
  const setupStep = neverPublished ? (storedStep ?? firstOpenStep(content, theme)) : null;

  // ---------------------------------------------------------------- what the live website does not show yet
  // The published copy comes with the page (app/edit/[slug]/page.tsx); after a publish here it is this draft.
  const [publishedCopy, setPublishedCopy] = useState<ContentRecord | null>(published);
  const lastPublishedAt = useRef(meta.publishedAt);
  useEffect(() => {
    if (meta.publishedAt && meta.publishedAt !== lastPublishedAt.current) setPublishedCopy(structuredClone(content));
    lastPublishedAt.current = meta.publishedAt;
    // the draft at the moment the publish answered is what went live
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.publishedAt]);
  const changes = useMemo(() => changedPages(content, publishedCopy, theme.copy), [content, publishedCopy, theme.copy]);
  const changedParts = useMemo(() => changedSections(content, publishedCopy), [content, publishedCopy]);
  // G068: pages whose design texts changed (Review: "<Page> · Headings & labels"), and pages whose own content did
  const copyChanges = useMemo(() => changedCopyPages(content, publishedCopy, theme.copy), [content, publishedCopy, theme.copy]);
  const contentChanges = useMemo(() => changedPages(content, publishedCopy), [content, publishedCopy]);

  const summaries: Record<PageId, string> = {
    us: names,
    day: [formatDate(content.date, content.locale), formatTime(content.ceremony_time, content.locale), content.venue?.name].filter(Boolean).join(' · ') || 'Add the date and the venue',
    photos: `${theme.photos.filter((s) => photoAt(content, s.source)).length} of ${theme.photos.length} added`,
    story:
      blocks.our_story === true
        ? `${content.story?.items?.length ?? 0} ${content.story?.items?.length === 1 ? 'moment' : 'moments'}`
        : 'Off · guests do not see this page',
    details:
      [
        content.host_line ? 'Host line' : '',
        content.dress_code ? 'Dress code' : '',
        content.urls?.accommodation ? 'Travel & stay' : '',
        content.urls?.registry ? 'Registry' : '',
        theme.fields.faq && blocks.faq === true && content.faq?.length ? `${content.faq.length} ${content.faq.length === 1 ? 'question' : 'questions'}` : '',
      ]
        .filter(Boolean)
        .join(', ') || 'Dress code, travel, registry, questions',
    rsvp:
      content.rsvp?.method === 'none'
        ? 'Replies off'
        : `Reply by ${formatDate(content.rsvp?.deadline, content.locale) ?? '…'}${
            content.rsvp?.questions?.length ? ` · ${content.rsvp.questions.length} ${content.rsvp.questions.length === 1 ? 'question' : 'questions'}` : ''
          }`,
  };

  // ---------------------------------------------------------------- dialogs and actions
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<string | null>(null);
  // First publish with the design's sample date: blocked until the date is set or confirmed (G060-fix).
  const [dateConfirmed, setDateConfirmed] = useState(false);
  const firstPublishDateBlocked = rights.phase === 'before_publish' && sampleDateLeft(content, theme.sample) && !dateConfirmed;

  const guestViews = route.view === 'guests' || route.view === 'results' || route.view === 'print';
  const replies = useReplies(panel.api, initial.slug, ready && (route.view === 'home' || guestViews) && !neverPublished, meta.status === 'published');
  // Leaving Guests marks the replies seen on this device (G069: "New" = since the last look; also "Mark as seen").
  const lastView = useRef(route.view);
  useEffect(() => {
    const was = lastView.current;
    lastView.current = route.view;
    const guestView = (v: string) => v === 'guests' || v === 'results' || v === 'print';
    if (guestView(was) && !guestView(route.view)) replies.markSeen();
    // markSeen reads the replies of this render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.view]);

  // On wide screens the preview sits next to the editor: it follows the open page (or section) (G060-fix).
  const openPage = route.view === 'section' ? route.page : null;
  const openFocus = route.view === 'section' ? route.focus : null;
  // The thank-you preview lasts until the editor moves to another page or the preview is opened for something else.
  useEffect(() => setPreviewThanks(false), [openPage, route.view]);
  useEffect(() => {
    if (!wide || !openPage) return;
    const page = previewPageFor(openPage, openFocus);
    if (visiblePages.includes(page)) setPreviewPage(page);
    // visiblePages changes with the content; following the page is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wide, openPage, openFocus]);

  /** G121: a jump to a field (Home → Settings): opens the folded part that holds it ("More options"). */
  const [fieldJump, setFieldJump] = useState<{ path: string } | null>(null);
  const ctx: PanelContextValue = useMemo(
    () => ({
      content,
      edit: panel.edit,
      issuesAt: shownIssues,
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
      uploadMusic: panel.uploadMusic,
      themeId: theme.id,
      jump: fieldJump,
      opening: theme.opening ?? null,
      resolveMapLink: panel.api.mapLink,
    }),
    [content, panel.edit, shownIssues, locked, samples, meta.previewToken, theme.fields, theme.photos, rights, online, panel.uploadPhoto, panel.removePhoto, panel.uploadMusic, theme.id, fieldJump, theme.opening, panel.api],
  );

  /** A jump to one of the design's texts (G068): opens "Headings & labels" on its page. */
  const [copyJump, setCopyJump] = useState<{ path: string } | null>(null);
  /** The website page of the design text edited last on an editor page (its preview opens there). */
  const copyPreview = useRef<{ page: PageId | null; target: string; thanks: boolean } | null>(null);

  /** From an issue / note / next step to its field (or a view). */
  const goTo = useCallback(
    (path: string) => {
      setDialog(null);
      setPreviewOpen(false);
      if (path.startsWith('#')) return go(path);
      const copyPage = copyPanelPage(path, theme.copy);
      if (copyPage) {
        setCopyJump({ path });
        go({ view: 'section', page: copyPage, focus: null });
      } else {
        setFieldJump({ path });
        const section = sectionForPath(path) ?? 'names';
        const page = pageOf(section);
        go({ view: 'section', page, focus: PAGE_SECTIONS[page][0] === section ? null : section });
      }
      window.setTimeout(() => {
        const el = document.getElementById(fieldId(path)) ?? document.querySelector<HTMLElement>(`[data-locked-identity] [data-change-identity]`);
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        (el as HTMLElement | null)?.focus({ preventScroll: true });
      }, 120);
    },
    [go, theme.copy],
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
  /**
   * The live website is behind the draft: the one sticky bar says so (K29). G121 (docs/18 §2 P2, Medium/Notion): only
   * while the draft really differs from the live copy (the server's flag, or this page's own comparison while a save is
   * on its way) — a save in progress alone no longer brings the bar; the save indicator says "Saved" instead.
   */
  const differsFromLive =
    meta.status === 'published' && (meta.hasUnpublishedChanges || (publishedCopy !== null ? changes.length > 0 : saveState !== 'saved'));
  const showChanges = !rights.archived && differsFromLive;
  /** Live and nothing to publish: the calm "Live" label. */
  const liveCalm = meta.status === 'published' && !rights.archived && !showChanges;

  /** Snackbar "Undo" after a counted change: back to what it was, free, the change is given back (G060-fix). */
  const undoChange = async (previous: Identity) => {
    const res = await panel.changeIdentity(previous, 'fix');
    if (res.ok && res.result === 'undo') {
      const left = res.remaining;
      snack(`Change undone — you got it back.${typeof left === 'number' ? ` ${left} name & date ${left === 1 ? 'change' : 'changes'} left.` : ''}`);
    }
    else if (!res.ok) snack(res.message ?? 'This could not be undone. Please try again.');
    else if (res.result === 'change') snack('Changed back. This used a change: the first one could no longer be undone.');
  };

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
    if (meta.orderPending) return setDialog({ kind: 'message', title: 'Not yet', text: ORDER_PENDING_TEXT });
    if (validation.errors.length) {
      setShowAllErrors(true);
      return setDialog({ kind: 'issues', issues: validation.errors });
    }
    // The first publish shows the rules (docs/16 §11.7) and what still is sample text. Later publishes go straight
    // out (K29): the reminders live on Home, and "Review" in the changes bar shows what goes live.
    if (rights.phase === 'before_publish') return setDialog({ kind: 'prepublish' });
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
      <div className={cx(styles.app, PANEL_FONTS)} data-panel data-status={meta.status}>
        <main className={styles.notice}>
          <BrandLogo height={28} className={styles.noticeBrand} />
          <TriangleAlert size={32} strokeWidth={1.5} aria-hidden="true" />
          <h1 className={styles.noticeTitle}>This edit link no longer works</h1>
          <p>
            The link may have been replaced with a new one, or it was copied only in part. If we sent you a new link, use the newest one.
            Otherwise message {PANEL_BRAND.shopName} on Etsy with your order number.
          </p>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------- shared parts
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
          Your website closed for guests on {rights.archiveAt ? formatDate(rights.archiveAt.slice(0, 10), content.locale) : 'its archive date'}. You can still see your
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
      thanks={previewThanks}
      onThanksOff={() => setPreviewThanks(false)}
      indexLabel={openingTabLabel(theme.opening)}
      // the frame is left as it is while closed (changing it during the close would leave the preview's history entry)
      onClose={() => setPreviewOpen(false)}
    />
  );

  /** G121 (docs/18 §2 P2): Review → one changed page's preview (the draft as guests will see it after publishing). */
  const previewChanged = (id: PageId) => {
    const page = previewPageFor(id, null);
    setDialog(null);
    // The sheet drops its own history entry when it closes (Sheet.tsx, deferred); the phone preview pushes its entry
    // only after that — else that "back" would close the preview again at once.
    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      window.removeEventListener('popstate', open);
      setPreviewThanks(false);
      setPreviewPage(visiblePages.includes(page) ? page : null);
      setPreviewOpen(true);
    };
    window.addEventListener('popstate', open);
    window.setTimeout(open, 400);
  };

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
          {rights.phase === 'before_publish' ? (
            <SampleDateGate content={content} sample={theme.sample} confirmed={dateConfirmed} onConfirm={setDateConfirmed} onFix={() => goTo('date')} />
          ) : null}
          {rights.phase === 'before_publish' ? <RulesBox rights={rights} locale={content.locale} /> : null}
          {noteCount ? <p>Your guests will see these. Check them, or publish anyway and change them later.</p> : null}
          <NoteGroup title="Still sample text from the design" notes={notes.sample} onJump={goTo} />
          <NoteGroup title="Photo places without a photo" notes={notes.photos} onJump={goTo} />
          <NoteGroup title="Sections without a link" notes={notes.links} onJump={goTo} />
          <NoteGroup title="Sections without content" notes={notes.empty} onJump={goTo} />
          <div className={cx(styles.buttonRow, styles.stickyActions)}>
            <Button variant="primary" icon={Send} busy={busy} busyLabel="Publishing…" disabled={firstPublishDateBlocked} onClick={() => void doPublish()} data-publish-anyway>
              {rights.phase === 'before_publish' ? 'Publish my website' : 'Publish anyway'}
            </Button>
            <Button onClick={() => setDialog(null)}>Keep editing</Button>
          </div>
        </Sheet>
      ) : null}
      {dialog?.kind === 'review' ? (
        <Sheet title="Unpublished changes" onClose={() => setDialog(null)} closeLabel="Keep editing" testId="review">
          <p>
            Your guests still see the version you published last. Changes are saved as you type; they go live when you publish.
            {changes.length ? ' Changed since then (tap the eye to preview a page):' : ''}
          </p>
          {changes.length ? (
            <ul className={styles.reviewList}>
              {changes.map((id) => {
                const Icon = PAGE_ICONS[id];
                // a page with several parts names the changed ones (e.g. "Date & time, After the wedding"); the design's texts
                // are a part of every page (G068: "Us · Headings & labels")
                const copied = copyChanges.includes(id);
                const own =
                  pageSections(id).length > 1
                    ? changedParts.filter((s) => PAGE_SECTIONS[id].includes(s)).map((s) => SECTION_TITLES[s])
                    : copied && contentChanges.includes(id)
                      ? pageSections(id).map((s) => SECTION_TITLES[s])
                      : [];
                const parts = [...own, ...(copied ? [COPY_TITLE] : [])];
                return (
                  <li key={id} className={styles.reviewRow}>
                    <button type="button" className={styles.reviewItem} onClick={() => go({ view: 'section', page: id, focus: null })} data-review-item={id}>
                      <span className={styles.rowIcon} aria-hidden="true">
                        <Icon size={20} strokeWidth={1.75} />
                      </span>
                      <span className={styles.reviewItemText}>
                        {PAGE_TITLES[id]}
                        {parts.length ? <span className={styles.reviewItemSub}>{parts.join(', ')}</span> : null}
                      </span>
                      <ChevronRight size={20} aria-hidden="true" className={styles.chev} />
                    </button>
                    <IconButton icon={Eye} label={`Preview ${PAGE_TITLES[id]}`} className={styles.reviewPreview} onClick={() => previewChanged(id)} data-review-preview={id} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.hint}>Some settings of your website changed.</p>
          )}
          <div className={cx(styles.buttonRow, styles.stickyActions)}>
            <Button variant="primary" icon={Send} busy={busy} busyLabel="Publishing…" disabled={locked || !online} onClick={() => void startPublish()} data-review-publish>
              Publish changes
            </Button>
            <Button onClick={() => setDialog(null)}>Keep editing</Button>
          </div>
        </Sheet>
      ) : null}
      {dialog?.kind === 'live' ? (
        <Sheet title={dialog.justPublished ? 'Your website is live' : 'Share your website'} onClose={() => setDialog(null)} testId="live">
          {/* G100 (docs/18 §1): the link and Share first; the QR code under "More ways to share"; then optional steps. */}
          {dialog.justPublished ? (
            <p className={styles.liveLead}>
              <CircleCheckBig size={22} strokeWidth={1.75} aria-hidden="true" /> Guests can open your website at:
            </p>
          ) : (
            <p>Guests can open your website at:</p>
          )}
          <LiveShare url={url} fileBase={initial.slug} level={3} />
          {dialog.justPublished ? <AfterPublish steps={afterPublishSteps(content, theme, notes.sample)} onGo={goTo} level={3} /> : null}
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
          sampleDate={theme.sample?.date ?? null}
          undo={rights.undo}
          opening={theme.opening ?? null}
          onSubmit={async (identity, intent) => {
            const previous = identityOf(content);
            const res = await panel.changeIdentity(identity, intent);
            if (res.ok && res.result && res.result !== 'unchanged') {
              const left = res.remaining ?? rights.remaining;
              const text = `${identityOutcomeText(res.result, rights.anchor, identity, previous)} ${left} name & date ${left === 1 ? 'change' : 'changes'} left.`;
              const actions = [
                // A counted change can be taken back for free right away (G060-fix).
                ...(res.result === 'change' ? [{ label: 'Undo', run: () => void undoChange(previous) }] : []),
                // On a live site the change shows after publishing: offer it right here.
                ...(meta.status === 'published' ? [{ label: 'Publish', run: () => void startPublish() }] : []),
              ];
              snack(text, actions);
            }
            return res;
          }}
        />
      ) : null}
    </>
  );

  // ---------------------------------------------------------------- setup wizard
  if (route.view === 'setup') {
    return (
      <PanelContext.Provider value={ctx}>
        <div className={cx(styles.app, PANEL_FONTS)} data-panel data-status={meta.status} data-panel-root>
          {banners}
          <Setup
            step={route.step}
            initial={initial}
            panel={panel}
            theme={theme}
            url={url}
            visiblePages={visiblePages}
            onStep={(n) => go({ view: 'setup', step: Math.max(1, Math.min(SETUP_STEP_COUNT, n)) })}
            onExit={() => {
              writeSetup(initial.slug, { dismissed: true });
              go({ view: 'home' });
            }}
            onPublished={() => go({ view: 'home' }, true)}
            onAfter={goTo}
            onIssues={(issues, message) => setDialog({ kind: 'issues', issues, message })}
          />
        </div>
        {sheets}
      </PanelContext.Provider>
    );
  }

  // ---------------------------------------------------------------- editor
  const sectionPage = route.view === 'section' ? route.page : null;
  const rootView = route.view === 'section' ? 'edit' : route.view === 'print' || route.view === 'results' ? 'guests' : route.view;
  const back = () => {
    if (navCount.current > 0) window.history.back();
    else go({ view: 'edit' }, true);
  };

  // The bar's main action: Publish (draft) / Publish again (taken offline); a calm "Live" badge when the website is up to
  // date; nothing while the changes bar below it carries "Publish"; "Archived" at the end.
  let publishControl: React.ReactNode = null;
  if (rights.archived) publishControl = <Badge icon={Archive}>Archived</Badge>;
  else if (liveCalm)
    // G121 (docs/18 §3 P2): Home's status card already says "Live" with its action; the bar does not repeat it there.
    publishControl =
      route.view === 'home' ? null : (
      <button type="button" className={styles.liveBadge} onClick={() => go({ view: 'share' })} data-live-badge>
        <span className={styles.liveDot} aria-hidden="true" />
        Live
      </button>
    );
  else if (!showChanges)
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
        {meta.publishedAt ? 'Publish again' : 'Publish'}
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
      case 'blocks':
        return <DetailsBlocksFields />;
      case 'travel':
        return <TravelFields showSwitch={theme.optionalBlocks.includes('travel_stay')} />;
      case 'menu':
        return <MealFields />;
      case 'faq':
        return <FaqFields />;
      case 'rsvp':
        return <RsvpFields onOpenGuests={() => go({ view: 'guests' })} copy={theme.copy} />;
      case 'photos':
        return <PhotoSlots intro />;
      case 'thankyou':
        return (
          <ThankYouFields
            slot={theme.thankYou?.photo ?? null}
            defaultOpen={openFocus === 'thankyou'}
            onPreview={() => openPreview('home', true)}
          />
        );
    }
  };

  /**
   * G068: the website page of the design text being edited (the preview opens there; a text shown only after the wedding
   * opens the thank-you version). Wide screens follow at once; on a phone "Preview this page" opens it.
   */
  const followCopy = (e: PanelCopyEntry) => {
    const usable = (p: string) => theme.pages.includes(p) && pageShown(theme.pageRules[p], content, { thankYou: e.after });
    // the editor page's own website page first (the RSVP heading on the RSVP page), else where the text appears
    const own = sectionPage ? previewPageFor(sectionPage, null) : null;
    const target = (own && e.pages.includes(own) && usable(own) ? own : e.pages.find(usable)) ?? null;
    copyPreview.current = target ? { page: sectionPage, target, thanks: e.after } : null;
    if (wide && target) {
      setPreviewThanks(e.after);
      setPreviewPage(target);
    }
  };
  const pagePreview = (page: PageId) => {
    const c = copyPreview.current;
    if (c && c.page === page) openPreview(c.target, c.thanks);
    else openPreview(previewPageFor(page, openFocus));
  };

  /** Opens the preview at `page`; `thanks` = the thank-you version (G075), else the website as it is now. */
  const openPreview = (page?: string | null, thanks = false) => {
    setPreviewThanks(thanks);
    setPreviewPage(page && visiblePages.includes(page) ? page : null);
    setPreviewOpen(true);
  };

  const viewTitle =
    route.view === 'section'
      ? PAGE_TITLES[route.page]
      : route.view === 'home'
        ? 'Your website'
        : route.view === 'edit'
          ? 'Edit your website'
          : route.view === 'guests' || route.view === 'results'
            ? 'Guests'
            : route.view === 'print'
              ? 'Guest list'
              : 'Share';

  return (
    <PanelContext.Provider value={ctx}>
      <div
        className={cx(styles.app, PANEL_FONTS, showChanges && styles.appWithChanges)}
        data-panel
        data-status={meta.status}
        data-view={sectionPage ? `edit/${sectionPage}` : route.view}
        data-panel-root
        onBlur={onFieldLeft}
      >
        <a href="#main" className={styles.skipLink}>
          Skip to content
        </a>
        {/* G145: only the shop sees this (its own 72-hour link from the admin), so it speaks the shop's language. */}
        {shopUntil ? (
          <p className={styles.shopBar} role="note" data-shop-session="">
            Dükkân olarak düzenliyorsunuz · bu link {shopUntilText(shopUntil)} tarihine kadar çalışır · alıcının linki değişmedi. Bitince yayınlamayı alıcıya bırakın.
          </p>
        ) : null}
        {/* Bar (comps u2_*): logo · [back + page title] · names (where there is room) · save state · Preview · Publish.
            A wide Publish button leaves no room for the full logo on a phone: the small monogram stands in (Brand.tsx). */}
        <header className={styles.appBar} inert={(previewOpen && !wide) || undefined}>
          <div className={styles.appBarInner}>
            <BrandLogo compact={!liveCalm && !showChanges} className={cx(styles.appBarBrand, sectionPage && styles.appBarBrandSection)} />
            {sectionPage ? (
              <>
                <button type="button" className={styles.backBtn} onClick={back} aria-label="Back to Edit">
                  <ArrowLeft size={22} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <p className={cx(styles.appBarTitle, !scrolled && styles.appBarTitleNarrow)} title={PAGE_TITLES[sectionPage]}>
                  {PAGE_TITLES[sectionPage]}
                </p>
              </>
            ) : null}
            <p
              className={cx(styles.appBarNames, route.view === 'home' && !scrolled && styles.appBarNamesHidden)}
              title={names}
              aria-hidden={route.view === 'home' || undefined}
            >
              {names}
            </p>
            <div className={styles.appBarActions}>
              <SaveIndicator state={saveState} message={panel.saveMessage} onSaveNow={() => void panel.flush()} compact />
              {!wide ? <IconButton icon={Eye} label="Preview" onClick={() => (sectionPage ? pagePreview(sectionPage) : openPreview(null))} data-open-preview /> : null}
              {publishControl}
            </div>
          </div>
          {/* K29: one clear bar while guests see an older version than the draft (autosave keeps saving the draft). */}
          {showChanges ? (
            <div className={styles.changesBar} data-changes-bar>
              <div className={styles.changesInner}>
                <p className={styles.changesText} role="status">
                  <span className={styles.changesDot} aria-hidden="true" />
                  <span>
                    Unpublished changes
                    {changes.length ? (
                      <>
                        : <strong data-changes-count>{changes.length}</strong>
                      </>
                    ) : null}
                  </span>
                </p>
                <div className={styles.changesActions}>
                  <button type="button" className={styles.changesReview} onClick={() => setDialog({ kind: 'review' })} data-changes-review>
                    Review
                  </button>
                  <Button
                    small
                    className={styles.changesPublish}
                    busy={busy}
                    busyLabel="Publishing…"
                    disabled={locked || !online}
                    title={online ? undefined : 'Connect to the internet to publish.'}
                    onClick={() => void startPublish()}
                    data-publish
                  >
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
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
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* While the phone preview covers the screen, the editor behind it is out of reach (focus, Tab, screen readers). */}
          <main id="main" className={styles.main} inert={(previewOpen && !wide) || undefined}>
            {banners}
            <div className={styles.pageHead}>
              {sectionPage ? (
                <span className={styles.pageIcon} aria-hidden="true">
                  {(() => {
                    const Icon = PAGE_ICONS[sectionPage];
                    return <Icon size={22} strokeWidth={1.75} />;
                  })()}
                </span>
              ) : null}
              <h1 ref={headingRef} tabIndex={-1} className={route.view === 'home' ? styles.homeTitle : styles.pageTitle}>
                {route.view === 'home' ? names : viewTitle}
              </h1>
              {route.view === 'home' ? <p className={styles.pageSub}>{[formatDateLong(content.date, content.locale), theme.name].filter(Boolean).join(' · ')}</p> : null}
            </div>

            {route.view === 'home' ? (
              <HomeView
                content={content}
                meta={meta}
                theme={theme}
                url={url}
                steps={steps.slice(0, 3)}
                readiness={ready100}
                setupStep={setupStep}
                thankYouOn={Boolean(theme.thankYou) && meta.status === 'published' && !rights.archived && isThankYouOn(publishedCopy ?? content)}
                replies={replies}
                onGo={goTo}
                onPublish={() => void startPublish()}
                onShare={() => go({ view: 'share' })}
                onContinueSetup={() => {
                  writeSetup(initial.slug, { dismissed: false });
                  go({ view: 'setup', step: setupStep ?? 1 });
                }}
                onHelp={(topic) => setDialog({ kind: 'help', topic })}
                onCopy={() => void copy(url)}
                excelUrl={panel.api.repliesExcelUrl()}
              />
            ) : null}
            {route.view === 'edit' ? (
              <EditListView
                pages={PAGE_IDS.filter((id) => pageSections(id).length)}
                summaries={summaries}
                errorCount={pageErrors}
                icons={PAGE_ICONS}
                onOpen={(id) => go({ view: 'section', page: id, focus: null })}
              />
            ) : null}
            {sectionPage ? (
              <div className={styles.sectionPage} data-page={sectionPage}>
                {/* G100 (docs/18 §2): one line for the page's sample text instead of a tag on every field. */}
                <SampleLine
                  count={pageSample(sectionPage).length}
                  scope={`[data-page="${sectionPage}"]`}
                  onMissing={() => {
                    const first = pageSample(sectionPage)[0];
                    if (first) goTo(first.path);
                  }}
                />
                <SectionJumps sections={pageSections(sectionPage)} titles={BLOCK_TITLES} />
                {pageSections(sectionPage).map((id) => {
                  const title = pageSections(sectionPage).length > 1 ? BLOCK_TITLES[id] : undefined;
                  return (
                    <section key={id} id={`section-${id}-body`} className={styles.sectionBlock} data-section={id} aria-labelledby={title ? `block-${id}` : undefined}>
                      {title ? (
                        <h2 id={`block-${id}`} className={styles.blockTitle}>
                          {title}
                        </h2>
                      ) : null}
                      {sectionBody(id)}
                    </section>
                  );
                })}
                {/* G068: the design's texts of this page, folded at its end (K29: no seventh "Wording" page) */}
                {theme.copy.some((e) => e.panel === sectionPage) ? (
                  <section id="section-copy-body" className={styles.sectionBlock} data-section="copy">
                    <CopyFields page={sectionPage} entries={theme.copy} openRequest={copyJump} onFocusKey={followCopy} />
                  </section>
                ) : null}
                {!wide ? (
                  <div className={styles.sectionFoot}>
                    <Button block icon={Eye} onClick={() => pagePreview(sectionPage)}>
                      Preview this page
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}
            {route.view === 'guests' || route.view === 'results' ? (
              <GuestsView
                tab={route.view === 'results' ? 'results' : 'list'}
                onTab={(t) => go({ view: t === 'results' ? 'results' : 'guests' })}
                api={panel.api}
                replies={replies}
                content={content}
                meta={meta}
                online={online}
                onPublish={() => void startPublish()}
                onShare={() => go({ view: 'share' })}
                onSettings={() => go({ view: 'section', page: 'rsvp', focus: null })}
                onPrint={() => go({ view: 'print' })}
              />
            ) : null}
            {route.view === 'print' ? (
              <GuestPrintView
                replies={replies}
                content={content}
                names={names}
                onBack={() => {
                  if (navCount.current > 0) window.history.back();
                  else go({ view: 'guests' }, true);
                }}
              />
            ) : null}
            {route.view === 'share' ? (
              <ShareView
                url={url}
                slug={initial.slug}
                editKey={editKey}
                hideEditLink={Boolean(shopUntil)}
                meta={meta}
                orderRef={initial.orderRef}
                online={online}
                onPublish={() => void startPublish()}
                onOffline={() => setDialog({ kind: 'offline' })}
                onCopy={(text, what) => void copy(text, what)}
                onGuestAccess={panel.setGuestAccess}
                names={names}
                date={formatDateLong(content.date, content.locale)}
                replyBy={content.rsvp?.method !== 'none' ? formatDate(content.rsvp?.deadline, content.locale) : null}
                thankYouOn={Boolean(theme.thankYou) && meta.status === 'published' && !rights.archived && isThankYouOn(publishedCopy ?? content)}
                themeColor={theme.color ?? null}
                shareImage={theme.shareImage ?? null}
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

/** "20 Eki 14:30" (Istanbul time: the shop's own clock). */
function shopUntilText(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(t);
}

function readSetupStep(slug: string): number | null {
  if (typeof window === 'undefined') return null;
  const s = readSetup(slug).step;
  return s && s >= 1 && s <= 6 ? setupStepOf(s) : null;
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
