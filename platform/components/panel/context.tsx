'use client';
// The panel's shared state for the editor pages and the setup (G181: its own module, so the panel's shell holds it
// without the form building blocks of fields.tsx, which load with the editor pages).

import { createContext, useContext, useEffect, useState } from 'react';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { isValidTimeZone } from '../../lib/content/format.ts';
import type { PanelPhotoSlot, ThemeFieldUse } from '../../lib/panel/model.ts';
import type { RightsView } from '../../lib/panel/rights.ts';
import type { Change } from './usePanel.ts';

export interface PanelContextValue {
  content: ContentRecord;
  edit: (change: Change) => void;
  /** Issues whose path is exactly `path`. */
  issuesAt: (path: string) => ValidationIssue[];
  /** Saving stopped (conflict / invalid link) or the site is archived: inputs are read only. */
  locked: boolean;
  /** True while the value at `path` is still the design's sample text (lib/panel/model.ts sampleNotes). */
  isSample: (path: string) => boolean;
  /** Short-lived panel preview token, for the buyer's own photo views (/media/… needs it until published). */
  previewToken: string;
  /** Fields the theme shows (others are hidden in the panel). */
  fields: ThemeFieldUse;
  rights: RightsView;
  online: boolean;
  /** Opens the "Change names or date" sheet (after the first publish). */
  openIdentity: (focus: 'names' | 'date') => void;
  photoSlots: PanelPhotoSlot[];
  uploadPhoto: (slot: PanelPhotoSlot, blob: Blob) => Promise<{ ok: boolean; message?: string }>;
  removePhoto: (slot: PanelPhotoSlot) => void;
  /** G126: upload the couple's own story music (content.audio is set when it is stored). */
  uploadMusic?: (file: File, onProgress?: (share: number) => void) => Promise<{ ok: boolean; message?: string }>;
  /** G126: the design's id (its default music track, lib/audio/catalog.ts). */
  themeId?: string;
  /** G121: the last jump to a field (Home → Settings): a folded part holding that field opens for it (a new object each jump). */
  jump?: { path: string } | null;
  /** G121: what guests tap first in this design ("envelope", "book" …; PanelTheme.opening), for the panel's sentences. */
  opening?: string | null;
  /**
   * G181: the panel decided its first view in the browser (this phone's time zone and screen are read). False while a
   * server-rendered view hydrates; absent = true.
   */
  settled?: boolean;
  /** G127: reads a short map share link on the server (lib/panel/map-link.ts); absent = the address is used. */
  resolveMapLink?: (url: string) => Promise<{ ok: boolean; body: { lat?: number | null; lng?: number | null; message?: string } }>;
}

export const PanelContext = createContext<PanelContextValue | null>(null);

/** This phone's time zone (read after mount, so the server and the first browser render match). Null when unknown. */
export function useDeviceZone(): string | null {
  const [zone, setZone] = useState<string | null>(null);
  useEffect(() => {
    try {
      const z = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
      setZone(z && isValidTimeZone(z) ? z : null);
    } catch {
      /* unknown */
    }
  }, []);
  return zone;
}

export function usePanelContext(): PanelContextValue {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error('PanelContext missing');
  return ctx;
}
