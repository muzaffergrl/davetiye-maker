---
id: G201
baslik: Tasarım 01 Olive & Ivory — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-1
oncelik: 1
bagimli: []
yazar: [collections/01_Olive_Ivory/assets/gpt/comps/, collections/01_Olive_Ivory/assets/gpt/parts/, collections/01_Olive_Ivory/assets/gpt/photos/]
---

## Amaç
Tasarım 01'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the olive sprig slides out from under the oval seal, the lace-edged flap peels up on its hinge carrying the seal with it, and the ivory card glides up out of the pocket while two olive leaves float across the screen.

## Girdiler
- `collections/01_Olive_Ivory/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/01_Olive_Ivory/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/01_Olive_Ivory/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/01_Olive_Ivory --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
Üretim sürüyor (gpt-gorsel-1): W1.1–W1.5 telefon ekranları aynı sohbette üretildi.
Zarfın gövde oranı ve hikâye ekranının yan payları yeniden üretimle düzeltildi.
W2 parçaları ve Paket 2 fotoğrafları sırayla üretilecek; teknik denetimler henüz tamamlanmadı.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-13 alindi: gpt-gorsel-1
- 2026-10-13 W1: beş telefon ekranı üretildi; W1.1 ve W1.3 yeniden üretildi, seçilenler sade adla kaydedildi.
- 2026-10-13 entegratör notu (G046 incelemesi): `GPT_PROMPTS.md` PAKET 5 W2 yeniden üretildi — W2'ye başlamadan dosyayı yeniden oku. W2.4 `closure.png` artık **dalsız** mühür (kareyi ~%50 doldurur); yeni W2.17 `closure_sprig.png` (mührün altındaki zeytin dalı, mührün örttüğü kısım dahil tam, closure.png ile aynı tuvalde hizalı) → W2 18 parça; W2.3/W2.5 kesim kenarı cümleleri, ortak "hâle/ışıma yok" kuralı, W2.18 `web_hero` 1200×630 kırpım kuralı. W1 comp'ları değişmez.
