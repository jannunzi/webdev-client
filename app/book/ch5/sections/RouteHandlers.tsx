import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import GetHandler from "@/app/labs/lab5/intermediates/5-3-1-GetHandler";
import QueryHandler from "@/app/labs/lab5/intermediates/5-3-2-QueryHandler";
import PathHandler from "@/app/labs/lab5/intermediates/5-3-3-PathHandler";
import PostHandler from "@/app/labs/lab5/intermediates/5-3-4-PostHandler";
import PutDelete from "@/app/labs/lab5/intermediates/5-3-5-PutDelete";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function RouteHandlers() {
  return (
    <Section id="sec-5-3" title="5.3 Route Handlers">
      <p>
        A{" "}
        <OfficialLink href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">
          Route Handler
        </OfficialLink>{" "}
        is a <code>route.ts</code>{" "}file in the App Router that exports
        functions named after HTTP methods. The file path{" "}
        <em>is</em>{" "}the URL:{" "}
        <code>app/api/lab5/hello/route.ts</code>{" "}serves{" "}
        <code>/api/lab5/hello</code>. This first server model does
        not use Express <code>app.get</code> — Next.js matches the
        method export to the incoming request and returns whatever{" "}
        <code>Response</code>{" "}you build. The Web{" "}
        <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/API/Request">
          Request
        </OfficialLink>{" "}
        and{" "}
        <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/API/Response">
          Response
        </OfficialLink>{" "}
        APIs are the same ones browsers use — not a Next-only wrapper
        you have to unlearn later.
      </p>
      <p>
        Those lab files are throwaway drills — one idea per handler.
        Kambaz, later in this chapter, is the application you keep. A
        coverage checklist is in <SectionLink to="5.9" />.
      </p>

      <Section
        level={3}
        id="sec-5-3-1"
        title="5.3.1 A GET Handler"
      >
        <p>
          Start with the smallest possible API: a{" "}
          <code>GET</code>{" "}that returns a JSON greeting. Create{" "}
          <code>app/api/lab5/hello/route.ts</code>:
        </p>
        <CodeBlock
          language="ts"
          name="hello"
          file="app/api/lab5/hello/route.ts"
        >{`export async function GET() {
  return Response.json({ message: "Hello World from Lab 5" });
}`}</CodeBlock>
        <p>
          <code>Response.json</code>{" "}sets the status to{" "}
          <code>200</code>{" "}and the content type to JSON. Visit{" "}
          <LocalUrl href="/api/lab5/hello" />{" "}in the browser — you
          should see the object, not a React page. Then create a Client
          Component that <code>fetch</code>es the same URL after paint,
          the same <code>useEffect</code>{" "}habit as{" "}
          <SectionLink to="4.7" />:
        </p>
        <CodeBlock
          language="tsx"
          name="GetHandler"
          file="app/labs/lab5/intermediates/5-3-1-GetHandler.tsx"
        >{`"use client";

import { useEffect, useState } from "react";

export default function GetHandler() {
  const [hello, setHello] = useState<{ message?: string }>({});
  useEffect(() => {
    fetch("/api/lab5/hello")
      .then((response) => response.json())
      .then(setHello);
  }, []);
  return (
    <div id="wd-lab5-get-handler">
      <h4>GET /api/lab5/hello</h4>
      <pre>{JSON.stringify(hello, null, 2)}</pre>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          A relative URL — <code>/api/lab5/hello</code> — goes to the
          same origin that served the page. Import the component into
          Lab 5. The first render shows <code>{"{}"}</code>; after the
          effect runs, the message appears:
        </p>
        <LiveDemo
          name="GetHandler"
          file="app/labs/lab5/intermediates/5-3-1-GetHandler.tsx"
          mode="styled"
        >
          <GetHandler />
        </LiveDemo>
        <OnYourOwn>
          Change the handler&apos;s{" "}
          <code>message</code>{" "}string and confirm both the raw URL and
          the Lab 5 demo update after a refresh.
        </OnYourOwn>
        <WithAI
          prompt={`In app/api/lab5/hello/route.ts, keep my message text. Add a sample field lab: 5 next to message in the JSON object. Do not rename my message.`}
        >
          Ask the assistant to add one extra sample field — leave the
          greeting as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-3-2"
        title="5.3.2 Query Parameters"
      >
        <p>
          Query parameters ride on the URL after <code>?</code>. The
          request object Next.js passes is a{" "}
          <code>NextRequest</code>, which exposes{" "}
          <code>nextUrl.searchParams</code> — a{" "}
          <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams">
            URLSearchParams
          </OfficialLink>{" "}
          map. Create <code>app/api/lab5/welcome/route.ts</code>:
        </p>
        <CodeBlock
          language="ts"
          name="welcome"
          file="app/api/lab5/welcome/route.ts"
        >{`import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name") ?? "World";
  return Response.json({ message: \`Welcome, \${name}\` });
}`}</CodeBlock>
        <p>
          <code>??</code>{" "}is the nullish coalescing from{" "}
          <SectionLink to="3.4.17" />: if <code>name</code>{" "}is missing,
          greet the world. Create a client that types a name and
          refetches when it changes:
        </p>
        <CodeBlock
          language="tsx"
          name="QueryHandler"
          file="app/labs/lab5/intermediates/5-3-2-QueryHandler.tsx"
        >{`"use client";

import { useEffect, useState } from "react";

export default function QueryHandler() {
  const [name, setName] = useState("Jose");
  const [welcome, setWelcome] = useState<{ message?: string }>({});
  useEffect(() => {
    fetch(\`/api/lab5/welcome?name=\${encodeURIComponent(name)}\`)
      .then((response) => response.json())
      .then(setWelcome);
  }, [name]);
  return (
    <div id="wd-lab5-query-handler">
      <h4>GET /api/lab5/welcome?name=</h4>
      <input
        id="wd-lab5-welcome-name"
        className="mb-2 block rounded border border-neutral-300 px-2 py-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <pre>{JSON.stringify(welcome, null, 2)}</pre>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>encodeURIComponent</code>{" "}keeps spaces and punctuation
          legal in the query string. Type in the field and watch the
          JSON follow:
        </p>
        <LiveDemo
          name="QueryHandler"
          file="app/labs/lab5/intermediates/5-3-2-QueryHandler.tsx"
          mode="styled"
        >
          <QueryHandler />
        </LiveDemo>
        <p>
          Open{" "}
          <LocalUrl href="/api/lab5/welcome?name=Ada" />{" "}directly to see
          the same handler without React.
        </p>
        <OnYourOwn>
          Read a second query
          parameter <code>role</code>{" "}in the handler and include it in
          the JSON. Confirm{" "}
          <code>?name=Ada&amp;role=faculty</code>{" "}works.
        </OnYourOwn>
        <WithAI
          prompt={`In app/api/lab5/welcome/route.ts, keep any role query I added. Also read a sample course search param and add it to the JSON as course, defaulting to "RS101" with ??. Do not remove my role field.`}
        >
          Ask the assistant to add one extra sample query field — leave{" "}
          <code>role</code>{" "}as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-3-3"
        title="5.3.3 Path Parameters"
      >
        <p>
          Dynamic segments use the same <code>[name]</code>{" "}folders as
          pages. In Next.js 16 the <code>params</code>{" "}object is a{" "}
          <strong>Promise</strong> — you <code>await</code>{" "}it, just as{" "}
          <SectionLink to="3.9.9" />{" "}awaits page <code>params</code>.
          Create <code>app/api/lab5/add/[a]/[b]/route.ts</code>:
        </p>
        <CodeBlock
          language="ts"
          name="add"
          file="app/api/lab5/add/[a]/[b]/route.ts"
        >{`export async function GET(
  _request: Request,
  { params }: { params: Promise<{ a: string; b: string }> },
) {
  const { a, b } = await params;
  const left = Number(a);
  const right = Number(b);
  return Response.json({
    a: left,
    b: right,
    sum: left + right,
  });
}`}</CodeBlock>
        <p>
          Path values arrive as strings. <code>Number</code>{" "}turns them
          into addends. Create a client that fetches{" "}
          <code>/api/lab5/add/3/4</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="PathHandler"
          file="app/labs/lab5/intermediates/5-3-3-PathHandler.tsx"
        >{`"use client";

import { useEffect, useState } from "react";

export default function PathHandler() {
  const [sum, setSum] = useState<{ a?: number; b?: number; sum?: number }>(
    {},
  );
  useEffect(() => {
    fetch("/api/lab5/add/3/4")
      .then((response) => response.json())
      .then(setSum);
  }, []);
  return (
    <div id="wd-lab5-path-handler">
      <h4>GET /api/lab5/add/3/4</h4>
      <pre>{JSON.stringify(sum, null, 2)}</pre>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The sum is <code>7</code>. Visit{" "}
          <LocalUrl href="/api/lab5/add/10/20" />{" "}to try other addends
          without changing the component.
        </p>
        <LiveDemo
          name="PathHandler"
          file="app/labs/lab5/intermediates/5-3-3-PathHandler.tsx"
          mode="styled"
        >
          <PathHandler />
        </LiveDemo>
        <OnYourOwn>
          Add a{" "}
          <code>product</code>{" "}field to the JSON (<code>left * right</code>)
          and confirm <code>/api/lab5/add/3/4</code>{" "}includes{" "}
          <code>12</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/api/lab5/add/[a]/[b]/route.ts, keep any product field I added. Also include a sample difference: left - right. Do not remove my product.`}
        >
          Ask the assistant to add a sample difference field — leave
          the product as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-3-4"
        title="5.3.4 POST and a JSON Body"
      >
        <p>
          <code>POST</code>{" "}creates. The new fields travel in the
          request body, not the URL. Read that body with{" "}
          <code>await request.json()</code>. An in-memory array holds
          the todos so later PUT and DELETE have something to change.
          Create <code>app/api/lab5/todos/store.ts</code>{" "}first — a
          module-level array is enough. It resets when the Next.js
          process restarts; that is expected until a later chapter
          introduces MongoDB.
        </p>
        <CodeBlock
          language="ts"
          name="todos store"
          file="app/api/lab5/todos/store.ts"
        >{`export type LabTodo = {
  id: string;
  title: string;
};

let todos: LabTodo[] = [
  { id: "1", title: "Learn HTTP" },
  { id: "2", title: "Write a Route Handler" },
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
}`}</CodeBlock>
        <p>
          Then export <code>GET</code>{" "}and <code>POST</code>{" "}from{" "}
          <code>app/api/lab5/todos/route.ts</code>. A missing title is a{" "}
          <code>400</code>; a create is a <code>201</code>:
        </p>
        <CodeBlock
          language="ts"
          name="todos"
          file="app/api/lab5/todos/route.ts"
        >{`import { addTodo, getTodos } from "./store";

export async function GET() {
  return Response.json(getTodos());
}

export async function POST(request: Request) {
  const body = (await request.json()) as { title?: string };
  const title = body.title?.trim();
  if (!title) {
    return Response.json({ error: "title is required" }, { status: 400 });
  }
  return Response.json(addTodo(title), { status: 201 });
}`}</CodeBlock>
        <p>
          The client sends <code>method</code>, a{" "}
          <code>Content-Type</code>{" "}header, and a stringified body:
        </p>
        <CodeBlock
          language="tsx"
          name="PostHandler"
          file="app/labs/lab5/intermediates/5-3-4-PostHandler.tsx"
        >{`"use client";

import { useState } from "react";

type Todo = { id: string; title: string };

export default function PostHandler() {
  const [title, setTitle] = useState("Read Chapter 5");
  const [created, setCreated] = useState<Todo | null>(null);
  async function createTodo() {
    const response = await fetch("/api/lab5/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setCreated(await response.json());
  }
  return (
    <div id="wd-lab5-post-handler">
      <h4>POST /api/lab5/todos</h4>
      <input
        id="wd-lab5-post-title"
        className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="button"
        id="wd-lab5-post-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        onClick={createTodo}
      >
        Create
      </button>
      <pre>{JSON.stringify(created, null, 2)}</pre>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Click Create. The <code>pre</code>{" "}shows the new todo with a
          generated <code>id</code>. Open{" "}
          <LocalUrl href="/api/lab5/todos" />{" "}and confirm the list grew.
        </p>
        <LiveDemo
          name="PostHandler"
          file="app/labs/lab5/intermediates/5-3-4-PostHandler.tsx"
          mode="styled"
        >
          <PostHandler />
        </LiveDemo>
        <OnYourOwn>
          POST an empty title and
          confirm the response is <code>400</code>{" "}with an{" "}
          <code>error</code>{" "}field. Display that status next to the
          JSON.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-3-4-PostHandler.tsx, keep any status display I added. After setCreated, also store response.status in a sample status state named postStatus and interpolate it above the pre. Do not remove my empty-title handling.`}
        >
          Ask the assistant to show a sample status code — you still
          trigger the empty-title <code>400</code>:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-3-5"
        title="5.3.5 PUT and DELETE"
      >
        <p>
          One item lives at{" "}
          <code>app/api/lab5/todos/[id]/route.ts</code>.{" "}
          <code>GET</code>{" "}returns that todo or <code>404</code>.{" "}
          <code>PUT</code>{" "}replaces the title. <code>DELETE</code>{" "}
          removes it. Await <code>params</code>{" "}for the id:
        </p>
        <CodeBlock
          language="ts"
          name="todo by id"
          file="app/api/lab5/todos/[id]/route.ts"
        >{`import { deleteTodo, getTodo, updateTodo } from "../store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const todo = getTodo(id);
  if (!todo) {
    return Response.json({ error: "Todo not found" }, { status: 404 });
  }
  return Response.json(todo);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { title?: string };
  const title = body.title?.trim();
  if (!title) {
    return Response.json({ error: "title is required" }, { status: 400 });
  }
  const updated = updateTodo(id, title);
  if (!updated) {
    return Response.json({ error: "Todo not found" }, { status: 404 });
  }
  return Response.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = deleteTodo(id);
  if (!deleted) {
    return Response.json({ error: "Todo not found" }, { status: 404 });
  }
  return Response.json(deleted);
}`}</CodeBlock>
        <p>
          A small client loads the list, renames the first todo, and
          deletes the last — enough to see both methods without building
          a full editor yet:
        </p>
        <CodeBlock
          language="tsx"
          name="PutDelete"
          file="app/labs/lab5/intermediates/5-3-5-PutDelete.tsx"
        >{`"use client";

import { useEffect, useState } from "react";

type Todo = { id: string; title: string };

export default function PutDelete() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState("");
  async function load() {
    const response = await fetch("/api/lab5/todos");
    setTodos(await response.json());
  }
  useEffect(() => {
    load();
  }, []);
  async function renameFirst() {
    const first = todos[0];
    if (!first) return;
    const response = await fetch(\`/api/lab5/todos/\${first.id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: \`\${first.title} (edited)\` }),
    });
    setStatus(\`PUT \${response.status}\`);
    await load();
  }
  async function removeLast() {
    const last = todos[todos.length - 1];
    if (!last) return;
    const response = await fetch(\`/api/lab5/todos/\${last.id}\`, {
      method: "DELETE",
    });
    setStatus(\`DELETE \${response.status}\`);
    await load();
  }
  return (
    <div id="wd-lab5-put-delete">
      <h4>PUT and DELETE /api/lab5/todos/:id</h4>
      <button
        type="button"
        id="wd-lab5-put-click"
        className="mr-2 rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
        onClick={renameFirst}
      >
        Rename first
      </button>
      <button
        type="button"
        id="wd-lab5-delete-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        onClick={removeLast}
      >
        Delete last
      </button>
      <p>{status}</p>
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
          Each mapped <code>li</code>{" "}needs <code>key={"{todo.id}"}</code>.
          Rename, then delete, and confirm the list and{" "}
          <LocalUrl href="/api/lab5/todos" />{" "}agree:
        </p>
        <LiveDemo
          name="PutDelete"
          file="app/labs/lab5/intermediates/5-3-5-PutDelete.tsx"
          mode="styled"
        >
          <PutDelete />
        </LiveDemo>
        <OnYourOwn>
          Fetch{" "}
          <code>/api/lab5/todos/does-not-exist</code>{" "}from the console
          or a tiny button and confirm you get <code>404</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-3-5-PutDelete.tsx, keep any 404 button I added. Add a sample button id="wd-lab5-missing-click" that GETs /api/lab5/todos/missing and sets status to GET plus the status code. Do not remove my personal 404 control.`}
        >
          Ask the assistant to add a sample missing-id GET — you still
          trigger <code>404</code>{" "}yourself:
        </WithAI>
      </Section>
    </Section>
  );
}
