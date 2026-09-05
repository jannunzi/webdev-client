import Checkboxes from "@/app/labs/lab1/forms/Checkboxes";
import LectureDemoFrame from "./LectureDemoFrame";

export default function CheckboxesEmbed() {
  return (
    <LectureDemoFrame label="Checkboxes.tsx" url="/labs/lab1">
      <form
        className="font-sans text-lg [&_h5]:mt-0"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Checkboxes />
      </form>
    </LectureDemoFrame>
  );
}
