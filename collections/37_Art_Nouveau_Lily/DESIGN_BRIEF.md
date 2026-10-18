# Tasarım 37 — Art Nouveau Lily · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (3. dalga 33–38, satır 37; K23 sıkı: ilk sayfa kapalı zarf) + G186 (platform teması).
Aşama 1 kataloğu dışında (`tools/katalog.py` `EK_TEMALAR`, 6 eksen + hareket imzası; `kontrol` D'deki 20 tasarıma ve
dalganın diğerlerine karşı denetler). Çalışma adı marka değildir.

**Ruh:** 1900'lerin Art Nouveau afişi (Mucha **tarzı**, kopyası değil) ve vitray: adaçayı zemin, krem kâğıt, leylak astar,
yumuşak altın; beyaz zambaklar, kıvrımlı (whiplash) altın çizgiler, mozaik altın hâle. Klasik, romantik, zengin ve geniş
beğeni. **06 Art Deco'dan ayrı:** geometrik ışın, siyah-altın, Poiret/Cinzel yok; **24 Grand Theatre'den ayrı:** tavus
tüyü, tavus mavisi, perde yok; **26 Kintsugi'den ayrı:** dört kare kat değil, üç taç yaprağı kapak + vitray madalyon.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Dik krem zarf; ön yüzü **üç taç yaprağı kapak** (sol, sağ, orta), uçları **vitray zambak madalyonun** altında buluşur, cebin üst kenarı ortada yumuşakça sivrilir. Dokununca ışık bandı zarfı ve camı süpürür, madalyonun arkasında ışık parlar, madalyon kalkar; yan yapraklar yan menteşelerinde dışa açılıp geriye kıvrılır (90°'de leylak astar devralır), orta yaprak üst menteşesinde yukarı açılır — **zambak açar gibi**; kart cepten yükselir, öne gelir, home'a uçar |
| Fotoğraf sunumu | **Vitray pencere kemerleri** (5:7, GPT çerçeve + `#00FF00` pencereden maske): fotoğraf alacakaranlıkta cam gibi soluk-gri bekler, sahnesine gelince çapraz bir ışık bandı geçer ve renkleri canlanır; kaydırınca daha yumuşak bir ışık camda dolaşır |
| Dekor ailesi | Zambak, kıvrımlı altın çizgiler, vitray, mozaik altın (GPT; şu an yalnız tonlanmış kâğıtlar ve kesik kâğıt kapaklar) |
| Teknik | Mucha tarzı poster + vitray |
| Font | Federant (Art Nouveau başlık yazısı: başlıklar, etiketler, düğmeler) + Ephesis (zarif el yazısı: isimler, büyük başlıklar) + Linden Hill (gövde) — Google Fonts; 01–32'nin hiçbirinde yok |
| Ana palet (`sage-gold-cream-lilac`) | sage `#55634E` · sage deep `#3C4737` · cream `#F4ECDB` · cream shade `#E6DCC4` · lilac `#C8B6D6` · lilac ink `#5C4970` · gold `#B8964E` · gold light `#DFC68F` · gold ink `#7A5D22` · ink `#2E3228` |
| Hareket imzası | Vitraydan süzülen ışık bandı ve madalyonun parlayıp kalkması, taç yaprağı kapakların menteşelerinde çiçek açar gibi açılması, altın kıvrım çizgilerinin akan bir maskeyle "kendini çizmesi", ışık geçince renkleri canlanan kemer fotoğraflar, metnin camdan geçen renk gibi bulanıklıktan netleşmesi, RSVP'de süzülen zambak yaprakları |

## Sayfalar
- **index (K23 sıkı, katalog kapağıyla uyumlu):** adaçayı zemin; üstte "Together with their families" (host line),
  "Invite you to celebrate", Ephesis isimler; ortada kapalı zarf; altta tarih · şehir, bölge ve "Tap to open"; köşede Skip.
- **home:** Mucha afişi gibi — mozaik altın hâle (GPT) önünde krem kart (kemer portre, isimler, tarih, mekân), yanlarda
  zambak demetleri (GPT) → krem bantta davet ("Love in full bloom", altın kıvrım çizgisi, tam adlar, üç satır tarih, RSVP,
  geri sayım, takvim) → hikâye tanıtımı (vitray kemer) → günün ilk 4 satırı → imza (zambak demeti + isimler).
- **story:** üç an, sol–sağ–sol, üçü de uzun vitray kemerde; Roma rakamları (CSS sayaç).
- **details:** program krem kâğıtta (altın kıvrım çizgisi), mekân fotoğrafı geçen ışıkla canlanır, harita, G138 blokları,
  travel, menü, registry, SSS.
- **rsvp:** krem form; gönderince zambak yaprakları süzülür (GPT yaprağı gelince); teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Odette & Felix, Villa Mirelle Gardens, Nancy, Grand Est, France; June 19, 2027;
  URL ve medya null; demo harita pini Nancy — başka temada yok)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları, PAKET 2 örnek fotoğraflar, PAKET 6 basılı davetiye);
  prova şekli `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/art-nouveau-lily/` (README: açılış, geçici görseller, GPT gelince olanlar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
