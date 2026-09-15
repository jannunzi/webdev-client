"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import {
  findStaffMember,
} from "@/app/syllabus/data/officeHours";
import { isOfficeHourQueueConfigured } from "@/lib/config";
import { queueJoinAccess, queueManageAccess, resolveQueueStaff } from "@/lib/office-hours/access";
import {
  closeSession,
  joinQueue,
  leaveQueue,
  markStudentDone,
  openSession,
  removeStudent,
  reorderWaiting,
  serveStudent,
  toQueueView,
  type QueueView,
} from "@/lib/office-hours/queue";
import {
  readOfficeHourQueue,
  writeOfficeHourQueue,
} from "@/lib/office-hours/queue-store";
import {
  canvasUserIdFromMetadata,
  collectClerkEmails,
  preferredRosterEmail,
} from "@/lib/roster/emails";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export type QueueActionResult =
  | { ok: true; view: QueueView }
  | { ok: false; code: string; message: string };

function messageFor(code: string): string {
  switch (code) {
    case "unauthenticated":
      return "Sign in with your Canvas email to join the line.";
    case "not_configured":
      return "The live line is not configured yet.";
    case "not_on_roster":
      return "Only students on the Canvas roster for this course can join the line.";
    case "roster_empty":
      return "The Canvas roster is empty, so the line cannot accept check-ins yet.";
    case "wrong_section":
      return "This line is for a different section. Switch to your section’s office hours.";
    case "no_queue":
      return "This staff member is Piazza-only and does not run a live line.";
    case "unknown_staff":
    case "unknown_section":
      return "That office-hour line was not found.";
    case "staff_cannot_join":
      return "Staff manage the line; they do not join it.";
    case "impersonating":
      return "Student view does not write to the live line.";
    case "session_closed":
      return "The TA has not opened the line yet.";
    case "already_in_line":
      return "You are already in this line.";
    case "not_in_line":
      return "You are not in this line.";
    case "unknown_entry":
    case "not_waiting":
      return "That student is no longer in the live line.";
    case "forbidden":
      return "Only course staff can manage the line.";
    default:
      return "Could not update the live line.";
  }
}

async function actor() {
  const configured = isOfficeHourQueueConfigured();
  const { userId, isAuthenticated } = await auth();
  const signedIn = Boolean(isAuthenticated && userId);
  const user = signedIn ? await currentUser() : null;
  const impersonating = signedIn ? await isImpersonatingStudent() : false;
  const staff = signedIn ? await isActualStaff() : false;
  const emails = collectClerkEmails(user);
  const canvasUserId = canvasUserIdFromMetadata(user);
  const roster = signedIn
    ? await lookupCanvasRoster({
        emails,
        canvasUserIds: canvasUserId ? [canvasUserId] : [],
        impersonating,
      })
    : { status: "not_configured" as const };
  return { configured, signedIn, user, impersonating, staff, emails, roster };
}

async function loadView(
  taId: string,
  sectionId: string,
  includeEmails: boolean,
  viewerEmail?: string,
): Promise<QueueActionResult> {
  const resolved = resolveQueueStaff(taId, sectionId);
  if (!resolved.ok) {
    return { ok: false, code: resolved.code, message: messageFor(resolved.code) };
  }
  const queue = await readOfficeHourQueue({
    taId: resolved.member.id,
    taEmail: resolved.member.email,
    section: sectionId,
  });
  return {
    ok: true,
    view: toQueueView(queue, { viewerEmail, includeEmails }),
  };
}

export async function readQueueAction(input: {
  taId: string;
  sectionId: string;
}): Promise<QueueActionResult> {
  const { staff, emails } = await actor();
  return loadView(input.taId, input.sectionId, staff, emails[0]);
}

export async function joinQueueAction(input: {
  taId: string;
  sectionId: string;
}): Promise<QueueActionResult> {
  const { configured, signedIn, user, impersonating, staff, roster } =
    await actor();
  const access = queueJoinAccess({
    signedIn,
    configured,
    isActualStaff: staff,
    impersonating,
    roster,
    sectionId: input.sectionId,
    taId: input.taId,
  });
  if (!access.ok) {
    return { ok: false, code: access.code, message: messageFor(access.code) };
  }
  const member = findStaffMember(input.taId);
  if (!member) {
    return { ok: false, code: "unknown_staff", message: messageFor("unknown_staff") };
  }
  const matched = roster.status === "matched" ? roster.entry : undefined;
  const email = preferredRosterEmail(user, matched?.email);
  if (!email) {
    return { ok: false, code: "not_on_roster", message: messageFor("not_on_roster") };
  }
  const queue = await readOfficeHourQueue({
    taId: member.id,
    taEmail: member.email,
    section: input.sectionId,
  });
  const result = joinQueue(queue, {
    studentEmail: email,
    displayName: matched?.name?.trim() || user?.fullName || email,
    id: crypto.randomUUID(),
    now: new Date().toISOString(),
  });
  if (!result.ok) {
    return { ok: false, code: result.code, message: messageFor(result.code) };
  }
  await writeOfficeHourQueue(result.queue);
  return {
    ok: true,
    view: toQueueView(result.queue, { viewerEmail: email }),
  };
}

export async function leaveQueueAction(input: {
  taId: string;
  sectionId: string;
}): Promise<QueueActionResult> {
  const { configured, signedIn, user, impersonating, staff, roster } =
    await actor();
  const access = queueJoinAccess({
    signedIn,
    configured,
    isActualStaff: staff,
    impersonating,
    roster,
    sectionId: input.sectionId,
    taId: input.taId,
  });
  if (!access.ok) {
    return { ok: false, code: access.code, message: messageFor(access.code) };
  }
  const member = findStaffMember(input.taId);
  if (!member) {
    return { ok: false, code: "unknown_staff", message: messageFor("unknown_staff") };
  }
  const matched = roster.status === "matched" ? roster.entry : undefined;
  const email = preferredRosterEmail(user, matched?.email);
  if (!email) {
    return { ok: false, code: "not_on_roster", message: messageFor("not_on_roster") };
  }
  const queue = await readOfficeHourQueue({
    taId: member.id,
    taEmail: member.email,
    section: input.sectionId,
  });
  const result = leaveQueue(queue, email, new Date().toISOString());
  if (!result.ok) {
    return { ok: false, code: result.code, message: messageFor(result.code) };
  }
  await writeOfficeHourQueue(result.queue);
  return {
    ok: true,
    view: toQueueView(result.queue, { viewerEmail: email }),
  };
}

async function staffMutate(
  input: { taId: string; sectionId: string },
  mutate: (
    queue: Awaited<ReturnType<typeof readOfficeHourQueue>>,
  ) => ReturnType<typeof openSession>,
): Promise<QueueActionResult> {
  const { configured, signedIn, impersonating, staff, emails } = await actor();
  const access = queueManageAccess({
    signedIn,
    configured,
    isActualStaff: staff,
    impersonating,
  });
  if (!access.ok) {
    return { ok: false, code: access.code, message: messageFor(access.code) };
  }
  const resolved = resolveQueueStaff(input.taId, input.sectionId);
  if (!resolved.ok) {
    return { ok: false, code: resolved.code, message: messageFor(resolved.code) };
  }
  const queue = await readOfficeHourQueue({
    taId: resolved.member.id,
    taEmail: resolved.member.email,
    section: input.sectionId,
  });
  const result = mutate(queue);
  if (!result.ok) {
    return { ok: false, code: result.code, message: messageFor(result.code) };
  }
  await writeOfficeHourQueue(result.queue);
  return {
    ok: true,
    view: toQueueView(result.queue, {
      includeEmails: true,
      viewerEmail: emails[0],
    }),
  };
}

export async function openQueueAction(input: {
  taId: string;
  sectionId: string;
}): Promise<QueueActionResult> {
  return staffMutate(input, (queue) => openSession(queue, new Date().toISOString()));
}

export async function closeQueueAction(input: {
  taId: string;
  sectionId: string;
}): Promise<QueueActionResult> {
  return staffMutate(input, (queue) => closeSession(queue, new Date().toISOString()));
}

export async function serveQueueAction(input: {
  taId: string;
  sectionId: string;
  entryId: string;
}): Promise<QueueActionResult> {
  return staffMutate(input, (queue) =>
    serveStudent(queue, input.entryId, new Date().toISOString()),
  );
}

export async function doneQueueAction(input: {
  taId: string;
  sectionId: string;
  entryId: string;
}): Promise<QueueActionResult> {
  return staffMutate(input, (queue) =>
    markStudentDone(queue, input.entryId, new Date().toISOString()),
  );
}

export async function removeQueueAction(input: {
  taId: string;
  sectionId: string;
  entryId: string;
}): Promise<QueueActionResult> {
  return staffMutate(input, (queue) =>
    removeStudent(queue, input.entryId, new Date().toISOString()),
  );
}

export async function reorderQueueAction(input: {
  taId: string;
  sectionId: string;
  entryId: string;
  direction: "up" | "down";
}): Promise<QueueActionResult> {
  return staffMutate(input, (queue) =>
    reorderWaiting(queue, input.entryId, input.direction, new Date().toISOString()),
  );
}
