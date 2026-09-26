"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export type ClearMustChangePasswordResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Clears `mustChangePassword` for the signed-in user only.
 * The user id comes from the session, never from the client.
 */
export async function clearMustChangePassword(): Promise<ClearMustChangePasswordResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "You need to be signed in to change your password." };
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        mustChangePassword: false,
        passwordChangedAt: new Date().toISOString(),
      },
    });
    return { ok: true };
  } catch (error) {
    console.error("clear mustChangePassword failed", error instanceof Error ? error.message : "error");
    return {
      ok: false,
      message: "Your password was updated, but we could not finish. Try again.",
    };
  }
}
