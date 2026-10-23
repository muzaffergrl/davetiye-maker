// G961 (decision 7, 2026-10-23): facts and texts of the legal pages — /terms (TermsPage.tsx, translated with the
// 'market' dictionary like every page) and the KVKK notice /kvkk (this file: the Turkish original and its English
// version as Markdown, rendered by KvkkPage.tsx with <Prose>).
//
// Written only from decided facts (docs/01: K25 no legal identity, K33/K37 support + 24 h, K36 no returns, K46 order
// number + email, K48 retention/extension/deletion, owner 2026-10-23: support email, Gmail sending + order-mail
// reading, Google Sheets) and from what the code does (lib/site/access.ts, lib/panel/rights.ts, lib/mailbox,
// lib/support, lib/i18n/auto-translate.ts, lib/google). Open points (legal name, postal address, governing law,
// VERBİS, the art. 9 transfer mechanism …) are listed in docs/39_KULLANIM_KOSULLARI_KVKK.md — never as a bracket
// placeholder on a public page: while config `legal` is null the pages say the name and address are given on request.
// Not legal advice (docs/39).

import { ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS } from '../panel/rights.ts';
import { MARKETING, type MarketingConfig } from './config.ts';
import { enT, type Lang, type T } from './i18n.ts';
import { real, realEtsyUrl } from './placeholders.ts';

/** The Etsy shop's own name from its URL ("STUDIOBKE" for https://www.etsy.com/shop/STUDIOBKE), or null. */
export function shopHandle(cfg: MarketingConfig = MARKETING): string | null {
  const url = realEtsyUrl(cfg.etsy.shopUrl);
  if (!url) return null;
  const m = /\/shop\/([A-Za-z0-9]+)/.exec(new URL(url).pathname);
  return m ? m[1] : null;
}

/** The decided legal name and postal address of the seller / data controller (null while not decided, K25). */
export function controllerIdentity(cfg: MarketingConfig = MARKETING): { name: string | null; address: string | null } {
  return { name: real(cfg.legal.controllerName), address: real(cfg.legal.postalAddress) };
}

/** True when both are decided (then the pages print them instead of "on request by email"). */
export function controllerKnown(cfg: MarketingConfig = MARKETING): boolean {
  const c = controllerIdentity(cfg);
  return Boolean(c.name && c.address);
}

/** Services the buyer can really buy now (owner 2026-10-23: listings that stay Etsy drafts are offered nowhere). */
export function servicesOnSale(cfg: MarketingConfig = MARKETING): MarketingConfig['services'] {
  return (cfg.services ?? []).filter((sv) => sv.onSale === true);
}

/** "Online until": at most this many months after the first publish (lib/panel/rights.ts, G060). */
export const ONLINE_CAP_MONTHS = ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS;

// ------------------------------------------------------------------------------------------------ KVKK notice

/** The KVKK notice exists in Turkish (the original) and English; the other site languages show the English text. */
export type KvkkLang = 'tr' | 'en';

export function kvkkLang(lang: Lang): KvkkLang {
  return lang === 'tr' ? 'tr' : 'en';
}

/**
 * The KVKK notice (KVKK art. 10; Aydınlatma Yükümlülüğü Tebliği; rights art. 11; application: Veri Sorumlusuna Başvuru
 * Usul ve Esasları Hakkında Tebliğ; complaint art. 13–14) as Markdown (lib/marketing/markdown.ts subset). `t` translates
 * the config's policy sentences into the notice language (TR: the market dictionary; EN: identity).
 */
export function kvkkMarkdown(lang: KvkkLang, cfg: MarketingConfig = MARKETING, t: T = enT): string {
  return lang === 'tr' ? kvkkTr(cfg, t) : kvkkEn(cfg, t);
}

function facts(cfg: MarketingConfig) {
  const email = cfg.support.email;
  const shopUrl = realEtsyUrl(cfg.etsy.shopUrl);
  return {
    brand: cfg.brand.name,
    shop: shopHandle(cfg) ?? cfg.etsy.shopName,
    shopLink: shopUrl ? `[${shopHandle(cfg) ?? cfg.etsy.shopName}](${shopUrl})` : (shopHandle(cfg) ?? cfg.etsy.shopName),
    mail: real(email) ? `[${email}](mailto:${email})` : email,
    months: cfg.hosting.monthsAfterWedding,
    cap: ONLINE_CAP_MONTHS,
    who: controllerIdentity(cfg),
  };
}

function kvkkTr(cfg: MarketingConfig, t: T): string {
  const f = facts(cfg);
  const identity = controllerKnown(cfg)
    ? `Veri sorumlusunun adı (unvanı): **${f.who.name}**. Posta adresi: ${f.who.address}.`
    : `Veri sorumlusunun açık adı (unvanı) ve posta adresi, ${f.mail} adresine yazmanız hâlinde size bildirilir.`;
  const cap = f.cap ? ` (en geç ilk yayından ${f.cap} ay sonrasına kadar)` : '';
  return `
Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) m. 10 ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca hazırlanmıştır. Düğün web sitesi tasarımlarımızı satın alan çiftlerin, onların sitelerinde yanıt veren davetlilerin ve sitelerimizi ziyaret edenlerin kişisel verilerini nasıl işlediğimizi açıklar.

## 1. Veri sorumlusu

Veri sorumlusu, Etsy'deki ${f.shopLink} dükkânında düğün web sitesi tasarımları satan **${f.brand}**'dur. ${identity}

İletişim: ${f.mail} veya Etsy mesajları.

## 2. İşlediğimiz kişisel veriler

### Tasarım satın alan çiftler

- **Kimlik ve iletişim:** Etsy'nin satıcıyla paylaştığı ad ve e-posta adresi; sitenizi başlatırken girdiğiniz e-posta adresi.
- **Sipariş (müşteri işlem):** Etsy sipariş numarası, satın alınan tasarım ve Etsy'nin dükkânımızın e-posta kutusuna gönderdiği satış e-postalarındaki sipariş bilgileri.
- **Site içeriği:** panelde girdiğiniz isimler, düğün tarihi ve saati, mekân ve adres, program, hikâye, sorular ve cevaplar, bağlantılar; yüklediğiniz fotoğraflar ve müzik dosyası.
- **İşlem güvenliği:** düzenleyicinizi açtığınız her cihaz için anahtarın tek yönlü özeti (hash), eklenme tarihi ve “iPhone · Safari” gibi kısa bir etiket; düzenleme bağlantınızın anahtarının tek yönlü özeti; Google Sheets bağlarsanız Google'ın verdiği şifrelenmiş erişim belirteci.
- **Destek yazışmaları:** Etsy mesajları ve e-postayla bize yazdıklarınız.

### Davetliler

- **Yanıt formu:** ad, katılım durumu, kişi sayısı, yanıttaki diğer kişilerin adları, isteğe bağlı e-posta adresi ve mesaj, çiftin sorularına verilen cevaplar.
- **Misafir şifresi:** çift sitesine şifre koyduysa, doğru şifrenin girildiğini 90 gün hatırlayan bir çerez.

Davetli yanıtlarında hangi soruların sorulacağını ve yanıtların ne için kullanılacağını çift belirler; biz yanıtları çift adına saklar ve yalnızca çifte gösteririz. Özel nitelikli kişisel veri (ör. sağlık bilgisi) toplamayı amaçlamıyoruz: çiftin bir sorusuna böyle bir bilgi yazmak zorunda değilsiniz.

### Ziyaretçiler

- **Teknik kayıtlar:** barındırma sağlayıcımızın tuttuğu standart istek kayıtları (IP adresi, tarayıcı bilgisi, zaman). İstenmeyen istekleri (spam) önlemek için IP adresinin kendisi değil, tek yönlü özeti ile en çok 24 saatlik bir sayaç kullanılır.
- **Çerezler ve tarayıcı depolaması:** düzenleyicide seçtiğiniz dil, henüz kaydedilmemiş değişiklikler ve bu cihazda açtığınız düzenleyiciler tarayıcınızda tutulur; satış sitemiz çerez kullanmaz. Ayrıntılar gizlilik bildirimindedir.
- **Canlı yardım sohbeti:** yazdığınız mesajlar, bulunduğunuz sayfanın adresi ve düzenleyiciden soruyorsanız sitenizle ilgili birkaç bilgi (tasarım, yayında olup olmadığı, kalan isim ve tarih değişikliği hakkı). İsimler, davetliler ve yanıtlar sohbete gönderilmez.

## 3. İşleme amaçları ve hukuki sebepler

- **Satın aldığınız hizmetin sunulması:** düğün sitenizi oluşturmak, barındırmak ve yayımlamak; sipariş numarası ve e-posta ile düzenleyicinize erişim; düzenleme ve giriş bağlantılarını e-postayla göndermek; isim ve tarih değişikliği hakları ile “Yayında kalacağı tarih”; destek. Hukuki sebep: sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (KVKK m. 5/2-c).
- **Siparişin doğrulanması:** sipariş numarasının dükkânımızın Etsy siparişlerinde ve Etsy'nin gönderdiği satış e-postalarında aranması; her siparişte satın alınan tasarım sayısı kadar site açılması. Hukuki sebep: m. 5/2-c ve sahte sipariş numarasıyla site açılmasını önlemedeki meşru menfaatimiz (m. 5/2-f).
- **Davetli yanıtlarının toplanması:** yanıtların saklanması, çifte gösterilmesi ve çift isterse çiftin kendi Google Drive'ındaki tabloya yazılması. Hukuki sebep: çiftle aramızdaki sözleşmenin ifası için, davetlilerin temel hak ve özgürlüklerine zarar vermeyen meşru menfaatimiz (m. 5/2-f).
- **Güvenlik ve kötüye kullanımın önlenmesi:** spam sınırları, cihaz anahtarlarının özetleri, teknik kayıtlar. Hukuki sebep: meşru menfaat (m. 5/2-f).
- **Canlı yardım sohbeti:** sorunuzu yanıtlamak. Sohbeti kullanmak isteğe bağlıdır. Hukuki sebep: meşru menfaat (m. 5/2-f); alıcılar için ayrıca m. 5/2-c.
- **Yasal yükümlülükler:** satış kayıtlarının tutulması, yetkili kurumların talepleri ve bu metindeki başvuruların yanıtlanması. Hukuki sebep: hukuki yükümlülüğümüzün yerine getirilmesi (m. 5/2-ç).
- **Hakların korunması:** olası bir uyuşmazlıkta. Hukuki sebep: bir hakkın tesisi, kullanılması veya korunması (m. 5/2-e).

## 4. Toplama yöntemi

Kişisel verileri elektronik ortamda; Etsy'den (sipariş bilgileri ve Etsy mesajları), Etsy'nin dükkânımızın e-posta kutusuna gönderdiği satış e-postalarından, başlangıç formundan ve düzenleme panelinden, düğün sitelerindeki yanıt formundan, e-posta yazışmalarından ve canlı yardım sohbetinden, tamamen veya kısmen otomatik yollarla topluyoruz.

## 5. Aktarım ve yurt dışına aktarım

Kişisel verileri satmıyoruz. Hizmeti sunmak için aşağıdaki sağlayıcıları onların standart hizmet koşullarıyla kullanıyoruz. Sunucuları Türkiye dışında olduğundan bu kullanım, KVKK m. 9 kapsamında yurt dışına aktarımdır:

- **Vercel Inc. (ABD):** sitelerin, düzenleyicinin ve satış sitesinin barındırılması; içerik, fotoğraf, müzik ve yanıtların saklandığı özel depolama alanı; teknik kayıtlar.
- **Google LLC (ABD):** dükkânımızın Gmail hesabı (düzenleme ve giriş bağlantısı e-postalarının gönderilmesi, Etsy satış e-postalarının alınması ve siparişi doğrulamak için okunması); canlı yardım sohbetinin yapay zekâ asistanı Gemini; Google Sheets (çift bağlarsa yanıtlar çiftin kendi Google Drive'ındaki tabloya yazılır); düğün sitelerindeki yazı tipleri (Google Fonts) ve bir davetli “Haritayı göster”e dokunursa Google Haritalar.
- **translated.net (MyMemory çeviri hizmeti, İtalya):** düzenleyicide “Otomatik çevir” kullandığınızda tarayıcınızın kendi çevirmeni yoksa, çevrilecek metinler tarayıcınızdan doğrudan bu hizmete gönderilir.
- **Etsy:** satın alma, ödeme ve Etsy mesajları Etsy üzerinden yürür; Etsy bu veriler için kendi gizlilik politikasına göre ayrıca veri sorumlusudur. Siparişi doğrulamak için sipariş numarasını Etsy'de sorgulayabiliriz.

Gemini'nin ücretsiz hizmetinde Google, gönderilen mesajları ürünlerini geliştirmek için kullanabilir ve Google'da çalışan kişiler bu mesajları okuyabilir. Bu nedenle sohbete kişisel bilgi yazmayın. Sohbetleri biz saklamayız.

Kanunen yetkili kamu kurum ve kuruluşlarına, yalnızca talep hâlinde ve mevzuatın gerektirdiği ölçüde aktarım yapılabilir (m. 8, m. 5/2-ç).

## 6. Saklama süreleri

- **Site, fotoğraflar, müzik ve davetli yanıtları:** siteniz düğün tarihinizden ${f.months} ay sonrasına kadar yayında kalır${cap}. ${t(cfg.policies.retention)}
- **Silme talebi:** ${t(cfg.policies.deletion)}
- **Cihaz kayıtları ve Google Sheets bağlantısı:** siteyle birlikte; cihazın oturumunu kapattığınızda ya da bağlantıyı kestiğinizde daha önce silinir.
- **Sipariş kayıtları (Etsy siparişi ve satış e-postaları):** satış kaydı olarak, Etsy kuralları ve vergi mevzuatının gerektirdiği süre boyunca.
- **Destek yazışmaları:** Etsy mesajları Etsy'de, e-postalar dükkânımızın e-posta kutusunda kalır; silinmelerini ${f.mail} adresinden isteyebilirsiniz.
- **Canlı yardım sohbeti:** biz saklamayız; tarayıcınız konuşmayı yalnızca sekmeyi kapatana kadar tutar.
- **Teknik kayıtlar:** barındırma sağlayıcısının kendi saklama sürelerine göre.

## 7. KVKK m. 11 kapsamındaki haklarınız

Bize başvurarak:

- kişisel verilerinizin işlenip işlenmediğini öğrenme,
- işlenmişse buna ilişkin bilgi talep etme,
- işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,
- yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,
- eksik veya yanlış işlenmişse düzeltilmesini isteme,
- KVKK m. 7'deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme,
- düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
- işlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi sonucunda aleyhinize bir sonucun ortaya çıkmasına itiraz etme,
- kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme

haklarına sahipsiniz. Ayrıca panelinizde içeriğinizi istediğiniz zaman değiştirebilir veya kaldırabilir, sitenizi yayından kaldırabilir, diğer cihazların oturumunu kapatabilir ve Google Sheets bağlantısını kesebilirsiniz. Davetliyseniz yanıtınızın düzeltilmesini veya silinmesini doğrudan çiftten de isteyebilirsiniz.

## 8. Başvuru yolu

Başvurunuzu Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ'e uygun olarak, sitenizi başlatırken kullandığınız ve sistemimizde kayıtlı e-posta adresinizden ${f.mail} adresine e-postayla ya da güvenli elektronik imza veya mobil imzayla imzalanmış olarak iletebilirsiniz. Yazılı başvuru için posta adresimizi e-postayla isteyebilirsiniz.

Başvuruda adınız ve soyadınız, yazılı başvuruda imzanız, Türkiye Cumhuriyeti vatandaşıysanız T.C. kimlik numaranız, değilseniz uyruğunuz ile pasaport numaranız veya varsa kimlik numaranız, tebligata esas adresiniz, varsa bildirime esas e-posta adresiniz ve telefon numaranız ile talebinizin konusu bulunmalıdır. Kimliğinizi doğrulamadan veri silmeyiz veya paylaşmayız.

Başvurunuzu niteliğine göre en kısa sürede ve en geç 30 gün içinde ücretsiz olarak sonuçlandırırız; işlem ayrıca bir maliyet gerektirirse Kişisel Verileri Koruma Kurulu'nca belirlenen tarifedeki ücret alınabilir.

Başvurunuz reddedilir, verdiğimiz cevabı yetersiz bulursanız veya süresinde cevap verilmezse, cevabı öğrendiğiniz tarihten itibaren 30 gün ve her hâlde başvuru tarihinden itibaren 60 gün içinde Kişisel Verileri Koruma Kurulu'na şikâyette bulunabilirsiniz (KVKK m. 14).

## 9. Diğer metinler ve değişiklikler

Ayrıntılı açıklama [gizlilik bildirimimizde](/privacy), satın alma ve kullanım kuralları [kullanım koşullarımızda](/terms) yer alır. Bu metin değiştiğinde üstteki tarih de değişir.
`.trim();
}

function kvkkEn(cfg: MarketingConfig, t: T): string {
  const f = facts(cfg);
  const identity = controllerKnown(cfg)
    ? `Legal name of the data controller: **${f.who.name}**. Postal address: ${f.who.address}.`
    : `The full legal name and postal address of the data controller are provided on request by email to ${f.mail}.`;
  const cap = f.cap ? ` (and at most ${f.cap} months after you first publish it)` : '';
  return `
This notice is given under Article 10 of Turkey's Personal Data Protection Law No. 6698 (“KVKK”) and the Communiqué on the Procedures and Principles of the Obligation to Inform. It explains how we process the personal data of couples who buy our wedding website designs, of guests who reply on their websites and of visitors to our websites.

## 1. Data controller

The data controller is **${f.brand}**, which sells wedding website designs on Etsy in the shop ${f.shopLink}. ${identity}

Contact: ${f.mail} or Etsy messages.

## 2. Personal data we process

### Couples who buy a design

- **Identity and contact:** the name and email address Etsy shares with sellers; the email address you enter when you start your website.
- **Order:** your Etsy order number, the design bought and the order details in the sale emails Etsy sends to our shop's mailbox.
- **Website content:** the names, wedding date and time, venue and address, schedule, story, questions and answers and links you enter in your editor; the photos and the music file you upload.
- **Security:** for each device where you open your editor, a one-way hash of its key, the date it was added and a short label such as “iPhone · Safari”; a one-way hash of your edit link's key; if you connect Google Sheets, the encrypted access token Google gives us.
- **Support messages:** what you write to us on Etsy and by email.

### Guests

- **Reply form:** name, attending or not, number of guests, the names of the others in the reply, an optional email address and message, and answers to the couple's questions.
- **Guest password:** if the couple sets one, a cookie that remembers for 90 days that the right password was entered.

The couple decides what guests are asked and what the replies are for; we keep the replies for the couple and show them only to the couple. We do not aim to collect special categories of data (such as health information): you do not have to write such information in answer to a couple's question.

### Visitors

- **Technical logs:** the standard request logs of our hosting provider (IP address, browser details, time). To stop spam, we do not keep the IP address itself; a one-way hash of it counts requests for at most 24 hours.
- **Cookies and browser storage:** the editor language you choose, changes not saved yet and the editors you opened on this device are kept in your browser; our sales website sets no cookies. Details are in the privacy notice.
- **Live help chat:** the messages you type, the address of the page you are on and, when you ask from your editor, a few facts about your website (its design, whether it is published, how many name and date changes are left). Names, guests and replies are never sent to the chat.

## 3. Purposes and legal bases

- **Providing what you bought:** creating, hosting and publishing your website; opening your editor with your order number and email; emailing your edit and sign-in links; name and date change rights and your “Online until” date; support. Legal basis: necessary for the conclusion or performance of a contract (KVKK Art. 5(2)(c)).
- **Confirming orders:** looking up the order number among our Etsy shop's orders and in the sale emails Etsy sends us; allowing as many websites as designs bought in an order. Legal basis: Art. 5(2)(c) and our legitimate interest in stopping websites started with fake order numbers (Art. 5(2)(f)).
- **Collecting guest replies:** storing them, showing them to the couple and, if the couple wants, writing them to a spreadsheet in the couple's own Google Drive. Legal basis: our legitimate interest in performing our contract with the couple, without harming the guests' fundamental rights and freedoms (Art. 5(2)(f)).
- **Security and preventing abuse:** spam limits, device key hashes, technical logs. Legal basis: legitimate interest (Art. 5(2)(f)).
- **Live help chat:** answering your question. Using the chat is optional. Legal basis: legitimate interest (Art. 5(2)(f)); for buyers also Art. 5(2)(c).
- **Legal obligations:** keeping sales records, requests from authorities and answering applications under this notice. Legal basis: compliance with a legal obligation (Art. 5(2)(ç)).
- **Protecting rights:** in a possible dispute. Legal basis: establishing, exercising or protecting a right (Art. 5(2)(e)).

## 4. How we collect data

We collect personal data electronically, by fully or partly automated means: from Etsy (order details and Etsy messages), from the sale emails Etsy sends to our shop's mailbox, from the start form and the editor, from the reply form on wedding websites, from emails and from the live help chat.

## 5. Transfers, including abroad

We do not sell personal data. To provide the service we use the providers below under their standard terms of service. Their servers are outside Turkey, so this use is a transfer abroad under Art. 9 KVKK:

- **Vercel Inc. (USA):** hosting of the websites, the editor and our sales website; the private storage that holds content, photos, music and replies; technical logs.
- **Google LLC (USA):** our shop's Gmail account (sending edit and sign-in link emails, receiving Etsy's sale emails and reading them to confirm orders); Gemini, the AI assistant of the live help chat; Google Sheets (if the couple connects it, replies are written to a spreadsheet in the couple's own Google Drive); the fonts of wedding websites (Google Fonts) and Google Maps when a guest taps “Show map”.
- **translated.net (MyMemory translation service, Italy):** when you use “Translate automatically” in the editor and your browser has no translator of its own, the texts are sent from your browser directly to this service.
- **Etsy:** buying, payment and Etsy messages run on Etsy, which is a separate data controller for them under its own privacy policy. To confirm an order we may look up its number on Etsy.

On the free Gemini service, Google may use the messages sent to improve its products, and people at Google may read them. Please do not type personal details in the chat. We do not keep the conversations.

Data may be disclosed to public authorities only on their lawful request and as far as the law requires (Art. 8, Art. 5(2)(ç)).

## 6. How long we keep it

- **Website, photos, music and guest replies:** your website stays online until ${f.months} months after your wedding date${cap}. ${t(cfg.policies.retention)}
- **Deletion on request:** ${t(cfg.policies.deletion)}
- **Device records and the Google Sheets connection:** with the website; earlier when you sign a device out or disconnect.
- **Order records (Etsy orders and sale emails):** as sales records, for as long as Etsy's rules and tax law require.
- **Support messages:** Etsy messages stay on Etsy, emails in our shop's mailbox; you can ask us at ${f.mail} to delete them.
- **Live help chat:** we do not keep it; your browser keeps the conversation only until you close the tab.
- **Technical logs:** for the hosting provider's own retention periods.

## 7. Your rights under Art. 11 KVKK

You can apply to us to:

- learn whether your personal data is processed,
- request information about it if it is,
- learn the purpose of the processing and whether the data is used accordingly,
- know the third parties in Turkey or abroad to whom it is transferred,
- have it corrected if it is incomplete or wrong,
- have it erased or destroyed under the conditions of Art. 7 KVKK,
- have the third parties it was transferred to told about a correction, erasure or destruction,
- object to a result against you that comes only from automated analysis of your data,
- claim compensation if you suffer damage because of unlawful processing.

You can also change or remove your content in your editor at any time, take your website offline, sign out other devices and disconnect Google Sheets. Guests can also ask the couple directly to correct or delete their reply.

## 8. How to apply

Under the Communiqué on the Procedures and Principles of Application to the Data Controller, send your application by email to ${f.mail} from the email address you used when you started your website (the address registered with us), or signed with a secure electronic or mobile signature. For a written application by post, ask us for our postal address by email.

Your application must give your name and surname, your signature for a written application, your Turkish ID number if you are a Turkish citizen or otherwise your nationality and passport number (or ID number, if any), your address for notifications, your email address and phone number if any, and what you are asking for. We do not delete or share data before we have confirmed it is you.

We answer as soon as possible and at the latest within 30 days, free of charge; if the request causes an additional cost, the fee in the tariff set by the Personal Data Protection Board may be charged.

If your application is refused, you find our answer insufficient or we do not answer in time, you can complain to the Personal Data Protection Board (Kişisel Verileri Koruma Kurulu) within 30 days of learning our answer, and in any case within 60 days of your application (Art. 14 KVKK).

## 9. Other notices and changes

More detail is in our [privacy notice](/privacy); the rules for buying and using a design are in our [terms of use](/terms). When this notice changes, the date at the top changes too.
`.trim();
}
