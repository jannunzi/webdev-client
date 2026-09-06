import Dropdowns from "@/app/labs/lab1/forms/Dropdowns";
import LectureDemoFrame from "./LectureDemoFrame";

export default function DropdownsEmbed() {
  return (
    <LectureDemoFrame label="Dropdowns.tsx" url="/labs/lab1">
      <form
        className="font-sans text-lg [&_h4]:mt-0"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Dropdowns />
      </form>
    </LectureDemoFrame>
  );
}
