---
id: G153
baslik: Aşama 2 renk paleti varyantları platformda — tesisat, recolor aracı, 01/03/21 pilotu, Etsy yapısı
rol: claude-kod
durum: bitti
alan: claude-G153
oncelik: 2
bagimli: [G090, G139, G142, G144]
yazar: [platform/lib/theme/variants.ts, platform/lib/theme/theme.ts, platform/lib/theme/engine.ts, platform/lib/theme/urls.ts, platform/lib/site/static.ts, platform/lib/data/types.ts, platform/lib/sites.ts, platform/lib/panel/api.ts, platform/lib/panel/model.ts, platform/lib/panel/state.ts, platform/app/api/edit/[slug]/variant/, platform/components/palette/, platform/components/panel/Palette.tsx, platform/components/panel/Panel.tsx, platform/components/panel/usePanel.ts, platform/components/panel/api.ts, platform/app/start/, platform/app/my/page.tsx, platform/components/my/MyWebsite.tsx, platform/lib/claim/claim.ts, platform/lib/claim/demo-page.ts, platform/lib/marketing/palettes.ts, platform/components/marketing/Demo.tsx, platform/components/marketing/demo-data.ts, platform/components/marketing/marketing.module.css, platform/components/marketing/pages/DesignPage.tsx, platform/lib/print/invitation.ts, platform/lib/print/api.ts, platform/scripts/lib/variant-check.ts, platform/scripts/variant-check.cjs, platform/scripts/theme-check.cjs, platform/scripts/trace-check.cjs, platform/next.config.ts, platform/lib/i18n/dict/, platform/tests/g153-variants.test.ts, platform/tests/engine.test.ts, platform/tests/theme-olive-ivory.test.ts, platform/themes/olive-ivory/, platform/themes/blush-garden-rose/, platform/themes/crimson-rose-atelier/, platform/public/print/*/variants/, platform/previews/g153/, tools/recolor_parts.py, tools/tests/test_recolor_parts.py, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, tools/tema_build.py, tools/tests/test_tema_build.py, collections/01_Olive_Ivory/variants/, collections/03_Blush_Garden_Rose/variants/, collections/21_Crimson_Rose_Atelier/variants/, collections/01_Olive_Ivory/package/listing/etsy_upload.json, collections/03_Blush_Garden_Rose/package/listing/etsy_upload.json, collections/21_Crimson_Rose_Atelier/package/listing/etsy_upload.json, docs/25_PALET_VARYANTLARI.md, docs/11_TEMA_STANDARDI.md, gorevler/G153-palet-varyant.md]
---

## Amaç
Kullanıcı kararı (2026-10-09): her tasarıma orijinale ek 5 renk paleti (21 tasarım). Canva planı K24 ile geçersiz; palet
platformda bir tasarımın renk seçeneği. K21: mevcut GPT sanatını algoritmayla yeniden renklendirmek renk dönüşümüdür;
yeni sanat gerekirse GPT istemi. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Ayrıntı: `docs/25_PALET_VARYANTLARI.md`.

## Sonuç
**2026-10-17 · claude-G153 — durum: inceleme.** Dal `claude/g153-palet-varyant`. Yayın yok, main'e dokunulmadı, PR yok,
Etsy'ye hiçbir şey gönderilmedi (K41). Bütün paletler `coming` (satışta / panelde / /start'ta / satış sitesinde görünmez).

### Platform
- `theme.json` `swatch` + `variants[{id, name, swatch, status, print?}]` (`lib/theme/variants.ts`, doğrulamalı).
- Renkler yalnız token: temanın `:root`'u orijinal; üretilen `variants.css` = `:root` kanal token'ları + `html[data-variant]`
  blokları. 01/03/21'in sabit renkleri `--c-<hex>` kanallarına taşındı (`recolor_parts.py tokenize`), site.css ≤ 45 KB korundu.
- Görseller `img/variants/<id>/`; motor varlıkları `/themes/<id>/~<vid>/…` sanal klasörüne yönlendirir, varlık rotası
  override'ı ya da asılı verir (site.css `url()` ve tema JS'i kendiliğinden doğru dosyayı alır).
- Site kaydı `variant`; panel → Us → **Color palette** (orijinal + live; seçim anında önizleme + yayındaki site, içerik
  değişmez; `POST /api/edit/<slug>/variant`, live dışı → 422).
- `/start?theme=&variant=` ön seçim + /start'ta palet seçici ve demo o palette; `/my?…&variant=` → /start taşır; site
  yalnız live paletle açılır. Demo `?variant=` (coming dahil, inceleme için; linkler korunur).
- Satış sitesi tasarım sayfası: en az bir live palet varsa demo altında palet çipleri (seçilen palette canlı demo) + SSS
  "renkleri değiştirebilir miyim" evet olur; liste/ana sayfa değişmez.
- Baskı: site PDF'i ve davetiye PDF'i palette (`variants[].print {ink, accent, art}` + `public/print/<id>/variants/<vid>/`).
- `theme-check` (+ tek başına `scripts/variant-check.cjs`): her palet × 5 sayfa, 390×844, data-variant, başarısız istek yok,
  **boyalı zeminin gerçek renginde** kontrast (≥ 4,5 gövde / ≥ 3 büyük-el yazısı; orijinalde de olan düşüklük uyarı).
- i18n: yeni metinler EN + tr/es/de/fr (panel, market). ABD yazımı ("Color palette"), satış sitesiyle aynı.

### Araç ve pilot
- `tools/recolor_parts.py` (OKLab/OKLCH aile aktarımı: ton yakınlığı + kroma eşiği, doku/alfa korunur, metal altın ve fildişi
  kağıt sabit; CSS token'larına aynı dönüşüm + kontrast düzeltmesi; contact sheet; `check`).
- 01 Olive & Ivory: dusty-blue, sage-gold, navy-gold, burgundy-sage, blush-sage — 22 parça auto, 9 keep (zeytin tanesi, beyaz
  çiçek, fildişi kağıt/kart, foto yer tutucuları).
- 03 Blush Garden Rose: peach-cream, lilac-gold, champagne-ivory, dusty-mauve, dusty-blue-blush — 32 auto, 1 keep.
- 21 Crimson Rose Atelier: midnight-navy, plum-gold, dusty-rose, emerald-ruby, terracotta-rust — 4 auto, 11 keep (4 fotoğraf).
- İnceleme sayfaları: `collections/{01_Olive_Ivory,03_Blush_Garden_Rose,21_Crimson_Rose_Atelier}/variants/V0x_*/review/contact_sheet.jpg`;
  platformda gerçek render: `platform/previews/g153/<tema>/variants_sheet.jpg` (her palet: index/home/details/rsvp).
- Gözle inceleme sırasında düzeltilenler: 01 lacivert paletinde mühür altını griye kayıyordu (botanik gruba geniş altın
  aileleri), 01 bordo zarf kahverengiye dönüyordu (altın koruması zarf grubundan çıkarıldı), 03 taç yaprakları
  şampanya/leylakta lekeliydi (ayrı "petal" ailesi). 21'de kırmızı → mavi/beyaz/turuncu gül sahte durdu: o paletler
  seçilmedi (fildişi gül için istem `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md`'de, yalnız istenirse).
- **GPT parçası gerekmedi** (3 `GPT_PROMPTS.md` durumu yazıyor).

### Etsy
Öneri (docs/25 §5): tasarım başına TEK ilan + "Color palette" varyasyonu, aynı fiyat. Kaynaklar dijital ilanda varyasyon
desteği konusunda çelişkili → açık kontrol (ilk live palette `open_checks`'e kendiliğinden girer) + yedek yapı (varyasyonsuz,
palet /start'ta seçilir). `etsy_upload.py` `variations` bloğu (yalnız paleti olan tasarımda) + `--check --strict` palet adı
denetimi; 01/03/21 `etsy_upload.json` yeniden üretildi (fark yalnız `variations`). Ayrıca `opening_object` regex'i G144'ün
`msg('…')` sarmalayıcısını tanımıyordu (bütün `--check` düşüyordu) → düzeltildi.

### Testler (komut + sayı)
- `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build` → tsc temiz, build + trace-check
  temiz (asset rotası 42 → 64 MB); testler `.next` yokken **1396/1396**, build sonrası **1397/1398**: tek kırmızı
  `marketing-build` (21'in /es /de /fr meta açıklaması 180–189 karakter > 160) — G153 bu çevirilere dokunmadı (sözlük farkı
  yalnız ekleme), yalnız derlenmiş çıktı varken koşan, önceden var olan bulgu (market çevirisi görevi).
- `node scripts/variant-check.cjs --theme <id>` (01, 03, 21): **15/15 palet geçti**; uyarılar yalnız orijinalden gelen.
- `python3 -m pytest tools/tests -q`: yeni/dokunduğum testler yeşil (`test_recolor_parts` 13, `test_etsy_upload`,
  `test_tema_build`). **Önceden var olan** kırmızılar (taban dalda da aynı): 20 hata (betik tarzı testler pytest'te fixture
  arıyor: kit_check, listing_kit, md_to_pdf, mockup_compose, parts_prep*, build_customer_guides::test_pdf) ve
  `test_build_customer_guides` (4) + `test_listing_editorial` (2) — aynı `msg('…')` regex sorunu, başka ajanın araçları.

### Bulgular (koordinatöre)
- 03'ün **orijinal** paletinde boyalı zeminde 15 metin < 4,5:1 (ör. home "Read our story" 3,94, "Reply now" 3,76,
  index "Click to open" 4,38) — dusty-blue-blush aynısını taşıyor (uyarı); diğer 4 palet geçiyor. Ayrı görev önerisi.
- 01 orijinal: home mühür monogramı "A & J" 2,67 (dekoratif, aria-hidden, kasıtlı kabartma).
- 01 navy og görseli: arka plan soğuk griye kayıyor ve JPEG bantlanması büyüyor (paylaşım görseli; kabul edilebilir, istenirse
  og'yi zarf/botanik ayrı maskeyle yeniden).
- Demo fotoğraflarında (21) kırmızı güller her palette görünür (fotoğraf boyanmaz; alıcı kendi fotoğrafını koyar).

### Denenmedi
Gerçek iPhone/Safari ve Android Chrome; Vercel'de yayın; Etsy ilan düzenleyicisinde dijital ilan varyasyonu; panelin palet
seçicisinin tarayıcıda elle tıklanması (API + birim testleri var, tarayıcı testi yok); baskı PDF'lerinin palette gerçek
Chromium çıktısı (HTML testleri var).

## Kalan 18 tasarım (Aşama 2 devamı; eski Canva dönemi GP1NN–GP4NN yerine)
Her biri tek görev: palet seç (5) → `recolor.json` → `tokenize` + `build` → contact sheet'e bak → gerekirse GPT istemi →
`variant-check` → inceleme. Eski GP2NN (görsel), GP3NN (Canva), GP4NN (ilan) bu akışla gereksiz; ilan `etsy_upload.py`'den.

| Görev | Tasarım | Tema |
|---|---|---|
| GP102 | 02 Dusty Blue | dusty-blue-champagne (Canva dönemi V02–V06 `palette.json` var: aynı paletlerle başlanabilir) |
| GP104 | 04 Vintage Airmail | vintage-airmail-love-letter |
| GP105 | 05 Lemon Mediterranean | mediterranean-lemon |
| GP106 | 06 Art Deco Noir | art-deco-black-tie |
| GP107 | 07 Burgundy Velvet | burgundy-velvet-autumn |
| GP108 | 08 Winter Evergreen | winter-evergreen |
| GP109 | 09 Lavender Provence | lavender-provence |
| GP110 | 10 Tuscan Vineyard | tuscan-vineyard |
| GP111 | 11 Boho Pampas | boho-pampas-terracotta |
| GP112 | 12 Tropical Destination | tropical-destination |
| GP113 | 13 Enchanted Forest | enchanted-forest-storybook |
| GP114 | 14 Ivory Lace Pearl | ivory-lace-pearls |
| GP115 | 15 Cherry Blossom | cherry-blossom-spring |
| GP116 | 16 Sunflower Rustic | sunflower-rustic-barn |
| GP117 | 17 Emerald Gold Estate | emerald-gold-estate |
| GP118 | 18 Wildflower Vellum | wildflower-meadow-vellum |
| GP119 | 19 Midnight Garden | midnight-garden |
| GP120 | 20 Coastal Seaside | coastal-seaside |

(GP101 ve GP103 bu görevle karşılandı; 22 Nocturne Lake Estate satışa açılınca GP122.) Görev dosyalarının yeniden yazılması
entegratörün işi (`tools/katalog.py`); bu görev yalnız eşlemeyi verir.

## Günlük
- 2026-10-17 claude-G153: alındı → tesisat, araç, pilot, Etsy, belgeler; durum inceleme.
- 2026-10-17 entegratör onayladı
