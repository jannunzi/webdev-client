import LectureDemoFrame from "./LectureDemoFrame";

export default function HtmlSkeletonEmbed() {
  return (
    <LectureDemoFrame label="hello.html">
      <div className="font-sans">
        <p className="mt-0 mb-2 font-mono text-sm text-neutral-500">
          Document title in the tab: Hello
        </p>
        <h1 className="mt-0 mb-0 text-4xl font-semibold">Hello</h1>
      </div>
    </LectureDemoFrame>
  );
}
