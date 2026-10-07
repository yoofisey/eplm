import "server-only";

// ---------- File parsing (CSV / XLSX / DOCX) ----------

export type ParsedFile = { headers: string[]; rows: string[][]; text?: string };

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseCsv(text: string): ParsedFile {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field.trim());
    field = "";
  };
  const pushRow = () => {
    pushField();
    if (row.some((c) => c !== "")) rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      pushField();
    } else if (ch === "\n") {
      pushRow();
    } else if (ch === "\r") {
      // ignore; handled with \n
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length) pushRow();

  return toParsed(rows);
}

function splitDelimitedLine(line: string): string[] {
  const cells = line.includes("\t")
    ? line.split("\t")
    : line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
  return cells.map((c) => c.trim());
}

function toParsed(rows: string[][]): ParsedFile {
  const cleaned = rows.filter((r) => r.some((c) => String(c).trim() !== ""));
  const headers = (cleaned.shift() ?? []).map((h) => String(h).trim());
  return { headers, rows: cleaned };
}

async function parseXlsx(buf: ArrayBuffer): Promise<ParsedFile> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);
  const ws = wb.worksheets[0];
  if (!ws) return { headers: [], rows: [] };

  const grid: string[][] = [];
  ws.eachRow({ includeEmpty: false }, (r) => {
    const cells: string[] = [];
    const count = Math.max(r.cellCount, 1);
    for (let c = 1; c <= count; c++) {
      const cell = r.getCell(c);
      let v: unknown = cell.value;
      if (v && typeof v === "object" && v !== null) {
        if ("result" in (v as Record<string, unknown>)) {
          v = (v as { result: unknown }).result;
        } else if ("text" in (v as Record<string, unknown>)) {
          v = (v as { text: unknown }).text;
        } else if (v instanceof Date) {
          v = v.toISOString();
        } else if ("richText" in (v as Record<string, unknown>)) {
          v = (v as { richText: { text: string }[] }).richText
            .map((t) => t.text)
            .join("");
        }
      }
      if (v === null || v === undefined) cells.push("");
      else if (v instanceof Date) cells.push(v.toISOString());
      else cells.push(String(v).trim());
    }
    grid.push(cells);
  });
  return toParsed(grid);
}

async function parseDocx(buf: ArrayBuffer): Promise<ParsedFile> {
  const mammoth = await import("mammoth");
  const plainText = async () => {
    const t = await mammoth.extractRawText({ buffer: Buffer.from(buf) });
    return t.value.trim();
  };

  // Prefer real Word tables if present.
  const htmlResult = await mammoth.convertToHtml({ buffer: Buffer.from(buf) });
  const tableMatches = htmlResult.value.match(/<table[\s\S]*?<\/table>/gi);
  if (tableMatches && tableMatches.length > 0) {
    const grid: string[][] = [];
    for (const table of tableMatches) {
      const rowMatches = table.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
      for (const rowHtml of rowMatches) {
        const cellMatches = rowHtml.match(/<(td|th)[\s\S]*?<\/\1>/gi) ?? [];
        const cells = cellMatches.map((cell) =>
          decodeEntities(stripTags(cell)).trim(),
        );
        if (cells.some((c) => c !== "")) grid.push(cells);
      }
    }
    if (grid.length) return { ...toParsed(grid), text: await plainText() };
  }

  // Fall back to text lines (tab/comma separated).
  const text = await plainText();
  const grid = text
    .split(/\r?\n/)
    .map(splitDelimitedLine)
    .filter((r) => r.some((c) => c !== ""));
  return { ...toParsed(grid), text };
}

export async function parseImportFile(file: File): Promise<ParsedFile> {
  const name = (file.name || "").toLowerCase();
  const buf = await file.arrayBuffer();

  if (name.endsWith(".xlsx") || name.endsWith(".xlsm") || file.type.includes("spreadsheet")) {
    return parseXlsx(buf);
  }
  if (name.endsWith(".docx") || file.type.includes("wordprocessing")) {
    return parseDocx(buf);
  }
  // Default: treat as delimited text (csv/tsv/txt).
  return parseCsv(new TextDecoder().decode(buf));
}

// ---------- Header matching ----------

function normalizeHeader(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export type FieldSpec = {
  field: string;
  label: string;
  aliases: string[];
  required?: boolean;
};

export type ImportTarget = "members" | "donations" | "events" | "attendance";

export type FieldMapping = Record<string, number>; // dbField -> column index

export function mapHeaders(headers: string[], specs: FieldSpec[]): FieldMapping {
  const normalized = headers.map(normalizeHeader);
  const mapping: FieldMapping = {};
  const used = new Set<number>();

  for (const spec of specs) {
    const wanted = [spec.field, ...spec.aliases].map(normalizeHeader);
    let idx = normalized.findIndex(
      (h, i) => !used.has(i) && h !== "" && wanted.includes(h),
    );
    if (idx === -1) {
      // loose: header contains the field name (e.g. "donor name full")
      idx = normalized.findIndex(
        (h, i) => !used.has(i) && h !== "" && wanted.some((w) => w.length >= 4 && h.includes(w)),
      );
    }
    if (idx !== -1) {
      mapping[spec.field] = idx;
      used.add(idx);
    }
  }
  return mapping;
}

// ---------- Value normalization ----------

export function toCents(input: string): number | null {
  if (!input) return null;
  const cleaned = input.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  if (!cleaned || cleaned === "-") return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export function toDate(input: string): string | null {
  if (!input) return null;
  const s = input.trim();

  // ISO already
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);

  // Excel serial date (days since 1899-12-30)
  if (/^\d+(\.\d+)?$/.test(s)) {
    const serial = Number(s);
    if (serial > 20000 && serial < 60000) {
      const d = new Date(Date.UTC(1899, 11, 30) + serial * 86400000);
      return d.toISOString().slice(0, 10);
    }
  }

  // d/m/y or m/d/y or d-m-y
  const dmy = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (dmy) {
    const [, a, b, rawYear] = dmy;
    const y = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    let day = Number(a);
    let month = Number(b);
    // If first part > 12, it must be a day; else assume day-first (Ghana).
    if (day <= 12 && month <= 12) {
      // ambiguous: treat as day/month/year (common in Ghana)
    } else if (day > 12 && month <= 12) {
      // already day/month
    } else {
      [day, month] = [month, day];
    }
    return `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return null;
}

export function toTime(input: string): string | null {
  if (!input) return null;
  const s = input.trim();

  const ampm = s.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)$/i);
  if (ampm) {
    let h = Number(ampm[1]);
    const m = ampm[2] ?? "00";
    const isPm = /p/i.test(ampm[3]);
    if (isPm && h < 12) h += 12;
    if (!isPm && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${m}`;
  }

  const hm = s.match(/^(\d{1,2})[:.](\d{2})/);
  if (hm) return `${String(Number(hm[1])).padStart(2, "0")}:${hm[2]}`;

  // Excel time fraction of a day
  if (/^\d+(\.\d+)?$/.test(s)) {
    const frac = Number(s);
    if (frac > 0 && frac < 1) {
      const totalMin = Math.round(frac * 24 * 60);
      const h = Math.floor(totalMin / 60) % 24;
      const m = totalMin % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
  }
  return null;
}

export function toBool(input: string): boolean | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  if (/^(y|yes|true|present|attended|p|1|x)$/.test(s)) return true;
  if (/^(n|no|false|absent|excused|a|0|-)$/.test(s)) return false;
  return null;
}

export function cleanText(input: string | undefined): string {
  return (input ?? "").trim();
}