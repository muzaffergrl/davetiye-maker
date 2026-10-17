'use client';
// "My website" (/my, G095). 1) Editors opened on this device (lib/panel/remember.ts) → one tap back into the
// panel; ones that no longer open (website deleted, link replaced) are dropped after a check (G135). 2) Paste the saved edit link. 3) Not started yet → /start. 4) Lost the link → message the shop on Etsy.
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrandLogo } from '../panel/Brand.tsx';
import { dropGoneEditors, editPathFromLink, forgetEditor, readEditors, type RememberedEditor } from '../../lib/panel/remember.ts';
import { setUiLocale, t, tn } from '../../lib/i18n/client.ts';
import type { Lang } from '../../lib/i18n/langs.ts';
import type { Dict } from '../../lib/i18n/translate.ts';
import s from './my.module.css';

export default function MyWebsite({ shopName, startPath, lang = 'en', dict }: { shopName: string; startPath: string; lang?: Lang; dict?: Dict }) {
  // G144: the interface language (chosen on the server) before any text renders
  setUiLocale(lang, dict);
  // Read after mount (localStorage), so the server's and the browser's first render match.
  const [editors, setEditors] = useState<RememberedEditor[] | null>(null);
  const [link, setLink] = useState('');
  const [error, setError] = useState<string | null>(null);
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
        <h1 className={s.h1}>{t('My website')}</h1>
        <p className={s.lead}>{t("Open your editor to change your website, see your guests' replies and share your link.")}</p>

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
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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
              '{addresses} no longer opens with the link saved on this device, so we removed it. The website was deleted or a new edit link was made. If you have a newer link, paste it below.',
              '{addresses} no longer open with the link saved on this device, so we removed it. The website was deleted or a new edit link was made. If you have a newer link, paste it below.',
              { addresses: gone.map((e) => `/${e.slug}`).join(', ') },
            )}
          </p>
        ) : null}

        <section className={s.card} aria-labelledby="my-link">
          <h2 id="my-link" className={s.h2}>
            {editors && editors.length > 0 ? t('Another website or device') : t('Open with your edit link')}
          </h2>
          <p className={s.p}>
            {t('When you started your website you saved a private edit link (in your notes or an email to yourself). Open it, or paste it here.')}
          </p>
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
            <button type="submit" className={s.btn} data-my-paste="">
              {t('Open my editor')}
            </button>
          </form>
        </section>

        <section className={s.card} aria-labelledby="my-new">
          <h2 id="my-new" className={s.h2}>
            {t('Just bought a design?')}
          </h2>
          <p className={s.p}>{t('Start your website with your Etsy order number. It takes about two minutes.')}</p>
          <a className={s.btnGhost} href={startPath} data-track="start_click">
            {t('Start my website')} <ArrowRight size={18} aria-hidden />
          </a>
        </section>

        <section className={s.card} aria-labelledby="my-lost">
          <h2 id="my-lost" className={s.h2}>
            {t('Lost your edit link?')}
          </h2>
          <p className={s.p} style={{ marginBottom: 0 }}>
            {t('Message {shop} on Etsy with your order number. We will send you a new private link; your website, photos and replies stay exactly as they are.', { shop })}
          </p>
        </section>
      </main>
    </div>
  );
}
