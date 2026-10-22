# Tasarım 23 — Velvet Jewel Box · tasarım özeti (yeniden tasarım, 2026-10-22)

Kaynak: `docs/35_22_32_YENIDEN_TASARIM.md` (22–32 yeniden tasarım; §3 ortak kalite standardı, §4 satır 23). İlk sürüm:
`docs/24_YENI_TASARIMLAR.md` (dalga 23–28) + G161; 18–20 Ekim Codex `envelope-v3` kapağı (sekizgen kadife kitap) bu
sürümle **bırakıldı**. Tema id `velvet-jewel-box`. Çalışma adı marka değildir.

**Akım:** "old money" mücevher kutusu romantizmi — kadife, saten, inci, rose gold. **Alınan** yalnız akım: koyu mücevher
tonu + şampanya saten, yüzük kutusunu açma heyecanı, tıkla-aç zarf (pazarda giriş bileti). **Alınmayan:** hiçbir ilanın
düzeni, çizimi, fotoğrafı, font eşleşmesi; gerçek bir mücevher markasının kutusu, rengi ya da logosu.

**Ruh:** Manhattan'da kışın bir şehir evi; patlıcan moru ipek kadife, şampanya saten astar, tohum incileri ve tek taşlı
bir rose gold yüzük. Davet bir yüzük kutusu gibi açılır: önce yüzük, sonra kurdele, sonra kadife kapak. Klasik, romantik,
zengin ve geniş beğeni (AGENTS şart 5); ışıltı ölçülü, mücevher vitrini gösterişi yok.

**En yakın tasarımlardan farkı:**
- **40 Swan Chantilly Lace:** o da kare zarf, ama fildişi pamuk + yay kapak + dantel örtü + kuğu mührü; burada patlıcan
  kadife, **üç loblu (yonca) kapak**, mühür yok — kapanış kurdeleden geçirilmiş **yüzük**.
- **46 Bordeaux Silk Bow:** orada kurdele deliklerden geçen bir fiyonktur ve ilmek ilmek çözülür; burada tek düz saten
  bant zarfı dikey sarar, fiyonk yok, bandı tutan yüzüktür; bant ikiye ayrılıp üstten ve alttan çekilir.
- **14 Ivory Lace & Pearls:** inci orada dantelle fildişi zemindedir; burada inci kadife ve saten üzerinde, mücevher
  kutusu dilinde; gül dantel yok.
- **32 Music Box Ballerina:** o da açılan bir kutu kapağı fikri taşır, ama allık saten + telkâri + kurma anahtarı +
  balerin; burada koyu kadife + yüzük, müzik yok (ses kataloğundaki `music-box` müziği aynen kalır).

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | **Kare (1:1)** patlıcan moru ipek kadife zarf; kapak **üç yumuşak loblu (yonca)**, orta lob en derin; iç astar şampanya ipek saten, kenarında tohum incisi dikişi. Kapanış: zarfı dikey saran **şampanya saten bant** ve kapağın orta lobunun ucunda banttan geçirilmiş **rose gold tek taş yüzük** (bant yüzüğün altında küçük yassı bir düğüm atar). Dokununca taşta ışıltı (CSS parıltısı GPT taşın üstünde) → yüzük bant boyunca yukarı kayıp zarftan ayrılır ve isimlerin üstüne süzülür → bant düğümden ikiye ayrılır: üst yarısı kapağın üstünden geri, alt yarısı aşağı çekilip söner → loblu kapak üst katlama çizgisinde **3B** açılır (iç yüz: şampanya saten + inci kenar) → inci kenarlı fildişi kart ön cebin arkasından yükselir, cep dudağını geçince öne gelir → inciler, şampanya gül yaprakları ve elmas pırıltıları süzülür → home |
| Fotoğraf sunumu | Home: rose gold + tohum incili **oval kamea** çerçeve, foto saten ışık süpürmesiyle belirir. Story: kadife **yüzük tepsisi** üstünde oval rose gold yuvalar; 3 an **döner vitrin** (3B silindir karusel, sürükle/kaydır, en yakına oturur; azaltılmış harekette düz kaydırıcı). Details: inci kenarlı geniş rose gold çerçevede mekân |
| Dekor ailesi | İpek kadife, şampanya saten (hare zemin ve astar), tohum incisi dizileri, rose gold, tek taş yüzük, açık kadife yüzük kutusu (imza), şampanya gül goncası ve yaprakları (yalnız köşe süsünde, ölçülü) |
| Teknik | Fotogerçekçi lüks ürün çekimi (gerçek kadife havı, saten parlaklığı, inci yansıması, cilalı rose gold) |
| Font | **Pinyon Script** (isimler, başlıklar) + **Bodoni Moda** (gövde, büyük harf satırlar) — Google Fonts; font dosyası pakete girmez |
| Ana palet (`aubergine-champagne`) | night `#1C0B1A` · aubergine `#2A1328` · plum `#4A2142` · champagne `#E8D3B0` · rose gold `#C99A86` · ivory `#F8EDE0` |
| Hareket imzası | Yüzüğün banttan kayıp süzülmesi, bandın düğümden ikiye ayrılıp çekilmesi, loblu kadife kapağın 3B açılışı, saten üstünde ışık süpürmesi, varak parıltılı başlık (bir kez), döner vitrin karuseli, imzada yüzüğün kutuya geri oturması |

## Palet `aubergine-champagne`
- night `#1C0B1A` — koyu bantlar, metin vurgu, kadife gölgesi
- aubergine `#2A1328` — zarf kadifesi, home davet bandı (kadife doku)
- plum `#4A2142` — kadife ışığı, ikincil metin
- champagne `#E8D3B0` — sayfa zemini (ipek hare), saten astar, kurdele
- rose gold `#C99A86` — yüzük, çerçeveler, folyo çizgiler
- ivory `#F8EDE0` — kart kâğıdı, inciler, metin zemini
- Işık: yumuşak stüdyo ışığı **sol üstten**, kadifede derin hav gölgesi, satende ve rose goldda temiz parlak vurgu
  (bütün parçalarda aynı).

## Fontlar
- **Pinyon Script** — isimler, başlıklar.
- **Bodoni Moda** — gövde, büyük harf satırlar, tarih, program.
- Google Fonts; font dosyası hiçbir pakete girmez (AGENTS şart 9).

## Motifler
Patlıcan ipek kadife (zarf, bantlar) · şampanya ipek hare (sayfa zemini) · şampanya saten astar ve bant · tohum incisi
dikişi ve dizileri · rose gold tek taş yüzük (kapanış; harf/kazıma yok) · rose gold + inci oval kamea çerçeve · kadife
yüzük tepsisi · açık kadife yüzük kutusu (imza) · şampanya-allık gül goncası (yalnız köşe süsü) · elmas pırıltısı. Yazı,
rakam, monogram, logo, QR hiçbir görselde yok; isimler, tarih ve baş harfler HTML.

## Neden satar (gözleme dayalı gerekçe; satış iddiası değil)
- Koyu mücevher tonu + şampanya, pazarın baskın fildişi/krem ailesinden ayrışır ama klasik kalır (`docs/13` §2); kış ve
  akşam düğünleri, black tie optional demo kaydıyla örtüşür.
- Kapanış bir **yüzük**: evlilik teklifinin sembolü, ilk saniyede anlaşılır; kapak açılmadan duygu kurar.
- Pazarın standart tıkla-aç zarfı korunur, üstüne akılda kalan tek an eklenir: yüzüğün banttan kayıp süzülmesi.

## Sayfalar
- **index:** şampanya ipek hare zemin, "Together with their families", Pinyon Script isimler (HTML), ortada kurdeleli ve
  yüzüklü kare kadife zarf (ekranın ana öğesi; açık kapak boyu kadar üst pay), altta "November 13, 2027 · New York" ve
  "Tap to open", köşede Skip ve ses. Yoğun çiçek zemin yok.
- **home:** açılışta süzülen yüzük üstte küçük → fildişi kart (oval kamea portre, isimler, tarih, mekân; iki üst köşede
  inci-kurdele köşe süsü) → kadife davet bandı (tam adlar, tarih, RSVP, geri sayım, takvim; inci ayırıcı) → hikâye
  tanıtımı (tepsi çerçevesi) → günün ilk anları (saten kart) → imza (açık yüzük kutusu; yüzük kutuya oturur, "Open it
  again").
- **story:** kadife yüzük tepsisi üstünde döner vitrin, üç an (4:5 oval yuva) + başlıklar ("Our first dinner",
  "A little velvet box", "Yours, forever").
- **details:** saten kartta program (inci ayırıcı), geniş inci kenarlı çerçevede mekân, harita, G138 blokları (travel &
  stay, menu, dress code, registry, SSS).
- **rsvp:** fildişi form kartı kadife bant üstünde; gönderince inciler ve pırıltılar süzülür; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Isabelle & Julian, Halvern House, New York, New York; November 13, 2027,
  5:00 PM, America/New_York; black tie optional; URL ve medya null) — değişmedi.
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5R website katmanları W1–W18 = 20 dosya, PAKET 2 örnek fotoğraflar
  **var**, PAKET 6R basılı davetiye ön/arka; PAKET 3 GEÇERSİZ); prova şekli `assets/gpt/kuru_sekil.json`.
- Tema: `platform/themes/velvet-jewel-box/` **yeniden kuruldu** (G423 pilotu, 2026-10-22; 39 pilot yapısı, `docs/34`,
  dersler `docs/35` §6a) — GPT parçaları G223 (PAKET 5R 20 dosya, PAKET 6R 2 dosya). Durum: **editable_draft**, katalogda
  `preview` ("Coming soon"); satış yok. Katalog kapak görüntüsü/klibi henüz eski (yeniden yakalama bekliyor).
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41; tema kurulunca yeni görünüme göre güncellenir).
