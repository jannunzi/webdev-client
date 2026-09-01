export type LabTodo = {
  id: string;
  title: string;
};

let todos: LabTodo[] = [
  { id: "1", title: "Learn HTTP" },
  { id: "2", title: "Write a Route Handler" },
  { id: "3", title: "Run a separate Express process" },
];

export function getTodos(): LabTodo[] {
  return todos;
}

export function getTodo(id: string): LabTodo | undefined {
  return todos.find((todo) => todo.id === id);
}

export function addTodo(title: string): LabTodo {
  const todo = { id: crypto.randomUUID(), title };
  todos = [...todos, todo];
  return todo;
}

export function updateTodo(
  id: string,
  title: string,
): LabTodo | undefined {
  const existing = getTodo(id);
  if (!existing) return undefined;
  const updated = { ...existing, title };
  todos = todos.map((todo) => (todo.id === id ? updated : todo));
  return updated;
}

export function deleteTodo(id: string): LabTodo | undefined {
  const existing = getTodo(id);
  if (!existing) return undefined;
  todos = todos.filter((todo) => todo.id !== id);
  return existing;
}
