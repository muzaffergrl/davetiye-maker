// Live support assistant (AI chat on the sales site and in the couple's panel): settings from the environment.
//
//   GEMINI_API_KEY        Google AI Studio key (free tier is enough to start). Missing = the assistant is "not ready":
//                         the chat window still opens and offers the shop's human contacts (Etsy message, email, FAQ).
//                         Never written to the repo or a log.
//   GEMINI_MODEL          default gemini-2.5-flash (a free-tier Flash model; Pro models are paid only).
//   SUPPORT_CHAT          "off" hides nothing but answers every message as "not ready" (kill switch without a deploy of code);
//                         "demo" answers with canned text, no Google call (local screenshots and browser tests only).
//   SUPPORT_DAILY_LIMIT   AI answers per day for the whole platform (default 200), so the free quota is not burnt by one
//                         visitor; after it the chat falls back to the human contacts until the next UTC day.

import { MAX_CHARS, MAX_TURNS } from '../../components/support/limits.ts';

export type SupportMode = 'live' | 'demo' | 'off';

export interface SupportConfig {
  mode: SupportMode;
  /** True when the assistant can answer (live with a key, or demo). */
  available: boolean;
  apiKey: string | null;
  model: string;
  dailyLimit: number;
}

export const DEFAULT_MODEL = 'gemini-2.5-flash';
export const DEFAULT_DAILY_LIMIT = 200;

/** Per-visitor limits (IP bucket) and the shape of one request. */
export const SUPPORT_LIMITS = {
  perIpShort: { limit: 12, windowMs: 5 * 60_000 },
  perIpDay: { limit: 60, windowMs: 24 * 60 * 60_000 },
  /** Turns the client sends (older ones are dropped by the client first). */
  maxTurns: MAX_TURNS,
  userChars: MAX_CHARS,
  assistantChars: 2400,
  maxBodyBytes: 32 * 1024,
  /** Gemini call timeout. */
  timeoutMs: 25_000,
  maxOutputTokens: 700,
} as const;

const MODEL_RE = /^[a-z0-9][a-z0-9.-]{2,63}$/;

export function supportConfig(env: Record<string, string | undefined> = process.env): SupportConfig {
  const flag = (env.SUPPORT_CHAT ?? '').trim().toLowerCase();
  const apiKey = (env.GEMINI_API_KEY ?? '').trim() || null;
  const modelEnv = (env.GEMINI_MODEL ?? '').trim();
  const model = MODEL_RE.test(modelEnv) ? modelEnv : DEFAULT_MODEL;
  const daily = Number.parseInt(env.SUPPORT_DAILY_LIMIT ?? '', 10);
  const dailyLimit = Number.isFinite(daily) && daily > 0 ? daily : DEFAULT_DAILY_LIMIT;
  const mode: SupportMode = flag === 'off' ? 'off' : flag === 'demo' ? 'demo' : 'live';
  const available = mode === 'demo' || (mode === 'live' && apiKey !== null);
  return { mode, available, apiKey, model, dailyLimit };
}
