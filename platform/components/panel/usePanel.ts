'use client';
// Panel state: the draft, autosave (debounced, one request at a time), publish / unpublish, photos,
// name / date changes after publishing (G060), the offline copy on this phone (G060 §9.2).
//
// Every save sends the `updatedAt` it last saw; the server answers 409 when the site changed
// elsewhere (another tab or phone). Saving then stops and the panel asks for a reload, so one
// device never silently overwrites another. Two cases look like that but are not:
//  - our own save was stored but its answer was lost (flaky phone network): on 409 the panel reads
//    the stored draft; if it is exactly what we sent, it takes the new updatedAt and carries on;
//  - publish / unpublish / identity change updatedAt too: they run in the same one-at-a-time queue as
//    the saves, so a save typed during a slow publish is sent after it with the new updatedAt;
//  - G145: the shop wrote something that is not the draft (a note, a copied message, a confirmed order, an added
//    change): on 409 the stored draft is still the one this panel last stored, so it takes the new updatedAt and
//    sends the save again.
//
// Offline copy: while a change is not stored yet, the draft is also kept in localStorage
// ("draft:<slug>" = {baseUpdatedAt, content, at}). It is removed once everything is saved. When the panel
// opens and finds one made on the same server version, it offers to restore it; a copy made on an older
// version is never applied silently (it would overwrite another device's work).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ContentRecord } from '../../lib/content/types.ts';
import { validateContent, type ValidationIssue } from '../../lib/content/validate.ts';
import { copyIssues } from '../../lib/theme/copy.ts';
import { followWeddingDate, panelIssues, previewTokenExpiry, sameContent, withPhoto, type PanelMeta, type PanelPhotoSlot, type PanelState } from '../../lib/panel/model.ts';
import { archivingDateIssue, withIdentity, type Identity, type RightsView } from '../../lib/panel/rights.ts';
import { NO_GUEST_ACCESS, type GuestAccessView } from '../../lib/panel/guest-access.ts';
import { panelApi } from './api.ts';
import { uploadMusicFile } from './music-upload.ts';
import { t } from '../../lib/i18n/client.ts';

export type SaveState = 'saved' | 'pending' | 'saving' | 'retrying' | 'offline' | 'conflict' | 'unauthorized' | 'refused';

const AUTOSAVE_DELAY_MS = 800;
const RETRY_MIN_MS = 2000;
const RETRY_MAX_MS = 30000;
const BACKUP_MAX_BYTES = 64 * 1024;

export type Change = (draft: ContentRecord) => ContentRecord | void;

export interface PublishOutcome {
  ok: boolean;
  url?: string;
  status?: number;
  code?: string;
  message?: string;
  issues?: ValidationIssue[];
}

export interface IdentityOutcome {
  ok: boolean;
  status: number;
  code?: string;
  result?: 'unchanged' | 'free' | 'typo' | 'undo' | 'sample_date' | 'change';
  message?: string;
  remaining?: number;
  issues?: ValidationIssue[];
}

export interface AccessOutcome {
  ok: boolean;
  status: number;
  code?: string;
  message?: string;
  /** A new password: guests who entered the old one are asked again (G076). */
  signedOut?: boolean;
}

export interface LocalBackup {
  baseUpdatedAt: string;
  content: ContentRecord;
  at: string;
}

function metaFrom(body: Record<string, unknown>, fallback: PanelMeta): PanelMeta {
  return {
    status: body.status === 'published' || body.status === 'draft' ? body.status : fallback.status,
    updatedAt: typeof body.updatedAt === 'string' ? body.updatedAt : fallback.updatedAt,
    publishedAt: typeof body.publishedAt === 'string' || body.publishedAt === null ? (body.publishedAt as string | null) : fallback.publishedAt,
    hasUnpublishedChanges: typeof body.hasUnpublishedChanges === 'boolean' ? body.hasUnpublishedChanges : fallback.hasUnpublishedChanges,
    rights: body.rights && typeof body.rights === 'object' ? (body.rights as RightsView) : fallback.rights,
    // Same value for a whole hour (lib/keys.ts), so the preview frame keeps its address between saves.
    previewToken: typeof body.previewToken === 'string' && body.previewToken ? body.previewToken : fallback.previewToken,
    orderPending: typeof body.orderPending === 'boolean' ? body.orderPending : fallback.orderPending,
    guestAccess: guestAccessFrom(body.guestAccess) ?? fallback.guestAccess,
    variant: typeof body.variant === 'string' || body.variant === null ? (body.variant as string | null) : fallback.variant,
  };
}

function guestAccessFrom(value: unknown): GuestAccessView | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.enabled !== 'boolean') return null;
  return { enabled: v.enabled, password: typeof v.password === 'string' && v.password ? v.password : null };
}

/** Renew the preview token this long before it runs out (an idle tab, the phone asleep). */
const TOKEN_RENEW_MS = 60 * 60_000;

const backupKey = (slug: string) => `draft:${slug}`;

function readBackup(slug: string): LocalBackup | null {
  try {
    const raw = window.localStorage.getItem(backupKey(slug));
    if (!raw) return null;
    const v = JSON.parse(raw) as LocalBackup;
    return v && typeof v.baseUpdatedAt === 'string' && v.content && typeof v.content === 'object' ? v : null;
  } catch {
    return null;
  }
}

function writeBackup(slug: string, value: LocalBackup | null): boolean {
  try {
    if (!value) {
      window.localStorage.removeItem(backupKey(slug));
      return false;
    }
    const text = JSON.stringify(value);
    if (text.length > BACKUP_MAX_BYTES) return false;
    window.localStorage.setItem(backupKey(slug), text);
    return true;
  } catch {
    return false;
  }
}

export function usePanel(initial: PanelState, editKey: string) {
  const api = useMemo(() => panelApi(initial.slug, editKey), [initial.slug, editKey]);
  const [content, setContent] = useState<ContentRecord>(initial.content);
  const [meta, setMeta] = useState<PanelMeta>({
    status: initial.status,
    updatedAt: initial.updatedAt,
    publishedAt: initial.publishedAt,
    hasUnpublishedChanges: initial.hasUnpublishedChanges,
    rights: initial.rights,
    previewToken: initial.previewToken,
    orderPending: initial.orderPending,
    guestAccess: initial.guestAccess ?? NO_GUEST_ACCESS,
    variant: initial.variant ?? null,
  });
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  /** Bumped after every successful save / publish: the preview reloads. */
  const [previewVersion, setPreviewVersion] = useState(0);
  const [online, setOnline] = useState(true);
  /** A copy found on this phone when the panel opened (offer Restore / Discard). */
  const [foundBackup, setFoundBackup] = useState<{ backup: LocalBackup; sameBase: boolean } | null>(null);
  /** True while the unsaved draft is also kept on this phone. */
  const [backedUp, setBackedUp] = useState(false);
  /** The server kept the stored names/date over an autosave (another tab changed them): tell the buyer once. */
  const [identityKeptAt, setIdentityKeptAt] = useState(0);

  const contentRef = useRef(content);
  /** The draft as the server last stored it (as far as this panel knows); G145 conflict check. */
  const serverContentRef = useRef<ContentRecord>(initial.content);
  const metaRef = useRef(meta);
  const version = useRef(0);
  const savedVersion = useRef(0);
  const stopped = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelay = useRef(RETRY_MIN_MS);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const archived = meta.rights.archived;

  const applyMeta = useCallback((body: Record<string, unknown>) => {
    const next = metaFrom(body, metaRef.current);
    metaRef.current = next;
    setMeta(next);
  }, []);

  /** Replaces the local draft without making it "unsaved" (it already equals what the server stored). */
  const replaceContent = useCallback((next: ContentRecord) => {
    contentRef.current = next;
    setContent(next);
  }, []);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const keepBackup = useCallback(() => {
    if (version.current === savedVersion.current) {
      writeBackup(initial.slug, null);
      setBackedUp(false);
      return;
    }
    setBackedUp(writeBackup(initial.slug, { baseUpdatedAt: metaRef.current.updatedAt, content: contentRef.current, at: new Date().toISOString() }));
  }, [initial.slug]);

  const scheduleRetry = useCallback((offline: boolean) => {
    setSaveState(offline ? 'offline' : 'retrying');
    const delay = retryDelay.current;
    retryDelay.current = Math.min(delay * 2, RETRY_MAX_MS);
    clearTimer();
    timer.current = setTimeout(() => void flushRef.current(), delay);
  }, []);

  // One PUT. Returns true when the version it sent is stored.
  const saveOnce = useCallback(async (): Promise<boolean> => {
    const v = version.current;
    const sent = contentRef.current;
    setSaveState('saving');
    const res = await api.saveDraft(sent, metaRef.current.updatedAt);
    const stored = (body: Record<string, unknown>) => {
      savedVersion.current = v;
      retryDelay.current = RETRY_MIN_MS;
      applyMeta(body);
      if (body.identityKept === true && body.identity && typeof body.identity === 'object') {
        // Names and date are kept on the server after the first publish: show what is stored.
        replaceContent(withIdentity(contentRef.current, body.identity as Identity));
        setIdentityKeptAt(Date.now());
      }
      serverContentRef.current = body.identityKept === true && body.identity && typeof body.identity === 'object' ? withIdentity(sent, body.identity as Identity) : sent;
      setPreviewVersion((n) => n + 1);
      setSaveMessage(null);
      setSaveState(version.current === savedVersion.current ? 'saved' : 'pending');
      keepBackup();
      return true;
    };
    if (res.ok) return stored(res.body);
    if (res.status === 409) {
      // Maybe our own earlier attempt was stored and only its answer got lost: compare with what is stored.
      const check = await api.state();
      const state = (check.body as { state?: { content?: unknown } & Record<string, unknown> }).state;
      if (check.ok && state && sameContent(state.content, sent)) return stored(state);
      // G145: only the shop's bookkeeping changed (the draft is still ours): carry on from the new version.
      if (check.ok && state && typeof state.updatedAt === 'string' && sameContent(state.content, serverContentRef.current)) {
        applyMeta(state);
        const again = await api.saveDraft(sent, metaRef.current.updatedAt);
        if (again.ok) return stored(again.body);
      }
      if (check.status === 0) {
        scheduleRetry(typeof navigator !== 'undefined' && navigator.onLine === false);
        return false;
      }
      setSaveMessage(res.body.message ?? null);
      stopped.current = true;
      setSaveState('conflict');
      return false;
    }
    setSaveMessage(res.body.message ?? null);
    if (res.status === 401) {
      stopped.current = true;
      setSaveState('unauthorized');
    } else if (res.status === 403 && res.body.code === 'archived') {
      stopped.current = true;
      setSaveState('refused');
    } else if (res.status === 400 || res.status === 413 || res.status === 415) {
      setSaveState('refused'); // retried with the next change
    } else {
      scheduleRetry(res.status === 0 && typeof navigator !== 'undefined' && navigator.onLine === false);
    }
    return false;
  }, [api, applyMeta, keepBackup, replaceContent, scheduleRetry]);

  /** Saves everything typed so far (requests are queued, never parallel). Resolves true when all is stored. */
  const flush = useCallback((): Promise<boolean> => {
    clearTimer();
    const run = queue.current.then(async () => {
      while (!stopped.current && version.current !== savedVersion.current) {
        if (!(await saveOnce())) return false;
      }
      return !stopped.current;
    });
    queue.current = run.catch(() => false);
    return run;
  }, [saveOnce]);
  const flushRef = useRef(flush);
  flushRef.current = flush;

  /** Applies a change to a copy of the draft and schedules the autosave. */
  const edit = useCallback(
    (change: Change) => {
      if (stopped.current || archived) return;
      const prev = contentRef.current;
      const draft = structuredClone(prev);
      // G087: a sample reply-by date follows the wedding date (lib/panel/model.ts followWeddingDate).
      const next = followWeddingDate(prev, change(draft) ?? draft, initial.theme.sample);
      contentRef.current = next;
      setContent(next);
      version.current += 1;
      setSaveState((s) => (s === 'offline' ? 'offline' : 'pending'));
      keepBackup();
      clearTimer();
      timer.current = setTimeout(() => void flushRef.current(), AUTOSAVE_DELAY_MS);
    },
    [archived, keepBackup, initial.theme.sample],
  );

  /**
   * Runs a request in the save queue (after any save in flight; saves typed meanwhile wait for it)
   * and applies the new updatedAt before the next queued save is sent.
   */
  const enqueue = useCallback(
    <T extends { ok: boolean; body: Record<string, unknown> }>(send: () => Promise<T>): Promise<T> => {
      const run = queue.current.then(async () => {
        const res = await send();
        if (res.ok) applyMeta(res.body);
        return res;
      });
      queue.current = run.catch(() => undefined);
      return run;
    },
    [applyMeta],
  );

  const stopOn = (status: number, body: { code?: string; message?: string }) => {
    if (status === 409 && body.code === 'conflict') {
      stopped.current = true;
      setSaveState('conflict');
      setSaveMessage(body.message ?? null);
    }
    if (status === 401) {
      stopped.current = true;
      setSaveState('unauthorized');
    }
  };

  const publish = useCallback(async (): Promise<PublishOutcome> => {
    if (!(await flush())) return { ok: false, message: t('Your latest changes are not saved yet. Please try again in a moment.') };
    const res = await enqueue(() => api.publish(metaRef.current.updatedAt));
    if (res.ok) {
      setPreviewVersion((n) => n + 1);
      return { ok: true, url: typeof res.body.url === 'string' ? res.body.url : undefined };
    }
    stopOn(res.status, res.body);
    return { ok: false, status: res.status, code: res.body.code, message: res.body.message, issues: (res.body as { issues?: ValidationIssue[] }).issues };
  }, [api, enqueue, flush]);

  const unpublish = useCallback(async (): Promise<PublishOutcome> => {
    const res = await enqueue(() => api.unpublish());
    if (res.ok) return { ok: true };
    stopOn(res.status, res.body);
    return { ok: false, status: res.status, code: res.body.code, message: res.body.message };
  }, [api, enqueue]);

  /** Names / date after the first publish (POST /identity). intent "change" confirms using one change. */
  const changeIdentity = useCallback(
    async (identity: Identity, intent: 'fix' | 'change'): Promise<IdentityOutcome> => {
      if (!(await flush())) return { ok: false, status: 0, message: t('Your latest changes are not saved yet. Please try again in a moment.') };
      const res = await enqueue(() => api.identity(identity, intent, metaRef.current.updatedAt));
      const body = res.body as Record<string, unknown> & { code?: string; message?: string };
      if (res.ok) {
        if (body.identity && typeof body.identity === 'object') replaceContent(withIdentity(contentRef.current, body.identity as Identity));
        serverContentRef.current = contentRef.current;
        setPreviewVersion((n) => n + 1);
        keepBackup();
        const rights = body.rights as RightsView | undefined;
        return { ok: true, status: res.status, result: body.result as IdentityOutcome['result'], remaining: rights?.remaining };
      }
      stopOn(res.status, body);
      return {
        ok: false,
        status: res.status,
        code: body.code,
        message: body.message,
        remaining: typeof body.remaining === 'number' ? body.remaining : undefined,
        issues: Array.isArray(body.issues) ? (body.issues as ValidationIssue[]) : undefined,
      };
    },
    [api, enqueue, flush, keepBackup, replaceContent],
  );

  /**
   * Guest password on/off or a new one (G076, POST /access). Runs in the save queue: it changes updatedAt, so a save typed
   * meanwhile is sent after it with the new version. Applies to the live website at once (no publish).
   */
  const setGuestAccess = useCallback(
    async (enabled: boolean, password?: string): Promise<AccessOutcome> => {
      const res = await enqueue(() => api.access(enabled, password));
      const body = res.body as Record<string, unknown> & { code?: string; message?: string };
      if (res.ok) return { ok: true, status: res.status, signedOut: body.signedOut === true };
      stopOn(res.status, body);
      return {
        ok: false,
        status: res.status,
        code: body.code,
        message: res.status === 0 ? t('No connection. Please try again when you are back online.') : body.message,
      };
    },
    [api, enqueue],
  );

  /**
   * G153: the design's colour palette (POST /variant; null = the original colours). In the save queue like the guest
   * password (it changes updatedAt); applies at once to the preview and the live website, the content is not touched.
   */
  const setVariant = useCallback(
    async (variant: string | null): Promise<{ ok: boolean; message?: string }> => {
      const res = await enqueue(() => api.variant(variant));
      const body = res.body as Record<string, unknown> & { code?: string; message?: string };
      if (res.ok) {
        setPreviewVersion((n) => n + 1);
        return { ok: true };
      }
      stopOn(res.status, body);
      return { ok: false, message: res.status === 0 ? t('No connection. Please try again when you are back online.') : body.message };
    },
    [api, enqueue],
  );

  const uploadPhoto = useCallback(
    async (slot: PanelPhotoSlot, blob: Blob): Promise<{ ok: boolean; message?: string }> => {
      if (stopped.current) return { ok: false, message: saveMessage ?? t('Saving is paused. Please reload the page.') };
      const res = await api.uploadPhoto(slot.key, blob);
      if (!res.ok || typeof res.body.url !== 'string') {
        return { ok: false, message: res.status === 0 ? t('No connection. Please try again when you are back online.') : (res.body.message ?? t('The photo could not be uploaded.')) };
      }
      const url = res.body.url;
      edit((c) => withPhoto(c, slot.source, url));
      void flush(); // store the new photo right away
      return { ok: true };
    },
    [api, edit, flush, saveMessage],
  );

  // G126: the couple's own story music (sent in parts), then content.audio points to it.
  const uploadMusic = useCallback(
    async (file: File, onProgress?: (share: number) => void): Promise<{ ok: boolean; message?: string }> => {
      if (stopped.current) return { ok: false, message: saveMessage ?? t('Saving is paused. Please reload the page.') };
      const res = await uploadMusicFile(initial.slug, editKey, file, onProgress);
      if (!res.ok || !res.url) return { ok: false, message: res.message };
      const url = res.url;
      const name = file.name.slice(0, 120);
      edit((c) => void (c.audio = { ...(c.audio ?? {}), music: 'custom', music_file: url, music_name: name }));
      void flush();
      return { ok: true };
    },
    [initial.slug, editKey, edit, flush, saveMessage],
  );

  const removePhoto = useCallback(
    (slot: PanelPhotoSlot) => {
      edit((c) => withPhoto(c, slot.source, null));
    },
    [edit],
  );

  // Copy left on this phone by an earlier visit (closed while offline / before it was saved).
  useEffect(() => {
    const backup = readBackup(initial.slug);
    if (!backup) return;
    if (sameContent(backup.content, initial.content)) {
      writeBackup(initial.slug, null);
      return;
    }
    setFoundBackup({ backup, sameBase: backup.baseUpdatedAt === initial.updatedAt });
  }, [initial.slug, initial.content, initial.updatedAt]);

  const restoreBackup = useCallback(() => {
    const found = foundBackup;
    setFoundBackup(null);
    if (!found?.sameBase) return;
    edit(() => structuredClone(found.backup.content));
  }, [edit, foundBackup]);

  const discardBackup = useCallback(() => {
    setFoundBackup(null);
    writeBackup(initial.slug, null);
  }, [initial.slug]);

  // Online / offline: keep typing offline (kept on this phone), save when the connection is back.
  useEffect(() => {
    const update = () => {
      const on = navigator.onLine !== false;
      setOnline(on);
      if (on) {
        retryDelay.current = RETRY_MIN_MS;
        setSaveState((s) => (s === 'offline' ? 'pending' : s));
        if (version.current !== savedVersion.current) void flushRef.current();
      } else {
        setSaveState((s) => (s === 'saved' || s === 'saving' ? s : 'offline'));
      }
    };
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // Save when the tab is hidden (phones switch apps); warn and send a last save when closing.
  useEffect(() => {
    const unsaved = () => !stopped.current && version.current !== savedVersion.current;
    const onHidden = () => {
      if (document.visibilityState === 'hidden' && unsaved()) void flushRef.current();
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsaved()) e.preventDefault();
    };
    const onPageHide = () => {
      if (unsaved()) api.saveOnUnload(contentRef.current, metaRef.current.updatedAt);
    };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [api]);

  useEffect(() => () => clearTimer(), []);

  // The preview token is short-lived (G060-fix): every answer renews it; a tab left open (or a phone asleep) asks for a
  // fresh one before it runs out, when it is shown again and every 15 minutes.
  useEffect(() => {
    const renew = () => {
      const exp = previewTokenExpiry(metaRef.current.previewToken);
      if (document.visibilityState === 'hidden' || (exp !== null && exp - Date.now() > TOKEN_RENEW_MS)) return;
      void api.state().then((res) => {
        const state = (res.body as { state?: Record<string, unknown> }).state;
        if (res.ok && state && typeof state.previewToken === 'string') {
          const next = { ...metaRef.current, previewToken: state.previewToken };
          metaRef.current = next;
          setMeta(next);
        }
      });
    };
    const timer = window.setInterval(renew, 15 * 60_000);
    document.addEventListener('visibilitychange', renew);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', renew);
    };
  }, [api]);

  // G145: while the shop confirms the Etsy order, Publish opens by itself (no reload): asked again every minute while
  // the panel is shown and when it is shown again. Only the order flag is taken over (the draft is never touched here).
  const orderPending = meta.orderPending;
  useEffect(() => {
    if (!orderPending) return;
    const check = () => {
      if (document.visibilityState === 'hidden') return;
      void api.state().then((res) => {
        const state = (res.body as { state?: Record<string, unknown> }).state;
        if (res.ok && state && state.orderPending === false && metaRef.current.orderPending) {
          const next = { ...metaRef.current, orderPending: false };
          metaRef.current = next;
          setMeta(next);
        }
      });
    };
    const timer = window.setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, [api, orderPending]);

  /** G147: Publish pressed while the order is pending: the server asks Etsy once more (etsy mode). True = confirmed now. */
  const recheckOrder = useCallback(async (): Promise<boolean> => {
    const res = await api.state({ orderCheck: true });
    const state = (res.body as { state?: Record<string, unknown> }).state;
    if (!res.ok || !state || state.orderPending !== false) return false;
    if (metaRef.current.orderPending) {
      const next = { ...metaRef.current, orderPending: false };
      metaRef.current = next;
      setMeta(next);
    }
    return true;
  }, [api]);

  // G068: the design's texts within what the design carries (theme.json copy max), next to the content checks
  const copyLimits = useMemo(() => Object.fromEntries(initial.theme.copy.map((e) => [e.key, { max: e.max }])), [initial.theme.copy]);
  const copyLabels = useMemo(() => new Map(initial.theme.copy.map((e) => [e.key, e.label])), [initial.theme.copy]);
  const validation = useMemo(() => {
    const result = validateContent(content, { platform: true });
    const errors = panelIssues(result.errors, content);
    for (const issue of copyIssues(content, copyLimits, (k) => copyLabels.get(k) ?? 'This text')) if (issue.level === 'error') errors.push(issue);
    // Before the first publish: a date more than 12 months ago would archive the site at once (G060).
    if (meta.rights.phase === 'before_publish') {
      const now = new Date();
      const issue = archivingDateIssue(content, now.toISOString(), now);
      if (issue && !errors.some((e) => e.path === 'date')) errors.push(issue);
    }
    return { ...result, ok: result.ok && errors.length === panelIssues(result.errors, content).length, errors, warnings: panelIssues(result.warnings, content) };
  }, [content, meta.rights.phase, copyLimits, copyLabels]);

  return {
    api,
    content,
    meta,
    saveState,
    saveMessage,
    previewVersion,
    validation,
    online,
    backedUp,
    foundBackup,
    identityKeptAt,
    locked: saveState === 'conflict' || saveState === 'unauthorized' || archived,
    edit,
    flush,
    publish,
    recheckOrder,
    unpublish,
    changeIdentity,
    setGuestAccess,
    setVariant,
    uploadPhoto,
    uploadMusic,
    removePhoto,
    restoreBackup,
    discardBackup,
  };
}

export type PanelController = ReturnType<typeof usePanel>;
