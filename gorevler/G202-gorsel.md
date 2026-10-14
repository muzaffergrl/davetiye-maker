---
id: G202
baslik: Tasarım 02 Dusty Blue & Champagne — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/02_Dusty_Blue/assets/gpt/comps/, collections/02_Dusty_Blue/assets/gpt/parts/, collections/02_Dusty_Blue/assets/gpt/photos/]
---

## Amaç
Tasarım 02'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the dusty blue wax seal breaks free and falls away, the V flap opens upward to reveal the gold damask liner, and the card rises from behind the front pocket while a single eucalyptus leaf drifts down.

## Girdiler
- `collections/02_Dusty_Blue/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `docs/09_TASARIM_KATALOGU.md` (satır 02) ve `collections/02_Dusty_Blue/COLLECTION_STATUS.md` (zarf, foto sunumu, dekor); `collections/02_Dusty_Blue/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/02_Dusty_Blue --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [x] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [x] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [x] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
2026-10-14 · gpt-gorsel-A. Aynı sohbet içinde, kaynak İngilizce prompt blokları korunarak **W1 → W2 → Paket 2** sırasıyla üretildi. W1 ekranları kabul edildi; W2'nin her üretiminde ilgili W1 ekranları görsel referans olarak verildi. Önce `envelope_closed.png`, ardından kapalı zarf referansıyla `closure.png` ve `envelope_open.png` üretildi. Fotoğraflarda ana portre sonraki üç çift fotoğrafına referans verildi.

**Teslim (27 ana dosya):** kök `collections/02_Dusty_Blue/assets/gpt/`.

- `comps/`: `web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png`.
- `parts/`: `bg_page.png`, `bg_tile.png`, `envelope_closed.png`, `closure.png`, `envelope_open.png`, `card_small.png`, `invitation_card.png`, `info_card.png`, `frame_portrait.png`, `frame_landscape.png`, `florals_tl.png`, `florals_br.png`, `accent_1.png`, `accent_2.png`, `accent_3.png`, `divider.png`, `web_hero.png`.
- `photos/`: `hero_portrait.jpg`, `story_1.jpg`, `story_2.jpg`, `story_3.jpg`, `venue.jpg`.

**Yeniden üretimler ve nedenleri:**

- `envelope_closed_v1.png`: gövde fazla genişti. `envelope_closed_v2.png`: üst boşluk ve konum uygun değildi. Üçüncü üretim sade adla seçildi; açık zarf bu seçimi referans alır.
- `frame_landscape_v1.png`, `frame_landscape_v2.png`: pencere fazla panoramik ve lekeli/yarı saydamdı. Üçüncü üretim seçildi; yeşil pencere kayıt aşamasında düz ve tam opak hâle getirildi.
- `florals_br_v1.png`: sağ ve alt kenarda kesilen uçlar vardı. İkinci üretimde uçlar görünür ve şeffaf kenar payı var.
- `web_hero_v1.png`: zarfın altında düşen gölge vardı. İkinci üretimde zemin gölgesi kaldırıldı; kâğıt üzerindeki temas tonu korundu.

**Teknik kayıt:** kare imagegen çıktıları 1254×1254 geldi; seçilenler ImageMagick ile Kaydet satırındaki 1024×1024 ölçüsüne getirildi. Fotoğraflar gerçek RGB JPEG olarak kaydedildi. W1'in üç foto pencereli ekranı ve W2'nin üç foto pencereli parçasında üretilen yeşilin renk/alfa sapmaları ImageMagick ile yalnız chroma bölgesinde giderildi; bu bölgeler **RGBA(0,255,0,255)**. Zarf/çiçek/kart çizimi imagegen üretimidir. Şeffaf parçalarda gerçek alfa vardır; dıştaki RGB önizleme halesi alfa=0 olduğundan zemine taşınmaz. Lacivert zemin üstünde yatay çerçeveyle ayrıca doğrulandı.

**Kontroller:**

- `python3 tools/kit_check.py collections/02_Dusty_Blue --paket 5`: **23/23 GEÇTİ** (22 dosya + zarf hizası).
- `python3 tools/kit_check.py collections/02_Dusty_Blue --paket 2`: **5/5 GEÇTİ**.
- 27 ana dosyanın piksel ölçüsü Kaydet satırıyla birebir aynı; tespit edilen bütün foto penceresi bölgeleri saf yeşil ve tam opak. Ölçüler, SHA-256 ve pencere kutuları `validation/pixel_check.json` içinde.
- Zarf gövdesi hiza farkları: sol **−%0,20**, sağ **+%0,29**, alt **+%0,07**; otomatik kontrol geçti. Yarı saydam üst üste kontrolü `validation/envelope_alignment_review.png`. `closure` bağımsız büyük kare mühürdür; sarılı kapanış değildir ve montajda ölçeklenir.
- `bg_tile` 2×2 tekrarda görsel olarak kontrol edildi; belirgin dikiş görünmedi (`validation/tile_repeat_review.png`).
- `web_hero` merkezden 1200×630 kırpılarak kontrol edildi; kapalı zarf ve mühür tam görünür, altında yaklaşık %10 boşluk kalır (`validation/web_hero_1200x630_review.png`).
- W2 seçili parçalarda yazı/harf/monogram görünmüyor; ayrı accent dosyalarında birer nesne var. Fotoğraflarda çift kimliği ve görünür el/parmaklar görsel olarak kontrol edildi; belirgin anatomi hatası görülmedi. Otomatik OCR/anatomi testi yapılmadı.
- Kit çıktıları `validation/kit_check_paket5.txt` ve `validation/kit_check_paket2.txt` içinde saklandı.

**İnceleme notları / kalan sapmalar:** `kit_check` pencerenin iç en-boy oranını denetlemiyor. Gerçek pencere oranları: `card_small` **1:1** (prompt dikey ister), `frame_portrait` **0,877:1** (hedef yaklaşık 4:5), `frame_landscape` **1,740:1** (hedef yaklaşık 3:2). Kapalı zarfın görünür gövdesi yaklaşık **1,44:1** (prompt yaklaşık 5:4 ister); açık/kapalı gövde birbirine yukarıdaki toleransla oturuyor. Bunlar birebir oran uyumu olarak sunulmuyor; G402 montajında gerçek pencere kutularına göre foto kırpımı kullanılmalı. Website montajı, açılış animasyonu ve çalışan RSVP bu görsel görevin kapsamında yapılmadı.

## Günlük
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-A
- 2026-10-14 W1 (5), W2 (17) ve Paket 2 (5) üretildi; yeniden üretimler ve oran sapmaları Sonuç'a kaydedildi. Paket 5 23/23, Paket 2 5/5 geçti.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A
- 2026-10-14 entegratör onayladı
