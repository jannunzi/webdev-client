import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import {
  course,
  officeHourColumns,
  officeHourRows,
  officeHoursPlaceholder,
} from "@/app/syllabus/data";

const instructorRow = {
  name: course.instructor.name,
  role: course.instructor.role,
  hours: "TBA",
  location: "TBA",
  contact: course.instructor.email,
};

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
        <p>
          Office hours and location for the instructor are TBA. Do not assume a
          Zoom link or room number until they appear in this table.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="schedule" title="Schedule">
        <p>{officeHoursPlaceholder}</p>
        <p>
          Hours will be posted when teaching assistants are assigned. Check this
          page and the{" "}
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
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">{instructorRow.name}</td>
                <td className="px-3 py-2">{instructorRow.role}</td>
                <td className="px-3 py-2">{instructorRow.hours}</td>
                <td className="px-3 py-2">{instructorRow.location}</td>
                <td className="px-3 py-2">
                  <a href={`mailto:${instructorRow.contact}`}>
                    {instructorRow.contact}
                  </a>
                </td>
              </tr>
              {officeHourRows.length === 0 ? (
                <tr className="border-b border-neutral-200">
                  <td
                    className="px-3 py-3 text-neutral-500 italic"
                    colSpan={officeHourColumns.length}
                  >
                    Teaching assistants — TBA
                  </td>
                </tr>
              ) : (
                officeHourRows.map((row) => (
                  <tr key={row.name} className="border-b border-neutral-200">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.role}</td>
                    <td className="px-3 py-2">{row.hours}</td>
                    <td className="px-3 py-2">{row.location}</td>
                    <td className="px-3 py-2">{row.contact}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CourseInfoSection>

      <CourseInfoFooter current="/office-hours" />
    </article>
  );
}
