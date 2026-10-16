'use client';
// G089 (K31): a one-time paper-confetti celebration for the "Your website is live" screen. Two cannons fire from the
// bottom corners, pieces flutter down in the brand colors and the canvas removes itself (about 3.5 s). Written for this
// project (no library): one fixed, aria-hidden, pointer-events-none canvas, ~120 pieces, requestAnimationFrame only
// while pieces are alive. With prefers-reduced-motion nothing is drawn.
import { useEffect } from 'react';

const COLORS = ['#d0ae6a', '#9f84a7', '#2b1526', '#e8c9c4', '#ede5d7', '#b8954f'];
const PER_CANNON = 60;
const LIFE_MS = 3400;

type Piece = { x: number; y: number; vx: number; vy: number; w: number; h: number; a: number; va: number; flip: number; vf: number; c: string };

export function Confetti() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:60';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.scale(dpr, dpr);

    const speed = Math.sqrt(H / 700);
    const pieces: Piece[] = [];
    for (const side of [0, 1]) {
      for (let i = 0; i < PER_CANNON; i++) {
        // left cannon aims up-right, right cannon up-left; ±22° of scatter
        const angle = ((side ? -112 : -68) + (Math.random() - 0.5) * 44) * (Math.PI / 180);
        const v = (1100 + Math.random() * 800) * speed;
        pieces.push({
          x: side ? W + 4 : -4,
          y: H + 4,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          w: 6 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          a: Math.random() * Math.PI,
          va: (Math.random() - 0.5) * 12,
          flip: Math.random() * Math.PI,
          vf: 6 + Math.random() * 8,
          c: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
    }

    let raf = 0;
    let last = performance.now();
    const start = last;
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const age = now - start;
      ctx.clearRect(0, 0, W, H);
      const fade = age > LIFE_MS - 800 ? Math.max(0, (LIFE_MS - age) / 800) : 1;
      for (const p of pieces) {
        // gravity, air drag (stronger when the piece is face-on: it flutters), a little sideways sway
        const face = Math.abs(Math.cos(p.flip));
        const drag = 1 - (1.6 + 2.4 * face) * dt;
        p.vx *= drag;
        p.vy = p.vy * drag + 900 * dt;
        p.vx += Math.sin(now / 300 + p.a) * 30 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.a += p.va * dt;
        p.flip += p.vf * dt;
        if (p.y > H + 40) continue;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.scale(1, Math.cos(p.flip));
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (age < LIFE_MS) raf = requestAnimationFrame(frame);
      else canvas.remove();
    };
    // a beat after the screen appears, so the check mark lands first
    const t = window.setTimeout(() => (raf = requestAnimationFrame(frame)), 250);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
      canvas.remove();
    };
  }, []);
  return null;
}
