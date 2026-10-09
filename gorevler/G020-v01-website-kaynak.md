---
id: G020
baslik: A2 — tek sayfa responsive website HTML kaynağı
rol: claude-kod
durum: inceleme
alan: claude-kod-3
oncelik: 2
bagimli: []
yazar: [collections/02_Dusty_Blue/website/]
---

## Amaç
Canva Website'a aktarılacak tek uzun landing page'in kaynağını ve mobil testini hazırlamak.

## Girdiler
- `collections/02_Dusty_Blue/content.demo.json`
- `collections/02_Dusty_Blue/palette.json`
- `collections/02_Dusty_Blue/assets/layers/` ve (varsa) `collections/02_Dusty_Blue/kit_layers/`
- `.claude/agents/website-gelistirici.md`
- `docs/03_URUN_ICERIK_SEMASI.json`

## Yapılacaklar
1. `website/index.html` (tek dosya, CSS içinde; fontlar Google Fonts link'i — font dosyası koyma).
2. Bölümler: hero (isimler, tarih, geri sayım alanı) · Our Story (3 foto) · Details (tören/kokteyl/resepsiyon) · Travel & Stay · Registry · RSVP (Canva Form yeri — şimdilik açıkça işaretlenmiş yer tutucu blok) · FAQ.
3. Her bölüm `data-document-role="page"` ile Canva static HTML import'a uygun bir sürüm de üret: `website/canva_import.html`.
4. Gerçek URL yok; link alanları `#` ve yorumla işaretli.
5. Playwright ile 360/390/430/768/1280 px ekran görüntüleri → `website/previews/`.

## Bitti sayılması için
- [ ] Yatay kaydırma yok; 360 px'de metin taşmıyor
- [ ] İçerik kaydıyla birebir (isim, tarih, saat, mekân)

## Sonuç
**Yapıldı (claude-kod-3, 2026-10-09).** Tümü `collections/02_Dusty_Blue/website/` altında:

- `index.html` — tek uzun responsive landing page (mobil öncelikli; 640/1024 px kırılımları). Bölümler: hero (isimler, mühür + E&T, tarih, mekân, **canlı geri sayım** → `2027-09-18T20:30:00Z`, tarih geçince mesaj) · davet kartı (aileler, tam isimler, tarih kutusu, mekân, RSVP yönlendirmesi) · Our Story (3 polaroid) · Details (program + mekân + kıyafet) · Travel & Stay · Registry · RSVP (**Canva Form yer tutucusu**, veri göndermez, başarı mesajı yok) · FAQ · kapanış. CSS içinde, fontlar Google Fonts link'i, font dosyası yok.
- `canva_import.html` — 9 sabit sayfa (1366 px genişlik), her biri `data-document-role="page"`, body'nin doğrudan çocuğu, iç içe değil, JS yok; sayaç statik yer tutucu.
- `README.md` — bölüm tablosu (`data-section`/`data-field`/`data-url`/`data-optional` işaretleri), tasarım kuralları, Canva import notları ve G4NN kopyalama listesi.
- `make_previews.cjs` — Playwright önizleme + kontrol scripti (klasör argümanı alır; G4NN tekrar kullanabilir).
- `previews/website_html_{360,390,430,768,1280}px.png` + `previews/canva_import_html_pages.png` (HTML render; hepsi < 1.5 MB).

Görseller yalnız `../assets/layers/` (kodla çizilmiş katmanlar: bg_mist, botanical_tl/br, card_botanical_tl/br, wax_seal, photo_placeholder_1..3). AI/stok görsel yok. Gerçek URL yok: tüm dış linkler `href="#"` + `data-url` + HTML yorumu.

**Test edildi (HTML, Chromium/Playwright):**
- 360/390/430/768/1280 px: `scrollWidth == innerWidth` (yatay kaydırma yok); doğrudan metin içeren hiçbir öğe viewport dışına taşmıyor; tüm görseller yüklendi; Google Fonts yüklendi (ekran görüntülerinde Pinyon Script/Cormorant/Montserrat görünüyor).
- `canva_import.html`: 9 sayfa doğrudan çocuk, iç içe yok, `<script>` yok, her metin kendi sayfa sınırında.
- İçerik: `tools/validate_content.py` canonical metinlerinin hepsi (Eleanor & Theo, E&T, Saturday, September 18, 2027, 4:30/5:30/6:30 PM, Rosewood Manor, Charleston, South Carolina, The Garden Lawn/The Veranda/The Grand Hall, August 1, 2027, Black tie optional, tam isimler, host_line) iki dosyada da görünür metinde bulundu.
- Ekran görüntülerine bakılıp düzeltildi: polaroid foto oranı (height attr), mobilde kart botaniklerinin metne binmesi, mekân/kapanış satırlarının kötü kırılması, masaüstünde isimlerin tek satır olması.

- Sonradan: entegratörün ampersand kuralı (Pinyon `&` → Cormorant italik altın `.amp`) iki dosyaya da uygulandı; önizlemeler yeniden üretildi, kontroller yine geçti.

**Test edilmedi:** Canva'ya import (G021), Canva Form/RSVP veri akışı, website yayını, Canva'da canlı sayaç, gerçek telefon tarayıcıları (yalnız Chromium viewport emülasyonu), erişilebilirlik denetimi.

**Notlar / entegratöre:**
- `content.demo.json` → `optional_blocks.countdown=false`, `faq=false`; görev bu blokları istediği için pilot hepsini gösteriyor ve `data-optional` ile işaretli. Kaydın mı sitenin mi değişeceği entegratör kararı.
- Content kaydında hikâye/travel/registry metni alanı yok; bu bölümlerde `<!-- TEMPLATE COPY -->` işaretli genel şablon metni var (uydurma olgu yok).
- `canva_import.html` görselleri göreli yolla bağlı; Canva import aracı herkese açık URL isterse G021 görselleri yüklemeli veya data: URI ile gömmeli.

**G4NN için:** `README.md` → "G4NN için kopyalama listesi". Aynı bölüm sırası, aynı `data-*` işaretleri, aynı `canva_import.html` sayfa düzeni; değişen yalnız token'lar, fontlar, katman dosya adları, içerik ve sayaç UTC hedefi. Test: `NODE_PATH=/opt/node22/lib/node_modules node collections/<NN>/website/make_previews.cjs`.

## Günlük
- 2026-10-09 alindi: claude-kod-3
- 2026-10-09 bitti, incelemeye gönderildi
