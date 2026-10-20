# GPT iş listesi — ChatGPT'de üretilecek görseller

`python3 tools/gpt_is_listesi.py --yaz` (ya da `tools/gpt_bekleyen.py --yaz`) ile üretilir; elle düzenlenmez. Kaynak: bütün `GPT_PROMPTS.md` dosyaları. Her madde kendi başına yapıştırılabilir tam İngilizce prompt'tur. Tıklanabilir, kopyalama düğmeli ve işaretlenebilir sürüm: [`27_GPT_IS_LISTESI.html`](27_GPT_IS_LISTESI.html) (tarayıcıda aç).

**Toplam: 351 görsel** · A · Tasarım 22–38 (yeni tasarımlar): 293 · B · Tasarım 01–21 rötuş / baskı parçaları: 42 · C · Palet varyantı görselleri: 16

## Neden bu sıra

22–32 tasarımları 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu: website parçaları (PAKET 5) artık istenmiyor; bu tasarımlardan yalnız ilan sahneleri (PAKET 3) ve yeni görünüme uyan baskı zeminleri (PAKET 6) isteniyor, örnek fotoğrafları (PAKET 2) isteğe bağlı ve grubun sonunda. 33–38 ancak kendi website parçaları (PAKET 5) gelince geçici yer tutuculardan çıkıp live olabilir; örnek fotoğraflar (PAKET 2) theme-check ve demo için, ilan sahneleri (PAKET 3) ve baskı zeminleri (PAKET 6) satış paketi için gerekir. 01–21'in website parçaları tam; bu gruptaki 2× baskı parçaları yalnız basılı davetiyeyi ~230 ppi'den 300 ppi'ye çıkarır (bugünkü parçalarla da çalışıyor). Palet varyantları en sonda: o paletler `coming` ve GPT gelene dek asıl renkli parçayla görünüyor; fildişi gül paleti yalnız istenirse.

## ChatGPT'de çalışma

1. Her tasarım için **yeni bir sohbet** aç ve o tasarımın maddelerini aynı sohbette sırayla üret (stil, ışık, malzeme tutarlı kalsın). Tasarım başlığındaki İngilizce GPT notu varsa önce onu gönder; notta adı geçen repo görsellerini (ör. 22–32'de `bg_scene-1024.webp` ve `v3-closed-880.webp`) o ilk mesaja ekle.
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
| A | 22_Nocturne_Lake_Estate | 12 |
| A | 23_Velvet_Jewel_Box | 12 |
| A | 24_Grand_Theatre_Premiere | 14 |
| A | 25_Orient_Express_Voyage | 12 |
| A | 26_Kintsugi_Washi | 12 |
| A | 27_Riad_Lantern_Nights | 12 |
| A | 28_Maison_Patisserie | 12 |
| A | 29_Celestial_Observatory | 12 |
| A | 30_Azulejo_Mosaic | 12 |
| A | 31_Sky_Lantern_Festival | 12 |
| A | 32_Music_Box_Ballerina | 12 |
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
This design ("Nocturne Lake Estate") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/nocturne-lake-estate/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/nocturne-lake-estate/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 1. 3.1 Kapak — elde telefon

- İndirme adı: `22-nocturne-lake-estate__mockups__cover_hand.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a black linen tablecloth over a dark walnut table beside a window at dusk and tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 2. 3.2 Üç telefon — sayfalar

- İndirme adı: `22-nocturne-lake-estate__mockups__three_phones.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a black linen tablecloth over a dark walnut table beside a window at dusk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 3. 3.3 Dizüstü + telefon

- İndirme adı: `22-nocturne-lake-estate__mockups__laptop_phone.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a black linen tablecloth over a dark walnut table beside a window at dusk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 4. 3.4 Masa üstü — yukarıdan

- İndirme adı: `22-nocturne-lake-estate__mockups__flatlay_phone.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a black linen tablecloth over a dark walnut table beside a window at dusk, slightly right of center and rotated about 8 degrees, surrounded at the edges by tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 5. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `22-nocturne-lake-estate__mockups__hand_phone_edit.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a charcoal velvet sofa with a champagne silk cushion and a crystal champagne coupe; a small arrangement of tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 6. P6.1 Ön yüz

- İndirme adı: `22-nocturne-lake-estate__print__invitation_front.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Nocturne Lake Estate" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same midnight charcoal, champagne gold, ivory garden roses and lake Como cypress foliage, softly reflected moonlight across a distant Italian lake, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### 7. P6.2 Arka yüz

- İndirme adı: `22-nocturne-lake-estate__print__invitation_back.png`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: invitation_front.png (listede #6)

```
The back side of the same "Nocturne Lake Estate" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

### 23_Velvet_Jewel_Box

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Velvet Jewel Box") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/velvet-jewel-box/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/velvet-jewel-box/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 8. 3.1 Kapak — elde telefon

- İndirme adı: `23-velvet-jewel-box__mockups__cover_hand.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a champagne satin cloth over a dark plum lacquered table and a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 9. 3.2 Üç telefon — sayfalar

- İndirme adı: `23-velvet-jewel-box__mockups__three_phones.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a champagne satin cloth over a dark plum lacquered table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 10. 3.3 Dizüstü + telefon

- İndirme adı: `23-velvet-jewel-box__mockups__laptop_phone.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a champagne satin cloth over a dark plum lacquered table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 11. 3.4 Masa üstü — yukarıdan

- İndirme adı: `23-velvet-jewel-box__mockups__flatlay_phone.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a champagne satin cloth over a dark plum lacquered table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 12. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `23-velvet-jewel-box__mockups__hand_phone_edit.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a plum velvet sofa with a champagne satin cushion and a porcelain teacup; a small arrangement of a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 13. P6.1 Ön yüz

- İndirme adı: `23-velvet-jewel-box__print__invitation_front.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Velvet Jewel Box" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same deep plum velvet, antique gold, ivory and dusty mauve roses, elegant gemstone-inspired filigree and softly draped silk, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### 14. P6.2 Arka yüz

- İndirme adı: `23-velvet-jewel-box__print__invitation_back.png`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: invitation_front.png (listede #13)

```
The back side of the same "Velvet Jewel Box" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

### 24_Grand_Theatre_Premiere

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Grand Theatre Premiere") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/grand-theatre-premiere/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/grand-theatre-premiere/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 15. 3.1 Kapak — elde telefon

- İndirme adı: `24-grand-theatre-premiere__mockups__cover_hand.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a deep peacock teal velvet cloth over an antique gilded side table and a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 16. 3.2 Üç telefon — sayfalar

- İndirme adı: `24-grand-theatre-premiere__mockups__three_phones.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a deep peacock teal velvet cloth over an antique gilded side table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 17. 3.3 Dizüstü + telefon

- İndirme adı: `24-grand-theatre-premiere__mockups__laptop_phone.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a deep peacock teal velvet cloth over an antique gilded side table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 18. 3.4 Masa üstü — yukarıdan

- İndirme adı: `24-grand-theatre-premiere__mockups__flatlay_phone.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a deep peacock teal velvet cloth over an antique gilded side table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 19. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `24-grand-theatre-premiere__mockups__hand_phone_edit.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a teal velvet theatre sofa with an antique gold cushion and a glass of champagne; a small arrangement of a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 20. P6.1 Ön yüz 5×7

- İndirme adı: `24-grand-theatre-premiere__print__invitation_front_5x7.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Grand Theatre Premiere" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same burgundy velvet, antique gold and ivory roses, theatrical gilded rococo flourishes at the corners, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### 21. P6.2 Arka yüz 5×7

- İndirme adı: `24-grand-theatre-premiere__print__invitation_back_5x7.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: invitation_front_5x7.png (listede #20)

```
The back side of the same "Grand Theatre Premiere" invitation (give invitation_front_5x7.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

#### 22. P6.3 Ön yüz A5

- İndirme adı: `24-grand-theatre-premiere__print__invitation_front_a5.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_a5.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Grand Theatre Premiere" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same burgundy velvet, antique gold and ivory roses, theatrical gilded rococo flourishes at the corners, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### 23. P6.4 Arka yüz A5

- İndirme adı: `24-grand-theatre-premiere__print__invitation_back_a5.png`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_a5.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: invitation_front_a5.png (listede #22)

```
The back side of the same "Grand Theatre Premiere" invitation (give invitation_front_a5.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

### 25_Orient_Express_Voyage

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Orient Express Voyage") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/orient-express-voyage/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/orient-express-voyage/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 24. 3.1 Kapak — elde telefon

- İndirme adı: `25-orient-express-voyage__mockups__cover_hand.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a polished mahogany carriage table with an ivory linen runner and a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 25. 3.2 Üç telefon — sayfalar

- İndirme adı: `25-orient-express-voyage__mockups__three_phones.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a polished mahogany carriage table with an ivory linen runner, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 26. 3.3 Dizüstü + telefon

- İndirme adı: `25-orient-express-voyage__mockups__laptop_phone.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a polished mahogany carriage table with an ivory linen runner, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 27. 3.4 Masa üstü — yukarıdan

- İndirme adı: `25-orient-express-voyage__mockups__flatlay_phone.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a polished mahogany carriage table with an ivory linen runner, slightly right of center and rotated about 8 degrees, surrounded at the edges by a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 28. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `25-orient-express-voyage__mockups__hand_phone_edit.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a bottle-green leather carriage seat with a brass reading lamp and a china teacup; a small arrangement of a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 29. P6.1 Ön yüz

- İndirme adı: `25-orient-express-voyage__print__invitation_front_5x7.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Orient Express Voyage" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same deep forest green, warm parchment, champagne gold, ivory roses, delicate antique train travel map details and brass ornament, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### 30. P6.2 Arka yüz

- İndirme adı: `25-orient-express-voyage__print__invitation_back_5x7.png`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: invitation_front_5x7.png (listede #29)

```
The back side of the same "Orient Express Voyage" invitation (give invitation_front_5x7.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

### 26_Kintsugi_Washi

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Kintsugi & Washi") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/kintsugi-washi/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/kintsugi-washi/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 31. 3.1 Kapak — elde telefon

- İndirme adı: `26-kintsugi-washi__mockups__cover_hand.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a sheet of pale ivory rice paper over a light ash wood table and a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 32. 3.2 Üç telefon — sayfalar

- İndirme adı: `26-kintsugi-washi__mockups__three_phones.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a sheet of pale ivory rice paper over a light ash wood table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 33. 3.3 Dizüstü + telefon

- İndirme adı: `26-kintsugi-washi__mockups__laptop_phone.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a sheet of pale ivory rice paper over a light ash wood table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 34. 3.4 Masa üstü — yukarıdan

- İndirme adı: `26-kintsugi-washi__mockups__flatlay_phone.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a sheet of pale ivory rice paper over a light ash wood table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 35. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `26-kintsugi-washi__mockups__hand_phone_edit.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a natural linen sofa with an indigo cushion and a ceramic tea bowl; a small arrangement of a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 36. P6.1 Ön yüz

- İndirme adı: `26-kintsugi-washi__print__invitation_front_5x7.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Kintsugi & Washi" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same warm ivory washi paper, indigo botanical branches, champagne gold fine kintsugi veins, white magnolia and cherry blossoms, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### 37. P6.2 Arka yüz

- İndirme adı: `26-kintsugi-washi__print__invitation_back_5x7.png`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: invitation_front_5x7.png (listede #36)

```
The back side of the same "Kintsugi & Washi" invitation (give invitation_front_5x7.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

### 27_Riad_Lantern_Nights

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Riad Lantern Nights") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/riad-lantern-nights/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/riad-lantern-nights/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 38. 3.1 Kapak — elde telefon

- İndirme adı: `27-riad-lantern-nights__mockups__cover_hand.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a teal zellige-tiled table top in a lantern-lit courtyard and pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 39. 3.2 Üç telefon — sayfalar

- İndirme adı: `27-riad-lantern-nights__mockups__three_phones.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a teal zellige-tiled table top in a lantern-lit courtyard, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 40. 3.3 Dizüstü + telefon

- İndirme adı: `27-riad-lantern-nights__mockups__laptop_phone.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a teal zellige-tiled table top in a lantern-lit courtyard, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 41. 3.4 Masa üstü — yukarıdan

- İndirme adı: `27-riad-lantern-nights__mockups__flatlay_phone.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a teal zellige-tiled table top in a lantern-lit courtyard, slightly right of center and rotated about 8 degrees, surrounded at the edges by pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 42. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `27-riad-lantern-nights__mockups__hand_phone_edit.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a low cedar daybed with saffron and teal cushions and a brass-rimmed tea glass; a small arrangement of pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 43. P6.1 Ön yüz

- İndirme adı: `27-riad-lantern-nights__print__print_front.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Riad Lantern Nights" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same warm sand, terracotta and muted teal, ivory roses, ornate Moroccan bronze lanterns and subtle zellige corner geometry, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### 44. P6.2 Arka yüz

- İndirme adı: `27-riad-lantern-nights__print__print_back.png`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: print_front.png (listede #43)

```
The back side of the same "Riad Lantern Nights" invitation (give print_front.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

### 28_Maison_Patisserie

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Maison Pâtisserie") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/maison-patisserie/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/maison-patisserie/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 45. 3.1 Kapak — elde telefon

- İndirme adı: `28-maison-patisserie__mockups__cover_hand.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a white marble pastry counter with a cream linen napkin and a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 46. 3.2 Üç telefon — sayfalar

- İndirme adı: `28-maison-patisserie__mockups__three_phones.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a white marble pastry counter with a cream linen napkin, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 47. 3.3 Dizüstü + telefon

- İndirme adı: `28-maison-patisserie__mockups__laptop_phone.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a white marble pastry counter with a cream linen napkin, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 48. 3.4 Masa üstü — yukarıdan

- İndirme adı: `28-maison-patisserie__mockups__flatlay_phone.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a white marble pastry counter with a cream linen napkin, slightly right of center and rotated about 8 degrees, surrounded at the edges by a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 49. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `28-maison-patisserie__mockups__hand_phone_edit.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream boudoir armchair with a pistachio cushion and a porcelain cup of coffee; a small arrangement of a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 50. P6.1 Ön yüz

- İndirme adı: `28-maison-patisserie__print__invitation_front.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Maison Pâtisserie" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same pistachio sage, cream and soft blush, garden roses, pearl ribbon and delicate French patisserie rococo ornament, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### 51. P6.2 Arka yüz

- İndirme adı: `28-maison-patisserie__print__invitation_back.png`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: invitation_front.png (listede #50)

```
The back side of the same "Maison Pâtisserie" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

### 29_Celestial_Observatory

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Celestial Observatory") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/celestial-observatory/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/celestial-observatory/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 52. 3.1 Kapak — elde telefon

- İndirme adı: `29-celestial-observatory__mockups__cover_hand.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a midnight blue velvet cloth over an antique wooden desk and a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 53. 3.2 Üç telefon — sayfalar

- İndirme adı: `29-celestial-observatory__mockups__three_phones.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a midnight blue velvet cloth over an antique wooden desk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 54. 3.3 Dizüstü + telefon

- İndirme adı: `29-celestial-observatory__mockups__laptop_phone.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a midnight blue velvet cloth over an antique wooden desk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 55. 3.4 Masa üstü — yukarıdan

- İndirme adı: `29-celestial-observatory__mockups__flatlay_phone.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a midnight blue velvet cloth over an antique wooden desk, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 56. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `29-celestial-observatory__mockups__hand_phone_edit.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a midnight blue velvet sofa with a silver cushion and a ceramic coffee cup; a small arrangement of a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 57. P6.1 Ön yüz

- İndirme adı: `29-celestial-observatory__print__invitation_front_5x7.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Celestial Observatory" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same midnight navy, champagne gold and warm ivory, tiny restrained constellations, roses, antique celestial engravings, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### 58. P6.2 Arka yüz

- İndirme adı: `29-celestial-observatory__print__invitation_back_5x7.png`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: invitation_front_5x7.png (listede #57)

```
The back side of the same "Celestial Observatory" invitation (give invitation_front_5x7.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

### 30_Azulejo_Mosaic

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Azulejo Mosaic") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/azulejo-mosaic/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/azulejo-mosaic/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 59. 3.1 Kapak — elde telefon

- İndirme adı: `30-azulejo-mosaic__mockups__cover_hand.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a sunlit whitewashed table with an edge of terracotta tiles and a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 60. 3.2 Üç telefon — sayfalar

- İndirme adı: `30-azulejo-mosaic__mockups__three_phones.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a sunlit whitewashed table with an edge of terracotta tiles, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 61. 3.3 Dizüstü + telefon

- İndirme adı: `30-azulejo-mosaic__mockups__laptop_phone.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a sunlit whitewashed table with an edge of terracotta tiles, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 62. 3.4 Masa üstü — yukarıdan

- İndirme adı: `30-azulejo-mosaic__mockups__flatlay_phone.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a sunlit whitewashed table with an edge of terracotta tiles, slightly right of center and rotated about 8 degrees, surrounded at the edges by a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 63. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `30-azulejo-mosaic__mockups__hand_phone_edit.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a whitewashed bench with cobalt-and-white cushions and a terracotta cup; a small arrangement of a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 64. P6.1 Ön yüz

- İndirme adı: `30-azulejo-mosaic__print__invitation_front.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Azulejo Mosaic" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same cream plaster, cobalt blue and antique gold, Portuguese azulejo ceramic corner flourishes, white roses and olive branches, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### 65. P6.2 Arka yüz

- İndirme adı: `30-azulejo-mosaic__print__invitation_back.png`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: invitation_front.png (listede #64)

```
The back side of the same "Azulejo Mosaic" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

### 31_Sky_Lantern_Festival

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Sky Lantern Festival") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/sky-lantern-festival/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/sky-lantern-festival/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 66. 3.1 Kapak — elde telefon

- İndirme adı: `31-sky-lantern-festival__mockups__cover_hand.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a soft rice-paper cloth on a light wooden table at dusk and glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 67. 3.2 Üç telefon — sayfalar

- İndirme adı: `31-sky-lantern-festival__mockups__three_phones.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a soft rice-paper cloth on a light wooden table at dusk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 68. 3.3 Dizüstü + telefon

- İndirme adı: `31-sky-lantern-festival__mockups__laptop_phone.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a soft rice-paper cloth on a light wooden table at dusk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 69. 3.4 Masa üstü — yukarıdan

- İndirme adı: `31-sky-lantern-festival__mockups__flatlay_phone.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a soft rice-paper cloth on a light wooden table at dusk, slightly right of center and rotated about 8 degrees, surrounded at the edges by glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 70. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `31-sky-lantern-festival__mockups__hand_phone_edit.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on an ivory linen sofa with a dusky rose cushion and a warm glowing paper lantern; a small arrangement of glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 71. P6.1 Ön yüz

- İndirme adı: `31-sky-lantern-festival__print__print_front.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/print/print_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Sky Lantern Festival" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same warm dusk indigo, champagne and soft coral, distant warm sky lanterns, ivory roses and soft eucalyptus foliage, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### 72. P6.2 Arka yüz

- İndirme adı: `31-sky-lantern-festival__print__print_back.png`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/print/print_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1819×2551 px (0.713:1) · opak · PNG
- Ek görsel: print_front.png (listede #71)

```
The back side of the same "Sky Lantern Festival" invitation (give print_front.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

### 32_Music_Box_Ballerina

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Music Box Ballerina") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/music-box-ballerina/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/music-box-ballerina/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 73. 3.1 Kapak — elde telefon

- İndirme adı: `32-music-box-ballerina__mockups__cover_hand.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/cover_hand.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a blush satin cloth on a white vanity table and a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

#### 74. 3.2 Üç telefon — sayfalar

- İndirme adı: `32-music-box-ballerina__mockups__three_phones.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/three_phones.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 3 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Three identical smartphones stand upright side by side on a blush satin cloth on a white vanity table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

#### 75. 3.3 Dizüstü + telefon

- İndirme adı: `32-music-box-ballerina__mockups__laptop_phone.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/laptop_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1536×1024 px (3:2) · opak · düz #00FF00 pencere · 2 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

An open modern laptop seen from the front at eye level stands slightly left of center on a blush satin cloth on a white vanity table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

#### 76. 3.4 Masa üstü — yukarıdan

- İndirme adı: `32-music-box-ballerina__mockups__flatlay_phone.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/flatlay_phone.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

Flat-lay photo from directly above: a smartphone lies on a blush satin cloth on a white vanity table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

#### 77. 3.5 Telefonda düzenleme — yaşam sahnesi

- İndirme adı: `32-music-box-ballerina__mockups__hand_phone_edit.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/mockups/hand_phone_edit.png`
- Bölüm: PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) (ilan sahnesi (PAKET 3))
- Şart: 1024×1024 px (1:1) · opak · düz #00FF00 pencere · 1 yeşil ekran · PNG

```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.

A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a blush velvet armchair with a rose-gold cushion and a porcelain teacup; a small arrangement of a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```

Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

#### 78. P6.1 Ön yüz

- İndirme adı: `32-music-box-ballerina__print__invitation_front.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_front.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: bg_scene-1024.webp (bulunamadı)

```
A full-bleed printable wedding invitation ground for the "Music Box Ballerina" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same powder blush pink, ivory and champagne gold, delicate garden roses, silk ribbon, restrained antique music box filigree, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### 79. P6.2 Arka yüz

- İndirme adı: `32-music-box-ballerina__print__invitation_back.png`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_back.png`
- Bölüm: PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: invitation_front.png (listede #78)

```
The back side of the same "Music Box Ballerina" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```

Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

### 33_Marigold_Mehndi

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, scripts of any language, monograms, logos or watermarks in any image. No religious symbols or deities** (no Om, no swastika, no Ganesha, no temple, no sacred fire, no kalash): this is a festive, cultural look — marigolds, henna patterns, silk, brass lamps, carved arches — not a religious one. Give W2.1 `silk.png`, W2.14 `velvet.png`, W2.15 `paper.png` and W2.2 `sleeve.png` as the style reference of every later part: the same fuchsia silk, the same velvet, the same saffron paper, the same warm gold.
```

#### 80. W2.1 Fuşya ipek (zarfın arkası, ön cebi, kapağı)

- İndirme adı: `33-marigold-mehndi__silk.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/silk.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of rich fuchsia raw silk (#B3165E) filling the whole square edge to edge: a fine slub weave, a soft natural sheen that moves in gentle diagonal waves, very subtle shot-silk warmth (a hint of saffron in the highlights). Calm and even everywhere, no fold, no seam, no pattern, no embroidery, no border, no vignette, no object. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#B3165E` civarı; parlaklık yumuşak; desen/yazı yok.

#### 81. W2.2 Altın lazer kesim paisley kılıf (açılışta yana kayar)

- İndirme adı: `33-marigold-mehndi__sleeve.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/sleeve.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×500 px (12:5) · şeffaf zemin (gerçek alfa) · PNG

```
A wide horizontal band of thin gold metallic card, laser-cut in an intricate openwork pattern of paisleys, small marigold flowers and fine vines, seen straight from the front on a fully transparent background, the band filling the image edge to edge (2.4:1): warm gold (#C9A24A) with gold-leaf highlights (#EBCD84), the cut-outs are TRUE TRANSPARENT holes (about 40% of the band is open lace, so the silk behind shows through), a slim solid gold edge along the top and bottom. Soft warm light from the top-left, the gold gently curved as if wrapped round an envelope. No tassel, no seal, no shadow outside the band. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: bant tuvali dolduruyor (2,4:1); kesik yerleri gerçekten şeffaf; püskül/mühür yok; gerçek alfa.

#### 82. W2.3 Kadife çiçeği yaprakları (süzülen yapraklar) — üç ayrı dosya

- İndirme adı: `33-marigold-mehndi__petal_1.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_1 (number 1 of 3).

A single loose marigold petal, photorealistic, alone, on a fully transparent background: a ruffled orange-saffron petal (#F2A13B, deeper orange at the base, a golden edge), soft and slightly curled, filling about 55% of the square, centred, not cropped. No stem, no whole flower, no shadow, no other petal. No text. True transparent background PNG (real alpha channel). (Make three different petals: 1 = a wide ruffled petal, 2 = a narrow curled petal, 3 = a small deep-orange petal.)
```

Kontrol: tek yaprak; üç dosya farklı; gölge yok; gerçek alfa.

#### 83. W2.3 Kadife çiçeği yaprakları (süzülen yapraklar) — üç ayrı dosya

- İndirme adı: `33-marigold-mehndi__petal_2.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_2 (number 2 of 3).

A single loose marigold petal, photorealistic, alone, on a fully transparent background: a ruffled orange-saffron petal (#F2A13B, deeper orange at the base, a golden edge), soft and slightly curled, filling about 55% of the square, centred, not cropped. No stem, no whole flower, no shadow, no other petal. No text. True transparent background PNG (real alpha channel). (Make three different petals: 1 = a wide ruffled petal, 2 = a narrow curled petal, 3 = a small deep-orange petal.)
```

Kontrol: tek yaprak; üç dosya farklı; gölge yok; gerçek alfa.

#### 84. W2.3 Kadife çiçeği yaprakları (süzülen yapraklar) — üç ayrı dosya

- İndirme adı: `33-marigold-mehndi__petal_3.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (petal_1, petal_2, petal_3). Make ONLY ONE image now: petal_3 (number 3 of 3).

A single loose marigold petal, photorealistic, alone, on a fully transparent background: a ruffled orange-saffron petal (#F2A13B, deeper orange at the base, a golden edge), soft and slightly curled, filling about 55% of the square, centred, not cropped. No stem, no whole flower, no shadow, no other petal. No text. True transparent background PNG (real alpha channel). (Make three different petals: 1 = a wide ruffled petal, 2 = a narrow curled petal, 3 = a small deep-orange petal.)
```

Kontrol: tek yaprak; üç dosya farklı; gölge yok; gerçek alfa.

#### 85. W2.4 Jharokha kemeri (foto çerçevesi; kemerli pencere)

- İndirme adı: `33-marigold-mehndi__jharokha.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/jharokha.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1300 px (10:13) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A carved Rajasthani jharokha window frame seen straight from the front, on a fully transparent background, the frame filling the image edge to edge (0.77:1): warm sandstone-and-gold carving with a scalloped (cusped) arch at the top, two slender carved pillars, a small domed canopy (chhatri) crown with a tiny gold finial at the top, a carved ledge with two small brackets at the bottom, fine gold-leaf accents and a few tiny inlaid fuchsia and saffron stones. The window opening inside is a cusped arch whose bounding box is exactly 4:5 — 64% of the image width wide (from 18% to 82%) and from 24% to 85.5% of the image height — and the whole opening is filled with flat pure green #00FF00 (no texture, no shading, crisp arch edges, nothing in front of it). Soft warm light from the top-left. No lattice in the window, no people, no shadow outside the frame. No text, letters, numbers or symbols, no religious figures. True transparent background PNG (real alpha channel).
```

Kontrol: pencere düz `#00FF00`, kutusu 4:5 ve tarifteki yerde (%18–%82 × %24–%85,5); kemer dilimli; dini figür yok; alfa.

#### 86. W2.5 Kına deseni (kemerin çevresi; çizgi çizgi akar)

- İndirme adı: `33-marigold-mehndi__henna.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/henna.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1300 px (10:13) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: jharokha.png (listede #85)

```
Fine henna (mehndi) line art in a deep henna brown (#7A3B1E) on a fully transparent background, on the same 1000×1300 canvas as jharokha.png and drawn to sit AROUND that arch frame: delicate paisleys, small flowers, leaves, dots and flowing vines that climb up both sides from the bottom corners and meet over the arch crown, plus a few dotted trails reaching outwards; thin, even, hand-drawn lines like real henna on skin, no filled areas. The middle of the canvas where the frame and its window sit — from 12% to 88% of the width and from 8% to 92% of the height — stays EMPTY except where the vines cross the frame's outer edge. No background, no skin, no hand. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız ince kına çizgileri (dolgu yok); orta alan boş; jharokha ile aynı tuval; alfa.

#### 87. W2.6 Pirinç diya (sönük kandil)

- İndirme adı: `33-marigold-mehndi__diya.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/diya.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 600×420 px (10:7) · şeffaf zemin (gerçek alfa) · PNG

```
A single small traditional brass oil lamp (diya), photorealistic, seen from the front and slightly above, on a fully transparent background, filling about 90% of the image: a shallow almond-shaped polished brass bowl with a short pinched spout on the right, a few fine engraved petals on its side, a little oil inside and a cotton wick lying in the spout — UNLIT (no flame, no glow). Warm light from the top-left. No base cloth, no flowers, no shadow, no other object. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek sönük kandil; alev/ışıma yok; fitil ağızda; alfa.

#### 88. W2.7 Diya alevi

- İndirme adı: `33-marigold-mehndi__flame.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/flame.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 256×512 px (1:2) · şeffaf zemin (gerçek alfa) · PNG

```
A single small oil-lamp flame, photorealistic, alone, on a fully transparent background, filling about 85% of the image height: a soft teardrop flame, white-gold core, saffron and orange edges, a faint blue at the base, the very tip slightly curved, centred with its base at the bottom-centre of the image. No wick, no lamp, no glow beyond the flame, no smoke, no sparks. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek alev; tabanı alt ortada; dışa taşan hâle yok; alfa.

#### 89. W2.8 Kadife çiçeği çelengi

- İndirme adı: `33-marigold-mehndi__garland.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/garland.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×420 px (30:7) · şeffaf zemin (gerçek alfa) · PNG

```
A festive garland of fresh marigolds (toran) seen straight from the front on a fully transparent background, filling the image width: two graceful swags of densely strung orange and saffron-yellow marigold flowers hanging from the top edge, held at three points (left end, centre, right end), with short strands of marigolds and a few green mango leaves hanging down between the swags, small fuchsia rose buds tucked in here and there. Photorealistic flowers, soft warm light from the top-left. The top edge of the garland runs along the very top of the image. No string ends visible outside, no wall, no shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: iki sarkan kavis, üst kenar boyunca; çiçekler gerçekçi; arka plan yok; alfa.

#### 90. W2.9 Kına deseni zemini (Story arka planı)

- İndirme adı: `33-marigold-mehndi__mehndi_pattern.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/mehndi_pattern.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A seamless, tileable all-over pattern of fine henna (mehndi) line art in a light saffron-gold (#F7C27A) on a fully transparent background: an even scatter of small paisleys, tiny flowers, leaves and dots linked by delicate vines, thin even lines, no filled areas, generous space between motifs. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikişsiz; yalnız ince çizgi; motifler seyrek; alfa.

#### 91. W2.10 Astardan yükselen kart (boş, kemerli foto penceresi)

- İndirme adı: `33-marigold-mehndi__card_small.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1022×1400 px (0.730:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A flat vertical invitation card of the same saffron-ivory paper as paper.png, exactly 0.73:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine gold-foil border of tiny paisleys inset from the edge and a small marigold sprig in each of the two lower corners, a very soft contact shade on the card itself. In its upper part a portrait window shaped as a cusped (scalloped) Rajasthani arch with a 4:5 bounding box — 60% of the card's width wide, horizontally centred, its top at 8% of the card's height — filled with flat pure green #00FF00 (no texture, no shading, crisp edges), with a slim gold carved rim round it. Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: kemer pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 92. W2.11 İpek püskül (kılıftan sarkar, sallanır)

- İndirme adı: `33-marigold-mehndi__tassel.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/tassel.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 300×1000 px (3:10) · şeffaf zemin (gerçek alfa) · PNG

```
A single silk tassel hanging straight down, photorealistic, seen from the front on a fully transparent background, filling the image height: a short twisted gold cord loop at the very top centre (where it hangs from), a small gold-thread wrapped head with a few tiny beads, and a full skirt of fine fuchsia silk threads (#B3165E) with saffron and gold threads mixed in, the ends slightly uneven. Soft warm light from the top-left. No hook, no shadow, no background. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek püskül; asılma noktası üst ortada; dikey; alfa.

#### 93. W2.12 Zarfın ön cebi

- İndirme adı: `33-marigold-mehndi__envelope_front.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/envelope_front.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1290×1000 px (1.290:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: silk.png (listede #80)

```
The front pocket of a fuchsia silk envelope, seen straight from the front on a fully transparent background, filling the image edge to edge (1.29:1): the same fuchsia raw silk as silk.png stretched over card, a perfectly STRAIGHT horizontal top edge finished with a slim gold piping and a fine line of tiny gold embroidered dots just below it, the other three edges straight and crisp with a hairline gold edge. Soft warm light from the top-left. No flap, no seal, no sleeve, no shadow outside. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen cep; üst kenar düz ve altın biyeli; mühür/kapak yok; alfa.

#### 94. W2.13 Zarfın düz kapağı (ön yüz)

- İndirme adı: `33-marigold-mehndi__flap.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1524×800 px (1.905:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: silk.png (listede #80)

```
The closed top flap of the same fuchsia silk envelope, seen straight from the front on a fully transparent background, filling the image edge to edge (1.9:1): a RECTANGULAR flap (not a V, not a point) of the same fuchsia raw silk as silk.png, its lower edge straight with a slim gold piping and a delicate border of tiny gold-embroidered paisleys along it, a soft fold highlight along the top edge where it is hinged. Soft warm light from the top-left. No seal, no button, no sleeve, no shadow outside. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen kapak (V değil); alt kenar düz ve altın biyeli; mühür yok; alfa.

#### 95. W2.14 Kadife (astar, kapağın iç yüzü, sayfa zemini)

- İndirme adı: `33-marigold-mehndi__velvet.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/velvet.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of deep fuchsia-plum silk velvet (#5C0A36) filling the whole square edge to edge: a soft dense pile with a gentle crushed-velvet sheen, slightly lighter where the pile catches the light, calm and even everywhere so light text can read on a darker version of it. No fold, no seam, no pattern, no vignette, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz; kadife hav dokusu; renk `#5C0A36` civarı; desen yok.

#### 96. W2.15 Safran-fildişi kâğıt (kartlar, bantlar, form)

- İndirme adı: `33-marigold-mehndi__paper.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine handmade cotton paper in a warm saffron-ivory (#FAEBD0): a gentle natural tooth, a few tiny soft fibres, a very slight warm mottling, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu yazı her yerde okunur); safran-fildişi; dikişsiz; leke/baskı yok.

#### 97. W2.16 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `33-marigold-mehndi__web_hero.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: silk.png (listede #80), sleeve.png (listede #81), tassel.png (listede #92), velvet.png (listede #95), garland.png (listede #89)

```
Wide horizontal still life, photorealistic, soft warm light from the top-left: the fuchsia silk envelope of silk.png, flap closed, held in the gold laser-cut paisley sleeve of sleeve.png with the silk tassel of tassel.png hanging from it, lying slightly below the centre on deep fuchsia-plum velvet (as velvet.png); a few loose marigold petals and two small lit brass diyas at the left, a short strand of marigolds at the right; a marigold garland (as garland.png) softly out of focus along the top edge. The top 20% of the image is calm. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no hands, no text, letters, numbers or symbols, no logos, no religious objects.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı/dini nesne yok.

#### 98. 2.1 Ana portre

- İndirme adı: `33-marigold-mehndi__photos__hero_portrait.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Anaya and Kabir, in their early thirties (Anaya: long dark-brown hair in a loose low braid with a few marigolds, warm medium-brown skin, a small gold nose stud, fine henna on her hands; Kabir: short black hair, a neat short beard, warm light-brown skin; they must not resemble any real person or celebrity) in a sunlit courtyard of an old haveli with carved sandstone arches and marigold garlands softly out of focus behind them: she in a fuchsia-and-gold silk lehenga, he in an ivory silk sherwani with a saffron stole, standing close, foreheads almost touching, smiling, waist-up, faces in the upper middle of the frame. Photorealistic, warm saffron, fuchsia and gold palette, subtle grain. No text, no frame, no religious objects.
```

#### 99. 2.2 Story 1 — "A monsoon afternoon"

- İndirme adı: `33-marigold-mehndi__photos__story_1.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #98)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin), in casual modern clothes, sharing one umbrella and laughing outside a small old bookshop on a rainy monsoon afternoon, wet street reflections, warm shop light, a few books in her arms. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 100. 2.3 Story 2 — "Kites over the rooftops"

- İndirme adı: `33-marigold-mehndi__photos__story_2.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #98)

```
Vertical 4:5: the same couple as hero_portrait.jpg on a sunny flat rooftop of an old pink-sandstone city, flying a bright kite together, she holding the spool and laughing, he guiding the string, many small colourful kites in a clear blue sky above, old rooftops and domes softly behind. Photorealistic, same palette and grain. No text, no readable signs.
```

#### 101. 2.4 Story 3 — "Among the marigolds"

- İndirme adı: `33-marigold-mehndi__photos__story_3.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #98)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hennaed hand with a slim gold ring resting in his, over a brass tray heaped with fresh marigold flowers and petals, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text, no religious objects.
```

#### 102. 2.5 Mekân

- İndirme adı: `33-marigold-mehndi__photos__venue.jpg`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: the courtyard garden of an elegant old haveli at golden hour, carved sandstone arches and jharokha balconies round a lawn, rows of simple chairs with fuchsia and saffron silk sashes facing a low floral stage of marigold garlands (no religious structure), strings of small warm lights, brass lamps along the path. No people, no signs, no text. Photorealistic, same palette.
```

#### 103. P1 — Ön yüz

- İndirme adı: `33-marigold-mehndi__print__invitation_front_5x7.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: paper.png (listede #96), garland.png (listede #89), henna.png (listede #86)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the saffron-ivory paper of paper.png. Along the top edge a marigold garland of two swags (as garland.png) hanging over a narrow band of fuchsia silk about 9% of the height, its flowers reaching down to at most 15% of the height. Along the bottom edge a band of fuchsia silk about 8% of the height with a slim gold-foil paisley border on its upper edge (staying below 87%), and fine henna vines (as henna.png, deep henna brown) climbing a little way up from the two bottom corners along the side edges (staying outside the middle 80% of the width). The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos, watermarks or religious symbols. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı/dini simge yok; çelenk üstte, ipek bant altta.

#### 104. P2 — Arka yüz

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

#### 105. W2.1 Lake zemin (sayfa zemini)

- İndirme adı: `34-red-lacquer-double-happiness__lacquer.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/lacquer.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat texture of an old hand-polished Chinese red lacquer surface in a deep oxblood lacquer red (#4A0A0E), filling the whole square edge to edge: a soft, deep, slightly glossy depth with very subtle mottling of a darker red (#2C0507) and the faintest hairline crackle of aged lacquer, calm and even everywhere so that cream and gold text reads on it. No pattern, no gold, no motif, no reflection of objects, no vignette, no gradient, no object. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#4A0A0E` civarı; sakin (üstünde krem yazı okunur); desen/yazı yok.

#### 106. W2.2 Zincifre kırmızı kâğıt (zarf kâğıdı)

- İndirme adı: `34-red-lacquer-double-happiness__red_paper.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine handmade Chinese red paper in a warm cinnabar red (#A81E24), the paper of a wedding envelope: soft visible paper fibres, a gentle natural tooth, a sparse scattering of tiny gold-leaf flecks (a few dozen, very small, irregular), evenly lit from the top-left. No shadow, no vignette, no fold, no stain, no pattern, no motif. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin; zincifre kırmızısı; ince altın pullar seyrek; dikişsiz; desen yok.

#### 107. W2.3 Krem kart kâğıdı (kartlar, bantlar, form)

- İndirme adı: `34-red-lacquer-double-happiness__cream_paper.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cream_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine warm cream rice paper (#F5ECD8): delicate long fibres, a soft natural tooth, a warm even tone, calm enough for dark red ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu kırmızı yazı her yerde okunur); sıcak krem; dikişsiz; leke/baskı yok.

#### 108. W2.4 Altın varak dokusu

- İndirme adı: `34-red-lacquer-double-happiness__gold_leaf.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/gold_leaf.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of genuine gold leaf laid on paper: warm gold (#C9A14A) with lighter (#E6C983) and deeper (#8A5F1C) areas, the faint square seams and tiny wrinkles of hand-laid leaf, a soft satin shine from the top-left. Even everywhere, no pattern, no motif, no vignette, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: gerçek varak görünümü; sıcak altın; dikişsiz; desen yok.

#### 109. W2.5 Zarfın arkası ve astarı

- İndirme adı: `34-red-lacquer-double-happiness__envelope_back.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_back.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×1500 px (0.660:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (listede #106)

```
The back panel of a tall vertical Chinese wedding envelope seen straight from the front with its flap open and out of the picture, on a fully transparent background, the panel filling the image edge to edge (the image IS the panel, 0.66:1): the inside of the envelope, lined in the top 35% of its height with a cream paper lining printed with a delicate pattern of small gold-leaf auspicious cloud scrolls; below the lining the plain inner side of the same cinnabar red paper as red_paper.png, slightly in shade. Straight edges, crisp paper corners, soft warm light from the top-left. No flap, no card, no object inside, no shadow outside the panel. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: panel tuvali dolduruyor (0,66:1); üst %35'te altın bulutlu krem astar; kapak/kart yok; gerçek alfa.

#### 110. W2.6 Zarfın ön cebi

- İndirme adı: `34-red-lacquer-double-happiness__envelope_pocket.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×1500 px (0.660:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_back.png (listede #109), red_paper.png (listede #106)

```
The front pocket of the same tall vertical red envelope as envelope_back.png, seen straight from the front, on a fully transparent background, drawn on the full envelope canvas: the pocket is the same cinnabar red paper as red_paper.png and covers the image from 30% of its height down to the bottom edge, full width; its top edge at 30% is a clean straight cut with a fine gold-leaf edge line; everything above 30% is fully transparent. Very soft folds of real paper at the sides, a hair of shadow under the top edge, soft warm light from the top-left. The pocket is PLAIN: no character, no flower, no button, no cord drawn on it (they are separate layers). No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: cep %30'dan aşağı, üstü tamamen şeffaf; cep düz (düğme, ip, 囍 yok); gerçek alfa.

#### 111. W2.7 Zarf kapağı (dış yüz)

- İndirme adı: `34-red-lacquer-double-happiness__envelope_flap.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×780 px (1.269:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (listede #106)

```
The closed top flap of the same tall vertical red envelope, alone, seen straight from the front, on a fully transparent background: the same cinnabar red paper as red_paper.png, full width of the image, its top edge a straight fold along the very top of the image; its sides straight; its lower edge a graceful, shallow, symmetrical curve shaped like an auspicious cloud scroll (ruyi) whose lowest point, at the centre, touches the bottom edge of the image, with a fine gold-leaf line following that lower edge. A delicate border of tiny gold-leaf cloud scrolls along the lower edge only. Soft warm light from the top-left, a very slight paper sheen. The flap is otherwise PLAIN: no button, no cord, no character (separate layers). It must not be a V-shaped flap and must have no wax seal. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: üst kenar düz katlama; alt kenar ortada en alçak, bulut biçimli sığ eğri (V değil); düğme/ip/mühür yok; gerçek alfa.

#### 112. W2.8 Kapağın iç yüzü (kalkınca görünen)

- İndirme adı: `34-red-lacquer-double-happiness__flap_inside.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/flap_inside.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×780 px (1.269:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_flap.png (listede #111), envelope_back.png (listede #109)

```
The inside of the same envelope flap as envelope_flap.png, seen straight on once it has been lifted up above the envelope, on a fully transparent background: the SAME outline as envelope_flap.png but turned upside down — its straight fold edge runs along the BOTTOM of the image and its shallow cloud-scroll curve is at the TOP, lowest point of the curve now the highest point at the top centre. The inner side of the same cinnabar red paper, a little darker and in soft shade, lined with the same cream lining with small gold-leaf cloud scrolls as envelope_back.png. No button, no cord, no character. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dış yüzün dikey aynası (katlama alta, eğri üste); astarlı; gerçek alfa.

#### 113. W2.9 Kâğıt düğme (iki kez kullanılır)

- İndirme adı: `34-red-lacquer-double-happiness__button.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/button.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 400×400 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single round paper button of a string-and-button envelope closure, seen straight from above, on a fully transparent background, filling about 92% of the square: a thick disc of layered cream card covered with real gold leaf, a slightly raised rim, a tiny brass rivet at its centre, a delicate pressed pattern of a small plum blossom around the rivet, soft warm light from the top-left, a hair of shadow under its own rim only. Perfectly round, centred, not cropped. No cord, no text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: tam yuvarlak, ortada; ip yok; yazı yok; gerçek alfa.

#### 114. W2.10 Kırmızı ipek ip (iki düğmeye sarılı)

- İndirme adı: `34-red-lacquer-double-happiness__string.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/string.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 410×600 px (0.683:1) · şeffaf zemin (gerçek alfa) · PNG

```
A thin round red silk cord (#A81E24 with a soft sheen) wound in a neat figure-eight around two round buttons that are NOT drawn, on a fully transparent background: the two button discs are each 50% of the image width across, centred horizontally, one centred at 22% and one at 78% of the image height; the cord loops once around the outer rim of each (hugging the rims, leaving the discs themselves empty and transparent) and crosses itself once between them in the middle; a short loose end with a tiny gold bead hangs from the lower loop. Soft warm light from the top-left, a fine shadow under the cord only. No buttons, no paper, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: yalnız ip; düğme diskleri boş/şeffaf (%22 ve %78 merkezli, genişliğin %50'si); ortada bir kez çapraz; gerçek alfa.

#### 115. W2.11 Altın varak 囍 (cepte)

- İndirme adı: `34-red-lacquer-double-happiness__xi_gold.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/xi_gold.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×800 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
The Chinese double happiness character 囍, alone, as a crisp cut-out of real gold leaf on paper, seen straight on, on a fully transparent background, centred and filling about 80% of the square: the classic balanced form of 囍 with clean straight strokes, the gold leaf showing fine wrinkles and a soft satin shine from the top-left, a hair of shadow under its edges. Exactly this one character, correctly written, nothing else: no circle around it, no other character, no flower, no frame. True transparent background PNG (real alpha channel).
```

Kontrol: tek karakter 囍, doğru yazılmış; çevresinde çerçeve/başka karakter yok; gerçek alfa.

#### 116. W2.12 Dış kâğıt kesim pencere (kırmızı; ortadan ikiye kesilir)

- İndirme adı: `34-red-lacquer-double-happiness__veil_outer.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_outer.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (listede #106)

```
A single sheet of red Chinese paper-cut (jianzhi) in the same cinnabar red paper as red_paper.png, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): an intricate window grille pattern with a large blooming tree peony in the centre, peony leaves and buds, auspicious cloud scrolls and a fine lattice border all round, the cut-away parts fully transparent (real openings, about 45% of the area open), crisp clean cut edges with a hair of shadow. The design is perfectly mirror-symmetric left to right (it will be cut down the vertical centre line into two shutter halves), with no important detail exactly on the centre line. No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tuvali dolduran tek kâğıt kesim; ortadan simetrik; açık yerler gerçekten şeffaf; yazı yok.

#### 117. W2.13 İç kâğıt kesim pencere (altın; ortadan ikiye kesilir)

- İndirme adı: `34-red-lacquer-double-happiness__veil_inner.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_inner.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: veil_outer.png (listede #116)

```
A single sheet of fine gold paper-cut (gold-leaf paper) of the same size, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): a lighter, finer pattern than veil_outer.png — a delicate lattice of plum blossoms and small cloud scrolls with two smaller peonies, about 60% of the area cut away (fully transparent openings), crisp edges, a soft gold satin shine from the top-left. Perfectly mirror-symmetric left to right (it is cut down the vertical centre line into two halves). No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: altın, dış kattan daha ince ve açık; simetrik; açık yerler şeffaf; yazı yok.

#### 118. W2.14 Açılış kartı (boş, yuvarlak foto penceresi)

- İndirme adı: `34-red-lacquer-double-happiness__card_small.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: cream_paper.png (listede #107)

```
A flat vertical invitation card of the same warm cream paper as cream_paper.png, exactly 0.69:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine gold-leaf border line inset from the edge and tiny gold paper-cut cloud scrolls at its four corners, a very soft contact shade on the card itself. In its upper part a round portrait window, a perfect circle 62% of the card's width across, horizontally centred, its top edge at 9% of the card's height, framed by a slim red-and-gold ring, the window filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers, characters or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: daire pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 119. W2.15 Altın bulutlar — üç ayrı dosya

- İndirme adı: `34-red-lacquer-double-happiness__cloud_1.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×400 px (2:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (cloud_1, cloud_2, cloud_3). Make ONLY ONE image now: cloud_1 (number 1 of 3).

A single Chinese auspicious cloud (xiangyun) motif cut from gold-leaf paper, alone, on a fully transparent background, seen flat and straight on, filling about 85% of the width: soft rolling scroll curls with a few spiralling heads, crisp paper-cut edges, warm gold with a soft satin shine from the top-left, a hair of shadow under its edges. Centered, not cropped. No other object, no text, letters, numbers or characters. True transparent background PNG (real alpha channel). (Make three different clouds: 1 = long and low with three curls, 2 = compact with two large curls, 3 = a small wisp with one curl.)
```

Kontrol: tek bulut; üç dosya farklı; altın kâğıt kesim; gerçek alfa.

#### 120. W2.15 Altın bulutlar — üç ayrı dosya

- İndirme adı: `34-red-lacquer-double-happiness__cloud_2.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×400 px (2:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (cloud_1, cloud_2, cloud_3). Make ONLY ONE image now: cloud_2 (number 2 of 3).

A single Chinese auspicious cloud (xiangyun) motif cut from gold-leaf paper, alone, on a fully transparent background, seen flat and straight on, filling about 85% of the width: soft rolling scroll curls with a few spiralling heads, crisp paper-cut edges, warm gold with a soft satin shine from the top-left, a hair of shadow under its edges. Centered, not cropped. No other object, no text, letters, numbers or characters. True transparent background PNG (real alpha channel). (Make three different clouds: 1 = long and low with three curls, 2 = compact with two large curls, 3 = a small wisp with one curl.)
```

Kontrol: tek bulut; üç dosya farklı; altın kâğıt kesim; gerçek alfa.

#### 121. W2.15 Altın bulutlar — üç ayrı dosya

- İndirme adı: `34-red-lacquer-double-happiness__cloud_3.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×400 px (2:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (cloud_1, cloud_2, cloud_3). Make ONLY ONE image now: cloud_3 (number 3 of 3).

A single Chinese auspicious cloud (xiangyun) motif cut from gold-leaf paper, alone, on a fully transparent background, seen flat and straight on, filling about 85% of the width: soft rolling scroll curls with a few spiralling heads, crisp paper-cut edges, warm gold with a soft satin shine from the top-left, a hair of shadow under its edges. Centered, not cropped. No other object, no text, letters, numbers or characters. True transparent background PNG (real alpha channel). (Make three different clouds: 1 = long and low with three curls, 2 = compact with two large curls, 3 = a small wisp with one curl.)
```

Kontrol: tek bulut; üç dosya farklı; altın kâğıt kesim; gerçek alfa.

#### 122. W2.16 Ay kapısı çerçevesi (yuvarlak foto çerçevesi)

- İndirme adı: `34-red-lacquer-double-happiness__moon_gate.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/moon_gate.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1200 px (1:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A round Chinese garden moon gate seen straight on as a decorative frame, on a fully transparent background, filling the image edge to edge: a ring of deep red lacquer (#4A0A0E to #A81E24) about 12% of the image width thick, with a slim gold-leaf inner edge and a slim gold-leaf outer edge, a delicate red paper-cut tree peony branch climbing over the lower left of the ring and a small gold cloud scroll at the upper right, both kept inside the image. The round opening in the middle is a perfect circle 72% of the image width across, centred, filled with flat pure green #00FF00 (no texture, no shading). Soft warm light from the top-left. No wall, no garden, no background, no text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: tam daire pencere, düz `#00FF00`, %72; çerçeve dışında zemin yok; yazı yok; gerçek alfa.

#### 123. W2.17 Kâğıt kesim bordür (başlık altı)

- İndirme adı: `34-red-lacquer-double-happiness__peony_band.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/peony_band.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×300 px (16:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (listede #106)

```
A long horizontal border strip of red Chinese paper-cut in the same cinnabar paper as red_paper.png, on a fully transparent background: a small blooming peony in the centre with leaves and buds running out symmetrically to both sides and ending in little cloud scrolls, crisp cut edges with a hair of shadow, the cut-away parts fully transparent, a few tiny gold-leaf accents. Centered, not cropped, generous empty margin. Mirror-symmetric left to right. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: yatay şerit; ortada şakayık; simetrik; açık yerler şeffaf; yazı yok.

#### 124. W2.18 Kâğıt kesim katmanları (paralaks) — iki dosya

- İndirme adı: `34-red-lacquer-double-happiness__jianzhi_far.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/jianzhi_far.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1600 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A large, airy Chinese paper-cut panel in a slightly darker red than the lacquer ground (#7A141A), on a fully transparent background, filling about 95% of the square: tree peony branches with large blooms and leaves, plum blossom twigs and auspicious cloud scrolls spreading across the whole square, about 70% of the area cut away (fully transparent), crisp edges. It is a faint background layer over a deep red lacquer page, so it is tone-on-tone and calm, no gold. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

#### 125. W2.18 Kâğıt kesim katmanları (paralaks) — iki dosya

- İndirme adı: `34-red-lacquer-double-happiness__jianzhi_near.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/jianzhi_near.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1400×1000 px (7:5) · şeffaf zemin (gerçek alfa) · PNG

```
A smaller Chinese paper-cut spray in gold-leaf paper, on a fully transparent background, filling about 90% of the width: two tree peonies with leaves rising from the bottom edge, a few small cloud scrolls above them, crisp edges, about 50% of the area cut away (fully transparent), a soft satin shine from the top-left. The bottom edge of the spray sits on the bottom edge of the image. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: uzak katman ton-sur-ton koyu kırmızı ve sakin; yakın katman altın ve daha küçük; ikisi de şeffaf; yazı yok.

#### 126. W2.19 Püsküllü düğüm (imza süsü)

- İndirme adı: `34-red-lacquer-double-happiness__tassel.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/tassel.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 480×1200 px (2:5) · şeffaf zemin (gerçek alfa) · PNG

```
A traditional Chinese decorative knot (a pan chang endless knot) in red silk cord, hanging from a short loop at the top, with a carved gold bead under it and a long soft red silk tassel below, seen straight on, on a fully transparent background, filling about 90% of the image height, centred. Warm light from the top-left, a soft silk sheen. No characters on the bead, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek düğüm + boncuk + püskül; boncukta yazı yok; gerçek alfa.

#### 127. W2.20 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `34-red-lacquer-double-happiness__web_hero.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: envelope_pocket.png (listede #110), envelope_flap.png (listede #111), xi_gold.png (listede #115), lacquer.png (listede #105), veil_outer.png (listede #116), tassel.png (listede #126)

```
Wide horizontal still life, photorealistic, soft warm lamplight from the top-left: the tall red envelope of envelope_pocket.png and envelope_flap.png, closed with its red cord wound round two gold buttons and the gold-leaf 囍 on its pocket (as xi_gold.png), standing slightly below the centre on a deep red lacquer table (as lacquer.png); a red paper-cut peony (as veil_outer.png) lying at the left, a red silk knot with a tassel (as tassel.png) and a few small gold paper clouds at the right; a soft dark red background above. The top 20% of the image is calm and empty. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no other character than the one 囍 on the envelope, no text, letters, numbers or logos.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 boş; 囍 dışında yazı yok.

#### 128. 2.1 Ana portre

- İndirme adı: `34-red-lacquer-double-happiness__photos__hero_portrait.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG

```
Square 1:1 wedding portrait of the fictional couple Mei and Julian, in their early thirties (Mei: East Asian, long straight black hair worn low with a small gold hair pin, a slim gold ring; Julian: Latino, short dark curly hair, a neat short beard, warm brown skin; they must not resemble any real person or celebrity) in a garden courtyard at golden hour: she in a modern red silk gown with a high collar, he in a dark charcoal suit with a small red pocket square, standing close and smiling at each other, waist-up, faces in the middle of the frame, a round moon gate in a white garden wall and pink peonies softly out of focus behind them. Photorealistic, warm red, cream and gold palette, subtle grain. No text, no frame.
```

#### 129. 2.2 Story 1 — "The lantern festival"

- İndirme adı: `34-red-lacquer-double-happiness__photos__story_1.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #128)

```
Square 1:1 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) sharing one clear umbrella on a rainy evening street hung with plain red paper lanterns (no writing on them), she laughing and holding his arm, warm light reflected on the wet pavement. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 130. 2.3 Story 2 — "Through the moon gate"

- İndirme adı: `34-red-lacquer-double-happiness__photos__story_2.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #128)

```
Square 1:1: the same couple as hero_portrait.jpg walking hand in hand through a round moon gate in a white garden wall, seen from slightly behind and to the side, she turning to look back over her shoulder with a smile, bamboo and a stone path beyond the gate, soft afternoon light. Photorealistic, same palette and grain. No text.
```

#### 131. 2.4 Story 3 — "Among the peonies"

- İndirme adı: `34-red-lacquer-double-happiness__photos__story_3.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #128)

```
Square 1:1 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, among full pink and red tree peony blooms in a garden, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 132. 2.5 Mekân

- İndirme adı: `34-red-lacquer-double-happiness__photos__venue.jpg`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant garden house with a red lacquered wooden veranda and dark tiled roof beside a calm pond with a stone bridge, a lawn set with a few rows of simple chairs facing a round moon gate decorated with pink and red peonies for a ceremony, strings of warm small lights, early evening. No people, no signs, no characters or text, no temple or shrine. Photorealistic, same palette.
```

#### 133. P1 — Ön yüz

- İndirme adı: `34-red-lacquer-double-happiness__print__invitation_front_5x7.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: cream_paper.png (listede #107), peony_band.png (listede #123), xi_gold.png (listede #115)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm cream paper of cream_paper.png. Along the top edge a band of cinnabar red paper-cut (as peony_band.png, but as a full-width band) about 12% of the height, with a small gold-leaf double happiness character 囍 (as xi_gold.png) centred in it, its lower edge a slim gold-leaf rule (staying above 14% of the height). Along the bottom edge a matching narrower band of red paper-cut peonies and cloud scrolls about 10% of the height with a slim gold-leaf rule on its upper edge (staying below 85%). The rectangle from 17% to 82% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks; the one 囍 in the top band is the only character. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %17–%82 × %10–%90 tamamen boş; 囍 dışında yazı yok; kırmızı bantlar yalnız üstte ve altta.

#### 134. P2 — Arka yüz

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

#### 135. W2.1 Ekoseli yün (zarfın kumaşı)

- İndirme adı: `35-highland-tartan-thistle__tartan_wool.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/tartan_wool.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat top-down texture of soft woven wool tartan filling the whole square edge to edge: an original sett of muted moss-green (#5E6B3E) and heather-purple (#7B5A84) squares with a fine cream (#F1EADB) overcheck and one very thin deep-red (#8E2B2F) line, about four repeats of the sett across the square, real twill weave and a slightly fuzzy wool surface, evenly lit from the top-left. Calm and even, no fold, no crease, no stitching, no fringe, no vignette, no shadow. It must not copy any registered clan or brand tartan. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, crests or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); yosun + funda kareleri, ince krem ve çok ince kırmızı çizgi; kıvrım/yazı yok.

#### 136. W2.2 Krem kâğıt (kartlar, bantlar, form)

- İndirme adı: `35-highland-tartan-thistle__cream_paper.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/cream_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of thick handmade cotton paper in a warm cream (#F1EADB): a gentle natural tooth, very faint fibres, the softest warm mottling, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no deckle edge, no stain, no printing, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu yazı her yerde okunur); krem; dikişsiz; leke/baskı yok.

#### 137. W2.3 Koyu yosun zemin (sayfa zemini)

- İndirme adı: `35-highland-tartan-thistle__moss_ground.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/moss_ground.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat texture of deep moss-green boiled wool felt (#20291D) filling the whole square, a soft matte fibrous surface with a barely visible heathered fleck of darker green and faint heather purple, calm and even everywhere so cream text reads on it. Evenly lit, no pattern, no tartan, no fold, no vignette, no gradient, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: koyu, sakin (üstünde krem yazı okunur); desen/ekose yok; dikişsiz.

#### 138. W2.4 Yağlı boya tepeler (açılışın arka planı)

- İndirme adı: `35-highland-tartan-thistle__hills.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/hills.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1600 px (3:4) · opak · PNG

```
A portrait oil painting of Scottish Highland hills at early morning, painted in rich, soft brushwork like a 19th-century landscape: layered rolling hills in moss green and heather purple fading into the distance, a calm glen with a faint ribbon of a loch in the middle distance, low banks of pale mist lying in the valleys, a soft overcast sky with warm light breaking through. The hills fill the lower 60% of the image; the upper 40% is calm, pale, misty sky with nothing in it (text sits there). Muted, deep tones that sit well under cream text (moss #5E6B3E, heather #7B5A84, ground #20291D, mist #DFE3DC). No castle, no buildings, no people, no animals, no trees in the foreground, no frame, no signature. No text, letters, numbers or symbols.
```

Kontrol: tepeler alt %60'ta; üst %40 boş, sakin gök; kale/insan/imza yok; koyu ve yumuşak.

#### 139. W2.5 Dağ sisi (iki sis katmanı)

- İndirme adı: `35-highland-tartan-thistle__mist.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/mist.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×800 px (2:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single soft horizontal bank of pale Highland mist (#DFE3DC), photographed as real low cloud, on a fully transparent background: a long drifting band, thicker in the middle and thinning to nothing towards the left, right, top and bottom edges, with soft wisps and gentle variations of density, semi-transparent everywhere (never a solid white block). It fills the width of the image and about the middle 70% of its height; every edge fades to full transparency well before the border. No hills, no sky, no trees, no objects. No text. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: tek sis bandı; kenarları tam şeffafa iniyor; yarı saydam (düz beyaz blok değil); başka nesne yok; gerçek alfa.

#### 140. W2.6 Zarfın arkası (iç astar görünür)

- İndirme adı: `35-highland-tartan-thistle__envelope_back.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_back.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: tartan_wool.png (listede #135)

```
The back panel of an open rectangular envelope made of the tartan wool of tartan_wool.png, seen straight from the front, on a fully transparent background: a flat upright rectangle filling the whole image edge to edge (the image IS the envelope, 0.9:1), its inside facing us, lined with a plain deep moss-green wool lining (#46512C) that covers it all, a slim edge of the tartan showing along the top and sides, softly lit from the top-left, a gentle shade towards the bottom where the pocket would be. No flap, no front pocket, no strap, no card inside, no shadow outside the rectangle. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tuvali dolduran dikdörtgen (0,9:1); iç astar düz yosun yeşili; kapak/cep/kayış yok; gerçek alfa.

#### 141. W2.7 Zarfın ön cebi

- İndirme adı: `35-highland-tartan-thistle__envelope_front.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_front.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_back.png (listede #140), tartan_wool.png (listede #135)

```
Only the front pocket of the same tartan wool envelope as envelope_back.png, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from 34% of the image height down to the bottom edge, its straight top edge finished with a narrow folded hem and a fine line of cream stitching, soft daylight from the top-left. The upper 34% of the canvas is completely transparent. No flap, no strap, no buckle, no card, no shadow outside the pocket. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: cep tuvalin %34'ünden alta, tam genişlikte; üstü tamamen şeffaf; kayış/toka yok; gerçek alfa.

#### 142. W2.8 Zarfın düz kapağı (V değil)

- İndirme adı: `35-highland-tartan-thistle__flap.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: tartan_wool.png (listede #135)

```
Only the closed flap of the same tartan wool envelope, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from the top edge down to 56% of the image height, folded down over the pocket, with a soft rounded fold along its top edge and a STRAIGHT bottom edge (not a V, not a point, not scalloped) finished with a narrow hem and a fine line of cream stitching; a very soft shade along its bottom edge. The lower 44% of the canvas is completely transparent. No strap, no buckle, no seal, no button, no card. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: kapak üstten %56'ya, tam genişlik; alt kenar **düz**; mühür/düğme/kayış yok; altı tamamen şeffaf; gerçek alfa.

#### 143. W2.9 Deri kayış

- İndirme adı: `35-highland-tartan-thistle__strap.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/strap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 240×1300 px (0.185:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single straight vertical leather strap, seen straight from the front, on a fully transparent background, filling the image edge to edge (about 0.18:1): warm saddle-brown vegetable-tanned leather (#6B4428) with a fine stitched line of cream thread along both long edges, softly burnished edges, a natural grain, a rounded tip at the bottom end, the top end cut straight. Soft daylight from the top-left. No buckle, no holes, no rivets, no shadow outside the strap. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek dikey kayış; iki kenarda krem dikiş; alt ucu yuvarlak; toka yok; gerçek alfa.

#### 144. W2.10 Pirinç toka

- İndirme adı: `35-highland-tartan-thistle__buckle.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/buckle.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 560×320 px (7:4) · şeffaf zemin (gerçek alfa) · PNG

```
A single antique brass strap buckle, seen straight from the front, on a fully transparent background, filling the image edge to edge (about 1.75:1): a rectangular frame with softly rounded corners and a centre bar, with its pointed prong lying flat across the bar, in warm antique brass (#A88437) with gentle highlights and a little patina, finely engraved with a simple border line. The openings inside the frame are fully transparent (the strap shows through them). Soft daylight from the top-left. No strap, no shadow outside the buckle. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek toka; çerçeve içi şeffaf; dil ortadaki çubuğun üstünde; gerçek alfa.

#### 145. W2.11 Funda dalı (cepten yükselen)

- İndirme adı: `35-highland-tartan-thistle__heather_sprig.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_sprig.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 600×1100 px (6:11) · şeffaf zemin (gerçek alfa) · PNG

```
A single sprig of Scottish heather standing upright, photorealistic with a soft painterly finish, on a fully transparent background: a slender woody stem with a few small side branches, dense spikes of tiny heather-purple (#7B5A84) bell flowers along the upper half, small dark-green needle leaves, one short sprig of pale cream heather tucked beside it, filling about 90% of the image height, centred, the stem's cut end at the bottom. Soft daylight from the top-left. No ribbon, no vase, no shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek dik funda dalı; mor çiçekler üst yarıda; alt uç kesik; kurdele/gölge yok; gerçek alfa.

#### 146. W2.12 Funda ayırıcı (başlık altı)

- İndirme adı: `35-highland-tartan-thistle__heather_divider.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_divider.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×260 px (6.154:1) · şeffaf zemin (gerçek alfa) · PNG

```
A slim horizontal divider made of two small sprigs of heather and a small thistle head, photorealistic with a soft painterly finish, on a fully transparent background: the thistle head with its purple tuft in the centre, a heather sprig reaching out to the left and one to the right, lying horizontally, delicate and airy, centred with a generous empty margin at both ends. Soft daylight from the top-left. No ribbon, no line, no shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yatay, ortada devedikeni, iki yanda funda; kenarlarda boşluk; çizgi/kurdele yok; gerçek alfa.

#### 147. W2.13 Funda çiçekçikleri (yanıt gönderilince süzülen) — üç ayrı dosya

- İndirme adı: `35-highland-tartan-thistle__heather_floret_1.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (heather_floret_1, heather_floret_2, heather_floret_3). Make ONLY ONE image now: heather_floret_1 (number 1 of 3).

A single tiny cluster of heather bell flowers, photorealistic, alone, on a fully transparent background: three to five small heather-purple (#7B5A84) bells on a short sprig tip with a couple of needle leaves, filling about 55% of the square, centred, not cropped. Soft daylight from the top-left. No shadow, no other object. No text. True transparent background PNG (real alpha channel). (Make three different clusters: 1 = purple bells pointing down, 2 = a paler lilac cluster, 3 = a single cream-white bell sprig.)
```

Kontrol: tek küçük salkım; üç dosya farklı; gölge yok; gerçek alfa.

#### 148. W2.13 Funda çiçekçikleri (yanıt gönderilince süzülen) — üç ayrı dosya

- İndirme adı: `35-highland-tartan-thistle__heather_floret_2.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (heather_floret_1, heather_floret_2, heather_floret_3). Make ONLY ONE image now: heather_floret_2 (number 2 of 3).

A single tiny cluster of heather bell flowers, photorealistic, alone, on a fully transparent background: three to five small heather-purple (#7B5A84) bells on a short sprig tip with a couple of needle leaves, filling about 55% of the square, centred, not cropped. Soft daylight from the top-left. No shadow, no other object. No text. True transparent background PNG (real alpha channel). (Make three different clusters: 1 = purple bells pointing down, 2 = a paler lilac cluster, 3 = a single cream-white bell sprig.)
```

Kontrol: tek küçük salkım; üç dosya farklı; gölge yok; gerçek alfa.

#### 149. W2.13 Funda çiçekçikleri (yanıt gönderilince süzülen) — üç ayrı dosya

- İndirme adı: `35-highland-tartan-thistle__heather_floret_3.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (heather_floret_1, heather_floret_2, heather_floret_3). Make ONLY ONE image now: heather_floret_3 (number 3 of 3).

A single tiny cluster of heather bell flowers, photorealistic, alone, on a fully transparent background: three to five small heather-purple (#7B5A84) bells on a short sprig tip with a couple of needle leaves, filling about 55% of the square, centred, not cropped. Soft daylight from the top-left. No shadow, no other object. No text. True transparent background PNG (real alpha channel). (Make three different clusters: 1 = purple bells pointing down, 2 = a paler lilac cluster, 3 = a single cream-white bell sprig.)
```

Kontrol: tek küçük salkım; üç dosya farklı; gölge yok; gerçek alfa.

#### 150. W2.14 Pirinç madalyon çerçevesi (oval foto penceresi)

- İndirme adı: `35-highland-tartan-thistle__locket_rim.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/locket_rim.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1250 px (4:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
An open antique brass locket seen straight from the front, on a fully transparent background, filling the image edge to edge: an oval frame of warm antique brass (#A88437) about 10% of the image width thick, with a fine engraved border of tiny leaves and a slim beaded inner edge, a small round bail and ring at the top centre. The oval opening inside the frame is filled with flat pure green #00FF00 (no texture, no shading): it is 76% of the image width across (from 12% to 88% of the width) and 76% of the image height tall (from 16% to 92% of the height). Soft daylight from the top-left. No hinge lid, no chain, no shadow outside the locket. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: oval pencere düz `#00FF00`, genişlikte %12–%88, yükseklikte %16–%92; üstte halka; kapak/zincir yok; gerçek alfa.

#### 151. W2.15 Madalyon kapağı (menteşede açılan)

- İndirme adı: `35-highland-tartan-thistle__locket_lid.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/locket_lid.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: locket_rim.png (listede #150)

```
The closed front lid of the same antique brass locket as locket_rim.png, alone, seen straight from the front, on a fully transparent background, filling the image edge to edge (an oval, 0.8:1): warm antique brass with a softly domed surface, a delicate engraved spray of heather and a small thistle in the centre, a slim engraved border, a tiny hinge knuckle on the left edge, gentle highlights from the top-left. No bail, no chain, no frame around it, no shadow outside the oval. No text, letters, numbers, monograms, crests or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek oval kapak (0,8:1); ortada funda + devedikeni gravürü; solda küçük menteşe; harf/monogram yok; gerçek alfa.

#### 152. W2.16 Devedikeni (imza süsü)

- İndirme adı: `35-highland-tartan-thistle__thistle.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/thistle.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
A single Scotch thistle with a short stem and two leaves, photorealistic with a soft painterly finish, on a fully transparent background, filling about 88% of the image height: one full flower head with a soft purple tuft (#7B5A84) on a spiky green bulb, a slender stem, two graceful spiny leaves in muted moss green, a tiny sprig of heather crossing the stem. Centred, not cropped. Soft daylight from the top-left. No ribbon, no shadow. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek devedikeni; mor tepe, iki yaprak; kurdele/gölge yok; gerçek alfa.

#### 153. W2.17 Zarftaki kart (boş, oval foto penceresi)

- İndirme adı: `35-highland-tartan-thistle__card_small.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1166 px (0.858:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: cream_paper.png (listede #136)

```
A flat vertical invitation card of the same cream paper as cream_paper.png, exactly 0.858:1, filling the image edge to edge (the card IS the image), seen straight on, with a softly torn deckle edge, a fine engraved brass-coloured border line inset from the edge and a tiny sprig of heather in each top corner, a very soft contact shade on the card itself. In its upper part an oval portrait window filled with flat pure green #00FF00 (no texture, no shading): 46% of the card's width across, horizontally centred, its top at 8% and its bottom at 57% of the card's height. Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: oval pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 154. W2.18 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `35-highland-tartan-thistle__web_hero.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: envelope_back.png (listede #140), strap.png (listede #143), buckle.png (listede #144), heather_sprig.png (listede #145), locket_rim.png (listede #150), hills.png (listede #138)

```
Wide horizontal still life, photorealistic, soft daylight from the top-left: the tartan wool envelope of envelope_back.png, closed, with its straight flap, the leather strap of strap.png and the brass buckle of buckle.png, lying slightly below the centre on a deep moss-green wool throw, a sprig of heather (as heather_sprig.png) and a small thistle laid at the left, an open antique brass locket (as locket_rim.png, its window empty cream) at the right; behind, softly out of focus, an oil-painted Highland landscape with mist (as hills.png). The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers, crests or logos.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı/arma yok.

#### 155. 2.1 Ana portre

- İndirme adı: `35-highland-tartan-thistle__photos__hero_portrait.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Portrait 4:5 wedding photo of the fictional couple Isla and Callum, in their early thirties (Isla: long soft copper-red hair, pale skin with freckles, a slim gold ring; Callum: short dark-brown hair, a neat short beard, fair skin; they must not resemble any real person or celebrity) on a heather-covered hillside in soft overcast light: she in a simple ivory wool-crepe gown with a small posy of heather, he in a moss-green tweed suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, misty hills softly out of focus behind them. Photorealistic, soft heather, moss and cream palette, subtle grain. No text, no frame.
```

#### 156. 2.2 Story 1 — "A wet day on the hill"

- İndirme adı: `35-highland-tartan-thistle__photos__story_1.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #155)

```
Portrait 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing under one shared waxed jacket held over their heads in light rain on a narrow hill path, wet heather around them, soft grey light, misty slopes behind. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 157. 2.3 Story 2 — "A walk by the loch"

- İndirme adı: `35-highland-tartan-thistle__photos__story_2.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #155)

```
Portrait 4:5: the same couple as hero_portrait.jpg walking hand in hand along the stony shore of a calm Highland loch in the evening, seen from slightly behind and to the side, her head turned towards him, low mist over the water and dark hills beyond. Photorealistic, same palette and grain. No text.
```

#### 158. 2.4 Story 3 — "Among the heather"

- İndirme adı: `35-highland-tartan-thistle__photos__story_3.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #155)

```
Portrait 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, holding a small sprig of purple heather, among blooming heather on a hillside, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 159. 2.5 Mekân

- İndirme adı: `35-highland-tartan-thistle__photos__venue.jpg`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant old stone country house with tall chimneys and a walled garden at the edge of a wooded Highland glen, a lawn with a few rows of simple wooden chairs set for a ceremony facing a wide view of misty purple hills, soft late-afternoon light. Not a real or famous building, no castle, no people, no signs, no text. Photorealistic, same palette.
```

#### 160. P1 — Ön yüz

- İndirme adı: `35-highland-tartan-thistle__print__invitation_front_5x7.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: cream_paper.png (listede #136), tartan_wool.png (listede #135), heather_divider.png (listede #146)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the cream paper of cream_paper.png. Along the top edge a band of the tartan wool of tartan_wool.png about 12% of the height, with a slim brass-coloured rule on its lower edge and, centred just below the band, a small spray of heather and a thistle (as heather_divider.png), all staying above 17% of the height. Along the bottom edge a matching tartan band about 9% of the height with a slim brass-coloured rule on its upper edge (staying below 88%). The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, crests, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı yok; ekose bantlar yalnız üstte ve altta.

#### 161. P2 — Arka yüz

- İndirme adı: `35-highland-tartan-thistle__print__invitation_back_5x7.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: tartan_wool.png (listede #135)

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream paper, only a narrow tartan band of tartan_wool.png along the top edge (about 7% of the height, with a slim brass-coloured rule on its lower edge, staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flower, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar ekose bandı (%10'un üstünde); %14'ün altı boş; yazı yok.

### 36_Victorian_Glasshouse

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, Latin plant names, labels with writing, logos, monograms or watermarks in any image** (a blank label, a blank seed packet and engraved botanical line art without lettering are fine). Give W3.1 `fern_ground.png`, W3.3 `herbarium_paper.png` and W3.4 `packet_body.png` as the style reference of every later part: the same deep fern green, the same herbarium paper, the same kraft, copper and jute, the same soft daylight through glass.
```

#### 162. W3.1 Koyu eğrelti zemini (açılış, home kartının arkası, imza, gezinme)

- İndirme adı: `36-victorian-glasshouse__fern_ground.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/fern_ground.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat texture of a deep fern-green (#1C3328) surface like the shadowy interior of a Victorian glasshouse at dusk: a soft matte velvet-paper grain, the faintest suggestion of very fine engraved fern fronds tone-on-tone (barely visible, a slightly lighter green, no outline), calm and even everywhere so light text reads on it. No vignette, no gradient, no light spot, no object, no frame. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#1C3328` civarı; desen neredeyse görünmez; yazı yok.

#### 163. W3.2 Buğulu cam zemini (sayfa zemini)

- İndirme adı: `36-victorian-glasshouse__glass_ground.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/glass_ground.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of a pale sage misted glass pane seen straight on (#E2EAE3), lit evenly by daylight: a very soft milky haze, the faintest scattering of tiny condensation dots, a hint of old glass waviness, calm enough for dark text to read on it everywhere. No drops running, no frame, no shadow, no plants behind it, no vignette. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin, açık adaçayı yeşili; dikişsiz; damla/akıntı yok; yazı yok.

#### 164. W3.3 Herbaryum kâğıdı (kartlar, bantlar, etiket, form)

- İndirme adı: `36-victorian-glasshouse__herbarium_paper.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of thick antique herbarium mounting paper in a warm cream (#F3EDDF): a soft cotton tooth, a very faint natural mottling, a gentle warm patina, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no pressed plant, no printing. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin krem; dikişsiz; leke/bitki/baskı yok.

#### 165. W3.4 Tohum paketi — ön duvar (kapalı zarfın gövdesi)

- İndirme adı: `36-victorian-glasshouse__packet_body.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_body.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1032×1440 px (0.717:1) · şeffaf zemin (gerçek alfa) · PNG

```
The front wall of an antique kraft-paper seed packet envelope, seen perfectly straight on, alone on a fully transparent background, filling the image edge to edge (the image IS the paper, about 0.72:1): warm kraft brown paper (#AC8054) with natural fibres and a soft tooth, slightly worn deckled side edges, a straight clean top edge (the mouth of the packet), and in its middle a delicate engraved botanical illustration of a fern frond and a small orchid printed in dark sepia ink as on a Victorian seed packet, framed by a fine printed double rule. The upper 30% of the paper is plain kraft (a flap will cover it). Soft daylight from the top-left. No text, no lettering, no numbers, no brand, no price, no twine, no label. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: kenardan kenara düz kraft; üst kenar düz; ortada sepya eğrelti + orkide gravürü; üst %30 sade; yazı/sicim/etiket yok; alfa.

#### 166. W3.5 Tohum paketi — kapak, dış yüz

- İndirme adı: `36-victorian-glasshouse__packet_flap.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1360×600 px (2.267:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: packet_body.png (listede #165)

```
The top flap of the same kraft seed packet as packet_body.png, folded down, seen perfectly straight on, alone on a fully transparent background, filling the image edge to edge (about 2.27:1): the same warm kraft paper, a straight top edge (the fold), a straight lower edge with a softly deckled border and a slim printed sepia rule just above it, a tiny engraved fern sprig at its centre. Soft daylight from the top-left, a whisper of shade along the lower edge on the flap itself. No text, letters, numbers, no twine, no label, no seal. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen kapak (V değil), üst kenar katlama çizgisi; ortada küçük eğrelti; mühür/sicim/yazı yok; alfa.

#### 167. W3.5b Tohum paketi — kapak, iç yüz

- İndirme adı: `36-victorian-glasshouse__packet_flap_in.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_flap_in.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1360×600 px (2.267:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: packet_flap.png (listede #166)

```
The inside of the same seed packet flap as packet_flap.png, seen straight on as it stands up above the open packet, alone on a fully transparent background, filling the image edge to edge (about 2.27:1): plain, slightly darker unprinted kraft paper with natural fibres, the fold along the BOTTOM edge, the softly deckled free edge along the top, a faint crease. Soft daylight from the top-left. No print, no text, no numbers, no twine, no label. True transparent background PNG (real alpha channel).
```

Kontrol: baskısız iç yüz; katlama altta, serbest kenar üstte; alfa.

#### 168. W3.6 Bakır bitki etiketi (boş; monogram/numara site yazar)

- İndirme adı: `36-victorian-glasshouse__copper_tag.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/copper_tag.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 600×800 px (3:4) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A small antique copper plant label as used in a Victorian glasshouse, seen straight on, alone on a fully transparent background, filling the image edge to edge (3:4): a rectangular copper plate with softly rounded corners and a slim raised rim, warm copper (#B26A3C) with a gentle patina and a little verdigris (#6F9E8E) at the edges, a small round punched hole near the top-left corner filled with flat pure green #00FF00 (no texture, no shading), the centre of the plate smooth and EMPTY (the website stamps letters there). Soft daylight from the top-left. No string, no text, letters, numbers or engraving in the centre. True transparent background PNG (real alpha channel).
```

Kontrol: boş merkez; delik sol üstte, düz `#00FF00`; ip yok; alfa.

#### 169. W3.7 Jüt sicim (dikey, üst–alt dikişsiz)

- İndirme adı: `36-victorian-glasshouse__twine.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/twine.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 160×1200 px (2:15) · şeffaf zemin (gerçek alfa) · PNG

```
A single straight vertical length of natural jute garden twine, two twisted strands, seen straight on, alone on a fully transparent background, running from the very top edge to the very bottom edge of the image, centred, about 40% of the image width thick; warm natural fibre colour with tiny stray fibres. The top and bottom ends must tile vertically without a visible seam (no knot, no cut end). Soft daylight from the top-left. No text. True transparent background PNG (real alpha channel).
```

Kontrol: düz dikey ip; üst–alt dikişsiz; düğüm/uç yok; alfa.

#### 170. W3.8 Cam buğusu (yarı saydam yoğuşma)

- İndirme adı: `36-victorian-glasshouse__glass_mist.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/glass_mist.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1600 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
Condensation on a pane of glass, as a semi-transparent overlay on a fully transparent background, filling the whole square: a soft milky white haze of fine fog (white, about 40–60% opacity, uneven like breath on glass), thousands of tiny condensation droplets of different sizes, a few larger droplets, two or three thin trickles running down. No glass frame, no plants, no colour other than white and transparency, no text. True transparent background PNG (real alpha channel; the haze itself partly transparent).
```

Kontrol: yarı saydam beyaz buğu + damlacıklar; çerçeve/bitki yok; gerçek alfa.

#### 171. W3.9 Dökme demir sera kemerleri (paralaks katmanı)

- İndirme adı: `36-victorian-glasshouse__ironwork.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/ironwork.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×1200 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
The cast-iron ribs of a Victorian glasshouse roof seen from inside, looking up, on a fully transparent background: three slender elegant arches of dark painted cast iron (deep green-black with a hint of verdigris) curving across the upper half of the image, delicate scrollwork brackets where they meet thin columns at the sides, the panes between them fully transparent (no glass colour, no sky). The lower 45% of the image is EMPTY transparency. Soft daylight from the top-left catching the iron. No plants, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: üst yarıda kemerler, alt %45 boş; camlar şeffaf; bitki/yazı yok; alfa.

#### 172. W3.10 Eğrelti otları ve orkide (açılış ve home çerçevesi)

- İndirme adı: `36-victorian-glasshouse__ferns.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/ferns.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×1200 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
Lush botanical fern fronds rising from the bottom-left and bottom-right corners of the image on a fully transparent background, as a frame for something in the middle: maidenhair and sword ferns in deep and fresh greens, a few curled fiddleheads, and on the right one arching spray of white-and-blush moth orchids; photorealistic leaves with the fine detail of a botanical engraving, soft daylight from the top-left. The centre of the image (from 25% to 75% of the width and the whole upper 60%) is EMPTY transparency. No pots, no glass, no insects, no text. True transparent background PNG (real alpha channel).
```

Kontrol: bitkiler alt köşelerde, orta ve üst %60 boş; saksı/yazı yok; alfa.

#### 173. W3.11 Orkide dalı (başlık altı ayırıcı)

- İndirme adı: `36-victorian-glasshouse__orchid_sprig.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/orchid_sprig.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1400×300 px (14:3) · şeffaf zemin (gerçek alfa) · PNG

```
A single slender horizontal sprig in fine botanical engraving style with soft natural colour, on a fully transparent background: a thin arching orchid stem with three small white-and-blush blossoms in the middle and two tiny fern leaflets at the ends, centred, symmetrical in weight, generous empty margin all round. No line, no frame, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: ince, yatay, ortalı; çizgi/yazı yok; alfa.

#### 174. W3.12 Numune camı (4:5 foto vitrini)

- İndirme adı: `36-victorian-glasshouse__specimen_frame.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/specimen_frame.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1250 px (4:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A Victorian botanical specimen case seen straight on, alone on a fully transparent background, filling the image edge to edge (4:5): a slim frame of dark-stained wood with fine copper corner pieces and a narrow cream herbarium-paper mount inside it, a tiny copper ring at the top-right corner. The window inside the mount is a perfect rectangle from 9% to 91% of the width and from 8% to 92% of the height, filled with flat pure green #00FF00 (no texture, no shading, no glass reflection in it). Soft daylight from the top-left. No plant, no label, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen pencere düz `#00FF00`, tarif edilen konumda; yazı/bitki yok; alfa.

#### 175. W3.13 Herbaryum etiketi (boş; yazıyı site koyar)

- İndirme adı: `36-victorian-glasshouse__herbarium_label.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_label.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×360 px (10:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: herbarium_paper.png (listede #164)

```
A blank antique herbarium specimen label seen straight on, alone on a fully transparent background, filling the image edge to edge (10:3): a slip of cream paper slightly warmer than herbarium_paper.png with a finely printed sepia double border and tiny engraved fern sprigs in its two left corners, the inside EMPTY (the website writes the caption there), a very soft shade on the paper itself. No text, letters, numbers or Latin names. True transparent background PNG (real alpha channel).
```

Kontrol: boş iç alan; köşelerde küçük eğrelti; yazı yok; alfa.

#### 176. W3.14 Eğrelti yaprakçıkları (süzülen parçacıklar) — üç ayrı dosya

- İndirme adı: `36-victorian-glasshouse__leaf_1.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (leaf_1, leaf_2, leaf_3). Make ONLY ONE image now: leaf_1 (number 1 of 3).

A single small fern leaflet, alone on a fully transparent background, photorealistic with fine veins, fresh fern green, filling about 55% of the square, centred, not cropped, a soft natural curve. No stem from the edge, no other leaf, no shadow, no text. True transparent background PNG (real alpha channel). (Make three different leaflets: 1 = a maidenhair fern pinnule, 2 = a small sword-fern leaflet, 3 = a curled young fiddlehead.)
```

Kontrol: tek yaprak; üç dosya farklı; alfa.

#### 177. W3.14 Eğrelti yaprakçıkları (süzülen parçacıklar) — üç ayrı dosya

- İndirme adı: `36-victorian-glasshouse__leaf_2.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (leaf_1, leaf_2, leaf_3). Make ONLY ONE image now: leaf_2 (number 2 of 3).

A single small fern leaflet, alone on a fully transparent background, photorealistic with fine veins, fresh fern green, filling about 55% of the square, centred, not cropped, a soft natural curve. No stem from the edge, no other leaf, no shadow, no text. True transparent background PNG (real alpha channel). (Make three different leaflets: 1 = a maidenhair fern pinnule, 2 = a small sword-fern leaflet, 3 = a curled young fiddlehead.)
```

Kontrol: tek yaprak; üç dosya farklı; alfa.

#### 178. W3.14 Eğrelti yaprakçıkları (süzülen parçacıklar) — üç ayrı dosya

- İndirme adı: `36-victorian-glasshouse__leaf_3.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 3 separate images (leaf_1, leaf_2, leaf_3). Make ONLY ONE image now: leaf_3 (number 3 of 3).

A single small fern leaflet, alone on a fully transparent background, photorealistic with fine veins, fresh fern green, filling about 55% of the square, centred, not cropped, a soft natural curve. No stem from the edge, no other leaf, no shadow, no text. True transparent background PNG (real alpha channel). (Make three different leaflets: 1 = a maidenhair fern pinnule, 2 = a small sword-fern leaflet, 3 = a curled young fiddlehead.)
```

Kontrol: tek yaprak; üç dosya farklı; alfa.

#### 179. W3.15 Paketten çıkan kart (boş, 4:5 foto penceresi)

- İndirme adı: `36-victorian-glasshouse__card_small.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 976×1400 px (0.697:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: herbarium_paper.png (listede #164)

```
A flat vertical invitation card of the same cream herbarium paper as herbarium_paper.png, exactly 0.70:1, filling the image edge to edge (the card IS the image), seen straight on, with a finely printed sepia border line inset from the edge and a tiny engraved fern sprig in each lower corner, a very soft contact shade on the card itself. In its upper part a portrait window, a rectangle 58% of the card's width wide and 4:5 tall, horizontally centred, its top edge at 7% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 180. W3.16 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `36-victorian-glasshouse__web_hero.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: ironwork.png (listede #171), packet_body.png (listede #165), ferns.png (listede #172)

```
Wide horizontal still life, photorealistic, soft daylight through old glass from the top-left: inside a Victorian glasshouse with slender cast-iron arches above (as ironwork.png), on a weathered potting bench a kraft seed packet envelope (as packet_body.png, blank, no lettering) tied with jute twine and a small blank copper plant label at the knot, standing slightly below the centre, surrounded by maidenhair ferns and one spray of white moth orchids (as ferns.png), a little condensation on the glass in the background. The top 20% of the image is calm, out-of-focus glasshouse. This image is cropped to 1200×630 for link previews: keep the whole packet visible with at least 5% empty margin below it. No people, no text, letters, numbers, labels with writing or logos.
```

Kontrol: paket bütün ve altta boşluklu; üst %20 sakin; yazı yok.

#### 181. 2.1 Ana portre

- İndirme adı: `36-victorian-glasshouse__photos__hero_portrait.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Flora and Edmund, in their early thirties (Flora: shoulder-length chestnut hair with soft waves, light olive skin, a slim gold ring; Edmund: short black curly hair, a neat short beard, deep brown skin; they must not resemble any real person or celebrity) inside a Victorian glasshouse full of ferns: she in a simple ivory silk gown, he in a deep green suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, soft daylight through the glass roof, slender cast-iron columns softly out of focus behind them. Photorealistic, fern-green, cream and copper palette, subtle grain. No text, no frame.
```

#### 182. 2.2 Story 1 — "Sheltering from the rain"

- İndirme adı: `36-victorian-glasshouse__photos__story_1.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #181)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing as they step in from the rain under the glass roof of an old glasshouse, raindrops on the panes above, his jacket held over both of them, tall ferns around, soft grey daylight. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 183. 2.3 Story 2 — "Our first cutting"

- İndirme adı: `36-victorian-glasshouse__photos__story_2.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #181)

```
Vertical 4:5: the same couple as hero_portrait.jpg at a weathered wooden potting bench, side by side, gently planting a small fern cutting in a terracotta pot together, their hands touching in the soil, smiling, kraft seed packets (blank, no lettering) and jute twine on the bench, soft daylight through glass. Photorealistic, same palette and grain. No text, no labels with writing.
```

#### 184. 2.4 Story 3 — "Yes, among the palms"

- İndirme adı: `36-victorian-glasshouse__photos__story_3.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #181)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, in front of tall palm leaves and ferns inside a glasshouse, a little condensation on a pane behind, soft warm daylight from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 185. 2.5 Mekân

- İndirme adı: `36-victorian-glasshouse__photos__venue.jpg`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: the interior of an elegant fictional Victorian glasshouse set for a wedding ceremony, a central aisle between rows of simple wooden chairs, tall palms, ferns and white orchids along the sides, slender white-painted cast-iron arches and a glass roof with soft late-afternoon light, a few strings of warm small lights. No people, no signs, no text. Photorealistic, same palette. Must not resemble a specific real conservatory.
```

#### 186. P1 — Ön yüz

- İndirme adı: `36-victorian-glasshouse__print__invitation_front_5x7.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: herbarium_paper.png (listede #164), ironwork.png (listede #171), ferns.png (listede #172)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the cream herbarium paper of herbarium_paper.png. Along the top edge a band of slender cast-iron glasshouse arches in deep fern green (as ironwork.png, small) with maidenhair fern fronds hanging from them, staying above 16% of the height; at the two bottom corners small sprays of ferns and one white orchid (as ferns.png, small), staying below 88% of the height and outside the middle 60% of the width. The rectangle from 17% to 89% of the height and from 9% to 91% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no leaf, no line, no shadow, no stain in it. No text, letters, numbers, Latin names, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %17–%89 × %9–%91 tamamen boş; yazı yok; süs yalnız üst bantta ve alt köşelerde.

#### 187. P2 — Arka yüz

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

#### 188. W2.1 Krem kâğıt (zarf, kartlar, bantlar, form)

- İndirme adı: `37-art-nouveau-lily__cream_paper.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of fine cream cotton paper (#F4ECDB), like the paper of an Art Nouveau print: a gentle natural tooth, very faint fibres, a soft warm tone, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin (üstüne koyu yazı her yerde okunur); krem; dikişsiz; leke/baskı yok.

#### 189. W2.2 Adaçayı zemin (sayfa zemini)

- İndirme adı: `37-art-nouveau-lily__sage_paper.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/sage_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of a deep sage-green poster paper (#55634E), like the background of an Art Nouveau lithograph: a soft mottled printed tone with a very faint lighter sage cloudiness, a fine paper grain, matte. Calm and even everywhere so cream text reads on it, no pattern, no flowers, no lines, no vignette, no gradient across the image. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz; koyu adaçayı, sakin; desen/çizgi yok; üstünde krem yazı okunur.

#### 190. W2.3 Leylak astar (zarfın içi + kapakların arka yüzü)

- İndirme adı: `37-art-nouveau-lily__lilac_lining.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lilac_lining.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of an envelope lining paper in soft lilac (#C8B6D6) printed with a delicate Art Nouveau pattern of small stylised lilies and slender curving stems in a slightly deeper lilac (#7D6A92) and a few fine gold-leaf lines (#B8964E), evenly spread, quiet and elegant, like a fine stationery liner. Flat, evenly lit, no shadow, no vignette, no fold. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz; leylak, sakin desen; altın çizgiler ince; yazı yok.

#### 191. W2.4 Açık zarfın arkası (astar görünür; kapaksız)

- İndirme adı: `37-art-nouveau-lily__env_back.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_back.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: cream_paper.png (listede #188), lilac_lining.png (listede #190)

```
The back half of an open portrait envelope seen straight from the front, on a fully transparent background, the envelope filling the image edge to edge (the image IS the envelope, 0.758:1): cream cotton paper (as cream_paper.png) with a slim cream border all round, and inside it the lilac lining (as lilac_lining.png) visible over the upper two thirds, softly shaded at the top as if inside an envelope. NO flaps at all (the flaps are separate images), no front panel, no card, no seal. Soft daylight from the top-left. No cast shadow outside the envelope. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: zarf tuvali dolduruyor (0,758:1); kapak, cep, kart yok; astar üst üçte ikide; gerçek alfa.

#### 192. W2.5 Zarfın cebi (kart buradan yükselir)

- İndirme adı: `37-art-nouveau-lily__env_pocket.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (listede #191)

```
Only the front pocket of the same envelope as env_back.png, on the same 1000×1320 canvas and in the same place, on a fully transparent background: the lower part of the envelope front in cream paper, from the bottom edge up to an elegant softly rising Art Nouveau top edge — a gentle double curve that rises to a soft point in the middle at about 55% of the image height and sits at about 61% at both sides — the top edge trimmed with a thin gold-leaf whiplash line. Everything above that edge is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper just under the top edge. No flaps, no card, no seal. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: aynı tuval, aynı yer (env_back ile üst üste tam oturur); üst kenar yumuşak çift kıvrım + ince altın; üstü şeffaf.

#### 193. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_left.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_left.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (listede #191), env_pocket.png (listede #192), cream_paper.png (listede #188)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_left (number 1 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 194. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_right.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_right.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (listede #191), env_pocket.png (listede #192), cream_paper.png (listede #188)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_right (number 2 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 195. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_centre.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_centre.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (listede #191), env_pocket.png (listede #192), cream_paper.png (listede #188)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_centre (number 3 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 196. W2.7 Vitray zambak madalyonu (kapakların buluştuğu yer)

- İndirme adı: `37-art-nouveau-lily__lily_medallion.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lily_medallion.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×800 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A small round stained-glass medallion, seen straight on, on a fully transparent background, filling about 92% of the square: a single white lily in leaded stained glass (white and pale cream petals, sage-green leaves, a soft lilac and pale gold glass background, thin dark lead lines), set in a slim gold Art Nouveau frame of flowing whiplash curves. The glass looks lit from behind, glowing gently. Centered, not cropped. No shadow, no background, no text, letters, numbers or symbols, no religious symbol. True transparent background PNG (real alpha channel).
```

Kontrol: tek yuvarlak madalyon; zambak + vitray kurşun çizgileri; altın kıvrım çerçeve; alfa.

#### 197. W2.8 Cepten yükselen kart (boş, kemerli foto penceresi)

- İndirme adı: `37-art-nouveau-lily__card_small.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1008×1400 px (18:25) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: cream_paper.png (listede #188)

```
A flat vertical invitation card of the same cream paper as cream_paper.png, exactly 0.72:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine flowing gold-leaf Art Nouveau border inset from the edge (whiplash curves meeting in small lily buds at the top corners), a very soft contact shade on the card itself. In its upper part an arched portrait window (a rounded arch on top, straight sides, flat bottom), 5:7 tall, 50% of the card's width across, horizontally centred, its top at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: kemer pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 198. W2.9 Vitray kemer çerçeve (bütün portre fotoğrafları)

- İndirme adı: `37-art-nouveau-lily__arch_window.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/arch_window.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1300 px (10:13) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A tall arched stained-glass window frame, seen straight on, on a fully transparent background, filling the image edge to edge: a band of leaded stained glass about 15% of the width wide running round a rounded arch with straight sides and a flat bottom — white lilies, sage-green leaves and curling stems in soft jewel-toned glass (cream, sage, lilac, pale gold) with thin dark lead lines, held in a slim gold Art Nouveau whiplash moulding on its outer edge. The opening in the middle is an arch (rounded top, straight sides, flat bottom) exactly 70% of the image width across and 5:7 tall (700 × 980 px), its left edge at 150 px and its top at 170 px, filled with flat pure green #00FF00 (no texture, no shading). Soft daylight from the top-left, the glass gently glowing. No text, letters, numbers or symbols, no saints, no religious symbol. True transparent background PNG (real alpha channel).
```

Kontrol: kemer pencere düz `#00FF00`, 5:7, ölçü/konum tarif gibi; vitray bant; yazı/dini simge yok; alfa.

#### 199. W2.10 Mozaik altın hâle (home kartının arkası)

- İndirme adı: `37-art-nouveau-lily__halo.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/halo.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1400×1400 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A large decorative circular halo in the manner of an Art Nouveau poster, on a fully transparent background, filling about 96% of the square: a wide ring of tiny gold and pale-gold mosaic tesserae with a few soft sage and lilac tesserae, framed by thin flowing gold whiplash lines and a delicate ring of small stylised lilies, the centre of the circle (about 55% of its width) left fully transparent. Gentle, warm, light, decorative — a pattern behind a portrait, not a religious nimbus. No figure, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: daire halka, ortası boş (şeffaf); mozaik altın; dini simge yok; alfa.

#### 200. W2.11 Zambak demeti (kenarlar, imzalar)

- İndirme adı: `37-art-nouveau-lily__lily_spray.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lily_spray.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 900×1400 px (9:14) · şeffaf zemin (gerçek alfa) · PNG

```
A tall spray of three white lilies with long sage-green leaves and a few buds on slender curving stems, in the style of an Art Nouveau poster (soft flat colour with fine dark outlines, gentle shading), rising from the bottom edge of the image and leaning slightly to the right, on a fully transparent background, filling the height of the image. Cream-white petals, pale gold stamens, sage leaves. No vase, no ground, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek demet, alttan yükselir; düz poster rengi + ince kontur; alfa.

#### 201. W2.12 Altın kıvrım çizgisi (başlık altı ayırıcı)

- İndirme adı: `37-art-nouveau-lily__whiplash.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/whiplash.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×300 px (16:3) · şeffaf zemin (gerçek alfa) · PNG

```
A single horizontal Art Nouveau divider in fine gold leaf (#B8964E with lighter highlights), on a fully transparent background: one long flowing "whiplash" line that curls from the left, swells gracefully to a small lily bud in the centre and curls out to the right, with a few thin secondary tendrils, symmetrical, centred, with a generous empty margin. Line only, no filled shapes other than the small bud. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek yatay çizgi, ortada küçük tomurcuk; altın; alfa.

#### 202. W2.13 Zambak yaprağı (süzülen parça)

- İndirme adı: `37-art-nouveau-lily__petal_drift.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_drift.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single loose white lily petal, slightly curved, cream-white with a faint lilac blush at its base and fine veins, lying at a gentle angle, alone, on a fully transparent background, filling about 60% of the square. Centered, not cropped. No shadow, no other petal, no text. True transparent background PNG (real alpha channel).
```

Kontrol: tek yaprak; alfa.

#### 203. W2.14 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `37-art-nouveau-lily__web_hero.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: env_back.png (listede #191), lily_medallion.png (listede #196), lily_spray.png (listede #200)

```
Wide horizontal still life, photorealistic with an Art Nouveau poster mood, soft daylight from the top-left: the closed cream envelope of env_back.png with its three petal flaps and the stained-glass lily medallion (as lily_medallion.png) standing slightly below the centre on a deep sage linen surface, a spray of white lilies (as lily_spray.png) lying at the left, a small gold whiplash ornament and a lilac silk ribbon at the right; a soft sage background above. The top 20% of the image is calm, empty background. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers or symbols, no logos.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 boş; yazı yok.

#### 204. 2.1 Ana portre

- İndirme adı: `37-art-nouveau-lily__photos__hero_portrait.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1000×1400 px (5:7) · opak · JPG

```
Vertical 5:7 wedding portrait of the fictional couple Odette and Felix, in their early thirties (Odette: dark-brown hair in a soft low chignon, light olive skin, a slim gold ring; Felix: short wavy light-brown hair, a neatly trimmed beard, fair skin; they must not resemble any real person or celebrity) in a garden in early summer: she in a simple cream silk gown holding a few white lilies, he in a sage-grey suit, standing close and smiling at each other, waist-up, faces in the upper-middle of the frame, a softly blurred old villa with tall arched windows and greenery behind them. Photorealistic, soft sage, cream and gold palette, subtle grain. No text, no frame.
```

#### 205. 2.2 Story 1 — "A rainy afternoon in a museum"

- İndirme adı: `37-art-nouveau-lily__photos__story_1.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1000×1400 px (5:7) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #204)

```
Vertical 5:7 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) in a quiet museum gallery on a rainy afternoon, standing side by side in front of a large softly blurred stained-glass window, she laughing and turning towards him, he holding a folded umbrella, raincoats damp, warm light. No readable signs, no artwork recognisable as a real painting, no text. Photorealistic, same palette and grain.
```

#### 206. 2.3 Story 2 — "A summer of letters"

- İndirme adı: `37-art-nouveau-lily__photos__story_2.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1000×1400 px (5:7) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #204)

```
Vertical 5:7: the same couple as hero_portrait.jpg on a sunny balcony with wrought-iron railings, she sitting on a café chair reading a handwritten letter with a smile (the writing is not readable), he leaning on the railing beside her, a few envelopes and a cup of coffee on a small table, soft summer light, green plants. No readable text. Photorealistic, same palette and grain.
```

#### 207. 2.4 Story 3 — "Among the lilies"

- İndirme adı: `37-art-nouveau-lily__photos__story_3.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1000×1400 px (5:7) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #204)

```
Vertical 5:7 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones) among white lilies in a garden bed, her hand with a slim gold engagement ring resting in his, soft late-afternoon light from the top-left, shallow depth of field, sage leaves around. Photorealistic, same palette and grain. No text.
```

#### 208. 2.5 Mekân

- İndirme adı: `37-art-nouveau-lily__photos__venue.jpg`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant garden of an early-1900s villa (fictional) with curved wrought-iron balconies and tall arched windows, a lawn with a few rows of simple white chairs set for a ceremony facing a small arbour of white lilies and greenery, beds of white lilies and lilac flowers, soft early-summer afternoon light. No people, no signs, no text. Photorealistic, same palette. Not a real, recognisable building.
```

#### 209. P1 — Ön yüz

- İndirme adı: `37-art-nouveau-lily__print__invitation_front_5x7.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: cream_paper.png (listede #188), lily_medallion.png (listede #196)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat, in the style of an Art Nouveau poster: the whole sheet is the cream paper of cream_paper.png. Along the top edge an arched band about 13% of the height: a small stained-glass lily medallion (as lily_medallion.png) in the centre with flowing gold whiplash lines spreading from it to both sides over a soft sage ground, staying above 15% of the height. Along the bottom edge a matching low band about 10% of the height of sage-green leaves, two small white lilies and a slim gold whiplash line (staying below 87%). Thin gold whiplash lines may run down the outer 6% of each side. The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no line, no flower, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı yok; süs yalnız üst/alt bantlarda ve kenarlarda.

#### 210. P2 — Arka yüz

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

#### 211. W1 Kraft kâğıt (zarf, program kartı)

- İndirme adı: `38-papel-picado-fiesta__kraft_paper.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/kraft_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, perfectly flat top-down texture of natural brown kraft paper (#B78A5B), like a sturdy recycled kraft envelope: fine visible wood fibres and tiny darker flecks, a soft matte tooth, an even warm tone with only the gentlest natural variation. Evenly lit from the top-left, no fold, no crease, no stain, no shadow, no vignette, no printing, no pattern. Calm enough for dark brown text to read on it. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```

Kontrol: dikişsiz (2×2 yan yana ek yeri yok); kraft kahve `#B78A5B` civarı; leke/kat yok; üstüne koyu yazı okunur.

#### 212. W2 Kireç badanalı duvar (sayfa zemini)

- İndirme adı: `38-papel-picado-fiesta__limewash_wall.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/limewash_wall.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of a sunlit limewashed courtyard wall in a very pale warm cream (#F5E9D8): soft cloudy limewash brush movement, a fine sandy plaster grain, the faintest warm blush in places, very low contrast so text in any colour reads on it everywhere. Flat, evenly lit, no cracks, no stains, no shadow, no vignette, no objects, no tiles. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: çok açık, sakin (her yerde yazı okunur); dikişsiz; çatlak/leke yok.

#### 213. W3 Krem kart kâğıdı (kartlar, bantlar, form)

- İndirme adı: `38-papel-picado-fiesta__cream_paper.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/cream_paper.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat top-down texture of thick handmade cotton card stock in a warm cream (#FBF4E8): a soft felt tooth, a few faint cotton fibres, an even warm tone, calm enough for dark text everywhere. Evenly lit from the top-left, no deckle edge, no shadow, no vignette, no fold, no stain, no printing, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: sakin krem; dikişsiz; leke/baskı yok.

#### 214. W4 Terrakota (home "The Day" bandı)

- İndirme adı: `38-papel-picado-fiesta__terracotta.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/terracotta.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1536 px (1:1) · opak · PNG

```
A seamless, tileable, flat texture of a sun-warmed terracotta-painted plaster wall (#B0502F): a smooth hand-troweled finish with soft tonal clouds between a slightly deeper and a slightly lighter terracotta, a fine sandy grain, matte. Even, calm and dark enough for cream text to read on it everywhere. No cracks, no tiles, no stains, no shadow, no vignette, no objects. Edges tile without a seam. No text, letters, numbers or symbols.
```

Kontrol: terrakota `#B0502F` civarı; krem yazı her yerde okunur; dikişsiz.

#### 215. W5 Zarfın cebi (arkadan, kapaksız)

- İndirme adı: `38-papel-picado-fiesta__envelope_pocket.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1110×1500 px (0.740:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: kraft_paper.png (listede #211)

```
The back of a portrait kraft paper envelope seen perfectly straight on, on a fully transparent background, the envelope filling the image edge to edge (the image IS the envelope, 0.74:1): the same kraft paper as kraft_paper.png, the two side flaps and the bottom flap folded in and glued, their soft fold lines and slightly lifted paper edges visible, the top edge straight and open (this is where the card comes out — no flap is drawn, no V shape at the top). Warm sun from the top-left, a soft natural shade along the folds. No seal, no sticker, no stamp, no string, no card inside, no cast shadow outside the envelope. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: zarf tuvali dolduruyor (0,74:1); üstte düz açık kenar, V kapak **yok**; mühür/ip yok; gerçek alfa.

#### 216. W6 Düz kapak (dış yüz)

- İndirme adı: `38-papel-picado-fiesta__envelope_flap.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1110×450 px (2.467:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_pocket.png (listede #215)

```
The closed straight flap of the same kraft envelope as envelope_pocket.png, alone, seen straight on, on a fully transparent background, filling the image edge to edge: a wide rectangle of the same kraft paper, exactly as wide as the envelope, with softly rounded bottom corners and a straight bottom edge (NOT a V, NOT a point), the top edge a crisp fold line, a very soft shade along the bottom edge where it lies on the envelope. Warm sun from the top-left. No seal, no sticker, no string. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen düz kapak, alt kenar düz (V/sivri değil); zarfla aynı kraft; alfa.

#### 217. W7 Kapak astarı (işlemeli kumaş)

- İndirme adı: `38-papel-picado-fiesta__flap_liner.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flap_liner.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1110×450 px (2.467:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_flap.png (listede #216)

```
The inside of the same straight envelope flap, alone, seen straight on as it stands up when the flap is open, on a fully transparent background, filling the image edge to edge, the same outline as envelope_flap.png but mirrored vertically: its BOTTOM edge is the straight fold line and its rounded corners are at the TOP. It is lined with a cream cotton fabric densely hand-embroidered with bright folk flowers, leaves and small birds in fuchsia, marigold, turquoise, lime, violet and coral satin stitch (a joyful, generic folk-floral embroidery — not a copy of any specific community's traditional design), a slim band of kraft paper showing at the edges. Warm sun from the top-left. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: alt kenar düz katlama çizgisi, yuvarlak köşeler üstte; işlemeli çiçekli kumaş astar; alfa.

#### 218. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_1.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_1 (number 1 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 219. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_2.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_2 (number 2 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 220. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_3.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_3 (number 3 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 221. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_4.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_4.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_4 (number 4 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 222. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_5.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_5.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_5 (number 5 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 223. W8 Papel picado bayrakları — altı ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__flag_6.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_6.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 800×1000 px (4:5) · şeffaf zemin (gerçek alfa) · PNG

```
This prompt describes a set of 6 separate images (flag_1, flag_2, flag_3, flag_4, flag_5, flag_6). Make ONLY ONE image now: flag_6 (number 6 of 6).

A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```

Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.

#### 224. W9 Ampul (ampul dizisi; tek sprite)

- İndirme adı: `38-papel-picado-fiesta__bulb.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bulb.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 400×640 px (5:8) · şeffaf zemin (gerçek alfa) · PNG

```
A single lit festoon string-light bulb hanging straight down, alone, seen from the front, on a fully transparent background: a small black rubber socket at the top with a short stub of black cord going up to the top edge, below it a round clear glass globe bulb with a glowing warm filament (#FFC861), the glass catching a little sun from the top-left, and a soft warm glow halo around the globe that fades to full transparency well inside the image edges. Centered, not cropped. No other bulbs, no wire running sideways. No text. True transparent background PNG (real alpha channel; the glow is semi-transparent, not a solid disc).
```

Kontrol: tek ampul, üstte duy + kısa kablo; hâle yarı saydam ve kenara değmiyor; alfa.

#### 225. W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__frame_1.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1200 px (5:6) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
This prompt describes a set of 3 separate images (frame_1, frame_2, frame_3). Make ONLY ONE image now: frame_1 (number 1 of 3).

A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```

Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.

#### 226. W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__frame_2.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1200 px (5:6) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
This prompt describes a set of 3 separate images (frame_1, frame_2, frame_3). Make ONLY ONE image now: frame_2 (number 2 of 3).

A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```

Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.

#### 227. W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__frame_3.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_3.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1200 px (5:6) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
This prompt describes a set of 3 separate images (frame_1, frame_2, frame_3). Make ONLY ONE image now: frame_3 (number 3 of 3).

A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```

Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.

#### 228. W11 Geniş kâğıt kesim çerçeve (mekân fotoğrafı)

- İndirme adı: `38-papel-picado-fiesta__frame_wide.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_wide.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1000 px (8:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A wide papel picado photo frame in coral tissue paper (#E85637), alone, seen straight on, on a fully transparent background, filling the image edge to edge: an intricate symmetrical cut-paper border of flowers, leaves, vines and scallops (the cut-outs truly transparent), the top edge folded over natural twine with two small hanging loops. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges). Warm sun from the top-left. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel).
```

Kontrol: pencere düz `#00FF00`, 1360×765 (16:9), sol üst (120, 150); kesik yerler şeffaf; alfa.

#### 229. W12 Bugenvil salkımı (köşe süsü)

- İndirme adı: `38-papel-picado-fiesta__bougainvillea.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bougainvillea.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1000 px (6:5) · şeffaf zemin (gerçek alfa) · PNG

```
A lush cluster of magenta-fuchsia bougainvillea spilling diagonally from the top-left corner toward the centre, alone, on a fully transparent background: woody stems, fresh green leaves, many papery bracts in vivid fuchsia with tiny cream flowers at their hearts, a few single bracts drifting loose near the tips, photorealistic in warm top-left sun. The cluster touches the top and left edges and leaves the bottom-right third empty. No pot, no wall, no shadow, no other flower. No text. True transparent background PNG (real alpha channel).
```

Kontrol: salkım sol üst köşeden taşar; sağ alt üçte bir boş; saksı/duvar yok; alfa.

#### 230. W13 İşlemeli kumaş bandı (bölüm ayırıcı)

- İndirme adı: `38-papel-picado-fiesta__embroidery_band.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/embroidery_band.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 2400×160 px (15:1) · opak · PNG

```
A long horizontal strip of cream cotton fabric (#FBF4E8) hand-embroidered along its whole length with a continuous row of small bright folk flowers and leaves in fuchsia, marigold, turquoise, lime, violet and coral satin stitch, between two slim stitched lines, seen perfectly flat and straight on, filling the image edge to edge. The left and right edges must tile seamlessly when repeated side by side. Even warm light. A joyful generic folk-floral embroidery, not a copy of any specific community's traditional design. No text, letters, numbers or symbols.
```

Kontrol: yatayda dikişsiz; tek sıra çiçek; krem zemin; yazı yok.

#### 231. W14 Website hero + paylaşım görseli (og:image kaynağı)

- İndirme adı: `38-papel-picado-fiesta__web_hero.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/web_hero.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: envelope_pocket.png (listede #215), limewash_wall.png (listede #212), bougainvillea.png (listede #229), cream_paper.png (listede #213), bulb.png (listede #224)

```
Wide horizontal still life, photorealistic, warm late afternoon sun from the top-left: the portrait kraft envelope of envelope_pocket.png with its straight flap closed and a belly band of six papel picado flags (as flag_1–6.png) wrapped across it, lying slightly below the centre on a sunlit limewash courtyard table (as limewash_wall.png), a sprig of fuchsia bougainvillea (as bougainvillea.png) at the left, a cream card (as cream_paper.png, blank) and a small terracotta dish at the right; above, out of focus, a garland of papel picado flags and a string of glowing bulbs (as bulb.png) across a warm wall. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers or symbols, no logos.
```

Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı yok.

#### 232. 2.1 Ana portre

- İndirme adı: `38-papel-picado-fiesta__photos__hero_portrait.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Valeria and Diego, in their early thirties (Valeria: long dark-brown wavy hair half up with a small fuchsia flower, warm olive-tan skin, a slim gold ring; Diego: short black hair, a neat short beard, medium-brown skin; they must not resemble any real person or celebrity) in a sunlit courtyard: she in a simple ivory gown with fine lace sleeves, he in a light sand-coloured suit with a fuchsia boutonnière, standing close and laughing, waist-up, faces in the upper middle of the frame; behind them, softly out of focus, a limewash wall with fuchsia bougainvillea and a garland of colourful papel picado flags. Photorealistic, warm sunny palette, subtle grain. No text, no frame.
```

#### 233. 2.2 Story 1 — "Our first dance"

- İndirme adı: `38-papel-picado-fiesta__photos__story_1.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #232)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) dancing and laughing at an open-air summer evening market, she mid-twirl with her skirt flaring, he holding her hand, warm string lights and blurred colourful paper flags overhead, other people only as soft out-of-focus shapes. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 234. 2.3 Story 2 — "Sunset on the river"

- İndirme adı: `38-papel-picado-fiesta__photos__story_2.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #232)

```
Vertical 4:5: the same couple as hero_portrait.jpg walking hand in hand along a quiet stone riverside path at golden hour, seen slightly from behind and to the side, her head turned toward him, cypress trees and a small arched stone footbridge softly in the background, warm light on the water. A generic place, not a recognisable landmark. Photorealistic, same palette and grain. No text.
```

#### 235. 2.4 Story 3 — "Under the lights"

- İndirme adı: `38-papel-picado-fiesta__photos__story_3.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #232)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, against a softly blurred background of glowing string-light bulbs and colourful papel picado flags at dusk, a few warm bokeh circles, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 236. 2.5 Mekân

- İndirme adı: `38-papel-picado-fiesta__photos__venue.jpg`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: a sunlit Spanish-colonial-style courtyard prepared for a wedding — limewash walls draped with fuchsia bougainvillea, terracotta floor tiles, a small stone fountain, rows of simple wooden chairs with a central aisle, and overhead criss-crossing garlands of colourful papel picado flags and festoon string lights. No people, no signs, no text, no religious objects. Photorealistic, warm late afternoon light, same palette.
```

#### 237. P1 — Ön yüz

- İndirme adı: `38-papel-picado-fiesta__print__invitation_front_5x7.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/print/invitation_front_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG
- Ek görsel: cream_paper.png (listede #213), bougainvillea.png (listede #229), embroidery_band.png (listede #230)

```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm cream card stock of cream_paper.png. Across the top, a garland of six small papel picado flags (as flag_1–6.png, fuchsia, marigold, turquoise, lime, violet, coral) hanging from a natural twine that sags gently from the top corners, the flags' lowest points staying above 17% of the height; a small sprig of fuchsia bougainvillea (as bougainvillea.png) tucked at the top-left corner. Along the bottom edge a slim band of the embroidered folk-flower ribbon of embroidery_band.png, about 5% of the height, staying below 92%. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flag, no petal, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; yazı yok; süs dizisi yalnız üstte, nakış bandı yalnız altta.

#### 238. P2 — Arka yüz

- İndirme adı: `38-papel-picado-fiesta__print__invitation_back_5x7.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/print/invitation_back_5x7.png`
- Bölüm: PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) (baskı parçası (PAKET 6 / G139))
- Şart: 1575×2175 px (21:29) · opak · PNG

```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream card stock, only a short garland of four small papel picado flags (as flag_1–6.png) hanging from a twine across the top centre, their lowest points staying above 11% of the height. Everything below 13% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flag, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```

Kontrol: ön yüzle aynı kâğıt; yalnız üstte kısa süs dizisi (%11'in üstünde); %13'ün altı boş; yazı yok.

### 22_Nocturne_Lake_Estate

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Nocturne Lake Estate") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/nocturne-lake-estate/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/nocturne-lake-estate/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 239. 2.1 Ana portre — isteğe bağlı

- İndirme adı: `22-nocturne-lake-estate__photos__hero_portrait.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties on a Lake Como villa terrace at blue hour: groom in a tailored black tuxedo, bride in a minimal ivory silk gown, close and smiling, three-quarter length, faces in the upper third. Distant lake lights, cypresses, warm candlelight. Black, olive and champagne palette, subtle film grain. No text, no frame.
```

#### 240. 2.2 Galeri 1 — "A quiet moment, just us" — isteğe bağlı

- İndirme adı: `22-nocturne-lake-estate__photos__story_1.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5, a quiet candid moment on the villa's stone steps at dusk, foreheads touching, candle lanterns along the steps, lake in soft focus behind. Photorealistic, same palette and grain. No text.
```

#### 241. 2.3 Galeri 2 — "Where the mountains meet the water" — isteğe bağlı

- İndirme adı: `22-nocturne-lake-estate__photos__story_2.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1152 px (4:3) · opak · JPG

```
Landscape 4:3: the same couple small in the frame on a wooden lake jetty at dusk, the mountains and the water's lights wide around them. Photorealistic, same palette and grain. No text.
```

#### 242. 2.4 Galeri 3 — "An evening we will always remember" — isteğe bağlı

- İndirme adı: `22-nocturne-lake-estate__photos__story_3.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1152 px (4:3) · opak · JPG

```
Landscape 4:3: a long candlelit dinner table on the lake terrace at night, ivory roses and champagne glasses, guests as soft silhouettes, the couple laughing at the head of the table. Photorealistic, same palette and grain. No text.
```

#### 243. 2.5 Mekân — isteğe bağlı

- İndirme adı: `22-nocturne-lake-estate__photos__venue.jpg`
- Hedef: `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant lakeside villa with a stone balustrade terrace and cypress trees, seen from the water at dusk, warm windows and candle lights, mountains behind. No people, no signs, no text. Photorealistic, same palette.
```

### 23_Velvet_Jewel_Box

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Velvet Jewel Box") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/velvet-jewel-box/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/velvet-jewel-box/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 244. 2.1 Ana portre — isteğe bağlı

- İndirme adı: `23-velvet-jewel-box__photos__hero_portrait.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes. An elegant New York townhouse salon with aubergine velvet curtains and warm candlelight: Julian in a midnight-blue tuxedo, Isabelle in an ivory satin gown with a single strand of pearls, standing close and smiling, three-quarter length, both faces in the upper third and centered (the photo is also shown small, cropped to the faces). Aubergine, champagne and ivory palette, subtle film grain. No text, no logos, no frame.
```

#### 245. 2.2 Story 1 — "Our first dinner" — isteğe bağlı

- İndirme adı: `23-velvet-jewel-box__photos__story_1.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic candid photo, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes — the same two people as in the portrait. A small candlelit restaurant table for two, laughing over a shared dessert, a rain-streaked window behind them with soft out-of-focus city lights. Smart evening clothes (no wedding attire). Aubergine, champagne and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 246. 2.3 Story 2 — "A little velvet box" — isteğe bağlı

- İndirme adı: `23-velvet-jewel-box__photos__story_2.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic photo, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes — the same two people as in the portrait. The moment of the proposal in a quiet park under a black umbrella at dusk: Julian holds an open aubergine velvet ring box, Isabelle covers her mouth in happy surprise; the ring is a small glint, not the focus; both faces visible. Aubergine, champagne and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 247. 2.4 Story 3 — "Yours, forever" — isteğe bağlı

- İndirme adı: `23-velvet-jewel-box__photos__story_3.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic close-up, vertical 4:5: the hands of the same fictional couple, Isabelle and Julian (her warm olive skin, his fair skin), intertwined on champagne satin, her engagement ring and a strand of ivory pearls, soft window light. Only hands, no faces. Not resembling any real or famous person. Aubergine, champagne and ivory palette, subtle film grain. No text, no engraving, no logos.
```

#### 248. 2.5 Mekân — isteğe bağlı

- İndirme adı: `23-velvet-jewel-box__photos__venue.jpg`
- Hedef: `collections/23_Velvet_Jewel_Box/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Photorealistic landscape 16:9: a grand fictional New York townhouse ballroom prepared for a wedding dinner: aubergine velvet chairs, champagne satin table linens, tall candles and ivory flowers, crystal chandeliers, warm evening light. No people, no signs, no text, no logos, no recognisable real venue. Aubergine, champagne and ivory palette, subtle film grain.
```

### 24_Grand_Theatre_Premiere

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Grand Theatre Premiere") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/grand-theatre-premiere/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/grand-theatre-premiere/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 249. 2.1 Ana portre — isteğe bağlı

- İndirme adı: `24-grand-theatre-premiere__photos__hero_portrait.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), standing on the empty stage of an ornate gilded theatre in front of drawn-back peacock-teal velvet curtains: the groom in a classic black tuxedo, the bride in an ivory satin gown with a long veil, close together and smiling, three-quarter length, faces in the upper third, lit by a warm spotlight from above-left. Warm footlights, soft haze in the air. Peacock, antique gold and ivory palette, subtle film grain. They must not resemble any real or famous person. No text, no frame.
```

#### 250. 2.2 Story 1 — "Opening night" — isteğe bağlı

- İndirme adı: `24-grand-theatre-premiere__photos__story_1.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #249)

```
The same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in smart evening clothes, vertical 4:5, a candid moment in peacock-teal velvet theatre seats with gilded armrests in the stalls, side by side and laughing during an evening performance, the stage light falling on their faces, the dark auditorium behind softly out of focus. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 251. 2.3 Story 2 — "The proposal at intermission" — isteğe bağlı

- İndirme adı: `24-grand-theatre-premiere__photos__story_2.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #249)

```
Vertical 4:5: the same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in evening clothes, in a mirrored, candlelit theatre foyer at intermission, he on one knee holding up a ring box, she with her hands to her face in happy surprise, champagne glasses on a marble ledge, gilded mirrors and warm sconces softly blurred. Photorealistic, same palette and grain. Not resembling any real person. No text, no signs.
```

#### 252. 2.4 Story 3 — "Our curtain call" — isteğe bağlı

- İndirme adı: `24-grand-theatre-premiere__photos__story_3.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #249)

```
Vertical 4:5: the same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in their wedding clothes (black tuxedo, ivory satin gown), taking a playful bow together at the front of the stage, hand in hand, ivory rose petals in the air, the peacock velvet curtain gathered behind them and warm footlights glowing. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 253. 2.5 Mekân — isteğe bağlı

- İndirme adı: `24-grand-theatre-premiere__photos__venue.jpg`
- Hedef: `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1024 px (3:2) · opak · JPG

```
Landscape 3:2: the interior of an imaginary grand theatre seen from the back of the stalls, rows of velvet seats, two tiers of gilded balconies, a crystal chandelier, the antique-gold proscenium with peacock velvet curtains open, warm evening light, set for a wedding with ivory flowers along the stage edge. No people, no signs, no text, not a copy of any real theatre. Photorealistic, same palette.
```

### 25_Orient_Express_Voyage

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Orient Express Voyage") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/orient-express-voyage/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/orient-express-voyage/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 254. 2.1 Ana portre (bilet penceresi + davet yanında) — isteğe bağlı

- İndirme adı: `25-orient-express-voyage__photos__hero_portrait.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin, standing at the open door of an elegant vintage sleeper carriage on a quiet station platform at golden hour: groom in a dark bottle-green velvet suit, bride in an ivory silk gown with a short veil, close and smiling, three-quarter length, faces in the upper third. Brass handrails, warm lamp light, soft steam in the background. Bottle green, brass and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 255. 2.2 Pencere 1 — "Where our journey began" — isteğe bağlı

- İndirme adı: `25-orient-express-voyage__photos__story_1.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1365 px (0.750:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #254)

```
The same fictional couple as hero_portrait.jpg (a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin), in smart travel clothes, vertical 3:4, sitting opposite each other in a vintage dining car by the window, laughing over two cups of coffee, warm table lamp, countryside blurred outside. Photorealistic, same palette and grain. No text, no logos.
```

#### 256. 2.3 Pencere 2 — "A yes between two stations" — isteğe bağlı

- İndirme adı: `25-orient-express-voyage__photos__story_2.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1365 px (0.750:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #254)

```
The same fictional couple as hero_portrait.jpg (a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin), in autumn coats, vertical 3:4, a proposal moment on a quiet country station platform at dusk, he on one knee, she with hands over her mouth, a vintage carriage and warm lamps behind them. Photorealistic, same palette and grain. No text, no signs.
```

#### 257. 2.4 Pencere 3 — "Next stop: forever" — isteğe bağlı

- İndirme adı: `25-orient-express-voyage__photos__story_3.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1365 px (0.750:1) · opak · JPG

```
Vertical 3:4 close-up of the same fictional couple's hands (her warm olive skin, his light-brown skin; no faces): her hand with a simple engagement ring resting on a vintage leather travel case, his hand gently over hers, beside two first-class tickets with blank faces (no printing), soft window light. Photorealistic, same palette and grain. No text, no numbers.
```

#### 258. 2.5 Mekân — isteğe bağlı

- İndirme adı: `25-orient-express-voyage__photos__venue.jpg`
- Hedef: `collections/25_Orient_Express_Voyage/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1024 px (3:2) · opak · JPG

```
Landscape 3:2: a fictional grand historic station hall turned wedding venue at dusk, iron and glass atrium roof, long tables with ivory flowers and brass candle holders, a vintage bottle-green carriage parked along the platform, warm lights. No people, no signs, no text, no clock numerals. Photorealistic, same palette.
```

### 26_Kintsugi_Washi

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Kintsugi & Washi") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/kintsugi-washi/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/kintsugi-washi/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 259. 2.1 Ana portre — isteğe bağlı

- İndirme adı: `26-kintsugi-washi__photos__hero_portrait.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Naomi and Kai, in their early thirties (Naomi: shoulder-length wavy dark-brown hair, warm light-brown skin, a slim gold ring; Kai: short black hair, a neat short beard, light skin; they must not resemble any real person or celebrity) in an autumn garden: she in a simple ivory silk gown, he in a deep indigo suit, standing close under a red-gold maple, smiling at each other, three-quarter length, faces in the upper third, soft afternoon light from the left, a still pond and a cedar pavilion softly out of focus behind. Photorealistic, calm indigo, ivory and gold palette, subtle grain. No text, no frame.
```

#### 260. 2.2 Story 1 — "A borrowed umbrella" — isteğe bağlı

- İndirme adı: `26-kintsugi-washi__photos__story_1.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #259)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin), laughing under one shared dark umbrella on a quiet rainy street at dusk, warm shop lights blurred behind, wet stones reflecting the light, her hand on his arm. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 261. 2.3 Story 2 — "Tea by the river" — isteğe bağlı

- İndirme adı: `26-kintsugi-washi__photos__story_2.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1024 px (5:4) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #259)

```
Landscape 5:4: the same couple as hero_portrait.jpg sitting side by side on a wooden deck by a wide river in the early morning, two simple handmade ceramic cups between them, mist over the water and forested hills, seen from slightly behind and to the side. Photorealistic, same palette and grain. No text.
```

#### 262. 2.4 Story 3 — "The promise" — isteğe bağlı

- İndirme adı: `26-kintsugi-washi__photos__story_3.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #259)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, beside a small ceramic tea bowl mended with gold kintsugi seams, on indigo linen, soft window light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 263. 2.5 Mekân — isteğe bağlı

- İndirme adı: `26-kintsugi-washi__photos__venue.jpg`
- Hedef: `collections/26_Kintsugi_Washi/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant open garden pavilion of warm cedar wood beside a still pond in autumn, red and gold maples, a gravel path and a few rows of simple white chairs set for a ceremony, soft late-afternoon light, forested hills behind. No people, no signs, no text. Photorealistic, same palette.
```

### 27_Riad_Lantern_Nights

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Riad Lantern Nights") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/riad-lantern-nights/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/riad-lantern-nights/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 264. 2.1 Portre (davet kartı ve home) — isteğe bağlı

- İndirme adı: `27-riad-lantern-nights__photos__hero_portrait.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
A warm, natural portrait photograph of a fictional couple in their early thirties (they must not resemble any real person): she has shoulder-length dark wavy hair and wears a simple ivory silk evening dress, he has short light-brown hair and wears a navy suit with an open collar. They stand close, smiling softly, framed from the waist up, in a riad courtyard at blue hour, lit by warm pierced brass lanterns; teal tiled walls and a little magenta bougainvillea softly out of focus behind them. Faces in the upper middle of the frame. Photorealistic, natural skin, no heavy retouching. No text, no logo, no watermark.
```

#### 265. 2.2 Story 1 — "Our first evening" (uzun pencere) — isteğe bağlı

- İndirme adı: `27-riad-lantern-nights__photos__story_1.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1536 px (2:3) · opak · JPG

```
The same fictional couple (same faces, hair and clothes) sharing mint tea at a small mosaic table on a lantern-lit riad terrace in the evening, laughing, seen from a little distance; warm saffron lantern light, teal shadows. Vertical photo, the couple in the middle third. Photorealistic. No text, no watermark.
```

#### 266. 2.3 Story 2 — "Among the lanterns" — isteğe bağlı

- İndirme adı: `27-riad-lantern-nights__photos__story_2.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1536 px (2:3) · opak · JPG

```
The same fictional couple walking hand in hand under many hanging pierced brass lanterns in a quiet covered passage at night, warm light patterns falling on the walls, seen from behind at a three-quarter angle so their faces are only partly visible. Vertical photo. Photorealistic. No shop signs, no text, no watermark.
```

#### 267. 2.4 Story 3 — "Yes, under the stars" — isteğe bağlı

- İndirme adı: `27-riad-lantern-nights__photos__story_3.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1536 px (2:3) · opak · JPG

```
A close photograph of the same fictional couple's joined hands with a simple gold engagement ring, resting on a teal and ivory zellige tabletop beside a small lit brass lantern and a few magenta bougainvillea bracts, night, shallow depth of field. Vertical photo. Photorealistic. No text, no watermark.
```

#### 268. 2.5 Mekân — "The Saffron Courtyard Riad" (kurgu) — isteğe bağlı

- İndirme adı: `27-riad-lantern-nights__photos__venue.jpg`
- Hedef: `collections/27_Riad_Lantern_Nights/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
A wide photograph of a fictional riad courtyard set for an evening wedding: a central tiled fountain, an orange tree, low cedar tables with ivory linen and candles, carved stucco arcades, teal and saffron zellige, many lit brass lanterns hanging overhead and bougainvillea on the columns, at blue hour. It must not reproduce any real, identifiable hotel or riad. No people, no text, no signs, no watermark.
```

### 28_Maison_Patisserie

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Maison Pâtisserie") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/maison-patisserie/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/maison-patisserie/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 269. 2.1 Ana portre — isteğe bağlı

- İndirme adı: `28-maison-patisserie__photos__hero_portrait.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties in a sunlit orangery with tall arched glass windows and potted citrus trees: the bride in a soft ivory tulle gown, the groom in a light sage-grey suit with a blush pocket square, close together and smiling, three-quarter length, faces in the upper third of the frame. Pastel pistachio, rose and cream palette, soft daylight, gentle film grain. They must not resemble any real or famous person. No text, no frame, no watermark.
```

#### 270. 2.2 Raf 1 — "Coffee and croissants for two" — isteğe bağlı

- İndirme adı: `28-maison-patisserie__photos__story_1.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5, in casual clothes at a small marble table inside a Parisian-style pâtisserie, sharing coffee and croissants, laughing, a glass display case of pastel pastries softly out of focus behind them. Photorealistic, same palette and grain. No readable signs, no text, no logos.
```

#### 271. 2.3 Raf 2 — "A question over macarons" — isteğe bağlı

- İndirme adı: `28-maison-patisserie__photos__story_2.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5: the moment of the proposal at a café terrace table, a small open pâtisserie box of pastel macarons between them, his hand offering a ring box, her hands over her mouth in surprise. Photorealistic, same palette and grain. No text, no logos.
```

#### 272. 2.4 Raf 3 — "Forever, with a ring" — isteğe bağlı

- İndirme adı: `28-maison-patisserie__photos__story_3.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Close-up, vertical 4:5: the couple's joined hands with a delicate engagement ring, resting beside a pistachio-and-rose macaron and a satin ribbon on a cream linen tablecloth. Photorealistic, same palette and grain. No text.
```

#### 273. 2.5 Mekân — isteğe bağlı

- İndirme adı: `28-maison-patisserie__photos__venue.jpg`
- Hedef: `collections/28_Maison_Patisserie/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1024 px (3:2) · opak · JPG

```
Landscape 3:2: an elegant white Victorian orangery with tall arched glass windows on a green lawn by the sea, a rose garden in front, set for a wedding with cream chairs and pastel flowers, soft late-afternoon light. Fictional place — no recognisable real building, no people, no signs, no text. Photorealistic, same palette.
```

### 29_Celestial_Observatory

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Celestial Observatory") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/celestial-observatory/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/celestial-observatory/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 274. 2.1 Ana portre — isteğe bağlı

- İndirme adı: `29-celestial-observatory__photos__hero_portrait.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG

```
Square 1:1 wedding portrait of the fictional couple Celeste and Rowan, in their early thirties (Celeste: long loose auburn waves, fair skin with light freckles, a slim gold ring; Rowan: short dark-blond hair, a light stubble, olive skin; they must not resemble any real person or celebrity) at blue hour on a high desert ridge: she in a simple silver-ivory satin gown, he in a midnight-blue suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, the first stars appearing in a deep blue sky behind them and a small white observatory dome softly out of focus far away. Photorealistic, calm midnight, silver and gold palette, subtle grain. No text, no frame.
```

#### 275. 2.2 Story 1 — "A shared telescope" — isteğe bağlı

- İndirme adı: `29-celestial-observatory__photos__story_1.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #274)

```
Square 1:1 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) at night beside a small brass telescope on a tripod on a wooden deck, she looking through the eyepiece and laughing, he leaning in beside her pointing at the sky, a soft warm lantern light on their faces, a starry sky above. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 276. 2.3 Story 2 — "Night by the lake" — isteğe bağlı

- İndirme adı: `29-celestial-observatory__photos__story_2.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #274)

```
Square 1:1: the same couple as hero_portrait.jpg sitting close together on a wool blanket at the edge of a still mountain lake at night, seen from slightly behind and to the side, her head on his shoulder, the Milky Way softly reflected in the water, pine silhouettes. Photorealistic, same palette and grain. No text.
```

#### 277. 2.4 Story 3 — "Under the dome" — isteğe bağlı

- İndirme adı: `29-celestial-observatory__photos__story_3.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1280 px (1:1) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #274)

```
Square 1:1 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on the brass rail of an old observatory telescope inside a wooden dome, a sliver of night sky through the open slit behind, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 278. 2.5 Mekân — isteğe bağlı

- İndirme adı: `29-celestial-observatory__photos__venue.jpg`
- Hedef: `collections/29_Celestial_Observatory/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant garden on a pine-covered ridge at dusk with a small white historic observatory dome at one side, a lawn with a few rows of simple white chairs set for a ceremony facing a wide view of distant mountains, strings of warm small lights, the first stars in a deep blue sky. No people, no signs, no text. Photorealistic, same palette.
```

### 30_Azulejo_Mosaic

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Azulejo Mosaic") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/azulejo-mosaic/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/azulejo-mosaic/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 279. 2.1 Ana portre — isteğe bağlı

- İndirme adı: `30-azulejo-mosaic__photos__hero_portrait.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Vertical 4:5 wedding portrait of the fictional couple Inês and Mateo, in their early thirties (Inês: long dark-brown wavy hair worn half up, olive skin, brown eyes, a slim gold ring; Mateo: short dark hair, a neat trimmed beard, light-tan skin; they must not resemble any real person or celebrity) in a sunlit courtyard: she in a simple ivory crepe gown, he in a navy-blue suit, standing close and smiling at each other in front of a wall of blue-and-white hand-painted tiles, terracotta pots with trailing ivy beside them, three-quarter length, faces in the upper third, soft late-afternoon light from the left. Photorealistic, calm cobalt, white and terracotta palette, subtle grain. No text, no frame.
```

#### 280. 2.2 Story 1 — "A rainy afternoon" — isteğe bağlı

- İndirme adı: `30-azulejo-mosaic__photos__story_1.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #279)

```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing at a small table by the window of a cosy café on a rainy afternoon, two coffee cups, raindrops on the glass, blue-and-white tiles on the café wall softly out of focus, warm light inside. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 281. 2.3 Story 2 — "The tram up the hill" — isteğe bağlı

- İndirme adı: `30-azulejo-mosaic__photos__story_2.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1280×1024 px (5:4) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #279)

```
Landscape 5:4: the same couple as hero_portrait.jpg on a steep old cobbled street of a hilly seaside town at golden hour, walking up hand in hand beside a vintage yellow tram (no numbers, no lettering on it), whitewashed houses with tiled façades and terracotta roofs behind, the sea far below. Seen from slightly behind and to the side. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 282. 2.4 Story 3 — "Our promise" — isteğe bağlı

- İndirme adı: `30-azulejo-mosaic__photos__story_3.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG
- Ek görsel: hero_portrait.jpg (listede #279)

```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on a sunlit stone balustrade with a blue-and-white tile set into it and the sea softly out of focus behind, soft light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 283. 2.5 Mekân — isteğe bağlı

- İndirme adı: `30-azulejo-mosaic__photos__venue.jpg`
- Hedef: `collections/30_Azulejo_Mosaic/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
Landscape 16:9: an elegant old Portuguese country estate (a fictional quinta) in early summer: a whitewashed courtyard with blue-and-white tile panels on its walls, a stone arcade, terracotta pots with ivy and white jasmine, a long table set for dinner under string lights, wooded hills behind, soft late-afternoon light. No people, no signs, no text. Photorealistic, same palette.
```

### 31_Sky_Lantern_Festival

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Sky Lantern Festival") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/sky-lantern-festival/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/sky-lantern-festival/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 284. 2.1 Portre (davet kartı ve home) — isteğe bağlı

- İndirme adı: `31-sky-lantern-festival__photos__hero_portrait.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
A warm, natural portrait photograph of a fictional couple in their early thirties (they must not resemble any real person): she has soft wavy light-brown hair below her shoulders and wears a simple ivory chiffon gown, he has short dark-brown hair, a neat short beard and wears a charcoal suit with an open collar. They stand close, foreheads nearly touching, smiling softly, framed from the waist up, on a hilltop terrace at dusk; behind them, softly out of focus, a violet-to-amber sky and a few warm paper lanterns hanging low. Faces in the upper middle of the frame. Photorealistic, natural skin, no heavy retouching. No text, no logo, no watermark.
```

#### 285. 2.2 Story 1 — "Our first evening" — isteğe bağlı

- İndirme adı: `31-sky-lantern-festival__photos__story_1.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1152×1536 px (3:4) · opak · JPG

```
The same fictional couple (same faces, hair and clothes styled casually: she in a light summer dress, he in a white linen shirt) laughing together at a small table on a seaside terrace in the early evening, string lights and a soft violet sky behind them, seen from a little distance. Vertical photo, the couple in the middle third. Photorealistic. No text, no watermark.
```

#### 286. 2.3 Story 2 — "A wish in the sky" — isteğe bağlı

- İndirme adı: `31-sky-lantern-festival__photos__story_2.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1152×1536 px (3:4) · opak · JPG

```
The same fictional couple standing in a quiet meadow at dusk, holding one glowing white paper lantern together between their hands and looking up at it, their faces lit warm by its glow, a violet sky and a few distant soft lights behind them. Seen at a three-quarter angle. Vertical photo. Photorealistic. Calm and intimate — no crowd, no fire, no smoke. No text, no watermark.
```

#### 287. 2.4 Story 3 — "Yes, at dusk" — isteğe bağlı

- İndirme adı: `31-sky-lantern-festival__photos__story_3.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1152×1536 px (3:4) · opak · JPG

```
A close photograph of the same fictional couple's joined hands with a simple gold engagement ring, held up against a soft violet-and-amber dusk sky with a small glowing paper lantern blurred in the background, shallow depth of field. Vertical photo. Photorealistic. No text, no watermark.
```

#### 288. 2.5 Mekân — "The Meadowlark Terrace" (kurgu) — isteğe bağlı

- İndirme adı: `31-sky-lantern-festival__photos__venue.jpg`
- Hedef: `collections/31_Sky_Lantern_Festival/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×864 px (16:9) · opak · JPG

```
A wide photograph of a fictional hilltop garden terrace set for an evening wedding at dusk: long tables with ivory linen and candles, white paper lanterns strung low on thin lines between olive trees, a lawn with rows of white chairs facing an open view of distant hills and the sea under a violet-to-amber sky. It must not reproduce any real, identifiable venue. No people, no text, no signs, no watermark.
```

### 32_Music_Box_Ballerina

Sohbetin ilk mesajı (dosyanın GPT notu):

```
This design ("Music Box Ballerina") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/music-box-ballerina/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/music-box-ballerina/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.
```

#### 289. 2.1 Ana portre (aynada ve davetin yanında) — isteğe bağlı

- İndirme adı: `32-music-box-ballerina__photos__hero_portrait.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/hero_portrait.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties in a light-filled garden pavilion with tall windows and climbing pale pink roses: the bride in an ivory gown with a soft tulle skirt, the groom in a dove-grey suit with a blush rose boutonnière, close together and smiling, waist-up, faces centred in the upper half of the frame (the photo is also shown cropped to an oval). Pastel rose-quartz, blush and cream palette, soft daylight, gentle film grain. They must not resemble any real or famous person. No text, no frame, no watermark.
```

#### 290. 2.2 Ayna 1 — "Our first dance" — isteğe bağlı

- İndirme adı: `32-music-box-ballerina__photos__story_1.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_1.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5, in smart evening clothes dancing a slow first dance together in a softly lit old ballroom with warm string lights, laughing, faces in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No readable signs, no text, no logos.
```

#### 291. 2.3 Ayna 2 — "A little music box" — isteğe bağlı

- İndirme adı: `32-music-box-ballerina__photos__story_2.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_2.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
The same fictional couple, vertical 4:5: the proposal at home by a window on a winter afternoon — he holds out a small open rose-coloured music box with a tiny ring inside, she covers her mouth in happy surprise; faces and the box in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No text, no logos.
```

#### 292. 2.4 Ayna 3 — "Yours, forever" — isteğe bağlı

- İndirme adı: `32-music-box-ballerina__photos__story_3.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_3.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1024×1280 px (4:5) · opak · JPG

```
Close-up, vertical 4:5: the couple's joined hands with a delicate engagement ring, resting on blush satin beside a few rose petals and a little brass music box key; the hands in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No text.
```

#### 293. 2.5 Mekân — isteğe bağlı

- İndirme adı: `32-music-box-ballerina__photos__venue.jpg`
- Hedef: `collections/32_Music_Box_Ballerina/assets/gpt/photos/venue.jpg`
- Bölüm: PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) (örnek fotoğraf (PAKET 2))
- Şart: 1536×1024 px (3:2) · opak · JPG

```
Landscape: an elegant white garden pavilion with tall arched windows and a rose garden in front, set for a spring wedding with cream chairs and pale pink flowers, soft late-afternoon light. Fictional place — no recognisable real building, no people, no signs, no text. Photorealistic, same palette. Keep the pavilion in the middle 60% of the height (the photo is shown cropped to 16:9).
```


## B · Tasarım 01–21 rötuş / baskı parçaları

### 01_Olive_Ivory

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate the images of PAKET 5 (website design: first the W1 screens, then the W2 parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks. Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1 screens, which are layout references.
```

#### 294. P1 — invitation_card_print

- İndirme adı: `01-olive-ivory__invitation_card_print.png`
- Hedef: `collections/01_Olive_Ivory/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/01_Olive_Ivory/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 295. P2 — info_card_print

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

#### 296. P1 — invitation_card_print

- İndirme adı: `02-dusty-blue__invitation_card_print.png`
- Hedef: `collections/02_Dusty_Blue/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/02_Dusty_Blue/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 297. P2 — info_card_print

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

#### 298. P1 — invitation_card_print

- İndirme adı: `03-blush-garden-rose__invitation_card_print.png`
- Hedef: `collections/03_Blush_Garden_Rose/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/03_Blush_Garden_Rose/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 299. P2 — info_card_print

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

#### 300. P1 — invitation_card_print

- İndirme adı: `04-vintage-airmail__invitation_card_print.png`
- Hedef: `collections/04_Vintage_Airmail/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/04_Vintage_Airmail/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 301. P2 — info_card_print

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

#### 302. P1 — invitation_card_print

- İndirme adı: `05-lemon-mediterranean__invitation_card_print.png`
- Hedef: `collections/05_Lemon_Mediterranean/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/05_Lemon_Mediterranean/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 303. P2 — info_card_print

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

#### 304. P1 — invitation_card_print

- İndirme adı: `06-art-deco-noir__invitation_card_print.png`
- Hedef: `collections/06_Art_Deco_Noir/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/06_Art_Deco_Noir/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 305. P2 — info_card_print

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

#### 306. P1 — invitation_card_print

- İndirme adı: `07-burgundy-velvet__invitation_card_print.png`
- Hedef: `collections/07_Burgundy_Velvet/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/07_Burgundy_Velvet/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 307. P2 — info_card_print

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

#### 308. P1 — invitation_card_print

- İndirme adı: `08-winter-evergreen__invitation_card_print.png`
- Hedef: `collections/08_Winter_Evergreen/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/08_Winter_Evergreen/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 309. P2 — info_card_print

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

#### 310. P1 — invitation_card_print

- İndirme adı: `09-lavender-provence__invitation_card_print.png`
- Hedef: `collections/09_Lavender_Provence/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/09_Lavender_Provence/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 311. P2 — info_card_print

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

#### 312. P1 — invitation_card_print

- İndirme adı: `10-tuscan-vineyard__invitation_card_print.png`
- Hedef: `collections/10_Tuscan_Vineyard/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/10_Tuscan_Vineyard/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 313. P2 — info_card_print

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

#### 314. P1 — invitation_card_print

- İndirme adı: `11-boho-pampas__invitation_card_print.png`
- Hedef: `collections/11_Boho_Pampas/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/11_Boho_Pampas/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 315. P2 — info_card_print

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

#### 316. P1 — invitation_card_print

- İndirme adı: `12-tropical-destination__invitation_card_print.png`
- Hedef: `collections/12_Tropical_Destination/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/12_Tropical_Destination/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 317. P2 — info_card_print

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

#### 318. P1 — invitation_card_print

- İndirme adı: `13-enchanted-forest__invitation_card_print.png`
- Hedef: `collections/13_Enchanted_Forest/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/13_Enchanted_Forest/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 319. P2 — info_card_print

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

#### 320. P1 — invitation_card_print

- İndirme adı: `14-ivory-lace-pearl__invitation_card_print.png`
- Hedef: `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/14_Ivory_Lace_Pearl/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 321. P2 — info_card_print

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

#### 322. P1 — invitation_card_print

- İndirme adı: `15-cherry-blossom__invitation_card_print.png`
- Hedef: `collections/15_Cherry_Blossom/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/15_Cherry_Blossom/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 323. P2 — info_card_print

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

#### 324. P1 — invitation_card_print

- İndirme adı: `16-sunflower-rustic__invitation_card_print.png`
- Hedef: `collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 325. P2 — info_card_print

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

#### 326. P1 — invitation_card_print

- İndirme adı: `17-emerald-gold-estate__invitation_card_print.png`
- Hedef: `collections/17_Emerald_Gold_Estate/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/17_Emerald_Gold_Estate/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 327. P2 — info_card_print

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

#### 328. P1 — invitation_card_print

- İndirme adı: `18-wildflower-vellum__invitation_card_print.png`
- Hedef: `collections/18_Wildflower_Vellum/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/18_Wildflower_Vellum/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 329. P2 — info_card_print

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

#### 330. P1 — invitation_card_print

- İndirme adı: `19-midnight-garden__invitation_card_print.png`
- Hedef: `collections/19_Midnight_Garden/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/19_Midnight_Garden/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 331. P2 — info_card_print

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

#### 332. P1 — invitation_card_print

- İndirme adı: `20-coastal-seaside__invitation_card_print.png`
- Hedef: `collections/20_Coastal_Seaside/assets/gpt/parts/invitation_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/20_Coastal_Seaside/assets/gpt/parts/invitation_card.png)

```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

#### 333. P2 — info_card_print

- İndirme adı: `20-coastal-seaside__info_card_print.png`
- Hedef: `collections/20_Coastal_Seaside/assets/gpt/parts/info_card_print.png`
- Bölüm: G139 — Basılı davetiye için yüksek çözünürlüklü parçalar (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/20_Coastal_Seaside/assets/gpt/parts/info_card.png)

```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### 21_Crimson_Rose_Atelier

#### 334. P1 — invitation_card (ön yüz)

- İndirme adı: `21-crimson-rose-atelier__invitation_card.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/invitation_card.png`
- Bölüm: G139 — Basılı davetiye parçaları (yeni; şu an kağıt + gül dalı + mühürle geçici düzen) (baskı parçası (PAKET 6 / G139))
- Şart: 2048×3072 px (2:3) · şeffaf zemin (gerçek alfa) · PNG

```
A flat printed wedding invitation card, front side, seen straight on, portrait 2:3, on a fully transparent background. Warm ivory cotton paper with a subtle deckled edge and a soft natural shadow. Deep crimson and wine garden roses with dark green leaves in a lush cluster at the top-left corner and a smaller mirrored cluster at the bottom-right corner, painted in the same rich, romantic, realistic style as the Crimson Rose Atelier rose branch and wax seal. A thin antique gold hairline frame inset from the edge. The whole centre (about 70% of the width, 55% of the height) is EMPTY paper for text. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp details at 2048 × 3072 px.
```

#### 335. P2 — info_card (arka yüz)

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

#### 336. 1. `closure.png` → card_ribbon

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__closure.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure.png)

```
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 337. 2. `closure_r2_v3.png` → closure, favicon

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__closure_r2_v3.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure_r2_v3.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure_r2_v3.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2_v3.png)

```
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 338. 3. `invitation_card.png` → invitation_card, print:card

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__invitation_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/invitation_card.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png)

```
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 339. 4. `info_card.png` → info_card, print:back

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__info_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/info_card.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/info_card.png)

```
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 340. 5. `web_hero.png` → og-1200x630

- İndirme adı: `16-sunflower-rustic__v02-navy-sunflower__web_hero.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/web_hero.png`
- Bölüm: V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) (palet varyantı)
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: web_hero.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/web_hero.png)

```
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 341. 6. `closure.png` → card_ribbon

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__closure.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/closure.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure.png)

```
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 342. 7. `closure_r2_v3.png` → closure, favicon

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__closure_r2_v3.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/closure_r2_v3.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure_r2_v3.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2_v3.png)

```
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 343. 8. `invitation_card.png` → invitation_card, print:card

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__invitation_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/invitation_card.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png)

```
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 344. 9. `info_card.png` → info_card, print:back

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__info_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/info_card.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/info_card.png)

```
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 345. 10. `web_hero.png` → og-1200x630

- İndirme adı: `16-sunflower-rustic__v03-burgundy-sunflower__web_hero.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/web_hero.png`
- Bölüm: V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) (palet varyantı)
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: web_hero.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/web_hero.png)

```
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 346. 11. `closure.png` → card_ribbon

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__closure.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/closure.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure.png)

```
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 347. 12. `closure_r2_v3.png` → closure, favicon

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__closure_r2_v3.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/closure_r2_v3.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: closure_r2_v3.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2_v3.png)

```
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 348. 13. `invitation_card.png` → invitation_card, print:card

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__invitation_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/invitation_card.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: invitation_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png)

```
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 349. 14. `info_card.png` → info_card, print:back

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__info_card.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/info_card.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1024×1536 px (2:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: info_card.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/info_card.png)

```
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

#### 350. 15. `web_hero.png` → og-1200x630

- İndirme adı: `16-sunflower-rustic__v04-dusty-blue-sunflower__web_hero.png`
- Hedef: `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/web_hero.png`
- Bölüm: V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) (palet varyantı)
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: web_hero.png (repoda: collections/16_Sunflower_Rustic/assets/gpt/parts/web_hero.png)

```
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 21_Crimson_Rose_Atelier

#### 351. İstem — fildişi güller (yalnız istenirse) — isteğe bağlı

- İndirme adı: `21-crimson-rose-atelier__v07-ivory-rose__rose-branch.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png`
- Bölüm: İstem — fildişi güller (yalnız istenirse) (palet varyantı)
- Şart: 1374×1145 px (6:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png)

```
Photorealistic botanical illustration of a branch of three fully open IVORY / soft cream garden roses with dark green rose leaves and a few small buds, painted in exactly the same style, lighting, angle and composition as the reference image (a diagonal branch of three red roses running from lower left to upper right). Keep the same size and position of every rose and leaf; only the petal colour changes to natural ivory-white with warm cream shadows (no pink, no yellow cast). Transparent background (PNG, alpha), no shadow on the ground, no text, no frame. Canvas 1374 × 1145 px.
Reference: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png
```
