import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import SelfCheck from "../../components/SelfCheck";
import { CH4_LAB_QUESTIONS } from "../../quizzes/ch4-lab";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-4-9" title="4.9 Check Your Understanding">
      <p>
        Before wiring Zustand into Kambaz, pause and test what Lab 4
        actually stuck. The quiz below draws 10 items from a bank written
        against this chapter&apos;s exercises —{" "}
        <code>&quot;use client&quot;</code>, event wrappers,{" "}
        <code>useState</code>, controlled <code>value</code>/
        <code>onChange</code>, spreading objects and arrays, moving state
        to a parent vs drilling props, query vs path parameters, when Context is the wrong
        store, Zustand selectors, Redux <code>dispatch</code>, and{" "}
        <code>useEffect</code>{" "}dependencies. It is a self-check, not part
        of the Canvas grade in <SectionLink to="4.12" />. Misses link back
        to the subsection you should reread; each new attempt draws a
        different 10.
      </p>
      <SelfCheck quizId="4.lab" bank={CH4_LAB_QUESTIONS} />
    </Section>
  );
}
