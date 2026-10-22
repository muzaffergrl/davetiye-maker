# Tasarım 29 — Celestial Observatory · tasarım özeti (yeniden tasarım, 2026-10-22)

Kaynak: `docs/35_22_32_YENIDEN_TASARIM.md` (22–32 yeniden tasarım; §3 ortak kalite standardı, §4 satır 29). İlk kurulum
G168 (2026-10-17) ve Codex `envelope-v3` kapağı (18–20 Ekim) **geçersiz**: kapak yeni katmanlı GPT parçalarıyla, tema 39
pilotunun yapısıyla baştan kurulur. Tema id `celestial-observatory` (değişmez). Katalogda `tools/katalog.py`
`EK_TEMALAR`. Çalışma adı marka değildir.

**Akım:** gök/yıldız atlası düğünü — gece mavisi, altın varak, antika pirinç gökbilim aletleri. **Alınan** yalnız akım:
gece mavisi + altın palet, yıldız haritası fikri, tıkla-aç zarf (pazarda giriş bileti). **Alınmayan:** hiçbir ilanın
düzeni, çizimi, fotoğrafı, font eşleşmesi, metni ya da adı; burç simgeleri, bilimkurgu/planetaryum estetiği (neon,
renkli bulutsu, roket, lens parlaması).

**Ruh:** 18. yüzyıl bir gözlemevinin kütüphanesi: gece mavisi kâğıt, gümüş-fildişi harita kâğıdı, kazınmış altın varak
takımyıldızlar ve elde aşınmış bir pirinç usturlap. Zarf kapalıyken usturlap kapağın ucunda bir mühür gibi durur;
açılınca kapak dik kalkar ve **gözlemevi kubbesinin** silueti olur. Sakin, büyülü, klasik, romantik ve zengin; geniş beğeni
(AGENTS şart 5).

**En yakın tasarımlardan farkı:**
- **19 Midnight Garden:** orada siyah zemin, gül, mum; burada çiçek ve mum yok, gece mavisi kâğıt + pirinç alet + yıldız
  atlası.
- **22 Nocturne Lake Estate:** o da koyu kapak ama kömür laid kâğıt, elmas kapak, vellum bant + hilal broş, göl gecesi
  astarı; burada yarım daire kubbe kapak, iki parçalı usturlap (dönen rete), yıldız atlası astarı. Göl, villa, teras yok.
- **48 Navy Ivory Crest:** lacivert-fildişi ama keten cüzdan zarf, kör kabartma kartuş, arma; burada arma/kalkan yok,
  kapanış mekanik bir gökbilim aleti, kapak kubbe.
- **31 Sky Lantern Festival:** gece göğü onda alacakaranlık mor-kehribar ve kâğıt fener; burada derin gece mavisi ve metal.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Dikey **gece mavisi pamuk kâğıt zarf** (≈0,77:1), **yarım daire kubbe kapak** (üst kenarda menteşe, serbest kenarı tek yarım daire; altın folyo takımyıldız gravürü). Ön cebin üst kenarı kapağın yayına koşut **içbükey yarım daire kesik** (kubbe penceresi). Kapanış: kapağın ucuna takılı **pirinç usturlap** — sabit ana disk (`astro_plate`, yalnız çentik çizgileri, rakam/harf yok) + üstünde dönen, dantel gibi oyulmuş **rete** (`astro_rete`). Dokununca rete 120° döner, yıldız uçları sırayla parlar → usturlap kalkıp ekranın üstüne süzülür (home'da imza süsü) → kubbe kapak 3B açılır; iç yüzü gece mavisi kubbe içi, altın varak meridyen dilimleri → yıldız atlası astarı görünür → harita kâğıdı kart cebin arkasından yükselir → yıldızlar tek tek yanar, hilal süzülür → home |
| Fotoğraf sunumu | **Planisfer** pirinç halkası (yuvarlak 1:1 foto); dış derece halkası ayrı parça, sayfa kaydırıldıkça döner; foto "kadran süpürmesiyle" (merkez etrafında bir tur dönen konik maske) belirir. Home portresi altın varak ışınlı **gök madalyonu**. Mekân: pirinç çerçeveli geniş gök haritası panosu (16:9) |
| Dekor ailesi | Pirinç usturlap ve teleskop, gravür yıldız atlası, altın varak takımyıldız çizgileri, ay evreleri, hilal, küçük altın yıldızlar |
| Teknik | Bakır gravür + altın varak, fotogerçekçi pirinç ve kâğıt (ürün çekimi) |
| Font | **Imperial Script** (isimler, başlıklar) + **Forum** (gövde, büyük harf satırlar) — Google Fonts (değişmedi) |
| Ana palet (`midnight-silver-gold`) | midnight `#11193A` · night `#0A0F24` · chart paper `#EEEBE3` · silver `#C9CFDC` · silver light `#E6E9F1` · gold `#C8A24E` · gold light `#E2C27A` · gold ink `#7A5A1E` · brass `#9B7A3C` · ink `#141A33` |
| Hareket imzası | Rete dönüşü + usturlabın yukarı süzülüp "gök süsü" olması, kubbe kapağın dikilip gözlemevi silueti olması, yıldızların sırayla yanması, kaydırmayla dönen planisfer halkası, kadran süpürmesiyle foto |

## Palet `midnight-silver-gold`
- midnight `#11193A` — zarf kâğıdı, sayfa zemini (kapak sayfası koyu)
- night `#0A0F24` — derin gölge, zemin damarları
- chart paper `#EEEBE3` — kart, bantlar, form, astar kâğıdı
- silver `#C9CFDC` / silver light `#E6E9F1` — ikincil metin, ince gümüş çizgiler, yıldız tozu
- gold `#C8A24E` / gold light `#E2C27A` — varak, folyo, yıldızlar
- gold ink `#7A5A1E` — harita kâğıdındaki gravür mürekkebi
- brass `#9B7A3C` — usturlap, teleskop, halkalar
- ink `#141A33` — harita kâğıdında gövde metni
- Işık: yumuşak, serin **ay ışığı sol üstten**, pirinçte sıcak tek parlak vurgu (bütün parçalarda aynı).

## Fontlar
- **Imperial Script** — isimler, başlıklar.
- **Forum** — gövde, büyük harf satırlar, tarih, program.
- Google Fonts; font dosyası hiçbir pakete girmez (AGENTS şart 9).

## Motifler
Yarım daire kubbe kapak ve içbükey kubbe penceresi · iki parçalı pirinç usturlap (ana disk + oyma rete; yalnız çentik
çizgileri) · altın varak takımyıldız çizgileri ve yıldızlar · gravür yıldız atlası (koordinat yayları, noktalı
takımyıldız çizgileri; harf/rakam yok) · gök madalyonu (ışınlı altın çerçeve) · planisfer halkası · ay evreleri dizisi ·
küçük pirinç teleskop · hilal ay · yıldız tozu. Burç simgesi, yazı, rakam, monogram, logo, QR hiçbir görselde yok;
isimler ve tarih HTML. Baş harflerin takımyıldızı (isteğe bağlı) site tarafında 1 px UI çizgisidir, görsele pişmez.

## Neden satar (gözleme dayalı gerekçe; satış iddiası değil)
- Gece mavisi + altın, pazarın en sık görülen "akşam/black tie" renk ailelerinden; yıldız/gök teması akşam ve açık hava
  (çöl, dağ, gözlemevi) düğünlerine uyar.
- Kapanış tek bakışta anlaşılır ve akılda kalır: dönen bir usturlap; açılınca kapak bir gözlemevi kubbesi olur.
- Koyu kapak, 22–32'nin açık kapakları arasında katalogda ritim ve ayırt edilme sağlar.
- Çiçeksiz ama zengin: altın varak ve pirinç dokusu "lüks kırtasiye" algısı verir; erkek/kadın ayrımı olmayan geniş beğeni.

## Sayfalar
- **index:** gece mavisi kâğıt zemin (çok soluk gravür yıldız haritası), "Together with their families", Imperial Script
  isimler (HTML, altın açık), ortada usturlaplı kapalı zarf, altta tarih · şehir (August 14, 2027 · Flagstaff) ve
  "Tap to open", köşede Skip hapı + ses. Çiçek yok; en fazla bir köşe takımyıldız süsü, metnin altında değil.
- **home:** üstte açılışta süzülen usturlap → harita kâğıdı kart (gök madalyonunda portre, isimler, tarih, mekân) →
  davet bandı ("Written in the stars", ay evreleri ayırıcı, tam adlar, tarih, RSVP, geri sayım, takvim) → hikâye tanıtımı
  (planisfer) → günün ilk 4 satırı → imza (pirinç teleskop, isimler, "Open the envelope again").
- **story:** üç an sol–sağ–sol, üçü de planisfer halkasında (dış halka kaydırmayla döner, foto kadran süpürmesiyle);
  arka planda soluk gravür gök.
- **details:** harita kâğıdında program (ay evreleri ayırıcı), pirinç çerçeveli gök haritası panosunda mekân fotoğrafı
  (teleskop ışını gibi soldan sağa süpürülerek), harita, G138 blokları (travel, dress code, registry, SSS).
- **rsvp:** harita kâğıdı form kartı; gönderince altın yıldızlar yükselip sönerek dağılır; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Celeste & Rowan, Starlight Ridge Observatory Gardens, Flagstaff, Arizona;
  August 14, 2027, 7:00 PM, America/Phoenix; URL ve medya null) — değişmedi.
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5R website katmanları W1–W18 = 20 dosya, PAKET 2 örnek fotoğraflar
  **var**, PAKET 6R basılı davetiye ön/arka); prova şekli `assets/gpt/kuru_sekil.json`. GPT görevi **G229** (G222–G232).
- Tema: `platform/themes/celestial-observatory/` **yeniden kuruldu** (G429, 2026-10-22; G423 pilotunun yapısı, `docs/34`,
  dersler `docs/35` §6a) — GPT parçaları G229 (PAKET 5R 20 dosya, PAKET 6R 2 dosya). Durum: **editable_draft**, katalogda
  `preview` ("Coming soon"); satış yok. Katalog kapak görüntüsü/klibi henüz eski (yeniden yakalama bekliyor).
- Etsy ilanı ve PAKET 3/7 ilan sahneleri: tema yeniden kurulunca yeniden yazılır.
