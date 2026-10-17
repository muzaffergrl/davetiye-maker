---
id: G138
baslik: Yeni içerik bölümleri — Ulaşım & Konaklama, Yemekli mi? + Menü, The Day/Details'te 0–10 içerik bloğu
rol: claude-kod
durum: bitti
alan: claude-G138
oncelik: 1
bagimli: [G127, G128, G068]
yazar: [docs/03_URUN_ICERIK_SEMASI.json, docs/11_TEMA_STANDARDI.md, tools/validate_content.py, platform/lib/, platform/components/panel/, platform/public/static/extras.css, platform/themes/*/details.html, platform/themes/*/theme.json, platform/tests/, platform/previews/g138/, platform/README.md, gorevler/G138-icerik-bolumleri.md]
---

## Amaç
K45 (4), (8), (9). Kullanıcı: "Ulaşım ve Konaklama detayı ekleyebilsin isteğe göre kullanıcı kendi panelinden." · "Kullanıcı paneline
yine bir de yemekli mi diye seçenek sunalım. ona göre isterse menüyü falan girebilsin." · "the day details sayfasına 10 adede kadar
içerik ekleyebilsin kullanıcı … isterse 1-2 veya hiç de olabilsin isterse 10 adede kadar da olabilsin."

## Sonuç
**2026-10-17 · claude-G138 — durum: inceleme.** Dal `claude/g138-icerik-bolumleri` (taban `main` d5bbc39). Yayın yok, main yok.

**Veri (docs/03 + `lib/content/schema.ts` senkron, `sync-schema.cjs`):** `travel` = `airport` / `parking` / `shuttle` / `taxi`
(her biri `{text ≤300, link}` ya da null) + `stays` 0–6 (`name` zorunlu ≤80, `address`, `link`, `code` = indirim kodu / oda bloğu,
`note`, `distance`); bölümün aç/kapası mevcut `optional_blocks.travel_stay`, eski `urls.accommodation` düğmesi aynı bölümde kalır.
`meal` = `served` (true / false / null — yalnız true gösterilir), `courses` ≤6 başlık × ≤10 kalem, `note` (diyet). `details_blocks`
0–10 (`title` zorunlu ≤60, `text` ≤600, `link`, `link_label`, `icon` 10 ikondan biri). İş kuralları (TS + Python): boş konaklama adı,
boş menü başlığı/kalemi, boş blok başlığı hata. `CONTENT_LIMITS` = şema (mevcut test). Eski kayıtlar göçsüz: alan yoksa hiçbir şey
değişmez.

**Misafir sitesi (ortak motor bloğu, G127 yaklaşımı):** `lib/theme/extras-block.ts` + motor işaretleri `data-travel`, `data-menu`,
`data-blocks` (`data-pex-btn` = temanın küçük düğme sınıfları, `data-pex-title` isteğe bağlı). Görünüm değerleri `travel_block`,
`menu_block`, `info_blocks`. Stil `/static/extras.css` (3,9 KB, JS yok) yalnız bloğu olan sayfaya eklenir; renk/yazı
`inherit`/`currentColor`, ayar `--pex-*`; temaların `site.js`/`site.css`'i değişmedi. Her temanın details.html'inde: mekândan sonra
"Good to know" bölümü (temanın registry kabı: süs + `data-step="body"`), Travel & Stay bölümü artık `travel_block` ile açılır (eski
not/düğme yalnız link varken) + `data-travel`, ardından "The Menu" bölümü (`data-copy="menu_title"`) + `data-menu`. Blok sözcükleri
temanın düzenlenebilir metinleri (G068) — işaretin içinde `<span data-copy>` olarak; 21 theme.json'a 13 anahtar eklendi (5 dile
çeviriye hazır). Teşekkür modunda üçü de gösterilmez; boşsa sayfada iz yok (CSS bile yüklenmez). Bağlantılar yalnız güvenli
http(s)/mailto/tel, hepsi `target=_blank rel="noopener noreferrer"`; metin kaçışlı, `white-space: pre-line`, `overflow-wrap: anywhere`.
Şifreli site / panel önizlemesi aynı motoru kullandığı için ek iş gerekmedi.

**Panel (Details sayfası, K29 sırası: Details → Good to know → Travel & stay → Meal & menu → Questions & answers):**
`components/panel/ExtrasFields.tsx`. Good to know: 6 tek dokunuşluk fikir (Dress code, Children, Gifts, Parking, Weather, Photos),
blok başına başlık/metin/ikon/link (+ link metni), taşı/sil/geri al (RepeatableItem), en çok 10. Travel & stay: aç/kapa, eski link,
"Getting here" 4 not + link, "Places to stay" 0–6 kart. Meal & menu: "Is a meal served?" (Not shown / Yes / No); Yes → "Start a menu"
(Starter/Main/Dessert), başlık + yemek satırları, diyet notu, **"Add a meal choice question to RSVP"** (`lib/panel/meal-question.ts`:
Main başlığındaki yemeklerden ya da Meat/Fish/Vegetarian; G128 soru sistemine `choice` sorusu; zaten varsa ya da form doluysa
eklemez, yalnız dokununca). Hata yolları `sectionForPath`/`fieldLabel` ile doğru bölüme gider.

**Testler:** `npm ci`, `npm run typecheck` temiz; `tests/g138-extras.test.ts` 4/4 (şema + kurallar, **21 tema**: boş içerikte iz yok /
dolu içerikte 10 blok + 6 konaklama + menü, kaçış, güvensiz link düşer, copy etiketleri, teşekkür modu, served false/null, travel
kapalı, RSVP kısa yolu). `g066-panel-pages` testi yeni Details sırasına güncellendi. Tam `npm test` 1265 testten 1264 geçti, tek
düşen bu sıra testiydi (güncellendi, tek başına 5/5); `npm run build` + trace-check temiz. Playwright 390 px (`previews/g138/`):
olive-ivory, art-deco-black-tie, blush-garden-rose, crimson-rose-atelier, midnight-garden details — 10 blok + uzun başlık + boşluksuz
uzun metin + 2 konaklama + 3 başlıklı menü: yatay taşma yok, konsol hatası yok. Panel 390 px (`panel_details_390.jpg`): bölümler
görünür, taşma yok; "Add a meal choice question to RSVP" dokunuşu taslağa `Meal choice` sorusunu yazdı.
`theme-check --stress --no-video` yalnız 2 temada: midnight-garden **127/127**; olive-ivory **126/130** — düşen 4 kontrol
home sayfasında ("draft preview, no photos": davet kartı tarih metni boyalı süsün üstünde, piksel testi). G138 home şablonuna ve
home'daki metinlere dokunmadı (yeni anahtarlar yalnız `details`); tabanda aynı testin koşulmadığını, yani önceden var olduğunun
doğrulanmadığını not ediyorum. Details sayfası iki temada da 360/390 + stres + teşekkür modunda temiz.
**Yapılmayan:** 21 temada `theme-check --stress` ve tam Playwright süitleri (görev gereği); gerçek cihaz testi.

**Alıcı etiketleri (START HERE için):**
- Panel, yeni bölümler: **"Good to know"** (Short blocks on your Details page, such as dress code, children, gifts, parking or the
  weather. None, a few or up to 10.) — "+ Dress code", "+ Children", "+ Gifts", "+ Parking", "+ Weather", "+ Photos", "Add a block",
  "Block N", "Title", "Text", "Icon" (No icon, Info, Dress, Children, Gift, Car, Weather, Camera, Music, Glass, Heart), "Link",
  "Link text", "This section holds 10 blocks at most."
- **"Travel & stay"** (Details'ten taşındı): "Show travel & stay" (Guests see it on the Details page. Empty parts are not shown.),
  "Travel & stay link", "Getting here": "Airport & station", "Parking", "Shuttle", "Taxi & rideshare" + "…: link"; "Places to stay"
  (Hotels or rentals near the venue, up to 6. A booking code or room block name helps guests get your rate.), "Add a place to stay",
  "Name", "Distance", "Address", "Booking link", "Booking code or room block", "Note".
- **"Meal & menu"**: "Is a meal served?" (Not shown / Yes / No), "Start a menu", "Menu heading N", "Heading", "Dish N", "Add a dish",
  "Add a menu heading", "Dietary note", "RSVP" → "Add a meal choice question to RSVP" (snackbar: Meal choice added to your RSVP
  form; sonra: Your reply form already asks “Meal choice”. Change it under RSVP.).
- Değişen: Details bölümündeki "Travel & stay" grubu kaldırıldı (artık kendi bölümünde).
- Headings & labels (düzenlenebilir, Details): Travel & stay: “Getting here” heading / airport & station / parking / shuttle / taxi /
  “Where to stay” heading / before a booking code / link button / hotel button; Food menu: heading / before the dietary note / line
  when there is no menu yet; Details blocks: link button.
- Misafir sitesi (varsayılan metinler): "Getting here", "Airport & station", "Parking", "Shuttle", "Taxi & rideshare", "More info",
  "Where to stay", "Booking code", "Book a room", "The Menu", "Dietary needs", "A meal will be served.", "Learn more".

**Açık:** START HERE rehberleri (G131 hattı) yeni bölümleri anlatmalı; 5 dil (i18n) işinde 13 yeni copy anahtarı + panel etiketleri
çevrilecek; crimson-rose-atelier'in `copy-manifest --check`'i bu görevden önce de 3 kullanılmayan anahtar bildiriyordu (G142).

## Günlük
- 2026-10-17 entegratör onayladı
