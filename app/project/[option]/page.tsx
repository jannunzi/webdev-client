import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import ProjectDocBody from "../components/ProjectDocBody";
import ProjectOptionNav from "../components/ProjectOptionNav";
import { getProjectDoc, isProjectDocSlug, PROJECT_DOC_SLUGS } from "../docs";

type PageProps = {
  params: Promise<{ option: string }>;
};

export function generateStaticParams() {
  return PROJECT_DOC_SLUGS.map((option) => ({ option }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { option } = await params;
  const doc = getProjectDoc(option);
  if (!doc) {
    return { title: "Final Project" };
  }
  return {
    title: `${doc.title} — Final Project`,
    description: doc.description,
  };
}

export default async function ProjectOptionPage({ params }: PageProps) {
  const { option } = await params;
  if (!isProjectDocSlug(option)) notFound();
  const doc = getProjectDoc(option);
  if (!doc) notFound();

  return (
    <article className="page-content">
      <p className="mb-4 font-sans text-sm">
        <Link href="/project">← Final Project</Link>
      </p>
      <CourseInfoHeader
        title={doc.title}
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">{doc.subtitle}</p>
        }
      />
      <ProjectOptionNav current={doc.slug} />
      <ProjectDocBody blocks={doc.blocks} />
      <p className="mt-10 font-sans text-sm text-neutral-500">
        Ported from the former course Google Doc so staff can edit these
        requirements on the site.
      </p>
      <CourseInfoFooter current="/project" />
    </article>
  );
}
