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

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 24`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a deep peacock teal velvet cloth over an antique gilded side table, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a deep peacock teal velvet cloth over an antique gilded side table, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a deep peacock teal velvet cloth over an antique gilded side table, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a deep peacock teal velvet cloth over an antique gilded side table: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a deep peacock teal velvet cloth over an antique gilded side table: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a deep peacock teal velvet cloth over an antique gilded side table, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a deep peacock teal velvet cloth over an antique gilded side table, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a deep peacock teal velvet cloth over an antique gilded side table: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Grand Theatre yeniden tasarım (2026-10-24)

> Kullanıcı (2026-10-23/24): 21'den itibaren her tasarım "çok iyi bir profesyonel tasarımcının elinden çıkmış gibi" olacak
> ("absurdly high quality", "cesur ve yaratıcı ol"); kendine özgü bileşen, hareket ve ses. 24'ün bugünkü sitesi (tavus
> mavisi zarf + bordo kadife perde kanatları + kordon + bilet koçanı, PAKET 5R) birkaç yeniden kurulumun yamasıdır; çıta
> değildir. PAKET 8 tasarımı baştan GPT'ye çizdirir (K21): önce **W1** tasarım panosu, sonra aynı sohbette panodan türeyen
> **W2** parçaları. Tema bu parçalarla yeniden kurulur (Claude: kesim, maske, ölçek, ışık, HTML/CSS/JS; çizim yok). Dosyanın
> başındaki "Instructions for GPT" notu (page_ground / env_back / curtain_left referansları) PAKET 8'e **uygulanmaz**.
>
> Claude için notlar:
> - W1'in kayıt satırı bilerek kalın değil: yol `mockups/` altında olduğu için `kit_check` / `gpt_yerlestir` orada yeşil ekran
>   arar. Panoyu GPT doğrudan commit eder; `gpt_yerlestir`'e verilmez.
> - W1 demo metni `content.demo.json` ile aynı: Charlotte & Theodore · October 16, 2027 · The Larkmont Grand Theatre,
>   Richmond, Virginia · RSVP son günü September 1, 2027 · program saatleri 5:00 / 6:00 / 7:15 / 9:00 PM. Geri sayım örneği
>   357 gün (2026-10-24'ten).
> - Dosya adları bilerek PAKET 5R'dekilerden farklı (`prog_*`, `flat_*`, `house_*`, `playbill_*`, `title_banner`,
>   `frame_loge`, `divider_lyre`, `lorgnette`, `icon_*`, `toss_*`): `gpt_is_listesi` aynı yolda dosyadaki ilk prompt'u alır,
>   eski PAKET 5R prompt'u kazanırdı. Eski parçalar diskte kalır; tema yeniden kurulana kadar onları kullanır.
> - Foto pencereleri (proscenium açıklığı, loca penceresi) yeşil değil, **şeffaf açıklık** (21 TESLİM: düz yeşil tutmuyor).
>   Prompt'larda bilerek yeşil hex kodu yok (`kit_check` yeşil pencere arardı). Maske, kapalı halkanın içindeki şeffaf
>   bölgeden çıkarılır; portre maskesi = proscenium açıklığı − valans.
> - Bant gibi ince parçalar (ayırıcı, başlık bandı) GPT'nin tutabildiği 3:2 tuvalde ortada bant olarak istenir; Claude kırpar.
>   Bütün ölçüler GPT'nin yerel tuvalleri (1024×1024, 1024×1536, 1536×1024).
> - Açılış nesnesi zarf değil, **program kitapçığı + açılır (pop-up) kâğıt tiyatro**. En yakın tip `kitap` (13): kapak sol
>   sırttaki menteşede `rotateY 0→-90°`, 90°'de mermerli iç yüz (`prog_cover_in`, menteşe sağda) `90°→0` devralır, sonra kapak
>   sola ekrandan çıkar; ardından `flat_*` katmanları sayfadan `rotateX(90°→0)`, `transform-origin` alt kenar, arkadan öne
>   kademeli kalkar. `prog_*` dört parça aynı 1024×1536 tuvalde aynı kutuda; `flat_*` beş parça da aynı tuvalde (sahne
>   sayfanın içinde durur). Hiza (sol, sağ, üst, alt kenar ±%1,5) PAKET 8 için otomatik koşmaz; Claude `tema_build.hiza_olc`
>   ile ölçer, her katmanı kendi alfa kutusundan keser ve ölçülen kutusuyla yerleştirir (GPT kayması tema ölçüsüyle emilir).
> - Kapaktaki isim/tarih canlı HTML'dir ve kapakla **aynı** 3B sarmalayıcıda döner (ayrı animasyonla taklit edilmez). START
>   HERE / panelde açılış nesnesinin adı bugün `Curtain`; "Programme" olup olmayacağına entegratör karar verir.
> - Paylaşım (og) görseli ayrıca istenmedi: Claude `house_lights` + kapalı `prog_cover` + `prog_pulltab`'dan kurar (eski
>   `web_hero` yerinde kalır). PAKET 6R basılı davetiye ve PAKET 3/7 ilan sahneleri bu turda değişmez (yeni görünüme uyum
>   gerekirse ayrı paket).
> - Fontlar ve palet değişir (aşağıda); `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md`, G177 renk varyantları entegratörde
>   güncellenir. Palet ailesi korunur (tavus mavisi, antik altın, fildişi; bordo → biraz daha parlak **garnet**). Elsie Swash
>   Caps geniştir: uzun isimlerde iki satır/ölçek, `scripts/font-fallback.ts` yeniden koşulur. Prova şekli `kuru_sekil.json`
>   ve tema testi yeni katmanlara göre yeniden yazılır.

### Sanat yönetimi — "The Paper Theatre"

- **Signature.** The whole site is the couple's opening-night **souvenir programme** at an imaginary Belle Époque opera
  house. Closed, it glows in a pool of light in the darkened auditorium, the names printed on its gilded proscenium cover.
  The guest pulls its little silk tab: the house lights dim, the cover swings open on its corded spine, and a hand-coloured
  **Victorian paper theatre pops up out of the page** layer by layer — painted garden backdrop, leafy wing flats, gilded
  proscenium with footlights — the footlights warm, the little painted garnet curtain parts, and a painted ribbon banner
  flies in on two gold cords carrying the couple's names.
- **The stage carries the site.** Home = the same paper theatre, now with the couple's portrait as the scene. Story = three
  "Acts" with a real scene change: the paper curtain sweeps closed, the photo changes, it opens again. Details = the
  playbill's "Order of the Evening" with little engraved vignettes, the venue seen from inside a gilded theatre box. RSVP =
  "Reserve your seat", and a curtain call when it is sent (an ivory rose lands on the card, gold-leaf confetti, applause).
- **Two material worlds, never mixed up.** Everything the guest holds is **paper**: thick warm ivory cotton card,
  hand-coloured engraving (fine sepia-black etched lines, soft watercolour and gouache tints), real raised burnished gold
  leaf, die-cut edges with visible card thickness — the stage curtains are **painted card, not fabric**. The theatre around it
  is **photographed for real**: the dark peacock auditorium, peacock silk damask, carved gilt, antique brass, an ivory rose.
- **Colour.** pit `#061416` · velvet `#0E3D40` · peacock `#16595B` · garnet `#6E1A28` (sparingly: paper curtains, swags,
  ribbon, buttons) · antique gold `#C9A45C` (gilt highlight `#E8CF95`) · ivory card `#F3EBD8` · sepia ink `#2B211C`.
- **Not 21/22/23, not the others.** 21 owns oxblood velvet, red roses, torn paper, the gold oval frame, envelope + wax seal and
  Didone type; 22 the moon, the night lake, mountains; 23 the jewel box, pearls, gems, rose gold, satin. Also off-limits:
  Art Deco geometry and fans, gatefold doors (06), tickets, luggage and ticket punches (25 — this redesign drops the old ticket
  stub), doors and lanterns (27), stars and constellations (29), music box and mirror (32), Art Nouveau whiplash (37), film
  strips, photo booths, cinema marquee bulbs (39, 47). 24 has no envelope, no seal, no velvet drapes as decoration, no red
  roses (one ivory rose only), no oval.
- **Type (Google Fonts; no other design uses them — verified 2026-10-24, HTTP 200, latin + latin-ext).** *Elsie Swash Caps*
  900 — the names and the big titles (a Victorian theatre-bill fat face with curly swash capitals, ≥ 28 px); *Elsie* 400/900 —
  headings, countdown numerals; *Fanwood Text* + italic — body, captions and widely letter-spaced capitals for dates, labels,
  buttons. Replaces Abril Fatface + Playfair Display.
- **Motion (Claude builds it; GPT designs for it).** Pull-tab slides out → cover swings open in 3D onto its marbled endpaper →
  flats stand up from the page back to front with a small overshoot → footlights warm, a spotlight finds centre stage (CSS
  light) → paper curtains slide apart and gather → banner flies in and bounces on its cords → gold-leaf confetti → home. Home:
  layered parallax of the flats on scroll; story: curtain scene change between Acts; details: each programme row "lit" in turn
  as by a follow-spot; RSVP: curtain call.
- **Sound (Claude synthesises them, `tools/audio_fx.py`; silent until the first tap).** (1) pull-tab: stiff card sliding out of
  a paper slot + a flick of silk ribbon; (2) cover: a heavy card cover swinging open (air push, soft card landing); (3) pop-up:
  three stiff card flats snapping upright one after another, each a little higher; (4) house lights down: a hushed orchestra
  tuning A (oboe + strings), very low, 1.5 s; (5) curtain: card-on-card swish of the paper curtains + one warm string chord as
  the stage appears; (6) curtain call (RSVP sent): short light applause made of many small hand claps + the rose landing.

**Instructions for GPT (send before the first image):**
```
You are the art director, scene painter and still-life photographer of a luxury wedding stationery house, designing the mobile wedding website "Grand Theatre Premiere" from scratch. Its signature: the whole website is the couple's opening-night souvenir programme at an imaginary Belle Époque opera house. The closed programme glows in the darkened auditorium; when the guest pulls its little silk tab, the cover swings open and a Victorian paper theatre pops up out of the page, layer by layer — a painted garden backdrop, leafy wing flats, a gilded proscenium with footlights — and its little painted curtain parts. Two material worlds, never mixed up: (1) everything the guest holds is PAPER — thick warm ivory cotton card (#F3EBD8), hand-coloured engraving (fine sepia-black #2B211C etched lines with soft watercolour and gouache tints), real raised and burnished gold leaf (#C9A45C, highlights #E8CF95), crisp die-cut edges with a visible card thickness; the stage curtains are painted card, never fabric; (2) the theatre around it is photographed for real — a dark peacock auditorium (#061416, #0E3D40, #16595B), peacock silk damask, carved water-gilded wood, antique brass, an ivory rose. Accent colour: garnet (#6E1A28), used sparingly. Never: envelopes or wax seals, velvet drapes as decoration, red roses, torn paper edges, oval frames, moons, lakes or night water, stars, jewels or pearls, Art Deco geometry or fans, doors, lanterns, trains, tickets, film strips, marquee light bulbs, comedy/tragedy masks. Everything must look made and photographed for real: rich, tactile, believable, magazine-quality luxury; never clip-art, never flat vector, never cheap stock. One soft warm light from the upper left in every image. It is an imaginary theatre: it must not resemble any real theatre, show, poster, brand, artist or another seller's design. First you draw a design board of five phone screens (W1); then, giving that board as the reference image of every image, you make the production parts (W2): one object per image, no cast or drop shadow, no glow or halo outside the object, no text, letters, numbers, monograms, logos or watermarks. A transparent background must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard), and the object must stay at least 5% inside every edge.
```

#### W1 — Tasarım panosu (5 telefon ekranı; demo metin serbest, YALNIZ referans)
Kaydet (W1): `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/design-board.png` · yaklaşık 1908×824 (≈2,3:1; araç vermiyorsa 1536×1024, beş ekran tek sırada) · opak · kit_check dışı

```
Use case: ui-mockup. Create a high-fidelity art direction board of FIVE mobile wedding website screens for a new luxury design called "Grand Theatre Premiere", each screen in a 390 by 844 proportion, arranged side by side in one row with generous, even gaps on a soft warm ivory-grey studio background (the whole board about 2.3:1). The attached photographs (hero_portrait.jpg, story_2.jpg and venue.jpg) are ONLY the identity and styling reference for the fictional couple (she: shoulder-length wavy auburn hair, fair skin with light freckles, ivory satin gown; he: short dark-brown hair, a short neat beard, olive skin, black tuxedo) and for the venue; everything else is new. The five screens must look like one finished, coherent, best-selling premium product made by a top luxury stationery designer: rich, tactile, romantic, classic and bold; never minimal, never flat vector, never clip-art.

THE CONCEPT — "The Paper Theatre": the whole website is the couple's opening-night souvenir programme at an imaginary Belle Époque opera house. Everything the guest holds is PAPER: thick warm ivory cotton card (#F3EBD8), hand-coloured engraving (fine sepia-black etched lines with soft watercolour and gouache tints) and real raised, burnished gold leaf (#C9A45C), with crisp die-cut edges and a visible card thickness; the little stage curtains are painted card, not fabric. The theatre around it is photographed for real: the darkened auditorium in deep peacock teal and near-black (#061416, #0E3D40, #16595B), peacock silk damask, carved gilt, antique brass. Accent colour garnet (#6E1A28), used sparingly. NO envelope, no wax seal, no velvet drapes as decoration, no red roses, no torn paper, no oval frames, no moon, no lake, no stars, no jewels, no Art Deco, no tickets, no film strips, no light bulbs, no theatre masks.

TYPOGRAPHY: the couple's names and the big headings in a Victorian theatre-bill fat face with curly swash capitals and round ball terminals — heavy, high-contrast, romantic, like the title line of an 1890s playbill (not a plain Bodoni, not Art Deco, not a script); dates, labels and buttons in widely letter-spaced old-style capitals; body text in a refined French old-style serif with elegant italics. Gold and ivory type on the dark auditorium; sepia-black and garnet type on ivory paper.

Screen 1 — the opening (the closed programme): full-bleed, the darkened auditorium of the opera house a minute before the curtain: deep peacock-teal darkness, the curved gilded fronts of the box tiers softly out of focus, a few warm amber wall lamps glowing low near the top. At the top, tiny spaced gold capitals "YOU ARE INVITED TO OPENING NIGHT". In the middle, lit by a soft pool of warm light, the CLOSED souvenir programme, a tall 2:3 booklet seen perfectly straight on, about 78% of the screen width: a thick ivory cotton-card cover decorated as a hand-coloured engraving with raised gold leaf — a gilded proscenium-arch border (slender gilt columns up both sides, an arched crown with a small empty cartouche at its top, two little painted garnet curtain swags tied back in the upper corners, a tiny painted stage lip with a row of gilt footlights along the bottom); the booklet is bound at its left spine with a garnet silk cord laced through three small brass eyelets. Printed in sepia ink in the empty centre of the cover: "TOGETHER WITH THEIR FAMILIES", the names large on two lines "Charlotte" and "& Theodore", "request the pleasure of your company", "OCTOBER 16, 2027 · RICHMOND". From the middle of the programme's right edge a small ivory pull-tab with a gilt edge sticks out, a short loop of garnet silk ribbon threaded through its end. At the bottom "TAP TO RAISE THE CURTAIN" in tiny spaced capitals.

Screen 2 — home: the same programme now OPEN: a Victorian paper theatre has popped up out of its page, seen straight on, filling the top 55% of the screen: layered die-cut hand-coloured card flats with visible paper edges and real depth between them — a gilded proscenium with a painted garnet swagged valance and a small empty cartouche on its crown, slim leafy painted wing flats at both sides, the little garnet paper curtains drawn open to the sides, and on the stage, as the scene, the couple's portrait (from the attached hero_portrait.jpg); along the stage lip a row of small footlights glowing warm. A painted ivory ribbon banner with swallowtail ends hangs on two thin gold cords across the top of the arch, with "Charlotte & Theodore" on it. Below, on the dark auditorium: "SATURDAY, OCTOBER 16, 2027" and "THE LARKMONT GRAND THEATRE · RICHMOND, VIRGINIA" in spaced capitals; then the top of a tall ivory programme page (a fine double gilt rule down its sides, a tiny engraved gilt proscenium vignette at its head) with "request the pleasure of your company at their wedding" in italic, a countdown of four plain numerals in the fat face with small spaced labels "357 DAYS · 06 HOURS · 42 MINUTES · 18 SECONDS" (no boxes, no tiles), and a garnet pill button "Reserve your seat".

Screen 3 — story: a deep peacock silk damask page (tone-on-tone, quiet). At the top small spaced gold capitals "THE STORY SO FAR" and the heading "Our Story" in the fat face in ivory. In the middle a smaller paper theatre (the same gilded proscenium and garnet paper curtains) caught in the middle of a SCENE CHANGE: the left paper curtain is sweeping closed across a third of the stage while the right one is still open, and the scene on stage is the couple's photograph — the proposal at intermission (from the attached story_2.jpg). Under it "ACT II" in the fat face and the italic caption "The proposal at intermission"; a row of three small ivory programme tabs "ACT I · ACT II · ACT III" with ACT II in garnet, and two fine arrow buttons; two or three flakes of gold-leaf confetti drifting.

Screen 4 — details: warm ivory programme paper (the inside of the programme). The heading "The Programme" in the fat face in sepia-black, "SATURDAY, OCTOBER 16, 2027" in spaced capitals, a fine gilt divider with a tiny gilded lyre at its centre. The order of the evening set like an 1890s playbill: four rows, each with a small hand-engraved vignette icon in sepia ink with touches of gold leaf at the left (two interlocked rings · two champagne coupes · a dinner plate with knife and fork · a violin with its bow), the time in spaced capitals, the event in the fat face and the room in italic: "5:00 PM · The Ceremony · On the main stage", "6:00 PM · Champagne in the Grand Foyer · The mirrored foyer", "7:15 PM · Dinner in the Stalls · The auditorium", "9:00 PM · First Dance & Encore · On the main stage"; a small engraved vignette of a top hat and gloves with "DRESS CODE · Black tie optional". Then the venue photograph (from the attached venue.jpg) seen FROM INSIDE A THEATRE BOX: the box's peacock silk damask curtains tied back with gold tassels at both sides, a carved gilt canopy above, and the padded peacock velvet elbow rail on its gilded parapet across the bottom in the foreground; under it "THE LARKMONT GRAND THEATRE · RICHMOND, VIRGINIA" and an outlined garnet button "View map".

Screen 5 — RSVP: the dark auditorium, dimmed. A tall ivory programme page fills most of the screen (an engraved gilt proscenium vignette with a tiny garnet swag at its head, a fine double gilt rule down its sides): the heading "Kindly Reply" in the fat face, the italic line "Reserve your seat by September 1, 2027", then a real, readable form in sepia ink: "Your name" on a fine gilt underline, "Will you join us?" with two round options "Joyfully accepts" and "Regretfully declines", "Number of guests" as a select showing "2", "Your dinner choice" as a select showing "Beef tenderloin", and a full-width garnet button "Reserve my seat" with ivory text. Lying across the bottom edge of the card, as if just thrown at a curtain call, a single long-stemmed ivory rose tied with a short garnet ribbon, and at the lower right a pair of antique brass and mother-of-pearl opera glasses on a long handle; a few flakes of gold-leaf confetti.

All five screens share one world (the same ivory card, gold leaf, garnet, peacock darkness and light) but each has its own composition — not all centred. Use exactly this English sample text and no other words. Photos show the fictional adult couple only, natural and tasteful, not resembling any real or famous person. No device frames or bezels, no hands, no laptop, no marketing collage, no logos, no watermarks, no captions outside the screens. This is a design reference board, not a final website.
```
Kontrol: 5 ekran yan yana, her biri ~390:844; 1. ekranda kapalı, sırtı kordonlu, varaklı proscenium kapaklı program + sağ
kenarda çekme dili; 2. ekranda katmanlı açılır kâğıt tiyatro (arka resim/kanat/proscenium ayrı seçiliyor), sahnede çiftin
portresi, isimli bayrak bandı; 3. ekranda yarı kapanmış kâğıt perde (sahne değişimi); 4. ekranda playbill programı + 4 gravür
ikon + locadan mekân; 5. ekranda okunur form, fildişi gül + opera dürbünü; zarf/mühür/kadife drape/kırmızı gül/ay/yıldız/
bilet/deco yok. Başlık harfi kıvrık kuyruklu Viktorya fat face (düz Bodoni değil). Metindeki küçük harf bozuklukları kabul
(yalnız referans). Beğenilmezse yeniden üret (en çok 3 deneme); W2 bu panodan türer.
Kullanım: Claude'un yerleşim, tipografi ölçeği ve renk referansı; programın ekran genişliğine oranı, bayrak bandı ve tiyatronun
home'daki yeri buradan ölçülür.

### W2 — Parçalar (panodan türer; HER parçada `design-board.png` referans görsel; YAZI YOK)

Ortak kurallar: tek görselde tek nesne · şeffaflar gerçek alfa · zemine düşen gölge yok · nesnenin dışında ışıma/hâle/ışın yok
(ayak lambası ışığını, spotu, salon ışığının kısılmasını site CSS ile ekler) · ışık sol üstten · oran önemli, piksel değil ·
yaprak, saçak, lamba **sayısı** önemli değil, sayı için yeniden üretme.

**Program tuvali (W2.1–W2.9, hepsi 1024×1536, aynı konum):** program kutusu x %12–88 · y %12–88 (2:3, sırt solda x %12,
menteşe katı x ≈%14). Kâğıt tiyatro sayfanın içinde durur: proscenium x %14–86 · y %15–86; sahne açıklığı x %27–73 ·
y %28–70 (valans en çok %33'e iner); perdeler x %26–51 ve %49–74 · y %27–70; arka resim x %22–78 · y %24–72; kanatlar
x %22–35 ve %65–78 · y %26–71. Önce W2.1'i üret; W2.2–W2.4'ü **W2.1'i düzenleyerek**, W2.6–W2.9'u **W2.5'i düzenleyerek**
(image edit) üret; araç düzenleme yapamıyorsa referans ver ve kutuyu aynı piksellerde tut.

#### W2.1 Kapalı program — ön kapak (çekme dili OLMADAN)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/prog_cover.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the closed programme on screen 1 of the attached design board. ONE closed souvenir theatre programme (a tall booklet), alone, seen perfectly straight from the front, no perspective, no tilt. Placement on the canvas, exactly: its left edge at 12% and its right edge at 88% of the image width, its top edge at 12% and its bottom edge at 88% of the image height (a 2:3 booklet). The cover is thick warm ivory cotton card (#F3EBD8) with crisp die-cut edges, a hair-thin gilt edge all round and a visible card thickness along the right fore-edge and the bottom edge. It is decorated as a hand-coloured engraving with real raised, burnished gold leaf (#C9A45C, highlights #E8CF95): a gilded proscenium-arch border runs around the cover — two slender fluted gilt columns up the left and right sides, an arched crown across the top with a small EMPTY gilt cartouche at its centre, two small painted garnet (#6E1A28) curtain swags tied back with tiny gold tassels in the two upper corners, and along the bottom a narrow painted stage lip with a row of tiny unlit gilt footlight shells. Fine sepia-black (#2B211C) engraved lines and cross-hatching give the ornament its depth; the colours are soft watercolour tints. The large central field, from 22% to 78% of the canvas width and from 27% to 74% of the canvas height, is COMPLETELY EMPTY smooth ivory card (the website prints the names and the date there as live text): no ornament, no line, no stain, no shading change. Along the left edge the booklet is bound at its spine with a garnet silk cord laced through three small brass eyelets, and one crisp fold line runs parallel to the spine about 3% of the booklet's width in from it (the cover's hinge — it must read clearly). Nothing sticks out of the booklet (the pull-tab is a separate image). One soft warm light from the upper left. No cast shadow or drop shadow, no glow or halo outside the booklet. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: kutu x %12–88 · y %12–88 (±%2); orta alan (x %22–78 · y %27–74) tamamen boş; proscenium çerçevesi, köşelerde garnet swag, altta minik ayak lambaları; sırtta kordon + 3 kuşgözü, menteşe katı net; dışarı taşan dil yok; gerçek alfa.
Kullanım: index'in kapalı programı; isimler/tarih orta alanda canlı metin, kapakla aynı 3B sarmalayıcıda döner; kapak `rotateY 0→-90°` (origin menteşe katı); og görselinin ana nesnesi; kartuşa istenirse `initials` canlı metin olarak konur.

#### W2.2 İç sayfa — sahnenin durduğu sayfa (aynı tuval)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/prog_page.png` · 1024×1536 · **Şeffaf zemin**

```
The first inside page of the SAME programme as the attached prog_cover.png (give prog_cover.png and design-board.png as the reference images, and edit prog_cover.png if the tool allows): the same 1024×1536 canvas, the same box — its left, right, top and bottom edges on exactly the same pixels (x 12–88%, y 12–88%) — now seen with the cover gone. A plain page of the same thick warm ivory cotton card with a hair-thin gilt edge and a fine double gilt rule inset about 4% from its edges; along the left edge the same garnet silk cord through the same three small brass eyelets, and a soft natural gutter shade on the paper itself next to the spine. Otherwise the page is completely empty and calm: no ornament, no illustration, no stain. Seen perfectly straight from the front. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the page. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: prog_cover.png'nin üstüne %50 saydam konunca dört kenar çakışıyor (gözle kayma yok); sayfa boş; kordon ve kuşgözleri aynı yerde; gerçek alfa.
Kullanım: kapak açılınca görünen taban; kâğıt tiyatro katmanları bunun üstünde kalkar; home hero'nun alt katmanı.

#### W2.3 Kapağın içi — mermerli forza (aynı tuval, menteşe SAĞDA)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/prog_cover_in.png` · 1024×1536 · **Şeffaf zemin**

```
The INSIDE of the same programme cover as the attached prog_cover.png, as seen when the cover has swung open to the left (give prog_cover.png and design-board.png as the reference images): the same 1024×1536 canvas and exactly the same outer box (x 12–88%, y 12–88%), but mirrored left-to-right — the hinge edge with the three brass eyelets, the garnet cord and the crisp fold line now runs along the RIGHT edge (at 88%), and the free edge with the card's visible thickness is on the left. The inside of the cover is lined with a classic hand-marbled endpaper — fine combed "peacock" marbling in peacock teal (#16595B), deep teal (#0E3D40), garnet (#6E1A28) and soft gold veins — set inside a narrow ivory card margin about 4% wide all round, the margin finished with a hair-thin gilt line. Seen perfectly straight from the front. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the cover. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: dış kutu prog_cover ile aynı boyda; menteşe (kuşgözleri, kat çizgisi) sağ kenarda; mermer desen fildişi kenar payının içinde; gerçek alfa.
Kullanım: kapak 90°'yi geçince devralan iç yüz (`rotateY 90°→0`, origin sağ kenar), sonra kapak sola ekrandan çıkar.

#### W2.4 Çekme dili (aynı tuval)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/prog_pulltab.png` · 1024×1536 · **Şeffaf zemin**

```
Only the small pull-tab of the programme, alone, drawn exactly where it sits on the attached prog_cover.png — the same 1024×1536 canvas, the same scale and the same straight front view (edit prog_cover.png and remove the booklet, keeping only the tab). A narrow horizontal tab of the same thick ivory card with a hair-thin gilt edge, drawn complete: it spans from 83% to 94% of the image width and from 47% to 52.5% of the image height (its left part, up to 88%, is the part that sits hidden under the cover), its left end straight, its right end rounded, with a small brass eyelet near the rounded end through which a short loop of garnet silk ribbon (#6E1A28) is threaded, the loop hanging down to about 58% of the image height. Without the booklet: everything except the tab and its ribbon is fully transparent. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the tab. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: yalnız dil + kurdele halkası; prog_cover.png'nin üstüne konunca sağ kenarın ortasından dışarı çıkıyor; program çizilmemiş; gerçek alfa.
Kullanım: kapağın altında (katman sırası); dokununca (≤ 250 ms) sağa kayıp çıkar, kurdele sallanır, düşer → kapak açılır. Sürükleyerek de çekilebilir.

#### W2.5 Kâğıt tiyatro — proscenium (ön katman, açıklık şeffaf)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/flat_proscenium.png` · 1024×1536 · **Şeffaf zemin** · açıklık şeffaf

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png and prog_page.png as the reference images), matching the gilded proscenium of the paper theatre on screen 2 of the attached design board. ONE front flat of a Victorian paper theatre, alone, standing upright and seen perfectly straight from the front: a die-cut piece of thick ivory card, hand-coloured as an engraving with real raised, burnished gold leaf, its outline cut along the ornament with a visible thin card edge. Placement on the 1024×1536 canvas, exactly: the whole flat spans from 14% to 86% of the image width and from 15% to 86% of the image height (it stands inside the page of prog_page.png). Its parts: an arched crown across the top (from 15% to 28%) of carved gilt scrolls with a small EMPTY gilt cartouche at the top centre; two broad gilt pilasters with painted peacock-teal marble panels down the left side (14–27%) and the right side (73–86%); between them the stage opening, from 27% to 73% of the width and from 28% to 70% of the height, which is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it); across the top of the opening a painted garnet (#6E1A28) swagged valance with a painted gold fringe, its lowest point no lower than 33% of the image height; below the opening, from 70% to 79%, the front of the stage — a gilded moulded stage lip set with a row of small unlit brass footlight shells (half-domes opening upward); from 79% to 86% a painted base with a garnet panel and a gilt moulding. The ring of crown, pilasters and stage lip is closed all the way round the opening. No curtains, no backdrop, no scenery inside the opening (those are separate images). Fine sepia-black (#2B211C) engraved lines and cross-hatching, soft watercolour tints. One soft warm light from the upper left. No cast shadow or drop shadow, no glow or halo outside the flat, no light from the footlights. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: x %14–86 · y %15–86; açıklık (x %27–73 · y %28–70) tamamen şeffaf ve halka kapalı; valans ≤ %33; ayak lambaları sönük; kartuş boş; içinde perde/resim yok; kesik kâğıt kenarı görünüyor; gerçek alfa.
Kullanım: tiyatronun ön katmanı (açılışta en son kalkar); home hero'da çiftin portresi açıklığın içinde (maske = açıklık − valans, ≈4:5); story'de sahne değişimi çerçevesi; ayak lambası kapçıklarında CSS sıcak ışık.

#### W2.6 Kâğıt perde — sol yarı (aynı tuval)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/flat_curtain_l.png` · 1024×1536 · **Şeffaf zemin**

```
Only the LEFT half of the little house curtain of the same paper theatre, alone, drawn exactly where it hangs in the attached flat_proscenium.png — the same 1024×1536 canvas, the same scale and the same straight front view (edit flat_proscenium.png: remove the proscenium and draw only the left curtain that hangs behind it). A die-cut piece of thick card hand-painted as a heavy garnet stage curtain (#6E1A28 with deeper #3A0C14 folds and warm highlights on the fold crests) — painted in gouache and watercolour over fine engraved hatching, clearly PAINTED CARD, not real fabric — with a painted gold fringe along its bottom edge. It hangs inside the left half of the opening: from 26% to 51% of the image width and from 27% of the image height (its top hidden behind the valance) down to the stage floor at 70%; its outer left edge is straight and vertical, its inner right edge is a softly wavy fold line showing a thin ivory cut edge of the card, so it reads as cut paper. No tie-back, no cord, no tassel. Everything else fully transparent. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the curtain. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: x %26–51 · y %27–70; flat_proscenium.png'nin altına konunca dış kenarı sol pilastrın arkasında, üstü valansın arkasında; boyalı kâğıt (kumaş değil); iç kenarda fildişi kesik kenar; gerçek alfa.
Kullanım: proscenium'un arkasında; açılışta dışa doğru kayıp toplanır (`translateX` + `scaleX` .55, origin dış kenar); story'de sahne değişiminde kapanıp açılır.

#### W2.7 Kâğıt perde — sağ yarı (aynı tuval)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/flat_curtain_r.png` · 1024×1536 · **Şeffaf zemin**

```
Only the RIGHT half of the little house curtain of the same paper theatre, the mirror twin of the attached flat_curtain_l.png, drawn exactly where it hangs in the attached flat_proscenium.png — the same 1024×1536 canvas, scale and straight front view (edit flat_proscenium.png: remove the proscenium and draw only the right curtain). The same die-cut card hand-painted as a heavy garnet stage curtain (#6E1A28, deeper #3A0C14 folds), the same painted gold fringe along the bottom; it hangs from 49% to 74% of the image width and from 27% down to 70% of the image height; its outer right edge straight and vertical, its inner left edge a softly wavy fold line with a thin ivory cut edge, overlapping the left curtain by about 1%. The light still falls from the upper left (not mirrored). No tie-back, no cord, no tassel. Everything else fully transparent. No cast shadow or drop shadow, no glow outside the curtain. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: x %49–74 · y %27–70; sol perdenin ikizi; ışık yine sol üstten; iç kenarda fildişi kesik kenar; gerçek alfa.
Kullanım: sol perdeyle aynı (sağa açılır; sol perdeden 120 ms sonra).

#### W2.8 Kâğıt tiyatro — boyalı arka resim (aynı tuval)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/flat_backdrop.png` · 1024×1536 · **Şeffaf zemin**

```
Only the painted backdrop at the back of the same paper theatre, alone, drawn exactly where it hangs behind the attached flat_proscenium.png — the same 1024×1536 canvas, scale and straight front view (edit flat_proscenium.png: remove the proscenium and draw only the backdrop behind it). A flat rectangle of hand-painted card with straight edges and a hair-thin gilt edge line, spanning from 22% to 78% of the image width and from 24% to 72% of the image height (larger than the stage opening, so no gap shows at its sides). Painted in the manner of a Victorian scene painter's backdrop, gouache and watercolour over fine engraved lines: a romantic formal garden at golden hour — a small classical rotunda (a round temple with slender columns and a shallow dome) on a gentle rise in the middle distance, a tiered stone fountain in front of it, tall plane trees and clipped yew hedges framing both sides, a warm apricot-and-rose sky with soft clouds. The middle third is calm and soft. NO moon, no stars, no lake, no sea, no mountains, no people, no flowers in the foreground, no other buildings. Everything outside the rectangle is fully transparent. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the backdrop. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: dikdörtgen x %22–78 · y %24–72, açıklığın tamamını örtüyor; altın saatte bahçe + rotunda + çeşme; ay/göl/yıldız/insan yok; gerçek alfa.
Kullanım: tiyatronun en arka katmanı (açılışta ilk kalkar); perde açılınca görünen sahne; home'da portre yokken yer tutucu sahne.

#### W2.9 Kâğıt tiyatro — yapraklı kanatlar ("cut cloth", aynı tuval)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/flat_wings.png` · 1024×1536 · **Şeffaf zemin**

```
Only the scenery wings of the same paper theatre, alone, drawn exactly where they stand behind the attached flat_proscenium.png — the same 1024×1536 canvas, scale and straight front view (edit flat_proscenium.png: remove the proscenium and draw only the wings). ONE die-cut piece of hand-painted card, a "cut cloth" in the style of a Victorian paper theatre: a tall wing of painted garden foliage on the left (from 22% to 35% of the image width) and a matching one on the right (from 65% to 78%), each a column of leafy plane-tree branches and ivy with a small stone urn on a plinth at its foot, standing from 26% down to 71% of the image height, the two joined across the top by a narrow painted border of overhanging leafy branches from 26% to 31%. The card is die-cut along the outlines of the leaves (an irregular leafy cut edge with a visible thin card edge). Everything between 35% and 65% of the width below 31% of the height is COMPLETELY TRANSPARENT. Painted in gouache and watercolour over fine engraved lines, in warm greens, olive and soft gold, matching flat_backdrop.png. No flowers, no people. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the card. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: iki kanat (x %22–35 ve %65–78) üstte ince yaprak bordürle bağlı tek parça; orta tamamen şeffaf; yaprak kenarından kesik kâğıt; gerçek alfa.
Kullanım: arka resimle proscenium arasındaki orta katman (açılışta ikinci kalkar); home'da kaydırmayla en çok kayan katman (derinlik).

#### W2.10 Bayrak bandı — isimlerin "uçarak" geldiği boyalı kurdele
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/title_banner.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the ribbon banner with the names on screen 2 of the attached design board. ONE hand-painted paper banderole (a ribbon banner) of the paper theatre, alone, seen straight from the front: die-cut ivory card (#F3EBD8) painted with soft shading, a hair-thin gilt edge line along its long top and bottom edges. Its long front face is STRAIGHT and level and spans from about 10% to 90% of the image width, from 42% to 64% of the image height; at each end the ribbon folds back once and ends in a swallowtail, showing a little of its garnet-tinted (#6E1A28) reverse. Two thin twisted gold cords rise straight up from the two top corners of the front face to small brass rings at about 14% of the image height. The front face is COMPLETELY EMPTY (the website writes the names there as live text): no ornament, no line, no stain. Everything else fully transparent. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the banner. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: ön yüz düz, yatay, boş; uçlar kırlangıç kuyruğu + garnet ters yüz; iki ip yukarıda halkalarla bitiyor, kenara değmiyor; gerçek alfa.
Kullanım: açılışta perde açılınca yukarıdan iniş + iplerinde sekme (isimler canlı metin); home'da proscenium tepesinin önünde asılı.

#### W2.11 Karanlık salon — telefon zemini
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/house_lights.png` · 1024×1536 · opak

```
Production background for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the dark auditorium behind screens 1 and 5 of the attached design board. A full-frame vertical (2:3) photograph, edge to edge, of the auditorium of an imaginary Belle Époque opera house a minute before the curtain rises, seen from the stalls looking toward the back and up: deep peacock-teal and near-black darkness (#061416 to #0E3D40), the curved fronts of three tiers of boxes softly out of focus with their antique-gold (#C9A45C) gilded mouldings just catching the light, small warm amber wall lamps on the tiers dimmed low and blurred into soft round points of light, the faint glint of a large crystal chandelier near the top edge. The middle of the frame, from 20% to 80% of the height, is calm and dark with no bright points, so an ivory programme and light text can sit on it; the brightest lamps are only in the upper fifth and toward the sides. Keep every important detail within the middle 85% of the width. Rich, moody, luxurious, true-to-life low-light photography with a subtle film grain. No people, no stage, no curtains, no seats in the foreground, no signs, no text, letters, numbers, logos or watermarks.
```
Kontrol: tam opak; orta %60 sakin ve karanlık (parlak nokta yok); loca katları ve lambalar yalnız üstte/yanlarda; perde/insan/yazı yok.
Kullanım: index ve RSVP zemini; açılışta "salon ışığı kısılır" (CSS `brightness` + vinyet); home hero'nun arka planı.

#### W2.12 Karanlık salon — geniş ekran
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/house_lights_wide.png` · 1536×1024 · opak

```
The same darkened auditorium as house_lights.png (give house_lights.png and design-board.png as the reference images), now a full-frame horizontal (3:2) photograph, edge to edge: the same deep peacock-teal and near-black darkness, the same curved gilded fronts of the box tiers softly out of focus, the same dimmed warm amber wall lamps blurred into soft points of light, the faint chandelier glint near the top. The middle half of the width and the middle of the height are calm and dark with no bright points. Same colours, light and film grain. No people, no stage, no curtains, no foreground seats, no signs, no text, letters, numbers, logos or watermarks.
```
Kontrol: house_lights ile aynı salon, renk ve ışık; orta yarı sakin; opak.
Kullanım: 700 px ve üstü ekranlarda house_lights'ın yerine (index, home hero, RSVP).

#### W2.13 Tavus mavisi ipek şam — dikişsiz doku
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/house_damask.png` · 1024×1024 · opak

```
Production texture for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), the damask of the story page of the attached design board. A seamless, tileable square texture of peacock silk damask wall covering, seen perfectly flat and straight on: a classic symmetrical tone-on-tone damask of scrolling acanthus and palmettes (generic, not a copy of any historic or commercial pattern), the satin figure in peacock #16595B on a deep teal ground #0E3D40, very LOW contrast, about three motifs across the square. Perfectly even lighting: no vignette, no gradient, no hotspot, no folds, no seams, so that four copies placed side by side join invisibly (the left edge continues the right edge, the top edge continues the bottom edge). No gold, no objects, no text, letters, numbers, logos or watermarks.
```
Kontrol: düşük kontrast, eşit ışık; 2×2 dizince dikiş görünmüyor (Claude dizip bakar; küçük dikişi ofsetle kendisi giderir — yalnız bunun için yeniden üretme); opak.
Kullanım: story sayfası ve home'daki koyu bantların zemini (`background-repeat`), üstünde CSS spot ışığı.

#### W2.14 Fildişi program kâğıdı — dikişsiz doku
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/playbill_paper.png` · 1024×1024 · opak

```
Production texture for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), the ivory paper of the details page of the attached design board. A seamless, tileable square texture of thick warm ivory cotton paper (#F3EBD8) seen perfectly flat and straight on: a fine soft felted tooth, the faintest natural cloudiness, a very few tiny flecks of gold leaf (no more than six over the whole square). Perfectly even lighting: no vignette, no gradient, no hotspot, no fold, no stain, no border, no printed pattern, calm enough for small dark text everywhere; four copies placed side by side join invisibly. No text, letters, numbers, logos or watermarks.
```
Kontrol: sıcak fildişi, sakin; altın pul çok seyrek; 2×2 dikişsiz; opak.
Kullanım: details sayfası ve home'daki açık bantların zemini (`background-repeat`).

#### W2.15 Program sayfası kartı (3 dilim: üst süs · tekrarlanan orta · alt süs)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/playbill_card.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the tall ivory programme page of screens 2 and 5 of the attached design board. ONE tall page of the souvenir programme, alone, portrait 2:3, seen perfectly straight from the front, filling about 84% of the image width and 90% of the image height, centred: thick warm ivory cotton card (#F3EBD8) with crisp die-cut edges and a hair-thin gilt edge all round. It is designed so the website can cut it into three horizontal slices and stretch the middle one. TOP band (the top 18% of the card): a small centred hand-coloured engraved vignette with raised gold leaf — a tiny gilded proscenium arch with a little painted garnet (#6E1A28) curtain swag and an empty cartouche — flanked by two fine gilt rules ending in tiny acanthus curls. MIDDLE band (from 18% to 86% of the card's height): plain ivory card with ONLY a fine double gilt rule running straight down each side, parallel to the edges, exactly the same at every height, nothing else; the left and right edges perfectly straight and vertical. BOTTOM band (the last 14%): the double rules turn the corners and close, with a small centred engraved gilt row of three tiny footlight shells above the bottom rule. No form fields, no photo window. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the card. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: orta bantta yalnız iki yandaki düz çift çizgi (yükseklik boyunca aynı, tekrarlanabilir); üstte küçük proscenium vinyeti, altta üç minik ayak lambası; yan kenarlar dik; gerçek alfa.
Kullanım: home davet kartı, details programı ve G138 blokları (travel, dress code, registry, SSS), RSVP formu; Claude üst · orta · alt diye keser, ortayı içeriğe göre uzatır.

#### W2.16 Loca çerçevesi — mekân "en iyi koltuktan" (pencere şeffaf)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/frame_loge.png` · 1536×1024 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the frame around the venue photograph on screen 4 of the attached design board. ONE photo frame made of the inside of a private theatre box (a loge), as if the photo were the view out of the box, seen perfectly straight from the front and photographed for real: across the bottom, the box's parapet — a padded peacock velvet elbow rail (#16595B) with a fine gilt edge on top of a carved, water-gilded balustrade front (antique gold #C9A45C), together about 15% of the image height; at the left and the right, a peacock silk damask curtain gathered and tied back with a heavy gold silk tassel on a cord; across the top, a carved gilded canopy (pelmet) with a short peacock silk swag. Between them a clean rectangular opening of about 3:2, roughly from 18% to 82% of the image width and from 16% to 80% of the image height, which is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it); canopy, curtains and parapet meet at the corners so the frame is closed all the way round. The whole frame spans about 6–94% of the width and 6–94% of the height. One soft warm light from the upper left. No cast shadow or drop shadow, no glow or halo outside the frame. No people, no opera glasses, no text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: pencere ~3:2, tamamen şeffaf, çerçeve kesintisiz kapalı; altta kadife kol dayamalı varaklı korkuluk, yanlarda püsküllü ipek şam perde, üstte varaklı tente; gerçek alfa.
Kullanım: details'te mekân fotoğrafı (`venue`); maske şeffaf açıklıktan; girişte perdeler CSS ile hafifçe yana kayar, fotoğrafta spot geçer.

#### W2.17 Ayırıcı — varaklı lir
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/divider_lyre.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the small dividers of the attached design board. ONE delicate horizontal divider in raised, burnished gold leaf, alone: at its exact centre a tiny gilded lyre (about 9% of the image height), and from it a hair-fine engraved gilt line running level to both sides, tapering into small acanthus curls at its ends; the whole divider about 72% of the image width, perfectly level in the vertical middle of the canvas. Very fine and elegant, a subtle real gold-leaf sheen. Nothing else, plenty of empty space above and below. One soft warm light from the upper left. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ince yatay çizgi + ortada küçük lir; uçlarda akantus kıvrımı; kenarlara değmiyor; gerçek alfa.
Kullanım: başlık altları (home, story, details, rsvp); Claude dar şerit olarak kırpar; üstünden ışık süpürmesi.

#### W2.18 Program ikonları — beş ayrı dosya (gravür vinyetleri)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/icon_rings.png`, `icon_coupes.png`, `icon_dinner.png`, `icon_violin.png`, `icon_tophat.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the small programme icons on screen 4 of the attached design board. ONE small hand-engraved vignette like the little cuts in an 1890s theatre playbill, alone: crisp sepia-black (#2B211C) engraved outlines of one even, fairly bold weight (about 2.5% of the image width), only a little fine hatching for volume, and a few small touches of real burnished gold leaf (#C9A45C) — simple and clearly readable when shown at 32–40 px, filling about 60% of the square, centred, perfectly straight. No paper behind it, no circle, frame or badge around it, no background shape. All five icons of this set share exactly the same line weight, ink colour, gold touches and style. One soft warm light from the upper left on the gold. No cast shadow, no glow. No text, letters, numbers or monogram. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make five separate images:
icon_rings = two interlocked wedding rings
icon_coupes = two champagne coupes touching at the rim
icon_dinner = a round dinner plate seen from the front with a knife and a fork beside it
icon_violin = a violin with its bow laid across it
icon_tophat = a gentleman's top hat with a pair of evening gloves
```
Kontrol: beş dosya, her birinde tek ikon; hepsi aynı çizgi kalınlığı ve stilde; 40 px'te okunuyor; rozet/daire/kâğıt yok; gerçek alfa (Claude alfayı maske olarak kullanıp mürekkep rengini değiştirebilir).
Kullanım: details programı (ceremony = rings, champagne = coupes, dinner = dinner, first dance & encore = violin), dress code = tophat; satırlar "takip spotu" ile sırayla aydınlanır.

#### W2.19 Opera dürbünü (lorgnette)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/lorgnette.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the opera glasses on screen 5 of the attached design board. ONE pair of antique opera glasses on a long folding handle (a lorgnette), alone, photographed for real, lying slightly turned toward the viewer: two short barrels of warm antique gilt brass (#C9A45C toward deeper bronze) covered in mother-of-pearl, fine engraved bands, a slim brass bridge with a small focusing wheel, clear front lenses with only soft reflections, and a long slender brass handle with a mother-of-pearl inlay, the whole object laid on a gentle diagonal and filling about 72% of the square, centred. No case, no chain, no ribbon, no surface under it. One soft warm light from the upper left. No cast shadow or drop shadow, no glow or sparkle outside the object. No engraved letters, no text, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek opera dürbünü, uzun saplı; sedef + antik pirinç; yüzey/gölge yok; harf yok; gerçek alfa.
Kullanım: home imzası ve RSVP kapanışı (yavaş salınım); teşekkür modunda da kalır.

#### W2.20 Perde selamı — atılan gül ve varak konfeti (iki ayrı dosya)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/toss_rose.png`, `toss_confetto.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Grand Theatre Premiere" wedding website (give design-board.png as the style reference), matching the curtain-call rose and the drifting gold-leaf confetti of the attached design board. ONE single small object, alone, photographed for real, centred, not cropped, generous empty margin all round. One soft warm light from the upper left. Nothing else: no surface, no other objects, no dust, no sparkle. No cast shadow or drop shadow, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make two separate images:
toss_rose = one long-stemmed ivory garden rose (#F3EBD8, a faint warm blush deep in the petals) with two dark green leaves and a short garnet silk ribbon (#6E1A28) tied in a small knot round the stem, lying on a diagonal from lower left to upper right, filling about 80% of the diagonal
toss_confetto = one small disc of genuine gold-leaf paper confetti (#C9A45C body, #E8CF95 highlights), very thin, slightly curled at one edge, catching the light, filling about 35% of the square
```
Kontrol: iki dosya, her birinde tek nesne; gül fildişi (kırmızı değil), kurdele garnet; konfeti tek pul; yüzey/parıltı yok; gerçek alfa.
Kullanım: açılışın sonunda 6–8 konfeti (Claude döndürür/ölçekler); story'de 2–3 konfeti; RSVP gönderilince gül karta yay çizerek düşer + konfeti yağar (alkış sesiyle).

### Instructions for GPT — iş sırası ve teslim (PAKET 8)

```
Work only on PAKET 8 of collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md in the repository muzaffergrl/davetiye-maker (branch main). Ignore every other section of that file: PAKET 2, 3, 6R and 7 are done, PAKET 5R is the old look that this package replaces, and the note at the top of the file (page_ground / env_back / curtain_left as style references) does NOT apply to PAKET 8. Do NOT attach anything from collections/24_Grand_Theatre_Premiere/assets/gpt/parts/ that existed before this package (env_*, curtain_*, valance, ticket, rope, web_hero …) and nothing from platform/themes/; do not attach another design's board.

1. ONE chat, in this order. Send the "Instructions for GPT (send before the first image)" message of PAKET 8 first. Then W1, the design board: attach collections/24_Grand_Theatre_Premiere/assets/gpt/photos/hero_portrait.jpg, story_2.jpg and venue.jpg as the identity reference of the couple and the venue only. The board is the design; if it is weak or misses its Kontrol line, make it again before going on (at most 3 tries). Commit and push the board as soon as it is chosen.
2. Then W2, one image per prompt, in the order W2.1 to W2.20, in the same chat. Give the finished design-board.png as the reference image of EVERY W2 image. The programme canvas parts must line up: make W2.1 prog_cover first; make W2.2 prog_page, W2.3 prog_cover_in and W2.4 prog_pulltab by EDITING prog_cover.png (same 1024×1536 canvas, same box); give prog_page.png as a reference for W2.5 flat_proscenium; make W2.6 flat_curtain_l, W2.7 flat_curtain_r, W2.8 flat_backdrop and W2.9 flat_wings by EDITING flat_proscenium.png (same canvas). If your tool cannot edit, attach the base image as a reference and keep the box on the same pixels. Check by laying each one over its base at 50% opacity: the outline (or the opening) must sit in the same place at the same size; regenerate once if a shift is plainly visible and write any remaining difference in TESLIM.txt. For W2.12 also give house_lights.png.
3. Use each English prompt exactly as written. One object per image. No text, letters, numbers, monograms, logos or watermarks in any W2 image (sample text is allowed on W1 only). In the two multi-image prompts (W2.18 icons, W2.20 rose and confetto) each listed line is its own image and its own file.
4. Keep each image in the ratio of its Kaydet size: 1:1, 2:3 or 3:2 (W1 about 2.3:1). The pixel size may differ. Do not resize, crop, repaint or recolour any pixel with code — Claude crops thin bands and cuts the pieces.
5. Photo windows (W2.5 the stage opening, W2.16 the loge window) are TRANSPARENT openings; a ring that closes all the way round them matters more than the opening itself. Never fill them with green, white or a picture.
6. Counts (leaves, fringe strands, footlights, eyelets, damask motifs) do not matter; never regenerate for a count. Regenerate only for: a wrong object, text present, a cast/drop shadow or a glow outside the object, a fake background (white or checkerboard) instead of real alpha, an object touching the canvas edge, a wrong ratio, real fabric instead of painted card for the paper curtains, or a programme-canvas part that plainly does not line up with its base. At most 2 attempts per part; then keep the best one, note the defect and move on.
7. Delivery: commit every PNG to the repository at exactly the path on its Kaydet line, with exactly that file name (the parts in collections/24_Grand_Theatre_Premiere/assets/gpt/parts/, the board at collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/design-board.png). No zip, no Downloads folder, no other folder, nothing under platform/ or docs/, no new folder, no download names, no "_final", "_v2" or "(1)" suffixes; rejected tries are not committed. Save as PNG. Push to branch main; only if you cannot push to main, push a branch named codex/g24-paket8 and say so on the first line of TESLIM.txt. Run git pull --rebase origin main before each push. Push after W1, then after W2.4, W2.9, W2.14 and W2.20 ("24 PAKET 8: W1", "24 PAKET 8: W2 1/4", …) so nothing is lost if the chat breaks; the last commit is "24 PAKET 8: teslim". Touch no other file, write no code, do not run gpt_yerlestir.py or build_images.py.
8. Finally write collections/24_Grand_Theatre_Premiere/assets/gpt/parts/TESLIM.txt in Turkish: branch and last commit; how many files were delivered (expected: the board + 25 parts); for every file the target size and the actual size, RGBA or RGB (real alpha channel or not), the number of attempts and every difference from its Kontrol line (be specific); the alignment results (prog_page, prog_cover_in and prog_pulltab against prog_cover; the two curtains, the backdrop and the wings against flat_proscenium: shift yes/no, roughly how much); anything skipped and why; which reference images were attached; and one line confirming that no pixels were changed by code. If you cannot write to the repository at all, stop and say so clearly in the chat; do not hand the upload to the user.
```
