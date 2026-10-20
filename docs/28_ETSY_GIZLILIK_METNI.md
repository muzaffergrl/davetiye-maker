# Etsy dükkânı gizlilik politikası — yapıştırmaya hazır metin (2026-10-20)

Etsy → Shop Manager → Settings → Policy settings → **Privacy policy** alanına aşağıdaki İngilizce metin girilir.
docs/20 §7.2'deki "Privacy yayınlanmadı" eksiğini kapatır. Kaynak: sitenin `/privacy` sayfası
(`platform/components/marketing/pages/PrivacyPage.tsx`, G154 kod okumasıyla yazıldı) ve `platform/lib/marketing/config.ts`
politikaları (K48). Sistemin bugün yapmadığı hiçbir şey vaat edilmez.

**Kullanıcıdan gelecek iki alan (uydurulmaz):**
- `[DATA CONTROLLER NAME]` — satıcının (dükkân sahibinin) yasal adı ya da şirket unvanı.
- `[POSTAL ADDRESS]` — GDPR için iletişim adresi (şehir + ülke yeterli değil; posta adresi).

Hukuki danışmanlık değildir; mümkünse bir uzmana okutulmalı (docs/14 §6.10 notu).

Girildikten sonra: `platform/lib/marketing/config.ts` → `verified.privacyText: true` (sitenin `/privacy` sayfası zaten
yayında; bu bayrak "gizlilik metni taslak değil" demektir).

---

```
PRIVACY POLICY — BKE Studio (Etsy shop STUDIOBKE)

Who is responsible for your data
[DATA CONTROLLER NAME], [POSTAL ADDRESS], trading as BKE Studio on Etsy, is the data controller for the information described below. Contact: bkestudio@gmail.com or Etsy Messages. Our full notice is at https://bkestudio.com/privacy.

What we collect and why
• From your Etsy order: your name, email address, the order number and the items bought, as Etsy shares them with sellers. We use them to deliver your order, to confirm one website per order and to answer your messages. Payment is handled by Etsy; we never see your card details.
• When you start your wedding website: your email address and Etsy order number, and the details you enter in your editor (names, date, time, venue, schedule, story, questions and answers, links, the photos and music you upload). We use them to create, host and show your website.
• For each device where you open your editor: a one-way hash of its key, the date it was added and a short label such as "iPhone · Safari", so you can see your devices and sign them out.
• Your guests' replies (RSVP): name, attending or not, number of guests, the names of the others in the reply, an optional email address and message, and answers to your questions. They are shown only to you in your private editor.
• If you connect Google Sheets: an encrypted access token from Google, used only to add your guests' replies to the spreadsheet it made in your own Google Drive.

Legal basis (GDPR)
We process your data to perform our contract with you (Art. 6(1)(b)), to meet legal obligations such as tax records (Art. 6(1)(c)) and for our legitimate interest in preventing spam and abuse (Art. 6(1)(f)). Guest replies are processed on your behalf, for the purpose you set: collecting replies to your wedding invitation.

Where it is kept and who can see it
Websites are hosted by Vercel Inc. in the United States; content, replies, photos and music are kept in a private Vercel storage area. Vercel acts as our processor. Transfers outside the EU/UK rely on the provider's standard contractual clauses. We can access the data to give support and to keep the service running. We do not sell your data and we do not share it with anyone else, except when the law requires it. When email sending is on, emails (your edit link, sign-in links and, only if you turn it on, guest reply notices) go through our email provider. Wedding website pages load fonts from Google Fonts; a venue map loads from Google Maps only when a guest taps Show map. The editor's automatic translation uses your browser's own translator when it has one, otherwise your texts are sent to the MyMemory translation service (the editor says so next to the button).

How long we keep it
Your website stays online until 12 months after the wedding date. After that "Online until" date we keep it archived for 12 months, then we delete it with its photos and replies. Etsy order records are kept as long as Etsy and tax law require.

Your rights
You can see, change or remove your content in your editor at any time, take your website offline, sign out other devices and disconnect Google Sheets. You have the right to access, correct, delete, restrict or object to the processing of your data and to receive a copy of it. Message us on Etsy with your order number, or write to bkestudio@gmail.com from the email you used when you started your website: we confirm it is you, then we delete your website, its photos and your guests' replies within 30 days. Guests can ask you, or us, to correct or delete their reply. You can also complain to your local data protection authority.

Changes
When this policy changes, we update it here and on https://bkestudio.com/privacy.
```
