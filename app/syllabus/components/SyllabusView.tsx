"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import CourseBreadcrumb from "@/app/courses/CourseBreadcrumb";
import { legacySectionPath, sectionIdFromLegacyTab } from "@/lib/courses/offerings";
import {
  SECTION_STORAGE_KEY,
  findSection,
  resolveStoredSectionId,
} from "../data/sections";
import { projectBlurb } from "../data/project";
import type {
  AgendaGroup,
  AssignmentItem,
  CourseGoal,
  CourseInfo,
  CourseSection,
  Deadline,
  EvaluationItem,
  GradeBand,
  OfficeHourRow,
  PolicyBlock,
  SemesterDates,
} from "../data/types";
import AcademicCalendar from "./AcademicCalendar";
import AcademicIntegrity from "./AcademicIntegrity";
import AgendaTable from "./AgendaTable";
import AiPolicy from "./AiPolicy";
import AssignmentsBlurb from "./AssignmentsBlurb";
import ClassroomEnvironment from "./ClassroomEnvironment";
import CourseGoals from "./CourseGoals";
import CourseWebsiteAccounts from "./CourseWebsiteAccounts";
import DeadlinesTable from "./DeadlinesTable";
import Disabilities from "./Disabilities";
import Evaluation from "./Evaluation";
import HowToUseTheBook from "./HowToUseTheBook";
import LatePolicy from "./LatePolicy";
import MeetingInfo from "./MeetingInfo";
import OfficeHours from "./OfficeHours";
import ProjectBlurb from "./ProjectBlurb";
import RegradePolicy from "./RegradePolicy";
import SyllabusHeader from "./SyllabusHeader";
import SyllabusNav from "./SyllabusNav";
import TitleIX from "./TitleIX";

function readStoredSection(): string | null {
  try {
    return window.localStorage.getItem(SECTION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribeToStoredSection(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function sectionCrumb(section: { code: string; sectionNumber: string }): string {
  return `${section.code.replace(/\s+/g, "")}-${section.sectionNumber}`;
}

export default function SyllabusView({
  course,
  semester,
  sections,
  defaultSectionId,
  lockedSectionId,
  agendaGroupsBySection,
  deadlines,
  deadlinesNote,
  courseGoals,
  evaluationItems,
  evaluationNotes,
  gradeBands,
  latePolicy,
  regradePolicy,
  assignmentsIntro,
  assignments,
  officeHourRows,
  officeHourColumns,
  officeHoursPlaceholder,
  aiPolicy,
  academicIntegrity,
  classroomEnvironment,
  titleIX,
  disabilities,
}: {
  course: CourseInfo;
  semester: SemesterDates;
  sections: CourseSection[];
  defaultSectionId: string;
  /** Section chosen from its own URL. Omit on `/syllabus`, which keeps the saved pick. */
  lockedSectionId?: string;
  agendaGroupsBySection: Record<string, AgendaGroup[]>;
  deadlines: Deadline[];
  deadlinesNote: string;
  courseGoals: CourseGoal;
  evaluationItems: EvaluationItem[];
  evaluationNotes: string[];
  gradeBands: GradeBand[];
  latePolicy: PolicyBlock;
  regradePolicy: PolicyBlock;
  assignmentsIntro: string[];
  assignments: AssignmentItem[];
  officeHourRows: OfficeHourRow[];
  officeHourColumns: readonly string[];
  officeHoursPlaceholder: string;
  aiPolicy: PolicyBlock;
  academicIntegrity: PolicyBlock;
  classroomEnvironment: PolicyBlock;
  titleIX: PolicyBlock;
  disabilities: PolicyBlock;
}) {
  // Saved pick. Server snapshot is null so SSR and hydration render the
  // default section; the saved section is applied right after hydration.
  const storedId = useSyncExternalStore(
    subscribeToStoredSection,
    readStoredSection,
    () => null,
  );
  const sectionId =
    lockedSectionId ??
    (storedId ? resolveStoredSectionId(storedId, sections) : defaultSectionId);
  const router = useRouter();

  useEffect(() => {
    const fromHash = sectionIdFromLegacyTab(window.location.hash);
    const hashPath = fromHash ? legacySectionPath(fromHash) : undefined;
    if (hashPath && hashPath !== window.location.pathname) {
      router.replace(hashPath);
      return;
    }
    if (!lockedSectionId) return;
    try {
      window.localStorage.setItem(SECTION_STORAGE_KEY, lockedSectionId);
    } catch {
      // Storage blocked: this visit still shows the section from the URL.
    }
  }, [lockedSectionId, router]);

  const section = useMemo(
    () => findSection(sectionId),
    [sectionId],
  );
  const agendaGroups = agendaGroupsBySection[section.id] ?? [];

  return (
    <article className="page-content">
      <CourseBreadcrumb current={sectionCrumb(section)} />
      <SyllabusHeader course={course} section={section} />
      <div className="mt-6">
        <SyllabusNav />
      </div>
      <CourseGoals goals={courseGoals} />
      <HowToUseTheBook />
      <CourseWebsiteAccounts />
      <MeetingInfo section={section} semester={semester} />
      <AcademicCalendar />
      <OfficeHours
        rows={officeHourRows}
        columns={officeHourColumns}
        placeholder={officeHoursPlaceholder}
      />
      <Evaluation
        items={evaluationItems}
        bands={gradeBands}
        notes={evaluationNotes}
      />
      <LatePolicy policy={latePolicy} />
      <RegradePolicy policy={regradePolicy} />
      <AssignmentsBlurb intro={assignmentsIntro} assignments={assignments} />
      <DeadlinesTable deadlines={deadlines} note={deadlinesNote} />
      <ProjectBlurb project={projectBlurb} />
      <AgendaTable section={section} groups={agendaGroups} />
      <AiPolicy policy={aiPolicy} />
      <AcademicIntegrity policy={academicIntegrity} />
      <ClassroomEnvironment policy={classroomEnvironment} />
      <TitleIX policy={titleIX} />
      <Disabilities policy={disabilities} />
    </article>
  );
}
