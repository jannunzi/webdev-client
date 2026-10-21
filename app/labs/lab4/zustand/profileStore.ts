import { create } from "zustand";
import { emptyProfile, validateProfile, type Profile, type ProfileErrors } from "../profile/profile";

type ProfileStore = {
  profile: Profile;
  errors: ProfileErrors;
  submitted: boolean;
  update: (changes: Partial<Profile>) => void;
  save: () => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: emptyProfile,
  errors: {},
  submitted: false,
  update: (changes) =>
    set((state) => ({ profile: { ...state.profile, ...changes } })),
  save: () =>
    set((state) => ({ errors: validateProfile(state.profile), submitted: true })),
}));
