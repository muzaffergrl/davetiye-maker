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
