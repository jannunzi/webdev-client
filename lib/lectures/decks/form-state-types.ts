import type { LectureSlide } from "../types";

export const FORM_STATE_TYPES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Form State Types",
      "§4.2.5–4.2.9 · boolean through array, same hook",
    ],
  },
  {
    id: "purpose",
    title: "Bind the field to the value",
    kind: "content",
    bullets: [
      "A controlled field has `value` (or `checked`) plus `onChange`",
      "The UI and the data stay in sync because they share one source",
      "Objects and arrays must be copied — never mutate the previous state",
    ],
  },
  {
    id: "boolean",
    title: "Boolean: checked and a ternary",
    kind: "content",
    code: `"use client";

import { useState } from "react";

export default function BooleanStateVariables() {
  const [done, setDone] = useState(true);
  return (
    <div id="wd-boolean-state-variables">
      <h2>Boolean State Variables</h2>
      <p>{done ? "Done" : "Not done"}</p>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={done}
          onChange={() => setDone(!done)}
          id="wd-boolean-checkbox"
        />
        Done
      </label>
      {done && <div className="mt-2 rounded bg-yellow-100 p-2">Yay! Done</div>}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/BooleanStateVariables.tsx",
    codeHighlightLines: [6, 12, 13, 14, 15, 16, 17],
  },
  {
    id: "boolean-live",
    title: "Boolean: live demo",
    kind: "demo",
    bullets: [
      "`useState(true)` seeds Done. The checkbox writes `!done`",
      "`{done ? \"Done\" : \"Not done\"}` and `{done && <div>Yay!</div>}`",
      "Use `checked={done}`, not `value`, on a checkbox",
    ],
    embed: "boolean-state",
  },
  {
    id: "string",
    title: "String: value and onChange",
    kind: "content",
    code: `"use client";

import { useState } from "react";

export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");
  return (
    <div id="wd-string-state-variables">
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <input
        className="w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        id="wd-first-name"
      />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/StringStateVariables.tsx",
    codeHighlightLines: [6, 11, 13, 14, 15],
  },
  {
    id: "string-live",
    title: "String: live demo",
    kind: "demo",
    bullets: [
      "`value={firstName}` shows the current string",
      "`onChange={(e) => setFirstName(e.target.value)}` writes each keystroke",
      "Without `value`, the field is uncontrolled and React cannot reset it",
    ],
    embed: "string-state",
  },
  {
    id: "date-intro",
    title: "Date: format for type=date",
    kind: "demo",
    bullets: [
      "`useState(new Date(2026, 0, 15, 10, 30))` — year, month, day, hour, minute. Months start at 0",
      "`type=\"date\"` wants `YYYY-MM-DD` — helper `dateObjectToHtmlDateString`",
      "`htmlDateStringToDate` reads the picker as a local date, so the day you pick stays that day",
    ],
  },
  {
    id: "date",
    title: "Date: format for type=date (code)",
    kind: "demo",
    code: `"use client";

import { useState } from "react";

function dateObjectToHtmlDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`\${year}-\${month}-\${day}\`;
}

function htmlDateStringToDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0);
}

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date(2026, 0, 15, 10, 30));
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{startDate.toDateString()}</h3>
      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <input
        type="date"
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(htmlDateStringToDate(e.target.value))}
        id="wd-start-date"
      />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/DateStateVariable.tsx",
    codeHighlightLines: [[5, 15], 18, 28],
  },
  {
    id: "date-live",
    title: "Date: live demo",
    kind: "demo",
    embed: "date-state",
  },
  {
    id: "object-intro",
    title: "Object: spread, then overwrite",
    kind: "demo",
    bullets: [
      "`setPerson({ ...person, name: e.target.value })` copies, then writes one key",
      "Do not do `person.name = …` — that mutates and React may skip the paint",
      "`parseInt` on age; `|| 0` keeps the field a number if the box is empty",
    ],
  },
  {
    id: "object",
    title: "Object: spread, then overwrite (code)",
    kind: "demo",
    code: `"use client";

import { useState } from "react";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });
  return (
    <div id="wd-object-state-variables">
      <h2>Object State Variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <input
        className="mb-2 block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
        id="wd-person-name"
      />
      <input
        type="number"
        className="block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.age}
        onChange={(e) =>
          setPerson({ ...person, age: parseInt(e.target.value) || 0 })
        }
        id="wd-person-age"
      />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ObjectStateVariable.tsx",
    codeHighlightLines: [6, 14, 21, 22],
  },
  {
    id: "object-live",
    title: "Object: spread, then overwrite: live demo",
    kind: "demo",
    embed: "object-state",
  },
  {
    id: "array-intro",
    title: "Array: copy, then add or filter",
    kind: "demo",
    bullets: [
      "`setArray([...array, Math.floor(Math.random() * 100)])` appends a copy",
      "`filter((_item, i) => i !== index)` drops one index without mutate",
      "Each `li` needs a `key`. Delete wraps `deleteElement(index)` in an arrow",
    ],
  },
  {
    id: "array",
    title: "Add and delete copy the array",
    kind: "demo",
    code: `"use client";

import { useState } from "react";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((_item, i) => i !== index));
  };`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ArrayStateVariable.tsx",
    codeHighlightLines: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "array-part-2",
    title: "Render the list with delete buttons",
    kind: "content",
    code: `  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button
        type="button"
        onClick={addElement}
        id="wd-add-element-click"
        className="mb-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Add Element
      </button>
      <ul className="m-0 max-w-xs list-none p-0">
        {array.map((item, index) => (
          <li
            key={\`\${item}-\${index}\`}
            className="mb-1 flex items-center justify-between rounded border border-neutral-200 bg-green-50 px-3 py-1"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => deleteElement(index)}
              id={\`wd-delete-element-\${index}-click\`}
              className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ArrayStateVariable.tsx",
    codeStartLine: 13,
    codeHighlightLines: [13, 18, 25, 26, 27, 28],
  },
  {
    id: "array-live",
    title: "Array: copy, then add or filter: live demo",
    kind: "demo",
    embed: "array-state",
  },
  {
    id: "profile-intro",
    title: "A profile form mixes every type",
    kind: "content",
    bullets: [
      "One `Profile` object: strings, a date, a role, a boolean, an array, and a theme",
      "Validation checks every field on Save. Errors show under each field",
      "An alert banner counts the fields to fix, or says the profile saved",
    ],
  },
  {
    id: "profile-types-intro",
    title: "Step 1: the data and the rules",
    kind: "content",
    bullets: [
      "`Role` is a union type: one of the listed strings, or `\"\"` for not chosen",
      "`ProfileErrors` has one optional message per field",
      "`validateProfile` is a pure function with no React, so every form version reuses it",
    ],
  },
  {
    id: "profile-types",
    title: "profile.ts (code)",
    kind: "content",
    code: `export type Role = "" | "STUDENT" | "TA" | "FACULTY";
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
  return \`\${year}-\${month}-\${day}\`;
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
}`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab4/profile/profile.ts",
  },
  {
    id: "profile-fields-intro",
    title: "Step 2: the fields",
    kind: "content",
    bullets: [
      "Each input shows its value from `profile` and calls `setProfile` with a copy where one field changed",
      "`<select>` is a drop-down. Radios that share a `name` form one group",
      "`prefix` builds every `wd-*` id. `errors.x && <p>` shows a message only when there is one",
    ],
  },
  {
    id: "profile-fields",
    title: "ProfileFields imports and props",
    kind: "content",
    code: `import {
  dateToHtml,
  htmlToDate,
  TOPICS,
  type Profile,
  type ProfileErrors,
  type Role,
} from "./profile";

const input = "block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5";
const error = "text-sm text-red-600";

export default function ProfileFields({
  prefix,
  profile,
  errors,
  setProfile,
}: {
  prefix: string;
  profile: Profile;
  errors: ProfileErrors;
  setProfile: (profile: Profile) => void;
}) {
  const toggleTopic = (topic: string) =>
    setProfile({
      ...profile,
      topics: profile.topics.includes(topic)
        ? profile.topics.filter((t) => t !== topic)
        : [...profile.topics, topic],
    });`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/profile/ProfileFields.tsx",
  },
  {
    id: "profile-fields-part-2",
    title: "Inputs that show their errors",
    kind: "content",
    code: `  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={\`\${prefix}-first-name\`}>First name</label>
      <input
        id={\`\${prefix}-first-name\`}
        className={input}
        value={profile.firstName}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
      />
      {errors.firstName && <p className={error}>{errors.firstName}</p>}

      <label htmlFor={\`\${prefix}-last-name\`}>Last name</label>
      <input
        id={\`\${prefix}-last-name\`}
        className={input}
        value={profile.lastName}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
      />
      {errors.lastName && <p className={error}>{errors.lastName}</p>}

      <label htmlFor={\`\${prefix}-password\`}>Password</label>
      <input
        id={\`\${prefix}-password\`}
        type="password"
        className={input}
        value={profile.password}
        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
      />
      {errors.password && <p className={error}>{errors.password}</p>}

      <label htmlFor={\`\${prefix}-dob\`}>Date of birth</label>
      <input
        id={\`\${prefix}-dob\`}
        type="date"
        className={input}
        value={dateToHtml(profile.dob)}
        onChange={(e) => setProfile({ ...profile, dob: htmlToDate(e.target.value) })}
      />
      {errors.dob && <p className={error}>{errors.dob}</p>}

      <label htmlFor={\`\${prefix}-role\`}>Role</label>
      <select
        id={\`\${prefix}-role\`}
        className={input}
        value={profile.role}
        onChange={(e) => setProfile({ ...profile, role: e.target.value as Role })}
      >
        <option value="">Choose a role</option>
        <option value="STUDENT">Student</option>
        <option value="TA">Teaching assistant</option>
        <option value="FACULTY">Faculty</option>
      </select>
      {errors.role && <p className={error}>{errors.role}</p>}

      <label className="flex items-center gap-2">
        <input
          id={\`\${prefix}-newsletter\`}
          type="checkbox"
          checked={profile.newsletter}
          onChange={() => setProfile({ ...profile, newsletter: !profile.newsletter })}
        />
        Email me the newsletter
      </label>

      <fieldset id={\`\${prefix}-topics\`}>
        <legend>Topics</legend>
        {TOPICS.map((topic) => (
          <label key={topic} className="mr-4 inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={profile.topics.includes(topic)}
              onChange={() => toggleTopic(topic)}
            />
            {topic}
          </label>
        ))}
      </fieldset>
      {errors.topics && <p className={error}>{errors.topics}</p>}

      <fieldset id={\`\${prefix}-theme\`}>
        <legend>Theme</legend>
        <label className="mr-4 inline-flex items-center gap-1">
          <input
            type="radio"
            name={\`\${prefix}-theme\`}
            checked={profile.theme === "light"}
            onChange={() => setProfile({ ...profile, theme: "light" })}
          />
          Light
        </label>
        <label className="inline-flex items-center gap-1">
          <input
            type="radio"
            name={\`\${prefix}-theme\`}
            checked={profile.theme === "dark"}
            onChange={() => setProfile({ ...profile, theme: "dark" })}
          />
          Dark
        </label>
      </fieldset>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/profile/ProfileFields.tsx",
    codeStartLine: 31,
  },
  {
    id: "profile-alert-intro",
    title: "Step 3: the alert",
    kind: "content",
    bullets: [
      "Shows nothing until the form has been submitted",
      "As in §3.4.11, `Object.keys(errors).length` counts the fields with an error. Zero means saved",
      "`role=\"alert\"` is announced by screen readers. `role=\"status\"` is quieter",
    ],
  },
  {
    id: "profile-alert",
    title: "ProfileAlert (code)",
    kind: "content",
    code: `import type { ProfileErrors } from "./profile";

export default function ProfileAlert({
  id,
  submitted,
  errors,
}: {
  id: string;
  submitted: boolean;
  errors: ProfileErrors;
}) {
  if (!submitted) return null;
  const count = Object.keys(errors).length;
  if (count === 0) {
    return (
      <div id={id} role="status" className="mb-3 rounded bg-green-100 p-2 text-green-800">
        Profile saved.
      </div>
    );
  }
  return (
    <div id={id} role="alert" className="mb-3 rounded bg-red-100 p-2 text-red-800">
      Please fix {count} {count === 1 ? "field" : "fields"} below.
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/profile/ProfileAlert.tsx",
  },
  {
    id: "profile-form-intro",
    title: "Step 4: the form and its state",
    kind: "content",
    bullets: [
      "Three state variables: `profile`, `errors`, and `submitted`",
      "It passes `setProfile` straight to `ProfileFields`",
      "`save` calls `e.preventDefault()`. `noValidate` turns off the browser's own checks",
    ],
  },
  {
    id: "profile-form",
    title: "ProfileForm (code)",
    kind: "content",
    code: `"use client";

import { useState, type FormEvent } from "react";
import { emptyProfile, validateProfile, type Profile, type ProfileErrors } from "./profile";
import ProfileFields from "./ProfileFields";
import ProfileAlert from "./ProfileAlert";

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const save = (e: FormEvent) => {
    e.preventDefault();
    setErrors(validateProfile(profile));
    setSubmitted(true);
  };
  return (
    <form id="wd-profile-form" onSubmit={save} noValidate>
      <h2>Profile</h2>
      <ProfileAlert id="wd-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-profile" profile={profile} errors={errors} setProfile={setProfile} />
      <button id="wd-profile-save" type="submit" className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-white">
        Save
      </button>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </form>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/profile/ProfileForm.tsx",
  },
  {
    id: "profile-form-live",
    title: "Profile form: live demo",
    kind: "demo",
    bullets: [
      "Save the empty form: each field shows its message and the banner counts six",
      "Fill in fields and save again until the banner reports the profile saved",
      "The `<pre>` shows each input changing a different type in one object",
    ],
    embed: "profile-form",
  },
  {
    id: "recap",
    title: "Form state recap",
    kind: "content",
    bullets: [
      "Boolean → `checked`. Text and date → `value` + `onChange`",
      "Objects and arrays: spread or `filter` / `map`, never mutate",
      "Kambaz New Course will reuse the object-spread draft",
    ],
  },
  {
    id: "next-up",
    title: "Next: share state with a child",
    kind: "title",
    bullets: [
      "`useState` belongs to the component that calls it",
      "§4.3.1: lift the counter so a child can increment it",
    ],
  },
];
