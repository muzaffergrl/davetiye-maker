---
id: G064
baslik: Tema 01 alt menüsü — arkadaki yazı harflerin arasından okunmasın (opak + bulanık zemin)
rol: claude-kod
durum: bitti
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

### İkinci tur — QA düzeltmeleri (2026-10-14, wf-g064)
QA bulguları (1 orta, 4 düşük) üzerine. Yazma alanı bu turda `platform/scripts/theme-check.cjs` ve tema README'si ile genişletildi
(orta bulgu theme-check'teydi; o yolları alan açık görev yok, `gorev.py kontrol` yeni çakışma göstermiyor).

**Ne değişti**
- **(orta) theme-check 'content change' yeniden yeşil.** `editAndPublish` isim/tarihi artık panelin yolundan değiştiriyor:
  `identityChangeFor(…, {intent: 'change'})` (G060 `/identity` kuralı, yayından sonraki sayılan değişikliklerden biri), kalanı taslağa,
  sonra `publishSite`. Düz taslak düzenlemesi G060'tan beri `IdentityMismatchError` alıyordu. Alt süreç hatalarına (seed, editAndPublish)
  stderr'in son satırları ekleniyor (`run()`); mesaj artık "Command failed: … -e" diye kesilmiyor.
- **(düşük) zarf → home geçişinde nav ilk karede opak:** `::view-transition-new(site-nav):only-child { animation: none; }`. Önceden
  varsayılan .25 s açılışta zarf sayfasının sağ alt buketi etiketlerin arasından görünüyordu (390×844'te 120 ms karesinde etiket
  satırının %10'u, 0 ms'de nav hiç yok). home → story geçişi değişmedi (iki taraf da opak, varsayılan çapraz geçiş).
- **theme-check'e yeni akış** "nav in the envelope → home transition" (390×844, 360×640): `pagereveal` → `ready`'de görünüm geçişi
  animasyonları durdurulur; 0 ve 120 ms'de nav'ın etiket satırı (çizginin 6 px altından aşağısı) yerleşmiş nav ile karşılaştırılır.
  Yalnız etiket satırı opak olan nav'da hata (nav tek başına macenta zeminde = yerleşmiş nav ise opak sayılır); 03 gibi bilerek
  saydam/bulanık nav'da yalnız etiketler ilk karede yoksa uyarı. Ayrım sınandı: eski CSS'in kareleriyle 0 ms %53 / %26, 120 ms %10 / %4
  piksel farkı (eşik %0,5) → hata; yeni CSS'le her karede %0.
- **(düşük, ucuz kısmı) story ‹ 2 / 3 › dokunma alanı:** 390×844 ilk ekranında düğmeler 748–792, nav üstü 769 — kutunun alt 23 px'i nav
  öğesinin altında kalıyor, oraya dokunuş nav'a gidiyordu. `.site-nav { pointer-events: none }` + `ul` ve `.site-nav::before`
  (çizgiden aşağı tam genişlik, `z-index: -1`) `pointer-events: auto`: yumuşak üst geçiş dokunuşu sayfaya geçirir, opak etiket satırı
  her dokunuşu tutar (altında gizli bir şey tıklanmaz). `elementFromPoint` ile doğrulandı (story 390×844, details 360×640 / 844×390).
  Görünüm aynı; glifler zaten çizginin üstündeydi.
- **(düşük) README:** `themes/olive-ivory/README.md` "alt gezinme" satırı güncel zemini anlatıyor (opak kâğıt rengi, görünür bant yok,
  geçiş ve dokunma notu).
- **CSS bütçesi:** `site.css` 45 983 B / 45 KB (46 080 B) — 97 B kaldı (ilk turdan sonra 4 B kalmıştı). Yer açmak için nav yorumları
  kısaltıldı ve degrade aynı renklerle hex yazıldı (`#ede4d0` + alfa 00/66/cc/f7); nav şeridi pikselleri birebir aynı.

**Kanıt** (`platform/previews/g064/`)
- `after_<sayfa>_<boyut>_v2.png` (16): ilk turun kaydırma konumları sayfa döşemelerinden geri bulundu (eski CSS'le yeniden çekilen
  görüntü `before_*` ile birebir: ortalama fark 0–0,4, yalnız hareketli yaprak/sayaç), sonra yeni CSS'le çekildi; konumlar
  `after_positions_v2.json`. Nav şeridi ilk turun `after_*`'ıyla piksel piksel aynı (kalıcı görünüm değişmedi). Hepsine bakıldı:
  etiketlerin arasından metin/foto okunmuyor.
- `vt_compare_390x844.jpg`, `vt_compare_360x640.jpg`: zarf → home geçişi 0 / 120 / 250 ms ve yerleşmiş hâl, önce | sonra.
  844×390'da da ölçüldü (0/60/120/250 ms, etiket satırı farkı %0); görüntüsü klasörde yok.

**Kontroller** (origin/main birleştirildikten sonra, `npm run build` yeniden)
- `node scripts/theme-check.cjs --theme olive-ivory --stress` (çıktı geçici klasöre): **116 geçti, 0 hata, 0 uyarı** (114 + 2 yeni
  geçiş kontrolü; content change dahil sayfa başına içerik-değişikliği kontrolleri yeniden koşuyor).
- `tests/g051-browser.ts --theme olive-ivory`: 44/44 · `tests/final-smoke.ts --theme olive-ivory`: 44/44 (ikisi README'deki gibi
  `node` ile; çıktılar geçici klasöre).
- `npm test`: 412/412 (ilk koşuda `site.css` 45 KB sınırını 682 B aştığı için 1 hata; yorumlar kısaltılıp düzeldi). `npm run build` +
  trace-check geçti.
- theme-check ortak dosya olduğu için 03'te de koşuldu (`--theme blush-garden-rose --stress --no-video`, geçici klasör): 113 geçti,
  0 hata, 2 uyarı — ikisi de yeni geçiş akışından (aşağıda); content change 03'te de yeniden geçiyor.

**Yapılmayan / kapsam dışı**
- Gerçek iPhone Safari / Android Chrome yok (alt araç çubuğu, safe-area, dinamik viewport, gerçek dokunuş); yalnız masaüstü
  Chromium'da telefon boyutları. Görünüm geçişi yalnız Chromium'da (cross-document view transition) ölçüldü.
- **QA 3 (yatay/kısa ekranda ilk ekranın son satırının çizgide yarım kalması) yapılmadı:** 844×390'da details "Order of the Day"
  (295–360, nav üstü 323) ve story giriş cümlesi, 667×375'te rsvp "Will You Join Us?", 1280×800'de story foto yazıları nav çizgisini
  kesiyor (ölçüm: sayfaların ilk ekranı, demo kaydı). Home dışında `fold` kuralı yok; sayfa kaydığı için bir satırın çizgiye denk gelmesi
  olağan, düzeltme içerik uzunluğuna bağlı ve G064 dışı. **Önerilen görev (entegratör):** ya docs/11'e "home dışındaki sayfalarda ilk
  ekranın son satırı yumuşak geçişte kesilebilir" diye kabul yazılsın, ya da `min-aspect-ratio:1/1 and max-height:620px` sorgusunda
  `.page-head/.details-top/.rsvp-top` üst boşluğu (şimdi ≥ 768 px genişlikte 140–150 px, 390 px yükseklikte çok) kısalsın + theme-check'e
  sayfa başına "nav çizgisinde yarım metin satırı" uyarısı eklensin.
- **Önerilen (entegratör):** docs/11 §13 akış listesine yeni theme-check akışı ("nav in the envelope → home transition") eklensin;
  03'ün (ve G402/G405 temalarının) nav'ı için aynı `only-child` kuralı düşünülsün (03'te yeni akış uyarı veriyor: 390×844 / 360×640'ta nav saydam+bulanık, etiketler ilk karede yok — %78 / %99 etiket pikseli farklı,
  .25 s'de beliriyor; 03'ün `site.css`'ine dokunulmadı).

## Günlük
- 2026-10-14 açıldı (entegratör): G059 bulgusu
- 2026-10-14 alindi: wf-g064
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 QA ikinci tur (wf-g064): content change (G060 /identity yolu) + stderr, geçişte opak nav + theme-check akışı, nav dokunma alanı, README; yazar: theme-check.cjs ve tema README eklendi
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör onayladı
