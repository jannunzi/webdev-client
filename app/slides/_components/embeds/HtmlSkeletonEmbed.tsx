import LectureDemoFrame from "./LectureDemoFrame";

export default function HtmlSkeletonEmbed() {
  return (
    <LectureDemoFrame label="hello.html">
      <div className="font-sans">
        <p className="mt-0 mb-2 font-mono text-sm text-neutral-500">
          Document title in the tab: This is the Page Title
        </p>
        <p className="mt-0 mb-0 text-4xl">Hello World!</p>
      </div>
    </LectureDemoFrame>
  );
}
