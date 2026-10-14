# Tema: dusty-blue-champagne (tasarım 02 · Dusty Blue & Champagne, G402)

Tozlu mavi bokeh kâğıt üstünde fildişi zarf: şampanya-altın kenarlı V kapak, kapağın ucunda okaliptüs dallı tozlu mavi mum
mühür; köşelerde krem güller + okaliptüs + gelin duvağı + altın eğrelti kümeleri; Pinyon Script (isimler, başlıklar) +
Cormorant Garamond (aralıklı büyük harf satırları, italik mekân). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform
sözleşmesi `platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından
(`collections/02_Dusty_Blue/assets/gpt/comps/web_1..5`, yalnız sade adlar); **bütün görseller bu tasarımın GPT parçaları**
(K21: kodda şekil/dekor çizilmez). 01 (olive-ivory) ve 03 (blush-garden-rose) temalarından yalnız platform sözleşmesi ve
çözülmüş sorunlar alındı (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`,
`fitNames` + `fold` ilk ekran kuralı, `fitCopy`, kısa yatay düzen, `devRender` yedeği); görünüm, aralıklar, süs konumları,
zamanlama, kart oranları ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Dusty Blue & Champagne", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`) |
| `content.demo.json` | `collections/02_Dusty_Blue/content.demo.json`'ın birebir kopyası (Eleanor & Theo; `/start?theme=dusty-blue-champagne` ve tema demosu bunu kullanır; servis edilmez) |
| `index.html` | kapalı zarf → dokun → mühür kopup düşer, V kapak yukarı açılır (altın damask astar), kart ön cebin arkasından yükselir, tek okaliptüs yaprağı süzülür, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: anlık baskı kartı + foto, isimler, gün · tarih, mekân, şehir, geri sayım, RSVP hapı), çiçekli davet kartı (isimler güllerin arasındaki düz kâğıtta) + ev sahibi satırı + tarih satırı + mekân + takvime ekle, üç bölüm (story baskısı · günün kartı · mühür + "Kindly reply by"), kapanış |
| `story.html` | W1.3: "Our Story" + "MOMENTS WE HOLD DEAR" + giriş cümlesi; üç anlık baskı sırayla uçup hafif açılarla oturur, başlıkları baskının alt kenar boşluğunda |
| `details.html` | W1.4: Order of the Day kartı (info_card, 3 dilim; gün · tarih başlığı kartın içinde, program satırları + aralarında GPT dal), mekân (yatay baskı, kartın altına eğik), dress code, takvime ekle, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim) + kartın alt kenarına basılmış mühür, platform yanıt formu (G042 + G051 soruları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`fly-l/fly-r/fly-b` + `--settle` bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri, kısa yatay düzen |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim + home ilk ekranı (`fitNames` + `fold`), kart kopyası (`fitCopy`), davet kartı (`fitInvite`), tarih satırı (`stack`), geri sayım, zarf, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri ve temizliği |
| `img/` | WebP katmanlar, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 533/533 | card_small'ın kare penceresi (index kartı = home hero kartı: bir anlık baskı) |
| `story_1..3` | `media.memory_photos.0..2` | 657/749 | frame_portrait (story; `story_1` home'daki story bölümünde de) |
| `venue` | `media.venue_image` | 794/458 | frame_landscape (details) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (köşe GPT penceresinden; CSS `border-radius` yok).
"Your photo here" yalnız önizlemede (`html[data-preview="true"]`); misafir yalnız nötr yer tutucuyu görür: `bg_page`'in
çiçeksiz bokehli bölgelerinden bulanık + fildişine tonlanmış kırpım. `build_images.py` her yer tutucunun en koyu pikselini
ölçer (`manifest.ph_*.min_lum`: 224 · 223 · 219 · 217 · 196; < 175 → çıkış ≠ 0): kümeden yaprak/gül kırpıma girmez, leke yok.
Alt metinler içerikten.

## Görseller (`python3 platform/themes/dusty-blue-champagne/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre** (alfa kırpma, #00FF00 pencereleri + GPT bulut lekesi şeffaf, `windows.json`).
- **GPT kusurları temizliği (çizim yok, `manifest.cleanup`):** (1) her şeffaf parçada geniş yarı saydam beyaz/sıcak hâle
  (zarfta ~90 px, kartlarda ~140 px uzanan alfa < 64 sis) ve suluboya kümelerinin dış hattında sarı/kırmızı/camgöbeği renk
  saçağı → alfa tabanı (12–20; kümeler 16) + çekirdeğe uzaklık (sert parça 1 px, suluboya 3 px) + kenar rengini komşu opak
  renge çekme; (2) `divider`'da eğreltinin çevresinde sıcak turuncu, yaprakların çevresinde yeşilimsi ışıma (alfa 64–200'e
  kadar) → sert taban 110 / çekirdek 200; (3) pencerelerin çevresinde parts_prep ayrıştırma saçağı (card_small 6 386 px,
  frame_portrait 8 424, frame_landscape 7 861) halkanın dışındaki çerçeve renginden yeniden boyanır; (4) Pillow'un önçarpımlı
  küçültmesi şeffaf pikselleri siyaha çekiyor, kayıplı WebP bunu kenara karıştırıp koyu saçak yapıyordu → kaydetmeden önce
  şeffaf piksellere komşu renk taşınır (`renk_tasir`). Denetim: görünür yeşil 0 px, pencereler tam şeffaf.
- **Karo zemin (`bg_tile`):** GPT karosu tam dikişsiz değildi (640 px döşemede 1 px dikey ek izi). 3×3 mozaik → 1920 →
  ortadan 640 kırpım + yarım kaydırma harmanı (`dikissiz`, bant %28): ek izi yok.
- **Telefon zemini:** `bg_page` telefonda (en/boy ≈ 0,46) her yandan kırpılıyor, iki köşe kümesi de kesiliyordu. Telefonda
  `bg_page`'in çiçeksiz bokehli orta-sol bandı (kaynak x 168–568, y 420–1290; dolu piksel payı 0) `paper-400` kâğıt +
  `florals_tl` / `florals_br` ayrı katman, ikisi de ekranda tam.
- **Kapak kesimi** (`env_cflap`, `method: "renk"`): `tema_build.kapak_kes("v")` V doğrularını doğru buluyor ama en güçlü
  parlaklık düşüşü kâğıt → altın çizgi geçişi olduğundan kesim altın çizginin **üstünden** geçiyordu (altın kenar gövdede
  kalıyordu). Burada her sütunda V bandında üstten ilk altın koşusu (R − B > 60, R > 100, B < 0,45 R; ≤ 2 px boşluk) aranır,
  kenar = koşunun son satırı + 3 satır (açık kâğıt dudağı). Temas gölgesinin sıcak tonu doygunluk ölçütüyle (B < 0,45 R)
  dışarıda kalır. Süreklilik: en büyük komşu sıçraması 2 px, doldurulan sütun 0 (sınır 6 px / %6, aşılırsa çıkış ≠ 0).
- **Ön cep** (`env_pocket`): açık zarfın önü sivri V değil, iki yan kanadın çaprazı + alt kanadın yatık V'si (M benzeri dört
  doğru); `cep_kes("v")` yan kanatların üstünde astar şeridi bırakıyordu. Kesim her sütunda cebin fildişi kâğıdından
  (lum ≥ 200, B − R ≤ 6) yukarı ilk kalıcı astar satırı; kenar profiline 9 sütunluk kapanış süzgeci (astardaki fildişi
  çiçeklerin kıymıkları silinir).
- **Menteşe hizası** (`manifest.stage.hinge_align`): `kit_check` kenarları (sol −0,20 · sağ +0,29 · alt +0,07 %) geçiyor,
  ama GPT açık zarfın menteşesini (açık kapağın altın kenarının gövde köşelerinde bittiği satır, 702) kapalı zarfın üst
  kenarından (725) yukarıda çizdi; açık katmanlar alt kenara göre dikeyde × 0,959 ölçeklendi → 90°'de kapak aynı menteşe
  çizgisinde el değiştirir. Açık katmanlar ↔ kaynak alfa farkı 0,005; kapak kapalı zarfın dışına 0 px taşar.
- **Kapanış** (`closure.png` = mavi mum mühür + okaliptüs dalı, tek parça): yeri kesim geometrisine bağlı — çapa = V
  kapağın ucu (altın kenarın en alt noktası); W1.1 comp'ta ölçülen mum çapı / zarf genişliği (0,233) ve mum merkezinin uca
  göre yüksekliği (−0,076 × zarf genişliği) uygulanır. Monogram (`initials`) mührün ince gümüş halkasının boş basılı
  merkezinde (`.seal-mono`, halka görüntüden ölçülür). Mühür kapakla **taşınmaz** (`carried_by_flap: false`).
  Gözle karşılaştırma: `platform/previews/g402/compare_closure.jpg`.
- Kartlar: `free_zone` + 3 dilim sınırları (`slices`: yalnız tam genişlikte düz kâğıt satırları gerilir — davet kartında
  %39–60, info kartında %20–93). og: `web_hero` alt hizalı 1.91:1; favicon: closure. Tema klasörü ≈ 1,9 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış (katalog cümlesi):** dokununca tozlu mavi mum mühür **kopar** (ilk hareket 0 ms: küçük sıçrayış + dönüş, 230 ms) ve
  dönerek, yerçekimiyle hızlanarak ekranın altından **düşüp gider** (1 020 ms); başlık ve isimler yukarı çekilir; V kapak
  menteşesinde yukarı açılır (520 ms'de, 0 → 90°, yumuşak başlangıç, 80°'den sonra söner — kenardan ince şerit görünmez), 90°'de
  kapalı gövde açık gövdeye (altın damask astar + ön cep) geçer, açık kapak −90°'den yatar; kart **ön cebin arkasından**
  yükselir (1 820 ms'den, 1 420 ms) — bu sırada **tek okaliptüs yaprağı** (accent_1 × 1, `fall`) kartın yanındaki şeritten
  süzülür (kartın fotoğrafının üstünden geçmez: `avoid: '.env .card'`; `go`dan önce ekrandan çıkar). Kart alt köşeleri cebin
  kenarını aştıktan sonra (`out` −92 %) olduğu yerde öne gelir (`front` −89 % × 1,04) ve view transition ile home hero kartına
  uçar (yukarı–aşağı–yukarı yok). Dokun → home 4,2 s (`go`; theme-check ölçümü sayfa geçişiyle 4,5 s; Skip her an); `arriveDelay` 0: home'da isimler kart inerken yazılır,
  uzun boş bekleme yok. "Replay"de kapalı zarfın üstünde kırpılmamış kart uçuşmaz; `?replay=1` `<head>` betiğinde de kapalı.
- **Story:** üç anlık baskı **sırayla** (her baskı kendi `data-scene`'i, `batchGap` 420 ms) yandan/alttan uçar, döner ve hafif
  taşmalı (`--settle`) −4,5° / +4° / −2,5° açılarla oturur; başlık baskının alt kenar boşluğuna 1,05 s sonra yazılır. Baskılar
  yalnız beyaz kenarlarından üst üste biner (fotoğraf pencereleri birbirini örtmez). Telefonda baskı 66vw, foto penceresi
  66 × 0,755 = **50vw** (≥ 38vw); ≥ 760 px'te comp dizilişi (iki üstte, biri altta ortada). Yana kaydırma yok (ipucu gerekmez).
- **Parçacıklar:** açılış 1 okaliptüs yaprağı · home'a varış 2 küçük beyaz çiçek (accent_2; hero fotoğrafının iki yanındaki
  şeritlerden, fotoğrafın/yüzlerin üstünden asla: `avoid: '.hero [data-slot]'`) · RSVP kapanışı 2 çiçek + 1 yaprak.
- Hareket azaltma (`prefers-reduced-motion`): açılış atlanır, girişler hareketsiz.

## Home ilk ekranı (hero) ve yatay telefon
01'in qa derslerinin aynısı (`fitNames` + `fold`, `img/manifest.json theme_check.first_screen` = `{landscape: true,
names_min_px: 36}`):
- **Adımlar** (ilk ekran nav'ın 8 px üstünde bitene kadar; ölçüm `offsetTop` ile, giriş dönüşümleri sayılmaz): (1) isimler
  en çok %24 küçülür, (2) `.is-tight` + isimler **36 px tabanına** kadar, (3) `.is-long`: sayaç hapın altına geçer, (4) yine
  sığmazsa hero kaydırılır. Sonra nav'ın 8 px üstünde bitmeyen ilk parça ilk ekranın **altından** başlar (`fold`; nav'ın altında
  yarım parça yok).
- **Kısa yatay** (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px): hero ızgara (kart solda, metin sağda); zarf sayfası yatayda
  isimler + ipucu solda, zarf sağda. W1'de yatay comp yok; comp'un öğeleri ve sırasıyla kurulur (ek düzen, sapma değil).
- **Kart kopyası (`fitCopy`):** yazı ≥ 11 px kalır; sığmazsa satır düşer (hepsi → dar tarih [italik, aralıksız] → şehir yok →
  yalnız tarih → hiçbiri), boyut değişince yeniden (`ResizeObserver`).
- **Tarih satırı (`stack`):** "Saturday · September 18, 2027" dar ekranda (320 px) iki satıra kırılırsa nokta satır sonunda
  asılı kalmaz: nokta gizlenir, gün kendi satırına geçer (hero, details kartı, dress code).
- **Zarf sayfası (`fitEnv`):** isimler ≥ 36 px (tavan `--nm`, en çok ekranın %22'si); uzun isim + kısa ekranda "Tap to open"
  ekranda kalana kadar zarf küçülür (`--env-fit`, en az %72). Yatayda isimler + ipucu solda, zarf sağda.
- **Ölçüm** (kendi `next start` + Chromium, `measure` betiği, katman kutuları; 3 kayıt × 10 boyut: 320×568, 360×640, 375×553,
  375×667, 390×844 dikey · 568×320, 667×375, 740×360, 844×390, 932×430 yatay): **hiçbir boyutta nav'ın altında yarım kalan
  hero parçası yok**, yatay kaydırma yok, zarf ve "Tap to open" her boyutta ekranda.
  - Demo (Eleanor & Theo): hap altı / nav üstü — 320×568 486/498 · 360×640 522/570 · 375×553 468/483 · 375×667 541/597 ·
    390×844 706/774 · 568×320 243/258 · 667×375 276/313 · 740×360 266/298 · 844×390 286/328 · 932×430 314/368; isimler
    38,0–56,5 px (hiçbir boyutta tabana inmez); hero kartı ≥ 155 px. Zarf sayfasında isimler 41,6–58,5 px.
  - Tasarım aralığı (`rangeRecord`: "Alexandrina Rose" / "Maximilian James", uzun mekân, en-GB): 320×568, 375×553, 568×320'de
    `.is-long` + `fold` (hap ilk ekranda, sayaç ilk ekranın altından: 375×553'te ilk ekran 471'de biter, hero 565'ten sürer);
    öteki boyutlarda hepsi nav'ın üstünde; isimler 36,3–47,3 px. Zarf sayfasında isimler 36 px, ipucu ekranda.
  - §12 stres kaydı (40 karakter isimler, 80 karakter mekân): isimler her boyutta 36 px (932×430'da 38,8); 360×640, 740×360,
    844×390'da `.is-long` + `fold`, 375×667 · 390×844 · 932×430'da `.is-tight`; 320×568, 375×553, 568×320, 667×375'te hero
    kaydırılır (§12 kaydı için izinli) ve sığmayan ilk parça ilk ekranın altından başlar. Zarf sayfasında zarf küçülür, ipucu
    ekranda (375×553: zarf 100–493, ipucu 530).
  - `theme-check --stress` aynı kuralı 360×640, 375×553, 844×390, 667×375'te üç kayıtla denetler (geçti).

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| köşe kümeleri (sol üst, sağ alt), bokeh | telefon: `paper-400` (bg_page'in çiçeksiz bandı) + `florals_tl` / `florals_br` ayrı katman, ikisi de tam; geniş ekranda `mist` + aynı kümeler | |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (kaligrafi) | `h1.names` | uzun isimde `site.js` küçültür (≥ 36 px), gerekirse zarf küçülür (`fitEnv`) |
| fildişi zarf, altın kenarlı V kapak | `.env-closed` + `.env-cflap` | |
| mavi mum mühür + okaliptüs, V'nin ucunda | `.closure` (kapaktan **ayrı** katman: kopup düşer) | boş basılı merkezde monogram (`initials`) — comp'ta boş |
| "TAP TO OPEN" | `.env-hint` | |
| yüzen okaliptüs yaprakları, küçük çiçekler | `.float` (accent_1/2/3, telefonda statik, yavaş "nefes") | ayrıca açılışta 1 yaprak parçacığı |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| anlık baskı kartı + foto, "We're getting married", "SEPTEMBER 18, 2027 · CHARLESTON" | `.hero-card` (card_small + `hero_portrait`) | tarih ve şehir iki satır (comp'taki tek satır 390 px'te noktayla sarkıyordu) |
| isimler | `h1.names` | ≥ 36 px |
| "SATURDAY · SEPTEMBER 18, 2027" | `.hero-date` | dar ekranda iki satır, nokta gizli |
| mekân (italik), şehir + eyalet | `.hero-venue`, `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7); < 380 px'te iki nokta ayıracı gizli |
| tozlu mavi RSVP hapı | `.hero-cta .btn` | hap düğme (arayüz) |
| alt gezinme "HOME · STORY · DETAILS · RSVP" iki altın kıl çizgi arasında | `.site-nav` | 1 px ayraçlar (arayüz) |
| — (comp yok) | çiçekli davet kartı (`invitation_card` 3 dilim; isimler güllerin arasındaki düz kâğıtta, `fitInvite`) + "Together with their families", davet cümlesi, tarih satırı, dal, mekân, takvime ekle; üç bölüm (story_1 baskısı · günün kartı ilk 4 satır · mühür + tek "Kindly reply by"); kapanış ("With love," + isimler + "Open the envelope again") | bu tasarımın parçaları ve dili. **Not:** ev sahibi satırı kartın altında (kartın düz kâğıdı yalnız isimlere yetiyor; uzun ev sahibi satırı güllere değerdi) |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| iki üstte bir altta üç anlık baskı (köşesinde okaliptüs dalı), aralarında küçük çiçek kümeleri | `.prints` ≥ 760 px: aynı düzen (265 px baskılar); dal çerçevenin kendi parçası (frame_portrait) | baskıların arasındaki küçük çiçek kümeleri yok (ayrı GPT parçası yok; çizilmez) |
| | telefon: basamaklı sütun (sol −4,5°, sağ +4°, sol −2,5°; baskılar yalnız beyaz kenarlarından biner) | **sapma:** comp'un yan yana baskısı 390 px'te pencereyi ~120 px yapardı (< 38vw, §9); telefonda pencere 50vw |
| başlık baskının alt kenar boşluğunda (el yazısı) | `figcaption .cap` (`frame_portrait.caption_band_pct` %81,8–97,8) | uzun başlık küçülür (≥ 11 px), yine sığmazsa satır kısalır |
| köşe kümeleri | `.page-corner` florals_tl (başlık), florals_br (sayfa sonu) | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Order of the Day" kartı, üst ortada dal | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar/kısalır (1–10 satır) |
| — | `.page-kicker` gün · tarih | **sapma:** standart zorunlu başlık tarihi; comp'ta yok, kartın içinde başlığın altına kondu |
| saat · ETKİNLİK / yer (italik) | `.sched-row` | |
| satır arası küçük dal | `::before` GPT `divider` | |
| mekân fotoğrafı yatay baskıda, kartın altına eğik | `.venue-print` (frame_landscape + `venue`) | |
| mekân (italik), şehir | `.venue-name`, `.venue-city` (+ ülke, adres, tören cümlesi) | |
| "DRESS CODE · Black tie optional" | `.dress` | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| kart + üstte dal | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?" | `h1.card-title` | |
| "KINDLY REPLY BY", tarih | `.reply-by`, `.deadline` | `data-if="rsvp.deadline"` |
| RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU" | `.wait` | |
| "With love," + isimler | `.love`, `.sign` | uzun isimde sarar/küçülür |
| alt kenara basılı mühür + okaliptüs | `.card-seal` (closure) + monogram | |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Bilinen sınırlar
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim). Home'daki günün kartı ilk 4 satırı gösterir.
- Details tören cümlesi yalnız saati söyler ("The ceremony begins at 4:30 PM.").
- Genişlik sapmaları (docs/11 §5.1): `env_*-857` (kaynak 857 px; 880 istenen), `card_small-638`, `info_card-787`,
  `florals_br-875` (kaynak bu kadar), `closure-320/640`, `accent_1-149` (yaprak dik: 200 px yükseklik sınırında 149 px).
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez. Monogram (`initials`) mühürde gösterilir.
- Link blokları yalnız linkleriyle; `rsvp.method` dolu → RSVP sayfası 404, ona giden her link kalkar.
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz (docs/11 §3.1).
- Kontrast (oluşan sayfada metnin arkasındaki piksellerin medyanı, metin saydam yapılıp ölçüldü; 390×844 tüm sayfalar,
  360×640 ve 844×390 home ilk ekranı, 844×390 zarf, 1280 home/rsvp, stres kaydı): küçük metin en düşük **4,60:1** (stres
  kaydı home; demo kaydında 4,81: home, nav; details/rsvp 4,84), büyük metin (≥ 24 px) en düşük 4,27:1 (≥ 3 gerekir). Davet kartı / gün kartı / RSVP kartındaki
  altın el yazısı `--gold-card` #85642F (fildişi kâğıtta 4,76:1; ilk ölçümde #8A6831 stres kaydının 22,9 px kart isimlerinde
  4,48'di). Mühürdeki monogram (zarf, home bölümü, RSVP kartı) bilerek kabartma tonunda (`--seal-ink` #EEF2F6 mavi mumda ≈ 3,6:1)
  ve süs: yardımcı teknolojiden gizli (`aria-hidden`), isimler sayfada metin olarak var.
- Yazı tabanı: görünen her metin ≥ 11 px (kart kopyası `fitCopy`, baskı başlıkları `fitLines` — tabanlar yukarı yuvarlanır,
  10,99 px olmaz); mühür monogramı `max(11px, 12.5cqw)`. Android'de dokunma dikdörtgeni yok (`-webkit-tap-highlight-color`).
- Köşe kümeleri hiçbir yerde düz çizgiyle kesilmez: sayfa sonu bölümleri sayfanın altına kadar iner (küme nav'ın altında sayfa
  kenarında biter); üst köşeler ekran kenarında kırpılır (`overflow-x: clip`), geniş RSVP'de (≥ 960 px) sayfanın kenarında.
- Açılış giriş durumları ekran dışına taşmaz: home bölümlerindeki baskı/kart yukarı doğru dönerek oturur (`fly-up-l/r`), yalnız
  story baskıları ve mekân baskısı yandan uçar (bölüm `overflow-x: clip`).
- `theme-check` "content change" adımı bu temada 3 **yanlış alarm** verir: denetimin değişiklik yaması 2. ismi "Theo" yapıyor
  (01/03 demolarına göre yazılmış), bu demonun 2. ismi de "Theo" → "old content still visible ("Theo")". Aynı değişiklik
  "Jonah" ile kendi koşumda denendi: beş sayfada eski demo sözcüğü (Eleanor, Theo, Rosewood, Charleston, E&T) yok.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (Safari'nin yatay araç çubukları, `svh`, `mask`, `ResizeObserver`,
  `overflow: clip`), Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
