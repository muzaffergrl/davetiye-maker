// FAQ (docs/14 §6.7): one source for /faq, the home page FAQ, the FAQPage JSON-LD and llms-full.txt. Every answer
// gives the answer in its first sentence, is 40–80 words (tests/marketing-content.test.ts) and links to the page with
// the details. Undecided policies stay as visible placeholders from config ([REFUND POLICY] …).
// Answers use the inline Markdown of markdown.ts ([text](/path), **strong**).

import { MARKETING, type MarketingConfig } from './config.ts';
import { editRightsText, LIMITS } from './facts.ts';
import { inlineText, parseInline } from './markdown.ts';

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

export function faqGroups(cfg: MarketingConfig = MARKETING): FaqGroup[] {
  const b = cfg.brand.name;
  const m = cfg.hosting.monthsAfterWedding;
  const rights = editRightsText(cfg);
  return [
    {
      id: 'buying',
      title: 'Buying',
      items: [
        {
          id: 'how-to-buy',
          q: 'How do I buy a design?',
          a: `You buy it on Etsy. Pick a design here, open its live demo on your phone, then tap **Buy on Etsy** on the design page. Etsy takes the payment and your download opens as soon as the payment goes through. It holds the link where you start your website. [See how it works](/how-it-works).`,
        },
        {
          id: 'after-buying',
          q: 'What do I get after buying on Etsy?',
          a: `You get a short PDF with the link to start your website. There you enter your Etsy order number, your email and your first names, choose your web address, and your draft website is created in the design you bought. Then you edit it in your private panel. [What is included](/pricing#included).`,
        },
        {
          id: 'subscription',
          q: 'Is it a subscription?',
          a: `No. You pay once on Etsy and there is nothing to renew, no monthly fee and no per-guest fee. Your website stays online until ${m} months after your wedding date. After that: ${cfg.policies.extension}. There are no upgrades to buy inside the panel. [See pricing](/pricing).`,
        },
        {
          // docs/14 §2.2 #18 and docs/15: the most likely objection. Free builders are not belittled, and nothing is
          // claimed about any named competitor (only what we checked about our own product).
          id: 'why-pay',
          q: 'Why pay for a design when free wedding websites exist?',
          a: `Free wedding website builders are a good choice for many couples, especially if you want registry and planning tools in the same place. What you pay for here is the design: artwork that opens from a sealed envelope into your own pages. You buy it once on Etsy, with no subscription and no account to create, and you edit it from your phone. [Try a live demo](/designs).`,
        },
        {
          id: 'refund',
          q: 'Can I get a refund?',
          a: `Our refund policy: ${cfg.policies.refund}. Because a design is a digital download, Etsy shows its own rules for digital items on the listing. Please try the live demo of a design on your phone before you buy, so you know exactly how it looks and opens. [Contact us](/contact) with any question first.`,
        },
        {
          id: 'one-order-one-website',
          q: 'Can I use one purchase for two weddings?',
          a: `No. One Etsy order creates one wedding website. The order number is used when you start your website, and the same order cannot start a second one. If you are planning more than one event, buy the design once for each website. [See how it works](/how-it-works).`,
        },
      ],
    },
    {
      id: 'editing',
      title: 'Editing your website',
      items: [
        {
          id: 'canva-or-app',
          q: 'Do I need Canva or an app?',
          a: `No. You edit your website in a private panel that opens in your phone's browser, so there is no Canva account and no app to install. The panel is designed for phone screens and also works on a computer. You can preview every page before you publish. [See the features](/features).`,
        },
        {
          id: 'what-can-i-change',
          q: 'What can I change?',
          a: `You can change all of your wedding details. That covers names, date, time and time zone, venue and map link, the order of the day (up to ${LIMITS.scheduleRows} rows), your story, ${LIMITS.photoSpots} photos, questions and answers, your RSVP deadline and up to ${LIMITS.rsvpQuestions} RSVP questions. You can also switch optional sections on or off. [Full list](/features#editing).`,
        },
        {
          id: 'colors-fonts',
          q: 'Can I change the colors or fonts?',
          a: `No. Each design keeps its artwork, colors, fonts and layout, because they are made to work together and to open with that design's animation. What you change is the content: your names, details, photos and questions. Try the [live demos](/designs) to choose the design whose look you love.`,
        },
        {
          id: 'names-date-after-publishing',
          q: 'Can we change our names or date after publishing?',
          a: `Yes, within a limit. ${rights.long} ${rights.rest} Before you publish, you can change everything freely. [See how it works](/how-it-works).`,
        },
        {
          id: 'date-moves',
          q: 'What if our wedding date moves?',
          a: `Change the date in your panel; a new date uses one of your name and date changes. If you have used all of them, [contact us](/contact) at ${cfg.support.email} with your Etsy order number and tell us what happened, so we can look at it with you.`,
        },
        {
          id: 'lost-link',
          q: 'What if I lose my edit link?',
          a: `${cfg.policies.lostLink}. Your edit link is shown once, when you start your website, so save it somewhere safe right away: your notes app or an email to yourself. Anyone who has the link can edit your website. [Contact us](/contact) if it is lost.`,
        },
        {
          id: 'two-editors',
          q: 'Can two people edit the website?',
          a: `Yes. Anyone who has your edit link can open the panel, so you can share it with your partner. Keep it between the two of you: the link is the key to your website and to your guests' replies. Never post it publicly. [About privacy](/privacy).`,
        },
      ],
    },
    {
      id: 'guests',
      title: 'Guests and RSVP',
      items: [
        {
          id: 'how-guests-reply',
          q: 'How do guests reply?',
          a: `Guests reply on the RSVP page of your website. They enter their name, whether they are coming, how many people are in their party, an optional message and your own questions. The form closes on its own after your reply-by date. [See RSVP features](/features#rsvp).`,
        },
        {
          id: 'guest-account',
          q: 'Do guests need an account or an app?',
          a: `No. Guests open your link in any phone or computer browser and reply right on the page. There is nothing to download and nothing to sign up for. An email address is optional for guests. Older relatives can also open the link from a QR code on a printed card.`,
        },
        {
          id: 'meal-choice',
          q: 'Can we ask for a meal choice?',
          a: `Yes. You can add up to ${LIMITS.rsvpQuestions} questions of your own to the RSVP form, either multiple choice (up to ${LIMITS.questionOptions} options) or a short answer. A meal choice, a song request or dietary needs are typical examples. Only guests who say they are coming see the questions. [See RSVP features](/features#rsvp).`,
        },
        {
          id: 'where-replies',
          q: 'Where do we see the replies?',
          a: `Replies appear in your private panel, with the totals: how many replied, how many are coming and how many guests in all. You can download every reply as a CSV file for a spreadsheet or your caterer. Guests cannot see each other's replies. [See RSVP features](/features#rsvp).`,
        },
        {
          id: 'rsvp-deadline',
          q: 'When should the RSVP deadline be?',
          a: `Set it two to three weeks before the wedding, or a few days before the date your caterer and venue need final numbers. Etiquette guides such as the Emily Post Institute give the same range. [Read our guide on timing](/guides/when-to-send-your-wedding-website).`,
        },
      ],
    },
    {
      id: 'sharing',
      title: 'Sharing',
      items: [
        {
          id: 'how-to-share',
          q: 'How do we share our website?',
          a: `Copy your link from the panel and send it by text, WhatsApp or email, or download your QR code for printed cards. Your address is your names on our domain, for example ${cfg.domain}/clara-and-julian, and you choose it when you start. [See the sharing features](/features#sharing).`,
        },
        {
          id: 'link-preview',
          q: 'What do guests see when we send the link?',
          a: `Most messaging apps show a preview card with your names and wedding date and the design's artwork. Guests tap it and land on the sealed envelope, which opens into your website. Send the link to yourself first to see the preview before you share it with everyone.`,
        },
        {
          id: 'print-qr',
          q: 'Can we print the QR code on paper invitations?',
          a: `Yes. Download the QR code from your panel as PNG or SVG and add it to your printed invitation or details card. Scan the printed proof with two different phones before you print the full batch, to be sure it opens your website. [See the sharing features](/features#sharing).`,
        },
      ],
    },
    {
      id: 'hosting',
      title: 'Hosting and privacy',
      items: [
        {
          id: 'how-long-online',
          q: 'How long is our website online?',
          a: `Your website stays online until ${m} months after your wedding date, so guests can come back to it after the day. What happens after that: ${cfg.policies.extension}. You can also take it offline yourself at any time from the panel. [See pricing](/pricing).`,
        },
        {
          id: 'who-sees-replies',
          q: 'Who can see our guests’ replies?',
          a: `Only you, in your private panel, and our support team when they need to help you or keep the service running. Guests never see other guests' replies, and we do not sell or share guest information. [Read our privacy notice](/privacy).`,
        },
        {
          id: 'google',
          q: 'Will our website show up on Google?',
          // = COUPLE_SITE_ROBOTS in lib/site/render.ts (tests/marketing-content.test.ts keeps them in step).
          a: `Not by default. Every couple website asks search engines not to list it, so guests reach yours through your link or QR code. Anyone who has the link can still open it, so keep a home address and other private details off the pages you publish. [Read our privacy notice](/privacy).`,
        },
        {
          id: 'take-offline',
          q: 'Can we take our website offline?',
          a: `Yes. Tap Unpublish in your panel and the website stops opening for guests right away; your content and replies stay in your panel. Publish again whenever you like. Photos of an unpublished website are not shown to anyone. [See the features](/features#editing).`,
        },
        {
          id: 'delete-data',
          q: 'How do we delete our data?',
          a: `${cfg.policies.deletion}. Until then, write to ${cfg.support.email} from the email address you used when you started your website and include your Etsy order number, so we can confirm it is you before we delete anything. [Read our privacy notice](/privacy).`,
        },
      ],
    },
    {
      id: 'designs',
      title: 'Designs',
      items: [
        {
          id: 'ai-artwork',
          q: 'Is the artwork made with AI?',
          a: `Yes. The artwork of each design is created with AI image tools. We then cut it into separate layers so the envelope, cards and flowers can move on their own, write the layout and animation by hand, and test every design at five screen widths before release. [About how we make designs](/about).`,
        },
        {
          id: 'save-the-date',
          q: 'Is there a matching save the date?',
          a: `Not yet. Today each design is a wedding website with an opening envelope, a home page, Our Story, Details and RSVP. If you need a save the date now, you can share your website link early and add the full details later; your guests will always see the latest version.`,
        },
        {
          id: 'printed',
          q: 'Do you sell printed invitations?',
          a: `No. We only make wedding websites. If some guests prefer paper, you can print your own simple card with your website's QR code at home or at a local print shop, so they can still open the envelope and reply online. [Read about digital invitation etiquette](/guides/digital-wedding-invitation-etiquette).`,
        },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      items: [
        {
          id: 'contact',
          q: 'How do we contact you?',
          a: `Email us at ${cfg.support.email}, or message ${cfg.etsy.shopName} on Etsy if your question is about an order. Include your Etsy order number and your website address so we can help quickly. We will never ask for your edit link. [Contact page](/contact).`,
        },
        {
          id: 'reply-time',
          q: 'How fast do you reply?',
          a: `We reply within ${cfg.support.responseTime}. If something stops guests from opening your website or replying, put "Urgent" in the subject line and tell us your wedding date. For everything else, a short description and a screenshot help us answer in one message. [Contact us](/contact).`,
        },
      ],
    },
  ].map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, a: it.a.replace(/\b\.\./g, '.') })) }));
}

/** All items flat, in page order. */
export function faqItems(cfg: MarketingConfig = MARKETING): FaqItem[] {
  return faqGroups(cfg).flatMap((g) => g.items);
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
