# platform/ — düğün sitesi platformu (K24, G037 iskeleti)

Alıcının sitesi bizim platformumuzda yayınlanır ve panelden düzenlenir (`docs/10_SITE_PLATFORMU.md` tek kaynak).
Bu klasör: Next.js (App Router, TypeScript) uygulaması, **tema şablon motoru**, veri adaptörü (`local`),
site rotaları, içerik doğrulama ve testler. Panel (G039), RSVP (G042), Supabase (G043), `/start` (G045) sonraki görevler.

Durum: yerelde çalışıyor ve test edildi. **Hiçbir yere yayınlanmadı** (Vercel/Supabase projesi yok).

## Çalıştırma

Node ≥ 22.18 (TypeScript dosyaları `node` ile doğrudan çalışır; ek araç yok). Paket sürümleri sabit, `package-lock.json` commit'li.

```bash
cd platform
npm ci                 # bağımlılıklar
npm run seed           # .data/ içine demo site: /clara-and-julian (03 Blush Garden Rose demo içeriği, _sample tema)
npm run dev            # http://localhost:3000/clara-and-julian
npm test               # node:test — motor, içerik, anahtar/slug, adaptör, rotalar (67 test)
npm run typecheck      # tsc --noEmit
npm run build          # next build (Turbopack)
npm run screenshot     # build sonrası: next start + Playwright 390 px kontroller ve previews/*.png
```

`npm run seed -- --theme <id> --slug <slug> --content <json> --draft` ile başka tema/içerik tohumlanır.
Anahtarlar ekrana ve `.data/seed-keys.json`'a yazılır (`.data/` git'e girmez).
`npm run screenshot` geçici bir veri klasörü kullanır; global Playwright (`/opt/node22/lib/node_modules`) ve
`/opt/pw-browsers` tarayıcılarıyla çalışır, `playwright install` çalıştırmaz.

Ortam değişkenleri: `DATA_ADAPTER` (`local` varsayılan; `supabase` = G043), `PLATFORM_DATA_DIR` (varsayılan `platform/.data`),
`PLATFORM_THEMES_DIR` (varsayılan `platform/themes`).

## Klasörler

```
app/
  [slug]/route.ts                  /<slug>                → temanın index sayfası (kapalı zarf)
  [slug]/[page]/route.ts           /<slug>/home|story|details|rsvp
  themes/[theme]/[...path]/route.ts  tema CSS/JS/görselleri (html ve theme.json servis edilmez)
  media/[...path]/route.ts         local adaptörün yüklediği fotoğraflar
  layout.tsx, page.tsx             platform sayfaları için kök (panel vb. buraya gelecek)
lib/
  theme/engine.ts                  şablon motoru (işaretler aşağıda)
  theme/theme.ts                   theme.json okuma/doğrulama, sayfa şablonları
  theme/urls.ts                    URL güvenliği (link, foto, tema varlık yolu)
  content/schema.ts                docs/03_URUN_ICERIK_SEMASI.json'ın birebir kopyası (test farkı yakalar)
  content/validate.ts              tools/validate_content.py'nin TS aynası (şema + iş kuralları)
  content/format.ts, derive.ts     "June 12, 2027", "4:00 PM", türetilmiş alanlar, sayaç UTC'si
  data/types.ts                    DataAdapter sözleşmesi;  data/local/ = JSON dosya uygulaması
  sites.ts                         site oluştur (anahtar + slug + doğrulama), yayınla, erişim kontrolü
  keys.ts, slug.ts, uploads.ts     anahtar hash'i, ayrılmış slug'lar, foto tür/boyut kontrolü
  site/render.ts, site/static.ts   rota mantığı, CSP ve diğer başlıklar
themes/_sample/                    yalnız test iskeleti (tasarım DEĞİL); her işareti kullanır
scripts/                           seed.ts, screenshot.cjs, sync-schema.cjs
tests/                             *.test.ts (node:test)
previews/                          _sample tohum sitesinin 390 px görüntüleri + checks.json
```

## Site akışı ve görünürlük

- Site kaydında iki içerik vardır: `content` (panelin taslağı, otomatik kayıt) ve `publishedContent`
  (son **Yayınla** anındaki kopya). Ziyaretçi yalnız `publishedContent`'i görür.
- Taslak / yayınlanmamış düzenleme: `?preview=<önizleme anahtarı>` ile görünür. Önizleme yanıtı
  `noindex`, `no-store`, `no-referrer`; sayfalar arası linkler anahtarı taşır.
- Yayında olmayan site, bilinmeyen slug, ayrılmış slug (`edit`, `start`, `api`, `_next`, `themes`, `media` … `lib/slug.ts`),
  temanın tanımlamadığı sayfa ve `<body data-optional>` ile kapanan sayfa → **404**.
- `/Clara-And-Julian` → 308 ile küçük harfli adrese.

### Anahtarlar (`lib/keys.ts`)
- **Düzenleme anahtarı:** 32 rastgele bayt, base64url (43 karakter). Alıcıya bir kez gösterilir
  (`/edit/<slug>?k=<anahtar>`); yalnız SHA-256 hash'i saklanır.
- **Önizleme anahtarı:** `HMAC-SHA256(düzenleme anahtarı, "preview:v1")`. Panel bunu düzenleme anahtarından türetir;
  önizleme linki paylaşılsa bile düzenleme yetkisi vermez. Bu da yalnız hash olarak saklanır.
- Karşılaştırma `crypto.timingSafeEqual` ile, sabit zamanlı.

## Veri adaptörü sözleşmesi (`lib/data/types.ts`)

```ts
interface DataAdapter {
  getSiteById(id), getSiteBySlug(slug), findSitesByOrderRef(orderRef)
  createSite(NewSite)            // slug benzersiz; yoksa SlugTakenError. Durum "draft".
  updateContent(id, content)     // yalnız taslak; publishedContent'e dokunmaz
  publish(id)                    // publishedContent := content, status := published
  unpublish(id)                  // status := draft (publishedContent kalır)
  deleteSite(id)                 // site + RSVP + fotoğraflar
  saveRsvp(siteId, input), listRsvps(siteId)
  savePhoto(siteId, {bytes})     // assertImageUpload: JPG/PNG/WebP/AVIF, ≤ 10 MB, tür baytlardan
  readPhoto?(path)               // yalnız /media/... üzerinden servis eden adaptör (local)
}
```

Kurallar: adaptör yalnız depolamadır; anahtar üretimi, slug kuralı ve içerik doğrulaması `lib/sites.ts`'te.
Düz anahtar asla saklanmaz. Dönen kayıtlar kopyadır. Supabase şeması (G043) şu alanları taşımalı:
`sites(id, slug unique, theme, variant, status, content jsonb, published_content jsonb, edit_key_hash,
preview_key_hash, order_ref, owner_email, created_at, updated_at, published_at)`,
`rsvps(id, site_id, name, email, attending, guests, message, created_at)`.
(`docs/10` §2'deki tabloya `published_content`, `preview_key_hash`, `published_at` eklendi.)

`local` uygulaması: `.data/sites/<id>.json`, `.data/slugs/<slug>.json` (O_EXCL ile benzersizlik),
`.data/rsvps/<siteId>.json`, `.data/uploads/<siteId>/<rastgele>.<uzantı>`. Atomik yazma, süreç içi kilit.
Tek sunucu süreci içindir; canlı kullanım için değildir.

## Tema biçimi

```
themes/<id>/theme.json      {"id","name","version","internal"?, "pages": {"index": "index.html", "home": …},
                             "photos": {"<anahtar>": {"label","source": "media.hero_portrait","aspect": "4/5"}}}
themes/<id>/*.html          sayfa şablonları (index zorunlu; home, story, details, rsvp isteğe bağlı)
themes/<id>/…               CSS, JS, görseller (css js mjs png jpg jpeg webp avif gif svg ico mp4 webm)
```

- Tema id'si = klasör adı (`[a-z0-9_-]`). `internal: true` olan tema (ör. `_sample`) alıcıya sunulmaz (`listThemes`).
- Şablondaki göreli yollar (`site.css`, `img/a.webp`, `srcset`, `poster`, stil içindeki `url()`, og:image)
  `/themes/<id>/…` olur. Tema klasöründen çıkan yol (`../`) silinir.
- Tema sayfalarına linkler (`home.html#x`, `index.html?replay=1`) `/<slug>/home#x`, `/<slug>?replay=1` olur.
- **JS içindeki göreli adresler çevrilmez.** `location.href = 'home.html'`, prefetch ve
  `<script type="speculationrules">` içindeki URL'ler `/<slug>` altında yanlış çözülür; tema JS'i adresleri
  `site-data` içindeki `pages` nesnesinden almalı (G038 için not).
- Satır içi `<script>`'ler izinlidir: motor her sayfanın satır içi betiklerinin SHA-256'sını CSP'ye ekler.
  `onclick=` gibi satır içi olay öznitelikleri **çalışmaz** (CSP). Fontlar yalnız Google Fonts.
- Kişisel metin şablonda kalmaz: işaretli her öğenin içeriği sunucuda içerikten yazılır (örnek metin ezilir).

### Sayfa verisi (tema JS'i için)

Her sayfaya `<script type="application/json" id="site-data">` eklenir (`<`, `>`, `&` kaçışlı; JSON.parse ile okunur):

```js
const data = JSON.parse(document.getElementById('site-data').textContent);
// data.slug, data.theme, data.variant, data.page, data.preview
// data.pages      {index: "/clara-and-julian", home: "/clara-and-julian/home", …}  (önizlemede ?preview= ile)
// data.content    içerik kaydı (URL ve foto alanları güvenlik süzgecinden geçmiş)
// data.derived    {date_display, date_long, date_weekday, ceremony_time_display, rsvp_deadline_display,
//                  venue_city_region, venue_city_region_country, countdown_target_utc}
// data.photos     {<foto anahtarı>: URL | null}
```

## İşaret başvurusu (`lib/theme/engine.ts`)

Bütün değerler **metin** olarak eklenir (HTML kaçışlı); içerikten asla etiket/öznitelik/betik oluşmaz.
Yollar noktalıdır: `venue.name`, `schedule.0.time`, `story.items.1.caption`.

| İşaret | Etki |
|---|---|
| `data-field="yol"` | Öğenin içi = değer. ISO tarih alanları (`date`, `rsvp.deadline`) → `May 15, 2027` (en-US) / `15 May 2027`; saat alanları (`ceremony_time`, `schedule.*.time`) → `4:00 PM` / `4:00 pm`. Değer yoksa öğe boşalır ve `data-empty` alır |
| `data-field` + `<img>` | `src` = foto URL'si (http(s) veya `/media/…`); `srcset`/`sizes` ve `<picture>` içindeki `<source>`'lar kalkar. Foto yoksa tema yer tutucusu kalır. `data-photo-state="user|placeholder"` hem `img`'ye hem en yakın `[data-slot]` atasına yazılır |
| `data-field="urls.*"` + `<a>` | `href` = URL (yalnız http/https/mailto/tel; `target` varsa `rel="noopener noreferrer"`). Yoksa `href="#"` + `data-url-missing` + `aria-disabled="true"`. Link metni korunur |
| `data-format="…"` | `date`, `date-long` (Saturday, May 15, 2027), `weekday`, `month`, `day`, `year`, `time`, `raw` (biçimsiz); ayrıca `amp`: her `&` → `<span class="amp">&amp;</span>` (script yazı tipi kuralı) |
| `data-text="Our Story · {name_display}"` | Öğenin içi = şablon; `{yol}` veya `{yol\|biçim}`. `<title>` için de çalışır |
| `data-photo="anahtar"` | `theme.json` `photos.<anahtar>.source` yolundaki foto; `<img>` → `src`, diğer öğeler → `style="--photo: url(…)"` |
| `data-url="map"` | `<a>` `href` = `urls.map` (kurallar `data-field="urls.*"` ile aynı) |
| `data-optional="anahtar"` | `optional_blocks.anahtar === true` değilse öğe **kaldırılır**. `<html>`/`<body>` üzerindeyse sayfa 404 |
| `data-if="yol"` / `data-if="!yol"` | Değer boş değilse (boşsa) öğe kalır; `<body>` üzerinde sayfa düzeyinde çalışır |
| `data-repeat="schedule"` | Öğe listedeki her eleman için çoğaltılır; içeride `.time`, `.label`, `data-if=".location"` göreli yollar. Boş listede öğe kalkar. Kopya `data-repeat-item="schedule.2"` alır |
| `data-attr-<ad>="yol"` | Öznitelik = ham değer (ör. `datetime`); `{…}` içeriyorsa şablon. İzinli adlar: `alt`, `title`, `content`, `aria-label`, `datetime`, `value`, `placeholder`, `data-*` (motor işaretleri hariç) |

Türetilmiş alanlar (`data-field` ile kullanılabilir): `date_weekday`, `date_long`, `venue.city_region`,
`venue.city_region_country`, `countdown_target_utc`.

Çıktıda `data-field` / `data-if` yolları mutlak yola çevrilir (panel canlı önizlemesi için).
`<html>` öğesine `data-theme`, `data-page`, varsa `data-variant`, önizlemede `data-preview="true"` eklenir.

G035 kaynağı (`collections/03_Blush_Garden_Rose/website/*.html`) bu motorla uyarısız işleniyor (test:
`tests/engine.test.ts`, "G035 source pages"). Taşıma G038'in işi.

## İçerik doğrulama (`lib/content/validate.ts`)

`validateContent(record)` → `{ ok, errors[], warnings[] }`; her sorun `{level, code, path, message}` (mesajlar
İngilizce, panelde gösterilebilir). Python aracıyla aynı sıra: önce şema; şema geçerse iş kuralları
(RSVP son tarihi etkinlikten önce, `name_display` iki ismi içerir, demo kayıtta URL `null`, yasak kurgu hedefler,
program sırası, monogram, dress code/registry uyarıları). Bilinçli farklar (daha sıkı): `format: date` gerçek
takvim günü olmalı, `format: uri` mutlak http(s) olmalı, bilinmeyen saat dilimi uyarı verir.
`tests/content.test.ts` 20 demo kaydı ve hatalı örneklerde Python aracıyla geçti/kaldı eşliğini sınar.
Şema değişince: `node scripts/sync-schema.cjs`.

Taslak kayıt geçersiz olabilir (panelde yazarken); `publishSite()` geçersiz içeriği yayınlamaz.

## RSVP (G042)

Misafir, temanın RSVP sayfasındaki formu doldurur → platform betiği `/rsvp/form.js` yanıtı
`POST /api/rsvp/<slug>`'a gönderir → çift yanıtları düzenleme anahtarıyla listeler / CSV indirir.
Yalnız **yayında** olan site (`publishedContent`) yanıt alır; misafire hiçbir zaman başka misafirin verisi,
kayıt id'si veya sayılar dönmez.

```
app/api/rsvp/[slug]/route.ts            GET form durumu · POST misafir yanıtı (herkese açık)
app/api/rsvp/[slug]/responses/route.ts  GET liste + sayılar (düzenleme anahtarı)
app/api/rsvp/[slug]/export/route.ts     GET CSV (düzenleme anahtarı)
lib/rsvp/                               guest.ts (gönderim/durum), couple.ts (liste, sayılar, CSV), validate.ts,
                                        deadline.ts, rate-limit.ts (RateLimiter arayüzü), config.ts, http.ts
public/rsvp/form.js                     temalara bırakılan form betiği (bağımlılıksız, CSP uyumlu)
tests/fixtures/themes/rsvp-fixture/     sözleşmenin test sayfası (tasarım DEĞİL)
tests/rsvp.test.ts, rsvp-api.test.ts    node:test;  tests/rsvp-browser.ts = Chromium 390 px kontrolü
```

### Tema form sözleşmesi (G038 ve sonraki temalar)

Tema yalnız işaretli HTML yazar; gönderim, durum ve hata gösterimi platform betiğindedir. Örnek (tam hali
`tests/fixtures/themes/rsvp-fixture/rsvp.html`):

```html
<script src="/rsvp/form.js" defer></script>      <!-- kök yolu: motor çevirmez; CSP 'self' izin verir -->
<div data-rsvp>
  <form data-rsvp-form method="post">
    <input name="name" required maxlength="120" autocomplete="name">
    <p data-rsvp-error-for="name"></p>
    <input name="email" type="email" maxlength="254" autocomplete="email">
    <label><input type="radio" name="attending" value="yes" required> Joyfully accepts</label>
    <label><input type="radio" name="attending" value="no"> Regretfully declines</label>
    <label data-rsvp-if-attending>Number of guests <input name="guests" type="number" min="1" value="1"></label>
    <textarea name="message" maxlength="500"></textarea>
    <button type="submit">Send reply</button>
  </form>
  <div data-rsvp-state="success" hidden>
    <p data-rsvp-reply="yes">…</p> <p data-rsvp-reply="no">…</p>
    <button type="button" data-rsvp-again>Send another reply</button>
  </div>
  <div data-rsvp-state="closed" hidden><p data-rsvp-message>…</p></div>
  <div data-rsvp-state="error" hidden><p data-rsvp-message>…</p></div>
  <div data-rsvp-state="preview" hidden><p data-rsvp-message>…</p></div>
</div>
```

| İşaret | Anlamı |
|---|---|
| `form[data-rsvp-form]` | Yanıt formu. Alanlar **`name` ile**: `name` (zorunlu), `email`, `attending` (`yes`/`no`; radyo, select veya tek checkbox), `guests`, `message`. **`method="post"` yazılır** (JS yüklenmezse veri URL'ye düşmesin; sayfa rotası POST'a 405 verir, hiçbir şey saklanmaz). `action` yazılmaz. |
| `[data-rsvp-state="success\|closed\|error\|preview"]` | Temanın durum panelleri, `hidden` ile başlar. Betik yalnız geçerli olanı gösterir. `success`/`closed`'da form gizlenir; `error`/`preview`'da form kalır. Durumun paneli yoksa betik formun altına düz bir `<p data-rsvp-fallback>` yazar |
| `[data-rsvp-message]` | Panel içinde: sunucunun İngilizce mesajı buraya yazılır ("Please enter your name.", "Replies closed on April 3, 2027. …"). Yoksa temanın kendi metni kalır. **`error` ve `closed` panellerine koyun** |
| `[data-rsvp-error-for="<alan>"]` | O alanın hata metni; alan ayrıca `aria-invalid="true"` alır, yazınca temizlenir. Yoksa tarayıcının kendi doğrulama balonu kullanılır |
| `[data-rsvp-if-attending]` | Misafir "no" seçince gizlenir, içindeki alanlar devre dışı (ör. guests) |
| `[data-rsvp-reply="yes\|no"]` | Yalnız misafirin cevabı buysa görünür (success panelinde katılan/katılmayan için ayrı teşekkür) |
| `[data-rsvp-again]` | Formu sıfırlayıp yeniden açar (aynı aileden ikinci yanıt) |
| `[data-rsvp]` | İsteğe bağlı kapsayıcı: paneller bunun içinde aranır (yoksa bütün sayfa). Sayfada birden çok form varsa zorunlu |
| `data-rsvp-status` (betik yazar) | Formda ve `[data-rsvp]`'de: `ready`, `sending`, `success`, `closed`, `error`, `preview` (CSS için). Ayrıca formda `rsvp:state` olayı (`event.detail.state`) — tema animasyonu bağlanabilir |

Betik davranışı:
- Slug'ı `#site-data`'dan okur; açılışta `GET /api/rsvp/<slug>` ile durumu sorar: kapalıysa `closed` paneli
  (mesajda tarih), `guests` sayı alanının `max`'ı tema sınırına çekilir.
- **Honeypot:** formda `name="website"` alanı yoksa betik ekran dışı, `aria-hidden`, `tabindex=-1` bir alan ekler.
  Temalar kendi alanlarına `website` adını vermez.
- **Önizleme** (`?preview=<anahtar>`, `data.preview === true`): hiçbir şey gönderilmez, `preview` paneli gösterilir;
  durum taslak içerikten okunur.
- Gönderim sırasında submit düğmeleri devre dışı, formda `aria-busy="true"`. Başarıda form sıfırlanır.
  Panellere `role="status"` (hata: `role="alert"`) eklenir; success/closed'da odak panele taşınır.
- Satır içi olay özniteliği, `innerHTML`, `eval` yok; yalnız `fetch` (CSP `connect-src 'self'`).
- Tema 03'ün G035 kaynağındaki "preview only" RSVP düğmesi (`data-field="urls.rsvp_form"`) bu formla değiştirilir.

### API

Misafir tarafı (herkese açık, yalnız JSON):

| İstek | Yanıt |
|---|---|
| `GET /api/rsvp/<slug>` (`?preview=<önizleme anahtarı>` taslağı okur) | `200 {ok, open, reason: null\|"deadline"\|"disabled", message, closesAt, deadline: "April 3, 2027", maxGuests, preview}` · `404` |
| `POST /api/rsvp/<slug>` `Content-Type: application/json`, ≤ 8 KB: `{name, email, attending, guests, message, website}` | `200` success · `400` invalid (+`fields`) · `403` closed · `404` · `413` · `415` · `429` (+`Retry-After`) · `500` |

Gövde her zaman `{ok, state: "success"|"closed"|"error", code?, message, fields?}`. Kurallar (`lib/rsvp/`):
- `name` zorunlu, ≤ 120; `email` isteğe bağlı (biçim kontrolü); `attending` yes/no; `guests` katılıyorsa
  1..`maxGuests` (boşsa 1), katılmıyorsa **0** saklanır; `message` ≤ 500. Kontrol karakterleri ve bidi işaretleri silinir.
- `maxGuests`: tema `theme.json` → `"rsvp": {"max_guests": N}` (1..20); yoksa 10. (Fixture: 6.)
- **Son tarih:** `rsvp.deadline` gününün **sonu**, sitenin `timezone`'unda (ertesi gün 00:00). Saat dilimi geçersizse
  UTC-12 (kimse erken geri çevrilmez). `rsvp.method: "none"` → form kapalı (`reason: "disabled"`).
- Honeypot doluysa normal success cevabı döner, **kayıt yapılmaz**.
- Aynı yanıt 5 dakika içinde yeniden gelirse bir kez saklanır (çift tıklama / yeniden deneme).
- **Hız sınırı:** IP başına 10 POST / 15 dk (bütün siteler; IPv6 /64 olarak), site başına 200 saklanan yanıt / saat.
  `RateLimiter` arayüzü (`lib/rsvp/rate-limit.ts`); şimdilik süreç içi bellek (`MemoryRateLimiter`).
  IP: `x-forwarded-for` ilk değeri, yoksa `x-real-ip` (Vercel bunları kendisi yazar; başka proxy'de aynısı sağlanmalı).

Çift tarafı (düzenleme anahtarı: `Authorization: Bearer <anahtar>` tercih; indirme linki için `?k=<anahtar>`):

| İstek | Yanıt |
|---|---|
| `GET /api/rsvp/<slug>/responses` | `200 {ok, site: {slug, status}, window: {open, reason, closesAt, deadlineDisplay}, counts: {responses, attending, notAttending, totalGuests}, responses: [{id, name, email, attending, guests, message, createdAt}]}` — yeniden eskiye |
| `GET /api/rsvp/<slug>/export` | `text/csv`, `attachment; filename="rsvps-<slug>-<YYYY-MM-DD>.csv"` |

- Yanlış anahtar, önizleme anahtarı, başka sitenin anahtarı ve bilinmeyen slug **aynı** `401` (`This edit link is not valid.`).
  Bütün RSVP yanıtları `private, no-store`, `noindex`, `no-referrer`.
- `totalGuests` = katılan yanıtlardaki `guests` toplamı (baş sayısı).
- CSV: UTF-8 BOM (Excel aksanlı isimler), CRLF, her hücre tırnaklı; `=`, `+`, `-`, `@` (ve sekme/CR) ile başlayan
  hücrenin başına `'` eklenir (CSV injection). Sütunlar: `Submitted (<timezone>)` ("March 1, 2027 10:05 AM", sitenin
  saat diliminde), `Name`, `Email`, `Attending` (Yes/No), `Guests`, `Message`; eskiden yeniye.
- Panel sunucuda doğrudan da çağırabilir: `authorizeEditor`, `rsvpSummary`, `rsvpCounts`, `rsvpCsvForSite` (`lib/rsvp/couple.ts`).

Tarayıcı kontrolü (build gerekir; `npm test`'e dahil değil):
`npm run build && NODE_PATH=/opt/node22/lib/node_modules node tests/rsvp-browser.ts` — fixture tema, `next start`,
Chromium 390 px: gönder/teşekkür (yes/no), ikinci yanıt, sunucu hata mesajı, kapalı form, önizlemede gönderim yok,
CSP/konsol hatası yok. Ekran görüntüleri `$RSVP_SHOTS_DIR`'e (varsayılan geçici klasör).

## Güvenlik özeti

- İçerik → HTML: yalnız metin düğümü/öznitelik değeri (parse5 serileştirici kaçışlar); `<script>`/`<style>` içine
  değer yazılmaz. JSON bloğu `<`, `>`, `&`, U+2028/2029 kaçışlı.
- URL'ler: link http/https/mailto/tel; foto http(s) veya kök göreli `/…` (`//`, `data:`, `javascript:` reddedilir).
- Başlıklar: CSP (`script-src 'self'` + tema satır içi betik hash'leri, `object-src 'none'`, `base-uri 'none'`,
  `frame-ancestors 'self'`), `nosniff`, önizlemede `noindex`/`no-store`/`no-referrer`.
- Statik rota: tema klasörü dışına çıkış, nokta dosyaları, `.html`/`theme.json` servis edilmez; SVG'ye ayrı CSP.
- Yüklemeler: tür dosya baytlarından (SVG/HTML reddedilir), 10 MB sınırı, rastgele dosya adı.

## Açık konular

- Supabase adaptörü, Vercel yayını (kullanıcı onayı), panel, RSVP formu, `/start` → G039–G045.
- Tema varlıkları şimdilik fonksiyon üzerinden servis ediliyor (CDN önbelleği `s-maxage`); trafik artarsa
  derlemede `public/` altına kopyalamak düşünülebilir.
- `local` adaptör tek süreç içindir. RSVP hız sınırı da süreç içi bellekte (`MemoryRateLimiter`); Vercel'de birden çok
  örnek olacağı için G043 kalıcı bir `RateLimiter` (Supabase tablo/RPC) yazıp `setRsvpRateLimiter()` ile bağlamalı.
- RSVP: yanıt silme/düzeltme yok (adaptörde `deleteRsvp` yok); çifte e-posta bildirimi yok (sağlayıcı seçilmedi);
  misafir verisi için gizlilik metni yayından önce gerekli.
