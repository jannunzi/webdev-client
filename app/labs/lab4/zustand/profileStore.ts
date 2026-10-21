import { create } from "zustand";
import { emptyProfile, type Profile } from "../profile/profile";

type ProfileStore = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: emptyProfile,
  setProfile: (profile) => set({ profile }),
}));
