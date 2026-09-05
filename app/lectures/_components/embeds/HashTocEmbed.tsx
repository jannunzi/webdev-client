import AnchorHrefPatterns from "@/app/labs/lab1/intermediates/1-3-10b-AnchorHrefPatterns";
import LectureDemoFrame from "./LectureDemoFrame";

export default function HashTocEmbed() {
  return (
    <LectureDemoFrame label="Hash fragment TOC">
      <div className="max-h-64 overflow-auto font-sans text-lg [&_a]:underline">
        <AnchorHrefPatterns />
      </div>
    </LectureDemoFrame>
  );
}
