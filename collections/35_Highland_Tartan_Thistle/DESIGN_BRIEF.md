# Tasarım 35 — Highland Tartan & Thistle · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (3. dalga 33–38, satır 35; **K23 sıkı**: ilk sayfa kapalı zarf) + G184 (platform
teması). Aşama 1 kataloğu dışında (`tools/katalog.py` `EK_TEMALAR`, 6 eksen + hareket imzası; `kontrol` D'deki 20 tasarıma
ve dalganın diğerlerine karşı denetler). Çalışma adı marka değildir.

**Ruh:** İskoç Yaylası'nda sisli bir sabah; ekoseli yün, deri ve pirinç, funda ve devedikeni, krem kâğıt. Klasik, romantik,
zengin ve geniş beğeni — hediyelik eşya dükkânı değil (gayda, etekli figür, kale, bayrak, klan arması yok; kültürel semboller
yaygın ve saygılı, dini simge yok). **01–21'in zarfından ayrı:** V kapak + mum mühür yok; düz kapaklı yün zarf, dikey deri
kayış ve pirinç toka. **25 Orient Express'ten ayrı:** kitap gibi açılan deri cüzdan değil; kayış tokadan kayar, yün kapak
yukarı kalkar, sis çekilir.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Ekoseli yün zarf, **düz** kapak, dikey deri kayış + pirinç toka. Dokununca tokanın çerçevesi alt çubuğu üstünde öne devrilip dili bırakır, kayış tokadan **yukarı kayıp** zarftan çıkar (toka onunla), yün kapak üst katından **3B kalkar** (iç astarı koyu yün), funda dalı ve kart cepten yükselir; bu sırada arkadaki tepelerin üstündeki iki sis katmanı **zıt yönlere çekilir**; kart öne gelir, home'a uçar |
| Fotoğraf sunumu | Antika pirinç madalyon (locket): oval foto, pirinç çerçeve (GPT); sahnesine gelince **kapağı sol menteşesinde açılır**; mekân fotoğrafı soldan **sisin kalkmasıyla** (yumuşak maske) belirir |
| Dekor ailesi | Ekose yün, devedikeni, funda, deri kayış, pirinç toka ve madalyon, dağ sisi (GPT; şu an yalnız tonlanmış dokular, pirinç kırpımı, bulanık sis) |
| Teknik | yağlı boya manzara + fotogerçekçi doku |
| Font | Rouge Script (isimler, başlıklar) + Sorts Mill Goudy (gövde, büyük harf satırlar, italik) — Google Fonts; 01–32'nin hiçbirinde yok. docs/24 önerisi IM Fell English (13'te) + Pinyon Script (02, 07, 23'te) seçilmedi |
| Ana palet (`heather-moss-tartan`) | heather `#7B5A84` · heather light `#C4A9CC` · moss `#5E6B3E` · moss ink `#46512C` · ground `#20291D` · tartan red `#8E2B2F` (yalnız ekosede ince çizgi) · cream `#F1EADB` · brass `#A88437` · brass light `#D9BB72` · leather `#6B4428` · mist `#DFE3DC` · ink `#2A2620` |
| Hareket imzası | Toka/kayış mekaniği (çerçeve devrilir, kayış tokadan kayar), düz yün kapağın 3B kalkışı, iki sis katmanının zıt yönlere kayması (açılışta çekilir, story/details'te kaydırmayla süzülür), madalyon kapaklarının menteşede açılması, metnin sisten netleşerek gelmesi (bulanıktan keskine, soldan hafifçe) |

## Sayfalar
- **index (K23 sıkı, katalog kapağı düzeni):** üstte "Together with their families" (host line) + "Invite you to celebrate" +
  Rouge Script isimler; ortada kapalı zarf; altta tarih · şehir ve "Tap to open"; köşede Skip. Arkada tepeler (GPT) ve iki
  sis katmanı.
- **home:** sis önünde krem kart (madalyonda oval portre — kapak açılır —, isimler, tarih, mekân) → krem bantta davet
  ("Gathered in the hills", funda ayırıcı, tam adlar, üç satır tarih, RSVP, geri sayım, takvim) → hikâye tanıtımı
  (madalyon) → günün ilk 4 satırı → imza (devedikeni, isimler, "Open the invitation again").
- **story:** üç an, sol–sağ–sol, üçü de madalyonda; arkada kaydırmayla zıt yönlere süzülen iki sis katmanı.
- **details:** program krem kâğıtta (funda ayırıcı), mekân fotoğrafı sisten, harita, G138 blokları, travel, menü, registry,
  SSS; arkada sis.
- **rsvp:** krem form; gönderince funda çiçekçikleri süzülür (GPT çiçekçikleri gelince); teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Isla & Callum, Glenarden House (kurgu), Pitlochry, Perthshire, United Kingdom;
  September 25, 2027, 2:00 PM; URL ve medya null; demo harita pini Pitlochry — başka temada yok)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları W2.1–W2.18, PAKET 2 örnek fotoğraflar, PAKET 6 basılı
  davetiye); prova şekli `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/highland-tartan-thistle/` (README: açılış, geçici görseller, GPT gelince olanlar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
