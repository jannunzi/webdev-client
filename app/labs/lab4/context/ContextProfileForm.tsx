"use client";

import type { FormEvent } from "react";
import { ProfileProvider, useProfileContext } from "./ProfileContext";
import ProfileFields from "../profile/ProfileFields";
import ProfileAlert from "../profile/ProfileAlert";

function ContextProfileFormBody() {
  const { profile, errors, submitted, update, save } = useProfileContext();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    save();
  };
  return (
    <form id="wd-context-profile-form" onSubmit={onSubmit} noValidate>
      <h2>Profile (React Context)</h2>
      <ProfileAlert id="wd-context-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-context-profile" profile={profile} errors={errors} update={update} />
      <button id="wd-context-profile-save" type="submit" className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-white">
        Save
      </button>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </form>
  );
}

export default function ContextProfileForm() {
  return (
    <ProfileProvider>
      <ContextProfileFormBody />
    </ProfileProvider>
  );
}
