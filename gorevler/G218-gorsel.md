---
id: G218
baslik: Tasarım 18 Wildflower Meadow Vellum — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: hazir
alan:
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
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
