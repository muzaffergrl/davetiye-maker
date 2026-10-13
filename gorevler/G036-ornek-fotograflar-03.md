---
id: G036
baslik: Tasarım 03 — örnek çift ve mekân fotoğrafları (Paket 2, website demosu)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-1
oncelik: 1
bagimli: []
yazar: [collections/03_Blush_Garden_Rose/assets/gpt/photos/]
---

## Amaç
Website demosundaki (G035) fotoğraf alanları boş kalmasın: kurgusal çiftin 4 fotoğrafı + mekân. Alıcı
kendi fotoğraflarını koyar; bunlar demo ve Etsy ilanı içindir.

## Girdiler
- `collections/03_Blush_Garden_Rose/assets/gpt/GPT_PROMPTS.md` → **PAKET 2** (2.1–2.5)
- Stil referansı: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`

## Yapılacaklar
1. Aynı sohbette sırayla üret; aynı çift tutarlı olsun.
2. Konu ortadaki %70'te, başın üstünde boşluk (kemerli çerçeve kırpar).

## Bitti sayılması için
- [x] 5 dosya doğru yolda; aynı çift; eller düzgün; yazı yok

## Sonuç
2026-10-13 · gpt-gorsel-1: PAKET 2'nin 2.1–2.5 görselleri aynı sohbette,
sırayla imagegen ile üretildi. İngilizce ana prompt'lar aynen korundu; ortak
renk, merkezde %70 güvenli alan, baş üstü boşluk, doğal eller ve yazısızlık
talimatları eklendi. Yalnız görevde belirtilen `photos/` klasörüne teslim yapıldı.

**Dosyalar** — tam klasör: `collections/03_Blush_Garden_Rose/assets/gpt/photos/`

| Dosya | Gerçek format / ölçü | İçerik |
|---|---|---|
| `hero_portrait.jpg` | RGB JPEG · 1024×1536 | Gül kemerinin altında blush şifon elbiseli kadın ve kum beji takım elbiseli erkek; ana kimlik referansı |
| `story_1.jpg` | RGB JPEG · 1024×1536 | Aynı çift bahçe avlusunda, iki sade fincan ve pembe güllü küçük vazoyla ilk buluşma |
| `story_2.jpg` | RGB JPEG · 1024×1536 | Aynı çift gül bahçesinde; erkek tek diz üzerinde açık yüzük kutusu tutuyor, kadın elini ağzına götürüyor |
| `story_3.jpg` | RGB JPEG · 1024×1536 | Aynı kıyafetler ve ten renkleri; merkezde birbirini tutan eller, nişan yüzüğü ve blush/krem buket; yüz içermez |
| `venue.jpg` | RGB JPEG · 1536×1024 | Kurgusal Viktoryen cam sera, beyaz tören sandalyeleri, merkezde çiçek kemeri; insan içermez |

**Referans ve tutarlılık:** `comps/scene_1_comp.png` ve `comps/scene_4_comp.png`
renk/ışık/çiçek atmosferi olarak kullanıldı; comp yazıları ve kağıt dokusu fotoğraflara
aktarılmadı. Fotoğraflar gerçekçi editorial fotoğraf dilindedir. 2.2 ve 2.3'e ana
portre kimlik referansı verildi; 2.4'e ana portre ve teklif karesi verildi. 2.5'e comp'lar
ve ana portrenin bahçe ışığı verildi. Çift sıfırdan kurgulandı; gerçek kişi, ünlü veya
mevcut bir mekân fotoğrafı kimlik referansı olarak kullanılmadı.

**Kontroller:** Üretim çıktıları tek tek görsel olarak incelendi. İlk üç karede yüzler,
saçlar, ten tonları ve kıyafetler tutarlı; başların üzerinde kemerli kırpma için boşluk
var. Yüzler, el/yüzük eylemi ve mekânın ana kemeri orta alanda. Görünen ellerde belirgin
ek parmak, kopuk eklem veya birleşmiş parmak kusuru görülmedi; tutuşlarda bazı parmaklar
doğal olarak örtüşüyor. Beş görselde yazı, logo veya filigran görülmedi. Mekân karesi
insansız. Dosyalar PIL ile okunup JPEG olarak çözüldü; tam ad, RGB formatı ve ölçü
kontrolü **5/5 geçti**.

Araç PNG ürettiği için istenen `.jpg` dosyaları gerçek JPEG olarak kalite 97 ve
renk alt örneklemesi olmadan kaydedildi. Bu yalnız format dönüşümüdür; kırpma,
yeniden boyutlandırma, rötuş veya kodla görsel çizimi yapılmadı. Kaynak PNG'ler
üretim ortamındaki `generated_images/` klasöründe korundu.

Yeniden üretim gerekmedi; her hedefin ilk üretimi seçildi. Açık üretim blokajı yok.
Gerçek website/Canva çerçevesinde kırpma ve mobil yerleşim testi bu görevde yapılmadı;
G035 montajında ayrıca kontrol edilmeli. Bunlar kurgusal demo fotoğraflarıdır,
bitmiş website veya satışa hazır ürün teslimi değildir.

## Günlük
- 2026-10-13 alindi: gpt-gorsel-1
- 2026-10-13 üretim: PAKET 2.1–2.5 sırayla üretildi; comp stil referansları ve ana portreyle çift tutarlılığı korundu.
- 2026-10-13 bitti, incelemeye gönderildi: 5 JPEG; ad/format/ölçü kontrolleri 5/5 geçti, görsel kontroller Sonuç'ta kaydedildi.
