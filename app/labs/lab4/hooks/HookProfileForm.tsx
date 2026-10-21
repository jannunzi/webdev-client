"use client";

import useProfileForm from "./useProfileForm";
import ProfileFields from "../profile/ProfileFields";
import ProfileAlert from "../profile/ProfileAlert";

export default function HookProfileForm() {
  const { profile, errors, submitted, update, save } = useProfileForm();
  return (
    <form id="wd-hook-profile-form" onSubmit={save} noValidate>
      <h3>useProfileForm</h3>
      <ProfileAlert id="wd-hook-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-hook-profile" profile={profile} errors={errors} update={update} />
      <button id="wd-hook-profile-save" type="submit" className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-white">
        Save
      </button>
    </form>
  );
}
