"use client";

import { useState, type FormEvent } from "react";
import { emptyProfile, validateProfile, type Profile, type ProfileErrors } from "./profile";
import ProfileFields from "./ProfileFields";
import ProfileAlert from "./ProfileAlert";

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (changes: Partial<Profile>) =>
    setProfile({ ...profile, ...changes });
  const save = (e: FormEvent) => {
    e.preventDefault();
    setErrors(validateProfile(profile));
    setSubmitted(true);
  };
  return (
    <form id="wd-profile-form" onSubmit={save} noValidate>
      <h2>Profile</h2>
      <ProfileAlert id="wd-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-profile" profile={profile} errors={errors} update={update} />
      <button id="wd-profile-save" type="submit" className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-white">
        Save
      </button>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </form>
  );
}
