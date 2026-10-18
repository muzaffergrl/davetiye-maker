---
id: G180
baslik: G173/G177'nin açık bıraktığı tema bulguları — isim fontu CLS'si, açılış LCP'si, alt menü, 32 düğme kontrastı (tema standardı olarak)
rol: claude-kod
durum: bitti
alan: claude-G180
oncelik: 2
bagimli: [G173, G177]
yazar: [platform/scripts/font-fallback.ts, platform/scripts/lib/variant-check.ts, platform/themes/*/site.css, platform/themes/*/{index, home, story, details, rsvp}.html, platform/themes/vintage-airmail-love-letter/site.css, platform/themes/music-box-ballerina/variants.css, platform/tests/g180-theme-perf.test.ts, platform/tests/g180-browser.ts, platform/tests/theme-*.test.ts, platform/previews/g180/, platform/previews/g173/g180_after.json, docs/11_TEMA_STANDARDI.md, gorevler/G180-tema-perf.md]
---

## Amaç
G173 "Açık kalanlar" ve G177 kontrast notlarındaki tema düzeyindeki dört bulguyu tema standardı değişikliği olarak kapatmak:
1. font değişiminden gelen CLS > 0,1 (isim başlığı yedek fontta 2 satır, web fontta 1 satır);
2. zarf demolarında yavaş 4G'de açılış LCP'si 3–5 s (DPR 2'de 0,8–1,1 MB, açılış parçalarının hepsi High);
3. sabit alt menünün altında kalan içerik (G177: 26/29/30 RSVP);
4. 32 Music Box Ballerina orijinal paletinde `--rose` üstünde beyaz düğme yazısı ≈ 3,8:1.
Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR.

## Sonuç
**2026-10-18 · claude-G180 — durum: inceleme.** Dal `claude/g180-tema-perf` (taban `claude/zealous-fermi-hy1o40`). Yayın yok,
main'e dokunulmadı, PR yok. PROJECT_STATE.json / AGENTS.md / CLAUDE.md değişmedi. `variants.css` / `theme.json` / `recolor.json`'a
elle dokunulmadı (32'nin `variants.css`'i yalnız `recolor_parts.py build --css-only` ile yeniden yazıldı). K21: çizim yok.

**Ölçüm yolu (G173'ün yöntemi).** `next start` üretim build'i, Playwright + `/opt/pw-browsers` Chromium, 390 × 844 DPR 2, CPU 4×,
150 ms RTT, 1,6 Mbps, önbelleksiz; zarf sayfası yüklenir, dokunmadan 6 s beklenir, LCP/CLS PerformanceObserver'dan. Her demo iki
kez ölçüldü: olduğu gibi ve **fontlar 3 s geç** (fonts.gstatic.com isteği tutulur; el yazısı site.js isimleri yedek fontla
sığdırdıktan sonra gelir — en kötü durum). Laboratuvar ölçümü; aynı makinede başka işler de çalıştığı için LCP ±300 ms oynuyor.
Gerçek telefon ve canlı ağ denenmedi. Ham veri: `previews/g180/before*.json`, `after*.json`.

### 1. Font değişiminden gelen CLS — düzeldi (32/32 < 0,1, en yüksek 0,018)
- **Neden:** isim başlığının Google Fonts yüzü `display=swap`; gelene kadar yığındaki sonraki aile (Georgia, Snell Roundhand…)
  çiziyor, el yazısından çok geniş olduğu için isimler 2 satıra sarıyor, font gelince 1 satıra iniyor ve zarf yukarı kayıyor.
- **Düzeltme (tema standardı, docs/11 §12):** `scripts/font-fallback.ts` her temanın isim yüzünü (tarayıcıda, temanın kendi Google
  Fonts bağlantısıyla) iki sistem serifine karşı ölçüp iki `local()` yüz yazıyor: `fb1` (Times New Roman / Liberation Serif /
  Tinos — iOS, macOS, Windows, Linux) ve `fb2` (Noto Serif / Droid Serif — Android; Google Fonts'taki Noto Serif üzerinde
  ölçüldü). `size-adjust` isim derlemesinin (demo çifti + 30 yaygın ad) genişliğini, `ascent-/descent-/line-gap-override` web
  yüzünün ölçülerini tutuyor. Yüzler **her sayfanın `<head>`'inde, `site.css`'ten hemen önce satır içi `<style>`**: 01–21'in
  `site.css`'i 45 KB bütçesinin 0–60 B altında, iki yüze yer yok (yorum silmeyi ve boşluk sıkıştırmayı denedim; ilki manifest
  referanslarını siliyordu, ikincisi tema testlerinin birebir CSS eşleşmelerini kırıyordu — ikisi de geri alındı). `site.css`'te
  yalnız yığın değişti: `--script: "Allison",fb1,fb2,"Snell Roundhand", cursive` (+8 B; 06 `--deco`, 19 `--disp` gibi isim
  ailesi neyse o). 02'de +8 B için bir yorumdan 4 harf kısaltıldı; 20 tam 46 080 B; hepsi ≤ 46 080 B.
  Web fontu yüklenince görünüm değişmez (yüzler yalnız font yokken kullanılıyor).
- **04 Vintage Airmail özel durumu:** `fitNames` ismi tam tek satıra ölçekliyor (`one = genişlik / metin`); demo isimleri web
  yüzüyle 0,984 ölçek istiyor, ölçülen yedek ise %1,2 dar → yedekte ölçek 1, web yüzü gelince bir kare 2 satır (0,15). Bu temada
  yedek %1,5 geniş (`WIDER`) ve site.js'ten önceki CSS ölçeği `.97` (`var(--names-scale, .97)`); site.js gelince eskisi gibi
  0,984'e ayarlıyor. Tek başına yedek font ya da ResizeObserver (site.js 35 803/35 840 B, yer yok) yetmedi.
- **Doğrulama:** fonts.gstatic engelliyken isim, kicker ve sahne kutuları web fontlu hâlle ±2 px içinde (32/32; 19 ve 04'te 1 px).

### 2. Açılış LCP'si — iyileşti ama 2,5 s'nin altına inmedi (ayrıntı tabloda)
- **Düzeltme (docs/11 §6, "Ertelenen açılış parçaları"):** kapalı hâlde görünmeyen parçalar (açık kapak, gövde/astar, cep, kart +
  foto + "Your photo here" işareti, dalga, iç kapılar, kitap sayfaları, kese ön/arka, açık şerit, yırtık şerit) ölçülerek seçildi
  (kapalı sahne ekran görüntüsünde parça gizlenince piksel değişmiyorsa) ve `data-defer loading="lazy" fetchpriority="low"
  decoding="async"` aldı (21 tema, 1–9 görsel). Kart vellumdan/kapı aralığından/cep kenarından görünen 06, 11, 14, 18'de kart erken
  kaldı. `index.html`'e bütün temalarda aynı küçük parça: `.js:not(.parts-on) img[data-defer]{display:none!important}` + betik;
  `.stage img[fetchpriority=high]` yüklenip bir kare boyandıktan sonra (rAF + setTimeout; ya da `load`, ilk
  `pointerdown`/`keydown`, açılmış durumda hemen) `parts-on` eklenir ve ertelenen görseller `loading=eager` olur (`tests/g180-browser.ts`
  ilk koşuda 17 emerald'ın kart süsünü ve 09 lavender'ın kese içindeki fotoğrafını yakaladı: kırpılan lazy görsel dokunuşa kadar
  hiç yüklenmiyordu), parçalar dokunuştan önce birlikte yüklenir. Şelalede (tuscan) parçalar artık kapalı zarf bittikten sonra başlıyor
  (önce 210 ms'de, sonra 3,97 s'de). İlk görünümde High öncelikli görsel KB'ı: olive 743 → 557, blush 787 → 442, tuscan 896 →
  584, sunflower 804 → 462, enchanted 584 → 306.
- **Açılış aynı:** önce/sonra dokunuş kareleri (100–2600 ms) olive, coastal (dalga), art-deco (kapılar), enchanted (kitap):
  `previews/g180/frames_*.png` (üst sıra önce, alt sıra sonra) — zamanlama farkı dışında aynı; parçalar dokunuştan önce yüklü.
- **Neden 2,5 s'ye inmedi:** kalan ilk görünüm ağırlığı açılış parçası değil, görünen sahne: DPR 2'de köşe çiçekleri (olive
  `decor_tl-960` 167 KB + `decor_br-960` 146 KB, ikisi de High), zemin ve 2–3 web fontu. Laboratuvar sunucusu HTTP/1.1 (6 bağlantı
  bant genişliğini eşit paylaşıyor), öncelik farkı Vercel'in HTTP/2'sinde daha çok işler — burada ölçülmedi. Sonraki adım (tema
  kararı, bu görevde yapılmadı): köşe kümelerinin `sizes`'ı/DPR 2 türevi ya da `fetchpriority="low"`.
- İlk taramada 06 art-deco ve 21 crimson "sonra" daha yüksek göründü (ayrı zamanlarda ölçüm); yan yana ölçümde ikisi de iyileşti
  (2254 → 2070, 1870 → 1462). 15 cherry yan yana ilk denemede ~+100 ms idi: parçaların serbest bırakılması kapalı zarfın
  boyandığı kareye biniyordu; serbest bırakma bir kare sonraya (rAF + setTimeout) alındı → 2504 → 2390. Gerileme yok
  (18 wildflower +4 ms, gürültü).

| Demo | LCP ms önce → sonra | İlk görünüm High görsel KB önce → sonra | CLS önce → sonra | CLS, fontlar +3 s: önce → sonra |
|---|---|---|---|---|
| art-deco-black-tie | 2254 → 2070 | 573 → 421 | 0,007 → 0,005 | 0,007 → 0,005 |
| azulejo-mosaic | 828 → 772 ¹ | 57 → 57 | 0,002 → 0,002 | 0,002 → 0,002 |
| blush-garden-rose | 5102 → **3670** | 787 → 442 | 0,002 → 0,002 | 0,002 → 0,002 |
| boho-pampas-terracotta | 3646 → **3382** | 605 → 487 | 0,002 → 0,001 | 0,002 → 0,001 |
| burgundy-velvet-autumn | 2296 → **2040** | 554 → 324 | 0,085 → 0,006 | 0,087 → 0,006 |
| celestial-observatory | 792 → 808 ¹ | 30 → 30 | 0,009 → 0,003 | 0,010 → 0,003 |
| cherry-blossom-spring | 2504 → 2390 | 443 → 253 | 0,024 → 0,018 | 0,012 → 0,007 |
| coastal-seaside | 2870 → **2542** | 616 → 277 | **0,158** → 0,008 | **0,110** → 0,008 |
| crimson-rose-atelier | 1870 → **1462** | 616 → 447 | 0,001 → 0,001 | 0,001 → 0,001 |
| dusty-blue-champagne | 1896 → **1432** | 631 → 493 | **0,121** → 0,001 | 0,003 → 0,001 |
| emerald-gold-estate | 3154 → **2898** | 609 → 343 | 0,084 → 0,001 | 0,095 → 0,001 |
| enchanted-forest-storybook | 4738 → **3062** | 584 → 306 | **0,131** → 0,006 | **0,131** → 0,001 |
| grand-theatre-premiere | 1532 → 1384 ¹ | 312 → 314 | 0,003 → 0,002 | 0,003 → 0,002 |
| ivory-lace-pearls | 2830 → 2802 | 583 → 337 | **0,128** → 0,011 | **0,135** → 0,011 |
| kintsugi-washi | 1544 → 1392 ¹ | 44 → 44 | 0,003 → 0,001 | 0,003 → 0,001 |
| lavender-provence | 3382 → **3172** | 675 → 462 | 0,002 → 0,001 | 0,002 → 0,001 |
| maison-patisserie | 1832 → 1780 ¹ | 254 → 254 | 0,003 → 0,003 | 0,003 → 0,003 |
| mediterranean-lemon | 1256 → 1240 | 500 → 315 | 0,001 → 0,001 | 0,001 → 0,001 |
| midnight-garden | 1742 → 1678 | 397 → 216 | 0,007 → 0,006 | 0,003 → 0,002 |
| music-box-ballerina | 972 → 948 ¹ | 138 → 138 | 0,005 → 0,002 | 0,005 → 0,002 |
| nocturne-lake-estate | 1416 → 1360 ¹ | 245 → 245 | 0,001 → 0,000 | 0,001 → 0,000 |
| olive-ivory | 3376 → 3366 | 743 → 557 | 0,002 → 0,002 | 0,002 → 0,002 |
| orient-express-voyage | 912 → 944 ¹ | 11 → 11 | 0,003 → 0,000 | 0,005 → 0,003 |
| riad-lantern-nights | 1788 → 1824 ¹ | 203 → 203 | 0,004 → 0,002 | 0,004 → 0,002 |
| sky-lantern-festival | 856 → 884 ¹ | 152 → 152 | 0,007 → 0,002 | 0,007 → 0,002 |
| sunflower-rustic-barn | 5252 → **4056** | 804 → 462 | 0,006 → 0,006 | 0,004 → 0,004 |
| tropical-destination | 2422 → 2406 | 543 → 413 | 0,021 → 0,000 | 0,001 → 0,000 |
| tuscan-vineyard | 4810 → **3830** | 896 → 584 | **0,139** → 0,001 | **0,139** → 0,001 |
| velvet-jewel-box | 836 → 696 ¹ | 219 → 219 | 0,002 → 0,002 | 0,002 → 0,002 |
| vintage-airmail-love-letter | 3242 → 3174 | 627 → 591 | **0,147** → 0,001 | **0,147** → 0,001 |
| wildflower-meadow-vellum | 962 → 966 | 312 → 306 | 0,001 → 0,001 | 0,002 → 0,001 |
| winter-evergreen | 3518 → **3200** | 662 → 408 | 0,003 → 0,003 | 0,003 → 0,003 |

LCP (01–21): eski şablonlu sunucu (`PLATFORM_THEMES_DIR` = G180 öncesi `themes/`) ile yeni sunucu **aynı anda, dönüşümlü** ölçüldü,
2'şer koşunun ortalaması (`previews/g180/lcp_head_to_head.txt`); kalın = ≥ 200 ms kazanç. ¹ 22–32: açılış parçası ertelenmedi (LCP
zaten < 2,5 s), değerler ayrı zamanlarda alınmış önce/sonra taramasından (gürültü). Aktarım toplamı değişmedi (parçalar yine
dokunuştan önce yükleniyor); azalan, kapalı nesneyle yarışan yüksek öncelikli görsel baytı.

### 3. Sabit alt menünün altında içerik — yok, ölçüm artefaktıydı (şablon değişikliği gerekmedi)
- 32 tema × home/story/details/rsvp (+ RSVP'de "katılıyorum" seçili, yani "Number of guests" görünürken), 390 × 844, sayfa
  sonuna kaydırılmış: sabit menünün altında kalan metin ya da kontrol **0** (128 + 32 sayfa). Bütün temalar alt boşluğu zaten
  `menü yüksekliği + env(safe-area-inset-bottom) (+ pay)` olarak veriyor (22–32 `body`, 01–21 `.site-main`).
- G177'deki "Number of guests 1,52:1" palet kontrol aracının hatasıydı: tam sayfa ekran görüntüsünde sabit menü sayfanın ortasına
  boyanıyor ve altındaki metin menü şeridinde ölçülüyordu. **Düzeltme:** `scripts/lib/variant-check.ts` inceleme görüntüsünü
  eskisi gibi alıyor, kontrast ölçümü için sabit/yapışkan katmanları gizliyor. 26, 29, 30: variant-check 5/5 palet temiz, orijinal
  palette uyarı kalmadı (önce 26: 2,59, 29: 2,85, 30: 1,78 "uyarı"; 30 teal-glaze bu yüzden `theme-check`'te FAIL veriyordu).

### 4. 32 Music Box Ballerina düğme kontrastı — düzeldi
`site.css` `--rose` `#b76e79` → `#a35c68` (aynı ton, OKLab L −0,06): beyaz düğme yazısı **3,80 → 4,90:1**, krem üstünde 3,62 → 4,66:1
(paletlerin `--rose/--cream ≥ 4,6` kuralını orijinal de artık sağlıyor). `--rose` yalnız `.btn` zemini/kenarı ve radyo `accent-color`.
`python3 tools/recolor_parts.py build --design 32 --css-only` → paletlerin `--rose`'u 1 birim kaydı (kontrast kuralı zaten
sabitliyordu); `check --design 32`: temiz.

### 33–38 (koordinatör talebi, merge sonrası)
Taban daldan gelen 6 yeni tasarıma (33 marigold-mehndi, 34 red-lacquer-double-happiness, 35 highland-tartan-thistle,
36 victorian-glasshouse, 37 art-nouveau-lily, 38 papel-picado-fiesta; hepsi `coming`) aynı standart uygulandı:
- **Yedek font:** `font-fallback.ts` 6 temaya `fb1`/`fb2` yazdı. 36'da isim değil, üstündeki "eyebrow kicker-line" (Old
  Standard TT) yedek fontta 1, web fontta 2 satır oluyordu: kafa 144 → 121 px, sahne 12 px kayıyordu. Araç bu yüzden
  isteğe bağlı kicker yüzleri (`fk1`/`fk2`, `KICKER` listesi) yazabiliyor; 36'da artık fontlar engelliyken geometri aynı.
  CLS (G173 yöntemi, eski/yeni yan yana): 33 0,004 → 0,002, 34 0,007 → 0,004, 35 0,005 → 0,002, 36 0,041 → 0,035, 37 0,008 →
  0,001, 38 0,002 → 0,001; fontlar 3 s geçken de aynı.
- **LCP:** 0,85–2,0 s (ilk görünüm 166–292 KB). Açılış parçaları geçici olduğu için CSS zemini (`url(img/…)`), sahnede tek `<img>`
  kart fotoğrafı; ertelenecek `<img>` parça yok. Kural PAKET 5 parçaları `<img>` olarak gelince uygulanır (docs/11 §6'ya not).
- **Alt menü:** 6 tema × 5 sayfa, sayfa sonunda menünün altında içerik yok.
- **Düğme kontrastı:** 38 temanın bütün sayfalarındaki dolu zeminli düğmeler (.btn, button, [role=button]) ölçüldü: 4,5:1 altı
  yok. Ölçüm 32'nin eski `--rose`'unu enjekte edince 3,80:1'i yakalıyor. Bu denetim `tests/g180-browser.ts`'e eklendi (5. madde).
- `theme-check --stress`: 6/6 hatasız (33–37 112/112, 38 110/110). Uyarılar: W1 comp ve PAKET 2 fotoğrafı henüz yok; 38'de geri
  dönüşte view transition yok.

### Testler
- `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`: merge sonrası **yeşil** — 1728 test,
  1725 geçti, 3 atlandı (build'siz), 0 hata; trace-check ve js-budget geçti (`/edit/[slug]` 188,2/205 KB).
  Tema testleri güncellendi: 20 temada index CSP hash sayısı 2 → 3 (erken durum + ertelenen parçalar + speculation rules),
  06/14/04 yığın eşleşmeleri `,fb1,fb2,` ile, 04'te `var(--names-scale, .97)` ve "zarf sayfası ilk görünüm: lazy yalnız
  ertelenen parçalar". Yeni `tests/g180-theme-perf.test.ts` (3 test): her sayfada aynı yedek-yüz bloğu `site.css`'ten önce,
  `site.css` yığınında fb1/fb2, ertelenen parçalar lazy + low, kapalı nesne high, serbest bırakma parçası bütün temalarda
  aynı, `site.css` ≤ 45 KB. Taban dalından gelen 33–38 (art-nouveau-lily, highland-tartan-thistle, marigold-mehndi,
  papel-picado-fiesta, red-lacquer-double-happiness, victorian-glasshouse) ilk turda dışarıda kaldı;
  koordinatörün isteğiyle sonra onlara da uygulandı (yukarıda "33–38"); test listesi artık 38 tema.
- `node scripts/font-fallback.ts --check` (32 tema, taze ölçüm): fark yok.
- `tests/g180-browser.ts` (yeni, build sonrası elle): **170/170** — 32 demo CLS ≤ 0,1 olduğu gibi ve fontlar 3 s geç; yedek
  fontla isim/kicker/sahne ±2 px; 21 temada hiçbir ertelenen parça kapalı nesne yüklenmeden istenmiyor ve hepsi dokunuştan önce
  yüklü; 32 tema × 5 sayfa sonunda sabit menünün altında içerik yok. `previews/g180/metrics.json`.
- `tests/g173-browser.ts`: **94/97** (G173 sonunda 91/97). Coastal CLS ve panel `#edit/photos`/`#share` LCP'si artık geçiyor
  (panel: G181). Kalan 3 FAIL açık madde 2: demo LCP olive 3384, blush 3676, coastal 2652 ms (> 2,5 s). `previews/g173/g180_after.json`.
- `theme-check --stress`, 32 tema: **32/32 hatasız** (paralel 3 işçi; 21 crimson home → story geçişinde paralel yükte bir kez 6 s
  zaman aşımı verdi, tek başına 117/117). İki istisna önceden vardı ve G180'le ilgisiz:
  - 01 olive "draft preview, no photos" home: kart metni boyalı süsün üstünde (pixel test, kart 720 px > görsel 260 px) — G180
    öncesi dosyalarla (`git checkout 6cb6cf7c -- themes/olive-ivory/`) da aynı FAIL; açık bırakıldı (G180 kapsamı dışı).
  - 30 azulejo teal-glaze "Number of guests 1,52:1": tam sayfa menü artefaktı, variant-check düzeltmesiyle temiz (yukarıda 3).
  Uyarılar önceden olanlar: "Google font not loaded" (26 Shippori Mincho, 03 Cormorant — `document.fonts.check` 400 ağırlığı
  sorgusu), orijinal paletten gelen kontrast uyarıları (24 "Act" 4,28, 19 "C&D" 4,13, 14 "We're getting married" 4,27).
  Son serbest bırakma değişikliğinden sonra 17 ve 09 yeniden: 133/133.
- `python3 tools/recolor_parts.py check --design 32`: temiz. variant-check 26/29/30: 5/5 palet, uyarısız.
- Açılış kareleri (önce/sonra): `previews/g180/frames_{olive-ivory,coastal-seaside,art-deco-black-tie,enchanted-forest-storybook}.png`.

**Denenmedi:** gerçek iPhone/Android (`local()` eşleşmesi Android Chrome'da Noto Serif adıyla — laboratuvarda yalnız Liberation
Serif kuruluydu, fb2 metrikleri web'den indirilen Noto Serif ile ölçüldü), Vercel HTTP/2 üzerinde LCP, Safari.

GPT'den görsel gerekmedi; yeni dekor çizilmedi (K21).


## Günlük
- 2026-10-18 claude-G180: ölçüldü (32 demo, önce/sonra), düzeltildi, testler → inceleme
- 2026-10-18 entegratör onayladı
