---
id: G088
baslik: Refero Pro ile tasarım turu — satış sitesi, alıcı paneli ve admin ekranları en iyi örneklere göre (K31)
rol: claude-tarayici
durum: alindi
alan: claude-local-1
oncelik: 2
bagimli: [G087]
yazar: [docs/18_REFERANS_TASARIM.md, docs/18_referans/]
---

## Amaç
K31: genel tasarım (satış sitesi, panel ve paneldeki ekranlar) Refero Pro'daki en iyi örneklere bakılarak yeniden ele alınır.
Bu görev **araştırma + tasarım kararı** üretir; kodu G089 ve sonraki claude-kod görevleri uygular.

## Yapılacaklar
1. Refero Pro'da (kullanıcının hesabıyla, tarayıcıda) ekran türü başına en iyi 5–8 örnek: pazarlama ana sayfası, ürün/şablon galerisi,
   ürün ayrıntı sayfası, fiyat/SSS; onboarding sihirbazı, düzenleyici (form + canlı önizleme), yayınla/paylaş, misafir listesi
   (tablo/kart), ayarlar; admin liste + ayrıntı + tehlikeli eylem onayı. Mobil örnekler öncelikli.
2. Her ekran türü için: neden iyi (hiyerarşi, boşluk, tipografi, hareket, boş/hata durumları), bizim ekranımızda neyin değişeceği,
   öncelik. Ekran görüntüsünü kopyalamak yok (şart 6); not + küçük referans kırpımı yalnız `docs/18_referans/` (yayına girmez).
3. Sonuç: `docs/18_REFERANS_TASARIM.md` — ekran başına değişiklik listesi ve gerekiyorsa GPT comp istekleri (GM04/GM05 dili korunur).

## Notlar
- Refero Pro erişimi kullanıcının hesabında; oturum açık tarayıcı gerekir (claude-tarayici). Erişim yoksa blokaj yaz.

## Sonuç

## Günlük
- 2026-10-15 açıldı (kullanıcı isteği K31)
- 2026-10-15 alindi: claude-local-1 (kullanıcı isteğiyle; bağımlılık G087'nin dosyası hâlâ 'alindi' ama /admin main'de ve canlıda — G092/G096'da denendi)
