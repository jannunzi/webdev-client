import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Environment from "@/app/labs/lab5/intermediates/5-2-1-Environment";
import PathParameters from "@/app/labs/lab5/intermediates/5-2-2-1-PathParameters";
import QueryParameters from "@/app/labs/lab5/intermediates/5-2-2-2-QueryParameters";
import WorkingWithObjects from "@/app/labs/lab5/intermediates/5-2-3-WorkingWithObjects";
import WorkingWithArrays from "@/app/labs/lab5/intermediates/5-2-4-WorkingWithArrays";
import HttpClient from "@/app/labs/lab5/intermediates/5-2-5-HttpClient";
import WorkingWithObjectsAsynchronously from "@/app/labs/lab5/intermediates/5-2-5-WorkingWithObjectsAsync";
import WorkingWithArraysAsynchronously from "@/app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync";

export default function LabExercises() {
  return (
    <Section id="sec-5-2" title="5.2 Lab Exercises">
      <p>
        Practice creating HTTP routes on Express and calling them from
        the Next.js UI. You need{" "}
        <strong>two terminals</strong>:
      </p>
      <CodeBlock language="shell">{`# terminal 1 — Next.js UI (port 3000)
npm run dev

# terminal 2 — sibling Express (port 4000)
npm run server:dev
# same as: cd kambaz-node-server-app && npm run dev`}</CodeBlock>
      <p>
        In the Node project, create{" "}
        <code>Lab5/index.js</code>{" "}and register it from{" "}
        <code>index.js</code>. Express LiveDemos below call the
        companion through <code>httpServer()</code>.{" "}
        <SectionLink to="5.3" />{" "}Route Handler demos stay on
        same-origin <code>/api/...</code>{" "}and do not need port 4000.
      </p>
      <CodeBlock
        language="js"
        name="Lab5"
        file="kambaz-node-server-app/Lab5/index.js"
      >{`export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
}`}</CodeBlock>
      <p>
        Confirm{" "}
        <code>http://localhost:4000/lab5/welcome</code>. In the React
        app, create Lab 5 and a Welcome hyperlink. Do not hard-code the
        host for long — the next subsection replaces it with an env var.
      </p>

      <Section
        level={3}
        id="sec-5-2-1"
        title="5.2.1 Environment Variables"
      >
        <p>
          Two processes now: Next.js on 3000, Express on 4000. In
          production the UI is on Vercel and the API is on Render (or
          Heroku). Create <code>.env.development</code>{" "}at the Next.js
          root:
        </p>
        <CodeBlock language="shell">{`NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
# alias also read by httpServer(): NEXT_PUBLIC_API_BASE`}</CodeBlock>
        <p>
          Next.js only exposes env vars that start with{" "}
          <OfficialLink href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables">
            <code>NEXT_PUBLIC_</code>
          </OfficialLink>
          . The PDF name is{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>. This book wraps it (and
          the alias <code>NEXT_PUBLIC_API_BASE</code>) in one helper so
          every Express LiveDemo uses the same client code locally and
          on Render — only the origin changes:
        </p>
        <CodeBlock
          language="ts"
          name="httpServer"
          file="app/lib/httpServer.ts"
        >{`export function httpServer(): string {
  const raw =
    process.env.NEXT_PUBLIC_HTTP_SERVER ??
    process.env.NEXT_PUBLIC_API_BASE ??
    "http://localhost:4000";
  return raw.replace(/\\/$/, "");
}`}</CodeBlock>
        <p>
          Unset locally → companion on 4000. On Vercel set the Render
          origin (no trailing slash). Do not hard-code either host in
          screens.
        </p>
        <LiveDemo
          name="Environment"
          file="app/labs/lab5/intermediates/5-2-1-Environment.tsx"
          mode="styled"
        >
          <Environment />
        </LiveDemo>
        <OnYourOwn>
          Click Welcome and confirm the Express greeting — not a Next.js
          page.
        </OnYourOwn>
        <WithAI
          prompt={`Do not hard-code localhost:4000 in my Lab 5 Welcome link. Use process.env.NEXT_PUBLIC_HTTP_SERVER (or httpServer()) and keep id wd-welcome-link.`}
        >
          Ask the assistant to use the env var — you still click Welcome:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-2-2"
        title="5.2.2 Sending Data to a Server via HTTP Requests"
      >
        <Section
          level={3}
          id="sec-5-2-2-1"
          title="5.2.2.1 Path Parameters"
        >
          <p>
            Embed values in the path:{" "}
            <code>/lab5/add/2/4</code>. Express writes{" "}
            <code>:a</code>{" "}and <code>:b</code>.{" "}
            <code>res.send</code>{" "}must send a <em>string</em> — a bare
            number is treated as a status code.
          </p>
          <CodeBlock
            language="js"
            name="PathParameters"
            file="kambaz-node-server-app/Lab5/PathParameters.js"
          >{`export default function PathParameters(app) {
  const add = (req, res) => {
    const { a, b } = req.params;
    res.send((parseInt(a) + parseInt(b)).toString());
  };
  app.get("/lab5/add/:a/:b", add);
  app.get("/lab5/subtract/:a/:b", /* … */);
}`}</CodeBlock>
          <LiveDemo
            name="PathParameters"
            file="app/labs/lab5/intermediates/5-2-2-1-PathParameters.tsx"
            mode="styled"
          >
            <PathParameters />
          </LiveDemo>
          <OnYourOwn>
            Implement multiply and divide path routes and matching
            links with ids starting <code>wd-path-parameter-</code>.
          </OnYourOwn>
        </Section>
        <Section
          level={3}
          id="sec-5-2-2-2"
          title="5.2.2.2 Query Parameters"
        >
          <p>
            After <code>?</code>:{" "}
            <code>/lab5/calculator?operation=add&amp;a=2&amp;b=4</code>.
            Read <code>req.query</code>.
          </p>
          <LiveDemo
            name="QueryParameters"
            file="app/labs/lab5/intermediates/5-2-2-2-QueryParameters.tsx"
            mode="styled"
          >
            <QueryParameters />
          </LiveDemo>
        </Section>
        <Section
          level={3}
          id="sec-5-2-2-3"
          title="5.2.2.3 On Your Own"
        >
          <p>
            Multiply and divide on <em>both</em>{" "}the path and the query
            string, client and server.
          </p>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-2-3"
        title="5.2.3 Working with Remote Objects on a Server"
      >
        <p>
          Declare an assignment object in{" "}
          <code>Lab5/WorkingWithObjects.js</code>. It lives as long as
          the Node process. Use <code>res.json</code>{" "}for objects.
        </p>
        <LiveDemo
          name="WorkingWithObjects"
          file="app/labs/lab5/intermediates/5-2-3-WorkingWithObjects.tsx"
          mode="styled"
        >
          <WorkingWithObjects />
        </LiveDemo>
        <OnYourOwn>
          Add a module object at <code>/lab5/module</code>, Get Module
          Name, and routes that edit assignment score/completed and the
          module description.
        </OnYourOwn>
        <WithAI
          prompt={`Do not implement my module routes. List the /lab5/module URLs I still need (object, name, update name, update description) as a short checklist.`}
        >
          Ask the assistant for a URL checklist — you still write the
          routes:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-2-4"
        title="5.2.4 Working with Remote Arrays on a Server"
      >
        <p>
          <strong>CRUD</strong>{" "}on a todos array: list, get by id, filter
          with <code>?completed=true</code>, create at{" "}
          <code>/lab5/todos/create</code>{" "}<em>before</em>{" "}
          <code>/lab5/todos/:id</code>, delete, update title. Same
          process memory — reboot resets the seed.
        </p>
        <LiveDemo
          name="WorkingWithArrays"
          file="app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx"
          mode="styled"
        >
          <WorkingWithArrays />
        </LiveDemo>
        <OnYourOwn>
          Add{" "}
          <code>/lab5/todos/:id/completed/:completed</code>{" "}and{" "}
          <code>/lab5/todos/:id/description/:description</code>{" "}plus
          matching links.
        </OnYourOwn>
      </Section>

      <Section
        level={3}
        id="sec-5-2-5"
        title="5.2.5 Asynchronous Communication with HTTP Servers"
      >
        <p>
          Hyperlinks navigate away.{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/Ajax_(programming)">
            AJAX
          </OfficialLink>{" "}
          — Asynchronous JavaScript and XML, though we send JSON — lets
          the UI stay put. Install{" "}
          <OfficialLink href="https://axios-http.com/">
            axios
          </OfficialLink>{" "}
          in the Next.js project: <code>npm install axios</code>.
        </p>
        <p>
          The first click often fails with{" "}
          <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">
            CORS
          </OfficialLink>
          : a page on port 3000 talking to port 4000 is a different
          origin. On Express: <code>npm install cors</code>{" "}then{" "}
          <code>app.use(cors())</code>{" "}immediately after{" "}
          <code>express()</code>{" "}— before the routes. Move{" "}
          <code>axios.get</code>{" "}into{" "}
          <code>app/labs/lab5/client.ts</code>{" "}so screens share one
          library. Fetch on click <em>and</em>{" "}on load with{" "}
          <code>useEffect(..., [])</code>.
        </p>
        <LiveDemo
          name="HttpClient"
          file="app/labs/lab5/intermediates/5-2-5-HttpClient.tsx"
          mode="styled"
        >
          <HttpClient />
        </LiveDemo>
        <LiveDemo
          name="WorkingWithObjectsAsynchronously"
          file="app/labs/lab5/intermediates/5-2-5-WorkingWithObjectsAsync.tsx"
          mode="styled"
        >
          <WorkingWithObjectsAsynchronously />
        </LiveDemo>
        <OnYourOwn>
          Change the assignment title, click Update Title, refresh, and
          confirm the new title is still on the server.
        </OnYourOwn>
      </Section>

      <Section
        level={3}
        id="sec-5-2-6"
        title="5.2.6 Passing JSON Data to a Server in an HTTP Body"
      >
        <p>
          Path and query strings are limited and visible. JSON in the
          body can be large and encrypted in transit. After CORS, add{" "}
          <code>app.use(express.json())</code>{" "}<em>before</em>{" "}the
          routes. Use HTTP methods for their purpose:{" "}
          <code>GET</code>{" "}reads, <code>POST</code>{" "}creates,{" "}
          <code>PUT</code>{" "}updates, <code>DELETE</code>{" "}removes. Keep
          the older GET create/delete routes so earlier links still work.
          Handle 404 when an id is missing and{" "}
          <code>try/catch</code>{" "}on the client.
        </p>
        <LiveDemo
          name="WorkingWithArraysAsynchronously"
          file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
          mode="styled"
        >
          <WorkingWithArraysAsynchronously />
        </LiveDemo>
        <OnYourOwn>
          Delete a todo with the GET{" "}
          <code>/delete</code>{" "}link, then try the X (HTTP DELETE) on
          the same id and confirm the 404 alert.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx, keep my deleteTodo try/catch. If the catch runs, keep showing errorMessage. Do not remove the FaPlusCircle POST button.`}
        >
          Ask the assistant not to strip error handling — you still
          trigger the 404:
        </WithAI>
      </Section>
    </Section>
  );
}
