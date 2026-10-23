# Etsy dükkânı gizlilik politikası — yapıştırmaya hazır metin (2026-10-20; güncelleme 2026-10-23, G961)

Etsy → Shop Manager → Settings → Policy settings → **Privacy policy** alanına aşağıdaki İngilizce metin girilir.
docs/20 §7.2'deki "Privacy yayınlanmadı" eksiğini kapatır. Kaynak: sitenin `/privacy` sayfası
(`platform/components/marketing/pages/PrivacyPage.tsx`, G154 kod okumasıyla yazıldı, G961'de güncellendi), `/kvkk`
(`platform/lib/marketing/legal.ts`) ve `platform/lib/marketing/config.ts` politikaları (K48). Sistemin bugün yapmadığı
hiçbir şey vaat edilmez.

**2026-10-23 değişiklikleri (G961, sahip kararları):** destek e-postası `bkestudio01@gmail.com`; e-postalar dükkânın
Gmail hesabından gider ve Etsy satış e-postaları siparişi doğrulamak için bu kutudan okunur (G192); canlı yardım
sohbeti Google Gemini (ücretsiz katman: Google mesajları kullanabilir, insanlar okuyabilir; docs/35); MyMemory çevirisi;
"her siparişe bir site" yerine "satın alınan her tasarıma bir site"; kullanım koşulları (`/terms`) ve KVKK aydınlatma
metni (`/kvkk`) linkleri. "Transfers … rely on the provider's standard contractual clauses" cümlesi **çıkarıldı**:
Gmail (kişisel Google hesabı) için böyle bir sözleşme yok, diğerleri için de imzalanmış/bildirilmiş bir mekanizma
belgelenmedi (açık madde: docs/39 §4).

**Kullanıcıdan gelecek iki alan (uydurulmaz):**
- `[DATA CONTROLLER NAME]` — satıcının (dükkân sahibinin) yasal adı ya da şirket unvanı.
- `[POSTAL ADDRESS]` — GDPR için iletişim adresi (şehir + ülke yeterli değil; posta adresi).

Bu iki alan yalnız bu belgede (Etsy'ye yapıştırılacak metin) köşeli parantezle durur. Sitede köşeli parantez
gösterilmez: `config.ts` → `legal.controllerName` / `legal.postalAddress` `null` iken `/terms`, `/privacy` ve `/kvkk`
"e-postayla istenirse bildirilir" der; değer girilince sayfalar onu basar (docs/39).

Hukuki danışmanlık değildir; mümkünse bir uzmana okutulmalı (docs/14 §6.10 notu, docs/39 §4).

Girildikten sonra: `platform/lib/marketing/config.ts` → `verified.privacyText: true` (sitenin `/privacy` sayfası zaten
yayında; bu bayrak "gizlilik metni taslak değil" demektir).

---

```
PRIVACY POLICY — BKE Studio (Etsy shop STUDIOBKE)

Who is responsible for your data
[DATA CONTROLLER NAME], [POSTAL ADDRESS], trading as BKE Studio on Etsy, is the data controller for the information described below. Contact: bkestudio01@gmail.com or Etsy Messages. Our full notice is at https://bkestudio.com/privacy; our notice under Turkey's data protection law (KVKK) is at https://bkestudio.com/kvkk and our terms of use at https://bkestudio.com/terms.

What we collect and why
• From your Etsy order: your name, email address, the order number and the items bought, as Etsy shares them with sellers, including in the sale emails Etsy sends to our shop's Gmail inbox. We use them to deliver your order, to confirm one website per design bought and to answer your messages. Payment is handled by Etsy; we never see your card details.
• When you start your wedding website: your email address and Etsy order number, and the details you enter in your editor (names, date, time, venue, schedule, story, questions and answers, links, the photos and music you upload). We use them to create, host and show your website.
• For each device where you open your editor: a one-way hash of its key, the date it was added and a short label such as "iPhone · Safari", so you can see your devices and sign them out.
• Your guests' replies (RSVP): name, attending or not, number of guests, the names of the others in the reply, an optional email address and message, and answers to your questions. They are shown only to you in your private editor.
• If you connect Google Sheets: an encrypted access token from Google, used only to add your guests' replies to the spreadsheet it made in your own Google Drive.
• If you use the live help chat on our website or in the editor: the messages you type and the page you are on (and, in the editor, your website's design, whether it is published and how many name and date changes are left; never names, guests or replies).

Legal basis (GDPR)
We process your data to perform our contract with you (Art. 6(1)(b)), to meet legal obligations such as keeping sales records (Art. 6(1)(c)) and for our legitimate interest in preventing spam, fake orders and abuse and in answering chat questions (Art. 6(1)(f)). Guest replies are processed on your behalf, for the purpose you set: collecting replies to your wedding invitation.

Where it is kept and who can see it
Websites are hosted by Vercel Inc. in the United States; content, replies, photos and music are kept in a private Vercel storage area. Our shop's email runs on Google's Gmail: it sends your edit link and sign-in links (when email sending is on) and receives Etsy's sale emails, which we read only to confirm orders. The live help chat is an AI assistant run by Google Gemini: on the free Gemini service Google may use the messages to improve its products and people at Google may read them, so please do not type personal details; we do not keep the conversations. We use these providers under their standard terms; Vercel and Google process data in the United States and other countries outside Turkey. We can access the data to give support and to keep the service running. We do not sell your data and we do not share it with anyone else, except when the law requires it. Wedding website pages load fonts from Google Fonts; a venue map loads from Google Maps only when a guest taps Show map. The editor's automatic translation uses your browser's own translator when it has one, otherwise your texts are sent from your browser to the MyMemory translation service (translated.net); the editor says so next to the button.

How long we keep it
Your website stays online until 12 months after the wedding date. After that "Online until" date we keep it archived for 12 months, then we delete it with its photos and replies. Etsy order records and sale emails are kept as long as Etsy and tax law require.

Your rights
You can see, change or remove your content in your editor at any time, take your website offline, sign out other devices and disconnect Google Sheets. You have the right to access, correct, delete, restrict or object to the processing of your data and to receive a copy of it. Message us on Etsy with your order number, or write to bkestudio01@gmail.com from the email you used when you started your website: we confirm it is you, then we delete your website, its photos and your guests' replies within 30 days. Guests can ask you, or us, to correct or delete their reply. You can also complain to your local data protection authority; in Turkey, see https://bkestudio.com/kvkk for your rights under KVKK and how to apply.

Changes
When this policy changes, we update it here and on https://bkestudio.com/privacy.
```
