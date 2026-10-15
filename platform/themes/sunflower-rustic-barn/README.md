# Tema: sunflower-rustic-barn (tasarım 16 · Sunflower Rustic Barn, G416)

Kır düğünü: altın saat ışığında krem zemin, alt kenarda soluk ahşap; sol üst ve sağ alt köşede gerçekçi suluboya ayçiçeği,
buğday, papatya ve yaprak kümeleri; süzülen ayçiçeği yaprağı, küçük ayçiçeği başı ve buğday başağı. Kraft kâğıt zarf, köşeleri
yuvarlak kare kapak, içi hardal–krem kareli astar; zarfı yatay saran geniş hardal kareli kurdele, ortada büyük fiyonk ve
düğümde küçük bir ayçiçeği. Kaushan Script (isimler, başlıklar, alt yazılar) + Merriweather (aralıklı büyük harf satırları,
italik mekân/yer satırları, gövde metni). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi
`platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından
(`collections/16_Sunflower_Rustic/assets/gpt/comps/web_1..5`); bütün görseller bu tasarımın GPT parçaları (K21, kod çizimi
yok). 08 (winter-evergreen) temasından yalnız platform sözleşmesi ve çözülmüş ilk ekran adımları alındı (motor işaretleri,
RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` +
`[data-fold]`, yatay telefon ızgarası, `decor`, `fitCopy`, `devRender`, teşekkür hâli, `data-copy`, misafir adları satırı);
görünüş, aralıklar, süs konumları, zamanlama, kart oranları ve bölümler bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Sunflower Rustic Barn", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 standart copy anahtarı (G068) |
| `content.demo.json` | `collections/16_Sunflower_Rustic/content.demo.json`'ın birebir kopyası (servis edilmez) |
| `index.html` | kapalı zarf → dokun → fiyonk gevşer, kurdele ayçiçeğiyle birlikte bant boyunca kayıp çıkar, kraft kapak açılır, zarfın altında ahşap masa belirir, kart yükselip masaya öne kayar, birkaç ayçiçeği yaprağı dönerek düşer → home (view transition) |
| `home.html` | hero (W1.2), davet kartı (invitation_card, 3 dilim), "Kindly reply by" + RSVP, takvime ekle, jüt ipe mandallı iki baskı (story_1 → Our Story, mekân → The Day + programın ilk 4 satırı), ahşap zeminde kapanış |
| `story.html` | W1.3: başlık + alt başlık + sprey + giriş cümlesi; ahşap duvar (GPT barnwood, 90° döndürülmüş) üstünde üç sarkık jüt ip, her birine bir eski baskı mandallanır, yanında küçük ayçiçeği/başak, alt yazı |
| `details.html` | W1.4: Order of the Day (info_card, 3 dilim; SAAT \| ETKİNLİK / yer, satır aralarında GPT sprey), takvime ekle, mekân (GPT yatay baskı + mandal + ip), mekân adı, şehir/bölge/ülke, dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim): başlık, sprey, son tarih, hap, bekleme satırı, "With love," + isimler, kartın tabanında zarfın kurdelesi (closure); platform yanıt formu (G042 + G051 + G069), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`sway-tl/br`, `set`, **`peg`**, **`tie`** bu tasarımın), foto alanı + maske, zarf/kurdele/masa katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri (45 039 B) |
| `thank-you.css` | teşekkür hâli (yalnız düğünden sonra yüklenir) |
| `site.js` | `MOTION`, `ENVELOPE_GEOMETRY`, ilk ekran/uzun isim (`fitNames`, `fold`, `folds`, `envFit`), `decor` (16 × 16 küme haritası), `fitCopy`, geri sayım, zarf, `DEV_CONTENT` + `devRender` (≈ 34 KB) |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/parts_prep.py` + `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | zarf 5 katman + kurdele, `florals_tl/br` 360/540/720, `twine_line` 480/960, `barnwood` 480/800 (masa), `barnwall` 640/1024 (story duvarı), `field` / `field_wide` / `wood_foot` zeminleri, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 529/622 | card_small'ın gingham kenarlı penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 563/703 | frame_portrait (story; `story_1` home'daki baskıda da) |
| `venue` | `media.venue_image` | 936/579 | frame_landscape (details; home'daki baskıda da) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` portre
50% 38%, mekân 50% 55%. Mekân penceresi 1,62:1 (3:2 fotoğraf `cover` ile hafif kırpılır). "Your photo here" yalnız önizlemede
(simge: GPT ayçiçeği başı); misafir nötr yer tutucuyu görür: `bg_page`'in çiçeksiz güneşli krem bölgelerinden bulanık + fildişine
tonlanmış kırpımlar. `build_images.py` her yer tutucunun en koyu pikselini (≥ 170) ve doygunluğunu (≤ 70) ölçer.

## Görseller (`python3 platform/themes/sunflower-rustic-barn/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `kit_check --paket 5` 25/25 (hiza sol +0,10 · sağ −0,20 · alt +1,43 %; kurdele uçları −0,39 / −0,10 %), `--paket 2` 5/5.
- **Kapak** (`env_cflap`): `tema_build.kapak_kes("egri")`, `method: renk` — yuvarlak köşeli kapağın alt kenarı x 118–936'da
  bulundu (artık sapması 0,95 px). Sol alt yuvarlak köşe (x 74–117) aralığın dışında kaldığı için kapak orada "yok" sayılıyordu:
  `kose_tamamla` köşeyi ölçülen çeyrek elipsle tamamlar (merkez (117, 844), yarıçap 43 × 93 px; x 80–116 arasında her 4 sütunda
  ölçülen kenar düşüşüyle ≤ 2 px). Kapağın yan kenarlarının dışı (x < 74, x > 952) gövdenin yan şerididir, kapak değil.
- **Ön cep** (`env_pocket`, `cep_kraft`): `tema_build.cep_kes("duz"/"egri")` cebin V katlama çizgisine (y ≈ 1254) oturdu. Burada
  her sütunda gövdenin altından yukarı çıkılır: kraft (lum < 190, G − B < 64, R − G > 30) bitip 6 satır kareli astar görülen yer
  kenardır, üstteki açık yırtık şerit cebe dahildir; ortadaki sütunlardan (x 220–840) doğru uydurulur (y ≈ 850, sapma 1,8 px).
  Yan kraft kulakları gövde katmanında kalır (kart onların arasından geçer). Kesilen katmanlar açık zarfı birebir kurar.
- **Kapanış = sarılı kurdele** (`closure.png`, zarfla aynı 1024 × 1536 tuval, 1:1; kapakla taşınmaz): yeri kendi alfa kutusu
  (`manifest.closure.anchor` "1:1 canvas overlay"). Gevşeme odağı = ayçiçeğinin koyu göbeği (`knot_pct_of_closure` 51,26 / 30,11).
  `previews/g416/compare_closure.jpg`: tema | comp.
- **Ek parçalar:** `barnwood` (yatay soluk ahşap tahtalar) açılışta zarfın altındaki masa; aynı parça 90° döndürülerek
  (`barnwall`, yalnız döndürme) story duvarının dikey tahtaları — CSS'te `sepia(.25) brightness(.86)` ışık ayarı (§5.7: parçaya
  filtre). `twine_line` alfa kutusuna kırpılır; sarkma `manifest.twine_line.sag` (uçlar %13 / %9, orta %94).
- **Zeminler:** telefon `field` = `bg_page`'in iki çiçeksiz kırpımı (güneşli krem x 150–1000 y 250–1150 + sol alttaki ahşap
  zemin x 0–500 y 1330–1536, 110 px yumuşak geçiş); geniş ekran `field_wide`; uzun sayfaların sonu `wood_foot` (ahşap zemin).
  Ayçiçeği kümeleri hep ayrı katman (`florals_tl` / `florals_br`), düz çizgiyle kesilmez.
- **Kartlar:** `free_zone` + 3 dilim (`slices`: davet kartı %24–45 — sağ üst ayçiçeği %20'ye, sol alt buket %44'ten başlar;
  bilgi kartı %21–95). og: `web_hero` alt hizalı 1,91:1; favicon: kurdelenin fiyonk + ayçiçeği bölgesi. Tema klasörü ~2,5 MB.

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the gingham bow tugs loose and the ribbon slides off with its little sunflower, the kraft flap
  flips open, and the card slides out onto the weathered barn-wood tabletop (barnwood.png) while a few sunflower petals
  tumble."): dokununca (0 ms) **fiyonk çekilip gevşer** (ayçiçeği düğümü çevresinde −2,5° / %3,5 şişme / geri oturma, 460 ms);
  380 ms'den **kurdele ayçiçeğiyle birlikte bant boyunca sağa kayar**, hızlanarak zarfın sağ kenarında arkaya döner
  (`.closure-clip` = zarfın sütunları; solmaz, 1,08 s); **kraft kapak** menteşesinde izleyiciye doğru kalkar (1,16 s; 82°'den
  sonra söner), kapalı gövde açık gövdeye geçer, kareli astarlı açık kapak −90°'den dikilir (1,9 s); 1,3 s'den **ahşap masa**
  zarfın altında belirir (GPT barnwood, yumuşak maskeli kenar); 1,7 s'de **5 ayçiçeği yaprağı** (accent_1, 16–26 px, 420°'ye
  kadar dönerek) yukarıdan düşer; **kart cepten yükselir** (2,14 s) ve **masaya öne kayar** (× 1,05, kart boyunun %3,5'i aşağı,
  büyüyen gölge, 3,44 s) → view transition ile home kartına. Dokun → home 4,32 s (Skip her an).
- **Story:** her ip kendi sahnesi (`story-line`): ip soldan sağa gerilir (`unfurl`) → 520 ms sonra baskı **mandallanır** (`peg`:
  −34 px ve −7°'den mandalın etrafında bir kez salınıp oturur, aşırı salınımlı eğri) → alt yazı yazılır (`write`). Baskılar
  sırayla, kaydırdıkça tek tek. Telefonda baskı 64vw, foto penceresi 64 × 0,80 = **51vw** (≥ 38vw); comp gibi alt alta, hafif
  sağ/sol kaydırmalı (W1.3'teki zikzak).
- **Home:** hero sırası dekor → kart → isimler → tarih → mekân → geri sayım → hap; davet kartı `set` (hep opak), sonra metinler;
  iki baskı: ip gerilir, baskı mandallanır, başlık yükselir.
- **RSVP:** kart `set` → başlık → sprey → son tarih → hap → bekleme satırı → imza → kurdele kartın tabanına soldan serilir (`tie`).
- **Parçacıklar** (`MOTION.accents`, hep GPT ayçiçeği yaprağı): açılış 5 düşen · home'a varış 3 (hero içinde, metin sütunu
  yanında) · RSVP kapanışı 4 (yalnız `.closing` kutusunda).
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms (`rsvp-card` `ribbon` 2640), tek giriş 600–1800 ms. Azaltılmış hareket:
  açılış oynamaz (dokununca doğrudan home), salınım/nefes yok, girişler anında.

## İlk ekranlar ve yatay telefon
08'in çözülmüş adımları korunur: `fitNames` (isimler küçülür → `.is-tight` + isimler 36 px tabanı → `.is-long` → hero kaydırılır),
ardından `fold`. İç sayfalarda `[data-fold]` birimleri: nav çizgisini kesen birim ilk ekranın altından başlar. Bu tasarıma özgü:
**story** — ilk ip+baskı birimi (≈ 470 px) başlık bloğuyla ilk ekrana sığmaz (390 × 844'te de); katlanınca kenar boşluğu birime
değil **duvara** verilir (`.lr-1` → `.wall`), böylece ilk ekran yarım duvar değil krem bir başlık sayfasıdır ve ahşap duvar ilk
ipiyle birlikte aşağıda başlar. **RSVP** yatayda kart `(100svh − 128px) × 1,5` genişliğe iner ki başlık ve sprey nav'ın üstünde
kalsın. Kısa yatay (en-boy ≥ 1, yükseklik ≤ 620 px) hero iki sütun.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| güneşli krem zemin, ışık huzmeleri, altta ahşap | `.scene-bg` `field` / `field_wide` | bg_page 2:3 telefonda kümeleri keserdi: zemin çiçeksiz kırpımlardan |
| ayçiçeği/buğday/papatya kümeleri sol üst, sağ alt | `florals_tl` / `florals_br` ayrı katman | ekranda bütün, kenarda taşar (comp gibi) |
| süzülen yaprak, ayçiçeği başı | `.float` (accent_1, accent_2) + `accent_3` başak | üçüncü süs başak (comp'ta ikinci bir yaprak) — tasarımın üç accent'i |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (fırça yazısı) | `h1.names` (+ `.amp` italik Merriweather) | uzun isimde `site.js` küçültür |
| kraft zarf, yuvarlak köşeli kapak | `.env-closed` + `.env-cflap` | |
| hardal kareli kurdele + fiyonk + ayçiçeği | `.closure-clip > .closure` (1:1) | |
| "TAP TO OPEN" + altında çizgi · süs · çizgi | `.env-hint p` + `.env-hint .orn` (GPT divider + iki 1 px çizgi) | comp'taki süs küçük kalp; burada tasarımın GPT spreyi (kalp parçası yok) |
| — | `a.skip`, "Enter / Replay the opening", ahşap masa (`.table`) | platform gereği / açılış cümlesi |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| krem kart, gingham kenarlı pencere, köşede ayçiçeği + fiyonk, "We're getting married", "AUGUST 28, 2027 · FRANKLIN" | `.hero-card` (card_small + `hero_portrait`) | hafif eğik (−1,5°) comp gibi; kasaba = `venue.city` (W1.2 yalnız kasabayı yazar — 05/08 ile aynı sapma) |
| isimler | `h1.names` | |
| "SATURDAY · AUGUST 28, 2027" | `.hero-date` | |
| "Golden Field Barn", "Franklin, Tennessee" (italik) | `.hero-venue`, `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade serif rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| hardal RSVP hapı | `.hero-cta .btn` | arayüz hapı (degrade + iç gölge) |
| alt gezinme | `.site-nav` (`::before` 1 px çizgi) | comp'taki "· ♥ ·" ayırıcı yerine nokta (kalp parçası yok) |
| köşe kümeleri, süzülen parçalar | `florals_*`, `.float` | |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim: gingham bant + sağ üst ayçiçeği + sol alt buket; HAFTA GÜNÜ, gün fırça yazısıyla, AY · YIL, saat), "Kindly reply by" + RSVP, takvime ekle, ipe mandallı iki baskı (story_1 → Our Story, mekân → The Day), "With love" + isimler + "Open the envelope again" (ahşap zemin + `florals_br`) | bu tasarımın parçaları |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR", çizgi · süs · çizgi | `h1.page-title`, `.page-head .kicker`, `.page-head .orn` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| dikey tahtalı ahşap duvar | `.wall::before` (`barnwall` = GPT barnwood 90°) | barnwood GPT'den yatay tahtalı geldi; döndürüldü, ışığı CSS filtresiyle koyulaştırıldı |
| üç sarkık jüt ip, her birinde mandallı bir baskı | `.line-row` × 3: `img.twine` + `.print` (frame_portrait + foto) | comp'taki gibi alt alta; hafif sağ/sol kaydırma |
| baskıların yanında küçük ayçiçeği/papatya spreyleri | `.tuck` (accent_2 ayçiçeği başı, accent_3 başak) | comp'taki spreyler ayrı GPT parçası değil; tasarımın accent'leri |
| alt yazılar baskının alt kenarında (fırça yazısı) | `figcaption` baskının altında, duvarda krem yazı + gölge hâlesi | **sapma:** GPT baskısının alt kenarı (%8) yazı için dar; uzun başlık taşardı |
| köşe kümeleri | `.page-bg` ilk ekranda; `florals_br` + ahşap zemin sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| krem kart, üstte gingham bant + ayçiçeği–buğday dalı | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar/kısalır (1–10 satır) |
| "4:00 PM — CEREMONY — The Sunflower Field" satırları | `.sched-row` ızgara: saat \| ETKİNLİK / yer (italik) | **sapma:** telefonda yer etkinliğin altına iner (üç sütun 360 px'te sığmaz) |
| satır arası küçük sprey | `.row-orn` (GPT divider; ilk satırda yok; 6+ satırda yalnız boşluk) | |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mandal + jüt ipte yatay baskı (mekân) | `.venue-photo` (frame_landscape + `venue`) | |
| "Golden Field Barn", "Franklin, Tennessee" | `.venue-name`, `.venue-place` (`city_region_country`, + adres, tören cümlesi) | |
| "DRESS CODE · Country chic" | `.dress` (`.orn` + satır) | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| krem kart, gingham bant + dal | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?" | `h1.card-title` | |
| başlık altı sprey | `.t-orn` (GPT divider) | |
| "KINDLY REPLY BY JULY 17, 2027" | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| hardal RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU" | `.wait` | |
| "With love, Daisy & Wyatt" | `.sig-unit .sign` (iki satır) | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür |
| kartın tabanında zarfın kurdelesi + fiyonk + ayçiçeği | `.card-ribbon` (closure, kart genişliğinde) | fiyonk kartın alt kenarından biraz sarkar (comp gibi) |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075)
Aynı sayfalar `data-if="thank_you_on"` ile döner; yeni görsel yok: zarf aynen açılır, üst satır "With love and thanks"; kart
penceresinde teşekkür fotoğrafı, yoksa **ahşap üstünde zarfın kurdelesi** (asla yer tutucu). Home: geri sayım/hap/yanıt/takvim yok,
davet kartının yerine aynı kâğıtta teşekkür kartı. Details: "The Day" (takvim, dress code, travel, SSS yok; tören cümlesi geçmiş
zaman; çift gizlerse 404). RSVP: "Replies are closed" + teşekkür başlığı + Home hapı; form yok. Stiller `thank-you.css`'te.

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar; `node scripts/copy-manifest.ts --theme sunflower-rustic-barn
--check` temiz). Formda "Number of guests"in hemen altında `<template data-rsvp-party>` (formun kendi `.field` stili).

## Bilinen sınırlar
- Program en çok 10 satır (şema); kart uzar (3 dilim). 6+ satırda satır arası sprey kalkar.
- Story başlıkları baskının üstüne değil altına, ahşap duvara yazılır (yukarıdaki sapma).
- `story.items` 3'ten fazlaysa ilk 3; `text` gösterilmez. Monogram (`initials`) kullanılmaz: kapanış mühür değil kurdele.
- Comp'taki "♥" süsü ve kutulu geri sayım GPT parçası olarak yok (sade arayüz kullanıldı).
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ.
