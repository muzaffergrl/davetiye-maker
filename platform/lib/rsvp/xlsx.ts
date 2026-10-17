// Excel download of the couple's replies (G128): built on the server with exceljs (MIT) from the shared table model
// (table.ts). Two sheets:
//   Replies  styled header (anchor #2B1526, paper text), frozen header row, auto filter, column widths, paper (#EDE5D7)
//            stripes, date-times as real dates (site time zone, "mmm d, yyyy h:mm AM/PM"), Yes / No, guest counts and
//            number answers as numbers, long texts wrapped. Columns follow the form's field set at download time.
//   Summary  total replies, coming / not coming, head count, the breakdown of each choice and yes / no question.
// Text cells are written as plain strings (exceljs never turns "=…" into a formula unless asked), so a guest's "=1+1"
// stays text.

import ExcelJS from 'exceljs';
import type { DataAdapter, SiteRecord } from '../data/types.ts';
import { replyTable, summaryRows, type Cell, type ReplyTable, type SummaryRow, type TableOptions, type TableReply } from './table.ts';

/** BKE Studio brand colours (docs/14): anchor (deep plum) and paper. */
export const BRAND = { anchor: 'FF2B1526', paper: 'FFEDE5D7', paperText: 'FFFBF8F2', ink: 'FF2B1526', line: 'FFD9CDB8' } as const;

const DATE_FORMAT = 'mmm d, yyyy h:mm AM/PM';
const PERCENT_FORMAT = '0%';

/** A serial spreadsheet day as the JS Date exceljs writes back as that same serial (UTC, no zone shift). */
function serialToDate(serial: number): Date {
  return new Date(Math.round((serial - 25569) * 86_400_000));
}

function cellValue(cell: Cell): ExcelJS.CellValue {
  if (cell === null || cell === undefined) return null;
  if (typeof cell === 'object') return serialToDate(cell.serial);
  return cell;
}

function writeReplies(ws: ExcelJS.Worksheet, table: ReplyTable): void {
  ws.columns = table.columns.map((c) => ({ key: c.key, width: c.width }));
  const header = ws.addRow(table.columns.map((c) => c.header));
  header.height = 22;
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: BRAND.paperText }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND.anchor } };
    cell.alignment = { vertical: 'middle', wrapText: true };
  });
  table.rows.forEach((row, i) => {
    const r = ws.addRow(row.map(cellValue));
    r.eachCell({ includeEmpty: true }, (cell, col) => {
      const kind = table.columns[col - 1]?.kind;
      if (i % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND.paper } };
      cell.alignment = { vertical: 'top', wrapText: kind === 'long' || kind === 'text', horizontal: kind === 'number' || kind === 'yesno' ? 'center' : 'left' };
      if (kind === 'datetime') cell.numFmt = DATE_FORMAT;
      if (kind === 'number') cell.numFmt = '0';
      cell.border = { bottom: { style: 'thin', color: { argb: BRAND.line } } };
    });
  });
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'A2', activeCell: 'A2' }];
  if (table.columns.length) ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(1, table.rows.length + 1), column: table.columns.length } };
}

function writeSummary(ws: ExcelJS.Worksheet, rows: readonly SummaryRow[]): void {
  ws.columns = [{ width: 38 }, { width: 22 }, { width: 10 }];
  for (const row of rows) {
    if (row.kind === 'blank') {
      ws.addRow([]);
      continue;
    }
    if (row.kind === 'title') {
      const r = ws.addRow([row.label]);
      r.height = 26;
      ws.mergeCells(r.number, 1, r.number, 3);
      const c = r.getCell(1);
      c.font = { bold: true, size: 14, color: { argb: BRAND.paperText } };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND.anchor } };
      c.alignment = { vertical: 'middle' };
      continue;
    }
    if (row.kind === 'section') {
      const r = ws.addRow([row.label, row.head?.[0] ?? '', row.head?.[1] ?? '']);
      r.eachCell({ includeEmpty: true }, (c) => {
        c.font = { bold: true, color: { argb: BRAND.ink } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND.paper } };
      });
      continue;
    }
    const r = ws.addRow([row.label, cellValue(row.value ?? null), row.share === undefined || row.share === null ? null : row.share]);
    const v = r.getCell(2);
    if (row.value && typeof row.value === 'object') v.numFmt = DATE_FORMAT;
    v.alignment = { horizontal: 'left' };
    if (row.share !== undefined && row.share !== null) r.getCell(3).numFmt = PERCENT_FORMAT;
  }
}

/** The workbook of a list of replies (pure input: replies + the content record giving questions, zone, names). */
export async function rsvpWorkbook(list: readonly TableReply[], content: unknown, now: Date = new Date(), t?: TableOptions['t']): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'BKE Studio';
  wb.created = now;
  const table = replyTable(list, { content, now, t });
  wb.title = table.title;
  writeReplies(wb.addWorksheet('Replies', { properties: { tabColor: { argb: BRAND.anchor } } }), table);
  writeSummary(wb.addWorksheet('Summary', { properties: { tabColor: { argb: BRAND.paper } } }), summaryRows(list, { content, now, t }));
  const buf = await wb.xlsx.writeBuffer();
  return new Uint8Array(buf as ArrayBuffer);
}

/** Excel file of a site's replies (published content's form when there is one) and its download file name. */
export async function rsvpXlsxForSite(adapter: DataAdapter, site: SiteRecord, now: Date = new Date(), t?: TableOptions['t']): Promise<{ bytes: Uint8Array; filename: string }> {
  const content = site.publishedContent ?? site.content;
  const list = await adapter.listRsvps(site.id);
  return { bytes: await rsvpWorkbook(list, content, now, t), filename: `rsvps-${site.slug}-${now.toISOString().slice(0, 10)}.xlsx` };
}
