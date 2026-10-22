// Support chat handlers (AI assistant on the sales site and in the panel). The route file app/api/support/chat only
// calls these.
//
//   GET  /api/support/chat   {ok, available}  — the window shows "assistant" or "not ready yet + human contacts"
//   POST /api/support/chat   {messages: [{role, text}], context: "market" | "panel", page?, slug?}
//                            panel: "Authorization: Bearer <edit key>" adds a few facts about the couple's own website
//                            (design, published, changes left …; never names, guests or keys). A wrong key is ignored.
//                            -> 200 {ok, reply} | 503 not_ready | 429 rate_limited / daily_limit | 502 busy / failed
//
// Privacy: Gemini's free tier may use prompts to improve Google's products, so the window asks people not to type
// personal details, and nothing from the couple's site content or guest list is sent. Messages are not stored here.

import { getDataAdapter } from '../data/index.ts';
import type { DataAdapter, SiteRecord } from '../data/types.ts';
import { MARKETING } from '../marketing/config.ts';
import { BodyTooLargeError, bearerKey, json, mediaType, readLimitedBytes } from '../panel/http.ts';
import { rightsView } from '../panel/rights.ts';
import { authorizeEditor } from '../rsvp/couple.ts';
import { clientIp } from '../rsvp/http.ts';
import { AdapterRateLimiter, ipBucket, MemoryRateLimiter, type RateLimiter } from '../rsvp/rate-limit.ts';
import { orderPending } from '../sites.ts';
import { SUPPORT_LIMITS, supportConfig, type SupportConfig } from './config.ts';
import { askGemini, type ChatTurn, type FetchLike } from './gemini.ts';
import { systemInstruction, type SiteFacts, type SupportContext } from './knowledge.ts';

export type SupportCode = 'not_ready' | 'rate_limited' | 'daily_limit' | 'busy' | 'failed' | 'bad_request' | 'unsupported' | 'too_large';

export interface SupportDeps {
  config?: SupportConfig;
  adapter?: DataAdapter;
  limiter?: RateLimiter;
  fetch?: FetchLike;
  now?: () => number;
}

let memoryLimiter: RateLimiter | null = null;
const adapterLimiters = new WeakMap<DataAdapter, RateLimiter>();

function limiterFor(adapter: DataAdapter): RateLimiter {
  if (adapter.hitCounter) {
    let l = adapterLimiters.get(adapter);
    if (!l) adapterLimiters.set(adapter, (l = new AdapterRateLimiter(adapter)));
    return l;
  }
  return (memoryLimiter ??= new MemoryRateLimiter());
}

function fail(status: number, code: SupportCode, extra: Record<string, string> = {}): Response {
  return json(status, { ok: false, code }, extra);
}

function retryAfter(ms: number): Record<string, string> {
  return { 'Retry-After': String(Math.max(1, Math.ceil(ms / 1000))) };
}

/** The turns as sent by the window: alternating, last one from the user, trimmed to the limits. Null = not usable. */
export function parseTurns(value: unknown): ChatTurn[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const turns: ChatTurn[] = [];
  for (const item of value.slice(-SUPPORT_LIMITS.maxTurns)) {
    if (typeof item !== 'object' || item === null) return null;
    const { role, text } = item as { role?: unknown; text?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string') return null;
    const clean = text.replace(/\u0000/g, '').trim();
    if (!clean) continue;
    if (role === 'user' && clean.length > SUPPORT_LIMITS.userChars) return null;
    turns.push({ role, text: clean.slice(0, SUPPORT_LIMITS.assistantChars) });
  }
  // Gemini wants the conversation to start with the user (the window's greeting is not sent) and end with the user.
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') return null;
  return turns;
}

function cleanPage(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  // A path only (/designs/olive-ivory, /edit/… without the key): the window sends location.pathname.
  const v = value.trim().slice(0, 120);
  if (!/^\/[\w\-./~]*$/.test(v)) return null;
  return v.startsWith('/edit/') ? '/edit (the panel)' : v;
}

/** Facts about the couple's own website for the assistant (see knowledge.ts SiteFacts). */
export function siteFacts(site: SiteRecord, now: Date = new Date()): SiteFacts {
  const r = rightsView(site, now);
  const counting = r.phase !== 'before_publish';
  const langs = site.content.languages;
  return {
    design: MARKETING.designs.find((d) => d.id === site.theme)?.name ?? site.theme,
    status: site.status === 'published' ? 'published' : 'draft',
    archived: r.archived,
    changesLeft: counting ? r.remaining : null,
    changesTotal: counting ? r.limit + r.granted : null,
    onlineUntil: counting ? r.onlineUntil : null,
    orderPending: orderPending(site),
    guestPassword: Boolean(site.guestAccess?.enabled),
    languages: langs ? [langs.primary, ...(langs.extra ?? [])] : ['en'],
  };
}

/** Canned answers for SUPPORT_CHAT=demo (screenshots and browser tests; never calls Google). */
function demoReply(question: string): string {
  return `This is a demo answer (the AI assistant is not connected yet). You asked: “${question.slice(0, 80)}”. For a real answer see the [FAQ](/faq) or message ${MARKETING.etsy.shopName} on Etsy.`;
}

export async function supportStatus(deps: SupportDeps = {}): Promise<Response> {
  const cfg = deps.config ?? supportConfig();
  return json(200, { ok: true, available: cfg.available });
}

export async function supportChat(req: Request, deps: SupportDeps = {}): Promise<Response> {
  const cfg = deps.config ?? supportConfig();
  if (mediaType(req) !== 'application/json') return fail(415, 'unsupported');
  let body: Record<string, unknown>;
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(await readLimitedBytes(req, SUPPORT_LIMITS.maxBodyBytes));
    const value = JSON.parse(text) as unknown;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return fail(400, 'bad_request');
    body = value as Record<string, unknown>;
  } catch (e) {
    return e instanceof BodyTooLargeError ? fail(413, 'too_large') : fail(400, 'bad_request');
  }
  const turns = parseTurns(body.messages);
  if (!turns) return fail(400, 'bad_request');
  const context: SupportContext = body.context === 'panel' ? 'panel' : 'market';
  if (!cfg.available) return fail(503, 'not_ready');

  try {
    const adapter = deps.adapter ?? getDataAdapter();
    const limiter = deps.limiter ?? limiterFor(adapter);
    const ip = ipBucket(clientIp(req));
    for (const [name, rule] of [
      ['short', SUPPORT_LIMITS.perIpShort],
      ['day', SUPPORT_LIMITS.perIpDay],
    ] as const) {
      const hit = await limiter.hit(`support:${name}:${ip}`, rule);
      if (!hit.allowed) return fail(429, 'rate_limited', retryAfter(hit.retryAfterMs));
    }
    // One budget for the whole platform per UTC day (the free quota is shared by every visitor).
    const now = deps.now?.() ?? Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const budget = await limiter.hit(`support:budget:${day}`, { limit: cfg.dailyLimit, windowMs: 24 * 60 * 60_000 });
    if (!budget.allowed) return fail(429, 'daily_limit');

    let site: SiteFacts | null = null;
    const slug = typeof body.slug === 'string' ? body.slug.slice(0, 80) : '';
    if (context === 'panel' && slug) {
      const record = await authorizeEditor(adapter, slug, bearerKey(req)).catch(() => null);
      if (record) site = siteFacts(record, new Date(now));
    }

    const question = turns[turns.length - 1].text;
    if (cfg.mode === 'demo') return json(200, { ok: true, reply: demoReply(question) });

    const system = systemInstruction(context, { page: cleanPage(body.page), site });
    const result = await askGemini({ apiKey: cfg.apiKey!, model: cfg.model, system, turns }, deps.fetch);
    if (result.ok) return json(200, { ok: true, reply: result.text });
    // Never the key or the conversation in the log.
    console.error(`[support] gemini ${result.reason}${result.status ? ` ${result.status}` : ''} (model ${cfg.model})`);
    if (result.reason === 'busy') return fail(502, 'busy');
    if (result.reason === 'unavailable') return fail(503, 'not_ready');
    return fail(502, 'failed');
  } catch (e) {
    console.error(`[support] chat failed: ${e instanceof Error ? e.name : 'error'}`);
    return fail(502, 'failed');
  }
}
