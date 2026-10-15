# Tema: enchanted-forest-storybook (tasarım 13 · Enchanted Forest Storybook, G413)

Masal kitabı: sisli bir orman açıklığı, ateş böceği ışıkları; sol üst ve sağ alt köşede sarmaşık, yüksük çiçeği, eğrelti,
yosun ve küçük mantar kümeleri; ortada kabartma altın eğrelti/mantar bordürlü yosun yeşili eski bir masal kitabı, sağ
kenarında yaprak oymalı pirinç toka. Sayfalar eskitilmiş krem kitap sayfası (lekeli, tırtıklı kenar, ince mürekkep çerçeve),
fotoğraflar dört siyah fotoğraf köşeliğiyle tutturulmuş. Tangerine Bold (isimler, başlıklar, alt yazılar) + IM Fell English
(aralıklı büyük harf satırları, italik mekân). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi
`platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından (`collections/13_Enchanted_Forest/
assets/gpt/comps/web_1..5`); bütün görseller bu tasarımın GPT parçaları (K21). Öteki temalardan (08 winter-evergreen, 05,
04) yalnız platform sözleşmesi ve çözülmüş ilk-ekran mekanizmaları alındı (motor işaretleri, RSVP formu + G051 soruları +
G069 misafir adları, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames` +
`fold` + `folds`, yatay telefon ızgarası, `decor` haritası, `devRender`); görünüş, aralıklar, süs konumları, zamanlama, kart
oranları ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Enchanted Forest Storybook", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 copy anahtarı |
| `content.demo.json` | `collections/13_Enchanted_Forest/content.demo.json`'ın birebir kopyası (servis edilmez) |
| `index.html` | kapalı kitap → dokun → toka menteşesinde açılıp savrulur ve düşer, kapak sola açılır (astarlı iç yüz devralır), ilk sayfa çevrilir, kart sayfadan kalkarken minik ateş böcekleri yanıp yükselir, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, isimler, sarmaşık · çizgiler, gün · tarih, mekân, şehir/bölge, geri sayım, yosun yeşili RSVP hapı), davet kartı (3 dilim; AY \| gün \| YIL), tek "Kindly reply by" satırı, takvime ekle, iki köşelikli resim (story_1 → Our Story · mekân → The Day + programın ilk 4 satırı), kapanış (sağ alt küme) |
| `story.html` | W1.3: ilk ekran sisli orman (`.page-bg`); başlık + sarmaşık/çizgiler + alt başlık + giriş cümlesi; **tek uzun masal kitabı sayfası** (info_card, 3 dilim) yerine sayfa çevrilir gibi oturur, üstünde üç köşelikli resim zikzak (sol, sağ, sol) — her birinin yanında eğrelti filizi, altında alt yazı + sarmaşık; aralarında ateş böcekleri |
| `details.html` | W1.4: Order of the Day sayfası (info_card, 3 dilim; saat · ETKİNLİK · yer, satır aralarında GPT sarmaşık + iki ince çizgi), takvime ekle, mekân (GPT yatay köşelikli kart), mekân adı el yazısıyla, yer, sarmaşık + dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP sayfası (info_card, 3 dilim): başlık, sarmaşık, son tarih, hap, bekleme satırı, sarmaşık + "WITH LOVE," + isimler; **kitabın pirinç tokası kartın tabanında**; platform yanıt formu (G042 + G051 + G069), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`turn`, `mount`, `glow` bu tasarımın), foto alanı + maske, kitap katman yüzdeleri, kart 3 dilim (aynalı bant), sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (yalnız düğünden sonra yüklenir) |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim + ilk ekranlar (`fitNames`, `fold`, `folds`, kitap sayfası `envFit` + `--s`), dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, kitap açılışı, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `decor_*` 360/540/720, `mist` / `mist_wide` zeminleri, `*_band` aynalı kâğıt şeritleri, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 565/559 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 549/720 | frame_portrait (story; `story_1` home resminde de) |
| `venue` | `media.venue_image` | 782/505 | frame_landscape (details; home resminde de) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` portre
50% 38%, mekân 50% 55%. Mekân penceresi ≈ 1,55:1 (GPT'nin 3:2'si tuttu). "Your photo here" yalnız önizlemede; misafir nötr yer
tutucuyu (bg_page'in kümesiz sisinden bulanık + fildişine tonlanmış kırpım) görür; `build_images.py` her yer tutucunun en koyu
pikselini (≥ 150) ve doygunluğunu (≤ 40) ölçer (`manifest.ph_*`).

## Görseller (`python3 platform/themes/enchanted-forest-storybook/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre**. parts_prep'in ön cep kesimi (`envelope_pocket_front.png`, "geometrik V" uyarısı)
  kitap tipinde anlamsızdır, kullanılmaz (docs/11 §5.3).
- **Kitap kesimi** (`tema_build.kitap_kes`, `method: renk`): oluk (sırt) açık kitapta x = 761,5 (kapalı kapağın sol kenarı ±%4
  içinde en koyu sütun); solu `book_cover_in` (kapağın astarlı içi), sağı `book_page` (ilk sayfa + sayfa yığını + arka kapak
  kenarı); kapalı kitap = `book_cover`.
- **Çevrilen yaprak** (`book_leaf`, bu tasarımın `yaprak_kes`'i): `book_page`'in yalnız krem ilk yaprağı — oluktan sonra kremin
  başladığı sütun (784) → sayfa yığınının ilk koyu çizgisi (1406), ilk/son krem satırı (73–898); yuvarlak köşeler görselin
  kendi kremi. Yığın ve arka kapak kenarı `book_page`'de kalır, yaprakla dönmez. Arka yüzü aynı dosya, CSS `scaleX(-1)`
  (docs/11 §7.5 "aynalı page") — sırtın solunda (`book_leaf_back` kutusu sırta göre ayna).
- **Hiza**: `kit_check` / `hiza_olc("kitap")` geçiyor (sırt +0,23 · üst −0,10 · alt +0,29 · sağ +0,20 %) — dönüşüm yok.
- **Kapanış** (pirinç toka, kapakla **taşınmaz**): çapa = kapalı kapağın sağ kenarı, yarı yükseklik (docs/11 §7.1 kitap);
  W1.1 comp'ta ölçülen toka genişliği / kitap genişliği (0,2417) ve toka merkezinin çapaya göre kayması (−0,0874, −0,0177 ×
  kitap genişliği) — ölçüm `build_images.py` COMP yorumunda. Dönme ekseni menteşe silindiri (`hinge_x_pct` 91,44).
  `compare_closure.jpg` (previews/g413): tema | comp.
- **Kart yolu**: kart (card_small) yaprağın %66'sı genişlikte, sayfanın ortasında düz yatar; `lift` boyunun %4'ü yukarı ×
  1,08, `forward` açık çift sayfanın ortasına × 1,4 (`manifest.stage.card_path`); sahne kutusu bu yolu kapsar.
- **Zeminler**: telefon `mist` = bg_page'in kümesiz orta sisi (x 250–830, y 250–1250); geniş ekran (en/boy ≥ 5/4) `mist_wide` =
  bütün genişlikte kümesiz bant (y 630–985). Aynalı geniş zemin denendi: 1280 px'te ek yerlerinde ağaç gölgeleri simetrik
  "mürekkep lekesi" gibi görünüyordu, bırakıldı. Köşe kümeleri hep ayrı katman (`decor_tl` / `decor_br`), ekranda bütün.
  Uzun sayfaların zemini `bg_tile` (bg_page'in orta sis rengine çekilmiş), sayfa rengi `#DED8B8`.
- **Kartlar** (`free_zone` + 3 dilim): eskitilmiş kâğıdın lekeleri `serbest_bolge`'nin 28 eşiğinde her satırı "süslü"
  sayıyordu → eşik 52 (`free_zone_threshold`; boyalı süs kâğıttan > 80 uzak). Davet kartı dilimleri %37–59, bilgi kartı
  %17–91. **Orta bant gerilmez**: düz bandın ortasından bir şerit + dikey aynası (`invitation_band`, `info_band`) `repeat-y`
  ile döşenir; dilim ek yerleri 6cqw yumuşak maskeyle kesişir (eskitilmiş kâğıt ortada köşelerden açık).
- **Ağırlık**: kitap kapağı (kabartma varak + kumaş dokusu) q 72 ile 640 px'te < 150 KB; kümeler alfa kalitesi 60.
- **Yeşil denetimi**: `tema_build.yesil_gorunur` eğrelti/yosun yeşilini de sayıyor → `kroma_yesil()`: parlak kroma yeşili
  (G ≥ 190, fazla ≥ 60) her WebP'de 0; yaprak sayıları `manifest.checks.green_check`'te.

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the brass clasp unhooks and swings away, the moss-green cover swings open to the left like a
  storybook, the first page turns, and the card rises from the page while tiny fireflies glow up around it."): dokununca
  ipucu söner, kitap hafifçe sıkışır; **toka** (90 ms'den) menteşesinde izleyiciye doğru kalkıp kancadan çıkar (rotateY
  40°), sağa savrulur ve dönerek ekranın altından düşer (kitabın üstünde sönmez); **kapak** (880 ms) sırtında 0° → −90°
  döner (kenardan görünür olunca söner), astarlı iç yüz −90°'den sola yatar (1580 ms); bu sürede açık çift sayfa ortalanır
  ve ekrana sığacak kadar küçülür (docs/11 §7.5: `scale(min(1, .94 × 100vw / açık genişlik))`, 390 px'te ≈ 0,61); **ilk
  sayfa çevrilir** (2260 ms: yaprak sırtında 0° → −90°, aynası 90° → 0° sola iner); altında yatan **kart sayfadan kalkar**
  (3240 ms: ölçek + öteleme + büyüyen gölge) ve **aynı anda** 7 minik GPT ateş böceği (accent_1, CSS ışıltısı) kartın iki
  yanından yanıp sönerek yükselir; kart açık kitabın ortasına öne gelir (× 1,4) ve view transition ile home kartına uçar.
  Dokun → home 4,5 s (Skip her an).
- **Story:** sayfa (info_card) sol kenarında sayfa çevrilir gibi yerine oturur (`turn`); her resim kendi sahnesi: sayfaya
  bastırılır (`mount`: hafif dönüp küçülerek yerleşir), sonra yanındaki eğrelti filizi ve ateş böceği, sonra alt yazısı
  yazılır. Telefonda resim sayfanın %62'si (foto penceresi 390 px'te ≈ 39,8vw ≥ 38vw), zikzak korunur (sol, sağ, sol; alt
  alta); ≥ 720 px comp'taki gibi resimler yükseklikte üst üste biner.
- **Parçacıklar** (`MOTION.accents`, hep GPT ateş böceği, `path: 'rise'`): açılış 7 (kartın çevresi) · home'a varış 4 (hero'nun
  yazı sütununun iki yanındaki şeritlerde) · RSVP kapanışı 4 (yalnız `.closing` kutusunda).
- **Boyalı kartlar** (davet, Order of the Day, RSVP, story sayfası): `turn` girişi — sayfa çevrilir gibi oturur, **hep opak**
  (theme-check'in kart piksel testi gerçek kart üstünde ölçer). RSVP kartındaki toka en son yükselir.
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms, tek giriş 600–1800 ms.

## İlk ekranlar ve yatay telefon
- 05/08'in çözülmüş adımları korunur: `fitNames` (isimler en çok %24 küçülür → `.is-tight` + isimler **40 px tabanı** —
  Tangerine'in gövdesi küçük, el yazısında 36 değil 40 → `.is-long` (sayaç hapın altına) → hero kaydırılır), ardından `fold`.
  Kısa yatay (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px) ızgara: kart solda, isimler · tarih · mekân · şehir · sayaç · hap
  sağda.
- **İç sayfalar** (`folds`): her ilk ekran öğesi ya nav'ın üstünde biter ya da ilk ekranın tamamen altında başlar
  (`[data-fold]`). Story'de **sayfa bir bütün**: `data-fold=".p-1"` — sayfa ilk resmiyle ölçülür, ilk resim nav çizgisini
  keserse (küçük bir kaldırma yetmezse) sayfa ilk ekranın altından başlar (boş bir kâğıt üst bandı kalmaz).
- **Kitap sayfası** (`envFit`): "Tap to open" ilk ekranda bitmiyorsa sahne küçülür (`--ok`, en az 0,6); açık çift sayfa ölçeği
  `--s` (genişlik ve yükseklikten).

## Dekor ve metin (`site.js` `decor`)
- Köşe kümeleri **hep bütün** GPT parçası; yalnız ekran kenarı keser. Hero'nun sağ alt kümesi ilk ekranda nav'ın üstünde biter.
- Sis üstündeki hiçbir yazı bir kümenin yaprağı üstünde durmaz: `decor` her kümenin 16 × 16 doluluk haritasını (WebP alfası,
  `build_images.py` `map16`) yazı kutularıyla karşılaştırır; çakışırsa küme %6 adımlarla küçülür (en çok %45), yine çakışırsa
  gizlenir. Yazıya, karta, resme ya da kapalı kitaba değen süzülen ateş böceği gizlenir.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| sisli orman, ateş böceği bokehi, ağaç silüetleri | `.scene-bg` `mist` (telefon) / `mist_wide` (geniş) | bg_page 2:3 telefonda kümeleri keserdi: zemin kümesiz kırpım (geniş ekranda büyütülmüş, yumuşak) |
| sol üst sarmaşıklı gövde + yüksük çiçekleri, sağ alt eğrelti + mantarlar | `decor_tl` / `decor_br` ayrı katman | **sapma:** GPT kümeleri L biçimli kenar kümesi (comp'taki ağaç gövdesi parçalarda yok); ekranda bütün |
| sisin içinde iki ateş böceği | `.float.f-fly1`, `.f-fly2` (accent_1 + ışıltı) | yazıya/kitaba değerse gizlenir |
| "YOU ARE INVITED" + çizgi · sarmaşık · çizgi | `.env-head .kicker` + `.env-head .orn` (GPT divider + iki 1 px çizgi) | |
| isimler (el yazısı) | `h1.names` (Tangerine Bold + `.amp` italik IM Fell) | uzun isimde `site.js` küçültür |
| yosun yeşili kabartma bordürlü kitap, sırt solda | `.book-cover` | |
| pirinç yaprak tokası, kapağın sağ kenarında yarı yükseklikte | `.closure` (kapaktan ayrı) | ölçü ve yer comp'tan (manifest.closure); **sapma:** GPT tokası comp'takinden ~%10 basık (genişlikle ölçeklendi) |
| "TAP TO OPEN" + altında çizgi · sarmaşık · çizgi | `.env-hint p` + `.env-hint .orn` | kısa yatayda sarmaşık gizli |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| krem kitap sayfası kartı, dört fotoğraf köşeliği, "We're getting married", "AUGUST 14, 2027 · PORTLAND" | `.hero-card` (card_small + `hero_portrait`) | dar kartta tarih ve kasaba iki satır (`fitCopy`); kasaba = `venue.city` (comp gibi; docs/11 §3.2 `venue.city_region` der — **sapma**, 05/08 ile aynı) |
| isimler | `h1.names` | |
| çizgi · sarmaşık · çizgi | `.hero-orn` | 9:16'dan basık telefonlarda gizli (ilk ekran) |
| "SATURDAY · AUGUST 14, 2027" | `.hero-date` | |
| "Fernwood Glen" (italik), "Portland, Oregon" (italik) | `.hero-venue`, `.hero-city` (`venue.city_region`) | |
| dört kâğıt kutulu geri sayım | `.countdown` sade serif rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7); IM Fell'in rakamları eski üslup (düşen) — kitap tipine uygun |
| ince altın çizgili yosun yeşili RSVP hapı (içinde iki küçük dal) | `.hero-cta .btn` | arayüz hapı + 1,5 px altın iç çizgi; **sapma:** hapın içindeki dallar GPT parçası değil, çizilmedi |
| alt gezinme (ince çizgi, geçerli sayfa altı çizili) | `.site-nav` | |
| köşe kümeleri, ateş böcekleri | `decor_tl` / `decor_br`, `.float` | |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim: üstte eğrelti/sarmaşık/mantar çelengi, alt köşelerde kümeler, ince mürekkep çerçeve; AY \| gün \| YIL iki 1 px ayraçla), "Kindly reply by" + RSVP, takvime ekle, iki köşelikli resim (`frame_portrait` + story_1 → Our Story, `frame_landscape` + mekân → The Day + programın ilk 4 satırı), "With love" + isimler + "Open the book again" (`decor_br`) | bu tasarımın parçaları |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", çizgi · sarmaşık · çizgi, "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .orn`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| tek uzun krem masal kitabı sayfası (details kartıyla aynı) | `.story-paper` (info_card 3 dilim, aynalı bant) | sayfanın üstündeki sarmaşık+mantar dalı info_card'ın kendi parçası (comp'taki story sayfasında yok) |
| üç köşelikli resim, zikzak sol–sağ–sol | `.pic` × 3 (frame_portrait + foto) | **sapma (telefon):** comp'ta resimler yükseklikte üst üste biner (~%40 genişlik); telefonda resim %62 (pencere ≥ 38vw, docs/11 §9), zikzak korunur ama alt alta; ≥ 720 px comp'taki bindirme |
| her resmin yanında küçük sarmaşık dalı | `.sprig` (accent_3) | **sapma:** tek başına sarmaşık dalı parçası yok; GPT eğrelti filizi |
| resimler arasında ateş böcekleri (noktalı iz) | `.fly` (accent_1 + ışıltı) | noktalı iz çizilmedi (K21) |
| alt yazılar + altında çizgi · sarmaşık · çizgi | `figcaption` + `.pic .orn` | |
| sayfanın altında gezinme | `.site-nav` (sabit) | **sapma:** gezinme her sayfada aynı sabit bant |
| köşe kümeleri | `.page-bg` ilk ekranda; `decor_br` sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| sisli orman, köşe kümeleri, ateş böcekleri | `.page-bg` | kart kümenin önünde |
| ince mürekkep çerçeveli, üstte sarmaşık + iki mantar dalı olan uzun krem sayfa, "Order of the Day" | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar/kısalır (1–10 satır) |
| saat / ETKİNLİK / yer (italik), ortalı | `.sched-row` | |
| satır arası sarmaşık + iki mantar + ateş böceği, iki yanında ince çizgi | `.row-orn` (GPT divider + iki 1 px çizgi; ilk satırda yok) | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| köşelikli yatay kart, mekân fotoğrafı | `.venue-photo` (frame_landscape + `venue`) | |
| "Fernwood Glen" (el yazısı), "Portland, Oregon" | `.venue-name`, `.venue-place` (`city_region_country`, + adres, tören cümlesi) | **sapma:** comp'ta ad ve yer kartın içinde; GPT frame_landscape'in penceresi kartın %82'sine iniyor, altında yazı yeri yok → kartın altında |
| çizgi · sarmaşık · çizgi, "DRESS CODE · Garden formal" | `.dress` | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| sisli orman, köşe kümeleri | `.page-bg` | kart kümenin önünde |
| details'teki sayfa (info_card) | `.rsvp-card` (3 dilim) | |
| "Will You Join Us?" (iki satır) | `h1.card-title` | |
| çizgi · sarmaşık · çizgi, "KINDLY REPLY BY", "July 3, 2027" (italik) | `.unit` (`.orn`, `.kicker`, `.deadline`) | `data-if="rsvp.deadline"` |
| yosun yeşili RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU" | `.wait` | |
| çizgi · sarmaşık · çizgi, "WITH LOVE," + isimler | `.sig-unit` (`.orn`, `.kicker`, `.sign`) | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür (`--sg` ≥ 0,72) |
| kartın tabanında kitabın pirinç tokası | `.card-clasp` (closure) | comp'taki boy (kart genişliğinin ~%22'si) |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075 kuralı)
Düğünden sonra aynı sayfalar `data-if="thank_you_on"` ile teşekkür hâline döner; yeni sayfa ve yeni görsel yok (K21):
- **Kitap:** açılış aynen; üst satır "With love and thanks" (`ty_kicker`); kartta teşekkür başlığı (`thank_you_title`, el yazısı)
  + tarih. Kart penceresinde teşekkür fotoğrafı; yoksa **sisli orman üstünde kitabın tokası** — asla yer tutucu.
- **Home:** hero kartı aynı; isimler, tarih, mekân kalır; geri sayım ve RSVP hapı yok. Davet kartının yerine aynı
  `invitation_card` kâğıdında (3 dilim) **teşekkür kartı**: başlık, mesaj (`white-space: pre-line`), "With love,", isimler,
  tarih. Yanıt satırı ve takvim yok; resimlerde Our Story ve The Day kalır (çift Details'i gizlerse The Day resmi yok).
- **Details:** "The Day" (program, mekân, harita, registry); takvim, dress code, Travel & Stay, SSS ve RSVP linki yok; tören
  cümlesi geçmiş zaman. Çift gizlerse sayfa 404 (story'nin kapanış düğmesi Home'a döner).
- **RSVP:** kartta "Replies are closed" + teşekkür başlığı + Home hapı + imza + toka; bekleme satırı ve form yok.
- **Nav:** Details etiketi "The Day" (`nav_day`), RSVP yok. Stiller `thank-you.css`'te.

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar, `theme.json` → `copy`; `node scripts/copy-manifest.ts --theme
enchanted-forest-storybook --check` temiz). `max` değerleri 08'den başlatıldı ve `theme-check --stress` ile 360/390'da
(teşekkür hâli dahil) doğrulandı. Formda "Number of guests"in hemen altında `<template data-rsvp-party>` (formun kendi `.field`
stili, `form_party` + `form_optional`).

## Bilinen sınırlar
- **Yazı tipleri yalnız `latin`** (Tangerine ve IM Fell English'in Google Fonts yanıtında `latin-ext` bloğu yok): Latin-1
  aksanları (é, ü, ñ, ç, ö) çalışır; ł, ő, ğ, ş, ı gibi harfler yedek yazı tipine düşer (docs/11 §12). Katalog çifti korunuyor;
  geniş alfabe gerekirse başlık için latin-ext'li bir eş seçilmeli (önerilen görev, Sonuç'ta).
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim).
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez. Monogram (`initials`) kullanılmaz: kapanış bir
  pirinç toka (mühür değil, boş oval yok).
- Açık kitap telefonda ekrana sığmak için küçülür (390 px'te ≈ 0,61): kitap kapalıyken büyük, açılınca kart öne gelip home'a
  uçar.
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, `cqw`, kesişen belge view transition, 3B
  `rotateY` + `perspective`), Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.

## Ölçümler (2026-10-15)
| Ölçüm | Sonuç |
|---|---|
| `theme-check --theme enchanted-forest-storybook --stress` | 128 geçti · 0 hata · 0 uyarı (`previews/g413/checks.json`) |
| Dokun → home | 4806 ms (yüklü makinede; `MOTION.envelope.go` 4500 ms) · reduced-motion 343 ms |
| İlk ekran (390 × 844, DPR 3) | index 938 KB / home 993 KB (yer tutucu) · index 1043 KB / home 1304 KB (örnek fotoğraf) — sınır 1536 KB |
| `img/` | 2,38 MB (WebP + srcset); `site.css` 45,7 KB · `site.js` 35,2 KB |
| Kontrast (WCAG) | mürekkep 10,1:1 (sis üstü 10,9) · ink-soft 7,1 · el yazısı mürekkebi 6,2 · yosun 5,2 · hap yazısı 5,0 |
| `kit_check --paket 5` / `--paket 2` | 23/23 (kitap hizası sırt +0,23 · üst −0,10 · alt +0,29 · sağ +0,20 %) / 5/5 |
| Testler | tema testi 38/38 · `npm test` 634/634 · typecheck temiz · build + trace-check geçti · g051-browser 44/44 · final-smoke 45/45 |
