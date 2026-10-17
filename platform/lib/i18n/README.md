# lib/i18n — five languages (G144, K45 madde 3)

EN (default) · TR · ES · DE · FR. **No translation service at run time** for our own texts: we translate them ahead
of time into `dict/<namespace>/<lang>.ts`. A missing translation shows the English text.

## Keys = the English text (gettext style)

```ts
import { t, tn, msg } from '../../lib/i18n/client.ts';   // client components of the panel, /start, sign-in
t('Save changes')                                         // → "Değişiklikleri kaydet"
t('Hello {name}', { name })                               // placeholders {name}; keep them in every translation
tn(count, 'one reply', '{n} replies')                     // plural pair; dictionary key "one reply|{n} replies"
const TITLES = { us: msg('Us') };  …  t(TITLES.us)        // msg() marks a text defined in a constant; translate where shown
```

Server components build their own translator (no shared module state across requests):

```ts
const { lang, dict } = await uiLocale();          // lib/i18n/server.ts (cookie bke_lang, else Accept-Language)
const { t } = makeTranslator(lang, dict);         // lib/i18n/translate.ts
```

Rules
- Only **literal** strings inside `t('…')`, `tn(n, '…', '…')`, `msg('…')` are found by the scanner (`scan.ts`) and checked by
  `tests/i18n.test.ts`. A template literal is fine only without `${…}` — use `{name}` placeholders instead.
- Split rich JSX into text runs: `<p>{t('Tap')} <strong>{t('Publish')}</strong> {t('when you are ready.')}</p>` — or better,
  a whole sentence with a placeholder where word order matters.
- Never translate: the couple's own content, names, URLs, email addresses, product/brand names (BKE Studio, Etsy, Google
  Sheets, WhatsApp …), code identifiers, CSS classes, `data-*` values, analytics event names.
- Shared `lib/` code that also runs on the server (validation, API errors) keeps English and marks texts with `msg()`
  where the panel shows them; translate them at display time with `t(text)`.
- Turkish uses the polite "siz" form. Wedding wording should be warm and natural, not literal.

## Namespaces

| Namespace | Where | Loaded |
|---|---|---|
| `panel` | `components/panel/**`, `app/edit/**`, `app/start/**`, `app/my/**`, `app/signin/**`, `components/my/**` | server picks the language, passes only that dict to the root client component (`setUiLocale`) |
| `market` | `app/(marketing)/**`, `components/marketing/**`, `lib/marketing/**` | server components, per page language |
| `site` | couple websites: theme copy defaults (theme.json `copy`), fixed theme texts, platform guest UI (RSVP form, map, gate …) | engine, the page's language only; JS gets its strings in `#site-data` |
