import type { ReactNode } from "react";
import { isCurrentUserStaff } from "@/lib/roster/staff-access";

/** Renders children only for signed-in staff in instructor view. */
export default async function StaffOnly({ children }: { children: ReactNode }) {
  if (!(await isCurrentUserStaff())) return null;
  return children;
}
