# BKE Studio — marka rehberi (GM02, G129)

Yön: GM01 **C "The Reveal"** (K27). Ad **BKE Studio**, kesin onay bekliyor (K26): ad onaylanmadan hiçbir yerde yayına alınmaz.

**2026-10-16 (G129): sembolde K yerine S.** Kullanıcı isteği; GPT çıktısı `assets/gpt/final_s/` (GM08). Yalnız sembol değişti:
"BKE Studio" yazısı, renkler ve "The Reveal" fikri (kapak şeridi = altın kama) aynı. Eski K'li SVG'ler silinmedi,
`svg/_k_eski/` altında durur (yalnız arşiv; hiçbir yerde kullanılmaz).

Bütün şekiller GPT'nin çıktılarından **izlendi** (K21). Burada yeni şekil ya da dekor çizilmedi. Yapılanlar izleme, temizleme,
ölçüye oturtma, yeniden renklendirme ve yerleşimle sınırlı.

## Logo sürümleri — hangisi nerede

| Sürüm | Dosya (`svg/`) | Ne zaman |
|---|---|---|
| Yatay logo (birincil) | `bke-logo-horizontal-anchor.svg` | Site başlığında, e-postada, belgelerde, açık zeminde (kâğıt ya da beyaz). |
| Yatay, koyu zemin | `bke-logo-horizontal-reverse.svg` | Patlıcan/siyah zeminde kâğıt rengi ve altınla. Örnek: site alt bilgisi, koyu banner. |
| Dikey logo | `bke-logo-stacked-anchor.svg` / `-reverse` | Kare ve dikey alanlarda: Etsy "About" görseli, sosyal gönderi, kartvizit. |
| Yazı logosu | `bke-wordmark-anchor.svg` | Sembolün zaten göründüğü yerlerde (ör. favicon sekmede, banner'da mühür varken). G129'da değişmedi. |
| Sembol | `bke-monogram-anchor.svg` / `-reverse` | Sembol tek başına, **48 px ve üstü**: avatar, mühür, desen kaynağı. |
| Küçük sembol | `bke-monogram-small-anchor.svg` / `-reverse` | **16–47 px**: favicon ve küçük rozet. S kareye göre biraz daha büyüktür (GPT'nin favicon çizimi). |
| Tek renk | `*-black.svg` (#000000), `*-white.svg` (#FFFFFF) | Tek renk baskı (damga, lazer). Beyaz sürüm koyu zeminde ya da sakin bir fotoğraf alanında kullanılır. |

Notlar:
- Sembolün beyaz görünen yerleri (S ve kama üstündeki ince kesik) **boşluktur**, zemin içinden görünür.
- İki renkli sürümlerde (`-anchor`, `-reverse`) altın kama her sembolde vardır (GPT'nin S çıktılarının hepsinde var; eski K
  sembolü tek renkliydi). Tek renkli sürümlerde altın kama sembolün gövdesiyle birleşir, kesik boşluk olarak kalır.
- Sembol tam kare değildir: sembol 1,097:1, küçük sembol 1,081:1, yatay logodaki sembol 1,19:1, dikeydeki 1,105:1.
  GPT her dosyada kareyi biraz farklı çizdi; her sürüm kendi PNG'sinden izlendi, oranlar korundu.
- `-reverse` sembol dosyaları G129'da eklendi (koyu zeminde altınlı sembol için).

## Koruma alanı ve en küçük boy

- **Koruma alanı:** Sembollü sürümlerde sembol yüksekliğinin 1/4'ü, yalnız yazı logosunda BKE harf yüksekliğinin 1/2'si.
  Bu alana yazı, kenar ya da başka logo girmez.
- **En küçük boy (ekran):** yatay logo 24 px yükseklik (~140 px genişlik), dikey logo 64 px, yazı logosu 20 px, sembol
  48 px, küçük sembol 16 px, rozet 32 px. Baskıda yatay logo en az 30 mm genişlikte olur.
- 16/24/32 px provası: `proofs/s_svg_proof.png` (bütün sürümler, açık/koyu zemin, eski K ile yan yana),
  `proofs/s_favicon_proof.png` (sekme çubuğunda gerçek boy ve ×8). 16 px'te S okunur, altın kama 2–3 px'lik bir vurgu olarak
  kalır, kesik seçilmez. 32 px'te dikey logodaki "Studio" okunmaz, bu boyda yatay logo kullanılır.
- Sitede görünüm: `proofs/s_site_proof.png` (başlık, alt bilgi, /start çubuğu, masaüstü hero deseni; yerel `next dev`).

## Renkler

`tokens.json` içinde. Değerler `brand_board_final.png`'deki 5 düz karttan ölçüldü (her kart %100 tek renk).

| Token | Hex | Kullanım |
|---|---|---|
| anchor | `#2B1526` | koyu patlıcan: logo, başlık, koyu zemin |
| accent | `#D0AE6A` | düz şampanya altını (metalik değil): sembolün kaması, ince vurgu |
| paper | `#EDE5D7` | kâğıt nötrü: kart/şerit zemini, koyu zeminde açık yazı |
| ink | `#202020` | gövde metni |
| secondary | `#9F84A7` | toz lavanta: dekor, etiket zemini |
| paper_light | `#FAF7F0` | sayfa zemini (pano zemininden) |

GPT'nin S PNG'lerindeki tonlar (ör. patlıcan #321527 civarı, altın #CFAA67 civarı, hafif doku) SVG'de token renklerine çevrildi.

Kontrast (WCAG, tam tablo `tokens.json` → `contrast.pairs`):
- **Metin için geçenler (≥ 4.5:1):**
  - ink veya anchor, paper / paper_light / beyaz üstünde: 13.03–16.96
  - paper, anchor üstünde: 13.56
  - altın, anchor üstünde: 8.03; ink üstünde: 7.72
  - anchor, altın üstünde: 8.03
  - anchor, lavanta üstünde: 5.12; ink, lavanta üstünde: 4.91
  - lavanta, anchor üstünde: 5.12
- **Metin olmaz:**
  - altın, açık zeminde: 1.69–1.97
  - lavanta, paper üstünde: 2.65
  - lavanta, paper_light ya da beyaz üstünde: 3.10–3.32 (yalnız büyük yazıda ≥ 3:1)
  - beyaz, lavanta üstünde: 3.32

## Yazı tipleri (öneri, yalnız ad)

| Rol | Google Fonts (OFL) | Ayar |
|---|---|---|
| Kalın başlık (BKE'ye yakın) | **Archivo** | 900, genişlik 125 (Expanded), harf aralığı −0.01em |
| İnce başlık eşi (Studio'ya yakın) | **Montserrat** | 300, harf aralığı +0.08em |
| Gövde metni / arayüz | **DM Sans** | 400 / 500 |

- Alternatifler: ince başlık için Jost 300 ya da Urbanist 300, metin için Jost 400.
- Karşılaştırma: `proofs/font_match.png`. Bu fontlar logoya yakındır ama aynısı değildir. Logo **her zaman SVG'den** kullanılır,
  fontla yeniden yazılmaz.
- Font dosyası repoya ya da pakete konmaz; Google Fonts'tan bağlanır (`tokens.json` → `font.css_import`).

## Yanlış kullanım

- Yazımı değiştirmek: "Bke Studio", "BKE studio", "BKE Studios", logo içinde "BKEStudio", ek kelime ya da slogan.
  (`BKEStudio` yalnız Etsy dükkân adı olarak düz metindir.)
- Sembolü döndürmek, eğmek ya da orantısız esnetmek. Favicon PNG'leri piksel ızgarasına otursun diye sembol 16 × 15,
  32 × 30, 48 × 44 px çizilir (yatayda ≤ %1,5 sıkışma); `icon.svg` oranı korur (üstte/altta boşluk).
- Gölge, parlama, gradyan, metalik/folyo efekti, kontur ya da 3B eklemek.
- Altın kamayı başka renge boyamak, tek renkli sürüme altın eklemek ya da kesiği doldurmak.
- Eski K sembolünü (`svg/_k_eski/`) yeni işte kullanmak.
- Palet dışı renk kullanmak. Anchor renkli logoyu koyu zemine koymak (koyu zeminde `-reverse` ya da `-white` kullanılır).
- Altını ya da lavantayı açık zeminde metin rengi yapmak.
- Logoyu kalabalık fotoğraf alanına koymak ya da koruma alanını ihlal etmek.
- GPT PNG'lerini (`assets/gpt/final/`, `assets/gpt/final_s/`) üretim dosyası gibi kullanmak. SVG kullanılır.

## Dosyalar ve kaynakları

| Çıktı | Kaynak | Nasıl |
|---|---|---|
| `svg/bke-monogram-{anchor,reverse,black,white}.svg` | `final_s/monogram_s.png` | Kare: kenarları ölçülen dikdörtgen. Kesik ve kama: kenar piksellerine uydurulan üç düz çizgi. S boşluğu: potrace 1.16 (eğri kipi, ×4 büyütülmüş maske, hafif yumuşatma); 0,3°'ye kadar eğik yatay/dikey kenarlar düzeltildi. Kare sol-üst = 0,0, birim = GPT pikseli. |
| `svg/bke-monogram-small-{…}.svg` | `final_s/monogram_small_s.png` | Aynı yöntem. |
| `svg/bke-logo-horizontal-{anchor,reverse,black,white}.svg` | `final_s/logo_horizontal_s.png` + eski SVG'nin yazısı | Sembol bu PNG'den izlendi (sembol 268 px genişlikte olduğu için yumuşatma daha güçlü). Yazı `_k_eski/` dosyasından **aynen** alındı (koordinatlar yalnız viewBox'a göre +2,25 / +3,5 kaydı). Sembol GPT'nin yeni yerleşimindeki boy ve konumda (eski izlemenin eşlemesi: SVG = PNG − (115,25, 403)). viewBox 1308,08 × 225. |
| `svg/bke-logo-stacked-{…}.svg` | `final_s/logo_stacked_s.png` + eski SVG'nin yazısı | Sembol izlendi; GPT yeni PNG'de yerleşimi büyüttüğü için ölçek yazı genişliğinden (767,25 / 902). Sembol yazının ortasına hizalandı (GPT'de 2,45 birim sağa kaymıştı), sembol–yazı boşluğu GPT'den (51,9). Yazı aynen; +55,96 aşağı kaydı. viewBox 767,32 × 554,88. |
| `svg/bke-wordmark-{…}.svg` | `final/wordmark.png` | Değişmedi (GM02). |
| `tokens.json` | `final/brand_board_final.png` | Değişmedi. |
| `../platform/public/brand/favicon.ico` (16/32/48), `favicon-16.png`, `favicon-32.png`, `icon.svg` | küçük sembol SVG'si | Patlıcan sembol + altın kama, boşluklar kâğıtla dolu (açık ve koyu sekmede okunur). PNG'ler piksel ızgarasına oturtuldu. |
| `../platform/public/brand/apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | `etsy/bke-shop-icon.svg` | GPT'nin yeni dükkân ikonu düzeni: patlıcan zemin, kâğıt S, altın kama (kutusuz). Sembolün en uzak noktası merkezden genişliğin %32,4'ü (maskable %40 dairesinin içinde). |
| `../platform/public/brand/bke-logo-horizontal-{anchor,reverse}.svg`, `bke-monogram-small-anchor.svg` | `svg/` | Aynen kopya. |
| `../platform/public/brand/pattern_tile.png` | `final/pattern_tile.png` ızgarası + `svg/bke-monogram-black.svg` | GPT karosunun düzeni korundu (1024 px, 4 × 4, 256 px hücre, ~169 px sembol, altın/kâğıt); K yerine S sembolünün tek renk yolu kondu. Yeni çizim yok; istenirse GPT'den S'li karo istenip bununla değiştirilir. |
| `etsy/bke-shop-icon.svg`, `etsy_shop_icon_500.png`, `etsy_shop_icon_1000.png` | `final_s/shop_icon_s.png` | S ve kama izlendi; GPT'nin konum ve ölçüsü korundu, daire kırpımına uygun (en uzak nokta %32,4). |
| `etsy/etsy_banner_big_3360x840.jpg`, `etsy_banner_mini_1600x213.jpg` | `final/brand_scene_wide.png` + yazı logosu SVG | **G129'da değişmedi:** sahnedeki mum mühürlerde K var (fotoğrafik GPT sahnesi). S'li yeni sahne GPT'den gerekir; o gelene kadar banner'lar yüklenmez. |
| `badge/made-with-bke-studio-{light,dark}.svg` | küçük sembol (tek renk) + yazı logosu SVG + DM Sans 500 | G129: sembol yolu S ile değişti (24 birim yükseklik, 25,94 genişlik); "Made with" ve yazı aynı. |
| `proofs/s_svg_proof.png`, `s_favicon_proof.png`, `s_site_proof.png` | — | Chromium çizimi. Eski K provaları (`svg_proof.png`, `favicon_proof.png`) arşiv olarak duruyor. |

İzleme doğrulaması (G129): her sembol, kaynak PNG ölçeğinde çizildi ve alfa maskesiyle karşılaştırıldı.
- Yatay logo sembolü ≤ 1 px; dikey ≤ 2 px (p99 1,4); sembol ≤ 3 px (p99 1,4); küçük sembol ≤ 3 px (p99 2,2).
- 1 px'i aşan sapmalar bilinçli temizliktir:
  - GPT'nin kesik/kama çizgileri hafif eğriydi (≤ 1,7 px); düz çizgiye çekildi.
  - Kesiğin yuvarlak ucu, kamanın ucuna düz kirişle kapatıldı.
  - S'nin 0,2–0,4° eğik yatay kenarları düzeltildi.
- Logo yazısı: yeni ve eski SVG'lerde 834 (yatay) ve 654 (dikey) koordinat, kaydırma çıkarılınca birebir aynı.

## Etsy ölçüleri — [VERIFY]

`help.etsy.com` bu ortamdan açılamadı (proxy reddi). Aşağıdaki değerler Etsy Seller Handbook ve Help Center sayfalarının arama
sonucu özetlerinden alındı. Yüklemeden önce Etsy'nin yükleme ekranında doğrulanmalı.

- **Dükkân ikonu:** 500×500 gösterim. 500 ve 1000 px dosya var (G129: S). [VERIFY]
- **Büyük banner:** Handbook önerisi 3360×840, en az 1200×300. Help Center'da 1600×400 önerisi de geçiyor. Dosya 3360×840.
  [VERIFY] Mobilde nasıl kırpıldığı bilinmiyor. Yazı logosu sağdaki %57–93 bandında; mobil kırpım ortadan alıyorsa yeniden
  yerleştirilir. [VERIFY] **Sahnede K mühürleri var; S'li GPT sahnesi bekleniyor.**
- **Mini banner:** Help Center'da en az 1200×160, önerilen 1600×213; mobilde görünmez. Dosya 1600×213 (oran 7.5:1). [VERIFY]
  Büyük banner'la aynı sahne; aynı nedenle bekliyor.
- Büyük banner'ın kaynak sahnesi 1536 px genişliğinde. Fotoğraf kısmı büyütüldüğü için hafif yumuşaktır; yazı logosu vektörden
  çizildiği için keskindir.
- Hiçbir yere yükleme yapılmadı. Etsy hesabı gelince yapılacak.

## "Made with BKE Studio" rozeti

`badge/made-with-bke-studio-light.svg` açık zemin içindir (#2B1526). `-dark.svg` koyu zemin içindir (#EDE5D7).
Ölçü 193.67×40 birimdir; 32–40 px yükseklikte kullanılır. **Bağlantı hedefi kararlaştırılmadı** (alan adı yok, K26). Rozet
misafir sitesi temalarına bağlanmadı; hedef URL kararından sonra bağlanır.
