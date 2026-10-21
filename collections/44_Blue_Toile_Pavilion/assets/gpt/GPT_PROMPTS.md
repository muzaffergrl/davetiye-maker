# GPT görsel istekleri — Tasarım 44 · Blue Toile Pavilion

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> initials, monograms, crests, logos, labels, backstamps or watermarks in any image, and no QR codes.** The toile is an
> ORIGINAL pastoral pattern invented for this design (a garden pavilion, a tree swing, birds on branches, a pair of doves,
> a little footbridge — no human figures): it must not copy any historic or commercial toile, porcelain pattern or fabric.
> Give W1 `toile_fabric.png`, W2 `porcelain_paper.png` and W3 `linen_wall.png` as the style reference of every later
> part: the same single-colour toile-blue copperplate engraving line, the same porcelain white, the same powder-blue
> linen, the same soft cool daylight from the top-left.

Bu dosya tasarım 44'ün **bütün görsel parçalarının** tek kaynağıdır (4. dalga 39–48, `docs/33_GPT_YENI_10_TASARIM.md`,
akım şeridi). Tasarım henüz `concept`: tema (`platform/themes/blue-toile-pavilion/`) **yok**, geçici görsel de yok;
parçalar repoya geldikçe tema bunlarla kurulacak (G4NN benzeri iş, önerilen G444). Claude şekil/dekor çizmez (K21):
gelmeyen parçanın çizilmiş yedeği olmaz.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/44_Blue_Toile_Pavilion/assets/gpt/` altındaki `parts/`
  (PAKET 5), `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/44_Blue_Toile_Pavilion --paket 5` ve `--paket 2`. Tema
  kurulunca `python3 platform/themes/blue-toile-pavilion/build_images.py` PAKET 5'in **her parçasını geldiği anda**
  kullanır (G167 düzeni: img/ yeniden üretilir, `parts.css` gelen parçaların kurallarıyla yazılır; gelmeyenler
  `img/manifest.json` → `parts.waiting_for_gpt`), ardından `python3 tools/gpt_kuru_deneme.py --tema blue-toile-pavilion
  --sekil collections/44_Blue_Toile_Pavilion/assets/gpt/kuru_sekil.json` (prova; gerçek parçalarla da koşulabilir),
  theme-check ve göz kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **copperplate engraving (toile line) + photorealism** — fine single-colour engraved line work (hatching,
  cross-hatching, stipple; no solid fills) printed on real woven cotton; real glazed porcelain with clean bright
  reflections, real powder-blue linen, real silk; soft cool daylight from the top-left. Classic, romantic, airy and
  rich; not cartoon, not flat vector, not clip-art.
- Toile deseni (bütün toile parçalarında **aynı** çizgi ve aynı sahneler): bu tasarım için icat edilmiş pastoral bahçe —
  ince sütunlu küçük kubbeli bahçe köşkü, iki yuvarlak ağaç, alçak daldan sarkan boş ip salıncak, çiçekli dallarda küçük
  kuşlar, gagalaşan güvercin çifti, sazlıklı dere üstünde küçük kemerli köprü; aralarında hafif çiçekli dallar ve dengeli
  krem boşluk. **İnsan figürü yok.** Hiçbir tarihî ya da ticari toile'ın, porselen deseninin kopyası değil.
- Renkler: toile blue `#4A6A96` · deep toile `#2E4A72` · powder blue `#BCCDE2` · porcelain `#F7F6F1` · linen `#ECE7DC` ·
  blush ribbon `#E7C6C3` · gilt `#B99B5F` · ink `#22324A`.
- Işık: yumuşak, serin gün ışığı, sol üstten; porselende temiz parlama; bütün parçalarda aynı. Şeffaf parçalarda gerçek
  alfa (beyaz ya da dama deseni değil), nesne tuvalin en az %6 içinde (yalnız W16 girland sol/sağ kenara değer),
  nesnenin dışında gölge ya da hâle yok (gölgeyi site ekler).
- Gerçek bir mekâna, markaya, kumaş evine, porselen üreticisine, müze parçasına ya da başka bir satıcının tasarımına
  benzemesin. 30 Azulejo'dan ayrı: kobalt çini ve karo yok; 02 Dusty Blue'dan ayrı: mum mühür ve okaliptüs yok.

## Kapalı zarf geometrisi (W4–W8 buna göre)
Zarf **dikey**, arkadan görünür; tuval **1110×1500**, zarf kutusu **x %7–93, y %6–94** (x 78–1032 px, y 90–1410 px;
954×1320 px ≈ 0,72:1 — şartnamedeki ≈0,74:1, esas olan kutu yüzdeleri). Arka (W4), ön (W5) ve kapak (W6) **aynı
tuvalde, aynı konumda** çizilir; Claude her birini kendi kutusuna kırpar. Zarfın yüzdesiyle:
- **Ön cep** %40'tan alta (y≈618 px), düz üst kenar. Kapalı ogee kapağın yanlarında astar görünmesin diye iki **yan
  kanat** de ön katmandadır: sol ve sağ kenar boyunca cepten üst köşelere incelen kama (cepte zarf eninin ~%20'si).
- **Ogee kapak** üstten iner: yanlar zarf kenarı boyunca %22'ye (y≈380 px) düz iner, oradan iki yandan önce dışbükey
  sonra içbükey S kıvrımla ortadaki **sivri uca, %56**'ya (y≈829 px) ulaşır (ters soğan kubbe). Kenarı toz mavisi biye.
- **Broş** (W8, ayrı tuval) merkezi zarfın **(%50, %53)** noktası (x≈555, y≈790 px), çapı zarf eninin **%20**'si
  (≈191 px): kapağın sivri ucunu örter.
- **Kapağın iç yüzü** (W7) ayrı tuvalde (1110×720), küçültülmüş ölçekte: katlanma çizgisi altta, sivri uç üstte.
Açılışta broş iğnesinden çıkıp kalkar ve yana süzülür, kapak üst kenarında 3B açılır, üç gravür kuş (W9) kumaştan
havalanıp yay çizerek uçar, kart (W10) cepten yükselir.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Özgün toile kumaş (zarf kumaşı, bantlar)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/toile_fabric.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of a cream-white cotton toile fabric (ground #F7F6F1) printed in one single colour, toile blue (#4A6A96), with an ORIGINAL pastoral garden pattern invented for this design — not a copy of any historic or commercial toile. Fine copperplate-engraving line work (delicate hatching, cross-hatching and stipple, no solid fills) draws small scenes that float on the cream ground in a balanced half-drop repeat, about three repeats across the square: a little domed garden pavilion with slender columns between two rounded trees; a broad old tree with an empty rope swing hanging from a low branch; small birds perched on curving flowering branches; a pair of doves billing on a twig; a tiny arched footbridge over a stream edged with reeds. Light sprays of leaves and blossoms link the scenes, with calm, even spaces of cream between them. No people, no animals other than birds. Real woven cotton with a fine visible weave, the ink sitting slightly soft on the threads, evenly lit by soft cool daylight from the top-left. Flat: no fold, no crease, no wrinkle, no seam line, no vignette, no shadow. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 ek yeri yok); tek renk toile mavisi çizgi, krem zemin; köşk, salıncak, kuşlar, güvercin çifti,
köprü seçiliyor; insan/yazı yok; sahneler arası boşluk dengeli.
Kullanım: tema kurulunca zarfın kumaşı (W4–W6 gelene kadar), index ve home bantları, details program kenarı; bütün
sonraki parçaların çizgi referansı.

#### W2 Porselen beyazı kart (kartlar, form, sayfa zemini)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/porcelain_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of smooth, heavy porcelain-white card stock (#F7F6F1) with the faintest linen-weave emboss, an even cool-white tone, calm enough for deep ink-blue text (#22324A) to read on it everywhere. Evenly lit by soft cool daylight from the top-left. No fold, no deckle edge, no stain, no printing, no pattern, no shadow, no vignette. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin porselen beyazı; çok hafif keten dokusu; dikişsiz; leke/baskı yok.
Kullanım: tema kurulunca sayfa zemini, home kartı, RSVP formu, details program kâğıdı; zarftan yükselen kart (W10 gelene
kadar).

#### W3 Toz mavisi keten duvar (tabak duvarı, bantlar)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/linen_wall.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat texture of pale powder-blue linen (#BCCDE2) stretched smooth like a fabric-covered wall: a natural slubby linen weave with fine irregular threads, a soft tonal variation between a slightly paler and a slightly deeper powder blue, matte and calm, so porcelain plates hung on it stand out and deep-blue or white text reads on it. Evenly lit by soft cool daylight from the top-left. No folds, no wrinkles, no seam lines, no nails, no hooks, no pattern, no vignette, no shadow. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; açık toz mavisi `#BCCDE2` civarı; keten dokusu, desen/çivi yok; üstünde yazı okunur.
Kullanım: tema kurulunca story'deki tabak duvarı, home davet bandı, zarfın iç astarı (W4 gelene kadar).

#### W4 Zarfın arkası (iç astar görünür)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/env_back.png` · 1110×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope covered in the toile fabric of toile_fabric.png, seen perfectly straight on, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the 1110×1500 canvas (from x 78 px to x 1032 px and from y 90 px to y 1410 px), a crisp upright rectangle with very slightly softened corners. Its inside faces us and is lined all over with plain pale powder-blue linen (#BCCDE2, the linen of linen_wall.png), with a slim edge of the cream-and-blue toile fabric (about 2% of the envelope's width) showing along the top and both sides. Soft cool daylight from the top-left, a gentle shade towards the bottom where the pocket will sit. No flap, no front pocket, no side flaps, no brooch, no card inside. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf tuvalin x %7–93, y %6–94 kutusunda; iç yüz düz toz mavisi keten, kenarlarda ince toile pay; kapak/cep yok;
kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca zarf kutusuna kırpılır → `.env-back` (kapak açılınca görünen iç).

#### W5 Zarfın önü (cep + iki yan kanat)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/env_front.png` · 1110×1500 · **Şeffaf zemin**

```
Only the front of the same toile envelope as env_back.png — the bottom pocket and the two folded-in side flaps — on the same 1110×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (x 78–1032 px, y 90–1410 px). The bottom pocket spans the full width from 40% of the envelope's height (y ≈ 618 px) down to its bottom edge (y 1410 px), with a straight, crisp folded top edge. Along the left and right edges the two side flaps rise from the pocket to the top corners as slim tapering wedges: each is about 20% of the envelope's width wide where it meets the pocket and narrows to a point at the top corner (y 90 px); their inner edges are crisp folded edges. Everything is covered in the toile fabric of toile_fabric.png at the same pattern scale, neatly folded over the paper edges, with a very soft contact shade along each fold. Between the two wedges, above the pocket, the canvas is completely transparent (the lining of env_back.png shows there). Soft cool daylight from the top-left. No top flap, no piping, no brooch, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep %40'tan alta, düz üst kenar; iki yan kanat üst köşelere incelir; aralarındaki üst bölge tamamen şeffaf;
kapak/broş yok; gerçek alfa.
Kullanım: tema kurulunca zarf kutusuna kırpılır → `.env-front`; kart bunun arkasından yükselir (yan kanatlar kartın
önünde kalır).

#### W6 Ogee kapak (kapalı, dış yüz)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/flap.png` · 1110×1500 · **Şeffaf zemin**

```
Only the closed ogee flap of the same toile envelope, on the same 1110×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (x 78–1032 px, y 90–1410 px); the flap spans its full width from the envelope's top edge (y 90 px), with a soft rounded fold along the top, and lies folded down over the pocket. Its two sides run straight down the envelope's left and right edges to 22% of the envelope's height (y ≈ 380 px); from there its lower edge forms an ogee: each side swells downward and inward in a full convex curve, then turns concave and draws out into one slender pointed tip at the centre at 56% of the envelope's height (y ≈ 829 px), like an upside-down onion dome. The flap is covered in the toile fabric of toile_fabric.png and its whole curved edge is finished with a slim round powder-blue silk piping cord (#BCCDE2), about 1% of the envelope's width thick, with a very soft contact shade on the fabric just inside the piping. Soft cool daylight from the top-left. Everything below the flap is completely transparent. No brooch, no pin, no seal, no ribbon (the brooch is a separate image). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yanlar %22'ye düz, sonra S kıvrımla sivri uç %56'da; kenar boyunca toz mavisi biye; broş/mühür yok; altı
tamamen şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapak kutusuna kırpılır → `.flap` (kapalı kapak); açılışta üst kenarında 3B döner.

#### W7 Kapağın iç yüzü (açıkken)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/flap_in.png` · 1110×720 · **Şeffaf zemin**

```
The inside face of the same ogee flap as flap.png, alone, as it stands up above the envelope when the flap is open, seen straight on, on a fully transparent background. The same outline as flap.png, slightly scaled down to fit, and mirrored top-to-bottom: its straight fold line is at the BOTTOM and its slender pointed tip is at the TOP. The flap occupies x 13–87% and y 6–94% of the 1110×720 canvas: the straight fold line runs along y 94% (677 px); the two sides rise straight from it to about 59% of the canvas height (y ≈ 428 px); from there the ogee curves swell outward and then draw inward to the pointed tip at the centre at y 6% (43 px). It is lined with plain pale powder-blue linen (#BCCDE2, as in env_back.png) with a delicate engraved border of tiny leaves printed in toile blue (#4A6A96) following the outline a little inside the edge, and the powder-blue piping visible along the curved edge. Soft cool daylight from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz katlama çizgisi altta, sivri uç üstte; toz mavisi keten astar + ince gravür yaprak bordür; biye görünüyor;
gerçek alfa.
Kullanım: tema kurulunca kapak 3B açılınca (zarfın üstünde dik dururken) görünen iç yüz.

#### W8 Porselen kamea broş (kapanış)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/brooch.png` · 520×520 · **Şeffaf zemin**

```
A single round porcelain cameo brooch, alone, seen perfectly straight on, on a fully transparent background, filling about 80% of the square, centred: a softly domed disc of glossy porcelain-white glaze (#F7F6F1) hand-painted in toile blue (#4A6A96) and powder blue (#BCCDE2) with a tiny spray of little five-petalled blue flowers and two small leaves, set in a slim polished gilt bezel (#B99B5F) with a fine beaded rim. Clean bright glaze reflections from soft cool daylight at the top-left. Only flowers on it — no face, no profile, no figure, no bird. The pin is on the back and not visible. No chain, no ribbon, no fabric behind it. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek yuvarlak broş; altın kenar; yalnız minik mavi çiçek (yüz/profil yok); harf yok; kenarlara değmiyor; gerçek
alfa.
Kullanım: tema kurulunca kapağın sivri ucuna iğneli broş (merkez zarfın %50/%53'ü, çap zarf eninin %20'si); dokununca
iğnesinden çıkıp kalkar ve yana süzülür; home imzasında küçük.

#### W9 Gravür kuş (kumaştan havalanan) — üç ayrı dosya
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/bird_1.png`, `bird_2.png`, `bird_3.png` · her biri 600×500 · **Şeffaf zemin**

```
A single small dove in flight, drawn as a fine copperplate engraving in one colour, toile blue (#4A6A96) — the same line work as the birds of toile_fabric.png (delicate hatching on the wings and breast, a few stippled feathers, a crisp outline) — alone, on a fully transparent background. The bird's body and wings are filled with pale porcelain cream (#F7F6F1) behind the blue lines, so it reads as one solid cut-out; outside its outline everything is transparent. Seen from the side, flying to the right, about 80% of the image width, centred. A flat printed engraving, no painted 3D shading. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files: the same bird, the same size, the same line — 1 = wings raised high, 2 = wings swept down, 3 = gliding with wings spread level.)
```
Kontrol: üç dosyada aynı kuş, üç kanat pozu; tek renk toile mavisi çizgi, içi krem dolu; dışı şeffaf; gerçek alfa.
Kullanım: tema kurulunca açılışta kumaştan havalanıp ekranda yay çizerek uçan üç kuş (pozlar sırayla değişir → kanat
çırpma); RSVP gönderilince iki kuş (bird_3 → bird_2) girlandın dalına konar; details programında satır başı küçük kuş.

#### W10 Zarftaki kart (boş)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card of the porcelain-white card of porcelain_paper.png, alone, seen straight on, on a fully transparent background: the card occupies x 7–93% and y 6–94% of the 1000×1400 canvas, with crisp clean edges and very slightly rounded corners, and a fine engraved toile border printed in toile blue (#4A6A96) a little inside the edge: slim trailing branches with leaves and tiny blossoms, a small pair of doves at the top centre and a little garden pavilion vignette at the bottom centre, all within the outer 12% of the card. The centre of the card is EMPTY, calm paper (the website sets the names and the date there). Soft cool daylight from the top-left, a very soft contact shade on the card itself only. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek porselen kart; gravür bordür yalnız dış %12'de; orta tamamen boş; yazı yok; gerçek alfa.
Kullanım: tema kurulunca zarftan yükselen kart (`card_small`); isim ve tarih HTML olarak ortaya dizilir.

#### W11 Yuvarlak porselen tabak (yuvarlak foto penceresi)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/plate_round.png` · 1000×1000 · **Şeffaf zemin**

```
A single round blue-and-white porcelain plate seen perfectly straight on from the front, as it hangs on a wall, alone, on a fully transparent background: the plate is a circle 860 px across, centred at (500, 500) of the 1000×1000 canvas (from 70 px to 930 px). Glossy porcelain-white glaze (#F7F6F1); the wide rim is hand-painted underglaze in toile blue (#4A6A96) and deep toile (#2E4A72) with a continuous border of the toile garden motifs of toile_fabric.png — tiny domed pavilions, birds on flowering branches, sprays of hydrangea — between two fine bands, with a slim gilt line (#B99B5F) along the outer edge and another around the well. In the centre a perfectly round photo window 600 px in diameter, centred at (500, 500) (from 200 px to 800 px both ways), filled with flat pure green #00FF00 (no texture, no shading, crisp circular edge, nothing over it). Clean bright glaze reflections from soft cool daylight at the top-left, on the rim only. No hanger, no wire, no ribbon, no bow (those are separate images). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. No backstamp.
```
Kontrol: yuvarlak pencere düz `#00FF00`, çap 600, merkez (500, 500); kenar bordürü toile motifli + ince yaldız; askı
yok; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür (`manifest plate_round.window_pct`) ve şeffaf yapılır; home kartında
portre, hikâye tanıtımı, Story 1 ve 3. Keten duvarda üstüne W15 fiyonk konur; sahnesinde askıda sallanıp oturur, sırdan
ışık şeridi geçer.

#### W12 Dalgalı kenarlı tabak (ikinci yuvarlak pencere)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/plate_scalloped.png` · 1000×1000 · **Şeffaf zemin**

```
A second blue-and-white porcelain plate with a gently scalloped edge, seen perfectly straight on from the front, as it hangs on a wall, alone, on a fully transparent background: the plate is 860 px across at the tips of its twenty-four even rounded scallops, centred at (500, 500) of the 1000×1000 canvas. Glossy porcelain-white glaze (#F7F6F1); the rim is hand-painted underglaze in toile blue (#4A6A96) with a garland of hydrangea heads and slender delphinium spires linked by trailing leaves, a fine gilt line (#B99B5F) following the scalloped edge and a plain thin blue band around the well — the same porcelain and the same brushwork as plate_round.png. In the centre a perfectly round photo window 560 px in diameter, centred at (500, 500) (from 220 px to 780 px both ways), filled with flat pure green #00FF00 (no texture, no shading, crisp circular edge, nothing over it). Clean bright glaze reflections from soft cool daylight at the top-left, on the rim only. No hanger, no wire, no ribbon, no bow. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. No backstamp.
```
Kontrol: dalgalı kenar (24 tarak); yuvarlak pencere düz `#00FF00`, çap 560, merkez (500, 500); askı yok; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür (`manifest plate_scalloped.window_pct`); Story 2 ve story duvarının
ortadaki tabağı; askıda sallanıp oturur.

#### W13 Oval servis tabağı (mekân fotoğrafı)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/platter_oval.png` · 1600×1100 · **Şeffaf zemin**

```
An oval blue-and-white porcelain serving platter seen perfectly straight on from the front, as it hangs on a wall, alone, on a fully transparent background: the platter is an oval 1400 px wide and 960 px tall, centred at (800, 550) of the 1600×1100 canvas (x 100–1500 px, y 70–1030 px). Glossy porcelain-white glaze (#F7F6F1); the wide rim is hand-painted underglaze in toile blue (#4A6A96) and deep toile (#2E4A72) with the toile garden scenes of toile_fabric.png — the little domed pavilion at the top centre, the tree swing and the footbridge at the sides, birds and flowering branches between — with a slim gilt line (#B99B5F) on the outer edge and another around the well. In the centre an oval photo window exactly 1100 px wide and 733 px tall (3:2), centred at (800, 550) (x 250–1350 px, y 184–917 px), filled with flat pure green #00FF00 (no texture, no shading, crisp oval edge, nothing over it). Clean bright glaze reflections from soft cool daylight at the top-left, on the rim only. No hanger, no wire, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. No backstamp.
```
Kontrol: oval pencere düz `#00FF00`, 1100×733 (3:2), merkez (800, 550); kenarda toile sahneleri + yaldız; gerçek alfa.
Kullanım: tema kurulunca details'te mekân fotoğrafının çerçevesi (pencere ölçülür); sahnesinde askıda sallanıp oturur.

#### W14 Zencefil kavanozunda çiçekler
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/ginger_jar.png` · 900×1300 · **Şeffaf zemin**

```
A blue-and-white porcelain ginger jar holding fresh flowers, alone, seen straight on, on a fully transparent background: a classic round-shouldered jar with its lid off, in glossy porcelain-white glaze hand-painted in toile blue (#4A6A96) with flowering branches and a small pair of doves (an original design, not a copy of any antique or museum piece), standing in the lower half of the image; from its mouth rises a generous, natural arrangement of creamy white hydrangea heads with cool soft shadows and tall spires of blue delphinium shading from #4A6A96 to #BCCDE2, with a few soft leaves. Together they fill about 88% of the image height and about 76% of its width, centred. Photorealistic, clean glaze reflections from soft cool daylight at the top-left. No table, no cloth, no lid, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek kavanoz (kapaksız) + beyaz ortanca + mavi hezaren; masa/örtü yok; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca home kartının ve imzanın yanında köşe süsü; details'te mekân tabağının yanında.

#### W15 Toz mavisi ipek fiyonk (tabak askısı, home kartı)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/bow.png` · 700×500 · **Şeffaf zemin**

```
A single powder-blue silk bow, alone, seen straight on, on a fully transparent background: a full, softly sculpted bow of lustrous powder-blue silk satin (#BCCDE2) with two rounded loops, a neat knot and two short tails falling down and outward with V-notched ends, a gentle sheen and fine folds lit by soft cool daylight from the top-left. It fills about 80% of the image width, centred. No pin, no hanger, no plate, no other ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek fiyonk, iki ilmek + iki V kesik kuyruk; askı/tabak yok; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca her tabağın askı noktasında (tabak bunun altından sallanır) ve home kartının üstünde.

#### W16 Gravür girland (bölüm ayırıcı, yatay dikişsiz)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/toile_border.png` · 2400×400 · **Şeffaf zemin** (yatay dikişsiz)

```
A long horizontal garland band for a section divider, on a fully transparent background, 2400 × 400 px: one continuous trailing garland of flowering branches, leaves, tiny blossoms and small birds on twigs, with a little pair of doves at intervals, drawn as a fine copperplate engraving in one colour, toile blue (#4A6A96) — the same line work as toile_fabric.png. The garland is 200 px tall and sits in the vertical middle of the image, from y 100 px to y 300 px; its leaves, blossoms and birds are filled with pale porcelain cream (#F7F6F1) behind the blue lines, so the band reads as solid cut-out motifs, and between the motifs the background is transparent. The left and right ends of the garland run off the left and right edges and must join seamlessly when the strip is repeated side by side. Keep the WHOLE garland inside the band from 25% to 75% of the image height: nothing may touch the top or bottom border, only the left and right ends run off the left and right edges because the strip repeats; above and below the band the background must be fully transparent. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: girland y 100–300'de, üstü ve altı tamamen şeffaf; sol/sağ uçlar kenara değer ve yan yana eklenince dikişsiz;
tek renk mavi çizgi, içi krem; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında ve bantların kenarında yatay tekrar (`repeat-x`); RSVP'de güvercinlerin
konduğu dal.

#### W17 Süzülen küçük çiçekler — iki ayrı dosya
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/accent_1.png`, `accent_2.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small flower element, photorealistic, alone, on a fully transparent background, filling about 55% of the square, centred, not cropped, soft cool daylight from the top-left. Nothing else in the image. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make two files, the same size and style: 1 = one creamy white hydrangea floret with four soft petals and a tiny pale-blue eye; 2 = one blue delphinium floret shading from #4A6A96 to #BCCDE2 with its small spur.)
```
Kontrol: her dosyada tek çiçekçik; iki dosya farklı; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca kaydırınca süzülen birkaç çiçekçik; RSVP kapanışında küçük süs.

#### W18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft cool daylight from the top-left: the closed portrait toile envelope of env_back.png, env_front.png and flap.png with its ogee flap and powder-blue piping, the round porcelain cameo brooch of brooch.png pinned at the flap's tip, lying slightly below the centre on a natural linen tablecloth (#ECE7DC); at the left the blue-and-white ginger jar of ginger_jar.png with white hydrangeas and blue delphinium; at the right two blue-and-white porcelain plates (as plate_round.png and plate_scalloped.png, their centres plain white glaze, nothing painted there), slightly overlapping, with a powder-blue silk bow (as bow.png); behind, softly out of focus, a wall covered in the toile fabric of toile_fabric.png. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf ve broş bütün, altında boşluk; üst %20 sakin; tabak ortaları boş beyaz; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Adeline & Victor; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography in colour, a cool fresh palette of porcelain white, toile blue and
powder blue with soft leafy garden tones, soft daylight, subtle film grain; ONE fictional couple in their early thirties,
the same two people in every photo (they must not resemble any real person or celebrity): Adeline — long straight
dark-blonde hair worn half up with a powder-blue silk ribbon, fair skin, a slim gold ring; Victor — short dark-brown wavy
hair, clean-shaven, olive skin. Modern, elegant clothing (no costume). The portrait and Story photos are cropped to a
circle in a porcelain plate and the venue photo to a 3:2 oval: keep faces and hands inside the middle 70%. No text, no
frame, no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Portre ve Story fotoğrafları sitede **yuvarlak** (tabak penceresi), mekân
**oval 3:2** kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 colour wedding portrait of the fictional couple Adeline and Victor, in their early thirties (Adeline: long straight dark-blonde hair worn half up with a powder-blue silk ribbon, fair skin, a slim gold ring; Victor: short dark-brown wavy hair, clean-shaven, olive skin; they must not resemble any real person or celebrity) standing in front of a white open-sided garden pavilion with slender columns: she in a simple ivory silk gown with a small bouquet of white hydrangea and blue delphinium, he in a navy suit with a white boutonnière, close together and smiling at each other, waist-up, faces in the upper middle of the frame and well inside the centre; behind them, softly out of focus, clipped hedges and blue-and-white planters. Photorealistic, cool fresh palette, soft daylight, subtle grain. No frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.2 Story 1 — "Tea in the garden"
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid colour photo: the same couple as hero_portrait.jpg (same faces, hair and skin) having tea at a small round garden table under the trees, blue-and-white porcelain cups and a teapot between them, she laughing as he pours, dappled soft light, leafy garden softly out of focus; faces and hands in the middle of the frame. Photorealistic, same cool palette and grain. No readable labels, no frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.3 Story 2 — "The old swing"
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid colour photo: the same couple as hero_portrait.jpg at an old wooden rope swing hanging from a broad tree, she sitting on the swing with her ribbon fluttering, he standing behind her about to push and leaning in to say something that makes her smile, soft dappled daylight, a lawn and a hedge softly out of focus; both faces in the middle of the frame. Photorealistic, same cool palette and grain. No frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.4 Story 3 — "A ring and a promise"
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up colour photo: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, in the middle of the frame, a blue-and-white porcelain teacup and a sprig of white hydrangea softly out of focus behind them on a linen tablecloth, shallow depth of field, soft cool daylight. Photorealistic, same palette and grain. No frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.5 Mekân
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9 colour photo: a white open-sided garden pavilion with a small dome and slender columns at the end of a lawn, prepared for a wedding ceremony — clipped hedges and topiary, large blue-and-white porcelain planters with white hydrangeas, rows of white ceremony chairs with a central aisle, soft late-afternoon daylight, mature trees behind. A generic place that does not resemble any real estate or venue. No people, no signs, no religious objects. Photorealistic, same cool fresh palette. No text, letters, numbers, monograms, logos or watermarks.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'blue-toile-pavilion'` bloğu
> **henüz yok**: tema kurulunca eklenecek (şu an geçici `composed` görünüm de yok).
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden süsleme yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90, arka yüzde %13'ün altı × %9–%91 tamamen boş istenir
> (isimler/tarih/mekân öne; program ve QR arkaya — QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir). Metin
> kutuları tema kurulunca bu alanın ~%3 içine yazılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema kurulunca `layouts.ts`'e `'blue-toile-pavilion'` bloğu eklenir: `sources` → `{ front:
>    'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme blue-toile-pavilion` ve `node scripts/print-sample.ts
>    --theme blue-toile-pavilion --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the smooth porcelain-white card of porcelain_paper.png. Across the top, a toile vignette printed in one colour, toile blue (#4A6A96), with the same copperplate-engraving line as toile_fabric.png: the little domed garden pavilion at the centre with flowering branches spreading to both sides and a pair of doves perched on them, its lowest line staying above 17% of the height and all of it between 8% and 92% of the width. Along the bottom a slim engraved garland of leaves and blossoms (as toile_border.png), staying below 93% of the height and between 8% and 92% of the width. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no line, no bird, no leaf, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. No QR code. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; gravür yalnız üst ve alt bantta, yan %8'e girmiyor; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/44_Blue_Toile_Pavilion/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same porcelain-white card, only a small engraved pair of doves on a flowering twig printed in toile blue (#4A6A96) at the top centre, with the same line as toile_fabric.png, its lowest line staying above 11% of the height and all of it between 9% and 91% of the width. Everything below 13% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no line, no bird, no shadow, no stain. No text, letters, numbers, monograms, logos or watermarks. No QR code. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kart; yalnız üst ortada küçük güvercin çifti (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

PAKET 3/7 (Etsy ilan sahneleri) bu dosyada yok: tema kurulunca `tools/paket7_ilan.py` ile üretilecek.
