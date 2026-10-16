---
id: G079
baslik: Canlıya güncel main — sade ve BKE Studio görünümlü panel (G066-B, K29); canlı kontrol + panel ekranları
rol: claude-tarayici
durum: bitti
alan: claude-local-1
oncelik: 1
bagimli: []
yazar: [docs/10_SITE_PLATFORMU.md, docs/10_canli_test/, platform/README.md]
---

## Amaç
G078 canlıda panel eski görünümdeydi. Main'de artık G066-B: BKE Studio görünümlü ve K29 ile sadeleşmiş panel (3 adımlı kurulum, 6 sayfalık Edit,
tek "Unpublished changes" şeridi + Review, Home'da hazırlık yüzdesi + sıradaki 3 iş, Share'de link+QR üstte, masaüstünde iki sütun).
Kullanıcı canlıda denemek istiyor. Test yayını; kurgusal veri.

## Yapılacaklar
1. G078'in 1–4. adımları aynen (git pull · npm ci/test/typecheck/build · `git archive HEAD:platform` → `vercel deploy --prod` + `--meta` ·
   demoları yeniden tohumla · live-check + blob-smoke). Kırmızıda yayınlama.
2. `/lily-and-theo` (kullanıcının değiştirdiği isimlerle kalır, dokunma) düzenleme linkiyle yeni panelde gez: Home (hazırlık yüzdesi),
   Edit 6 sayfa, bir alanı değiştir → şerit "Unpublished changes: 1" → Review → **yayınlama** (kullanıcının sitesi; yalnız gör, sonra değişikliği geri al).
3. Yeni kurulumu dene: `/start` ile geçici test sitesi (sipariş no 8–12 rakam, `test@example.com`) → 3 adımlı kurulum → yayınla → Share'de
   link+QR, şifre ve düzenleme linki açılır bölümler → sonra geçici siteyi sil.
4. 390 px ekran görüntüleri `docs/10_canli_test/g079/`: kurulum 1–3, Home, Edit listesi, bir editör, şerit + Review, Share (kapalı/açık), Guests.
   1280 px: Edit + sağda önizleme.
4b. Main'e bu arada G075 (teşekkür modu) ve G080 (/start + signin BKE görünümü, onaysız tema kapısı) da girdi. Canlıda kontrol et: `/start?theme=dusty-blue-champagne` 404 + "This design is not available yet" (kapı `VERCEL_ENV=production` okuyor; çalışmazsa dur, yaz — ortam değişkeni ekleme), `/start?theme=blush-garden-rose` açılır; `/lily-and-theo` panelinde Day & place → "After the wedding" bölümü görünür (modu değiştirme). Ekran görüntüleri: /start, signin, onaysız tema sayfası.
4c. Main'e ayrıca G068 (düzenlenebilir metinler), G081/G084 (teşekkür hâli + metinler + misafir adları 5 temada), G082/G083/G086 (satış sitesinde 5 tasarım), G402/G404/G405 (02, 04, 05 temaları onaylı) girdi. Canlıda kontrol: `/designs` 5 kart; her tasarımın `/designs/<id>` sayfası 200; `/start?theme=<id>` beşi için açılır; beş demo site (`/clara-and-julian`, `/avery-and-jordan`, `/eleanor-and-theo`, `/margot-and-henry`, `/isabella-and-marco`) yeni kodla tohumlanır ve açılır; `/lily-and-theo` panelinde bir editörün "Headings & labels on this page" bölümü görünür (değiştirme).
5. Sonuç: deployment ID/URL, commit, sayılar, gözlemler (takılan, kafa karıştıran, yavaş olan her şey — kullanıcı "çok daha basit" istedi;
   hâlâ ağır gelen yerleri madde madde yaz), bilinen eksikler. `docs/10` §2c'ye kısa satır.

4d. **(2026-10-15, G087 + K33) Admin paneli ve yeni değerler:** main'e G087 (dükkân paneli `/admin`, `docs/17_ADMIN_PANELI.md`) ve K33
   (dükkân adı BKE Studio, destek e-postası) girince: Vercel'e `ADMIN_PASSWORD` ortam değişkeni (Production + Preview, tür sensitive) —
   **değeri kullanıcı 2026-10-15'te sohbette verdi (geçici kısa şifre); repoya/log'a yazma, kullanıcıdan al**. Bulut oturumunun Vercel
   bağlantısı env eklerken 403 aldı, bu yüzden yerelden. Yayından sonra: `/admin` giriş ekranı → şifreyle giriş → liste; geçici
   `/start` sitesi "Yapılacak"ta görünür → Siparişi onayla → alıcı panelinde Publish açılır → Yeni düzenleme linki (eski link 404) →
   geçici siteyi admin'den sil. Admin'de "Geçici kısa şifre" uyarısı görünmeli. Ekranlar `docs/10_canli_test/g079/admin_*`.

## Kurallar
Ödeme/plan/ekip ayarı yok; alan adı alma yok; şifre/anahtar repoya yazma yok (ADMIN_PASSWORD yalnız Vercel'e, 4d); yalnız kurgusal test verisi. Kullanıcının e-postası hiçbir yere girilmez.
Kullanıcının `/lily-and-theo` içeriğini değiştirip yayınlama.

## Sonuç
**Yayın:** production = main **`1d25e57`** (platform ağacı `5b9002e5e600`), **`dpl_BfYJEMS1nxXarDBKovViJ2F81Y6h`** (READY) →
https://davetiye-platform-five.vercel.app . Arşiv yolu (`--meta gitCommit=1d25e57 --meta platformTree=5b9002e5e600`). İlk deneme Vercel'den
"Not authorized" döndü (geçici; `whoami` girişli, ikinci deneme geçti). Ortam değişkeni eklenmedi/değişmedi.

**Kontroller:** `npm ci` · `npm test` **574/574** (8 atlanan: 2'si build'e bağlı → build sonrası 2/2; 6'sı Playwright'lı tema tarayıcı
testi, bu makinede Playwright yok) · typecheck · build (trace-check 6 tema) yeşil. **Not:** ilk koşuda `g080-approval.test.ts`'in 8 testi
Windows'ta `EPERM` (dizin symlink'i yönetici izni ister) ile kaldı — kod hatası değil: symlink'i junction'a çeviren test-yalnız ön yüklemeyle
8/8 ve tam paket 574/574 (README "Windows notları"; öneri `tests/review-fixture.ts` win32'de `'junction'`). Canlıda `live-check` **40/40**,
beş temalı salt-okuma **41/41**, `blob-smoke` **12/12**.

**Demolar (yeni kodla):** `/clara-and-julian`, `/avery-and-jordan`, `/eleanor-and-theo`, `/margot-and-henry`, `/isabella-and-marco` — 200.
`/designs` 5 kart; `/designs/<id>` beşi 200; `/start?theme=<id>` beşi form açıyor. Bilinmeyen tema (`_sample`, `no-such-design`) →
"This start link is not valid" + 5 tasarım listesi (HTTP 200; `POST /api/start` 404). İncelemede tema kalmadığı için "This design is not
available yet" kapısı canlıda gösterilemedi (5'i de onaylı); kapı testlerle doğrulandı (g080-approval 8/8).

**Panel (`/lily-and-theo`, kullanıcının sitesi — hiçbir şey yayınlanmadı):** Home "Your website is 32% ready" + sıradaki 3 iş; Edit 6 sayfa
(Us · Day & place · Photos · Our Story · Details · RSVP); her sayfada "Headings & labels on this page" (Photos hariç); Day & place'te "After
the wedding" bölümü var (mod değiştirilmedi). Details'te "Host line" değiştirildi → kayıt → şerit **"Unpublished changes: 1 · Review ·
Publish"** → Review "Details" listeledi → "Keep editing" → alan eski metne döndürüldü → şerit kayboldu (yayınlanmadı). Share: link + Copy/
Open/Share ve QR üstte; "Guest password (Off)" ve "Your private edit link" kapalı bölümler; şifre kapalı kaldı. Guests: 6 geliyor · 1 gelmiyor ·
4 yanıt, soru dökümü. 1280 px: solda düzenleme, sağda canlı önizleme.

**Yeni kurulum (geçici `g079-kurulum`, `/start` sipariş `20261015`, `test@example.com`):** 1) isimler + tarih → 2) fotoğraf (isteğe bağlı) →
3) yayınla: **3 dokunuş**, ~26 sn (başsız); tarih ayarlıyken tarih kapısı çıkmadı, örnek tarihle (taslak `g079-adim3`) 3. adımda "Your wedding
date is still the design's sample" + "Set our date" / onay kutusu, onaysız Publish kapalı. Share'de link+QR üstte. İki geçici site ve
`orders/20261015` silindi (404, dosya 0).

**Ekran görüntüleri:** `docs/10_canli_test/g079/` (390 px: kurulum 1–3 + yayında, Home, Edit, Day & place, Details, şerit, Review, Share
kapalı/açık, Guests, /start, signin, geçersiz tema, /designs; 1280 px: Edit + önizleme).

**Hâlâ ağır gelen yerler (K29 sonrası, kullanıcı "çok daha basit" istedi):**
1. Kurulum 1. adımda değişiklik hakkı notu uzun (4 satır) + "How your names appear" açıklaması; ilk ekranda okunacak çok metin var.
2. Day & place tek sayfada ~20 alan (tarih, saat, saat dilimi, tarih biçimi, geri sayım, mekân, program, After the wedding) — "Time zone",
   "Date style", "Show countdown" gibi seyrek ayarlar "More options" altına alınabilir.
3. Editörlerde alan başına "Sample" rozetleri sürüyor (Details'te 4–5 tane); ilerleme yüzdesi zaten var, rozetler görsel kalabalık.
4. "Headings & labels on this page" her sayfanın sonunda — güçlü ama ileri düzey; "Advanced" altında daha sakin olur.
5. İsim/tarih değiştirmek yayından sonra "Change" akışından geçiyor ("2 of 3 changes left") — kural gerekli, ama ilk kez gören çift için
   neden kilitli olduğu tek cümleyle sayfada söylenmeli.
6. `/signin` ve panel metinlerinde "[SHOP NAME]" yer tutucusu görünüyor (Etsy mağaza adı kararı bekliyor; uydurulmadı).

**Bilinen eksikler:** e-posta yok (sign-in ve link e-postası); Etsy sipariş doğrulaması yok; gerçek telefon testi yok; Etsy mağaza adı yer
tutucusu; Windows test notu (symlink).

## Günlük
- 2026-10-14 açıldı (entegratör): G066-B main'de (31e82ab)
- 2026-10-15 alindi: claude-local-1
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-16 entegratör onayladı
