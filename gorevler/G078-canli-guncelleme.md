---
id: G078
baslik: Canlıya güncel main — BKE Studio satış sitesi (G066-A), RSVP v2 (G069), site şifresi (G076); canlı kontrol + test seti güncellemesi
rol: claude-tarayici
durum: inceleme
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
**Yayın:** production = main **`2dc812b`** (platform ağacı `cbebd425efc9`), **`dpl_CrRsWGBkUZNrtQW6LkQpZEJhRukG`** (READY) →
https://davetiye-platform-five.vercel.app . G049/G077 arşiv yolu (`--meta gitCommit=2dc812b --meta platformTree=cbebd425efc9`).
Ortam değişkeni eklenmedi/değişmedi; build yeni değişken istemedi.

**Kontroller:** `npm ci` · `npm test` **493/493** (2 test build'e bağlı → build sonrası 2/2) · typecheck · build (trace-check: 6 tema)
yeşil (Windows: `PYTHONUTF8=1`, temiz `.next`). Canlıda `live-check` **40/40** (yazma yolu; geçici siteler silindi), beş temalı
salt-okuma `live-check` **41/41**, `blob-smoke` **12/12**.

**Demolar (yeni kodla yeniden tohumlandı, slug'lar korundu):** `/clara-and-julian` (03), `/avery-and-jordan` (01), **yeni**
`/eleanor-and-theo` (02 Dusty Blue & Champagne), `/margot-and-henry` (04), `/isabella-and-marco` (05). **Onaysız:** 02 (G402
inceleme), 04 (G404), 05 (G405) — satış sitesinde yalnız 01 ve 03 var; `/designs/dusty-blue-champagne` 404.

**Test sitesi `/lily-and-theo`:** G077 düzenleme linki geçerli. Kullanıcı bu sırada isimleri/tarihi değiştirmişti (Betül & Muzaffer,
30 Mayıs 2027). Panelden RSVP'ye iki soru eklendi (Meal choice: Chicken/Fish/Vegetarian; Allergies or dietary needs — kısa cevap) ve
"Publish changes" ile yayınlandı (kullanıcının taslaktaki değişiklikleri varsa onlar da yayına çıktı). Misafir gibi 4. yanıt: Sophie
Example, 3 kişi (Daniel Example, Lucy Example), Fish, "No nuts, please." → Guests: 6 geliyor · 1 gelmiyor · 4 yanıt, soru dökümü,
yemek & alerji notları, "4 new replies". (Betiğin ilk denemesi alerji alanını doldurmadı; o eksik yanıt silinip doğrusu gönderildi.)
Site şifrelenmedi.

**Site şifresi:** ayrı geçici sitede (`g078-sifre`) denendi — **çalışıyor**: varsayılan kapalı → Share'den açınca misafir sayfası şifre
ister (`.ics` 303) → yanlış şifre reddedilir → doğru şifre siteyi açar → kapatınca şifresiz açılır. Site sonra silindi (404).

**Ekran görüntüleri (390 px):** `docs/10_canli_test/g078/` — 01 satış ilk ekran, 02 satış tam sayfa, 03 `/designs`, 04 panel Home,
05 Guests özet, 06 Guests döküm, 07 şifre ekranı. G077 görüntülerine dokunulmadı.

**Test linkleri:** satış `/`, `/designs`, `/designs/blush-garden-rose`, `/designs/olive-ivory`, `/how-it-works`, `/faq`, `/pricing`;
demolar yukarıda; `/lily-and-theo`; düzenleme linki yalnız sohbette.

**Bilinen eksikler:** panel marka giydirmesi (G066-B) gelmedi; e-posta yok; Etsy sipariş doğrulaması yok; gerçek telefon testi yok;
onaysız temalar `/start?theme=<id>` ile doğrudan sahiplenilebiliyor (G077 notu); mağaza sahibi için yönetim (admin) paneli yok —
operatör işleri betiklerle (`reissue-edit-key.ts`, `grant-identity-change.ts`). G063 B1 (favicon) kapandı: sayfalarda `/brand/favicon.ico`.

**Kullanıcı isteği (sohbet, 2026-10-14) → önerilen görev — Panel sadeleştirme:** "Paneller GPT ile hazırladığımız gibi görünsün;
çok daha basit olsun, kullanımı ve değişiklik yapması kolay, çağdaş ve harika bir tasarım." G066-B yalnız marka giydirmesi kalmasın,
sadeleştirme de kapsama girsin (gerekirse GPT'den yeni panel comp'ları, K21). claude-local-1'in canlı panelde (390 px) gördükleri:
1. Kurulum sihirbazı 6 adım, sonunda "14 things are still sample text" + "Publish anyway" → öneri: 3 adım (isimler + tarih → fotoğraf →
   yayınla), gerisi sonra ve isteğe bağlı.
2. Edit listesi 9 bölüm; satırlarda "Sample text" rozeti ve "3 changes left" kilidi → daha az, büyük bölüm; isim/tarih değiştirme hakkı
   tek yerde.
3. Otomatik kayıt + ayrı "Publish changes": taslaktaki başka değişiklikler de birlikte yayına çıkıyor (G078'de oldu) → üstte tek, net
   "Yayınlanmamış değişiklik: n — gör / yayınla" şeridi.
4. Home "Next steps" 14 madde → ilerleme göstergesi ("%60 hazır") + yalnız sıradaki 3 iş.
5. Share uzun (link, QR, şifre, düzenleme linki alt alta) → link + QR üstte; şifre (varsayılan kapalı — kullanıcı onayladı) ve düzenleme
   linki açılır bölümde.
6. Guests (RSVP v2) iyi; korunsun.
7. Masaüstü: solda düzenleme, sağda sabit canlı önizleme.
Görsel: GM05'teki BKE Studio dili; daha çok boşluk, daha az rozet/çerçeve, büyük dokunma alanları, tek vurgu rengi. Bitince
claude-local-1 aynı gün canlıya alır (bu görevin adımları) ve "isim / foto değiştir, yayınla, paylaş" işlerini dokunuş sayısıyla önce/sonra ölçebilir.

## Günlük
- 2026-10-14 açıldı (entegratör): G066-A, G069, G076 main'de; G066-B sonra aynı adımlarla yeniden yayın
- 2026-10-14 alindi: claude-local-1
- 2026-10-14 bitti, incelemeye gönderildi
