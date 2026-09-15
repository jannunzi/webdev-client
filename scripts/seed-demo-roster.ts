/**
 * Upsert staff-test canvas_roster rows:
 *   Ada Lovelace — ada@ada.com — CS4550 CRN 11464
 *   Bob Marley — bob@bob.com — CS4550 CRN 11464
 *
 * Usage:
 *   npm run roster:seed-demo
 *
 * Loads `.env.local` if present. Requires MONGODB_URI. Safe to re-run.
 * Does not replace the real Canvas roster.
 *
 * Atlas / Vercel: run this locally against the same MONGODB_URI used in
 * Production (or click “Ensure demo students” on /people while signed in
 * as staff). The app does not write these rows at deploy time.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";
import { mongoDbName } from "../lib/config";
import { upsertDemoRosterStudents } from "../lib/roster/ensure-demo";
import type { CanvasRosterEntry } from "../lib/roster/types";

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

async function main(): Promise<void> {
  loadEnvLocal();
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is required. Set it in .env.local or the shell.");
  }

  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db(mongoDbName());
    const collection = db.collection<CanvasRosterEntry>("canvas_roster");
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex(
      { canvasUserId: 1 },
      { unique: true, sparse: true },
    );
    const result = await upsertDemoRosterStudents(collection);
    const count = await collection.countDocuments();
    console.log(
      `Upserted ${result.upserts} demo roster row(s) (${result.emails.join(", ")}). canvas_roster now has ${count} document(s).`,
    );
    console.log(
      "Sign up / Sign in on the course site with ada@ada.com or bob@bob.com to exercise A1 URL submit.",
    );
  } finally {
    await client.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
