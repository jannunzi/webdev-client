import { notFound } from "next/navigation";
import Cs5500BookPage from "@/app/cs5500/book/page";
import { FOUNDATIONS_SUBJECT, isTermSlug } from "@/lib/courses/routes";

export default async function SubjectBookPage({
  params,
}: {
  params: Promise<{ year: string; term: string; subject: string }>;
}) {
  const { year, term, subject } = await params;
  if (
    !isTermSlug(term) ||
    subject !== FOUNDATIONS_SUBJECT ||
    year !== "2027" ||
    term !== "summer"
  ) {
    notFound();
  }
  return <Cs5500BookPage />;
}
