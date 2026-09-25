import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { SET_PASSWORD_EXPLANATION } from "@/lib/auth/must-change-password";

const inputClass =
  "mt-1 block w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm";

function controlled(value: string | undefined, onChange?: (value: string) => void) {
  if (!onChange) return {};
  return {
    value: value ?? "",
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
  };
}

export default function PasswordChangeFormView({
  currentPassword,
  newPassword,
  confirmPassword,
  error,
  pending = false,
  disabled = false,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  footer,
}: {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string | null;
  pending?: boolean;
  disabled?: boolean;
  onCurrentPasswordChange?: (value: string) => void;
  onNewPasswordChange?: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12 font-sans text-neutral-900">
      <div
        id="wd-set-password"
        className="w-full max-w-md rounded-lg border border-neutral-200 bg-white px-6 py-6 shadow-sm"
      >
        <h1 className="m-0 text-xl font-semibold tracking-tight">Change your password</h1>
        <p className="mt-2 text-sm text-neutral-700">{SET_PASSWORD_EXPLANATION}</p>
        <form
          className="mt-4"
          onSubmit={onSubmit}
          aria-busy={pending}
          noValidate
        >
          <label className="mb-3 block text-sm font-medium" htmlFor="current-password">
            Current password
            <input
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              disabled={disabled || pending}
              {...controlled(currentPassword, onCurrentPasswordChange)}
              className={inputClass}
            />
          </label>
          <label className="mb-3 block text-sm font-medium" htmlFor="new-password">
            New password
            <input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              disabled={disabled || pending}
              {...controlled(newPassword, onNewPasswordChange)}
              className={inputClass}
            />
          </label>
          <p className="mb-3 mt-0 text-xs text-neutral-600">
            At least 8 characters. It cannot be your current password or your NUID.
          </p>
          <label className="mb-4 block text-sm font-medium" htmlFor="confirm-password">
            Confirm new password
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              disabled={disabled || pending}
              {...controlled(confirmPassword, onConfirmPasswordChange)}
              className={inputClass}
            />
          </label>
          {error ? (
            <p id="set-password-error" role="alert" className="mb-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={disabled || pending}
            className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
          >
            {pending ? "Updating password…" : "Update password"}
          </button>
        </form>
      </div>
      {footer ? <div className="mt-6 text-sm">{footer}</div> : null}
    </main>
  );
}
