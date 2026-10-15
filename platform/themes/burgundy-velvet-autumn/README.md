# Tema: burgundy-velvet-autumn (tasarım 07 · Burgundy Velvet Autumn, G407)

Mum ışığında bir sonbahar akşamı: sıcak şeftali–bakır sıva duvar, üstte bokeh ışıkları; sol üst ve sağ alt köşede bordo dalya,
gül, böğürtlen ve bakır yaprak kümeleri; fildişi keçe dokulu, dikdörtgen kapaklı zarf, bordo kadife kurdeleyle **sarılı**
(yatay + dikey bant, ortada fiyonk, düğümden sarkan altın meşe yaprağı tılsımı). Pinyon Script (isimler, başlıklar, alt yazılar)
+ Cinzel (aralıklı büyük harf satırları) + Cormorant Garamond (italik mekân/yer satırları ve gövde metni). Kurallar
`docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi `platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1
comp'larından (`collections/07_Burgundy_Velvet/assets/gpt/comps/web_1..5`, yalnız sade adlar; `web_2_home_v1/v2` denemedir);
bütün görseller bu tasarımın GPT parçaları (K21, kod çizimi yok). 04 (vintage-airmail-love-letter) ve 05 (mediterranean-lemon)
temalarından yalnız platform sözleşmesi ve çözülmüş sorunlar alındı (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum
anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` + `[data-fold]` ilk ekran adımları, yatay telefon
ızgarası, `decor`, `fitCopy`, `devRender`); görünüş, aralıklar, süs konumları, zamanlama ve kart oranları bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Burgundy Velvet Autumn", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 düzenlenebilir metin (`copy`, G068) |
| `content.demo.json` | `collections/07_Burgundy_Velvet/content.demo.json`'ın birebir kopyası (`/start?theme=burgundy-velvet-autumn` ve tema demosu; servis edilmez) |
| `index.html` | kapalı zarf → dokun → fiyonk çözülür, kurdele zarfın yanlarından ve altından kayıp çıkar, dikdörtgen kapak kalkar, kart sıcak mum ışığında yükselirken tek bir bakır yaprak süzülür, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + oval altın çerçeveli foto, isimler, gün · tarih, mekân, şehir/bölge, geri sayım, kadife RSVP hapı), davet kartı (3 dilim; ay / gün · GÜN · yıl satırı) + tek "Kindly reply by" satırı, takvime ekle, iki sallanan altın çerçeve (story_1 · mekân) → Our Story / The Day (altında programın ilk 4 satırı), son (köşe kümesi + "With love", isimler) |
| `story.html` | W1.3: ilk ekran mum ışıklı duvar (`.page-bg`); başlık + alt başlık + giriş cümlesi; ≥ 720 px'te tek kadife kurdele (GPT `velvet_swag`) ve ona üç noktadan bağlı üç oval altın çerçeve, ortadaki en alçakta; telefonda her çerçeve kendi kurdele parçasının dibinde; çerçeveler bağı üzerinde düşer ve hafifçe sallanır |
| `details.html` | W1.4: ilk ekran mum ışıklı duvar; Order of the Day kartı (info_card, 3 dilim; saat · ETKİNLİK · yer, satırlar arasında GPT böğürtlen dalı), takvime ekle, mekân (GPT oval yatay çerçeve) + mekân adı (Pinyon) + şehir/bölge/ülke + dress code (tılsım), harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: ilk ekran mum ışıklı duvar; RSVP kartı (info_card, 3 dilim) + kartın alt kenarında kadife fiyonk (closure'dan), platform yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`hang`, `sway`, `set`, `drop`, `bloom` …), foto alanı + maske, zarf ve kurdele katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `thank-you.css` | yalnız teşekkür hâlinde bağlanır (G075): kart penceresinde teşekkür fotoğrafı ya da duvar + fiyonk, teşekkür kartı |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim + ilk ekranlar (`fitNames`, `fold`, `folds`, `garland`, `envFit`), dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, zarf, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/parts_prep.py` + `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar (zarf 5 katman + kurdele 3 parça), `florals_tl/br` 480/720/900, `velvet_swag` 480/960/1440, `bow`, `charm`, `divider`, `accent_1..3`, `wall` / `wall_wide` zeminleri, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 386/501 | card_small'ın oval penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 622/810 | frame_portrait (story; `story_1` home çerçevesinde de) |
| `venue` | `media.venue_image` | 896/512 | frame_landscape (details; home çerçevesinde de) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (oval; CSS `border-radius` yok). Mekân penceresi
1,75:1 oval: 3:2 mekân fotoğrafı `object-fit: cover` ile üstten/alttan kırpılır. "Your photo here" yalnız önizlemede
(`html[data-preview="true"]`); misafir nötr yer tutucuyu görür: `bg_page`'in çiçeksiz sıva bölgelerinden bulanık + fildişine
tonlanmış kırpımlar (`PLACEHOLDERS`). `build_images.py` her yer tutucunun en koyu pikselini (≥ 155; ölçülen 199–216) ve en yüksek
doygunluğunu (≤ 60; ölçülen 45–57 — dalya, yaprak, bokeh lekesi girerse yükselir) ölçer (`manifest.ph_*.min_lum`, `max_sat`;
aşarsa çıkış ≠ 0). İlk denemede `ph_story_2` kırpımına koyu bir dal ucu giriyordu; kırpım taşındı.

## Görseller (`python3 platform/themes/burgundy-velvet-autumn/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre** (alfa kırpma, #00FF00 pencereleri, `windows.json`); `foto_alani` her WebP'de tam
  pencerede görünür piksel kalmadığını denetler (`manifest.checks.windows_transparent`: hepsi 0). Kroma yeşili (`kroma_yesil`:
  G ≥ 190 ve fazla ≥ 60) her WebP'de 0.
- **GPT kusurları temizliği (çizim yok):** dış hatta yarı saydam hâle sıfırlanır (`hale_temizle`), WebP kenar saçağı için kaydetmeden
  önce şeffaf piksellere komşu opak renk taşınır (`renk_tasir`).
- **Zarf tipi `kapak`, dikdörtgen kapak** (`env_cflap`, `kapak_kes("egri")`, `method: renk`): kapağın yuvarlatılmış köşeli düz serbest
  kenarı görüntüde bulunur (446 nokta, artık sapması 0,52 px; menteşe satırı 685). Kapak kapalı zarfın dışına taşmaz (0 px).
- **Ön cep** (`env_pocket`, trapez): iki çapraz yan kanat + düz alt kanat kenarı. Noktalar = gövdenin üst %45'inde her sütunun en alt
  astar pikseli; iki çapraz doğru simetrik ve aykırısız (sol eğim 1,046, sağ −1,023), düz kenar ortanın %90'lık değeri (satır 824);
  kenarın altında kartın geçtiği aralıkta astar pikseli 0 (`liner_below_edge_px`), uyarı yok.
- **Hiza** (`manifest.align` + `stage.align_fix`): açık gövde (kat çizgisi → alt kenar) kapalıdan ~%7 uzundu; ölçülen ölçek
  (× 1,0011, × 0,92975) + ötelemeyle kapalının sol/sağ kenarına, menteşesine ve alt kenarına oturtuldu (sonrası sol 0, sağ 0, alt 0 px;
  `kit_check` sol −1, sağ −1, alt +2 px "tamam"). Kesilen katmanlar açık zarfı %0,52 farkla yeniden kurar.
- **Kapanış = sarılı kurdele** (`closure.png`, zarfla aynı 1024 × 1536 tuval, 1:1; kapakla **taşınmaz**): `kit_check` yatay bant
  uçlarının zarf kenarına 3–7 px varmadığını, dikey bandın üstten 41 / alttan 14 px taştığını ölçtü. `kapanis_hizala` yatay ölçek
  (× 1,0133, −4,8 px) ile bant uçlarını zarf kenarına (+1 px sarma) getirir, zarfın alfa kutusu dışında kalanı kırpar (kurdele kenardan
  arkaya döner); sonrası tüm uçlar −1…−2 px. W1.1'de ölçülen dikey bant / zarf genişliği 0,0904, bizim GPT parçasında 0,1107 (parça
  olduğu gibi kullanıldı). `--onizleme` ile `compare_closure.jpg` (tema | comp).
- **Kurdele üç parçaya kesilir** (docs/11 §7.1: "düğüm noktasından kesilip iki yana çekilir"; `kapanis_parcala`): dikey bant sütunu
  (ölçülen 462–563 ± 3 px) + düğüm + tılsım → `cl_c`; solu → `cl_l` (sol yatay bant + sol ilmek + sol kuyruk), sağı → `cl_r`. Üç parça
  kapanışı birebir yeniden kurar (fark 0). Tılsım maskesi (`tilsim_maskesi`: en büyük altın bileşenin kutusu + 12 px, kapanış 3) tılsımı
  yarıya bölünmekten korur.
- **Fiyonk** (`bow-320/640`, RSVP kartının altı + teşekkür kartı + favicon): kapanıştan dikey bant çıkarılır — düğümün üstünde tohumlu
  taşma dolgusuyla, altında satır satır opak koşuyla (`fiyonk`); yatay bant ilmeklerin %18 dışında kesilir; tılsım kalır. Kırpım +
  maske; çizim yok.
- **Tılsım** (`charm-48.webp`, 2,9 KB): kapanışın altın meşe yaprağı (altın renk anahtarı, en büyük bileşen). W1.1 / W1.2 / W1.4'teki
  küçük altın süs (ince çizgi + fleur) yerine nav, ipucu, geri sayım ve dress code satırında kullanılır (sapma: comp'un fleur'ü
  ayrı bir GPT parçası olarak yok; tılsım aynı ailedendir).
- **Zeminler:** telefon `wall` = `bg_page`'in iki çiçeksiz kırpımı (üst bokeh x 330–890 y 380–880, alt sıva x 0–560 y 760–1240) 110 px
  yumuşak geçişle; geniş ekran `wall_wide` (x 250–960, y 400–890). Dalya kümeleri hep ayrı katman (`florals_tl` / `florals_br`), düz
  çizgiyle kesilmez; 16 × 16 yaprak haritaları (alfa) `site.js` `MAP`'te.
- **Kurdele çelengi** (`velvet_swag` 480/960/1440): her çerçevenin bağının kurdeleye değdiği yer `manifest.velvet_swag.hang` (genişliğin
  %26 / %50 / %74'ünde kurdelenin üst ve alt kenarı ölçülür); CSS'teki bağ üstleri bu ölçümden (kalınlığın %30'u).
- **Kart cepte** (`stage.parts.card` üst %51,064; `card_path` −87,903 / −84,903 %): fotoğraf penceresinin en çok %6'sı cebin düz
  kenarının üstünde (`CARD_PHOTO_ABOVE`), yüzler cep kenarıyla kesilmez.
- Kartlar: `free_zone` + 3 dilim (`slices`: davet kartı %55–59, info kartı %17–91; gerilen bant yalnız düz kâğıt). og: `web_hero`
  alt hizalı 1,91:1 (zarf + fiyonk bütün, yazı yok); favicon: fiyonk. `invitation_card-900` 215 KB (ilk ekranda değil, ≤ 250 KB);
  ilk ekran parçaları ≤ 200 KB (`florals_*-720` ~121 KB). Tema klasörü ~2,6 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the velvet bow unties and the ribbon slides off the envelope's sides, the rectangular flap lifts, and
  the card rises in warm candlelight while a single copper leaf drifts down."): dokununca (ilk hareket 40 ms) fiyonk **çözülür** —
  iki yarı düğümden hafifçe ayrılır (%2 yana, ≤ 6°), sonra sol yarı zarfın sol kenarından, sağ yarı sağ kenarından **kayarak çıkar**
  (sahnenin yarısı kadar, 12°'ye kadar dönerek; yalnız yolun son %40'ında, zarfın kenarını geçerken söner), dikey bant düğüm ve
  tılsımla birlikte zarfın altından kayar (1,15 s). Kurdele kapağın kenarını geçtikten sonra (980 ms) dikdörtgen kapak menteşesinde
  kalkar (820 ms), altında kapalı gövde açık gövdeye (astar + ön cep) geçer, açık kapak −90°'den dikilir (1,78 s) → arkada sıcak
  **mum ışığı** (GPT değil, sınırsız radyal ışık `.glow`, 1,98 s'de başlayıp 1,5 s'de yanar) kart cepten yükselir (2,06 s, 1,42 s) ve **aynı
  anda tek bir bakır akçaağaç yaprağı** (`accent_1` × 1, 40–48 px, `origin: 'card'`) kartın yanındaki şeritte süzülür (2,2 s'de
  başlar, `go`'dan önce yerleşir) → kart olduğu yerde öne gelir (× 1,04, 3,48 s) ve view transition ile home kartına uçar. Dokun →
  home 4,38 s (Skip her an). Hareketli parçalar ayrı: kurdelenin üç parçası, kapak, açık kapak, gövde, kart, ışık, yaprak.
- **Story:** ≥ 720 px'te kurdele (`story-garland`) önce belirir; her çerçeve kendi sahnesi (`story-frame`): kurdele parçası (telefonda)
  → çerçeve bağı üzerinde **düşer** (`hang`: −22 px, −5° → hafif aşırı salınım → durur) → alt yazı yazılır; çerçeveler sonra
  süresiz, hafifçe **sallanır** (`sway` ±1,2°, 7–8,4 s, ortadaki faz kaymalı). Comp'un "three oval gold-leaf frames tied at different
  points along one long burgundy velvet ribbon swag … each frame swaying slightly" cümlesi. Telefonda çerçeve 60vw, foto penceresi
  60 × 0,648 = **38,9vw** (≥ 38vw).
- **Home:** hero sırası dekor → kart → isimler → tarih → mekân → geri sayım → hap; davet kartı `set` (hep opak) sonra metinler sırayla;
  iki çerçeve bağlarında iner (`hang`, yalnız çerçeve — başlık, ipucu ve program satırları ayrıca `rise`; döndürülen uzun metin
  bloğu --stress'te ekran kenarını aşıyordu) ve sallanır.
- **Parçacıklar** (`MOTION.accents`): açılış 1 bakır yaprak · home'a varış 2 bordo yaprak (hero'nun içinde, metnin arkasında) · RSVP
  kapanışı 2 bordo yaprak + 1 bakır yaprak (yalnız `.closing` kutusunda). Yollar metin sütununun yanındaki şeritlerden (`avoid`).
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms (`rsvp-card` `tie` 2900), tek giriş 600–1800 ms. Azaltılmış hareket: açılış
  oynamaz (dokununca doğrudan home), sallanma, ipucu nefesi ve serbest parçalar durur, girişler anında.

## İlk ekranlar ve yatay telefon
04/05'in çözülmüş adımları korunur: `fitNames` (isimler küçülür → `.is-tight` + isimler **36 px tabanı** → `.is-long` (sayaç
hapın altına) → hero kaydırılır), ardından `fold` (nav'ın altında yarım parça yok). İç sayfalarda `[data-fold]` birimleri sırayla:
nav çizgisini kesen birim ilk ekranın altından başlar; ilki sayfayı en çok küçük bir adım kaldırabilir. Bu tasarıma özgü:
- **Story telefon:** bir birim (kurdele parçası + çerçeve + alt yazı) 390 px'te ~505 px boyunda; başlık bloğuyla birlikte ilk
  ekrana sığmaz (390 × 844'te de: başlık 345 px'te biter, birim 850'de biterdi, nav 770'te). İlk çerçeve katlanınca başlık bloğu ilk
  ekranın ortasına alınır (boşluğun %42'si üste) — ilk ekran yarım çerçeve yerine mum ışıklı bir başlık sayfası olur, çerçeveler
  kaydırınca birer birer bağlarında iner. Pencereyi 38vw'nin altına küçültmek tek çözüm olurdu; yapılmadı.
- **Story ≥ 720 px:** kurdele + üç çerçeve **tek birim** (`.garland`); `garland()` genişliği 12 px adımlarla (≥ 560 px) nav'ın
  üstünde bitene kadar daraltır, yine sığmazsa birlikte katlanır.
- **Details:** kartın başlığı ve her program satırı ayrı birim; dar yatay telefonda kart `min(100% − 40px, 420px, (100svh − 160px) × 1,55)`
  genişliğe iner ki başlık + ilk satır nav'ın üstünde kalsın (yalnız başlıklı bir kart ilk ekranda bırakılmaz).
- **RSVP:** başlık, "Kindly reply by" + tarih, hap, "We can't wait …", imza (+ fiyonk) beş birim; imza birimi önce `--sg` ile %73'e
  kadar küçülür (fiyonk onunla birlikte), sonra katlanır. 360 × 640'ta imza katlanır; kartın altında ~130 px boş kâğıt kalır (05'teki
  gibi kabul edilen ödünleşim).
- **Yatay telefon** (en-boy ≥ 1, yükseklik ≤ 620 px): hero iki sütun (kart solda, isimler → tarih → mekân → şehir → sayaç → hap sağda).

**theme-check zemin ölçümü** (`manifest.theme_check.backdrop`, `build_images.py` yazar): bu duvar 03'ün açık yıkamasından koyu
(alt kısmı şeftali–bakır); varsayılan `dark_below: 170` düz duvarı "dolu" sayıyor, zarf ipucunun altını %15–47 "boyalı dekor"
ölçüyordu. Ölçüm: `wall-560`'ın %0,1'i, dalya kümelerinin %92'si gri < 130 → `dark_below: 130` (diğer eşikler varsayılan). İpucu
ayrıca kendi `<p>`'sine alındı (tılsım ve çizgiler ölçülen kutunun dışında).

## Dekor ve metin (`site.js` `decor`)
Köşe kümeleri duvar metninin altına girmez (16 × 16 yaprak haritası: önce küçülür, sığmazsa gizlenir); serbest parçalar (bakır yaprak,
bordo yaprak, böğürtlen) metin, kart, çerçeve, kurdele ya da kapalı zarfın üstüne düşerse gizlenir (`solid`: `.card, .paper, .frame,
.env-closed, .swag`).

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| Comp öğesi | Tema | Not |
|---|---|---|
| Duvar (bokeh + sıva) | `.scene-bg` `wall` / `wall_wide` | |
| Sol üst / sağ alt dalya kümeleri | `florals_tl` / `florals_br` katmanları | bütün, kesilmez |
| Bakır akçaağaç yaprağı sağ üstte, bordo yapraklar | `.float` (`accent_1`, `accent_2`), sol altta böğürtlen (`accent_3`) | metne değerse gizlenir |
| "YOU ARE INVITED" | `.env-head .kicker` (Cinzel) | `envelope_kicker` |
| "Rosalind & Edward" | `h1.names` (Pinyon, bakır) | |
| Zarf + sarılı kurdele + fiyonk + tılsım | `env-closed` + `env-cflap` + `.closure` (3 parça) | aynı tuval, hiza ölçülü |
| "TAP TO OPEN" + çizgi + fleur | `.env-hint` + `.orn` (iki ince çizgi + **tılsım**) | sapma: fleur yerine tılsım |
| — | Skip, Enter / Replay | platform |

### home ← W1.2 `web_2_home.png`
| Comp öğesi | Tema | Not |
|---|---|---|
| Kart: oval altın çerçeveli foto, "We're getting married", "OCTOBER 23, 2027 · ASHEVILLE" | `.hero-card` (`card_small` + `hero_portrait`), `.card-copy` | şehir boşsa nokta düşer |
| İsimler | `.hero .names` | |
| "SATURDAY · OCTOBER 23, 2027" | `.hero-date` | |
| "Hawthorne Hall" / "Asheville, North Carolina" (italik) | `.hero-venue` / `.hero-city` (Cormorant italik) | |
| Çizgi + fleur | `.countdown .orn` (tılsım) | |
| Geri sayım: 4 bilet kutusu | düz oyma rakamlar (Cinzel) + etiket | **sapma (K21):** kutular GPT parçası olarak yok; kod çerçevesi çizilmez |
| Kadife RSVP hapı (altın kenarlı) | `.btn`: bordo gradyanlı arayüz hapı (docs/11 §5.7 izinli tek düğme gradyanı) | sapma: altın kenar çizgisi yok (K21: kenarlık çizilmez) |
| Nav: "HOME · STORY · DETAILS · RSVP" + üstte fleur | `.site-nav` + `.orn` (tılsım) | sapma: fleur yerine tılsım |
| — (comp'ta yok) | davet kartı, takvim, iki çerçeveli teaser, son | ilk ekranın altı; tasarımın parçalarıyla |

### story ← W1.3 `web_3_story.png`
| Comp öğesi | Tema | Not |
|---|---|---|
| "Our Story" + "MOMENTS WE HOLD DEAR" + çizgi/fleur | `h1.page-title`, `.kicker` + `.orn` | |
| — | giriş cümlesi (`story.intro` + tarih) | comp'ta yok, içerik kaydı |
| Tek kurdele, iki uçta fiyonk + tılsım | `velvet_swag` (≥ 720 px tek; telefonda çerçeve başına bir) | sapma: telefonda kurdele parçası her çerçevenin üstünde tekrar eder (üç çerçeve 390 px'te yan yana sığmaz; pencere ≥ 38vw kuralı) |
| Üç oval altın çerçeve, ortadaki alçak, bağlarla kurdeleye | `figure.hang` × 3, `frame_portrait` | ≥ 720 px'te bağ üstleri ölçülen kurdele noktalarında |
| Alt yazılar (Pinyon) + küçük fleur | `figcaption` + `.orn.mini` | |
| Ortadaki çerçevenin üstündeki böğürtlen dalı | — | GPT `frame_portrait` parçasında yok (comp'a özgü süs) |

### details ← W1.4 `web_4_details.png`
| Comp öğesi | Tema | Not |
|---|---|---|
| Info kartı (köşe süsleri, üstte böğürtlen dalı) | `.paper.info.day-card` (`info_card`, 3 dilim) | |
| "Order of the Day" | `h1.card-title` (`schedule_title`) | |
| Satırlar "4:00 PM │ CEREMONY │ The Chapel Lawn" + aralarda böğürtlen dalı | geniş kartta (≥ 520 px kap) tek satır + iki 1 px ayraç; telefonda üst üste (saat / ETKİNLİK / yer); aralarda GPT `divider` | sapma: 390 px kartta üç sütun okunmaz |
| Kart ile çerçeve arasında kadife bağ + fiyonk | — | sapma: kart ile çerçeve arasına takvim düğmeleri girdiği için bağ kaldırıldı |
| Oval yatay altın çerçeve (mekân fotoğrafı) | `.venue-photo` (`frame_landscape`) | sallanır |
| "Hawthorne Hall" / "ASHEVILLE, NORTH CAROLINA" | `.venue-name` (Pinyon) / `.venue-place` (şehir, bölge, ülke) | |
| Çizgi + fleur, "DRESS CODE · Formal attire" | `.dress` + `.orn` (tılsım) | |

### rsvp ← W1.5 `web_5_rsvp.png`
| Comp öğesi | Tema | Not |
|---|---|---|
| Info kartı | `.paper.info.rsvp-card` | |
| "Will You Join Us?" | `h1` (`rsvp_title`) | |
| Böğürtlen dalı + çizgiler | `.orn-sprig` (GPT `divider`) | |
| "KINDLY REPLY BY" / "SEPTEMBER 11, 2027" | `.kicker` + `.deadline` | |
| Kadife RSVP hapı (fleur'lü) | `.pill` → `#reply` | fleur yok |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU" | `.wait` | |
| "With love," + isimler | `.sig-unit` | |
| Kartın alt kenarında kadife fiyonk + tılsım | `.card-tie` (`bow`) | kapanıştan kırpım; bant kartın alt kenarının 4cqw üstünde |
| — | form, kapanış | platform sözleşmesi |

## Teşekkür hâli (G075 kuralı)
- `thank-you.css` yalnız `data-if="thank_you_on"` ile bağlanır; düğünden önce kaynakta teşekkür ile ilgili hiçbir şey yok.
- **index:** kicker "With love and thanks" (`ty_kicker`), kartta teşekkür başlığı (≤ 60 karakter, Pinyon, `fitCopy` küçültür, hiç
  düşürmez) + tarih; pencerede teşekkür fotoğrafı, yoksa duvar + kadife fiyonk (süs, yer tutucu değil). Portre ve yer tutucu asla.
- **home:** sayaç, RSVP linkleri, takvim ve davet kartı yok; yerine `#thank-you` kartı (davet kartı kâğıdı: başlık, mesaj
  `white-space: pre-line`, "With love," + isimler, tarih). Nav: Home · Story · The Day.
- **details:** kalır ("The ceremony began at …"), takvim / dress / travel / SSS yok; `thank_you.details: 'hide'` → 404 ve linkler düşer.
- **rsvp:** form yok; "Replies are closed" + teşekkür başlığı + Home hapı; imza ve fiyonk kalır.

## Düzenlenebilir metinler (G068 kuralı)
71 anahtar (`theme.json` `copy`, `node scripts/copy-manifest.ts --theme burgundy-velvet-autumn` üretir / `--check` denetler); hepsi
standart anahtar; görünür sabit metin `data-copy`'siz değil. `max` değerleri `theme-check --stress` (her anahtar en uzununda) ile
denetlendi: nav'da Cinzel büyük harfleri geniş, 4 × 8 karakter 360 px'e sığmadı → 04/05'in değerleri (Home 6, Story 6, Details 7,
RSVP 5; teşekkür nav'ında üç öğe olduğu için The Day 10) ve ≤ 400 px'te daha dar harf aralığı (en uzunlarla 360 px'te 34 px pay).

## Misafir adları (G069 satırı)
`<template data-rsvp-party>` "Number of guests" alanının (ve hata yuvasının) hemen arkasında; formun kendi `.field` stili, yeni süs yok.

## Bilinen sınırlar
- Gerçek iPhone / Safari, gerçek yayın (alan adı, CDN) ve gerçek misafir fotoğraflarıyla görsel test yapılmadı (Playwright Chromium).
- Comp'taki geri sayım kutuları, nav fleur'ü, details'teki kart–çerçeve kadife bağı ve story'deki ortadaki çerçevenin böğürtlen
  süsü GPT parçası olarak yok; yerine düz rakamlar / tılsım kullanıldı, bağ kaldırıldı (yukarıdaki haritada).
- Üçüncü yazı ailesi (Cormorant Garamond) görev metninde yoktu (Pinyon + Cinzel); comp'un italik mekân ve yer satırları ile gövde
  metni için eklendi (Cinzel'in küçük harfi ve italiği yok). docs/11 §6 sınırı (≤ 3 aile) içinde. Cinzel tek değişken yüz olarak
  istenir (`wght@400..500`: büyük rakamlar 400, satırlar 500); iki ayrı ağırlıkla `document.fonts.check` yalnız 500 kullanan
  sayfalarda "Cinzel yüklenmedi" uyarısı veriyordu (font yüklüydü, denetim 400'ü soruyordu).
- GPT kurdele parçasının dikey bandı comp'tan %22 geniş (0,1107 / 0,0904); parça değiştirilmedi.
- RSVP 360 × 640'ta imza katlanır ve kartın altında boş kâğıt kalır (yukarıda).
