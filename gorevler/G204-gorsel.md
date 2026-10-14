---
id: G204
baslik: Tasarım 04 Vintage Airmail Love Letter — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: bitti
alan: codex-gpt-gorsel
oncelik: 1
bagimli: []
yazar: [collections/04_Vintage_Airmail/assets/gpt/comps/, collections/04_Vintage_Airmail/assets/gpt/parts/, collections/04_Vintage_Airmail/assets/gpt/photos/]
---

## Amaç
Tasarım 04'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 18 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the little wax seal pops off, the perforated tear strip rips away along the top edge from left to right, and the cream letter card slides up out of the envelope while a pressed flower flutters down.

## Girdiler
- `collections/04_Vintage_Airmail/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/04_Vintage_Airmail/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/04_Vintage_Airmail/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/04_Vintage_Airmail --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [x] PAKET 5: 5 comp + 18 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [x] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [x] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
2026-10-14 · codex-gpt-gorsel · **incelemeye hazır; aşağıdaki görsel kusurlar hâlâ açık.**

- Aynı sohbette imagegen ile sırayla W1'in 5 ekranı, W1 görsellerini referans alan W2'nin 18 parçası ve PAKET 2'nin 5 fotoğrafı üretildi. Kaydet satırlarındaki sade dosya adları `assets/gpt/{comps,parts,photos}/` içinde. Fotoğraflar gerçek JPEG olarak kaydedildi; hikâye fotoğrafları `hero_portrait.jpg` referansıyla aynı kurgusal çifti kullanıyor. Üretim kaydı: `parts/GENERATION_REPORT.json`.
- Kontrol: `python3 tools/kit_check.py collections/04_Vintage_Airmail --paket 5` **24/24 geçti** (23 dosya + hiza); `--paket 2` **5/5 geçti**. Alfa, kenar boşluğu, oran ve yeşil alan varlığı denetlendi. 1200×630 merkez kırpımı ayrıca görüntülendi; zarf ve mühür tam, alt boşluk yeterli. Çift, eller, tabela/yazı yokluğu görsel olarak incelendi.
- Yeniden üretilenler: `web_2_home_v2` (dikey foto penceresi), `envelope_closed_v2` (yerleşim denemesi), `envelope_open_v2` (hiza), `frame_portrait_v2/v3` ve `frame_landscape_v2/v3` (yeşil pencere opaklığı), `decor_tl_v2` (sicim ucunun kesilmesi), `web_hero_v2` (paylaşım kırpımı). Seçilenler sade adla; kapalı zarfta ilk `_v1`, açık zarfta `_v2`, çerçevelerde `_v3` seçildi. Denemeler korundu.
- **Kalan kusur:** çerçevelerin yeşil pencereleri üç imagegen denemesine rağmen merkezde kısmen şeffaf/tonlu; tam düz opak `#00FF00` koşulu sağlanmadı. Küçük kartın yeşilinde de hafif ton farkı var. `kit_check` pencerenin varlığını kontrol eder; bütünüyle düz ve opak olduğunu kanıtlamaz. Tema onayından önce bu pencereler teknik maske hazırlığında düzeltilmeli veya yeniden üretilmeli.
- **Hiza uyarısı:** kapalı/açık zarf sol %0, sağ +%0,39, alt +%1,56. Araç bunu geçer uyarı sayıyor; tema build'i düzeltme uygular. Yarı saydam üst üste önizlemede kâğıt/pul dokusu farkı da görüldü; piksel birebirliği sağlanmadı. Zarf, prompt'taki yaklaşık %80 genişlik/%88 alt konumundan daha geniş ve yukarıda; tema yerleşiminde gözden geçirilmeli.
- Kare çıktılar 1254×1254 (araç oran denetimini geçiyor); diğer oranlar Kaydet satırına uygun. `bg_tile` ve `bg_desk` için piksel düzeyinde dikişsizlik doğrulanmadı. Canlı site, zarf animasyonu, foto değişimi, RSVP veya Canva testi yapılmadı; bu görsel görev bunları teslim etmiyor.
- Önerilen takip: G404 öncesi yeşil pencerelerin tam opak maske onarımı, zarf açılış hiza/gövde farkı ve uzun sayfalardaki doku tekrarının görsel QA'sı. Yeni görev açılmadı.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: codex-gpt-gorsel
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör onayladı
- 2026-10-14 entegratör: teslim kabul edildi (kit_check 24/24 + 5/5; hiza +1.56% uyarı → tema build ölçek/öteleme ile düzeltir; çerçeve pencerelerinde yarı saydam leke → parts_prep/tema_build doldurur).
