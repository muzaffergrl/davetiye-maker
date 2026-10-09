---
name: canva-guvenli-duzenleme
description: Canva'daki bir master tasarımı (video, website, kart, PDF) değiştirmeden ÖNCE yükle. Taslak/transaction ile kalıcı kaydı ayıran, kullanıcı değişikliklerini koruyan draft → önizleme → onay → commit → yeniden okuma prosedürü. "Canva'da düzelt", "mühürü onar", "fotoğrafı değiştir", "kaydet", "commit" gibi isteklerde kullan.
---

# Güvenli Canva düzenleme

Bu projede iki kez yaşanan hata: (1) onarım taslakta kaldı ama "düzeldi" denildi,
(2) yeni import/kopya, eski master düzelmiş gibi raporlandı. Bu prosedür ikisini önler.

## 1. Hedefi belirle
- `PROJECT_STATE.json`'dan **design ID**'yi al (thumbnail URL değil).
- Aktif bir `transaction_id` kayıtlı mı bak. Kayıtlıysa geçerli olduğunu varsayma.

## 2. Canlı oku
- Tasarımı şu an olduğu haliyle oku (sayfalar, öğeler, asset ID'leri, metinler).
- `PROJECT_STATE.json` → `user_edits_to_preserve` ile karşılaştır. Kullanıcının sonradan
  yaptığı değişiklikleri not et; bunlara dokunma.
- `broken_assets_to_replace` listesindeki ID'ler hâlâ duruyor mu, tespit et.

## 3. Taslakta minimum değişiklik
- Yalnız gereken öğeleri güncelle (asset değiştir, konum/boyut, metin). Tüm dosyayı yeniden
  import etme, sayfayı silip baştan kurma.
- Canonical koordinatlar ve temiz asset ID'leri: `collections/<koleksiyon>/COLLECTION_STATUS.md`.
- Aracın döndürdüğü başarı yanıtının **tüm** istenen işlemleri kapsadığını kontrol et
  (ör. "16 güncelleme uygulandı" = beklenen sayı mı?).

## 4. Önizleme → açık onay
- Aracın önizlemesini/linkini kullanıcıya göster. Önizleme kaynağını açıkça söyle
  (Canva önizlemesi mi, yerel kaynak görsel mi).
- Kullanıcı **açıkça** onaylamadan commit etme.

## 5. Commit
- Onaydan sonra commit et. Hata dönerse "kaydedildi" deme; hatayı aynen bildir.

## 6. Doğrula
- Aynı design ID'den **yeniden oku**. Yeni asset ID'leri kayıtlı mı, eski bozuk ID'ler gitti mi,
  kullanıcı değişiklikleri yerinde mi?

## 7. Durumu yaz
`PROJECT_STATE.json` ilgili kaydı: `status`, `transaction_id` (commit sonrası kaldır),
`committed: true`, notlar, tarih. Koleksiyonun `COLLECTION_STATUS.md` tablosunu güncelle.

## Raporlama sözlüğü
| Durum | Söylenecek |
|---|---|
| Taslakta uygulandı | "Taslakta uygulandı, onayını bekliyor (transaction …)" |
| Commit başarılı + yeniden okuma doğruladı | "Kalıcı kaydedildi ve doğrulandı" |
| Commit başarılı, okuma yapılamadı | "Commit başarılı döndü; yeniden okuma yapılamadı" |
| Yeni dosya oluştu | "Yeni dosya (ID …) oluştu; eski master değişmedi" |
