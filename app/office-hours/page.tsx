import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import {
  course,
  formatInstructorOfficeHours,
  formatInstructorOfficeLocation,
  instructorOfficeBlocks,
  instructorOfficeHourRows,
  officeHourColumns,
  officeHourRows,
  officeHoursPlaceholder,
} from "@/app/syllabus/data";

const instructorRows = instructorOfficeHourRows(course.instructor);

export default function OfficeHoursPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Office Hours"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            All times are America/New_York (Eastern Time).
          </p>
        }
      />

      <CourseInfoSection id="instructor" title="Instructor">
        <p>
          {course.instructor.name}
          {" · "}
          <a href={`mailto:${course.instructor.email}`}>
            {course.instructor.email}
          </a>
        </p>
        <ul className="list-disc space-y-1 pl-6">
          {instructorOfficeBlocks.map((block) => {
            const hours = formatInstructorOfficeHours(block);
            const location = formatInstructorOfficeLocation(block);
            const sentence = (text: string) =>
              text.endsWith(".") ? text : `${text}.`;
            return (
              <li key={block.id}>
                {sentence(hours)} {sentence(location)}
              </li>
            );
          })}
        </ul>
      </CourseInfoSection>

      <CourseInfoSection id="schedule" title="Schedule">
        <p>{officeHoursPlaceholder}</p>
        <p>
          Check this page and the{" "}
          <Link href="/syllabus#office-hours">syllabus office-hours section</Link>{" "}
          for updates.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
                {officeHourColumns.map((column) => (
                  <th key={column} className="px-3 py-2 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instructorRows.map((row) => (
                <tr key={row.hours} className="border-b border-neutral-200">
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.role}</td>
                  <td className="px-3 py-2">{row.hours}</td>
                  <td className="px-3 py-2">{row.location}</td>
                  <td className="px-3 py-2">
                    <a href={`mailto:${row.contact}`}>{row.contact}</a>
                  </td>
                </tr>
              ))}
              {officeHourRows.map((row) => (
                <tr key={row.name} className="border-b border-neutral-200">
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.role}</td>
                  <td className="px-3 py-2">{row.hours}</td>
                  <td className="px-3 py-2">{row.location}</td>
                  <td className="px-3 py-2">
                    {row.contact.includes("@") ? (
                      <a href={`mailto:${row.contact}`}>{row.contact}</a>
                    ) : (
                      row.contact
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CourseInfoSection>

      <CourseInfoFooter current="/office-hours" />
    </article>
  );
}
