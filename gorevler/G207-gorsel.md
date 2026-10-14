---
id: G207
baslik: Tasarım 07 Burgundy Velvet Autumn — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-C
oncelik: 2
bagimli: []
yazar: [collections/07_Burgundy_Velvet/assets/gpt/comps/, collections/07_Burgundy_Velvet/assets/gpt/parts/, collections/07_Burgundy_Velvet/assets/gpt/photos/]
---

## Amaç
Tasarım 07'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 18 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the velvet bow unties and the ribbon slides off the envelope's sides, the rectangular flap lifts, and the card rises in warm candlelight while a single copper leaf drifts down.

## Girdiler
- `collections/07_Burgundy_Velvet/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/07_Burgundy_Velvet/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/07_Burgundy_Velvet/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/07_Burgundy_Velvet --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [x] PAKET 5: 5 comp + 18 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [x] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [x] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
2026-10-14 — gpt-gorsel-C. Aynı sohbette önce W1, sonra W1 referanslı W2, sonra ana portre referanslı PAKET 2 üretildi. Görseller imagegen ile üretildi; JPEG dosyaları biçim dönüşümüyle gerçek JPEG olarak kaydedildi. Kaynak prompt dosyası değiştirilmedi.

Üretilen sade adlı dosyalar, `collections/07_Burgundy_Velvet/assets/gpt/` altında:
- `comps/`: `web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png`.
- `parts/`: `bg_page.png`, `bg_tile.png`, `envelope_closed.png`, `closure.png`, `envelope_open.png`, `card_small.png`, `invitation_card.png`, `info_card.png`, `frame_portrait.png`, `frame_landscape.png`, `florals_tl.png`, `florals_br.png`, `accent_1.png`, `accent_2.png`, `accent_3.png`, `divider.png`, `velvet_swag.png`, `web_hero.png`.
- `photos/`: `hero_portrait.jpg`, `story_1.jpg`, `story_2.jpg`, `story_3.jpg`, `venue.jpg`. Çiftin yüzleri ve saçları ana portre referansıyla korundu; şömine sahnesinde erkeğin kıyafeti daha rahat yorumlandı. 2.4 yalnız el/yüzük/buket yakın planıdır.

Yeniden üretimler ve seçilen sürümler (denemeler `_vN` adıyla korundu):
- `web_2_home` → v2: yeşil pencerenin iç kenar gölgesini kaldırmak için.
- `envelope_closed` → v6: temiz alfa, 2:3 tuval ve alt yerleşim denemeleri; v2'nin tuval oranı yanlıştı. İlk RGB önizlemelerde görünen dış hâlenin çoğunun alfa=0 piksellerde olduğu daha sonra gerçek alfa birleşiminde doğrulandı.
- `closure` → v2: ilk sürümün üst ucu %28,58, yan uçları yaklaşık %5 taşıyordu; ikinci sürüm zarf referansıyla küçültülüp aşağı alındı.
- `frame_portrait` → v5, `frame_landscape` → v5: koyu yeşil lekeler, alfa delikleri, üst kurdele kenar payı ve yatay pencerenin aşırı basıklığı için. Son sürümlerde pencere çekirdeklerinde alfa<250 piksel kalmadı.
- `florals_br` → v2: sağ/alt kenar payını artırmak için.
- `story_3` → v2: ilk üretim geniş portreydi; eller, yüzük ve buketin yakın planıyla değiştirildi.

Kontroller:
- `python3 tools/kit_check.py collections/07_Burgundy_Velvet --paket 5` → **24/24 geçti, çıkış 0**. Buna 23 dosya ve hiza kontrolü dahildir; hiza **UYARI** olarak geçti.
- `python3 tools/kit_check.py collections/07_Burgundy_Velvet --paket 2` → **5/5 geçti, çıkış 0**.
- Kapalı/açık zarf ve kurdele %50 opaklıkla üst üste incelendi: `comps/qc_envelope_alignment.png`. Gövde farkları sol −%0,10, sağ −%0,10, alt +%0,13. Kurdele uçları sol +%0,29, sağ +%0,68, üst −%2,60, alt −%0,91.
- Gerçek alfa ile nötr zeminde parça kontrolü: `comps/qc_alpha_contact_sheet.png`. Dış gölge/hâle görülmedi; W2'de yazı/harf/rakam/monogram yok, accent'ler ayrı nesneler. Doku 2×2 tekrar önizlemesi: `comps/qc_tile_repeat.png`; belirgin birleşme çizgisi görülmedi. Hero'da zarf ve kurdele 1200×630 merkez kırpımında tam kalıyor.
- Sayısal kontrol ve seçilen sürümler: `comps/qc_report.json`. Website montajı/yayını ve RSVP işlev testi bu görsel görevinde yapılmadı.

**Kalan noktalar — tam uygunluk iddiası yok:**
- Kit kontrolü yaklaşık yeşili kabul ediyor. Üç W2 foto penceresinde piksel düzeyinde tek renk RGB=(0,255,0), alfa=255 şartı **tam karşılanmadı**; tekrar üretimler belirgin lekeleri kaldırdı, küçük ton/alfa sapmaları kaldı. Pencere çekirdeği ortalama RGB / alfa aralığı: `card_small` (7,73; 246,21; 2,78) / 252–254; `frame_portrait` (5,75; 244,07; 1,12) / 252–254; `frame_landscape` (7,24; 241,63; 1,75) / 250–254. W1 yeşil alanları da toleranslı referanslardır. Saf yeşil/255 alfa için üretime girmeden teknik maske normalizasyonu gerekir.
- Kurdele üst ucu yaklaşık 40 px (%2,60) taşıyor; piksel piksel hiza tam değil. Tema build'i ölçülen dönüşümle düzeltebilir; görsel üst üste kontrolünde fark da görülebiliyor.
- Son yatay pencerenin sınır kutusu oranı 1,756; hedef yaklaşık 3:2'den daha basık. Kare çıktılar 1024 yerine 1254×1254; kit standardının oran kontrolünü geçiyor.
- Önerilen düzeltme: entegratör foto pencerelerini düz saf #00FF00 ve alfa 255'e sabitlesin; kurdelenin üst ucunu zarf sınırına oturtsun, yatay foto kırpımını gerçek çerçeve oranıyla doğrulasın. Bu nedenle görev **inceleme** durumundadır, onaylandı/satışa hazır sayılmaz.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-C
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-C; PAKET 5 24/24, PAKET 2 5/5 geçti; kalan saf yeşil/alfa, kurdele hizası ve yatay pencere oranı Sonuç'a yazıldı.
- 2026-10-14 entegratör onayladı
