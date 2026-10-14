---
id: G081
baslik: 02, 04, 05 temalarına teşekkür hâli (docs/11 §3.6) ve düzenlenebilir metinler (§3.7 data-copy + manifest)
rol: claude-kod
durum: alindi
alan: claude-G081
oncelik: 2
bagimli: [G075, G068, G402, G405]
yazar: [platform/themes/dusty-blue-champagne/, platform/themes/vintage-airmail-love-letter/, platform/themes/mediterranean-lemon/, platform/tests/, platform/previews/g081/]
---

## Amaç
G075 teşekkür modunu yalnız 01 ve 03'e uyguladı; 02/04/05 o sırada başka ajanlarda düzeltiliyordu. theme-check bunlara uyarı veriyor.

## Yapılacaklar
1. Her temaya docs/11 §3.6 işaretleri: zarf kartında teşekkür başlığı + tarih, kart penceresinde teşekkür fotoğrafı yoksa temanın süsü,
   home'da teşekkür kartı (geri sayım/RSVP/takvim yok), details "The Day" ya da gizli, RSVP "Replies are closed". Yeni görsel yok (K21).
1b. G068 kuralı (docs/11 §3.7): görünür her sabit metin `data-copy`; `node scripts/copy-manifest.ts --theme <id>` ile manifest; her anahtarın `max`'ı `--stress` ile ölçülür (taşmasın).
2. theme-check `--stress` her temada uyarısız (işaretsiz görünür metin 0); final-smoke, g075 testlerinin tema kısmı. Önizleme `platform/previews/g081/`.

## Sonuç

### Tur 1 — 02 dusty-blue-champagne ve 05 mediterranean-lemon (04 bekliyor)
Commit'ler: 457bccc (alındı), 0db3c88 (işaretler + manifest + testler), c0d75f5 (`--stress` ölçümüyle `max`'lar, 05 başlık sarma,
05 zarfa dönüş nav'ı), fc29c80 (05 RSVP kapanışı katlanır, tarayıcı testleri girişler bitince ölçer, README'ler), + bu Sonuç /
önizleme commit'i. Motor, panel, `lib/`, `scripts/` değişmedi (yazma alanı dışı dosya yok). Yayın yapılmadı.

**Teşekkür hâli (docs/11 §3.6; 01/03'ün işaret düzeni, yeni sayfa ve yeni görsel yok — K21: temaların kendi GPT parçaları)**
- **Zarf:** açılış şovu aynen; üst satır "With love and thanks" (`ty_kicker`); kartta `thank_you_title` (el yazısı, dengeli sarar;
  `fitCopy` sığmazsa küçültür, ≥ 11 px) + tarih, yer satırı yok. Pencerede teşekkür fotoğrafı (`thank_you.photo`, `srcset`'li),
  yoksa temanın süsü — 02: bokeh kâğıt (`paper-400`) + mavi mum mühür ve monogram; 05: gök mavisine dönen duvar (`wall-540`) +
  zarfın limon bağı. Asla yer tutucu.
- **Home:** hero kartı/isimler/tarih/mekân kalır; geri sayım, RSVP hapı, takvim, yanıt satırı/bölümü yok. 02: davet setinin yerine
  aynı iki kartla **teşekkür seti** (çiçekli kartın güller arasında başlık — `fitInvite`; altına sıkışan yazı kartında mesaj
  `pre-line`, dal, "With love,", isimler, tarih). 05: aynı `invitation_card` kâğıdında (3 dilim) teşekkür kartı; başlık çelengin
  altından, kâğıdın düz bölgesinde (`free_zone`'a göre `max-width: 54cqw`). Our Story kalır, The Day `!thank_you_hides_details`.
- **Details:** "The Day" (program, mekân, harita, registry); takvim, dress code, Travel & Stay, SSS, RSVP linki yok; tören cümlesi
  "began" (`ceremony_after`); çift gizlerse 404 ve hiçbir yerde link yok (story'nin kapanış düğmesi Home'a döner).
- **RSVP:** eski linkler için 200: "Replies are closed" + teşekkür başlığı + Home hapı + imza/mühür (05: limon bağı); form yok.
  02'de ≥ 960 px tek sütun. 05'te formsuz sayfada kapanış kartın hemen altına geldiği için kapanış satırları da `[data-fold]`.
- **Nav:** Details → "The Day" (`nav_day`), RSVP yok. **Meta:** `description`/`og:description` çifti (`{thank_you_title} · …`).
- Stiller ayrı `thank-you.css`'te (02: 3 056 B, 05: 2 387 B; yalnız teşekkür modunda yüklenir). `site.js` `devRender`: çoklu
  `data-if` + `{copy.…}`; bütçe içinde kalması için aynı işlevler kısaltıldı — 02 35 814 B (pay 26), 05 35 831 B (pay 9).

**Düzenlenebilir metinler (docs/11 §3.7)**
- İki temada görünür her sabit metin `data-copy` / `data-copy-attr` / `{copy.…}`; `theme.json` → `copy` **70 anahtar** her
  birinde (`copy-manifest.ts --check` temiz, işaretsiz metin 0). 05'te hepsi standart; 02'de tek tasarım anahtarı `home_day_sub`
  ("Order of the day & venue", panelde Day & place, `label`'lı) — home'daki The Day bağlantısının `aria-label`'ı artık görünür
  yazılardan (`{copy.day_title}: {copy.home_day_sub}`). 02'nin davet cümlesindeki `<br>` tasarım metninde kalır. Bilerek sabit:
  "Please turn on JavaScript…" (`data-copy-fixed`), bölge `aria-label`'ları, iç sayfaların `description` cümleleri.
- `max`'lar `theme-check --stress` (360/390, teşekkür hâli dahil) ile daraltıldı: **02** gezinme 6/6/7/6, `nav_day` 10, RSVP kart
  başlığı (`rsvp_title`, `rsvp_closed_title`) 20 (tek satır + 0,6'ya küçültme; 30'da kartın %117'si), dokunmatik zarf ipucu
  `envelope_hint_tap` 12 (40 harflik isimlerle zarf aşağı iner, 18 harfte ipucu 390×844'te sağ alt kümeye değiyordu: koyu pay
  0,13 → 12'de 0,005), `envelope_hint_click` 18 (1024×768, 1280×800, 1280×650, 1366×768'de zemin temiz). **05** gezinme 6/6/7/5
  (8 harfte satır 434 px), `nav_day` 10, sayaç 7; kart başlıkları (Order of the Day, Will You Join Us?, Replies are closed) ve
  ana sayfa pano başlıkları `nowrap` yerine `text-wrap: balance` (tasarım metni tek satırda kalıyor; `site.css` 46 070 B, pay 10).
- **05 ek düzeltme (önceden vardı):** G068'in "zarfa dönüşte nav" denetimi 05'te kalıyordu (0 ms'de bandın %89,9'u).
  `::view-transition-old(site-nav):only-child { opacity: 0 }` yetmedi (grup 120 ms'de bandın %13,7'sini çizmeye devam etti; aynı
  kare iki kez çekilince fark %0); `html:has(.page-envelope)::view-transition-group(site-nav) { display: none; }` ile %0.

**Testler (bu dalda, Node 22, `/opt/pw-browsers`, PORT 4204x)**
- `npm test` **567/567**; `npm run typecheck` temiz; `npm run build` + trace-check geçti (16 rota, 6 tema).
- `theme-check --stress --no-video`: **dusty-blue-champagne 127 geçti / 0 uyarı / 0 hata**, **mediterranean-lemon 127 / 0 / 0**
  (teşekkür hâli "complete", copy 70 anahtar, işaretsiz 0; 05 son değişiklikten sonra yeniden koşuldu). İlk koşu hataları (gezinme,
  sayaç, kart başlıkları, ipucu, 05 nav dönüşü, 05 teşekkür kartı başlığı çelenkte %2) yukarıdaki ayarlarla kapandı. İlk görünüm
  (390×844 DPR 3): 02 index 921 / home 1015 KB (yer tutucu), 982 / 1150 KB (foto); 05 878 / 885, 973 / 1142 KB. Dokun → home 02
  3,9 s, 05 4,4 s.
- `final-smoke --theme` 02 **45/45**, 05 **45/45**; `g051-browser --theme` 02 **44/44**, 05 **44/44**.
- `g075-browser` tam koşu **101/101** (01/03/02/05 + panel; `G075_THEMES=…` ile yalnız 02/05: 40/40); `g068-browser` tam koşu
  **64/64** (`G068_THEMES` ile 02/05: 16/16). Değişen testler: `g075-thank-you.test.ts` (dört tema; varsayılan "now" 2027-10-01,
  02'nin düğünü 18 Eylül; teşekkür sayfalarının ve `thank-you.css`'in andığı her tema dosyası var), `g068-copy.test.ts` (dört tema,
  tasarım anahtarı listesi, `form_party` yalnız 01/03), iki tema testinde tören cümlesi seçicisi (`!thank_you_on`), tarayıcı
  testlerinde tema filtresi ve yatay kaydırma ölçümü giriş geçişleri bittikten sonra (02 details'te mekân baskısı yandan uçarken
  `scrollWidth` 804 px okunuyordu; `html`/`body` `overflow-x: clip`, gerçek kaydırma yok — eski ölçüm 01/03'te de aynı geçer).
- Kendi ölçümüm (theme-check teşekkür hâlinde iç sayfa ilk ekranını ölçmüyor): teşekkür hâlinde home/story/details/rsvp × 12 boyut
  (320×568 … 1440×900, yatay dahil) × demo + tasarım aralığı; nav çizgisini kesen parça 02'de 0, 05'te yalnız 667×375 details kart
  başlığının yazı kutusu (5 px; davet hâlinde de aynı, önceden vardı).

**Önizlemeler** `platform/previews/g081/` (PNG, 390 px, 6,6 MB): her iki tema için `01_ty_envelope_*` (kapalı zarf),
`02_ty_envelope_open_photo_*` (kartta teşekkür fotoğrafı), `03_ty_envelope_open_decoration_*` (fotoğrafsız: temanın süsü),
`04_ty_home_*` (tam sayfa), `05_ty_rsvp_closed_*`, `06_copy_rsvp_changed_headings_*` (çiftin başlıklarıyla RSVP), `checks.json`.

**Açık / denenmedi**
- **04 vintage-airmail-love-letter bekliyor** (G404 QA'da; bu turda dokunulmadı). theme-check ve g075 testi onu `# WARN` ile listeler.
- docs/11 §3.6 ("02, 04, 05 … henüz yok") ve §3.7 ("02/04/05 G068 anında başka görevlerde") cümleleri bu görevin yazma alanında
  değil → entegratör 02/05'i "var" olarak güncellemeli.
- 02/05'te G069 misafir adı satırı (`<template data-rsvp-party>`) yok (G069 yalnız 01/03'e eklemiş); `form_party` anahtarı da yok.
  Önerilen küçük görev (claude-kod): 02/04/05 RSVP formuna parti satırı + `form_party`.
- Dar sınırlar: 02 dokunmatik ipucu 12 harf, RSVP kart başlığı 20; 05 gezinme 5–7 harf. Daha uzun söz için tasarım değişikliği gerekir.
- 05'in nav dönüşündeki grup çiziminin sebebi (muhtemelen nav'ın `backdrop-filter`'ı) doğrulanmadı; ölçüm %0.
- Teşekkür hâlinde iç sayfaların ilk ekran kuralı theme-check'te yok (yalnız stres taşma/kart denetimleri); eklenmesi önerilir.
- Gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları denenmedi.

## Günlük
- 2026-10-14 açıldı (entegratör): G075 Sonuç önerisi; 02/04/05 onaylanınca başlar
- 2026-10-14 kapsam: G068 düzenlenebilir metinler de eklendi
- 2026-10-14 entegratör: 04 (G404) QA düzeltmesinde; bu tur yalnız 02 ve 05 yapılır, 04 onaylanınca aynı adımlar ek tur olarak (Günlük'e satır)
- 2026-10-14 alindi: claude-G081
- 2026-10-14 claude-G081: 02 ve 05 tamam; 04 bekliyor
