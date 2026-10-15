'use client';
// "My website" (/my, G095). 1) Editors opened on this device (lib/panel/remember.ts) → one tap back into the
// panel. 2) Paste the saved edit link. 3) Not started yet → /start. 4) Lost the link → message the shop on Etsy.
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrandLogo } from '../panel/Brand.tsx';
import { editPathFromLink, forgetEditor, readEditors, type RememberedEditor } from '../../lib/panel/remember.ts';
import s from './my.module.css';

export default function MyWebsite({ shopName, startPath }: { shopName: string; startPath: string }) {
  // Read after mount (localStorage), so the server's and the browser's first render match.
  const [editors, setEditors] = useState<RememberedEditor[] | null>(null);
  const [link, setLink] = useState('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => setEditors(readEditors()), []);

  const shop = /^\[.*\]$/.test(shopName) ? 'the shop' : shopName;

  return (
    <div className={s.page}>
      <main className={s.inner}>
        <a href="/" className={s.brand} aria-label="Home">
          <BrandLogo height={28} />
        </a>
        <h1 className={s.h1}>My website</h1>
        <p className={s.lead}>Open your editor to change your website, see your guests&apos; replies and share your link.</p>

        {editors && editors.length > 0 ? (
          <section className={s.card} aria-labelledby="my-saved" data-my-saved="">
            <h2 id="my-saved" className={s.h2}>
              On this device
            </h2>
            {editors.map((e) => (
              <div key={e.slug} className={s.editor}>
                <div>
                  <p className={s.names}>{e.names || e.slug}</p>
                  <p className={s.small} style={{ marginTop: 0 }}>
                    /{e.slug}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <a className={s.btnGhost} href={e.path} data-my-open={e.slug}>
                    Open editor <ArrowRight size={18} aria-hidden />
                  </a>
                  <button
                    type="button"
                    className={s.btnText}
                    onClick={() => {
                      forgetEditor(e.slug);
                      setEditors(readEditors());
                    }}
                  >
                    Remove from this device
                  </button>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        <section className={s.card} aria-labelledby="my-link">
          <h2 id="my-link" className={s.h2}>
            {editors && editors.length > 0 ? 'Another website or device' : 'Open with your edit link'}
          </h2>
          <p className={s.p}>
            When you started your website you saved a private edit link (in your notes or an email to yourself). Open it, or paste it here.
          </p>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              const path = editPathFromLink(link, window.location.origin);
              if (!path) {
                setError('That does not look like your edit link. It starts with this website’s address and contains /edit/.');
                return;
              }
              window.location.assign(path);
            }}
          >
            <label className={s.label} htmlFor="my-edit-link">
              Your edit link
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
            <button type="submit" className={s.btn} data-my-paste="">
              Open my editor
            </button>
          </form>
        </section>

        <section className={s.card} aria-labelledby="my-new">
          <h2 id="my-new" className={s.h2}>
            Just bought a design?
          </h2>
          <p className={s.p}>Start your website with your Etsy order number. It takes about two minutes.</p>
          <a className={s.btnGhost} href={startPath} data-track="start_click">
            Start my website <ArrowRight size={18} aria-hidden />
          </a>
        </section>

        <section className={s.card} aria-labelledby="my-lost">
          <h2 id="my-lost" className={s.h2}>
            Lost your edit link?
          </h2>
          <p className={s.p} style={{ marginBottom: 0 }}>
            Message {shop} on Etsy with your order number. We will send you a new private link; your website, photos and replies stay exactly as they are.
          </p>
        </section>
      </main>
    </div>
  );
}
