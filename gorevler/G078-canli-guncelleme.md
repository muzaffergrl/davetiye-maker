---
id: G078
baslik: Canlıya güncel main — BKE Studio satış sitesi (G066-A), RSVP v2 (G069), site şifresi (G076); canlı kontrol + test seti güncellemesi
rol: claude-tarayici
durum: alindi
alan: claude-local-1
oncelik: 1
bagimli: []
yazar: [docs/10_SITE_PLATFORMU.md, docs/10_canli_test/, platform/README.md]
---

## Amaç
Kullanıcı (2026-10-14): "Vercel'de yayına girdi ama tasarım eski, son kararlaştırdığımız gibi değil." Canlı `db0eac7` (G077). Main'de artık:
BKE Studio adı/logosu/favicon'u ve yeni satış sitesi tasarımı (G066-A), RSVP paneli v2 (G069: özet, soru dökümü, misafir isimleri,
New, elle ekleme, CSV, yazdırma), isteğe bağlı site şifresi (G076). Panelin marka giydirmesi (G066-B) **henüz yok**; o gelince bu görevin
aynı adımlarıyla yeniden yayınlanır (Günlük'e yeni satır). Bu bir **test yayını**: satış yok, kurgusal veri.

## Yapılacaklar
1. `git pull` (main). `platform/`: `npm ci`, `npm test`, `npm run typecheck`, `npm run build`. Kırmızı varsa yayınlama; Sonuç'a yaz.
2. Yayın G049/G077 yöntemiyle: `git archive HEAD:platform` → temiz klasör → `vercel deploy --prod` (+ `--meta gitCommit=<kısa hash>`).
   Ortam değişkeni ekleme/değiştirme yok; build yeni bir değişken isterse dur, adını yaz (değerini değil).
3. Demo siteleri yeni kodla yeniden tohumla (her tema, `_sample` hariç; G077'deki slug'lar korunur). Yeni tema geldiyse onu da ekle.
4. `scripts/live-check.mjs` ve `scripts/blob-smoke.mjs` canlıya karşı. Geçici dosyaları temizle, demolara dokunma.
5. Test sitesi `/lily-and-theo` (G077) kalır. Misafir gibi **1 RSVP daha** gönder: 3 kişilik, misafir isimleriyle (RSVP v2 `party`),
   bir yemek seçimi ve kısa alerji notu ("no nuts" gibi). Panelde Guests özeti, soru dökümü, New işareti dolu görünsün.
   G077'de verilen düzenleme linki geçerliyse onu kullan; değilse yeni test sitesi aç (`/start`, sipariş no 8–12 rakam, `test@example.com`).
6. Site şifresini **ayrı geçici bir test sitesinde** dene (aç → misafir sayfası şifre ister → doğru şifreyle açılır → kapat), sonra o siteyi sil.
   `/lily-and-theo`'yu şifreleme. Şifreyi repoya/sohbete yazma; Sonuç'a yalnız "denendi, çalışıyor/çalışmıyor".
7. Telefon boyutunda (390 px) ekran görüntüleri `docs/10_canli_test/g078/`: satış ana sayfa (ilk ekran + tam sayfa), `/designs`, panel Home,
   Guests (özet + döküm), şifre ekranı. Eski G077 görüntülerine dokunma.
8. Sonuç: deployment ID/URL, commit, test/live-check/blob-smoke sayıları, test linkleri listesi (satış sitesi, demolar, `/lily-and-theo`,
   düzenleme linki **yalnız sohbette**), bilinen eksikler (panel giydirmesi G066-B gelmedi, e-posta yok, Etsy doğrulaması yok, gerçek telefon
   testi yok, onaysız temalar). `docs/10` §2c'ye kısa satır.

## Kurallar
Ödeme/plan/ekip ayarı yok; alan adı alma yok; şifre/anahtar yazma yok; yalnız kurgusal test verisi. Kullanıcının e-postası hiçbir yere girilmez.

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G066-A, G069, G076 main'de; G066-B sonra aynı adımlarla yeniden yayın
- 2026-10-14 alindi: claude-local-1
