// The support chat's words. The sales site builds them on the server in the page language (MarketShell, m.t); the panel
// with its own t(). Both namespaces list components/support (lib/i18n/keys.ts), so the dictionaries carry these keys.

import type { Vars } from '../../lib/i18n/translate.ts';

type T = (en: string, vars?: Vars) => string;

export interface ChatCopy {
  title: string;
  subtitle: string;
  open: string;
  close: string;
  newChat: string;
  greeting: string;
  suggestions: string[];
  placeholder: string;
  send: string;
  typing: string;
  you: string;
  assistant: string;
  notice: string;
  notReadyTitle: string;
  notReadyText: string;
  faq: string;
  human: string;
  etsy: string;
  email: string | null;
  tooLong: string;
  rateLimited: string;
  dailyLimit: string;
  busy: string;
  failed: string;
  offline: string;
  retry: string;
}

export interface ChatLinks {
  faq: string;
  etsy: string;
  /** Support address, or null while it is a placeholder. */
  email: string | null;
}

export function chatCopy(t: T, opts: { context: 'market' | 'panel'; brand: string; shop: string; email: string | null; maxChars: number }): ChatCopy {
  const market = opts.context === 'market';
  return {
    title: t('Live help'),
    subtitle: t('AI assistant · replies in seconds'),
    open: t('Chat with us'),
    close: t('Close chat'),
    newChat: t('New chat'),
    greeting: market
      ? t('Hi! I’m the {brand} assistant. Ask me anything about our designs, buying on Etsy or building your wedding website.', { brand: opts.brand })
      : t('Hi! Ask me anything about editing, publishing or sharing your wedding website.'),
    suggestions: market
      ? [t('How does it work?'), t('What do I get after buying?'), t('How long does my website stay online?'), t('Can guests reply online?')]
      : [t('How do I publish my changes?'), t('How do I share my website?'), t('How do I download the replies?'), t('Can I change our names after publishing?')],
    placeholder: t('Type your question…'),
    send: t('Send'),
    typing: t('The assistant is typing…'),
    you: t('You'),
    assistant: t('Assistant'),
    notice: t('AI answers can be wrong. Please don’t share passwords, your edit link or personal details here.'),
    notReadyTitle: t('Our assistant is almost ready'),
    notReadyText: t('Until then, you can find most answers here, or write to us:'),
    faq: t('Read the FAQ'),
    human: t('Talk to a person'),
    etsy: t('Message {shop} on Etsy', { shop: opts.shop }),
    email: opts.email ? t('Email {email}', { email: opts.email }) : null,
    tooLong: t('Please keep your message under {n} characters.', { n: opts.maxChars }),
    rateLimited: t('You’ve sent a lot of messages. Please wait a few minutes and try again.'),
    dailyLimit: t('Our assistant has answered all it can for today. Please message us on Etsy, or try again tomorrow.'),
    busy: t('The assistant is busy right now. Please try again in a minute.'),
    failed: t('Something went wrong. Please try again.'),
    offline: t('You’re offline. Connect to the internet and try again.'),
    retry: t('Try again'),
  };
}
