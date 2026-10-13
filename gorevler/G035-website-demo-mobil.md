---
id: G035
baslik: Tasarım 03 — mobil öncelikli website demosu (GPT parçalarıyla açılış şovu) · PİLOT
rol: claude-kod
durum: alindi
alan: claude-kod-10
oncelik: 1
bagimli: [G030, G032]
yazar: [collections/03_Blush_Garden_Rose/website/]
---

## Amaç
K22: ürün yalnız website. Tasarım 03'ün GPT parçalarıyla (G030) **telefonda ilk açılışta etkileyen** tek
sayfa düğün websitesi demosu. Bu demo yeni website standardını belirler ve kullanıcıya teslim biçimi kararı
(Canva Website / kendi kodlu site) için gösterilir. Claude görsel çizmez; yalnız yerleşim, tipografi, hareket.

## Girdiler
- GPT parçaları: `collections/03_Blush_Garden_Rose/assets/gpt/parts/`, hedef görünüm: `.../comps/`
- `tools/parts_prep.py` (yeşil pencere → şeffaf + koordinat; ön cep kesimi)
- `collections/03_Blush_Garden_Rose/content.demo.json`, `palette.json`
- Örnek yapı (yalnız bölüm sırası/işaretler): `collections/02_Dusty_Blue/website/`

## Yapılacaklar
1. Önce 390 px telefon için tasarla; sonra 360/430/768/1280.
2. Açılış şovu: kapalı zarf + kurdele → dokununca kurdele kayar, zarf açılır, kart yükselir, çiçekler ve
   yapraklar ayrı katman hareket eder → siteye geçiş. "Skip" ve `prefers-reduced-motion` desteği.
3. Bölümler: hero (isimler, tarih, geri sayım), davet kartı, Our Story (kemerli altın çerçevelerde 3 foto),
   program, mekân/harita butonu, RSVP (şimdilik yer tutucu), kapanış. Kaydırmada nesneler ayrı girer.
4. Bütün metin HTML; görsellere metin pişirilmez. Fontlar Google Fonts linki.
5. Hafiflik: görseller WebP/AVIF + `srcset`; ilk açılış ≤ ~1,5 MB.
6. Önizleme: 390 px ekran kaydı (MP4/GIF) + 360/390/430/768/1280 tam sayfa görüntü → `website/previews/`.

## Bitti sayılması için
- [ ] Telefonda yatay kayma yok, metin taşmıyor, açılış akıcı (Chromium ölçümü)
- [ ] Görseller yalnız GPT parçaları; kodla çizilmiş dekor yok
- [ ] Önizlemeler kullanıcıya gösterildi

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 alindi: claude-kod-10
