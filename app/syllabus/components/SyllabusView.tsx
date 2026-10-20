"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
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
import SectionTabs from "./SectionTabs";
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

export default function SyllabusView({
  course,
  semester,
  sections,
  defaultSectionId,
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
  // In-session pick (works even if localStorage is blocked).
  const [chosenId, setChosenId] = useState<string | null>(null);
  // Saved pick. Server snapshot is null so SSR and hydration render the first
  // tab; the saved section is applied right after hydration.
  const storedId = useSyncExternalStore(
    subscribeToStoredSection,
    readStoredSection,
    () => null,
  );
  const sectionId =
    chosenId ??
    (storedId ? resolveStoredSectionId(storedId, sections) : defaultSectionId);

  function selectSection(id: string) {
    setChosenId(id);
    try {
      window.localStorage.setItem(SECTION_STORAGE_KEY, id);
    } catch {
      // Storage blocked: selection still works for this visit.
    }
  }

  const section = useMemo(
    () => findSection(sectionId),
    [sectionId],
  );
  const agendaGroups = agendaGroupsBySection[section.id] ?? [];

  return (
    <article className="page-content">
      <SectionTabs
        sections={sections}
        activeId={section.id}
        onSelect={selectSection}
      />
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
