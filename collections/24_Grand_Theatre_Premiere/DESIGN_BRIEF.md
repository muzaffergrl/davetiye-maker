# Tasarım 24 — Grand Theatre Premiere · tasarım özeti (yeniden tasarım, 2026-10-22)

Kaynak: `docs/35_22_32_YENIDEN_TASARIM.md` (22–32 yeniden tasarım; §3 ortak kalite standardı, §4 satır 24). İlk sürüm
`docs/24_YENI_TASARIMLAR.md` (dalga 23–28) + G162; 18–20 Ekim Codex kapağı (`envelope-v3`, düz kadife gatefold) bu
sürümle **geçersiz**. Tema id `grand-theatre-premiere`. Çalışma adı marka değildir. Katalog: `tools/katalog.py`
`EK_TEMALAR`.

**Akım:** gala gecesi / opera binası — kadife perde, varaklı proscenium, fildişi tiyatro programı, bilet koçanı. Akşam
ve black tie düğünleri, tiyatro/müzik sever çiftler; klasik ve geniş beğeni. Gerçek bir tiyatroya, gösteriye, markaya
ya da sanatçıya benzemez; programda ve bilette yazı yoktur.

**Ruh:** Belle Époque bir opera binasında prömiyer gecesi: tavus mavisi keten zarf bir sahneye dönüşür, iki bordo kadife
perde ortada altın püsküllü kordonla bağlıdır, kordonun altında boş bir bilet koçanı. Misafir bileti yırtar, kordon
çözülür, perdeler ağır kıvrımlarla aralanır, spot ışığı sahneyi tarar ve davet kartı sahneden yükselir. Klasik, romantik,
zengin (AGENTS şart 5).

**En yakın tasarımlardan farkı:**
- **06 Art Deco Black-Tie (gatefold):** orada düz geometrik iki kapı; burada yumuşak kadife **perde** kanatları, saçaklı
  sabit perde başlığı, püsküllü kordon ve yırtılan bilet; açılış ışık + perde fiziği.
- **23 Velvet Jewel Box:** orada patlıcan kadife kare zarf + yüzük + loblu kapak; burada yatay sahne zarfı, iki yan
  kanat, tavus mavisi + bordo.
- **39 Silver Photo Booth / 47 Monochrome Darkroom:** perde/sahne yok onlarda; burada sinema/kabin yok, tek mekân
  tiyatro sahnesi.
- **35 Highland Tartan:** kapanış toka/kayış değil, kumaş kordon + bilet.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | **Yatay ≈1,45:1 sahne zarfı**, tavus mavisi keten. Ön yüzü **iki yan kanat = bordo kadife perde** (dış kenarlarından menteşeli, ortada hafif bindirmeli buluşur, alt kenarlarında altın saçak) + üstte sabit **saçaklı perde başlığı** (valance). Kapanış: perdeleri ortada toplayan **altın püsküllü kordon** + kordonun altına sıkıştırılmış boş **bilet koçanı** (fildişi, delikli yırtma çizgisi, ince altın kenar). Dokununca bilet kordonun altından yukarı kayar ve delikli çizgiden **ikiye yırtılır** (koçan süzülerek düşer) → kordon gevşer, püsküller sallanarak düşer → salon ışığı kısılır → perdeler dış menteşelerinde **3B** açılır (sol önce, sağ 140 ms sonra; iç yüz altın ipek astarlı kadife) → **spot ışığı** soldan sahneyi tarar, ayak lambaları yanar → astardaki boyalı sahneden fildişi program kartı yükselir, cep dudağını geçince öne gelir → altın konfeti + gül yaprakları → home |
| Fotoğraf sunumu | Home: varaklı **proscenium kemeri** portre çerçevesi (üstte kadife perde drapesi). Story: **program sayfası** kartları (fildişi, altın çift çizgi, köşede püskül) — "Act I–III"; spot ışığı dokunulan/kaydırılan kartı aydınlatır, kart sayfa çevirir gibi girer. Details: geniş varaklı proscenium içinde mekân (yanlarda toplanmış perdeler) |
| Dekor ailesi | Bordo kadife perde, altın bullion saçak ve püskül, varaklı akantus kıvrımları, fildişi program kâğıdı, bilet koçanı, antik pirinç opera dürbünü, bordo ve fildişi gül |
| Teknik | Fotogerçekçi ürün çekimi (kadife, keten, varak, kâğıt, pirinç) + astarda yağlı boya sahne resmi |
| Font | **Abril Fatface** (isimler, başlıklar) + **Playfair Display** (gövde, büyük harf satırlar) — Google Fonts, latin-ext (değişmedi) |
| Ana palet | pit `#061416` · velvet `#0E3D40` · peacock `#16595B` · antique gold `#C9A45C` · ivory `#F3EBD8` · ink `#1E2626` + **vurgu (yeni):** burgundy velvet `#5E1622` · burgundy deep `#3A0C14` |
| Hareket imzası | Biletin yırtılması (kapanış), püsküllerin sarkaç gibi düşmesi, perdelerin kademeli 3B aralanması, salon ışığının kısılması + spot taraması (CSS ışık), program sayfası çevirme geçişi, RSVP gönderiminde yeni bir biletin delikten yırtılması |

## Palet
- pit `#061416` — salon karanlığı, kısılan ışık örtüsü
- velvet `#0E3D40` — zarf keteni gölgesi, koyu bantlar
- peacock `#16595B` — zarf keteni, kadife bant zemini
- burgundy velvet `#5E1622` — perdeler, gül (vurgu)
- burgundy deep `#3A0C14` — perde kıvrım gölgesi
- antique gold `#C9A45C` — saçak, püskül, varak, çizgiler
- ivory `#F3EBD8` — program kâğıdı, kart, sayfa zemini
- ink `#1E2626` — gövde metni
- Işık: sıcak sahne ışığı **sol üstten** (bütün parçalarda aynı); varakta yumuşak sıcak parıltı.

## Fontlar
- **Abril Fatface** — isimler, başlıklar (afiş ağırlığı).
- **Playfair Display** — gövde, italik vurgular, büyük harf satırlar, program.
- Google Fonts; font dosyası hiçbir pakete girmez (AGENTS şart 9).

## Motifler
Bordo kadife perde (ağır dikey kıvrımlar, altın bullion saçak) · saçaklı sabit perde başlığı · altın püsküllü kordon ·
boş fildişi bilet koçanı (delikli yırtma çizgisi) · yağlı boya küçük sahne (astar) · pirinç ayak lambası kapçıkları ·
varaklı proscenium kemeri · fildişi program sayfası · akantus kıvrımlı varak ayırıcı · antik pirinç opera dürbünü · bordo
ve fildişi gül. Yazı, rakam, monogram, logo, QR hiçbir görselde yok; isimler, tarih ve program HTML.

## Neden satar (gözleme dayalı gerekçe; satış iddiası değil)
- Pazarın giriş bileti olan tıkla-aç zarf korunur, üstüne akılda kalan bir sahne anı eklenir: bilet yırtılır, perde açılır.
- Kadife + altın + fildişi, akşam/black tie düğünlerinde sık görülen "zengin" renk ailesi; tiyatro teması niş ama geniş
  beğeniye açık (opera binası, gala, Belle Époque).
- Kapanış etkileşimli ve fiziksel: misafir dokunur, bir şey yırtılır ve açılır (yalnız zoom/fade değil, AGENTS şart 4).

## Sayfalar
- **index:** fildişi program kâğıdı zemin, "Together with their families", Abril Fatface isimler (HTML), ortada perdeli
  kapalı sahne zarfı (kordon + bilet), altta "October 16, 2027 · Richmond" ve "Tap to open", köşede Skip hapı ve ses.
- **home:** proscenium portre çerçevesi + isimler, tarih, mekân (program kartı) → tavus mavisi kadife bantta davet (tam
  adlar, tarih, RSVP, geri sayım, takvim) → hikâye tanıtımı (program sayfası) → gün/program özeti (akantus ayırıcı) →
  imza (opera dürbünü, isimler, "Replay the envelope").
- **story:** üç an "Act I–III" (Opening night · The proposal at intermission · Our curtain call), sol–sağ–sol program
  sayfalarında; spot ışığı ve sayfa çevirme.
- **details:** program kâğıdında akış (The ceremony 5:00 PM … First dance & encore 9:00 PM), geniş proscenium içinde
  mekân fotoğrafı, harita, G138 blokları (travel, dress code, registry, SSS).
- **rsvp:** fildişi form kartı; gönderince yeni bir bilet delikli çizgiden yırtılır ve altın konfeti düşer; teşekkür modu
  kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Charlotte & Theodore, The Larkmont Grand Theatre — kurgu mekân, Richmond,
  Virginia; 16 Ekim 2027; URL'ler null) — değişmedi.
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5R website katmanları W1–W21 = 23 dosya, PAKET 2 örnek fotoğraflar
  **var**, PAKET 6R basılı davetiye ön/arka); prova şekli `assets/gpt/kuru_sekil.json`. GPT görevi **G224** (G222–G232).
- Tema: `platform/themes/grand-theatre-premiere/` **yeniden kuruldu** (G424, 2026-10-22; G423 pilotunun yapısı, `docs/34`,
  dersler `docs/35` §6a) — GPT parçaları G224 (PAKET 5R 23 dosya, PAKET 6R 2 dosya). Durum: **editable_draft**, katalogda
  `preview` ("Coming soon"); satış yok. Katalog kapak görüntüsü/klibi henüz eski (yeniden yakalama bekliyor). Ölçülen
  sapmalar: zarf 1,59:1 (istenen ≈1,45), bilet yırtma çizgisi tuvalin %56,3'ünde (istenen %54,6) — tema ölçüleni kullanır.
- Basılı davetiye: `platform/lib/print/layouts.ts` (`'grand-theatre-premiere'` bloğu; PAKET 6R `_r_5x7` zeminleri, kutular
  görselde ölçüldü, G424). İlan taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41; görseller tema kurulunca yenilenir).
- Ertelenen: paletler (variants) yeni sanattan yeniden üretilecek; font-fallback ölçümü yeniden koşulmadı.
