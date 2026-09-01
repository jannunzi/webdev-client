import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import SelfCheck from "../../components/SelfCheck";
import { CH1_LAB_QUESTIONS } from "../../quizzes/ch1-lab";

export default function CheckUnderstanding() {
  return (
    <Section
      level={3}
      id="sec-1-3-13"
      title="1.3.13 Check Your Understanding"
    >
      <p>
        Before prototyping Kambaz, pause and test what Lab 1 actually stuck.
        The quiz below draws 10 items from a bank written against this
        chapter&apos;s HTML exercises — App Router{" "}
        <code>page.tsx</code>, headings and paragraphs, lists and tables,
        images, form fields, radio <code>name</code>{" "}groups and mutual
        exclusion, checkbox independence, the two label patterns (
        <code>htmlFor</code>/<code>id</code>{" "}vs wrapping), dropdowns,
        buttons, props and <code>children</code>,{" "}
        <code>Link</code>{" "}vs <code>&lt;a&gt;</code>, and layouts. It is a
        self-check, not part of the Canvas grade in{" "}
        <SectionLink to="1.6" />. Misses link back to the subsection you
        should reread; each new attempt draws a different 10.
      </p>
      <SelfCheck quizId="1.lab" bank={CH1_LAB_QUESTIONS} />
    </Section>
  );
}
