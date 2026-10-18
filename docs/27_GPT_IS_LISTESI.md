# GPT iş listesi — ChatGPT'de üretilecek görseller

`python3 tools/gpt_is_listesi.py --yaz` (ya da `tools/gpt_bekleyen.py --yaz`) ile üretilir; elle düzenlenmez. Kaynak: bütün `GPT_PROMPTS.md` dosyaları. Her madde kendi başına yapıştırılabilir tam İngilizce prompt'tur. Tıklanabilir, kopyalama düğmeli ve işaretlenebilir sürüm: [`27_GPT_IS_LISTESI.html`](27_GPT_IS_LISTESI.html) (tarayıcıda aç).

**Toplam: 493 görsel** · A · Tasarım 22–38 (yeni tasarımlar): 435 · B · Tasarım 01–21 rötuş / baskı parçaları: 42 · C · Palet varyantı görselleri: 16

## Neden bu sıra

22–38 tasarımları ancak kendi website parçaları (PAKET 5) gelince geçici yer tutuculardan çıkıp live olabilir; örnek fotoğraflar (PAKET 2) theme-check ve demo için, ilan sahneleri (PAKET 3) ve baskı zeminleri (PAKET 6) satış paketi için gerekir. 01–21'in website parçaları tam; bu gruptaki 2× baskı parçaları yalnız basılı davetiyeyi ~230 ppi'den 300 ppi'ye çıkarır (bugünkü parçalarla da çalışıyor). Palet varyantları en sonda: o paletler `coming` ve GPT gelene dek asıl renkli parçayla görünüyor; fildişi gül paleti yalnız istenirse.

## ChatGPT'de çalışma

1. Her tasarım için **yeni bir sohbet** aç ve o tasarımın maddelerini aynı sohbette sırayla üret (stil, ışık, malzeme tutarlı kalsın). Tasarım başlığındaki İngilizce GPT notu varsa önce onu gönder.
2. **Her mesajda tek görsel:** "Prompt'u kopyala" → ChatGPT'ye yapıştır → gönder. Prompt'u kısaltma, Türkçeye çevirme.
3. Ölçü / oran ve şeffaf zemin prompt'un içinde yazar; ChatGPT farklı verirse aynı sohbette "same image, exactly W×H px (oran), true transparent background PNG" diye bir kez iste. Oran ±%2 tutmalı; çözünürlük küçükse yalnız uyarı.
4. **Ek görsel** satırı varsa o dosyayı (listede daha önce ürettiğin ya da repodaki) mesaja görsel olarak ekle.
5. Görseli **PNG** olarak indir (fotoğraflar .jpg hedefli olsa da PNG indir; yerleştirici dönüştürür).
6. "Dosya adını kopyala" ile dosyayı **indirme adıyla** yeniden adlandır ve hepsini tek klasörde topla. Sonra Claude: `python3 tools/gpt_yerlestir.py --klasor <klasör>` (kuru) → `--uygula`. Adı değiştirmediysen (ChatGPT adıyla kaldıysa) otomatik eşleşmez: Claude görsellere bakıp `--eslestir harita.json` yazar — daha yavaş.
7. ChatGPT **şeffaf zemin vermiyorsa**: prompt dosyalarında yazılı bir yedek yol (#00FF00 ya da düz zemin) yok — beyaz/damalı zeminli görseli kaydetme (yerleştirici reddeder). Maddeyi **Sorun** olarak işaretle ve geç; Claude sonra bakar. Bir maddede yedek yazıyorsa maddenin içinde "Şeffaf yedek" satırı görünür.
8. Görselde yazı, harf, logo, QR benzeri kare çıkarsa yeniden üret — hiçbir parçada yazı istenmiyor.

## Sayım

| Grup | Tasarım | Görsel |
|---|---|---|
| A | 22_Nocturne_Lake_Estate | 20 |
| A | 23_Velvet_Jewel_Box | 19 |
| A | 24_Grand_Theatre_Premiere | 28 |
| A | 25_Orient_Express_Voyage | 28 |
| A | 26_Kintsugi_Washi | 24 |
| A | 27_Riad_Lantern_Nights | 30 |
| A | 28_Maison_Patisserie | 26 |
| A | 29_Celestial_Observatory | 26 |
| A | 30_Azulejo_Mosaic | 24 |
| A | 31_Sky_Lantern_Festival | 24 |
| A | 32_Music_Box_Ballerina | 27 |
| A | 33_Marigold_Mehndi | 25 |
| A | 34_Red_Lacquer_Double_Happiness | 30 |
| A | 35_Highland_Tartan_Thistle | 27 |
| A | 36_Victorian_Glasshouse | 26 |
| A | 37_Art_Nouveau_Lily | 23 |
| A | 38_Papel_Picado_Fiesta | 28 |
| B | 01_Olive_Ivory | 2 |
| B | 02_Dusty_Blue | 2 |
| B | 03_Blush_Garden_Rose | 2 |
| B | 04_Vintage_Airmail | 2 |
| B | 05_Lemon_Mediterranean | 2 |
| B | 06_Art_Deco_Noir | 2 |
| B | 07_Burgundy_Velvet | 2 |
| B | 08_Winter_Evergreen | 2 |
| B | 09_Lavender_Provence | 2 |
| B | 10_Tuscan_Vineyard | 2 |
| B | 11_Boho_Pampas | 2 |
| B | 12_Tropical_Destination | 2 |
| B | 13_Enchanted_Forest | 2 |
| B | 14_Ivory_Lace_Pearl | 2 |
| B | 15_Cherry_Blossom | 2 |
| B | 16_Sunflower_Rustic | 2 |
| B | 17_Emerald_Gold_Estate | 2 |
| B | 18_Wildflower_Vellum | 2 |
| B | 19_Midnight_Garden | 2 |
| B | 20_Coastal_Seaside | 2 |
| B | 21_Crimson_Rose_Atelier | 2 |
| C | 16_Sunflower_Rustic | 15 |
| C | 21_Crimson_Rose_Atelier | 1 |

## A · Tasarım 22–38 (yeni tasarımlar)

### 22_Nocturne_Lake_Estate

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the PAKET 5 W2 parts below first, in order and in ONE chat, then PAKET 2 (sample photos). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image. Give `collections/22_Nocturne_Lake_Estate/assets/gpt/envelope.png` (the draft envelope) and `hero.png` as the style reference of every part: the same black textured paper, the same champagne-gold wax seal with the olive-twig relief, the same Lake Como dusk.
```

#### 1. W2.1 Kapalı zarf — mühür OLMADAN

- İndirme adı: `22-nocturne-lake-estate__envelope_closed.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/envelope_closed.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope.png (repoda: collections/22_Nocturne_Lake_Estate/assets/gpt/envelope.png)

```
The same premium black textured paper envelope as envelope.png, alone and closed, WITHOUT the gold wax seal: nearly black charcoal paper with a fine visible grain and delicate warm highlights on its edges, about 8:5 wider than tall, with a pointed triangular V flap folded down over the front; the tip of the flap is fully visible (nothing covers it). Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 84% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap is a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters, numbers or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: mühür yok, kapağın ucu açıkta; tek nesne; kesilmemiş; gölge yok; gerçek alfa; kapağın serbest kenarı net çizgi.

#### 2. W2.2 Kapanış elemanı — altın mühür (tek başına)

- İndirme adı: `22-nocturne-lake-estate__closure.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/closure.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope.png (repoda: collections/22_Nocturne_Lake_Estate/assets/gpt/envelope.png)

```
Only the round champagne-gold wax seal with a small abstract olive-twig relief (no letters) from envelope.png, alone, exactly as it sits on the tip of the black envelope's flap, drawn large so it fills about 70% of the square (Claude scales it to the envelope), with the same perspective, material and light and with no envelope behind it. The center of the relief is the same olive twig — no initials, no monogram. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: yalnız mühür; harf yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### 3. W2.3 Açık zarf — boş

- İndirme adı: `22-nocturne-lake-estate__envelope_open.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/envelope_open.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_closed.png (listede #1)

```
The SAME black envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the V flap folded fully upward above the envelope, its inner side and the inside of the back lined with a deep charcoal paper with a very fine champagne-gold pinstripe, seamless; the front pocket empty. The top edge of the front pocket is a crisp, clearly visible V edge against the liner. No card, nothing inside, no wax seal. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: envelope_closed ile aynı ölçü, konum ve açı (üst üste konunca sol, sağ, alt kenar çakışıyor); içi boş; gölge yok; alfa.

#### 4. W2.4 Zarftan çıkan küçük kart (boş)

- İndirme adı: `22-nocturne-lake-estate__card_small.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
The small invitation card that comes out of the black envelope, alone: a thick charcoal card (slightly lighter than the envelope) with a thin champagne-gold foil border inset from its edge, landscape, about 2:1 wider than tall, sized to slip into the envelope (about 64% of the envelope's width). On its left third a portrait photo window with softly rounded corners, about 4:5 tall, filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank charcoal paper (no text). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: pencere düz #00FF00; kartın geri kalanı boş (yazı alanı sağ üçte ikide düz kâğıt); zarfa sığacak genişlikte; alfa.

#### 5. W2.5 Sayfa arka planı (zarf sayfası, telefon)

- İndirme adı: `22-nocturne-lake-estate__bg_page.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/bg_page.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG
- Ek görsel: hero.png (repoda: collections/22_Nocturne_Lake_Estate/assets/gpt/hero.png)

```
A vertical phone-screen background for the envelope page: deep night-black textured paper with very soft warm candlelight falling from below the center, a faint distant Lake Como dusk reflection blurred far in the bottom quarter, cypress silhouettes barely visible at the far left and right edges. The whole central area stays calm, dark and empty (no envelope, no card, no text) so light ivory text reads on it. Same light and palette as hero.png.
```

Kontrol: orta sakin ve koyu; dekor yalnız kenarlarda; yazı yok; hero.png ile aynı ışık.

#### 6. W2.6 Süzülen accent 1 — altın zeytin yaprağı

- İndirme adı: `22-nocturne-lake-estate__accent_1.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/accent_1.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single small olive leaf in brushed champagne gold leaf (the same olive motif as the wax seal's relief), alone, slightly curved, drawn large so it fills about 60% of the square. Front view, centered, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG.
```

Kontrol: tek yaprak; altın; gölge yok; alfa (açılışta kartın çevresinden süzülen 2 yaprak — `MOTION.accents.open`).

#### 7. W2.7 Küçük ayırıcı — altın zeytin dalı

- İndirme adı: `22-nocturne-lake-estate__divider.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/divider.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
A thin horizontal divider: one slender olive twig in brushed champagne gold leaf lying flat, about 70% of the image width, very fine and delicate, centered. Soft light from the top-left. No cast shadow, no glow. No text. True transparent background PNG.
```

Kontrol: ince, yatay; altın; gölge yok; alfa (başlık altları).

#### 8. W2.8 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `22-nocturne-lake-estate__web_hero.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: hero.png (repoda: collections/22_Nocturne_Lake_Estate/assets/gpt/hero.png)

```
Wide horizontal version of the same design: the Lake Como terrace at blue-black dusk from hero.png (tiny lights across the water, mountain silhouettes, a stone balustrade with ivory taper candles), and the closed black envelope with its champagne-gold wax seal resting on the balustrade slightly below the center. The center-top area is calm night sky. This image is also cropped to 1200×630 for link previews: keep the envelope with its seal completely visible with at least 5% empty margin below it, and keep the top 20% to sky only. Photorealistic, same light and palette as hero.png. No text, no letters.
```

Kontrol: zarf + mühür altta tam görünür; üst %20 yalnız gökyüzü; yazı yok.

#### 9. 2.1 Ana portre

- İndirme adı: `22-nocturne-lake-estate__photos__hero_portrait.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties on a Lake Como villa terrace at blue hour: groom in a tailored black tuxedo, bride in a minimal ivory silk gown, close and smiling, three-quarter length, faces in the upper third. Distant lake lights, cypresses, warm candlelight. Black, olive and champagne palette, subtle film grain. No text, no frame.
```

#### 10. 2.2 Galeri 1 — "A quiet moment, just us"

- İndirme adı: `22-nocturne-lake-estate__photos__story_1.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5, a quiet candid moment on the villa's stone steps at dusk, foreheads touching, candle lanterns along the steps, lake in soft focus behind. Photorealistic, same palette and grain. No text.
```

#### 11. 2.3 Galeri 2 — "Where the mountains meet the water"

- İndirme adı: `22-nocturne-lake-estate__photos__story_2.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1152 px (4:3) · opak · JPG

```
Landscape 4:3: the same couple small in the frame on a wooden lake jetty at dusk, the mountains and the water's lights wide around them. Photorealistic, same palette and grain. No text.
```

#### 12. 2.4 Galeri 3 — "An evening we will always remember"

- İndirme adı: `22-nocturne-lake-estate__photos__story_3.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1152 px (4:3) · opak · JPG

```
Landscape 4:3: a long candlelit dinner table on the lake terrace at night, ivory roses and champagne glasses, guests as soft silhouettes, the couple laughing at the head of the table. Photorealistic, same palette and grain. No text.
```

#### 13. 2.5 Mekân

- İndirme adı: `22-nocturne-lake-estate__photos__venue.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant lakeside villa with a stone balustrade terrace and cypress trees, seen from the water at dusk, warm windows and candle lights, mountains behind. No people, no signs, no text. Photorealistic, same palette.
```

#### 14. 3.1 Kapak — elde telefon

- İndirme adı: `22-nocturne-lake-estate__mockups__cover_hand.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a black linen tablecloth over a dark walnut table beside a window at dusk and tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 15. 3.2 Üç telefon — sayfalar

- İndirme adı: `22-nocturne-lake-estate__mockups__three_phones.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a black linen tablecloth over a dark walnut table beside a window at dusk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 16. 3.3 Dizüstü + telefon

- İndirme adı: `22-nocturne-lake-estate__mockups__laptop_phone.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a black linen tablecloth over a dark walnut table beside a window at dusk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 17. 3.4 Masa üstü — yukarıdan

- İndirme adı: `22-nocturne-lake-estate__mockups__flatlay_phone.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a black linen tablecloth over a dark walnut table beside a window at dusk, slightly right of center and rotated about 8 degrees, surrounded at the edges by tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 18. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `22-nocturne-lake-estate__mockups__hand_phone_edit.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a charcoal velvet sofa with a champagne silk cushion and a crystal champagne coupe; a small arrangement of tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 19. P1 — invitation_card (ön yüz)

- İndirme adı: `22-nocturne-lake-estate__invitation_card.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/invitation_card.png`
- Bölüm: G139 — Basılı davetiye parçaları (yeni; şu an göl manzarası + mühürle geçici düzen) (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope.png (repoda: collections/22_Nocturne_Lake_Estate/assets/gpt/envelope.png)

```
A flat printed wedding invitation card, front side, seen straight on, portrait 2:3, on a fully transparent background. Thick premium black textured cotton paper with a fine visible grain, the same nearly black charcoal paper as the Nocturne Lake Estate envelope (envelope.png), with a crisp straight edge and a soft natural contact shade on the card itself. A thin champagne-gold foil hairline frame inset from the edge. A slender olive twig in brushed champagne gold leaf (the same olive motif as the wax seal's relief) at the top centre and a smaller mirrored twig at the bottom centre. Soft light from the top-left. The whole centre (about 70% of the width, 60% of the height) is EMPTY black paper for light ivory text. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp details at 2048 × 3072 px.
```

Kontrol: siyah dokulu kâğıt (zarfla aynı); altın çerçeve ince; orta %70 × %60 boş; yazı yok; gerçek alfa.

#### 20. P2 — info_card (arka yüz)

- İndirme adı: `22-nocturne-lake-estate__info_card.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/info_card.png`
- Bölüm: G139 — Basılı davetiye parçaları (yeni; şu an göl manzarası + mühürle geçici düzen) (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
The back side of the same black Nocturne Lake Estate wedding invitation card: portrait 2:3 on a fully transparent background, the same black textured cotton paper, crisp edge, soft contact shade and thin champagne-gold foil hairline frame. Only one small brushed champagne-gold olive twig centred at the top edge. Everything below the twig is EMPTY black paper for a schedule and a QR code. No text, letters, numbers, logos or watermarks. Print quality, 2048 × 3072 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; yalnız üstte küçük dal; geri kalanı boş; yazı yok; gerçek alfa.

### 23_Velvet_Jewel_Box

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (W2 website parts) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image. Make W2.1 first and give it as the reference image of every later part: the same aubergine velvet, the same champagne satin, the same rose-gold metal, the same light.
```

#### 21. W2.1 Kapalı kutu — fiyonk OLMADAN

- İndirme adı: `23-velvet-jewel-box__box_closed.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_closed.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A closed luxury ring box covered in deep aubergine plum velvet (#2A1328 to #4A2142, soft velvet pile with gentle highlights where the light catches it), seen from the front and slightly from above, wider than tall, with a softly rounded lid sitting on the base; a thin rose-gold metal rim runs along the seam where the lid meets the base, as one crisp straight horizontal line across the whole front. Place it exactly where it will sit in box_open.png: horizontally centered, about 72% of the image width, the bottom edge of the base at about 80% of the image height, the lid/base seam at about 63% of the image height, the top of the lid at about 50%. The empty upper half of the image is left for the lid to open and the card to rise into. Only this one object, no ribbon, no bow, no jewelry. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: tek nesne; fiyonk yok; kapak/gövde eklemi net yatay çizgi (rose gold kenar); ölçü ve konum tarife yakın; gölge yok; gerçek alfa.

#### 22. W2.2 Kapanış elemanı — saten fiyonk (tek başına, aynı tuvalde)

- İndirme adı: `23-velvet-jewel-box__closure.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/parts/closure.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: box_closed.png (listede #21)

```
Only a champagne satin ribbon bow (#E8D3B0, glossy satin with soft folds and two short tails) with a single small round ivory pearl at its knot, alone, drawn exactly where it sits on the front of the lid of box_closed.png — same canvas, same scale and perspective (give box_closed.png as the reference image): centered horizontally on the front of the lid, about 23% of the image width, its knot at about 57% of the image height. The ribbon does NOT wrap around the box: it is a bow resting on the lid's front. Without the box behind it. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: yalnız fiyonk + inci; kutu yok; box_closed üstüne konunca kapağın önünde, ortada; kuyruklar gövdeye taşmıyor; gölge yok; alfa.

#### 23. W2.3 Açık kutu — boş

- İndirme adı: `23-velvet-jewel-box__box_open.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_open.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: box_closed.png (listede #21)

```
The SAME aubergine velvet ring box as box_closed.png — same size, same position on the canvas, same angle, same material and light (give box_closed.png as the reference image) — now open: the lid has swung up and back on its rear hinge and stands upright above the base, showing its inside lined with smooth champagne satin (#E8D3B0) gathered in soft radiant folds toward the center; the inside of the base holds a plump champagne satin cushion with a single empty horizontal slit across its middle (no ring in it). The base's velvet front is exactly the same as in box_closed.png, and the line where the satin cushion meets the lid's satin lining at the back hinge is a clear straight horizontal line. Nothing inside, no ring, no card, no bow. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: box_closed ile aynı ölçü, konum, açı (gövdenin önü birebir çakışıyor); kapak dik, içi saten; yastık boş; menteşe çizgisi net; gölge yok; alfa.

#### 24. W2.4 Kutudan yükselen küçük kart (boş)

- İndirme adı: `23-velvet-jewel-box__card_small.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
The small invitation card that rises out of the velvet ring box, alone: a thick ivory cotton card (#F8EDE0) with a fine rose-gold foil edge, landscape, about 2:1 wider than tall, filling about 90% of the image width, centered (it is scaled into the box later). On its left third a portrait photo window with softly rounded corners, about 4:5 tall, filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank ivory paper (no text). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: pencere düz #00FF00, keskin kenarlı; kartın sağ üçte ikisi boş düz kâğıt; ~2:1; tuvalin ~%90 genişliği; gölge yok; alfa.

#### 25. W2.5 Kadife sayfa zemini (kutu sayfası + home)

- İndirme adı: `23-velvet-jewel-box__bg_page.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/parts/bg_page.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG

```
A vertical phone-screen background: a close, softly lit expanse of deep aubergine velvet (#1C0B1A to #2A1328) with a few long, gentle folds and a very soft pool of warm light slightly below the center, the velvet pile catching faint plum highlights. Darker toward the edges. The whole central area stays calm and even (no object, no box, no jewelry, no text) so light ivory text reads on it. Photorealistic, same light as the box.
```

Kontrol: orta sakin ve koyu; kıvrımlar yalnız hafif; nesne yok; yazı yok.

#### 26. W2.6 Şampanya saten zemin (açık bölümler)

- İndirme adı: `23-velvet-jewel-box__satin_bg.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/parts/satin_bg.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG

```
A wide background of smooth champagne satin (#E8D3B0 to #F3E4C8) with soft, wide, flowing diagonal folds and a gentle sheen from the top-left, very low contrast so dark plum text reads on any part of it. Edge to edge, no object, no ribbon ends, no pearls, no text. Photorealistic.
```

Kontrol: düşük kontrast; her yerinde koyu yazı okunur; nesne yok; kenara kadar saten.

#### 27. W2.7 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `23-velvet-jewel-box__web_hero.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: box_closed.png (listede #21), closure.png (listede #22)

```
Wide horizontal product photograph: the closed aubergine velvet ring box from box_closed.png with its champagne satin bow and pearl (closure.png) resting on a draped champagne satin cloth, a loose strand of ivory pearls curling beside it, soft studio light from the top-left on an aubergine velvet backdrop. The box sits slightly below the center. The center-top area is calm velvet. This image is also cropped to 1200×630 for link previews: keep the box and bow completely visible with at least 5% empty margin below them, and keep the top 20% to velvet only. Photorealistic. No text, letters, numbers, logos or watermarks.
```

Kontrol: kutu + fiyonk altta tam görünür; üst %20 yalnız kadife; yazı yok.

#### 28. 2.1 Ana portre

- İndirme adı: `23-velvet-jewel-box__photos__hero_portrait.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes. An elegant New York townhouse salon with aubergine velvet curtains and warm candlelight: Julian in a midnight-blue tuxedo, Isabelle in an ivory satin gown with a single strand of pearls, standing close and smiling, three-quarter length, both faces in the upper third and centered (the photo is also shown small, cropped to the faces). Aubergine, champagne and ivory palette, subtle film grain. No text, no logos, no frame.
```

#### 29. 2.2 Story 1 — "Our first dinner"

- İndirme adı: `23-velvet-jewel-box__photos__story_1.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic candid photo, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes — the same two people as in the portrait. A small candlelit restaurant table for two, laughing over a shared dessert, a rain-streaked window behind them with soft out-of-focus city lights. Smart evening clothes (no wedding attire). Aubergine, champagne and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 30. 2.3 Story 2 — "A little velvet box"

- İndirme adı: `23-velvet-jewel-box__photos__story_2.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic photo, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes — the same two people as in the portrait. The moment of the proposal in a quiet park under a black umbrella at dusk: Julian holds an open aubergine velvet ring box, Isabelle covers her mouth in happy surprise; the ring is a small glint, not the focus; both faces visible. Aubergine, champagne and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 31. 2.4 Story 3 — "Yours, forever"

- İndirme adı: `23-velvet-jewel-box__photos__story_3.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic close-up, vertical 4:5: the hands of the same fictional couple, Isabelle and Julian (her warm olive skin, his fair skin), intertwined on champagne satin, her engagement ring and a strand of ivory pearls, soft window light. Only hands, no faces. Not resembling any real or famous person. Aubergine, champagne and ivory palette, subtle film grain. No text, no engraving, no logos.
```

#### 32. 2.5 Mekân

- İndirme adı: `23-velvet-jewel-box__photos__venue.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Photorealistic landscape 16:9: a grand fictional New York townhouse ballroom prepared for a wedding dinner: aubergine velvet chairs, champagne satin table linens, tall candles and ivory flowers, crystal chandeliers, warm evening light. No people, no signs, no text, no logos, no recognisable real venue. Aubergine, champagne and ivory palette, subtle film grain.
```

#### 33. 3.1 Kapak — elde telefon

- İndirme adı: `23-velvet-jewel-box__mockups__cover_hand.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a champagne satin cloth over a dark plum lacquered table and a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 34. 3.2 Üç telefon — sayfalar

- İndirme adı: `23-velvet-jewel-box__mockups__three_phones.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a champagne satin cloth over a dark plum lacquered table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 35. 3.3 Dizüstü + telefon

- İndirme adı: `23-velvet-jewel-box__mockups__laptop_phone.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a champagne satin cloth over a dark plum lacquered table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 36. 3.4 Masa üstü — yukarıdan

- İndirme adı: `23-velvet-jewel-box__mockups__flatlay_phone.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a champagne satin cloth over a dark plum lacquered table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 37. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `23-velvet-jewel-box__mockups__hand_phone_edit.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a plum velvet sofa with a champagne satin cushion and a porcelain teacup; a small arrangement of a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 38. P6.1 Ön yüz

- İndirme adı: `23-velvet-jewel-box__print__invitation_front.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; ön + arka, 5×7 ve A5 için tek çift, 300 ppi) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: closure.png (listede #22)

```
A flat printed wedding invitation ground, front side, seen straight on, portrait, edge to edge (it is trimmed later; keep everything important at least 4% inside every edge): rich aubergine velvet-look paper (#2A1328 to #1C0B1A) with a subtle velvet texture, a thin rose-gold foil hairline frame inset about 5% from every edge, and at the top centre a champagne satin ribbon bow with a single ivory pearl at its knot (the same bow as closure.png), lying entirely between 5% and 22% of the image height. The whole area from 25% to 90% of the height and from 11% to 89% of the width is EMPTY, even velvet paper (no ornament, no sparkle, no fold, no light spot) for light champagne text. Soft light from the top-left. Print quality, sharp details at 1819 × 2551 px. No text, letters, numbers, monograms, logos or watermarks.
```

Kontrol: fiyonk + inci üst %5–22 içinde; %25–90 yükseklik × %11–89 genişlik tamamen boş ve düz; çerçeve ince, kenardan ~%5; yazı yok; 1819×2551.

#### 39. P6.2 Arka yüz

- İndirme adı: `23-velvet-jewel-box__print__invitation_back.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; ön + arka, 5×7 ve A5 için tek çift, 300 ppi) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: invitation_front.png (listede #38)

```
The back side of the same invitation (give invitation_front.png as the reference image): the same aubergine velvet-look paper and the same thin rose-gold foil hairline frame inset about 5% from every edge, edge to edge, portrait. Only one small champagne satin bow with a pearl at the bottom centre, lying entirely between 82% and 95% of the image height. The whole area from 10% to 80% of the height and from 11% to 89% of the width is EMPTY, even velvet paper for a schedule and a QR code. Soft light from the top-left. Print quality, 1819 × 2551 px. No text, letters, numbers, logos or watermarks.
```

Kontrol: yalnız altta küçük fiyonk (%82–95); %10–80 yükseklik × %11–89 genişlik boş; ön yüzle aynı kâğıt ve çerçeve; yazı yok.

### 24_Grand_Theatre_Premiere

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms, signatures or watermarks in any image. W2.1 `proscenium.png` is the style reference of every later part: give it as the reference image each time (same antique gold, same peacock velvet, same light).
```

#### 40. W2.1 Proscenium kemeri + saçak (tüm parçaların stil referansı)

- İndirme adı: `24-grand-theatre-premiere__proscenium.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/proscenium.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
An ornate antique-gold proscenium arch of an imaginary Belle Époque opera house, oil-painted theatre poster style with rich visible brushwork and burnished, slightly worn gilding (#C9A45C with #E3C78B highlights): two fluted gilded columns at the sides, a gently arched top with carved acanthus scrolls and a small empty cartouche (no letters, no crest), and hanging from the inside of the arch a deep peacock-teal velvet valance (#0E3D40 to #16595B) in three soft swags with a heavy gold bullion fringe and two small gold tassels. The arch frame spans about 4% to 96% of the image width and 3% to 97% of the height. The stage OPENING inside the frame — from about 12% to 88% of the width and from just under the valance at about 14% to the stage floor edge at about 92% of the height — is filled with flat pure green #00FF00 (no texture, no shading, no gradient), with crisp edges. Front view, perfectly symmetrical and straight, not cropped. Warm light from below and slightly left, as from footlights. No cast shadow outside the arch, no glow, halo or light rays outside its outline. No text, letters, numbers, monograms or logos. True transparent background PNG (real alpha channel — not white, not a checkerboard) outside the arch.
```

Kontrol: açıklık düz #00FF00, kenarı net; saçak açıklığın üst kenarını örtüyor; arma/yazı yok; simetrik; kesilmemiş; alfa.

#### 41. W2.2 Kapalı perde — sol kanat

- İndirme adı: `24-grand-theatre-premiere__curtain_left.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: proscenium.png (listede #40)

```
The LEFT panel of a closed peacock-teal velvet stage curtain (#0E3D40 shadows, #16595B body, soft #2E7F7C highlights on the fold crests), alone, on the same 1024×1536 canvas and in exactly the position it has behind proscenium.png (give proscenium.png as the reference): it spans from about 11% to 51% of the image width and from about 12% to 93% of the height. Heavy deep vertical folds that catch warm footlight from below, a slight gather at the very top, a heavy antique-gold bullion fringe along the bottom hem that just touches the stage floor line. Its right (inner) edge is a straight vertical fold that will meet the right panel at the centre seam; its left (outer) edge is a fold that tucks under the arch. Oil-painted theatre poster style, the same brushwork, velvet and light as proscenium.png. Only this one panel — no arch, no valance, no stage, no other panel. Not cropped. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tuval konumu x %11–51, y %12–93; iç kenar düz dikey; alt saçak altın püsküllü; yalnız kanat; alfa.

#### 42. W2.3 Kapalı perde — sağ kanat

- İndirme adı: `24-grand-theatre-premiere__curtain_right.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: proscenium.png (listede #40), curtain_left.png (listede #41)

```
The RIGHT panel of the same closed peacock-teal velvet stage curtain, alone, on the same 1024×1536 canvas and in exactly its position behind proscenium.png (give proscenium.png and curtain_left.png as references): it spans from about 49% to 89% of the image width and from about 12% to 93% of the height, overlapping the left panel by about 2% at the centre seam. Painted separately (not a mirror copy of the left panel): its own heavy vertical folds catching warm footlight from below, the same slight gather at the top and the same antique-gold bullion fringe along the bottom hem. Its left (inner) edge is a straight vertical fold; its right (outer) edge tucks under the arch. Same oil-painted style, velvet and light. Only this one panel. Not cropped. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```

Kontrol: x %49–89, y %12–93; sol kanadın aynası değil; iki kanat üst üste konunca dikişte boşluk yok; alfa.

#### 43. W2.4 Açık perde — sol kanat toplanmış (bağlı, püsküllü)

- İndirme adı: `24-grand-theatre-premiere__curtain_left_open.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left_open.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: proscenium.png (listede #40), curtain_left.png (listede #41)

```
The same LEFT velvet curtain panel now drawn open and gathered to the left side of the stage, on the same 1024×1536 canvas (give proscenium.png and curtain_left.png as references): a tall swag hanging from the top at about 11% to 27% of the image width, from about 12% to 93% of the height, its folds bunched tight, its inner edge sweeping in a graceful curve, held at about two-thirds height by a thick twisted gold rope tieback with one large antique-gold tassel hanging from it. The same peacock velvet, the same gold bullion fringe at the hem, the same warm light from below. Oil-painted theatre poster style. Only this gathered panel. Not cropped. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```

Kontrol: x %11–27; tieback + tek büyük püskül; aynı kadife ve saçak; alfa. (Açılışın sonunda kapalı kanat buna el değiştirir ve salınır.)

#### 44. W2.5 Açık perde — sağ kanat toplanmış

- İndirme adı: `24-grand-theatre-premiere__curtain_right_open.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right_open.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: curtain_left_open.png (listede #43)

```
The same RIGHT velvet curtain panel drawn open and gathered to the right side of the stage, on the same 1024×1536 canvas (give curtain_left_open.png as reference): a tall swag at about 73% to 89% of the image width, from about 12% to 93% of the height, folds bunched, inner edge sweeping in a curve, held by a thick twisted gold rope tieback with one large antique-gold tassel. Painted separately, not a mirror copy. Same velvet, fringe, light and oil-painted style. Only this gathered panel. Not cropped. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: x %73–89; sol eşinin aynası değil; alfa.

#### 45. W2.6 Sahnenin içi (perdenin arkası)

- İndirme adı: `24-grand-theatre-premiere__stage_back.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/stage_back.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG
- Ek görsel: proscenium.png (listede #40)

```
The inside of the stage seen through the proscenium opening, painted to fill the whole 1024×1536 canvas: a deep, shadowy painted backdrop in dark peacock and night teal (#061416 to #0E3D40) with a faint, out-of-focus moonlit garden scene barely visible, and in the lower fifth warm honey-coloured wooden stage floorboards in perspective, catching a soft pool of warm light in the centre. The whole centre is calm, dark and EMPTY (no people, no props, no furniture) — a programme card will stand there. Oil-painted theatre poster style, the same palette and warm footlight from below as proscenium.png. No text, no letters, no logos.
```

Kontrol: orta boş ve sakin; zemin tahtaları alt %20'de; opak; yazı yok.

#### 46. W2.7 Sahnedeki program kartı (boş)

- İndirme adı: `24-grand-theatre-premiere__card_small.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A vintage theatre programme card (playbill) standing upright, alone: thick ivory cotton card (#F3EBD8) with a fine antique-gold printed ornamental border inset about 5% from its edge and a small gold flourish at the top centre, portrait 2:3, drawn large so it fills about 76% of the image height, centred. In its upper part a portrait photo window with an arched top, about 4:5, horizontally centred, from about 23% to 77% of the card's width and from about 9% to 52% of the card's height, with a thin gold moulding around it, filled with flat pure green #00FF00 (no texture, no shading, crisp edges). The lower part of the card, from about 56% to 92% of its height, is plain ivory paper for text (no lines, no ornament, no text). Front view, straight, not cropped, generous empty margin. Oil-painted style with subtle paper grain, warm light from below. No cast shadow, no glow outside the card. No text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: pencere düz #00FF00 (kemerli üst), kartın üst kısmında (yükseklik ~%9–52) ortada; alt kısım (~%56–92) düz kâğıt;

#### 47. W2.7b Ana sayfanın program kartı (pencere yok)

- İndirme adı: `24-grand-theatre-premiere__card_plain.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_plain.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: card_small.png (listede #46)

```
The same vintage theatre programme card as card_small.png (give it as the reference: the same thick ivory cotton card, the same fine antique-gold ornamental border inset about 5% from the edge, the same small gold flourish at the top centre, the same 2:3 proportion and size, about 76% of the image height, centred) but WITHOUT any photo window: inside the border the whole face is plain ivory paper for text, calm and even, no lines, no frame, no ornament in the middle. Front view, straight, not cropped. Oil-painted style with subtle paper grain, warm light from below. No cast shadow, no glow outside the card. No text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: card_small ile aynı kart (kenar süsü, üst süs, oran); yüzü baştan sona düz kâğıt; pencere yok; alfa. (Ana sayfanın

#### 48. W2.8 Kadife zemin karosu (dikişsiz)

- İndirme adı: `24-grand-theatre-premiere__velvet_tile.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/velvet_tile.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable square texture of deep peacock-teal crushed velvet (#0E3D40 with #16595B sheen), soft and even, with a fine pile and gentle light variations, no folds, no seams, no pattern, no objects. Oil-painted feel with subtle brush texture. It must repeat without visible edges in both directions. No text.
```

Kontrol: dikişsiz (2×2 döşenince kenar görünmüyor); kıvrım/desen yok; opak.

#### 49. W2.9 Program kâğıdı karosu (dikişsiz)

- İndirme adı: `24-grand-theatre-premiere__playbill_tile.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/playbill_tile.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable square texture of aged ivory theatre-programme paper (#F3EBD8), soft cotton grain, very faint warm foxing, no fold lines, no stains in the middle, no print, no border, no objects. It must repeat without visible edges in both directions. No text.
```

Kontrol: dikişsiz; açık ve sakin (koyu mürekkep metin okunur); opak.

#### 50. W2.10 Bilet koçanı (RSVP)

- İndirme adı: `24-grand-theatre-premiere__ticket_stub.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/ticket_stub.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
The stub of an antique theatre ticket, alone, landscape about 3:1, drawn large so it fills about 86% of the image width, centred: thick ivory card (#F3EBD8) with a fine antique-gold printed ornamental border, and along its TOP edge a clearly visible perforation — a straight row of small round punched holes, as where it was torn from the ticket. The whole centre is plain ivory card for text (no text, no numbers, no seat print). Front view, straight, not cropped. Oil-painted style, warm light. No cast shadow, no glow outside its outline. True transparent background PNG (real alpha channel).
```

Kontrol: üst kenarda delikli çizgi; orta boş; ~3:1; alfa. (Yanıt gönderilince bu koçan yırtılıp düşer; sitede kendi

#### 51. W2.11 Salon arka planı (perde sayfası ve home, telefon)

- İndirme adı: `24-grand-theatre-premiere__bg_page.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/bg_page.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG
- Ek görsel: proscenium.png (listede #40)

```
A vertical phone-screen background: the dark auditorium of an imaginary opera house seen from the stalls, almost black teal (#061416) with the faint warm glow of gilded balcony fronts and tiny lamps far out of focus at the very left and right edges and the top. The whole centre stays calm, dark and empty (no stage, no curtain, no people, no text) so light ivory text and the stage read on it. Oil-painted theatre poster style, the same palette and warmth as proscenium.png.
```

Kontrol: orta koyu ve boş; dekor yalnız kenarlarda; yazı yok.

#### 52. W2.12 Püskül (favicon, süs)

- İndirme adı: `24-grand-theatre-premiere__tassel.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/tassel.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single antique-gold theatre curtain tassel on a short twisted gold cord, alone, hanging straight, drawn large so it fills about 72% of the square, centred. Burnished gold threads, a carved gilt head. Oil-painted style, warm light from below-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek püskül; altın; gölge yok; alfa.

#### 53. W2.13 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `24-grand-theatre-premiere__web_hero.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG

```
Wide horizontal version of the same design: the antique-gold proscenium with its peacock velvet curtains drawn open and tied back with gold tassels, warm footlights glowing on honey wooden floorboards, a soft spotlight pool on the empty centre of the stage, the dark auditorium edges around. This image is cropped to 1200×630 for link previews: keep the whole stage opening and both tied curtains visible with at least 5% empty margin below the stage floor, and keep the top 20% to the arch and valance only. Oil-painted theatre poster style. No people, no text, no letters.
```

Kontrol: sahne + iki toplanmış perde tam görünür; üst %20 yalnız kemer/saçak; yazı yok.

#### 54. 2.1 Ana portre

- İndirme adı: `24-grand-theatre-premiere__photos__hero_portrait.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), standing on the empty stage of an ornate gilded theatre in front of drawn-back peacock-teal velvet curtains: the groom in a classic black tuxedo, the bride in an ivory satin gown with a long veil, close together and smiling, three-quarter length, faces in the upper third, lit by a warm spotlight from above-left. Warm footlights, soft haze in the air. Peacock, antique gold and ivory palette, subtle film grain. They must not resemble any real or famous person. No text, no frame.
```

#### 55. 2.2 Story 1 — "Opening night"

- İndirme adı: `24-grand-theatre-premiere__photos__story_1.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #54)

```
The same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in smart evening clothes, vertical 4:5, a candid moment in peacock-teal velvet theatre seats with gilded armrests in the stalls, side by side and laughing during an evening performance, the stage light falling on their faces, the dark auditorium behind softly out of focus. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 56. 2.3 Story 2 — "The proposal at intermission"

- İndirme adı: `24-grand-theatre-premiere__photos__story_2.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #54)

```
Vertical 4:5: the same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in evening clothes, in a mirrored, candlelit theatre foyer at intermission, he on one knee holding up a ring box, she with her hands to her face in happy surprise, champagne glasses on a marble ledge, gilded mirrors and warm sconces softly blurred. Photorealistic, same palette and grain. Not resembling any real person. No text, no signs.
```

#### 57. 2.4 Story 3 — "Our curtain call"

- İndirme adı: `24-grand-theatre-premiere__photos__story_3.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #54)

```
Vertical 4:5: the same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in their wedding clothes (black tuxedo, ivory satin gown), taking a playful bow together at the front of the stage, hand in hand, ivory rose petals in the air, the peacock velvet curtain gathered behind them and warm footlights glowing. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 58. 2.5 Mekân

- İndirme adı: `24-grand-theatre-premiere__photos__venue.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1024 px (3:2) · opak · JPG

```
Landscape 3:2: the interior of an imaginary grand theatre seen from the back of the stalls, rows of velvet seats, two tiers of gilded balconies, a crystal chandelier, the antique-gold proscenium with peacock velvet curtains open, warm evening light, set for a wedding with ivory flowers along the stage edge. No people, no signs, no text, not a copy of any real theatre. Photorealistic, same palette.
```

#### 59. 3.1 Kapak — elde telefon

- İndirme adı: `24-grand-theatre-premiere__mockups__cover_hand.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a deep peacock teal velvet cloth over an antique gilded side table and a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 60. 3.2 Üç telefon — sayfalar

- İndirme adı: `24-grand-theatre-premiere__mockups__three_phones.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a deep peacock teal velvet cloth over an antique gilded side table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 61. 3.3 Dizüstü + telefon

- İndirme adı: `24-grand-theatre-premiere__mockups__laptop_phone.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a deep peacock teal velvet cloth over an antique gilded side table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 62. 3.4 Masa üstü — yukarıdan

- İndirme adı: `24-grand-theatre-premiere__mockups__flatlay_phone.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a deep peacock teal velvet cloth over an antique gilded side table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 63. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `24-grand-theatre-premiere__mockups__hand_phone_edit.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a teal velvet theatre sofa with an antique gold cushion and a glass of champagne; a small arrangement of a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 64. P1 — Ön yüz 5×7 (taşma paylı)

- İndirme adı: `24-grand-theatre-premiere__print__invitation_front_5x7.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The front of a printed wedding invitation, flat, portrait, full bleed, in the Grand Theatre Premiere style: aged ivory theatre-programme paper (#F3EBD8) with fine cotton grain; across the top 15% a painted peacock-teal velvet valance in three soft swags with an antique-gold bullion fringe and two small tassels; across the bottom 11% the gilded edge of a stage floor with a soft warm footlight glow; a very fine antique-gold printed rule frame inset about 6% from the edges. The whole centre (from about 19% to 85% of the height and 12% to 88% of the width) is EMPTY plain ivory paper for dark ink text. Oil-painted theatre poster style. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: orta boş; süs yalnız üst %15 ve alt %11 + ince çerçeve; yazı yok; 1575×2175.

#### 65. P2 — Arka yüz 5×7

- İndirme adı: `24-grand-theatre-premiere__print__invitation_back_5x7.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed invitation, flat, portrait, full bleed: the same aged ivory programme paper and fine gold rule frame; across the top 13% a narrower painted peacock velvet valance with gold fringe; nothing at the bottom. Everything below the valance is EMPTY plain ivory paper for a schedule and a QR code. Same style. No text, letters, numbers, logos or watermarks. Print quality, 1575×2175 px.
```

Kontrol: yalnız üstte saçak; geri kalanı boş; yazı yok.

#### 66. P3 — Ön yüz A5 (taşma paylı)

- İndirme adı: `24-grand-theatre-premiere__print__invitation_front_a5.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_a5.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: invitation_front_5x7.png (listede #64)

```
The same front as invitation_front_5x7.png (give it as the reference), recomposed for the A5 proportion: the velvet valance across the top 15%, the gilded stage edge and footlight glow across the bottom 11%, the fine gold rule frame inset about 6%, the whole centre EMPTY plain ivory paper. Same style and colours. No text, letters, numbers, logos or watermarks. Print quality, 1819×2551 px.
```

#### 67. P4 — Arka yüz A5

- İndirme adı: `24-grand-theatre-premiere__print__invitation_back_a5.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_a5.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: invitation_back_5x7.png (listede #65)

```
The same back as invitation_back_5x7.png, recomposed for the A5 proportion: velvet valance across the top 13%, fine gold rule frame, everything below EMPTY plain ivory paper. Same style. No text, letters, numbers, logos or watermarks. Print quality, 1819×2551 px.
```

### 25_Orient_Express_Voyage

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website parts) first, in order and in ONE chat, so every part shares the same lithograph style, palette and light; then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, logos, monograms, brand names or watermarks in any image** — not on the ticket, the tag, the clock, the map, the stamp or the poster. Generate W2.1 (the closed wallet) first and give it as the reference image of every wallet part (W2.2–W2.5) and of the ticket (W2.7).
```

#### 68. W2.1 Kapalı bilet cüzdanı — kayış OLMADAN

- İndirme adı: `25-orient-express-voyage__wallet_closed.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_closed.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A luxurious vintage first-class railway ticket wallet, closed, seen perfectly straight from the front: a tall portrait rectangle (2:3), bottle-green (#1E3A2C) fine-grain leather with softly rounded corners, a slim debossed border line running inside the edge, small polished brass corner caps on the four corners, and a narrow stitched spine visible along the LEFT edge (the cover opens from the left like a book). WITHOUT any strap or buckle — the front is clean leather. Place it horizontally centered, about 62% of the image width, top edge at about 19% of the image height. Warm painterly light from the top-left, gentle leather sheen, rendered like a realistic object in a 1930s travel-poster world. Only this one object. Not cropped, generous empty margin. No cast shadow, no drop shadow, no glow outside the outline. No text, letters, numbers, emblem or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: kayış/toka yok; sırt solda; dikey 2:3; pirinç köşeler; yazı yok; gölge yok; gerçek alfa.

#### 69. W2.2 Kayış ve pirinç toka (tek başına, cüzdanla aynı yerde)

- İndirme adı: `25-orient-express-voyage__wallet_strap.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_strap.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: wallet_closed.png (listede #68)

```
Only the leather strap of the same ticket wallet (give wallet_closed.png as the reference image), alone on the same canvas in exactly the place where it wraps the closed wallet: one horizontal strap of darker cognac-brown leather (#5C3A24) with fine edge stitching, about 10% of the wallet's height tall, crossing the whole width of the wallet a little below its middle (top edge at about 53% of the wallet's height), its two ends wrapping just around the left and right edges; the edge stitching is dark brown thread (not gold, not brass). On the right part of the strap, at about 62–75% of the wallet's width, a polished brass buckle with a short tongue holding the strap closed; the buckle frame is as tall as the strap or a little taller, and it is the only brass on the strap. Nothing else: no wallet behind it. Same light and perspective as wallet_closed.png. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız kayış + toka; tokanın sol kenarı net (build kayışı tokanın hemen solundan ikiye keser — kayıştaki tek

#### 70. W2.3 Kapağın içi (açılınca soldaki yüz)

- İndirme adı: `25-orient-express-voyage__wallet_inside_cover.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_inside_cover.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: wallet_closed.png (listede #68)

```
The INSIDE of the same wallet's front cover (reference: wallet_closed.png), seen straight on as it lies open to the left: the same portrait 2:3 size and position on the canvas, lined with soft deep-green suede (#11241B) with a thin brass-coloured stitched edge, the spine edge now on the RIGHT side, and a small slanted leather slip pocket in the lower half holding nothing. Same light from the top-left. No cast shadow, no glow. No text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: kapalıyla aynı ölçü; sırt sağda; boş cep; yazı yok; alfa.

#### 71. W2.4 Cüzdanın içi — sağ panel (bilet cebinin arkası)

- İndirme adı: `25-orient-express-voyage__wallet_inside.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_inside.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: wallet_closed.png (listede #68)

```
The inside right panel of the same open wallet (reference: wallet_closed.png), same size and same position as the closed wallet on the canvas: deep-green suede lining (#11241B) with brass stitching along the edges, the spine edge on the LEFT. The upper half is plain empty lining (a ticket will sit there). Do NOT draw the pocket front and do not draw a ticket. Same light. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: düz astar; cep önü ve bilet yok; kapalıyla aynı ölçü; alfa.

#### 72. W2.5 Bilet cebinin ön dudağı (tek başına)

- İndirme adı: `25-orient-express-voyage__wallet_pocket.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: wallet_inside.png (listede #71)

```
Only the front lip of the ticket pocket of the same wallet, on the same canvas and in the same place as wallet_inside.png: a bottle-green leather pocket covering the LOWER 54% of the inside panel, full panel width, with a straight top edge (crisp, with a tiny stitched hem and a small half-moon thumb notch in its middle), brass stitching on its sides. Everything above its top edge is transparent. Same light. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız cep önü; üst kenar düz ve net (bilet bunun arkasından çıkar); üstü tamamen şeffaf; alfa.

#### 73. W2.6 İstasyon zemini (zarf sayfası, telefon)

- İndirme adı: `25-orient-express-voyage__bg_station.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/bg_station.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG

```
A vertical phone-screen background in vintage travel-poster lithograph style: a grand railway station hall at night seen from the platform, deep bottle-green shadows (#11241B), a warm brass glow from hanging lamps only along the very top edge (the top 5% of the image), faint iron arches and a sleeping carriage silhouette blurred at the far left and right edges. The whole central area (from 7% to 92% of the height, the middle 70% of the width) stays calm, dark (deep green, well below mid-grey), nearly flat with only a very fine, low-contrast grain, and EMPTY so ivory text and the ticket wallet read on it. No people, no signs, no clock face with numbers, no text.
```

Kontrol: orta (%7–92) sakin, koyu yeşil ve çok ince grenli (ivory yazı üstünde — theme-check zarf zemini ölçüsü: kenar

#### 74. W2.7 Birinci sınıf bilet (portre penceresi #00FF00)

- İndirme adı: `25-orient-express-voyage__ticket.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/ticket.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A vintage first-class railway ticket card, alone, seen straight on, portrait (about 500:760), thick ivory card stock (#F3EBD9) with a fine engraved guilloche border printed in bottle green and brass along the edges, a perforated tear-off line across the card at about 88% of its height, and slightly rounded corners. In the upper half, centered, a portrait photo window filled with flat pure green #00FF00 (no texture, no shading): window width about 46% of the card width, window height about 38% of the card height, its top at 7% of the card height, a 4:5 portrait. The lower half below the window (from 49% to 86% of the card height) is EMPTY plain ivory card for text. Centered on the canvas, about 50% of the canvas width. Same light as the wallet. No cast shadow, no glow. No text, letters, numbers, prices, serial numbers or emblems. True transparent background PNG (real alpha channel).
```

Kontrol: pencere düz #00FF00 ve 4:5; alt yarı boş fildişi (isimler + tarih oraya); delikli koçan çizgisi; yazı yok; alfa.

#### 75. W2.8 Seyahat afişi (home hero + paylaşım görseli)

- İndirme adı: `25-orient-express-voyage__poster_hero.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/poster_hero.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG

```
A vertical vintage travel poster lithograph, 1930s style, flat rich colour areas with stone-litho grain: an elegant bottle-green and brass luxury sleeper train crossing a stone viaduct over a river valley at golden hour, cypress trees and distant mountains, a lakeside town with warm windows far below. The TOP 45% is a calm, pale golden-ivory sky with very soft gradients and nothing in it (dark green names are set there), the middle shows the viaduct and train, the bottom 25% deep green valley shadows. No people close up, no text, no letters, no numbers, no logos, no railway company insignia. Also cropped to 1200×630 for link previews from the middle: keep the train on the viaduct in the vertical middle band.
```

Kontrol: üst %45 sakin açık gökyüzü; tren viyadükte ortada; yazı/logo yok; litografi dokusu.

#### 76. W2.9 Eski harita (rota bandı)

- İndirme adı: `25-orient-express-voyage__map.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/map.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG

```
A horizontal antique travel map in the same lithograph style: aged ivory paper (#ECE1C8) with soft folds, a fictional coastline and sea tinted soft bottle green, delicate hatched mountains, rivers, tiny town clusters drawn as dots and squares, a decorative compass rose in a corner, faint grid lines. ABSOLUTELY NO readable place names, letters, numbers or labels anywhere (no cartouche text). Leave a clear, uncluttered diagonal band from the lower-left corner to the upper-right corner (a route line will be drawn along it by the website). Muted, elegant, warm.
```

Kontrol: hiç yazı/etiket yok; sol alt → sağ üst köşegen sakin; kurgu coğrafya.

#### 77. W2.10 Bagaj etiketi (sallanır)

- İndirme adı: `25-orient-express-voyage__luggage_tag.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/luggage_tag.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A single vintage leather-and-card luggage tag hanging straight down, seen from the front: a tall rounded-top tag of warm kraft-tan card (#C4A070) with a thin bottle-green leather edge, a brass eyelet near the top centre with a short loop of twine above it (the twine's top end is the pivot, straight above the eyelet). The whole object, twine loop included, is about 300:560 and about 80% of the image height; measured over that whole object, the card face from 36% to 90% of its height is EMPTY plain card for text. Only this object, centered. Same light. No cast shadow, no glow. No text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: düz duruyor; ip üstte ortada (dönme noktası); yüz, ip dahil nesne yüksekliğinin %36–90'ında boş; yazı yok; alfa.

#### 78. W2.11 İstasyon saati (geri sayım)

- İndirme adı: `25-orient-express-voyage__station_clock.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/station_clock.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
An antique brass railway station clock seen straight on, round, with an ornate polished brass bezel and a short brass bracket at the top, an ivory dial with simple bar hour marks ONLY (no numerals, no letters, no brand name), slim dark green hands showing about ten past ten. Filling about 80% of the square, centered. Same light. No cast shadow, no glow. True transparent background PNG (real alpha channel).
```

Kontrol: rakam/yazı yok; çubuk işaretler; alfa.

#### 79. W2.12 Vagon penceresi (cam #00FF00)

- İndirme adı: `25-orient-express-voyage__carriage_window.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/carriage_window.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A single railway carriage window frame seen straight on: a portrait polished brass window frame whose glass opening is exactly 3:4 (portrait), with softly rounded top corners and a slim lower sill, set in a narrow band of dark varnished bottle-green wood panelling around it (only a thin band, about 7% of the width), a tiny brass latch on the lower sill. The glass area is filled with flat pure green #00FF00 (no texture, no reflection, no shading). Outside the frame the image is transparent. Same light. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: cam düz #00FF00, cam açıklığı 3:4 (fotoğraflar 3:4); çerçeve ince; dışı şeffaf; alfa.

#### 80. W2.13 Vagon ahşap paneli (dikişsiz)

- İndirme adı: `25-orient-express-voyage__carriage_wall.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/carriage_wall.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless tileable texture of luxury railway carriage panelling: deep bottle-green (#1E3A2C) lacquered wood with a subtle fine grain and very faint marquetry inlay lines, evenly lit, low contrast, no strong highlights, no objects. Must repeat seamlessly on all four sides. No text.
```

Kontrol: dikişsiz; düşük kontrast (üstünde fildişi yazı okunur).

#### 81. W2.14 Litografi kâğıdı (dikişsiz sayfa zemini)

- İndirme adı: `25-orient-express-voyage__bg_paper.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/bg_paper.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless tileable texture of warm ivory lithograph poster paper (#F3EBD9): very soft stone-litho grain and faint fibres, evenly lit, very low contrast, no stains, no folds, no objects. Must repeat seamlessly on all four sides. No text.
```

Kontrol: dikişsiz; çok sakin (koyu yeşil yazı okunur).

#### 82. W2.15 Biniş kartı (RSVP formu, 3 dilim)

- İndirme adı: `25-orient-express-voyage__boarding_pass.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/boarding_pass.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A vintage railway boarding pass, portrait, seen straight on, filling about 95% of the canvas width: thick ivory card (#F3EBD9). Top 14%: a bottle-green printed header band with a fine brass guilloche edge (NO text in it). From 16% to 84% of the height: completely PLAIN, even ivory card with no marks at all, the same width from top to bottom (a form sits there and this band is repeated vertically by the website). At about 86% of the height a perforated tear-off line across the card; below it the stub with a small empty brass-printed rectangle frame. Same light. No cast shadow, no glow. No text, letters, numbers or barcodes. True transparent background PNG (real alpha channel).
```

Kontrol: orta bant (%16–84) tamamen düz ve kenarları paralel (build %16 / %45–55 / %82'den keser, orta dilim tekrarlanır);

#### 83. W2.16 Biniş damgası (RSVP sonrası + favicon)

- İndirme adı: `25-orient-express-voyage__stamp.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/parts/stamp.png`
- Bölüm: PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single round vintage rubber-stamp impression in deep route-red ink (#8C2F39), as if pressed on paper: a double ring border with a small art deco locomotive front silhouette and two small stars in the centre, slightly uneven ink coverage and worn edges. ABSOLUTELY NO letters, words, numbers or dates in the rings. Filling about 80% of the square, slightly rotated. True transparent background PNG (real alpha channel; the paper is NOT included, only the ink).
```

Kontrol: yalnız mürekkep; harf/rakam yok; kağıt yok; alfa.

#### 84. 2.1 Ana portre (bilet penceresi + davet yanında)

- İndirme adı: `25-orient-express-voyage__photos__hero_portrait.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin, standing at the open door of an elegant vintage sleeper carriage on a quiet station platform at golden hour: groom in a dark bottle-green velvet suit, bride in an ivory silk gown with a short veil, close and smiling, three-quarter length, faces in the upper third. Brass handrails, warm lamp light, soft steam in the background. Bottle green, brass and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 85. 2.2 Pencere 1 — "Where our journey began"

- İndirme adı: `25-orient-express-voyage__photos__story_1.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1365 px (0.750:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #84)

```
The same fictional couple as hero_portrait.jpg (a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin), in smart travel clothes, vertical 3:4, sitting opposite each other in a vintage dining car by the window, laughing over two cups of coffee, warm table lamp, countryside blurred outside. Photorealistic, same palette and grain. No text, no logos.
```

#### 86. 2.3 Pencere 2 — "A yes between two stations"

- İndirme adı: `25-orient-express-voyage__photos__story_2.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1365 px (0.750:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #84)

```
The same fictional couple as hero_portrait.jpg (a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin), in autumn coats, vertical 3:4, a proposal moment on a quiet country station platform at dusk, he on one knee, she with hands over her mouth, a vintage carriage and warm lamps behind them. Photorealistic, same palette and grain. No text, no signs.
```

#### 87. 2.4 Pencere 3 — "Next stop: forever"

- İndirme adı: `25-orient-express-voyage__photos__story_3.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1365 px (0.750:1) · opak · JPG

```
Vertical 3:4 close-up of the same fictional couple's hands (her warm olive skin, his light-brown skin; no faces): her hand with a simple engagement ring resting on a vintage leather travel case, his hand gently over hers, beside two first-class tickets with blank faces (no printing), soft window light. Photorealistic, same palette and grain. No text, no numbers.
```

#### 88. 2.5 Mekân

- İndirme adı: `25-orient-express-voyage__photos__venue.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1024 px (3:2) · opak · JPG

```
Landscape 3:2: a fictional grand historic station hall turned wedding venue at dusk, iron and glass atrium roof, long tables with ivory flowers and brass candle holders, a vintage bottle-green carriage parked along the platform, warm lights. No people, no signs, no text, no clock numerals. Photorealistic, same palette.
```

#### 89. 3.1 Kapak — elde telefon

- İndirme adı: `25-orient-express-voyage__mockups__cover_hand.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a polished mahogany carriage table with an ivory linen runner and a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 90. 3.2 Üç telefon — sayfalar

- İndirme adı: `25-orient-express-voyage__mockups__three_phones.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a polished mahogany carriage table with an ivory linen runner, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 91. 3.3 Dizüstü + telefon

- İndirme adı: `25-orient-express-voyage__mockups__laptop_phone.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a polished mahogany carriage table with an ivory linen runner, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 92. 3.4 Masa üstü — yukarıdan

- İndirme adı: `25-orient-express-voyage__mockups__flatlay_phone.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a polished mahogany carriage table with an ivory linen runner, slightly right of center and rotated about 8 degrees, surrounded at the edges by a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 93. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `25-orient-express-voyage__mockups__hand_phone_edit.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a bottle-green leather carriage seat with a brass reading lamp and a china teacup; a small arrangement of a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 94. P6.1 Ön yüz 5×7

- İndirme adı: `25-orient-express-voyage__print__invitation_front_5x7.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, yazı yok) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: poster_hero.png (listede #75)

```
Print-ready front of a wedding invitation, portrait 5×7 inches with bleed (1575 × 2175 px, 300 ppi), in the same 1930s travel-poster lithograph style as poster_hero.png: the bottle-green and brass sleeper train crossing the stone viaduct at golden hour fills the UPPER 40% of the image and fades softly into the paper; from 42% to 94% of the height the card is calm, plain, pale golden-ivory poster paper (#F3EBD9) with soft litho grain and NOTHING else on it (dark green text goes there: names, date, venue). A slim brass art deco border line 0.3 inch inside the trim edge (about 0.43 inch from the image edge) on all four sides — the only thing inside the empty area. No text, letters, numbers, logos. Sharp print detail.
```

Kontrol: resim üst %40'ta; %42–94 boş ve sakin (yalnız ince çerçeve çizgisi); çerçeve kesimden 0,3 in içeride; yazı yok.

#### 95. P6.2 Arka yüz 5×7

- İndirme adı: `25-orient-express-voyage__print__invitation_back_5x7.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, yazı yok) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: map.png (listede #76)

```
Print-ready back of the same invitation, portrait 5×7 inches with bleed (1575 × 2175 px, 300 ppi): the antique map from map.png faintly printed (about 15% strength, very low contrast) over plain ivory lithograph paper (#F3EBD9), a small brass luggage-tag illustration (empty face) hanging at the top centre within the top 16% of the height, and the same slim brass border line 0.3 inch inside the trim edge. Everything from 18% to 90% of the height stays calm and readable for a schedule and a QR code; nothing below 90% except the border. No readable place names, no text, letters or numbers.
```

Kontrol: etiket üst %16'da; harita çok soluk; %18–90 okunur; yazı yok.

### 26_Kintsugi_Washi

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, calligraphy, kanji, kana, seals with characters (hanko), logos, monograms or watermarks in any image.** Give W2.1 `washi_indigo.png` and W2.3 `rice_paper.png` as the style reference of every later part: the same indigo washi, the same rice paper, the same warm gold leaf.
```

#### 96. W2.1 Çivit washi (dış yüz + sayfa zemini)

- İndirme adı: `26-kintsugi-washi__washi_indigo.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_indigo.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat top-down texture of handmade Japanese-style washi paper dyed deep indigo (#242E58), filling the whole square edge to edge: long soft paper fibres slightly lighter than the paper, a gentle uneven dye with very subtle darker clouds, a fine matte grain. Evenly lit from the top-left, no shadow, no vignette, no fold, no crease, no object, no pattern, no gold. The left/right and top/bottom edges must tile without a visible seam. No text, letters or symbols.
```

Kontrol: dikişsiz (yan yana 2×2 konunca ek yeri yok); renk `#242E58` civarı; lifler görünür ama sakin; desen/yazı yok.

#### 97. W2.2 Çivit washi — katın içi

- İndirme adı: `26-kintsugi-washi__washi_inner.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_inner.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG
- Ek görsel: washi_indigo.png (listede #96)

```
The inside of the same indigo washi paper as washi_indigo.png: a seamless, tileable, flat top-down texture, one shade lighter and softer (#3C4874), the fibres a little more visible, with a few very small scattered flecks of real gold leaf (about 1–3% of the surface, irregular, never in a pattern). Evenly lit from the top-left, no shadow, no vignette, no fold, no object. Edges tile without a seam. No text, letters or symbols.
```

Kontrol: W2.1 ile aynı kâğıt, bir ton açık; altın pullar seyrek ve düzensiz; dikişsiz.

#### 98. W2.3 Pirinç kâğıdı (kart, davet bandı, form)

- İndirme adı: `26-kintsugi-washi__rice_paper.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/rice_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of soft handmade rice paper in warm ivory (#F3ECDC): long translucent kozo fibres, a very gentle uneven thickness, a natural deckle-free surface, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no gold, no pattern. Edges tile without a seam. No text, letters or symbols.
```

Kontrol: sakin (üstüne koyu yazı her yerde okunur); fildişi; dikişsiz; leke yok.

#### 99. W2.4 Altın kintsugi damarları (kapalı paketin dış yüzü)

- İndirme adı: `26-kintsugi-washi__kintsugi_veins.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/kintsugi_veins.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1078×1540 px (7:10) · şeffaf zemin (gerçek alfa) · PNG

```
Only fine lines of real gold leaf in the kintsugi manner, on a fully transparent background, for a vertical 0.70:1 sheet (the image IS the sheet; no paper, no background): two or three slender, organic, branching gold veins that wander across the whole sheet like the mended cracks of a ceramic bowl — one crossing the sheet's upper part, one crossing the middle from the left edge to the right edge, one running down through the lower part; the lines are 2–6 px wide, with a soft metallic highlight from the top-left, slightly raised like applied leaf, irregular thickness, a few tiny gold dots along them. They must cross the horizontal lines at 40% and 62% of the height and the vertical centre line, so the paper folds can be cut along them. Nothing else: no paper, no shadow, no glow or halo outside the gold. No text, letters or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: yalnız altın çizgiler (kâğıt yok); %40 ve %62 yatay çizgilerini ve dikey orta çizgiyi kesiyor; parıltı/hâle yok; gerçek alfa.

#### 100. W2.5 Mürekkep lekesi (foto maskesi)

- İndirme adı: `26-kintsugi-washi__ink_bleed.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/ink_bleed.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single bloom of black sumi ink spreading on wet rice paper, seen from above, on a fully transparent background: a solid, fully opaque black centre filling about 70% of the square, with an organic, feathered, softly irregular edge — fine capillary tendrils and soft bleeding fringes, a few small satellite droplets near the edge — like ink that has just soaked into absorbent paper. Pure black only (no grey wash in the centre, no paper texture, no colour). Centered, not cropped, generous empty margin. No text, letters or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: merkez tam opak siyah; kenar organik ve tüylü; kâğıt dokusu yok; gerçek alfa (CSS maske olarak büyütülecek).

#### 101. W2.6 Sumi fırça darbesi (başlık altı / ayırıcı)

- İndirme adı: `26-kintsugi-washi__sumi_stroke.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/sumi_stroke.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×384 px (4:1) · şeffaf zemin (gerçek alfa) · PNG

```
One single horizontal brush stroke of sumi ink in deep indigo-black (#1D2340), on a fully transparent background: about 75% of the image width, starting with a confident pressed head on the left and fading into a dry, split, feathered tail on the right, with natural dry-brush texture. No other mark, no letter, no character, no seal, no gold. Centered, not cropped, generous empty margin. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek yatay darbe; harf/karakter gibi okunmuyor; gerçek alfa.

#### 102. W2.7 Altın varak pulları (süzülen parçacık) — üç ayrı dosya

- İndirme adı: `26-kintsugi-washi__gold_flake_1.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/gold_flake_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (gold_flake_1, gold_flake_2, gold_flake_3). Make ONLY ONE image now: gold_flake_1 (number 1 of 3).

A single small torn flake of real gold leaf, alone, slightly crinkled, with a soft metallic highlight from the top-left, irregular torn edges, filling about 55% of the square. Centered, not cropped. No shadow, no glow or sparkle outside the flake. No text. True transparent background PNG (real alpha channel). (Make three different flakes: 1 = a roughly square flake, 2 = a long narrow sliver, 3 = a small crumpled piece.)
```

Kontrol: tek pul; üç dosya farklı biçimde; gölge/ışıltı yok; alfa.

#### 103. W2.7 Altın varak pulları (süzülen parçacık) — üç ayrı dosya

- İndirme adı: `26-kintsugi-washi__gold_flake_2.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/gold_flake_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (gold_flake_1, gold_flake_2, gold_flake_3). Make ONLY ONE image now: gold_flake_2 (number 2 of 3).

A single small torn flake of real gold leaf, alone, slightly crinkled, with a soft metallic highlight from the top-left, irregular torn edges, filling about 55% of the square. Centered, not cropped. No shadow, no glow or sparkle outside the flake. No text. True transparent background PNG (real alpha channel). (Make three different flakes: 1 = a roughly square flake, 2 = a long narrow sliver, 3 = a small crumpled piece.)
```

Kontrol: tek pul; üç dosya farklı biçimde; gölge/ışıltı yok; alfa.

#### 104. W2.7 Altın varak pulları (süzülen parçacık) — üç ayrı dosya

- İndirme adı: `26-kintsugi-washi__gold_flake_3.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/gold_flake_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (gold_flake_1, gold_flake_2, gold_flake_3). Make ONLY ONE image now: gold_flake_3 (number 3 of 3).

A single small torn flake of real gold leaf, alone, slightly crinkled, with a soft metallic highlight from the top-left, irregular torn edges, filling about 55% of the square. Centered, not cropped. No shadow, no glow or sparkle outside the flake. No text. True transparent background PNG (real alpha channel). (Make three different flakes: 1 = a roughly square flake, 2 = a long narrow sliver, 3 = a small crumpled piece.)
```

Kontrol: tek pul; üç dosya farklı biçimde; gölge/ışıltı yok; alfa.

#### 105. W2.8 Pirinç kâğıdı kuşak (kapanış)

- İndirme adı: `26-kintsugi-washi__obi_band.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/obi_band.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×240 px (20:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: rice_paper.png (listede #98)

```
A flat, straight horizontal band of the same ivory rice paper as rice_paper.png, seen straight on, like a paper belly band wrapped round a folded invitation: a long rectangle about 6.7:1, its two long edges softly torn (natural deckle), a few scattered flecks of real gold leaf on it, the two short ends cut straight. Lit from the top-left; a very soft contact shade on the band itself only. No cast shadow, no knot, no seal, no ribbon. No text, letters or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: düz yatay bant (~6,7:1); yırtık uzun kenarlar; altın pullar seyrek; düğüm/mühür yok; alfa.

#### 106. W2.9 Katların içindeki kart (boş, foto penceresi)

- İndirme adı: `26-kintsugi-washi__card_small.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1078×1540 px (7:10) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: rice_paper.png (listede #98)

```
A flat vertical invitation card of the same ivory rice paper as rice_paper.png, exactly 0.70:1, filling the image edge to edge (the card IS the image), seen straight on, with softly deckled edges and a very soft contact shade on the card itself. In its upper part a portrait photo window, 64% of the card's width, 4:5 tall, horizontally centered, its top edge at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading, straight edges). Below the window the rice paper is EMPTY (the website sets the names and the date there). No gold line, no frame, no text, letters or symbols. True transparent background PNG (real alpha channel) around the deckled edge.
```

Kontrol: pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 107. W2.10 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `26-kintsugi-washi__web_hero.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: washi_indigo.png (listede #96), obi_band.png (listede #105), kintsugi_veins.png (listede #99)

```
Wide horizontal still life, photorealistic, soft light from the top-left: the closed folded invitation — indigo washi paper (as washi_indigo.png) folded over an ivory rice-paper card like origami, a top and a bottom fold, two side panels meeting in the middle, an ivory rice-paper band with gold-leaf flecks round its middle (as obi_band.png), fine gold kintsugi veins crossing the folds (as kintsugi_veins.png) — lying slightly below the centre on a surface of the same rice paper, with three small torn gold-leaf flakes near it and a single sumi brush stroke far at the right edge. The top 20% of the image is calm, empty paper. This image is cropped to 1200×630 for link previews: keep the whole packet visible with at least 5% empty margin below it. No people, no text, no letters, no calligraphy, no seal with characters.
```

Kontrol: paket bütün ve altta boşluklu; üst %20 boş; yazı/hat yok.

#### 108. 2.1 Ana portre

- İndirme adı: `26-kintsugi-washi__photos__hero_portrait.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Naomi and Kai, in their early thirties (Naomi: shoulder-length wavy dark-brown hair, warm light-brown skin, a slim gold ring; Kai: short black hair, a neat short beard, light skin; they must not resemble any real person or celebrity) in an autumn garden: she in a simple ivory silk gown, he in a deep indigo suit, standing close under a red-gold maple, smiling at each other, three-quarter length, faces in the upper third, soft afternoon light from the left, a still pond and a cedar pavilion softly out of focus behind. Photorealistic, calm indigo, ivory and gold palette, subtle grain. No text, no frame.
```

#### 109. 2.2 Story 1 — "A borrowed umbrella"

- İndirme adı: `26-kintsugi-washi__photos__story_1.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #108)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin), laughing under one shared dark umbrella on a quiet rainy street at dusk, warm shop lights blurred behind, wet stones reflecting the light, her hand on his arm. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 110. 2.3 Story 2 — "Tea by the river"

- İndirme adı: `26-kintsugi-washi__photos__story_2.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1024 px (5:4) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #108)

```
Landscape 5:4: the same couple as hero_portrait.jpg sitting side by side on a wooden deck by a wide river in the early morning, two simple handmade ceramic cups between them, mist over the water and forested hills, seen from slightly behind and to the side. Photorealistic, same palette and grain. No text.
```

#### 111. 2.4 Story 3 — "The promise"

- İndirme adı: `26-kintsugi-washi__photos__story_3.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #108)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, beside a small ceramic tea bowl mended with gold kintsugi seams, on indigo linen, soft window light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 112. 2.5 Mekân

- İndirme adı: `26-kintsugi-washi__photos__venue.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant open garden pavilion of warm cedar wood beside a still pond in autumn, red and gold maples, a gravel path and a few rows of simple white chairs set for a ceremony, soft late-afternoon light, forested hills behind. No people, no signs, no text. Photorealistic, same palette.
```

#### 113. 3.1 Kapak — elde telefon

- İndirme adı: `26-kintsugi-washi__mockups__cover_hand.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a sheet of pale ivory rice paper over a light ash wood table and a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 114. 3.2 Üç telefon — sayfalar

- İndirme adı: `26-kintsugi-washi__mockups__three_phones.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a sheet of pale ivory rice paper over a light ash wood table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 115. 3.3 Dizüstü + telefon

- İndirme adı: `26-kintsugi-washi__mockups__laptop_phone.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a sheet of pale ivory rice paper over a light ash wood table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 116. 3.4 Masa üstü — yukarıdan

- İndirme adı: `26-kintsugi-washi__mockups__flatlay_phone.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a sheet of pale ivory rice paper over a light ash wood table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 117. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `26-kintsugi-washi__mockups__hand_phone_edit.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a natural linen sofa with an indigo cushion and a ceramic tea bowl; a small arrangement of a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 118. P1 — Ön yüz

- İndirme adı: `26-kintsugi-washi__print__invitation_front_5x7.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: rice_paper.png (listede #98), washi_indigo.png (listede #96), kintsugi_veins.png (listede #99)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the ivory rice paper of rice_paper.png. Along the top edge a band of the indigo washi of washi_indigo.png about 12% of the height, its lower edge softly torn like hand-torn washi (the torn edge stays above 15% of the height); along the bottom edge a matching indigo band about 11% of the height, its upper edge softly torn (staying below 86%); one slender gold kintsugi vein (as kintsugi_veins.png) runs inside the top band and down the left margin only, within 8% of the left edge, fading out by the middle of the height; a few tiny gold-leaf flecks only near the bands. The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm rice paper (the names, date and venue are set there): no vein, no fleck, no shadow, no stain in it. No text, letters, numbers, calligraphy, monograms, seals, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma (kenara kadar kâğıt); %18–%84 × %10–%90 tamamen boş; yazı yok; çivit bantlar yırtık kenarlı; damar yalnız

#### 119. P2 — Arka yüz

- İndirme adı: `26-kintsugi-washi__print__invitation_back_5x7.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same ivory rice paper, only a narrow indigo washi band along the top edge (about 7% of the height, its lower edge softly torn, staying above 10% of the height) and a few tiny gold-leaf flecks within that top 12%. Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY rice paper (a schedule and a QR code are set there): no fleck, no vein, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar çivit bant (yırtık kenar %10'un üstünde); %14'ün altı boş; yazı yok.

### 27_Riad_Lantern_Nights

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos of the fictional couple), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms, signatures or watermarks in any image. Make W2.1 `doors_closed.png` first and give it as the style reference of every later part: the same carved cedar, the same brass, the same teal / saffron palette, the same light.
```

#### 120. W2.1 Kapalı çift kapı (kanatlar)

- İndirme adı: `27-riad-lantern-nights__doors_closed.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/doors_closed.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A pair of tall carved cedar double doors of a traditional riad, closed, alone on a transparent background, gouache illustration with realistic wood texture: warm deep cedar brown (#3A2114 to #7A4A2A) with a fine visible grain, each leaf carved with a geometric eight-point star and interlace pattern in shallow relief, a row of round hammered-brass studs along the edges, and one heavy brass ring knocker on each leaf at mid height near the center seam. The two leaves meet in a thin, clearly visible vertical dark seam exactly at the horizontal center of the image (a 4–6 px dark gap from top to bottom, so the leaves can be cut apart there). Together the two leaves form a rectangle about 0.76 as wide as it is tall: horizontally centered, 74% of the image width, its bottom edge at 94% of the image height (the rest of the canvas above is left for the arch of the doorway). Only the two door leaves — no wall, no frame, no arch, no threshold. Front view, perfectly straight and symmetrical, not cropped. Lit like every other part: soft warm lantern light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters, numbers, calligraphy or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: iki kanat ortada ince koyu dikişle ayrılıyor (Claude `tema_build.dikis_bul` ile keser); kanatların dışında hiçbir şey

#### 121. W2.2 Kapı çerçevesi — at nalı kemer (önde sabit durur)

- İndirme adı: `27-riad-lantern-nights__doorway.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/doorway.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: doors_closed.png (listede #120)

```
The doorway surround of the same riad door, alone, drawn on exactly the same canvas position as doors_closed.png (give it as the reference image): the doors' rectangle (from 13% to 87% of the image width, from 29% to 94% of the image height) stays an empty opening; the surround hugs it — the jambs from 3% to 13% and from 87% to 97% of the width, the arch above the doors from 8% of the height down to 29%, a low threshold from 94% to 97% — and nothing reaches beyond 3% from the image edges: a horseshoe (Moorish) arch of carved ivory stucco with fine geometric lattice carving above the doors, a carved cedar lintel, and two narrow jambs faced with small teal, saffron and ivory zellige tiles in a simple geometric pattern, standing on a low stone threshold. The opening inside the surround — exactly where the two door leaves sit — is completely EMPTY and TRANSPARENT (real alpha, nothing painted there), so the doors and the courtyard behind show through. The surround's inner edge is a crisp line with a slight contact shade on the stucco itself (not a cast shadow). Gouache illustration with realistic stucco and glazed tile texture. Front view, perfectly straight and symmetrical, not cropped, with empty margin around. Soft warm light from the top-left. No cast shadow, no glow outside its outline. No text, letters, numbers or calligraphy. True transparent background PNG.
```

Kontrol: açıklık tamamen şeffaf ve kapıların dış hattıyla çakışıyor; kemer üstte, çini pervazlar yanlarda; gölge yok; alfa.

#### 122. W2.3 Kapıların ardındaki avlu

- İndirme adı: `27-riad-lantern-nights__courtyard.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/courtyard.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG
- Ek görsel: doors_closed.png (listede #120)

```
The view through the open doorway of a riad at night, painted to fill the whole canvas in the same gouache-with-real-texture style: a lantern-lit inner courtyard with a small tiled fountain far back in the center, an orange tree in a planter, zellige floor tiles in teal, saffron and ivory going back in perspective, carved arcades on both sides, magenta bougainvillea climbing a column, and several pierced brass lanterns glowing warm saffron. The area in the middle of the image (where the doorway opening is in doors_closed.png, and where an invitation card will stand) is calm, softly lit and without strong detail. Warm, inviting, romantic; deep teal shadows and saffron light. No people, no text, no letters, no calligraphy.
```

Kontrol: orta bölge sakin (kart oraya gelir); kişi yok; yazı yok; kapı açıklığının arkasında görünecek perspektif.

#### 123. W2.4 Kapıdan çıkan küçük davet kartı (boş)

- İndirme adı: `27-riad-lantern-nights__card_small.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A small portrait invitation card, alone: thick warm ivory cotton paper (#F6EAD2) with a fine deckled feel and a thin hand-painted saffron-and-teal zellige border inset from its edge, about 0.7 as wide as it is tall. In its upper half, horizontally centred, a tall Moroccan horseshoe-arch photo window about 4:5 and about half as wide as the card, its top about 8% of the card's height below the card's top edge, filled with flat pure green #00FF00 (no texture, no shading, crisp arch outline). Everything inside the border below the window — at least the lower 42% of the card — is blank, even ivory paper (no text, no ornament: names and date are added there by the website). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Soft warm light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: pencere düz #00FF00, at nalı kemer biçimi, kartın üst yarısında ortalı; pencerenin altı bordüre kadar düz kâğıt;

#### 124. W2.5 Pirinç fener

- İndirme adı: `27-riad-lantern-nights__lantern.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lantern.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A single traditional pierced brass lantern hanging from a short brass chain at the top center, alone: hammered antique brass (#C9A35B) with star-shaped piercings and small saffron and teal glass panes, lit from inside so the panes and the piercings glow warm saffron — the glow stays INSIDE the lantern's outline. The chain starts at the very top edge of the image. Gouache with realistic metal texture. Front view, perfectly straight, not cropped. No cast shadow, no light rays, no halo outside its outline (the website adds the glow). No text. True transparent background PNG.
```

Kontrol: tek fener; ışıma yalnız fenerin içinde; zincir üst kenardan; gölge/hâle yok; alfa. (Yeri: kapı sayfasında kemerin

#### 125. W2.6 Sayfa arka planı (kapı sayfası, telefon)

- İndirme adı: `27-riad-lantern-nights__bg_page.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bg_page.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG

```
A vertical phone-screen background: the night-teal tadelakt (polished lime plaster) wall of a riad courtyard (#0F2F31 to #174A4B) with a soft hand-made sheen, very faint magenta bougainvillea sprigs reaching in only at the two top corners, and a low band of teal, saffron and ivory zellige along the very bottom edge (bottom 8% only). The whole central area stays calm, plain teal plaster and empty (no door, no card, no text), so light ivory text reads on it. Gouache with real plaster texture, soft warm light from the top-left.
```

Kontrol: orta sakin; dekor yalnız üst köşeler ve en alt bant; yazı yok. (Yeri: kapı sayfasının telefon zemini; geniş ekranda

#### 126. W2.7 Döşenebilir duvar dokusu

- İndirme adı: `27-riad-lantern-nights__bg_tile.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bg_tile.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable texture of night-teal tadelakt lime plaster (#0F2F31 to #174A4B): soft trowel marks, a gentle polished sheen and tiny mineral speckles, evenly lit with no vignette, no light spot and no pattern that shows when the tile repeats. Edges must match perfectly left-right and top-bottom. No text, no objects.
```

Kontrol: 2×2 yan yana konunca dikiş görünmüyor; ışık lekesi yok.

#### 127. W2.8 – W2.11 Zellige karoları (sırayla dizilen bordür)

- İndirme adı: `27-riad-lantern-nights__tile_1.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_1.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · opak · PNG

```
A single square hand-cut zellige tile seen straight from above, filling the whole square edge to edge: a glazed eight-point star in deep teal (#174A4B) on ivory (#F6EAD2) with tiny saffron (#E3A54A) points between the arms; slightly uneven hand-made glaze with a soft sheen, realistic ceramic texture, gouache-like softness. No grout lines around it, no shadow, no text.
```

Kontrol: dört karo aynı aileden (renk, ışık, sır); her biri kareyi tam dolduruyor; yan yana dizilince uyumlu; yazı yok.

#### 128. W2.8 – W2.11 Zellige karoları (sırayla dizilen bordür)

- İndirme adı: `27-riad-lantern-nights__tile_2.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_2.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · opak · PNG

```
Context (the first image of this set, already made): A single square hand-cut zellige tile seen straight from above, filling the whole square edge to edge: a glazed eight-point star in deep teal (#174A4B) on ivory (#F6EAD2) with tiny saffron (#E3A54A) points between the arms; slightly uneven hand-made glaze with a soft sheen, realistic ceramic texture, gouache-like softness. No grout lines around it, no shadow, no text.

Now make ONLY this one image (tile_2): The same tile family and size: an interlaced geometric rosette in saffron and ivory with a thin teal outline, same glaze, same light. No grout, no shadow, no text.
```

Kontrol: dört karo aynı aileden (renk, ışık, sır); her biri kareyi tam dolduruyor; yan yana dizilince uyumlu; yazı yok.

#### 129. W2.8 – W2.11 Zellige karoları (sırayla dizilen bordür)

- İndirme adı: `27-riad-lantern-nights__tile_3.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_3.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · opak · PNG

```
Context (the first image of this set, already made): A single square hand-cut zellige tile seen straight from above, filling the whole square edge to edge: a glazed eight-point star in deep teal (#174A4B) on ivory (#F6EAD2) with tiny saffron (#E3A54A) points between the arms; slightly uneven hand-made glaze with a soft sheen, realistic ceramic texture, gouache-like softness. No grout lines around it, no shadow, no text.

Now make ONLY this one image (tile_3): The same family: a small teal and ivory star-and-cross pattern with a brass-colored (#C9A35B) glazed center, same glaze, same light. No grout, no shadow, no text.
```

Kontrol: dört karo aynı aileden (renk, ışık, sır); her biri kareyi tam dolduruyor; yan yana dizilince uyumlu; yazı yok.

#### 130. W2.8 – W2.11 Zellige karoları (sırayla dizilen bordür)

- İndirme adı: `27-riad-lantern-nights__tile_4.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_4.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · opak · PNG

```
Context (the first image of this set, already made): A single square hand-cut zellige tile seen straight from above, filling the whole square edge to edge: a glazed eight-point star in deep teal (#174A4B) on ivory (#F6EAD2) with tiny saffron (#E3A54A) points between the arms; slightly uneven hand-made glaze with a soft sheen, realistic ceramic texture, gouache-like softness. No grout lines around it, no shadow, no text.

Now make ONLY this one image (tile_4): The same family: a plain deep-teal glazed tile with a slightly crackled hand-made surface (a calm tile between the patterned ones), same light. No grout, no shadow, no text.
```

Kontrol: dört karo aynı aileden (renk, ışık, sır); her biri kareyi tam dolduruyor; yan yana dizilince uyumlu; yazı yok.

#### 131. W2.12 Kemer pencere çerçevesi (story fotoğrafları)

- İndirme adı: `27-riad-lantern-nights__frame_arch.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/frame_arch.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A tall Moroccan window frame, alone: a horseshoe-arch opening framed by carved ivory stucco with fine geometric lattice carving and a slim carved cedar sill at the bottom, about 2:3 tall overall. The window opening is filled with flat pure green #00FF00 (no texture, no shading), its arch outline crisp. Gouache with realistic stucco and wood texture. Front view, perfectly straight, centered and not cropped, with generous empty margin. Soft warm light from the top-left. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```

Kontrol: pencere düz #00FF00, at nalı kemer; çerçeve ince (pencere çerçevenin ~%70'i); alfa. (Claude pencereyi şeffaf

#### 132. W2.13 Yatay çerçeve (mekân fotoğrafı)

- İndirme adı: `27-riad-lantern-nights__frame_landscape.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/frame_landscape.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: frame_arch.png (listede #131)

```
A wide carved cedar frame in the same style as frame_arch.png, alone: a slim carved cedar border with small hammered-brass studs at the corners, its opening exactly 16:9 and filled with flat pure green #00FF00 (no texture, no shading). Front view, perfectly straight, centered, not cropped, generous margin. Soft warm light from the top-left. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```

Kontrol: pencere 16:9 düz #00FF00; çerçeve ince; alfa. (Yeri: details'te mekân fotoğrafının çerçevesi.)

#### 133. W2.14 – W2.15 Bougainvillea köşe kümeleri

- İndirme adı: `27-riad-lantern-nights__bougainvillea_tl.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bougainvillea_tl.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A cascading spray of magenta bougainvillea (#B8326E) with papery bracts, small ivory flowers and dark green leaves, growing in from the top-left corner of the square and trailing down and to the right, gouache with realistic petal texture; the bottom-right half of the square stays empty. No shadow, no glow, no text. True transparent background PNG.
```

Kontrol: küme köşeden giriyor, diğer yarı boş; magenta yalnız burada; alfa. (Yeri: home'un ilk ekranında sol üst + sağ alt

#### 134. W2.14 – W2.15 Bougainvillea köşe kümeleri

- İndirme adı: `27-riad-lantern-nights__bougainvillea_br.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bougainvillea_br.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
Context (the first image of this set, already made): A cascading spray of magenta bougainvillea (#B8326E) with papery bracts, small ivory flowers and dark green leaves, growing in from the top-left corner of the square and trailing down and to the right, gouache with realistic petal texture; the bottom-right half of the square stays empty. No shadow, no glow, no text. True transparent background PNG.

Now make ONLY this one image (bougainvillea_br): The same bougainvillea, mirrored in composition: growing in from the bottom-right corner, reaching up and to the left; the top-left half empty. No shadow, no glow, no text. True transparent background PNG.
```

Kontrol: küme köşeden giriyor, diğer yarı boş; magenta yalnız burada; alfa. (Yeri: home'un ilk ekranında sol üst + sağ alt

#### 135. W2.16 Ayırıcı

- İndirme adı: `27-riad-lantern-nights__divider.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/divider.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×512 px (3:1) · şeffaf zemin (gerçek alfa) · PNG

```
A slim horizontal ornament, alone: a fine pierced brass filigree line with a small eight-point star at its center, about 10 times wider than tall, centered. Realistic hammered brass, soft warm light from the top-left. No shadow, no glow, no text. True transparent background PNG.
```

Kontrol: ince, yatay, ortalı; alfa. (Yeri: home davetinde isimlerle tarih arasında, details başlığının altında.)

#### 136. W2.17 Süzülen accent — tek bougainvillea yaprağı (braktesi)

- İndirme adı: `27-riad-lantern-nights__accent_1.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/accent_1.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single papery magenta bougainvillea bract, alone, slightly curled, filling about 60% of the square. Gouache with realistic petal texture. Front view, centered, not cropped. No shadow, no glow, no text. True transparent background PNG.
```

Kontrol: tek yaprak; alfa. (Yeri: RSVP yanıtı gönderilince fener bir kez parlar ve bu yapraktan üçü ekrandan süzülür —

#### 137. W2.18 Paylaşım görseli kaynağı

- İndirme adı: `27-riad-lantern-nights__web_hero.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: doors_closed.png (listede #120)

```
A wide scene for a link-preview image: the closed carved cedar double doors from doors_closed.png standing in their stucco horseshoe-arch doorway in a night-teal tadelakt wall, a lit pierced brass lantern hanging to the upper left of the arch, a soft warm saffron light on the wall around the door, and a little magenta bougainvillea at the right edge. The doorway sits in the lower-middle of the image and is fully visible; the top 20% of the image is calm wall with nothing important. Same gouache-with-real-texture style and palette. No people, no text, no letters, no calligraphy.
```

Kontrol: kapı alt-ortada tam görünüyor; üst %20 sakin; yazı yok. (`tema_build.og_kirp(hiza="alt")` → `og-1200x630.jpg`.)

#### 138. 2.1 Portre (davet kartı ve home)

- İndirme adı: `27-riad-lantern-nights__photos__hero_portrait.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
A warm, natural portrait photograph of a fictional couple in their early thirties (they must not resemble any real person): she has shoulder-length dark wavy hair and wears a simple ivory silk evening dress, he has short light-brown hair and wears a navy suit with an open collar. They stand close, smiling softly, framed from the waist up, in a riad courtyard at blue hour, lit by warm pierced brass lanterns; teal tiled walls and a little magenta bougainvillea softly out of focus behind them. Faces in the upper middle of the frame. Photorealistic, natural skin, no heavy retouching. No text, no logo, no watermark.
```

#### 139. 2.2 Story 1 — "Our first evening" (uzun pencere)

- İndirme adı: `27-riad-lantern-nights__photos__story_1.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1536 px (2:3) · opak · JPG

```
The same fictional couple (same faces, hair and clothes) sharing mint tea at a small mosaic table on a lantern-lit riad terrace in the evening, laughing, seen from a little distance; warm saffron lantern light, teal shadows. Vertical photo, the couple in the middle third. Photorealistic. No text, no watermark.
```

#### 140. 2.3 Story 2 — "Among the lanterns"

- İndirme adı: `27-riad-lantern-nights__photos__story_2.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1536 px (2:3) · opak · JPG

```
The same fictional couple walking hand in hand under many hanging pierced brass lanterns in a quiet covered passage at night, warm light patterns falling on the walls, seen from behind at a three-quarter angle so their faces are only partly visible. Vertical photo. Photorealistic. No shop signs, no text, no watermark.
```

#### 141. 2.4 Story 3 — "Yes, under the stars"

- İndirme adı: `27-riad-lantern-nights__photos__story_3.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1536 px (2:3) · opak · JPG

```
A close photograph of the same fictional couple's joined hands with a simple gold engagement ring, resting on a teal and ivory zellige tabletop beside a small lit brass lantern and a few magenta bougainvillea bracts, night, shallow depth of field. Vertical photo. Photorealistic. No text, no watermark.
```

#### 142. 2.5 Mekân — "The Saffron Courtyard Riad" (kurgu)

- İndirme adı: `27-riad-lantern-nights__photos__venue.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
A wide photograph of a fictional riad courtyard set for an evening wedding: a central tiled fountain, an orange tree, low cedar tables with ivory linen and candles, carved stucco arcades, teal and saffron zellige, many lit brass lanterns hanging overhead and bougainvillea on the columns, at blue hour. It must not reproduce any real, identifiable hotel or riad. No people, no text, no signs, no watermark.
```

#### 143. 3.1 Kapak — elde telefon

- İndirme adı: `27-riad-lantern-nights__mockups__cover_hand.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a teal zellige-tiled table top in a lantern-lit courtyard and pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 144. 3.2 Üç telefon — sayfalar

- İndirme adı: `27-riad-lantern-nights__mockups__three_phones.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a teal zellige-tiled table top in a lantern-lit courtyard, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 145. 3.3 Dizüstü + telefon

- İndirme adı: `27-riad-lantern-nights__mockups__laptop_phone.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a teal zellige-tiled table top in a lantern-lit courtyard, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 146. 3.4 Masa üstü — yukarıdan

- İndirme adı: `27-riad-lantern-nights__mockups__flatlay_phone.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a teal zellige-tiled table top in a lantern-lit courtyard, slightly right of center and rotated about 8 degrees, surrounded at the edges by pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 147. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `27-riad-lantern-nights__mockups__hand_phone_edit.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a low cedar daybed with saffron and teal cushions and a brass-rimmed tea glass; a small arrangement of pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 148. 6.1 Ön yüz

- İndirme adı: `27-riad-lantern-nights__print__print_front.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_front.png`
- Bölüm: PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG

```
A printable wedding invitation ground, front side, portrait, flat and seen straight on, 1819 × 2551 px at 300 ppi (A5 with bleed; it is trimmed later), no text: warm ivory lime-plaster paper (#F6EAD2) with a fine hand-made texture running edge to edge. Decoration ONLY in the top 15% and the bottom 15% of the image: at the top a narrow band of teal, saffron and ivory zellige tiles with a small carved ivory-stucco horseshoe arch motif framing a lit pierced brass lantern at its centre and a few magenta bougainvillea bracts at the top-right; at the bottom a matching narrow zellige band. Keep every ornament at least 5% inside the image edges. The whole central area — from 16% to 84% of the height and from 11% to 89% of the width — is plain, calm, even ivory paper with no ornament, no frame line and no shading, for the names, date and venue. Gouache with realistic texture, soft warm light from the top-left. No text, no letters, no numbers, no calligraphy, no monogram.
```

#### 149. 6.2 Arka yüz

- İndirme adı: `27-riad-lantern-nights__print__print_back.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_back.png`
- Bölüm: PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: print_front.png (listede #148)

```
The matching back of the same invitation (give print_front.png as the reference image), portrait, 1819 × 2551 px at 300 ppi, no text: the same ivory lime-plaster paper edge to edge, decorated ONLY in the top 14% of the image — a single narrow band of the same zellige tiles and a small brass eight-point star centred just under it, at least 5% inside the image edges. Everything else — from 15% to 91% of the height and from 11% to 89% of the width, and the bottom of the sheet — is plain, even ivory paper for the schedule, the details and a QR code. Same style and light. No text, no letters, no numbers, no calligraphy.
```

### 28_Maison_Patisserie

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the parts below in order and in ONE chat: PAKET 5 (website layers) first, then PAKET 2 (sample photos of the fictional couple), then PAKET 6 (printable invitation backgrounds). Skip W2.14–W2.15 (marked "BU TURDA ÜRETME"). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, logos, monograms, price tags or watermarks in any image.** Give W2.1 `box_base.png` as the style and position reference of every later stage part, and W2.10 `bg_page.png` as the palette reference of everything else.
```

#### 150. W2.1 Açık kutu — içi boş (üstten)

- İndirme adı: `28-maison-patisserie__box_base.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/box_base.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A square luxury pâtisserie gift box WITHOUT its lid, seen exactly from directly above (top-down, no perspective), empty: four low walls of matte pistachio-green card (#A9C49C) with a thin gold foil line along the top edge of each wall, the inside lined with smooth cream paper (#FBF5EC) with a very faint watercolour texture. The box fills the square from about 3% to 97% of the image on every side (outer edge of the walls at x 32–992 px and y 32–992 px of a 1024 px canvas), perfectly centered and square. Nothing inside the box. The inner edge where the walls meet the cream floor is a crisp, clearly visible line with a soft contact shade on the object itself. Only this one object. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow outside the box. No glow, halo or haze outside its outline. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: tam üstten; kare; x/y 32–992 px; içi boş; duvar üstünde ince altın çizgi; gölge yok; gerçek alfa.

#### 151. W2.2 İpek kâğıt — sol yaprak

- İndirme adı: `28-maison-patisserie__tissue_left.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/tissue_left.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: box_base.png (listede #150)

```
Only the LEFT sheet of soft ivory-white tissue paper that lies folded inside the box of box_base.png (give it as the reference; same canvas, same top-down view, same position): a gently crinkled, slightly translucent sheet with delicate natural creases and a faint rose-pink deckled edge, covering the left half of the inside of the box from the left wall (x about 54 px) to just past the middle (x about 548 px), from the top wall (y about 54 px) to the bottom wall (y about 970 px). Its right edge, which will slide away, is a soft folded edge that reads clearly. Only the tissue — no box, no card, nothing else. Top-down, no perspective. Soft light from the top-left. No cast shadow outside the sheet. No text. True transparent background PNG (real alpha channel), the paper itself about 92% opaque.
```

Kontrol: yalnız sol yaprak; kutunun içine oturuyor; ortayı az geçiyor; gölge yok; gerçek alfa.

#### 152. W2.3 İpek kâğıt — sağ yaprak

- İndirme adı: `28-maison-patisserie__tissue_right.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/tissue_right.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: tissue_left.png (listede #151)

```
The RIGHT sheet of the same tissue paper as tissue_left.png (give it as the reference; same canvas and view): it covers the right half of the inside of the box from just before the middle (x about 476 px, overlapping the left sheet a little) to the right wall (x about 970 px), y about 54 to 970 px, with its own natural creases (not a mirror copy) and the same faint rose-pink deckled edge. Only the tissue. Top-down, no perspective. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha), the paper about 92% opaque.
```

Kontrol: yalnız sağ yaprak; sol yaprakla ortada biraz örtüşüyor; ayna kopya değil; gerçek alfa.

#### 153. W2.4 Kapak — kurdelesiz (üstten)

- İndirme adı: `28-maison-patisserie__lid.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/lid.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: box_base.png (listede #150)

```
The closed LID of the same pâtisserie box (give box_base.png as the reference; same canvas, same top-down view, same position), WITHOUT any ribbon or bow: a square lid of matte pistachio-green card (#A9C49C) with a very subtle pastel watercolour mottling, a fine embossed border and a thin gold foil line inset about 4% from its edge; the lid covers the box exactly, its outer edge at x 32–992 px and y 32–992 px. The centre of the lid is plain (the ribbon and the bow are separate parts). Only the lid. Top-down, no perspective. Soft light from the top-left. No cast shadow and no drop shadow outside the lid. No glow outside its outline. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel).
```

Kontrol: kurdele/fiyonk yok; kutuyla aynı kare (32–992 px); ince altın çizgi; gölge yok; gerçek alfa.

#### 154. W2.5 Saten kurdele — çapraz (fiyonksuz)

- İndirme adı: `28-maison-patisserie__ribbon_cross.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/ribbon_cross.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: lid.png (listede #153)

```
Only the rose-pink double-faced satin ribbon (#E8B4B8 with a soft natural sheen) that crosses the lid of lid.png (give it as the reference; same canvas, same top-down view): one band running vertically through the centre from the top edge of the lid to the bottom edge (x about 460–564 px, y 32–992 px) and one band running horizontally through the centre from the left edge to the right edge (y about 460–564 px, x 32–992 px), lying flat on the lid; where the two bands cross in the centre the ribbon is flat and neat (the bow is a separate part). Each band is about 104 px wide with crisp edges. Only the ribbon — no lid, no bow. Top-down, no perspective. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız kurdele; iki bant ortadan; ~104 px genişlik; kapak kenarlarına kadar; fiyonk yok; gerçek alfa. (Claude

#### 155. W2.6 Fiyonk — sol ilmek ve sol kuyruk

- İndirme adı: `28-maison-patisserie__bow_left.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/bow_left.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: ribbon_cross.png (listede #154)

```
The LEFT half of a generous rose-pink satin bow (#E8B4B8, the same satin as ribbon_cross.png; give it as the reference) tied in the centre of the box lid, seen from directly above on the same canvas: only the left loop and the left tail, complete — including the part that would be hidden under the knot — reaching from the centre of the canvas (x 512, y 500) to the left, about 300 px wide and 340 px tall in total, the tail falling down-left. The bow sits on the centre of the lid where the ribbons cross. Soft satin folds and sheen. Only this half of the bow. Top-down. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız sol ilmek + kuyruk; düğümün altına giren kısım da tam; merkezden sola; gerçek alfa.

#### 156. W2.7 Fiyonk — sağ ilmek ve sağ kuyruk

- İndirme adı: `28-maison-patisserie__bow_right.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/bow_right.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: bow_left.png (listede #155)

```
The RIGHT half of the same rose-pink satin bow as bow_left.png (give it as the reference; same canvas and view): only the right loop and the right tail, complete including the part under the knot, reaching from the centre of the canvas (x 512, y 500) to the right, about 300 px wide and 340 px tall, the tail falling down-right — matching the left half so together they make one natural bow (not a mirror copy). Only this half. Top-down. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız sağ yarı; sol yarıyla birlikte tek fiyonk gibi; gerçek alfa.

#### 157. W2.8 Fiyonk düğümü

- İndirme adı: `28-maison-patisserie__bow_knot.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/bow_knot.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: bow_left.png (listede #155), bow_right.png (listede #156)

```
Only the small wrapped KNOT in the centre of the same rose-pink satin bow (give bow_left.png and bow_right.png as the reference; same canvas and view): a neat satin knot about 90 px wide and 110 px tall, centred at x 512, y 500, covering the place where the two loops meet. Only the knot. Top-down. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız düğüm; iki yarının birleştiği yeri örtüyor; gerçek alfa. **Üçü üst üste = tek fiyonk** (açılışta ilmekler

#### 158. W2.9 Kutudaki kart (boş)

- İndirme adı: `28-maison-patisserie__card_small.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A small, thick invitation card that waits inside the pâtisserie box, alone: soft cream cotton card (#FFFBF5) with a faint watercolour wash of pistachio at the very top edge and a very thin gold foil edge, portrait, exactly 560 by 740 in proportion (about 3:4), centred on the canvas and filling about 70% of its width. The whole face of the card is BLANK (the website places the photo and the text on it) — no window, no frame lines in the middle, no ornaments in the middle. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Soft light from the top-left. No cast shadow. No text, letters, numbers or monogram. True transparent background PNG (real alpha channel).
```

Kontrol: oran ~560:740; yüzü boş (foto ve yazı HTML); ince altın kenar; gölge yok; gerçek alfa.

#### 159. W2.10 Sayfa zemini (kutu sayfası + home, telefon)

- İndirme adı: `28-maison-patisserie__bg_page.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/bg_page.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG

```
A vertical phone-screen background in pastel watercolour: warm cream paper (#FBF5EC) with soft, airy washes of pistachio green in the top-left corner and of rose pink in the bottom-right corner, a few tiny scattered sugar pearls and one or two pale macaron crumbs only at the far edges, fine cotton-paper grain everywhere. The whole central 70% of the image stays calm, light and empty (no box, no card, no text) so dark text and the box read on it. No text, letters or numbers.
```

Kontrol: orta %70 sakin ve açık; renk yalnız köşelerde; yazı yok.

#### 160. W2.11 Dikişsiz zemin karosu

- İndirme adı: `28-maison-patisserie__bg_tile.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/bg_tile.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable cream paper texture (#FBF5EC) with a very faint pastel watercolour mottling of pistachio and rose, fine cotton-paper grain, very low contrast, no objects, no pattern repeats visible, no edges or vignette. It must tile perfectly in both directions. No text.
```

Kontrol: dört yönde dikişsiz; çok düşük kontrast; nesne yok.

#### 161. W2.12 Vitrin rafı

- İndirme adı: `28-maison-patisserie__shelf.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/shelf.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
A single long glass shelf of a Parisian pâtisserie display case, seen straight from the front at eye level: a thick clear glass plate with a soft green-tinted edge and a thin polished gold rim along its front edge, very wide and thin — it spans about 96% of the image width and is only about 5% of the image height, centred vertically. Clean, elegant, photorealistic. Only the shelf — no pastries, no case, no brackets. Soft light from the top-left. No cast shadow below it. No text. True transparent background PNG (real alpha channel).
```

Kontrol: çok geniş, ince; altın ön kenar; boş; gölge yok; gerçek alfa (Story'de fotoğraflar ve Details'te menü raflarının altı).

#### 162. W2.13 Şeker inci (accent 1)

- İndirme adı: `28-maison-patisserie__accent_1.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/accent_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single glossy sugar pearl (a round pâtisserie dragée) in pearly white with a faint pink lustre, alone, drawn large so it fills about 50% of the square. Photorealistic. Front view, centered, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek inci; parlak; gölge yok; gerçek alfa (RSVP gönderiminde ~18 inci düşer — `MOTION.accents.closing`).

#### 163. W2.16 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `28-maison-patisserie__web_hero.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: lid.png (listede #153), ribbon_cross.png (listede #154)

```
Wide horizontal scene in the same style: the closed pistachio pâtisserie box with its rose satin ribbon and bow (as lid.png + ribbon_cross.png + the bow parts) resting on a pale marble pâtisserie counter, a gold-rimmed plate of pistachio, rose and vanilla macarons beside it, a puff of ivory tulle and a few sugar pearls, cream watercolour wall behind. The box and the plate sit in the lower 70% of the image, fully visible; the top 20% is calm empty cream wall. Photorealistic pastry with a pastel watercolour background. No text, letters, logos or price tags. This image is also cropped to 1200×630 for link previews.
```

Kontrol: kutu + fiyonk altta tam görünür; üst %20 boş; yazı yok.

#### 164. 2.1 Ana portre

- İndirme adı: `28-maison-patisserie__photos__hero_portrait.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties in a sunlit orangery with tall arched glass windows and potted citrus trees: the bride in a soft ivory tulle gown, the groom in a light sage-grey suit with a blush pocket square, close together and smiling, three-quarter length, faces in the upper third of the frame. Pastel pistachio, rose and cream palette, soft daylight, gentle film grain. They must not resemble any real or famous person. No text, no frame, no watermark.
```

#### 165. 2.2 Raf 1 — "Coffee and croissants for two"

- İndirme adı: `28-maison-patisserie__photos__story_1.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5, in casual clothes at a small marble table inside a Parisian-style pâtisserie, sharing coffee and croissants, laughing, a glass display case of pastel pastries softly out of focus behind them. Photorealistic, same palette and grain. No readable signs, no text, no logos.
```

#### 166. 2.3 Raf 2 — "A question over macarons"

- İndirme adı: `28-maison-patisserie__photos__story_2.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5: the moment of the proposal at a café terrace table, a small open pâtisserie box of pastel macarons between them, his hand offering a ring box, her hands over her mouth in surprise. Photorealistic, same palette and grain. No text, no logos.
```

#### 167. 2.4 Raf 3 — "Forever, with a ring"

- İndirme adı: `28-maison-patisserie__photos__story_3.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Close-up, vertical 4:5: the couple's joined hands with a delicate engagement ring, resting beside a pistachio-and-rose macaron and a satin ribbon on a cream linen tablecloth. Photorealistic, same palette and grain. No text.
```

#### 168. 2.5 Mekân

- İndirme adı: `28-maison-patisserie__photos__venue.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1024 px (3:2) · opak · JPG

```
Landscape 3:2: an elegant white Victorian orangery with tall arched glass windows on a green lawn by the sea, a rose garden in front, set for a wedding with cream chairs and pastel flowers, soft late-afternoon light. Fictional place — no recognisable real building, no people, no signs, no text. Photorealistic, same palette.
```

#### 169. 3.1 Kapak — elde telefon

- İndirme adı: `28-maison-patisserie__mockups__cover_hand.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a white marble pastry counter with a cream linen napkin and a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 170. 3.2 Üç telefon — sayfalar

- İndirme adı: `28-maison-patisserie__mockups__three_phones.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a white marble pastry counter with a cream linen napkin, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 171. 3.3 Dizüstü + telefon

- İndirme adı: `28-maison-patisserie__mockups__laptop_phone.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a white marble pastry counter with a cream linen napkin, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 172. 3.4 Masa üstü — yukarıdan

- İndirme adı: `28-maison-patisserie__mockups__flatlay_phone.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a white marble pastry counter with a cream linen napkin, slightly right of center and rotated about 8 degrees, surrounded at the edges by a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 173. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `28-maison-patisserie__mockups__hand_phone_edit.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream boudoir armchair with a pistachio cushion and a porcelain cup of coffee; a small arrangement of a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 174. P6.1 Ön yüz

- İndirme adı: `28-maison-patisserie__print__invitation_front.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
A full-bleed printable wedding invitation background, front side, portrait, in pastel watercolour: warm cream cotton paper (#FBF5EC) with fine grain everywhere. At the top centre a photorealistic rose-pink satin bow (#E8B4B8) resting on a short horizontal length of satin ribbon; the bow and ribbon stay between 6% and 24% of the image height and within the middle 50% of the width. At the bottom a slim, soft pastel watercolour garland of pistachio macarons, tiny sugar pearls and a wisp of ivory tulle, lying horizontally between 87% and 95% of the image height and within the middle 80% of the width. A very thin gold foil hairline frame inset 7% from every edge. The whole area from 12% to 88% of the width and from 25% to 86% of the height is completely EMPTY, calm cream paper (no flowers, crumbs, pearls, shading or frame lines in it) because dark text is printed there. Nothing closer than 10% of the width to the left or right edge and 5% of the height to the top or bottom edge except the plain paper. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 x 2175 px.
```

Kontrol: tam taşma; x %12–88 × y %25–86 tamamen boş; fiyonk y %6–24; çelenk y %87–95; kenarlarda yalnız kâğıt; yazı yok.

#### 175. P6.2 Arka yüz

- İndirme adı: `28-maison-patisserie__print__invitation_back.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: invitation_front.png (listede #174)

```
The back side of the same printable invitation (give invitation_front.png as the reference): full-bleed cream cotton paper (#FBF5EC) with the same fine grain and the same thin gold foil hairline frame inset 7% from every edge; only a small rose-pink satin bow at the top centre with three tiny sugar pearls beneath it, all between 6% and 19% of the image height and within the middle 30% of the width. Everything from 21% of the height down to the frame, between 12% and 88% of the width, is completely EMPTY paper for the schedule and a QR code. No text, letters, numbers, logos or watermarks. Print quality, 1575 x 2175 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; fiyonk + inciler y %6–19; geri kalanı boş; yazı yok.

### 29_Celestial_Observatory

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, zodiac glyphs, constellation names, degree numerals, Roman numerals, logos, monograms or watermarks in any image** (engraved tick marks without numbers are fine). Give W2.1 `night_sky.png`, W2.2 `chart_paper.png` and W2.3 `dome.png` as the style reference of every later part: the same midnight sky, the same silver-ivory paper, the same warm antique brass and gold leaf, the same fine engraving.
```

#### 176. W2.1 Gece göğü (yarığın içi + sayfa zemini)

- İndirme adı: `29-celestial-observatory__night_sky.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/night_sky.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat texture of a deep midnight-blue night sky (#11193A) filling the whole square edge to edge, printed like an antique engraved star atlas plate: very fine, sparse pin-point stars in silver-white of three or four sizes (about 60–90 stars in total, scattered irregularly, a few slightly brighter), a barely visible fine engraved hatching texture in a slightly lighter blue, a soft matte paper grain. Calm and even everywhere, no milky way band, no nebula, no colour other than midnight blue and silver, no constellation lines, no vignette, no gradient, no object. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#11193A` civarı; yıldızlar ince ve seyrek; çizgi/yazı yok.

#### 177. W2.2 Gümüş-fildişi harita kâğıdı (kartlar, bantlar, form)

- İndirme adı: `29-celestial-observatory__chart_paper.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/chart_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine antique laid paper in a cool silver-ivory (#EEEBE3), like the paper of an old star atlas: very faint laid lines, a gentle natural tooth, a soft cool tone with the slightest warm patina, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu yazı her yerde okunur); gümüş-fildişi; dikişsiz; leke/baskı yok.

#### 178. W2.3 Gözlemevi kubbesi (kapalı nesne; yarık penceresi)

- İndirme adı: `29-celestial-observatory__dome.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/dome.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1100×1340 px (0.821:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A small antique observatory seen straight from the front, as an elegant object on a fully transparent background, the object filling the image edge to edge (the image IS the object, 0.82:1): a hemispherical dome of warm antique brass (#9B7A3C) with fine engraved meridian lines and a few rows of tiny rivets, sitting on a short round drum of the same brass with a delicate engraved band of stars and a slim gold-leaf moulding. A vertical slit runs down the middle of the dome from its top to about two thirds of the object's height: the slit opening is about 22% of the image width, centred, its top at about 4% and its bottom at about 66% of the image height, and the whole opening is filled with flat pure green #00FF00 (no texture, no shading, straight vertical edges, nothing in front of it). Soft moonlight from the top-left, gentle highlights on the brass, the drum's base sitting on the bottom edge. No telescope sticking out, no stand, no stars outside the brass, no cast shadow, no background. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: nesne tuvali dolduruyor (0,82:1); yarık düz `#00FF00`, ortada, ~%22 geniş, ~%4–%66 yüksek; teleskop/zemin yok; gerçek alfa.

#### 179. W2.4 Yarık kapağı (iki yarıya kesilir)

- İndirme adı: `29-celestial-observatory__shutter.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/shutter.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 480×1360 px (6:17) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: dome.png (listede #178)

```
The closed slit shutter of the same brass observatory dome as dome.png, alone, seen straight from the front, on a fully transparent background: a tall narrow vertical panel of the same warm antique brass, filling the image edge to edge (about 0.35:1), slightly curved like part of the dome, with a fine vertical centre seam where its two halves meet, a few small rivets along both long edges, delicate engraved horizontal lines, a slim gold-leaf edge. Soft moonlight from the top-left. No hinge, no handle, no shadow outside the panel. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek dikey panel; ortada ince birleşme çizgisi; kubbeyle aynı pirinç; alfa.

#### 180. W2.5 Yıldız parıltıları (yanan yıldızlar + takımyıldız) — üç ayrı dosya

- İndirme adı: `29-celestial-observatory__star_1.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/star_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (star_1, star_2, star_3). Make ONLY ONE image now: star_1 (number 1 of 3).

A single small star as on an antique engraved star atlas, alone, on a fully transparent background: a tiny bright silver-white core with fine engraved rays — not a cartoon star, not a five-pointed shape — a soft, delicate glint with a hint of warm gold at its centre, filling about 45% of the square. Centered, not cropped. No glow beyond the rays, no halo ring, no other star. No text. True transparent background PNG (real alpha channel). (Make three different stars: 1 = four long fine rays, 2 = six short rays, 3 = a small round glint with tiny rays.)
```

Kontrol: tek yıldız; üç dosya farklı; beş köşeli/çizgi film değil; gerçek alfa.

#### 181. W2.5 Yıldız parıltıları (yanan yıldızlar + takımyıldız) — üç ayrı dosya

- İndirme adı: `29-celestial-observatory__star_2.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/star_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (star_1, star_2, star_3). Make ONLY ONE image now: star_2 (number 2 of 3).

A single small star as on an antique engraved star atlas, alone, on a fully transparent background: a tiny bright silver-white core with fine engraved rays — not a cartoon star, not a five-pointed shape — a soft, delicate glint with a hint of warm gold at its centre, filling about 45% of the square. Centered, not cropped. No glow beyond the rays, no halo ring, no other star. No text. True transparent background PNG (real alpha channel). (Make three different stars: 1 = four long fine rays, 2 = six short rays, 3 = a small round glint with tiny rays.)
```

Kontrol: tek yıldız; üç dosya farklı; beş köşeli/çizgi film değil; gerçek alfa.

#### 182. W2.5 Yıldız parıltıları (yanan yıldızlar + takımyıldız) — üç ayrı dosya

- İndirme adı: `29-celestial-observatory__star_3.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/star_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (star_1, star_2, star_3). Make ONLY ONE image now: star_3 (number 3 of 3).

A single small star as on an antique engraved star atlas, alone, on a fully transparent background: a tiny bright silver-white core with fine engraved rays — not a cartoon star, not a five-pointed shape — a soft, delicate glint with a hint of warm gold at its centre, filling about 45% of the square. Centered, not cropped. No glow beyond the rays, no halo ring, no other star. No text. True transparent background PNG (real alpha channel). (Make three different stars: 1 = four long fine rays, 2 = six short rays, 3 = a small round glint with tiny rays.)
```

Kontrol: tek yıldız; üç dosya farklı; beş köşeli/çizgi film değil; gerçek alfa.

#### 183. W2.6 Gravür yıldız haritası (dönen gök)

- İndirme adı: `29-celestial-observatory__star_chart.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/star_chart.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1600 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A large circular celestial chart in the manner of an 18th-century copperplate star atlas, on a fully transparent background, filling about 92% of the square: fine silver engraved lines on transparency — concentric circles of declination, radiating hour lines, a softly drawn ecliptic band, and a few classical constellation figures (a swan, a lyre, a hunter, a bear) drawn only as delicate engraved outlines, with tiny star dots; a few thin gold-leaf accents on the outer circle. The lines are thin and pale (silver #C9CFDC, gold #C8A24E) so the chart reads as a faint pattern over a dark sky. No filled areas, no background colour, no paper. No text, letters, numbers, zodiac glyphs or constellation names. True transparent background PNG (real alpha channel).
```

Kontrol: daire; ince gümüş/altın çizgiler; dolgu/zemin yok; yazı/glif yok; alfa.

#### 184. W2.7 Planisfer halkası (yuvarlak foto çerçevesi)

- İndirme adı: `29-celestial-observatory__planisphere_ring.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/planisphere_ring.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1200 px (1:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
The brass rim of an antique planisphere (rotating star finder), seen straight on, on a fully transparent background, filling the image edge to edge: a flat ring of warm antique brass about 13% of the image width thick, engraved with fine evenly spaced tick marks (no numbers), a slim inner bead and a slim outer gold-leaf edge, four tiny decorative star studs at the quarters. The round opening in the middle is a perfect circle 74% of the image width across, centred, filled with flat pure green #00FF00 (no texture, no shading). Soft moonlight from the top-left. No text, letters, numbers, month names or zodiac glyphs. True transparent background PNG (real alpha channel).
```

Kontrol: tam daire pencere, düz `#00FF00`, %74; işaretler sayısız; yazı yok; alfa.

#### 185. W2.8 Pirinç usturlap (imza süsü)

- İndirme adı: `29-celestial-observatory__astrolabe.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/astrolabe.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1000 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
An antique brass astrolabe seen straight on, on a fully transparent background, filling about 90% of the square: the round mater with a fine engraved tick ring (no numbers), an openwork rete of elegant curved brass tracery with small pointed star pointers, a slim alidade across it, a small hanging ring at the top; warm antique brass with gold-leaf highlights, soft moonlight from the top-left. No text, letters, numbers, Arabic or Latin inscriptions, zodiac glyphs. No shadow, no background. True transparent background PNG (real alpha channel).
```

Kontrol: tek usturlap; yazı/rakam yok; alfa.

#### 186. W2.9 Ay evreleri (başlık altı ayırıcı)

- İndirme adı: `29-celestial-observatory__moon_phases.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/moon_phases.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×260 px (6.154:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single horizontal row of seven small moon phases in fine silver engraving with a touch of gold leaf, on a fully transparent background: from left to right waxing crescent, first quarter, waxing gibbous, full moon (slightly larger, in the centre), waning gibbous, last quarter, waning crescent, evenly spaced, each moon a delicately engraved disc (the dark part only fine hatching, never solid black). Centered, not cropped, generous empty margin. No line connecting them, no stars, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: yedi evre tek satırda, dolunay ortada; koyu kısım tarama (siyah dolgu değil); alfa.

#### 187. W2.10 Gezegen yörüngeleri (home kartının arkası)

- İndirme adı: `29-celestial-observatory__orbits.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/orbits.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1600 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
An engraved orrery diagram on a fully transparent background, filling about 95% of the square: five or six concentric slightly elliptical orbits drawn as fine silver engraved lines, a small gold-leaf sun at the centre, and on each orbit one tiny engraved planet (one with a delicate ring), placed at different angles. Thin, pale, airy lines (silver #C9CFDC, gold #C8A24E) — a faint pattern over a dark sky. No background, no stars between the orbits, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: ince eşmerkezli yörüngeler; ortada küçük altın güneş; dolgu/yazı yok; alfa.

#### 188. W2.11 Yarıktan yükselen kart (boş, yuvarlak foto penceresi)

- İndirme adı: `29-celestial-observatory__card_small.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1008×1400 px (18:25) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: chart_paper.png (listede #177)

```
A flat vertical invitation card of the same silver-ivory paper as chart_paper.png, exactly 0.72:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine engraved silver border line inset from the edge and tiny engraved stars at its four corners, a very soft contact shade on the card itself. In its upper part a round portrait window, a perfect circle 62% of the card's width across, horizontally centred, its top edge at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: daire pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 189. W2.12 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `29-celestial-observatory__web_hero.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: dome.png (listede #178), astrolabe.png (listede #185), chart_paper.png (listede #177), night_sky.png (listede #176)

```
Wide horizontal still life, photorealistic, soft moonlight from the top-left: the small brass observatory of dome.png standing slightly below the centre on a midnight-blue velvet surface, its slit shutter half open with a sliver of starry sky inside, a brass astrolabe (as astrolabe.png) lying at the left, a rolled antique star chart and a silver-ivory card (as chart_paper.png, blank) at the right; a deep midnight sky with fine pin-point stars above (as night_sky.png). The top 20% of the image is calm, empty sky. This image is cropped to 1200×630 for link previews: keep the whole observatory visible with at least 5% empty margin below it. No people, no text, letters, numbers or symbols, no logos.
```

Kontrol: gözlemevi bütün ve altta boşluklu; üst %20 boş gök; yazı yok.

#### 190. 2.1 Ana portre

- İndirme adı: `29-celestial-observatory__photos__hero_portrait.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG

```
Square 1:1 wedding portrait of the fictional couple Celeste and Rowan, in their early thirties (Celeste: long loose auburn waves, fair skin with light freckles, a slim gold ring; Rowan: short dark-blond hair, a light stubble, olive skin; they must not resemble any real person or celebrity) at blue hour on a high desert ridge: she in a simple silver-ivory satin gown, he in a midnight-blue suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, the first stars appearing in a deep blue sky behind them and a small white observatory dome softly out of focus far away. Photorealistic, calm midnight, silver and gold palette, subtle grain. No text, no frame.
```

#### 191. 2.2 Story 1 — "A shared telescope"

- İndirme adı: `29-celestial-observatory__photos__story_1.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #190)

```
Square 1:1 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) at night beside a small brass telescope on a tripod on a wooden deck, she looking through the eyepiece and laughing, he leaning in beside her pointing at the sky, a soft warm lantern light on their faces, a starry sky above. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 192. 2.3 Story 2 — "Night by the lake"

- İndirme adı: `29-celestial-observatory__photos__story_2.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #190)

```
Square 1:1: the same couple as hero_portrait.jpg sitting close together on a wool blanket at the edge of a still mountain lake at night, seen from slightly behind and to the side, her head on his shoulder, the Milky Way softly reflected in the water, pine silhouettes. Photorealistic, same palette and grain. No text.
```

#### 193. 2.4 Story 3 — "Under the dome"

- İndirme adı: `29-celestial-observatory__photos__story_3.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #190)

```
Square 1:1 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on the brass rail of an old observatory telescope inside a wooden dome, a sliver of night sky through the open slit behind, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 194. 2.5 Mekân

- İndirme adı: `29-celestial-observatory__photos__venue.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant garden on a pine-covered ridge at dusk with a small white historic observatory dome at one side, a lawn with a few rows of simple white chairs set for a ceremony facing a wide view of distant mountains, strings of warm small lights, the first stars in a deep blue sky. No people, no signs, no text. Photorealistic, same palette.
```

#### 195. 3.1 Kapak — elde telefon

- İndirme adı: `29-celestial-observatory__mockups__cover_hand.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a midnight blue velvet cloth over an antique wooden desk and a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 196. 3.2 Üç telefon — sayfalar

- İndirme adı: `29-celestial-observatory__mockups__three_phones.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a midnight blue velvet cloth over an antique wooden desk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 197. 3.3 Dizüstü + telefon

- İndirme adı: `29-celestial-observatory__mockups__laptop_phone.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a midnight blue velvet cloth over an antique wooden desk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 198. 3.4 Masa üstü — yukarıdan

- İndirme adı: `29-celestial-observatory__mockups__flatlay_phone.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a midnight blue velvet cloth over an antique wooden desk, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 199. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `29-celestial-observatory__mockups__hand_phone_edit.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a midnight blue velvet sofa with a silver cushion and a ceramic coffee cup; a small arrangement of a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 200. P1 — Ön yüz

- İndirme adı: `29-celestial-observatory__print__invitation_front_5x7.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: chart_paper.png (listede #177), night_sky.png (listede #176), star_chart.png (listede #183), moon_phases.png (listede #186)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the silver-ivory paper of chart_paper.png. Along the top edge a band of the midnight sky of night_sky.png about 13% of the height, with fine pin-point stars and, inside the band, a delicate engraved arc of the star chart (as star_chart.png) and a small row of seven moon phases (as moon_phases.png) centred in it; its lower edge is a slim gold-leaf rule (staying above 15% of the height). Along the bottom edge a matching midnight band about 10% of the height with a slim gold-leaf rule on its upper edge (staying below 87%). The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no star, no line, no shadow, no stain in it. No text, letters, numbers, zodiac glyphs, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı yok; gök bantları yalnız üstte ve altta.

#### 201. P2 — Arka yüz

- İndirme adı: `29-celestial-observatory__print__invitation_back_5x7.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same silver-ivory paper, only a narrow midnight sky band along the top edge (about 7% of the height, with fine pin-point stars and a slim gold-leaf rule on its lower edge, staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no star, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar gök bandı (%10'un üstünde); %14'ün altı boş; yazı yok.

### 30_Azulejo_Mosaic

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms, logos, signatures or watermarks in any image.** Give W2.1 `azulejo_1.png` as the style reference of every later tile and part: the same cobalt blue, the same white tin glaze, the same hand-painted brushwork.
```

#### 202. W2.1 Alan çinisi 1 (çeyrek madalyon)

- İndirme adı: `30-azulejo-mosaic__azulejo_1.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
One single square Portuguese-style azulejo tile, seen perfectly flat from above, filling the whole square edge to edge (the tile IS the image: no grout, no border of background, no shadow, no table): white tin glaze (#FAF8F2) hand-painted in cobalt blue (#1F4A9E) with lighter blue washes, a classic 18th-century pattern. The motif is a QUARTER of a large medallion: the medallion's centre sits exactly in the top-left corner of the tile, with curling acanthus leaves and a small flower bud spreading from that corner towards the middle, and a quarter rosette at the opposite (bottom-right) corner, so that four copies of this tile rotated 0°, 90°, 180° and 270° around a shared corner form one complete large medallion. Small terracotta-orange (#AE583A) accents only on two or three dots. Real glaze: a soft even sheen, faint crazing, slightly uneven hand-painted brush edges. Evenly lit from the top-left, no vignette. No text, letters, numbers or symbols.
```

Kontrol: tam kare, kenardan kenara; köşe merkezli çeyrek madalyon (4 kopya döndürülünce madalyon kapanıyor); kobalt +

#### 203. W2.2 Bordür çinisi

- İndirme adı: `30-azulejo-mosaic__azulejo_2.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG
- Ek görsel: azulejo_1.png (listede #202)

```
One single square border tile in the same azulejo set as azulejo_1.png (same white tin glaze, same cobalt blue, same brushwork), seen perfectly flat from above, filling the whole square edge to edge: a classic running border motif — a flowing cobalt scroll of leaves and small flowers that runs horizontally from the left edge to the right edge and meets itself seamlessly when two copies are placed side by side; a narrow solid cobalt band along the TOP edge only (the outer edge of a panel), the bottom part lighter and airier. Evenly lit from the top-left, no grout, no shadow, no vignette. No text, letters, numbers or symbols.
```

Kontrol: sol ve sağ kenar yan yana dikişsiz; koyu kobalt bant yalnız üst kenarda (panelin dış kenarı); W2.1 ile aynı set.

#### 204. W2.3 Köşe çinisi

- İndirme adı: `30-azulejo-mosaic__azulejo_3.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG
- Ek görsel: azulejo_1.png (listede #202), azulejo_2.png (listede #203)

```
One single square corner tile in the same azulejo set as azulejo_1.png and azulejo_2.png, seen perfectly flat from above, filling the whole square edge to edge: the solid cobalt band of the border tile turns the corner along the TOP edge and the LEFT edge (an L, meeting at the top-left corner), and inside it a small cobalt rosette with four leaves pointing to the corners; where the bands leave the tile on the right and at the bottom they must line up with the band of azulejo_2.png. Same white tin glaze, cobalt blue and brushwork. Evenly lit from the top-left, no grout, no shadow. No text, letters, numbers or symbols.
```

Kontrol: kobalt bant üst ve sol kenarda L; sağ ve altta W2.2 bandıyla aynı hizada biter; ortada rozet.

#### 205. W2.4 Alan çinisi 2 (çeyrek madalyon, eşi)

- İndirme adı: `30-azulejo-mosaic__azulejo_4.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_4.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG
- Ek görsel: azulejo_1.png (listede #202)

```
A second field tile for the same azulejo set as azulejo_1.png, seen perfectly flat from above, filling the whole square edge to edge: also a quarter-medallion design with its centre in the top-left corner (four copies rotated around a corner form one medallion), but a different motif — a quarter of a large eight-petal flower with cobalt petals and fine blue tendrils, and a small quarter star at the bottom-right corner. Where it touches azulejo_1.png on any side the cobalt lines should flow on naturally. Same white tin glaze, cobalt blue and brushwork, two or three tiny terracotta-orange (#AE583A) dots. Evenly lit from the top-left, no grout, no shadow. No text, letters, numbers or symbols.
```

Kontrol: W2.1'den farklı ama aynı set; çeyrek madalyon; yan yana gelince çizgiler akıyor.

#### 206. W2.5 Çini sırtı (terrakota)

- İndirme adı: `30-azulejo-mosaic__tile_back.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_back.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
The unglazed back of a handmade terracotta tile, seen perfectly flat from above, filling the whole square edge to edge: warm terracotta clay (#AE583A) with natural darker and lighter firing variations, a fine sandy texture, a few small pits and faint finger marks of the maker, slightly paler near the edges. Evenly lit from the top-left, no shadow, no vignette, no glaze, no pattern, no stamp, no text, letters or numbers.
```

Kontrol: düz terrakota, sır yok, desen/damga/yazı yok; kenardan kenara.

#### 207. W2.6 Kobalt duvar (açılış sayfası + koyu bantlar)

- İndirme adı: `30-azulejo-mosaic__cobalt_wall.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/cobalt_wall.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of a lime-plastered wall washed in deep night-cobalt blue (#102554): soft uneven limewash, gentle brush strokes and faint mottling a little lighter than the base, a fine matte plaster grain; calm enough for white text to read on it everywhere. Evenly lit, no shadow, no vignette, no crack, no tile, no object, no pattern. The left/right and top/bottom edges must tile without a visible seam. No text, letters or symbols.
```

Kontrol: dikişsiz (2×2 konunca ek yeri yok); koyu kobalt; sakin (beyaz yazı her yerde okunur); desen yok.

#### 208. W2.7 Badana sıva (açık sayfalar)

- İndirme adı: `30-azulejo-mosaic__lime_wash.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/lime_wash.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of a sunlit whitewashed lime plaster wall in warm white (#F2EDE3): very soft uneven brush strokes of limewash, a fine chalky grain, the faintest warm patches; calm enough for dark blue text to read on it everywhere. Evenly lit, no shadow, no vignette, no crack, no stain, no object, no pattern. Edges tile without a seam. No text, letters or symbols.
```

Kontrol: sakin, sıcak beyaz; dikişsiz; leke/çatlak yok.

#### 209. W2.8 Kart kâğıdı (çinilerin arkasındaki kart, program ve yanıt kartı)

- İndirme adı: `30-azulejo-mosaic__card_paper.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/card_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of heavy cotton invitation paper in glaze white (#FAF8F2): a soft felt grain, a very gentle cool-warm unevenness, calm enough for dark text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no deckle, no stain, no pattern. Edges tile without a seam. No text, letters or symbols.
```

Kontrol: sakin, beyaz; dikişsiz.

#### 210. W2.9 Çini frizi (bölüm ayracı)

- İndirme adı: `30-azulejo-mosaic__frieze.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/frieze.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 2048×512 px (4:1) · opak · PNG
- Ek görsel: azulejo_2.png (listede #203)

```
A straight horizontal row of exactly four square azulejo border tiles from the same set as azulejo_2.png, seen perfectly flat, filling the 4:1 image edge to edge: the tiles touch with only a hair-thin natural joint, the cobalt scroll runs continuously through all four, a narrow solid cobalt band along the top and along the bottom edge, white tin glaze, cobalt blue brushwork. The left edge must join the right edge seamlessly when the row is repeated. Evenly lit, no shadow, no background. No text, letters, numbers or symbols.
```

Kontrol: 4:1, dört kare çini; sol–sağ kenar tekrar edince dikişsiz; üst ve altta kobalt bant.

#### 211. W2.10 Terrakota saksılar (açılış duvarının ve home kartının dibinde) — iki dosya

- İndirme adı: `30-azulejo-mosaic__pot_left.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/pot_left.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1280 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 2 separate images (pot_left, pot_right). Make ONLY ONE image now: pot_left (number 1 of 2).

A single classic terracotta flower pot, photorealistic, seen slightly from the front, standing on nothing, on a fully transparent background: a round hand-thrown pot with a rolled rim in warm terracotta (#AE583A) with natural firing variations, planted with trailing green ivy and small white jasmine flowers that spill over the rim towards the inner side; soft light from the top-left, the pot's own shading only. Centered at the bottom of the image, the pot's base touching the bottom edge, generous empty margin above. No lemons, no citrus, no other fruit, no shadow on the ground, no saucer, no text. True transparent background PNG (real alpha channel — not white, not a checkerboard). (pot_left.png: the ivy spills to the RIGHT; pot_right.png: a second, slightly different pot whose ivy spills to the LEFT.)
```

Kontrol: tek saksı, alfa; limon/meyve yok; zemin gölgesi yok; sarmaşık iç tarafa sarkıyor; taban alt kenarda.

#### 212. W2.10 Terrakota saksılar (açılış duvarının ve home kartının dibinde) — iki dosya

- İndirme adı: `30-azulejo-mosaic__pot_right.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/pot_right.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1280 px (4:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: pot_left.png (listede #211)

```
This prompt describes a set of 2 separate images (pot_left, pot_right). Make ONLY ONE image now: pot_right (number 2 of 2).

A single classic terracotta flower pot, photorealistic, seen slightly from the front, standing on nothing, on a fully transparent background: a round hand-thrown pot with a rolled rim in warm terracotta (#AE583A) with natural firing variations, planted with trailing green ivy and small white jasmine flowers that spill over the rim towards the inner side; soft light from the top-left, the pot's own shading only. Centered at the bottom of the image, the pot's base touching the bottom edge, generous empty margin above. No lemons, no citrus, no other fruit, no shadow on the ground, no saucer, no text. True transparent background PNG (real alpha channel — not white, not a checkerboard). (pot_left.png: the ivy spills to the RIGHT; pot_right.png: a second, slightly different pot whose ivy spills to the LEFT.)
```

Kontrol: tek saksı, alfa; limon/meyve yok; zemin gölgesi yok; sarmaşık iç tarafa sarkıyor; taban alt kenarda.

#### 213. W2.11 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `30-azulejo-mosaic__web_hero.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: azulejo_1.png (listede #202), azulejo_4.png (listede #205), cobalt_wall.png (listede #207), tile_back.png (listede #206), pot_left.png (listede #211)

```
Wide horizontal photorealistic still life, soft light from the top-left: a panel of blue-and-white azulejo tiles (the set of azulejo_1.png to azulejo_4.png: corner tiles, a border all round, quarter-medallion field tiles) set into a deep cobalt limewashed wall (as cobalt_wall.png), slightly below the centre; two or three tiles near one corner are half-turned in mid-air showing their terracotta backs (as tile_back.png); a terracotta pot with trailing ivy and white jasmine (as pot_left.png) standing at the lower left. The top 20% of the image is calm, empty wall. This image is cropped to 1200×630 for link previews: keep the whole tile panel visible with at least 5% empty margin below it. No people, no lemons, no text, letters or numbers.
```

Kontrol: panel bütün ve altta boşluklu; üst %20 boş; limon/yazı yok.

#### 214. 2.1 Ana portre

- İndirme adı: `30-azulejo-mosaic__photos__hero_portrait.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Inês and Mateo, in their early thirties (Inês: long dark-brown wavy hair worn half up, olive skin, brown eyes, a slim gold ring; Mateo: short dark hair, a neat trimmed beard, light-tan skin; they must not resemble any real person or celebrity) in a sunlit courtyard: she in a simple ivory crepe gown, he in a navy-blue suit, standing close and smiling at each other in front of a wall of blue-and-white hand-painted tiles, terracotta pots with trailing ivy beside them, three-quarter length, faces in the upper third, soft late-afternoon light from the left. Photorealistic, calm cobalt, white and terracotta palette, subtle grain. No text, no frame.
```

#### 215. 2.2 Story 1 — "A rainy afternoon"

- İndirme adı: `30-azulejo-mosaic__photos__story_1.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #214)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing at a small table by the window of a cosy café on a rainy afternoon, two coffee cups, raindrops on the glass, blue-and-white tiles on the café wall softly out of focus, warm light inside. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 216. 2.3 Story 2 — "The tram up the hill"

- İndirme adı: `30-azulejo-mosaic__photos__story_2.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1024 px (5:4) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #214)

```
Landscape 5:4: the same couple as hero_portrait.jpg on a steep old cobbled street of a hilly seaside town at golden hour, walking up hand in hand beside a vintage yellow tram (no numbers, no lettering on it), whitewashed houses with tiled façades and terracotta roofs behind, the sea far below. Seen from slightly behind and to the side. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 217. 2.4 Story 3 — "Our promise"

- İndirme adı: `30-azulejo-mosaic__photos__story_3.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #214)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on a sunlit stone balustrade with a blue-and-white tile set into it and the sea softly out of focus behind, soft light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 218. 2.5 Mekân

- İndirme adı: `30-azulejo-mosaic__photos__venue.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant old Portuguese country estate (a fictional quinta) in early summer: a whitewashed courtyard with blue-and-white tile panels on its walls, a stone arcade, terracotta pots with ivy and white jasmine, a long table set for dinner under string lights, wooded hills behind, soft late-afternoon light. No people, no signs, no text. Photorealistic, same palette.
```

#### 219. 3.1 Kapak — elde telefon

- İndirme adı: `30-azulejo-mosaic__mockups__cover_hand.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a sunlit whitewashed table with an edge of terracotta tiles and a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 220. 3.2 Üç telefon — sayfalar

- İndirme adı: `30-azulejo-mosaic__mockups__three_phones.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a sunlit whitewashed table with an edge of terracotta tiles, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 221. 3.3 Dizüstü + telefon

- İndirme adı: `30-azulejo-mosaic__mockups__laptop_phone.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a sunlit whitewashed table with an edge of terracotta tiles, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 222. 3.4 Masa üstü — yukarıdan

- İndirme adı: `30-azulejo-mosaic__mockups__flatlay_phone.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a sunlit whitewashed table with an edge of terracotta tiles, slightly right of center and rotated about 8 degrees, surrounded at the edges by a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 223. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `30-azulejo-mosaic__mockups__hand_phone_edit.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a whitewashed bench with cobalt-and-white cushions and a terracotta cup; a small arrangement of a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 224. P1 — Ön yüz

- İndirme adı: `30-azulejo-mosaic__print__invitation_front.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5, 300 ppi) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: card_paper.png (listede #209), azulejo_1.png (listede #202), azulejo_4.png (listede #205)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is heavy glaze-white cotton paper (as card_paper.png). Along the top edge a single row of seven small square blue-and-white azulejo tiles from the set of azulejo_1.png to azulejo_4.png (a corner tile at each end, border tiles beside them, field tiles in the middle), the row centred, spanning from 10% to 90% of the width, between 3% and 12% of the height; the same row along the bottom edge between 88% and 97% of the height, turned upside down; two or three tiny cobalt brush dots near each row only. The rectangle from 15% to 85% of the height and from 9% to 91% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no tile, no dot, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819×2551 px.
```

Kontrol: tam taşma; üst ve alt çini sırası tarif edilen bantta; %15–%85 × %9–%91 tamamen boş; yazı yok.

#### 225. P2 — Arka yüz

- İndirme adı: `30-azulejo-mosaic__print__invitation_back.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5, 300 ppi) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same glaze-white cotton paper, only a single row of seven small blue-and-white azulejo tiles along the top edge (centred, from 10% to 90% of the width, between 3% and 12% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no tile, no dot, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819×2551 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte çini sırası (%12'nin üstünde); %14'ün altı boş; yazı yok.

### 31_Sky_Lantern_Festival

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos of the fictional couple), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms, signatures or watermarks in any image. Make W2.2 `lantern_dark.png` first and give it as the style reference of every later part: the same rice paper, the same soft watercolor, the same dusk palette, the same warm light.
```

#### 226. W2.1 Avuçlar (fenersiz)

- İndirme adı: `31-sky-lantern-festival__hands.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/hands.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
Two gently cupped hands seen from the front and slightly below, held together and raised as if offering something up to the sky, alone on a transparent background, soft watercolor illustration: graceful, elegant hands in warm backlight, painted in soft muted rose-beige and violet shadow tones so that they read as anyone's hands (no rings, no nail polish, no sleeves beyond the wrists, no jewellery), the fingertips and the inner palms lit warm amber from above as if by a glowing lantern. The hands sit in the lower part of the image: from 14% to 86% of the image width and from 58% of the image height down to the bottom edge (the wrists leave the image at the bottom edge). The space ABOVE the cupped fingers — from 27% to 67% of the image height, from 31% to 69% of the width — is EMPTY and transparent: a paper lantern will sit there, its lowest part resting in the cup of the fingers. Front view, symmetrical, not cropped at the sides. No lantern, no object in the hands, no cast shadow, no glow or halo outside the hands' outline. No text. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: avuçlar alt kenardan giriyor, x %14–86, üstü %58; fenerin yeri boş; yüzük/oje/takı yok; ten tonu yumuşak, ışığa

#### 227. W2.2 Sönük kâğıt fener

- İndirme adı: `31-sky-lantern-festival__lantern_dark.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_dark.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: hands.png (listede #226)

```
A single paper sky lantern, unlit, alone on a transparent background, soft watercolor with delicate rice-paper texture: a tall, softly rounded lantern of ivory rice paper (#F7EEDD) gently tinted dusky rose and violet by the evening light, slightly wider at the top than at the open bottom, with a fine, barely visible bamboo frame and a thin bamboo ring at the open bottom. It is placed exactly where the hands of hands.png will hold it: from 31% to 69% of the image width and from 27% to 67% of the image height (its centre at 47% of the height). Elegant and simple — no pattern, no symbols, no tassels, no writing on the paper. Front view, perfectly straight and symmetrical, not cropped. No hands, no flame visible, no cast shadow, no glow or halo outside its outline. No text. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: tek fener, x %31–69, y %27–67; desen/yazı/püskül yok; sönük (iç ışık yok); gölge/hâle yok; alfa. (Stil referansı:

#### 228. W2.3 Yanan kâğıt fener (aynı fener, içeriden ışıyor)

- İndirme adı: `31-sky-lantern-festival__lantern_lit.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_lit.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: lantern_dark.png (listede #227)

```
The same paper sky lantern as lantern_dark.png (give it as the reference image), on exactly the same canvas position and with exactly the same outline (from 31% to 69% of the image width, from 27% to 67% of the image height), now lit from inside by a small warm flame near its open bottom: the rice paper glows warm amber and honey gold (#F2A65A to #FFD08A), brightest in the lower middle and softer toward the top, the fine bamboo frame showing as slightly darker lines through the glowing paper. The glow stays INSIDE the lantern's outline — no halo, no light rays, no glow on the transparent background (the website adds the halo). No hands, no cast shadow. No text. True transparent background PNG.
```

Kontrol: hattı W2.2 ile birebir aynı (üst üste konunca kaymıyor); ışık yalnız kâğıdın içinde; dışarıda hâle yok; alfa.

#### 229. W2.4 Alacakaranlık göğü (açılış sayfası ve ana sayfanın ilk ekranı)

- İndirme adı: `31-sky-lantern-festival__sky_dusk.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/sky_dusk.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
A vertical phone-screen background: a dusk sky painted in soft wet-on-wet watercolor that fills the whole canvas — deep violet (#2B1F45) at the top, melting through soft violet and dusky rose (#E7B4A6) in the middle to a warm amber glow (#F2A65A) along the horizon at the very bottom, with a few long, soft, translucent clouds lit rose and gold from below, and the faintest first stars near the top. A low, calm line of distant hills in soft violet silhouette along the bottom 8% only. No lanterns, no people, no buildings, no moon, no text. The whole central area stays calm and open (names and an invitation card are placed over it). Soft, romantic, luminous.
```

Kontrol: üst mor → orta pembe → alt kehribar; orta sakin; fener/kişi/yazı yok; tepeler yalnız en alt bantta. (Yeri: açılış

#### 230. W2.5 Yıldız tozu (paralaks katmanı)

- İndirme adı: `31-sky-lantern-festival__star_dust.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/star_dust.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1920 px (9:16) · şeffaf zemin (gerçek alfa) · PNG

```
A transparent overlay of scattered star dust for a dusk sky: many tiny soft pinpoints of warm white and pale gold light of different sizes, a few slightly larger soft sparkles, denser in the upper third of the image and fading out toward the bottom, with a gentle sweep of fine glittering dust crossing diagonally from the upper left. Painted softly, like flecks of white gouache flicked onto watercolor. Nothing else — no sky color, no clouds, no lanterns, no moon, no text. Most of the image stays empty and transparent. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız ince yıldız noktaları; zemin şeffaf; üstte yoğun, altta seyrek; yazı yok. (Yeri: gök katmanının önünde; açılışta

#### 231. W2.6 Uzaktaki küçük fener

- İndirme adı: `31-sky-lantern-festival__lantern_far.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_far.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: lantern_lit.png (listede #228)

```
One small, distant paper sky lantern, lit and glowing warm amber from inside, alone on a transparent background, in the same watercolor and rice-paper style as lantern_lit.png: the same simple softly rounded shape, about two thirds as wide as it is tall (2:3), centred, filling about 60% of the image height. The glow stays inside its outline (no halo, no rays). No text. True transparent background PNG.
```

Kontrol: tek fener, oran ~2:3, ortalı; hâle yok; alfa. (Yeri: açılışta yükselen üç uzak fener, ana sayfada kaydırdıkça

#### 232. W2.7 Fenerin ışığında beliren küçük davet kartı (boş)

- İndirme adı: `31-sky-lantern-festival__card_small.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A small portrait invitation card, alone: thick warm ivory rice paper (#F7EEDD) with visible soft fibres and a gently deckled edge, about 0.7 as wide as it is tall, with a very faint wash of dusky rose and amber light along its upper edge, as if lit by a lantern above it. In its upper half, horizontally centred, a portrait photo window about 4:5 with softly rounded corners, about half as wide as the card, its top about 8% of the card's height below the card's top edge, filled with flat pure green #00FF00 (no texture, no shading, crisp outline). Everything below the window — at least the lower 42% of the card — is blank, even ivory paper (no text, no ornament: names and date are added there by the website). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: pencere düz #00FF00, kartın üst yarısında ortalı; pencerenin altı düz kâğıt; kenar yumuşak tırtıklı; alfa. (Claude:

#### 233. W2.8 Döşenebilir sayfa zemini

- İndirme adı: `31-sky-lantern-festival__bg_tile.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/bg_tile.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable texture of a deep evening sky in soft watercolor: dusk violet to deep night violet (#1B1430 to #3A2A5C), gentle wet-on-wet blooms and a fine paper grain, evenly lit with no vignette, no light spot, no stars, no clouds with hard edges and no pattern that shows when the tile repeats. Edges must match perfectly left-right and top-bottom. No text, no objects.
```

Kontrol: 2×2 yan yana konunca dikiş görünmüyor; ışık lekesi yok; açık renk yazı üstünde okunuyor.

#### 234. W2.9 Pirinç kâğıdı paspartu (story fotoğrafları)

- İndirme adı: `31-sky-lantern-festival__frame_paper.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/frame_paper.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A soft rice-paper photo mat, alone: a portrait sheet of ivory rice paper (#F7EEDD) with visible fibres and gently deckled edges, about 2:3 overall, its inside lit faintly amber from below as if a lantern were rising beneath it. A portrait window exactly 3:4, centred, about 72% of the mat's width, filled with flat pure green #00FF00 (no texture, no shading, crisp straight edges). Front view, perfectly straight, centered and not cropped, with generous empty margin. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```

Kontrol: pencere 3:4 düz #00FF00; kâğıt kenarı ince; alfa. (Claude pencereyi şeffaf yapar ve ölçer; story ve home'daki üç

#### 235. W2.10 Yatay çerçeve (mekân fotoğrafı)

- İndirme adı: `31-sky-lantern-festival__frame_landscape.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/frame_landscape.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: frame_paper.png (listede #234)

```
A wide rice-paper photo mat in the same style as frame_paper.png, alone: a slim ivory rice-paper border with gently deckled outer edges, its opening exactly 16:9 and filled with flat pure green #00FF00 (no texture, no shading). Front view, perfectly straight, centered, not cropped, generous margin. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```

Kontrol: pencere 16:9 düz #00FF00; kenar ince; alfa. (Yeri: details'te mekân fotoğrafının paspartusu.)

#### 236. W2.11 Ayırıcı — yıldız tozu izi

- İndirme adı: `31-sky-lantern-festival__divider.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/divider.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×512 px (3:1) · şeffaf zemin (gerçek alfa) · PNG

```
A slim horizontal ornament, alone: a gentle trail of warm gold star dust drifting from left to right, with three tiny glowing paper lanterns rising along it at different heights (the middle one slightly larger), about 10 times wider than tall, centred, soft watercolor and gouache flecks. No shadow, no halo, no text. True transparent background PNG.
```

Kontrol: ince, yatay, ortalı; üç küçük fener; alfa. (Yeri: home davetinde isimlerle tarih arasında, details başlığının altında.)

#### 237. W2.12 Paylaşım görseli kaynağı

- İndirme adı: `31-sky-lantern-festival__web_hero.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: sky_dusk.png (listede #229), lantern_lit.png (listede #228), hands.png (listede #226)

```
A wide scene for a link-preview image in the same watercolor style and palette: the dusk sky of sky_dusk.png (deep violet above, dusky rose, an amber horizon over low violet hills), the lit paper lantern of lantern_lit.png rising in the lower middle of the image just above the gently cupped hands of hands.png that have just let it go, a warm soft glow around the lantern, and five or six small distant lanterns drifting higher at different sizes. The lantern and the hands sit in the lower-middle and are fully visible; the top 20% of the image is calm sky with nothing important. No people other than the hands, no text, no letters.
```

Kontrol: fener ve avuçlar alt-ortada tam görünüyor; üst %20 sakin; yazı yok. (`tema_build.og_kirp(hiza="alt")` →

#### 238. 2.1 Portre (davet kartı ve home)

- İndirme adı: `31-sky-lantern-festival__photos__hero_portrait.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
A warm, natural portrait photograph of a fictional couple in their early thirties (they must not resemble any real person): she has soft wavy light-brown hair below her shoulders and wears a simple ivory chiffon gown, he has short dark-brown hair, a neat short beard and wears a charcoal suit with an open collar. They stand close, foreheads nearly touching, smiling softly, framed from the waist up, on a hilltop terrace at dusk; behind them, softly out of focus, a violet-to-amber sky and a few warm paper lanterns hanging low. Faces in the upper middle of the frame. Photorealistic, natural skin, no heavy retouching. No text, no logo, no watermark.
```

#### 239. 2.2 Story 1 — "Our first evening"

- İndirme adı: `31-sky-lantern-festival__photos__story_1.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) (örnek fotoğraf (PAKET 2))
- Şart: 1152×1536 px (3:4) · opak · JPG

```
The same fictional couple (same faces, hair and clothes styled casually: she in a light summer dress, he in a white linen shirt) laughing together at a small table on a seaside terrace in the early evening, string lights and a soft violet sky behind them, seen from a little distance. Vertical photo, the couple in the middle third. Photorealistic. No text, no watermark.
```

#### 240. 2.3 Story 2 — "A wish in the sky"

- İndirme adı: `31-sky-lantern-festival__photos__story_2.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) (örnek fotoğraf (PAKET 2))
- Şart: 1152×1536 px (3:4) · opak · JPG

```
The same fictional couple standing in a quiet meadow at dusk, holding one glowing white paper lantern together between their hands and looking up at it, their faces lit warm by its glow, a violet sky and a few distant soft lights behind them. Seen at a three-quarter angle. Vertical photo. Photorealistic. Calm and intimate — no crowd, no fire, no smoke. No text, no watermark.
```

#### 241. 2.4 Story 3 — "Yes, at dusk"

- İndirme adı: `31-sky-lantern-festival__photos__story_3.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) (örnek fotoğraf (PAKET 2))
- Şart: 1152×1536 px (3:4) · opak · JPG

```
A close photograph of the same fictional couple's joined hands with a simple gold engagement ring, held up against a soft violet-and-amber dusk sky with a small glowing paper lantern blurred in the background, shallow depth of field. Vertical photo. Photorealistic. No text, no watermark.
```

#### 242. 2.5 Mekân — "The Meadowlark Terrace" (kurgu)

- İndirme adı: `31-sky-lantern-festival__photos__venue.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
A wide photograph of a fictional hilltop garden terrace set for an evening wedding at dusk: long tables with ivory linen and candles, white paper lanterns strung low on thin lines between olive trees, a lawn with rows of white chairs facing an open view of distant hills and the sea under a violet-to-amber sky. It must not reproduce any real, identifiable venue. No people, no text, no signs, no watermark.
```

#### 243. 3.1 Kapak — elde telefon

- İndirme adı: `31-sky-lantern-festival__mockups__cover_hand.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a soft rice-paper cloth on a light wooden table at dusk and glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 244. 3.2 Üç telefon — sayfalar

- İndirme adı: `31-sky-lantern-festival__mockups__three_phones.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a soft rice-paper cloth on a light wooden table at dusk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 245. 3.3 Dizüstü + telefon

- İndirme adı: `31-sky-lantern-festival__mockups__laptop_phone.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a soft rice-paper cloth on a light wooden table at dusk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 246. 3.4 Masa üstü — yukarıdan

- İndirme adı: `31-sky-lantern-festival__mockups__flatlay_phone.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a soft rice-paper cloth on a light wooden table at dusk, slightly right of center and rotated about 8 degrees, surrounded at the edges by glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 247. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `31-sky-lantern-festival__mockups__hand_phone_edit.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on an ivory linen sofa with a dusky rose cushion and a warm glowing paper lantern; a small arrangement of glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 248. 6.1 Ön yüz

- İndirme adı: `31-sky-lantern-festival__print__print_front.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/print/print_front.png`
- Bölüm: PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG

```
A printable wedding invitation ground, front side, portrait, flat and seen straight on, 1819 × 2551 px at 300 ppi (A5 with bleed; it is trimmed later), no text: warm ivory rice paper (#F7EEDD) with soft visible fibres running edge to edge. Decoration ONLY in the top 16% and the bottom 11% of the image: at the top a soft watercolor band of dusk sky (deep violet fading to dusky rose) with three small glowing paper lanterns rising in it, the middle one slightly larger, and a little gold star dust; at the bottom a narrow wash of amber horizon light with a faint line of violet hills. Keep the lanterns and every ornament at least 5% inside the image edges (the washes may reach the edges). The whole central area — from 17% to 88% of the height and from 11% to 89% of the width — is plain, calm, even ivory paper with no ornament, no frame line and no shading, for the names, date and venue. Soft watercolor with glowing light. No text, no letters, no numbers, no monogram.
```

#### 249. 6.2 Arka yüz

- İndirme adı: `31-sky-lantern-festival__print__print_back.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/print/print_back.png`
- Bölüm: PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: print_front.png (listede #248)

```
The matching back of the same invitation (give print_front.png as the reference image), portrait, 1819 × 2551 px at 300 ppi, no text: the same ivory rice paper edge to edge, decorated ONLY in the top 10% of the image — a single narrow watercolor band of the same dusk sky with one small glowing lantern at its centre. Everything else — from 11% to 93% of the height and from 11% to 89% of the width, and the bottom of the sheet — is plain, even ivory paper for the schedule, the details and a QR code. Same style and light. No text, no letters, no numbers.
```

### 32_Music_Box_Ballerina

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the parts below in order and in ONE chat: PAKET 5 (website layers) first, then PAKET 2 (sample photos of the fictional couple), then PAKET 6 (printable invitation backgrounds). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, logos, monograms, price tags or watermarks in any image.** Give W2.3 `box_body.png` as the style and position reference of every later stage part, W2.6 `dancer.png` as the reference of both turn strips, and W2.11 `bg_page.png` as the palette reference of everything else.
```

#### 250. W2.3 Kutunun önü (gövde)

- İndirme adı: `32-music-box-ballerina__box_body.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/box_body.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A luxury music box body seen straight from the front, slightly from above: a rectangular box of glossy rose-quartz lacquer (#EECDD0 with a deeper #D9A7AE shading) with a softly rounded top edge, a fine soft-gold inlay line framing the front panel, a delicate carved relief of small roses in the centre of the front panel (no letters), and four small brass ball feet. The body covers x 112–912 px and y 990–1400 px of a 1024 x 1536 canvas (its top edge at y 990, the feet ending at y 1400), perfectly centred and level. The open top is NOT shown (the inside well and the lid are separate parts): the body ends at its top edge. On its right side, at about y 1190 px, a small brass keyhole plate where the winding key goes in (the key itself is a separate part). Photorealistic lacquer. Soft light from the top-left. No cast shadow and no drop shadow outside the box. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel).
```

Kontrol: x 112–912, y 990–1400; ön yüzde altın şerit ve gül kabartması (harf yok); pirinç ayaklar; sağ yanda anahtar

#### 251. W2.1 Açık kapak — aynalı iç yüz (dik)

- İndirme adı: `32-music-box-ballerina__lid_open.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/lid_open.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: box_body.png (listede #250)

```
The INSIDE of the lid of a luxury rose-quartz lacquered music box, standing upright behind the box as when the box is open, seen straight from the front (give box_body.png as the reference; same canvas, same position): a rectangular lid panel covering x 150–874 px and y 200–905 px of a 1024 x 1536 canvas, lined with smooth blush satin (#F7E4E2) in soft gathered pleats, a thin soft-gold border along its edges, two small brass hinges at its bottom edge (y about 895–905 px). In its centre an oval MIRROR in a delicate soft-gold beaded frame; the mirror glass itself is filled with flat pure green #00FF00 (no reflection, no gradient) exactly inside the oval x 312–712 px, y 290–790 px. Only the lid panel. Front view, no perspective tilt. Soft light from the top-left. No cast shadow and no drop shadow outside the lid. No glow outside its outline. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: x 150–874, y 200–905; oval ayna camı düz #00FF00 (x 312–712, y 290–790); menteşeler alt kenarda; gölge yok;

#### 252. W2.2 Saten kuyu — açık kutunun içi (üst şerit)

- İndirme adı: `32-music-box-ballerina__interior.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/interior.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: box_body.png (listede #250)

```
The open top of the same music box seen from the front and slightly above (give box_body.png as the reference; same canvas and position): only the inside well, a shallow tray lined with tufted blush satin (#F7E4E2) and a deeper rose-quartz satin piping, with a small round soft-gold pedestal in the middle (centred at x 512 px, top at about y 975 px) where a figurine will stand; the well spans x 150–874 px and y 880–1010 px. Empty: no figurine, no lid, no box front. Soft light from the top-left. No cast shadow outside it. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız iç kuyu x 150–874, y 880–1010; ortada küçük altın kaide; figür yok; gerçek alfa.

#### 253. W2.4 Kapalı kapak

- İndirme adı: `32-music-box-ballerina__lid_closed.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/lid_closed.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: box_body.png (listede #250)

```
The CLOSED lid of the same music box (give box_body.png as the reference; same canvas, same front view slightly from above, same position): a slightly domed rose-quartz lacquered lid with a soft-gold edge band, its visible top surface a thin band and its front edge overhanging the body a little; it covers x 100–924 px and y 880–1020 px of the 1024 x 1536 canvas, so that it sits exactly on the top edge of box_body.png. A small carved rose medallion in the middle of the front edge (no letters). Only the lid. Soft light from the top-left. No cast shadow outside the lid. No glow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: x 100–924, y 880–1020; gövdenin üst kenarına tam oturur; harf yok; gölge yok; gerçek alfa.

#### 254. W2.5 Pirinç kurma anahtarı

- İndirme adı: `32-music-box-ballerina__key.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/key.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: box_body.png (listede #250)

```
Only the antique brass WIND-UP KEY of the same music box (give box_body.png as the reference; same canvas and position), seen from the front: its short shaft enters the right side of the box horizontally at about x 900 px, y 1190 px and its butterfly-shaped bow (two rounded wings, an open scroll pattern, no letters) stands upright at the end of the shaft; the whole key covers x 896–1014 px and y 1112–1268 px of the 1024 x 1536 canvas. Polished warm brass (#C9A45C) with soft highlights. Only the key — no box. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız anahtar x 896–1014, y 1112–1268; kanatlar dik; harf yok; gerçek alfa. (Açılışta anahtar kendi yatay

#### 255. W2.6 Balerin — önden duruş (referans + sabit görüntü)

- İndirme adı: `32-music-box-ballerina__dancer.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A miniature porcelain music box ballerina figurine (not a real person; a small porcelain figure with a smooth, simple, doll-like face) standing en pointe on one foot, arms raised in a soft rounded fifth position above her head, wearing a blush-pink satin bodice and a layered pale pink tulle tutu (#F6DEE2) with tiny soft-gold details, her hair in a neat bun. Seen straight from the front, full figure, standing vertically and centred on the canvas, the figure about 85% of the image height, generous empty margin all around, feet at the bottom. No pedestal, no box, no base. Photorealistic glazed porcelain and real tulle. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: porselen figürin (gerçek kişi değil); tam boy, önden; kaide yok; gerçek alfa. (Footer'daki sabit balerin ve

#### 256. W2.7 Balerin dönüşü — kareler 1–4

- İndirme adı: `32-music-box-ballerina__dancer_turn_a.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer_turn_a.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: dancer.png (listede #255)

```
The SAME porcelain ballerina figurine as dancer.png (give it as the reference: same figure, same pose, same tutu, same size, same light from the top-left), shown four times side by side as four frames of one slow turn on the spot, each frame in its own equal column of 384 px width of a 1536 x 1024 canvas, the figure centred in its column, standing on the same baseline (feet at about y 960 px), the same height in every frame (about 88% of the image height): 1) facing the viewer, 2) turned a quarter to her left (three-quarter view, her right shoulder toward the viewer), 3) in profile facing left, 4) turned three-quarters away (mostly her back, facing left). Arms and pose identical in all frames, only the body turns. The figures do not touch each other or the column edges. Photorealistic porcelain and tulle. No pedestal. No cast shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: aynı figür ve ölçü; 4 eşit sütun (384 px); aynı taban çizgisi; sırayla ön → ¾ → profil → ¾ arka; gerçek alfa.

#### 257. W2.8 Balerin dönüşü — kareler 5–8

- İndirme adı: `32-music-box-ballerina__dancer_turn_b.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer_turn_b.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: dancer.png (listede #255), dancer_turn_a.png (listede #256)

```
The next four frames of the same slow turn of the same porcelain ballerina (give dancer.png and dancer_turn_a.png as the reference: identical figure, size, baseline at about y 960 px, four equal 384 px columns of a 1536 x 1024 canvas): 5) seen fully from the back, 6) turned three-quarters away facing right (mostly her back), 7) in profile facing right, 8) turned a quarter to her right (three-quarter front view, her left shoulder toward the viewer) — so that frame 8 leads back to frame 1 of dancer_turn_a.png. Arms and pose identical, only the body turns. The figures do not touch each other or the column edges. No pedestal. No cast shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: 8 kare art arda bir tam dönüş; figür aynı; gerçek alfa. (Claude kareleri tek bir sprite'a dizer; açılışta

#### 258. W2.9 Kutudaki kart (boş)

- İndirme adı: `32-music-box-ballerina__card_small.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A small, thick landscape invitation card that waits inside the music box, alone: cream cotton card (#FFF8F4) with a deckled edge, a very faint blush watercolour wash in one corner and a very thin soft-gold foil edge, exactly 500 by 330 in proportion (landscape, about 3:2), centred on the canvas and filling about 78% of its width. The whole face of the card is BLANK (the website places the names and the date on it) — no window, no frame lines, no ornaments in the middle. Front view, perfectly straight, not cropped, generous empty margin all around. Soft light from the top-left. No cast shadow. No text, letters, numbers or monogram. True transparent background PNG (real alpha channel).
```

Kontrol: yatay, oran ~500:330; yüzü boş; ince altın kenar; gölge yok; gerçek alfa.

#### 259. W2.10 Gül yaprakları (üç ayrı dosya)

- İndirme adı: `32-music-box-ballerina__petal_1.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/petal_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_1 (number 1 of 3).

A single fresh rose petal, alone, drawn large so it fills about 50% of the square: petal_1 blush pink (#F2C9CE) gently curled, petal_2 cream with a pink edge, petal_3 deeper rose (#D99AA5) seen slightly from the side. Photorealistic, soft velvety texture. Front view, centred, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel). Make three separate images, one petal each.
```

Kontrol: her dosyada tek yaprak; gölge yok; gerçek alfa (açılışta 5, RSVP gönderiminde 9 yaprak süzülür;

#### 260. W2.10 Gül yaprakları (üç ayrı dosya)

- İndirme adı: `32-music-box-ballerina__petal_2.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/petal_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_2 (number 2 of 3).

A single fresh rose petal, alone, drawn large so it fills about 50% of the square: petal_1 blush pink (#F2C9CE) gently curled, petal_2 cream with a pink edge, petal_3 deeper rose (#D99AA5) seen slightly from the side. Photorealistic, soft velvety texture. Front view, centred, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel). Make three separate images, one petal each.
```

Kontrol: her dosyada tek yaprak; gölge yok; gerçek alfa (açılışta 5, RSVP gönderiminde 9 yaprak süzülür;

#### 261. W2.10 Gül yaprakları (üç ayrı dosya)

- İndirme adı: `32-music-box-ballerina__petal_3.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/petal_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_3 (number 3 of 3).

A single fresh rose petal, alone, drawn large so it fills about 50% of the square: petal_1 blush pink (#F2C9CE) gently curled, petal_2 cream with a pink edge, petal_3 deeper rose (#D99AA5) seen slightly from the side. Photorealistic, soft velvety texture. Front view, centred, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel). Make three separate images, one petal each.
```

Kontrol: her dosyada tek yaprak; gölge yok; gerçek alfa (açılışta 5, RSVP gönderiminde 9 yaprak süzülür;

#### 262. W2.11 Sayfa zemini (kutu sayfası + home, telefon)

- İndirme adı: `32-music-box-ballerina__bg_page.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/bg_page.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG

```
A vertical phone-screen background, soft and pastel: warm blush paper (#F7E4E2) with a delicate, very faint satin sheen, airy watercolour washes of rose quartz in the top-left and bottom-right corners, two or three tiny pale petals only at the far edges, fine paper grain everywhere. The whole central 70% of the image — and especially the upper half, where dark text sits — stays calm, light and empty (no box, no figure, no text). No text, letters or numbers.
```

Kontrol: orta %70 ve üst yarı sakin ve açık; renk yalnız köşelerde; yazı yok.

#### 263. W2.12 Saten zemin (davet, program, RSVP kartı)

- İndirme adı: `32-music-box-ballerina__satin_bg.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/satin_bg.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A smooth blush satin fabric surface (#FAECE9) with very soft, wide, low-contrast folds and a gentle sheen, seen from above, evenly lit, no objects, no seams, no strong highlights or dark creases — calm enough for dark text set on it anywhere. No text.
```

Kontrol: düşük kontrast; nesne yok; üzerinde koyu yazı okunur.

#### 264. W2.13 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `32-music-box-ballerina__web_hero.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: box_body.png (listede #250), interior.png (listede #252), lid_open.png (listede #251), dancer.png (listede #255)

```
Wide horizontal scene in the same style: the open rose-quartz music box (as box_body.png, interior.png and lid_open.png, the oval mirror showing only a soft blurred pink reflection, no face) with the porcelain ballerina figurine (as dancer.png) on its pedestal and the brass key on its side, standing on a blush satin cloth with a few scattered rose petals and a wisp of pale tulle, soft blush wall behind. The box sits in the lower 75% of the image, fully visible; the top 20% is calm empty wall. Photorealistic, pastel. No text, letters, logos or price tags. This image is also cropped to 1200×630 for link previews.
```

Kontrol: kutu + balerin altta tam görünür; aynada yüz yok; üst %20 boş; yazı yok.

#### 265. 2.1 Ana portre (aynada ve davetin yanında)

- İndirme adı: `32-music-box-ballerina__photos__hero_portrait.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties in a light-filled garden pavilion with tall windows and climbing pale pink roses: the bride in an ivory gown with a soft tulle skirt, the groom in a dove-grey suit with a blush rose boutonnière, close together and smiling, waist-up, faces centred in the upper half of the frame (the photo is also shown cropped to an oval). Pastel rose-quartz, blush and cream palette, soft daylight, gentle film grain. They must not resemble any real or famous person. No text, no frame, no watermark.
```

#### 266. 2.2 Ayna 1 — "Our first dance"

- İndirme adı: `32-music-box-ballerina__photos__story_1.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5, in smart evening clothes dancing a slow first dance together in a softly lit old ballroom with warm string lights, laughing, faces in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No readable signs, no text, no logos.
```

#### 267. 2.3 Ayna 2 — "A little music box"

- İndirme adı: `32-music-box-ballerina__photos__story_2.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5: the proposal at home by a window on a winter afternoon — he holds out a small open rose-coloured music box with a tiny ring inside, she covers her mouth in happy surprise; faces and the box in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No text, no logos.
```

#### 268. 2.4 Ayna 3 — "Yours, forever"

- İndirme adı: `32-music-box-ballerina__photos__story_3.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Close-up, vertical 4:5: the couple's joined hands with a delicate engagement ring, resting on blush satin beside a few rose petals and a little brass music box key; the hands in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No text.
```

#### 269. 2.5 Mekân

- İndirme adı: `32-music-box-ballerina__photos__venue.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1024 px (3:2) · opak · JPG

```
Landscape: an elegant white garden pavilion with tall arched windows and a rose garden in front, set for a spring wedding with cream chairs and pale pink flowers, soft late-afternoon light. Fictional place — no recognisable real building, no people, no signs, no text. Photorealistic, same palette. Keep the pavilion in the middle 60% of the height (the photo is shown cropped to 16:9).
```

#### 270. 3.1 Kapak — elde telefon

- İndirme adı: `32-music-box-ballerina__mockups__cover_hand.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a blush satin cloth on a white vanity table and a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 271. 3.2 Üç telefon — sayfalar

- İndirme adı: `32-music-box-ballerina__mockups__three_phones.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a blush satin cloth on a white vanity table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 272. 3.3 Dizüstü + telefon

- İndirme adı: `32-music-box-ballerina__mockups__laptop_phone.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a blush satin cloth on a white vanity table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 273. 3.4 Masa üstü — yukarıdan

- İndirme adı: `32-music-box-ballerina__mockups__flatlay_phone.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a blush satin cloth on a white vanity table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 274. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `32-music-box-ballerina__mockups__hand_phone_edit.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a blush velvet armchair with a rose-gold cushion and a porcelain teacup; a small arrangement of a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 275. P6.1 Ön yüz

- İndirme adı: `32-music-box-ballerina__print__invitation_front.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: dancer.png (listede #255)

```
A full-bleed printable wedding invitation background, front side, portrait, soft and pastel: warm blush cotton paper (#F7E4E2) with fine grain everywhere. At the top centre a small photorealistic porcelain music box ballerina figurine (as dancer.png, not a real person) standing on a tiny soft-gold pedestal with two or three blush rose petals at her feet; all of it between 6% and 21% of the image height and within the middle 30% of the width. At the bottom a slim horizontal spray of pale pink rose petals and a wisp of tulle between 88% and 95% of the image height, within the middle 70% of the width. A very thin soft-gold hairline frame inset 7% from every edge. The whole area from 12% to 88% of the width and from 23% to 87% of the height is completely EMPTY, calm blush paper (no petals, shading or frame lines in it) because dark text is printed there. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 x 2175 px.
```

Kontrol: tam taşma; x %12–88 × y %23–87 tamamen boş; balerin y %6–21; yapraklar y %88–95; yazı yok.

#### 276. P6.2 Arka yüz

- İndirme adı: `32-music-box-ballerina__print__invitation_back.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: invitation_front.png (listede #275)

```
The back side of the same printable invitation (give invitation_front.png as the reference): full-bleed blush cotton paper (#F7E4E2) with the same fine grain and the same thin soft-gold hairline frame inset 7% from every edge; only a small brass music box wind-up key lying on its side with two blush rose petals at the bottom centre, all between 83% and 93% of the image height and within the middle 30% of the width. Everything from 11% to 81% of the height, between 12% and 88% of the width, is completely EMPTY paper for the schedule and a QR code. No text, letters, numbers, logos or watermarks. Print quality, 1575 x 2175 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; anahtar + yapraklar y %83–93; geri kalanı boş; yazı yok.

### 33_Marigold_Mehndi

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, scripts of any language, monograms, logos or watermarks in any image. No religious symbols or deities** (no Om, no swastika, no Ganesha, no temple, no sacred fire, no kalash): this is a festive, cultural look — marigolds, henna patterns, silk, brass lamps, carved arches — not a religious one. Give W2.1 `silk.png`, W2.14 `velvet.png`, W2.15 `paper.png` and W2.2 `sleeve.png` as the style reference of every later part: the same fuchsia silk, the same velvet, the same saffron paper, the same warm gold.
```

#### 277. W2.1 Fuşya ipek (zarfın arkası, ön cebi, kapağı)

- İndirme adı: `33-marigold-mehndi__silk.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/silk.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of rich fuchsia raw silk (#B3165E) filling the whole square edge to edge: a fine slub weave, a soft natural sheen that moves in gentle diagonal waves, very subtle shot-silk warmth (a hint of saffron in the highlights). Calm and even everywhere, no fold, no seam, no pattern, no embroidery, no border, no vignette, no object. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#B3165E` civarı; parlaklık yumuşak; desen/yazı yok.

#### 278. W2.2 Altın lazer kesim paisley kılıf (açılışta yana kayar)

- İndirme adı: `33-marigold-mehndi__sleeve.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/sleeve.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×500 px (12:5) · şeffaf zemin (gerçek alfa) · PNG

```
A wide horizontal band of thin gold metallic card, laser-cut in an intricate openwork pattern of paisleys, small marigold flowers and fine vines, seen straight from the front on a fully transparent background, the band filling the image edge to edge (2.4:1): warm gold (#C9A24A) with gold-leaf highlights (#EBCD84), the cut-outs are TRUE TRANSPARENT holes (about 40% of the band is open lace, so the silk behind shows through), a slim solid gold edge along the top and bottom. Soft warm light from the top-left, the gold gently curved as if wrapped round an envelope. No tassel, no seal, no shadow outside the band. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: bant tuvali dolduruyor (2,4:1); kesik yerleri gerçekten şeffaf; püskül/mühür yok; gerçek alfa.

#### 279. W2.3 Kadife çiçeği yaprakları (süzülen yapraklar) — üç ayrı dosya

- İndirme adı: `33-marigold-mehndi__petal_1.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_1 (number 1 of 3).

A single loose marigold petal, photorealistic, alone, on a fully transparent background: a ruffled orange-saffron petal (#F2A13B, deeper orange at the base, a golden edge), soft and slightly curled, filling about 55% of the square, centred, not cropped. No stem, no whole flower, no shadow, no other petal. No text. True transparent background PNG (real alpha channel). (Make three different petals: 1 = a wide ruffled petal, 2 = a narrow curled petal, 3 = a small deep-orange petal.)
```

Kontrol: tek yaprak; üç dosya farklı; gölge yok; gerçek alfa.

#### 280. W2.3 Kadife çiçeği yaprakları (süzülen yapraklar) — üç ayrı dosya

- İndirme adı: `33-marigold-mehndi__petal_2.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_2 (number 2 of 3).

A single loose marigold petal, photorealistic, alone, on a fully transparent background: a ruffled orange-saffron petal (#F2A13B, deeper orange at the base, a golden edge), soft and slightly curled, filling about 55% of the square, centred, not cropped. No stem, no whole flower, no shadow, no other petal. No text. True transparent background PNG (real alpha channel). (Make three different petals: 1 = a wide ruffled petal, 2 = a narrow curled petal, 3 = a small deep-orange petal.)
```

Kontrol: tek yaprak; üç dosya farklı; gölge yok; gerçek alfa.

#### 281. W2.3 Kadife çiçeği yaprakları (süzülen yapraklar) — üç ayrı dosya

- İndirme adı: `33-marigold-mehndi__petal_3.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_3 (number 3 of 3).

A single loose marigold petal, photorealistic, alone, on a fully transparent background: a ruffled orange-saffron petal (#F2A13B, deeper orange at the base, a golden edge), soft and slightly curled, filling about 55% of the square, centred, not cropped. No stem, no whole flower, no shadow, no other petal. No text. True transparent background PNG (real alpha channel). (Make three different petals: 1 = a wide ruffled petal, 2 = a narrow curled petal, 3 = a small deep-orange petal.)
```

Kontrol: tek yaprak; üç dosya farklı; gölge yok; gerçek alfa.

#### 282. W2.4 Jharokha kemeri (foto çerçevesi; kemerli pencere)

- İndirme adı: `33-marigold-mehndi__jharokha.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/jharokha.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1300 px (10:13) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A carved Rajasthani jharokha window frame seen straight from the front, on a fully transparent background, the frame filling the image edge to edge (0.77:1): warm sandstone-and-gold carving with a scalloped (cusped) arch at the top, two slender carved pillars, a small domed canopy (chhatri) crown with a tiny gold finial at the top, a carved ledge with two small brackets at the bottom, fine gold-leaf accents and a few tiny inlaid fuchsia and saffron stones. The window opening inside is a cusped arch whose bounding box is exactly 4:5 — 64% of the image width wide (from 18% to 82%) and from 24% to 85.5% of the image height — and the whole opening is filled with flat pure green #00FF00 (no texture, no shading, crisp arch edges, nothing in front of it). Soft warm light from the top-left. No lattice in the window, no people, no shadow outside the frame. No text, letters, numbers or symbols, no religious figures. True transparent background PNG (real alpha channel).
```

Kontrol: pencere düz `#00FF00`, kutusu 4:5 ve tarifteki yerde (%18–%82 × %24–%85,5); kemer dilimli; dini figür yok; alfa.

#### 283. W2.5 Kına deseni (kemerin çevresi; çizgi çizgi akar)

- İndirme adı: `33-marigold-mehndi__henna.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/henna.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1300 px (10:13) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: jharokha.png (listede #282)

```
Fine henna (mehndi) line art in a deep henna brown (#7A3B1E) on a fully transparent background, on the same 1000×1300 canvas as jharokha.png and drawn to sit AROUND that arch frame: delicate paisleys, small flowers, leaves, dots and flowing vines that climb up both sides from the bottom corners and meet over the arch crown, plus a few dotted trails reaching outwards; thin, even, hand-drawn lines like real henna on skin, no filled areas. The middle of the canvas where the frame and its window sit — from 12% to 88% of the width and from 8% to 92% of the height — stays EMPTY except where the vines cross the frame's outer edge. No background, no skin, no hand. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız ince kına çizgileri (dolgu yok); orta alan boş; jharokha ile aynı tuval; alfa.

#### 284. W2.6 Pirinç diya (sönük kandil)

- İndirme adı: `33-marigold-mehndi__diya.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/diya.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 600×420 px (10:7) · şeffaf zemin (gerçek alfa) · PNG

```
A single small traditional brass oil lamp (diya), photorealistic, seen from the front and slightly above, on a fully transparent background, filling about 90% of the image: a shallow almond-shaped polished brass bowl with a short pinched spout on the right, a few fine engraved petals on its side, a little oil inside and a cotton wick lying in the spout — UNLIT (no flame, no glow). Warm light from the top-left. No base cloth, no flowers, no shadow, no other object. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek sönük kandil; alev/ışıma yok; fitil ağızda; alfa.

#### 285. W2.7 Diya alevi

- İndirme adı: `33-marigold-mehndi__flame.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/flame.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 256×512 px (1:2) · şeffaf zemin (gerçek alfa) · PNG

```
A single small oil-lamp flame, photorealistic, alone, on a fully transparent background, filling about 85% of the image height: a soft teardrop flame, white-gold core, saffron and orange edges, a faint blue at the base, the very tip slightly curved, centred with its base at the bottom-centre of the image. No wick, no lamp, no glow beyond the flame, no smoke, no sparks. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek alev; tabanı alt ortada; dışa taşan hâle yok; alfa.

#### 286. W2.8 Kadife çiçeği çelengi

- İndirme adı: `33-marigold-mehndi__garland.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/garland.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×420 px (30:7) · şeffaf zemin (gerçek alfa) · PNG

```
A festive garland of fresh marigolds (toran) seen straight from the front on a fully transparent background, filling the image width: two graceful swags of densely strung orange and saffron-yellow marigold flowers hanging from the top edge, held at three points (left end, centre, right end), with short strands of marigolds and a few green mango leaves hanging down between the swags, small fuchsia rose buds tucked in here and there. Photorealistic flowers, soft warm light from the top-left. The top edge of the garland runs along the very top of the image. No string ends visible outside, no wall, no shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: iki sarkan kavis, üst kenar boyunca; çiçekler gerçekçi; arka plan yok; alfa.

#### 287. W2.9 Kına deseni zemini (Story arka planı)

- İndirme adı: `33-marigold-mehndi__mehndi_pattern.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/mehndi_pattern.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A seamless, tileable all-over pattern of fine henna (mehndi) line art in a light saffron-gold (#F7C27A) on a fully transparent background: an even scatter of small paisleys, tiny flowers, leaves and dots linked by delicate vines, thin even lines, no filled areas, generous space between motifs. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikişsiz; yalnız ince çizgi; motifler seyrek; alfa.

#### 288. W2.10 Astardan yükselen kart (boş, kemerli foto penceresi)

- İndirme adı: `33-marigold-mehndi__card_small.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1022×1400 px (0.730:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A flat vertical invitation card of the same saffron-ivory paper as paper.png, exactly 0.73:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine gold-foil border of tiny paisleys inset from the edge and a small marigold sprig in each of the two lower corners, a very soft contact shade on the card itself. In its upper part a portrait window shaped as a cusped (scalloped) Rajasthani arch with a 4:5 bounding box — 60% of the card's width wide, horizontally centred, its top at 8% of the card's height — filled with flat pure green #00FF00 (no texture, no shading, crisp edges), with a slim gold carved rim round it. Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: kemer pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 289. W2.11 İpek püskül (kılıftan sarkar, sallanır)

- İndirme adı: `33-marigold-mehndi__tassel.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/tassel.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 300×1000 px (3:10) · şeffaf zemin (gerçek alfa) · PNG

```
A single silk tassel hanging straight down, photorealistic, seen from the front on a fully transparent background, filling the image height: a short twisted gold cord loop at the very top centre (where it hangs from), a small gold-thread wrapped head with a few tiny beads, and a full skirt of fine fuchsia silk threads (#B3165E) with saffron and gold threads mixed in, the ends slightly uneven. Soft warm light from the top-left. No hook, no shadow, no background. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek püskül; asılma noktası üst ortada; dikey; alfa.

#### 290. W2.12 Zarfın ön cebi

- İndirme adı: `33-marigold-mehndi__envelope_front.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/envelope_front.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1290×1000 px (1.290:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: silk.png (listede #277)

```
The front pocket of a fuchsia silk envelope, seen straight from the front on a fully transparent background, filling the image edge to edge (1.29:1): the same fuchsia raw silk as silk.png stretched over card, a perfectly STRAIGHT horizontal top edge finished with a slim gold piping and a fine line of tiny gold embroidered dots just below it, the other three edges straight and crisp with a hairline gold edge. Soft warm light from the top-left. No flap, no seal, no sleeve, no shadow outside. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen cep; üst kenar düz ve altın biyeli; mühür/kapak yok; alfa.

#### 291. W2.13 Zarfın düz kapağı (ön yüz)

- İndirme adı: `33-marigold-mehndi__flap.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1524×800 px (1.905:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: silk.png (listede #277)

```
The closed top flap of the same fuchsia silk envelope, seen straight from the front on a fully transparent background, filling the image edge to edge (1.9:1): a RECTANGULAR flap (not a V, not a point) of the same fuchsia raw silk as silk.png, its lower edge straight with a slim gold piping and a delicate border of tiny gold-embroidered paisleys along it, a soft fold highlight along the top edge where it is hinged. Soft warm light from the top-left. No seal, no button, no sleeve, no shadow outside. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen kapak (V değil); alt kenar düz ve altın biyeli; mühür yok; alfa.

#### 292. W2.14 Kadife (astar, kapağın iç yüzü, sayfa zemini)

- İndirme adı: `33-marigold-mehndi__velvet.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/velvet.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of deep fuchsia-plum silk velvet (#5C0A36) filling the whole square edge to edge: a soft dense pile with a gentle crushed-velvet sheen, slightly lighter where the pile catches the light, calm and even everywhere so light text can read on a darker version of it. No fold, no seam, no pattern, no vignette, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz; kadife hav dokusu; renk `#5C0A36` civarı; desen yok.

#### 293. W2.15 Safran-fildişi kâğıt (kartlar, bantlar, form)

- İndirme adı: `33-marigold-mehndi__paper.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine handmade cotton paper in a warm saffron-ivory (#FAEBD0): a gentle natural tooth, a few tiny soft fibres, a very slight warm mottling, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu yazı her yerde okunur); safran-fildişi; dikişsiz; leke/baskı yok.

#### 294. W2.16 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `33-marigold-mehndi__web_hero.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: silk.png (listede #277), sleeve.png (listede #278), tassel.png (listede #289), velvet.png (listede #292), garland.png (listede #286)

```
Wide horizontal still life, photorealistic, soft warm light from the top-left: the fuchsia silk envelope of silk.png, flap closed, held in the gold laser-cut paisley sleeve of sleeve.png with the silk tassel of tassel.png hanging from it, lying slightly below the centre on deep fuchsia-plum velvet (as velvet.png); a few loose marigold petals and two small lit brass diyas at the left, a short strand of marigolds at the right; a marigold garland (as garland.png) softly out of focus along the top edge. The top 20% of the image is calm. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no hands, no text, letters, numbers or symbols, no logos, no religious objects.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı/dini nesne yok.

#### 295. 2.1 Ana portre

- İndirme adı: `33-marigold-mehndi__photos__hero_portrait.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Anaya and Kabir, in their early thirties (Anaya: long dark-brown hair in a loose low braid with a few marigolds, warm medium-brown skin, a small gold nose stud, fine henna on her hands; Kabir: short black hair, a neat short beard, warm light-brown skin; they must not resemble any real person or celebrity) in a sunlit courtyard of an old haveli with carved sandstone arches and marigold garlands softly out of focus behind them: she in a fuchsia-and-gold silk lehenga, he in an ivory silk sherwani with a saffron stole, standing close, foreheads almost touching, smiling, waist-up, faces in the upper middle of the frame. Photorealistic, warm saffron, fuchsia and gold palette, subtle grain. No text, no frame, no religious objects.
```

#### 296. 2.2 Story 1 — "A monsoon afternoon"

- İndirme adı: `33-marigold-mehndi__photos__story_1.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #295)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin), in casual modern clothes, sharing one umbrella and laughing outside a small old bookshop on a rainy monsoon afternoon, wet street reflections, warm shop light, a few books in her arms. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 297. 2.3 Story 2 — "Kites over the rooftops"

- İndirme adı: `33-marigold-mehndi__photos__story_2.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #295)

```
Vertical 4:5: the same couple as hero_portrait.jpg on a sunny flat rooftop of an old pink-sandstone city, flying a bright kite together, she holding the spool and laughing, he guiding the string, many small colourful kites in a clear blue sky above, old rooftops and domes softly behind. Photorealistic, same palette and grain. No text, no readable signs.
```

#### 298. 2.4 Story 3 — "Among the marigolds"

- İndirme adı: `33-marigold-mehndi__photos__story_3.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #295)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hennaed hand with a slim gold ring resting in his, over a brass tray heaped with fresh marigold flowers and petals, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text, no religious objects.
```

#### 299. 2.5 Mekân

- İndirme adı: `33-marigold-mehndi__photos__venue.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: the courtyard garden of an elegant old haveli at golden hour, carved sandstone arches and jharokha balconies round a lawn, rows of simple chairs with fuchsia and saffron silk sashes facing a low floral stage of marigold garlands (no religious structure), strings of small warm lights, brass lamps along the path. No people, no signs, no text. Photorealistic, same palette.
```

#### 300. P1 — Ön yüz

- İndirme adı: `33-marigold-mehndi__print__invitation_front_5x7.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: paper.png (listede #293), garland.png (listede #286), henna.png (listede #283)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the saffron-ivory paper of paper.png. Along the top edge a marigold garland of two swags (as garland.png) hanging over a narrow band of fuchsia silk about 9% of the height, its flowers reaching down to at most 15% of the height. Along the bottom edge a band of fuchsia silk about 8% of the height with a slim gold-foil paisley border on its upper edge (staying below 87%), and fine henna vines (as henna.png, deep henna brown) climbing a little way up from the two bottom corners along the side edges (staying outside the middle 80% of the width). The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos, watermarks or religious symbols. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı/dini simge yok; çelenk üstte, ipek bant altta.

#### 301. P2 — Arka yüz

- İndirme adı: `33-marigold-mehndi__print__invitation_back_5x7.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same saffron-ivory paper, only a narrow band of fuchsia silk along the top edge (about 6% of the height) with a slim gold-foil paisley border on its lower edge and a few loose marigold petals scattered just below it (everything staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no petal, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar ipek bant + birkaç yaprak (%10'un üstünde); %14'ün altı boş; yazı yok.

### 34_Red_Lacquer_Double_Happiness

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, logos, monograms, seals with writing or watermarks in any image.** The only character allowed anywhere is the double happiness character 囍, and only in W2.11 `xi_gold.png` (and in W2.20 / PAKET 6 where the prompt asks for it) — never any other Chinese character, no stamp, no calligraphy, no religious symbol (no Buddha, no temple, no deity, no incense, no shrine). Give W2.2 `red_paper.png`, W2.3 `cream_paper.png`, W2.4 `gold_leaf.png` and W2.7 `envelope_flap.png` as the style reference of every later part: the same cinnabar paper, the same warm cream, the same gold leaf, the same crisp paper-cut technique.
```

#### 302. W2.1 Lake zemin (sayfa zemini)

- İndirme adı: `34-red-lacquer-double-happiness__lacquer.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/lacquer.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat texture of an old hand-polished Chinese red lacquer surface in a deep oxblood lacquer red (#4A0A0E), filling the whole square edge to edge: a soft, deep, slightly glossy depth with very subtle mottling of a darker red (#2C0507) and the faintest hairline crackle of aged lacquer, calm and even everywhere so that cream and gold text reads on it. No pattern, no gold, no motif, no reflection of objects, no vignette, no gradient, no object. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#4A0A0E` civarı; sakin (üstünde krem yazı okunur); desen/yazı yok.

#### 303. W2.2 Zincifre kırmızı kâğıt (zarf kâğıdı)

- İndirme adı: `34-red-lacquer-double-happiness__red_paper.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine handmade Chinese red paper in a warm cinnabar red (#A81E24), the paper of a wedding envelope: soft visible paper fibres, a gentle natural tooth, a sparse scattering of tiny gold-leaf flecks (a few dozen, very small, irregular), evenly lit from the top-left. No shadow, no vignette, no fold, no stain, no pattern, no motif. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin; zincifre kırmızısı; ince altın pullar seyrek; dikişsiz; desen yok.

#### 304. W2.3 Krem kart kâğıdı (kartlar, bantlar, form)

- İndirme adı: `34-red-lacquer-double-happiness__cream_paper.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cream_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine warm cream rice paper (#F5ECD8): delicate long fibres, a soft natural tooth, a warm even tone, calm enough for dark red ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu kırmızı yazı her yerde okunur); sıcak krem; dikişsiz; leke/baskı yok.

#### 305. W2.4 Altın varak dokusu

- İndirme adı: `34-red-lacquer-double-happiness__gold_leaf.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/gold_leaf.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of genuine gold leaf laid on paper: warm gold (#C9A14A) with lighter (#E6C983) and deeper (#8A5F1C) areas, the faint square seams and tiny wrinkles of hand-laid leaf, a soft satin shine from the top-left. Even everywhere, no pattern, no motif, no vignette, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: gerçek varak görünümü; sıcak altın; dikişsiz; desen yok.

#### 306. W2.5 Zarfın arkası ve astarı

- İndirme adı: `34-red-lacquer-double-happiness__envelope_back.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_back.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×1500 px (0.660:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (listede #303)

```
The back panel of a tall vertical Chinese wedding envelope seen straight from the front with its flap open and out of the picture, on a fully transparent background, the panel filling the image edge to edge (the image IS the panel, 0.66:1): the inside of the envelope, lined in the top 35% of its height with a cream paper lining printed with a delicate pattern of small gold-leaf auspicious cloud scrolls; below the lining the plain inner side of the same cinnabar red paper as red_paper.png, slightly in shade. Straight edges, crisp paper corners, soft warm light from the top-left. No flap, no card, no object inside, no shadow outside the panel. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: panel tuvali dolduruyor (0,66:1); üst %35'te altın bulutlu krem astar; kapak/kart yok; gerçek alfa.

#### 307. W2.6 Zarfın ön cebi

- İndirme adı: `34-red-lacquer-double-happiness__envelope_pocket.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×1500 px (0.660:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_back.png (listede #306), red_paper.png (listede #303)

```
The front pocket of the same tall vertical red envelope as envelope_back.png, seen straight from the front, on a fully transparent background, drawn on the full envelope canvas: the pocket is the same cinnabar red paper as red_paper.png and covers the image from 30% of its height down to the bottom edge, full width; its top edge at 30% is a clean straight cut with a fine gold-leaf edge line; everything above 30% is fully transparent. Very soft folds of real paper at the sides, a hair of shadow under the top edge, soft warm light from the top-left. The pocket is PLAIN: no character, no flower, no button, no cord drawn on it (they are separate layers). No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: cep %30'dan aşağı, üstü tamamen şeffaf; cep düz (düğme, ip, 囍 yok); gerçek alfa.

#### 308. W2.7 Zarf kapağı (dış yüz)

- İndirme adı: `34-red-lacquer-double-happiness__envelope_flap.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×780 px (1.269:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (listede #303)

```
The closed top flap of the same tall vertical red envelope, alone, seen straight from the front, on a fully transparent background: the same cinnabar red paper as red_paper.png, full width of the image, its top edge a straight fold along the very top of the image; its sides straight; its lower edge a graceful, shallow, symmetrical curve shaped like an auspicious cloud scroll (ruyi) whose lowest point, at the centre, touches the bottom edge of the image, with a fine gold-leaf line following that lower edge. A delicate border of tiny gold-leaf cloud scrolls along the lower edge only. Soft warm light from the top-left, a very slight paper sheen. The flap is otherwise PLAIN: no button, no cord, no character (separate layers). It must not be a V-shaped flap and must have no wax seal. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: üst kenar düz katlama; alt kenar ortada en alçak, bulut biçimli sığ eğri (V değil); düğme/ip/mühür yok; gerçek alfa.

#### 309. W2.8 Kapağın iç yüzü (kalkınca görünen)

- İndirme adı: `34-red-lacquer-double-happiness__flap_inside.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/flap_inside.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×780 px (1.269:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_flap.png (listede #308), envelope_back.png (listede #306)

```
The inside of the same envelope flap as envelope_flap.png, seen straight on once it has been lifted up above the envelope, on a fully transparent background: the SAME outline as envelope_flap.png but turned upside down — its straight fold edge runs along the BOTTOM of the image and its shallow cloud-scroll curve is at the TOP, lowest point of the curve now the highest point at the top centre. The inner side of the same cinnabar red paper, a little darker and in soft shade, lined with the same cream lining with small gold-leaf cloud scrolls as envelope_back.png. No button, no cord, no character. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dış yüzün dikey aynası (katlama alta, eğri üste); astarlı; gerçek alfa.

#### 310. W2.9 Kâğıt düğme (iki kez kullanılır)

- İndirme adı: `34-red-lacquer-double-happiness__button.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/button.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 400×400 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single round paper button of a string-and-button envelope closure, seen straight from above, on a fully transparent background, filling about 92% of the square: a thick disc of layered cream card covered with real gold leaf, a slightly raised rim, a tiny brass rivet at its centre, a delicate pressed pattern of a small plum blossom around the rivet, soft warm light from the top-left, a hair of shadow under its own rim only. Perfectly round, centred, not cropped. No cord, no text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: tam yuvarlak, ortada; ip yok; yazı yok; gerçek alfa.

#### 311. W2.10 Kırmızı ipek ip (iki düğmeye sarılı)

- İndirme adı: `34-red-lacquer-double-happiness__string.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/string.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 410×600 px (0.683:1) · şeffaf zemin (gerçek alfa) · PNG

```
A thin round red silk cord (#A81E24 with a soft sheen) wound in a neat figure-eight around two round buttons that are NOT drawn, on a fully transparent background: the two button discs are each 50% of the image width across, centred horizontally, one centred at 22% and one at 78% of the image height; the cord loops once around the outer rim of each (hugging the rims, leaving the discs themselves empty and transparent) and crosses itself once between them in the middle; a short loose end with a tiny gold bead hangs from the lower loop. Soft warm light from the top-left, a fine shadow under the cord only. No buttons, no paper, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız ip; düğme diskleri boş/şeffaf (%22 ve %78 merkezli, genişliğin %50'si); ortada bir kez çapraz; gerçek alfa.

#### 312. W2.11 Altın varak 囍 (cepte)

- İndirme adı: `34-red-lacquer-double-happiness__xi_gold.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/xi_gold.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×800 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
The Chinese double happiness character 囍, alone, as a crisp cut-out of real gold leaf on paper, seen straight on, on a fully transparent background, centred and filling about 80% of the square: the classic balanced form of 囍 with clean straight strokes, the gold leaf showing fine wrinkles and a soft satin shine from the top-left, a hair of shadow under its edges. Exactly this one character, correctly written, nothing else: no circle around it, no other character, no flower, no frame. True transparent background PNG (real alpha channel).
```

Kontrol: tek karakter 囍, doğru yazılmış; çevresinde çerçeve/başka karakter yok; gerçek alfa.

#### 313. W2.12 Dış kâğıt kesim pencere (kırmızı; ortadan ikiye kesilir)

- İndirme adı: `34-red-lacquer-double-happiness__veil_outer.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_outer.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (listede #303)

```
A single sheet of red Chinese paper-cut (jianzhi) in the same cinnabar red paper as red_paper.png, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): an intricate window grille pattern with a large blooming tree peony in the centre, peony leaves and buds, auspicious cloud scrolls and a fine lattice border all round, the cut-away parts fully transparent (real openings, about 45% of the area open), crisp clean cut edges with a hair of shadow. The design is perfectly mirror-symmetric left to right (it will be cut down the vertical centre line into two shutter halves), with no important detail exactly on the centre line. No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tuvali dolduran tek kâğıt kesim; ortadan simetrik; açık yerler gerçekten şeffaf; yazı yok.

#### 314. W2.13 İç kâğıt kesim pencere (altın; ortadan ikiye kesilir)

- İndirme adı: `34-red-lacquer-double-happiness__veil_inner.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_inner.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: veil_outer.png (listede #313)

```
A single sheet of fine gold paper-cut (gold-leaf paper) of the same size, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): a lighter, finer pattern than veil_outer.png — a delicate lattice of plum blossoms and small cloud scrolls with two smaller peonies, about 60% of the area cut away (fully transparent openings), crisp edges, a soft gold satin shine from the top-left. Perfectly mirror-symmetric left to right (it is cut down the vertical centre line into two halves). No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: altın, dış kattan daha ince ve açık; simetrik; açık yerler şeffaf; yazı yok.

#### 315. W2.14 Açılış kartı (boş, yuvarlak foto penceresi)

- İndirme adı: `34-red-lacquer-double-happiness__card_small.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: cream_paper.png (listede #304)

```
A flat vertical invitation card of the same warm cream paper as cream_paper.png, exactly 0.69:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine gold-leaf border line inset from the edge and tiny gold paper-cut cloud scrolls at its four corners, a very soft contact shade on the card itself. In its upper part a round portrait window, a perfect circle 62% of the card's width across, horizontally centred, its top edge at 9% of the card's height, framed by a slim red-and-gold ring, the window filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers, characters or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: daire pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 316. W2.15 Altın bulutlar — üç ayrı dosya

- İndirme adı: `34-red-lacquer-double-happiness__cloud_1.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×400 px (2:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (cloud_1, cloud_2, cloud_3). Make ONLY ONE image now: cloud_1 (number 1 of 3).

A single Chinese auspicious cloud (xiangyun) motif cut from gold-leaf paper, alone, on a fully transparent background, seen flat and straight on, filling about 85% of the width: soft rolling scroll curls with a few spiralling heads, crisp paper-cut edges, warm gold with a soft satin shine from the top-left, a hair of shadow under its edges. Centered, not cropped. No other object, no text, letters, numbers or characters. True transparent background PNG (real alpha channel). (Make three different clouds: 1 = long and low with three curls, 2 = compact with two large curls, 3 = a small wisp with one curl.)
```

Kontrol: tek bulut; üç dosya farklı; altın kâğıt kesim; gerçek alfa.

#### 317. W2.15 Altın bulutlar — üç ayrı dosya

- İndirme adı: `34-red-lacquer-double-happiness__cloud_2.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×400 px (2:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (cloud_1, cloud_2, cloud_3). Make ONLY ONE image now: cloud_2 (number 2 of 3).

A single Chinese auspicious cloud (xiangyun) motif cut from gold-leaf paper, alone, on a fully transparent background, seen flat and straight on, filling about 85% of the width: soft rolling scroll curls with a few spiralling heads, crisp paper-cut edges, warm gold with a soft satin shine from the top-left, a hair of shadow under its edges. Centered, not cropped. No other object, no text, letters, numbers or characters. True transparent background PNG (real alpha channel). (Make three different clouds: 1 = long and low with three curls, 2 = compact with two large curls, 3 = a small wisp with one curl.)
```

Kontrol: tek bulut; üç dosya farklı; altın kâğıt kesim; gerçek alfa.

#### 318. W2.15 Altın bulutlar — üç ayrı dosya

- İndirme adı: `34-red-lacquer-double-happiness__cloud_3.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×400 px (2:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (cloud_1, cloud_2, cloud_3). Make ONLY ONE image now: cloud_3 (number 3 of 3).

A single Chinese auspicious cloud (xiangyun) motif cut from gold-leaf paper, alone, on a fully transparent background, seen flat and straight on, filling about 85% of the width: soft rolling scroll curls with a few spiralling heads, crisp paper-cut edges, warm gold with a soft satin shine from the top-left, a hair of shadow under its edges. Centered, not cropped. No other object, no text, letters, numbers or characters. True transparent background PNG (real alpha channel). (Make three different clouds: 1 = long and low with three curls, 2 = compact with two large curls, 3 = a small wisp with one curl.)
```

Kontrol: tek bulut; üç dosya farklı; altın kâğıt kesim; gerçek alfa.

#### 319. W2.16 Ay kapısı çerçevesi (yuvarlak foto çerçevesi)

- İndirme adı: `34-red-lacquer-double-happiness__moon_gate.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/moon_gate.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1200 px (1:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A round Chinese garden moon gate seen straight on as a decorative frame, on a fully transparent background, filling the image edge to edge: a ring of deep red lacquer (#4A0A0E to #A81E24) about 12% of the image width thick, with a slim gold-leaf inner edge and a slim gold-leaf outer edge, a delicate red paper-cut tree peony branch climbing over the lower left of the ring and a small gold cloud scroll at the upper right, both kept inside the image. The round opening in the middle is a perfect circle 72% of the image width across, centred, filled with flat pure green #00FF00 (no texture, no shading). Soft warm light from the top-left. No wall, no garden, no background, no text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: tam daire pencere, düz `#00FF00`, %72; çerçeve dışında zemin yok; yazı yok; gerçek alfa.

#### 320. W2.17 Kâğıt kesim bordür (başlık altı)

- İndirme adı: `34-red-lacquer-double-happiness__peony_band.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/peony_band.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×300 px (16:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (listede #303)

```
A long horizontal border strip of red Chinese paper-cut in the same cinnabar paper as red_paper.png, on a fully transparent background: a small blooming peony in the centre with leaves and buds running out symmetrically to both sides and ending in little cloud scrolls, crisp cut edges with a hair of shadow, the cut-away parts fully transparent, a few tiny gold-leaf accents. Centered, not cropped, generous empty margin. Mirror-symmetric left to right. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: yatay şerit; ortada şakayık; simetrik; açık yerler şeffaf; yazı yok.

#### 321. W2.18 Kâğıt kesim katmanları (paralaks) — iki dosya

- İndirme adı: `34-red-lacquer-double-happiness__jianzhi_far.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/jianzhi_far.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1600 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A large, airy Chinese paper-cut panel in a slightly darker red than the lacquer ground (#7A141A), on a fully transparent background, filling about 95% of the square: tree peony branches with large blooms and leaves, plum blossom twigs and auspicious cloud scrolls spreading across the whole square, about 70% of the area cut away (fully transparent), crisp edges. It is a faint background layer over a deep red lacquer page, so it is tone-on-tone and calm, no gold. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

#### 322. W2.18 Kâğıt kesim katmanları (paralaks) — iki dosya

- İndirme adı: `34-red-lacquer-double-happiness__jianzhi_near.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/jianzhi_near.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1400×1000 px (7:5) · şeffaf zemin (gerçek alfa) · PNG

```
A smaller Chinese paper-cut spray in gold-leaf paper, on a fully transparent background, filling about 90% of the width: two tree peonies with leaves rising from the bottom edge, a few small cloud scrolls above them, crisp edges, about 50% of the area cut away (fully transparent), a soft satin shine from the top-left. The bottom edge of the spray sits on the bottom edge of the image. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: uzak katman ton-sur-ton koyu kırmızı ve sakin; yakın katman altın ve daha küçük; ikisi de şeffaf; yazı yok.

#### 323. W2.19 Püsküllü düğüm (imza süsü)

- İndirme adı: `34-red-lacquer-double-happiness__tassel.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/tassel.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 480×1200 px (2:5) · şeffaf zemin (gerçek alfa) · PNG

```
A traditional Chinese decorative knot (a pan chang endless knot) in red silk cord, hanging from a short loop at the top, with a carved gold bead under it and a long soft red silk tassel below, seen straight on, on a fully transparent background, filling about 90% of the image height, centred. Warm light from the top-left, a soft silk sheen. No characters on the bead, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek düğüm + boncuk + püskül; boncukta yazı yok; gerçek alfa.

#### 324. W2.20 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `34-red-lacquer-double-happiness__web_hero.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: envelope_pocket.png (listede #307), envelope_flap.png (listede #308), xi_gold.png (listede #312), lacquer.png (listede #302), veil_outer.png (listede #313), tassel.png (listede #323)

```
Wide horizontal still life, photorealistic, soft warm lamplight from the top-left: the tall red envelope of envelope_pocket.png and envelope_flap.png, closed with its red cord wound round two gold buttons and the gold-leaf 囍 on its pocket (as xi_gold.png), standing slightly below the centre on a deep red lacquer table (as lacquer.png); a red paper-cut peony (as veil_outer.png) lying at the left, a red silk knot with a tassel (as tassel.png) and a few small gold paper clouds at the right; a soft dark red background above. The top 20% of the image is calm and empty. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no other character than the one 囍 on the envelope, no text, letters, numbers or logos.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 boş; 囍 dışında yazı yok.

#### 325. 2.1 Ana portre

- İndirme adı: `34-red-lacquer-double-happiness__photos__hero_portrait.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG

```
Square 1:1 wedding portrait of the fictional couple Mei and Julian, in their early thirties (Mei: East Asian, long straight black hair worn low with a small gold hair pin, a slim gold ring; Julian: Latino, short dark curly hair, a neat short beard, warm brown skin; they must not resemble any real person or celebrity) in a garden courtyard at golden hour: she in a modern red silk gown with a high collar, he in a dark charcoal suit with a small red pocket square, standing close and smiling at each other, waist-up, faces in the middle of the frame, a round moon gate in a white garden wall and pink peonies softly out of focus behind them. Photorealistic, warm red, cream and gold palette, subtle grain. No text, no frame.
```

#### 326. 2.2 Story 1 — "The lantern festival"

- İndirme adı: `34-red-lacquer-double-happiness__photos__story_1.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #325)

```
Square 1:1 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) sharing one clear umbrella on a rainy evening street hung with plain red paper lanterns (no writing on them), she laughing and holding his arm, warm light reflected on the wet pavement. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 327. 2.3 Story 2 — "Through the moon gate"

- İndirme adı: `34-red-lacquer-double-happiness__photos__story_2.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #325)

```
Square 1:1: the same couple as hero_portrait.jpg walking hand in hand through a round moon gate in a white garden wall, seen from slightly behind and to the side, she turning to look back over her shoulder with a smile, bamboo and a stone path beyond the gate, soft afternoon light. Photorealistic, same palette and grain. No text.
```

#### 328. 2.4 Story 3 — "Among the peonies"

- İndirme adı: `34-red-lacquer-double-happiness__photos__story_3.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #325)

```
Square 1:1 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, among full pink and red tree peony blooms in a garden, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 329. 2.5 Mekân

- İndirme adı: `34-red-lacquer-double-happiness__photos__venue.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant garden house with a red lacquered wooden veranda and dark tiled roof beside a calm pond with a stone bridge, a lawn set with a few rows of simple chairs facing a round moon gate decorated with pink and red peonies for a ceremony, strings of warm small lights, early evening. No people, no signs, no characters or text, no temple or shrine. Photorealistic, same palette.
```

#### 330. P1 — Ön yüz

- İndirme adı: `34-red-lacquer-double-happiness__print__invitation_front_5x7.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: cream_paper.png (listede #304), peony_band.png (listede #320), xi_gold.png (listede #312)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm cream paper of cream_paper.png. Along the top edge a band of cinnabar red paper-cut (as peony_band.png, but as a full-width band) about 12% of the height, with a small gold-leaf double happiness character 囍 (as xi_gold.png) centred in it, its lower edge a slim gold-leaf rule (staying above 14% of the height). Along the bottom edge a matching narrower band of red paper-cut peonies and cloud scrolls about 10% of the height with a slim gold-leaf rule on its upper edge (staying below 85%). The rectangle from 17% to 82% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks; the one 囍 in the top band is the only character. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %17–%82 × %10–%90 tamamen boş; 囍 dışında yazı yok; kırmızı bantlar yalnız üstte ve altta.

#### 331. P2 — Arka yüz

- İndirme adı: `34-red-lacquer-double-happiness__print__invitation_back_5x7.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same warm cream paper, only a narrow band of red paper-cut cloud scrolls along the top edge (about 6% of the height, with a slim gold-leaf rule on its lower edge, staying above 9% of the height). Everything below 11% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flower, no line, no shadow, no stain. No text, letters, numbers, characters, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar kırmızı bant (%9'un üstünde); %11'in altı boş; yazı yok.

### 35_Highland_Tartan_Thistle

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms, clan crests, coats of arms, flags, religious symbols, logos or watermarks in any image.** The tartan is an original heather-and-moss sett invented for this design — it must not copy any registered clan or brand tartan. Give W2.1 `tartan_wool.png`, W2.2 `cream_paper.png` and W2.6 `envelope_back.png` as the style reference of every later part: the same wool, the same cream paper, the same warm saddle leather and antique brass, the same soft daylight.
```

#### 332. W2.1 Ekoseli yün (zarfın kumaşı)

- İndirme adı: `35-highland-tartan-thistle__tartan_wool.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/tartan_wool.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat top-down texture of soft woven wool tartan filling the whole square edge to edge: an original sett of muted moss-green (#5E6B3E) and heather-purple (#7B5A84) squares with a fine cream (#F1EADB) overcheck and one very thin deep-red (#8E2B2F) line, about four repeats of the sett across the square, real twill weave and a slightly fuzzy wool surface, evenly lit from the top-left. Calm and even, no fold, no crease, no stitching, no fringe, no vignette, no shadow. It must not copy any registered clan or brand tartan. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, crests or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); yosun + funda kareleri, ince krem ve çok ince kırmızı çizgi; kıvrım/yazı yok.

#### 333. W2.2 Krem kâğıt (kartlar, bantlar, form)

- İndirme adı: `35-highland-tartan-thistle__cream_paper.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/cream_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of thick handmade cotton paper in a warm cream (#F1EADB): a gentle natural tooth, very faint fibres, the softest warm mottling, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no deckle edge, no stain, no printing, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu yazı her yerde okunur); krem; dikişsiz; leke/baskı yok.

#### 334. W2.3 Koyu yosun zemin (sayfa zemini)

- İndirme adı: `35-highland-tartan-thistle__moss_ground.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/moss_ground.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat texture of deep moss-green boiled wool felt (#20291D) filling the whole square, a soft matte fibrous surface with a barely visible heathered fleck of darker green and faint heather purple, calm and even everywhere so cream text reads on it. Evenly lit, no pattern, no tartan, no fold, no vignette, no gradient, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: koyu, sakin (üstünde krem yazı okunur); desen/ekose yok; dikişsiz.

#### 335. W2.4 Yağlı boya tepeler (açılışın arka planı)

- İndirme adı: `35-highland-tartan-thistle__hills.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/hills.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1600 px (3:4) · opak · PNG

```
A portrait oil painting of Scottish Highland hills at early morning, painted in rich, soft brushwork like a 19th-century landscape: layered rolling hills in moss green and heather purple fading into the distance, a calm glen with a faint ribbon of a loch in the middle distance, low banks of pale mist lying in the valleys, a soft overcast sky with warm light breaking through. The hills fill the lower 60% of the image; the upper 40% is calm, pale, misty sky with nothing in it (text sits there). Muted, deep tones that sit well under cream text (moss #5E6B3E, heather #7B5A84, ground #20291D, mist #DFE3DC). No castle, no buildings, no people, no animals, no trees in the foreground, no frame, no signature. No text, letters, numbers or symbols.
```

Kontrol: tepeler alt %60'ta; üst %40 boş, sakin gök; kale/insan/imza yok; koyu ve yumuşak.

#### 336. W2.5 Dağ sisi (iki sis katmanı)

- İndirme adı: `35-highland-tartan-thistle__mist.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/mist.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×800 px (2:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single soft horizontal bank of pale Highland mist (#DFE3DC), photographed as real low cloud, on a fully transparent background: a long drifting band, thicker in the middle and thinning to nothing towards the left, right, top and bottom edges, with soft wisps and gentle variations of density, semi-transparent everywhere (never a solid white block). It fills the width of the image and about the middle 70% of its height; every edge fades to full transparency well before the border. No hills, no sky, no trees, no objects. No text. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: tek sis bandı; kenarları tam şeffafa iniyor; yarı saydam (düz beyaz blok değil); başka nesne yok; gerçek alfa.

#### 337. W2.6 Zarfın arkası (iç astar görünür)

- İndirme adı: `35-highland-tartan-thistle__envelope_back.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_back.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: tartan_wool.png (listede #332)

```
The back panel of an open rectangular envelope made of the tartan wool of tartan_wool.png, seen straight from the front, on a fully transparent background: a flat upright rectangle filling the whole image edge to edge (the image IS the envelope, 0.9:1), its inside facing us, lined with a plain deep moss-green wool lining (#46512C) that covers it all, a slim edge of the tartan showing along the top and sides, softly lit from the top-left, a gentle shade towards the bottom where the pocket would be. No flap, no front pocket, no strap, no card inside, no shadow outside the rectangle. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tuvali dolduran dikdörtgen (0,9:1); iç astar düz yosun yeşili; kapak/cep/kayış yok; gerçek alfa.

#### 338. W2.7 Zarfın ön cebi

- İndirme adı: `35-highland-tartan-thistle__envelope_front.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_front.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_back.png (listede #337), tartan_wool.png (listede #332)

```
Only the front pocket of the same tartan wool envelope as envelope_back.png, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from 34% of the image height down to the bottom edge, its straight top edge finished with a narrow folded hem and a fine line of cream stitching, soft daylight from the top-left. The upper 34% of the canvas is completely transparent. No flap, no strap, no buckle, no card, no shadow outside the pocket. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: cep tuvalin %34'ünden alta, tam genişlikte; üstü tamamen şeffaf; kayış/toka yok; gerçek alfa.

#### 339. W2.8 Zarfın düz kapağı (V değil)

- İndirme adı: `35-highland-tartan-thistle__flap.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: tartan_wool.png (listede #332)

```
Only the closed flap of the same tartan wool envelope, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from the top edge down to 56% of the image height, folded down over the pocket, with a soft rounded fold along its top edge and a STRAIGHT bottom edge (not a V, not a point, not scalloped) finished with a narrow hem and a fine line of cream stitching; a very soft shade along its bottom edge. The lower 44% of the canvas is completely transparent. No strap, no buckle, no seal, no button, no card. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: kapak üstten %56'ya, tam genişlik; alt kenar **düz**; mühür/düğme/kayış yok; altı tamamen şeffaf; gerçek alfa.

#### 340. W2.9 Deri kayış

- İndirme adı: `35-highland-tartan-thistle__strap.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/strap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 240×1300 px (0.185:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single straight vertical leather strap, seen straight from the front, on a fully transparent background, filling the image edge to edge (about 0.18:1): warm saddle-brown vegetable-tanned leather (#6B4428) with a fine stitched line of cream thread along both long edges, softly burnished edges, a natural grain, a rounded tip at the bottom end, the top end cut straight. Soft daylight from the top-left. No buckle, no holes, no rivets, no shadow outside the strap. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek dikey kayış; iki kenarda krem dikiş; alt ucu yuvarlak; toka yok; gerçek alfa.

#### 341. W2.10 Pirinç toka

- İndirme adı: `35-highland-tartan-thistle__buckle.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/buckle.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 560×320 px (7:4) · şeffaf zemin (gerçek alfa) · PNG

```
A single antique brass strap buckle, seen straight from the front, on a fully transparent background, filling the image edge to edge (about 1.75:1): a rectangular frame with softly rounded corners and a centre bar, with its pointed prong lying flat across the bar, in warm antique brass (#A88437) with gentle highlights and a little patina, finely engraved with a simple border line. The openings inside the frame are fully transparent (the strap shows through them). Soft daylight from the top-left. No strap, no shadow outside the buckle. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek toka; çerçeve içi şeffaf; dil ortadaki çubuğun üstünde; gerçek alfa.

#### 342. W2.11 Funda dalı (cepten yükselen)

- İndirme adı: `35-highland-tartan-thistle__heather_sprig.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_sprig.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 600×1100 px (6:11) · şeffaf zemin (gerçek alfa) · PNG

```
A single sprig of Scottish heather standing upright, photorealistic with a soft painterly finish, on a fully transparent background: a slender woody stem with a few small side branches, dense spikes of tiny heather-purple (#7B5A84) bell flowers along the upper half, small dark-green needle leaves, one short sprig of pale cream heather tucked beside it, filling about 90% of the image height, centred, the stem's cut end at the bottom. Soft daylight from the top-left. No ribbon, no vase, no shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek dik funda dalı; mor çiçekler üst yarıda; alt uç kesik; kurdele/gölge yok; gerçek alfa.

#### 343. W2.12 Funda ayırıcı (başlık altı)

- İndirme adı: `35-highland-tartan-thistle__heather_divider.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_divider.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×260 px (6.154:1) · şeffaf zemin (gerçek alfa) · PNG

```
A slim horizontal divider made of two small sprigs of heather and a small thistle head, photorealistic with a soft painterly finish, on a fully transparent background: the thistle head with its purple tuft in the centre, a heather sprig reaching out to the left and one to the right, lying horizontally, delicate and airy, centred with a generous empty margin at both ends. Soft daylight from the top-left. No ribbon, no line, no shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yatay, ortada devedikeni, iki yanda funda; kenarlarda boşluk; çizgi/kurdele yok; gerçek alfa.

#### 344. W2.13 Funda çiçekçikleri (yanıt gönderilince süzülen) — üç ayrı dosya

- İndirme adı: `35-highland-tartan-thistle__heather_floret_1.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (heather_floret_1, heather_floret_2, heather_floret_3). Make ONLY ONE image now: heather_floret_1 (number 1 of 3).

A single tiny cluster of heather bell flowers, photorealistic, alone, on a fully transparent background: three to five small heather-purple (#7B5A84) bells on a short sprig tip with a couple of needle leaves, filling about 55% of the square, centred, not cropped. Soft daylight from the top-left. No shadow, no other object. No text. True transparent background PNG (real alpha channel). (Make three different clusters: 1 = purple bells pointing down, 2 = a paler lilac cluster, 3 = a single cream-white bell sprig.)
```

Kontrol: tek küçük salkım; üç dosya farklı; gölge yok; gerçek alfa.

#### 345. W2.13 Funda çiçekçikleri (yanıt gönderilince süzülen) — üç ayrı dosya

- İndirme adı: `35-highland-tartan-thistle__heather_floret_2.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (heather_floret_1, heather_floret_2, heather_floret_3). Make ONLY ONE image now: heather_floret_2 (number 2 of 3).

A single tiny cluster of heather bell flowers, photorealistic, alone, on a fully transparent background: three to five small heather-purple (#7B5A84) bells on a short sprig tip with a couple of needle leaves, filling about 55% of the square, centred, not cropped. Soft daylight from the top-left. No shadow, no other object. No text. True transparent background PNG (real alpha channel). (Make three different clusters: 1 = purple bells pointing down, 2 = a paler lilac cluster, 3 = a single cream-white bell sprig.)
```

Kontrol: tek küçük salkım; üç dosya farklı; gölge yok; gerçek alfa.

#### 346. W2.13 Funda çiçekçikleri (yanıt gönderilince süzülen) — üç ayrı dosya

- İndirme adı: `35-highland-tartan-thistle__heather_floret_3.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (heather_floret_1, heather_floret_2, heather_floret_3). Make ONLY ONE image now: heather_floret_3 (number 3 of 3).

A single tiny cluster of heather bell flowers, photorealistic, alone, on a fully transparent background: three to five small heather-purple (#7B5A84) bells on a short sprig tip with a couple of needle leaves, filling about 55% of the square, centred, not cropped. Soft daylight from the top-left. No shadow, no other object. No text. True transparent background PNG (real alpha channel). (Make three different clusters: 1 = purple bells pointing down, 2 = a paler lilac cluster, 3 = a single cream-white bell sprig.)
```

Kontrol: tek küçük salkım; üç dosya farklı; gölge yok; gerçek alfa.

#### 347. W2.14 Pirinç madalyon çerçevesi (oval foto penceresi)

- İndirme adı: `35-highland-tartan-thistle__locket_rim.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/locket_rim.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1250 px (4:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
An open antique brass locket seen straight from the front, on a fully transparent background, filling the image edge to edge: an oval frame of warm antique brass (#A88437) about 10% of the image width thick, with a fine engraved border of tiny leaves and a slim beaded inner edge, a small round bail and ring at the top centre. The oval opening inside the frame is filled with flat pure green #00FF00 (no texture, no shading): it is 76% of the image width across (from 12% to 88% of the width) and 76% of the image height tall (from 16% to 92% of the height). Soft daylight from the top-left. No hinge lid, no chain, no shadow outside the locket. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: oval pencere düz `#00FF00`, genişlikte %12–%88, yükseklikte %16–%92; üstte halka; kapak/zincir yok; gerçek alfa.

#### 348. W2.15 Madalyon kapağı (menteşede açılan)

- İndirme adı: `35-highland-tartan-thistle__locket_lid.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/locket_lid.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: locket_rim.png (listede #347)

```
The closed front lid of the same antique brass locket as locket_rim.png, alone, seen straight from the front, on a fully transparent background, filling the image edge to edge (an oval, 0.8:1): warm antique brass with a softly domed surface, a delicate engraved spray of heather and a small thistle in the centre, a slim engraved border, a tiny hinge knuckle on the left edge, gentle highlights from the top-left. No bail, no chain, no frame around it, no shadow outside the oval. No text, letters, numbers, monograms, crests or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek oval kapak (0,8:1); ortada funda + devedikeni gravürü; solda küçük menteşe; harf/monogram yok; gerçek alfa.

#### 349. W2.16 Devedikeni (imza süsü)

- İndirme adı: `35-highland-tartan-thistle__thistle.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/thistle.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
A single Scotch thistle with a short stem and two leaves, photorealistic with a soft painterly finish, on a fully transparent background, filling about 88% of the image height: one full flower head with a soft purple tuft (#7B5A84) on a spiky green bulb, a slender stem, two graceful spiny leaves in muted moss green, a tiny sprig of heather crossing the stem. Centred, not cropped. Soft daylight from the top-left. No ribbon, no shadow. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek devedikeni; mor tepe, iki yaprak; kurdele/gölge yok; gerçek alfa.

#### 350. W2.17 Zarftaki kart (boş, oval foto penceresi)

- İndirme adı: `35-highland-tartan-thistle__card_small.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1166 px (0.858:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: cream_paper.png (listede #333)

```
A flat vertical invitation card of the same cream paper as cream_paper.png, exactly 0.858:1, filling the image edge to edge (the card IS the image), seen straight on, with a softly torn deckle edge, a fine engraved brass-coloured border line inset from the edge and a tiny sprig of heather in each top corner, a very soft contact shade on the card itself. In its upper part an oval portrait window filled with flat pure green #00FF00 (no texture, no shading): 46% of the card's width across, horizontally centred, its top at 8% and its bottom at 57% of the card's height. Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: oval pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 351. W2.18 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `35-highland-tartan-thistle__web_hero.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: envelope_back.png (listede #337), strap.png (listede #340), buckle.png (listede #341), heather_sprig.png (listede #342), locket_rim.png (listede #347), hills.png (listede #335)

```
Wide horizontal still life, photorealistic, soft daylight from the top-left: the tartan wool envelope of envelope_back.png, closed, with its straight flap, the leather strap of strap.png and the brass buckle of buckle.png, lying slightly below the centre on a deep moss-green wool throw, a sprig of heather (as heather_sprig.png) and a small thistle laid at the left, an open antique brass locket (as locket_rim.png, its window empty cream) at the right; behind, softly out of focus, an oil-painted Highland landscape with mist (as hills.png). The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers, crests or logos.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı/arma yok.

#### 352. 2.1 Ana portre

- İndirme adı: `35-highland-tartan-thistle__photos__hero_portrait.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Portrait 4:5 wedding photo of the fictional couple Isla and Callum, in their early thirties (Isla: long soft copper-red hair, pale skin with freckles, a slim gold ring; Callum: short dark-brown hair, a neat short beard, fair skin; they must not resemble any real person or celebrity) on a heather-covered hillside in soft overcast light: she in a simple ivory wool-crepe gown with a small posy of heather, he in a moss-green tweed suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, misty hills softly out of focus behind them. Photorealistic, soft heather, moss and cream palette, subtle grain. No text, no frame.
```

#### 353. 2.2 Story 1 — "A wet day on the hill"

- İndirme adı: `35-highland-tartan-thistle__photos__story_1.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #352)

```
Portrait 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing under one shared waxed jacket held over their heads in light rain on a narrow hill path, wet heather around them, soft grey light, misty slopes behind. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 354. 2.3 Story 2 — "A walk by the loch"

- İndirme adı: `35-highland-tartan-thistle__photos__story_2.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #352)

```
Portrait 4:5: the same couple as hero_portrait.jpg walking hand in hand along the stony shore of a calm Highland loch in the evening, seen from slightly behind and to the side, her head turned towards him, low mist over the water and dark hills beyond. Photorealistic, same palette and grain. No text.
```

#### 355. 2.4 Story 3 — "Among the heather"

- İndirme adı: `35-highland-tartan-thistle__photos__story_3.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #352)

```
Portrait 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, holding a small sprig of purple heather, among blooming heather on a hillside, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 356. 2.5 Mekân

- İndirme adı: `35-highland-tartan-thistle__photos__venue.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant old stone country house with tall chimneys and a walled garden at the edge of a wooded Highland glen, a lawn with a few rows of simple wooden chairs set for a ceremony facing a wide view of misty purple hills, soft late-afternoon light. Not a real or famous building, no castle, no people, no signs, no text. Photorealistic, same palette.
```

#### 357. P1 — Ön yüz

- İndirme adı: `35-highland-tartan-thistle__print__invitation_front_5x7.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: cream_paper.png (listede #333), tartan_wool.png (listede #332), heather_divider.png (listede #343)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the cream paper of cream_paper.png. Along the top edge a band of the tartan wool of tartan_wool.png about 12% of the height, with a slim brass-coloured rule on its lower edge and, centred just below the band, a small spray of heather and a thistle (as heather_divider.png), all staying above 17% of the height. Along the bottom edge a matching tartan band about 9% of the height with a slim brass-coloured rule on its upper edge (staying below 88%). The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, crests, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı yok; ekose bantlar yalnız üstte ve altta.

#### 358. P2 — Arka yüz

- İndirme adı: `35-highland-tartan-thistle__print__invitation_back_5x7.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: tartan_wool.png (listede #332)

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream paper, only a narrow tartan band of tartan_wool.png along the top edge (about 7% of the height, with a slim brass-coloured rule on its lower edge, staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flower, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar ekose bandı (%10'un üstünde); %14'ün altı boş; yazı yok.

### 36_Victorian_Glasshouse

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, Latin plant names, labels with writing, logos, monograms or watermarks in any image** (a blank label, a blank seed packet and engraved botanical line art without lettering are fine). Give W3.1 `fern_ground.png`, W3.3 `herbarium_paper.png` and W3.4 `packet_body.png` as the style reference of every later part: the same deep fern green, the same herbarium paper, the same kraft, copper and jute, the same soft daylight through glass.
```

#### 359. W3.1 Koyu eğrelti zemini (açılış, home kartının arkası, imza, gezinme)

- İndirme adı: `36-victorian-glasshouse__fern_ground.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/fern_ground.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat texture of a deep fern-green (#1C3328) surface like the shadowy interior of a Victorian glasshouse at dusk: a soft matte velvet-paper grain, the faintest suggestion of very fine engraved fern fronds tone-on-tone (barely visible, a slightly lighter green, no outline), calm and even everywhere so light text reads on it. No vignette, no gradient, no light spot, no object, no frame. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#1C3328` civarı; desen neredeyse görünmez; yazı yok.

#### 360. W3.2 Buğulu cam zemini (sayfa zemini)

- İndirme adı: `36-victorian-glasshouse__glass_ground.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/glass_ground.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of a pale sage misted glass pane seen straight on (#E2EAE3), lit evenly by daylight: a very soft milky haze, the faintest scattering of tiny condensation dots, a hint of old glass waviness, calm enough for dark text to read on it everywhere. No drops running, no frame, no shadow, no plants behind it, no vignette. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin, açık adaçayı yeşili; dikişsiz; damla/akıntı yok; yazı yok.

#### 361. W3.3 Herbaryum kâğıdı (kartlar, bantlar, etiket, form)

- İndirme adı: `36-victorian-glasshouse__herbarium_paper.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of thick antique herbarium mounting paper in a warm cream (#F3EDDF): a soft cotton tooth, a very faint natural mottling, a gentle warm patina, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no pressed plant, no printing. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin krem; dikişsiz; leke/bitki/baskı yok.

#### 362. W3.4 Tohum paketi — ön duvar (kapalı zarfın gövdesi)

- İndirme adı: `36-victorian-glasshouse__packet_body.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_body.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1032×1440 px (0.717:1) · şeffaf zemin (gerçek alfa) · PNG

```
The front wall of an antique kraft-paper seed packet envelope, seen perfectly straight on, alone on a fully transparent background, filling the image edge to edge (the image IS the paper, about 0.72:1): warm kraft brown paper (#AC8054) with natural fibres and a soft tooth, slightly worn deckled side edges, a straight clean top edge (the mouth of the packet), and in its middle a delicate engraved botanical illustration of a fern frond and a small orchid printed in dark sepia ink as on a Victorian seed packet, framed by a fine printed double rule. The upper 30% of the paper is plain kraft (a flap will cover it). Soft daylight from the top-left. No text, no lettering, no numbers, no brand, no price, no twine, no label. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: kenardan kenara düz kraft; üst kenar düz; ortada sepya eğrelti + orkide gravürü; üst %30 sade; yazı/sicim/etiket yok; alfa.

#### 363. W3.5 Tohum paketi — kapak, dış yüz

- İndirme adı: `36-victorian-glasshouse__packet_flap.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1360×600 px (2.267:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: packet_body.png (listede #362)

```
The top flap of the same kraft seed packet as packet_body.png, folded down, seen perfectly straight on, alone on a fully transparent background, filling the image edge to edge (about 2.27:1): the same warm kraft paper, a straight top edge (the fold), a straight lower edge with a softly deckled border and a slim printed sepia rule just above it, a tiny engraved fern sprig at its centre. Soft daylight from the top-left, a whisper of shade along the lower edge on the flap itself. No text, letters, numbers, no twine, no label, no seal. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen kapak (V değil), üst kenar katlama çizgisi; ortada küçük eğrelti; mühür/sicim/yazı yok; alfa.

#### 364. W3.5b Tohum paketi — kapak, iç yüz

- İndirme adı: `36-victorian-glasshouse__packet_flap_in.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_flap_in.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1360×600 px (2.267:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: packet_flap.png (listede #363)

```
The inside of the same seed packet flap as packet_flap.png, seen straight on as it stands up above the open packet, alone on a fully transparent background, filling the image edge to edge (about 2.27:1): plain, slightly darker unprinted kraft paper with natural fibres, the fold along the BOTTOM edge, the softly deckled free edge along the top, a faint crease. Soft daylight from the top-left. No print, no text, no numbers, no twine, no label. True transparent background PNG (real alpha channel).
```

Kontrol: baskısız iç yüz; katlama altta, serbest kenar üstte; alfa.

#### 365. W3.6 Bakır bitki etiketi (boş; monogram/numara site yazar)

- İndirme adı: `36-victorian-glasshouse__copper_tag.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/copper_tag.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 600×800 px (3:4) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A small antique copper plant label as used in a Victorian glasshouse, seen straight on, alone on a fully transparent background, filling the image edge to edge (3:4): a rectangular copper plate with softly rounded corners and a slim raised rim, warm copper (#B26A3C) with a gentle patina and a little verdigris (#6F9E8E) at the edges, a small round punched hole near the top-left corner filled with flat pure green #00FF00 (no texture, no shading), the centre of the plate smooth and EMPTY (the website stamps letters there). Soft daylight from the top-left. No string, no text, letters, numbers or engraving in the centre. True transparent background PNG (real alpha channel).
```

Kontrol: boş merkez; delik sol üstte, düz `#00FF00`; ip yok; alfa.

#### 366. W3.7 Jüt sicim (dikey, üst–alt dikişsiz)

- İndirme adı: `36-victorian-glasshouse__twine.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/twine.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 160×1200 px (2:15) · şeffaf zemin (gerçek alfa) · PNG

```
A single straight vertical length of natural jute garden twine, two twisted strands, seen straight on, alone on a fully transparent background, running from the very top edge to the very bottom edge of the image, centred, about 40% of the image width thick; warm natural fibre colour with tiny stray fibres. The top and bottom ends must tile vertically without a visible seam (no knot, no cut end). Soft daylight from the top-left. No text. True transparent background PNG (real alpha channel).
```

Kontrol: düz dikey ip; üst–alt dikişsiz; düğüm/uç yok; alfa.

#### 367. W3.8 Cam buğusu (yarı saydam yoğuşma)

- İndirme adı: `36-victorian-glasshouse__glass_mist.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/glass_mist.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1600 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
Condensation on a pane of glass, as a semi-transparent overlay on a fully transparent background, filling the whole square: a soft milky white haze of fine fog (white, about 40–60% opacity, uneven like breath on glass), thousands of tiny condensation droplets of different sizes, a few larger droplets, two or three thin trickles running down. No glass frame, no plants, no colour other than white and transparency, no text. True transparent background PNG (real alpha channel; the haze itself partly transparent).
```

Kontrol: yarı saydam beyaz buğu + damlacıklar; çerçeve/bitki yok; gerçek alfa.

#### 368. W3.9 Dökme demir sera kemerleri (paralaks katmanı)

- İndirme adı: `36-victorian-glasshouse__ironwork.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/ironwork.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×1200 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
The cast-iron ribs of a Victorian glasshouse roof seen from inside, looking up, on a fully transparent background: three slender elegant arches of dark painted cast iron (deep green-black with a hint of verdigris) curving across the upper half of the image, delicate scrollwork brackets where they meet thin columns at the sides, the panes between them fully transparent (no glass colour, no sky). The lower 45% of the image is EMPTY transparency. Soft daylight from the top-left catching the iron. No plants, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: üst yarıda kemerler, alt %45 boş; camlar şeffaf; bitki/yazı yok; alfa.

#### 369. W3.10 Eğrelti otları ve orkide (açılış ve home çerçevesi)

- İndirme adı: `36-victorian-glasshouse__ferns.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/ferns.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×1200 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
Lush botanical fern fronds rising from the bottom-left and bottom-right corners of the image on a fully transparent background, as a frame for something in the middle: maidenhair and sword ferns in deep and fresh greens, a few curled fiddleheads, and on the right one arching spray of white-and-blush moth orchids; photorealistic leaves with the fine detail of a botanical engraving, soft daylight from the top-left. The centre of the image (from 25% to 75% of the width and the whole upper 60%) is EMPTY transparency. No pots, no glass, no insects, no text. True transparent background PNG (real alpha channel).
```

Kontrol: bitkiler alt köşelerde, orta ve üst %60 boş; saksı/yazı yok; alfa.

#### 370. W3.11 Orkide dalı (başlık altı ayırıcı)

- İndirme adı: `36-victorian-glasshouse__orchid_sprig.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/orchid_sprig.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1400×300 px (14:3) · şeffaf zemin (gerçek alfa) · PNG

```
A single slender horizontal sprig in fine botanical engraving style with soft natural colour, on a fully transparent background: a thin arching orchid stem with three small white-and-blush blossoms in the middle and two tiny fern leaflets at the ends, centred, symmetrical in weight, generous empty margin all round. No line, no frame, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: ince, yatay, ortalı; çizgi/yazı yok; alfa.

#### 371. W3.12 Numune camı (4:5 foto vitrini)

- İndirme adı: `36-victorian-glasshouse__specimen_frame.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/specimen_frame.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1250 px (4:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A Victorian botanical specimen case seen straight on, alone on a fully transparent background, filling the image edge to edge (4:5): a slim frame of dark-stained wood with fine copper corner pieces and a narrow cream herbarium-paper mount inside it, a tiny copper ring at the top-right corner. The window inside the mount is a perfect rectangle from 9% to 91% of the width and from 8% to 92% of the height, filled with flat pure green #00FF00 (no texture, no shading, no glass reflection in it). Soft daylight from the top-left. No plant, no label, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen pencere düz `#00FF00`, tarif edilen konumda; yazı/bitki yok; alfa.

#### 372. W3.13 Herbaryum etiketi (boş; yazıyı site koyar)

- İndirme adı: `36-victorian-glasshouse__herbarium_label.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_label.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×360 px (10:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: herbarium_paper.png (listede #361)

```
A blank antique herbarium specimen label seen straight on, alone on a fully transparent background, filling the image edge to edge (10:3): a slip of cream paper slightly warmer than herbarium_paper.png with a finely printed sepia double border and tiny engraved fern sprigs in its two left corners, the inside EMPTY (the website writes the caption there), a very soft shade on the paper itself. No text, letters, numbers or Latin names. True transparent background PNG (real alpha channel).
```

Kontrol: boş iç alan; köşelerde küçük eğrelti; yazı yok; alfa.

#### 373. W3.14 Eğrelti yaprakçıkları (süzülen parçacıklar) — üç ayrı dosya

- İndirme adı: `36-victorian-glasshouse__leaf_1.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (leaf_1, leaf_2, leaf_3). Make ONLY ONE image now: leaf_1 (number 1 of 3).

A single small fern leaflet, alone on a fully transparent background, photorealistic with fine veins, fresh fern green, filling about 55% of the square, centred, not cropped, a soft natural curve. No stem from the edge, no other leaf, no shadow, no text. True transparent background PNG (real alpha channel). (Make three different leaflets: 1 = a maidenhair fern pinnule, 2 = a small sword-fern leaflet, 3 = a curled young fiddlehead.)
```

Kontrol: tek yaprak; üç dosya farklı; alfa.

#### 374. W3.14 Eğrelti yaprakçıkları (süzülen parçacıklar) — üç ayrı dosya

- İndirme adı: `36-victorian-glasshouse__leaf_2.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (leaf_1, leaf_2, leaf_3). Make ONLY ONE image now: leaf_2 (number 2 of 3).

A single small fern leaflet, alone on a fully transparent background, photorealistic with fine veins, fresh fern green, filling about 55% of the square, centred, not cropped, a soft natural curve. No stem from the edge, no other leaf, no shadow, no text. True transparent background PNG (real alpha channel). (Make three different leaflets: 1 = a maidenhair fern pinnule, 2 = a small sword-fern leaflet, 3 = a curled young fiddlehead.)
```

Kontrol: tek yaprak; üç dosya farklı; alfa.

#### 375. W3.14 Eğrelti yaprakçıkları (süzülen parçacıklar) — üç ayrı dosya

- İndirme adı: `36-victorian-glasshouse__leaf_3.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (leaf_1, leaf_2, leaf_3). Make ONLY ONE image now: leaf_3 (number 3 of 3).

A single small fern leaflet, alone on a fully transparent background, photorealistic with fine veins, fresh fern green, filling about 55% of the square, centred, not cropped, a soft natural curve. No stem from the edge, no other leaf, no shadow, no text. True transparent background PNG (real alpha channel). (Make three different leaflets: 1 = a maidenhair fern pinnule, 2 = a small sword-fern leaflet, 3 = a curled young fiddlehead.)
```

Kontrol: tek yaprak; üç dosya farklı; alfa.

#### 376. W3.15 Paketten çıkan kart (boş, 4:5 foto penceresi)

- İndirme adı: `36-victorian-glasshouse__card_small.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 976×1400 px (0.697:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: herbarium_paper.png (listede #361)

```
A flat vertical invitation card of the same cream herbarium paper as herbarium_paper.png, exactly 0.70:1, filling the image edge to edge (the card IS the image), seen straight on, with a finely printed sepia border line inset from the edge and a tiny engraved fern sprig in each lower corner, a very soft contact shade on the card itself. In its upper part a portrait window, a rectangle 58% of the card's width wide and 4:5 tall, horizontally centred, its top edge at 7% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 377. W3.16 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `36-victorian-glasshouse__web_hero.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: ironwork.png (listede #368), packet_body.png (listede #362), ferns.png (listede #369)

```
Wide horizontal still life, photorealistic, soft daylight through old glass from the top-left: inside a Victorian glasshouse with slender cast-iron arches above (as ironwork.png), on a weathered potting bench a kraft seed packet envelope (as packet_body.png, blank, no lettering) tied with jute twine and a small blank copper plant label at the knot, standing slightly below the centre, surrounded by maidenhair ferns and one spray of white moth orchids (as ferns.png), a little condensation on the glass in the background. The top 20% of the image is calm, out-of-focus glasshouse. This image is cropped to 1200×630 for link previews: keep the whole packet visible with at least 5% empty margin below it. No people, no text, letters, numbers, labels with writing or logos.
```

Kontrol: paket bütün ve altta boşluklu; üst %20 sakin; yazı yok.

#### 378. 2.1 Ana portre

- İndirme adı: `36-victorian-glasshouse__photos__hero_portrait.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Flora and Edmund, in their early thirties (Flora: shoulder-length chestnut hair with soft waves, light olive skin, a slim gold ring; Edmund: short black curly hair, a neat short beard, deep brown skin; they must not resemble any real person or celebrity) inside a Victorian glasshouse full of ferns: she in a simple ivory silk gown, he in a deep green suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, soft daylight through the glass roof, slender cast-iron columns softly out of focus behind them. Photorealistic, fern-green, cream and copper palette, subtle grain. No text, no frame.
```

#### 379. 2.2 Story 1 — "Sheltering from the rain"

- İndirme adı: `36-victorian-glasshouse__photos__story_1.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #378)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing as they step in from the rain under the glass roof of an old glasshouse, raindrops on the panes above, his jacket held over both of them, tall ferns around, soft grey daylight. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 380. 2.3 Story 2 — "Our first cutting"

- İndirme adı: `36-victorian-glasshouse__photos__story_2.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #378)

```
Vertical 4:5: the same couple as hero_portrait.jpg at a weathered wooden potting bench, side by side, gently planting a small fern cutting in a terracotta pot together, their hands touching in the soil, smiling, kraft seed packets (blank, no lettering) and jute twine on the bench, soft daylight through glass. Photorealistic, same palette and grain. No text, no labels with writing.
```

#### 381. 2.4 Story 3 — "Yes, among the palms"

- İndirme adı: `36-victorian-glasshouse__photos__story_3.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #378)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, in front of tall palm leaves and ferns inside a glasshouse, a little condensation on a pane behind, soft warm daylight from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 382. 2.5 Mekân

- İndirme adı: `36-victorian-glasshouse__photos__venue.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: the interior of an elegant fictional Victorian glasshouse set for a wedding ceremony, a central aisle between rows of simple wooden chairs, tall palms, ferns and white orchids along the sides, slender white-painted cast-iron arches and a glass roof with soft late-afternoon light, a few strings of warm small lights. No people, no signs, no text. Photorealistic, same palette. Must not resemble a specific real conservatory.
```

#### 383. P1 — Ön yüz

- İndirme adı: `36-victorian-glasshouse__print__invitation_front_5x7.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: herbarium_paper.png (listede #361), ironwork.png (listede #368), ferns.png (listede #369)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the cream herbarium paper of herbarium_paper.png. Along the top edge a band of slender cast-iron glasshouse arches in deep fern green (as ironwork.png, small) with maidenhair fern fronds hanging from them, staying above 16% of the height; at the two bottom corners small sprays of ferns and one white orchid (as ferns.png, small), staying below 88% of the height and outside the middle 60% of the width. The rectangle from 17% to 89% of the height and from 9% to 91% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no leaf, no line, no shadow, no stain in it. No text, letters, numbers, Latin names, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %17–%89 × %9–%91 tamamen boş; yazı yok; süs yalnız üst bantta ve alt köşelerde.

#### 384. P2 — Arka yüz

- İndirme adı: `36-victorian-glasshouse__print__invitation_back_5x7.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream herbarium paper, only a narrow band of fern fronds along the top edge (about 8% of the height, staying above 10% of the height). Everything below 11% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no leaf, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar eğrelti bandı (%10'un üstünde); %11'in altı boş; yazı yok.

### 37_Art_Nouveau_Lily

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms, logos, signatures or watermarks in any image.** Give W2.1 `cream_paper.png`, W2.4 `env_back.png` and W2.6 `petal_centre.png` as the style reference of every later part: the same cream paper, the same soft gold, the same sage and lilac, the same Art Nouveau line (Mucha-style poster + stained glass). No peacock feathers anywhere (that is another design).
```

#### 385. W2.1 Krem kâğıt (zarf, kartlar, bantlar, form)

- İndirme adı: `37-art-nouveau-lily__cream_paper.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine cream cotton paper (#F4ECDB), like the paper of an Art Nouveau print: a gentle natural tooth, very faint fibres, a soft warm tone, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu yazı her yerde okunur); krem; dikişsiz; leke/baskı yok.

#### 386. W2.2 Adaçayı zemin (sayfa zemini)

- İndirme adı: `37-art-nouveau-lily__sage_paper.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/sage_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of a deep sage-green poster paper (#55634E), like the background of an Art Nouveau lithograph: a soft mottled printed tone with a very faint lighter sage cloudiness, a fine paper grain, matte. Calm and even everywhere so cream text reads on it, no pattern, no flowers, no lines, no vignette, no gradient across the image. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz; koyu adaçayı, sakin; desen/çizgi yok; üstünde krem yazı okunur.

#### 387. W2.3 Leylak astar (zarfın içi + kapakların arka yüzü)

- İndirme adı: `37-art-nouveau-lily__lilac_lining.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lilac_lining.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of an envelope lining paper in soft lilac (#C8B6D6) printed with a delicate Art Nouveau pattern of small stylised lilies and slender curving stems in a slightly deeper lilac (#7D6A92) and a few fine gold-leaf lines (#B8964E), evenly spread, quiet and elegant, like a fine stationery liner. Flat, evenly lit, no shadow, no vignette, no fold. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz; leylak, sakin desen; altın çizgiler ince; yazı yok.

#### 388. W2.4 Açık zarfın arkası (astar görünür; kapaksız)

- İndirme adı: `37-art-nouveau-lily__env_back.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_back.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: cream_paper.png (listede #385), lilac_lining.png (listede #387)

```
The back half of an open portrait envelope seen straight from the front, on a fully transparent background, the envelope filling the image edge to edge (the image IS the envelope, 0.758:1): cream cotton paper (as cream_paper.png) with a slim cream border all round, and inside it the lilac lining (as lilac_lining.png) visible over the upper two thirds, softly shaded at the top as if inside an envelope. NO flaps at all (the flaps are separate images), no front panel, no card, no seal. Soft daylight from the top-left. No cast shadow outside the envelope. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: zarf tuvali dolduruyor (0,758:1); kapak, cep, kart yok; astar üst üçte ikide; gerçek alfa.

#### 389. W2.5 Zarfın cebi (kart buradan yükselir)

- İndirme adı: `37-art-nouveau-lily__env_pocket.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (listede #388)

```
Only the front pocket of the same envelope as env_back.png, on the same 1000×1320 canvas and in the same place, on a fully transparent background: the lower part of the envelope front in cream paper, from the bottom edge up to an elegant softly rising Art Nouveau top edge — a gentle double curve that rises to a soft point in the middle at about 55% of the image height and sits at about 61% at both sides — the top edge trimmed with a thin gold-leaf whiplash line. Everything above that edge is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper just under the top edge. No flaps, no card, no seal. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: aynı tuval, aynı yer (env_back ile üst üste tam oturur); üst kenar yumuşak çift kıvrım + ince altın; üstü şeffaf.

#### 390. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_left.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_left.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (listede #388), env_pocket.png (listede #389), cream_paper.png (listede #385)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_left (number 1 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 391. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_right.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_right.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (listede #388), env_pocket.png (listede #389), cream_paper.png (listede #385)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_right (number 2 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 392. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_centre.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_centre.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (listede #388), env_pocket.png (listede #389), cream_paper.png (listede #385)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_centre (number 3 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 393. W2.7 Vitray zambak madalyonu (kapakların buluştuğu yer)

- İndirme adı: `37-art-nouveau-lily__lily_medallion.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lily_medallion.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×800 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A small round stained-glass medallion, seen straight on, on a fully transparent background, filling about 92% of the square: a single white lily in leaded stained glass (white and pale cream petals, sage-green leaves, a soft lilac and pale gold glass background, thin dark lead lines), set in a slim gold Art Nouveau frame of flowing whiplash curves. The glass looks lit from behind, glowing gently. Centered, not cropped. No shadow, no background, no text, letters, numbers or symbols, no religious symbol. True transparent background PNG (real alpha channel).
```

Kontrol: tek yuvarlak madalyon; zambak + vitray kurşun çizgileri; altın kıvrım çerçeve; alfa.

#### 394. W2.8 Cepten yükselen kart (boş, kemerli foto penceresi)

- İndirme adı: `37-art-nouveau-lily__card_small.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1008×1400 px (18:25) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: cream_paper.png (listede #385)

```
A flat vertical invitation card of the same cream paper as cream_paper.png, exactly 0.72:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine flowing gold-leaf Art Nouveau border inset from the edge (whiplash curves meeting in small lily buds at the top corners), a very soft contact shade on the card itself. In its upper part an arched portrait window (a rounded arch on top, straight sides, flat bottom), 5:7 tall, 50% of the card's width across, horizontally centred, its top at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: kemer pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 395. W2.9 Vitray kemer çerçeve (bütün portre fotoğrafları)

- İndirme adı: `37-art-nouveau-lily__arch_window.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/arch_window.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1300 px (10:13) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A tall arched stained-glass window frame, seen straight on, on a fully transparent background, filling the image edge to edge: a band of leaded stained glass about 15% of the width wide running round a rounded arch with straight sides and a flat bottom — white lilies, sage-green leaves and curling stems in soft jewel-toned glass (cream, sage, lilac, pale gold) with thin dark lead lines, held in a slim gold Art Nouveau whiplash moulding on its outer edge. The opening in the middle is an arch (rounded top, straight sides, flat bottom) exactly 70% of the image width across and 5:7 tall (700 × 980 px), its left edge at 150 px and its top at 170 px, filled with flat pure green #00FF00 (no texture, no shading). Soft daylight from the top-left, the glass gently glowing. No text, letters, numbers or symbols, no saints, no religious symbol. True transparent background PNG (real alpha channel).
```

Kontrol: kemer pencere düz `#00FF00`, 5:7, ölçü/konum tarif gibi; vitray bant; yazı/dini simge yok; alfa.

#### 396. W2.10 Mozaik altın hâle (home kartının arkası)

- İndirme adı: `37-art-nouveau-lily__halo.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/halo.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1400×1400 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A large decorative circular halo in the manner of an Art Nouveau poster, on a fully transparent background, filling about 96% of the square: a wide ring of tiny gold and pale-gold mosaic tesserae with a few soft sage and lilac tesserae, framed by thin flowing gold whiplash lines and a delicate ring of small stylised lilies, the centre of the circle (about 55% of its width) left fully transparent. Gentle, warm, light, decorative — a pattern behind a portrait, not a religious nimbus. No figure, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: daire halka, ortası boş (şeffaf); mozaik altın; dini simge yok; alfa.

#### 397. W2.11 Zambak demeti (kenarlar, imzalar)

- İndirme adı: `37-art-nouveau-lily__lily_spray.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lily_spray.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 900×1400 px (9:14) · şeffaf zemin (gerçek alfa) · PNG

```
A tall spray of three white lilies with long sage-green leaves and a few buds on slender curving stems, in the style of an Art Nouveau poster (soft flat colour with fine dark outlines, gentle shading), rising from the bottom edge of the image and leaning slightly to the right, on a fully transparent background, filling the height of the image. Cream-white petals, pale gold stamens, sage leaves. No vase, no ground, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek demet, alttan yükselir; düz poster rengi + ince kontur; alfa.

#### 398. W2.12 Altın kıvrım çizgisi (başlık altı ayırıcı)

- İndirme adı: `37-art-nouveau-lily__whiplash.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/whiplash.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×300 px (16:3) · şeffaf zemin (gerçek alfa) · PNG

```
A single horizontal Art Nouveau divider in fine gold leaf (#B8964E with lighter highlights), on a fully transparent background: one long flowing "whiplash" line that curls from the left, swells gracefully to a small lily bud in the centre and curls out to the right, with a few thin secondary tendrils, symmetrical, centred, with a generous empty margin. Line only, no filled shapes other than the small bud. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek yatay çizgi, ortada küçük tomurcuk; altın; alfa.

#### 399. W2.13 Zambak yaprağı (süzülen parça)

- İndirme adı: `37-art-nouveau-lily__petal_drift.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_drift.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single loose white lily petal, slightly curved, cream-white with a faint lilac blush at its base and fine veins, lying at a gentle angle, alone, on a fully transparent background, filling about 60% of the square. Centered, not cropped. No shadow, no other petal, no text. True transparent background PNG (real alpha channel).
```

Kontrol: tek yaprak; alfa.

#### 400. W2.14 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `37-art-nouveau-lily__web_hero.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: env_back.png (listede #388), lily_medallion.png (listede #393), lily_spray.png (listede #397)

```
Wide horizontal still life, photorealistic with an Art Nouveau poster mood, soft daylight from the top-left: the closed cream envelope of env_back.png with its three petal flaps and the stained-glass lily medallion (as lily_medallion.png) standing slightly below the centre on a deep sage linen surface, a spray of white lilies (as lily_spray.png) lying at the left, a small gold whiplash ornament and a lilac silk ribbon at the right; a soft sage background above. The top 20% of the image is calm, empty background. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers or symbols, no logos.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 boş; yazı yok.

#### 401. 2.1 Ana portre

- İndirme adı: `37-art-nouveau-lily__photos__hero_portrait.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1000×1400 px (5:7) · opak · JPG

```
Vertical 5:7 wedding portrait of the fictional couple Odette and Felix, in their early thirties (Odette: dark-brown hair in a soft low chignon, light olive skin, a slim gold ring; Felix: short wavy light-brown hair, a neatly trimmed beard, fair skin; they must not resemble any real person or celebrity) in a garden in early summer: she in a simple cream silk gown holding a few white lilies, he in a sage-grey suit, standing close and smiling at each other, waist-up, faces in the upper-middle of the frame, a softly blurred old villa with tall arched windows and greenery behind them. Photorealistic, soft sage, cream and gold palette, subtle grain. No text, no frame.
```

#### 402. 2.2 Story 1 — "A rainy afternoon in a museum"

- İndirme adı: `37-art-nouveau-lily__photos__story_1.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1000×1400 px (5:7) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #401)

```
Vertical 5:7 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) in a quiet museum gallery on a rainy afternoon, standing side by side in front of a large softly blurred stained-glass window, she laughing and turning towards him, he holding a folded umbrella, raincoats damp, warm light. No readable signs, no artwork recognisable as a real painting, no text. Photorealistic, same palette and grain.
```

#### 403. 2.3 Story 2 — "A summer of letters"

- İndirme adı: `37-art-nouveau-lily__photos__story_2.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1000×1400 px (5:7) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #401)

```
Vertical 5:7: the same couple as hero_portrait.jpg on a sunny balcony with wrought-iron railings, she sitting on a café chair reading a handwritten letter with a smile (the writing is not readable), he leaning on the railing beside her, a few envelopes and a cup of coffee on a small table, soft summer light, green plants. No readable text. Photorealistic, same palette and grain.
```

#### 404. 2.4 Story 3 — "Among the lilies"

- İndirme adı: `37-art-nouveau-lily__photos__story_3.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1000×1400 px (5:7) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #401)

```
Vertical 5:7 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones) among white lilies in a garden bed, her hand with a slim gold engagement ring resting in his, soft late-afternoon light from the top-left, shallow depth of field, sage leaves around. Photorealistic, same palette and grain. No text.
```

#### 405. 2.5 Mekân

- İndirme adı: `37-art-nouveau-lily__photos__venue.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant garden of an early-1900s villa (fictional) with curved wrought-iron balconies and tall arched windows, a lawn with a few rows of simple white chairs set for a ceremony facing a small arbour of white lilies and greenery, beds of white lilies and lilac flowers, soft early-summer afternoon light. No people, no signs, no text. Photorealistic, same palette. Not a real, recognisable building.
```

#### 406. P1 — Ön yüz

- İndirme adı: `37-art-nouveau-lily__print__invitation_front_5x7.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: cream_paper.png (listede #385), lily_medallion.png (listede #393)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat, in the style of an Art Nouveau poster: the whole sheet is the cream paper of cream_paper.png. Along the top edge an arched band about 13% of the height: a small stained-glass lily medallion (as lily_medallion.png) in the centre with flowing gold whiplash lines spreading from it to both sides over a soft sage ground, staying above 15% of the height. Along the bottom edge a matching low band about 10% of the height of sage-green leaves, two small white lilies and a slim gold whiplash line (staying below 87%). Thin gold whiplash lines may run down the outer 6% of each side. The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no line, no flower, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı yok; süs yalnız üst/alt bantlarda ve kenarlarda.

#### 407. P2 — Arka yüz

- İndirme adı: `37-art-nouveau-lily__print__invitation_back_5x7.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream paper, only a narrow band along the top edge (about 7% of the height: a slim gold whiplash line with a tiny lily bud in the centre over a thin sage strip, staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no line, no flower, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar bant (%10'un üstünde); %14'ün altı boş; yazı yok.

### 38_Papel_Picado_Fiesta

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, words cut into the paper, names, dates, logos, monograms or watermarks in any image.** **No religious symbols** (no crosses, saints, hearts with flames or thorns, churches, altars) and **no Day of the Dead imagery** (no skulls, skeletons, calaveras, marigold altars): this is a joyful wedding fiesta. Give W1 `kraft_paper.png`, W3 `cream_paper.png` and W8 `flag_1.png` as the style reference of every later part: the same kraft, the same cream paper, the same crisp hand-cut tissue paper in the same six colours, the same warm afternoon sun from the top-left.
```

#### 408. W1 Kraft kâğıt (zarf, program kartı)

- İndirme adı: `38-papel-picado-fiesta__kraft_paper.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/kraft_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat top-down texture of natural brown kraft paper (#B78A5B), like a sturdy recycled kraft envelope: fine visible wood fibres and tiny darker flecks, a soft matte tooth, an even warm tone with only the gentlest natural variation. Evenly lit from the top-left, no fold, no crease, no stain, no shadow, no vignette, no printing, no pattern. Calm enough for dark brown text to read on it. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); kraft kahve `#B78A5B` civarı; leke/kat yok; üstüne koyu yazı okunur.

#### 409. W2 Kireç badanalı duvar (sayfa zemini)

- İndirme adı: `38-papel-picado-fiesta__limewash_wall.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/limewash_wall.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of a sunlit limewashed courtyard wall in a very pale warm cream (#F5E9D8): soft cloudy limewash brush movement, a fine sandy plaster grain, the faintest warm blush in places, very low contrast so text in any colour reads on it everywhere. Flat, evenly lit, no cracks, no stains, no shadow, no vignette, no objects, no tiles. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: çok açık, sakin (her yerde yazı okunur); dikişsiz; çatlak/leke yok.

#### 410. W3 Krem kart kâğıdı (kartlar, bantlar, form)

- İndirme adı: `38-papel-picado-fiesta__cream_paper.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/cream_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of thick handmade cotton card stock in a warm cream (#FBF4E8): a soft felt tooth, a few faint cotton fibres, an even warm tone, calm enough for dark text everywhere. Evenly lit from the top-left, no deckle edge, no shadow, no vignette, no fold, no stain, no printing, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin krem; dikişsiz; leke/baskı yok.

#### 411. W4 Terrakota (home "The Day" bandı)

- İndirme adı: `38-papel-picado-fiesta__terracotta.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/terracotta.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of a sun-warmed terracotta-painted plaster wall (#B0502F): a smooth hand-troweled finish with soft tonal clouds between a slightly deeper and a slightly lighter terracotta, a fine sandy grain, matte. Even, calm and dark enough for cream text to read on it everywhere. No cracks, no tiles, no stains, no shadow, no vignette, no objects. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: terrakota `#B0502F` civarı; krem yazı her yerde okunur; dikişsiz.

#### 412. W5 Zarfın cebi (arkadan, kapaksız)

- İndirme adı: `38-papel-picado-fiesta__envelope_pocket.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1110×1500 px (0.740:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: kraft_paper.png (listede #408)

```
The back of a portrait kraft paper envelope seen perfectly straight on, on a fully transparent background, the envelope filling the image edge to edge (the image IS the envelope, 0.74:1): the same kraft paper as kraft_paper.png, the two side flaps and the bottom flap folded in and glued, their soft fold lines and slightly lifted paper edges visible, the top edge straight and open (this is where the card comes out — no flap is drawn, no V shape at the top). Warm sun from the top-left, a soft natural shade along the folds. No seal, no sticker, no stamp, no string, no card inside, no cast shadow outside the envelope. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: zarf tuvali dolduruyor (0,74:1); üstte düz açık kenar, V kapak **yok**; mühür/ip yok; gerçek alfa.

#### 413. W6 Düz kapak (dış yüz)

- İndirme adı: `38-papel-picado-fiesta__envelope_flap.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1110×450 px (2.467:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_pocket.png (listede #412)

```
The closed straight flap of the same kraft envelope as envelope_pocket.png, alone, seen straight on, on a fully transparent background, filling the image edge to edge: a wide rectangle of the same kraft paper, exactly as wide as the envelope, with softly rounded bottom corners and a straight bottom edge (NOT a V, NOT a point), the top edge a crisp fold line, a very soft shade along the bottom edge where it lies on the envelope. Warm sun from the top-left. No seal, no sticker, no string. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen düz kapak, alt kenar düz (V/sivri değil); zarfla aynı kraft; alfa.

#### 414. W7 Kapak astarı (işlemeli kumaş)

- İndirme adı: `38-papel-picado-fiesta__flap_liner.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flap_liner.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1110×450 px (2.467:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_flap.png (listede #413)

```
The inside of the same straight envelope flap, alone, seen straight on as it stands up when the flap is open, on a fully transparent background, filling the image edge to edge, the same outline as envelope_flap.png but mirrored vertically: its BOTTOM edge is the straight fold line and its rounded corners are at the TOP. It is lined with a cream cotton fabric densely hand-embroidered with bright folk flowers, leaves and small birds in fuchsia, marigold, turquoise, lime, violet and coral satin stitch (a joyful, generic folk-floral embroidery — not a copy of any specific community's traditional design), a slim band of kraft paper showing at the edges. Warm sun from the top-left. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: alt kenar düz katlama çizgisi, yuvarlak köşeler üstte; işlemeli çiçekli kumaş astar; alfa.

#### 415. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_1.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_1 (number 1 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 416. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_2.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_2 (number 2 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 417. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_3.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_3 (number 3 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 418. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_4.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_4.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_4 (number 4 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 419. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_5.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_5.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_5 (number 5 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 420. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_6.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_6.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_6 (number 6 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 421. W9 Ampul (ampul dizisi; tek sprite)

- İndirme adı: `38-papel-picado-fiesta__bulb.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bulb.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 400×640 px (5:8) · şeffaf zemin (gerçek alfa) · PNG

```
A single lit festoon string-light bulb hanging straight down, alone, seen from the front, on a fully transparent background: a small black rubber socket at the top with a short stub of black cord going up to the top edge, below it a round clear glass globe bulb with a glowing warm filament (#FFC861), the glass catching a little sun from the top-left, and a soft warm glow halo around the globe that fades to full transparency well inside the image edges. Centered, not cropped. No other bulbs, no wire running sideways. No text. True transparent background PNG (real alpha channel; the glow is semi-transparent, not a solid disc).
```

Kontrol: tek ampul, üstte duy + kısa kablo; hâle yarı saydam ve kenara değmiyor; alfa.

#### 422. W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__frame_1.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1200 px (5:6) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
This prompt describes a set of 3 separate images (frame_1, frame_2, frame_3). Make ONLY ONE image now: frame_1 (number 1 of 3).

A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```

Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.

#### 423. W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__frame_2.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1200 px (5:6) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
This prompt describes a set of 3 separate images (frame_1, frame_2, frame_3). Make ONLY ONE image now: frame_2 (number 2 of 3).

A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```

Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.

#### 424. W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__frame_3.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1200 px (5:6) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
This prompt describes a set of 3 separate images (frame_1, frame_2, frame_3). Make ONLY ONE image now: frame_3 (number 3 of 3).

A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```

Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.

#### 425. W11 Geniş kâğıt kesim çerçeve (mekân fotoğrafı)

- İndirme adı: `38-papel-picado-fiesta__frame_wide.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_wide.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1000 px (8:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A wide papel picado photo frame in coral tissue paper (#E85637), alone, seen straight on, on a fully transparent background, filling the image edge to edge: an intricate symmetrical cut-paper border of flowers, leaves, vines and scallops (the cut-outs truly transparent), the top edge folded over natural twine with two small hanging loops. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges). Warm sun from the top-left. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel).
```

Kontrol: pencere düz `#00FF00`, 1360×765 (16:9), sol üst (120, 150); kesik yerler şeffaf; alfa.

#### 426. W12 Bugenvil salkımı (köşe süsü)

- İndirme adı: `38-papel-picado-fiesta__bougainvillea.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bougainvillea.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1000 px (6:5) · şeffaf zemin (gerçek alfa) · PNG

```
A lush cluster of magenta-fuchsia bougainvillea spilling diagonally from the top-left corner toward the centre, alone, on a fully transparent background: woody stems, fresh green leaves, many papery bracts in vivid fuchsia with tiny cream flowers at their hearts, a few single bracts drifting loose near the tips, photorealistic in warm top-left sun. The cluster touches the top and left edges and leaves the bottom-right third empty. No pot, no wall, no shadow, no other flower. No text. True transparent background PNG (real alpha channel).
```

Kontrol: salkım sol üst köşeden taşar; sağ alt üçte bir boş; saksı/duvar yok; alfa.

#### 427. W13 İşlemeli kumaş bandı (bölüm ayırıcı)

- İndirme adı: `38-papel-picado-fiesta__embroidery_band.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/embroidery_band.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 2400×160 px (15:1) · opak · PNG

```
A long horizontal strip of cream cotton fabric (#FBF4E8) hand-embroidered along its whole length with a continuous row of small bright folk flowers and leaves in fuchsia, marigold, turquoise, lime, violet and coral satin stitch, between two slim stitched lines, seen perfectly flat and straight on, filling the image edge to edge. The left and right edges must tile seamlessly when repeated side by side. Even warm light. A joyful generic folk-floral embroidery, not a copy of any specific community's traditional design. No text, letters, numbers or symbols.
```

Kontrol: yatayda dikişsiz; tek sıra çiçek; krem zemin; yazı yok.

#### 428. W14 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `38-papel-picado-fiesta__web_hero.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: envelope_pocket.png (listede #412), limewash_wall.png (listede #409), bougainvillea.png (listede #426), cream_paper.png (listede #410), bulb.png (listede #421)

```
Wide horizontal still life, photorealistic, warm late afternoon sun from the top-left: the portrait kraft envelope of envelope_pocket.png with its straight flap closed and a belly band of six papel picado flags (as flag_1–6.png) wrapped across it, lying slightly below the centre on a sunlit limewash courtyard table (as limewash_wall.png), a sprig of fuchsia bougainvillea (as bougainvillea.png) at the left, a cream card (as cream_paper.png, blank) and a small terracotta dish at the right; above, out of focus, a garland of papel picado flags and a string of glowing bulbs (as bulb.png) across a warm wall. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers or symbols, no logos.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı yok.

#### 429. 2.1 Ana portre

- İndirme adı: `38-papel-picado-fiesta__photos__hero_portrait.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Valeria and Diego, in their early thirties (Valeria: long dark-brown wavy hair half up with a small fuchsia flower, warm olive-tan skin, a slim gold ring; Diego: short black hair, a neat short beard, medium-brown skin; they must not resemble any real person or celebrity) in a sunlit courtyard: she in a simple ivory gown with fine lace sleeves, he in a light sand-coloured suit with a fuchsia boutonnière, standing close and laughing, waist-up, faces in the upper middle of the frame; behind them, softly out of focus, a limewash wall with fuchsia bougainvillea and a garland of colourful papel picado flags. Photorealistic, warm sunny palette, subtle grain. No text, no frame.
```

#### 430. 2.2 Story 1 — "Our first dance"

- İndirme adı: `38-papel-picado-fiesta__photos__story_1.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #429)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) dancing and laughing at an open-air summer evening market, she mid-twirl with her skirt flaring, he holding her hand, warm string lights and blurred colourful paper flags overhead, other people only as soft out-of-focus shapes. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 431. 2.3 Story 2 — "Sunset on the river"

- İndirme adı: `38-papel-picado-fiesta__photos__story_2.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #429)

```
Vertical 4:5: the same couple as hero_portrait.jpg walking hand in hand along a quiet stone riverside path at golden hour, seen slightly from behind and to the side, her head turned toward him, cypress trees and a small arched stone footbridge softly in the background, warm light on the water. A generic place, not a recognisable landmark. Photorealistic, same palette and grain. No text.
```

#### 432. 2.4 Story 3 — "Under the lights"

- İndirme adı: `38-papel-picado-fiesta__photos__story_3.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #429)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, against a softly blurred background of glowing string-light bulbs and colourful papel picado flags at dusk, a few warm bokeh circles, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 433. 2.5 Mekân

- İndirme adı: `38-papel-picado-fiesta__photos__venue.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: a sunlit Spanish-colonial-style courtyard prepared for a wedding — limewash walls draped with fuchsia bougainvillea, terracotta floor tiles, a small stone fountain, rows of simple wooden chairs with a central aisle, and overhead criss-crossing garlands of colourful papel picado flags and festoon string lights. No people, no signs, no text, no religious objects. Photorealistic, warm late afternoon light, same palette.
```

#### 434. P1 — Ön yüz

- İndirme adı: `38-papel-picado-fiesta__print__invitation_front_5x7.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: cream_paper.png (listede #410), bougainvillea.png (listede #426), embroidery_band.png (listede #427)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm cream card stock of cream_paper.png. Across the top, a garland of six small papel picado flags (as flag_1–6.png, fuchsia, marigold, turquoise, lime, violet, coral) hanging from a natural twine that sags gently from the top corners, the flags' lowest points staying above 17% of the height; a small sprig of fuchsia bougainvillea (as bougainvillea.png) tucked at the top-left corner. Along the bottom edge a slim band of the embroidered folk-flower ribbon of embroidery_band.png, about 5% of the height, staying below 92%. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flag, no petal, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; yazı yok; süs dizisi yalnız üstte, nakış bandı yalnız altta.

#### 435. P2 — Arka yüz

- İndirme adı: `38-papel-picado-fiesta__print__invitation_back_5x7.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream card stock, only a short garland of four small papel picado flags (as flag_1–6.png) hanging from a twine across the top centre, their lowest points staying above 11% of the height. Everything below 13% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flag, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte kısa süs dizisi (%11'in üstünde); %13'ün altı boş; yazı yok.


## B · Tasarım 01–21 rötuş / baskı parçaları

### 01_Olive_Ivory

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 436. P1 — invitation_card_print

- İndirme adı: `01-olive-ivory__invitation_card_print.png`
- Hedef: `collections/01_Olive_Ivory/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/01_Olive_Ivory/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 437. P2 — info_card_print

- İndirme adı: `01-olive-ivory__info_card_print.png`
- Hedef: `collections/01_Olive_Ivory/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/01_Olive_Ivory/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 02_Dusty_Blue

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 438. P1 — invitation_card_print

- İndirme adı: `02-dusty-blue__invitation_card_print.png`
- Hedef: `collections/02_Dusty_Blue/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/02_Dusty_Blue/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 439. P2 — info_card_print

- İndirme adı: `02-dusty-blue__info_card_print.png`
- Hedef: `collections/02_Dusty_Blue/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/02_Dusty_Blue/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 03_Blush_Garden_Rose

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate every image below in order. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except PAKET 4 T1 comps, which are layout references. Keep ONE consistent illustration style across this file.
```

#### 440. P1 — invitation_card_print

- İndirme adı: `03-blush-garden-rose__invitation_card_print.png`
- Hedef: `collections/03_Blush_Garden_Rose/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/03_Blush_Garden_Rose/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 441. P2 — info_card_print

- İndirme adı: `03-blush-garden-rose__info_card_print.png`
- Hedef: `collections/03_Blush_Garden_Rose/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/03_Blush_Garden_Rose/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 04_Vintage_Airmail

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 442. P1 — invitation_card_print

- İndirme adı: `04-vintage-airmail__invitation_card_print.png`
- Hedef: `collections/04_Vintage_Airmail/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/04_Vintage_Airmail/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 443. P2 — info_card_print

- İndirme adı: `04-vintage-airmail__info_card_print.png`
- Hedef: `collections/04_Vintage_Airmail/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/04_Vintage_Airmail/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 05_Lemon_Mediterranean

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 444. P1 — invitation_card_print

- İndirme adı: `05-lemon-mediterranean__invitation_card_print.png`
- Hedef: `collections/05_Lemon_Mediterranean/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/05_Lemon_Mediterranean/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 445. P2 — info_card_print

- İndirme adı: `05-lemon-mediterranean__info_card_print.png`
- Hedef: `collections/05_Lemon_Mediterranean/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/05_Lemon_Mediterranean/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 06_Art_Deco_Noir

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 446. P1 — invitation_card_print

- İndirme adı: `06-art-deco-noir__invitation_card_print.png`
- Hedef: `collections/06_Art_Deco_Noir/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/06_Art_Deco_Noir/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 447. P2 — info_card_print

- İndirme adı: `06-art-deco-noir__info_card_print.png`
- Hedef: `collections/06_Art_Deco_Noir/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/06_Art_Deco_Noir/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 07_Burgundy_Velvet

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 448. P1 — invitation_card_print

- İndirme adı: `07-burgundy-velvet__invitation_card_print.png`
- Hedef: `collections/07_Burgundy_Velvet/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/07_Burgundy_Velvet/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 449. P2 — info_card_print

- İndirme adı: `07-burgundy-velvet__info_card_print.png`
- Hedef: `collections/07_Burgundy_Velvet/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/07_Burgundy_Velvet/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 08_Winter_Evergreen

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 450. P1 — invitation_card_print

- İndirme adı: `08-winter-evergreen__invitation_card_print.png`
- Hedef: `collections/08_Winter_Evergreen/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/08_Winter_Evergreen/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 451. P2 — info_card_print

- İndirme adı: `08-winter-evergreen__info_card_print.png`
- Hedef: `collections/08_Winter_Evergreen/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/08_Winter_Evergreen/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 09_Lavender_Provence

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 452. P1 — invitation_card_print

- İndirme adı: `09-lavender-provence__invitation_card_print.png`
- Hedef: `collections/09_Lavender_Provence/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/09_Lavender_Provence/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 453. P2 — info_card_print

- İndirme adı: `09-lavender-provence__info_card_print.png`
- Hedef: `collections/09_Lavender_Provence/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/09_Lavender_Provence/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 10_Tuscan_Vineyard

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 454. P1 — invitation_card_print

- İndirme adı: `10-tuscan-vineyard__invitation_card_print.png`
- Hedef: `collections/10_Tuscan_Vineyard/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/10_Tuscan_Vineyard/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 455. P2 — info_card_print

- İndirme adı: `10-tuscan-vineyard__info_card_print.png`
- Hedef: `collections/10_Tuscan_Vineyard/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/10_Tuscan_Vineyard/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 11_Boho_Pampas

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 456. P1 — invitation_card_print

- İndirme adı: `11-boho-pampas__invitation_card_print.png`
- Hedef: `collections/11_Boho_Pampas/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/11_Boho_Pampas/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 457. P2 — info_card_print

- İndirme adı: `11-boho-pampas__info_card_print.png`
- Hedef: `collections/11_Boho_Pampas/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/11_Boho_Pampas/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 12_Tropical_Destination

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 458. P1 — invitation_card_print

- İndirme adı: `12-tropical-destination__invitation_card_print.png`
- Hedef: `collections/12_Tropical_Destination/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/12_Tropical_Destination/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 459. P2 — info_card_print

- İndirme adı: `12-tropical-destination__info_card_print.png`
- Hedef: `collections/12_Tropical_Destination/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/12_Tropical_Destination/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 13_Enchanted_Forest

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 460. P1 — invitation_card_print

- İndirme adı: `13-enchanted-forest__invitation_card_print.png`
- Hedef: `collections/13_Enchanted_Forest/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/13_Enchanted_Forest/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 461. P2 — info_card_print

- İndirme adı: `13-enchanted-forest__info_card_print.png`
- Hedef: `collections/13_Enchanted_Forest/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/13_Enchanted_Forest/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 14_Ivory_Lace_Pearl

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 462. P1 — invitation_card_print

- İndirme adı: `14-ivory-lace-pearl__invitation_card_print.png`
- Hedef: `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/14_Ivory_Lace_Pearl/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 463. P2 — info_card_print

- İndirme adı: `14-ivory-lace-pearl__info_card_print.png`
- Hedef: `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/14_Ivory_Lace_Pearl/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 15_Cherry_Blossom

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 464. P1 — invitation_card_print

- İndirme adı: `15-cherry-blossom__invitation_card_print.png`
- Hedef: `collections/15_Cherry_Blossom/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/15_Cherry_Blossom/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 465. P2 — info_card_print

- İndirme adı: `15-cherry-blossom__info_card_print.png`
- Hedef: `collections/15_Cherry_Blossom/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/15_Cherry_Blossom/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 16_Sunflower_Rustic

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 466. P1 — invitation_card_print

- İndirme adı: `16-sunflower-rustic__invitation_card_print.png`
- Hedef: `collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 467. P2 — info_card_print

- İndirme adı: `16-sunflower-rustic__info_card_print.png`
- Hedef: `collections/16_Sunflower_Rustic/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 17_Emerald_Gold_Estate

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 468. P1 — invitation_card_print

- İndirme adı: `17-emerald-gold-estate__invitation_card_print.png`
- Hedef: `collections/17_Emerald_Gold_Estate/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/17_Emerald_Gold_Estate/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 469. P2 — info_card_print

- İndirme adı: `17-emerald-gold-estate__info_card_print.png`
- Hedef: `collections/17_Emerald_Gold_Estate/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/17_Emerald_Gold_Estate/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 18_Wildflower_Vellum

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 470. P1 — invitation_card_print

- İndirme adı: `18-wildflower-vellum__invitation_card_print.png`
- Hedef: `collections/18_Wildflower_Vellum/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/18_Wildflower_Vellum/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 471. P2 — info_card_print

- İndirme adı: `18-wildflower-vellum__info_card_print.png`
- Hedef: `collections/18_Wildflower_Vellum/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/18_Wildflower_Vellum/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 19_Midnight_Garden

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 472. P1 — invitation_card_print

- İndirme adı: `19-midnight-garden__invitation_card_print.png`
- Hedef: `collections/19_Midnight_Garden/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/19_Midnight_Garden/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 473. P2 — info_card_print

- İndirme adı: `19-midnight-garden__info_card_print.png`
- Hedef: `collections/19_Midnight_Garden/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/19_Midnight_Garden/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 20_Coastal_Seaside

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 474. P1 — invitation_card_print

- İndirme adı: `20-coastal-seaside__invitation_card_print.png`
- Hedef: `collections/20_Coastal_Seaside/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/20_Coastal_Seaside/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 475. P2 — info_card_print

- İndirme adı: `20-coastal-seaside__info_card_print.png`
- Hedef: `collections/20_Coastal_Seaside/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/20_Coastal_Seaside/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 21_Crimson_Rose_Atelier

#### 476. P1 — invitation_card (ön yüz)

- İndirme adı: `21-crimson-rose-atelier__invitation_card.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/invitation_card.png`
- Bölüm: G139 — Basılı davetiye parçaları (yeni; şu an kağıt + gül dalı + mühürle geçici düzen) (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A flat printed wedding invitation card, front side, seen straight on, portrait 2:3, on a fully transparent background. Warm ivory cotton paper with a subtle deckled edge and a soft natural shadow. Deep crimson and wine garden roses with dark green leaves in a lush cluster at the top-left corner and a smaller mirrored cluster at the bottom-right corner, painted in the same rich, romantic, realistic style as the Crimson Rose Atelier rose branch and wax seal. A thin antique gold hairline frame inset from the edge. The whole centre (about 70% of the width, 55% of the height) is EMPTY paper for text. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp details at 2048 × 3072 px.
```

#### 477. P2 — info_card (arka yüz)

- İndirme adı: `21-crimson-rose-atelier__info_card.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/info_card.png`
- Bölüm: G139 — Basılı davetiye parçaları (yeni; şu an kağıt + gül dalı + mühürle geçici düzen) (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
The back side of the same crimson rose wedding invitation card: portrait 2:3 on a fully transparent background, the same ivory cotton paper, deckled edge, soft shadow and thin antique gold hairline frame. Only one small crimson rose sprig centred at the top edge. Everything below the sprig is EMPTY paper for a schedule and a QR code. No text, letters, numbers, logos or watermarks. Print quality, 2048 × 3072 px.
```


## C · Palet varyantı görselleri

### 16_Sunflower_Rustic

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 478. 1. `closure.png` → card_ribbon

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__closure.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure.png)

```
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 479. 2. `closure_r2_v3.png` → closure, favicon

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__closure_r2_v3.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure_r2_v3.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure_r2_v3.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2_v3.png)

```
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 480. 3. `invitation_card.png` → invitation_card, print:card

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__invitation_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/invitation_card.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png)

```
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 481. 4. `info_card.png` → info_card, print:back

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__info_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/info_card.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/info_card.png)

```
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 482. 5. `web_hero.png` → og-1200x630

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__web_hero.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/web_hero.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: web_hero.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/web_hero.png)

```
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 483. 6. `closure.png` → card_ribbon

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__closure.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/closure.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure.png)

```
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 484. 7. `closure_r2_v3.png` → closure, favicon

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__closure_r2_v3.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/closure_r2_v3.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure_r2_v3.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2_v3.png)

```
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 485. 8. `invitation_card.png` → invitation_card, print:card

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__invitation_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/invitation_card.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png)

```
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 486. 9. `info_card.png` → info_card, print:back

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__info_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/info_card.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/info_card.png)

```
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 487. 10. `web_hero.png` → og-1200x630

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__web_hero.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/web_hero.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: web_hero.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/web_hero.png)

```
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 488. 11. `closure.png` → card_ribbon

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__closure.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/closure.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure.png)

```
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 489. 12. `closure_r2_v3.png` → closure, favicon

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__closure_r2_v3.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/closure_r2_v3.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure_r2_v3.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2_v3.png)

```
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 490. 13. `invitation_card.png` → invitation_card, print:card

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__invitation_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/invitation_card.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png)

```
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 491. 14. `info_card.png` → info_card, print:back

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__info_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/info_card.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/info_card.png)

```
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 492. 15. `web_hero.png` → og-1200x630

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__web_hero.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/web_hero.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: web_hero.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/web_hero.png)

```
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 21_Crimson_Rose_Atelier

#### 493. İstem — fildişi güller (yalnız istenirse) — isteğe bağlı

- İndirme adı: `21-crimson-rose-atelier__v07-ivory-rose__rose-branch.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png`
- Bölüm: İstem — fildişi güller (yalnız istenirse) (palet varyantı)
- Şart: 1374×1145 px (6:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png)

```
Photorealistic botanical illustration of a branch of three fully open IVORY / soft cream garden roses with dark green rose leaves and a few small buds, painted in exactly the same style, lighting, angle and composition as the reference image (a diagonal branch of three red roses running from lower left to upper right). Keep the same size and position of every rose and leaf; only the petal colour changes to natural ivory-white with warm cream shadows (no pink, no yellow cast). Transparent background (PNG, alpha), no shadow on the ground, no text, no frame. Canvas 1374 × 1145 px.
Reference: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png
```
