import Link from "next/link";
import StatusPanel from "../../components/StatusPanel";

export type ComingSoonExamProps = {
  examId: "x1" | "x2";
  title: string;
  unlockLabel: string;
  dueLabel: string;
};

export default function ComingSoonExam({
  examId,
  title,
  unlockLabel,
  dueLabel,
}: ComingSoonExamProps) {
  return (
    <article>
      <p className="mb-4 text-sm">
        <Link href="/quizzes/take">Graded quizzes</Link>
        {" · "}
        <Link href="/syllabus">Syllabus</Link>
        {" · "}
        <Link href="/book">Book</Link>
        {" · "}
        <Link href="/lectures">Lectures</Link>
      </p>
      <h1 className="mt-0 text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-4">
        <StatusPanel title={`${title} is coming soon`} tone="warn">
          <p>
            This Canvas-linked exam ({examId.toUpperCase()}) is not open for
            attempts yet. The take page will use this same URL.
          </p>
          <p>
            Unlock {unlockLabel}. Due {dueLabel}.
          </p>
          <p>
            The Canvas grade shell is 100 points. The website will score as a
            percent and export to Canvas out of 100.
          </p>
        </StatusPanel>
      </div>
    </article>
  );
}
