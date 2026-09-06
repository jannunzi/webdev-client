import OtherFieldTypes from "@/app/labs/lab1/forms/OtherFieldTypes";
import LectureDemoFrame from "./LectureDemoFrame";

export default function TypedFieldsEmbed() {
  return (
    <LectureDemoFrame label="OtherFieldTypes.tsx" url="/labs/lab1">
      <form
        className="font-sans text-lg [&_h4]:mt-0"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <OtherFieldTypes />
      </form>
    </LectureDemoFrame>
  );
}
