"use server";

import { isMongoConfigured } from "@/lib/config";
import { upsertDemoRosterStudents } from "@/lib/roster/ensure-demo";
import { getRosterCollection } from "@/lib/roster/lookup";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export type EnsureDemoStudentsResult =
  | { ok: true; upserts: number; emails: string[] }
  | { ok: false; message: string };

/**
 * Staff-only write of the Ada / Bob canvas_roster test rows.
 * Impersonation cannot persist. Atlas must be reachable.
 */
export async function ensureDemoStudents(): Promise<EnsureDemoStudentsResult> {
  if (!(await isActualStaff()) || (await isImpersonatingStudent())) {
    return { ok: false, message: "This action is for course staff only." };
  }
  if (!isMongoConfigured()) {
    return {
      ok: false,
      message:
        "MongoDB Atlas is not configured. Set MONGODB_URI on Vercel (Production) or run npm run roster:seed-demo locally.",
    };
  }

  try {
    const collection = await getRosterCollection();
    const result = await upsertDemoRosterStudents(collection);
    return { ok: true, upserts: result.upserts, emails: result.emails };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not write the demo roster rows.";
    console.error("ensure demo students failed", error);
    return { ok: false, message };
  }
}
