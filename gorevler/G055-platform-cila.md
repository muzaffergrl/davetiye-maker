---
id: G055
baslik: Platform cilası — og:image + favicon, Vercel paket izleme, alıcı fotoğrafı srcset, içerik uzunluk sınırları (docs/11 §14 #6, #7, #9, #10)
rol: claude-kod
durum: inceleme
alan: wf-hazirlik
oncelik: 2
bagimli: [G046, G051]
yazar: [platform/lib/, platform/app/, platform/components/, platform/next.config.ts, platform/scripts/trace-check.cjs, platform/tests/g055-*, platform/tests/content*, platform/tests/panel*, platform/README.md, docs/03_URUN_ICERIK_SEMASI.json, tools/validate_content.py]
---

## Amaç
Satış öncesi teknik borçlar. Uzunluk sınırları için varsayılan karar (entegratör, geri alınabilir): `schedule` ≤ 10 satır,
isimler ≤ 40, mekân adı ≤ 80, SSS ve özel sorular mevcut sınırlarıyla; temalar en fazla 10 program satırını taşıyacak şekilde.

## Yapılacaklar
1. Motor, temada `og-1200x630.jpg` ve `favicon.png` varsa `og:image` (mutlak URL) ve ikon etiketlerini yazar (dosyaları G054 üretir).
2. Vercel paketleri: tema görselleri yalnız tema varlık rotasına izlensin (diğer rotalar yalnız `*.html`/`*.json`); trace-check bunu doğrular.
3. Alıcı fotoğrafı yüklemede 640/1280 türevleri; motor `srcset`/`sizes` yazar; fotoğraflı ilk görünüm ölçülür (≤ 1,5 MB DPR 3 hedefi).
4. Uzunluk sınırları: şema + iki doğrulayıcı + panel (sayaç/uyarı) + `/start`; 20 demo kaydı geçerli kalır; 03 Details kartı 10 satırda taşmaz.
5. Testler; README.

## Sonuç
**Yapılan (dosyalar)**
- **og:image + ikon (#6):** `platform/lib/theme/share.ts` (yeni) — tema `img/og-1200x630.jpg` / `img/favicon.png` taşıyor mu: dosya
  diskte **ya da** `img/manifest.json` onu adlandırıyor (`og.file`, `favicon.file`; Vercel'de sayfa paketlerinde görsel yok, manifest
  var). `lib/theme/theme.ts` `LoadedTheme.share`; `lib/theme/engine.ts` `writeShareTags`: `og:image` (**mutlak**), `og:image:type`,
  `og:image:width/height` 1200/630, `twitter:card=summary_large_image`, `<link rel="icon" type="image/png">`; son `<meta>`'dan sonra;
  şablonun kendi etiketi varsa çift yazılmaz; origin yoksa `og:image` yok. Origin = `PLATFORM_PUBLIC_URL`, yoksa isteğin host'u
  (`lib/site/render.ts`, `lib/claim/demo-page.ts` artık `publicOrigin()`; takvim açıklamasındaki site linki de). **Karar:**
  `apple-touch-icon` yazılmıyor (favicon şeffaf → iOS'ta siyah zemin).
- **Vercel izleme (#7):** `next.config.ts` — tema okuyan 16 rota yalnız `themes/**/*.html` + `*.json`; varlık rotası yalnız servis
  edilen türler (`THEME_ASSET_EXTENSIONS` = `static.ts` `THEME_ASSET_TYPES`). `scripts/trace-check.cjs` yeniden yazıldı: (1) şablonlar
  izlenmiş, (2) tema rotalarında `*.html`/`*.json` dışı tema dosyası yok, (3) varlık rotası servis edilebilir her dosyayı izliyor,
  (4) paylaşım dosyası diskte ise her tema rotası onu motorun Vercel kuralıyla görüyor + manifest olmayan dosyayı adlandırmıyor;
  `require()` ile `checkTraces()` test edilebilir. Ölçüm (yerel build, 2 tema): rota başına tema dosyası **~2,8 MB → 69 KB**;
  varlık rotası 57 dosya / 2,7 MB.
- **Alıcı fotoğrafı srcset (#9):** `lib/photo-variants.ts` (yeni; adlar, adaylar), `lib/panel/photos.ts` (foto + 640/1280 türevleri,
  her biri yüklenen dosyadan), `lib/uploads.ts` `photoSetFiles`, `lib/data/types.ts` (`PhotoInput.width/variants`,
  `SavedPhoto.variants`), `lib/data/local` + `lib/data/blob` (`<hex>-<W>w.jpg` + türevler, önce türevler; `readPhoto` eski/yeni ad),
  `lib/panel/api.ts`, `lib/site/static.ts` (türev = fotoğrafı servis edilen koşulda), engine (`srcset` = türevler + foto; `sizes` =
  şablonunki, yoksa lazy'de `auto, 100vw`, değilse `100vw` — hiçbir zaman eskisinden büyük dosya seçtirmez), panel küçük resmi 640'lık
  türev (`components/panel/PhotosSection.tsx`). Eski tek dosyalı fotoğraflar değişmeden çalışıyor.
- **Uzunluk sınırları (#10, varsayılan karar):** `docs/03_URUN_ICERIK_SEMASI.json` — `display_name`/`full_name` ≤ 40, `venue.name`
  ≤ 80, `schedule` ≤ 10, ayrıca **`name_display` ≤ 85** (iki isim + " & "/" and "; "isimler ≤ 40"tan türettim — geri alınabilir,
  entegratör onaylamalı). `lib/content/schema.ts` (sync), `validate.ts` `CONTENT_LIMITS` (name, fullName, nameDisplay, venueName,
  scheduleItems), `tools/validate_content.py` (şemadan; docstring notu). Panel (`components/panel/sections.tsx`): isim/tam ad/isim
  satırı/mekân alanlarında `maxlength` + sayaç, program "Up to 10 events.", 10'da "Add an event" yok + "10 of 10 events: the most
  your website can show."; `lib/panel/model.ts` `panelIssues`: "Your website shows up to 10 events. Please remove N events.";
  `lib/panel/draft.ts`: programın 10 satır sınırı taslakta yapı hatası değil (eski 11+ satırlı taslak kaydedilir, yayın engellenir).
  `/start` (`lib/claim/fields.ts`): `NAME_MAX` = şemanın sınırı, kod noktası sayılır, mesaj "Please keep each name to 40 characters
  or fewer."
- **03 Details kartı (yalnız `platform/themes/blush-garden-rose/site.css`):** kart docs/11 §9 3 dilim kesimiyle uzuyor — üst %0–42
  `<img>` (`clip-path`), düz kâğıt bandı %42–66 `::before` (free_zone 41–67: altın çizgiler arası boş; dikey gerilir), alt %66–100
  `::after`; metin akışta (eski konum), en çok görüntünün %72 satırına iner; kart görüntünün boyundan kısa olmaz. Çizim yok (K21).
- Testler: `tests/g055-share-tracing.test.ts` (8), `tests/g055-photos.test.ts` (6), `tests/g055-limits.test.ts` (6),
  `tests/g055-browser.ts` (73 kontrol); `tests/panel.test.ts` (yükleme adı + türev), `tests/panel-browser.ts` (küçük resim = 640
  türevi, yayında `srcset`; 74 kontrol). `platform/README.md`: "Platform cilası (G055)" bölümü + ilgili satırlar.

**Ölçümler (390 × 844, DPR 3, `next start`, aktarılan bayt; fotoğraflar panel API'siyle yüklendi):**

| İlk görünüm | yer tutucu | 03 örnek fotoğrafları (1024 px): tek dosya → G055 | 3× büyütülmüş örnekler (telefon boyu): tek dosya → G055 |
|---|---|---|---|
| index | 1023 KB | 1180 → **1093 KB** | 1545 → **1093 KB** |
| home | 713 KB | 1096 → **890 KB** | 1709 → **888 KB** |

Tarayıcı portrelerde (127/149 px) ve 60 px hikâye küçük resminde 640'lık türevi yükledi. 03 Details kartı: 3/7/10 satır + 10 uzun
satır ("Champagne toast and speeches" / "The Glasshouse Pavilion by the old lake", dress code) × 360/390/430/768/1280 → her metin
satırı düz kâğıtta (piksel testi: kart metin gizlenip yakalanır, satır kutusunun altı kâğıt rengi), takvim bloğuna değmiyor, yatay
kaydırma yok (40/40). 390 px'te kart 554 px görüntüde: 3 satır 586, 7 satır 599, 10 satır 673, 10 uzun satır 971 px. G055 öncesi
düzende 3 ve 4 uzun satır alt çiçeklere biniyordu, 10 satır kartın dışına taşıyordu (aynı piksel testiyle ölçüldü).

**Komutlar:** `npm ci`; `npm test` **250/250**; `npm run typecheck` temiz; `npm run build` + trace-check (16 rota, 2 tema, yalnız
html/json, 69 KB; varlık rotası 57 dosya). Tarayıcı (build üzerinde, ayrı portlar): `g055-browser` 73/73, `theme-check --theme
blush-garden-rose` 73/73 (çıktı geçici klasöre; previews/g038 değişmedi), `panel-browser` 74/74, `final-smoke` 42/42,
`g051-browser` 44/44, `claim-browser` 50/50, `rsvp-browser` 25/25. `tools/validate_content.py` 20 koleksiyon kaydı GEÇTİ.

**Bilinçli fark / dürüst sınırlar**
- 03'ün **demo kartı (3 satır) da uzadı:** 390 px'te 554 → 586 px (%+5,8); metin yeri ve düzen aynı, düz kâğıt bandı 1,28× uzun.
  Sebep: uzun satırlarda alt çiçeklere değmemek için metnin alt sınırı görüntünün %72 satırı. Gerilen bantta kâğıt dokusu dikey
  liflenir (10 uzun satırda ~4×; DPR 3'te yakından bakınca görülüyor); ek yerleri gözle bakınca görünmedi. Kullanıcı/QA gözüyle
  bakılmalı; istenmezse 1–3 satır için eski mutlak düzen geri getirilebilir (o zaman 1–3 uzun satır yine taşar).
- `theme-check`'in kart serbest bölge denetimi kart boyunu görüntüye doğrusal eşliyor → uzamış kartta yaklaşık (03'te geçti);
  kesin denetim `g055-browser` piksel testi.
- Denenmedi: sosyal ağ kazıyıcıları (Facebook/WhatsApp/iMessage) ve gerçek tarayıcı sekmesi ikonu; Vercel'de yeni izleme (yalnız
  yerel build + trace-check; yayın bu görevin işi değil); gerçek telefon fotoğrafı (telefon boyu = örneklerin 3× büyütülmüşü, gerçek
  fotoğraf daha ağır olur) ve gerçek telefon/ağ; iOS Safari `sizes=auto` (desteklemezse `100vw` → eskisinden fazla değil).
- `scripts/seed.ts` (yazma alanım dışında) fotoğrafları hâlâ tek dosya saklıyor: tohum demo sitesi ve `theme-check`'in fotoğraflı
  ölçümü (1292/1259 KB) `srcset`'siz.
- Gözlem (değiştirilmedi): `api/edit/*` paketleri ~49 MB — sharp'ın `linuxmusl-x64` ve `wasm32` ikilileri de izleniyor.

**Önerilen (entegratör):**
- docs/11 (yazma alanım dışında): §3.1 ("G055 main'e girene kadar … etiket yoktur" → motor yazıyor; `apple-touch-icon` yok), §6
  (alıcı fotoğrafı artık türevli; ölçüm tablosu yukarıda), §9/§12 (program ≤ 10; zorlama kaydı 12 → 10 satır; 03 kartı 3 dilimle
  uzuyor), §14 #6/#7/#9/#10 "yapıldı (G055)"; docs/10 §2c (Vercel paketleri). 03 tema `README.md`: "Program 7+ satırda Details
  kartına sığmaz" satırı artık yanlış.
- Önerilen görevler: (a) `scripts/seed.ts` → `preparePhoto` + `savePhoto({width, variants})` (claude-kod); (b) `theme-check` kart
  serbest bölge denetimini piksel yöntemine ya da uzayan kart eşlemesine çevir (claude-kod, G052 devamı); (c) yeniden yayın (G049)
  sonrası canlıda `og:image` ve ikon, gerçek telefonda fotoğraflı ilk görünüm; (d) `name_display` ≤ 85 kararının onayı.

## Günlük
- 2026-10-13 alindi: wf-hazirlik
- 2026-10-13 bitti, incelemeye gönderildi
