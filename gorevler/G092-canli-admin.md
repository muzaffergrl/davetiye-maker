---
id: G092
baslik: Canlıya güncel main — dükkân paneli /admin (G087), K33 değerleri, G091 metinleri; ADMIN_PASSWORD + canlı kontrol
rol: claude-tarayici
durum: bitti
alan: claude-local-1
oncelik: 1
bagimli: []
yazar: [docs/10_SITE_PLATFORMU.md, docs/10_canli_test/, platform/README.md, docs/17_ADMIN_PANELI.md]
---

## Amaç
`claude/amazing-bardeen-8yqoqt` dalı (PR ile) main'e girince canlıya alınır: dükkân paneli `/admin` (`docs/17_ADMIN_PANELI.md`),
alıcı panelinde "Confirming your order" kartı ve RSVP son tarihinin düğün tarihini izlemesi, K33 (BKE Studio / bkestudio@gmail.com),
G091'in /start, panel yardımı ve satış sitesi metin düzeltmeleri.

## Yapılacaklar
1. G079'un 1. adımı aynen: `git pull` (main) · `npm ci` · `npm test` · typecheck · build — kırmızıda yayınlama.
2. **Vercel ortam değişkeni `ADMIN_PASSWORD`** (Production + Preview, tür sensitive): değeri kullanıcı 2026-10-15'te sohbette verdi
   (geçici kısa şifre, lansmandan önce kabul — K33). **Değeri kullanıcıdan al; repoya, log'a, Sonuç'a yazma.** Bulut oturumu bunu
   yapamadı (Vercel bağlantısı env eklerken 403).
3. G079'daki gibi `git archive HEAD:platform` → `vercel deploy --prod` (+ `--meta gitCommit=… --meta platformTree=…`). `live-check` +
   `blob-smoke`; demolar yeni kodla tohumlanır.
4. Canlı admin yolculuğu (390 px, ekranlar `docs/10_canli_test/g092/`):
   - `/admin` giriş ekranı → şifreyle giriş → "Geçici kısa şifre" uyarısı görünür → liste.
   - Geçici `/start` sitesi (sipariş no 8–12 rakam, `test@example.com`) → admin'de **Yapılacak**'ta görünür → site sayfası →
     **Siparişi onayla** → mesaj "Sipariş onaylandı" şablonuna geçer (Kopyala çalışır) → alıcı panelinde Publish açılır.
   - **Yeni düzenleme linki** → eski link 404, yeni link paneli açar.
   - Geçici siteyi admin'den **Siteyi sil** ile sil (adres yazarak) → 404.
   - `CLAIM_ORDER_VERIFICATION` canlıda `manual` değilse onay adımı görünmez: değerini oku (değiştirme), Sonuç'a yaz.
5. Satış sitesi ve panelde yer tutucu kontrolü: `/faq`, `/contact`, panel Help'te "BKE Studio" ve "bkestudio@gmail.com" görünür;
   `[SHOP NAME]` / `[SUPPORT EMAIL]` kalmadı.
6. Sonuç: deployment ID/URL, commit, sayılar, gözlemler; `docs/10` §2c'ye kısa satır.

## Kurallar
Ödeme/plan/ekip ayarı yok; alan adı alma yok; şifre yalnız Vercel'e. Kullanıcının `/lily-and-theo` sitesine dokunma. Kurgusal test verisi.

## Sonuç
**Yayın:** production = main **`55cf6ee`** (platform ağacı `117993db9549`), **`dpl_9VoCE8w6VuARyzHPJCfeDeWPRDSj`** (READY) → https://davetiye-platform-five.vercel.app .
Arşiv yolu (`--meta gitCommit=55cf6ee --meta platformTree=117993db9549`). **`ADMIN_PASSWORD`** Vercel'e Production + Preview, Secret türde eklendi
(değeri kullanıcı verdi ve sohbette onayladı; repoda/log'da/burada yok). Başka ortam değişkeni değişmedi.

**Kontroller:** `npm ci` · `npm test` **651/651** (8 atlanan: 2 build'e bağlı → build sonrası 2/2; 6 Playwright'lı tema testi, bu makinede yok; Windows'ta
g080 symlink testleri junction shim'iyle) · typecheck · build yeşil (trace-check 8 tema: yarım lavender-provence ve boho-pampas-terracotta da build'de; satışta
değiller, `/start` kapısı kapalı tutar). Bu yayından önce main bir süre kırmızıydı (G409 ara kaydı, tek test) — G409 düzeltti (`27071ab`).
Canlıda `live-check` **40/40**, beş temalı salt-okuma **41/41**, `blob-smoke` **12/12**; 5 demo yeni kodla tohumlandı.

**Canlı admin yolculuğu (390 px, geçici `/g092-admin`, sipariş `20261016`, `test@example.com`):**
- `/admin` giriş ekranı → şifreyle giriş → **"Geçici kısa şifre"** uyarısı görünür → liste (Yapılacak 0 · Hepsi 7 · Yayında 6 · Taslak 1 · Arşiv 0).
- Site sayfası: Bilgiler, Etsy mesajı (17 şablon), Destek işlemleri, Siteyi sil. "Mesajı kopyala" çalışıyor (panoya 465 karakter, "Kopyalandı").
- **Yeni düzenleme linki** → eski link 404 ("This edit link is not valid"), yeni link paneli açıyor.
- **Siteyi sil** (adres yazılınca düğme açılıyor) → liste; genel adres 404; `slugs/g092*` ve `orders/20261016` 0 dosya.
- **Sipariş onayı denenemedi:** `CLAIM_ORDER_VERIFICATION` canlıda **tanımlı değil** (= yalnız biçim kontrolü; site sayfasında "Sipariş kontrolü: Gerekmedi").
  Bu yüzden Yapılacak'a düşme, "Siparişi onayla", "Confirming your order" kartı ve onay sonrası Publish açılması canlıda görünmüyor. Değer değiştirilmedi;
  açmak için Vercel'e `CLAIM_ORDER_VERIFICATION=manual` (kullanıcı kararı).

**Yer tutucular:** panel Help'te "BKE Studio" ve "bkestudio@gmail.com" var, `[SHOP NAME]`/`[SUPPORT EMAIL]` yok; `/faq`, `/contact`, `/`, `/pricing` da BKE Studio +
e-posta gösteriyor. Kalan (karar bekleyen) yer tutucular: `[ETSY SHOP URL]` (/, /faq, /contact, /pricing), `[DOMAIN]` (/faq), `[PRICE]` (/pricing).

**Ekranlar:** `docs/10_canli_test/g092/` — 01 giriş, 02 liste + geçici şifre uyarısı, 03 site sayfası, 05 silme kartı, 06 alıcı paneli (kurulum), 07 panel Help.
(Yeni link ekrandayken görüntü alınmadı — anahtar içerir.)

**Notlar:** admin listesi kullanıcının `/lily-and-theo` sitesini de gösteriyor (dokunulmadı). Vercel'de `BLOB_READ_WRITE_TOKEN` "Config" türünde (ekip üyeleri
değeri görebilir) — öneri: Sensitive'e çevirmek (kullanıcı kararı; değiştirilmedi).

## G096 yayını + K34
**Tarih:** 2026-10-15 · `claude-local-1`.
**Ortam değişkeni:** Vercel'e `CLAIM_ORDER_VERIFICATION=manual` (Production + Preview, düz değer) eklendi; değeri okunarak doğrulandı. Başka değişkene dokunulmadı.
**Yayın:** production = main **`e63bab4`** (PR #6 dahil; platform ağacı `379814651d32`), **`dpl_8dFjoZ9Mbd9E5Sh4d33LPn6Jd8sQ`** (READY), arşiv yolu +
`--meta gitCommit=e63bab4 --meta platformTree=379814651d32`. Önce temiz bir main worktree'sinde `npm ci` · `npm test` **940/940** (13 atlanan: Playwright'lı tema
testleri + build'e bağlı) · typecheck · build yeşil.
**Düzeltilen yanlış yayın:** aynı gün önce `dpl_25BxYAfXgTTZdqzJdT49vq6zSrpA` (`cfa6f9f`, ağaç `d60fa64749f4`) yayınlandı — yerel klasör başka oturumun
`claude/dazzling-goldberg-y08us2` dalındaydı; o ağaç main'den yalnız `platform/lib/marketing/config.ts` ve `platform/lib/admin/message-templates.json`'da ayrılıyordu
(o dalın Etsy kararları). Test edilen ağaçla aynıydı ama saf main değildi; ~20 dk sonra saf main yayınlandı. (Yerel rebase o dalın yerel kopyasını değiştirdi; uzaktaki dal sağlam.)
**Canlı deneme (390 px, sipariş `20261018`, `test@example.com`, geçici `/g096-onay`):**
- /start → alıcı panelinde **"Confirming your order"** kartı ✓. Üstteki **Publish düğmesi görünür ve tıklanabilir**; basınca "Not yet — We are still confirming your Etsy
  order…" penceresi çıkıyor ve site dışarıdan açılmıyor (404) — yayın fiilen kapalı (ek geçici `/g096-bekleme`, sipariş `20261019` ile doğrulandı). Görevdeki "Publish
  kapalı" ifadesine göre: düğme pasif değil, engel tıklamada ✓/kısmi.
- /admin → **Özet** → Yapılacaklar'da sipariş (1 onay bekleyen) → site sayfası "Yapılacak: siparişi onayla" → **Siparişi onayla** → yapılacak kalkıyor, mesaj şablonu
  `order_confirmed`, "Sipariş onaylandı. Alıcı artık yayınlayabilir." ✓
- Alıcı panelini yenile → "Confirming your order" kalktı, Publish açık ✓.
- Admin'den **Siteyi sil** → `/g096-onay` 404 ✓; `orders/20261018`, `orders/20261019`, `slugs/g096*` 0 dosya.
- /admin **Özet, Siparişler, Müşteriler, Tasarımlar** 200 ✓. Satış sitesi 390 px: **"My website"** düğmesi ve menü düğmesi görünüyor ✓; **/my** açılıyor ✓.
  **/designs: 14 tasarım.**
**Gözlem:** "Not yet" penceresindeki metin kelime ortasından bölünüyor ("cha|nges", "yo|ur") — panel diyalog metninde `word-break` (düzeltilmedi).
**Ekranlar:** `docs/10_canli_test/g096/` (alıcı onay bekliyor + "Not yet", admin Özet, onayla, onaylandı, alıcı onay sonrası, Siparişler/Müşteriler/Tasarımlar, satış 390, /my).
Şifre ve düzenleme linkleri hiçbir yerde yok.

**İkinci (bağımsız) doğrulama, aynı gün ~16:00–16:57, ayrı bir yerel oturum:** yukarıdakinden habersiz aynı görev yeniden koşturuldu. Ortam değişkeni zaten vardı
(dokunulmadı; değeri canlı davranışla doğrulandı). Ayrı main worktree'sinde (`e63bab4`) `npm ci` · `npm test` 940 geçti / 0 hata (13 atlanan; build sonrası
`marketing-build` 2/2) · typecheck · build yeşil → aynı ağaç (`379814651d32`) arşiv yoluyla yeniden yüklendi: **`dpl_4zT5UsW6hmJkKNoWrGrDss663CFu`** (READY, şu anki
production; içerik `dpl_8dFjoZ9…` ile aynı). Canlı deneme (`/g096-onay`, sipariş `20261018`) aynı sonuç: kurulum 3. adımında ve Home'da "Confirming your order";
örnek tarih onaylandıktan sonra da "Publish my website" pasif, üstteki Publish "Not yet" açıyor → admin Özet/Yapılacaklar → Siparişi onayla → şablon "Sipariş onaylandı
— yayınlayabilir" → alıcı panelinde "Before you publish" ve "Publish my website" etkin (yayınlanmadı) → Siteyi sil → `/g096-onay`, `/api/sites/g096-onay` ve eski düzenleme
linki 404; Siparişler 6 site, Yapılacak 0. Admin 4 sekme 200 ve veriyle dolu; satış 390 px'te "My website" + menü düğmesi görünür, açık menüde taşma yok (DOM ölçümü,
16–374 px); /my açılıyor; /designs 14 tasarım; admin Tasarımlar "14 tasarım satış sitesinde".
**Ek gözlemler (düzeltilmedi):**
- Admin **Özet, 5 demo siteyi (`#DEMO-SEED-…`) satış sayıyor**: "Bugün 6 satış · toplam 7", "En çok satan tasarımlar" ve haftalık grafik demolarla şişiyor.
- **/my "On this device"** silinmiş siteyi (`/g096-onay`) göstermeye devam ediyor; silinen/404 olan siteler listeden düşmüyor ("Remove from this device" ile temizlendi).
- Saat dilimi: `/start` sonrası kurulumda "Los Angeles (Sample)" görünürken kayıtta `Europe/Istanbul` var (admin "Saat dilimi"); sayfa yenilenince kurulum "Istanbul" gösterdi.
- Admin "Sipariş onaylanıyor (Publish bekliyor)" şablonu: "Bu mesaj henüz gönderilemez: [ORDER CHECK TIME] karar bekliyor" ve İngilizce geliştirici notu
  (`node scripts/verify-order.ts …`) dükkân paneline sızıyor.
- Onay sonrası yeniden açılan panelde "Saturday, June 12, 2027 really is our wedding date" işareti kalıcı değil (yayın penceresi yeniden soruyor).
Bu turun ekranları yukarıdaki setin tekrarı olduğu için repoya eklenmedi.

## Günlük
- 2026-10-15 açıldı (entegratör, kullanıcı K30/K33)
- 2026-10-15 alindi: claude-local-1
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
