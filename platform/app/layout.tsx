import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

// Root layout for platform pages (panel, /start, ...). Couple sites (/<slug>) are
// rendered from theme HTML by route handlers and do not use this layout.

export const metadata: Metadata = {
  title: 'Wedding website platform',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff', color: '#222' }}>
        {children}
      </body>
    </html>
  );
}
