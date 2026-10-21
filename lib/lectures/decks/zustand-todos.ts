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
    code: `import { create } from "zustand";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type TodoStore = {
  todos: Todo[];
  todo: Todo;
  setTodo: (todo: Todo) => void;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
};

const emptyTodo: Todo = { id: "-1", title: "Learn Zustand", done: false };

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
    codeHighlightLines: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
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
    code: `import { useTodoStore } from "./todoStore";

export default function ZustandTodoForm() {
  const todo = useTodoStore((state) => state.todo);
  const setTodo = useTodoStore((state) => state.setTodo);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  return (
    <div id="wd-zustand-todo-form" className="mb-3 flex flex-wrap gap-2">
      <input
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        id="wd-zustand-todo-title"
      />
      <button
        type="button"
        onClick={() => addTodo(todo)}
        id="wd-zustand-add-todo-click"
        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Add
      </button>
      <button
        type="button"
        onClick={() => updateTodo(todo)}
        id="wd-zustand-update-todo-click"
        className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
      >
        Update
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/ZustandTodoForm.tsx",
    codeHighlightLines: [4, 5, 6, 7, 10, 12, 13, 14, 15],
  },
  {
    id: "item-intro",
    title: "Each item deletes and edits itself",
    kind: "content",
    bullets: [
      "`ZustandTodoItem` receives one `todo` as a prop",
      "It selects `deleteTodo` and `setTodo` from the store",
      "Delete removes the row. Edit copies the todo into the form",
    ],
  },
  {
    id: "item",
    title: "Each item deletes and edits itself (code)",
    kind: "content",
    code: `import { useTodoStore, type Todo } from "./todoStore";

export default function ZustandTodoItem({ todo }: { todo: Todo }) {
  const setTodo = useTodoStore((state) => state.setTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  return (
    <li
      id={\`wd-zustand-todo-\${todo.id}\`}
      className="mb-1 flex items-center justify-between rounded border border-neutral-200 px-3 py-1"
    >
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={todo.done} readOnly />
        <span className={todo.done ? "line-through" : undefined}>{todo.title}</span>
      </label>
      <span className="flex gap-2">
        <button
          type="button"
          onClick={() => setTodo(todo)}
          className="rounded bg-yellow-400 px-2 py-0.5 text-sm"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteTodo(todo.id)}
          className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
        >
          Delete
        </button>
      </span>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/ZustandTodoItem.tsx",
  },
  {
    id: "list",
    title: "The list maps store todos",
    kind: "content",
    code: `import { useTodoStore } from "./todoStore";
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
    codeHighlightLines: [6, 12, 13, 14],
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
      "The store holds the same `profile`/`setProfile` pair",
      "`setProfile` passes `set` the new profile",
    ],
  },
  {
    id: "profile-store",
    title: "profileStore (code)",
    kind: "content",
    code: `import { create } from "zustand";
import { emptyProfile, type Profile } from "../profile/profile";

type ProfileStore = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: emptyProfile,
  setProfile: (profile) => set({ profile }),
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

import { useState, type FormEvent } from "react";
import { useProfileStore } from "./profileStore";
import { validateProfile, type ProfileErrors } from "../profile/profile";
import ProfileFields from "../profile/ProfileFields";
import ProfileAlert from "../profile/ProfileAlert";

export default function ZustandProfileForm() {
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const save = (e: FormEvent) => {
    e.preventDefault();
    setErrors(validateProfile(profile));
    setSubmitted(true);
  };
  return (
    <form id="wd-zustand-profile-form" onSubmit={save} noValidate>
      <h2>Profile (Zustand)</h2>
      <ProfileAlert id="wd-zustand-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-zustand-profile" profile={profile} errors={errors} setProfile={setProfile} />
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
