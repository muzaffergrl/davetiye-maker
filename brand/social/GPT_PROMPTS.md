# GM10 — Sosyal medya görselleri (Instagram, TikTok, Pinterest), 2026-10-22

Plan ve takvim: `docs/35_SOSYAL_MEDYA.md`. Metinler: `brand/social/CAPTIONS.md`. Bu dosya yalnız **GPT'nin üreteceği**
görselleri listeler (K17, K21). Ürünün kendisi (zarf açılışı, sayfalar, panel, RSVP) her gönderide **gerçek ekrandır**:
Claude yerel üretim derlemesinden yakalar ve yeşil ekranlara yerleştirir (`tools/mockup_compose.py`). Yazı, başlık ve logo
da Claude'dan gelir (HTML → PNG, marka fontları); GPT görsellerinde yazı yok.

**Sıra, tek sohbet:** SM1 öne çıkan kapakları → SM2 zeminler → SM3 yaşam sahneleri. Her bölümün başındaki İngilizce
"Instructions for GPT" bloğu, o bölümün her prompt'unun başına eklenir (docs/27 listesi bunu kendisi yapar).
Repo `muzaffergrl/davetiye-maker`, klasör `brand/social/gpt/`, commit `GM10: sosyal medya görselleri`.
ChatGPT'de indirme adı ve yerleştirme: `docs/27_GPT_IS_LISTESI.md` (§ "ChatGPT'de çalışma"). Bu maddeler orada **D · Diğer
(marka)** grubunda görünür.

Ölçüler hedef ölçüdür. ChatGPT başka ölçü verirse aynı sohbette "same image, exactly W×H px" diye bir kez iste; oran
±%2 tutmalı. Hiçbir görselde şeffaf zemin istenmiyor.

---

## SM1 — Instagram öne çıkan (highlight) kapakları

Beşi aynı stil: koyu patlıcan zemin, ortada şampanya altını tek çizgi ikon. Instagram kapağı daireye kırpar; ikon merkezdeki
dairenin içinde kalmalı. 1080×1920 (hikâye olarak yüklenir, kapak olarak seçilir).

**Instructions for GPT (send before the first image):**
```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.
```

### SM1.1 Designs — mühürlü zarf
**Kaydet:** `brand/social/gpt/highlight_designs.png` · 1080×1920
```
An Instagram story highlight cover, 9:16 portrait: a solid deep aubergine (#2B1526) background with a very subtle fine paper grain, and in the exact center a simple, elegant single-line icon drawn in flat champagne gold (#D0AE6A): a closed envelope with a small round wax seal on its V flap. Even line weight, rounded line ends, minimal detail, the icon about 34% of the image width, perfectly centered horizontally and vertically, nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```
Kontrol: ikon tam ortada ve genişliğin ~%34'ü; tek çizgi, düz altın; zemin düz patlıcan; yazı yok.

### SM1.2 How it works — telefon ve dokunuş
**Kaydet:** `brand/social/gpt/highlight_how.png` · 1080×1920
```
Same style and size as the previous highlight cover (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is a smartphone seen from the front with a fingertip touching the center of its screen and two small curved lines showing the tap. Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```
Kontrol: SM1.1 ile aynı çizgi kalınlığı ve boyut; telefon + parmak ucu; yazı yok.

### SM1.3 RSVP — yanıt kartı
**Kaydet:** `brand/social/gpt/highlight_rsvp.png` · 1080×1920
```
Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is a small reply card with a check mark inside a circle in its lower half and two short blank lines above it. The lines are plain strokes, not letters. Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```
Kontrol: kartta harf yok (yalnız çizgi ve tik); aynı stil.

### SM1.4 FAQ — konuşma balonu
**Kaydet:** `brand/social/gpt/highlight_faq.png` · 1080×1920
```
Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is two overlapping rounded speech bubbles, the front one with three small dots inside. No question mark, no letters. Nothing else in the image. No text, no numbers, no glow, no shadow, no metallic shine.
```
Kontrol: soru işareti ya da harf yok; aynı stil.

### SM1.5 Tips — açık defter
**Kaydet:** `brand/social/gpt/highlight_tips.png` · 1080×1920
```
Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is an open notebook with a small ribbon bookmark and a few plain lines on its pages (strokes, not writing). Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```
Kontrol: sayfalarda yazı yok; beş kapak yan yana aynı aileden görünüyor.

---

## SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir)

**Instructions for GPT (send before the first image):**
```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.
```

### SM2.1 Kaydırmalı gönderi kapağı — açık
**Kaydet:** `brand/social/gpt/bg_carousel_cover_light.png` · 1080×1350
```
Overhead photograph, 4:5 portrait, of a warm paper surface (#EDE5D7 to #FAF7F0) with a fine natural paper texture. Along the right edge only, partly cut off by the frame: a sprig of dried white flowers, a loose champagne-gold silk ribbon and the corner of a pale lavender envelope, with soft natural shadows from window light at the top-left. The left 65% and the middle of the image are calm, completely empty paper for a large headline. No text, no letters, no logos, no phone.
```
Kontrol: sol %65 tamamen boş; nesneler yalnız sağ kenarda; yazı yok.

### SM2.2 Kaydırmalı gönderi iç sayfası — açık
**Kaydet:** `brand/social/gpt/bg_carousel_inner_light.png` · 1080×1350
```
Overhead photograph, 4:5 portrait, of the same warm paper surface as the previous image (#EDE5D7 to #FAF7F0, fine natural paper texture), almost empty: only a very soft, out-of-focus shadow of a leafy branch falling across the top-right corner from window light. Everything else is calm, even, empty paper for text and screenshots. No objects, no text, no letters, no logos.
```
Kontrol: neredeyse boş; gölge yalnız sağ üst köşede; düz ışık (metin okunur kalsın).

### SM2.3 Kaydırmalı gönderi — koyu (kapak ya da son sayfa)
**Kaydet:** `brand/social/gpt/bg_carousel_dark.png` · 1080×1350
```
Overhead photograph, 4:5 portrait, of deep aubergine (#2B1526) heavyweight cotton paper with a soft natural texture, lit by soft window light from the top-left. In the bottom-right corner only, partly cut off by the frame: a folded champagne-gold silk ribbon and a single dried rose. The rest of the image (about 80%) is calm, empty dark paper for light text. No text, no letters, no logos, no phone, no metallic shine.
```
Kontrol: %80 boş koyu zemin; nesneler yalnız sağ alt köşede; yazı yok.

### SM2.4 Hikâye zemini — açık
**Kaydet:** `brand/social/gpt/bg_story_light.png` · 1080×1920
```
Overhead photograph, 9:16 portrait, of a warm paper surface (#EDE5D7 to #FAF7F0) with a fine natural texture. At the very top edge, partly cut off: a champagne-gold silk ribbon lying across and two small sprigs of dried flowers; at the very bottom edge, partly cut off: the corner of a pale lavender envelope. The middle 70% of the image is calm, completely empty paper. Soft window light from the top-left. No text, no letters, no logos, no phone.
```
Kontrol: orta %70 boş (Instagram'ın üst/alt arayüzü kenar süsleri örter, sorun değil); yazı yok.

### SM2.5 Hikâye zemini — koyu
**Kaydet:** `brand/social/gpt/bg_story_dark.png` · 1080×1920
```
Overhead photograph, 9:16 portrait, of deep aubergine (#2B1526) heavyweight cotton paper with a soft natural texture, lit by soft window light from the top-left. At the very top edge, partly cut off: a folded champagne-gold silk ribbon; at the very bottom edge, partly cut off: a single dried rose and a few petals. The middle 70% is calm, completely empty dark paper. No text, no letters, no logos, no phone, no metallic shine.
```
Kontrol: orta %70 boş; altın düz renk (folyo parlaması yok); yazı yok.

### SM2.6 Pinterest rehber pini zemini
**Kaydet:** `brand/social/gpt/bg_pin_guide.png` · 1000×1500
```
Overhead styled flat lay photograph, 2:3 portrait, on warm off-white linen (#FAF7F0): along the top edge only, partly cut off by the frame, a few wedding planning details — a pale lavender envelope, a champagne-gold silk ribbon, a fountain pen and a small sprig of white flowers. The lower 75% of the image is a calm, empty sheet of warm paper (#EDE5D7) lying on the linen, with straight edges, ready for a checklist to be written on it. Soft natural daylight from the top-left with soft shadows. No text, no letters, no numbers, no logos, no phone.
```
Kontrol: alt %75 boş kâğıt; kâğıtta yazı/çizgi yok; nesneler yalnız üst kenarda.

---

## SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)

Her sahnede **tek** düz #00FF00 alan (SM3.8'de telefon yok, alan QR kartıdır). Ekran kameraya dönük ve büyük olmalı:
gerçek ekran görüntüsü okunur kalsın.

**Instructions for GPT (send before the first image):**
```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.
```

### SM3.1 Planlama masası, telefon elde
**Kaydet:** `brand/social/gpt/scene_planning_desk.png` · 1080×1350
```
Lifestyle photograph, 4:5 portrait, seen from slightly above: a fictional woman's hand (only the hand and wrist, a delicate engagement ring, natural nails) holding a smartphone upright over a wooden desk covered with gentle wedding planning details — an open linen planner with blank pages, fabric swatches in blush and sage, a cup of coffee, a few loose dried flowers. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large in the frame (about 45% of the image height) and fully visible, not covered by the thumb. The upper-left quarter of the image stays calm and uncluttered. Warm morning window light, soft shadows, true-to-life colors. No text, no letters, no logos.
```
Kontrol: ekran büyük, düz yeşil, parmaksız; yüzük var; plannerda yazı yok; sol üst sakin.

### SM3.2 Mühürlü zarfın üstünde telefon
**Kaydet:** `brand/social/gpt/scene_phone_on_envelope.png` · 1080×1350
```
Overhead photograph, 4:5 portrait: a smartphone lying flat on top of a real cream paper envelope that is closed with a round deep aubergine (#2B1526) wax seal (the seal's face is a plain smooth circle with no letter or symbol), on warm off-white linen. A champagne-gold silk ribbon and a few loose white petals around them. The phone sits in the center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections. Soft natural daylight from the top-left, soft shadows, premium editorial still life. No hands, no text, no letters, no logos.
```
Kontrol: mühür yüzü boş (harf/sembol yok); telefon düz ve ortada; yeşil yansımasız.

### SM3.3 Yeni nişanlı, kış ışıkları
**Kaydet:** `brand/social/gpt/scene_just_engaged_winter.png` · 1080×1350
```
Lifestyle photograph, 4:5 portrait: close-up of a fictional woman's left hand with a new engagement ring, holding a smartphone, and her partner's hand resting gently on her wrist, in a cozy living room in December — soft out-of-focus warm string lights and a hint of evergreen in the background, a knit sweater sleeve. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large (about 45% of the image height), fully visible and not covered by fingers. Warm, joyful, intimate mood, natural light mixed with warm bokeh. Anatomically correct hands. No faces, no text, no letters, no logos.
```
Kontrol: iki el doğal ve doğru; yüzük görünür; ekran büyük ve açık; yüz yok.

### SM3.4 Akşam yemeği masası (Pinterest)
**Kaydet:** `brand/social/gpt/scene_dinner_table.png` · 1000×1500
```
Lifestyle photograph, 2:3 portrait: an elegant candlelit dinner table set for a wedding celebration — linen tablecloth, taper candles, low garden roses and greenery, crystal glasses — and in the foreground a smartphone standing upright on a small stand, slightly angled toward the camera, its entire screen a flat pure green #00FF00 rectangle, large and fully visible. Warm candlelight with soft evening ambient light, shallow depth of field on the background. The top 25% of the image is calm, darker background suitable for a headline. No people, no text, no letters, no logos, no menu cards with writing.
```
Kontrol: ekran büyük ve okunur açıda; üst %25 sakin; masada yazılı kart yok.

### SM3.5 Çiçekli keten, üstten (Pinterest)
**Kaydet:** `brand/social/gpt/scene_linen_flatlay.png` · 1000×1500
```
Overhead flat lay photograph, 2:3 portrait, on soft white linen: a smartphone in the lower center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections; around it, mainly in the upper half, loose garden roses and sweet peas in blush, ivory and soft lavender, a champagne-gold silk ribbon and a blank cream place card. The top 20% stays calm linen for a headline. Soft natural daylight from the top-left, soft shadows, premium editorial still life. No hands, no text, no letters, no logos.
```
Kontrol: telefon düz; üst %20 boş; kartta yazı yok.

### SM3.6 Bahçede altın saat (hikâye / Reel kapağı)
**Kaydet:** `brand/social/gpt/scene_garden_golden_hour.png` · 1080×1920
```
Lifestyle photograph, 9:16 portrait: a fictional woman's hand holding a smartphone up at chest height in a blooming garden at golden hour, roses and soft greenery blurred behind, warm sunlight flaring gently from the side. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large (about 40% of the image height), in the vertical middle of the frame, fully visible and not covered by fingers. The top 20% and bottom 20% of the image are soft, calm background. Anatomically correct hand, a delicate ring, no face. No text, no letters, no logos.
```
Kontrol: ekran dikeyde ortada; üst ve alt %20 sakin (Reel arayüzü oraya biner); yazı yok.

### SM3.7 Kafede davetiyeyi alan misafir
**Kaydet:** `brand/social/gpt/scene_guest_cafe.png` · 1080×1350
```
Lifestyle photograph, 4:5 portrait: a fictional man in his thirties (not resembling any real person), seen from the shoulder down at a sunny café table, holding a smartphone in one hand and smiling slightly (only the lower half of his face visible at most), a cappuccino and a croissant on the table. The phone's entire screen is a flat pure green #00FF00 rectangle angled toward the camera, large and fully visible, not covered by fingers. Natural relaxed moment, correct hands, warm daylight, soft background. No text, no letters, no logos, no menus with writing.
```
Kontrol: kimliği belirgin yüz yok; ekran okunur açıda; yazı yok.

### SM3.8 Karşılama masasında QR kartı (yeşil alan = QR)
**Kaydet:** `brand/social/gpt/scene_qr_welcome_table.png` · 1080×1350
```
Lifestyle photograph, 4:5 portrait: a wedding welcome table with a small framed card (5×7 inch, cream paper in a thin gold frame) standing on an easel-back, beside a low arrangement of white roses and eucalyptus and two small candles. In the center of the card there is one perfectly square flat pure green #00FF00 area (about 45% of the card's width), with a wide empty cream margin all around it; the rest of the card is blank. The card faces the camera straight on, sharp and well lit. Soft daylight, shallow depth of field. No phone, no people, no text, no letters, no QR pattern, no logos.
```
Kontrol: yeşil alan tam kare ve tek; kartta başka yazı/desen yok; telefon yok. (Claude buraya `tools/make_qr.py` ile gerçek QR koyar.)

### SM3.9 Sonbahar şükran masası (teşekkür modu)
**Kaydet:** `brand/social/gpt/scene_autumn_thanks.png` · 1080×1350
```
Lifestyle photograph, 4:5 portrait, seen from slightly above: a cozy late-November table — a linen napkin, small white pumpkins, burgundy dahlias, a few copper autumn leaves, a cup of tea — and a fictional woman's hand holding a smartphone toward the camera, its entire screen a flat pure green #00FF00 rectangle, large and fully visible, not covered by fingers. Warm, grateful, homey mood, soft afternoon light. Anatomically correct hand, no face. No text, no letters, no logos.
```
Kontrol: ekran büyük ve açık; mevsim hissi var; yazı yok.

### SM3.10 Kış masası, kahve ve battaniye
**Kaydet:** `brand/social/gpt/scene_winter_cozy.png` · 1080×1350
```
Overhead photograph, 4:5 portrait: a cozy winter flat lay on a chunky cream knit blanket — a smartphone in the center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections; around it a mug of hot chocolate, a sprig of evergreen with red berries, a pine cone, a pale envelope with a plain unmarked wax seal and a few warm fairy lights. The top 20% stays calm for a headline. Soft, warm light. No hands, no text, no letters, no logos.
```
Kontrol: telefon düz ve ortada; mühür yüzü boş; üst %20 sakin; yazı yok.

---

## Kullanım (Claude, sonra — G191)

- Yeşil alanlara gerçek ekranlar (`tools/listing_templates/capture.ts` çıktıları: açılış kareleri, Home, Details, RSVP,
  panel, Share) `tools/mockup_compose.py` ile yerleşir; SM3.8'e `tools/make_qr.py` ile bkestudio.com QR'ı.
- Başlıklar HTML şablonuyla, marka fontlarıyla (Archivo / Montserrat / DM Sans; `brand/tokens.json`) eklenir. Logo SVG'den.
- Hiçbir gönderide uydurma yorum, "best seller", müşteri sayısı ya da gerçek olmayan çift yer almaz. Demo çiftler "sample".
- Fotogerçekçi GPT sahnesi içeren gönderilerde platformların yapay zekâ etiketi açılır (docs/35 §8).
