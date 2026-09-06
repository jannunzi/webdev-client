import RadioButtons from "@/app/labs/lab1/forms/RadioButtons";
import LectureDemoFrame from "./LectureDemoFrame";

export default function RadioButtonsEmbed() {
  return (
    <LectureDemoFrame label="RadioButtons.tsx" url="/labs/lab1">
      <form
        className="font-sans text-lg [&_h5]:mt-0"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <RadioButtons />
      </form>
    </LectureDemoFrame>
  );
}
