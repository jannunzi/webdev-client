import LabsIndexDemo from "@/app/labs/lab1/intermediates/1-3-11-LabsIndex";
import LectureDemoFrame from "./LectureDemoFrame";

export default function LabsIndexEmbed() {
  return (
    <LectureDemoFrame label="app/labs/page.tsx" url="/labs">
      <div className="font-sans text-xl [&_h1]:mt-0 [&_a]:underline">
        <LabsIndexDemo />
      </div>
    </LectureDemoFrame>
  );
}
