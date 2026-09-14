import {
  findStaffMember,
  memberCoversSection,
  queueEnabledForMember,
} from "@/app/syllabus/data/officeHours";
import type { StaffMember } from "@/app/syllabus/data/types";
import type { RosterLookupResult } from "../roster/types";
import { isSyllabusSectionId, rosterMatchesSyllabusSection } from "./sections";

export type QueueJoinGate =
  | { ok: true }
  | {
      ok: false;
      code:
        | "unauthenticated"
        | "not_configured"
        | "not_on_roster"
        | "roster_empty"
        | "wrong_section"
        | "no_queue"
        | "unknown_staff"
        | "unknown_section"
        | "staff_cannot_join"
        | "impersonating";
    };

export type QueueManageGate =
  | { ok: true }
  | {
      ok: false;
      code: "unauthenticated" | "forbidden" | "impersonating" | "not_configured";
    };

export function resolveQueueStaff(
  taId: string,
  sectionId: string,
):
  | { ok: true; member: StaffMember }
  | { ok: false; code: "unknown_staff" | "unknown_section" | "no_queue" } {
  if (!isSyllabusSectionId(sectionId)) {
    return { ok: false, code: "unknown_section" };
  }
  const member = findStaffMember(taId);
  if (!member) return { ok: false, code: "unknown_staff" };
  if (!memberCoversSection(member, sectionId)) {
    return { ok: false, code: "unknown_staff" };
  }
  if (!queueEnabledForMember(member)) return { ok: false, code: "no_queue" };
  return { ok: true, member };
}

/**
 * Rostered students in this syllabus section may join.
 * Staff manage the line; they do not join as students here.
 */
export function queueJoinAccess(input: {
  signedIn: boolean;
  configured: boolean;
  isActualStaff: boolean;
  impersonating: boolean;
  roster: RosterLookupResult;
  sectionId: string;
  taId: string;
}): QueueJoinGate {
  const staff = resolveQueueStaff(input.taId, input.sectionId);
  if (!staff.ok) return staff;
  if (!input.configured) return { ok: false, code: "not_configured" };
  if (!input.signedIn) return { ok: false, code: "unauthenticated" };
  if (input.impersonating) return { ok: false, code: "impersonating" };
  if (input.isActualStaff) return { ok: false, code: "staff_cannot_join" };
  if (input.roster.status === "empty") return { ok: false, code: "roster_empty" };
  if (input.roster.status === "not_configured") {
    return { ok: false, code: "not_configured" };
  }
  if (input.roster.status !== "matched") {
    return { ok: false, code: "not_on_roster" };
  }
  if (!rosterMatchesSyllabusSection(input.roster.entry.section, input.sectionId)) {
    return { ok: false, code: "wrong_section" };
  }
  return { ok: true };
}

/** Instructors and TAs on the env allowlists. Impersonation cannot write. */
export function queueManageAccess(input: {
  signedIn: boolean;
  configured: boolean;
  isActualStaff: boolean;
  impersonating: boolean;
}): QueueManageGate {
  if (!input.configured) return { ok: false, code: "not_configured" };
  if (!input.signedIn) return { ok: false, code: "unauthenticated" };
  if (input.impersonating) return { ok: false, code: "impersonating" };
  if (!input.isActualStaff) return { ok: false, code: "forbidden" };
  return { ok: true };
}
