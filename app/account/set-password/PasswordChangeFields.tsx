"use client";

import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  clerkPasswordErrorMessage,
  passwordChangeIssue,
  passwordChangeIssueMessage,
} from "@/lib/auth/must-change-password";
import PasswordChangeFormView from "./PasswordChangeFormView";

export default function PasswordChangeFields({
  footer,
  onAccepted,
}: {
  footer?: ReactNode;
  onAccepted?: (input: { currentPassword: string; newPassword: string }) => Promise<void>;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issue = passwordChangeIssue({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (issue) {
      setError(passwordChangeIssueMessage(issue));
      return;
    }
    if (!onAccepted) {
      setError("You need to be signed in to change your password.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await onAccepted({ currentPassword, newPassword });
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(clerkPasswordErrorMessage(err.errors));
      } else if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Could not update the password. Check the current password and try again.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <PasswordChangeFormView
      currentPassword={currentPassword}
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      error={error}
      pending={pending}
      onCurrentPasswordChange={setCurrentPassword}
      onNewPasswordChange={setNewPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onSubmit={onSubmit}
      footer={footer}
    />
  );
}
