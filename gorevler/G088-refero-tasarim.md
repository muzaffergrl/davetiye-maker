---
id: G088
baslik: Refero Pro ile tasarım turu — satış sitesi, alıcı paneli ve admin ekranları en iyi örneklere göre (K31)
rol: claude-tarayici
durum: bitti
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
**Yapıldı (2026-10-15, claude-local-1):** `docs/18_REFERANS_TASARIM.md`. Refero Pro'ya kullanıcının hesabıyla (Chrome, oturum açık) girildi;
Refero **Research mode** ile 6 ekran türü araştırıldı: kurulum sihirbazı, düzenleyici (Edit + şerit), ana ekran + ayarlar, Share + Guests,
satış sitesi (ana sayfa/galeri/tasarım/fiyat-SSS), dükkân paneli. Her biri için referans ürünler (Shopify, Notion, Craft, Luma, Linktree,
Hitchd, Partiful, Squarespace, Typeform, Zendesk…), neden iyi oldukları ve **bizim ekranlarımızda ne değişecek** tablosu (P1/P2/P3);
"bizde şu an" G079/G092/G096 canlı gezintilerinden.
**Öne çıkan P1'ler:** kurulum 1. adımı tek işe indir; yayın başarı ekranında link + Share önde; Day & place'te seyrek ayarlar "More options"a;
alan başına "Sample" rozetleri yerine sayfa başında tek satır; Guests'te liste önde, soru dökümü ayrı "Results" görünümü; tasarım sayfasında
tek birincil eylem; admin Özet'te Yapılacaklar en üstte. Üç GPT comp isteği (§7: Guests v3, kurulum sade + başarı ekranı, tasarım sayfası).
**Şart 6:** ekran görüntüsü kopyalanmadı; `docs/18_referans/` açılmadı, yerine Refero araştırma bağlantıları (yalnız kullanıcının hesabıyla açılır).
**Sapma:** G087'nin görev dosyası 'alindi' olduğu için `gorev.py al` reddetti; kullanıcının isteğiyle elle sahiplenildi (G087'nin işi main'de ve canlıda).
**Sınır:** Refero'nun web örnekleri masaüstü yakalamaları; düğün sitesi düzenleyicisinin birebir örneği kütüphanede yok (Refero analizi de bunu yazıyor).
Kod yok; uygulama G089 ve sonraki claude-kod görevleri.

## Günlük
- 2026-10-15 açıldı (kullanıcı isteği K31)
- 2026-10-15 alindi: claude-local-1 (kullanıcı isteğiyle; bağımlılık G087'nin dosyası hâlâ 'alindi' ama /admin main'de ve canlıda — G092/G096'da denendi)
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-16 entegratör onayladı
