---
id: G031
baslik: Tasarım 03 — GPT parçalarından Canva video master'ı kur (metin + foto alanları) · PİLOT
rol: claude-canva
durum: iptal
alan:
oncelik: 1
bagimli: [G030, G032]
yazar: [collections/03_Blush_Garden_Rose/canva/, collections/03_Blush_Garden_Rose/kit_layers/, collections/03_Blush_Garden_Rose/previews/canva/]
---

## Amaç
G030 comp'larını hedef alarak Canva'da 6 sayfalık 1080×1920 video master'ı kurmak. Görseller GPT
parçaları; bütün metinler düzenlenebilir Canva metni, fotoğraflar değiştirilebilir alan. Claude yeni
görsel tasarlamaz, kodla şekil çizmez.

## Girdiler
- `collections/03_Blush_Garden_Rose/assets/gpt/comps/` (hedef görünüm) ve `parts/`
- `tools/parts_prep.py` (G032): 2:3 → 9:16 kırpma, yeşil pencereleri şeffaflaştırıp foto alanı koordinatlarını çıkarma, ön cep kesimi
- `collections/03_Blush_Garden_Rose/content.demo.json`
- `.claude/skills/canva-guvenli-duzenleme/SKILL.md`
- Zamanlama referansı (yalnız sıra/süre): `collections/03_Blush_Garden_Rose/video/invitation_motion.html` (G103)

## Yapılacaklar
1. `parts_prep.py` ile parçaları hazırla → `kit_layers/`.
2. Canva'ya yükle; her sahneyi comp'a göre yerleştir (katman sırası: arka plan → zarf arkası → kart → ön cep → kurdele…).
3. Metinleri comp'taki yerleşimle Canva metni olarak koy (script + serif; en yakın Canva fontları kaydedilir).
4. Fotoğraf alanlarına demo fotoğrafları koy (değiştirilebilir); yoksa nötr yer tutucu.
5. Export → comp'larla yan yana karşılaştırma görseli `previews/canva/comp_vs_canva.jpg`.
6. Animasyon planı: `canva/ANIMATION_STEPS.md` (uygulama GA03, claude-tarayici).
7. Kullanıcıya Canva düzenleme linki + karşılaştırma görseli.

## Bitti sayılması için
- [ ] Canva master commit edildi ve aynı ID'den yeniden okundu
- [ ] Bütün metinler düzenlenebilir; görselde pişmiş metin yok
- [ ] Comp ile Canva karşılaştırması kullanıcıya gösterildi

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-16 iptal: K22/K24 — 03'ün Canva video master'ı; video yok, 03 platform teması → G038
