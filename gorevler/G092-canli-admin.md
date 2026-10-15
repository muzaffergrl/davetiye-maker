---
id: G092
baslik: Canlıya güncel main — dükkân paneli /admin (G087), K33 değerleri, G091 metinleri; ADMIN_PASSWORD + canlı kontrol
rol: claude-tarayici
durum: alindi
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

## Günlük
- 2026-10-15 açıldı (entegratör, kullanıcı K30/K33)
- 2026-10-15 alindi: claude-local-1
