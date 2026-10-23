# GPT iş listesi — ChatGPT'de üretilecek görseller

`python3 tools/gpt_is_listesi.py --yaz` (ya da `tools/gpt_bekleyen.py --yaz`) ile üretilir; elle düzenlenmez. Kaynak: bütün `GPT_PROMPTS.md` dosyaları. Her madde kendi başına yapıştırılabilir tam İngilizce prompt'tur. Tıklanabilir, kopyalama düğmeli ve işaretlenebilir sürüm: [`27_GPT_IS_LISTESI.html`](27_GPT_IS_LISTESI.html) (tarayıcıda aç).

**Toplam: 29 görsel** · C · Palet varyantı görselleri: 1 · D · Diğer (marka): 28

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
| C | 21_Crimson_Rose_Atelier | 1 |
| D | / | 7 |
| D | brand | 21 |

## C · Palet varyantı görselleri

### 21_Crimson_Rose_Atelier

#### 1. İstem — fildişi güller (yalnız istenirse) — isteğe bağlı

- İndirme adı: `21-crimson-rose-atelier__v07-ivory-rose__rose-branch.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png`
- Bölüm: İstem — fildişi güller (yalnız istenirse) (palet varyantı)
- Şart: 1374×1145 px (6:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png)

```
Photorealistic botanical illustration of a branch of three fully open IVORY / soft cream garden roses with dark green rose leaves and a few small buds, painted in exactly the same style, lighting, angle and composition as the reference image (a diagonal branch of three red roses running from lower left to upper right). Keep the same size and position of every rose and leaf; only the petal colour changes to natural ivory-white with warm cream shadows (no pink, no yellow cast). Transparent background (PNG, alpha), no shadow on the ground, no text, no frame. Canvas 1374 × 1145 px.
Reference: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png
```


## D · Diğer (marka)

### /

#### 2. 1. comps/W1_opening.png

- İndirme adı: `__workspace__davetiye-maker__collections__49-ivory-pearl-atelier__comps__w1_opening.png`
- Hedef: `/workspace/davetiye-maker/collections/49_Ivory_Pearl_Atelier/assets/gpt/comps/W1_opening.png`
- Bölüm: 1. comps/W1_opening.png (website parçası (PAKET 5))
- Şart: opak · PNG
- UYARI: prompt bloğu bulunamadı

```
(prompt bulunamadı — prompt dosyasına bak)
```

#### 3. 2. parts/envelope_closed.png

- İndirme adı: `__workspace__davetiye-maker__collections__49-ivory-pearl-atelier__envelope_closed.png`
- Hedef: `/workspace/davetiye-maker/collections/49_Ivory_Pearl_Atelier/assets/gpt/parts/envelope_closed.png`
- Bölüm: 2. parts/envelope_closed.png (website parçası (PAKET 5))
- Şart: opak · PNG
- UYARI: prompt bloğu bulunamadı

```
(prompt bulunamadı — prompt dosyasına bak)
```

#### 4. 3. parts/closure.png

- İndirme adı: `__workspace__davetiye-maker__collections__49-ivory-pearl-atelier__closure.png`
- Hedef: `/workspace/davetiye-maker/collections/49_Ivory_Pearl_Atelier/assets/gpt/parts/closure.png`
- Bölüm: 3. parts/closure.png (website parçası (PAKET 5))
- Şart: opak · PNG
- UYARI: prompt bloğu bulunamadı

```
(prompt bulunamadı — prompt dosyasına bak)
```

#### 5. 4. parts/accent_bow.png

- İndirme adı: `__workspace__davetiye-maker__collections__49-ivory-pearl-atelier__accent_bow.png`
- Hedef: `/workspace/davetiye-maker/collections/49_Ivory_Pearl_Atelier/assets/gpt/parts/accent_bow.png`
- Bölüm: 4. parts/accent_bow.png (website parçası (PAKET 5))
- Şart: opak · PNG
- UYARI: prompt bloğu bulunamadı

```
(prompt bulunamadı — prompt dosyasına bak)
```

#### 6. 5. parts/envelope_open.png

- İndirme adı: `__workspace__davetiye-maker__collections__49-ivory-pearl-atelier__envelope_open.png`
- Hedef: `/workspace/davetiye-maker/collections/49_Ivory_Pearl_Atelier/assets/gpt/parts/envelope_open.png`
- Bölüm: 5. parts/envelope_open.png (website parçası (PAKET 5))
- Şart: opak · PNG
- UYARI: prompt bloğu bulunamadı

```
(prompt bulunamadı — prompt dosyasına bak)
```

#### 7. 6. parts/invitation_card.png

- İndirme adı: `__workspace__davetiye-maker__collections__49-ivory-pearl-atelier__invitation_card.png`
- Hedef: `/workspace/davetiye-maker/collections/49_Ivory_Pearl_Atelier/assets/gpt/parts/invitation_card.png`
- Bölüm: 6. parts/invitation_card.png (website parçası (PAKET 5))
- Şart: opak · PNG
- UYARI: prompt bloğu bulunamadı

```
(prompt bulunamadı — prompt dosyasına bak)
```

#### 8. 7. textures/bg_page.png

- İndirme adı: `__workspace__davetiye-maker__collections__49-ivory-pearl-atelier__textures__bg_page.png`
- Hedef: `/workspace/davetiye-maker/collections/49_Ivory_Pearl_Atelier/assets/gpt/textures/bg_page.png`
- Bölüm: 7. textures/bg_page.png (website parçası (PAKET 5))
- Şart: opak · PNG
- UYARI: prompt bloğu bulunamadı

```
(prompt bulunamadı — prompt dosyasına bak)
```

### brand

#### 9. SM1.1 Designs — mühürlü zarf

- İndirme adı: `brand__social__highlight_designs.png`
- Hedef: `brand/social/gpt/highlight_designs.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

An Instagram story highlight cover, 9:16 portrait: a solid deep aubergine (#2B1526) background with a very subtle fine paper grain, and in the exact center a simple, elegant single-line icon drawn in flat champagne gold (#D0AE6A): a closed envelope with a small round wax seal on its V flap. Even line weight, rounded line ends, minimal detail, the icon about 34% of the image width, perfectly centered horizontally and vertically, nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: ikon tam ortada ve genişliğin ~%34'ü; tek çizgi, düz altın; zemin düz patlıcan; yazı yok.

#### 10. SM1.2 How it works — telefon ve dokunuş

- İndirme adı: `brand__social__highlight_how.png`
- Hedef: `brand/social/gpt/highlight_how.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

Same style and size as the previous highlight cover (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is a smartphone seen from the front with a fingertip touching the center of its screen and two small curved lines showing the tap. Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: SM1.1 ile aynı çizgi kalınlığı ve boyut; telefon + parmak ucu; yazı yok.

#### 11. SM1.3 RSVP — yanıt kartı

- İndirme adı: `brand__social__highlight_rsvp.png`
- Hedef: `brand/social/gpt/highlight_rsvp.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is a small reply card with a check mark inside a circle in its lower half and two short blank lines above it. The lines are plain strokes, not letters. Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: kartta harf yok (yalnız çizgi ve tik); aynı stil.

#### 12. SM1.4 FAQ — konuşma balonu

- İndirme adı: `brand__social__highlight_faq.png`
- Hedef: `brand/social/gpt/highlight_faq.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is two overlapping rounded speech bubbles, the front one with three small dots inside. No question mark, no letters. Nothing else in the image. No text, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: soru işareti ya da harf yok; aynı stil.

#### 13. SM1.5 Tips — açık defter

- İndirme adı: `brand__social__highlight_tips.png`
- Hedef: `brand/social/gpt/highlight_tips.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is an open notebook with a small ribbon bookmark and a few plain lines on its pages (strokes, not writing). Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: sayfalarda yazı yok; beş kapak yan yana aynı aileden görünüyor.

#### 14. SM2.1 Kaydırmalı gönderi kapağı — açık

- İndirme adı: `brand__social__bg_carousel_cover_light.png`
- Hedef: `brand/social/gpt/bg_carousel_cover_light.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 4:5 portrait, of a warm paper surface (#EDE5D7 to #FAF7F0) with a fine natural paper texture. Along the right edge only, partly cut off by the frame: a sprig of dried white flowers, a loose champagne-gold silk ribbon and the corner of a pale lavender envelope, with soft natural shadows from window light at the top-left. The left 65% and the middle of the image are calm, completely empty paper for a large headline. No text, no letters, no logos, no phone.
```

Kontrol: sol %65 tamamen boş; nesneler yalnız sağ kenarda; yazı yok.

#### 15. SM2.2 Kaydırmalı gönderi iç sayfası — açık

- İndirme adı: `brand__social__bg_carousel_inner_light.png`
- Hedef: `brand/social/gpt/bg_carousel_inner_light.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 4:5 portrait, of the same warm paper surface as the previous image (#EDE5D7 to #FAF7F0, fine natural paper texture), almost empty: only a very soft, out-of-focus shadow of a leafy branch falling across the top-right corner from window light. Everything else is calm, even, empty paper for text and screenshots. No objects, no text, no letters, no logos.
```

Kontrol: neredeyse boş; gölge yalnız sağ üst köşede; düz ışık (metin okunur kalsın).

#### 16. SM2.3 Kaydırmalı gönderi — koyu (kapak ya da son sayfa)

- İndirme adı: `brand__social__bg_carousel_dark.png`
- Hedef: `brand/social/gpt/bg_carousel_dark.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 4:5 portrait, of deep aubergine (#2B1526) heavyweight cotton paper with a soft natural texture, lit by soft window light from the top-left. In the bottom-right corner only, partly cut off by the frame: a folded champagne-gold silk ribbon and a single dried rose. The rest of the image (about 80%) is calm, empty dark paper for light text. No text, no letters, no logos, no phone, no metallic shine.
```

Kontrol: %80 boş koyu zemin; nesneler yalnız sağ alt köşede; yazı yok.

#### 17. SM2.4 Hikâye zemini — açık

- İndirme adı: `brand__social__bg_story_light.png`
- Hedef: `brand/social/gpt/bg_story_light.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 9:16 portrait, of a warm paper surface (#EDE5D7 to #FAF7F0) with a fine natural texture. At the very top edge, partly cut off: a champagne-gold silk ribbon lying across and two small sprigs of dried flowers; at the very bottom edge, partly cut off: the corner of a pale lavender envelope. The middle 70% of the image is calm, completely empty paper. Soft window light from the top-left. No text, no letters, no logos, no phone.
```

Kontrol: orta %70 boş (Instagram'ın üst/alt arayüzü kenar süsleri örter, sorun değil); yazı yok.

#### 18. SM2.5 Hikâye zemini — koyu

- İndirme adı: `brand__social__bg_story_dark.png`
- Hedef: `brand/social/gpt/bg_story_dark.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 9:16 portrait, of deep aubergine (#2B1526) heavyweight cotton paper with a soft natural texture, lit by soft window light from the top-left. At the very top edge, partly cut off: a folded champagne-gold silk ribbon; at the very bottom edge, partly cut off: a single dried rose and a few petals. The middle 70% is calm, completely empty dark paper. No text, no letters, no logos, no phone, no metallic shine.
```

Kontrol: orta %70 boş; altın düz renk (folyo parlaması yok); yazı yok.

#### 19. SM2.6 Pinterest rehber pini zemini

- İndirme adı: `brand__social__bg_pin_guide.png`
- Hedef: `brand/social/gpt/bg_pin_guide.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1000×1500 px (2:3) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead styled flat lay photograph, 2:3 portrait, on warm off-white linen (#FAF7F0): along the top edge only, partly cut off by the frame, a few wedding planning details — a pale lavender envelope, a champagne-gold silk ribbon, a fountain pen and a small sprig of white flowers. The lower 75% of the image is a calm, empty sheet of warm paper (#EDE5D7) lying on the linen, with straight edges, ready for a checklist to be written on it. Soft natural daylight from the top-left with soft shadows. No text, no letters, no numbers, no logos, no phone.
```

Kontrol: alt %75 boş kâğıt; kâğıtta yazı/çizgi yok; nesneler yalnız üst kenarda.

#### 20. SM3.1 Planlama masası, telefon elde

- İndirme adı: `brand__social__scene_planning_desk.png`
- Hedef: `brand/social/gpt/scene_planning_desk.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait, seen from slightly above: a fictional woman's hand (only the hand and wrist, a delicate engagement ring, natural nails) holding a smartphone upright over a wooden desk covered with gentle wedding planning details — an open linen planner with blank pages, fabric swatches in blush and sage, a cup of coffee, a few loose dried flowers. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large in the frame (about 45% of the image height) and fully visible, not covered by the thumb. The upper-left quarter of the image stays calm and uncluttered. Warm morning window light, soft shadows, true-to-life colors. No text, no letters, no logos.
```

Kontrol: ekran büyük, düz yeşil, parmaksız; yüzük var; plannerda yazı yok; sol üst sakin.

#### 21. SM3.2 Mühürlü zarfın üstünde telefon

- İndirme adı: `brand__social__scene_phone_on_envelope.png`
- Hedef: `brand/social/gpt/scene_phone_on_envelope.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Overhead photograph, 4:5 portrait: a smartphone lying flat on top of a real cream paper envelope that is closed with a round deep aubergine (#2B1526) wax seal (the seal's face is a plain smooth circle with no letter or symbol), on warm off-white linen. A champagne-gold silk ribbon and a few loose white petals around them. The phone sits in the center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections. Soft natural daylight from the top-left, soft shadows, premium editorial still life. No hands, no text, no letters, no logos.
```

Kontrol: mühür yüzü boş (harf/sembol yok); telefon düz ve ortada; yeşil yansımasız.

#### 22. SM3.3 Yeni nişanlı, kış ışıkları

- İndirme adı: `brand__social__scene_just_engaged_winter.png`
- Hedef: `brand/social/gpt/scene_just_engaged_winter.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait: close-up of a fictional woman's left hand with a new engagement ring, holding a smartphone, and her partner's hand resting gently on her wrist, in a cozy living room in December — soft out-of-focus warm string lights and a hint of evergreen in the background, a knit sweater sleeve. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large (about 45% of the image height), fully visible and not covered by fingers. Warm, joyful, intimate mood, natural light mixed with warm bokeh. Anatomically correct hands. No faces, no text, no letters, no logos.
```

Kontrol: iki el doğal ve doğru; yüzük görünür; ekran büyük ve açık; yüz yok.

#### 23. SM3.4 Akşam yemeği masası (Pinterest)

- İndirme adı: `brand__social__scene_dinner_table.png`
- Hedef: `brand/social/gpt/scene_dinner_table.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1000×1500 px (2:3) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 2:3 portrait: an elegant candlelit dinner table set for a wedding celebration — linen tablecloth, taper candles, low garden roses and greenery, crystal glasses — and in the foreground a smartphone standing upright on a small stand, slightly angled toward the camera, its entire screen a flat pure green #00FF00 rectangle, large and fully visible. Warm candlelight with soft evening ambient light, shallow depth of field on the background. The top 25% of the image is calm, darker background suitable for a headline. No people, no text, no letters, no logos, no menu cards with writing.
```

Kontrol: ekran büyük ve okunur açıda; üst %25 sakin; masada yazılı kart yok.

#### 24. SM3.5 Çiçekli keten, üstten (Pinterest)

- İndirme adı: `brand__social__scene_linen_flatlay.png`
- Hedef: `brand/social/gpt/scene_linen_flatlay.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1000×1500 px (2:3) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Overhead flat lay photograph, 2:3 portrait, on soft white linen: a smartphone in the lower center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections; around it, mainly in the upper half, loose garden roses and sweet peas in blush, ivory and soft lavender, a champagne-gold silk ribbon and a blank cream place card. The top 20% stays calm linen for a headline. Soft natural daylight from the top-left, soft shadows, premium editorial still life. No hands, no text, no letters, no logos.
```

Kontrol: telefon düz; üst %20 boş; kartta yazı yok.

#### 25. SM3.6 Bahçede altın saat (hikâye / Reel kapağı)

- İndirme adı: `brand__social__scene_garden_golden_hour.png`
- Hedef: `brand/social/gpt/scene_garden_golden_hour.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 9:16 portrait: a fictional woman's hand holding a smartphone up at chest height in a blooming garden at golden hour, roses and soft greenery blurred behind, warm sunlight flaring gently from the side. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large (about 40% of the image height), in the vertical middle of the frame, fully visible and not covered by fingers. The top 20% and bottom 20% of the image are soft, calm background. Anatomically correct hand, a delicate ring, no face. No text, no letters, no logos.
```

Kontrol: ekran dikeyde ortada; üst ve alt %20 sakin (Reel arayüzü oraya biner); yazı yok.

#### 26. SM3.7 Kafede davetiyeyi alan misafir

- İndirme adı: `brand__social__scene_guest_cafe.png`
- Hedef: `brand/social/gpt/scene_guest_cafe.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait: a fictional man in his thirties (not resembling any real person), seen from the shoulder down at a sunny café table, holding a smartphone in one hand and smiling slightly (only the lower half of his face visible at most), a cappuccino and a croissant on the table. The phone's entire screen is a flat pure green #00FF00 rectangle angled toward the camera, large and fully visible, not covered by fingers. Natural relaxed moment, correct hands, warm daylight, soft background. No text, no letters, no logos, no menus with writing.
```

Kontrol: kimliği belirgin yüz yok; ekran okunur açıda; yazı yok.

#### 27. SM3.8 Karşılama masasında QR kartı (yeşil alan = QR)

- İndirme adı: `brand__social__scene_qr_welcome_table.png`
- Hedef: `brand/social/gpt/scene_qr_welcome_table.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait: a wedding welcome table with a small framed card (5×7 inch, cream paper in a thin gold frame) standing on an easel-back, beside a low arrangement of white roses and eucalyptus and two small candles. In the center of the card there is one perfectly square flat pure green #00FF00 area (about 45% of the card's width), with a wide empty cream margin all around it; the rest of the card is blank. The card faces the camera straight on, sharp and well lit. Soft daylight, shallow depth of field. No phone, no people, no text, no letters, no QR pattern, no logos.
```

Kontrol: yeşil alan tam kare ve tek; kartta başka yazı/desen yok; telefon yok. (Claude buraya `tools/make_qr.py` ile gerçek QR koyar.)

#### 28. SM3.9 Sonbahar şükran masası (teşekkür modu)

- İndirme adı: `brand__social__scene_autumn_thanks.png`
- Hedef: `brand/social/gpt/scene_autumn_thanks.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait, seen from slightly above: a cozy late-November table — a linen napkin, small white pumpkins, burgundy dahlias, a few copper autumn leaves, a cup of tea — and a fictional woman's hand holding a smartphone toward the camera, its entire screen a flat pure green #00FF00 rectangle, large and fully visible, not covered by fingers. Warm, grateful, homey mood, soft afternoon light. Anatomically correct hand, no face. No text, no letters, no logos.
```

Kontrol: ekran büyük ve açık; mevsim hissi var; yazı yok.

#### 29. SM3.10 Kış masası, kahve ve battaniye

- İndirme adı: `brand__social__scene_winter_cozy.png`
- Hedef: `brand/social/gpt/scene_winter_cozy.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Overhead photograph, 4:5 portrait: a cozy winter flat lay on a chunky cream knit blanket — a smartphone in the center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections; around it a mug of hot chocolate, a sprig of evergreen with red berries, a pine cone, a pale envelope with a plain unmarked wax seal and a few warm fairy lights. The top 20% stays calm for a headline. Soft, warm light. No hands, no text, no letters, no logos.
```

Kontrol: telefon düz ve ortada; mühür yüzü boş; üst %20 sakin; yazı yok.
