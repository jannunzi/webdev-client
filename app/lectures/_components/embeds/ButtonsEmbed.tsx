import Buttons from "@/app/labs/lab1/forms/Buttons";
import LectureDemoFrame from "./LectureDemoFrame";

export default function ButtonsEmbed() {
  return (
    <LectureDemoFrame label="Buttons.tsx" url="/labs/lab1">
      <form
        className="font-sans text-lg [&_h4]:mt-0"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Buttons />
      </form>
    </LectureDemoFrame>
  );
}
