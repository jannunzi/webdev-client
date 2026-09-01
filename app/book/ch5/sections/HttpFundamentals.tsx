import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import HttpMethods from "@/app/labs/lab5/intermediates/5-2-1-HttpMethods";
import StatusCodes from "@/app/labs/lab5/intermediates/5-2-2-StatusCodes";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function HttpFundamentals() {
  return (
    <>
      <Section
        level={3}
        id="sec-5-2-1"
        title="5.2.1 Requests, Responses, and URLs"
      >
        <p>
          An HTTP <strong>request</strong>{" "}is a message the client sends.
          The first line names the <strong>method</strong>{" "}and the{" "}
          <strong>target</strong>{" "}— usually a path such as{" "}
          <code>/api/lab5/hello</code>. Optional{" "}
          <strong>headers</strong>{" "}carry metadata:{" "}
          <code>Content-Type: application/json</code>{" "}says the body is
          JSON. The <strong>body</strong>{" "}is the payload, if any.{" "}
          <code>GET</code>{" "}requests typically have no body; the server
          already has everything it needs in the URL.
        </p>
        <p>
          An HTTP <strong>response</strong>{" "}starts with a{" "}
          <strong>status code</strong>{" "}— a three-digit number.{" "}
          <code>200</code>{" "}means success. Headers on the way back can
          include <code>Content-Type</code>{" "}again. The body is the
          representation of the resource: a JSON object, an HTML
          document, an image.{" "}
          <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages">
            MDN&apos;s HTTP messages page
          </OfficialLink>{" "}
          diagrams both sides.
        </p>
        <p>
          The <strong>URL</strong>{" "}(Uniform Resource Locator) is how you
          name the resource.{" "}
          <code>http://localhost:3000/api/lab5/hello</code>{" "}has a
          scheme (<code>http</code>), a host and port (
          <code>localhost:3000</code>), and a path (
          <code>/api/lab5/hello</code>). A{" "}
          <strong>query string</strong>{" "}after <code>?</code>{" "}passes
          extra name/value pairs:{" "}
          <code>/api/lab5/welcome?name=Jose</code>. Path segments can
          also encode values:{" "}
          <code>/api/lab5/add/3/4</code>{" "}puts the addends in the path,
          the same idea as <SectionLink to="3.7.3" />{" "}and{" "}
          <SectionLink to="4.3.3" />.
        </p>
        <OnYourOwn>
          In the browser address bar, open{" "}
          <code>/api/lab5/hello</code>{" "}after you create that handler in{" "}
          <SectionLink to="5.3.1" />{" "}and confirm the response is JSON,
          not an HTML page.
        </OnYourOwn>
        <WithAI
          prompt={`Do not edit any lab files yet. Explain the difference between a URL path (/api/lab5/hello) and a query string (?name=Jose) in one short paragraph I can paste into my notes. Mention that GET usually has no body.`}
        >
          Ask the assistant for a one-paragraph recap of path versus
          query — write the handler yourself in the next section:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-2-2"
        title="5.2.2 HTTP Methods"
      >
        <p>
          The method is a verb. REST uses a small set so every API feels
          familiar. <strong>Safe</strong>{" "}methods do not change server
          state — <code>GET</code>{" "}is safe. <strong>Idempotent</strong>{" "}
          methods can be retried without a second side effect:{" "}
          <code>GET</code>, <code>PUT</code>, and <code>DELETE</code>{" "}
          are idempotent; <code>POST</code>{" "}is not, because two creates
          make two resources. Create{" "}
          <code>5-2-1-HttpMethods.tsx</code>{" "}under{" "}
          <code>app/labs/lab5/intermediates</code>{" "}and import it from
          the Lab 5 page:
        </p>
        <CodeBlock
          language="tsx"
          name="HttpMethods"
          file="app/labs/lab5/intermediates/5-2-1-HttpMethods.tsx"
        >{`export default function HttpMethods() {
  return (
    <div id="wd-http-methods">
      <h4>HTTP methods</h4>
      <ul>
        <li>
          <strong>GET</strong> — retrieve a resource. Safe and idempotent.
        </li>
        <li>
          <strong>POST</strong> — create a resource. Not idempotent.
        </li>
        <li>
          <strong>PUT</strong> — replace a resource. Idempotent.
        </li>
        <li>
          <strong>DELETE</strong> — remove a resource. Idempotent.
        </li>
      </ul>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Four verbs cover the CRUD you will implement.{" "}
          <code>PATCH</code>{" "}exists for partial updates; this chapter
          uses <code>PUT</code>{" "}and sends the whole object.
        </p>
        <LiveDemo
          name="HttpMethods"
          file="app/labs/lab5/intermediates/5-2-1-HttpMethods.tsx"
        >
          <HttpMethods />
        </LiveDemo>
        <OnYourOwn>
          Add a fifth list item for{" "}
          <code>PATCH</code>{" "}in your own words — partial update, not
          always idempotent — and keep it on the Lab 5 page.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-2-1-HttpMethods.tsx, keep any PATCH item I added. After DELETE, add a sample <li><strong>HEAD</strong> — like GET but no body.</li>. Do not remove my PATCH line.`}
        >
          Ask the assistant to add a sample <code>HEAD</code>{" "}item —
          leave your <code>PATCH</code>{" "}line as the personal bit:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-2-3"
        title="5.2.3 Status Codes"
      >
        <p>
          Status codes are grouped by hundreds.{" "}
          <strong>2xx</strong>{" "}success, <strong>4xx</strong>{" "}the client
          sent something the server will not accept,{" "}
          <strong>5xx</strong>{" "}the server failed. You will return{" "}
          <code>200</code>{" "}from most <code>GET</code>s,{" "}
          <code>201</code>{" "}from a successful <code>POST</code>,{" "}
          <code>400</code>{" "}when the JSON is missing a required field,
          and <code>404</code>{" "}when the id is not in the store. Create{" "}
          <code>5-2-2-StatusCodes.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="StatusCodes"
          file="app/labs/lab5/intermediates/5-2-2-StatusCodes.tsx"
        >{`export default function StatusCodes() {
  return (
    <div id="wd-http-status-codes">
      <h4>HTTP status codes</h4>
      <ul>
        <li>
          <code>200 OK</code> — the request succeeded.
        </li>
        <li>
          <code>201 Created</code> — a new resource was created.
        </li>
        <li>
          <code>400 Bad Request</code> — the body or query was invalid.
        </li>
        <li>
          <code>404 Not Found</code> — no resource matches the URL.
        </li>
        <li>
          <code>500 Internal Server Error</code> — the server threw.
        </li>
      </ul>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="StatusCodes"
          file="app/labs/lab5/intermediates/5-2-2-StatusCodes.tsx"
        >
          <StatusCodes />
        </LiveDemo>
        <OnYourOwn>
          Add <code>204 No Content</code>{" "}
          to the list — a success with an empty body, sometimes used
          after <code>DELETE</code>. This course still returns the
          deleted JSON so you can see what left.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-2-2-StatusCodes.tsx, keep any 204 line I added. After 500, add a sample <li><code>401 Unauthorized</code> — the request lacked valid credentials.</li>. Do not remove my 204 line.`}
        >
          Ask the assistant to add a sample <code>401</code>{" "}— leave{" "}
          <code>204</code>{" "}as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-2-4"
        title="5.2.4 REST Resources and JSON"
      >
        <p>
          REST says: pick a noun, give it a URL, and use methods for
          verbs. A collection lives at a plural path —{" "}
          <code>/api/lab5/todos</code>, <code>/api/courses</code>. One
          item lives at the collection plus an id —{" "}
          <code>/api/lab5/todos/1</code>,{" "}
          <code>/api/courses/RS101</code>. Filtering a collection uses
          a query string:{" "}
          <code>/api/modules?course=RS101</code>.
        </p>
        <p>
          The representation in this course is JSON.{" "}
          <code>JSON.stringify</code>{" "}from <SectionLink to="3.4.10" />{" "}
          is what <code>fetch</code>{" "}needs in the request body;{" "}
          <code>response.json()</code>{" "}is the inverse of{" "}
          <code>JSON.parse</code>. You do not write those calls by
          hand inside a Route Handler —{" "}
          <code>Response.json(value)</code>{" "}serializes and sets{" "}
          <code>Content-Type</code>{" "}for you, and{" "}
          <code>await request.json()</code>{" "}parses the incoming body.
        </p>
        <OnYourOwn>
          Sketch on paper (or in a
          comment) the five URLs you expect for courses: list, create,
          read one, update one, delete one. Check them against{" "}
          <SectionLink to="5.11.2" />{" "}when you get there.
        </OnYourOwn>
        <WithAI
          prompt={`Do not edit my course API files. List the five REST URLs and HTTP methods for a modules collection at /api/modules and /api/modules/:id, including a GET that filters by ?course=. Keep it to a short bullet list.`}
        >
          Ask the assistant for a sample modules URL list — you still
          sketch courses yourself:
        </WithAI>
      </Section>
    </>
  );
}
