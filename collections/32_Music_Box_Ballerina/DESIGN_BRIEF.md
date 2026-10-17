# Tasarım 32 — Music Box Ballerina · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` #32 (2. dalga 29–32, 2026-10-17) + G171 (platform teması). Katalog:
`tools/katalog.py` `EK_TEMALAR` dalga kaydı (6 eksen + hareket imzası; `katalog.py kontrol` → `ek_ayirt`).
23 Velvet Jewel Box'tan (menteşeli kadife yüzük kutusu) açıkça ayrı: kadife değil **lake**, fiyonk değil **kurma
anahtarı**, kart yükselmesinin yanında **dönen balerin** ve **aynada fotoğraf**, mor değil **gül kuvarsı**; 28 Maison
Pâtisserie'den ayrı: üstten pasta kutusu değil, **önden müzik kutusu**.

**Ruh:** saklanacak bir müzik kutusu — gül kuvarsı lake, pudra saten, yumuşak altın; anahtarı çevirince kapak açılır,
aynada çiftin portresi, küçük porselen balerin döner. Klasik, romantik, zengin; geniş beğeni.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Gül kuvarsı lake müzik kutusu (önden), sağ yanda pirinç kurma anahtarı; dokununca anahtar iki tur döner, kutu "tık" eder, kapak arka menteşede kalkar, aynalı iç kapak dikilir (aynada portre), balerin saten kuyudan yükselip yavaşça döner, birkaç gül yaprağı süzülür, kart kutudan yükselip öne gelir ve home'a uçar (VT) |
| Foto sunumu | Kapağın oval aynasında yansıyan fotoğraflar: tek tek; cam üstünde ışık parıltısıyla değişir, aynanın altındaki balerin her fotoğrafta çeyrek döner (kaydırma, ← → düğmeleri, ←/→/Home/End). Azaltılmış harekette oval fotoğraflar düz liste |
| Dekor ailesi | Saten astar, pirinç kurma anahtarı, tül, gül yaprakları |
| Teknik | fotogerçekçi + pastel |
| Font | Ballet (isimler, başlıklar) + Gilda Display (metin) — Google Fonts; 28 tasarımın hiçbirinde yok |
| Ana palet | rose quartz `#EECDD0` · blush `#F7E4E2` · rose gold `#B76E79` · deep rose `#8A4A55` · cream `#FFF8F4` · soft gold `#C9A45C` |
| Hareket imzası | Kurma anahtarının dönüşü (ses yalnız dokunuştan sonra), kapak menteşesi, balerinin yavaş pirueti (GPT kare dizisi → CSS sprite; 2B döndürme yedeği), aynada parıltılı foto geçişi, az sayıda süzülen gül yaprağı (azaltılmış harekette yok), oval "ayna" sayfa geçişi, sahne adımları hafifçe dönerek gelir |

## Ses (G126)
Yeni müzik yok: tasarımın varsayılan parçası katalogdaki **Music Box** (kodla sentezlenmiş ninni, `public/audio/LICENSES.md`).
Açılış efektleri (klips ×2 anahtar, sayfa sesi kapak, çan balerin dönerken, kayış kart, çan öne gelirken) yalnız
misafirin dokunuşundan sonra; platformun ses düğmesi susturur. Ezgi Story sayfasında çalar (motor kuralı).

## Sayfalar (K23)
Kapalı müzik kutusu (index) → açılış → **home yeni sayfada** (kutudan çıkan kart: isimler, tarih; oval aynada portre ve
davet; geri sayım; takvim; hikâye tanıtımı; günün ilk anları; footer'da balerin) → Story (ayna) · Details (gün akışı,
mekân, harita, kıyafet, bloklar, ulaşım, menü, hediye listesi, SSS) · RSVP (gönderimde gül yaprakları + balerin bir tur)
· teşekkür modu.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Juliette & Arthur, The Rosewell Pavilion — kurgu mekân, Saratoga Springs, NY;
  May 22, 2027; US tarih; URL'ler ve fotoğraflar null)
- GPT: `assets/gpt/GPT_PROMPTS.md` — PAKET 5 (13 madde / 15 dosya: kutu katmanları, anahtar, balerin + iki dönüş şeridi,
  kart, 3 yaprak, zeminler, web_hero), PAKET 2 (5 örnek foto), PAKET 6 (ön/arka baskı zemini); `kuru_sekil.json` (G167 provası)
- Tema: `platform/themes/music-box-ballerina/` (README: açılış, geçici katmanlar, sayfalar, sınırlar)
- Etsy taslağı: `package/listing/listing_v3.md` (K41: yayımlanmadı)
