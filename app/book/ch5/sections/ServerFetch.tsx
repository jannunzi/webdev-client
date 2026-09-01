import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import ServerFetchDemo from "@/app/labs/lab5/intermediates/5-5-1-ServerFetch";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function ServerFetch() {
  return (
    <Section
      id="sec-5-5"
      title="5.5 Fetching from Server Components"
    >
      <p>
        Client <code>fetch</code>{" "}runs <em>after</em>{" "}the browser has
        HTML. The first paint is an empty list; then the effect fills
        it. A{" "}
        <OfficialLink href="https://nextjs.org/docs/app/getting-started/fetching-data">
          Server Component
        </OfficialLink>{" "}
        can load the data <em>before</em>{" "}any HTML is sent. The user
        sees the todos on the first paint — no loading flash, no{" "}
        <code>&quot;use client&quot;</code>, no <code>useEffect</code>.
      </p>
      <p>
        You have two honest ways to load that data on the server. One
        is <code>await fetch</code>{" "}against your own Route Handler,
        using an absolute URL (server-side <code>fetch</code>{" "}does not
        know the page origin the way the browser does). The other —
        cleaner when the handler and the page share a process — is to
        import the same store function the handler calls. There is no
        extra HTTP hop, and the result is identical JSON. This lab
        uses the store so the book and{" "}
        <code>next build</code>{" "}do not depend on a running server
        calling itself. The <code>fetch</code>{" "}form is what you write
        when the API lives on another host.
      </p>
      <CodeBlock
        language="tsx"
        name="ServerFetch"
        file="app/labs/lab5/intermediates/5-5-1-ServerFetch.tsx"
      >{`import { getTodos } from "@/app/api/lab5/todos/store";

/**
 * Server Component that reads the same in-memory todos the Route
 * Handler returns. The chapter also shows the equivalent \`fetch\`
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
}`}</CodeBlock>
      <p>
        Notice there is no <code>&quot;use client&quot;</code>. The
        function is <code>async</code> — Server Components may await.
        The equivalent remote call looks like this; keep it in your
        notes for APIs you do not own:
      </p>
      <CodeBlock language="ts">{`const response = await fetch("https://example.com/api/lab5/todos", {
  cache: "no-store",
});
const todos = await response.json();`}</CodeBlock>
      <p>
        <code>cache: &quot;no-store&quot;</code>{" "}tells Next.js not to
        freeze a GET response across requests — important once the
        store is mutable. The live demo below is the store-backed
        Server Component. If you posted todos in{" "}
        <SectionLink to="5.4" />, they appear here too, because both
        read the same array:
      </p>
      <LiveDemo
        name="ServerFetch"
        file="app/labs/lab5/intermediates/5-5-1-ServerFetch.tsx"
        mode="styled"
      >
        <ServerFetchDemo />
      </LiveDemo>
      <OnYourOwn>
        Interpolate{" "}
        <code>todos.length</code>{" "}into the heading so the Server
        Component shows how many items it loaded.
      </OnYourOwn>
      <WithAI
        prompt={`In app/labs/lab5/intermediates/5-5-1-ServerFetch.tsx, keep any length I added to the heading. Under the ul, add a sample paragraph Rendered on the server with no useEffect. Do not remove my length.`}
        >
        Ask the assistant to add a sample caption — you still put the
        count in the heading:
      </WithAI>
    </Section>
  );
}
