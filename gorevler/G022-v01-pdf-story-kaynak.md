---
id: G022
baslik: A3 + A4 — 5×7 davetiye ve story/kare kaynakları
rol: claude-kod
durum: inceleme
alan: claude-kod-4
oncelik: 2
bagimli: []
yazar: [collections/02_Dusty_Blue/print/]
---

## Amaç
Baskı/telefon davetiyesi (5×7 in) ve paylaşım görselleri (1080×1920, 1080×1080) için HTML kaynakları.

## Girdiler
- `collections/02_Dusty_Blue/content.demo.json`
- `collections/02_Dusty_Blue/palette.json`
- `collections/02_Dusty_Blue/assets/layers/`
- Video master sahne 4 düzeni (`canva/TEXT_SLOTS.json`)

## Yapılacaklar
1. `print/invitation_5x7.html` (1500×2100 px, 300 dpi eşdeğeri), `print/story.html`, `print/square.html`; her biri `data-document-role="page"`.
2. RSVP/website linki için açıkça işaretli yer tutucu (gerçek URL yok).
3. Playwright ile PNG önizleme → `print/previews/`.

## Bitti sayılması için
- [ ] Metin içerik kaydıyla birebir
- [ ] Önizlemeler var

## Sonuç
**Yapıldı (claude-kod-4, 2026-10-09):**
- `collections/02_Dusty_Blue/print/invitation_5x7.html` — 1500×2100 (5×7 in @300 dpi), video sahne 4 kartının
  baskı düzeni: çift altın çerçeve, köşe botanikleri, ev sahibi satırı, tam isimler, davet cümlesi, parçalı tarih
  kutusu (SATURDAY | SEPTEMBER 18 2027 | AT 4:30 PM), mekân, "Kindly reply by August 1, 2027" + RSVP link yer tutucu.
- `print/story.html` — 1080×1920 "Save our date" story: sis zemin, köşe botanikleri, Eleanor & Theo, polaroid
  (değiştirilebilir foto), tarih kutusu, mekân, RSVP son tarihi, RSVP ONLINE düğmesi (yer tutucu), website satırı.
- `print/square.html` — 1080×1080: sis zemin, küçük fildişi kart, isimler, September 18, 2027, mekân,
  mum mühür + ayrı metin monogram E&T, RSVP satırı + link yer tutucu.
- `print/README.md` — ortak kurallar, tipografi rolleri, her düzenin koordinatları, G5NN uyarlama adımları.
- `print/previews/{invitation_5x7,story,square}.png` — native boyut (0.37 / 0.92 / 0.44 MB).

Her dosyada tek `data-document-role="page"` (iç içe yok), inline CSS, Google Fonts link'i (font dosyası yok),
görseller yalnız `../assets/layers/` göreli yolu, tüm metin gerçek HTML metni (`data-slot` ile işaretli),
RSVP/website linki `href="#"` + `data-placeholder="rsvp_url"` + yorum; gerçek URL yok.

**Test edildi:** Playwright/Chromium ile üç sayfa render edildi; fontların (Pinyon Script, Cormorant Garamond,
Montserrat) yüklendiği, kırık görsel olmadığı, metin taşması / sayfa dışına çıkma olmadığı, iç içe sayfa olmadığı
betikle denetlendi; önizlemeler gözle incelendi (kare tarih çizgisi çakışması ve Cormorant eski stil rakam "18"
düzeltildi). Metin content.demo.json ile elle karşılaştırıldı (isimler, tarih, saat, mekân, şehir, RSVP tarihi).

**Test edilmedi:** Canva statik HTML içe aktarımı (Canva bağlayıcısı bu oturumda yok; G6NN/G602 işi), PDF export
ve PDF'teki link davranışı, gerçek baskı (renk/kesim payı — 5×7'de taşma payı/bleed yok, metin ≥75 px güvenli alanda).

**Notlar / önerilen görevler:**
- `assets/layers/polaroid_frame.png` gölgesi sağ ve altta keskin dikdörtgen kesikle bitiyor (dışa aktarma kutusu
  gölgeyi kırpıyor). Story'de bu yüzden CSS çerçeve kullanıldı. Önerilen: G1 katman dışa aktarımında `.pol` pad'ini
  büyütüp polaroid_frame.png'yi yeniden üretmek (`tools/export_layers.mjs` / layers.json `pad: 50` → ~80).
- "Save our date" ve "we're getting married" şablon metinleridir (kişisel veri değil); alıcı değiştirebilir.

## Günlük
- 2026-10-09 alindi: claude-kod-4
- 2026-10-09 bitti, incelemeye gönderildi
