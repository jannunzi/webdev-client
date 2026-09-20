import { notFound, redirect } from "next/navigation";
import { getExamBank } from "@/lib/quiz-exam/banks";
import { staffAttemptsHref } from "@/lib/quiz-exam/staff";

type PageProps = {
  params: Promise<{ quizId: string }>;
};

export default async function StaffQuizRedirectPage({ params }: PageProps) {
  const { quizId } = await params;
  if (!getExamBank(quizId)) notFound();
  redirect(staffAttemptsHref(quizId));
}
