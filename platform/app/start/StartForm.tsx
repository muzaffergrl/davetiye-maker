'use client';
import { setUiLocale, t } from '../../lib/i18n/client.ts';
import type { Lang } from '../../lib/i18n/langs.ts';
import type { Dict } from '../../lib/i18n/translate.ts';
// /start form and result (G045). Phone first (390 px), in the edit panel's BKE Studio look (G080: StartShell —
// panel tokens, fonts and logo; no decorative drawings, K21).
// Same field rules as the server (lib/claim/fields.ts). On success the edit link is shown once,
// big, with "Save this link", copy and "email it to myself" (mailto: opens the buyer's own mail app;
// the platform does not send email yet). The result is kept in sessionStorage so a reload of this
// tab (e.g. pull to refresh) does not lose the link.
//
// Lost answers: the form sends one random claim token with the claim and repeats the SAME token on
// every retry (kept in sessionStorage until a claim succeeds). If the site was created but the answer
// never arrived (phone switched networks), the retry gets a fresh edit link instead of "order used"
// (lib/claim/claim.ts). After a network error the form retries once by itself.

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  claimFieldErrors,
  normalizeSlugInput,
  sanitizeSlugTyping,
  slugProblem,
  suggestSlugBase,
  NAME_MAX,
  type ClaimField,
} from '../../lib/claim/fields.ts';
import { markOpenedExisting, rememberEditor, takeStartPrefill } from '../../lib/panel/remember.ts';
import { PalettePicker } from '../../components/palette/PalettePicker.tsx';
import { StartShell } from './shell.tsx';
import styles from './start.module.css';

export interface StartTheme {
  id: string;
  name: string;
  /** 1 or 2 name fields (from the theme's demo content). */
  partnerCount: number;
  /** /start/demo/<theme> */
  demoUrl: string;
  /** G153: the original palette's swatch, the design's live color palettes and the one chosen (null = original). */
  swatch?: string[] | null;
  variants?: Array<{ id: string; name: string; swatch: string[] }>;
  variant?: string | null;
}

interface ClaimResultView {
  theme: string;
  slug: string;
  editUrl: string;
  editPath: string;
  siteUrl: string;
  emailSent: boolean;
  /** The shop confirms the order before the site can be published (manual checks, G060-fix). */
  orderPending: boolean;
  email: string;
}

type SlugStatus =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'available' }
  | { kind: 'unavailable'; message: string; suggestion: string | null }
  | { kind: 'unknown' };

type FormMessage = { tone: 'error' | 'notice'; title?: string; text: string; link?: { href: string; label: string } } | null;

const STORE_KEY = 'start:claim-result:v1';
const TOKEN_KEY = 'start:claim-token:v1';
const TOKEN_RE = /^[A-Za-z0-9_-]{16,128}$/;
const NETWORK_RETRY_MS = 1500;

function newToken(): string {
  try {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  } catch {
    /* not a secure context: below */
  }
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** The claim token of this tab: reused on every retry until a claim succeeds. */
function claimTokenFor(current: string | null): string {
  if (current) return current;
  let token: string | null = null;
  try {
    token = window.sessionStorage.getItem(TOKEN_KEY);
  } catch {
    /* private mode: kept in memory only */
  }
  if (!token || !TOKEN_RE.test(token)) {
    token = newToken();
    try {
      window.sessionStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* memory only */
    }
  }
  return token;
}

function forgetClaimToken(): void {
  try {
    window.sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nothing stored */
  }
}
/** This phone's IANA time zone, or null (the server checks it; lib/claim/claim.ts claimTimeZone). */
function phoneTimeZone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
}

const FIELD_ORDER: ClaimField[] = ['orderNumber', 'email', 'name1', 'name2', 'slug'];
const FIELD_IDS: Record<ClaimField, string> = {
  orderNumber: 'start-order',
  email: 'start-email',
  name1: 'start-name1',
  name2: 'start-name2',
  slug: 'start-slug',
};

function loadStored(themeId: string): ClaimResultView | null {
  try {
    const raw = window.sessionStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as ClaimResultView;
    return v && v.theme === themeId && typeof v.editUrl === 'string' && typeof v.editPath === 'string' ? v : null;
  } catch {
    return null;
  }
}

function store(value: ClaimResultView | null): void {
  try {
    if (value) window.sessionStorage.setItem(STORE_KEY, JSON.stringify(value));
    else window.sessionStorage.removeItem(STORE_KEY);
  } catch {
    /* private mode: the link is still on screen */
  }
}

export default function StartForm({ theme, origin, emailEnabled, lang = 'en', dict }: { theme: StartTheme; origin: string; emailEnabled: boolean; lang?: Lang; dict?: Dict }) {
  // G144: the interface language (chosen on the server) before any text renders
  setUiLocale(lang, dict);
  const [result, setResult] = useState<ClaimResultView | null>(null);
  const [lastEmail, setLastEmail] = useState('');
  const [variant, setVariant] = useState<string | null>(theme.variant ?? null);

  useEffect(() => {
    const stored = loadStored(theme.id);
    if (stored) {
      setResult(stored);
      setLastEmail(stored.email);
    }
  }, [theme.id]);

  const onCreated = useCallback((r: ClaimResultView) => {
    store(r);
    setResult(r);
    setLastEmail(r.email);
    window.scrollTo({ top: 0 });
  }, []);

  const startOver = useCallback(() => {
    store(null);
    setResult(null);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <StartShell wide={!result}>
      {result ? (
        <ResultView result={result} themeName={theme.name} onStartOver={startOver} />
      ) : (
        <div className={styles.layout}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{t('Your wedding website')}</p>
            <h1 className={styles.title}>{t('Start your website')}</h1>
            <p className={styles.lead}>
              {t('Design:')} <strong>{theme.name}</strong>
            </p>
          </header>
          {theme.variants?.length ? (
            <section className={styles.palette} aria-labelledby="start-palette">
              <h2 id="start-palette" className={styles.paletteTitle}>
                {t('Color palette')}
              </h2>
              <PalettePicker
                label={t('Color palette')}
                options={[{ id: null, name: t('Original'), swatch: theme.swatch ?? [] }, ...theme.variants]}
                value={variant}
                onChange={setVariant}
              />
              <p className={styles.previewNote}>{t('You can change the colors later in your editor.')}</p>
            </section>
          ) : null}
          <DemoPreview theme={theme} variant={variant} />
          <ClaimForm theme={theme} variant={variant} origin={origin} emailEnabled={emailEnabled} initialEmail={lastEmail} onCreated={onCreated} />
        </div>
      )}
    </StartShell>
  );
}

// ---------------------------------------------------------------------------------------------

function DemoPreview({ theme, variant }: { theme: StartTheme; variant: string | null }) {
  const demoUrl = variant ? `${theme.demoUrl}?variant=${encodeURIComponent(variant)}` : theme.demoUrl;
  return (
    <section className={styles.preview} aria-label={t('{design} demo', { design: theme.name })}>
      <div className={styles.frameBox}>
        <iframe className={styles.frame} src={demoUrl} title={t('{design} demo website', { design: theme.name })} referrerPolicy="no-referrer" />
      </div>
      <p className={styles.previewNote}>{t('Sample names, dates and placeholder photos. You will add your own in the editor.')}</p>
      <a className={styles.textLink} href={demoUrl} target="_blank" rel="noopener">
        {t('Open the full demo')}
      </a>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------

function ClaimForm({
  theme,
  variant,
  origin,
  emailEnabled,
  initialEmail,
  onCreated,
}: {
  theme: StartTheme;
  variant: string | null;
  origin: string;
  emailEnabled: boolean;
  initialEmail: string;
  onCreated: (r: ClaimResultView) => void;
}) {
  const twoNames = theme.partnerCount >= 2;
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [names, setNames] = useState<string[]>(twoNames ? ['', ''] : ['']);
  const [slug, setSlug] = useState('');
  const [slugAuto, setSlugAuto] = useState(true);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>({ kind: 'idle' });
  const [adjusted, setAdjusted] = useState<{ from: string; to: string } | null>(null);
  const [touched, setTouched] = useState<Partial<Record<ClaimField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Partial<Record<ClaimField, string>>>({});
  const [message, setMessage] = useState<FormMessage>(null);
  const [busy, setBusy] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const checkSeq = useRef(0);
  const tokenRef = useRef<string | null>(null);

  // G146: the order number and email typed on /my (handed over in this tab's sessionStorage, never in the URL).
  useEffect(() => {
    const prefill = takeStartPrefill();
    if (!prefill) return;
    setOrderNumber(prefill.orderNumber);
    setEmail(prefill.email);
  }, []);

  const values = { orderNumber, email, names, slug };
  const clientErrors = claimFieldErrors(values, theme.partnerCount);
  // Field errors come in English from lib/claim/fields.ts and the server; shown in the interface language.
  const errorFor = (f: ClaimField): string | null => {
    const err = serverErrors[f] ?? (touched[f] || submitted ? (clientErrors[f] ?? null) : null);
    return err ? t(err) : null;
  };

  const clearServer = (f: ClaimField) =>
    setServerErrors((prev) => {
      if (!(f in prev)) return prev;
      const next = { ...prev };
      delete next[f];
      return next;
    });

  // The address follows the names until the buyer edits it.
  const namesKey = names.join('\u0000');
  useEffect(() => {
    if (!slugAuto) return;
    setSlug(names.some((n) => n.trim()) ? suggestSlugBase(names) : '');
  }, [namesKey, slugAuto]); // names is read through namesKey

  // Live availability hint (the server checks again on submit).
  useEffect(() => {
    const value = normalizeSlugInput(slug);
    const seq = ++checkSeq.current;
    if (!value || slugProblem(value)) {
      setSlugStatus({ kind: 'idle' });
      return;
    }
    setSlugStatus({ kind: 'checking' });
    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/start/slug?value=${encodeURIComponent(value)}`, {
          cache: 'no-store',
          credentials: 'same-origin',
          signal: ctrl.signal,
        });
        const body = (await res.json()) as { ok?: boolean; available?: boolean; message?: string; suggestion?: string | null };
        if (seq !== checkSeq.current) return;
        if (!res.ok || !body.ok) {
          setSlugStatus({ kind: 'unknown' });
        } else if (body.available) {
          setSlugStatus({ kind: 'available' });
        } else if (slugAuto && body.suggestion && body.suggestion !== value) {
          // Taken: an automatic address moves to the first free variant (checked again by the next run).
          setAdjusted({ from: value, to: body.suggestion });
          setSlug(body.suggestion);
        } else {
          setSlugStatus({ kind: 'unavailable', message: body.message ? t(body.message) : t('This address is not available.'), suggestion: body.suggestion ?? null });
        }
      } catch {
        if (seq === checkSeq.current && !ctrl.signal.aborted) setSlugStatus({ kind: 'unknown' });
      }
    }, 450);
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, [slug]); // slugAuto is read at check time on purpose

  const focusField = (f: ClaimField) => {
    const el = document.getElementById(FIELD_IDS[f]);
    if (el) {
      el.focus();
      el.scrollIntoView({ block: 'center' });
    }
  };

  const showMessage = (m: FormMessage) => {
    setMessage(m);
    if (m) window.setTimeout(() => messageRef.current?.focus(), 0);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setSubmitted(true);
    setMessage(null);
    const errors = claimFieldErrors(values, theme.partnerCount);
    const first = FIELD_ORDER.find((f) => errors[f]);
    if (first) {
      setServerErrors({});
      focusField(first);
      return;
    }
    setBusy(true);
    tokenRef.current = claimTokenFor(tokenRef.current);
    const payload = JSON.stringify({
      theme: theme.id,
      // G153: the chosen color palette (the server keeps it only when it is one of the design's live palettes)
      variant,
      orderNumber,
      email,
      names,
      slug: normalizeSlugInput(slug),
      claimToken: tokenRef.current,
      // G135: the draft starts in this phone's time zone (the server keeps the design's when it does not know it).
      timeZone: phoneTimeZone(),
      website: honeypot.current?.value ?? '',
    });
    const send = () =>
      fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: payload,
      });
    try {
      let res: Response;
      try {
        res = await send();
      } catch {
        // The site may have been created and only the answer lost: the same token gets the link again.
        await new Promise((r) => window.setTimeout(r, NETWORK_RETRY_MS));
        res = await send();
      }
      let body: Record<string, any> = {};
      try {
        body = (await res.json()) as Record<string, any>;
      } catch {
        /* handled below */
      }
      // G146: this order already has a website, started with this email: it is opened on this device (a device key).
      if (res.status === 200 && body.ok && body.existing && typeof body.editPath === 'string' && typeof body.slug === 'string') {
        forgetClaimToken();
        tokenRef.current = null;
        rememberEditor({ slug: body.slug, path: body.editPath, names: typeof body.names === 'string' ? body.names : '', at: new Date().toISOString() });
        markOpenedExisting(body.slug);
        showMessage({ tone: 'notice', title: t('This order already has a website'), text: t('This order already has a website — we opened it for you.') });
        window.location.assign(body.editPath);
        return;
      }
      if (res.status === 201 && body.ok) {
        forgetClaimToken();
        tokenRef.current = null;
        onCreated({
          theme: theme.id,
          slug: String(body.slug),
          editUrl: String(body.editUrl),
          editPath: String(body.editPath),
          siteUrl: String(body.siteUrl),
          emailSent: body.emailSent === true,
          orderPending: body.orderPending === true,
          email: email.trim(),
        });
        return;
      }
      const fields = (body.fields ?? {}) as Partial<Record<ClaimField, string>>;
      switch (body.code) {
        case 'invalid': {
          setServerErrors(fields);
          const f = FIELD_ORDER.find((k) => fields[k]);
          if (f) focusField(f);
          else showMessage({ tone: 'error', text: body.message ? t(body.message) : t('Please check the form and try again.') });
          break;
        }
        case 'order_used':
          setServerErrors({ orderNumber: t('This order number already has a website.') });
          // G146: the same order number with the email it was started with opens it on any device (/my).
          showMessage({
            tone: 'notice',
            title: t('This order already has a website'),
            text: t(String(body.message)),
            link: { href: '/my#continue', label: t('Continue with your order number') },
          });
          break;
        case 'slug_taken':
          setSlugAuto(false);
          setServerErrors({ slug: fields.slug ?? t('This address is already taken.') });
          setSlugStatus({ kind: 'unavailable', message: fields.slug ? t(fields.slug) : t('This address is already taken.'), suggestion: body.suggestion ?? null });
          focusField('slug');
          break;
        default:
          showMessage({ tone: 'error', text: body.message ? t(body.message) : t('Something went wrong. Please try again in a moment.') });
      }
    } catch {
      showMessage({ tone: 'error', text: t('No connection. Please check your internet connection and try again.') });
    } finally {
      setBusy(false);
    }
  }

  const fieldProps = (f: ClaimField, hintId?: string) => {
    const err = errorFor(f);
    return {
      id: FIELD_IDS[f],
      'aria-invalid': err ? true : undefined,
      'aria-describedby': [hintId, err ? `${FIELD_IDS[f]}-error` : null].filter(Boolean).join(' ') || undefined,
      onBlur: () => setTouched((prev) => ({ ...prev, [f]: true })),
    };
  };

  const errorText = (f: ClaimField) => {
    const err = errorFor(f);
    return err ? (
      <p className={styles.error} id={`${FIELD_IDS[f]}-error`}>
        {err}
      </p>
    ) : null;
  };

  const host = origin.replace(/^https?:\/\//, '');
  const shownSlug = normalizeSlugInput(slug);

  return (
    <form className={styles.card} onSubmit={onSubmit} noValidate aria-busy={busy || undefined}>
      <h2 className={styles.cardTitle}>{t('Your details')}</h2>

      {message ? (
        <div
          ref={messageRef}
          tabIndex={-1}
          role={message.tone === 'error' ? 'alert' : 'status'}
          className={message.tone === 'error' ? styles.alert : styles.notice}
        >
          {message.title ? <p className={styles.alertTitle}>{message.title}</p> : null}
          <p>{message.text}</p>
          {message.link ? (
            <p>
              <a className={styles.textLink} href={message.link.href} data-start-my-link="">
                {message.link.label}
              </a>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={styles.field}>
        <label className={styles.label} htmlFor={FIELD_IDS.orderNumber}>
          {t('Etsy order number')}
        </label>
        <input
          className={styles.input}
          {...fieldProps('orderNumber', 'start-order-hint')}
          inputMode="numeric"
          autoComplete="off"
          maxLength={40}
          value={orderNumber}
          onChange={(e) => {
            setOrderNumber(e.target.value);
            clearServer('orderNumber');
            if (message?.tone === 'notice') setMessage(null);
          }}
        />
        <p className={styles.hint} id="start-order-hint">
          {t('Find it in your Etsy order confirmation email, or on Etsy under Purchases and reviews. One website per order.')}
        </p>
        {errorText('orderNumber')}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={FIELD_IDS.email}>
          {t('Email address')}
        </label>
        <input
          className={styles.input}
          {...fieldProps('email', 'start-email-hint')}
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearServer('email');
          }}
        />
        <p className={styles.hint} id="start-email-hint">
          {emailEnabled
            ? t('We will email your edit link to this address and keep it with your website.')
            : t('We keep it with your website. We do not send emails yet, so you will save your edit link on the next screen.')}
        </p>
        {errorText('email')}
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>{twoNames ? t('Your first names') : t('First name')}</legend>
        <div className={twoNames ? styles.nameRow : undefined}>
          {names.map((value, i) => {
            const f: ClaimField = i === 0 ? 'name1' : 'name2';
            return (
              <div key={f} className={styles.nameCell}>
                <label className={styles.subLabel} htmlFor={FIELD_IDS[f]}>
                  {twoNames ? (i === 0 ? t('Your first name') : t("Your partner's first name")) : t('First name')}
                </label>
                <input
                  className={styles.input}
                  {...fieldProps(f, 'start-names-hint')}
                  autoComplete={i === 0 ? 'given-name' : 'off'}
                  autoCapitalize="words"
                  maxLength={NAME_MAX /* same hard stop as the panel's name fields (G055 limit) */}
                  value={value}
                  onChange={(e) => {
                    const next = [...names];
                    next[i] = e.target.value;
                    setNames(next);
                    clearServer(f);
                  }}
                />
                {errorText(f)}
              </div>
            );
          })}
        </div>
        <p className={styles.hint} id="start-names-hint">
          {t('Shown on your draft and used for your website address. You can change names later in the editor.')}
        </p>
      </fieldset>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={FIELD_IDS.slug}>
          {t('Website address')}
        </label>
        <input
          className={styles.input}
          {...fieldProps('slug', 'start-slug-status')}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={60}
          value={slug}
          onChange={(e) => {
            setSlugAuto(false);
            setSlug(sanitizeSlugTyping(e.target.value));
            clearServer('slug');
          }}
        />
        <div className={styles.slugStatus} id="start-slug-status" aria-live="polite">
          <p className={styles.address}>
            {host}/<strong>{shownSlug || '…'}</strong>
          </p>
          <SlugHint
            status={slugStatus}
            adjustedFrom={slugAuto && adjusted && adjusted.to === shownSlug ? adjusted.from : null}
            hasError={Boolean(errorFor('slug'))}
            onUse={(s) => {
              setSlugAuto(false);
              setSlug(s);
              clearServer('slug');
            }}
          />
          <p className={styles.hint}>{t('The address cannot be changed later.')}</p>
        </div>
        {errorText('slug')}
      </div>

      {/* Honeypot: hidden from people and screen readers; bots that fill every field are refused. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <button className={styles.primary} type="submit" disabled={busy}>
        {busy ? t('Creating your website…') : t('Create my website')}
      </button>
      <p className={styles.small}>{t('Your website starts as a private draft. Nobody can see it until you press Publish in the editor.')}</p>
      <p className={styles.small}>{t('Need help? Message us on Etsy with your order number.')}</p>
    </form>
  );
}

function SlugHint({
  status,
  adjustedFrom,
  hasError,
  onUse,
}: {
  status: SlugStatus;
  adjustedFrom: string | null;
  hasError: boolean;
  onUse: (slug: string) => void;
}) {
  switch (status.kind) {
    case 'checking':
      return <p className={styles.hint}>{t('Checking…')}</p>;
    case 'available':
      return (
        <p className={styles.ok} data-slug-available="">
          {adjustedFrom ? t('Available. "{address}" is taken, so we added a number.', { address: adjustedFrom }) : t('Available')}
        </p>
      );
    case 'unavailable':
      return (
        <div>
          {hasError ? null : <p className={styles.error}>{status.message}</p>}
          {status.suggestion ? (
            <button type="button" className={styles.suggestion} onClick={() => onUse(status.suggestion!)}>
              {t('Use {address}', { address: status.suggestion })}
            </button>
          ) : null}
        </div>
      );
    case 'unknown':
      return <p className={styles.hint}>{t('We will check this address when you create your website.')}</p>;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------------------------

function ResultView({ result, themeName, onStartOver }: { result: ClaimResultView; themeName: string; onStartOver: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const linkBox = useRef<HTMLTextAreaElement>(null);
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    heading.current?.focus();
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(result.editUrl);
      setCopy('copied');
      return;
    } catch {
      /* older browsers: select and copy */
    }
    const box = linkBox.current;
    if (box) {
      box.focus();
      box.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      setCopy(ok ? 'copied' : 'failed');
    } else {
      setCopy('failed');
    }
  }

  const mailto =
    `mailto:${encodeURIComponent(result.email).replace(/%40/g, '@')}` +
    `?subject=${encodeURIComponent(t('My wedding website edit link'))}` +
    `&body=${encodeURIComponent(
      `${t('Edit link (keep it private, anyone with it can edit the website):')}\n${result.editUrl}\n\n` +
        `${t('Website address (visible after publishing):')}\n${result.siteUrl}\n`,
    )}`;

  // One sentence for translators; the address sits where {address} is.
  const [addressBefore, addressAfter = ''] = t('Your website address will be {address}. It stays a private draft until you press Publish in the editor.').split('{address}');

  return (
    <div className={styles.resultWrap}>
      <section className={styles.result} aria-labelledby="start-result-title">
        <p className={styles.eyebrow}>{t('Your wedding website')}</p>
        <h1 id="start-result-title" ref={heading} tabIndex={-1} className={styles.title}>
          {t('Your website is ready to edit')}
        </h1>
        <p className={styles.lead}>
          {t('Design:')} <strong>{themeName}</strong>
        </p>

        <div className={styles.saveBox}>
          <h2 className={styles.saveTitle}>{t('Save this link')}</h2>
          <p>{t('It is the only way to open your editor. Anyone who has this link can edit your website, so keep it private.')}</p>
          {result.emailSent ? (
            <p>{t('We have also emailed it to {email}.', { email: result.email })}</p>
          ) : (
            <p>
              <strong>{t('We cannot email it to you yet.')}</strong>{' '}
              {t('Copy it somewhere safe now, for example your notes app or an email to yourself.')}
            </p>
          )}
          <label className={styles.visuallyHidden} htmlFor="start-edit-link">
            {t('Your edit link')}
          </label>
          <textarea
            id="start-edit-link"
            ref={linkBox}
            className={styles.linkBox}
            readOnly
            rows={4}
            value={result.editUrl}
            onFocus={(e) => e.currentTarget.select()}
            data-edit-link=""
          />
          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={copyLink} data-copy-link="">
              {copy === 'copied' ? t('Copied') : t('Copy link')}
            </button>
            {result.email ? (
              <a className={styles.secondary} href={mailto}>
                {t('Email it to myself')}
              </a>
            ) : null}
          </div>
          <p className={styles.small} data-copy-later="">{t('You can copy this link again later in your editor: Share → Your private edit link.')}</p>
          <p className={styles.copyStatus} aria-live="polite">
            {copy === 'copied' ? t('The link is copied. Paste it somewhere safe.') : copy === 'failed' ? t('Copying did not work. Select the link above and copy it.') : ''}
          </p>
        </div>

        {/* G060: the editor's first-run setup starts at step 1 (names already filled in from this form). */}
        <a className={styles.primary} href={`${result.editPath}#setup/1`} data-open-editor="">
          {t('Open my editor')}
        </a>
        <p className={styles.small}>
          {addressBefore}
          <strong className={styles.breakAll}>{result.siteUrl}</strong>
          {addressAfter}
        </p>
        {/* G121 (docs/19 §6 B2): the editor is a web page; a Home Screen icon brings the buyer back to it. */}
        <p className={styles.small} data-home-screen-tip="">
          {t('Tip: once your editor is open, add it to your Home Screen.')}
        </p>
        {result.orderPending ? (
          <p className={styles.small} data-order-pending="">
            {t('We are confirming your Etsy order. You can set up everything now; Publish opens as soon as the order is confirmed.')}
          </p>
        ) : null}
        <button type="button" className={styles.linkButton} onClick={onStartOver}>
          {t('Start with a different order')}
        </button>
        <p className={styles.small}>{t('One order starts one website. Questions? Message us on Etsy with your order number.')}</p>
      </section>
    </div>
  );
}
