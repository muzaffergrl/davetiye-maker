---
id: G030
baslik: Tasarım 03 Blush Garden Rose — GPT tasarım paketi (Paket 4: sahne comp'ları + parçalar) · PİLOT
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-1
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
Üretim sürüyor (gpt-gorsel-1). T1.1–T1.6 sahne referansları üretildi;
T2 parçaları aynı referanslardan sırayla üretilecek. T1 fotoğraf pencerelerinde
yeşil renk piksel düzeyinde tam #00FF00 olmadığından bu teknik kontrol geçmiş
sayılmadı. Son kalite raporu paket tamamlandığında burada yer alacak.

## Günlük
- 2026-10-09 alindi: gpt-gorsel-1
- 2026-10-09 T1: 6 sahne referansı üretildi; T2 üretimine geçiliyor.
