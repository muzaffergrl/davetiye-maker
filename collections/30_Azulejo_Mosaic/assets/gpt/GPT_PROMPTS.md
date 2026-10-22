# GPT görsel istekleri — Tasarım 30 · Azulejo Mosaic (2026-10-22 yeniden tasarım)

> **Instructions for GPT:** This design was completely REDESIGNED on 2026-10-22. Generate PAKET 5R (website layers) first,
> in order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 (sample photos) already exists — do NOT
> regenerate it. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as written, follow its
> checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers,
> names, dates, initials, monograms, logos, brand marks, QR codes or watermarks in any image** (also not on the tiles, the
> loose tile, the envelope or the frames). The azulejo patterns are original designs invented for this design — they must
> not copy any real tile panel, building, church, museum piece, souvenir or seller's design. **No lemons, no yellow, no
> sardines, no roosters, no trams, no flags.** Everything stays in cobalt blue, night blue, creamy glaze white, whitewash
> and warm terracotta, with only tiny touches of olive green in leaves. Give W1 `whitewash_ground.png`, W3 `env_back.png`
> and W5 `flap.png` as the style reference of every later part: the same sunlit whitewash plaster, the same creamy white
> tin glaze with hand-painted cobalt brushwork, the same warm terracotta, the same soft Atlantic morning sun from the
> top-left with a warm, clean sheen on the glaze. Parts drawn on the same envelope canvas (W3, W4, W5, W7, W8, W9) keep
> the envelope in exactly the same box.

Bu dosya tasarım 30'un **bütün görsel parçalarının** tek kaynağıdır (`docs/35_22_32_YENIDEN_TASARIM.md`, 22–32 yeniden
tasarım, §4 satır 30). Eski PAKET 5 (G169 çini paneli) ve 20 Ekim PAKET 6 bölümleri kaldırıldı (git geçmişinde). Durum
**concept** (yeniden tasarım): platform teması (`platform/themes/azulejo-mosaic/`) bu parçalarla **39 pilot yapısında
yeniden kurulacak** (G422–G432); o zamana kadar mevcut tema olduğu gibi durur. Parçaların nasıl kullanılacağı aşağıdaki
"Kullanım" satırlarındadır; gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar (isimler, tarih, baş
harfler, mekân) HTML'dir, hiçbir görsele pişirilmez. QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/30_Azulejo_Mosaic/assets/gpt/` altındaki `parts/` (PAKET 5R) ve
  `print/` (PAKET 6R). `photos/` (PAKET 2) zaten dolu: dokunma. Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude, G422–G432): `python3 tools/kit_check.py collections/30_Azulejo_Mosaic --paket 5` (oran, gerçek alfa, kenar
  payı, foto penceresi) + göz kontrolü (`docs/34` §4 yöntemleri). Tema yeniden kurulunca
  `python3 platform/themes/azulejo-mosaic/build_images.py` (alfa kutusuna kırpma + arka katmanın kutusuna yerleştirme,
  `keyed_window`) ve `python3 tools/gpt_kuru_deneme.py --tema azulejo-mosaic --sekil
  collections/30_Azulejo_Mosaic/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **hand-painted Portuguese-style azulejo ceramic + photorealistic paper, plaster and terracotta** — real
  cobalt-blue brush painting on a creamy white tin glaze, with soft wet-edged brushstrokes, gentle wash variations, the odd
  tiny pinhole, slightly irregular hand-cut tile edges and fine ivory grout lines; real sunlit lime-whitewash plaster; real
  unglazed terracotta biscuit; real natural jute twine; real olive sprigs and white jasmine. A sunlit courtyard of an old
  quinta in the hills above the sea: airy, classic, romantic and rich. Not flat vector, not clip-art, not a souvenir print.
- Çini dili (bütün çinili parçalarda **aynı**): kare çinilerde büyük **çeyrek madalyon** deseni — dört komşu çini
  birleşince tam bir yuvarlak madalyon: ortada dört yapraklı rozet, çevresinde küçük stilize karanfil goncaları, köşelere
  kıvrılan akantus sarmalları; bordür çinisi: dalgalı kurdele + küçük rozet; köşe çinisi: çeyrek rozet. Hepsi kobalt
  tek renk (koyu fırça birikmelerinde gece mavisi). Gevşek kapanış karosunda tek bir **kırlangıç** (zeytin çelengi içinde).
- Renkler (yalnız bunlar): cobalt `#1F4A9E` · night `#102554` · cobalt ink `#173A80` · glaze `#FAF8F2` · whitewash
  `#F2EDE3` · terracotta `#AE583A` · deep terracotta `#8C4128` · terracotta light `#E4A688`; zeytin yaprağı yalnız soluk
  gri-yeşil (`#7C8A6A` civarı), çok küçük. Sarı, limon, mor, pembe yok.
- Işık: yumuşak **Atlantik sabah güneşi sol üstten**, sırda temiz ılık parlama; bütün parçalarda aynı. Şeffaf parçalarda
  gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk, nesnenin dışında gölge/hâle yok (gölgeyi site
  ekler).
- Foto penceresi (`#00FF00`) yalnız W11 `niche_frame`, W12 `story_frame`, W13 `venue_frame`'de; diğer parçalarda yeşil yok.
- Gerçek bir binaya, müzeye, kiliseye, belirli bir çini panosuna, markaya ya da başka bir satıcının tasarımına benzemesin.
  **05'ten ayrı:** limon/sarı yok. **44'ten ayrı:** porselen, toile kumaş, kamea yok — burada kalın sırlı el boyaması çini.
  **36'dan ayrı:** kraft kâğıt, etiket yok — sicim yalnız karoyu bağlar.

## Zarf geometrisi (W3–W5, W7–W9 ve W19 buna göre)
Tuval **1200×1500** (dikey). Zarf kutusu **x %7–93, y %7–93** (zarf 1032×1290 px, ≈0,8:1). Altı katman **aynı tuvalde,
aynı kutuda** çizilir: W3 arka, W4 ön cep, W5 basamaklı kapak, W7 sicim, W8 karo ön yüzü, W9 karo arka yüzü (W8 ve W9
birebir aynı kutuda); Claude her birini kendi alfa kutusuna kırpar ve W3'ün kutusuna göre yerleştirir.
- **Çini ızgarası:** zarf genişliği **6 sütun** kare çini (her biri 172 px = tuval genişliğinin %14,33'ü, yüksekliğinin
  %11,47'si). Sütun sınırları x **%7 · 21,33 · 35,67 · 50 · 64,33 · 78,67 · 93**; satır sınırları y **%7 · 18,47 · 29,93 ·
  41,4 · 52,87 · 64,33**.
- **Basamaklı kapak (W5):** üst katlama çizgisi y %7; kenarı ızgara boyunca merdiven: sütun 1 ve 6 → y **%41,4** (3 çini),
  sütun 2 ve 5 → y **%52,87** (4 çini), sütun 3 ve 4 → y **%64,33** (5 çini); basamakların dik kenarları sütun
  sınırlarında (x %21,33, %35,67, %64,33, %78,67). Toplam 26 çini.
- **Ön cep (W4):** tam genişlik, düz üst kenar y **%40** (kapağın en kısa basamağının %1,4 yukarısı → kapak cebin üst
  kenarını her yerde örter, kapalıyken astar görünmez), zarfın alt kenarına (%93) kadar.
- **Kart (W10)** cebin arkasında; kapalıyken görünmez.
- **Gevşek karo (W8/W9):** kapağın en alt basamağının ortasında, yarısı kapakta yarısı cepte: kutu x **%41–59**, y
  **%57,13–71,53** (216 px kare, merkez %50, %64,33).
- **Jüt sicim (W7):** çapraz bağ — dikey kol x %50'de y %7–93 (zarfın üst ve alt kenarından arkaya döner), yatay kol y
  %64,33'te x %7–93 (yanlardan arkaya döner); ikisi karonun ortasında (%50, %64,33) **küçük bir düz düğümle** bağlanır,
  düğümden iki kısa serbest uç sağ alta sarkar (yaklaşık %56, %72'ye kadar). Sicim karonun **üstünden** geçer.
- **Kapağın iç yüzü (W6)** ayrı tuvalde (1200×1000): aynı basamak çizgisi dikey aynalanmış (katlama kenarı altta).
- Kat sırası (alttan üste): W3 arka → kart (W10) → W4 cep → W5 kapak → W8 karo → W7 sicim.

Açılış (≈5 s): dokununca düğüm gevşer, sicimin dikey kolu aşağı, yatay kolu yanlara kayıp söner (Claude W7'yi iki kola
kırpar) → karo kendi dikey ekseninde **3B döner** (90°'de W8 → W9, terrakota sırtı), hafifçe öne eğilip aşağı süzülerek
kaybolur → basamaklı kapak üst katlama çizgisinde 3B kalkar, arka yüzü W6 (terrakota + kobalt astar) → sır beyazı kart
(W10) cebin arkasından yükselir, cep dudağını geçince öne gelir → köşelerde küçük mozaik karoları (W17) dalga hâlinde döner,
zeytin yaprağı ve yasemin (W18) süzülür → home.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Badana sıva (sayfa zemini, kapak)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/whitewash_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat, front-on texture of a sunlit lime-whitewashed plaster wall in a warm soft white (#F2EDE3): many thin layers of limewash with a gentle hand-trowelled undulation, faint soft brush marks, a delicate chalky bloom, and here and there a very faint, washed-out trace of cobalt blue (#1F4A9E at 4–6% strength) where an old blue wash once bled through — soft, rare and cloud-like, never a pattern. Very low contrast so dark blue text reads on it everywhere. Evenly lit by soft morning sun from the top-left, no hard shadow, no cracks, no stains, no tiles, no plants, no vignette. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); badana `#F2EDE3` civarı; kobalt izleri çok soluk ve seyrek; çatlak/leke/çini yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca kapak (kapalı zarf) sayfası ve bütün sayfaların zemini.

#### W2 Sır beyazı pamuk kâğıt (kartlar, bantlar, form)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/glaze_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick mould-made cotton paper in a creamy glaze white (#FAF8F2) with a very slight satin coating, like fine stationery made to sit beside glazed tiles: a gentle felt tooth, a few faint long cotton fibres, the faintest soft cloudiness, an even tone. Evenly lit by soft morning sun from the top-left, no fold, no crease, no deckle edge, no stain, no shadow, no vignette, no printing, no pattern, no tile motif. Calm enough for fine dark blue ink text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; sır beyazı `#FAF8F2` civarı; desen/leke/kat yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, program kartı ve RSVP formunun kâğıdı.

#### W3 Zarfın arkası (terrakota astar görünür)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/env_back.png` · 1200×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope, seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas (a portrait rectangle, about 0.8:1, with crisp square corners). We see its inside: it is lined with warm matte terracotta paper (#AE583A, shading to #8C4128 in the lower part) printed with a small, even, hand-painted repeating pattern of tiny cobalt-blue (#1F4A9E) four-petal rosettes and dots, like a miniature azulejo motif, softly worn like real hand-printing; a slim margin of creamy glaze-white paper (#FAF8F2) shows along the top and both sides of the lining. A very gentle shade toward the bottom where the front pocket will sit. No flap, no front pocket, no twine, no tile, no card inside. Soft morning sun from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikey panel x %7–93 · y %7–93; iç yüz terrakota astar + küçük kobalt rozet deseni, kenarlarda ince sır beyazı pay; kapak/cep/sicim/karo yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kartın arkasında görünen sıcak terrakota iç (W6 ile aynı astar).

#### W4 Zarfın ön cebi
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/env_front.png` · 1200×1500 · **Şeffaf zemin**

```
Only the front pocket of the same portrait envelope as env_back.png, on the same 1200×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the pocket spans the full envelope width (x 7–93%) from a perfectly straight, crisp horizontal top edge at 40% of the canvas height down to the envelope's bottom edge at 93%. It is thick creamy glaze-white paper (#FAF8F2) with a very slight satin, glaze-like sheen, calm and mostly plain, with the faint soft fold lines of the two side flaps and the bottom flap barely visible; a single fine hand-painted cobalt-blue (#1F4A9E) brush line runs just below the top edge; along the bottom of the pocket, from x 9% to x 91%, one single row of six small hand-painted cobalt azulejo border tiles (a wavy ribbon with tiny rosettes, square tiles with fine ivory grout lines between them), each about 13% of the canvas width, sitting about 2% above the bottom edge. The faint thickness of heavy paper is visible along the cut top edge. Everything above the pocket's top edge is completely transparent. No flap, no twine, no tile clasp, no card. Soft morning sun from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik, üst kenarı düz y %40; sakin sır beyazı, üstte ince kobalt çizgi, altta tek sıra 6 bordür çinisi; üstü tamamen şeffaf; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; kapalıyken kapağın basamaklarının altında görünen sakin beyaz yüzey.

#### W5 Basamaklı çini kapak (kapalı, dış yüz)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/flap.png` · 1200×1500 · **Şeffaf zemin**

```
Only the closed flap of the same portrait envelope, on the same 1200×1500 canvas and in exactly the same place, on a fully transparent background. The flap hangs from a softly rounded fold along the envelope's top edge at 7% of the canvas height and spans the full width (x 7–93%). Its whole surface is a grid of square hand-painted Portuguese-style azulejo tiles: 6 columns, each column exactly 14.33% of the canvas width (column borders at x 7, 21.33, 35.67, 50, 64.33, 78.67 and 93%), each tile row 11.47% of the canvas height (row borders at y 7, 18.47, 29.93, 41.4, 52.87 and 64.33%). The flap's free lower edge is a symmetrical STAIRCASE that follows the tile grid and steps down toward the centre: columns 1 and 6 end at 41.4% (3 tiles tall), columns 2 and 5 end at 52.87% (4 tiles tall), columns 3 and 4 end at 64.33% (5 tiles tall); the vertical risers of the steps lie exactly on the column borders. Each tile is creamy white tin glaze (#FAF8F2) painted in cobalt blue (#1F4A9E, deepening to #102554 where the brush pooled) with one quarter of a large medallion, so that every four neighbouring tiles join into a full round medallion: a central four-petal rosette ringed with small stylised carnation buds, with acanthus scrolls curling into the corners; soft wet-edged brushstrokes, gentle wash variations, slightly irregular hand-made tile edges, fine ivory grout lines between the tiles, and the warm clean sheen of real glaze. A fine night-blue painted line follows the whole stepped edge. Everything below the stepped edge is completely transparent. No twine, no loose tile, no card, no lemons. Soft morning sun from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: 6 sütun kare çini; basamaklar sütun 1/6 → %41,4, 2/5 → %52,87, 3/4 → %64,33 (merdiven, V/yay değil); dört çini birleşince tam madalyon; kobalt tek renk + ince derz; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; açılışta üst katlama çizgisinde 3B kalkar, arka yüzü W6. Kapalıyken zarfın en güçlü öğesi (katalog kapağı).

#### W6 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/flap_in.png` · 1200×1000 · **Şeffaf zemin**

```
The inside of the same stepped envelope flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically. Its straight fold edge is at the BOTTOM, along 93% of the image height, spanning x 7–93% of the width; the staircase edge now steps UP toward the centre: columns 1 and 6 (x 7–21.33% and 78.67–93%) rise to 41.4% of the image height, columns 2 and 5 (x 21.33–35.67% and 64.33–78.67%) rise to 24.2%, columns 3 and 4 (x 35.67–64.33%) rise to 7%; the vertical risers lie exactly on those column borders. The inside is lined with the same warm matte terracotta paper as env_back.png (#AE583A, deepening to #8C4128 toward the fold) printed with the same tiny hand-painted cobalt-blue four-petal rosettes and dots, and a slim margin of creamy glaze-white paper (#FAF8F2) follows the whole stepped edge with one fine cobalt brush line inside it. Soft morning sun from the top-left. No twine, no tile, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: katlama kenarı altta (%93); basamaklar yukarı doğru: dış sütunlar %41,4, orta-yan %24,2, orta %7; terrakota astar + kobalt rozet, kenar boyunca sır beyazı pay; gerçek alfa.
Kullanım: tema kurulunca kapak açıldığında zarfın üstünde dik duran iç yüz (3B dönüşün arka yüzü) — asla düz renk değil.

#### W7 Jüt sicim (çapraz bağ)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/twine.png` · 1200×1500 · **Şeffaf zemin**

```
On the same 1200×1500 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 7–93% of the canvas, but the envelope itself is NOT drawn here), only a length of natural jute twine tied around the closed envelope in a cross, on a fully transparent background: one vertical strand runs straight down the centre at x 50% from y 7% to y 93%, and at both ends it turns over in a tiny soft bend as if it wraps over the envelope's top and bottom edges and continues behind; one horizontal strand runs straight across at y 64.33% from x 7% to x 93%, turning over in a tiny bend at both side edges. The two strands meet at (50%, 64.33%) in a small, neat, slightly loose square knot, and two short loose ends hang from the knot down and to the right, the longest reaching about (56%, 72%), each ending in a few frayed fibres. The twine is about 1% of the canvas width thick, made of two twisted plies of natural golden-tan jute (#B58E5E with lighter #D2B48A fibres), with fine stray fibres along it. Soft morning sun from the top-left, a whisper of contact shade only on the twine itself. Everything except the twine is fully transparent: no envelope, no tile, no flap. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikey kol x %50 (y %7–93), yatay kol y %64,33 (x %7–93); düğüm (%50, %64,33), iki kısa saçaklı uç sağ alta; zarf/karo çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca karonun üstünde; açılışta Claude dikey ve yatay kolu ayrı katmanlara kırpar: düğüm gevşer, dikey kol aşağı, yatay kol yanlara kayıp söner.

#### W8 Gevşek azulejo karosu — ön yüz (kırlangıç)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_front.png` · 1200×1500 · **Şeffaf zemin**

```
On the same 1200×1500 canvas as env_back.png and flap.png, in exactly the same place (the envelope itself is NOT drawn here), only one single loose square glazed ceramic azulejo tile lying flat, seen perfectly straight on, on a fully transparent background: the tile occupies exactly x 41–59% and y 57.13–71.53% of the canvas (a perfect square, 216 px), centred at (50%, 64.33%). It is a real, slightly thick hand-made tile with softly rounded, slightly irregular edges and a thin visible terracotta body at its rim, its face a creamy white tin glaze (#FAF8F2) with the warm clean sheen of real glaze, hand-painted in cobalt blue (#1F4A9E, night blue #102554 where the brush pooled): in the centre one single swallow in flight, wings spread, seen from below, inside a round wreath of small olive leaves; in each corner a quarter rosette, and a fine double cobalt line framing the face. Soft wet-edged brushstrokes, a tiny pinhole or two in the glaze. Soft morning sun from the top-left. No twine, no envelope, no other tile. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek kare karo x %41–59 · y %57,13–71,53; ortada zeytin çelengi içinde tek kırlangıç, köşelerde çeyrek rozet; kenarda ince terrakota gövde; harf/rakam yok; gerçek alfa.
Kullanım: tema kurulunca kapağın en alt basamağının ortasında kapanış; açılışta sicim kalkınca dikey ekseninde 3B döner (90°'de W9'a geçer).

#### W9 Gevşek karo — arka yüz (terrakota bisküvi)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_back.png` · 1200×1500 · **Şeffaf zemin**

```
The back of the same loose tile as tile_front.png, on the same 1200×1500 canvas and in exactly the same box (x 41–59% and y 57.13–71.53% of the canvas, a perfect square centred at (50%, 64.33%)), the envelope NOT drawn, on a fully transparent background: the unglazed back of a hand-made ceramic tile in warm terracotta biscuit (#AE583A with lighter #E4A688 dusty areas and deeper #8C4128 in the hollows), matte and slightly sandy, with a few shallow parallel ridges pressed into it and a faint ring of dried white tile mortar near one corner; the same softly rounded irregular edges and the thin rim of white glaze just visible at the edge. Soft morning sun from the top-left. No pattern, no marks, no stamp. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: W8 ile birebir aynı kutu; sırsız terrakota sırt, sığ çizgiler; damga/harf yok; gerçek alfa.
Kullanım: tema kurulunca karonun 3B dönüşünde arka yüz (W8'in kutusuna oturur); foto mozaiğinde dönen karoların arkası da bunun ölçeklenmiş kırpımı.

#### W10 Zarftaki kart (boş)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen straight on, on a fully transparent background: thick creamy glaze-white cotton card as glaze_paper.png (#FAF8F2) with crisp square corners, spanning x 7–93% and y 6–94% of the canvas; a fine hand-painted cobalt-blue (#1F4A9E) double border line inset about 6% from the card's edge, and in each of the four corners, inside the border, one tiny hand-painted quarter rosette in the same cobalt as the tiles. The whole card inside the border is EMPTY paper (the website sets the names, date and venue there in HTML). Soft morning sun from the top-left, a hair-fine contact shade on the card's own edge only. No flowers, no photo, no tile pattern in the centre. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: boş sır beyazı kart; ince kobalt çift bordür + dört köşede küçük çeyrek rozet; içi tamamen boş; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → zarftan yükselen kart ve home kartı (isimler, tarih, mekân HTML).

#### W11 Kireç taşı kemerli çini nişi (home portresi)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/niche_frame.png` · 1000×1350 · **Şeffaf zemin**

```
A portrait wall niche frame, alone, seen straight on, on a fully transparent background: a surround of pale warm limestone (#E9E1D2, fine natural pores, softly worn edges) with a rounded arch at the top, its outer edge spanning about x 6–94% and y 6–94% of the canvas; inside the arch, above the photo window, the curved spandrel is filled with hand-painted cobalt azulejo tiles (the same quarter-medallion tile pattern as flap.png, fine ivory grout lines), and a narrow band of cobalt border tiles runs down both sides of the window. In the middle a portrait photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 250 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, square corners, nothing over it). Below the window a slim limestone sill. Soft morning sun from the top-left. No plants, no pots, no glass over the window. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 760×950 (4:5), sol üst (120, 250); kemerli kireç taşı + kemer içinde çini + yanlarda bordür çinisi; pencerenin üstünde bir şey yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür (`keyed_window`) ve şeffaf yapılır → home portresi (foto mozaikle açılır); thank-you modunda teşekkür fotoğrafı.

#### W12 Azulejo bordürlü çerçeve (story)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/story_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A portrait picture frame made entirely of hand-painted Portuguese-style azulejo border tiles, alone, seen straight on, on a fully transparent background: its outer edge spans x 6–94% and y 6–94% of the canvas (x 60–940 px, y 75–1175 px); four square corner tiles each painted with a quarter rosette, and between them straight runs of border tiles painted with a wavy ribbon and small rosettes, all cobalt blue (#1F4A9E, night blue where the brush pooled) on creamy white tin glaze (#FAF8F2), fine ivory grout lines between the tiles, slightly irregular hand-made edges and the warm sheen of real glaze; a fine terracotta (#AE583A) inner edge like a narrow clay fillet around the window. In the middle a portrait photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 170 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, square corners, nothing over it). Soft morning sun from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 170); dört köşe çinisi + bordür çinileri, ince terrakota iç kenar; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'deki üç an (sol–sağ–sol) ve home'daki hikâye tanıtımı; foto karo mozaiğiyle açılır. Not: PAKET 2 `story_2.jpg` yatay (5:4); panel 4:5'e kırpar.

#### W13 Geniş çini panosu çerçevesi (mekân)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/venue_frame.png` · 1600×1000 · **Şeffaf zemin**

```
A wide landscape tile-panel frame, alone, seen straight on, on a fully transparent background, like a framed azulejo panel set into a whitewashed courtyard wall: its outer edge spans x 6–94% and y 6–94% of the canvas; a border of hand-painted cobalt azulejo tiles (corner tiles with quarter rosettes, border tiles with a wavy ribbon and small rosettes; cobalt #1F4A9E on creamy glaze #FAF8F2, fine ivory grout lines), wider at the top where a shallow ornamental cresting of tiles rises in the centre, and an outer slim moulding of pale limestone (#E9E1D2). In the middle a landscape photo window exactly 1280 px wide and 720 px tall (16:9), its top-left corner at x 160 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, square corners, nothing over it). Soft morning sun from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 1280×720 (16:9), sol üst (160, 150); çini bordür + üst ortada alçak çini tepelik + kireç taşı dış pervaz; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı (karo mozaiğiyle açılır).

#### W14 Köşe süsü (zeytin dalı + yasemin + gevşek çiniler)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A restrained, elegant corner arrangement growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: two or three slender olive sprigs with narrow silvery grey-green leaves (#7C8A6A, pale undersides) and no fruit, a few small sprays of white jasmine with star-shaped five-petal flowers and pink-tinged buds kept very pale, and tucked among them two loose hand-painted azulejo tiles (cobalt quarter-medallion pattern on creamy glaze, as flap.png) lying at gentle angles, one partly behind the leaves. Light and airy, not a heavy bouquet. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Soft morning sun from the top-left. No lemons, no yellow, no fruit, no vase, no pot. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sol üstten çıkan hafif küme (zeytin, yasemin, iki gevşek çini); sağ alt yarı boş; limon/sarı/meyve yok; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca kapakta sol üst köşe (metnin altında değil), home kartının üst köşeleri (sağda aynalanır), RSVP kapanışında küçük.

#### W15 Çini frizi (bölüm ayırıcı)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/divider.png` · 1600×240 · **Şeffaf zemin**

```
A slim horizontal divider, alone, on a fully transparent background: in the centre a short row of five small square hand-painted azulejo tiles touching edge to edge (cobalt #1F4A9E on creamy glaze #FAF8F2, fine ivory grout lines; the middle tile a full rosette, the others a wavy ribbon border motif), together about 34% of the canvas width and 60% of its height, and from both sides of this row a fine hand-painted cobalt brush line tapers out to a hair-fine point, the whole divider spanning x 8–92% of the canvas at the vertical centre. Glaze sheen in soft morning sun from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: ortada 5 küçük çini (orta rozet), iki yana incelen kobalt fırça çizgisi; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet ve gün, details program, RSVP formu).

#### W16 Sarmaşıklı terrakota saksı (imza süsü)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/terracotta_pot.png` · 900×1000 · **Şeffaf zemin**

```
A single small hand-thrown terracotta pot, alone, seen from the front at eye level, on a fully transparent background, photorealistic: a classic rounded pot with a rolled rim in warm unglazed terracotta (#AE583A, dusty lighter #E4A688 patina, a faint white lime bloom near the base), a single band of small hand-painted cobalt rosettes on creamy glaze around its belly; from it grows a small cascade of trailing ivy with glossy dark green leaves (kept muted) and a few sprigs of white jasmine, the ivy spilling over the rim and down one side. The pot and plant span about x 15–85% and y 8–92% of the canvas. Soft morning sun from the top-left. No saucer, no ground, no shelf. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek terrakota saksı, gövdede ince kobalt rozet bandı; sarmaşık + yasemin; zemin/tabak yok; gerçek alfa.
Kullanım: tema kurulunca home imzası ("Open the envelope again" üstünde), RSVP teşekkürü ve 404/teşekkür modunda küçük süs.

#### W17 Mozaik karoları — iki ayrı dosya
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/mosaic_tile_a.png`, `mosaic_tile_b.png` · her biri 512×512 · **Şeffaf zemin**

```
A single square hand-painted Portuguese-style azulejo tile, alone, seen perfectly flat and straight on, on a fully transparent background, filling exactly x 8–92% and y 8–92% of the square: creamy white tin glaze (#FAF8F2) with the warm sheen of real glaze, painted in cobalt blue (#1F4A9E, night blue #102554 where the brush pooled) with soft wet-edged brushstrokes, crisp square corners with only a hair of hand-made irregularity, a thin ivory edge like a grout margin. Soft morning sun from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make two files with exactly the same size, light and glaze: a = one quarter of the large medallion from flap.png — the quarter rosette in one corner, carnation buds and an acanthus scroll; b = a full small four-petal rosette in the centre with tiny dots in the four corners.)
```
Kontrol: iki dosya, aynı boy ve sır; a = çeyrek madalyon, b = ortada küçük rozet; kare, kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca foto mozaiği (fotoğrafın üstünde ızgara hâlinde dizilir, çapraz dalgayla 3B dönüp kalkar; arkası W9 kırpımı), kapakta açılış sonrası köşelerde dönen karolar, RSVP teşekkür panosu.

#### W18 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft morning sun from the top-left. No other object. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. (Make three files, the same light and scale: 1 = one tiny square hand-painted azulejo tile chip, cobalt rosette on creamy glaze, slightly tilted; 2 = one single narrow olive leaf, silvery grey-green with a pale underside, gently curved; 3 = one single white jasmine flower with five star-shaped petals and a faint pink tinge on the back of one petal.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (çini parçası, zeytin yaprağı, yasemin); kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışın son fazında ve RSVP gönderilince süzülen küçük nesneler (her biri ayrı katman, kendi fazında).

#### W19 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft Atlantic morning sun from the top-left with a warm clean sheen on the glaze: the closed portrait envelope of flap.png and env_front.png — its stepped flap of hand-painted cobalt azulejo tiles, its calm glaze-white pocket with one row of border tiles — tied in a cross with natural jute twine (as twine.png) and closed by the loose swallow tile (as tile_front.png) at the lowest step, lying slightly below the centre on a sunlit whitewashed plaster surface (as whitewash_ground.png); at the left slender olive sprigs, white jasmine and two loose azulejo tiles (as corner_spray.png); at the right the small terracotta pot with trailing ivy (as terracotta_pot.png), slightly out of focus; a few jasmine flowers and one tiny tile chip scattered. Only cobalt, night blue, glaze white, whitewash and terracotta with small touches of olive green. The top 20% of the image is calm and soft (only out-of-focus plaster and leaves). This image is cropped to 1200×630 for link previews: keep the whole envelope, twine and tile visible with at least 5% empty margin below it. No people, no lemons. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf + sicim + karo bütün, altında ≥%5 boşluk; üst %20 sakin; limon/sarı yok; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Ortak: photorealistic fine-art wedding photography, soft natural light, a calm cobalt, white and warm terracotta
palette, subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo (they must
not resemble any real person or celebrity): Inês — long dark-brown wavy hair worn half up, olive skin, brown eyes, a
slim gold ring; Mateo — short dark hair, a neat trimmed beard, light-tan skin. Modern, elegant clothing (no costume,
no folk dress). No text, no readable signs, no frame, no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir.

#### 2.1 Ana portre
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Inês and Mateo, in their early thirties (Inês: long dark-brown wavy hair worn half up, olive skin, brown eyes, a slim gold ring; Mateo: short dark hair, a neat trimmed beard, light-tan skin; they must not resemble any real person or celebrity) in a sunlit courtyard: she in a simple ivory crepe gown, he in a navy-blue suit, standing close and smiling at each other in front of a wall of blue-and-white hand-painted tiles, terracotta pots with trailing ivy beside them, three-quarter length, faces in the upper third, soft late-afternoon light from the left. Photorealistic, calm cobalt, white and terracotta palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A rainy afternoon"
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing at a small table by the window of a cosy café on a rainy afternoon, two coffee cups, raindrops on the glass, blue-and-white tiles on the café wall softly out of focus, warm light inside. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "The tram up the hill"
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_2.jpg` · Yatay 1280×1024 (5:4)
```
Landscape 5:4: the same couple as hero_portrait.jpg on a steep old cobbled street of a hilly seaside town at golden hour, walking up hand in hand beside a vintage yellow tram (no numbers, no lettering on it), whitewashed houses with tiled façades and terracotta roofs behind, the sea far below. Seen from slightly behind and to the side. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.4 Story 3 — "Our promise"
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on a sunlit stone balustrade with a blue-and-white tile set into it and the sea softly out of focus behind, soft light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant old Portuguese country estate (a fictional quinta) in early summer: a whitewashed courtyard with blue-and-white tile panels on its walls, a stone arcade, terracotta pots with ivy and white jasmine, a long table set for dinner under string lights, wooded hills behind, soft late-afternoon light. No people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, `'azulejo-mosaic'` bloğu). Bugünkü kaynaklar
> (`print/invitation_front.png`, `print/invitation_back.png`, 20 Ekim) eski fildişi + köşe çiçekleri görünümünü basıyor;
> yeni zeminler **yeni adlarla** istenir, eskiler silinmez (tema yeniden kurulana kadar panel eskisini basar).
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in
> + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan ~%0,8
> kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür; tema yeniden kurulumuyla, G422–G432):**
> 1. `layouts.ts` `'azulejo-mosaic'` bloğunda `sources` → `{ front: 'print/invitation_front_r_5x7.png', back:
>    'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }` (aynı); yorum satırı yeni görünüme göre güncellenir. `ink` `#173A80`, `accent` `#8C4128`
>    (açık zeminde koyu mürekkep) kalır.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme azulejo-mosaic` ve `node scripts/print-sample.ts
>    --theme azulejo-mosaic --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü;
>    `public/print/azulejo-mosaic/`'deki artık kaynak olmayan eski dosyalar silinir.

#### P1 — Ön yüz
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the thick creamy glaze-white cotton card of glaze_paper.png (#FAF8F2). Across the top, between 9% and 91% of the width, a band of hand-painted Portuguese-style azulejo border tiles in a single row (cobalt #1F4A9E on creamy glaze, fine ivory grout lines; corner tiles with quarter rosettes, border tiles with a wavy ribbon and small rosettes, exactly as in flap.png and story_frame.png), and from the centre of this band a small hanging cresting of three tiles forming a shallow stepped point, like the stepped envelope flap; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 92% and 96% of the height and from 14% to 86% of the width, a fine double cobalt brush line with one small cobalt rosette tile at its centre. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no tile, no leaf, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges. Soft morning sun from the top-left, the warm sheen of glaze on the painted tiles. Only cobalt, night blue and glaze white. No lemons, no QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma sır beyazı kâğıt; üstte tek sıra bordür çinisi + ortada üç çinilik basamak tepelik (%17'nin üstünde); altta ince kobalt çift çizgi + küçük rozet; %19–%91 × %10–%90 tamamen boş; yan %8 boş; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same thick creamy glaze-white cotton card, only a short row of five small hand-painted cobalt azulejo tiles across the top centre (between 32% and 68% of the width; the middle one a full rosette, the others a wavy ribbon motif) with a fine cobalt brush line tapering out from both sides of it toward 20% and 80% of the width, all of it staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no tile, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada 5 küçük çini + incelen kobalt çizgi (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

## PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) — GEÇERSİZ (2026-10-22: yeniden tasarım; tema kurulunca yeniden yazılacak)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Yazan: G175 (`tools/paket3_sahne.py` şablonu, 01–21 ile aynı). `tools/listing_editorial.py` 3.1, 3.2, 3.4 ve 3.5'i
> kullanır (ilan görselleri 1, 2, 8, 4); 3.3 yedek sahnedir.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a sunlit whitewashed table with an edge of terracotta tiles and a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a sunlit whitewashed table with an edge of terracotta tiles, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a sunlit whitewashed table with an edge of terracotta tiles, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a sunlit whitewashed table with an edge of terracotta tiles, slightly right of center and rotated about 8 degrees, surrounded at the edges by a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a whitewashed bench with cobalt-and-white cushions and a terracotta cup; a small arrangement of a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
