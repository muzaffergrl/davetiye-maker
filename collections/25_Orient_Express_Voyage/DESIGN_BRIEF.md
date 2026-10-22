# Tasarım 25 — Orient Express Voyage · tasarım özeti (2026-10-22 yeniden tasarım)

Kaynak: `docs/35_22_32_YENIDEN_TASARIM.md` (§3 ortak kalite standardı, §4 satır 25). İlk sürüm `docs/24_YENI_TASARIMLAR.md`
+ G163; 18–20 Ekim Codex `envelope-v3` kurulumu (tek parça "uzun bilet kılıfı" imagegen görseli, dilimlenmiş) amatör
bulundu ve **baştan** kuruluyor. Tema id `orient-express-voyage`. Çalışma adı marka değildir: gerçek bir demiryolu
şirketinin, trenin ya da hattın adı, logosu, arması, rengi veya vagon tasarımı kullanılmaz; "Orient Express" yalnız
akım/dönem çağrışımıdır, hiçbir görselde yazı ya da amblem olarak yer almaz.

**Akım:** 1930'ların lüks yataklı tren yolculuğu — birinci sınıf bilet, şişe yeşili deri, cilalı pirinç, maun vagon,
bordo ipek astar, eski harita. **Alınan:** dönem ve malzeme dili (deri bilet kılıfı, pirinç bagaj kilidi, bagaj etiketi,
vagon penceresi). **Alınmayan:** hiçbir şirketin markası, afişi, tipografisi, bilet düzeni; hiçbir ilanın düzeni/çizimi.

**Ruh:** gece trenine binmeden önce kondüktörün eline verdiği deri bilet kılıfı: ağır, el işçiliği, sıcak lamba ışığında
pirinç parıltısı. Düğün bir yolculuğun ilk istasyonu gibi. Klasik, romantik, zengin, geniş beğeni (AGENTS şart 5); kostüm
ya da tema parkı havası yok.

**En yakın tasarımlardan farkı:**
- **04 Vintage Airmail:** orada hava postası zarfı, pullar, posta damgası ve mektup; burada posta yok — **demiryolu**:
  deri bilet kılıfı, pirinç bagaj kilidi, bagaj etiketi, vagon penceresi. Kart mektup gibi çekilmez, bilet gibi **yana
  kayarak** kılıftan çıkar.
- **12 Tropical Destination:** beyaz seyahat cüzdanı ve palmiye yok; malzeme şişe yeşili deri + pirinç, ışık gece lambası.
- **35 Highland Tartan & Thistle:** orada dikey deri **kayış + toka**; burada kayış/toka yok — **çevirmeli bagaj kilidi**
  (dönen pirinç düğme) ve sağ uçta **dikey dil kapak**; zarf yün değil kabartmalı deri-kâğıt.
- **48 Navy Ivory Crest:** orada yatay keten **cüzdan** (düz üst kapak, kalkan mühür); burada çok daha uzun (≈2:1) bir
  **bilet kılıfı**, kapak üstte değil **sağ uçta**, dikey menteşede yana açılır; mühür yok.
- Eski 25 (Codex v3 ve G163): tokalı kayışlı cüzdan / tek parça kılıf görseli bırakıldı; bütün katmanlar ayrı GPT parçası.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Yatay **bilet kılıfı** (≈2:1), şişe yeşili kabartmalı (deri dokulu) kâğıt, altın yaldız çift çerçeve çizgisi, köşelerde pirinç köşelikler; ön yüzün sağ ucunda yarım ay parmak oyuğu (bordo ipek astar görünür). **Sağ uçta dikey dil kapak** (yuvarlak sivri ucu sola bakar), ucunda pirinç **çevirmeli kilit** plakası ve dönen kilit düğmesi; gövdedeki pirinç kuşgözünden kırmızı iple sarkan boş **bagaj etiketi**. Dokununca: etiket sarkaç gibi sallanır → kilit düğmesi 90° döner (yataydan dikeye) → dil kapak sağ menteşesinde **3B** yana açılır, iç yüzü bordo hareli ipek → kılıfın içinde yan yatan **birinci sınıf bilet** biçimli kart sağa kayarak çıkar, dikleşir, büyüyüp ortaya gelir → buhar bulutu, bilet zımbası pulları ve kurutulmuş çiçek süzülür → home |
| Fotoğraf sunumu | Pirinç çerçeveli, maun pervazlı **vagon penceresi** (yuvarlak köşe). Home portresi 4:5 pencere; story'de sürgülü vagon pencereleri (3:4): kaydırdıkça foto camın ardında manzara gibi yana akar (paralaks), pencere perdesi (CSS maske) yukarı çekilir; mekân: geniş **gözlem vagonu panorama penceresi** (3:2) |
| Dekor ailesi | Cilalı pirinç (köşelik, kilit, kuşgözü, bagaj rafı rayı), şişe yeşili deri, bordo ipek, maun, fildişi bilet kartonu, boş bagaj etiketi, kırmızı pamuk ip, yazısız eski harita, kadranı rakamsız pirinç cep saati, kurutulmuş fildişi gül + lavanta |
| Teknik | Fotogerçekçi ürün çekimi (deri-kâğıt, pirinç, ipek, karton) + yazısız soluk antika harita |
| Font | Limelight (başlık) + Cormorant Garamond (metin) — Google Fonts, pakete konmaz (değişmedi) |
| Ana palet | bottle green `#1E3A2C` · deep `#11241B` · brass `#B8914B` · light brass `#D8BD84` · ivory `#F3EBD9` · route red `#8C2F39` (değişmedi) |
| Hareket imzası | Bagaj etiketinin sarkacı, çevirmeli kilidin 90° dönüşü, dil kapağın dikey menteşede yana açılışı, biletin kılıftan yana kayıp dikleşmesi; içeride harita üstünde kaydırmayla çizilen rota (UI çizgisi, harita GPT), istasyonlar (program satırları) tek tek gelir; RSVP'de bilet zımbalanır (zımba pulu düşer) |

## Palet
- bottle green `#1E3A2C` — kılıf derisi, koyu bantlar
- deep `#11241B` — gölge, deri derinliği, home alt bandı
- brass `#B8914B` — pirinç parçalar, yaldız çizgiler
- light brass `#D8BD84` — pirinç parlaması, ince süs çizgileri
- ivory `#F3EBD9` — bilet kartonu, harita kâğıdı, form
- route red `#8C2F39` — ipek astar, etiket ipi, rota çizgisi, vurgu
- Işık: sıcak **lamba ışığı sol üstten**, pirinçte temiz parlak vurgular (bütün parçalarda aynı).

## Fontlar
- **Limelight** — başlıklar, isimler (1930'lar deco).
- **Cormorant Garamond** — gövde, tarih, program, büyük harf satırlar.
- Google Fonts; font dosyası hiçbir pakete girmez (AGENTS şart 9).

## Motifler
Kabartmalı şişe yeşili deri-kâğıt + altın yaldız çift çizgi · pirinç köşelikler · pirinç çevirmeli kilit (plaka + dönen
düğme) · pirinç kuşgözü + kırmızı ip + boş bagaj etiketi · bordo hareli ipek astar · fildişi birinci sınıf bilet kartonu
(zımba deliği, delikli koçan çizgisi, boş) · maun + pirinç vagon penceresi · pirinç bagaj rafı rayı (ayırıcı) · rakamsız
pirinç cep saati · yazısız antika harita · buhar, zımba pulu, kurutulmuş çiçek. Hiçbir görselde yazı, rakam, monogram,
amblem, logo, QR yok; isimler ve tarih HTML.

## Neden satar (gözleme dayalı gerekçe; satış iddiası değil)
- "Destination / travel" düğünleri ve tren/vintage seyahat estetiği geniş bir kitleye hitap ediyor; palet (yeşil + pirinç
  + fildişi) pazarın sıcak koyu ailesine uyar (`docs/13`).
- Açılış ilk saniyede anlaşılır ve akılda kalır: kilidi çevir, kapağı aç, bileti çek — fiziksel, oyuncak değil.
- Bagaj etiketi ve bilet, RSVP ve "son tarih" bilgisini doğal biçimde taşır.

## Sayfalar
- **index:** sıcak fildişi yazısız harita kâğıdı zemin (koyu değil), "Together with their families", Limelight isimler
  (HTML), ortada kilitli bilet kılıfı ve altında sarkan etiket, altta tarih · şehir ve "Tap to open", köşede Skip + ses.
- **home:** üstte açılışta çıkan bilet kartı (isimler, tarih, mekân; kartın üstünde vagon penceresinde portre) → davet
  bandı (tam adlar, tarih, RSVP, geri sayım — rakamsız cep saati süsüyle, takvim) → hikâye tanıtımı (vagon penceresi) →
  yolculuk (harita + çizilen rota + ilk 4 istasyon) → imza (bagaj etiketi, isimler, "Replay").
- **story:** üç vagon penceresi sol–sağ–sol; kaydırmayla foto camın ardında manzara gibi akar, perde kalkar.
- **details ("The itinerary"):** harita yapışkan, istasyonlar kaydıkça gelir, rota son istasyona (mekân) kadar çizilir;
  panorama penceresinde mekân, harita bloğu, kıyafet, G138 blokları, travel, menü, registry, SSS.
- **rsvp:** fildişi bilet kartonu form; gönderince bilet zımbalanır (pul düşer); teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Amelia & Rafael — Amelia Rose Whitfield & Rafael Antonio Moreau; Palazzo
  Ferrovia, Venice, Veneto, Italy; September 25, 2027, 4:00 PM, Europe/Rome; RSVP son tarih August 1, 2027; kıyafet
  "Black tie optional"; URL ve medya null). Değişmedi.
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5R website katmanları W1–W19 = 21 dosya, PAKET 2 örnek fotoğraflar
  **var**, PAKET 6R basılı davetiye ön/arka); prova şekli `assets/gpt/kuru_sekil.json`. GPT görevi **G225** (G222–G232).
- Tema: `platform/themes/orient-express-voyage/` **yeniden kurulacak** (G425; G422–G432, 39 pilot yapısı, `docs/34`).
  Codex `envelope-v3*`, `opening*`, `interior*` dosyaları kaldırılır. Durum: **coming** (yeniden tasarım, concept).
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41) — tema kurulunca yeni açılışa göre güncellenir.
