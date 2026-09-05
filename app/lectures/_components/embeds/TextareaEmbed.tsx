import Textarea from "@/app/labs/lab1/forms/Textarea";
import LectureDemoFrame from "./LectureDemoFrame";

export default function TextareaEmbed() {
  return (
    <LectureDemoFrame label="Textarea.tsx" url="/labs/lab1">
      <form
        className="font-sans text-lg [&_h5]:mt-0"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Textarea />
      </form>
    </LectureDemoFrame>
  );
}
