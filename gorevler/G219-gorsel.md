---
id: G219
baslik: Tasarım 19 Midnight Garden — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-K
oncelik: 2
bagimli: []
yazar: [collections/19_Midnight_Garden/assets/gpt/comps/, collections/19_Midnight_Garden/assets/gpt/parts/, collections/19_Midnight_Garden/assets/gpt/photos/]
---

## Amaç
Tasarım 19'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the silver seal cracks and falls away, the black flap opens slowly, warm golden candlelight spills out from inside, and the card rises out of the darkness into the glow.

## Girdiler
- `collections/19_Midnight_Garden/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/19_Midnight_Garden/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/19_Midnight_Garden/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/19_Midnight_Garden --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
- Kısım 1 üretimi tamamlandı (gpt-gorsel-K): W1'in 5 ekranı `comps/web_1_envelope.png`–`web_5_rsvp.png` ve W2'nin `parts/bg_page.png`, `parts/bg_tile.png`, `parts/envelope_closed.png` dosyaları doğru Kaydet yollarında hazır (8 seçilen görsel). Ek rapor/önizleme dosyası oluşturulmadı.
- W1.1 iki kez yeniden üretildi: zarf oranı/boyutu ve gümüş mührün nötr metal tonu iyileştirildi. W1.2 bir kez yeniden üretildi: yatay çıkan foto penceresi dikey 3:4 pencereye düzeltildi. Repoda yalnız seçilen sade adlı dosyalar tutuldu.
- W1 görsel kontrolleri ve `kit_check` içindeki mevcut W1 dosya denetimleri geçti (5/5); yeşil foto pencereleri, alt menüler ve istenen demo alanları mevcut. Bunlar yalnız tasarım referansıdır.
- W2'nin üç parçası W1 görselleri referans verilerek üretildi. Arka planlar opak ve yazısız; kapalı zarf tek nesne, mühür/kapanış ve yazı yok, sol üstten ışık, dış gölge yok, kesilecek V kapak kenarı okunuyor; PNG gerçek alfa kanallı. `envelope_closed` üç kez yeniden üretildi: tuvaldeki ölçek/konum ve zarf oranı için; repoya yalnız seçilen son dosya kondu.
- Ölçüler: W1, `bg_page` ve `envelope_closed` 1024×1536; `bg_tile` 1254×1254 (istenen kare oran korunuyor; doğrulayıcı oran denetimini geçti). `bg_tile` RGB standart sapması yaklaşık 2,27/255; karşı kenar şeritlerinin ortalama kanal farkı en çok 1,27/255, nesne/yazı ve belirgin vinyet yok. Kesin piksel eşitliği değil, düşük kontrastlı görsel dikiş denetimi yapıldı.
- Zarf geometri notu: alfa >128 gövde kutusu `(68, 719)–(957, 1287)`; genişlik %86,82, alt kenar %83,79, gövde oranı yaklaşık 1,565:1. Prompt'taki yaklaşık %80 / %88 / 5:4 değerleri tam yakalanmadı; sonraki `envelope_open` üretiminde bu gerçek `envelope_closed.png` referans alınmalı ve değişmeyen gövde üst üste denetlenmeli. Alfa kenar denetimi geçti; nesne dışında çok düşük alfa kalıntıları bulunabildiğinden bütünüyle piksel düzeyinde temiz dış alfa iddiası yok.
- `python3 tools/kit_check.py collections/19_Midnight_Garden --paket 5`: mevcut 8 dosyanın tamamı GEÇTİ (8/22); kalan 14 W2 dosyası bu oturum kapsamı dışında olduğu için eksik. `--paket 2`: 0/5, fotoğraflar bu oturumda üretilmedi. `envelope_open` olmadığı için zarf hizası denetimi atlandı; tam paket bitti/inceleme olarak işaretlenmedi.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-K; bu oturum: kısım 1 (W1 5 ekran + W2 bg_page, bg_tile, envelope_closed).
- 2026-10-14 ara kayıt: W1 tamamlandı (5/5); gpt-gorsel-K.
- 2026-10-14 ara kayıt: kısım 1 görselleri tamamlandı (8/8); W2 bg_page, bg_tile, envelope_closed; gpt-gorsel-K.
- 2026-10-14 kısım 1 bitti; kalan: W2'nin diğer parçaları + PAKET 2
- 2026-10-14 entegratör ara kontrol: kısım 1 (8 görsel) kit_check geçti, görsel olarak iyi (siyah zarf ~1,57:1). Kısım 2 verildi.
- 2026-10-14 devam: gpt-gorsel-K (kısım 2)
- 2026-10-14 ara kayıt: gpt-gorsel-K (kısım 2, 4/8); closure, envelope_open, card_small, invitation_card üretildi. Kullanıcının bu oturumdaki talebiyle closure 1024×1536 zarf tuvalinde (prompt'taki kare yerine); bu ölçüyle dosya denetimi 4/4 geçti. Zarf hizası GEÇTİ: sol +%0,00, sağ -%0,10, alt +%0,13. Yeşil pencere denetimi geçti; yalnız ton için yeniden üretim/piksel boyama yapılmadı.
