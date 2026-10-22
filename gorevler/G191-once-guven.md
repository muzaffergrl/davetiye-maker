---
id: G191
baslik: Sipariş kontrolü "önce güven, sonra doğrula" (CLAIM_ORDER_VERIFICATION=trust) + saatlik kontrol
rol: claude-kod
durum: inceleme
alan: claude-session_015RTF9kCAoVGh7PDNq8XYeP
oncelik: 1
bagimli: [G147, G152]
yazar: [platform/lib/claim/trust.ts, platform/lib/claim/verify.ts, platform/lib/claim/claim.ts, platform/lib/sites.ts, platform/lib/data/types.ts, platform/lib/etsy/config.ts, platform/lib/etsy/verify.ts, platform/lib/etsy/recheck.ts, platform/lib/mail/templates.ts, platform/lib/admin/api.ts, platform/lib/admin/connections.ts, platform/lib/admin/summary.ts, platform/lib/admin/view.ts, platform/lib/marketing/placeholders.ts, platform/components/admin/AdminSite.tsx, platform/components/admin/AdminConnections.tsx, platform/components/admin/badges.tsx, platform/app/api/cron/orders/, platform/vercel.json, platform/scripts/verify-order.ts, platform/tests/trust-orders.test.ts, platform/tests/g147-etsy-mail.test.ts, platform/tests/g152.test.ts, platform/tests/g174-security.test.ts, docs/10_SITE_PLATFORMU.md, gorevler/G191-once-guven.md]
---

## Amaç
Kullanıcı talebi (2026-10-22): satış sonrası sipariş kontrolünde insan onayı adımı kalksın. Seçilen yol: "önce güven, sonra
doğrula" — alıcı siteyi hemen yayınlar, sipariş arka planda kontrol edilir; uymayan site yayından kalkar. Görevi kullanıcının
doğrudan isteğiyle bu oturum açtı (entegratör numarayı değiştirebilir).

## Sonuç
**2026-10-22 · durum: inceleme.** Dal `claude/gallant-fermi-3qub8h`. Yayın yok, canlı ortam değişkeni değişmedi.

- Yeni mod `CLAIM_ORDER_VERIFICATION=trust` (`lib/claim/verify.ts TrustOrderVerifier`): Etsy'nin kesin cevabı geçerli
  (onaylı / ret); diğer her durum `provisional` — site hemen yayınlanabilir, paylaşılan önizleme açık. `OrderCheckRecord.status`
  += `provisional`, `reviewAt`. Etsy "ödenmemiş" cevabı artık `unpaid: true` taşır (`decideFacts`).
- `lib/claim/trust.ts sweepProvisionalOrders`: Etsy onaylarsa `verified`; ret ya da 48 saatte ödenmemiş → `holdOrder`
  (`lib/sites.ts`: `pending` + yayından kaldır) + dükkân e-postası "held"; 48 saat dolup cevap yoksa site yayında kalır, dükkâna
  bir kez "review" e-postası, admin "Yapılacak".
- Çalıştıran: saatlik Vercel Cron `GET /api/cron/orders` (`vercel.json`, dakika 17; `CRON_SECRET` ≥ 16 karakter şart, yoksa 503;
  yalnız `trust` modunda; yanıtta yalnız sayılar) + admin "Bekleyen siparişleri Etsy'de kontrol et".
- Admin: site sayfasında "Önce güven: sipariş henüz doğrulanmadı" kartı → "Siparişi onayla" / **"Yayından kaldır ve beklet"**
  (`hold` eylemi, nedeniyle); rozet, liste/CSV etiketi, geçmiş satırları; Bağlantılar kartında mod metni + Etsy bağlı değilken uyarı.
  Dükkânın beklettiği site (`by: support`) Etsy tekrar kontrolüyle (panel / admin düğmesi) serbest kalmaz.
- Testler: `tests/trust-orders.test.ts` (7 test; sahte Etsy ve sahte e-posta). Mevcut 3 testte Etsy "pending" beklentisine
  `unpaid: true` eklendi. Tam paket sonucu aşağıda.

### Yapılmadı / açık
- **2026-10-22:** kod main'e birleşti (`e36a7a31`, Git bağlı → production yayını). **Blokaj:** bu oturumun Vercel bağlayıcısı yalnız eski
  `daimonflora` ekibini görüyor; bkestudio.com'un `bkestudio` ekibi / `davetiye-maker` projesi görünmüyor, bu ortamdan bkestudio.com'a ağ
  erişimi de yok (vekil 403). Bu yüzden `CRON_SECRET` + `CLAIM_ORDER_VERIFICATION=trust` girilmedi, yayının Ready olduğu doğrulanmadı.
  Mod `manual` kaldıkça canlı davranış değişmedi; saatlik cron CRON_SECRET olmadan 503 döner (zararsız).
- Gerçek Etsy ile denenmedi (Etsy uygulaması yok). Etsy bağlanana kadar "sonra doğrula" otomatik değil: dükkân e-postayla haber alır.
- SMTP canlıda açık değilse dükkân e-postaları gitmez; o durumda admin "Yapılacak" listesi tek uyarı yeri.
- Bekletilen alıcıya e-posta gitmez; panelde "We are still confirming your Etsy order" görür. Dükkân Etsy'den yazar.
- Önerilen görev: Gmail'e gelen "You made a sale" e-postalarını (DKIM kontrollü) okuyan doğrulayıcı — Etsy onayı gelene kadar
  "sonra doğrula"yı otomatik yapar.

## Günlük
- 2026-10-22 alindi + inceleme: claude-session_015RTF9kCAoVGh7PDNq8XYeP (kullanıcı talebi)
- 2026-10-22 main'e birleşti; Vercel ortam değişkenleri blokajda (bağlayıcı bkestudio ekibini görmüyor)
- 2026-10-22 **canlıda doğrulandı** (kullanıcının ekran görüntüleri): production yayını `00027653` (G191'i içeriyor) + Redeploy;
  Vercel Logs `GET /api/cron/orders` 200 (14:51:52); admin Bağlantılar "Sipariş kontrolü: Önce güven (trust)" + "Etsy bağlı değil" uyarısı.
  SMTP canlıda ayarlı değil → dükkân e-postaları gitmiyor; uyarı metni buna göre düzeltildi.
- 2026-10-22 not: Vercel bkestudio (Pro) ekibi, ekip üyesi olmayan commit yazarlarının yayınlarını "Blocked" yapıyor
  (ör. `cetin@maora.studio`, büyük ihtimalle `noreply@anthropic.com`); main'e giden commit'ler ekip üyesi yazarla atılmalı.
- 2026-10-22 not: kullanıcının bilgisayarındaki tarayıcıda bkestudio Vercel hesabı açık; bulut oturumu oraya ulaşamaz, yerel
  oturum (`claude-tarayici`) Vercel ayarlarını tarayıcıdan yapabilir. Kullanıcı elle yapmayı sordu; adımlar sohbette verildi.
