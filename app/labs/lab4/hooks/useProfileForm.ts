import { useState, type FormEvent } from "react";
import {
  emptyProfile,
  validateProfile,
  type Profile,
  type ProfileChanges,
  type ProfileErrors,
} from "../profile/profile";

export default function useProfileForm() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (changes: ProfileChanges) =>
    setProfile({ ...profile, ...changes });
  const save = (e: FormEvent) => {
    e.preventDefault();
    setErrors(validateProfile(profile));
    setSubmitted(true);
  };
  return { profile, errors, submitted, update, save };
}
