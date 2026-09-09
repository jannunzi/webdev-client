import {
  academicIntegrity,
  agendaGroupsBySection,
  aiPolicy,
  assignments,
  assignmentsIntro,
  classroomEnvironment,
  course,
  courseGoals,
  deadlines,
  deadlinesNote,
  defaultSectionId,
  disabilities,
  evaluationItems,
  evaluationNotes,
  gradeBands,
  latePolicy,
  officeHourColumns,
  officeHourRows,
  officeHoursPlaceholder,
  sections,
  semester,
  titleIX,
} from "./data";
import SyllabusView from "./components/SyllabusView";

export default function SyllabusPage() {
  return (
    <SyllabusView
      course={course}
      semester={semester}
      sections={sections}
      defaultSectionId={defaultSectionId}
      agendaGroupsBySection={agendaGroupsBySection}
      deadlines={deadlines}
      deadlinesNote={deadlinesNote}
      courseGoals={courseGoals}
      evaluationItems={evaluationItems}
      evaluationNotes={evaluationNotes}
      gradeBands={gradeBands}
      latePolicy={latePolicy}
      assignmentsIntro={assignmentsIntro}
      assignments={assignments}
      officeHourRows={officeHourRows}
      officeHourColumns={officeHourColumns}
      officeHoursPlaceholder={officeHoursPlaceholder}
      aiPolicy={aiPolicy}
      academicIntegrity={academicIntegrity}
      classroomEnvironment={classroomEnvironment}
      titleIX={titleIX}
      disabilities={disabilities}
    />
  );
}
