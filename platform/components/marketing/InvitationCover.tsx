import type { CSSProperties } from 'react';
import type { Design } from '../../lib/marketing/designs.ts';
import s from './InvitationCover.module.css';

const COVERS = {
  'nocturne-lake-estate': { first: "Eleanor", second: "Luca", date: "SAT · SEP 18 · 2027", place: "LAKE COMO · ITALY", bg: "#181a16", ink: "#f5ebd6", accent: "#cfb37d", line: "rgba(207,179,125,.42)" },
  'velvet-jewel-box': { first: "Isabelle", second: "Julian", date: "SAT · NOV 13 · 2027", place: "NEW YORK · NEW YORK", bg: "#f1e8e5", ink: "#442b3d", accent: "#b98c7a", line: "rgba(109,70,90,.32)" },
  'grand-theatre-premiere': { first: "Charlotte", second: "Theodore", date: "SAT · OCT 16 · 2027", place: "RICHMOND · VIRGINIA", bg: "#112338", ink: "#f3e8cf", accent: "#d2af70", line: "rgba(210,175,112,.42)" },
  'orient-express-voyage': { first: "Amelia", second: "Rafael", date: "SAT · SEP 25 · 2027", place: "VENICE · ITALY", bg: "#eee8dc", ink: "#243b32", accent: "#a17c43", line: "rgba(115,91,57,.35)" },
  'kintsugi-washi': { first: "Naomi", second: "Kai", date: "SAT · OCT 9 · 2027", place: "HOOD RIVER · OREGON", bg: "#f0ece3", ink: "#292a28", accent: "#b08c4b", line: "rgba(176,140,75,.4)" },
  'riad-lantern-nights': { first: "Leila", second: "Adrian", date: "SAT · OCT 9 · 2027", place: "MARRAKECH · MOROCCO", bg: "#f4eee4", ink: "#24423e", accent: "#b28a4e", line: "rgba(139,108,61,.37)" },
  'maison-patisserie': { first: "Camille", second: "Oliver", date: "SAT · JUN 12 · 2027", place: "NEWPORT · RHODE ISLAND", bg: "#edf0e4", ink: "#465342", accent: "#b87c78", line: "rgba(117,137,105,.36)" },
  'celestial-observatory': { first: "Celeste", second: "Rowan", date: "SAT · AUG 14 · 2027", place: "FLAGSTAFF · ARIZONA", bg: "#171c2c", ink: "#f2e8d2", accent: "#cfb879", line: "rgba(207,184,121,.4)" },
  'azulejo-mosaic': { first: "Inês", second: "Mateo", date: "SAT · JUN 5 · 2027", place: "SINTRA · PORTUGAL", bg: "#eaf0ef", ink: "#18375b", accent: "#b66a4b", line: "rgba(34,83,133,.32)" },
  'sky-lantern-festival': { first: "Sophie", second: "Daniel", date: "SAT · SEP 18 · 2027", place: "SANTA BARBARA · CALIFORNIA", bg: "#382b42", ink: "#f8e8d1", accent: "#e1ad68", line: "rgba(225,173,104,.4)" },
  'music-box-ballerina': { first: "Juliette", second: "Arthur", date: "SAT · MAY 22 · 2027", place: "SARATOGA SPRINGS · NEW YORK", bg: "#f4e6e4", ink: "#523745", accent: "#bb8d72", line: "rgba(163,118,105,.36)" },
} as const;

export function hasEnvelopeCover(id: string): id is keyof typeof COVERS {
  return Object.prototype.hasOwnProperty.call(COVERS, id);
}

export function EnvelopeCover({ design }: { design: Pick<Design, 'id' | 'name'> }) {
  const cover = COVERS[design.id as keyof typeof COVERS];
  if (!cover) return null;
  const style = {
    '--cover-bg': cover.bg,
    '--cover-ink': cover.ink,
    '--cover-accent': cover.accent,
    '--cover-line': cover.line,
  } as CSSProperties & Record<'--cover-bg' | '--cover-ink' | '--cover-accent' | '--cover-line', string>;
  return (
    <div
      className={s.cover}
      style={style}
      data-theme={design.id}
      role="img"
      aria-label={design.name + ': ' + cover.first + ' and ' + cover.second + ', ' + cover.date + ', ' + cover.place + '. Tap to open the invitation.'}
    >
      <span className={s.skip} aria-hidden="true">SKIP</span>
      <div className={s.top}>
        <span className={s.ornament} aria-hidden="true">✦</span>
        <p className={s.hosts}>TOGETHER WITH THEIR FAMILIES</p>
        <p className={s.invite}>INVITE YOU TO CELEBRATE</p>
        <h3 className={s.names}>
          <span>{cover.first}</span>
          <em>and</em>
          <span>{cover.second}</span>
        </h3>
      </div>
      <img className={s.envelope} src={'/marketing/designs/' + design.id + '/envelope.webp'} alt="" loading="lazy" />
      <div className={s.bottom}>
        <p className={s.date}>{cover.date}</p>
        <p className={s.place}>{cover.place}</p>
        <p className={s.tap}><span aria-hidden="true">⌄</span> TAP TO OPEN</p>
      </div>
    </div>
  );
}
