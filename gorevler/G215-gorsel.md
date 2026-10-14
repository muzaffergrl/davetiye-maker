---
id: G215
baslik: Tasarım 15 Cherry Blossom Spring — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-G
oncelik: 2
bagimli: []
yazar: [collections/15_Cherry_Blossom/assets/gpt/comps/, collections/15_Cherry_Blossom/assets/gpt/parts/, collections/15_Cherry_Blossom/assets/gpt/photos/]
---

## Amaç
Tasarım 15'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the blossom twig loosens and drifts off, the curved grey flap lifts, and the card rises as a gentle flurry of cherry petals swirls up and floats across the screen.

## Girdiler
- `collections/15_Cherry_Blossom/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/15_Cherry_Blossom/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/15_Cherry_Blossom/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/15_Cherry_Blossom --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
Kısım 1 ara kayıt — gpt-gorsel-G (2026-10-14):
- W1 tamamlandı: `comps/web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png`; tamamı `collections/15_Cherry_Blossom/assets/gpt/` altında, 1024×1536.
- W1.1 ilk denemede fazla yatay görünen zarfı daraltmak için yeniden üretildi; seçilen ikinci çıktı sade dosya adına kaydedildi. Diğer W1 ekranları bu seçilen ekranı referans aldı.
- `kit_check` dosya denetimleri W1 için 5/5 GEÇTİ (oran, opaklık, gereken ekranlarda yeşil pencere). Beş ekranın Kontrol satırları görsel olarak da denetlendi.
- Bu oturumda sıradaki üç parça: W2 `bg_page`, `bg_tile`, `envelope_closed`. W2'nin diğer parçaları ve PAKET 2 bu oturumun kapsamı dışında; görev `alindi` kalır.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-G; bu oturum kısım 1: W1'in 5 ekranı + W2 bg_page, bg_tile, envelope_closed (8 görsel).
- 2026-10-14 ara kayıt: gpt-gorsel-G; W1 5/5 tamamlandı ve dosya denetimleri geçti; W1.1 zarf oranı için yeniden üretildi.
