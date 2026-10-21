"use client";

import type { ProfileErrors } from "./profile";

export default function ProfileAlert({
  id,
  submitted,
  errors,
}: {
  id: string;
  submitted: boolean;
  errors: ProfileErrors;
}) {
  if (!submitted) return null;
  const count = Object.keys(errors).length;
  if (count === 0) {
    return (
      <div id={id} role="status" className="mb-3 rounded bg-green-100 p-2 text-green-800">
        Profile saved.
      </div>
    );
  }
  return (
    <div id={id} role="alert" className="mb-3 rounded bg-red-100 p-2 text-red-800">
      Please fix {count} {count === 1 ? "field" : "fields"} below.
    </div>
  );
}
