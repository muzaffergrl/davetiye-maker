# GM06 — Dükkân geneli güven ve albeni sahneleri (K32, 2026-10-15)

> **Instructions for GPT:** Generate these images in ONE chat, in order. Use each English prompt exactly, follow its
> checklist and save each file with the exact path under "Kaydet". No text, letters, numbers, logos or watermarks
> anywhere. Every phone/tablet/laptop screen and every "QR" area is a flat pure green #00FF00 rectangle (Claude
> places the real screens and an algorithmically generated QR code there). Fictional people only, never resembling a
> real person; hands and fingers anatomically correct.

Amaç: her ilanda ortak kullanılacak, "kolayca düzenlerim, misafirlerim kolayca kullanır" güvenini veren sahneler.
Tasarım sahneleri (Paket 3, G801–G820) zaten her tasarım için var; bunlar **tasarımdan bağımsız** ortak sahneler.
Repo `muzaffergrl/davetiye-maker`, dal `main`, klasör `brand/trust/`, commit `GM06: güven sahneleri`.
Stil: BKE Studio paleti (koyu patlıcan #2B1526, şampanya altını #D0AE6A, kâğıt #EDE5D7, lavanta #9F84A7) yumuşak
aksan olarak; aydınlık, sıcak, doğal ışık, premium ama samimi; gerçek fotoğraf gerçekliği.

### T1 — 3 adım (başlat · düzenle · paylaş)
**Kaydet:** `brand/trust/t1_three_steps.png` · 2000×2000
```
Overhead photograph of three identical modern smartphones lying side by side in a neat row on soft warm-white linen, evenly spaced with generous space between them, each phone's entire screen a flat pure green #00FF00 rectangle with no reflections. A few small elegant wedding details around the edges only: a sprig of dried flowers, a champagne-gold ribbon, a pale lavender envelope corner. Soft natural window light from the top-left, very soft shadows, premium editorial product photography. The phones are perfectly parallel and fully visible, not cropped. No text, no logos, no hands.
```
Kontrol: 3 telefon tam görünür, ekranlar düz yeşil ve yansımasız; ekranlar arası eşit boşluk; yazı/logo yok.

### T2 — Misafir telefondan cevap veriyor
**Kaydet:** `brand/trust/t2_guest_rsvp.png` · 2000×2000
```
Lifestyle photograph of a fictional woman in her sixties (not resembling any real person), smiling warmly, sitting at a sunny kitchen table with a cup of tea, holding a smartphone in one hand and looking at it; the phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large in the frame and fully visible. Natural relaxed pose, correct hands and fingers, warm natural light, soft background with a vase of garden flowers. True-to-life colors, premium editorial look. No text, no logos.
```
Kontrol: ekran kameraya dönük, tam görünür, düz yeşil; eller/parmaklar düzgün; gerçek birine benzemiyor; yazı yok.

### T3 — Çift kanepede birlikte düzenliyor
**Kaydet:** `brand/trust/t3_couple_editing.png` · 2000×2000
```
Lifestyle photograph of a fictional engaged couple in their late twenties (not resembling any real persons) sitting close together on a cozy sofa in a bright living room, both looking happily at one smartphone she holds; the phone's entire screen is a flat pure green #00FF00 rectangle angled toward the camera, clearly visible and not covered by fingers. Natural candid moment, correct hands and fingers, soft afternoon light, a cushion and a throw blanket in warm neutral tones. True-to-life colors, premium editorial look. No text, no logos.
```
Kontrol: ekran görünür ve parmaksız; çift doğal; yazı yok.

### T4 — Telefon, tablet, dizüstü (her cihazda çalışır)
**Kaydet:** `brand/trust/t4_any_device.png` · 2000×2000
```
Product photograph of a laptop, a tablet and a smartphone arranged together on a light oak desk, all facing the camera at a slight angle, each device's entire screen a flat pure green #00FF00 rectangle with no reflections. Minimal styling: a small vase with a single garden rose and a folded linen napkin in warm ivory. Soft daylight from the left, clean and airy, premium product photography, all three devices fully visible and not cropped. No text, no logos, no brand marks on the devices.
```
Kontrol: üç cihaz tam görünür; markasız; ekranlar düz yeşil; yazı yok.

### T5 — QR ile paylaşım (masa kartı)
**Kaydet:** `brand/trust/t5_share_qr.png` · 2000×2000
```
Close-up photograph of an elegant blank ivory table card standing on a reception table set with linen, candles and soft flowers; in the center of the card there is one flat pure green #00FF00 square (about 35% of the card width) with a thin empty margin around it, and the rest of the card is completely blank. Beside the card lies a smartphone whose entire screen is a flat pure green #00FF00 rectangle. Warm evening candlelight, shallow depth of field, premium wedding photography. No text, no letters, no numbers, no pattern inside the green areas.
```
Kontrol: yeşil kare düz ve kenarları net (QR için); kartın geri kalanı boş; telefon ekranı düz yeşil; yazı yok.

### T6 — Dükkân "Hakkında" ruh hâli (insansız)
**Kaydet:** `brand/trust/t6_atelier_flatlay.png` · 3000×2000
```
Overhead flat-lay photograph of a calm designer's desk: an open sketchbook with soft watercolor swatches in champagne gold, aubergine and lavender (abstract color patches only, no drawings of text), a few wax seals, silk ribbons, dried flowers, a fountain pen and a closed laptop, all arranged with generous empty space on warm paper-textured background. Soft natural light from the top-left, premium editorial styling. No people, no hands, no text, no letters, no logos.
```
Kontrol: insan yok; yazı/harf yok; sakin ve boşluklu.

## Kullanım (Claude, sonra)
Yeşil alanlara gerçek ekranlar (`/start`, panel, canlı site, RSVP) ve `tools/make_qr.py` ile gerçek QR yerleştirilir;
ilan görsellerinde (GM03 şablonu) ve satış sitesinde kullanılır. Gerçek olmayan yorum, rozet, "best seller" vb. iddia eklenmez.
