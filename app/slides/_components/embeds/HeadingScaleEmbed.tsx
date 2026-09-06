import LectureDemoFrame from "./LectureDemoFrame";

export default function HeadingScaleEmbed() {
  return (
    <LectureDemoFrame label="h1–h6">
      <div className="font-sans [&_h1]:mt-0">
        <h1>Labs</h1>
        <h2>Lab 1</h2>
        <h3>HTML Examples</h3>
        <h4>Heading Tags</h4>
        <h5>A subsection</h5>
        <h6>A smaller note</h6>
      </div>
    </LectureDemoFrame>
  );
}
