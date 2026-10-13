---
id: G052
baslik: Tarayıcı denetimlerini her temaya açmak — theme-check / g051-browser / final-smoke `--theme <id>` (G4NN'den önce)
rol: claude-kod
durum: inceleme
alan: wf-hazirlik
oncelik: 2
bagimli: [G046, G051]
yazar: [platform/scripts/theme-check.cjs, platform/tests/g051-browser.ts, platform/tests/final-smoke.ts, platform/scripts/lib/]
---

## Amaç
`docs/11_TEMA_STANDARDI.md` §13.1/§13.3 her G4NN temasını `node scripts/theme-check.cjs --theme <slug>` ile denetletiyor; bugün
betik `blush-garden-rose`'a bağlı (`const THEME = 'blush-garden-rose'`, çıktı `previews/g038`, G035 karşılaştırması, temanın font listesi,
kart seçicileri, sayfa başlıkları). `tests/g051-browser.ts` ve `tests/final-smoke.ts` de 03'e bağlı. Bu görev bitmeden hiçbir G4NN
bitti tanımını karşılayamaz (G401–G420 `bagimli`'sinde G052 var).

## Girdiler
- `platform/scripts/theme-check.cjs`, `platform/tests/g051-browser.ts`, `platform/tests/final-smoke.ts` (bugünkü 03 denetimleri)
- `docs/11_TEMA_STANDARDI.md` §6 (ölçüm), §12, §13.3–§13.4 (denetlenecekler, önizleme dosyaları)
- `platform/themes/blush-garden-rose/img/manifest.json` (`free_zone`, `photo_slots`, `stage`), `theme.json`

## Yapılacaklar
1. `theme-check.cjs --theme <id>` (varsayılan `blush-garden-rose`, bugünkü davranış aynen korunur):
   - tema `theme.json` + `img/manifest.json`'dan okunur; font listesi sayfadaki Google Fonts `<link>`'inden (aile + ağırlık);
   - kart metni ↔ `free_zone` eşlemesi manifest'ten (kart seçicisi → manifest anahtarı tablosu temanın README'sinde ya da
     manifest'te tanımlanır; sabit 03 seçicisi kalmaz); sayfa başlıkları şablonun `data-text`'inden;
   - karşılaştırma görselleri W1 comp'larıyla (`collections/NN_*/assets/gpt/comps/web_<n>_*.png`, yalnız sade ad; `_vN` alınmaz):
     `compare_<sayfa>_390.jpg` = comp | tema; 03 için bugünkü G035 karşılaştırması ayrı bayrakla kalabilir;
   - çıktı `previews/<görev>/` (`--out` ya da `THEME_SHOTS_DIR`), `checks.json` aynı biçimde;
   - "first view" ölçümü iki kez: yer tutucularla **ve** tohumlanmış PAKET 2 fotoğraflarıyla (docs/11 §6), ikisi de `checks.json`'a.
2. `g051-browser.ts --theme <id>` ve `final-smoke.ts --theme <id>`: aynı genelleştirme (03'e özgü seçiciler tema README'sindeki
   ya da manifest'teki tabloya taşınır); SSS sorusunun erişilebilir adı (CDP `Accessibility.getFullAXTree`) bütün temalarda denetlenir.
3. Ortak yardımcılar (sunucu başlatma, tohumlama, taşma ölçümü) gerekiyorsa `platform/scripts/lib/` altında.
4. `blush-garden-rose` ile üçü de bugünkü sonuçları verir (69/69, 44/44, 42/42 ya da gerekçeli yeni sayı); `_sample` ile en azından
   çalışır ve anlamlı hata/uyarı verir.

## Bitti sayılması için
- [x] Üç betik `--theme` alıyor; 03 sonuçları değişmedi; `_sample` ile koşuldu
- [x] docs/11 §13.1'deki komut olduğu gibi çalışıyor; çıktı `previews/<görev>/`
- [x] Sonuç dürüst: hangi denetim hâlâ temaya özgü tablo istiyor, G4NN ajanı ne yazmalı

## Sonuç
**Yapıldı (2026-10-13, wf-hazirlik).** Üç tarayıcı denetimi `--theme <id>` alıyor (varsayılan `blush-garden-rose`; `--theme=<id>`
biçimi de). Temaya özgü her şey temadan okunuyor; seçiciler docs/11 §3'ün zorunlu işaretlerinden geliyor, 03'e özgü seçici
(`.invite`, `.info`, `.card`, `.env-head`, `.env-cflap`, `.env-after`, `.hero`, `.invite-sec .cal`, `.faq-item`, `.questions`,
`.reply-box`, `.closing`, `.rsvp-text`, `.foot`, `#invitation`, `.teasers-sec`, `.venue-photo`) kalmadı.

Dosyalar:
- `platform/scripts/lib/theme-env.ts` (yeni) — tema ortamı: `theme.json`, `img/manifest.json` (`free_zone`'lu parçalar + isteğe bağlı
  `theme_check` tablosu), demo kaydı (`--content` → tema `content.demo.json` → `lib/claim/demo` paketli kopya → koleksiyon kaydı → 03
  kaydı, not düşülür), PAKET 2 fotoğrafları (`--photos` → `collections/<NN_*>/assets/gpt/photos/<anahtar>.*` → 03 örnekleri, not),
  koleksiyon (`--collection` ya da `tools/katalog.py` `tema_slug` → `klasor`), W1 comp'ları (yalnız sade adlar), sayfa başlıkları
  (şablonun `<title data-text>`'i), Google Fonts `<link>` (aile + ağırlık), motordan bağımsız biçimleyici (en-US / en-GB,
  türetilmiş alanlar `date_weekday`, `date_long`, `venue.city_region(_country)`, `countdown_target_utc`), demo slug'ı.
- `platform/scripts/lib/browser.ts` (yeni) — Playwright yükleme, `next start`, `markCards` (kart = `free_zone`'lu parçanın `<img>`'i;
  `<picture>` dahil üst öğesi metni taşır; `theme_check.cards` verilirse o seçiciler), `overlaps`.
- `platform/scripts/theme-check.cjs` — `--theme`, `--out` (yoksa `THEME_SHOTS_DIR`, yoksa 03 → `previews/g038`, katalog tasarımı NN →
  `previews/g4NN/`, diğer → geçici klasör), `--compare w1|g035|none` (varsayılan `w1`: `compare_<sayfa>_390.jpg` = W1 comp | tema; 03'te
  W1 comp yok → varsayılan `g035`, bugünkü karşılaştırma), `--content`, `--photos`, `--collection`, `--no-video`. Kart metni ↔
  `free_zone` manifest'ten (otomatik tespit), font listesi sayfanın link'inden, başlıklar `data-text`'ten, foto alanları
  `theme.json`'dan, geri sayım hedefi ve saat denemeleri içerikten (tarih + tören saati + saat dilimi), "eski içerik kalmadı"
  denetimi demo kaydının isim/mekân/şehrinden, video yolu kart/link/`[data-slot="venue"]`'dan. Eksik standart öğe zaman aşımı
  yerine "no .stage — … (docs/11 §3.2)" diye düşer; akışlar birbirinden bağımsız (biri düşerse diğerleri koşar); şablonun yapısal
  eksiği (font link'i, `.ph-mark`) sayfa başına bir kez yazılır. `checks.json` biçimi aynı (+ `info.setup`, `info.envelope_backdrop`,
  `info.compare`, `first_view_*_kb_photos`).
- `platform/tests/g051-browser.ts`, `platform/tests/final-smoke.ts` — aynı genelleştirme (`--theme`, `--out`): takvim `a[data-calendar]`,
  SSS `details[data-repeat-item^="faq."]` (soru `[data-field$=".q"]`, yanıt `[data-field$=".a"]`), sorular `fieldset[data-rsvp-question]`,
  form kutusu `[data-rsvp]`; SSS sorusunun erişilebilir adı (CDP `Accessibility.getFullAXTree`) her temada; final-smoke demo sitesi
  temanın kendi kaydı + fotoğraflarıyla, alıcı yolu tasarım adını `theme.json`'dan alır, `internal` temada atlanır (SKIP).

**Sonuçlar (Node 22, `npm run build` sonrası `next start`, Playwright `/opt/pw-browsers`):**
- Önce (main, değişiklik yok): theme-check 69/69, g051-browser 44/44, final-smoke 42/42.
- Sonra, `blush-garden-rose`: **theme-check 74/74, 0 uyarı** (video dahil); **g051-browser 44/44**; **final-smoke 42/42**.
  Eski 69 denetimin hepsi aynı sonuçla duruyor (kart sayısı da aynı: index 1, home 2, details 1, rsvp 1); 5 yeni satır, hepsi docs/11'den:
  fontlar (≤ 3 aile, `display=swap`, §3.1/§6), seed (5 foto alanına 5 örnek foto), foto alanı kapsamı (her `theme.json` alanı bir
  sayfada, §3.2/§9), ilk görünüm **fotoğraflı** index 1289 KB / home 1257 KB (§6 ikinci ölçüm; yer tutuculu 1020 / 710 KB). Kısa
  telefon satırları artık yatay kaydırma yok + kapalı zarf ve "Tap to open" ekranda (§13.3) da denetliyor (03 geçti). Yeniden
  adlandırılan iki g051 satırı: "the two buttons do not overlap each other or a painted card" (eski: yan yana — tasarım kararı,
  standart değil; standart "kart dışında") ve "the question's sign changes when it opens" (eski: `::after` dönüşü — standart
  `content` ya da `aria-hidden` glif ikisine de izin veriyor).
- `_sample` (iskelet tema, standartta değil): üçü de çökmeden koşuyor ve nedenli hata veriyor — theme-check 33 geçti / 27 hata /
  11 uyarı (standart dışı foto anahtarları `hero, story1…`, `<title data-text>` eksik, Google Fonts yok, `.ph-mark` yok, `.stage` /
  `[data-skip]` / `.replay` yok, kendi demo kaydı / koleksiyonu / W1 comp'u yok, `internal` → /start demo atlandı); g051-browser 4/16
  (takvim, SSS, sorular, panel bölümleri yok: "the theme has no faq marker (docs/11 §3.5)"); final-smoke 3/4 (`no .stage`), alıcı
  yolu SKIP.
- Ek deneme (commit'lenmedi, sonra silindi): 03'ün kopyası geçici `themes/olive-ivory` olarak — koleksiyon 01 katalogdan bulundu,
  01 demo kaydı (G053 hikâyesiyle) kullanıldı, 01 PAKET 2 foto yok → 03 örnekleri (uyarı), **W1 `compare_*_390.jpg` 5/5 yazıldı**;
  72/73, tek hata beklenen: tema kendi `content.demo.json`'ı olmadığı için /start'ta yok (404 + nedeni yazılıyor).
- `npm test` 230/230, `npm run typecheck` temiz, `npm run build` + trace-check geçti.
- G053 + G054 `main`'e girdikten sonra rebase edilip hepsi yeniden koşuldu: aynı sayılar (74/74, 44/44, 42/42; `_sample` 33/27/11,
  4/16, 3/4). G054 `img/manifest.json`'a kendi yapı sonucu için `checks` anahtarını koyduğu için bu görevin tablosu `theme_check` adını aldı.
- Önizlemeler `--out` ile scratch klasörüne yazıldı; `platform/previews/` bu görevde değişmedi (yazar alanı dışında).

**Denenmedi:** gerçek bir G4NN teması (henüz yok); koyu tasarımda (06, 19) zarf zemini eşikleri; kartı CSS zemini olan tema
(`theme_check.cards` yolu); açılmış kapı/kitap düzeni (yalnız oturum anahtarıyla "açık" başlatılan sayfa ölçülüyor); `en-GB` kayıtla
tam koşu (biçimleyici destekliyor, tarayıcıda denenmedi).

**Hâlâ temaya özgü tablo isteyen yerler — G4NN ajanı ne yazar** (`img/manifest.json` → `"theme_check"` — G054'ün yapı sonucu `checks` anahtarından ayrı; `build_images.py` yazar; hepsi
isteğe bağlı, varsayılanlar `scripts/lib/theme-env.ts` başında):
1. `cards` `{ "<seçici>": "<manifest anahtarı>" }` — yalnız kart `<img>` değilse (CSS zemini) ya da metin `<img>`'in üst öğesinde
   değilse. Aksi hâlde hiçbir şey yazma; theme-check bulamadığı `free_zone`'u uyarı/hata olarak söyler.
2. `particles` — JS parçacık katmanının seçicisi (varsayılan `.petal-layer, .accent-layer`; yeni temada katmana `accent-layer`
   sınıfı vermek yeter).
3. `envelope_text` `{closed, opened}` — varsayılan `.stage` dışındaki `h1, p` ve `.replay`.
4. `backdrop` `{edge_max, dark_max, dark_below, light_above}` — zarf yazısı altındaki zemin ölçümü 03'ün açık zeminine ayarlı; koyu
   tasarım kendi ölçümünden (`checks.json` → `info.envelope_backdrop`) eşik yazar.
Bunun dışında tema standart işaretleri taşımalı: `.stage`, `a[data-skip]`, `a[data-enter]`, `.replay`, `nav.site-nav`,
`[data-slot]` + `img[data-photo]` + `.ph-mark`, `img/ph_<anahtar>-*.webp`, `[data-countdown]` + `.cd-done[data-when]`, `a[href="#reply"]`,
`[data-rsvp]`, `a[href="index.html?replay=1"]` (home + rsvp), `data-scene`/`data-step`, `html[data-rsvp-replied]`, "Tap to open" metni.

**Önerilen düzeltmeler (yazar alanım dışında, entegratör):**
- `docs/11_TEMA_STANDARDI.md` §13.1'deki "**`--theme` bugün yok**" paragrafı ve §14 #3 güncellenmeli; §13.3'e `img/manifest.json`
  `theme_check` tablosu (yukarıdaki 4 anahtar) ve `--out`/`--compare` eklenmeli.
- `platform/README.md` "Çalıştırma" satırları (theme-check / final-smoke / g051-browser: `--theme`, `--out`) ve dizin notu
  (`scripts/lib/`) güncellenmeli.
- 03'ün `build_images.py`'si `theme_check` yazmıyor — gerekmiyor (otomatik tespit 03'te birebir aynı kartları buluyor); yalnız
  03'ün parçacık katmanı `.petal-layer` varsayılan listede duruyor. 03 yeniden derlenirken `theme_check.particles` yazılırsa
  varsayılandan çıkarılabilir (küçük iş, ayrı görev gerekmez).

**İnceleme düzeltmeleri (2026-10-13, wf-hazirlik; G052–G055 incelemesinin bulguları)**
- **Uzayan kartın serbest bölge denetimi (orta, doğrulandı):** satırlar kart `<img>` kutusuna doğrusal eşleniyordu → G055'in 3
  dilimli kartında (03 Details, şimdi home davet kartı da) gerilen banttaki satırlar alt çiçek satırlarıyla karşılaştırılıp yanlış
  FAIL veriyor, `<img>` kutusunun altındaki satırlar hiç denetlenmiyordu. Şimdi: kart görüntüsünün boyundaysa eskisi gibi
  `free_zone` eşlemesi; görüntüsünden uzunsa (**piksel testi**, `g055-browser` yöntemi temaya bağımsız) kart görüntüsü ve kendi
  `::before/::after` dilimleri dışında her şey (metin, iç süs, foto, site nav, parçacıklar) gizlenip boyalı kart yakalanır, her satır
  kutusunun altı kartın ortasındaki kâğıt rengiyle karşılaştırılır; ölçülen kutunun dışındaki satır her iki yolda **hata**
  (eskiden atlanıyordu). Manifest'e dilim tablosu gerekmedi.
- **Kırpılan metin (yeni denetim):** metnin kutusu onu kırpan (`overflow` ≠ visible, `clip-path`) bir atanın dışına taşarsa hata
  (03'ün varsayılan koşusunda 0).
- **`--stress` (düşük, doğrulandı):** docs/11 §12 zorlama kaydı (`scripts/lib/theme-env.ts` `stressRecord`: 40 karakterlik ilk ad
  ve tam adlar, 83 karakterlik isim satırı, 80 karakterlik mekân, 10 × 60 karakterlik etiket/yer, uzun host line ve dress code;
  şemada geçerli) 5 sayfa × 360/390 bütün sayfa denetimleriyle + zarf sayfası 360×640/390×844 (yazılar düz zeminde, zarf ve "Tap to
  open" ekranda); `stress_<sayfa>_<w>.png`. docs/11 §13.1'de G4NN için zorunlu. Ortak yardımcılar fonksiyona alındı
  (`backdropBusy`, `envelopeFit`).
- **Port (düşük, doğrulandı):** `waitForServer` yalnız "bir şey cevap veriyor mu"ya bakıyordu. Şimdi `startNext`'in süreci "Ready"
  demeden fetch etmez, süreç ölürse günlüğüyle durur ("port in use: another server listens there"). Sahte HTTP sunucusu 3591'de
  açıkken `PORT=3591 g051-browser`: tek satır `FAIL run (next start exited (1) … port in use …)`, başka sunucuya karşı hiçbir denetim
  koşmadı. `theme-check`, `final-smoke`, `g051-browser` sunucuyu veriyor.
- **Sonuçlar (03, bu düzeltmelerden sonra):** `theme-check --theme blush-garden-rose` (video dahil) **74/74, 0 uyarı**
  (G052'deki sayı; yeni denetimler mevcut satırların içinde: kart piksel testi Details ve home davet kartında, kırpılan metin her
  sayfada; ilk görünüm yer tutucu 1026 / 715 KB, fotoğraflı 1295 / 1262 KB). İlk koşuda piksel testi details@768/1280'de "Order of
  the Day"ı yanlış FAIL verdi (başlık altındaki GPT `divider` görseli gizlenmemişti) → yalnız kart görüntüsü bırakılarak düzeltildi.
  `--stress` ile 79 geçti / 20 hata — hepsi 03'ün index ve rsvp sayfası (docs/11 §12, §14 #15; home/story/details geçiyor).
  `g051-browser` 44/44, `final-smoke` 42/42 (sunucu beklemesi değişti, sonuçlar aynı).
- `_sample --stress` çökmeden koştu: 41 geçti / 29 hata / 11 uyarı = G052'deki 33/27/11 + zorlama kaydının 8 sayfası geçti, 2 hata
  (index'te standart dışı `hero` foto alanı — varsayılan koşudaki yapısal hatanın aynısı).
- **Denenmedi:** gerçek bir G4NN teması (yok); `--stress` ve piksel testi koyu tasarımda (kâğıt rengi kartın ortasından okunuyor;
  ortası süslü bir kartta referans yanlış olur — o tema `theme_check.cards`/kart düzeniyle ele alınmalı).

## Günlük
- 2026-10-13 açıldı: G046 incelemesi (docs/11 §14 #3; G4NN bitti tanımı bu araç olmadan karşılanamıyor)
- 2026-10-13 alindi: wf-hazirlik
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme düzeltmeleri (wf-hazirlik): uzayan kart piksel testi + kutu dışı satır hata, kırpılan metin denetimi, --stress (§12 zorlama kaydı), port doluysa durur; 03 74/74
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 son denetim (wf-hazirlik, temiz origin/main worktree): theme-check --theme blush-garden-rose 74/74 (video dahil), --stress --no-video 79/20 (03 index + rsvp, §14 #15), _sample 33/28/11 (video açık: +1 recording hata), g051-browser 44/44, final-smoke 42/42 — Sonuç'la tutarlı
