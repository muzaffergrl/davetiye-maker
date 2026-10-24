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

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 30`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a sunlit whitewashed table with an edge of terracotta tiles, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a sunlit whitewashed table with an edge of terracotta tiles, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a sunlit whitewashed table with an edge of terracotta tiles, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a sunlit whitewashed table with an edge of terracotta tiles: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a sunlit whitewashed table with an edge of terracotta tiles: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a sunlit whitewashed table with an edge of terracotta tiles, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a sunlit whitewashed table with an edge of terracotta tiles, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a sunlit whitewashed table with an edge of terracotta tiles: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Azulejo Mosaic yeniden tasarım (2026-10-24)

> Kullanıcı (2026-10-23/24): 21'den itibaren her tasarım "çok iyi bir profesyonel tasarımcının elinden çıkmış gibi" olacak
> ("cesur ve yaratıcı ol"); kendine özgü bileşen, hareket ve ses. 30'un bugünkü sitesi (G430, PAKET 5R: basamaklı çini
> kapaklı zarf + jüt sicim + kırlangıç karosu + foto mozaiği) çıta değildir; kimlik korunur, düzey yükseltilir. PAKET 8
> tasarımı baştan GPT'ye çizdirir (K21): önce **W1** tasarım panosu, sonra aynı sohbette panodan türeyen **W2** parçaları
> (24 madde, 30 dosya). Claude yalnız keser, maskeler, ölçekler, aynalar/döndürür, dizer, ışık verir ve HTML/CSS/JS kurar;
> çizmez. Dosyanın başındaki "Instructions for GPT" notu (whitewash_ground / env_back / flap referansları, yeşil foto
> pencereleri) PAKET 8'e **uygulanmaz**.
>
> Claude için notlar:
> - W1'in kayıt satırı bilerek kalın değil: yol `mockups/` altında olduğu için `kit_check` / `gpt_yerlestir` orada yeşil ekran
>   arar. Panoyu GPT doğrudan commit eder; `gpt_yerlestir`'e verilmez.
> - W1 demo metni `content.demo.json` ile aynı: Inês & Mateo · Saturday, June 5, 2027 · Quinta da Andorinha Azul, Sintra,
>   Portugal · program 5:00 PM Ceremony (The chapel garden) / 6:00 PM Cocktail hour (The tiled courtyard) / 7:30 PM Dinner &
>   dancing (The cloister terrace) · dress code Summer formal · RSVP son günü April 30, 2027 · yemek Vegetarian / Fish /
>   Chicken · story "A rainy afternoon". Geri sayım örneği 224 gün (2026-10-24'ten). Panoya `story_2.jpg` **verilmez**: sarı
>   tramvay, brief'teki kartpostal klişesi (demo fotoğrafının kendisi ayrı karar; entegratöre not).
> - Dosya adları bilerek PAKET 5R'dekilerden farklı (`envelope_*`, `invite_card`, `tile_*`, `swallow_*`, `frame_*`,
>   `card_glaze`, `divider_brush`, `icon_*`, `courtyard*`, `wall_whitewash`, `leaf_shadow`, `pot_jasmine`, `fountain`,
>   `float_*`): `gpt_is_listesi` aynı yolda dosyadaki ilk prompt'u alır, eski PAKET 5R prompt'u kazanırdı. Eski parçalar
>   silinmez; tema yeniden kurulana kadar canlı site onları kullanır.
> - **Basamaklı kapak GPT parçası değil.** Claude kapağı `tile_pattern`'den kurar: ayna-döşeme (padrão: T · yatay ayna / dikey
>   ayna · 180°) her birleşimde dikişsiz madalyon verir. Karo = ölçülen zarf genişliği / 6; basamaklar 3 / 4 / 5 karo (26
>   karo), her karo ayrı 3B katman (ön `tile_pattern` ± `scale(-1,1)`, arka `tile_bisque`). Kapanış karosu `tile_swallow`
>   (≈1,2× karo) sicimin ölçülen düğümüne oturur. Prompt geometrisi: zarf kutusu x %8–92 · y %15–85 (0,8:1); 3 karo = tuvalin
>   y %43'ü; cep üst kenarı %41,5 (kapak her yerde örter); sicimin yatay kolu ve düğüm %61,7 (= 5 karo). GPT kayarsa ölçülen
>   değer esastır (`tema_build.hiza_olc`; hiza PAKET 8 için otomatik koşmaz). Aynı karo setinden: home nişinin çevresi, foto
>   mozaiği örtüleri, duvar süpürgeliği (`tile_border`), geri sayım (`tile_plain`), teşekkür panosu.
> - Aynı tuvalde hizalanan gruplar: zarf (W2.1–W2.3), karo seti (W2.5–W2.9 ve W2.17 ikonları; aynı kare kutu), kırlangıç
>   (W2.9 → W2.10 → W2.11; kuş karodan tam kalktığı yerde başlar). Her katman kendi alfa kutusundan kesilir.
> - Foto pencereleri yeşil değil, **şeffaf açıklık** (21 TESLİM dersi; prompt'larda bilerek yeşil hex yok, `kit_check` yeşil
>   pencere aramaz). Maske kapalı halkanın içindeki şeffaf bölgeden: niş = kemer (≈0,65), pano ≈4:5, geniş pano ≈16:9.
> - İnce şerit (ayırıcı) 3:2 tuvalde ortada bant; `card_glaze` dikey 3 dilim. Bütün ölçüler GPT'nin yerel tuvalleri
>   (1024×1024, 1024×1536, 1536×1024); pano ≈1908×824.
> - `leaf_shadow` opaktır (beyaz zemin üstünde yalnız gölge): `mix-blend-mode: multiply`, düşük opaklık, yavaş salınım; beyazı
>   seviye ayarıyla tam beyaza çekmek ışık işidir, çizim değildir. Bougainvillea 27'nindir (magenta): gölgeler yasemin + zeytin.
> - Palet **aynen** korunur (G177 varyantları: `variants/recolor.json` çapaları cobalt `#1F4A9E` / terra `#AE583A`). Parçalar
>   gelince çapalar gerçek parçalarda yeniden ölçülür ve `COLLECTION_STATUS.md`'deki `recolor_parts.py build/check` +
>   `variant-check` adımları koşulur. Nötrler eski parçalarda zaten vardı: kireç taşı `#E9E1D2`, jüt `#B58E5E`.
> - Fontlar değişir (aşağıda; Arizonia + Cormorant Upright'ın yerine), `scripts/font-fallback.ts` yeniden koşulur. Sevillana ve
>   Lusitana Latin Extended-A taşımaz (ą ć č ę ł ń ś ź ż ş ğ yok; Latin-1 tam: ê ã ç é ñ var) → isim alanında yedek yüz;
>   Lusitana'da ’ ve — yok → yalnız büyük harf satırlarında, gövdede asla. Faustina latin + latin-ext + vietnamca tam.
> - Paylaşım (og) görseli ayrıca istenmedi: Claude `courtyard_wide` + zarf katmanları + dizilmiş karolar + sicim +
>   `tile_swallow`'dan kurar (eski `web_hero` yerinde kalır). PAKET 6R baskı ve PAKET 3/7 ilan sahneleri bu turda değişmez
>   (uyum gerekirse ayrı paket). Açılış nesnesi yine zarf; START HERE'deki eski `wall` / `Wall` adı entegratörde "envelope"
>   yapılır. `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md`, `kuru_sekil.json` ve tema testi entegratörde yeni parçalara göre
>   güncellenir.
> - Ses dosyası yok: aşağıdaki ipuçlarını Claude sentezler (`tools/audio_fx.py`, AGENTS şart 9; kırlangıç cıvıltısı da sentez,
>   kayıt yok); ilk dokunuştan önce sessiz.

### Sanat yönetimi — "Tile by tile" (the Blue Swallow)

- **Signature.** The site is the sunlit courtyard of the Quinta da Andorinha Azul — the "Blue Swallow" estate — in the green
  hills of Sintra on a June morning: lime-whitewashed walls, cool cobalt azulejos, sun-bleached terracotta, pale limestone,
  jasmine and silver olive leaves whose shadows stir on the wall. Two ideas carry every page: (1) **everything is revealed
  tile by tile** — thick hand-made tiles with a painted cobalt face and a terracotta biscuit back turn over one by one;
  (2) **the Blue Swallow** — the swallow painted on the envelope's clasp tile lifts off the glaze as living brushwork when
  the invitation opens, and from then on flies ahead of every reveal. (The demo story already says it: "Tile by tile…")
- **Opening = the tile-flap envelope, opened by a flock.** On the whitewashed wall: a portrait glaze-white envelope whose
  stepped flap is 26 separate thick tiles (6 across; 3, 4, 5 deep toward the centre), crossed with jute twine knotted over
  the swallow tile at the lowest step. Tap → the knot loosens, the twine slips away → the clasp tile turns over; at 90° the
  painted swallow lifts off and flies a wide arc → following it, the flap's tiles turn over one by one in a stepped wave from
  the lowest step back up to the fold, each lifting off and sailing up out of the screen, terracotta backs flashing, like a
  flock taking off → the open envelope shows its terracotta lining; the glaze card rises from the pocket and a sheen of
  morning sun crosses it → home, where the swallow lands first and the flown tiles set themselves round the portrait niche.
  Every piece moves on its own; nothing is a fade.
- **Inside.** Home: the portrait in a limestone arched niche lined with border tiles, uncovered by a diagonal wave of turning
  tiles behind the swallow; the names in big sunny hand lettering; the invitation on a glaze card painted by the tiles' own
  brush; a countdown on painted house-number tiles. Story "Tile by tile": three moments, each in a painted baroque tile panel
  (moldura), uncovered tile by tile as it scrolls in, the swallow crossing ahead. Details "The Day": each line of the
  programme opens with a single-figure tile (figura avulsa) that turns into place; the venue in a wide tile panel. RSVP: the
  reply card above a small tiled wall fountain; on send, tiles set a medallion panel, rings spread on the basin, two swallows
  take off. Page change: a quick diagonal wave of turning tiles (optional, ≤ 600 ms).
- **Three materials, never mixed up.** Ceramic: thick hand-made tiles, creamy tin glaze, cobalt brushwork with wet edges and
  pooled night-blue, a calm satin gloss, terracotta biscuit backs, ivory grout. Paper: thick glaze-white cotton card painted in
  cobalt ink by the same hand (no grout, no ceramic gloss on paper). Courtyard: lime-whitewash, limestone, sun-bleached
  terracotta, jute, jasmine, olive, water. **No gold and no metal anywhere** — the one design of 21–30 without it.
- **Colour (unchanged; the G177 colour variants depend on it).** cobalt `#1F4A9E` · night `#102554` · cobalt ink `#173A80` ·
  glaze `#FAF8F2` · whitewash `#F2EDE3` · limestone `#E9E1D2` · terracotta `#AE583A` · deep terracotta `#8C4128` · terracotta
  light `#E4A688` · olive `#7C8A6A` (tiny touches) · jute `#B58E5E`. No yellow, no pink, no purple, no gold.
- **Not the others, no postcard.** 05 owns lemons, yellow and the V flap with a wax seal; 44 blue-and-white porcelain, toile,
  cameos and engraved birds; 36 kraft paper, seed packets and tags; 27 zellige star mosaics, horseshoe arches, pierced
  lanterns, doors, teal-and-saffron, bougainvillea and orange blossom; 21 velvet, red roses, torn paper, the gold oval, wax
  seals; 22 the moon and night water; 23 jewel boxes, pearls, gems; 24 theatre curtains and tassels; 25 trains, brass,
  tickets, luggage; 29 stars; 06 Art Deco fans and sunbursts. Never the Lisbon postcard: lemons, sardines, roosters, trams,
  flags, the pear-shaped Portuguese guitar or fado scenes. No saints, angels, crosses or religious tile scenes. The swallow
  is brush painting — never the 3D glazed ceramic swallow figurines sold as souvenirs. Patterns are original: no real panel,
  church, palace, museum piece or seller's design.
- **Type (Google Fonts; no theme or brief in the repo uses them; each answered HTTP 200 on 2026-10-24, also combined as
  `family=Sevillana&family=Lusitana:wght@400;700&family=Faustina:ital,wght@0,400;0,500;1,400`).** *Sevillana* 400 — the names,
  page headings and short hand-lettered lines ("Kindly reply", captions), ≥ 26 px, never in all capitals: sunny Iberian
  fair-poster hand lettering with looping capitals. *Lusitana* 400/700 — widely letter-spaced capitals only (dates, labels,
  buttons, countdown labels): a roman cut after 16th-century Portuguese book printing. *Faustina* 400/500 + italic — body,
  times, captions and the form: a clean classic book serif with a soft italic.
- **Motion (Claude builds it; GPT designs for it).** Opening ≈ 0–400 ms knot tug · 350–1000 twine slides off (strand down,
  arms sideways) · 900–1500 clasp tile turns, swallow lifts at 90°, wings beat (glide ↔ wings-up) along an arc · 1300–2700
  the flap wave (26 tiles, ~40 ms stagger, each: lift 4 px → turn → sail up out of the frame with a little spin) · 2600–3500
  card rises, sun sheen, comes forward · 3600 home (view transition; the swallow arrives first, the niche surround sets tile by
  tile). Everywhere: leaf shadows sway slowly; photos uncovered by diagonal tile waves; programme tiles turn into place;
  countdown seconds on a house-number tile. Reduced motion: no turns, straight cuts.
- **Sound (Claude synthesises them; silent until the first tap).** (1) knot: a rough jute tug and the soft hiss of twine
  over paper; (2) clasp: the light glassy "tock" of a glazed tile lifted off another, with a faint ring; (3) swallow: a short
  bright two-note twitter and a flutter of wings (FM chirps + filtered noise, no recorded birdsong); (4) flap wave: a quick
  rising cascade of tiny ceramic clicks, one per tile, a little higher up each step; (5) courtyard bed: the soft trickle of
  the wall fountain under a light morning air, very low, fading after the opening and returning on RSVP; (6) RSVP sent: tile
  clicks settling into place, one clear glaze-and-glass chime, the two swallows' twitter.

**Instructions for GPT (send before the first image):**
```
You are the art director, tile painter and still-life photographer of a luxury wedding stationery house, designing the mobile wedding website "Azulejo Mosaic" from scratch. The world is the sunlit whitewashed courtyard of an old quinta in the green hills of Sintra, Portugal, on a June morning — the estate is called the "Blue Swallow". Its signature: TILE BY TILE. Everything on the site is revealed by thick hand-made tiles turning over one by one (a painted cobalt face, a terracotta biscuit back), and the guide is a single swallow painted in cobalt brushwork that lifts off its tile when the invitation opens and flies ahead of every reveal. Three materials, never mixed up: (1) CERAMIC — thick hand-made tiles with a creamy white tin glaze (#FAF8F2) painted in cobalt (#1F4A9E, pooling to night blue #102554) with soft wet-edged strokes and gentle wash variations, slightly irregular hand-cut edges, a calm satin gloss, fine ivory grout; their backs unglazed terracotta biscuit (#AE583A, #8C4128, dusty #E4A688); (2) PAPER — thick glaze-white cotton card painted in cobalt ink by the same hand (no grout and no ceramic gloss on paper); (3) the COURTYARD — lime-whitewashed plaster (#F2EDE3), pale warm limestone (#E9E1D2), sun-bleached terracotta, natural jute twine (#B58E5E), white jasmine, silvery olive leaves (#7C8A6A, small touches only), clear water. Only these colours. No gold or metal of any kind, no yellow, no pink, no purple. The azulejo patterns are original, invented for this design: never a copy of a real tile panel, church, palace, museum piece, souvenir or another seller's design. Never: lemons, sardines, roosters, trams, flags, the pear-shaped Portuguese guitar or fado scenes, saints, angels, crosses or religious scenes, 3D ceramic swallow figurines, porcelain or toile, zellige or star mosaics, horseshoe arches, lanterns, doors, bougainvillea, orange blossom, roses, wax seals, Art Deco. Everything must look made and photographed for real: rich, tactile, sunlit, believable, magazine-quality luxury; never clip-art, never flat vector, never a cheap souvenir print. One soft warm Atlantic morning light from the upper left in every image. First you draw a design board of five phone screens (W1); then, giving that board as the reference image of every image, you make the production parts (W2): one object per image, no cast or drop shadow, no glow or halo outside the object, no text, letters, numbers, monograms, logos or watermarks. A transparent background must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard), and the object must stay at least 5% inside every edge.
```

#### W1 — Tasarım panosu (5 telefon ekranı; demo metin serbest, YALNIZ referans)
Kaydet (W1): `collections/30_Azulejo_Mosaic/assets/gpt/mockups/design-board.png` · yaklaşık 1908×824 (≈2,3:1; araç vermiyorsa 1536×1024, beş ekran tek sırada) · opak · kit_check dışı

```
Use case: ui-mockup. Create a high-fidelity art direction board of FIVE mobile wedding website screens for a new luxury design called "Azulejo Mosaic", each screen in a 390 by 844 proportion, arranged side by side in one row with generous, even gaps on a soft warm limestone-grey studio background (the whole board about 2.3:1). The attached photographs (hero_portrait.jpg, story_1.jpg and venue.jpg) are ONLY the identity and styling reference for the fictional couple (she: long dark-brown wavy hair worn half up with a few jasmine flowers, olive skin, brown eyes, an ivory square-neck crepe gown; he: short dark wavy hair, a neat trimmed beard, light-tan skin, a navy suit, white shirt, navy tie and an olive-sprig boutonniere) and for the venue; everything else is new. The five screens must look like one finished, coherent, best-selling premium product made by a top luxury stationery designer: rich, tactile, sunlit, romantic, classic and bold; never minimal, never flat vector, never clip-art, never a souvenir print.

THE CONCEPT — "Tile by tile": the sunlit whitewashed courtyard of an old quinta in the hills of Sintra on a June morning — the "Blue Swallow" estate. Lime-whitewashed walls (#F2EDE3) with soft dappled shadows of jasmine and olive leaves falling from the upper left; cool hand-painted cobalt azulejo tiles (#1F4A9E pooling to night blue #102554 on creamy tin glaze #FAF8F2) with thick hand-made bodies, slightly irregular edges and ivory grout; warm sun-bleached terracotta (#AE583A, #8C4128, #E4A688); pale limestone (#E9E1D2); natural jute twine; white jasmine and small silvery olive leaves. Everything is revealed TILE BY TILE — tiles with a painted cobalt face and a terracotta biscuit back turning over one by one — and a single swallow painted in cobalt brushwork flies ahead of every reveal. The original azulejo pattern of this design: a large round medallion (a four-petal rosette ringed by small stylised carnation buds) with sweeping acanthus scrolls, four tiles making one medallion; border tiles with a wavy ribbon and small rosettes. Paper is thick glaze-white cotton card painted in cobalt ink by the same hand. NO gold or metal anywhere, no yellow, no pink, no purple, no lemons, no trams, no roosters, no sardines, no flags, no Portuguese guitar, no religious figures, no zellige, no horseshoe arches, no lanterns, no doors, no bougainvillea, no roses, no wax seal.

TYPOGRAPHY: the couple's names and the big headings in a sunny, romantic Iberian hand-lettered display script with looping, curled capitals, like the lettering painted by hand on an old Portuguese tile sign or an Andalusian fair poster — airy, warm and clearly legible (not a formal copperplate, not a casual marker); dates, labels and buttons in widely letter-spaced Renaissance roman capitals like the title page of a 16th-century Portuguese printed book; body text in a clean classic book serif with a soft italic. Cobalt and night-blue type on whitewash and paper; glaze-white type on cobalt buttons.

Screen 1 — the opening (the closed envelope): full-bleed sunlit whitewashed courtyard wall with soft dappled jasmine-and-olive leaf shadows in the upper left; along the bottom of the screen a dado of cobalt azulejo tiles set in the wall and a strip of worn terracotta floor; at the lower right corner a sun-bleached terracotta pot of white jasmine standing on the floor, partly cut by the screen edge. At the top, tiny spaced capitals "TOGETHER WITH THEIR FAMILIES", the names "Inês & Mateo" large in the hand-lettered script in cobalt, and "JUNE 5, 2027 · SINTRA" in spaced capitals. In the middle, about 74% of the screen width, the CLOSED envelope seen perfectly straight on: portrait, about 4:5, thick creamy glaze-white cotton paper; its flap is made of REAL, SEPARATE, THICK hand-painted ceramic tiles — six square tiles across, set edge to edge with hairline gaps, stepping down toward the centre like a staircase (three tiles deep in the outer columns, four in the next, five in the two middle columns), their painting joining into round cobalt medallions; natural jute twine crosses the envelope (one strand straight down the centre, one straight across through the lowest step) and is tied in a small knot over one slightly larger loose tile sitting at the lowest step — that tile is painted with a single swallow in flight inside a small olive wreath; the calm glaze-white pocket below the flap has a hand-painted cobalt ribbon band along its bottom. Below the envelope "TAP TO OPEN" in tiny spaced capitals.

Screen 2 — home: the whitewashed wall with leaf shadows. The top 55% of the screen: a shallow round-arched niche of pale limestone set into the wall, its opening lined with a band of cobalt border tiles, holding the couple's portrait (from the attached hero_portrait.jpg); across the lower right of the portrait a few painted tiles still cover the photo and are caught turning over — some edge-on, some showing their terracotta backs — revealing the photograph tile by tile; a small swallow painted in cobalt brushwork glides toward the niche's limestone ledge. Below: the names "Inês & Mateo" large in the script, "SATURDAY, JUNE 5, 2027" and "QUINTA DA ANDORINHA AZUL · SINTRA, PORTUGAL" in spaced capitals; then the top of a glaze-white cotton card with a hand-painted cobalt medallion flanked by acanthus scrolls at its head and the italic line "request the pleasure of your company at their wedding"; a countdown on four small square glazed house-number tiles, each with a fine painted cobalt border and its numeral painted in cobalt: "224", "07", "42", "18", with "DAYS · HOURS · MINUTES · SECONDS" in tiny spaced capitals under them; a cobalt pill button "Kindly reply" with glaze-white text.

Screen 3 — story: the whitewashed wall. At the top small spaced capitals "TILE BY TILE" and the heading "Our Story" in the script. In the middle a tall framed azulejo panel: a painted baroque frame of cobalt acanthus scrolls and small carnation garlands on glazed tiles with visible grout lines, a scalloped crest with a small empty cartouche at its top, holding the couple's photograph (from the attached story_1.jpg, the café on a rainy afternoon). The photograph is being uncovered tile by tile: a diagonal wave of painted pattern tiles is turning over from the top left, about a third of the photo at the lower right is still covered, several tiles are caught mid-turn showing their terracotta backs, and the painted cobalt swallow flies across just ahead of the wave. Under the panel the caption "A rainy afternoon" in the script, a row of three tiny glazed tiles as page markers (the first painted solid cobalt) and two fine round arrow buttons; two or three small jasmine flowers drifting.

Screen 4 — details: a glaze-white cotton card fills the upper part: the heading "The Day" in the script, "SATURDAY, JUNE 5, 2027" in spaced capitals, a fine hand-painted cobalt brush divider with a small rosette at its centre; the programme as three rows, each starting with a small square single-figure tile in the old Portuguese manner (one simple cobalt figure in the middle of the tile, tiny dot-crosses in its corners) — two interlocked rings · two wine glasses touching · a plate with a knife and a fork — then the time in spaced capitals, the event and the place in italic: "5:00 PM · Ceremony · The chapel garden", "6:00 PM · Cocktail hour · The tiled courtyard", "7:30 PM · Dinner & dancing · The cloister terrace"; a fourth row with a bow-tie tile "DRESS CODE · Summer formal". Below, on the whitewashed wall, the venue photograph (from the attached venue.jpg) inside a wide landscape azulejo panel with the same painted baroque cobalt frame and crest; under it "QUINTA DA ANDORINHA AZUL · SINTRA, PORTUGAL" in spaced capitals and an outlined terracotta button "View map".

Screen 5 — RSVP: the whitewashed wall with leaf shadows. A tall glaze-white reply card fills most of the screen, a hand-painted cobalt medallion with acanthus scrolls at its head and a fine cobalt double line down its sides: the heading "Kindly Reply" in the script, the italic line "by April 30, 2027", then a real, readable form in cobalt ink: "Your name" on a fine underline, "Will you join us?" with two round options "Joyfully accepts" and "Regretfully declines", "Number of guests" as a select showing "2", "Your meal preference" as a select showing "Fish", and a full-width cobalt button "Send reply" with glaze-white text. Two painted cobalt swallows fly up from the card's upper right corner. At the bottom of the screen, partly behind the card, a small courtyard wall fountain: a little panel of cobalt tiles in a limestone surround, a thin clear stream falling from a carved limestone shell into a half-round limestone basin of clear water catching the sun, and beside it a terracotta pot of white jasmine.

All five screens share one world (the same whitewash, cobalt tiles, terracotta, limestone, paper and light) but each has its own composition — not all centred. Use exactly this English sample text and no other words. Photos show the fictional adult couple only, natural and tasteful, not resembling any real or famous person. No device frames or bezels, no hands, no laptop, no marketing collage, no logos, no watermarks, no captions outside the screens. This is a design reference board, not a final website.
```
Kontrol: 5 ekran yan yana, her biri ~390:844; 1. ekranda badana duvar + yaprak gölgeleri + çini süpürgeliği, dikey zarf, kapak
ayrı kalın karolardan 6 sütun basamaklı (merdiven, V/yay değil), sicim çapraz, en alt basamakta kırlangıçlı karo; 2. ekranda
kemerli kireç taşı niş, portrenin köşesinde dönen karolar (terrakota sırt görünüyor), boyalı kırlangıç, ev numarası çinisi
geri sayım; 3. ekranda boyalı barok çini panosunda fotoğraf dalga hâlinde açılıyor, önünde kırlangıç; 4. ekranda tek figürlü
karo ikonları + geniş çini panosunda mekân; 5. ekranda okunur form + duvar çeşmesi + iki kırlangıç. Altın/metal, sarı/limon,
pembe/mor, tramvay, horoz, bayrak, Portekiz gitarı, dini figür, zellige, kapı, fener, mühür yok. Başlık harfi güneşli İber el
yazısı (resmî copperplate değil). Metindeki küçük harf bozuklukları kabul (yalnız referans). Sıradan ya da zayıfsa yeniden
üret (en çok 3 deneme); W2 bu panodan türer.
Kullanım: Claude'un yerleşim, tipografi ölçeği ve renk referansı; zarfın ekran genişliğine oranı, nişin ve kartların yeri,
dalga ve kırlangıcın davranışı buradan ölçülür.

### W2 — Parçalar (panodan türer; HER parçada `design-board.png` referans görsel; YAZI YOK)

Ortak kurallar: tek görselde tek nesne · şeffaflar gerçek alfa · zemine düşen gölge yok · nesnenin dışında ışıma/hâle/ışın yok
(güneş parıltısını, karo gölgesini, su pırıltısını site CSS ile ekler) · ışık sol üstten · oran önemli, piksel değil · karo,
yaprak, çiçek, derz **sayısı** önemli değil, sayı için yeniden üretme.

**Zarf tuvali (W2.1–W2.3, 1024×1536, aynı konum):** zarf kutusu x %8–92 · y %15–85 (≈4:5); cep üst kenarı y %41,5;
sicimin dikey kolu x %50, yatay kolu ve düğüm y %61,7. Kapak çizilmez (Claude karolardan kurar). Önce W2.1; W2.2 ve W2.3
**W2.1'i düzenleyerek**. **Karo tuvali (W2.5–W2.9 ve W2.17, 1024×1024, aynı kare):** karo x %10–90 · y %10–90. Önce W2.5;
W2.6–W2.9 **W2.5'i düzenleyerek**; W2.10 **W2.9'u**, W2.11 **W2.10'u düzenleyerek**. Araç düzenleme yapamıyorsa referans
ver ve kutuyu aynı piksellerde tut.

#### W2.1 Zarfın arkası — açık, kapaksız (terrakota astar görünür)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/envelope_back.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the envelope on screen 1 of the attached design board — but drawn OPEN and WITHOUT its tile flap (the flap's tiles are separate images). ONE back panel of a portrait envelope, alone, seen perfectly straight from the front, no perspective, no tilt. Placement on the canvas, exactly: its left edge at 8% and its right edge at 92% of the image width, its top edge at 15% and its bottom edge at 85% of the image height (a portrait rectangle of about 4:5 with crisp square corners). Its top edge is a clean straight cut: there is no paper flap at all. We see the inside of the envelope: it is lined with warm matte terracotta paper (#AE583A, deepening to #8C4128 toward the bottom) printed by hand with a small, even, slightly worn repeat of tiny cobalt (#1F4A9E) four-petal rosettes and dots, like a miniature azulejo motif; a slim margin of creamy glaze-white cotton paper (#FAF8F2), about 3% of the image width, shows along the top and both sides of the lining, and the paper's thickness shows as a hair-thin edge along the top. Nothing else: no pocket, no card, no twine, no tiles. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow or halo outside the envelope. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: kutu x %8–92 · y %15–85 (±%2); üst kenar düz (kapak yok); terrakota astar + küçük kobalt rozet deseni, üstte ve
yanlarda ince sır beyazı pay; cep/kart/sicim/karo yok; gerçek alfa.
Kullanım: zarfın en arka katmanı; kapalıyken üst kısmı Claude'un dizdiği kapak karolarının altında kalır; karolar uçunca açık
zarfın içi olarak görünür; kart bunun önünde, cebin arkasında yükselir.

#### W2.2 Zarfın ön cebi (aynı tuval)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/envelope_pocket.png` · 1024×1536 · **Şeffaf zemin**

```
The front pocket of the SAME envelope as the attached envelope_back.png (give envelope_back.png and design-board.png as the reference images, and edit envelope_back.png if the tool allows): the same 1024×1536 canvas, the same scale and the same straight front view; its left, right and bottom edges sit on exactly the same pixels as the envelope's (x 8% and 92%, bottom at 85%). The pocket spans the full width of the envelope, from a perfectly straight, crisp, horizontal top edge at 41.5% of the image height down to the envelope's bottom edge at 85%. It is thick creamy glaze-white cotton paper (#FAF8F2), calm and mostly plain, with the soft fold lines of its two side flaps and its bottom flap just visible, and the paper's thickness showing as a hair-thin edge along the cut top edge. Painted by hand in cobalt ink (#1F4A9E, pooling to #102554) with the same brush as the tiles: one fine line just below the top edge, and along the bottom, from 10% to 90% of the image width and about 2% above the bottom edge, a narrow band (about 4% of the image height) of a wavy ribbon with tiny rosettes in its curves, softly wet-edged like watercolour. Everything above the pocket's top edge is completely transparent (no lining, no back, no card). One soft warm morning light from the upper left; a hair-fine contact shade only on the paper itself. No cast shadow or drop shadow, no glow outside the pocket. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: envelope_back.png'nin üstüne %50 saydam konunca sol, sağ ve alt kenar çakışıyor (gözle kayma yok); üst kenar düz,
y ≈%41,5; altta boyalı kobalt kurdele bandı; üstü tamamen şeffaf; gerçek alfa.
Kullanım: kartın önündeki cep; kart bunun arkasından yükselir, dudağını geçince öne gelir; kapalıyken basamaklı karo kapağın
altında görünen sakin beyaz yüzey.

#### W2.3 Jüt sicim — çapraz bağ ve düğüm (aynı tuval)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/envelope_twine.png` · 1024×1536 · **Şeffaf zemin**

```
Only a length of natural jute twine tied round the SAME envelope as the attached envelope_back.png, drawn exactly where it lies on it — the same 1024×1536 canvas, the same scale and the same straight front view (edit envelope_back.png if the tool allows, then remove the envelope: the envelope itself is NOT drawn here). One vertical strand runs straight down the centre at 50% of the image width, from the envelope's top edge (15% of the height) to its bottom edge (85%), turning over in a tiny soft bend at both ends as if it continues behind; one horizontal strand runs straight across at 61.7% of the image height, from the envelope's left edge (8% of the width) to its right edge (92%), turning over in a tiny bend at both sides. The two strands meet at (50%, 61.7%) in a small, neat, slightly loose square knot, and two short loose ends hang from the knot down and to the right, the longest reaching about (57%, 71%), each ending in a few frayed fibres. The twine is about 1% of the image width thick: two twisted plies of natural golden-tan jute (#B58E5E with lighter #D2B48A fibres) with fine stray fibres. One soft warm morning light from the upper left; a whisper of contact shade only on the twine itself. Everything except the twine is fully transparent: no envelope, no tile, no paper. No cast shadow or drop shadow, no glow outside the twine. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: dikey kol x %50 (y %15–85), yatay kol y %61,7 (x %8–92); düğüm (%50, %61,7), iki kısa saçaklı uç sağ alta; zarf/karo
çizilmemiş; gerçek alfa.
Kullanım: en üst katman; Claude düğümden dikey kol (düğüm + uçlar onunla), sol kol, sağ kol diye üçe keser: düğüm gevşer,
dikey kol aşağı kayar, kollar yanlara kayıp söner. Ölçülen düğüm = kapanış karosunun merkezi.

#### W2.4 Zarftan yükselen davetiye kartı (boş)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/invite_card.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the invitation card that rises out of the envelope. ONE flat portrait invitation card, alone, seen perfectly straight from the front, about 5:7, spanning from 14% to 86% of the image width and from 16% to 84% of the image height, centred: thick creamy glaze-white cotton card (#FAF8F2) with a fine soft tooth, crisp square corners and a hair-thin visible card edge. Hand-painted in cobalt ink (#1F4A9E, pooling to #102554) with a loaded brush, softly wet-edged like the tiles: a fine double border line inset about 6% from the card's edge, a tiny quarter-rosette in each of the four inner corners, and at the top centre, just inside the border, a small round wreath of olive leaves about 14% of the card's width whose centre is EMPTY paper (the website may set the couple's initials there as live text). Everything inside the border below the wreath, from 30% to 80% of the image height, is COMPLETELY EMPTY calm paper (the website sets the names, the date and the place there as live text): no ornament, no line, no stain, no shading change. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow outside the card. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek kart ~5:7; ince kobalt çift bordür, dört iç köşede minik çeyrek rozet, üst ortada içi boş zeytin çelengi;
y %30–80 tamamen boş; gerçek alfa.
Kullanım: cepten yükselen kart (isimler, tarih, yer canlı metin; çelenkte istenirse `initials`); Claude zarf genişliğinin
~%88'ine ölçekler; view transition ile home kartına geçer.

#### W2.5 Desen karosu — çeyrek madalyon (ayna-döşeme kaynağı)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_pattern.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the tiles of the envelope's stepped flap on screen 1 of the attached design board. ONE single square hand-made Portuguese-style ceramic tile, alone, lying perfectly flat and seen exactly straight on from above, no perspective, no tilt: the tile fills exactly from 10% to 90% of the image width and from 10% to 90% of the image height (a perfect square). Thick creamy white tin glaze (#FAF8F2) with a calm, even satin gloss — no bright reflection spot, no light streak and no gradient across the face (the website adds the sheen) — slightly irregular hand-cut edges with softly rounded corners and a hair-thin terracotta body just visible at the rim. Painted by hand in cobalt (#1F4A9E, pooling to night blue #102554 where the brush rested) with soft wet-edged strokes and gentle wash variations. The design is ONE QUARTER of a large repeating pattern, because the website mirrors this tile left-to-right and top-to-bottom to set whole panels: the exact centre of a large round medallion sits on the tile's TOP-LEFT corner — a quarter of a four-petal rosette fills that corner, ringed by a quarter circle of small stylised carnation buds and a fine painted ring; the exact centre of a secondary motif sits on the BOTTOM-RIGHT corner — a quarter of a cross of four curling acanthus leaves; between them sweeping acanthus scrolls fill the rest of the face. Every painted line that reaches an edge meets it cleanly, so that mirrored copies continue the pattern across the joints. An original pattern invented for this design. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow outside the tile. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek düz kare karo, x/y %10–90 (±%1,5); sol üst köşede çeyrek rozet + karanfil halkası, sağ alt köşede çeyrek akantus
haçı; yüzde parlak nokta/ışık çizgisi/gradyan yok; gerçek alfa. (Claude 2×2 ayna dizip madalyonun kapandığına bakar; küçük
uyumsuzluk için yeniden üretilmez.)
Kullanım: bütün çini yüzeylerin tek kaynağı: basamaklı zarf kapağı (26 ayrı karo, ayna-döşeme), foto mozaiği örtüleri, home
nişinin çevresine "yerleşen" karolar, teşekkür panosu; her karo ayrı 3B katman, arka yüzü tile_bisque; parlaklık CSS ile.

#### W2.6 Karonun arkası — sırsız terrakota bisküvi (aynı kare)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_bisque.png` · 1024×1024 · **Şeffaf zemin**

```
The unglazed BACK of the same tile as the attached tile_pattern.png (give tile_pattern.png and design-board.png as the reference images, and edit tile_pattern.png if the tool allows): the same 1024×1024 canvas, exactly the same square box (10–90% of the width and of the height), the same irregular outline and softly rounded corners, lying flat, seen straight on. Warm terracotta biscuit (#AE583A, with lighter dusty #E4A688 patches and deeper #8C4128 in the hollows), matte and slightly sandy, with a few shallow parallel ridges pressed into the clay, a faint ring of dried white lime mortar near one corner, and the thin rim of white glaze just visible at the edge. No pattern, no stamp, no mark. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow outside the tile. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tile_pattern ile aynı kutu ve dış çizgi (%50 saydam üst üste: kayma yok); sırsız terrakota; damga/harf yok; gerçek alfa.
Kullanım: dönen her karonun arka yüzü (kapak dalgası, kapanış karosu, foto mozaiği, programdaki ikon karoları, teşekkür panosu).

#### W2.7 Bordür karosu (aynı kare)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_border.png` · 1024×1024 · **Şeffaf zemin**

```
A BORDER tile from the same set as the attached tile_pattern.png (give tile_pattern.png and design-board.png as the reference images, and edit tile_pattern.png if the tool allows): the same 1024×1024 canvas, exactly the same square box (10–90% of the width and of the height), the same glaze, hand-made edges, calm satin gloss and cobalt brushwork, lying flat, seen straight on. Its painting: a broad wavy cobalt ribbon runs horizontally across the middle of the face from the left edge to the right edge, with a small four-petal rosette in each of its two curves; a fine straight cobalt line runs along the top edge and another along the bottom edge. Where the ribbon and the two lines meet the left and right edges they are at exactly the same height and thickness, so that tiles set side by side make one continuous border. No bright reflection spot, no gradient. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow outside the tile. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: aynı kutu; kurdele ve iki çizgi sol ve sağ kenarda aynı yükseklikte (yan yana sürekli bordür); gerçek alfa.
Kullanım: sayfa altındaki duvar süpürgeliği (silhar), kart ve bant kenar sıraları, foto mozaiğinin kenar karoları; yatay
dizilir, dikey kenarda 90° döndürülür.

#### W2.8 Düz karo — "ev numarası çinisi" (aynı kare)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_plain.png` · 1024×1024 · **Şeffaf zemin**

```
A PLAIN tile from the same set as the attached tile_pattern.png — the kind of tile used for hand-painted house numbers — (give tile_pattern.png and design-board.png as the reference images, and edit tile_pattern.png if the tool allows): the same 1024×1024 canvas, exactly the same square box (10–90% of the width and of the height), the same glaze, hand-made edges and light, lying flat, seen straight on. Its painting is only a fine double cobalt border line inset about 8% from the tile's edge and one tiny cobalt dot-flower in each corner inside it; the whole centre, from 25% to 75% of the image width and height, is COMPLETELY EMPTY white glaze (the website paints numbers and short words there as live text). No bright reflection spot, no gradient. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow outside the tile. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: aynı kutu; yalnız ince çift kobalt çerçeve + köşelerde minik nokta-çiçek; orta (%25–75) tamamen boş; gerçek alfa.
Kullanım: geri sayım hücreleri (rakamlar canlı metin; saniye karosu dönerek değişir), story'de I · II · III sayfa işaretleri,
RSVP teşekkür satırı.

#### W2.9 Kapanış karosu — kırlangıç (aynı kare)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_swallow.png` · 1024×1024 · **Şeffaf zemin**

```
The CLASP tile of the envelope, from the same set as the attached tile_pattern.png (give tile_pattern.png and design-board.png as the reference images, and edit tile_pattern.png if the tool allows), matching the loose tile at the lowest step of the flap on screen 1 of the attached design board: the same 1024×1024 canvas, exactly the same square box (10–90% of the width and of the height), the same glaze, hand-made edges, light and cobalt brushwork, lying flat, seen straight on. In its centre ONE swallow in flight, seen from below, wings spread wide, a deeply forked tail, painted in confident loaded cobalt strokes (darker night-blue pools at the wing roots and the head, a few tiny unpainted glaze highlights), the bird spanning about 56% of the image width with its body at the exact centre; around it a round wreath of small olive leaves painted lightly, not touching the bird; a quarter rosette in each corner and a fine double cobalt line framing the face. A painted picture flat on the glaze — not a raised or 3D ceramic bird. No bright reflection spot, no gradient. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow outside the tile. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: aynı kutu; ortada boyalı tek kırlangıç (alttan, kanatlar açık, çatal kuyruk) + zeytin çelengi + köşe rozetleri;
kabartma/3B kuş değil; gerçek alfa.
Kullanım: zarfın kapanışı (en alt basamakta, düğümün altında, ≈1,2× karo); açılışta 3B döner, 90°'de swallow_glide kalkar,
arka yüzü tile_bisque; favicon ve og'de kapanış.

#### W2.10 Kırlangıç — karodan kalkan boyalı kuş, süzülüş (aynı kare)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/swallow_glide.png` · 1024×1024 · **Şeffaf zemin**

```
The painted swallow of the attached tile_swallow.png, lifted off its tile (give tile_swallow.png and design-board.png as the reference images, and edit tile_swallow.png if the tool allows): the same 1024×1024 canvas, the bird at exactly the same place, size and pose — seen from below, wings spread wide, a deeply forked tail — but the tile, the glaze, the olive wreath, the corner rosettes and the border lines are all gone. What remains is only the swallow itself as living cobalt brush painting: the same confident wet-edged cobalt strokes (#1F4A9E, pooling to #102554), the same few tiny unpainted highlights now showing as pale glaze-white specks (#FAF8F2) inside the bird, a faint glossy glaze sheen on the paint, so that it reads as the painted bird that has peeled off the tile and come alive. Not a photograph of a real bird, not a 3D ceramic figurine, no added outline. Everything outside the bird is fully transparent. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow or halo outside the bird. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tile_swallow'daki kuşla aynı yer, boy ve poz (%50 saydam üst üste: çakışıyor); karo/çelenk/çizgi yok; boyalı kobalt
fırça kuşu (fotoğraf ya da seramik biblo değil); gerçek alfa.
Kullanım: açılışta karodan kalkıp ekranda yay çizen kılavuz kırlangıç; sitede her açılış dalgasının önünde uçar (CSS motion
path), home'da nişe süzülür, RSVP'de ikinci kopyayla havalanır; swallow_wingsup ile kanat çırpar.

#### W2.11 Kırlangıç — kanatlar yukarıda (aynı kare)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/swallow_wingsup.png` · 1024×1024 · **Şeffaf zemin**

```
The SAME painted swallow as the attached swallow_glide.png (give swallow_glide.png and design-board.png as the reference images, and edit swallow_glide.png if the tool allows): the same 1024×1024 canvas; the body, head and forked tail at exactly the same place, size and angle; the same cobalt brush painting and pale glaze-white specks. Only the wings have changed: both raised high above the body in a V at the top of a wingbeat, slightly cupped, the wingtips staying at least 8% inside the top edge. Everything outside the bird is fully transparent. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow or halo outside the bird. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: gövde ve kuyruk swallow_glide ile aynı yerde; kanatlar yukarıda V; kenara değmiyor; gerçek alfa.
Kullanım: glide ↔ wingsup ardışık (`steps`) = kanat çırpma; süzülürken yalnız glide.

#### W2.12 Kireç taşı kemerli niş — home portresi (açıklık şeffaf)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/frame_niche.png` · 1024×1536 · **Şeffaf zemin** · açıklık şeffaf

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the arched niche around the couple's portrait on screen 2 of the attached design board. ONE shallow arched wall niche, alone, seen perfectly straight from the front, photographed for real: a moulded surround of pale warm limestone (#E9E1D2, fine natural pores, softly worn edges) with a round-arched top and a small plain keystone, and at the bottom a projecting limestone ledge (a sill) about 7% of the image height. Just inside the limestone a band of hand-painted cobalt border tiles one tile wide (a wavy ribbon with small rosettes, cobalt #1F4A9E on creamy glaze #FAF8F2, fine ivory grout lines between the tiles) lines the opening up both sides, round the arch and along the bottom. The whole niche spans from 8% to 92% of the image width and from 6% to 94% of the image height. In the middle the round-arched opening — straight sides and a semicircular top — from 20% to 80% of the image width and from 19% to 81% of the image height, is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it: no wall, no glass, no picture); the tile band and the limestone close all the way round it. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow or halo outside the niche. No plants, no pots, no birds. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: kemerli açıklık (x %20–80 · y %19–81) tamamen şeffaf, halka (çini bandı + kireç taşı) kesintisiz kapalı; altta çıkıntılı
eşik; bitki/kuş yok; gerçek alfa.
Kullanım: home portresi (maske = şeffaf kemer açıklığı); portre tile_pattern mozaiğiyle diyagonal dalga hâlinde açılır;
açılıştan uçan karolar nişin çevresine "yerleşir"; teşekkür modunda teşekkür fotoğrafı.

#### W2.13 Boyalı barok çini panosu — story çerçevesi (pencere şeffaf)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/frame_panel.png` · 1024×1536 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the framed tile panel around the story photograph on screen 3 of the attached design board. ONE portrait azulejo panel frame, alone, seen perfectly straight from the front, photographed for real: a painted baroque frame (a "moldura") on hand-made glazed tiles — broad cobalt (#1F4A9E, night blue #102554 in the deepest strokes) acanthus scrolls and small carnation garlands painted with soft wet-edged strokes on creamy white tin glaze (#FAF8F2) — with fine ivory grout lines forming a visible grid of square tiles across the whole frame and slightly irregular hand-made tile edges along its outline. At the top centre the frame rises in a scalloped crest of scrolls holding a small EMPTY oval cartouche (plain glaze inside); at the bottom centre a scrolled apron holds a wider EMPTY cartouche (plain glaze inside). The whole frame spans from 6% to 94% of the image width and from 7% to 93% of the image height. In the middle a rectangular window, from 18% to 82% of the image width and from 22% to 74% of the image height (about 4:5), is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it); a fine painted terracotta (#AE583A) line runs round the window's edge, and the frame closes all the way round it. An original pattern invented for this design; no saints, angels, figures or religious motifs. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow or halo outside the frame. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: pencere (x %18–82 · y %22–74, ≈4:5) tamamen şeffaf ve halka kapalı; üstte boş oval kartuşlu tepelik, altta boş
kartuşlu etek; derz ızgarası görünür; figür/dini motif yok; gerçek alfa.
Kullanım: story'nin üç anı (sol–sağ–sol) ve home'daki hikâye tanıtımı; fotoğraf tile_pattern mozaiğiyle açılır, önünde
swallow_glide uçar; kartuşlara istenirse canlı metin (I, II, III).

#### W2.14 Geniş çini panosu — mekân çerçevesi (pencere şeffaf)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/frame_wide.png` · 1536×1024 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png and frame_panel.png as the reference images), matching the wide framed tile panel around the venue photograph on screen 4 of the attached design board. ONE landscape azulejo panel frame from the same family as frame_panel.png, alone, seen perfectly straight from the front, photographed for real: the same painted baroque cobalt frame of acanthus scrolls and small carnation garlands on hand-made glazed tiles with fine ivory grout lines and slightly irregular tile edges along its outline, a scalloped crest at the top centre holding a small EMPTY oval cartouche, and a low scrolled apron at the bottom centre. The frame spans from 5% to 95% of the image width and from 6% to 94% of the image height. In the middle a rectangular window, from 15% to 85% of the image width and from 22% to 81% of the image height (about 16:9), is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it); a fine painted terracotta (#AE583A) line runs round it, and the frame closes all the way round. No saints, angels, figures or religious motifs. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow or halo outside the frame. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: pencere (x %15–85 · y %22–81, ≈16:9) tamamen şeffaf ve halka kapalı; frame_panel ile aynı aile; boş kartuşlu
tepelik; gerçek alfa.
Kullanım: details'te mekân fotoğrafı (`venue`, 16:9) — mozaikle açılır; geniş ekranda home hikâye tanıtımı.

#### W2.15 Sır beyazı kart (3 dilim: üst süs · tekrarlanan orta · alt süs)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/card_glaze.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the tall reply card of screen 5 and the programme card of screen 4 of the attached design board. ONE tall card of thick creamy glaze-white cotton paper (#FAF8F2, fine soft tooth), alone, portrait 2:3, seen perfectly straight from the front, spanning from 8% to 92% of the image width and from 5% to 95% of the image height, with crisp square corners and a hair-thin visible card edge. Hand-painted in cobalt ink (#1F4A9E, pooling to #102554) by the tiles' own brush, softly wet-edged. It is designed so the website can cut it into three horizontal slices and stretch the middle one. TOP band (the top 20% of the card): a centred painted medallion — a four-petal rosette ringed with small carnation buds, about 16% of the card's width — flanked by two sweeping acanthus scrolls that taper into a fine double line running out toward both sides. MIDDLE band (from 20% to 86% of the card's height): plain paper with ONLY a fine double cobalt line running straight down each side, about 5% in from the edges, exactly the same at every height, nothing else; the card's left and right edges perfectly straight and vertical. BOTTOM band (the last 14%): the double lines turn the two corners and close along the bottom, with one small painted rosette at the bottom centre. No form fields, no photo window, no tiles, no grout. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow outside the card. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: orta bantta yalnız iki yandaki düz çift çizgi (yükseklik boyunca aynı, tekrarlanabilir); üstte madalyon + akantus,
altta küçük rozet; yan kenarlar dik; seramik/derz yok; gerçek alfa.
Kullanım: home davet kartı, details programı ve G138 blokları (travel, dress code, menü, registry, SSS), RSVP formu; Claude üst ·
orta · alt diye keser, ortayı içeriğe göre uzatır.

#### W2.16 Ayırıcı — kobalt fırça çizgisi ve rozet
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/divider_brush.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the small dividers of the attached design board. ONE delicate horizontal divider painted by hand in cobalt ink (#1F4A9E, pooling to #102554), alone, on nothing: at its exact centre a small four-petal rosette with two tiny carnation buds, about 8% of the image height, and from it a fine brush line runs level to both sides, swelling slightly and tapering to hair-fine points, with a light dry-brush texture toward its ends; the whole divider about 70% of the image width, perfectly level in the vertical middle of the canvas. Nothing else, plenty of empty space above and below. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ince yatay fırça çizgisi + ortada küçük rozet; uçlar kıl inceliğinde; kenarlara değmiyor; gerçek alfa.
Kullanım: başlık altları (home, story, details, rsvp); Claude dar şerit olarak kırpar; üstünden sabah ışığı süpürmesi.

#### W2.17 Program ikonları — tek figürlü karolar (figura avulsa), altı ayrı dosya (aynı kare)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/icon_rings.png`, `icon_glasses.png`, `icon_dinner.png`, `icon_guitar.png`, `icon_bowtie.png`, `icon_ship.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png and tile_plain.png as the reference images), matching the small programme tiles on screen 4 of the attached design board. ONE small single-figure tile in the old Portuguese manner ("figura avulsa"), alone, from the same set as tile_plain.png: the same 1024×1024 canvas, the same square box (10–90% of the width and of the height), the same creamy tin glaze, hand-made edges, calm satin gloss and cobalt brushwork, lying flat, seen straight on. In its centre ONE simple figure painted in bold, confident cobalt strokes (#1F4A9E, pooling to #102554), filling about 50% of the tile and clearly readable when the tile is shown at 40 px; a tiny cobalt dot-cross in each of the four corners; no border line, no other ornament. All six tiles of this set share exactly the same brush weight, colour, corner dots and style. No bright reflection spot. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow outside the tile. No text, letters, numbers or monogram. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make six separate images:
icon_rings = two interlocked wedding rings
icon_glasses = two wine glasses touching at the rim
icon_dinner = a round plate seen from the front with a knife and a fork beside it
icon_guitar = a classical acoustic guitar with the classic figure-of-eight body, slightly tilted (not the pear-shaped Portuguese guitar)
icon_bowtie = a gentleman's bow tie
icon_ship = a small sailing ship with two sails on three short wave lines
```
Kontrol: altı dosya, her birinde tek figürlü karo; tile_plain ile aynı kutu; hepsi aynı fırça kalınlığı ve köşe noktaları; 40
px'te okunuyor; harf/rakam yok; gerçek alfa.
Kullanım: details programı (etiketten eşleme: ceremony = rings, cocktail/champagne = glasses, dinner = dinner, dancing/music =
guitar, dress code = bowtie, travel & stay = ship); satır görününce karo 3B dönüp yerine oturur (arka yüz tile_bisque).

#### W2.18 Avlu duvarı — telefon zemini
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/courtyard.png` · 1024×1536 · opak

```
Production background for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the courtyard wall behind screens 1 and 5 of the attached design board. A full-frame vertical (2:3) photograph, edge to edge, of the sunlit whitewashed wall of an old quinta courtyard in the hills of Sintra on a summer morning, seen perfectly straight on: the upper 80% is calm lime-whitewashed plaster (#F2EDE3) with many thin limewash layers, a gentle hand-trowelled undulation, a delicate chalky bloom and here and there a very faint washed-out trace of old cobalt wash — very low contrast, so dark blue text reads on it everywhere; along the bottom, from 80% to 93% of the height, a dado of hand-painted cobalt azulejo tiles set flush in the wall — one row of border tiles with a wavy ribbon above two rows of medallion pattern tiles, fine ivory grout lines; from 93% to the bottom edge a strip of worn, sun-bleached terracotta floor tiles meeting the wall. Soft warm Atlantic morning sun from the upper left as a gentle light gradient across the plaster. NO leaf shadows, no plants, no pots, no windows, no doors, no arches, no lamps, no objects (they are separate images). Rich, true-to-life, luxurious photography with a subtle film grain. No text, letters, numbers, logos or watermarks.
```
Kontrol: tam opak; üst %80 sakin badana (orta kısım boş); altta çini süpürgeliği (%80–93) + terrakota zemin şeridi; yaprak
gölgesi, bitki, kapı, pencere, kemer yok; yazı yok.
Kullanım: index ve RSVP zemini (telefon); üstüne leaf_shadow (multiply), pot_jasmine ve fountain konur; home hero'nun ve
og'nin tabanı (geniş ekranda courtyard_wide).

#### W2.19 Avlu duvarı — geniş ekran
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/courtyard_wide.png` · 1536×1024 · opak

```
The same courtyard wall as courtyard.png (give courtyard.png and design-board.png as the reference images), now a full-frame horizontal (3:2) photograph, edge to edge, seen perfectly straight on: the same calm lime-whitewashed plaster in the upper part, the same dado of hand-painted cobalt azulejo tiles from 78% to 92% of the height (one row of border tiles above two rows of medallion pattern tiles), the same strip of sun-bleached terracotta floor below it, the same soft warm morning light from the upper left and the same film grain. The middle half of the width and the upper three quarters are calm and empty. NO leaf shadows, no plants, no pots, no windows, no doors, no arches, no objects. No text, letters, numbers, logos or watermarks.
```
Kontrol: courtyard ile aynı duvar, çini ve ışık; orta yarı sakin; opak.
Kullanım: 700 px ve üstü ekranlarda courtyard'ın yerine (index, home hero, RSVP); og görselinin zemini.

#### W2.20 Badana sıva — dikişsiz doku
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/wall_whitewash.png` · 1024×1024 · opak, dikişsiz

```
Production texture for the "Azulejo Mosaic" wedding website (give courtyard.png and design-board.png as the reference images), the whitewashed wall of the inner pages of the attached design board. A seamless, tileable square texture of the same sunlit lime-whitewashed plaster as courtyard.png, seen perfectly flat and straight on: warm soft white (#F2EDE3), thin limewash layers, a gentle trowelled undulation, faint soft brush marks, a delicate chalky bloom, at most one or two very faint washed-out traces of old cobalt wash. Very low contrast. Perfectly even lighting: no vignette, no gradient, no hotspot, no cracks, no stains, no tiles, so that four copies placed side by side join invisibly (the left edge continues the right edge, the top edge continues the bottom edge). No objects, no text, letters, numbers, logos or watermarks.
```
Kontrol: sakin badana, eşit ışık; 2×2 dizince dikiş görünmüyor (Claude dizip bakar; küçük dikişi ofsetle kendisi giderir — yalnız
bunun için yeniden üretme); opak.
Kullanım: home, story, details sayfalarının zemini (`background-repeat`), üstünde leaf_shadow ve sabah ışığı gradyanı.

#### W2.21 Yaprak gölgesi — güneşte yasemin ve zeytin (çarpma katmanı)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/leaf_shadow.png` · 1024×1536 · opak (beyaz zemin, multiply)

```
Production light overlay for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), the dappled leaf shadows that fall across the whitewashed walls of the attached design board. A full-frame vertical (2:3) image of ONLY SHADOWS on a pure flat white ground (#FFFFFF): the soft, sun-cast shadows of a jasmine vine and a few sprays of an old olive tree hanging over a courtyard wall from a pergola above and to the left — slender olive leaves, small jasmine leaves and star-shaped flower clusters, a few long trailing stems — in a cool, transparent-looking blue-grey (#8E9AAE at its darkest, most shadows much lighter), crisp where the stems are close to the wall and soft and blurred where they are further away, with small bright gaps of sunlight between the leaves. The shadows come in from the top-left corner and run along the top edge and down the left edge, with one lighter spray reaching in from the right edge; the middle and the whole lower half of the image stay almost completely white. Only the shadows: no actual leaves, flowers or branches, no wall texture, no colour, no gradient on the white ground. No text, letters, numbers, logos or watermarks.
```
Kontrol: zemin düz saf beyaz; yalnız mavi-gri yaprak gölgeleri (sol üst köşe, üst ve sol kenar yoğun, sağdan tek hafif dal);
orta ve alt yarı neredeyse beyaz; gerçek yaprak, renk, doku yok; opak.
Kullanım: Claude `mix-blend-mode: multiply` ile badana üstüne koyar (beyaz görünmez), düşük opaklıkta yavaşça salındırır;
index'te tam, iç sayfalarda köşede; açılışta "kıpırdar".

#### W2.22 Güneşte solmuş terrakota saksı + yasemin
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/pot_jasmine.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the terracotta pot of jasmine on screens 1 and 5 of the attached design board. ONE old sun-bleached terracotta pot planted with a jasmine bush in flower, alone, seen from the front at a slightly high eye level, photographed for real: a classic hand-thrown rounded pot with a rolled rim in warm unglazed terracotta (#AE583A) faded by years of sun to dusty #E4A688 on its upper side, a soft white lime bloom near the base and one small old chip in the rim; from it rises a loose, airy jasmine bush — slender twining stems, small dark-green leaves kept muted, many small white star-shaped five-petal flowers and a few pale buds (white only, no pink) — a few stems trailing over the rim. The pot and plant span about 15–85% of the image width and 8–92% of its height, the pot in the lower half. No saucer, no ground, no shelf, no tiles. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek saksı, güneşte solmuş terrakota, kireç izi; beyaz yasemin (pembe yok); zemin/tabak yok; gerçek alfa.
Kullanım: index sağ alt köşede zemine basar (hafif paralaks), RSVP'de çeşmenin yanında, home imzasında ("Open the envelope
again" üstünde); 404/teşekkür modunda küçük süs.

#### W2.23 Avlu duvar çeşmesi (chafariz)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/fountain.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the small wall fountain at the bottom of screen 5 of the attached design board. ONE small Portuguese courtyard wall fountain, alone, seen perfectly straight from the front at eye level, photographed for real: a narrow upright panel of hand-painted cobalt azulejo tiles (two tiles wide and three high, the medallion pattern forming one round medallion, fine ivory grout lines) framed by a moulded pale limestone surround (#E9E1D2) with a small scrolled limestone crest on top; from a carved limestone scallop-shell spout at the foot of the panel a thin, clear, glassy stream of water falls into a half-round limestone basin below; the basin's front edge is moulded, and it is filled to just under its rim with clear, still water catching the morning light in a few soft bright reflections. The whole fountain spans about 18–82% of the image width and 6–94% of its height. No plants, no pots, no faces or masks, no coins, no figures, no religious motifs, no floor. One soft warm morning light from the upper left. No cast shadow or drop shadow, no glow or halo outside the fountain. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek duvar çeşmesi: 2×3 çini panosu (tek madalyon) + kireç taşı çerçeve ve tepelik, deniz kabuğu ağız, ince su akışı,
yarım yuvarlak havuz; yüz/maske/bitki yok; gerçek alfa.
Kullanım: RSVP sayfasının altında (kartın arkasından görünür); akışta ve havuz yüzeyinde CSS ışık pırıltısı (maske = suyun
alfa bölgesi); gönderilince havuzda halka halka dalga, iki kırlangıç havalanır; çeşme şırıltısı sesi.

#### W2.24 Süzülen küçük nesneler — iki ayrı dosya
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/float_jasmine.png`, `float_leaf.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Azulejo Mosaic" wedding website (give design-board.png as the style reference), matching the drifting jasmine and olive leaves of the attached design board. ONE single small object, alone, photographed for real, centred, not cropped, generous empty margin all round. One soft warm morning light from the upper left. Nothing else: no surface, no other objects, no dust, no sparkle. No cast shadow or drop shadow, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make two separate images:
float_jasmine = one single white jasmine flower with five star-shaped petals and a short slender tube, seen slightly from above, filling about 40% of the square (white only, no pink)
float_leaf = one single slender olive leaf, silvery grey-green (#7C8A6A) on top with its paler underside showing at one gently curled edge, lying on a diagonal, filling about 60% of the diagonal
```
Kontrol: iki dosya, her birinde tek nesne; yasemin beyaz (pembe yok), zeytin yaprağı gümüşi; yüzey/parıltı yok; gerçek alfa.
Kullanım: açılışın sonunda 6–8 kopya süzülür (Claude döndürür/ölçekler), story'de 2–3, RSVP gönderilince yeniden.

### Instructions for GPT — iş sırası ve teslim (PAKET 8)

```
Work only on PAKET 8 of collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md in the repository muzaffergrl/davetiye-maker (branch main). Ignore every other section of that file: PAKET 2, 3, 6R and 7 are done or cancelled, PAKET 5R is the old look that this package replaces, and the note at the top of the file (whitewash_ground / env_back / flap as style references, green photo windows) does NOT apply to PAKET 8. Do NOT attach any image that existed in collections/30_Azulejo_Mosaic/assets/gpt/parts/ before this package (env_*, flap*, twine, tile_front, tile_back, mosaic_tile_*, card_small, niche_frame, story_frame, venue_frame, corner_spray, divider, terracotta_pot, accent_*, glaze_paper, whitewash_ground, web_hero), nothing from platform/themes/azulejo-mosaic/img/, no design board of another design, and not photos/story_2.jpg.

1. ONE chat, in this order. Send the "Instructions for GPT (send before the first image)" message of PAKET 8 first. Then W1, the design board: attach collections/30_Azulejo_Mosaic/assets/gpt/photos/hero_portrait.jpg, story_1.jpg and venue.jpg as the identity reference of the couple and the venue only. The board is the design; if it is weak, looks ordinary or misses its Kontrol line, make it again before going on (at most 3 tries). Commit and push the board as soon as it is chosen.
2. Then W2, one image per prompt, in the order W2.1 to W2.24, in the same chat. Give the finished design-board.png as the reference image of EVERY W2 image. The aligned groups must line up: make W2.1 envelope_back first, then W2.2 envelope_pocket and W2.3 envelope_twine by EDITING envelope_back.png (same 1024×1536 canvas, same envelope box); make W2.5 tile_pattern first, then W2.6 tile_bisque, W2.7 tile_border, W2.8 tile_plain and W2.9 tile_swallow by EDITING tile_pattern.png (same 1024×1024 canvas, same square); make W2.10 swallow_glide by EDITING tile_swallow.png and W2.11 swallow_wingsup by EDITING swallow_glide.png. Also give the extra references named in each prompt: frame_panel.png for W2.14, tile_plain.png for the six W2.17 icons, courtyard.png for W2.19 and W2.20. If your tool cannot edit, attach the base image as a reference and keep the box on the same pixels. Check by laying each one over its base at 50% opacity: the outline (for the swallows: the bird's body) must sit in the same place at the same size; regenerate once if a shift is plainly visible and write any remaining difference in TESLIM.txt.
3. Use each English prompt exactly as written. One object per image. No text, letters, numbers, monograms, logos or watermarks in any W2 image (sample text is allowed on W1 only). In the two multi-image prompts (W2.17 icons, W2.24 floats) each listed line is its own image and its own file.
4. Keep each image in the ratio of its Kaydet size: 1:1, 2:3 or 3:2 (W1 about 2.3:1). The pixel size may differ. Do not resize, crop, mirror, repaint or recolour any pixel with code — Claude crops, mirrors, assembles the tiles and cuts the pieces.
5. Photo windows (W2.12 the niche, W2.13 the panel, W2.14 the wide panel) are TRANSPARENT openings; a ring that closes all the way round them matters more than the opening itself. Never fill them with green, white, glass or a picture.
6. Counts (tiles in a dado or panel, leaves, flowers, grout lines, rosettes) do not matter; never regenerate for a count. Regenerate only for: a wrong object; text present; a cast/drop shadow or a glow outside the object; a fake background (white or checkerboard) instead of real alpha; an object touching the canvas edge; a wrong ratio; a photo window that is not transparent or not closed; a tile that is not a flat, straight-on square or that has a bright reflection spot; a swallow that is a photograph or a 3D ceramic figurine instead of cobalt brush painting; leaf_shadow with real leaves, colour or wall texture instead of shadows on white; gold, yellow, pink or purple anywhere; or an aligned-group part that plainly does not line up with its base. At most 2 attempts per part; then keep the best one, note the defect and move on.
7. Delivery: commit every PNG to the repository at exactly the path on its Kaydet line, with exactly that file name (the parts in collections/30_Azulejo_Mosaic/assets/gpt/parts/, the board at collections/30_Azulejo_Mosaic/assets/gpt/mockups/design-board.png). No zip, no Downloads folder, no other folder, nothing under platform/ or docs/ (not docs/qa), no new folder, no download names, no "_final", "_v2" or "(1)" suffixes; rejected tries are not committed. Save as PNG. Push to branch main; only if you cannot push to main, push a branch named codex/g30-paket8 and say so on the first line of TESLIM.txt. Run git pull --rebase origin main before each push. Push after W1, then after W2.4, W2.11, W2.17 and W2.24 ("30 PAKET 8: W1", "30 PAKET 8: W2 1/4", …) so nothing is lost if the chat breaks; the last commit is "30 PAKET 8: teslim". Touch no other file, write no code, do not run gpt_yerlestir.py or build_images.py.
8. Finally write collections/30_Azulejo_Mosaic/assets/gpt/parts/TESLIM.txt in Turkish: branch and last commit; how many files were delivered (expected: the board + 30 parts); for every file the target size and the actual size, RGBA or RGB (real alpha channel or not), the number of attempts and every difference from its Kontrol line (be specific); the alignment results (envelope_pocket and envelope_twine against envelope_back; tile_bisque, tile_border, tile_plain, tile_swallow and the six icons against tile_pattern; swallow_glide against tile_swallow; swallow_wingsup's body against swallow_glide: shift yes/no, roughly how much); anything skipped and why; which reference images were attached; and one line confirming that no pixels were changed by code. If you cannot write to the repository at all, stop and say so clearly in the chat; do not hand the upload to the user.
```
