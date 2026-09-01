"use server";

import { addTodo, getTodos, type LabTodo } from "@/app/api/lab5/todos/store";

export async function addTodoAction(formData: FormData): Promise<LabTodo[]> {
  const title = String(formData.get("title") ?? "").trim();
  if (title) addTodo(title);
  return getTodos();
}
