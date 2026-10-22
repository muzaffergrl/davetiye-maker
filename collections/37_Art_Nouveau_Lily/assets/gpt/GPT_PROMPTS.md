# GPT görsel istekleri — Tasarım 37 · Art Nouveau Lily

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms,
> logos, signatures or watermarks in any image.** Give W2.1 `cream_paper.png`, W2.4 `env_back.png` and W2.6
> `petal_centre.png` as the style reference of every later part: the same cream paper, the same soft gold, the same
> sage and lilac, the same Art Nouveau line (Mucha-style poster + stained glass). No peacock feathers anywhere (that is
> another design).

Bu dosya tasarım 37'nin **bütün görsel parçalarının** tek kaynağıdır (G186). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema
(`platform/themes/art-nouveau-lily/`) **geçici** görsellerle çalışıyor: 01'in düz fildişi kâğıdı kreme, 13'ün düz yeşilimsi
kâğıdı koyu adaçayına, 15'in düz pembe kâğıdı leylaka tonlandı. Zarfın cebi ve üç taç yaprağı kapağı şimdilik bu krem
kâğıttan `clip-path` ile **kesilmiş** düz parçalar; vitray madalyon, kemer çerçeve, altın hâle, zambak, altın kıvrım çizgisi
ve yaprak **yok** (çizilmiş yedek yok, K21). Parçalar gelince ne değişeceği: tema README → "What waits for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/37_Art_Nouveau_Lily/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/art-nouveau-lily/build_images.py` — PAKET 5'in **her parçası geldiği anda
  kendiliğinden** kullanılır (G167 düzeni): img/ yeniden üretilir, `platform/themes/art-nouveau-lily/parts.css` o
  parçaların kurallarıyla yazılır; gelmeyen parçanın kuralı yazılmaz, sayfa geçici görünümünde kalır (`img/manifest.json`
  → `parts.used` / `parts.waiting_for_gpt`). Sonra `python3 tools/kit_check.py collections/37_Art_Nouveau_Lily
  --paket 2`, `python3 tools/gpt_kuru_deneme.py --tema art-nouveau-lily --sekil
  collections/37_Art_Nouveau_Lily/assets/gpt/kuru_sekil.json` (prova; gerçek parçalarla da koşulabilir) ve göz
  kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **Art Nouveau poster (Alphonse Mucha style) + stained glass** — flowing "whiplash" gold lines, white lilies,
  leaded stained glass in soft jewel tones, gold mosaic tesserae; rendered like a fine printed poster and real glass
  (real paper grain, real light through glass). Classic, romantic, rich, airy. Not Art Deco (no geometric sunbursts or
  stepped lines), not psychedelic, not a cartoon.
- Renkler: sage `#55634E` · sage light `#B4C0A6` · cream `#F4ECDB` · cream shade `#E6DCC4` · lilac `#C8B6D6` · lilac deep
  `#7D6A92` · gold `#B8964E` · gold light `#DFC68F` · ink `#2E3228`
- Işık: yumuşak gün ışığı, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil).
- Gerçek bir esere, sanatçının belirli bir afişine, markaya ya da başka bir satıcının tasarımına benzemesin (Mucha
  **tarzı**, kopyası değil). 24 Grand Theatre'den (tavus mavisi, perde) ve 06 Art Deco'dan (geometrik siyah-altın) ayrı:
  burada tavus tüyü, perde ve geometrik ışın yok. Dini simge yok (hâle bir süs dairesidir, aziz/ikon değil).

## Zarf tuvali (W2.4, W2.5, W2.6 aynı tuvalde, üst üste 1:1)
Zarf **dik**: tuval **1000×1320** (0,758 en / 1 boy) ve **zarf tuvalin kendisidir** (kenardan kenara; dışında boşluk yok).
Üç kapak (sol, sağ, orta) kapalı konumda; uçları **(%50, %57)** noktasında, madalyonun altında buluşur. Menteşeler: sol
kapak = zarfın sol kenarı, sağ kapak = sağ kenarı, orta kapak = üst kenarı. Cep (W2.5) zarfın alt bölümü, üst kenarı
yaklaşık %55–%61 yükseklikte. Claude bu parçaları tuvale göre **üst üste** koyar (her biri sahnenin %100 × %100'ü) ve
kapakları menteşelerinde döndürür; kapakların arka yüzü W2.3 astarından, kapağın kendi şekliyle kesilir.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W2.1 Krem kâğıt (zarf, kartlar, bantlar, form)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of fine cream cotton paper (#F4ECDB), like the paper of an Art Nouveau print: a gentle natural tooth, very faint fibres, a soft warm tone, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols. RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: sakin (üstüne koyu yazı her yerde okunur); krem; dikişsiz; leke/baskı yok.
Kullanım: `paper-640/1024` = zarfın geçici kâğıdı, açılış kartı, home kartı, davet ve gün bantları, details program
kâğıdı, RSVP formu; basılı davetiyenin geçici zemini.

#### W2.2 Adaçayı zemin (sayfa zemini)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/sage_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat texture of a deep sage-green poster paper (#55634E), like the background of an Art Nouveau lithograph: a soft mottled printed tone with a very faint lighter sage cloudiness, a fine paper grain, matte. Calm and even everywhere so cream text reads on it, no pattern, no flowers, no lines, no vignette, no gradient across the image. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: dikişsiz; koyu adaçayı, sakin; desen/çizgi yok; üstünde krem yazı okunur.
Kullanım: `sage-640/1024` = bütün sayfaların zemini (zarf sayfası dahil); basılı davetiyenin geçici şeritleri.

#### W2.3 Leylak astar (zarfın içi + kapakların arka yüzü)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lilac_lining.png` · 1024×1024 · opak, dikişsiz

```
A seamless, tileable, flat texture of an envelope lining paper in soft lilac (#C8B6D6) printed with a delicate Art Nouveau pattern of small stylised lilies and slender curving stems in a slightly deeper lilac (#7D6A92) and a few fine gold-leaf lines (#B8964E), evenly spread, quiet and elegant, like a fine stationery liner. Flat, evenly lit, no shadow, no vignette, no fold. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: dikişsiz; leylak, sakin desen; altın çizgiler ince; yazı yok.
Kullanım: `lining-640` = zarfın içindeki astar (W2.4 gelene kadar) ve **her kapağın arka yüzü** (kapağın şekliyle kesilir,
açılışta 90°'de görünür olur); teşekkür modunda fotoğrafsız kart penceresi.

#### W2.4 Açık zarfın arkası (astar görünür; kapaksız)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_back.png` · 1000×1320 · **Şeffaf zemin**

```
The back half of an open portrait envelope seen straight from the front, on a fully transparent background, the envelope filling the image edge to edge (the image IS the envelope, 0.758:1): cream cotton paper (as cream_paper.png) with a slim cream border all round, and inside it the lilac lining (as lilac_lining.png) visible over the upper two thirds, softly shaded at the top as if inside an envelope. NO flaps at all (the flaps are separate images), no front panel, no card, no seal. Soft daylight from the top-left. No cast shadow outside the envelope. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: zarf tuvali dolduruyor (0,758:1); kapak, cep, kart yok; astar üst üçte ikide; gerçek alfa.
Kullanım: `env_back-900` = sahnenin en alt katmanı (geçici krem + leylak dikdörtgenin yerine).

#### W2.5 Zarfın cebi (kart buradan yükselir)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_pocket.png` · 1000×1320 · **Şeffaf zemin**

```
Only the front pocket of the same envelope as env_back.png, on the same 1000×1320 canvas and in the same place, on a fully transparent background: the lower part of the envelope front in cream paper, from the bottom edge up to an elegant softly rising Art Nouveau top edge — a gentle double curve that rises to a soft point in the middle at about 55% of the image height and sits at about 61% at both sides — the top edge trimmed with a thin gold-leaf whiplash line. Everything above that edge is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper just under the top edge. No flaps, no card, no seal. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: aynı tuval, aynı yer (env_back ile üst üste tam oturur); üst kenar yumuşak çift kıvrım + ince altın; üstü şeffaf.
Kullanım: `env_pocket-900` = kartın önündeki cep; kart arkasından yükselir.

#### W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_left.png`, `petal_right.png`, `petal_centre.png` · her biri 1000×1320 · **Şeffaf zemin**

```
The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file. RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın
sol/sağ/üst kenarı boyunca; her dosyada yalnız kendi kapağı; altın kıvrım kenar ince; gerçek alfa.
Kullanım: `petal_l/r/c-900` = kapakların ön yüzü (geçici kesik kâğıdın yerine); aynalanmış kopyası (`petal_*_m`) kapağın
arka yüzünde leylak astarı kapağın şekliyle keser. Açılışta yan kapaklar menteşelerinde dışa döner (−122° / +122°),
orta kapak yukarı (128°).

#### W2.7 Vitray zambak madalyonu (kapakların buluştuğu yer)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lily_medallion.png` · 800×800 · **Şeffaf zemin**

```
A small round stained-glass medallion, seen straight on, on a fully transparent background, filling about 92% of the square: a single white lily in leaded stained glass (white and pale cream petals, sage-green leaves, a soft lilac and pale gold glass background, thin dark lead lines), set in a slim gold Art Nouveau frame of flowing whiplash curves. The glass looks lit from behind, glowing gently. Centered, not cropped. No shadow, no background, no text, letters, numbers or symbols, no religious symbol. True transparent background PNG (real alpha channel).
```
Kontrol: tek yuvarlak madalyon; zambak + vitray kurşun çizgileri; altın kıvrım çerçeve; alfa.
Kullanım: `medallion-400`: kapakların uçlarının buluştuğu yerde (sahnenin %36'sı genişlikte); açılışta ışık bandı içinden
geçer, arkasında ışık parlar, madalyon yukarı kalkıp söner.

#### W2.8 Cepten yükselen kart (boş, kemerli foto penceresi)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/card_small.png` · 1008×1400 · **Şeffaf zemin**

```
A flat vertical invitation card of the same cream paper as cream_paper.png, exactly 0.72:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine flowing gold-leaf Art Nouveau border inset from the edge (whiplash curves meeting in small lily buds at the top corners), a very soft contact shade on the card itself. In its upper part an arched portrait window (a rounded arch on top, straight sides, flat bottom), 5:7 tall, 50% of the card's width across, horizontally centred, its top at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```
Kontrol: kemer pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.
Kullanım: alfa kutusuna kırpılır; yeşil pencere ölçülür (`manifest card_small.window_pct`), şekli `mask_card.png` olur ve
şeffaf yapılır → `card_small-860` = cepten yükselen kart; portre ölçülen pencereye oturur, isim/tarih altından başlar.
Pencere bulunamazsa build uyarır ve kart krem kâğıt kalır.

#### W2.9 Vitray kemer çerçeve (bütün portre fotoğrafları)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/arch_window.png` · 1000×1300 · **Şeffaf zemin**

```
A tall arched stained-glass window frame, seen straight on, on a fully transparent background, filling the image edge to edge: a band of leaded stained glass about 15% of the width wide running round a rounded arch with straight sides and a flat bottom — white lilies, sage-green leaves and curling stems in soft jewel-toned glass (cream, sage, lilac, pale gold) with thin dark lead lines, held in a slim gold Art Nouveau whiplash moulding on its outer edge. The opening in the middle is an arch (rounded top, straight sides, flat bottom) exactly 70% of the image width across and 5:7 tall (700 × 980 px), its left edge at 150 px and its top at 170 px, filled with flat pure green #00FF00 (no texture, no shading). Soft daylight from the top-left, the glass gently glowing. No text, letters, numbers or symbols, no saints, no religious symbol. True transparent background PNG (real alpha channel).
```
Kontrol: kemer pencere düz `#00FF00`, 5:7, ölçü/konum tarif gibi; vitray bant; yazı/dini simge yok; alfa.
Kullanım: yeşil pencere ölçülür (`manifest arch.window_pct`), şekli `mask_arch.png` olur → `arch-640`: home kartının
portresi, hikâye tanıtımı ve Story'nin üç anı bu kemerin içinde; fotoğraf alacakaranlık camı gibi soluk bekler, ışık
bandı geçince renkleri canlanır. Pencere bulunamazsa build uyarır, fotoğraflar çerçevesiz kalır.

#### W2.10 Mozaik altın hâle (home kartının arkası)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/halo.png` · 1400×1400 · **Şeffaf zemin**

```
A large decorative circular halo in the manner of an Art Nouveau poster, on a fully transparent background, filling about 96% of the square: a wide ring of tiny gold and pale-gold mosaic tesserae with a few soft sage and lilac tesserae, framed by thin flowing gold whiplash lines and a delicate ring of small stylised lilies, the centre of the circle (about 55% of its width) left fully transparent. Gentle, warm, light, decorative — a pattern behind a portrait, not a religious nimbus. No figure, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: daire halka, ortası boş (şeffaf); mozaik altın; dini simge yok; alfa.
Kullanım: `halo-900`: home'da kartın arkasında, Mucha afişi gibi (kart ortayı örter).

#### W2.11 Zambak demeti (kenarlar, imzalar)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lily_spray.png` · 900×1400 · **Şeffaf zemin**

```
A tall spray of three white lilies with long sage-green leaves and a few buds on slender curving stems, in the style of an Art Nouveau poster (soft flat colour with fine dark outlines, gentle shading), rising from the bottom edge of the image and leaning slightly to the right, on a fully transparent background, filling the height of the image. Cream-white petals, pale gold stamens, sage leaves. No vase, no ground, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tek demet, alttan yükselir; düz poster rengi + ince kontur; alfa.
Kullanım: `lily-480`: home kartının iki yanında (sağdaki aynalı), home ve Story imzası ile RSVP kapanışının üstünde.

#### W2.12 Altın kıvrım çizgisi (başlık altı ayırıcı)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/whiplash.png` · 1600×300 · **Şeffaf zemin**

```
A single horizontal Art Nouveau divider in fine gold leaf (#B8964E with lighter highlights), on a fully transparent background: one long flowing "whiplash" line that curls from the left, swells gracefully to a small lily bud in the centre and curls out to the right, with a few thin secondary tendrils, symmetrical, centred, with a generous empty margin. Line only, no filled shapes other than the small bud. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tek yatay çizgi, ortada küçük tomurcuk; altın; alfa.
Kullanım: `whip-800`: home davet ve gün bantlarında, Story ve details başlıklarında, RSVP formunda başlığın altında; sahnede
soldan sağa akan yumuşak bir maskeyle "kendini çizer" (reduced motion'da sabit).

#### W2.13 Zambak yaprağı (süzülen parça)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_drift.png` · 512×512 · **Şeffaf zemin**

```
A single loose white lily petal, slightly curved, cream-white with a faint lilac blush at its base and fine veins, lying at a gentle angle, alone, on a fully transparent background, filling about 60% of the square. Centered, not cropped. No shadow, no other petal, no text. True transparent background PNG (real alpha channel).
```
Kontrol: tek yaprak; alfa.
Kullanım: `petal-128` (`parts.css` `--anl-petals`): RSVP gönderilince 6 zambak yaprağı teşekkür panelinin üstünden süzülür.
Dosya yoksa yaprak yok (çizilmiş yedek yok).

#### W2.14 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic with an Art Nouveau poster mood, soft daylight from the top-left: the closed cream envelope of env_back.png with its three petal flaps and the stained-glass lily medallion (as lily_medallion.png) standing slightly below the centre on a deep sage linen surface, a spray of white lilies (as lily_spray.png) lying at the left, a small gold whiplash ornament and a lilac silk ribbon at the right; a soft sage background above. The top 20% of the image is calm, empty background. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers or symbols, no logos.
```
Kontrol: zarf bütün ve altta boşluklu; üst %20 boş; yazı yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, a soft sage, cream, lilac and warm gold palette, gentle natural light,
subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo (they must not
resemble any real person or celebrity): Odette — dark-brown hair in a soft low chignon, light olive skin, a slim gold
ring; Felix — short wavy light-brown hair, a neatly trimmed beard, fair skin. Modern, elegant clothing (no costume).
Portrait photos sit in arched windows (5:7): keep faces in the upper-middle and nothing important in the top corners.
No text, no frame, no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir. Portre ve Story fotoğrafları sitede **kemer** biçimli (5:7) kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/photos/hero_portrait.jpg` · Dikey 1000×1400 (5:7)
```
Vertical 5:7 wedding portrait of the fictional couple Odette and Felix, in their early thirties (Odette: dark-brown hair in a soft low chignon, light olive skin, a slim gold ring; Felix: short wavy light-brown hair, a neatly trimmed beard, fair skin; they must not resemble any real person or celebrity) in a garden in early summer: she in a simple cream silk gown holding a few white lilies, he in a sage-grey suit, standing close and smiling at each other, waist-up, faces in the upper-middle of the frame, a softly blurred old villa with tall arched windows and greenery behind them. Photorealistic, soft sage, cream and gold palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A rainy afternoon in a museum"
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_1.jpg` · Dikey 1000×1400 (5:7)
```
Vertical 5:7 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) in a quiet museum gallery on a rainy afternoon, standing side by side in front of a large softly blurred stained-glass window, she laughing and turning towards him, he holding a folded umbrella, raincoats damp, warm light. No readable signs, no artwork recognisable as a real painting, no text. Photorealistic, same palette and grain.
```

#### 2.3 Story 2 — "A summer of letters"
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_2.jpg` · Dikey 1000×1400 (5:7)
```
Vertical 5:7: the same couple as hero_portrait.jpg on a sunny balcony with wrought-iron railings, she sitting on a café chair reading a handwritten letter with a smile (the writing is not readable), he leaning on the railing beside her, a few envelopes and a cup of coffee on a small table, soft summer light, green plants. No readable text. Photorealistic, same palette and grain.
```

#### 2.4 Story 3 — "Among the lilies"
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_3.jpg` · Dikey 1000×1400 (5:7)
```
Vertical 5:7 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones) among white lilies in a garden bed, her hand with a slim gold engagement ring resting in his, soft late-afternoon light from the top-left, shallow depth of field, sage leaves around. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant garden of an early-1900s villa (fictional) with curved wrought-iron balconies and tall arched windows, a lawn with a few rows of simple white chairs set for a ceremony facing a small arbour of white lilies and greenery, beds of white lilies and lilac flowers, soft early-summer afternoon light. No people, no signs, no text. Photorealistic, same palette. Not a real, recognisable building.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, blok `'art-nouveau-lily'`). Şu an geçici
> (`composed`): krem kâğıt + üstte ve altta adaçayı şeridi (temanın tonladığı dokular, ~195 ppi).
> **Dosya adı ve ölçü:** `print/invitation_front_5x7.png`, `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in +
> 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma
> (154×216 mm, oran 0,713) aynı sayfadan yanlardan ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan
> kenarların %8'ine girmez.
> **Yazı alanı:** metin kutuları `layouts.ts`'teki ölçülerdir (ön `[21, 13, 19, 13]` = yükseklikte %21–%81, genişlikte
> %13–%87; arka `[17, 12, 10, 12]` = %17–%90 × %12–%88, yüzde: üst, sağ, alt, sol). Prompt'lar bu alanı ~%3 payla boş
> ister; alan aynı kalırsa kutular değişmeden kullanılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'art-nouveau-lily'` bloğunda `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme art-nouveau-lily` (artık kullanılmayan
>    `paper.webp`/`sage.webp` dosyalarını `public/print/art-nouveau-lily/`'den sil) ve `node scripts/print-sample.ts
>    --theme art-nouveau-lily --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat, in the style of an Art Nouveau poster: the whole sheet is the cream paper of cream_paper.png. Along the top edge an arched band about 13% of the height: a small stained-glass lily medallion (as lily_medallion.png) in the centre with flowing gold whiplash lines spreading from it to both sides over a soft sage ground, staying above 15% of the height. Along the bottom edge a matching low band about 10% of the height of sage-green leaves, two small white lilies and a slim gold whiplash line (staying below 87%). Thin gold whiplash lines may run down the outer 6% of each side. The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no line, no flower, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı yok; süs yalnız üst/alt bantlarda ve kenarlarda.

#### P2 — Arka yüz
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream paper, only a narrow band along the top edge (about 7% of the height: a slim gold whiplash line with a tiny lily bud in the centre over a thin sage strip, staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no line, no flower, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar bant (%10'un üstünde); %14'ün altı boş; yazı yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> Set bu tasarımın kendi dünyası (PAKET 3 yok; `EK_SETLER`): bütün sahnelerde aynı masa, süs, ışık. Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 37`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Art Nouveau Lily". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window, tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas, the same light and the same color world (sage green, cream, lilac and soft gold). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window, tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/37_Art_Nouveau_Lily/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: tall white lilies in a slender glass vase, a sage silk ribbon and a few lilac sweet peas. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: sage green, cream, lilac and soft gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
