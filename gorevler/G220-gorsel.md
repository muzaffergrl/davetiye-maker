---
id: G220
baslik: Tasarım 20 Coastal Seaside — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-F
oncelik: 2
bagimli: []
yazar: [collections/20_Coastal_Seaside/assets/gpt/comps/, collections/20_Coastal_Seaside/assets/gpt/parts/, collections/20_Coastal_Seaside/assets/gpt/photos/]
---

## Amaç
Tasarım 20'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 18 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the watercolor wave (wave.png) sweeps across the screen and carries the seashell and twine away, the wave-edged flap lifts, and the card rises like the incoming tide.

## Girdiler
- `collections/20_Coastal_Seaside/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/20_Coastal_Seaside/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/20_Coastal_Seaside/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/20_Coastal_Seaside --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 18 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
Kısım 1 tamamlandı (8/8):
- W1: `comps/web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png` (1024×1536 RGB PNG).
- W2: `parts/bg_page.png` (1024×1536 RGB PNG), `bg_tile.png` (1254×1254 RGB PNG; repo standardı piksel ölçüsü yerine oranı denetler), `envelope_closed.png` (1024×1536 gerçek RGBA PNG; kapanış elemanı, deniz kabuğu, sicim ve yazı yok). Her W2 üretiminde W1 referans görselleri kullanıldı. Yalnız seçilen 8 sade dosya adı repoya kondu; ek rapor/önizleme dosyası üretilmedi.
- Yeniden üretimler: W1.1 fazla yatay zarf için bir kez; W2.3 ölçek/konum/kenar ve tuval oranı için dört kez yeniden üretildi; beşinci W2.3 seçildi. Denemeler üretim aracının geçici çıktılarında bırakıldı, repoya eklenmedi.
- Kontrol: `kit_check.py collections/20_Coastal_Seaside --paket 5`: mevcut 8/8 dosya GEÇTİ; bütün paket 8/23, kalan 15 W2 dosyası bilinçli olarak yok. `--paket 2`: 0/5, bu oturumda fotoğraf üretilmedi. Açık zarf olmadığı için kapalı/açık hiza kontrolü ATLANDI; site/animasyon testi yapılmadı.
- Görsel denetim: W1 metin, pencere, kart, program, buton ve alt menü yerleşimleri kontrol edildi; W2 zeminleri yazısız, zarf tek nesne, kapak serbest kenarı okunaklı ve nesne kesilmemiş. `bg_tile` karşı kenar ortalama mutlak RGB farkı yatay 2,80/255, dikey 3,86/255; düşük kontrastlı tekrar dokusu.
- Sonraki kısım için ölçüm/not: seçilen kapalı zarfın görünür alfa kutusu (alfa ≥128) `(79, 795, 946, 1354)`; genişlik %84,67, taban yüksekliği %88,15. Zarf gövdesi en/boy oranı 1,551 (W1 görünümüne yakın; prompt'taki yaklaşık 5:4 ile birebir değil). Nesne dışındaki 3 px kenar payının ötesinde alfa en fazla 2/255 (%0,784 opaklık) kalıntısı var; tam sıfır alfa iddiası yapılmıyor. Kalan kapanış ve açık zarf üretimlerinde bu **seçilmiş `envelope_closed.png`** referans alınmalı ve hiza yeniden ölçülmeli.

Görev `alindi`, sahibi `gpt-gorsel-F` kalır. Kalan: W2.4–W2.18 (15 parça) + PAKET 2 (5 fotoğraf).

## Günlük
- 2026-10-14 ara kayıt: gpt-gorsel-F; kısım 1, 8/8 (W1 5 ekran + W2 bg_page, bg_tile, envelope_closed); mevcut sekiz dosya kit_check kontrolünden geçti.
- 2026-10-14 ara kayıt: gpt-gorsel-F; W1 tamamlandı (kısım 1, 5/8).
- 2026-10-14 alindi: gpt-gorsel-F; bu oturum: kısım 1 (W1 5 ekran + W2 bg_page, bg_tile, envelope_closed).
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 gpt-gorsel-F: kısım 1 bitti; kalan: W2'nin diğer parçaları + PAKET 2
- 2026-10-14 entegratör ara kontrol: kısım 1 (8 görsel) kit_check geçti, görsel olarak iyi (dalga kapaklı kum zarf ~1,55:1). Kısım 2 verildi.
- 2026-10-14 devam: gpt-gorsel-F (kısım 2)
- 2026-10-14 ara kayıt: gpt-gorsel-F; kısım 2, 4/8 (closure, envelope_open, card_small, invitation_card); kullanıcı talebindeki 1024×1536 closure tuvaliyle dört parça kit_check işlevinden geçti, zarf hizası GEÇTİ.
