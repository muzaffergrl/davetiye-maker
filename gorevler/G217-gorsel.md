---
id: G217
baslik: Tasarım 17 Emerald & Gold Estate — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-I
oncelik: 2
bagimli: []
yazar: [collections/17_Emerald_Gold_Estate/assets/gpt/comps/, collections/17_Emerald_Gold_Estate/assets/gpt/parts/, collections/17_Emerald_Gold_Estate/assets/gpt/photos/]
---

## Amaç
Tasarım 17'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the gold seal lifts away with a glint, the emerald flap opens upward, thin gold botanical lines draw themselves across the screen, and the marble card rises from the pocket.

## Girdiler
- `collections/17_Emerald_Gold_Estate/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/17_Emerald_Gold_Estate/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/17_Emerald_Gold_Estate/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/17_Emerald_Gold_Estate --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
- Kısım 1 devam ediyor (gpt-gorsel-I): W1'in 5 ekranı `assets/gpt/comps/web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png` yollarına kaydedildi; hepsi 1024×1536 PNG.
- W1.1 zarf gövdesi fazla geniş olduğu için üç kez yeniden üretildi; daha yüksek gövdeli son tasarım seçildi. W1.3 kalın çerçeveler ince altın metal çerçevelere dönüştürülerek bir kez yeniden üretildi. Yalnız seçilen beş dosya repoya kondu.
- W1 görsel kontrolü: telefon donanımı/çubuğu yok; home'da kart, geri sayım ve RSVP; story'de birbirini kesmeyen üç çerçeve; details'ta üç program satırı ve yatay mekân penceresi; RSVP'de kart içindeki buton ve aynı yaprak bordürlü mühür mevcut. PNG dosyaları açılarak ölçüleri doğrulandı.
- Sıradaki bu oturum kapsamı: W2 `bg_page.png`, `bg_tile.png`, `envelope_closed.png`; diğer W2 parçaları ve PAKET 2 sonraki oturuma kalacak. Durum `alindi`.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-I; bu oturum: kısım 1, W1'in 5 ekranı + W2 bg_page, bg_tile, envelope_closed (8 görsel).
- 2026-10-14 ara kayıt: gpt-gorsel-I; W1 tamamlandı (5/5 ekran), W2'nin ilk 3 parçası sırada.
