---
id: G084
baslik: 02, 04, 05 temalarına RSVP misafir adları satırı (G069 `data-rsvp-party` şablonu + `form_party` copy anahtarı)
rol: claude-kod
durum: bitti
alan: claude-G084
oncelik: 2
bagimli: [G069, G081]
yazar: [platform/themes/dusty-blue-champagne/, platform/themes/vintage-airmail-love-letter/, platform/themes/mediterranean-lemon/, platform/tests/, platform/previews/g084/]
---

## Amaç
G069 RSVP v2 ile misafir 2+ kişi seçince "Name of guest 2/3…" alanları açılıyor (`<template data-rsvp-party>`), panel kişi başına satır
gösteriyor. 01 ve 03'te var; 02, 04, 05'te yok (G081 Sonuç'u) → bu temalarda ek misafir adları toplanmıyor.

## Yapılacaklar
1. Her temanın `rsvp.html` formuna 01/03'teki gibi `<template data-rsvp-party>` satırı, temanın kendi form stilinde (yeni görsel yok).
2. `form_party` vb. copy anahtarları + manifest (`node scripts/copy-manifest.ts --theme <id>`), `--stress` ile `max`.
3. İlk ekran/nav kuralı ve RSVP katlama ölçümleri bozulmaz (tema testleri). g069-browser'ı üç temaya genişlet (3 kişilik yanıt isimlerle).
4. 04 için G404 onayından sonra. Önizleme `platform/previews/g084/` (390). Sonuç, Günlük, bitir.

## Sonuç

### Tur 1 — 02 dusty-blue-champagne ve 05 mediterranean-lemon (04 bekliyor)
Commit'ler: 608565a (alındı), b52996a (şablon + manifest + testler), + bu Sonuç / önizleme commit'i. Motor, panel, `form.js`,
`lib/`, `scripts/` değişmedi (yazma alanı dışı dosya yok). Yayın yapılmadı.

**Yapılan (01/03'ün G069 sözleşmesi aynen; K21: yeni görsel yok)**
- İki temanın `rsvp.html` formunda guests hata yerinin hemen ardından, soruların önünde `<template data-rsvp-party>`: tek
  `label.field` (`.kicker` içinde `form_party` "Name of guest" + `[data-rsvp-party-number]` + `.opt` `form_optional`), adsız
  `input type="text" maxlength="120"`, `p.field-error[data-rsvp-error-for="party"]`. `/rsvp/form.js` 2+ kişide "Name of guest 2/3…"
  satırlarını açar, `party: [...]` gönderir, "no"da formdan çıkarır (yazılan kalır).
- Stil: temanın kendi `.field` / `.kicker` / `.opt` / input kuralları — **`site.css` ve `site.js` tek bayt değişmedi** (02: 46 001 /
  35 814 B, 05: 46 070 / 35 831 B; paylar aynı: CSS 79 / 10 B, JS 26 / 9 B). 02'nin ≥ 960 px iki sütunlu formunda satırlar tam
  genişlik (yalnız ilk iki `label` yan yana, `nth-of-type(-n+2)`); `<template>` ızgarada yer tutmaz.
- Satır, temanın diğer form alanları gibi `data-fold` taşır: yüklenişte satır yok (ilk ekran ölçümleri aynı); satırlar açıkken
  ekran döner / boyut değişirse 02 `foldAll`, 05 `folds` onları da nav çizgisine göre katlar.
- Copy: `form_party` (standart anahtar, `max` 24) `copy-manifest.ts` ile iki temanın `theme.json`'ına → **71 anahtar** (`--check`
  temiz, işaretsiz metin 0). `max` 24 korundu: her anahtar `max`'ta (`form_party` 24 + numara + `form_optional` 20) satırlar
  açıkken 360/390'da etiket iki satıra sarar, kutunun içinde, kesilme ve yatay kaydırma yok, girişler tam genişlik (aşağıda).
- README'ler: dosya tablosu, anahtar sayısı 71, "Misafir adları (G069 satırı, G084)" bölümü.

**Testler (bu dalda, Node 22, `/opt/pw-browsers`, PORT 4205x)**
- `npm test` **567/567**; `npm run typecheck` temiz; `npm run build` + trace-check geçti (16 rota, 6 tema).
  `g069-rsvp.test.ts` şablon sözleşmesi testi 01/03 + **02/05** (tek input, adsız, maxlength 120, numara, hata yeri, guests ile
  sorular arasında); `g068-copy.test.ts` yorum güncellendi (RSVP render testi `form_party`'yi 02/05'te de doğruluyor).
- `theme-check --stress --no-video`: **dusty-blue-champagne 127 / 0 uyarı / 0 hata**, **mediterranean-lemon 127 / 0 / 0** (copy 71
  anahtar `max`'ta, teşekkür hâli dahil; RSVP akışı 2 kişilik yanıtla — satır açık — kaydedildi). İlk görünüm 02 index 921 / home
  1015 KB (yer tutucu), 982 / 1150 KB (foto); 05 878 / 885, 973 / 1142 KB (G081 ile aynı); dokun → home 02 3,9 s, 05 4,3 s.
- `tests/g069-browser.ts` (genişletildi, 4. bölüm G084): tam koşu **98/98** (G069'un 60'ı + G084'ün 38'i). Her iki temada: 2+
  kişiden önce satır yok → "3" → "Name of guest 2 (optional)", "… 3 (optional)" → satırlar temanın alan stilinde (etiket fontu/
  boyu/aralığı/rengi, input fontu/çerçevesi/yarıçapı/zemini, genişlik, yükseklik, üst boşluk = guests alanı) ve guests'in hemen
  ardında → "no" çıkarır, "yes" yazılanı geri getirir → yatay kaydırma yok → gönder → `party ["Arthur Hartley","Mae Hartley"]`,
  guests 3 → "Send another reply" satırsız → panel kartı "With Arthur Hartley and Mae Hartley", açınca 3 kişi, "3 Guests coming" →
  **CSV kişi başına satır (Evelyn, Arthur, Mae; "Party size" yalnız ilk satırda 3)** → her anahtar `max`'ta 360/390 ölçümü; konsol
  hatası yok. `G084_THEMES=<id,…>` yalnız bu bölümü koşar (04 turu için); çıktılar `previews/g084/` (ya da `$G084_SHOTS_DIR`).
- `final-smoke --theme` 02 **45/45**, 05 **45/45**; `g051-browser --theme` 02 **44/44**, 05 **44/44**; `g068-browser`
  (`G068_THEMES` 02/05) **16/16**; tema testleri (`npm test` içinde; "nothing half under the nav … RSVP signature + seal before
  the fold") geçti.
- Kendi ölçümüm (commit'lenmedi): RSVP × 13 boyut (320×568 … 1920×1080, yatay dahil) × 2 tema — yüklenişte ve satırlar açıkken
  yeniden boyutlandırmadan sonra nav çizgisini kesen `[data-fold]` birimi **0**; 02 masaüstünde (1024×768, 1280×800, 1440×900,
  1920×1080) satırlar ilk ekranda ve temiz, 1280×650'de ilk ekranın altına katlanıyor.

**Önizlemeler** `platform/previews/g084/` (PNG, 1,1 MB): `01_form_party_<02|05>_390` (form: ad, e-posta, katılım, 3 misafir, iki
isim satırı), `02_panel_party_card_<02|05>_390` (panel kartı, açık), `03_form_party_stress_<02|05>_360` (her metin `max`'ta),
`checks.json` (38/38).

**Açık / denenmedi**
- **04 vintage-airmail-love-letter bekliyor** (G404 / G081'in 04 turu sonrası; bu turda dokunulmadı). Aynı adımlar: şablon,
  manifest, `PARTY_THEMES`'e bir satır, `G084_THEMES=vintage-airmail-love-letter`.
- Gerçek iPhone/Safari ve Android Chrome, Vercel yayını denenmedi (Chromium emülasyonu).
- `docs/11` §3.3'te parti satırı (G069) anılmıyor (yazma alanı dışı) → entegratör: "isteğe bağlı `<template data-rsvp-party>`,
  örnek 01/02/03/05" eklenebilir.

### Tur 2 — 04 vintage-airmail-love-letter (G081'in 04 turuyla birlikte)
Commit'ler: 1a932fd (şablon + `form_party` + manifest + testler, G081 04 turuyla tek commit), + bu Sonuç / önizleme commit'i.
Motor, panel, `form.js`, `lib/`, `scripts/` değişmedi. Yayın yapılmadı.

**Yapılan (01/03'ün G069 sözleşmesi aynen; K21: yeni görsel yok)**
- `rsvp.html` formunda guests hata yerinin hemen ardından, soruların önünde `<template data-rsvp-party>`: tek `label.field`
  (`.kicker` içinde `form_party` "Name of guest" + `[data-rsvp-party-number]` + `.opt` `form_optional`), adsız
  `input type="text" maxlength="120"`, `p.field-error[data-rsvp-error-for="party"]`. Temanın kendi `.field` / `.kicker` / `.opt` /
  input kuralları — yeni CSS ve JS yok.
- 04'te yanıt kutusu (`.reply-box`) tek ilk ekran birimi (`data-fold`); satırlar kutunun içinde olduğu için **kendi `data-fold`'ları
  yok** (02/05'te alanlar tek tek birimdi): kutu bütün olarak ya yerinde kalır ya katlanır, satır açılınca kutu aşağı uzar.
- Copy: `form_party` (standart, `max` 24) ve `form_optional` (formda 3 kez); `theme.json` → 74 anahtar (G081 turu). Başlıktaki
  açıklama yorumunda `data-rsvp-party` yazmıyor (sözleşme testi ilk geçişi `name="guests"`'ten sonra arar).

**Testler (Node 22, PORT 4208x)**
- `g069-browser` (`G084_THEMES=vintage-airmail-love-letter`, PNG + `checks.json` geçici klasöre, sonra buraya): **19/19** — 2+
  kişiden önce satır yok → "3" → "Name of guest 2 (optional)", "… 3 (optional)" → satırlar temanın alan stilinde (Special Elite,
  çerçeve, yarıçap, zemin, genişlik, üst boşluk = guests alanı) ve guests'in hemen ardında → "no" çıkarır, "yes" yazılanı geri
  getirir → 390'da yatay kaydırma yok → gönder → `party ["Arthur Hartley","Mae Hartley"]`, guests 3 → "Send another reply"
  satırsız → panel kartı "With Arthur Hartley and Mae Hartley", 3 kişi, "3 Guests coming" → CSV kişi başına satır (Party size
  yalnız ilk satırda 3) → her anahtar `max`'ta 360/390, satırlar açık: etiket kutuda iki satıra sarar, kesilme yok, girişler tam
  genişlik → konsol hatası yok.
- `g069-rsvp.test.ts` şablon sözleşmesi 01–05; `g068-copy.test.ts` RSVP render testi `form_party`'yi 04'te de doğruluyor
  (`form_optional` 3). `npm test` **575/575** (birleştirme sonrası 582/582), typecheck temiz, build geçti; `theme-check --stress` **127/0/0** (RSVP akışı 2
  kişilik yanıtla — satır açık — kaydedildi); temanın dosyası 33/33 ("RSVP signature + seal before the fold" dahil).
- İlk ekran: davet hâlinin yerleşimi HEAD ile aynı (G081 Sonuç: 405 yüklemenin 404'ü birebir, 1'i 1 px); her metni `max`'ta zorlama
  kaydıyla RSVP × 27 boyut — nav çizgisini kesen parça 0 (satırlar kapalıyken; formun kendisi tek birim).

**Önizlemeler** `platform/previews/g084/`: `01_form_party_04_390.png` (ad, e-posta, katılım, 3 misafir, iki isim satırı),
`02_panel_party_card_04_390.png` (panel kartı, açık), `03_form_party_stress_04_360.png` (her metin `max`'ta); `checks.json` üç
tema (02, 05, 04), 57/57.

**Açık / denenmedi:** gerçek iPhone/Safari ve Android Chrome, Vercel yayını (Chromium emülasyonu). Satırlar açıkken ekran
döndürülünce yanıt kutusu bütün olarak yeniden katlanır (satır tek tek değil) — ölçülmedi, `folds` aynı kodla çalışır.

## Günlük
- 2026-10-14 açıldı (entegratör): G081 Sonuç önerisi
- 2026-10-14 alindi: claude-G084 (G081'in 02/05 turu onaylı; bu tur yalnız 02 ve 05, 04 G404/G081 04 turundan sonra)
- 2026-10-14 claude-G084: 02 ve 05 tamam; 04 bekliyor
- 2026-10-14 entegratör: 02/05 turu kabul (theme-check 127/0/0, g069-browser 98/98); docs/11 §3.3'e misafir adları kuralı eklendi. 04 turu G404 onayından sonra (G081 ile birlikte).
- 2026-10-15 claude-G084: 04 turu tamam (G081 04 turuyla birlikte): `<template data-rsvp-party>` + `form_party`; g069-browser G084 04 19/19, npm test 582/582, theme-check 127/0/0; docs/11 §3.3 örnek listesi 01–05
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
