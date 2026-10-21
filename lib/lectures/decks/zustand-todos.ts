import type { LectureSlide } from "../types";

export const ZUSTAND_TODOS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Zustand Todo List",
      "§4.5.2 · array CRUD without passing props",
    ],
  },
  {
    id: "purpose",
    title: "The list the form and item share",
    kind: "content",
    bullets: [
      "A todos array, a draft `todo`, and add / update / delete",
      "Form and item call the store hook themselves — no prop chain",
      "Same shape Kambaz will use for courses and modules",
    ],
  },
  {
    id: "store-intro",
    title: "Seed, then copy on write",
    kind: "content",
    bullets: [
      "`addTodo` spreads the list and assigns `crypto.randomUUID()`",
      "`deleteTodo` filters by `id`. `updateTodo` maps the matching row",
      "Both add and update reset the draft to `emptyTodo`",
    ],
  },
  {
    id: "store",
    title: "Seed, then copy on write (code)",
    kind: "content",
    code: `const emptyTodo: Todo = { id: "-1", title: "Learn Zustand", done: false };

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [
    { id: "1", title: "Learn HTML", done: true },
    { id: "2", title: "Learn CSS", done: true },
    { id: "3", title: "Learn JavaScript", done: false },
  ],
  todo: emptyTodo,
  setTodo: (todo) => set({ todo }),
  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, { ...todo, id: crypto.randomUUID() }],
      todo: emptyTodo,
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
      todo: emptyTodo,
    })),
}));`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/todoStore.ts",
    codeHighlightLines: [[11, 15], [16, 19], [20, 24]],
  },
  {
    id: "form-intro",
    title: "The form binds the draft",
    kind: "content",
    bullets: [
      "`value={todo.title}` and `setTodo({ ...todo, title })` — §4.2.8 again",
      "Add and Update call store functions, not a parent callback",
    ],
  },
  {
    id: "form",
    title: "The form binds the draft (code)",
    kind: "content",
    code: `const todo = useTodoStore((state) => state.todo);
const setTodo = useTodoStore((state) => state.setTodo);
const addTodo = useTodoStore((state) => state.addTodo);
const updateTodo = useTodoStore((state) => state.updateTodo);

<input
  value={todo.title}
  onChange={(e) => setTodo({ ...todo, title: e.target.value })}
  id="wd-zustand-todo-title"
/>
<button type="button" onClick={() => addTodo(todo)}>Add</button>
<button type="button" onClick={() => updateTodo(todo)}>Update</button>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/ZustandTodoForm.tsx",
    codeHighlightLines: [[1, 4], [6, 12]],
  },
  {
    id: "list",
    title: "The list maps store todos",
    kind: "content",
    code: `"use client";

import { useTodoStore } from "./todoStore";
import ZustandTodoForm from "./ZustandTodoForm";
import ZustandTodoItem from "./ZustandTodoItem";

export default function ZustandTodoList() {
  const todos = useTodoStore((state) => state.todos);
  return (
    <div id="wd-zustand-todo-list">
      <h3>Zustand Todo List</h3>
      <ZustandTodoForm />
      <ul className="m-0 max-w-lg list-none p-0">
        {todos.map((todo) => (
          <ZustandTodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/ZustandTodoList.tsx",
    codeHighlightLines: [8, 14, 15, 16],
  },
  {
    id: "list-live",
    title: "ZustandTodoList: live demo",
    kind: "demo",
    bullets: [
      "`ZustandTodoItem` receives the row, then calls `setTodo` / `deleteTodo`",
      "Edit copies the row into the draft. Delete filters it out",
      "Add `ZustandTodoList` to `ZustandExamples` and try all four buttons",
    ],
    embed: "zustand-todos",
  },
  {
    id: "profile-store-intro",
    title: "The profile form with Zustand",
    kind: "content",
    bullets: [
      "`profile.ts`, `ProfileFields`, and `ProfileAlert` do not change",
      "The store holds `profile`, `errors`, and `submitted` next to `update` and `save`",
      "Both pass `set` a function of the current state, so `save` checks the latest profile",
    ],
  },
  {
    id: "profile-store",
    title: "profileStore (code)",
    kind: "content",
    code: `"use client";

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
}));`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab4/zustand/profileStore.ts",
  },
  {
    id: "zustand-profile-form-intro",
    title: "Selectors, and no provider",
    kind: "content",
    bullets: [
      "`ZustandProfileForm` needs no provider",
      "Each `useProfileStore` call passes a selector that picks one value",
      "The store is module-level, so the profile survives leaving the screen",
    ],
  },
  {
    id: "zustand-profile-form",
    title: "ZustandProfileForm (code)",
    kind: "content",
    code: `"use client";

import type { FormEvent } from "react";
import { useProfileStore } from "./profileStore";
import ProfileFields from "../profile/ProfileFields";
import ProfileAlert from "../profile/ProfileAlert";

export default function ZustandProfileForm() {
  const profile = useProfileStore((state) => state.profile);
  const errors = useProfileStore((state) => state.errors);
  const submitted = useProfileStore((state) => state.submitted);
  const update = useProfileStore((state) => state.update);
  const save = useProfileStore((state) => state.save);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    save();
  };
  return (
    <form id="wd-zustand-profile-form" onSubmit={onSubmit} noValidate>
      <h2>Profile (Zustand)</h2>
      <ProfileAlert id="wd-zustand-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-zustand-profile" profile={profile} errors={errors} update={update} />
      <button id="wd-zustand-profile-save" type="submit" className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-white">
        Save
      </button>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </form>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/ZustandProfileForm.tsx",
  },
  {
    id: "zustand-profile-form-live",
    title: "Zustand profile form: live demo",
    kind: "demo",
    bullets: [
      "Save the empty form, then fix the fields",
      "Compare with the other two versions side by side at `/labs/lab4/profile-form`",
    ],
    embed: "zustand-profile-form",
  },
  {
    id: "recap",
    title: "Zustand todos recap",
    kind: "content",
    bullets: [
      "Store holds the array and the draft. Screens only select",
      "Add copies + new id. Update maps. Delete filters",
      "Kambaz `coursesStore` is this file with course fields",
    ],
  },
  {
    id: "next-up",
    title: "Next: useEffect",
    kind: "title",
    bullets: [
      "Render computes JSX. Effects run after React paints",
      "§4.7: `document.title` from `name` and `count`",
    ],
  },
];
