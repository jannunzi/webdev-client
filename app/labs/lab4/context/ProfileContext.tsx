import { createContext, useContext, useState, type ReactNode } from "react";
import { emptyProfile, type Profile } from "../profile/profile";

type ProfileContextValue = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
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
