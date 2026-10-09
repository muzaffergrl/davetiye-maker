---
id: G030
baslik: Tasarım 03 Blush Garden Rose — GPT tasarım paketi (Paket 4: sahne comp'ları + parçalar) · PİLOT
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-1
oncelik: 1
bagimli: []
yazar: [collections/03_Blush_Garden_Rose/assets/gpt/comps/, collections/03_Blush_Garden_Rose/assets/gpt/parts/]
---

## Amaç
Kullanıcı kararı K21: **tasarımı GPT yapar.** Bu pilotta GPT, tasarım 03'ün 6 video sahnesini bitmiş
tasarım olarak çizer (T1, referans) ve aynı tasarımı Canva'da ayrı hareket edecek parçalara böler (T2).
Claude yalnız metin katmanlarını, fotoğraf alanlarını ve Canva montajını yapar (G031).

## Girdiler
- `collections/03_Blush_Garden_Rose/assets/gpt/GPT_PROMPTS.md` → **PAKET 4** (önce baştaki talimatları oku)
- `collections/03_Blush_Garden_Rose/DESIGN_BRIEF.md`, `palette.json`
- `gorevler/roller/gpt-gorsel.md` (§ Tasarım paketi)

## Yapılacaklar
1. T1.1–T1.6 comp'larını sırayla, **aynı sohbette** üret; kendi kontrol satırlarına göre beğenmediğini yeniden üret.
2. T2.1–T2.13 parçalarını T1 comp'larını referans vererek üret (aynı zarf, aynı çiçek, aynı altın).
3. Şeffaf istenenler gerçek alfa kanallı PNG; foto pencereleri düz `#00FF00`.
4. Varsa kendi kontrolün: `python3 tools/kit_check.py collections/03_Blush_Garden_Rose --paket 4`.

## Bitti sayılması için
- [x] 6 comp + 13 parça doğru ad/yolda
- [x] T2 parçalarında hiç yazı yok; şeffaflar gerçek alfa
- [x] Comp'lar "lüks davetiye" seviyesinde (düz vektör/clip-art görünümü yok)

## Sonuç
**gpt-gorsel-1, 2026-10-09:** Paket 4'ün 6 T1 sahnesi ve 13 T2 parçası imagegen ile
aynı sohbette üretildi. İngilizce ana prompt'lar aynen kullanıldı; ortak şartlar ve
yeniden üretimlerde düzeltme talimatları eklendi. T2 çağrılarına ilgili T1 görselleri
yerel referans olarak verildi. Çiçekler yağlı boya dokusunda; zarf, kağıt, ipek ve altın
aynı blush/cream/sage kimliğini sürdürüyor. T1 demo metinleri yerleşim referansıdır.

**Teslim dosyaları:** aşağıdaki yollar `collections/03_Blush_Garden_Rose/assets/gpt/`
altındadır. Sade adlar seçilen üretimlerdir; `_v*` dosyaları elenen denemelerdir.

| Dosya | Gerçek ölçü | Zemin |
|---|---|---|
| `comps/scene_1_comp.png` | 1024×1536 | RGB |
| `comps/scene_2_comp.png` | 1024×1536 | RGB |
| `comps/scene_3_comp.png` | 1024×1536 | RGB |
| `comps/scene_4_comp.png` | 1024×1536 | RGB |
| `comps/scene_5_comp.png` | 1024×1536 | RGB |
| `comps/scene_6_comp.png` | 1024×1536 | RGB |
| `parts/bg_scene.png` | 1024×1536 | RGB |
| `parts/envelope_closed.png` | 1254×1254 | RGBA |
| `parts/ribbon_bow.png` | 1536×1024 | RGBA |
| `parts/envelope_open.png` | 1024×1536 | RGBA |
| `parts/card_small.png` | 1024×1536 | RGBA |
| `parts/arch_frame.png` | 1024×1536 | RGBA |
| `parts/invitation_card.png` | 1024×1536 | RGBA |
| `parts/info_card.png` | 1024×1536 | RGBA |
| `parts/florals_tl.png` | 1254×1254 | RGBA |
| `parts/florals_br.png` | 1254×1254 | RGBA |
| `parts/petals.png` | 1254×1254 | RGBA |
| `parts/divider.png` | 1536×1024 | RGBA |
| `parts/web_hero.png` | 1536×1024 | RGB |

**Kontroller:** `python3 tools/kit_check.py collections/03_Blush_Garden_Rose --paket 4`
son seçilen dosyalarla **19/19 geçti**. Bu araç dosya, asgari ölçü, oran ve alfa/kenar
kontrolüdür; saf yeşili veya sanat kalitesini doğrulamaz. PNG'ler ayrıca PIL ile yalnız
okunarak incelendi: şeffaf istenen 11 dosyanın tümü gerçek alfa kanallı, alfa minimumu 0.
T2'de görsel incelemede yazı, kişi, el, monogram, logo görülmedi. Kartların metin yüzleri
boş, açık zarfın cebi boş; petal setinde birbirine değmeyen altı parça var.

**Açık kusurlar — bu paket teknik şartların tamamını geçmiş sayılmıyor:**

- Saf `#00FF00` şartı **GEÇMEDİ**. T1.2/T1.3 pencereleri yeşil görünüyor ama renk düz/saf
  değil. T2 `card_small.png` penceresinde de ton değişimi ve kısmi alfa var.
  `(450,400)–(570,520)` örneğinde 14.400 pikselin sıfırı saf yeşil; sık değer
  RGBA `(3,209,2,250)`. `arch_frame.png` iç pencerenin merkezi neredeyse şeffaf;
  `(450,600)–(570,720)` örneğinde 14.400 pikselin sıfırı saf yeşil; sık değer
  `(1,19,1,2)`. Opak basılı yeşil panel talimatı ve ayrı düzeltme çağrıları bunu gideremedi.
  Foto maskesi/yer tutucusu teknik hazırlıkta düzeltilmeden bu parçalar onaylanmamalı.
- Kare üretimler araçtan 1024 yerine **1254×1254** çıktı. Oran doğru, çözünürlük daha
  yüksek; ölçü standardizasyonu yapılmadı. Tasarım kodla çizilmedi, yeniden boyutlandırılmadı
  veya yeşil alan kodla boyanmadı.
- Bazı dikey RGBA parçalarda yumuşak sıcak gölge/hale geniş alan kaplıyor; merkezdeki
  nesnelerin alfa maksimumu 254. Montajda farklı zemin üzerinde kenar/hale kontrolü gerekli.
  9:16 kırpma ve ortadaki %85 güvenli alan uygulaması burada yapılmadı; montajda nesneler
  ayrı ölçeklenip konumlandırılmalı. Canva montajı veya düzenlenebilir proje teslim edilmedi.

**Yeniden üretimler:**

- `arch_frame_v1.png`: ilk pencerede alfa temizleme yeşil merkezi sildi. İkinci üretim
  opak yeşil panel talimatıyla istendi. `arch_frame_v2.png`: ikinci üretim, yine saf/opak
  yeşil değil; tam nesne marjı daha iyi olduğu için bu sürüm `arch_frame.png` olarak seçildi.
  `arch_frame_v3.png`: yalnız iç pencere düzeltmesi de başarısız, ayrıca alt buketler sınıra
  dayandı; seçilmedi. Toplam üç çerçeve üretimi.
- `card_small_v1.png`: ilk kart penceresinde saf yeşil/opaklık sorunu; ikinci çağrı yalnız
  pencereyi opak yeşil basılı panel olarak düzeltmeye çalıştı. Sonuç hâlâ şartı geçmedi.
- `florals_tl_v1.png`: ilk sol üst küme kesilmişti ve kenar denetimi başarısızdı. Daha
  küçük, tam görünür buket üretildi; seçilen dosya kenar denetimini geçti.
- `florals_br_v1.png`: ilk sağ alt kümenin uçları sınıra dayanıyordu. `florals_br_v2.png`:
  ikinci deneme 1312×1199 çıktı, kare şartına uymadı. Üçüncü denemede kare tuval ve geniş
  marj vurgulandı; seçilen tam buket 1254×1254 ve kenar denetimini geçti.

Görev **inceleme** durumunda; yukarıdaki saf yeşil kusuru açık kalıyor. Bu sonuç
`sale_ready`, Canva montajı veya çalışır video/website/PDF onayı değildir.
Not: `tools/gorev.py` aynı G030 kimliğini taşıyan eski
`G030-v02_blush_champagne-kit.md` dosyasını seçtiğinden sahiplenme ve sonuç güncellemesi
bu pilot dosyasında doğrudan yapıldı; eski görev değiştirilmedi.

## Günlük
- 2026-10-09 alindi: gpt-gorsel-1
- 2026-10-09 T1: 6 sahne referansı üretildi; T2 üretimine geçiliyor.
- 2026-10-09 T2: 13 parça üretildi; çerçeve, küçük kart ve iki köşe çiçeği yeniden üretildi.
- 2026-10-09 bitti, incelemeye gönderildi: 19 hedef dosya; paket denetimi 19/19 geçti,
  saf #00FF00/opak pencere kontrolü geçmedi ve Sonuç'ta açık kusur olarak kaydedildi.
