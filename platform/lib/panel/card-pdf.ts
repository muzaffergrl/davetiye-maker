// A one-page PDF around one JPEG (G140: the printable QR card). Pure, no Node imports: the panel draws the card on a
// canvas (any script, the design's colours and image, 300 dpi), encodes it as JPEG and wraps it here — no PDF library.
// The JPEG goes in unchanged (DCTDecode) and fills the page.

const enc = new TextEncoder();

/** PDF bytes: one page of `widthPt` × `heightPt` points (72 per inch) showing the JPEG (`pxW` × `pxH`, RGB). */
export function jpegPdf(jpeg: Uint8Array, pxW: number, pxH: number, widthPt: number, heightPt: number, title = 'QR card'): Uint8Array {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) throw new Error('not a JPEG');
  const w = +widthPt.toFixed(2);
  const h = +heightPt.toFixed(2);
  const draw = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`;
  const safeTitle = title.replace(/[\\()]/g, (c) => `\\${c}`).replace(/[^\x20-\x7e]/g, '?');
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === 'string' ? enc.encode(chunk) : chunk;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (n: number, body: string | Array<string | Uint8Array>) => {
    offsets[n] = length;
    push(`${n} 0 obj\n`);
    for (const piece of Array.isArray(body) ? body : [body]) push(piece);
    push('\nendobj\n');
  };
  push('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  object(4, [
    `<< /Type /XObject /Subtype /Image /Width ${pxW} /Height ${pxH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
    jpeg,
    '\nendstream',
  ]);
  object(5, `<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
  object(6, `<< /Title (${safeTitle}) /Producer (BKE Studio) >>`);
  const xref = length;
  push(`xref\n0 7\n0000000000 65535 f \n`);
  for (let n = 1; n <= 6; n += 1) push(`${String(offsets[n]).padStart(10, '0')} 00000 n \n`);
  push(`trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  const out = new Uint8Array(length);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}
