# 02 Dusty Blue — baskı ve paylaşım kaynakları (G022 pilotu)

Bu klasör setin sabit (statik) parçalarının HTML kaynağıdır. G5NN görevleri (diğer 19 tasarım)
aynı dosya adlarını, sayfa ölçülerini ve kuralları izler; yalnız palet, dekor katmanları ve
fontlar tasarıma göre değişir.

| Dosya | Sayfa | Kullanım | Önizleme |
|---|---|---|---|
| `invitation_5x7.html` | 1500 × 2100 px (5 × 7 in, 300 dpi) | Baskı / PDF davetiye | `previews/invitation_5x7.png` |
| `story.html` | 1080 × 1920 px (9:16) | Instagram/WhatsApp story, telefonla paylaşım | `previews/story.png` |
| `square.html` | 1080 × 1080 px (1:1) | Kare paylaşım görseli (post, mesaj) | `previews/square.png` |

## Ortak kurallar (her G5NN dosyası)

1. **Tek sayfa öğesi:** `<div class="page" data-document-role="page">`, sabit `width/height`,
   `overflow:hidden`. İç içe ikinci `data-document-role="page"` yok (Canva statik HTML içe aktarma).
2. **Konumlama:** her öğe sayfaya göre `position:absolute` + piksel `left/top/width`. Flex/grid,
   `transform`, `::before/::after` ve CSS arka plan görseli kullanılmaz (içe aktarmada kaybolabilir).
   Metin kutuları tam genişlik (`.t`: `left:0; width:<sayfa genişliği>; text-align:center`).
3. **Görseller:** yalnız `<img>` ile ve yalnız `../assets/layers/` içinden göreli yol. Yeni görsel
   gerekiyorsa gpt-gorsel görevi önerilir; bu klasöre görsel konmaz (önizlemeler hariç).
4. **Metin gerçek HTML metnidir**, görsele pişirilmez. Mühür monogramı (`E&T`) bile mühür görselinin
   üstünde ayrı bir metin kutusudur (`.mono`). Her kişisel metin `data-slot="…"` taşır.
5. **Fontlar:** Google Fonts `<link>` (Pinyon Script, Cormorant Garamond 500/600 + italik, Montserrat 500).
   Font dosyası repoya girmez. Cormorant'ta rakamlar için `font-variant-numeric: lining-nums`
   (yoksa "18" eski stil rakamla "I8" gibi görünür).
6. **İçerik:** `content.demo.json` ile birebir; İngilizce; tarih `September 18, 2027` biçimi
   (5×7 ve story'de video sahne 4'teki gibi parçalı tarih kutusu: SATURDAY | SEPTEMBER 18 2027 | AT 4:30 PM).
   RSVP son tarihi `rsvp.deadline` → `August 1, 2027`.
7. **RSVP/website linki yer tutucudur:** `<a href="#" data-placeholder="rsvp_url">` ve yanında yorum.
   Gerçek URL yazılmaz; alıcı Canva'da kendi adresini bağlar.
8. **Renkler** `palette.json` anahtarlarından: `ink` ana metin, `deep` caps/italik ikincil metin ve düğme,
   `gold` çizgiler ve `&`, `gold_light` çerçeve, `ivory` kart zemini, `mist_top` sayfa zemini.

## Tipografi rolleri

| Sınıf | Font | Kullanım |
|---|---|---|
| `.caps` | Montserrat 500, büyük harf, `letter-spacing:.34em` | ev sahibi satırı, ay/yıl, gün adı/saat, "Save our date", RSVP satırı |
| `.script` | Pinyon Script | isimler, `&`, polaroid altyazısı |
| `.serif` | Cormorant Garamond 500/600 | gün rakamı, mekân adı (600) |
| `.serif.it` | Cormorant Garamond italik | davet cümlesi, şehir, "Kindly reply by …" |

## Düzenler (y koordinatları px, yukarıdan)

### `invitation_5x7.html` — 1500 × 2100 (video master sahne 4 kartı)
- Zemin `ivory`; çift altın çerçeve: 52 px içerde 3 px `gold_light`, 72 px içerde 1.5 px.
  Güvenli alan: metin çerçevenin içinde, kenardan ≥ 0.25 in (75 px).
- Köşe dekoru: `card_botanical_tl.png` (6,6; 400×400), `card_botanical_br.png` (1094,1694; 400×400).
- 330 ev sahibi caps 36 · 440 isim 1 script 196 · 640 `&` gold 150 · 780 isim 2 script 196 ·
  1068 davet cümlesi italik 56 (2 satır) · 1290–1580 tarih kutusu (ay caps 32, gün serif 200,
  yıl caps 32; yan kutular 200–590 ve 910–1300, üst/alt gold çizgi) · 1636 mekân serif 600 76 ·
  1730 şehir italik 54 · 1872 "Kindly reply by …" caps 24 · 1912 RSVP link italik 40.
- Uzun isim: isim satırı 1312 px'e kadar ölçüldü ("Theodore James" 196 px'te 188–1312). Daha uzun
  isimlerde font boyutu küçültülür, kutu genişliği değişmez.

### `story.html` — 1080 × 1920
- `bg_mist.jpg` tam sayfa; `botanical_tl.png` (−60,−60; 400), `botanical_br.png` (670,1510; 410) —
  video master ile aynı köşeler.
- 180 "Save our date" caps 28 · 228 kısa isimler (`name_display`) script 150 ·
  480–1010 polaroid: CSS beyaz çerçeve 440×530 (320,480) + `photo_placeholder_1.jpg` 396×416 (342,502) +
  altyazı script 50 (934) · 1112–1330 tarih kutusu (yan kutular 130–410 / 670–950) ·
  1376 mekân 56 · 1444 şehir 40 · 1548 "Kindly reply by …" italik 44 · 1632 RSVP düğmesi
  380×84 `deep` (link yer tutucu) · 1748 "Details, travel & registry / on our wedding website" italik 34.
- Fotoğraf alıcının değiştireceği ayrı görsel öğedir (`data-slot="hero_photo"`).
- `polaroid_frame.png` kullanılmadı: gölgesi sağ/altta keskin kesik (bkz. G022 Sonuç). Çerçeve CSS.

### `square.html` — 1080 × 1080
- `bg_mist.jpg` 1080×1920, `top:-420` (orta kesit); köşe botanikleri 300 px.
- `card_small_blank.png` (130,150; 820×600 — kart 760×540 + gölge payı 30).
- 236 "Save our date" caps 22 · 288 kısa isimler script 112 · 464 tarih caps 24 (iki yanda
  110 px gold çizgi) · 530 mekân 46 · 588 şehir italik 34 · 668 mühür `wax_seal.png` 160×160 +
  `E&T` monogram (italik 600, 44 px, `line-height` = mühür yüksekliği → dikey ortalı) ·
  850 "Kindly reply by …" italik 38 · 912 RSVP link caps 20.

## Önizleme üretimi

Playwright (Chromium) ile her dosya açılır, `document.fonts.ready` beklenir, `[data-document-role=page]`
öğesinin ekran görüntüsü native boyutta `previews/<ad>.png` olarak alınır. Aynı betik taşma
(metin kutusu dışına/sayfa dışına çıkan metin), kırık görsel ve iç içe sayfa sayısını denetler.
Önizleme 1.5 MB'ı geçerse küçültülerek kaydedilir.

## G5NN için uyarlama

1. Bu üç dosyayı `collections/<NN_ad>/print/` altına kopyala.
2. `:root` renklerini o tasarımın `palette.json`'una, `<link>` fontlarını DESIGN_BRIEF'e göre değiştir.
3. `<img>` yollarını o tasarımın `assets/layers/` dosyalarına çevir (aynı rol: zemin, köşe dekoru,
   kart, mühür, fotoğraf yer tutucusu). Katman yoksa CSS ile çiz veya gpt-gorsel görevi öner.
4. Metinleri o tasarımın `content.demo.json`'undan doldur; `data-slot` adlarını koru.
5. Önizlemeleri üret, taşma listesinin boş olduğunu ve görselde çakışma olmadığını kontrol et.
