---
id: G091
baslik: Alıcı yolculuğu — ilan, satın alma ve satış sonrası: alıcıda hiçbir soru işareti kalmasın (K32)
rol: claude-metin
durum: alindi
alan: claude-G091
oncelik: 1
bagimli: []
yazar: [docs/19_ALICI_YOLCULUGU.md, docs/05_SET_PAKETI.md, collections/01_Olive_Ivory/package/customer/, collections/02_Dusty_Blue/package/customer/, collections/03_Blush_Garden_Rose/package/customer/, collections/04_Vintage_Airmail/package/customer/, collections/05_Lemon_Mediterranean/package/customer/, collections/*/package/listing/listing.md, collections/*/package/listing/listing_v3.md]
---

## Amaç
K32 (kullanıcı, 2026-10-15): Etsy'de ilanı incelerken, satın alırken ve satın aldıktan sonra alıcının kafasında **hiçbir soru
işareti ve endişe** kalmamalı; siteyi **kolayca düzenleyebileceğine ikna olmalı**. Satış sonrası bütün bilgilendirmeler ve rehberler
hazır olmalı; alıcı ürünü en kolay şekilde istediği gibi düzenleyebilmeli.

## Yapılacaklar
1. `docs/19_ALICI_YOLCULUGU.md`: aşama aşama yolculuk haritası (ilanı görme → inceleme → satın alma → indirme → /start → kurulum →
   yayın → paylaşma → yanıtlar → düğün sonrası → arşiv); her aşamada alıcının olası soruları/endişeleri, bugün nerede cevaplandığı
   (ilan metni, ilan görseli, SSS, START HERE PDF, Etsy mesajı, /start, panel, satış sitesi rehberi) ve **boşluklar**.
2. Soru envanteri: satın alma öncesi + sonrası en az 40 soru, her birine kısa dürüst cevap ve cevabın konacağı yer.
3. Etsy metinleri (İngilizce): ilan açıklaması ortak iskeleti (What you get · How it works in 3 steps · What you can change ·
   What your guests see · What you need · FAQ), Etsy'nin dijital ürün "message to buyers" alanı ve **satış sonrası mesaj şablonları**
   (sipariş onaylandı / başlatma linki hatırlatma / kayıp düzenleme linki / isim-tarih hakkı / yayınla nasıl / iade-sorun). Şablonlar
   admin paneline bağlanacak (G087): her şablon için kısa ad, ne zaman gönderilir, metin, `{order}` `{names}` `{site_url}` `{edit_url}`
   `{shop}` yer tutucuları.
4. START HERE rehberini güncel panele göre yeniden yaz (K29: 3 adımlı kurulum, Home/Edit/Guests/Share, düzenleme linkini kaydetme,
   sipariş onayı bekleme hâli, isim/tarih hakkı, şifre, teşekkür modu): ortak İngilizce kaynak + 01–05 için tasarım adlı kopyalar;
   PDF'ler `tools/md_to_pdf.py` ile. Her adım gerçek ekrana göre (ekran görüntüleri `platform/previews/g060/`, `g066`, `g069`,
   `g075`, `g076`, `collections/*/package/shots/`).
5. Panel içi yardım ve /start metinleri için öneri listesi (dosya + mevcut metin → önerilen metin); kodu G087 uygular.

## Kurallar
Yalnız gerçekten çalışan özellik vaat edilir (docs/05 §E). Fiyat, destek e-postası, dükkân adı, yanıt süresi (SLA), iade politikası
**uydurulmaz**: açık yer tutucu kalır. Tarih biçimi `June 12, 2027`. Rakip metni kopyalanmaz.

## Sonuç

## Günlük
- 2026-10-15 açıldı ve alındı (claude-G091, kullanıcı isteği K32)
