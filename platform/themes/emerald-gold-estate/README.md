# Tema: emerald-gold-estate (tasarım 17 · Emerald & Gold Estate, G417)

Malikâne gala gecesi: koyu zümrüt yeşili kadife (yumuşak parlaklık, kenarlarda altın toz), sol üst ve sağ alt köşede ince
metalik altın çizgi (line art) monstera, eğrelti ve okaliptüs kümeleri, sağda süzülen bir altın eğrelti yaprağı ve bir okaliptüs
dalı; beyaz Carrara mermer kartlar (ince altın çerçeve), zümrüt kadife zarf — çan (ogee) biçimli uzun kapağı, cebinin kenarları ve
dört dış kenarı ince altın çizgili — ve kapağın en alt noktasında ortası boş, defne çelenkli altın mühür. Cinzel Decorative (isimler,
başlıklar) + Cormorant Infant (aralıklı büyük harf satırları, italik mekân/yer satırları, gövde). Kurallar
`docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi `platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1
comp'larından (`collections/17_Emerald_Gold_Estate/assets/gpt/comps/web_1..5`); bütün görseller bu tasarımın GPT parçaları (K21).
08 (winter-evergreen), 07 (burgundy-velvet-autumn) ve 05/04 temalarından yalnız platform sözleşmesi ve çözülmüş ilk ekran sorunları
alındı (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames`
+ `fold` + `folds`, yatay telefon ızgarası, `devRender`, koyu zeminde `theme_check.backdrop`); görünüş, aralıklar, süs konumları,
zamanlama, kart oranları ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Emerald & Gold Estate", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 copy anahtarı |
| `content.demo.json` | `collections/17_Emerald_Gold_Estate/content.demo.json`'ın birebir kopyası (`/start?theme=emerald-gold-estate` ve tema demosu; servis edilmez) |
| `index.html` | kapalı zarf → dokun → altın mühür parlayıp kalkar, zümrüt kapak yukarı açılır (altın varak astar), ince altın çizgiler ekran boyunca kendini çizer, mermer kart cepten yükselir, öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, isimler, gün · tarih, mekân, şehir/bölge, geri sayım, altın RSVP hapı, hapın altında eğrelti + iki ince çizgi), mermer davet kartı (3 dilim; AY \| gün \| YIL), tek "Kindly reply by" satırı, takvime ekle, kadifeye asılı iki çerçeve (story_1 → Our Story · mekân → The Day + programın ilk 4 satırı), kapanış |
| `story.html` | W1.3: ilk ekran kadife (`.page-bg`: kadife kırpımı, iki köşe kümesi, iki süzülen parça); başlık + alt başlık + eğrelti/çizgiler + giriş cümlesi; **galeri duvarı**: aynı 3:4 ince altın çerçeve üç boyda, kadifeye tek tek asılır (`hang`), başlığı yazılır, yanında okaliptüs dalı kendini çizer; telefonda basamaklı (sol – sağ – sol), ≥ 720 px tek sıra |
| `details.html` | W1.4: ilk ekran kadife; Order of the Day mermer kartı (info_card, 3 dilim; saat \| ETKİNLİK + yer, satır aralarında GPT eğrelti + iki ince çizgi), takvime ekle, mekân (GPT yatay altın çerçeve), "— DRESS CODE · … —", harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: ilk ekran kadife; RSVP mermer kartı (info_card, 3 dilim): başlık, eğrelti + çizgiler, "Kindly reply by" + tarih, altın hap, bekleme satırı, "WITH LOVE," + isimler; **kartın alt kenarında zarfın altın mührü** (monogramlı); platform yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (bu tasarımın `draw`, `draw-tl/br`, `hang`, `press`), foto alanı + maske, zarf katman yüzdeleri, mühür parıltısı (`.glint`), kart 3 dilim, sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (yalnız düğünden sonra yüklenir) |
| `site.js` | `MOTION` (açılış, sahneler, `accents` — `draw` yolu bu tasarımın), `ENVELOPE_GEOMETRY`, uzun isim + ilk ekranlar (`fitNames`, `fold`, `folds`, `wall`, zarf sayfası `envFit`), dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, zarf, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `decor_*` 360/540/720, `accent_N` (200) + `accent_N_lg` (400, açılış çizgileri), `velvet` / `velvet_wide` zeminleri, `countdown_box-240` + `pill_sprig-120` (GM07, G098), `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Tipografi ve kontrast
- `.display` (Cinzel Decorative) `font-kerning: none` (G098): fontun h–e kerning çifti e'yi h'nin sağ sapının altına sokuyor,
  "The" / "Together" "TꞪE" / "TOGETꞪER" okunuyordu (qa-kontrol; G417'de ligatür sanıldı, `font-variant-ligatures` ve
  `font-feature-settings` etkisizdi). Kerning kapalıyken diğer çiftlerde fark gözle seçilmiyor; önce/sonra:
  `previews/g417/g098_kerning_before_after.png`.
- Kontrast (token'lar, site.css'ten taşındı): `--gold-lt` kadifede 10,7:1 · `--ivory` 15:1 · `--ivory-soft` 11:1 · mermerde
  `--ink` 13,9:1 · `--ink-soft` 8,6:1 · `--bronze` (mermerdeki display satırları) 5,9:1.

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 481/578 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 463/608 | frame_portrait (story galeri duvarı; `story_1` home çerçevesinde de) |
| `venue` | `media.venue_image` | 1149/756 | frame_landscape (details; home çerçevesinde de) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` portre
50% 38%, mekân 50% 55%. Mekân penceresi ≈ 1,52:1 (3:2'ye yakın). "Your photo here" yalnız önizlemede; misafir nötr yer tutucuyu
(bg_page'in kümesiz kadifesinden bulanık + fildişine %34 karışmış adaçayı tonu) görür; `build_images.py` her kırpımda altın piksel
payını denetler (≤ %0,05, `manifest.ph_*.gold_share`).

## Görseller (`python3 platform/themes/emerald-gold-estate/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre**. G217'nin bilinen kusuru (yatay çerçeve penceresindeki koyu leke): parts_prep pencereyi
  tam şeffaf bırakıyor; `foto_alani` her WebP'de tam pencerede görünür piksel kalmadığını denetler (`manifest.checks.windows_transparent`:
  hepsi 0). Kroma denetimi: parlak #00FF00 (G ≥ 190, fazla ≥ 60) her WebP'de 0 (zümrüt kadife ve astar deseni sayılmaz).
- **Kapak kesimi** (`env_cflap`): `tema_build.kapak_kes("egri")`, `method: renk`, 388 nokta, artık 0,43 px — çan kapağın altın
  çizgisi kapakta kalır (`previews/g417/cuts_envelope.jpg`).
- **Ön cep çizginin üstünden** (`cep_cizgi`): açık zarfın cebi V; kenarı 9–12 satırlık parlak altın bir çizgi, üstü yine altın varak
  astar. `tema_build.cep_kes("v")` kesimi çizginin **altından** geçirdi (çizgi ve yuvarlak ucun altındaki yeşil şerit arka katmanda
  kalıyor, yükselen kart çizgiyi örtüyordu). Burada `cep_kes("v")`'nin doğruları ön bilgi; her sütunda cebin zümrüt yeşilinden yukarı
  çıkılır (yan kanatların kat çizgileri doğrunun 4 px'ten fazla altında kalırsa üstünden geçilir), sonra altın çizgi pikselleri boyunca
  tırmanılır; kalınlık 21 sütun medyanı (8–13 satır), kenar 9 sütun medyanı. Çizgi cepte, astar dışarıda (docs/11 §7.3).
- **Hiza**: `kit_check` geçiyor (sol −0,10 · sağ +0,20 · alt +0,13 %) — dönüşüm yok; açık kapak/gövde kapalının menteşe satırından
  (`kapak_kes` `hinge_row`) ayrılır.
- **Kapanış** (`closure.png`, kapakla **taşınmaz**): çapa = çan kapağın en alt noktası (`kapak_kes` `tip`); W1.1 comp'ta ölçülen mühür
  genişliği / zarf genişliği (0,1862) ve merkezin uca göre kayması (−0,0026, −0,0023 × zarf genişliği; comp'ta kapak çizgisi mührün iki
  yanından 3. derece uydurmayla, artık 0,46 px) — ölçüm `build_images.py` COMP yorumunda; `previews/g417/compare_closure.jpg`: tema | comp.
  Mührün boş ortası (doku profiliyle bulunan düz daire) monogram kutusu: `manifest.closure.mono_in_crop_pct` → `.seal-mono`.
- **Zeminler**: telefon `velvet` = bg_page'in kümesiz orta kadifesi (x 200–800, y 290–1240; 32 px altın piksel haritasıyla ölçüldü);
  geniş ekran `velvet_wide` (x 64–960, y 600–1000). Altın çizgi kümeleri hep ayrı katman (`decor_tl` / `decor_br`). Uzun sayfaların
  zemini bg_tile (rengi bg_page'in sakin orta kadifesinin ortalamasına çekildi; sayfa rengi `#012314`).
- **Mermer kartlar**: (1) serbest bölge `serbest_mermer`: dolu = şeffaf ya da altın (sıcak renk); gri mermer damarı kağıt dokusu
  sayılır (tema_build'in 28 renk eşiği damarları "dolu" sayıp card_small'ın bölgesini %55'e daraltıyordu). (2) `damar_yumusat`:
  invitation_card ve info_card'ın içinde (altından 3 px uzak, opak) gri damarların kağıda uzaklığı 40 RGB'ye sınırlanır — damar aynı
  yerde ve keskin, yalnız açık gri (2 px bulanıklık da denendi: damarları bulut gibi yayıyordu). Gerekçe: 3 dilimle uzayan kartta
  theme-check her satırın altını kağıt rengiyle karşılaştırır (> 45 RGB uzaklığı %0,5'ten fazla = "boyalı dekor"); koyu damarlar imza
  satırında tam %0,5'e değiyordu. (3) 3 dilim bandı: kartın orta %93'ünde (altın kenarın içi) damarsız/süssüz en uzun bant
  (`slices`: davet kartı %45–57, bilgi kartı %24–88).
- **GM07 rötuş parçaları (G098)**: `countdown_box_r2.png` (W1.2'nin altın çerçeveli sayaç kutusu) ve `pill_sprig_r2.png`
  (hapın iki yanındaki dal) — ham imagegen çıktıları (kullanıcı kararı: kaynakta piksel/alfa/boyut düzenlemesi yok; ham
  tuval 1254 × 1254). GPT_PROMPTS.md'de Kaydet satırları olmadığından `build_images.py` olağan hattı elle çağırır
  (`parts_prep.parca_isle`: alfa > 8 kutusu + 8 px pay, geçici klasör) → yalnız ölçek + WebP (`countdown_box-240`,
  `pill_sprig-120`; `manifest.*.source_sha256` ham dosyanın özeti). Kutu 4:5 dik geldi, comp'un kutuları ~6:5 yatık: site.css
  kutuyu iki yarım olarak gösterir (`.cd-cell::before` sol yarı, `::after` sağ yarı; ikisi de hücre yüksekliğine ölçekli)
  — düz çift çizgi ortada birleşir, köşe süsleri bozulmaz (§5.7 "parçayı kesmek"; CSS çerçeve yok). Dal: `.hero-cta .btn`
  `::before` (aynalı) / `::after`, −20° (uç yukarı-dışa, comp gibi), `brightness(.72)` (altın hapın üstünde kabartma).
- **Ağırlık**: tema klasörü ~1,8 MB (≤ 3 MB); en büyük WebP `env_body-869` ≈ 104 KB, kümeler 720 px 78–89 KB (alfa kalitesi 70).
  `divider` tek 300 px dosya. og: `web_hero` alt hizalı 1.91:1; favicon: closure.

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the gold seal lifts away with a glint, the emerald flap opens upward, thin gold botanical lines draw
  themselves across the screen, and the marble card rises from the pocket."): dokununca (40 ms) mührün üstünden bir ışık geçer
  (`.glint`: mühür görseline maskelenmiş kenarsız ışık süpürmesi, §5.7) ve **mühür kalkar** (140 ms'den: izleyiciye doğru büyür, gölgesi
  derinleşir, yukarı ve hafif sağa uzaklaşır, yolunun sonunda söner; 1,2 s'de biter; monogram onunla birlikte); **zümrüt kapak**
  menteşesinde izleyiciye doğru kalkar (0,96 s; 82°'den sonra söner), altında kapalı gövde açık gövdeye geçer, altın varak astarlı
  açık kapak −90°'den dikilir (1,78 s) → **ince altın çizgiler kendini çizer** (1,88 s'den: GPT eğrelti × 3, monstera × 2, okaliptüs × 3;
  ekranın soldan sağa sekiz yuvasında, sırayla üst ve alt bantta, her biri sapından yukarı doğru `clip-path` ile açılır ve çizilirken
  ×0,82 → ×1 büyür; zarfın arkasında; sonunda söner) → **mermer kart cepten yükselir** (2,38 s) → olduğu yerde öne gelir (× 1,04,
  büyüyen gölge) ve view transition ile home kartına uçar. MOTION `go` 4,44 s (Skip her an; azaltılmış harekette doğrudan home).
- **Story:** galeri duvarı — her çerçeve kendi sahnesi: görünüme girince çiviye asılır gibi üstten düşer, bir kez sallanıp oturur
  (`hang`: üst kenar ortası etrafında −2,6° + 26 px, sekmeli eğri, 1,5 s), sonra başlığı yazılır (`write`), sonra yanındaki altın
  okaliptüs dalı kendini çizer (`draw`). Telefonda basamaklı: büyük (72vw) solda, orta (60vw) sağda, küçük (50vw) solda — foto penceresi
  en küçükte 50 × 0,9025 = **45,1vw** ≥ 38vw; ≥ 720 px comp'un asimetrik duvarı tek sırada (büyük üstte, orta daha aşağıda, küçük en
  aşağıda) ve **tek fold birimi**: duvar nav'ın üstünde bitene kadar `site.js` `wall` genişliği 12 px adımlarla daraltır (≥ 560 px).
- **Home/İç sayfalar:** köşe kümeleri sahne başında kendini çizer (`draw-tl` / `draw-br`: köşesinden açılan `clip-path`), kartlar
  `set` (hep opak), çerçeveler `hang` (yalnız çerçeve; yazılar `rise` — döndürülen uzun metin bloğu zorlama kaydında ekran kenarını
  aşıyordu, 07'nin dersi), RSVP kartının mührü `press` ile karta basılır.
- **Parçacıklar** (`MOTION.accents`): açılış 8 altın çizgi (`draw`) · home'a varış 2 süzülen parça (eğrelti + okaliptüs, hero'nun
  içinde, metnin arkasında, yazı sütununun yanındaki şeritlerde) · RSVP kapanışı 3 parça (monstera + 2 okaliptüs, yalnız `.closing`).
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms, tek giriş 600–1800 ms.

## İlk ekranlar ve yatay telefon
Önceki temaların çözülmüş adımları korunur: `fitNames` (isimler küçülür → `.is-tight` + isimler **34 px tabanı** → `.is-short` (dikey kısa
telefonda kart `clamp(100px, 20svh × .612, 126px)`) → `.is-long` (sayaç hapın altına) → hero kaydırılır), ardından `fold` (isimler/h1
hiç itilmez). qa-kontrol 2026-10-16: 375×553'te tasarım aralığında RSVP ilk ekranın altındaydı → artık ilk ekranda; zorlama kaydında
h1 tamamen ilk ekranın altındaydı → ilk ekranda başlıyor (uzun hâli nav'ın altından kayar, §12 kaydında izinli). Bu tasarıma özgü: card_small uzun (0,612) — 9:16'dan basık telefonlarda kart
`clamp(126px, 30svh × .612, …)`; yüksekliği ≤ 600 px ekranlarda nav'ın eğrelti süsü gizlenir (yalnız etiketler) → 375×553 ve 360×640'ta
demo hero'nun tamamı nav'ın üstünde. Kısa yatay (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px) ızgara: kart solda, isimler · tarih ·
mekân · şehir · sayaç · hap sağda. **İç sayfalar** (`folds`): her ilk ekran öğesi ya nav'ın üstünde biter ya da ilk ekranın tamamen
altında başlar (`[data-fold]`: story'de alt başlık, giriş cümlesi, her çerçeve — ≥ 720 px'te duvar bir bütün —, sonraki bölüm;
details'te kart başlığı, takvim çifti, mekân çerçevesi — program satırları birim değil (itilen satır kartta delik bırakıyordu,
qa-kontrol 2026-10-16); rsvp'de başlık, son tarih, hap, bekleme satırı, imza birimi,
form satırları). İmza katlanmadan önce `--sg` 1 → 0,72 küçülür. **Zarf sayfası** (`envFit`): sahnenin boş üstü (`.6806 × --w`) ölçülen
başlığın altına girer; "Tap to open" ilk ekranda bitmiyorsa sahne küçülür (`--ok`, en az 0,6).

## Dekor ve metin (`site.js` `decor`)
- Köşe kümeleri **hep bütün** GPT parçası; yalnız ekran kenarı keser (sayfa sonlarında tam genişlikte `overflow-x: clip`; hero kadifesi
  `overflow: clip visible` — önizleme çubuğunun altında küme düz çizgiyle kesilmez).
- Kadife üstündeki hiçbir yazı bir kümenin çizgisi üstünde durmaz: `decor` her kümenin 16 × 16 çizgi haritasını (WebP alfasından,
  `manifest.decor_*.line_map_16` = `MAP`) yazı kutularıyla karşılaştırır; çakışırsa küme %6 adımlarla küçülür (en çok %45), yine
  çakışırsa gizlenir. Yazıya, karta, çerçeveye ya da kapalı zarfa değen süzülen parça gizlenir.
- **theme-check zemin ölçümü** (`manifest.theme_check.backdrop`): koyu zümrüt kadife (gri %99,9'luk değeri 43); "dolu" = altın çizgi
  (açık) → `dark_below: 0`, `light_above: 61` (diğer eşikler varsayılan). Boyalı kümeler `clusters: ".corner"`.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| zümrüt kadife, kenarlarda altın toz | `.scene-bg` `velvet` (telefon) / `velvet_wide` (geniş) | bg_page 2:3 telefonda kümeleri keserdi: zemin kümesiz kırpım |
| altın çizgi kümeleri sol üst, sağ alt | `decor_tl` / `decor_br` ayrı katman | ekranda bütün |
| sağda altın eğrelti yaprağı, okaliptüs dalı | `.float` (accent_1, accent_3) | yavaş "nefes"; zarfa/yazıya değerse gizlenir |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (süslü Roma büyük harfleri) | `h1.names` (Cinzel Decorative; `.amp` italik Cormorant) | uzun isimde `site.js` küçültür |
| zümrüt kadife zarf, çan kapak, altın çizgiler | `.env-closed` + `.env-cflap` | **sapma (GPT parçası):** parça comp'tan basık (en/boy 1,39; comp ≈ 1,2) |
| altın mühür, boş orta, defne kenarı, kapağın en alt noktasında | `.closure` (kapaktan ayrı) + `.glint` + `.seal-mono` | ölçü ve yer comp'tan; **ek:** monogram (`initials`, docs/11 §7.1 önerisi; comp'ta boş) |
| "TAP TO OPEN" | `.env-hint p` | |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| mermer kart, altın çerçeveli foto, "We're getting married", "MAY 29, 2027 · LAKE GENEVA", eğrelti + çizgiler | `.hero-card` (card_small + `hero_portrait`, `.card-line`, `.kicker`, `.card-orn`) | kasaba = `venue.city` (W1.2 yalnız kasabayı yazar; docs/11 §3.2 `venue.city_region` der — **sapma**, comp'a uyuldu, 05/08 ile aynı); dar kartta önce şehir, sonra eğrelti, sonra italik satır düşer (`fitCopy`) |
| isimler | `h1.names` | |
| "SATURDAY · MAY 29, 2027" | `.hero-date` | |
| "Emerald Court Estate" / "Lake Geneva, Wisconsin" (italik) | `.hero-venue` / `.hero-city` (`venue.city_region`) | |
| dört altın çizgili geri sayım kutusu | `.countdown` `.cd-cell` + GPT `countdown_box` (iki yarım, yüksekliğe ölçekli) | G098: GM07 parçası (önceki sapma — sade rakam — kapandı); etiket ≥ 11 px, kutu ≥ 64 px |
| cilalı altın RSVP hapı, iki yanında küçük dal | `.hero-cta .btn` (altın degrade arayüz hapı, zümrüt yazı) + GPT `pill_sprig` (`::before` aynalı, `::after`) | G098: dallar GM07 parçası (yalnız hero hapında; diğer haplar sade) |
| alt gezinme, üstünde çizgi · eğrelti · çizgi | `.site-nav` + `.nav-orn` (GPT divider + iki 1 px çizgi) | yüksekliği ≤ 600 px ekranda eğrelti gizli |
| köşe kümeleri, süzülen parçalar | `decor_tl` / `decor_br`, `.float` | |
| — (comp yok) | mermer davet kartı (`invitation_card` 3 dilim: köşelerde altın çizgi monstera/eğrelti; AY \| gün \| YIL iki 1 px ayraçla), "Kindly reply by" + hap, takvime ekle, kadifeye asılı iki altın çerçeve (`frame_portrait` + story_1 → Our Story, `frame_landscape` + mekân → The Day + programın ilk 4 satırı), "With love" + isimler + "Open the envelope again" (`decor_br`) | bu tasarımın parçaları; galeri duvarı fikri ana sayfada da |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR", çizgi · eğrelti · çizgi | `h1.page-title`, `.page-head .kicker`, `.page-head .orn` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| galeri duvarı: aynı 3:4 ince altın çerçeve üç boyda, asimetrik | `.wall .pic` × 3 (`frame_portrait` + foto) | **sapma:** telefonda comp dizilişi pencereleri 38vw'nin altına düşürürdü (küçük ≈ 20vw) → basamaklı sol–sağ–sol, 72/60/50vw; ≥ 720 px comp'un asimetrik duvarı tek sırada (comp'ta küçük çerçeve büyüğün altında; tek sıra, masaüstünde ilk ekrana sığsın diye) |
| çerçeveler arasında küçük okaliptüs dalları | `.sprig` (accent_3), her çerçevenin yanındaki boşlukta | ≥ 720 px'te orta ve küçük çerçevenin üstünde (comp'taki gibi) |
| başlıklar çerçevenin altında | `figcaption` (italik Cormorant) | |
| köşe kümeleri, süzülen parçalar | `.page-bg` ilk ekranda; `decor_br` sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| kadife, köşe kümeleri, süzülen parçalar | `.page-bg` | kart ve çerçeve kümenin önünde |
| "Order of the Day" mermer kartı, altın çerçeve, üstte eğrelti | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar/kısalır (1–10 satır) |
| saat \| ETKİNLİK / yer (italik) | `.sched-row` (iki sütun; kart 280 px'ten darsa alt alta) | |
| satır arası eğrelti + iki yanında ince çizgi | `.row-orn` (GPT divider + iki 1 px çizgi; ilk satırda yok) | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı yatay ince altın çerçevede | `.venue-photo` (frame_landscape + `venue`) | |
| "Emerald Court Estate", "Lake Geneva, Wisconsin" | `.venue-name`, `.venue-place` (`city_region_country`, + adres, tören cümlesi) | |
| "— DRESS CODE · Black tie —" | `.dress` (iki 1 px çizgi + satır) | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| kadife, köşe kümeleri, süzülen parçalar | `.page-bg` | kart kümenin önünde |
| altın çerçeveli mermer kart, üstte eğrelti | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?" (iki satır) | `h1.card-title` | |
| eğrelti + çizgiler | `.rsvp-text .orn` | |
| "Kindly reply by", tarih | `.by`, `.deadline` | `data-if="rsvp.deadline"` |
| cilalı altın RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| küçük eğrelti (hapın altında) | — | **sapma:** kartta üst üste üç süs olurdu; tek eğrelti başlığın altında |
| "We can't wait to celebrate with you" | `.wait` (italik) | |
| "WITH LOVE," + isimler | `.sig-unit` (`.love` + `.sign`) | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür (`--sg` ≥ 0,72) |
| kartın alt kenarında zarfın altın mührü | `.card-seal` (closure + `.seal-mono`) | kartın dışında (kart metni sayılmaz) |
| — | yanıt formu (fildişi panel), kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075 kuralı)
Düğünden sonra (platform kuralı `lib/content/thank-you.ts`, docs/11 §3.6) aynı sayfalar `data-if="thank_you_on"` ile teşekkür hâline
döner; yeni sayfa ve yeni görsel yok (K21):
- **Zarf:** açılış şovu aynen; üst satır "With love and thanks" (`ty_kicker`); kartta teşekkür başlığı (italik, dengeli sarar; `fitCopy`
  sığmazsa küçültür, ≥ 11 px) + tarih. Kart penceresinde teşekkür fotoğrafı; yoksa **kadife üstünde zarfın altın mührü** — asla yer tutucu.
- **Home:** hero kartı zarfla aynı; isimler, tarih, mekân kalır; geri sayım ve RSVP hapı yok. Davet kartının yerine aynı
  `invitation_card` mermerinde (3 dilim) **teşekkür kartı**: başlık, mesaj (`white-space: pre-line`), "With love,", isimler, tarih.
  Yanıt satırı ve takvim yok; çerçevelerde Our Story ve The Day kalır (çift Details'i gizlerse The Day çerçevesi yok).
- **Details:** "The Day" (program, mekân, harita, registry); takvim, dress code, Travel & Stay, SSS ve RSVP linki yok; tören cümlesi
  geçmiş zaman. Çift gizlerse sayfa 404 ve hiçbir link yok (story'nin kapanış düğmesi Home'a döner).
- **RSVP:** kartta "Replies are closed" + teşekkür başlığı + Home hapı + imza + mühür; bekleme satırı ve form yok.
- **Nav:** Details etiketi "The Day" (`nav_day`), RSVP yok. Stiller `thank-you.css`'te.

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar, `theme.json` → `copy`; `node scripts/copy-manifest.ts --theme
emerald-gold-estate --check` temiz). `max` değerleri önceki temaların doğrulanmış değerleri (nav: Home 6, Story 6, Details 7, RSVP 5,
The Day 10; sayaç etiketleri 7) ve `theme-check --stress` ile 360/390'da (teşekkür hâli dahil) doğrulandı. Formda "Number of guests"in
hemen altında `<template data-rsvp-party>` (formun kendi `.field` stili, `form_party` + `form_optional`).

## Bilinen sınırlar
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim). Zorlama kaydında (10 satır) kartın içinde katlanan satırın
  önünde boşluk kalır (fold kuralı; 07/08'deki gibi kabul).
- Mermer damarları kartın içinde açık griye sınırlandı (yukarıda); W1'deki koyu damarlardan biraz daha sakin.
- Gerçek envelope parçası comp'tan basık (1,39 : 1,2); mühür ve kapak ucu ölçülerle bağlı.
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez.
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, container query, `clip-path` WAAPI, kesişen belge view
  transition), Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ, view transition'sız tarayıcıda (Firefox) solma.

## Ölçümler
Ayrıntı ve sayılar: G417 Sonuç bölümü ve `platform/previews/g417/checks.json`.
