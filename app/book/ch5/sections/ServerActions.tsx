import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import ServerActionDemo from "@/app/labs/lab5/intermediates/5-6-1-ServerAction";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function ServerActions() {
  return (
    <Section
      id="sec-5-6"
      title="5.6 Server Actions versus Route Handlers"
    >
      <p>
        Next.js also offers{" "}
        <OfficialLink href="https://nextjs.org/docs/app/getting-started/mutating-data">
          Server Actions
        </OfficialLink>
        : functions marked <code>&quot;use server&quot;</code>{" "}that a
        Client Component can call as if they were local. A{" "}
        <code>&lt;form action={"{fn}"}&gt;</code>{" "}posts the fields
        without you writing <code>fetch</code>. That is convenient for
        a form that only this app submits. It is not a public HTTP API.
        There is no URL a mobile client, a test script, or another
        origin can <code>POST</code>{" "}to. Route Handlers{" "}
        <em>are</em>{" "}that URL contract — the same{" "}
        <code>/api/courses</code>{" "}you will later put MongoDB behind,
        and that any client can call.
      </p>
      <p>
        This course uses Route Handlers for Kambaz. The next few lines
        exist so you can recognize a Server Action when you see one,
        not so you rewrite Dashboard with them. Create{" "}
        <code>app/labs/lab5/actions.ts</code>:
      </p>
      <CodeBlock
        language="ts"
        name="actions"
        file="app/labs/lab5/actions.ts"
      >{`"use server";

import { addTodo, getTodos, type LabTodo } from "@/app/api/lab5/todos/store";

export async function addTodoAction(formData: FormData): Promise<LabTodo[]> {
  const title = String(formData.get("title") ?? "").trim();
  if (title) addTodo(title);
  return getTodos();
}`}</CodeBlock>
      <p>
        The file starts with <code>&quot;use server&quot;</code>{" "}—
        every export is a Server Action.{" "}
        <code>FormData</code>{" "}is what the browser sends from a form.
        The action mutates the same store the Route Handler uses, then
        returns the list. A small client form calls it:
      </p>
      <CodeBlock
        language="tsx"
        name="ServerActionDemo"
        file="app/labs/lab5/intermediates/5-6-1-ServerAction.tsx"
      >{`"use client";

import { useState } from "react";
import { addTodoAction } from "../actions";

type Todo = { id: string; title: string };

export default function ServerActionDemo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  async function onSubmit(formData: FormData) {
    const next = await addTodoAction(formData);
    setTodos(next);
  }
  return (
    <div id="wd-lab5-server-action">
      <h4>Server Action — add a todo</h4>
      <form action={onSubmit}>
        <input
          name="title"
          id="wd-lab5-action-title"
          className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
          placeholder="Title"
        />
        <button
          type="submit"
          id="wd-lab5-action-submit"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          Add via Server Action
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
}`}</CodeBlock>
      <p>
        No <code>fetch</code>, no <code>JSON.stringify</code>, no
        <code>/api</code>{" "}URL. The tradeoff is exactly that: nothing
        outside this form can reuse the mutation. Prefer Route
        Handlers for Kambaz. Use this demo only to feel the difference:
      </p>
      <LiveDemo
        name="ServerActionDemo"
        file="app/labs/lab5/intermediates/5-6-1-ServerAction.tsx"
        mode="styled"
      >
        <ServerActionDemo />
      </LiveDemo>
      <OnYourOwn>
        After a submit, confirm{" "}
        <code>/api/lab5/todos</code>{" "}lists the new title — the action
        and the Route Handler share the store.
      </OnYourOwn>
      <WithAI
        prompt={`In app/labs/lab5/intermediates/5-6-1-ServerAction.tsx, keep the form action={onSubmit}. After the ul, add a sample paragraph This form did not call fetch. Do not change addTodoAction.`}
      >
        Ask the assistant to add a sample caption under the list:
      </WithAI>
      <p>
        The checklist in <SectionLink to="5.7" />{" "}asks you to keep the
        Server Action as a contrast, not as the Kambaz API.
      </p>
    </Section>
  );
}
