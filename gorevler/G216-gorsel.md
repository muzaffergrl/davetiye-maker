---
id: G216
baslik: Tasarım 16 Sunflower Rustic Barn — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-H
oncelik: 2
bagimli: []
yazar: [collections/16_Sunflower_Rustic/assets/gpt/comps/, collections/16_Sunflower_Rustic/assets/gpt/parts/, collections/16_Sunflower_Rustic/assets/gpt/photos/]
---

## Amaç
Tasarım 16'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), aynı tasarımın website parçaları (W2, 19 dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 parçaları + G036 fotoğrafları). Bu tasarımın açılışı: On tap, the gingham bow tugs loose and the ribbon slides off with its little sunflower, the kraft flap flips open, and the card slides out onto the weathered barn-wood tabletop (barnwood.png) while a few sunflower petals tumble.

## Girdiler
- `collections/16_Sunflower_Rustic/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**
- `collections/16_Sunflower_Rustic/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor); `collections/16_Sunflower_Rustic/content.demo.json` (comp'lardaki demo metin)
- Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)"

## Yapılacaklar
1. Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve ve dekor burada oturur.
2. Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; yazı/harf/rakam yok.
3. `envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).
4. Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).
5. Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.
6. Kontrol: `python3 tools/kit_check.py collections/16_Sunflower_Rustic --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol satırını uygula).

## Bitti sayılması için
- [ ] PAKET 5: 5 comp + 19 parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)
- [ ] PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı
- [ ] Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı

## Sonuç
Kısım 1 — gpt-gorsel-H, 2026-10-14 (8/8; görevin tamamı bitmedi, durum `alindi`):

- W1: `assets/gpt/comps/web_1_envelope.png`, `web_2_home.png`, `web_3_story.png`, `web_4_details.png`, `web_5_rsvp.png`; beşi de 1024×1536. Kontrol satırları görsel olarak incelendi; fotoğraf pencereleri, program, geri sayım, RSVP ve alt menüler mevcut. W1 yeniden üretilmedi.
- W2: `assets/gpt/parts/bg_page.png` (1024×1536, opak), `bg_tile.png` (1254×1254, opak; kare oran kontrolü geçti), `envelope_closed.png` (1024×1536, gerçek RGBA). Üçünde de W1 görselleri referans verildi; parçalar yazısız. Kapalı zarfta kurdele, çiçek, mühür veya başka kapanış elemanı yok; kapak kenarı okunuyor, dışarıya düşen gölge yok. Alfa ölçümünde nesnenin uzağında en yüksek alfa 1/255; görünür dış gölge/hâle bulunmadı.
- Yeniden üretim: `envelope_closed` için ilk çıktının tuval oranı hatalıydı; sonraki düzenlemeler boyut/alt konumu yaklaştırmak içindi. Beşinci çıktı seçildi; repoda yalnız sade adlı seçilmiş PNG bulunuyor.
- Yaklaşık geometri notu: seçilen zarfın opak gövdesi `(58, 737)–(968, 1321)`, genişliği tuvalin %88,9'u, alt kenarı yüksekliğin %86,0'ı; gövde oranı yaklaşık 1,56:1. Prompt'taki yaklaşık %80 genişlik / %88 alt kenar / 5:4 oran tam yakalanmadı. Kısım 2'de `closure` ve `envelope_open` için bu seçilmiş `envelope_closed.png` doğrudan referans olmalı; üçlü hiza henüz test edilmedi.
- `bg_tile`: karşı kenar RGB ortalamaları yakın; kenar piksel farkları ortalama 3,11/255 (sol–sağ), 3,69/255 (üst–alt), düşük kontrast. Website üzerinde tekrarlı render yapılmadı.
- Doğrulama: `kit_check.py collections/16_Sunflower_Rustic --paket 5` → bu oturumun 8 dosyası GEÇTİ, toplam 8/24; kalan 16 W2 parçası kapsam gereği yok. `--paket 2` → 0/5; fotoğraflar bu oturumun dışında. Eksikler nedeniyle iki tam paket komutu da çıkış kodu 1; tam paket geçti denmiyor. Ek rapor/önizleme dosyası üretilmedi.

## Günlük
- 2026-10-09 blokaj: K21: Paket 1 (yalnız doku/dekor) yerine Paket 4 (GPT tasarlar). G203 yerine G030; diğerleri G033 ile Paket 4'e çevrilecek
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: gpt-gorsel-H; bu oturum yalnız kısım 1: W1'in 5 ekranı + W2 bg_page, bg_tile, envelope_closed (8 görsel).
- 2026-10-14 ara kayıt (W1): gpt-gorsel-H; comps/web_1_envelope.png, web_2_home.png, web_3_story.png, web_4_details.png, web_5_rsvp.png üretildi (5/8); beşi de 1024×1536, görsel Kontrol satırları incelendi. Kalan bu oturum: bg_page, bg_tile, envelope_closed.
- 2026-10-14 ara kayıt (kısım 1, 8/8): gpt-gorsel-H; W1'in 5 ekranı + W2 bg_page, bg_tile, envelope_closed doğru Kaydet yollarında. Bu sekiz dosya kit_check kontrolünden geçti; zarfın yaklaşık geometri farkı Sonuç'ta kayıtlı.
