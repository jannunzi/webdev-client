"use client";

import { useEffect, useMemo, useState } from "react";
import { SECTION_STORAGE_KEY, findSection } from "../data/sections";
import { projectBlurb } from "../data/project";
import type {
  AgendaRow,
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
import AcademicIntegrity from "./AcademicIntegrity";
import AgendaTable from "./AgendaTable";
import AiPolicy from "./AiPolicy";
import AssignmentsBlurb from "./AssignmentsBlurb";
import ClassroomEnvironment from "./ClassroomEnvironment";
import CourseGoals from "./CourseGoals";
import DeadlinesTable from "./DeadlinesTable";
import Disabilities from "./Disabilities";
import Evaluation from "./Evaluation";
import LatePolicy from "./LatePolicy";
import MeetingInfo from "./MeetingInfo";
import OfficeHours from "./OfficeHours";
import ProjectBlurb from "./ProjectBlurb";
import SectionTabs from "./SectionTabs";
import SyllabusHeader from "./SyllabusHeader";
import SyllabusNav from "./SyllabusNav";
import TitleIX from "./TitleIX";

export default function SyllabusView({
  course,
  semester,
  sections,
  defaultSectionId,
  agendasBySection,
  deadlines,
  deadlinesNote,
  courseGoals,
  evaluationItems,
  evaluationNotes,
  gradeBands,
  latePolicy,
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
  agendasBySection: Record<string, AgendaRow[]>;
  deadlines: Deadline[];
  deadlinesNote: string;
  courseGoals: CourseGoal;
  evaluationItems: EvaluationItem[];
  evaluationNotes: string[];
  gradeBands: GradeBand[];
  latePolicy: PolicyBlock;
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
  const [sectionId, setSectionId] = useState(defaultSectionId);

  useEffect(() => {
    const stored = window.localStorage.getItem(SECTION_STORAGE_KEY);
    if (stored && sections.some((section) => section.id === stored)) {
      setSectionId(stored);
    }
  }, [sections]);

  function selectSection(id: string) {
    setSectionId(id);
    window.localStorage.setItem(SECTION_STORAGE_KEY, id);
  }

  const section = useMemo(
    () => findSection(sectionId),
    [sectionId],
  );
  const agendaRows = agendasBySection[section.id] ?? [];

  return (
    <article className="mx-auto max-w-4xl">
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
      <MeetingInfo section={section} semester={semester} />
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
      <AssignmentsBlurb intro={assignmentsIntro} assignments={assignments} />
      <DeadlinesTable deadlines={deadlines} note={deadlinesNote} />
      <ProjectBlurb project={projectBlurb} />
      <AgendaTable section={section} rows={agendaRows} />
      <AiPolicy policy={aiPolicy} />
      <AcademicIntegrity policy={academicIntegrity} />
      <ClassroomEnvironment policy={classroomEnvironment} />
      <TitleIX policy={titleIX} />
      <Disabilities policy={disabilities} />
    </article>
  );
}
