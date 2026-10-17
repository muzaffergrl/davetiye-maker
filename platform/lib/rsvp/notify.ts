// "Email me when a guest replies" (G152): Panel → Guests switch; off by default and offered only while the platform can
// send email (SMTP, lib/mail/config.ts). On every counted guest reply (lib/rsvp/guest.ts onStored; never a held one,
// never one the couple adds themselves) the site's owner email ON RECORD gets a short email: guest name, yes / no,
// party size, a few answers, and a link to <origin>/my — no edit or device key (the editor is opened with the order
// number + email there).
//
// Stored as the site document "rsvp-notify" (DataAdapter.readSiteDoc / updateSiteDoc), not in the site record: a reply
// must not move the site's updatedAt (an open panel would see a save conflict).
//   {v: 1, enabled, changedAt, day: "YYYY-MM-DD" (UTC), sent, skipped}
// Cap: at most DAILY_LIMIT emails per site per UTC day. Replies after that are only counted (skipped); the next email
// that goes out (the next day at the latest reply) says "N more replies arrived since our last email".
// The count is reserved in the document before sending (conditional write), so parallel replies on several server
// instances cannot pass the cap. A failed send changes nothing for the guest: their reply is already stored, and the
// error is logged as a code only (lib/mail/index.ts). Contents and addresses are never logged.

import type { DataAdapter, RsvpRecord, SiteRecord } from '../data/types.ts';
import { getRsvpNotifier, maskAddress, type RsvpNotifier } from '../mail/index.ts';

export const NOTIFY_DOC = 'rsvp-notify';
export const DAILY_LIMIT = 20;
/** Answers listed in one email, and their lengths (the panel has the rest). */
const MAX_ANSWERS = 5;
const MAX_MESSAGE = 300;

export interface NotifyDoc {
  v: 1;
  enabled: boolean;
  changedAt: string;
  day?: string | null;
  sent?: number;
  skipped?: number;
}

/** What the panel sees (GET/POST /api/edit/<slug>/notify). */
export interface NotifyView {
  /** The platform can send email; false: the panel does not show the switch. */
  available: boolean;
  enabled: boolean;
  /** Where the emails go, partly hidden ("av***@example.com"); null when the site has no owner email. */
  to: string | null;
}

/** The couple's names as the panel shows them (same rule as lib/claim/continue.ts siteNames). */
function siteNames(site: SiteRecord): string {
  const c = site.content;
  return (c.name_display || (c.partners ?? []).map((p) => p.display_name).filter(Boolean).join(' & ') || '').slice(0, 120);
}

const utcDay = (now: Date) => now.toISOString().slice(0, 10);
const count = (v: unknown) => (typeof v === 'number' && Number.isInteger(v) && v > 0 ? v : 0);

function asDoc(raw: unknown): NotifyDoc | null {
  const d = raw as Partial<NotifyDoc> | null;
  return d && typeof d === 'object' && d.v === 1 ? (d as NotifyDoc) : null;
}

export async function notifyView(adapter: DataAdapter, site: SiteRecord, notifier: RsvpNotifier = getRsvpNotifier()): Promise<NotifyView> {
  const doc = asDoc(await adapter.readSiteDoc(site.id, NOTIFY_DOC));
  return { available: notifier.enabled, enabled: Boolean(doc?.enabled), to: site.ownerEmail ? maskAddress(site.ownerEmail) : null };
}

/** Turns the emails on or off (the daily count is kept, so switching does not reset the cap). */
export async function setNotify(adapter: DataAdapter, site: SiteRecord, enabled: boolean, now: Date = new Date()): Promise<void> {
  await adapter.updateSiteDoc<NotifyDoc>(site.id, NOTIFY_DOC, (cur) => {
    const d = asDoc(cur);
    return { v: 1, enabled, changedAt: now.toISOString(), day: d?.day ?? null, sent: count(d?.sent), skipped: enabled ? count(d?.skipped) : 0 };
  });
}

/**
 * Reserves one email for a reply: {send: true, more} while today's cap allows it (more = replies not emailed since the
 * last one), else {send: false} and the reply is counted for the next email. Pure; exported for the tests.
 */
export function reserve(doc: NotifyDoc | null, now: Date): { send: boolean; more: number; next: NotifyDoc | null } {
  if (!doc?.enabled) return { send: false, more: 0, next: doc };
  const day = utcDay(now);
  const sent = doc.day === day ? count(doc.sent) : 0;
  const skipped = count(doc.skipped);
  if (sent >= DAILY_LIMIT) return { send: false, more: 0, next: { ...doc, day, sent, skipped: skipped + 1 } };
  return { send: true, more: skipped, next: { ...doc, day, sent: sent + 1, skipped: 0 } };
}

const cut = (v: string, max: number) => (v.length > max ? `${v.slice(0, max - 1).trimEnd()}…` : v);

/** Emails the couple about one stored reply, when they asked for it. Never throws (a guest's reply never depends on it). */
export async function notifyCouple(
  adapter: DataAdapter,
  site: SiteRecord,
  reply: RsvpRecord,
  origin: string,
  opts: { notifier?: RsvpNotifier; now?: Date } = {},
): Promise<{ sent: boolean }> {
  try {
    const notifier = opts.notifier ?? getRsvpNotifier();
    if (!notifier.enabled || !site.ownerEmail || reply.held || reply.source === 'couple') return { sent: false };
    // Most sites never turn it on: one read, no write.
    if (!asDoc(await adapter.readSiteDoc(site.id, NOTIFY_DOC))?.enabled) return { sent: false };
    const now = opts.now ?? new Date();
    let plan: ReturnType<typeof reserve> = { send: false, more: 0, next: null };
    // The change function may run again on a write conflict: the last run decides.
    await adapter.updateSiteDoc<NotifyDoc>(site.id, NOTIFY_DOC, (cur) => {
      plan = reserve(asDoc(cur), now);
      return plan.next;
    });
    if (!plan.send) return { sent: false };
    const base = origin.replace(/\/+$/, '');
    return await notifier.reply(site.ownerEmail, {
      names: siteNames(site),
      guestName: cut(reply.name, 80),
      attending: reply.attending,
      guests: reply.attending ? Math.max(1, reply.guests) : 0,
      answers: (reply.answers ?? [])
        .filter((a) => a.answer.trim())
        .slice(0, MAX_ANSWERS)
        .map((a) => ({ question: cut(a.question, 80), answer: cut(a.answer, 160) })),
      message: reply.message?.trim() ? cut(reply.message.trim(), MAX_MESSAGE) : null,
      moreReplies: plan.more,
      dailyLimit: DAILY_LIMIT,
      myUrl: `${base}/my`,
      siteUrl: `${base}/${site.slug}`,
    });
  } catch (e) {
    console.error(`[rsvp] reply notice: ${e instanceof Error ? e.name : 'error'}`);
    return { sent: false };
  }
}

/**
 * The RSVP route: the email goes after the guest's answer (Next's after()), never holding the guest up. Nothing at all
 * while the platform cannot send email. Outside a request (tests, scripts) it runs at once in the background.
 */
export function scheduleReplyNotice(
  adapter: DataAdapter,
  site: SiteRecord,
  reply: RsvpRecord,
  origin: string,
  after?: (task: () => Promise<unknown>) => void,
): void {
  if (!getRsvpNotifier().enabled || !site.ownerEmail) return;
  const task = () => notifyCouple(adapter, site, reply, origin);
  try {
    if (!after) throw new Error('no after()');
    after(task);
  } catch {
    void task();
  }
}
