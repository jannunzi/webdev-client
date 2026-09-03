import { isLikelyEmail, normalizeEmail } from "./emails";
import type { CanvasRosterEntry } from "./types";

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const input = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // ignore
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((item) => item.some((cell) => cell.trim() !== ""));
}

function headerKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

const EMAIL_HEADERS = ["email", "sis_login_id", "login_id"];
const CANVAS_ID_HEADERS = ["id", "canvas_user_id", "canvas_id"];
const SIS_HEADERS = ["sis_user_id", "sis_id"];
const NAME_HEADERS = ["student", "name", "student_name"];
const SECTION_HEADERS = ["section", "section_name"];

function pick(record: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function rosterEntriesFromCsv(text: string): CanvasRosterEntry[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(headerKey);

  const entries: CanvasRosterEntry[] = [];
  const seen = new Set<string>();

  for (const cells of rows.slice(1)) {
    if (cells.some((cell) => /points possible/i.test(cell))) continue;
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });

    const rawEmail =
      pick(record, EMAIL_HEADERS.filter((key) => key === "email")) ??
      pick(record, EMAIL_HEADERS);
    const emailCandidate = rawEmail ? normalizeEmail(rawEmail) : "";
    const email = isLikelyEmail(emailCandidate) ? emailCandidate : "";
    if (!email || seen.has(email)) continue;
    seen.add(email);

    const canvasUserId = pick(record, CANVAS_ID_HEADERS);
    const sisUserId = pick(record, SIS_HEADERS);
    const name = pick(record, NAME_HEADERS);
    const section = pick(record, SECTION_HEADERS);

    entries.push({
      email,
      canvasUserId,
      sisUserId,
      name,
      section,
      source: "csv",
    });
  }

  return entries;
}

export function rosterEntriesFromJson(text: string): CanvasRosterEntry[] {
  const parsed = JSON.parse(text) as unknown;
  const rows = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray((parsed as { students?: unknown }).students)
      ? (parsed as { students: unknown[] }).students
      : [];

  const entries: CanvasRosterEntry[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const emailRaw = String(record.email ?? record.Email ?? "");
    const email = normalizeEmail(emailRaw);
    if (!isLikelyEmail(email) || seen.has(email)) continue;
    seen.add(email);
    entries.push({
      email,
      canvasUserId:
        typeof record.canvasUserId === "string"
          ? record.canvasUserId
          : typeof record.id === "string" || typeof record.id === "number"
            ? String(record.id)
            : undefined,
      sisUserId:
        typeof record.sisUserId === "string" ? record.sisUserId : undefined,
      name: typeof record.name === "string" ? record.name : undefined,
      section: typeof record.section === "string" ? record.section : undefined,
      source: "json",
    });
  }
  return entries;
}
