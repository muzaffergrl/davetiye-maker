'use client';
// Panel state: the draft, autosave (debounced, one request at a time), publish / unpublish, photos.
//
// Every save sends the `updatedAt` it last saw; the server answers 409 when the site changed
// elsewhere (another tab or phone). Saving then stops and the panel asks for a reload, so one
// device never silently overwrites another.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ContentRecord } from '../../lib/content/types.ts';
import { validateContent, type ValidationIssue } from '../../lib/content/validate.ts';
import { panelIssues, withPhoto, type PanelMeta, type PanelPhotoSlot, type PanelState } from '../../lib/panel/model.ts';
import { panelApi } from './api.ts';

export type SaveState = 'saved' | 'pending' | 'saving' | 'retrying' | 'conflict' | 'unauthorized' | 'refused';

const AUTOSAVE_DELAY_MS = 800;
const RETRY_MIN_MS = 2000;
const RETRY_MAX_MS = 30000;

export type Change = (draft: ContentRecord) => ContentRecord | void;

export interface PublishOutcome {
  ok: boolean;
  url?: string;
  message?: string;
  issues?: ValidationIssue[];
}

function metaFrom(body: Record<string, unknown>, fallback: PanelMeta): PanelMeta {
  return {
    status: body.status === 'published' || body.status === 'draft' ? body.status : fallback.status,
    updatedAt: typeof body.updatedAt === 'string' ? body.updatedAt : fallback.updatedAt,
    publishedAt: typeof body.publishedAt === 'string' || body.publishedAt === null ? (body.publishedAt as string | null) : fallback.publishedAt,
    hasUnpublishedChanges: typeof body.hasUnpublishedChanges === 'boolean' ? body.hasUnpublishedChanges : fallback.hasUnpublishedChanges,
  };
}

export function usePanel(initial: PanelState, editKey: string) {
  const api = useMemo(() => panelApi(initial.slug, editKey), [initial.slug, editKey]);
  const [content, setContent] = useState<ContentRecord>(initial.content);
  const [meta, setMeta] = useState<PanelMeta>({
    status: initial.status,
    updatedAt: initial.updatedAt,
    publishedAt: initial.publishedAt,
    hasUnpublishedChanges: initial.hasUnpublishedChanges,
  });
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  /** Bumped after every successful save / publish: the preview reloads. */
  const [previewVersion, setPreviewVersion] = useState(0);

  const contentRef = useRef(content);
  const metaRef = useRef(meta);
  const version = useRef(0);
  const savedVersion = useRef(0);
  const stopped = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelay = useRef(RETRY_MIN_MS);
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const applyMeta = useCallback((body: Record<string, unknown>) => {
    const next = metaFrom(body, metaRef.current);
    metaRef.current = next;
    setMeta(next);
  }, []);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  // One PUT. Returns true when the version it sent is stored.
  const saveOnce = useCallback(async (): Promise<boolean> => {
    const v = version.current;
    setSaveState('saving');
    const res = await api.saveDraft(contentRef.current, metaRef.current.updatedAt);
    if (res.ok) {
      savedVersion.current = v;
      retryDelay.current = RETRY_MIN_MS;
      applyMeta(res.body);
      setPreviewVersion((n) => n + 1);
      setSaveMessage(null);
      setSaveState(version.current === savedVersion.current ? 'saved' : 'pending');
      return true;
    }
    setSaveMessage(res.body.message ?? null);
    if (res.status === 409) {
      stopped.current = true;
      setSaveState('conflict');
    } else if (res.status === 401) {
      stopped.current = true;
      setSaveState('unauthorized');
    } else if (res.status === 400 || res.status === 413 || res.status === 415) {
      setSaveState('refused'); // retried with the next change
    } else {
      setSaveState('retrying');
      const delay = retryDelay.current;
      retryDelay.current = Math.min(delay * 2, RETRY_MAX_MS);
      clearTimer();
      timer.current = setTimeout(() => void flushRef.current(), delay);
    }
    return false;
  }, [api, applyMeta]);

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
  const edit = useCallback((change: Change) => {
    if (stopped.current) return;
    const draft = structuredClone(contentRef.current);
    const next = change(draft) ?? draft;
    contentRef.current = next;
    setContent(next);
    version.current += 1;
    setSaveState('pending');
    clearTimer();
    timer.current = setTimeout(() => void flushRef.current(), AUTOSAVE_DELAY_MS);
  }, []);

  const publish = useCallback(async (): Promise<PublishOutcome> => {
    if (!(await flush())) return { ok: false, message: 'Your latest changes are not saved yet. Please try again in a moment.' };
    const res = await api.publish(metaRef.current.updatedAt);
    if (res.ok) {
      applyMeta(res.body);
      setPreviewVersion((n) => n + 1);
      return { ok: true, url: typeof res.body.url === 'string' ? res.body.url : undefined };
    }
    if (res.status === 409) {
      stopped.current = true;
      setSaveState('conflict');
      setSaveMessage(res.body.message ?? null);
    }
    if (res.status === 401) {
      stopped.current = true;
      setSaveState('unauthorized');
    }
    return { ok: false, message: res.body.message, issues: (res.body as { issues?: ValidationIssue[] }).issues };
  }, [api, applyMeta, flush]);

  const unpublish = useCallback(async (): Promise<PublishOutcome> => {
    const res = await api.unpublish();
    if (res.ok) {
      applyMeta(res.body);
      return { ok: true };
    }
    return { ok: false, message: res.body.message };
  }, [api, applyMeta]);

  const uploadPhoto = useCallback(
    async (slot: PanelPhotoSlot, blob: Blob): Promise<{ ok: boolean; message?: string }> => {
      if (stopped.current) return { ok: false, message: saveMessage ?? 'Saving is paused. Please reload the page.' };
      const res = await api.uploadPhoto(slot.key, blob);
      if (!res.ok || typeof res.body.url !== 'string') return { ok: false, message: res.body.message ?? 'The photo could not be uploaded.' };
      const url = res.body.url;
      edit((c) => withPhoto(c, slot.source, url));
      void flush(); // store the new photo right away
      return { ok: true };
    },
    [api, edit, flush, saveMessage],
  );

  const removePhoto = useCallback(
    (slot: PanelPhotoSlot) => {
      edit((c) => withPhoto(c, slot.source, null));
    },
    [edit],
  );

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

  const validation = useMemo(() => {
    const result = validateContent(content, { platform: true });
    return { ...result, errors: panelIssues(result.errors, content), warnings: panelIssues(result.warnings, content) };
  }, [content]);

  return {
    api,
    content,
    meta,
    saveState,
    saveMessage,
    previewVersion,
    validation,
    locked: saveState === 'conflict' || saveState === 'unauthorized',
    edit,
    flush,
    publish,
    unpublish,
    uploadPhoto,
    removePhoto,
  };
}

export type PanelController = ReturnType<typeof usePanel>;
