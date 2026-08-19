import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import SelfCheck from "../../components/SelfCheck";
import { CH3_LAB_QUESTIONS } from "../../quizzes/ch3-lab";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-3-8" title="3.8 Check Your Understanding">
      <p>
        Before wiring JSON into Kambaz, pause and test what Lab 3
        actually stuck. The quiz below draws 10 items from a bank
        written against this chapter&apos;s exercises —{" "}
        <code>var</code>/<code>let</code>/<code>const</code>,{" "}
        <code>===</code>, ternaries, arrows, <code>map</code>/
        <code>filter</code>/<code>find</code>, spread, destructuring,
        JSON, client vs server, <code>&quot;use client&quot;</code>,
        list keys, <code>reduce</code>, and <code>?.</code>. It is a
        self-check, not part of the Canvas grade in{" "}
        <SectionLink to="3.10" />. Misses link back to the subsection
        you should reread; each new attempt draws a different 10.
      </p>
      <SelfCheck quizId="3.lab" bank={CH3_LAB_QUESTIONS} />
    </Section>
  );
}
