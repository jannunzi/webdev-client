import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/config";
import { collectClerkEmails } from "./emails";
import { staffAccessFromUser, type StaffAccessStatus } from "./instructors";

export type { StaffAccessStatus };

export async function getStaffAccess(): Promise<StaffAccessStatus> {
  if (!isClerkConfigured()) return "not_configured";
  const user = await currentUser();
  return staffAccessFromUser(true, Boolean(user), collectClerkEmails(user));
}

export async function isCurrentUserStaff(): Promise<boolean> {
  return (await getStaffAccess()) === "ok";
}
