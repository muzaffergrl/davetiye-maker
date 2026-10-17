'use client';
// "Create your invitation website" (/my; G095, G146 — K46). The sales site's button for buyers, mobile first.
//  1. On this device: editors opened in this browser (lib/panel/remember.ts) → one tap back into the panel; ones that no
//     longer open (website deleted, link replaced, device signed out) are dropped after a check (G135).
//  2. How it works: buy a design on Etsy → Etsy's instant PDF has our link → order number + email here.
//  3. ONE form: Etsy order number + email → POST /api/my/continue (lib/claim/continue.ts):
//       the order's website, started with this email → a device key, straight into the editor (any device, no password);
//       no website for the order yet → /start (?theme= from this page's link, else "Which design did you buy?"), the order
//       number and email handed over in sessionStorage (never in the URL);
//       anything else → one generic message.
//     "Email me a sign-in link" only while the platform can send email (getEditLinkMailer().enabled, from the server).
//  4. "Have your private edit link?" (folded): paste the saved link. 5. Last resort: message the shop on Etsy.
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BrandLogo } from '../panel/Brand.tsx';
import { emailError, orderNumberError } from '../../lib/claim/fields.ts';
import {
  dropGoneEditors,
  editPathFromLink,
  forgetEditor,
  readEditors,
  rememberEditor,
  saveStartPrefill,
  type RememberedEditor,
} from '../../lib/panel/remember.ts';
import { msg, setUiLocale, t, tn } from '../../lib/i18n/client.ts';
import type { Lang } from '../../lib/i18n/langs.ts';
import type { Dict } from '../../lib/i18n/translate.ts';
import s from './my.module.css';

/** The field messages of lib/claim/fields.ts, here so they are translated (the server sends the same English text). */
export const MY_FIELD_TEXTS = [
  msg('Please enter your Etsy order number.'),
  msg('Your Etsy order number has 8 to 12 digits, for example 1234567890.'),
  msg('Please enter your email address.'),
  msg('Please enter a valid email address, like name@example.com.'),
];

type Field = 'orderNumber' | 'email';
type Message = { tone: 'error' | 'notice'; text: string } | null;

export interface MyDesign {
  id: string;
  name: string;
}

export default function MyWebsite({
  shopName,
  lang = 'en',
  dict,
  etsyShopUrl = null,
  designsPath = '/designs',
  theme = null,
  designs = [],
  emailLinkEnabled = false,
}: {
  shopName: string;
  lang?: Lang;
  dict?: Dict;
  /** The Etsy shop, only when the marketing config has a real Etsy URL (else the sales site's designs page). */
  etsyShopUrl?: string | null;
  designsPath?: string;
  /** /my?theme=<id> (a real, startable design): a new website starts with it without asking. */
  theme?: MyDesign | null;
  /** Designs that can be started (the picker when a new website needs one). */
  designs?: MyDesign[];
  /** The platform can send email (G147 mailer): "Email me a sign-in link" is offered. */
  emailLinkEnabled?: boolean;
}) {
  // G144: the interface language (chosen on the server) before any text renders
  setUiLocale(lang, dict);
  // Read after mount (localStorage), so the server's and the browser's first render match.
  const [editors, setEditors] = useState<RememberedEditor[] | null>(null);
  const [gone, setGone] = useState<RememberedEditor[]>([]);
  useEffect(() => {
    setEditors(readEditors());
    let live = true;
    void dropGoneEditors().then((r) => {
      if (!live || !r.gone.length) return;
      setEditors(r.editors);
      setGone(r.gone);
    });
    return () => {
      live = false;
    };
  }, []);

  const shop = /^\[.*\]$/.test(shopName) ? t('the shop') : shopName;

  return (
    <div className={s.page}>
      <main className={s.inner}>
        <a href="/" className={s.brand} aria-label={t('Home')}>
          <BrandLogo height={28} />
        </a>
        <h1 className={s.h1}>{t('Create your invitation website')}</h1>
        <p className={s.lead}>{t('You make your wedding website yourself, on your phone or computer, from the design you bought on Etsy.')}</p>

        {editors && editors.length > 0 ? (
          <section className={s.card} aria-labelledby="my-saved" data-my-saved="">
            <h2 id="my-saved" className={s.h2}>
              {t('On this device')}
            </h2>
            {editors.map((e) => (
              <div key={e.slug} className={s.editor}>
                <div>
                  <p className={s.names}>{e.names || e.slug}</p>
                  <p className={s.small} style={{ marginTop: 0 }}>
                    /{e.slug}
                  </p>
                </div>
                <div className={s.editorActions}>
                  <a className={s.btnGhost} href={e.path} data-my-open={e.slug}>
                    {t('Open editor')} <ArrowRight size={18} aria-hidden />
                  </a>
                  <button
                    type="button"
                    className={s.btnText}
                    onClick={() => {
                      forgetEditor(e.slug);
                      setEditors(readEditors());
                    }}
                  >
                    {t('Remove from this device')}
                  </button>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {gone.length > 0 ? (
          <p className={s.p} role="status" data-my-gone={gone.map((e) => e.slug).join(' ')}>
            {tn(
              gone.length,
              '{addresses} no longer opens on this device, so we removed it. Enter your order number and email below to open it again.',
              '{addresses} no longer open on this device, so we removed them. Enter your order number and email below to open them again.',
              { addresses: gone.map((e) => `/${e.slug}`).join(', ') },
            )}
          </p>
        ) : null}

        <section className={s.card} aria-labelledby="my-steps" data-my-steps="">
          <h2 id="my-steps" className={s.h2}>
            {t('How it works')}
          </h2>
          <ol className={s.steps}>
            <li className={s.step}>
              <span className={s.stepNo} aria-hidden="true">
                1
              </span>
              <div>
                <p className={s.stepTitle}>{t('Buy a design on Etsy')}</p>
                <p className={s.stepText}>
                  {t('Choose the design you love and buy it in our Etsy shop.')}{' '}
                  {etsyShopUrl ? (
                    <a className={s.link} href={etsyShopUrl} rel="noopener" data-my-etsy="">
                      {t('Open our Etsy shop')}
                    </a>
                  ) : (
                    <a className={s.link} href={designsPath} data-my-designs="">
                      {t('See the designs')}
                    </a>
                  )}
                </p>
              </div>
            </li>
            <li className={s.step}>
              <span className={s.stepNo} aria-hidden="true">
                2
              </span>
              <div>
                <p className={s.stepTitle}>{t('Get your PDF from Etsy')}</p>
                <p className={s.stepText}>{t('Right after you buy, Etsy gives you an instant download: a short PDF with our link to this page.')}</p>
              </div>
            </li>
            <li className={s.step}>
              <span className={s.stepNo} aria-hidden="true">
                3
              </span>
              <div>
                <p className={s.stepTitle}>{t('Enter your order number and email here')}</p>
                <p className={s.stepText}>{t('Your editor opens, and you make the website your own.')}</p>
              </div>
            </li>
          </ol>
          <p className={s.small} data-my-where="">
            <strong>{t('Where is my order number?')}</strong>{' '}
            {t('On Etsy, go to You → Purchases and reviews. It is also in the confirmation email from Etsy, as “Order #…”.')}
          </p>
          <p className={s.note}>{t('No account or password. Use the same order number and email on any phone or computer to continue where you left off.')}</p>
        </section>

        <ContinueForm theme={theme} designs={designs} emailLinkEnabled={emailLinkEnabled} />

        <PasteLink />

        <p className={s.small} data-my-last-resort="">
          {t('Still stuck? Message {shop} on Etsy with your order number.', { shop })}
        </p>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

function ContinueForm({ theme, designs, emailLinkEnabled }: { theme: MyDesign | null; designs: MyDesign[]; emailLinkEnabled: boolean }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [message, setMessage] = useState<Message>(null);
  const [busy, setBusy] = useState<'continue' | 'signin' | null>(null);
  const [pick, setPick] = useState(false);
  const [design, setDesign] = useState(designs[0]?.id ?? '');
  const honeypot = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const pickRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (pick) pickRef.current?.focus();
  }, [pick]);

  const show = (m: Message) => {
    setMessage(m);
    if (m) window.setTimeout(() => messageRef.current?.focus(), 0);
  };

  /** Field checks of lib/claim/fields.ts (the server repeats them). */
  function check(): boolean {
    const next: Partial<Record<Field, string>> = {};
    const o = orderNumberError(orderNumber);
    const e = emailError(email);
    if (o) next.orderNumber = t(o);
    if (e) next.email = t(e);
    setErrors(next);
    const first = (['orderNumber', 'email'] as Field[]).find((f) => next[f]);
    if (first) document.getElementById(first === 'orderNumber' ? 'my-order' : 'my-email')?.focus();
    return !first;
  }

  async function post(url: string): Promise<{ status: number; body: Record<string, any> } | null> {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({ orderNumber, email, website: honeypot.current?.value ?? '' }),
      });
      let body: Record<string, any> = {};
      try {
        body = (await res.json()) as Record<string, any>;
      } catch {
        /* below */
      }
      return { status: res.status, body };
    } catch {
      show({ tone: 'error', text: t('No connection. Please check your internet connection and try again.') });
      return null;
    }
  }

  function failed(body: Record<string, any>) {
    if (body.code === 'invalid' && body.fields) {
      const f = body.fields as Partial<Record<Field, string>>;
      setErrors({ ...(f.orderNumber ? { orderNumber: t(f.orderNumber) } : {}), ...(f.email ? { email: t(f.email) } : {}) });
      return;
    }
    show({ tone: 'error', text: body.message ? t(String(body.message)) : t('Something went wrong. Please try again in a moment.') });
  }

  async function onContinue(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setMessage(null);
    setPick(false);
    if (!check()) return;
    setBusy('continue');
    const r = await post('/api/my/continue');
    if (!r) {
      setBusy(null);
      return;
    }
    const { status, body } = r;
    if (status === 200 && body.ok && body.next === 'edit' && typeof body.editPath === 'string' && typeof body.slug === 'string') {
      rememberEditor({ slug: body.slug, path: body.editPath, names: typeof body.names === 'string' ? body.names : '', at: new Date().toISOString() });
      window.location.assign(body.editPath);
      return; // stays busy while the editor loads
    }
    setBusy(null);
    if (status === 200 && body.ok && body.next === 'start') {
      saveStartPrefill({ orderNumber, email });
      // G151: a custom design made for this order (a private theme) — the server names its start link.
      if (typeof body.startPath === 'string' && body.startPath.startsWith('/start?')) {
        window.location.assign(body.startPath);
        return;
      }
      if (theme) {
        window.location.assign(`/start?theme=${encodeURIComponent(theme.id)}`);
        return;
      }
      setPick(true);
      return;
    }
    failed(body);
  }

  async function onSignInLink() {
    if (busy) return;
    setMessage(null);
    if (!check()) return;
    setBusy('signin');
    const r = await post('/api/my/signin-link');
    setBusy(null);
    if (!r) return;
    if (r.status === 200 && r.body.ok) show({ tone: 'notice', text: t(String(r.body.message)) });
    else failed(r.body);
  }

  const field = (f: Field, id: string, hintId: string) => ({
    id,
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': [hintId, errors[f] ? `${id}-err` : null].filter(Boolean).join(' '),
  });

  return (
    <section className={s.card} aria-labelledby="my-continue" id="continue" data-my-continue="">
      <h2 id="my-continue" className={s.h2}>
        {t('Open or start your website')}
      </h2>
      <form onSubmit={onContinue} noValidate aria-busy={busy ? true : undefined}>
        {message ? (
          <div ref={messageRef} tabIndex={-1} role={message.tone === 'error' ? 'alert' : 'status'} className={message.tone === 'error' ? s.alert : s.notice} data-my-message={message.tone}>
            {message.text}
          </div>
        ) : null}

        <label className={s.label} htmlFor="my-order">
          {t('Etsy order number')}
        </label>
        <input
          className={s.input}
          {...field('orderNumber', 'my-order', 'my-order-hint')}
          inputMode="numeric"
          autoComplete="off"
          maxLength={40}
          value={orderNumber}
          onChange={(ev) => {
            setOrderNumber(ev.target.value);
            setErrors((p) => ({ ...p, orderNumber: undefined }));
            setPick(false);
          }}
        />
        <p className={s.hint} id="my-order-hint">
          {t('For example 1234567890 (Etsy shows it as “Order #1234567890”).')}
        </p>
        {errors.orderNumber ? (
          <p className={s.err} id="my-order-err">
            {errors.orderNumber}
          </p>
        ) : null}

        <label className={s.label} htmlFor="my-email">
          {t('Email address')}
        </label>
        <input
          className={s.input}
          {...field('email', 'my-email', 'my-email-hint')}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          value={email}
          onChange={(ev) => {
            setEmail(ev.target.value);
            setErrors((p) => ({ ...p, email: undefined }));
            setPick(false);
          }}
        />
        <p className={s.hint} id="my-email-hint">
          {t('Already started? Use the email you entered then. New here? Use the email you want to keep with your website.')}
        </p>
        {errors.email ? (
          <p className={s.err} id="my-email-err">
            {errors.email}
          </p>
        ) : null}

        {/* Honeypot: hidden from people and screen readers; bots that fill every field are refused. */}
        <div className={s.honeypot} aria-hidden="true">
          <label>
            Website
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <button type="submit" className={s.btn} disabled={busy !== null} data-my-submit="">
          {busy === 'continue' ? t('Opening…') : t('Continue')} {busy === 'continue' ? null : <ArrowRight size={18} aria-hidden />}
        </button>
        {emailLinkEnabled ? (
          <button type="button" className={s.btnText} disabled={busy !== null} onClick={() => void onSignInLink()} data-my-signin-link="">
            {busy === 'signin' ? t('Sending…') : t('Email me a sign-in link instead')}
          </button>
        ) : null}
      </form>

      {pick ? (
        <div className={s.pick} data-my-pick="">
          <h3 className={s.h3} ref={pickRef} tabIndex={-1}>
            {t('Let’s start your website')}
          </h3>
          <p className={s.p}>{t('There is no website for this order number yet. Which design did you buy?')}</p>
          {designs.length ? (
            <>
              <label className={s.label} htmlFor="my-design">
                {t('Your design')}
              </label>
              <select id="my-design" className={s.input} value={design} onChange={(ev) => setDesign(ev.target.value)}>
                {designs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </>
          ) : null}
          <a className={s.btn} href={design ? `/start?theme=${encodeURIComponent(design)}` : '/start'} data-my-start="" data-track="start_click">
            {t('Start my website')} <ArrowRight size={18} aria-hidden />
          </a>
          <p className={s.small}>{t('Your order number and email are filled in on the next page.')}</p>
        </div>
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------------------------------------

function PasteLink() {
  const [link, setLink] = useState('');
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDetailsElement>(null);
  // /my#link (the "edit link not valid" page): opened.
  useEffect(() => {
    if (window.location.hash === '#link' && ref.current) ref.current.open = true;
  }, []);

  return (
    <details className={s.details} id="link" ref={ref} data-my-link="">
      <summary className={s.summary}>{t('Have your private edit link?')}</summary>
      <div className={s.detailsBody}>
        <p className={s.p}>{t('When you started your website you could save a private edit link. Open it, or paste it here.')}</p>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            const path = editPathFromLink(link, window.location.origin);
            if (!path) {
              setError(t('That does not look like your edit link. It starts with this website’s address and contains /edit/.'));
              return;
            }
            window.location.assign(path);
          }}
        >
          <label className={s.label} htmlFor="my-edit-link">
            {t('Your edit link')}
          </label>
          <input
            id="my-edit-link"
            className={s.input}
            value={link}
            onChange={(ev) => {
              setLink(ev.target.value);
              setError(null);
            }}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            inputMode="url"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'my-edit-link-err' : undefined}
          />
          {error ? (
            <p className={s.err} id="my-edit-link-err" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className={s.btnGhost} data-my-paste="">
            {t('Open my editor')}
          </button>
        </form>
      </div>
    </details>
  );
}
