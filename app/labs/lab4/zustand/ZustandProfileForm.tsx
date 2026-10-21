"use client";

import type { FormEvent } from "react";
import { useProfileStore } from "./profileStore";
import ProfileFields from "../profile/ProfileFields";
import ProfileAlert from "../profile/ProfileAlert";

export default function ZustandProfileForm() {
  const profile = useProfileStore((state) => state.profile);
  const errors = useProfileStore((state) => state.errors);
  const submitted = useProfileStore((state) => state.submitted);
  const update = useProfileStore((state) => state.update);
  const save = useProfileStore((state) => state.save);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    save();
  };
  return (
    <form id="wd-zustand-profile-form" onSubmit={onSubmit} noValidate>
      <h2>Profile (Zustand)</h2>
      <ProfileAlert id="wd-zustand-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-zustand-profile" profile={profile} errors={errors} update={update} />
      <button id="wd-zustand-profile-save" type="submit" className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-white">
        Save
      </button>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </form>
  );
}
