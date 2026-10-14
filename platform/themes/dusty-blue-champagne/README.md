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
| `index.html` | kapalı zarf → dokun → mühür kopup düşer, V kapak yukarı açılır (altın damask astar), kart ön cebin arkasından yükselir, tek okaliptüs yaprağı süzülür, kart belirgin biçimde öne gelir → home (view transition) |
| `home.html` | hero (W1.2 oranları: küçük, hafif eğik anlık baskı kartı + foto, büyük isimler, gün · tarih, mekân, şehir, geri sayım, RSVP hapı; ≥ 1024 px iki sütun), davet seti (ev sahibi satırı → çiçekli davet kartı, isimler güllerin arasındaki düz kâğıtta → altına sıkıştırılmış düz info_card üstünde davet cümlesi, tarih bloğu, saat, dal, mekân) + takvime ekle, üç bölüm (story baskısı · günün kartı · mühür + "Kindly reply by"), kapanış |
| `story.html` | W1.3: "Our Story" + "MOMENTS WE HOLD DEAR" + giriş cümlesi; üç anlık baskı sırayla uçup hafif açılarla oturur (2. baskının çerçevesi aynalı: dalı sağ üstte), başlıkları baskının alt kenar boşluğunda |
| `details.html` | W1.4: Order of the Day kartı (info_card, 3 dilim; gün · tarih başlığı kartın içinde, program satırları + aralarında GPT dal), mekân (yatay baskı, kartın altına eğik), dress code, takvime ekle, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim) + kartın alt kenarına basılmış mühür, platform yanıt formu (G042 + G051 soruları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`fly-l/fly-r/fly-b` + `--settle` bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri, kısa yatay düzen |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim + home ilk ekranı (`fitNames` + `fold`), iç sayfaların ilk ekranı (`foldAll`, `[data-fold]`), RSVP kartı + mühür ilk ekranda (`fitCard`), hero yazısı süsün üstünde değil (`decor`), kart kopyası (`fitCopy`), davet kartı (`fitInvite`), tarih satırı (`stack`), geri sayım, zarf, `DEV_CONTENT` + `devRender` |
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
- **Geniş / yatay ekran zemini (G402 incelemesi):** 400 px'lik dikey kırpım 1280 × 800'de × 3,2 gerilip dokusuz düz bir
  dolguya dönüyordu. ≥ 700 px ya da yatay ekranda `<picture>` `paper_wide-755` (bg_page'in en geniş çiçeksiz yatay bandı,
  kaynak x 116–871, y 600–1100; dolu pay 0; 1280 × 800'de × 1,7) %60 opaklıkla, altında dikişsiz `bg_tile-640` **kendi
  ölçüsünde** (kâğıt dokusu; q 85, eskiden 78): bokeh + doku birlikte. ≥ 800 px'lik çiçeksiz kırpım kaynakta yok (en geniş
  temiz bant 755 px); büyütmek ayrıntı eklemezdi. `bg_page-640/1024` ve `mist-640` hiçbir sayfada kullanılmıyordu → artık
  üretilmiyor (docs/11 §1).
- **Altın eğrelti tonu (G402 incelemesi):** GPT'nin `florals_br` kümesindeki eğrelti comp'un şampanya altınına göre turuncuya
  kaçıyordu (sıcak piksellerin ortalama doygunluğu 0,61). `build_images.py` yalnız H 25–45° (± 8° yumuşak kenar) ve S ≥ 0,25
  piksellerde doygunluğu × 0,74, parlaklığı × 1,04 yapar (`florals_tl` × 0,86 / × 1,02): 0,61 → 0,48 (tl 0,575 → 0,525);
  krem güller dokunulmaz. Renk düzeltmesi, çizim değil; parametreler `manifest.cleanup.florals_*.fern_grade`.
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
- Kartlar: `free_zone` + 3 dilim sınırları (`slices`; info kartında %20–93 gerçekten düz kâğıt). Davet kartının %39–60 bandı
  **gerilemez**: sol kenarında okaliptüs yaprakları ve altın eğrelti %62'ye kadar iner, sağdaki eğrelti %55'te başlar; uzatmak
  GPT yapraklarını sündürürdü. Bu yüzden davet metni kartın altına sıkıştırılmış düz `info_card` (3 dilim) üstünde (aşağıda
  "Comp öğe haritası"). og: `web_hero` alt hizalı 1.91:1; favicon: closure. Tema klasörü ≈ 1,8 MB (≤ 3 MB).
- **Kart yolu** (`stage.card_path`): `out` −%92 (alt köşeler cebin kenarını aşar), `front` −%95,5 × 1,09 (G402 incelemesi:
  × 1,04 fark edilmiyordu; artık yukarı ve öne, büyüyen gölgeyle) — sahne kutusu bu yolu kapsar (`stage.ratio` .68082).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış (katalog cümlesi):** dokununca tozlu mavi mum mühür **kopar** (ilk hareket 0 ms: küçük sıçrayış + dönüş, 230 ms) ve
  dönerek, yerçekimiyle hızlanarak ekranın altından **düşüp gider** (1 020 ms); başlık ve isimler yukarı çekilir; V kapak
  menteşesinde yukarı açılır (520 ms'de, 0 → 90°, yumuşak başlangıç, 80°'den sonra söner — kenardan ince şerit görünmez), 90°'de
  kapalı gövde açık gövdeye (altın damask astar + ön cep) geçer, açık kapak −90°'den yatar; kart **ön cebin arkasından**
  yükselir (1 680 ms'den, 1 420 ms; bekleyen kart `card-slot` ile cebin yumuşak alt kenarının %1,2 üstünde kırpılır — zarfın
  altında 1 px kart şeridi görünmez) — bu sırada **tek okaliptüs yaprağı** (accent_1 × 1, `fall`) kartın yanındaki şeritten
  süzülür: geniş taraf seçilir, boyu (≥ 28 px) ve salınımı şeride sığacak kadar küçülür → **her açılışta tam bir yaprak**
  (ölçüm: 320×568, 360×640, 390×844, 430×932, 844×390'da 12/12 açılışta 1 yaprak; merkezi hiçbir karede foto penceresinde
  değil); `go`dan önce ekrandan çıkar. Kart alt köşeleri cebin kenarını aştıktan sonra (`out` −%92) **belirgin biçimde öne
  gelir** (`forward` 3 100 ms'den 780 ms: %3,5 yukarı, × 1,09, büyüyen gölge) ve kart hâlâ hareket ederken (`go` 3 650 ms)
  view transition ile home hero kartına uçar. Dokun → home **3,9 s** (theme-check ölçümü 3 898 ms; eskiden 4,4–4,9 s ve son
  1,1–1,3 s'si neredeyse durağandı); Skip her an; `arriveDelay` 0.
- **Kart ekranda kalır:** yükselen kart (out + front ≈ kendi boyu kadar yukarı) ekranın üst kenarına en az 12 px uzak kalır:
  kısa ekranda sahne dokunuşla (`glide` 300 ms'den 900 ms) gereken kadar aşağı kayar, `front` ayrıca kırpar (ölçüm: 320×568,
  360×640, 375×553, 375×667, 390×844, 568×320, 844×390, demo + stres kaydı: kartın üstü ≥ 13 px).
- **Yatay telefon açılışı:** zarf dinlenirken isimler sütununa göre **dikeyde ortalı** (`translate`, kart odası ekranın üstünde,
  boş); dokununca isimler solarken sahne **ekranın ortasına** ve kart sığacak kadar aşağı kayar — sol yarı açılış boyunca boş
  kalmaz, kart ekranın üstüne değmez (844×390'da üst 15 px). "Replay"de kapalı zarfın üstünde kırpılmamış kart uçuşmaz;
  `?replay=1` `<head>` betiğinde de kapalı.
- **Story:** üç anlık baskı **sırayla** (her baskı kendi `data-scene`'i, `batchGap` 420 ms) yandan/alttan uçar, döner ve hafif
  taşmalı (`--settle`) −4,5° / +4° / −2,5° açılarla oturur; başlık baskının alt kenar boşluğuna 1,05 s sonra yazılır. 2. baskının
  **çerçevesi aynalı** (docs/11 §5.7: `scale: -1 1` yalnız çerçeve görseline; pencere, maske, foto ve başlık aynalı kâğıda göre
  yer değiştirir, foto ve yazı düz kalır): dalı sağ üstte, 1. baskının başlığına binmez. Önceki baskı sonrakinin **üstünde**
  (dal bir önceki baskının kenar boşluğunun altına girer), bindirme −6vw (eskiden −9vw). 60 karakterlik iki satırlık başlıklar
  320/360/390/430/768/1280'de hiçbir baskının altında kalmıyor (ölçüm: başlık bölgesi öteki baskılar gizlenerek karşılaştırıldı,
  %0 fark). Telefonda baskı 66vw, foto penceresi 66 × 0,755 = **50vw** (≥ 38vw); ≥ 760 px'te comp dizilişi (iki üstte, biri altta
  ortada). Yana kaydırma yok (ipucu gerekmez).
- **Parçacıklar:** açılış 1 okaliptüs yaprağı (`avoid: '.env .card'`, her açılışta tam bir) · home'a varış 2 küçük beyaz çiçek
  (accent_2) · RSVP kapanışı 2 çiçek + 1 yaprak. Varış ve kapanışta katman **bölümün içinde, yazının arkasında** (G402 QA:
  `host`, `.accent-layer.in-host` z 0, yazı z 1); her parçacık 8 denemenin en uzun serbest düşüşünü alır (taraflar sırayla) ve
  yolundaki ilk kutunun (`avoid`: hero kartı, hap, sayaç hücreleri / kapanış dalı) ya da yazının (`ink`: satırların kendi
  kutuları) 8 px üstünde söner; 120 px'ten kısa yol → o parçacık çizilmez. Form kapanış bölümünün dışında: parçacık forma
  girmez; kapanış yazıları kendi genişliğinde (`fit-content`), yatay hero'da metin ızgarada ortalı. Ölçüm (QA'nın parçacık
  betiği: merkezi hedef kutuda ve alanının > %30'u üst üste olan kareler): 390×844, 360×640, 844×390, 1280×800'de home ve
  RSVP'de **0 kare** (önce textarea 264, "Thank you" 141, isimler 30–51 kare).
- Hareket azaltma (`prefers-reduced-motion`): açılış atlanır, girişler hareketsiz.

## Home ilk ekranı (hero) ve yatay telefon
01'in qa derslerinin aynısı (`fitNames` + `fold`, `img/manifest.json theme_check.first_screen` = `{landscape: true,
names_min_px: 36}`); **oranlar W1.2'nin** (G402 incelemesi: kart 221 px / isimler 56 px ile hiyerarşi tersti, 01'in home'una
benziyordu): telefonda kart `clamp(150px, min(42vw, 30svh), 250px)` (390'da 164 px, −2,5° eğik anlık baskı), isimler
`clamp(46px, min(16,5vw, 10svh), 92px)` (390'da 64 px), kartla isimler arasında daha çok hava; **≥ 1024 px iki sütun** (kart
solda `clamp(240px, 24vw, 340px)`, metin sağda, isimler 1280'de 88 px) — dar sütunda "pul" gibi kalan kart yok.
- **Adımlar** (ilk ekran nav'ın 8 px üstünde bitene kadar; ölçüm `offsetTop` ile, giriş dönüşümleri sayılmaz): (1) isimler
  en çok %24 küçülür, (2) `.is-tight` + isimler **36 px tabanına** kadar, (3) `.is-long`: sayaç hapın altına geçer, (4) yine
  sığmazsa hero kaydırılır. Sonra nav'ın 8 px üstünde bitmeyen ilk parça ilk ekranın **altından** başlar (`fold`; nav'ın altında
  yarım parça yok). Platformun önizleme çubuğu (paylaşılan önizleme linki) varsa yüksekliği `--bar` ile hero'dan düşülür.
- **Köşe kümeleri düz çizgiyle kesilmez** (G402 incelemesi): hero kutusu yalnız ekranın yanlarında kırpar (`overflow-x: clip`);
  alt küme kendi alfasıyla, nav bandının **8 px üstünde** biter (hero altı = bant üstü + 16 px → `bottom: 24px`; maske yok);
  sayfa sonu kümeleri de bandın 8 px üstünde biter (`--navpad` = nav satırı + 16 px geçiş + 8 px), ancak ekranın/sayfanın kendi
  kenarında kırpılır. Kısa telefonda (9:16 ve daha basık) ve yatayda küme küçülür, sayaç/ipucu yazısına binmez.
  `theme-check` bunu ölçer (`theme_check.clusters`: kırpan ata yalnız ekran/sayfa kenarında; ilk ekranda ve sayfa sonunda nav
  bandının altına giren küme yok).
- **Hero yazısı boyalı süsün üstünde değil** (final QA, docs/11 §12): tasarım aralığı ve stres kaydında sayaç ve RSVP hapı
  `florals_br` kümesinin yapraklarına iniyordu (390×844 aralık: "Seconds" etiketinin %62'si, saniye rakamlarının %25'i süste;
  430×932 %50, 768×1024 %26; stres 390×844 %66, 430×932 %51, 320×568 %6; hap yapraklara değiyordu), masaüstünde (1024×768,
  1280×650 aralık) bir yaprak (`.float`) isimlerdeki "&"ın üstündeydi (%5 / %12). `site.js` `decor()` `fold`/`foldAll`'dan
  sonra (yazı tipleri, `load`, boyut değişimi) her iki kümeyi `florals_tl/br-480`'in alfasından çıkarılmış 16 × 16 doluluk
  haritasıyla (`MAP`; alfa > 40 olan hücre) hero yazısının satır kutularıyla (isimler, tarih, mekân, şehir, sayaç rakamı ve
  etiketi, sayaç sonu cümlesi, hap; giriş dönüşümleri sayılmaz, 2 px pay) karşılaştırır: dolu hücre bir yazıya değiyorsa küme
  kendi köşesine doğru küçülür (`--cw` × 0,94 … 0,52; `right`/`bottom` aynı kalır → küme hâlâ kendi alfasıyla, nav bandının
  8 px üstünde biter, düz çizgiyle kesilmez); 0,5'in altına inmesi gerekirse gizlenir (ölçümde hiç gerekmedi). Yazıya 6 px'ten
  yakın `.float` gizlenir. Konum/ölçek değişikliği, çizim değil (K21). Örnek: 390×844 aralık kaydında alt küme 195 → 113 px,
  `f-leaf2` gizli; 1280×650'de `f-leaf` gizli. **Ölçüm** (süs gösterilip gizlenerek tam sayfa ekran görüntüsü farkı, her yazı
  kutusunda RGB uzaklığı > 40 olan piksel payı, sayaç durdurulmuş, hareket azaltılmış; demo / tasarım aralığı / stres × 16
  boyut: 320×568, 360×640, 375×667, 390×844, 412×915, 430×932, 768×1024, 667×375, 844×390, 1024×768, 1280×650, 1280×800,
  1366×768, 1440×900, 1536×753, 1920×1080): home'da 48 yüklemenin 45'inde **%0,0**, en yüksek %0,6 (stres 1536×753, isimlerin
  ışıltı payı; önce de %0,6), %0,2 ve %0,1 (önce: en yüksek %65,7, 18 yüklemede > %0,5). Story / details / rsvp aynı 48'er
  yüklemede en çok %0,4 (story 320×568; değişmedi). `tests/theme-dusty-blue-champagne.test.ts` aynı ölçümü 8 durumda tarayıcıda
  yapar (her kutu ≤ %2).
- **Kısa yatay** (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px): hero ızgara (kart solda, metin sağda); zarf sayfası yatayda
  isimler + ipucu solda, zarf sağda ve dikeyde ortalı. W1'de yatay comp yok; comp'un öğeleri ve sırasıyla kurulur (ek düzen).
- **Kart kopyası (`fitCopy`):** yazı ≥ 11 px kalır; sığmazsa satır düşer (hepsi → dar tarih [italik, aralıksız] → şehir yok →
  yalnız tarih → hiçbiri), boyut değişince yeniden (`ResizeObserver`). Şehir satırı docs/11 §3.2 gereği `venue.city_region`
  ("Charleston, South Carolina", dengeli iki satır).
- **Ayraç noktaları (`stack`):** bütün "·" ayraçları `.dot` (RSVP kapanışındaki "isimler · tarih" dahil, G402 incelemesi); satır
  kırılırsa nokta satır sonunda asılı kalmaz: nokta gizlenir, ilk parça kendi satırına geçer.
- **Zarf sayfası (`fitEnv`):** isimler ≥ 36 px (tavan `--nm`, en çok ekranın %22'si); uzun isim + kısa ekranda "Tap to open"
  ekranda kalana kadar zarf küçülür (`--env-fit`, en az %72).
- **Ölçüm** (kendi `next start` + Chromium; 3 kayıt × 13 boyut: 320×568, 360×640, 375×553, 375×667, 390×844 dikey · 568×320,
  667×375, 740×360, 844×390, 932×430 yatay · 1024×768, 1280×800, 1440×900): **hiçbir boyutta nav'ın altında yarım kalan hero
  parçası yok**, yatay kaydırma yok; zarf sayfasında kapalı zarf ve "Tap to open" 12 boyut × 3 kayıtta ekranda, isimler zarfla
  çakışmıyor.
  - Demo (Eleanor & Theo): son parça / nav üstü — 320×568 488/498 · 360×640 527/570 · 375×553 470/483 · 375×667 549/597 ·
    390×844 681/774 · 568×320 247/258 · 667×375 302/313 · 740×360 287/298 · 844×390 317/328 · 932×430 357/368 · 1280×800
    580/730; isimler 38,0–64,3 px (telefon), 88 px (1280); hero kartı ≥ 150 px.
  - Tasarım aralığı (`rangeRecord`): 320×568, 375×553, 568×320'de `.is-long` + `fold`; öteki boyutlarda hepsi nav'ın üstünde;
    isimler 36,3–52,8 px. Zarf sayfasında isimler 36 px, ipucu ekranda.
  - §12 stres kaydı (40 karakter isimler, 80 karakter mekân): isimler 36 px tabanında (932×430'da 38,8); 360×640, 375×667,
    740×360, 844×390'da `.is-long` + `fold`; hiçbir boyutta yarım parça yok.
  - `theme-check --stress` aynı kuralı 360×640, 375×553, 844×390, 667×375'te üç kayıtla denetler (geçti).
- **Önizleme çubuğu** (paylaşılan önizleme linki, G402 QA): yatay telefonda hero kartı da çubuğu düşer (`--bar`; kart ≥ 120 px
  yalnız bu durumda, kopyası ≥ 11 px ya da satır düşer). Kart kopyasının el yazısı satırı da ≥ 11 px (`max(11px, 10.4cqw)`).

## İç sayfalar: ilk ekran kuralı (G402 QA)
QA kapısı ilk ekran kuralının yalnız home hero'da uygulandığını buldu (story baskıları, details mekân fotoğrafı / program
satırı, RSVP mührü ve yatayda başlıklar nav çizgisinde kesiliyordu). Artık story, details, rsvp ve home'da hero'dan sonraki
davet bölümü de aynı kurala uyar (`site.js` `foldAll`):
- **İşaretler:** `[data-fold]` = bir parça; `data-fold="join"` bir öncekiyle birlikte taşınır (kart başlığı + tarih, "Kindly reply
  by" + tarih, "With love," + isimler + mühür, kapanış başlığı + satırları); kartın son parçası kartın alt kenarını taşır (kartın
  çerçevesi nav çizgisinde kesilmez). `[data-fold-group]`: story'de `main` (`"center"`), details'te `main`, rsvp'de kart / form /
  kapanış ayrı (≥ 960 px iki sütun).
- **Algoritma:** nav çizgisini (nav bandının 8 px üstü) kesen ya da ilk ekranda nav'ın arkasında kalan ilk parça ilk ekranın
  hemen altından (2 px; final QA'ya kadar 12 px — her katlamada 10 px daha az boş kâğıt) başlar. Boşalan yer gruptaki üst
  aralıklara dağılır (aralık başına ≤ 28 px; üstteki parçalar yine nav'ın üstünde kalır); `"center"` grubunda kalanın yarısı
  başlığın üstüne → küçük telefonda story başlığı ilk ekranda ortalı bir kapak. Kartın içinde katlanan parça kartta bir boşluk
  bırakır: nav bandı 70 px + 8 + 2 px olduğundan bu boşluk en az ≈ 80 px eksi parçanın kendi üst aralığıdır. RSVP kartı bu
  yüzden önce ilk ekrana sığdırılır (aşağıda); katlama yalnız sığmayan boyutların yedeği. Ölçüm `offsetTop` ile (giriş
  dönüşümleri sayılmaz) + döndürülmüş baskının kutusu, tam piksel yuvarlaması için 2 px pay; yazı tipleri, `load` ve boyut
  değişiminde yeniden. Dal görselleri oranlarını baştan ayırır (`aspect-ratio: 300 / 65`): yüklenince kayma yok. Ekran dışından
  uçan baskılar 140 px aşağıdan başlar (görünmez başlangıç kutusu ilk ekranın altında kalır).
- **RSVP kartı + mühür ilk ekranda (`site.js` `fitCard`, final QA):** eski kural (CSS: yükseklik ≥ 740 px'te genişlik =
  `(100svh − nav − üst boşluk − 26px) / 2,12`, en az 296 px) imzayı ölçmüyordu: nav 54 değil 70 px, iki satırlık isimler kartı
  uzatıyordu → "With love," + isimler + mühür ilk ekranın altına itiliyor, kartın ortasında 200–400 px boş kâğıt kalıyordu
  (kartın içine eklenen boşluk: demo 1024×768 / 1366×768 +213, 1280×800 +244, 1536×753 +198; aralık ve stres 390×844 +249,
  412×915 +283, 430×932 +289, 768×1024 +329, 1024×768 +213, 1280×800 +244, 1440×900 +297, 1536×753 +198, aralık 1920×1080
  +397). README ve Sonuç'taki "kart + mühür 390×844, 430×932, 768×1024 ve masaüstünde ilk ekranda tam" / "kart + form
  1280×800'de tam" cümleleri **yanlıştı** (yalnız demo kaydının telefonlarında doğruydu). Şimdi `fitCard` (`foldAll`'ın başında, eski katlama payları
  silindikten sonra: katlanan bir boyuttan dönüşte kart yeniden sığar)
  kartı ölçer ve mührün altı nav çizgisinin üstünde bitene kadar sırayla: (1) kart daralır (`--cw`, 8 px adım, ≥ 296 px), (2)
  `--sg` 1 → 0,72 (0,04 adım): kart içi aralıklar, "With love," ve kıl çizgisi, isimler, mühür ve mühür payı birlikte küçülür
  (isimler ≥ 19 px, "&" ≥ 11 px), (3) kartın üstündeki boşluk (`--rt`, köşe kümesinin yeri) ≥ 64 px'e iner (kart kümenin alt
  ucunu örter), (4) kart ≥ 240 px'e daralır. Yine sığmazsa her şey tam boya döner ve `foldAll` katlar. Varsayılan genişlik CSS'te
  `min(100% − 48px, 420px)` (JS'siz: uzun kart). **Ölçüm** (kartın içine `site.js`'in eklediği en büyük boşluk; demo / tasarım
  aralığı / stres × 16 boyut — Finding 1'in listesi: 320×568, 360×640, 375×667, 390×844, 412×915, 430×932, 768×1024, 667×375,
  844×390, 1024×768, 1280×650, 1280×800, 1366×768, 1440×900, 1536×753, 1920×1080): 48 durumun **36'sında 0 px**, kart + mühür
  nav çizgisinin üstünde (önce 7'sinde); kart 240–420 px, isimler 19–46 px (390×844: demo 32,6 · aralık 30 · stres 20,1 px).
  Sığmayan 12 durum (320×568 her kayıt; 667×375 ve 844×390 her kayıt; stres 360×640, 375×667, 1280×650): kart tam boyda, ilk
  ekranda başlık + tarih + hap (yatay) ya da "We can't wait" satırına kadar (telefon), tek katlama **53 px** (yatay; önce 63),
  **70 px** (320×568; önce 80), **67–68 px** (stres 360/375; önce 77–78), **63 px** (stres 1280×650; önce 73); üstteki aralıklar
  ≤ 28 px dağılır. Bu boyutlarda "≤ ~40 px" sınırı bir kat içinde tutturulamaz (yukarıdaki nav bandı hesabı); bütün kartı ilk
  ekranın altına itmek ilk ekranda yalnız köşe kümesini bırakırdı (önceki QA'nın yatay telefonda reddettiği "yalnız bir küme")
  — bu yüzden yapılmadı (açık nokta, Sonuç). Önizleme çubuğu açıkken (≈ 36 px) yedeğe düşenler: ek olarak 360×640 ve 375×667
  (aralık), 1280×650 (aralık), boşluk 61–87 px. ≥ 960 px yanıt formu kısa (ad | e-posta, iki cevap yan yana): 1280×800'de kart
  + mühür + form ilk ekranda tam (ölçüldü: üç kayıt). `tests/theme-dusty-blue-champagne.test.ts` 14 durumda 0 px ve mühür nav
  çizgisinin üstünde, iki yedek durumda ≤ 72 px denetler.
- **Yerleşim (CSS):** Yatay telefonda iç sayfa başı küçültülmüş köşe kümesinin yanında (`--tl: min(30vw, 64svh)`, üst boşluk
  14 px, story başlığı `clamp(52px, 20svh, 96px)`, kart `max(340px, …)` genişlikte → başlık, tarih ve ilk satırlar ilk ekranda).
  Masaüstünde story başlığı + iki baskı ilk ekranda (`--pw: clamp(200px, (100svh − 470px) / 1.5, 265px)`, üst boşluk
  `clamp(72px, 100svh − 680px, 160px)`); details kartı ekran yüksekliğine göre (≥ 340 px) → 1024×768 ve 1280×800'de tam kart.
- **Ölçüm** (kendi `next start` + Chromium; giriş adımları son hâline zorlanıp `getBoundingClientRect`; parça = yazı, foto alanı,
  baskı, mühür, düğme, form alanı, dal — kâğıt kartın kendisi değil): 3 kayıt (demo, tasarım aralığı, §12 stres) × 16 boyut
  (320×568, 360×640, 375×553, 375×667, 390×844, 430×932 · 568×320, 667×375, 740×360, 844×390, 932×430 · 768×1024, 1024×768,
  1280×800, 1440×900, 1920×1080) × home/story/details/rsvp = 192 yükleme: **nav'ın 8 px üstünü geçen ya da ilk ekranda nav'ın
  arkasında kalan parça 0**; önizleme kipinde (çubuk açık) de 192/192 temiz. QA'nın kendi taramasıyla (giriş dönüşümleri
  ölçülür) yalnız uzun kâğıt kartın kendisi nav'ın altına uzanıyor (içindeki satırlar değil) ve form.js'in ekran dışındaki bal
  küpü alanı ("Website") görünüyor — ikisi de beklenen. Önce: 144 yüklemenin 144'ünde kesik parça vardı. **Final QA
  düzeltmelerinden sonra** (fitCard, decor, 2 px) QA'nın parça tanımıyla (`qa_nav`; nav'ın üstünü geçen ve ilk ekranda başlayan
  parça) yeniden: home/story/details/rsvp × 3 kayıt × Finding 1'in 16 boyutu = 192 yükleme **0 ihlal**, yazı ≥ 11 px, isimler
  ≥ 36 px, tek `h1`, yatay kaydırma yok; önizleme çubuğuyla da 192/192.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| köşe kümeleri (sol üst, sağ alt), bokeh | telefon: `paper-400` (bg_page'in çiçeksiz bandı) + `florals_tl` / `florals_br` ayrı katman, ikisi de tam; geniş/yatay ekranda `paper_wide-755` (%60) + dikişsiz `bg_tile` + aynı kümeler | eğrelti tonu comp'un şampanya altınına çekildi (`fern_grade`) |
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
| anlık baskı kartı + foto (genişliğin ~%41'i), "We're getting married", "SEPTEMBER 18, 2027 · CHARLESTON" | `.hero-card` (card_small + `hero_portrait`; 390'da 164 px, −2,5°) | tarih ve şehir ayrı satırlar; şehir satırı docs/11 §3.2 gereği `venue.city_region` ("Charleston, South Carolina"; comp yalnız şehir yazıyor), dar kartta italik küçük harf, sığmazsa düşer |
| isimler (büyük, kartın altında havayla) | `h1.names` | 390'da 64 px, ≥ 36 px taban; ≥ 1024 px iki sütun (W1'de masaüstü comp yok) |
| "SATURDAY · SEPTEMBER 18, 2027" | `.hero-date` | dar ekranda iki satır, nokta gizli |
| mekân (italik), şehir + eyalet | `.hero-venue`, `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7); < 380 px'te iki nokta ayıracı gizli |
| tozlu mavi RSVP hapı | `.hero-cta .btn` | hap düğme (arayüz) |
| alt gezinme "HOME · STORY · DETAILS · RSVP" iki altın kıl çizgi arasında | `.site-nav` | 1 px ayraçlar (arayüz); yumuşak üst geçiş (0 → .97, 15 px) + satırın altında kâğıt tonunda opak zemin #C8D8E9 (G064 dersi: kayarken arkadaki yazı/foto harflerin arasından okunmaz); zarf → home geçişinde nav ilk karede tam gelir (`::view-transition-new(site-nav):only-child`) |
| — (comp yok) | **davet seti**: "Together with their families" (kicker) → çiçekli davet kartı (`invitation_card`, kendi boyunda; isimler güllerin arasındaki düz kâğıtta, `fitInvite`; "&" isimlerin ~0,8'i) → kartın altına −1° / +1,4° açılarla sıkıştırılmış düz `info_card` (3 dilim; üst dalı davet kartının altında kalır) üstünde davet cümlesi, tarih bloğu (gün / ay · GÜN · yıl / saat), dal, mekân, şehir; takvime ekle; üç bölüm (story_1 baskısı · günün kartı ilk 4 satır · mühür + tek "Kindly reply by"); kapanış ("With love," + isimler + "Open the envelope again") | bu tasarımın parçaları ve dili. **Neden iki kart:** davet kartının %39–60 "düz" bandının sol kenarında yaprak ve eğrelti var; germek GPT yapraklarını sündürürdü (G402 incelemesinin önerisi bu yüzden uygulanmadı). Davet metni artık mavi zeminde değil, kâğıt üstünde; ev sahibi satırı kartın üstünde başlık |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| iki üstte bir altta üç anlık baskı (köşesinde okaliptüs dalı; comp'ta dallar baskıdan baskıya değişiyor), aralarında küçük çiçek kümeleri | `.prints` ≥ 760 px: aynı düzen (265 px baskılar); dal çerçevenin kendi parçası (frame_portrait); 2. baskının çerçevesi aynalı (dalı sağ üstte) | baskıların arasındaki küçük çiçek kümeleri yok (ayrı GPT parçası yok; çizilmez) |
| | telefon: basamaklı sütun (sol −4,5°, sağ +4° aynalı, sol −2,5°; önceki baskı üstte, bindirme −6vw) | **sapma:** comp'un yan yana baskısı 390 px'te pencereyi ~120 px yapardı (< 38vw, §9); telefonda pencere 50vw |
| başlık baskının alt kenar boşluğunda (el yazısı) | `figcaption .cap` — `figure`'ın kendi çocuğu (geçerli HTML; G402 QA) (`frame_portrait.caption_band_pct` %81,8–97,8) | uzun başlık küçülür (≥ 11 px), yine sığmazsa satır kısalır |
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
- Kontrast (oluşan sayfada metnin arkasındaki piksellerin medyanı, metin saydam yapılıp ölçüldü; sabit nav ve düğmeler
  ayrı; G402 inceleme düzeltmelerinden sonra yeniden: home/story/details/rsvp × 390×844 ve 1280×800 × demo + stres kaydı,
  zarf 390×844 / 844×390 / 1280×800): küçük metin en düşük **4,69:1** (stres kaydı, davet kartındaki "&"; demo kaydında 4,81:
  hero kartındaki "We're getting married"), büyük metin (≥ 24 px) en düşük 4,41:1 (≥ 3 gerekir). Davet metni artık fildişi
  kâğıt üstünde (mavi zeminde değil). Kartlardaki altın el yazısı `--gold-card` #85642F (fildişi kâğıtta 4,76:1). Mühürdeki
  monogram (zarf, home bölümü, RSVP kartı) bilerek kabartma tonunda (`--seal-ink` #EEF2F6 mavi mumda ≈ 3,6:1) ve süs:
  yardımcı teknolojiden gizli (`aria-hidden`), isimler sayfada metin olarak var.
- Yazı tabanı: görünen her metin ≥ 11 px (kart kopyası `fitCopy`, baskı başlıkları `fitLines` — tabanlar yukarı yuvarlanır,
  10,99 px olmaz); mühür monogramı `max(11px, 12.5cqw)`. Android'de dokunma dikdörtgeni yok (`-webkit-tap-highlight-color`).
- Köşe kümeleri düz çizgiyle kesilmez (yukarıda "Home ilk ekranı"; `theme-check` ölçer): yalnız ekranın/sayfanın kendi
  kenarında kırpılırlar, nav bandının altına girmezler. İlk sürümde hero kutusu (`overflow: clip` + `bottom: -10 %`) alt
  kümeyi kaydırınca görünen düz bir çizgiyle kesiyordu, opak nav bandı da kümeyi biçiyordu (G402 incelemesi).
- Açılış giriş durumları ekran dışına taşmaz: home bölümlerindeki baskı/kart yukarı doğru dönerek oturur (`fly-up-l/r`), yalnız
  story baskıları ve mekân baskısı yandan uçar (bölüm `overflow-x: clip`).
- Yazılım bütçesi (docs/11 §6; KiB, 01 / 03 / 05 testleri gibi): `site.css` ≤ 46 080 B, `site.js` ≤ 35 840 B (test denetler).
  Final QA düzeltmelerinden sonra `site.js` 35 775 B (pay 65 B; fitCard + decor için yorumlar kısaldı, sayaç saat dilimi
  yardımcısı tek işlev, `fitLines`/`fitInvite` tek `shrink` döngüsü, devRender sıkıştı — davranış aynı, testler ve ölçümler
  yeniden koşuldu), `site.css` 46 001 B (pay 79 B; G068 birleştirmesinden sonra nav çıkış kuralı eklendi); ikisi de 1000 B okumasıyla bütçenin üstünde. Pay çok az.
- RSVP kartı 320×568'de ve yatay telefonda (667×375, 844×390) ilk ekrana hiçbir kayıtla sığmaz (240 px + `--sg` 0,72 ile bile);
  orada kart tam boyda katlanır, kartın içinde tek bir 53–70 px boşluk kalır (yukarıda "RSVP kartı + mühür ilk ekranda").
- Aksanlı isimler: Pinyon Script ve Cormorant Garamond'un Google Fonts CSS yanıtında `latin-ext` bloğu var (docs/11 §12).
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (Safari'nin yatay araç çubukları, `svh`, `mask`, `ResizeObserver`,
  `overflow: clip`), Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
