import { createContext, useContext, useState, type ReactNode } from "react";
import { emptyProfile, validateProfile, type Profile, type ProfileChanges, type ProfileErrors } from "../profile/profile";

type ProfileContextValue = {
  profile: Profile;
  errors: ProfileErrors;
  submitted: boolean;
  update: (changes: ProfileChanges) => void;
  save: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (changes: ProfileChanges) =>
    setProfile({ ...profile, ...changes });
  const save = () => {
    setErrors(validateProfile(profile));
    setSubmitted(true);
  };
  return (
    <ProfileContext.Provider value={{ profile, errors, submitted, update, save }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const value = useContext(ProfileContext);
  if (!value) {
    throw new Error("useProfileContext must be used inside ProfileProvider");
  }
  return value;
}
