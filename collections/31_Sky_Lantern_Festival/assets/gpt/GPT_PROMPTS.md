# GPT görsel istekleri — Tasarım 31 · Sky Lantern Festival (yeniden tasarım, 2026-10-22)

> **Instructions for GPT:** This design was completely redesigned on 2026-10-22: generate PAKET 5R (website layers) first, in order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 (sample photos) ALREADY EXISTS — do not regenerate it. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, characters, symbols, names, dates, initials, monograms, logos, brand marks, QR codes or watermarks in any image** — also never on a lantern, the envelope, the card or the panels (the lanterns are plain, undecorated rice paper). **Culturally neutral:** no temple, pagoda, dragon, costume, crowd, script or symbol of any country, festival or religion. **No fire:** a lantern is lit only by a warm glow inside its own paper — no flame visible, no smoke, no sparks. Give W1 `dusk_ground.png`, W3 `rice_paper.png`, W4 `env_back.png` and W8 `lantern_unlit.png` as the style reference of every later part: the same hand dip-dyed washi in a dusk gradient (dusk violet → dusky rose → lantern amber) with visible long fibres, the same warm ivory rice paper, the same plain rice-paper sky lantern with fine bamboo ribs, the same soft last daylight from the top-left. Parts drawn on the same envelope canvas (W4, W5, W6, W8, W9, W10) keep the envelope in exactly the same box.

Bu dosya tasarım 31'in **bütün görsel parçalarının** tek kaynağıdır (yeniden tasarım: `docs/35_22_32_YENIDEN_TASARIM.md`
§3–§4; görev G231). Eski PAKET 5 (W2.x, avuçlar + fener) ve Codex `envelope-v3` kapağı geçersiz; eski PAKET 6 bölümü
kaldırıldı (git geçmişinde). Platform teması (`platform/themes/sky-lantern-festival/`) bu parçalarla **39 pilotunun
yapısıyla baştan kurulacak** (G431, `docs/34_TEMA_HATTI_40_48.md`); her parçanın nasıl kullanılacağı "Kullanım"
satırlarındadır, gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar (isimler, tarih, baş harfler, mekân)
HTML'dir, hiçbir görsele pişirilmez. QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/31_Sky_Lantern_Festival/assets/gpt/` altındaki `parts/`
  (PAKET 5R) ve `print/` (PAKET 6R). `photos/` (PAKET 2) dolu — dokunma. Repoya yazamıyorsan dur ve bunu çıktında açıkça
  söyle; kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/31_Sky_Lantern_Festival --paket 5` (oran, gerçek alfa, kenar
  payı, foto penceresi) + göz kontrolü. Tema yeniden kurulunca `python3 platform/themes/sky-lantern-festival/build_images.py`
  ve `python3 tools/gpt_kuru_deneme.py --tema sky-lantern-festival --sekil
  collections/31_Sky_Lantern_Festival/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic paper, silk and gold product photography with warm light** — real hand dip-dyed washi with long
  visible kozo fibres and a soft deckle, real warm ivory rice paper, real fine split-bamboo ribs, real amber silk thread,
  real polished warm gold, real garden roses; a lit lantern glows softly from inside its own paper. An open-air wedding at
  dusk: romantic, airy, rich and calm; classic, broad appeal. Not watercolor clip-art, not flat vector, not cartoon, not
  anime, not neon, not a festival poster.
- Renkler (yalnız bunlar): dusk violet `#2B1F45` · deep `#1B1430` · violet `#4A3466` · dusky rose `#E7B4A6` · lantern
  amber `#F2A65A` · glow `#FFD08A` · rice paper `#F7EEDD` · ink `#3B2A4A`; metal yalnız sıcak altın varak (çivi, pullar,
  ince çizgiler).
- Işık: alacakaranlığın yumuşak son ışığı **sol üstten**, bütün parçalarda aynı. Yanık fener ışığı **yalnız kendi kâğıdının
  içinde** — kâğıdın dışında hâle, ışın, parıltı yok (hâleyi site ekler). Şeffaf parçalarda gerçek alfa, nesne her kenardan
  en az %6 içeride, nesnenin dışında gölge/hâle yok.
- Fener: sade, yuvarlak omuzlu, uzunca silindir gövdeli pirinç kâğıdı **gökyüzü feneri**; ince dikey bambu kaburgalar kâğıdın
  içinden hafifçe seçilir, altta açık ağız ve ince tel halka, desen/yazı/karakter yok. Alev görünmez.
- Foto penceresi (`#00FF00`) yalnız W12 `lantern_frame`, W13 `paper_panel`, W14 `wide_panel`'da; diğer parçalarda yeşil yok.
- Gerçek bir kişiye, mekâna, markaya, festivale ya da başka bir satıcının tasarımına benzemesin. **27 Riad'dan ayrı:** pirinç
  delikli metal fener, teal, safran, zellige, kemer yok. **29 Celestial'dan ayrı:** pirinç alet, yıldız haritası, gravür yok.
  **26 Kintsugi'den ayrı:** çivit, altın damar, origami katı yok. **39'dan ayrı:** U kapak, gümüş, şerit yok.

## Zarf geometrisi (W4–W6, W8–W10 ve W19 buna göre)
Tuval **1080×1500** (dikey). Zarf kutusu **x %7–93, y %6–94** (zarf ≈0,7:1). Altı katman **aynı tuvalde, aynı kutuda**
çizilir: W4 arka (astar), W5 ön cep (altın çivi dahil), W6 kapak, W10 ipek iplik, W8 sönük fener, W9 yanık fener; Claude
her birini kendi kutusuna kırpar ve arka katmanın kutusuna göre yerleştirir (`docs/34` §2.2). Tuval yüzdeleri:
- **ön cep (W5):** tam genişlik; üst kenarı yanlarda **%44**'te, ortada **%49**'a inen sığ yay; alt kenar %94. Cebin
  üstünde, ortada **altın kubbe çivi**: merkez **(%50, %87)**, çapı tuval eninin **%4**'ü.
- **fener karnı kapak (W6):** üst katlama çizgisi %6; serbest kenarı yanlara **%47**'de değer, dış beşte birlik kısımda
  neredeyse yatay gider, sonra tek, dolgun, yuvarlak bir **karın kavisiyle** ortada **%62**'ye iner (V değil, sivri değil,
  tarak değil); kenar elle yırtılmış washi gibi **tüylü lifli**. Kapak cebin üst kenarını her yerde örter.
- **fener (W8 sönük / W9 yanık — aynı fener, aynı yer):** kutu **x %36–64, y %44–80**; dik durur, kapağın ucunu (%62)
  örter; alttaki açık ağzın tel halkası **y %77–80**.
- **ipek iplik (W10):** fenerin tel halkasının ortasından (%50, %80) çiviye (%50, %87) iner, çiviye iki tur dolanır ve küçük
  bir fiyonkla bağlanır; fiyonk kuyrukları yaklaşık **(%45, %91)** ve **(%55, %91,5)**'te biter.
- **açık kapağın iç yüzü (W7)** ayrı tuvalde (1080×700): aynı kapak çizgisi dikey aynalanmış, oran korunur → tuval
  **x %18,5–81,5**, katlama kenarı altta **%94**, yan köşeler **%30**, karın tepesi **%6**.
- Kat sırası (alttan üste): W4 arka → kart (W11) → W5 cep → W6 kapak → W10 iplik → W8 sönük fener → W9 yanık fener
  (başta saydam).

Açılış: dokununca W9 yanık fener W8'in üstüne yavaşça belirir (içeriden ışıma, site sıcak hâleyi ekler) → ipek fiyonk
gevşer, iplik fenerle birlikte yukarı kayıp söner → fener hafif sağ-sol salınımla yükselir ve ekranın üstünden çıkar
(home'da küçük "ay" olarak asılı kalır); arka planda üç uzak fener (W15) farklı hızlarda yükselir → kapak üst katlama
çizgisinde **3B** açılır, 90°'de iç yüz W7 devralır (gül-kehribar washi + altın pullar) → pirinç kâğıdı kart (W11) cepten
yükselir, cep dudağını geçince öne gelir → dilek tohumları ve altın pullar (W18) süzülür → home. Toplam ≤ 5,5 s; açılışta
ekranda düğme yok.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Alacakaranlık dip-dye washi (kapak ve sayfa zemini, tam boy)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/dusk_ground.png` · 1080×2340 · opak

```
A tall, perfectly flat, front-facing full-bleed sheet of handmade washi paper, hand dip-dyed in a soft vertical dusk gradient, photographed evenly: the top third deep dusk violet (from #1B1430 at the very top to #2B1F45), melting through violet (#4A3466) in the middle into a soft dusky rose band (#E7B4A6) at about 72% of the height, and a warm lantern-amber glow (#F2A65A to a pale #FFD08A) along the bottom 10%. The colour transitions are soft, natural dye bleeds with gentle cloudy variation, never banded and never a digital gradient. Long, fine kozo fibres are visible throughout the paper as faint lighter strands; in the upper violet part a very sparse scattering of tiny warm gold-leaf flecks catches the light. Very low contrast everywhere so light text reads on the top half and dark text reads on the bottom part. No horizon, no landscape, no moon, no stars drawn, no lanterns, no fold, no crease, no stain, no vignette, no shadow. The left and right edges must tile horizontally without a visible seam. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: tam boy; üst menekşe → orta gül → alt kehribar, bantsız yumuşak geçiş; lifler görünür, seyrek altın pul yalnız üstte; manzara/fener/yıldız çizimi yok; sol-sağ kenar dikişsiz.
Kullanım: tema kurulunca kapak sayfası ve bütün sayfaların üst zemini (`background-size: 100% auto`, üste hizalı); altında W2 devam eder. Açılışta hafif paralaks (uzak fenerlerden yavaş).

#### W2 Menekşe washi (uzun sayfaların devamı, dikişsiz)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/dusk_tile.png` · 1024×1024 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of the same handmade washi paper as dusk_ground.png in its deep dusk violet (#2B1F45, gently varying toward #1B1430 and #4A3466): long fine kozo fibres as faint lighter strands, a soft cloudy dye variation, a very sparse scattering of tiny warm gold-leaf flecks. Evenly lit by soft light from the top-left, very low contrast so light text reads everywhere. No fold, no crease, no stain, no vignette, no shadow, no pattern, no stars, no lanterns. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); W1'in menekşe bölümüyle aynı kâğıt ve ton; sakin, açık renk yazı okunur.
Kullanım: tema kurulunca W1'in altında uzun sayfaların (home, details, rsvp) ve geniş ekran kenarlarının zemini; W1'in alt kehribarından buna CSS geçişiyle bağlanır.

#### W3 Pirinç kâğıdı (kartlar, paneller, form; dikişsiz)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/rice_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of fine handmade rice paper in a warm ivory (#F7EEDD): soft visible long fibres and a few delicate inclusions of slightly lighter fibre, a gentle translucent cloudiness, an even tone with only the gentlest variation. Evenly lit by soft light from the top-left, no fold, no crease, no deckle edge, no stain, no shadow, no vignette, no printing, no pattern. Calm enough for fine dark ink text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: dikişsiz; sıcak fildişi `#F7EEDD` civarı; lifler hafif, leke/kat/desen yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, program ve RSVP formunun kâğıdı.

#### W4 Zarfın arkası (iç astar: alacakaranlık göğü)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/env_back.png` · 1080×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope, seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the 1080×1500 canvas (a portrait rectangle, about 0.7:1, crisp straight edges, softly rounded corners). Its outer paper is the hand dip-dyed dusk washi of dusk_ground.png (violet at the top fading to dusky rose and a little amber at the bottom), visible only as a slim margin along the top and both sides. Inside, it is lined with a printed washi lining showing a soft hand-painted dusk sky: deep violet (#2B1F45) at the top, melting into dusky rose (#E7B4A6) and a glowing amber horizon (#F2A65A) low down, with a delicate scattering of tiny gold-leaf star flecks in the upper part, the fibres of the paper visible through the print; a very gentle shade toward the bottom where the front pocket will sit. No flap, no front pocket, no lantern, no thread, no card inside, no landscape, no moon, no drawn stars or symbols. Soft light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: dikey panel x %7–93 · y %6–94; iç astar alacakaranlık göğü + seyrek altın pul, kenarlarda ince dip-dye pay; kapak/cep/fener yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kartın arkasında görünen gök astarı; açılıştan sonra astardaki altın pullara hafif ışık kıpırtısı (CSS maske).

#### W5 Zarfın ön cebi (altın çivi dahil)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/env_front.png` · 1080×1500 · **Şeffaf zemin**

```
Only the front pocket of the same portrait dip-dyed washi envelope as env_back.png, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas; the pocket spans the full envelope width (x 7–93%) from its top edge down to the envelope's bottom edge at 94% of the canvas height. Its top edge is one soft, shallow arc: it starts at 44% of the canvas height at both side edges and dips gently to 49% at the horizontal centre, cut clean, the faint thickness of the handmade paper visible along the cut. The paper is the hand dip-dyed dusk washi of dusk_ground.png, continuing the gradient: soft violet-rose near the pocket's top edge deepening to dusky rose and a warm amber glow toward the bottom, long kozo fibres visible, the soft fold lines of the side and bottom flaps barely visible. On the pocket, at the horizontal centre, one small polished warm-gold domed stud (a round button-like rivet) centred at 50% of the width and 87% of the height, its diameter 4% of the canvas width, catching a crisp highlight from the top-left. Everything above the pocket's edge is completely transparent. No flap, no lantern, no thread, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik; üst kenarı yanlarda %44, ortada %49'a inen sığ yay; altın kubbe çivi (%50, %87), çap %4; üstü tamamen şeffaf; iplik/fener yok; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; çivi cebin parçası olarak yerinde kalır, ipek iplik (W10) çözülünce çıplak görünür.

#### W6 Fener karnı kapak (kapalı, dış yüz)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/flap.png` · 1080×1500 · **Şeffaf zemin**

```
Only the closed flap of the same portrait dip-dyed washi envelope, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas; the flap spans its full width (x 7–93%), hinged along a softly rounded fold at the envelope's top edge (6% of the canvas height). Its free lower edge has the silhouette of the round belly of a paper lantern: it meets the two side edges at 47% of the canvas height, runs almost level along the outer fifth on each side, then swells downward in one full, generous, rounded curve to its lowest point at the horizontal centre at 62% of the canvas height (not a V, not a point, not scalloped, not a narrow U). Along this whole edge the paper is hand-torn: a soft feathered deckle where fine long kozo fibres stand out slightly beyond the edge, very delicate. The flap is the hand dip-dyed dusk washi of dusk_ground.png: deep dusk violet (#2B1F45) at the fold, melting into violet and a soft dusky rose glow toward its lower edge, long fibres visible, a very sparse scattering of tiny gold-leaf flecks near the fold. A whisper of contact shade on the flap itself just along its torn edge, soft light from the top-left. Everything below the flap's edge is completely transparent. No lantern, no thread, no stud, no seal, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: kapak tam genişlik; kenarı yanlarda %47, dış beşte birde neredeyse yatay, ortada dolgun yuvarlak karınla %62; tüylü yırtık lif kenar; menekşe → gül gradyan; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; fener kalkınca üst katlama çizgisinde 3B açılır, 90°'de W7 iç yüz devralır.

#### W7 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/flap_in.png` · 1080×700 · **Şeffaf zemin**

```
The inside of the same lantern-belly envelope flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically. Its straight fold edge is at the BOTTOM, along 94% of the image height, spanning x 18.5–81.5% of the width; its two short straight sides rise to 30% of the image height; from there the edge runs almost level along the outer fifth on each side and then rises in one full, generous, rounded belly curve to its highest point at the horizontal centre at 6% of the image height, the whole edge hand-torn with a soft feathered deckle of fine fibres. The inside surface is a warm washi lining dip-dyed from a soft dusky rose (#E7B4A6) near the fold to a glowing lantern amber (#F2A65A) and pale glow (#FFD08A) toward the curved edge, with long fibres visible and a light scattering of tiny warm gold-leaf flecks, like the warm light inside a lantern. Soft light from the top-left. No lantern, no thread, no seal, no drawn stars. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: düz katlama kenarı altta (%94), yanlar %30'a, karın tepesi ortada %6; x %18,5–81,5; tüylü yırtık kenar; gül → kehribar washi + altın pullar; düz renk değil; gerçek alfa.
Kullanım: tema kurulunca kapak açıldığında zarfın üstünde dik duran iç yüz (3B dönüşün arka yüzü; asla düz renk dolgu değil).

#### W8 Sönük pirinç kâğıdı gökyüzü feneri (kapanış)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_unlit.png` · 1080×1500 · **Şeffaf zemin**

```
On the same 1080×1500 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 6–94% of the canvas, but the envelope itself is NOT drawn here), only one small UNLIT paper sky lantern standing upright, on a fully transparent background, occupying exactly x 36–64% and y 44–80% of the canvas: a plain, undecorated lantern of warm ivory rice paper (#F7EEDD) with softly rounded shoulders at the top, a gently tapering tall cylindrical body, and an open round mouth at the bottom held by a thin dark wire ring (at 77–80% of the canvas height); fine vertical split-bamboo ribs show faintly through the translucent paper, the paper has a soft natural crinkle and visible fibres. It is NOT lit: the paper is in soft dusk light from the top-left with gentle shading on the right side, cool and quiet, no glow, no flame, no light inside. No string, no stud, no pattern, no decoration on the paper. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: tek sönük fener, kutu x %36–64 · y %44–80; yuvarlak omuz, silindir gövde, altta tel halka (%77–80); ışık/alev yok; desen/yazı yok; zarf çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca zarf tuvalinde kapanış katmanı (kapağın ucunu örter); açılışta W9 üstüne belirir, sonra ikisi birlikte yükselir.

#### W9 Yanık fener (aynı fener, içeriden ışıyor)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_lit.png` · 1080×1500 · **Şeffaf zemin**

```
The identical paper sky lantern of lantern_unlit.png, on the same 1080×1500 canvas, in exactly the same position and size (x 36–64% and y 44–80% of the canvas), with exactly the same silhouette, shoulders, bamboo ribs and wire ring, on a fully transparent background — but now LIT from inside: the rice paper glows warmly from within, brightest pale glow (#FFD08A) in the lower middle of the body, deepening to lantern amber (#F2A65A) toward the shoulders and the edges, the fine bamboo ribs showing as soft darker lines against the light, the paper's fibres glowing. The light stays entirely INSIDE the lantern's own paper: no flame visible, no smoke, no rays, no sparks, no glow, halo or light spill outside the lantern's outline (the website adds the glow). No string, no stud, no pattern, no decoration. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: W8 ile birebir aynı yer, boy ve silüet; içeriden sıcak ışıma; dışında hâle/ışın yok; alev yok; gerçek alfa.
Kullanım: tema kurulunca W8'in tam üstünde, başta saydam; dokununca belirir (site sıcak hâleyi ve nefes alan ışımayı CSS ile ekler) → fener yükselir; home imzasında ve RSVP gönderiminde de kullanılır.

#### W10 Kehribar ipek iplik ve fiyonk
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/silk_thread.png` · 1080×1500 · **Şeffaf zemin**

```
On the same 1080×1500 canvas as env_front.png and lantern_unlit.png, in exactly the same place (the envelope, the stud and the lantern are NOT drawn here), only a fine amber silk thread, on a fully transparent background: the thread hangs from the centre of the lantern's bottom wire ring at 50% of the width and 80% of the height straight down to where the gold stud sits (centred at 50%, 87%), winds twice around that round stud (the thread loops visible as a small ring of thread about 5% of the canvas width across, its centre left open where the stud is), and is tied there in a small neat bow whose two short tails fall softly, one ending at about 45% of the width and 91% of the height, the other at about 55% of the width and 91.5% of the height. Lustrous amber silk (#F2A65A) with a soft sheen in light from the top-left, very fine (about 0.6% of the canvas width thick). Everything else is fully transparent. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: ince kehribar iplik (%50, %80) → (%50, %87); çivi yerinde ortası boş iki tur halka + küçük fiyonk, kuyruklar ~(%45, %91) ve (%55, %91,5); zarf/çivi/fener çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca zarf tuvalinde cep ile fener arasında; açılışta fiyonk gevşer (hafif ölçek/döndürme), iplik fenerle birlikte yukarı kayarak söner.

#### W11 Zarftaki kart (boş)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen straight on, on a fully transparent background: thick warm ivory rice paper as rice_paper.png (#F7EEDD), the card spanning x 7–93% and y 6–94% of the canvas, with a softly torn deckle edge on all four sides. Along its top edge the paper is very softly dip-dyed in dusky rose (#E7B4A6) fading into the ivory within the top 12% of the card, with a hint of amber where the colour meets the paper; a single hair-fine warm gold-leaf line runs as a border inset about 6% from the card's edge. The whole card inside the border is EMPTY paper (the website sets the names, date and venue there in HTML). Soft light from the top-left, a hair-fine contact shade only along the card's own deckle. No lantern, no flowers, no ornament, no photo. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: tırtıklı pirinç kâğıdı kart; üst kenarda hafif gül dip-dye; ince altın kıl çizgi bordür; içi tamamen boş; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → zarftan yükselen kart ve home kartı (isimler, tarih, mekân HTML).

#### W12 Fener silüetli portre penceresi (home)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_frame.png` · 1000×1300 · **Şeffaf zemin**

```
A portrait photo frame in the shape of a tall paper sky lantern, alone, seen straight on, on a fully transparent background: a lantern silhouette of warm ivory rice paper (#F7EEDD) spanning about x 8–92% and y 6–94% of the canvas, with softly rounded shoulders at the top, gently tapering sides, and a thin dark wire ring across its open bottom; fine vertical split-bamboo ribs show through the paper border, which glows very softly warm (pale glow #FFD08A at its inner edge fading to ivory), the light staying inside the paper. In the middle a portrait photo window with a rounded arched top: exactly 700 px wide and 900 px tall overall, its top-left corner at x 150 px, y 230 px, the top of the window a full semicircle and the sides and bottom straight, filled with flat pure green #00FF00 (no texture, no shading, crisp edges, nothing over it). Soft light from the top-left. No flame, no string, no flowers, no pattern. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: fener silüeti x %8–92 · y %6–94; pencere düz `#00FF00`, kemerli üst, 700×900, sol üst (150, 230); kenar içeride hafif sıcak; dışında hâle yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır (`keyed_window`) → home kartının portresi; foto alttan büyüyen sıcak ışık dairesiyle açılır.

#### W13 Asılı pirinç kâğıdı panel (story çerçevesi)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/paper_panel.png` · 1000×1300 · **Şeffaf zemin**

```
A hanging rice-paper panel used as a portrait photo frame, alone, seen straight on, on a fully transparent background: a sheet of warm ivory rice paper (#F7EEDD, soft fibres, a gently torn deckle along its two long sides) spanning x 8–92% of the width, held between two slim natural split-bamboo rods, one across the top at about 11% of the height and one across the bottom at about 92%, each rod extending slightly beyond the paper on both sides; from the ends of the top rod a fine amber silk hanging cord (#F2A65A) rises in a soft triangle to a small loop at about 6% of the height. In the middle a portrait photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 200 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window glows very faintly warm along the window's lower edge, the light staying inside the paper. Soft light from the top-left. No lantern, no flowers, no pattern. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 760×950 (4:5), sol üst (120, 200); üstte ve altta bambu çubuk, üstte kehribar askı ipi; yeşil başka yerde yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'nin üç anı (sol–sağ–sol, hafif sallanma) ve home'daki hikâye tanıtımı; foto alttan büyüyen ışık dairesiyle açılır.

#### W14 Geniş bambu panel (mekân fotoğrafı)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/wide_panel.png` · 1600×1000 · **Şeffaf zemin**

```
A wide landscape rice-paper panel used as a photo frame, alone, seen straight on, on a fully transparent background: a sheet of warm ivory rice paper (#F7EEDD, soft fibres, softly torn deckle along its left and right edges) spanning x 7–93% and y 9–91% of the canvas, held between two slim natural split-bamboo rods along its top edge (at about 8% of the height) and its bottom edge (at about 92%), each rod extending slightly beyond the paper to x 6% and x 94%. In the middle a landscape photo window exactly 1280 px wide and 720 px tall (16:9), its top-left corner at x 160 px, y 140 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). A very faint warm glow in the paper along the window's lower edge, staying inside the paper. Soft light from the top-left. No hanging cord, no lantern, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 1280×720 (16:9), sol üst (160, 140); üstte ve altta bambu çubuk; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı (soldan sağa ışık süpürmesiyle açılır).

#### W15 Uzak küçük fener (arka planda yükselen)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/far_lantern.png` · 400×560 · **Şeffaf zemin**

```
A single small lit paper sky lantern seen from slightly below and at a distance, as if floating high in the evening air, alone, on a fully transparent background, spanning about x 25–75% and y 10–90% of the canvas: the same plain rice-paper lantern as lantern_lit.png (rounded shoulders, tapering cylindrical body, thin wire ring at the open bottom, faint bamboo ribs), glowing warmly from inside (pale glow #FFD08A at the lower middle, amber #F2A65A toward the edges), very slightly soft as if a little out of focus. The light stays entirely inside the lantern's own paper: no flame, no rays, no halo outside its outline. No string. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: tek küçük yanık fener, hafif yumuşak; dışında hâle yok; alev/ip yok; gerçek alfa.
Kullanım: tema kurulunca açılışta arka planda üç kopya farklı boy/hız/bulanıklıkla yükselir (paralaks); story ve home'da kaydırdıkça yavaş süzülen 2–3 fener; RSVP gönderiminde uzaklaşan fener.

#### W16 Köşe süsü (gül pembesi bahçe gülleri + çayır otları)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A restrained, romantic corner spray of flowers growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: two dusky rose garden roses (#E7B4A6, soft layered petals with a warmer apricot heart), one pale apricot spray rose and two small buds, a few long soft feathery meadow grasses and wispy seed heads catching the light, and one short curling tail of amber silk ribbon (#F2A65A) with a soft sheen; stems hidden. Airy and light, not dense. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Soft dusk light from the top-left. No lantern, no vase, no glitter, no other colours. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: sol üstten çıkan hafif küme, sağ alt yarı boş; gül pembesi + kayısı + çayır otu + kehribar kurdele; yoğun değil; gerçek alfa.
Kullanım: tema kurulunca yalnız home kartının bir köşesi (gerekirse aynalanır), imza ve RSVP kapanışında küçük; kapak sayfasında **metnin altına girmeyecek** şekilde en fazla bir köşe.

#### W17 Minik fener dizisi (bölüm ayırıcı)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/divider.png` · 1600×240 · **Şeffaf zemin**

```
A slim horizontal divider, alone, on a fully transparent background: one very fine warm-gold thread running horizontally across x 8–92% of the canvas, sagging very gently at its centre, with seven miniature plain rice-paper lanterns hanging from it at even intervals on tiny threads, the middle one slightly larger and the others gradually smaller toward both ends; each miniature lantern glows warmly from inside (pale glow #FFD08A to amber #F2A65A), the light staying inside its own paper. Elegant and fine, not a party garland. No tassels, no other colours, no halo outside the lanterns. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: ince altın iplik, yedi minik yanık fener (ortadaki büyük); fenerlerin dışında hâle yok; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı; programda satırlar gelirken fenerler soldan sağa tek tek "yanar" (CSS maskesiyle parlaklık).

#### W18 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft dusk light from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, characters, monograms, logos or watermarks. (Make three files, the same light and scale: 1 = one tiny irregular flake of warm gold leaf, thin and slightly curled, with a crisp metallic highlight; 2 = one single loose dusky rose petal (#E7B4A6), softly cupped, a warmer apricot tone at its base; 3 = one single dandelion wish seed — a slender seed with its fine white feathery parachute fully open, delicate and airy.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (altın varak pulu, gül yaprağı, karahindiba tohumu); kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışta (fener kalktıktan sonra) ve RSVP gönderiminde süzülen küçük nesneler; tohumlar yukarı, yaprak ve pullar aşağı süzülür (her biri ayrı katman, kendi fazında).

#### W19 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life at dusk, photorealistic product photography: the closed portrait dip-dyed washi envelope of flap.png and env_front.png with its lantern-belly flap and torn feathered edge lies slightly below the centre on a soft sheet of the dusk washi of dusk_ground.png; on it, tied by its fine amber silk thread to the small gold stud, stands the small paper sky lantern of lantern_lit.png, glowing warmly from inside (no flame visible); at the left a restrained spray of dusky rose garden roses, a pale apricot rose and feathery meadow grasses (as corner_spray.png); a few tiny gold-leaf flakes and one dandelion seed lie on the paper; behind, softly out of focus in a violet-to-amber evening sky, three distant lit paper lanterns rise at different heights. Only dusk violet, dusky rose, lantern amber, glow and rice-paper ivory tones; soft last daylight from the top-left. The top 20% of the image is calm and soft (only the out-of-focus sky and one distant lantern). This image is cropped to 1200×630 for link previews: keep the whole envelope and lantern visible with at least 5% empty margin below the envelope. No people, no fire, no smoke. No text, letters, numbers, characters, monograms, logos or watermarks.
```
Kontrol: zarf + yanık fener bütün, altında ≥%5 boşluk; fenerde alev yok; üst %20 sakin; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım) ve katalog posterinin yedeği.

---

## PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Demo içeriği (`content.demo.json`): **Sophie & Daniel**, *The Meadowlark Terrace* (kurgu), Santa Barbara, California,
September 18, 2027. Kurgu kişiler: **gerçek bir kişiye (ünlü dahil) benzemesin**; yüzler doğal, yaşları 28–34; tek bir kurgu
çift beş fotoğrafta da aynı kişiler. Sophie: açık kumral, omuz altı yumuşak dalgalı saç, açık ten, sade fildişi şifon uzun
elbise (gelinlik değil, sade). Daniel: koyu kahve kısa saç, buğday ten, kısa bakımlı sakal, kömür grisi takım, açık yaka.
Fotoğraf gerçekçi (PAKET 5'in suluboyası değil), alacakaranlık ve sıcak fener ışığı, sinematik ama doğal. Gerçek kalabalık
fener bırakma ya da ateş tehlikesi görünen sahne yok (fenerler küçük, sakin; LED kâğıt fenerler olabilir). Yazı, logo,
filigran yok.

#### 2.1 Portre (davet kartı ve home)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/hero_portrait.jpg` · 1024×1280 (4:5)

```
A warm, natural portrait photograph of a fictional couple in their early thirties (they must not resemble any real person): she has soft wavy light-brown hair below her shoulders and wears a simple ivory chiffon gown, he has short dark-brown hair, a neat short beard and wears a charcoal suit with an open collar. They stand close, foreheads nearly touching, smiling softly, framed from the waist up, on a hilltop terrace at dusk; behind them, softly out of focus, a violet-to-amber sky and a few warm paper lanterns hanging low. Faces in the upper middle of the frame. Photorealistic, natural skin, no heavy retouching. No text, no logo, no watermark.
```

#### 2.2 Story 1 — "Our first evening"
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_1.jpg` · 1152×1536 (3:4)

```
The same fictional couple (same faces, hair and clothes styled casually: she in a light summer dress, he in a white linen shirt) laughing together at a small table on a seaside terrace in the early evening, string lights and a soft violet sky behind them, seen from a little distance. Vertical photo, the couple in the middle third. Photorealistic. No text, no watermark.
```

#### 2.3 Story 2 — "A wish in the sky"
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_2.jpg` · 1152×1536 (3:4)

```
The same fictional couple standing in a quiet meadow at dusk, holding one glowing white paper lantern together between their hands and looking up at it, their faces lit warm by its glow, a violet sky and a few distant soft lights behind them. Seen at a three-quarter angle. Vertical photo. Photorealistic. Calm and intimate — no crowd, no fire, no smoke. No text, no watermark.
```

#### 2.4 Story 3 — "Yes, at dusk"
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_3.jpg` · 1152×1536 (3:4)

```
A close photograph of the same fictional couple's joined hands with a simple gold engagement ring, held up against a soft violet-and-amber dusk sky with a small glowing paper lantern blurred in the background, shallow depth of field. Vertical photo. Photorealistic. No text, no watermark.
```

#### 2.5 Mekân — "The Meadowlark Terrace" (kurgu)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/venue.jpg` · 1536×864 (16:9)

```
A wide photograph of a fictional hilltop garden terrace set for an evening wedding at dusk: long tables with ivory linen and candles, white paper lanterns strung low on thin lines between olive trees, a lawn with rows of white chairs facing an open view of distant hills and the sea under a violet-to-amber sky. It must not reproduce any real, identifiable venue. No people, no text, no signs, no watermark.
```

Kontrol (PAKET 2): beş fotoğrafta aynı kurgu çift; gerçek kişiye benzemiyor; yazı yok; oranlar doğru (`python3 tools/kit_check.py collections/31_Sky_Lantern_Festival --paket 2`).


---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'sky-lantern-festival'` bloğu
> eski zeminleri (`print/print_front.png`, `print/print_back.png`, eski çiçekli fildişi görünüm) gösteriyor; yeni zeminler
> gelince G431 bloğu bunlara çevirir. Eski dosyalar silinmez (geçmiş).
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in +
> 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (oran 0,713) aynı sayfadan yanlardan ~%0,8 kırpılarak
> basılır. Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda. Kâğıt açık (pirinç kâğıdı): koyu tam taşma zemin baskıda mürekkep yer, istenmez.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. G431'de `layouts.ts` `'sky-lantern-festival'` bloğu: `sources` → `{ front: 'print/invitation_front_r_5x7.png', back:
>    'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme sky-lantern-festival` ve `node scripts/print-sample.ts
>    --theme sky-lantern-festival --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm ivory rice paper of rice_paper.png (#F7EEDD). Across the very top, a soft hand dip-dyed band of dusk washi colour bleeds down into the paper — dusk violet (#2B1F45) at the top edge melting through violet and dusky rose (#E7B4A6) into a faint amber glow and then into the ivory — the coloured band fading out completely by 15% of the height, with a few tiny warm gold-leaf flecks in it; within this band, between 20% and 80% of the width, three small plain rice-paper sky lanterns glowing softly from inside rise at slightly different heights (the light staying inside each lantern, no flame), none reaching lower than 17% of the height. Along the bottom, between 93% and 96% of the height and from 14% to 86% of the width, one fine warm-gold line with a single tiny glowing lantern at its centre. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no lantern, no fleck, no line, no colour, no shadow, no stain in it. No ornament within 8% of the left and right edges except the soft colour of the dyed band. Soft light from the top-left. No QR code. No text, letters, numbers, characters, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; üstte %15'te tamamen sönen dip-dye alacakaranlık bandı + üç küçük yanık fener (%17'nin üstünde); altta ince altın çizgi + minik fener; %19–%91 × %10–%90 tamamen boş; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same warm ivory rice paper, only a short string of five miniature plain rice-paper lanterns glowing softly from inside hanging from one fine warm-gold thread across the top centre (between 30% and 70% of the width), its lowest point staying above 11% of the height, and a very faint dusky rose dye blush along the top edge fading out by 6% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no lantern, no line, no colour, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, characters, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada beş minik fener dizisi (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

## PAKET 3 — Etsy ilan sahneleri (görev G175) — GEÇERSİZ (2026-10-22: yeniden tasarım; tema kurulunca yeniden yazılacak)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Yazan: G175 (`tools/paket3_sahne.py` şablonu, 01–21 ile aynı). `tools/listing_editorial.py` 3.1, 3.2, 3.4 ve 3.5'i
> kullanır (ilan görselleri 1, 2, 8, 4); 3.3 yedek sahnedir.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a soft rice-paper cloth on a light wooden table at dusk and glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a soft rice-paper cloth on a light wooden table at dusk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a soft rice-paper cloth on a light wooden table at dusk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a soft rice-paper cloth on a light wooden table at dusk, slightly right of center and rotated about 8 degrees, surrounded at the edges by glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on an ivory linen sofa with a dusky rose cushion and a warm glowing paper lantern; a small arrangement of glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 31`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a soft rice-paper cloth on a light wooden table at dusk, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and glowing round rice-paper lanterns, a few strands of warm fairy lights. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a soft rice-paper cloth on a light wooden table at dusk, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a soft rice-paper cloth on a light wooden table at dusk, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a soft rice-paper cloth on a light wooden table at dusk: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a soft rice-paper cloth on a light wooden table at dusk: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a soft rice-paper cloth on a light wooden table at dusk, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes glowing round rice-paper lanterns, a few strands of warm fairy lights; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a soft rice-paper cloth on a light wooden table at dusk, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a soft rice-paper cloth on a light wooden table at dusk: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
