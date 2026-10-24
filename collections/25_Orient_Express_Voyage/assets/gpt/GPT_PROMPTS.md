# GPT görsel istekleri — Tasarım 25 · Orient Express Voyage (2026-10-22 yeniden tasarım)

> **Instructions for GPT:** This design is being REDESIGNED from scratch (2026-10-22). Generate PAKET 5R (website layers)
> first, in order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 (sample photos) ALREADY EXISTS — do not
> regenerate it. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as written, follow its
> checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers,
> names, dates, initials, monograms, crests, emblems, logos, brand marks, QR codes or watermarks in any image** — the
> luggage tag, the ticket card, the lock, the watch dial and the map are all completely blank (no numerals, no place
> names, no route numbers, no railway company marks). This is an invented 1930s luxury sleeper-train world: it must not
> copy any real railway company, train, poster, livery, ticket or seller's design. Give W1 `page_ground.png`, W2
> `ticket_paper.png` and W4 `env_front.png` as the style reference of every later part: the same warm ivory antique map
> paper, the same ivory ticket card, the same bottle-green embossed leather-grain paper with gold-tooled lines and polished
> brass, the same route-red moiré silk lining, the same warm lamplight from the top-left. Parts drawn on the same sleeve
> canvas (W3, W4, W5, W7, W8, W9) keep the sleeve in exactly the same box.

Bu dosya tasarım 25'in **bütün görsel parçalarının** tek kaynağıdır (yeniden tasarım: `docs/35_22_32_YENIDEN_TASARIM.md`
§3–§4, satır 25; GPT görevi G225). Eski PAKET 5 (W2.x, 18–20 Ekim'den önce) ve eski PAKET 6 kaldırıldı (git geçmişinde).
Tema (`platform/themes/orient-express-voyage/`) 39 pilotunun yapısıyla **yeniden kurulacak** (G425); şimdiki Codex
`envelope-v3` kurulumu bu parçaları kullanmaz. Gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar
(isimler, tarih, baş harfler, mekân) HTML'dir, hiçbir görsele pişirilmez; QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/25_Orient_Express_Voyage/assets/gpt/` altındaki `parts/`
  (PAKET 5R) ve `print/` (PAKET 6R). `photos/` (PAKET 2) zaten dolu. Repoya yazamıyorsan dur ve bunu çıktında açıkça
  söyle; kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/25_Orient_Express_Voyage --paket 5` (oran, gerçek alfa, kenar
  payı, foto penceresi) + göz kontrolü. Tema yeniden kurulunca `python3 platform/themes/orient-express-voyage/build_images.py`
  ve `python3 tools/gpt_kuru_deneme.py --tema orient-express-voyage --sekil
  collections/25_Orient_Express_Voyage/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic luxury product photography** — real bottle-green embossed leather-grain paper (fine pebbled
  grain, like a hand-bound travel document case), real gold tooling pressed into it, real polished and softly aged brass
  (crisp warm highlights, no green patina), real route-red moiré silk, real heavy ivory ticket card, real mahogany with a
  deep French-polish gloss; a 1930s luxury sleeper train at night: classic, romantic, rich and calm. Not cartoon, not flat
  vector, not steampunk (no gears, no cogs), not a theme-park or costume look, not a travel poster.
- Renkler (yalnız bunlar): bottle green `#1E3A2C` · deep `#11241B` · brass `#B8914B` · light brass `#D8BD84` · ivory
  `#F3EBD9` · route red `#8C2F39`; maun yalnız çerçevelerde (`#4A2618` civarı), kurutulmuş çiçekler fildişi + soluk
  lavanta.
- Işık: sıcak **lamba ışığı sol üstten** (vagon tavan lambası gibi), pirinçte temiz sıcak parlak vurgular; bütün
  parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk, nesnenin
  dışında gölge/hâle yok (gölgeyi site ekler).
- Foto penceresi (`#00FF00`) yalnız W11 `portrait_frame`, W12 `story_frame` ve W13 `venue_frame`'de; diğer parçalarda
  yeşil yok.
- **04 Vintage Airmail'den ayrı:** pul, posta damgası, hava postası çizgisi, mektup yok. **35'ten ayrı:** kayış ve toka
  yok (kilit çevirmeli düğme). **48'den ayrı:** üst kapak ve mühür yok (kapak sağ uçta, dikey).

## Kılıf geometrisi (W3, W4, W5, W7, W8, W9 buna göre)
Tuval **1600×1100** (yatay). Kılıf kutusu **x %6–86, y %8–66** (1280×638 px ≈ 2,0:1); sağdaki %14 ve alttaki %34 boş
(kart sağa kayar, etiket aşağı sarkar). Altı katman **aynı tuvalde, aynı kutuda** çizilir; Claude her birini kendi alfa
kutusuna kırpar ve arka katmanın (W3) kutusuna göre yerleştirir (tuval yüzdeleri):
- **W3 kılıfın arkası / içi:** tam kutu `6, 8, 86, 66`; iç yüz bordo hareli ipek astar, üst-alt-sol kenarda ince yeşil
  deri pay; sağ uç açık (ağız).
- **W4 ön yüz:** tam kutu `6, 8, 86, 66`; sağ kenarda (x %86) ortada **yarım ay parmak oyuğu**: y %29–45, derinliği
  x %83'e kadar (oyuk şeffaf → altındaki astar görünür); **sol** iki köşede pirinç köşelik; altın yaldız çift çerçeve çizgisi.
- **W5 dil kapak (kapalı):** x %72–86 · y %8–66; menteşe **sağ kenar** (x %86, yuvarlatılmış kat); serbest kenarı sola
  bakan **yumuşak yuvarlak sivri uç**: üst ve alt kenara x %74,5'te değer, ucu x %72'de, y %37'de; **sağ** iki köşesinde
  pirinç köşelik.
- **W7 kilit plakası:** kapağın ucunda, kutu x %73,5–78,5 · y %30–44 (dikey oval uçlu pirinç plaka, dört perçin, ortada
  yuva); merkezi **(%76, %37)**.
- **W8 kilit düğmesi (döner):** kutu x %73,2–78,8 · y %35–39, kapalıyken **yatay**; döner mili tam **(%76, %37)** (ortada
  kubbe perçin). Açılışta 90° döner (dikey).
- **W9 bagaj etiketi:** gövdede pirinç kuşgözü **(%67,5, %59)** (çapı tuval eninin ~%1,6'sı), kırmızı pamuk ip kuşgözünden
  geçip aşağı sarkar; etiket dikey, kutu x %63–72 · y %70–94; sarkaç mili = kuşgözü.
- **W6 kapağın iç yüzü** ayrı tuvalde (600×1300): W5'in yatay aynası (menteşe solda x %16,5, sivri uç sağda x %83,5,
  y %6–94; oran ≈0,35:1).
- Kart (W10, dikey bilet) kılıfın içinde **90° yan yatar**, ön yüzün arkasında tamamen gizli (yalnız parmak oyuğundan
  kenarı görünür).
- Kat sırası (alttan üste): W3 arka → kart (W10) → W4 ön yüz → W9 etiket → W5 dil kapak → W7 plaka → W8 düğme (W7 ve W8
  açılışta kapakla birlikte döner).

Açılış: dokununca etiket ipinde sarkaç gibi sallanır (±14°, sönümlü) → kilit düğmesi 90° döner (yataydan dikeye, küçük
"tık") → dil kapak sağ menteşesinde **3B** yana açılır (90°'yi geçince iç yüz W6: bordo ipek) → kılıfın içindeki bilet
**sağa kayarak** ağızdan çıkar, yan yatıştan dikleşir, büyüyüp ortaya gelir; kılıf hafifçe aşağı çekilip söner → buhar
bulutu, zımba pulları ve kurutulmuş gül goncası (W18) süzülür → home.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Antika harita kâğıdı (sayfa zemini)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/page_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of warm ivory antique map paper (#F3EBD9, gentle warm variation toward #E8DCC2): a fine laid-paper tooth, a few soft cotton fibres, and, printed very faintly into it, the ghost of an old hand-engraved map — barely visible fine sepia contour traces, a dotted coastline fragment and a few hair-fine dashed route lines in a faded route red (#8C2F39 at very low strength), all so pale that they read as texture, not as a map. Absolutely no lettering, no place names, no numbers, no compass rose, no legend, no grid labels. Evenly lit by warm lamplight from the top-left, no fold, no crease, no stain, no burn marks, no vignette, no shadow. Calm enough for dark green and black text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sıcak fildişi, çok soluk harita izi (okunur bir harita değil); yazı/rakam/pusula yok; dikişsiz (2×2 ek yeri yok); koyu yazı her yerde okunur.
Kullanım: tema kurulunca bütün sayfaların zemini ve açılış sayfası (kapalı kılıfın arkası).

#### W2 Fildişi bilet kartonu (kartlar, bantlar, form)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/ticket_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of heavy ivory ticket card stock (#F3EBD9): a smooth matte surface with a soft felted tooth, the faintest warm cream variation, a few tiny darker cotton flecks, like the thick board of an old first-class railway ticket. Evenly lit by warm lamplight from the top-left. No printing, no pattern, no guilloche, no border, no perforation, no fold, no stain, no shadow, no vignette. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin fildişi karton; dikişsiz; baskı/desen yok; koyu yazı okunur.
Kullanım: tema kurulunca home bilet kartı, davet bandı, details program kartı, RSVP formu.

#### W3 Kılıfın arkası (bordo ipek astar görünür)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/env_back.png` · 1600×1100 · **Şeffaf zemin**

```
The back panel of a long horizontal leather ticket sleeve, seen perfectly straight on, on a fully transparent background. The sleeve occupies exactly x 6–86% and y 8–66% of the 1600×1100 canvas (about 2 wide : 1 tall) — the same box is used later by env_front.png, flap.png, lock_plate.png, lock_key.png and luggage_tag.png, so keep it exactly there; the rest of the canvas (right 14%, bottom 34%) stays empty and transparent. We look at the INSIDE of the back panel: it is lined with smooth route-red moiré silk (#8C2F39, a soft watered-silk shimmer catching the warm light, slightly deeper toward the bottom and right where the front panel will cover it); along the top edge, the bottom edge and the left end a slim rim (about 2% of the canvas height) of the sleeve's own bottle-green embossed leather-grain paper (#1E3A2C, a fine pebbled grain) shows, its edge finished with a hair-fine gold-tooled line. The right end is the open mouth of the sleeve: the silk simply ends at the right edge of the box, cleanly. Warm lamplight from the top-left. No front panel, no flap, no lock, no tag, no card, no ticket inside. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: kutu x %6–86 / y %8–66; iç yüz bordo hareli ipek, üst-alt-sol kenarda ince yeşil deri pay; ön yüz/kapak/kart yok; gerçek alfa.
Kullanım: tema kurulunca kılıf kutusuna (`6, 8, 86, 66`) kırpılır → en arka kat; parmak oyuğundan ve kapak açılınca ağızda bordo ipek görünür, bilet bunun önünden kayar.

#### W4 Kılıfın ön yüzü
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/env_front.png` · 1600×1100 · **Şeffaf zemin**

```
Only the front panel of the same long horizontal ticket sleeve as env_back.png, on the same 1600×1100 canvas and in exactly the same place, on a fully transparent background: the sleeve box is again exactly x 6–86% and y 8–66% of the canvas, and the front panel fills that whole box. It is luxurious bottle-green embossed leather-grain paper (#1E3A2C with a fine pebbled grain, the deepest folds toward #11241B, a soft satin glow where the warm light catches it), like a hand-bound first-class travel document case; a gold-tooled double frame line (#B8914B, crisply pressed into the grain, the outer line a little heavier) runs around the panel about 3% of the canvas height inside its edges, with a tiny art-deco fan flourish of gold tooling at the middle of the left end only; the two LEFT corners are capped with polished brass corner protectors (small right-angled brass caps with softly rounded tips and one tiny rivet each, bright warm highlights toward #D8BD84). At the right end, in the middle of the right edge, a clean half-moon thumb notch is cut into the panel: it spans from 29% to 45% of the canvas height and reaches in to 83% of the canvas width; the notch is fully transparent (the lining behind will show there), its cut edge neat with the faint thickness of the leather paper visible. Warm lamplight from the top-left. No flap, no lock, no tag, no card, no stitching other than the tooling, no monogram, no emblem. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: kutu x %6–86 / y %8–66 tam dolu; sağ kenarda şeffaf yarım ay oyuk (y %29–45, x %83'e kadar); yalnız sol köşelerde pirinç; altın yaldız çift çizgi; yazı/amblem yok; gerçek alfa.
Kullanım: tema kurulunca aynı kutuya kırpılır → ön yüz (`.env-front`); bilet bunun arkasında yan yatar, oyuktan kenarı görünür, kapak açılınca ağızdan sağa kayar.

#### W5 Dil kapak (kapalı, dış yüz)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/flap.png` · 1600×1100 · **Şeffaf zemin**

```
Only the closed end-tab flap of the same ticket sleeve, on the same 1600×1100 canvas and in exactly the same place, on a fully transparent background (the sleeve box is again x 6–86% and y 8–66%, but only the tab is drawn). The tab is folded over the RIGHT end of the sleeve: it is hinged along a softly rolled vertical fold at the sleeve's right edge (x 86% of the canvas), spans the full sleeve height (y 8–66%), and lies flat on the front; its free edge on the left is one soft, rounded point facing LEFT: the edge meets the top and bottom edges at x 74.5% and curves smoothly to a gently rounded tip at x 72%, y 37% (not a sharp arrow, not straight, not scalloped). Material: the same bottle-green embossed leather-grain paper (#1E3A2C), a single gold-tooled line (#B8914B) following its edge about 1.5% inside, a faint contact shade on the tab itself just inside its free edge so it reads as a separate layer, and the two RIGHT corners capped with polished brass corner protectors matching env_front.png. Everything else is fully transparent. Warm lamplight from the top-left. No lock, no plate, no rivet in the middle, no tag, no seal. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: dil x %72–86 / y %8–66; menteşe sağda, yuvarlak sivri uç solda x %72 · y %37; sağ köşelerde pirinç; kilit yok; altı/yanı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapak kutusuna (`72, 8, 86, 66`) kırpılır → kapalı dil; açılışta kilit döndükten sonra sağ kenarındaki menteşede 3B yana açılır (90°'de W6 devralır).

#### W6 Dil kapağın iç yüzü (açıkken)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/flap_in.png` · 600×1300 · **Şeffaf zemin**

```
The inside of the same end-tab flap as flap.png, alone, seen straight on as it lies opened flat to the right of the sleeve, on a fully transparent background: exactly the same outline and proportions as the tab of flap.png (about 0.35 wide : 1 tall) but mirrored horizontally — its straight hinge edge runs along the LEFT side at 16.5% of the canvas width, from 6% to 94% of the height, and its soft rounded point faces RIGHT, its tip at 83.5% of the width at the vertical centre (the free edge meets the top and bottom at about 71.5% of the width). The inside is lined with the same route-red moiré silk (#8C2F39) as env_back.png, with a slim rim of bottle-green leather-grain paper and a hair-fine gold-tooled line along the edge; where the lock passes through, at 64% of the width and 50% of the height, a small round polished brass backing washer with one tiny rivet. Warm lamplight from the top-left. No lock button, no tag. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: menteşe solda, uç sağda; oranı W5'teki dille aynı (≈0,35:1); bordo ipek astar + küçük pirinç pul (%64, %50); gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır, dil yüksekliğine ölçeklenir → kapak 90°'yi geçince kılıfın sağında açık duran iç yüz.

#### W7 Çevirmeli kilit plakası
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/lock_plate.png` · 1600×1100 · **Şeffaf zemin**

```
On the same 1600×1100 canvas as env_front.png and flap.png, in exactly the same place (the sleeve and the tab themselves are NOT drawn here), only the escutcheon plate of a small luggage turn-lock riveted on the tip of the tab, on a fully transparent background: an upright polished brass plate with gently rounded oval ends, spanning x 73.5–78.5% and y 30–44% of the canvas, softly bevelled edges, a fine engraved border line, four small domed brass rivets (one near each end and one at each side), and in its exact centre, at x 76% and y 37% of the canvas, a short horizontal slot opening (dark #11241B inside) through which a turn button passes. Polished, softly aged brass (#B8914B, crisp warm highlights toward #D8BD84, warm brown lows), warm lamplight from the top-left, no green patina, no scratches. No turn button (it is a separate part), no keyhole, no lettering. Everything else fully transparent. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek dikey pirinç plaka x %73,5–78,5 / y %30–44, dört perçin, merkezde (%76, %37) yatay yuva; düğme yok; gerçek alfa.
Kullanım: tema kurulunca aynı tuval konumunda kapağın çocuğu → kapakla birlikte döner.

#### W8 Kilit düğmesi (dönen parça)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/lock_key.png` · 1600×1100 · **Şeffaf zemin**

```
On the same 1600×1100 canvas as lock_plate.png, in exactly the same place (the plate, the tab and the sleeve are NOT drawn), only the turn button of the luggage turn-lock, on a fully transparent background: a horizontal polished brass turn button shaped like a slim rounded oval bar with softly flared ends, spanning x 73.2–78.8% and y 35–39% of the canvas, its long axis perfectly horizontal (the locked position), with a raised domed rivet exactly at its centre at x 76% and y 37% of the canvas (the pivot), a fine ridge along its top face and crisp warm highlights (#B8914B toward #D8BD84) from the warm lamplight at the top-left. It must be perfectly symmetrical around the centre rivet so it can rotate around it. Everything else fully transparent. No plate, no key, no chain. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: yatay simetrik pirinç düğme x %73,2–78,8 / y %35–39; merkez perçin tam (%76, %37); plaka yok; gerçek alfa.
Kullanım: tema kurulunca döner mili (%76, %37) → açılışta 90° dönüp dikleşir ("unlock"); kapakla birlikte döner.

#### W9 Bagaj etiketi (kuşgözü + kırmızı ip)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/luggage_tag.png` · 1600×1100 · **Şeffaf zemin**

```
On the same 1600×1100 canvas as env_front.png, in exactly the same place (the sleeve itself is NOT drawn), only a blank vintage luggage tag hanging from the sleeve, on a fully transparent background: a small round polished brass grommet set in the sleeve at x 67.5% and y 59% of the canvas (its ring about 1.6% of the canvas width across, an open dark centre); a soft twisted route-red cotton cord (#8C2F39) loops through the grommet and hangs straight down to the tag; the tag hangs vertically below the sleeve, its body spanning x 63–72% and y 70–94% of the canvas: a heavy ivory card tag (#F3EBD9, as ticket_paper.png) with its two top corners clipped at 45°, a small brass-reinforced eyelet near its top centre where the cord is knotted, a slim route-red band printed across its lower quarter and a fine gold double line around its edge — the whole tag is otherwise COMPLETELY BLANK (no writing lines, no numbers, no letters). The cord and tag hang naturally under gravity, perfectly upright. Warm lamplight from the top-left. Everything else fully transparent. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: kuşgözü (%67,5, %59); ip dikey; etiket x %63–72 / y %70–94, köşeleri kesik, tamamen boş; kılıf çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca sarkaç mili kuşgözü → açılışın ilk vuruşunda sallanır, kapalı sayfada çok hafif nefes salınımı; home imzasında küçük.

#### W10 Birinci sınıf bilet kartı (boş)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait first-class railway ticket card, alone, seen straight on, on a fully transparent background: the heavy ivory card of ticket_paper.png (#F3EBD9) spanning x 7–93% and y 6–94% of the canvas, its four corners clipped with small concave (inward-rounded) cuts like a classic ticket; a fine brass-foil double border (#B8914B, a crisp metallic shine) inset about 5% from the edge; a small brass-foil art-deco fan (sunburst) ornament at the top centre inside the border, about 20% of the card's width; at 80% of the card's height a horizontal perforated tear line (a neat row of tiny round perforation holes, truly transparent) separating a lower stub, and in the stub, left of centre, one round punched hole about 5% of the card width, truly transparent. Apart from these, the card is COMPLETELY EMPTY paper (the website sets the names, date and venue there in HTML). A hair-fine contact shade on the card's own edge only. Warm lamplight from the top-left. No photo, no flowers, no printing. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: dikey bilet, içe yuvarlak kesik köşeler, pirinç folyo çift bordür, üst ortada küçük yelpaze süsü; %80'de delikli yırtma çizgisi, koçanda zımba deliği (şeffaf); başka her yer boş; gerçek alfa.
Kullanım: tema kurulunca kılıfın içinde 90° yan yatar → açılışta sağa kayarak çıkar, dikleşir, ortaya gelir; home kartı (isimler, tarih, mekân HTML); RSVP gönderilince koçandaki zımba deliğinden pul düşer.

#### W11 Vagon penceresi — portre (home)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/portrait_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A luxury sleeper-carriage window frame, alone, seen straight on, on a fully transparent background: a deep French-polished mahogany surround (#4A2618 with rich warm grain and a glossy sheen) with softly rounded outer corners, lined on its inner edge by a slim polished brass bead (#B8914B, warm highlights toward #D8BD84) and with four small brass screw-heads near its corners; the frame's outer edge spans about x 6–94% and y 6–94% of the canvas. In the middle a portrait photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, nothing over it, its corners rounded like a carriage window with a radius of about 40 px). The frame is a little deeper at the bottom (a narrow brass-edged sill). Warm lamplight from the top-left. No glass, no reflection, no curtain and no blind over the window, no handle. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, ~760×950 (4:5), sol üst ~(120, 150), yuvarlak köşe; maun + pirinç çerçeve; pencerede cam/perde yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → home bilet kartının üstündeki portre ve imza öncesi tanıtım.

#### W12 Sürgülü vagon penceresi (story çerçevesi)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/story_frame.png` · 1000×1400 · **Şeffaf zemin**

```
A sliding sash window of a 1930s sleeper carriage, alone, seen straight on, on a fully transparent background: a French-polished mahogany frame (#4A2618, warm glossy grain) with softly rounded outer corners and a slim polished brass inner bead, spanning about x 6–94% and y 6–94% of the canvas; across the top, above the window and not covering it, a short rolled-up bottle-green leather window blind (#1E3A2C) held by two small brass clips; below the window, on the lower frame rail, a small polished brass sash latch and a short loop of brown leather pull strap. In the middle a portrait photo window exactly 720 px wide and 960 px tall (3:4), its top-left corner at x 140 px, y 220 px, filled with flat pure green #00FF00 (no texture, no shading, nothing over it, corners rounded with a radius of about 36 px). Warm lamplight from the top-left. No glass, no reflection, no raindrops, no curtain over the window. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, ~720×960 (3:4), sol üst ~(140, 220); üstte sarılı yeşil deri perde pencereye binmiyor; altta pirinç mandal + deri kayış; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'deki üç an (sol–sağ–sol): kaydırırken foto camın ardında manzara gibi yana akar, perde açılışta CSS maskeyle yukarı çekilmiş gibi açılır; home hikâye tanıtımı.

#### W13 Gözlem vagonu panorama penceresi (mekân)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/venue_frame.png` · 1600×1100 · **Şeffaf zemin**

```
A wide panoramic observation-carriage window frame, alone, seen straight on, on a fully transparent background: a French-polished mahogany frame (#4A2618, warm glossy grain) with gently rounded outer corners, an inner polished brass bead (#B8914B, warm highlights toward #D8BD84), small brass screw-heads evenly spaced along it, and a slim brass-edged sill along the bottom; the frame's outer edge spans about x 6–94% and y 6–94% of the canvas. In the middle a landscape photo window exactly 1320 px wide and 880 px tall (3:2), its top-left corner at x 140 px, y 100 px, filled with flat pure green #00FF00 (no texture, no shading, nothing over it, corners rounded with a radius of about 40 px). No mullion or bar across the window. Warm lamplight from the top-left. No glass, no reflection, no curtain. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, ~1320×880 (3:2), sol üst ~(140, 100); ortada kayıt/çubuk yok; maun + pirinç; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te son durak (mekân fotoğrafı), foto soldan sağa "trenden görülen manzara" gibi kayarak yerleşir.

#### W14 Köşe süsü (pirinç köşe + kurutulmuş çiçek)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A restrained, elegant corner ornament growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: a slim polished brass art-deco corner bracket (two straight arms meeting at a right angle in the top-left, ending in small stepped deco tips, like the corner fitting of a carriage luggage rack; #B8914B with warm highlights) and, tucked along it, a small spray of dried ivory garden roses (two blooms and a bud, papery petals), a few sprigs of dried pale lavender and silvery eucalyptus, tied with a short route-red velvet ribbon (#8C2F39) whose tail curls downward. Calm and sparse, not a full bouquet. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Warm lamplight from the top-left. No vase, no other colours, no glitter. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: sol üstte pirinç köşe + seyrek kurutulmuş çiçek ve bordo kurdele; sağ alt yarı boş; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca home kartının ve RSVP formunun köşeleri (sağda aynalanır), imzada küçük; kapak sayfasında en fazla bir köşe, asla metnin altında değil.

#### W15 Pirinç bagaj rafı rayı (bölüm ayırıcı)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider made of one polished brass luggage-rack rail, alone, on a fully transparent background: a thin round brass rod running horizontally across x 8–92% of the canvas at the vertical centre, held at each end by a small stepped art-deco brass bracket, and at its exact centre a tiny brass fan (sunburst) ornament; polished, softly aged brass (#B8914B, crisp warm highlights toward #D8BD84) in warm lamplight from the top-left. Fine and elegant. No ropes, no luggage, no net. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: yatay ince pirinç ray, iki uçta deco tutucu, ortada küçük yelpaze; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet ve yolculuk, details program, RSVP formu).

#### W16 Pirinç cep saati (rakamsız kadran)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/pocket_watch.png` · 800×800 · **Şeffaf zemin**

```
A single open antique brass pocket watch, alone, seen perfectly straight on, on a fully transparent background, the round case filling about 62% of the canvas a little above centre: a polished brass case (#B8914B, warm highlights toward #D8BD84) with a fluted bezel, a crown and bow at the top, and a short loop of fine brass chain curling down to the lower right; the dial is plain ivory enamel (#F3EBD9) with twelve tiny brass dots instead of numerals, a small inner track of fine dots and two slender blued-steel hands, no seconds dial. Absolutely no numerals, no Roman numerals, no brand name, no writing on the dial. Warm lamplight from the top-left, a soft reflection on the dome of the crystal. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek cep saati; kadranda rakam/yazı yok (yalnız 12 nokta); kısa zincir; gerçek alfa.
Kullanım: tema kurulunca home davet bandında geri sayımın yanında (akrep/yelkovan yok sayılır, hareket yalnız hafif ışıltı), imzada küçük.

#### W17 Yazısız antika harita paneli (yolculuk / itinerary)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/route_map.png` · 1600×1000 · opak

```
A wide antique hand-engraved map panel, full bleed, seen perfectly flat from above, of an INVENTED countryside (not a real country or region): warm ivory map paper (#F3EBD9) with fine sepia engraved hills shown by hachures, a winding river, a soft coastline along the bottom-right with tiny engraved waves, small forests drawn as clusters of tiny trees, a few tiny engraved villages as clusters of roofs, and a very faint hand-drawn railway line in thin sepia crossing from the left edge to the right edge in gentle curves; soft hand-coloured washes of pale bottle green on the forests and pale route red barely tinting the hills; the paper has a gentle warm tone variation and soft lamplight from the top-left. Absolutely no lettering, no place names, no numbers, no compass rose, no legend, no scale bar, no border text, no grid labels. Calm, low contrast, so a thin red route line and small labels drawn later by the website stay readable. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: uydurma kır haritası, soluk ve sakin; hiçbir yazı/rakam/pusula/ölçek yok; tam taşma.
Kullanım: tema kurulunca home "yolculuk" bölümü ve details "The itinerary" yapışkan haritası; rota çizgisi ve istasyon noktaları sitenin UI çizgisi (kaydırmayla çizilir).

#### W18 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, warm lamplight from the top-left. No other object. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. (Make three files, the same light and scale: 1 = one soft rounded puff of white locomotive steam, soft and billowing, its edges fading into true transparency (real partial alpha, not a hard outline), faintly warm-lit from the top-left; 2 = one tiny round punched-out disc of heavy ivory ticket card (#F3EBD9), seen slightly tilted, its cut edge showing the card's thickness, blank; 3 = one single dried ivory garden-rose bud with two dried leaves and a short sprig of pale lavender.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (buhar, zımba pulu, kurutulmuş gonca); buharın kenarı yumuşak gerçek alfa; kenara değmiyor.
Kullanım: tema kurulunca açılışın sonunda (bilet dikleşirken) süzülen nesneler — buhar soldan sağa sürüklenir, pullar düşer, gonca döner; RSVP gönderilince zımba pulları.

#### W19 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic luxury product photography, warm lamplight from the top-left with crisp warm highlights on brass: the closed long bottle-green leather ticket sleeve of env_front.png with its right-end tab of flap.png, the brass turn-lock of lock_plate.png and lock_key.png in its locked horizontal position, and the blank ivory luggage tag of luggage_tag.png hanging on its red cord, lying slightly below the centre on a polished mahogany carriage table partly covered by the faint ivory antique map paper of page_ground.png; at the left a small spray of dried ivory roses and lavender tied with route-red velvet ribbon (as corner_spray.png); at the right the open brass pocket watch of pocket_watch.png with its blank numeral-free dial and a blank ivory first-class ticket (as card_small.png) peeking from under the sleeve; behind, softly out of focus, the warm glow of a carriage lamp and dark green upholstery. The top 20% of the image is calm and soft (only out-of-focus warm light). This image is cropped to 1200×630 for link previews: keep the whole sleeve and tag visible with at least 5% empty margin below the tag. No people. No text, letters, numbers, monograms, logos or watermarks (the tag, ticket and watch dial are blank).
```
Kontrol: kılıf + kilit + etiket bütün, etiketin altında ≥%5 boşluk; etiket/bilet/kadran boş; üst %20 sakin; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım) ve katalog kapağı yedeği.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Beş fotoğrafta **aynı kurgu çift**: her prompt aynı tanımı tekrarlar (GPT 2.1'i referans alır). Ünlü, model ya da
tanınmış birine benzerlik yok; yüzler sıradan ve doğal. Hepsi opak JPG.

#### 2.1 Ana portre (bilet penceresi + davet yanında)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5) · opak

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin, standing at the open door of an elegant vintage sleeper carriage on a quiet station platform at golden hour: groom in a dark bottle-green velvet suit, bride in an ivory silk gown with a short veil, close and smiling, three-quarter length, faces in the upper third. Brass handrails, warm lamp light, soft steam in the background. Bottle green, brass and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 2.2 Pencere 1 — "Where our journey began"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_1.jpg` · Dikey (1024×1365, 3:4) · opak

```
The same fictional couple as hero_portrait.jpg (a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin), in smart travel clothes, vertical 3:4, sitting opposite each other in a vintage dining car by the window, laughing over two cups of coffee, warm table lamp, countryside blurred outside. Photorealistic, same palette and grain. No text, no logos.
```

#### 2.3 Pencere 2 — "A yes between two stations"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_2.jpg` · Dikey (1024×1365, 3:4) · opak

```
The same fictional couple as hero_portrait.jpg (a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin), in autumn coats, vertical 3:4, a proposal moment on a quiet country station platform at dusk, he on one knee, she with hands over her mouth, a vintage carriage and warm lamps behind them. Photorealistic, same palette and grain. No text, no signs.
```

#### 2.4 Pencere 3 — "Next stop: forever"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_3.jpg` · Dikey (1024×1365, 3:4) · opak

```
Vertical 3:4 close-up of the same fictional couple's hands (her warm olive skin, his light-brown skin; no faces): her hand with a simple engagement ring resting on a vintage leather travel case, his hand gently over hers, beside two first-class tickets with blank faces (no printing), soft window light. Photorealistic, same palette and grain. No text, no numbers.
```

#### 2.5 Mekân
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 3:2) · opak

```
Landscape 3:2: a fictional grand historic station hall turned wedding venue at dusk, iron and glass atrium roof, long tables with ivory flowers and brass candle holders, a vintage bottle-green carriage parked along the platform, warm lights. No people, no signs, no text, no clock numerals. Photorealistic, same palette.
```

---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). `'orient-express-voyage'` bloğu **var** ama eski
> zeminleri (`print/invitation_front_5x7.png`, `print/invitation_back_5x7.png`, 18–20 Ekim görünümü) gösteriyor; yeni
> zeminler **yeni dosya adlarıyla** istenir, eski dosyalar tema yeniden kurulana kadar yerinde kalır.
> **Ölçü:** **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (154×216 mm,
> oran 0,713) aynı sayfadan yanlardan ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların
> %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema yeniden kurulunca (G425) `layouts.ts` `'orient-express-voyage'` bloğunda `sources` → `{ front:
>    'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' }`; `composed` aynı kalır (`{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`).
> 2. `front`/`back` kutularını görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme orient-express-voyage` ve `node scripts/print-sample.ts
>    --theme orient-express-voyage --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the heavy ivory ticket card of ticket_paper.png (#F3EBD9). Across the top, between 9% and 91% of the width, an art-deco brass-foil header (#B8914B, crisp metallic shine): a small fan (sunburst) ornament at the centre with fine double rules running out to both sides and ending in small stepped deco tips, and at each end of the rules a tiny sprig of dried ivory rose and lavender; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 93% and 96% of the height and from 14% to 86% of the width, a fine brass-foil rule with a neat row of tiny perforation dots beneath it, like the tear line of a ticket. A hair-fine brass-foil double frame line runs around the sheet about 4% inside the trim (inside the 8% side margins it is the only element, and it never crosses the empty area). The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm card (the names, date and venue are set there): no ornament, no line, no petal, no shadow, no stain in it. Warm lamplight from the top-left. Only ivory, brass and a touch of route red (#8C2F39) in the rose ribbon. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; deco başlık yalnız üstte (%17'nin üstünde), delikli çizgi yalnız altta; çerçeve çizgisi boş alana girmiyor; yazı/QR yok.

#### P2 — Arka yüz
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same heavy ivory ticket card, only a small brass-foil art-deco fan ornament with short double rules at the top centre (between 32% and 68% of the width), its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY card (a schedule and a QR code are set there): no ornament, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı karton; yalnız üst ortada küçük yelpaze süsü (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a polished mahogany carriage table with an ivory linen runner and a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a polished mahogany carriage table with an ivory linen runner, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a polished mahogany carriage table with an ivory linen runner, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a polished mahogany carriage table with an ivory linen runner, slightly right of center and rotated about 8 degrees, surrounded at the edges by a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a bottle-green leather carriage seat with a brass reading lamp and a china teacup; a small arrangement of a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 25`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a polished mahogany carriage table with an ivory linen runner, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a polished mahogany carriage table with an ivory linen runner, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a polished mahogany carriage table with an ivory linen runner, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a polished mahogany carriage table with an ivory linen runner: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a polished mahogany carriage table with an ivory linen runner: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a polished mahogany carriage table with an ivory linen runner, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a polished mahogany carriage table with an ivory linen runner, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a polished mahogany carriage table with an ivory linen runner: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Orient Express yeniden tasarım (2026-10-24)

> Kullanıcı (2026-10-23/24): 21'den itibaren her tasarım "çok iyi bir profesyonel tasarımcının elinden çıkmış gibi"; kendine
> özgü bileşen, hareket ve ses; "cesur ve yaratıcı ol". 25'in bugünkü sitesi (PAKET 5R: yeşil deri bilet kılıfı + çevirmeli
> kilit + bagaj etiketi + harita kâğıdı) birkaç yeniden kurulumun yamasıdır, çıta değildir. PAKET 8 tasarımı baştan GPT'ye
> çizdirir (K21): önce **W1** tasarım panosu, sonra aynı sohbette panodan türeyen **W2** parçaları (24 dosya). Claude yalnız
> keser, maskeler, ölçekler, ışık verir ve HTML/CSS/JS kurar; çizmez. Bu bölüm dosyanın başındaki "Instructions for GPT"
> notunun ve PAKET 5R'nin yerini alır.
>
> Claude için notlar:
> - W1'in kayıt satırı bilerek kalın değil: yol `mockups/` altında olduğu için `kit_check` / `gpt_yerlestir` orada yeşil ekran
>   arar. Panoyu GPT doğrudan commit eder; `gpt_yerlestir`'e verilmez.
> - W1 demo metni `content.demo.json` ile aynı: Amelia & Rafael; September 25, 2027; Palazzo Ferrovia, Venice; RSVP son günü
>   August 1, 2027; program 3:30 / 4:00 / 5:30 / 7:00 / 9:00 PM; story başlığı "Where our journey began".
> - Dosya adları bilerek PAKET 5R'dekilerden farklı (page_ground, ticket_paper, env_*, flap*, lock_*, luggage_tag,
>   card_small, *_frame, corner_spray, divider, pocket_watch, route_map, accent_*, web_hero): `gpt_is_listesi` aynı yolda
>   dosyadaki ilk prompt'u alır, eski PAKET 5R prompt'u kazanırdı. Eski parçalar silinmez; tema yeniden kurulana kadar canlı
>   site onları kullanıyor.
> - Foto pencereleri yeşil değil, **şeffaf açıklık** (21 TESLİM dersi); maske kapalı ceviz-pirinç halkanın içindeki şeffaf
>   bölgeden çıkarılır. `cabin_window` üç iş görür: açılış penceresi, home portresi, story koridor pencereleri (açıklık ≈4:5;
>   story'nin 3:4 fotoğrafları `cover`).
> - İnce şeritler (pervaz-tutamak, kakma ayırıcı, emaye tabela) 3:2 tuvalde ortada bant olarak istenir; Claude kırpar ve sol uç ·
>   tekrar eden orta · sağ uç diye keser. `menu_card` dikey 3 dilim (22 `card_gilt` gibi). Bütün ölçüler GPT'nin yerel
>   tuvalleri (1024×1024, 1024×1536, 1536×1024); pano ≈1908×824.
> - Poster katmanları (W2.4–W2.6) bilerek yan ve alt kenara taşar (yatay döngü). Yatay dikiş kalırsa Claude ayna-döşeme ya da
>   kenar çapraz geçişiyle giderir (piksel boyamadan). Hareket: gök sabit; tepeler, tepeler ve kavaklar artan hızla
>   `translateX` döngüsü; yakın katmana hareket sırasında CSS bulanıklığı. Perdenin kenarından sızan şafak çizgisi, aplik ışık
>   halesi, vagon sallantısı, RSVP zımba deliği (yuvarlak CSS maskesi) ve details'teki dikey pirinç bağlantı çizgisi sitenin
>   ışık/UI işidir, çizim değildir.
> - Açılış nesnesi zarf değil, **perdesi inik kompartıman penceresi**. START HERE ve paneldeki açılış adı ("wallet" / "Wallet")
>   entegratörde "window blind" / "Blind" olarak güncellenmeli; `DESIGN_BRIEF.md` (font, palet, açılış, motifler) entegratörde
>   güncellenir. Paylaşım (og) görseli ayrıca istenmedi: Claude `poster_*` + `cabin_window` + yarıya kalkmış `cabin_blind`'dan
>   kurar. PAKET 6R baskı zeminleri eski görünümde kalır (yelpaze süsü 06'ya yakın); gerekirse ayrı pakette yenilenir.
> - Ses dosyası yok: aşağıdaki ipuçlarını Claude sentezler (AGENTS şart 9); ilk dokunuştan önce sessiz.

### Sanat yönetimi — "The window seat"

- **Signature.** The guest is a passenger in the private compartment of an invented 1930s luxury sleeper train, and every
  page is a window. Inside the train everything is photographed for real (figured walnut with pale satinwood marquetry and
  brass stringing, polished brass fittings, a ribbed cypress-green leathercloth blind, ivory linen menu cards, cream enamel
  station signs). **Outside every window the world is a living 1930s railway travel poster**: airbrushed, layered lithograph
  planes (indigo-to-apricot dawn sky, lilac alpine peaks, sage hills with cypress rows, a terracotta hill village, a stone
  viaduct, tall poplars) that slide past at different speeds. Real objects inside, a painted world outside: that is 25.
- **Opening = the compartment window, blind down.** Night: the names on walnut between two glowing brass sconces; a tall
  walnut-and-brass window, its green blind pulled down and buttoned to the sill by a leather tab; a hairline of dawn leaks round
  the blind. Tap → the brass press-stud pops, the tab flicks up → the blind springs up onto its roller and knocks the pelmet →
  behind the glass the poster landscape is already moving and accelerates like a departing train (sky still, peaks slow, hills
  faster, poplars fastest; 1 px carriage sway) → steam streams across the top of the glass → the sconces dim as dawn light
  sweeps over the walnut → the camera pushes through the window (frame and wall grow past the screen edges) and the moving
  landscape becomes the home hero, the names now in its sky. Every piece moves on its own; nothing is a plain fade.
- **Inside.** Home: full-bleed poster view with the names as its headline above a walnut sill with a brass handrail; the
  portrait in the same carriage window; the invitation on a dining-car menu card; a countdown on brass-bezelled **flip-card
  tiles** that flip every second. Story: a **corridor of windows** — a swipe carousel along the walnut corridor wall, each photo
  in a carriage window and drifting inside it slower than the windows move (scenery passing). Details "The itinerary": the day
  as **cream enamel station signs** joined by a brass rail, each sign gliding in from the right like a station arriving, solid
  brass pictograms; the venue in a wide carriage window. RSVP: "Kindly reply" on the menu card; on send a **conductor's ticket
  punch** slides in and clips a round hole in the card's corner, the paper disc tumbles, a puff of steam. Page change: a short
  "tunnel" (a dark sweep across the screen). Reduced motion: everything still, straight cuts.
- **Not the others.** 21 owns roses, velvet, torn paper, the gold oval and wax seals; 22 the moon, the lake and night water;
  23 the jewel box, pearls and gems; 24 curtains, tassels and the torn ticket stub; 06 Art Deco fans and sunbursts; 27 doors and
  lanterns; 29 stars; 04 stamps, postmarks and airmail letters; 12 and the old 25 luggage tags; 35 straps and buckles; 10
  grapes. None of them appears. No real railway: no company or train names, crests, monograms, liveries (no navy-and-gold
  carriage sides), real posters or frosted figurative glass panels.
- **Palette.** Inside: deep walnut `#2A1A10` · walnut `#5B3A22` · satinwood `#D9B77E` · brass `#B88A3D` · bright brass
  `#E6C47A` · ivory linen `#F4ECDC` · cypress green `#2F4A3B` · enamel cream `#F1E6CF`. Outside (poster): indigo `#2E3A5F` ·
  lilac `#A8A6C9` · apricot `#F2AE7C` · sage `#97AE8A` · terracotta `#C46F4B`.
- **Type (Google Fonts; no other design uses them; all answered 200 on 2026-10-24).** **Syncopate** 700/400 — names, page
  headings, station names and letter-spaced labels: the wide streamline capitals of a 1930s travel-poster headline (not
  theatrical, not Didone; very wide, so Claude fits the names on two lines with a clamp). **Yellowtail** — only the ampersand
  and short script accents ("Our story", "Bon voyage"), ≥ 28 px, like a hand-painted poster slogan. **Vollkorn** 400/600 +
  italic — body, times, captions and the form: a warm timetable-and-menu book serif.
- **Sound (Claude synthesises; silent until the first tap).** (1) brass press-stud pop; (2) spring-roller whirr ending in a
  soft wooden knock; (3) a low two-beat rail rhythm (clickety-clack) fading in with the departure and out after a few seconds;
  (4) a distant, mellow two-note steam whistle as the camera passes through the window; (5) a tiny flip-tile clack for the
  countdown, only while it is on screen; (6) the ticket punch's "clip" and a small brass bell on RSVP send.

**Instructions for GPT (send before the first image):**
```
You are the art director and the still-life photographer of a luxury wedding stationery house, designing a mobile wedding website about the golden age of luxury rail travel, called "Window Seat". The guest is a passenger in the private compartment of an INVENTED 1930s luxury sleeper train, and every page is a window. Two techniques, on purpose: everything INSIDE the train is photographed for real — figured walnut panelling with pale satinwood marquetry and thin brass stringing (#2A1A10, #5B3A22, #D9B77E), polished brass fittings (#B88A3D, highlights #E6C47A), a deep cypress-green ribbed leathercloth blind (#2F4A3B), heavy ivory linen card (#F4ECDC), cream enamel signs (#F1E6CF) with a cypress-green border; everything OUTSIDE the windows is a 1930s lithographic railway travel poster — flat, softly airbrushed, layered planes with gentle gradients and a fine print grain, no outlines, no photographic detail (a dawn sky from indigo #2E3A5F through lilac #A8A6C9 to apricot #F2AE7C, sage hills #97AE8A, dark cypress rows, terracotta roofs #C46F4B). Never copy a real poster, artist, railway or train. The folder name of this design contains the name of a real train: that name, any railway company name, logo, crest, monogram, livery (no navy-and-gold carriage sides) or ticket design must never appear. Never: roses or flowers as decoration, velvet or drapes, curtains or tassels, the moon, stars, lakes or water, lanterns, doors, Art Deco fans or sunburst rays, pearls or gems, stamps, postmarks, letters, luggage tags, wax seals, straps with buckles, torn tickets. First you draw a design board of five phone screens (W1); then, giving that board as the reference image of every image, you make the production parts (W2): one object per image, one soft warm light from the upper left (on the poster landscapes: dawn light from the left), no cast or drop shadow, no glow or halo outside the object, no text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and, unless its prompt says otherwise, the object stays at least 5% inside every edge.
```

#### W1 — Tasarım panosu (5 telefon ekranı; demo metin serbest, YALNIZ referans)
Kaydet (W1): `collections/25_Orient_Express_Voyage/assets/gpt/mockups/design-board.png` · yaklaşık 1908×824 (≈2,3:1) · opak · kit_check dışı

```
Use case: ui-mockup. Create a high-fidelity art-direction board of FIVE mobile wedding-website screens, each exactly 390 by 844 in proportion, arranged side by side in one horizontal row with even gaps and generous margins on a soft warm putty-grey studio background (the whole board about 2.3:1). The five screens must look like one finished, coherent, best-selling premium product by a top luxury stationery designer: rich, tactile, romantic, classic and bold; never minimal, never cheap, never clip-art. The attached photographs are ONLY the identity and styling reference for the fictional couple Amelia and Rafael (same faces, his dark green velvet suit, her ivory silk gown); use them for the photos inside the screens.

THE CONCEPT — "the window seat": the guest travels in the private compartment of an invented 1930s luxury sleeper train (no real railway, no real train, no names, no logos, no crests, no livery), and every page is a window. Inside the train everything is photographed for real: French-polished figured walnut panelling (#5B3A22, deep #2A1A10) with fine marquetry (pale satinwood #D9B77E laurel-and-vine scrolls and thin brass stringing lines), polished brass fittings (#B88A3D, highlights #E6C47A), a deep cypress-green (#2F4A3B) ribbed leathercloth blind, heavy ivory linen menu cards (#F4ECDC), glossy cream enamel station signs (#F1E6CF) with a cypress-green border. Outside every window the world is a living 1930s railway travel poster: an airbrushed, layered lithograph landscape at dawn painted in flat, softly graded planes with a fine print grain — a sky from deep indigo #2E3A5F through lilac #A8A6C9 to an apricot glow #F2AE7C with long thin cloud bands, pale lilac-blue snow-capped alpine peaks, rolling sage hills #97AE8A with rows of dark cypress trees, one hill village with terracotta roofs #C46F4B, a small arched stone viaduct, tall dark poplars in the foreground. NO roses or flowers as decoration, NO velvet or drapes, NO curtains or tassels, NO moon, NO stars, NO lakes or water, NO lanterns, NO doors, NO Art Deco fans or sunburst rays, NO pearls or gems, NO stamps, postmarks, letters or luggage tags, NO wax seals, NO torn tickets.

TYPOGRAPHY: the couple's names, page headings and station names in wide, bold, geometric streamline capitals with generous letter-spacing, like the headline of a 1930s railway travel poster; the ampersand and very short accents in a flowing vintage hand-painted brush script; body text, times and captions in a warm, sturdy old-style book serif with italics; small labels in widely letter-spaced capitals. Brass and ivory type on walnut and on the poster sky, deep walnut type on ivory and cream.

Screen 1 — the opening (the closed blind): night inside the compartment, full-bleed walnut panelling with a marquetry inlay band above and below the names. At the top, small spaced capitals "TOGETHER WITH THEIR FAMILIES", then "AMELIA & RAFAEL" in the wide streamline capitals in brass, the ampersand in the brush script. In the middle a tall carriage window with softly rounded corners (about 4 wide : 5 tall), framed by a walnut moulding with a fine satinwood line and a slim polished brass inner bead, a walnut pelmet box across its top, and a walnut sill with a polished brass handrail below it; the window is completely covered by a pulled-down deep cypress-green ribbed blind with a polished brass bottom bar; a short leather tab with a brass press-stud fastens the bar to a small brass stud on the sill; a hairline of warm apricot dawn light leaks around the edges of the blind. A small polished brass wall sconce with an upward fluted opal-glass tulip shade glows warmly on each side of the window. Below the sill: "SEPTEMBER 25, 2027 · VENICE" in small spaced capitals and "Tap to raise the blind" in italic serif.

Screen 2 — home: the top 58% of the screen is the view outside, edge to edge: the layered travel-poster dawn landscape, the foreground poplars slightly streaked as if rushing past; across its sky "AMELIA & RAFAEL" very large in the wide streamline capitals in ivory, the brush-script ampersand in brass, and "SEPTEMBER 25, 2027 · PALAZZO FERROVIA · VENICE" small beneath; across the bottom of the view a walnut window sill with a polished brass handrail on two small brackets. Below it, on ivory linen: the couple's portrait in a small walnut-and-brass carriage window frame (the same window family as screen 1), set off-centre to the left and overlapping the sill; beside it "Together with their families" and "request the pleasure of your company" in serif; a countdown of four flip-card tiles in polished brass bezels (near-black lacquered flaps split by a fine horizontal gap, ivory numerals) reading "336 DAYS", "06 HOURS", "42 MINUTES", "18 SECONDS"; a cypress-green button with a thin brass edge "Kindly reply".

Screen 3 — story: walnut corridor panelling with marquetry; at the top small capitals "THE JOURNEY SO FAR" and the brush-script heading "Our story"; a horizontal carousel of tall carriage windows along the corridor wall: the centre window large and straight, holding a photograph of the couple laughing over coffee at a dining-car table (as the attached story photo), the edges of the previous and next windows visible at the screen sides, each showing a sliver of the poster landscape; under the windows a polished brass corridor handrail on a walnut sill runs the full width; below it the caption "Where our journey began" in italic serif, "I / III" in small capitals and two small round brass arrow buttons; one thin wisp of white steam drifts across the top.

Screen 4 — details: ivory linen page; the heading "THE ITINERARY" in the wide streamline capitals with "Saturday, September 25, 2027" in italic; down the page a thin vertical polished brass rail joins five glossy cream enamel station signs with a cypress-green border and a tiny brass screw at each end, each sign with a small solid polished-brass pictogram at its left (an open pocket watch, two interlocked rings, two champagne coupes, a plate with a fork and a knife, a pair of 1930s dancing shoes): "3:30 PM · WELCOME DRINKS · The station hall", "4:00 PM · THE CEREMONY · The glass atrium", "5:30 PM · COCKTAIL HOUR · The garden platform", "7:00 PM · DINNER · The grand salon", "9:00 PM · DANCING · The ballroom"; below them "PALAZZO FERROVIA · VENICE, ITALY", "DRESS CODE · Black tie optional" and a slim outlined cypress-green button "View map".

Screen 5 — RSVP: at the top a wide walnut-and-brass carriage window (landscape, about 3:2) showing the travel-poster landscape; below it a generous, thick ivory linen dining-car menu card with a fine polished-brass-foil double border and a small brass-foil laurel garland at its top: the heading "KINDLY REPLY" in the streamline capitals, "by August 1, 2027" in italic, then a real, readable form: a "Your name" field, "Will you join us?" with two round options "Joyfully accepts" and "Regretfully declines", "Number of guests" select showing "2", "Your meal preference" select showing "Fish", and a full-width cypress-green button "Send reply" with ivory text and a thin brass edge; at the card's upper-right corner a polished nickel-and-brass conductor's ticket punch is just clipping a small round hole, a tiny punched paper disc falling, and a soft puff of white steam.

Use exactly this English sample text and no other words; do not write the design's name anywhere. Each screen has its own composition (not all centred). No device bezels, no phone frames, no hands, no laptop, no marketing collage, no logos, no railway names or crests, no watermarks, no captions outside the screens. This is a design reference board, not a screenshot.
```
Kontrol: 5 ekran yan yana, her biri ~390:844; 1. ekranda perdesi inik dikey pencere (≈4:5), deri dil + çıtçıt, iki yanda pirinç aplik, perde kenarında ince şafak çizgisi; 2. ekranda tam genişlik **poster** peyzajı (çivit→kayısı gök, leylak dağlar, selvili tepeler, kavaklar) ve gökte isimler, altında ceviz pervaz + pirinç tutamak, 4 çevirmeli karo; 3. ekranda koridor pencereleri karuseli + tutamak; 4. ekranda emaye istasyon tabelaları + dolu pirinç piktogramlar; 5. ekranda fildişi menü kartında okunur form + bilet zımbası; içeride fotoğraf gerçekliği, dışarıda poster tekniği; gerçek demiryolu adı/arması/livresi yok, tasarımın adı yazılmamış; gül/kadife/ay/yıldız/su/fener/kapı/yelpaze/perde-püskül/inci/pul/bagaj etiketi/mühür yok. Metindeki küçük harf bozuklukları kabul (yalnız referans).
Kullanım: Claude'un yerleşim, tipografi ölçeği ve renk referansı; pencere/perde oranı, kartların ve tabelaların konumu buradan ölçülür.

### W2 — Parçalar (panodan kesilir; HER parçada `design-board.png` referans görsel; YAZI YOK)

Ortak kurallar: tek görselde tek nesne · şeffaflar gerçek alfa · zemine düşen gölge yok · nesnenin dışında ışıma/hâle yok (site
ekler) · içerideki nesnelerde ışık sol üstten, poster katmanlarında şafak ışığı soldan · oran önemli, piksel değil · ağaç,
tepe, nervür, vida **sayısı** önemli değil, sayı için yeniden üretme · W2.4–W2.6 dışında hiçbir parça kenara değmez.

#### W2.1 Ceviz kaplama — dikişsiz doku
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/walnut_tile.png` · 1024×1024 · opak · dikişsiz

```
Production texture for the "Window Seat" wedding website (give design-board.png as the style reference), the walnut panelling of the attached design board. A seamless, tileable square texture of French-polished figured walnut veneer seen perfectly flat and straight on: warm brown #5B3A22 with darker #2A1A10 figure, a fine, calm, flowing grain with a little soft burr figure, a deep satin gloss. Perfectly even lighting with no hotspot, no vignette and no gradient, so that four copies placed side by side join invisibly (the left edge continues the right edge, the top edge continues the bottom edge). No inlay, no marquetry, no brass, no joints between veneer leaves, no knots, no scratches, no objects. No text, letters, numbers, logos or watermarks.
```
Kontrol: eşit ışık, vinyet yok; 2×2 dizince dikiş seçilmiyor (küçük farkı Claude ofsetle giderir; yalnız bunun için yeniden üretme); kakma/pirinç yok; opak.
Kullanım: açılış sayfası duvarı (pencerenin çevresi), story koridoru, home/details koyu bantları, RSVP zemini; `background-repeat` + açılışta CSS şafak ışığı süpürmesi.

#### W2.2 Fildişi keten karton — dikişsiz doku
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/linen_tile.png` · 1024×1024 · opak · dikişsiz

```
Production texture for the "Window Seat" wedding website (give design-board.png as the style reference), the ivory linen card of the attached design board. A seamless, tileable square texture of heavy ivory linen-finish card (#F4ECDC) seen perfectly flat: a fine, even crosshatched linen emboss and a soft paper tooth with a barely visible warm variation. Perfectly even lighting, no vignette, no gradient, no hotspot; the left edge continues the right edge and the top edge continues the bottom edge. Calm enough for small dark-brown text to read anywhere. No print, no border, no fold, no stain, no objects. No text, letters, numbers, logos or watermarks.
```
Kontrol: sakin fildişi keten dokusu; eşit ışık; dikiş seçilmiyor; baskı/çizgi yok; opak.
Kullanım: home içerik bölümü, details sayfa zemini; koyu kahve metin bunun üstünde okunur.

#### W2.3 Poster göğü — şafak (sabit arka katman)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/poster_sky.png` · 1024×1536 · opak

```
Production background for the "Window Seat" wedding website (give design-board.png as the style reference), the sky seen through the windows of the attached design board. A full-frame vertical (2:3) painting of a dawn sky in the style of a 1930s lithographic railway travel poster, edge to edge: flat, softly airbrushed horizontal bands — deep indigo #2E3A5F at the top, through dusky lilac #A8A6C9 and a soft rose, to a warm apricot glow #F2AE7C in the lowest third, brightest along the bottom edge; three or four long, thin, softly graded cloud bands drift across the middle, lit apricot on their undersides. A fine, even print grain. Only sky: no sun, no moon, no stars, no rays, no birds, no aircraft, no mountains, no land, no buildings. No text, letters, numbers, logos or watermarks.
```
Kontrol: yalnız gök; üstte çivit, altta kayısı; ince bulut bantları; güneş/ay/yıldız/ışın/kara yok; poster tekniği (fotoğraf değil); opak.
Kullanım: açılış penceresinin ve home hero'nun en arka katmanı (sabit), RSVP'deki geniş pencere; geniş ekranda `cover`.

#### W2.4 Poster dağları — uzak katman (yatay döngü)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/poster_peaks.png` · 1536×1024 · **Şeffaf zemin** (gök yerine)

```
Production layer for the "Window Seat" wedding website (give poster_sky.png and design-board.png as the reference images), the far mountains seen through the windows of the attached design board, in the same 1930s lithographic travel-poster style as poster_sky.png. A long range of snow-capped alpine peaks painted as flat, softly airbrushed planes: pale lilac-blue rock faces (#8EA3C4 to #A8A6C9) with a warm apricot rim light from the left on the ridges and soft white snow caps, a gentle haze toward the base. Everything ABOVE the ridge line is fully transparent (a real alpha channel; the sky is a separate layer). The ridge rises and falls between about 28% and 48% of the image height; below the ridge the mountains run down to the bottom edge of the image as solid, hazy lilac-blue. This layer repeats side by side to scroll past a train window, so it deliberately touches the left, right and bottom edges, and the ridge line meets the left and the right edge at the SAME height and colour, so the right edge continues seamlessly into the left edge. No trees, no buildings, no lake or water, no sun, no clouds. No text, letters, numbers, logos or watermarks.
```
Kontrol: sırtın üstü tamamen şeffaf (gök yok); dağlar alt kenara kadar dolu; iki yan uç aynı yükseklikte (kalan dikişi Claude ayna-döşemeyle giderir); poster tekniği; su/ağaç/bina yok.
Kullanım: uzak katman; pencerelerin ardında en yavaş kayan döngü (`translateX`); açılışta yavaşça hızlanır.

#### W2.5 Poster tepeleri — orta katman (selviler, köy, viyadük)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/poster_hills.png` · 1536×1024 · **Şeffaf zemin** (tepe çizgisinin üstü)

```
Production layer for the "Window Seat" wedding website (give poster_peaks.png and design-board.png as the reference images), the middle distance seen through the windows of the attached design board, in exactly the same 1930s lithographic travel-poster style and dawn light from the left. Gently rolling sage-green hills (#97AE8A, with a few warmer ochre patchwork fields) painted as flat, softly airbrushed planes, with rows and small groups of tall dark cypress trees (#2F4A3B) along the crests, one small hill village of cream walls and terracotta roofs (#C46F4B) with a slim bell tower on one hilltop, and a low arched stone viaduct crossing a fold between two hills. Everything ABOVE the hill line is fully transparent (a real alpha channel). The hill line rolls between about 42% and 62% of the image height; below it the land runs down to the bottom edge of the image as solid colour. This layer repeats side by side, so it deliberately touches the left, right and bottom edges, and the hill line meets the left and the right edge at the SAME height and colour, so the right edge continues seamlessly into the left edge. No people, no animals, no train, no lake, river or sea, no grapes, no signs. No text, letters, numbers, logos or watermarks.
```
Kontrol: tepe çizgisinin üstü şeffaf; selvi sıraları, tek köy, kemerli taş viyadük; alt kenara kadar dolu; yan uçlar aynı yükseklikte; poster tekniği; tabela/su yok.
Kullanım: orta katman; orta hızda döngü; story pencerelerinin kenarlarında görünen manzara.

#### W2.6 Poster kavakları — yakın katman (en hızlı)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/poster_poplars.png` · 1536×1024 · **Şeffaf zemin** (ağaçların arası ve üstü)

```
Production layer for the "Window Seat" wedding website (give poster_hills.png and design-board.png as the reference images), the foreground rushing past the windows of the attached design board, in exactly the same 1930s lithographic travel-poster style and dawn light from the left. A low, dark green hedgerow and grassy bank (#2F4A3B to a deep olive) runs along the bottom of the image, its top edge rolling between about 72% and 80% of the image height and solid down to the bottom edge; from it rise five or six very tall, slender Lombardy poplars, unevenly spaced across the width, painted as flat, softly airbrushed dark green spires with an apricot rim light on their left sides, the tallest reaching about 18% from the top. Everything else — above the hedge and between the poplars — is fully transparent (a real alpha channel). The layer repeats side by side, so it deliberately touches the left, right and bottom edges, the hedge meets both side edges at the same height, and no tree is cut by the left or right edge. No telegraph poles or wires, no fences, no buildings, no people. No text, letters, numbers, logos or watermarks.
```
Kontrol: çit alt kenara kadar dolu; kavakların arası ve üstü şeffaf; yan kenarda yarım ağaç yok; poster tekniği; direk/tel yok.
Kullanım: en yakın, en hızlı döngü (hareket sırasında CSS bulanıklığı); açılıştaki "tren kalkıyor" hızlanmasını taşıyan katman.

#### W2.7 Kompartıman penceresi — çerçeve (açıklık şeffaf)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/cabin_window.png` · 1024×1536 · **Şeffaf zemin, pencere de şeffaf**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the compartment window on screen 1 of the attached design board. ONE tall sleeper-compartment window FRAME, alone, seen perfectly straight on, photographed for real: a French-polished figured walnut moulding (#5B3A22, deep satin gloss) with one fine pale satinwood inlay line (#D9B77E) running round it and a slim polished brass bead (#B88A3D, highlights #E6C47A) along its inner edge, with four tiny brass screw heads near the inner corners. Across the top, a walnut pelmet (the box that hides a roller blind) as wide as the frame, with a thin polished brass rail along its lower edge. Below the window, a walnut sill that projects slightly, with a polished brass handrail on two small brackets along its front and one small round brass press-stud set in the middle of the sill's top surface. Layout on the canvas: the frame spans about 8–92% of the width and 6–90% of the height; the WINDOW OPENING is a tall rectangle with softly rounded corners, about 4 wide : 5 tall, from about 18% to 82% of the width and from about 18% to 70% of the height. The opening is COMPLETELY TRANSPARENT (a real hole in the alpha channel: no glass, no reflection, no blind, no view, nothing inside) and the moulding closes all the way round it without any gap. Everything outside the frame is transparent too. One soft warm light from the upper left. No lamp, no curtain. No cast shadow, no drop shadow, no glow outside the frame. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: açıklık ≈4:5, tamamen şeffaf, ceviz-pirinç halka kesintisiz; üstte perde kutusu (pelmet) + pirinç ray, altta pirinç tutamaklı pervaz + ortada küçük çıtçıt; cam/perde/manzara yok; gerçek alfa.
Kullanım: açılış penceresi (perdenin önünde; poster katmanları açıklıktan görünür); home portresi ve story koridor pencereleri (ölçekli); Claude açıklığı alfadan ölçer, foto maskesini çıkarır.

#### W2.8 Pencere perdesi (inik, stor)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/cabin_blind.png` · 1024×1536 · **Şeffaf zemin**

```
The roller blind of the window in cabin_window.png (give cabin_window.png and design-board.png as the reference images; if your tool allows, edit cabin_window.png so the blind lands exactly in the window, then remove the whole frame, pelmet and sill), alone, on the same 1024×1536 canvas: ONE pulled-down roller blind panel, a plain upright rectangle covering the whole window opening and reaching about 2% of the canvas beyond it on the left, right and top (those edges will hide behind the frame), made of deep cypress-green leathercloth (#2F4A3B) with fine, even horizontal ribs and a soft satin sheen, a touch darker toward its side edges. Along its bottom edge a round polished brass bottom bar (#B88A3D, highlights #E6C47A) with small domed end caps, its lower edge at about 71% of the canvas height, with one tiny brass loop at the centre of the bar. No frame, no pelmet, no sill, no tab, no pattern, no emblem, no light leaking round it (the website adds the dawn light). One soft warm light from the upper left. No cast shadow, no drop shadow, no glow outside the blind. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek dikdörtgen perde, pencere açıklığından biraz büyük; ince yatay nervürlü koyu servi yeşili; altta pirinç çubuk + ortada küçük halka; çerçeve yok; gerçek alfa.
Kullanım: çerçevenin arkasında, peyzajın önünde; açılışta yukarı fırlar (`translateY`, pelmetin arkasına girer, çubuk pelmete vurup bir kez seker); Claude açıklığa oturtur.

#### W2.9 Perde dili (deri + çıtçıt)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/blind_tab.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the small leather tab that fastens the blind to the sill on screen 1 of the attached design board. ONE short upright leather tab, alone, seen straight on: rich dark-brown bridle leather with neatly stitched edges and a softly rounded lower end, about 1 wide : 3 tall, hanging from a small polished brass clamp at its top (where it grips the blind's bottom bar) and ending at the bottom in one round polished brass press-stud socket. It fills about 70% of the image height, centred. One soft warm light from the upper left. No blind, no bar, no sill, no buckle, no strap holes. No cast shadow, no drop shadow, no glow outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek dikey deri dil, üstte pirinç kelepçe, altta çıtçıt; toka/delik yok; gerçek alfa.
Kullanım: perde çubuğunun ortasından pervazdaki çıtçıta iner; dokununca "pop" sesiyle çıtçıttan kurtulur, üst kelepçe ekseninde yukarı savrulur, sonra perdeyle birlikte kalkar.

#### W2.10 Duvar apliği (pirinç + opal cam)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/wall_sconce.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the wall lamps beside the window on screen 1 of the attached design board. ONE small 1930s railway-carriage wall sconce, alone, seen straight from the front, upright: a round polished brass back plate with a fine beaded edge, a short gracefully curved brass arm, and an upward-facing fluted opal-glass tulip shade with a softly scalloped rim, the glass lit from within so the shade itself glows a warm ivory (the light stays on and inside the glass). It fills about 70% of the image height, centred. One soft warm light from the upper left on the brass. No wall, no chain, no candle, no lantern housing. No halo, rays or haze outside the lamp. No cast shadow, no drop shadow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek aplik; abajur içten aydınlık ama dışında hâle yok; fener gövdesi yok; gerçek alfa.
Kullanım: açılışta pencerenin iki yanında (biri aynalı); CSS sıcak hale + hafif titreşim; perde kalkınca ışık kısılır.

#### W2.11 Geniş vagon penceresi — çerçeve (açıklık şeffaf)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/cabin_window_wide.png` · 1536×1024 · **Şeffaf zemin, pencere de şeffaf**

```
Production asset for the "Window Seat" wedding website (give cabin_window.png and design-board.png as the reference images), matching the wide carriage window on screen 5 of the attached design board, from the same family as cabin_window.png (the same walnut, satinwood line, brass bead and screw heads). ONE wide carriage window FRAME, alone, seen perfectly straight on: a French-polished walnut moulding with one fine satinwood inlay line and a slim polished brass inner bead, a slimmer walnut sill along the bottom with a short polished brass handrail on two small brackets, no pelmet. The frame fills about 90% of the image width, centred; the WINDOW OPENING is a landscape rectangle of about 3:2 with softly rounded corners and is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside); the moulding closes all the way round it without any gap. One soft warm light from the upper left. No glass, no reflection, no blind, no curtain, no press-stud. No cast shadow, no drop shadow, no glow outside the frame. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: açıklık ≈3:2, şeffaf, halka kapalı; `cabin_window` ile aynı aile; pelmet yok; gerçek alfa.
Kullanım: details mekân fotoğrafı (soldan "manzara gibi" kayarak yerleşir), RSVP üstündeki manzara penceresi (poster katmanları akar), home story tanıtımı.

#### W2.12 Pervaz + pirinç tutamak (3 dilim, yatay)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/sill_rail.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the walnut sill with the brass handrail under the view on screen 2 and under the corridor windows on screen 3 of the attached design board. ONE long horizontal walnut window sill, alone, seen straight from the front at eye level: a French-polished figured walnut ledge with a softly rounded front edge and one fine satinwood inlay line, and along its front a round polished brass handrail (#B88A3D, highlights #E6C47A) held by one small brass bracket near each end. It is a wide horizontal band about 6:1: it fills about 92% of the image width and sits in the vertical middle of the canvas, with empty transparent space above and below. Between the two brackets the sill and the rail are perfectly straight and uniform — exactly the same at every point — so that the middle can be repeated to any width. One soft warm light from the upper left. No window, no wall, no objects on the sill. No cast shadow, no drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek yatay bant (~6:1) tuvalin ortasında; iki uçta braket, aradaki bölüm her noktada aynı; kenarlara değmiyor; gerçek alfa.
Kullanım: home hero'nun alt kenarı, story koridorunda pencerelerin altı; Claude sol uç · orta · sağ uç diye keser, ortayı ekran genişliğine uzatır.

#### W2.13 Kakma ayırıcı (marküteri şerit)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/inlay_divider.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the marquetry inlay bands of the attached design board. ONE slim horizontal marquetry inlay strip used as a section divider, alone, seen perfectly flat and straight on: a narrow band of French-polished walnut with a delicate running laurel-and-vine scroll inlaid in pale satinwood (#D9B77E), edged above and below by a hair-thin polished brass stringing line, tapering to a fine point at each end, with one small satinwood diamond-shaped inlay at its exact centre. It spans about 80% of the image width and is only about 4–5% of the image height, perfectly level in the vertical middle of the canvas, with plenty of empty transparent space above and below. One soft warm light from the upper left. No fan, no sunburst, no flowers in vases, no brass hardware. No cast shadow, no drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: ince yatay kakma şerit, ortada baklava, uçlar sivri; yelpaze/güneş ışını yok; kenarlara değmiyor; gerçek alfa.
Kullanım: başlık altları ve bölüm ayırıcıları (açılışta isimlerin üstü/altı, home, story, details, rsvp); Claude dar şerit olarak kırpar; üstünden ışık süpürmesi.

#### W2.14 Yemekli vagon menü kartı (3 dilim, dikey)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/menu_card.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give linen_tile.png and design-board.png as the reference images), matching the ivory menu card on screen 5 of the attached design board. ONE tall dining-car menu card of heavy ivory linen-finish card (#F4ECDC, fine crosshatched linen emboss), alone, portrait 2:3, filling about 90% of the image height, centred, seen perfectly straight from the front, with crisp straight edges and softly rounded corners. Inside it a fine DOUBLE border of polished brass foil (#B88A3D, a crisp metallic shine) runs parallel to the edges. The card is designed so the website can cut it into three horizontal slices and stretch the middle one: TOP band (the top 18% of the card): one small centred brass-foil ornament — a short laurel garland tied at its centre with a tiny bow, flanked by two fine horizontal hairlines; MIDDLE band (from 18% to 84% of the card's height): plain ivory linen with ONLY the two straight vertical lines of the double border running down each side, exactly the same at every height, nothing else; BOTTOM band (the last 16%): the double border turns the corners and closes, with one small centred brass-foil diamond above it. No form fields, no photo window, no punched hole. One soft warm light from the upper left. No cast shadow, no drop shadow, no glow outside the card. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: orta bant (%18–84) düz ve tekrarlanabilir, yalnız iki yanda düz çift çizgi; üstte defne çelengi, altta küçük baklava; yan kenarlar dik; gerçek alfa.
Kullanım: home davet kartı, details blokları (mekân, kıyafet, travel & stay, menü, registry, SSS), RSVP formu; Claude üst · orta · alt diye keser; RSVP'de zımba deliği CSS maskesiyle sağ üst köşeye açılır.

#### W2.15 Emaye istasyon tabelası (3 dilim, yatay; boş)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/enamel_sign.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the station signs on screen 4 of the attached design board. ONE blank vintage enamel station nameboard, alone, seen perfectly straight from the front, photographed for real: a long horizontal plate of glossy cream vitreous enamel (#F1E6CF) with softly rounded corners, a deep cypress-green enamel border band (#2F4A3B) about 8% of the sign's height wide all round, a hair-thin cream line just inside the border, and one small polished brass screw head near each end at mid-height; the enamel has a soft glassy sheen and a very faint orange-peel texture, no chips, no rust. It is a wide horizontal band about 4:1: it fills about 92% of the image width and sits in the vertical middle of the canvas, with empty transparent space above and below. The sign is designed to be cut into three slices: the left end (the first 12% of its width, with the left screw), a perfectly uniform middle (from 12% to 88%: only the cream field with the green border band above and below, exactly the same at every point) and the right end (the last 12%, with the right screw). The cream field is COMPLETELY BLANK (the website writes the time, the event and the place there). One soft warm light from the upper left. No post, no bracket; a plain rounded rectangle only (not a circle, not a lozenge, not a bar-and-circle shape). No cast shadow, no drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: ~4:1 yuvarlak köşeli emaye levha, yeşil bordür, iki uçta pirinç vida, orta bölüm her noktada aynı; tamamen boş; kenarlara değmiyor; gerçek alfa.
Kullanım: details programı (her etkinlik bir istasyon tabelası; saat, etkinlik, yer HTML); Claude sol · orta · sağ diye keser, genişlik içeriğe göre; kaydırınca tabelalar sağdan "istasyona girer" gibi gelir.

#### W2.16 Çevirmeli sayaç karosu (geri sayım; boş)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/flip_tile.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the countdown tiles on screen 2 of the attached design board. ONE blank flip-card counter tile, alone, seen perfectly straight from the front, photographed for real: a landscape tile about 4 wide : 3 tall of near-black lacquered card (#1B1A17 with a soft satin sheen), split across its exact horizontal middle by a fine dark gap into an upper and a lower flap, with one tiny brass hinge pin at each end of the gap, set in a polished brass bezel (#B88A3D, highlights #E6C47A) with softly rounded corners. The faces of both flaps are COMPLETELY BLANK (the website prints the numbers on them). It fills about 70% of the image width, centred. One soft warm light from the upper left; the upper flap a touch lighter than the lower one. No housing around it, no other tiles. No cast shadow, no drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek yatay karo (~4:3), ortadan ince yarıkla iki kanada ayrılmış siyah lake, iki uçta pirinç pim, pirinç çerçeve; yüz boş; gerçek alfa.
Kullanım: home geri sayımı (4 karo: days · hours · minutes · seconds); Claude karoyu üst/alt yarıya keser, rakamlar HTML; her değişimde üst kanat CSS 3B ile aşağı döner ("klak").

#### W2.17 Kondüktör bilet zımbası
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/ticket_punch.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the conductor's ticket punch on screen 5 of the attached design board. ONE vintage conductor's ticket punch (hand-held punch pliers), alone, seen exactly side-on and lying horizontally: a polished nickel-silver body with warm brass details (#B88A3D), the punching jaws at the LEFT end slightly open, two long gently curved handles to the right with a small coiled return spring between them. It fills about 80% of the image width, centred. One soft warm light from the upper left. No engraving, no maker's mark, no ticket, no hand. No cast shadow, no drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek zımba, tam yandan, ağız solda hafif açık; yazı/marka yok; kenarlara değmiyor; gerçek alfa.
Kullanım: RSVP gönderilince sağdan kartın sağ üst köşesine kayar, kısa bir "sıkış" (ölçek/eğim) ve "klik"; delik CSS maskesiyle açılır, `ticket_disc` düşer, buhar.

#### W2.18–W2.22 Program piktogramları — beş ayrı dosya (dolu pirinç siluet)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/icon_watch.png`, `icon_rings.png`, `icon_coupes.png`, `icon_dinner.png`, `icon_dancing.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the small brass pictograms on the station signs on screen 4 of the attached design board. ONE small pictogram of [SUBJECT], alone, cut from a thin sheet of polished brass (#B88A3D, highlights #E6C47A) with a softly bevelled edge, like the little brass plates on 1930s carriage fittings: a simple, bold, SOLID silhouette (not outline line-art), with only the few inner cut-outs needed to read it, clearly readable when shown at 28–36 px, front view, centred, filling about 60% of the square. All five pictograms of this set share exactly the same brass, bevel, weight and light. No plate, circle or badge behind it, no other ornament. One soft warm light from the upper left. No cast shadow, no drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
[SUBJECT] — make five separate images:
icon_watch   = an open pocket watch with its bow and a short curl of chain (a plain dial with two cut-out hands, no numerals)
icon_rings   = two interlocked wedding rings
icon_coupes  = two champagne coupes touching at the rim
icon_dinner  = a round plate seen from above with a fork on its left and a knife on its right
icon_dancing = a pair of 1930s dancing shoes side by side: a lady's T-bar heel and a gentleman's lace-up oxford
```
Kontrol: beş dosya, her birinde tek dolu pirinç siluet; beşi aynı pirinç, eğim ve ağırlıkta; 32 px'te okunuyor; rozet/daire yok; kadranda rakam yok; gerçek alfa.
Kullanım: details istasyon tabelalarının solunda (welcome → watch, ceremony → rings, cocktail/toast → coupes, dinner → dinner, dancing → dancing); Claude alfayı maske olarak da kullanabilir.

#### W2.23 Buhar bulutu (süzülen vurgu)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/steam_puff.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give design-board.png as the style reference), matching the wisps of steam on screens 3 and 5 of the attached design board. ONE soft puff of white locomotive steam, alone: a rounded, billowing cloud that trails off to the left into thinner wisps, warm white with soft grey-lilac shading and a faint apricot touch on its upper-left side from the dawn light, its edges fading gradually into true transparency (real partial alpha, not a hard cut-out outline). It fills about 70% of the image width, centred, not touching any edge. Nothing else: no train, no chimney, no sky, no background colour. No glow or halo beyond the steam itself, no cast shadow. No text, letters, numbers, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard). If soft edges are impossible for your tool, make the puff denser with a clean, soft-looking edge — never put it on a white, grey or coloured background.
```
Kontrol: tek buhar bulutu, kenarı yumuşak gerçek alfa (olmazsa temiz kenarlı yoğun bulut kabul); zemin rengi yok; kenarlara değmiyor.
Kullanım: açılışta pencerenin üstünden akan buhar (Claude yatay uzatır, birkaç kopya), story ve RSVP'de tek tük süzülür, sayfa geçişinde "tünel" çıkışı.

#### W2.24 Zımba pulu (süzülen vurgu)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/ticket_disc.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Window Seat" wedding website (give menu_card.png and design-board.png as the reference images), matching the tiny punched paper disc falling on screen 5 of the attached design board. ONE single small round disc punched out of the heavy ivory linen card of menu_card.png (#F4ECDC, fine linen emboss), alone, seen slightly tilted so its thin cut edge shows the card's thickness, the edge crisp with a few tiny paper fibres. It fills about 40% of the square, centred. Completely blank: no print, no border line. One soft warm light from the upper left. No other discs, no confetti, no sparkle. No cast shadow, no drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek küçük disk, kenar kalınlığı görünür, boş; gerçek alfa.
Kullanım: RSVP'de zımbadan düşen pul (dönerek düşer); gönderim sonrası teşekkür modunda 2–3 kopya.

### Instructions for GPT — iş sırası ve teslim (PAKET 8)

```
Work only on PAKET 8 of collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md in the repository muzaffergrl/davetiye-maker (branch main). Ignore every other section of that file: PAKET 2, 3, 6R and 7 are done or cancelled, the old PAKET 5R is replaced, and the note at the top of the file (green leather ticket sleeve, map paper, luggage tag) is out of date — PAKET 8 replaces it. Do NOT attach any existing image from collections/25_Orient_Express_Voyage/assets/gpt/parts/ (env_*, flap*, lock_*, luggage_tag, card_small, *_frame, page_ground, ticket_paper, web_hero and the rest: the old look this package replaces), nothing from platform/themes/orient-express-voyage/img/, and no design board of another design.

1. ONE chat, in this order. Send the "Instructions for GPT (send before the first image)" message of PAKET 8 first. Then W1, the design board: attach collections/25_Orient_Express_Voyage/assets/gpt/photos/hero_portrait.jpg and collections/25_Orient_Express_Voyage/assets/gpt/photos/story_1.jpg as the couple's identity reference only. The board is the design; if it misses its Kontrol line or looks ordinary, make it again before going on (at most 3 tries).
2. Then W2, one image per prompt, in the order W2.1 to W2.24, in the same chat. Give the finished design-board.png as the reference image of EVERY W2 image (same walnut, same brass, same green, same poster world, same light). Also give the extra references named in each prompt: poster_sky.png for W2.4, poster_peaks.png for W2.5, poster_hills.png for W2.6, cabin_window.png for W2.8 (edit it if your tool allows, then remove the frame) and W2.11, linen_tile.png for W2.14, menu_card.png for W2.24.
3. Use each English prompt exactly as written. One object per image. No text, letters, numbers, monograms, logos or watermarks in any W2 image (demo text is allowed on W1 only). Objects inside the train are photographed for real; the landscape layers (W2.3 to W2.6) are painted as a 1930s travel poster; never mix the two techniques in one W2 image. In the pictogram group replace [SUBJECT] with each listed line; each line is its own image and its own file.
4. Keep each image in the ratio of its Kaydet size: 1:1, 2:3 or 3:2 (W1 about 2.3:1). The pixel size may differ. Do not resize, crop, repaint or recolour any pixel with code — Claude crops, slices and scales.
5. Photo windows (W2.7, W2.11) are transparent openings; a closed walnut-and-brass ring around them matters more than the opening itself. Never fill them with green, white, glass or a view.
6. The three landscape layers (W2.4, W2.5, W2.6) are the only parts that may touch the image edges (left, right and bottom), and everything above their skyline must be truly transparent. Every other transparent part keeps a clear empty margin on every side.
7. Counts (peaks, cypresses, poplars, ribs, screws) do not matter; never regenerate for a count. Regenerate only for: a wrong object, text present, a real railway name, crest or livery, a cast/drop shadow or a glow outside the object, a fake background (white or checkerboard) instead of real alpha, an object touching the canvas edge where it must not, a photo window that is not transparent or not closed, a wrong ratio, or a "repeatable middle" (W2.12, W2.14, W2.15) that is clearly not uniform. At most 2 attempts per part; then keep the best one, note the defect and move on.
8. Delivery: commit every PNG to the repository at exactly the path on its Kaydet line, with exactly that file name (the parts in collections/25_Orient_Express_Voyage/assets/gpt/parts/, the board at collections/25_Orient_Express_Voyage/assets/gpt/mockups/design-board.png). No zip, no other folder (not docs/qa, not platform/), no download names, no "_final", "_v2" or "(1)" suffixes; rejected tries are not committed. Push to branch main; only if you cannot push to main, push a branch named codex/orient-paket8 and say so on the first line of TESLIM.txt. Run git pull --rebase origin main before each push. Push after W1, then after every 4–5 parts ("25 PAKET 8: W1", "25 PAKET 8: W2 1/5", ...) so nothing is lost if the chat breaks; the last commit is "25 PAKET 8: teslim". Touch no other file; write no code; do not run gpt_yerlestir.py or build_images.py.
9. Finally write collections/25_Orient_Express_Voyage/assets/gpt/parts/TESLIM.txt in Turkish: branch and last commit; how many files were delivered (expected: the board + 24 parts); for every file the target size and the actual size, RGBA or RGB, the number of attempts, every difference from its Kontrol line (be specific), anything skipped and why, which reference images were attached, and one line confirming that no pixels were changed by code. If you cannot write to the repository at all, stop and say so clearly in the chat; do not hand the upload to the user.
```
