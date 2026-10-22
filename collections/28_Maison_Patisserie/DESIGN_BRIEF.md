# Tasarım 28 — Maison Pâtisserie · tasarım özeti (2026-10-22 yeniden tasarım)

Kaynak: `docs/35_22_32_YENIDEN_TASARIM.md` (22–32'nin 39–48 kalitesine yeniden tasarımı; §3 ortak standart, §4 satır 28).
İlk sürüm `docs/24_YENI_TASARIMLAR.md` #28 + G166 (pasta kutusu); 18–20 Ekim Codex kapağı (`envelope-v3`) ve iç sayfaları
bu sürümle **tamamen** değişir. Tema id `maison-patisserie`. Çalışma adı marka değildir. Katalog: `tools/katalog.py`
`EK_TEMALAR` dalga kaydı (tema yeniden kurulurken eksenler bu tabloya göre güncellenir).

**Akım:** "Parisian pâtisserie" düğün kırtasiyesi — fıstık yeşili ve gül pembesi pastane kutuları, kurdeleli kılıf
bantlar, dantel kâğıt (doily), makaron, şeker inci, altın kenarlı porselen. **Alınan** yalnız akım ve özellik: pastel
pastane paleti, kurdeleli paket açma hissi, tıkla-aç zarf (pazarda giriş bileti). **Alınmayan:** hiçbir ilanın düzeni,
çizimi, fotoğrafı, font eşleşmesi, metni ya da adı; gerçek bir pastanenin, markanın, kutu tasarımının ya da logosunun
izi. Bu tasarım akımın özgün yorumudur.

**Ruh:** Sabah ışığında bir Paris pastanesinin vitrini: krem çizgili pastane kâğıdı, fıstık yeşili dantel kenarlı zarf,
üstünde gül pembesi bir kılıf bant ve şekerlenmiş gül goncalı saten fiyonk — bir kutu makaron hediye eder gibi davet.
Tatlı, aydınlık, zarif; klasik, romantik, zengin ve geniş beğeni (AGENTS şart 5). Çocuksu/karikatür pasta estetiği yok.

**En yakın tasarımlardan farkı:**
- **46 Bordeaux Silk Bow:** orada bordo saten fiyonk fildişi keten zarfın **deliklerinden** geçer ve ilmek ilmek çözülür,
  kurdele sayfa boyunca akar; burada fiyonk **kâğıt kılıf bandın** üstündedir, çözülünce bant kurdelesiyle birlikte zarftan
  **sağa kayarak** çıkar; palet fıstık-gül-krem, zarf dantel kâğıt kenarlı.
- **43 Chartreuse Garden Party:** orada yatay zarfın kapağı dalgalı ve yarıklarından tek çiçek sapı geçer, guaj çiçekler
  patlar; burada kapak **sığ dantel (doily) tarak** kenarlı, kapanış kılıf bant + fiyonk, dekor çiçek değil pastane
  (makaron, şeker inci, porselen tabak).
- **03 Blush Garden Rose:** orada V kapak + mum mühür + gül bahçesi; burada mühür ve V yok, gül yalnız şekerlenmiş gonca
  ve küçük köşe demeti; pembe tek başına değil fıstık yeşiliyle.
- **40 Swan Chantilly Lace:** orada gerçek ipek dantel örtü; burada dantel yalnız **kâğıt doily baskısı** (astar ve kapak
  kenarı), tül değil kâğıt.
- **Eski 28 (kutu):** kapalı nesne artık kutu değil zarf (K23 sıkı); vitrin rafı fikri iç sayfalarda kalır.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Yatay **krem pamuk kâğıt zarf** (≈1,3:1), **sığ dantel (doily) tarak kenarlı fıstık yeşili kapak**; kapanış: zarfı yatay saran **gül pembesi kılıf bant** (iki kenarı ince altın tarak), bandın ortasında boydan boya **gül saten kurdele** ve ortada **fiyonk**, düğümünde **şekerlenmiş gül goncası**. Dokununca gonca eğilip yuvarlanarak düşer → fiyonk çözülür (bağlı → çözülmüş uçlar) → kılıf bant kurdelesiyle birlikte **sağa kayarak** zarftan çıkar → tarak kapak üst kenarında **3B** açılır, iç yüzü gül pembesi doily baskılı astar → krem kart ön cebin arkasından yükselir, dudağı geçince öne gelir → makaronlar ve şeker inciler hafifçe zıplayarak düşer → home |
| Fotoğraf sunumu | **Vitrin rafı:** story'deki üç an altın kenarlı **porselen pasta tabağı** yuvarlak çerçevelerde, altın konsollu cam vitrin rafında; raf yana kayar (dokunmatik kaydırma, sürükleme, ‹ ›, ← →), ortadaki tabak öne çıkıp hafifçe döner. Home portresi **krema sıkma (royal icing) dantelli oval** çerçevede; mekân **fıstık yeşili ahşap pastane vitrini** (kemerli üst, çizgili tenteli) içinde |
| Dekor ailesi | Dantel kâğıt (doily), gül saten kurdele, şekerlenmiş gül goncası, fıstık-gül makaronlar, gümüş/altın şeker inciler (dragée), altın kenarlı porselen, krema sıkma dantel, küçük gül + fıstık yaprağı demeti |
| Teknik | Fotogerçekçi ürün çekimi (kâğıt, saten, porselen, şeker, makaron) — sabah pencere ışığı |
| Font | **Parisienne** (isimler, başlıklar) + **Italiana** (gövde, büyük harf satırlar) — Google Fonts (mevcut; değişmedi) |
| Ana palet (`pistachio-rose-cream`) | pistachio `#A9C49C` · deep pistachio `#4F6D49` · rose `#E8B4B8` · deep rose `#9B4F5A` · cream `#FBF5EC` · gold `#B8995A` |
| Hareket imzası | Gonca yuvarlanıp düşer, fiyonk çözülür, **kılıf bant sağa kayar**, dantel kapak 3B açılır, makaron ve şeker inci zıplaması; story'de kayan vitrin rafı ve öne gelen tabak; RSVP gönderilince şeker inci yağmuru |

## Palet `pistachio-rose-cream`
- pistachio `#A9C49C` — zarf kapağı, makaron, ayırıcı vurgu
- deep pistachio `#4F6D49` — başlık vurgu, vitrin ahşabı gölgesi, düğme
- rose `#E8B4B8` — kılıf bant, kurdele, astar, makaron
- deep rose `#9B4F5A` — isim vurgusu, kurdele gölgesi, bağlantılar
- cream `#FBF5EC` — zarf kâğıdı, kart, sayfa zemini
- gold `#B8995A` — tarak kenarlar, porselen kenarı, şeker inciler (seyrek)
- Yardımcı (yalnız metin/gölge): cream shade `#F1E8D8` · ink `#3E3A32`
- Işık: yumuşak **sabah pencere ışığı sol üstten**; bütün parçalarda aynı.

## Fontlar
- **Parisienne** — isimler, başlıklar.
- **Italiana** — gövde, büyük harf satırlar, tarih ve program.
- Google Fonts; font dosyası hiçbir pakete girmez (AGENTS şart 9).

## Motifler
Dantel tarak kenarlı fıstık yeşili kapak · gül pembesi doily baskılı astar · altın tarak kenarlı gül pembesi kılıf bant ·
gül saten kurdele + fiyonk · şekerlenmiş gül goncası · krema sıkma dantelli oval çerçeve · altın kenarlı porselen pasta
tabağı · altın konsollu cam vitrin rafı · fıstık yeşili kemerli pastane vitrini + çizgili tente · küçük porselen pasta
standında makaronlar · makaron, şeker inci, gül yaprağı. Yazı, rakam, monogram, logo, marka, QR hiçbir görselde yok;
isimler ve tarih HTML.

## Neden satar (gözleme dayalı gerekçe; satış iddiası değil)
- Pastel fıstık-gül paleti ve "tatlı masası" estetiği bahar/yaz bahçe düğünlerinde ve brunch düğünlerinde sık görülen bir
  dil; fildişi/krem zemin pazarın en yaygın renk ailesiyle uyumlu (`docs/13` §2).
- Açılış bir hediye paketi açma ritüeli: gonca, fiyonk, kayan kılıf, kapak — dört ayrı ve tanıdık an; ilk ekran net ve
  sakin (yoğun çiçek zemin yok, isimler okunur).
- Vitrin rafı kaydırması dokunmatikte oyuncaklı ve akılda kalan bir iç sayfa bileşeni.

## Sayfalar
- **index:** krem ince fıstık çizgili pastane kâğıdı zemin, "Together with their families", Parisienne isimler (HTML),
  ortada kılıf bantlı + fiyonklu kapalı zarf (ekran genişliğinin ~%80'i), altta tarih · şehir ve "Tap to open", köşede Skip.
- **home:** krema dantelli oval portre (üstte açılışta düşen gonca küçük süs olarak kalır) → krem kart (isimler, tarih,
  mekân; köşede küçük gül demeti) → davet bandı (tam adlar, tarih, RSVP, geri sayım, takvim) → hikâye tanıtımı (tek porselen
  tabak) → gün özeti → imza (makaronlu pasta standı, isimler, tekrar aç).
- **story:** altın konsollu cam vitrin rafında üç porselen tabak; raf kayar, ortadaki öne çıkar; başlıklar tabakların altında.
- **details:** krem program kartı (ayırıcı), fıstık yeşili pastane vitrininde mekân fotoğrafı, harita, G138 blokları (Travel
  & stay, Meal & menu vitrin rafı, dress code, registry, SSS).
- **rsvp:** krem form kartı (makaron renkli seçim çipleri); gönderince şeker inci yağmuru; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Camille & Oliver, The Belle Rive Orangery, Newport, Rhode Island; June 12, 2027,
  4:00 PM, America/New_York; URL ve medya null; menü dolu) — değişmedi.
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5R website katmanları W1–W20 = 22 dosya, PAKET 2 örnek fotoğraflar
  **var**, PAKET 6R basılı davetiye ön/arka yeni adlarla); prova şekli `assets/gpt/kuru_sekil.json`.
- Tema: `platform/themes/maison-patisserie/` şu an Codex `envelope-v3` sürümü; **yeniden kurulacak** (G422–G432, `docs/35`
  §6), GPT parçaları G222–G232. Durum: **coming**.
- Etsy taslağı: `package/listing/listing_v3.md` (K41: yayımlanmadı); PAKET 3 ilan sahneleri tema kurulunca yeniden yazılır.
