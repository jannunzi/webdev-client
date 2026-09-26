/**
 * Create Clerk accounts for students who never registered.
 *
 * Not part of `next build`. Run it by hand:
 *
 *   npx tsx scripts/provision-accounts.ts students.csv
 *   npx tsx scripts/provision-accounts.ts --dry-run students.csv
 *   npx tsx scripts/provision-accounts.ts --provisioned 2026-09-fa26 --out provision-results.json students.csv
 *
 * CSV header (required): email, firstName, lastName, nuid, section
 *
 *   email,firstName,lastName,nuid,section
 *   ada.lovelace@northeastern.edu,Ada,Lovelace,001234567,CS5610-09
 *
 * Requires CLERK_SECRET_KEY in the environment or in .env.local.
 * Each new user gets emailAddress: [email], password set to the 9-digit NUID,
 * skipPasswordChecks: true, and publicMetadata
 * { mustChangePassword: true, provisioned, section }.
 * Emails that already exist in Clerk are skipped.
 * --dry-run looks up existing users and does not call createUser.
 *
 * Writes a results JSON. Never prints the secret key. Passwords are written
 * only as a mask of the same length (no digits).
 */
import { createClerkClient } from "@clerk/backend";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  DEFAULT_PROVISIONED_TAG,
  maskSecret,
  parseProvisionCsv,
  provisionPublicMetadata,
  provisionResultStatus,
  scrubSecrets,
  type ProvisionResultStatus,
} from "../lib/auth/provision-accounts";

type ResultRow = {
  email: string;
  status: ProvisionResultStatus;
  userId?: string;
  section?: string;
  passwordMasked?: string;
  message?: string;
};

function loadEnvLocal(): void {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv: string[]): {
  dryRun: boolean;
  filePath: string;
  provisioned: string;
  outPath: string;
} {
  let dryRun = false;
  let provisioned = DEFAULT_PROVISIONED_TAG;
  let outPath = resolve(process.cwd(), "provision-results.json");
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--provisioned") {
      const value = argv[i + 1];
      if (!value) throw new Error("--provisioned needs a value, for example 2026-09-fa26.");
      provisioned = value;
      i += 1;
      continue;
    }
    if (arg === "--out") {
      const value = argv[i + 1];
      if (!value) throw new Error("--out needs a file path.");
      outPath = resolve(process.cwd(), value);
      i += 1;
      continue;
    }
    if (arg.startsWith("-")) {
      throw new Error(`Unknown option ${arg}.`);
    }
    positional.push(arg);
  }
  const filePath = positional[0];
  if (!filePath || positional.length !== 1) {
    throw new Error(
      "Usage: npx tsx scripts/provision-accounts.ts [--dry-run] [--provisioned 2026-09-fa26] [--out provision-results.json] <students.csv>",
    );
  }
  return { dryRun, filePath: resolve(process.cwd(), filePath), provisioned, outPath };
}

function clerkErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "errors" in error) {
    const errors = (error as { errors?: { code?: string; message?: string; longMessage?: string }[] })
      .errors;
    if (Array.isArray(errors) && errors.length > 0) {
      return errors
        .map((item) => item.longMessage || item.message || item.code || "error")
        .join("; ");
    }
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function alreadyExists(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("errors" in error)) return false;
  const errors = (error as { errors?: { code?: string; message?: string }[] }).errors;
  if (!Array.isArray(errors)) return false;
  return errors.some((item) => {
    const code = item.code ?? "";
    const message = item.message ?? "";
    return (
      code === "form_identifier_exists" ||
      /already exists|that email address is taken/i.test(message)
    );
  });
}

async function main(): Promise<void> {
  loadEnvLocal();
  const { dryRun, filePath, provisioned, outPath } = parseArgs(process.argv.slice(2));
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const secretKey = process.env.CLERK_SECRET_KEY?.trim() ?? "";
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is required. Set it in .env.local or the shell.");
  }

  const parsed = parseProvisionCsv(readFileSync(filePath, "utf8"));
  const results: ResultRow[] = parsed.errors.map((error) => ({
    email: "",
    status: "error",
    message: error.message,
  }));

  const clerk = createClerkClient({ secretKey });
  for (const row of parsed.rows) {
    const secrets = [secretKey, row.nuid];
    const passwordMasked = maskSecret(row.nuid);
    try {
      const existing = await clerk.users.getUserList({
        emailAddress: [row.email],
        limit: 10,
      });
      const found = existing.data.length > 0;
      const status = provisionResultStatus({ existing: found, dryRun });
      if (status === "skipped") {
        results.push({
          email: row.email,
          status,
          userId: existing.data[0]?.id,
          section: row.section,
          message: "Email already exists in Clerk.",
        });
        console.log(`[skip] ${row.email} already exists`);
        continue;
      }
      if (status === "dry-run") {
        results.push({
          email: row.email,
          status,
          section: row.section,
          passwordMasked,
        });
        console.log(`[dry-run] would create ${row.email} (password ${passwordMasked})`);
        continue;
      }
      const user = await clerk.users.createUser({
        emailAddress: [row.email],
        firstName: row.firstName,
        lastName: row.lastName,
        password: row.nuid,
        skipPasswordChecks: true,
        publicMetadata: provisionPublicMetadata({
          provisioned,
          section: row.section,
        }),
      });
      results.push({
        email: row.email,
        status: "created",
        userId: user.id,
        section: row.section,
        passwordMasked,
      });
      console.log(`[created] ${row.email} ${user.id} (password ${passwordMasked})`);
    } catch (error) {
      if (alreadyExists(error)) {
        results.push({
          email: row.email,
          status: "skipped",
          section: row.section,
          message: "Email already exists in Clerk.",
        });
        console.log(`[skip] ${row.email} already exists`);
        continue;
      }
      const message = scrubSecrets(clerkErrorMessage(error), secrets);
      results.push({
        email: row.email,
        status: "error",
        section: row.section,
        passwordMasked,
        message,
      });
      console.error(`[error] ${row.email} ${message}`);
    }
  }

  const payload = {
    dryRun,
    provisioned,
    writtenAt: new Date().toISOString(),
    results,
  };
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  const created = results.filter((row) => row.status === "created").length;
  const skipped = results.filter((row) => row.status === "skipped").length;
  const planned = results.filter((row) => row.status === "dry-run").length;
  const failed = results.filter((row) => row.status === "error").length;
  console.log(
    `Wrote ${outPath}. created=${created} skipped=${skipped} dry-run=${planned} error=${failed}`,
  );
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  const secret = process.env.CLERK_SECRET_KEY?.trim() ?? "";
  const message = scrubSecrets(error instanceof Error ? error.message : String(error), [secret]);
  console.error(message);
  process.exitCode = 1;
});
