import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import PracticeCard from "../../components/PracticeCard";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-5-check" title="Check Your Understanding">
      <p>
        Before wiring Kambaz in <SectionLink to="5.4" />, check what
        stuck from Express setup, Lab 5, CORS, axios, and the Next.js
        calculator. The practice quiz draws 10 items. It is not the Canvas
        grade in <SectionLink to="5.7" />.
      </p>
      <PracticeCard quizId="5.lab" />
    </Section>
  );
}
