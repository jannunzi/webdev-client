import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";

const PIAZZA_COLUMNS = ["Day", "Time ET", "Who"] as const;

export default function PiazzaHoursPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Piazza Hours"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            All times are America/New_York (Eastern Time).
          </p>
        }
      />

      <CourseInfoSection id="about" title="What Piazza hours are">
        <p>
          Piazza is the course question-and-answer forum. Use it for homework,
          labs, the book, and the project — not for grade disputes or private
          academic-integrity matters, which belong in email to the instructor.
        </p>
        <p>
          <strong>Piazza hours</strong> are the windows when course staff
          actively monitor the forum and aim to reply. Those windows are TBA
          until teaching assistants are assigned. Students may post at any time;
          a same-day reply is more likely during posted hours.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="schedule" title="Staff monitoring schedule">
        <p>
          The schedule below is a placeholder. Hours will be posted here when
          staff are assigned. Until then every cell is TBA — no Zoom rooms or
          names are implied.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
                {PIAZZA_COLUMNS.map((column) => (
                  <th key={column} className="px-3 py-2 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-200">
                {PIAZZA_COLUMNS.map((column) => (
                  <td
                    key={column}
                    className="px-3 py-3 text-neutral-500 italic"
                  >
                    TBA
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CourseInfoSection>

      <CourseInfoSection id="how-to-post" title="How to post a useful question">
        <p>
          A short, specific post is easier to answer than a screenshot with no
          context. Include:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>The route or screen (for example <code>/courses/1234/modules</code>).</li>
          <li>The exact error message or unexpected behavior.</li>
          <li>What you already tried, and which assignment or chapter you are on.</li>
        </ul>
        <p>
          Search existing threads before opening a new one. If you solve your
          own question, post the fix so others can learn from it.
        </p>
      </CourseInfoSection>

      <CourseInfoFooter current="/piazza-hours" />
    </article>
  );
}
