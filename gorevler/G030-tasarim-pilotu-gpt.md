---
id: G030
baslik: Tasarım 03 Blush Garden Rose — GPT tasarım paketi (Paket 4: sahne comp'ları + parçalar) · PİLOT
rol: gpt-gorsel
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [collections/03_Blush_Garden_Rose/assets/gpt/comps/, collections/03_Blush_Garden_Rose/assets/gpt/parts/]
---

## Amaç
Kullanıcı kararı K21: **tasarımı GPT yapar.** Bu pilotta GPT, tasarım 03'ün 6 video sahnesini bitmiş
tasarım olarak çizer (T1, referans) ve aynı tasarımı Canva'da ayrı hareket edecek parçalara böler (T2).
Claude yalnız metin katmanlarını, fotoğraf alanlarını ve Canva montajını yapar (G031).

## Girdiler
- `collections/03_Blush_Garden_Rose/assets/gpt/GPT_PROMPTS.md` → **PAKET 4** (önce baştaki talimatları oku)
- `collections/03_Blush_Garden_Rose/DESIGN_BRIEF.md`, `palette.json`
- `gorevler/roller/gpt-gorsel.md` (§ Tasarım paketi)

## Yapılacaklar
1. T1.1–T1.6 comp'larını sırayla, **aynı sohbette** üret; kendi kontrol satırlarına göre beğenmediğini yeniden üret.
2. T2.1–T2.13 parçalarını T1 comp'larını referans vererek üret (aynı zarf, aynı çiçek, aynı altın).
3. Şeffaf istenenler gerçek alfa kanallı PNG; foto pencereleri düz `#00FF00`.
4. Varsa kendi kontrolün: `python3 tools/kit_check.py collections/03_Blush_Garden_Rose --paket 4`.

## Bitti sayılması için
- [ ] 6 comp + 13 parça doğru ad/yolda
- [ ] T2 parçalarında hiç yazı yok; şeffaflar gerçek alfa
- [ ] Comp'lar "lüks davetiye" seviyesinde (düz vektör/clip-art görünümü yok)

## Sonuç
_(görevi yapan ajan doldurur: ne üretildi, neyi yeniden ürettin ve neden, emin olmadığın noktalar)_
