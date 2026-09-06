import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import PracticeCard from "../../components/PracticeCard";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-5-check" title="Check Your Understanding">
      <p>
        Check Express setup, CORS, axios, and the Next.js calculator. The
        practice quiz draws 10 standalone items. It is not the Canvas grade
        in <SectionLink to="5.7" />.
      </p>
      <PracticeCard quizId="5.lab" />
    </Section>
  );
}
