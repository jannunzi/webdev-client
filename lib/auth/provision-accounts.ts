/**
 * Pure helpers for `scripts/provision-accounts.ts`.
 * The script is not imported by the Next.js app and is not part of the build.
 */

export const DEFAULT_PROVISIONED_TAG = "2026-09-fa26";

export type ProvisionCsvRow = {
  line: number;
  email: string;
  firstName: string;
  lastName: string;
  nuid: string;
  section: string;
};

export type ProvisionCsvError = {
  line: number;
  message: string;
};

const HEADER_ALIASES: Record<string, keyof Omit<ProvisionCsvRow, "line">> = {
  email: "email",
  "e-mail": "email",
  emailaddress: "email",
  "email address": "email",
  firstname: "firstName",
  "first name": "firstName",
  first: "firstName",
  lastname: "lastName",
  "last name": "lastName",
  last: "lastName",
  nuid: "nuid",
  "student id": "nuid",
  section: "section",
};

/** Mask a password or other secret. Same length, no characters retained. */
export function maskSecret(value: string): string {
  return "*".repeat(value.length);
}

/** Replace known secrets in a message before it is printed or written. */
export function scrubSecrets(message: string, secrets: string[]): string {
  let out = message;
  const unique = [...new Set(secrets.filter((secret) => secret.length >= 4))];
  unique.sort((a, b) => b.length - a.length);
  for (const secret of unique) {
    out = out.split(secret).join(maskSecret(secret));
  }
  return out;
}

function parseCsvRow(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        current += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === ",") {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

export function parseProvisionCsv(text: string): {
  rows: ProvisionCsvRow[];
  errors: ProvisionCsvError[];
} {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  const rows: ProvisionCsvRow[] = [];
  const errors: ProvisionCsvError[] = [];
  let header: (keyof Omit<ProvisionCsvRow, "line"> | null)[] | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index] ?? "";
    const lineNumber = index + 1;
    if (!raw.trim()) continue;
    const cells = parseCsvRow(raw);
    if (!header) {
      header = cells.map((cell) => HEADER_ALIASES[cell.trim().toLowerCase()] ?? null);
      const fields = new Set(header.filter((field) => field !== null));
      const missing = (["email", "firstName", "lastName", "nuid", "section"] as const).filter(
        (field) => !fields.has(field),
      );
      if (missing.length > 0) {
        errors.push({
          line: lineNumber,
          message: `CSV header must include email, firstName, lastName, nuid, and section. Missing: ${missing.join(", ")}.`,
        });
        return { rows, errors };
      }
      continue;
    }

    const record: Omit<ProvisionCsvRow, "line"> = {
      email: "",
      firstName: "",
      lastName: "",
      nuid: "",
      section: "",
    };
    header.forEach((field, cellIndex) => {
      if (!field) return;
      record[field] = cells[cellIndex]?.trim() ?? "";
    });
    const email = record.email.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ line: lineNumber, message: `Invalid email "${record.email}".` });
      continue;
    }
    if (!record.firstName || !record.lastName) {
      errors.push({ line: lineNumber, message: `Missing first or last name for ${email}.` });
      continue;
    }
    if (!/^\d{9}$/.test(record.nuid)) {
      errors.push({
        line: lineNumber,
        message: `NUID for ${email} must be exactly 9 digits.`,
      });
      continue;
    }
    rows.push({
      line: lineNumber,
      email,
      firstName: record.firstName,
      lastName: record.lastName,
      nuid: record.nuid,
      section: record.section,
    });
  }

  if (!header) {
    errors.push({ line: 1, message: "CSV is empty." });
  }
  return { rows, errors };
}

export function provisionPublicMetadata(input: {
  provisioned: string;
  section: string;
}): {
  mustChangePassword: true;
  provisioned: string;
  section?: string;
} {
  const section = input.section.trim();
  return {
    mustChangePassword: true,
    provisioned: input.provisioned,
    ...(section ? { section } : {}),
  };
}

export type ProvisionResultStatus = "created" | "skipped" | "dry-run" | "error";

export function provisionResultStatus(input: {
  existing: boolean;
  dryRun: boolean;
}): Exclude<ProvisionResultStatus, "error"> {
  if (input.existing) return "skipped";
  if (input.dryRun) return "dry-run";
  return "created";
}
