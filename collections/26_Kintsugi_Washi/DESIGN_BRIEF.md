# Tasarım 26 — Kintsugi & Washi · tasarım özeti (yeniden tasarım, 2026-10-22)

Kaynak: `docs/35_22_32_YENIDEN_TASARIM.md` (§3 ortak kalite standardı, §4 satır 26). Önceki sürüm (`docs/24`, G164; Codex
`envelope-v3` kapağı, 18–20 Ekim) kullanıcı tarafından "amatör" bulundu: katmanlı GPT parçası yoktu, açılışta kanatlar
siyah kenarlı düz panellere dönüşüyordu, kapak yoğun çiçek zemininde boğuluyordu. Bu sürüm 39–48 hattıyla baştan kurulur.
Tema id `kintsugi-washi`. Çalışma adı marka değildir.

**Ruh:** el yapımı çivit boyalı washi kâğıdına sarılmış bir davet: kâğıt dört kanatlı bir **tatō** (fırıldak katlama)
paketi gibi katlanmış, kanatların üstünden kırık bir seramiğin altınla onarıldığı gibi **kintsugi damarları** geçiyor;
ortada altınla onarılmış küçük bir porselen düğme ve ona sekiz şeklinde dolanan altın-fildişi bükme kordon. Fikir:
"kırılan yerden daha güzel birleşmek" — sakin, saygılı, romantik ve zengin. Klasik ve geniş beğeni (AGENTS şart 5); bir
kültürün kostümü ya da klişesi değil.

**Kültürel saygı:** washi, kintsugi ve tatō katlama zanaat olarak kullanılır. **Dini simge yok** (tapınak, torii, Buda,
tütsü, muska yok); **kanji/kana ya da herhangi bir yazı yok** (metin İngilizce ve HTML); kimono, pagoda, kâğıt fener,
yelpaze, geyşa, kiraz çiçeği yok. Tek çiçek: ince bir beyaz erik (ume) dalı, ölçülü.

**En yakın tasarımlardan farkı:**
- **34 Red Lacquer & Double Happiness:** orada kırmızı kâğıt zarf, ip-düğme kapama ve kâğıt kesim (jianzhi) pencere katları;
  burada çivit washi, kesim yok, **dört üçgen kanatlı fırıldak katlama**, kanatlar tek tek kendi taban kenarında açılır;
  kordon zarfı yatay saran bir bükme kordon bandıdır, düğme **kintsugi onarımlı porselen**; palet kırmızı-altın değil
  çivit-pirinç kâğıdı-altın.
- **07 Cherry Blossom Spring:** orada pembe kiraz çiçeği ve bahar; burada çiçek yalnız ince bir beyaz erik dalı, ana
  malzeme kâğıt ve altın onarım, renk çivit.
- **36 Victorian Glasshouse / 41 Painted Lily Pond:** sicim/tuval yok; tek kapak değil dört kanat.
- **Önceki 26 (envelope-v3):** düz panel dilimleri ve yoğun çiçek zemin bırakıldı; her kanadın dış ve iç yüzü ayrı GPT
  parçası, kapak sakin washi zemin.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | **Kare tatō paketi** (1:1): çivit boyalı washi, altın kintsugi damarları; dört üçgen kanat fırıldak düzeninde (tepeleri merkezin biraz ötesine, saat yönünde kaymış). Kapanış: paketi yatay saran **altın-fildişi bükme ipek kordon**, uçları ortadaki **kintsugi onarımlı porselen düğmeye** sekiz şeklinde dolanmış. Dokununca düğme yarım tur döner (kordon çözülür gibi) ve kalkıp söner → kordon bandı gevşeyip kayar → kanatlar **K → D → G → B** sırasıyla 220 ms arayla kendi taban kenarlarında 3B açılır (iç yüzler: altın pullu boyasız washi, damar devam eder) → altın pullu iç taban görünür → pirinç kâğıdı kart merkezden izleyiciye doğru yükselir → altın varak pulu, çivit mürekkep damlası, erik yaprağı süzülür → home |
| Fotoğraf sunumu | Yırtık kenarlı **washi paspartu** (çivit ve pirinç kâğıdı), köşesinden altın kintsugi dikişi geçer; foto merkezden yayılan **sumi mürekkep lekesi** maskesiyle (GPT `ink_bloom`) belirir. Story'de üç an sol–sağ–sol (story_2 yatay paspartu); mekân geniş el yırtığı washi |
| Dekor ailesi | Çivit washi, boyasız pirinç kâğıdı, altın kintsugi damarları ve dikişleri, kintsugi onarımlı porselen düğme ve çay kâsesi, bükme ipek kordon, beyaz erik dalı, sumi mürekkep, altın varak pulları |
| Teknik | Fotogerçekçi kâğıt/porselen/altın ürün çekimi (el yapımı washi lifleri, gerçek altın lake, sırlı porselen) |
| Font | **Allura** (isimler, başlıklar) + **Shippori Mincho** (gövde, büyük harf satırlar) — Google Fonts, latin-ext (değişmedi) |
| Ana palet (`indigo-gold-rice`) | indigo `#242E58` · night `#161C36` · inner indigo `#3C4874` · rice `#F3ECDC` · gold `#C9A55A` · gold light `#E3C987` · gold ink `#7A5C22` · ink `#1D2340` |
| Hareket imzası | Porselen düğmenin dönüp kalkması + kordonun çözülmesi, dört kanadın fırıldak sırasıyla tek tek açılması, kartın merkezden öne yükselmesi, altın damar parıltısı (kanat üstünde ışık süpürmesi, GPT damarı üzerinde maske), mürekkep yayılımıyla foto, süzülen altın varak pulları |

## Palet `indigo-gold-rice`
- indigo `#242E58` — washi dış yüzü, paspartular, koyu bantlar
- night `#161C36` — en koyu çivit, kanat gölgesi, alt bilgi
- inner indigo `#3C4874` — çivit açık tonu, mürekkep yayılımı kenarı
- rice `#F3ECDC` — sayfa zemini, kart, kanat iç yüzleri
- gold `#C9A55A` — kintsugi damarları, kordon, varak
- gold light `#E3C987` — altın ışığı, parıltı
- gold ink `#7A5C22` — altın gölgesi, ince çizgiler
- ink `#1D2340` — gövde metni
- Işık: yumuşak **kuzey penceresi ışığı sol üstten**; altın lakede sıcak, temiz vurgu (bütün parçalarda aynı).

## Fontlar
- **Allura** — isimler, başlıklar.
- **Shippori Mincho** — gövde, büyük harf satırlar, tarih ve program (yalnız Latin glifleri kullanılır).
- Google Fonts; font dosyası hiçbir pakete girmez (AGENTS şart 9).

## Motifler
Dört üçgen kanatlı tatō paketi · altın kintsugi damarları (kanat başına kendi damarı, kenarlara ulaşır) · kintsugi
onarımlı beyaz porselen düğme · altın-fildişi bükme ipek kordon · altın pullu boyasız washi iç yüz · yırtık kenarlı washi
paspartular · sumi mürekkep lekesi (maske) · altın kintsugi dikişi ayırıcı · onarımlı çay kâsesi (imza) · beyaz erik dalı
(köşe) · altın varak pulu, çivit mürekkep damlası, erik yaprağı (süzülen). Yazı, rakam, monogram, kanji/kana, logo, QR
hiçbir görselde yok; isimler ve tarih HTML.

## Neden satar (gözleme dayalı gerekçe; satış iddiası değil)
- Çivit + fildişi + altın, pazarın sık görülen "lacivert-altın" ailesine (docs/13 §2) uyar ama malzeme dili (washi,
  kintsugi) katalogda tek.
- "Kırılan yerden altınla birleşmek" hikâyesi düğün mesajına doğrudan bağlanır; ilan metninde güçlü bir duygu cümlesi.
- Açılış akılda kalır ve pazarın standardından farklıdır: tek kapak yerine dört kanat fırıldak gibi açılır.
- Sakin, sade-zengin dengesi bahçe, sonbahar ve minimal-klasik düğünlere uyar; kostüm/klişe yok, geniş beğeniye açık.

## Sayfalar
- **index:** açık pirinç kâğıdı (washi) zemin, seyrek altın lif; üstte "Together with their families" + Allura isimler
  (HTML); ortada kordonlu, düğmeli kapalı tatō paketi (ekran eninin ~%70'i, açık kanatlar için sahne ölçeği); altta
  tarih · şehir ve "Tap to open"; köşede Skip hapı ve ses. Yoğun çiçek yok; erik dalı yalnız sağ üst köşede küçük.
- **home:** pirinç kâğıdı kart (çivit washi portre paspartusu, isimler, tarih, mekân; köşede erik dalı) → davet bandı
  (tam adlar, üç satır tarih, RSVP, geri sayım, takvim; altın dikiş ayırıcı) → hikâye tanıtımı (paspartu + mürekkep
  yayılımı) → günün ilk 4 satırı → imza (onarımlı çay kâsesi, isimler, tekrar aç).
- **story:** üç an sol–sağ–sol; dikey/yatay washi paspartu, foto mürekkeple belirir, paspartunun altın dikişi parlar.
- **details:** pirinç kâğıdında program (altın dikiş ayırıcı), geniş el yırtığı washide mekân fotoğrafı, harita, G138
  blokları (travel, dress code, registry, SSS, menü).
- **rsvp:** pirinç kâğıdı form kartı; gönderince altın varak pulları süzülür, kâse parlar; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Naomi & Kai — Naomi Ellis Hart & Kai Matthew Arden; Stillwater Garden Pavilion,
  Hood River, Oregon; October 9, 2027, 4:00 PM, America/Los_Angeles; program: Ceremony · Cocktail hour · Dinner &
  dancing; Garden formal; RSVP September 1, 2027; URL ve medya null) — değişmedi.
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5R website katmanları W1–W24 = 26 dosya; PAKET 2 örnek fotoğraflar
  **var**; PAKET 6R basılı davetiye ön/arka, yeni dosya adları); prova şekli `assets/gpt/kuru_sekil.json`.
- Tema: `platform/themes/kintsugi-washi/` **yeniden kuruldu** (G426, 2026-10-22; 39 pilot yapısı, `docs/34`, pilot G423
  dersleri `docs/35` §6a) — GPT parçaları G226 (PAKET 5R 26 dosya, PAKET 6R 2 dosya). Durum: **editable_draft**, katalogda
  `preview` ("Coming soon"); satış yok. Katalog kapak görüntüsü/klibi henüz eski (yeniden yakalama bekliyor); paletler
  (`variants`) eski sanatla kaldırıldı, yeni sanattan yeniden üretilecek.
- Etsy taslağı: `package/listing/listing_v3.md` ve PAKET 3 ilan sahneleri eski görünüme göre; tema kurulunca yeniden.
