# GPT görsel istekleri — Tasarım 34 · Red Lacquer & Double Happiness

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, logos,
> monograms, seals with writing or watermarks in any image.** The only character allowed anywhere is the double
> happiness character 囍, and only in W2.11 `xi_gold.png` (and in W2.20 / PAKET 6 where the prompt asks for it) — never
> any other Chinese character, no stamp, no calligraphy, no religious symbol (no Buddha, no temple, no deity, no
> incense, no shrine). Give W2.2 `red_paper.png`, W2.3 `cream_paper.png`, W2.4 `gold_leaf.png` and W2.7
> `envelope_flap.png` as the style reference of every later part: the same cinnabar paper, the same warm cream, the same
> gold leaf, the same crisp paper-cut technique.

Bu dosya tasarım 34'ün **bütün görsel parçalarının** tek kaynağıdır (G183). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema
(`platform/themes/red-lacquer-double-happiness/`) **geçici** görsellerle çalışıyor: 04'ün lifli kâğıdı zincifre kırmızısına,
07'nin benekli kâğıdı koyu lake kırmızısına, 01'in pamuk kâğıdı sıcak kreme tonlandı; altın varak = 17'nin altın mührünün
düz metal yüzeyinden dikdörtgen kırpım (defne yok). Zarf şimdilik bu kırmızı kâğıdın dikdörtgen kırpımları (arka, cep,
kapak), düğmeler altın varağın yuvarlak kırpımları, 囍 Ma Shan Zheng yazı tipinin tek karakteri (altın varakla dolu);
ip, kâğıt kesim pencereler (şimdilik düz kırmızı/altın dikdörtgen yarılar), altın bulutlar, ay kapısı çerçevesi, kâğıt
kesim bordür ve katmanlar, püsküllü düğüm **yok** (çizilmiş yedek yok, K21). Parçalar gelince ne değişeceği: tema
README → "What waits for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/` altındaki `parts/`
  (PAKET 5), `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/red-lacquer-double-happiness/build_images.py` — PAKET 5'in **her parçası
  geldiği anda kendiliğinden** kullanılır (G167 düzeni): img/ yeniden üretilir,
  `platform/themes/red-lacquer-double-happiness/parts.css` o parçaların kurallarıyla yazılır; gelmeyen parçanın kuralı
  yazılmaz, sayfa geçici görünümünde kalır (`img/manifest.json` → `parts.used` / `parts.waiting_for_gpt`). Sonra
  `python3 tools/kit_check.py collections/34_Red_Lacquer_Double_Happiness --paket 2`, `python3 tools/gpt_kuru_deneme.py
  --tema red-lacquer-double-happiness --sekil collections/34_Red_Lacquer_Double_Happiness/assets/gpt/kuru_sekil.json`
  (prova; gerçek parçalarla da koşulabilir) ve göz kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **Chinese paper cutting (jianzhi) + red lacquer + gold leaf**, rendered photorealistically (real paper fibres,
  real cut edges with a hair of shadow, real lacquer gloss, real leaf): classic, romantic, rich and festive, for a wide
  audience. Not a cartoon, not a Lunar New Year sale poster, not neon, no dragons, no lanterns with writing, no coins.
- Motifs: tree peonies (the main flower), auspicious cloud scrolls (xiangyun) in gold, plum blossom as a small accent,
  lattice (window grille) patterns, a red silk knot with a tassel. The double happiness character 囍 only where asked.
- Renkler: lacquer `#4A0A0E` · lacquer deep `#2C0507` · cinnabar paper `#A81E24` · red ink `#8C1A1F` · cream `#F5ECD8` ·
  cream shade `#E9DCC0` · gold `#C9A14A` · gold light `#E6C983` · gold ink `#8A5F1C` · ink `#3A0D0E`
- Işık: yumuşak sıcak lamba ışığı, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama
  deseni değil).
- Saygı: semboller yaygın ve saygılı (şakayık, bulut, düğüm, 囍); dini simge yok. Gerçek bir markaya, restorana, otele
  veya başka bir satıcının tasarımına benzemesin. 21 Crimson Rose Atelier'den (gül, V kapak, mum mühür) ve 31 Sky
  Lantern Festival'den (fenerler, alacakaranlık gökyüzü) ayrı: burada gül, mühür ve uçan fener yok.

## Kapalı zarf geometrisi (W2.5–W2.14 buna göre)
Zarf **dikey, 0,66 en / 1 boy** (990×1500 tuval). Bütün ölçüler zarfın yüzdesiyle (sol, üst, genişlik, yükseklik):
- arka (W2.5) ve cep (W2.6): tam tuval; **cebin üst kenarı %30 yükseklikte**, düz.
- kapak (W2.7, W2.8): üstte, tam genişlik, yüksekliğin **%0–%52**'si (990×780 tuval); üst kenarı düz katlama çizgisi.
- düğmeler (W2.9, aynı görsel iki kez): merkezleri (%50, %47) — kapağın ucunda — ve (%50, %62) — cepte; çap = zarf
  genişliğinin **%14**'ü.
- ip (W2.10): kutu sol %36, üst %41, genişlik %28, yükseklik %27 (410×600 tuval); iki düğmenin çevresinden sekiz
  çizerek dolanır.
- 囍 (W2.11): cepte, kutu sol %33, üst %70, genişlik %34 (kare).
- kart (W2.12–W2.14): sol %6, üst %8, genişlik %88, yükseklik %84 → **0,69:1** (968×1400 tuval). Açılışta zarftan
  yükselir; üstünde iki kâğıt kesim pencere katı (dış kırmızı, iç altın) ortadan ikiye kesilir ve kanat gibi açılır.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W2.1 Lake zemin (sayfa zemini)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/lacquer.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat texture of an old hand-polished Chinese red lacquer surface in a deep oxblood lacquer red (#4A0A0E), filling the whole square edge to edge: a soft, deep, slightly glossy depth with very subtle mottling of a darker red (#2C0507) and the faintest hairline crackle of aged lacquer, calm and even everywhere so that cream and gold text reads on it. No pattern, no gold, no motif, no reflection of objects, no vignette, no gradient, no object. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#4A0A0E` civarı; sakin (üstünde krem yazı okunur); desen/yazı yok.
Kullanım: `lacquer-640` = bütün sayfaların zemini.

#### W2.2 Zincifre kırmızı kâğıt (zarf kâğıdı)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of fine handmade Chinese red paper in a warm cinnabar red (#A81E24), the paper of a wedding envelope: soft visible paper fibres, a gentle natural tooth, a sparse scattering of tiny gold-leaf flecks (a few dozen, very small, irregular), evenly lit from the top-left. No shadow, no vignette, no fold, no stain, no pattern, no motif. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: sakin; zincifre kırmızısı; ince altın pullar seyrek; dikişsiz; desen yok.
Kullanım: `red-640/1024` = geçici zarf (arka, cep, kapak), ay kapısı kapı kanatları, mekân fotoğrafının kafes kapıları, basılı
davetiyenin geçici kırmızı şeridi; W2.5–W2.8 gelince zarf onlardan.

#### W2.3 Krem kart kâğıdı (kartlar, bantlar, form)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cream_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of fine warm cream rice paper (#F5ECD8): delicate long fibres, a soft natural tooth, a warm even tone, calm enough for dark red ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: sakin (üstüne koyu kırmızı yazı her yerde okunur); sıcak krem; dikişsiz; leke/baskı yok.
Kullanım: `cream-640/1024` = home kartı, davet ve gün bantları, details program kâğıdı, RSVP formu, açılış kartı (W2.14 gelene kadar).

#### W2.4 Altın varak dokusu
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/gold_leaf.png` · 1024×1024 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of genuine gold leaf laid on paper: warm gold (#C9A14A) with lighter (#E6C983) and deeper (#8A5F1C) areas, the faint square seams and tiny wrinkles of hand-laid leaf, a soft satin shine from the top-left. Even everywhere, no pattern, no motif, no vignette, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: gerçek varak görünümü; sıcak altın; dikişsiz; desen yok.
Kullanım: `gold-480` = geçici düğmeler, geçici iç pencere katı ve geçici 囍 dolgusu (W2.9, W2.13, W2.11 gelince kalkar).

#### W2.5 Zarfın arkası ve astarı
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_back.png` · 990×1500 · **Şeffaf zemin**

```
The back panel of a tall vertical Chinese wedding envelope seen straight from the front with its flap open and out of the picture, on a fully transparent background, the panel filling the image edge to edge (the image IS the panel, 0.66:1): the inside of the envelope, lined in the top 35% of its height with a cream paper lining printed with a delicate pattern of small gold-leaf auspicious cloud scrolls; below the lining the plain inner side of the same cinnabar red paper as red_paper.png, slightly in shade. Straight edges, crisp paper corners, soft warm light from the top-left. No flap, no card, no object inside, no shadow outside the panel. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: panel tuvali dolduruyor (0,66:1); üst %35'te altın bulutlu krem astar; kapak/kart yok; gerçek alfa.
Kullanım: `env_back-900`: zarfın en arka katı (tam tuval); kapak kalkınca astar görünür, kart onun önünden yükselir.

#### W2.6 Zarfın ön cebi
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_pocket.png` · 990×1500 · **Şeffaf zemin**

```
The front pocket of the same tall vertical red envelope as envelope_back.png, seen straight from the front, on a fully transparent background, drawn on the full envelope canvas: the pocket is the same cinnabar red paper as red_paper.png and covers the image from 30% of its height down to the bottom edge, full width; its top edge at 30% is a clean straight cut with a fine gold-leaf edge line; everything above 30% is fully transparent. Very soft folds of real paper at the sides, a hair of shadow under the top edge, soft warm light from the top-left. The pocket is PLAIN: no character, no flower, no button, no cord drawn on it (they are separate layers). No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: cep %30'dan aşağı, üstü tamamen şeffaf; cep düz (düğme, ip, 囍 yok); gerçek alfa.
Kullanım: `pocket-900` (tam tuval): kart cebin arkasından yükselir; 囍, düğme ve ip ayrı katman olarak üstünde.

#### W2.7 Zarf kapağı (dış yüz)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_flap.png` · 990×780 · **Şeffaf zemin**

```
The closed top flap of the same tall vertical red envelope, alone, seen straight from the front, on a fully transparent background: the same cinnabar red paper as red_paper.png, full width of the image, its top edge a straight fold along the very top of the image; its sides straight; its lower edge a graceful, shallow, symmetrical curve shaped like an auspicious cloud scroll (ruyi) whose lowest point, at the centre, touches the bottom edge of the image, with a fine gold-leaf line following that lower edge. A delicate border of tiny gold-leaf cloud scrolls along the lower edge only. Soft warm light from the top-left, a very slight paper sheen. The flap is otherwise PLAIN: no button, no cord, no character (separate layers). It must not be a V-shaped flap and must have no wax seal. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: üst kenar düz katlama; alt kenar ortada en alçak, bulut biçimli sığ eğri (V değil); düğme/ip/mühür yok; gerçek alfa.
Kullanım: `flap-900` = kapağın dış yüzü (kapalıyken); açılışta 900 ms'de katlama çizgisi üstünde 180° kalkar. Kapak
düğmesi (W2.9) kapağın %90,4 yüksekliğinde, ortada durur.

#### W2.8 Kapağın iç yüzü (kalkınca görünen)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/flap_inside.png` · 990×780 · **Şeffaf zemin**

```
The inside of the same envelope flap as envelope_flap.png, seen straight on once it has been lifted up above the envelope, on a fully transparent background: the SAME outline as envelope_flap.png but turned upside down — its straight fold edge runs along the BOTTOM of the image and its shallow cloud-scroll curve is at the TOP, lowest point of the curve now the highest point at the top centre. The inner side of the same cinnabar red paper, a little darker and in soft shade, lined with the same cream lining with small gold-leaf cloud scrolls as envelope_back.png. No button, no cord, no character. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: dış yüzün dikey aynası (katlama alta, eğri üste); astarlı; gerçek alfa.
Kullanım: `flap_in-900` = kapak kalktıktan sonra zarfın üstünde görünen iç yüz.

#### W2.9 Kâğıt düğme (iki kez kullanılır)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/button.png` · 400×400 · **Şeffaf zemin**

```
A single round paper button of a string-and-button envelope closure, seen straight from above, on a fully transparent background, filling about 92% of the square: a thick disc of layered cream card covered with real gold leaf, a slightly raised rim, a tiny brass rivet at its centre, a delicate pressed pattern of a small plum blossom around the rivet, soft warm light from the top-left, a hair of shadow under its own rim only. Perfectly round, centred, not cropped. No cord, no text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```
Kontrol: tam yuvarlak, ortada; ip yok; yazı yok; gerçek alfa.
Kullanım: `button-240`: kapak düğmesi (açılışta ip çözülürken iki tur döner) ve gövde düğmesi (biraz geri döner).

#### W2.10 Kırmızı ipek ip (iki düğmeye sarılı)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/string.png` · 410×600 · **Şeffaf zemin**

```
A thin round red silk cord (#A81E24 with a soft sheen) wound in a neat figure-eight around two round buttons that are NOT drawn, on a fully transparent background: the two button discs are each 50% of the image width across, centred horizontally, one centred at 22% and one at 78% of the image height; the cord loops once around the outer rim of each (hugging the rims, leaving the discs themselves empty and transparent) and crosses itself once between them in the middle; a short loose end with a tiny gold bead hangs from the lower loop. Soft warm light from the top-left, a fine shadow under the cord only. No buttons, no paper, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız ip; düğme diskleri boş/şeffaf (%22 ve %78 merkezli, genişliğin %50'si); ortada bir kez çapraz; gerçek alfa.
Kullanım: `string-320`: zarfın sol %36 / üst %41 / %28 × %27 kutusuna gerilir; açılışta 450 ms'de döner, kayar ve düşer.

#### W2.11 Altın varak 囍 (cepte)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/xi_gold.png` · 800×800 · **Şeffaf zemin**

```
The Chinese double happiness character 囍, alone, as a crisp cut-out of real gold leaf on paper, seen straight on, on a fully transparent background, centred and filling about 80% of the square: the classic balanced form of 囍 with clean straight strokes, the gold leaf showing fine wrinkles and a soft satin shine from the top-left, a hair of shadow under its edges. Exactly this one character, correctly written, nothing else: no circle around it, no other character, no flower, no frame. True transparent background PNG (real alpha channel).
```
Kontrol: tek karakter 囍, doğru yazılmış; çevresinde çerçeve/başka karakter yok; gerçek alfa.
Kullanım: `xi-400`: cepte (%33 / %70, kare %34); geçici Ma Shan Zheng karakteri kalkar (`parts.css`).

#### W2.12 Dış kâğıt kesim pencere (kırmızı; ortadan ikiye kesilir)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_outer.png` · 968×1400 · **Şeffaf zemin**

```
A single sheet of red Chinese paper-cut (jianzhi) in the same cinnabar red paper as red_paper.png, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): an intricate window grille pattern with a large blooming tree peony in the centre, peony leaves and buds, auspicious cloud scrolls and a fine lattice border all round, the cut-away parts fully transparent (real openings, about 45% of the area open), crisp clean cut edges with a hair of shadow. The design is perfectly mirror-symmetric left to right (it will be cut down the vertical centre line into two shutter halves), with no important detail exactly on the centre line. No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tuvali dolduran tek kâğıt kesim; ortadan simetrik; açık yerler gerçekten şeffaf; yazı yok.
Kullanım: alfa kutusuna kırpılır, ortasından ikiye kesilir → `veil_o_l/r-480`; kartın üstünde; açılışta 2150 ms'de iki
yarısı dış kenarlarından kanat gibi açılır.

#### W2.13 İç kâğıt kesim pencere (altın; ortadan ikiye kesilir)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_inner.png` · 968×1400 · **Şeffaf zemin**

```
A single sheet of fine gold paper-cut (gold-leaf paper) of the same size, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): a lighter, finer pattern than veil_outer.png — a delicate lattice of plum blossoms and small cloud scrolls with two smaller peonies, about 60% of the area cut away (fully transparent openings), crisp edges, a soft gold satin shine from the top-left. Perfectly mirror-symmetric left to right (it is cut down the vertical centre line into two halves). No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: altın, dış kattan daha ince ve açık; simetrik; açık yerler şeffaf; yazı yok.
Kullanım: `veil_i_l/r-480`; dış katın altında; açılışta 2550 ms'de açılır.

#### W2.14 Açılış kartı (boş, yuvarlak foto penceresi)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/card_small.png` · 968×1400 · **Şeffaf zemin**

```
A flat vertical invitation card of the same warm cream paper as cream_paper.png, exactly 0.69:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine gold-leaf border line inset from the edge and tiny gold paper-cut cloud scrolls at its four corners, a very soft contact shade on the card itself. In its upper part a round portrait window, a perfect circle 62% of the card's width across, horizontally centred, its top edge at 9% of the card's height, framed by a slim red-and-gold ring, the window filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers, characters or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```
Kontrol: daire pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.
Kullanım: alfa kutusuna kırpılır; yeşil pencere ölçülür (`manifest card_small.window_pct`) ve şeffaf yapılır →
`card_small-860` = zarftan yükselen kart; portre alanı ölçülen pencereye oturur, isim/tarih pencerenin altından başlar.
Pencere bulunamazsa build uyarır ve kart krem kâğıt kalır.

#### W2.15 Altın bulutlar — üç ayrı dosya
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_1.png`, `cloud_2.png`, `cloud_3.png` · her biri 800×400 · **Şeffaf zemin**

```
A single Chinese auspicious cloud (xiangyun) motif cut from gold-leaf paper, alone, on a fully transparent background, seen flat and straight on, filling about 85% of the width: soft rolling scroll curls with a few spiralling heads, crisp paper-cut edges, warm gold with a soft satin shine from the top-left, a hair of shadow under its edges. Centered, not cropped. No other object, no text, letters, numbers or characters. True transparent background PNG (real alpha channel). (Make three different clouds: 1 = long and low with three curls, 2 = compact with two large curls, 3 = a small wisp with one curl.)
```
Kontrol: tek bulut; üç dosya farklı; altın kâğıt kesim; gerçek alfa.
Kullanım: `cloud_N-400`; `parts.css` `--rl-clouds` ile site.js'e bildirilir: açılışta 1200 ms'den itibaren üç bulut
geçer; home kartının ve Story sayfasının arkasında yavaş süzülür; RSVP gönderilince birkaç bulut yükselir. Dosya yoksa
bulut yok (çizilmiş yedek yok).

#### W2.16 Ay kapısı çerçevesi (yuvarlak foto çerçevesi)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/moon_gate.png` · 1200×1200 · **Şeffaf zemin**

```
A round Chinese garden moon gate seen straight on as a decorative frame, on a fully transparent background, filling the image edge to edge: a ring of deep red lacquer (#4A0A0E to #A81E24) about 12% of the image width thick, with a slim gold-leaf inner edge and a slim gold-leaf outer edge, a delicate red paper-cut tree peony branch climbing over the lower left of the ring and a small gold cloud scroll at the upper right, both kept inside the image. The round opening in the middle is a perfect circle 72% of the image width across, centred, filled with flat pure green #00FF00 (no texture, no shading). Soft warm light from the top-left. No wall, no garden, no background, no text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```
Kontrol: tam daire pencere, düz `#00FF00`, %72; çerçeve dışında zemin yok; yazı yok; gerçek alfa.
Kullanım: yeşil pencere ölçülür (`manifest gate.window_pct`) ve şeffaf yapılır → `gate-720`; her yuvarlak fotoğrafın (home
kartı, hikâye tanıtımı, Story'nin üç anı) çevresine pencere fotoğrafa oturacak biçimde konur; fotoğraf iki kırmızı kâğıt
kapı kanadının yana kaymasıyla açılır.

#### W2.17 Kâğıt kesim bordür (başlık altı)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/peony_band.png` · 1600×300 · **Şeffaf zemin**

```
A long horizontal border strip of red Chinese paper-cut in the same cinnabar paper as red_paper.png, on a fully transparent background: a small blooming peony in the centre with leaves and buds running out symmetrically to both sides and ending in little cloud scrolls, crisp cut edges with a hair of shadow, the cut-away parts fully transparent, a few tiny gold-leaf accents. Centered, not cropped, generous empty margin. Mirror-symmetric left to right. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```
Kontrol: yatay şerit; ortada şakayık; simetrik; açık yerler şeffaf; yazı yok.
Kullanım: `band-800`: krem kâğıt üstündeki başlıkların altında (home davet ve gün, details program, RSVP formu); sahnede
ortadan iki yana açılarak görünür (clip-path; reduced motion'da sabit).

#### W2.18 Kâğıt kesim katmanları (paralaks) — iki dosya
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/jianzhi_far.png` · 1600×1600 · **Şeffaf zemin**

```
A large, airy Chinese paper-cut panel in a slightly darker red than the lacquer ground (#7A141A), on a fully transparent background, filling about 95% of the square: tree peony branches with large blooms and leaves, plum blossom twigs and auspicious cloud scrolls spreading across the whole square, about 70% of the area cut away (fully transparent), crisp edges. It is a faint background layer over a deep red lacquer page, so it is tone-on-tone and calm, no gold. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/jianzhi_near.png` · 1400×1000 · **Şeffaf zemin**

```
A smaller Chinese paper-cut spray in gold-leaf paper, on a fully transparent background, filling about 90% of the width: two tree peonies with leaves rising from the bottom edge, a few small cloud scrolls above them, crisp edges, about 50% of the area cut away (fully transparent), a soft satin shine from the top-left. The bottom edge of the spray sits on the bottom edge of the image. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```
Kontrol: uzak katman ton-sur-ton koyu kırmızı ve sakin; yakın katman altın ve daha küçük; ikisi de şeffaf; yazı yok.
Kullanım: `cut_far-900` (uzak, yavaş) ve `cut_near-700` (yakın, hızlı): açılış sayfasında ve home kartının arkasında,
Story sayfasının sabit arka planında; sayfa kaydırıldıkça iki farklı hızda kayar (`data-depth`).

#### W2.19 Püsküllü düğüm (imza süsü)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/tassel.png` · 480×1200 · **Şeffaf zemin**

```
A traditional Chinese decorative knot (a pan chang endless knot) in red silk cord, hanging from a short loop at the top, with a carved gold bead under it and a long soft red silk tassel below, seen straight on, on a fully transparent background, filling about 90% of the image height, centred. Warm light from the top-left, a soft silk sheen. No characters on the bead, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tek düğüm + boncuk + püskül; boncukta yazı yok; gerçek alfa.
Kullanım: `tassel-300`: home imzasının ve RSVP kapanışının üstünde (≈84 px), ipinden yavaşça sallanır.

#### W2.20 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft warm lamplight from the top-left: the tall red envelope of envelope_pocket.png and envelope_flap.png, closed with its red cord wound round two gold buttons and the gold-leaf 囍 on its pocket (as xi_gold.png), standing slightly below the centre on a deep red lacquer table (as lacquer.png); a red paper-cut peony (as veil_outer.png) lying at the left, a red silk knot with a tassel (as tassel.png) and a few small gold paper clouds at the right; a soft dark red background above. The top 20% of the image is calm and empty. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no other character than the one 囍 on the envelope, no text, letters, numbers or logos.
```
Kontrol: zarf bütün ve altta boşluklu; üst %20 boş; 囍 dışında yazı yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, a warm palette of deep red, cream and soft gold, subtle film grain;
ONE fictional couple in their early thirties, the same two people in every photo (they must not resemble any real
person or celebrity): Mei — East Asian, long straight black hair worn low with a small gold hair pin, a slim gold ring;
Julian — Latino, short dark curly hair, a neat short beard, warm brown skin. Modern, elegant clothing (a modern
cheongsam-inspired red silk gown for her in the portrait is fine; no costume). Round photos are cropped from square
images: keep faces and hands in the middle 70%. No text, no frame, no watermark, no religious setting.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir. Story fotoğrafları sitede **yuvarlak** (1:1) kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/hero_portrait.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 wedding portrait of the fictional couple Mei and Julian, in their early thirties (Mei: East Asian, long straight black hair worn low with a small gold hair pin, a slim gold ring; Julian: Latino, short dark curly hair, a neat short beard, warm brown skin; they must not resemble any real person or celebrity) in a garden courtyard at golden hour: she in a modern red silk gown with a high collar, he in a dark charcoal suit with a small red pocket square, standing close and smiling at each other, waist-up, faces in the middle of the frame, a round moon gate in a white garden wall and pink peonies softly out of focus behind them. Photorealistic, warm red, cream and gold palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "The lantern festival"
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_1.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) sharing one clear umbrella on a rainy evening street hung with plain red paper lanterns (no writing on them), she laughing and holding his arm, warm light reflected on the wet pavement. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Through the moon gate"
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_2.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1: the same couple as hero_portrait.jpg walking hand in hand through a round moon gate in a white garden wall, seen from slightly behind and to the side, she turning to look back over her shoulder with a smile, bamboo and a stone path beyond the gate, soft afternoon light. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "Among the peonies"
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_3.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, among full pink and red tree peony blooms in a garden, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant garden house with a red lacquered wooden veranda and dark tiled roof beside a calm pond with a stone bridge, a lawn set with a few rows of simple chairs facing a round moon gate decorated with pink and red peonies for a ceremony, strings of warm small lights, early evening. No people, no signs, no characters or text, no temple or shrine. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, blok `'red-lacquer-double-happiness'`). Şu an geçici
> (`composed`): krem kâğıt + üstte ve altta zincifre kâğıt şeridi (temanın tonladığı dokular, ~195 ppi).
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** metin kutuları `layouts.ts`'teki ölçülerdir (ön `[17, 13, 15, 13]` = yükseklikte %17–%85, genişlikte
> %13–%87; arka `[12, 12, 10, 12]` = %12–%90 × %12–%88, yüzde: üst, sağ, alt, sol). Prompt'lar bu alanı ~%3 payla boş
> ister; alan aynı kalırsa kutular değişmeden kullanılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'red-lacquer-double-happiness'` bloğunda `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme red-lacquer-double-happiness` (artık kullanılmayan
>    `paper.webp`/`red.webp` dosyalarını `public/print/red-lacquer-double-happiness/`'den sil) ve `node scripts/print-sample.ts
>    --theme red-lacquer-double-happiness --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm cream paper of cream_paper.png. Along the top edge a band of cinnabar red paper-cut (as peony_band.png, but as a full-width band) about 12% of the height, with a small gold-leaf double happiness character 囍 (as xi_gold.png) centred in it, its lower edge a slim gold-leaf rule (staying above 14% of the height). Along the bottom edge a matching narrower band of red paper-cut peonies and cloud scrolls about 10% of the height with a slim gold-leaf rule on its upper edge (staying below 85%). The rectangle from 17% to 82% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks; the one 囍 in the top band is the only character. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %17–%82 × %10–%90 tamamen boş; 囍 dışında yazı yok; kırmızı bantlar yalnız üstte ve altta.

#### P2 — Arka yüz
**Kaydet:** `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same warm cream paper, only a narrow band of red paper-cut cloud scrolls along the top edge (about 6% of the height, with a slim gold-leaf rule on its lower edge, staying above 9% of the height). Everything below 11% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flower, no line, no shadow, no stain. No text, letters, numbers, characters, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar kırmızı bant (%9'un üstünde); %11'in altı boş; yazı yok.
