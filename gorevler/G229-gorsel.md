---
id: G229
baslik: Tasarım 29 Celestial Observatory — yeniden tasarım GPT parçaları (PAKET 5R + PAKET 6R)
rol: gpt-gorsel
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [collections/29_Celestial_Observatory/assets/gpt/parts/, collections/29_Celestial_Observatory/assets/gpt/print/]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` (2026-10-22): Celestial Observatory 39–48 kalitesine çıkarılıyor. Eski tek parça kapak nesnesi yerine
katmanlı, aynı tuvalde hizalı zarf parçaları + kapanış + iç sayfa parçaları üretilir. Tema sonra G429 ile yeniden kurulur.

## Girdiler
- `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` → **PAKET 5R** (website katmanları) ve **PAKET 6R** (basılı davetiye). PAKET 2 fotoğrafları
  var (üretme); GEÇERSİZ bölümler istenmez.
- `collections/29_Celestial_Observatory/DESIGN_BRIEF.md` (2026-10-22 sürümü); talimat metni `docs/35` §5; kalite örneği `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/`.

## Yapılacaklar
1. Tek sohbet; önce "Instructions for GPT" alıntısı, sonra W1, W2, W3 … sırayla; aynı zarf tuvalindeki katmanlarda önceki
   katmanı referans ver (aynı tuval, aynı konum ve ölçü). Sonra P1, P2.
2. Her görselin Kontrol satırını gözle uygula; başarısızsa en çok 2 yeniden üretim, sonra en iyisini kaydet ve not düş.
3. Kaydet satırındaki tam yol/ad; ayrı tutulan deneme `_v2`.
4. Kabuk varsa: `python3 tools/kit_check.py collections/29_Celestial_Observatory --paket 5`.

## Bitti sayılması için
- [ ] PAKET 5R'nin bütün Kaydet dosyaları doğru yolda
- [ ] PAKET 6R ön/arka doğru yolda
- [ ] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar yazılı

## Sonuç
