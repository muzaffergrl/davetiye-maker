# Yerel oturum talimatı: K49 fiyatları + hizmet taslakları (2026-10-22)

Bulut oturumu etsy.com'a ulaşamıyor (proxy 403). Bu işi kullanıcının bilgisayarındaki Claude (Claude in Chrome, docs/30 ile
aynı oturum) yapar. Aşağıdaki bloğu **olduğu gibi** yerel oturuma yapıştır. Fiyat kararı: K49 (docs/01), gerekçe docs/35 §8b.

---

```
Görev: BKE Studio Etsy dükkânında (studiobke.etsy.com, Shop Manager) K49 fiyatlarını uygula ve üç hizmeti TASLAK olarak ekle.
Hiçbir ilanı YAYINLAMA. Bir adım başarısızsa dur ve olduğu gibi raporla; yapılmamış adımı yapılmış yazma.

0) Repo: muzaffergrl/davetiye-maker → `git fetch origin && git checkout main && git pull`
   (yeni fiyatlar, etsy_upload.json'lar ve yeni CUSTOM_DESIGN.pdf main'de).

1) Var olan BÜTÜN tasarım taslakları (Listings → Drafts: 01–21 ve tools/etsy_ids_22_48.json'daki 22–32, 39–48 ID'leri):
   her birinde yalnız FİYATI değiştir: → 1.190 TL (eski 1.460 TL ya da başka bir değer). Başka alana dokunma.
   Üstü çizili fiyat / Sale AÇMA (lansman düz fiyat, K49).
   Kaydetmeden önce fiyat alanını oku ve 1190 olduğunu doğrula → "Save draft".

2) Üç yeni TASLAK ilan. Her biri collections/_services/<id>/package/listing/etsy_upload.json'dan:
   | id              | fiyat   | dijital dosya                                                  |
   | setup-service   | 990 TL  | collections/_services/setup-service/package/customer/SETUP_SERVICE.pdf   |
   | custom-design   | 4490 TL | collections/_services/custom-design/package/customer/CUSTOM_DESIGN.pdf   |
   | extra-revision  | 690 TL  | collections/_services/extra-revision/package/customer/EXTRA_REVISION.pdf |
   Alanlar: title, description (tam metin, json'daki gibi), 13 tags, kategori Invitations (Paper & Party › Paper ›
   Invitations & Announcements › Invitations; yoksa en yakın dijital düğün kategorisi — hangisini seçtiğini yaz),
   tür Digital, attributes (json'daki satırlar), adet 999, bölüm "Services" (yoksa oluştur), yenileme Automatic
   (21 tasarım taslağıyla aynı), görseller images_editorial/01…04 json sırasıyla (01 = Featured), video yok.
   "How is this digital content created?" → tasarım taslaklarındaki seçimle aynı ("With an AI generator") ve
   "Who made it" json'daki gibi. Her taslakta kaydetmeden önce başlık, fiyat, adet, dosya adı ve görsel sayısını
   form değerlerinden oku → "Save draft".
   Hizmetlerde indirim/Sale YOK.

3) Etsy politikası (json'daki open_checks): ilan oluştururken Etsy bir uyarı/engel gösterirse (hizmet, özel tasarım,
   AI beyanı) metnini aynen yaz ve o taslağı olduğu yerde bırak. Etsy'nin "custom/personalized items" ve "services"
   kurallarını Help Center'dan oku; özel tasarım ve kurulum ilanına izin veriyor mu, tek paragraf özetle.

4) Kanıt: Listings → Drafts ekranı (tasarım taslakları + 3 hizmet, Active 0 beklenir) + üç hizmet taslağının ekranı.
   Ekranları docs/20_etsy_taslaklar_20261022/ altına kaydet.

5) Kayıt: docs/20 §7'ye yeni alt bölüm ("7.11 K49 fiyatları + 3 hizmet taslağı, 2026-10-22"): ne yapıldı, ne yapılmadı,
   Etsy'nin gösterdiği uyarılar, seçilen kategori. Commit + push (main; önce git pull --rebase).

6) Bitince bana: bütün taslakların durumu (fiyat doğrulandı mı), üç hizmetin taslak linkleri (etsy.com/your/shops/me/listing-editor/…),
   politika özeti. Yayın için ayrıca "yayınla" demem gerekir.
```

---

**Kullanıcıdan gereken:** yalnız bu bloğu yerel oturuma yapıştırmak (Etsy hesabı orada açık). Yayın onayı ayrı.
