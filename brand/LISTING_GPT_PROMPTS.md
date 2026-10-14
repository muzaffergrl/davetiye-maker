# BKE Studio — ortak Etsy ilan şablonu GPT prompt'ları (GM03, 2026-10-14)

Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu paket
20 tasarımın **ortak** ilan sisteminin tasarımını verir: kapak ve bilgi görsellerinin yerleşim ve tipografi comp'ları
(LC, yalnız referans; demo metin serbest) + özellik ikonları (LI). Her tasarımın kendi fotoğraf sahneleri ayrı
(`collections/<NN>/assets/gpt/GPT_PROMPTS.md` PAKET 3). Claude comp'lara bakarak görselleri gerçek ekranlar, gerçek
sahneler ve doğru metinle kurar (G065).

**Önkoşul:** GM01 bitti: `brand/assets/gpt/final/brand_board_final.png` ve `logo_horizontal.png` var. Yoksa dur, Sonuç'a yaz.

**Sıra, tek sohbet:** LS0 brief (görsel yok) → LC1–LC7 comp'lar (her birinde marka panosunu **referans görsel** ver) →
LI1–LI8 ikonlar (LC6'yı da referans ver). Comp'larda telefon ekranları **düz #00FF00** (Claude gerçek ekranı koyar).
Comp'lardaki metin yalnız aşağıda verilen metin; harf harf doğru yaz, hatalıysa yeniden üret.

---

## LS0 — Brief (önce düz mesaj; görsel üretme)

```
You are the art director of the Etsy shop of BKE Studio. Keep this brief for every image in this chat; do not generate an image for this message.
BKE Studio sells wedding websites that open like a real invitation: guests tap a sealed envelope on their phone, it opens with motion, and the invitation site appears (home, story, details, RSVP). Couples buy a design on Etsy, open their start link and edit everything from their phone, then share their link. There are 20 romantic designs (watercolor florals, wax seals, ribbons, lace, kraft envelopes, Art Deco and more).
Now design the shop's listing image system: square 1:1 Etsy listing images that make the shop look like a top-selling, premium design studio. Contemporary, bold and confident typography from the BKE Studio brand board (reference image), lots of air, strong hierarchy, one clear message per image, readable as a small thumbnail on a phone. The same grid, margins, type styles and colors on every image so the whole shop looks consistent. The design's own photo scene or decor appears on each image, framed by the brand system; the brand never competes with the design.
Every phone or laptop screen in these layouts is a perfectly flat, opaque pure green (#00FF00) area with all four corners visible; we put the real screens there afterwards.
Use only the exact text given in each prompt, spelled exactly. No other words, no fake UI text, no prices, no QR codes, no web addresses.
```

---

## LC — Yerleşim ve tipografi comp'ları (1024×1024, opak; yalnız referans, satılmaz)

### LC1 Kapak
**Kaydet:** `brand/listing/comps/lc1_cover.png` · 1024×1024 · 1 ekran

```
Listing image 1, the cover. A photographic styled scene fills the image: a hand holding a phone with a flat pure green (#00FF00) screen, romantic florals softly out of focus behind it. Over the calm upper part of the image, in the BKE Studio brand typography: a large bold headline "Wedding Website", a smaller line "Opens like a real invitation", and a row of three small pill labels "Edit on your phone", "Online RSVP", "Instant access". A small "BKE Studio" wordmark in a corner. Strong, bold hierarchy that is readable at thumbnail size. Use only this text.
```
Kontrol: metin harf harf; tek yeşil ekran; başlık küçük resimde okunur; marka köşede küçük.

### LC2 Sayfalar
**Kaydet:** `brand/listing/comps/lc2_pages.png` · 1024×1024 · 4 ekran

```
Listing image 2. Headline "Every page your guests need". Below it four phones in a row, slightly fanned, each screen flat pure green (#00FF00), not overlapping, each with a small caption under it: "Envelope", "Home", "Details", "RSVP". The design's decor or soft photographic background behind the phones, framed by the brand system. Small "BKE Studio" wordmark. Use only this text.
```
Kontrol: tam 4 yeşil ekran, üst üste binmiyor; 4 alt yazı harf harf; başlık okunur.

### LC3 Nasıl çalışır
**Kaydet:** `brand/listing/comps/lc3_how.png` · 1024×1024

```
Listing image 3. Headline "How it works". Four numbered steps in a clear, bold layout with large numerals 1 to 4 and short labels: "1 Buy this design", "2 Open your start link", "3 Edit on your phone", "4 Publish and share". Brand colors and typography, generous space, a subtle decorative element from the brand (fold lines or the seal), no phones. Small "BKE Studio" wordmark. Use only this text.
```
Kontrol: metin harf harf; 4 adım net; telefon yok.

### LC4 Telefonda düzenleme
**Kaydet:** `brand/listing/comps/lc4_editor.png` · 1024×1024 · 1 ekran

```
Listing image 4. Headline "Edit everything from your phone". One large phone on the right with a flat pure green (#00FF00) screen, held in a hand in a cozy lifestyle photo. On the left four short callouts with thin connector lines toward the phone: "Names and date", "Photos", "Schedule and venue", "Your RSVP questions". Small "BKE Studio" wordmark. Use only this text.
```
Kontrol: tek yeşil ekran; 4 açıklama harf harf; çizgiler telefona doğru.

### LC5 RSVP
**Kaydet:** `brand/listing/comps/lc5_rsvp.png` · 1024×1024 · 2 ekran

```
Listing image 5. Headline "RSVPs in one place". Two phones side by side with flat pure green (#00FF00) screens, not overlapping; small captions under them: "Guests reply", "You see every answer". A short line below: "Download your guest list anytime". Small "BKE Studio" wordmark. Use only this text.
```
Kontrol: tam 2 yeşil ekran; metin harf harf.

### LC6 Neler dahil
**Kaydet:** `brand/listing/comps/lc6_included.png` · 1024×1024

```
Listing image 6. Headline "What's included". A clean grid of eight items, each a simple line icon in the brand style above a short label: "Envelope opening", "Edit on your phone", "Online RSVP", "Add to calendar", "Share your link", "Photo gallery", "Questions and answers", "Day schedule". Brand colors, bold and airy, no phones. Small "BKE Studio" wordmark. Use only this text.
```
Kontrol: 8 öğe; etiketler harf harf; ikonlar aynı çizgi stilinde.

### LC7 Canlı demo
**Kaydet:** `brand/listing/comps/lc7_demo.png` · 1024×1024 · 1 ekran

```
Listing image 7. Headline "Try the live demo". A phone with a flat pure green (#00FF00) screen in a styled photo scene, and a short line: "Open the demo link in the description". No QR code and no web address anywhere. Small "BKE Studio" wordmark. Use only this text.
```
Kontrol: QR ve web adresi yok; metin harf harf; tek yeşil ekran.

---

## LI — Özellik ikonları (1024×1024, şeffaf, tek renk)

Her ikon: LC6'daki çizgi stiliyle aynı; tek düz renk (marka ana rengi); ortada, tuvalin ~%60'ı; yazı yok.

```
A single line icon in the BKE Studio brand style (same stroke weight, corners and style as the icons in the reference image), one flat solid color (the brand anchor color), centered, about 60% of the canvas, generous empty margin. No text, letters or numbers. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard). The icon shows: {SUBJECT}
```
Yukarıdaki prompt'ta `{SUBJECT}` yerine sırayla:

### LI1
**Kaydet:** `brand/listing/icons/envelope_open.png` · 1024×1024 · **Şeffaf zemin**
SUBJECT: `an envelope with its flap open and a card rising out of it`
### LI2
**Kaydet:** `brand/listing/icons/phone_edit.png` · 1024×1024 · **Şeffaf zemin**
SUBJECT: `a smartphone with a small pencil touching its side`
### LI3
**Kaydet:** `brand/listing/icons/rsvp.png` · 1024×1024 · **Şeffaf zemin**
SUBJECT: `a reply card with a check mark`
### LI4
**Kaydet:** `brand/listing/icons/calendar.png` · 1024×1024 · **Şeffaf zemin**
SUBJECT: `a calendar page with a small plus sign`
### LI5
**Kaydet:** `brand/listing/icons/share.png` · 1024×1024 · **Şeffaf zemin**
SUBJECT: `a share symbol of three connected dots`
### LI6
**Kaydet:** `brand/listing/icons/photos.png` · 1024×1024 · **Şeffaf zemin**
SUBJECT: `two overlapping photo frames with a small mountain and sun`
### LI7
**Kaydet:** `brand/listing/icons/questions.png` · 1024×1024 · **Şeffaf zemin**
SUBJECT: `a speech bubble with a question mark`
### LI8
**Kaydet:** `brand/listing/icons/schedule.png` · 1024×1024 · **Şeffaf zemin**
SUBJECT: `a clock face next to a short list of three lines`

Kontrol (ikonlar): 8'i aynı çizgi kalınlığı ve stilde; tek renk; gerçek alfa; yazı/harf yok (soru işareti ikonun kendisi).
