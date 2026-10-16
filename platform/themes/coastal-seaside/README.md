# Tema: coastal-seaside (tasarım 20 · Coastal Seaside, G420)

Okyanus kenarı: soluk deniz sisi suluboyası; sol üstte kumsal köşesi (kumul otu, ay salyangozu kabuğu, mercan, deniz camı,
kum ve köpük), altta köpüklü kıyı dalgası ve kum, sağ altta büyük deniz tarağı kabuğu ve deniz camları; sağ üstte süzülen bir
deniz camı ve deniz yıldızı. Benekli kum rengi zarf, V kapağı kıyı çizgisi gibi dalgalı kesik; kapağın ucunda kısa bir sicim
halkası üstünde deniz tarağı kabuğu. Astar okyanus suluboyası. Allison (isimler, başlıklar) + Lora (aralıklı büyük harf
satırları, italik mekân). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi `platform/README.md`. Yerleşim,
tipografi ve hiyerarşi bu tasarımın W1 comp'larından (`collections/20_Coastal_Seaside/assets/gpt/comps/web_1..5`, yalnız sade
adlar); bütün görseller bu tasarımın GPT parçaları (K21). 08 (winter-evergreen) temasından yalnız platform sözleşmesi ve
çözülmüş ilk ekran mekanikleri alındı (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları,
`data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` + `folds`, yatay telefon ızgarası, `devRender`, aynı zarf tipi
için kart yolu hesabı); görünüş, renkler, süs konumları, açılış, story dizilişi, kart oranları ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Coastal Seaside", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 copy anahtarı |
| `content.demo.json` | `collections/20_Coastal_Seaside/content.demo.json`'ın birebir kopyası (servis edilmez) |
| `index.html` | kapalı zarf → dokun → suluboya dalga (GPT `wave.png`) ekranı soldan sağa geçer ve kabuk + sicimi önünde taşıyıp götürür, dalgalı kapak yukarı açılır, kart gelgit gibi yükselir, öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + lomboz foto, isimler, gün · tarih, mekân, şehir/bölge, geri sayım, okyanus mavisi RSVP hapı), davet kartı (`invitation_card`, 3 dilim; AY \| gün \| YIL), tek "Kindly reply by" satırı, takvime ekle, iki lomboz (story_1 yuvarlak lombozda → Our Story; mekân geniş oval lombozda → The Day + programın ilk 4 satırı; ikisi kendi kenarından kayarak gelir), kapanış (kıyı + sağ alt küme) |
| `story.html` | W1.3: başlık + alt başlık + giriş cümlesi; üç pirinç lomboz zikzak (sol, sağ, sol), her biri kendi kenarından kayarak gelir ve hafifçe döner (`slide-l`/`slide-r`), yanında bir kumsal parçası (kabuk, deniz camı, deniz yıldızı), altında el yazısı başlık |
| `details.html` | W1.4: Order of the Day kartı (`info_card`, 3 dilim; saat · ETKİNLİK · yer, satır aralarında GPT kabuk sırası + iki ince çizgi), takvime ekle, mekân (geniş oval lomboz), kabuk sırası + dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (`info_card`): başlık, kabuk sırası, son tarih, hap, bekleme satırı, "With love," + isimler, **kartın dibindeki dalgada zarfın kabuğu**; platform yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`drift-tl/br`, `slide-l/r` bu tasarımın, `drop`, `set`), foto alanı + maske, zarf katman yüzdeleri, kart 3 dilim (orta bant döşenir), sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (yalnız düğünden sonra yüklenir) |
| `site.js` | `MOTION` (açılış, sahneler, `accents` boş), `ENVELOPE_GEOMETRY`, uzun isim + ilk ekranlar, dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, zarf + dalga, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `decor_*` 360/540/720, `wave` 640/1200, `sea` / `sea_wide` / `shore` zeminleri, `*_band` döşeme bantları, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 440/442 | card_small'ın yuvarlak lombozu (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 870/872 | frame_portrait = GM07 yuvarlak lomboz (story; `story_1` home lombozunda da) |
| `venue` | `media.venue_image` | 902/575 | frame_landscape (details; home lombozunda da) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` 50% 45%
(mekân 50% 55%). "Your photo here" yalnız önizlemede; misafir nötr yer tutucuyu (bg_page'in kümesiz deniz sisinden bulanık,
sis tonuna çekilmiş kırpım) görür. `build_images.py` her yer tutucunun en koyu pikselini (≥ 200) ve doygunluğunu (≤ 40, sis
zaten açık mavi) ölçer.

## Görseller (`python3 platform/themes/coastal-seaside/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre**. Onun "cep sınırı bulunamadı → geometrik V" uyarısı beklenir ve yok sayılır: o dosya
  kullanılmaz, cebi tema kendi keser (aşağıda).
- **Kapak kesimi** (`env_cflap`): `tema_build.kapak_kes("v")`, `method: renk` — dalgalı kenarın altındaki gölge izlenir
  (`previews/g420/cuts_envelope.jpg`).
- **Ön cep vurgu çizgisi izi** (`cep_cizgi`): açık zarfın ön yüzü iki yan kanat + düz üst kenarlı alt kanat; hepsi kum kâğıdı,
  arkadaki iç yüz de kum rengi → renk taraması kenarı bulamıyor (`tema_build.cep_kes("v")` geometrik V'ye düştü, uç y 1132;
  gerçek taban y ≈ 1003, düz). Kâğıdın her kenarında "üstte gölge, altta parlak çizgi" çifti var: yatayda 11 sütun ortalamalı
  parlaklık − ±4 satır = vurgu haritası; taban satırı orta bantta en güçlü vurgu (1003), yan kanatlar ön bilgi çizgisinin
  ±34 px bandında, 9 sütun medyanı + 2. derece aykırısız uydurma (artık medyanı sol 2,7 / sağ 2,4 px). Kesim parlak çizginin
  1 px üstünden.
- **Hiza**: `kit_check` geçiyor (sol +0,10 · sağ +0,49 · alt +1,11 %) — dönüşüm yok.
- **Kapanış** (`closure.png`, kapakla **taşınmaz**): çapa = V kapağın ucu (`kapak_kes` `tip`); W1.1 comp'ta ölçülen zarf kutusu
  (x 145–879, y 575–1038) ve kabuk + sicim kutusu (x 402–630, y 800–912) → genişlik / zarf 0,3106, merkez uca göre
  (+0,0095, −0,0281) × zarf genişliği (`manifest.closure.comp`); `previews/g420/compare_closure.jpg`: solda tema (kapalı sahne), sağda W1.1 comp'un zarf bölgesi.
- **Dalga** (`wave.png`, ek parça): alfa kutusuna kırpılır (1384 × 442), 640/1200; ilk görünümde yüklenir (açılışın parçası).
- **Zeminler**: `mist` = bg_page'in kümesiz deniz sisi (x 420–880, y 230–1020; kumul otu uçları ve kabuk kümesi dışarıda —
  qa-kontrol ilk kırpımda kalıntı buldu, daraltıldı); `sea` = `mist` + alttaki kıyı (x 0–600, y 1130–1536) 120 px yumuşak
  geçişle, **yalnız home hero'su** (tek ekranlık W1.2); zarf sayfası `mist` + ayrı alt bant `shore`; iç sayfaların ilk ekranı
  yalnız `mist` (kıyı içeriğin ortasından geçmesin, W1.3–W1.5'te kıyı sayfa dibinde), kıyı sayfa sonunda (`shore-end`);
  geniş ekran `sea_wide` (x 0–1024, y 560–1110). Kumsal kümeleri hep ayrı katman.
- **Kartlar**: `free_zone` kâğıdın kendi benekleri **ölçümden** silinerek (⅓ ölçekte 9 px medyan; görsel değişmez) — yoksa her
  benek "boyalı süs" sayılıyordu. 3 dilim: davet kartı %46–52, bilgi kartı %8–81 (kartın bütün genişliğinde temiz satırlar).
  **Orta bant gerilmez**: gerilen kum benekleri dikey çizgiye dönüşüyordu → `<ad>_band` = düz bant + dikey aynası (dikişsiz),
  `::before` `repeat-y` doğal ölçekte.
- og: `web_hero` alt hizalı 1.91:1; favicon: closure. Tema klasörü ~2,3 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the watercolor wave (wave.png) sweeps across the screen and carries the seashell and twine away,
  the wave-edged flap lifts, and the card rises like the incoming tide."): dokununca (0 ms) zarf küçük bir basınç alır,
  60 ms'de **dalga** ekranın sol dışından çıkar ve 1,7 s'de doğrusal hızla sağ dışına geçer (zarfın önünden, kabuğun
  altından); 120 ms'de kabuk su gelirken hafifçe kalkar, dalganın ön kenarı ona varınca **dalgayla aynı hızda** sağa taşınır
  (hafif zıplama ve dönme; zarfın üstünde sönmez, ekrandan çıkar); 1,15 s'de **dalgalı kapak** menteşesinde izleyiciye doğru
  kalkar (82°'den sonra söner), altında kapalı gövde açık gövdeye (okyanus astarı + ön cep) geçer, astarlı açık kapak −90°'den
  dikilir (1,97 s) → **kart cepten yükselir** (2,24 s, gelgit gibi yavaş) → olduğu yerde öne gelir (× 1,04, büyüyen gölge) →
  view transition ile home kartına. Dokun → home 4,48 s (Skip her an). Parçacık yok: cümle yalnız dalgayı anıyor (docs/11 §8).
- **Story:** her lomboz kendi sahnesi: görünüme girince kendi kenarından (sol / sağ / sol) kayarak gelir, −24° / +24°'den
  dönerek yerine oturur (`slide-l` / `slide-r`, 1,5 s), sonra başlığı yazılır. Telefonda zikzak korunur: çerçeve 52vw, foto
  penceresi 52 × 0,77 = **40vw** ≥ 38vw (G098 yuvarlak lombozda da 52 × 0,7699 = 40vw); ≥ 720 px comp gibi daha sıkı zikzak (sonraki lomboz bir öncekinin başlığı hizasında
  başlar).
- **Boyalı kartlar** (davet, Order of the Day, RSVP): `set` girişi — hep opak. RSVP kartındaki kabuk `drop` ile karta düşer.
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms, tek giriş 600–1800 ms.

## İlk ekranlar ve yatay telefon
08'in çözülmüş adımları korunur: `fitNames` (isimler küçülür → `.is-tight` → `.is-long` → hero kaydırılır; isimler ≥ 36 px
tabanı — Allison küçük x-yüksekliği nedeniyle CSS boyları 08'den büyük), ardından `fold`. Kısa yatay ızgara: kart solda,
isimler · tarih · mekân · şehir · sayaç · hap sağda. İç sayfalar (`folds`): her ilk ekran öğesi ya nav'ın üstünde biter ya da
ilk ekranın tamamen altında başlar. Zarf sayfası (`envFit`): sahnenin boş üstü (`.65648 × --w`) ölçülen başlığın altına girer.
Kıyı dalgasının üstüne düşen hero yazıları (geri sayım, hap; W1.2 de böyle) sis renginde `text-shadow` hâlesi taşır (§5.7).

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| deniz sisi, altta köpüklü dalga + kum | `.scene-bg` `mist` + `.shore-band` (`shore`, ipucunun altında) / geniş: `sea_wide` | bg_page 2:3 telefonda kümeleri keserdi: zemin kümesiz kırpımlardan; kıyı yazının altına girmesin diye ayrı bant |
| sol üst kumsal köşesi, sağ alt kabuk kümesi | `decor_tl` / `decor_br` ayrı katman | ekranda bütün |
| sağ üstte deniz camı + deniz yıldızı | `.float.f-glass` (accent_2), `.float.f-star` (accent_3) | yavaş "nefes"; zarfa/yazıya değerse gizlenir |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (el yazısı) | `h1.names` (+ `.amp` italik Lora) | uzun isimde `site.js` küçültür |
| benekli kum zarf, dalgalı V kapak | `.env-closed` + `.env-cflap` | |
| sicim halkası üstünde deniz tarağı, kapağın ucunda | `.closure` (kapaktan ayrı) | ölçü ve yer comp'tan (manifest.closure) |
| "TAP TO OPEN" + altında küçük el çizimi dalga kıvrımı | `.env-hint p` + `.env-hint .orn` (GPT kabuk sırası + iki 1 px çizgi) | **sapma:** kıvrım GPT parçası değil, çizilmedi; yerine tasarımın divider'ı |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| kum kart, pirinç yuvarlak lomboz, "We're getting married", "JULY 17, 2027 · CHATHAM" | `.hero-card` (card_small + `hero_portrait`) | **sapma:** GPT card_small comp'takinden uzun (en/boy 0,69, comp ≈ 0,92): yazı lombozun altındaki düz kâğıtta; kasaba = `venue.city` (comp gibi; 08 ile aynı) |
| isimler | `h1.names` | |
| "SATURDAY · JULY 17, 2027" | `.hero-date` | |
| "Seaglass Point", "Chatham, Massachusetts" (italik) | `.hero-venue`, `.hero-city` | |
| dört kum rengi kutulu geri sayım | `.countdown` sade serif rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| okyanus mavisi RSVP hapı | `.hero-cta .btn` | arayüz hapı (degrade, §5.7) |
| alt gezinme (ince çizgi, geçerli sayfa altı çizili) | `.site-nav` | |
| köşe kümeleri, süzülen parçalar, kıyı | `decor_tl` / `decor_br`, `.float`, `sea` | |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim: dalgalı üst kenar, sol üstte kumul otu, altta kıyı + kabuklar; AY \| gün \| YIL iki 1 px ayraçla), "Kindly reply by" + RSVP, takvime ekle, iki lomboz (`frame_portrait` + story_1 → Our Story, `frame_landscape` + mekân → The Day + programın ilk 4 satırı), "With love" + isimler + "Open the envelope again" (kıyı + `decor_br`) | bu tasarımın parçaları |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| üç yuvarlak pirinç lomboz, zikzak (sol, sağ, sol) | `.windows-row .pane.side-left/right` (frame_portrait + foto) | G098: GM07 R2 `frame_portrait_r2_v2.png` tam yuvarlak (pencere 870 × 872, sekiz perçin) — önceki dik oval sapması kapandı. Telefonda da zikzak; çerçeve 52vw (pencere 40vw) |
| lomboz yanında kabuk/mercan/deniz camı kümeleri | `.beside` (accent_1, accent_2, accent_3; her lombozun sayfa ortasına bakan yanında) | küme yerine tek parça (GPT accent'leri) |
| el yazısı başlık lombozun altında | `figcaption` | sayfa ortasına doğru taşabilir, ekran dışına asla |
| köşe kümeleri, kıyı | `.page-bg` ilk ekranda (sis + sol üst küme); `decor_br` + kıyı sayfa sonunda | **sapma:** comp tek ekran; uzun sayfada kıyı ilk ekranın değil sayfanın dibinde (içeriğin ortasından geçmesin) |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| deniz sisi, köşe kümeleri, süzülen parçalar | `.page-bg` | kart kümenin önünde |
| dalgalı üst kenarlı "Order of the Day" kartı, altta dar dalga | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar/kısalır (1–10 satır) |
| saat / ETKİNLİK / yer (italik), ortalı | `.sched-row` | |
| satır arası kabuk + deniz camı + kabuk, iki yanında ince altın çizgi | `.row-orn` (GPT divider + iki 1 px çizgi; ilk satırda yok) | çizgi rengi palet mavisi; 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı geniş oval pirinç lombozda | `.venue-photo` (frame_landscape + `venue`) | pencere 1,57:1 |
| "Seaglass Point", "Chatham, Massachusetts" | `.venue-name`, `.venue-place` (`city_region_country`, + adres, tören cümlesi) | |
| "DRESS CODE · Coastal formal" | `.dress` (kabuk sırası + satır) | kabuk sırası comp'ta yok; 08'de olduğu gibi blok ayırıcı |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| dalgalı üst kenarlı kart, altta dalga + kum | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?" (tek satır) | `h1.card-title` | dar ekranda iki satıra sarabilir |
| başlık altında kabuk sırası + iki ince çizgi | `.title-orn` | |
| "KINDLY REPLY BY", tarih | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| RSVP hapı (comp'ta ince altın kenarlı) | `a.btn[href="#reply"]` | **sapma:** altın kenar CSS çizgisi olurdu; düz arayüz hapı |
| hap altında üç küçük nokta + çizgiler | — | **sapma:** çizilmedi (K21); boşluk |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU", küçük dalga kıvrımı | `.wait` | kıvrım çizilmedi |
| "WITH LOVE," + isimler | `.sig-unit` (`.love` + `.sign`) | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür |
| kartın dibindeki dalgada deniz tarağı | `.card-bundle` (closure) | **sapma:** GPT kapanışı kabuk + sicim tek parça; sicim de görünür |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075 kuralı)
Düğünden sonra aynı sayfalar `data-if="thank_you_on"` ile teşekkür hâline döner; yeni sayfa ve yeni görsel yok (K21):
zarf açılışı aynen, üst satır "With love and thanks"; kartta teşekkür başlığı + tarih; kart lombozunda teşekkür fotoğrafı, yoksa
**deniz sisi üstünde zarfın kabuğu** (asla yer tutucu). Home: geri sayım ve hap yok; davet kartının yerine aynı `invitation_card`
kâğıdında teşekkür kartı. Details: "The Day" (geçmiş zaman tören cümlesi); RSVP: "Replies are closed" + Home hapı, form yok.
Nav: Details etiketi "The Day", RSVP yok. Stiller `thank-you.css`'te.

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar, `theme.json` → `copy`; `node scripts/copy-manifest.ts --theme
coastal-seaside --check` temiz). Formda "Number of guests"in hemen altında `<template data-rsvp-party>`.

## Bilinen sınırlar
- Home'un alt kapanışında `decor_br`'nin kendi dalga kenarı `shore` zemininin dalgasıyla üst üste biner (iki GPT dalgası; dikiş yok).
- Story/home lombozu G098'den beri GM07 R2'nin yuvarlak lombozu (`frame_portrait_r2_v2.png`, ham imagegen). Penceresi düz yeşil
  değil (kenarda koyulaşan yeşil, ortada alfa deliği); olağan hat (`parts_prep.parca_isle` leke dolgusu, `build_images.py`
  `gm07/` geçici alt klasörü) pencereyi tam şeffaf yapıyor — `foto_alani` her WebP'de 0 görünür piksel. Eski oval
  `frame_portrait.png` kullanılmıyor.
- Davet kartının düz bandı dar (%46–52): uzun içerikte bant çok kez döşenir; ayna nedeniyle benekler simetrik çiftler yapar
  (yakından bakınca fark edilir).
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim, döşenen bant).
- Mekân penceresi 1,57:1 — 3:2 fotoğraf çok az kırpılır.
- `story.items` 3'ten fazlaysa ilk 3 başlık. Monogram (`initials`) kullanılmaz: kapanış bir kabuk (mühür değil).
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, kesişen belge view transition), Vercel yayını,
  gerçek alıcı fotoğrafları, yavaş ağ.

## Ölçümler
2026-10-15, Chromium (Playwright, `/opt/pw-browsers`).

| Ölçüm | Sonuç |
|---|---|
| `theme-check --theme coastal-seaside --stress` | 128 geçti, 0 hata, 0 uyarı (`previews/g420/checks.json`) |
| `g051-browser --theme coastal-seaside` | 44/44 |
| `final-smoke --theme coastal-seaside` | 45/45 (`previews/g420/final/`) |
| `npm test` / `typecheck` / `build` | 993/993 · temiz · temiz (trace-check 16 tema) |
| zarf → home | MOTION `go` 4480 ms + view transition; azaltılmış hareket 186 ms |
| ilk görünüm 390×844 DPR 3 | index 904 KB, home 922 KB (yer tutucu); örnek fotoğrafla 988 / 1347 KB (sınır 1,5 MB) |
| açılış kaydı | `previews/g420/opening_390x844.mp4` |
| dosya boyları | site.js 35 444 B, site.css 45 987 B; tema klasörü 2,3 MB |
| kit uyumu (`kit_check`) | paket 5 24/24 (hiza sol +0,10, sağ +0,49, alt +1,11 %), paket 2 5/5 |
