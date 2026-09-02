import {
  academicIntegrity,
  agenda,
  aiPolicy,
  assignments,
  assignmentsIntro,
  classroomEnvironment,
  course,
  courseGoals,
  disabilities,
  evaluationItems,
  evaluationNotes,
  gradeBands,
  latePolicy,
  meetings,
  officeHourColumns,
  officeHourRows,
  officeHoursPlaceholder,
  projectBlurb,
  semester,
  titleIX,
} from "./data";
import AcademicIntegrity from "./components/AcademicIntegrity";
import AgendaTable from "./components/AgendaTable";
import AiPolicy from "./components/AiPolicy";
import AssignmentsBlurb from "./components/AssignmentsBlurb";
import ClassroomEnvironment from "./components/ClassroomEnvironment";
import CourseGoals from "./components/CourseGoals";
import Disabilities from "./components/Disabilities";
import Evaluation from "./components/Evaluation";
import LatePolicy from "./components/LatePolicy";
import MeetingInfo from "./components/MeetingInfo";
import OfficeHours from "./components/OfficeHours";
import ProjectBlurb from "./components/ProjectBlurb";
import SyllabusHeader from "./components/SyllabusHeader";
import SyllabusNav from "./components/SyllabusNav";
import TitleIX from "./components/TitleIX";

export default function SyllabusPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <SyllabusHeader course={course} semester={semester} />
      <SyllabusNav />
      <CourseGoals goals={courseGoals} />
      <MeetingInfo meetings={meetings} semester={semester} />
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
      <ProjectBlurb project={projectBlurb} />
      <AgendaTable rows={agenda} />
      <AiPolicy policy={aiPolicy} />
      <AcademicIntegrity policy={academicIntegrity} />
      <ClassroomEnvironment policy={classroomEnvironment} />
      <TitleIX policy={titleIX} />
      <Disabilities policy={disabilities} />
    </article>
  );
}
