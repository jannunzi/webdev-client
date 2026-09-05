"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getStaffAccess } from "./staff-access";
import { VIEW_MODE_COOKIE, viewModeCookieUpdate } from "./view-mode";

function cookieSecure(): boolean {
  return (
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
  );
}

export async function setStaffViewMode(formData: FormData): Promise<void> {
  const access = await getStaffAccess();
  const update = viewModeCookieUpdate({
    isActualStaff: access === "ok",
    requested: String(formData.get("mode") ?? ""),
  });

  if ("rejected" in update) {
    return;
  }

  const store = await cookies();
  if ("delete" in update) {
    store.delete(VIEW_MODE_COOKIE);
  } else {
    store.set(VIEW_MODE_COOKIE, update.set, {
      httpOnly: true,
      sameSite: "lax",
      secure: cookieSecure(),
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  revalidatePath("/", "layout");
}
