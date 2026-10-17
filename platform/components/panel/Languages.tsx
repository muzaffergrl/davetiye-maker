'use client';
// G144 (K45 item 3): "Languages" on Us — the website's main language and extra languages (EN/TR/ES/DE/FR), the
// couple's own texts in each extra language, field by field, and the panel's own language.
//   Fixed texts (the design's headings, buttons, the RSVP form, dates) come translated by us: nothing to do here.
//   The couple's words (story, details, questions, menu, travel, their own headings …): "Translate automatically" makes a
//   draft with the browser's on-device translator, else the free keyless MyMemory service (lib/i18n/auto-translate.ts);
//   every field stays editable, and guests see a translation only after the couple approves it. When the source text
//   changes the translation is marked out of date (guests see the main language until it is checked again).

import { Check, Languages as LanguagesIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { ContentRecord, FieldTranslation } from '../../lib/content/types.ts';
import { openTranslator, TranslateUnavailable } from '../../lib/i18n/auto-translate.ts';
import { chooseUiLang, msg, t, tn, uiLang } from '../../lib/i18n/client.ts';
import { siteLangs, sourceFields, srcHash, translationOf, translationState, translationSummary, type SourceField, type TranslationState } from '../../lib/i18n/content.ts';
import { LANG_NAMES, LANGS, type Lang } from '../../lib/i18n/langs.ts';
import { usePanelContext } from './fields.tsx';
import { Badge, Button, Disclosure, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';

/** Longest translation kept (docs/03: translations.*.*.text maxLength). */
const MAX_TEXT = 4000;

// The panel's name for each translatable field (lib/i18n/content.ts TRANSLATABLE_PATHS); {n} = its number.
const FIELD_LABELS: Array<[RegExp, string]> = [
  [/^host_line$/, msg('Host line')],
  [/^dress_code$/, msg('Dress code')],
  [/^schedule\.(\d+)\.label$/, msg('Schedule {n}: event')],
  [/^schedule\.(\d+)\.location$/, msg('Schedule {n}: place')],
  [/^story\.intro$/, msg('Our Story: introduction')],
  [/^story\.items\.(\d+)\.caption$/, msg('Our Story: caption {n}')],
  [/^story\.items\.(\d+)\.text$/, msg('Our Story: text {n}')],
  [/^faq\.(\d+)\.q$/, msg('Question {n}')],
  [/^faq\.(\d+)\.a$/, msg('Answer {n}')],
  [/^travel\.airport\.text$/, msg('Travel: airport & station')],
  [/^travel\.parking\.text$/, msg('Travel: parking')],
  [/^travel\.shuttle\.text$/, msg('Travel: shuttle')],
  [/^travel\.taxi\.text$/, msg('Travel: taxi')],
  [/^travel\.stays\.(\d+)\.note$/, msg('Place to stay {n}: note')],
  [/^travel\.stays\.(\d+)\.distance$/, msg('Place to stay {n}: distance')],
  [/^meal\.courses\.(\d+)\.title$/, msg('Menu heading {n}')],
  [/^meal\.courses\.(\d+)\.items\.(\d+)$/, msg('Menu {n}: dish {m}')],
  [/^meal\.note$/, msg('Menu: dietary note')],
  [/^details_blocks\.(\d+)\.title$/, msg('Good to know {n}: title')],
  [/^details_blocks\.(\d+)\.text$/, msg('Good to know {n}: text')],
  [/^details_blocks\.(\d+)\.link_label$/, msg('Good to know {n}: link text')],
  [/^thank_you\.title$/, msg('Thank-you title')],
  [/^thank_you\.message$/, msg('Thank-you message')],
  [/^rsvp\.questions\.(\d+)\.label$/, msg('RSVP question {n}')],
  [/^maps\.venue\.label$/, msg('Map: first place heading')],
  [/^maps\.reception\.label$/, msg('Map: second place heading')],
];

function fieldLabel(path: string, copyLabel: (key: string) => string | null): string {
  if (path.startsWith('copy.')) return t('Heading or label: {name}', { name: copyLabel(path.slice(5)) ?? path.slice(5) });
  for (const [re, label] of FIELD_LABELS) {
    const m = re.exec(path);
    if (m) return t(label, { n: m[1] ? Number(m[1]) + 1 : '', m: m[2] ? Number(m[2]) + 1 : '' });
  }
  return path;
}

const STATE_TEXT: Record<TranslationState, string> = {
  missing: msg('Not translated'),
  draft: msg('Check and approve'),
  stale: msg('Out of date'),
  ok: msg('Approved'),
};
const STATE_TONE = { missing: 'neutral', draft: 'warning', stale: 'warning', ok: 'success' } as const;

type Translations = NonNullable<ContentRecord['translations']>;

function setTranslation(c: ContentRecord, lang: Lang, path: string, value: FieldTranslation | null): void {
  const all: Translations = { ...(c.translations ?? {}) };
  const byLang = { ...(all[lang] ?? {}) };
  if (value) byLang[path] = value;
  else delete byLang[path];
  if (Object.keys(byLang).length) all[lang] = byLang;
  else delete all[lang];
  if (Object.keys(all).length) c.translations = all;
  else delete c.translations;
}

export function LanguagesFields({ copyLabel = () => null }: { copyLabel?: (key: string) => string | null }) {
  const { content, edit, locked } = usePanelContext();
  const snack = useSnackbar();
  const { primary, all } = siteLangs(content);
  const extra = all.filter((l) => l !== primary);
  const fields = sourceFields(content);
  const [busy, setBusy] = useState<Lang | null>(null);
  const [manual, setManual] = useState(false);

  const setLangs = (p: Lang, ex: Lang[]) =>
    edit((c) => {
      const e = LANGS.filter((l) => l !== p && ex.includes(l));
      if (p === 'en' && !e.length) delete c.languages;
      else c.languages = e.length ? { primary: p, extra: e } : { primary: p };
    });

  const approveAll = (lang: Lang) =>
    edit((c) => {
      for (const f of sourceFields(c)) {
        const cur = translationOf(c, lang, f.path);
        if (cur && cur.text.trim() && cur.src === srcHash(f.text) && !cur.ok) setTranslation(c, lang, f.path, { ...cur, ok: true });
      }
    });

  const autoTranslate = async (lang: Lang) => {
    const todo = fields.filter((f) => {
      const s = translationState(content, lang, f);
      return s === 'missing' || s === 'stale';
    });
    if (!todo.length) {
      snack(t('Everything is translated already.'));
      return;
    }
    setBusy(lang);
    const results: Array<[string, FieldTranslation]> = [];
    let stop: string | null = null;
    try {
      const tr = await openTranslator(primary, lang, { allowService: true });
      try {
        for (const f of todo) {
          const out = (await tr.translate(f.text)).trim().slice(0, MAX_TEXT);
          if (out) results.push([f.path, { text: out, src: srcHash(f.text), ok: false, auto: tr.engine }]);
        }
      } finally {
        tr.close();
      }
    } catch (e) {
      const reason = e instanceof TranslateUnavailable ? e.reason : 'network';
      stop =
        reason === 'quota'
          ? t('The free translation service has reached its daily limit. Please write the rest yourself, or try again tomorrow.')
          : reason === 'none'
            ? t('Automatic translation is not available on this device. Please write the translations yourself.')
            : t('Automatic translation is not reachable right now. Please write the translations yourself, or try again later.');
      setManual(true);
    } finally {
      setBusy(null);
    }
    if (results.length) edit((c) => results.forEach(([path, v]) => setTranslation(c, lang, path, v)));
    snack(
      stop ??
        tn(results.length, '1 text translated. Please check it and approve it.', '{n} texts translated. Please check them and approve them.'),
    );
  };

  return (
    <Disclosure id="languages" title={t('Languages')} icon={LanguagesIcon} status={all.map((l) => l.toUpperCase()).join(' · ')}>
      <div className={styles.stack} data-languages>
        <p className={styles.hint}>
          {t('Guests can read your website in more than one language. The design’s headings, buttons, the reply form and the dates are translated for you. Your own words are translated below.')}
        </p>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="f-languages-primary">
            {t('Main language')}
          </label>
          <p className={styles.hint}>{t('The language you write your texts in. Guests see it first.')}</p>
          <select
            id="f-languages-primary"
            className={styles.input}
            value={primary}
            disabled={locked}
            onChange={(e) => setLangs(e.target.value as Lang, extra)}
            data-languages-primary
          >
            {LANGS.map((l) => (
              <option key={l} value={l} lang={l}>
                {LANG_NAMES[l]}
              </option>
            ))}
          </select>
        </div>
        <fieldset className={styles.field} disabled={locked}>
          <legend className={styles.label}>{t('Also show my website in')}</legend>
          {LANGS.filter((l) => l !== primary).map((l) => (
            <label key={l} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={extra.includes(l)}
                onChange={(e) => setLangs(primary, e.target.checked ? [...extra, l] : extra.filter((x) => x !== l))}
                data-languages-extra={l}
              />
              <span lang={l}>{LANG_NAMES[l]}</span>
            </label>
          ))}
          {extra.length ? <p className={styles.hint}>{t('Guests get a small language button on every page, and the link for each language works on its own (for example …?lang=de).')}</p> : null}
        </fieldset>

        {extra.map((lang) => (
          <LanguageTexts
            key={lang}
            lang={lang}
            primary={primary}
            fields={fields}
            busy={busy === lang}
            anyBusy={busy !== null}
            manual={manual}
            onAuto={() => void autoTranslate(lang)}
            onApproveAll={() => approveAll(lang)}
            copyLabel={copyLabel}
          />
        ))}

        <div className={styles.field} data-ui-lang>
          <label className={styles.label} htmlFor="f-ui-lang">
            {t('Language of this editor')}
          </label>
          <select id="f-ui-lang" className={styles.input} value={uiLang()} onChange={(e) => chooseUiLang(e.target.value as Lang)}>
            {LANGS.map((l) => (
              <option key={l} value={l} lang={l}>
                {LANG_NAMES[l]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Disclosure>
  );
}

function LanguageTexts(props: {
  lang: Lang;
  primary: Lang;
  fields: SourceField[];
  busy: boolean;
  anyBusy: boolean;
  manual: boolean;
  onAuto: () => void;
  onApproveAll: () => void;
  copyLabel: (key: string) => string | null;
}) {
  const { lang, primary, fields, busy, anyBusy, manual, onAuto, onApproveAll, copyLabel } = props;
  const { content, edit, locked, online } = usePanelContext();
  const sum = translationSummary(content, lang);
  const name = LANG_NAMES[lang];
  return (
    <section className={styles.langBlock} data-language={lang} aria-label={name}>
      <h3 className={styles.langTitle} lang={lang}>
        {name}
      </h3>
      <p className={styles.hint} data-language-summary>
        {sum.total
          ? t('{ok} of {total} texts approved', { ok: sum.ok, total: sum.total }) +
            (sum.draft ? ` · ${tn(sum.draft, '1 to check', '{n} to check')}` : '') +
            (sum.stale ? ` · ${tn(sum.stale, '1 out of date', '{n} out of date')}` : '')
          : t('You have no texts of your own to translate yet.')}
      </p>
      {sum.total ? (
        <div className={styles.langActions}>
          {!manual ? (
            <Button icon={Sparkles} busy={busy} busyLabel={t('Translating…')} disabled={locked || anyBusy || !online || !(sum.missing + sum.stale)} onClick={onAuto} data-auto-translate={lang}>
              {t('Translate automatically')}
            </Button>
          ) : null}
          <Button icon={Check} disabled={locked || !sum.draft} onClick={onApproveAll} data-approve-all={lang}>
            {t('Approve all')}
          </Button>
        </div>
      ) : null}
      {sum.total && !manual ? (
        <p className={styles.hint}>
          {t('Uses your browser’s built-in translator when it has one (nothing leaves your device); otherwise your texts are sent to the free MyMemory service (translated.net). Machine translation is a first draft: please read each text before you approve it.')}
        </p>
      ) : null}
      {manual ? <p className={styles.hint}>{t('Write each translation yourself in the boxes below.')}</p> : null}
      {sum.total ? (
        <ul className={styles.langList}>
          {fields.map((f) => {
            const state = translationState(content, lang, f);
            const cur = translationOf(content, lang, f.path);
            const id = `tr-${lang}-${f.path.replace(/\./g, '-')}`;
            const label = fieldLabel(f.path, copyLabel);
            return (
              <li key={f.path} className={styles.langRow} data-translation={f.path} data-state={state}>
                <div className={styles.langRowHead}>
                  <label className={styles.label} htmlFor={id}>
                    {label}
                  </label>
                  <Badge tone={STATE_TONE[state]}>{t(STATE_TEXT[state])}</Badge>
                </div>
                <p className={styles.langSource} lang={primary}>
                  <span className={styles.langSourceTag}>{primary.toUpperCase()}</span> {f.text}
                </p>
                <textarea
                  id={id}
                  lang={lang}
                  className={styles.textarea}
                  rows={f.text.length > 80 ? 4 : 2}
                  maxLength={MAX_TEXT}
                  readOnly={locked}
                  value={cur?.text ?? ''}
                  placeholder={t('Translation in {language}', { language: LANG_NAMES[lang] })}
                  onChange={(e) => {
                    const v = e.target.value;
                    // typed by the couple = their own approved words
                    edit((c) => setTranslation(c, lang, f.path, v.trim() ? { text: v, src: srcHash(f.text), ok: true } : null));
                  }}
                />
                {state === 'missing' ? <p className={styles.hint}>{t('Guests see this text in {language} until you translate it.', { language: LANG_NAMES[primary] })}</p> : null}
                {state === 'stale' ? <p className={styles.hint}>{t('You changed the {language} text after this translation. Guests see the {language} text until you check it.', { language: LANG_NAMES[primary] })}</p> : null}
                {state === 'draft' || state === 'stale' ? (
                  <Button
                    small
                    icon={Check}
                    disabled={locked}
                    onClick={() => edit((c) => void (cur && setTranslation(c, lang, f.path, { ...cur, src: srcHash(f.text), ok: true })))}
                    data-approve={f.path}
                  >
                    {state === 'stale' ? t('It is still right') : t('Approve')}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
