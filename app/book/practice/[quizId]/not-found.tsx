import Link from "next/link";

export default function PracticeNotFound() {
  return (
    <article className="book-content">
      <h1 className="mt-0 font-sans text-3xl font-semibold">
        Practice quiz not found
      </h1>
      <p>
        That practice quiz id is not in the course bank. Check the link from
        the chapter, or pick a quiz from the practice list.
      </p>
      <p>
        <Link href="/book/practice">All practice quizzes</Link>
        {" · "}
        <Link href="/book">Book home</Link>
      </p>
    </article>
  );
}
