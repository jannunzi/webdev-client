/**
 * Import Canvas student emails into MongoDB Atlas (`canvas_roster`).
 *
 * Usage:
 *   npx tsx scripts/import-canvas-roster.ts path/to/roster.csv
 *   npx tsx scripts/import-canvas-roster.ts --replace path/to/roster.json
 *
 * Loads `.env.local` if present. Requires MONGODB_URI.
 *
 * Accepted CSV headers (Canvas People / gradebook exports):
 *   Email, SIS Login ID, ID (Canvas user id), SIS User ID, Student/Name, Section
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";
import { mongoDbName } from "../lib/config";
import { rosterEntriesFromCsv, rosterEntriesFromJson } from "../lib/roster/csv";
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

function parseArgs(argv: string[]): { replace: boolean; filePath: string } {
  const replace = argv.includes("--replace");
  const filePath = argv.find((arg) => arg !== "--replace" && !arg.startsWith("-"));
  if (!filePath) {
    throw new Error(
      "Usage: npx tsx scripts/import-canvas-roster.ts [--replace] <roster.csv|roster.json>",
    );
  }
  return { replace, filePath: resolve(process.cwd(), filePath) };
}

async function main(): Promise<void> {
  loadEnvLocal();
  const { replace, filePath } = parseArgs(process.argv.slice(2));
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is required. Set it in .env.local or the shell.");
  }

  const text = readFileSync(filePath, "utf8");
  const entries: CanvasRosterEntry[] = filePath.endsWith(".json")
    ? rosterEntriesFromJson(text)
    : rosterEntriesFromCsv(text);

  if (entries.length === 0) {
    throw new Error("No student emails found. Check the CSV/JSON headers.");
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
    await db.collection("quiz_attempts").createIndex({
      clerkUserId: 1,
      quizId: 1,
      submittedAt: -1,
    });

    if (replace) {
      await collection.deleteMany({});
    }

    const importedAt = new Date();
    let upserts = 0;
    for (const entry of entries) {
      await collection.updateOne(
        { email: entry.email },
        { $set: { ...entry, importedAt } },
        { upsert: true },
      );
      upserts += 1;
    }

    const count = await collection.countDocuments();
    console.log(
      `Imported ${upserts} roster row(s)${replace ? " (replaced collection)" : ""}. canvas_roster now has ${count} document(s).`,
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
