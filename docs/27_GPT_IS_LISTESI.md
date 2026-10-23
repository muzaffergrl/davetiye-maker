# GPT iş listesi — ChatGPT'de üretilecek görseller

`python3 tools/gpt_is_listesi.py --yaz` (ya da `tools/gpt_bekleyen.py --yaz`) ile üretilir; elle düzenlenmez. Kaynak: bütün `GPT_PROMPTS.md` dosyaları. Her madde kendi başına yapıştırılabilir tam İngilizce prompt'tur. Tıklanabilir, kopyalama düğmeli ve işaretlenebilir sürüm: [`27_GPT_IS_LISTESI.html`](27_GPT_IS_LISTESI.html) (tarayıcıda aç).

**Toplam: 16 görsel** · B · Tasarım 01–21 rötuş / baskı parçaları: 15 · C · Palet varyantı görselleri: 1

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
| B | 21_Crimson_Rose_Atelier | 15 |
| C | 21_Crimson_Rose_Atelier | 1 |

## B · Tasarım 01–21 rötuş / baskı parçaları

### 21_Crimson_Rose_Atelier

#### 1. W3.1 Kadife fon — telefon (açılış ve RSVP sayfasının zemini)

- İndirme adı: `21-crimson-rose-atelier__velvet.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/velvet.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 1024×1536 px (2:3) · opak · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

A full-frame vertical photograph (2:3) of deep oxblood crushed silk velvet (#29070B in the shadows, #5B1018 in the lit pile), filling the whole canvas edge to edge, lit by one soft warm light from the upper left as if by candlelight in a dark room. The velvet lies almost flat: the middle 60% of the frame (from 20% to 80% of the width and from 15% to 80% of the height) is a CALM, even, slightly darker area with only the fine velvet pile visible, so text and an envelope can sit on it. Only along the left edge, the right edge and the bottom 20% the velvet gathers into a few soft, large, luxurious folds with gentle rich highlights. A subtle natural vignette. No objects, no flowers, no petals, no gold, no envelope, no shadows of objects, no text.
```

Kontrol: orta bölge sakin ve düz; kıvrımlar yalnız kenarlarda ve altta; renk koyu kan kırmızısı (kahverengi/mor değil); nesne yok.

#### 2. W3.2 Kadife fon — geniş ekran

- İndirme adı: `21-crimson-rose-atelier__velvet_wide.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/velvet_wide.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 1536×1024 px (3:2) · opak · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png), velvet.png (listede #1)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

The same oxblood crushed silk velvet as velvet.png, now a full-frame horizontal photograph (3:2) filling the canvas edge to edge, the same color, pile, light from the upper left and vignette. The middle 60% of the width and the middle 70% of the height are a CALM, even area; a few soft large folds only along the left and right edges and the bottom. No objects, no flowers, no gold, no text.
```

Kontrol: velvet.png ile aynı kumaş ve renk; orta bölge sakin.

#### 3. W3.3 Saten dökümü (açılış sahnesinin altı)

- İndirme adı: `21-crimson-rose-atelier__satin_drape.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/satin_drape.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 1800×700 px (18:7) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

A length of deep burgundy silk satin fabric (#4B0C17 with luminous #8E2333 highlights) lying horizontally in soft, generous, flowing folds, seen from the front and slightly above, as if draped across the bottom of a table under an envelope. The fabric forms a wide horizontal band (about 2.6:1) whose upper edge is a soft irregular fabric edge with folds rising and falling; its left and right ends fade out naturally in folds. Rich liquid satin sheen, one soft warm light from the upper left. Nothing else: no petals, no roses, no ribbon, no envelope. True transparent background PNG around the fabric, no cast shadow outside it.
```

Kontrol: tek parça saten; üst kenar yumuşak kumaş kenarı; gerçek alfa; başka nesne yok.

#### 4. W3.4 Gül yaprakları (süzülen yapraklar) — beş ayrı dosya

- İndirme adı: `21-crimson-rose-atelier__petal_1.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_1.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

This prompt describes a set of 5 separate images (petal_1, petal_2, petal_3, petal_4, petal_5). Make ONLY ONE image now: petal_1 (number 1 of 5).

A single loose petal of the same dark crimson red rose as in rose-branch.png, photographed for real, alone, on a fully transparent background: velvety deep red (#8E0F1E, darker #4A0610 at the base and in the curl, a soft luminous edge where the light catches it), natural fine veins, filling about 55% of the square, centred, not cropped. No stem, no leaf, no whole flower, no water drops, no shadow, no other petal. True transparent background PNG. (Make five different petals: 1 = a wide gently cupped petal seen from above, 2 = a petal curled at one edge, 3 = a narrow folded petal seen from the side, 4 = a small inner petal, 5 = a petal lit from behind so its edge glows.)
```

Kontrol: beş dosya, her biri tek yaprak, birbirinden farklı; gül rengi rose-branch.png ile aynı; gölge yok; gerçek alfa.

#### 5. W3.4 Gül yaprakları (süzülen yapraklar) — beş ayrı dosya

- İndirme adı: `21-crimson-rose-atelier__petal_2.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_2.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

This prompt describes a set of 5 separate images (petal_1, petal_2, petal_3, petal_4, petal_5). Make ONLY ONE image now: petal_2 (number 2 of 5).

A single loose petal of the same dark crimson red rose as in rose-branch.png, photographed for real, alone, on a fully transparent background: velvety deep red (#8E0F1E, darker #4A0610 at the base and in the curl, a soft luminous edge where the light catches it), natural fine veins, filling about 55% of the square, centred, not cropped. No stem, no leaf, no whole flower, no water drops, no shadow, no other petal. True transparent background PNG. (Make five different petals: 1 = a wide gently cupped petal seen from above, 2 = a petal curled at one edge, 3 = a narrow folded petal seen from the side, 4 = a small inner petal, 5 = a petal lit from behind so its edge glows.)
```

Kontrol: beş dosya, her biri tek yaprak, birbirinden farklı; gül rengi rose-branch.png ile aynı; gölge yok; gerçek alfa.

#### 6. W3.4 Gül yaprakları (süzülen yapraklar) — beş ayrı dosya

- İndirme adı: `21-crimson-rose-atelier__petal_3.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_3.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

This prompt describes a set of 5 separate images (petal_1, petal_2, petal_3, petal_4, petal_5). Make ONLY ONE image now: petal_3 (number 3 of 5).

A single loose petal of the same dark crimson red rose as in rose-branch.png, photographed for real, alone, on a fully transparent background: velvety deep red (#8E0F1E, darker #4A0610 at the base and in the curl, a soft luminous edge where the light catches it), natural fine veins, filling about 55% of the square, centred, not cropped. No stem, no leaf, no whole flower, no water drops, no shadow, no other petal. True transparent background PNG. (Make five different petals: 1 = a wide gently cupped petal seen from above, 2 = a petal curled at one edge, 3 = a narrow folded petal seen from the side, 4 = a small inner petal, 5 = a petal lit from behind so its edge glows.)
```

Kontrol: beş dosya, her biri tek yaprak, birbirinden farklı; gül rengi rose-branch.png ile aynı; gölge yok; gerçek alfa.

#### 7. W3.4 Gül yaprakları (süzülen yapraklar) — beş ayrı dosya

- İndirme adı: `21-crimson-rose-atelier__petal_4.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_4.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

This prompt describes a set of 5 separate images (petal_1, petal_2, petal_3, petal_4, petal_5). Make ONLY ONE image now: petal_4 (number 4 of 5).

A single loose petal of the same dark crimson red rose as in rose-branch.png, photographed for real, alone, on a fully transparent background: velvety deep red (#8E0F1E, darker #4A0610 at the base and in the curl, a soft luminous edge where the light catches it), natural fine veins, filling about 55% of the square, centred, not cropped. No stem, no leaf, no whole flower, no water drops, no shadow, no other petal. True transparent background PNG. (Make five different petals: 1 = a wide gently cupped petal seen from above, 2 = a petal curled at one edge, 3 = a narrow folded petal seen from the side, 4 = a small inner petal, 5 = a petal lit from behind so its edge glows.)
```

Kontrol: beş dosya, her biri tek yaprak, birbirinden farklı; gül rengi rose-branch.png ile aynı; gölge yok; gerçek alfa.

#### 8. W3.4 Gül yaprakları (süzülen yapraklar) — beş ayrı dosya

- İndirme adı: `21-crimson-rose-atelier__petal_5.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_5.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 512×512 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

This prompt describes a set of 5 separate images (petal_1, petal_2, petal_3, petal_4, petal_5). Make ONLY ONE image now: petal_5 (number 5 of 5).

A single loose petal of the same dark crimson red rose as in rose-branch.png, photographed for real, alone, on a fully transparent background: velvety deep red (#8E0F1E, darker #4A0610 at the base and in the curl, a soft luminous edge where the light catches it), natural fine veins, filling about 55% of the square, centred, not cropped. No stem, no leaf, no whole flower, no water drops, no shadow, no other petal. True transparent background PNG. (Make five different petals: 1 = a wide gently cupped petal seen from above, 2 = a petal curled at one edge, 3 = a narrow folded petal seen from the side, 4 = a small inner petal, 5 = a petal lit from behind so its edge glows.)
```

Kontrol: beş dosya, her biri tek yaprak, birbirinden farklı; gül rengi rose-branch.png ile aynı; gölge yok; gerçek alfa.

#### 9. W3.5 Altın oval portre çerçevesi

- İndirme adı: `21-crimson-rose-atelier__oval_frame.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/oval_frame.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 1000×1250 px (4:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

A slim antique oval picture frame of warm champagne gold (#C9A66D, highlights #EBD3A0), the same gold as seal.png, seen straight from the front, filling the canvas (4:5): a fine beaded inner rim, a softly rounded polished outer moulding and a delicate hand-chased leaf pattern along it, refined and light, never heavy or baroque, no crest and no bow on top. The opening inside is an exact OVAL whose bounding box is 4:5 — from 6% to 94% of the image width and from 6% to 94% of the image height — and the whole opening is filled with flat pure green #00FF00 (no texture, no shading, crisp edge, nothing in front of it). Soft warm light from the upper left. Nothing else. True transparent background PNG outside the frame, no shadow outside the frame.
```

Kontrol: pencere düz `#00FF00` ve oval, kutusu 4:5 ve %6–%94; çerçeve ince; tepe süsü/fiyonk yok; gerçek alfa.

#### 10. W3.6 Yırtık kâğıt kenarı (bordo → fildişi geçişi)

- İndirme adı: `21-crimson-rose-atelier__torn_edge.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/torn_edge.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 2048×320 px (32:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

The torn bottom edge of a sheet of thick deep oxblood cotton paper (#4B0C17, the same paper as envelope-closed.png), seen straight from the front on a fully transparent background. The oxblood paper fills the whole top 55% of the image edge to edge (from the left edge to the right edge), and below it the sheet ends in a hand-torn, gently irregular edge that wanders across the full width between 55% and 85% of the image height; along the tear a fine, pale cream fibrous rim (#EADCC5) of exposed paper core with tiny loose fibres. Below the tear everything is fully transparent. The left and right ends of the tear are at the same height so the strip can repeat side by side. Soft warm light from the upper left, no cast shadow, no objects, no text.
```

Kontrol: kâğıt üstte kenardan kenara; yırtık tüm genişlikte; lifli açık kenar; altı tamamen şeffaf; sağ ve sol uç aynı yükseklikte.

#### 11. W3.7 Saten kurdele (albüm ayracı)

- İndirme adı: `21-crimson-rose-atelier__ribbon.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/ribbon.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 500×1800 px (5:18) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

One long narrow deep burgundy silk satin ribbon (#5B1018 with luminous #9A2037 highlights, about 6% of the image width wide) hanging vertically from the very top edge of the image down to 90% of its height with a gentle natural S-curve and one soft twist, its lower end cut in a neat V (swallowtail). Rich satin sheen, soft warm light from the upper left. Nothing else, no bow, no knot. True transparent background PNG, no shadow outside the ribbon.
```

Kontrol: tek kurdele, üst kenardan başlar; ucu V kesik; fiyonk yok; gerçek alfa.

#### 12. W3.8 Altın yaprak dalı (bölüm süsü)

- İndirme adı: `21-crimson-rose-atelier__gold_sprig.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/gold_sprig.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 600×600 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

One small delicate sprig of hot-foil stamped champagne gold leaves (#C9A66D, highlights #EBD3A0) — the same olive sprig as on seal.png — seven slender leaves on one fine curved stem, rising diagonally from bottom-left to top-right, as if pressed into paper: subtle relief, a fine metallic foil shine, filling about 70% of the square. No paper behind it, no berries, no text. True transparent background PNG, no shadow.
```

Kontrol: tek ince dal, mühürdeki dalla aynı aile; folyo parıltısı; gerçek alfa.

#### 13. W3.9 Albüm sayfası (Story'de çevrilen sayfa)

- İndirme adı: `21-crimson-rose-atelier__album_page.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/album_page.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 1024×1400 px (0.731:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

One thick handmade ivory cotton album page (#F6EDDD), seen straight from the front, filling about 92% of the canvas height, portrait: the left edge is straight (the bound side) with a soft gutter shadow running along it inside the page, the top, right and bottom edges are softly DECKLED (natural torn handmade edges). A warm subtle paper grain, the page completely EMPTY: no photo, no photo corners, no border, no flowers, no text. Soft warm light from the upper left. True transparent background PNG around the page, no cast shadow outside the page.
```

Kontrol: sol kenar düz + iç gölge; diğer üç kenar deckle; sayfa boş; gerçek alfa.

#### 14. W3.10 Gül kümesi (sayfa köşesi)

- İndirme adı: `21-crimson-rose-atelier__rose_corner.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/rose_corner.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 1400×1100 px (14:11) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

A lush corner arrangement of the same dark crimson red roses and dark olive leaves as rose-branch.png, flowing out of the bottom-left corner of the image towards the upper right: three open roses and two buds low in the corner, leaves and a few loose fallen petals reaching up and to the right, the arrangement touching the LEFT and BOTTOM edges of the canvas (it will sit in a page corner) and fading into open leaves towards the top-right, about 60% of the canvas filled. Photographed for real, soft warm light from the upper left. Nothing else, no vase, no ribbon. True transparent background PNG, no cast shadow outside the flowers.
```

Kontrol: küme sol-alt köşeye dayalı; güller rose-branch.png ile aynı; gerçek alfa.

#### 15. W3.11 Tek gül (küçük vurgu)

- İndirme adı: `21-crimson-rose-atelier__rose_bloom.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/rose_bloom.png`
- Bölüm: PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 (website parçası (PAKET 5))
- Şart: 700×700 px (1:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: design-board.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png), rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png), envelope-closed.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png), seal.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png)

```
You are the art director and still-life photographer of a luxury wedding stationery house. We are finishing the website of a design called "Crimson Rose Atelier": deep oxblood and burgundy (#29070B, #4B0C17), ivory cotton paper (#F8EFDF), warm champagne gold (#C9A66D) and dark crimson red roses with dark olive leaves. Attach these four images from the repository to this first message as the style reference of every image in this chat: collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png (the art direction), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png (the exact roses), collections/21_Crimson_Rose_Atelier/assets/gpt/decor/envelope-closed.png (the exact burgundy paper) and collections/21_Crimson_Rose_Atelier/assets/gpt/decor/seal.png (the exact gold). Every image is ONE production asset for a website, photographed for real: rich, tactile, believable materials, one soft warm light from the upper left, magazine-quality luxury, never clip-art, never flat vector, never cheap stock. Never any text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard) and the object must stay at least 5% inside every edge unless the prompt says it fills the canvas.

A single open dark crimson red rose bloom with two dark olive leaves, the same rose as rose-branch.png, seen three-quarter from above, centred, filling about 75% of the square, photographed for real with soft warm light from the upper left. No stem beyond a short piece, no vase, no other flowers. True transparent background PNG, no shadow.
```

Kontrol: tek gül + iki yaprak; gerçek alfa.


## C · Palet varyantı görselleri

### 21_Crimson_Rose_Atelier

#### 16. İstem — fildişi güller (yalnız istenirse) — isteğe bağlı

- İndirme adı: `21-crimson-rose-atelier__v07-ivory-rose__rose-branch.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png`
- Bölüm: İstem — fildişi güller (yalnız istenirse) (palet varyantı)
- Şart: 1374×1145 px (6:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png)

```
Photorealistic botanical illustration of a branch of three fully open IVORY / soft cream garden roses with dark green rose leaves and a few small buds, painted in exactly the same style, lighting, angle and composition as the reference image (a diagonal branch of three red roses running from lower left to upper right). Keep the same size and position of every rose and leaf; only the petal colour changes to natural ivory-white with warm cream shadows (no pink, no yellow cast). Transparent background (PNG, alpha), no shadow on the ground, no text, no frame. Canvas 1374 × 1145 px.
Reference: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png
```
