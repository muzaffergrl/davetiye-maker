# Yeni tasarımlar 23–28 — "farklı görünen, farklı hissettiren" dalga (2026-10-17)

Kullanıcı (2026-10-17): yapılacaklar bitince, şimdiye kadar yaptıklarımızdan **her açıdan farklı görünen ve hissettiren**,
farklı animasyon ve bileşenler kullanan yeni tasarımlar. GPT'nin yapacağı görseller için prompt'lar hazırlanır; kullanıcı
döndüğünde GPT ile üretilip yerleştirilir.

## Ortak kurallar

- Stil kuralı aynı: klasik, romantik, zengin, geniş beğeni; ultra-minimal/editoryal yok (AGENTS.md).
- **K21:** sahne ve bütün dekor parçaları GPT'den gelir; Claude şekil/dekor çizmez. Claude: tema kodu (HTML/CSS/JS), metin
  katmanı, foto alanları, hareket koreografisi, bileşenler, `build_images.py` hattı, prompt dosyası.
- **K23 yapısı korunur, nesne değişir:** ilk sayfa **kapalı bir davet nesnesi** (zarf şart değil: kutu, perde, kapı, bilet
  cüzdanı, katlı kâğıt…) → dokununca sırayla açılır → asıl içerik **yeni sayfada** (home); ek sayfalar ana sayfadan.
- Mobile-first (360–430 px önce), `prefers-reduced-motion` saygısı, CSP: yalnız temanın kendi JS dosyaları.
- Platform özelliklerinin hepsi: G138 içerik blokları (Details 0–10, Travel & stay, Meal & menu), G127 harita, G126 ses
  kancaları, G128 RSVP alanları, G144 dil etiketleri, G139 basılı davetiye (composed düzen), G146 akışı.
- Tema standardı: `docs/11_TEMA_STANDARDI.md`; örnek yapı: `platform/themes/nocturne-lake-estate/` (22, "coming", GPT
  parçaları gelmeden kurulmuş tema). `theme-check --stress` hatasız.
- Satış durumu **coming**; GPT parçaları gelip yerleşince ve göz kontrolünden sonra `live`.
- Katalog: `tools/katalog.py` 6 ekseninin en az 4'ünde her tasarımdan farklı + yeni eksen **hareket imzası**
  (bu dalgada her tasarımın açılış ve sayfa hareketi diğer 22'den farklı).
- GPT prompt'ları **İngilizce**, her parça için tam yol ve dosya adı: `collections/<NN>_<Ad>/assets/gpt/GPT_PROMPTS.md`
  (PAKET 5 = website katmanları, PAKET 2 = örnek fotoğraflar (kurgu çift), PAKET 6 = basılı davetiye ön/arka zemin).

## Tasarımlar

| # | id | Ad | Kapalı nesne / açılış | Foto sunumu | Dekor ailesi | Teknik | Font hedefi | Ana palet | Hareket imzası |
|---|---|---|---|---|---|---|---|---|---|
| 23 | velvet-jewel-box | Velvet Jewel Box | Patlıcan moru kadife yüzük kutusu; kapak menteşeden 3B açılır, saten astar ve davet kartı yükselir | 3B silindir karusel (mücevher vitrini gibi döner, kaydırılır) | Saten kurdele, inci, yüzük, şampanya rengi saten kıvrımlar | fotogerçekçi ürün çekimi | Bodoni Moda + Pinyon Script | aubergine-champagne | Menteşe 3B açılış, saten ışık süpürmesi, varak parıltılı başlık, karusel |
| 24 | grand-theatre-premiere | Grand Theatre Premiere | Tavus mavisi kadife sahne perdesi; iki kanat kıvrımlarıyla aralanır, spot ışığı sahneyi tarar | Sahne çerçevesi içinde "perde arası" kartları; spot ışığı dokunulanı aydınlatır | Kadife perde, püskül, altın proscenium kemer, program (playbill) kâğıdı | yağlı boya tiyatro afişi | Playfair Display + Abril Fatface (başlık) | peacock-antique-gold | Perde aralanması, ışık maskesi, program sayfası geçişi, bilet koçanı yırtma (RSVP) |
| 25 | orient-express-voyage | Orient Express Voyage | Deri bilet cüzdanı; kayış çözülür, birinci sınıf bilet kayar | Vagon penceresi biçimli çerçeveler; kaydırınca manzara gibi geçer | Pirinç vagon detayları, bagaj etiketi, eski harita, istasyon saati | vintage seyahat afişi (litografi) | Limelight + Cormorant Garamond | bottle-green-brass | Haritada rota çizgisi kaydırmayla çizilir, istasyonlar sırayla, sallanan bagaj etiketi, biniş kartı damgası |
| 26 | kintsugi-washi | Kintsugi & Washi | Çivit washi kâğıdı origami gibi katlanmış; katlar sırayla açılır | Mürekkep yayılması maskesiyle beliren fotoğraflar | Altın kintsugi damarları, washi dokuları, mürekkep fırçası darbeleri | sumi mürekkep + altın varak | Shippori Mincho + Allura | indigo-gold-rice | Kat kat açılma, altın damar parıltısı, mürekkep yayılımı ile foto, süzülen altın varak pulları |
| 27 | riad-lantern-nights | Riad Lantern Nights | Oyma sedir ağacı çift kapı; kanatlar 3B açılır, fener ışığı içeri vurur | Kemer (Fas kemeri) biçimli pencerelerden ışıkla beliren fotoğraflar | Zellige çini, pirinç fenerler, sedir oyma, bougainvillea | gouache + gerçekçi doku | Cinzel + Marcellus SC | teal-saffron-brass | Kapı açılışı, fener titreşimi (ışık), çini bordürün sırayla dizilmesi, kemerden ışık süzmesi |
| 28 | maison-patisserie | Maison Pâtisserie | Fıstık yeşili pasta kutusu, saten fiyonk; fiyonk çözülür, kapak kalkar, ipek kâğıt aralanır | Pastane vitrini rafları (kartlar raflarda kayar) | Makaron, tül, şeker inci, altın kenar tabak | pastel suluboya + fotogerçekçi pasta | Italiana + Parisienne | pistachio-rose-cream | Fiyonk çözülmesi, kapak kalkışı, raf kaydırma bileşeni, gönderimde şeker inci yağmuru |

Ayrıntı: her koleksiyonun `DESIGN_BRIEF.md` dosyası (oturum açar). İş görevleri: G161–G166.

## 2. dalga — 29–32 (2026-10-17)

Kurallar aynı (yukarıda). Ek: GPT parçaları gelmeden kurulur; `tools/gpt_kuru_deneme.py` (G167) ile bırak-çalıştır provası
geçmeli; baskı ara zemini G149 serbest alan testini geçmeli; statik tema dosyaları (G159) otomatik.

| # | id | Ad | Kapalı nesne / açılış | Foto sunumu | Dekor ailesi | Teknik | Font hedefi | Ana palet | Hareket imzası |
|---|---|---|---|---|---|---|---|---|---|
| 29 | celestial-observatory | Celestial Observatory | Pirinç teleskop / gözlemevi kubbesi; kubbe yarığı açılır, gece göğü görünür | Döner yıldız haritası (planisfer) çerçeveleri; kaydırınca gök döner | Yıldız haritası, pirinç usturlap, gezegen yörüngeleri, ay evreleri | gravür + altın varak | Cormorant Unicorn? yerine Cinzel Decorative + EB Garamond | midnight-silver-gold | Kubbe açılışı, yıldızların sırayla parlaması, takımyıldız çizgisinin çiftin baş harflerini birleştirmesi (UI çizgi), döner gök |
| 30 | azulejo-mosaic | Azulejo Mosaic | Mavi-beyaz çini duvar; çiniler tek tek 3B döner, arkadan davet çıkar | Çini mozaiği: fotoğraf çini karolarının dönmesiyle beliren | Kobalt azulejo desenleri, terrakota saksı, limon dalı yok (05'ten ayrı) | el boyaması seramik | Playfair Display + Montserrat? yerine Cormorant + Josefin Sans | cobalt-white-terracotta | Karo karo 3B çevirme ızgarası, dalga hâlinde açılan çini yüzeyi |
| 31 | sky-lantern-festival | Sky Lantern Festival | Kâğıt fener avuçlarda; dokununca ışır ve yükselir | Yükselen fenerlerin ışığında beliren fotoğraflar | Pirinç kâğıdı fenerler, alacakaranlık gökyüzü, yıldız tozu | suluboya + ışık | Marcellus + Allura | dusk-amber-violet | Fener yükselişi (paralaks katmanlar), sıcak ışık hâlesi, kaydırmayla süzülen fenerler |
| 32 | music-box-ballerina | Music Box Ballerina | Lake müzik kutusu; kapak açılır, balerin döner, tarak melodisi | Kutunun ayna kapağında yansıyan fotoğraflar | Saten astar, pirinç kurma anahtarı, tül, gül yaprakları | fotogerçekçi + pastel | Bodoni Moda yerine Playfair Display SC + Great Vibes | rose-quartz-gold | Kapak menteşesi, balerinin yavaş dönüşü (GPT kare dizisi/2B döndürme), kurma anahtarıyla müzik başlatma |

Not: font sütunundaki "yerine" ifadeleri ilk akla geleni eler; oturum tasarıma en uygun Google Fonts çiftini seçer ve
22+6 tasarımdan farklı olmasına dikkat eder.

## 3. dalga — 33–38 (2026-10-18)

Kurallar aynı (yukarıda; 2. dalga ekleri dahil). Ek, **K23 sıkı:** kullanıcı 2026-10-18'de 22–32'nin hepsine katalogda
kapalı **zarf** kapağı koydu (main f1228e88: `components/marketing/InvitationCover.tsx`, "TAP TO OPEN"). Bu dalgada ilk
sayfa her tasarımda **kapalı bir zarf**; farklılık zarfın **türü, malzemesi, kapanma düzeni ve açılış koreografisinde**
(kılıf, kemer, tokalı kayış, ip-düğme, ipek kese, kâğıt kesim bant…) ve iç sayfaların bileşenlerinde. Zarf açılınca kart
yükselir → asıl içerik yeni sayfada (home). İlk sayfanın düzeni katalog kapağıyla uyumlu: üstte "Together with their
families" + isimler, ortada zarf, altta tarih · yer ve "Tap to open", köşede Skip. Hiçbiri 01–32'nin zarfına (V kapak +
mum mühür, bkz. 01–21) **birebir benzememeli**.

| # | id | Ad | Kapalı zarf / açılış | Foto sunumu | Dekor ailesi | Teknik | Font hedefi | Ana palet | Hareket imzası |
|---|---|---|---|---|---|---|---|---|---|
| 33 | marigold-mehndi | Marigold & Mehndi | Fuşya ipek zarf, altın lazer kesim paisley kılıfın içinde; kılıf yana kayar, püskül sallanır, kapak açılır, kart kadife-fuşya astardan yükselir; kadife çiçeği yaprakları süzülür | Jharokha (Rajasthan pencere kemeri) çerçeveler; fotoğrafın çevresinde kına deseni çizgi çizgi "çizilerek" belirir (GPT kına çizimi + maske) | Kadife çiçeği çelenkleri, kına desenleri, pirinç diya kandilleri, ipek püsküller | zengin minyatür + fotogerçekçi ipek | Yatra One? yerine Rozha One + Cormorant Infant | saffron-fuchsia-gold | Kılıf kayması, püskül sarkacı, kına çizgisinin akması, diya alevlerinin sırayla yanması |
| 34 | red-lacquer-double-happiness | Red Lacquer & Double Happiness | Kırmızı kâğıt zarf, altın varak 囍 ve ip-düğme kapama; ip düğmeden çözülerek döner, kapak kalkar, kâğıt kesim (jianzhi) şakayık pencere katlarından açılır | Ay kapısı (moon gate) yuvarlak çerçeveler; kâğıt kesim katmanların paralaksı | Şakayık, kâğıt kesim desenleri, kırmızı lake, altın bulut motifleri, püsküllü düğüm | kâğıt kesim + lake + altın varak | Noto Serif Display + Ma Shan Zheng (yalnız 囍 için, metin İngilizce) | lacquer-red-gold-cream | İpin düğmeden dönerek çözülmesi, kâğıt kesim katların açılması, altın bulutların süzülmesi |
| 35 | highland-tartan-thistle | Highland Tartan & Thistle | Ekoseli yün zarf, deri kayış + pirinç toka; toka açılır, kayış kayar, kapak açılır, funda dalı ve kart çıkar; tepelerden sis çekilir | Antika pirinç madalyon (locket) çerçeveler; kapakları açılır | Ekose, devedikeni, funda, deri, pirinç, dağ sisi | yağlı boya manzara + fotogerçekçi doku | Cinzel? yerine IM Fell English + Pinyon Script | heather-moss-tartan | Toka/kayış mekaniği, sis katmanlarının kayması, madalyon kapaklarının açılması |
| 36 | victorian-glasshouse | Victorian Glasshouse | Kraft tohum paketi zarfı, bakır bitki etiketi ve sicim; sicim çözülür, kapak açılır, kart çıkar; serada camdaki buğu silinerek eğrelti otları ve kart görünür | Herbaryum etiketli cam altı numuneler (cam yansıması + etiket) | Dökme demir kemerler, eğrelti otu, orkide, bakır etiketler, cam buğusu | botanik gravür + fotogerçekçi cam | Cormorant SC? yerine Bodoni Moda + Monsieur La Doulaise | fern-copper-glass | Buğunun silinmesi (maske), demir kemerlerin paralaksı, etiketlerin sallanması |
| 37 | art-nouveau-lily | Art Nouveau Lily | Krem zarf, kapağı altın kıvrımlı (whiplash) art nouveau çerçeve ve vitray zambak; vitraydan ışık süpürür, kapak çiçek açar gibi açılır | Vitray pencere kemerleri; ışık geçtikçe renkler canlanır | Zambak, tavus tüyü değil (24'ten ayrı), kıvrımlı altın çizgiler, vitray, mozaik altın | Mucha tarzı poster + vitray | oturum seçer: Art Nouveau başlık yazısı + zarif el yazısı (06 Art Deco'nun Poiret/Cinzel'inden ayrı) | sage-gold-cream-lilac | Işığın vitraydan süpürmesi, çizgilerin akarak çizilmesi, çiçek açılır gibi kapak |
| 38 | papel-picado-fiesta | Papel Picado Fiesta | Kraft zarf, renkli kâğıt kesim (papel picado) kemer bant; bant çözülür ve bayraklar gökyüzüne dizilir, kapak açılır, kart yükselir, ampul dizisi yanar | Renkli kâğıt kesim çerçeveler; rüzgârda hafifçe sallanır (30'un çinisinden ve 13'ün polaroidinden ayrı) | Papel picado bayrakları, bugenvil, terrakota, ampul dizileri, işlemeli kumaş | canlı kâğıt kesim + fotogerçekçi | oturum seçer: el boyaması tabela başlık + sıcak serif gövde | fiesta-multicolor-terracotta | Bayrakların rüzgârda dalgalanması (CSS dalga), ampullerin sırayla yanması, kemer bandın çözülmesi |

Kültürel temalar (33, 34, 38): semboller yaygın ve saygılı kullanılır; dini simge yok; metin İngilizce. 34'te 囍 (çifte
mutluluk) GPT görselinde altın varak olarak yer alır; yazı katmanı değildir.
Görevler: G182–G187 (oturum başına bir tasarım; dal `claude/g18N-<id>`).
