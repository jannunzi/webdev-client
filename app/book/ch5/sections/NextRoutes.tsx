import Section from "../../components/Section";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import { OnYourOwn, WithAI } from "../../components/Practice";
import HelloRoute from "@/app/labs/lab5/intermediates/5-3-1-HelloRoute";
import CalculatorNextWebApiClient from "@/app/labs/lab5/intermediates/5-3-1-Calculator";

export default function NextRoutes() {
  return (
    <Section id="sec-5-3" title="5.3 Next.js Server Routes">
      <p>
        Express is this chapter&apos;s spine: a separate process, a
        separate host.{" "}
        <OfficialLink href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">
          Route Handlers
        </OfficialLink>{" "}
        are the other server model — useful, not a replacement for Lab 5.
        A file under <code>app/api/</code>{" "}becomes an endpoint:{" "}
        <code>app/api/hello/route.ts</code>{" "}serves{" "}
        <code>/api/hello</code>. Same Next.js project as the UI. Same
        machine, same deploy. Support GET, POST, PUT, DELETE. You stay
        inside the App Router when you do not need an independent API
        process. These LiveDemos fetch{" "}
        <code>/api/lab5/...</code>{" "}on the Next.js origin — they work
        with only <code>npm run dev</code>. Express Lab 5 still needs
        the companion on 4000.
      </p>
      <p>
        A trivial hello at{" "}
        <LocalUrl href="/api/lab5/hello" />:
      </p>
      <CodeBlock
        language="ts"
        name="hello"
        file="app/api/lab5/hello/route.ts"
      >{`export async function GET() {
  return Response.json({ message: "Hello from Lab 5 API!" });
}`}</CodeBlock>
      <LiveDemo
        name="HelloRoute"
        file="app/labs/lab5/intermediates/5-3-1-HelloRoute.tsx"
        mode="styled"
      >
        <HelloRoute />
      </LiveDemo>
      <p>
        This greeting is <em>not</em>{" "}the Express{" "}
        <code>/lab5/welcome</code>. Same-origin{" "}
        <code>/api</code>{" "}does not need CORS.
      </p>

      <Section
        level={3}
        id="sec-5-3-1"
        title="5.3.1 Next.js Calculator Web API"
      >
        <p>
          Create{" "}
          <code>app/api/lab5/calculator/route.ts</code>. Read query
          parameters <code>a</code>, <code>b</code>, and{" "}
          <code>operation</code>{" "}from{" "}
          <code>request.nextUrl.searchParams</code>{" "}(Next.js 16).
          Invalid numbers or an unknown operation return 400.{" "}
          <LocalUrl href="/api/lab5/calculator?a=10&b=5&operation=add" />{" "}
          should produce{" "}
          <code>{`{ "a": 10, "b": 5, "operation": "add", "result": 15 }`}</code>.
          Extend the switch with multiply and divide.
        </p>
        <CodeBlock
          language="ts"
          name="calculator"
          file="app/api/lab5/calculator/route.ts"
        >{`export async function GET(request: NextRequest) {
  const a = parseFloat(request.nextUrl.searchParams.get("a") ?? "");
  const b = parseFloat(request.nextUrl.searchParams.get("b") ?? "");
  const operation = request.nextUrl.searchParams.get("operation");
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return Response.json({ error: "Invalid numbers" }, { status: 400 });
  }
  // add / subtract / multiply / divide …
  return Response.json({ a, b, operation, result });
}`}</CodeBlock>
        <LiveDemo
          name="CalculatorNextWebApiClient"
          file="app/labs/lab5/intermediates/5-3-1-Calculator.tsx"
          mode="styled"
        >
          <CalculatorNextWebApiClient />
        </LiveDemo>
        <OnYourOwn>
          Divide by zero and an unknown operation should show the error
          string, not a thrown page.
        </OnYourOwn>
        <WithAI
          prompt={`In app/api/lab5/calculator/route.ts, keep add and subtract. Add multiply and divide cases. Return 400 for unknown operations. Do not change the hello route.`}
        >
          Ask the assistant to finish the switch — you still try × and ÷:
        </WithAI>
      </Section>
    </Section>
  );
}
