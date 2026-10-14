---
id: G065
baslik: İlan kiti yenileme (01, 03) — GPT sahneleri + ortak şablon (GM03) üstüne gerçek ekranlar, panel v2, BKE Studio, QR'sız demo
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G060, GM02, GM03, G801, G803]
yazar: [tools/listing_kit.py, tools/listing_templates/, collections/01_Olive_Ivory/package/, collections/03_Blush_Garden_Rose/package/, docs/05_SET_PAKETI.md]
---

## Amaç
G059 kiti onaylandı; üç değişiklik birikti, bir kerede yeniden üretilir:
1. **Panel v2 (G060)** yayına girince START HERE adımları ve ilan görsellerindeki panel ekranları eskidi → `listing_kit.py capture` + `all`.
2. **Marka (K26, GM02):** `[SHOP NAME]` → "BKE Studio" (kullanıcı adı kesin onaylayınca), logo/renk kitin kapak ve PDF'lerine.
3. **Etsy dışına QR yok (docs/15 §1, Off-Platform):** 8. görseldeki canlı demo QR'ı kaldırılır; yerine QR'sız, URL'siz "canlı
   demo açıklamada" görseli. START HERE'deki **teslim** QR'ı (/start) kalır.
4. Canva dönemi şablonları (`tools/listing_templates/{whats_included,how_it_works,edit_in_canva}.html`) kaldırılır ya da
   platform metnine çevrilir (`mockup_compose.py render` kullanıyorsa birlikte).

5. **GPT tasarımı (kullanıcı, 2026-10-14: "çok daha etkileyici, çok daha profesyonel"):** ilan görselleri artık GM03 comp'larının
   yerleşim ve tipografisiyle kurulur; fotoğraf zemini tasarımın PAKET 3 sahneleri (G801/G803: `cover_hand`, `three_phones`,
   `laptop_phone`, `flatlay_phone`, `hand_phone_edit`). Gerçek ekranlar yeşil alanlara perspektifle (`mockup_compose.birlestir`
   — **çok ekranlı sahne** desteği eklenecek: her yeşil bölge ayrı ekran, soldan sağa sıra), ekran camı için hafif yansıma/kenar
   yumuşatma. İkonlar GM03 LI. Yazılar HTML/CSS ile, Google Fonts (OFL) marka eşleşmesi (GM02), font dosyası repoya girmez.
   Comp metni değil, ürünün gerçek iddiaları yazılır (docs/05 §E). Görseller 300 px küçük resimde ve 4:3 kırpımda denenir.

## Bitti sayılması için
- [ ] `listing_kit.py check` 0 sorun; görseller, PDF'ler ve video yeniden üretildi ve gözle bakıldı
- [ ] İlan görsellerinde QR yok; START HERE teslim QR'ı çözülüyor
- [ ] Ticari alanlar yalnız kullanıcının verdiği değerlerle; kalanlar yer tutucu

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G059 onayı sonrası birikenler
- 2026-10-14 entegratör (G080 Sonuç): 01/03 START_HERE.md hâlâ "Refresh" ve "Download all replies (CSV)" diyor → K29 paneline göre (3 adım, 6 sayfa, Unpublished changes şeridi, Download list, şifre, teşekkür modu) yeniden yazılmalı; tools/listing_templates/capture.ts eski panel seçicilerini kullanıyor → güncellenmeli. Kalan v2 ilan görselleri (editör, RSVP, dahil olanlar) yeni panelden çekilir.
- 2026-10-14 entegratör: G068 ile 01/03'te neredeyse her başlık/etiket panelden değişiyor (meta ve aria hariç) → ilan metni ve START_HERE bunu dürüstçe söyleyebilir ("almost every heading and label"); 05 için G081 sonrası.
