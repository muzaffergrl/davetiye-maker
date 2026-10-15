# Tema: ivory-lace-pearls (tasarım 14 · Ivory Lace & Pearls, G414)

Kraliyet zarafeti: inci parlaklığında fildişi saten zemin (sol üstten pencere ışığı, çapraz yumuşak gölgeler), sol üst ve sağ
alt köşede fildişi dantel + inci dizileri + beyaz bahçe gülleri, sağ üstte inci damla, gül yaprağı ve saten fiyonk; kapanış
elemanı ortadaki dikişin üstünde beş incili gümüş-altın broş olan, iki kapısı dantel kaplı fildişi gatefold dosya. Mrs Saint
Delafield (bakır gravür el yazısı: isimler, başlıklar, alt yazılar) + Bodoni Moda (yüksek kontrastlı serif: aralıklı büyük harf
satırları, italik mekân/yer satırları, sayılar, gövde). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi
`platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından
(`collections/14_Ivory_Lace_Pearl/assets/gpt/comps/web_1..5`, yalnız sade adlar); bütün görseller bu tasarımın GPT
parçaları (K21). 06 (art-deco-black-tie, ilk gatefold teması) ve 04/05/08 temalarından yalnız platform sözleşmesi ve çözülmüş
sorunlar alındı (motor işaretleri, RSVP formu + G051 soruları + G069 misafir adları, `#site-data`, slug'lı oturum anahtarları,
`data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` + `folds` ilk ekran adımları, yatay telefon ızgarası,
`devRender`, teşekkür hâli, data-copy manifesti, gatefold kesim/hiza yöntemi, `bg_tile` dikiş onarımı); görünüş, aralıklar, süs
konumları, zamanlama, kart oranları, bölüm sırası ve açılış bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Ivory Lace & Pearls", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 copy anahtarı |
| `content.demo.json` | `collections/14_Ivory_Lace_Pearl/content.demo.json`'ın birebir kopyası (`/start?theme=ivory-lace-pearls` ve tema demosu; servis edilmez) |
| `index.html` | kapalı dantel gatefold → dokun → inci broş çözülüp dikişten aşağı kayarak gider, dantel kapılar tül kaldırılır gibi yavaşça yanlara aralanır, kart saten ortadan yükselirken alttaki ince inci dizisinde ışık parlar, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + oval foto penceresi, "We're getting married", tarih · şehir; isimler, gün · tarih, inci dizisi, mekân + yer italik, geri sayım, şampanya-taupe RSVP hapı), davet kartı (invitation_card 3 dilim, gravür tarih), tek "Kindly reply by" satırı, takvime ekle, iki asılı inci çerçeve (frame_portrait + story_1 → Our Story, frame_landscape + mekân → The Day + programın ilk 4 satırı), kapanış |
| `story.html` | W1.3: başlık + alt başlık + inci dizisi + giriş cümlesi; inci dizilerine asılı üç oval çerçeve (dizi uzunlukları farklı: soldaki en yüksekte, ortadaki en aşağıda), her biri görünüme girerken yukarıdan inip dizisinin ucunda hafifçe salınarak durur, sonra oyma fildişi ve incilerin üstünden bir ışık geçer; alt yazı + küçük inci dizisi |
| `details.html` | W1.4: gün · tarih, Order of the Day kartı (info_card 3 dilim; saat \| etkinlik / yer italik, satır aralarında GPT inci dizisi), takvime ekle, mekân (GPT geniş oval çerçeve), mekân adı (script) + yer (italik), inci dizisi + dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS, RSVP |
| `rsvp.html` | W1.5: RSVP kartı (info_card 3 dilim) + kartın alt kenarında inci broş (closure); platform yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`descend`, `glint`, `rest` bu tasarımın), foto alanı + maske, gatefold katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (G075): kart penceresinde teşekkür fotoğrafı ya da fildişi saten + inci broş, teşekkür kartı |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, `OPEN_FRAC`, uzun isim + ilk ekranlar (`fitNames`, `fold`, `folds`, `tiles`, zarf sayfası `envFit`), dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, gatefold açılışı, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar (`door_l/r`, `door_l/r_in`, `center`, `pocket`, `closure`, kartlar, çerçeveler), `decor_*` 320/480/720, `mist` (saten), `bg_tile`, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 438/604 | card_small'un dik oval penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 437/598 | frame_portrait'in oval penceresi (story; `story_1` home çerçevesinde de) |
| `venue` | `media.venue_image` | 1072/576 | frame_landscape'in geniş oval penceresi (details; home çerçevesinde de) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` 50% 45%
(oval), mekân 50% 55%. Oval pencereler ≈ 0,73:1: 2:3 portre fotoğraf üstten/alttan biraz kırpılır; mekân penceresi ≈ 1,86:1 (3:2
fotoğraf üstten/alttan ~%19 kırpılır). "Your photo here" yalnız önizlemede (`html[data-preview="true"]`); misafir nötr yer
tutucuyu (bg_page'in çiçeksiz saten bölgesinden bulanık, fildişine %30 tonlanmış kırpım) görür. `build_images.py` her yer
tutucu kırpımının yerel kontrastını ölçer (`manifest.ph_*.max_busy` ≤ 9: dantel/gül yok; aşarsa çıkış ≠ 0).

## Görseller (`python3 platform/themes/ivory-lace-pearls/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre** (alfa kırpma, #00FF00 pencereleri + leke dolgusu, `windows.json`). G214'ün açık kusuru
  (frame_landscape penceresinde saydam/koyu leke): `leke_doldur` pencereyi tam şeffaf yapar (`leke_px` 11 200);
  `foto_alani` her WebP'de tam pencerede görünür piksel kalmadığını denetler (`manifest.checks.windows_transparent`: hepsi 0).
  frame_portrait'te leke parts_prep sonrası kalmadı (`leke_px` 0, gözle de bakıldı). Pencere çevresindeki 3 px ayrıştırma
  saçağı çerçeve renginden; dış hatta yarı saydam hâle temizlenir; WebP kenar saçağı için şeffaf piksellere komşu renk taşınır.
- **Dikiş** (kapalı dosya): iki dantel kapı arasındaki ince düz boşluğun ortasındaki koyu temas çizgisi — `tema_build.dikis_bul`
  burada doğru (**x 769,5** = kutu ortası, `method: renk`). **Katlanma çizgileri** (açık dosya): kapı içi ile orta panel
  arasındaki koyu ince çizgi — `tema_build.kat_bul` (**443,5 / 1087,5**). 06'daki gibi ayrı bir ölçüm gerekmedi.
- **Hiza** (`kit_check` UYARI: üst +0,59 · alt 0 · sol kat +1,99 · sağ kat −2,51 %): GPT'nin açık dosyasında orta panel kapalı
  dosyadan **%9,7 dar** (644 / 713 px), kapı içleri ise kapalı kapı yarılarıyla aynı genişlikte (360 / 356). Tek bir ölçek ya kapı
  içlerini %10 büyütür ya da menteşelerde boşluk bırakır; bu yüzden **ölçülen dönüşüm parça başına** (`manifest.stage.align_fix`):
  orta panel yatayda × 1,1071 (kapalı genişliğe), dikeyde × 1,0067 (üst/alt alfa kenarına); kapı içleri yalnız × 1,0067 (en-boy
  korunur) ve katlanma kenarları kapalı dosyanın sol/sağ kenarına ötelenir. Sonra: katlar, menteşeler, üst ve alt 0 px
  (`align_fix.after_px`). Bedeli: orta paneldeki cep danteli yatayda %10,7 gerilir (incileri hafif oval; telefonda okunmuyor).
  Ham hiza ölçümü `manifest.stage.align` (`tema_build.hiza_olc`).
- **Kesimler** (docs/11 §7.4): kapalı → `door_l` / `door_r` (dikişten, 1 px yumuşak); açık → `door_l_in` / `center` /
  `door_r_in` (katlanma çizgilerinden, dönüşümden önce). **Orta cep** (`cep_dantel`): düz üst kenar çizgisi + iki köşede onun
  üstüne çıkan dantel. `tema_build.cep_kes("duz")` köşe dantelini aykırı sayıp cebin dışında (kartın arkasında) bırakırdı;
  burada her sütunda panelin düz kağıdından aşağı inilip ilk kalıcı renk sapması kenar (altın kenar çizgisi bandı taranmaz,
  en yakın iç sütundan alınır; 7 sütun medyanı; düz çizginin ± 6 px'i tek satıra — kağıt dokusu kartın önünde tırtıklı kenar
  gibi okunurdu). Düz kenar y 669, köşe dantelinin tepesi y 639 (`manifest.stage.cuts.pocket`). Kesilen parçalar kaynakla
  örtüşüyor (`manifest.stage.checks.*_overlap_diff` ≤ 0,01).
- **Kapanış** (`closure.png` = beş incili gümüş-altın broş + kısa inci dizisi, kare tuvalde büyük çizildi; kapılarla **taşınmaz**):
  yeri kesim geometrisine bağlı — çapa = dikiş sütunu, yükseklik W1.1'de ölçülen ("fastened over the center seam at
  mid-height"): comp'ta dosya x 222–799 (577), y 472,5–1189 (716,5), broşun metal kolları x 451–573 (122), ortadaki küçük
  incinin merkezi (512, 812) → metal genişliği / dosya genişliği **0,2114**, merkez dosya yüksekliğinin **0,4738**'inde. Aynı
  ölçü closure.png'de (metal kolları x 260–990, küçük inci (625, 585)) — 4× büyütülmüş kırpımlarda okundu, `build_images.py`
  `COMP` / `CLOSURE`. Broşun hareket merkezi küçük inci (`transform-origin`). `previews/g414/compare_closure.jpg`: tema | comp.
- **Kart** (card_small) dosya genişliğinin 0,80'i, orta cebin arkasında; cepte beklerken yalnız kartın üst %8,5'i (oval
  çerçevenin gül tepesi) cebin düz kenarının üstünde (foto penceresi kartın %13,9'undan başlar: yüzler cep kenarıyla kesilmez).
  `out` = alt köşeler cebin kenarını kartın %4'ü aşmış; `front` = olduğu yerde %2,5 aşağı + × 1,06 + büyüyen gölge → home
  kartına yukarı uçar (`stage.card_path`).
- **Sahne kutusu** = kapalı + hizalanmış açık + kart yolu + kapanış alfa kutularının birleşimi (1445 × 1223 tuval px, oran
  1,181). Kapalı dosya sahne genişliğinin 0,493'ü: telefonda sahne ekrandan geniştir (açılınca yanlara gidecek kapı içleri),
  `.env-page` `overflow-x: clip` ile kesilir. Açılışta sahne `--os` = min(1, 0,94 × 100vw / sahne genişliği) ile kapalı dosyanın
  merkezi etrafında küçülür (docs/11 §7.1; açık nesne = sahne genişliği, `open_obj.frac_w` 1): 390 px'te × 0,63.
- **Zemin**: bg_page'in köşe kümeleri telefonda `cover` ile kesilirdi → ilk ekranların zemini bg_page'in **çiçeksiz orta
  bölgesi** (16 px blok yerel kontrastla bulunan en büyük dikdörtgen x 176–800, y 336–1200; saten + pencere ışığının çapraz
  gölgeleri) `mist-640` (2 px bulanık, 2 KB); kümeler ayrı katman (`decor_tl` / `decor_br`), ekranda bütün. Uzun sayfalar:
  `bg_tile` (GPT karosu dikişsiz değildi: ikinci derece eğim düşülür, kenarlar yarım kaydırılmış kopyadan — 06'nın yöntemi; renk
  saten bölgesinin ortalamasına, `#F1E7DE` = `page_color`).
- Kartlar: `free_zone` + 3 dilim (`slices`: davet kartı %44–80 — gül kümesi ve incileri sol kenardan %44'e kadar sarkıyor;
  info kartı %13–97). og: `web_hero` alt hizalı 1.91:1 (dosya + broş ortada tam görünür); favicon: closure. Tema klasörü
  ~1,8 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the pearl clasp unhooks and slips away, the lace-covered doors part slowly to the sides like a
  lifted veil, and the card rises from the satin center while a strand of tiny pearls glints."): dokununca "Tap to open" söner,
  dosya hafifçe bastırılır; **broş** çözülür — izleyiciye doğru kalkar (× 1,1, eğilir, gölgesi genişler; 0–0,3) — sonra dikiş
  boyunca aşağı kayıp söner (0,3–0,86; 80–1030 ms). 650 ms'de iki **dantel kapı birlikte** (kademesiz) menteşelerinde yavaşça
  yanlara aralanır (0 → ∓90°, 950 ms) ve hafifçe yukarı kalkar (−%1,6: tül kaldırılır gibi), dönerken ışıktan uzaklaşıp biraz
  söner; 90°'de dantel astarlı iç yüzler −/+90° → 0° devralır (850 ms); aynı sürede sahne açık dosyayı ekrana sığdıracak kadar
  küçülür (`--os`). **Kart** saten ortanın cebinden yükselir (2,3 s) ve **aynı anda** "Tap to open"ın altındaki ince inci
  dizisinde (GPT `divider`) kenarsız bir ışık bandı soldan sağa geçer, dizi hafifçe parlar (`MOTION.envelope.glint`; ışık
  dizinin kendi biçimiyle maskeli); kart olduğu yerde öne gelir (3,5 s, × 1,06, büyüyen gölge) ve view transition ile home
  kartına uçar. Dokun → home 4,25 s (Skip her an). Açılışta parçacık yok: cümle tür/sayı söylemiyor (docs/11 §8), parıltı ışıktır.
- **Story:** her çerçeve kendi sahnesi: görünüme girince yukarıdan iner ve dizisinin tepesi etrafında hafifçe salınarak durur
  (`descend`: `translate3d(0, −30%) rotate(−3°)` → yerinde, aşma eğrili 1,8 s); 1,3 s sonra oyma fildişi ve incilerin üstünden
  bir ışık bandı geçer (`glint`, çerçeve + pencere maskeli), alt yazı yazılır, küçük inci dizisi açılır. Dizi uzunlukları farklı
  (W1.3 "descending to slightly different heights"): her kartta GPT parçasının dizisi üstten `--cut` kadar kırpılır
  (`clip-path`, yalnız üst; soldaki .16, ortadaki 0, sağdaki .07) → masaüstü sırasında dizilerin tepeleri bir hizada, ovaller
  soldaki en yüksekte, ortadaki en aşağıda (comp). Telefonda zikzak (sol, sağ, sol): her çerçeve 58vw (pencere 38,9vw ≥ 38vw);
  her dizi yukarıdaki çerçeve ve alt yazısının yanında yükselir, oval onların altından başlar.
- **Parçacıklar** (`MOTION.accents`): home'a varış 2 beyaz gül yaprağı (accent_2, `fall`: yavaşça salınarak düşer) · RSVP
  kapanışı 3 yaprak; katman bölümün içinde ve metnin arkasında (`host`), yollar yazı sütununun yanındaki şeritlerde (`avoid`);
  şerit yoksa yaprak doğmaz.
- **Boyalı kartlar** (davet, Order of the Day, RSVP): `set` girişi — kart konur gibi kayar, **hep opak** (theme-check'in kart
  piksel testi gerçek kartı ölçer); metinleri sırayla girer. RSVP kartının broşu `rest` ile yerine oturur. Köşe kümeleri
  köşelerinden büyüyerek (`glide-*`) girer. Mekân çerçevesi `glint` ile girer.
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms (`rsvp-card` `clasp` 2900), tek giriş 600–1800 ms.

## İlk ekranlar ve yatay telefon
04/05/06'nın çözülmüş adımları korunur: `fitNames` (isimler küçülür → `.is-tight` → `.is-long` (sayaç hapın altına) → hero
kaydırılır; isimler ≥ 32 px = `manifest.theme_check.first_screen.names_min_px`), ardından `fold` (nav'ın altında yarım parça
yok). `.is-tight` bu tasarımda satır aralarını ve mekân/sayaç boyunu da sıkar (375×553'te demo kaydıyla bütün hero nav'ın
üstünde biter). Hero kartı en az 136 px (kartın kopyası ≥ 11 px; `fitCopy`: tarih · şehir tek satır, sığmazsa iki satır, sonra
şehir, sonra "We're getting married" düşer). Kısa yatay (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px) ızgara: kart solda,
isimler · tarih · inci dizisi · mekân · yer · sayaç · hap sağda.

**İç sayfalar** (`folds`): her ilk ekran birimi ya nav'ın üstünde biter ya da ilk ekranın tamamen altında başlar. Birimler
`[data-fold]`: story'de alt başlık, giriş, her çerçeve (masaüstünde üçü birlikte `.tiles`); details'te gün · tarih, kart başlığı,
her program satırı, takvim, mekân fotoğrafı, mekân yazısı, dress code, harita; rsvp'de başlık, "Kindly reply by" + tarih, hap,
bekleme satırı, imza birimi ("With love," + isimler + broş; önce `--sg` 1 → 0,72 küçülür), form satırları, kapanış. 390×844'te
story'nin ilk çerçevesi (dizisi .16 kırpık) giriş cümlesinin altında ilk ekrana sığar.

**Zarf sayfası** (`envFit`): "Tap to open" + inci dizisi (açıkken Replay) ilk ekranda bitmiyorsa sahne küçülür (`--ok`, en az 0,6).
Yatayda isim sütunu köşe kümelerinin arasında; açık hâlde dosya ile Enter / Replay yan yana.

**Gezinme:** etiket satırı opak (`rgba(246, 240, 233, .97–.98)` + `backdrop-filter: blur(8px)`), üst kenar 12 px'te yumuşak
belirir; etiketlerin üstünde GPT inci dizisi (`divider`). Sayfalar arası geçişte nav bütün gelir
(`::view-transition-new(site-nav):only-child { animation: none }`); zarfa dönüşte eski nav çizilmez.

## Dekor ve metin (`site.js` `decor`)
Köşe kümeleri **hep bütün** GPT parçası (maske/kırpma yok); yazıya ya da boyalı karta (`.paper`) değecekse 16 × 16 alfa
haritasıyla (`MAP`, bu tasarımın decor_tl/br'sinden ölçüldü) %6 adımlarla küçülür (en çok %45), yine değiyorsa gizlenir. Küçük
parçalar (inci damla, yapraklar, fiyonk) yazıya, karta, çerçeveye ya da kapalı dosyaya değerse gizlenir. Zarf sayfasında inci
damla Skip'in altında durur.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| inci parlaklığında saten zemin, çapraz pencere ışığı | `body` `bg_tile` + `.scene-bg::before` (`mist`) + `body::before` (sol üstten ışık) | mist = bg_page'in çiçeksiz kırpımı |
| köşe kümeleri sol üst, sağ alt (dantel, inci, gül) | `.corner-tl` / `.corner-br` (decor_tl / decor_br) | ekranda bütün |
| inci damla, gül yaprağı (sağ üst), saten fiyonk (sağ), yaprak (sol alt) | `.f-drop` / `.f-petal` / `.f-bow` / `.f-petal2` (accent_1/2/3/2) | yazıya değerse gizlenir; comp'taki damlanın zinciri parçada yok |
| "YOU ARE INVITED" | `.env-head .kicker` (Bodoni aralıklı büyük harf) | |
| isimler (bakır gravür el yazısı) | `h1.names` (Mrs Saint Delafield), `&` italik Bodoni | uzun isimde `fitNames` küçültür |
| dantel kaplı iki kapılı fildişi gatefold | `.door-l` + `.door-r` (kapalı görselin dikişten kesimi) | |
| dikişin ortasında inci broş | `.closure` (kapılardan ayrı) | ölçü ve yer comp'tan (manifest.closure) |
| "TAP TO OPEN" + küçük ayırıcı | `.env-hint` + `.hint-orn` (GPT divider: inci dizisi + fiyonk) | **sapma:** comp'taki ayırıcı ince çizgi + baklava; GPT divider inci dizisi (açılışta parlayan "strand of tiny pearls" o); masaüstünde "Click to open" |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| fildişi kart, oyma oval pencere, "We're getting married", "JUNE 5, 2027 · NEWPORT" | `.hero-card` (card_small + `hero_portrait`, `.card-line`, `.kicker`) | kart yazısı `venue.city` (comp gibi yalnız şehir; docs/11 §3.2 `venue.city_region` der — **sapma**, comp'a uyuldu); dar kartta iki satır (`fitCopy`) |
| isimler (script) | `h1.names` | |
| "SATURDAY · JUNE 5, 2027" | `.hero-date` | |
| küçük ayırıcı | `img.names-orn` (GPT inci dizisi) | comp'ta çizgi + baklava (yukarıdaki sapma) |
| "Ashbury Manor", "Newport, Rhode Island" (italik serif) | `.hero-venue`, `.hero-city` (`venue.city_region`) | |
| dört kutulu geri sayım | `.countdown` sade Bodoni rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| şampanya-taupe RSVP hapı, fildişi yazı | `.hero-cta .btn` | arayüz hapı: taupe degrade + ince iç ışık (katalog "buton"); **sapma:** comp'unkinden koyu — fildişi yazı ≥ 4,5:1 kontrast için |
| alt gezinme | `.site-nav` (GPT inci dizisi + aralıklı yazı) | |
| köşe kümeleri, inci damla, yaprak, fiyonk | hero `.scene-bg` | |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim: üstte dantel + sol üstte gül kümesi ve sarkan inciler, altta dantel; host line, tam adlar (script), "request the pleasure of your company at the celebration of their marriage" (italik), gravür tarih (gün / ay · büyük gün rakamı · yıl / saat), mekân, yer), "Kindly reply by" + RSVP, takvime ekle, iki asılı çerçeve (`frame_portrait` dizisiyle + story_1 → Our Story; `frame_landscape` + mekân → The Day + programın ilk 4 satırı), "With love" + isimler + "Open the invitation again" + `decor_br` | bu tasarımın parçaları ve tipografisi; metin sütunu kartın sarkan incilerinin sağında (%40'tan) başlar |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story" (script), "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.head-orn` (inci dizisi), `.lede` (story.intro + tarih, italik) | standart zorunlu giriş |
| inci dizilerine asılı üç oval çerçeve, farklı yüksekliklerde | `.tiles .tile` (frame_portrait, `--cut` ile kısaltılmış diziler) | ≥ 900 px comp'un sırası (soldaki en yüksek, ortadaki en aşağıda); **sapma (docs/11 §9):** telefonda yan yana pencere ~20vw olurdu (< 38vw): zikzak (sol, sağ, sol), her çerçeve 58vw |
| alt yazılar (script) + küçük ayırıcı | `figcaption.script` + `.cap-orn` (GPT inci dizisi) | |
| çerçevelerin arasındaki küçük süsler (yaprak, inci) | — | **sapma:** zikzakta boş yer kalmıyor; yalnız ilk ekranda inci damla + yaprak (`.page-bg`) |
| köşe kümeleri, inci damla, yaprak | `.page-bg` ilk ekranda, `decor_br` sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| dantel kenarlı uzun fildişi kart, "Order of the Day" (script) | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar (1–10 satır) |
| saat \| etkinlik / yer (italik) | `.sched-row` (saat solda, etkinlik + altında italik yer) | comp'la aynı dizi |
| satır arası inci dizisi + dantel fiyonk | `::before` GPT `divider` | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| geniş oval oyma çerçevede mekân fotoğrafı | `.venue-photo` (frame_landscape + `venue`) | `glint` girişi |
| "Ashbury Manor" (script), "Newport, Rhode Island" (italik) | `.venue-name`, `.venue-place` (+ adres, tören cümlesi) | yer `venue.city_region_country` (ülke de) |
| ayırıcı + "DRESS CODE · Black tie optional" | `.dress` (`.dress-orn` + büyük harf etiket + italik değer) | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| dantel kenarlı fildişi kart | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?" (script) + küçük ayırıcı | `h1.card-title` + `.card-orn` | uzun metinde iki satır |
| "KINDLY REPLY BY", "April 24, 2027" (italik) | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| şampanya-taupe RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| ayırıcı, "WE CAN'T WAIT TO CELEBRATE WITH YOU", "WITH LOVE," + isimler (script) | `.orn-2`, `.wait`, `.love`, `.sign` | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür (`--sg` ≥ 0,72) |
| kartın tabanında inci broş | `.sig-unit > .card-clasp` (closure) | `rest` girişiyle yerine oturur; imza birimiyle birlikte katlanır |
| köşe kümeleri, inci damla, yaprak | `.page-bg` | |
| alt gezinme | `.site-nav` | |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075)
Düğünden sonra aynı sayfalar `data-if="thank_you_on"` ile teşekkür hâline döner; yeni sayfa ve yeni görsel yok (K21):
- **Zarf:** açılış şovu aynen; üst satır "With love and thanks" (`ty_kicker`); kartta teşekkür başlığı (script, dengeli sarar) +
  tarih; " · şehir" yok. Kart penceresinde teşekkür fotoğrafı; yoksa **fildişi saten üstünde dosyanın inci broşu** — asla yer tutucu.
- **Home:** hero kartı zarfla aynı; isimler, tarih, mekân kalır; geri sayım ve RSVP hapı yok. Davet kartının yerine aynı
  `invitation_card` kâğıdında (3 dilim) teşekkür kartı: başlık, çiftin mesajı (`white-space: pre-line`, italik), "With love,",
  isimler, tarih. Yanıt satırı ve takvime ekle yok; çerçevelerde Our Story ve The Day kalır (çift Details'i gizlerse The Day yok).
- **Details:** "The Day" olarak kalır; takvim, dress code, Travel & Stay, SSS ve RSVP linki yok; tören cümlesi geçmiş zaman.
  Çift gizlerse sayfa 404 ve hiçbir link yok.
- **RSVP:** kartta "Replies are closed" + teşekkür başlığı + Home hapı + imza birimi; form yok.
- **Nav:** Details etiketi "The Day" (`nav_day`), RSVP yok. Stiller `thank-you.css`'te (yalnız teşekkür modunda yüklenir).

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar, `theme.json` → `copy`; `node scripts/copy-manifest.ts --theme
ivory-lace-pearls --check` temiz). `max` değerleri `theme-check --stress` ile (her anahtar `max`'ta, 360/390, teşekkür hâli dahil)
doğrulandı: gezinme 6/6/7/5 (`nav_home`/`nav_story`/`nav_details`/`nav_rsvp`; 8 harfte satır 360 px'e sığmıyordu), teşekkür
hâlinde `nav_day` 8 (üç etiket); sayaç etiketleri 7 (`cd_*`). Ana sayfa kapanışındaki "With love" (`foot_kicker`) ile kartlardaki
"With love," (`love_line`) ayrı anahtar. Bilerek sabit: iç sayfaların `description` meta cümleleri, bölge `aria-label`'ları,
"Please turn on JavaScript…" (`data-copy-fixed`), platform mesajları (`[data-rsvp-message]`). Formda "Number of guests"in hemen
altında `<template data-rsvp-party>` (G069): formun kendi `.field` / `.kicker` / `.opt` stilinde.

## Bilinen sınırlar
- Mrs Saint Delafield küçük x-yükseklikli bir el yazısı: 32 px altında okunmaz (`names_min_px` 32); kart yazısı ve alt yazılar
  bu yüzden büyük punto. İki aile de `latin-ext` taşıyor (Google Fonts CSS'i denetlendi); script'in yedeği yüklü Bodoni Moda.
- Kapı katmanları kaynakta 358–370 px genişlikte (GPT tuvalinde dosya 713 px): DPR 3 telefonda (kapı ~145 px → 435 px gerekir)
  hafif büyütülür; dantelde fark edilmiyor.
- Orta paneldeki cep danteli hiza için yatayda %10,7 gerildi (yukarıda).
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim). `story.items` 3'ten fazlaysa ilk 3 başlık; anların
  `text`'i gösterilmez. Monogram (`initials`) bu tasarımda kullanılmaz: broşun ortası inci (boş mühür değil).
- 360×640 ve 375×553'te story'nin ilk çerçevesi ilk ekranın altından başlar (sığmıyor; fold kuralı); yatay telefonlarda iç
  sayfaların ilk ekranı başlık + ilk satır(lar)la biter.
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, kesişen belge view transition, 3B `rotateY` +
  `backface-visibility`, `clip-path` + `aspect-ratio` ile kırpılan diziler), Vercel yayını, gerçek alıcı fotoğrafları (farklı
  oran/ışık), yavaş ağ.
