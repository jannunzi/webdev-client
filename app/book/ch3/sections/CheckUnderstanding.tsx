import Section from "../../components/Section";
import PracticeCard from "../../components/PracticeCard";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-3-8" title="3.8 Check Your Understanding">
      <p>
        Pause and test the JavaScript topics from this chapter. The
        practice quiz draws 10 items —{" "}
        <code>var</code>/<code>let</code>/<code>const</code>,{" "}
        <code>===</code>, ternaries, arrows, <code>map</code>/
        <code>filter</code>/<code>find</code>, spread, destructuring,
        JSON, client vs server, <code>&quot;use client&quot;</code>,
        list keys, <code>reduce</code>, and <code>?.</code>. It is a
        self-check, not part of your course grade. Misses link back to the
        subsection you should reread; each new attempt draws a different 10.
      </p>
      <PracticeCard quizId="3.lab" />
    </Section>
  );
}
