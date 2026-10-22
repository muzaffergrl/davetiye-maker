'use client';
// The support chat itself (messages, suggestions, input, "not ready" and error states). Used by the sales site's
// floating window (SupportLauncher.tsx) and the panel's sheet (components/panel/SupportSheet.tsx). Talks to
// /api/support/chat (lib/support/chat.ts). The conversation lives in sessionStorage for this tab only; nothing is kept on
// the server.

import { ExternalLink, Mail, RotateCcw, SendHorizontal } from 'lucide-react';
import { Fragment, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { ChatCopy, ChatLinks } from './copy.ts';
import { MAX_CHARS, MAX_TURNS } from './limits.ts';
import s from './support.module.css';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

type Status = 'checking' | 'ready' | 'not_ready';
type ErrorCode = 'rate_limited' | 'daily_limit' | 'busy' | 'failed' | 'offline' | 'not_ready';


function storageGet(key: string): ChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(key);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((m): m is ChatMessage => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.text === 'string').slice(-40) : [];
  } catch {
    return [];
  }
}

function storageSet(key: string, list: ChatMessage[]) {
  try {
    if (list.length) window.sessionStorage.setItem(key, JSON.stringify(list.slice(-40)));
    else window.sessionStorage.removeItem(key);
  } catch {
    /* private mode: the chat still works, it just is not kept */
  }
}

// ---------------------------------------------------------------------------------------------
// The assistant's text: paragraphs, "- " lists, **bold** and [links](…) — only site paths and https addresses, built as
// React elements (never HTML).

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]{1,200})\]\(([^)\s]{1,500})\)/g;

function safeHref(href: string): string | null {
  if (/^\/(?!\/)[\w\-./~#?=&%]*$/.test(href)) return href;
  if (/^https:\/\/[^\s"'<>]+$/i.test(href)) return href;
  return null;
}

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={`${key}b${i++}`}>{m[1]}</strong>);
    else {
      const href = safeHref(m[3]);
      if (href) {
        const external = href.startsWith('https://');
        out.push(
          <a key={`${key}a${i++}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {m[2]}
          </a>,
        );
      } else out.push(m[2]);
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim());
        if (lines.length && lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l))) {
          const ordered = /^\s*\d/.test(lines[0]);
          const items = lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ''), `${bi}-${li}`)}</li>);
          return ordered ? <ol key={bi}>{items}</ol> : <ul key={bi}>{items}</ul>;
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li ? <br /> : null}
                {inline(l, `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------------------------

export function HumanContacts({ copy, links }: { copy: ChatCopy; links: ChatLinks }) {
  return (
    <ul className={s.contacts}>
      <li>
        <a href={links.faq}>{copy.faq}</a>
      </li>
      <li>
        <a href={links.etsy} target="_blank" rel="noopener noreferrer">
          {copy.etsy}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </li>
      {links.email && copy.email ? (
        <li>
          <a href={`mailto:${links.email}`}>
            <Mail size={14} aria-hidden="true" />
            {copy.email}
          </a>
        </li>
      ) : null}
    </ul>
  );
}

export function SupportChat({
  copy,
  links,
  context,
  slug,
  editKey,
  storageKey,
  onNewChat,
}: {
  copy: ChatCopy;
  links: ChatLinks;
  context: 'market' | 'panel';
  /** Panel: the site and its edit key (sent as a Bearer header, so the assistant knows a few facts about the site). */
  slug?: string;
  editKey?: string;
  storageKey: string;
  /** Called with the reset function, so the frame can put a "New chat" button in its header. */
  onNewChat?: (reset: (() => void) | null) => void;
}) {
  const [status, setStatus] = useState<Status>('checking');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(storageGet(storageKey));
    let live = true;
    fetch('/api/support/chat', { headers: { Accept: 'application/json' } })
      .then((r) => r.json() as Promise<{ available?: boolean }>)
      .then((d) => live && setStatus(d.available ? 'ready' : 'not_ready'))
      .catch(() => live && setStatus('ready')); // offline now: let them type; sending shows the offline message
    return () => {
      live = false;
    };
  }, [storageKey]);

  useEffect(() => {
    storageSet(storageKey, messages);
  }, [messages, storageKey]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, error, status]);

  useEffect(() => {
    if (status === 'ready') inputRef.current?.focus();
  }, [status]);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setDraft('');
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    onNewChat?.(messages.length ? reset : null);
  }, [messages.length, onNewChat, reset]);

  const ask = useCallback(
    async (list: ChatMessage[]) => {
      setSending(true);
      setError(null);
      try {
        if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new TypeError('offline');
        const res = await fetch('/api/support/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(editKey ? { Authorization: `Bearer ${editKey}` } : {}) },
          body: JSON.stringify({ messages: list.slice(-MAX_TURNS), context, page: window.location.pathname, ...(slug ? { slug } : {}) }),
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reply?: string; code?: string };
        if (res.ok && data.ok && typeof data.reply === 'string') {
          setMessages((m) => [...m, { role: 'assistant', text: data.reply! }]);
        } else if (data.code === 'not_ready') {
          setStatus('not_ready');
          setError('not_ready');
        } else {
          const code = data.code;
          setError(code === 'rate_limited' || code === 'daily_limit' || code === 'busy' ? code : 'failed');
        }
      } catch {
        setError(typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'failed');
      } finally {
        setSending(false);
      }
    },
    [context, editKey, slug],
  );

  const send = useCallback(
    (text: string) => {
      const q = text.trim();
      if (!q || sending || q.length > MAX_CHARS) return;
      const next = [...messages, { role: 'user' as const, text: q }];
      setMessages(next);
      setDraft('');
      void ask(next);
    },
    [ask, messages, sending],
  );

  const retry = () => {
    if (messages.length && messages[messages.length - 1].role === 'user') void ask(messages);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(draft);
    }
  };

  const tooLong = draft.trim().length > MAX_CHARS;
  const errorText = error && error !== 'not_ready' ? copy[error === 'rate_limited' ? 'rateLimited' : error === 'daily_limit' ? 'dailyLimit' : error] : null;
  const canRetry = error === 'busy' || error === 'failed' || error === 'offline';

  return (
    <div className={s.chat} data-support-chat={status}>
      <div className={s.log} ref={logRef} role="log" aria-live="polite" aria-relevant="additions" aria-busy={sending || undefined}>
        <div className={`${s.msg} ${s.bot}`}>
          <span className={s.sr}>{copy.assistant}: </span>
          <p>{copy.greeting}</p>
        </div>

        {status === 'not_ready' ? (
          <div className={s.notReady} data-support-not-ready="">
            <p className={s.notReadyTitle}>{copy.notReadyTitle}</p>
            <p>{copy.notReadyText}</p>
            <HumanContacts copy={copy} links={links} />
          </div>
        ) : null}

        {messages.map((m, i) => (
          <div key={i} className={`${s.msg} ${m.role === 'user' ? s.me : s.bot}`} data-role={m.role}>
            <span className={s.sr}>{m.role === 'user' ? copy.you : copy.assistant}: </span>
            {m.role === 'user' ? <p>{m.text}</p> : <RichText text={m.text} />}
          </div>
        ))}

        {sending ? (
          <div className={`${s.msg} ${s.bot} ${s.typing}`} data-support-typing="">
            <span className={s.dots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={s.sr}>{copy.typing}</span>
          </div>
        ) : null}

        {errorText ? (
          <div className={s.error} role="alert" data-support-error={error}>
            <p>{errorText}</p>
            {canRetry ? (
              <button type="button" className={s.textBtn} onClick={retry}>
                <RotateCcw size={14} aria-hidden="true" />
                {copy.retry}
              </button>
            ) : (
              <HumanContacts copy={copy} links={links} />
            )}
          </div>
        ) : null}

        {status === 'ready' && !messages.length && !sending ? (
          <div className={s.suggestions}>
            {copy.suggestions.map((q) => (
              <button key={q} type="button" className={s.chip} onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {status !== 'not_ready' ? (
        <form
          className={s.composer}
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <label className={s.sr} htmlFor={`support-input-${context}`}>
            {copy.placeholder}
          </label>
          <textarea
            id={`support-input-${context}`}
            ref={inputRef}
            className={s.input}
            rows={1}
            value={draft}
            placeholder={copy.placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            maxLength={MAX_CHARS + 200}
            aria-invalid={tooLong || undefined}
            aria-describedby={`support-notice-${context}`}
            disabled={status === 'checking'}
          />
          <button type="submit" className={s.send} disabled={!draft.trim() || sending || tooLong || status === 'checking'} aria-label={copy.send} title={copy.send}>
            <SendHorizontal size={20} aria-hidden="true" />
          </button>
        </form>
      ) : null}
      <p className={s.notice} id={`support-notice-${context}`}>
        {tooLong ? <strong className={s.warn}>{copy.tooLong}</strong> : copy.notice}{' '}
        {status !== 'not_ready' ? (
          <a href={links.etsy} target="_blank" rel="noopener noreferrer" className={s.humanLink}>
            {copy.human}
          </a>
        ) : null}
      </p>
    </div>
  );
}
