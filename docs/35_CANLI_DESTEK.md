# Canlı destek — yapay zekâ asistanı (Gemini)

Kullanıcı talebi (2026-10-22): satış sitesine ve müşteri paneline AI canlı destek; Gemini API'nin ücretsiz katmanı.
API anahtarı sonra verilecek; ekranlar ve sunucu tarafı anahtardan önce hazır.

## Ne var
- **Satış sitesi** (bütün sayfalar, 5 dil): sağ altta "Chat with us" düğmesi → telefonda alttan açılan pencere,
  geniş ekranda 390 px pencere. Tasarım sayfasındaki yapışkan Etsy çubuğu ve karşılaştırma tepsisi varken düğme
  onların üstüne kalkar. Sohbet kodu ilk dokunuşta iner (ilk yük JS bütçesi değişmedi). `?chat=open`, `#chat` ya da
  `<a data-open-chat>` pencereyi açar.
- **Panel** (`/edit/<slug>`): üst çubukta sohbet simgesi (bölüm sayfalarında ve dükkân oturumunda yok), Home'un altında
  "Chat with us", Help penceresinin başında "Ask our assistant". Panelden sorulduğunda asistana sitenin birkaç bilgisi
  gider: tasarım, taslak/yayında, kalan isim-tarih hakkı, yayında kalma tarihi, sipariş onayı bekliyor mu, misafir
  şifresi açık mı, site dilleri. **İsimler, misafirler, yanıtlar, anahtarlar gitmez.**
- Ekranlar: karşılama + 4 hazır soru, yazıyor göstergesi, "New chat", "Talk to a person" (Etsy), hata durumları
  (çok mesaj, günlük sınır, yoğun, bağlantı yok, tekrar dene) ve **anahtar yokken "Our assistant is almost ready"**
  ekranı: SSS + Etsy mesajı + e-posta. Metinler EN/TR/ES/DE/FR.
- Asistanın bilgisi satış sitesinin kendi kaynaklarından üretilir (llms.txt özeti, SSS, isim-tarih kuralı) + panel
  rehberi (`lib/support/knowledge.ts`). Kurallar: yalnız bu bilgiyle yanıt, fiyat/iade/politika uydurma yok, söz verme
  yok, düzenleme linki/şifre/ödeme bilgisi istemez, bilmediğinde Etsy'ye/e-postaya yönlendirir, kullanıcının dilinde.

## Kod
| Dosya | İş |
|---|---|
| `platform/lib/support/config.ts` | ortam değişkenleri, sınırlar |
| `platform/lib/support/knowledge.ts` | sistem talimatı (bilgi + kurallar) |
| `platform/lib/support/gemini.ts` | Gemini REST çağrısı (`generateContent`, anahtar `x-goog-api-key` başlığında) |
| `platform/lib/support/chat.ts` | `GET/POST /api/support/chat`: doğrulama, sınırlar, panel bilgileri |
| `platform/components/support/` | sohbet penceresi, satış sitesi düğmesi, metinler, CSS |
| `platform/components/panel/SupportSheet.tsx` | paneldeki sohbet sayfası |
| `platform/tests/support-chat.test.ts` | 12 test (sahte fetch; Google'a istek yok) |

## Anahtar gelince (tek adım)
Vercel projesi `davetiye-platform` → ortam değişkeni **`GEMINI_API_KEY`** (Production + Preview, Secret) → yeniden yayın.
Kod değişikliği gerekmez; pencere kendiliğinden "hazır" moduna geçer. İsteğe bağlı:
- `GEMINI_MODEL` (varsayılan `gemini-2.5-flash`; ücretsiz katmanda yalnız Flash/Flash-Lite var, Pro ücretli),
- `SUPPORT_DAILY_LIMIT` (varsayılan 200 yanıt/gün, bütün platform; dolunca pencere insan iletişimine döner),
- `SUPPORT_CHAT=off` (asistanı kapat, pencere "hazır değil" ekranını gösterir), `SUPPORT_CHAT=demo` (yalnız yerel
  test: Google'a gitmeden sabit yanıt).

Sınırlar: ziyaretçi (IP) başına 5 dakikada 12, günde 60 mesaj; mesaj ≤ 800 karakter; son 12 tur gönderilir; yanıt
≤ 700 token; 25 sn zaman aşımı. Google 429/503 → "busy", 400/403/404 (anahtar/model sorunu) → "not ready".

## Dikkat
- **Ücretsiz katmanda Google, gönderilen mesajları ürünlerini geliştirmek için kullanabilir ve insanlar okuyabilir.**
  Bu yüzden pencere kişisel bilgi yazılmamasını söyler ve panel kişisel içerik göndermez. **Gizlilik sayfası**
  (`/privacy`, "Cookies and third parties") bunu söylüyor (2026-10-22, 5 dil): ne gider, Google'ın kullanabileceği,
  konuşmaların bizde saklanmadığı.
- Ücretsiz katman kotası küçük ve Google tarafından değişebiliyor; gerçek sınır AI Studio'daki kota sayfasında.
- Denenmedi: gerçek Gemini yanıtı (anahtar yok), gerçek telefon. Denendi: birim testleri, `next build` (JS bütçeleri
  içinde), 360/390/1280 px'te satış sitesi ve panel ekranları (hazır değil + demo modu), konsol hatası yok.
