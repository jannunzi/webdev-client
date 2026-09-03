import type { CourseInfo, SemesterDates } from "./types";

/** Edit term label and calendar bounds here when the semester changes. */
export const semester: SemesterDates = {
  label: "Fall 2026",
  firstDayOfClasses: "2026-09-09",
  lastDayOfClasses: "2026-12-13",
  finalExamPeriod: { start: "2026-12-14", end: "2026-12-20" },
};

export const course: CourseInfo = {
  title: "Web Development",
  credits: 4,
  term: semester.label,
  college: "Khoury College of Computer Sciences",
  bookTitle: "Developing Full Stack Next.js Web Applications",
  instructor: {
    name: "Dr. Jose Annunziato",
    email: "j.annunziato@northeastern.edu",
    role: "Instructor",
  },
};
