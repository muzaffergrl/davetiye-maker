# platform/ — düğün sitesi platformu (K24, G037 iskeleti)

Alıcının sitesi bizim platformumuzda yayınlanır ve panelden düzenlenir (`docs/10_SITE_PLATFORMU.md` tek kaynak).
Bu klasör: Next.js (App Router, TypeScript) uygulaması, **tema şablon motoru**, veri adaptörleri (`local`; ilk canlı sürüm için
Vercel Blob = `blob`, G048), site rotaları, içerik doğrulama, düzenleme paneli (G039), RSVP (G042), `/start` sahiplenme akışı (G045)
ve testler. Supabase (G043) satış hacmi artınca. G051: takvime ekle (`.ics` + Google Calendar), SSS (soru–yanıt) ve RSVP özel
soruları (aşağıda "Takvime ekle, SSS, RSVP özel soruları"). G055: paylaşım görseli + sekme ikonu, Vercel paket izleme, alıcı
fotoğrafı türevleri + `srcset`, içerik uzunluk sınırları (aşağıda "Platform cilası (G055)").

Durum: yerelde çalışıyor ve test edildi. G044 ile Vercel'de yayında (`blob` adaptörü, private depo; ayrıntı `docs/10` §2c);
inceleme düzeltmeleri (edca755) henüz yeniden yayınlanmadı (Git bağlantısı yok, push yayın yapmaz). Supabase projesi yok.

## Çalıştırma

Node ≥ 22.18 (TypeScript dosyaları `node` ile doğrudan çalışır; ek araç yok). Paket sürümleri sabit, `package-lock.json` commit'li.

```bash
cd platform
npm ci                 # bağımlılıklar
npm run seed           # demo site /clara-and-julian (blush-garden-rose teması, 03 demo içeriği + örnek fotoğraflar); DATA_ADAPTER'ın deposuna (local: .data/)
npm run dev            # http://localhost:3000/clara-and-julian
npm test               # node:test — motor, içerik, anahtar/slug, adaptör (local + blob), rotalar, RSVP, panel, düzenleme hakkı + arşiv (G060), /start, temalar, takvim, G055, satış sitesi (G061), seed (348 test, 2026-10-14; Windows dahil)
npm run typecheck      # tsc --noEmit
npm run build          # next build (Turbopack) + postbuild: scripts/trace-check.cjs (Vercel paketleri tema şablonlarını taşıyor mu)
npm run screenshot     # build sonrası: next start + Playwright 390 px kontroller (_sample) ve previews/*.png
NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme <id> [--stress] [--out <klasör>] [--compare w1|g035|none] [--no-video]
                       # build sonrası (G052): her tema — 5 genişlik, kısa telefonlar, akış, içerik, kart metni (uzayan kart piksel
                       # testiyle), kırpılan metin; --stress = docs/11 §12 zorlama kaydı; varsayılan tema blush-garden-rose → previews/g038/
                       # (+ MP4); G4NN → previews/g4NN/. Port $PORT (3312); port doluysa "Ready"siz durur, başka sunucuya karşı koşmaz
node scripts/reissue-edit-key.ts --order <no> --origin https://<host>   # destek: kayıp düzenleme linki yerine yenisi (aşağıda)
node scripts/grant-identity-change.ts --order <no> (--add <n> | --archive-on <YYYY-MM-DD|clear>) --reason "<neden>"   # destek (G060): isim/tarih
                       # hakkı ekle ya da arşiv tarihini taşı; --show durumu yazar (aşağıda "Panel v2 ve düzenleme hakkı")
NODE_PATH=/opt/node22/lib/node_modules node tests/g060-browser.ts   # build sonrası: panel v2 yolculuğu 390 × 844 + MP4, hak/arşiv/çevrimdışı/
                       # axe-core/1280 (104 kontrol; çıktı previews/g060/ ya da $G060_SHOTS_DIR)
NODE_PATH=/opt/node22/lib/node_modules node tests/final-smoke.ts [--theme <id>]   # build sonrası: son duman testi, 390 px — misafir (zarf → home →
                       # story → details → RSVP) + alıcı (/start → panel → foto → yayınla → QR → misafir yanıtı panelde); previews/final/
NODE_PATH=/opt/node22/lib/node_modules node tests/g051-browser.ts [--theme <id>]   # build sonrası: G051, 390 px — takvim düğmeleri + .ics,
                       # SSS akordeonu (dokun/klavye), RSVP özel soruları (evet/hayır, hata), CSV sütunları, panel düzenleyicileri (44 kontrol;
                       # ekran görüntüleri $G051_SHOTS_DIR, varsayılan geçici klasör; repodaki örnekler previews/g051/)
NODE_PATH=/opt/node22/lib/node_modules node tests/g055-browser.ts   # build sonrası: G055 — og:image/ikon, alıcı fotoğrafı srcset +
                       # ilk görünüm (DPR 3), Details kartı 3/7/10 satır ve home davet kartı (uzun isim/mekân, §12 zorlama) × 5
                       # genişlik, home tanıtımları 360/390, panel sınırları + sınırdan önce kaydedilmiş site (138 kontrol; çıktı $G055_SHOTS_DIR,
                       # varsayılan geçici klasör; boş port kendisi seçer, $PORT ile sabitlenir)
```

`npm run seed -- --theme <id> --slug <slug> --content <json> --draft` ile başka tema/içerik tohumlanır;
`--no-photos` yer tutucu hâli, `--photos <klasör>` başka örnek fotoğraflar (dosya adı = tema foto anahtarı).
Anahtarlar ekrana ve `.data/seed-keys.json`'a yazılır (`.data/` git'e girmez).
`npm run screenshot` geçici bir veri klasörü kullanır; global Playwright (`/opt/node22/lib/node_modules`) ve
`/opt/pw-browsers` tarayıcılarıyla çalışır, `playwright install` çalıştırmaz.

Ortam değişkenleri: `DATA_ADAPTER` (`local` varsayılan; `blob` = Vercel Blob, aşağıda; `supabase` = G043, yok),
`BLOB_READ_WRITE_TOKEN` (yalnız `blob`: **private** Blob deposunun anahtarı; Vercel depo projeye bağlanınca kendisi ekler; repoya
ve log'a yazılmaz), `PLATFORM_DATA_DIR` (varsayılan `platform/.data`; `blob`'da yalnız seed'in `seed-keys.json`'u),
`PLATFORM_THEMES_DIR` (varsayılan `platform/themes`), `PLATFORM_PUBLIC_URL` (sitelerin herkese açık kökü, ör. `https://<ad>.vercel.app`;
panelin yayın linki ve QR'ı, sayfaların mutlak `og:image`'ı ve takvim açıklamasındaki site linki için (G055); yoksa isteğin host'u —
`x-forwarded-host`'un **son** girdisi — proxy'nin yazdığı; istemci yalnız başa ekleyebilir — ya da `host`; `/<slug>/event.ics` site linki ve
UID'i de, G055 incelemesi). Üretimde tanımlanmalı: yoksa sunucu bir kez uyarı yazar.

## Klasörler

```
app/
  [slug]/route.ts                  /<slug>                → temanın index sayfası (kapalı zarf)
  [slug]/[page]/route.ts           /<slug>/home|story|details|rsvp
  [slug]/event.ics/route.ts        /<slug>/event.ics      → takvime ekle dosyası (G051; yayında değilse 404)
  themes/[theme]/[...path]/route.ts  tema CSS/JS/görselleri (html ve theme.json servis edilmez)
  media/[...path]/route.ts         adaptörün yüklediği fotoğraflar (local; blob = private depo)
  layout.tsx, page.tsx             platform sayfaları için kök
  edit/[slug]/page.tsx, not-found.tsx   /edit/<slug>?k=<anahtar> düzenleme paneli (G039, v2 G060); geçersiz link = genel 404 + "Lost your edit link?"
  api/edit/[slug]/…                panel API: durum, taslak kaydı, foto, yayınla, yayından kaldır, identity (isim/tarih, G060)
  signin/page.tsx, api/signin/     e-posta ile giriş (G060): sağlayıcı yok → kapalı, dürüst metin, API 503
  start/page.tsx, StartForm.tsx    /start?theme=<tema> sahiplenme sayfası (G045); start/demo/[theme]/… = temanın canlı demosu
                                   (+ start/demo/[theme]/event.ics: demonun takvim dosyası, G051)
  api/start/, api/start/slug/      sahiplenme API'si (POST) ve adres uygunluk ipucu (GET)
components/panel/                  panel v2 (G060): Panel (yönlendirme, diyaloglar), Setup (sihirbaz), views (Home/Edit/Guests/Share/Help),
                                   sections, fields, ui (düğme, rozet, snackbar, menü, hak sayacı), IdentitySheet, Sheet, PreviewPane,
                                   PhotosSection, kırpma, QR, usePanel (kayıt kuyruğu, yerel yedek) + panel.module.css (tokenlar)
lib/
  theme/engine.ts                  şablon motoru (işaretler aşağıda)
  theme/theme.ts                   theme.json okuma/doğrulama, sayfa şablonları
  theme/urls.ts                    URL güvenliği (link, foto, tema varlık yolu)
  theme/share.ts                   temanın paylaşım görseli / sekme ikonu var mı (G055; dosya ya da img/manifest.json)
  content/schema.ts                docs/03_URUN_ICERIK_SEMASI.json'ın birebir kopyası (test farkı yakalar)
  content/validate.ts              tools/validate_content.py'nin TS aynası (şema + iş kuralları)
  content/format.ts, derive.ts     "June 12, 2027", "4:00 PM", türetilmiş alanlar, sayaç UTC'si
  data/types.ts                    DataAdapter sözleşmesi;  data/local/ = JSON dosya uygulaması;  data/blob/ = Vercel Blob (G048)
  sites.ts                         site oluştur (anahtar + slug + doğrulama), yayınla, erişim kontrolü
  keys.ts, slug.ts, uploads.ts     anahtar hash'i, ayrılmış slug'lar, foto tür/boyut kontrolü (+ `photoSetFiles`: foto + türevleri, G055)
  photo-variants.ts                alıcı fotoğrafı türevleri (640/1280 px) — adlar, `srcset` adayları (G055; tarayıcıda da çalışır)
  site/render.ts, site/static.ts   rota mantığı, CSP ve diğer başlıklar;  site/ics.ts = /<slug>/event.ics (G051)
  calendar.ts                      takvime ekle (G051): etkinlik saatleri (saat dilimi + yaz saati), .ics (RFC 5545), Google Calendar linki
  panel/                           panel: model.ts (istemci+sunucu yardımcıları), api.ts, draft.ts, photos.ts (sharp), state.ts, http.ts,
                                   rights.ts (düzenleme hakkı + arşiv, G060), brand.ts, signin.ts
  qr.ts                            gerçek URL'den QR (uqr; tools/make_qr.py ayarları)
  claim/                           /start: fields.ts (istemci+sunucu kuralları), claim.ts, api.ts, themes.ts, demo-page.ts,
                                   verify.ts (Etsy doğrulama arayüzü, kapalı), mailer.ts (e-posta arayüzü, yok), limits.ts, demo/
themes/_sample/                    yalnız test iskeleti (tasarım DEĞİL); her işareti kullanır
themes/blush-garden-rose/          ilk gerçek tema (tasarım 03, G038) — aşağıda "Tema: blush-garden-rose"
themes/olive-ivory/                tasarım 01 Olive & Ivory (G401, docs/11 standardıyla) — ayrıntı: themes/olive-ivory/README.md
scripts/                           seed.ts, screenshot.cjs, theme-check.cjs, sync-schema.cjs, reissue-edit-key.ts, grant-identity-change.ts (G060)
tests/                             *.test.ts (node:test)
previews/                          _sample tohum sitesinin 390 px görüntüleri + checks.json; g039/ = panel akışı (PNG/JPG + MP4);
                                   g045/ = /start akışı; final/ = son duman testi (tests/final-smoke.ts, blush-garden-rose, 390 px);
                                   g051/ = takvim, SSS, RSVP özel soruları, panel düzenleyicileri (tests/g051-browser.ts, 390 px);
                                   g060/ = panel v2 yolculuğu 390 × 844 (MP4) + 1280/1000 (tests/g060-browser.ts)
previews/g038/                     blush-garden-rose: sayfa görüntüleri, G035 karşılaştırması, açılış MP4'ü, checks.json
previews/g401/                     olive-ivory: sayfa görüntüleri, compare_<sayfa>_390.jpg (W1 comp | tema), açılış MP4'ü,
                                   checks.json; final/ = final-smoke --theme olive-ivory
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
  publish(id, {expectedUpdatedAt}?)  // publishedContent := content, status := published; updatedAt beklenen değilse StaleSiteError
  unpublish(id)                  // status := draft (publishedContent kalır)
  updateKeys(id, {editKeyHash, previewKeyHash})   // düzenleme linki yenilendi (eski link ölür)
  deleteSite(id)                 // site + RSVP + fotoğraflar
  saveRsvp(siteId, input), listRsvps(siteId)   // input.held → kayıt "beklemede" (yoğunluk, aşağıda RSVP)
  deleteRsvps(siteId, ids), setRsvpsHeld(siteId, ids, held)   // yalnız o sitenin yanıtları
  savePhoto(siteId, {bytes, width?, variants?})  // assertImageUpload: JPG/PNG/WebP/AVIF, ≤ 10 MB, tür baytlardan;
                                 // width + variants (G055) → <rastgele>-<W>w.<uzantı> + türevleri (önce türevler); dönüş .variants
  readPhoto?(path)               // /media/... üzerinden servis eden adaptörler (local, blob)
}
```

Hatalar: `SlugTakenError`, `NotFoundError`; `OrderRefTakenError` (sipariş no dizini olan adaptör — `blob` — aynı `orderRef`'le
ikinci siteyi reddeder; `/start` bunu `409 order_used`'a çevirir; `local` kontrol etmez), `WriteConflictError` (`blob`: eşzamanlı
yazanlar her denemede önde kaldı), `StaleSiteError` (`publish` beklenen sürümü bulamadı: arada kayıt geldi; hiçbir şey yazılmaz).
`updatedAt` her yazışta kesin artar (`nextTimestamp`; aynı milisaniyede iki yazı da farklı değer alır). Site kaydı isteğe bağlı
`claimTokenHash` taşır (`/start` yeniden deneme belirteci, yalnız SHA-256).

Kurallar: adaptör yalnız depolamadır; anahtar üretimi, slug kuralı ve içerik doğrulaması `lib/sites.ts`'te.
Düz anahtar asla saklanmaz. Dönen kayıtlar kopyadır. Supabase şeması (G043) şu alanları taşımalı:
`sites(id, slug unique, theme, variant, status, content jsonb, published_content jsonb, edit_key_hash,
preview_key_hash, order_ref, owner_email, created_at, updated_at, published_at)`,
`rsvps(id, site_id, name, email, attending, guests, message, answers jsonb (G051, null olabilir), created_at)`.
(`docs/10` §2'deki tabloya `published_content`, `preview_key_hash`, `published_at` eklendi.)

`local` uygulaması: `.data/sites/<id>.json`, `.data/slugs/<slug>.json` (O_EXCL ile benzersizlik),
`.data/rsvps/<siteId>.json`, `.data/uploads/<siteId>/<rastgele>.<uzantı>` (G055: `<rastgele>-<genişlik>w.<uzantı>` + `-640w`/`-1280w`
türevleri). Atomik yazma, süreç içi kilit.
Tek sunucu süreci içindir; canlı kullanım için değildir.

### `blob` adaptörü (G048, `lib/data/blob/`) — ilk canlı sürüm, Supabase'siz

`DATA_ADAPTER=blob` + `BLOB_READ_WRITE_TOKEN`. `@vercel/blob` **2.8.0** (sabit). Bütün veri **tek, private** bir Vercel Blob deposunda:

```
sites/<id>.json                           SiteRecord + "version" (her yazışta +1)
slugs/<slug>.json                         {"id"}   allowOverwrite:false ile yazılır → slug benzersiz
orders/<sipariş no>.json                  {"id"}   aynı kural → sipariş başına tek site (olağan dışı ref → "h-<sha256>")
rsvps/<siteId>/<ms>-<sıra>-<rsvpId>.json  her RSVP ayrı dosya (oku-değiştir-yaz yok → misafirler birbirini ezmez)
media/<siteId>/<rastgele32hex>.<uzantı>   fotoğraflar; ziyaretçiye /media/<siteId>/<dosya> rotasından (readPhoto)
                                          (G055: <rastgele32hex>-<W>w.<uzantı> + -640w / -1280w türevleri)
```

- **Benzersizlik:** önce dizin dosyası "varsa yazma" ile yazılır (SDK `allowOverwrite: false`; var olan yol `BlobError` →
  dosya okunup doğrulanır → "alınmış"), sonra site. Site yazılamazsa dizinler `ifMatch` ile geri silinir. Çöken bir örneğin
  bıraktığı, sitesi olmayan dizin 15 dk sonra geri alınır (bir Vercel fonksiyonunun en uzun çalışma süresinden fazla: hâlâ
  süren bir oluşturmanın dizini elinden alınmaz). SDK'nın kendi yeniden denemesinde kendi dizinimiz "alınmış" sayılmaz.
- **Sürüm / iyimser kilit:** güncelleme = oku (ETag) → değiştir → `put(ifMatch: ETag)`. Arada başkası yazdıysa
  `BlobPreconditionFailedError` → taze veriyle yeniden (en çok 6 deneme, artan bekleme) → yine olmazsa `WriteConflictError`.
  Aynı süreçte aynı siteye yazılar ayrıca sıraya girer. Silinmiş site yanlışlıkla geri yazılmaz (ETag tutmaz → `NotFoundError`).
  Gerçek depoda görülen iki ayrıntı (testlerde taklit edilir): büyük (sıkıştırılan) JSON okumaları **zayıf ETag** (`W/"…"`) döner,
  `ifMatch` güçlü biçimi ister → `readJson` `W/`'yi atar (G044); aynı dosyaya iki koşullu yazma üst üste binince servis 412 yerine
  düz `BlobError("… conflicting operation …")` döner → `mutate` ve `claimIndex` bunu da kaybedilmiş yarış sayıp yeniden dener (G049).
- **Önbellek:** JSON okumaları `useCache: false` (CDN kopyası üzerine yazmadan sonra 60 sn'ye kadar eski kalabilir; private
  depoda doğrudan kaynaktan okunur). Fotoğraflar değişmez (rastgele ad) → CDN'den okunabilir.
- **Gizlilik:** site kaydı (anahtar hash'leri, sahip e-postası, taslak) ve RSVP'ler misafir verisi → depo **private olmalı**.
  Depo erişimi (public/private) depo **açılırken** seçilir; tek depoda ikisi birlikte kullanılamadığı varsayıldı (belgeler depo türü
  olarak anlatıyor; karışık kullanım denenmedi). Bu yüzden fotoğrafların doğrudan public Blob URL'si yok: ziyaretçi `/media/...`
  rotasından alır (yalnız yayındaki içeriğin kullandığı fotoğraf, `Cache-Control: public, max-age=300`; aşağıda "Fotoğraflar"). Bedeli: önbellekte olmayan her foto isteği bir fonksiyon
  çağrısı + Blob okuması. Hacim artarsa: ayrı public foto deposu (ikinci token) ya da imzalı URL.
- **Token** yalnız `lib/data/index.ts`'te ortamdan okunur, adaptörde private alanda durur (`inspect`/`JSON.stringify`'da görünmez),
  hata mesajlarına girmez. Token yoksa `DATA_ADAPTER=blob` açık bir yapılandırma hatası verir (500). Vercel OIDC + `BLOB_STORE_ID`
  SDK üzerinden çalışır (denenmedi).
- **Maliyet / hız (düşük hacim için yeterli):** sayfa görüntüleme = 2 kaynak okuması (slug + site); RSVP listesi = 1 `list` + RSVP
  başına 1 okuma (8'li paralel); misafir yanıtı = liste (çift gönderim kontrolü) + 1 yazma. `list` "gelişmiş işlem" olarak
  ücretlenir. Satış hacmi artınca G043 (Postgres).
- **Seed:** `DATA_ADAPTER=blob BLOB_READ_WRITE_TOKEN=… npm run seed` aynı depoya yazar; anahtarlar yerel `.data/seed-keys.json`'a.
  Seed sitelerinin sipariş referansı `DEMO-SEED-<slug>` (blob sipariş referansını tekil tutar).

Testler: `tests/adapter.test.ts` sözleşme testleri **iki adaptörde de** koşar (local = geçici klasör, blob = `tests/fake-blob.ts`
bellek içi SDK sahtesi). `tests/blob-adapter.test.ts` (23 test): sahtenin istemci tarafı hatalarının gerçek SDK 2.8.0 ile birebir
aynı olduğu, üzerine yazma/ETag/kimlik/list sayfalama davranışı; birden çok sunucu örneğinde slug ve sipariş yarışı (tek kazanan,
artık dizin yok), başarısız yazmada dizinlerin geri alınması, öksüz dizin, kayıp yanıt; sürüm çakışması (eşzamanlı yazanlar,
araya giren yazma, sürekli çakışma → `WriteConflictError`, silinmiş site); `useCache:false` (gecikmeli CDN kopyası servis edilmez);
RSVP (her biri ayrı dosya, 3 örnekten eşzamanlı 30 yanıt, sayfalı liste, aynı milisaniye sırası); foto (private, `media/`, okuma);
her çağrı private + token'lı, token görünmez; `getDataAdapter` seçimi; `/start` yarışı → `409 order_used`; yayın → misafir RSVP →
çift özeti/CSV; seed. Sahtenin kasıtlı bozulmalarla (önbellek, üzerine yazma, ETag'siz yazma, sıralama, sayfalama) testleri
kırdığı kontrol edildi.

**Gerçek Vercel Blob'da denendi (G044, G049)** — `npm test` yalnız bellek içi sahteyle koşar; gerçek depo için iki betik var
(aşağıda "Canlı kontroller"). Gerçek depoda doğrulanan: sunucu var olan dizinin üzerine yazmayı (`allowOverwrite: false`) ve bayat
`ifMatch`'i reddediyor; iki örnekten eşzamanlı slug/sipariş yarışında tek kazanan; 2 örnek × 8 eşzamanlı güncellemede kayıp yazma yok
(sürüm = 1 + başarılı yazma); 10 eşzamanlı RSVP yazmadan hemen sonra `list`'te; token'sız blob URL'si 403 (depo private).
Hâlâ varsayım: atomikliğin gerçek eşzamanlılıkta her zaman tutması (servisin sözü), `del` + `ifMatch`'in yok olan dosyada davranışı.

### Canlı kontroller (`scripts/live-check.mjs`, `scripts/blob-smoke.mjs`; G049)

Yayından sonra, `platform/`'dan (`vercel link` sonrası `.env.local`'da `BLOB_READ_WRITE_TOKEN` olur; değerler hiçbir yere yazdırılmaz):

```bash
node --env-file=.env.local scripts/live-check.mjs --base https://<canlı adres>   # okuma + geçici sitede yazma yolu
node --env-file=.env.local scripts/blob-smoke.mjs                                # gerçek private depoda adaptör varsayımları
```

- `live-check`: demo sitenin 5 sayfası + CSP, `og:image` (mutlak, bu sitede), `/event.ics`, `/media` fotoğrafları, tema varlığı,
  RSVP durumu, yanlış anahtarlı panel 404; `DEMO_EDIT_KEY` verilirse panel sayfası (`X-Frame-Options: DENY`, `no-referrer`) ve panel
  API'si; `LIVE_THEMES` (varsayılan `blush-garden-rose,olive-ivory`) için `/start?theme=` + `/start/demo/<tema>` sayfaları ve `.ics`.
  Token varsa (ve `--no-write` yoksa) geçici bir taslak sitede: taslak 404 → panel kaydı → bayat kayıt 409 → foto yükleme (yayınlanmamış
  foto önizleme anahtarı olmadan 404, anahtarla 200 `no-store`) → yayın → sayfada değişiklik → misafir RSVP → çift listesi + CSV →
  `/start` sahiplenme 201 + aynı sipariş 409; geçici siteler `finally`'de silinir. Ortam: `LIVE_BASE_URL`/`PLATFORM_PUBLIC_URL`
  (ya da `--base`), `DEMO_SLUG`, `DEMO_EDIT_KEY`, `LIVE_THEMES`. Not: `/start` IP başına günde 5 site sınırı (süreç içi) var; aynı
  makineden art arda çok koşturmak 429 verebilir.
- `blob-smoke`: yukarıdaki gerçek-depo doğrulamaları; yalnız `smoke-<zaman>-*` / `SMOKE<zaman>` yollarına yazar ve siler.
- Çıkış kodu 0 = hepsi geçti. Windows'ta çalışır (Node 22, `.env.local`).

## Tema biçimi

```
themes/<id>/theme.json      {"id","name","version","internal"?, "pages": {"index": "index.html", "home": …},
                             "photos": {"<anahtar>": {"label","source": "media.hero_portrait","aspect": "4/5"}}}
themes/<id>/*.html          sayfa şablonları (index zorunlu; home, story, details, rsvp isteğe bağlı)
themes/<id>/…               CSS, JS, görseller (css js mjs png jpg jpeg webp avif gif svg ico mp4 webm)
themes/<id>/img/og-1200x630.jpg, img/favicon.png   paylaşım görseli + sekme ikonu (build_images.py; varsa motor etiketleri yazar, G055)
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
// data.derived    {date_display, date_long, date_weekday, ceremony_time_display, rsvp_deadline_display,
//                  venue_city_region, venue_city_region_country, countdown_target_utc}
```

**İçerik kaydı ve foto haritası bilerek YOK** (önceden `data.content` / `data.photos` vardı): çiftin kapattığı bölümler (hikâye
fotoğrafları ve metni, registry/otel linki, dress code) sayfa kaynağında görünüyordu. Tema JS'i kişisel metin yazmaz (sunucu yazdı);
ihtiyaç duyulan her şey `derived`'da. Yeni bir tema JS'te içerik isterse önce `optional_blocks`'a göre süzülmüş alan buraya eklenir.
Şablondaki HTML yorumları (görev numaraları, üretim notları) çıktıdan silinir.

## İşaret başvurusu (`lib/theme/engine.ts`)

Bütün değerler **metin** olarak eklenir (HTML kaçışlı); içerikten asla etiket/öznitelik/betik oluşmaz.
Yollar noktalıdır: `venue.name`, `schedule.0.time`, `story.items.1.caption`.

| İşaret | Etki |
|---|---|
| `data-field="yol"` | Öğenin içi = değer. ISO tarih alanları (`date`, `rsvp.deadline`) → `May 15, 2027` (en-US) / `15 May 2027`; saat alanları (`ceremony_time`, `schedule.*.time`) → `4:00 PM` / `4:00 pm`. Değer yoksa öğe boşalır ve `data-empty` alır |
| `data-field` + `<img>` | `src` = foto URL'si (http(s) veya `/media/…`); yer tutucunun `srcset`'i ve `<picture>` içindeki `<source>`'lar kalkar. Türevli alıcı fotoğrafında (G055, `/media/…/<hex>-<W>w.jpg`) `srcset` = 640/1280 türevleri + foto, `sizes` = şablonunki (slotun CSS genişliği), yoksa `loading="lazy"`'de `auto, 100vw`, değilse `100vw`; eski tek dosyalı fotoda `srcset`/`sizes` yok. Foto yoksa tema yer tutucusu kalır. `data-photo-state="user|placeholder"` hem `img`'ye hem en yakın `[data-slot]` atasına yazılır |
| `data-field="urls.*"` + `<a>` | `href` = URL (yalnız http/https/mailto/tel; `target` varsa `rel="noopener noreferrer"`). Yoksa `href="#"` + `data-url-missing` + `aria-disabled="true"`. Link metni korunur |
| `data-format="…"` | `date`, `date-long` (Saturday, May 15, 2027), `weekday`, `month`, `day`, `year`, `time`, `raw` (biçimsiz); ayrıca `amp`: her `&` → `<span class="amp">&amp;</span>` (script yazı tipi kuralı) |
| `data-text="Our Story · {name_display}"` | Öğenin içi = şablon; `{yol}` veya `{yol\|biçim}`. `<title>` için de çalışır |
| `data-photo="anahtar"` | `theme.json` `photos.<anahtar>.source` yolundaki foto; `<img>` → `src`, diğer öğeler → `style="--photo: url(…)"` |
| `data-url="map"` | `<a>` `href` = `urls.map` (kurallar `data-field="urls.*"` ile aynı) |
| `data-optional="anahtar"` | `optional_blocks.anahtar === true` değilse öğe **kaldırılır**. `<html>`/`<body>` üzerindeyse sayfa 404 |
| `data-if="yol"` / `data-if="!yol"` | Değer boş değilse (boşsa) öğe kalır; `<body>` üzerinde sayfa düzeyinde çalışır |
| `data-repeat="schedule"` | Öğe listedeki her eleman için çoğaltılır; içeride `.time`, `.label`, `data-if=".location"` göreli yollar. Boş listede öğe kalkar. Kopya `data-repeat-item="schedule.2"` alır |
| `data-attr-<ad>="yol"` | Öznitelik = ham değer (ör. `datetime`); `{…}` içeriyorsa şablon. İzinli adlar: `alt`, `title`, `content`, `aria-label`, `datetime`, `value`, `placeholder`, `data-*` (motor işaretleri hariç). Yer tutucu gösteren foto `<img>`'sinde `data-attr-alt` uygulanmaz (`alt=""`, süs) |
| `data-calendar="ics\|google"` | (G051) Yalnız `<a>`. `ics` → `href="/<slug>/event.ics"` (önizlemede `?preview=` ile), `google` → Google Calendar şablon linki (`target` varsa `rel="noopener noreferrer"`). İçerikte okunur tarih yoksa öğe **kaldırılır**; bilinmeyen değer ya da `<a>` dışı öğe → uyarı + kaldırılır |

Türetilmiş alanlar (`data-field` ile kullanılabilir): `date_weekday`, `date_long`, `venue.city_region`,
`venue.city_region_country`, `countdown_target_utc`.

Çıktıda `data-field` / `data-if` yolları mutlak yola çevrilir (panel canlı önizlemesi için). Önizlemede platform fotoğrafları
(`/media/…`) `?preview=<anahtar>` alır (yayında olmayan foto herkese açık değil).
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
  G047). Şablonda yalnız `data-photo="<anahtar>"`; foto yoksa temanın nötr yer tutucusu (`img/ph_<anahtar>-*.webp`);
  "Your photo here" etiketi **yalnız önizlemede** (`html[data-preview="true"]`: panel, `?preview=`, tema demosu) — misafir yazıyı
  görmez. Alt metin içerikten (`data-attr-alt`: "Photo of {name_display}", hikâye başlıkları, mekân adı). Yüz kırpımı `object-position`
  ile (portre %38, kemer %40).
- **Link blokları** (inceleme düzeltmesi): "View map", "Where to stay" (Travel & Stay bloğu) ve "View registry" (Registry bloğu)
  yalnız linkleriyle görünür (`data-if="urls.*"`); canlı sitede "link will be added soon" diyen ölü düğme yok. Travel notu artık
  şemanın tutamadığı "ipuçları" vaat etmiyor ("Where to stay and how to get here: see the link below.").
- **Yanıtlar başka yolla** (`rsvp.method` dolu, panelde "Accept replies on the website" kapalı): RSVP sayfası 404
  (`<body data-if="!rsvp.method">`), "Kindly reply by"/RSVP düğmeleri, ana sayfa tanıtımı ve nav linki kalkar.
- **Kısa telefonlar** (360×640, Safari 375×553, panel önizlemesi 390×690): boyalı sahne neredeyse bütün görününce köşe şakayıkları
  ortadaki yazıya değiyordu; en-boy 1/2–9/16 arasında arka plan %115, 9/16–3/4 arasında %135 ortadan büyütülür. "Replay the opening"
  yumuşak bir zemin (`.btn-ghost` gibi) ve 44 px dokunma alanı aldı; Skip ve "Replay the envelope" linkleri de ≥ 44 px.
- **G051:** "Add to your calendar" — davet kartının altında (home) ve Order of the Day kartının altında (details) iki küçük `.btn-ghost`
  hap: "Apple / Outlook" (`data-calendar="ics"`) ve "Google" (`data-calendar="google"`, yeni sekme); Details'te mekândan sonra
  **Questions & Answers** (`data-optional="faq" data-if="faq"`, `<details data-repeat="faq">`: JS'siz açılır-kapanır, 1 px altın çizgiler,
  "+" → "×" yazı glifi — `content: "+" / ""` ile erişilebilir ada girmez; yanıtta satır sonu korunur); RSVP formunda konuk sayısının altında çiftin soruları (`.questions`,
  `data-rsvp-if-attending`: "Will you attend?" ile aynı haplar / kısa yanıt kutusu). Yeni görsel yok: başlık Great Vibes, ayraç GPT
  `divider` parçası; sıralama `MOTION` (`home-invite.cal`, `details-card.cal`, `details-faq`).
- **RSVP teşekkürü:** yanıt gönderilince alttaki kapanış ("Thank you / We can't wait to celebrate with you.") gizlenir (site.js
  `rsvp:state` → `html[data-rsvp-replied]`): katılmayan misafire çelişen, katılana tekrar eden metin yok.
- **site.js:** `#site-data` varsa kişisel metne dokunmaz; sayfa adresleri `data.pages`, sayaç hedefi
  `data.derived.countdown_target_utc`, eksik link bildirimi `a[data-url-missing]`. `#site-data` yoksa (tema dosyaları
  statik sunucuda) `DEV_CONTENT` + küçük bir tarayıcı içi işleyici aynı işaretleri doldurur — yalnız tasarım önizlemesi.
  Koreografi (`MOTION`), Skip, reduced motion, view transition, geri dönüşte açık zarf + "Replay" G035 ile aynı.
- **G035'ten farklar:** mekân fotoğrafı GPT yatay çerçevede (CSS kemer kırpma + çiçek kümeleri yerine); kapalı zarfın
  kapağı ayrı katman (`env_cflap`, tırtıklı kenarı izlenerek kesildi) ve açılışta menteşesinde 3D kalkıyor, sonra açık
  kapak devralıyor (önceden kapalı zarf açık gövdeye eriyordu); oturum anahtarları site başına; 4+ program satırında
  kart sıkışık düzene geçiyor; **G055:** Order of the Day kartı (ve G055 incelemesiyle home davet kartı: uzun tam ad, host line,
  mekân) içerikle uzuyor (10 satır, uzun etiket/yer, dress code) — GPT
  kartı docs/11 §9 3 dilim kesimiyle: üst %0–42 `<img>` (kırpılmış), düz kâğıt bandı %42–66 `::before` (dikeyde gerilir), alt
  %66–100 `::after`; metin akışta, en çok görüntünün %72 satırına iner; kart görüntünün kendi boyundan kısa olmaz (ayrıntı ve
  ölçüm aşağıda "Platform cilası (G055)"); RSVP sayfasında G035'in "preview only"
  düğmesi yerine platform formu (G042 sözleşmesi: `/rsvp/form.js`, `data-rsvp-*`, `method="post"`) — kartın RSVP
  düğmesi forma kaydırır, teşekkür/kapalı/hata/önizleme panelleri temanın tipografisinde.
- **Görseller:** `python3 platform/themes/blush-garden-rose/build_images.py` (GPT parçaları → `img/`, önce
  `tools/parts_prep.py`; pencerelerin tam şeffaflığını ve görünür #00FF00 kalmadığını kendisi denetler).
- **Doğrulama:** `tests/theme-blush-garden-rose.test.ts` (20 test; G051: takvim linkleri, SSS akordeonu + kapalıyken kaynakta yok,
  özel sorular formda; ayrıca: kapalı bölümler hiçbir sayfa kaynağında yok, yanıtlar
  kapalıyken RSVP yok, önizleme-dışı etiket, alt metin, yorum yok; alanlar = içerik kaydı, içerik değişikliği, foto
  durumları, isteğe bağlı bloklar, linkler, RSVP form sözleşmesi, önizleme anahtarı, site.js sözleşmesi, gerçek rotalar +
  RSVP API'siyle kayıt; inceleme: tam ad yoksa davet kartında ilk ad, geri sayımda CSS çerçeve yok) ve
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
Uzunluk sınırları (G055) şemada: isimler (`partners[].display_name`/`full_name`) ≤ 40, isim satırı `name_display` ≤ 85, mekân adı
≤ 80, program ≤ 10 satır; `CONTENT_LIMITS` (`lib/content/limits.ts`: düz sayılar — `/start`'ın tarayıcı paketine şema ve doğrulayıcı
girmesin diye) panel ve `/start` içindir; `validate.ts` aynı sınırları şemadan `SCHEMA_LIMITS` olarak okur, `tests/g055-review.test.ts`
ikisinin eşitliğini sınar (şema değişip `limits.ts` değişmezse `npm test` kırılır). Karakter sayısı
kod noktası (`[...s].length`, Python `len`); eşlik `tests/g055-limits.test.ts`'te.

Taslak kayıt geçersiz olabilir (panelde yazarken); `publishSite()` geçersiz içeriği yayınlamaz: doğruladığı sürümü
`adapter.publish(id, {expectedUpdatedAt})` ile yayınlar, arada gelen otomatik kayıt doğrulanmadan yayına giremez (yeniden okur ve
doğrular; panelden `expectedUpdatedAt` verilirse 409). Test: `adapter.test.ts` yarış testi (eski davranışla 20/20 turda geçersiz
içerik yayına giriyordu).

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
| `[data-rsvp-error-for="<alan>"]` | O alanın hata metni (sunucunun ve tarayıcıdaki ön kontrolün aynı İngilizce mesajı); alan `aria-invalid="true"` ve `aria-describedby` = bu öğe (id yoksa betik verir) alır, yazınca temizlenir. Yoksa tarayıcının kendi doğrulama balonu kullanılır |
| `[data-rsvp-if-attending]` | Misafir "no" seçince gizlenir, içindeki alanlar devre dışı (ör. guests) |
| `[data-rsvp-reply="yes\|no"]` | Yalnız misafirin cevabı buysa görünür (success panelinde katılan/katılmayan için ayrı teşekkür) |
| `[data-rsvp-again]` | Formu sıfırlayıp yeniden açar (aynı aileden ikinci yanıt) |
| `[data-rsvp]` | İsteğe bağlı kapsayıcı: paneller bunun içinde aranır (yoksa bütün sayfa). Sayfada birden çok form varsa zorunlu |
| `data-rsvp-reason` (betik yazar) | `closed` durumunda formda ve `[data-rsvp]`'de: `deadline` (son tarih geçti) ya da `disabled` (çift yanıtları başka yoldan topluyor) — tema iki durum için farklı başlık gösterebilir ("Replies are closed" yalnız `deadline` için doğru) |
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
- Tarayıcının kendi doğrulama balonu kapalı (`form.noValidate`): gönderimde betik alanları kontrol eder, sunucuyla aynı mesajları
  temanın `[data-rsvp-error-for]` yerlerine yazar, ilk hatalı alana odaklanır, hiçbir şey göndermez (yer yoksa o alan için balon).
- `site-data.slug` düz bir adres değilse (tema demosu `/start/demo/<tema>`: `start/demo/…`) durum sorgusu yapılmaz (404 ve konsol
  hatası yok); demo zaten önizleme kipinde.
- Satır içi olay özniteliği, `innerHTML`, `eval` yok; yalnız `fetch` (CSP `connect-src 'self'`).
- Tema 03'ün G035 kaynağındaki "preview only" RSVP düğmesi (`data-field="urls.rsvp_form"`) bu formla değiştirilir.
- **Özel sorular (G051):** her sorunun kabı `data-rsvp-question="<id>"` taşır (tema bunu içerikten yazar:
  `data-repeat="rsvp.questions"` + `data-attr-data-rsvp-question=".id"`); betik kabın içindeki girişlere `name="answer:<id>"` verir
  (tema içerikten `name` yazamaz) ve cevapları `answers: {<id>: değer}` olarak gönderir — **yalnız etkin girişlerden**: sorular
  `[data-rsvp-if-attending]` içindeyse "no" diyen misafirin cevabı gitmez. Hata yeri `data-rsvp-error-for="answer:<id>"`
  (tema: `data-attr-data-rsvp-error-for="answer:{.id}"`). Seçenekli soru = radyolar (`data-repeat=".options"`, `data-attr-value="."`),
  kısa yanıt = `<textarea maxlength="300">`; hangisinin görüneceği `data-if=".options"` / `data-if="!.options"` ile (iş kuralı:
  `choice` ≥ 2 seçenek, `text` seçeneksiz). Örnek: `themes/blush-garden-rose/rsvp.html`.

### API

Misafir tarafı (herkese açık, yalnız JSON):

| İstek | Yanıt |
|---|---|
| `GET /api/rsvp/<slug>` (`?preview=<önizleme anahtarı>` taslağı okur) | `200 {ok, open, reason: null\|"deadline"\|"disabled", message, closesAt, deadline: "April 3, 2027", maxGuests, preview}` · `404` |
| `POST /api/rsvp/<slug>` `Content-Type: application/json`, ≤ 8 KB: `{name, email, attending, guests, message, answers?, website}` | `200` success · `400` invalid (+`fields`) · `403` closed · `404` · `413` · `415` · `429` (+`Retry-After`) · `500` |

Gövde her zaman `{ok, state: "success"|"closed"|"error", code?, message, fields?}`. Kurallar (`lib/rsvp/`):
- `name` zorunlu, ≤ 120; `email` isteğe bağlı (biçim kontrolü); `attending` yes/no; `guests` katılıyorsa
  1..`maxGuests` (boşsa 1), katılmıyorsa **0** saklanır; `message` ≤ 500. Kontrol karakterleri ve bidi işaretleri silinir.
- `maxGuests`: tema `theme.json` → `"rsvp": {"max_guests": N}` (1..20); yoksa 10. (Fixture: 6.)
- **Son tarih:** `rsvp.deadline` gününün **sonu**, sitenin `timezone`'unda (ertesi gün 00:00; o gece saat 00:00'da ileri alınıyorsa —
  Asia/Beirut, Africa/Cairo — 01:00, hiç erken değil: `zonedTimeToUtc` Temporal "compatible" kuralı). Saat dilimi geçersizse
  UTC-12 (kimse erken geri çevrilmez). `rsvp.method: "none"` → form kapalı (`reason: "disabled"`).
- **Özel sorular (G051):** `answers` = `{<soru id>: değer}`; sorular yayındaki içeriğin `rsvp.questions`'ı. `choice` → seçeneklerden biri
  (yoksa `400`, `fields["answer:<id>"]` = "Please choose one of the options."), `text` → ≤ 300 karakter (`ANSWER_MAX`). Cevaplamamak
  serbest (zorunlu soru yok); bilinmeyen id yok sayılır. Sorular **katılan** misafire: `attending: no` → cevap saklanmaz. Kayıt
  `answers: [{id, question, answer}]` (soru metni o anki hâliyle; yalnız cevaplananlar; hiç yoksa alan yok → eski kayıtlarla aynı biçim).
  Çift gönderim kontrolü cevapları da karşılaştırır.
- Honeypot doluysa normal success cevabı döner, **kayıt yapılmaz**.
- Aynı yanıt 5 dakika içinde yeniden gelirse bir kez saklanır (çift tıklama / yeniden deneme).
- **Hız sınırı** (`config.ts`, IPv6 /64 olarak): **site + IP** başına 30 POST / 15 dk (geçersizler dahil; aynı Wi-Fi'dan başka
  düğüne yanıt etkilenmez), IP başına bütün siteler için 100 POST / 15 dk (kötüye kullanım tavanı) → `429 rate_limited`.
- **Yoğunluk misafiri kilitlemez:** site başına 200 saklanan yanıt / saat veya bir IP'den o siteye 10 yanıt / saat aşılınca yanıt
  reddedilmez, **beklemede** (`held: true`) saklanır: misafir normal teşekkürü görür, sayılara ve CSV'ye girmez; çift panelde
  "Keep" / "Remove" ile karar verir. Yalnız site başına 500 bekleyen / gün dolunca `429 busy`. (Önceden 200 sahte yanıt gerçek
  misafirleri bir saat kilitliyordu ve sahteler silinemiyordu.)
  `RateLimiter` arayüzü (`lib/rsvp/rate-limit.ts`); şimdilik süreç içi bellek (`MemoryRateLimiter`) — Vercel'de örnek başına (aşağıda).
  IP: `x-forwarded-for` ilk değeri, yoksa `x-real-ip` (Vercel bunları kendisi yazar; başka proxy'de aynısı sağlanmalı).

Çift tarafı (düzenleme anahtarı: `Authorization: Bearer <anahtar>` tercih; indirme linki için `?k=<anahtar>`):

| İstek | Yanıt |
|---|---|
| `GET /api/rsvp/<slug>/responses` | `200 {ok, site: {slug, status}, window: {open, reason, closesAt, deadlineDisplay}, counts: {responses, attending, notAttending, totalGuests}, responses: [{id, name, email, attending, guests, message, answers: [{id, question, answer}], createdAt}]}` — yeniden eskiye |
| `GET /api/rsvp/<slug>/export` | `text/csv`, `attachment; filename="rsvps-<slug>-<YYYY-MM-DD>.csv"` (bekleyenler hariç) |
| `POST /api/rsvp/<slug>/responses` `{action: "remove"\|"keep", ids: [...]}` (yalnız `Bearer`) | `200 {ok, changed, …özet}` · `400` · `401` · `413` · `415` — "remove" kalıcı siler, "keep" bekleyeni sayılara alır; başka sitenin yanıtına dokunmaz |

- Yanlış anahtar, önizleme anahtarı, başka sitenin anahtarı ve bilinmeyen slug **aynı** `401` (`This edit link is not valid.`).
  Bütün RSVP yanıtları `private, no-store`, `noindex`, `no-referrer`.
- `totalGuests` = katılan yanıtlardaki `guests` toplamı (baş sayısı). `counts.held` = bekleyen yanıt sayısı; listede her yanıt `held` taşır.
- CSV: UTF-8 BOM (Excel aksanlı isimler), CRLF, her hücre tırnaklı; `=`, `+`, `-`, `@` (ve sekme/CR) ile başlayan
  hücrenin başına `'` eklenir (CSV injection). Sütunlar: `Submitted (<timezone>)` ("March 1, 2027 10:05 AM", sitenin
  saat diliminde), `Name`, `Email`, `Attending` (Yes/No), `Guests`, `Message`; eskiden yeniye. **G051:** `Message`'tan sonra her özel soru
  için bir sütun (başlık = sorunun şimdiki metni, yayındaki içerikten); sonradan silinen sorunun cevapları da kendi sütununda kalır
  (başlık = misafirin gördüğü metin). Sorusuz sitede CSV eskisiyle aynı (6 sütun). Başlıklar ve cevaplar da formül korumalı.
- Panel sunucuda doğrudan da çağırabilir: `authorizeEditor`, `rsvpSummary`, `rsvpCounts`, `rsvpCsvForSite` (`lib/rsvp/couple.ts`).

Tarayıcı kontrolü (build gerekir; `npm test`'e dahil değil):
`npm run build && NODE_PATH=/opt/node22/lib/node_modules node tests/rsvp-browser.ts` — fixture tema, `next start`,
Chromium 390 px: gönder/teşekkür (yes/no), ikinci yanıt, sunucu hata mesajı, kapalı form, önizlemede gönderim yok,
CSP/konsol hatası yok. Ekran görüntüleri `$RSVP_SHOTS_DIR`'e (varsayılan geçici klasör).

## Düzenleme paneli (G039)

Alıcı sitesini telefonundan düzenler: `/edit/<slug>?k=<düzenleme anahtarı>`. Panel İngilizce, telefon öncelikli (390 px),
sade bir araç: büyük dokunma alanları (≥ 44–48 px). Geniş ekranda (≥ 960 px) önizleme formun yanında durur. Görsel dekor yok (K21);
renkler marka-nötr.

> **G060 ile arayüz değişti** (aşağıda "Panel v2 ve düzenleme hakkı"): akordeon bölümler ve alttaki Save · Preview · Publish
> çubuğu yerine kurulum sihirbazı + Home · Edit · Guests · Share görünümleri, bölüm sayfaları, üst çubukta kayıt göstergesi ve
> Publish. Bu bölümdeki kurallar (link/anahtar, uzunluk sınırları, temaya göre alanlar, örnek metin işareti, otomatik kayıt ve
> 409, doğrulama, taslak kuralları, önizleme anahtarı, yayın, QR, fotoğraf hattı) aynen sürüyor; yalnız düğme/yerleşim anlatımı eski.

- **Link:** anahtar hash ile doğrulanır (`authorizeEditor`). Yanlış/eksik anahtar, önizleme anahtarı, başka sitenin anahtarı ve
  bilinmeyen slug → **aynı** genel 404 sayfası ("This edit link is not valid"); slug'ın varlığı sızmaz. Sayfa `noindex`,
  `<meta name="referrer" content="no-referrer">` (anahtar URL'de), dinamik (`no-store`).
- **Uzunluk sınırları (G055):** ilk isim ve tam ad ≤ 40, "Names as shown" ≤ 85, mekân adı ≤ 80 — alanda `maxlength` + sayaç
  ("12/40"; eski bir kayıt sınırı aşıyorsa sayaç kırmızı, hata alanın altında, yayın engellenir). Program ≤ 10 olay: ipucu
  "Up to 10 events.", 10'da "Add an event" kalkar ve "10 of 10 events: the most your website can show." yazar.
- **Bölümler:** Couple (ilk isimler, tam isimler; "Names as shown", monogram ve o kişinin **tam adı** (davetiye kartında görünür; boşsa
  ya da ilk isme eşitse) ilk isimleri izler — elle değiştirilene kadar; host line) ·
  Date & time (tarih, tören saati, saat dilimi listesi + "Use this device's time zone", tarih biçimi US/UK/CA/AU) · Venue ·
  Schedule (satır ekle/sil/yukarı/aşağı, "Sort by time"; ilk satır tören saatine eşitse saatle birlikte değişir) ·
  Story (giriş + anlar: başlık ≤ 60, metin ≤ 400; sayı temaya göre) · Details (dress code; map, travel & stay = `urls.accommodation`,
  registry linkleri) · RSVP (son tarih "Replies close at the end of Saturday, April 3, 2027 (America/New York time)",
  "Accept replies on the website" = `rsvp.method` null/`none`, gelen yanıtlar + sayılar + CSV, "Refresh"; yanıt seç → "Remove
  selected" (bir kez daha sorar); bekleyen yanıtlar ayrı kutuda "Keep"/"Remove"; ilk 20 + "Show all"; G051: "Questions for your
  guests" (≤ 3 özel soru: metin, "Guests pick one choice"/"Guests write a short answer", seçenek ekle/sil (≤ 8), yukarı/aşağı/sil),
  yanıt listesinde her cevap "Meal choice: Fish") · Questions & answers (G051; yalnız temada `faq` listesi varsa: "Show on the website"
  anahtarı = `optional_blocks.faq`, soru ≤ 120 / yanıt ≤ 600, ekle/sil/yukarı/aşağı, en çok 12) ·
  Optional sections (yalnız temanın sayfalarında `data-optional` ile geçen bloklar) · Photos (`theme.json` foto alanları; şekil kelimeyle:
  "Tall (portrait)", "Almost square", "Wide (landscape)"; küçük resimler önizleme anahtarıyla).
- **Temaya göre alanlar** (`lib/panel/state.ts` `themeFieldUse`, şablon işaretlerinden): tema göstermediği alanı panel sormaz —
  Monogram (`initials`), anların "A few words" metni, tema kaç an gösteriyorsa o kadar "Add a moment" (blush-garden-rose: monogram
  yok, metin yok, 3 an; `_sample`: hepsi, 12). Fazla an varsa "guests do not see this one" notu.
- **Örnek metin işareti** (`sampleNotes`/`prePublishNotes`, `model.ts`): `/start`'tan gelen taslak temanın kurgu demo kaydının
  kopyasıdır. Demo kaydıyla hâlâ aynı olan değerler (tarih, saat, mekân adı/adres/şehir, host line, dress code, hikâye girişi ve
  başlıkları, program yerleri, son tarih) alanın yanında "Sample", bölüm başlığında "Sample text" ile işaretlenir. Publish önce
  "Before you publish" listesini gösterir: örnek metinler, boş foto yerleri ("guests see a soft placeholder image"), açık ama linksiz
  bloklar; her madde alana götürür, "Publish anyway" ile yine yayınlanabilir. Demo kaydı olmayan temada (internal) örnek uyarısı yok.
- **Tarihler** her yerde `formatDate`/`formatDateLong` ile: "Saturday, May 15, 2027", "4:00 PM" (en-GB: "15 May 2027", "4:00 pm").
- **Otomatik kayıt:** son değişiklikten 800 ms sonra `PUT /api/edit/<slug>`; istekler sıralı (aynı anda tek PUT), her istek son
  bilinen `updatedAt`'i taşır → başka sekme/telefon arada kaydettiyse **409**, kayıt durur ve "Reload" istenir (sessiz üzerine yazma yok).
  409 gelince panel önce kayıtlı taslağı okur (`GET`): gönderdiği içerikle aynıysa (kendi kaydı saklanmış, yanıtı yolda kaybolmuş)
  yeni `updatedAt`'i alıp devam eder; yalnız gerçek fark kilitler. Publish/unpublish da kayıtlarla **aynı sıradan** gider: yavaş bir
  yayın sırasında yazılan değişiklik yayından sonra, yeni `updatedAt` ile kaydedilir (yanlış "başka cihaz" çakışması yok).
  Sekme gizlenince kayıt; kapanırken `keepalive` kaydı ve kaydedilmemiş değişiklikte `beforeunload` uyarısı. Ağ hatasında artan
  aralıkla yeniden dener. Çubukta durum: "All changes saved / Unsaved changes / Saving… / Not saved yet. Trying again…".
- **Doğrulama:** tarayıcıda aynı TS doğrulayıcı `validateContent(content, { platform: true })`; boş alanlarda daha anlaşılır metin
  (`panelIssues`: "Please enter a time.", "Please choose a date.", "Please enter a name."). Hata alanın altında (yazarken gizli,
  blur'da görünür), bölüm başlığında "N to fix". Publish hataları listeler; her madde alana götürür ve odaklar.
  `platform: true` seçeneği yalnız `urls.website` / `urls.rsvp_form` boş uyarılarını (`customer_url_missing`) kapatır (site ve RSVP
  platformun kendisi); hiçbir hatayı değiştirmez (test: `tests/panel.test.ts`).
- **Taslak kuralları (`lib/panel/draft.ts`):** taslak eksik/geçersiz olabilir (yazarken), ama yapısı bozuk olamaz: bilinmeyen alan,
  yanlış JSON türü, eksik zorunlu nesne, enum dışı değer, liste sınırı aşımı → **400** (`invalid_shape`), saklanmaz. İstisna (G055):
  programın 10 satır sınırı yapı değil içerik kuralıdır — 11+ satırlı taslak (sınırdan önce yapılmış site) kaydedilir, yalnız yayın
  engellenir ("Your website shows up to 10 events. Please remove 2 events."); uzunluk sınırları da öyle (zaten yapı değildi).
  `record_kind` ve `event_type` panelden değişmez (saklı değer korunur). Taslak ≤ 64 KB.
- **Önizleme:** iframe `/<slug>?preview=<önizleme anahtarı>` (anahtar düzenleme anahtarından türetilir), 390 px; sayfa sekmeleri
  yalnız bu içerikle açılan sayfalar (Story kapalıysa ya da yanıtlar kapalıysa RSVP sekmesi yok; `pageRules` = `<body>` işaretleri),
  44 px, sığmazsa alt satıra geçer; her başarılı kayıttan sonra yeniden yüklenir. Telefonda tam ekran **modal**: odak Close'a, arkadaki
  form ve çubuk `inert`, sayfa kaymaz, açılınca geçmişe kayıt eklenir → Android geri tuşu/hareketi önizlemeyi kapatır (editörden
  çıkmaz); kapanınca odak Preview düğmesine döner. iframe ilk açılışta yüklenir.
- **Yayın:** `publishSite` (geçersiz içerik → **422** + `issues`), `unpublishSite`. Düğme: "Publish" → yayındayken değişiklik varsa
  "Publish changes", güncelse "Share". Yayından sonra link (kopyala/aç) ve **QR**: `lib/qr.ts`, sabit `uqr@0.1.3` (Nayuki
  kodlayıcısı), `tools/make_qr.py` ile aynı ayarlar (hata düzeltme Q, 4 modül kenar), yalnız http(s), demo alan adları reddedilir;
  PNG/SVG indirme. "Take the website offline" onaylıdır; içerik ve son yayın kopyası korunur. Çubuk düğmeleri 360 px'te tek satır
  ("Publish changes" dahil); sabit çubuk odaklanan alanı örtmez (`scroll-padding-bottom`). Program/an satırında "Remove" bir kez daha
  sorar ("Yes, remove"), taşımadan sonra odak taşınan satırla gider.
- **Fotoğraf:** dosya seçimi (`accept="image/*"`, ≤ 30 MB, SVG reddedilir) → tarayıcıda kırpma (alanın oranı; sürükle, pinch,
  kaydırıcı, tekerlek, ok/+/- tuşları) → canvas JPEG (uzun kenar ≤ 2000 px, ≤ 3.5 MB) → `POST /api/edit/<slug>/photo?slot=<anahtar>`
  → `assertImageUpload` (tür baytlardan, ≤ 10 MB) → **sharp ile yeniden kodlama** (`lib/panel/photos.ts`: EXIF yönü uygulanır,
  bütün metadata — GPS dahil — silinir, ≤ 50 MP, uzun kenar ≤ 2400 px, oran %1'den fazla saparsa ortadan kırpma, şeffaflık beyaza,
  sRGB JPEG q84) + **türevler** (G055: 640 ve 1280 px genişlikte, yalnız fotodan dar olanlar; yüklenen dosyadan ayrı ayrı kodlanır)
  → `adapter.savePhoto` (`<rastgele>-<W>w.jpg` + `-640w`/`-1280w`) → URL (yalnız fotonun) taslağa yazılır ve hemen kaydedilir.
  Panel küçük resmi 640'lık türevi gösterir. sharp yoksa türev yok (eski tek dosya adı, `srcset` yok). `memory_photos` şemaya uygun kalır (boşluk `""`,
  sondaki boşlar silinir). sharp yüklenemezse (yerel ikili yoksa) kontrol edilmiş orijinal saklanır ve uyarı loglanır.
  sharp, Next'in zaten kurduğu sürümle (`0.35.5`) doğrudan bağımlılık yapıldı.

### Panel API

Hepsi `Authorization: Bearer <düzenleme anahtarı>` ister (`?k=` kabul edilmez: link ya da başka sitenin formu işlem yapamaz).
Yanlış anahtar, önizleme anahtarı, başka sitenin anahtarı, bilinmeyen/ayrılmış slug → aynı
`401 {ok:false, code:"unauthorized", message:"This edit link is not valid."}`. Yanıtlar `private, no-store`, `noindex`, `no-referrer`.

| İstek | Yanıt |
|---|---|
| `GET /api/edit/<slug>` | `200 {ok, state: {slug, theme: {id, name, pages, photos[{key,label,source,aspect,ratio}], optionalBlocks}, content, status, updatedAt, publishedAt, hasUnpublishedChanges, rights, previewKey, origin, orderRef}}` (arşivde de okunur) |
| `PUT /api/edit/<slug>` `{content, baseUpdatedAt?}` (JSON) | `200 {ok, status, updatedAt, publishedAt, hasUnpublishedChanges, rights, validation: {ok, errors, warnings}, identityKept?, identity?}` · `400 bad_json / invalid_shape (+issues)` · `403 archived` · `409 conflict (+updatedAt)` · `413` · `415` |
| `POST /api/edit/<slug>/photo?slot=<anahtar>` (ham görsel gövdesi) | `200 {ok, slot, source, url, contentType, size, width, height}` · `400 empty / unknown_slot` · `403 archived` · `413 too_large` · `415 unsupported_type` |
| `POST /api/edit/<slug>/publish` `{baseUpdatedAt?}` | `200 {ok, status:"published", publishedAt, updatedAt, hasUnpublishedChanges, rights, url}` · `403 archived` · `409 conflict / identity_mismatch` · `422 invalid_content (+issues)` |
| `POST /api/edit/<slug>/unpublish` | `200 {ok, status:"draft", …}` · `403 archived` |
| `POST /api/edit/<slug>/identity` `{identity: {names[{display, full}], shown, initials, date}, intent?: "fix"\|"change", baseUpdatedAt?}` (G060) | `200 {ok, result: "unchanged"\|"free"\|"typo"\|"change", identity, rights, …}` · `400 invalid_shape` · `403 archived / no_changes_left (+remaining, limit)` · `409 conflict / confirm_required (+kind, remaining, limit)` · `422 invalid_identity / date_archives_site (+issues)` |

Yükleme yalnız dosyayı saklar ve URL döner; içeriğe yazan, panelin bir sonraki kaydıdır (tek yazar: taslak).
`rights` = `rightsView` (`lib/panel/rights.ts`): `{phase, limit, granted, used, remaining, anchor, firstPublishedAt, onlineUntil,
archiveAt, archived, archiveSoon}`.

### Panel testleri

- `tests/panel.test.ts` (node:test, 27 test; G060: `/identity` rotası, isimler yayından sonra yalnız oradan; ayrıca tam ad izleme, yayın öncesi notlar, tema alan/sayfa bilgisi, yayın 409): anahtar (iyi/yanlış/eksik/başka site/`?k=`/bilinmeyen slug; önizleme anahtarı düzenleyemez),
  taslak kaydı (yayın kopyasına dokunmaz, 409 çakışma, kilitli alanlar, yapı reddi, 413/415/400), doğrulama mesajları ve
  `platform` seçeneği, yükleme sınırları (boş, > 10 MB, SVG/GIF/HTML, bozuk JPEG, > 50 MP, bilinmeyen alan, anahtarsız; EXIF silinir,
  oran kırpılır, 2400 px), yayınla/yayından kaldır, QR (bağımsız okuyucu `jsqr` ile geri çözülür), yardımcılar.
- Tarayıcı (build gerekir; `npm test`'e dahil değil):
  `npm run build && NODE_PATH=/opt/node22/lib/node_modules node tests/panel-browser.ts` — `next start` + Chromium 390 px
  (isMobile, touch): geçersiz linkler → isimleri değiştir → program satırı ekle/taşı/sil → fotoğraf yükle + kırp → hatalı son tarih
  yayını engeller → önizlemede isim ve foto → yayınla → QR ekran görüntüsünden çözülür = genel URL → genel sayfada isim ve foto →
  misafir yanıtı panelde (+ silme) → "Publish changes" → kayıp kayıt yanıtı / yavaş yayın sırasında yazma (yanlış çakışma yok) →
  offline (404, foto da 404) → yeniden yayın → masaüstünde yan yana önizleme; önizleme modalı (odak, `inert`, geri tuşu), Tab ile odak
  çubuğun altında kalmıyor, "Before you publish" notları, G055: küçük resim 640 türevi + yayında `srcset`. 75 kontrol (G060'ta
  v2 arayüzüne uyarlandı: sihirbaz adım 1, hash adresleri, Guests görünümü, menü eylemleri);
  ekran görüntüleri, `panel_flow_390.mp4` ve `checks.json` → `previews/g039/` (`PANEL_SHOTS_DIR`, `PORT` (3313), `PANEL_SLOWMO`).
  Repodaki `previews/g039/` dosyaları G039 dönemi arayüzüdür (G060'ta üzerine yazılmadı); v2 görüntüleri `previews/g060/`.
  Test fotoğrafı: 03'ün kurgu GPT örnek fotoğrafı (`collections/03_Blush_Garden_Rose/assets/gpt/photos/hero_portrait.jpg`).

`components/panel/next-types.d.ts`: `next-env.d.ts` (build üretir, repoda yok) yokken `npm run typecheck` CSS modül tiplerini bulsun diye.

### Panel açık konuları

- Değiştirilen/silinen fotoğraflar depoda kalır (adaptörde `deletePhoto` yok) → G043'te öksüz dosya temizliği. Artık herkese
  servis edilmezler (aşağıda "Fotoğraflar"), yalnız depoda yer tutarlar.
- Site başına yükleme kotası / hız sınırı yok (yalnız 256-bit anahtar sahibi yükleyebilir).
- Vercel fonksiyon gövde sınırı 4.5 MB: tarayıcı çıktısı ≤ 3.5 MB tutulur; sunucudaki 10 MB sınırı Vercel dışında geçerli.
  Supabase'de imzalı doğrudan yükleme (G043/G044) düşünülebilir.
- Şemada serbest metin "travel" alanı yok: Travel & stay = konaklama linki + `travel_stay` anahtarı. Guest policy metni de şemada yok
  (yalnız aç/kapa); SSS metinleri G051'den beri var (`faq`). İkinci isim eklenebilir ama silinemez.
- Düzenleme linki URL'de kalır (yer imi için). Alıcının kendisinin "yeni link üret" düğmesi yok; mağaza/operatör aracı var
  (`scripts/reissue-edit-key.ts`, aşağıda /start).
- Gerçek telefonda (iOS Safari / Android Chrome) denenmedi; yalnız Chromium mobil emülasyonu. HEIC yalnız onu çözebilen tarayıcıda
  (Safari) açılır; Chrome'da açık hata mesajı çıkar. QR telefon kamerasıyla okutulmadı (ekran görüntüsünden `jsqr` ile çözüldü).
- `local` adaptör tek süreçlidir. G060'tan beri taslak kaydı da (`PUT`) ve `/identity` de koşullu yazar
  (`adapter.patchSite(id, patch, {expectedUpdatedAt})`): beklenen sürüm adaptörün kilidi (`local`) / ETag'i (`blob`) içinde
  karşılaştırılır, arada başka yazma olduysa `StaleSiteError` → 409. Yayın (`publish`) zaten böyleydi. Supabase'de koşullu UPDATE (G043).

## Panel v2 ve düzenleme hakkı (G060)

Tasarım belgesi: `docs/16_PANEL_V2.md` (bilgi mimarisi §4, sihirbaz §5, görünümler §6, tokenlar §8, durumlar §9, erişilebilirlik §10,
hak modeli §11, kabul testleri §14, açık kararlar §15). Panel İngilizce; ikonlar `lucide-react@1.46.0` (sabit), font dosyası yok
(sistem yığınları), dekor çizimi yok (K21). Görsel olarak yalnız temanın gerçek önizlemesi ve alıcının fotoğrafları.

### Görünümler (`components/panel/`)

- **Adresler (hash):** `#setup/1`…`#setup/6`, `#home`, `#edit`, `#edit/<bölüm>`, `#guests`, `#share`. Geri tuşu/hareketi bir
  önceki adıma/görünüme döner; sayfa yenilenince aynı yerde açılır. `/start`'taki "Open my editor" → `#setup/1`.
- **Kurulum sihirbazı (`Setup.tsx`, ilk açılış):** 1 isimler → 2 tarih ve saat → 3 mekân → 4 fotoğraflar (kırpma) → 5 kontrol
  (önizleme + "Before you publish" notları, her not ilgili bölüme götürür) → 6 yayınla (ilk yayından önce kurallar kutusu:
  kaç isim/tarih değişikliği, yazım düzeltmesi ücretsiz, site ne zamana kadar açık) → "Your website is live" (link, QR, paylaş).
  Adım 1–4 atlanabilir ("Skip for now"), 5–6 atlanamaz. İlerleme `localStorage` `setup:<slug>`'ta; başka cihazda içerikten
  çıkarılır (dolu adımlar geçilir). Değerler normal otomatik kayıtla saklanır.
- **Home:** durum kartı (yayında / taslak / yayımlanmamış değişiklik / arşiv), sonraki adımlar (örnek metinler, boş fotolar),
  kalan isim/tarih hakkı ("2 of 3 changes left" + noktalar), "Guests coming" sayıları, site ne zamana kadar açık
  (son 30 gün uyarı). Üst çubuk başlığı kaydırınca görünür.
- **Edit:** bölüm listesi (Names, Date, Venue, Schedule, Story, Details, Questions & answers, RSVP, Photos; temanın göstermediği
  bölüm yok), her bölüm ayrı sayfa; altta yapışkan "Preview this page" (telefonda) ya da başka bir ekrandan gelindiyse "Done".
  Program/an/SSS satırları: menüden yukarı/aşağı/sil,
  silme **Undo** snackbar'ıyla geri alınır. Geniş ekranda (≥ 960 px) sağda telefon çerçeveli canlı önizleme; telefonda Preview tam
  ekran sayfa (`Sheet.tsx`: portal, arka plan `inert`, geçmiş kaydı → geri tuşu kapatır).
- **Guests:** yanıt sayıları, yeni yanıtlar işaretli (`seen:<slug>`), yanıtlar birlikte açılabilir, CSV, bekleyen yanıtlar,
  seç → sil. Son tarih ve "Questions for your guests" Edit → RSVP bölümünde.
- **Share:** genel link (kopyala/aç; cihaz destekliyorsa paylaş), QR (PNG/SVG), yayından kaldır.
- **Durumlar:** üst çubukta kayıt göstergesi (Saved / Saving… / Unsaved changes / Offline / Not saved yet. Trying again… /
  Saving paused); **çevrimdışı** iken
  değişiklikler `localStorage` `draft:<slug>`'a yazılır, bağlantı gelince gönderilir; sayfa kaydedemeden kapandıysa bir sonraki
  açılışta "Restore / Discard" sorulur (eski bir sürüme ait kopya yalnız "Discard"); çevrimdışıyken Publish kapalı. 409 çakışmada
  "Reload" (sessiz üzerine yazma yok). Arşivde her şey salt okunur, yanıtlar indirilebilir.
- **Erişilebilirlik:** dokunma alanları ≥ 44 px, odak halkası, `prefers-reduced-motion`, ekran okuyucu metinleri (ör. hak sayacı),
  axe-core ile 13 görünümde ciddi/kritik ihlal 0 (tarayıcı testi).
- **E-posta ile giriş (magic link, §12):** sağlayıcı yok → **kapalı**. `/signin` dürüst metin ("Email sign-in isn't available
  yet. Open your editor with the edit link you saved. …"), form yok; `POST /api/signin` → `503 {code:"unavailable"}`; `lib/panel/signin.ts` `SignInMailer` arayüzü +
  `DisabledSignInMailer`. Geçersiz link sayfasında "Lost your edit link?" kartı (destek adresi yer tutucu).
- **Marka değerleri:** dükkân adı ve destek e-postası `lib/marketing/config.ts`'ten (G061) gelir; karar verilmediği için
  `[SHOP NAME]`, `[SUPPORT EMAIL]` yer tutucusu görünür, `mailto:` linki yapılmaz (`lib/panel/brand.ts` `isPlaceholder`).

### Düzenleme hakkı (anti-abuse, `lib/panel/rights.ts` — istemci + sunucu ortak, saf)

- **Kimlik alanları:** iki kişinin ilk ismi ve tam adı, "Names as shown", monogram, düğün tarihi. Diğer her şey (saat, mekân,
  program, hikâye, fotoğraflar, detaylar, RSVP) sınırsız.
- **İlk yayına kadar** her şey serbest. İlk yayın `firstPublishedAt` ve `identity = {anchor, limit, granted:0, used:0, log}` yazar
  (`publishSite`).
- **Yayından sonra:** `PUT` kimlik alanlarını **saklı değerde tutar** (`keepStoredIdentity`, yanıtta `identityKept`); kimlik yalnız
  `POST /identity` ile değişir. Sınıflandırma çapaya (son sayılan kimlik) göre: alan başına ≤ 2 düzenleme (Damerau–Levenshtein OSA,
  kod noktası; NFC, görünmez karakterler ve boşluklar normalize; "Names as shown"da `&`/`and`/`+` farkı yok) = **yazım düzeltmesi,
  ücretsiz**, çapa yerinde kalır (ücretsiz düzeltmeler birikip başka çift olamaz); fazlası = **değişiklik**: `intent:"change"`
  olmadan `409 confirm_required`, onaylanırsa 1 hak harcanır ve çapa yeni kimlik olur. Hak 0 → `403 no_changes_left` (yazım
  düzeltmesi yine serbest). Varsayılan 3 hak, ≤ 2 karakter, 12 ay: `lib/marketing/config.ts` `editRights`/`hosting` (satış sitesi
  ve sunucu aynı sayıyı okur).
- **Yarış güvenliği:** hak sayacı ve içerik **tek koşullu yazımda** (`patchSite` + `expectedUpdatedAt`); iki sekme son hakkı aynı
  anda harcayamaz (test: `local` ve aynı Blob deposunda iki sunucu örneği).
- **Yayın savunması:** taslak kimliği çapadan "değişiklik" kadar farklıysa (eski istemci vb.) yayın `409 identity_mismatch`.
- **Eski kayıtlar:** G060'tan önce yayınlanmış site okunurken çapa = yayınlanmış kimlik, 0 kullanılmış; ilk yazımda kaydedilir.
- **Günlük:** her ilk yayın/düzeltme/değişiklik/destek eylemi site kaydındaki `identity.log`'a (en çok 50, en yeniler).
- **Destek aracı:** `node scripts/grant-identity-change.ts (--order <no> | --slug <adres>) --add <n> --reason "<neden>"` (hak ekler),
  `--archive-on <YYYY-MM-DD>|clear --reason …` (arşiv tarihini taşır), `--show`. `DATA_ADAPTER`'ın deposunda çalışır; ne zaman
  hak verileceği dükkân sahibinin kararı (kodda politika yok).

### Arşiv (K25: düğünden 12 ay sonra)

- `archiveDates`: düğün tarihi + 12 ay (ay sonu kırpılır) son gün; arşiv ertesi gün 00:00 **site saat diliminde** (geçersizse
  UTC). Tavan (öneri, docs/16 §15 #3, **açık** — karar bekliyor): en geç ilk yayından 48 ay sonra (bedava "tarih düzeltmeleri" ile
  sonsuz barındırmayı önler). Destek `archiveOverrideAt` ile taşıyabilir. Hiç yayınlanmamış site arşivlenmez.
- Arşivde: genel sayfalar, fotoğraflar ve `.ics` **410** ("This wedding website has been archived", `noindex`, çift bilgisi yok);
  misafir RSVP formu yok (site yayında değilmiş gibi: gönderim kabul edilmez); panel `GET`, yanıt listesi ve CSV çalışır; panelin
  yazan uçları ve çiftin yanıt sil/tut ucu (`POST /api/rsvp/<slug>/responses`) `403 archived`. Önizleme anahtarıyla önizleme açılır.
- Tarih, siteyi hemen arşivleyecek kadar eskiyse ilk yayın ve `/identity` reddedilir (`date_archives_site`).
- Arşivden sonra verinin **silinmesi yok** (henüz yapılmadı; gizlilik metniyle birlikte karar).

### Testler

- `tests/g060-rights.test.ts` (7): mesafe, normalizasyon, sınıflandırma, çapa, arşiv tarihleri (saat dilimi, ay sonu, tavan,
  override), `rightsView`.
- `tests/g060-api.test.ts` (12): yayından önce serbest, ilk yayın kaydı, `identityKept`, yazım/değişiklik/onay/hak bitti, **iki sekme
  yarışı** (`local`) ve **iki Blob sunucu örneği** (sahte Blob deposu, ETag), destek hakkı, arşivleyen tarih, arşiv kapıları
  (sayfalar/foto/.ics 410, RSVP kapalı, CSV açık), eski kayıt göçü, 401 eşitliği, yayın savunması.
- Tarayıcı (build gerekir): `NODE_PATH=/opt/node22/lib/node_modules node tests/g060-browser.ts` — `next start` + Chromium
  390 × 844 (isMobile, touch). Kayıtlı yolculuk: sihirbaz 1→6 (isim, tarih, mekân, foto + kırpma, kontrol, kurallar) → yayın →
  QR çözülür → editör → Names kilitli → yazım düzeltmesi (ücretsiz) → 1 değişiklik → Home'da kalan hak → "Publish changes".
  Ayrıca: devam adımı (yenileme / başka cihaz), Back değerleri korur, geri tuşu, editörden ilk yayında kurallar, hak 0, Undo,
  Guests, Share, çevrimdışı + yerel kopya, çakışma, 401, arşiv, 1280 / 1000 düzenleri, 320 px, axe-core, dokunma alanları,
  azaltılmış hareket. **104 kontrol**; ekran görüntüleri, `g060_journey_390.mp4` ve `checks.json` → `previews/g060/`
  (`G060_SHOTS_DIR`, `PORT` (3341)). Eski tarayıcı testleri (panel-browser, final-smoke, g051, g055, claim) v2'ye uyarlandı.

### Bilinen eksikler (G060)

- Magic link akışı (gönderme, tek kullanımlık token, oturum) yok — sağlayıcı yok; yalnız kapalı arayüz.
- Gerçek telefonda denenmedi (Chromium mobil emülasyonu). Saat dilimi seçimi yerel `<select>` (aranabilir liste yok).
- Önizleme hash'i (`#preview/<sayfa>`) ve önizlemede "Preview — not published" şeridi yok; yardım üst çubuk menüsünde değil, Home'da.
- Arşivden sonra veri silme yok; 48 ay tavanı karar bekliyor.

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
5. **Kayıp yanıt (inceleme düzeltmesi):** form ilk gönderimde rastgele bir `claimToken` (`crypto.randomUUID()`) üretir, sekmede
   saklar ve her yeniden denemede **aynısını** gönderir; ağ hatasında 1,5 sn sonra kendisi bir kez daha dener. Site oluşmuş ama yanıt
   gelmemişse (telefon ağ değiştirdi) tekrar gelen istek: aynı belirteç + aynı e-posta + hâlâ hiç yayınlanmamış taslak + < 24 saat →
   anahtarlar yenilenir (görülmemiş eski link ölür), `201` yeni linkle. Başka her durum `409 order_used`. Saklanan yalnız
   `claimTokenHash` (SHA-256).

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
- E-posta: basit biçim kontrolü (≤ 254), alan adı küçük harfe. İsim: harf içermeli, ≤ 40 karakter (G055: `NAME_MAX` =
  şemanın isim sınırı, kod noktası sayılır; mesaj "Please keep each name to 40 characters or fewer."; G055 incelemesi: isim
  kutuları paneldeki gibi `maxlength={NAME_MAX}` — 40'ta durur, eskiden 60'a kadar yazdırıp sonra uyarıyordu); görünmez/bidi karakterleri
  silinir. İki 40 karakterlik isimle oluşan taslak da geçerli (`name_display` 83 ≤ 85).
- Adres: `lib/slug.ts` kuralları (3–48, ayrılmış adlar). Adres sonradan değiştirilemez (panelde slug değiştirme yok) — form bunu söyler.
- **Demo içeriği kaynağı:** önce `themes/<tema>/content.demo.json` (tema kendi demo kaydını taşır; tema varlık rotası `.json`
  servis etmez), yoksa `lib/claim/demo/<tema>.json` (koleksiyon kaydının kopyası; `collections/` platform dışında olduğundan
  statik `import` ile pakete girer). Şimdilik `blush-garden-rose` → `collections/03_Blush_Garden_Rose/content.demo.json`.
  Kopya kaynağından saparsa test kırılır. Demo kaydı geçerli olmalı ve `record_kind: "demo"` taşımalı; değilse tema sunulmaz (log).

### API

| İstek | Yanıt |
|---|---|
| `POST /api/start` `application/json`, ≤ 4 KB: `{theme, orderNumber, email, names: [a, b], slug?, claimToken?, website?}` | `201 {ok, slug, status:"draft", editUrl, editPath, siteUrl, emailSent}` · `400 invalid (+fields: orderNumber/email/name1/name2/slug)` · `400 bad_json` · `403 order_not_verified` · `404 theme_unavailable` · `409 order_used` · `409 slug_taken (+fields.slug, suggestion)` · `413` · `415` · `429 rate_limited/busy (+Retry-After)` · `503 verification_unavailable` · `500` |
| `GET /api/start/slug?value=<adres>` | `200 {ok, value, available, reason: null\|missing\|format\|reserved\|taken, message, suggestion}` · `429` |
| `GET /start/demo/<tema>[/<sayfa>]` | temanın sayfası demo içerikle (HTML); `internal`/bilinmeyen/demo'suz tema, `index` alt yolu → 404 |

Sıra (`lib/claim/claim.ts`): IP deneme sınırı → honeypot (`website` doluysa 400, kayıt yok) → tema → alan kontrolleri →
*(sipariş kilidi)* doğrulayıcı → kullanılmış sipariş (yeniden deneme ise yeni link) → adres (yazılan dolu ise 409 + öneri; boşsa isimlerden ilk boş adres) →
oluşturma sınırları → `createSiteWithKeys` → e-posta arayüzü → 201. Yanıtlar `private, no-store`, `noindex`, `no-referrer`
(link gövdede). Doğrulayıcı "kullanılmış" kontrolünden **önce**: doğrulama açıkken yabancı, numaranın kullanılıp kullanılmadığını
öğrenemez (her ikisinde aynı 403). `/start` ve `/edit/…` sayfaları `noindex` + `Referrer-Policy: no-referrer` + `X-Frame-Options: DENY`
+ CSP `frame-ancestors 'none'` (`next.config.ts` `headers()`; Next'in satır içi betikleri nonce gerektirdiği için `script-src` yok).
Demo sayfaları önizleme kipinde (`previewKey: "demo"`):
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
- `tests/claim.test.ts` (node:test, 19 test; ayrıca `claimToken` ile kayıp yanıtın kurtarılması, link yenileme aracı, doğrulayıcı sırası): sipariş no / e-posta / isim / adres kuralları; tema + demo kaynağı (kendi dosyası,
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
- **Birden çok sunucu örneği:** sipariş kilidi süreç içi. `blob` (G048): `orders/<no>.json` dizini "varsa yazma" ile → aynı
  siparişle ikinci site oluşmaz, yarışı kaybeden `409 order_used` alır. G043: `sites(order_ref)` üzerinde benzersiz indeks ve aynı
  çeviri. Kalıcı `RateLimiter` hâlâ yok (aşağıda).
- **Vercel dosya izleme:** temaları diskten okuyan bütün rotalar (`/[slug]…`, `/edit`, `/api/edit/…`, `/api/rsvp/[slug]`, `/start`,
  `/start/demo/…`, `/api/start…`) `next.config.ts` `outputFileTracingIncludes`'ta; G055'ten beri yalnız `themes/**/*.html` ve
  `*.json` ile. Tema görselleri/CSS/JS yalnız tema varlık rotasına (`/themes/[theme]/[...path]`) izlenir. Ayrıntı ve
  `trace-check` denetimleri aşağıda "Platform cilası (G055)".
- **Kayıp link — operatör aracı:** `node scripts/reissue-edit-key.ts --order <no> --origin https://<host>` (ya da `--slug <adres>`):
  siteyi bulur, yeni düzenleme + önizleme anahtarı üretir (yalnız hash saklanır; eski linkler hemen ölür), yeni linki **bir kez**
  ekrana yazar; içerik/foto/yanıt/yayın durumuna dokunmaz. `DATA_ADAPTER` deposunda çalışır (blob için token gerekir). Mağaza alıcıyı
  Etsy'de doğruladıktan sonra linki Etsy mesajıyla iletir. Destek süreci (kim, ne kadar sürede) kullanıcı kararıdır, uydurulmadı.
  Yerelde test edildi (`claim.test.ts`); canlı depoda denenmedi.
- **Doğrulama kapalıyken sipariş numarası kapma:** biçimi doğru numarayı ilk gönderen sahiplenir (sonra gelen gerçek alıcı
  `409`). Kod düzeltmesi değil, **satış öncesi şart**: Etsy sipariş doğrulaması (ya da sipariş başına gizli kod). O zamana kadar
  çare yukarıdaki operatör aracı (doğrulanmış alıcıya linki yeniden vermek). Hiç yayınlanmamış taslakların süre sonunda silinmesi
  (adres kapma) zamanlanmış iş + adaptörde site listeleme ister: yapılmadı.
- **Çok ürünlü Etsy siparişi** (aynı siparişte iki tasarım): kural sipariş başına tek site; ikinci tasarım için Etsy API ile
  kalem bazlı kontrol gerekir.
- Etsy doğrulaması kapalıyken biçimi doğru herhangi bir numara bir taslak site açabilir (hız sınırları + honeypot dışında engel yok).
- Gerçek telefonda (iOS Safari / Android Chrome) ve Vercel'de denenmedi; yalnız Chromium mobil emülasyonu ve `next start`.

## Takvime ekle, SSS, RSVP özel soruları (G051)

Etsy araştırmasında (`docs/13` §7) rakiplerde standart olup lisans/karar gerektirmeyen üç özellik. Müzik çalar **yok** (AGENTS şart 9).

### Takvime ekle (`lib/calendar.ts`, `lib/site/ics.ts`)
- **Rota** `GET /<slug>/event.ics` (statik segment, `[page]`'den önce gelir): yayındaki sitenin `publishedContent`'i → `text/calendar;
  charset=utf-8`, `Content-Disposition: attachment; filename="<slug>.ics"`, `public, max-age=0, must-revalidate`, `noindex`.
  Yayınlanmamış / yayından kaldırılmış site, bilinmeyen ya da ayrılmış slug, okunamayan tarih → **404**. Taslak yalnız geçerli
  `?preview=<önizleme anahtarı>` ile (`private, no-store`, `no-referrer`); yayındaki dosya yayınlanmamış düzenlemeyi göstermez.
  `/Clara-And-Julian/event.ics` → 308. Tema demosu: `GET /start/demo/<tema>/event.ics` (demo kaydı; `internal`/bilinmeyen tema 404;
  `next.config.ts` + `trace-check.cjs` listesinde).
- **Dosya (RFC 5545):** `VCALENDAR` (`VERSION:2.0`, `PRODID:-//Wedding website//Add to calendar//EN`, `METHOD:PUBLISH`) + tek `VEVENT`:
  `UID:<slug>@<host>` (sabit: yeniden içe aktarılınca aynı kayıt güncellenir), `DTSTAMP`/`LAST-MODIFIED` = yayın zamanı, `DTSTART`/`DTEND`
  **UTC** (`…Z`; VTIMEZONE gerekmez), `SUMMARY` ("Clara & Julian’s Wedding"; engagement → "… Engagement Party", bridal_shower →
  "… Bridal Shower", other → yalnız isimler), `LOCATION` (mekân, adres, şehir/bölge/ülke), `DESCRIPTION` (program "Order of the day
  (America/New York time):" + satırlar, dress code yalnız bloğu açıksa, "Website: <adres>"), `URL`. TEXT kaçışı (`\\ ; , \n`); denetim karakteri yazılmaz (U+000B/000C/2028/2029 → satır sonu, sekme dışındakiler silinir — Word'den
  yapıştırılan adres), satırlar
  75 oktette katlanır (UTF-8 karakter bölünmez), CRLF.
- **Saatler** (şemada bitiş saati yok; kural burada): başlangıç = `ceremony_time`, yoksa programın en erken saati; bitiş = başlangıçtan
  sonraki son program saati **+ 2 saat** (`END_AFTER_LAST_MS`; en az başlangıç + 2 saat). Duvar saati → UTC `zonedTimeToUtc` ile
  (yaz saati: Temporal "compatible" — olmayan 02:30 → 03:30; akşam saat geri alınırsa gerçek 2 saat). Hiç saat yoksa tüm gün
  (`VALUE=DATE`, bitiş ertesi gün); geçersiz saat diliminde "floating" yerel saat (Z'siz; doğrulama zaten uyarır).
- **Google Calendar:** `https://calendar.google.com/calendar/render?action=TEMPLATE&text=…&dates=<başlangıç>Z/<bitiş>Z&details=…&location=…&ctz=<IANA>`
  (tüm günde `dates=YYYYMMDD/YYYYMMDD`, `ctz` yok). Link sunucuda üretilir (`data-calendar="google"`); sayfa kaynağına giren bilgi
  zaten sayfada görünen bilgidir (kapalı bloklar girmez).
- Tema işareti `data-calendar="ics|google"` (yukarıda işaret tablosu). blush-garden-rose: home (davet kartı altı) + details (program kartı altı).

### SSS — soru ve yanıtlar
- Şema: `faq: [{q, a}]` (en çok 12; `q` ≤ 120, `a` ≤ 600; başka alan yok). İş kuralı: boş/yalnız boşluk soru ya da yanıt **hata**
  (`faq_question_empty`, `faq_answer_empty`); `optional_blocks.faq` açık ama liste boş → **uyarı** (`faq_empty`). "Boş" karakter kümesi
  TS ve Python'da aynı yazıldı (JS `\s` ile Python `isspace()` farklı). `tools/validate_content.py` ile geçti/kaldı eşliği testte
  (`content.test.ts`, 21 G051 vakası + 20 koleksiyon kaydı).
- Tema: `<details data-repeat="faq"><summary data-field=".q">…<p data-field=".a">` bloğu `data-optional="faq" data-if="faq"` içinde;
  kapalı blok ya da boş liste sayfa kaynağında hiç yok. Yanıttaki satır sonları CSS `white-space: pre-line` ile.
- Panel: "Questions & answers" bölümü yalnız tema `faq` listesini gösteriyorsa (`themeFieldUse().faq`); yayın öncesi notlarda
  "Sections without content" (açık ama sorusuz). Temanın demo kaydında örnek SSS varsa değiştirilmemiş olanlar "Sample" işaretlenir.

### RSVP özel soruları
- Şema: `rsvp.questions: [{id, label, type: "choice"|"text", options?: string[]}]` (en çok 3; `label` ≤ 120; ≤ 8 seçenek, her biri ≤ 60).
  İş kuralı: `id` = `[a-z0-9][a-z0-9_-]{0,23}` ve tekil; boş soru metni hata; `choice` en az 2 dolu ve birbirinden farklı seçenek
  (fark = sunucunun cevabı eşleştirdiği kural: `lib/content/text.ts` `normalizeLine` — NFC, denetim karakterleri silinir, iç boşluklar
  teke iner — + büyük/küçük harf duyarsız; "Fish  Pie"/"Fish Pie" ya da NFC/NFD "Café" aynı seçenektir, iki dilde aynı), boş seçenek hata; `text` seçeneksiz. Panel id'yi kendisi üretir (`q` + 6 karakter, `newQuestionId`) ve
  hiç değiştirmez: cevaplar id ile saklandığı için soru metnini değiştirmek/sıralamak eski cevapları karıştırmaz.
- Misafir formu, saklama, API, CSV: yukarıda "RSVP" (`answers`, `answer:<id>`, CSV sütunları). Geriye uyum: eski yanıtlar `answers`
  alanı olmadan okunur (listede `answers: []`, CSV'de boş hücre); sorusuz sitenin CSV'si değişmedi.
- Panel: RSVP bölümünde "Questions for your guests" (yalnız tema `rsvp.questions` listesini gösteriyorsa); yanıt listesinde cevaplar.

### Testler
`tests/calendar.test.ts` (13: saat dilimleri — EST/EDT, BST/GMT, AEST/AEDT, +05:30, yaz saati boşluğu, gece yarısını geçen akşam —,
tüm gün, floating, başlık, gizlilik, kaçış/katlama, denetim karakterleri, dosya yapısı, Google linki, motor işareti, rota: yayında/taslak/önizleme/yayından
kaldırılmış/bilinmeyen/ayrılmış/büyük harf, demo rotası) · `content.test.ts` (şema sınırları, kurallar, Python eşliği) · `rsvp.test.ts`
(cevap doğrulama, "no" cevap saklamaz, CSV sütunları + silinen soru + formül koruması) · `rsvp-api.test.ts` (uçtan uca: eski yanıt,
cevaplı yanıt, ret, geçersiz seçenek 400, çift gönderim, liste, yeniden adlandırılan/silinen soru CSV'si) · `adapter.test.ts` (local + blob
`answers` saklama) · `panel.test.ts` (taslak/yayın, yapı reddi, notlar, id) · `theme-blush-garden-rose.test.ts` (3) ·
**tarayıcı:** `tests/g051-browser.ts` (390 px, 44 kontrol; yukarıda "Çalıştırma").

Denenmedi: gerçek iPhone/Android'de `.ics` açılışı (iOS "Add to Calendar" sayfası, Android'de dosya → takvim uygulaması), Outlook/Apple
Calendar'a gerçek içe aktarma (dosya yapısı testle ve gözle doğrulandı), Google Calendar linkinin oturum açık bir hesapta açılışı.

## Platform cilası (G055)

### Paylaşım görseli ve sekme ikonu (`lib/theme/share.ts`, `lib/theme/engine.ts`)
- Tema `img/og-1200x630.jpg` (1200 × 630, isimsiz) ve/veya `img/favicon.png` (kare, şeffaf) taşıyorsa motor her sayfaya yazar:
  `og:image` = **mutlak** URL (`PLATFORM_PUBLIC_URL`, yoksa isteğin host'u: `x-forwarded-host`/`host`) + `og:image:type`
  (`image/jpeg`), `og:image:width/height` (1200/630), `twitter:card=summary_large_image`; `<link rel="icon" type="image/png"
  href="/themes/<tema>/img/favicon.png">`. Etiketler `<head>`'deki son `<meta>`'dan sonra. Şablonun kendi `og:image` /
  `twitter:card` / `icon` etiketi varsa o kalır (çift yazılmaz). Origin verilmezse (`renderTemplate` doğrudan) `og:image` yazılmaz.
  G055 incelemesi: `og:image:alt` + `twitter:image:alt` = "{name_display} wedding invitation" (görselde yazı yok; içerikten).
  Site sayfaları, önizleme ve `/start/demo/<tema>` aynı.
- `apple-touch-icon` **yazılmaz** (karar): `favicon.png` şeffaf; iOS ana ekran ikonunda şeffaf alan siyah görünür. Gerekirse
  temaya ayrı, zeminli bir `apple-touch-icon.png` (GPT parçasından) eklenir.
- "Tema dosyaya sahip mi": dosya diskte **ya da** `img/manifest.json` onu adlandırıyor (`"og": {"file": "og-1200x630.jpg"}`,
  `"favicon": {"file": "favicon.png"}` — `tools/tema_build.py` yazar). İkincisi Vercel için: sayfa rotalarının paketinde tema görseli
  yok, yalnız `*.html`/`*.json` var (aşağıda). `loadTheme()` sonucu `share` alanında (üretimde önbellekli).
- 03: G054'ün dosyaları (`og-1200x630.jpg` 1200 × 630 JPEG, `favicon.png` 180 × 180 PNG) — etiketler canlı build'de denendi
  (`tests/g055-browser.ts`): `og:image` bu sunucunun mutlak adresi, dosya 200 `image/jpeg` 1200 × 630, ikon 200 `image/png`.
  Sosyal ağ önizlemesi (Facebook/WhatsApp/iMessage kazıyıcıları) ve gerçek tarayıcı sekmesi **denenmedi**.

### Vercel paketleri (`next.config.ts`, `scripts/trace-check.cjs`)
- Tema okuyan 16 rota (`THEME_ROUTES`) yalnız `./themes/**/*.html` + `./themes/**/*.json` izler; tema varlık rotası
  (`THEME_ASSET_ROUTE`) yalnız servis edilen türleri (`THEME_ASSET_EXTENSIONS` = `lib/site/static.ts` `THEME_ASSET_TYPES`).
  Ölçüm (2 tema, yerel build): sayfa/panel/RSVP/`/start` rotası başına tema dosyaları **~2,8 MB → 69 KB**; varlık rotası 57 dosya,
  2,7 MB. (20 tema × ~2,9 MB ≈ 55 MB her fonksiyona girecekti; şimdi yalnız varlık rotasına.)
- `npm run build` → `trace-check` (exit 1 + liste): (1) her tema rotası her temanın `index.html`'ini izliyor; (2) bu rotalar
  `themes/`'ten `*.html`/`*.json` dışında **hiçbir** dosya taşımıyor; (3) varlık rotası her temanın servis edilebilir her dosyasını
  (nokta dosyaları hariç) izliyor; (4) diskte paylaşım görseli/ikon varsa her tema rotası onu motorun Vercel'deki kuralıyla
  "görüyor" (dosyanın kendisi ya da onu adlandıran izlenmiş `img/manifest.json`); manifest var olmayan bir dosyayı adlandırıyorsa da
  hata. `require('./scripts/trace-check.cjs')` listeleri ve `checkTraces()`'i verir (test: sahte `.nft.json`'larla her hata türü,
  eski "her şey her rotaya" yapılandırması da yakalanıyor; listelerin `next.config.ts` / `static.ts` ile aynılığı).
- Not (değiştirilmedi): `api/edit/*` paketleri ~49 MB — sharp'ın `linuxmusl-x64` ve `wasm32` ikilileri de izleniyor (Vercel glibc).
  250 MB sınırının altında; gerekirse `outputFileTracingExcludes` ile çıkarılabilir (Vercel'de denenmeli).

### Alıcı fotoğrafı türevleri ve `srcset` (`lib/photo-variants.ts`, `lib/panel/photos.ts`, `lib/uploads.ts`)
- Yükleme: foto (≤ 2400 px, alan oranı, JPEG q84) + 640 ve 1280 px genişlikte türevler (yalnız fotodan dar olanlar), hepsi yüklenen
  dosyadan ayrı ayrı kodlanır (EXIF yok). Dosyalar tek rastgele adla: `<hex32>-<W>w.jpg`, `<hex32>-640w.jpg`, `<hex32>-1280w.jpg`;
  içerik kaydı yalnız fotonun URL'sini taşır. Adaptör (`local`, `blob`) seti `photoSetFiles` ile denetler (türevler tam olarak
  `variantWidths(W)`, aynı tür) ve önce türevleri yazar.
- Motor: URL'den türevleri türetir → `srcset="…-640w.jpg 640w, …-1280w.jpg 1280w, …-<W>w.jpg <W>w"`, `sizes` şablonunki (yer
  tutucu için yazılmış slot genişliği); şablonda yoksa `loading="lazy"`'de `auto, 100vw`, değilse `100vw` (100vw hiçbir zaman fotodan
  büyük dosya seçtirmez: G055 öncesinden fazla indirme olmaz). Önizlemede her adayda `?preview=`. `/media` rotası bir türevi, fotoğrafı
  servis ettiği koşulda servis eder (yayında kullanılıyorsa herkese, önizleme anahtarıyla taslakta).
- Geriye uyum: G055 öncesi yüklemeler (`<hex32>.jpg`) ve sharp'sız saklanan dosyalar tek `src` (srcset yok); `readPhoto` iki adı da
  okur. G056'dan beri `scripts/seed.ts` örnek fotoğrafları panel yüklemesinin yolundan saklar (`preparePhoto` +
  `savePhoto({width, variants})`; `--photo-max 0` = eski tek dosya hâli) → tohum demo sitesinde ve `theme-check`'in
  "fotoğraflı ilk görünüm" ölçümünde `srcset` var.
- **Ölçüm** (`tests/g055-browser.ts`, 03, 390 × 844, DPR 3, `next start`, aktarılan bayt, theme-check yöntemi; fotoğraflar panel
  API'siyle yüklendi):

  | İlk görünüm | yer tutucu | 03 örnek fotoğrafları (1024 px) — tek dosya → G055 | 3× büyütülmüş örnekler (telefon boyu) — tek dosya → G055 |
  |---|---|---|---|
  | index | 1023 KB | 1180 → **1093 KB** | 1545 → **1093 KB** |
  | home  | 713 KB | 1096 → **890 KB** | 1709 → **888 KB** |

  Tarayıcı index kartındaki portrede (127 px) ve home kartında (149 px) 640'lık türevi, home'daki 60 px hikâye küçük resminde de
  640'lığı (`sizes=auto`) yükledi. "Telefon boyu" örnekler 03'ün kurgu GPT fotoğraflarının 3× büyütülmüşü (2287 × 2400'e kadar
  saklandı); gerçek telefon fotoğrafı daha çok ayrıntı taşır, tek dosyalı hâli daha da büyük olur. Gerçek telefon/ağ ölçümü değildir.

### İçerik uzunluk sınırları (entegratörün varsayılan kararı, geri alınabilir)
- Şema (`docs/03_URUN_ICERIK_SEMASI.json`): `partners[].display_name` ve `full_name` ≤ 40, `name_display` ≤ 85 (iki isim + " & " /
  " and "; "isimler ≤ 40" kararından türetildi), `venue.name` ≤ 80, `schedule` ≤ 10. SSS ve özel sorular G051 sınırlarıyla.
- Doğrulayıcılar: Python (`tools/validate_content.py`, jsonschema) ve TS (`validate.ts`) şemadan okur; 20 koleksiyon kaydı, tema
  kopyaları ve paketli `/start` demoları ikisinde de geçerli; sınırda/bir fazla vakalarında geçti/kaldı eşliği (astral harfli 40
  karakterlik isim dahil). Panel, taslak kuralı ve `/start` yukarıda.
- 03 Details kartı (`themes/blush-garden-rose/site.css`, yalnız CSS; görsel çizilmedi): kart 3 dilimle uzuyor (yukarıda). Ölçüm
  (`tests/g055-browser.ts`): 3 / 7 / 10 satır ve 10 uzun satır ("Champagne toast and speeches" + "The Glasshouse Pavilion by the old
  lake", dress code ile) × 360/390/430/768/1280 → her metin satırı düz kâğıtta (kart metin gizlenerek yakalanır, satır kutusu
  altındaki pikseller kâğıt rengi; %0,5'ten fazla boyalı piksel = hata), kart altındaki takvim bloğuna değmiyor, yatay kaydırma
  yok (40/40). 390 px'te kart: görüntü 554 px; 3 satır 586, 7 satır 599, 10 satır 673, 10 uzun satır 971 px. G055 öncesi
  düzende 3 uzun satır ve 4 uzun satır zaten çiçeğe biniyordu, 10 satır kartın dışına taşıyordu.
- **Bilinçli fark:** 03'ün demo kartı (3 satır) da 554 → 586 px (390 px'te, %+5,8) uzadı: metnin alt sınırı artık görüntünün %72
  satırı (uzun satırlarda alt çiçeklere değmemek için); demo düzeni ve metin konumu aynı, yalnız düz kâğıt bandı 1,28× uzun. Kâğıt
  dokusu gerilen bantta dikey liflenir (10 uzun satırda ~4×; DPR 3'te yakından bakınca görülür), ek yerleri gözle bakıldığında
  görünmedi. (G055 incelemesi: `theme-check` artık görüntüsünden uzun kartı doğrusal eşlemiyor, aynı piksel testiyle ölçüyor.)

### G055 incelemesi (2026-10-13)
- **03 home davet kartı** (`site.css`): Details kartı gibi 3 dilimle uzuyor (davet kartının düz kâğıt bandı %42–66; metin
  görüntünün %35,2 satırından başlar, sütun en çok %88, mekân + şehir en çok %64, son satır görüntünün en çok %81,5 satırında).
  Önce 20+ karakterlik bir tam ad (`.nm` `cqw` ile ölçeklendiği için her genişlikte) tarihi ve mekânı alt çiçeklerin üstüne,
  35 karakterlik ad kartın dışına itiyordu; 78 karakterlik mekân demo isimleriyle de çiçeğe biniyordu. Şimdi 24/35/40
  karakterlik tam ad, 78/80 karakterlik mekân, uzun host line × 360/390/430/768/1280 düz kâğıtta (`g055-browser` piksel testi);
  demo kaydında kart görüntünün kendi boyunda (390 px'te +1 px, 360 px'te +7 px).
- **03 home tanıtımı:** program satırı `nowrap` değil, kendi altına sarar (asılı girinti); 360 px'te uzun etiket ve "Will You
  Join Us?" artık sağdan kesilmiyor.
- **Takvim dosyası:** `/<slug>/event.ics` (ve tema demosunun) site linki + UID'i `publicOrigin` — sayfalardaki Google linki ile aynı.
- **`publicOrigin`:** virgüllü `x-forwarded-host` / `-proto`'nun son girdisi; `PLATFORM_PUBLIC_URL` yoksa üretimde bir kez uyarı.
- **Küçük foto:** `-<W>w` adları tek haneli genişliği de okur (8 px genişlikte bir foto saklanıp 404 veriyordu).
- **Panel:** program tam 10 satırken not; 10'u aşan eski sitede yalnız hata ("12 of 10" çelişkisi yok). Uzunluk hataları alanı ve
  uzunluğu söyler: "First name (first partner) is 41 characters. Please shorten it to 40." (`fieldLabel`, `panelIssues`). Hikâye
  "Intro line" alanında ipucu: tarih bu satırın arkasına eklenir.
- `/start` isim kutuları 40'ta durur (yukarıda); `lib/content/limits.ts` (yukarıda).
- Testler: `tests/g055-review.test.ts` (8; `npm test`'te), `tests/g055-browser.ts` 138 kontrol.

Testler: `tests/g055-share-tracing.test.ts` (8), `tests/g055-photos.test.ts` (6), `tests/g055-limits.test.ts` (6) `npm test`'te;
`tests/panel.test.ts` (yükleme adı/türevleri), `tests/panel-browser.ts` (küçük resim = 640 türevi, yayındaki sayfada `srcset`);
tarayıcı: `tests/g055-browser.ts` (yukarıda "Çalıştırma").

## Güvenlik özeti

- İçerik → HTML: yalnız metin düğümü/öznitelik değeri (parse5 serileştirici kaçışlar); `<script>`/`<style>` içine
  değer yazılmaz. JSON bloğu `<`, `>`, `&`, U+2028/2029 kaçışlı.
- URL'ler: link http/https/mailto/tel; foto http(s) veya kök göreli `/…` (`//`, `data:`, `javascript:` reddedilir).
- Başlıklar: CSP (`script-src 'self'` + tema satır içi betik hash'leri, `object-src 'none'`, `base-uri 'none'`,
  `frame-ancestors 'self'`), `nosniff`, önizlemede `noindex`/`no-store`/`no-referrer`. Gizli link taşıyan `/edit/…` ve `/start`:
  `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`.
- `site-data` JSON'u içerik kaydını taşımaz (kapalı bölümler kaynakta görünmez); şablon yorumları silinir.
- **Fotoğraflar** (`/media/<site>/<dosya>`, `lib/site/static.ts`): yalnız site yayındaysa ve yayındaki içerik o dosyayı kullanıyorsa
  (bir türev, fotoğrafı kullanılıyorsa — G055) (hikâye fotoğrafları yalnız Our Story açıkken) `public, max-age=300`; ya da isteğin `?preview=` anahtarı o sitenin ise
  `private, no-store`. Yayından kaldırılan sitenin, değiştirilen/silinen ve hiç kullanılmamış fotoğrafların hepsi 404. (Önceden her
  dosya bir yıl `immutable` servis ediliyordu.) Bedeli: önbellekte olmayan her foto isteği site kaydını da okur (`blob`: +1 okuma);
  CDN kopyası yayından kaldırmadan sonra en çok 5 dk kalabilir.
- Statik rota: tema klasörü dışına çıkış, nokta dosyaları, `.html`/`theme.json` servis edilmez; SVG'ye ayrı CSP.
- Yüklemeler: tür dosya baytlarından (SVG/HTML reddedilir), 10 MB sınırı, rastgele dosya adı.

## Açık konular

- Vercel yayını → G044 (yapıldı; inceleme düzeltmeleri yeniden yayın bekliyor); ilk canlı veri `blob` adaptörüyle (G048, G044'te
  gerçek depoda denendi). Supabase → G043.
  Panelin (G039) ve `/start`'ın (G045) açık konuları yukarıda.
- Tema varlıkları şimdilik fonksiyon üzerinden servis ediliyor (CDN önbelleği `s-maxage`); trafik artarsa
  derlemede `public/` altına kopyalamak düşünülebilir. G055'ten beri tema görselleri yalnız bu rotanın paketinde.
- G055 açıkları (seed türevleri ve 03 `--stress`'te index/rsvp G056 ile kapandı): `og:image`/ikon sosyal ağ kazıyıcılarında ve gerçek
  telefonda denenmedi; yeni bir paylaşım görseli eski önbellekte günlerce kalabilir (URL'de sürüm yok).
- `local` adaptör tek süreç içindir. RSVP ve `/start` hız sınırları süreç içi bellekte (`MemoryRateLimiter`); Vercel'de birden çok
  örnek olacağı için sınırlar örnek başınadır. `blob` sürümünde de kalıcı limiter yok (Blob sayaç için uygun değil: her artış bir
  yazma); gerekirse Vercel Firewall hız kuralı ya da G043'te Supabase tablo/RPC → `setRsvpRateLimiter()` / `setClaimRateLimiter()`.
- RSVP: yanıt düzeltme yok (silme ve "beklemede" var); çifte e-posta bildirimi yok (sağlayıcı seçilmedi); misafir verisi için
  **gizlilik metni** yok — RSVP formu, `/start` (e-posta) ve panel için kısa bir metin + link gerekli; ticari/hukuki kimlik
  kullanıcıdan gelmeli (uydurulmaz) → önerilen görev (claude-metin), G044'ün ya da ilk gerçek alıcının önünde blokaj. Google Fonts
  isteği ziyaretçi IP'sini Google'a gönderir (fontları kendimiz barındırmak düşünülebilir).
