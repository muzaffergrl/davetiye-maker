# 22–32 yeniden tasarım — 11 tasarımı 39–48 kalitesine çıkarmak (2026-10-22)

Kullanıcı (2026-10-22, katalog ekran görüntüleriyle): 22–32 "çok amatör"; animasyonlar ve gerekirse görseller **komple**
elden geçsin, bambaşka bir görünüm, kalite en az diğerlerinin (01–21, 39–48) seviyesi.

Kapsam: 22 Nocturne Lake Estate · 23 Velvet Jewel Box · 24 Grand Theatre Premiere · 25 Orient Express Voyage ·
26 Kintsugi & Washi · 27 Riad Lantern Nights · 28 Maison Pâtisserie · 29 Celestial Observatory · 30 Azulejo Mosaic ·
31 Sky Lantern Festival · 32 Music Box Ballerina. Hepsi `coming`; satıştaki 01–21 ve 33–48'e dokunulmaz.

## 1. Teşhis (yerel sunucu, 390×844, kapalı → açılış kareleri → home; 2026-10-22)

Karşılaştırma: 39 Silver Photo Booth, 40 Swan Chantilly Lace, 01 Olive & Ivory, 03 Blush Garden Rose.

| Sorun | 22–32 (Codex `envelope-v3` kalıbı, 18–20 Ekim) | 39–48 / 01–21 |
|---|---|---|
| Açılış | Nesne yüzleri dönerken **boş krem şekillere** dönüşüyor (Velvet, Grand Theatre, Music Box, Nocturne: 1–3 s boyunca sahnede yalnız soluk lekeler); kart "hiçlikten" çıkıyor; Kintsugi'de siyah kenarlı tuhaf paneller | Her katman ayrı GPT parçası (arka astar, ön cep, kapak dış/iç yüz, kapanış, kart); kart cebin arkasından yükselir |
| Kapak düzeni | Tam ekran yoğun çiçek zemin; isimler ve "SKIP" çiçeklerin **altında kalıyor** ("Isabelle", "Eleanor" kesik); "Click to open" çiçeğe biniyor; tarih/yer yok | Sakin malzeme zemin (saten, keten, pamuk), "Together with their families", büyük el yazısı isimler, ortada büyük zarf, altta tarih · şehir + "Tap to open", Skip hapı |
| Nesne | Küçük, düz, tek parça imagegen nesnesi; 11'i de aynı yerleşim ("YOU ARE INVITED" + nesne + italik "Click to open") → hepsi aynı şablon gibi | Zarf ekranın ana öğesi; her tasarımın kapanışı (şerit, dantel+mühür, fiyonk, kordon…) kendine özgü |
| Açılış sırasında | Ortada "Close envelope" hapı belirip sahneyi bölüyor; isimler soluyor | Sahne temiz; isimler yerinde |
| İç sayfalar | Kapakla kopuk düz koyu zemin (Nocturne/Grand Theatre/Riad teal-siyah blok), tek bir çerçeve; malzeme ve dekor dili yok | Kapakla aynı malzeme dili, kart + çerçeveler + köşe çiçeği + ayırıcı + süzülen nesneler |

Kök neden: bu 11 tasarım hiçbir zaman katmanlı GPT parçası almadı (PAKET 5 klasörleri boş; 20 Ekim'de eski parçalar
GEÇERSİZ sayıldı). Codex tek bir kapalı nesne görseli üretip onu kod içinde dilimledi; dönen arka yüzler ve astarlar
düz kâğıt rengiyle dolduruldu. Yama ile kurtarılmaz: **39–48 hattıyla baştan kurulur.**

## 2. Karar

1. Her tasarım **yeni katmanlı GPT parçalarıyla** (PAKET 5, 39–48 biçimi: aynı tuvalde hizalı zarf katmanları, kapanış
   parçaları, kapağın iç yüzü, kart, foto çerçeveleri, zemin, köşe süsü, ayırıcı, süzülen nesneler, hero) yeniden çizilir.
   Kaynak: her koleksiyonun `assets/gpt/GPT_PROMPTS.md` dosyası (bu belgeyle yeniden yazıldı). Eski PAKET 5/6 bölümleri
   kaldırıldı (git geçmişinde); PAKET 2 örnek fotoğrafları **var, yeniden üretilmez**; PAKET 6 baskı zemini yeni görünüme
   göre **yeni dosya adlarıyla** (`invitation_front_r_5x7.png`, `invitation_back_r_5x7.png`) yeniden istenir; PAKET 3 ilan
   sahneleri tema kurulduktan sonra yeniden yazılır (GEÇERSİZ işaretli).
2. Temalar **39 pilotunun yapısıyla** yeniden kurulur (`docs/34_TEMA_HATTI_40_48.md`: `site.css` + `site.js` `MOTION`,
   `build_images.py` alfa kutusu hizası, `keyed_window`, manifest ↔ CSS eşitliği, tema testi). Codex'in `envelope-v3*`,
   `opening*`, `interior*` dosyaları kaldırılır. Demo içerik, slug, fiyat/durum, ses, harita, baskı düzeni ve platform
   sözleşmesi korunur.
3. K21 aynen: bütün görseller GPT'den; Claude şekil/dekor çizmez. K23 sıkı: ilk sayfa kapalı **zarf** (nesnenin kimliği
   zarfın malzemesi ve kapanışında yaşar: yüzük, perde, bilet, astrolab, çini, fener, müzik kutusu anahtarı…).

## 3. Ortak kalite standardı (her 11 tasarım; 39–48'den çıkarıldı)

**Kapak (index):** sakin, gerçek malzeme zemin (yoğun çiçek tam ekran **yok**; en fazla bir köşe süsü ve asla metnin
altında değil) · üstte "Together with their families" + büyük isimler (HTML) · ortada zarf ekranın ana öğesi (genişlik
~%72–80, kapağın açık boyu kadar üst pay) · altta tarih · şehir ve "Tap to open" · köşede Skip hapı ve ses düğmesi.
Açık/koyu zemin karışık: 22, 29, 31 koyu; diğerleri açık (katalog sırasında ritim).

**Açılış:** ≥ 4 ayrı hareket eden nesne · önce **kapanış** kendi fiziğiyle çözülür (döner, kayar, düşer, kalkar) ·
kapak üst kenarında **3B** açılır ve arka yüzü **gerçek GPT iç yüzüdür** (`flap_in`, asla düz renk) · kart **ön cebin
arkasından** yükselir, cep dudağını geçince öne gelir · 2–3 tür süzülen küçük nesne kendi fazında · toplam ≤ 5,5 s ·
açılış sırasında ekranda düğme/hap yok (Esc ve Skip yeter) · `prefers-reduced-motion` ve tekrar oynatma.

**İç sayfalar:** kapakla aynı malzeme dili; home kartı (portre çerçevesi + isimler + tarih + mekân) → davet bandı →
hikâye tanıtımı → gün özeti → imza; story'de tasarıma özgü foto sunumu ve açılış hareketi; details'te geniş mekân
çerçevesi; RSVP form kartı + gönderim anı. Her parça GPT; foto pencereleri `#00FF00`.

## 4. Yeni konseptler

Paletler ve fontlar mevcut brief'lerdeki gibi kalır (her koleksiyonun `DESIGN_BRIEF.md`, 2026-10-22 sürümü). Zarf
türleri 01–48'in hiçbirine birebir benzemez (01–21 V kapak + mum mühür; 04 airmail; 39 U kapak + foto şeridi; 40 kare yay kapak +
dantel; 41 boyalı deckle; 42 V + dantel bant; 43 dalgalı yatay; 44 ogee + kamea; 45 saçaklı + kordon/konço; 46 fiyonk
delikleri; 47 tuck + negatif halkası; 48 cüzdan + kartuş; 33 kılıf; 34 ip-düğme; 35 kayış + toka; 36 sicimli tohum paketi;
37 vitray kapak; 38 papel picado bant).

| # | Zemin (kapak) | Zarf (oran · malzeme · kapak) | Kapanış | Açılış koreografisi | Foto sunumu |
|---|---|---|---|---|---|
| 22 Nocturne Lake Estate | Gece kömürü laid kâğıt, seyrek altın pul (koyu) | Dikey ≈0,72 · kömür-siyah laid kâğıt · derin **elmas (sivri baklava) kapak**, kenarı şampanya altın deckle folyo; astar: yağlı boya Como gölü gecesi (villa ışıkları, ay yolu) | Yatay **aydınger (vellum) bel bandı**, gümüşle kazınmış göl-dağ panoraması + bandın ortasında iğneli **dövme altın hilal broş** | Hilal parlar, kalkıp yukarı süzülür ve "ay" olarak üstte kalır → vellum bant aşağı kayıp söner → elmas kapak 3B açılır, iç yüz göl gecesi → fildişi kart yükselir → astardaki suda ışık kıpırtısı, altın pul + mum ışığı kıvılcımı + beyaz gül yaprağı süzülür | Varaklı ferforje **villa penceresi** (kemerli) çerçeveler; mekân: geniş korkuluklu teras çerçevesi |
| 23 Velvet Jewel Box | Açık şampanya ipek hare (moiré) | Kare 1:1 · patlıcan moru ipek kadife · **üç yumuşak loblu (yonca) kapak**; astar: şampanya saten, inci dikişli kenar | Zarfı dikey saran şampanya saten kurdele, kapağın ucunda kurdeleden geçirilmiş **rose gold tek taş yüzük** | Taşta ışıltı → yüzük kurdeleden yukarı kayıp süzülür → kurdele iki yana kayıp düşer → loblu kapak 3B açılır (saten iç yüz) → inci kenarlı kart yükselir → inciler, şampanya yaprakları, elmas pırıltısı | Rose gold + inci **oval kamea** çerçeve (home); story: kadife yüzük tepsisinde oval çerçeveler, döner vitrin; mekân: inci kenarlı geniş çerçeve |
| 24 Grand Theatre Premiere | Fildişi program (playbill) kâğıdı, ince altın çerçeve dokusu | Yatay ≈1,45 · tavus mavisi keten · **çift yan kapak = bordo kadife perde** (dış kenarlarından menteşeli, ortada buluşur, altlarında altın saçak) + sabit üst **saçaklı perde başlığı** | Perdeleri ortada bağlayan **altın püsküllü kordon** + kordonun altına sıkıştırılmış boş **bilet koçanı** (fildişi, delikli yırtma çizgisi, altın kenar) | Bilet kayıp çıkar ve yırtma çizgisinden ikiye ayrılır → kordon çözülüp düşer → perdeler dış menteşelerinde 3B açılır (iç yüz: altın astarlı kadife) → spot ışığı sahneyi tarar → astar: ayak lambalı sahne; kart "sahneden" yükselir → altın konfeti pulu + gül yaprağı | Varaklı **proscenium kemeri** çerçeve; story: program sayfası kartları; mekân: geniş proscenium |
| 25 Orient Express Voyage | Sıcak fildişi eski harita kâğıdı (çok soluk rota çizgileri, yazısız) | Yatay ≈2:1 **bilet kılıfı** · şişe yeşili kabartmalı deri-kâğıt, pirinç köşelikler · **sağ uçta dikey dil kapak** | Dilde pirinç **çevirmeli kilit** (sabit plaka + dönen anahtar parçası) + pirinç kuşgözünden kırmızı iple sarkan boş **bagaj etiketi** | Etiket sarkaç gibi sallanır → kilit 90° döner → dil kapak sağ menteşesinde 3B açılır (iç yüz: bordo astar) → birinci sınıf bilet biçimli kart kılıftan **sağa kayarak** çıkar, dikleşir ve büyür → buhar bulutu + bilet zımbası pulları + kurutulmuş çiçek | Pirinç çerçeveli **vagon penceresi** (yuvarlak köşe); story: kaydırınca manzara gibi geçen pencereler; mekân: geniş panorama penceresi |
| 26 Kintsugi & Washi | Pirinç kâğıdı (washi), seyrek altın lif (açık) | Kare 1:1 · çivit boyalı washi, altın kintsugi damarları · **tatō (fırıldak) katlama: dört üçgen kanat** sırayla üst üste | Ortada **kintsugi onarımlı porselen düğme** + etrafına sekiz şeklinde sarılı **altın-fildişi bükme kordon** | Kordon düğmeden çözülerek döner ve söner → düğme kalkar → dört kanat fırıldak sırasıyla tek tek açılır (her biri kendi taban kenarında 3B) → altın pullu iç → kart ortadan izleyiciye doğru yükselir → altın varak pulları, çivit mürekkep damlası, erik çiçeği yaprağı | Yırtık kenarlı **washi paspartu** + altın kintsugi dikişi, foto mürekkep yayılımıyla belirir; mekân: geniş el yırtığı washi |
| 27 Riad Lantern Nights | Sıcak fildişi tadelakt sıva (açık) | Dikey ≈0,75 · koyu teal pamuk kâğıt · **at nalı (Mağrip) kemer kapak**, altın zellige folyo bordür; astar: safran-teal zellige | Kapaktaki pirinç kubbe çiviye dolanmış **safran ipek püsküllü kordon** + kordonda sarkan küçük **delikli pirinç fener** tılsımı | Fener yanar (sönük → yanık GPT çifti) ve ışık noktaları duvara düşer → kordon çividen kalkar, püskül sallanarak düşer → kemer kapak 3B açılır (zellige iç yüz) → kemer tepeli kart yükselir → gül yaprakları + ışık zerreleri | Oyma sedir/alçı **at nalı kemer** çerçeveler, ışıkla beliren foto; mekân: geniş avlu revak çerçevesi |
| 28 Maison Pâtisserie | Krem, çok ince fıstık çizgili pastane kâğıdı | Yatay ≈1,3 · krem pamuk kâğıt · **sığ dantel (doily) tarak kenarlı fıstık yeşili kapak**; astar: dantel kâğıt (doily) baskı | Zarfı yatay saran **gül pembesi kılıf bant** (altın tarak kenarlı) + bandın üstünde **gül saten fiyonk** ve şekerlenmiş gül goncası | Fiyonk çözülür (bağlı → çözülmüş kuyruklar) → kılıf bant sağa kayıp çıkar → tarak kapak 3B açılır → kart yükselir → makaronlar ve şeker inciler hafif zıplayarak düşer | Altın kenarlı **porselen pasta tabağı** yuvarlak çerçeveler, vitrin raflarında; mekân: geniş kemerli pastane vitrini |
| 29 Celestial Observatory | Gece mavisi kâğıt, çok soluk gravür yıldız haritası (koyu) | Dikey ≈0,78 · gece mavisi kâğıt · **yarım daire kubbe kapak**, altın folyo takımyıldız gravürü; astar: antika yıldız atlası | Kapağın ucuna takılı pirinç **usturlap**: sabit ana disk + üstünde dönen dantel gibi **rete** (iki ayrı parça) | Rete 120° döner, yıldız uçları parlar → usturlap kalkıp yukarı süzülür (home süsü olur) → kubbe kapak 3B açılır → kart yükselir → yıldızlar tek tek yanar, hilal ay süzülür | Yuvarlak **planisfer pirinç halkası** çerçeveler (kadran süpürmesi); mekân: geniş pirinç çerçeveli gök haritası paneli |
| 30 Azulejo Mosaic | Kireç badanalı sıva, çok soluk kobalt lekeler (açık) | Dikey ≈0,8 · beyaz sırlı görünümlü kâğıt, kobalt azulejo baskı · **basamaklı (çini ızgarası) kapak**, kenarı merdiven gibi ortada sivrilir; astar: terrakota + kobalt | Kapağın ucunda tek **gevşek seramik azulejo karosu** + çapraz bağlanmış doğal **jüt sicim** | Sicim çözülüp kayar → karo 3B döner (arka: terrakota bisküvi) ve düşer → basamaklı kapak 3B açılır → kart yükselir → arka planda küçük karolar dalga hâlinde döner, zeytin yaprağı | Azulejo **bordürlü** çerçeveler, foto karo karo dönerek belirir; mekân: geniş çini panosu çerçeve |
| 31 Sky Lantern Festival | Alacakaranlık gradyanlı washi (mor → kehribar, orta-koyu) | Dikey ≈0,72 · mor-kehribar washi · **yumuşak kubbe (fener tepesi) kapak**; astar: yıldızlı alacakaranlık gök | Altın çiviye kehribar ipek iple bağlı küçük **kâğıt gökyüzü feneri** (sönük → yanık GPT çifti) | Fener yanar ve parlar → ip çözülür, fener salınarak yukarı yükselip çerçeveden çıkar (uzakta başka fenerler yükselir) → kubbe kapak 3B açılır → kart yükselir → yıldız tozu, uzak fenerler | Pirinç kâğıdı **fener paneli** çerçeveler, foto sıcak ışıkla belirir; mekân: geniş alacakaranlık panorama |
| 32 Music Box Ballerina | Allık pembesi saten (açık) | Yatay ≈1,25 · allık saten kaplı · **bombeli müzik kutusu kapağı** kapak, altın telkâri kenar; astar: ayna gibi rose gold saten + oval ayna | Kapağın ucunda altın telkâri **anahtar deliği plakası** + takılı pirinç **kurma anahtarı** | Anahtar iki tur döner (melodi kancası) → kapak 3B açılır (ayna iç yüz) → küçük **balerin figürü** cepten yükselir ve döner (ön/arka GPT görünüm, scaleX) → kart yükselir → tül yaprakları, altın pırıltı | Varaklı **oval ayna** çerçeveler ("kapağın aynasında yansıyan"); mekân: geniş varaklı ayna |

## 5. GPT'ye (Codex, repo erişimli) yapıştırılacak talimat

```
Task: BKE Studio — REDESIGN of 11 wedding-website designs 22–32: generate every image in their GPT_PROMPTS.md files
(repo muzaffergrl/davetiye-maker, branch claude/modest-brown-pwe1sm — the new prompt files are ONLY on this branch,
not on main). First run: git fetch origin claude/modest-brown-pwe1sm && git checkout claude/modest-brown-pwe1sm
&& git pull --rebase origin claude/modest-brown-pwe1sm.

Work in parallel: one sub-agent per design (22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32). Each sub-agent works ONLY inside
its own folder collections/<NN>_*/assets/gpt/ (parts/ and print/) and does this:

1. Open collections/<NN>_*/assets/gpt/GPT_PROMPTS.md. Read it top to bottom once (the Turkish notes explain how each part
   is used on the website; the English blocks are the prompts). PAKET 2 photos already exist: do not regenerate them.
   Sections marked GEÇERSİZ are not wanted.
2. Use ONE separate image chat for this design (never mix two designs in one chat). Send the "Instructions for GPT"
   quote first. Then generate PAKET 5 (W1, W2, W3 … in order), then PAKET 6 (P1, P2). Use each English prompt exactly as
   written. From the third image on, attach the style-reference parts named in "Instructions for GPT"; for a part that
   sits on the same canvas as an earlier part (env_back / env_front / flap / closure layers) attach that earlier part and
   ask for the same canvas, the same envelope position and size. Any aspect ratio close to the Kaydet size is fine.
3. Check each image BY EYE: the right single object, nothing cut by the image border, empty margin around it;
   "Şeffaf zemin" = a real transparent background (not white, not a checkerboard), no shadow or glow around the object;
   no text, letters, numbers, monograms, initials, logos, watermarks, QR codes (also not on tickets, tags, seals, tiles);
   parts with a photo window: ONE flat bright even green window of the asked shape, nothing covering it; parts WITHOUT a
   window contain no green; same material, colours and light as the style-reference parts; "dikişsiz" grounds tile 2×2
   without a seam. If an image fails, regenerate at most 2 times, then save the best attempt and note the problem.
   Never stop early.
4. Save each image with the exact path and file name on its "Kaydet" line (PNG). Never overwrite a different existing
   file; a retry you want to keep separately is saved as name_v2.png.
5. Commit and push often to claude/modest-brown-pwe1sm (git pull --rebase origin claude/modest-brown-pwe1sm before every
   push; never push to main), only that design's new image files:
     "PAKET 5R <NN>: website katmanları (W1–W6)" … "PAKET 6R <NN>: basılı davetiye"
6. At the end report per design: files saved, files that failed the checklist and why.
```

## 6. Sonra (Claude) — yeniden kurulum

Görevler: **G222–G232** (gpt-gorsel, PAKET 5R + 6R) → **G422–G432** (claude-kod, tema yeniden kurulumu). Sıra: önce bir
pilot (öneri **23 Velvet Jewel Box**: kapanış + loblu kapak + kare zarf, 40'a en yakın yapı), sonra kalan 10 paralel
oturumda `docs/34` düzeniyle (`claude/g4NN-<slug>` dalları, entegratör birleştirir).

Her tema için:
1. `python3 tools/kit_check.py collections/<NN>_* --paket 5` + göz kontrolü (kusurlar `docs/34` §4 yöntemleriyle).
2. `platform/themes/<slug>/` 39 pilotunun yapısına geçer: `index/home/story/details/rsvp.html`, `site.css`, `site.js`
   (`MOTION`), `thank-you.css`, `build_images.py` (alfa kutusu + arka katman kutusuna yerleştirme, `keyed_window`,
   manifest.stage ↔ site.css), `img/` ≤ 3 MB. Kaldırılır: `envelope-v3.*`, `opening*.{js,css,json}`, `interior*`,
   `parts.css`, eski `v3-*/v4-*` görseller. Korunur: `theme.json` id/foto anahtarları, `content.demo.json`, `variants.css`
   (paletler yeni sanattan yeniden üretilir), marketing/audio/claim/print kayıtları (baskı düzeni PAKET 6R ile güncellenir).
3. Testler: `tests/theme-<slug>.test.ts` yeni yapıya göre yeniden yazılır (Codex'in "protected interior hashes" ve
   envelope-v3 kontrolleri kaldırılır); sayım testleri değişmez (tema sayısı aynı). Katalog kapak/klibi yeni açılıştan
   yeniden çekilir (`components/marketing` medya manifesti).
4. Göz kontrolü: kapalı → açılış (her 300 ms) → home → story → details → rsvp, 360/390/430 + masaüstü; `docs/34` §5.
5. Bitince: tema `coming` kalır; `live` kararı kullanıcının.

### 6a. Pilot G423 (23 Velvet Jewel Box, 2026-10-22) — kalan 10 tema için

Kurulan: `platform/themes/velvet-jewel-box/` 40 Swan'ın dosya yapısıyla (5 sayfa + `site.css`/`site.js`/`thank-you.css`/
`build_images.py`); test `tests/theme-velvet-jewel-box.test.ts` (40'ın testinden uyarlandı, 11 test). Kare kareler
390/360/1280 px'te kontrol edildi.

Tuzaklar ve çözümleri:
- **Foto penceresi:** GPT pencereleri "yeşil halka + ortası zaten şeffaf" verdi; oval çerçevede 39'un dikdörtgen
  `keyed_window`'u köşelerdeki çerçeveyi silerdi. Çözüm (velvet `build_images.py`): pencere = yeşil halka + çevrelediği her
  şey (PIL flood fill; **scipy yok**, kullanıcı makinesinde kurulu değil). `Image.fromarray(...)` salt okunur: flood fill
  öncesi `.copy()` şart. Oval pencerede CSS'te `.photo-slot{border-radius:50%}` (kırpma, çizim değil).
- **Dar parçalar:** `tb.webp` kaynaktan büyütmez; 144 px'lik bant `ribbon-640` değil `ribbon-144.webp` adıyla çıkar →
  CSS'teki adı build çıktısıyla aynı tut (test her `img/…` adının var olduğunu denetler).
- **Kapanışın bölünmesi:** bant tek GPT görseli; build düğümü ölçer (orta üçte birin en geniş satırları), CSS iki `span`'e
  `background-size: 100%/k` ile böler; yarılar `transform-origin` üst/alt + `scaleY` ile zarfın kenarına geri sarılır
  (havada süzülen bant tuhaf durdu).
- **Varak parıltısı (`.foil`):** `background-clip:text` gradyanı `no-repeat` + pozisyon dışına kayınca ilk harfler
  kayboldu; 300 % genişlik ve 100 % → 0 % pozisyon her an metni örter.
- **Kadife bant içindeki açık kart:** `.velvet-band h2` kuralı karttaki başlığı da açık renk yaptı → `.velvet-band .paper h2`
  ile geri al.
- **Platform kayıtları:** `lib/marketing/designs.ts` üç katmanlı (DESIGN_COPY → PREVIEW_DESIGN_COPY döngüsü → UNIQUE_INTERIORS
  döngüsü); yeniden kurulan tema için PREVIEW girdisi güncellenir, UNIQUE_INTERIORS girdisi silinir, `REBUILT` tablosuna
  font/sayfa/palet eklenir; yeni İngilizce cümlelerin tr/de/es/fr çevirisi `dict/market/*` (i18n eksik sayısı artmamalı).
  `lib/audio/catalog.ts` açılış sesleri = MOTION zamanları; `lib/print/layouts.ts` PAKET 6R kaynakları + ölçülen kutular;
  `tools/katalog.py` EK_TEMALAR eksenleri. Codex testlerinden temayı çıkar: `tests/fixtures/unique-opening-protected.json`,
  `unique-interior-covers.json`, `tests/physical-lining.test.ts` id listesi, `tools/tests/test_recolor_parts.py` G177.
- **Paletler (`variants`)** eski sanatla birlikte kaldırıldı; yeni sanattan sonra yeniden üretilecek.
- **Katalog kartı:** `lib/marketing/assets.json` eski kapak/klibi gösterir; yeni yakalama (`tools/listing_templates/capture.ts`
  → `collections/<NN>/package/shots`) + `node scripts/marketing-assets.ts --designs <id>` gerekir (üretim build'i ister).

## 7. Bu turda yapılanlar (2026-10-22)

- Teşhis (yukarıda) — ekran kareleri yerel; `docs/qa/` altına konmadı.
- 11 koleksiyonun `DESIGN_BRIEF.md` (yeni sürüm), `assets/gpt/GPT_PROMPTS.md` (PAKET 5R + PAKET 6R; PAKET 2 korunur,
  PAKET 3 GEÇERSİZ) ve `assets/gpt/kuru_sekil.json` yeniden yazıldı.
- GPT bekleyen: 22–32 için **261 görsel** (PAKET 5R 239 parça + PAKET 6R 22 baskı zemini; tasarım başına 22–28).
- Görev dosyaları G222–G232, G422–G432; `docs/26` / `docs/27` `tools/gpt_bekleyen.py --yaz` ile yenilendi.
- Henüz yapılmayan: GPT görselleri (G222–G232), tema yeniden kurulumu (G422–G432). Mevcut canlı demo sayfaları bu süreçte
  değişmedi.
