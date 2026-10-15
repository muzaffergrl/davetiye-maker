# Tema: cherry-blossom-spring (tasarım 15 · Cherry Blossom Spring, G415)

İlkbahar: soluk pembe sis, sol altta bulanık yaprak bokehi; sol üst ve sağ alt köşeden uzanan suluboya kiraz çiçeği dalları,
ekranda tek tek süzülen yapraklar. Açık gri el yapımı kâğıt zarf, **yuvarlak** kapağı beyaz tırtıklı (deckle) kenarlı;
kapağın en alt noktasında beş çiçekli, tomurcuklu kiraz dalı. Petit Formal Script (isimler, başlıklar) + Noto Serif Display
(aralıklı büyük harf satırları, italik mekân). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi
`platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından
(`collections/15_Cherry_Blossom/assets/gpt/comps/web_1..5`); bütün görseller bu tasarımın GPT parçaları (K21). 08
(winter-evergreen) temasından yalnız platform sözleşmesi ve çözülmüş ilk ekran mekanizmaları alındı (motor işaretleri, RSVP
formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` + `folds`,
`envFit`, `decor`, yatay telefon ızgarası, `devRender`); görünüş, aralıklar, süs konumları, zamanlama, kart oranları, story
dizilişi ve parçacık yolu bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Cherry Blossom Spring", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 standart copy anahtarı |
| `content.demo.json` | `collections/15_Cherry_Blossom/content.demo.json`'ın birebir kopyası (servis edilmez) |
| `index.html` | kapalı zarf → dokun → dal titreyip gevşer ve sağ üste süzülerek ekrandan çıkar, yuvarlak gri kapak kalkar (kiraz astarı görünür), kart yükselirken yapraklar zarfın önünden dönerek yükselip ekran boyunca savrulur, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + yuvarlak pencere, isimler, gün · tarih, mekân, şehir/bölge, geri sayım, iki ucunda GPT çiçeği olan gül kurusu RSVP hapı, çizgi · çiçek · çizgi), davet kartı (invitation_card; AY \| gün \| YIL, gün · saat), tek "Kindly reply by" satırı, takvime ekle, iki çiçekli oval çerçeve (story_1 → Our Story, mekân → The Day + programın ilk 4 satırı; yaprak gibi süzülerek iner), kapanış (sağ alt dal) |
| `story.html` | W1.3: ilk ekran pembe sis (`.page-bg`), başlık + alt başlık + çiçek/çizgiler + giriş cümlesi; üç farklı boyda çiçekli çerçeve çapraz dizilişte (sol büyük, sağ küçük, sol orta), her biri yaprak gibi bir yandan sallanarak süzülüp yerine oturur, sonra başlığı yazılır, altında çizgi · çiçek · çizgi |
| `details.html` | W1.4: ilk ekran sis; Order of the Day kartı (info_card, 3 dilim; saat · ETKİNLİK · yer, satır aralarında GPT çiçekli dal + iki ince çizgi), takvime ekle, mekân (GPT oval yatay çerçeve), çiçek + dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim): başlık, son tarih, çiçekli hap, çizgi · çiçek · çizgi, bekleme satırı, "With love," + isimler, **zarfın dalı kartın alt kenarında**; platform formu (G042 + G051 + G069), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`sway-tl/br`, `drop`, `set`, **`petal-l` / `petal-r`** bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri (45 671 B) |
| `thank-you.css` | teşekkür hâli (yalnız düğünden sonra yüklenir) |
| `site.js` | `MOTION` (açılış, sahneler, `accents` — `swirl` yolu bu tasarımın), `ENVELOPE_GEOMETRY`, `fitNames`/`fold`/`folds`/`envFit`, `decor` (16 × 16 çiçek haritası = manifest `occupancy_16`), `fitCopy`, geri sayım, zarf, `DEV_CONTENT` + `devRender` (35 247 B) |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `florals_*` 360/540/720, `mist` / `mist_wide` / `mist_foot` zeminleri, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 535/531 | card_small'ın yuvarlak penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 648/891 | frame_portrait oval penceresi (story; `story_1` home'da da) |
| `venue` | `media.venue_image` | 995/683 | frame_landscape oval penceresi (details; home'da da) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` kart
50% 45%, portre 50% 38%, mekân 50% 55%. card_small ve frame_portrait pencerelerinin ortasındaki koyu yeşil gradyanı
`parts_prep` leke dolgusu tam şeffaf yaptı (`manifest.checks.windows_transparent`: hepsi 0). "Your photo here" yalnız
önizlemede; misafir nötr yer tutucuyu (bg_page'in dalsız pembe sisinden bulanık + fildişine tonlanmış kırpım; en koyu piksel ≥
175, doygunluk ≤ 26 — `manifest.ph_*`) görür.

## Görseller (`python3 platform/themes/cherry-blossom-spring/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre** (`/tmp/claude-0/G415/prep`); tema klasörüne/`assets/`'e yazılmaz.
- **Kapak kesimi** (`env_cflap`): `tema_build.kapak_kes("egri")`, `method: renk` (419 nokta, artık sd 1,28 px) — beyaz tırtıklı
  şerit kapakta kalır. Kapağın sol ucu zarfın köşesine dik indiği için kapak_kes'in uç uzatması en soldaki sütunlarda kenarı
  gövdenin altına indiriyordu (ince dikey şerit): `kapak_tekduze` kenarı uçtan dışa tekdüze yapar (54 sütun; gerçek uç
  (512, 1009), `stage.cuts.cflap.tip`). Önizleme `previews/g415/cuts_envelope.jpg`.
- **Ön cep** (`cep_gulumseme`): açık zarfın ön yüzü iki yan kanat + alt kanat, cebin üst kenarı tek "gülümseme" yayı. `tema_build.cep_kes("egri")`
  alttan taradığı için alt kanadın beyaz kat çizgisinde durup geometrik yedeğe düştü. Burada kaba yayın ±80 px'inde "koyu
  temas gölgesi → parlak kenar şeridi" sıçraması, aykırısız 6. derece polinom, ±8 px yeniden arama + 9 sütun medyanı (394/438
  nokta, sapma 0,55 px). Kenar şeridi cepte, astar gövdede (`previews/g415/cut_pocket_edge.jpg`: kesim çizgisi kırmızı).
- **Hiza**: `kit_check` geçiyor (sol +0,10 · sağ 0,00 · alt 0,00 %) — dönüşüm yok; açık kapak/gövde menteşe satırından ayrılır.
- **Kapanış** (`closure.png`, kapakla **taşınmaz**): çapa = yuvarlak kapağın en alt noktası; W1.1 comp'ta ölçülen dal
  genişliği / zarf genişliği (0,312) ve dal merkezinin uca göre kayması (+0,0178, −0,0643 × zarf genişliği) — ölçüm
  `build_images.py` COMP yorumunda; `previews/g415/compare_closure.jpg`: tema | comp.
- **Zeminler**: telefon `mist` = bg_page'in iki dalsız kırpımı (sakin pembe sis x 220–860 y 390–1060 + sol alttaki bulanık
  yaprak bokehi x 0–440 y 1250–1536) 110 px yumuşak geçişle; geniş ekran `mist_wide`; uzun sayfaların sonu `mist_foot`
  (%50 opak, üstten maskeyle). Dallar hep ayrı katman (`florals_tl` / `florals_br`), düz çizgiyle kesilmez; zemindeki keskin
  yapraklar kırpıma alınmadı (süzülen yapraklar ayrı GPT accent_1).
- **Ağırlık**: kümeler q 76 / alfa 60; davet kartı q 66 / alfa 80 (q 80'de 900 px 258 KB idi; şimdi 116 KB), bilgi kartı ve
  çerçeveler q 74. accent_3 (tomurcuk) bu temada kullanılmıyor, yazılmaz. Tema klasörü 1,8 MB.
- Kartlar: `free_zone` + 3 dilim. Davet kartında tam genişlikte düz bant yalnız %54–55 (sağ çelenk %74'e iniyor, sol alt dal
  %62'de başlıyor): kart tasarım aralığında kendi boyunda kalır, yalnız stres kaydında bu sıra gerilir; metin sütunu %24–76,
  ilk satır %30–70 (çelenk uçları). Bilgi kartı %39–93. og: `web_hero` alt hizalı 1.91:1; favicon: closure.

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the blossom twig loosens and drifts off, the curved grey flap lifts, and the card rises as a
  gentle flurry of cherry petals swirls up and floats across the screen."): dokununca (90 ms) **dal gevşer** (sapı çevresinde
  −5° → +4° → −2° titrer, hafifçe şişer) ve **süzülerek gider** (sağ üste doğru dönerek, 46°'ye kadar, ekranın sağ üstünden
  çıkar; zarfın üstünde sönmez; 1,59 s'de biter); **yuvarlak gri kapak** menteşesinde izleyiciye doğru kalkar (1,15 s; 82°'den
  sonra söner), altında kapalı gövde açık gövdeye (kiraz astarı + ön cep) geçer, astarlı açık kapak −90°'den dikilir (1,97 s)
  → **kart cepten yükselir** (2,23 s) ve **aynı anda** 14 GPT yaprağı (15–28 px) zarfın ön cebinden **dönerek yükselir**
  (`path: 'swirl'`: sarmal yükseliş, sonra bir yana savrulup ekran boyunca süzülme) → kart olduğu yerde öne gelir (× 1,05,
  büyüyen gölge) ve view transition ile home kartına uçar. Dokun → home 4,5 s (`go`; theme-check ölçümü 4917 ms). Skip her an.
- **Story:** her çerçeve kendi sahnesi: görünüme girince yaprak gibi süzülür (`petal-l` / `petal-r` keyframe: yukarıdan bir
  yandan gelir, sağa-sola sallanarak yerine oturur, 1,8 s), 1,3 s sonra başlığı yazılır, sonra altındaki çiçek açılır.
  Çerçeveler sırayla soldan, sağdan, soldan gelir (comp'un çaprazı).
- **Parçacıklar** (`MOTION.accents`, hep GPT yaprağı accent_1): açılış 14 `swirl` · home'a varış 4 düşen yaprak (hero'nun içinde,
  yazı sütununun yanındaki şeritlerde) · RSVP kapanışı 5 yaprak (yalnız `.closing` kutusunda).
- **Boyalı kartlar**: `set` (hep opak); RSVP kartındaki dal `drop` ile karta düşer.
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms, tek giriş 600–1800 ms.

## İlk ekranlar ve yatay telefon
08'in çözülmüş adımları: `fitNames` (isimler en çok %24 küçülür → `.is-tight` + 36 px taban → `.is-long` → hero kaydırılır),
`fold` (nav'ın altında yarım parça yok), kısa yatay (`min-aspect-ratio: 1/1`, yükseklik ≤ 620 px) ızgara: kart solda, isimler ·
tarih · mekân · şehir · sayaç · hap sağda. İç sayfalar `folds` (`[data-fold]`: story'de alt başlık, giriş cümlesi, her çerçeve,
sonraki bölüm; details'te kart başlığı, her program satırı, takvim çifti, mekân çerçevesi; rsvp'de başlık, son tarih, hap,
bekleme satırı, imza, form satırları). İmza katlanmadan önce `--sg` 1 → 0,72 küçülür. Zarf sayfası `envFit`: sahnenin boş
üstü (`.52334 × --w`) ölçülen başlığın altına girer; "Tap to open" ilk ekranda bitmiyorsa sahne küçülür (`--ok` ≥ 0,6).

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| soluk pembe sis, sol altta bulanık yaprak bokehi | `.scene-bg` `mist` / `mist_wide` | bg_page 2:3 telefonda dalları keserdi: zemin dalsız kırpımlardan |
| kiraz dalları sol üst, sağ alt | `florals_tl` / `florals_br` ayrı katman | ekranda bütün; kenarda ekran dışına taşar (comp gibi) |
| süzülen tek yapraklar (sağ, sol, alt), biri bulanık | `.float` `f-pr`, `f-pl`, `f-pb`, `f-soft` (GPT accent_1; `f-soft` = parçaya blur, §5.7) | yavaş "nefes"; zarfa/yazıya değerse gizlenir |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (formal script) | `h1.names` (+ `.amp` italik Noto Serif Display) | uzun isimde `site.js` küçültür |
| açık gri zarf, yuvarlak tırtıklı kapak | `.env-closed` + `.env-cflap` | |
| kapağın ucunda kiraz dalı | `.closure` (kapaktan ayrı) | ölçü ve yer comp'tan (manifest.closure) |
| "TAP TO OPEN" + çizgi · çiçek · çizgi | `.env-hint p` + `.env-hint .orn` (GPT accent_2 + iki 1 px çizgi) | kısa yatayda çiçek gizli |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| tırtıklı fildişi kart, dal çelengi + altın halkalı yuvarlak pencere, "We're getting married", "APRIL 3, 2027 · WASHINGTON", çizgi · çiçek · çizgi | `.hero-card` (card_small + `hero_portrait` + `.cc-orn`) | dar kartta tarih ve kasaba iki satır (`fitCopy`); kasaba = `venue.city` (comp yalnız kasabayı yazar; docs/11 §3.2 `city_region` der — **sapma**, 05/08/13 ile aynı) |
| isimler | `h1.names` | |
| "SATURDAY · APRIL 3, 2027" | `.hero-date` | |
| "Blossom Hill Gardens", "Washington, D.C." (italik) | `.hero-venue`, `.hero-city` (`venue.city_region`) | |
| dört yuvarlak köşeli kutulu geri sayım | `.countdown` sade serif rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| iki ucunda çiçek olan gül kurusu RSVP hapı | `.hero-cta .btn.btn-bloom` (arayüz hapı + iki GPT accent_2) | hapın kendisi arayüz degradesi (#9A6675 → #845463, yazı ≥ 5:1) |
| hapın altında çizgi · çiçek · çizgi | `.hero-orn` | 9:16'dan basık telefonda gizli (ilk ekran) |
| alt gezinme (ince çizgi, geçerli sayfa altı çizili) | `.site-nav` (`::before` 1 px çizgi) | |
| köşe dalları, süzülen yapraklar | `florals_tl` / `florals_br`, `.float` | |
| — (comp yok) | davet kartı (`invitation_card`: çelenk, sol alt dal, altın çerçeve, yapraklar; AY \| gün \| YIL iki 1 px ayraçla, altında gün · saat), "Kindly reply by" + RSVP, takvime ekle, iki çiçekli oval çerçeve (`frame_portrait` + story_1 → Our Story, `frame_landscape` + mekân → The Day + ilk 4 program satırı; çapraz, yaprak gibi süzülür), "With love" + isimler + "Open the envelope again" (sağ alt dal) | bu tasarımın parçaları |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR", çizgi · çiçek · çizgi | `h1.page-title`, `.page-head .kicker`, `.page-head .orn` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| üç farklı boyda **yuvarlak** çiçekli çerçeve çaprazda (sol büyük, sağ küçük, sol) | `.petal-frames .pf-1..3` (frame_portrait + foto) | **sapma 1:** GPT `frame_portrait` dik **oval** (comp'ta daire); çizilmedi, oval kullanıldı (önerilen gpt-gorsel görevi, Sonuç). **sapma 2:** telefonda comp'un üst üste binen çaprazı ~%35vw pencere verirdi (< 38vw, docs/11 §9) → zikzak sütun: çerçeveler 64 / 52 / 58vw (pencere 51 / 41 / 46vw), solda–sağda–solda; ≥ 720 px comp'un ızgara çaprazı |
| başlıklar çerçevenin altında, altında çizgi · çiçek · çizgi | `figcaption` + `.pf .orn` | |
| köşe dalları, süzülen yapraklar | `.page-bg` ilk ekranda; `florals_br` + bokeh sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| sis, köşe dalları, süzülen yapraklar | `.page-bg` | kart ve çerçeve dalın önünde |
| "Order of the Day" kartı, altın ince çerçeve | `.day-card` (info_card 3 dilim) + `h1.card-title` | **sapma:** GPT info_card'ın sol üst köşesinde çiçekli dal var (comp kartında yok); başlık dalın altından başlar. Kart içerikle uzar (1–10 satır) |
| saat / ETKİNLİK / yer (italik), ortalı | `.sched-row` | |
| satır arası çiçekli dal + iki yanında ince çizgi | `.row-orn` (GPT divider + iki 1 px çizgi; ilk satırda yok) | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı oval çiçekli çerçevede | `.venue-photo` (frame_landscape + `venue`) | pencere 1,46:1, `cover`; yaprak gibi süzülür (`petal-r`) |
| "Blossom Hill Gardens", "Washington, D.C." | `.venue-name`, `.venue-place` (`city_region_country`, + adres, tören cümlesi) | |
| çizgi · çiçek · çizgi, "DRESS CODE · Spring formal" | `.dress` | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| sis, köşe dalları, süzülen yapraklar | `.page-bg` | kart dalın önünde |
| altın ince çerçeveli tırtıklı fildişi kart | `.rsvp-card` (info_card 3 dilim) | **sapma:** info_card'ın sol üst çiçekli dalı (W1.5 kartında yok; tek GPT parçası iki sayfada) |
| "Will You Join Us?" (iki satır) | `h1.card-title` | |
| "KINDLY REPLY BY", tarih | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| çiçekli RSVP hapı | `a.btn.btn-bloom[href="#reply"]` | forma kaydırır |
| çizgi · çiçek · çizgi, "We can't wait to celebrate with you" | `.orn`, `.wait` (italik) | |
| "With love," + isimler | `.sig-unit` (`.love` + `.sign`) | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür (`--sg` ≥ 0,72) |
| kartın alt kenarında kiraz dalı | `.card-twig` (closure) | comp'taki boy (~kart genişliğinin %30'u) |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075 kuralı)
Düğünden sonra aynı sayfalar `data-if="thank_you_on"` ile teşekkür hâline döner; yeni sayfa ve yeni görsel yok (K21):
- **Zarf:** açılış aynen; üst satır "With love and thanks" (`ty_kicker`); kartta teşekkür başlığı (el yazısı, dengeli sarar;
  `fitCopy` sığmazsa küçültür) + tarih; kasaba yok. Yuvarlak pencerede teşekkür fotoğrafı; yoksa **pembe sis üstünde zarfın
  dalı** — asla yer tutucu.
- **Home:** hero kartı zarfla aynı; isimler, tarih, mekân kalır; geri sayım ve hap yok. Davet kartının yerine aynı
  `invitation_card` kâğıdında **teşekkür kartı** (başlık, mesaj `pre-line`, "With love,", isimler, tarih). Yanıt satırı ve
  takvim yok; çerçevelerde Our Story ve The Day kalır (çift Details'i gizlerse The Day yok).
- **Details:** "The Day" (program, mekân, harita, registry); takvim, dress code, Travel & Stay, SSS, RSVP yok; tören cümlesi
  geçmiş zaman. Çift gizlerse 404.
- **RSVP:** "Replies are closed" + teşekkür başlığı + Home hapı + imza + dal; bekleme satırı ve form yok.
- **Nav:** Details etiketi "The Day" (`nav_day`), RSVP yok. Stiller `thank-you.css`'te.

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar; `node scripts/copy-manifest.ts --theme cherry-blossom-spring
--check` temiz). `max` değerleri 08'den başlatıldı ve `theme-check --stress` ile 360/390'da (teşekkür hâli dahil) doğrulandı.
Formda "Number of guests"in hemen altında `<template data-rsvp-party>` (formun kendi `.field` stili).

## Bilinen sınırlar
- Story çerçeveleri oval (GPT parçası); comp'taki yuvarlak çerçeve için yeni parça önerildi (Sonuç).
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim). Davet kartının düz bandı tek satır (%54–55): yalnız
  çok uzun içerikte (stres kaydı) gerilir; gerilen bantta kâğıt lifi dikey çizgi gibi görünür (metin düz kâğıtta kalır).
- Mekân penceresi 1,46:1 — 3:2 fotoğraf yanlardan hafifçe kırpılır.
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez. Monogram (`initials`) kullanılmaz: kapanış bir
  kiraz dalı (mühür değil, boş oval yok).
- Telefonda story çerçeveleri `folds` kuralıyla ilk ekranın altından başlayabilir (nav'ın altında yarım çerçeve yok); kısa
  ekranda çerçeveler arasında boşluk büyür.
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, `cqw`, kesişen belge view transition, keyframe
  gecikmeleri), Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.

## Ölçümler
2026-10-15, worktree `worktree-agent-a8d087759743840f0`, PORT 3480, Chromium (Playwright, `/opt/pw-browsers`).

| Ölçüm | Sonuç |
|---|---|
| `theme-check --theme cherry-blossom-spring --stress` | 128 geçti, 0 hata, 0 uyarı (`previews/g415/checks.json`) |
| `g051-browser --theme cherry-blossom-spring` | 44/44 |
| `final-smoke --theme cherry-blossom-spring` | 45/45 (`previews/g415/final/`) |
| `npm test` / `typecheck` / `build` | 981/983 (2 atlanan: build çıktısı ister) · temiz · temiz (trace-check 16 tema) |
| zarf → home | 4917 ms (MOTION `go` 4500 + view transition) · azaltılmış hareket 254 ms |
| ilk görünüm 390×844 DPR 3 | index 750 KB, home 803 KB (yer tutucu); örnek fotoğrafla 847 / 1322 KB (sınır 1,5 MB) |
| açılış kaydı | `previews/g415/opening_390x844.mp4` 2839 KB |
| dosya boyları | site.js 35 247 B, site.css 45 671 B, thank-you.css ~2,4 KB; tema klasörü ~1,8 MB; en büyük WebP invitation_card-900 116 KB |
| kit uyumu (`kit_check`) | paket 5 23/23 (hiza sol +0,10, sağ 0,00, alt 0,00 %), paket 2 5/5 |
| kontrast (palet tokenları, düz renk) | mürekkep 9,7:1 (sis), ink-soft 6,6:1, el yazısı mürekkebi 8,2:1, rose 5,0:1, hap yazısı ≥ 5,0:1 |
