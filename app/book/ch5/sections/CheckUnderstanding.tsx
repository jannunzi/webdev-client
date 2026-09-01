import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import SelfCheck from "../../components/SelfCheck";
import { CH5_LAB_QUESTIONS } from "../../quizzes/ch5-lab";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-5-check" title="Check Your Understanding">
      <p>
        Before wiring Kambaz in <SectionLink to="5.4" />, check what
        stuck from Express setup, Lab 5, CORS, axios, and the Next.js
        calculator. The quiz draws 10 items. It is not the Canvas grade
        in <SectionLink to="5.7" />.
      </p>
      <SelfCheck quizId="5.lab" bank={CH5_LAB_QUESTIONS} />
    </Section>
  );
}
