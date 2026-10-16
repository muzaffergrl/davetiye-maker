// G089 (K31): ShinyText — a light band sweeping across a line of text.
//
// Ported from React Bits "ShinyText" (TextAnimations/ShinyText, CSS variant): https://github.com/DavidHaz/react-bits
// MIT License — Copyright (c) 2025 David Haz. Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
// following conditions: The above copyright notice and this permission notice shall be included in all copies or
// substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
//
// Changes for BKE Studio: server component (no client JS), brand colors on a light ground (the text keeps its own ink
// color under the band, so contrast never drops), a pause between sweeps; with prefers-reduced-motion the band stays
// off (components/fx/fx.css).
import type { CSSProperties, ReactNode } from 'react';

export function ShinyText({ children, speed = 6, disabled = false }: { children: ReactNode; speed?: number; disabled?: boolean }) {
  return (
    <span data-fx-shiny={disabled ? undefined : ''} style={{ '--fx-shiny-speed': `${speed}s` } as CSSProperties}>
      {children}
    </span>
  );
}
