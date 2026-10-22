# GPT görsel istekleri — Tasarım 24 · Grand Theatre Premiere (yeniden tasarım, 2026-10-22)

> **Instructions for GPT:** This design ("Grand Theatre Premiere") is being REDESIGNED from scratch. Generate PAKET 5R
> (website layers) first, in order and in ONE chat, then PAKET 6R (printable invitation). **PAKET 2 sample photos
> already exist — do not regenerate them.** Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as
> written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text,
> letters, numbers, names, dates, initials, monograms, crests, logos, brand marks, QR codes or watermarks in any image**
> — the ticket stub is BLANK ivory card (no "admit one", no seat number, no serial number), the programme card is blank,
> no lettering on the valance, the footlights or the proscenium. It is an imaginary Belle Époque opera house: it must not
> resemble any real theatre, show, poster, brand, artist or another seller's design. Give W1 `page_ground.png`, W4
> `env_back.png` and W6 `curtain_left.png` as the style reference of every later part: the same warm ivory programme
> paper, the same peacock-teal linen envelope, the same deep burgundy silk velvet with heavy soft folds and antique gold
> bullion fringe, the same warm stage light from the top-left with a soft golden glow on gilding. Parts drawn on the same
> envelope canvas (W4, W5, W6, W7, W10, W11, W12) keep the envelope in exactly the same box.

Bu dosya tasarım 24'ün **bütün görsel parçalarının** tek kaynağıdır (yeniden tasarım: `docs/35_22_32_YENIDEN_TASARIM.md`
§4 satır 24; GPT görevi G224, tema G424). 18–20 Ekim Codex kapağı (`envelope-v3`, tek parça imagegen nesnesi) ve eski
PAKET 5/6 istekleri kaldırıldı (git geçmişinde). Tema 39 pilotunun yapısıyla yeniden kurulunca her parçanın nasıl
kullanılacağı aşağıdaki "Kullanım" satırlarındadır; gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar
(isimler, tarih, mekân, program) HTML'dir, hiçbir görsele pişirilmez. QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/24_Grand_Theatre_Premiere/assets/gpt/` altındaki `parts/`
  (PAKET 5R) ve `print/` (PAKET 6R). `photos/` (PAKET 2) zaten dolu, dokunma. Repoya yazamıyorsan dur ve bunu çıktında
  açıkça söyle; kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/24_Grand_Theatre_Premiere --paket 5` (oran, gerçek alfa, kenar
  payı, foto penceresi) + göz kontrolü. Tema yeniden kurulunca (G424) `python3 platform/themes/grand-theatre-premiere/build_images.py`
  ve `python3 tools/gpt_kuru_deneme.py --tema grand-theatre-premiere --sekil
  collections/24_Grand_Theatre_Premiere/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic product photography** — real peacock-teal linen paper, real deep burgundy silk velvet with
  heavy soft vertical folds and a rich pile sheen, real antique gold bullion fringe and silk tassels, real water-gilded
  carved wood, real thick ivory programme card, real antique brass — plus, only inside the envelope (W4 lining), a small
  **oil painting** of a stage. A Belle Époque opera house on a gala night: classic, romantic, rich, warm. Not cartoon,
  not flat vector, not a cinema, not a circus, not a cheap party print.
- Renkler: pit `#061416` · velvet `#0E3D40` · peacock `#16595B` · burgundy velvet `#5E1622` · burgundy deep `#3A0C14` ·
  antique gold `#C9A45C` · ivory `#F3EBD8` · ink `#1E2626`. Perdeler bordo; zarf keteni tavus mavisi; bütün metal ve
  saçaklar antik altın (parlak sarı değil); kâğıtlar sıcak fildişi.
- Işık: sıcak sahne ışığı **sol üstten**, varakta ve saçakta yumuşak altın parıltı; bütün parçalarda aynı. Şeffaf
  parçalarda gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk, nesnenin dışında gölge/hâle yok
  (gölgeyi site ekler).
- Foto penceresi (`#00FF00`) yalnız W14 `portrait_frame`, W15 `story_frame` ve W16 `venue_frame`'de; diğer parçalarda
  yeşil alan yok.
- **06 Art Deco'dan ayrı:** geometrik deco kapı yok, siyah-altın yok; yumuşak kadife perde. **23 Velvet Jewel Box'tan
  ayrı:** patlıcan moru, inci, yüzük yok. Gerçek bir tiyatroya, gösteriye, afişe, markaya benzemesin.

## Zarf geometrisi (W4–W7 ve W10–W12 buna göre)
Tuval **1600×1200** (yatay). Zarf kutusu **x %6–94, y %9,5–90,5** (zarf ≈1,45:1). Yedi katman **aynı tuvalde, aynı
kutuda** çizilir; Claude her birini kendi alfa kutusuna kırpar ve W4'ün kutusuna göre yerleştirir. Tuval yüzdeleri:
- **W4 arka (`env_back`):** zarfın tamamı x %6–94 · y %9,5–90,5; içi astar: ince tavus mavisi keten kenar payı içinde
  yağlı boya küçük sahne.
- **W5 ön cep / sahne önü (`env_front`):** tam genişlik x %6–94; üst kenarı yanlarda **y %61**'den ortada **%58**'e
  yükselen sığ dışbükey yay (sahnenin önündeki apron dudağı), altı zarfın alt kenarına (%90,5) kadar; dudak boyunca beş
  küçük pirinç ayak lambası kapçığı (sönük).
- **W6 sol perde (`curtain_left`):** x %6–51 · y %18–90,5; menteşesi zarfın **sol dış kenarı** (x %6); iç kenarı
  ortada hafif dalgalı, sağ perdenin üstüne ~%2 biner.
- **W7 sağ perde (`curtain_right`):** x %49–94 · y %18–90,5; menteşesi zarfın **sağ dış kenarı** (x %94).
- **W10 perde başlığı (`valance`):** sabit; x %6–94 · y %9,5–21 (üç yumuşak kadife swag), altın saçağı swag diplerinden
  y **%24**'e kadar sarkar; perdelerin üst ucunu (%18–21) örter.
- **W11 bilet koçanı (`ticket`):** x %40–60 · y %50,5–61,5 (≈2,4:1, düz, eğik değil); **delikli yırtma çizgisi dikey,
  x %54,6**'da (biletin solda büyük gövdesi, sağda küçük koçanı).
- **W12 püsküllü kordon (`rope`):** düğüm merkezi **(%50, %54)**; kordon perdelerin iki kenarını x %41–59 arasında
  yatay toplar (biletin üstünden geçer); iki püskül düğümden **x %47 ve %53**'te sarkar, uçları y **%74**.
- **Perde iç yüzleri (W8, W9)** ayrı tuvalde (800×1000): perde biçimi x %6–94 · y %6–94, **açılmış hâlde görüldüğü
  gibi** — sol perdenin iç yüzünde menteşe kenarı tuvalin **sağında**, sağ perdenin iç yüzünde **solunda**.
- Kat sırası (alttan üste): W4 arka → kart (W13) → W5 ön cep → W7 sağ perde → W6 sol perde → W10 başlık → W11 bilet →
  W12 kordon.

Açılış: bilet kordonun altından yukarı kayar ve delikli çizgiden ikiye yırtılır (Claude W11'i x %54,6'dan iki parçaya
kırpar; koçan dönerek düşer, gövde yukarı süzülüp söner) → kordon gevşer, püsküller sarkaç gibi sallanarak düşer →
salon ışığı kısılır (CSS) → perdeler dış menteşelerinde **3B** açılır (sol önce, sağ 140 ms sonra; ~115° perspektifle,
iç yüz W8/W9 görünür; zarf açılırken hafifçe küçülür ki kanatlar ekrana sığsın) → spot ışığı soldan astardaki sahneyi
tarar, ayak lambaları ısınır (CSS ışık) → fildişi program kartı (W13) cebin arkasından yükselir, dudağı geçince öne gelir
→ altın konfeti, bordo ve fildişi gül yaprakları (W20) süzülür → home. Başlık (W10) sabit kalır.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Fildişi program kâğıdı (sayfa zemini, kapak sayfası)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/page_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of fine warm ivory laid paper (#F3EBD8), the paper of a luxurious old opera programme: faint regular laid lines and wider chain lines pressed into the sheet, a gentle felt tooth, a few tiny scattered flecks of antique gold leaf (#C9A45C) — very sparse, no more than a dozen small flecks over the whole sheet — and the softest natural cloudiness. Evenly lit by warm light from the top-left, very low contrast, calm enough for dark ink text and large script names to read on it everywhere. No fold, no crease, no stain, no border, no frame, no printed pattern, no vignette, no shadow. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 ek yeri yok); sıcak fildişi `#F3EBD8` civarı; laid çizgileri çok hafif; altın pul çok seyrek; bordür/desen yok.
Kullanım: tema kurulunca açılış (kapalı zarf) sayfasının ve bütün iç sayfaların zemini.

#### W2 Fildişi program kartonu (kartlar, form)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of thick smooth ivory card stock (#F3EBD8, a touch warmer and smoother than laid paper), the heavy board of a gala programme cover: a very fine even felt surface, the faintest silky sheen, an even tone with only the gentlest variation. Evenly lit by warm light from the top-left. No laid lines, no flecks, no fold, no crease, no stain, no pattern, no border, no vignette, no shadow. Calm enough for fine dark text everywhere. Edges tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; düz, sakin fildişi karton; W1'den daha pürüzsüz; desen/pul yok.
Kullanım: tema kurulunca home kartı, story program sayfaları, details program kartı ve RSVP formunun kâğıdı.

#### W3 Tavus mavisi kadife (koyu bantlar)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/velvet_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of deep peacock-teal silk velvet (#16595B shading to #0E3D40), seen straight on and laid perfectly flat: a dense soft pile with the rich, slightly shifting sheen of real velvet, very subtle directional pile marks, no folds and no wrinkles. Evenly lit by warm light from the top-left, low contrast so ivory and gold text reads on it everywhere. No pattern, no embroidery, no stain, no vignette, no shadow. Edges tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; koyu tavus mavisi kadife, hafif tüy parıltısı; kıvrım/desen yok; üstünde fildişi yazı okunur.
Kullanım: tema kurulunca home davet bandı, imza bölümü ve details'teki koyu bantların zemini.

#### W4 Zarfın arkası — sahne astarı
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/env_back.png` · 1600×1200 · **Şeffaf zemin**

```
The back panel of an open horizontal envelope, seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 6–94% and y 9.5–90.5% of the 1600×1200 canvas (a rectangle about 1.45:1 with very slightly softened corners). Its outer rim is a slim margin of peacock-teal linen paper (#16595B, a fine visible linen weave) about 3% of the envelope's width all around. Inside the rim, the whole panel is lined with a small, rich OIL PAINTING of the empty stage of an imaginary Belle Époque opera house seen from the stalls: a gilded proscenium arch painted in perspective near the edges, a deep warm stage floor of polished boards receding toward a softly painted backdrop of a moonlit garden with tall dark trees and a pale sky, warm amber light pooled at the centre of the stage, the darker velvet wings at both sides. Visible fine brushstrokes and craquelure-free varnish sheen. The centre of the painting is calm and simple (an invitation card will stand in front of it). No people, no performers, no props, no curtains drawn across the stage, no flap, no pocket, no card. Warm stage light from the top-left on the linen rim. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf x %6–94 · y %9,5–90,5; ince tavus keten kenar; içi yağlı boya boş sahne (insan/perde yok), ortası sakin; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — perdeler açılınca görünen "sahne"; spot ışığı (CSS) bu resmin üstünden soldan sağa geçer, kart önünde yükselir.

#### W5 Zarfın ön cebi — sahne önü (apron)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/env_front.png` · 1600×1200 · **Şeffaf zemin**

```
Only the front pocket of the same horizontal peacock-teal linen envelope as env_back.png, on the same 1600×1200 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 6–94% and y 9.5–90.5% of the canvas; the pocket spans the full envelope width (x 6–94%) from its top edge down to the envelope's bottom edge at 90.5% of the canvas height. Its top edge is ONE shallow convex arc like the curved lip of a stage apron: it starts at 61% of the canvas height at both side edges and rises gently to 58% at the horizontal centre. Along that lip runs a narrow carved and water-gilded moulding (antique gold #C9A45C, a soft warm gleam), and set into the lip at even intervals are five small unlit antique brass footlight shells (half-domes opening upward). Below the moulding: plain peacock-teal linen paper (#16595B) with a fine visible weave and the soft fold lines of the side and bottom flaps barely visible. Warm stage light from the top-left. Everything above the lip is completely transparent. No curtain, no flap, no card, no light rays, no glow. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik; üst kenarı yanlarda %61, ortada %58'e yükselen sığ yay; varaklı pervaz + 5 sönük pirinç ayak lambası; üstü şeffaf; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; açılışta ayak lambalarının üstünde CSS ile sıcak ışık hâlesi yanar.

#### W6 Sol kadife perde (kapalı, dış yüz)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left.png` · 1600×1200 · **Şeffaf zemin**

```
Only the LEFT closed stage-curtain flap of the same horizontal envelope, on the same 1600×1200 canvas and in exactly the same place, on a fully transparent background — the envelope, the pocket and the right curtain are NOT drawn. The envelope occupies exactly x 6–94% and y 9.5–90.5% of the canvas; this flap covers x 6–51% and y 18–90.5% of the canvas: its outer left edge is straight along x 6% (its hinge), its top edge is straight at 18%, its bottom edge is straight at 90.5%, and its inner right edge falls in soft natural vertical folds around x 49–51%. It is deep burgundy silk velvet (#5E1622, shadows #3A0C14) hanging in six or seven heavy, soft, rounded vertical folds with a rich pile sheen on each fold crest, slightly gathered toward the centre near the middle height (where a cord will tie it); along its whole bottom edge a thick antique gold bullion fringe (#C9A45C, twisted cords with a warm gleam) about 4% of the canvas height ending exactly at 90.5%. Warm stage light from the top-left. Everything outside the curtain is completely transparent. No cord, no tassel, no ticket, no pelmet. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: x %6–51 · y %18–90,5; sol kenar düz (menteşe); bordo kadife ağır dikey kıvrımlar; altta altın saçak; kordon/bilet yok; gerçek alfa.
Kullanım: tema kurulunca kapalı sol kanat; açılışta sol dış kenarında ~115° 3B açılır (sağdan 140 ms önce), arka yüzü W8.

#### W7 Sağ kadife perde (kapalı, dış yüz)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right.png` · 1600×1200 · **Şeffaf zemin**

```
Only the RIGHT closed stage-curtain flap of the same horizontal envelope, the mirror twin of curtain_left.png, on the same 1600×1200 canvas and in exactly the same place, on a fully transparent background — the envelope, the pocket and the left curtain are NOT drawn. The envelope occupies exactly x 6–94% and y 9.5–90.5% of the canvas; this flap covers x 49–94% and y 18–90.5% of the canvas: its outer right edge is straight along x 94% (its hinge), its top edge straight at 18%, its bottom edge straight at 90.5%, and its inner left edge falls in soft vertical folds around x 49–51%. The same deep burgundy silk velvet (#5E1622, shadows #3A0C14), the same six or seven heavy rounded vertical folds slightly gathered toward the centre near the middle height, the same thick antique gold bullion fringe along the bottom edge ending exactly at 90.5%. Warm stage light from the top-left (so the light falls the same way as on the left curtain, not mirrored). Everything outside the curtain is completely transparent. No cord, no tassel, no ticket, no pelmet. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: x %49–94 · y %18–90,5; sağ kenar düz (menteşe); W6'nın ikizi, ışık yine sol üstten; altın saçak; gerçek alfa.
Kullanım: tema kurulunca kapalı sağ kanat (sol perdenin altında); açılışta sağ dış kenarında 3B açılır, arka yüzü W9.

#### W8 Sol perdenin iç yüzü (açıkken)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left_in.png` · 800×1000 · **Şeffaf zemin**

```
The INSIDE (back) of the left stage-curtain flap, alone, seen straight on as it appears once swung open, on a fully transparent background: the same outline as curtain_left.png mirrored left-to-right — its straight hinge edge is now on the RIGHT side of the shape. The shape spans x 6–94% and y 6–94% of the 800×1000 canvas: straight top edge, straight right edge (the hinge), straight bottom edge, and a softly folded free edge on the left. The inside is lined with antique gold silk (#C9A45C toward a deeper old gold) with a soft lustrous sheen running down the same heavy vertical folds, and a narrow band of the burgundy velvet (#5E1622) turned over along the free left edge and along the top; the same antique gold bullion fringe along the bottom edge. Warm stage light from the top-left. Not plain, not flat: real folds, real silk sheen. No cord, no tassel. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: menteşe kenarı sağda; altın ipek astar + serbest kenarda ve üstte bordo kadife şerit; kıvrımlar W6 ile uyumlu; altta saçak; düz renk değil; gerçek alfa.
Kullanım: tema kurulunca sol perdenin 3B dönüşünün arka yüzü (açılmış sol kanat); kart yükselirken solda görünür.

#### W9 Sağ perdenin iç yüzü (açıkken)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right_in.png` · 800×1000 · **Şeffaf zemin**

```
The INSIDE (back) of the right stage-curtain flap, alone, the mirror twin of curtain_left_in.png, seen straight on as it appears once swung open, on a fully transparent background: its straight hinge edge is on the LEFT side of the shape. The shape spans x 6–94% and y 6–94% of the 800×1000 canvas: straight top, straight left edge (the hinge), straight bottom, a softly folded free edge on the right. The same antique gold silk lining with a lustrous sheen down heavy vertical folds, the same narrow band of burgundy velvet (#5E1622) turned over along the free right edge and along the top, the same antique gold bullion fringe along the bottom. Warm stage light from the top-left (not mirrored). No cord, no tassel. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: menteşe kenarı solda; W8'in ikizi; altın ipek astar, bordo kenar şeridi, saçak; gerçek alfa.
Kullanım: tema kurulunca sağ perdenin 3B dönüşünün arka yüzü (açılmış sağ kanat).

#### W10 Saçaklı perde başlığı (sabit valance)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/valance.png` · 1600×1200 · **Şeffaf zemin**

```
Only the fixed pelmet (valance) across the top of the same horizontal envelope, on the same 1600×1200 canvas and in exactly the same place, on a fully transparent background — the envelope and the curtains are NOT drawn. The envelope occupies exactly x 6–94% and y 9.5–90.5% of the canvas; the valance spans its full width (x 6–94%) with a straight top edge along 9.5%. It is the same deep burgundy silk velvet as curtain_left.png gathered into three soft, generous swags (a wide centre swag and two side swags) whose rounded lower edges dip to 21% of the canvas height, with short velvet tails (jabots) at both ends falling to about 24%; along the lower edges of the swags hangs a fine antique gold bullion fringe ending at 24%, and a slim water-gilded carved rod (antique gold #C9A45C) runs along the very top edge. Warm stage light from the top-left with soft golden highlights. Everything below the valance is completely transparent. No tassels hanging lower than 24%, no cord, no text. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tam genişlik, üst kenar %9,5; üç kadife swag (diplerde %21), saçak ve uç kuyruklar en çok %24; üstte varaklı ince çubuk; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca sabit üst katman (hareket etmez); perdelerin üst ucunu örter, açılışta sahnenin çerçevesi olarak kalır.

#### W11 Bilet koçanı (boş, delikli)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/ticket.png` · 1600×1200 · **Şeffaf zemin**

```
Only a blank theatre ticket tucked across the centre of the closed curtains of the same envelope, on the same 1600×1200 canvas and in exactly the same place, on a fully transparent background — the envelope, the curtains and the cord are NOT drawn. A straight, untilted horizontal rectangle of thick ivory card (#F3EBD8) spanning exactly x 40–60% and y 50.5–61.5% of the canvas (about 2.4:1), its corners very slightly rounded, with a fine antique gold foil border line (#C9A45C) inset a little from its edge and a delicate gilded acanthus flourish in each corner of the border. A vertical line of small, evenly spaced, round punched perforation holes crosses the ticket at x 54.6% of the canvas, dividing a larger body on the left from a small stub on the right; the holes are truly see-through (real alpha). The card is otherwise completely BLANK: no "admit one", no seat or row, no serial number, no words, no numbers. A faint soft bend in the card. Warm stage light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz fildişi bilet x %40–60 · y %50,5–61,5; altın kenar çizgisi; dikey delik çizgisi x %54,6'da, delikler şeffaf; hiçbir yazı/rakam yok; gerçek alfa.
Kullanım: tema kurulunca kordonun altında; açılışta yukarı kayar, Claude x %54,6'dan iki parçaya kırpar → koçan dönerek düşer, gövde süzülüp söner. RSVP gönderiminde aynı bilet yeniden yırtılır.

#### W12 Altın püsküllü kordon
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/rope.png` · 1600×1200 · **Şeffaf zemin**

```
Only the antique gold tie-back cord that gathers the two closed curtains at the centre of the same envelope, on the same 1600×1200 canvas and in exactly the same place, on a fully transparent background — the envelope, the curtains and the ticket are NOT drawn. A thick twisted silk rope (antique gold #C9A45C with warm highlights and deeper old-gold shadows) runs horizontally from x 41% to x 59% of the canvas at about 54% of the canvas height, slightly cinched in the middle, and is tied at the centre (50%, 54%) in one neat, plump knot; from the knot two heavy silk tassels hang straight down — one at x 47%, one at x 53% — each with a carved gilded head and a full skirt of fine gold silk threads ending at 74% of the canvas height. Warm stage light from the top-left. Everything else is completely transparent. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kordon x %41–59, y ~%54; düğüm (%50, %54); iki püskül x %47 ve %53'te, uçları %74; perde/bilet çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca en üst katman; bilet çıktıktan sonra düğüm gevşer (hafif ölçek), kordon iki yana kayıp söner, püsküller sarkaç gibi sallanarak düşer. Favicon da bu parçanın düğüm + püskül kırpımı.

#### W13 Sahneden yükselen program kartı (boş)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen straight on, on a fully transparent background: the thick smooth ivory card stock of card_paper.png (#F3EBD8) with softly rounded corners, spanning x 7–93% and y 6–94% of the canvas, its edge finished with a fine antique gold gilt edge. A fine antique gold foil double rule (#C9A45C) is inset about 5% from the card's edge, and at the top centre, inside the rules, a small gilded proscenium-arch cartouche with a tiny velvet swag (about 34% of the card's width), and at the bottom centre a small gilded acanthus flourish. Everything between them is EMPTY card (the website sets the names, the date and the venue there in HTML). Warm stage light from the top-left, a hair-fine contact shade on the card's own edge only. No photo, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: boş fildişi kart; altın çift çizgi; üstte küçük proscenium kartuşu, altta akantus; orta tamamen boş; gerçek alfa.
Kullanım: tema kurulunca zarftan yükselen kart (isimler, tarih HTML) ve home kartının kâğıdı.

#### W14 Proscenium portre çerçevesi (home)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/portrait_frame.png` · 1000×1300 · **Şeffaf zemin**

```
A miniature gilded theatre proscenium used as a portrait frame, alone, seen straight on, on a fully transparent background: a richly carved, water-gilded wooden frame (antique gold #C9A45C with soft warm highlights and deeper old-gold recesses) whose top is a gentle arch crowned by a small carved cartouche (blank) with acanthus scrolls, two slender fluted pilasters down the sides and a carved base moulding; a short swag of the burgundy velvet of curtain_left.png with a little gold fringe hangs across the inside of the arch above the window, and two narrow gathered velvet drapes fall down the inner sides of the pilasters, tied back with tiny gold tassels. The frame spans about x 6–94% and y 6–94% of the canvas. In it a portrait photo window exactly 680 px wide and 850 px tall (4:5), its top-left corner at x 160 px, y 290 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it — the velvet swag and drapes stay outside the window). Warm stage light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 680×850 (4:5), sol üst (160, 290); kemerli varaklı çerçeve + kadife swag ve yan drapeler pencerenin dışında; kartuş boş; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → home'daki ana portre (spot ışığı CSS ile bir kez üstünden geçer).

#### W15 Program sayfası çerçevesi (story)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/story_frame.png` · 1000×1350 · **Şeffaf zemin**

```
A single page of a luxurious blank opera programme used as a photo frame, alone, lying flat, seen straight on, on a fully transparent background: a portrait sheet of the thick ivory card of card_paper.png (#F3EBD8) spanning about x 6–94% and y 6–94% of the canvas, with a fine antique gold gilt edge, a fine antique gold double rule inset from the edge, a small gilded acanthus flourish at the middle of the top rule, and a tiny burgundy silk tassel on a gold cord tucked at the top-right corner. In it a portrait photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 140 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it), with a hair-fine gold rule around it; below the window the page is EMPTY paper (a caption is set there in HTML). Warm stage light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 760×950 (4:5), sol üst (120, 140); altında boş kâğıt; altın çift çizgi + köşede küçük bordo püskül; yazı yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'deki üç an (Act I–III, sol–sağ–sol), sayfa çevirir gibi girer; spot ışığı dokunulan sayfayı aydınlatır. Home'daki hikâye tanıtımı da bu sayfa.

#### W16 Geniş proscenium (mekân fotoğrafı)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/venue_frame.png` · 1600×1000 · **Şeffaf zemin**

```
A wide gilded theatre proscenium used as a landscape photo frame, alone, seen straight on, on a fully transparent background: a carved water-gilded frame (antique gold #C9A45C, warm highlights, old-gold recesses) with a shallow arched top and a small blank cartouche at its centre, the same burgundy velvet of curtain_left.png gathered and tied back at both sides with gold tassel cords like open stage curtains, and a short velvet swag with gold fringe across the top inside the arch. The frame spans about x 6–94% and y 6–94% of the canvas. In it a landscape photo window exactly 1152 px wide and 768 px tall (3:2), its top-left corner at x 224 px, y 120 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it — the gathered curtains and the swag stay outside the window). Warm stage light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 1152×768 (3:2), sol üst (224, 120); yanlarda toplanmış perdeler ve üst swag pencereye binmiyor; kartuş boş; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı (perdeler CSS ile hafifçe yana açılır gibi kayar).

#### W17 Köşe süsü (varaklı akantus + gül)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/corner_ornament.png` · 1200×1000 · **Şeffaf zemin**

```
A restrained, elegant corner ornament growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: a carved water-gilded acanthus scroll (antique gold #C9A45C) curling along the top and left sides, with a single deep burgundy garden rose (#5E1622, velvety petals) and two ivory rosebuds (#F3EBD8) nestled at the corner, a few dark green leaves, and a short antique gold silk tassel hanging from the scroll. Light and airy, not dense. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Warm stage light from the top-left. No vase, no glitter, no other flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sol üstten çıkan sade köşe; tek bordo gül + iki fildişi gonca + akantus + küçük püskül; sağ alt yarı boş; gerçek alfa.
Kullanım: tema kurulunca home kartının ve RSVP formunun üst köşeleri (sağda aynalanır), kapak sayfasında en fazla bir köşe — asla metnin altında değil.

#### W18 Varaklı akantus ayırıcı
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider, alone, on a fully transparent background: a fine carved and water-gilded acanthus scroll moulding (antique gold #C9A45C, soft warm highlights) running symmetrically from the centre outward across x 8–92% of the canvas at the vertical centre, tapering to delicate curls at both ends, with a tiny burgundy silk tassel hanging from a small gilded boss at the exact centre. Elegant and fine. Warm stage light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay simetrik varaklı akantus, ortada küçük bordo püskül; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet ve gün, details program, RSVP formu).

#### W19 Antik pirinç opera dürbünü (imza)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/opera_glasses.png` · 1000×700 · **Şeffaf zemin**

```
A pair of antique brass opera glasses, alone, lying slightly turned toward the viewer, on a fully transparent background, photorealistic: two short barrels of warm antique brass (#C9A45C toward deeper bronze) with fine engraved bands, the eyepieces wrapped in burgundy leather (#5E1622), a slim brass bridge with a small focusing wheel, the clear front lenses showing only soft reflections, and a short folded handle (lorgnette) of brass with a mother-of-pearl inlay. It spans about x 12–88% and y 15–85% of the canvas. Warm stage light from the top-left. No case, no chain, no engraving of letters. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek pirinç opera dürbünü, bordo deri, sedef saplı; yazı/harf yok; gerçek alfa.
Kullanım: tema kurulunca home imzasında ve RSVP kapanışında küçük süs (hafif salınım).

#### W20 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, warm stage light from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files, the same light and scale: 1 = one small round disc of antique gold foil confetti (#C9A45C), very thin, slightly curled, catching a warm highlight; 2 = one single loose deep burgundy rose petal (#5E1622), velvety and softly cupped; 3 = one single loose ivory rose petal (#F3EBD8), tissue-thin and softly curled, a faint warm shade in its fold.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (altın konfeti, bordo yaprak, fildişi yaprak); kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışın sonunda ve RSVP gönderilince süzülen küçük nesneler (her biri ayrı katman, kendi fazında).

#### W21 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic product photography, warm stage light from the top-left: the closed horizontal peacock-teal linen envelope of env_back.png with its two closed burgundy velvet curtain flaps (as curtain_left.png and curtain_right.png), the gold-fringed velvet valance across its top (as valance.png), the antique gold tasselled cord tied at the centre (as rope.png) and the blank ivory ticket tucked under the cord (as ticket.png), lying slightly below the centre on warm ivory laid paper (as page_ground.png); at the left a single deep burgundy rose and two ivory rosebuds with a short gold tassel; at the right the antique brass opera glasses of opera_glasses.png and a few small gold confetti discs; behind, softly out of focus, a fold of peacock-teal velvet. Only peacock teal, burgundy, antique gold and ivory tones. The top 20% of the image is calm and soft (only out-of-focus paper and velvet). This image is cropped to 1200×630 for link previews: keep the whole envelope, its tassels and the ticket visible with at least 5% empty margin below it. No people. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf + perdeler + kordon + bilet bütün, altında ≥%5 boşluk; bilet boş; üst %20 sakin; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Fotogerçekçi, sinematik, sıcak sahne ışığı; tavus mavisi, antik altın ve fildişi palet; hafif film greni. Yüzler
gerçek ünlülere ya da tanınmış kişilere benzemez; marka, tabela, yazı yok. Hepsi 4:5 dikey (mekân 3:2 yatay).
**Tek kurgu çift, her fotoğrafta aynı:** her prompt aynı tarifi taşır (kadın: omuz hizasında dalgalı kestane-kızıl saç,
açık ten, hafif çil; erkek: kısa koyu kahve saç, kısa düzgün sakal, zeytinî ten). 2.1'i sonraki fotoğraflara referans ver.

#### 2.1 Ana portre
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), standing on the empty stage of an ornate gilded theatre in front of drawn-back peacock-teal velvet curtains: the groom in a classic black tuxedo, the bride in an ivory satin gown with a long veil, close together and smiling, three-quarter length, faces in the upper third, lit by a warm spotlight from above-left. Warm footlights, soft haze in the air. Peacock, antique gold and ivory palette, subtle film grain. They must not resemble any real or famous person. No text, no frame.
```

#### 2.2 Story 1 — "Opening night"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in smart evening clothes, vertical 4:5, a candid moment in peacock-teal velvet theatre seats with gilded armrests in the stalls, side by side and laughing during an evening performance, the stage light falling on their faces, the dark auditorium behind softly out of focus. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 2.3 Story 2 — "The proposal at intermission"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
Vertical 4:5: the same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in evening clothes, in a mirrored, candlelit theatre foyer at intermission, he on one knee holding up a ring box, she with her hands to her face in happy surprise, champagne glasses on a marble ledge, gilded mirrors and warm sconces softly blurred. Photorealistic, same palette and grain. Not resembling any real person. No text, no signs.
```

#### 2.4 Story 3 — "Our curtain call"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Vertical 4:5: the same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in their wedding clothes (black tuxedo, ivory satin gown), taking a playful bow together at the front of the stage, hand in hand, ivory rose petals in the air, the peacock velvet curtain gathered behind them and warm footlights glowing. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 3:2)

```
Landscape 3:2: the interior of an imaginary grand theatre seen from the back of the stalls, rows of velvet seats, two tiers of gilded balconies, a crystal chandelier, the antique-gold proscenium with peacock velvet curtains open, warm evening light, set for a wedding with ivory flowers along the stage edge. No people, no signs, no text, not a copy of any real theatre. Photorealistic, same palette.
```

---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, `'grand-theatre-premiere'` bloğu — bugün eski
> `print/invitation_front_5x7.png` / `invitation_back_5x7.png` zeminlerini gösteriyor). Yeni görünümün zeminleri **yeni
> dosya adlarıyla** istenir (eski dosyalar yerinde kalır, ezilmez).
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in
> + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts`'teki `'grand-theatre-premiere'` bloğunda `sources` → `{ front: 'print/invitation_front_r_5x7.png', back:
>    'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }` (değişmez).
> 2. Kutuları (`front`/`back` kenar payları) yeni görselde ölç (süslemenin ~%2 dışında kalsın;
>    `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme grand-theatre-premiere` ve `node scripts/print-sample.ts
>    --theme grand-theatre-premiere --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the thick warm ivory card of card_paper.png (#F3EBD8). Across the top, between 9% and 91% of the width, a gold-fringed deep burgundy velvet valance with three soft swags (as valance.png) hanging from a slim gilded rod, with a small blank gilded proscenium cartouche at its centre; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 92% and 96% of the height and from 14% to 86% of the width, a fine antique gold double rule with a small gilded acanthus flourish and a tiny burgundy tassel at its centre. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no fringe, no petal, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges. Warm light from the top-left. Only burgundy, antique gold and ivory tones. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; kadife swag + kartuş yalnız üstte (%17'nin üstünde), altın çift çizgi + akantus yalnız altta; yan %8 boş; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same thick warm ivory card, only a short slim gilded acanthus scroll across the top centre (between 30% and 70% of the width) with a tiny burgundy silk tassel hanging from its middle, its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no fringe, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa akantus + püskül (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

## PAKET 3 — Etsy ilan sahneleri — GEÇERSİZ (2026-10-22: yeniden tasarım; tema kurulunca yeniden yazılacak)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Yazan: G175 (`tools/paket3_sahne.py` şablonu, 01–21 ile aynı). `tools/listing_editorial.py` 3.1, 3.2, 3.4 ve 3.5'i
> kullanır (ilan görselleri 1, 2, 8, 4); 3.3 yedek sahnedir.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a deep peacock teal velvet cloth over an antique gilded side table and a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a deep peacock teal velvet cloth over an antique gilded side table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a deep peacock teal velvet cloth over an antique gilded side table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a deep peacock teal velvet cloth over an antique gilded side table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a teal velvet theatre sofa with an antique gold cushion and a glass of champagne; a small arrangement of a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
