import { DEMO_ROSTER_STUDENTS } from "./demo-students";
import { escapeRegex, normalizeEmail } from "./emails";
import type { CanvasRosterEntry } from "./types";

export type DemoRosterUpsertResult = {
  upserts: number;
  emails: string[];
};

type DemoRosterCollection = {
  findOne: (filter: Record<string, unknown>) => Promise<{ _id?: unknown } | null>;
  updateOne: (
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
  ) => Promise<unknown>;
  insertOne: (doc: CanvasRosterEntry) => Promise<unknown>;
};

/**
 * Upsert the Ada / Bob staff-test rows. Matches existing Atlas docs even
 * when the stored email still has Canvas casing.
 */
export async function upsertDemoRosterStudents(
  collection: DemoRosterCollection,
  now: Date = new Date(),
): Promise<DemoRosterUpsertResult> {
  const emails: string[] = [];
  let upserts = 0;

  for (const student of DEMO_ROSTER_STUDENTS) {
    const email = normalizeEmail(student.email);
    const existing = await collection.findOne({
      email: { $regex: `^\\s*${escapeRegex(email)}\\s*$`, $options: "i" },
    });
    const doc: CanvasRosterEntry = {
      ...student,
      email,
      importedAt: now,
      source: "demo",
    };
    if (existing?._id) {
      await collection.updateOne({ _id: existing._id }, { $set: doc });
    } else {
      await collection.insertOne(doc);
    }
    emails.push(email);
    upserts += 1;
  }

  return { upserts, emails };
}
