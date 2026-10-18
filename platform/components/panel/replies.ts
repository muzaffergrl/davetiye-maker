'use client';
// The couple's replies, shared by the shell (the Guests tab's "new" count), Home and Guests (G069). G181: out of
// guests.tsx, so the shell loads the replies without the Guests view.

import { useEffect, useState } from 'react';
import type { RsvpQuestion } from '../../lib/content/types.ts';
import type { RsvpInsights } from '../../lib/rsvp/insights.ts';
import type { PanelApi } from './api.ts';
import { t } from '../../lib/i18n/client.ts';

export interface ReplyEntry {
  id: string;
  name: string;
  email: string | null;
  attending: boolean;
  guests: number;
  message: string | null;
  answers?: Array<{ id: string; question: string; answer: string }>;
  /** Names of the other people in the reply (G069). */
  party?: string[];
  createdAt: string;
  held?: boolean;
  /** "couple": added in the panel (G069). */
  source?: 'guest' | 'couple';
  editedAt?: string | null;
}

export interface RepliesSummary {
  counts: { responses: number; attending: number; notAttending: number; totalGuests: number; held?: number };
  insights?: RsvpInsights;
  /** The questions guests see now (the published ones). */
  questions?: RsvpQuestion[];
  /** Most people in one reply (the theme's cap). */
  maxGuests?: number;
  responses: ReplyEntry[];
}

const seenKey = (slug: string) => `seen:${slug}`;

export function useReplies(api: PanelApi, slug: string, active: boolean, published: boolean) {
  const [data, setData] = useState<RepliesSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(false);
  // undefined until read (after mount); null = never looked on this device.
  const [seen, setSeen] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    try {
      setSeen(window.localStorage.getItem(seenKey(slug)));
    } catch {
      setSeen(null); // private mode: every visit starts fresh
    }
  }, [slug]);
  useEffect(() => {
    if (!active) return;
    let alive = true;
    setLoading(true);
    void api.replies().then((res) => {
      if (!alive) return;
      setLoading(false);
      if (res.ok) {
        setData(res.body as unknown as RepliesSummary);
        setError(null);
      } else setError(res.status === 0 ? t('No connection. Replies could not be loaded.') : (res.body.message ? t(res.body.message) : t('Replies could not be loaded.')));
    });
    return () => {
      alive = false;
    };
  }, [api, tick, active, published]);
  /** Arrived since the last look on this device (the couple's own replies and held ones never count). */
  const isNew = (r: ReplyEntry) => seen !== undefined && !r.held && r.source !== 'couple' && (seen === null || r.createdAt > seen);
  const newCount = data ? data.responses.filter(isNew).length : 0;
  const markSeen = () => {
    const latest = data?.responses
      .filter((r) => !r.held && r.source !== 'couple')
      .reduce<string | null>((max, r) => (!max || r.createdAt > max ? r.createdAt : max), null);
    if (!latest) return;
    try {
      window.localStorage.setItem(seenKey(slug), latest);
    } catch {
      /* private mode: marked for this visit only */
    }
    setSeen(latest);
  };
  return { data, error, loading, refresh: () => setTick((n) => n + 1), setData, newCount, isNew, markSeen, seenAt: seen };
}
export type Replies = ReturnType<typeof useReplies>;
