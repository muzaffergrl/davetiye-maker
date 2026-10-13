---
id: G045
baslik: /start sahiplenme akışı — sipariş no + e-posta → taslak site + düzenleme linki
rol: claude-kod
durum: bitti
alan: wf-platform
oncelik: 2
bagimli: [G039]
yazar: [platform/app/start/, platform/app/api/start/, platform/lib/claim/, platform/tests/claim.test.ts, platform/tests/claim-browser.ts, platform/previews/g045/, platform/README.md]
---

## Amaç
Etsy alıcısı satın aldıktan sonra kendi sitesini başlatır.

## Yapılacaklar
1. `/start?theme=<tema>`: tema önizlemesi, Etsy sipariş no (biçim kontrolü) + e-posta → slug önerisi → taslak site.
2. Düzenleme linkini göster + "bu linki kaydet" uyarısı; aynı sipariş no ile ikinci site sınırı.
3. Etsy API doğrulaması ve e-posta gönderimi için arayüz noktası (şimdilik kapalı; `docs/10` §3).

## Sonuç
**Durum: inceleme.** `/start` akışı yerelde (`local` adaptör, `next start`) uçtan uca çalışıyor ve test edildi. Hiçbir yere
yayınlanmadı; Vercel/Supabase projesi açılmadı, PR yok, görsel üretilmedi. Test verisi kurgu (`Avery & Jordan`, `*@example.test`,
uydurma sipariş numaraları). Ayrıntı: `platform/README.md` → "/start sahiplenme akışı (G045)".

**Yapılan**
- `/start?theme=<tema>` (`app/start/page.tsx`, `StartForm.tsx`, `start.module.css`; İngilizce, 390 px öncelikli, panelle aynı sade
  görünüm, dekor çizimi yok — K21): tema önizlemesi = **küçültülmüş canlı iframe** `/start/demo/<tema>` (temanın kendi şablonları +
  demo içeriği, önizleme kipinde; RSVP göndermez) + "Open the full demo". Temasız/geçersiz/`internal` tema → dostça sayfa + sunulabilen
  tasarım listesi.
- Form: Etsy sipariş no, e-posta, ilk isimler (demo kaydındaki isim sayısı kadar), web adresi (isimlerden önerilir, doluysa `-2`'ye kayar,
  elle yazılabilir, canlı "Available"/"already taken" + "Use …" önerisi). Kurallar tarayıcı ve sunucuda ortak (`lib/claim/fields.ts`).
- **Sipariş no biçimi (VARSAYIM):** Etsy'de "Order #1234567890" (yalnız rakam). `#`, "Order", boşluk/`-`/`.` atılır; **8–12 ASCII rakam**
  kabul (bugünkü numaralar 10 hane). Etsy API ile doğrulanmadı; `ORDER_NUMBER_MIN/MAX` ile değişir. README'de belgeli.
- `POST /api/start` (`lib/claim/claim.ts`, `api.ts`): taslak site = temanın demo içeriği + `record_kind: "customer"` + alıcının isimleri;
  `orderRef` (rakamlar), `ownerEmail`; `createSiteWithKeys` (anahtar yalnız hash). 201 → `editUrl`/`editPath`/`siteUrl`/`emailSent`.
  Sonuç ekranı: link büyük kutuda, **"Save this link"** uyarısı, **Copy link**, "Email it to myself" (`mailto:`, alıcının kendi posta
  uygulaması), **Open my editor** → G039 paneli. Sonuç `sessionStorage`'da (yenilemede kaybolmaz), "Start another website".
- **Sipariş başına bir site:** ikinci deneme → `409 order_used`, dostça mesaj; yanıtta slug/e-posta/link/kayıt bilgisi yok. Süreç içi
  sipariş kilidi (6 paralel istek → 1 site).
- **Hız sınırı** (`limits.ts`, RSVP'nin `RateLimiter` arayüzü): IP başına 10 deneme/15 dk, 5 site/24 sa, toplam 300 site/sa, adres ipucu
  120/15 dk; honeypot (`website`).
- **Etsy doğrulaması arayüzü** (`verify.ts`): `OrderVerifier` (`not_checked | verified | rejected | unavailable`), varsayılan
  `FormatOnlyVerifier` (kapalı). `CLAIM_ORDER_VERIFICATION=etsy` uygulanmadı → bilinçli hata (sessiz atlama yok). Uygularken doğrulanacak
  noktalar dosyada TODO olarak yazılı.
- **E-posta arayüzü** (`mailer.ts`, `docs/10` §3): `EditLinkMailer` + `DisabledMailer` (varsayılan; gönderim YOK, TODO açık). Sağlayıcı
  bağlanınca form/sonuç metni kendiliğinden "emailed" olur; gönderim hatası sahiplenmeyi bozmaz, link log'a yazılmaz.
- Demo içeriği kaynağı: `themes/<tema>/content.demo.json` (varsa) → yoksa `lib/claim/demo/<tema>.json` (koleksiyon kaydının kopyası,
  statik import; `blush-garden-rose` ← `collections/03_Blush_Garden_Rose/content.demo.json`, kopya sapınca test kırılır).
- Yazma alanı: `platform/app/start/`, `platform/app/api/start/`, `platform/lib/claim/`, `platform/tests/claim*.ts`,
  `platform/previews/g045/`, `platform/README.md` (yeni bölüm + klasör ağacı/özet satırları).

**Test edildi**
- `npm test` **135/135** (yeni `tests/claim.test.ts` 17 test): biçim kuralları; tema/demo kaynağı (kendi dosyası, paket kopyası,
  internal/demo'suz/bozuk/customer demo reddi, kopya = koleksiyon kaydı); 201 akışı (taslak, isimler, `orderRef`, e-posta, veri klasöründe
  düz anahtar yok, link panel API'sini açıyor, genel adres 404); aynı sipariş → 409 sızıntısız; paralel → tek site; adres (409 + öneri,
  otomatik `-2/-3`, ayrılmış/biçimsiz); reddedilen isteklerde dosya yazılmıyor; 415/413/400; hız sınırları; doğrulayıcı (kapalı, `etsy`
  hatası, 403/503/201); e-posta arayüzü (kapalı, sahte gönderici, hata durumunda 201 ve log'da link yok); adres ipucu API'si; demo sayfaları.
- `npm run typecheck` temiz; `npm run build` geçti (yeni rotalar `/start`, `/start/demo/[theme]`, `/start/demo/[theme]/[page]`,
  `/api/start`, `/api/start/slug`).
- Tarayıcı: `npm run build && NODE_PATH=/opt/node22/lib/node_modules node tests/claim-browser.ts` — `next start` + Chromium 390 px
  (isMobile/touch), **43/43**: temasız/geçersiz link → canlı demo iframe'i (demo isimleri görünüyor) → boş gönderimde 4 alan hatası →
  doldur (adres isimleri izliyor, "Available") → oluştur → büyük link + "Save this link" + kopyala (pano = link) → yenile (link duruyor) →
  **Open my editor → panel açılıyor ("Avery & Jordan", taslak)** → aynı sipariş → dostça mesaj, link/adres sızmıyor, yeni site yok →
  dolu adres `-2`'ye kayıyor / "Use avery-and-jordan-2" → ikinci site → masaüstü (1280) önizleme formun solunda; konsol hatası yok
  (beklenen 409 hariç), 390 px'te yatay taşma yok. Çıktılar `platform/previews/g045/` (13 görüntü, `start_flow_390.mp4`, `checks.json`).

**Test EDİLMEDİ / yapılmadı**
- Gerçek tema ile denenmedi: G038 (`blush-garden-rose`) bu dalda henüz yok; testler `_sample` kopyası fixture temayla. Tema dalda
  olduğunda tarayıcı testi onun başlat sayfasını ve panelini de çeker (`checks.json` notu). Paket demo kopyası hazır.
- Etsy API doğrulaması ve e-posta gönderimi **uygulanmadı** (yalnız arayüz + TODO; `docs/10` §3). Sipariş no biçimi varsayımdır.
- Gerçek telefonda (iOS Safari / Android Chrome) ve Vercel'de denenmedi; yalnız Chromium mobil emülasyonu. `mailto:` düğmesi gerçek posta
  uygulamasıyla denenmedi.
- Birden çok sunucu örneğinde "sipariş başına bir site" garantisi yok (kilit süreç içi) → G043'te `order_ref` benzersiz indeksi gerekir.
- `next.config.ts` `outputFileTracingIncludes` yeni rotaları (ve G039 panel rotalarını) kapsamıyor → Vercel'de temalar pakete girmeyebilir;
  dosya bu görevin yazma alanı dışında (G044 notu).
- Kayıp düzenleme linkini kurtarma yolu yok (e-posta yok, düz anahtar saklanmıyor, mağaza aracı yok). Çok ürünlü Etsy siparişinde ikinci
  tasarım için site açılamaz. Doğrulama kapalıyken biçimi doğru herhangi bir numara taslak site açabilir (yalnız hız sınırı + honeypot).

**Önerilen görevler** (entegratör açar): G043'e `sites.order_ref` benzersiz indeksi + kalıcı `RateLimiter` (claim + RSVP); G044'e
`outputFileTracingIncludes` güncellemesi (`/start`, `/start/demo/…`, `/api/start`, `/edit/[slug]`, `/api/edit/…`); e-posta sağlayıcısı
seçimi + `EditLinkMailer` uygulaması; Etsy API uygulaması + `EtsyOrderVerifier` (kullanıcı onayı); yönetici "yeni düzenleme linki" aracı;
G046 tema standardına `content.demo.json` (tema klasöründe demo kaydı) maddesi.

### İnceleme düzeltmeleri (2026-10-13, bağımsız inceleme bulguları)
- Kayıp yanıt: form tek bir `claimToken` üretip her denemede aynısını gönderiyor, ağ hatasında kendisi bir kez daha deniyor; site
  oluşmuş ama yanıt gelmemişse (aynı belirteç + e-posta, yayınlanmamış, < 24 sa) anahtarlar yenilenir ve 201 yeni linkle döner.
- Doğrulayıcı artık "sipariş kullanılmış" kontrolünden önce (doğrulama açıkken numaranın kullanıldığı sızmıyor).
- Operatör aracı: `scripts/reissue-edit-key.ts --order|--slug --origin` (yeni link, eski link ölür); "message the shop" metni artık
  bir araca dayanıyor. Destek süreci kullanıcı kararı.
- Vercel izleme: `/start`, `/start/demo/…`, `/api/start…` (ve panel/RSVP rotaları) `outputFileTracingIncludes`'ta; `npm run build`
  sonrası `trace-check.cjs` eksikte hata veriyor. `/start` başlıkları: `frame-ancestors 'none'`, `X-Frame-Options: DENY`.
- Test: `npm ci`, `npm test` (197/197), `npm run typecheck`, `npm run build` (+ yeni postbuild `trace-check`) temiz; `theme-check.cjs` 68/68, `panel-browser.ts` 72/72, `claim-browser.ts` 50/50, `rsvp-browser.ts` 25/25 (hepsi geçici klasöre, kayıtlı previews değişmedi); `tools/tests/*.py` 6/6. Gerçek telefon, gerçek Vercel/Blob ve canlı yayın **denenmedi**.
- Yapılmadı / karar: doğrulama kapalıyken numara kapma kod ile çözülemez → Etsy doğrulaması (ya da sipariş başına gizli kod) satış
  öncesi şart; hiç yayınlanmamış taslakların süre sonu silinmesi (zamanlanmış iş gerekir); sonuç ekranı linki `sessionStorage`'da
  kalmaya devam ediyor (yenilemede kaybolmasın diye; aynı anahtar `/edit` adresinde de var).

## Günlük
- 2026-10-13 alindi: wf-platform
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme bulguları düzeltildi (claimToken ile kayıp yanıt, doğrulayıcı sırası, link yenileme aracı, Vercel izleme, başlıklar) — wf-fix
- 2026-10-13 son denetim (wf-audit, origin/main edca755): npm ci, npm test 197/197, typecheck, build + trace-check, seed temiz; 390 px duman testi gerçek temayla 42/42 (misafir zarf→home→story→details→RSVP, alıcı /start→panel→foto→yayınla→QR→yanıt panelde; `tests/final-smoke.ts`, `previews/final/`); tools/tests 6/6; gorev.py kontrol temiz. Canlı Vercel yeniden yayını ve gerçek telefon denenmedi.
- 2026-10-13 entegratör onayladı
