import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";

export default function Exercises() {
  return (
    <Section id="sec-5-7" title="5.7 Exercises">
      <p>
        Use this checklist to confirm Lab 5 covers every HTTP topic in{" "}
        <SectionLink to="5.2" />–<SectionLink to="5.6" />. Import each
        component into <code>app/labs/lab5/page.tsx</code>{" "}in order.
        Complete each section&apos;s <strong>On your own</strong>{" "}and{" "}
        <strong>With AI</strong>{" "}blocks as well. Give every mapped JSX
        sibling a <code>key</code>.
      </p>
      <ol>
        <li>
          Create <code>5-2-1-HttpMethods.tsx</code>{" "}and{" "}
          <code>5-2-2-StatusCodes.tsx</code>{" "}(<SectionLink to="5.2.2" />–
          <SectionLink to="5.2.3" />).
        </li>
        <li>
          Create <code>app/api/lab5/hello/route.ts</code>{" "}and{" "}
          <code>5-3-1-GetHandler.tsx</code>{" "}(<SectionLink to="5.3.1" />).
        </li>
        <li>
          Create <code>app/api/lab5/welcome/route.ts</code>{" "}and{" "}
          <code>5-3-2-QueryHandler.tsx</code>{" "}(<SectionLink to="5.3.2" />).
        </li>
        <li>
          Create <code>app/api/lab5/add/[a]/[b]/route.ts</code>{" "}and{" "}
          <code>5-3-3-PathHandler.tsx</code>{" "}(<SectionLink to="5.3.3" />).
        </li>
        <li>
          Create the todos <code>store.ts</code>,{" "}
          <code>todos/route.ts</code>, and{" "}
          <code>5-3-4-PostHandler.tsx</code>{" "}(<SectionLink to="5.3.4" />).
        </li>
        <li>
          Create <code>todos/[id]/route.ts</code>{" "}with GET, PUT, and
          DELETE, plus <code>5-3-5-PutDelete.tsx</code>{" "}(
          <SectionLink to="5.3.5" />).
        </li>
        <li>
          Create <code>5-4-1-ClientGet.tsx</code>,{" "}
          <code>5-4-2-ClientPost.tsx</code>, and{" "}
          <code>5-4-3-ClientCrud.tsx</code>{" "}(<SectionLink to="5.4" />).
        </li>
        <li>
          Create the Server Component{" "}
          <code>5-5-1-ServerFetch.tsx</code>{" "}without{" "}
          <code>&quot;use client&quot;</code>{" "}(<SectionLink to="5.5" />).
        </li>
        <li>
          Create <code>actions.ts</code>{" "}and{" "}
          <code>5-6-1-ServerAction.tsx</code>{" "}as a contrast only (
          <SectionLink to="5.6" />).
        </li>
      </ol>
    </Section>
  );
}
