import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";

export default function BlogNotFound() {
  return (
    <article className="page-content">
      <CourseInfoHeader title="Post not found" />
      <p>
        That slug is not one of the curated digest posts. Open the blog index
        for the current list.
      </p>
      <p>
        <Link href="/blog">All posts</Link>
      </p>
      <CourseInfoFooter current="/blog" />
    </article>
  );
}
