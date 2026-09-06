import Section from "../../components/Section";
import PracticeCard from "../../components/PracticeCard";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-6-check" title="Check Your Understanding">
      <p>
        Check schemas, models, DAOs, <code>async</code> routes,
        predicates, and Atlas. The practice quiz draws 10 items. It is
        not part of your course grade.
      </p>
      <PracticeCard quizId="6.lab" />
    </Section>
  );
}
