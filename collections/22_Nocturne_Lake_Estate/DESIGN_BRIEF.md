# Tasarım 22 — Nocturne Lake Estate · tasarım özeti (v2, 2026-10-24, onaylı)

Kaynak: GPT tasarım panosu `assets/gpt/mockups/design-board.png` ve PAKET 8 parçaları (`assets/gpt/GPT_PROMPTS.md` →
"PAKET 8 — The moon is missing", teslim notu `assets/gpt/parts/TESLIM.txt`). Yöntem K60: GPT panoyu ve parçaları çizer,
Claude keser, hizalar, ışık ve hareket ekler; çizim yok (K21). Tema id `nocturne-lake-estate`; teknik ayrıntı
`platform/themes/nocturne-lake-estate/README.md`. 22 Ekim sürümü (kömür laid zarf, vellum bant, hilal broş, villa
pencereleri) bu sürümle değiştirildi; git geçmişinde durur.

**Ruh:** Como Gölü'nde black-tie bir gece. Siyah pamuk kâğıt, el yaldızı şampanya kenarlar, ince altın folyo, altın moiré
astar, gerçek altın varak, ay ışığında kireçtaşı ve gece suyu. **İmza: gökte ay yok** — ay, zarfın dağ biçimli kapağının
vadisindeki altın mühürdür; zarf açılınca göğe yükselip ay olur ve site boyunca gökte kalır.

**Başka tasarımlardan farkı:** çiçek, kadife, saten, kırmızı, yırtık kâğıt, Didone yok (21'in); yıldız/takımyıldız yok
(29'un); Art Deco geometri (06), kapı/fener (27), sahne perdesi (24) yok.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Yatay siyah pamuk zarf, kapağı iki dağ sırtı ve ortada tek vadi biçiminde kesik, kenarında altın kıl çizgi; vadide ortası boş altın "ay" mühür (baş harfler canlı metin), cepte ay ışığı çizgileri. Dokununca: mühür çıt diye kurtulur → göğe yükselip ay olur → kapak kenara kadar kalkar, altın moiré iç yüzü dikilir → ay yolunda ışık süzülür, altın varak dökülür → fildişi kemer pencereli kart cepten çıkar, öne gelir → home (kartın fotoğrafı home'daki kemer çerçeveye, ay home'un göğüne geçer) |
| Fotoğraf sunumu | Home portresi ince yaldızlı **kemer çerçevede**, balüstradın üstüne biner; story fotoğrafları yaldızlı yatay çerçevede **suyun üstünde**, altında dalgalanan yansımalarıyla; mekân aynı yatay çerçevede |
| Sayfalar | Home: aylı göl + isimler gökte + balüstrat + kemer portre + geri sayım + yaldızlı kartta resmî davetiye. Story: bölüm bölüm, oklar/noktalar/kaydırma. Details: "The evening", ay yolu çizgisinde program + altın ikonlar (yüzük, kadeh, şamdan, gramofon, tekne, papyon). RSVP: karartılmış göl üstünde yaldızlı siyah kart; gönderince ay mühür basılır, ay parlar |
| Font | **Waterfall** (isimler, script başlıklar; yalnız büyük boy) + **Castoro Titling** (aralıklı büyük harf) + **Castoro** (gövde, italik) — Google Fonts, başka tasarımda yok |
| Ana palet | night `#11120F` · lake ink `#0F1620` · charcoal `#1C1D15` · champagne `#E0C7A4` · gold `#C7A978` · ivory `#F1E4CC` · stone `#CFC6B4` |
| Ses | Kendi paketi (tick, rise, flap, moon, draw, reveal; leaf, ripple, press, clink) ve kendi müziği "Moonlit Terrace" (6/8 barkarol) — `tools/audio_packs.py` ile sentez |
| Renk varyantları | V02 midnight navy · V03 emerald night · V04 burgundy noir · V05 moonlit silver · V06 plum & rose gold — PAKET 8 parçalarından (`variants/recolor.json`), durum `coming`; göl, ay, su, balüstrat ve fotoğraflar boyanmaz |

## Bilinen notlar

- Story ve mekân çerçevesinin penceresi geniştir (~1,8:1). Panel dikey fotoğrafı ortadan kırpar; alıcı kırpma adımında
  sürükleyip ayarlayabilir. Demo için `story_1` yukarı odakla kırpıldı (`scripts/build-demo-photos.ts DEMO_FOCUS_Y`).
- V06 (mürdüm & gül altını) varyantında çerçevelerin siyah lake şeridi fazla mora kayıyor; varyant onayından önce
  bakılmalı.
