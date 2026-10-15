---
id: G079
baslik: Canlıya güncel main — sade ve BKE Studio görünümlü panel (G066-B, K29); canlı kontrol + panel ekranları
rol: claude-tarayici
durum: hazir
alan:
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

## Günlük
- 2026-10-14 açıldı (entegratör): G066-B main'de (31e82ab)
