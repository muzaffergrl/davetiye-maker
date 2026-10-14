---
id: G067
baslik: İlan görselleri v2 — kısım 1 (01, 03): GM03 düzeni + GPT sahneleri + gerçek misafir ekranları (kapak, sayfalar, nasıl çalışır, canlı demo)
rol: claude-kod
durum: bitti
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
- [x] 01 ve 03 için 4'er v2 görsel (2000×2000) + küçük resim/kırpım önizlemesi; testler geçti

## Sonuç
- **Çıktı:** `collections/01_Olive_Ivory/package/listing_v2/` ve `collections/03_Blush_Garden_Rose/package/listing_v2/` →
  `01_cover.png` (LC1), `02_pages.png` (LC2), `03_how.png` (LC3), `07_demo.png` (LC7), hepsi 2000×2000, + `preview_thumbs.png`
  (her görsel 300 px ve 4:3 orta kırpım). Eski `package/listing/` ve `tools/listing_kit.py` dokunulmadı.
- **Kod:** `tools/listing_v2/build.py` (tek giriş: capture → compose → render → preview → check), `capture.ts` (G059
  `capture.ts` gibi platformun kendi `scripts/lib` yardımcılarını içe aktarır; yerel production build + seed, canlıya bir şey
  gitmez), `kompozit.py` (ölçek, kenar uzatma, ekran yerleştirme), `render.py` (Chromium; fontlar Google Fonts'tan geçici
  klasöre, repoya font girmedi), `templates/` (4 görsel + önizleme HTML/CSS). Önbellek `tools/listing_v2/.cache/` git dışı.
- **mockup_compose.py (yazar alanı dışı, izinli istisna):** yalnız iki yeni fonksiyon eklendi — `yesil_bolgeler` (≥%1 bütün
  yeşil bölgeler, soldan sağa) ve `birlestir_cok` (her bölgeye sıradaki tasarım; içeride mevcut `birlestir`i çağırır). Mevcut
  fonksiyonlarda satır değişmedi; `test_mockup_compose.py` geçti, tek bölgede `birlestir_cok` = `birlestir` (piksel eşit, test).
- **Ekranlar:** gerçek misafir ekranları, 390 CSS px @3x; yükseklik her yeşil ekranın biçiminden (804–875 px), böylece ekran
  kırpılmadan/ezilmeden oturur. Kapak = kapalı zarf, LC2 = Home · Details · RSVP (GPT sahnesinde 3 telefon var; yalnız gösterilen
  3 sayfa yazıldı), LC7 = Our Story. Demo içerik kurgu (Avery & Jordan, Clara & Julian).
- **Zemin:** LC1 `cover_hand`, LC2 `three_phones`, LC7 `flatlay_phone` (1,7× büyütülüp sola dayalı; doku uydurulmadı), LC3
  sitenin kendi sayfa zemini (`parts/bg_page.png` / `bg_scene.png` kare kırpım; süsler GPT'nin). LC1/LC2'de başlık payı için
  sahnenin üst kenarı kendi duvarının aynası + artan bulanıklıkla uzatıldı (1:1'de dikiş görünmüyor). Şekil/süs/ikon çizilmedi;
  yalnız hap, kart, rakam rozeti zemini (CSS) ve marka SVG logosu.
- **Kontrol edildi:** 8 görselin hepsine tam boyda ve 300 px'te bakıldı; 20 ekran köşesi 2× büyütmede (yeşil saçak yok,
  ekran çerçevenin içinde, yuvarlak köşe yeşil bölgeden); otomatik `check`: ölçü, yeşil piksel 0, metin harf harf, satır sayısı,
  hiçbir yazı ekranın/çerçevenin üstünde değil, kenar payı; kapak başlığı 4:3 kırpımın içinde. `test_listing_v2.py` (çok ekran
  sırası, çıktı ölçüsü vb.) geçti. QR ve web adresi hiçbir görselde yok.
- **Açık / denenmedi:** Etsy'ye yüklenmedi; Etsy'nin gerçek küçük resim kırpımı denenmedi (önizleme 4:3 orta kırpım varsayımı).
  LC2'nin 4:3 kırpımında başlığın ilk satırı kesiliyor (yalnız kapak aramada görünür). `brand/listing/icons/` main'de yoktu:
  haplarda ve LC3 kartlarında ikon yok (yalnız rakam); ikonlar gelince eklenebilir. LC7'de comp'taki "üstte başlık" yerine
  masa üstü sahnesinin boş sol üçte birine yerleşim seçildi (kapakla aynı sahneyi tekrar etmemek için). Montserrat 300 marka
  token'ı; comp'taki alt satırda tek katlı "a" var (Jost/Urbanist'e daha yakın) — bilinçli olarak marka fontu korundu.

## Günlük
- 2026-10-14 açıldı (entegratör): GM03 kısım 1 + G801/G803 sahneleri hazır
- 2026-10-14 alindi: claude-ilan2
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör onayladı
