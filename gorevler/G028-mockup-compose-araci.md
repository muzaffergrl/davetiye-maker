---
id: G028
baslik: tools/mockup_compose.py — yeşil ekran mockup + ilan görseli şablonları
rol: claude-kod
durum: bitti
alan: claude-kod-5
oncelik: 2
bagimli: []
yazar: [tools/mockup_compose.py, tools/listing_templates/, tools/tests/]
---

## Amaç
Tasarım export'larını GPT mockup'larının yeşil (#00FF00) alanına yerleştirmek ve ilan görsellerini (What's included, How it works) palete göre üretmek. 20 tasarım ve 100 varyantta kullanılır.

## Girdiler
- `docs/05_SET_PAKETI.md` §B
- Herhangi bir kitin `assets/gpt/mockups/*.png` (yoksa test için sahte yeşil ekranlı görsel üret)
- `<kit>/palette.json`

## Yapılacaklar
1. CLI: `python3 tools/mockup_compose.py <mockup.png> <tasarım.png|jpg> <çıktı.png>`: yeşil bölgeyi bul (±40 tolerans), 4 köşeyi çıkar, perspektif dönüşümle yerleştir, kenar yumuşatma; yeşil taşmasını temizle.
2. `tools/listing_templates/`: HTML şablonları (What's included, How it works, Edit in Canva) + `render` komutu (Playwright, palette.json ile renk). Metin İngilizce, ticari iddia yok.
3. Küçük test: sahte mockup + sahte tasarım ile çıktı.

## Bitti sayılması için
- [ ] Sahte girdilerle doğru yerleşim
- [ ] Şablonlar palete göre renkleniyor

## Sonuç
**Yapıldı (claude-kod-5, 2026-10-09):**
- `tools/mockup_compose.py` (yalnız Pillow + numpy):
  `python3 tools/mockup_compose.py <mockup.png> <tasarım.png|jpg> <çıktı.png> [--mode cover|fit|stretch] [--tol 40] [--feather 1.5] [--bg #FFFFFF] [--json]`.
  #00FF00 ±tol maskesi → en büyük bağlı bölge (8-komşu, satır koşusu + union-find; küçük lekeler atlanır ve uyarılır) →
  dışbükey gövde + içe çizilen en büyük dörtgen → kenarlara TLS doğru uydurup kesiştirme (yuvarlak/kesik köşede sanal
  köşe; perspektif ve hafif dönme) → homografi + bilineer örnekleme → alfa: bölge + kenardaki yarı yeşil pikseller,
  yalnız dışa doğru feather → yeşil taşması: kısmi piksellerde zemin ayrıştırma + G kanalını max(R,B)'ye kırpma.
  RGBA mockup'ın alfa kanalı korunur. Çıkış: 0 tamam, 1 yeşil yok/girdi hatası, 2 kullanım.
- `tools/listing_templates/`: `base.css` + `whats_included.html`, `how_it_works.html`, `edit_in_canva.html` (2000×2000,
  İngilizce). Renkler CSS değişkeni; `palette.css` render sırasında palette.json'dan üretilir. Koyu paletlerde (06, 17, 19)
  de okunur (ink/mist ters). Ticari iddia yok: mağaza adı `[PLACEHOLDER: shop name]`, test edilmemiş RSVP formu `[VERIFY]`;
  demo isimler kurgu (Avery & Jordan, The Willow Grove Estate) ve "Sample names and details shown." notu var.
- Render: `python3 tools/mockup_compose.py render <palette.json> <çıktı_klasörü> [--only ...] [--shop "..."] [--no-fonts]`
  → `<ad>.png` 2000×2000. Playwright Chromium (node; NODE_PATH yoksa `npm root -g`). Fontlar (Cormorant Garamond,
  Montserrat, Pinyon Script) Python ile Google Fonts'tan geçici klasöre iner; Chromium ağa çıkmaz; repoya font girmez.
  Font/Playwright yardımcıları `tools/md_to_pdf.py` (G026) ile ortak.
- `tools/tests/test_mockup_compose.py`: sahte girdiler kodda üretilir (ikili dosya yok).

**Test edildi:** düz dikdörtgen (köşe ±1.5 px, çeyrek renkleri doğru yerde, yeşil artık 0, dışarı dokunulmadı);
perspektifli + kesik köşeli dörtgen + ayrı küçük yeşil leke (köşe ±4 px — gerçekte ±0.4 px; leke atlandı ve korunuyor;
yeşil artık 0; kenar yumuşak); fit/cover + JPG tasarım + CLI `--json`; yeşil yok → çıkış 1; `render` 3 şablon 2000×2000,
zemin ve altın palet renkleri piksellerde. Dusty Blue (02) ve Midnight Garden (19) paletleriyle elle render edilip
görsel olarak kontrol edildi (çıktılar repoya konmadı).

**Test edilmedi:** gerçek GPT mockup'ı (repoda `assets/gpt/mockups/*.png` henüz yok) — gölge/yansıma, yeşilin ışıkla
±40 dışına çıktığı durumlar; gerekirse `--tol` artırılır. Güçlü perspektifte (>~30° dönme) köşegen başlangıcı zayıflayabilir.

**Önerilen görev:** G902/G9NN'de ilk gerçek mockup ile `mockup_compose.py` çıktısının gözle kontrolü; şablonlardaki
`[VERIFY]` ve `[PLACEHOLDER]` işaretleri RSVP A/B testi ve marka kararı sonrası kaldırılmalı.

## Günlük
- 2026-10-09 alindi: claude-kod-5
- 2026-10-09 bitti, incelemeye gönderildi
- 2026-10-09 entegratör onayladı
