// G089 (K31): a light, one-time celebration on the "Your website is live" screen — brand-colored paper flecks burst
// from behind the success icon and fade (about 1.4 s, CSS only, no library, no canvas). Decorative: aria-hidden, no
// focusable content, pointer-events none; hidden with prefers-reduced-motion (components/fx/panel-fx.css).
// The particle layout is computed from the index, so the server and the browser render the same markup.
import type { CSSProperties } from 'react';

const COLORS = ['#d0ae6a', '#9f84a7', '#2b1526', '#e8c9c4', '#d0ae6a', '#ede5d7'];
const COUNT = 22;

export function Celebrate() {
  return (
    <div data-fx-burst aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => {
        const angle = (360 / COUNT) * i + (i % 3) * 7;
        const dist = 64 + ((i * 37) % 5) * 14;
        const style = {
          '--a': `${angle.toFixed(1)}deg`,
          '--d': `${dist}px`,
          '--c': COLORS[i % COLORS.length],
          '--w': `${i % 4 === 0 ? 10 : 6}px`,
          '--h': `${i % 2 ? 6 : 12}px`,
          '--t': `${(i % 4) * 40}ms`,
          '--r': `${(i % 2 ? 1 : -1) * (120 + i * 9)}deg`,
        } as CSSProperties;
        return <span key={i} style={style} />;
      })}
    </div>
  );
}
