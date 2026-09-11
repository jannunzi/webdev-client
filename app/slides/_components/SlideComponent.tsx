import type { SlideComponentId } from "@/lib/lectures/component-registry";
import { isLectureEmbedComponentId } from "@/lib/lectures/component-registry";
import AccountScreensDemo from "@/app/book/ch1/embeds/AccountScreensDemo";
import AssignmentEditorDemo from "@/app/book/ch1/embeds/AssignmentEditorDemo";
import AssignmentsDemo from "@/app/book/ch1/embeds/AssignmentsDemo";
import DashboardDemo from "@/app/book/ch1/embeds/DashboardDemo";
import DemoProfile from "@/app/book/ch1/embeds/DemoProfile";
import DemoSignin from "@/app/book/ch1/embeds/DemoSignin";
import DemoSignup from "@/app/book/ch1/embeds/DemoSignup";
import HomeDemo from "@/app/book/ch1/embeds/HomeDemo";
import ModulesDemo from "@/app/book/ch1/embeds/ModulesDemo";
import PlainCourseNavigation from "@/app/book/ch1/embeds/PlainCourseNavigation";
import PlainKambazNavigation from "@/app/book/ch1/embeds/PlainKambazNavigation";
import LectureDemoFrame from "./embeds/LectureDemoFrame";
import LectureEmbed from "./embeds/LectureEmbed";

export default function SlideComponent({ id }: { id: SlideComponentId }) {
  if (isLectureEmbedComponentId(id)) {
    return <LectureEmbed id={id} />;
  }
  switch (id) {
    case "ch1-home":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/HomeDemo.tsx">
          <HomeDemo />
        </LectureDemoFrame>
      );
    case "ch1-signin":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/DemoSignin.tsx">
          <DemoSignin />
        </LectureDemoFrame>
      );
    case "ch1-signup":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/DemoSignup.tsx">
          <DemoSignup />
        </LectureDemoFrame>
      );
    case "ch1-profile":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/DemoProfile.tsx">
          <DemoProfile />
        </LectureDemoFrame>
      );
    case "ch1-dashboard":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/DashboardDemo.tsx">
          <DashboardDemo />
        </LectureDemoFrame>
      );
    case "ch1-modules":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/ModulesDemo.tsx">
          <ModulesDemo />
        </LectureDemoFrame>
      );
    case "ch1-assignments":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/AssignmentsDemo.tsx">
          <AssignmentsDemo />
        </LectureDemoFrame>
      );
    case "ch1-assignment-editor":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/AssignmentEditorDemo.tsx">
          <AssignmentEditorDemo />
        </LectureDemoFrame>
      );
    case "ch1-account-screens":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/AccountScreensDemo.tsx">
          <AccountScreensDemo />
        </LectureDemoFrame>
      );
    case "ch1-plain-kambaz-nav":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/PlainKambazNavigation.tsx">
          <PlainKambazNavigation />
        </LectureDemoFrame>
      );
    case "ch1-plain-course-nav":
      return (
        <LectureDemoFrame label="app/book/ch1/embeds/PlainCourseNavigation.tsx">
          <PlainCourseNavigation />
        </LectureDemoFrame>
      );
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
