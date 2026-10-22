'use client';
// The AI support chat in the panel (components/support), in the panel's sheet. Loaded when it opens (lazy.tsx).
// The edit key goes to /api/support/chat as a Bearer header: the assistant then knows a few facts about this website
// (design, published, name & date changes left; never names, guests or keys — lib/support/chat.ts siteFacts).

import { useCallback, useState } from 'react';
import { MARKETING } from '../../lib/marketing/config.ts';
import { t } from '../../lib/i18n/client.ts';
import { isPlaceholder, PANEL_BRAND } from '../../lib/panel/brand.ts';
import { chatCopy } from '../support/copy.ts';
import { MAX_CHARS } from '../support/limits.ts';
import { SupportChat } from '../support/SupportChat.tsx';
import s from '../support/support.module.css';
import { Sheet } from './Sheet.tsx';
import { Button } from './ui.tsx';
import { RotateCcw } from 'lucide-react';

export function SupportSheet({ slug, editKey, onClose }: { slug: string; editKey: string; onClose: () => void }) {
  const email = isPlaceholder(PANEL_BRAND.supportEmail) ? null : PANEL_BRAND.supportEmail;
  const copy = chatCopy(t, { context: 'panel', brand: MARKETING.brand.name, shop: PANEL_BRAND.shopName, email, maxChars: MAX_CHARS });
  const [reset, setReset] = useState<(() => void) | null>(null);
  const onNewChat = useCallback((fn: (() => void) | null) => setReset(() => fn), []);
  return (
    <Sheet
      title={copy.title}
      onClose={onClose}
      closeLabel={copy.close}
      testId="support"
      footer={
        reset ? (
          <Button variant="tertiary" small icon={RotateCcw} onClick={reset}>
            {copy.newChat}
          </Button>
        ) : undefined
      }
    >
      <div className={s.sheetChat}>
        <SupportChat
          copy={copy}
          links={{ faq: '/faq', etsy: MARKETING.etsy.shopUrl, email }}
          context="panel"
          slug={slug}
          editKey={editKey}
          storageKey={`bke-support-panel-${slug}`}
          onNewChat={onNewChat}
        />
      </div>
    </Sheet>
  );
}
