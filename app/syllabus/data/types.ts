/** ISO calendar date, `YYYY-MM-DD`, interpreted in local time (not UTC). */
export type IsoDate = string;

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Instructor = {
  name: string;
  email: string;
  role: string;
};

export type CourseInfo = {
  title: string;
  credits: number;
  term: string;
  college: string;
  bookTitle: string;
  instructor: Instructor;
};

export type SectionLevel = "undergraduate" | "graduate";
export type SectionModality = "in-person" | "online";

export type CourseSection = {
  id: string;
  code: string;
  sectionNumber: string;
  crn: string;
  level: SectionLevel;
  modality: SectionModality;
  campus: string;
  firstClass: IsoDate;
  lastClass: IsoDate;
  /**
   * Placeholder meeting weekdays until Jose confirms the official pattern.
   * JavaScript `Date.getDay()`: 0 Sunday … 6 Saturday.
   */
  daysOfWeek: DayOfWeek[];
  /** Clock time — TBA until Jose fills this in. */
  time: string;
  /** Room or Zoom — leave TBA; do not invent a room. */
  location: string;
  tabLabel: string;
  notes: string[];
};

export type DeadlineKind = "assignment" | "quiz" | "exam" | "project";

export type Deadline = {
  date: IsoDate;
  kind: DeadlineKind;
  label: string;
};

export type SemesterDates = {
  label: string;
  firstDayOfClasses: IsoDate;
  lastDayOfClasses: IsoDate;
  /** Inclusive range for the university final-exam window, if the course uses one. */
  finalExamPeriod: { start: IsoDate; end: IsoDate };
};

export type Holiday = {
  start: IsoDate;
  end: IsoDate;
  label: string;
};

export type LectureTopic = {
  topic: string;
};

export type AgendaKind = "lecture" | "holiday";

export type AgendaRow = {
  date: IsoDate;
  kind: AgendaKind;
  lectureNumber?: number;
  topic: string;
  /** Absolute Canvas dues that happen to fall on this calendar day. */
  deadlines: Deadline[];
};

export type CourseGoal = {
  heading: string;
  paragraphs: string[];
  topics: { name: string; detail: string; href?: string }[];
};

export type EvaluationItem = {
  label: string;
  weight: number;
  description: string;
};

export type GradeBand = {
  letter: string;
  minimum: number;
};

export type PolicyBlock = {
  paragraphs: string[];
  bullets?: string[];
  links?: { label: string; href: string }[];
};

export type AssignmentItem = {
  id: string;
  title: string;
  chapter: string;
  summary: string;
};

export type OfficeHourRow = {
  name: string;
  role: string;
  hours: string;
  location: string;
  contact: string;
};
