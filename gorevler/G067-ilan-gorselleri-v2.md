---
id: G067
baslik: İlan görselleri v2 — kısım 1 (01, 03): GM03 düzeni + GPT sahneleri + gerçek misafir ekranları (kapak, sayfalar, nasıl çalışır, canlı demo)
rol: claude-kod
durum: alindi
alan: claude-ilan2
oncelik: 1
bagimli: [G801, G803, GM02]
yazar: [tools/listing_v2/, tools/tests/test_listing_v2.py, collections/01_Olive_Ivory/package/listing_v2/, collections/03_Blush_Garden_Rose/package/listing_v2/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel". GPT tasarladı: ortak düzen GM03
(`brand/listing/comps/lc1–lc7`, kısım 1 bitti) ve tasarıma özel fotoğraf sahneleri (`collections/<NN>/assets/gpt/mockups/`,
G801/G803). Bu görev v2 görsellerin **ilk dördünü** kurar; panel ekranı isteyenler (LC4 düzenleme, LC5 RSVP) panel v2 (G060)
bitince G065'te. Eski G059 kiti (`package/listing/`) dokunulmaz; v2 ayrı klasörde, kullanıcı onayından sonra G065 birleştirir.

## Yapılacaklar
1. Gerçek misafir ekranları: yerel production build + seed (01 olive-ivory, 03 blush-garden-rose), 390×844 @3x: zarf sayfası,
   home, details, rsvp, story (G059 `capture.ts`'ten yararlan, kopyalama yerine içe aktar ya da çağır).
2. Yeşil ekrana yerleştirme: `tools/mockup_compose.py` (homografi). **Çok ekran:** her yeşil bölge ayrı ekran, soldan sağa
   sıralı; yuvarlak köşe maskesi, kenar yumuşatma, ekran camına çok hafif yansıma/parlaklık (abartısız). Gerekiyorsa
   `mockup_compose.py`'ye geriye uyumlu çok-bölge fonksiyonu eklenir (yazar alanı dışına taşma: yalnız yeni fonksiyon +
   test, mevcut davranış değişmez — bunu Sonuç'ta belirt).
3. Yerleşim ve tipografi GM03 comp'larından (lc1 kapak, lc2 sayfalar, lc3 nasıl çalışır, lc7 demo): HTML/CSS + Chromium
   ile 2000×2000 render. Fontlar `brand/tokens.json` önerisi (Archivo/Montserrat/DM Sans, Google Fonts; repoya font girmez).
   Logo `brand/svg/`. Zemin: tasarımın kendi sahnesi (`cover_hand`, `three_phones` …) — lc2 için 3 telefonlu sahne + 4.
   ekran yoksa sayfa sayısını 3'e indir ve metni ona göre ayarla (yalan yok: hangi sayfalar gösteriliyorsa o yazılır).
4. Metinler gerçek iddialar (docs/05 §E): kapakta "Wedding Website" · "Opens like a real invitation" · "Edit on your
   phone" · "Online RSVP" · "Instant access"; demo görselinde QR ve web adresi YOK ("Open the demo link in the description").
5. Kontrol: 300 px küçük resim ve 4:3 kırpım önizlemesi; her görsele gözle bak (taşma, kesik ekran, yanlış ekran sırası,
   yazım). `collections/<NN>/package/listing_v2/` altına 4 PNG + önizleme sayfası.
6. Basit testler (`tools/tests/test_listing_v2.py`): çok-ekran yerleştirme sırası, çıktı boyutu.

## Bitti sayılması için
- [ ] 01 ve 03 için 4'er v2 görsel (2000×2000) + küçük resim/kırpım önizlemesi; testler geçti

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): GM03 kısım 1 + G801/G803 sahneleri hazır
- 2026-10-14 alindi: claude-ilan2
