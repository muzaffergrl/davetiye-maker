---
id: G209
baslik: Tasarım 09 Lavender Provence — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-E
oncelik: 2
bagimli: []
yazar: [collections/09_Lavender_Provence/assets/gpt/comps/, collections/09_Lavender_Provence/assets/gpt/parts/, collections/09_Lavender_Provence/assets/gpt/photos/]
---

## Amaç
Tasarım 09'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 17 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the jute twine with its lavender bundle unties and slips away, the linen pouch loosens and opens, and the card slides up out of it while dried lavender buds scatter on a summer breeze.

## Girdiler
- `collections/09_Lavender_Provence/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/09_Lavender_Provence/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/09_Lavender_Provence/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/09_Lavender_Provence --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [x] PAKET 5: 5 comp + 17 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [x] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [x] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
2026-10-14 — gpt-gorsel-E. Aynı sohbet içinde W1 → W2 → Paket 2 sırasıyla imagegen kullanıldı. Bütün ana dosyalar GPT_PROMPTS.md içindeki Kaydet yollarında:

- `comps/`: `web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png` (5 telefon ekranı; yalnız tasarım referansı).
- `parts/`: `bg_page.png`, `bg_tile.png`, `envelope_closed.png`, `closure.png`, `envelope_open.png`, `card_small.png`, `invitation_card.png`, `info_card.png`, `frame_portrait.png`, `frame_landscape.png`, `florals_tl.png`, `florals_br.png`, `accent_1.png`, `accent_2.png`, `accent_3.png`, `divider.png`, `web_hero.png` (17 parça).
- `photos/`: `hero_portrait.jpg`, `story_1.jpg`, `story_2.jpg`, `story_3.jpg`, `venue.jpg` (5 gerçek JPEG; aynı kurgusal çift, kahverengi dalgalı saçlar, lavanta elbise / taş rengi keten takım). Story_3'te kadının yüzüklü eli üstte, erkeğin eli altta.

W2'nin her üretimine ilgili W1 ekranları görsel referans olarak verildi. Kapalı kese önce üretildi; closure ve açık keseye ayrıca kapalı kese referansı verildi. Ayrı kapak/cep çizilmedi. Yazısız kartlar, tek accent nesneleri ve alfa kompozitleri gözle kontrol edildi. Kare çıktılar modelin yerel 1254×1254 çözünürlüğündedir; hedef kare oranını korurlar. Diğer PNG/JPEG'ler Kaydet ölçülerindedir.

Kontroller:

- `python3 tools/kit_check.py collections/09_Lavender_Provence --paket 5`: **23/23 geçti**, çıkış 0; hiza satırı **UYARI**. Kapalı/açık kese: sol +0,00%, sağ -0,10%, alt -2,15%; closure uçları sol -1,37%, sağ -1,22%. Alt kenar 33 px kadar yukarıdadır; değişmeyen gövde piksel düzeyinde aynı değildir. Tema montajında hiza düzeltmesi gerekir.
- `python3 tools/kit_check.py collections/09_Lavender_Provence --paket 2`: **5/5 geçti**, çıkış 0.
- `checks/` altında iki kontrolün tam çıktısı, alfa kompozitleri, yarı saydam kese bindirmesi, kapanış bindirmesi, parça/fotoğraf kontrol panoları, 1200×630 hero kırpımı ve `strict_green_report.json` var. Hero kırpımında kese ve kapanış tam görünür, altta boşluk vardır.

Yeniden üretimler (denemeler `_v1`, `_v2`, `_v3` adıyla korundu):

- Story W1: ilk çerçevelerde kalın demet/sicim dekoru oluştu; Home'daki ince lavanta bordürüyle yeniden üretildi.
- Kapalı kese: araç önizlemesindeki hâle şüphesi nedeniyle iki ek üretim yapıldı; alfa kompoziti görünür hâle olmadığını doğruladı. İkinci üretim seçildi; üçüncü fazla genişti.
- Açık kese ve closure: hiza/boğum konumu için yeniden üretildi; sonraki denemeler daha kötü hizalandığından en iyi ilk sürümler seçildi. Kalan ölçülen fark yukarıda yazılıdır.
- Küçük kart: ilk sürüm keseden genişti; yeniden üretimde görünür kart genişliği yaklaşık 620 px, kese yaklaşık 650 px oldu.
- Dikey çerçeve: yeşil pencere yarı saydam/gradyanlı kaldığı için yeniden üretildi; tam çözülmedi.
- Story_3: ilk sürümde yüzük keten ceket koluna bağlı ele geçmişti; iki elin doğru kollara bağlandığı sürüm yeniden üretildi ve seçildi.

**Açık kalite blokajı — saf opak yeşil:** Kit kontrolü yeşilin varlığını toleransla denetliyor, düz saf #00FF00 / alfa 255 şartını doğrulamıyor. Ek piksel denetimi `card_small`, `frame_portrait`, `frame_landscape` ve W1 foto pencerelerinde saf yeşil şartının sağlanmadığını gösterdi. Özellikle yatay çerçevenin ortasında alfa boşluğu var; dikey çerçeve ve küçük kartta gradyan/yarı saydamlık kaldı. Bu çıktılar **yeşil pencere şartına uygun teslim olarak onaylanmamalı**. Imagegen yeniden üretimleri sorunu gideremedi. Yalnız pencere piksellerinin Python ile tam (0,255,0,255) yapılması için kullanıcıya açık talimat soruldu; yanıt gelmediği için bu düzeltme uygulanmadı (imagegen araç yönergesi Python ile görsel düzeltmesini açık kullanıcı talimatına bağlıyor). Öncelikli düzeltme budur; hiçbir test sonucu tam görsel uygunluk anlamına gelmez.

Website/Canva montajı, yayın ve RSVP testi bu görev kapsamında yapılmadı.

## Günlük
- 2026-10-14 alindi: gpt-gorsel-E
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-E; 27 ana dosya üretildi, Paket 5 23/23 ve Paket 2 5/5 geçti. Saf opak yeşil düzeltmesi açık, kese hiza uyarısı Sonuç'ta kayıtlı.
