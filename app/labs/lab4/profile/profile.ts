export type Role = "" | "STUDENT" | "TA" | "FACULTY";
export type Theme = "light" | "dark";

export type Profile = {
  firstName: string;
  lastName: string;
  password: string;
  dob: Date | null;
  role: Role;
  newsletter: boolean;
  topics: string[];
  theme: Theme;
};

export type ProfileErrors = {
  firstName?: string;
  lastName?: string;
  password?: string;
  dob?: string;
  role?: string;
  newsletter?: string;
  topics?: string;
  theme?: string;
};

export const TOPICS = ["HTML", "CSS", "React"];

export const emptyProfile: Profile = {
  firstName: "",
  lastName: "",
  password: "",
  dob: null,
  role: "",
  newsletter: false,
  topics: [],
  theme: "light",
};

export function dateToHtml(date: Date | null) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function htmlToDate(text: string) {
  if (!text) return null;
  const [year, month, day] = text.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function validateProfile(profile: Profile) {
  const errors: ProfileErrors = {};
  if (profile.firstName.trim() === "") {
    errors.firstName = "First name is required.";
  }
  if (profile.lastName.trim() === "") {
    errors.lastName = "Last name is required.";
  }
  if (profile.password.length < 8) {
    errors.password = "Password needs at least 8 characters.";
  }
  if (!profile.dob || profile.dob > new Date()) {
    errors.dob = "Pick a date of birth in the past.";
  }
  if (profile.role === "") {
    errors.role = "Choose a role.";
  }
  if (profile.topics.length === 0) {
    errors.topics = "Pick at least one topic.";
  }
  return errors;
}
