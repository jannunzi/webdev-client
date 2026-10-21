import type { LectureSlide } from "../types";

export const CUSTOM_HOOKS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Writing Your Own Hooks",
      "§4.7.1 · share stateful logic between components",
    ],
  },
  {
    id: "purpose",
    title: "A custom hook is a use function",
    kind: "content",
    bullets: [
      "A function whose name starts with `use` and that calls other hooks",
      "Several components share the same stateful logic without copying it",
      "Hook files end in `.ts`: they return data, not JSX, and run where their component runs",
    ],
  },
  {
    id: "window-size-intro",
    title: "Step 1: useWindowSize",
    kind: "content",
    bullets: [
      "The §3.6.3 window demo kept the size in `useState` and filled it from `useEffect`",
      "Moving that logic into `useWindowSize` makes it a hook",
      "It returns the size, or `null` until the browser has measured it",
    ],
  },
  {
    id: "window-size",
    title: "useWindowSize (code)",
    kind: "content",
    code: `import { useEffect, useState } from "react";

export type WindowSize = { width: number; height: number };

export default function useWindowSize() {
  const [size, setSize] = useState<WindowSize | null>(null);
  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    const first = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("resize", update);
    };
  }, []);
  return size;
}`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab4/hooks/useWindowSize.ts",
  },
  {
    id: "window-size-demo",
    title: "WindowSizeDemo (code)",
    kind: "content",
    code: `"use client";

import useWindowSize from "./useWindowSize";

export default function WindowSizeDemo() {
  const size = useWindowSize();
  return (
    <div id="wd-window-size-demo">
      <h3>useWindowSize</h3>
      {size ? (
        <p>
          Window size: {size.width} x {size.height}
        </p>
      ) : (
        <p>Loading window size...</p>
      )}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/hooks/WindowSizeDemo.tsx",
  },
  {
    id: "window-size-demo-live",
    title: "WindowSizeDemo: live demo",
    kind: "demo",
    bullets: [
      "One line of logic: ask the hook for the size",
      "No `window`, listeners, or cleanup in the component",
      "Resize the browser window and watch the numbers change",
    ],
    embed: "hooks-window-size",
  },
  {
    id: "toggle",
    title: "Step 2: useToggle",
    kind: "content",
    bullets: [
      "A custom hook does not need an effect",
      "It wraps a boolean `useState` with the function that flips it, and returns a pair",
      "`as const` makes the array a tuple: a boolean, then a function",
    ],
    code: `import { useState } from "react";

export default function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(!on);
  return [on, toggle] as const;
}`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab4/hooks/useToggle.ts",
  },
  {
    id: "toggle-demo",
    title: "ToggleDemo (code)",
    kind: "content",
    code: `"use client";

import useToggle from "./useToggle";

export default function ToggleDemo() {
  const [shown, toggleShown] = useToggle();
  return (
    <div id="wd-toggle-demo">
      <h3>useToggle</h3>
      <button
        type="button"
        onClick={toggleShown}
        id="wd-toggle-demo-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        {shown ? "Hide" : "Show"} details
      </button>
      {shown && <p>These details are visible because shown is true.</p>}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/hooks/ToggleDemo.tsx",
  },
  {
    id: "toggle-demo-live",
    title: "ToggleDemo: live demo",
    kind: "demo",
    bullets: [
      "Destructure the pair just like `useState`",
      "Click to flip the boolean",
    ],
    embed: "hooks-toggle",
  },
  {
    id: "local-storage-intro",
    title: "Step 3: useLocalStorage",
    kind: "content",
    bullets: [
      "`localStorage` is a per-site key-value store that survives a reload; it only stores strings",
      "`useLocalStorage(key, initial)` works like `useState`, but the setter also saves under `key`",
      "It reads storage only inside the effect, so server and browser HTML match. `<T>` is a type parameter",
    ],
  },
  {
    id: "local-storage",
    title: "useLocalStorage (code)",
    kind: "content",
    code: `import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const first = requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved) as T);
    });
    return () => cancelAnimationFrame(first);
  }, [key]);
  const save = (next: T) => {
    setValue(next);
    window.localStorage.setItem(key, JSON.stringify(next));
  };
  return [value, save] as const;
}`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab4/hooks/useLocalStorage.ts",
  },
  {
    id: "local-storage-demo",
    title: "LocalStorageDemo (code)",
    kind: "content",
    code: `"use client";

import useLocalStorage from "./useLocalStorage";

const TABS = ["Monday", "Tuesday", "Wednesday"];

export default function LocalStorageDemo() {
  const [tab, setTab] = useLocalStorage("wd-hooks-tab", TABS[0]);
  return (
    <div id="wd-local-storage-demo">
      <h3>useLocalStorage</h3>
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              t === tab
                ? "rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded border border-neutral-300 px-3 py-1.5 text-sm"
            }
          >
            {t}
          </button>
        ))}
      </div>
      <p>Selected: {tab}. Reload the page and it stays selected.</p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/hooks/LocalStorageDemo.tsx",
  },
  {
    id: "local-storage-demo-live",
    title: "LocalStorageDemo: live demo",
    kind: "demo",
    bullets: [
      "A page can remember a choice such as a selected tab",
      "Click a tab, reload the page, and the same tab is still selected",
    ],
    embed: "hooks-local-storage",
  },
  {
    id: "independent-intro",
    title: "Step 4: The rules of custom hooks",
    kind: "content",
    bullets: [
      "The name starts with `use`, so React and the linter check it is called at the top level",
      "A hook can call other hooks: `useWindowSize` calls `useState` and `useEffect`",
      "Each component that calls it gets its own state: a hook shares logic, not data",
    ],
  },
  {
    id: "independent",
    title: "IndependentToggles (code)",
    kind: "content",
    code: `"use client";

import useToggle from "./useToggle";

function Lamp({ label }: { label: string }) {
  const [on, toggle] = useToggle();
  return (
    <button
      type="button"
      onClick={toggle}
      className={
        on
          ? "rounded bg-yellow-300 px-3 py-1.5 text-sm"
          : "rounded bg-neutral-700 px-3 py-1.5 text-sm text-white"
      }
    >
      {label}: {on ? "on" : "off"}
    </button>
  );
}

export default function IndependentToggles() {
  return (
    <div id="wd-independent-toggles">
      <h3>Each caller gets its own state</h3>
      <div className="flex gap-2">
        <Lamp label="Kitchen" />
        <Lamp label="Porch" />
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/hooks/IndependentToggles.tsx",
  },
  {
    id: "independent-live",
    title: "IndependentToggles: live demo",
    kind: "demo",
    bullets: [
      "Two `Lamp` components each call `useToggle`",
      "Switching one does not switch the other",
    ],
    embed: "hooks-independent-toggles",
  },
  {
    id: "profile-hook-intro",
    title: "Step 5: useProfileForm",
    kind: "content",
    bullets: [
      "The §4.2.10 form kept three state variables, `update`, and a validating `save`",
      "`useProfileForm` holds all of that, so the form keeps only its JSX",
      "It returns an object, not a pair: five things read more clearly by name",
    ],
  },
  {
    id: "profile-hook",
    title: "useProfileForm (code)",
    kind: "content",
    code: `import { useState, type FormEvent } from "react";
import {
  emptyProfile,
  validateProfile,
  type Profile,
  type ProfileErrors,
} from "../profile/profile";

export default function useProfileForm() {
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
  return { profile, errors, submitted, update, save };
}`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab4/hooks/useProfileForm.ts",
  },
  {
    id: "profile-form",
    title: "HookProfileForm (code)",
    kind: "content",
    code: `"use client";

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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/hooks/HookProfileForm.tsx",
  },
  {
    id: "profile-form-live",
    title: "HookProfileForm: live demo",
    kind: "demo",
    bullets: [
      "Reuses `ProfileFields` and `ProfileAlert` from §4.2.10 unchanged",
      "Press Save with empty fields to see the same errors as before",
      "Each form that calls `useProfileForm` gets its own profile, unlike Context or a store",
    ],
    embed: "hooks-profile-form",
  },
  {
    id: "page-intro",
    title: "One page for every demo",
    kind: "content",
    bullets: [
      "`app/labs/lab4/hooks/page.tsx` imports and renders every demo",
      "It is a Server Component. Each demo it imports is a Client Component",
      "Open `/labs/lab4/hooks` to try them together",
    ],
  },
  {
    id: "page",
    title: "HooksPage (code)",
    kind: "content",
    code: `import WindowSizeDemo from "./WindowSizeDemo";
import ToggleDemo from "./ToggleDemo";
import LocalStorageDemo from "./LocalStorageDemo";
import IndependentToggles from "./IndependentToggles";
import HookProfileForm from "./HookProfileForm";

export default function HooksPage() {
  return (
    <div id="wd-lab4-hooks" className="flex flex-col gap-8 p-4">
      <h2>Writing Your Own Hooks</h2>
      <WindowSizeDemo />
      <ToggleDemo />
      <LocalStorageDemo />
      <IndependentToggles />
      <HookProfileForm />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/hooks/page.tsx",
  },
  {
    id: "recap",
    title: "Custom hooks recap",
    kind: "content",
    bullets: [
      "A custom hook is a `use` function that calls other hooks",
      "It shares logic, not data: each caller gets its own state",
      "Return a pair for two values, an object for more",
    ],
  },
  {
    id: "next-up",
    title: "Next: check your understanding",
    kind: "title",
    bullets: [
      "A 10-item self-check before stateful Kambaz",
      "§4.9: events, `useState`, Context, Zustand, `useEffect`",
    ],
  },
];
