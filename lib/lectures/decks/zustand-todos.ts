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
    id: "store",
    title: "Seed, then copy on write",
    kind: "content",
    bullets: [
      "`addTodo` spreads the list and assigns `crypto.randomUUID()`",
      "`deleteTodo` filters by `id`. `updateTodo` maps the matching row",
      "Both add and update reset the draft to `emptyTodo`",
    ],
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
    id: "form",
    title: "The form binds the draft",
    kind: "content",
    bullets: [
      "`value={todo.title}` and `setTodo({ ...todo, title })` — §4.2.8 again",
      "Add and Update call store functions, not a parent callback",
    ],
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
    kind: "demo",
    bullets: [
      "`ZustandTodoItem` receives the row, then calls `setTodo` / `deleteTodo`",
      "Edit copies the row into the draft. Delete filters it out",
      "Add `ZustandTodoList` to `ZustandExamples` and try all four buttons",
    ],
    code: `export default function ZustandTodoList() {
  const todos = useTodoStore((state) => state.todos);
  return (
    <div id="wd-zustand-todo-list">
      <h3>Zustand Todo List</h3>
      <ZustandTodoForm />
      <ul>
        {todos.map((todo) => (
          <ZustandTodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/ZustandTodoList.tsx",
    codeHighlightLines: [2, [8, 10]],
    embed: "zustand-todos",
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
