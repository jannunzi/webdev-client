/**
 * Published materials for the CS5500 coming-soon page: a verified CMU 17-313
 * reference, then other CS5500 instructors. Summer 2027 is not open yet.
 */

export type Cs5500Resource = {
  label: string;
  url: string;
  note: string;
};

export type Cs5500ResourceGroup = {
  id: string;
  title: string;
  note?: string;
  links: Cs5500Resource[];
};

export const cs5500ResourceGroups: Cs5500ResourceGroup[] = [
  {
    id: "cmu-17-313",
    title: "Reference course: CMU 17-313 Foundations of Software Engineering",
    note: "Public course site. The class schedule and the lecture slide PDFs are linked from the home page.",
    links: [
      {
        label: "Course site",
        url: "https://cmu-313.github.io/",
        note: "Home page with the class calendar and schedule; lecture slide PDFs are linked from the schedule",
      },
      {
        label: "Course overview",
        url: "https://cmu-313.github.io/overview/",
        note: "Topics beyond writing code: clients, teams, risk, and when software is good enough to ship",
      },
      {
        label: "Syllabus",
        url: "https://cmu-313.github.io/syllabus/",
        note: "In-person lectures and recitations; policies, prerequisites, and teamwork",
      },
      {
        label: "Projects",
        url: "https://cmu-313.github.io/assignments/",
        note: "Six projects, from Hello, opencode! through an open-source excursion",
      },
      {
        label: "Recitations",
        url: "https://cmu-313.github.io/recitations/",
        note: "Recitation pages, including TypeScript, property-based testing, Docker, and CI/CD",
      },
      {
        label: "Hall of Fame",
        url: "https://cmu-313.github.io/hall-of-fame/",
        note: "Student groups and links to their merged open-source pull requests",
      },
    ],
  },
  {
    id: "current-fall-2026",
    title: "Current CS5500 (Fall 2026, Mark Bonicillo, Seattle)",
    links: [
      {
        label: "Syllabus",
        url: "https://github.com/cs5500-neu/admin/blob/main/syllabus.md",
        note: "Project Labs 80%, Quizzes 20%; 12-module schedule; no slides published",
      },
      {
        label: "Course GitHub org",
        url: "https://github.com/cs5500-neu",
        note: "Lab starters",
      },
      {
        label: "todo_api",
        url: "https://github.com/cs5500-neu/todo_api",
        note: "Python/FastAPI lab starter",
      },
      {
        label: "FakesNotMocks",
        url: "https://github.com/cs5500-neu/FakesNotMocks",
        note: "Java testing starter",
      },
      {
        label: "GildedRose-Refactoring-Kata",
        url: "https://github.com/cs5500-neu/GildedRose-Refactoring-Kata",
        note: "Refactoring exercise",
      },
      {
        label: "Student monorepo template",
        url: "https://github.com/cs5500-neu/monorepo-template-main",
        note: "Template for a student monorepo",
      },
    ],
  },
  {
    id: "joint-spring-2021",
    title: "Joint CS4530/CS5500 Spring 2021 (Bell, Boyland, Wand)",
    note: "Full lectures, slides, and assignments. CC BY-SA 4.0.",
    links: [
      {
        label: "Course site",
        url: "https://neu-se.github.io/CS4530-CS5500-Spring-2021/",
        note: "Home page for the joint course",
      },
      {
        label: "Lectures and modules",
        url: "https://neu-se.github.io/CS4530-CS5500-Spring-2021/modules/",
        note: "Videos, PPTX, and PDF",
      },
      {
        label: "Assignments",
        url: "https://neu-se.github.io/CS4530-CS5500-Spring-2021/assignments/",
        note: "HW1-HW4 and the project",
      },
      {
        label: "Project showcase",
        url: "https://neu-se.github.io/CS4530-CS5500-Spring-2021/project-showcase",
        note: "Showcase of course projects",
      },
      {
        label: "Covey.Town",
        url: "https://github.com/neu-se/covey.town",
        note: "Project repository",
      },
    ],
  },
  {
    id: "cs4530-sibling",
    title: "Related undergrad sibling CS4530",
    note: "Living continuation, not CS5500.",
    links: [
      {
        label: "CS4530 Spring 2026",
        url: "https://neu-se.github.io/CS4530-Spring-2026/",
        note: "Fake Stack Overflow project",
      },
      {
        label: "CS4530 Fall 2025",
        url: "https://neu-se.github.io/CS4530-Fall-2025/",
        note: "Undergrad sibling course site",
      },
    ],
  },
  {
    id: "other",
    title: "Other",
    links: [
      {
        label: "Official catalog",
        url: "https://catalog.northeastern.edu/course-descriptions/cs/",
        note: "Northeastern CS course descriptions",
      },
      {
        label: "Historical",
        url: "https://www.khoury.northeastern.edu/home/jewart/cs5500/",
        note: "Fall 2018, John Ewart",
      },
    ],
  },
];

export function cs5500ResourceLinks(
  groups: readonly Cs5500ResourceGroup[] = cs5500ResourceGroups,
): Cs5500Resource[] {
  return groups.flatMap((group) => group.links);
}
