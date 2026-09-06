import Section from "../../components/Section";
import PracticeCard from "../../components/PracticeCard";

export default function CheckUnderstanding() {
  return (
    <Section id="sec-5-check" title="Check Your Understanding">
      <p>
        Check Express setup, CORS, axios, and the Next.js calculator. The
        practice quiz draws 10 items. It is not part of your course grade.
      </p>
      <PracticeCard quizId="5.lab" />
    </Section>
  );
}
