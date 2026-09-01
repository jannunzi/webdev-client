import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import SelfCheck from "../../components/SelfCheck";
import { CH5_LAB_QUESTIONS } from "../../quizzes/ch5-lab";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-5-8" title="5.8 Check Your Understanding">
      <p>
        Before wiring HTTP into Kambaz, pause and test what Lab 5
        actually stuck. The quiz below draws 10 items from a bank
        written against this chapter&apos;s exercises — HTTP methods,
        status codes, REST resources, Route Handler file names,{" "}
        <code>await params</code>, <code>searchParams</code>,{" "}
        <code>fetch</code>{" "}bodies, client vs server loading, and
        Server Actions versus Route Handlers. It is a self-check, not
        part of the Canvas grade in <SectionLink to="5.10" />. Misses
        link back to the subsection you should reread; each new
        attempt draws a different 10.
      </p>
      <SelfCheck quizId="5.lab" bank={CH5_LAB_QUESTIONS} />
    </Section>
  );
}
