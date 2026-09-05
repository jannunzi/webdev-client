import HeadingTags from "@/app/labs/lab1/HeadingTags";
import LectureDemoFrame from "./LectureDemoFrame";

export default function HeadingTagsEmbed() {
  return (
    <LectureDemoFrame label="HeadingTags.tsx" url="/labs/lab1">
      <div className="font-sans text-xl [&_h4]:mt-0">
        <HeadingTags />
      </div>
    </LectureDemoFrame>
  );
}
