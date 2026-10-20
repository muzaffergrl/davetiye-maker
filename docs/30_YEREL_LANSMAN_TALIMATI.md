# Yerel oturum için lansman talimatı (2026-10-20)

Aşağıdaki bloğu **olduğu gibi** yerel Claude Code / Codex oturumuna yapıştır. Bulut oturumunun erişemediği üç şeyi o yapar:
bkestudio.com'u sunan Vercel projesi, tarayıcıda Etsy ve gerçek yayın. Satışın açılması için sitenin `launched: true`
olması **şart değil**: alıcı Etsy'den alır, PDF'teki link `bkestudio.com/start`'a gider. `launched` yalnız satış sitesinin
Google'da görünmesi ve "Buy on Etsy" düğmeleri içindir; ilan linkleri gelince bulut oturumu açar (docs/29 C).

---

```
Görev: BKE Studio'yu (repo muzaffergrl/davetiye-maker) bugün satışa aç. Sırayla yap; bir adım başarısızsa dur ve
sonucu olduğu gibi raporla. Hiçbir adımı yapılmış gibi yazma.

1) Kod: `git fetch origin && git checkout main && git pull` → `git merge --no-ff origin/claude/focused-tesla-37o26v`
   (çakışma olursa dur, bana sor). `cd platform && npm ci && npx tsc --noEmit && npm test && npm run build`.
   Hepsi yeşilse `git push origin main` (commit yazarı benim Git kimliğim olmalı; Vercel Claude yazarlı commit'i engeller).

2) Vercel — bkestudio.com'u sunan proje (Production). Ortam değişkenleri:
   - CLAIM_ORDER_VERIFICATION=manual   (her sipariş admin'den onaylanmadan site yayına çıkmaz)
   - ADMIN_PASSWORD = en az 16 karakterlik yeni rastgele bir şifre üret, Vercel'e "Sensitive" olarak yaz, bana
     sohbette ayrıca söyle (repoya ve dosyaya yazma).
   - PLATFORM_PUBLIC_URL=https://bkestudio.com ve MARKETING_SITE_URL=https://bkestudio.com (yoksa ekle).
   - Ekip planı Hobby ise bana söyle (ticari kullanım için Pro gerekir); kendin plan değiştirme.
   Sonra main'i production'a yayınla (docs/10 §2c'deki yol). Yayından sonra:
   `cd platform && LIVE_BASE_URL=https://bkestudio.com node scripts/live-check.mjs` ve `node scripts/blob-smoke.mjs`.
   Sonucu docs/10 §2c'ye tek satır yaz (commit, deployment id, live-check sayıları), commit + push.

3) Uçtan uca deneme (gerçek tarayıcı, 390 px): https://bkestudio.com/start?theme=olive-ivory → sipariş no "20261020TEST",
   e-posta benimki, isimler "Test & Deneme" → panel açılıyor mu, foto yükle, kaydet. /admin'e yeni şifreyle gir →
   Yapılacaklar'da sipariş var mı → "Siparişi onayla" → panelde Publish açılıyor mu → yayınla → site misafir gibi
   açılıyor mu → bir RSVP gönder → panelde görünüyor mu. Sonra test sitesini admin'den SİL. Her adımın sonucunu yaz.

4) Etsy (tarayıcıda, studiobke.etsy.com, Shop Manager):
   a) Policy settings → Privacy policy: docs/28_ETSY_GIZLILIK_METNI.md'deki metni yapıştır; [DATA CONTROLLER NAME] ve
      [POSTAL ADDRESS] yerine bana sorup aldığın bilgileri yaz. Bilgi yoksa bu adımı atla ve söyle.
   b) docs/20 §1.4–1.5'teki "Message to buyers" metinleri Etsy'dekiyle aynı mı bak; eski adres (vercel.app ya da
      xn--bkestudo-zkb.com) varsa bkestudio.com'lu metinle değiştir.
   c) 01–21 için ilan oluştur: her tasarımda collections/NN_*/package/listing/etsy_upload.json (başlık, açıklama, 13 etiket,
      kategori, özellikler, fiyat price_try = 1460 TL, adet, bölüm), görseller images_editorial/ (json'daki sırayla),
      video package/listing/video.mp4, dijital dosya package/customer/START_HERE.pdf. Yenileme: "automatic".
      Önce TASLAK kaydet; 21 taslağın ekran görüntüsünü bana göster, "yayınla" dersem yayınla.
   d) Yayınlanan her ilanın linkini şu biçimde listele (satır başına): `01 https://www.etsy.com/listing/...`

5) Bitince: hangi adımlar tamam, hangileri değil, ilan linkleri listesi. O listeyi bulut oturumuna verirsem
   `tools/ilan_baglantilari.py` ile satış sitesine bağlayıp `launched: true` yapacak.
```

---

**Senden gerekenler (yerel oturum soracak):** yasal ad + posta adresi (gizlilik politikası için), taslakları
gördükten sonra "yayınla" onayı. İlan linkleri gelince bana yapıştır; satış sitesini ben açarım.
