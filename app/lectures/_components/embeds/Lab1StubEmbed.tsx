import Lab1Starter from "@/app/labs/lab1/intermediates/1-2-4-Lab1Starter";
import LectureDemoFrame from "./LectureDemoFrame";

export default function Lab1StubEmbed() {
  return (
    <LectureDemoFrame label="app/labs/lab1/page.tsx" url="/labs/lab1">
      <div className="font-sans text-3xl [&_h2]:mt-0 [&_h2]:mb-0">
        <Lab1Starter />
      </div>
    </LectureDemoFrame>
  );
}
