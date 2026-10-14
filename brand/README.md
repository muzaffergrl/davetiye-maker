# BKE Studio — marka rehberi (GM02)

Yön: GM01 **C "The Reveal"** (K27). Ad **BKE Studio**, kesin onay bekliyor (K26): ad onaylanmadan hiçbir yerde yayına alınmaz.
Bütün şekiller GPT'nin `assets/gpt/final/` çıktılarından **izlendi** (K21). Burada yeni şekil ya da dekor çizilmedi. Yapılanlar
izleme, temizleme, ölçüye oturtma, yeniden renklendirme ve yazı yerleşimiyle sınırlı.

## Logo sürümleri — hangisi nerede

| Sürüm | Dosya (`svg/`) | Ne zaman |
|---|---|---|
| Yatay logo (birincil) | `bke-logo-horizontal-anchor.svg` | Site başlığında, e-postada, belgelerde, açık zeminde (kâğıt ya da beyaz). Altın kapak şeridi yalnız bu ve dikey logoda bulunur. |
| Yatay, koyu zemin | `bke-logo-horizontal-reverse.svg` | Patlıcan/siyah zeminde kâğıt rengi ve altınla. Örnek: site alt bilgisi, koyu banner. |
| Dikey logo | `bke-logo-stacked-anchor.svg` / `-reverse` | Kare ve dikey alanlarda: Etsy "About" görseli, sosyal gönderi, kartvizit. |
| Yazı logosu | `bke-wordmark-anchor.svg` | Sembolün zaten göründüğü yerlerde (ör. favicon sekmede, banner'da mühür varken). |
| Sembol | `bke-monogram-anchor.svg` | Sembol tek başına, **48 px ve üstü**: avatar, mühür, desen kaynağı. |
| Küçük sembol | `bke-monogram-small-anchor.svg` | **16–47 px**: favicon ve küçük rozet. Daha kalın çizilmiştir, kapak boşluğu geniştir. |
| Tek renk | `*-black.svg` (#000000), `*-white.svg` (#FFFFFF) | Tek renk baskı (damga, lazer). Beyaz sürüm koyu zeminde ya da sakin bir fotoğraf alanında kullanılır. |

Notlar:
- Sembolün beyaz görünen yerleri (K ve kapak çizgisi) **boşluktur**, zemin içinden görünür.
- GPT `wordmark.png`'yi metin siyahıyla (#202020) çizmişti. SVG'de logo diliyle aynı olsun diye ana renge (#2B1526) çevrildi.
- Tek renkli sürümlerde altın şerit sembolün gövdesiyle birleşir. GPT'nin tek renkli `monogram.png`'si de böyledir.
- Sembol tam kare değildir (yaklaşık 1.09:1 ve 1.03:1). GPT çizimi korunmuştur.

## Koruma alanı ve en küçük boy

- **Koruma alanı:** Sembollü sürümlerde sembol yüksekliğinin 1/4'ü, yalnız yazı logosunda BKE harf yüksekliğinin 1/2'si.
  Bu alana yazı, kenar ya da başka logo girmez.
- **En küçük boy (ekran):** yatay logo 24 px yükseklik (~145 px genişlik), dikey logo 64 px, yazı logosu 20 px, sembol
  48 px, küçük sembol 16 px, rozet 32 px. Baskıda yatay logo en az 30 mm genişlikte olur.
- 32 ve 16 px provası: `proofs/svg_proof.png`. 32 px'te dikey logodaki "Studio" okunmaz, bu boyda yatay logo kullanılır.

## Renkler

`tokens.json` içinde. Değerler `brand_board_final.png`'deki 5 düz karttan ölçüldü (her kart %100 tek renk).

| Token | Hex | Kullanım |
|---|---|---|
| anchor | `#2B1526` | koyu patlıcan: logo, başlık, koyu zemin |
| accent | `#D0AE6A` | düz şampanya altını (metalik değil): kapak şeridi, ince vurgu |
| paper | `#EDE5D7` | kâğıt nötrü: kart/şerit zemini, koyu zeminde açık yazı |
| ink | `#202020` | gövde metni |
| secondary | `#9F84A7` | toz lavanta: dekor, etiket zemini |
| paper_light | `#FAF7F0` | sayfa zemini (pano zemininden) |

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
- Sembolü döndürmek, eğmek ya da orantısız esnetmek. Tek istisna: favicon (`icon.svg`, 16/32 px) piksel ızgarasına otursun
  diye kareye ~%3 esnetildi.
- Gölge, parlama, gradyan, metalik/folyo efekti, kontur ya da 3B eklemek.
- Altın şeridi başka renge boyamak, tek renkli sürüme altın eklemek ya da kapak boşluğunu doldurmak.
- Palet dışı renk kullanmak. Anchor renkli logoyu koyu zemine koymak (koyu zeminde `-reverse` ya da `-white` kullanılır).
- Altını ya da lavantayı açık zeminde metin rengi yapmak.
- Logoyu kalabalık fotoğraf alanına koymak ya da koruma alanını ihlal etmek.
- GPT PNG'lerini (`assets/gpt/final/`) üretim dosyası gibi kullanmak. SVG kullanılır.

## Dosyalar ve kaynakları

| Çıktı | Kaynak | Nasıl |
|---|---|---|
| `svg/bke-monogram-{anchor,black,white}.svg` | `assets/gpt/final/monogram.png` | potrace 1.16, çokgen kipi (alphamax 0). Kenar tırtıkları temizlendi; dik/yatay kenarlar hizalandı. 16 düğüm. |
| `svg/bke-monogram-small-{…}.svg` | `monogram_small.png` | Aynı yöntem, 17 düğüm. Alt kenardaki GPT lekeleri temizlendi. |
| `svg/bke-wordmark-{…}.svg` | `wordmark.png` | B eğri (alphamax 0.6), K ve E çokgen, "Studio" eğri (alphamax 0.9). |
| `svg/bke-logo-horizontal-{anchor,black,white,reverse}.svg` | `logo_horizontal.png` | Sembol çokgen, yazı yukarıdaki gibi. Altın katmanı ayrı izlendi; ana renk altının 2 px altına taşar, birleşimde boşluk kalmaz. |
| `svg/bke-logo-stacked-{…}.svg` | `logo_stacked.png` | Aynı yöntem. |
| `tokens.json` | `brand_board_final.png` | Kart ortasında en sık piksel; kontrast WCAG formülüyle hesaplandı. |
| `../platform/public/brand/favicon.ico` (16/32/48), `favicon-16.png`, `favicon-32.png`, `icon.svg` | küçük sembol SVG'si | Koyu kare + kâğıt renkli K (kesikler kâğıtla dolu), açık ve koyu sekmede okunur. Chromium ile çizildi. |
| `../platform/public/brand/apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | küçük sembol SVG'si | Dükkân ikonu düzeni: patlıcan zemin, kâğıt renkli sembol, genişliğin %56'sı (köşeler %80'lik maskable dairesinin içinde). |
| `etsy/bke-shop-icon.svg`, `etsy_shop_icon_500.png`, `etsy_shop_icon_1000.png` | `shop_icon.png` | Sembol izlendi; GPT'nin konum ve ölçüsü korundu, %70 daire içinde. |
| `etsy/etsy_banner_big_3360x840.jpg` | `brand_scene_wide.png` + yazı logosu SVG | Nesne bandı (y 300–740) tam alındı. 4:1 için sağa sahnenin boş kâğıt yüzeyinin aynası eklendi, ~1,9× büyütüldü. |
| `etsy/etsy_banner_mini_1600x213.jpg` | `brand_scene_wide.png` + yazı logosu SVG | Zemin sahnenin boş kâğıdı (yumuşatıldı, ton eşitlendi). Solda sahnenin küçültülmüş nesne grubu, sağda yazı logosu. |
| `badge/made-with-bke-studio-{light,dark}.svg` | küçük sembol + yazı logosu SVG + DM Sans 500 | "Made with" harf yollarına çevrildi; font dosyası gömülmedi. |
| `proofs/svg_proof.png`, `proofs/favicon_proof.png`, `proofs/font_match.png` | — | Chromium çizimi, kontrol sayfaları. |

İzleme doğrulaması: her SVG, kaynak PNG ölçeğinde Chromium'da çizildi ve alfa maskesiyle karşılaştırıldı.
1 px'ten büyük sapma yoktur. Tek istisna `monogram`: kesik köşe ucu kare kenarına ~2,7 px içeri hizalandı (bilinçli temizlik).

## Etsy ölçüleri — [VERIFY]

`help.etsy.com` bu ortamdan açılamadı (proxy reddi). Aşağıdaki değerler Etsy Seller Handbook ve Help Center sayfalarının arama
sonucu özetlerinden alındı. Yüklemeden önce Etsy'nin yükleme ekranında doğrulanmalı.

- **Dükkân ikonu:** 500×500 gösterim. 500 ve 1000 px dosya var. [VERIFY]
- **Büyük banner:** Handbook önerisi 3360×840, en az 1200×300. Help Center'da 1600×400 önerisi de geçiyor. Dosya 3360×840.
  [VERIFY] Mobilde nasıl kırpıldığı bilinmiyor. Yazı logosu sağdaki %57–93 bandında; mobil kırpım ortadan alıyorsa yeniden
  yerleştirilir. [VERIFY]
- **Mini banner:** Help Center'da en az 1200×160, önerilen 1600×213; mobilde görünmez. Dosya 1600×213 (oran 7.5:1). [VERIFY]
- Büyük banner'ın kaynak sahnesi 1536 px genişliğinde. Fotoğraf kısmı büyütüldüğü için hafif yumuşaktır; yazı logosu vektörden
  çizildiği için keskindir.
- Hiçbir yere yükleme yapılmadı. Etsy hesabı gelince yapılacak.

## "Made with BKE Studio" rozeti

`badge/made-with-bke-studio-light.svg` açık zemin içindir (#2B1526). `-dark.svg` koyu zemin içindir (#EDE5D7).
Ölçü 193.67×40 birimdir; 32–40 px yükseklikte kullanılır. **Bağlantı hedefi kararlaştırılmadı** (alan adı yok, K26). Rozet
misafir sitesi temalarına bağlanmadı; hedef URL kararından sonra bağlanır.
