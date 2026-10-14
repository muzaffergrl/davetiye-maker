---
id: G213
baslik: Tasarım 13 Enchanted Forest Storybook — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/13_Enchanted_Forest/assets/gpt/comps/, collections/13_Enchanted_Forest/assets/gpt/parts/, collections/13_Enchanted_Forest/assets/gpt/photos/]
---

## Amaç
Tasarım 13'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the brass clasp unhooks and swings away, the moss-green cover swings open to the left like a storybook, the first page turns, and the card rises from the page while tiny fireflies glow up around it.

## Girdiler
- `collections/13_Enchanted_Forest/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/13_Enchanted_Forest/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/13_Enchanted_Forest/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/13_Enchanted_Forest --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
- Kısım 1 (gpt-gorsel-C, 2026-10-14): W1'in beş referans ekranı `assets/gpt/comps/web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png` üretildi; hepsi 1024×1536.
- W1.3 yeniden üretildi: ilk taslak yatay foto pencereleri içeriyordu; seçilen sürümde üç dikey pencere var. W1.4 yeniden üretildi: ilk program kartı genişti; seçilen sürüm uzun kitap sayfası biçiminde.
- W2'nin bu oturuma ait üç parçası W1 ekranları referans verilerek üretildi: `assets/gpt/parts/bg_page.png` (1024×1536), `bg_tile.png` (1254×1254; aracın doğal kare çıktısı, kit kontrolü oranı kabul ediyor), `envelope_closed.png` (1536×1024, gerçek RGBA alfa). Kitap tokasız ve yazısız, sağ yarıda; sol yarı açılma için boş. Kenar şeridi %100 şeffaf; zemine düşen gölge/hâle alfa kanalında yok.
- W2.1 yeniden üretildi: ilk arka planda alt sol yoğun dekor vardı; seçilende sol üst ve sağ alt köşe düzeni var. W2.2 yeniden üretildi: ilk doku sarıydı ve kenar farkları daha yüksekti; seçilen düşük kontrastlı açık yosun dokusunda RGB standart sapmaları 3,10/2,99/3,17; karşı kenarların ortalama kanal farkı sol-sağ 2,37, üst-alt 2,70 (0–255). Kenarlar piksel piksel aynı değil; döşenmiş website testi yapılmadı.
- Bu oturumun sekiz dosyası `kit_check.denetle` ile kontrol edildi: 8/8 GEÇTİ (oran, opaklık/alfa ve gereken yeşil pencere alanı). Metin, nesne ve yerleşim kontrolleri görsel olarak yapıldı. `python3 tools/kit_check.py collections/13_Enchanted_Forest --paket 5`: 8/22 geçti; kalan 14 W2 dosyası kapsam dışında. `--paket 2`: 0/5, fotoğraflar kapsam dışında. Açık kitap/kapanış üretilmediği için hiza testi atlandı. Seçilen sekiz PNG dışında rapor/önizleme/deneme dosyası eklenmedi.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-C; bu oturum kısım 1: W1'in 5 ekranı + W2 bg_page, bg_tile, envelope_closed (8 görsel).
- 2026-10-14 ara kayıt: gpt-gorsel-C; W1 bitti (5/8), seçilen beş ekran kaydedildi; durum alindi.
- 2026-10-14 ara kayıt: gpt-gorsel-C; kısım 1, 8/8 (W1 + bg_page, bg_tile, envelope_closed); teknik dosya kontrolleri geçti; durum alindi.
- 2026-10-14 gpt-gorsel-C: kısım 1 bitti; kalan: W2'nin diğer parçaları + PAKET 2
- 2026-10-14 entegratör: PAKET 2 (gpt-gorsel-A) 5/5 kit_check geçti, görsel olarak iyi. Kısım 2 (gpt-gorsel-C) repoya hiç gelmedi; kısım 2 gpt-gorsel-A'ya yeniden verildi.
- 2026-10-14 devam: gpt-gorsel-A (kısım 2)
- 2026-10-14 ara kayıt: gpt-gorsel-A; kısım 2, 4/8: closure, envelope_open, card_small, invitation_card kaydedildi; dört dosya kit_check.denetle kontrolünü geçti. Açık kitap hiza kontrolü GEÇTİ (en büyük kenar farkı %0,29); durum alindi.
