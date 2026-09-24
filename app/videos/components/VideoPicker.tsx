import type { VideoCourseOption } from "@/lib/videos/courses";

export default function VideoPicker({
  course,
  semester,
  section,
  courses,
  semesters,
  sections,
}: {
  course: string;
  semester: string;
  section: string;
  courses: VideoCourseOption[];
  semesters: string[];
  sections: { id: string; label: string; group: string }[];
}) {
  const courseOptions = courses.some((option) => option.id === course)
    ? courses
    : [{ id: course, label: course }, ...courses];
  const semesterOptions = semesters.includes(semester)
    ? semesters
    : [semester, ...semesters];
  const sectionOptions = sections.some((option) => option.id === section)
    ? sections
    : [{ id: section, label: section, group: "Selected" }, ...sections];
  const groups: { name: string; options: typeof sectionOptions }[] = [];
  for (const option of sectionOptions) {
    const existing = groups.find((group) => group.name === option.group);
    if (existing) existing.options.push(option);
    else groups.push({ name: option.group, options: [option] });
  }

  return (
    <form action="/videos" method="get" className="flex flex-wrap items-end gap-3">
      <label className="min-w-[14rem] flex-1 font-sans text-sm font-semibold">
        Your section
        <select
          name="course"
          defaultValue={course}
          className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
        >
          {courseOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="min-w-[8rem] font-sans text-sm font-semibold">
        Semester
        <select
          name="semester"
          defaultValue={semester}
          className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
        >
          {semesterOptions.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </label>
      <label className="min-w-[14rem] flex-1 font-sans text-sm font-semibold">
        Book section
        <select
          name="section"
          defaultValue={section}
          className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
        >
          {groups.map((group) => (
            <optgroup key={group.name} label={group.name}>
              {group.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm hover:bg-neutral-50"
      >
        Show clip
      </button>
    </form>
  );
}
