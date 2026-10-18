# 25 — Renk paleti varyantları (Aşama 2, G153)

Kullanıcı kararı (2026-10-09): her tasarıma orijinaline **ek 5 renk paleti**. Canva dönemi planı (K24 ile) geçersiz; varyant
artık **platformda** bir tasarımın renk paletidir: aynı şablon, aynı içerik, başka renkler. 21 tasarım × (1 + 5) palet.
K21: Claude dekor çizmez; mevcut GPT sanatını algoritmayla yeniden renklendirmek bir **renk dönüşümüdür** (izinli). Dönüşümün
gerçek ürün gibi durmadığı parça için yeni sanat GPT'den gelir (prompt + tam yol).

## 1. Platformda varyant nedir

| Katman | Nerede | Kural |
|---|---|---|
| Tanım | `platform/themes/<id>/theme.json` → `"swatch"` (orijinalin 1–4 rengi) ve `"variants": [{ id, name, swatch, status, print? }]` | `id` URL'de ve `html[data-variant]`'ta (a-z, 0-9, -); `status: "coming"` (incelemede, satışta yok) / `"live"` |
| Renkler | `platform/themes/<id>/variants.css` (ÜRETİLİR) | yalnız `html[data-variant="<id>"] { --token: … }` blokları; temanın `:root`'u orijinaldir. Sabit renkler önce `:root`'a token olarak taşınır (`--rgb-<hex>: r g b`, kullanım `rgb(var(--rgb-…) / a)`) |
| Görseller | `img/variants/<id>/<dosya>` | yalnız değişen parçalar; olmayan dosya asıla düşer |
| Baskı davetiyesi | `public/print/<id>/variants/<vid>/<ad>.webp` + `theme.json variants[].print {ink, accent, art}` | `lib/print/invitation.ts` metin rengini ve listelenen parçaları değiştirir |
| Site kaydı | `site.variant` (null = orijinal) | içerik (`content`) hiç değişmez |

**Motor (`lib/theme/engine.ts`):** `variant` temanın tanımladığı bir id ise `html[data-variant]`, temanın stil sayfalarından
sonra `variants.css` bağlantısı ve **sanal klasör**: temanın bütün göreli varlıkları `/themes/<id>/~<vid>/…` olur.
`lib/site/static.ts` bu klasörde `img/…` için önce `img/variants/<vid>/…`'ı, yoksa asıl dosyayı verir. Böylece `site.css`
içindeki `url(img/…)` ve tema JS'inin kendi betik adresine göre çözdüğü görseller de kendiliğinden varyanta geçer — şablon,
CSS ve JS değişmez. Bilinmeyen id = orijinal.

**Kim neyi görür:**
- Panel → **Us** → "Color palette": orijinal + `live` paletler (sitenin mevcut paleti incelemeye geri alınmışsa o da listede
  kalır). Seçim `POST /api/edit/<slug>/variant` ile **hemen** taslak önizlemeye ve yayındaki siteye uygulanır (tasarım gibi,
  içerik değil; yayınlamak gerekmez). Metin/foto dokunulmaz.
- `/start?theme=<id>&variant=<vid>` paleti önceden seçer (yalnız `live`); `/start`'ta palet seçici + demo o palette;
  `/my?theme=…&variant=…` → `/start` paleti taşır. Site `createSiteWithKeys` ile yalnız `live` paletle açılır.
- Demo: `/start/demo/<id>?variant=<vid>` — `coming` paletler de görünür (inceleme için), sayfa linkleri `?variant=`'ı korur.
- Satış sitesi: tasarım sayfasında, en az bir `live` palet varsa demo afişinin altında palet çipleri (seçilen palette canlı
  demo açılır) ve "Can I change the colors?" SSS'i "evet" olur. Tasarım listesi ve ana sayfa değişmez.
- Baskı: panelin indirdiği site PDF'i ve davetiye PDF'i sitenin paletinde.

## 2. Yeni varyant ekleme (palet → boyama → prompt → inceleme → canlı)

1. **Paletler** — `collections/<NN_*>/variants/V0x_<slug>/palette.json` (02'nin şeması + G153 alanları):
   ```json
   { "id": "V02_dusty_blue", "slug": "dusty-blue", "name": "Dusty Blue & Ivory",
     "ink": "#28323D", "deep": "#4A5E72", "primary": "#7F95A8", "mist_top": "#EEF1F3", "mist_bottom": "#D5DDE3",
     "gold": "#B39A63", "gold_light": "#D7C79F", "ivory": "#FBF8F0", "leaf": "#8FA2B0",
     "swatch": ["#FBF8F0", "#7F95A8", "#8FA2B0"], "status": "coming",
     "families": { "envelope": "primary", "leaf": "leaf", "gold": null } }
   ```
   `families`: tasarımın her renk ailesi → paletin bir rolü, bir `#hex`, `{ "role": …, "lk": 0.9 }` ya da `null` (dokunma).
   Seçim ölçütü: tasarıma uyan, klasik/romantik, geniş beğenili 5 palet; doğada olmayan çiçek rengi yok (mavi gül, turuncu
   gül sahte durdu — 21'de denendi); koyu zeminli tasarımda (21) koyu ton kalır (açık metin kontrastı).
2. **Boyama manifesti** — `collections/<NN_*>/variants/recolor.json`: `theme`, `families` (aile → `anchor` = parçalarda
   ölçülen medyan renk, `sigma` ton genişliği °, isteğe bağlı `cmin/cfull` kroma eşiği — soluk kağıdı korur, `lk` ışık
   kontrastı), `groups` (parça grubu → girebileceği aileler), `parts` (img/'deki **her** parça: `recolor: auto | gpt | keep`,
   `group`, keep için `why`), `print` (baskı parçaları), `print_colors` (layouts.ts'teki ink/accent + kağıt), `css`
   (`files`, `families`, `roles` — CSS'te bir aile için paletteki başka rol, ör. zarf rengi yerine koyu `deep`; `tokens` tek
   tek aile; `keep`; `contrast` çiftleri `[metin, zemin, oran]`).
   - **Fotoğraf asla boyanmaz** (21'in demo fotoğrafları `keep`). Metal altın/gümüş genellikle `keep` (aile hedefi `null`).
   - Tek seferlik: temanın sabit renklerini token'a taşı — `python3 tools/recolor_parts.py tokenize --theme <id>`.
3. **Boyama** — `python3 tools/recolor_parts.py build --design NN [--variant V0x_…] [--css-only]`: görseller, baskı
   parçaları, `variants.css`, `theme.json` (`status` korunur; yeni palet `coming`), inceleme sayfası
   `collections/<NN_*>/variants/V0x_<slug>/review/contact_sheet.jpg` (her parça asıl | varyant, durum etiketi, token
   renkleri). Metin token'ları `contrast` çiftlerine göre gerekirse koyulaştırılır/açılır (rapor: `contrast_fixes`).
   `python3 tools/recolor_parts.py check --design NN`: manifest = img/ klasörü, 5 palet, theme.json + variants.css yazılmış.
4. **Gözle inceleme** — contact sheet'e **bakılır**; gerçek ürün gibi durmayan parça `recolor: "gpt"` olur ve
   `collections/<NN_*>/variants/GPT_PROMPTS.md`'ye İngilizce prompt + **tam yol ve dosya adı** yazılır (asıl parçanın
   tuvali, boyutu, şeffaflığı, hizası aynı; yalnız renk). GPT dosyası gelince temanın `build_images.py`'si ile aynı kesim
   yapılır ve çıktı `img/variants/<slug>/` altına konur (ya da parça kaynağı varyant klasörüne verilip boyamanın yerine geçer).
5. **Tarayıcı denetimi** — `npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme <id>`
   (theme-check'in parçası da): her palet × sayfa 390 × 844, `html[data-variant]`, başarısız istek yok, **boyalı zeminin
   gerçek renginde** kontrast (gövde ≥ 4,5:1, büyük/el yazısı ≥ 3:1; orijinalde de aynı olan düşüklük uyarı), ekran görüntüleri
   `platform/previews/g153/<id>/variants/<palet>_<sayfa>_390.png`.
6. **Canlıya alma** — yalnız koordinatör: inceleme + variant-check temiz → `theme.json` `"status": "live"` (palette.json'daki
   `status` de) ve `python3 tools/etsy_upload.py --designs NN` (varyasyon seçenekleri güncellenir). `coming` palet satışta,
   panelde, `/start`'ta ve satış sitesinde görünmez.

## 3. Pilot (G153): 01, 03, 21

| Tasarım | Paletler (slug) | Yöntem |
|---|---|---|
| 01 Olive & Ivory | dusty-blue, sage-gold, navy-gold, burgundy-sage, blush-sage | zarf ailesi → `primary`, yapraklar → `leaf`; altın mühür, dantel, fildişi kağıt, zeytin tanesi, beyaz çiçek aynı |
| 03 Blush Garden Rose | peach-cream, lilac-gold, champagne-ivory, dusty-mauve, dusty-blue-blush | gül → doğal gül renkleri (şeftali, leylak, şampanya, gül kurusu); dusty-blue-blush'ta güller pembe kalır, zarf/kurdele mavi |
| 21 Crimson Rose Atelier | midnight-navy, plum-gold, dusty-rose, emerald-ruby, terracotta-rust | koyu şarap zemin (CSS) + zarf → koyu ton; gül → koyu şarap / erik / gül kurusu / kiremit (emerald-ruby'de kırmızı kalır); altın mühür, fotoğraflar aynı |

Hepsi `coming`. Sonuçlar ve açık işler: `gorevler/G153-palet-varyant.md`.

## 4. Boyut

Varyant klasörü yalnız değişen parçaları taşır. Pilot ölçüm (q82 webp): 01 ≈ 1,5 MB / palet, 03 ≈ 2,8 MB / palet (neredeyse
her parça pembe), 21 ≈ 0,25 MB / palet; baskı parçaları 0,15–0,55 MB / palet. Tema klasörü sınırı (docs/11 §15, ≤ 3 MB;
`tools/tema_build.py klasor_boyutu`) **varyant klasörleri hariç** asıl tasarıma uygulanır. **G159 (2026-10-17):** tema
görselleri/CSS/JS (varyantlar dahil) artık **hiçbir işlevin paketinde değil** — `npm run build` önce
`scripts/theme-assets.cjs` ile `public/themes/`'e kopyalar, Vercel CDN'den aynı adreste verir; varyantın kendi görseli
`public/themes/<id>/~<vid>/img/<dosya>`'ya, olmayan dosya `next.config.ts` rewrite'ıyla (yönlendirme değil) asla düşer.
Yeni palet dosyası (`img/variants/<vid>/…`, `variants.css`) bir sonraki build'de kendiliğinden yayına girer; elle adım yok.
Boyut sınırı artık işlev değil, statik dosya: `trace-check` her işlevde tema dosyası ≤ 40 MB, toplam ≤ 200 MB arar
(ayrıntı `docs/10_SITE_PLATFORMU.md`, `gorevler/G159-statik-tema.md`).

**CSS bütçesi:** `site.css` ≤ 45 KB (docs/11 §6). Hiçbir paletin değiştirmediği kanal token'ları build sonunda yeniden
sabit renk olur (`#rrggbb` / `#rrggbbaa`), kalan kanalların asıl değerleri `variants.css :root`'unda durur; bu yüzden motor
paleti olan temada `variants.css`'i orijinal palette de bağlar.

## 5. Etsy: varyantlar nasıl satılır (öneri)

**Öneri: tasarım başına TEK ilan + "Color palette" varyasyonu (bütün seçenekler aynı fiyat).**

- Neden tek ilan: satış ve yorumlar tek ilanda birikir (arama sıralamasında ilanın kendi geçmişi sayılır); 6 ayrı ilan
  6 listeleme ücreti ve 6 yenileme demektir; yalnız rengi farklı kopyalar "tekrarlayan ilan" gibi görünür ve aynı
  aramada birbirleriyle yarışır.
- Etsy'nin varyasyon kuralları (Etsy yardım sayfası, 2026-10-17 tarandı): ilan başına en çok 2 varyasyon türü; bir
  varyasyonun seçeneklerine ilan fotoğrafı bağlanabilir (fotoğraf önce ilana yüklenir; seçilince o fotoğraf görünür).
  Her palete bir ilan görseli (o palette zarf açılışı) bağlanır.
- **Açık kontrol:** kaynaklar dijital ilanda varyasyon desteği konusunda çelişkili (bir rehber "dijital ilanlar
  varyasyon desteklemez" diyor, bir başkası dijital seçenekli varyasyon kuruyor). İlk palet `live` olunca ilan
  düzenleyicisinde gerçek ilanda denenir (`etsy_upload.json` `open_checks`'e otomatik eklenir).
- **Yedek (varyasyon yoksa):** varyasyonsuz tek ilan; açıklama paletleri adıyla sayar, bir görsel paletleri gösterir;
  alıcı paleti `/start`'ta seçer (START HERE linki) ve düzenleyicide istediği an değiştirir. Teslim dosyası zaten
  bütün paletlerde aynı (START HERE PDF), bu yüzden sipariş hangi seçenekle gelirse gelsin teslim değişmez.
- **Fiyat:** aynı (1.460 TL, K42); palet bir seçim, ayrı ürün değil.
- **Arama:** başlık tasarım adını taşır; palet adlarındaki renk kelimeleri (sage, dusty blue, burgundy …) açıklamada ve
  — yer kalırsa — etiketlerde; Etsy'nin "Primary color" özelliği orijinal palete göre kalır. Belirli bir rengin aramada
  çok talep gördüğü veriyle görülürse o palet için ayrı ilan ayrı karar olur.
- `tools/etsy_upload.py` her tasarımın `theme.json` paletlerinden `variations` bloğunu yazar: `property`,
  `price_varies: false`, `options` (orijinal + her palet: `variant`, `status`, `offered` = live, `start_link`),
  `offered`, `fallback`. `--check --strict` palet adlarını (1–40 karakter, tekrar yok) ve durumlarını denetler.
  K41: Etsy'ye hiçbir şey gönderilmez.
- **Palet görselleri (G178):** `python3 tools/listing_editorial.py --theme <NN|all> --palettes --capture palettes` (yerel
  üretim derlemesi) → `package/listing/images_editorial/10_palettes.jpg` (bütün paletlerin kapalı açılış ekranı yan yana)
  + `palette_<id>.jpg` (her palet: açılış kapalı ve açılırken, DPR 3 gerçek ekran; orijinal `palette_original.jpg`), 2000 px
  JPEG q90 (~0,6 MB). Çekim `seed.ts --variant` ile o palette yayınlanmış demo sitedir (coming dahil, yalnız yerel).
  GPT parçası bekleyen palet (`palette.json recolor` / `recolor.json parts` → `gpt`) görsel almaz. `etsy_upload.py` her
  seçeneğe `image` yazar, `variations.images` = ilana eklenecek palet fotoğrafları (`upload`: seçenek satışta; genel görsel
  gösterdiği bütün paletler satıştayken). Etsy sınırı **ilan başına 20 fotoğraf + 2 video** (Etsy Help "How to Create a
  Listing", 2026-10-17): 9 ilan görseli + 1 genel + 6 palet = 16; aşarsa `--check` kural hatası verir.
