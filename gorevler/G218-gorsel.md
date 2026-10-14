---
id: G218
baslik: Tasarım 18 Wildflower Meadow Vellum — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-J
oncelik: 2
bagimli: []
yazar: [collections/18_Wildflower_Vellum/assets/gpt/comps/, collections/18_Wildflower_Vellum/assets/gpt/parts/, collections/18_Wildflower_Vellum/assets/gpt/photos/]
---

## Amaç
Tasarım 18'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 18 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the wildflower label peels away, the frosted vellum sleeve slides down off the card and fades, and the card lifts up as a few colored-pencil petals flutter across the screen.

## Girdiler
- `collections/18_Wildflower_Vellum/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/18_Wildflower_Vellum/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/18_Wildflower_Vellum/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/18_Wildflower_Vellum --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 18 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
- Kısım 1: `collections/18_Wildflower_Vellum/assets/gpt/comps/` altında `web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png` üretildi (hepsi 1024×1536). Aynı renkli kalem botanik tekniği, vellum/kağıt dokusu ve sol üst ışığı referanslarla korundu.
- W1 referanslarıyla `collections/18_Wildflower_Vellum/assets/gpt/parts/` altında yalnız `bg_page.png` (1024×1536, opak), `bg_tile.png` (1254×1254, opak kare; kontrol aracı hedef oranını kabul ediyor), `envelope_closed.png` (1024×1536, gerçek alfa PNG) üretildi. Kılıf tek başına ve tamamen boş; kart, kapanış etiketi ve yazı yok. Teslimde toplam **8 PNG** var; ek rapor/önizleme dosyası yok.
- Yeniden üretimler: W1.2'de yatay fotoğraf penceresi dikey 2:3 olarak düzeltildi; W1.3'te yan kartlar ve açıklamalar güvenli orta %85 alana alındı. İkinci üretimler sade adlarla seçildi; denemeler teslim klasöründe tutulmadı.
- Kılıf önizlemesindeki dış hâle nedeniyle `envelope_closed` yeniden üretildi; ikinci üretim seçildi. Seçilen PNG'nin alfa kanalında nesne dışı kalıntılar en fazla 2/255; görünen yaygın hâle ham RGB önizlemesinde, belirgin opak bir gölge katmanı yok. Kılıf yüzeyi neredeyse opak (ortanca alfa 253/255); prompt'taki izinli seçenek uyarınca geçirgenlik sitede CSS opacity ile ayarlanabilir.
- Kontrol: W1/W2 görsel kontrol listeleri uygulandı; `kit_check.denetle` ile bu oturumun sekiz dosyası için ölçü/oran, opaklık, gerçek alfa ve gereken yeşil pencere kontrolleri **8/8 geçti**. `bg_tile` karşı kenar şeritlerinin ortalama RGB farkı 1/255'ten az; düşük kontrastlı tekrar zemini kontrol edildi. Tam `kit_check --paket 5`: **8/23**, kalan 15 W2 parçası yok; zarf hizası `envelope_open` henüz olmadığından ölçülmedi. `--paket 2`: **0/5**, fotoğraflar bu oturumun kapsamında değil. Görev `alindi` olarak kalır.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-J (kısım 1: W1 5 comp + W2 bg_page, bg_tile, envelope_closed)
- 2026-10-14 ara kayıt: gpt-gorsel-J — W1 bitti (5/5 comp); sıradaki: W2 bg_page, bg_tile, envelope_closed.
- 2026-10-14 gpt-gorsel-J: kısım 1 bitti; kalan: W2'nin diğer parçaları + PAKET 2
- 2026-10-14 entegratör ara kontrol: kısım 1 (8 görsel) kit_check geçti, görsel olarak iyi (vellum kılıf, dikey gövde ~0,83:1). Kısım 2 verildi.
- 2026-10-14 devam: gpt-gorsel-J (kısım 2)
- 2026-10-14 ara kayıt: gpt-gorsel-J (kısım 2, 4/8) — closure, envelope_open, card_small, invitation_card kaydedildi; dosya kontrolleri 4/4 geçti; kılıf gövde hizası geçti. Kalan: info_card, frame_portrait, frame_landscape, decor_tl (Kaydet: florals_tl.png).
