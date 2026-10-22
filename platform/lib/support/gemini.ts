// Gemini API call for the support assistant (REST generateContent; no SDK, so nothing new to install).
// https://ai.google.dev/api/generate-content — the key goes in the x-goog-api-key header, never in the URL (URLs end up
// in logs).

import { SUPPORT_LIMITS } from './config.ts';

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

export type GeminiResult =
  | { ok: true; text: string }
  /** busy = Google's quota (429) or overload (503); unavailable = key/model problem; blocked = safety; failed = anything else. */
  | { ok: false; reason: 'busy' | 'unavailable' | 'blocked' | 'failed'; status?: number };

export type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export function geminiBody(system: string, turns: ChatTurn[], model: string): Record<string, unknown> {
  const generationConfig: Record<string, unknown> = { temperature: 0.3, maxOutputTokens: SUPPORT_LIMITS.maxOutputTokens };
  // 2.5 Flash "thinks" by default; a support answer does not need it (faster, fewer tokens of the free quota).
  if (/^gemini-2\.5-flash/.test(model)) generationConfig.thinkingConfig = { thinkingBudget: 0 };
  return {
    systemInstruction: { parts: [{ text: system }] },
    contents: turns.map((t) => ({ role: t.role === 'assistant' ? 'model' : 'user', parts: [{ text: t.text }] })),
    generationConfig,
  };
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> }; finishReason?: string }>;
  promptFeedback?: { blockReason?: string };
}

export async function askGemini(
  opts: { apiKey: string; model: string; system: string; turns: ChatTurn[] },
  fetchImpl: FetchLike = fetch,
): Promise<GeminiResult> {
  let res: Response;
  try {
    res = await fetchImpl(`${ENDPOINT}/${encodeURIComponent(opts.model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': opts.apiKey },
      body: JSON.stringify(geminiBody(opts.system, opts.turns, opts.model)),
      signal: AbortSignal.timeout(SUPPORT_LIMITS.timeoutMs),
    });
  } catch {
    return { ok: false, reason: 'failed' };
  }
  if (res.status === 429 || res.status === 503) return { ok: false, reason: 'busy', status: res.status };
  if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404) return { ok: false, reason: 'unavailable', status: res.status };
  if (!res.ok) return { ok: false, reason: 'failed', status: res.status };
  let data: GeminiResponse;
  try {
    data = (await res.json()) as GeminiResponse;
  } catch {
    return { ok: false, reason: 'failed', status: res.status };
  }
  if (data.promptFeedback?.blockReason) return { ok: false, reason: 'blocked' };
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
    .trim();
  if (!text) return { ok: false, reason: cand?.finishReason === 'SAFETY' || cand?.finishReason === 'PROHIBITED_CONTENT' ? 'blocked' : 'failed' };
  return { ok: true, text: text.slice(0, SUPPORT_LIMITS.assistantChars) };
}
