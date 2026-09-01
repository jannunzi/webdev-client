import { getTodos } from "@/app/api/lab5/todos/store";

/**
 * Server Component that reads the same in-memory todos the Route
 * Handler returns. The chapter also shows the equivalent `fetch`
 * against /api/lab5/todos — both run on the server, before HTML
 * is sent.
 */
export default async function ServerFetch() {
  const todos = getTodos();
  return (
    <div id="wd-lab5-server-fetch">
      <h4>Server Component — todos</h4>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
