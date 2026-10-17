// FAQ (docs/14 §6.7): one source for /faq, the home page FAQ, the FAQPage JSON-LD and llms-full.txt. Every answer
// gives the answer in its first sentence, is 40–80 words (tests/marketing-content.test.ts) and links to the page with
// the details. Undecided policies stay as visible placeholders from config ([REFUND POLICY] …).
// Answers use the inline Markdown of markdown.ts ([text](/path), **strong**).

import { MARKETING, type MarketingConfig } from './config.ts';
import { editRightsText, LIMITS } from './facts.ts';
import { enT, type T } from './i18n.ts';
import { inlineText, parseInline } from './markdown.ts';
import { siteHost } from './site.ts';

export interface FaqItem {
  id: string;
  q: string;
  /** Inline Markdown. */
  a: string;
}
export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export function faqGroups(cfg: MarketingConfig = MARKETING, t: T = enT): FaqGroup[] {
  const b = cfg.brand.name;
  const m = cfg.hosting.monthsAfterWedding;
  const rights = editRightsText(cfg, t);
  return [
    {
      id: 'buying',
      title: t('Buying'),
      items: [
        {
          id: 'how-to-buy',
          q: t('How do I buy a design?'),
          a: t('You buy it on Etsy. Pick a design here, open its live demo on your phone, then tap **Buy on Etsy** on the design page. Etsy takes the payment and your download opens as soon as the payment goes through. It holds the link where you start your website. [See how it works](/how-it-works).'),
        },
        {
          id: 'after-buying',
          q: t('What do I get after buying on Etsy?'),
          a: t('You get a short PDF with the link to start your website. There you enter your Etsy order number, your email and your first names, choose your web address, and your draft website is created in the design you bought. Then you edit it in your private panel. [What is included](/pricing#included).'),
        },
        {
          id: 'subscription',
          q: t('Is it a subscription?'),
          a: t('No. You pay once on Etsy and there is nothing to renew, no monthly fee and no per-guest fee. Your website stays online until {months} months after your wedding date. {extension} There are no upgrades to buy inside the panel. [See pricing](/pricing).', { months: m, extension: t(cfg.policies.extension) }),
        },
        {
          // docs/14 §2.2 #18 and docs/15: the most likely objection. Free builders are not belittled, and nothing is
          // claimed about any named competitor (only what we checked about our own product).
          id: 'why-pay',
          q: t('Why pay for a design when free wedding websites exist?'),
          a: t('Free wedding website builders are a good choice for many couples, especially if you want registry and planning tools in the same place. What you pay for here is the design: artwork that opens from a sealed envelope or keepsake into your own pages. You buy it once on Etsy, with no subscription and no account to create, and you edit it from your phone. [Try a live demo](/designs).'),
        },
        {
          id: 'refund',
          q: t('Can I get a refund?'),
          a: t('Our refund policy: {refund}. Because a design is a digital download, Etsy shows its own rules for digital items on the listing. Please try the live demo of a design on your phone before you buy, so you know exactly how it looks and opens. [Contact us](/contact) with any question first.', { refund: t(cfg.policies.refund) }),
        },
        {
          id: 'one-order-one-website',
          q: t('Can I use one purchase for two weddings?'),
          a: t('No. One Etsy order creates one wedding website. The order number is used when you start your website, and the same order cannot start a second one. If you are planning more than one event, buy the design once for each website. [See how it works](/how-it-works).'),
        },
      ],
    },
    {
      id: 'editing',
      title: t('Editing your website'),
      items: [
        {
          id: 'canva-or-app',
          q: t('Do I need Canva or an app?'),
          a: t('No. You edit your website in a private panel that opens in your phone\'s browser, so there is no Canva account and no app to install. The panel is designed for phone screens and also works on a computer. You can preview every page before you publish. [See the features](/features).'),
        },
        {
          id: 'what-can-i-change',
          q: t('What can I change?'),
          a: t('You can change all of your wedding details. That covers names, date, time and time zone, venue and map link, the order of the day (up to {rows} rows), your story, {photos} photos, questions and answers, your RSVP deadline and up to {questions} RSVP questions. You can also switch optional sections on or off and put the design\'s headings in your own words. [Full list](/features#editing).', { rows: LIMITS.scheduleRows, photos: LIMITS.photoSpots, questions: LIMITS.rsvpQuestions }),
        },
        {
          id: 'colors-fonts',
          q: t('Can I change the colors or fonts?'),
          a: t('No. Each design keeps its artwork, colors, fonts and layout, because they are made to work together and to open with that design\'s animation. What you change is the content: your names, details, photos and questions. Try the [live demos](/designs) to choose the design whose look you love.'),
        },
        {
          id: 'names-date-after-publishing',
          q: t('Can we change our names or date after publishing?'),
          a: t('Yes, within a limit. {rightsLong} {rightsRest} Before you publish, you can change everything freely. [See how it works](/how-it-works).', { rightsLong: rights.long, rightsRest: rights.rest }),
        },
        {
          id: 'date-moves',
          q: t('What if our wedding date moves?'),
          a: t('Change the date in your panel. Moving it by up to {days} days is free; a bigger move uses one of your name and date changes. If you have used all of them, [contact us](/contact) at {email} with your Etsy order number and tell us what happened, so we can look at it with you.', { days: cfg.editRights.dateFreeDays, email: cfg.support.email }),
        },
        {
          // G154 (K48): the G146 way back (/my, order number + email on any device), not a support message
          id: 'lost-link',
          q: t('What if I lose my edit link?'),
          a: t('You do not need it to get back in. {lostLink} There is no account or password; the edit link is only a shortcut. Anyone with your order number and email, or with the link, can edit your website, so share them only with your partner.', { lostLink: t(cfg.policies.lostLink) }),
        },
        {
          id: 'two-editors',
          q: t('Can two people edit the website?'),
          a: t('Yes. Give your partner your Etsy order number and email, or your private edit link: either one opens your editor on their phone or computer. Keep them between the two of you, because they also open your guests\' replies. Never post them publicly. [About privacy](/privacy).'),
        },
        {
          // G154: G144's five languages (the sales site said "built-in messages stay in English" before)
          id: 'languages',
          q: t('Can our website be in another language?'),
          a: t('Yes: English, Spanish, French, German or Turkish, or several of them with a language button for guests. The design\'s headings, buttons, reply form and dates come translated. Your own texts can be translated automatically as a first draft, which you check and approve before guests see it. You can also write your own texts in any other language. [See the features](/features#guests).'),
        },
      ],
    },
    {
      id: 'guests',
      title: t('Guests and RSVP'),
      items: [
        {
          id: 'how-guests-reply',
          q: t('How do guests reply?'),
          a: t('Guests reply on the RSVP page of your website. They enter their name, whether they are coming, how many people are in their party, an optional message and your own questions. The form closes on its own after your reply-by date. [See RSVP features](/features#rsvp).'),
        },
        {
          id: 'guest-account',
          q: t('Do guests need an account or an app?'),
          a: t('No. Guests open your link in any phone or computer browser and reply right on the page. There is nothing to download and nothing to sign up for. An email address is optional for guests. Older relatives can also open the link from a QR code on a printed card.'),
        },
        {
          id: 'meal-choice',
          q: t('Can we ask for a meal choice?'),
          a: t('Yes. You can add up to {questions} questions of your own to the RSVP form, as multiple choice (up to {options} options), yes or no, a number, or a written answer, and mark each one required or optional. A meal choice, a song request or dietary needs are typical examples. Only guests who say they are coming see the questions. [See RSVP features](/features#rsvp).', { questions: LIMITS.rsvpQuestions, options: LIMITS.questionOptions }),
        },
        {
          id: 'where-replies',
          q: t('Where do we see the replies?'),
          a: t('Replies appear in your private panel, with the totals: how many replied, how many are coming and how many guests in all. You can download every reply as an Excel file (or CSV) for a spreadsheet or your caterer. Guests cannot see each other\'s replies. [See RSVP features](/features#rsvp).'),
        },
        {
          id: 'rsvp-deadline',
          q: t('When should the RSVP deadline be?'),
          a: t('Set it two to three weeks before the wedding, or a few days before the date your caterer and venue need final numbers. Etiquette guides such as the Emily Post Institute give the same range. [Read our guide on timing](/guides/when-to-send-your-wedding-website).'),
        },
      ],
    },
    {
      id: 'sharing',
      title: t('Sharing'),
      items: [
        {
          id: 'how-to-share',
          q: t('How do we share our website?'),
          a: t('Copy your link from the panel and send it by text, WhatsApp or email, or download your QR code for printed cards. Your address is your names on our domain, for example {domain}/clara-and-julian, and you choose it when you start. [See the sharing features](/features#sharing).', { domain: siteHost(cfg) }),
        },
        {
          id: 'link-preview',
          q: t('What do guests see when we send the link?'),
          a: t('Most messaging apps show a preview card with your names and wedding date and the design\'s artwork. Guests tap it and land on the sealed invitation, which opens into your website. Send the link to yourself first to see the preview before you share it with everyone.'),
        },
        {
          id: 'print-qr',
          q: t('Can we print the QR code on paper invitations?'),
          a: t('Yes. Download the QR code from your panel as PNG or SVG and add it to your printed invitation or details card. Scan the printed proof with two different phones before you print the full batch, to be sure it opens your website. [See the sharing features](/features#sharing).'),
        },
      ],
    },
    {
      id: 'hosting',
      title: t('Hosting and privacy'),
      items: [
        {
          id: 'how-long-online',
          q: t('How long is our website online?'),
          a: t('Your website stays online until {months} months after your wedding date, so guests can come back to it after the day. {extension} You can also take it offline yourself at any time from the panel. [See pricing](/pricing).', { months: m, extension: t(cfg.policies.extension) }),
        },
        {
          id: 'who-sees-replies',
          q: t('Who can see our guests’ replies?'),
          a: t('Only you, in your private panel, and our support team when they need to help you or keep the service running. Guests never see other guests\' replies, and we do not sell or share guest information. [Read our privacy notice](/privacy).'),
        },
        {
          id: 'google',
          q: t('Will our website show up on Google?'),
          // = COUPLE_SITE_ROBOTS in lib/site/render.ts (tests/marketing-content.test.ts keeps them in step).
          a: t('Not by default. Every couple website asks search engines not to list it, so guests reach yours through your link or QR code. Anyone who has the link can still open it, so keep a home address and other private details off the pages you publish. [Read our privacy notice](/privacy).'),
        },
        {
          id: 'take-offline',
          q: t('Can we take our website offline?'),
          a: t('Yes. Open Share in your panel and tap Take the website offline: it stops opening for guests right away; your content and replies stay in your panel. Publish again whenever you like. Photos of an unpublished website are not shown to anyone. [See the features](/features#editing).'),
        },
        {
          id: 'delete-data',
          q: t('How do we delete our data?'),
          a: t('{deletion} You can also write to {email} from the email address you used when you started your website. We confirm it is you before we delete anything. Deleting cannot be undone, so download your replies first. [Read our privacy notice](/privacy).', { deletion: t(cfg.policies.deletion), email: cfg.support.email }),
        },
      ],
    },
    {
      id: 'designs',
      title: t('Designs'),
      items: [
        {
          id: 'ai-artwork',
          q: t('Is the artwork made with AI?'),
          a: t('Yes. The artwork of each design is created with AI image tools. We then cut it into separate layers so the envelope or cover, cards and flowers can move on their own, write the layout and animation by hand, and test every design at five screen widths before release. [About how we make designs](/about).'),
        },
        {
          id: 'save-the-date',
          q: t('Is there a matching save the date?'),
          a: t('Not yet. Today each design is a wedding website with an opening scene, a home page, Our Story, Details and RSVP. If you need a save the date now, you can share your website link early and add the full details later; your guests will always see the latest version.'),
        },
        {
          id: 'printed',
          q: t('Do you sell printed invitations?'),
          // G154: G139's printable invitation (Share → Downloads) is part of every website; we still print nothing
          a: t('No, we do not print or ship anything. Your panel makes a printable invitation in your design instead: under Share, Downloads, choose 5 × 7 in or A5, add a back side with the details and a QR code, and bleed and crop marks for a print shop. Print it at home or at a local print shop. [See the features](/features#sharing).'),
        },
      ],
    },
    {
      id: 'support',
      title: t('Support'),
      items: [
        {
          id: 'contact',
          q: t('How do we contact you?'),
          a: t('Email us at {email}, or message {shop} on Etsy if your question is about an order. Include your Etsy order number and your website address so we can help quickly. We will never ask for your edit link. [Contact page](/contact).', { email: cfg.support.email, shop: cfg.etsy.shopName }),
        },
        {
          id: 'reply-time',
          q: t('How fast do you reply?'),
          a: t('We reply within {responseTime}. If something stops guests from opening your website or replying, put "Urgent" in the subject line and tell us your wedding date. For everything else, a short description and a screenshot help us answer in one message. [Contact us](/contact).', { responseTime: t(cfg.support.responseTime) }),
        },
      ],
    },
  ].map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, a: it.a.replace(/\b\.\./g, '.') })) }));
}

/** All items flat, in page order. */
export function faqItems(cfg: MarketingConfig = MARKETING, t: T = enT): FaqItem[] {
  return faqGroups(cfg, t).flatMap((g) => g.items);
}

/** The five questions on the home page (docs/14 §6.1). */
export const HOME_FAQ_IDS = ['canva-or-app', 'how-guests-reply', 'how-long-online', 'names-date-after-publishing', 'after-buying'] as const;

/** Plain-text answer (JSON-LD, llms-full.txt): Markdown links become their text. */
export function plainAnswer(a: string): string {
  return inlineText(parseInline(a));
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
