---
id: G212
baslik: Tasarım 12 Tropical Destination — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-D
oncelik: 2
bagimli: []
yazar: [collections/12_Tropical_Destination/assets/gpt/comps/, collections/12_Tropical_Destination/assets/gpt/parts/, collections/12_Tropical_Destination/assets/gpt/photos/]
---

## Amaç
Tasarım 12'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the brass snap pops open and the plumeria tab swings away, the wallet flap flips up to reveal the palm-leaf liner, and a luggage-tag card slides up while a monstera leaf and a white plumeria drift across the screen.

## Girdiler
- `collections/12_Tropical_Destination/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/12_Tropical_Destination/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/12_Tropical_Destination/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/12_Tropical_Destination --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
- Kısım 1 (gpt-gorsel-D, 8/8): W1'in beş ekranı `assets/gpt/comps/web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png` yollarına kaydedildi (1024×1536 PNG). Ekranlar aynı tropik suluboya dekoru, kâğıt, ışık ve tipografi referanslarıyla üretildi.
- Yeniden üretim: W1.1'de ilk cüzdan fazla kareydi; dikey cüzdan ve kısa deri şerit ucu düzeltildi. W1.2'de ilk foto penceresi kare ve iç gölgeliydi; dikey, düz yeşil pencere için yeniden üretildi.
- W1'in beş dosyası `kit_check.denetle` ile ölçü/oran, opaklık ve gereken yeşil pencereler açısından geçti; ekran kontrol satırları görsel olarak incelendi. Tam Paket 5 + Paket 2 henüz tamamlanmadı.
- W2'nin ilk üç parçası W1 görselleri referans verilerek `assets/gpt/parts/bg_page.png`, `bg_tile.png`, `envelope_closed.png` yollarına kaydedildi. `bg_page` 1024×1536 opak; `bg_tile` 1254×1254 opak kare (rol rehberindeki oran kontrolünden geçti); `envelope_closed` 1024×1536 gerçek RGBA alfa PNG. Kapalı cüzdan tek nesne, çıtçıt/çiçek/ip olmadan; kapak kesim kenarı görünür, zemine düşen gölge ve yazı yok.
- Yeniden üretim: ilk `bg_page` çıktısındaki palmiye gölgeleri kullanıcı talebine göre kaldırıldı. Kare dokuda düşük kontrast ve karşı kenar renk sürekliliği kontrol edildi; ek önizleme, metrik veya rapor dosyası üretilmedi.
- Kontrol: `kit_check --paket 5` mevcut sekiz dosyayı geçirdi (8/22); kalan 14 W2 dosyası henüz yok. `--paket 2`: 0/5, bu oturumda fotoğraf üretilmedi. `envelope_open` olmadığı için zarf hizası ölçülmedi; devamda `closure` ve `envelope_open` için bu `envelope_closed` referans alınmalı.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-D; bu oturum: kısım 1 (W1'in 5 ekranı + W2 bg_page, bg_tile, envelope_closed; 8 görsel).
- 2026-10-14 ara kayıt: gpt-gorsel-D; W1'in 5 ekranı tamamlandı (kısım 1: 5/8).
- 2026-10-14 ara kayıt: gpt-gorsel-D; W2 bg_page, bg_tile, envelope_closed tamamlandı (kısım 1, 8/8); durum alindi.
