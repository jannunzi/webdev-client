import Tables from "@/app/labs/lab1/Tables";
import LectureDemoFrame from "./LectureDemoFrame";

export default function TablesEmbed() {
  return (
    <LectureDemoFrame label="Tables.tsx" url="/labs/lab1">
      <div className="font-sans text-lg [&_h4]:mt-0 [&_table]:text-base">
        <Tables />
      </div>
    </LectureDemoFrame>
  );
}
