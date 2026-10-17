// G144: automatic translation of the couple's own text WITHOUT a paid or keyed API (K45 item 3, the owner: "api olmadan
// çeviri yapamaz mıyız"). Browser only. Two ways, tried in this order:
//
// 1. The browser's on-device Translator API (Chrome 138+ on computers: `Translator`, with `LanguageDetector`): no key,
//    no server, the text never leaves the device. The model may download on first use (a few hundred MB, once).
// 2. MyMemory's keyless endpoint (https://api.mymemory.translated.net/get?q=…&langpair=en|tr): free, no key, no
//    account. Limits (their documentation, 2026): 500 bytes per request (we cut longer texts at sentences) and about
//    5,000 characters a day per IP address without an email; quality = machine translation mixed with its translation
//    memory — fine for a first draft, must be read. The text is sent to translated.net (the panel says so before use).
//
// Neither is available → the panel falls back to "write it yourself" (every field stays editable). Results are drafts:
// the couple approves each field (or all) before guests see it (lib/i18n/content.ts).

import type { Lang } from './langs.ts';

export type TranslateEngine = 'browser' | 'service';

export interface Translated {
  text: string;
  engine: TranslateEngine;
}

export class TranslateUnavailable extends Error {
  reason: 'none' | 'quota' | 'network';
  constructor(reason: 'none' | 'quota' | 'network') {
    super(reason);
    this.reason = reason;
  }
}

interface BrowserTranslator {
  translate(text: string): Promise<string>;
  destroy?: () => void;
}
interface TranslatorStatic {
  availability(o: { sourceLanguage: string; targetLanguage: string }): Promise<string>;
  create(o: { sourceLanguage: string; targetLanguage: string }): Promise<BrowserTranslator>;
}

function translatorApi(): TranslatorStatic | null {
  const g = globalThis as unknown as { Translator?: TranslatorStatic };
  return g.Translator && typeof g.Translator.create === 'function' ? g.Translator : null;
}

/** Can the browser translate source → target on the device? (false when the API is missing or the pair unsupported). */
export async function browserCanTranslate(source: Lang, target: Lang): Promise<boolean> {
  const api = translatorApi();
  if (!api) return false;
  try {
    return (await api.availability({ sourceLanguage: source, targetLanguage: target })) !== 'unavailable';
  } catch {
    return false;
  }
}

/** Splits a text into pieces of at most `max` UTF-8 bytes, at sentence ends, then at spaces. */
export function chunks(text: string, max = 450): string[] {
  const bytes = (s: string) => new TextEncoder().encode(s).length;
  if (bytes(text) <= max) return [text];
  const out: string[] = [];
  let cur = '';
  const push = (piece: string) => {
    if (bytes(cur + piece) <= max) {
      cur += piece;
      return;
    }
    if (cur) out.push(cur);
    cur = '';
    if (bytes(piece) <= max) {
      cur = piece;
      return;
    }
    for (const word of piece.split(/(?<=\s)/)) {
      if (bytes(cur + word) > max && cur) {
        out.push(cur);
        cur = '';
      }
      cur += word;
    }
  };
  for (const s of text.split(/(?<=[.!?…。]\s+|\n)/)) push(s);
  if (cur) out.push(cur);
  return out;
}

export const SERVICE_URL = 'https://api.mymemory.translated.net/get';

async function serviceTranslate(text: string, source: Lang, target: Lang, fetcher: typeof fetch): Promise<string> {
  const parts: string[] = [];
  for (const piece of chunks(text)) {
    const lead = /^\s*/.exec(piece)![0];
    const trail = /\s*$/.exec(piece)![0];
    const core = piece.trim();
    if (!core) {
      parts.push(piece);
      continue;
    }
    let res: Response;
    try {
      res = await fetcher(`${SERVICE_URL}?q=${encodeURIComponent(core)}&langpair=${source}|${target}`, { credentials: 'omit', referrerPolicy: 'no-referrer' });
    } catch {
      throw new TranslateUnavailable('network');
    }
    const body = (await res.json().catch(() => null)) as { responseStatus?: number | string; responseData?: { translatedText?: string } } | null;
    const status = Number(body?.responseStatus ?? res.status);
    const out = body?.responseData?.translatedText ?? '';
    if (status === 429 || /MYMEMORY WARNING|YOU USED ALL AVAILABLE FREE TRANSLATIONS/i.test(out)) throw new TranslateUnavailable('quota');
    if (status !== 200 || !out) throw new TranslateUnavailable('network');
    parts.push(lead + decodeEntities(out) + trail);
  }
  return parts.join('');
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_m, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

export interface AutoTranslator {
  engine: TranslateEngine;
  translate(text: string): Promise<string>;
  close(): void;
}

/**
 * A translator for source → target: the device's own when it can (call this from a tap — the browser may need a user
 * gesture to download its model), else the free service (unless `allowService` is false). Throws TranslateUnavailable.
 */
export async function openTranslator(source: Lang, target: Lang, opts: { allowService: boolean; fetcher?: typeof fetch }): Promise<AutoTranslator> {
  const api = translatorApi();
  if (api && (await browserCanTranslate(source, target))) {
    try {
      const tr = await api.create({ sourceLanguage: source, targetLanguage: target });
      return { engine: 'browser', translate: (text) => tr.translate(text), close: () => tr.destroy?.() };
    } catch {
      /* the device could not prepare it: try the service */
    }
  }
  if (!opts.allowService) throw new TranslateUnavailable('none');
  const fetcher = opts.fetcher ?? fetch.bind(globalThis);
  return { engine: 'service', translate: (text) => serviceTranslate(text, source, target, fetcher), close: () => {} };
}
