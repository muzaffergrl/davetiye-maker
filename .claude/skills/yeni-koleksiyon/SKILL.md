---
name: yeni-koleksiyon
description: İlk set satışa hazır olduktan sonra yeni bir koleksiyon (yeni stil) veya mevcut koleksiyonun varyantını (renk, nişan, save-the-date, klipsiz, ülke) açmak için kullan. Klasör, durum kaydı ve içerik kaydını kurar.
---

# Yeni koleksiyon / varyant

## Önce karar ver: koleksiyon mu, varyant mı?
- **Varyant:** aynı tasarım sistemi; renk, etkinlik türü (save-the-date, engagement),
  klipsiz/fotoğraflı sürüm veya locale (en-GB) farkı. Mevcut koleksiyon klasöründe kalır.
- **Yeni koleksiyon:** kendine ait tasarım kararı olan yeni stil. Aynı zarfın rengini
  değiştirmek yeni koleksiyon değildir.

## Ön şart
`PROJECT_STATE.json`'da en az bir koleksiyon `sale_ready` değilse kullanıcıya bunu tek
cümleyle hatırlat (karar: "önce mevcut set bitirilir"). Kullanıcı yine de isterse devam et.

## Yeni koleksiyon adımları
1. `collections/NN_<Calisma_Adi>/` oluştur (NN sıradaki numara), alt klasörler:
   `canva/ assets/ website/ previews/ references/approved/ references/market_only/ archive/`
2. `COLLECTION_STATUS.md`'yi `01_Olive_Ivory`'deki yapıyla yaz: görsel kimlik, renk token'ları,
   font sistemi, teslim parçaları tablosu (hepsi başlangıçta "yapılmadı").
3. `content.demo.json`: yeni kurgu çift/etkinlik; tüm `urls` null.
   `python tools/validate_content.py` ile doğrula.
4. `PROJECT_STATE.json` → `collections` dizisine kayıt ekle (`status: "concept"`,
   `is_brand_decision: false`).
5. Çalışma adı marka değildir; README/ilan metnine marka diye yazma.

## Her varyantta kısa tekrar testleri
Link hedefleri · içerik tutarlılığı (`icerik-tutarlilik`) · fotoğraf değişimi (dikey/yatay/
karanlık kaynak) · metin taşması (uzun isim) · ölçü (1080×1920, website breakpoint'leri).
