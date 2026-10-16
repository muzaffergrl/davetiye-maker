---
id: G127
baslik: Harita ve yol tarifi — misafir sitesinde mekân haritası + "Get directions", panelde Day & place ayarları
rol: claude-kod
durum: inceleme
alan: claude-G127
oncelik: 1
bagimli: []
yazar: [docs/03_URUN_ICERIK_SEMASI.json, platform/lib/, platform/components/panel/, platform/app/api/edit/[slug]/map-link/, platform/public/static/, platform/themes/*/details.html, platform/tests/, platform/previews/g127/, gorevler/G127-harita-yol-tarifi.md]
---

## Amaç
Kullanıcı: "Davetiyelerin içine harita ve yol tarifi alma eklenebilsin." 20 temanın Details sayfasında mekân(lar) için tıkla-yükle
harita ve Google Maps / Apple Maps / Waze yol tarifi; API anahtarı yok, gizlilik önce; panelde (Day & place) mekân başına ayar.

## Sonuç
**2026-10-16 · claude-G127 — durum: inceleme.** Dal `claude/g127-harita` (taban `claude/zealous-fermi-hy1o40`). Yayın yok, main yok.

**Veri (şema eki, docs/03 + `lib/content/schema.ts` senkron):** `maps.venue` = ana mekânın ayarları (`label`, `show_map`,
`show_directions`, `lat`, `lng`); `maps.reception` = ayrı resepsiyon mekânı (`name` zorunlu, `address`, `city`, `link` + aynı ayarlar)
ya da null. Ana mekânın linki mevcut `urls.map`. `show_*` yoksa: sokak adresi, pin ya da linkten okunabilen yer adı varsa açık.
Doğrulayıcıya `minimum`/`maximum` eklendi (lat/lng aralığı). Demo kayıtlarda adres yok → demolarda harita kapalı.

**Misafir tarafı (ortak parça, temalar şişmedi):** `lib/maps.ts` (link → pin: Google `!3d!4d`, `@lat,lng`, `q=`/`destination=`,
Apple `ll=`/`daddr=`, Waze, OSM; yer listesi, embed/yol tarifi URL'leri), `lib/theme/map-block.ts` (işaretleme), motor `data-map`
işareti. Her temanın details.html'inde yalnız "View map" satırı değişti: sarmalayıcı `data-if="map_block"`, eski link
`data-if="urls.map !map_on"` (harita kapalıysa eski davranış), yanına `<div data-map data-map-btn="btn btn-ghost"
data-map-btn-sm="btn btn-ghost btn-sm">`. Düğmeler temanın kendi sınıfları; yazı tipi/renk `inherit`/`currentColor`
(`--pmap-*` ile ayarlanabilir). Stil/JS ortak dosyada: `/static/map.css` (2,6 KB), `/static/map.js` (1,7 KB) — yalnız bloğu olan
sayfaya eklenir; temaların `site.js`'i değişmedi. Kart: pin, ad, adres, "Show map" (JS yoksa Google Maps linki), not. Dokununca
`https://www.google.com/maps?q=…&output=embed` iframe'i (`referrerpolicy=no-referrer`) + "Open in Google Maps". İki mekânda
"Ceremony"/"Reception" başlıkları. **CSP:** `frame-src` yalnız haritası açık sayfada `'self' https://www.google.com`, diğer tüm
sayfalarda `'self'`. Dokunmadan Google'a hiçbir istek gitmez. Teşekkür modunda blok (ve eski link) gösterilmez. Şifreli sitede
Details zaten kapının arkasında; ek davranış gerekmedi.

**Panel (Day & place → Venue):** "Map link" altında **Map & directions** grubu: haritanın neyi bulacağı ("map pin (lat, lng)" ya da
"search for: <adres>"), *Show map* / *Show directions* anahtarları, küçük önizleme (kart + "Preview map" ile iframe, "Test
directions" linkleri), iki mekânda başlık alanı, **Add a reception place** (ad, adres, şehir, map link, anahtarlar, önizleme,
Remove). Link yapıştırınca pin istemcide okunur; kısa paylaşım linki (maps.app.goo.gl, goo.gl/maps, maps.apple) için
`POST /api/edit/<slug>/map-link` (düzenleme anahtarı; site başına günde 60; yalnız bu yönlendirici hostlara `redirect: manual`
istek, hedef yalnız bilinen harita hostu; gövde okunmaz) — çözülemezse adres metni kullanılır. Kurulum sihirbazında gösterilmez.
Taslak/yayın akışı değişmedi (alanlar içerik kaydında, otomatik kayıt + Publish).

**Testler:** `npm ci`, `npm run typecheck` temiz; `tests/g127-maps.test.ts` 8/8 (link ayrıştırma, varsayılanlar, motor bloğu,
CSP, kaçış, şema, 20 tema işareti, kısa link çözücü sahte fetch ile); tam `npm test` **1233/1233**; `npm run build` +
trace-check temiz. 20 tema testinde "View map" testi artık harita kapalıyken koşuyor (tek satır `c.maps = …` eki).
Playwright 390 px (DPR 2), 5 tema details (olive-ivory, art-deco-black-tie, midnight-garden, tropical-destination,
dusty-blue-champagne): yatay taşma yok, konsol hatası yok, "Show map" → iframe oluştu, CSP başlığı doğru. Panel 390 px: anahtar
taslağa yazıldı, yapıştırılan Google linkinden pin okundu. Görüntüler `platform/previews/g127/`.
**Yapılmayan / doğrulanamayan:** bu ortamdan Google'a ağ erişimi yok — gömülü haritanın gerçekten çizildiği, kısa linkin gerçek
Google yönlendirmesiyle çözüldüğü ve Apple/Waze linklerinin telefonda uygulamayı açtığı denenmedi (gerçek cihaz/ağ testi gerekli).
`theme-check --stress` ve tam Playwright süitleri koşulmadı (görev gereği).

**Alıcı etiketleri (START HERE için, yeni):** panel — "Map & directions", "Show map" (ipucu: Guests tap “Show map” to load Google
Maps. Nothing loads before.), "Show directions" (Get directions with Google Maps, Apple Maps or Waze.), "Preview map", "Test
directions", "Heading for this place", "Add a reception place", "Reception at another place", "Heading", "Place name", "Street
address", "City", "Map link" (Paste a Google Maps or Apple Maps link to the place.), "Remove this place", "Reading your map link…",
"Guests’ maps go to the map pin (…)", "Guests’ maps search for: …", "We could not read the pin of this link.", "Add a street address
or a map link so guests can find the place." Misafir sitesi — "Ceremony", "Reception", "Show map", "The map is loaded from Google
Maps when you tap.", "Open in Google Maps", "Get directions", "Google Maps", "Apple Maps", "Waze". Değişen: mevcut "Map link"
alanı artık haritanın pinini de belirliyor; eski "View map" düğmesi yalnız harita/yol tarifi kapalıyken görünür.

**Demo (kullanıcı isteği, 2026-10-16):** canlı demo (`/start/demo/<tema>`) harita bloğunu demo şehrinin merkezindeki pinle
gösteriyor: `lib/claim/demo-map.ts` (20 tema → şehir merkezi koordinatı), pin yalnız demo sayfası render edilirken eklenir.
Demo kayıtları (`content.demo.json`, koleksiyon kopyaları, `site.js` DEV_CONTENT) değişmedi; alıcının ilk taslağı
(`draftFromDemo`) pin almaz, haritası kendi mekânını izler (test edildi). 390 px: olive-ivory, winter-evergreen,
lavender-provence demo details — taşma/hata yok (`previews/g127/demo_details_390.jpg`; winter-evergreen'de büyük düğme yazısı
yüzünden "Waze" ikinci satırda). Testler 1234/1234, build temiz.

**Açık:** Gizlilik politikasına "harita dokununca Google'dan yüklenir" cümlesi eklenmeli (docs/20 §7.2).
