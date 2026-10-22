---
id: G197
baslik: Rehber dalga 3 — N5 (RSVP son tarihi), N6 (cevap vermeyen misafir), G3 odak değişikliği; İngilizce
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G195]
yazar: [platform/content/guides/, platform/previews/g197/, docs/36_ICERIK_PLANI.md, gorevler/G197-rehber-n5-n6.md]
---

## Amaç
Kullanıcı (2026-10-22): "dalga 3 ile devam et, N5 ve N6'yı yaz" (docs/36).

## Sonuç (2026-10-22, bulut oturumu)
- `content/guides/wedding-rsvp-deadline.md` (N5, order 11, 1.224 kelime): kısa cevap, sözleşmelerden geriye hesap (5 adım +
  çalışılmış örnek: düğün Cumartesi 12 Haziran 2027 → catering 29 Mayıs → son tarih Cuma 21 Mayıs → davetiye Cuma 16 Nisan;
  günler hesapla doğrulandı), düğün türüne göre tablo (kural olarak işaretli), yazım, posta/çevrimiçi, saat dilimi, tarihi
  taşımak, sonrası.
- `content/guides/guests-did-not-rsvp.md` (N6, order 12, 1.392 kelime): nedenler, eksikleri bulma kontrol listesi (hane
  bazında eşleştirme), takip planı tablosu, 5 kopyalanabilir mesaj + telefon metni, karar verme ("regrets only" istisnası),
  geç yanıt ve habersiz gelen, gelecek sefer için.
- G3 (`when-to-send-your-wedding-website.md`): başlık `When to Send Your Wedding Website and Invitations`; "Choosing the RSVP
  deadline" + "Reminders" tek kısa bölüm oldu (N5 ve N6'ya link); yeni bölüm "If the wedding is less than three months away".
  Kanibalizasyon: "when to send" ve "RSVP deadline" aramalarında ortak sonuç yoktu (docs/36).
- RSVP son tarihi bağlamında G3'e giden linkler N5'e çevrildi: G1 (2), N2 (1); G5'in link metni yeni G3 başlığına uyarlandı;
  N2 → N6.
- claude-seo `content_quality.py`: N5 80, N6 76, G3 78 (dolgu 0, AI kalıbı 0).
- Ürün cümleleri koddan: form son yanıt gününün sonunda sitenin saat diliminde kapanır (`lib/rsvp/deadline.ts`), tarih
  panelde değişince yeniden açılır, çift "Add a reply" ile telefonla gelen yanıtı ekler ve "Added by you" işaretlenir
  (`components/panel/guests.tsx`), misafir listesi içe aktarma yok, bu yüzden panel kimin yanıt **vermediğini** göstermez
  (rehber bunu açıkça yazıyor).
- Kaynaklar: Emily Post `invitation-timing`, `what-to-do-when-guests-dont-rsvp` (arama sonuçlarından doğrulandı).
- Kontrol: build temiz; N5, N6 ve G3 200, tek H1, Article + BreadcrumbList; /guides 12 rehber listeliyor; 390 px'te yatay
  taşma yok. Görüntüler `platform/previews/g197/`.
- Testler: TEST_SONUCU
- Çeviri yapılmadı: N5/N6 diğer dillerde İngilizce görünür; G3'ün yeni başlığı/bölümleri ve değişen linkler çevirilere
  henüz işlenmedi (çeviri adımında senkronlanır).

## Önerilen görevler (entegratöre)
- N5 + N6 çevirisi; G3 çevirilerinin yeni yapıya göre güncellenmesi; G1/G2/G5/N2 çevirilerinde değişen linkler.
- Dalga 4: N7 (ücretsiz/ücretli), N8 (Our Story) (docs/36).

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: N5 + N6 yazıldı, G3 güncellendi
