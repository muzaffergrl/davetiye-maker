# Tema: wildflower-meadow-vellum (tasarım 18 · Wildflower Meadow Vellum, G418)

Yaz çayırı: krem → soluk çayır yeşili sis, alt kenarda bulanık kır çiçekleri; sol üst ve sağ alt köşede renkli kalem
(colored-pencil) kır çiçeği kümeleri (gelincik, peygamber çiçeği, papatya, lupin, başaklar); sağda süzülen bir gelincik
yaprağı, bir peygamber çiçeği, bir papatya. Açılış nesnesi: buzlu yarı saydam **vellum kılıf**, üst ağzının hemen altında
deckle kenarlı yuvarlak kır çiçeği etiketi. Satisfy (el yazısı: isimler, başlıklar, alt yazılar) + Spectral (aralıklı büyük
harf satırları, italik mekân/yer satırları, sayılar, gövde). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform
sözleşmesi `platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından
(`collections/18_Wildflower_Vellum/assets/gpt/comps/web_1..5`); bütün görseller bu tasarımın GPT parçaları (K21). 08
(winter-evergreen) temasından yalnız platform sözleşmesi ve çözülmüş sorunlar alındı (motor işaretleri, RSVP formu + G051
soruları + G069 misafir adları, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları,
`fitNames` + `fold` + `folds` ilk ekran adımları, yatay telefon ızgarası, `devRender`, teşekkür hâli, data-copy manifesti, kart
3 dilim, dekor–metin `decor`); 14'ten `bg_tile` dikiş onarımı. Görünüş, aralıklar, süs konumları, zamanlama, kart oranları ve
açılış (kılıf tipi, docs/11 §7.7 — platformdaki ilk kılıf teması) bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Wildflower Meadow Vellum", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 copy anahtarı |
| `content.demo.json` | `collections/18_Wildflower_Vellum/content.demo.json`'ın birebir kopyası (servis edilmez) |
| `index.html` | kapalı vellum kılıf → dokun → etiket soyulur, kılıfın ağzı açılır, kılıf karttan aşağı kayıp söner, kart kalkar (gelincik yaprakları uçuşur), öne gelir → home (view transition) |
| `home.html` | hero (W1.2), davet kartı (invitation_card 3 dilim), tek "Kindly reply by" satırı, takvime ekle, iki foto kartı (story_1 vellum altında → Our Story; mekân → The Day + programın ilk 4 satırı), kapanış |
| `story.html` | W1.3: başlık + alt başlık + giriş; üç foto kartı, her birinin vellum örtüsü alt kenarından kalkıp gider; alt yazılar; kartlar arasında peygamber çiçeği / papatya |
| `details.html` | W1.4: gün · tarih, Order of the Day (info_card 3 dilim, satır arası GPT divider), takvime ekle, mekân kartı, mekân (script) + yer (aralıklı büyük harf), dress code, linkler, SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card 3 dilim) + alt kenarında kılıfın etiketi; yanıt formu (G042 + G051 + G069), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`grow-tl/br`, `settle`, **`lift-veil`** bu tasarımın), foto alanı + maske + vellum örtü, kılıf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (G075; yalnız düğünden sonra yüklenir) |
| `site.js` | `MOTION`, `ENVELOPE_GEOMETRY`, `fitNames`/`fold`/`folds`/`row`/`envFit`, `decor` (MAP = manifest `decor_map`), `fitCopy`, geri sayım, kılıf açılışı, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar (`sleeve_body`, `sleeve_band`, `sleeve_open_band`, `closure`, kartlar, çerçeveler, `vellum_overlay`, `florals_*`, `divider`, `accent_1..3`), `meadow` / `meadow_wide` / `meadow_foot`, `bg_tile`, `ph_*`, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 293/428 | card_small'un dik penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 553/717 | frame_portrait penceresi (story; `story_1` home kartında da) |
| `venue` | `media.venue_image` | 710/456 | frame_landscape penceresi (details; home kartında da) |

Foto çerçevenin altında, kutu = pencere + 2 px, maske `mask_<şekil>.png`. `object-position` portre 50% 38%, mekân 50% 55%
(mekân penceresi 1,56:1 ≈ 3:2). "Your photo here" yalnız önizlemede; misafir nötr yer tutucuyu görür (bg_page'in kümesiz krem →
çayır sisinden bulanık, fildişine %32 tonlanmış kırpım; `manifest.ph_*` en koyu ≥ 190, doygunluk ≤ 30 denetlenir).

## Görseller (`python3 platform/themes/wildflower-meadow-vellum/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `parts_prep` geçici klasöre. Pencerelerde leke yok (`leke_px` 0); her WebP'de pencere tam şeffaf (`checks.windows_transparent`).
  parts_prep'in `envelope_pocket_front.png`'si kılıf tipinde anlamsız, kullanılmaz (docs/11 §5.3).
- **Kılıf şeridi** (§7.7 `flare`): GPT'nin kapalı ve açık kılıfı aynı tuvalde, **alfaları aynı** — fark yalnız ön panelin üst
  kenarında (açıkta orta sütunda 13 px daha derin, RGB'de). `tema_build.kilif_serit` yalnız alfa farkına baktığı için burada
  7 px'lik anlamsız bir şerit bulurdu; `serit_bul` RGB + alfa farkıyla: fark satırları 500–650, kesim **y 659** (kılıfın
  %18,2'si, `method: renk`). Gövde (`sleeve_body`) tek nesne; şerit ve gövde örtüşmez; parçalar iki kılıfı da geri kurar
  (`stage.checks` ≤ 0,01). Hiza (`kit_check`): sol −0,10 · sağ 0 · alt 0 % → dönüşüm yok.
- **Saydamlık:** GPT kılıfı opak çizdi → `.sleeve` sarmalayıcısı tek grup `opacity: .8` (comp "about 80 %"; docs/11 §7.7
  .82–.9 aralığının hemen altı — kart comp'taki gibi seçilsin diye). Kart kılıfın arkasında `blur(1.3px) saturate(.9)` ile buzlu
  görünür; kılıf kayarken netleşir.
- **Kart:** kılıf genişliğinin 0,74'ü, üst kenarı kılıfın üst kenarından 0,04 × kılıf aşağıda; kapalıyken bütünüyle kılıfın
  içinde (`stage.card_path.inside_sleeve_when_closed`, yapı denetler). Kılıf gidince kart kendi boyunun %17'si kalkar, sonra
  %2 aşağıda × 1,05 öne gelir (`ENVELOPE_GEOMETRY`).
- **Kapanış** (etiket): docs/11 §7.1 kılıf kuralı — çapa = kapalı kılıfın ön panel üst kenarının orta noktası (görselden,
  orta sütunda en güçlü parlaklık düşüşü: **(512,5, 637,5)**), boyut ve kayma W1.1 comp'tan: etiket / kılıf genişliği
  **0,2715**, merkez çapanın **0,0708 × kılıf** altında (`build_images.py` COMP; 2× kırpımda okundu). GPT etiketi Kısım 2
  talebiyle kılıfın tuvalinde kendi yerinde de çizdi (genişlik 0,2985, merkez +0,131): karşılaştırma için
  `manifest.closure.gpt_canvas`; comp ölçüsü uygulandı (fark: %9 küçük, 0,06 × kılıf yukarıda). `previews/g418/compare_closure.jpg`.
- **Sahne kutusu** = kapalı + açık kılıf + kalkan/öne gelen kart + etiket birleşimi (721 × 993 tuval px, oran 0,726); kılıfın
  üstündeki boş pay (kartın kalkacağı yer) sahne genişliğinin 0,17324'ü — `.stage` negatif üst boşlukla başlığın altına girer.
- **Zemin:** bg_page 2:3, telefonda `cover` köşe kümelerini keserdi → `meadow` = iki kümesiz kırpım (krem → çayır sisi x 220–800,
  y 300–1150 + sol alttaki bulanık kır çiçekleri x 0–580, y 1150–1536, 120 px yumuşak geçiş); kümeler ayrı katman
  (`florals_tl`/`florals_br`), ekranda bütün. Geniş ekran `meadow_wide` (kümesiz geniş kırpım), uzun sayfaların sonu `meadow_foot`.
  `bg_tile`: GPT karosu dikişsiz değildi (sol↔sağ 2,71 → 2,03; 14'ün yöntemi), renk bg_page sisinin ortalamasına (`#F1F0E1`).
- Kartlar: `free_zone` + 3 dilim (`invitation_card` %35–45: sağ üstteki saplar %36'ya kadar sarkıyor; `info_card` %6–48:
  sol alttaki gelincik + peygamber çiçeği dalının yaprakları %48'den itibaren soldan giriyor). og: `web_hero` alt hizalı 1.91:1
  (kılıf + etiket tam görünür); favicon: etiket. Tema klasörü ~1,8 MB.

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the wildflower label peels away, the frosted vellum sleeve slides down off the card and fades,
  and the card lifts up as a few colored-pencil petals flutter across the screen."): dokununca "Tap to open" söner, kılıf hafifçe
  bastırılır; 80 ms'de **etiket soyulur** — alt kenarı etrafında üst kenarı izleyiciye doğru kalkar (`rotateX` 0 → −38°, gölgesi
  büyür), sonra yukarı-sağa kalkıp döner ve söner (1,1 s'de biter); 760 ms'de **kılıfın ağzı açılır** (yalnız üst şerit takası:
  açık şerit kapalının üstünde belirir, sonra kapalı kalkar — yarı saydam çift kat yok); 980 ms'de **kılıf karttan aşağı kayar**
  (%64) ve söner, kart aynı anda buzlu hâlden netleşir; 1,76 s'de **kart kalkar** (−%17, büyüyen gölge) ve **aynı anda 4 gelincik
  yaprağı** (GPT accent_1, 26–38 px) sırayla soldan ve sağdan ekranı salınarak geçer; 3,02 s'de kart olduğu yerde öne gelir
  (× 1,05) → 3,82 s'de view transition ile home kartına uçar. theme-check: dokun → home 4110 ms. Skip her an.
- **Story:** her foto kartı kendi sahnesi: kart yükselerek yerine oturur (`rise-lg`), 0,9 s sonra üstündeki **vellum örtü alt
  kenarından kalkar** (`lift-veil`: üst kenarı etrafında `rotateX` 0 → 78°, izleyiciye doğru, hafif yukarı, solarak; 1,7 s),
  foto görünür, sonra alt yazı yazılır. Telefonda kartlar 62vw (foto penceresi 47,4vw ≥ 38vw), hafif basamaklı (−7 / +7 / −5vw)
  ve elle bırakılmış gibi hafif eğik (−2° / 1,6° / −1,2°), aralarında peygamber çiçeği ve papatya; ≥ 720 px comp'un düz üçlü sırası.
- **Parçacıklar** (`MOTION.accents`, hep GPT gelincik yaprağı): açılış 4 (across) · home'a varış 3 (hero içinde, metnin
  arkasında, yazı sütununun yanındaki şeritlerde) · RSVP kapanışı 4.
- Kartlar `set` (hep opak), köşe kümeleri köşelerinden büyür (`grow-tl/br`), RSVP etiketi karta oturur (`settle`).
- Süreler (docs/11 §8): her sahnenin ilk adımı ≤ 150 ms, son adımı ≤ 3000 ms; tek giriş 600–1800 ms.

## İlk ekranlar, yatay telefon, dekor
08'in çözülmüş adımları korunur: `fitNames` (isimler ≥ 36 px), `fold`, iç sayfalarda `folds` (`[data-fold]` birimleri; imza
`--sg` ≥ 0,72 küçülür), ≥ 720 px story sırası tek birim (`row`), zarf sayfası `envFit` (`--ok` ≥ 0,6). Kısa yatay ızgara: kart solda,
isimler · tarih · mekân · yer · sayaç · hap sağda. Köşe kümeleri hep bütün GPT parçası; yazıya ya da karta değecekse 16 × 16
alfa haritasıyla (`decor_map`, yapı üretir) küçülür, yine değiyorsa gizlenir; süzülen parçalar yazıya/karta/kılıfa değerse gizlenir.
Gezinme: etiketler iki 1 px çizgi arasında (W1), geçerli sayfa kalın italik; opak etiket satırı.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| krem → çayır sisi, altta bulanık kır çiçekleri | `.scene-bg` `meadow` (telefon) / `meadow_wide` (geniş) | geniş ekranda alt şerit yok (kümesiz kırpım) |
| köşe kümeleri sol üst, sağ alt | `.corner-tl` / `.corner-br` (florals_tl / florals_br) | ekranda bütün |
| gelincik yaprağı, peygamber çiçeği, papatya (sağda) | `.f-petal` / `.f-corn` / `.f-daisy` (accent_1/2/3) | yavaş "nefes"; yazıya değerse gizlenir |
| "YOU ARE INVITED", isimler | `.env-head .kicker`, `h1.names` (Satisfy, `&` italik Spectral) | uzun isimde `fitNames` |
| buzlu vellum kılıf, içinde soluk kart | `.sleeve` (`sleeve_body` + `sleeve_band`) + arkasında `.card` | **sapma:** kart card_small (comp'taki kart daha geniş ve basık; card_small 0,66 en/boy, kılıfa sığacak kadar dar) |
| deckle kenarlı kır çiçeği etiketi, ağzın hemen altında | `.closure` | ölçü ve yer comp'tan (manifest.closure) |
| "TAP TO OPEN" | `.env-hint` | masaüstünde "Click to open" |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| kart: dik pencere, alt kenarda çiçek bordürü, "We're getting married", "JUNE 26, 2027 · LANCASTER" | `.hero-card` (card_small + `hero_portrait`, `.card-copy`) | şehir `venue.city` (comp gibi; docs/11 §3.2 `venue.city_region` der — **sapma**, 08/14 ile aynı); dar kartta `fitCopy` |
| isimler, "SATURDAY · JUNE 26, 2027", "Meadowlark Farm", "Lancaster, Pennsylvania" (italik) | `h1.names`, `.hero-date`, `.hero-venue`, `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| peygamber çiçeği mavisi RSVP hapı | `.hero-cta .btn` | arayüz hapı (#5579BC → #4062A0), beyaz yazı 5,9:1 |
| alt gezinme (iki yanında çizgi) | `.site-nav` | |
| köşe kümeleri, süzülen parçalar | `.hero-bg` | |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim: host line, tam adlar, "invite you to celebrate their wedding", gün / AY · büyük gün · YIL / saat, mekân, yer), "Kindly reply by" + RSVP, takvime ekle, iki foto kartı (`frame_portrait` + story_1 + vellum → Our Story; `frame_landscape` + mekân → The Day + ilk 4 satır), "With love" + isimler + "Open the invitation again" (bulanık çayır + florals_br) | bu tasarımın parçaları ve tipografisi |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| üç foto kartı yan yana, her birinin yarısı kalkan vellum örtü altında | `.cards-row .pane` (frame_portrait + `veil` = vellum_overlay) | **sapma (docs/11 §9):** telefonda yan yana pencere ~20vw olurdu → basamaklı sütun, kart 62vw; **sapma:** comp'un "yarı kalkmış" son hâli tutulmadı — yarı örtü yüzleri kapatırdı; örtü kalkıp gider (`lift-veil`), comp'un hâli hareketin ortasında görünür; örtü GPT parçası, kıvrılan arka yüzü çizilmedi |
| alt yazılar (script) | `figcaption.script` | |
| kartlar arasında küçük kır çiçekleri | `.between` (accent_2, accent_3) | comp'taki küçük dallar ayrı parça olarak yok; GPT accent'leri |
| köşe kümeleri, süzülen parçalar | `.page-bg` ilk ekranda; `florals_br` + bulanık çayır sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| uzun pamuk kart, sol altta gelincik + peygamber çiçeği, "Order of the Day" | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar (1–10 satır); satır metinleri %22–78 sütununda (dalın yaprakları) |
| saat / ETKİNLİK / yer (italik) | `.sched-row` | |
| satır arası yatay sprey | `.row-orn` (GPT divider) | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| yatay foto kartı, alt kenarında bordür | `.venue-photo` (frame_landscape + `venue`) | GPT kartı neredeyse kare (pencere üstte, bordür altta derin) |
| "Meadowlark Farm" (script), "LANCASTER, PENNSYLVANIA" | `.venue-name.script`, `.venue-place.kicker` (`city_region_country`) | ülke de yazılır; tören cümlesi ve adres eklenir |
| "DRESS CODE · Garden party" | `.dress` | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| aynı kart (sol altta dal) | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?", "KINDLY REPLY BY", "MAY 15, 2027" | `h1.card-title`, `.kicker`, `.deadline` | |
| mavi RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU", sprey, "With love, Willow & Finn" | `.wait`, `.sig-unit` (`.orn` + `.sign`) | **sapma:** imza comp'ta dalın sağında sağa yaslı; burada ortalı ve dalın üstünde (uzun isimler daldaki yapraklara binerdi) |
| kartın tabanında kılıfın etiketi | `.card-label` (closure) | `settle` girişi |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075)
Zarf: açılış aynen, üst satır "With love and thanks", kartta teşekkür başlığı + tarih; pencerede teşekkür fotoğrafı ya da
**çayır sisi üstünde kılıfın etiketi** (yer tutucu asla). Home: kart, isimler, tarih, mekân; sayaç / RSVP / takvim yok; davet
kartının yerinde aynı kâğıtta teşekkür kartı. Details "The Day" (takvim, dress code, travel, SSS, RSVP yok; tören geçmiş zaman;
çift gizlerse 404). RSVP: "Replies are closed" + başlık + Home hapı + imza, form yok. Nav: "The Day", RSVP yok.

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
71 standart anahtar (`node scripts/copy-manifest.ts --theme wildflower-meadow-vellum --check` temiz); `max` değerleri 08'den
başlatıldı ve `theme-check --stress` ile (360/390, teşekkür hâli dahil) doğrulandı. Bu tasarımın varsayılanları: `home_replay`
"Open the invitation again", `rsvp_replay` "Replay the opening" (zarf değil kılıf). Formda "Number of guests"in hemen altında
`<template data-rsvp-party>`.

## Bilinen sınırlar
- **Satisfy yalnız `latin` alt kümesi taşır** (Google Fonts CSS'i denetlendi): Latin-1 aksanları (é, ñ, ü, Å) var; `latin-ext`
  harfleri (ş, ğ, ł, ő…) yedek el yazısıyla karışır. Spectral `latin-ext` taşır. Katalog fontu korundu (docs/11 §12: sınır olarak yazıldı).
- Etiket (closure) kaynakta 214 px: DPR 3 telefonda (~80 css px → 240 px) hafif büyütülür.
- Kılıf opaklığı .8 (docs/11 §7.7 .82–.9 aralığının hemen altı, comp'un "about 80 %"u).
- Home ilk görünüm örnek fotoğraflarla 1454 KB (sınır 1,5 MB; yer tutucuyla 929 KB): Chrome lazy görselleri ekran altına
  yakınsa erken indiriyor; çiçek kümeleri alfa yoğun.
- `story.items` 3'ten fazlaysa ilk 3; anların `text`'i gösterilmez. Monogram (`initials`) kullanılmaz: etiket çiçekli (boş mühür değil).
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, kesişen belge view transition, `perspective` +
  `rotateX`, `filter: blur` kartta), Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ.

## Ölçümler
2026-10-15, PORT 3460, Chromium (Playwright, `/opt/pw-browsers`).

| Ölçüm | Sonuç |
|---|---|
| `theme-check --theme wildflower-meadow-vellum --stress` | 128 geçti, 0 hata, 0 uyarı (`previews/g418/checks.json`) |
| `g051-browser --theme wildflower-meadow-vellum` | 44/44 |
| `final-smoke --theme wildflower-meadow-vellum` | 45/45 (`previews/g418/final/`) |
| zarf → home | 4110 ms (MOTION `go` 3820 + view transition); azaltılmış hareket 308 ms |
| ilk görünüm 390×844 DPR 3 | index 587 KB, home 929 KB (yer tutucu); örnek fotoğrafla 710 / 1454 KB |
| dosya boyları | site.js 35 357 B (≤ 35 KiB), site.css ~45,1 KB (≤ 45 KiB); tema klasörü ~1,8 MB |
| `kit_check` | paket 5 24/24 (hiza kılıf: sol −0,10, sağ 0, alt 0 %), paket 2 5/5 |
