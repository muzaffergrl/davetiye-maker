---
id: G180
baslik: G173/G177'nin açık bıraktığı tema bulguları — isim fontu CLS'si, açılış LCP'si, alt menü, 32 düğme kontrastı (tema standardı olarak)
rol: claude-kod
durum: inceleme
alan: claude-G180
oncelik: 2
bagimli: [G173, G177]
yazar: [platform/scripts/font-fallback.ts, platform/scripts/lib/variant-check.ts, platform/themes/*/site.css, platform/themes/*/{index,home,story,details,rsvp}.html, platform/themes/vintage-airmail-love-letter/site.css, platform/themes/music-box-ballerina/variants.css, platform/tests/g180-theme-perf.test.ts, platform/tests/g180-browser.ts, platform/tests/theme-*.test.ts, platform/previews/g180/, docs/11_TEMA_STANDARDI.md, gorevler/G180-tema-perf.md]
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
  `pointerdown`/`keydown`, açılmış durumda hemen) `parts-on` eklenir, parçalar dokunuştan önce birlikte yüklenir. Şelalede (tuscan) parçalar artık kapalı zarf bittikten sonra başlıyor
  (önce 210 ms'de, sonra 3,97 s'de). İlk görünümde High öncelikli görsel KB'ı: olive 743 → 557, blush 787 → 442, tuscan 896 →
  584, sunflower 804 → 462, enchanted 584 → 306.
- **Açılış aynı:** önce/sonra dokunuş kareleri (100–2600 ms) olive, coastal (dalga), art-deco (kapılar), enchanted (kitap):
  `previews/g180/frames_*.png` (üst sıra önce, alt sıra sonra) — zamanlama farkı dışında aynı; parçalar dokunuştan önce yüklü.
- **Neden 2,5 s'ye inmedi:** kalan ilk görünüm ağırlığı açılış parçası değil, görünen sahne: DPR 2'de köşe çiçekleri (olive
  `decor_tl-960` 167 KB + `decor_br-960` 146 KB, ikisi de High), zemin ve 2–3 web fontu. Laboratuvar sunucusu HTTP/1.1 (6 bağlantı
  bant genişliğini eşit paylaşıyor), öncelik farkı Vercel'in HTTP/2'sinde daha çok işler — burada ölçülmedi. Sonraki adım (tema
  kararı, bu görevde yapılmadı): köşe kümelerinin `sizes`'ı/DPR 2 türevi ya da `fetchpriority="low"`.
- 06 art-deco (1780 → 2252) ve 21 crimson (1464 → 1764) sonra biraz yüksek ölçüldü; ertelenen parçaları dışında ilk görünüm
  aynı, fark ±300 ms ölçüm gürültüsü bandında ya da hemen üstünde — __ADCR__

| Demo | LCP ms önce → sonra | Aktarım KB önce → sonra | CLS önce → sonra | CLS, fontlar +3 s: önce → sonra |
|---|---|---|---|---|
| art-deco-black-tie | 1780 → 2252 | 738 → 740 | 0,007 → 0,005 | 0,007 → 0,005 |
| azulejo-mosaic | 828 → 772 | 222 → 223 | 0,002 → 0,002 | 0,002 → 0,002 |
| blush-garden-rose | 5104 → 3668 | 1060 → 1054 | 0,002 → 0,002 | 0,002 → 0,002 |
| boho-pampas-terracotta | 3608 → 3400 | 813 → 815 | 0,002 → 0,001 | 0,002 → 0,001 |
| burgundy-velvet-autumn | 2308 → 2148 | 851 → 853 | 0,085 → 0,006 | 0,087 → 0,006 |
| celestial-observatory | 792 → 808 | 159 → 159 | 0,009 → 0,003 | 0,010 → 0,003 |
| cherry-blossom-spring | 2184 → 2248 | 675 → 695 | 0,024 → 0,018 | 0,012 → 0,007 |
| coastal-seaside | 2828 → 2472 | 875 → 870 | **0,158** → 0,008 | **0,110** → 0,008 |
| crimson-rose-atelier | 1464 → 1764 | 776 → 777 | 0,001 → 0,001 | 0,001 → 0,001 |
| dusty-blue-champagne | 2016 → 1612 | 881 → 883 | **0,121** → 0,001 | 0,003 → 0,001 |
| emerald-gold-estate | 3116 → 2900 | 835 → 824 | 0,084 → 0,001 | 0,095 → 0,001 |
| enchanted-forest-storybook | 4836 → 3224 | 922 → 924 | **0,131** → 0,006 | **0,131** → 0,001 |
| grand-theatre-premiere | 1532 → 1384 | 456 → 456 | 0,003 → 0,002 | 0,003 → 0,002 |
| ivory-lace-pearls | 2848 → 2836 | 871 → 873 | **0,128** → 0,011 | **0,135** → 0,011 |
| kintsugi-washi | 1544 → 1392 | 249 → 250 | 0,003 → 0,001 | 0,003 → 0,001 |
| lavender-provence | 3424 → 3192 | 897 → 847 | 0,002 → 0,001 | 0,002 → 0,001 |
| maison-patisserie | 1832 → 1780 | 352 → 353 | 0,003 → 0,003 | 0,003 → 0,003 |
| mediterranean-lemon | 1408 → 1144 | 745 → 747 | 0,001 → 0,001 | 0,001 → 0,001 |
| midnight-garden | 1848 → 1620 | 698 → 700 | 0,007 → 0,006 | 0,003 → 0,002 |
| music-box-ballerina | 972 → 948 | 256 → 256 | 0,005 → 0,002 | 0,005 → 0,002 |
| nocturne-lake-estate | 1416 → 1360 | 380 → 380 | 0,001 → 0,000 | 0,001 → 0,000 |
| olive-ivory | 3472 → 3296 | 994 → 996 | 0,002 → 0,002 | 0,002 → 0,002 |
| orient-express-voyage | 912 → 944 | 165 → 166 | 0,003 → 0,000 | 0,005 → 0,003 |
| riad-lantern-nights | 1788 → 1824 | 327 → 327 | 0,004 → 0,002 | 0,004 → 0,002 |
| sky-lantern-festival | 856 → 884 | 276 → 276 | 0,007 → 0,002 | 0,007 → 0,002 |
| sunflower-rustic-barn | 5028 → 4104 | 1144 → 1146 | 0,006 → 0,006 | 0,004 → 0,004 |
| tropical-destination | 2432 → 2248 | 799 → 802 | 0,021 → 0,000 | 0,001 → 0,000 |
| tuscan-vineyard | 4836 → 3844 | 1115 → 1102 | **0,139** → 0,001 | **0,139** → 0,001 |
| velvet-jewel-box | 836 → 696 | 397 → 397 | 0,002 → 0,002 | 0,002 → 0,002 |
| vintage-airmail-love-letter | 3252 → 3208 | 901 → 887 | **0,147** → 0,001 | **0,147** → 0,001 |
| wildflower-meadow-vellum | 952 → 992 | 567 → 569 | 0,001 → 0,001 | 0,002 → 0,001 |
| winter-evergreen | 3388 → 3176 | 879 → 881 | 0,003 → 0,003 | 0,003 → 0,003 |

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

### Testler
__TESTLER__

GPT'den görsel gerekmedi; yeni dekor çizilmedi (K21).


## Günlük
- 2026-10-18 claude-G180: ölçüldü (32 demo, önce/sonra), düzeltildi, testler → inceleme
