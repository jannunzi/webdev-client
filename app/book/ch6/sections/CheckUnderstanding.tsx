import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import PracticeCard from "../../components/PracticeCard";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-6-check" title="Check Your Understanding">
      <p>
        Before migrating every Kambaz collection in{" "}
        <SectionLink to="6.4" />, check schemas, models, DAOs,{" "}
        <code>async</code> routes, predicates, and Atlas. The practice
        quiz draws 10 items. It is not the Canvas grade in{" "}
        <SectionLink to="6.5" />.
      </p>
      <PracticeCard quizId="6.lab" />
    </Section>
  );
}
