import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import TwoServers from "@/app/labs/lab5/intermediates/5-7-1-TwoServers";
import RemoteHello from "@/app/labs/lab5/intermediates/5-7-2-RemoteHello";
import CorsNote from "@/app/labs/lab5/intermediates/5-7-3-CorsNote";
import RemoteTodos from "@/app/labs/lab5/intermediates/5-7-4-RemoteTodos";

export default function SeparateServer() {
  return (
    <Section id="sec-5-7" title="5.7 A Separate Node Server">
      <p>
        <SectionLink to="5.3" />{" "}put HTTP in the same Next.js process
        as the screens. That is one legitimate server model: one
        repository, one deploy, one origin. The browser asks for{" "}
        <code>/api/lab5/hello</code>{" "}and the same machine that served
        the HTML answers. Many product teams ship that way for years.
      </p>
      <p>
        A second model is older and still the backbone of this course
        architecture: the UI is one program, the API is another. The
        API is a Node process —{" "}
        <OfficialLink href="https://expressjs.com/">
          Express
        </OfficialLink>{" "}
        in this chapter, or the built-in{" "}
        <OfficialLink href="https://nodejs.org/api/http.html">
          <code>http</code>
        </OfficialLink>{" "}
        module if you prefer fewer dependencies — listening on its own
        host and port. The Next.js app is only a client. It calls that
        host over HTTP, the same way it would call any public REST
        service. Later chapters can put MongoDB behind{" "}
        <em>that</em>{" "}process without touching the Route Handler
        drills you already wrote.
      </p>
      <p>
        Why bother with two processes when Route Handlers already
        work? A separate server is a{" "}
        <strong>shared API</strong>: a mobile client, a classmate&apos;s
        script, or a later non-Next front end can hit the same URLs. It
        <strong> deploys and scales independently</strong> — you can
        restart the API without rebuilding the UI, and the other way
        around. And it matches how this course splits the stack: the
        Next.js app on Vercel is the interface; the Node API on{" "}
        <OfficialLink href="https://render.com/">
          Render
        </OfficialLink>{" "}
        is the server. Neither model uses a database yet. Both keep
        data in memory (or a file) so you can learn the HTTP contract
        twice — once same-origin, once remote — before MongoDB.
      </p>

      <Section
        level={3}
        id="sec-5-7-1"
        title="5.7.1 Two Server Models"
      >
        <p>
          Write the distinction down before you type{" "}
          <code>express()</code>. Model (1) is{" "}
          <strong>Next.js as the API server in the same app as
          the UI</strong>:{" "}
          <code>app/api/**/route.ts</code>{" "}files from{" "}
          <SectionLink to="5.3" />. From the student&apos;s point of view
          there is one machine and one deploy. Model (2) is{" "}
          <strong>a separate backend on a separate host</strong>: its
          own Node process, its own port locally, its own Render URL
          in production. The UI chooses which one with an environment
          variable. Empty{" "}
          <code>NEXT_PUBLIC_API_BASE</code>{" "}means model (1). A URL
          means model (2).
        </p>
        <p>
          Create{" "}
          <code>app/labs/lab5/intermediates/5-7-1-TwoServers.tsx</code>{" "}
          as a caption you can import into Lab 5. It prints whichever
          base the running app is using:
        </p>
        <CodeBlock
          language="tsx"
          name="TwoServers"
          file="app/labs/lab5/intermediates/5-7-1-TwoServers.tsx"
        >{`import { apiBaseLabel, apiUrl } from "@/app/lib/apiUrl";

export default function TwoServers() {
  return (
    <div id="wd-lab5-two-servers">
      <h4>Two HTTP servers</h4>
      <p>
        <strong>Same-app Route Handlers</strong> live in this Next.js
        process at paths such as <code>/api/lab5/hello</code>.
      </p>
      <p>
        <strong>A separate Node/Express process</strong> listens on
        another host (locally <code>http://localhost:4000</code>, later
        Render). The UI picks it with{" "}
        <code>NEXT_PUBLIC_API_BASE</code>.
      </p>
      <p>
        Current <code>apiUrl(&quot;/api/lab5/hello&quot;)</code> ={" "}
        <code>{apiUrl("/api/lab5/hello")}</code>
        <br />
        Base: {apiBaseLabel()}
      </p>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The helper{" "}
          <code>apiUrl</code>{" "}arrives in{" "}
          <SectionLink to="5.7.4" />. Until you set the env var, this
          demo still points at the Route Handler you already have:
        </p>
        <LiveDemo
          name="TwoServers"
          file="app/labs/lab5/intermediates/5-7-1-TwoServers.tsx"
          mode="styled"
        >
          <TwoServers />
        </LiveDemo>
        <OnYourOwn>
          In your own words, list
          one reason to keep Route Handlers and one reason to run
          Express on another host. Keep both lists — this chapter
          grades both patterns.
        </OnYourOwn>
        <WithAI
          prompt={`Do not write my Express app. In two short bullets, contrast Next.js Route Handlers in the same app as the UI with a separate Node server the UI calls over HTTP. Mention one deploy versus independent deploy.`}
        >
          Ask the assistant for a two-bullet contrast — you still
          write the reason lists:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-7-2"
        title="5.7.2 An Express Application"
      >
        <p>
          The separate server is a{" "}
          <em>second</em>{" "}npm project at the repository root, not a
          folder Next.js bundles. Create <code>server</code>{" "}next to{" "}
          <code>app</code>. Its{" "}
          <code>package.json</code>{" "}owns Express,{" "}
          <OfficialLink href="https://expressjs.com/en/resources/middleware/cors.html">
            <code>cors</code>
          </OfficialLink>
          , and{" "}
          <OfficialLink href="https://tsx.is/">
            <code>tsx</code>
          </OfficialLink>{" "}
          so you can run TypeScript without a compile step — the same
          habit as Chapters 1–3, just a different process:
        </p>
        <CodeBlock language="shell">{`mkdir server
cd server
npm init -y`}</CodeBlock>
        <p>
          Replace the generated manifest so the project is ESM, starts
          with <code>tsx</code>, and pins a modern Node for Render:
        </p>
        <CodeBlock
          language="json"
          name="server package"
          file="server/package.json"
        >{`{
  "name": "kambaz-node-server",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "tsx watch index.ts",
    "start": "tsx index.ts"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "tsx": "^4.20.5"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/node": "^20.19.0",
    "typescript": "^5.9.2"
  }
}`}</CodeBlock>
        <p>
          Run <code>npm install</code>{" "}inside <code>server</code>, not
          at the Next.js root — these packages must not leak into the
          UI bundle. Add a small{" "}
          <code>server/tsconfig.json</code>{" "}so the editor type-checks
          this folder on its own. The Next.js{" "}
          <code>tsconfig.json</code>{" "}should{" "}
          <code>exclude</code>{" "}<code>server</code>{" "}so{" "}
          <code>next build</code>{" "}does not try to compile Express.
        </p>
        <CodeBlock
          language="json"
          name="server tsconfig"
          file="server/tsconfig.json"
        >{`{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noEmit": true
  },
  "include": ["./**/*.ts"]
}`}</CodeBlock>
        <p>
          Now the smallest possible API — the Express twin of{" "}
          <SectionLink to="5.3.1" />. Create{" "}
          <code>server/index.ts</code>:
        </p>
        <CodeBlock
          language="ts"
          name="Express hello"
          file="server/index.ts"
        >{`import express from "express";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.get("/api/lab5/hello", (_req, res) => {
  res.json({ message: "Hello World from the Express server" });
});

app.listen(port, () => {
  console.log(\`kambaz-node-server listening on http://localhost:\${port}\`);
});`}</CodeBlock>
        <p>
          <code>app.get</code>{" "}is the Express spelling of{" "}
          <code>export async function GET</code>. The path string is
          the URL. <code>res.json</code>{" "}is their{" "}
          <code>Response.json</code>.{" "}
          <code>PORT</code>{" "}defaults to 4000 on your laptop so it
          does not collide with <code>next dev</code>{" "}on 3000; Render
          will inject its own <code>PORT</code>{" "}and you must honor
          it. From the <code>server</code>{" "}folder:
        </p>
        <CodeBlock language="shell">{`npm run dev`}</CodeBlock>
        <p>
          Open{" "}
          <code>http://localhost:4000/api/lab5/hello</code>{" "}in a
          tab. You should see{" "}
          <code>Hello World from the Express server</code>{" "}— a
          different greeting from Lab 5&apos;s Route Handler, so you can
          tell which process answered. Leave that terminal running.
          Start (or keep) <code>npm run dev</code>{" "}in the project
          root for the UI. Two processes, two ports, one repository.
        </p>
        <p>
          Copy the same path shapes you already taught the UI:{" "}
          <code>/api/lab5/welcome</code>,{" "}
          <code>/api/lab5/add/:a/:b</code>, and the todos collection.
          Express writes path parameters as{" "}
          <code>:id</code>{" "}instead of{" "}
          <code>[id]</code>, and reads them from{" "}
          <code>req.params</code>{" "}instead of{" "}
          <code>await params</code>. Query strings are{" "}
          <code>req.query</code>. JSON bodies need{" "}
          <code>app.use(express.json())</code>{" "}before the POST
          routes — the equivalent of{" "}
          <code>await request.json()</code>{" "}in a Route Handler. Put
          the todos array in{" "}
          <code>server/todosStore.ts</code>{" "}so this process has its
          own memory. Do not import{" "}
          <code>app/api/lab5/todos/store.ts</code>{" "}into Express:
          Render&apos;s root directory will be <code>server/</code>{" "}and
          that file will not be on disk there.
        </p>
        <OnYourOwn>
          Add GET{" "}
          <code>/api/lab5/welcome</code>{" "}that reads{" "}
          <code>req.query.name</code>{" "}and returns the same JSON shape
          as <SectionLink to="5.3.2" />. Hit it with{" "}
          <code>?name=Jose</code>{" "}in the browser.
        </OnYourOwn>
        <WithAI
          prompt={`In server/index.ts, keep my hello route. Add a sample GET /api/lab5/welcome that reads req.query.name and returns { message: "Welcome, " + name } with a World default. Do not remove hello.`}
        >
          Ask the assistant to add welcome next to hello — you still
          type the query URL yourself:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-7-3"
        title="5.7.3 CORS"
      >
        <p>
          A page served from{" "}
          <code>http://localhost:3000</code>{" "}that{" "}
          <code>fetch</code>es{" "}
          <code>http://localhost:4000</code>{" "}is a{" "}
          <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">
            <strong>cross-origin</strong>
          </OfficialLink>{" "}
          request. The{" "}
          <strong>origin</strong>{" "}is the scheme + host + port.{" "}
          <code>3000</code>{" "}and <code>4000</code>{" "}are different
          origins even though they share a laptop. The same is true
          later for a Vercel hostname calling a Render hostname.
        </p>
        <p>
          Browsers enforce the{" "}
          <strong>same-origin policy</strong>: JavaScript may read a
          response only if the server opts in. For methods other than
          simple GETs — and for{" "}
          <code>Content-Type: application/json</code>{" "}POST — the
          browser first sends an{" "}
          <code>OPTIONS</code>{" "}
          <strong>preflight</strong>{" "}asking whether the real method
          is allowed. The API must answer with{" "}
          <code>Access-Control-Allow-Origin</code>{" "}(and friends). If
          it does not, your Express handler may have run and logged a
          201, but the browser hides the body and{" "}
          <code>fetch</code>{" "}rejects. Same-origin Route Handlers
          never needed this. A separate server does.
        </p>
        <p>
          Install the{" "}
          <code>cors</code>{" "}middleware and allow the UI origin from
          an env var so localhost and Vercel are not hard-coded as
          the only clients:
        </p>
        <CodeBlock
          language="ts"
          name="CORS"
          file="server/index.ts"
        >{`import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT) || 4000;

const allowedOrigins = (
  process.env.FRONTEND_ORIGIN ?? "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());`}</CodeBlock>
        <p>
          Comma-separated origins let you list both{" "}
          <code>http://localhost:3000</code>{" "}and your Vercel URL
          when you test production API against a local UI. Restart
          Express after changing env vars. Create{" "}
          <code>5-7-3-CorsNote.tsx</code>{" "}as a reminder you can see
          on Lab 5:
        </p>
        <CodeBlock
          language="tsx"
          name="CorsNote"
          file="app/labs/lab5/intermediates/5-7-3-CorsNote.tsx"
        >{`export default function CorsNote() {
  return (
    <div id="wd-lab5-cors">
      <h4>CORS</h4>
      <p>
        A page on <code>http://localhost:3000</code> calling{" "}
        <code>http://localhost:4000</code> is a{" "}
        <strong>cross-origin</strong> request. The browser asks the
        Express server for permission with an OPTIONS preflight. Without{" "}
        <code>Access-Control-Allow-Origin</code>, the response is hidden
        even if Express ran the handler.
      </p>
      <p>
        Same-origin <code>/api/...</code> Route Handlers do not need
        CORS. A Render URL does.
      </p>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="CorsNote"
          file="app/labs/lab5/intermediates/5-7-3-CorsNote.tsx"
          mode="styled"
        >
          <CorsNote />
        </LiveDemo>
        <OnYourOwn>
          Temporarily comment out{" "}
          <code>app.use(cors(...))</code>, keep Express running, set{" "}
          <code>NEXT_PUBLIC_API_BASE=http://localhost:4000</code>{" "}as
          in the next section, and confirm the browser console shows a
          CORS error. Restore the middleware.
        </OnYourOwn>
        <WithAI
          prompt={`Do not rewrite my Express routes. Explain in three sentences why a browser on localhost:3000 fetching localhost:4000 needs Access-Control-Allow-Origin, what an OPTIONS preflight is, and why same-origin /api Route Handlers skip CORS.`}
        >
          Ask the assistant to recap CORS — you still break it on
          purpose once:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-7-4"
        title="5.7.4 Calling the Remote API"
      >
        <p>
          Do not sprinkle{" "}
          <code>http://localhost:4000</code>{" "}through every{" "}
          <code>fetch</code>. One helper prefixes the path when an
          env var is set and leaves it alone when it is not — so the
          same Lab 5 and Kambaz screens work against Route Handlers{" "}
          <em>or</em>{" "}Express. Create{" "}
          <code>app/lib/apiUrl.ts</code>:
        </p>
        <CodeBlock
          language="ts"
          name="apiUrl"
          file="app/lib/apiUrl.ts"
        >{`export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\\/$/, "") ?? "";
  const normalized = path.startsWith("/") ? path : \`/\${path}\`;
  return \`\${base}\${normalized}\`;
}

export function apiBaseLabel(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\\/$/, "") ?? "";
  return base || "same origin (Next.js Route Handlers)";
}`}</CodeBlock>
        <p>
          <OfficialLink href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables">
            <code>NEXT_PUBLIC_</code>
          </OfficialLink>{" "}
          is required so the browser bundle can read the value.
          Variables without that prefix stay on the server and would
          be <code>undefined</code>{" "}inside a Client Component. Create{" "}
          <code>.env.local</code>{" "}at the Next.js root (it is already
          gitignored):
        </p>
        <CodeBlock language="shell">{`# empty or omit the file → Route Handlers
# NEXT_PUBLIC_API_BASE=http://localhost:4000
# NEXT_PUBLIC_API_BASE=https://your-service.onrender.com`}</CodeBlock>
        <p>
          Restart <code>next dev</code>{" "}after changing{" "}
          <code>NEXT_PUBLIC_*</code>{" "}— Next inlines those values at
          startup. Create a client that fetches through{" "}
          <code>apiUrl</code>{" "}so you can see which greeting comes
          back:
        </p>
        <CodeBlock
          language="tsx"
          name="RemoteHello"
          file="app/labs/lab5/intermediates/5-7-2-RemoteHello.tsx"
        >{`"use client";

import { useEffect, useState } from "react";
import { apiBaseLabel, apiUrl } from "@/app/lib/apiUrl";

export default function RemoteHello() {
  const [hello, setHello] = useState<{ message?: string }>({});
  const [error, setError] = useState("");
  const url = apiUrl("/api/lab5/hello");
  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json();
      })
      .then(setHello)
      .catch((err: Error) => setError(err.message));
  }, [url]);
  return (
    <div id="wd-lab5-remote-hello">
      <h4>fetch via apiUrl</h4>
      <p>
        GET <code>{url}</code>
        <br />
        {apiBaseLabel()}
      </p>
      {error ? <p id="wd-lab5-remote-hello-error">{error}</p> : null}
      <pre>{JSON.stringify(hello, null, 2)}</pre>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="RemoteHello"
          file="app/labs/lab5/intermediates/5-7-2-RemoteHello.tsx"
          mode="styled"
        >
          <RemoteHello />
        </LiveDemo>
        <p>
          With the env var empty, this is the Route Handler greeting.
          With <code>http://localhost:4000</code>{" "}and Express
          running, it is the Express greeting. Wire the todos POST the
          same way so a create hits whichever store the base selects:
        </p>
        <CodeBlock
          language="tsx"
          name="RemoteTodos"
          file="app/labs/lab5/intermediates/5-7-4-RemoteTodos.tsx"
        >{`"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/app/lib/apiUrl";

type Todo = { id: string; title: string };

export default function RemoteTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  async function load() {
    const response = await fetch(apiUrl("/api/lab5/todos"));
    setTodos(await response.json());
  }
  useEffect(() => {
    load();
  }, []);
  async function addTodo() {
    if (!title.trim()) return;
    await fetch(apiUrl("/api/lab5/todos"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    await load();
  }
  return (
    <div id="wd-lab5-remote-todos">
      <h4>Remote (or same-origin) todo POST</h4>
      <p>
        POST <code>{apiUrl("/api/lab5/todos")}</code>
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="button" onClick={addTodo}>
        Add on current API
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="RemoteTodos"
          file="app/labs/lab5/intermediates/5-7-4-RemoteTodos.tsx"
          mode="styled"
        >
          <RemoteTodos />
        </LiveDemo>
        <p>
          Import all four 5.7 components into{" "}
          <code>app/labs/lab5/page.tsx</code>{" "}after the Server Action
          contrast. Lab 5 now demonstrates both server models on one
          page: Route Handlers in 5.3–5.6, the remote process here.
        </p>
        <OnYourOwn>
          Set{" "}
          <code>NEXT_PUBLIC_API_BASE=http://localhost:4000</code>{" "}in{" "}
          <code>.env.local</code>, restart Next, confirm RemoteHello
          shows the Express greeting, then clear the var and confirm
          the Route Handler greeting returns.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-7-2-RemoteHello.tsx, keep apiUrl. After the pre, add a sample paragraph that prints apiBaseLabel(). Do not hard-code localhost:4000.`}
        >
          Ask the assistant to surface the label — you still flip the
          env var yourself:
        </WithAI>
      </Section>
    </Section>
  );
}
