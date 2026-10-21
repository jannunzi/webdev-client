import type { LectureSlide } from "../types";

export const REACT_CONTEXT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · React Context",
      "§4.4 · a provider for a stable shared value",
    ],
  },
  {
    id: "purpose",
    title: "Skip the middle props",
    kind: "content",
    bullets: [
      "A parent publishes a value. Any descendant can read it",
      "Right tool: theme, signed-in user, current course id",
      "Wrong tool: a list every keystroke rewrites — every consumer re-renders",
      "Kambaz will use this pattern for who is signed in — not courses",
    ],
  },
  {
    id: "context-file-intro",
    title: "Context, provider, and a hook",
    kind: "content",
    bullets: [
      "`createContext` starts `null` so a missing wrap is detectable",
      "The provider holds `useState(7)` — same seed as §4.2.4",
      "`useCounterContext` throws if you forget the provider",
    ],
  },
  {
    id: "context-file",
    title: "Context, provider, and a hook (code)",
    kind: "content",
    code: `import { createContext, useContext, useState, type ReactNode } from "react";

type CounterContextValue = {
  count: number;
  setCount: (count: number) => void;
};

const CounterContext = createContext<CounterContextValue | null>(null);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(7);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounterContext() {
  const value = useContext(CounterContext);
  if (!value) {
    throw new Error("useCounterContext must be used inside CounterProvider");
  }
  return value;
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/CounterContext.tsx",
    codeHighlightLines: [8, [10, 16], [19, 25]],
  },
  {
    id: "reader",
    title: "The reader only reads count",
    kind: "content",
    bullets: [
      "Import `useCounterContext` from `./CounterContext`",
      "`const { count } = useCounterContext()` — no props",
      "Every reader inside the provider sees the same count",
    ],
    code: `import { useCounterContext } from "./CounterContext";

export default function ContextCounterRead() {
  const { count } = useCounterContext();
  return (
    <div id="wd-context-counter-read">
      <h3>Reader: {count}</h3>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/ContextCounterRead.tsx",
    codeHighlightLines: [1, 4, 6],
  },
  {
    id: "writer-intro",
    title: "The writer calls the setter",
    kind: "content",
    bullets: [
      "`const { count, setCount } = useCounterContext()`",
      "Up and Down are the same arrows as the `useState` counter",
      "On your own: a Context todo list — do not put Kambaz courses here",
    ],
  },
  {
    id: "writer",
    title: "The writer calls the setter (code)",
    kind: "content",
    code: `import { useCounterContext } from "./CounterContext";

export default function ContextCounterWrite() {
  const { count, setCount } = useCounterContext();
  return (
    <div id="wd-context-counter-write">
      <h3>Writer</h3>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        id="wd-context-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        id="wd-context-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/ContextCounterWrite.tsx",
    codeHighlightLines: [1, 4, 10, 18],
  },
  {
    id: "siblings",
    title: "Two siblings, no props between",
    kind: "content",
    code: `"use client";

import { CounterProvider } from "./CounterContext";
import ContextCounterRead from "./ContextCounterRead";
import ContextCounterWrite from "./ContextCounterWrite";

export default function ContextExamples() {
  return (
    <div id="wd-context-examples">
      <h2>React Context</h2>
      <p>
        Two siblings share one counter without the parent passing props
        through the middle.
      </p>
      <CounterProvider>
        <ContextCounterRead />
        <ContextCounterWrite />
      </CounterProvider>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/ContextExamples.tsx",
    codeAddedLines: [15, 16, 17, 18],
  },
  {
    id: "siblings-live",
    title: "ContextExamples: live demo",
    kind: "demo",
    bullets: [
      "`ContextCounterRead` only needs `count`",
      "`ContextCounterWrite` calls `setCount` — the reader updates",
      "Wrap both in `<CounterProvider>` on `ContextExamples`",
    ],
    embed: "context-counter",
  },
  {
    id: "profile-context-intro",
    title: "The profile form with Context",
    kind: "content",
    bullets: [
      "`profile.ts`, `ProfileFields`, and `ProfileAlert` stay exactly as they were",
      "`ProfileProvider` holds the same three `useState` variables plus `update` and `save`",
      "`useProfileContext` throws a clear error outside the provider",
    ],
  },
  {
    id: "profile-context",
    title: "ProfileContext (code)",
    kind: "content",
    code: `import { createContext, useContext, useState, type ReactNode } from "react";
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/ProfileContext.tsx",
  },
  {
    id: "context-profile-form-intro",
    title: "The body reads the context",
    kind: "content",
    bullets: [
      "A hook only sees providers above its component, so the body is separate",
      "`ContextProfileFormBody` reads everything from the context, not its own state",
      "Any component inside `ProfileProvider` can share the profile without props",
    ],
  },
  {
    id: "context-profile-form",
    title: "ContextProfileForm (code)",
    kind: "content",
    code: `"use client";

import { useState, type FormEvent } from "react";
import { ProfileProvider, useProfileContext } from "./ProfileContext";
import { validateProfile, type ProfileErrors } from "../profile/profile";
import ProfileFields from "../profile/ProfileFields";
import ProfileAlert from "../profile/ProfileAlert";

function ContextProfileFormBody() {
  const { profile, setProfile } = useProfileContext();
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const save = (e: FormEvent) => {
    e.preventDefault();
    setErrors(validateProfile(profile));
    setSubmitted(true);
  };
  return (
    <form id="wd-context-profile-form" onSubmit={save} noValidate>
      <h2>Profile (React Context)</h2>
      <ProfileAlert id="wd-context-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-context-profile" profile={profile} errors={errors} setProfile={setProfile} />
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/ContextProfileForm.tsx",
  },
  {
    id: "context-profile-form-live",
    title: "Context profile form: live demo",
    kind: "demo",
    bullets: [
      "Save the empty form, then fix the fields",
      "It behaves exactly like the `useState` version",
    ],
    embed: "context-profile-form",
  },
  {
    id: "recap",
    title: "Context recap",
    kind: "content",
    bullets: [
      "Provider + hook + throw if missing — that is the whole pattern",
      "Stable values only. Lists that change often belong in Zustand",
      "§4.10.5 wraps Kambaz in `AccountProvider` the same way",
    ],
  },
  {
    id: "next-up",
    title: "Next: Zustand",
    kind: "title",
    bullets: [
      "No provider. Import a hook. Select the fields you read",
      "§4.5.1: the same counter, then a todo list",
    ],
  },
];
