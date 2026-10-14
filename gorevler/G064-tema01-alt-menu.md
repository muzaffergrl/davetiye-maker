---
id: G064
baslik: Tema 01 alt menüsü — arkadaki yazı harflerin arasından okunmasın (opak + bulanık zemin)
rol: claude-kod
durum: inceleme
alan: wf-g064
oncelik: 1
bagimli: []
yazar: [platform/themes/olive-ivory/site.css, platform/themes/olive-ivory/README.md, platform/scripts/theme-check.cjs, platform/previews/g064/]
---

## Amaç
G059 bulgusu (docs/05 §G): tema 01'in alt menüsü (`.site-nav`) yarı saydam ve bulanıklıksız; sayfa kayarken arkadaki
yazı menü harflerinin arasından okunuyor. 03'teki gibi okunur, sakin bir menü zemini; tasarımın yumuşak geçişi korunur.

## Yapılacaklar
1. `.site-nav` zemini: harflerin arkası opak ya da bulanık olsun (ör. `backdrop-filter` + daha yüksek opaklık); üstteki yumuşak
   geçiş sert bir bulanıklık sınırı çizmesin. Geniş ekranda üstteki menü de aynı denetimden geçsin.
2. 390, 360×640 (kısa), yatay telefon ve 1280 px'te home/story/details/rsvp: menü arkasında metin/foto varken ekran görüntüsü →
   `platform/previews/g064/`. Önce/sonra.
3. `node scripts/theme-check.cjs --theme olive-ivory --stress`, `tests/g051-browser.ts --theme olive-ivory`,
   `tests/final-smoke.ts --theme olive-ivory`, `npm test`, `npm run build` geçmeli.

## Bitti sayılması için
- [x] Menü harflerinin arasından arkadaki yazı okunmuyor (kanıt: önce/sonra görüntüleri)
- [x] Bütün tema kontrolleri geçti

## Sonuç
**Ne değişti** (yalnız `platform/themes/olive-ivory/site.css`, `.site-nav` zemini)
- Eski zemin `0 → .8 (18 px) → .93` saydamdı: harflerin arkasında içeriğin %7–20'si kalıyordu; 390'da "their marriage",
  "SATURDAY", details'te "NAPA, CALIFORNIA · USA" / "The ceremony begins…", RSVP'de form kutusu, yatayda fotoğraflar menü
  harflerinin arasından okunuyordu (`before_*`).
- Yeni zemin: yumuşak üst geçiş korunur (`0 → .4 @8 → .8 @14 px`), altın çizgide `.97`, **24 px'ten aşağısı kâğıdın kendisi (opak
  #EDE4D0)**. `bg_tile` neredeyse düz (kanal başına std ±1,5–2), opak zemin dokuyu bozmuyor; eski .93 da zaten düz görünüyordu.
  Boyalı köşe kümeleri geçişte inceliyor, düz çizgiyle kesilmiyor (story 390, home ilk ekran 390/360: eski/yeni yan yana bakıldı,
  fark yok). Altın çizgi, harf aralıklı serif etiketler, `text-shadow`, dokunma alanları (56/48 px), `safe-area` dolgusu,
  `view-transition-name: site-nav` aynı; nav yüksekliği değişmedi → ilk ekran kuralları (fitNames/fold) etkilenmedi.
- **backdrop-filter kullanılmadı:** opak zeminin altında bulanıklaştırılacak bir şey yok; ayrıca `tests/theme-olive-ivory.test.ts`
  (G401 incelemesi) `.site-nav`'da backdrop-filter'ı yasaklıyor ve `.site-nav` içindeki sözde öğeye konacak bir blur, `view-transition-name`
  /maske nedeniyle (backdrop root) her tarayıcıda çalışacağı doğrulanamazdı. Sert bulanıklık sınırı da böylece yok.
- Geniş ekran: tema 01'de üst menü yok; 1280'de de aynı alt menü — aynı düzeltme geçerli (`*_1280x800`).

**Kanıt** (`platform/previews/g064/`, kendi `next start` + Chromium, demo kaydı + örnek fotoğraflar)
- `before_<sayfa>_<boyut>.png` / `after_<sayfa>_<boyut>.png`: home/story/details/rsvp × 390×844, 360×640, 844×390, 1280×800
  (telefonlar DPR 2), aynı kaydırma konumu (metin/foto nav etiket satırının arkasında; story 390/360'ta foto nav'a inmiyor —
  sayfa kısa — orada buton/dal). `compare_nav.jpg`: 16 durumun nav şeridi, önce | sonra. Sonrakilerin hepsine bakıldı: etiketlerin
  arasından metin/foto okunmuyor; geçişte yalnız çizginin üstünde incelen içerik görünüyor (tasarım bu).

**Kontroller**
- `node scripts/theme-check.cjs --theme olive-ivory --stress` (çıktı geçici klasöre, previews/g401'e yazılmadı): 114 geçti, 0 hata
  (ilk ekran: tasarım aralığı + stres kaydı 360×640, 375×553, 844×390, 667×375 — nav'ın altında yarım parça yok).
- `tests/g051-browser.ts --theme olive-ivory`: 44/44. `tests/final-smoke.ts --theme olive-ivory`: 42/42. İkisi README'deki gibi
  `node` ile koşuldu; `npx tsx tests/g051-browser.ts` `__name is not defined` (tsx dönüşümünün `page.evaluate`'e eklediği yardımcı)
  ile 2 kontrolde düşüyor — CSS ile ilgisiz, araç sorunu.
- `npm test` 299/299, `npm run build` + trace-check geçti.
- origin/main ile birleştirdikten sonra (G061 + G060 geldi) yeniden: `npm run build` geçti, `npm test` 348/348, g051 44/44,
  final-smoke 44/44. **theme-check --stress: 107 geçti, 1 hata — "content change"**: kontrol, yayınlanmış demo sitenin isim ve
  tarihini değiştirip yeniden yayınlıyor; G060'ın düzenleme hakları artık bunu `IdentityMismatchError` ("the draft's names or date
  need a confirmed change before publishing") ile reddediyor (aynı adımlar `lib/sites.ts publishSite` ile ayrıca denendi, aynı hata).
  CSS ile ilgisiz, her temayı etkiler; `scripts/theme-check.cjs` yazma alanımda değil.

**Önerilen görev (entegratör):** `scripts/theme-check.cjs editAndPublish` G060'a uysun — isim/tarih değişikliğinden önce
`grantIdentityChanges` (destek aracı) ya da yeni bir (yayınlanmamış) site; sonra theme-check iki temada yeniden koşulsun.

**Test edilmeyen**
- Gerçek iPhone Safari / Android Chrome (alt araç çubuğu, `safe-area`, kaydırırken görünüm) — yalnız masaüstü Chromium'da
  telefon boyutları. Görünüm geçişi (view transition) sırasında nav'ın görüntüsü kare kare incelenmedi.

**Önerilen (entegratör)**
- `platform/themes/olive-ivory/README.md` "alt gezinme" satırı ("kenarsız yumuşak zemin · opak bant yok") yazma alanımda değil:
  "yumuşak üst geçiş + çizgiden aşağı opak kâğıt (G064)" diye güncellenmeli; test yorumu (`.site-nav: no hard band`) hâlâ doğru.

## Günlük
- 2026-10-14 açıldı (entegratör): G059 bulgusu
- 2026-10-14 alindi: wf-g064
- 2026-10-14 bitti, incelemeye gönderildi
