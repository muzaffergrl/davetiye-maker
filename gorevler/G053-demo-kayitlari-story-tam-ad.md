---
id: G053
baslik: Demo içerik kayıtları — 01'e tam adlar, 01/02/04–20'ye `story` (intro + 3 başlık)
rol: claude-metin
durum: inceleme
alan: wf-hazirlik
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
- [x] 01'de iki tam ad dolu; 19 kayıtta `story` (intro + 3 başlık); hepsi doğrulamadan geçti
- [x] Sonuç'ta seçilen intro/başlıklar listelendi

## Sonuç
**Yapıldı (2026-10-13, claude-metin):** 19 `content.demo.json` kaydına `story` eklendi, 01'e iki tam ad yazıldı. Başka alan
değişmedi (`name_display`, `initials`, tarih, mekân, program aynı). Hepsi kurgu; URL'ler `null` kaldı.

- **01 tam adlar:** `partners[0].full_name = "Avery Louise"`, `partners[1].full_name = "Jordan Samuel"` (02–20 gibi
  "ad + ikinci ad"; `display_name` ile başlar; davet kartında `null` yedeğine artık düşmez).
- **Biçim:** 04–20 `katalog.py`'nin `json.dumps(indent=2)` biçiminde (diff yalnız `story` ekler, 03 gibi en sonda); 01 ve 02 elle
  yazılmış sıkı biçimleri korunarak aynı yere eklendi.
- **Intro** sayfada tarihle biter (03 teması: `<intro> <date>.`) → her cümle "… led us to" türünde, tarih öncesinde kesilir.
  Başlıklar PAKET 2 sahnelerine göre: 1 = ilk buluşma (story_1), 2 = evlilik teklifi (story_2), 3 = eller + yüzük (story_3).
  Başlıklar kısa (10–18 karakter) — yan yana dizilişlerde (06, 08, 10, 11, 12, 18) dar çerçeve altında sığsın diye.

| # | Intro (+ tarih) | Başlık 1 | Başlık 2 | Başlık 3 |
|---|---|---|---|---|
| 01 | Slow lunches, golden evenings and one walk through the olive grove led us to | Our first lunch | In the olive grove | Simply forever |
| 02 | Coffee dates, sea breezes and all the quiet moments in between brought us to | Our first coffee | Sunset by the sea | Ever after |
| 04 | Some love stories are written one letter at a time. Ours led us to | A table for two | Sealed with a yes | Yours, always |
| 05 | Under the lemon trees, one sunny day at a time, we found our way to | On the piazza | Above the sea | Our sweetest yes |
| 06 | It began with jazz and champagne, and every evening since has led us to | Jazz night | On the staircase | Here's to us |
| 07 | Cider by the fire, walks through falling leaves and every warm moment since led us to | By the fire | Falling leaves | Hand in hand |
| 08 | Hot cocoa, falling snow and one very happy winter evening led us to | First snowfall | Under the pines | Evergreen love |
| 09 | Long summer evenings and fields of lavender carried us all the way to | Rosé in the square | In the lavender | Tied together |
| 10 | Good wine, long tables and golden vineyard sunsets led us to | First pour | Among the vines | A fine vintage |
| 11 | Wide skies, desert sunsets and a few wild-hearted adventures led us to | Where it began | Desert sunset | Wild hearts |
| 12 | Every adventure and every island sunset has been bringing us to | Island time | End of the pier | Next stop: forever |
| 13 | Once upon a time, two people met in the woods. Every page since has led us to | Chapter one | By lantern light | Happily ever after |
| 14 | Afternoon tea, a rose garden and a promise made by the fountain led us to | Afternoon tea | By the fountain | Forever and always |
| 15 | Like the first blossoms of spring, our story unfolded slowly and led us to | Our first spring | Under the blossoms | In full bloom |
| 16 | Back roads, lemonade and one golden sunflower field led us straight to | Tailgate lemonade | In the sunflowers | Sunny days ahead |
| 17 | From an evening at the gallery to a sunset by the lake, every moment led us to | At the gallery | By the lake | Set in gold |
| 18 | Picnics, wildflowers and long summer afternoons brought us to | Our first picnic | In the meadow | Forever in bloom |
| 19 | Candlelit evenings and moonlit walks led us, one midnight at a time, to | By candlelight | Under the moon | One red rose |
| 20 | Salt air, harbor afternoons and one lighthouse sunset led us to | Down by the harbor | By the lighthouse | Tide after tide |

Intro 60–85 karakter (sınır 200), başlıklar ≤ 18 (sınır 60).

**Test edildi:**
- `python3 tools/validate_content.py` — 20 kaydın 20'si GEÇTİ (01–20, 03 dahil).
- `platform/`: `npm ci`, `npm test` 230/230 geçti (content şeması + Python eşliği dahil), `npm run typecheck` temiz.
- `python3 tools/katalog.py ozet --dene` → 04–20 için "atlandı (elle eklenmiş alan: story)", 0 dosya değişecek (beklenen):
  `content()` üreteci bu kayıtların üzerine yazmaz, bu yüzden `tools/katalog.py`'ye dokunulmadı. (Uyarı: `katalog.py yaz --zorla`
  bilinçli olarak her şeyin üzerine yazar; o komut `story`'yi de siler.)
- `python3 tools/katalog.py kontrol` temiz.

**Test edilmedi:** Hiçbir tema (01, 02, 04–20) henüz yok (G4NN hazır) → yeni intro/başlıkların gerçek tasarımlarda 360/390 px'te
sığması görülmedi; 03 teması kendi kaydını kullanır, değişmedi.

**Bilinen sapma (bu görevin yazar alanı dışında):** `katalog.py demo()` başlıkları `content.demo.json`'dan okur → artık
`python3 tools/katalog.py paket5 --dene` 19 `GPT_PROMPTS.md` için "yazılacak" diyor. Fark dosya başına yalnız 8 satır:
W1.3 story comp prompt'undaki üç başlık ve PAKET 2 başlıkları (2.2–2.4); fotoğraf sahne prompt'ları aynı. 01'in `web_3_story.png`
comp'u (G201, gpt-gorsel-1 üzerinde) eski varsayılan başlıklarla üretilmiş; comp yalnız referans ("demo metin serbest"),
sitede başlıklar HTML'dir.

**Önerilen yeni görev (entegratör / claude-kod):** `python3 tools/katalog.py paket5 --no 02,04,05,…,20` ile GPT_PROMPTS.md'leri
yeni başlıklara eşitle (01'i G201 bitince); W1.3 comp'u henüz üretilmemiş tasarımlarda GPT doğru başlıkları görür.

## Günlük
- 2026-10-13 açıldı: G046 incelemesi (01 `full_name` null; docs/11 §14 #5 story)
- 2026-10-13 alindi: wf-hazirlik
- 2026-10-13 bitti, incelemeye gönderildi
