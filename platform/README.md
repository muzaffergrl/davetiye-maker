# platform/ — düğün sitesi platformu (K24, G037 iskeleti)

Alıcının sitesi bizim platformumuzda yayınlanır ve panelden düzenlenir (`docs/10_SITE_PLATFORMU.md` tek kaynak).
Bu klasör: Next.js (App Router, TypeScript) uygulaması, **tema şablon motoru**, veri adaptörü (`local`),
site rotaları, içerik doğrulama, düzenleme paneli (G039), RSVP (G042), `/start` sahiplenme akışı (G045) ve testler. Supabase (G043) sonraki görev.

Durum: yerelde çalışıyor ve test edildi. **Hiçbir yere yayınlanmadı** (Vercel/Supabase projesi yok).

## Çalıştırma

Node ≥ 22.18 (TypeScript dosyaları `node` ile doğrudan çalışır; ek araç yok). Paket sürümleri sabit, `package-lock.json` commit'li.

```bash
cd platform
npm ci                 # bağımlılıklar
npm run seed           # .data/ içine demo site: /clara-and-julian (blush-garden-rose teması, 03 demo içeriği + örnek fotoğraflar)
npm run dev            # http://localhost:3000/clara-and-julian
npm test               # node:test — motor, içerik, anahtar/slug, adaptör, rotalar, RSVP, panel, /start, blush-garden-rose teması (147 test)
npm run typecheck      # tsc --noEmit
npm run build          # next build (Turbopack)
npm run screenshot     # build sonrası: next start + Playwright 390 px kontroller (_sample) ve previews/*.png
node scripts/theme-check.cjs   # build sonrası: blush-garden-rose — 5 genişlik, akış, içerik, previews/g038/ (+ MP4)
```

`npm run seed -- --theme <id> --slug <slug> --content <json> --draft` ile başka tema/içerik tohumlanır;
`--no-photos` yer tutucu hâli, `--photos <klasör>` başka örnek fotoğraflar (dosya adı = tema foto anahtarı).
Anahtarlar ekrana ve `.data/seed-keys.json`'a yazılır (`.data/` git'e girmez).
`npm run screenshot` geçici bir veri klasörü kullanır; global Playwright (`/opt/node22/lib/node_modules`) ve
`/opt/pw-browsers` tarayıcılarıyla çalışır, `playwright install` çalıştırmaz.

Ortam değişkenleri: `DATA_ADAPTER` (`local` varsayılan; `supabase` = G043), `PLATFORM_DATA_DIR` (varsayılan `platform/.data`),
`PLATFORM_THEMES_DIR` (varsayılan `platform/themes`), `PLATFORM_PUBLIC_URL` (sitelerin herkese açık kökü, ör. `https://<ad>.vercel.app`;
panelin yayın linki ve QR'ı için; yoksa isteğin host'u kullanılır).

## Klasörler

```
app/
  [slug]/route.ts                  /<slug>                → temanın index sayfası (kapalı zarf)
  [slug]/[page]/route.ts           /<slug>/home|story|details|rsvp
  themes/[theme]/[...path]/route.ts  tema CSS/JS/görselleri (html ve theme.json servis edilmez)
  media/[...path]/route.ts         local adaptörün yüklediği fotoğraflar
  layout.tsx, page.tsx             platform sayfaları için kök
  edit/[slug]/page.tsx, not-found.tsx   /edit/<slug>?k=<anahtar> düzenleme paneli (G039); geçersiz link = genel 404
  api/edit/[slug]/…                panel API: durum, taslak kaydı, foto, yayınla, yayından kaldır
  start/page.tsx, StartForm.tsx    /start?theme=<tema> sahiplenme sayfası (G045); start/demo/[theme]/… = temanın canlı demosu
  api/start/, api/start/slug/      sahiplenme API'si (POST) ve adres uygunluk ipucu (GET)
components/panel/                  panelin istemci bileşenleri (Panel, bölümler, kırpma, önizleme, QR) + panel.module.css
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
  panel/                           panel: model.ts (istemci+sunucu yardımcıları), api.ts, draft.ts, photos.ts (sharp), state.ts, http.ts
  qr.ts                            gerçek URL'den QR (uqr; tools/make_qr.py ayarları)
  claim/                           /start: fields.ts (istemci+sunucu kuralları), claim.ts, api.ts, themes.ts, demo-page.ts,
                                   verify.ts (Etsy doğrulama arayüzü, kapalı), mailer.ts (e-posta arayüzü, yok), limits.ts, demo/
themes/_sample/                    yalnız test iskeleti (tasarım DEĞİL); her işareti kullanır
themes/blush-garden-rose/          ilk gerçek tema (tasarım 03, G038) — aşağıda "Tema: blush-garden-rose"
scripts/                           seed.ts, screenshot.cjs, theme-check.cjs, sync-schema.cjs
tests/                             *.test.ts (node:test)
previews/                          _sample tohum sitesinin 390 px görüntüleri + checks.json; g039/ = panel akışı (PNG/JPG + MP4);
                                   g045/ = /start akışı
previews/g038/                     blush-garden-rose: sayfa görüntüleri, G035 karşılaştırması, açılış MP4'ü, checks.json
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
  `site-data` içindeki `pages` nesnesinden alır. JS'teki tema görselleri betiğin kendi adresine göre çözülür
  (`new URL('img/x.webp', document.currentScript.src)`). Speculation rules URL yazmaz, sunucunun çevirdiği linke
  seçiciyle bakar (`"source":"document","where":{"selector_matches":"a[data-enter]"}`) — betik sabit kalır, CSP hash'i de.
- `<noscript>` içi ham metindir; içindeki link çevrilmez. JS'siz yedek için `.no-js` sınıfıyla gösterilen normal öğe kullan.
- `sessionStorage` anahtarları site başına olmalı (bütün siteler aynı origin'de): `…:<slug>` (`site-data.slug`).
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
`tests/engine.test.ts`, "G035 source pages"); platform teması hâli `themes/blush-garden-rose/` (G038, aşağıda).

## Tema: blush-garden-rose (G038)

İlk gerçek tema: tasarım 03'ün onaylı G035 demosu (`collections/03_Blush_Garden_Rose/website/`) platforma taşındı.
Görünüm G035 ile aynı (yan yana: `previews/g038/compare_*_390.jpg`); bilinçli farklar aşağıda. Ayrıntı: `themes/blush-garden-rose/README.md`.

- **Sayfalar:** `index` (kapalı zarf açılışı) → `home` → `story` (`<body data-optional="our_story">`) · `details` · `rsvp`.
  Kişisel her değer sunucuda doluyor: `data-field`, başlık/açıklama/OG `data-text`/`data-attr-content`, program satırları
  `data-repeat="schedule"` (Details kartında her öğe bir satır; ana sayfa tanıtımında ilk 4), boş alanlar `data-if` ile
  kalkıyor (ör. bölgesiz şehirde virgül kalmaz: `venue.city_region`). Nav'daki Story linki de `data-optional="our_story"`.
- **Foto alanları** (`theme.json` `photos`, oran = pencere kutusu px): `hero_portrait` 567/595 (kart kemeri; index + home),
  `story_1..3` 626/868 (altın kemer çerçeve; `media.memory_photos.0..2`), `venue` 1172/681 (GPT yatay altın çerçeve,
  G047). Şablonda yalnız `data-photo="<anahtar>"`; foto yoksa temanın nötr yer tutucusu (`img/ph_<anahtar>-*.webp`) +
  "Your photo here" (`[data-photo-state="placeholder"] > .ph-mark`). Yüz kırpımı `object-position` ile (portre %38, kemer %40).
- **site.js:** `#site-data` varsa kişisel metne dokunmaz; sayfa adresleri `data.pages`, sayaç hedefi
  `data.derived.countdown_target_utc`, eksik link bildirimi `a[data-url-missing]`. `#site-data` yoksa (tema dosyaları
  statik sunucuda) `DEV_CONTENT` + küçük bir tarayıcı içi işleyici aynı işaretleri doldurur — yalnız tasarım önizlemesi.
  Koreografi (`MOTION`), Skip, reduced motion, view transition, geri dönüşte açık zarf + "Replay" G035 ile aynı.
- **G035'ten farklar:** mekân fotoğrafı GPT yatay çerçevede (CSS kemer kırpma + çiçek kümeleri yerine); kapalı zarfın
  kapağı ayrı katman (`env_cflap`, tırtıklı kenarı izlenerek kesildi) ve açılışta menteşesinde 3D kalkıyor, sonra açık
  kapak devralıyor (önceden kapalı zarf açık gövdeye eriyordu); oturum anahtarları site başına; 4+ program satırında
  kart sıkışık düzene geçiyor (6 satıra kadar boyalı çiçeğe değmediği ölçüldü); RSVP sayfasında G035'in "preview only"
  düğmesi yerine platform formu (G042 sözleşmesi: `/rsvp/form.js`, `data-rsvp-*`, `method="post"`) — kartın RSVP
  düğmesi forma kaydırır, teşekkür/kapalı/hata/önizleme panelleri temanın tipografisinde.
- **Görseller:** `python3 platform/themes/blush-garden-rose/build_images.py` (GPT parçaları → `img/`, önce
  `tools/parts_prep.py`; pencerelerin tam şeffaflığını ve görünür #00FF00 kalmadığını kendisi denetler).
- **Doğrulama:** `tests/theme-blush-garden-rose.test.ts` (12 test: alanlar = içerik kaydı, içerik değişikliği, foto
  durumları, isteğe bağlı bloklar, linkler, RSVP form sözleşmesi, önizleme anahtarı, site.js sözleşmesi, gerçek rotalar +
  RSVP API'siyle kayıt) ve
  `scripts/theme-check.cjs` (Playwright, `next start`: 5 sayfa × 360/390/430/768/1280 taşma/metin/görsel/kart serbest
  bölgesi, zarf → home → story akışı, geri/replay, Skip, reduced motion, önizleme anahtarı, site başına oturum, sayaç,
  eksik link hiçbir şey göndermiyor, RSVP yanıtı bu siteye kaydediliyor ve önizlemede hiçbir şey gönderilmiyor, veri
  değişince sayfa değişiyor, ilk açılış ağırlığı, 390×844 MP4).

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

## Düzenleme paneli (G039)

Alıcı sitesini telefonundan düzenler: `/edit/<slug>?k=<düzenleme anahtarı>`. Panel İngilizce, telefon öncelikli (390 px),
sade bir araç: büyük dokunma alanları (≥ 44–48 px), akordeon bölümler, altta sabit **Save · Preview · Publish** çubuğu.
Geniş ekranda (≥ 960 px) önizleme formun yanında durur. Görsel dekor yok (K21); renkler marka-nötr.

- **Link:** anahtar hash ile doğrulanır (`authorizeEditor`). Yanlış/eksik anahtar, önizleme anahtarı, başka sitenin anahtarı ve
  bilinmeyen slug → **aynı** genel 404 sayfası ("This edit link is not valid"); slug'ın varlığı sızmaz. Sayfa `noindex`,
  `<meta name="referrer" content="no-referrer">` (anahtar URL'de), dinamik (`no-store`).
- **Bölümler:** Couple (ilk isimler, tam isimler; "Names as shown" ve monogram ilk isimleri izler — elle değiştirilene kadar; host line) ·
  Date & time (tarih, tören saati, saat dilimi listesi + "Use this device's time zone", tarih biçimi US/UK/CA/AU) · Venue ·
  Schedule (satır ekle/sil/yukarı/aşağı, "Sort by time"; ilk satır tören saatine eşitse saatle birlikte değişir) ·
  Story (giriş + anlar: başlık ≤ 60, metin ≤ 400, en çok 12) · Details (dress code; map, travel & stay = `urls.accommodation`,
  registry linkleri) · RSVP (son tarih "Replies close at the end of Saturday, April 3, 2027 (America/New York time)",
  "Accept replies on the website" = `rsvp.method` null/`none`, gelen yanıtlar + sayılar + CSV, "Refresh") ·
  Optional sections (yalnız temanın sayfalarında `data-optional` ile geçen bloklar) · Photos (`theme.json` foto alanları).
- **Tarihler** her yerde `formatDate`/`formatDateLong` ile: "Saturday, May 15, 2027", "4:00 PM" (en-GB: "15 May 2027", "4:00 pm").
- **Otomatik kayıt:** son değişiklikten 800 ms sonra `PUT /api/edit/<slug>`; istekler sıralı (aynı anda tek PUT), her istek son
  bilinen `updatedAt`'i taşır → başka sekme/telefon arada kaydettiyse **409**, kayıt durur ve "Reload" istenir (sessiz üzerine yazma yok).
  Sekme gizlenince kayıt; kapanırken `keepalive` kaydı ve kaydedilmemiş değişiklikte `beforeunload` uyarısı. Ağ hatasında artan
  aralıkla yeniden dener. Çubukta durum: "All changes saved / Unsaved changes / Saving… / Not saved yet. Trying again…".
- **Doğrulama:** tarayıcıda aynı TS doğrulayıcı `validateContent(content, { platform: true })`; boş alanlarda daha anlaşılır metin
  (`panelIssues`: "Please enter a time.", "Please choose a date.", "Please enter a name."). Hata alanın altında (yazarken gizli,
  blur'da görünür), bölüm başlığında "N to fix". Publish hataları listeler; her madde alana götürür ve odaklar.
  `platform: true` seçeneği yalnız `urls.website` / `urls.rsvp_form` boş uyarılarını (`customer_url_missing`) kapatır (site ve RSVP
  platformun kendisi); hiçbir hatayı değiştirmez (test: `tests/panel.test.ts`).
- **Taslak kuralları (`lib/panel/draft.ts`):** taslak eksik/geçersiz olabilir (yazarken), ama yapısı bozuk olamaz: bilinmeyen alan,
  yanlış JSON türü, eksik zorunlu nesne, enum dışı değer, liste sınırı aşımı → **400** (`invalid_shape`), saklanmaz.
  `record_kind` ve `event_type` panelden değişmez (saklı değer korunur). Taslak ≤ 64 KB.
- **Önizleme:** iframe `/<slug>?preview=<önizleme anahtarı>` (anahtar düzenleme anahtarından türetilir), 390 px; sayfa sekmeleri
  (Envelope/Home/Story/Details/RSVP); her başarılı kayıttan sonra yeniden yüklenir. Telefonda tam ekran açılır; iframe ilk açılışta yüklenir.
- **Yayın:** `publishSite` (geçersiz içerik → **422** + `issues`), `unpublishSite`. Düğme: "Publish" → yayındayken değişiklik varsa
  "Publish changes", güncelse "Share". Yayından sonra link (kopyala/aç) ve **QR**: `lib/qr.ts`, sabit `uqr@0.1.3` (Nayuki
  kodlayıcısı), `tools/make_qr.py` ile aynı ayarlar (hata düzeltme Q, 4 modül kenar), yalnız http(s), demo alan adları reddedilir;
  PNG/SVG indirme. "Take the website offline" onaylıdır; içerik ve son yayın kopyası korunur.
- **Fotoğraf:** dosya seçimi (`accept="image/*"`, ≤ 30 MB, SVG reddedilir) → tarayıcıda kırpma (alanın oranı; sürükle, pinch,
  kaydırıcı, tekerlek, ok/+/- tuşları) → canvas JPEG (uzun kenar ≤ 2000 px, ≤ 3.5 MB) → `POST /api/edit/<slug>/photo?slot=<anahtar>`
  → `assertImageUpload` (tür baytlardan, ≤ 10 MB) → **sharp ile yeniden kodlama** (`lib/panel/photos.ts`: EXIF yönü uygulanır,
  bütün metadata — GPS dahil — silinir, ≤ 50 MP, uzun kenar ≤ 2400 px, oran %1'den fazla saparsa ortadan kırpma, şeffaflık beyaza,
  sRGB JPEG q84) → `adapter.savePhoto` → URL taslağa yazılır ve hemen kaydedilir. `memory_photos` şemaya uygun kalır (boşluk `""`,
  sondaki boşlar silinir). sharp yüklenemezse (yerel ikili yoksa) kontrol edilmiş orijinal saklanır ve uyarı loglanır.
  sharp, Next'in zaten kurduğu sürümle (`0.35.5`) doğrudan bağımlılık yapıldı.

### Panel API

Hepsi `Authorization: Bearer <düzenleme anahtarı>` ister (`?k=` kabul edilmez: link ya da başka sitenin formu işlem yapamaz).
Yanlış anahtar, önizleme anahtarı, başka sitenin anahtarı, bilinmeyen/ayrılmış slug → aynı
`401 {ok:false, code:"unauthorized", message:"This edit link is not valid."}`. Yanıtlar `private, no-store`, `noindex`, `no-referrer`.

| İstek | Yanıt |
|---|---|
| `GET /api/edit/<slug>` | `200 {ok, state: {slug, theme: {id, name, pages, photos[{key,label,source,aspect,ratio}], optionalBlocks}, content, status, updatedAt, publishedAt, hasUnpublishedChanges, previewKey, origin}}` |
| `PUT /api/edit/<slug>` `{content, baseUpdatedAt?}` (JSON) | `200 {ok, status, updatedAt, publishedAt, hasUnpublishedChanges, validation: {ok, errors, warnings}}` · `400 bad_json / invalid_shape (+issues)` · `409 conflict (+updatedAt)` · `413` · `415` |
| `POST /api/edit/<slug>/photo?slot=<anahtar>` (ham görsel gövdesi) | `200 {ok, slot, source, url, contentType, size, width, height}` · `400 empty / unknown_slot` · `413 too_large` · `415 unsupported_type` |
| `POST /api/edit/<slug>/publish` `{baseUpdatedAt?}` | `200 {ok, status:"published", publishedAt, updatedAt, hasUnpublishedChanges, url}` · `409` · `422 invalid_content (+issues)` |
| `POST /api/edit/<slug>/unpublish` | `200 {ok, status:"draft", …}` |

Yükleme yalnız dosyayı saklar ve URL döner; içeriğe yazan, panelin bir sonraki kaydıdır (tek yazar: taslak).

### Panel testleri

- `tests/panel.test.ts` (node:test, 21 test): anahtar (iyi/yanlış/eksik/başka site/`?k=`/bilinmeyen slug; önizleme anahtarı düzenleyemez),
  taslak kaydı (yayın kopyasına dokunmaz, 409 çakışma, kilitli alanlar, yapı reddi, 413/415/400), doğrulama mesajları ve
  `platform` seçeneği, yükleme sınırları (boş, > 10 MB, SVG/GIF/HTML, bozuk JPEG, > 50 MP, bilinmeyen alan, anahtarsız; EXIF silinir,
  oran kırpılır, 2400 px), yayınla/yayından kaldır, QR (bağımsız okuyucu `jsqr` ile geri çözülür), yardımcılar.
- Tarayıcı (build gerekir; `npm test`'e dahil değil):
  `npm run build && NODE_PATH=/opt/node22/lib/node_modules node tests/panel-browser.ts` — `next start` + Chromium 390 px
  (isMobile, touch): geçersiz linkler → isimleri değiştir → program satırı ekle/taşı/sil → fotoğraf yükle + kırp → hatalı son tarih
  yayını engeller → önizlemede isim ve foto → yayınla → QR ekran görüntüsünden çözülür = genel URL → genel sayfada isim ve foto →
  misafir yanıtı panelde → "Publish changes" → offline (404) → yeniden yayın → masaüstünde yan yana önizleme. 59 kontrol;
  ekran görüntüleri, `panel_flow_390.mp4` ve `checks.json` → `previews/g039/` (`PANEL_SHOTS_DIR`, `PORT` (3313), `PANEL_SLOWMO`).
  Test fotoğrafı: 03'ün kurgu GPT örnek fotoğrafı (`collections/03_Blush_Garden_Rose/assets/gpt/photos/hero_portrait.jpg`).

`components/panel/next-types.d.ts`: `next-env.d.ts` (build üretir, repoda yok) yokken `npm run typecheck` CSS modül tiplerini bulsun diye.

### Panel açık konuları

- Değiştirilen/silinen fotoğraflar depoda kalır (adaptörde `deletePhoto` yok) → G043'te öksüz dosya temizliği.
- Site başına yükleme kotası / hız sınırı yok (yalnız 256-bit anahtar sahibi yükleyebilir).
- Vercel fonksiyon gövde sınırı 4.5 MB: tarayıcı çıktısı ≤ 3.5 MB tutulur; sunucudaki 10 MB sınırı Vercel dışında geçerli.
  Supabase'de imzalı doğrudan yükleme (G043/G044) düşünülebilir.
- Şemada serbest metin "travel" alanı yok: Travel & stay = konaklama linki + `travel_stay` anahtarı. FAQ / guest policy metinleri de
  şemada yok (yalnız aç/kapa). İkinci isim eklenebilir ama silinemez.
- Düzenleme linki URL'de kalır (yer imi için); "yeni düzenleme linki üret" (anahtar yenileme) yok.
- Gerçek telefonda (iOS Safari / Android Chrome) denenmedi; yalnız Chromium mobil emülasyonu. HEIC yalnız onu çözebilen tarayıcıda
  (Safari) açılır; Chrome'da açık hata mesajı çıkar. QR telefon kamerasıyla okutulmadı (ekran görüntüsünden `jsqr` ile çözüldü).
- `local` adaptör tek süreçlidir; çakışma kontrolü (`baseUpdatedAt`) oku-karşılaştır-yaz, atomik değil (Supabase'de koşullu UPDATE).

## /start sahiplenme akışı (G045)

Etsy alıcısı indirdiği PDF'teki başlat linkini açar: `/start?theme=<tema>`. Sayfa İngilizce, telefon öncelikli (390 px),
panelle aynı sade araç görünümü (dekor çizimi yok, K21).

1. **Tema önizlemesi:** küçültülmüş canlı iframe (`/start/demo/<tema>`, 390 × 760 px içerik ölçeklenir) + "Open the full demo".
   Demo = temanın kendi şablonları + demo içeriği; ekran görüntüsü gerekmez, tema değişince önizleme de değişir.
2. **Form:** Etsy sipariş numarası, e-posta, ilk isimler (demo kaydında kaç isim varsa: 1 ya da 2), web adresi (isimlerden
   önerilir: "Avery" + "Jordan" → `avery-and-jordan`; dolu ise `-2` …; elle değiştirilebilir, canlı "Available" ipucu).
   Kurallar tarayıcıda ve sunucuda aynı (`lib/claim/fields.ts`).
3. **Oluştur:** taslak site = temanın demo içeriği, `record_kind: "customer"`, alıcının isimleri (`display_name` + `full_name`,
   `name_display`, monogram); diğer alanlar demo olarak kalır, alıcı panelde değiştirir. `orderRef` = sipariş no (yalnız rakam),
   `ownerEmail` = e-posta. Durum `draft`: genel adres yayına kadar 404.
4. **Sonuç ekranı:** düzenleme linki büyük (salt okunur kutu), "Save this link" uyarısı, **Copy link**, **Email it to myself**
   (`mailto:` — alıcının kendi posta uygulamasını açar; platform e-posta GÖNDERMEZ), **Open my editor** → `/edit/<slug>?k=…` (G039).
   Sonuç aynı sekmede `sessionStorage`'da tutulur (sayfa yenilenince link kaybolmaz); "Start another website" temizler.

Tema/demo yoksa: `/start` (temasız) ve geçersiz tema → dostça sayfa + sunulabilen tasarımların listesi. `internal` tema
(`_sample`) sunulmaz.

### Varsayımlar ve kurallar
- **Sipariş numarası biçimi (VARSAYIM, Etsy API ile doğrulanmadı):** Etsy'de "Order #1234567890" (makbuz numarası), yalnız
  rakam. Boşluk, `-`, `.`, baştaki `#` ve "Order"/"Order number:" atılır; kalan **8–12 ASCII rakam** olmalı (bugünkü numaralar
  10 hane; aralık iki yöne pay bırakır). Değiştirmek: `ORDER_NUMBER_MIN/MAX` (`fields.ts`).
- **Sipariş başına bir site:** aynı numara (biçimi farklı yazılsa da) ikinci kez → `409 order_used`, dostça mesaj:
  "A website has already been started with this order number. Open it with the edit link you saved … message the shop on Etsy".
  Yanıtta slug, e-posta, link ya da kayıt bilgisi **yok**; düz anahtar zaten saklanmadığı için yeniden gösterilemez.
  Aynı süreçte eşzamanlı denemeler sipariş no başına kilitle sıralanır (test: 6 paralel istek → 1 site).
- E-posta: basit biçim kontrolü (≤ 254), alan adı küçük harfe. İsim: harf içermeli, ≤ 40; görünmez/bidi karakterleri silinir.
- Adres: `lib/slug.ts` kuralları (3–48, ayrılmış adlar). Adres sonradan değiştirilemez (panelde slug değiştirme yok) — form bunu söyler.
- **Demo içeriği kaynağı:** önce `themes/<tema>/content.demo.json` (tema kendi demo kaydını taşır; tema varlık rotası `.json`
  servis etmez), yoksa `lib/claim/demo/<tema>.json` (koleksiyon kaydının kopyası; `collections/` platform dışında olduğundan
  statik `import` ile pakete girer). Şimdilik `blush-garden-rose` → `collections/03_Blush_Garden_Rose/content.demo.json`.
  Kopya kaynağından saparsa test kırılır. Demo kaydı geçerli olmalı ve `record_kind: "demo"` taşımalı; değilse tema sunulmaz (log).

### API

| İstek | Yanıt |
|---|---|
| `POST /api/start` `application/json`, ≤ 4 KB: `{theme, orderNumber, email, names: [a, b], slug?, website?}` | `201 {ok, slug, status:"draft", editUrl, editPath, siteUrl, emailSent}` · `400 invalid (+fields: orderNumber/email/name1/name2/slug)` · `400 bad_json` · `403 order_not_verified` · `404 theme_unavailable` · `409 order_used` · `409 slug_taken (+fields.slug, suggestion)` · `413` · `415` · `429 rate_limited/busy (+Retry-After)` · `503 verification_unavailable` · `500` |
| `GET /api/start/slug?value=<adres>` | `200 {ok, value, available, reason: null\|missing\|format\|reserved\|taken, message, suggestion}` · `429` |
| `GET /start/demo/<tema>[/<sayfa>]` | temanın sayfası demo içerikle (HTML); `internal`/bilinmeyen/demo'suz tema, `index` alt yolu → 404 |

Sıra (`lib/claim/claim.ts`): IP deneme sınırı → honeypot (`website` doluysa 400, kayıt yok) → tema → alan kontrolleri →
*(sipariş kilidi)* kullanılmış sipariş → doğrulayıcı → adres (yazılan dolu ise 409 + öneri; boşsa isimlerden ilk boş adres) →
oluşturma sınırları → `createSiteWithKeys` → e-posta arayüzü → 201. Yanıtlar `private, no-store`, `noindex`, `no-referrer`
(link gövdede). `/start` sayfası `noindex` + `referrer: no-referrer`. Demo sayfaları önizleme kipinde (`previewKey: "demo"`):
sayfalar arası linkler `/start/demo/<tema>/…?preview=demo` kalır, RSVP formu "preview" panelini gösterir ve gönderim yapmaz;
CSP site ile aynı (`frame-ancestors 'self'`).

**Hız sınırları** (`limits.ts`, `RateLimiter` arayüzü RSVP ile ortak; şimdilik süreç içi bellek): IP başına 10 deneme / 15 dk
(yanlış numaralar da sayılır → tahmin yavaşlar), IP başına 5 site / 24 sa, toplam 300 site / sa (Etsy doğrulaması kapalıyken
kötüye kullanım tavanı), adres ipucu IP başına 120 / 15 dk. G043 kalıcı limiter'ı `setClaimRateLimiter()` ile bağlamalı.

### Arayüz noktaları (kapalı / yok)
- **Etsy sipariş doğrulaması** (`verify.ts`): `OrderVerifier.check({orderNumber, email, theme})` →
  `not_checked | verified | rejected(reason) | unavailable`. Varsayılan `FormatOnlyVerifier` (dış kontrol yok).
  `CLAIM_ORDER_VERIFICATION=etsy` **uygulanmadı**: bilinçli olarak hata verir (sessizce atlamak yerine 500). Uygularken
  doğrulanacaklar dosyanın başında (mağazanın makbuzu, ödenmiş mi, alıcı e-postası erişilebilir mi, ilan → tema eşlemesi,
  çok ürünlü sipariş). Kodda `setOrderVerifier()` ile takılır.
- **Düzenleme linkini e-postayla gönderme** (`mailer.ts`, `docs/10` §3): `EditLinkMailer` + `DisabledMailer` (varsayılan,
  `enabled: false`). Sağlayıcı seçilince `setEditLinkMailer()`; arayüz "We will email your edit link" metnine kendiliğinden geçer.
  Gönderim hatası sahiplenmeyi bozmaz (site var, link ekranda) ve link log'a yazılmaz (test).

### Testler
- `tests/claim.test.ts` (node:test, 17 test): sipariş no / e-posta / isim / adres kuralları; tema + demo kaynağı (kendi dosyası,
  paket kopyası, internal/demo'suz/bozuk demo reddi, kopyanın koleksiyonla aynılığı); taslak içerik; 201 akışı (taslak, isimler,
  `orderRef`, e-posta, anahtar yalnız hash — veri klasöründe düz anahtar yok, link panel API'sini açıyor, genel adres 404);
  aynı sipariş → 409 ve sızıntı yok; 6 paralel istek → 1 site; adres (yazılan dolu → 409 + `-2` önerisi, boş → otomatik `-3`,
  ayrılmış/biçimsiz); alan/tema/honeypot reddinde dosya yazılmıyor; 415/413/400; hız sınırları; doğrulayıcı (kapalı varsayılan,
  `etsy` → hata, rejected 403 / unavailable 503 / verified 201); e-posta arayüzü (kapalı, sahte gönderici linki alır, hata 201'i
  bozmaz ve link log'a girmez); adres ipucu API'si; demo sayfaları.
- Tarayıcı (build gerekir; `npm test`'e dahil değil):
  `npm run build && NODE_PATH=/opt/node22/lib/node_modules node tests/claim-browser.ts` — `next start` + Chromium 390 px
  (isMobile, touch), fixture tema `sample-design` (= `_sample` kopyası + 03 demo kaydı): temasız/geçersiz link → canlı demo →
  boş gönderimde alan hataları → doldur (adres isimleri izler, "Available") → oluştur → büyük link + "Save this link" + kopyala
  (pano = link) → yenile (link duruyor) → **Open my editor → panel açılıyor** (isimler "Avery & Jordan", taslak) → aynı sipariş →
  dostça mesaj, sızıntı yok → dolu adres `-2`'ye kayıyor / "Use …" önerisi → masaüstü yan yana. Ekran görüntüleri,
  `start_flow_390.mp4` ve `checks.json` → `previews/g045/` (`CLAIM_SHOTS_DIR`, `PORT` (3314), `CLAIM_SLOWMO`).
  `platform/themes/blush-garden-rose` (G038) dalda varsa onun başlat sayfası ve paneli de çekilir; yoksa `checks.json`'da not.

### Açık konular
- **Birden çok sunucu örneği:** sipariş kilidi süreç içi. G043: `sites(order_ref)` üzerinde benzersiz indeks (sipariş numaraları
  için; seed'in `DEMO-SEED`'i hariç tutulabilir) ve ihlalin `order_used`'a çevrilmesi; kalıcı `RateLimiter`.
- **Vercel dosya izleme:** `/start`, `/start/demo/…`, `/api/start` (ve panel rotaları `/edit/[slug]`, `/api/edit/…`) temaları
  diskten okur; `next.config.ts` `outputFileTracingIncludes` şu an yalnız site rotalarını kapsıyor (G044'te eklenmeli; bu görevin
  yazma alanı dışında).
- **Kayıp link:** e-posta yok ve düz anahtar saklanmıyor → alıcı linki kaybederse kendisi kurtaramaz; mağazanın da aracı yok.
  E-posta sağlayıcısı veya yönetici "yeni düzenleme linki üret" aracı gerekir.
- **Çok ürünlü Etsy siparişi** (aynı siparişte iki tasarım): kural sipariş başına tek site; ikinci tasarım için Etsy API ile
  kalem bazlı kontrol gerekir.
- Etsy doğrulaması kapalıyken biçimi doğru herhangi bir numara bir taslak site açabilir (hız sınırları + honeypot dışında engel yok).
- Gerçek telefonda (iOS Safari / Android Chrome) ve Vercel'de denenmedi; yalnız Chromium mobil emülasyonu ve `next start`.

## Güvenlik özeti

- İçerik → HTML: yalnız metin düğümü/öznitelik değeri (parse5 serileştirici kaçışlar); `<script>`/`<style>` içine
  değer yazılmaz. JSON bloğu `<`, `>`, `&`, U+2028/2029 kaçışlı.
- URL'ler: link http/https/mailto/tel; foto http(s) veya kök göreli `/…` (`//`, `data:`, `javascript:` reddedilir).
- Başlıklar: CSP (`script-src 'self'` + tema satır içi betik hash'leri, `object-src 'none'`, `base-uri 'none'`,
  `frame-ancestors 'self'`), `nosniff`, önizlemede `noindex`/`no-store`/`no-referrer`.
- Statik rota: tema klasörü dışına çıkış, nokta dosyaları, `.html`/`theme.json` servis edilmez; SVG'ye ayrı CSP.
- Yüklemeler: tür dosya baytlarından (SVG/HTML reddedilir), 10 MB sınırı, rastgele dosya adı.

## Açık konular

- Supabase adaptörü, Vercel yayını (kullanıcı onayı) → G043–G044. Panelin (G039) ve `/start`'ın (G045) açık konuları yukarıda.
- Tema varlıkları şimdilik fonksiyon üzerinden servis ediliyor (CDN önbelleği `s-maxage`); trafik artarsa
  derlemede `public/` altına kopyalamak düşünülebilir.
- `local` adaptör tek süreç içindir. RSVP hız sınırı da süreç içi bellekte (`MemoryRateLimiter`); Vercel'de birden çok
  örnek olacağı için G043 kalıcı bir `RateLimiter` (Supabase tablo/RPC) yazıp `setRsvpRateLimiter()` ile bağlamalı.
- RSVP: yanıt silme/düzeltme yok (adaptörde `deleteRsvp` yok); çifte e-posta bildirimi yok (sağlayıcı seçilmedi);
  misafir verisi için gizlilik metni yayından önce gerekli.
