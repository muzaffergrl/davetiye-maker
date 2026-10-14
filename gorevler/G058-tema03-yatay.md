---
id: G058
baslik: 03 blush-garden-rose — yatay telefon düzeni ve isim aralığı kaydıyla ilk ekran (01'deki kurala eşit)
rol: claude-kod
durum: bitti
alan: claude-kod-13
oncelik: 2
bagimli: [G401]
yazar: [platform/themes/blush-garden-rose/, platform/tests/theme-blush-garden-rose.test.ts]
---

## Amaç
01'in QA'sında çıkan kurallar 03'te de geçerli: yatay telefonda (844×390, 667×375) hero nav'ın altına giriyor (G401 fix2 ölçümü);
ilk ekranda hiçbir öğe nav'ın altında yarım kalmamalı; isimler ≥ 36 px tabanı.

## Yapılacaklar
1. 03 için yatay kısa ekran düzeni (01'deki `@media (min-aspect-ratio: 1/1) and (max-height: 620px)` yaklaşımı), zarf sayfası dahil.
2. `theme-check --theme blush-garden-rose --stress` yatay + aralık kaydı akışlarıyla hatasız.

## Sonuç
**Yapıldı (claude-kod-13, 2026-10-14).** Yerelde çalışan ve test edilen tema değişikliği; **hiçbir yere yayınlanmadı**. Çizim yok,
yeni GPT parçası yok (K21): yalnız yerleşim, boyut, JS ölçümü; 03'ün kendi parçaları (kart, zarf katmanları, köşe çiçekleri).
Ayrıntı ve ölçü tablosu: `platform/themes/blush-garden-rose/README.md` → "Yatay telefon ve ilk ekran (G058)".

**Önce (kendi `next start` + Chromium ölçümüm, DPR 2):** home yatayda dikey düzenle açılıyordu — 844×390'da isimler 92 px, kart
ve isimler sığıyor, tarih/yer/sayaç `foldHero` ile ilk ekranın altına itiliyordu; 568×320'de isimlerin kendisi nav'ın altında
yarım (160–267 / nav 256); tasarım aralığında (`rangeRecord`) 844×390, 932×430, 667×375, 740×360, 915×412'de "Maximilian James"
satırı nav'ın altında yarım (ör. 844×390: 293–408 / nav 326). Zarf sayfası: "Tap to open" 740×360 (336–366) ve 568×320'de
(318–348) ekran dışı; açık hâlde "Replay the opening" her yatay boyutta ekran dışı (844×390: 405–450). Tasarım aralığında yatay
zarf başlığı köşe çiçeklerinin üstündeydi. 320×568 tasarım aralığında "James"in kuyruğu nav'a değiyordu (mürekkep altı 505, nav
üstü 504; `h1` kutusu 503'te bitiyor, satır içi kutusu 506'da; theme-check 320×568'i ölçmüyor).

**Değişiklikler** (`platform/themes/blush-garden-rose/`):
- `site.css` — kısa yatay blok (`@media (min-aspect-ratio: 1/1) and (max-height: 620px) and (max-width: 959px)`; 01'in
  yaklaşımı, nav altta olan genişlikler; ≥ 960 px üst nav düzeni değişmedi): nav 48 px + `safe-area` payı; **home** ızgara (kart
  solda, ilk ekran yüksekliğinde 150–250 px, üstten; isimler `clamp(36px, 13svh, 64px)` · tarih · mekân · sayaç sağ sütunda,
  dengeli sarar); köşe çiçekleri yüksekliğe göre, home'da alt sağ çiçek gizli (sayaca biniyordu); **zarf**: isimler yüksekliğe
  göre, isim sütunu çiçeklerin arasında, zarf genişliği = kapalı zarf + ipucu ekranda / açılışta yükselen kart (`out`) ekranda /
  460 px'in en küçüğü; açık hâl yan yana (zarf + kart ekran boyunda, "Enter" / "Replay" sağında, başlık ölçülebilir kalır).
  `.hero .names` boyutu `* var(--fit, 1)`. Bütçe için uzun yorumlar kısaltıldı: `site.css` 45 902 B (≤ 46 080).
- `site.js foldHero` — isimlerin satır içi kutuları (yazı kuyrukları dahil) nav'ın 8 px üstünde bitmezse isimler `--fit` ile
  küçülür, **36 px'ten aşağı inmez** (`NAMES_MIN`); sonra eski katlama. Demo kaydında hiçbir boyutta devreye girmez. `site.js`
  34 756 B (≤ 35 840).
- `home.html` — hero köşe çiçeklerine `width`/`height` (lazy görsel 0 px yüksekti, kırpan kutunun üstünde kalınca hiç
  yüklenmiyordu: yatayda bazen görünüp bazen görünmüyordu); hero kartı/foto `sizes` yatay kart boyunu biliyor.
- `img/manifest.json` + `build_images.py` — `theme_check.first_screen = {landscape: true, names_min_px: 36}`: `theme-check`
  artık 03'ü de 844×390 / 667×375'te home ilk ekran kuralına (demo, tasarım aralığı, stres) ve yatay zarf denetimine tabi tutar.
  `python3 tools/tests/test_tema_build.py` (tam): 03 yeniden üretimi 53 dosya bayt bayt aynı (manifest dahil), klasör 2,92 MB.
- `README.md` — yeni "Yatay telefon ve ilk ekran (G058)" bölümü; "Bilinen sınırlar" güncellendi (yatay düzen yok / James 2 px
  cümleleri kalktı).
- `platform/tests/theme-blush-garden-rose.test.ts` — yeni "G058 short landscape phones" testi (manifest bayrağı = build, kısa
  yatay blok kuralları, K21: blokta border/gölge/gradyan/url yok, `NAMES_MIN` = 36, çiçek boyutları, `sizes`, CSS/JS bütçesi);
  G401 testi `foldHero`'nun yalnız `--fit` ve `margin-top` yazdığını denetliyor.

**Sonra (aynı ölçüm; nav üstü · hero sonu):** demo 844×390 342 · 325, 932×430 382 · 364, 915×412 364 · 346, 667×375 327 · 310,
740×360 312 · 295, 568×320 272 · 256 — isimler 41,6–55,9 px, kart 154–222 px, hiçbir parça katlanmıyor. Tasarım aralığı: aynı
boyutlarda isimler 2 satır, hepsi nav'ın üstünde; yalnız 568×320'de sayaç ilk ekranın altından (332 ≥ 320). Stres: isimler ilk
ekranda, sonrası aşağıda; yarım parça yok. 320×568 tasarım aralığı: isimler 49,8 px × 3 satır, mürekkep altı 447 (nav 504), tarih
ilk ekranda 450–467, yer ve sayaç 579'dan. Zarf (demo): "Tap to open" 844×390 331–362, 740×360 307–337, 568×320 274–305;
açılışta kart en üstte 19–29 px'te (6 yatay boyut, kare kare), açık hâlde "Replay" her yatay boyutta ekranda. **Dikey:** 390×844,
320×568, 360×640, 375×553, 375×667, 390×690, 412×915, 430×932'de demo home ve zarf sayfası kutu kutu aynı (önce/sonra karşılaştırma);
tasarım aralığında yalnız 320×568 home değişti; stres kaydında isimler artık nav'ın altına uzanmıyor (390×844: 58,5 px × 8 →
50,5 px × 6 satır, mürekkep 715 / nav 780).

**Komutlar:** `npm test` **297/297**, typecheck temiz, `npm run build` + trace-check temiz; `theme-check --theme blush-garden-rose
--stress` **114/114, 0 uyarı** (önce 97: yeni yatay home ilk ekran + zarf denetimleri; MP4 dahil, çıktı scratchpad'e; ilk koşuda
"short phones" akışı `Target crashed` ile düştü — tarayıcı çökmesi, yeniden koşuda 114/114; aynı akışlar ayrıca yerel kopyada 6
yatay + 5 dikey boyutta geçti); zarf → home 4344 ms; ilk görünüm index 1033 / home 722 KB (yer tutucu), 1103 / 900 KB (fotoğraflı);
`g051-browser --theme blush-garden-rose` 44/44; `final-smoke --theme blush-garden-rose` 42/42; `tools/tests/test_tema_build.py` tam
geçti (03 bayt bayt).

**Görüntüler** (oturumun scratchpad'inde, repoya girmedi; `previews/g038` dokunulmadı): `…/scratchpad/g058/before/` ve `after/`
(demo / tasarım aralığı / stres × home, zarf kapalı, zarf açık; 844×390, 932×430, 667×375, 740×360, 568×320, 390×844, 320×568),
`compare/*.jpg` (önce | sonra yan yana), `anim/open_<boyut>_*.png` (yatay açılış kareleri + home'a varış).

**Denenmedi:** gerçek iPhone/Safari (yatay araç çubukları, çentik `safe-area`, `svh`) ve Android Chrome — yalnız Chromium
emülasyonu; yavaş ağ; gerçek alıcı fotoğrafları; yayın (bu görevin işi değil). theme-check'in yatay boyutları 844×390 ve 667×375;
932×430, 915×412, 740×360, 568×320 ve 320×568 kendi ölçüm betiğimle + theme-check'in aynı akışlarının yerel kopyasıyla (ek
boyutlar) denendi — repo'daki theme-check değişmedi.

**Önerilen (entegratör):** `scripts/theme-check.cjs` "home first screen" / "short phones" akışlarına 568×320, 740×360, 932×430 ve
320×568 eklemek (G058'deki 2 px yalnız 320×568'de vardı). docs/11 §13.3'e `first_screen.landscape` bayrağı ve yatay akış hâlâ yazılmadı (G401 Sonuç'taki not).

## Günlük
- 2026-10-14 alindi: claude-kod-13
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör onayladı
