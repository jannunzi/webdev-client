import Link from "next/link";

export default function LectureHubNav({
  current,
}: {
  current?: "index" | "deck";
}) {
  return (
    <p className="mb-3 font-sans text-sm">
      {current === "deck" ? (
        <>
          <Link href="/lectures">Lectures</Link>
          {" · "}
        </>
      ) : null}
      <Link href="/syllabus">Syllabus</Link>
      {" · "}
      <Link href="/book">Course book</Link>
      {" · "}
      <Link href="/book/ch1">Chapter 1</Link>
      {" · "}
      <Link href="/assignments">Assignments</Link>
    </p>
  );
}
