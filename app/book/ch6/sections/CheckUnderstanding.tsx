import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import SelfCheck from "../../components/SelfCheck";
import { CH6_LAB_QUESTIONS } from "../../quizzes/ch6-lab";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-6-check" title="Check Your Understanding">
      <p>
        Before migrating every Kambaz collection in{" "}
        <SectionLink to="6.4" />, check schemas, models, DAOs,{" "}
        <code>async</code> routes, predicates, and Atlas. The quiz
        draws 10 items. It is not the Canvas grade in{" "}
        <SectionLink to="6.5" />.
      </p>
      <SelfCheck quizId="6.lab" bank={CH6_LAB_QUESTIONS} />
    </Section>
  );
}
