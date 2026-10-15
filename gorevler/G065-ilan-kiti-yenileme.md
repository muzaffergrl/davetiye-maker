---
id: G065
baslik: İlan kiti yenileme (01, 03) — GPT sahneleri + ortak şablon (GM03) üstüne gerçek ekranlar, panel v2, BKE Studio, QR'sız demo
rol: claude-kod
durum: inceleme
alan: claude-G065
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
- [x] `listing_kit.py check` 0 sorun; görseller, PDF'ler ve video yeniden üretildi ve gözle bakıldı
- [x] İlan görsellerinde QR yok; START HERE teslim QR'ı çözülüyor
- [x] Ticari alanlar yalnız kullanıcının verdiği değerlerle; kalanlar yer tutucu

## Sonuç
2026-10-15 (claude-G065, dal `claude/g065-ilan`):
- **7 ilan görseli, GM03 düzeni, BKE Studio** (01 ve 03): `tools/listing_templates/gm03/` — `build.py` G067'nin
  `tools/listing_v2/build.py`'sini (kapak, sayfalar, how it works, demo) içe aktarıp çalıştırır, LC4 editör / LC5 RSVP / LC6
  what's included'ı kendisi kurar (`editor.html`, `rsvp.html`, `included.html`); `capture.ts` panel v2'den gerçek ekran çeker
  (hash görünümleri `#edit`, `#guests`; 5 kurgu yanıt + "Meal choice"). Denetim: ölçü, yeşil kalıntı, birebir metin, yazı
  ekrana binmez, yeni: yazılar/logo birbirine binmez. Çıktı `package/listing_v2/` + `package/listing/images/01..07`.
  **QR ve web adresi hiçbir görselde yok**; 07 "Open the demo link in the description".
- `tools/listing_kit.py`: `images` adımı gm03/build.py'yi çalıştırır; `strips` adımı ve demo QR (8. görsel, `demo_qr.*`)
  kaldırıldı; `check` 7 dosyayı birebir ve `package/listing/` altında `*qr*` olmamasını denetler; metin `listing_v3.md`'den okunur.
- `tools/listing_templates/capture.ts`: panel v2'de kırılan alıcı/panel bölümü (b01–b10, p01–p03) çıkarıldı; misafir ekranları,
  demo ve açılış kaydı kalır (iki temada çekildi, geçti). Eski `platform/01..08*.html` silindi (`video_bg.html`, `kit.css` kalır).
- Canva dönemi şablonları (`whats_included`, `how_it_works`, `edit_in_canva`) platform metnine çevrildi (dosya adları
  `mockup_compose.py` için korunur; `[VERIFY]` kalmadı). test_mockup_compose geçti.
- `listing_v3.md` (01, 03): §5 7 görsel + "Text on the image" + alt metin; açıklamaya `TRY THE LIVE DEMO` (demo linki, düz metin
  `[VERIFY: Etsy shows the address as plain text]`); §0/§11 8. görsel/QR satırları güncellendi. `docs/05` B1/B2, capture/images, check.
- Yeniden üretildi: video.mp4 (13.6 / 14.0 s), `listing_<tema>.pdf`. START_HERE.md/.pdf G091'deki gibi (değişmedi).
- Testler: test_listing_kit (yeni `test_gm03_set`, eski strip testi çıktı), test_listing_v2, test_kit_check, test_md_to_pdf,
  test_mockup_compose geçti; `listing_kit.py check --theme all` 0 sorun (yalnız vercel.app uyarısı).

**Entegratöre not:**
- `tools/tests/test_listing_kit.py` yazar yolu dışında ama değişen aracın testi olduğu için güncellendi.
- G067 aracı bu ortamda kendi başına duruyor: Google Fonts Montserrat 300/400'ü ayrı yüz veriyor, şablon 400 kullanmadığı için
  `render.ciz` "yüklenemeyen font: Montserrat" diyor. gm03/build.py bunu kendi sürecinde görünmez bir öğeyle çözüyor
  (`_font_css_yuklu`); `tools/listing_v2/render.py`'de kalıcı düzeltme önerilir (yazar yolu dışı, dokunulmadı).
  Aynı nedenle md_to_pdf "yüklenemeyen fontlar" uyarısı yanlış alarm (pdffonts: fontlar gömülü).
- `shots/` içindeki eski b*/p* ekranları silinmedi: `platform/lib/marketing/designs.ts` (satış sitesi) hâlâ kullanıyor; artık
  `capture` onları yenilemiyor. Satış sitesinin panel görselleri gm03/capture.ts ile yenilenmeli (ayrı görev).
- Denenmedi: gerçek telefonda görsellerin görünümü, Etsy ilan düzenleyicisine yükleme.

## Günlük
- 2026-10-14 açıldı (entegratör): G059 onayı sonrası birikenler
- 2026-10-14 entegratör (G080 Sonuç): 01/03 START_HERE.md hâlâ "Refresh" ve "Download all replies (CSV)" diyor → K29 paneline göre (3 adım, 6 sayfa, Unpublished changes şeridi, Download list, şifre, teşekkür modu) yeniden yazılmalı; tools/listing_templates/capture.ts eski panel seçicilerini kullanıyor → güncellenmeli. Kalan v2 ilan görselleri (editör, RSVP, dahil olanlar) yeni panelden çekilir.
- 2026-10-14 entegratör: G068 ile 01/03'te neredeyse her başlık/etiket panelden değişiyor (meta ve aria hariç) → ilan metni ve START_HERE bunu dürüstçe söyleyebilir ("almost every heading and label"); 05 için G081 sonrası.
- 2026-10-15 alindi: claude-G065
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 not: main'de aynı gün `claude-local-G065` de "alindi" yazdı (4e32871; main'de G065 iş commit'i yok). İş bu dalda bitti; çift alım entegratörce kapatılmalı.
