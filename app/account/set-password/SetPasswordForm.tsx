"use client";

import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearMustChangePassword } from "./actions";
import PasswordChangeFields from "./PasswordChangeFields";

export default function SetPasswordForm({ redirectTo }: { redirectTo: string }) {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  async function onAccepted(input: { currentPassword: string; newPassword: string }) {
    if (!isLoaded) {
      throw new Error("Still loading your account. Try again in a moment.");
    }
    if (!user) {
      throw new Error("You need to be signed in to change your password.");
    }
    if (!passwordUpdated) {
      await user.updatePassword({
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        signOutOfOtherSessions: false,
      });
      setPasswordUpdated(true);
    }
    const cleared = await clearMustChangePassword();
    if (!cleared.ok) {
      throw new Error(cleared.message);
    }
    try {
      await user.reload();
      await getToken({ skipCache: true });
    } catch {
      // The proxy reads publicMetadata with getUser(), not the cached JWT.
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <PasswordChangeFields
      onAccepted={onAccepted}
      footer={
        <SignOutButton redirectUrl="/sign-in">
          <button type="button" className="text-neutral-700 underline">
            Sign out
          </button>
        </SignOutButton>
      }
    />
  );
}
