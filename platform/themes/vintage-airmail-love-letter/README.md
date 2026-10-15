# Tema: vintage-airmail-love-letter (tasarım 04 · Vintage Airmail Love Letter, G404)

Eski bir aşk mektubu: harita çizgili parşömen üstünde kırmızı-lacivert çizgili hava postası zarfı, üst kenarında delikli
yırtma şeridi ve şeride basılmış lavantalı bordo balmumu mühür; içinde krem mektup kartı. Pullar, posta damgaları, kuru
çiçekler (unutmabeni, cipsofila, lavanta) ve sicim. Homemade Apple (dolma kalem el yazısı: isimler, başlıklar) + Special
Elite (daktilo: tarih, mekân, program, etiketler). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi
`platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından (`collections/04_Vintage_Airmail/assets/gpt/comps/web_1..5`);
bütün görseller bu tasarımın GPT parçaları (K21). 01 (olive-ivory) ve 03 (blush-garden-rose) temalarından yalnız platform
sözleşmesi ve çözülmüş sorunların dersi alındı (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları,
`data-scene`/`data-step`/`data-a`, `devRender`, ilk ekran/katlama, yatay telefon, kart dilimleri); görünüm, süs konumları,
zamanlama, giriş ön ayarları ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Vintage Airmail Love Letter", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`) |
| `content.demo.json` | `collections/04_Vintage_Airmail/content.demo.json`'ın birebir kopyası (`/start?theme=vintage-airmail-love-letter` ve tema demosu bunu kullanır; servis edilmez) |
| `index.html` | kapalı zarf → dokun → mühür fırlar, şerit soldan sağa yırtılır, kart zarftan yukarı kayar, bir unutmabeni süzülür, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: mektup kartı + foto, isimler, gün · tarih, mekân, şehir, geri sayım, RSVP hapı), mektup (invitation_card, tekrarlanan çizgi bandı) + "Kindly reply by", takvime ekle, "Inside this letter" (pul çerçevesi + damga · günün mektubu · mühür, sırayla kâğıda bırakılır), "Until then, with love" |
| `story.html` | W1.3: yazı masası (bg_desk), "Our Story" + "Moments we hold dear" + giriş cümlesi, üç pul çerçevesi masaya tek tek düşer (telefonda zikzak, ≥ 720 px tek sıra), birincisine posta damgası vurulur, başlıklar çerçevelerin altında el yazısıyla |
| `details.html` | W1.4: ilk ekran zemini (`.page-bg`: harita çizgili parşömen + damga; yatay/geniş ekranda sağ alt kuru çiçek kümesi), Order of the Day mektubu (info_card, program satırları + aralarında papatyalı sicim), takvime ekle, mekân (pul kenarlı yatay çerçeve), dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: ilk ekran zemini (`.page-bg`, details gibi), "Will You Join Us?" mektubu (info_card) + tabanında lavantalı mühür (closure) — mektup ve mührü ilk ekrana sığacak boyda, imza birimi (`.sig`: "With love," + isimler), platform yanıt formu (G042 + G051 soruları, her genişlikte mektubun altında), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`type`, `drop`, `stamp`, `strike` bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, mektup kâğıdı bandı, sayfa yerleşimleri |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, mektup bandı (`fitPaper`), kümelerin boyalı kenarı (`EDGE`, `ink`, `paints`, `giveWay`), uzun isim + home ilk ekranı (`fitNames`, `fitCopy`, `fold`, `corner`), iç sayfaların ilk ekranı (`folds`, story `tiles`), zarf sayfası sığdırma (`envFit`), önizleme çubuğu (`--bar`), geri sayım, zarf (yırtılma), `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri ve temizliği |
| `img/` | WebP katmanlar, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png` (yalnız mühür), `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 495/590 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 723/901 | frame_portrait (story; `story_1` home'daki pul çerçevesinde de) |
| `venue` | `media.venue_image` | 1150/584 | frame_landscape (details) |

Foto çerçevenin **altında**, maske `mask_<şekil>.png` (GPT penceresinden; CSS `border-radius` yok), `object-position` portre
50% 38%, mekân 50% 50%. "Your photo here" yalnız önizlemede (`html[data-preview="true"]`); misafir nötr yer tutucuyu
(bg_page'in dekorsuz, harita çizgisiz parşömen kırpımları, bulanık + fildişine tonlanmış) görür; `build_images.py` her yer
tutucunun en koyu pikselini ölçer (`manifest.ph_*.min_lum` ≥ 170, yoksa çıkış ≠ 0; şu an 193–212). Alt metinler içerikten.

## Görseller (`python3 platform/themes/vintage-airmail-love-letter/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre** (alfa kırpma, #00FF00 pencereleri + leke dolgusu, `windows.json`). `--prep-dir`
  verilirse oraya; o klasör başka koleksiyonun çıktısıyla paylaşılmamalı (yanlış `closure.png` → mühür ölçümü bozulur).
- **GPT kusurları temizliği (çizim yok, `temizle`):** bütün şeffaf parçalarda gövde alfası 253 (tam opak değil) ve nesne
  çevresinde alfa 1–5 geniş "bulut": alfa < 12 sıfır, [12, 250] → [0, 255]; çekirdekten uzak düşük alfa silinir (sert parça
  1 px, mühür/dekor 3 px); yarı saydam kenarın rengi komşu opak renge çekilir; şeffaf piksellere komşu renk taşınır (WebP
  kenar saçağı yok). Pencereler saf #00FF00 değil (frame_* yarı saydam lekeli, card_small gölgeli): parts_prep leke dolgusu +
  pencere çevresindeki yeşil/turuncu saçak halkası çerçeve renginden yeniden boyanır (`checks.windows_transparent`, görünür
  yeşil 0).
- **Yazı alanlarındaki lekeler** (`yazi_alani`): card_small'ın alt yarısında, invitation_card ve info_card'ın yazı alanında GPT
  "eskitme" pas noktaları ve kahverengi lekeler metnin altına düşüyordu (theme-check'in kâğıt piksel testi + okunurluk). Yalnız
  o bölgelerde: 7 px medyan ile tek tek noktalar ayıklanır, kalan lekeler kâğıdın medyan rengine doğru yumuşak kırpılır (çiçek,
  damga ve çizgili kenar `haric` kutularıyla korunur). Aynı işlem uzun sayfaların kâğıt karosu `bg_tile`'a (3 × 3 döşenmiş
  kopyada, dikişsiz kalsın diye) ve card_small'ın yazı satırlarına (`serbest_bolge_lekesiz`) uygulanır. Sonuç: `card_small.leke_px` 0.
- **Kapalı/açık hiza** (`hizala`, `manifest.stage.align`): GPT açık zarfı kapalının düzenlemesi ama ~25 px aşağıda ve %0,5
  geniş çizdi (kit_check: sol +0,00 · sağ +0,39 · **alt +1,56 % → uyarı**). Değişmeyen üç kenar (sol, sağ, alt) ölçülüp tek ölçek
  (0,99345) + öteleme (+1,37, −18,14 px) ile açık zarf kapalının tuvaline oturtulur; sonrası sol +0,10 · sağ −0,10 · alt −0,13 %.
- **Kesimler** (görselin kendi pikselinden): delik çizgisi = kapalı zarfta her sütunda şerit kâğıdından aşağı ilk koyu temas
  (3 px dikey medyan, lum < 135; 41 sütunluk kayan medyandan > 6 px sapan sütun — pul/leke — medyanla; uçtaki 24 sütun iç
  medyana sabit: eskiden şeridin iki ucunda 33 px sıçrama vardı). `env_strip` = kapalı zarfın delik çizgisinin üstü;
  `env_open` (gövde) = kapalı zarfın çizginin altı + hizalı açık zarfın çizgi üstünde kalan yırtık kâğıt artığı — gövde kapalı
  zarfın pikselleri olduğu için açılırken doku ve pullar "atlamaz"; `env_torn` = şerit farkı (kapalı − açık), şerit kutusuyla
  sınırlı (eskiden 15 px dışarı taşıyordu). Denetim: `env_strip ∪ env_open` = kapalı zarf (alfa farkı 0,00001).
- **Kapanış** (`closure.png` = mühür + lavanta, tek parça): yeri kesim geometrisine bağlı — çapa = şerit kutusunun merkezi
  (kapalı − açık alfa); W1.1 comp'ta ölçülen mühür genişliği / zarf genişliği (0,159) ve mühür merkezinin şerit merkezine göre
  dikey kayması (0,095 × zarf genişliği) uygulanır. Mühür görüntüden ölçülür (bordo leke), monogram yeri mühür genişliğinin
  0,46'sı kadar ortalı kare (`closure.mono_in_crop_pct`; görüntüden bulunan pürüzsüz bölge çok küçük çıkıyordu). Gözle:
  `platform/previews/g404/compare_closure.jpg`.
- **Mektup kâğıtları** (`tekrar_bandi`, docs/11 §9): invitation_card ve info_card'ın yan kenarları kırmızı-lacivert hava postası
  çizgisi; 3 dilimde orta bandı **germek çizgileri uzatırdı**. Bunun yerine kâğıdın ortasında çizgi periyodu (170–230 px arası,
  en iyi eşleşen 192 px) aranır, tam bir periyot `img/<kart>_band-*.webp` olarak yazılır ve `::before`'da **tekrarlanır**
  (`background-repeat: round`); `site.js` `fitPaper` kâğıt boyunu tam sayıda banda yuvarlar (yarım band yok). Sınırlar
  `manifest.<kart>.slices`; `site.css` `--ar/--t/--b` (invitation %53,145–66,714, info %26,529–40,185).
- **Masa** (story): `bg_desk`'in üst ve alt kenarı birbirine uymuyor (üstte ışık huzmesi) → `bg_desk` + dikeyde aynası alt alta
  tek dikişsiz karo (`bg_desk_pair` 640 / `bg_desk_pair_2x` 768), uzun sayfa boyunca `repeat-y`. Sabit (fixed) zemin yok: iOS'ta
  ve tam sayfa görüntüsünde kayıyordu.
- og: `web_hero` alt hizalı 1.91:1 (isimsiz); favicon: closure'ın yalnız mühür bölgesi. Tema klasörü ~2,5 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
Açılış cümlesi (bağlayıcı): *"On tap, the little wax seal pops off, the perforated tear strip rips away along the top edge from
left to right, and the cream letter card slides up out of the envelope while a pressed flower flutters down."*

| Adım | `[başlangıç, süre]` ms | Ne olur |
|---|---|---|
| `hint`, `tug` | [0, 260], [0, 300] | "Tap to open" söner; zarf parmağın altında hafifçe çöker |
| `closure` | [0, 820] | mühür şeritten kopar (zıplama + %12 büyüme), sola yuvarlanıp kaybolur — ayrı öğe, ilk hareket dokunuşla |
| `head` | [160, 620] | "You are invited" + isimler yukarı çekilir (kart oraya çıkacak) |
| `tear` | [360, 860] | şerit soldan sağa yırtılır: bağlı şerit soldan kırpılır (`clip-path`), yırtılan parça (`env_torn`) yırtılma noktasının solunda görünür ve o noktada kalkar (`transform-origin` noktayla yürür); yavaş başlar, hızlı yırtılır, yavaş biter |
| `fly` | [1220, 560] | yırtılan şerit zarftan kalkıp gider |
| `rise` | [1180, 1320] | krem mektup kartı zarftan yukarı kayar (gövdenin alt kenarında kırpılı; `ENVELOPE_GEOMETRY.out` −109,5 %) |
| `accents` | 1240 | **bir** kuru unutmabeni (accent_2) kartın yanındaki şeritte yaprak gibi sallanarak düşer (`avoid: '.env .card'`: fotoğrafın üstünden geçmez), `go`'dan önce ekrandan çıkar. **Her ekranda düşer (ikinci QA):** şerit 62–74 px'lik çiçeği ve salınımı taşımıyorsa çiçek ve salınım şeride göre küçülür (≥ 36 px); hiç şerit yoksa zarf gövdesinin üstünden düşer (`over: '.env-open'`: kart orada gövdenin arkasında). Önce 320×568'de 6 denemenin 0'ında, 360×640'ta 2'sinde, 390×844'te 4'ünde çiçek yoktu |
| `forward` | [2560, 620] | kart zarfın önüne geçer, olduğu yerde × 1,04 büyür, gölgesi derinleşir |
| `go` | 3620 | home; kart view transition ile hero kartına uçar (VT yoksa 420 ms solma) |

Skip, Enter/Replay, klavye (Enter/Space), azaltılmış hareket (doğrudan home), bfcache dönüşü (açık zarf + "Replay the
opening") ve `?replay=1` (head betiğinde kapalı başlar) 01/03 sözleşmesiyle aynı. Home'a varışta isimler kart inerken başlar
(`arriveDelay` 0).

**Parçacıklar (qa incelemesi):** açılıştaki tek unutmabeni sabit katmanda (ekranda yazı yok; Skip üstte kalır). Varış ve
kapanış parçacıkları **kendi bölümlerinin içinde** (`accents(an, until, host)`: katman `.hero` / `.closing` içinde,
`z-index: 0`, taşanı kırpılır) ve **yazının arkasında** (bölümün yazıları `z-index: 1`): varışta iki unutmabeni hero
fotoğrafının yanındaki şeritten yalnız fotoğrafın alt kenarına kadar iner (`to: 'avoid'`), kapanışta üç parça yalnız
"Replay the envelope" satırının altındaki bantta (`from: '.replay-line'`; ikinci QA: yol çiçeğin 1,6 boyu yukarıdan
başlıyordu, çiçekler "Replay", isimler ve tarih satırının arkasından geçiyordu — başlangıç artık satırın altında,
`fr.bottom + 1,6 × size[1]`). `MOTION.accents` grubu docs/11 §8'e üç anahtar ekler: `from` (seçici: o öğenin altından
başlar), `to: 'avoid'` (avoid kutusunun altında biter), `over` (şerit yoksa bu öğenin üstünden düşer), `text` (bu öğe
avoid kutusunun yanında başlıyorsa şerit onun 4 px solunda biter). **Üçüncü QA:** yatay telefonda kart solda, isimler sağ
sütunda; sağ şerit isim sütununu da kapsıyordu, varış çiçekleri isimlerin, tarihin, mekânın ve geri sayımın arkasından
geçiyordu (QA'nın piksel ölçümü: 667×375'te 6 koşunun 6'sında, 4–64 karede, en çok 2 036 px; 844×390'da 5/6) → `text:
'.hero .names'`: şerit kartla isim sütunu arasında; aynı ölçüm 640×360, 667×375, 740×360, 844×390 × 3 kayıt × 2 = 24 koşu:
20'sinde 0, 4'ünde (aralık kaydı, `is-long`) geri sayım satırında tek kare (20–155 px, çiçek solarken); her koşuda iki çiçek
düşer, dikey telefonda değişiklik yok (isimler kartın altında).

Giriş ön ayarları (bu tasarımın): `type` (daktilo satırı: `clip-path` 18 adımda açılır), `write` (el yazısı soldan sağa),
`drop` (kart/pul masaya yukarıdan, eğik ve derin gölgeyle düşer, gölge dinlenme gölgesine oturur), `stamp` (lastik damga gibi
vurulur), `strike` (posta damgası çerçevenin köşesine vurulur), `unfurl` (sicim ortadan açılır). Story: her çerçeve kendi sahnesi
(`story-stamp`: `drop` 0 · küçük pul/çiçek `acc` 420 · damga `mark` 760 · başlık `caption` 820); aynı anda ekrana giren
çerçeveler 760 ms arayla. Home "Inside this letter": başlık, pul çerçevesi (+ damga), sicim, günün mektubu, sicim, mühür sırayla.

## Home ilk ekranı (hero) ve yatay telefon (01'in qa dersleri + G404 incelemesi)
- İlk ekranın her parçası (kart … hap) nav'ın 8+ px üstünde biter ya da tamamen ilk ekranın altından başlar (yarım parça yok):
  `fitNames` önce isimleri (≤ 3,2 satır, ekranın ≤ %30'u; **taban 36 px** = `manifest.theme_check.first_screen.names_min_px`),
  sonra sıkı düzen (`is-tight`), sonra geri sayımı hapın arkasına (`is-long`) dener; olmazsa `fold` sığmayan ilk parçayı ilk
  ekranın altına iter (`--fold`: dekor hapın yanında kalır). Yalnız kart sığıyorsa (§12 stres isimleri, 320–375 px) kart ilk
  ekranda ortalanır. İlk ekran = `100svh` (araç çubukları hiçbir şeyi oynatmaz; paylaşılan önizlemede eksi platform çubuğu: `--vh`).
- Kısa yatay (`min-aspect-ratio: 1/1` ve `max-height: 620px`): kart solda, isimler … hap sağ sütunda (ızgara); zarf sayfasında
  açık zarf Enter / Replay'in yanında; kart telefonda ve masaüstünde ≥ 150 px, kısa yatayda ilk ekrana göre
  (`min((--vh − nav − 48 px) × 0,5886, 230 px)`, tabanı yok); kopyası ≥ 11 px, küçük kartta satır düşer (`fitCopy`).
  **Üçüncü QA:** önizleme çubuğuyla (`--vh` = 324 px) 640×360 / 740×360'ta 150 px tabanı kartı nav zeminine soktu (3 kayıt:
  kart 48–303, nav 293; RSVP hapı katlanıyordu) → kart 134 px, 48–276 / 53–280 (nav'ın ≥ 13 px üstünde), şehir satırı
  düşer, kopya 12 / 11 px; demo'da hap yine ilk ekranda. 667×375 çubukla kart 150 → 143 px (alt kenar 303 → 291–295).
- İsimler W1.2'deki gibi **tek satır**, %86'ya kadar küçülerek sığıyorsa (390 px'te "Margot & Henry" 41,3 → 40,5 px);
  sığmıyorsa eski kural (≤ 3,2 satır, taban 36 px).
- **İsimlerin kuyrukları (ikinci QA):** Homemade Apple'ın "g", "y" kuyrukları satır kutusunun ~0,34 em altına iner ("Margot"un
  g'si "SATURDAY"ın içinden geçiyordu: 1280×650 %10, 1366×657 %9,9). İsimlerin altında `.34em` (sıkı düzende satır aralığı
  1,28 olduğu için `.4em`) boşluk; tarih satırının kendi üst boşluğu kalktı. Bedeli 375×553'te geri alındı: sıkı düzende
  mekân, geri sayım ve hap aralıkları 2 px azaldı, `is-long`'da geri sayım haptan 6 px aşağıda (22 px idi).
- **Sağ alt küme (qa incelemesi + ikinci QA):** bütün (maske yok, kutuyla kesilmez), yerinde durur (`bottom: 26px` = nav
  zemini 18 + 8); yalnız orada ilk ekranın sonunu keserek nav bandına girecekse `site.js` `corner` onu nav'ın 8 px üstüne
  alır. Boyalı kısmı hero'nun **satır kutularına** (isimler, tarih, mekân, şehir, geri sayım, hap, kart; `Range` dikdörtgenleri,
  blok kutusu değil) 3 px'ten yakınsa %6 adımlarla küçülür, 64 px altında **kalkar** (`display: none`). Boyalı kenar
  `EDGE`: `decor_br` / `decor_tl`'nin yüksekliğinin 24'te biri başına sol / sağ boyalı ucu (genişliğin 32'de biri, α ≥ 40,
  `decor_*-760`'tan ölçüldü). Önce: `hidden` özniteliği `.corner { display: block }`'a yeniliyordu — küme "gizlenmesi
  gereken" 297 yüklemenin 47'sinde yazının altında görünüyordu (aralık 360×640 mekân %14,4, zorlama 384×854 tarih %52,9).
  Sayfa sonu kümeleri (`.foot`, `.next-sec`, `.closing`) de bütün ve nav'ın 8 px üstünde biter.
- Zarf sayfası: sahnenin kart için ayrılan üst boşluğu (`closed_obj.top_frac_of_stage_w` 0,6759) başlığın altına kayar;
  uzun isimler 20 px'e kadar küçülür. **"Tap to open" her ekranda görünür (qa incelemesi):** `envFit` ipucu ilk ekranın 6 px
  üstünde bitene kadar önce zarfı küçültür (`--ok` 1 → ≥ 0,64, sahnenin bütün yüzdeleri onunla), sonra isimleri (≥ 20 px);
  yatay/geniş ekranda isim sütunu iki köşe kümesinin arasında (`100vw − 1,6 × küme genişliği`). Önce: 667×375 / 844×390'da
  aralık ve zorlama isimleriyle, 1280×650 / 1366×657'de demo ile bile ipucu ekranın altındaydı. **İkinci QA:** iki köşe
  kümesi kicker'a, isimlere ve "Tap to open"a (satır kutuları, `EDGE`) 3 px'ten yakınsa küçülür (`giveWay`; önce aralık
  340×720'de kicker %4,1, 360×740'ta ipucu %3,0 boyalı kümenin üstündeydi).
- **Önizleme çubuğu (ikinci QA):** paylaşılan önizlemede platformun "Preview" çubuğu sayfanın üstünde akışta durur (~36–56 px).
  `site.js` yüksekliğini `--bar` yazar; `--vh: calc(100svh − var(--bar))` zarf sayfasının, hero'nun, iç sayfa zemininin
  (`.page-bg`) ve mektup genişliklerinin ilk ekranıdır. Önce önizlemede "Tap to open" kümenin üstündeydi (390×844 aralık
  %12,8), 844×390'da hero kartı nav'ın altına iniyor, details/rsvp `.page-bg` kümesi nav bandına giriyordu. İkinci turun
  "önizlemede nav ihlali 0" iddiası 6 boyutluk ölçüme dayanıyordu; üçüncü QA 640×360 / 740×360'ta 6 yüklemede kartı nav
  zemininde buldu (yukarıda, düzeltildi).

## İç sayfaların ilk ekranı (story, details, rsvp — G404 qa incelemesi)
Kural (G402/G405 dersleri): ilk ekrandaki her parça nav'ın üstünde biter ya da tamamen ilk ekranın altından başlar — nav
çizgisinin altında yarım kalan yazı, bağlantı, foto alanı, çerçeve/mühür görseli yok. `site.js` `folds()`:
- Birimler `[data-fold]`: story başlık, kicker, giriş, her pul çerçevesi (`data-fold="12"`: 12 px eğim payı; ≥ 720 px'te
  bütün sıra `.desk[data-fold="row"]` tek birim), sonraki bölüm; details kicker, kart başlığı, **her program satırı**, takvim,
  mekân fotoğrafı, mekân yazısı, dress code, harita, link blokları, SSS, sonraki bölüm; rsvp başlık, "Kindly reply by" + tarih
  (tek birim `.by`), hap, bekleme satırı, **imza birimi** `.sig`, form kutusu.
- Nav çizgisini kesen (ya da nav bandında başlayan) **ilk** birim için sırayla: içinde durduğu esnek sütun toplanır
  (`[data-pack]`: details program listesi `space-evenly`, rsvp metni `center` → üstten; ikinci QA: details'te `.packed`
  listenin `space-evenly`'sine yeniliyordu → `.paper [data-pack].packed`), sayfa başı yükselir (`[data-lift]`: `--lift` ≤ üst
  boşluğun %35'i; telefonda köşe kümesi onunla küçülür, yazıya binmez). RSVP imzası (ikinci QA): önce mektubun ritmi sıkılaşır
  (`.tight`: hap, sicim, satır araları; hap ≥ 44 px), sonra mektup daralır (`--cw` %6 adımlarla ≥ 225 px: isimler 8cqw ≥ 18 px;
  her şey oranla küçülür). Eski `--sg` (yalnız imzayı küçültüp daraltan, isimleri daha çok satıra saran) kalktı.
- Yine sığmazsa birim ilk ekranın 6 px altından başlar — **sayfada tek katlama** (yeni katlama öncekileri siler: ikinci QA'da
  details'te listenin büyümesiyle ikinci, bayat bir itme kalıyordu, 148 + 87 px) ve katlananın üstündeki boşluk aynı sütunun
  aralarına dağılır (her araya ≤ 72 px), mektubun içindeki boşluk ≈ nav bandı.
- **Mektup yalnız başlığıyla kalmaz (üçüncü QA):** katlanacak birim mektubun ilk birimiyse (details: kart başlığı ya da ilk
  program satırı — başlık listenin dışında olduğundan boşluğun dağılacağı üst birim yoktu; RSVP: başlık) imzanın adımları:
  tam `--lift` (yatayda üst boşluk `--pt0 − lift`, önce `clamp(24px, …)` kaldırmayı 0–4 px'e indiriyordu), `.tight` (details:
  kâğıdın üst boşluğu 26 → 20cqw — unutmabeni 17,7cqw'de biter —, başlık ve satırların satır aralığı 1,25, kicker → mektup
  8 px), `--cw` %6 adımlarla ≥ 225 px; yine sığmazsa **bütün mektup** ilk ekranın 6 px altından başlar ve boşluk mektubun
  üstüne gider (kicker ≤ 72 px aşağı). Kenar boşluğu çöküşü için itme iki kez uygulanır (kicker'ın alt boşluğu mektubun
  üst boşluğuyla birleşiyordu). Ölçüm (QA'nın betikleri, 28 boyut × demo / aralık / zorlama × canlı / çubuk = 168 details
  ilk ekranı): önce yatayda 11 ilk ekranda yalnız başlık — canlı zorlama 640×360 107 / 180 px (ilk ekranda boş kâğıt /
  mektup içi aralık), 667×375 121 / 194, 740×360 107 / 180; çubukla demo ve aralık 640×360 / 740×360 72 / 145, zorlama
  640×360 / 740×360 71 / 144, 667×375 85 / 158, 844×390 99 / 172 → **0**: 640×360, 667×375, 740×360, 844×390'ın 24
  ekranının hepsinde başlık + en az ilk satır nav'ın üstünde, sonraki satır katlanır: 8–9 / 81–83 px (zorlama + çubuk
  640×360 / 740×360: `.tight` ve `--cw` 310 px). Bütün katlamalar (90): ilk ekranda 7–25 px (25: 320×568 zorlama, dikey,
  değişmedi), mektup içi 81–105 px. 568×320 (test boyutlarında değil): demo / aralık canlı sığar (`.tight`, `--cw` 258);
  çubukla ve zorlama kaydıyla bütün mektup katlanır (ilk ekranda kicker + zemin).
- Baş kümesi (`.page-corner.corner-tl`): başın yazılarına (story başlık/kicker/giriş, details kicker) değerse küçülür
  (`giveWay`; önce details 320×568 aralık "WEDNESDAY" %4,8).
- Story: `tiles` çerçeve genişliğini (`--fw`) ilk sıra nav'ın üstünde bitecek en büyük değere ayarlar (ikili arama;
  telefonda pencere ≥ 38vw → çerçeve ≥ 48,5vw; ≥ 720 px'te üçlü sıra ≥ 160 px); sığmazsa telefonda çerçeve tam boyda katlanır,
  geniş ekranda sıra **bir bütün** olarak katlanır (bir ekrana sığacak boyda) — tek ya da iki çerçeve asla kalmaz.
- Mektuplar yatay/geniş ekranda ilk ekrana sığacak genişlikte: details `--cw` (telefonda tam genişlik, ≥ 330 px), rsvp
  `--cw` (mektup + mühür, ≥ 270 px; masaüstünde de tek sütun, form altında — yan yana formun satırları nav'ın altından
  geçiyordu). Kâğıt bandı yuvarlaması 1,5 px toleransla (önce `offsetHeight`'in yukarı yuvarlaması 390 px'te fazladan bir
  çizgi bandı ekliyordu: RSVP mektubu 558 → 635 px).
- İç sayfalarda ilk ekran zemini (`.page-bg`, `--vh`): home'daki gibi harita çizgili parşömen (telefon) / bulanık sayfa
  (yatay), damga; yatay/geniş ekranda sağ altta `decor_br` (nav'ın 8 px üstünde biter). Önce iç sayfalar düz `bg_tile`'dı.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| harita çizgili parşömen | telefon: `bg_page`'in sakin sağ üst kırpımı; yatay/geniş: `mist` (bulanık bg_page) | |
| sol üst / sağ alt kuru çiçek + pul + sicim kümeleri | `decor_tl` / `decor_br` ayrı katman, ikisi de ekranda tam | |
| posta damgası halkası, sağ üstte yüzen çiçek | `.float.f-mark` (accent_3), `.float.f-flower` (accent_2, yavaş "nefes") | |
| "YOU ARE INVITED" | `.env-head .kicker` (daktilo) | |
| isimler | `h1.names` (Homemade Apple; `&` daktilo) | uzun isimde `site.js` küçültür |
| çizgili hava postası zarfı, pullar | `.env-open` (gövde) + `.env-strip` (delikli şerit) + `.env-torn` | |
| lavantalı bordo mühür, üst kenarın ortasında | `.closure` şeridin ortasında (comp oranıyla) | monogram (`initials`) mührün ortasında — comp'ta boş |
| "TAP TO OPEN" | `.env-hint` | |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| çizgili kenarlı kart, foto penceresi, "We're getting married", "OCTOBER 2, 2027 · HUDSON" | `.hero-card` (card_small + `hero_portrait`) | tarih ve şehir/bölge iki daktilo satırı (bölge uzun olabilir) |
| kartın sağ kenarına sıkıştırılmış kuru dal | `.tuck` (accent_2, unutmabeni) | **sapma:** comp'taki cipsofila dalı ayrı parça değil; en yakın parça |
| isimler | `h1.names` | W1.2 gibi tek satır (sığıyorsa ≤ %14 küçülür) |
| "SATURDAY · OCTOBER 2, 2027" | `.hero-date` | |
| "The Old Post House", "Hudson, New York" | `.hero-venue`, `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade daktilo rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| lacivert RSVP hapı | `.hero-cta .btn` | hap (arayüz): comp'taki koyu lacivert (`--navy` #2B3753, paletin `deep`'inden koyulaştırıldı; önce açık #3D4F7A "iOS düğmesi" gibiydi), ince krem iç çizgi |
| köşe kümeleri, sağ altta damga | `decor_tl` / `decor_br` (hero `scene-bg`), `.f-mark` | `decor_br` bütün (maske yok), nav'ın 8 px üstünde biter, hero parçalarına değerse küçülür (`corner`) |
| alt gezinme "HOME · STORY · DETAILS · RSVP" | `.site-nav`: daktilo satırı + yazı genişliğinde ince çizgi, kenarsız yumuşak zemin | **sapma:** comp'ta çizginin ortasındaki minik çiçek yok (ayrı parça değil) |
| — (comp yok) | mektup (invitation_card, tekrarlanan bant): host, tam adlar, "request the pleasure of your company as they marry", gün / AY gün YIL / saat, mekân, şehir; "Kindly reply by" + hap; takvime ekle; "Inside this letter" (story_1 pul çerçevesi + damga · günün mektubu `info_card` ilk 3 satır · monogramlı mühür, iki yana sırayla; aralarında sicim); "Until then, with love" + isimler + "Open the envelope again" | bu tasarımın parçaları ve dili |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| ahşap yazı masası, lamba ışığı | `body.page-desk` (bg_desk + aynası, `repeat-y`) + kenarsız ışık (`::before`: başlık üstünde sıcak ışık, kenarlara doğru koyu ahşap) | ışık CSS gradyanı (§5.7 izinli) |
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` (krem) | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| masaya dağılmış üç pul kenarlı çerçeve | `figure.stamp` × 3 (frame_portrait): telefonda zikzak tek sütun (sol, sağ, sol; −4°, +5°, −2,5°), ≥ 720 px'te **tek sıra** (yüksek, alçak, orta — comp'un dağınık dizilişi tek satırda) | **sapma:** comp'un 2 + 1 dizilişi masaüstünde ilk ekrana sığmıyor ve tek çerçeveyi yalnız bırakıyordu (qa dersi 4); telefon penceresi 64vw × 0,788 = 50,4vw, ilk ekrana sığdırırken ≥ 38vw; yan kaydırma yok |
| çerçevenin kâğıdında el yazısı başlık | `figcaption` çerçevenin altında, masada krem el yazısı | **sapma:** frame_portrait penceresi çerçevenin %80'i, kâğıtta başlık yeri yok; 60 karakterlik başlık sığmaz |
| 1. çerçevenin köşesinde posta damgası | `.postmark` (accent_3), çerçeve indikten sonra vurulur (`strike`) | |
| sağ üstte küçük pullar, aralarda kuru çiçek | `.acc-stamp` (accent_1) 2. çerçevenin yanında, `.acc-flower` (accent_2) 3.'nün yanında | |
| mürekkep hokkası, dolma kalem, zarf köşesi, cipsofila demetleri, sicim | — | **sapma:** ayrı parça yok (çizilmez); `decor_tl` başlıkta, `decor_br` sayfa sonunda |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| çizgili kenarlı "Order of the Day" mektubu, üstte unutmabeni | `.day-card` (info_card, tekrarlanan bant) + `h1.card-title` | kart içerikle uzar (1–10 satır), çizgiler gerilmez; yatay/geniş ekranda ilk ekrana sığacak genişlikte (comp'taki gibi mektubun tamamı görünür) |
| saat (kırmızı) · ETKİNLİK / yer | `.sched-row` (`.time`, `.label`, `.loc`) | |
| satır arası papatyalı sicim | `::before` GPT `divider` | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| pul kenarlı yatay çerçevede mekân fotoğrafı | `.venue-photo` (frame_landscape + `venue`) | **sapma:** comp'ta mektubun hemen altında, ilk ekranda; temada takvim bağlantılarından sonra, ilk ekranın altında — mektup ilk ekrana sığacak boyda ve program 1–10 satır uzayabildiği için ikisi telefonda birlikte sığmaz (yarım foto nav'ın altında kalırdı) |
| "The Old Post House", "Hudson, New York" | `.venue-name`, `.venue-text .kicker` (+ ülke, adres, tören cümlesi) | |
| "DRESS CODE · Cocktail attire" | `.dress` | **sapma:** comp'taki iki yan çizgi yerine üstte sicim (CSS çizgisi yok) |
| köşe kümeleri | `decor_tl` (başlık), `decor_br` (sayfa sonu) | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| çizgili kenarlı mektup, üstte unutmabeni | `.rsvp-card` (info_card, tekrarlanan bant) | |
| "Will You Join Us?" | `h1.card-title` (tek satır) | |
| "KINDLY REPLY BY", "AUGUST 21, 2027" | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| lacivert RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| papatyalı sicim | `.twine` (divider) | |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU" | `.wait` | |
| "With love," + isimler | `.love`, `.sign` | uzun isimde sarar |
| tabanda lavantalı mühür | `.card-seal` (closure + monogram), kâğıdın kardeşi (kart metni sayılmaz), alt kenarın üstüne biner | mühür (dal değil) ortalı; mektup + mühür ilk ekrana sığacak boyda (W1.5'teki gibi bütün mektup görünür) |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Bilinen sınırlar
- **İlk ekran, üçüncü QA (QA'nın `sweep`'i, 28 boyut — 568×320 ve 375×553 eklendi — × 3 kayıt × canlı / çubuk × 5 sayfa =
  840 yükleme):** nav'ın altında yarım parça 6 → **0** (672 nav'lı ilk ekran; eklenen 568×320'de önce 9 daha); details'te
  yalnız başlıklı mektup 11 → 0; index / story / rsvp'nin 468 yüklemesi önceki ölçümle birebir aynı. Ayrıntı yukarıda.
- **İlk ekran (ikinci QA'nın betikleriyle yeniden ölçüldü):** 4 sayfa × 18 boyut × demo/aralık/zorlama + 6 önizleme boyutu
  (çubuklu) × 3 kayıt = 288 ilk ekranda nav'ın altında yarım yazı/bağlantı/foto/görsel yok; nav bandında küme yok (önizlemede
  önce 18 ekranda `.page-bg` kümesi). RSVP imzası 72 ilk ekranın 53'ünde mühürle birlikte ilk ekranda (isimler ≥ 18,7 px);
  sığmadığı yerde (320×568 aralık/zorlama, 360/375 px zorlama, yatay telefonlar, zorlama 1280×650 / 1366×657) katlanır: ilk
  ekranda ≤ 14 px boş kâğıt, mektubun içinde 85–93 px aralık (nav bandı + 6 px); önizleme çubuğuyla 844×390'da "We can't
  wait" satırı da katlanır (hapın altında sicim; hap → nav 35 px, sicim → satır 82 px). Önce: 149–392 px boş kâğıt, 223–465 px
  aralık.
  Story ilk çerçevesi 320×568'de (ve aralık kaydıyla 360×640'ta) katlanır, ilk ekran başlık + giriş + masa; yatay telefonda
  story ilk ekranı yalnız başlık + giriş.
- Hero'nun sağ alt kümesi yazıya yer açmak için çoğu telefonda küçülür (297 yüklemenin 225'inde, medyan %78), dar ve uzun
  ekranlarda 10 yüklemede kalkar (320–340 px); masaüstünde ve yatay telefonda tam boy. Zarf sayfasında 138 küme yerleşiminin 18'inde küçülür (en çok %22, önizleme çubuğuyla 360×640).
- **Yazı tipi alfabesi:** Homemade Apple Google Fonts'ta yalnız `latin` (U+0000–00FF: "Élodie", "Zoë", "Müller" içinde);
  `latin-ext` harfleri (ł, ő, ş, ř …) el yazısında `Segoe Script` / `Bradley Hand` / `cursive` ile karışır. Special Elite
  `latin-ext` taşır. Görev fontları belirlediği için değiştirilmedi.
- Homemade Apple geniş bir el yazısı: isimler comp'taki ince kaligrafiden daha çok satıra sarar; `fitNames` küçültür (hero ≥ 36 px,
  zarf ≥ 20 px).
- Program en çok 10 satır (şema); Order of the Day mektubu uzar. Home'daki günün mektubu ilk 3 satırı gösterir.
- `story.items` 3'ten fazlaysa ilk 3 başlık. Monogram (`initials`) üç mühürde (zarf, home, RSVP) gösterilir; mührün içinde
  `max(11px, 15cqw)`.
- Link blokları yalnız linkleriyle; `rsvp.method` dolu → RSVP sayfası 404, ona giden her link (ve home'daki mühür + sicim) kalkar.
- Story sayfasının tarayıcı çubuğu rengi masa rengi (`#4A2E1C`), öteki sayfalar parşömen (`#E2CBAD`).
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz (docs/11 §3.1).
- Kontrast (token'lar, `tests/theme-vintage-airmail-love-letter.test.ts`): mürekkep 9:1, küçük daktilo `--ink-soft` 6,4:1
  parşömende / 8,6:1 kâğıtta, el yazısı `--pen` 9,4:1, kırmızı saat `--red-ink` ≥ 5,2:1, hap etiketi 10,8:1; masadaki krem yazı
  masanın ortalama tonuna karşı ≥ 4,5:1 (üstüne koyulaştırma katmanı + yazı gölgesi). Mühür monogramı bilerek kabartma tonunda
  ve yardımcı teknolojiden gizli; zarf içindeki küçük kart `aria-hidden`. **Masada boyalı zeminde ölçüm (ikinci QA):** önceki
  "hepsi ≥ 4,5:1, en düşük 4,75:1" iddiası yanlıştı — QA'nın ölçümü (yazı saydam, öğe kutusunun zemininin en kötü %5'i,
  gölgesiz / gölgeli) "MOMENTS WE HOLD DEAR" 2,25 / 2,69 (390×844), 1,74 (1280×720), giriş 2,73 / 3,28, başlıklar 2,8 / 3,2,
  "Our Story" 2,4 / 2,8 buldu (masanın lamba ışığı başlığın arkasında). Şimdi: başlık ve kicker yazı genişliğinde kutu, kicker
  14 px, her krem yazının arkasında kenarsız koyu gölge (`::before`, `radial-gradient(closest-side …)`, §5.7) → aynı ölçümde
  390×844 / 1280×720 / 360×640 / 1440×900 / 844×390: "Our Story" en kötü %5 ≥ 5,48:1, kicker ≥ 5,81, giriş ≥ 4,81, başlıklar ≥ 5,71
  (gölgesiz; gölgeyle 6,91 / 6,86 / 5,83 / 5,75).
- Yazı tabanı: görünen her metin ≥ 11 px (kart kopyası, mühür monogramı, mektuptaki küçük satırlar, geri sayım etiketleri,
  zarf başlığı küçülünce `&`). Android'de dokunma dikdörtgeni yok (`-webkit-tap-highlight-color`), odak halkaları duruyor.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `clip-path` animasyonu, `ResizeObserver`, view transition),
  Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
