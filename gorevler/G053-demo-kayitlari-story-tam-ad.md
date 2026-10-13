---
id: G053
baslik: Demo içerik kayıtları — 01'e tam adlar, 01/02/04–20'ye `story` (intro + 3 başlık)
rol: claude-metin
durum: hazir
alan:
oncelik: 2
bagimli: [G046]
yazar: [collections/01_Olive_Ivory/content.demo.json, collections/02_Dusty_Blue/content.demo.json, collections/04_Vintage_Airmail/content.demo.json, collections/05_Lemon_Mediterranean/content.demo.json, collections/06_Art_Deco_Noir/content.demo.json, collections/07_Burgundy_Velvet/content.demo.json, collections/08_Winter_Evergreen/content.demo.json, collections/09_Lavender_Provence/content.demo.json, collections/10_Tuscan_Vineyard/content.demo.json, collections/11_Boho_Pampas/content.demo.json, collections/12_Tropical_Destination/content.demo.json, collections/13_Enchanted_Forest/content.demo.json, collections/14_Ivory_Lace_Pearl/content.demo.json, collections/15_Cherry_Blossom/content.demo.json, collections/16_Sunflower_Rustic/content.demo.json, collections/17_Emerald_Gold_Estate/content.demo.json, collections/18_Wildflower_Vellum/content.demo.json, collections/19_Midnight_Garden/content.demo.json, collections/20_Coastal_Seaside/content.demo.json]
---

## Amaç
G4NN temalarının demo kaydı = koleksiyon kaydı (`docs/11` §2.1, test §13.2 #16). İki eksik var:
1. **01'de `partners[].full_name` `null`** (20 kaydın tek istisnası; 02–20'de "Ad İkinci-ad" biçiminde dolu). Davet kartı tam adı
   gösterir; tema `null`'da ilk ada düşer (docs/11 §3.2), ama satış önizlemesi `/start/demo/olive-ivory` tam adla görünmeli.
2. **03 dışında hiçbir kayıtta `story` yok** → Our Story sayfası demo'da girişsiz ve başlıksız. Tema ajanı kaydı kendisi
   dolduramaz (kopyası koleksiyonla birebir olmalı).

## Girdiler
- `collections/03_Blush_Garden_Rose/content.demo.json` → `story` (örnek: intro "A few of the moments that led us to" — sayfada
  tarihle biter —, başlıklar "First hello", "The proposal", "Forever begins")
- PAKET 2 fotoğraf adları/sahneleri: her koleksiyonun `assets/gpt/GPT_PROMPTS.md` → PAKET 2 (2.2–2.4 = story_1..3)
- Şema `docs/03_URUN_ICERIK_SEMASI.json` (`story`: intro ≤ 200, caption ≤ 60, items ≤ 12); `python3 tools/validate_content.py <dosya>`
- AGENTS.md "Demo veriler kurgudur" (01: Avery & Jordan — kurgu; gerçek kişi/marka yok)

## Yapılacaklar
1. 01: `partners[0].full_name`, `partners[1].full_name` — 02–20 ile aynı biçimde kurgu tam ad ("Avery …", "Jordan …"); `name_display`,
   `initials` değişmez.
2. 01, 02, 04–20: `story: {intro, items: [{caption}, {caption}, {caption}]}` — başlıklar PAKET 2 hikâye fotoğraflarının sahnesine
   uyar (2.2 ilk buluşma, 2.3 evlilik teklifi, 2.4 eller/yüzük); varsayılan "First hello" / "The proposal" / "Forever begins"
   kullanılabilir. Intro tasarımın sesine uygun, kısa, İngilizce; tarihle birleşen cümle ("… led us to" + tarih) 03'teki gibi.
3. Her dosya `python3 tools/validate_content.py` ile geçer; `platform/` içinde `npm test` (content parity) geçer.
4. `python3 tools/katalog.py ozet --dene` bu dosyaları artık "atlandı (elle eklenmiş alan: story)" der — beklenen.

## Bitti sayılması için
- [ ] 01'de iki tam ad dolu; 19 kayıtta `story` (intro + 3 başlık); hepsi doğrulamadan geçti
- [ ] Sonuç'ta seçilen intro/başlıklar listelendi

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 açıldı: G046 incelemesi (01 `full_name` null; docs/11 §14 #5 story)
