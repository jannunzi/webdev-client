import TextFields from "@/app/labs/lab1/forms/TextFields";
import LectureDemoFrame from "./LectureDemoFrame";

export default function TextFieldsEmbed() {
  return (
    <LectureDemoFrame label="TextFields.tsx" url="/labs/lab1">
      <form
        className="font-sans text-lg [&_h5]:mt-0"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <TextFields />
      </form>
    </LectureDemoFrame>
  );
}
