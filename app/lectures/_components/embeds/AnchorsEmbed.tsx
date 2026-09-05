import AnchorTag from "@/app/labs/lab1/AnchorTag";
import LectureDemoFrame from "./LectureDemoFrame";

export default function AnchorsEmbed() {
  return (
    <LectureDemoFrame label="AnchorTag.tsx" url="/labs/lab1">
      <div className="font-sans text-xl [&_h4]:mt-0 [&_a]:underline">
        <AnchorTag />
      </div>
    </LectureDemoFrame>
  );
}
