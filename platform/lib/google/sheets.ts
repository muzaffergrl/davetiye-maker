// The couple's Google Sheet (G128): the same two sheets as the Excel file (lib/rsvp/xlsx.ts), from the same table model
// (lib/rsvp/table.ts), written in full on every sync (idempotent: a guest list is a few hundred rows at most).
//
//   create      POST /v4/spreadsheets — "Replies" (sheetId 0) and "Summary" (sheetId 1), en_US, the site's time zone
//   each sync   GET metadata (which sheets exist, grid size, bandings, merges) -> ONE batchUpdate:
//               missing sheets back, old bandings / merges off, every cell cleared, grid grown when needed, values,
//               column formats (header, date-time, numbers, wrap), widths, paper stripes (banding), frozen header,
//               filter, the title merged on Summary, the file name (names may change).
// Text goes in as stringValue: Sheets never reads it as a formula ("=1+1" from a guest stays text).

import { replyTable, type TableOptions, summaryRows, type Cell, type ReplyTable, type SummaryRow, type TableReply } from '../rsvp/table.ts';
import { siteLangs } from '../i18n/content.ts';
import { loadDict } from '../i18n/dicts.ts';
import { makeTranslator } from '../i18n/translate.ts';
import { GOOGLE_ENDPOINTS } from './config.ts';
import { GoogleError, sheetsCall } from './oauth.ts';

export const REPLIES_ID = 0;
export const SUMMARY_ID = 1;
const REPLIES = 'Replies';
const SUMMARY = 'Summary';
const DATE_PATTERN = 'mmm d, yyyy h:mm AM/PM';

const rgb = (hex: string) => ({
  red: parseInt(hex.slice(1, 3), 16) / 255,
  green: parseInt(hex.slice(3, 5), 16) / 255,
  blue: parseInt(hex.slice(5, 7), 16) / 255,
});
const ANCHOR = rgb('#2B1526');
const PAPER = rgb('#EDE5D7');
const PAPER_TEXT = rgb('#FBF8F2');
const WHITE = rgb('#FFFFFF');

type Json = Record<string, unknown>;

function cellData(cell: Cell): Json {
  if (cell === null || cell === undefined || cell === '') return {};
  if (typeof cell === 'number') return { userEnteredValue: { numberValue: cell } };
  if (typeof cell === 'object') return { userEnteredValue: { numberValue: cell.serial } };
  return { userEnteredValue: { stringValue: cell } };
}

interface SheetMeta {
  properties: { sheetId: number; title: string; gridProperties?: { rowCount?: number; columnCount?: number } };
  bandedRanges?: Array<{ bandedRangeId: number }>;
  merges?: unknown[];
}

/** Creates the spreadsheet in the couple's Drive. */
export async function createSpreadsheet(token: string, title: string, timeZone: string): Promise<{ id: string; url: string }> {
  const body = {
    properties: { title, locale: 'en_US', timeZone },
    sheets: [
      { properties: { sheetId: REPLIES_ID, title: REPLIES, index: 0, gridProperties: { frozenRowCount: 1 }, tabColorStyle: { rgbColor: ANCHOR } } },
      { properties: { sheetId: SUMMARY_ID, title: SUMMARY, index: 1, tabColorStyle: { rgbColor: PAPER } } },
    ],
  };
  const res = await sheetsCall<{ spreadsheetId?: string; spreadsheetUrl?: string }>(token, GOOGLE_ENDPOINTS.sheets, 'POST', body);
  if (!res.spreadsheetId) throw new GoogleError('no_spreadsheet_id', 200);
  return { id: res.spreadsheetId, url: res.spreadsheetUrl ?? `https://docs.google.com/spreadsheets/d/${res.spreadsheetId}/edit` };
}

const range = (sheetId: number, r0: number, r1: number, c0: number, c1: number) => ({
  sheetId,
  startRowIndex: r0,
  endRowIndex: r1,
  startColumnIndex: c0,
  endColumnIndex: c1,
});

function sheetPrep(meta: SheetMeta | undefined, sheetId: number, title: string, rows: number, cols: number, frozen: number): Json[] {
  const out: Json[] = [];
  if (!meta) out.push({ addSheet: { properties: { sheetId, title, index: sheetId } } });
  for (const b of meta?.bandedRanges ?? []) out.push({ deleteBanding: { bandedRangeId: b.bandedRangeId } });
  if (meta?.merges?.length) out.push({ unmergeCells: { range: { sheetId } } });
  out.push({ updateCells: { range: { sheetId }, fields: 'userEnteredValue,userEnteredFormat,note' } });
  // Grid: only grows (shrinking could clip a filter); old rows beyond the data are already empty.
  const g = meta?.properties.gridProperties ?? {};
  const rowCount = Math.max(g.rowCount ?? 1000, rows + 20);
  const columnCount = Math.max(g.columnCount ?? 26, cols);
  out.push({
    updateSheetProperties: {
      properties: { sheetId, title, gridProperties: { rowCount, columnCount, frozenRowCount: frozen } },
      fields: 'title,gridProperties(rowCount,columnCount,frozenRowCount)',
    },
  });
  return out;
}

/** batchUpdate requests of the Replies sheet. */
export function repliesRequests(table: ReplyTable, meta?: SheetMeta): Json[] {
  const S = REPLIES_ID;
  const nRows = table.rows.length + 1;
  const nCols = Math.max(1, table.columns.length);
  const out = sheetPrep(meta, S, REPLIES, nRows, nCols, 1);
  out.push({
    updateCells: {
      start: { sheetId: S, rowIndex: 0, columnIndex: 0 },
      rows: [{ values: table.columns.map((c) => cellData(c.header)) }, ...table.rows.map((r) => ({ values: r.map(cellData) }))],
      fields: 'userEnteredValue',
    },
  });
  out.push({
    repeatCell: {
      range: range(S, 0, 1, 0, nCols),
      cell: {
        userEnteredFormat: {
          backgroundColorStyle: { rgbColor: ANCHOR },
          textFormat: { bold: true, foregroundColorStyle: { rgbColor: PAPER_TEXT } },
          verticalAlignment: 'MIDDLE',
          wrapStrategy: 'WRAP',
        },
      },
      fields: 'userEnteredFormat(backgroundColorStyle,textFormat,verticalAlignment,wrapStrategy)',
    },
  });
  table.columns.forEach((c, i) => {
    const fmt: Json = { verticalAlignment: 'TOP', wrapStrategy: c.kind === 'long' || c.kind === 'text' ? 'WRAP' : 'OVERFLOW_CELL' };
    if (c.kind === 'datetime') fmt.numberFormat = { type: 'DATE_TIME', pattern: DATE_PATTERN };
    if (c.kind === 'number') fmt.numberFormat = { type: 'NUMBER', pattern: '0' };
    if (c.kind === 'number' || c.kind === 'yesno') fmt.horizontalAlignment = 'CENTER';
    if (table.rows.length) {
      out.push({
        repeatCell: {
          range: range(S, 1, nRows, i, i + 1),
          cell: { userEnteredFormat: fmt },
          fields: `userEnteredFormat(${Object.keys(fmt).join(',')})`,
        },
      });
    }
    out.push({
      updateDimensionProperties: {
        range: { sheetId: S, dimension: 'COLUMNS', startIndex: i, endIndex: i + 1 },
        properties: { pixelSize: Math.round(c.width * 7.5 + 12) },
        fields: 'pixelSize',
      },
    });
  });
  out.push({
    addBanding: {
      bandedRange: {
        range: range(S, 0, nRows, 0, nCols),
        rowProperties: { headerColorStyle: { rgbColor: ANCHOR }, firstBandColorStyle: { rgbColor: WHITE }, secondBandColorStyle: { rgbColor: PAPER } },
      },
    },
  });
  out.push({ setBasicFilter: { filter: { range: range(S, 0, nRows, 0, nCols) } } });
  return out;
}

/** batchUpdate requests of the Summary sheet. */
export function summaryRequests(rows: readonly SummaryRow[], meta?: SheetMeta): Json[] {
  const S = SUMMARY_ID;
  const out = sheetPrep(meta, S, SUMMARY, rows.length, 3, 0);
  const values = rows.map((r) => {
    if (r.kind === 'blank') return { values: [] };
    if (r.kind === 'title') return { values: [cellData(r.label ?? '')] };
    if (r.kind === 'section') return { values: [cellData(r.label ?? ''), cellData(r.head?.[0] ?? ''), cellData(r.head?.[1] ?? '')] };
    return { values: [cellData(r.label ?? ''), cellData(r.value ?? null), r.share === undefined || r.share === null ? {} : { userEnteredValue: { numberValue: r.share } }] };
  });
  out.push({ updateCells: { start: { sheetId: S, rowIndex: 0, columnIndex: 0 }, rows: values, fields: 'userEnteredValue' } });
  rows.forEach((r, i) => {
    if (r.kind === 'title') {
      out.push({ mergeCells: { range: range(S, i, i + 1, 0, 3), mergeType: 'MERGE_ALL' } });
      out.push({
        repeatCell: {
          range: range(S, i, i + 1, 0, 3),
          cell: { userEnteredFormat: { backgroundColorStyle: { rgbColor: ANCHOR }, textFormat: { bold: true, fontSize: 14, foregroundColorStyle: { rgbColor: PAPER_TEXT } } } },
          fields: 'userEnteredFormat(backgroundColorStyle,textFormat)',
        },
      });
    } else if (r.kind === 'section') {
      out.push({
        repeatCell: {
          range: range(S, i, i + 1, 0, 3),
          cell: { userEnteredFormat: { backgroundColorStyle: { rgbColor: PAPER }, textFormat: { bold: true } } },
          fields: 'userEnteredFormat(backgroundColorStyle,textFormat)',
        },
      });
    } else if (r.kind === 'row') {
      const fmt: Json = { horizontalAlignment: 'LEFT' };
      if (r.value && typeof r.value === 'object') fmt.numberFormat = { type: 'DATE_TIME', pattern: DATE_PATTERN };
      out.push({ repeatCell: { range: range(S, i, i + 1, 1, 2), cell: { userEnteredFormat: fmt }, fields: `userEnteredFormat(${Object.keys(fmt).join(',')})` } });
      if (r.share !== undefined && r.share !== null) {
        out.push({
          repeatCell: {
            range: range(S, i, i + 1, 2, 3),
            cell: { userEnteredFormat: { numberFormat: { type: 'PERCENT', pattern: '0%' } } },
            fields: 'userEnteredFormat(numberFormat)',
          },
        });
      }
    }
  });
  [300, 170, 80].forEach((px, i) =>
    out.push({ updateDimensionProperties: { range: { sheetId: S, dimension: 'COLUMNS', startIndex: i, endIndex: i + 1 }, properties: { pixelSize: px }, fields: 'pixelSize' } }),
  );
  return out;
}

/**
 * G144: the sheet's headings in the website's main language (content.languages.primary): a sync runs after a guest's
 * reply too, without the couple's browser, so the panel's language is not known there; the main language is stable.
 */
async function sheetTranslator(content: unknown): Promise<TableOptions['t']> {
  const lang = siteLangs(content).primary;
  return makeTranslator(lang, await loadDict('panel', lang)).t;
}

/** Every request of one full sync (exported for the tests). */
export function syncRequests(list: readonly TableReply[], content: unknown, now: Date, sheets: readonly SheetMeta[], t?: TableOptions['t']): Json[] {
  const table = replyTable(list, { content, now, t });
  const meta = (id: number) => sheets.find((s) => s.properties.sheetId === id);
  return [
    { updateSpreadsheetProperties: { properties: { title: table.title, timeZone: table.timeZone }, fields: 'title,timeZone' } },
    ...repliesRequests(table, meta(REPLIES_ID)),
    ...summaryRequests(summaryRows(list, { content, now, t }), meta(SUMMARY_ID)),
  ];
}

/** Writes the whole spreadsheet. Throws GoogleError (404 / 403: the file is gone or no longer ours). */
export async function writeSpreadsheet(token: string, id: string, list: readonly TableReply[], content: unknown, now: Date = new Date()): Promise<void> {
  const base = `${GOOGLE_ENDPOINTS.sheets}/${encodeURIComponent(id)}`;
  const meta = await sheetsCall<{ sheets?: SheetMeta[] }>(
    token,
    `${base}?fields=${encodeURIComponent('sheets(properties(sheetId,title,gridProperties),bandedRanges(bandedRangeId),merges)')}`,
    'GET',
  );
  await sheetsCall(token, `${base}:batchUpdate`, 'POST', { requests: syncRequests(list, content, now, meta.sheets ?? [], await sheetTranslator(content)) });
}
