---
id: G205
baslik: Tasarım 05 Mediterranean Lemon — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: inceleme
alan: codex-gpt-gorsel
oncelik: 1
bagimli: []
yazar: [collections/05_Lemon_Mediterranean/assets/gpt/comps/, collections/05_Lemon_Mediterranean/assets/gpt/parts/, collections/05_Lemon_Mediterranean/assets/gpt/photos/]
---

## Amaç
Tasarım 05'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the lemon tie slips loose and rolls away, the white flap opens upward to reveal the blue-and-white tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom drifts down.

## Girdiler
- `collections/05_Lemon_Mediterranean/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/05_Lemon_Mediterranean/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/05_Lemon_Mediterranean/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/05_Lemon_Mediterranean --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [x] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [x] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [x] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
2026-10-14 · codex-gpt-gorsel · **incelemeye hazır; aşağıdaki pencere kusurları açık.**

- Main güncellendi. G204'ün 5 comp + 18 parça + 5 fotoğrafı zaten main'deydi ve entegratörce onaylanmıştı; tekrar üretim yapılmadı, `kit_check` 24/24 + 5/5 geçti. G205 ise yalnız sahiplenilmiş, bütün görselleri eksikti; aynı ajan kaydıyla devam edildi.
- Bu sohbette imagegen ile sırayla W1'in 5 ekranı, W1 görsellerini referans alan W2'nin 17 parçası ve PAKET 2'nin 5 fotoğrafı üretildi. Kaydet satırlarındaki 27 sade dosya adı `assets/gpt/{comps,parts,photos}/` içinde. Kapanış ve açık zarf ayrıca seçilen kapalı zarfı; 3 hikâye fotoğrafı `hero_portrait.jpg` dosyasını referans aldı. Fotoğraflar gerçek RGB JPEG olarak kaydedildi; aynı kurgusal çift görsel olarak kontrol edildi.
- Üretim izi, seçilen denemeler, referanslar ve SHA-256 kayıtları: `parts/GENERATION_REPORT.json`. Alfa/pencere/hiza/doku ölçümleri: `parts/QUALITY_METRICS.json`. Ara kayıtlar ve son teslim doğrudan main'e gönderildi; PR açılmadı.
- Kontrol: `python3 tools/kit_check.py collections/05_Lemon_Mediterranean --paket 5` **23/23 geçti** (22 dosya + hiza); `--paket 2` **5/5 geçti**. Tam çıktılar `parts/KIT_CHECK_PAKET5.txt` ve `KIT_CHECK_PAKET2.txt`. Gerçek alfa, kenar boşluğu, tuval oranı ve yeşil pencere varlığı denetlendi; bu test bütünüyle düz/opak yeşil dolguyu ya da foto pencere oranını doğrulamaz.
- Yeniden üretilenler: `web_5_rsvp_v2` (ilk sürümde kart altındaki kapanış eksikti), `envelope_closed_v2` (dış kenar/yerleşim kontrolü), `envelope_open_v2` (ilk sürümün alt kenarı -%2,08 yukarıdaydı), `frame_portrait_v2/v3` (tuval oranı ve yeşil dolgu), `frame_landscape_v2/v3` (pencere oranı ve dolgu), `web_hero_v2` (1200×630 kırpımında alt boşluk). Seçilenler: RSVP, kapalı/açık zarf ve hero v2; her iki çerçeve v2. Çerçeve v3'ler daha saydam/kusurlu olduğundan seçilmedi. Bütün denemeler korundu.
- **Kalan kusur — yeşil pencereler:** küçük kartta yeşil RGB aralığı yaklaşık (5–10, 240–248, 0–4), alfa 252–254. Dikey çerçevede iç alfa 33–252; yatay çerçevede 30–253 ve merkezde saydam lekeler var. Üçer imagegen denemesi tam düz/opak `#00FF00` koşulunu sağlayamadı. Fotoğraf montajından önce teknik maske doldurma/renk normalizasyonu veya yeniden üretim gerekir. Maskeler bu görevde onarılmadı.
- **Kalan kusur — pencere oranları:** küçük kart yaklaşık 0,746 (3:4'e yakın), dikey çerçeve 0,714 (hedef yaklaşık 0,75), yatay çerçeve **1,869** (hedef 1,5). Mekân fotoğrafı 3:2 olduğundan kırpımı tema montajında kontrol edilmeli veya yatay çerçeve yeniden üretilmeli; `kit_check` geçmesi bu kusuru gidermez.
- Zarf hiza kontrolü uyarısız geçti: sol -2 px (-%0,20), sağ +5 px (+%0,49), alt +13 px (+%0,85). Yarı saydam üst üste kontrolü yapıldı; gövde/kat izleri piksel birebir değil. Kapalı zarfın genişliği yaklaşık %86,4 ve alt kenarı %84,5 konumunda; prompt'taki yaklaşık %80/%88 yerleşimi ve 5:4 gövde oranı birebir sağlanmadı. Tema build'inde hizalama ve yerleşim gözden geçirilmeli.
- Alfa katmanları koyu mavi zeminde incelendi: önizlemedeki geniş hâle gerçek alfa kompozitinde görünmedi; ayrı parçalar yazısız, tek nesne ve kesilmemiş görünüyor. 1200×630 hero merkez kırpımında zarf/kapanış tam ve alt boşluk yeterli. `bg_tile` 2×2 tekrarda belirgin birleşim çizgisi göstermedi; kenarlar piksel birebir değil (ortalama RGB farkı sol/sağ 4,79; üst/alt 5,25). Uzun sayfa görünümü tema QA'sında kontrol edilmeli. Kare çıktılar 1254×1254; oranlar doğru, yaklaşık accent boyutları tema ölçeklemesine ihtiyaç duyuyor.
- Kanıt önizlemeleri `parts/REVIEW_PARTS.jpg`, `REVIEW_ENVELOPE_OVERLAY.png`, `REVIEW_TILE_REPEAT.jpg`, `REVIEW_OG_1200x630.jpg` içinde. Bunlar yalnız denetim kompozitleri; imagegen kaynakları değiştirilmedi (fotoğraflara yalnız JPEG format dönüşümü uygulandı).
- Canlı site, zarf/sayfa animasyonu, fotoğraf değiştirme, RSVP veri akışı veya Canva testi yapılmadı. Önerilen takip: G405 tema onayından önce yeşil maske onarımı, mekân kırpımı/çerçeve oranı ve zarf gövde hizası QA'sı. Yeni görev açılmadı.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: codex-gpt-gorsel
- 2026-10-14 devam: codex-gpt-gorsel; main güncellendi, G204 teslimi doğrulandı; G205 W1 ekranları tamamlandı (RSVP v2 seçildi), W2 ve fotoğraflar sürüyor.
- 2026-10-14 bitti, incelemeye gönderildi
