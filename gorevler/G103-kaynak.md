---
id: G103
baslik: Tasarım 03 Blush Garden Rose — HTML sahne kaynağı + katmanlar
rol: claude-kod
durum: inceleme
alan: claude-kod-6
oncelik: 2
bagimli: []
yazar: [collections/03_Blush_Garden_Rose/video/, collections/03_Blush_Garden_Rose/assets/layers/, collections/03_Blush_Garden_Rose/kit_map.json, collections/03_Blush_Garden_Rose/previews/]
---

## Amaç
Tasarım 03'in 6 sahnelik 1080×1920 animasyon kaynağını kodla (HTML/CSS/SVG) kurmak ve Canva'ya gidecek ayrı katmanları çıkarmak. Şekiller koddan, yüzeyler (doku/dekor) GPT görsellerinden gelir.

## Girdiler
- `collections/03_Blush_Garden_Rose/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor, sahneler)
- `collections/03_Blush_Garden_Rose/content.demo.json`, `collections/03_Blush_Garden_Rose/palette.json`
- Örnek yapı: `collections/02_Dusty_Blue/video/invitation_motion.html` + `collections/02_Dusty_Blue/assets/layers/layers.json`
- `tools/export_layers.mjs`, `tools/render_motion.mjs`
- Varsa GPT görselleri: `collections/03_Blush_Garden_Rose/assets/gpt/` (yoksa koddan yer tutucu yüzey kullan)
- `docs/07_KIT_STANDARDI.md` §6 (genel kit_map)

## Yapılacaklar
1. `collections/03_Blush_Garden_Rose/video/invitation_motion.html`: 6 sahne, ~26 sn; brief'teki zarf mekaniği ve foto sunumu **gerçekten** ayrı nesnelerle hareket etsin.
2. Görselde metin yok: bütün metinler HTML metni (Canva'da metin olacak). Fontlar Google Fonts link'iyle; font dosyası koyma.
3. `collections/03_Blush_Garden_Rose/assets/layers/layers.json` + `export_layers.mjs` ile şeffaf katmanlar → `collections/03_Blush_Garden_Rose/assets/layers/` (zarf parçaları, kapanış elemanı, kart, çerçeveler, dekor, arka plan ayrı ayrı).
4. `collections/03_Blush_Garden_Rose/kit_map.json`: her katman için kaynak GPT dosyası ve yöntem (`docs/07_KIT_STANDARDI.md` §6).
5. Önizleme: `render_motion.mjs` ile MP4 + 6 anahtar kare → `collections/03_Blush_Garden_Rose/previews/`.
6. Diğer 19 tasarımla karıştırılmayacak kadar farklı olmalı (katalogdaki eksenler).

## Bitti sayılması için
- [x] MP4 önizleme oynuyor; 6 sahne var
- [x] Katmanlar ayrı ve şeffaf; metin pişirilmemiş
- [x] kit_map.json geçerli JSON

## Sonuç
**Yapıldı (claude-kod-6, 2026-10-09)** — durum: `concept` (HTML kaynak + yer tutucu yüzeyler; GPT görselleri yok, Canva'ya girmedi).

Dosyalar:
- `collections/03_Blush_Garden_Rose/video/invitation_motion.html` — 1080×1920, 26 sn, 6 sahne. Fontlar Google Fonts
  link'i (Great Vibes + Lora). Tüm metin HTML; tüm şekiller SVG/CSS (resim/stok yok).
  1. 0–3.3 sn: tırtıklı kenarlı kare blush zarf, sarıcı ipek şerit + fiyonk; fiyonk ilmekleri ayrı ayrı söner,
     kuyruklar düşer, düğüm + şerit sağa kayarak çıkar.
  2. 3.3–7 sn: kapak (rotateX) kapanır, astarlı açık kapak açılır, kemer tepeli küçük kart (kemerli foto
     yuvası + "We're getting married" + tarih) yükselir; zarf aşağı düşer, kart yukarı süzülüp çıkar.
  3. 7.3–12.3 sn: "Our Story" — 3 uzun kemerli altın çerçeve (boncuk iç çizgi, tepe süsü) aşağıdan tek tek
     yaylanarak yükselir, altyazılar ayrı gelir; çıkışta çerçeveler sırayla aşağı batar.
  4. 12.3–17.4 sn: kemer tepeli büyük davet kartı (çift altın kemer çizgisi, tepe çelengi, alt köşe buketleri);
     aileler, isimler, davet cümlesi, kemer madalyonlu tarih bloğu, mekân.
  5. 17.4–21.7 sn: "Order of the Day" — üç program satırı soldan/sağdan dönüşümlü girer + Dress Code.
  6. 21.7–26 sn: RSVP — "Will You Join Us?", son tarih April 3, 2027, RSVP butonu, website notu, küçük fiyonk
     (kapanış elemanı tekrarı), "With love, Clara & Julian".
  Arka plan: blush gradyan + bulanık boya lekeleri + düşen yapraklar; sol üst / sağ alt şakayık-gül köşe dekoru.
  Tasarım 02'den farkı: kare tırtıklı pembe zarf (02: dikdörtgen fildişi), kurdele (02: mum mühür), kemerli altın
  çerçeveler aşağıdan (02: polaroid uçuşu), kemer tepeli kart (02: dikdörtgen), Great Vibes + Lora, blush palet.
- `collections/03_Blush_Garden_Rose/assets/layers/layers.json` + 22 katman (2× çözünürlük; `.jpg` opak, `.png`
  şeffaf): `bg.jpg`, `petal.png`, `corner_tl/br.png`, `envelope_back/pocket/flap_closed/liner_open.png`,
  `ribbon_band.png`, `closure_bow.png`, `card_small_blank.png` (kemerli boş foto yuvasıyla), `photo_hero.jpg`,
  `arch_frame.png` (içi şeffaf), `photo_1..3.jpg`, `invitation_card_blank.png`, `card_crown.png`,
  `card_corner_bl/br.png`, `date_arch.png`, `bud_divider.png`. Hiçbir katmanda metin yok ("YOUR PHOTO" etiketi
  dışa aktarımda gizlenir).
- `collections/03_Blush_Garden_Rose/kit_map.json` — 19 GPT eşlemesi (§6 yöntemleri) + `code_only` listesi
  (ribbon_band, petal, date_arch: GPT karşılığı yok). Fotoğraflar `../02_Dusty_Blue/assets/gpt/photos/`
  (`shared: true`).
- `collections/03_Blush_Garden_Rose/previews/blush_garden_rose_html_render.mp4` (CRF 30, küçük) + 6 anahtar kare
  `blush_garden_rose_html_render_t{1_4,5_9,10_8,16_3,20_5,25_5}s.png`.

Test edildi:
- render_motion.mjs ile 780 kare render, ffmpeg ile yeniden kodlandı; anahtar kareler gözle kontrol edildi
  (taşma düzeltildi: isimler 118 px, RSVP başlığı 96 px tek satır; kapak 90°'de görünmesin diye perspective-origin;
  fiyonk sağ ilmeği kayıktı → `transform-box` düzeltildi; cep kenar çizgisi açık ağızdan kaldırıldı).
- export_layers.mjs çıktısı checkerboard üstünde kontrol edildi (her katman tek parça, şeffaf).
- `kit_build.validate_map` → 19 katman geçerli. Sahte (düz renk) GPT girdileriyle `kit_build.py --map` kuru
  çalıştırma: 15/19 üretildi, 4 fotoğraf kaynağı yok diye atlandı (beklenen: 02'nin ortak fotoğrafları henüz yok).

Test edilmedi / açık:
- Gerçek GPT görselleriyle kit_build (G203 bekleniyor); Canva'ya yükleme ve Canva animasyonu (G303).
- Great Vibes / Lora'nın Canva'da bulunabilirliği doğrulanmadı.
- **kit_build sınırı:** `texture_mask` rengi uygulamaz; zarf parçaları `paper.png` (blush-beyaz) ile açık
  fildişi çıkar. kit_map'te hedef renk `"color": "palette.primary"` olarak yazıldı ama şu an yok sayılıyor.
  Önerilen görev (claude-kod, araç): `texture_mask`'a isteğe bağlı `color` çarpımı (doku lum × renk).
  Alternatif: G203'e pembe zarf kâğıdı dokusu (`textures/envelope_paper.png`) eklemek.

G1NN kardeşlerine notlar:
- `render_motion.mjs` CRF 18 sabit; küçük önizleme için önce scratch'e render edip
  `ffmpeg -crf 30 -preset slow` ile yeniden kodlayın. Font uyarısı yalnız 02'nin fontlarını kontrol eder.
- SVG `g` üzerinde `transform-box: fill-box` + `scale(-1 1)` attribute'u ayna eksenini kaydırır; aynalanan iç
  grupta `transform-box: view-box` kullanın.
- `rotateX(90deg)` kapak, perspective-origin menteşe hizasında değilse görünür kalır.
- Ekran dışına taşan köşe dekorunu dışa aktarırken layers.json `css` ile içeri alın (yoksa kırpılır).
- Kemerli fotoğraflar: JPG dikdörtgen dışa aktarılır (`css` ile border-radius kaldırılır), Canva'da arch maske.

## Günlük
- 2026-10-09 alindi: claude-kod-6
- 2026-10-09 bitti, incelemeye gönderildi
